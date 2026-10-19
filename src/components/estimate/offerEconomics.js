/**
 * Økonomien i tilbudet: strømkostnadene med og uten solceller.
 *
 * Rene funksjoner uten React, slik at alle seksjonene på siden (kort fortalt,
 * pris, sammenligning, tabell) regner med nøyaktig de samme tallene.
 *
 * Modellen, år for år (år 1 = første hele år med anlegget):
 *   produksjon      = årsproduksjon × (1 − degradering)^(år−1)
 *   egenbruk        = min(produksjon × egenbruksandel, forbruk)
 *   salg            = produksjon − egenbruk
 *   kjøp fra nettet = forbruk − egenbruk
 *   kWh-pris        = (strømpris + nettleie energiledd) × (1 + prisvekst)^(år−1)
 *   salgspris       = salgspris × (1 + prisvekst)^(år−1)
 *
 *   uten solceller  = forbruk × kWh-pris
 *   med solceller   = kjøp × kWh-pris − salg × salgspris + drift
 *                     (+ inverterbytte i bytteåret)
 *   og investeringen etter støtte betales i år 0.
 *
 * Faste ledd (fastledd i nettleien, månedsbeløp hos strømleverandøren) betales
 * likt med og uten solceller og er derfor holdt utenfor begge alternativene.
 * Strømpris og nettleie skal være det kunden faktisk betaler per kWh, etter en
 * eventuell strømstøtte eller Norgespris; samme pris brukes i begge alternativene.
 */

export const OFFER_DEFAULTS = {
  /** Salgspris for overskudd, kr/kWh. Spotpris midt på dagen, ofte lavere enn snittet. */
  exportPrice: 0.6,
  /** Årlig produksjonsnedgang for panelene */
  degradation: 0.004,
  /** Når inverteren regnes som byttet */
  replacementYear: 15,
  /** Inverterbytte = inverterens pris × denne faktoren (pris + montering og prisstigning) */
  replacementFactor: 1.4,
  /** Brukes når tilbudet ikke har en egen inverterlinje (kr eks. mva.) */
  replacementFallbackEx: 15000,
  /** Faste driftskostnader per år (kr). Solcelleanlegg har lite løpende vedlikehold. */
  maintenancePerYear: 0,
  /** Årsforbruk når verken kunden eller leaden har oppgitt det */
  consumptionFallback: 20000,
  /** Enova: kr per kWp, maks kWp, maks andel av kostnaden (brukes bare på eldre tilbud) */
  enovaPerKwp: 2500,
  enovaMaxKwp: 15,
  enovaMaxShare: 0.25,
  vatRate: 0.25,
  years: 30,
};

/**
 * Forutsetningene tilbudet regner med.
 *  - usignert tilbud: gjeldende verdier fra Beregningsregler i dashboardet (economyDefaults)
 *  - signert tilbud: verdiene som ble låst da tilbudet ble laget (price_data.economy)
 *  - eldre tilbud uten noe av dette: verdiene som gjaldt da de ble sendt
 */
export function assumptionsFor(estimateData) {
  const locked = estimateData?.price_data?.economy;
  const e = (!estimateData?.signed_at && estimateData?.economyDefaults) || locked || null;
  const isBusiness = Boolean(estimateData?.private);
  const num = (v, fallback) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? fallback : Number(v));
  const period = num(e?.periodYears, 30);
  return {
    // Eldre tilbud: private = true er næring
    elPrice: num(e?.elPrice, isBusiness ? 0.65 : 0.5),
    netPrice: num(e?.netPrice, isBusiness ? 0.3 : 0.62),
    priceGrowthPercent: num(e?.priceGrowthPercent, 2.5),
    exportPrice: num(e?.exportPrice, OFFER_DEFAULTS.exportPrice),
    /** null = anslås fra produksjon og forbruk */
    selfUseShare: e?.selfUsePercent == null ? null : num(e.selfUsePercent, 35) / 100,
    degradation: num(e?.degradationPercent, OFFER_DEFAULTS.degradation * 100) / 100,
    replacementYear: Math.round(num(e?.replacementYear, OFFER_DEFAULTS.replacementYear)),
    replacementFactor: num(e?.replacementFactor, OFFER_DEFAULTS.replacementFactor),
    maintenancePerYear: num(e?.maintenancePerYear, OFFER_DEFAULTS.maintenancePerYear),
    consumptionFallback: num(e?.consumptionFallback, OFFER_DEFAULTS.consumptionFallback),
    periodYears: [10, 20, 30].includes(period) ? period : 30,
    // Garantier og levetid for panelene (Beregningsregler)
    productWarrantyYears: Math.round(num(e?.productWarrantyYears, 25)),
    powerWarrantyYears: Math.round(num(e?.powerWarrantyYears, 30)),
    expectedLifetimeYears: Math.round(num(e?.expectedLifetimeYears, 40)),
  };
}

/**
 * Høyeste egenbruksandel som gir mening: kunden kan ikke bruke mer solstrøm enn hele forbruket.
 * Over denne grensen endrer ikke andelen noe, så slideren stopper der.
 */
export function maxSelfUseShare(production, consumption) {
  if (!(production > 0) || !(consumption > 0)) return 0.9;
  return Math.max(0.1, Math.min(0.9, consumption / production));
}

/**
 * Anslått andel av solstrømmen kunden bruker selv, uten batteri.
 * Jo mindre anlegget er i forhold til forbruket, jo mer brukes direkte.
 * Gir ca. 35 % når årsproduksjon = årsforbruk, ca. 48 % ved halvparten.
 */
export function defaultSelfUseShare(production, consumption) {
  if (!(production > 0) || !(consumption > 0)) return 0.35;
  const ratio = production / consumption;
  return Math.min(0.6, Math.max(0.25, 0.6 - 0.25 * ratio));
}

export const kwpOf = (estimateData) => {
  if (estimateData?.kwp) return Number(estimateData.kwp);
  const panel = estimateData?.price_data?.suppliers?.find((s) => String(s.category).includes("panel"));
  const wp = Number((panel?.product || estimateData?.selected_panel_type || "").match(/(\d+)\s*W/i)?.[1] ?? 0);
  return ((estimateData?.total_panels ?? 0) * wp) / 1000;
};

/**
 * Pris og støtte.
 * estimates.private = true betyr næring (eksisterende navngiving).
 * Privat: beløp inkl. mva. og Enova-støtte. Næring: eks. mva., uten støtte.
 */
export function priceFor(estimateData, extrasEx = 0) {
  const isBusiness = Boolean(estimateData?.private);
  const vat = isBusiness ? 1 : 1 + OFFER_DEFAULTS.vatRate;
  const baseEx = Number(estimateData?.price_data?.total || 0);
  const invoiced = Math.round((baseEx + extrasEx) * vat);
  const solarInvoiced = Math.round(baseEx * vat);

  let support = 0;
  let supportSource = "none";
  if (!isBusiness) {
    const fromCalc = estimateData?.price_data?.estimatedSupport;
    if (fromCalc && Number(fromCalc.amount) >= 0 && fromCalc.mode !== "none") {
      support = Number(fromCalc.amount);
      supportSource = "calculator";
    } else {
      // Eldre tilbud: Enovas satser (2 500 kr per kWp, maks 15 kWp, maks 25 % av kostnaden)
      const byKwp = Math.min(kwpOf(estimateData), OFFER_DEFAULTS.enovaMaxKwp) * OFFER_DEFAULTS.enovaPerKwp;
      support = Math.min(byKwp, solarInvoiced * OFFER_DEFAULTS.enovaMaxShare);
      supportSource = "enova-rates";
    }
  }
  support = Math.round(support);
  return {
    isBusiness,
    taxLabel: isBusiness ? "eks. mva." : "inkl. mva.",
    invoiced,
    solarInvoiced,
    support,
    supportSource,
    supportProvider: estimateData?.price_data?.estimatedSupport?.provider || "Enova",
    /** Solcelleanlegget etter støtte: grunnlaget for sammenligningen */
    solarNet: Math.max(0, solarInvoiced - support),
    /** Alt kunden har valgt (med tillegg) etter støtte */
    net: Math.max(0, invoiced - support),
  };
}

/** Inverterbytte i bytteåret: hva som byttes og hva det koster (samme mva.-visning som prisen). */
export function replacementFor(estimateData, assumptions = {}) {
  const year = assumptions.replacementYear ?? OFFER_DEFAULTS.replacementYear;
  const factor = assumptions.replacementFactor ?? OFFER_DEFAULTS.replacementFactor;
  const isBusiness = Boolean(estimateData?.private);
  const vat = isBusiness ? 1 : 1 + OFFER_DEFAULTS.vatRate;
  const inverters = (estimateData?.price_data?.suppliers ?? []).filter((s) => String(s.category).includes("inverter"));
  const inverterEx = inverters.reduce((sum, i) => sum + Number(i.priceWithMarkup || 0), 0);
  const baseEx = inverterEx > 0 ? inverterEx * factor : OFFER_DEFAULTS.replacementFallbackEx;
  return {
    year,
    cost: Math.round((baseEx * vat) / 100) * 100,
    what: inverters.length
      ? `${inverters.map((i) => i.product || i.name).filter(Boolean).join(" og ") || "inverteren"}`
      : "inverteren",
    basis:
      inverterEx > 0
        ? `inverterens pris i dag × ${factor.toLocaleString("nb-NO")} (ny inverter, montering og prisstigning)`
        : "et anslag på 15 000 kr eks. mva.",
  };
}

/** Årsforbruket som er kjent for leaden, eller null. */
export function knownConsumption(estimateData) {
  const v =
    Number(estimateData?.leads?.own_consumption) ||
    Number(estimateData?.price_data?.batterySection?.annualConsumption) ||
    Number(estimateData?.desired_kwh) ||
    0;
  return v > 0 ? v : null;
}

/**
 * År-for-år-beregningen. Alle beløp i kroner, positive tall er kostnader.
 * @returns {{ rows: object[], investment: number }}
 */
export function simulate({
  consumption,
  production,
  selfUseShare,
  elPrice,
  netPrice,
  growthPercent,
  exportPrice,
  investment,
  replacement,
  degradation = OFFER_DEFAULTS.degradation,
  maintenancePerYear = OFFER_DEFAULTS.maintenancePerYear,
  years = OFFER_DEFAULTS.years,
}) {
  const g = 1 + (Number(growthPercent) || 0) / 100;
  const base = (Number(elPrice) || 0) + (Number(netPrice) || 0);
  const rows = [];
  let cumWithout = 0;
  let cumWith = investment;

  for (let year = 1; year <= years; year++) {
    const growth = Math.pow(g, year - 1);
    const prod = production * Math.pow(1 - degradation, year - 1);
    const selfUse = Math.min(prod * selfUseShare, consumption);
    const exported = Math.max(0, prod - selfUse);
    const bought = Math.max(0, consumption - selfUse);
    const kwhPrice = base * growth;
    const sellPrice = (Number(exportPrice) || 0) * growth;
    const replacementCost = replacement && year === replacement.year ? replacement.cost : 0;

    const costWithout = consumption * kwhPrice;
    const boughtCost = bought * kwhPrice;
    const exportIncome = exported * sellPrice;
    const costWith = boughtCost - exportIncome + maintenancePerYear + replacementCost;

    cumWithout += costWithout;
    cumWith += costWith;

    rows.push({
      year,
      production: prod,
      selfUse,
      exported,
      bought,
      kwhPrice,
      sellPrice,
      costWithout,
      boughtCost,
      exportIncome,
      replacementCost,
      maintenance: maintenancePerYear,
      costWith,
      /** Det anlegget sparer det året, før investering */
      saving: costWithout - costWith,
      cumWithout,
      cumWith,
    });
  }
  return { rows, investment };
}

/** Tallene for en periode (10, 20 eller 30 år). */
export function periodSummary({ rows, investment }, years) {
  const upTo = rows.slice(0, years);
  const last = upTo[upTo.length - 1];
  const paybackRow = rows.find((r) => r.cumWith <= r.cumWithout);
  const replacementInPeriod = upTo.some((r) => r.replacementCost > 0);
  return {
    years,
    without: last?.cumWithout ?? 0,
    with: last?.cumWith ?? investment,
    difference: (last?.cumWithout ?? 0) - (last?.cumWith ?? investment),
    paybackYear: paybackRow ? paybackRow.year : null,
    paidBackInPeriod: Boolean(paybackRow && paybackRow.year <= years),
    replacementInPeriod,
    production: upTo.reduce((s, r) => s + r.production, 0),
  };
}

/**
 * Forenklet kostnad per produsert kWh over hele perioden:
 * (investering etter støtte + inverterbytte + drift) / samlet produksjon.
 * Gjelder strømmen anlegget produserer; strøm kjøpt fra nettet kommer i tillegg.
 */
export function costPerProducedKwh({ rows, investment }, years = OFFER_DEFAULTS.years) {
  const upTo = rows.slice(0, years);
  const production = upTo.reduce((s, r) => s + r.production, 0);
  const costs = investment + upTo.reduce((s, r) => s + r.replacementCost + r.maintenance, 0);
  return { perKwh: production > 0 ? costs / production : 0, production, costs };
}

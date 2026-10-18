/**
 * Beregningslaget for batteri, hybridinverter og nødstrøm.
 *
 * Portert fra prototypens `offer-model.js` (Soleklart, 28. september 2026).
 * Rene funksjoner uten React — all pris kommer fra `price_data.battery` på
 * estimatet, aldri fra verdier i denne filen.
 *
 * Solcelleanleggets egen økonomi ligger urørt i `SolarEconomicCalculation`.
 * Tilleggene her holdes utenfor den nedbetalingstiden, slik kravene sier.
 */

export const MODES = ["solar", "hybrid", "battery"];
export const BACKUP_CHOICES = ["none", "circuits", "whole"];

const MAX_CIRCUITS = 12;

/**
 * Batterier er bygget ulikt. `structure` på modellen:
 *   "modular" – moduler som stables, med én BMS/base per `modulesPerBase` moduler
 *   "unit"    – hele enheter med fast kapasitet, uten egen BMS
 * Eldre oppsett uten `structure` regnes som modulære.
 */
export const isModular = (product) =>
  product?.structure !== "unit" && Number(product?.modulesPerBase) > 0;

/** "modul"/"moduler" eller "enhet"/"enheter" for en modell. */
export function unitWord(product, count = 2) {
  if (product?.structure === "unit") return count === 1 ? "enhet" : "enheter";
  return count === 1 ? "modul" : "moduler";
}

/**
 * Modellene i rekkefølgen kunden skal se dem. `config.order` kommer fra kalkulatoren
 * (jsonb tar ikke vare på rekkefølgen av nøklene i `catalogue`).
 */
export function orderedModels(config) {
  const catalogue = config?.catalogue ?? {};
  const order = Array.isArray(config?.order) ? config.order.filter((id) => catalogue[id]) : [];
  const rest = Object.keys(catalogue).filter((id) => !order.includes(id));
  return [...order, ...rest].map((id) => catalogue[id]);
}

/** Anbefalt modell, eller første modell i katalogen hvis anbefalingen mangler. */
export function recommendedFor(config) {
  const catalogue = config?.catalogue ?? {};
  const model = catalogue[config?.recommended?.model]
    ? config.recommended.model
    : orderedModels(config)[0]?.id ?? Object.keys(catalogue)[0] ?? null;
  const product = catalogue[model];
  if (!product) return null;
  const wanted =
    model === config?.recommended?.model ? Number(config.recommended.modules) : NaN;
  return { model, modules: clampModules(product, wanted) };
}

function clampModules(product, requested) {
  const fallback =
    product.moduleKwh > 0 ? Math.round(10 / product.moduleKwh) : product.min;
  const value = Number.isFinite(requested) ? Math.round(requested) : fallback;
  return Math.max(product.min, Math.min(product.max, value));
}

/** Når kunden bytter modell: behold omtrent samme kapasitet. */
export function modulesForCapacity(product, capacityKwh) {
  if (!product) return 0;
  if (!(capacityKwh > 0) || !(product.moduleKwh > 0)) return product.min;
  return clampModules(product, capacityKwh / product.moduleKwh);
}

export const hasBatteries = (config) =>
  Object.keys(config?.catalogue ?? {}).length > 0;

/** Første gyldige valg: standardanlegget, med anbefalt batteri klart i bakgrunnen. */
export function defaultSelection(config) {
  const recommended = recommendedFor(config);
  return {
    mode: "solar",
    model: recommended?.model ?? null,
    modules: recommended?.modules ?? 1,
    backup: "none",
    circuits: 2,
  };
}

/** Klemmer et valg innenfor det katalogen tillater. */
export function normalizedSelection(input, config) {
  const catalogue = config?.catalogue ?? {};
  let mode = MODES.includes(input?.mode) ? input.mode : "solar";
  // Uten batterimodeller på tilbudet finnes det ikke noe batterivalg.
  if (mode === "battery" && !hasBatteries(config)) mode = "hybrid";

  const fallbackModel = recommendedFor(config)?.model ?? null;
  const model = catalogue[input?.model] ? input.model : fallbackModel;
  const product = catalogue[model];

  const requested = Number(input?.modules);
  const modules = product
    ? Math.max(
        product.min,
        Math.min(
          product.max,
          Number.isFinite(requested) ? Math.round(requested) : product.min,
        ),
      )
    : 0;

  const backup =
    mode === "battery" && ["circuits", "whole"].includes(input?.backup)
      ? input.backup
      : "none";

  const circuits = Math.max(
    1,
    Math.min(MAX_CIRCUITS, Math.round(Number(input?.circuits) || 2)),
  );

  return { mode, model, modules, backup, circuits };
}

/** Privatkunde ser inkl. mva, næring eks. mva. */
export function vatMultiplier(config) {
  return config?.customerType === "private" ? 1 + (config.vatRate ?? 0.25) : 1;
}

/**
 * Prislinjene for tilleggene ved et gitt valg.
 *
 * Returnerer bare tilleggene — solcelleanleggets grunnpris ligger i
 * `price_data.total` og blandes ikke inn her.
 */
export function calculateExtras(input, config) {
  const selection = normalizedSelection(input, config);
  const product = config?.catalogue?.[selection.model];
  const lines = [];

  let capacity = 0;
  let unitEx = 0;
  let discountEx = 0;
  let bases = 0;

  if (selection.mode !== "solar") {
    const qty = config?.hybridQty ?? 1;
    lines.push({
      id: "hybrid",
      label: `Oppgradering til hybridinverter${qty > 1 ? "e" : ""}`,
      detail: `${qty} stk. · erstatter tilsvarende standardinverter${qty > 1 ? "e" : ""}`,
      amountEx: qty * (config?.hybridUnitEx ?? 0),
    });
  }

  if (selection.mode === "battery" && product) {
    capacity = Number((selection.modules * product.moduleKwh).toFixed(2));
    unitEx = product.moduleEx;

    // En nådd terskel setter stykkprisen på samtlige moduler.
    if (product.discountEnabled) {
      for (const tier of [...(product.tiers ?? [])].sort(
        (a, b) => a.min - b.min,
      )) {
        if (selection.modules >= tier.min) unitEx = tier.unitEx;
      }
    }

    discountEx = (product.moduleEx - unitEx) * selection.modules;
    // Hele enheter har ingen BMS. Modulære får én BMS per påbegynte modulesPerBase.
    if (isModular(product)) {
      bases = Math.ceil(selection.modules / product.modulesPerBase);
      if ((product.baseEx ?? 0) > 0) {
        lines.push({
          id: "bms",
          label: `${product.bmsName || "BMS / base"} · ${bases} stk.`,
          amountEx: bases * product.baseEx,
        });
      }
    }
    lines.push({
      id: "modules",
      label: `${product.brand} · ${selection.modules} ${unitWord(product, selection.modules)}`,
      detail: discountEx > 0 ? "Kvantumspris på alle modulene" : null,
      amountEx: selection.modules * unitEx,
    });
    lines.push({
      id: "install",
      label: "Installasjon av batteri",
      amountEx: config?.batteryInstallEx ?? 0,
    });

    if (selection.backup === "circuits") {
      lines.push({
        id: "backup",
        label: `Nødstrøm · ${selection.circuits} utvalgte kurser`,
        detail: "Foreløpig omfang, må vurderes",
        amountEx:
          (config?.backupCircuitBaseEx ?? 0) +
          selection.circuits * (config?.backupCircuitUnitEx ?? 0),
      });
    }
    if (selection.backup === "whole") {
      lines.push({
        id: "backup",
        label: "Nødstrøm · hele bygget",
        detail: "Foreløpig pris, må vurderes",
        amountEx: config?.backupWholeEstimateEx ?? 0,
      });
    }
  }

  const extrasEx = lines.reduce((sum, line) => sum + line.amountEx, 0);
  const batteryOnlyEx = lines
    .filter((line) => ["bms", "modules", "install"].includes(line.id))
    .reduce((sum, line) => sum + line.amountEx, 0);

  return {
    selection,
    product,
    lines,
    capacity,
    bases,
    unitEx,
    discountEx,
    extrasEx,
    batteryOnlyEx,
    // Store systemer krever eget leverandørtilbud — vist som forbehold,
    // ikke som en ferdig pris.
    supplierRequired:
      selection.mode === "battery" &&
      product?.supplierFromKwh != null &&
      capacity >= product.supplierFromKwh,
    backupRequired: selection.backup !== "none",
  };
}

/**
 * Døgnseksempelet i animasjonen.
 *
 * Bevisst et merket eksempel, ikke en årsprognose: tapt salgsinntekt og
 * energitap er trukket fra, og samme kWh gir ikke både salg og egenbruk.
 */
export function dayCycleExample(capacity, config) {
  const charged = Math.min(10, capacity * 0.7);
  const delivered = charged * 0.9;
  const purchase = config?.purchase ?? 0;
  const exportPrice = config?.exportPrice ?? 0;

  const backupAvailable = capacity * 0.3 * 0.9;

  return {
    charged,
    delivered,
    cycleValue: delivered * purchase - charged * exportPrice,
    backupAvailable,
    backupHours: backupAvailable / 0.3,
  };
}

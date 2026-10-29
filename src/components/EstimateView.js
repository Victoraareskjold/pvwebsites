"use client";

import { useSiteConfig } from "../contexts/siteConfigContext";
import { useState, useEffect } from "react";

import "./estimate.css";
import "./estimate/offerLayout.css";
import SolarOverview from "./estimate/SolarOverview";
import OfferHighlights from "./estimate/OfferHighlights";
import OfferPrice from "./estimate/OfferPrice";
import CostComparison from "./estimate/CostComparison";
import {
  assumptionsFor,
  costPerProducedKwh,
  maxSelfUseShare,
  kwpOf,
  defaultSelfUseShare,
  knownConsumption,
  periodSummary,
  priceFor,
  replacementFor,
  simulate,
} from "./estimate/offerEconomics";
import BatteryOptions from "./estimate/BatteryOptions";
import { batteryConfigFor, canSignExtras } from "./estimate/offerConfig";
import OfferClosing from "./estimate/OfferClosing";
import BusinessAnalysis, { BusinessHighlights } from "./estimate/BusinessAnalysis";
import { useSearchParams } from "next/navigation";

/**
 * Batteriseksjonen vises på tilbud laget fra og med denne datoen.
 * Tilbud som allerede var sendt ut før dette skal se ut som da de ble sendt.
 *
 * Uten Z, fordi estimates.created_at er lagret uten tidssone og dermed
 * tolkes som lokal tid — da sammenlignes epler med epler.
 */
const BATTERY_SECTION_FROM = new Date("2026-10-05T00:00:00");


export default function EstimateView({ estimateId }) {
  const config = useSiteConfig();
  const [estimateData, setEstimateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();

  const finished = searchParams.get("f");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await fetch(`/api/estimate/${estimateId}`);
      const data = await res.json();

      setEstimateData(data);
      setLoading(false);
    };
    fetchData();
  }, [estimateId]);

  const [elPrice, setElPrice] = useState(0.5);
  const [elNetPrice, setElNetPrice] = useState(0.62);
  const [expectedElPriceIncrease, setExpectedElPriceIncrease] = useState(2.5);

  // Forutsetningene starter på verdiene fra Beregningsregler (se assumptionsFor), og kunden kan justere dem.
  const [exportPrice, setExportPrice] = useState(0.6);
  const [selfUseOverride, setSelfUseOverride] = useState(null);
  const [period, setPeriod] = useState(30);
  useEffect(() => {
    if (!estimateData) return;
    const a = assumptionsFor(estimateData);
    setElPrice(a.elPrice);
    setElNetPrice(a.netPrice);
    setExpectedElPriceIncrease(a.priceGrowthPercent);
    setExportPrice(a.exportPrice);
    setSelfUseOverride(a.selfUseShare);
    setPeriod(a.periodYears);
  }, [estimateData]);

  // Sammenligningen med og uten solceller
  const [consumption, setConsumptionState] = useState(null);

  // Kundens eget forbruk huskes i nettleseren for dette tilbudet
  const storageKey = `offer-consumption-${estimateId}`;
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(storageKey));
      if (saved > 0) setConsumptionState(saved);
    } catch {
      /* ingen lagring tilgjengelig */
    }
  }, [storageKey]);
  const setConsumption = (v) => {
    setConsumptionState(v);
    try {
      localStorage.setItem(storageKey, String(v));
    } catch {
      /* ignorer */
    }
  };

  // Kundens batterivalg, løftet opp hit slik at prisoppsummeringen
  // nederst følger det som er valgt lenger oppe på siden.
  const [batteryQuote, setBatteryQuote] = useState(null);


  if (loading || !estimateData) {
    return (
      <div className="min-h-screen text-center flex justify-center items-center">
        Laster inn estimat..
      </div>
    );
  }


  // Oppsettet for batteriseksjonen. Tilbudet kan overstyre fellesoppsettet
  // med price_data.batterySection — ikke å forveksle med
  // price_data.installation.battery, som er installasjonsarbeidet.
  // Døgneksempelet i batteridelen bruker de samme forutsetningene som resten av tilbudet
  const batteryConfig = { ...batteryConfigFor(estimateData), purchase: elPrice + elNetPrice, exportPrice };

  // Tillegg som må gjennomgås før signering: nødstrøm, store anlegg som krever
  // leverandørpris, og eldre tilbud uten priser fra kalkulatoren.
  const hasExtras = (batteryQuote?.extrasEx ?? 0) > 0;
  const hasUnreviewedExtras =
    hasExtras &&
    (!canSignExtras(estimateData) ||
      Boolean(batteryQuote?.backupRequired) ||
      Boolean(batteryQuote?.supplierRequired));
  // Samme kontaktinfo som resten av nettsiden, ikke selgeren på tilbudet.
  const contactPhone = config.footer?.phone || "+47 458 71 718";
  const contactPhoneHref =
    config.footer?.phoneHref || contactPhone.replace(/\s/g, "");
  const contactEmail = config.footer?.email;

  // Seksjonen gjelder tilbud laget fra og med denne datoen — uavhengig av om
  // det ligger batteri i tilbudet. Eldre tilbud er sendt ut uten den og skal
  // ikke endre seg i ettertid.
  const createdAt = estimateData?.created_at
    ? new Date(estimateData.created_at)
    : null;
  // Slått av på tilbudet i dashboardet: kunden ser verken hybridoppgradering eller batteri.
  const extrasOff = estimateData?.price_data?.batterySection?.enabled === false;
  const showBatterySection =
    !extrasOff &&
    createdAt instanceof Date &&
    !Number.isNaN(createdAt.getTime()) &&
    createdAt >= BATTERY_SECTION_FROM;

  // ── Økonomien: én beregning som alle seksjonene bruker ──────────────────
  const assumptions = assumptionsFor(estimateData);
  const production = Number(estimateData?.yearly_prod || 0);
  const leadConsumption = knownConsumption(estimateData);
  const annualConsumption = consumption ?? leadConsumption ?? assumptions.consumptionFallback;
  const consumptionIsDefault = consumption == null && leadConsumption == null;
  // Egenbruk kan ikke overstige forbruket. Over grensen ville slideren flyttet seg uten at tallene endret seg.
  const selfUseMax = maxSelfUseShare(production, annualConsumption);
  const selfUseShare = Math.min(selfUseOverride ?? defaultSelfUseShare(production, annualConsumption), selfUseMax);
  const price = priceFor(estimateData, batteryQuote?.extrasEx ?? 0);
  const replacement = replacementFor(estimateData, assumptions);
  const sim = simulate({
    consumption: annualConsumption,
    production,
    selfUseShare,
    elPrice,
    netPrice: elNetPrice,
    growthPercent: expectedElPriceIncrease,
    exportPrice,
    // Grunnberegningen gjelder selve solcelleanlegget; batteri og hybrid vises separat
    investment: price.isBusiness ? price.solarInvoiced : price.solarNet,
    replacement,
    degradation: assumptions.degradation,
    maintenancePerYear: assumptions.maintenancePerYear,
  });
  const costKwh = costPerProducedKwh(sim);
  // Næring med låst analyse fra kalkulatortjenesten (time for time). Erstatter den forenklede
  // årsmodellen i «Kort fortalt» og «Økonomien din». «ikke beregnet» = vis som før.
  const businessAnalysis =
    estimateData?.price_data?.businessAnalysis?.status === "beregnet" ? estimateData.price_data.businessAnalysis : null;
  const firstYear = sim.rows[0];
  const kwp = kwpOf(estimateData);

  // Ikke interessert (3, 16) / Nyhetsbrev (11): estimatbildet er slettet i dashboardet,
  // og tilbudet regnes som utløpt. Laster selgeren opp nytt bilde, forsvinner banneret.
  const expired =
    !estimateData?.signed_at &&
    !estimateData?.image_url &&
    [3, 11, 16].includes(Number(estimateData?.leads?.status));
  const advisor = estimateData?.leads?.created_by;

  return (
    <main className="min-h-screen estimateStylingSheet">
      {estimateData ? (
        <main className="flex flex-col gap-12 lg:gap-4 items-center">
          {expired && (
            <div className="offer-expired" role="alert">
              <strong>Dette tilbudet har utløpt.</strong> Ta kontakt dersom du
              ønsker en ny vurdering og et oppdatert tilbud.
              {(advisor?.phone || advisor?.email) && (
                <span className="offer-expired-contact">
                  {advisor?.name ? `${advisor.name}: ` : ""}
                  {advisor?.phone && (
                    <a href={`tel:${advisor.phone.replace(/\s/g, "")}`}>{advisor.phone}</a>
                  )}
                  {advisor?.phone && advisor?.email ? " · " : ""}
                  {advisor?.email && <a href={`mailto:${advisor.email}`}>{advisor.email}</a>}
                </span>
              )}
            </div>
          )}
          {/* Innledningen, med ordlyden fra kravdokumentet. */}
          <section className="offer-intro">
            <p className="offer-intro-meta">
              Beregningen er utført for en{" "}
              <strong>
                {estimateData?.private ? "næringskunde" : "privatperson"}
              </strong>
              {estimateData?.leads?.address ? (
                <>
                  {" "}
                  på følgende adresse:{" "}
                  <strong>{estimateData.leads.address}</strong>
                </>
              ) : null}
            </p>

            <h1 className="offer-intro-greeting">
              Hei {estimateData?.leads?.person_info}
            </h1>

            <p className="offer-intro-lead">
              Her er ditt {finished ? "tilbud" : "estimat"} på et komplett
              solcelleanlegg fra <strong>{config.title}</strong>.
            </p>

            {estimateData?.leads?.created_by?.name && (
              <div className="offer-intro-advisor">
                <span className="offer-intro-avatar" aria-hidden="true">
                  {estimateData.leads.created_by.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <strong>{estimateData.leads.created_by.name}</strong>
                  <span>Din kontaktperson</span>
                </div>
              </div>
            )}
          </section>

          {/* Kort fortalt: verdien tidlig, detaljene lenger ned */}
          {businessAnalysis ? (
            <BusinessHighlights analysis={businessAnalysis} />
          ) : (
            <OfferHighlights
              price={price}
              firstYear={firstYear}
              summary={periodSummary(sim, period)}
              periodYears={period}
            />
          )}

          <div className="offer-step">
            <p className="offer-step-number">01 · ANLEGGET DITT</p>
            <h2>
              {price.isBusiness
                ? "Dette foreslår vi, og hvorfor det passer bygget ditt."
                : "Dette foreslår vi, og hvorfor det passer boligen din."}
            </h2>
          </div>

          <SolarOverview
            estimateData={estimateData}
            finished={finished}
            consumption={annualConsumption}
            firstYear={firstYear}
            assumptions={assumptions}
          />

          <div className="offer-step">
            <p className="offer-step-number">02 · HVA DET KOSTER</p>
            <h2>{price.isBusiness ? "Pris for anlegget." : "Pris, støtte og din egen kostnad."}</h2>
          </div>

          <OfferPrice price={price} kwp={kwp} />

          {businessAnalysis ? (
            <>
              <div className="offer-step">
                <p className="offer-step-number">03 · ØKONOMIEN DIN</p>
                <h2>Hva solcellene betyr for strømregningen og økonomien.</h2>
                <p>
                  Regnet time for time med byggets forbruk, simulert solproduksjon, faktiske strømpriser og nettleien
                  for {businessAnalysis.period.label}. Deretter regnet frem over anleggets levetid.
                </p>
              </div>
              <BusinessAnalysis analysis={businessAnalysis} />
            </>
          ) : (
            <>
              <div className="offer-step">
                <p className="offer-step-number">03 · ØKONOMIEN DIN</p>
                <h2>Strømkostnadene dine med og uten solceller.</h2>
                <p>
                  Hva du samlet kan forvente å betale for strøm hvis du fortsetter som i dag, sammenlignet med å investere i
                  anlegget. Legg inn ditt eget forbruk og velg periode.
                </p>
              </div>

              <CostComparison
                sim={sim}
                period={period}
                setPeriod={setPeriod}
                consumption={annualConsumption}
                setConsumption={setConsumption}
                consumptionIsDefault={consumptionIsDefault}
                consumptionFromLead={consumption == null && leadConsumption != null}
                selfUseShare={selfUseShare}
                selfUseMax={selfUseMax}
                setSelfUseShare={setSelfUseOverride}
                selfUseIsDefault={selfUseOverride == null}
                exportPrice={exportPrice}
                setExportPrice={setExportPrice}
                elPrice={elPrice}
                setElPrice={setElPrice}
                netPrice={elNetPrice}
                setNetPrice={setElNetPrice}
                growth={expectedElPriceIncrease}
                setGrowth={setExpectedElPriceIncrease}
                price={price}
                replacement={replacement}
                assumptions={assumptions}
                costKwh={costKwh}
                config={config}
              />
            </>
          )}

          {/* Batteri, hybridinverter og nødstrøm.

              Alle tilbud laget fra og med BATTERY_SECTION_FROM viser seksjonen,
              uavhengig av om det ligger batteri i tilbudet — poenget er at
              kunden selv kan utforske om hen vil ha det. Eldre tilbud er
              urørt. */}
          {showBatterySection && (
            <BatteryOptions
              config={batteryConfig}
              onSelectionChange={(selection, quote) => setBatteryQuote(quote)}
            />
          )}

          <div className="offer-step">
            <p className="offer-step-number">05 · DIN OVERSIKT</p>
            <h2>Dette har du valgt.</h2>
            <p>Se hva som inngår, og hva valgene dine betyr for prisen.</p>
          </div>

          <OfferClosing
            estimateData={estimateData}
            estimateId={estimateId}
            finished={finished}
            config={config}
            enovaSupport={price.support}
            batteryQuote={batteryQuote}
            hasUnreviewedExtras={hasUnreviewedExtras}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            contactPhoneHref={contactPhoneHref}
          />
        </main>
      ) : (
        <p>No estimate found.</p>
      )}
    </main>
  );
}

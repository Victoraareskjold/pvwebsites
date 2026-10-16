"use client";

import { useSiteConfig } from "../contexts/siteConfigContext";
import { useState, useEffect } from "react";

import "./estimate.css";
import "./estimate/offerLayout.css";
import SolarEconomicCalculation from "./estimate/SolarEconomicCalculation";
import SolarOverview from "./estimate/SolarOverview";
import BatteryOptions from "./estimate/BatteryOptions";
import defaultBatteryConfig from "../config/battery";
import OfferClosing from "./estimate/OfferClosing";
import { useSearchParams } from "next/navigation";
import { calculateKwhCostWithLoan } from "../../utils/calculateKwhCostWithLoan";

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

  useEffect(() => {
    if (!estimateData) return;

    if (estimateData.private) {
      setElPrice(0.65);
      setElNetPrice(0.3);
    } else {
      setElPrice(0.5);
      setElNetPrice(0.62);
    }
  }, [estimateData]);

  const [expectedElPriceIncrease, setExpectedElPriceIncrease] = useState(2.5);
  const [paymentTime, setPaymentTime] = useState(null);

  // Kundens batterivalg, løftet opp hit slik at prisoppsummeringen
  // nederst følger det som er valgt lenger oppe på siden.
  const [batteryQuote, setBatteryQuote] = useState(null);

  const [economySummary, setEconomySummary] = useState(null);
  const [totalProduction30Years, setTotalProduction30Years] = useState(0);
  const [inverterReplacementCost, setInverterReplacementCost] = useState(0);

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
  const batteryConfig = {
    ...defaultBatteryConfig,
    ...(estimateData?.price_data?.batterySection ?? {}),
    // Kundetype og årsforbruk hører til tilbudet, ikke til fellesoppsettet.
    customerType: estimateData?.private ? "business" : "private",
    annualConsumption:
      estimateData?.price_data?.batterySection?.annualConsumption ??
      estimateData?.leads?.own_consumption ??
      defaultBatteryConfig.annualConsumption,
  };

  // Kunden har lagt til noe som ikke er godkjent for signering ennå.
  const hasUnreviewedExtras = (batteryQuote?.extrasEx ?? 0) > 0;
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
  const showBatterySection =
    createdAt instanceof Date &&
    !Number.isNaN(createdAt.getTime()) &&
    createdAt >= BATTERY_SECTION_FROM;

  const inverter = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "inverter",
  );

  const getPanelWp = (panelName) => {
    // Regex for å finne tall etter W eller w (f.eks. "Premium 415 W" → 415)

    const panelItem = estimateData?.price_data?.suppliers?.find(
      (item) => item.category === "solcellepanel",
    );

    // 2. Hent ut produktnavnet (f.eks. "Trina Vertex TSM- 445W")
    const panelProduct = panelItem?.product || "";

    // 3. Regex for å finne Watt (leter etter tallet før 'W')
    const match = panelProduct.match(/(\d+)\s*W/i);

    if (match) {
      return parseInt(match[1], 10);
    }
    // Fallback om regex ikke matcher
    console.warn(`Kunne ikke finne watt for panel: ${panelName}`);
    return 0;
  };

  const getkWp = (selectedPanelType, totalPanels) => {
    const panelWp = getPanelWp(selectedPanelType);
    return (totalPanels * panelWp) / 1000;
  };

  const enovaSupport = () => {
    const kwp =
      estimateData?.kwp ??
      getkWp(estimateData?.selected_panel_type, estimateData?.total_panels);
    const eligibleKwp = Math.min(kwp ?? 0, 15);
    return (eligibleKwp * 2500).toFixed(2);
  };

  const investmentCost = estimateData?.private
    ? estimateData?.price_data?.total || 0
    : Number(estimateData?.price_data?.["total inkl. alt"]) -
        Number(enovaSupport()) || 0;

  const solarCostPerKwh =
    totalProduction30Years > 0
      ? (investmentCost + inverterReplacementCost) / totalProduction30Years
      : 0;

  const futureGridPrice =
    (elPrice + elNetPrice) * Math.pow(1 + expectedElPriceIncrease / 100, 30);

  const totalProduction30 = estimateData.yearly_prod * 30;

  const solarCostWithLoan = estimateData?.yearly_prod
    ? calculateKwhCostWithLoan(
        totalProduction30,
        investmentCost,
        investmentCost,
      )
    : 0;

  return (
    <main className="min-h-screen estimateStylingSheet">
      {estimateData ? (
        <main className="flex flex-col gap-12 lg:gap-4 items-center">
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

          <div className="offer-step">
            <p className="offer-step-number">01 · SOLCELLER</p>
            <h2>Anlegget ditt, og hva det kan gi deg.</h2>
          </div>

          <SolarOverview
            estimateData={estimateData}
            finished={finished}
            config={config}
            solarCostPerKwh={solarCostPerKwh}
            solarCostWithLoan={solarCostWithLoan}
            elPrice={elPrice}
            setElPrice={setElPrice}
            elNetPrice={elNetPrice}
            setElNetPrice={setElNetPrice}
            expectedElPriceIncrease={expectedElPriceIncrease}
            setExpectedElPriceIncrease={setExpectedElPriceIncrease}
            futureGridPrice={futureGridPrice}
            paymentTime={paymentTime}
            economySummary={economySummary}
          />

          <div className="offer-solar-chart">
            <SolarEconomicCalculation
              yearlyProduction={estimateData?.yearly_prod || 0}
              elPrice={elPrice}
              elNetPrice={elNetPrice}
              expectedElPriceIncrease={expectedElPriceIncrease}
              investmentCost={investmentCost}
              inverterCost={inverter?.priceWithMarkup || 0}
              onPaybackCalculated={(data) => {
                setPaymentTime((prev) =>
                  prev !== data.paybackYear ? data.paybackYear : prev,
                );
                setEconomySummary((prev) =>
                  prev?.totalSavings30Years !== data.totalSavings30Years
                    ? data
                    : prev,
                );
                setTotalProduction30Years(data.totalProduction30Years);
                setInverterReplacementCost(data.inverterReplacementCost);
              }}
            />
          </div>

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
            <p className="offer-step-number">03 · DIN OVERSIKT</p>
            <h2>Dette har du valgt.</h2>
            <p>Se hva som inngår, og hva valgene dine betyr for prisen.</p>
          </div>

          <OfferClosing
            estimateData={estimateData}
            estimateId={estimateId}
            finished={finished}
            config={config}
            enovaSupport={enovaSupport()}
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

"use client";

import { useSiteConfig } from "../contexts/siteConfigContext";
import EstimatePricingInfo from "./EstimatePricingInfo";
import { useState, useEffect } from "react";

import "./estimate.css";
import HowWillItLook from "./estimate/HowWillItLook";
import HowDoesItWork from "./estimate/HowDoesItWork";
import YourSolarFacility from "./estimate/YourSolarFacility";
import YourSolarFacility2 from "./estimate/YourSolarFacility2";
import SolarEconomicCalculation from "./estimate/SolarEconomicCalculation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SpotPriceWidget from "./SpotPriceWidget";
import { calculateKwhCostWithLoan } from "../../utils/calculateKwhCostWithLoan";

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
  const maxPaymentTime = 40;

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

  const formatValue = (number) =>
    number.toLocaleString("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

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

  const percentOf40 = (years) => (years / maxPaymentTime) * 100;

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
          <section>
            <h2>
              Beregningen er utført for en{" "}
              <strong>
                {estimateData?.private ? "næringskunde" : "privatperson"}
              </strong>{" "}
              på følgende Adresse:{" "}
              <strong className="font-medium">
                {estimateData?.leads?.address || "Missing address"}
              </strong>
            </h2>
          </section>

          <section>
            <h5 className="mb-4">
              Hei <strong>{estimateData?.leads?.person_info}</strong>
            </h5>
            <div>
              <h2 className="font-light text-lg text-gray-900">
                Her er ditt {finished ? "tilbud" : "estimat"} på et komplett
                solcelleanlegg fra{" "}
                <span className="font-semibold">
                  {config.title || "mangler firma"}.
                </span>
              </h2>
            </div>
          </section>

          <section>
            <h5 className="mb-4">
              <strong>Hvordan funker dette?</strong>
            </h5>
            <HowDoesItWork finished={finished} />
          </section>

          <div className="flex flex-col lg:flex-row sectionContainer bg-[#FFF0CD] rounded-md !p-0 gap-4">
            <HowWillItLook estimateData={estimateData} finished={finished} />

            <section className="w-full">
              <h5 className="mb-8">
                <strong>Ditt anlegg består av</strong>
              </h5>
              {finished ? (
                <YourSolarFacility2
                  estimateData={estimateData}
                  finished={finished}
                />
              ) : (
                <YourSolarFacility estimateData={estimateData} />
              )}
            </section>
          </div>

          {/* <section className="hidden lg:block ">
            <div className="w-full h-1 bg-slate-300 rounded-full mt-12" />
          </section> */}

          <div className="flex flex-col sectionContainer bg-[#FFF0CD] rounded-md gap-12">
            {/* Strømpris og besparelse */}
            <div className="w-full">
              <div className="flex flex-col gap-4">
                <h5 className="!font-bold">
                  <strong>Produksjon og besparelse</strong>
                </h5>
                <h2>
                  Dette solcelleanlegget produserer strøm til ca.{" "}
                  <span className="font-bold">
                    {solarCostPerKwh.toFixed(2)} kr/kWh
                  </span>
                  .
                </h2>
                <h2>
                  Sammenlignet med ca.{" "}
                  <span className="font-bold">
                    {(elPrice + elNetPrice).toFixed(2)} kr/kWh
                  </span>{" "}
                  som du betaler i dag for strøm fra nettet, inkludert både
                  strømpris og nettleie.
                </h2>
              </div>
            </div>

            <section className="w-full flex flex-row gap-8 !p-0">
              <div className="flex flex-col justify-between w-full">
                <div className="bg-[#B6FFBE] p-2 rounded-sm">
                  <h1>
                    <strong>
                      Årsproduksjon fra solcelleanlegget:
                      <br />
                      <strong>
                        {formatValue(
                          Number(estimateData?.yearly_prod?.toFixed(0)),
                        )}{" "}
                        kWh
                      </strong>
                    </strong>
                  </h1>
                </div>
                <div className="bg-[#B6FFBE] p-2 rounded-sm">
                  <h1>
                    <strong>
                      Pris per kWh fra solcelleanlegget:
                      <br />
                      <strong>{solarCostPerKwh.toFixed(2)} kr/kWh</strong>
                    </strong>
                  </h1>
                </div>
                <div className="bg-[#B6FFBE] p-2 rounded-sm">
                  <h1>
                    <strong>
                      Pris per kWh med lån(10%, 5 år):
                      <br />
                      <strong>{solarCostWithLoan.toFixed(2)} kr/kWh</strong>
                    </strong>
                  </h1>
                </div>
                <div className="bg-[#FBFFB6] p-2 rounded-sm">
                  <h1>
                    <strong>
                      Pris på strøm du kjøper fra nettet:
                      <br />
                      <strong>
                        {(elPrice + elNetPrice).toFixed(2)} kr/kWh
                      </strong>
                    </strong>
                  </h1>
                </div>
              </div>
              <div className="flex flex-col justify-between w-full p-4 rounded-lg shadow-lg bg-white pb-8">
                <div>
                  <p className="fatP">
                    Nedbetalingstid (estimert):{" "}
                    <span className="font-extrabold text-lg">
                      {paymentTime} år
                    </span>
                  </p>
                  <div
                    style={{ width: `${percentOf40(paymentTime)}%` }}
                    className="bg-green-300 border border-green-800 rounded-xl h-10"
                  ></div>
                </div>

                <div>
                  <p className="">
                    Produktgaranti solcellepaneler:{" "}
                    <span className="font-medium text-md">25 år</span>
                  </p>
                  <div
                    className="bg-orange-200 border border-orange-300 rounded-xl h-10"
                    style={{ width: `${percentOf40(25)}%` }}
                  ></div>
                </div>

                <div>
                  <p className="">
                    Effektgaranti solcellepaneler:{" "}
                    <span className="font-medium text-md">30 år</span>
                  </p>
                  <div
                    className="bg-orange-300 border border-orange-400 rounded-xl h-10"
                    style={{ width: `${percentOf40(30)}%` }}
                  ></div>
                </div>

                <div>
                  <p className="">
                    Forventet levetid:{" "}
                    <span className="font-medium text-md">40+ år</span>
                  </p>
                  <div
                    className="border rounded-xl h-10 relative"
                    style={{
                      width: "calc(100% - 24px)",
                      backgroundColor: "#FF9C06",
                    }}
                  >
                    <img
                      src="/estimate/sun.png"
                      className="absolute right-[-40px] top-[12px] -translate-y-1/2 w-20"
                      alt="Sol"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 justify-between w-[550px]">
                <EstimatePricingInfo
                  image={"/estimate/icon1.png"}
                  number={`${formatValue(
                    economySummary?.totalSavings30Years || 0,
                  )} kr`}
                  text={"Total besparing for ditt anlegg over 30 år."}
                />

                <EstimatePricingInfo
                  image={"/estimate/icon2.png"}
                  number={`${formatValue(
                    economySummary?.averageYearlySavings || 0,
                  )} kr`}
                  text={"Gjennomsnittlig årlig besparelse"}
                />
              </div>
            </section>

            <div className="flex flex-col gap-4">
              <h2>
                Solstrøm fra anlegget:{" "}
                <span className="font-bold">
                  {solarCostPerKwh.toFixed(2)} kr/kWh
                </span>
              </h2>
              <h2>
                Strøm fra nettet i dag:{" "}
                <span className="font-bold">
                  {(elPrice + elNetPrice).toFixed(2)} kr/kWh
                </span>
              </h2>
              <h2>
                Forskjell:{" "}
                <span className="font-bold">
                  {(elPrice + elNetPrice - solarCostPerKwh).toFixed(2)} kr/kWh
                </span>
              </h2>
              <h2 className="my-4">
                Ser vi på hele effektgaranti perioden på{" "}
                <span className="font-bold">30 år</span>, og tar med service,
                vedlikehold og komponentbytter, ender energikostnaden fra dette
                solcelleanlegget på{" "}
                <span className="font-bold">
                  {solarCostPerKwh.toFixed(2)} kr
                </span>{" "}
                per kWh. Strømprisen fra nettet varierer derimot over tid, og
                ingen vet nøyaktig hva den vil være neste år eller årene
                fremover. Under kan du selv justere sliderne for
                strømpris/nettleie/vekst og se hvordan regnestykket endrer seg
                direkte.
              </h2>
            </div>

            <section className="!p-0 flex flex-row gap-8">
              <div className="flex flex-col gap-12 w-full max-w-md">
                <div>
                  <h2 className="fatP">
                    Strømpris per kWh:{" "}
                    <strong className="font-bold">{elPrice} kr/kWh</strong>
                  </h2>
                  <input
                    className="w-full"
                    type="range"
                    value={elPrice}
                    min={0.1}
                    max={2}
                    step={0.05}
                    onChange={(e) => setElPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <h2 className="fatP">
                    Nettleie per kWh:{" "}
                    <strong className="font-bold">{elNetPrice} kr/kWh</strong>
                  </h2>
                  <input
                    className="w-full"
                    type="range"
                    value={elNetPrice}
                    min={0.1}
                    max={2}
                    step={0.05}
                    onChange={(e) => setElNetPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <h2 className="fatP">
                    Forventet årlig prisvekt på strøm:{" "}
                    <strong className="font-bold">
                      {expectedElPriceIncrease} %
                    </strong>
                  </h2>
                  <input
                    className="w-full"
                    type="range"
                    value={expectedElPriceIncrease}
                    min={0.1}
                    max={10}
                    step={0.05}
                    onChange={(e) =>
                      setExpectedElPriceIncrease(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <SpotPriceWidget
                  setElPrice={setElPrice}
                  site={config.site}
                  solarLocation={config.solarLocation}
                />
              </div>
            </section>

            <h2>
              Med en forventet årlig prisvekst på strøm på{" "}
              <span className="font-bold">{expectedElPriceIncrease} %</span> vil
              en strømpris på{" "}
              <span className="font-bold">
                {(elPrice + elNetPrice).toFixed(2)} kr/kWh
              </span>{" "}
              i dag tilsvare omtrent{" "}
              <span className="font-bold">
                {futureGridPrice.toFixed(2)} kr/kWh
              </span>{" "}
              om 30 år, mens strømmen fra dette solcelleanlegget produseres til
              ca.{" "}
              <span className="font-bold">
                {solarCostPerKwh.toFixed(2)} kr/kWh
              </span>{" "}
              over hele levetiden.
            </h2>

            <SolarEconomicCalculation
              yearlyProduction={estimateData?.yearly_prod || 0}
              elPrice={elPrice}
              elNetPrice={elNetPrice}
              expectedElPriceIncrease={expectedElPriceIncrease}
              investmentCost={
                estimateData?.private
                  ? estimateData?.price_data?.total || 0
                  : Number(estimateData?.price_data?.["total inkl. alt"]) -
                      Number(enovaSupport()) || 0
              }
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

          <section className="flex lg:hidden flex-col gap-6 !p- sectionContainer0">
            <h4>
              <strong>Miljø</strong>
            </h4>

            <div>
              <p>
                Ved å satse på solenergi investerer du i mer enn bare strøm – du
                tar et viktig steg mot en{" "}
                <strong className="font-semibold">bærekraftig fremtid.</strong>
              </p>
              <br />
              <p>
                Strømmen som solcellene produserer kan drive alt som går på
                strøm i bygget ditt. Her er noen eksempler på hva de{" "}
                <strong className="font-semibold">
                  {formatValue(Number(estimateData?.yearly_prod).toFixed(0))}{" "}
                  kWh
                </strong>{" "}
                du produserer årlig kan drifte:
              </p>
            </div>

            <div className="flex flex-row gap-10 !p-4">
              <div>
                <li>Elbil-ladninger:</li>
                <li>Kjøleskap:</li>
                <li>Kaffekopper:</li>
              </div>
              <div>
                <p>
                  <strong className="font-semibold">
                    {Number(estimateData?.yearly_prod / 60).toFixed(0)}
                  </strong>{" "}
                  full ladninger til elbilen din.
                </p>
                <p>
                  drive{" "}
                  <strong className="font-semibold">
                    {Number(estimateData?.yearly_prod / 300).toFixed(0)}
                  </strong>{" "}
                  kjøleskap på et år.
                </p>
                <p>
                  brygge{" "}
                  <strong className="font-semibold">
                    {Number(estimateData?.yearly_prod / 0.03).toFixed(0)}
                  </strong>{" "}
                  kopper kaffe.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#4D4D4D] maxSection items-center w-full flex justify-center">
            <section className="w-full flex flex-col gap-8 self-center">
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-24 lg:gap-y-24 gap-16">
                {/* Bestill anlegg */}
                <div className="order-2 lg:order-2 flex flex-col gap-6">
                  {/* <h5 className="text-white">
                    <strong>Bestill anlegg</strong>
                  </h5> */}

                  <div>
                    {estimateData?.private ? (
                      // Næringskunde: Kun total eks. mva
                      <div className="flex flex-col">
                        <h5 className="text-white mb-2">
                          <strong>Samlet total kostnad</strong>
                        </h5>
                        <div className="flex flex-row justify-between">
                          <h1 className="fatP text-white">
                            Komplett ferdig installert anlegg eks. mva
                          </h1>
                          <h1 className="fatP text-white">
                            <strong>
                              {formatValue(
                                Number(estimateData?.price_data?.total),
                              )}{" "}
                              kr
                            </strong>
                          </h1>
                        </div>
                        <div className="w-full h-2 bg-green-300 rounded-full mb-2 mt-2" />
                        <div className="w-24 h-2 bg-green-300 self-end rounded-full" />
                      </div>
                    ) : (
                      // Privatperson: Total inkl. mva og Enova-støtte
                      <div className="flex flex-col">
                        <h5 className="text-white mb-2">
                          <strong>Samlet total kostnad</strong>
                        </h5>
                        <div className="flex flex-row justify-between">
                          <h1 className="fatP text-white">
                            Komplett ferdig installert anlegg
                          </h1>
                          <h1 className="fatP text-white">
                            <strong>
                              {formatValue(
                                Number(
                                  estimateData?.price_data?.["total inkl. alt"],
                                ),
                              )}{" "}
                              kr
                            </strong>
                          </h1>
                        </div>
                        <div className="w-full h-2 bg-green-300 rounded-full mb-6 mt-2" />
                        <div className="flex flex-row justify-between">
                          <h1 className="fatP text-white">Enova støtte</h1>
                          <h1 className="fatP text-white">
                            -{" "}
                            <strong>
                              {formatValue(Number(enovaSupport()))} kr
                            </strong>
                          </h1>
                        </div>
                        <div className="w-full h-2 bg-green-300 rounded-full mb-6 mt-2" />
                        <div className="flex flex-row justify-between">
                          <h1 className="fatP text-white">
                            Totalkostnad inkl. mva
                          </h1>
                          <h1 className="fatP text-white">
                            <strong>
                              {formatValue(
                                Number(
                                  estimateData?.price_data?.["total inkl. alt"],
                                ) - Number(enovaSupport()),
                              )}{" "}
                              kr
                            </strong>
                          </h1>
                        </div>
                        <div className="w-full h-2 bg-green-300 rounded-full mb-2 mt-2" />
                        <div className="w-24 h-2 bg-green-300 self-end rounded-full" />
                      </div>
                    )}
                  </div>

                  {finished ? (
                    <a
                      href={`${estimateId}/kjoepsavtale`}
                      target="_blank"
                      className="bg-[#FFB356] text-white fatP self-end rounded-full w-fit px-5 py-1 hover:bg-black"
                    >
                      Signer dokument
                    </a>
                  ) : (
                    <a
                      className="text-white"
                      href={"/kjopsbetingelser"}
                      target="_blank"
                    >
                      <span className="underline font-semibold">
                        Les vilkår og betingelser
                      </span>{" "}
                      for
                      <br />
                      kjøp av solcelleanlegg
                    </a>
                  )}
                </div>

                <div className="order-2 lg:hidden flex flex-col gap-5 text-white">
                  <h5 className="font-bold text-lg">
                    <strong>
                      Vil du vurdere finansiering av solcelleanlegget?
                    </strong>
                  </h5>
                  <p className="fatP">
                    Med finansiering kan du fordele betalingen over tid. I
                    enkelte tilfeller kan den årlige besparelsen fra
                    solcelleanlegget være høyere enn kostnaden på lånet samme
                    år, slik at investeringen kan gå i pluss allerede fra første
                    år.
                  </p>
                  <Link
                    className="rounded-full bg-[#FF5154] aspect-square h-24 w-24 items-center justify-center text-center flex underline"
                    target="_blank"
                    href={
                      config.site === "MinelSol"
                        ? "https://minel.no/finansiering-betal-i-ditt-tempo"
                        : "https://www.dnb.no/lan/refinansiering/miljoland"
                    }
                  >
                    Søk her
                  </Link>
                </div>

                {/* Inkludert i prisen */}
                <div className="order-3 lg:order-1 flex flex-col gap-3">
                  <h5 className="text-white">
                    <strong>Inkludert i prisen</strong>
                  </h5>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCheck.png" />
                    <p className="fatP text-white">
                      Montering av komplett solcelleanlegg.
                    </p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCheck.png" />
                    <p className="fatP text-white">
                      Veiledning til å søke om Enova-støtte.
                    </p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCheck.png" />
                    <p className="fatP text-white">
                      App til å følge produksjonen din.
                    </p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCheck.png" />
                    <p className="fatP text-white">
                      Kundestøtte og service etter installasjon.
                    </p>
                  </div>
                </div>

                {/* Hvorfor velge oss */}
                <div className="order-4 lg:order-3 flex flex-col gap-3">
                  <h5 className="text-white">
                    <strong>Hvorfor velge oss som er lokal installatør?</strong>
                  </h5>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCircle.png" />
                    <p className="text-white">
                      <strong className="font-semibold">
                        Personlig oppfølging
                      </strong>{" "}
                      – hos oss har du én fast kontaktperson, ikke et
                      kundesenter.
                    </p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCircle.png" />
                    <p className="text-white">
                      <strong className="font-semibold">Rask service</strong> –
                      vi er i nærheten, så du får rask hjelp både før og etter
                      installasjon.
                    </p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCircle.png" />
                    <p className="text-white">
                      <strong className="font-semibold">
                        Kvalitet og trygghet
                      </strong>{" "}
                      – lokale fagfolk med kunnskap om området og strømnettet.
                    </p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCircle.png" />
                    <p className="text-white">
                      <strong className="font-semibold">
                        Langsiktig samarbeid
                      </strong>{" "}
                      – vi blir ikke borte etter installasjon.
                    </p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <img src="/estimate/greenCircle.png" />
                    <p className="text-white">
                      <strong className="font-semibold">
                        Konkurransedyktig pris{" "}
                      </strong>
                      – vi har ingen dyre mellomledd.
                    </p>
                  </div>
                </div>

                {/* Miljø */}
                <div className="order-1 lg:order-4 hidden lg:flex flex-col gap-6 text-white">
                  <h5>
                    <strong>Miljø</strong>
                  </h5>

                  <div>
                    <p>
                      Ved å satse på solenergi investerer du i mer enn bare
                      strøm – du tar et viktig steg mot en{" "}
                      <strong className="font-semibold">
                        bærekraftig fremtid.
                      </strong>
                    </p>
                    <br />
                    <p>
                      Strømmen som solcellene produserer kan drive alt som går
                      på strøm i bygget ditt. Her er noen eksempler på hva de{" "}
                      <strong className="font-semibold">
                        {formatValue(
                          Number(estimateData?.yearly_prod).toFixed(0),
                        )}{" "}
                        kWh
                      </strong>{" "}
                      du produserer årlig kan drifte:
                    </p>
                  </div>

                  <div className="flex flex-row gap-10 !p-4">
                    <div>
                      <li>Elbil-ladninger:</li>
                      <li>Kjøleskap:</li>
                      <li>Kaffekopper:</li>
                    </div>
                    <div>
                      <p>
                        <strong className="font-semibold">
                          {Number(estimateData?.yearly_prod / 60).toFixed(0)}
                        </strong>{" "}
                        full ladninger til elbilen din.
                      </p>
                      <p>
                        drive{" "}
                        <strong className="font-semibold">
                          {Number(estimateData?.yearly_prod / 300).toFixed(0)}
                        </strong>{" "}
                        kjøleskap på et år.
                      </p>
                      <p>
                        brygge{" "}
                        <strong className="font-semibold">
                          {Number(estimateData?.yearly_prod / 0.03).toFixed(0)}
                        </strong>{" "}
                        kopper kaffe.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 mt-12 text-white">
                    <h5 className="font-bold text-lg">
                      <strong>
                        Vil du vurdere finansiering av solcelleanlegget?
                      </strong>
                    </h5>
                    <p className="fatP">
                      Med finansiering kan du fordele betalingen over tid. I
                      enkelte tilfeller kan den årlige besparelsen fra
                      solcelleanlegget være høyere enn kostnaden på lånet samme
                      år, slik at investeringen kan gå i pluss allerede fra
                      første år.
                    </p>
                    <Link
                      className="rounded-full bg-[#FF5154] aspect-square h-24 w-24 items-center justify-center text-center flex underline self-end"
                      target="_blank"
                      href={
                        config.site === "MinelSol"
                          ? "https://minel.no/finansiering-betal-i-ditt-tempo"
                          : "https://www.dnb.no/lan/refinansiering/miljolan"
                      }
                    >
                      Søk her
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mx-auto lg:mr-0 flex flex-row gap-4 items-center my-12">
                <img src="/estimate/techIcon.png" className="h-20" />
                <div>
                  <p className="font-light text-white mb-2">
                    TEKNISK KONSULENT
                  </p>
                  <h2 className="text-white ">
                    <strong className="font-semibold">
                      {estimateData?.leads?.created_by?.name}
                    </strong>
                  </h2>
                  <h2 className="text-white ">{config.footer.email}</h2>
                  <h2 className="text-white ">
                    {estimateData?.leads?.created_by?.phone}
                  </h2>
                </div>
              </div>
            </section>
          </section>
        </main>
      ) : (
        <p>No estimate found.</p>
      )}
    </main>
  );
}

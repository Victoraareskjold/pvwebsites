"use client";

import { useSiteConfig } from "../contexts/siteConfigContext";
import { EstimateInfoComponent } from "./EstimateInfoComponent";
import EstimatePricingInfo from "./EstimatePricingInfo";
import { useState, useEffect } from "react";

import "./estimate.css";
import HowWillItLook from "./estimate/HowWillItLook";
import HowDoesItWork from "./estimate/HowDoesItWork";
import YourSolarFacility from "./estimate/YourSolarFacility";
import SolarEconomicCalculation from "./estimate/SolarEconomicCalculation";

export default function EstimateView({ estimateId }) {
  const config = useSiteConfig();
  const [estimateData, setEstimateData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const [elPrice, setElPrice] = useState(
    estimateData?.selected_el_price || 0.5
  );
  const [elNetPrice, setElNetPrice] = useState(
    estimateData?.selected_el_price + 0.5 || 0,
    62
  );
  const [expectedElPriceIncrease, setExpectedElPriceIncrease] = useState(2, 5);
  const [paymentTime, setPaymentTime] = useState(null);
  const [widthPercentage, setWidthPercantage] = useState(
    (paymentTime / 30) * 100
  );

  const [economySummary, setEconomySummary] = useState(null);

  useEffect(() => {
    if (estimateData?.selected_el_price !== undefined) {
      setElPrice(estimateData.selected_el_price);
      setElNetPrice(estimateData.selected_el_price) + 0.5;
    }
  }, [estimateData]);

  useEffect(() => {
    if (paymentTime) {
      setWidthPercantage((paymentTime / 30) * 100);
    }
  }, [paymentTime]);

  if (loading || !estimateData) {
    return (
      <div className="min-h-screen text-center flex justify-center items-center">
        Laster inn estimat..
      </div>
    );
  }

  const panelType = estimateData?.selected_panel_type;
  const match = panelType?.match(/\d+/);
  const watt = match ? Number(match[0]) : 0;

  const formatValue = (number) =>
    number.toLocaleString("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const inverter = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "inverter"
  );

  const getPanelWp = (panelName) => {
    // Regex for å finne tall etter W eller w (f.eks. "Premium 415 W" → 415)
    const match = panelName.match(/(\d+)\s*[Ww]/);
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
    const eligibleKwp = Math.min(
      getkWp(estimateData?.selected_panel_type, estimateData?.total_panels) ??
        0,
      15
    );
    return (eligibleKwp * 2500).toFixed(2);
  };

  return (
    <main className="min-h-screen estimateStylingSheet ">
      {estimateData ? (
        <main className="flex flex-col gap-12 lg:gap-4 items-center">
          <section>
            <h2>
              Beregningen er utført for en{" "}
              <strong>
                {estimateData?.leads?.company ? "næringskunde" : "privatperson"}
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
              <p className="font-light text-lg text-gray-900">
                Her er ditt tilbud på et komplett solcelleanlegg fra{" "}
                <span className="font-medium">
                  {config.title || "mangler firma"}.
                </span>
              </p>
            </div>
          </section>

          <section>
            <h5 className="mb-4">
              <strong>Hvordan funker dette?</strong>
            </h5>
            <HowDoesItWork />
          </section>

          <div className="flex flex-col lg:flex-row sectionContainer bg-[#FFF0CD] rounded-md !p-0 gap-4">
            <HowWillItLook estimateData={estimateData} />

            <section className="w-full">
              <h5 className="mb-8">
                <strong>Ditt solcelleanlegg består av</strong>
              </h5>
              <YourSolarFacility estimateData={estimateData} />
            </section>
          </div>

          {/* <section className="hidden lg:block ">
            <div className="w-full h-1 bg-slate-300 rounded-full mt-12" />
          </section> */}

          <div className="flex flex-col lg:grid lg:grid-cols-2 sectionContainer bg-[#FFF0CD] rounded-md gap-12">
            {/* Strømpris og besparelse */}
            <div className="w-full">
              <div className="flex flex-col gap-4">
                <h5 className="!font-bold">
                  <strong>Produksjon og besparelse</strong>
                </h5>
                <h2>
                  Det er umulig å beregne helt nøyaktig hvor mye man vil spare
                  med solceller siden strømprisene svinger, men trenden viser at
                  de sannsynligvis vil stige over tid. Med en effektgaranti på
                  30 år har vi laget et regnestykke som inkluderer strømpris,
                  nettleie, forventet prisvekst, vedlikeholds- og
                  erstatningskostnader, samt naturlig degradering og årlig
                  produksjon. Dette gir et realistisk bilde av hva du kan tjene
                  eller spare over anleggets levetid. Nedenfor finner du slidere
                  med våre anbefalte verdier, men du kan enkelt justere tallene
                  etter egne forutsetninger og se hvordan regnestykket endrer
                  seg.
                </h2>
              </div>

              <div className="gap-8 mt-12 flex flex-col">
                <div>
                  <p className="fatP">
                    Strømpris per kWh:{" "}
                    <strong>
                      {elPrice || estimateData?.selected_el_price} kr/kWh
                    </strong>
                  </p>
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
                  <p className="fatP">
                    Nettleie per kWh:{" "}
                    <strong>
                      {elNetPrice || estimateData?.selected_el_price} kr/kWh
                    </strong>
                  </p>
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
                  <p className="fatP">
                    Forventet årlig prisvekt på strøm:{" "}
                    <strong>
                      {expectedElPriceIncrease ||
                        estimateData?.selected_el_price}{" "}
                      %
                    </strong>
                  </p>
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
            </div>

            <div className="flex flex-col w-full gap-8">
              <section className="w-full !p-0">
                <div className="bg-green-200 p-2 mt-8">
                  <h1>
                    Forventet årlig produksjon fra anlegget:{" "}
                    <strong>
                      {formatValue(
                        Number(estimateData?.yearly_prod?.toFixed(0))
                      )}{" "}
                      kWh per år.
                    </strong>
                  </h1>
                </div>
                <div className="flex flex-col gap-4 mt-6 p-4 rounded-lg shadow-lg bg-white pb-8">
                  <div>
                    <p className="fatP">
                      Nedbetalingstid (estimert):{" "}
                      <span className="font-extrabold text-lg">
                        {paymentTime} år
                      </span>
                    </p>
                    <div
                      style={{
                        width: `${widthPercentage}%`,
                      }}
                      className="bg-green-300 border border-green-800 rounded-xl h-10"
                    ></div>
                  </div>

                  <div>
                    <p className="">
                      Produktgaranti solcellepaneler:{" "}
                      <span className="font-medium text-md">25 år</span>
                    </p>
                    <div className="bg-orange-200 border border-orange-300 rounded-xl h-10 w-3/5"></div>
                  </div>

                  <div>
                    <p className="">
                      Effektgaranti solcellepaneler:{" "}
                      <span className="font-medium text-md">30 år</span>
                    </p>
                    <div className="bg-orange-300 border border-orange-400 rounded-xl h-10 w-4/5"></div>
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
                <div className="grid grid-cols-2 justify-between gap-4 mt-12">
                  <EstimatePricingInfo
                    image={"/estimate/icon1.png"}
                    number={`${formatValue(
                      economySummary?.totalSavings30Years || 0
                    )} kr`}
                    text={"Total besparing for ditt anlegg over 30 år."}
                  />

                  <EstimatePricingInfo
                    image={"/estimate/icon2.png"}
                    number={`${formatValue(
                      economySummary?.averageYearlySavings || 0
                    )} kr`}
                    text={"Årlig besparing per år for ditt anlegg."}
                  />
                </div>
              </section>
            </div>

            <SolarEconomicCalculation
              yearlyProduction={estimateData?.yearly_prod || 0}
              elPrice={elPrice}
              elNetPrice={elNetPrice}
              expectedElPriceIncrease={expectedElPriceIncrease}
              investmentCost={
                estimateData?.price_data?.["total inkl. alt"] || 0
              }
              inverterCost={inverter?.priceWithMarkup || 0}
              onPaybackCalculated={(data) => {
                setPaymentTime((prev) =>
                  prev !== data.paybackYear ? data.paybackYear : prev
                );
                setEconomySummary((prev) =>
                  prev?.totalSavings30Years !== data.totalSavings30Years
                    ? data
                    : prev
                );
              }}
            />

            <section className="flex flex-col gap-6 !p-0">
              <h2>Miljø</h2>

              <div>
                <p>
                  Ved å satse på solenergi investerer du i mer enn bare strøm –
                  du tar et viktig steg mot en{" "}
                  <strong className="font-semibold">
                    bærekraftig fremtid.
                  </strong>
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
          </div>

          <section className="bg-[#4D4D4D] maxSection items-center w-full flex justify-center">
            <section className="w-full flex flex-col gap-8 self-center">
              <h2 className="text-white">Bestill anlegg</h2>

              <div>
                {estimateData?.leads?.company ? (
                  // Næringskunde: Kun total eks. mva
                  <div className="flex flex-row justify-between">
                    <p className="fatP text-white">
                      Komplett ferdig installert anlegg eks. mva
                    </p>
                    <p className="fatP text-white">
                      {formatValue(
                        Number(
                          estimateData?.price_data?.["total eks mva"] ||
                            estimateData?.price_data?.["total inkl. alt"]
                        )
                      )}{" "}
                      kr
                    </p>
                  </div>
                ) : (
                  // Privatperson: Total inkl. mva og Enova-støtte
                  <>
                    <div className="flex flex-row justify-between">
                      <p className="fatP text-white">
                        Komplett ferdig installert anlegg
                      </p>
                      <p className="fatP text-white">
                        {formatValue(
                          Number(estimateData?.price_data?.["total inkl. alt"])
                        )}{" "}
                        kr
                      </p>
                    </div>
                    <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                    <div className="flex flex-row justify-between">
                      <p className="fatP text-white">Enova støtte</p>
                      <p className="fatP text-white">
                        - {formatValue(Number(enovaSupport()))} kr
                      </p>
                    </div>
                    <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                    <div className="flex flex-row justify-between mb-8">
                      <p className="fatP text-white">Totalkostnad inkl. mva</p>
                      <p className="fatP text-white">
                        {formatValue(
                          Number(
                            estimateData?.price_data?.["total inkl. alt"]
                          ) - Number(enovaSupport())
                        )}{" "}
                        kr
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-row items-center gap-4">
                <input type="checkbox" className="rounded-checkbox"></input>
                <p className="text-white">
                  <strong>Jeg godtar</strong> vilkår og betingelser for kjøp av
                  solcelleanlegg
                </p>
              </div>
              <button className="bg-orange-300 text-white fatP rounded-full w-fit px-5 py-1">
                Bestill anlegg
              </button>

              <h2 className="text-white">Inkludert i prisen</h2>
              <div className="flex flex-col gap-3">
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

              <h2 className="text-white">
                Hvorfor velge oss som er lokal installatør?
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-4 items-center">
                  <img src="/estimate/greenCircle.png" />
                  <p className="text-white">
                    <strong>Personlig oppfølging</strong> – hos oss har du én
                    fast kontaktperson, ikke et kundesenter.
                  </p>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <img src="/estimate/greenCircle.png" />
                  <p className="text-white">
                    <strong>Rask service</strong> – vi er i nærheten, så du får
                    rask hjelp både før og etter installasjon.
                  </p>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <img src="/estimate/greenCircle.png" />
                  <p className="text-white">
                    <strong>Kvalitet og trygghet</strong> – lokale fagfolk med
                    kunnskap om området og strømnettet.
                  </p>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <img src="/estimate/greenCircle.png" />
                  <p className="text-white">
                    <strong>Langsiktig samarbeid</strong> – vi blir ikke borte
                    etter installasjon.
                  </p>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <img src="/estimate/greenCircle.png" />
                  <p className="text-white">
                    <strong>Konkurransedyktig pris </strong> – vi har ingen dyre
                    mellomledd.
                  </p>
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

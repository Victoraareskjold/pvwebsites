"use client";

import { useSiteConfig } from "../contexts/siteConfigContext";
import { EstimateInfoComponent } from "./EstimateInfoComponent";
import EstimatePricingInfo from "./EstimatePricingInfo";
import { useState, useEffect } from "react";

import "../app/estimate.css";

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
    estimateData?.selected_el_price || 0.7
  );
  const [elNetPrice, setElNetPrice] = useState(
    estimateData?.selected_el_price + 0.5 || 0.75
  );
  const [paymentTime, setPaymentTime] = useState(10);
  const [widthPercentage, setWidthPercantage] = useState(
    (paymentTime / 30) * 100
  );

  useEffect(() => {
    if (estimateData?.selected_el_price !== undefined) {
      setElPrice(estimateData.selected_el_price);
      setElNetPrice(estimateData.selected_el_price) + 0.5;
    }
  }, [estimateData]);

  if (loading) {
    return (
      <div className="min-h-screen text-center flex justify-center items-center">
        Laster inn estimat..
      </div>
    );
  }

  const panelType = estimateData?.selected_panel_type;
  const match = panelType?.match(/\d+/);
  const watt = match ? Number(match[0]) : 0;

  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

  const inverter = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "inverter"
  );

  if (loading) return <p>Loading..</p>;

  //            <div className="hidden lg:block w-full h-1 bg-slate-300 rounded-full mt-12" />

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
            <h1 className="mb-4">Hei {estimateData?.leads?.person_info}</h1>
            <div>
              <p className="font-light text-lg text-gray-900">
                Her er ditt tilbud på et komplett solcelleanlegg fra{" "}
                <span className="font-medium">
                  {config.title || "mangler firma"}
                </span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Hvordan funker dette?</h2>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-4">
                <img src="/estimate/checked.png" className="h-6 w-6" />
                <p className="font-light">Du har mottat ditt tilbud.</p>
              </div>
              <div className="flex flex-row gap-4">
                <img src="/estimate/unchecked.png" className="h-6 w-6" />
                <p className="font-light">Befaring gjennomføres ved behov.</p>
              </div>
              <div className="flex flex-row gap-4">
                <img src="/estimate/unchecked.png" className="h-6 w-6" />
                <p className="font-light">
                  Montering til et tidspunkt som passer deg.
                </p>
              </div>
            </div>
            {/* <div className="hidden lg:block w-full h-1 bg-slate-300 rounded-full mt-6" /> */}
          </section>

          <div className="flex flex-col lg:flex-row sectionContainer !p-0 gap-4">
            <section className="w-full">
              <h2 className="">Hvordan vil dette se ut?</h2>
              <p>
                Basert på vår evaluering har vi plassert{" "}
                <strong>{estimateData?.total_panels}</strong> solcellepaneler
                hos dere som vil produsere rundt{" "}
                {formatValue(Number(estimateData?.yearly_prod.toFixed(0)))} kWh
                per år.
              </p>
              {estimateData.image_url ? (
                <div className="h-full">
                  <img
                    src={estimateData?.image_url}
                    alt="Bilde"
                    className="object-cover w-full h-full lg:max-h-96 rounded-2xl overflow-hidden mt-4"
                  />

                  <p className="italic">
                    Dette oppsettet er fleksibelt - vi tilpasser det etter dine
                    ønsker.
                  </p>
                </div>
              ) : null}
            </section>

            {/* {
              <div className="hidden lg:flex h-auto w-2 bg-slate-300 rounded-full" />
            } */}

            <section className="w-full">
              <h2 className="mb-8">Ditt solcelleanlegg består av</h2>
              <div className="flex flex-row gap-4">
                <div className="w-full mt-2">
                  <EstimateInfoComponent
                    text={"Installert effekt."}
                    number={`${(estimateData?.total_panels * watt) / 1000} kWp`}
                    image={"/estimate/info1.png"}
                  />
                  <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                  <EstimateInfoComponent
                    text={`${estimateData?.selected_panel_type} panel.`}
                    number={`${estimateData?.total_panels} stk -`}
                    image={"/estimate/info2.png"}
                  />
                  <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                  <EstimateInfoComponent
                    text={`- ${inverter?.product + " inverter" || "Inverter"} `}
                    number={`${inverter?.quantity || 0} stk`}
                    image={"/estimate/info3.png"}
                  />

                  <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                  <EstimateInfoComponent
                    text={`- ${estimateData?.price_data?.mounting[0].product} feste`}
                    number={`${estimateData?.price_data?.mounting[0].quantity} stk`}
                    image={"/estimate/info4.png"}
                  />
                </div>
                <img src="/estimate/bigIllustration.png" />
              </div>
            </section>
          </div>

          {/* <section className="hidden lg:block ">
            <div className="w-full h-1 bg-slate-300 rounded-full mt-12" />
          </section> */}

          <div className="flex flex-col lg:flex-row sectionContainer gap-4">
            <h5 className="!font-bold">Produksjon og besparelse</h5>
            <h2>
              Det er umulig å beregne helt nøyaktig hvor mye man vil spare med
              solceller siden strømprisene svinger, men trenden viser at de
              sannsynligvis vil stige over tid. Med en effektgaranti på 30 år
              har vi laget et regnestykke som inkluderer strømpris, nettleie,
              forventet prisvekst, vedlikeholds- og erstatningskostnader, samt
              naturlig degradering og årlig produksjon. Dette gir et realistisk
              bilde av hva du kan tjene eller spare over anleggets levetid.
              Nedenfor finner du slidere med våre anbefalte verdier, men du kan
              enkelt justere tallene etter egne forutsetninger og se hvordan
              regnestykket endrer seg.
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row sectionContainer gap-4">
            <div className="flex flex-col w-full gap-8">
              <section className="flex flex-col gap-4 !p-0 w-full">
                <h2 className="">Investering og nedbetalingstid</h2>

                <div className="bg-white rounded-2xl w-full p-4">
                  <h3>Totalpris inkl. mva og Enova-tilskudd</h3>
                  <p className="italic smallP">
                    Enova Støtte:{" "}
                    <span className="text-lg font-regular">
                      -{formatValue(1234567890)} kr
                    </span>
                  </p>
                  <p className="mt-4">
                    Pris:{" "}
                    <span className="font-bold text-2xl">
                      {formatValue(12345678990)} Kr
                    </span>
                  </p>
                </div>

                <div className="bg-green-300 w-full p-4 rounded-2xl">
                  <h3 className="">Finansiering med Grønt boliglån</h3>
                  <p className="italic smallP">
                    Enova Støtte:{" "}
                    <span className="text-lg font-regular">
                      -{formatValue(1234567890)} kr
                    </span>
                  </p>
                  <div className="p-3">
                    <p className="smallP italic mb-1">Nominell rente: 5,39%</p>
                    <p className="smallP italic">Nedbetalingstid: 30 år</p>
                  </div>
                  <p>
                    Pris per måned:{" "}
                    <span className="font-bold text-2xl">
                      {formatValue(420)}kr
                    </span>
                  </p>
                </div>

                <p className="">
                  Vi estimerer ca.{" "}
                  <span className="font-medium">0,70 kr/kWh</span> for strøm og{" "}
                  <span className="font-medium">kr/kWh</span> for nettleie de
                  neste <span className="font-medium">30 årene</span>.
                </p>
              </section>

              <section className="!p-0 mt-4">
                <div className="bg-white rounded-xl px-3 py-5 w-full flex flex-col gap-4">
                  <p className="italic text-gray-900">
                    Estimer strøm- og nettleieprisen selv, og beregn
                    nedbetalingstiden for et direktekjøp ved å bruke sliderne
                    under.
                  </p>

                  <div>
                    <p className="fatP">
                      Gjennomsnittlig strømpris de neste 30 årene:{" "}
                      {elPrice || estimateData?.selected_el_price} kr/kWh
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
                      Gjennomsnittlig strømpris de neste 30 årene:{" "}
                      {elNetPrice || estimateData?.selected_el_price} kr/kWh
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

                  <div className="flex flex-col gap-4 mt-6">
                    <div>
                      <p className="fatP">
                        Nedbetalingstid:{" "}
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
                        <span className="font-medium text-md">40-50+ år</span>
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
                </div>
              </section>
            </div>

            {/* <div className="hidden lg:flex h-auto w-2 bg-slate-300 rounded-full" /> */}

            <div className="flex flex-col w-full gap-8">
              <section className="w-full !p-0">
                <h2>Hvor mye kan jeg spare?</h2>
                <div className="grid grid-cols-2 justify-between gap-4 mt-12">
                  <EstimatePricingInfo
                    image={"/estimate/icon1.png"}
                    number={`${formatValue(0)} kr`}
                    text={"Total besparing for ditt anlegg over 30 år."}
                  />
                  <EstimatePricingInfo
                    image={"/estimate/icon2.png"}
                    number={`${formatValue(0)} kr`}
                    text={"Årlig besparing per år for ditt anlegg."}
                  />
                  <EstimatePricingInfo
                    image={"/estimate/icon3.png"}
                    number={`${10}-${20}%`}
                    text={
                      "Økning i boligverdien, basert på investeringskostnaden."
                    }
                  />
                  <EstimatePricingInfo
                    image={"/estimate/icon4.png"}
                    number={`${10}-${20}%`}
                    text={
                      "Andel eget forbruk indikerer hvor mye selvprodusert energi du bruker."
                    }
                  />
                </div>
                <div className="italic mt-4 flex flex-col gap-1">
                  <p className="mb-1">Tallene ovenefor er basert på:</p>
                  <li>
                    Årlig forbruk:{" "}
                    <strong>
                      {formatValue(
                        Number(estimateData?.yearly_prod).toFixed(0)
                      )}{" "}
                      kWh
                    </strong>
                  </li>
                  <li>
                    Årlig produksjon:{" "}
                    <strong>
                      {formatValue(
                        Number(estimateData?.yearly_prod).toFixed(0)
                      )}{" "}
                      kWh
                    </strong>
                  </li>
                  <li>
                    Snittpris (strømpris + nettleie) neste 30 år:{" "}
                    <strong>{(elPrice + elNetPrice).toFixed(2)} kr</strong>
                  </li>
                </div>
              </section>

              <section className="flex flex-col gap-6 !p-0">
                <h2>Miljø</h2>

                <div>
                  <p>
                    Ved å satse på solenergi investerer du i mer enn bare strøm
                    – du tar et viktig steg mot en{" "}
                    <strong className="font-semibold">
                      bærekraftig fremtid for ditt nærmiljø.
                    </strong>
                  </p>
                  <br />
                  <p>
                    Strømmen som solcellene produserer kan drive alt som går på
                    strøm i huset ditt. Her er noen eksempler på hva de{" "}
                    <strong className="font-semibold">
                      {formatValue(
                        Number(estimateData?.yearly_prod).toFixed(0)
                      )}{" "}
                      kWh
                    </strong>{" "}
                    du produserer årlig kan drifte:
                  </p>
                </div>

                <div className="flex flex-row gap-10">
                  <div>
                    <li>Elbil-ladninger</li>
                    <li>Telefon-ladninger</li>
                    <li>Kjøleskap</li>
                    <li>Kaffekopper</li>
                  </div>
                  <div>
                    <p>
                      <strong className="font-semibold">310</strong> full
                      ladninger til elbilen din.
                    </p>
                    <p>
                      lade <strong className="font-semibold">310</strong>{" "}
                      mobiltelefoner.
                    </p>
                    <p>
                      drive <strong className="font-semibold">310</strong>{" "}
                      kjøleskap på et år
                    </p>
                    <p>
                      brygge <strong className="font-semibold">310</strong>{" "}
                      kopper kaffe.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="bg-slate-600 maxSection items-center w-full flex justify-center">
            <section className="w-full flex flex-col gap-8 self-center">
              <h2 className="text-white">Bestill anlegg</h2>
              <div>
                <div className="flex flex-row justify-between">
                  <p className="fatP text-white">
                    Komplett ferdig installert anlegg
                  </p>
                  <p className="fatP text-white">220 000 kr</p>
                </div>
                <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                <div className="flex flex-row justify-between">
                  <p className="fatP text-white">Enova støtte</p>
                  <p className="fatP text-white">-29 000 kr</p>
                </div>
                <div className="w-full h-2 bg-green-300 rounded-full my-6" />

                <div className="flex flex-row justify-between mb-8">
                  <p className="fatP text-white">
                    Pris etter fratrukket Enova støtte
                  </p>
                  <p className="fatP text-white">191 000 kr</p>
                </div>
              </div>
              <div>
                <div className="bg-green-300 w-full p-4 rounded-2xl">
                  <h3 className="">Finansiering med Grønt boliglån</h3>
                  <p className="italic smallP">
                    Enova Støtte:{" "}
                    <span className="text-lg font-regular">
                      -{formatValue(1234567890)} kr
                    </span>
                  </p>
                  <div className="p-3">
                    <p className="smallP italic mb-1">Nominell rente: 5,39%</p>
                    <p className="smallP italic">Nedbetalingstid: 30 år</p>
                  </div>
                  <p>
                    Pris per måned:{" "}
                    <span className="font-bold text-2xl">
                      {formatValue(420)}kr
                    </span>
                  </p>
                </div>
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
              <p className="text-white fatP text-center mt-32">
                Ved å velge solenergi, velger du en fremtid hvor naturen og
                fremgang går hånd i hånd.
              </p>
              <img
                src="/estimate/globe.png"
                className="w-4/5 self-center py-12"
              />
              <img src={config.logo} className="w-96" />
            </section>
          </section>
        </main>
      ) : (
        <p>No estimate found.</p>
      )}
    </main>
  );
}

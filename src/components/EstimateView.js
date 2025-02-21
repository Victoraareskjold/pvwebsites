"use client";

import { useSiteConfig } from "@/contexts/siteConfigContext";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { EstimateInfoComponent } from "./EstimateInfoComponent";
import EstimatePricingInfo from "./EstimatePricingInfo";
import { useState, useEffect } from "react";

export default function EstimateView({ estimateId }) {
  const config = useSiteConfig();

  const {
    data: estimateData,
    error,
    loading,
  } = useFirestoreDoc(db, "clients", estimateId);

  const [elPrice, setElPrice] = useState(estimateData?.selectedElPrice || 0.7);
  const [elNetPrice, setElNetPrice] = useState(
    estimateData?.selectedElPrice + 0.5 || 0.75
  );
  const [paymentTime, setPaymentTime] = useState(10);
  const [widthPercentage, setWidthPercantage] = useState(
    (paymentTime / 30) * 100
  );

  useEffect(() => {
    if (estimateData?.selectedElPrice !== undefined) {
      setElPrice(estimateData.selectedElPrice);
      setElNetPrice(estimateData.selectedElPrice) + 0.5;
    }
  }, [estimateData]);

  if (loading) {
    return (
      <div className="min-h-screen text-center flex justify-center items-center">
        Laster inn estimat..
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-center flex justify-center items-center">
        <p>Feil: {error?.message}</p>
      </div>
    );
  }

  const panelType = estimateData?.selectedPanelType;
  const match = panelType?.match(/\d+/);
  const watt = match ? Number(match[0]) : 0;

  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

  return (
    <main className="min-h-screen estimateStylingSheet">
      {estimateData ? (
        <section className="p-4 flex flex-col gap-12">
          <div>
            <p className="font-light">
              Beregningen er utført for en <strong>privatperson</strong> på
              følgende Adresse:{" "}
              <strong className="font-medium">
                {estimateData?.address || "Missing address"}
              </strong>
            </p>
          </div>

          <div>
            <h1 className="mb-4">Hei {estimateData?.name}</h1>
            <div>
              <p className="font-light text-lg text-gray-900">
                Her er ditt tilbud på et komplett solcelleanlegg fra{" "}
                <span className="font-medium">
                  {config.title || "Missing title"}
                </span>
              </p>
            </div>
          </div>

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
          </section>

          <section>
            <h2 className="">Hvordan vil dette se ut?</h2>
            <p>
              Basert på vår evaluering har vi plassert{" "}
              <strong>{estimateData?.totalPanels}</strong> solcellepaneler hos
              dere som vil produsere rundt{" "}
              {formatValue(Number(estimateData?.yearlyProd.toFixed(0)))} kWh per
              år.
            </p>
            {estimateData.imageUrl ? (
              <div>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mt-4">
                  <Image
                    src={estimateData?.imageUrl}
                    alt="Bilde"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="italic">
                  Dette oppsettet er fleksibelt - vi tilpasser det etter dine
                  ønsker.
                </p>
              </div>
            ) : null}
          </section>

          <section>
            <h2 className="mb-8">Ditt solcelleanlegg</h2>
            <div className="flex flex-row gap-4">
              <div className="w-full mt-2">
                <EstimateInfoComponent
                  text={"Installert effekt."}
                  number={`${(estimateData?.totalPanels * watt) / 1000} kWp`}
                  image={"/estimate/info1.png"}
                />
                <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                <EstimateInfoComponent
                  text={`${estimateData?.selectedPanelType} panel.`}
                  number={`${estimateData?.totalPanels} stk -`}
                  image={"/estimate/info2.png"}
                />
                <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                <EstimateInfoComponent
                  text={"- inverter."}
                  number={`IT 3 fas`}
                  image={"/estimate/info3.png"}
                />
                <div className="w-full h-2 bg-green-300 rounded-full my-6" />
                <EstimateInfoComponent
                  text={"- null takfeste"}
                  number={`${estimateData?.totalPanels} stk`}
                  image={"/estimate/info4.png"}
                />
              </div>
              <img src="/estimate/bigIllustration.png" />
            </div>
          </section>

          <section className="flex flex-col gap-4">
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

            <p className="">
              Vi estimerer ca. <span className="font-medium">0,70 kr/kWh</span>{" "}
              for strøm og <span className="font-medium">kr/kWh</span> for
              nettleie de neste <span className="font-medium">30 årene</span>.
            </p>
          </section>

          <section className="bg-white px-3 py-5 w-full flex flex-col gap-4 rounded-xl">
            <p className="italic text-gray-900">
              Estimer strøm- og nettleieprisen selv, og beregn nedbetalingstiden
              for et direktekjøp ved å bruke sliderne under.
            </p>

            <div>
              <p className="fatP">
                Gjennomsnittlig strømpris de neste 30 årene:{" "}
                {elPrice || estimateData?.selectedElPrice} kr/kWh
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
                {elNetPrice || estimateData?.selectedElPrice} kr/kWh
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
          </section>

          <section>
            <h2>Hvor mye kan jeg spare?</h2>
            <div className="grid grid-cols-2 justify-between gap-4 mt-12">
              <EstimatePricingInfo
                image={""}
                number={`${formatValue(0)} kr`}
                text={"Total besparing for ditt anlegg over 30 år."}
              />
              <EstimatePricingInfo
                image={""}
                number={`${formatValue(0)} kr`}
                text={"Årlig besparing per år for ditt anlegg."}
              />
              <EstimatePricingInfo
                image={""}
                number={`${10}-${20}%`}
                text={"Økning i boligverdien, basert på investeringskostnaden."}
              />
              <EstimatePricingInfo
                image={""}
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
                  {formatValue(Number(estimateData?.yearlyProd).toFixed(0))} kWh
                </strong>
              </li>
              <li>
                Årlig produksjon:{" "}
                <strong>
                  {formatValue(Number(estimateData?.yearlyProd).toFixed(0))} kWh
                </strong>
              </li>
              <li>
                Snittpris (strømpris + nettleie) neste 30 år:{" "}
                <strong>{(elPrice + elNetPrice).toFixed(2)} kr</strong>
              </li>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2>Miljø</h2>

            <div>
              <p>
                Ved å satse på solenergi investerer du i mer enn bare strøm – du
                tar et viktig steg mot en{" "}
                <strong className="font-semibold">
                  bærekraftig fremtid for ditt nærmiljø.
                </strong>
              </p>
              <br />
              <p>
                Strømmen som solcellene produserer kan drive alt som går på
                strøm i huset ditt. Her er noen eksempler på hva de{" "}
                <strong className="font-semibold">
                  {formatValue(Number(estimateData?.yearlyProd).toFixed(0))} kWh
                </strong>{" "}
                du produserer årlig kan drifte:
              </p>
            </div>

            <div className="flex flex-row gap-12">
              <div>
                <li>Elbil-ladninger</li>
                <li>Telefon-ladninger</li>
                <li>Kjøleskap</li>
                <li>Kaffekopper</li>
              </div>
              <div>
                <p>
                  <strong className="font-semibold">310</strong> full ladninger
                  til elbilen din.
                </p>
                <p>
                  lade <strong className="font-semibold">310</strong>{" "}
                  mobiltelefoner.
                </p>
                <p>
                  drive <strong className="font-semibold">310</strong> kjøleskap
                  på et år
                </p>
                <p>
                  brygge <strong className="font-semibold">310</strong> kopper
                  kaffe.
                </p>
              </div>
            </div>
          </section>
        </section>
      ) : (
        <p>No estimate found.</p>
      )}
    </main>
  );
}

"use client";

import { useSiteConfig } from "@/contexts/siteConfigContext";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { EstimateInfoComponent } from "./EstimateInfoComponent";
import EstimatePricingInfo from "./EstimatePricingInfo";

export default function EstimateView({ estimateId }) {
  const config = useSiteConfig();

  const {
    data: estimateData,
    error,
    loading,
  } = useFirestoreDoc(db, "clients", estimateId);

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

  return (
    <main className="min-h-screen">
      {estimateData ? (
        <section className="p-4 flex flex-col gap-8">
          <div>
            <p>
              Takk <strong>{estimateData?.name}</strong>, vi setter stor pris på
              din interesse og åpenhet for å utforske mer bærekraftige
              energiløsninger ved hjelp av{" "}
              {config.title || "Missing config title"}.
            </p>
          </div>

          <div className="w-full h-px bg-black" />

          <div>
            <h2>Hvordan funker dette?</h2>
            <div>
              <p>Du har mottatt ditt prisestimat.</p>
            </div>
          </div>

          <div>
            <h2>Hvordan vil dette se ut?</h2>
            <p>
              Basert på vår anbefaling har vi plassert{" "}
              <strong>{estimateData?.totalPanels}</strong> solcellepaneler.
              Dette estimatet er fleksibelt, så vi er klare til å tilpasse det
              etter dine behov.
            </p>
            {estimateData.imageUrl ? (
              <div className="relative w-full h-64 rounded-xl border-2 border-orange-200 overflow-hidden mt-4">
                <Image
                  src={estimateData?.imageUrl}
                  alt="Bilde"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>

          <div>
            <h2 className="mb-8">Ditt solcelleanlegg</h2>

            <div>
              <EstimateInfoComponent
                text={"System størrelse"}
                number={`${estimateData?.totalPanels} kWp`}
                image={"/estimate/info1.png"}
              />
              <div className="w-full h-2 bg-gray-400 rounded-full my-6" />
              <EstimateInfoComponent
                text={estimateData?.selectedPanelType}
                number={`x${estimateData?.totalPanels}`}
                image={"/estimate/info2.png"}
              />
              <div className="w-full h-2 bg-gray-400 rounded-full my-6" />
              <EstimateInfoComponent
                text={"Inverter Deye -"}
                number={`3 fas 230 V`}
                image={"/estimate/info3.png"}
              />
              <div className="w-full h-2 bg-gray-400 rounded-full my-6" />
              <EstimateInfoComponent
                text={"Estimert årlig produksjon"}
                number={`${estimateData?.yearlyProd.toFixed(0)} kWh`}
                image={"/estimate/info4.png"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <li>
              <a
                className="underline italic text-gray-500"
                target="_blank"
                href="https://www.lynelektrosol.no/produkter/solcellepanel-produkter"
              >
                Les mer om våre valg av solcellepaneler og inverter
              </a>
            </li>
            <li>
              <a
                className="underline italic text-gray-500"
                target="_blank"
                href="https://www.lynelektrosol.no/produkter/solcellepanel-produkter"
              >
                Studien som viser at solceller kan gi avkastning med 14%
              </a>
            </li>
            <li>
              <a
                className="underline italic text-gray-500"
                target="_blank"
                href="https://www.aib-net.org/"
              >
                CO2-besparelser beregnet fra www.aib-net.org.
              </a>
            </li>
          </div>

          <div>
            <h2>Garantier som følger med</h2>
            <p>
              Nedbetalingstid: <strong>5-15 år</strong>, varierer med strømpris
              og produksjon.
            </p>
          </div>

          <div>
            <h2>Hvor mye kan du spare?</h2>
            <div className="flex flex-row justify-between gap-4 mt-12">
              <EstimatePricingInfo
                image={""}
                number={0}
                text={"Total besparing for ditt anlegg over 30 år."}
              />
              <EstimatePricingInfo
                image={""}
                number={0}
                text={"Gjennomsnittlig årlig besparing for ditt anlegg."}
              />
            </div>
            <p className="opacity-60 italic mt-4">
              Beregningen baserer seg på en forventet gjennomsnittlig strømpris
              på <strong>1,1</strong> kr per kWh og en nettleie på{" "}
              <strong>0,67</strong> kr, gjeldende over de kommende 30 årene.
            </p>
          </div>

          <div className="bg-blue-200 p-8 rounded-3xl">
            <h2 className="mb-4">Total kostnad</h2>

            <div>
              <div>
                <h3>Komplett installasjon</h3>
                <p>Kr 123 456</p>
                <div className="w-full h-1 bg-black my-2" />
              </div>
              <div>
                <h3>Enova støtte</h3>
                <p>Kr 12 345</p>
                <div className="w-full h-1 bg-black my-2" />
              </div>
              <div>
                <h3>
                  <strong>Sluttkostnad ink. mva og enova</strong>
                </h3>
                <p>
                  <strong>Kr 123 456</strong>
                </p>
                <div className="w-full h-1 bg-black my-2" />
              </div>
            </div>

            <div className="bg-orange-200 px-6 py-4 border border-black rounded-xl mt-12">
              <h2>Er Miljølån noe for deg?</h2>
              <p className="mb-4">
                0,00 % nominell rente ut første halvår 2025.
              </p>
              <a
                className="bg-blue-200 px-4 py-1 border border-black rounded-xl"
                src="https://www.lynelektrosol.no/bloggposts/besparelser-fordeler/miljolan"
              >
                Trykk her for å lese mer
              </a>
            </div>
          </div>
        </section>
      ) : (
        <p>No estimate found.</p>
      )}

      {estimateData && <pre>{JSON.stringify(estimateData, null, 2)}</pre>}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSiteConfig } from "../../../../../contexts/siteConfigContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KjoepsavtaleView({ estimateId }) {
  const config = useSiteConfig();
  const router = useRouter();

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

  const panelItem = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "solcellepanel",
  );

  // 2. Hent ut produktnavnet (f.eks. "Trina Vertex TSM- 445W")
  const panelProduct = panelItem?.product || "";

  // 3. Regex for å finne Watt (leter etter tallet før 'W')
  const match = panelProduct.match(/(\d+)\s*W/i);
  const watt = match ? Number(match[1]) : 0;

  const inverter = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "inverter",
  );

  if (!estimateData || loading)
    return (
      <div className="min-h-screen estimateStylingSheet">
        <p className="pt-24 text-center">Laster estimat...</p>
      </div>
    );

  const formatValue = (number) =>
    number.toLocaleString("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const tos = "/tos.pdf";
  const withdrawalForm = "/withdrawalForm.pdf";

  const downloadPdf = (url, filename) => {
    // Laster ned PDF
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handleSignEstimate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/estimate/${estimateId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadEmail: estimateData?.leads.email,
          createdByEmail: estimateData?.leads.created_by.email,
        }),
      });
      if (!res.ok) console.error(res.error);
      console.log(res.json());
    } catch (err) {
      console.error(err);
    } finally {
      console.log("ferdy");
      router.push(`/estimat/${estimateId}/kjoepsavtale/takk`);
    }
  };

  return (
    <main className="min-h-screen estimateStylingSheet">
      <form
        className="pt-24 p-4 max-w-3xl mx-auto"
        onSubmit={handleSignEstimate}
      >
        <div>
          <h1 className="!text-4xl !font-medium">Kjøpsavtale</h1>
          <p className="!text-lg mt-2">
            Avtalen inngås mellom kunde og {config.site} AS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="bg-[#FFF7E4] p-4">
            <h2 className="border-b border-black">Kunde</h2>

            <div className="mt-5">
              <label className="text-sm text-gray-700">Navn</label>
              <p className="mt-1 border-b border-black !text-lg !font-medium">
                {estimateData.leads.person_info}
              </p>
            </div>

            <div className="mt-5">
              <label className="text-sm text-gray-700">Adresse</label>
              <p className="mt-1 border-b border-black !text-lg !font-medium">
                {estimateData.leads.address}
              </p>
            </div>

            {estimateData?.leads.company && (
              <div className="mt-5">
                <label className="text-sm text-gray-700">Firma Navn</label>
                <p className="mt-1 border-b border-black !text-lg !font-medium">
                  {estimateData.leads.company}
                </p>
              </div>
            )}
            {estimateData?.leads.org_nr && (
              <div className="mt-5">
                <label className="text-sm text-gray-700">Org.nr</label>
                <p className="mt-1 border-b border-black !text-lg !font-medium">
                  {estimateData.leads.org_nr}
                </p>
              </div>
            )}
          </div>
          <div className="bg-[#FFF7E4] p-4">
            <h2 className="border-b border-black">{config.legal}</h2>

            <div className="mt-5">
              <label className="text-sm text-gray-700">Adresse</label>
              <p className="mt-1 border-b border-black !text-lg !font-medium">
                {config.footer.address}
              </p>
            </div>

            <div className="mt-5">
              <label className="text-sm text-gray-700">Org.nr</label>
              <p className="mt-1 border-b border-black !text-lg !font-medium">
                {config.footer.organizationNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h2>Hva som er inkludert</h2>
          <ul className="list-disc mt-4 ml-6">
            <li>
              Installert effekt: <strong>{estimateData.kwp} kwp</strong>
            </li>

            {estimateData?.total_panels > 0 && panelProduct && (
              <li>
                Solcellepanel:{" "}
                <strong>
                  {estimateData.total_panels} stk, {panelProduct}
                </strong>
              </li>
            )}

            {inverter?.product && inverter?.quantity > 0 && (
              <li>
                Vekselretter/inverter:{" "}
                <strong>
                  {inverter?.product} stk, {inverter?.quantity}
                </strong>
              </li>
            )}

            {estimateData?.price_data?.mounting[0]?.quantity > 0 &&
              estimateData?.price_data?.mounting[0]?.product && (
                <li>
                  Festesystem:{" "}
                  <strong>
                    {estimateData?.price_data?.mounting[0]?.quantity} stk,{" "}
                    {estimateData?.price_data?.mounting[0]?.product}
                  </strong>
                </li>
              )}
          </ul>
          <ul className="list-disc mt-4 ml-6">
            <li>Prosjektering</li>
            <li>Montering</li>
            <li>Elektrisk tilkobling</li>
            <li>Dokumentasjon</li>
            <li>Søknad</li>
          </ul>
        </div>

        <div className="mt-12">
          <h2>Totalpris</h2>
          <p className="border-b border-black w-64 mt-3">
            <strong className="font-semibold">
              {formatValue(Number(estimateData?.price_data?.total))} kr{" "}
            </strong>
            eks. mva
          </p>
          <p className="border-b border-black w-64 mt-3">
            <strong className="font-semibold">
              {formatValue(Number(estimateData?.price_data?.total * 1.25))}{" "}
              kr{" "}
            </strong>
            inkl. mva
          </p>
          <p className="italic text-gray-600 !text-sm mt-3">
            50 % av totalbeløpet faktureres før installasjon. Resterende 50 %
            faktureres etter at installasjonen er gjennomført.
          </p>
        </div>

        <div className="mt-12">
          <h2>Forbehold</h2>
          <p className="mt-3 !text-lg">
            Tilbudet er basert på tilgjengelig informasjon og mottatt
            dokumentasjon.Endelig pris kan justeres etter gjennomført befaring
            dersom det avdekkes forhold som påvirker installasjonen.
          </p>
          <p className="mt-3 !text-lg">
            Dersom befaringen avdekker forhold som medfører vesentlige
            merkostnader utover avtalt pris i denne kontrakten, vil kunden motta
            et revidert tilbud til ny signering. I slike tilfeller bortfaller
            denne kontrakten, og er ikke lenger bindende for noen av partene.
          </p>
        </div>

        <div className="mt-12">
          <div>
            <div className="flex flex-row gap-4 items-center">
              <h2>Vilkår og betingelser</h2>
              <button
                type="button"
                onClick={() => downloadPdf(tos, "vilkar.pdf")}
                className="bg-[#FFB923] rounded-full px-3 py-1 text-white font-semibold text-sm"
              >
                Last ned som pdf
              </button>
            </div>
            <div className="flex flex-row items-center gap-4">
              <img src="/pdfIcon.png" className="w-24 my-4" />
              <input id="tos" type="checkbox" required />
              <label htmlFor="tos">
                Jeg bekrefter at jeg har lest, forstått og godkjent vilkår og
                betingelser for kjøpet.
              </label>
            </div>
            <Link
              href={tos}
              target="_blank"
              className="bg-[#FFB923] ml-6 rounded-full px-3 py-1 text-white font-semibold text-sm"
            >
              Vis
            </Link>
          </div>
          <div className="mt-8">
            <div className="flex flex-row gap-4 items-center">
              <h2>Angreskjema</h2>
              <button
                type="button"
                onClick={() =>
                  downloadPdf(withdrawalForm, "withdrawalForm.pdf")
                }
                className="bg-[#FFB923] rounded-full px-3 py-1 text-white font-semibold text-sm"
              >
                Last ned som pdf
              </button>
            </div>
            <div className="flex flex-row items-center gap-4">
              <img src="/pdfIcon.png" className="w-24 my-4" />
              <input id="withdrawalForm" type="checkbox" required />
              <label htmlFor="withdrawalForm">
                Jeg bekrefter at jeg har mottatt, lest og forstått informasjon
                om angrerett.
              </label>
            </div>
            <Link
              href={withdrawalForm}
              target="_blank"
              className="bg-[#FFB923] ml-6 rounded-full px-3 py-1 text-white font-semibold text-sm"
            >
              Vis
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2>Parter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <div>
              <div className="flex flex-row items-center gap-2">
                <h3 className="!text-lg !font-medium">Installatør</h3>
                <img src="/userIcon.png" className="h-6" />
              </div>

              <p className="!text-lg mt-2">Firmanavn: {config.legal}</p>
              <p className="!text-lg mt-2">
                Org.nr: {config.footer.organizationNumber}
              </p>

              {estimateData?.leads.org_nr && (
                <div className="mt-5">
                  <label className="text-sm text-gray-700">Org.nr</label>
                  <p className="mt-1 border-b border-black !text-lg !font-medium">
                    {estimateData.leads.org_nr}
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-row items-center gap-2">
                <h3 className="!text-lg !font-medium">Kunde</h3>
                <img src="/userIcon.png" className="h-6" />
              </div>

              <p className="!text-lg mt-2">
                Navn: {estimateData.leads.person_info}
              </p>
              {estimateData.leads.company && (
                <p className="!text-lg mt-2">
                  Firmanavn: {estimateData.leads.company}
                </p>
              )}
              {estimateData.leads.org_nr && (
                <p className="!text-lg mt-2">
                  Org.nr: {estimateData.leads.org_nr}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="justify-end flex mb-8 mt-12">
          <button
            type="submit"
            className="border-2 border-[#FFA600] bg-[#FFC64B] px-8 py-2 rounded-full text-white"
          >
            Signer
          </button>
        </div>
      </form>
    </main>
  );
}

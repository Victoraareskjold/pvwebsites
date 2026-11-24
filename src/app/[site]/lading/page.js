import { notFound } from "next/navigation";
import LadingClient from "./LadingClient";

// Bedriftslading er foreløpig bare for Smart Elektro Sol
// (eksklusivt blant partnerne ut 2027).
const ENABLED_SITES = ["smartelektrosol"];

export const metadata = {
  title: "Lading for tunge kjøretøy og Enova-støtte",
  description:
    "Regn ut ladeanlegg, solceller og batteri for depotet, se hvor mye Enova kan dekke, og sjekk om bedriften kvalifiserer for Bedriftslading for tunge kjøretøy.",
};

export default async function Lading({ params }) {
  const { site } = await params;
  if (!ENABLED_SITES.includes(site)) notFound();

  return (
    <main id="main" className="ds">
      <LadingClient site={site} />

      {/* Teksten står utenfor iframen så søkemotorer kan lese den. */}
      <section className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <h2>Enova-støtte til lading av tunge kjøretøy</h2>
          <p>
            Gjennom programmet Bedriftslading for tunge kjøretøy dekker Enova inntil 60 % av godkjente kostnader
            for ladeanlegg på eget depot eller anlegg, opptil 3 millioner kroner per prosjekt. Hvert ladepunkt må
            være på over 50 kW, og anlegget må driftes på samme sted i fem år.
          </p>
          <p>
            Søknadene konkurrerer om et begrenset budsjett og rangeres etter støtte per kW ladeeffekt. Neste
            søknadsfrist er 3. februar 2027 kl. 12:00. Senere frister i 2027 er 3. juni, 3. september og 3. november.
          </p>
          <p>
            Vi hjelper med beregning av ladebehov, nettkapasitet, solceller og batteri, og med kostnadsgrunnlaget
            til søknaden.
          </p>
        </div>
      </section>
    </main>
  );
}

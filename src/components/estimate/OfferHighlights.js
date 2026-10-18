"use client";

/**
 * «Kort fortalt» — rett under hilsenen.
 *
 * Tre tall kunden skal sitte igjen med: hva anlegget koster etter støtte,
 * hva det sparer første år, og forskjellen på strømkostnadene over tid.
 * Detaljene og forutsetningene ligger lenger ned.
 */

import "./offerStory.css";

const kr = (v) => `${Math.round(Number(v) || 0).toLocaleString("nb-NO")} kr`;
/** Avrundet for overskriftstall: nærmeste 100 under 10 000, ellers nærmeste 1 000 */
const approx = (v) => {
  const n = Math.abs(Number(v) || 0);
  const step = n < 10000 ? 100 : 1000;
  return kr(Math.round(v / step) * step);
};

export default function OfferHighlights({ price, firstYear, summary, periodYears }) {
  const diff = summary.difference;
  return (
    <div className="offer-story">
      <div className="story-highlights" aria-label="Kort fortalt">
        <div className="story-hl story-hl-main">
          <span className="story-hl-label">
            {price.isBusiness ? "Pris for anlegget" : "Din kostnad etter Enova-støtte"}
          </span>
          <strong className="story-hl-value">{kr(price.isBusiness ? price.solarInvoiced : price.solarNet)}</strong>
          <span className="story-hl-sub">
            {price.isBusiness
              ? "eks. mva."
              : `Vi fakturerer ${kr(price.solarInvoiced)} inkl. mva. Du får ca. ${kr(price.support)} tilbake fra ${price.supportProvider}.`}
          </span>
        </div>

        <div className="story-hl">
          <span className="story-hl-label">Lavere strømutgifter første år</span>
          <strong className="story-hl-value">ca. {approx(firstYear.saving)}</strong>
          <span className="story-hl-sub">
            Fra {kr(firstYear.costWithout)} til {kr(Math.max(0, firstYear.costWith))} med dagens priser.
          </span>
        </div>

        <div className="story-hl">
          <span className="story-hl-label">Spart over {periodYears} år, etter at anlegget er betalt</span>
          <strong className={`story-hl-value ${diff >= 0 ? "positive" : ""}`}>
            {diff >= 0 ? `ca. ${approx(diff)}` : "Ikke tjent inn ennå"}
          </strong>
          <span className="story-hl-sub">
            {summary.paybackYear
              ? `Anlegget er tjent inn etter ca. ${summary.paybackYear} år. Deretter sparer du hvert år.`
              : "Anlegget tjenes ikke inn innen 30 år med disse forutsetningene."}
          </span>
        </div>
      </div>
      <a className="story-hl-link" href="#med-og-uten">
        Se hvordan vi har regnet, og legg inn ditt eget strømforbruk ↓
      </a>
    </div>
  );
}

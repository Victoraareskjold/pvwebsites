"use client";

/**
 * «Din oversikt» — prisoppsummeringen på tilbudet.
 *
 * Følger kravdokumentet fra Asbjørn (28. september 2026):
 * standardanlegget og hvert tillegg som egen prispost, mva-visning etter
 * kundetype, antatt støtte vist separat fra avtaleprisen, og tydelig at
 * tilleggene ikke inngår i nedbetalingstiden for solcelleanlegget.
 *
 * Privat viser inkl. mva. med antatt støtte. Næring viser eks. mva. uten
 * Enova-felt.
 */

import "./offerSummary.css";

const nok = (value) =>
  `${Number(value || 0).toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} kr`;

export default function OfferSummary({
  basePriceEx,
  isBusiness,
  enovaSupport,
  batteryQuote,
}) {
  const vat = isBusiness ? 1 : 1.25;
  const taxLabel = isBusiness ? "eks. mva." : "inkl. mva.";

  const extraLines = batteryQuote?.lines ?? [];
  const extrasEx = batteryQuote?.extrasEx ?? 0;

  const baseTotal = Number(basePriceEx || 0) * vat;
  const extrasTotal = extrasEx * vat;
  const total = baseTotal + extrasTotal;

  // Støtten gjelder solcelleanlegget. Tilleggene øker den ikke.
  const support = isBusiness ? 0 : Number(enovaSupport || 0);

  return (
    <div className="offer-summary">
      <div className="offer-summary-head">
        <h3>Din løsning</h3>
        <span className="offer-summary-tax">{taxLabel}</span>
      </div>

      <div className="offer-summary-line">
        <div>
          Solcelleanlegg med standard string-inverter
          <small>Prosjektering, montering og elektrisk tilkobling</small>
        </div>
        <strong>{nok(baseTotal)}</strong>
      </div>

      {extraLines.map((line) => (
        <div className="offer-summary-line" key={line.id}>
          <div>
            {line.label}
            {line.detail ? <small>{line.detail}</small> : null}
          </div>
          <strong>{nok(line.amountEx * vat)}</strong>
        </div>
      ))}

      <div className="offer-summary-total">
        <span>Samlet pris</span>
        <strong>{nok(total)}</strong>
      </div>

      {support > 0 && (
        <div className="offer-summary-support">
          <div className="offer-summary-line">
            <span>Antatt Enova-støtte</span>
            <strong>−{nok(support)}</strong>
          </div>
          <div className="offer-summary-line offer-summary-after">
            <span>Kostnad etter antatt støtte</span>
            <strong>{nok(total - support)}</strong>
          </div>
          <p className="offer-summary-note">
            Støtten er vist separat fra avtaleprisen, og gjelder
            solcelleanlegget. Tilleggene øker ikke støttebeløpet.
          </p>
        </div>
      )}

      {extrasEx > 0 && (
        <p className="offer-summary-note offer-summary-extras-note">
          Hybridinverter, batteri og nødstrøm kommer i tillegg til
          solcelleanlegget. Nedbetalingstiden i regnestykket over gjelder
          solcelleanlegget alene.
        </p>
      )}

      {batteryQuote?.supplierRequired && (
        <p className="offer-summary-note offer-summary-warning">
          Dette oppsettet er større enn standardutvalget. Vi innhenter
          leverandørpris før tilbudet kan godkjennes.
        </p>
      )}

      {batteryQuote?.backupRequired && (
        <p className="offer-summary-note">
          Nødstrøm er foreløpig pris. Omfang og endelig løsning avklares med
          oss før signering.
        </p>
      )}
    </div>
  );
}

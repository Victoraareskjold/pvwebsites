"use client";

/**
 * «Hva anlegget koster» — fakturert pris, beregnet støtte og egen kostnad.
 *
 * Kostnaden etter støtte er det største tallet: erfaringen er at privatkunder
 * som oppfyller vilkårene får støtten. Samtidig står det tydelig at støtten
 * kommer fra Enova og ikke trekkes fra fakturaen.
 */

import "./offerStory.css";

const kr = (v) => `${Math.round(Number(v) || 0).toLocaleString("nb-NO")} kr`;

export default function OfferPrice({ price, kwp }) {
  if (price.isBusiness) {
    return (
      <div className="offer-story">
        <div className="story-card">
          <p className="story-eyebrow">PRIS</p>
          <div className="story-price-row story-price-total">
            <span>Pris for solcelleanlegget</span>
            <strong>{kr(price.solarInvoiced)}</strong>
          </div>
          <p className="story-muted">Prisen er eks. mva. Næringskunder har normalt ikke Enova-støtte til solceller.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-story">
      <div className="story-card story-price">
        <div className="story-price-lines">
          <div className="story-price-row">
            <span>
              Pris for solcelleanlegget
              <small>Det vi fakturerer, inkl. mva.</small>
            </span>
            <strong>{kr(price.solarInvoiced)}</strong>
          </div>
          <div className="story-price-row story-price-support">
            <span>
              Beregnet støtte fra {price.supportProvider}
              <small>
                {price.supportSource === "enova-rates"
                  ? `2 500 kr per kWp, inntil 15 kWp (${(Math.min(kwp || 0, 15)).toLocaleString("nb-NO", { maximumFractionDigits: 2 })} kWp)`
                  : "Etter Enovas satser for solceller på bolig"}
              </small>
            </span>
            <strong>− {kr(price.support)}</strong>
          </div>
          <div className="story-price-row story-price-net">
            <span>Din kostnad etter støtte</span>
            <strong>{kr(price.solarNet)}</strong>
          </div>
        </div>

        <div className="story-price-explain">
          <p className="story-eyebrow">SLIK FUNGERER STØTTEN</p>
          <ol className="story-steps">
            <li>
              <strong>Du søker Enova før du signerer.</strong> Søknaden må være godkjent før avtalen inngås. Vi hjelper
              deg med den.
            </li>
            <li>
              <strong>Du betaler fakturaen fra oss.</strong> Støtten trekkes ikke fra fakturaen.
            </li>
            <li>
              <strong>Enova betaler støtten til deg</strong> når anlegget er ferdig og kostnadene er dokumentert.
            </li>
          </ol>
          <p className="story-fine">
            Beløpet forutsetter at Enovas vilkår er oppfylt når du søker. Støtten er i dag 2 500 kr per kWp, inntil
            37 500 kr og høyst 25 % av kostnaden.
          </p>
        </div>
      </div>
    </div>
  );
}

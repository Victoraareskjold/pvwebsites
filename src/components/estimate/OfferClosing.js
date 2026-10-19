"use client";

/**
 * «03 · DIN OVERSIKT» — avslutningen på tilbudet.
 *
 * Mørk flate i nettstedets egen tone (--ink-deep). Prisoppsummeringen og
 * signeringen står først, fordi det er det kunden skal gjøre her. Deretter
 * hva som er inkludert, hvorfor velge en lokal installatør, miljøtallene og
 * kontaktpersonen.
 *
 * Innholdet er det samme som før; bare oppsettet er nytt.
 */

import OfferSummary from "./OfferSummary";
import { encodeSelection } from "./offerConfig";
import "./offerClosing.css";

const nok = (value) =>
  Number(value || 0).toLocaleString("nb-NO", { maximumFractionDigits: 0 });

const INCLUDED = [
  "Montering av komplett solcelleanlegg",
  "Veiledning til å søke om Enova-støtte",
  "App til å følge produksjonen din",
  "Kundestøtte og service etter installasjon",
];

const REASONS = [
  ["Personlig oppfølging", "Én fast kontaktperson, ikke et kundesenter."],
  ["Rask service", "Vi er i nærheten, så du får rask hjelp før og etter installasjon."],
  ["Kvalitet og trygghet", "Lokale fagfolk som kjenner området og strømnettet."],
  ["Langsiktig samarbeid", "Vi blir ikke borte etter installasjon."],
  ["Konkurransedyktig pris", "Ingen dyre mellomledd."],
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="closing-check">
      <circle cx="10" cy="10" r="10" />
      <path d="M6 10.4l2.6 2.6L14.2 7.4" />
    </svg>
  );
}

export default function OfferClosing({
  estimateData,
  estimateId,
  finished,
  config,
  enovaSupport,
  batteryQuote,
  hasUnreviewedExtras,
  contactEmail,
  contactPhone,
  contactPhoneHref,
}) {
  const yearly = Number(estimateData?.yearly_prod || 0);
  const advisor = estimateData?.leads?.created_by;
  // Kundens valg følger med til kjøpsavtalen og låses ved signering
  const choice = encodeSelection(batteryQuote?.selection);
  const signHref = `${estimateId}/kjoepsavtale${choice ? `?valg=${encodeURIComponent(choice)}` : ""}`;
  const withExtras = Boolean(choice) && (batteryQuote?.extrasEx ?? 0) > 0;
  const initials = advisor?.name
    ? advisor.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
    : null;

  return (
    <div className="offer-closing">
      <div className="closing-inner">
        <div className="closing-top">
          {/* Pris og signering */}
          <div className="closing-card closing-price">
            <OfferSummary
              basePriceEx={estimateData?.price_data?.total}
              isBusiness={Boolean(estimateData?.private)}
              enovaSupport={enovaSupport}
              batteryQuote={batteryQuote}
            />

            <div className="closing-actions">
              {hasUnreviewedExtras ? (
                <div className="closing-review">
                  <strong>Vi går gjennom valget ditt sammen.</strong>
                  <p>
                    Hybridinverter, batteri og nødstrøm må vi kontrollere mot anlegget ditt før
                    det kan avtales: kompatibilitet, omfang og endelig pris. Ta kontakt, så tar vi
                    det derfra.
                  </p>
                  <div className="closing-review-links">
                    {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
                    <a href={`tel:${contactPhoneHref}`}>{contactPhone}</a>
                  </div>
                  {finished && (
                    <a className="closing-plain" href={`${estimateId}/kjoepsavtale`} target="_blank">
                      Signer standardanlegget uten tillegg →
                    </a>
                  )}
                </div>
              ) : finished ? (
                <>
                  <a href={signHref} target="_blank" className="closing-sign">
                    {withExtras ? "Gå til signering med valgene dine" : "Gå til signering"}
                    <span aria-hidden="true">→</span>
                  </a>
                  <p className="closing-fine">
                    Du ser hele kjøpsavtalen{withExtras ? ", med hybridinverter og batteri slik du har valgt," : ""} før du signerer.{" "}
                    <a href="/kjopsbetingelser" target="_blank">Les kjøpsbetingelsene</a>
                  </p>
                </>
              ) : (
                <p className="closing-fine">
                  Dette er et estimat. Ferdig tilbud kommer etter eventuell befaring.{" "}
                  <a href="/kjopsbetingelser" target="_blank">Les vilkår og betingelser</a>
                </p>
              )}
            </div>
          </div>

          {/* Inkludert og hvorfor oss */}
          <div className="closing-side">
            <div>
              <p className="closing-eyebrow">INKLUDERT I PRISEN</p>
              <ul className="closing-included">
                {(estimateData?.private
                  ? INCLUDED.filter((t) => !t.includes("Enova"))
                  : INCLUDED
                ).map((text) => (
                  <li key={text}>
                    <Check />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="closing-eyebrow">HVORFOR EN LOKAL INSTALLATØR</p>
              <dl className="closing-reasons">
                {REASONS.map(([title, text]) => (
                  <div key={title}>
                    <dt>{title}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="closing-bottom">
          {/* Miljø */}
          <div className="closing-env">
            <p className="closing-eyebrow">MILJØ</p>
            <p className="closing-env-lead">
              De <strong>{nok(yearly)} kWh</strong> anlegget produserer i året tilsvarer omtrent:
            </p>
            <div className="closing-env-stats">
              <div>
                <strong>{nok(yearly / 60)}</strong>
                <span>fulle ladninger av en elbil</span>
              </div>
              <div>
                <strong>{nok(yearly / 300)}</strong>
                <span>kjøleskap i drift et helt år</span>
              </div>
              <div>
                <strong>{nok(yearly / 0.03)}</strong>
                <span>kopper kaffe</span>
              </div>
            </div>
          </div>

          {/* Kontaktperson */}
          {advisor?.name && (
            <div className="closing-contact">
              <span className="closing-avatar" aria-hidden="true">{initials}</span>
              <div>
                <p className="closing-eyebrow">DIN KONTAKTPERSON</p>
                <strong>{advisor.name}</strong>
                <span>{config?.title}</span>
                <div className="closing-contact-links">
                  {advisor.phone && <a href={`tel:${String(advisor.phone).replace(/\s/g, "")}`}>{advisor.phone}</a>}
                  {config?.footer?.email && <a href={`mailto:${config.footer.email}`}>{config.footer.email}</a>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * Takkeside etter innsendt forespørsel – både fra nettsidens
 * tilbudsskjema og fra Solkartet.
 *
 * Bare utformingen er endret. Siden registrerer ingenting selv og
 * utløser ingen sporing; leadet er allerede lagret av skjemaet som
 * sendte besøkende hit.
 */

import Link from "next/link";
import { useSiteConfig } from "../../../contexts/siteConfigContext";
import { ArrowRight, Check, Phone } from "../../../components/design/icons";

export default function Takk() {
  const config = useSiteConfig() || {};
  const phone = config.footer?.phone;
  const phoneHref = config.footer?.phoneHref || phone?.replace(/\s/g, "");

  return (
    <main id="main" className="ds thanks-page">
      <div className="wrap">
        <div className="thanks-card">
          <span className="thanks-mark">
            <Check size={30} />
          </span>
          <h1>{config.contact?.thankyouTitle || "Takk for at du tok kontakt!"}</h1>
          <p>
            {config.contact?.thankyou ||
              "Vi har mottatt forespørselen din. Vi ser gjennom det du har sendt oss, og tar kontakt så snart vi har anledning."}
          </p>
          <p>Vi gleder oss til å høre mer om planene dine og finne ut hva som passer hos deg.</p>

          <Link href="/" className="btn btn-solar">
            Tilbake til forsiden
            <ArrowRight size={18} />
          </Link>

          {phone && (
            <a className="thanks-call" href={`tel:${phoneHref}`}>
              <Phone size={15} />
              Har du noe mer på hjertet? Ring oss på {phone}
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

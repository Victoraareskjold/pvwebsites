"use client";

import { BatterySection } from "../../../components/design/Battery";
import { ContactSection, FAQSection } from "../../../components/design/Sections";

export default function Battery() {
  return (
    <main id="main" className="ds">
      <BatterySection full />

      <section className="section">
        <div className="wrap battery-checklist">
          <span className="eyebrow">VI STARTER MED BEHOVENE DINE</span>
          <h2>Riktig batteri begynner med de riktige spørsmålene.</h2>
          <div className="detail-benefits">
            <article>
              <span>01</span>
              <h3>Hva vil du oppnå?</h3>
              <p>
                Mer egenbruk, lavere effekttopper eller beredskap? Vi finner ut hvilke behov som
                skal prioriteres.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Hva skal holdes i gang?</h3>
              <p>
                Ved nødstrøm må både effektbehov, valgte kurser og ønsket driftstid avklares.
                Energikapasitet og effekt er to ulike størrelser.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Hva har du fra før?</h3>
              <p>
                Vi avklarer batterikompatibilitet, inverter, nettype og plassering før vi anbefaler
                en løsning.
              </p>
            </article>
          </div>
        </div>
      </section>

      <FAQSection />
      <ContactSection />
    </main>
  );
}

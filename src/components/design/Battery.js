"use client";

/**
 * Batteriseksjonen.
 *
 * Venstre kolonne er vår egen (etikett, overskrift, faner, knapp).
 * Høyre kolonne er animasjonen fra Asbjørns runde 2, kjørt i
 * `compact`-modus med `externalControls`, slik at fanene her styrer
 * hvilket emne animasjonen viser – og omvendt.
 *
 * Emnene heter `styring` hos oss og `handel` i animasjonen; kartet
 * under oversetter mellom dem.
 */

import { useState } from "react";
import { OfferButton, useContact } from "./Shell";
import SmartBattery from "./SmartBattery";
import { Tabs } from "./primitives";
import { BatteryCharging, ShieldCheck, Sun, Zap } from "./icons";

const MODES = [
  {
    id: "egenbruk",
    label: "Mer egenbruk",
    icon: Sun,
    title: "Ta vare på solskinnet.",
    text: "Lagre overskuddsstrøm når solen skinner, og bruk den når du trenger den – for eksempel på kvelden. Batteriet kan hjelpe deg å bruke mer av strømmen du produserer selv.",
  },
  {
    id: "nodstrom",
    label: "Nødstrøm",
    icon: ShieldCheck,
    title: "Trygghet når strømmen går.",
    text: "Vil du holde lys, kjøleskap og internett i gang? Vi planlegger hvilke kurser som skal ha nødstrøm, ønsket driftstid og nødvendig batterikapasitet. Løsningen må ha egnet inverter og sikker frakobling fra strømnettet.",
  },
  {
    id: "styring",
    label: "Smart styring",
    icon: Zap,
    title: "Mer kontroll over strømmen.",
    text: "Et kompatibelt system kan styres etter produksjon, forbruk og strømpris. Vi vurderer hva som er hensiktsmessig for din avtale, med ladetap og batterislitasje med i regnestykket.",
  },
];

/** Våre faner ↔ animasjonens emner. */
const TO_STORY = { egenbruk: "egenbruk", nodstrom: "nodstrom", styring: "handel" };
const FROM_STORY = { egenbruk: "egenbruk", nodstrom: "nodstrom", handel: "styring" };

export function BatterySection({ full = false }) {
  const [active, setActive] = useState("egenbruk");
  const openContact = useContact();
  const Heading = full ? "h1" : "h2";

  return (
    <section id="batteri" className={`battery-section section ${full ? "battery-full" : ""}`}>
      <div className="wrap battery-layout">
        <div className="battery-copy">
          <span className="eyebrow battery-eyebrow">
            <BatteryCharging size={26} />
            SOLCELLER + BATTERI
          </span>
          <Heading>
            Ta vare på solstrømmen.
            <br />
            <span>Bruk den når du trenger den.</span>
          </Heading>
          <p className="section-lead">
            Egen strøm gir frihet. Et batteri gir deg flere muligheter til å bruke den.
          </p>

          <Tabs
            className="battery-tabs"
            label="Batteriløsninger"
            value={active}
            onValueChange={setActive}
            tabs={MODES.map((mode) => ({
              id: mode.id,
              label: mode.label,
              content: (
                <>
                  <h3>{mode.title}</h3>
                  <p>{mode.text}</p>
                </>
              ),
            }))}
          />

          <OfferButton className="btn btn-solar battery-cta" equipment="Solcelleanlegg + Batteri">
            Finn riktig batteriløsning
          </OfferButton>
        </div>

        <div className="battery-story">
          <SmartBattery
            compact
            externalControls
            mode={TO_STORY[active]}
            onModeChange={(mode) => setActive(FROM_STORY[mode] || "egenbruk")}
            onContact={() => openContact("Solcelleanlegg + Batteri")}
          />
        </div>
      </div>
    </section>
  );
}

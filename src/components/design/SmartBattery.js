"use client";

/**
 * Batterianimasjonen fra Asbjørns runde 2
 * (smart-elektro-batteri-victor.zip), konvertert fra TypeScript.
 *
 * Selve animasjonen er et web-komponent som lastes fra
 * public/battery-story/. CSS-en er kapslet i Shadow DOM og påvirker
 * ikke resten av siden. Ingen npm-pakker, ingen Three.js.
 *
 * Vi bruker `compact` + `externalControls`, altså bare illustrasjonen
 * til høyre i batteriseksjonen. Venstre kolonne er vår egen
 * (src/components/design/Battery.js), og fanene styrer `mode`.
 */

import { useEffect, useRef } from "react";

const ASSET_PATH = "/battery-story";

export default function SmartBattery({
  compact = false,
  externalControls = false,
  mode,
  contactHref = "#kontakt",
  onContact,
  onModeChange,
}) {
  const host = useRef(null);
  const element = useRef(null);
  const callbacks = useRef({ onContact, onModeChange });
  callbacks.current = { onContact, onModeChange };

  useEffect(() => {
    const container = host.current;
    if (!container) return undefined;

    const story = document.createElement("smart-battery-story");
    // Tekstlig reserve dersom scriptet ikke lastes.
    story.innerHTML =
      "<p>Et batteri lagrer solstrøm til senere bruk, kan gi nødstrøm med egnet utstyr og flytte strøm mellom timer med ulik pris.</p>";
    element.current = story;
    container.appendChild(story);

    const onContactEvent = (event) => {
      if (callbacks.current.onContact) {
        event.preventDefault();
        callbacks.current.onContact();
      }
    };
    const onChangeEvent = (event) => {
      callbacks.current.onModeChange?.(event.detail.mode);
    };
    story.addEventListener("battery-contact", onContactEvent);
    story.addEventListener("battery-mode-change", onChangeEvent);

    const src = new URL(`${ASSET_PATH}/smart-battery.js`, window.location.href).href;
    const existing = Array.from(document.scripts).find((script) => script.src === src);
    if (!customElements.get("smart-battery-story") && !existing) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onerror = () => script.remove();
      document.head.appendChild(script);
    }

    return () => {
      story.removeEventListener("battery-contact", onContactEvent);
      story.removeEventListener("battery-mode-change", onChangeEvent);
      story.remove();
      element.current = null;
    };
  }, []);

  useEffect(() => {
    const story = element.current;
    if (!story) return;
    story.toggleAttribute("compact", compact);
    story.toggleAttribute("external-controls", externalControls);
    story.setAttribute("contact-href", contactHref);
    if (mode) story.setAttribute("mode", mode);
  }, [compact, externalControls, mode, contactHref]);

  return <div ref={host} style={{ width: "100%", minWidth: 0 }} />;
}

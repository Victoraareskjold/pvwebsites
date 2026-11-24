"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "../../../../utils/localstorage";

// Kalkulatoren (pvdepot) er en egen app som vises i iframe, som Solkartet.
const APP_URL = process.env.NEXT_PUBLIC_PVDEPOT_URL || "https://pvdepot.vercel.app";
const APP_ORIGIN = new URL(APP_URL).origin;

export default function LadingClient({ site }) {
  const router = useRouter();
  const frame = useRef(null);
  const [query, setQuery] = useState(null);

  useEffect(() => {
    const gclid = getLocalStorage("gclid") ?? "";
    const fbclid = getLocalStorage("fbclid") ?? "";
    const utm = getLocalStorage("utmCampaign") ?? "";
    const params = new URLSearchParams({
      site,
      ...(gclid && { gclid }),
      ...(fbclid && { fbclid }),
      ...(utm && { utm_campaign: utm }),
    });
    setQuery(params.toString());
  }, [site]);

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== APP_ORIGIN) return;
      const data = event.data;
      if (!data || data.source !== "pvdepot") return;

      // Leadet er lagret av appen. /takk teller konverteringen via
      // Consentify/GTM, akkurat som for vanlige leads.
      if (data.type === "lead") {
        router.push("/takk");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    // Appen fyller skjermen under menyen og scroller selv, som Solkartet.
    // 3D-verdenen ligger fast bak innholdet inne i appen.
    <div style={{ background: "#e4e7f3" }} className="h-[calc(100dvh-125px)] min-h-[560px]">
      {query !== null && (
        <iframe
          ref={frame}
          src={`${APP_URL}/?${query}`}
          title="Kalkulator for lading av tunge kjøretøy"
          width="100%"
          className="h-full"
          style={{ border: 0, display: "block" }}
          allow="fullscreen"
        />
      )}
    </div>
  );
}

"use client";

/**
 * Enkelt regneeksempel for solenergi på forsiden.
 *
 * VIKTIG: dette er et VEILEDENDE eksempel med faste forutsetninger. Den
 * reelle beregningen ligger i Solkartet (/solkart, pvmap) og i
 * tilbudssystemet – funksjonene her brukes ikke av noen av dem.
 *
 * Forutsetninger (avtalt med Asbjørn 16.09.2026):
 *   effekt_kWp        = antall_paneler × 460 / 1000
 *   årsproduksjon_kWh = antall_paneler × 460 × 1,1   (= 1 100 kWh/kWp)
 */

import { useState } from "react";
import Link from "next/link";
import { useSiteConfig } from "../../contexts/siteConfigContext";
import { useContact } from "./Shell";
import { Accordion, Slider } from "./primitives";
import { ArrowUpRight, Home, Info, SlidersHorizontal, Sun, Zap } from "./icons";

const WATTS_PER_PANEL = 460;
/** Fast årsproduksjonsforutsetning: 1,1 kWh per Wp, altså 1 100 kWh/kWp. */
const YIELD_FACTOR = 1.1;

const nb = (value, decimals = 0, min = 0) =>
  new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: min,
  }).format(value);

function calculate({ panels, selfUsePercent, buyPrice, sellPrice }) {
  const kwp = (panels * WATTS_PER_PANEL) / 1000;
  const production = panels * WATTS_PER_PANEL * YIELD_FACTOR;
  const selfUsed = (production * Math.max(0, Math.min(100, selfUsePercent))) / 100;
  const exported = production - selfUsed;
  return {
    kwp,
    production,
    selfUsed,
    exported,
    avoidedCost: selfUsed * buyPrice,
    exportValue: exported * sellPrice,
    annualValue: selfUsed * buyPrice + exported * sellPrice,
  };
}

export function Calculator({ standalone = false }) {
  const config = useSiteConfig() || {};
  const openContact = useContact();

  const [panels, setPanels] = useState(28);
  const [selfUse, setSelfUse] = useState(60);
  const [buy, setBuy] = useState("1.25");
  const [sell, setSell] = useState("1.15");

  const buyValue = Math.max(0, Math.min(10, Number(buy) || 0));
  const sellValue = Math.max(0, Math.min(10, Number(sell) || 0));
  const priceValid =
    buy !== "" &&
    sell !== "" &&
    Number(buy) >= 0 &&
    Number(buy) <= 10 &&
    Number(sell) >= 0 &&
    Number(sell) <= 10;

  const r = calculate({
    panels,
    selfUsePercent: selfUse,
    buyPrice: buyValue,
    sellPrice: sellValue,
  });

  const Heading = standalone ? "h1" : "h2";

  return (
    <section
      className={`calculator-section section ${standalone ? "standalone-calculator" : ""}`}
      id="kalkulator"
    >
      <div className="wrap">
        <div className="section-heading calculator-heading">
          <div>
            <span className="eyebrow">
              <Sun size={16} />
              UTFORSK MULIGHETENE
            </span>
            <Heading>Hva kan taket ditt gi deg?</Heading>
          </div>
          <p>
            Prøv et enkelt regneeksempel. Juster størrelsen og se hvordan egenbruk og
            strømpris påvirker verdien av solenergien.
          </p>
        </div>

        <div className="calculator">
          <div className="calc-controls">
            <div className="calc-card-top">
              <span className="calc-label">DITT REGNEEKSEMPEL</span>
              <span className="subtle-tag">{WATTS_PER_PANEL} W per panel</span>
            </div>

            <div className="range-control">
              <div className="range-heading">
                <label id="panels-label">Antall solcellepaneler</label>
                <strong>
                  {panels}
                  <span> paneler</span>
                </strong>
              </div>
              <Slider
                min={8}
                max={60}
                value={panels}
                onValueChange={setPanels}
                ariaLabelledBy="panels-label"
              />
              <div className="range-ends">
                <span>8 paneler</span>
                <span>60 paneler</span>
              </div>
            </div>

            <div className="range-control">
              <div className="range-heading">
                <label id="self-use-label">Strøm du bruker selv</label>
                <strong>
                  {selfUse}
                  <span> %</span>
                </strong>
              </div>
              <Slider
                min={10}
                max={100}
                step={5}
                value={selfUse}
                onValueChange={setSelfUse}
                ariaLabelledBy="self-use-label"
              />
              <p className="range-help">
                Resten av produksjonen selges til strømnettet. Egenbruken avhenger av når
                du bruker strøm.
              </p>
            </div>

            <Accordion
              className="assumptions"
              items={[
                {
                  key: "forutsetninger",
                  trigger: (
                    <span>
                      <SlidersHorizontal size={16} />
                      Se og endre forutsetningene
                    </span>
                  ),
                  content: (
                    <>
                      <div className="price-fields">
                        <label>
                          Verdi av egenbruk
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.05"
                            value={buy}
                            onChange={(e) => setBuy(e.target.value)}
                            aria-label="Verdi av egenbruk i kroner per kWh"
                          />
                          <span>kr/kWh spart ved egenbruk</span>
                        </label>
                        <label>
                          Pris ved salg
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.05"
                            value={sell}
                            onChange={(e) => setSell(e.target.value)}
                            aria-label="Salgspris i kroner per kWh"
                          />
                          <span>kr/kWh for overskudd</span>
                        </label>
                      </div>
                      {!priceValid && (
                        <p className="input-error">
                          Skriv inn strømpriser mellom 0 og 10 kr/kWh.
                        </p>
                      )}
                    </>
                  ),
                },
              ]}
            />

            {/* Forklaringen står synlig, ikke skjult i trekkspillet. */}
            <div className="calc-notes">
              <div className="calc-notes-top">
                <Info size={18} />
                <span>Slik er eksempelet regnet ut</span>
              </div>
              <p>
                <strong>Egenbruk:</strong> Ta med både strømpris og nettleie med avgifter
                per kWh. Nettleien kan utgjøre like mye som selve strømprisen, eller mer –
                særlig med Norgespris. Faste månedsbeløp holdes utenfor.
              </p>
              <p>
                <strong>Salg av strøm:</strong> Med batteri og smart styring kan du lagre
                overskuddsstrøm fra solcellene og selge når spotprisen er høyere. Med
                riktig oppsett og avtale kan du også kjøpe billig strøm, lagre den og selge
                senere til høyere pris. I enkelte perioder kan salgsprisen nå 3–4 kr/kWh
                eller mer. Lønnsomheten avhenger av prisforskjeller, nettleie og energitap.
              </p>
              <p>
                <strong>Produksjon:</strong> Anslaget forutsetter gunstig plassering og
                lite skygge. Faktisk produksjon avhenger av beliggenhet, panelenes retning
                og helning samt skyggeforhold. Beregningen er veiledende.
              </p>
            </div>
          </div>

          <div className="calc-results" aria-live="polite" aria-atomic="true">
            <div className="calc-result-top">
              <Sun size={23} />
              <span>BEREGNET PER ÅR</span>
              <span>{nb(r.kwp, 2)} kWp</span>
            </div>

            <div className="production-number">
              {nb(r.production)}
              <span>kWh</span>
            </div>
            <p className="production-subtitle">egenprodusert solenergi</p>

            <div
              className="energy-split"
              role="img"
              aria-label={`${selfUse} prosent brukes selv, ${100 - selfUse} prosent selges`}
            >
              <span style={{ width: `${selfUse}%` }} />
              <span style={{ width: `${100 - selfUse}%` }} />
            </div>

            <div className="split-legend">
              <span>
                <i className="own" />
                Brukes selv <b>{nb(r.selfUsed)} kWh</b>
              </span>
              <span>
                <i className="export" />
                Selges til nettet <b>{nb(r.exported)} kWh</b>
              </span>
            </div>

            <div className="annual-value">
              <div>
                <span>Årlig strømverdi</span>
                <small>Egenbruk + salg, før driftskostnader</small>
              </div>
              <strong>
                {priceValid ? nb(r.annualValue) : "–"}
                <span> kr</span>
              </strong>
            </div>

            <div className="value-breakdown">
              <span>
                <Home size={15} />
                Spart strømkjøp <b>{priceValid ? nb(r.avoidedCost) : "–"} kr</b>
              </span>
              <span>
                <Zap size={15} />
                Inntekt fra salg <b>{priceValid ? nb(r.exportValue) : "–"} kr</b>
              </span>
            </div>

            <button
              type="button"
              className="btn btn-solar full"
              onClick={() =>
                openContact(
                  "Solcelleanlegg",
                  `Jeg har sett på et regneeksempel med ${panels} paneler (${nb(
                    r.kwp,
                    2,
                  )} kWp), ${nb(r.production)} kWh antatt årsproduksjon og ${selfUse} % egenbruk. Jeg ønsker en vurdering av mitt tak.`,
                )
              }
            >
              Få en vurdering av ditt tak
              <ArrowUpRight size={18} />
            </button>

            <p className="result-footnote">
              Eksempelpriser: {nb(buyValue, 2, 2)} kr/kWh egenbruk og {nb(sellValue, 2, 2)}{" "}
              kr/kWh salg. Beregningen inkluderer ikke finansiering, vedlikehold eller
              batteri.
            </p>
          </div>
        </div>

        <div className="calc-bottom-note">
          <span>Vil du se ditt eget tak på kart?</span>
          <Link href="/solkart">
            {config.exploreBtn?.text || "Åpne Solkartet vårt"}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

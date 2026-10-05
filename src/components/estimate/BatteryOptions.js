"use client";

/**
 * «02 · MULIGHETENE DINE» — batteri, hybridinverter og nødstrøm.
 *
 * Bygget etter prototypen fra Asbjørn (Soleklart, 28. september 2026):
 * tre valgkort, batterikonfigurator med modulstepper, nødstrømvalg og
 * animasjonspanelet «Slik jobber batteriet».
 *
 * Seksjonen vises bare når estimatet har `price_data.battery`. Eldre tilbud
 * mangler blokken og er derfor urørt.
 *
 * Kundens valg her er utforsking, ikke en bestilling: ingenting lagres, og
 * tilleggsprisene holdes utenfor nedbetalingstiden for solcelleanlegget.
 */

import { useState } from "react";
import BatteryIcon from "./BatteryIcon";
import {
  calculateExtras,
  dayCycleExample,
  defaultSelection,
  normalizedSelection,
  vatMultiplier,
} from "./batteryModel";
import "./battery.css";

const number = (value, decimals = 0) =>
  Number(value || 0).toLocaleString("nb-NO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const money = (value) => `${number(value)} kr`;

const SCENE_TABS = [
  ["day", "Solrik dag"],
  ["evening", "Kveld"],
  ["outage", "Strømbrudd"],
];

const BACKUP_OPTIONS = [
  ["none", "Uten nødstrøm", ""],
  [
    "circuits",
    "Strøm til utvalgte kurser",
    "For eksempel lys, kjøleskap og internett.",
  ],
  [
    "whole",
    "Nødstrøm til hele bygget",
    "Tilpasses hovedsikring, inverter og effektbehov.",
  ],
];

function EnergyNode({ variant, icon, title, value, off = false }) {
  return (
    <div className={`energy-node ${variant} ${off ? "off" : ""}`}>
      <span className="node-symbol">
        <BatteryIcon name={icon} />
      </span>
      <span>{title}</span>
      {value ? <strong>{value}</strong> : null}
    </div>
  );
}

/** Animasjonspanelet. Tre merkede øyeblikk, ikke måledata. */
function BatteryStory({ capacity, config }) {
  const [scene, setScene] = useState("day");
  const [paused, setPaused] = useState(false);

  const example = dayCycleExample(capacity, config);
  const purchase = config?.purchase ?? 0;
  const exportPrice = config?.exportPrice ?? 0;

  const scenes = {
    day: {
      title: "Sol til huset. Overskuddet lagres.",
      copy: "Solcellene forsyner huset først. Batteriet lades av strømmen som er til overs.",
      solar: "6 kW",
      home: "2 kW",
      battery: "+4 kW",
      grid: "0 kW",
      metric: `${number(example.charged, 1)} kWh lagres i eksemplet`,
      detail:
        "Denne energien kunne ellers blitt solgt. På kvelden kan du bruke den selv, etter tap i lading og utlading.",
    },
    evening: {
      title: "Dagens sol blir kveldens strøm.",
      copy: "Batteriet leverer lagret solstrøm når huset trenger den. Du kjøper mindre fra nettet.",
      solar: "0 kW",
      home: "2 kW",
      battery: "−2 kW",
      grid: "0 kW",
      metric: `${money(example.cycleValue)} i dette døgnseksemplet`,
      detail: `${number(example.delivered, 1)} kWh erstatter kjøp til ${number(
        purchase,
        2,
      )} kr/kWh. Tapt salg av ${number(example.charged, 1)} kWh til ${number(
        exportPrice,
        2,
      )} kr/kWh er trukket fra. Før investering og slitasje.`,
    },
    outage: {
      title: "Strøm til det viktigste.",
      copy: "Med tilpasset nødstrøm kan batteriet forsyne utvalgte kurser når strømnettet er frakoblet.",
      solar: "0 kW",
      home: "0,3 kW",
      battery: "−0,3 kW",
      grid: "Frakoblet",
      metric: `Ca. ${number(example.backupHours, 1)} timer i eksemplet`,
      detail: `30 % av ${number(
        capacity,
        1,
      )} kWh satt av til beredskap, 10 % omformingstap og 300 W samlet last inkludert systemforbruk. Ingen solpåfyll. Faktisk driftstid varierer.`,
    },
  };

  const current = scenes[scene];
  const isDay = scene === "day";
  const isOutage = scene === "outage";

  return (
    <div id="story-panel" className="story-panel">
      <div className="story-head">
        <p className="eyebrow">SLIK JOBBER BATTERIET</p>
        <button
          type="button"
          className="pause-button"
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused ? "Start strømbevegelsen" : "Sett strømbevegelsen på pause"
          }
        >
          {paused ? "▷ Spill av" : "Ⅱ Pause"}
        </button>
      </div>

      <div className="scene-tabs" role="group" aria-label="Velg øyeblikk i eksemplet">
        {SCENE_TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={scene === id}
            onClick={() => setScene(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <h3>{current.title}</h3>
      <p className="story-description">{current.copy}</p>

      <div
        className={`energy-diagram ${paused ? "paused" : ""}`}
        role="img"
        aria-label={`${current.copy} Solceller ${current.solar}, batteri ${current.battery}, ${
          isOutage ? "valgte kurser" : "hus"
        } ${current.home}, strømnettet ${current.grid}.`}
      >
        <svg
          className="energy-wires"
          viewBox="0 0 500 322"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g className="wire-base">
            <path d="M250 78V143M250 188V252M108 164H224M280 164H407" />
          </g>
          <g>
            <path
              className={`wire-flow ${isDay ? "" : "inactive"}`}
              d="M250 78V143"
            />
            <path
              className={`wire-flow ${isDay ? "" : "reverse"}`}
              d="M250 188V252"
            />
            <path className="wire-flow" d="M280 164H407" />
          </g>
        </svg>

        <EnergyNode
          variant="sun"
          icon="sun"
          title="Solceller"
          value={current.solar}
          off={!isDay}
        />
        <EnergyNode
          variant="grid"
          icon="grid"
          title="Strømnettet"
          value={current.grid}
          off={isOutage}
        />
        <EnergyNode variant="inverter" icon="inverter" title="Hybridinverter" />
        <EnergyNode
          variant="home"
          icon={isOutage ? "shield" : "home"}
          title={isOutage ? "Valgte kurser" : "Huset"}
          value={current.home}
        />
        <EnergyNode
          variant="battery"
          icon="battery"
          title={`${number(capacity, 1)} kWh batteri`}
          value={current.battery}
        />
      </div>

      <div className="story-benefit">
        <strong>{current.metric}</strong>
        <p>{current.detail}</p>
      </div>

      <p className="story-caption">
        Illustrasjon med eksempelverdier, ikke måledata.
        {isOutage
          ? " Krever kompatibel backupløsning og sikker frakobling fra nettet. Illustrasjonen viser utvalgte kurser."
          : " Døgnseksemplet bruker inntil 10 kWh lading, setter av 30 % kapasitet til reserve og regner 10 % energitap. Det er ikke en årsprognose."}
      </p>
    </div>
  );
}

export default function BatteryOptions({ config, onSelectionChange }) {
  const [selection, setSelection] = useState(() => defaultSelection(config));

  if (!config?.catalogue || Object.keys(config.catalogue).length === 0) {
    return null;
  }

  const vat = vatMultiplier(config);
  const quote = calculateExtras(selection, config);
  const product = quote.product;

  const update = (patch) => {
    const next = normalizedSelection({ ...selection, ...patch }, config);
    setSelection(next);
    onSelectionChange?.(next, calculateExtras(next, config));
  };

  // Prisene på kortene: hybrid alene, og den anbefalte batteripakken.
  const hybridPrice = (config.hybridQty ?? 1) * (config.hybridUnitEx ?? 0) * vat;
  const recommendedPrice =
    calculateExtras(
      { ...selection, mode: "battery", ...config.recommended, backup: "none" },
      config,
    ).extrasEx * vat;

  const paths = [
    [
      "solar",
      "sun",
      "Solcelleanlegg",
      "Standard string-inverter. Produser din egen strøm.",
      "Inkludert i tilbudet",
    ],
    [
      "hybrid",
      "inverter",
      "Klargjør for batteri",
      "Hybridinverter nå. Mulighet for batteri senere.",
      `+ ${money(hybridPrice)}`,
    ],
    [
      "battery",
      "battery",
      "Solceller + batteri",
      "Ta vare på overskuddet og bruk det senere.",
      `+ ${money(recommendedPrice)} · anbefalt pakke`,
    ],
  ];

  const taxLabel = config.customerType === "private" ? "inkl. mva." : "eks. mva.";
  const isRecommended =
    selection.model === config.recommended?.model &&
    selection.modules === config.recommended?.modules;

  return (
    <section
      className="offer-battery options-section"
      aria-labelledby="battery-options-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 · MULIGHETENE DINE</p>
          <h2 id="battery-options-title">
            Vil du ta vare på mer av solstrømmen?
          </h2>
          <p>
            Velg batteri nå, klargjør for senere, eller behold anlegget slik det
            er.
          </p>
        </div>
      </div>

      <div
        className="path-options"
        role="radiogroup"
        aria-label="Velg løsning"
      >
        {paths.map(([mode, icon, title, copy, price]) => (
          <button
            key={mode}
            type="button"
            className="path-card"
            role="radio"
            aria-checked={selection.mode === mode}
            onClick={() => update({ mode })}
          >
            <span className="path-top">
              <BatteryIcon name={icon} />
              <span className="choice-dot" aria-hidden="true" />
            </span>
            {mode === "battery" && (
              <span className="path-recommended">Valgfritt tillegg</span>
            )}
            <strong>{title}</strong>
            <small>{copy}</small>
            <span className="path-price">{price}</span>
          </button>
        ))}
      </div>

      {selection.mode !== "battery" ? (
        <div className="mode-note">
          <BatteryIcon name={selection.mode === "solar" ? "sun" : "inverter"} />
          <div>
            <strong>
              {selection.mode === "solar"
                ? "Du har valgt solcelleanlegget med standard inverter."
                : "Klar for neste steg, når du er det."}
            </strong>
            <p>
              {selection.mode === "solar"
                ? "Strømmen brukes direkte i bygget når du trenger den. Overskuddet kan selges til strømnettet."
                : "Hybridinverteren erstatter standardinverteren i dette oppsettet. Et kompatibelt batteri kan legges til senere. Nødstrøm krever eget utstyr og avklart løsning."}
            </p>
            <button
              type="button"
              className="text-button"
              style={{ marginTop: 12 }}
              onClick={() => update({ mode: "battery", ...config.recommended })}
            >
              Utforsk anbefalt batteri{" "}
              {number(
                (config.recommended?.modules ?? 0) *
                  (config.catalogue[config.recommended?.model]?.moduleKwh ?? 0),
                1,
              )}{" "}
              kWh ↗
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="battery-grid">
            <div className="config-panel">
              <div className="config-top">
                <div>
                  <p className="eyebrow">BATTERIET DITT</p>
                  <h3>{product?.brand}</h3>
                </div>
                <span className="recommend-tag">
                  {isRecommended ? "Anbefalt størrelse" : "Din tilpasning"}
                </span>
              </div>

              <div className="capacity-display">
                <div>
                  <strong>
                    {number(quote.capacity, 1)} <small>kWh</small>
                  </strong>
                  <p>
                    {selection.modules} moduler ·{" "}
                    {number(product?.moduleKwh, 1)} kWh per modul
                  </p>
                </div>
                <div className="stepper" aria-label="Antall batterimoduler">
                  <button
                    type="button"
                    aria-label="Fjern én batterimodul"
                    disabled={selection.modules <= (product?.min ?? 0)}
                    onClick={() => update({ modules: selection.modules - 1 })}
                  >
                    −
                  </button>
                  <output aria-live="polite">{selection.modules}</output>
                  <button
                    type="button"
                    aria-label="Legg til én batterimodul"
                    disabled={selection.modules >= (product?.max ?? 0)}
                    onClick={() => update({ modules: selection.modules + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="capacity-gauge" aria-hidden="true">
                {Array.from({ length: product?.max ?? 0 }, (_, i) => (
                  <span key={i} className={i < selection.modules ? "filled" : ""} />
                ))}
              </div>

              <div className="price-inline">
                <span>Batteri, base og installasjon</span>
                <strong>{money(quote.batteryOnlyEx * vat)}</strong>
              </div>
              <p className="supporting">
                {taxLabel} · hybridoppgradering kommer i tillegg.
              </p>

              {quote.discountEx > 0 && (
                <p className="discount-line">
                  Kvantumspris: {money(quote.unitEx * vat)} per modul, på alle{" "}
                  {selection.modules} modulene.
                </p>
              )}

              <details className="config-options">
                <summary>Bytt modell og se oppsettet</summary>
                <div className="field">
                  <label htmlFor="battery-model">Batterimodell</label>
                  <select
                    id="battery-model"
                    value={selection.model}
                    onChange={(e) => update({ model: e.target.value })}
                  >
                    {Object.values(config.catalogue).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.brand} · {number(item.moduleKwh, 1)} kWh/modul
                      </option>
                    ))}
                  </select>
                </div>
                <p className="supporting">
                  {quote.bases} BMS/base{quote.bases > 1 ? "r" : ""}. Oppsettet
                  bruker inntil {product?.modulesPerBase} moduler per base.
                  Kompatibilitet og antall invertere avklares i tilbudet.
                </p>
                {product?.datasheetUrl ? (
                  <a
                    className="text-button"
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Se produktark ↗
                  </a>
                ) : (
                  <p className="small-note">
                    Produktark vises her når det er lagt inn for modellen.
                  </p>
                )}
                {!isRecommended && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => update({ ...config.recommended })}
                  >
                    Tilbake til anbefalt størrelse
                  </button>
                )}
              </details>

              {quote.supplierRequired && (
                <div className="warning-note">
                  <strong>Vi innhenter pris for dette oppsettet.</strong>
                  <br />
                  Beløpet er veiledende. Leverandørpris og eventuell
                  kvantumsrabatt avklares før godkjenning.
                </div>
              )}

              <div className="backup-section">
                <h3>Ønsker du nødstrøm?</h3>
                <p className="supporting">
                  Batteriet kan også gi strøm når nettet faller ut, med en
                  tilpasset backupløsning.
                </p>
                <div className="backup-options">
                  {BACKUP_OPTIONS.map(([id, title, copy]) => (
                    <label key={id} className="backup-choice">
                      <input
                        type="radio"
                        name="backup"
                        value={id}
                        checked={selection.backup === id}
                        onChange={() => update({ backup: id })}
                      />
                      <span>
                        {title}
                        {copy ? <small>{copy}</small> : null}
                      </span>
                    </label>
                  ))}
                </div>

                {selection.backup === "circuits" && (
                  <label className="circuit-select" htmlFor="circuit-count">
                    Antall kurser
                    <select
                      id="circuit-count"
                      value={selection.circuits}
                      onChange={(e) =>
                        update({ circuits: Number(e.target.value) })
                      }
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {selection.backup !== "none" && (
                  <p className="backup-info">
                    {selection.backup === "whole"
                      ? "Hele bygget betyr ikke ubegrenset samtidig effekt. Inverter, batteri og omkobling må dimensjoneres for bygget."
                      : "Hvilke kurser som kan få nødstrøm og endelig pris avklares etter vurdering."}{" "}
                    Valget sendes til oss for gjennomgang.
                  </p>
                )}
              </div>
            </div>

            <BatteryStory capacity={quote.capacity} config={config} />
          </div>

          <div className="battery-value">
            <BatteryIcon name="info" />
            <div>
              <strong>Hva kan batteriet spare deg i løpet av et år?</strong>
              <p>
                {config.annualConsumption == null
                  ? "Årsforbruk er ikke oppgitt."
                  : `Oppgitt årsforbruk: ${number(config.annualConsumption)} kWh.`}{" "}
                En personlig beregning trenger også informasjon om når strømmen
                brukes. Her viser vi et tydelig merket døgnseksempel.
                Årsbesparelse kan legges til når grunnlaget er avklart.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

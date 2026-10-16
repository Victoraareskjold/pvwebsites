"use client";

/**
 * «01 · SOLCELLER» — alt over økonomigrafen på tilbudet.
 *
 * Samme designspråk som batteriseksjonen (02) og prototypen: hvite kort på
 * sidens varme bakgrunn, eyebrow-overskrifter, merkefargen fra temaet og
 * tabellsifre. Regnestykkene gjøres i EstimateView og kommer inn som props;
 * her er det bare presentasjon.
 */

import Link from "next/link";
import SpotPriceWidget from "../SpotPriceWidget";
import "./offerSolar.css";

const nok = (value, decimals = 0) =>
  Number(value || 0).toLocaleString("nb-NO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const kr = (value) => `${nok(value, 2)} kr/kWh`;

/** Linjene i «Anlegget består av», fra price_data. */
function facilityRows(estimateData) {
  const suppliers = estimateData?.price_data?.suppliers ?? [];
  const byCategory = (test) =>
    suppliers.filter((item) => test(String(item.category ?? "").toLowerCase()));

  const panels = byCategory((c) => c.includes("panel"));
  const inverters = byCategory((c) => c.includes("inverter"));
  const batteries = byCategory((c) => c.includes("batteri"));
  let mounting = byCategory((c) => c.includes("feste"));
  if (!mounting.length && estimateData?.price_data?.mounting?.[0]) {
    mounting = [estimateData.price_data.mounting[0]];
  }

  const panelProduct = panels[0]?.product || estimateData?.selected_panel_type || "";
  const watt = Number(panelProduct.match(/(\d+)\s*W/i)?.[1] ?? 0);
  const kwp = estimateData?.kwp || ((estimateData?.total_panels ?? 0) * watt) / 1000;

  const rows = [
    {
      label: "Installert effekt",
      value: `${nok(kwp, 1)} kWp`,
      detail: `${nok(estimateData?.yearly_prod)} kWh i året`,
      link: estimateData?.price_data?.simulationPdfUrl,
      linkLabel: "Åpne simulering",
    },
  ];
  const add = (label, items, suffix) =>
    items.forEach((item, i) =>
      rows.push({
        label: i === 0 ? label : "",
        value: `${nok(item.quantity)} stk`,
        detail: [item.product || item.name, suffix].filter(Boolean).join(" "),
        link: item.attachmentUrl,
        linkLabel: "Produktark",
      }),
    );
  add("Solcellepaneler", panels.length ? panels : [{ quantity: estimateData?.total_panels, product: panelProduct }]);
  add("Inverter", inverters);
  add("Festesystem", mounting);
  add("Batteri", batteries);
  return rows;
}

function Steps({ finished }) {
  const steps = [
    ["Estimat mottatt", true],
    ["Befaring ved behov", Boolean(finished)],
    ["Ferdig tilbud til vurdering", Boolean(finished)],
    ["Montering når det passer deg", false],
  ];
  const current = steps.findIndex(([, done]) => !done);
  return (
    <ol className="solar-steps" aria-label="Hvor langt vi har kommet">
      {steps.map(([label, done], i) => (
        <li
          key={label}
          className={done ? "done" : i === current ? "current" : ""}
          aria-current={i === current ? "step" : undefined}
        >
          <span className="solar-step-dot" aria-hidden="true">
            {done ? "✓" : i + 1}
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

function Timeline({ paymentTime }) {
  const MAX = 40;
  const rows = [
    ["Nedbetalt", paymentTime, paymentTime ? `ca. ${paymentTime} år` : "Mer enn 30 år", "payback"],
    ["Produktgaranti paneler", 25, "25 år", ""],
    ["Effektgaranti paneler", 30, "30 år", ""],
    ["Forventet levetid", MAX, "40+ år", "life"],
  ];
  return (
    <div className="solar-timeline">
      {rows.map(([label, years, text, variant]) => (
        <div key={label} className="solar-timeline-row">
          <div className="solar-timeline-label">
            <span>{label}</span>
            <strong>{text}</strong>
          </div>
          <div className="solar-timeline-track">
            <span
              className={`solar-timeline-bar ${variant}`}
              style={{ width: `${Math.min(100, ((years || 30) / MAX) * 100)}%` }}
            />
          </div>
        </div>
      ))}
      <div className="solar-timeline-axis" aria-hidden="true">
        {[0, 10, 20, 30, 40].map((y) => (
          <span key={y}>{y} år</span>
        ))}
      </div>
    </div>
  );
}

function Slider({ id, label, value, unit, min, max, step, onChange, decimals = 2 }) {
  return (
    <div className="solar-slider">
      <label htmlFor={id}>
        <span>{label}</span>
        <strong>
          {nok(value, decimals)} {unit}
        </strong>
      </label>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function SolarOverview({
  estimateData,
  finished,
  config,
  solarCostPerKwh,
  solarCostWithLoan,
  elPrice,
  setElPrice,
  elNetPrice,
  setElNetPrice,
  expectedElPriceIncrease,
  setExpectedElPriceIncrease,
  futureGridPrice,
  paymentTime,
  economySummary,
}) {
  const gridPrice = elPrice + elNetPrice;
  const difference = gridPrice - solarCostPerKwh;
  const rows = facilityRows(estimateData);

  return (
    <div className="offer-solar">
      <Steps finished={finished} />

      {/* Anlegget */}
      <div className="solar-grid">
        <section className="solar-card">
          <p className="solar-eyebrow">SLIK BLIR ANLEGGET</p>
          <h3 className="solar-title">
            {nok(estimateData?.total_panels)} paneler som gir rundt{" "}
            {nok(estimateData?.yearly_prod)} kWh i året.
          </h3>
          <p className="solar-muted">
            Plasseringen er basert på vår vurdering av taket ditt.
            {!finished && " Oppsettet er fleksibelt – vi tilpasser det etter dine ønsker."}
          </p>
          {estimateData?.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="solar-image" src={estimateData.image_url} alt="Plassering av solcellepanelene" />
          )}
        </section>

        <section className="solar-card">
          <p className="solar-eyebrow">ANLEGGET BESTÅR AV</p>
          <dl className="solar-specs">
            {rows.map((row, i) => (
              <div key={i} className={row.label ? "first" : ""}>
                <dt>{row.label}</dt>
                <dd>
                  <strong>{row.value}</strong>
                  <span>{row.detail}</span>
                </dd>
                {finished && row.link ? (
                  <Link className="solar-link" href={row.link} target="_blank">
                    {row.linkLabel} ↗
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Produksjon og besparelse */}
      <section className="solar-card">
        <p className="solar-eyebrow">PRODUKSJON OG BESPARELSE</p>
        <h3 className="solar-title solar-title-lg">
          Anlegget produserer strøm til ca. <mark>{kr(solarCostPerKwh)}</mark>, mot{" "}
          {kr(gridPrice)} for strøm fra nettet i dag.
        </h3>
        <p className="solar-muted">
          Strøm fra nettet inkluderer både strømpris og nettleie. Prisen for solstrømmen tar med
          service, vedlikehold og inverterbytte gjennom effektgarantien på 30 år.
        </p>

        <div className="solar-figures">
          <div className="solar-figure accent">
            <span>Solstrøm fra anlegget</span>
            <strong>{nok(solarCostPerKwh, 2)}</strong>
            <small>kr/kWh over 30 år</small>
          </div>
          <div className="solar-figure">
            <span>Solstrøm med lån</span>
            <strong>{nok(solarCostWithLoan, 2)}</strong>
            <small>kr/kWh · 10 % rente, 5 år</small>
          </div>
          <div className="solar-figure">
            <span>Strøm fra nettet i dag</span>
            <strong>{nok(gridPrice, 2)}</strong>
            <small>kr/kWh inkl. nettleie</small>
          </div>
          <div className="solar-figure">
            <span>Årsproduksjon</span>
            <strong>{nok(estimateData?.yearly_prod)}</strong>
            <small>kWh i året</small>
          </div>
          <div className="solar-figure positive">
            <span>Total besparelse</span>
            <strong>{nok(economySummary?.totalSavings30Years)}</strong>
            <small>kr over 30 år</small>
          </div>
          <div className="solar-figure positive">
            <span>Snitt per år</span>
            <strong>{nok(economySummary?.averageYearlySavings)}</strong>
            <small>kr i årlig besparelse</small>
          </div>
        </div>

        <div className="solar-subsection">
          <p className="solar-eyebrow">LØNNSOMHET OG LEVETID</p>
          <Timeline paymentTime={paymentTime} />
        </div>
      </section>

      {/* Forutsetninger */}
      <section className="solar-card">
        <p className="solar-eyebrow">JUSTER FORUTSETNINGENE</p>
        <h3 className="solar-title">Ingen vet hva strømmen koster om ti år. Prøv selv.</h3>
        <p className="solar-muted">
          Strømprisen fra nettet varierer over tid. Juster strømpris, nettleie og forventet
          prisvekst, så endres regnestykket og grafen under med en gang.
        </p>

        <div className="solar-adjust">
          <div className="solar-adjust-controls">
            <Slider id="el-price" label="Strømpris" value={elPrice} unit="kr/kWh" min={0.1} max={2} step={0.05} onChange={setElPrice} />
            <Slider id="el-net-price" label="Nettleie" value={elNetPrice} unit="kr/kWh" min={0.1} max={2} step={0.05} onChange={setElNetPrice} />
            <Slider
              id="el-increase"
              label="Forventet årlig prisvekst"
              value={expectedElPriceIncrease}
              unit="%"
              min={0.1}
              max={10}
              step={0.05}
              onChange={setExpectedElPriceIncrease}
            />

            <dl className="solar-compare">
              <div>
                <dt>Solstrøm fra anlegget</dt>
                <dd>{kr(solarCostPerKwh)}</dd>
              </div>
              <div>
                <dt>Strøm fra nettet i dag</dt>
                <dd>{kr(gridPrice)}</dd>
              </div>
              <div className={difference >= 0 ? "positive" : "negative"}>
                <dt>Forskjell per kWh</dt>
                <dd>{kr(difference)}</dd>
              </div>
            </dl>

            <p className="solar-note">
              Med {nok(expectedElPriceIncrease, 2)} % årlig prisvekst tilsvarer{" "}
              {kr(gridPrice)} i dag omtrent <strong>{kr(futureGridPrice)}</strong> om 30 år. Strømmen
              fra anlegget koster ca. <strong>{kr(solarCostPerKwh)}</strong> gjennom hele levetiden.
            </p>
          </div>

          <SpotPriceWidget setElPrice={setElPrice} site={config.site} solarLocation={config.solarLocation} />
        </div>
      </section>
    </div>
  );
}

"use client";

/**
 * «Strømkostnadene dine med og uten solceller».
 *
 * Kunden legger inn eget årsforbruk og velger 10, 20 eller 30 år. Alle tall,
 * grafen og tabellen kommer fra samme beregning (offerEconomics.js), så det
 * som står i «Kort fortalt» øverst alltid stemmer med det som står her.
 */

import { useEffect, useId, useRef, useState } from "react";
import SpotPriceWidget from "../SpotPriceWidget";
import { periodSummary } from "./offerEconomics";
import "./offerStory.css";

const kr = (v) => `${Math.round(Number(v) || 0).toLocaleString("nb-NO")} kr`;
const num = (v, d = 0) => (Number(v) || 0).toLocaleString("nb-NO", { minimumFractionDigits: d, maximumFractionDigits: d });
const PERIODS = [10, 20, 30];

/** «1,2 mill. kr» for store tall i grafen */
const short = (v) => (Math.abs(v) >= 1e6 ? `${num(v / 1e6, 1)} mill.` : num(v));

function niceMax(v) {
  const m = Math.pow(10, Math.floor(Math.log10(v || 1)));
  const s = v / m;
  const step = [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].find((n) => s <= n) ?? 10;
  return step * m;
}

/** Bredden grafen faktisk får, slik at tekst i SVG-en har ekte størrelse også på mobil. */
function useWidth(fallback = 760) {
  const ref = useRef(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/** Samlet kostnad år for år, uten og med solceller, for valgt periode. */
function CostChart({ sim, years, summary, replacement, isBusiness }) {
  const clip = useId();
  const [hover, setHover] = useState(null);
  const [plotRef, measured] = useWidth();
  const compact = measured < 560;
  const W = Math.max(300, Math.min(measured || 760, 900));
  const H = compact ? 280 : 330;
  const P = compact ? { top: 22, right: 86, bottom: 36, left: 64 } : { top: 24, right: 116, bottom: 40, left: 80 };
  const pw = W - P.left - P.right;
  const ph = H - P.top - P.bottom;

  const pts = [{ year: 0, cumWithout: 0, cumWith: sim.investment }, ...sim.rows.slice(0, years)];
  const max = niceMax(Math.max(...pts.map((p) => Math.max(p.cumWithout, p.cumWith))));
  const x = (yr) => P.left + (yr / years) * pw;
  const y = (v) => P.top + ph - (Math.max(0, v) / max) * ph;
  const line = (key) => pts.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
  const ticksY = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const ticksX = compact
    ? years === 10 ? [0, 5, 10] : years === 20 ? [0, 10, 20] : [0, 10, 20, 30]
    : years === 10 ? [0, 2, 4, 6, 8, 10] : years === 20 ? [0, 5, 10, 15, 20] : [0, 5, 10, 15, 20, 25, 30];
  const end = pts[pts.length - 1];
  const payback = summary.paidBackInPeriod ? pts.find((p) => p.year === summary.paybackYear) : null;
  const repl = replacement && replacement.year <= years ? pts.find((p) => p.year === replacement.year) : null;
  const h = hover != null ? pts[hover] : null;

  // Etiketter ved linjeslutt, skjøvet fra hverandre hvis de ligger tett
  let yW = y(end.cumWithout);
  let yS = y(end.cumWith);
  if (Math.abs(yW - yS) < 34) {
    const mid = (yW + yS) / 2;
    const up = yW <= yS ? -17 : 17;
    yW = mid + up;
    yS = mid - up;
  }

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const yr = Math.round(((px - P.left) / pw) * years);
    setHover(Math.max(0, Math.min(years, yr)));
  };

  return (
    <figure className="story-chart">
      <figcaption>
        <span className="story-legend">
          <i className="lg-without" /> Uten solceller
        </span>
        <span className="story-legend">
          <i className="lg-with" /> Med solceller ({isBusiness ? "investeringen" : "investering etter støtte"} inkludert)
        </span>
      </figcaption>
      <div className="story-chart-plot" ref={plotRef}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Samlet strømkostnad over ${years} år: uten solceller ${kr(end.cumWithout)}, med solceller ${kr(end.cumWith)}.`} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <defs>
            <clipPath id={clip}>
              <rect x={P.left} y={P.top - 4} width={pw} height={ph + 8} />
            </clipPath>
          </defs>
          {ticksY.map((t) => (
            <g key={t}>
              <line className="ch-grid" x1={P.left} x2={P.left + pw} y1={y(t)} y2={y(t)} />
              <text className="ch-tick" x={P.left - 10} y={y(t) + 4}>{short(t)}</text>
            </g>
          ))}
          {ticksX.map((t) => (
            <text key={t} className="ch-tick ch-tick-x" x={x(t)} y={H - 14}>{t === 0 ? "I dag" : `År ${t}`}</text>
          ))}

          {repl && (
            <g className="ch-repl">
              <line x1={x(repl.year)} x2={x(repl.year)} y1={P.top} y2={P.top + ph} />
              <text x={x(repl.year) + 6} y={P.top + 12}>Inverterbytte</text>
            </g>
          )}

          <g clipPath={`url(#${clip})`}>
            <path className="ch-line ch-without" d={line("cumWithout")} />
            <path className="ch-line ch-with" d={line("cumWith")} />
          </g>

          {payback && (
            <g className="ch-payback">
              <circle cx={x(payback.year)} cy={y(payback.cumWith)} r="6" />
              <text x={x(payback.year)} y={y(payback.cumWith) + 26}>Tjent inn år {payback.year}</text>
            </g>
          )}

          <circle className="ch-end ch-without" cx={x(end.year)} cy={y(end.cumWithout)} r="5" />
          <circle className="ch-end ch-with" cx={x(end.year)} cy={y(end.cumWith)} r="5" />
          <text className="ch-endlabel" x={x(end.year) + 10} y={yW + 4}>{compact ? short(Math.round(end.cumWithout / 1000) * 1000) : kr(Math.round(end.cumWithout / 1000) * 1000)}</text>
          <text className="ch-endlabel" x={x(end.year) + 10} y={yS + 4}>{compact ? short(Math.round(end.cumWith / 1000) * 1000) : kr(Math.round(end.cumWith / 1000) * 1000)}</text>

          {h && (
            <g className="ch-hover">
              <line x1={x(h.year)} x2={x(h.year)} y1={P.top} y2={P.top + ph} />
              <circle className="ch-without" cx={x(h.year)} cy={y(h.cumWithout)} r="5" />
              <circle className="ch-with" cx={x(h.year)} cy={y(h.cumWith)} r="5" />
            </g>
          )}
        </svg>
        {h && (
          <div className="story-tip" style={{ left: `${(x(h.year) / W) * 100}%` }}>
            <strong>{h.year === 0 ? "I dag" : `Etter ${h.year} år`}</strong>
            <span><i className="lg-without" /> Uten: {kr(h.cumWithout)}</span>
            <span><i className="lg-with" /> Med: {kr(h.cumWith)}</span>
          </div>
        )}
      </div>
    </figure>
  );
}

function Slider({ id, label, help, value, min, max, step, unit, decimals = 2, onChange }) {
  return (
    <div className="story-slider">
      <label htmlFor={id}>
        <span>
          {label}
          {help && <small>{help}</small>}
        </span>
        <strong>
          {num(value, decimals)} {unit}
        </strong>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export default function CostComparison({
  sim,
  period,
  setPeriod,
  consumption,
  setConsumption,
  consumptionIsDefault,
  consumptionFromLead,
  selfUseShare,
  setSelfUseShare,
  selfUseIsDefault,
  exportPrice,
  setExportPrice,
  elPrice,
  setElPrice,
  netPrice,
  setNetPrice,
  growth,
  setGrowth,
  price,
  replacement,
  costKwh,
  config,
}) {
  const [text, setText] = useState(String(consumption));
  const [focused, setFocused] = useState(false);
  const summary = periodSummary(sim, period);
  const rows = sim.rows.slice(0, period);
  const sum = (k) => rows.reduce((s, r) => s + r[k], 0);
  const first = sim.rows[0];
  const gridPrice = elPrice + netPrice;
  const selfPct = first.production > 0 ? (first.selfUse / first.production) * 100 : 0;
  const coverPct = consumption > 0 ? (first.selfUse / consumption) * 100 : 0;
  const tax = price.isBusiness ? "eks. mva." : "inkl. mva.";

  const commit = () => {
    setFocused(false);
    const v = Math.round(Number(text.replace(/\s/g, "").replace(",", ".")));
    if (v >= 500 && v <= 500000) setConsumption(v);
    else setText(String(consumption));
  };

  return (
    <div className="offer-story" id="med-og-uten">
      {/* Kundens tall */}
      <div className="story-card story-inputs">
        <div className="story-consumption">
          <label htmlFor="annual-consumption">Ditt årlige strømforbruk</label>
          <div className="story-consumption-field">
            <input
              id="annual-consumption"
              inputMode="numeric"
              value={focused ? text : num(consumption)}
              onFocus={() => {
                setText(String(consumption));
                setFocused(true);
              }}
              onChange={(e) => setText(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              aria-describedby="consumption-help"
            />
            <span>kWh i året</span>
          </div>
          <p id="consumption-help" className="story-fine">
            {consumptionIsDefault
              ? "Vi har brukt et vanlig forbruk for en enebolig. Legg inn ditt eget tall for en mer treffsikker beregning. "
              : consumptionFromLead
                ? "Tallet er det du oppga til oss. Endre det hvis du vet mer nøyaktig. "
                : ""}
            Du finner forbruket ditt på Min side hos nettselskapet, på fakturaen for nettleie, eller på elhub.no.
          </p>
        </div>

        <div className="story-period">
          <span id="period-label">Vis over</span>
          <div className="story-segment" role="radiogroup" aria-labelledby="period-label">
            {PERIODS.map((p) => (
              <button key={p} type="button" role="radio" aria-checked={period === p} onClick={() => setPeriod(p)}>
                {p} år
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultat */}
      <div className="story-compare">
        <div className="story-total story-total-without">
          <span className="story-total-label">Uten solceller</span>
          <strong>{kr(summary.without)}</strong>
          <p>
            Strøm for {num(consumption)} kWh i året, i dag {num(gridPrice, 2)} kr/kWh og {num(growth, 1)} % prisvekst i året.
          </p>
        </div>
        <div className="story-total story-total-with">
          <span className="story-total-label">Med solceller</span>
          <strong>{kr(summary.with)}</strong>
          <dl>
            <div>
              <dt>{price.isBusiness ? "Investering" : "Investering etter støtte"}</dt>
              <dd>{kr(sim.investment)}</dd>
            </div>
            <div>
              <dt>Strøm du fortsatt kjøper</dt>
              <dd>{kr(sum("boughtCost"))}</dd>
            </div>
            <div>
              <dt>Salg av overskuddsstrøm</dt>
              <dd>− {kr(sum("exportIncome"))}</dd>
            </div>
            {summary.replacementInPeriod && (
              <div>
                <dt>Inverterbytte år {replacement.year}</dt>
                <dd>{kr(replacement.cost)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className={`story-diff ${summary.difference >= 0 ? "positive" : "pending"}`}>
        {summary.difference >= 0 ? (
          <>
            <strong>Med solceller betaler du ca. {kr(summary.difference)} mindre over {period} år.</strong>
            <span>
              Investeringen er tatt med. {summary.paybackYear ? `Anlegget er tjent inn etter ca. ${summary.paybackYear} år.` : ""}
            </span>
          </>
        ) : (
          <>
            <strong>Etter {period} år er anlegget ikke tjent inn ennå.</strong>
            <span>
              Du har da betalt ca. {kr(-summary.difference)} mer enn uten solceller.{" "}
              {summary.paybackYear
                ? `Med disse forutsetningene er anlegget tjent inn etter ca. ${summary.paybackYear} år, og deretter sparer du hvert år.`
                : "Med disse forutsetningene tjenes anlegget ikke inn innen 30 år."}
            </span>
          </>
        )}
      </div>

      <div className="story-card">
        <CostChart sim={sim} years={period} summary={summary} replacement={replacement} isBusiness={price.isBusiness} />
        <p className="story-fine">
          Samlede, beregnede beløp {tax} over perioden, basert på forutsetningene under. Fremtidige strømpriser er en
          antakelse, ikke en sikker prognose. Faste ledd i nettleien og strømavtalen betaler du likt med og uten
          solceller, så de er holdt utenfor begge.
        </p>
      </div>

      {/* Solstrømmen første år */}
      <div className="story-card">
        <p className="story-eyebrow">SLIK BRUKES SOLSTRØMMEN DET FØRSTE ÅRET</p>
        <p className="story-lead">
          Anlegget produserer ca. <strong>{num(first.production)} kWh</strong>. Sola skinner mest midt på dagen, ofte når
          du ikke bruker så mye strøm. Derfor brukes en del direkte i huset, og resten selges.
        </p>
        <div className="story-split" aria-hidden="true">
          <span className="split-self" style={{ flexGrow: first.selfUse }} />
          <span className="split-export" style={{ flexGrow: first.exported }} />
        </div>
        <div className="story-split-grid">
          <div>
            <span><i className="dot-self" /> Bruker du selv</span>
            <strong>{num(first.selfUse)} kWh</strong>
            <small>Sparer ca. {kr(first.selfUse * gridPrice)} i strøm og nettleie</small>
          </div>
          <div>
            <span><i className="dot-export" /> Selges som overskudd</span>
            <strong>{num(first.exported)} kWh</strong>
            <small>Gir ca. {kr(first.exportIncome)} til {num(exportPrice, 2)} kr/kWh</small>
          </div>
          <div>
            <span><i className="dot-bought" /> Kjøper du fortsatt</span>
            <strong>{num(first.bought)} kWh</strong>
            <small>Solstrømmen dekker ca. {num(coverPct)} % av forbruket ditt</small>
          </div>
        </div>
        <p className="story-fine">
          {selfUseIsDefault ? "Anslag: " : ""}Vi har ikke timedata for forbruket ditt, så vi antar at du bruker ca.{" "}
          {num(selfPct)} % av solstrømmen selv. Andelen kan justeres under forutsetninger.
        </p>
      </div>

      {/* Kostnad per kWh og flytting */}
      <div className="story-two">
        <div className="story-card">
          <p className="story-eyebrow">HVA KOSTER SOLSTRØMMEN?</p>
          <p className="story-big">
            ca. {num(costKwh.perKwh, 2)} <small>kr/kWh</small>
          </p>
          <p className="story-muted">
            Over 30 år produserer anlegget ca. {num(costKwh.production)} kWh. Samlet kostnad er ca. {kr(costKwh.costs)}:
            investeringen{price.isBusiness ? "" : " etter støtte"} og inverterbyttet i år {replacement.year}. Det gir ca.{" "}
            {num(costKwh.perKwh, 2)} kr per kWh anlegget produserer, mot {num(gridPrice, 2)} kr/kWh for strøm fra nettet
            i dag. Strømmen du kjøper fra nettet kommer i tillegg. Nedgangen i produksjon over tid er tatt med.
          </p>
        </div>
        <div className="story-card">
          <p className="story-eyebrow">HVIS DU FLYTTER</p>
          <p className="story-lead">Ikke alle blir boende i 30 år. Derfor viser vi også 10 og 20 år.</p>
          <p className="story-muted">
            Et hus med egen strømproduksjon og lavere forventede strømutgifter kan være attraktivt for en kjøper.
            Vi legger likevel ingen verdiøkning på boligen inn i beregningen, og kan ikke love at den gir høyere pris.
          </p>
        </div>
      </div>

      {/* Forutsetninger */}
      <details className="story-details">
        <summary>
          <span>
            <strong>Forutsetninger</strong>
            <small>Strømpris, nettleie, prisvekst, egenbruk og salgspris. Juster selv.</small>
          </span>
          <span className="story-details-open">Åpne</span>
        </summary>
        <div className="story-assumptions">
          <div className="story-sliders">
            <Slider id="el-price" label="Strømpris" help="Det du betaler per kWh, etter eventuell strømstøtte eller Norgespris" value={elPrice} min={0.1} max={3} step={0.01} unit="kr/kWh" onChange={setElPrice} />
            <Slider id="net-price" label="Nettleie, energiledd" help="Pris per kWh inkl. avgifter. Fastleddet er holdt utenfor" value={netPrice} min={0.1} max={2} step={0.01} unit="kr/kWh" onChange={setNetPrice} />
            <Slider id="growth" label="Årlig prisvekst" help="Gjelder både strøm du kjøper og strøm du selger" value={growth} min={0} max={8} step={0.1} unit="%" decimals={1} onChange={setGrowth} />
            <Slider id="self-use" label="Andel av solstrømmen du bruker selv" help="Høyere hvis du bruker mye strøm på dagtid" value={Math.round(selfUseShare * 100)} min={10} max={90} step={1} unit="%" decimals={0} onChange={(v) => setSelfUseShare(v / 100)} />
            <Slider id="export-price" label="Salgspris for overskudd" help="Spotpris når du selger, ofte lavere midt på dagen" value={exportPrice} min={0} max={2} step={0.01} unit="kr/kWh" onChange={setExportPrice} />
          </div>
          <div>
            <SpotPriceWidget setElPrice={setElPrice} site={config.site} solarLocation={config.solarLocation} />
          </div>
        </div>
        <ul className="story-assumption-list">
          <li>Panelene mister ca. 0,4 % produksjon i året. Dette er tatt med.</li>
          <li>
            I år {replacement.year} regner vi med at {replacement.what} byttes, for ca. {kr(replacement.cost)} {tax}{" "}
            ({replacement.basis}). Kostnaden er med i sammenligningen fra og med år {replacement.year}.
          </li>
          <li>Ingen andre faste driftskostnader er lagt inn. Solcelleanlegg har lite løpende vedlikehold.</li>
          <li>
            Strøm du bruker selv er verdt det du ellers ville betalt: strømpris og nettleie per kWh. Overskudd selges
            til salgsprisen, uten nettleie.
          </li>
          <li>Hybridinverter og batteri er ikke med her. De vises separat lenger ned.</li>
        </ul>
      </details>

      <details className="story-details">
        <summary>
          <span>
            <strong>Hele beregningen år for år</strong>
            <small>Produksjon, egenbruk, salg og kostnader for de {period} årene</small>
          </span>
          <span className="story-details-open">Åpne</span>
        </summary>
        <div className="story-table-wrap">
          <table className="story-table">
            <thead>
              <tr>
                <th>År</th>
                <th>Produksjon kWh</th>
                <th>Bruker selv kWh</th>
                <th>Selger kWh</th>
                <th>kWh-pris</th>
                <th>Uten solceller</th>
                <th>Med solceller</th>
                <th>Spart</th>
                <th>Samlet forskjell</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>I dag</td>
                <td colSpan={5}>Investering{price.isBusiness ? "" : " etter støtte"}</td>
                <td>{kr(sim.investment)}</td>
                <td />
                <td className="neg">{kr(-sim.investment)}</td>
              </tr>
              {rows.map((r) => {
                const cum = r.cumWithout - r.cumWith;
                return (
                  <tr key={r.year} className={r.year === summary.paybackYear ? "payback" : ""}>
                    <td>{r.year}</td>
                    <td>{num(r.production)}</td>
                    <td>{num(r.selfUse)}</td>
                    <td>{num(r.exported)}</td>
                    <td>{num(r.kwhPrice, 2)}</td>
                    <td>{kr(r.costWithout)}</td>
                    <td>
                      {kr(r.costWith)}
                      {r.replacementCost > 0 && <small> inkl. inverterbytte</small>}
                    </td>
                    <td>{kr(r.saving)}</td>
                    <td className={cum >= 0 ? "pos" : "neg"}>{kr(cum)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

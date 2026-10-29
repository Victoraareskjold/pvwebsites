"use client";

/**
 * Næringsanalysen i tilbudet (price_data.businessAnalysis).
 *
 * Tallene er regnet time for time i kalkulatortjenesten og låst da tilbudet ble lagret:
 * forbruk, solproduksjon, spotpriser og nettleie for en valgt periode, og deretter en
 * egen fremskriving over levetiden. Denne komponenten regner ingenting selv – den viser
 * bare det lagrede resultatet, slik at tilbudssiden, dashboardet og en senere PDF
 * alltid viser det samme.
 */

import { useState } from "react";
import "./offerStory.css";

const kr = (v) => (v == null ? "—" : `${Math.round(Number(v) || 0).toLocaleString("nb-NO")} kr`);
const num = (v, d = 0) => (Number(v) || 0).toLocaleString("nb-NO", { minimumFractionDigits: d, maximumFractionDigits: d });
const MONTHS = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
const STATUS_LABEL = { målt: "Målt", beregnet: "Beregnet", antatt: "Antatt" };
/** Kildetype (nyere analyser). Eldre analyser har bare status. */
const SOURCE_LABEL = {
  måledata: "Måledata",
  markedspriser: "Markedspriser",
  tariffregister: "Nettselskapets tariff",
  simulert: "Simulert",
  oppgitt: "Oppgitt",
  antatt: "Antatt",
  beregnet: "Beregnet",
};
const SOURCE_CLASS = { måledata: "målt", markedspriser: "målt", tariffregister: "målt", oppgitt: "målt", simulert: "beregnet", beregnet: "beregnet", antatt: "antatt" };

/** Året prisene gjelder og værgrunnlaget, med fallback for eldre analyser. */
function yearsOf(a) {
  const price = a.years?.price ?? (Number(String(a.period?.label ?? "").match(/\d{4}/)?.[0]) || null);
  return { price, weather: a.years?.weather ?? null };
}
/** Netto gevinst i analyseåret: lavere energikostnad minus løpende kostnader (eldre analyser: bare besparelsen). */
function historicalOf(a) {
  return a.historical ?? { energySaving: a.savings.total, opex: 0, net: a.savings.total, opexItems: [] };
}

/** «Kort fortalt» for næring – erstatter den forenklede årsmodellen når analysen finnes. */
export function BusinessHighlights({ analysis }) {
  if (analysis.valid === false) return null;
  const main = analysis.economy?.[0];
  const { price } = yearsOf(analysis);
  const hist = historicalOf(analysis);
  const unresolved = analysis.investmentNok == null;
  return (
    <div className="offer-story">
      <div className="story-highlights" aria-label="Kort fortalt">
        <div className="story-hl story-hl-main">
          <span className="story-hl-label">Investering i solcelleanlegget</span>
          <strong className="story-hl-value">{unresolved ? "Avklares" : kr(analysis.investmentNok)}</strong>
          <span className="story-hl-sub">eks. mva. · {num(analysis.system.kwp, 1)} kWp</span>
        </div>
        <div className="story-hl">
          <span className="story-hl-label">Netto gevinst med {price ?? analysis.period.label}-priser</span>
          <strong className="story-hl-value">{kr(hist.net)}</strong>
          <span className="story-hl-sub">
            Strømregningen fra {kr(analysis.before.cost.netto)} til {kr(analysis.after.cost.netto)} med faktiske priser i {analysis.period.label}
            {hist.opex ? `, minus ${kr(hist.opex)} i løpende kostnader` : ""}.
          </span>
        </div>
        <div className="story-hl">
          <span className="story-hl-label">Tilbakebetaling</span>
          <strong className={`story-hl-value ${main?.paybackYears != null && !unresolved ? "positive" : ""}`}>
            {unresolved ? "—" : main?.paybackYears != null ? `ca. ${num(main.paybackYears, 1)} år` : "Ikke i perioden"}
          </strong>
          <span className="story-hl-sub">
            {unresolved
              ? "Beregnes når investeringen er avklart."
              : main?.paybackYears != null
                ? `Scenario: ${main.name.toLowerCase()}. Med ingen prisvekst: ${analysis.economy?.[1]?.paybackYears != null ? `ca. ${num(analysis.economy[1].paybackYears, 1)} år` : "ikke innen perioden"}.`
                : `Anlegget tjenes ikke inn innen ${analysis.assumptions.years} år med disse forutsetningene.`}
          </span>
        </div>
      </div>
      <a className="story-hl-link" href="#naeringsanalyse">
        Se beregningen og hva den bygger på ↓
      </a>
    </div>
  );
}

export default function BusinessAnalysis({ analysis }) {
  const [scenario, setScenario] = useState(0);
  if (analysis.valid === false) return null;
  const { price, weather } = yearsOf(analysis);
  const hist = historicalOf(analysis);
  const eco = analysis.economy?.[scenario] ?? null;
  const sv = analysis.savings;
  const maxCost = Math.max(...analysis.months.map((m) => m.costBefore), 1);
  const parts = [
    ["Strøm du slipper å kjøpe", sv.kraft],
    ["Lavere nettleie (energiledd)", sv.nettleieEnergi],
    ["Lavere effekttopper (effektledd)", sv.effektledd],
    ["Lavere elavgift", sv.elavgift],
    ["Salg av overskuddsstrøm", sv.salg],
  ].filter(([, v]) => Math.round(v) !== 0);
  const maxPart = Math.max(...parts.map(([, v]) => Math.abs(v)), 1);

  // Akkumulert kontantstrøm for grafen
  const rows = eco?.rows ?? [];
  const accVals = rows.map((r) => r.akkumulert).filter((v) => v != null);
  const invest = analysis.investmentNok;

  return (
    <div className="offer-story" id="naeringsanalyse">
      <section className="story-card">
        <p className="story-eyebrow">BEREGNET FOR BYGGET DITT</p>
        <p className="story-lead">{analysis.customerSentence}</p>
        {analysis.scope?.batteryOffered && (
          <p className="story-fine">
            Beregningen gjelder solcelleanlegget. Batteriet i tilbudet er ikke med i disse tallene; nytten av batteriet er ikke beregnet her.
          </p>
        )}

        <div className="ba-grid">
          <div>
            <h3 className="ba-h">Beregnet besparelse i {price ?? analysis.period.label}</h3>
            {parts.map(([label, v]) => (
              <div className="ba-part" key={label}>
                <span>{label}</span>
                <span className="ba-bar" aria-hidden="true">
                  <i style={{ width: `${(Math.abs(v) / maxPart) * 100}%` }} />
                </span>
                <strong>{kr(v)}</strong>
              </div>
            ))}
            <div className="ba-part ba-total">
              <span>Lavere netto energikostnad</span>
              <span />
              <strong>{kr(hist.energySaving)}</strong>
            </div>
            {hist.opexItems.map((o) => (
              <div className="ba-part" key={o.name}>
                <span>− {o.name}</span>
                <span />
                <strong>−{kr(o.nok)}</strong>
              </div>
            ))}
            {hist.opexItems.length > 0 && (
              <div className="ba-part ba-total">
                <span>Netto årlig gevinst</span>
                <span />
                <strong>{kr(hist.net)}</strong>
              </div>
            )}
            <p className="story-fine">
              Bygget bruker selv {num(analysis.kpi.selfConsumptionShare * 100)} % av solstrømmen ({num(analysis.after.selfKwh)} av{" "}
              {num(analysis.after.pvKwh)} kWh), og solstrømmen dekker {num(analysis.kpi.selfSufficiencyShare * 100)} % av byggets forbruk på{" "}
              {num(analysis.after.loadKwh)} kWh. Regnet time for time med faktiske strømpriser og nettleie i {analysis.period.label}
              {weather ? ` og solforhold fra ${weather}` : ""}. Fastledd i nettleie og strømavtale endres ikke av solcellene og er ikke regnet som spart.
            </p>
          </div>

          <div>
            <h3 className="ba-h">Strømregningen måned for måned</h3>
            <div className="ba-bars" role="img" aria-label="Strømregning per måned med og uten solceller">
              {analysis.months.map((m) => (
                <div key={m.month} title={`${m.month}: ${kr(m.costBefore)} → ${kr(m.costAfter)}`}>
                  <span className="ba-before" style={{ height: `${(m.costBefore / maxCost) * 100}%` }} />
                  <span className="ba-after" style={{ height: `${(Math.max(0, m.costAfter) / maxCost) * 100}%` }} />
                  <em>{MONTHS[Number(m.month.slice(5)) - 1]}</em>
                </div>
              ))}
            </div>
            <p className="ba-legend">
              <i className="ba-before" /> uten solceller <i className="ba-after" /> med solceller
            </p>
          </div>
        </div>
      </section>

      {eco && (
        <section className="story-card">
          <p className="story-eyebrow">ØKONOMI OVER {analysis.assumptions.years} ÅR</p>
          {analysis.economy.length > 1 && (
            <div className="ba-tabs" role="tablist">
              {analysis.economy.map((e, i) => (
                <button key={e.name} type="button" role="tab" aria-selected={i === scenario} className={i === scenario ? "on" : ""} onClick={() => setScenario(i)}>
                  {e.name}
                </button>
              ))}
            </div>
          )}
          <div className="ba-kpis">
            <div>
              <span>Netto gevinst år 1</span>
              <strong>{kr(eco.firstYearNet)}</strong>
            </div>
            <div>
              <span>Tilbakebetalingstid ({eco.name.toLowerCase()})</span>
              <strong>{invest == null ? "Avklares" : eco.paybackYears != null ? `${num(eco.paybackYears, 1)} år` : "Ikke i perioden"}</strong>
            </div>
            <div>
              <span>Nåverdi ({eco.name.toLowerCase()})</span>
              <strong>{eco.npv == null ? "Avklares" : kr(eco.npv)}</strong>
            </div>
            {eco.irr != null && (
              <div>
                <span>Internrente</span>
                <strong>{num(eco.irr * 100, 1)} %</strong>
              </div>
            )}
          </div>
          {invest == null ? (
            <p className="story-fine">
              Investeringen er ikke endelig avklart. Med disse forutsetningene gir anlegget positiv nåverdi så lenge det koster under{" "}
              <strong>{kr(eco.pvOfOperations)}</strong> eks. mva.
            </p>
          ) : (
            accVals.length > 0 && <CashflowChart rows={rows} invest={invest} />
          )}
          <p className="story-fine">
            Nåverdi er verdien av fremtidige inn- og utbetalinger omregnet til dagens kroner, etter investeringen. Kalkulasjonsrenten er{" "}
            {num(analysis.assumptions.discountRatePct, 2)} % (nominell). Strømprisen vokser {num(eco.kraftGrowth * 100, 1)} % per år, nettleien{" "}
            {num(analysis.assumptions.growth.nettleiePct, 1)} %, og solproduksjonen synker {num(analysis.assumptions.degradationPct, 1)} % per år.{" "}
            {analysis.assumptions.vat} {analysis.assumptions.beforeTax} Scenarioene er alternative regnestykker, ikke sannsynligheter.
          </p>
        </section>
      )}

      <details className="story-card ba-details">
        <summary>Hva beregningen bygger på</summary>
        <table className="ba-basis">
          <tbody>
            {analysis.basis
              .filter((b) => b.what !== "Eksportgrense")
              .map((b) => (
                <tr key={b.what}>
                  <th scope="row">{b.what}</th>
                  <td>
                    {b.sourceType ? (
                      <span className={`ba-status ba-${SOURCE_CLASS[b.sourceType] ?? "beregnet"}`}>{SOURCE_LABEL[b.sourceType] ?? b.sourceType}</span>
                    ) : (
                      <span className={`ba-status ba-${b.status}`}>{STATUS_LABEL[b.status] ?? b.status}</span>
                    )}
                  </td>
                  <td>
                    {b.value}
                    {b.period ? <small> · {b.period}</small> : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <p className="story-fine">
          «Måledata», «Markedspriser» og «Nettselskapets tariff» er faktiske tall for perioden. «Simulert» og «Beregnet» er regnet ut. «Antatt»
          er en forutsetning vi har valgt fordi opplysningen mangler – bedre data kan endre resultatet. Solproduksjonen er simulert med PVGIS og
          er ikke en garanti. Beregnet {new Date(analysis.calculatedAt).toLocaleDateString("nb-NO")} · ref. {analysis.inputHash.slice(0, 8)}.
        </p>
      </details>
    </div>
  );
}

function CashflowChart({ rows, invest }) {
  const W = 760;
  const H = 240;
  const P = { top: 16, right: 16, bottom: 30, left: 70 };
  const pts = [{ year: 0, v: -invest }, ...rows.map((r) => ({ year: r.year, v: r.akkumulert }))];
  const min = Math.min(...pts.map((p) => p.v), 0);
  const max = Math.max(...pts.map((p) => p.v), 0);
  const x = (yr) => P.left + (yr / rows.length) * (W - P.left - P.right);
  const y = (v) => P.top + ((max - v) / (max - min || 1)) * (H - P.top - P.bottom);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)} ${y(p.v).toFixed(1)}`).join(" ");
  const short = (v) => (Math.abs(v) >= 1e6 ? `${num(v / 1e6, 1)} mill.` : num(v));
  return (
    <figure className="ba-cash">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Akkumulert kontantstrøm">
        <line x1={P.left} x2={W - P.right} y1={y(0)} y2={y(0)} className="ba-zero" />
        <text x={P.left - 8} y={y(max) + 4} textAnchor="end">{short(max)}</text>
        <text x={P.left - 8} y={y(0) + 4} textAnchor="end">0</text>
        <text x={P.left - 8} y={y(min) + 4} textAnchor="end">{short(min)}</text>
        <path d={path} className="ba-line" />
        {[0, 5, 10, 15, 20, 25, 30, 35, 40].filter((t) => t <= rows.length).map((t) => (
          <text key={t} x={x(t)} y={H - 8} textAnchor="middle">
            {t === 0 ? "i dag" : `år ${t}`}
          </text>
        ))}
      </svg>
      <figcaption>Akkumulert kontantstrøm: investeringen i dag, deretter netto gevinst hvert år (inkl. service og inverterbytte).</figcaption>
    </figure>
  );
}

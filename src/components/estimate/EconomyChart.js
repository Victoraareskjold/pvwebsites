"use client";

/**
 * Samlet økonomi gjennom 30 år, som kurve.
 *
 * Én serie: den kumulative summen, fra investeringen i år 0 til netto etter 30
 * år. Nedbetalingspunktet er markert og navngitt — det er hele poenget med
 * figuren, og det står som tekst, ikke som en farge man må tolke.
 *
 * Tabellen under grafen er dataversjonen; den er ikke erstattet.
 */

import { useId, useState } from "react";
import "./economyChart.css";

const WIDTH = 760;
const HEIGHT = 300;
const PAD = { top: 28, right: 20, bottom: 36, left: 64 };

const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

const nok = (value) =>
  Number(value || 0).toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/** Avrunder opp til et lesbart akse-steg. */
function niceStep(span) {
  const raw = span / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(raw) || 1)));
  const scaled = raw / magnitude;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return step * magnitude;
}

export default function EconomyChart({ rows, investmentCost, paybackYear }) {
  const clipId = useId();
  const [hover, setHover] = useState(null);

  if (!rows?.length) return null;

  // År 0 er investeringen, før noen besparelse har kommet inn.
  const points = [{ year: 0, cumulative: -investmentCost }, ...rows];

  const values = points.map((p) => p.cumulative);
  const rawMin = Math.min(...values, 0);
  const rawMax = Math.max(...values, 0);
  const step = niceStep(rawMax - rawMin);
  const min = Math.floor(rawMin / step) * step;
  const max = Math.ceil(rawMax / step) * step;

  const x = (year) => PAD.left + (year / 30) * PLOT_W;
  const y = (value) => PAD.top + PLOT_H - ((value - min) / (max - min)) * PLOT_H;

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)} ${y(p.cumulative).toFixed(1)}`)
    .join(" ");

  const area = `${line} L${x(30).toFixed(1)} ${y(0).toFixed(1)} L${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;

  const ticks = [];
  for (let v = min; v <= max; v += step) ticks.push(v);

  const payback = paybackYear
    ? points.find((p) => p.year === paybackYear)
    : null;

  const last = points[points.length - 1];

  // Nærmeste år til musepekeren, for kryss og boble.
  const handleMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const relative = ((event.clientX - box.left) / box.width) * WIDTH;
    const year = Math.round(((relative - PAD.left) / PLOT_W) * 30);
    const point = points.find((p) => p.year === Math.max(0, Math.min(30, year)));
    setHover(point ?? null);
  };

  return (
    <figure className="economy-chart">
      <figcaption>
        <strong>Samlet økonomi gjennom 30 år</strong>
        <span>
          Investeringen i år 0, og hvordan den tjenes inn år for år.
          {paybackYear
            ? ` Nedbetalt etter ${paybackYear} år.`
            : " Anlegget er ikke nedbetalt innenfor 30 år med disse forutsetningene."}
        </span>
      </figcaption>

      <div
        className="economy-chart-plot"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Samlet økonomi fra ${nok(-investmentCost)} kroner i år 0 til ${nok(
            last.cumulative,
          )} kroner etter 30 år.${paybackYear ? ` Nedbetalt etter ${paybackYear} år.` : ""}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                x={PAD.left}
                y={PAD.top}
                width={PLOT_W}
                height={PLOT_H}
              />
            </clipPath>
          </defs>

          {/* Verdiakse */}
          {ticks.map((value) => (
            <g key={value}>
              <line
                className="chart-grid"
                x1={PAD.left}
                x2={PAD.left + PLOT_W}
                y1={y(value)}
                y2={y(value)}
              />
              <text className="chart-tick" x={PAD.left - 10} y={y(value) + 4}>
                {nok(value / 1000)}k
              </text>
            </g>
          ))}

          {/* Nullinjen — skillet mellom å ha betalt og å tjene */}
          <line
            className="chart-zero"
            x1={PAD.left}
            x2={PAD.left + PLOT_W}
            y1={y(0)}
            y2={y(0)}
          />

          <path className="chart-area" d={area} clipPath={`url(#${clipId})`} />
          <path className="chart-line" d={line} clipPath={`url(#${clipId})`} />

          {/* Årsakse */}
          {[0, 10, 20, 30].map((year) => (
            <text
              key={year}
              className="chart-tick chart-tick-x"
              x={x(year)}
              y={HEIGHT - 12}
            >
              {year === 0 ? "I dag" : `År ${year}`}
            </text>
          ))}

          {payback && (
            <g className="chart-payback">
              <line
                x1={x(payback.year)}
                x2={x(payback.year)}
                y1={PAD.top}
                y2={y(0)}
              />
              <circle cx={x(payback.year)} cy={y(payback.cumulative)} r="6" />
              <text
                x={x(payback.year) + (payback.year > 22 ? -12 : 12)}
                y={PAD.top + 14}
                textAnchor={payback.year > 22 ? "end" : "start"}
              >
                Nedbetalt etter {payback.year} år
              </text>
            </g>
          )}

          {/* Sluttverdien er det andre tallet folk ser etter */}
          <circle className="chart-end" cx={x(30)} cy={y(last.cumulative)} r="5" />

          {hover && (
            <g className="chart-hover">
              <line
                x1={x(hover.year)}
                x2={x(hover.year)}
                y1={PAD.top}
                y2={PAD.top + PLOT_H}
              />
              <circle cx={x(hover.year)} cy={y(hover.cumulative)} r="6" />
            </g>
          )}
        </svg>

        {hover && (
          <div
            className="economy-tooltip"
            style={{ left: `${(x(hover.year) / WIDTH) * 100}%` }}
          >
            <strong>{hover.year === 0 ? "I dag" : `År ${hover.year}`}</strong>
            <span>{nok(hover.cumulative)} kr samlet</span>
          </div>
        )}
      </div>

      <div className="economy-chart-ends">
        <div>
          <span>I dag</span>
          <strong>{nok(-investmentCost)} kr</strong>
        </div>
        <div>
          <span>Etter 30 år</span>
          <strong>{nok(last.cumulative)} kr</strong>
        </div>
      </div>
    </figure>
  );
}

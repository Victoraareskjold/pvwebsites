import { useEffect, useState } from "react";

const ZONES = [
  { id: "NO1", label: "Øst-Norge (NO1)" },
  { id: "NO2", label: "Sør-Norge (NO2)" },
  { id: "NO3", label: "Midt-Norge (NO3)" },
  { id: "NO4", label: "Nord-Norge (NO4)" },
  { id: "NO5", label: "Vest-Norge (NO5)" },
];

const APPLIANCES = [
  {
    icon: "🚿",
    label: "En dusj",
    kWh: 6,
    note: "10 min, 160 liter vann = ~6 kWh",
  },
  {
    icon: "🍕",
    label: "Steke en grandiosa",
    kWh: 1.1,
    note: "Stekeovn i 30 min = ~1,1 kWh",
  },
  {
    icon: "🌡️",
    label: "En ovn på fullt hele døgnet",
    kWh: 24,
    note: "1000W x 24 timer = 24 kWh",
  },
];

function fmt(n) {
  return n.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtHour(isoString) {
  const d = new Date(isoString);
  const h = d.getHours();
  const h2 = h + 1;
  return `kl ${String(h).padStart(2, "0")}-${String(h2).padStart(2, "0")}`;
}

// prices from API are ex-MVA — multiply by 1.25 to include 25% MVA
const WITH_MVA = 1.25;

export default function SpotPriceWidget({ setElPrice, site, solarLocation }) {
  const [zone, setZone] = useState("NO1");
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (site && solarLocation) {
      setZone(solarLocation);
    }
  }, [site, solarLocation]);

  useEffect(() => {
    async function fetchPrices() {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const url = `https://www.hvakosterstrommen.no/api/v1/prices/${year}/${month}-${day}_${zone}.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunne ikke hente priser");
        const data = await res.json();
        setPrices(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, [zone]);

  const derived = prices
    ? (() => {
        const now = new Date();
        const currentHour = now.getHours();
        const current = prices[currentHour];
        const currentNok = current ? current.NOK_per_kWh * WITH_MVA : null;

        const all = prices.map((p) => p.NOK_per_kWh * WITH_MVA);
        const avg = all.reduce((a, b) => a + b, 0) / all.length;
        const maxVal = Math.max(...all);
        const minVal = Math.min(...all);
        const maxEntry = prices[all.indexOf(maxVal)];
        const minEntry = prices[all.indexOf(minVal)];

        // % change vs previous hour
        const prevHour = currentHour > 0 ? prices[currentHour - 1] : null;
        const pctChange =
          prevHour && currentNok
            ? ((currentNok - prevHour.NOK_per_kWh * WITH_MVA) /
                (prevHour.NOK_per_kWh * WITH_MVA)) *
              100
            : null;

        return {
          currentNok,
          avg,
          maxVal,
          minVal,
          maxEntry,
          minEntry,
          pctChange,
        };
      })()
    : null;

  // sync with parent slider when data loads
  /* useEffect(() => {
    if (derived?.currentNok && setElPrice) {
      setElPrice(Math.round(derived.currentNok * 100) / 100);
    }
  }, [derived?.currentNok]); */

  const today = new Date().toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm font-medium text-amber-800">
              Spotpris i dag {today}
            </p>
            <p className="text-xs text-amber-700 italic">
              med mva. men uten nettleie, avgifter og strømstøtte
            </p>
          </div>
          <select
            className="text-xs border border-amber-300 rounded-md bg-white px-2 py-1 text-amber-800"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.id}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-sm text-amber-700 mt-3">Henter priser...</p>
        )}
        {error && <p className="text-sm text-red-600 mt-3">Feil: {error}</p>}

        {derived && (
          <>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-sm text-amber-700">Nå</span>
              <span className="text-4xl font-bold text-amber-900">
                {fmt(derived.currentNok)}
              </span>
              <span className="text-sm text-amber-700">kr/kWh</span>
              {derived.pctChange !== null && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    derived.pctChange >= 0
                      ? "bg-red-500 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {derived.pctChange >= 0 ? "+" : ""}
                  {derived.pctChange.toFixed(1)} %
                </span>
              )}
            </div>

            <div className="flex gap-4 mt-2 text-sm flex-wrap">
              <span className="text-red-600 font-medium">
                ↑ {fmt(derived.maxVal)} kr{" "}
                <span className="text-gray-500 font-normal">
                  {fmtHour(derived.maxEntry.time_start)}
                </span>
              </span>
              <span className="text-green-700 font-medium">
                ↓ {fmt(derived.minVal)} kr{" "}
                <span className="text-gray-500 font-normal">
                  {fmtHour(derived.minEntry.time_start)}
                </span>
              </span>
              <span className="text-gray-700">{fmt(derived.avg)} kr snitt</span>
            </div>

            {setElPrice && (
              <button
                className="mt-3 text-xs underline text-amber-700 hover:text-amber-900"
                onClick={() =>
                  setElPrice(Math.round(derived.currentNok * 100) / 100)
                }
              >
                Bruk nåværende spotpris i kalkulatoren
              </button>
            )}
          </>
        )}
      </div>

      {/* Appliance cost cards */}
      {derived && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Med strømprisen i dag koster...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {APPLIANCES.map((a) => {
              const cost = derived.currentNok * a.kWh;
              const costMax = derived.maxVal * a.kWh;
              const costMin = derived.minVal * a.kWh;
              return (
                <div
                  key={a.label}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 leading-none"
                      style={{ fontSize: "16px" }}
                    >
                      {a.icon}
                    </span>
                    <span className="text-xs text-gray-500">{a.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {fmt(cost)} kr
                  </p>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="text-red-500">↑ {fmt(costMax)} kr</span>
                    <span className="text-green-600">↓ {fmt(costMin)} kr</span>
                  </div>
                  {/* <p className="text-xs text-gray-400 mt-1">{a.note}</p> */}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <a
        href="https://www.hvakosterstrommen.no/"
        target="_blank"
        rel="noreferrer"
        className="text-xs hover:underline self-end"
      >
        Data fra hvakosterstrommen.no
      </a>
    </div>
  );
}

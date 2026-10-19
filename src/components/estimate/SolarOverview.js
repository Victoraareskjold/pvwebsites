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
import "./offerSolar.css";

const nok = (value, decimals = 0) =>
  Number(value || 0).toLocaleString("nb-NO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });


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
        datasheet: true,
        linkLabel: "Åpne produktblad",
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

export default function SolarOverview({ estimateData, finished, consumption, firstYear, assumptions }) {
  const product = assumptions?.productWarrantyYears ?? 25;
  const power = assumptions?.powerWarrantyYears ?? 30;
  const life = assumptions?.expectedLifetimeYears ?? 40;
  const coverPct = consumption > 0 ? (Number(estimateData?.yearly_prod || 0) / consumption) * 100 : null;
  const selfPct = consumption > 0 && firstYear ? (firstYear.selfUse / consumption) * 100 : null;
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
                {row.link && (finished || row.datasheet) ? (
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

      {/* Hvorfor anlegget passer */}
      <div className="solar-fit">
        <div>
          <span>Årsproduksjon</span>
          <strong>{nok(estimateData?.yearly_prod)} kWh</strong>
          <small>Beregnet for takflatene, retningen og vinkelen på taket ditt</small>
        </div>
        {coverPct != null && (
          <div>
            <span>Ditt forbruk</span>
            <strong>{nok(consumption)} kWh</strong>
            <small>
              Anlegget produserer tilsvarende ca. {nok(coverPct)} % av det. Ca. {nok(selfPct)} % av forbruket dekkes direkte
              av solstrømmen.
            </small>
          </div>
        )}
        <div>
          <span>Garantier og levetid</span>
          <strong>
            {product} / {power} / {life}+ år
          </strong>
          <small>
            Produktgaranti {product} år og effektgaranti {power} år på panelene. Forventet levetid over {life} år.
          </small>
        </div>
      </div>
    </div>
  );
}

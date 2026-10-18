/**
 * Felles for tilbudssiden, kjøpsavtalen og signeringen (server):
 * batterioppsettet for et estimat, og kundens valg som tekst i lenken.
 */
import defaultBatteryConfig from "../../config/battery";
import { calculateExtras, normalizedSelection } from "./batteryModel";

/** Oppsettet batteriseksjonen regner med (estimatets batterySection over fellesoppsettet). */
export function batteryConfigFor(estimateData) {
  const section = estimateData?.price_data?.batterySection ?? {};
  return {
    ...defaultBatteryConfig,
    ...section,
    // estimates.private = true betyr næring (eksisterende navngiving)
    customerType: estimateData?.private ? "business" : "private",
    annualConsumption:
      section.annualConsumption ??
      estimateData?.leads?.own_consumption ??
      defaultBatteryConfig.annualConsumption,
  };
}

/**
 * Kunden kan signere med hybrid/batteri bare når tilbudet har ekte priser fra
 * kalkulatoren (batterySection med kundepriser). Eldre tilbud bruker
 * eksempelpriser og må gjennomgås.
 */
export const canSignExtras = (estimateData) =>
  Boolean(estimateData?.price_data?.batterySection?.pricesIncludeCommission);

/** «hybrid» eller «battery:<modell>:<antall>». Nødstrøm signeres ikke direkte. */
export function encodeSelection(selection) {
  if (!selection || selection.mode === "solar") return "";
  if (selection.mode === "hybrid") return "hybrid";
  return `battery:${selection.model}:${selection.modules}`;
}

export function decodeSelection(text) {
  const [mode, model, modules] = String(text || "").split(":");
  if (mode === "hybrid") return { mode: "hybrid" };
  if (mode === "battery" && model) return { mode: "battery", model, modules: Number(modules) };
  return { mode: "solar" };
}

/**
 * Kundens endelige valg og tilleggene, regnet fra estimatets egne priser.
 * Brukes likt i kjøpsavtalen (visning) og ved signering (lagres).
 */
export function signedOfferFor(estimateData, rawSelection) {
  const config = batteryConfigFor(estimateData);
  const allowed = canSignExtras(estimateData);
  const selection = normalizedSelection(
    { ...(allowed ? rawSelection : { mode: "solar" }), backup: "none" },
    config,
  );
  const extras = calculateExtras(selection, config);
  const vatRate = config.vatRate ?? 0.25;
  const baseEx = Number(estimateData?.price_data?.total || 0);
  const totalEx = baseEx + extras.extrasEx;
  const product = extras.product;
  return {
    selection: { mode: selection.mode, model: selection.mode === "battery" ? selection.model : null, modules: selection.mode === "battery" ? selection.modules : 0 },
    capacityKwh: extras.capacity,
    hybrid: selection.mode === "solar" ? null : config.hybrid ? { ...config.hybrid, quantity: config.hybridQty ?? 1 } : null,
    battery:
      selection.mode === "battery" && product
        ? { id: product.id ?? selection.model, name: product.brand, moduleKwh: product.moduleKwh, modules: selection.modules, bms: extras.bases, bmsName: product.bmsName ?? null }
        : null,
    lines: extras.lines.map((l) => ({ id: l.id, label: l.label, detail: l.detail ?? null, amountEx: l.amountEx })),
    baseEx,
    extrasEx: extras.extrasEx,
    totalEx,
    vatRate,
    totalIncVat: Math.round(totalEx * (1 + vatRate) * 100) / 100,
    quoteVersionId: estimateData?.quote_version_id ?? estimateData?.price_data?.quoteVersionId ?? null,
  };
}

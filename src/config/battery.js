/**
 * Oppsettet batteriseksjonen på estimatsiden regner med.
 *
 * Seksjonen vises på alle tilbud laget etter BATTERY_SECTION_FROM, uavhengig
 * av om det ligger batteri i tilbudet — kunden skal selv kunne utforske om
 * hen vil ha det. Derfor ligger prisene her, felles for alle sidene, og ikke
 * på det enkelte estimatet.
 *
 * Et estimat kan overstyre dette med `price_data.batterySection` den dagen
 * dashbordet skriver den blokken. Fram til da gjelder tallene under.
 *
 * ⚠️ TALLENE ER EKSEMPLER FRA PROTOTYPEN OG MÅ ERSTATTES MED REELLE PRISER
 * FØR DETTE VISES TIL KUNDER. Alle beløp er eks. mva.
 */

const batteryConfig = {
  customerType: "private",
  vatRate: 0.25,

  /** Kundens årsforbruk, når det er kjent. null betyr «ikke oppgitt». */
  annualConsumption: null,

  /** Brukes bare i døgnseksemplet i animasjonen, ikke i tilbudsprisen. */
  purchase: 2,
  exportPrice: 0.65,

  /** Oppgradering fra string- til hybridinverter. */
  hybridQty: 1,
  hybridUnitEx: 12000,

  /** Installasjonsarbeid for batteriet. */
  batteryInstallEx: 8000,

  /** Nødstrøm. Alltid veiledende — endelig omfang avklares med kunden. */
  backupCircuitBaseEx: 2500,
  backupCircuitUnitEx: 1500,
  backupWholeEstimateEx: 24000,

  /** Størrelsen som foreslås først. */
  recommended: { model: "enershare", modules: 5 },

  catalogue: {
    enershare: {
      id: "enershare",
      brand: "Enershare",
      moduleKwh: 3.2,
      min: 3,
      max: 24,
      modulesPerBase: 8,
      baseEx: 8000,
      moduleEx: 8000,
      /** Kvantumspris er av som standard — ingen rabatt uten at den slås på. */
      discountEnabled: false,
      tiers: [
        { min: 4, unitEx: 7600 },
        { min: 6, unitEx: 7200 },
      ],
      /** Over denne kapasiteten kreves eget leverandørtilbud. */
      supplierFromKwh: 50,
      datasheetUrl: null,
    },
  },
};

export default batteryConfig;

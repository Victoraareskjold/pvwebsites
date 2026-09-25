// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Minel Sol",

  site: "MinelSol",

  legal: "Minel Elmontasje Elverum",

  solarLocation: "NO1",

  logo: "/minelsol/minellogo.png",

  favicon: "/minelsol/favicon.ico",

  googleTagManager: "GTM-KM25JNPP",

  metaDesc:
    "Ta kontakt med oss for å høre hvordan våre solcelleløsninger kan hjelpe deg å redusere kostnader og få mest mulig ut av solenergi. Vi gir deg ærlige råd, skreddersydde løsninger og følger deg hele veien mot en mer bærekraftig energihverdag",

  primary: "#1C0E52",
  secondary: "#E00034",

  // Minel har egne farger. Nøklene her overstyrer designets standardfarger
  // bare for denne nettsiden – se src/config/design/theme.js.
  theme: {
    ink: "#1C0E52",
    inkDeep: "#1C0E52",
    inkDeepHover: "#2c1a73",
    surfaceTopbar: "#150A3F",
    surfacePanel: "#1C0E52",
    surfacePanel2: "#261571",
    surfaceDeepStrong: "#1C0E52eb",
    localSurface: "#1C0E52",
    localCopy: "#cfc9e4",
    heroRgb: "20,9,58",

    brand: "#E00034",
    brandInk: "#ffffff",
    brandHover: "#c40030",
    brandStrong: "#c40030",
    brandBright: "#ff7d93",
    brandBrightSoft: "#ffc2ce",
    brandBrightBorder: "#ff7d934d",
    brandAccent: "#c00030",
    brandSoft: "#fdeaee",
    brandSoftStrong: "#fbd5dd",
    brandSelected: "#fdeef1",
    brandSelectedBorder: "#f0a7b7",
    brandSelection: "#ffd0da",
    brandOnDark: "#ff9fb0",
    brandOnDarkBorder: "#ffffff33",
    brandMuted: "#6d6390",
    brandWarmInk: "#a00026",
    brandWarmLine: "#e7dff0",
    brandWarmBorder: "#f5d8de",
    brandWarmBorderSoft: "#e0003440",
    sunSurface: "#f6f2ff",

    // Minel har hvit navigasjon, ikke mørk.
    headerSurface: "#ffffff",
    headerInk: "#1C0E52",
    headerBorder: "#e7e3f1",
    headerLink: "#1C0E52",
    headerLinkHover: "#E00034",
    topbarInk: "#d8d2ea",
    topbarBorder: "#ffffff1f",

    ctaSurface: "#E00034",
    ctaInk: "#ffffff",
    ctaMuted: "#ffd3db",
    ctaAccent: "#ffe4e9",

    chartAlt: "#9fc0e0",

    // Batterikortet: lys rødtone leser bedre enn #E00034 på indigo,
    // og "nettet frakoblet" får en varm tone så den ikke drukner i rødt.
    batteryAccent: "#ff7d93",
    batteryAlert: "#ffc46b",
    batteryMuted: "#c6bfe0",

    // Minel har ikke Manrope i dag – de bruker systemfonten. Beholdes.
    siteFont:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Minel bruker konsernets personvernerklæring.
  privacyUrl: "https://minel.no/personvernerklaering",

  region: "Innlandet",

  trust: [
    ["Trygt fra start til slutt", "Rådgivning, installasjon og oppfølging"],
    ["Lokale folk. Lokal kunnskap.", "Innlandet"],
    ["Et solid elektrofirma", "Over 320 ansatte i Minel"],
  ],

  primaryGradient: {
    bg: "linear-gradient(90deg, #1C0E52 100%, #1C0E52 100%)",
    textColor: "black",
  },

  hero: {
    header: "SOLCELLER INNLANDET",
    background: "/minelsol/heroImage.png",
    p: "Kvalitet og trygghet – solceller til konkurransedyktig pris",
  },

  exploreBtn: {
    text: "Prøv vår solcellekalkulator",
  },

  // Seksjonen på forsiden som lenker til Solkartet.
  solkart: {
    text: "Skriv inn adressen din og oppdag solcelleløsningen som passer perfekt for deg. Utforsk i ditt eget tempo, og ta kontakt hvis du vil ha råd eller veiledning – helt uforpliktende.",
  },


  // Minels egen Om oss-tekst. Overstyrer fellesteksten i Sections.js.
  about: {
    header: "Minel Sol",

    title: "Solenergi fra folk du kan få tak i",

    image: "/minelsol/omOssHero.png",

    p1: "Når du velger oss, får du et solcelleanlegg tilpasset boligen din og folk i nærheten som følger opp. Vi tar ansvar for hele jobben – fra første samtale til anlegget er i drift.",

    p2: "Vi er en del av Minel, som leverer elektriske installasjoner til privat- og næringskunder i Oslo, Akershus, Østfold og Innlandet. Konsernet består av ni selskaper, fra Otta i nord til Drøbak i sør, og har rundt 320 ansatte og en årlig omsetning på cirka 550 millioner kroner. For deg betyr det at vi har et stort fagmiljø i ryggen, samtidig som du får personlig oppfølging fra folk i ditt område.",

    p3: "Vi tror på å anbefale det som passer deg, ikke en standardpakke som skal passe alle. Derfor ser vi på taket, strømforbruket og hva du ønsker å få ut av anlegget før vi foreslår en løsning. Vi velger produkter vi har tro på, og er åpne om hva du betaler for.",

    image2: "/minelsol/omOssBilde.png",

    p4: "Du skal vite hvem du kan kontakte, også etter at anlegget er montert. Målet vårt er enkelt: et solid anlegg, en fornuftig pris og en installasjon du kan være trygg på i mange år.",
  },

  // Overskrift, innledning og de tre punktene er fellestekst
  // (src/components/design/Sections.js). Her settes bare bildene.
  advantage: {
    heroImage: "/minelsol/fordelBilde.png",
    image: "/minelsol/bilBilde.png",
  },

  solar: {
    header: "SOLCELLER INNLANDET",
    header2: "Solcelleløsninger for alle typer bygg",
    header3:
      "Fra eneboliger og borettslag til næringsbygg og landbruk – vi skreddersyr solcelleanlegg som passer din eiendom og ditt energibehov.",
  },

  footer: {
    phone: "+47 458 71 718",
    email: "asbjorn.roed@minel.no",
    organizationNumber: "980349683",
    address: "Kirkevegen 74, 2413 Elverum",
  },

  consentifyPublicToken: "07d21dd0-7c47-4dc9-9c7b-5f0818a790fd",
};

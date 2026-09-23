/**
 * Temafarger per nettsted.
 *
 * Standardverdiene ligger i :root i src/styles/design.css og gjelder alle
 * nettstedene. Her oversettes en valgfri `theme`-blokk i site-configen til
 * de samme CSS-variablene, slik at ett nettsted kan avvike uten at de andre
 * berøres.
 *
 * Eksempel i src/config/minelsol.js:
 *
 *   theme: { brand: "#E00034", brandInk: "#ffffff", headerSurface: "#ffffff" }
 *
 * Legg til en ny farge: gi den et navn her, og bruk var(--navnet) i CSS-en.
 */

const TOKENS = {
  ink: "--ink",
  inkDeep: "--ink-deep",
  inkDeepHover: "--ink-deep-hover",
  surfaceTopbar: "--surface-topbar",
  surfacePanel: "--surface-panel",
  surfacePanel2: "--surface-panel-2",
  surfaceDeepStrong: "--surface-deep-strong",
  localSurface: "--local-surface",
  localCopy: "--local-copy",
  heroRgb: "--hero-rgb",

  brand: "--brand",
  brandInk: "--brand-ink",
  brandHover: "--brand-hover",
  brandStrong: "--brand-strong",
  brandBright: "--brand-bright",
  brandBrightSoft: "--brand-bright-soft",
  brandBrightBorder: "--brand-bright-border",
  brandAccent: "--brand-accent",
  brandSoft: "--brand-soft",
  brandSoftStrong: "--brand-soft-strong",
  brandSelected: "--brand-selected",
  brandSelectedBorder: "--brand-selected-border",
  brandSelection: "--brand-selection",
  brandOnDark: "--brand-on-dark",
  brandOnDarkBorder: "--brand-on-dark-border",
  brandMuted: "--brand-muted",
  brandWarmInk: "--brand-warm-ink",
  brandWarmLine: "--brand-warm-line",
  brandWarmBorder: "--brand-warm-border",
  brandWarmBorderSoft: "--brand-warm-border-soft",
  sunSurface: "--sun-surface",

  headerSurface: "--header-surface",
  headerInk: "--header-ink",
  headerBorder: "--header-border",
  headerLink: "--header-link",
  headerLinkHover: "--header-link-hover",
  topbarInk: "--topbar-ink",
  topbarBorder: "--topbar-border",

  ctaSurface: "--cta-surface",
  ctaInk: "--cta-ink",
  ctaMuted: "--cta-muted",
  ctaAccent: "--cta-accent",

  chartAlt: "--chart-alt",

  // Skrift for hele nettstedet.
  siteFont: "--site-font",
};

/** Lager CSS-en som overstyrer designets standardfarger for ett nettsted. */
export function themeCss(theme) {
  if (!theme) return "";
  const rows = Object.entries(theme)
    .filter(([key, value]) => TOKENS[key] && typeof value === "string" && value)
    .map(([key, value]) => `${TOKENS[key]}:${value}`);
  // :root:root gir høyere spesifisitet enn standardfargene i design.css,
  // slik at overstyringen vinner uansett hvor stilarket havner i <head>.
  return rows.length ? `:root:root{${rows.join(";")}}` : "";
}

# Designmalen – hvor du endrer hva

Alle nettstedene deler én designmal. Felles utseende ligger ett sted, lokalt
innhold ligger i hver site-config. Multitenant-oppsettet er uendret:
`src/proxy.js` mapper domene → site, og `src/app/[site]/solkart/layout.js`
holder registeret over hvilke configer som finnes.

## Fellestekst vs. lokalt innhold

Dette er regelen etter gjennomgangen 24.09.2026:

**Fellestekst har ett hjem – standardverdien i komponenten.** Når Asbjørn
oppdaterer en tekst som skal gjelde alle nettstedene, endres standardverdien,
ikke `smartelektro.js`. Da følger alle åtte automatisk.

| Fellestekst | Hvor den ligger |
| --- | --- |
| Hero-overskrift, ingress og overtekst | `src/app/[site]/page.js` |
| Løsningsseksjonens overskrift og ingress (`header2`/`header3`) | `Sections.js` |
| De tre punktene om lokal installatør | `Sections.js` (`LocalSection`) |
| Overskrift og tekst i lokal-seksjonen | `Sections.js` |
| De fire stegene, FAQ, kontaktbånd, batteri, kalkulator | `Sections.js` / `Battery.js` / `Calculator.js` |

**Lokalt innhold ligger i site-configen:** logo, favicon, bilder, `region`,
`solar.header` (geografisk overtekst), `about.*` (firmapresentasjon),
`about.since`, `trust`, `footer.*`, `legal`, `theme`, `privacyUrl`,
sporingskoder. Et nettsted overstyrer fellestekst bare der det er avtalt –
i praksis Minel Sol.

## Vanlige endringer

| Ønsket endring | Fil |
| --- | --- |
| Logo, favicon, e-post, adresse, org.nr., område | `src/config/<nettsted>.js` |
| Hero: kicker, overskrift, ingress, bakgrunnsbilde/video | `src/config/<nettsted>.js` → `hero` |
| Tekstene i «Fordelen med en lokal installatør» | `src/config/<nettsted>.js` → `infoCard` |
| Om oss-tekst og bilder | `src/config/<nettsted>.js` → `about` |
| Overskrifter over løsningene | `src/config/<nettsted>.js` → `solar` |
| Teksten i Solkart-seksjonen på forsiden | `src/config/<nettsted>.js` → `solkart` |
| Tre punkter i stripen under hero | `src/config/<nettsted>.js` → `trust` |
| Egne FAQ-spørsmål for én nettside | `src/config/<nettsted>.js` → `faqs: [[spørsmål, svar], …]` |
| Felles FAQ for alle | `DEFAULT_FAQS` i `src/components/design/Sections.js` |
| Farger for én nettside | `src/config/<nettsted>.js` → `theme` (nøkler i `src/config/design/theme.js`) |
| Farger for alle | `:root` øverst i `src/styles/design.css` |
| Legge til / flytte / fjerne en seksjon på forsiden | `src/app/[site]/page.js` |
| Innhold på målgruppesidene (nb/nn) | `src/config/slides.json` |
| Ny knapp | bruk `<OfferButton>` (åpner tilbudsskjemaet) eller `<Link className="btn btn-solar">` |

## Filer

```
src/styles/design.css              Hele designet. Farger som CSS-variabler øverst.
src/config/design/theme.js         Oversetter "theme" i site-configen til CSS-variabler.
src/components/design/
  Shell.js                         Toppfelt, meny, footer, tilbudsdialog (lead + EmailJS).
  Sections.js                      Tillitsstripe, løsninger, lokal, prosess, om oss, FAQ, kontaktbånd.
  Calculator.js                    Regneeksempel (illustrasjon – ikke Solkartet).
  Battery.js                       Batteriseksjonen fra designet.
  primitives.js                    Trekkspill, faner, slider, modal, mobilmeny, radiogruppe.
  icons.js                         Ikoner (Lucide, bygget inn lokalt).
src/app/[site]/
  layout.js                        Rammen, tema, favicon, Consentify, GTM.
  page.js                          Forsiden.
  omoss/ batteri/ kontakt/         Undersider på designmalen.
  solceller/[slug]/                Målgruppesider, innhold fra slides.json.
  solkart/                         Uendret – iframe mot pvmap.
public/design/                     Manrope-fonter + bilder fra designoverleveringen.
```

## Bevart funksjonalitet

- Tilbudsskjemaet sender fortsatt til `/api/leads/create` (Supabase) og EmailJS,
  med samme feltnavn, samtykke, sporingsparametre og videresending til `/takk`.
- `user_equipment` bruker de samme verdiene som før: «Solcelleanlegg»,
  «Solcelleanlegg + Batteri», «Batteri».
- Consentify-skriptet og knappen `#revoke-consent-btn` ligger i footeren.
- Google Tag Manager lastes for de nettstedene som har `googleTagManager` i configen.
- Solkart-seksjonen på forsiden (`#pvmap`) er beholdt og lenker til `/solkart`
  (pvmap-iframen), i tillegg til knapp i hero, meny og footer. Regneeksempelet
  erstatter ikke Solkartet og er tydelig merket som eksempel.
- Blogg, estimat, takk, personvern og kjøpsbetingelser er ikke rørt.

## Endringsrunde 1 (Asbjørn, 16.09.2026)

Alle ni punktene er gjennomført. Det som kan slå ut på de andre nettstedene:

- **Minste skriftstørrelse er økt ett hakk i hele designet** (12px → 13px,
  13px → 14px i `src/styles/design.css`). Gjelder alle nettstedene.
- **Solkart-seksjonen bruker nå originalbildet** `/design/solkart-bg.png`
  (solceller i solnedgang, hentet fra `public/vestelektro/background.png`) som
  standard for alle nettstedene. Overstyres med `solkart.background` per nettsted.
- **Regneeksempelet** har nye standardverdier og fast produksjonsfaktor for alle.
- **Sekundærknappen til Solkartet** på målgruppesidene gjelder alle nettstedene.

Tekstendringene (hero, overskrifter, de tre punktene) ligger i
`src/config/smartelektro.js` og berører bare Smart Elektro Sol.

## Endringsrunde 2 (Asbjørn, 17.09.2026)

Alle ti punktene er gjennomført. Nytt i denne runden:

- `public/battery-story/` – batterianimasjonen fra Asbjørns pakke, kjørt som
  web-komponent (Shadow DOM, ingen npm-pakker). Lastes av
  `src/components/design/SmartBattery.js`.
- `src/components/design/EnergyDivider.js` + `.module.css` – de to glødende
  linjene rundt Solkart-seksjonen.
- Batteriseksjonen bruker nå `compact` + `externalControls`: venstre kolonne er
  vår egen, fanene styrer animasjonen, og animasjonen melder tilbake når den
  bytter kapittel selv.

To avvik fra bestillingen, begge bevisste:

- **Ingen synlig pauseknapp for energilinjene.** Bestillingen åpnet for
  «sidens eksisterende bevegelsesinnstilling» i stedet; linjene stopper på
  `prefers-reduced-motion`. `paused`-propen er beholdt om knappen ønskes senere.
- **`smart-battery.css` er endret på to punkter:** merket «Nettet frakoblet» er
  flyttet ned i diagrammet (overlappingen Asbjørn meldte om), og den minste
  skriften er økt ett hakk, i tråd med runde 1 punkt 4.

Alle tekstendringene i denne runden ligger i fellesmalen og gjelder derfor alle
nettstedene: de fire stegene, FAQ-innledningen, kontaktoverskriften,
batterioverskriften og e-postlenken (som hentes per nettsted fra `footer.email`).

## Endringsrunde 3 (Asbjørn, 22.09.2026)

Alle seks punktene er gjennomført.

- **Ikoner i tilbudsskjemaet** – `public/skjema-ikoner/`, koblet på i
  `INTEREST_OPTIONS` i `Shell.js`. Verdiene som sendes inn (`user_equipment`)
  er uendret.
- **Firmaopplysninger** – `region` er satt for alle nettstedene, hentet fra
  firmaets egen hero-tekst. Tillitsstripens tredje punkt bruker `config.legal`
  i stedet for en fast tekst. Årstallsboksen vises kun når `about.since` er satt.
- **Solkart-knappen i hero** – `.btn btn-outline-light`, samme form som knappen
  på målgruppesidene, tilpasset mørk bakgrunn.
- **Bloggoversikten** – nytt kortoppsett i `blog/page.js`. Artikkelsiden er
  også flyttet over på malen, og `blog.css` er scopet til `.blogContent`
  (de globale `h1`/`p`-reglene der påvirket hele nettsiden).
- **Profil per nettsted** – hvert firma har nå en `theme`-blokk der de mørke
  flatene harmonerer med logoen (blå for Alfa, grønn for Lyn, varm grønn for
  Gardermoen, marine for Mydlands, grafitt for Telerør, indigo for Minel).
  Oransje er beholdt som merkefarge for solenergi på alle unntatt Minel.
- **Minel Sol** – beholder systemfonten de bruker i dag, via det nye
  `--site-font`-tokenet (`theme.siteFont`), og bruker sin egen setning i
  seksjonen om lokal installatør.
- **Takkesiden** – nytt lyst kort på varm bakgrunn. Siden registrerer
  ingenting selv; leadet er allerede lagret av skjemaet som sendte hit.

### Firmaopplysninger som mangler

Disse er ikke funnet på, og må fylles inn per firma:

1. **Telefonnummer.** Alle sju configene har nå `footer.phone` satt til det
   felles nummeret `+47 458 71 718`, merket med TODO. Bytt til firmaets eget.
2. **Firmapresentasjon og historikk.** Seks av sju har identisk, generell
   `about`-tekst; bare Smart Elektro har sin egen. Skriv `about.p1`–`p4` per firma.
3. **Tillitsstripen (`trust`).** Bare Smart Elektro og Minel har egne punkter
   (antall ansatte, hva firmaet er). De andre bruker generelle punkter.
4. **Årstall (`about.since`).** Bare Smart Elektro har 2017. Boksen er skjult
   for de andre – ingen reserveverdi er satt.

## Gjenstår

- Telefonnummer er fortsatt felles (`+47 458 71 718`). Sett `footer.phone` og
  `footer.phoneHref` per nettsted når riktige numre er avklart.
- De seks nettstedene uten egen `theme`-blokk bruker designets standardfarger.
- Blogg, estimat og takk har fortsatt gammel styling inni sidene.
- Målgruppesidene mangler «Dette er fint å ha klart»-listen fra designet;
  den må skrives på nb (og nn der det er aktuelt) før den kan slås på.

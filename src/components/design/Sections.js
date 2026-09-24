"use client";

/**
 * Seksjonene i designmalen. Alle leser lokalt innhold fra site-configen
 * (src/config/<nettsted>.js) med designets tekst som standard, slik at et
 * nettsted uten egen tekst fortsatt får en komplett side.
 *
 * Vil du endre en tekst for ÉN nettside: sett feltet i den site-configen.
 * Vil du endre den for alle: endre standardverdien her.
 */

import Link from "next/link";
import { useSiteConfig } from "../../contexts/siteConfigContext";
import { OfferButton, solutionLinks } from "./Shell";
import { Accordion } from "./primitives";
import EnergyDivider from "./EnergyDivider";
import {
  ArrowUpRight,
  BadgeCheck,
  Handshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
} from "./icons";

const DEFAULT_PHONE = "+47 458 71 718";

/* ------------------------------------------------------------------ */
/* Tillitsstripe rett under hero                                        */
/* ------------------------------------------------------------------ */

export function TrustStrip() {
  const config = useSiteConfig() || {};
  // Standardpunktene er generelle. Firmaspesifikke opplysninger (antall
  // ansatte, historikk) settes med `trust` i den enkelte site-configen –
  // de skal aldri arves fra et annet firma.
  const items = config.trust || [
    ["Trygt fra start til slutt", "Rådgivning, installasjon og oppfølging"],
    ["Lokale folk. Lokal kunnskap.", config.region || "Vi kjenner området ditt"],
    ["Et solid elektrofirma", config.legal || "Flere ben å stå på enn solceller alene"],
  ];
  const icons = [ShieldCheck, MapPin, Wrench];

  return (
    <div className="trust-strip">
      <div className="wrap trust-grid">
        {items.map(([title, text], i) => {
          const Icon = icons[i] || ShieldCheck;
          return (
            <div key={title}>
              <Icon />
              <span>
                <strong>{title}</strong>
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Løsninger – henter slug, tittel, tekst og bilde fra slides.json      */
/* ------------------------------------------------------------------ */

export function SolutionsSection({ site, language = "nb" }) {
  const config = useSiteConfig() || {};
  const solutions = solutionLinks(site, language);

  return (
    <section className="section solutions-section" id="losninger">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{config.solar?.header || "LA OSS SE PÅ MULIGHETENE HOS DEG"}</span>
            <h2>{config.solar?.header2 || "Hva kan solenergi gi deg?"}</h2>
          </div>
          <p>
            {config.solar?.header3 ||
              "Kanskje du bare er nysgjerrig. Kanskje du har tenkt på solceller en stund. Her kan du lese om mulighetene for hjemmet, gården eller bygget ditt, i ditt eget tempo."}
          </p>
        </div>

        <div className="solution-grid">
          {solutions.map((solution, i) => (
            <Link className="solution-card" key={solution.slug} href={`/solceller/${solution.slug}`}>
              <div className="solution-image">
                <img
                  src={solution.image}
                  alt={`Solceller for ${solution.name.toLowerCase()}`}
                  loading="lazy"
                />
                <span className="solution-index">0{i + 1}</span>
                <span className="round-arrow">
                  <ArrowUpRight size={22} />
                </span>
              </div>
              <h3>{solution.name}</h3>
              <p>{solution.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Solkartet – lenker til vår egen løsning (/solkart, pvmap)            */
/* ------------------------------------------------------------------ */

export function SolkartSection() {
  const config = useSiteConfig() || {};
  // Originalbildet fra den gamle nettsiden (solceller i solnedgang).
  // Kan overstyres per nettsted med solkart.background i site-configen.
  const background = config.solkart?.background || "/design/solkart-bg.png";

  return (
    <section className="solkart-section" id="pvmap">
      {/* Bildet klippes i en egen innpakning, slik at gløden fra
          energilinjene får ligge utenfor seksjonsgrensen. */}
      <div className="solkart-media">
        {background && <img className="solkart-photo" src={background} alt="" loading="lazy" />}
        <div className="solkart-shade" />
      </div>
      <EnergyDivider position="top" />
      <div className="wrap solkart-inner">
        <span className="eyebrow">
          <MapPin size={17} />
          {config.solkart?.eyebrow || "SE DITT EGET TAK"}
        </span>
        <h2>{config.solkart?.title || "Er solceller en god investering for deg?"}</h2>
        <p>
          {config.solkart?.text ||
            "Skriv inn adressen din og se hvilken løsning som passer deg best. Utforsk i ditt eget tempo, og om du lurer på noe, er vi bare en melding unna."}
        </p>
        <Link className="btn btn-solar" href="/solkart">
          {config.exploreBtn?.text || "Prøv vår solcellekalkulator"}
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <EnergyDivider position="bottom" reverse />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fordelen med en lokal installatør – bruker config.infoCard           */
/* ------------------------------------------------------------------ */

export function LocalSection() {
  const config = useSiteConfig() || {};

  const promises = [
    {
      icon: MessageCircle,
      label: "DIN LOKALE INSTALLATØR",
      title: config.infoCard?.titleOne || "Direkte kontakt med oss som gjør jobben",
      text:
        config.infoCard?.one ||
        "Hos oss har du direkte kontakt med en lokal elektrobedrift som både planlegger og installerer anlegget. Vi ser solceller, batteri og det elektriske anlegget i sammenheng, og forklarer hvilke løsninger vi anbefaler og hvorfor. Det gir deg én leverandør å forholde deg til gjennom hele prosjektet.",
    },
    {
      icon: Handshake,
      label: "PRIS OG KVALITET",
      title: config.infoCard?.titleTwo || "Gode produkter til en god pris",
      text:
        config.infoCard?.two ||
        "Vi er ikke bundet til ett bestemt merke og sammenligner produkter og priser fra flere leverandører. Det gir oss mulighet til å finne gode produkter til en bedre pris, tilpasset behovene dine. Vi følger utviklingen innen solceller, batterier, festesystemer og styring, og holder oss oppdatert på støtteordninger du kan ha nytte av. Slik kan vi anbefale et gjennomtenkt anlegg som gir deg mye for pengene.",
    },
    {
      icon: ShieldCheck,
      label: "OPPFØLGING ETTERPÅ",
      title: config.infoCard?.titleThree || "Lokale fagfolk og rask responstid",
      text:
        config.infoCard?.three ||
        "Vi følger opp anlegget også etter at det er satt i drift. Som elektrobedrift er vi vant til både service og hasteoppdrag, og har fagfolk i nærheten dersom noe må undersøkes eller utbedres. Du vet hvem du skal kontakte, enten du har et spørsmål, trenger hjelp eller vil bygge ut anlegget senere.",
    },
  ];

  const photo = config.advantage?.heroImage || config.about?.image;

  return (
    <section className="local-section" aria-labelledby="local-heading">
      <div className="wrap local-layout">
        <div className="local-story">
          <span className="eyebrow">{config.advantage?.header || "FORDELEN MED EN LOKAL INSTALLATØR"}</span>
          <h2 id="local-heading">
            {config.advantage?.title || "Nær deg, også etter montering."}
          </h2>
          <p>
            {config.advantage?.text ||
              "Hos oss får du snakke med folkene som gjør jobben. Vi kjenner området, tar oss tid til spørsmålene dine og følger deg opp når anlegget er på plass."}
          </p>
          {photo && (
            <figure className="local-photo">
              <img src={photo} alt="Montører i arbeid med et solcelleanlegg" loading="lazy" />
              <figcaption>
                <MapPin size={17} />
                <span>
                  {config.region || "Ditt nærområde"}.<br />
                  <strong>Det er her vi jobber.</strong>
                </span>
              </figcaption>
            </figure>
          )}
        </div>

        <div className="local-promises">
          {promises.map((promise) => {
            const Icon = promise.icon;
            return (
              <article key={promise.label}>
                <span className="local-icon">
                  <Icon size={25} />
                </span>
                <div>
                  <span className="local-label">{promise.label}</span>
                  <h3>{promise.title}</h3>
                  <p>{promise.text}</p>
                </div>
              </article>
            );
          })}
          <div className="local-signoff">
            <p>Et godt samarbeid begynner med at du kjenner deg trygg.</p>
            <Link className="text-link" href="/omoss">
              {config.advantage?.readMore || "Bli litt bedre kjent med oss"}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Prosessen                                                            */
/* ------------------------------------------------------------------ */

export function ProcessSection() {
  const config = useSiteConfig() || {};
  const steps = config.process?.steps || [
    [
      "Vi starter med en prat",
      "På telefon eller e-post snakker vi om hva du ønsker og lurer på. Vi svarer på spørsmål og ser på hvilke løsninger som kan passe for deg.",
    ],
    [
      "Du får et tilbud, vi avklarer forholdene",
      "Du får et tilbud med pris og oversikt over hva som er inkludert. Ønsker du å gå videre, undersøker vi taket og det elektriske anlegget for å avklare om installasjonen kan gjennomføres, og om noe må tilpasses.",
    ],
    [
      "Vi tar jobben fra start til ferdig anlegg",
      "Når alt er avklart, avtaler vi et tidspunkt for installasjon som passer deg. Vi tar oss av hele jobben – fra montering og elektrisk tilkobling til testing, dokumentasjon og oppstart.",
    ],
    [
      "Vi viser deg hvordan, og følger opp",
      "Vi viser deg hvordan anlegget fungerer og hvordan du følger med på det. Målet er at alt skal fungere som det skal fra første dag. Vi står ansvarlig for jobben vi har gjort, og er bare en telefon unna hvis noe skjer, du har spørsmål eller ønsker å utvide.",
    ],
  ];

  return (
    <section className="section process-section" id="prosessen">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{config.process?.eyebrow || "NÅR DU ER KLAR FOR NESTE STEG"}</span>
            <h2>{config.process?.title || "Vi tar det ett steg av gangen."}</h2>
          </div>
          <p>
            {config.process?.lead ||
              "Du trenger ikke kunne alt om solceller. Vi hjelper deg å forstå valgene underveis, så du vet hva du sier ja til."}
          </p>
        </div>
        <div className="process-grid">
          {steps.map(([title, text], i) => (
            <article key={title}>
              <div className="process-number">
                <span>0{i + 1}</span>
                <div />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Om oss – bruker config.about slik den er i dag                       */
/* ------------------------------------------------------------------ */

export function AboutSection({ full = false }) {
  const config = useSiteConfig() || {};
  const about = config.about || {};
  const paragraphs = [about.p1, about.p2, about.p3, about.p4, about.p5].filter(Boolean);
  const Heading = full ? "h1" : "h2";

  return (
    <section className={`section about-section ${full ? "about-full" : ""}`} id="om-oss">
      <div className="wrap about-grid">
        <div className="about-photo">
          <img
            src={about.image || config.advantage?.image}
            alt={`${config.title || "Vi"} i arbeid`}
            loading="lazy"
          />
          <div className="photo-caption">
            <MapPin size={16} />
            <span>Lokale fagfolk. Solid håndverk.</span>
          </div>
          {about.since && (
            <div className="experience-stamp">
              <span>
                Solenergi
                <br />
                siden
              </span>
              <strong>{about.since}</strong>
            </div>
          )}
        </div>

        <div className="about-copy">
          <span className="eyebrow">BLI KJENT MED {(about.header || config.title || "OSS").toUpperCase()}</span>
          <Heading>{about.title || "Folk i nærheten. Fagfolk du kan stole på."}</Heading>
          {about.subHeader && <p className="section-lead">{about.subHeader}</p>}
          {(full ? paragraphs : paragraphs.slice(0, 2)).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {full ? (
            <OfferButton>Ta en prat med oss</OfferButton>
          ) : (
            <Link className="text-link" href="/omoss">
              Mer om oss og hvordan vi jobber
              <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
      </div>

      {full && about.image2 && (
        <div className="wrap" style={{ marginTop: 48 }}>
          <img
            src={about.image2}
            alt=""
            style={{ width: "100%", borderRadius: 6, objectFit: "cover", aspectRatio: "16 / 7" }}
            loading="lazy"
          />
        </div>
      )}

      {full && (
        <div className="wrap about-values">
          <div>
            <ShieldCheck />
            <h3>Råd du forstår</h3>
            <p>Du skal vite hvorfor vi anbefaler et bestemt oppsett, og hvilke fordeler og begrensninger det har.</p>
          </div>
          <div>
            <MessageCircle />
            <h3>Plass til spørsmål</h3>
            <p>Du får snakke med fagfolk som kjenner prosjektet ditt. Vi tar oss tid til både de store spørsmålene og de små detaljene.</p>
          </div>
          <div>
            <BadgeCheck />
            <h3>Vi ser hele boligen</h3>
            <p>Som elektrofirma ser vi solcellene i sammenheng med sikringsskapet, ladingen og resten av strømforbruket ditt.</p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ofte stilte spørsmål                                                 */
/* ------------------------------------------------------------------ */

export const DEFAULT_FAQS = [
  [
    "Passer taket mitt til solceller?",
    "Det finner vi ut sammen. Vi ser på hvor mye sol taket får, skygge fra trær og nabobygg, og hvor panelene kan ligge. Takets tilstand og bæreevne må også sjekkes. Du får forklart hva som taler for et anlegg hos deg, og hva som eventuelt begrenser det.",
  ],
  [
    "Når kan det være bedre å vente?",
    "Hvis taket snart må skiftes, er det ofte fornuftig å ta takarbeidet først. Mye skygge eller lite egnet takflate kan også gjøre et anlegg mindre aktuelt. Vi ser på forventet produksjon, strømforbruk og kostnad før vi anbefaler en investering. Det skal være rom for at svaret blir å vente.",
  ],
  [
    "Hva slags solceller bruker dere?",
    "Solcellemarkedet er i kontinuerlig utvikling – akkurat som med smarttelefoner, kommer det stadig nye og bedre modeller. Derfor jobber vi hele tiden for å finne de mest effektive panelene på markedet, slik at du får den beste løsningen. Kontakt oss gjerne for et uforpliktende tilbud på dagens mest gunstige solcellepaneler.",
  ],
  [
    "Følger det med noen garanti?",
    "Vi står ansvarlig for ditt solcelleanlegg og vil være her for deg i lang tid fremover. Selv om solcellemarkedet kan svinge, er vi et elektrofirma med flere ben å stå på. Flere av panelene våre leveres med 30 års produktgaranti og 30 års effektgaranti – alltid inkludert i prisen, uten ekstra kostnad.",
  ],
  [
    "Må solceller vedlikeholdes?",
    "Moderne solceller har en overflatebehandling som gjør dem hydrofobe (avstøter vann) og mindre mottakelige for smuss. Når det regner, vil vannet perle seg og ta med seg støv og skitt ned fra panelene. Denne effekten regnes ofte som selvrensende, men den er ikke 100 % effektiv – særlig i områder med mye støv, pollen eller fugleskitt. I slike tilfeller kan det være lurt å vurdere en forsiktig rengjøring et par ganger i året.",
  ],
  [
    "Snø på solcellepanelene?",
    "Vi er lite bekymret for snø på solcellepanelene. Kjølige temperaturer gir gode produksjonsforhold, og i tillegg kan snøen rundt panelene bidra til økt refleksjon av sollyset. Dersom panelene dekkes av snø, vil produksjonen kunne reduseres noe, men fordi overflatene er glatte, sklir snøen ofte raskt av. Hvis snøen skulle bli liggende en stund, anbefaler vi likevel å la den ligge – det kan være farlig å bevege seg på taket uten riktig sikring.",
  ],
  [
    "Hvor egner det seg med solceller?",
    "Sørvendte takflater gir vanligvis den høyeste årlige strømproduksjonen, med toppytelse midt på dagen. Øst- og vestvendte tak gir mer strømproduksjon om morgenen og ettermiddagen, noe som gir en jevnere fordeling gjennom dagen. Selv om den totale årsproduksjonen kan være noe lavere, kan det være en fordel dersom du har størst forbruk tidlig eller sent på dagen. Dette gjelder uansett taktype.",
  ],
  [
    "Har jeg strøm når strømmen går?",
    "Et vanlig solcelleanlegg kobler ut ved strømbrudd, selv om sola skinner. Ønsker du nødstrøm, trenger du utstyr og en installasjon som er laget for det. Vi hjelper deg å vurdere batteri, inverter og hvilke deler av huset du vil holde i gang.",
  ],
  [
    "Solceller med batterilagring",
    "Ja, solceller kan fint kombineres med et batterilagringssystem. Da kan du lagre overskuddsstrøm når anlegget produserer mer enn du bruker, og bruke den på kvelden, i perioder med lite sol eller når strømprisene er høyere. Det finnes ulike batteriteknologier, og det er lurt å vurdere pris, kapasitet, levetid og garantivilkår når du velger løsning.",
  ],
];

function configFaqs(config) {
  const faq = config.faq;
  if (!faq) return null;
  const list = [];
  for (let i = 1; i <= 10; i += 1) {
    if (faq[`title${i}`] && faq[`description${i}`]) list.push([faq[`title${i}`], faq[`description${i}`]]);
  }
  return list.length ? list : null;
}

export function FAQSection() {
  const config = useSiteConfig() || {};
  const faqs = config.faqs || configFaqs(config) || DEFAULT_FAQS;
  const phone = config.footer?.phone || DEFAULT_PHONE;
  const phoneHref = config.footer?.phoneHref || phone.replace(/\s/g, "");
  const email = config.footer?.email;

  return (
    <section className="section faq-section faq-warm" id="sporsmal">
      <div className="wrap faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">DETTE LURER MANGE PÅ</span>
          <h2>{config.faq?.header || "Gode spørsmål. Ærlige svar."}</h2>
          <p>
            På taket, veggen, bakken eller campingvogna – solceller kan finne seg til rette
            mange steder. Her svarer vi på det mange lurer på.
          </p>
          <div className="faq-contact">
            <span className="faq-contact-icon">
              <MessageCircle size={24} />
            </span>
            <div>
              <strong>Vil du heller spørre oss?</strong>
              <p>Det er bare hyggelig.</p>
              {/* E-post og telefon hentes fra samme kontaktdata som footeren. */}
              {email && (
                <a className="text-link faq-contact-mail" href={`mailto:${email}`}>
                  <Mail size={16} />
                  {email}
                </a>
              )}
              <a className="text-link" href={`tel:${phoneHref}`}>
                <Phone size={16} />
                {phone}
              </a>
            </div>
          </div>
        </div>

        <Accordion
          className="faq-list"
          items={faqs.map(([question, answer], i) => ({
            key: question,
            trigger: (
              <span className="faq-question">
                <span className="faq-number" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{question}</span>
              </span>
            ),
            content: answer,
          }))}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Kontaktbånd nederst på sidene                                        */
/* ------------------------------------------------------------------ */

export function ContactSection() {
  const config = useSiteConfig() || {};
  const phone = config.footer?.phone || DEFAULT_PHONE;
  const phoneHref = config.footer?.phoneHref || phone.replace(/\s/g, "");

  return (
    <section className="contact-section" id="kontakt">
      <div className="wrap contact-cta">
        <div>
          <span className="eyebrow">
            <MessageCircle size={18} />
            VI ER BARE EN PRAT UNNA
          </span>
          <h2>Nysgjerrig på hva som er mulig hos deg?</h2>
          <p>
            Du trenger ikke ha en ferdig plan.
            <br />
            Fortell litt om det du tenker på, så hjelper vi deg videre.
          </p>
        </div>
        <div className="contact-cta-actions">
          <OfferButton className="btn btn-dark">Ta en uforpliktende prat</OfferButton>
          <a className="cta-call" href={`tel:${phoneHref}`}>
            <Phone size={16} />
            Ring oss på {phone}
          </a>
        </div>
      </div>
    </section>
  );
}

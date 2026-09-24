"use client";

/**
 * Forsiden – designmalen.
 *
 * Seksjonene i rekkefølge: hero, tillitsstripe, løsninger, lokal installatør,
 * regneeksempel, batteri, prosessen, om oss, kunnskap, FAQ og kontaktbånd.
 * Vil du fjerne eller flytte en seksjon, gjør det her.
 */

import { use } from "react";
import Link from "next/link";

import { useSiteConfig } from "../../contexts/siteConfigContext";
import { OfferButton, solutionLinks } from "../../components/design/Shell";
import { Calculator } from "../../components/design/Calculator";
import { BatterySection } from "../../components/design/Battery";
import {
  AboutSection,
  ContactSection,
  FAQSection,
  LocalSection,
  ProcessSection,
  SolkartSection,
  SolutionsSection,
  TrustStrip,
} from "../../components/design/Sections";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Check,
  MapPin,
  MessageCircle,
  Sun,
} from "../../components/design/icons";

export default function Page({ params }) {
  const { site } = use(params);
  const config = useSiteConfig() || {};
  const language = config.language || "nb";

  // Fellestekst for alle nettstedene, fra den godkjente Smart Elektro-siden.
  // Et nettsted overstyrer bare der vi har avtalt noe eget (Minel Sol).
  const heroTitle = config.hero?.title || ["Solenergi.", "Gjort ordentlig."];
  const solkartText = config.exploreBtn?.text || "Se taket ditt i Solkartet";
  const solutions = solutionLinks(site, language);
  const learnImage = config.advantage?.image || solutions[0]?.image;

  return (
    <main id="main" className="ds">
      <section className="hero">
        {config.hero?.video ? (
          <video className="hero-photo" autoPlay muted loop playsInline poster={config.hero?.background}>
            <source src={config.hero.video} type="video/mp4" />
          </video>
        ) : (
          <img
            className="hero-photo"
            src={config.hero?.background}
            alt=""
            fetchPriority="high"
          />
        )}
        <div className="hero-shade" />

        <div className="wrap hero-inner">
          <div className="hero-content">
            <div className="hero-kicker">
              <span className="kicker-line" />
              {config.hero?.header || "DIN LOKALE SOLCELLEINSTALLATØR"}
            </div>
            <h1>
              {heroTitle[0]}
              <br />
              <span>{heroTitle[1]}</span>
            </h1>
            <p>
              {config.hero?.p ||
                "Et solcelleanlegg skal fungere i mange år. Som din lokale elektrobedrift tar vi hånd om hele jobben, fra rådgivning og planlegging til installasjon og oppfølging. Da vet du hvem du skal ringe, også etter at jobben er gjort."}
            </p>
            <div className="hero-actions">
              <OfferButton>{config.estimateBtn?.text || "Få et uforpliktende tilbud"}</OfferButton>
              {/* Knapp til vårt eksisterende Solkart (pvmap), ikke regneeksempelet under.
                  Samme knappeform som på målgruppesidene, i mørk variant. */}
              <Link className="btn btn-outline-light" href="/solkart">
                {solkartText}
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-reassurance">
              <span>
                <Check size={15} />
                Komplett levert og montert
              </span>
              <span>
                <Check size={15} />
                Lokal oppfølging
              </span>
            </div>
          </div>

          {config.region && (
            <div className="hero-location">
              <MapPin size={17} />
              <div>
                Skapt for norske forhold
                <span>{config.region}</span>
              </div>
            </div>
          )}
        </div>

        <div className="hero-bottom">
          <div className="wrap">
            <span>SOLCELLER · BATTERI · SMART ENERGI</span>
            <a href="#losninger">
              Se mulighetene
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <TrustStrip />
      <SolutionsSection site={site} language={language} />
      <LocalSection />
      <SolkartSection />
      <Calculator />
      <BatterySection />
      <ProcessSection />
      <AboutSection />

      <section className="section learn-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BLI KJENT MED SOLENERGI</span>
              <h2>Du trenger ikke bestemme deg. Begynn med å bli litt klokere.</h2>
            </div>
            <Link href="/blog" className="text-link">
              Flere råd og artikler
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="learn-grid">
            <a href="#kalkulator" className="learn-feature">
              <div className="learn-photo">
                <img src={learnImage} alt="Solcellepaneler på taket av en bolig" loading="lazy" />
                <span className="learn-photo-label">
                  <Sun size={18} />
                  SOLSTRØM I HVERDAGEN
                </span>
              </div>
              <div className="learn-feature-copy">
                <span className="eyebrow">TA UTGANGSPUNKT I HJEMMET DITT</span>
                <h3>Hva kan solceller bety for deg?</h3>
                <p>
                  Se hvor mye strøm et anlegg kan gi, hva du kan bruke selv og hva som selges
                  videre. Prøv deg frem og se hva som påvirker verdien.
                </p>
                <span className="learn-link">
                  Utforsk regneeksempelet
                  <ArrowUpRight size={21} />
                </span>
              </div>
            </a>

            <div className="learn-side">
              <Link href="/batteri" className="learn-tile learn-battery">
                <div className="learn-tile-top">
                  <span>BATTERI</span>
                  <BatteryCharging size={33} />
                </div>
                <h3>Ta vare på sola. Til du trenger strømmen.</h3>
                <p>
                  Et batteri kan lagre overskuddet til kvelden. Men trenger du det? Les om
                  egenbruk, nødstrøm og hva som bør være på plass.
                </p>
                <span className="learn-link">
                  Bli kjent med batteri
                  <ArrowUpRight size={21} />
                </span>
              </Link>

              <a href="#prosessen" className="learn-tile learn-process">
                <div className="learn-tile-top">
                  <span>SLIK HJELPER VI DEG</span>
                  <MessageCircle size={29} />
                </div>
                <h3>Hva skjer hvis du vil gå videre?</h3>
                <p>
                  Fra de første spørsmålene til ferdig anlegg. Her ser du hva vi gjør, hva du tar
                  stilling til og hvordan vi følger deg opp.
                </p>
                <span className="learn-link">
                  Se veien videre
                  <ArrowUpRight size={21} />
                </span>
              </a>
            </div>
          </div>

          <div className="learn-note">
            <MessageCircle size={20} />
            <p>
              Det er helt greit å bare være nysgjerrig. Du trenger ikke være klar til å kjøpe for
              å spørre oss.
            </p>
          </div>
        </div>
      </section>

      <FAQSection />
      <ContactSection />
    </main>
  );
}

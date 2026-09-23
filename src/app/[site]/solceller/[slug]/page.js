/**
 * Målgruppeside for én solcelleløsning.
 *
 * Innholdet kommer fortsatt fra src/config/slides.json, med nb/nn-tekst og
 * bildeoverstyringen for MinelSol. Bare innrammingen er byttet til designmalen.
 */

import Link from "next/link";
import slides from "../../../../config/slides.json";
import { OfferButton } from "../../../../components/design/Shell";
import {
  ContactSection,
  FAQSection,
  ProcessSection,
} from "../../../../components/design/Sections";
import { ArrowLeft, ArrowRight } from "../../../../components/design/icons";

export default async function Solution({ params }) {
  const { slug, site } = await params;
  const language = site === "vestelektrosol" ? "nn" : "nb";

  const slide = slides.find((item) => item.slug === slug);
  if (!slide) {
    return (
      <main id="main" className="ds section">
        <div className="wrap not-found">
          <span className="eyebrow">404</span>
          <h1>Her var det litt skygge.</h1>
          <p>Denne løsningen finnes ikke. Du finner alle løsningene våre på forsiden.</p>
          <Link href="/" className="btn btn-solar">
            Til forsiden
          </Link>
        </div>
      </main>
    );
  }

  const content = slide[language] || slide.nb;
  const image =
    site === "minelsol" && slide.image === "/carousel/image3.png"
      ? "/carousel/minelBilde.png"
      : slide.image;

  const benefits = [1, 2, 3]
    .map((n) => [content?.[`advantageTitle${n}`], content?.[`advantageDescription${n}`]])
    .filter(([title, text]) => title && text);

  return (
    <main id="main" className="ds">
      <section className="detail-hero">
        <div className="wrap detail-hero-grid">
          <div>
            <Link className="breadcrumb" href="/#losninger">
              <ArrowLeft size={15} />
              Alle løsninger
            </Link>
            <span className="eyebrow">{(content?.displayTitle || slide.slug).toUpperCase()}</span>
            <h1>{content?.title}</h1>
            <p>{content?.description}</p>
            <div className="detail-actions">
              <OfferButton
                note={`Jeg er interessert i solceller til ${(content?.displayTitle || slide.slug).toLowerCase()}.`}
              />
              {/* Sekundærknapp til vårt eksisterende Solkart på samme nettsted. */}
              <Link className="btn btn-outline" href="/solkart">
                Se taket ditt i Solkartet
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          {image && <img src={image} alt={`Solceller for ${content?.displayTitle || slide.slug}`} />}
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="detail-benefits">
              {benefits.map(([title, text], i) => (
                <article key={title}>
                  <span>0{i + 1}</span>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProcessSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}

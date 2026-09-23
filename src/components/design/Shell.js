"use client";

/**
 * Rammen rundt alle sidene: toppfelt, navigasjon, mobilmeny, footer og
 * tilbudsdialogen.
 *
 * Alt lokalt innhold (logo, tekst, e-post, adresse, org.nr.) leses fra
 * site-configen i src/config/<nettsted>.js – akkurat som før.
 * Selve innsendingen går fortsatt til /api/leads/create + EmailJS og
 * videre til /takk, som i FormModal.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import { useSiteConfig } from "../../contexts/siteConfigContext";
import { getLocalStorage } from "../../../utils/localstorage";
import slides from "../../config/slides.json";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Menu,
  Phone,
  Sun,
  X,
} from "./icons";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  RadioGroup,
  Sheet,
  SheetDescription,
  SheetTitle,
} from "./primitives";

const DEFAULT_PHONE = "+47 458 71 718";

/**
 * Valgene under «Jeg er interessert i». Verdiene sendes videre som
 * user_equipment og må ikke endres – de brukes i leads-notatet.
 * Ikonene er de samme som i Solkartet (public/skjema-ikoner/).
 */
const INTEREST_OPTIONS = [
  { value: "Solcelleanlegg", icon: "/skjema-ikoner/solcelleanlegg.svg" },
  { value: "Solcelleanlegg + Batteri", icon: "/skjema-ikoner/solceller-batteri.svg" },
  { value: "Batteri", icon: "/skjema-ikoner/batteri.svg" },
];

const ContactContext = createContext(() => {});
export const useContact = () => useContext(ContactContext);

/** Knapp som åpner tilbudsdialogen. Bruk denne overalt et tilbud skal bes om. */
export function OfferButton({
  children = "Få et uforpliktende tilbud",
  className = "btn btn-solar",
  equipment = "Solcelleanlegg",
  note = "",
}) {
  const open = useContact();
  return (
    <button type="button" className={className} onClick={() => open(equipment, note)}>
      {children}
      <ArrowUpRight size={18} />
    </button>
  );
}

export function solutionLinks(site, language = "nb") {
  return slides.map((slide) => ({
    slug: slide.slug,
    name: slide[language]?.displayTitle || slide.nb?.displayTitle || slide.slug,
    summary: slide[language]?.visibleDescription || slide.nb?.visibleDescription || "",
    image:
      site === "minelsol" && slide.image === "/carousel/image3.png"
        ? "/carousel/minelBilde.png"
        : slide.image,
  }));
}

export function SiteShell({ site, language = "nb", children }) {
  const config = useSiteConfig() || {};
  const router = useRouter();
  const formRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [equipment, setEquipment] = useState("Solcelleanlegg");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const phone = config.footer?.phone || DEFAULT_PHONE;
  const phoneHref = config.footer?.phoneHref || phone.replace(/\s/g, "");
  const email = config.footer?.email || "";
  const solutions = useMemo(() => solutionLinks(site, language), [site, language]);

  const openContact = (choice = "Solcelleanlegg", message = "") => {
    setEquipment(choice);
    setNote(message);
    setError("");
    setContactOpen(true);
    setMenuOpen(false);
  };

  const nav = [
    { label: "Solceller", href: "/#losninger" },
    { label: "Batteri", href: "/batteri" },
    { label: "Slik fungerer det", href: "/#prosessen" },
    { label: "Om oss", href: "/omoss" },
    { label: "Blogg", href: "/blog" },
  ];

  async function submit(event) {
    event.preventDefault();
    if (loading) return;

    const data = new FormData(formRef.current);
    const address = data.get("user_address")?.trim();
    const name = data.get("user_name")?.trim();
    const userPhone = data.get("user_phone")?.trim();
    const userEmail = data.get("user_email")?.trim();

    if (!address || !name || !userPhone || !userEmail) {
      setError("Alle felt må fylles ut!");
      return;
    }

    setLoading(true);
    let response;
    try {
      response = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: config.site,
          user_address: address,
          user_name: name,
          user_phone: userPhone,
          user_email: userEmail,
          user_equipment: data.get("user_equipment"),
          user_comment: data.get("user_comment"),
          gclid: data.get("gclid"),
          fbclid: data.get("fbclid"),
          utmCampaign: data.get("utmCampaign"),
        }),
      });
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
      setLoading(false);
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error || "Noe gikk galt. Prøv igjen.");
      setLoading(false);
      return;
    }

    emailjs.sendForm(
      process.env.NEXT_PUBLIC_SERVICE_ID,
      process.env.NEXT_PUBLIC_TEMPLATE_ID,
      formRef.current,
      process.env.NEXT_PUBLIC_PUBLIC_KEY,
    );

    setError("");
    setLoading(false);
    formRef.current.reset();
    setContactOpen(false);
    router.push("/takk");
  }

  return (
    <ContactContext.Provider value={openContact}>
      <a className="skip-link" href="#main">
        Gå til innhold
      </a>

      <div className="topbar" id="top">
        <div className="wrap topbar-inner">
          <span>
            <MapPin size={13} />
            {config.topbar?.text || `Din lokale installatør${config.region ? ` i ${config.region}` : ""}`}
          </span>
          <a href={`tel:${phoneHref}`}>
            <Phone size={13} />
            {phone}
          </a>
        </div>
      </div>

      <header className="site-header">
        <div className="wrap nav-wrap">
          <Link href="/" className="brand" aria-label={`${config.title || "Forsiden"} – forsiden`}>
            <img src={config.logo} alt={config.title || "Logo"} />
          </Link>
          <nav className="desktop-nav" aria-label="Hovedmeny">
            {nav.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button type="button" className="btn btn-solar nav-cta" onClick={() => openContact()}>
              {config.estimateBtn?.text || "Få tilbud"}
              <ArrowUpRight size={17} />
            </button>
            <button
              type="button"
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Åpne meny"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {children}

      <footer className="footer print:hidden">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <Link href="/">
              <img src={config.logo} alt={config.title || "Logo"} />
            </Link>
            <p>{config.footer?.tagline || "Solenergi, levert og fulgt opp av din lokale installatør."}</p>
          </div>

          <div>
            <h3>Våre løsninger</h3>
            {solutions.map((solution) => (
              <Link key={solution.slug} href={`/solceller/${solution.slug}`}>
                {solution.name}
              </Link>
            ))}
            <Link href="/batteri">Solceller med batteri</Link>
          </div>

          <div>
            <h3>Bli bedre kjent</h3>
            <Link href="/omoss">Om oss</Link>
            <Link href="/#prosessen">Veien til solceller</Link>
            <Link href="/solkart">{config.exploreBtn?.text || "Solkart"}</Link>
            <Link href="/blog">Kunnskap og inspirasjon</Link>
            <Link href="/kontakt">Kontakt oss</Link>
          </div>

          <div className="footer-contact">
            <h3>La oss ta en prat</h3>
            <a className="footer-phone" href={`tel:${phoneHref}`}>
              {phone}
            </a>
            {email && <a href={`mailto:${email}`}>{email}</a>}
            <p>{config.footer?.address}</p>
          </div>
        </div>

        <div className="wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} {config.legal || config.title}
            {config.footer?.organizationNumber ? ` · Org.nr. ${config.footer.organizationNumber}` : ""}
          </span>
          <div>
            <a
              href={config.privacyUrl || "/personvern"}
              target={config.privacyUrl ? "_blank" : undefined}
              rel={config.privacyUrl ? "noreferrer" : undefined}
            >
              Personvernerklæring
            </a>
            <Link href="/kjopsbetingelser">Kjøpsbetingelser</Link>
            <button type="button" id="revoke-consent-btn">
              Cookie-innstillinger
            </button>
            <a href="#top">Til toppen ↑</a>
          </div>
        </div>
      </footer>

      <Sheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        className="mobile-sheet"
        labelledBy="mobile-menu-title"
      >
        <SheetTitle id="mobile-menu-title">Meny</SheetTitle>
        <SheetDescription>{config.title}</SheetDescription>
        <button
          type="button"
          className="dialog-x"
          onClick={() => setMenuOpen(false)}
          aria-label="Lukk meny"
        >
          <X size={21} />
        </button>
        <nav>
          {nav.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
              <ArrowRight size={20} />
            </Link>
          ))}
          <Link href="/solkart" onClick={() => setMenuOpen(false)}>
            {config.exploreBtn?.text || "Prøv vår solcellekalkulator"}
            <ArrowRight size={20} />
          </Link>
        </nav>
        <button type="button" className="btn btn-solar" onClick={() => openContact()}>
          {config.estimateBtn?.text || "Jeg ønsker tilbud"}
          <ArrowUpRight size={18} />
        </button>
        <a href={`tel:${phoneHref}`}>{phone}</a>
      </Sheet>

      <Dialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        className="contact-dialog"
        labelledBy="contact-dialog-title"
      >
        <button
          type="button"
          className="dialog-x"
          onClick={() => setContactOpen(false)}
          aria-label="Lukk forespørsel"
        >
          <X size={21} />
        </button>

        <div className="contact-heading">
          <span className="eyebrow">
            <Sun size={17} />
            LA OSS FINNE DIN LØSNING
          </span>
          <DialogTitle id="contact-dialog-title">
            {config.modalTitle || "Et godt anlegg starter med en prat."}
          </DialogTitle>
          <DialogDescription>
            Fortell litt om planene dine, så kommer vi tilbake med en uforpliktende
            vurdering på e-post.
          </DialogDescription>
        </div>

        <form ref={formRef} className="contact-form" onSubmit={submit}>
          <input type="hidden" name="site" value={config.title || ""} readOnly />
          <input type="hidden" name="user_equipment" value={equipment} readOnly />

          <RadioGroup
            name="equipment_choice"
            legend="Jeg er interessert i"
            className="interest-options"
            value={equipment}
            onValueChange={setEquipment}
            options={INTEREST_OPTIONS}
          />

          <div className="form-grid">
            <label>
              Navn
              <input required name="user_name" autoComplete="name" placeholder="Fornavn Etternavn" maxLength={100} />
            </label>
            <label>
              E-post
              <input required name="user_email" type="email" autoComplete="email" placeholder="deg@eksempel.no" maxLength={150} />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Adresse
              <input required name="user_address" autoComplete="street-address" placeholder="Adresse for installasjon" maxLength={200} />
            </label>
            <label>
              Telefon
              <input required name="user_phone" type="tel" autoComplete="tel" placeholder="Mobilnummer" maxLength={30} />
            </label>
          </div>

          <label>
            Fortell gjerne litt mer <span>(valgfritt)</span>
            <textarea
              name="user_comment"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={2500}
              placeholder="Strømforbruk, type tak, ønsker om batteri …"
            />
          </label>

          <label className="consent-row">
            <input type="checkbox" required />
            <span>
              Jeg godtar at informasjonen brukes til å sende tilbud på solcellepaneler
              via e-post og eventuelt kontakte meg på mobil.
            </span>
          </label>

          {error && <p className="input-error">{error}</p>}

          <button type="submit" className="btn btn-solar full" disabled={loading}>
            {loading ? "Sender …" : "Send forespørsel"}
            <ArrowRight size={18} />
          </button>

          <p className="form-note">
            <Check size={13} /> Uforpliktende. Du kan også ringe oss på{" "}
            <a href={`tel:${phoneHref}`}>{phone}</a>.
          </p>

          <input type="hidden" name="gclid" value={getLocalStorage("gclid") ?? ""} readOnly />
          <input type="hidden" name="fbclid" value={getLocalStorage("fbclid") ?? ""} readOnly />
          <input type="hidden" name="utmCampaign" value={getLocalStorage("utmCampaign") ?? ""} readOnly />
        </form>
      </Dialog>
    </ContactContext.Provider>
  );
}

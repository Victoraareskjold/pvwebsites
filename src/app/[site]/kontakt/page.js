"use client";

/**
 * Kontaktskjema. Samme innsending som før (EmailJS + /takk) – bare
 * innrammingen er byttet til designmalen.
 */

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

import { useSiteConfig } from "../../../contexts/siteConfigContext";
import { getLocalStorage } from "../../../../utils/localstorage";
import { ContactSection } from "../../../components/design/Sections";
import { ArrowRight, MessageCircle } from "../../../components/design/icons";

export default function Contact() {
  const config = useSiteConfig() || {};
  const formRef = useRef(null);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    if (
      !formData.get("user_name") ||
      !formData.get("user_email") ||
      !formData.get("user_phone") ||
      !formData.get("user_comment")
    ) {
      setErrorMessage("Alle felt må fylles ut!");
      return;
    }

    setErrorMessage("");

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        formRef.current,
        process.env.NEXT_PUBLIC_PUBLIC_KEY,
      )
      .then(
        () => {
          formRef.current.reset();
          router.push("/takk");
        },
        () => setErrorMessage("Noe gikk galt. Prøv igjen."),
      );
  };

  return (
    <main id="main" className="ds">
      <section className="section">
        <div className="wrap" style={{ maxWidth: 640 }}>
          <span className="eyebrow">
            <MessageCircle size={17} />
            VI ER BARE EN PRAT UNNA
          </span>
          <h2>Kontakt oss</h2>
          <p className="section-lead" style={{ marginBottom: 28 }}>
            Ta kontakt dersom det er noe du lurer på, så kommer vi tilbake til deg så fort vi kan.
          </p>

          <form ref={formRef} onSubmit={sendEmail} className="contact-form">
            <input type="hidden" name="site" value={config.title || ""} readOnly />

            <div className="form-grid">
              <label>
                Navn
                <input type="text" name="user_name" autoComplete="name" required />
              </label>
              <label>
                E-post
                <input type="email" name="user_email" autoComplete="email" required />
              </label>
            </div>

            <label>
              Telefon
              <input type="tel" name="user_phone" autoComplete="tel" required />
            </label>

            <label>
              Beskjed
              <textarea name="user_comment" rows={4} required />
            </label>

            {errorMessage && <p className="input-error">{errorMessage}</p>}

            <button type="submit" className="btn btn-solar full">
              Send
              <ArrowRight size={18} />
            </button>

            <input type="hidden" name="gclid" value={getLocalStorage("gclid") ?? ""} readOnly />
            <input type="hidden" name="fbclid" value={getLocalStorage("fbclid") ?? ""} readOnly />
            <input type="hidden" name="utmCampaign" value={getLocalStorage("utmCampaign") ?? ""} readOnly />
          </form>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}

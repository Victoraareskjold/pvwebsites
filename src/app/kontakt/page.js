"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Contact() {
  const config = useSiteConfig();
  const form = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const name = formData.get("user_name");
    const email = formData.get("user_email");
    const phone = formData.get("user_phone");
    const message = formData.get("message");
    const site = formData.get("site");

    if (!name || !email || !message) {
      setErrorMessage("Alle felt må fylles ut!");
      return;
    }

    setErrorMessage("");

    emailjs
      .sendForm(process.env.SERVICE_ID, process.env.TEMPLATE_ID, form.current, {
        publicKey: process.env.PUBLIC_KEY,
      })
      .then(
        () => {
          console.log("SUCCESS!");
          alert("E-posten ble sendt!");
          form.current.reset();
          router.push("/");
        },
        (error) => {
          console.error("FAILED...", error.text);
          setErrorMessage("Noe gikk galt. Prøv igjen.");
        }
      );
  };

  return (
    <div className="py-24 min-h-screen px-12 justify-center flex flex-col bg-regularOrange text-black">
      <form
        ref={form}
        onSubmit={sendEmail}
        className="flex-col flex max-w-96 m-auto w-full"
      >
        <h3 className="mb-4">Kontakt oss</h3>
        <p className="mb-8">
          Ta kontakt med oss dersom det er noe du lurer på, også kommer vi
          tilbake til deg så fort vi har tid!
        </p>
        <input
          value={config.title || "undefined"}
          name="site"
          readOnly
          hidden
        />
        <label>Navn</label>
        <input type="text" name="user_name" className="inputLabel" required />
        <br />
        <label>E-post</label>
        <input type="email" name="user_email" className="inputLabel" required />
        <br />
        <label>Telefon</label>
        <input type="phone" name="user_phone" className="inputLabel" required />
        <br />
        <label>Beskjed</label>
        <textarea name="message" className="inputLabel" required />
        <br />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          value="Send"
          className="bg-black text-white py-2 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}

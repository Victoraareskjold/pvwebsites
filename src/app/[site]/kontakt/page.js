"use client";
import { useSiteConfig } from "../../../contexts/siteConfigContext";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getLocalStorage } from "../../../../utils/localstorage";

export default function Contact() {
  const config = useSiteConfig();
  const formRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const name = formData.get("user_name");
    const email = formData.get("user_email");
    const phone = formData.get("user_phone");
    const message = formData.get("user_comment");
    const site = formData.get("site");

    if (!name || !email || !phone || !message) {
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
          console.log("SUCCESS!");
          formRef.current.reset();
          router.push("/takk");
        },
        (error) => {
          console.error("FAILED...", error);
          setErrorMessage("Noe gikk galt. Prøv igjen.");
        },
      );
  };

  return (
    <div
      className={`py-24 min-h-screen px-12 justify-center flex flex-col ${
        config.site === "MinelSol" ? "bg-[#1C0E52]" : "bg-regularOrange"
      } text-black`}
    >
      <form
        ref={formRef}
        onSubmit={sendEmail}
        className={`flex-col flex max-w-96 m-auto w-full ${
          config.site === "MinelSol" ? "text-white" : ""
        }`}
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
        <input type="tel" name="user_phone" className="inputLabel" required />
        <br />
        <label>Beskjed</label>
        <textarea name="user_comment" className="inputLabel" required />
        <br />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          value="Send"
          className="bg-white p-2 mt-8 rounded-md text-black w-full flex flex-row gap-2 justify-center hover:!bg-black hover:!text-white duration-500 self-center"
        >
          Send
        </button>
        <input
          type="hidden"
          name="gclid"
          value={getLocalStorage("gclid") ?? ""}
        />
        <input
          type="hidden"
          name="fbclid"
          value={getLocalStorage("fbclid") ?? ""}
        />
        <input
          type="hidden"
          name="utmCampaign"
          value={getLocalStorage("utmCampaign") ?? ""}
        />
      </form>
    </div>
  );
}

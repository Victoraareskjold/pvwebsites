"use client";

import { useSiteConfig } from "../contexts/siteConfigContext";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function FormModal({ isOpen, onClose }) {
  const config = useSiteConfig();
  const formRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const site = formData.get("site");
    const address = formData.get("user_address");
    const name = formData.get("user_name");
    const phone = formData.get("user_phone");
    const email = formData.get("user_email");

    if (!address || !name || !email || !phone) {
      setErrorMessage("Alle felt må fylles ut!");
      return;
    }

    setErrorMessage("");

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        formRef.current,
        process.env.NEXT_PUBLIC_PUBLIC_KEY
      )
      .then(
        () => {
          formRef.current.reset();
          onClose();
          router.push("/takk");
        },
        (error) => {
          console.error("Noe gikk galt: ", error.text);
          setErrorMessage("Noe gikk galt. Prøv igjen.");
        }
      );
  };

  const equipmentChoice = [
    {
      label: "Solcelleanlegg",
      imageUrl: "/logo.png",
    },
    {
      label: "Batteri",
      imageUrl: "/logo.png",
    },
    {
      label: "Solcelleanlegg + Batteri",
      imageUrl: "/logo.png",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black overflow-scroll"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-red-500 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">
          {config?.modalTitle ||
            "Fyll ut dine detaljer for et uforpliktende tilbud på e-post."}
        </h2>
        <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
          <input value={config?.title || ""} name="site" hidden readOnly />
          <div className="flex flex-row justify-between w-full">
            {equipmentChoice.map((choice, i) => (
              <div key={choice.label} className="p-2 rounded-lg shadow-xl">
                <p>{choice.label}</p>
                <img src={choice.imageUrl} className="mx-auto py-2" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium">Adresse*</label>
            <input
              type="text"
              name="user_address"
              placeholder="Adresse for installasjon"
              className="w-full border rounded-md px-3 py-2 bg-zinc-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fullt Navn*</label>
            <input
              type="text"
              name="user_name"
              placeholder="Fornavn Etternavn"
              className="w-full border rounded-md px-3 py-2 bg-zinc-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobil*</label>
            <input
              type="text"
              name="user_phone"
              placeholder="Mobilnummer"
              className="w-full border rounded-md px-3 py-2 bg-zinc-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">E-post*</label>
            <input
              type="email"
              name="user_email"
              placeholder="E-post adresse"
              className="w-full border rounded-md px-3 py-2 bg-zinc-200"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" required className="h-4 w-4" />
            <p className="text-xs">
              Jeg godtar at informasjonen brukes kun til å sende tilbud på
              solcellepaneler via e-post og eventuelt kontakte meg på mobil.
            </p>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <button
            type="submit"
            style={{ background: config.primaryGradient?.bg || "black" }}
            className="w-full text-white py-2 rounded-md font-bold border-2 border-yellow-950"
          >
            Jeg ønsker uforpliktende tilbud
          </button>
          <p className="text-sm">
            Få et estimat som gir deg en oversikt over årlige inntekter og
            tilgjengelig offentlig støtte. Investering i solcellepaneler har
            nylig blitt mye mer lønnsomt, noe som kan overraske deg positivt.
          </p>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useSiteConfig } from "../contexts/siteConfigContext";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function FormModal({ isOpen, onClose }) {
  const config = useSiteConfig();
  const formRef = useRef();

  const [selectedEquipment, setSelectedEquipment] = useState("Solcelleanlegg");
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
    const equipment = formData.get("user_equipment");
    const comment = formData.get("user_comment");

    if (!address || !name || !email || !phone || !equipment) {
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
      imageUrl: "/icon1.png",
    },
    {
      label: "Batteri",
      imageUrl: "/icon2.png",
    },
    {
      label: "Solcelleanlegg + Batteri",
      imageUrl: "/icon3.png",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black"
      style={{ zIndex: 1000 }}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative
                max-h-[90vh] overflow-y-auto"
      >
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
          <div className="flex flex-row justify-between w-full gap-2">
            {equipmentChoice.map((choice) => {
              const isSelected = selectedEquipment === choice.label;

              return (
                <button
                  type="button"
                  key={choice.label}
                  onClick={() => setSelectedEquipment(choice.label)}
                  className={`p-2 rounded-lg shadow-xl w-full transition border-2
          ${
            isSelected
              ? "border-[#FFC25F] ring-2 ring-[#FFC25F]"
              : "border-transparent hover:border-gray-300"
          }`}
                >
                  <p className="font-medium">{choice.label}</p>
                  <img
                    src={choice.imageUrl}
                    className="mx-auto object-contain py-2"
                  />
                </button>
              );
            })}
          </div>

          <input
            type="hidden"
            name="user_equipment"
            value={selectedEquipment}
          />

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
          <div>
            <label className="block text-sm font-medium">Kommentar</label>
            <textarea
              type="text"
              name="user_comment"
              placeholder="Kommentar"
              className="w-full border rounded-md px-3 py-2 bg-zinc-200"
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

"use client";
import FormModal from "../../../components/FormModal";
import { TwoButtonComponent } from "../../../components/TwoButtonComponent";
import { useSiteConfig } from "../../../contexts/siteConfigContext";
import { useState } from "react";

export default function About() {
  const config = useSiteConfig();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white flex justify-center">
      <div className="max-w-6xl w-full">
        <div className="relative">
          <img src={config.about?.image} className="w-full" />
          <div className="blackFade2"></div>
          <div className="blackFade3"></div>
          <div className="blackFade4"></div>
        </div>

        <div className="px-12 mt-4 flex flex-col gap-8">
          <h3 className="text-3xl">
            {config.about?.header || "Missing aboutHeader1"}
          </h3>
          <h2 className="text-xl">
            {config.about?.subHeader || "Missing aboutHeader2"}
          </h2>
          {config.about?.p1 ? (
            <p className="text-lg">{config.about?.p1}</p>
          ) : null}
          {config.about?.p2 ? (
            <p className="text-lg">{config.about?.p2}</p>
          ) : null}
          {config.about?.p3 ? (
            <p className="text-lg">{config.about?.p3}</p>
          ) : null}
          {config.about?.image2 ? (
            <img
              src={config.about?.image2}
              className="rounded-2xl aspect-video object-cover"
            />
          ) : null}
          {config.about?.p4 ? (
            <p className="text-lg">{config.about?.p4}</p>
          ) : null}
          {config.about?.p5 ? (
            <p className="text-lg">{config.about?.p5}</p>
          ) : null}
          <TwoButtonComponent setModalOpen={setModalOpen} />
        </div>

        <FormModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          config={config}
        />
      </div>
    </main>
  );
}

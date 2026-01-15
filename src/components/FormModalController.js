"use client";

import FormModal from "../components/FormModal";
import { useState } from "react";
import { TwoButtonComponent } from "./TwoButtonComponent";
import { useSiteConfig } from "@/contexts/siteConfigContext";

export default function FormModalController() {
  const [isModalOpen, setModalOpen] = useState(false);

  const config = useSiteConfig();

  const isMinel = config.site === "MinelSol";

  return (
    <>
      <div className="">
        <TwoButtonComponent setModalOpen={setModalOpen} isMinel={isMinel} />
      </div>
      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

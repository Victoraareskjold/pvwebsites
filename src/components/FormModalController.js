"use client";

import FormModal from "../components/FormModal";
import { useState } from "react";
import { TwoButtonComponent } from "./TwoButtonComponent";

export default function FormModalController() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="">
        <TwoButtonComponent setModalOpen={setModalOpen} />
      </div>
      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

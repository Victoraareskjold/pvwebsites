"use client";

import { useSiteConfig } from "../../../contexts/siteConfigContext";
import Link from "next/link";

export default function Takk() {
  const config = useSiteConfig();
  return (
    <div className="py-24 min-h-screen px-12 justify-center flex flex-col bg-regularOrange text-black text-center">
      <p className="text-center mb-12 text-2xl">
        Hei!
        <br />
        <br />
        {config.contact?.thankyou ||
          "Vi har mottatt beskjeden din og vil ta kontakt med deg så snart som mulig 😊"}
      </p>
      <Link
        href="/"
        className="bg-white p-2 rounded-md text-black w-full max-w-64 flex flex-row gap-2 justify-center hover:!bg-black hover:!text-white duration-500 self-center font-bold"
      >
        Hjem
      </Link>
    </div>
  );
}

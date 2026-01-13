"use client";
import { useSiteConfig } from "../contexts/siteConfigContext";
import Link from "next/link";
import { EstimateButton } from "./EstimateButton";
import { EstimateButton2 } from "./EstimateButton2";
export function TwoButtonComponent({ setModalOpen }) {
  const config = useSiteConfig();
  return (
    <div className="mt-24 flex flex-col gap-4 pb-8 md:mt-4 md:flex-row md:justify-center md:gap-8">
      <EstimateButton2 />
      <Link
        href="/solkart"
        className="bg-white p-2 rounded-md text-black md:w-full md:max-w-xl flex flex-row gap-2 justify-center hover:!bg-black hover:!text-white duration-500"
      >
        <p className="m-0">{config.twoBtn?.text2 || "Utforsk din egen tomt"}</p>
        {!config.site === "MinelSol" && (
          <img src="/search.png" className="w-6 self-center" />
        )}
      </Link>
    </div>
  );
}

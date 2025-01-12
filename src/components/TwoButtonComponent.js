"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";
import Link from "next/link";
export function TwoButtonComponent() {
  const config = useSiteConfig();
  return (
    <div className="mt-24 flex flex-col gap-4 pb-8 md:mt-4 md:flex-row md:justify-center md:gap-8">
      <Link
        href="#"
        style={{ background: config.primaryGradient?.bg || "black" }}
        className="p-2 rounded-md orangefunkybtn text-black md:w-full md:max-w-xl text-center"
      >
        <h2 style={{ color: config.primaryGradient?.textColor || "white" }}>
          {config.twoBtn?.text1 || "Jeg ønsker tilbud"}
        </h2>
      </Link>
      <Link
        href="/#pvmap"
        className="bg-white p-2 rounded-md text-black md:w-full md:max-w-xl flex flex-row gap-2 justify-center"
      >
        <p className="m-0">{config.twoBtn?.text2 || "Utforsk din egen tomt"}</p>
        <img src="/search.png" className="w-6 self-center" />
      </Link>
    </div>
  );
}

"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";

export default function Solkart() {
  const config = useSiteConfig();

  return (
    <div className="bg-black">
      <iframe
        src={`https://pvmap.vercel.app/?site=${config.title}`}
        className="h-800 md:h-screen"
        width="100%"
        style={{ paddingTop: "72px" }}
      />
    </div>
  );
}

"use client";

import { useSiteConfig } from "@/contexts/siteConfigContext";

export default function Solkart() {
  const config = useSiteConfig();

  return (
    <div style={{ backgroundColor: "#1E1E1E" }} className="h-screen">
      <iframe
        src={`https://pvmap.vercel.app/?site=${config.title}`}
        className="h-full lg:!pb-0"
        width="100%"
        style={{ paddingTop: "72px" }}
      />
    </div>
  );
}

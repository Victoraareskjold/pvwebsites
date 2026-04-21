"use client";

import { useEffect, useState } from "react";
import { getLocalStorage } from "../../../../utils/localstorage";

export default function SolkartClient({ site }) {
  const [query, setQuery] = useState(null);

  useEffect(() => {
    const gclid = getLocalStorage("gclid") ?? "";
    const fbclid = getLocalStorage("fbclid") ?? "";
    const utm = getLocalStorage("utmCampaign") ?? "";

    const params = new URLSearchParams({
      site,
      ...(gclid && { gclid }),
      ...(fbclid && { fbclid }),
      ...(utm && { utm_campaign: utm }),
    });

    setQuery(params.toString());
  }, [site]);

  return (
    <div style={{ backgroundColor: "#1E1E1E" }} className="h-full">
      {query !== null && (
        <iframe
          src={`https://pvmap.vercel.app/?${query}`}
          className="h-full lg:!pb-0"
          width="100%"
          style={{ paddingTop: "86px" }}
        />
      )}
    </div>
  );
}

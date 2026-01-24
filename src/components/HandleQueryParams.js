"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { setLocalStorage } from "../../utils/localstorage";

export default function HandleQueryParams() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const gclid = searchParams.get("gclid");
    const fbclid = searchParams.get("fbclid");
    const utmCampaign = searchParams.get("utmCampaign");

    if (gclid) {
      setLocalStorage("gclid", gclid);
    }

    if (fbclid) {
      setLocalStorage("fbclid", fbclid);
    }

    if (utmCampaign) {
      setLocalStorage("utmCampaign", fbclid);
    }
  }, [searchParams]);

  return null;
}

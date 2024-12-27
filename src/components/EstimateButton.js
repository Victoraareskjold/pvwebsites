import { useSiteConfig } from "@/contexts/siteConfigContext";
import Link from "next/link";
export function EstimateButton() {
  const config = useSiteConfig();
  return (
    <Link
      href=""
      style={{ background: config.primaryGradient?.bg || "black" }}
      className="p-2 rounded-md text-black md:border-2 md:border-white md:!bg-none md:max-w-96 md:w-full text-center"
    >
      <h2
        style={{ color: config.primaryGradient?.textColor || "white" }}
        className="md:!text-white"
      >
        Jeg ønsker tilbud
      </h2>
    </Link>
  );
}

import { useSiteConfig } from "@/contexts/siteConfigContext";
import Link from "next/link";
export function EstimateButton() {
  const config = useSiteConfig();
  return (
    <Link
      href=""
      style={{ background: config.primaryGradient?.bg || "black" }}
      className="p-2 rounded-md text-black md:border-2 md:border-white md:!bg-none md:max-w-96 md:w-full text-center md:hover:!bg-black md:hover:!text-white duration-500"
    >
      <h2
        style={{ color: config.primaryGradient?.textColor || "white" }}
        className="md:!text-white"
      >
        {config.estimateBtn?.text || "Jeg ønsker tilbud"}
      </h2>
    </Link>
  );
}

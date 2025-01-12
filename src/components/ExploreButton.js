import { useSiteConfig } from "@/contexts/siteConfigContext";
import Link from "next/link";

export function ExploreButton() {
  const config = useSiteConfig();
  return (
    <Link
      href="#pvmap"
      className="bg-white p-2 rounded-md text-black md:border-2 md:border-white md:bg-transparent md:text-white md:max-w-96 md:w-full flex flex-row gap-2 justify-center hover:bg-white hover:text-black duration-500"
    >
      <h2>{config.exploreBtn?.text || "Utforsk din egen tomt"}</h2>
      <img src="/search.png" className="w-6 self-center" />
    </Link>
  );
}

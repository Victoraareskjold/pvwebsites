import { useSiteConfig } from "../contexts/siteConfigContext";
import Link from "next/link";

export function SolarSolutionCard({
  image,
  title,
  description,
  slug,
  isMinel,
}) {
  const config = useSiteConfig();
  return (
    <div className="w-full">
      <img src={image} alt={title} className="w-full h-auto" />

      <div className={`${isMinel ? "text-[#1C0E52]" : "text-white"} px-2 py-4`}>
        <div className="h-1 mb-4 w-full bg-white"></div>
        <h2 className="font-bold">{title}</h2>
        <h4 className="mt-2 line-clamp-2 min-h-14">{description}</h4>

        <Link
          href={`/solceller/${slug}`}
          className={`inline-block mt-8 px-4 py-2 border ${
            isMinel ? "border-[#1C0E52]" : "border-white"
          } rounded-md
          hover:bg-white hover:text-black duration-500`}
        >
          <h2>{config.nynorskSlideBtn || "Les mer"}</h2>
        </Link>
      </div>
    </div>
  );
}

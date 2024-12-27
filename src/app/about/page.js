"use client";
import { TwoButtonComponent } from "@/components/TwoButtonComponent";
import { useSiteConfig } from "@/contexts/siteConfigContext";

export default function About() {
  const config = useSiteConfig();

  return (
    <main className="min-h-screen bg-black text-white flex justify-center">
      <div className="max-w-6xl w-full">
        <div className="relative">
          <img src={config.aboutImage1} className="w-full" />
          <div className="blackFade2"></div>
          <div className="blackFade3"></div>
          <div className="blackFade4"></div>
        </div>

        <div className="px-12 mt-4">
          <h3>{config.aboutHeader1 || "Missing aboutHeader1"}</h3>
          <h2>{config.aboutHeader2 || "Missing aboutHeader2"}</h2>
          {config.aboutParagraph1 ? <p>{config.aboutParagraph1}</p> : null}
          {config.aboutParagraph2 ? <p>{config.aboutParagraph2}</p> : null}
          {config.aboutParagraph3 ? <p>{config.aboutParagraph3}</p> : null}
          {config.aboutParagraph4 ? <p>{config.aboutParagraph4}</p> : null}
          {config.aboutParagraph5 ? <p>{config.aboutParagraph5}</p> : null}
          {config.aboutImage2 ? <img src={config.abouImage2} /> : null}
          <TwoButtonComponent />
        </div>
      </div>
    </main>
  );
}

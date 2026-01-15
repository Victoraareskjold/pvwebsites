/* eslint-disable @next/next/no-img-element */
"use client";
import { useSiteConfig } from "../contexts/siteConfigContext";
import Link from "next/link";
import { useState } from "react";

export default function InfoCarouselLarge({ slides, isMinel }) {
  const config = useSiteConfig();
  const { language } = useSiteConfig();
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLight = isMinel; // Minel = lys bakgrunn
  const textColor = isLight ? "text-[#1C0E52]" : "text-white";
  const textMuted = isLight ? "text-[#1C0E52]/70" : "text-white/70";
  const borderColor = isLight ? "border-[#1C0E52]" : "border-white";
  const hoverBg = isLight
    ? "hover:bg-black hover:text-white"
    : "hover:bg-white hover:text-[#1C0E52]";

  return (
    <div className={`w-full ${isMinel ? "bg-white" : "bg-black"} p-48`}>
      {/* Hovedbilde som endres */}
      <div className="relative w-full mb-6">
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-4/5 max-w-screen-2xl m-auto h-auto object-cover"
        />
      </div>

      {/* Horisontal tekst og knapperad */}
      <div className="flex justify-between items-start px-4 space-x-4">
        {slides.map((slide, index) => {
          const content = slide[language] || slide["nb"];
          const isActive = currentSlide === index;

          return (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`cursor-pointer p-4 flex-1 border-t-4 ${
                isActive ? borderColor : "border-transparent"
              } transition-all`}
            >
              <h3 className={`font-bold ${isActive ? textColor : textMuted}`}>
                {content.displayTitle}
              </h3>

              <p className={`mt-2 mb-4 ${isActive ? textColor : textMuted}`}>
                {content.visibleDescription}
              </p>

              <Link
                href={`/solceller/${slide.slug}`}
                className={`mt-4 px-4 py-2 border ${borderColor} ${textColor} ${hoverBg} duration-500 rounded-md`}
              >
                {config.nynorskSlideBtn || "Les mer"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

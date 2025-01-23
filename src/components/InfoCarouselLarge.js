/* eslint-disable @next/next/no-img-element */
"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";
import Link from "next/link";
import { useState } from "react";

export default function InfoCarouselLarge({ slides }) {
  const config = useSiteConfig();
  const { language } = useSiteConfig();
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="w-full bg-black p-48">
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
          return (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`cursor-pointer p-4 flex-1 border-t-4 ${
                currentSlide === index
                  ? "border-white opacity-100"
                  : "border-transparent opacity-75"
              } hover:opacity-100 transition-all`}
            >
              <h3
                className={`font-bold ${
                  currentSlide === index
                    ? "text-white opacity-100"
                    : "text-white opacity-75"
                }`}
              >
                {content.displayTitle}
              </h3>
              <p
                className={`mt-2 mb-4 ${
                  currentSlide === index
                    ? "text-white"
                    : "text-white opacity-75"
                }`}
              >
                {content.visibleDescription}
              </p>
              <Link
                href={`/solceller/${slide.slug}`}
                className={`mt-4 px-4 py-2 border hover:bg-white hover:text-black duration-500 ${
                  currentSlide === index
                    ? "border-white text-white"
                    : "border-white text-white"
                } rounded-md`}
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

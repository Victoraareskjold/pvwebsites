"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";
import { useEffect, useState } from "react";
import { SolarSolutionCard } from "./SolarSolutionCard";

export default function InfoCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useSiteConfig();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="overflow-hidden w-full bg-black">
      {/* Wrapper for å animere alle slides */}
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 80}%)` }}
      >
        {slides.map((slide, index) => {
          const content = slide[language] || slide["nb"];
          return (
            <div
              key={index}
              className="flex-shrink-0 w-full flex justify-center items-center"
              style={{
                opacity: currentSlide === index ? 1 : 0.75,
                transition: "opacity 1s ease-in-out",
                maxWidth: "80%",
              }}
            >
              {/* Kort med bildet i full bredde og tekst som tar 80% */}
              <div className="w-full mr-8">
                <SolarSolutionCard
                  image={slide.image}
                  title={content.title}
                  description={content.description}
                  slug={slide.slug}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

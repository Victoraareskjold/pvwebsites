"use client";
import { useState, useEffect } from "react";
import { SolarSolutionCard } from "./SolarSolutionCard";

export default function InfoCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Bytter hvert 5. sekund
    return () => clearInterval(timer); // Rydd opp timer
  }, [slides.length]);

  return (
    <div className="overflow-hidden w-full bg-black">
      {/* Wrapper for å animere alle slides */}
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 80}%)` }}
      >
        {slides.map((slide, index) => (
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
                title={slide.title}
                description={slide.description}
                slug={slide.slug}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)} // Setter currentSlide ved klikk
          ></span>
        ))}
      </div> */}
    </div>
  );
}

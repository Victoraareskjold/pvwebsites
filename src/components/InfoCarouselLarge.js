"use client";
import { useState } from "react";
import { SolarSolutionCard } from "./SolarSolutionCard";
import Link from "next/link";

export default function InfoCarouselLarge({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="w-full bg-black p-48">
      {/* Hovedbilde som endres */}
      <div className="relative w-full mb-6">
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Horisontal tekst og knapperad */}
      <div className="flex justify-between items-start px-4 space-x-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`cursor-pointer p-4 flex-1 border-t-4 ${
              currentSlide === index ? "border-white" : "border-transparent"
            } transition-all`}
          >
            <h3
              className={`font-bold ${
                currentSlide === index ? "text-white" : "text-gray-400"
              }`}
            >
              {slide.title}
            </h3>
            <p
              className={`mt-2 mb-4 ${
                currentSlide === index ? "text-white" : "text-gray-500"
              }`}
            >
              {slide.description}
            </p>
            <Link
              href={`/slide/${slide.slug}`}
              className={`mt-4 px-4 py-2 border ${
                currentSlide === index
                  ? "border-white text-white"
                  : "border-gray-500 text-gray-500"
              } rounded-md`}
            >
              Se mer
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

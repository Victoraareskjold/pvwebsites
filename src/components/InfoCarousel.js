"use client";
import { useSiteConfig } from "../contexts/siteConfigContext";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { SolarSolutionCard } from "./SolarSolutionCard";

export default function InfoCarousel({ slides, isMinel }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useSiteConfig();

  const goToSlide = (index) => {
    if (index < 0) {
      setCurrentSlide(slides.length - 1); // Gå til siste slide
    } else if (index >= slides.length) {
      setCurrentSlide(0); // Gå til første slide
    } else {
      setCurrentSlide(index);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToSlide(currentSlide + 1),
    onSwipedRight: () => goToSlide(currentSlide - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // For testing på desktop med mus
  });

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  return (
    <div
      className={`overflow-hidden w-full ${
        isMinel ? "bg-white" : "bg-black"
      } mt-12`}
      {...swipeHandlers} // Legg til swipe-håndtering
    >
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
                  title={content.displayTitle}
                  description={content.visibleDescription}
                  slug={slide.slug}
                  isMinel={isMinel}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

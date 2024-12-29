import { InfoCard } from "@/components/InfoCard";
import { TwoButtonComponent } from "@/components/TwoButtonComponent";
import slides from "../../../config/slides.json";

// Gjør komponenten asynkron
export default async function Slide({ params }) {
  // Vent på params
  const { slug } = await params;

  // Finn slidegen basert på slug
  const slide = slides.find((b) => b.slug === slug);

  if (!slide) {
    return <div className="py-24 min-h-screen px-4">slide ikke funnet</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white justify-center flex">
      <div className="max-w-6xl w-full">
        {slide.image ? (
          <div className="relative">
            <img className="w-full" src={slide.image} />
            <div className="blackFade2"></div>
            <div className="blackFade3"></div>
            <div className="blackFade4"></div>
          </div>
        ) : (
          <div className="py-8"></div>
        )}
        <div className="px-12 mt-4">
          {slide.title ? (
            <h3 className="mb-2 text-center">
              Fremtidens Energi for {slide.title}
            </h3>
          ) : null}
          {slide.description ? (
            <h2 className="mb-6">{slide.description}</h2>
          ) : null}

          {slide.advantageTitle1 && slide.advantageDescription1 ? (
            <h3 className="mb-6 text-regularOrange">FORDELER</h3>
          ) : null}
          <div className="flex flex-col gap-4">
            {slide.advantageTitle1 && slide.advantageDescription1 ? (
              <InfoCard
                number={"1"}
                title={slide.advantageTitle1}
                description={slide.advantageDescription1}
              />
            ) : null}
            {slide.advantageTitle2 && slide.advantageDescription2 ? (
              <InfoCard
                number={"2"}
                title={slide.advantageTitle2}
                description={slide.advantageDescription2}
              />
            ) : null}
            {slide.advantageTitle3 && slide.advantageDescription3 ? (
              <InfoCard
                number={"3"}
                title={slide.advantageTitle3}
                description={slide.advantageDescription3}
              />
            ) : null}
          </div>

          <TwoButtonComponent />
        </div>
      </div>
    </div>
  );
}

import FormModalController from "../../../../components/FormModalController";
import { InfoCard } from "../../../../components/InfoCard";
import { headers } from "next/headers";
import slides from "../../../../config/slides.json";

// Gjør komponenten asynkron
export default async function Slide({ params }) {
  // Vent på params
  const { slug } = await params;

  // Hent headers for å finne site-config
  const headersList = await headers();
  const siteConfig = headersList.get("x-site-config");

  // Bestem språk basert på domenet
  const language = siteConfig === "vestelektrosol" ? "nn" : "nb";

  // Finn slidegen basert på slug
  const slide = slides.find((b) => b.slug === slug);

  if (!slide) {
    return <div className="py-24 min-h-screen px-4">slide ikke funnet</div>;
  }

  // Overstyr bilde for MinelSol + enebolig-hytte
  const imageSrc =
    siteConfig === "minelsol" && slide.image === "/carousel/image3.png"
      ? "/carousel/minelBilde.png"
      : slide.image;

  // Hent innhold for riktig språk
  const content = slide[language];

  if (!content) {
    return (
      <div className="py-24 min-h-screen px-4">
        Ingen innhold funnet for valgt språk
      </div>
    );
  }

  console.log(siteConfig);

  return (
    <div className="min-h-screen bg-black text-white justify-center flex">
      <div className="max-w-6xl w-full">
        {imageSrc ? (
          <div className="relative">
            <img className="w-full" src={imageSrc} />
            <div className="blackFade2"></div>
            <div className="blackFade3"></div>
            <div className="blackFade4"></div>
          </div>
        ) : (
          <div className="py-8"></div>
        )}
        <div className="px-12 mt-4">
          {content.title ? (
            <h3 className="mb-2 text-3xl mb-4 text-center">{content.title}</h3>
          ) : null}
          {content.description ? (
            <h2 className="mb-6 text-lg">{content.description}</h2>
          ) : null}

          {content.advantageTitle1 && content.advantageDescription1 ? (
            <h3 className="mb-6 text-regularOrange">FORDELER</h3>
          ) : null}
          <div className="flex flex-col gap-4">
            {content.advantageTitle1 && content.advantageDescription1 ? (
              <InfoCard
                number={"1"}
                title={content.advantageTitle1}
                description={content.advantageDescription1}
              />
            ) : null}
            {content.advantageTitle2 && content.advantageDescription2 ? (
              <InfoCard
                number={"2"}
                title={content.advantageTitle2}
                description={content.advantageDescription2}
              />
            ) : null}
            {content.advantageTitle3 && content.advantageDescription3 ? (
              <InfoCard
                number={"3"}
                title={content.advantageTitle3}
                description={content.advantageDescription3}
              />
            ) : null}
          </div>

          <FormModalController />
        </div>
      </div>
    </div>
  );
}

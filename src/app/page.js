"use client";
import InfoCarousel from "@/components/InfoCarousel";
import { IncomeCalculator } from "@/components/IncomeCalculator";
import { InfoCard } from "@/components/InfoCard";

import { useSiteConfig } from "@/contexts/siteConfigContext";
import BlogCarousel from "@/components/BlogCarousel";
import { Dropdown } from "@/components/Dropdown";

import slides from "../config/slides";
import { EstimateButton } from "@/components/EstimateButton";
import { ExploreButton } from "@/components/ExploreButton";
import Link from "next/link";
import InfoCarouselLarge from "@/components/InfoCarouselLarge";
import { RoofCapacityButton } from "@/components/RoofCapacityButton";

export default function Page() {
  const config = useSiteConfig();

  return (
    <main>
      <section className="hero pt-32 px-4 md:pt-80" id="main">
        <div className="flex flex-col gap-8 text-white">
          <h2 className="funkysubtitleWhite w-fit text-center self-center">
            {config.hero?.header || "Firmanavn"}
          </h2>

          <h1 className="font-bold text-white text-center relative inline-block">
            <span className="block md:inline">Din Lokale</span>
            <span className="block md:inline">
              Installatør
              <span
                className="dot inline-block h-4 w-4 bg-white rounded-full ml-2"
                style={{
                  transform: "translateY(2px)",
                }}
              ></span>
            </span>
          </h1>

          <h3 className="md:text-center md:mt-96 self-center mx-12">
            {config.hero?.p ||
              "Kvalitet - solid trygghet, og solceller til den beste prisen."}
          </h3>
        </div>

        <div className="mt-32 flex flex-col gap-4 pb-8 md:mt-4 md:flex-row md:justify-center md:gap-8 md:pb-12">
          <EstimateButton />
          <ExploreButton />
        </div>
      </section>

      <section
        id="potentialSaving"
        style={{ background: config.primary || "black" }}
        className="mx-4 my-8 rounded-xl p-2 flex flex-col gap-4 md:hidden"
      >
        <h3 className="text-white text-center">
          {config.potentialSaving?.header ||
            "Hvor stor inntekt kan solcellene gi deg?"}
        </h3>
        <IncomeCalculator />
        <p className="text-white mx-10">
          {config.potentialSaving?.p ||
            "I regneeksempelet har vi tatt utgangspunkt i en fast pris på anlegget på 160.000,- etter Enova-støtte, med en forventet årlig produksjon på 13.000 kWh."}
        </p>

        <RoofCapacityButton />
      </section>

      <section
        id="potentialSaving"
        style={{ background: config.primary || "black" }}
        className="mx-4 my-8 rounded-xl md:p-4 gap-4 hidden md:flex flex-row max-w-5xl mx-auto"
      >
        <div className="w-3/5 flex flex-col gap-2 self-center px-12">
          <h3 className="text-white font-regular ">
            {config.potentialSaving?.header ||
              "Hvor stor inntekt kan solcellene gi deg?"}
          </h3>

          <p className="text-white">
            {config.potentialSaving?.p ||
              "I regneeksempelet har vi tatt utgangspunkt i en fast pris på anlegget på 160.000,- etter Enova-støtte, med en forventet årlig produksjon på 13.000 kWh."}
          </p>
          <RoofCapacityButton />
        </div>
        <IncomeCalculator />
      </section>

      <section id="whyInvest" className="mx-4 mb-12 flex flex-col items-center">
        <h3 className="text-center">
          {config.whyInvest?.header || "Hvorfor investere i solcellepanel?"}
        </h3>
        <div className="divider mb-8 mt-2"></div>
        <img className="ml-2" src="illustration.png" />
      </section>

      <section id="advantage" className="">
        <h3 className="text-center">
          {config.advantage?.header || "Fordelen med en lokal installatør"}
        </h3>
        <div className="divider mb-8 mt-2"></div>
        <div className="relative">
          <img src="carImage.png" className="w-full" />
          <div className="blackFade2"></div>
        </div>

        <div className="bg-black text-white flex flex-col gap-8 px-4 ">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 md:max-w-7xl md:self-center md:pt-12">
            <InfoCard
              number={"1"}
              title={"Hopp over mellomleddet"}
              description={
                "kom direkte til dsgvv sdfds dfsdf fsfsdffdsf fsdfs  fsdfsdf fsdf dfsdsf  fsdfs ffsddsfsdf"
              }
            />
            <InfoCard
              number={"2"}
              title={"Hopp over mellomleddet"}
              description={
                "kom direkte til dsgvv sdfds dfsdf fsfsdffdsf fsdfs  fsdfsdf fsdf dfsdsf  fsdfs ffsddsfsdf"
              }
            />
            <InfoCard
              number={"3"}
              title={"Hopp over mellomleddet"}
              description={
                "kom direkte til dsgvv sdfds dfsdf fsfsdffdsf fsdfs  fsdfsdf fsdf dfsdsf  fsdfs ffsddsfsdf"
              }
            />
            <img
              src="annoyingImage.png"
              alt="image"
              className="image md:h-80 w-full border-8 border-white rounded-md overflow-hidden resize"
            />
          </div>

          <Link
            href="/about"
            className="border-2 border-white p-2 px-4 rounded-md mb-4 md:my-20 md:w-64 md:self-center text-center"
          >
            <h2 className="bold">Les mer om oss</h2>
          </Link>
        </div>
      </section>

      <section className="relative" id="pvmap">
        <div className="blackFade"></div>
        <iframe
          src="https://pvmap.vercel.app/?site=vestelektro"
          height="1000px"
          width="100%"
        />
        <div className="blackFade2"></div>
      </section>

      <section className="bg-black py-24">
        <div className="px-4 mb-12 flex flex-col gap-4">
          <h2 className="funkysubtitleWhite w-fit md:text-center md:self-center">
            {config.solar?.header || "undefined"}
          </h2>
          <h3 className="text-white font-medium md:text-center">
            {config.solar?.header2 || "Utforsk våre solcelleløsninger"}
          </h3>
          <h4 className="text-white md:max-w-4xl md:self-center">
            {config.solar?.header3 ||
              "Om du eier en enebolig, driver et bedriftsbygg, er en del av et borettslag eller er involvert i landbruk, tilbyr vi solcelleløsninger som passer dine behov."}
          </h4>
        </div>
        <div className="xl:hidden">
          <InfoCarousel slides={slides} />
        </div>
        <div className="hidden xl:block">
          <InfoCarouselLarge slides={slides} />
        </div>
      </section>

      <section className="py-8 relative" id="blog">
        <div className="blackFade"></div>

        <div className="mx-4 my-12">
          <h4 className="opacity-50">{config.blog?.header || "Utforks..."}</h4>
          <h3 className="mt-2 mb-2">
            {config.blog?.header2 || "Våre blogg innlegg"}
          </h3>
          <Link
            href="/blog"
            className="border-black border-2 rounded-md text-black py-2 px-8"
          >
            {config.blog?.buttonText || "Se alle blogg innlegg"}
          </Link>
        </div>

        <BlogCarousel />
      </section>

      <section className="px-4 py-12" id="faq">
        <h3 className="md:text-center">
          {config.faq?.header || "Ofte stile spørsmål"}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 md:max-w-7xl md:mx-auto md:gap-8 mt-12">
          <Dropdown title={"tttel"} description={"dette er en besrivekslse"} />
          <Dropdown title={"tttel"} description={"dette er en besrivekslse"} />
        </div>
      </section>
    </main>
  );
}

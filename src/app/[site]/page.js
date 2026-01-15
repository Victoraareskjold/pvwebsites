"use client";
import { IncomeCalculator } from "../../components/IncomeCalculator";
import { InfoCard } from "../../components/InfoCard";
import InfoCarousel from "../../components/InfoCarousel";

import BlogCarousel from "../../components/BlogCarousel";
import { Dropdown } from "../../components/Dropdown";
import { useSiteConfig } from "../../contexts/siteConfigContext";

import { EstimateButton } from "../../components/EstimateButton";
import { ExploreButton } from "../../components/ExploreButton";
import FormModal from "../../components/FormModal";
import InfoCarouselLarge from "../../components/InfoCarouselLarge";
import { RoofCapacityButton } from "../../components/RoofCapacityButton";
import Link from "next/link";
import { useState } from "react";
import slides from "../../config/slides";
import { EstimateButton2 } from "../../components/EstimateButton2";

export default function Page() {
  const config = useSiteConfig();
  const [isModalOpen, setModalOpen] = useState(false);

  const isMinel = config.site === "MinelSol";

  return (
    <main>
      <section className="hero pt-32 px-4 md:pt-80 relative" id="main">
        <div className="absolute inset-0 bg-black opacity-20 z-10"></div>
        <div
          className="absolute bottom-0 left-0 z-20 w-full h-8"
          style={{
            background: "linear-gradient(0deg, #fff 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        ></div>
        {/* Bakgrunnsvideo */}
        {config.hero?.video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={config.hero.video} type="video/mp4" />
            Din nettleser støtter ikke video.
          </video>
        ) : (
          /* Bakgrunnsbilde */
          <div
            className="absolute inset-0 w-full h-full bottom-0"
            style={{
              backgroundImage: `url(${
                config.hero?.background || "/vestelektro/background.png"
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        )}

        {/* Innhold over bakgrunnen */}
        <div className="relative z-10 flex flex-col gap-8 text-white">
          <h2 className="funkysubtitleWhite w-fit text-center self-center">
            {config.hero?.header || "Firmanavn"}
          </h2>

          <h1 className="text-white text-center relative inline-block !text-5xl">
            <span className="block md:inline">Din Lokale </span>
            <span className="block md:inline">
              Installatør
              {!isMinel && (
                <span
                  className="dot inline-block h-4 w-4 bg-white rounded-full ml-2"
                  style={{
                    transform: "translateY(2px)",
                  }}
                ></span>
              )}
            </span>
          </h1>

          <h3 className="text-center md:mt-96 self-center mx-12">
            {config.hero?.p ||
              "Kvalitet - solid trygghet, og solceller til den beste prisen."}
          </h3>

          {/* Knappene */}
          <div className="mt-32 flex flex-col gap-4 pb-8 md:mt-4 md:flex-row md:justify-center md:gap-8 md:pb-12">
            <EstimateButton setModalOpen={setModalOpen} />
            <ExploreButton isMinel={isMinel} />
          </div>
        </div>
        <div
          className="fade1"
          style={{
            background: `${config.hero?.gradient || "none"}`,
          }}
        ></div>
      </section>

      <section
        id="whyInvest"
        className="mx-4 mb-20 flex flex-col items-center gap-20 py-20"
      >
        {/* First block - same order on mobile and desktop */}
        <div className="flex flex-col md:flex-row max-w-screen-xl gap-12 items-center">
          <div className="w-full">
            <h2 className="text-2xl mb-4">
              Solceller – <br />
              nå mer lønnsomt enn noensinne
            </h2>
            <img src="bilde1.png" alt="Solceller" className="w-full" />
          </div>
          <p className="w-full">
            Vi leverer komplette solcelleanlegg til både private og bedrifter -
            for boliger, hytter, næringsbygg og andre egnede flater. <br />
            <br />
            Vi tar ansvar for hele prosessen, fra rådgivning og prosjektering
            til installasjon og ferdig anlegg. Ta gjerne kontakt med oss for en
            uforpliktende vurdering av om solceller er lønnsomt for deg. <br />
            <br /> Som lokal installatør kjenner vi både forholdene og markedet
            i området, og vi er her for å følge deg opp - også etter at anlegget
            er på plass.
          </p>
        </div>

        {/* Second block - reordered on mobile */}
        <div className="flex flex-col md:flex-row max-w-screen-xl gap-20 items-center">
          {/* Mobile order: heading, image, text+button */}
          <div className="w-full flex flex-col md:order-none">
            <h2 className="text-2xl mb-4">
              Solceller med batteri - strømmen du faktisk får brukt
            </h2>

            {/* Image shown on mobile, hidden on desktop */}
            <img
              src="bilde2.png"
              alt="Batteri"
              className="w-full mb-4 md:hidden"
            />

            <p className="w-full mb-4">
              Egenprodusert strøm gir økt frihet i hverdagen. Med batterilagring
              tar du det et steg videre og får bedre utnyttelse av solenergien -
              samtidig som du øker tryggheten i boligen. Du kan lagre
              overskuddsstrøm og bruke den når behovet er størst, for eksempel
              på kveldstid eller ved høye strømpriser. <br />
              <br />
              Et solcelleanlegg med batteri kan også bidra til at viktige
              funksjoner i huset holdes i gang ved strømbrudd. Vi hjelper deg å
              vurdere om batteri er riktig for deg, og finner en løsning som er
              tilpasset ditt forbruk, din bolig og dine behov.
              <br />
              <br /> Ta kontakt for en uforpliktende prat - så gir vi en
              anbefaling basert på hva som faktisk lønner seg i din situasjon.
            </p>

            <div>
              <EstimateButton2 setModalOpen={setModalOpen} />
            </div>
          </div>

          {/* Image shown on desktop, hidden on mobile */}
          <img
            src="bilde2.png"
            alt="Batteri"
            className="w-full hidden md:block"
          />
        </div>
      </section>

      <section
        id="advantage"
        className={`flex flex-col items-center ${
          isMinel ? "bg-white text-[#1C0E52]" : "bg-black text-white"
        } relative`}
      >
        <h3 className="text-center text-2xl md:text-4xl pt-8">
          {config.advantage?.header || "Fordelen med en lokal installatør"}
        </h3>
        <div className="divider mb-20 mt-2 !bg-white"></div>
        <div
          className={`${
            isMinel ? "bg-white" : "bg-black"
          } w-full flex justify-center`}
        >
          <div className="relative max-w-screen-2xl">
            <img
              src={config.advantage?.heroImage || "/heroImage.png"}
              alt="Hero"
              style={{ position: "relative" }}
              className="w-full h-[50vh] md:max-w-screen-xl md:max-h-[940px] md:h-full object-cover mx-auto object-cover"
            />
            {!isMinel && (
              <>
                <div className="blackFade"></div>
                <div className="blackFade2"></div>
                <div className="blackFade3"></div>
                <div className="blackFade4"></div>
              </>
            )}
          </div>
        </div>

        <div
          className={`${
            isMinel ? "bg-white text-[#1C0E52]" : "bg-black text-white"
          } w-full  flex flex-col gap-8 px-4 pb-4`}
        >
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 max-w-screen-2xl md:self-center md:pt-12">
            <InfoCard
              isMinel={isMinel}
              number={"1"}
              title={config.infoCard?.titleOne || "Hopp over mellomleddet"}
              description={
                config.infoCard?.one ||
                "Som lokal installatør får du direkte kontakt med oss som utfører jobben. Vi er fleksible og kjenner klimaet godt, slik at vi kan skreddersy løsninger optimalt for deg."
              }
            />
            <InfoCard
              isMinel={isMinel}
              number={"2"}
              title={config.infoCard?.titleTwo || "Bedre pris, høyere kvalitet"}
              description={
                config.infoCard?.two ||
                "Vi tilbyr bedre priser på anlegg med minst like god – ofte enda bedre – kvalitet enn store landsdekkende aktører i markedet. Vi bruker kun de mest optimale solcellepanelene og jobber kontinuerlig for å finne den beste løsningen for deg."
              }
            />
            <InfoCard
              isMinel={isMinel}
              number={"3"}
              title={
                config.infoCard?.titleThree || "Tett dialog og rask responstid"
              }
              description={
                config.infoCard?.three ||
                "Med en lokal aktør får du tett dialog og rask responstid. Enten det gjelder garantier, service eller vedlikehold, er hjelpen alltid nær. Skulle noe skje, stiller vi som regel opp samme dag eller dagen etter."
              }
            />
            <img
              src={config.advantage?.image || null}
              alt="image"
              className="image md:h-80 w-full border-8 border-white rounded-md overflow-hidden object-cover"
            />
          </div>

          {!isMinel && (
            <Link
              href="/omoss"
              className="border-2 border-white p-2 px-4 rounded-md mb-4 md:my-20 md:w-64 md:self-center text-center hover:bg-white hover:text-black duration-500"
            >
              <h2 className="bold">
                {config.advantage?.readMore || "Les mer om oss"}
              </h2>
            </Link>
          )}
        </div>
      </section>

      <section
        className="relative bg-black h-900 md:h-1380 flex justify-center"
        id="pvmap"
        style={{
          backgroundImage: `url("/vestelektro/background.png")`,
          backgroundSize: "cover",
        }}
      >
        {!isMinel && <div className="blackFade"></div>}

        <div className="px-4 md:px-12 xl:px-12 w-full self-center flex flex-col gap-8 max-w-7xl">
          <h1 className="text-white text-4xl lg:text-6xl">
            Er solceller en god <br /> investering for deg?
          </h1>
          <p className="text-white text-xl max-w-2xl">
            {isMinel
              ? "Skriv inn adressen din og oppdag solcelleløsningen som passer perfekt for deg. Utforsk i ditt eget tempo, og ta kontakt hvis du vil ha råd eller veiledning – helt uforpliktende."
              : "Skriv inn adressen din og se hvilken løsning som passer deg best. Utforsk i ditt eget tempo, og om du lurer på noe, er vi bare en melding unna – helt uforpliktende."}
          </p>

          <Link
            style={{
              background:
                config.site === "MinelSol"
                  ? "red"
                  : "linear-gradient(90deg, #FF9D00 23%, #FFD05A 92%)",
              color: config.site === "MinelSol" ? "white" : "black",
            }}
            className="solcelleknapp max-w-sm funky p-2 rounded-md flex flex-row gap-2 justify-center hover:!bg-white hover:!text-black duration-1000"
            href={"/solkart"}
          >
            <h2>Prøv vår solcellekalkulator</h2>
            {!isMinel && <img src="/search.png" className="w-6 self-center" />}
          </Link>
        </div>

        {!isMinel && <div className="blackFade2"></div>}
      </section>

      <section className="bg-black py-24">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="funkysubtitleWhite w-fit md:text-center md:self-center">
            {config.solar?.header || "undefined"}
          </h2>
          <h3 className="text-white font-medium md:text-center xl:text-3xl">
            {config.solar?.header2 || "Utforsk våre solcelleløsninger"}
          </h3>
          <h4 className="text-white md:max-w-4xl md:self-center md:text-center text-xl">
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
        {!isMinel && <div className="blackFade"></div>}

        <div className="mx-4 my-20 xl:px-48">
          <h4 className="opacity-50 text-xl">
            {config.blog?.header || "Utforsk..."}
          </h4>
          <h3 className="mt-2 mb-8 text-3xl">
            {config.blog?.header2 || "Våre blogg innlegg"}
          </h3>
          <Link
            href="/blog"
            className="border-black border-2 rounded-md text-black py-2 px-8 hover:bg-black hover:text-white duration-500"
          >
            {config.blog?.buttonText || "Se alle blogg innlegg"}
          </Link>
        </div>

        <BlogCarousel />
      </section>

      <section className="px-4 py-12" id="faq">
        <h3 className="md:text-center md:text-3xl">
          {config.faq?.header || "Ofte stilte spørsmål"}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 md:max-w-7xl md:mx-auto md:gap-8 mt-12">
          <Dropdown
            title={config.faq?.title1 || "Hva slags solceller bruker dere?"}
            description={
              config.faq?.description1 ||
              "Solcellemarkedet er i kontinuerlig utvikling – akkurat som med smarttelefoner, kommer det stadig nye og bedre modeller. Derfor jobber vi hele tiden for å finne de mest effektive panelene på markedet, slik at du får den beste løsningen. Kontakt oss gjerne for et uforpliktende tilbud på dagens mest gunstige solcellepaneler. Som med de fleste gode investeringer, er den beste tiden å investere «i går» – men den nest beste tiden er i dag."
            }
          />
          <Dropdown
            title={config.faq?.title2 || "Følger det med noen garanti?"}
            description={
              config.faq?.description2 ||
              "Vi står ansvarlig for ditt solcelleanlegg og vil være her for deg i lang tid fremover. Selv om solcellemarkedet kan svinge, er vi et elektrofirma med flere ben å stå på. Flere av panelene våre leveres med 30 års produktgaranti og 30 års effektgaranti – alltid inkludert i prisen, uten ekstra kostnad."
            }
          />
          <Dropdown
            title={config.faq?.title3 || "Må solceller vedlikeholdes?"}
            description={
              config.faq?.description3 ||
              "Moderne solceller har en overflatebehandling som gjør dem hydrofobe (avstøter vann) og mindre mottakelige for smuss. Når det regner, vil vannet perle seg og ta med seg støv og skitt ned fra panelene. Denne effekten regnes ofte som selvrensende, men den er ikke 100 % effektiv – særlig i områder med mye støv, pollen eller fugleskitt. I slike tilfeller kan det være lurt å vurdere en forsiktig rengjøring et par ganger i året, for eksempel med myk kost og vann (uten sterke kjemikalier). For de fleste vil imidlertid normal nedbør og værforhold være tilstrekkelig til å holde solcellene rene."
            }
          />
          <Dropdown
            title={config.faq?.title4 || "Snø på solcellepanelene?"}
            description={
              config.faq?.description4 ||
              "Vi er lite bekymret for snø på solcellepanelene. Kjølige temperaturer gir gode produksjonsforhold, og i tillegg kan snøen rundt panelene bidra til økt refleksjon av sollyset. Dersom panelene dekkes av snø, vil produksjonen selvsagt kunne reduseres noe, men fordi overflatene er glatte, sklir snøen ofte raskt av. Hvis snøen skulle bli liggende en stund, anbefaler vi likevel å la den ligge. Det kan være farlig å bevege seg på taket uten riktig sikring og utstyr!"
            }
          />
          <Dropdown
            title={config.faq?.title5 || "Hvor egner det seg med solceller?"}
            description={
              config.faq?.description5 ||
              "Sørvendte takflater gir vanligvis den høyeste årlige strømproduksjonen, med toppytelse midt på dagen. Øst- og vestvendte tak gir på sin side mer strømproduksjon om morgenen og ettermiddagen, noe som gir en jevnere fordeling av produksjonen gjennom dagen. Selv om den totale årsproduksjonen kan være noe lavere på disse takflatene, kan det være en fordel dersom du har størst forbruk i de tidlige morgentimene eller på ettermiddag/kveld. Dette prinsippet gjelder uansett taktype – enten du har en bolig, låve eller et industribygg med flatt tak."
            }
          />
          <Dropdown
            title={config.faq?.title6 || "Solceller med batterilagring"}
            description={
              config.faq?.description6 ||
              "Ja, solceller kan fint kombineres med et batterilagringssystem. Dette gir deg muligheten til å lagre overskuddsstrøm når solcellene produserer mer energi enn du forbruker der og da. Strømmen kan så brukes på kveldstid, i perioder med lavere solinnstråling, eller når strømprisene er høyere. Et batterilagringssystem bidrar dermed til høyere egenforbruk av solenergi og kan gi deg bedre kontroll over energikostnadene dine. Det finnes ulike batteriteknologier og systemløsninger på markedet, og det kan være lurt å vurdere faktorer som pris, kapasitet, levetid og garantivilkår når du velger løsning."
            }
          />
        </div>
      </section>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        config={config}
      />
    </main>
  );
}

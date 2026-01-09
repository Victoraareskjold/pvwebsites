"use client";

export default function PurchaseTerms() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-12">
      <h2 className="my-4">KJØPSBETINGELSER</h2>
      <h3>Vilkår og forutsetninger for installasjon av solcelleanlegg</h3>
      <p>
        Disse kjøpsbetingelsene beskriver viktige forutsetninger knyttet til
        installasjon av solcelleanlegg, og er ment for å gi forutsigbarhet for
        både kunde og installatør.
      </p>

      <div className="dividerFull"></div>

      <h2 className="my-4">1. Tak og montering</h2>
      <ul className="list-disc list-inside my-4">
        <li>
          Ved montering på ståltak kan det forekomme mindre merker, riper eller
          nedtråkk som følge av arbeidet.
        </li>
        <li>
          Ved tak med takstein må det tilpasses spor for innfesting av
          solcelleanlegget. Dette kan påvirke garantien på taksteinen.
        </li>
        <li>
          Kunden må sørge for tilgjengelig reservetakstein under monteringen, i
          tilfelle skade eller brudd.
        </li>
        <li>
          Dersom takstein er festet med skruer eller spiker, kan det påløpe
          ekstra kostnader.
        </li>
        <li>
          Tilbudet forutsetter at takkonstruksjonen er bygget i henhold til
          nyere standarder (for eksempel cc 60 takstoler), om ikke annet er
          beskrevet i tilbudet.
        </li>
        <li>
          Ved takshingel må festepunktene tettes av taktekker. Dette arbeidet er
          ikke inkludert i tilbudet, med mindre annet er avtalt.
        </li>
        <li>
          Kunden er ansvarlig for eventuell demontering av snøfangere før
          installasjon, med mindre annet er avtalt.
        </li>
        <li>
          Det forutsettes at det er mulig å sette opp stillas ved bygget der
          anlegget skal installeres.
        </li>
        <li>
          Ved integrerte solcellepaneler kreves det snekkerarbeid i forbindelse
          med demontering og tilpasning av takstein rundt panelene. Dette
          arbeidet er ikke inkludert i leveransen, om ikke annet er beskrevet i
          tilbudet.
        </li>
      </ul>

      <div className="dividerFull"></div>

      <h2 className="my-4">2. Solcelleanlegg og ytelse</h2>
      <ul className="list-disc list-inside my-4">
        <li>
          Antall solcellepaneler kan bli justert etter endelige mål på taket,
          eventuelle hindringer og gjeldende tekniske krav.
        </li>
        <li>
          Solcelleutstyret leveres med produsentens egne garantier, som kommer i
          tillegg til kjøpslovens bestemmelser.
        </li>
        <li>
          Oppgitt energiproduksjon er et estimat. Faktorer som takets retning,
          vinkel, skyggeforhold, piper og snøfangere kan påvirke faktisk
          produksjon.
        </li>
        <li>
          Dersom taket har skyggeforhold, kan bruk av optimizer være aktuelt for
          å forbedre produksjonen. Dette er tilleggsutstyr.
        </li>
        <li>
          Inverterens kapasitet kan være lavere enn samlet panelkapasitet. Dette
          er en vanlig løsning for å oppnå best mulig totaløkonomi gjennom året.
        </li>
        <li>
          Plassering av inverter bestemmes av installatør i henhold til tekniske
          krav og monteringsanvisninger.
        </li>
        <li>Det må påregnes noe viftestøy fra inverteren.</li>
        <li>
          Det forutsettes god WiFi-dekning ved inverteren for stabil drift og
          tilgang til overvåkingsapp.
        </li>
        <li>
          WiFi-navn og passord må kun inneholde bokstaver og tall, og må deles
          med installatør før oppstart.
        </li>
        <li>
          Utstyret leveres normalt 1–2 uker før installasjon. Kunden må sørge
          for egnet lagringsplass til 1–2 paller, gjerne tildekket med
          presenning.
        </li>
      </ul>

      <div className="dividerFull"></div>

      <h2 className="my-4">3. Elektrisk installasjon</h2>
      <ul className="list-disc list-inside my-4">
        <li>
          Det forutsettes tilstrekkelig plass i sikringsskapet, samt at
          overspenningsvern er installert.
        </li>
        <li>
          Installatør avgjør føringsvei for kabler mellom sikringsskap, inverter
          og tak.
        </li>
        <li>
          Eventuell produksjonsstans som følge av jordfeil eller spenningsavvik
          i strømnettet ligger utenfor installatørens ansvarsområde.
        </li>
      </ul>

      <div className="dividerFull"></div>

      <h2 className="my-4">Kort sagt</h2>
      <p>
        Disse vilkårene er laget for å sikre en trygg og ryddig gjennomføring av
        installasjonen, og for å tydeliggjøre hvilke forutsetninger som gjelder.
      </p>
    </div>
  );
}

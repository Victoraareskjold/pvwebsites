"use client";
import { useSiteConfig } from "../../../contexts/siteConfigContext";
export default function PrivacyStatement() {
  const config = useSiteConfig();
  return (
    <div className="min-h-screen pt-24 pb-12 px-12">
      <h2>PERSONVERNERKLÆRING</h2>
      <h3>Behandlingsansvarlig</h3>
      <p>
        Vår virksomhet (heretter «vi» eller «oss») er behandlingsansvarlig for
        personopplysningene som beskrives i denne personvernerklæringen. Her
        forklarer vi hvilke opplysninger vi samler inn, hvorfor vi gjør det og
        hvordan vi behandler dem. Denne erklæringen gjelder for alle våre
        tjenester og produkter, inkludert nettsider og eventuelle applikasjoner.
      </p>
      <div className="dividerFull"></div>
      <h2>Personopplysninger vi samler inn og behandler</h2>
      <h3>Vi behandler følgende kategorier av personopplysninger:</h3>
      <ul>
        <li>
          <span className="bold">Grunnleggende informasjon:</span> Navn og
          fødselsdato.
        </li>
        <li>
          <span className="bold">Kontaktinformasjon:</span> Adresse,
          telefonnummer og e-postadresse.
        </li>
        <li>
          <span className="bold">Konto-</span> og profilinformasjon:
          Innstillinger, preferanser o.l.
        </li>
        <li>
          <span className="bold">Betalingsinformasjon:</span>{" "}
          Transaksjonsinformasjon og betalingsmiddel.
        </li>
        <li>
          <span className="bold">Kundeaktivitet:</span> Lese- og
          handlingshistorikk på våre nettsider eller i eventuell app, samt
          teknisk informasjon om enhetene du bruker.
        </li>
        <li>
          <span className="bold">Cookies:</span> Vi lagrer kun informasjon du
          sender til oss via kontaktskjema, eller som genereres når du bruker
          våre digitale løsninger.
        </li>
      </ul>
      <p>
        I de fleste tilfeller samler vi inn opplysningene direkte fra deg, eller
        de genereres når du benytter deg av våre tjenester og produkter.
      </p>
      <div className="dividerFull"></div>
      <h2>Hvordan vi bruker personopplysningene</h2>
      <ol>
        <li>
          <p className="bold">For å oppfylle avtaler</p>
          <p>
            Vi behandler personopplysninger for å kunne levere produkter og
            tjenester du har bestilt. Det rettslige grunnlaget er at
            behandlingen er nødvendig for å oppfylle en avtale med deg.
          </p>
        </li>
        <li>
          <p className="bold">
            Analyse, forretningsutvikling og forbedring av tjenester
          </p>
          <p>
            Vi jobber kontinuerlig med å videreutvikle og forbedre tjenestene og
            produktene våre. Analyse av kundehistorikk, konto- og
            profilinformasjon er eksempler på dette. Det rettslige grunnlaget er
            vår berettigede interesse.
          </p>
        </li>
        <li>
          <p className="bold">Tilpasset brukeropplevelse</p>
          <p>
            Vi bruker personopplysninger for å tilpasse brukeropplevelsen og
            kommunikasjonen basert på ditt kundeforhold. Det rettslige
            grunnlaget er vår berettigede interesse.
          </p>
        </li>
        <li>
          <p className="bold">Salg og markedsføring</p>
          <p>
            Personopplysninger benyttes i forbindelse med salg og markedsføring
            av våre produkter og tjenester, for eksempel ved utsendelse av
            e-post. Det rettslige grunnlaget er vår berettigede interesse. Du
            kan reservere deg mot å motta slik kommunikasjon. I tillegg kan vi
            be om ditt samtykke til å utføre profilering, slik at du kun mottar
            mest mulig relevant markedsføring.
          </p>
        </li>
        <li>
          <p className="bold">Systemovervåking og feilretting</p>
          <p>
            Vi overvåker systemene våre for å avdekke feil og problemer. Noe av
            denne behandlingen av personopplysninger skjer for å sikre stabil
            drift. Det rettslige grunnlaget er vår berettigede interesse.
          </p>
        </li>
        <li>
          <p className="bold">
            Sikkerhet, avdekking av svindel og kriminelle handlinger
          </p>
          <p>
            Vi behandler personopplysninger for å beskytte brukere og oss selv
            mot svindel, misbruk og kriminelle handlinger. Det rettslige
            grunnlaget er vår berettigede interesse.
          </p>
        </li>
        <li>
          <p className="bold">Overholde rettslige forpliktelser</p>
          <p>
            Enkelte lovpålegg innebærer at vi må behandle og lagre
            personopplysninger, for eksempel i forbindelse med regnskap etter
            bokføringsloven. Det rettslige grunnlaget er at behandlingen er
            nødvendig for å oppfylle en rettslig forpliktelse.
          </p>
        </li>
      </ol>
      <div className="dividerFull"></div>
      <h2>Dine rettigheter</h2>
      <p>
        Dersom du ønsker å utøve dine rettigheter, kan du kontakte oss på
        e-post:{" "}
        <a href={`mailto:config.footer?.email`}>
          {config.footer?.email || null}
        </a>
      </p>
      <ol>
        <li>
          <p className="bold">Rett til innsyn</p>
          <p>Du kan be om en kopi av alle opplysninger vi behandler om deg.</p>
        </li>
        <li>
          <p className="bold">Rett til korrigering</p>
          <p>
            Du har rett til å få korrigert eller supplert uriktige eller
            misvisende opplysninger.
          </p>
        </li>
        <li>
          <p className="bold">Rett til sletting</p>
          <p>
            Du kan be om at personopplysninger slettes. Vær oppmerksom på at
            enkelte lovpålagte oppbevaringskrav kan hindre fullstendig sletting
            (f.eks. bokføringsloven).
          </p>
        </li>
        <li>
          <p className="bold">Rett til begrensning av behandling</p>
          <p>
            I visse situasjoner kan du be oss begrense behandlingen av
            opplysninger om deg, for eksempel ved å administrere samtykker eller
            reservasjoner i våre løsninger.
          </p>
        </li>
        <li>
          <p className="bold">Rett til protest</p>
          <p>
            Behandler vi opplysninger om deg basert på en interesseavveining,
            kan du protestere på dette.
          </p>
        </li>
        <li>
          <p className="bold">Rett til dataportabilitet</p>
          <p>
            Du har rett til å få utlevert personopplysninger om deg i et
            strukturert, alminnelig anvendt og maskinlesbart format.
          </p>
        </li>
      </ol>
      <div className="dividerFull"></div>
      <h2>Klage</h2>
      <p>
        Hvis du mener at vi ikke overholder personopplysningsloven, håper vi at
        du tar kontakt slik at vi kan finne en løsning sammen. Du kan også klage
        direkte til Datatilsynet dersom du mener våre rutiner bryter gjeldende
        regelverk.
      </p>

      <div className="dividerFull"></div>

      <ul>
        <li>
          <span className="bold">Oppadert:</span> Disse personvern- og
          kjøpsbetingelsene kan oppdateres uten forvarsel. Vi anbefaler derfor
          at du jevnlig sjekker våre nettsider for eventuelle endringer.
        </li>
      </ul>
      <ul>
        <li>
          <p className="bold">Takk for at du valgte våre tjenester!</p>
          <p>
            Vi jobber kontinuerlig for å tilby en sikker, transparent og
            profesjonell opplevelse. Dersom du har spørsmål, er du velkommen til
            å ta kontakt.
          </p>
        </li>
      </ul>
    </div>
  );
}

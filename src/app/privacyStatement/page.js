"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";
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
      <h2>KJØPSBETINGELSER</h2>

      <p>
        Nedenstående betingelser gjelder for salg av varer og tjenester til
        forbrukere i henhold til forbrukerkjøpsloven og/eller
        håndverkertjenesteloven og/eller bustadsoppføringslova.
      </p>
      <br />
      <p className="bold">1) Anvendelsesområde</p>
      <p>
        Disse kjøps- og leveringsbetingelsene gjelder elektrikerarbeid, levering
        av elektrisk utstyr og materiell samt installering av slikt utstyr. For
        kjøp eller oppdrag som ikke er forbrukerforhold, gjelder egne
        betingelser.
      </p>
      <div className="dividerFull"></div>
      <p className="bold">2) Generelt</p>
      <ul>
        <li>
          Arbeidene utføres i tråd med gjeldende forskrifter og standarder, slik
          at du som kunde skal føle deg trygg på kvaliteten.
        </li>
        <li>
          Fakturering skjer som hovedregel etter gjeldende priser i henhold til
          avtalt prisliste, tilbud eller prisoverslag.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">3) Fakturering og betalingsbetingelser</p>
      <ul>
        <li>
          Faktura sendes normalt på e-post hvis ikke annet er avtalt. Velger du
          å motta faktura på papir, kan gebyr forekomme.
        </li>
        <li>
          Faktura har 10 dagers betalingsfrist dersom ikke annet er avtalt
          skriftlig.
        </li>
        <li>
          Ved for sen betaling påløper purregebyr og lovpålagt
          forsinkelsesrente.
        </li>
        <li>
          Vi kan stanse arbeidet ved manglende betaling av a-konto- eller
          delfaktura.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">4) Timebruk og medgått tid</p>
      <ul>
        <li>
          Medgått tid inkluderer kjøring til og fra oppdraget, henting av
          produkter, eventuelt saksbehandling, dokumentasjon, anskaffelser og
          andre forhold som er nødvendige for å gjennomføre oppdraget.
        </li>
        <li>
          Ventetid eller forsinkelser forårsaket av andre håndverkere eller
          aktører vil også bli fakturert.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">5) Materiell</p>
      <ul>
        <li>
          Dersom du som kunde ønsker å skaffe materiell selv, må produktet ha
          tilfredsstillende dokumentasjon og godkjenninger.
        </li>
        <li>
          Vi forbeholder oss retten til å fakturere ekstra for tiden som medgår
          dersom produktene du skaffer ikke samsvarer med kravene.
        </li>
        <li>
          Vi yter ikke garanti på produkter vi ikke selv har fakturert, og det
          er ingen retur- eller tilbakekjøpsrett hos oss for slikt materiell.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">6) Tilbud og prisoverslag</p>
      <ul>
        <li>
          Tilbud er gyldige i 14 dager fra tilbudsdato, med mindre annet er
          avtalt skriftlig.
        </li>
        <li>
          Etter fristens utløp anses tilbud kun som uforpliktende prisantydning.
        </li>
        <li>
          Ved fastpris kreves at minst 80 % av tilbudet bestilles og utføres for
          at fastprisen skal være gyldig.
        </li>
        <li>
          Fastpriser forutsetter at arbeidet utføres sammenhengende og rasjonelt
          i ordinær arbeidstid.
        </li>
        <li>
          Eventuelle forbehold fra deg som kunde må skriftlig fremsettes sammen
          med aksepten av tilbudet.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">7) Avbestilling</p>
      <ul>
        <li>
          Ved avbestilling av arbeid eller produkter faktureres påløpte
          kostnader og eventuelle returkostnader.
        </li>
        <li>
          Avbestilling mindre enn én arbeidsdag før avtalt tid medfører
          fakturering av minstepris i henhold til vår prisliste.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">8) Kredittvurdering</p>
      <p>
        Vi kan foreta en kredittvurdering av deg før arbeidet igangsettes.
        Dersom vurderingen viser at du ikke anses betalingsdyktig, kan vi heve
        avtalen uten kostnad for oss.
      </p>
      <div className="dividerFull"></div>
      <p className="bold">9) Eiendomsrett</p>
      <p>
        Materiale og utstyr forblir vår eiendom inntil full betaling er mottatt,
        jf. panteloven § 3-17.
      </p>
      <div className="dividerFull"></div>
      <p className="bold">10) Reklamasjon og garanti</p>
      <ul>
        <li>Du må reklamere på faktura innen åtte dager fra mottak.</li>
        <li>
          Eventuelle a-konto- eller delfakturaer vil forfalle til betaling 10
          dager etter fakturadato dersom ikke annet er avtalt.
        </li>
        <li>
          Vi garanterer for utført arbeid i 12 måneder fra ferdigstillelse, med
          mindre annet er avtalt skriftlig.
        </li>
        <li>
          Reklamasjon på utført arbeid eller leverte produkter må skje uten
          ugrunnet opphold.
        </li>
        <li>
          Vår erstatningsplikt omfatter reparasjon eller omlevering av defekte
          varer. Vi er ikke ansvarlige for indirekte tap med mindre vi har
          opptrådt uaktsomt.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">11) Dokumentasjon</p>
      <ul>
        <li>
          Dokumentasjon sendes normalt digitalt (f.eks. via en nettportal)
          dersom dette er tilgjengelig for eiendommen.
        </li>
        <li>
          Dersom dokumentasjonen går tapt og du trenger ny kopi, kan dette
          faktureres i henhold til gjeldende prisliste.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">12) Garanti utover lovfestede rettigheter</p>
      <ul>
        <li>
          Som en service kan vi i enkelte tilfeller tilby utvidet produktgaranti
          (f.eks. 5 år) når produktets forventede levetid er lengre enn dette.
        </li>
        <li>
          Garantien forutsetter at produktet er kjøpt og montert gjennom oss.
        </li>
        <li>
          Garantien gjelder ikke følgeskader og bortfaller dersom produktet er
          skadet som følge av feil bruk, ytre påvirkninger eller feil ved
          eksisterende installasjon.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">13) Forbehold om byggetekniske begrensninger</p>
      <ul>
        <li>
          Vi tar forbehold om at byggetekniske forhold kan medføre ekstra
          kostnader, forsinkelser eller hindre enkelte løsninger.
        </li>
        <li>
          Oppdages slike forhold etter at avtale er inngått, gir det grunnlag
          for justering av pris.
        </li>
        <li>
          Slissing, større hulltaking eller andre bygningsmessige arbeider er
          ikke inkludert i tilbud med mindre dette er spesifisert.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">14) Opprydding</p>
      <ul>
        <li>
          Vi foretar vanlig opprydding og fjerning av emballasje etter endt
          arbeid.
        </li>
        <li>
          Vask eller ytterligere renhold utover dette må avtales særskilt.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">15) Tilkoblingsavgifter og nettleie</p>
      <p>
        Eventuelle gebyrer fra myndigheter eller netteier er ikke inkludert i
        våre tilbud.
      </p>
      <div className="dividerFull"></div>
      <p className="bold">16) Bytte av skrusikringer til automatsikringer</p>
      <ul>
        <li>
          Eksisterende jordfeil kan utløse nye jordfeilautomater. Feilsøking og
          utbedring er da ikke inkludert i tilbudet.
        </li>
        <li>
          Automatsikringer kan løse ut tidligere enn gamle skrusikringer som
          ofte tålte høyere belastning.
        </li>
        <li>
          Ved behov for ekstra kurser eller annen oppgradering av anlegget som
          følge av dette, faktureres det etter medgått tid og materiell i
          henhold til gjeldende satser.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">17) Endring til 3-fase</p>
      <ul>
        <li>
          Det forutsettes tilstrekkelig plass i eksisterende sikringsskap for ny
          måler.
        </li>
        <li>
          Eventuelle ombygginger er ikke inkludert med mindre det er spesifisert
          i tilbudet.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <p className="bold">18) Spesialverktøy og ekstrautstyr</p>
      <ul>
        <li>
          Kostnader til spesialverktøy, stige, lift eller lignende er ikke
          inkludert i tilbudet med mindre dette er uttrykkelig beskrevet.
        </li>
      </ul>
      <div className="dividerFull"></div>
      <h3 className="bold">Kontakt</h3>
      <ul>
        <li>
          Har du spørsmål om personvernerklæringen eller kjøpsbetingelsene, kan
          du kontakte oss på:{" "}
          <a href={`mailto:config.footer?.email`}>
            {config.footer?.email || null}
          </a>
        </li>
      </ul>
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

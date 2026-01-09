import Link from "next/link";

export function Footer({
  logo,
  title,
  email,
  address,
  mapsAddress,
  organizationNumber,
  primary,
  secondary,
  site,
}) {
  return (
    <>
      <footer
        id="footer"
        style={{
          color: "#B7B7B7",
          background: "#1E1E1E",
        }}
        className="p-4 xl:px-48"
      >
        <div className="flex w-full flex-col gap-8 mt-8 md:flex-row md:justify-between md:w-4/5 max-w-screen-2xl justify-self-center">
          <div>
            <img src={logo} alt={title || "Logo"} style={{ height: "40px" }} />
            <div className="flex flex-col">
              <Link href="/personvern" target="_blank">
                Personvernerklæring
              </Link>
              <Link
                href={
                  site === "MinelSol"
                    ? "https://minel.no/personvernerklaering"
                    : "/kjopsbetingelser"
                }
                target="_blank"
              >
                kjøpsbetingelser
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <h2
                style={{ color: secondary || "white" }}
                className="font-medium"
              >
                Solcelleløsning
              </h2>
              <Link href="/solceller/landbruk">Landbruk</Link>
              <Link href="/solceller/bedrift">Bedrift</Link>
              <Link href="/solceller/enebolig-hytte">Enebolig/Hytte</Link>
              <Link href="/solceller/borettslag">Borettslag</Link>
            </div>
            <div className="flex flex-col">
              <h2
                style={{ color: secondary || "white" }}
                className="font-medium"
              >
                Relevante lenker
              </h2>
              <Link href="/omoss">Om oss</Link>
              <Link href="/blog">Blogg</Link>
              <a href="/kontakt">Elektriker</a>
              <button className="w-fit" id="revoke-consent-btn">
                Cookie Innstillinger
              </button>
            </div>
          </div>
          <div className="md:flex md:flex-col md:gap-6">
            <div>
              <h2
                style={{ color: secondary || "white" }}
                className="font-medium"
              >
                E-post:
              </h2>
              <a className="underline" href={`mailto:${email}`}>
                <h4>{email}</h4>
              </a>
            </div>
            <div>
              <h2
                style={{ color: secondary || "white" }}
                className="font-medium"
              >
                Telefon:
              </h2>
              <a className="underline" href="tel:+4745871718">
                <h4>+47 458 71 718</h4>
              </a>
            </div>
            <div>
              <h2
                style={{ color: secondary || "white" }}
                className="font-medium"
              >
                Adresse
              </h2>
              <h4>{address}</h4>
            </div>
            <div>
              <h2
                style={{ color: secondary || "white" }}
                className="font-medium"
              >
                Organisasjonsnummer:
              </h2>
              <h4>{organizationNumber}</h4>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

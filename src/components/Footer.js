"use client";

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
}) {
  return (
    <footer
      style={{
        color: "#B7B7B7",
        background: "#1E1E1E",
      }}
      className="p-4 xl:px-48"
    >
      <img src={logo} alt={title || "Logo"} style={{ height: "40px" }} />
      <div className="flex flex-col gap-8 mt-8 md:flex-row md:justify-between md:w-4/5">
        <div>
          <Link href="/privacyStatement">Personvernerklæring</Link>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <h2 style={{ color: secondary || "white" }} className="font-medium">
              Solcelleløsning
            </h2>
            <Link href="slide/landbruk">Landbruk</Link>
            <Link href="slide/bedrift">Bedrift</Link>
            <Link href="slide/enebolig-hytte">Enebolig/Hytte</Link>
            <Link href="slide/borettslag">Borettslag</Link>
          </div>
          <div className="flex flex-col">
            <h2 style={{ color: secondary || "white" }} className="font-medium">
              Relevante lenker
            </h2>
            <Link href="/about">Om oss</Link>
            <Link href="/blog">Blogg</Link>
            <a href="/contact">Elektriker</a>
          </div>
        </div>
        <div className="md:flex md:flex-col md:gap-6">
          <div>
            <h2 style={{ color: secondary || "white" }} className="font-medium">
              E-post:
            </h2>
            <a className="underline" href={`mailto:${email}`}>
              <h4>{email}</h4>
            </a>
          </div>
          <div>
            <h2 style={{ color: secondary || "white" }} className="font-medium">
              Telefon:
            </h2>
            <a className="underline" href="tel:+4745871718">
              <h4>+47 458 71 718</h4>
            </a>
          </div>
          <div>
            <h2 style={{ color: secondary || "white" }} className="font-medium">
              Adresse
            </h2>
            <h4>{address}</h4>
          </div>
          <div>
            <h2 style={{ color: secondary || "white" }} className="font-medium">
              Organsiasjonsnummer:
            </h2>
            <h4>{organizationNumber}</h4>
          </div>
        </div>
      </div>
    </footer>
  );
}

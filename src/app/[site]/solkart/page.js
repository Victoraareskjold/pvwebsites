import SolkartClient from "./SolkartClient";

export default async function Solkart({ params }) {
  const { site } = await params;

  return <SolkartClient site={site} />;
}

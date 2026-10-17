import "../../../../estimate.css";
import KjoepsavtaleView from "./kjoepsavtaleView";

export default async function Kjoepsavtale({ params, searchParams }) {
  const { estimateId } = await params;
  // Kundens valg fra tilbudssiden (hybrid/batteri), f.eks. «battery:<modell>:12»
  const { valg } = (await searchParams) ?? {};

  return <KjoepsavtaleView estimateId={estimateId} choice={typeof valg === "string" ? valg : ""} />;
}

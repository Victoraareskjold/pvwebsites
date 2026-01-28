import "../../../../estimate.css";
import KjoepsavtaleView from "./kjoepsavtaleView";

export default async function Kjoepsavtale({ params }) {
  const { estimateId } = await params;

  return <KjoepsavtaleView estimateId={estimateId} />;
}

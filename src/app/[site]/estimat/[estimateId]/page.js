import EstimateView from "../../../../components/EstimateView";
import { Suspense } from "react";

export default async function Page({ params }) {
  const { estimateId } = await params;

  return (
    <main className="pt-24 " style={{ backgroundColor: "#FFF7E4" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <EstimateView estimateId={estimateId} />
      </Suspense>
    </main>
  );
}

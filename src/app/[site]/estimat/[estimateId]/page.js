import EstimateView from "../../../../components/EstimateView";
import "../../../../components/estimate/offerLayout.css";
import { Suspense } from "react";

export default async function Page({ params }) {
  const { estimateId } = await params;

  return (
    <main className="pt-24 offer-page">
      <Suspense fallback={<div>Loading...</div>}>
        <EstimateView estimateId={estimateId} />
      </Suspense>
    </main>
  );
}

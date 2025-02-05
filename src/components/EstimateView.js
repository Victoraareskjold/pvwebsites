"use client";

import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";

export default function EstimateView({ estimateId }) {
  const {
    data: estimateData,
    error,
    loading,
  } = useFirestoreDoc(db, "estimates", estimateId);

  if (loading) {
    return (
      <div className="min-h-screen text-center flex justify-center items-center">
        Laster inn estimat..
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-center flex justify-center items-center">
        <p>Feil: {error?.message}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="p-4">
        <p>{estimateData?.address}</p>
        <p>{estimateData?.customerName}</p>
      </section>

      {estimateData && <pre>{JSON.stringify(estimateData, null, 2)}</pre>}
    </main>
  );
}

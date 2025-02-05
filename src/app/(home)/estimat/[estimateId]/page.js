import EstimateView from "@/components/EstimateView";

export default async function Page({ params }) {
  const { estimateId } = await params;
  return (
    <main className="py-24">
      <EstimateView estimateId={estimateId} />
    </main>
  );
}

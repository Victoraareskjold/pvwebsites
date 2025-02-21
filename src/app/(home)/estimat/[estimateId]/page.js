import EstimateView from "@/components/EstimateView";

export default async function Page({ params }) {
  const { estimateId } = await params;
  return (
    <main className="pt-24 pb-12" style={{ backgroundColor: "#FFF7E4" }}>
      <EstimateView estimateId={estimateId} />
    </main>
  );
}

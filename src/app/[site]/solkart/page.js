export default async function Solkart({ params }) {
  const { site } = await params;
  console.log(site);

  return (
    <div style={{ backgroundColor: "#1E1E1E" }} className="h-full">
      <iframe
        src={`https://pvmap.vercel.app/?site=${site}`}
        className="h-full lg:!pb-0"
        width="100%"
        style={{ paddingTop: "86px" }}
      />
    </div>
  );
}

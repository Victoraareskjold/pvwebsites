export default async function Solkart({ params }) {
  const res = await params;
  console.log(res);

  return (
    <div style={{ backgroundColor: "#1E1E1E" }} className="h-full">
      <iframe
        src={`https://pvmap.vercel.app/?site=${res.site}`}
        className="h-full lg:!pb-0"
        width="100%"
        style={{ paddingTop: "86px" }}
      />
    </div>
  );
}

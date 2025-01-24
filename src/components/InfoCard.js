export function InfoCard({ number, title, description }) {
  return (
    <div className="border-2 border-white p-8 xl:p-10 relative rounded-md md:h-80">
      <h2 className="absolute top-2 left-3 text-orange-300 xl:text-2xl">
        {number || null}.
      </h2>
      <h3 className="font-medium mb-4 xl:text-3xl">{title || null}</h3>
      <h4 className="font-regular xl:text-xl">{description || null}</h4>
    </div>
  );
}

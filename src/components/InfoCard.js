export function InfoCard({ number, title, description }) {
  return (
    <div className="border-2 border-white p-8 relative rounded-md md:h-80">
      <h2 className="absolute top-2 left-3 text-orange-300">
        {number || null}.
      </h2>
      <h4 className="font-medium mb-4">{title || null}</h4>
      <p className="font-regular">{description || null}</p>
    </div>
  );
}

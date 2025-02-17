export default function EstimatePricingInfo({ image, number, text }) {
  return (
    <div className="border-2 border-black rounded-xl w-full px-12 py-4 pt-12 relative">
      <img
        src={image || "/search.png"}
        className="h-16 w-16 absolute top-[-2rem] left-1/2 -translate-x-1/2"
      />
      <h2 className="text-center mb-4">Kr {number}</h2>
      <p className="text-center">{text}</p>
    </div>
  );
}

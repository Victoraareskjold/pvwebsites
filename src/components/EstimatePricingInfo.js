export default function EstimatePricingInfo({ image, number, text }) {
  return (
    <div className="bg-white shadow-lg rounded-xl w-full px-4 py-8 justify-center flex flex-col">
      <img
        src={image || "/search.png"}
        className="h-16 w-16 self-center object-contain"
      />
      <h2 className="text-center my-2">{number}</h2>
      <p className="text-center">{text}</p>
    </div>
  );
}

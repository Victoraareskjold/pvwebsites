import Image from "next/image";

export function EstimateInfoComponent({ text, number, image }) {
  return (
    <div className="flex flex-row justify-between items-center gap-16">
      <p className="bg-orange-200 p-4 rounded-2xl border-2 border-orange-300 w-full">
        {text || "Missing text"} <strong>{number || "Missing number"}</strong>
      </p>
      <div className="relative w-20 h-16">
        <Image
          alt="bilde"
          src={image || "/search.png"}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

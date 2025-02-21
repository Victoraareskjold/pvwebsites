import Image from "next/image";

export function EstimateInfoComponent({ text, number, image }) {
  return (
    <div className="flex flex-row justify-between items-center gap-16">
      <li className="p-2 w-full">
        <strong>{number || "Missing number"}</strong> {text || "Missing text"}
      </li>
      {/* <div className="relative w-20 h-16">
        <Image
          alt="bilde"
          src={image || "/search.png"}
          fill
          className="object-contain"
        />
      </div> */}
    </div>
  );
}

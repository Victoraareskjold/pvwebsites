import Link from "next/link";

export function EstimateInfoComponent({
  text,
  number,
  finished,
  type,
  attachmentUrl,
}) {
  return (
    <div
      className={`flex justify-between  ${finished ? "flex-col" : "flex-row items-center gap-16"}`}
    >
      {finished && type && <p className="text-gray-600 !text-sm">{type}</p>}
      <li className={`p-2 w-full ${finished ? "flex justify-between" : ""}`}>
        <p>
          <strong className="font-bold">{number || ""}</strong>{" "}
          {text || "Missing text"}
        </p>
        {finished && attachmentUrl && (
          <Link
            href={attachmentUrl}
            target="_blank"
            className="underline bg-[#666666] text-white px-3 py-1 text-xs font-semibold rounded-md"
          >
            {type === "INSTALLERT EFFEKT (KWP)"
              ? "Åpne simulering"
              : "Åpne produktark"}
          </Link>
        )}
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

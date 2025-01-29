import Link from "next/link";

export function RoofCapacityButton() {
  return (
    <Link
      href="/#pvmap"
      className="bg-white p-4 rounded-md text-black md:w-full md:max-w-xl flex flex-row gap-2 justify-center hover:bg-black hover:text-white duration-500"
    >
      <p className="m-0 font-bold">Sjekk din takkapasitet</p>
      <img src="/search.png" className="w-6 self-center" />
    </Link>
  );
}

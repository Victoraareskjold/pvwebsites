import { useSiteConfig } from "../contexts/siteConfigContext";
export function EstimateButton({ setModalOpen }) {
  const config = useSiteConfig();
  return (
    <button
      onClick={setModalOpen}
      style={{
        background:
          config.primaryGradient?.bg ||
          "linear-gradient(90deg, #FF9D00 23%, #FFD05A 92%)",
      }}
      //
      className="p-2 rounded-md text-white md:border-2 border-white md:max-w-96 md:w-full text-center md:hover:!bg-white md:hover:!text-black duration-500"
    >
      <h2>{config.estimateBtn?.text || "Jeg ønsker tilbud"}</h2>
    </button>
  );
}

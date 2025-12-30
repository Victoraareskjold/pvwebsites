import { useSiteConfig } from "../contexts/siteConfigContext";
export function EstimateButton2({ setModalOpen }) {
  const config = useSiteConfig();
  return (
    <button
      onClick={setModalOpen}
      style={{
        background: "linear-gradient(90deg, #FF9D00 23%, #FFD05A 92%)",
      }}
      className="solcelleknapp max-w-sm funky p-2 rounded-md text-black flex flex-row gap-2 md:max-w-96 md:w-full justify-center hover:!bg-black hover:!border-white hover:!border-2 "
    >
      <h2
        style={{ color: config.primaryGradient?.textColor || "white" }}
        className="md:!text-white"
      >
        {config.estimateBtn?.text || "Jeg ønsker tilbud"}
      </h2>
    </button>
  );
}

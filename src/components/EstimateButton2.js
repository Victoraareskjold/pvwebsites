import { useSiteConfig } from "../contexts/siteConfigContext";
export function EstimateButton2({ setModalOpen }) {
  const config = useSiteConfig();
  return (
    <button
      onClick={setModalOpen}
      style={{
        background:
          config.primaryGradient?.bg ||
          "linear-gradient(90deg, #FF9D00 23%, #FFD05A 92%)",
      }}
      className="solcelleknapp max-w-sm funky p-2 rounded-md text-white flex flex-row gap-2 md:max-w-96 md:w-full justify-center hover:!bg-black hover:!border-white border-2 duration-1000"
    >
      <h2 style={{ color: "white" }}>
        {config.estimateBtn?.text || "Jeg ønsker tilbud"}
      </h2>
    </button>
  );
}

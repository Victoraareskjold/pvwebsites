import { useSiteConfig } from "../contexts/siteConfigContext";
export function EstimateButton2({ setModalOpen }) {
  const config = useSiteConfig();
  return (
    <button
      onClick={setModalOpen}
      style={{ background: config.primaryGradient?.bg || "black" }}
      className="p-2 rounded-md text-black md:border-2 md:border-white md:!bg-none md:max-w-96 md:w-full text-center md:hover:!bg-black md:hover:!text-white duration-500"
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

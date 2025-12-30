import { useSiteConfig } from "../contexts/siteConfigContext";
export function EstimateButton({ setModalOpen }) {
  const config = useSiteConfig();
  return (
    <button
      onClick={setModalOpen}
      style={{ background: config.primaryGradient?.bg || "black" }}
      className="p-2 rounded-md text-white md:border-2 border-black md:max-w-96 md:w-full text-center md:hover:!bg-white md:hover:!text-black duration-500"
    >
      <h2 className="md:!text-black">
        {config.estimateBtn?.text || "Jeg ønsker tilbud"}
      </h2>
    </button>
  );
}

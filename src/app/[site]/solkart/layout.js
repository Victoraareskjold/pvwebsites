import "../../globals.css";

export const configs = {
  alfaelektrosol: () => import("../../../config/alfaelektro"),
  lynelektrosol: () => import("../../../config/lynelektro"),
  gelektrosol: () => import("../../../config/gelektrosol"),
  minelsol: () => import("../../../config/minelsol"),
  telerorelektrosol: () => import("../../../config/teleror"),
  smartelektrosol: () => import("../../../config/smartelektro"),
  mydlandselektriskesol: () => import("../../../config/mydlands"),
};

export default async function SolkartLayout({ children, params }) {
  const { site } = await params;

  const configModule = site && configs[site] ? await configs[site]() : {};
  const config = configModule.default || {};

  config.language = site === "vestelektro" ? "nn" : "nb";

  // Solkartet fyller resten av vinduet under den faste toppmenyen.
  return <div className="h-[calc(100vh-125px)] min-h-[520px]">{children}</div>;
}

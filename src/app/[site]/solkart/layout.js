import { GoogleTagManager } from "@next/third-parties/google";
import "../../globals.css";
import { SiteConfigProvider } from "../../../contexts/siteConfigContext";
import { Navbar } from "../../../components/Navbar";

export const configs = {
  vestelektro: () => import("../../../config/vestelektro"),
  alfaelektro: () => import("../../../config/alfaelektro"),
  lynelektro: () => import("../../../config/lynelektro"),
  gelektrosol: () => import("../../../config/gelektrosol"),
  minelsol: () => import("../../../config/minelsol"),
  teleror: () => import("../../../config/teleror"),
  smartelektro: () => import("../../../config/smartelektro"),
  mydlands: () => import("../../../config/mydlands"),
};

export default async function SolkartLayout({ children, params }) {
  const { site } = await params;

  const configModule = site && configs[site] ? await configs[site]() : {};
  const config = configModule.default || {};

  config.language = site === "vestelektro" ? "nn" : "nb";

  return (
    <div className="h-[100vh]">
      <SiteConfigProvider config={config}>{children}</SiteConfigProvider>
    </div>
  );
}

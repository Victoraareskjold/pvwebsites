import { GoogleTagManager } from "@next/third-parties/google";
import "../../globals.css";
import { SiteConfigProvider } from "../../../contexts/siteConfigContext";
import { Navbar } from "../../../components/Navbar";

export const configs = {
  vestelektrosol: () => import("../../../config/vestelektro"),
  alfaelektrosol: () => import("../../../config/alfaelektro"),
  lynelektrosol: () => import("../../../config/lynelektro"),
  gelektrosol: () => import("../../../config/gelektrosol"),
  minelsol: () => import("../../../config/minelsol"),
  telerorsol: () => import("../../../config/teleror"),
  smartelektrosol: () => import("../../../config/smartelektro"),
  mydlandssol: () => import("../../../config/mydlands"),
};

export default async function SolkartLayout({ children, params }) {
  const { site } = await params;

  const configModule = site && configs[site] ? await configs[site]() : {};
  const config = configModule.default || {};

  config.language = site === "vestelektro" ? "nn" : "nb";

  console.log(site);

  return <div className="h-[100vh]">{children}</div>;
}

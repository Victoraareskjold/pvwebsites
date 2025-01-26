import { Navbar } from "@/components/Navbar";
import { SiteConfigProvider } from "@/contexts/siteConfigContext";
import { headers } from "next/headers";
import "../globals.css";

const configs = {
  vestelektro: () => import("@/config/vestelektro"),
  alfaelektro: () => import("@/config/alfaelektro"),
  lynelektro: () => import("@/config/lynelektro"),
};

export default async function SolkartLayout({ children }) {
  const headersList = await headers();
  const configName = headersList.get("x-site-config");

  const configModule = configName ? await configs[configName]() : {};
  const config = configModule.default || {};

  config.language = configName === "vestelektro" ? "nn" : "nb";

  return (
    <html className="h-full">
      <body className="h-full">
        <Navbar logo={config.logo} title={config.title} pos={"absolute"} />
        <SiteConfigProvider config={config}>{children}</SiteConfigProvider>
      </body>
    </html>
  );
}

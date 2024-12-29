import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SiteConfigProvider } from "@/contexts/siteConfigContext";
import { headers } from "next/headers";
import "../app/globals.css";

// Dynamisk import av konfigurasjoner
const configs = {
  vestelektro: () => import("@/config/vestelektro"),
  alfaelektro: () => import("@/config/alfaelektro"),
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const configName = headersList.get("x-site-config");

  const configModule = configName ? await configs[configName]() : {};
  const config = configModule.default || {};

  return (
    <html>
      <head>
        <link rel="stylesheet" href="/globals.css" />
        <title>{config.title || "Standard Tittel"}</title>
      </head>
      <body>
        <Navbar logo={config.logo} title={config.title} />

        <SiteConfigProvider config={config}>{children}</SiteConfigProvider>

        <Footer
          logo={config.logo}
          email={config.email}
          address={config.address}
          organizationNumber={config.organizationNumber}
          mapsAddress={config.mapsAddress}
          primary={config.primary}
          secondary={config.secondary}
        />
      </body>
    </html>
  );
}

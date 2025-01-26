/* eslint-disable @next/next/no-css-tags */
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SiteConfigProvider } from "@/contexts/siteConfigContext";
import { headers } from "next/headers";
import "../globals.css";

// Dynamisk import av konfigurasjoner
const configs = {
  vestelektro: () => import("@/config/vestelektro"),
  alfaelektro: () => import("@/config/alfaelektro"),
  lynelektro: () => import("@/config/lynelektro"),
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const configName = headersList.get("x-site-config");

  const configModule = configName ? await configs[configName]() : {};
  const config = configModule.default || {};

  config.language = configName === "vestelektro" ? "nn" : "nb";

  const faviconUrl = config.favicon || "/favicon.ico";

  return (
    <html>
      <head>
        <link rel="stylesheet" href="/globals.css" />
        <title>{config.title || "Standard Tittel"}</title>

        <meta name="description" content={config.metaDesc || null} />

        <link rel="icon" href={faviconUrl} type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          href={`${faviconUrl.replace(".ico", ".png")}`}
        />

        {config.hubspotScript && (
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src={config.hubspotScript}
          ></script>
        )}
      </head>
      <body>
        <Navbar logo={config.logo} title={config.title} pos={"fixed"} />

        <SiteConfigProvider config={config}>{children}</SiteConfigProvider>

        <Footer
          logo={config.logo}
          email={config.footer?.email}
          address={config.footer?.address}
          organizationNumber={config.footer?.organizationNumber}
          primary={config.primary}
          secondary={config.secondary}
        />
      </body>
    </html>
  );
}

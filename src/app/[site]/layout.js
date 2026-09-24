import { Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

import HandleQueryParams from "../../components/HandleQueryParams";
import { SiteShell } from "../../components/design/Shell";
import { SiteConfigProvider } from "../../contexts/siteConfigContext";
import { themeCss } from "../../config/design/theme";
import "../globals.css";
import "../../styles/design.css";
import { configs } from "./solkart/layout";

export async function generateStaticParams() {
  return Object.keys(configs).map((key) => ({ site: key }));
}

export default async function RootLayout({ children, params }) {
  const configName = (await params).site;

  const configModule =
    configName && configs[configName] ? await configs[configName]() : {};
  const config = configModule.default || {};

  config.language = configName === "vestelektrosol" ? "nn" : "nb";

  // Ikonene ligger i samme mappe som config.favicon peker på.
  // De gamle .ico-filene var egentlig PNG-er med gjennomsiktige hjørner,
  // som ble svarte i mørk fanerad og på iOS. Filene under har hvit flate.
  const iconDir = config.favicon ? config.favicon.replace(/\/[^/]+$/, "") : null;
  const theme = themeCss(config.theme);

  return (
    <html lang={config.language}>
      <head>
        <title>{config.title || "Standard Tittel"}</title>
        <meta name="description" content={config.metaDesc || null} />
        {iconDir && (
          <>
            <link rel="icon" href={`${iconDir}/icon-32.png`} type="image/png" sizes="32x32" />
            <link rel="icon" href={`${iconDir}/icon-192.png`} type="image/png" sizes="192x192" />
            <link rel="apple-touch-icon" href={`${iconDir}/apple-touch-icon.png`} sizes="180x180" />
            <link rel="shortcut icon" href={`${iconDir}/icon.ico`} />
          </>
        )}
        {/* Farger for denne ene nettsiden. Standardfargene ligger i src/styles/design.css. */}
        {theme && <style dangerouslySetInnerHTML={{ __html: theme }} />}
      </head>
      <body>
        <SiteConfigProvider config={config}>
          <SiteShell site={configName} language={config.language}>
            {children}
          </SiteShell>
        </SiteConfigProvider>

        <Suspense fallback={null}>
          <HandleQueryParams />
        </Suspense>

        {config.googleTagManager && <GoogleTagManager gtmId={config.googleTagManager} />}

        {config.consentifyPublicToken && (
          <script
            src={`https://www.consentify.app/api/consent?token=${config.consentifyPublicToken}`}
          ></script>
        )}
      </body>
    </html>
  );
}

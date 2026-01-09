/* eslint-disable @next/next/no-css-tags */
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { SiteConfigProvider } from "../../contexts/siteConfigContext";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import "../globals.css";
import { configs } from "./solkart/layout";

export async function generateStaticParams() {
  const configKeys = Object.keys(configs);
  return configKeys.map((key) => ({
    site: key,
  }));
}

export default async function RootLayout({ children, params }) {
  const configName = (await params).site;

  const configModule =
    configName && configs[configName] ? await configs[configName]() : {};
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

        {config.googleTagManager && (
          <GoogleTagManager gtmId={config.googleTagManager} />
        )}

        {config.googleAnalytics && (
          <GoogleAnalytics gaId={config.googleAnalytics} />
        )}

        {config.metaPixel && (
          <>
            <script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${config.metaPixel}');
          fbq('track', 'PageView');`,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${config.metaPixel}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
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
          config={config.site}
        />
        {config.consentifyPublicToken && (
          <script
            src={`https://www.consentify.app/api/consent?token=${config.consentifyPublicToken}`}
          ></script>
        )}
      </body>
    </html>
  );
}

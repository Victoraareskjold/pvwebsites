/* eslint-disable @next/next/no-css-tags */
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SiteConfigProvider } from "@/contexts/siteConfigContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";

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

        {/* {config.googleTagManager && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KDFBGLFL');`,
            }}
          ></script>
        )} */}

        <GoogleTagManager gtmId="KDFBGLFL" />

        {config.hubspotScript && (
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src={config.hubspotScript}
          ></script>
        )}

        {config.metaPikselId && config.metaPikseUrl && (
          <script
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
        fbq('init', '${config.metaPikselId}');
        fbq('track', 'PageView');`,
            }}
          ></script>
        )}

        {config.metaPikselId && config.metaPikseUrl && (
          <noscript>
            <img
              height="1"
              width="1"
              style="display:none"
              src={config.metaPikseUrl}
            />
          </noscript>
        )}
      </head>
      <body>
        {config.googleTagManager2 && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KDFBGLFL"
              height="0"
              width="0"
              style="display:none;visibility:hidden"
            ></iframe>
          </noscript>
        )}
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

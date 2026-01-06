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
  const configName = params.site;

  const configModule =
    configName && configs[configName] ? await configs[configName]() : {};
  const config = configModule.default || {};

  config.language = configName === "vestelektro" ? "nn" : "nb";

  return (
    <html className="h-full">
      <head>
        {config.googleTagManager && (
          <GoogleTagManager gtmId={config.googleTagManager} />
        )}

        {config.hubspotScript && (
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src={config.hubspotScript}
          ></script>
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
      <body className="h-full">
        <Navbar logo={config.logo} title={config.title} pos={"absolute"} />
        <SiteConfigProvider config={config}>{children}</SiteConfigProvider>
      </body>
    </html>
  );
}

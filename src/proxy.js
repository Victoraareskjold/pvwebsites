import { NextResponse } from "next/server";

const HOST_TO_SITE_MAP = {
  "www.lynelektrosol.no": "lynelektrosol",
  "lynelektrosol.no": "lynelektrosol",
  "www.vestelektrosol.no": "vestelektrosol",
  "vestelektrosol.no": "vestelektrosol",
  "www.alfaelektrosol.no": "alfaelektrosol",
  "alfaelektrosol.no": "alfaelektrosol",
  "www.gelektrosol.no": "gelektrosol",
  "gelektrosol.no": "gelektrosol",
  "www.minelsol.no": "minelsol",
  "minelsol.no": "minelsol",
  "www.smartelektrosol.no": "smartelektrosol",
  "smartelektrosol.no": "smartelektrosol",
  "www.telerorelektrosol.no": "telerorelektrosol",
  "telerorelektrosol.no": "telerorelektrosol",
  "www.mydlandselektriskesol.no": "mydlandselektriskesol",
  "mydlandselektriskesol.no": "mydlandselektriskesol",
  // Add localhost for local development, pointing to a default site
  "localhost:3000": "minelsol",
};

export function proxy(request) {
  const host = request.headers.get("host");
  const site = HOST_TO_SITE_MAP[host];

  if (!site) {
    // If the host is not in our map, we do nothing.
    // This could be a Vercel preview URL, for example.
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const newPath = `/${site}${pathname}`;

  // Clone the URL and update the pathname
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  // Rewrite to the new path
  return NextResponse.rewrite(url);
}

export const config = {
  // Matcher to run the proxy on all paths except for static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

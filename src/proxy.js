import { NextResponse } from "next/server";

const HOST_TO_SITE_MAP = {
  "www.lynelektrosol.no": "lynelektro",
  "lynelektrosol.no": "lynelektro",
  "www.vestelektrosol.no": "vestelektro",
  "vestelektrosol.no": "vestelektro",
  "www.alfaelektrosol.no": "alfaelektro",
  "alfaelektrosol.no": "alfaelektro",
  "www.gelektrosol.no": "gelektrosol",
  "gelektrosol.no": "gelektrosol",
  "www.minelsol.no": "minelsol",
  "minelsol.no": "minelsol",
  "www.smartelektrosol.no": "smartelektro",
  "smartelektrosol.no": "smartelektro",
  "www.telerorelektrosol.no": "teleror",
  "telerorelektrosol.no": "teleror",
  "www.mydlandselektriskesol.no": "mydlands",
  "mydlandselektriskesol.no": "mydlands",
  // Add localhost for local development, pointing to a default site
  "localhost:3000": "mydlands",
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

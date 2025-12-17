import { NextResponse } from "next/server";

export function proxy(request) {
  const host = request.headers.get("host") || request.headers.get(":authority");

  let domain = "";
  if (host.includes("vestelektro")) domain = "vestelektro";
  if (host.includes("alfaelektro")) domain = "alfaelektro";
  if (host.includes("lynelektro")) domain = "lynelektro";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-config", domain);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: "/:path*",
};

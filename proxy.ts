import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE_NAMES } from "./src/lib/auth/cookies";

function hasAuthCookie(request: NextRequest) {
  return AUTH_SESSION_COOKIE_NAMES.some((cookieName) =>
    Boolean(request.cookies.get(cookieName)?.value),
  );
}

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    !hasAuthCookie(request)
  ) {
    const redirectURL = new URL("/sign-in", request.url);
    redirectURL.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectURL);
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/dashboard/:path*"],
};

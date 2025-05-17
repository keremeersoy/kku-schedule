import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // session varsa ve / sayfasına gidiyorsa /dashboard sayfasına yönlendir
  if (
    pathname === "/" &&
    (request.cookies.get("next-auth.session-token") ??
      request.cookies.get("__Secure-next-auth.session-token"))
  ) {
    request.nextUrl.pathname = "/dashboard";
    return NextResponse.redirect(request.nextUrl.toString());
  }

  if (
    pathname.startsWith("/dashboard") &&
    !request.cookies.get("next-auth.session-token") &&
    !request.cookies.get("__Secure-next-auth.session-token")
  ) {
    request.nextUrl.pathname = "/";
    return NextResponse.redirect(request.nextUrl.toString());
  }
}

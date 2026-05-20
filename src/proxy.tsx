import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET_PATH;
  const pathname = request.nextUrl.pathname;

  // ── Block any /admin path with a wrong or missing secret slug ──────────
  // Rewrites to /not-found so the response is indistinguishable from a real 404.
  // Prevents slug enumeration without leaking route existence.
  if (pathname.startsWith("/admin")) {
    if (!secret || !pathname.includes(`/${secret}`)) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    const token = request.cookies.get("enteropia_token")?.value;
    const loginPath = `/admin/${secret}/login`;
    const isLoginPage = pathname === loginPath;

    const jwtSecret = new TextEncoder().encode(
      process.env.JWT_SECRET as string
    );

    if (isLoginPage) {
      // ── Already authenticated -> skip login page entirely ─────────────
      if (token) {
        try {
          await jwtVerify(token, jwtSecret);
          return NextResponse.redirect(
            new URL(`/admin/${secret}/dashboard`, request.url)
          );
        } catch {
          // Token invalid → fall through to render login page
        }
      }
      return NextResponse.next();
    }

    // ── All other /admin routes require a valid token ─────────────────────
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    try {
      await jwtVerify(token, jwtSecret);
    } catch {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // api routes are intentionally excluded as they handle auth themselves
  matcher: ["/admin/:path*"],
};

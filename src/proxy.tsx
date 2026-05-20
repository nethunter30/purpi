import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
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

        if (isLoginPage) {
            // ── Already authenticated -> skip login page entirely ─────────────
            if (token && verifyToken(token)) {
                return NextResponse.redirect(
                    new URL(`/admin/${secret}/dashboard`, request.url)
                );
            }
            // Not authenticated -> render login page normally
            return NextResponse.next();
        }

        // ── All other /admin routes require a valid token ─────────────────────
        if (!token || !verifyToken(token)) {
            return NextResponse.redirect(new URL(loginPath, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // api routes are intentionally excluded as they handle auth themselves
    matcher: ["/admin/:path*"],
};

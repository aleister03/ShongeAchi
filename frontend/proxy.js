import { NextResponse } from "next/server";

// Admin access gate.
//
// Without this file, EVERY /admin/* page is wide open — anyone who types
// the URL can approve/reject checkers, flip Disaster Mode, change concern
// score thresholds, etc. There is no admin user model in this app (no
// Admin collection, no role field anywhere), so this is intentionally a
// lightweight passcode gate rather than a full RBAC system — same trust
// level as the existing checker-ID gate in app/checker/page.js, just
// enforced server-side via a cookie instead of client-side localStorage
// (so it can't be bypassed by simply hiding UI elements).
//
// How it works: POST /api/admin-auth checks the submitted passcode
// against process.env.ADMIN_PASSCODE (server-only, never shipped to the
// client) and, if correct, sets an httpOnly cookie whose value is a fixed
// opaque token (ADMIN_SESSION_TOKEN below — also server-only, since this
// file runs on the server/edge and is never bundled into client JS). This
// proxy just checks that cookie is present and correct before letting a
// request through to any /admin page.
//
// IMPORTANT: this constant MUST stay identical to the one in
// app/api/admin-auth/route.js — they're two separate files by necessity
// (this one only runs at the proxy layer, that one only runs as a route
// handler) but they're checking the same cookie value.
//
// This is a stopgap, not production auth: swap for real session-backed
// role checking (e.g. a NextAuth callback checking an isAdmin flag) if
// this app ever needs real multi-admin accounts or audit logging.
const ADMIN_COOKIE = "sa_admin";
const ADMIN_SESSION_TOKEN = "4592e040c6c6fa999a7ee9dc8987759705b5d7dcadd2be29";

export function proxy(request) {
  const cookie = request.cookies.get(ADMIN_COOKIE);
  if (cookie?.value === ADMIN_SESSION_TOKEN) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/admin-signin", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

import { NextResponse } from "next/server";

// See proxy.js for the full explanation of this gate. Kept intentionally
// simple: one shared passcode (ADMIN_PASSCODE, server-only env var), one
// opaque session token written to an httpOnly cookie on success. There is
// no Admin user model to check against — there's exactly one admin
// "account", shared by whoever has the passcode.
const ADMIN_COOKIE = "sa_admin";
const ADMIN_SESSION_TOKEN = "4592e040c6c6fa999a7ee9dc8987759705b5d7dcadd2be29";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

export async function POST(request) {
  try {
    const { passcode } = await request.json();
    const expected = process.env.ADMIN_PASSCODE;

    if (!expected) {
      // Fail closed, not open, if the env var was never configured.
      return NextResponse.json({ error: "Admin login isn't configured on this server." }, { status: 500 });
    }
    if (!passcode || passcode !== expected) {
      return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
    }

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set(ADMIN_COOKIE, ADMIN_SESSION_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}

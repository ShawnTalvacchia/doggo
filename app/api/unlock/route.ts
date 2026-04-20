import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/unlock
 * Body: { password: string }
 *
 * On success: sets the auth cookie and returns { ok: true }.
 * On failure: 401 { ok: false }.
 *
 * The password comes from the DEMO_PASSWORD env var (defaults to
 * "prague2026" for local dev). The cookie value is a static token —
 * the password itself is never stored in the cookie.
 */

const AUTH_COOKIE = "doggo-demo-auth";
const AUTH_TOKEN = "unlocked";
const DEFAULT_PASSWORD = "prague2026";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad body" }, { status: 400 });
  }

  const expected = process.env.DEMO_PASSWORD || DEFAULT_PASSWORD;
  if (!body.password || body.password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}

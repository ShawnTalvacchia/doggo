import { NextResponse } from "next/server";

/**
 * POST /api/unlock/from-signup
 *
 * No-password endpoint that grants the demo gate cookie for anyone who
 * completes the signup flow. This is intentional: /signup/* is public
 * (anyone can reach it), so anyone who clicks through to success has
 * effectively "earned" access. This keeps the demo narrative seamless —
 * clicking "Go to Home" on success doesn't dump the user into the gate.
 *
 * No real security implication: a determined user could just POST here
 * directly, but the real password protection is Obscurity + Friction, not
 * crypto. For actual access control we'd wire Supabase Auth.
 */

const AUTH_COOKIE = "doggo-demo-auth";
const AUTH_TOKEN = "unlocked";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}

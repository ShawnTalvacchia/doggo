import { NextRequest, NextResponse } from "next/server";

/**
 * Password gate for the prototype.
 *
 * Public (outside the gate):
 *   - Landing (/), Sign In (/signin), Signup flow (/signup/*)
 *   - The unlock page itself (/unlock) and its API (/api/unlock)
 *   - Next internals (_next/*), favicon, images/fonts, static assets
 *
 * Everything else (the logged-in app + the /pages demo hub) requires the
 * `doggo-demo-auth=unlocked` cookie, set by POST /api/unlock with the
 * correct password.
 */

const AUTH_COOKIE = "doggo-demo-auth";
const AUTH_TOKEN = "unlocked";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/signin",
  "/unlock",
  "/favicon.ico",
]);

const PUBLIC_PREFIXES = [
  "/signup/",
  "/api/unlock",
  "/_next/",
  "/images/",
  "/fonts/",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Static files (anything with an extension like .js, .css, .jpeg, .svg, .woff2)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p.slice(0, -1) || pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token === AUTH_TOKEN) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Run on everything except Next internals and obvious static
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

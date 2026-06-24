"use client";

/**
 * useCurrentUser — the resolved persona being viewed.
 *
 * Most product code should reach for this rather than importing a static
 * user directly. Returns the runtime-selected persona profile from
 * `CurrentUserContext`. SSR + first paint resolve to Tereza (the canonical
 * default) until localStorage hydrates on mount.
 *
 * URL-param override:
 *   ?as=<personaId>   → render this URL as that persona. Resolves against
 *                        the picker registry first (Tereza/Daniel/Klára/
 *                        Tomáš/New User), then falls back to any mock-
 *                        world user (Petra, Shawn, Nikola, Olga, Markéta,
 *                        etc.) via `getUserById`. Lets walkthroughs view
 *                        as carers who aren't on the picker without
 *                        polluting the picker UI.
 *
 * Sticky-for-session behavior (added 2026-05-05): once `?as=foo` is seen
 * on any URL, the override persists in sessionStorage so subsequent
 * in-app navigations (which don't carry the param forward in their hrefs)
 * keep rendering as that persona. Closing the tab clears it; localStorage
 * is never touched (so a fresh visit still defaults to the picker
 * persona). Pass `?as=` (empty) to exit preview within the tab.
 *
 * For switcher / picker code that needs to mutate state, use `useDemoState()`
 * from `@/contexts/CurrentUserContext` instead.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { UserProfile } from "@/lib/types";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { getPersona, isNewUser, getOperatorShelterId } from "@/lib/personas";
import { getUserById } from "@/lib/mockUsers";

const AS_SESSION_KEY = "doggo-as-preview";

/**
 * Resolve the persona override (if any) from the current URL's `?as=` param,
 * with sessionStorage fallback so the preview survives in-app navigation.
 * Returns `null` when no override is active.
 */
function useAsParamUser(): UserProfile | null {
  const pathname = usePathname();
  const [asParam, setAsParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function readOverride() {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("as");
      if (fromUrl !== null) {
        // Empty value clears the preview; any value sets it.
        if (fromUrl === "") {
          sessionStorage.removeItem(AS_SESSION_KEY);
          setAsParam(null);
        } else {
          sessionStorage.setItem(AS_SESSION_KEY, fromUrl);
          setAsParam(fromUrl);
        }
        return;
      }
      // No `?as=` in URL — fall back to whatever the session has remembered.
      const fromSession = sessionStorage.getItem(AS_SESSION_KEY);
      setAsParam(fromSession);
    }

    readOverride();

    // Listen for explicit picker / exit-preview actions that clear the
    // sessionStorage override. Without this, the picker change clears
    // sessionStorage but the cached `asParam` here stays stale until the
    // next pathname change. Pricing & Proposals walkthrough 2026-05-05.
    window.addEventListener("doggo-as-preview-changed", readOverride);
    return () => {
      window.removeEventListener("doggo-as-preview-changed", readOverride);
    };
  }, [pathname]);

  if (!asParam) return null;
  // Picker registry first (carries archetype/tagline metadata), then fall
  // back to any mock-world UserProfile by ID. The fallback is what makes
  // `?as=petra`, `?as=shawn`, etc. actually work — these aren't on the
  // picker but exist as full users in the mock world.
  const persona = getPersona(asParam);
  if (persona) return persona.user;
  return getUserById(asParam) ?? null;
}

export function useCurrentUser(): UserProfile {
  const { user } = useDemoState();
  const override = useAsParamUser();
  return override ?? user;
}

/** Convenience for the very common `useCurrentUser().id` pattern. */
export function useCurrentUserId(): string {
  return useCurrentUser().id;
}

/**
 * True iff the active persona is the brand-new-user empty-state profile.
 * Replaces the old `useNewUserMode()` boolean — empty/onboarding state is
 * now expressed as a persona option rather than a separate flag.
 */
export function useIsNewUser(): boolean {
  return isNewUser(useCurrentUserId());
}

/**
 * True iff the viewer is a logged-out guest. Distinct from any persona —
 * `useCurrentUser()` still returns a UserProfile fallback (default Tereza)
 * for read-only display purposes, but action handlers should branch on
 * this flag and trigger the AuthGate sheet instead of mutating state.
 *
 * Set by URL `?guest=1` on page load (ephemeral) or by explicit calls to
 * `setGuestMode` from `useDemoState()`.
 *
 * Demo Presentation phase D1, 2026-05-05.
 */
export function useIsGuest(): boolean {
  return useDemoState().isGuest;
}

/**
 * True once the client-side hydration tick has run — localStorage +
 * `?guest=1` URL param have been read. Before this flips, `useCurrentUser`
 * returns the SSR/first-paint Tereza fallback.
 *
 * Use this to gate side effects that depend on persona identity. The
 * classic bug it prevents: Tomáš (localStorage: tomas) types
 * `/profile/tereza` — first render evaluates `currentUserId === userId`
 * as `tereza === tereza` (because hydration hasn't happened yet) and a
 * naive own-self-redirect fires, bouncing the viewer back to `/profile`.
 * Wrap the redirect's gate in `if (!isHydrated) return;` and the
 * pre-hydration false-positive disappears. 2026-05-13.
 */
export function useIsHydrated(): boolean {
  return useDemoState().hydrated;
}

/**
 * The shelter id whose operator (back-office) view is active, or undefined for
 * any non-operator persona. When set, the app shell adapts to the shelter's
 * own side: the nav becomes the back-office nav (Sidebar / BottomNav), and the
 * consumer pages that don't fit a shelter (`/schedule`, `/bookings`, `/inbox`)
 * branch to operator surfaces. Phase 2 "The Shelter's Side." Respects the
 * `?as=` override (so previewing the operator persona works too).
 */
export function useOperatorShelterId(): string | undefined {
  return getOperatorShelterId(useCurrentUserId());
}

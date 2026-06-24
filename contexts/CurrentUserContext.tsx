"use client";

/**
 * CurrentUserContext — runtime persona state.
 *
 * Replaces the static `mockUser` import pattern. See
 * `docs/archive/phases/persona-wiring.md` for the design decisions:
 *
 * - Storage: localStorage, not URL params
 * - Default: Tereza (was Shawn until 2026-04-26 — see `lib/personas.ts` for
 *   the rationale on dropping Shawn as a persona)
 * - SSR fallback: defaults render on the server; localStorage is read on
 *   mount, accepting a brief flash of default-user content during hydration.
 *
 * "New user" state is now its own persona (`new-user`) rather than a
 * separate boolean flag — surfaces that gate on empty/onboarding state
 * check `isNewUser(currentUser.id)` from `@/lib/personas`.
 *
 * **Guest viewer state (added 2026-05-05, Demo Presentation D1):** an
 * orthogonal `isGuest` flag models a logged-out visitor. Distinct from any
 * persona — `useCurrentUser()` still returns a UserProfile (defaults to
 * Tereza for read-only display), but action handlers should branch on
 * `useIsGuest()` and trigger the AuthGate prompt instead of mutating state.
 * Guest mode is ephemeral: it doesn't write to localStorage. The URL param
 * `?guest=1` enters guest mode for the lifetime of the page (cleared by
 * navigating away or selecting a persona).
 *
 * Components should not consume this directly — use `useCurrentUser()` for
 * the resolved profile, `useIsGuest()` for the guest flag, or
 * `useDemoState()` for switcher controls.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "@/lib/types";
import { tereza, getUserById } from "@/lib/mockUsers";
import { getPersona } from "@/lib/personas";

/**
 * Resolve a persona by id: the curated picker registry first (carries
 * archetype/tagline + the isDefault/operator flags), then ANY mock-world
 * user via `getUserById`. The fallback decouples switchability from picker
 * membership — a guided walkthrough can switch to a character that isn't on
 * the picker (e.g. Magda), and `?as=<id>` works for anyone. Phase 2 trim
 * (2026-06-24) relies on this so dropping personas from the picker doesn't
 * break walkthroughs that still drive them.
 */
function resolveUserById(id: string): UserProfile | undefined {
  return getPersona(id)?.user ?? getUserById(id);
}

const STORAGE_KEY_USER = "doggo-demo-user-id";
// Guest mode mirrors to sessionStorage (not localStorage) — it survives
// in-app navigation within a tab so a guest visitor who lands on
// `/communities/group-1?guest=1` and clicks into `/meets/meet-1` stays in
// guest mode, but closing the tab clears it. Without this, every internal
// `<Link>` from a guest route loses `?guest=1` and the visitor silently
// flips back to the Tereza fallback. Demo Presentation D4 prep 2026-05-11.
const SESSION_KEY_GUEST = "doggo-guest";

type CurrentUserContextValue = {
  /** The persona currently being viewed. */
  user: UserProfile;
  /** True iff the active persona is the canonical default (Tereza). */
  isDefault: boolean;
  /**
   * True iff the viewer is a logged-out guest (no real persona). Action
   * handlers should branch on this and trigger the AuthGate sheet instead
   * of performing the action. `user` still holds a UserProfile for any
   * read-only display fallback (defaults to Tereza in guest mode).
   */
  isGuest: boolean;
  /**
   * True once the client-side hydration tick has run — localStorage +
   * `?guest=1` URL param have been read, and `user` / `isGuest` reflect
   * the actual session. Before this flips, `user` is the SSR/first-paint
   * Tereza fallback. Side effects that depend on persona identity
   * (e.g. "is this URL my own profile?" redirects) MUST gate on this
   * flag — otherwise pre-hydration reads see Tereza as the active user
   * and false-positive against `/profile/tereza` URLs. 2026-05-13.
   */
  hydrated: boolean;
  /** Switch to a different persona by user ID. Unknown IDs are ignored. Clears guest mode. */
  setUserById: (id: string) => void;
  /** Reset to the canonical default; clears the persona storage key. Clears guest mode. */
  resetToDefault: () => void;
  /** Toggle guest mode. Ephemeral (not persisted). Used by URL `?guest=1` and explicit "view as guest" actions. */
  setGuestMode: (next: boolean) => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(
  undefined,
);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  // SSR + first paint: render as Tereza, not guest.
  const [user, setUser] = useState<UserProfile>(tereza);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  // Hydration gate — false until the client-mount useEffect runs and
  // localStorage / URL have been read. Persona-identity-dependent side
  // effects (e.g. own-profile-URL → /profile redirect) must wait for
  // this to flip true, otherwise they fire against the Tereza fallback
  // and false-positive on `/profile/tereza` URLs. 2026-05-13.
  const [hydrated, setHydrated] = useState<boolean>(false);

  // On mount, hydrate from localStorage + URL.
  useEffect(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEY_USER);
      if (storedId) {
        const resolved = resolveUserById(storedId);
        if (resolved) setUser(resolved);
      }
    } catch {
      // Ignore — prototype, no recovery needed.
    }

    // URL `?guest=1` enters guest mode; sessionStorage carries it across
    // in-app navigation within a tab. URL wins (a fresh `?guest=1` re-asserts);
    // otherwise we fall back to whatever sessionStorage has remembered.
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("guest") === "1") {
          setIsGuest(true);
          sessionStorage.setItem(SESSION_KEY_GUEST, "1");
        } else if (sessionStorage.getItem(SESSION_KEY_GUEST) === "1") {
          setIsGuest(true);
        }
      } catch {
        // Ignore.
      }
    }

    setHydrated(true);
  }, []);

  const setUserById = useCallback((id: string) => {
    const persona = getPersona(id);
    const resolved = persona?.user ?? getUserById(id);
    if (!resolved) return;
    setUser(resolved);
    setIsGuest(false); // selecting a persona always exits guest mode
    try {
      if (persona?.isDefault) {
        localStorage.removeItem(STORAGE_KEY_USER);
      } else {
        localStorage.setItem(STORAGE_KEY_USER, resolved.id);
      }
      sessionStorage.removeItem(SESSION_KEY_GUEST);
      // Explicit picker action clears the sticky `?as=` preview override.
      // We have to clear THREE things in sync, because each one feeds the
      // others on re-read:
      //   1. sessionStorage — the sticky cache
      //   2. URL `?as=` — the source of truth that re-seeds sessionStorage
      //      on next read (so leaving it sets the preview right back)
      //   3. React state in `useAsParamUser` — listens for the custom event
      // Without (2), the picker pick clears sessionStorage but the URL
      // still has `?as=petra`, the next render reads the URL and re-sets
      // sessionStorage, override stays applied. Pricing & Proposals
      // walkthrough 2026-05-05.
      sessionStorage.removeItem("doggo-as-preview");
      const url = new URL(window.location.href);
      if (url.searchParams.has("as")) {
        url.searchParams.delete("as");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
      window.dispatchEvent(new CustomEvent("doggo-as-preview-changed"));
    } catch {
      // Ignore.
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setUser(tereza);
    setIsGuest(false);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      sessionStorage.removeItem("doggo-as-preview");
      sessionStorage.removeItem(SESSION_KEY_GUEST);
      const url = new URL(window.location.href);
      if (url.searchParams.has("as")) {
        url.searchParams.delete("as");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
      window.dispatchEvent(new CustomEvent("doggo-as-preview-changed"));
    } catch {
      // Ignore.
    }
  }, []);

  const setGuestMode = useCallback((next: boolean) => {
    setIsGuest(next);
    try {
      if (next) sessionStorage.setItem(SESSION_KEY_GUEST, "1");
      else sessionStorage.removeItem(SESSION_KEY_GUEST);
    } catch {
      // Ignore.
    }
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      user,
      isDefault: user.id === tereza.id,
      isGuest,
      hydrated,
      setUserById,
      resetToDefault,
      setGuestMode,
    }),
    [user, isGuest, hydrated, setUserById, resetToDefault, setGuestMode],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

/**
 * Demo state — for the picker. Most product code should use `useCurrentUser()`
 * instead, which returns just the resolved UserProfile.
 */
export function useDemoState(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error("useDemoState must be used within CurrentUserProvider");
  }
  return ctx;
}

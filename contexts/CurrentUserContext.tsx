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
import { tereza } from "@/lib/mockUsers";
import { getPersona } from "@/lib/personas";

const STORAGE_KEY_USER = "doggo-demo-user-id";

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

  // On mount, hydrate from localStorage + URL.
  useEffect(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEY_USER);
      if (storedId) {
        const persona = getPersona(storedId);
        if (persona) setUser(persona.user);
      }
    } catch {
      // Ignore — prototype, no recovery needed.
    }

    // URL `?guest=1` enters guest mode. Doesn't persist — only applies to the
    // current page lifetime, similar to `?as=` overrides.
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("guest") === "1") {
          setIsGuest(true);
        }
      } catch {
        // Ignore.
      }
    }
  }, []);

  const setUserById = useCallback((id: string) => {
    const persona = getPersona(id);
    if (!persona) return;
    setUser(persona.user);
    setIsGuest(false); // selecting a persona always exits guest mode
    try {
      if (persona.isDefault) {
        localStorage.removeItem(STORAGE_KEY_USER);
      } else {
        localStorage.setItem(STORAGE_KEY_USER, persona.user.id);
      }
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
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      user,
      isDefault: user.id === tereza.id,
      isGuest,
      setUserById,
      resetToDefault,
      setGuestMode,
    }),
    [user, isGuest, setUserById, resetToDefault, setGuestMode],
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

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
 * Components should not consume this directly — use `useCurrentUser()` for
 * the resolved profile, or `useDemoState()` for switcher controls.
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
  /** Switch to a different persona by user ID. Unknown IDs are ignored. */
  setUserById: (id: string) => void;
  /** Reset to the canonical default; clears the persona storage key. */
  resetToDefault: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(
  undefined,
);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  // SSR + first paint: render as Tereza.
  const [user, setUser] = useState<UserProfile>(tereza);

  // On mount, hydrate from localStorage.
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
  }, []);

  const setUserById = useCallback((id: string) => {
    const persona = getPersona(id);
    if (!persona) return;
    setUser(persona.user);
    try {
      if (persona.isDefault) {
        localStorage.removeItem(STORAGE_KEY_USER);
      } else {
        localStorage.setItem(STORAGE_KEY_USER, persona.user.id);
      }
    } catch {
      // Ignore.
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setUser(tereza);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {
      // Ignore.
    }
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      user,
      isDefault: user.id === tereza.id,
      setUserById,
      resetToDefault,
    }),
    [user, setUserById, resetToDefault],
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

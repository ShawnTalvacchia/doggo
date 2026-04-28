"use client";

/**
 * useCurrentUser — the resolved persona being viewed.
 *
 * Most product code should reach for this rather than importing a static
 * user directly. Returns the runtime-selected persona profile from
 * `CurrentUserContext`. SSR + first paint resolve to Tereza (the canonical
 * default) until localStorage hydrates on mount.
 *
 * URL-param override (no localStorage write — temporary, per-URL):
 *   ?as=<personaId>   → render this URL as that persona (e.g. `?as=daniel`,
 *                        `?as=new-user`). Removing the param reverts to
 *                        whatever the context is set to.
 *
 * For switcher / picker code that needs to mutate state, use `useDemoState()`
 * from `@/contexts/CurrentUserContext` instead.
 */

import { useSearchParams } from "next/navigation";
import type { UserProfile } from "@/lib/types";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { getPersona, isNewUser } from "@/lib/personas";

/**
 * Resolve the persona override (if any) from the current URL's `?as=` param.
 * Returns `null` when no override is active.
 */
function useAsParamUser(): UserProfile | null {
  const params = useSearchParams();
  const asParam = params?.get("as");
  if (!asParam) return null;
  const persona = getPersona(asParam);
  return persona?.user ?? null;
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

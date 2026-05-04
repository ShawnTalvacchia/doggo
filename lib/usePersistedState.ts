"use client";

/**
 * usePersistedState — drop-in replacement for useState that mirrors a value
 * to localStorage so demo state survives refreshes / reloads.
 *
 * Why this exists: ConversationsContext, ConnectionsContext, and
 * BookingsContext all start from mock data and accumulate session-only
 * mutations (new inquiries, Familiar marks, signed contracts, etc.). Until
 * 2026-05-04 every refresh wiped that progress, which made multi-step demo
 * walkthroughs (Discover & Care G — owner sends inquiry → switch persona →
 * provider replies → owner accepts) require completing all steps in one
 * sitting without ever navigating via URL. Persisting React state to
 * localStorage is the prototype-friendly fix; production will swap these
 * contexts for Supabase reads/writes.
 *
 * SSR safety: state initializes from `defaultValue` on the server; the
 * effect that hydrates from localStorage only runs after mount. Brief
 * flash of default content on first paint, no hydration mismatch.
 *
 * Storage keys should be `doggo-*` so the existing demo-reset helper in
 * `app/demo/page.tsx` and `components/profile/ProfileNameDropdown.tsx`
 * picks them up — no need to teach those surfaces about new keys.
 */

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export function usePersistedState<T>(
  storageKey: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);
  const hydratedRef = useRef(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        setState(JSON.parse(raw) as T);
      }
    } catch {
      // Ignore — parse errors fall back to default.
    }
    hydratedRef.current = true;
  }, [storageKey]);

  // Persist on every update. Skipped on the very first effect run (before
  // hydration completes) so we don't briefly clobber persisted data with
  // the default before hydration applies it.
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore — quota exceeded, no-op.
    }
  }, [storageKey, state]);

  return [state, setState];
}

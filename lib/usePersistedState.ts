"use client";

/**
 * usePersistedState — drop-in replacement for useState that mirrors a
 * value to localStorage so demo state survives refreshes / reloads,
 * AND syncs across all components using the same `storageKey` within
 * the same tab via a module-level store.
 *
 * Why this exists: ConversationsContext, ConnectionsContext, and
 * BookingsContext all start from mock data and accumulate session-only
 * mutations (new inquiries, Familiar marks, signed contracts, etc.).
 * Until 2026-05-04 every refresh wiped that progress, which made
 * multi-step demo walkthroughs (Discover & Care G — owner sends
 * inquiry → switch persona → provider replies → owner accepts) require
 * completing all steps in one sitting without ever navigating via URL.
 *
 * Sessions & Service Execution A6 (2026-05-05) added a second
 * requirement: same-tab cross-component sync. `useViewedReports` is
 * called both by BookingRow on /bookings and the booking detail page;
 * marking a booking viewed in one needs to clear the indicator in the
 * other without remounting. The previous "isolated useState per
 * instance" version couldn't do that.
 *
 * Implementation: module-level cache keyed by storageKey + a
 * subscriber registry. `useSyncExternalStore` (or a manual reducer
 * here) bridges the cache to React. setState updates the cache,
 * persists to localStorage, and broadcasts to all subscribers — every
 * mounted instance with the same key re-renders with the new value.
 *
 * Storage keys should be `doggo-*` so the shared demo-reset helper
 * (`clearDemoStorage` in `lib/demoReset.ts`) picks them up — no need to
 * teach it about new keys.
 */

import {
  useCallback,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";

// ── Module-level shared store ────────────────────────────────────────

/** State per storage key. Lazily populated on first access. */
const stateByKey: Map<string, unknown> = new Map();
/** Subscribers per storage key. Each is a force-render callback. */
const listenersByKey: Map<string, Set<() => void>> = new Map();
/** True once we've installed the global storage-event listener. */
let storageListenerInstalled = false;

function ensureStorageListener() {
  if (storageListenerInstalled || typeof window === "undefined") return;
  storageListenerInstalled = true;
  window.addEventListener("storage", (e) => {
    // Cross-tab updates — another tab modified localStorage.
    if (!e.key) return;
    if (!stateByKey.has(e.key)) return;
    try {
      const next = e.newValue !== null ? JSON.parse(e.newValue) : undefined;
      stateByKey.set(e.key, next);
      const listeners = listenersByKey.get(e.key);
      if (listeners) listeners.forEach((fn) => fn());
    } catch {
      /* parse error — ignore */
    }
  });
}

function getValue<T>(key: string, defaultValue: T): T {
  if (stateByKey.has(key)) return stateByKey.get(key) as T;
  // First access — try to hydrate from localStorage.
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw) as T;
        stateByKey.set(key, parsed);
        return parsed;
      }
    } catch {
      /* parse error — fall through to default */
    }
  }
  stateByKey.set(key, defaultValue);
  return defaultValue;
}

function setValue<T>(key: string, value: T): void {
  stateByKey.set(key, value);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded — ignore */
    }
  }
  const listeners = listenersByKey.get(key);
  if (listeners) listeners.forEach((fn) => fn());
}

function subscribe(key: string, listener: () => void): () => void {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
  };
}

/**
 * Wipe the in-memory cache for keys matching `prefix` (defaults to "doggo")
 * and notify subscribers so mounted components re-read from localStorage
 * (or fall back to defaultValue) on next render.
 *
 * Without this, `/demo` Reset clears localStorage but leaves the
 * module-level cache holding stale demo state — which then continues
 * to drive UI until a full page reload swaps the modules. Sessions &
 * Service Execution walkthrough surfaced the gap 2026-05-08.
 */
export function resetPersistedState(prefix = "doggo"): void {
  // Snapshot the keys before mutation so we can notify each one's
  // listeners afterward — Map iteration during deletion is fine but
  // the listener registry is separate so order doesn't matter.
  const keysToReset: string[] = [];
  for (const key of stateByKey.keys()) {
    if (key.startsWith(prefix)) keysToReset.push(key);
  }
  for (const key of keysToReset) {
    stateByKey.delete(key);
    const listeners = listenersByKey.get(key);
    if (listeners) listeners.forEach((fn) => fn());
  }
}

// ── Hook ─────────────────────────────────────────────────────────────

/**
 * SSR-safe persisted state via `useSyncExternalStore`.
 *
 * The server has no localStorage, so the server snapshot is always
 * `defaultValue`. The client's first render also returns `defaultValue`
 * — matching the SSR HTML and avoiding hydration mismatch warnings.
 * Immediately after hydration, React re-renders using `getSnapshot`
 * which reads the persisted value from localStorage (via the
 * module-level cache) and the UI updates to reflect saved state.
 *
 * Previous implementation read localStorage during render via plain
 * `useState`/`useReducer`, which broke SSR: server rendered defaults,
 * client immediately re-rendered with persisted state, React threw
 * hydration mismatches. Surfaces could "flash" — a card appears,
 * then a moment later disappears as persisted state takes over.
 * Sessions & Service Execution walkthrough surfaced this 2026-05-08.
 *
 * The single-frame transition from default → persisted on first paint
 * is still possible if consumers care (e.g. a Schedule card whose
 * persisted state is "completed" while default is "upcoming"). To
 * suppress the flicker entirely, consumers can gate UI on hydration —
 * but the warnings + implicit reconciliation behavior are now fixed.
 */
export function usePersistedState<T>(
  storageKey: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const subscribeForKey = useCallback(
    (listener: () => void) => {
      ensureStorageListener();
      return subscribe(storageKey, listener);
    },
    [storageKey],
  );

  // Client snapshot — reads (and lazily hydrates) the cache, which
  // pulls from localStorage on first access per key.
  const getSnapshot = useCallback(
    () => getValue<T>(storageKey, defaultValue),
    // defaultValue intentionally not in deps — stable per-call-site by
    // convention; tracking it would re-build the snapshot fn on every
    // render and cause useSyncExternalStore to tear.
    [storageKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Server snapshot — always the default. Used during SSR AND during
  // the first client render (before hydration completes), so the
  // server-rendered HTML and the first client paint match exactly.
  const getServerSnapshot = useCallback(
    () => defaultValue,
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const state = useSyncExternalStore(
    subscribeForKey,
    getSnapshot,
    getServerSnapshot,
  );

  const setState = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      const current = getValue<T>(storageKey, defaultValue);
      const computed =
        typeof next === "function" ? (next as (p: T) => T)(current) : next;
      setValue(storageKey, computed);
    },
    [storageKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [state, setState];
}

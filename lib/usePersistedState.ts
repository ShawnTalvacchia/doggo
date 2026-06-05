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

/**
 * Storage wrapper when a `seedVersion` is in play. Lets us tell stale
 * persisted state apart from current — if `__v` doesn't match the
 * caller's current seedVersion, we ignore the stored value and fall
 * back to `defaultValue` (the fresh seeds). P55, 2026-06-02.
 *
 * Keys without seedVersion stay on the plain-T storage shape — backwards
 * compatible. The wrapper only kicks in when a consumer opts in by
 * passing `{ seedVersion }`.
 */
interface VersionedEnvelope<T> {
  __v: number;
  value: T;
}

function isVersionedEnvelope<T>(raw: unknown): raw is VersionedEnvelope<T> {
  return (
    typeof raw === "object" &&
    raw !== null &&
    "__v" in raw &&
    "value" in raw &&
    typeof (raw as { __v: unknown }).__v === "number"
  );
}

function getValue<T>(key: string, defaultValue: T, seedVersion?: number): T {
  if (stateByKey.has(key)) return stateByKey.get(key) as T;
  // First access — try to hydrate from localStorage.
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (seedVersion !== undefined) {
          // Opt-in versioned storage. Accept only on exact version match.
          // Any other shape (plain T from before opt-in, or a mismatched
          // envelope) is treated as stale and dropped.
          if (isVersionedEnvelope<T>(parsed) && parsed.__v === seedVersion) {
            stateByKey.set(key, parsed.value);
            return parsed.value;
          }
        } else {
          stateByKey.set(key, parsed as T);
          return parsed as T;
        }
      }
    } catch {
      /* parse error — fall through to default */
    }
  }
  stateByKey.set(key, defaultValue);
  return defaultValue;
}

function setValue<T>(key: string, value: T, seedVersion?: number): void {
  stateByKey.set(key, value);
  if (typeof window !== "undefined") {
    try {
      const payload =
        seedVersion !== undefined
          ? ({ __v: seedVersion, value } satisfies VersionedEnvelope<T>)
          : value;
      localStorage.setItem(key, JSON.stringify(payload));
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
export interface UsePersistedStateOptions {
  /**
   * When set, the persisted value is wrapped as `{ __v, value }` and
   * dropped on mismatch (treated as stale, falls back to `defaultValue`
   * = fresh seeds). Bump the version any time a seed file gains new
   * entries that testers should see automatically without a /demo reset.
   *
   * Trade-off: bumping wipes any user-added persisted entries too
   * (inquiries sent, marks made). For demo plumbing where the goal is
   * "fresh seeds on every meaningful seed change," that's the expected
   * shape. Granular merge across seeds vs user mutations would need a
   * separate data layer. P55, 2026-06-02.
   */
  seedVersion?: number;
}

export function usePersistedState<T>(
  storageKey: string,
  defaultValue: T,
  options?: UsePersistedStateOptions,
): [T, Dispatch<SetStateAction<T>>] {
  const seedVersion = options?.seedVersion;
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
    () => getValue<T>(storageKey, defaultValue, seedVersion),
    // defaultValue intentionally not in deps — stable per-call-site by
    // convention; tracking it would re-build the snapshot fn on every
    // render and cause useSyncExternalStore to tear.
    [storageKey, seedVersion], // eslint-disable-line react-hooks/exhaustive-deps
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
      const current = getValue<T>(storageKey, defaultValue, seedVersion);
      const computed =
        typeof next === "function" ? (next as (p: T) => T)(current) : next;
      setValue(storageKey, computed, seedVersion);
    },
    [storageKey, seedVersion], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [state, setState];
}

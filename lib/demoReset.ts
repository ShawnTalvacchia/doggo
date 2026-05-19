import { resetPersistedState } from "@/lib/usePersistedState";

/**
 * Wipe every `doggo*` key from local + session storage — the persona
 * override, persisted demo state (bookings, connections, conversations),
 * the guided-walkthrough run-state, the `?as=` preview override — then
 * clear the in-memory `usePersistedState` cache so mounted components
 * re-read fresh defaults from the mock-data seed.
 *
 * Shared by every demo-reset entry point: the landing page's Start +
 * Reset, the profile-name dropdown's Reset, and the walkthrough's Exit.
 * Does NOT reset the active persona — pair with
 * `useDemoState().resetToDefault()` when a persona reset is also wanted.
 */
export function clearDemoStorage(): void {
  if (typeof window === "undefined") return;
  try {
    for (const store of [window.localStorage, window.sessionStorage]) {
      Object.keys(store)
        .filter((k) => k.startsWith("doggo"))
        .forEach((k) => store.removeItem(k));
    }
  } catch {
    // Ignore — private browsing / storage disabled.
  }
  resetPersistedState("doggo");
}

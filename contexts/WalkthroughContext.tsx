"use client";

/**
 * WalkthroughContext — Guided Walkthrough state + beat/step sequencer.
 *
 * The Guided Walkthrough auto-switches personas through the four-beat
 * `lib/walkthroughBeats.ts` spine. Each beat opens with a full-screen
 * interstitial (persona handoff) and then walks the tester through ordered
 * steps via the on-surface card. This context holds the run state and drives
 * the two UI surfaces (`WalkthroughInterstitial`, `WalkthroughCard`).
 *
 * Why a context (not URL-driven, unlike the retired `TourOverlay`): the
 * on-surface card has to ride along on EVERY surface during a beat,
 * including across real in-app navigations. A context + `sessionStorage`
 * survives in-app navigation and reloads cleanly; URL params don't.
 *
 * State machine:
 *   - `active: false`                        — not in the walkthrough (default)
 *   - `active, phase "interstitial"`         — full-screen handoff for beat `beatIndex`
 *   - `active, phase "running"`               — on the beat surface, card on step `stepIndex`
 *   - `active, paused`                        — Open View on the current persona, "Walkthrough" pill
 *   - `beatIndex === WALKTHROUGH_BEAT_COUNT`  — the closing interstitial
 *
 * `next` / `prev` advance by one step, crossing beat boundaries: stepping
 * past a beat's last step lands on the next beat's interstitial.
 *
 * Persona switching is delegated to `CurrentUserContext.setUserById`, so
 * `WalkthroughProvider` MUST sit inside `CurrentUserProvider`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { WALKTHROUGH_BEATS, WALKTHROUGH_BEAT_COUNT } from "@/lib/walkthroughBeats";

const SESSION_KEY = "doggo-walkthrough";

type WalkthroughPhase = "interstitial" | "running";

type PersistedState = {
  active: boolean;
  beatIndex: number;
  stepIndex: number;
  phase: WalkthroughPhase;
  paused: boolean;
};

const INITIAL: PersistedState = {
  active: false,
  beatIndex: 0,
  stepIndex: 0,
  phase: "interstitial",
  paused: false,
};

type WalkthroughContextValue = PersistedState & {
  /** True once sessionStorage has hydrated — components render null before this. */
  hydrated: boolean;
  /** Begin the walkthrough at beat 0 (shows the first interstitial). */
  start: () => void;
  /** From an interstitial: switch persona + route to the beat surface, show step 1. */
  continueToBeat: () => void;
  /** Advance one step — or, past a beat's last step, to the next beat's interstitial. */
  next: () => void;
  /** Step back one step — or, from a beat's first step, to the previous beat's interstitial. */
  prev: () => void;
  /** Skip the current beat entirely — jump straight to the next beat's interstitial. */
  skipBeat: () => void;
  /** Pause — drop to Open View on the current persona, show the "Walkthrough" pill. */
  pause: () => void;
  /** Resume — restore the interstitial or card for the current beat/step. */
  resume: () => void;
  /** End the walkthrough and return to `/demo`. */
  exit: () => void;
  /** End the walkthrough but stay on the current persona/surface (closing-screen "Stay"). */
  endAndStay: () => void;
};

const WalkthroughContext = createContext<WalkthroughContextValue | undefined>(
  undefined,
);

export function WalkthroughProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUserById } = useDemoState();

  const [state, setState] = useState<PersistedState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (parsed && typeof parsed.active === "boolean") {
          setState({
            active: parsed.active,
            beatIndex: typeof parsed.beatIndex === "number" ? parsed.beatIndex : 0,
            stepIndex: typeof parsed.stepIndex === "number" ? parsed.stepIndex : 0,
            phase: parsed.phase === "running" ? "running" : "interstitial",
            paused: parsed.paused === true,
          });
        }
      }
    } catch {
      // Ignore — prototype, no recovery needed.
    }
    setHydrated(true);
  }, []);

  // Mirror state to sessionStorage so it survives in-app navigation + reload.
  const persist = useCallback((next: PersistedState) => {
    setState(next);
    try {
      if (next.active) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Ignore.
    }
  }, []);

  // All actions read `state` from the closure and route side effects
  // (setUserById, router.push) through the event-handler scope — never
  // inside a setState updater, which would setState another component
  // mid-render. `persist` is the only setState path.

  const start = useCallback(() => {
    persist({ active: true, beatIndex: 0, stepIndex: 0, phase: "interstitial", paused: false });
  }, [persist]);

  const continueToBeat = useCallback(() => {
    const beat = WALKTHROUGH_BEATS[state.beatIndex];
    if (!beat) return;
    persist({ ...state, phase: "running", stepIndex: 0, paused: false });
    setUserById(beat.personaId);
    router.push(beat.startUrl);
  }, [state, persist, router, setUserById]);

  const next = useCallback(() => {
    const beat = WALKTHROUGH_BEATS[state.beatIndex];
    if (!beat) return;
    if (state.stepIndex < beat.steps.length - 1) {
      // Advance within the beat.
      persist({ ...state, stepIndex: state.stepIndex + 1 });
    } else {
      // Past the last step → next beat's interstitial (or the closing screen).
      persist({
        ...state,
        beatIndex: Math.min(state.beatIndex + 1, WALKTHROUGH_BEAT_COUNT),
        stepIndex: 0,
        phase: "interstitial",
        paused: false,
      });
    }
  }, [state, persist]);

  const prev = useCallback(() => {
    if (state.stepIndex > 0) {
      // Step back within the beat.
      persist({ ...state, stepIndex: state.stepIndex - 1 });
    } else if (state.beatIndex > 0) {
      // From the first step → re-open the previous beat's interstitial.
      persist({
        ...state,
        beatIndex: state.beatIndex - 1,
        stepIndex: 0,
        phase: "interstitial",
        paused: false,
      });
    }
  }, [state, persist]);

  const skipBeat = useCallback(() => {
    // Jump past the current beat to the next beat's interstitial (or the
    // closing screen, if skipping the last beat).
    persist({
      ...state,
      beatIndex: Math.min(state.beatIndex + 1, WALKTHROUGH_BEAT_COUNT),
      stepIndex: 0,
      phase: "interstitial",
      paused: false,
    });
  }, [state, persist]);

  const pause = useCallback(() => {
    // Pausing from an interstitial commits the persona swap + route first,
    // so the tester lands on the beat's surface in Open View. Pausing from
    // a running beat just stays put.
    if (state.phase === "interstitial") {
      const beat = WALKTHROUGH_BEATS[state.beatIndex];
      if (beat) {
        setUserById(beat.personaId);
        router.push(beat.startUrl);
      }
    }
    persist({ ...state, paused: true });
  }, [state, persist, router, setUserById]);

  const resume = useCallback(() => {
    persist({ ...state, paused: false });
  }, [persist, state]);

  const exit = useCallback(() => {
    persist(INITIAL);
    router.push("/demo");
  }, [persist, router]);

  const endAndStay = useCallback(() => {
    persist(INITIAL);
  }, [persist]);

  const value = useMemo<WalkthroughContextValue>(
    () => ({
      ...state,
      hydrated,
      start,
      continueToBeat,
      next,
      prev,
      skipBeat,
      pause,
      resume,
      exit,
      endAndStay,
    }),
    [
      state,
      hydrated,
      start,
      continueToBeat,
      next,
      prev,
      skipBeat,
      pause,
      resume,
      exit,
      endAndStay,
    ],
  );

  return (
    <WalkthroughContext.Provider value={value}>
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough(): WalkthroughContextValue {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) {
    throw new Error("useWalkthrough must be used within WalkthroughProvider");
  }
  return ctx;
}

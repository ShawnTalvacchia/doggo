"use client";

/**
 * WalkthroughContext — Guided Walkthrough state + beat/step sequencer.
 *
 * The Guided Walkthrough auto-switches personas through the three-beat
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
 *   - `beatIndex === WALKTHROUGH_BEAT_COUNT`  — the closing interstitial
 *
 * `next` / `prev` advance by one step, crossing beat boundaries: stepping
 * past a beat's last step lands on the next beat's interstitial.
 *
 * There is no "paused" state: the on-surface card minimises to a pill (a
 * card-local view toggle in `WalkthroughCard`) while the walkthrough keeps
 * running. Leaving the walkthrough is `exit` (clean slate) or `endAndStay`.
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
import { clearDemoStorage } from "@/lib/demoReset";
import { WALKTHROUGH_BEATS, WALKTHROUGH_BEAT_COUNT } from "@/lib/walkthroughBeats";

const SESSION_KEY = "doggo-walkthrough";

type WalkthroughPhase = "interstitial" | "running";

type PersistedState = {
  active: boolean;
  beatIndex: number;
  stepIndex: number;
  /** Per-beat highest step index reached. Used by `WalkthroughCard` to
   *  detect "user has been past this step before" — turns the awaitAction
   *  prompt into a Continue button when the tester has backed into a
   *  step whose action they've already performed. Key is the beat index
   *  stringified; value is the max stepIndex reached in that beat. */
  beatMaxSteps: Record<string, number>;
  phase: WalkthroughPhase;
};

const INITIAL: PersistedState = {
  active: false,
  beatIndex: 0,
  stepIndex: 0,
  beatMaxSteps: {},
  phase: "interstitial",
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
  /** Step back one step — or, from a beat's first step, to the previous beat's
   *  LAST step (skipping the handoff interstitial, which is a one-way
   *  transition, not navigable content). From the very first step of the
   *  walkthrough, re-opens the opening interstitial. */
  prev: () => void;
  /** Skip the current beat entirely — jump straight to the next beat's interstitial. */
  skipBeat: () => void;
  /** End the walkthrough, wipe the demo state it mutated, and return to the landing page. */
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
            beatMaxSteps:
              parsed.beatMaxSteps && typeof parsed.beatMaxSteps === "object"
                ? (parsed.beatMaxSteps as Record<string, number>)
                : {},
            phase: parsed.phase === "running" ? "running" : "interstitial",
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
    persist({
      active: true,
      beatIndex: 0,
      stepIndex: 0,
      beatMaxSteps: {},
      phase: "interstitial",
    });
  }, [persist]);

  const continueToBeat = useCallback(() => {
    const beat = WALKTHROUGH_BEATS[state.beatIndex];
    if (!beat) return;
    persist({ ...state, phase: "running", stepIndex: 0 });
    setUserById(beat.personaId);
    router.push(beat.startUrl);
  }, [state, persist, router, setUserById]);

  const next = useCallback(() => {
    const beat = WALKTHROUGH_BEATS[state.beatIndex];
    if (!beat) return;
    if (state.stepIndex < beat.steps.length - 1) {
      // Advance within the beat. Track the highest step reached in this
      // beat so the awaitAction prompt can flip to Continue when the
      // tester backs into a step they've already passed.
      const newStepIdx = state.stepIndex + 1;
      const beatKey = String(state.beatIndex);
      const currentMax = state.beatMaxSteps[beatKey] ?? 0;
      persist({
        ...state,
        stepIndex: newStepIdx,
        beatMaxSteps: {
          ...state.beatMaxSteps,
          [beatKey]: Math.max(currentMax, newStepIdx),
        },
      });
    } else {
      // Past the last step → next beat's interstitial (or the closing screen).
      persist({
        ...state,
        beatIndex: Math.min(state.beatIndex + 1, WALKTHROUGH_BEAT_COUNT),
        stepIndex: 0,
        phase: "interstitial",
      });
    }
  }, [state, persist]);

  const prev = useCallback(() => {
    if (state.stepIndex > 0) {
      // Step back within the beat.
      persist({ ...state, stepIndex: state.stepIndex - 1 });
      return;
    }
    if (state.beatIndex === 0) {
      // From the first step of the first beat — re-open the opening
      // interstitial. Previously this was a dead-end (Back disabled);
      // returning to the interstitial lets the tester re-read the persona
      // handoff if they need the framing again.
      persist({ ...state, phase: "interstitial" });
      return;
    }
    // From the first step of a later beat — jump back to the previous
    // beat's LAST step (skipping its handoff interstitial, which is a
    // one-way transition, not content the tester would want to re-watch).
    // Switch persona AND route to the URL the previous beat ended on so
    // the on-surface card lands on a coherent context.
    const prevBeatIdx = state.beatIndex - 1;
    const prevBeat = WALKTHROUGH_BEATS[prevBeatIdx];
    if (!prevBeat) return;
    const lastStepIdx = prevBeat.steps.length - 1;
    // Walk the previous beat's steps from the end and pick the most-recent
    // `advanceOn` — that's the URL the tester would have navigated to last
    // in that beat (i.e., where they were when they crossed into the next
    // beat). Fallback to the beat's `startUrl`.
    let targetUrl = prevBeat.startUrl;
    for (let i = lastStepIdx; i >= 0; i--) {
      const step = prevBeat.steps[i];
      if (step.kind === "card" && step.advanceOn) {
        targetUrl = step.advanceOn;
        break;
      }
    }
    persist({
      ...state,
      beatIndex: prevBeatIdx,
      stepIndex: lastStepIdx,
      phase: "running",
    });
    setUserById(prevBeat.personaId);
    router.push(targetUrl);
  }, [state, persist, router, setUserById]);

  const skipBeat = useCallback(() => {
    // Jump past the current beat to the next beat's interstitial (or the
    // closing screen, if skipping the last beat).
    persist({
      ...state,
      beatIndex: Math.min(state.beatIndex + 1, WALKTHROUGH_BEAT_COUNT),
      stepIndex: 0,
      phase: "interstitial",
    });
  }, [state, persist]);

  const exit = useCallback(() => {
    // Exit ends the walkthrough AND wipes the demo state it mutated, for a
    // true clean slate — pause, by contrast, suspends with state intact,
    // and the closing screen's "Stay" (endAndStay) keeps the world as the
    // walkthrough left it.
    //
    // A hard navigation to `/` (the landing page / demo launcher), not
    // router.push: exit can fire from a page with its own redirect guard
    // — the active-session page bounces itself the moment `clearDemoStorage`
    // reverts its in-progress session — and a soft push races with that. A
    // full load tears the current page down decisively, and cleared storage
    // means the landing page (and the re-seeded contexts) load fresh.
    clearDemoStorage();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

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

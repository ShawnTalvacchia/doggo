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
 *   - `beatIndex === beat count`              — the closing interstitial
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
import { getBeat, getBeatCount, WALKTHROUGH_LIST } from "@/lib/walkthroughBeats";

const SESSION_KEY = "doggo-walkthrough";

type WalkthroughPhase = "interstitial" | "running";

type PersistedState = {
  active: boolean;
  /** Which walkthrough is running (registry id from `walkthroughBeats.ts`). */
  walkthroughId: string;
  beatIndex: number;
  stepIndex: number;
  /** Per-beat highest step index reached. Used by `WalkthroughCard` to
   *  detect "user has been past this step before" — turns the awaitAction
   *  prompt into a Continue button when the tester has backed into a
   *  step whose action they've already performed. Key is the beat index
   *  stringified; value is the max stepIndex reached in that beat. */
  beatMaxSteps: Record<string, number>;
  /** Ids of fire-off posts the tester has "Shared" during this run. The
   *  group feed hides a walkthrough fire-off post until its id lands here,
   *  so the post the card is about to Share isn't already sitting in the
   *  feed. Cleared on exit (clearDemoStorage wipes the run-state), so a
   *  free-explore session shows the seeded post normally. 2026-05-22. */
  sharedPostIds: string[];
  phase: WalkthroughPhase;
};

const DEFAULT_WALKTHROUGH_ID = WALKTHROUGH_LIST[0]?.id ?? "new-owner";

const INITIAL: PersistedState = {
  active: false,
  walkthroughId: DEFAULT_WALKTHROUGH_ID,
  beatIndex: 0,
  stepIndex: 0,
  beatMaxSteps: {},
  sharedPostIds: [],
  phase: "interstitial",
};

type WalkthroughContextValue = PersistedState & {
  /** True once sessionStorage has hydrated — components render null before this. */
  hydrated: boolean;
  /** Begin a named walkthrough at beat 0 (shows the first interstitial). */
  start: (walkthroughId: string) => void;
  /** From an interstitial: switch persona + route to the beat surface, show step 1. */
  continueToBeat: () => void;
  /** Advance one step — or, past a beat's last step, to the next beat's
   *  interstitial. Pass a `sharePostId` (fire-off "Share") to atomically mark
   *  that post Shared in the SAME state update, so the group feed reveals it
   *  without a second persist clobbering this advance. */
  next: (sharePostId?: string) => void;
  /** Step back one step — or, from a beat's first step, to the previous beat's
   *  LAST step (skipping the handoff interstitial, which is a one-way
   *  transition, not navigable content). From the very first step of the
   *  walkthrough, re-opens the opening interstitial. */
  prev: () => void;
  /** Back from a beat's handoff interstitial → the previous beat's last step
   *  (no-op / hidden at beat 0). Makes the interstitial a two-way node. */
  interstitialBack: () => void;
  /** Advance the current step if it's a card whose `advanceOnAction` matches
   *  `actionKey`. Product code fires this when a modal-opening action happens
   *  (no navigation, so `advanceOn` can't); a no-op otherwise, so it's safe to
   *  call unconditionally. */
  signalAction: (actionKey: string) => void;
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
            walkthroughId:
              typeof parsed.walkthroughId === "string"
                ? parsed.walkthroughId
                : DEFAULT_WALKTHROUGH_ID,
            beatIndex: typeof parsed.beatIndex === "number" ? parsed.beatIndex : 0,
            stepIndex: typeof parsed.stepIndex === "number" ? parsed.stepIndex : 0,
            beatMaxSteps:
              parsed.beatMaxSteps && typeof parsed.beatMaxSteps === "object"
                ? (parsed.beatMaxSteps as Record<string, number>)
                : {},
            sharedPostIds: Array.isArray(parsed.sharedPostIds)
              ? (parsed.sharedPostIds as string[])
              : [],
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

  const start = useCallback((walkthroughId: string) => {
    persist({
      active: true,
      walkthroughId,
      beatIndex: 0,
      stepIndex: 0,
      beatMaxSteps: {},
      sharedPostIds: [],
      phase: "interstitial",
    });
  }, [persist]);

  const continueToBeat = useCallback(() => {
    const beat = getBeat(state.walkthroughId, state.beatIndex);
    if (!beat) return;
    persist({ ...state, phase: "running", stepIndex: 0 });
    setUserById(beat.personaId);
    router.push(beat.startUrl);
  }, [state, persist, router, setUserById]);

  const next = useCallback((sharePostId?: string) => {
    const beat = getBeat(state.walkthroughId, state.beatIndex);
    if (!beat) return;
    // Fire-off "Share" folds in here: mark the post Shared in the SAME
    // persist as the step advance, so the feed reveals it and the advance
    // isn't lost to a separate clobbering persist.
    const sharedPostIds =
      sharePostId && !state.sharedPostIds.includes(sharePostId)
        ? [...state.sharedPostIds, sharePostId]
        : state.sharedPostIds;
    if (state.stepIndex < beat.steps.length - 1) {
      // Advance within the beat. Track the highest step reached in this
      // beat so the awaitAction prompt can flip to Continue when the
      // tester backs into a step they've already passed.
      const newStepIdx = state.stepIndex + 1;
      const beatKey = String(state.beatIndex);
      const currentMax = state.beatMaxSteps[beatKey] ?? 0;
      persist({
        ...state,
        sharedPostIds,
        stepIndex: newStepIdx,
        beatMaxSteps: {
          ...state.beatMaxSteps,
          [beatKey]: Math.max(currentMax, newStepIdx),
        },
      });
    } else {
      // Past the last step → next beat's interstitial (or the closing
      // screen). Mark the previous beat as fully completed (max = step
      // count, one past the last index) so cross-beat Back's URL routing
      // doesn't immediately bounce forward again via auto-advance.
      const prevBeatKey = String(state.beatIndex);
      const prevMax = state.beatMaxSteps[prevBeatKey] ?? 0;
      persist({
        ...state,
        sharedPostIds,
        beatIndex: Math.min(state.beatIndex + 1, getBeatCount(state.walkthroughId)),
        stepIndex: 0,
        beatMaxSteps: {
          ...state.beatMaxSteps,
          [prevBeatKey]: Math.max(prevMax, beat.steps.length),
        },
        phase: "interstitial",
      });
    }
  }, [state, persist]);

  const prev = useCallback(() => {
    if (state.stepIndex > 0) {
      // Step back within the beat. Also route to the URL the new step
      // expects so the tester lands on the correct surface — without
      // this, the card swaps but the page stays on the old step's URL
      // (confusing: the back card's instruction may not match the page).
      const newStepIdx = state.stepIndex - 1;
      persist({ ...state, stepIndex: newStepIdx });
      const beat = getBeat(state.walkthroughId, state.beatIndex);
      if (beat) {
        // Route to the surface the back-step is DISPLAYED on. A nav step's
        // own `advanceOn` is where it sends you *forward*, not where it's
        // shown — so the display surface is the most-recent `advanceOn`
        // STRICTLY BEFORE this step (start the scan at newStepIdx - 1).
        // Fallback to the beat's startUrl if no earlier step navigated.
        // (Bug pre-2026-06-22: scanning from newStepIdx routed Back to the
        // step's forward destination — often the page you're already on, so
        // Back appeared to do nothing.)
        let targetUrl = beat.startUrl;
        for (let i = newStepIdx - 1; i >= 0; i--) {
          const s = beat.steps[i];
          if (s.kind === "card" && s.advanceOn) {
            targetUrl = s.advanceOn;
            break;
          }
        }
        router.push(targetUrl);
      }
      return;
    }
    // From a beat's FIRST step — re-open THIS beat's interstitial. The forward
    // chain is interstitial → step 1, so Back from step 1 lands on the
    // interstitial (the tester can re-read the scene), instead of skipping it
    // to the previous beat. Beat 0 → the opening interstitial. Going further
    // back, to the previous beat, is the interstitial's own Back
    // (`interstitialBack`) — so the interstitial is a real two-way node.
    persist({ ...state, phase: "interstitial" });
  }, [state, persist, router]);

  const interstitialBack = useCallback(() => {
    // Back from a beat's handoff interstitial → the PREVIOUS beat's LAST step.
    // The mirror of stepping forward (prev-beat-last-step → this interstitial).
    // At beat 0 there's no previous beat, so the interstitial hides its Back.
    if (state.beatIndex === 0) return;
    const prevBeatIdx = state.beatIndex - 1;
    const prevBeat = getBeat(state.walkthroughId, prevBeatIdx);
    if (!prevBeat) return;
    const lastStepIdx = prevBeat.steps.length - 1;
    // Route to the surface the previous beat's LAST step is displayed on — the
    // most-recent `advanceOn` STRICTLY BEFORE it. Fallback to startUrl.
    let targetUrl = prevBeat.startUrl;
    for (let i = lastStepIdx - 1; i >= 0; i--) {
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

  const signalAction = useCallback(
    (actionKey: string) => {
      if (!state.active || state.phase !== "running") return;
      const beat = getBeat(state.walkthroughId, state.beatIndex);
      const step = beat?.steps[state.stepIndex];
      if (!step || step.kind !== "card" || step.advanceOnAction !== actionKey) return;
      // No visited-past guard here (unlike the URL auto-advance): firing an
      // action signal is ALWAYS an explicit act (the tester re-performed it),
      // never a passive landing — so advancing is always what they want, even
      // after backing into the step.
      next();
    },
    [state, next],
  );

  const skipBeat = useCallback(() => {
    // Jump past the current beat to the next beat's interstitial (or the
    // closing screen, if skipping the last beat).
    persist({
      ...state,
      beatIndex: Math.min(state.beatIndex + 1, getBeatCount(state.walkthroughId)),
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
      interstitialBack,
      signalAction,
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
      interstitialBack,
      signalAction,
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

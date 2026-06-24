"use client";

/**
 * WalkthroughInterstitial — the full-screen persona-handoff screen.
 *
 * Renders between beats when the Guided Walkthrough is `active` and in
 * `interstitial` phase. Covers the viewport so the tester never sees the
 * persona swap. Two variants:
 *   - beat interstitial (`beatIndex < beat count`) — "you're now
 *     {persona}", situational context, the task, Continue / Pause.
 *   - closing interstitial (`beatIndex === beat count`) — end of
 *     the walkthrough, Pick-another-persona / Stay.
 *
 * While a beat interstitial is showing, the beat's `startUrl` is warmed so
 * tapping Continue lands on an already-ready route: `router.prefetch` in
 * production, plus a plain GET in dev (where `router.prefetch` is a no-op
 * and first-visit route compilation is the real cost).
 *
 * Spec: `docs/features/demo-mode.md` → "Guided Walkthrough — UX design spec".
 * Mounted globally in `app/layout.tsx`; returns null outside the walkthrough.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { getBeat, getBeatCount, getWalkthrough } from "@/lib/walkthroughBeats";
import { getDeferredNotification } from "@/lib/mockNotifications";
import { getPersona } from "@/lib/personas";

export function WalkthroughInterstitial() {
  const wt = useWalkthrough();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { vouchViaMentor } = useWalkerApplications();

  // Warm the upcoming beat's surface while the full-screen handoff is up,
  // so tapping Continue lands on an already-ready route instead of waiting
  // on it then. Hooks run unconditionally (before the early returns
  // below); the warm only fires for a live beat interstitial.
  const prefetchUrl =
    wt.active && wt.phase === "interstitial"
      ? getBeat(wt.walkthroughId, wt.beatIndex)?.startUrl
      : undefined;
  useEffect(() => {
    if (!prefetchUrl) return;
    if (process.env.NODE_ENV === "development") {
      // `router.prefetch` is a no-op under `next dev`, where the real cost
      // is the route's first-visit on-demand compilation. A plain GET makes
      // the dev server compile that segment now, so Continue lands fast.
      // The discarded response is a harmless page render.
      fetch(prefetchUrl).catch(() => {});
    } else {
      // Production: prefetch the route's RSC payload so Continue is instant.
      router.prefetch(prefetchUrl);
    }
  }, [prefetchUrl, router]);

  if (!wt.hydrated || !wt.active) return null;

  // ── Mid-beat interstitial step (time-passage / explainer) ──────────────
  // During a running beat, a step of kind "interstitial" renders full-screen
  // here; the on-surface card stands down until it's dismissed.
  if (wt.phase === "running") {
    const beat = getBeat(wt.walkthroughId, wt.beatIndex);
    const step = beat?.steps[wt.stepIndex];
    if (!step || step.kind !== "interstitial") return null;
    // Fire any deferred narrative notifications this interstitial carries
    // (e.g. Magda's reach-out, held back until the time-passage), then
    // advance. Idempotent — addNotification upserts by id.
    const handleContinue = () => {
      if (step.fireNotifications) {
        for (const id of step.fireNotifications) {
          const payload = getDeferredNotification(id);
          if (payload) addNotification(payload);
        }
      }
      // A2 pre-staging: fast-forward the walker to mentor-vouched (idempotent),
      // so the next beat's gated affordances (e.g. "Walk Nora") are available
      // without a hand-driven demo toggle.
      if (step.fireWalkerVouch) {
        const { userId, shelterId, mentor } = step.fireWalkerVouch;
        vouchViaMentor(userId, shelterId, mentor);
      }
      wt.next();
    };
    return (
      <div
        className="wt-interstitial"
        role="dialog"
        aria-modal="true"
        aria-label={step.heading}
      >
        <div
          className={`wt-interstitial-sheet${step.mode === "probe" ? " wt-interstitial-sheet--probe" : ""}`}
        >
          <span className="wt-interstitial-eyebrow">{step.eyebrow}</span>
          <h2 className="wt-interstitial-heading">{step.heading}</h2>
          <p className="wt-interstitial-context">{step.body}</p>
          <div className="wt-interstitial-actions">
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--secondary"
              onClick={wt.prev}
            >
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--primary"
              onClick={handleContinue}
            >
              Continue
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <button type="button" className="wt-card-exit" onClick={wt.exit}>
            Exit walkthrough
          </button>
        </div>
      </div>
    );
  }

  // ── Closing interstitial ───────────────────────────────────────────────
  if (wt.beatIndex >= getBeatCount(wt.walkthroughId)) {
    const closing = getWalkthrough(wt.walkthroughId)?.closing;
    return (
      <div className="wt-interstitial" role="dialog" aria-modal="true" aria-label="End of walkthrough">
        <div className="wt-interstitial-sheet">
          <span className="wt-interstitial-eyebrow">Demo walkthrough</span>
          <h2 className="wt-interstitial-heading">
            {closing?.heading ?? "End of walkthrough."}
          </h2>
          <p className="wt-interstitial-context">
            {closing?.body ??
              "Want to keep exploring?"}
          </p>
          <div className="wt-interstitial-actions">
            {/* Back to the last beat's last step — review without restarting. */}
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--secondary"
              onClick={wt.interstitialBack}
            >
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              Back
            </button>
            {/* Finish → back to the launcher + reset the demo (exit). */}
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--primary"
              onClick={wt.exit}
            >
              Complete walkthrough
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Beat interstitial ──────────────────────────────────────────────────
  // Scene-setting only — names the persona + the situation. The task is NOT
  // listed here; the on-surface card walks the steps once the beat begins.
  const beat = getBeat(wt.walkthroughId, wt.beatIndex);
  if (!beat) return null;
  const persona = getPersona(beat.personaId);
  if (!persona) return null;
  const { user } = persona;
  // A beat whose persona matches the previous beat's is a *continuation*
  // (same person, time has passed) rather than a persona handoff — so the
  // interstitial reads as a time-passage ("Later that day.") instead of
  // re-introducing "You're now Daniel." (Multi-Path Demo: W1 is two
  // consecutive Daniel beats with the walk in between.)
  const prevBeat =
    wt.beatIndex > 0 ? getBeat(wt.walkthroughId, wt.beatIndex - 1) : undefined;
  const isContinuation = !!prevBeat && prevBeat.personaId === beat.personaId;

  return (
    <div
      className="wt-interstitial"
      role="dialog"
      aria-modal="true"
      aria-label={`Walkthrough — beat ${beat.n} of ${getBeatCount(wt.walkthroughId)}`}
    >
      <div className="wt-interstitial-sheet">
        <div className="wt-interstitial-toprow">
          <span className="wt-interstitial-eyebrow">
            Beat {beat.n} of {getBeatCount(wt.walkthroughId)}
            {!isContinuation && ` · ${beat.when}`}
          </span>
          <button
            type="button"
            className="wt-interstitial-skip"
            onClick={wt.skipBeat}
          >
            Skip beat
            <ArrowRight size={12} weight="bold" aria-hidden="true" />
          </button>
        </div>
        <div className="wt-interstitial-head">
          <img
            src={user.avatarUrl}
            alt=""
            className="wt-interstitial-avatar"
          />
          <div className="wt-interstitial-identity">
            <h2 className="wt-interstitial-heading">
              {isContinuation
                ? `${beat.when}.`
                : `You’re now ${user.firstName}.`}
            </h2>
            {!isContinuation && (
              <p className="wt-interstitial-sub">
                {user.firstName} {user.lastName} · {persona.archetype}
              </p>
            )}
          </div>
        </div>
        <p className="wt-interstitial-context">{beat.context}</p>
        <div className="wt-interstitial-actions">
          {/* Left slot mirrors the step card's Back position. Beat > 0 → Back to
              the previous beat's last step (the interstitial is a two-way node);
              beat 0 → Exit (no prior beat), so the row always has a left action. */}
          {wt.beatIndex > 0 ? (
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--secondary"
              onClick={wt.interstitialBack}
            >
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              Back
            </button>
          ) : (
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--secondary"
              onClick={wt.exit}
            >
              {/* Same back arrow as the Back button in later interstitials — it
                  occupies the Back slot here (beat 0 has no prior beat). */}
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              Exit walkthrough
            </button>
          )}
          <button
            type="button"
            className="wt-interstitial-btn wt-interstitial-btn--primary"
            onClick={wt.continueToBeat}
          >
            {/* A same-persona continuation isn't a handoff — no need to
                re-announce the persona we're already playing. */}
            {isContinuation ? "Continue" : `Continue as ${user.firstName}`}
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
        {/* Bottom Exit link (matches the step card) — only when the left slot is
            Back; at beat 0 Exit already sits in the row, so no duplicate. */}
        {wt.beatIndex > 0 && (
          <button type="button" className="wt-card-exit" onClick={wt.exit}>
            Exit walkthrough
          </button>
        )}
      </div>
    </div>
  );
}

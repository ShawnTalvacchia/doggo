"use client";

/**
 * WalkthroughInterstitial — the full-screen persona-handoff screen.
 *
 * Renders between beats when the Guided Walkthrough is `active`, in
 * `interstitial` phase, and not paused. Covers the viewport so the tester
 * never sees the persona swap. Two variants:
 *   - beat interstitial (`beatIndex < WALKTHROUGH_BEAT_COUNT`) — "you're now
 *     {persona}", situational context, the task, Continue / Pause.
 *   - closing interstitial (`beatIndex === WALKTHROUGH_BEAT_COUNT`) — end of
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
import { ArrowRight } from "@phosphor-icons/react";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { WALKTHROUGH_BEATS, WALKTHROUGH_BEAT_COUNT } from "@/lib/walkthroughBeats";
import { getPersona } from "@/lib/personas";

export function WalkthroughInterstitial() {
  const wt = useWalkthrough();
  const router = useRouter();

  // Warm the upcoming beat's surface while the full-screen handoff is up,
  // so tapping Continue lands on an already-ready route instead of waiting
  // on it then. Hooks run unconditionally (before the early returns
  // below); the warm only fires for a live beat interstitial.
  const prefetchUrl =
    wt.active && wt.phase === "interstitial" && !wt.paused
      ? WALKTHROUGH_BEATS[wt.beatIndex]?.startUrl
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

  if (!wt.hydrated || !wt.active || wt.phase !== "interstitial" || wt.paused) {
    return null;
  }

  // ── Closing interstitial ───────────────────────────────────────────────
  if (wt.beatIndex >= WALKTHROUGH_BEAT_COUNT) {
    const lastBeat = WALKTHROUGH_BEATS[WALKTHROUGH_BEAT_COUNT - 1];
    const lastPersona = lastBeat ? getPersona(lastBeat.personaId) : undefined;
    const lastName = lastPersona?.user.firstName ?? "this persona";
    return (
      <div className="wt-interstitial" role="dialog" aria-modal="true" aria-label="End of walkthrough">
        <div className="wt-interstitial-sheet">
          <span className="wt-interstitial-eyebrow">Demo walkthrough</span>
          <h2 className="wt-interstitial-heading">End of walkthrough.</h2>
          <p className="wt-interstitial-context">
            You&rsquo;ve followed four personas through one weekend in the Doggo
            community — from a first group session to a neighbour&rsquo;s
            evening favour to a steady weekly routine. Want to keep exploring?
          </p>
          <div className="wt-interstitial-actions">
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--primary"
              onClick={wt.exit}
            >
              Pick another persona
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="wt-interstitial-btn wt-interstitial-btn--secondary"
              onClick={wt.endAndStay}
            >
              Stay as {lastName}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Beat interstitial ──────────────────────────────────────────────────
  // Scene-setting only — names the persona + the situation. The task is NOT
  // listed here; the on-surface card walks the steps once the beat begins.
  const beat = WALKTHROUGH_BEATS[wt.beatIndex];
  if (!beat) return null;
  const persona = getPersona(beat.personaId);
  if (!persona) return null;
  const { user } = persona;

  return (
    <div
      className="wt-interstitial"
      role="dialog"
      aria-modal="true"
      aria-label={`Walkthrough — beat ${beat.n} of ${WALKTHROUGH_BEAT_COUNT}`}
    >
      <div className="wt-interstitial-sheet">
        <div className="wt-interstitial-toprow">
          <span className="wt-interstitial-eyebrow">
            Beat {beat.n} of {WALKTHROUGH_BEAT_COUNT} · {beat.when}
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
            <h2 className="wt-interstitial-heading">You&rsquo;re now {user.firstName}.</h2>
            <p className="wt-interstitial-sub">
              {user.firstName} {user.lastName} · {persona.archetype}
            </p>
          </div>
        </div>
        <p className="wt-interstitial-context">{beat.context}</p>
        <div className="wt-interstitial-actions">
          <button
            type="button"
            className="wt-interstitial-btn wt-interstitial-btn--primary"
            onClick={wt.continueToBeat}
          >
            Continue as {user.firstName}
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="wt-interstitial-btn wt-interstitial-btn--secondary"
            onClick={wt.pause}
          >
            Pause walkthrough
          </button>
        </div>
      </div>
    </div>
  );
}

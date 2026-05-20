"use client";

/**
 * WalkthroughCard — the persistent on-surface step card.
 *
 * Rides along on every surface for the duration of a beat (Guided
 * Walkthrough `active`, `running` phase). Walks the tester through the
 * beat's ordered steps one at a time — instruction + optional detail —
 * with Prev/Next driving the sequencer. Past a beat's last step, Next lands
 * on the next beat's interstitial.
 *
 * Navigation steps carry an `advanceOn` pathname. The tester can reach it
 * either way — by using the in-app control the step describes, or by
 * tapping the card's Next (which routes there for them). On arrival the
 * card moves itself forward, so a "go to Meets" step never sits stale once
 * the tester is on Meets. `awaitAction` steps omit the Next button — they
 * advance only when the in-app action navigates.
 *
 * The minimise control shrinks the card to a slim "Walkthrough" pill;
 * tapping the pill restores it. That's a card-local view toggle — the
 * walkthrough keeps running either way, and there's no menu in between.
 * Leaving the walkthrough is the quiet "Exit walkthrough" link in the
 * footer. Minimised state resets on every step change so a new
 * instruction is always shown.
 *
 * Dark "system chrome" treatment (card + interstitial share it) so the
 * walkthrough reads as a guide layer, distinct from the platform UI.
 *
 * Spec: `docs/features/demo-mode.md` → "On-surface step card".
 */

import { Fragment, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  PaperPlaneTilt,
  Minus,
  Compass,
} from "@phosphor-icons/react";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { WALKTHROUGH_BEATS, WALKTHROUGH_BEAT_COUNT } from "@/lib/walkthroughBeats";
import { getPersona } from "@/lib/personas";

/** Render `**bold**` spans (UI labels in step copy) as <strong>. */
function renderEmphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((seg, i) =>
    i % 2 === 1 ? <strong key={i}>{seg}</strong> : <Fragment key={i}>{seg}</Fragment>,
  );
}

export function WalkthroughCard() {
  const wt = useWalkthrough();
  const pathname = usePathname();
  const router = useRouter();
  const [minimized, setMinimized] = useState(false);

  // Restore the card whenever the beat OR step changes — a new step means a
  // new instruction the tester needs to see.
  useEffect(() => {
    setMinimized(false);
  }, [wt.beatIndex, wt.stepIndex]);

  // Auto-advance: when the tester *navigates* to a navigation step's target
  // surface, move the card forward so it never shows a step already done.
  // Gated on an actual pathname change — without that guard, stepping back
  // (Prev) onto a nav step whose `advanceOn` equals the page you're already
  // on would instantly bounce forward again.
  const lastPathRef = useRef(pathname);
  useEffect(() => {
    if (!wt.active || wt.phase !== "running") {
      lastPathRef.current = pathname;
      return;
    }
    const navigated = pathname !== lastPathRef.current;
    lastPathRef.current = pathname;
    if (!navigated) return;
    const b = WALKTHROUGH_BEATS[wt.beatIndex];
    const s = b?.steps[wt.stepIndex];
    if (s && s.kind === "card" && s.advanceOn && s.advanceOn === pathname) {
      wt.next();
    }
  }, [pathname, wt]);

  if (!wt.hydrated || !wt.active || wt.phase !== "running") return null;

  const beat = WALKTHROUGH_BEATS[wt.beatIndex];
  if (!beat) return null;
  const step = beat.steps[wt.stepIndex];
  if (!step) return null;
  // Mid-beat interstitial steps render full-screen via WalkthroughInterstitial —
  // the card stands down while one is showing.
  if (step.kind === "interstitial") return null;

  const persona = getPersona(beat.personaId);
  const personaName = persona?.user.firstName ?? beat.personaId;
  const isLast =
    wt.beatIndex >= WALKTHROUGH_BEAT_COUNT - 1 &&
    wt.stepIndex >= beat.steps.length - 1;
  // The counter numbers card steps only — mid-beat interstitials don't count.
  const cardSteps = beat.steps.filter((s) => s.kind === "card");
  const cardNumber = cardSteps.indexOf(step) + 1;

  // ── Minimised: a slim pill, tap to restore ─────────────────────────────
  if (minimized) {
    return (
      <button
        type="button"
        className="wt-pill"
        onClick={() => setMinimized(false)}
        aria-label="Expand walkthrough"
      >
        <Compass size={15} weight="bold" aria-hidden="true" />
        <span className="wt-pill-label">Walkthrough</span>
        <span className="wt-pill-counter">
          {cardNumber}/{cardSteps.length}
        </span>
      </button>
    );
  }

  // "Next" on a navigation step routes the tester to the step's target
  // surface — the same place the in-app control the step describes would
  // take them — and the auto-advance effect then moves the card forward on
  // arrival. Action steps (and the case where the tester is already on the
  // target) just advance the sequencer directly.
  const handleNext = () => {
    if (step.advanceOn && pathname !== step.advanceOn) {
      router.push(step.advanceOn);
    } else {
      wt.next();
    }
  };

  return (
    <div
      className="wt-card"
      role="dialog"
      aria-label={`Walkthrough — beat ${beat.n}, step ${cardNumber} of ${cardSteps.length}`}
    >
      <div className="wt-card-head">
        <span className="wt-card-tag">
          <Compass size={12} weight="bold" aria-hidden="true" />
          {personaName}
        </span>
        <span className="wt-card-counter">
          Step {cardNumber} of {cardSteps.length}
        </span>
        <button
          type="button"
          className="wt-card-min"
          onClick={() => setMinimized(true)}
          aria-label="Minimize walkthrough"
        >
          <Minus size={16} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <p className="wt-card-instruction">{renderEmphasis(step.instruction)}</p>

      {step.fireOff && (
        <div className="wt-card-fireoff">
          <img
            src={step.fireOff.imageUrl}
            alt=""
            className="wt-card-fireoff-img"
          />
          <p className="wt-card-fireoff-caption">{step.fireOff.caption}</p>
        </div>
      )}

      {step.detail && (
        <p className="wt-card-detail">{renderEmphasis(step.detail)}</p>
      )}

      <div className="wt-card-footer">
        <button
          type="button"
          className="wt-card-prev"
          onClick={wt.prev}
        >
          <ArrowLeft size={13} weight="bold" aria-hidden="true" />
          Back
        </button>
        {step.awaitAction ? (
          // No "Next" — the step advances only when the tester performs the
          // in-app action and the resulting navigation arrives at `advanceOn`.
          <span className="wt-card-await">Do this step to continue</span>
        ) : (
          <button
            type="button"
            className="wt-card-next"
            onClick={handleNext}
          >
            {step.fireOff ? "Share" : isLast ? "Finish" : "Next"}
            {step.fireOff ? (
              <PaperPlaneTilt size={14} weight="bold" aria-hidden="true" />
            ) : (
              !isLast && (
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              )
            )}
          </button>
        )}
      </div>

      <button type="button" className="wt-card-exit" onClick={wt.exit}>
        Exit walkthrough
      </button>
    </div>
  );
}

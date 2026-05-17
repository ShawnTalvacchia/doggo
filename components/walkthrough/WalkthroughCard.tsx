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
 * the tester is on Meets.
 *
 * The ✕ in the header pauses the walkthrough immediately, shrinking the
 * card to a slim "Walkthrough" pill. Tapping the pill opens a small menu
 * with three full-width choices — Resume / Keep paused / Exit.
 *
 * Adapted from the retired `TourOverlay`: same desktop-bottom-left-float /
 * mobile-bottom-accordion placement + collapse behaviour, reusing the
 * `.tour-overlay*` CSS. Reads `WalkthroughContext` (not URL params).
 *
 * Spec: `docs/features/demo-mode.md` → "On-surface step card".
 */

import { Fragment, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Compass,
  CaretDown,
  CaretUp,
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
  const [collapsed, setCollapsed] = useState(false);
  const [pausedMenuOpen, setPausedMenuOpen] = useState(false);

  // Auto-expand the card whenever the beat OR step changes.
  useEffect(() => {
    setCollapsed(false);
  }, [wt.beatIndex, wt.stepIndex]);

  // Once the walkthrough is no longer paused, reset the paused menu to its
  // collapsed pill — so the next pause opens to the pill, not the menu.
  useEffect(() => {
    if (!wt.paused) setPausedMenuOpen(false);
  }, [wt.paused]);

  // Auto-advance: when the tester navigates to a navigation step's target
  // surface, move the card forward so it never shows a step already done.
  useEffect(() => {
    if (!wt.active || wt.phase !== "running" || wt.paused) return;
    const b = WALKTHROUGH_BEATS[wt.beatIndex];
    const s = b?.steps[wt.stepIndex];
    if (s?.advanceOn && s.advanceOn === pathname) {
      wt.next();
    }
  }, [pathname, wt]);

  if (!wt.hydrated || !wt.active) return null;

  // ── Paused: collapsed pill, or the expanded three-choice menu ──────────
  if (wt.paused) {
    if (!pausedMenuOpen) {
      return (
        <button
          type="button"
          className="wt-paused-pill"
          onClick={() => setPausedMenuOpen(true)}
          aria-label="Open walkthrough menu"
        >
          <Compass size={16} weight="bold" aria-hidden="true" />
          Walkthrough
        </button>
      );
    }
    return (
      <div className="wt-paused-menu" role="dialog" aria-label="Walkthrough paused">
        <div className="wt-paused-menu-head">
          <span className="tour-overlay-tag">
            <Compass size={12} weight="bold" aria-hidden="true" />
            Walkthrough paused
          </span>
        </div>
        <button
          type="button"
          className="wt-paused-btn wt-paused-btn--primary"
          onClick={wt.resume}
        >
          Resume walkthrough
        </button>
        <button
          type="button"
          className="wt-paused-btn wt-paused-btn--secondary"
          onClick={() => setPausedMenuOpen(false)}
        >
          Keep paused
        </button>
        <button
          type="button"
          className="wt-paused-btn wt-paused-btn--danger"
          onClick={wt.exit}
        >
          Exit walkthrough
        </button>
      </div>
    );
  }

  if (wt.phase !== "running") return null;

  const beat = WALKTHROUGH_BEATS[wt.beatIndex];
  if (!beat) return null;
  const step = beat.steps[wt.stepIndex];
  if (!step) return null;
  const persona = getPersona(beat.personaId);
  const personaName = persona?.user.firstName ?? beat.personaId;
  const stepCount = beat.steps.length;
  const isFirst = wt.beatIndex <= 0 && wt.stepIndex <= 0;
  const isLast =
    wt.beatIndex >= WALKTHROUGH_BEAT_COUNT - 1 && wt.stepIndex >= stepCount - 1;

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
      className={`tour-overlay${collapsed ? " tour-overlay--collapsed" : ""}`}
      role="dialog"
      aria-label={`Walkthrough — beat ${beat.n}, step ${wt.stepIndex + 1} of ${stepCount}`}
    >
      <div className="tour-overlay-meta">
        <span className="tour-overlay-tag">
          <Compass size={12} weight="bold" aria-hidden="true" />
          {personaName}
        </span>
        <span className="tour-overlay-counter">
          Step {wt.stepIndex + 1} of {stepCount}
        </span>
        <button
          type="button"
          className="tour-overlay-collapse"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand walkthrough card" : "Collapse walkthrough card"}
          aria-expanded={!collapsed}
        >
          {collapsed
            ? <CaretUp size={14} weight="bold" aria-hidden="true" />
            : <CaretDown size={14} weight="bold" aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="tour-overlay-exit"
          onClick={wt.pause}
          aria-label="Pause walkthrough"
        >
          <X size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>

      {!collapsed && (
        <>
          <p className="tour-overlay-body">{renderEmphasis(step.instruction)}</p>
          {step.detail && (
            <p className="wt-card-detail">{renderEmphasis(step.detail)}</p>
          )}
          <div className="tour-overlay-actions">
            <button
              type="button"
              className="tour-overlay-btn tour-overlay-btn--secondary"
              onClick={wt.prev}
              disabled={isFirst}
            >
              <ArrowLeft size={14} weight="bold" aria-hidden="true" />
              Prev
            </button>
            <button
              type="button"
              className="tour-overlay-btn tour-overlay-btn--primary"
              onClick={handleNext}
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ArrowRight size={14} weight="bold" aria-hidden="true" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

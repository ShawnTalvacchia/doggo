"use client";

/**
 * /demo — demo entry + persona picker.
 *
 * Standalone page (no AppNav/Sidebar/BottomNav — see GuestLayout). Two sections:
 *   1. **Guided story** — a "Start guided walkthrough" launcher + a preview of
 *      the four-beat narrative (`lib/walkthroughBeats.ts`). Tapping Start opens
 *      the first interstitial (`WalkthroughContext.start()`); the auto-switching
 *      Guided Walkthrough takes over from there.
 *   2. **Explore freely** — flat persona pills for free Open View exploration.
 *
 * History: the stale single-persona Tereza `TourOverlay` entry was removed
 * 2026-05-17 (Demo Narrative & Personas W5); the manual beat list that
 * replaced it was upgraded to the real auto-switching walkthrough launcher
 * 2026-05-17 (Guided Walkthrough Build D1).
 *
 * Placement decision (D1, persona-wiring.md): a standalone route was picked so
 * it survives landing changes and is shareable (Slack a tester `…/demo`).
 */

import Link from "next/link";
import {
  ArrowRight,
  House,
  ArrowCounterClockwise,
  Compass,
} from "@phosphor-icons/react";
import { getPersona } from "@/lib/personas";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { WALKTHROUGH_BEATS, WALKTHROUGH_BEAT_COUNT } from "@/lib/walkthroughBeats";
import { resetPersistedState } from "@/lib/usePersistedState";
import { DemoPersonaDropdown } from "@/components/demo/DemoPersonaDropdown";
import "./demo.css";

/** Wipe every `doggo:*` localStorage key. Mirror of the helper in
 *  ProfileNameDropdown — both surfaces support the same reset semantics. */
function clearDemoLocalStorage() {
  if (typeof window === "undefined") return;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("doggo"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore — private browsing / storage disabled.
  }
  // Wipe the module-level usePersistedState cache too, otherwise mounted
  // components keep reading stale post-reset state from memory until a
  // full page reload swaps the modules. 2026-05-08.
  resetPersistedState("doggo");
}

export default function DemoPage() {
  const { resetToDefault } = useDemoState();
  const walkthrough = useWalkthrough();

  function handleReset() {
    clearDemoLocalStorage();
    resetToDefault();
    // Hard reload (not router.refresh) so local component state on
    // any back-stack page also gets wiped. See the parallel comment
    // in `ProfileNameDropdown.handleReset` for rationale. CCFT
    // walkthrough 2026-05-11.
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <div className="demo-page">
      <div className="demo-shell">
        <header className="demo-header">
          <div className="demo-brand">DOGGO · Prototype</div>
          <h1 className="demo-title">Demo</h1>
        </header>

        {/* ── Guided story — launch the walkthrough ────────────────────── */}
        <section className="demo-section">
          <div className="demo-section-header">
            <Compass size={18} weight="bold" aria-hidden="true" />
            <span>Guided walkthrough</span>
          </div>
          <p className="demo-section-note">
            Four beats, four personas, one weekend in the Doggo community. The
            walkthrough switches personas for you and keeps the current step on
            screen the whole way — {WALKTHROUGH_BEAT_COUNT} beats, about 25 minutes.
          </p>
          <button
            type="button"
            className="demo-start-btn"
            onClick={walkthrough.start}
          >
            <Compass size={16} weight="bold" aria-hidden="true" />
            Start guided walkthrough
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
          <ol className="demo-beat-preview">
            {WALKTHROUGH_BEATS.map((beat) => {
              const persona = getPersona(beat.personaId);
              const name = persona?.user.firstName ?? beat.personaId;
              return (
                <li key={beat.n} className="demo-beat-preview-item">
                  <span className="demo-beat-num">{beat.n}</span>
                  <div className="demo-beat-preview-text">
                    <span className="demo-beat-preview-head">
                      {name} · <span className="demo-beat-preview-when">{beat.when}</span>
                    </span>
                    <span className="demo-beat-preview-task">{beat.summary}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── Explore freely — persona dropdown picker ─────────────────── */}
        <section className="demo-section">
          <div className="demo-section-header">
            <span>Or explore freely</span>
          </div>
          <p className="demo-section-note">
            Skip the script — drop into any persona and poke around.
          </p>
          <DemoPersonaDropdown />
        </section>

        <footer className="demo-footer">
          <button
            type="button"
            className="demo-reset-link"
            onClick={handleReset}
          >
            <ArrowCounterClockwise size={14} weight="bold" />
            Reset demo state
          </button>
          <Link href="/" className="demo-back-link">
            <House size={14} weight="bold" />
            Back to landing
          </Link>
        </footer>
      </div>
    </div>
  );
}

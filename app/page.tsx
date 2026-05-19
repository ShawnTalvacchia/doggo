"use client";

/**
 * Landing page — the demo's front door.
 *
 * Standalone and chrome-free (GuestLayout treats `/` as a standalone
 * route — no AppNav, Sidebar, or BottomNav). The whole prototype sits
 * behind the `proxy.ts` password gate; this is the first surface past it.
 *
 * Two ways in:
 *   - "Start the walkthrough" — the guided concept story. Resets demo
 *     state first so the scripted run always begins on a clean seed.
 *   - the persona picker — free Open View exploration as any persona.
 *
 * History: the standalone `/demo` route was folded into this page
 * 2026-05-19 — one front door instead of landing → /demo. The prior
 * marketing landing page was retired at the same time.
 */

import { ArrowRight, ArrowCounterClockwise, Compass } from "@phosphor-icons/react";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { clearDemoStorage } from "@/lib/demoReset";
import { DemoPersonaDropdown } from "@/components/demo/DemoPersonaDropdown";
import { ButtonAction } from "@/components/ui/ButtonAction";
import "./page.css";

export default function LandingPage() {
  const { resetToDefault } = useDemoState();
  const walkthrough = useWalkthrough();

  function handleStartWalkthrough() {
    // The walkthrough is a scripted demo — it must run against the
    // canonical mock-data seed. Reset to a clean slate first, then start.
    // No reload needed: clearing the persisted-state cache re-seeds the
    // contexts in place, and the walkthrough navigates forward into
    // freshly mounted pages.
    clearDemoStorage();
    resetToDefault();
    walkthrough.start();
  }

  function handleReset() {
    clearDemoStorage();
    resetToDefault();
    // Hard reload so any local component state on back-stack pages is
    // wiped too. Mirrors ProfileNameDropdown's reset.
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <div className="demo-page">
      <div className="demo-shell">
        <span className="demo-eyebrow">Prototype · Prague</span>
        <img src="/logo.svg" alt="Doggo" className="demo-logo" />
        <p className="demo-tagline">
          Meet local dog owners on walks, build real trust, and find care in
          people you already know.
        </p>

        <div className="demo-actions">
          <button
            type="button"
            className="demo-start-btn"
            onClick={handleStartWalkthrough}
          >
            <Compass size={18} weight="bold" aria-hidden="true" />
            Start the walkthrough
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
          <p className="demo-start-note">A narrated story, about 15 minutes.</p>

          <span className="demo-secondary-label">or explore as a persona</span>
          <DemoPersonaDropdown />
        </div>
      </div>

      <div className="demo-reset-row">
        <ButtonAction
          variant="tertiary"
          size="sm"
          leftIcon={<ArrowCounterClockwise size={13} weight="bold" />}
          onClick={handleReset}
        >
          Reset demo state
        </ButtonAction>
      </div>
    </div>
  );
}

"use client";

/**
 * Landing page — the demo's front door (root route /).
 *
 * Standalone and chrome-free (GuestLayout treats `/` as a standalone route —
 * no AppNav, Sidebar, or BottomNav). The whole prototype sits behind the
 * `proxy.ts` password gate; this is the first surface past it.
 *
 * Layout (2026-06-22 rebuild, Multi-Path Demo): a single centered column —
 * logo + DEMO, headline + tagline, the guided-walkthrough doors (one per
 * WALKTHROUGH_LIST entry, the primary path), and one quiet "look around
 * freely" door that drops into the app as the default persona. Replaced the
 * earlier two-half cast-card showcase: the five cast cards competed with the
 * guided doors and duplicated the profile-page persona switcher (you change
 * characters from the profile name dropdown).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowCounterClockwise,
  Compass,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { WALKTHROUGH_LIST } from "@/lib/walkthroughBeats";
import { clearDemoStorage } from "@/lib/demoReset";
import { ButtonAction } from "@/components/ui/ButtonAction";
import "./page.css";

export default function LandingPage() {
  const router = useRouter();
  const { resetToDefault } = useDemoState();
  const walkthrough = useWalkthrough();

  // Hide the Reset action when there's nothing to reset — no `doggo*`
  // entries in storage means the demo has never been touched. Starts false
  // (matches the SSR snapshot); the effect upgrades it after hydration.
  const [hasDemoState, setHasDemoState] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasKey = (store: Storage) =>
      Object.keys(store).some((k) => k.startsWith("doggo"));
    setHasDemoState(
      hasKey(window.localStorage) || hasKey(window.sessionStorage),
    );
  }, []);

  function handleStartWalkthrough(walkthroughId: string) {
    // Scripted demo must run against the canonical mock-data seed. Reset
    // first, then start; clearing the persisted cache re-seeds contexts in
    // place and the walkthrough navigates forward into freshly mounted pages.
    clearDemoStorage();
    resetToDefault();
    walkthrough.start(walkthroughId);
  }

  function handleExploreFreely() {
    // End any walkthrough, drop into the app as the default persona (Tereza).
    // Characters switch from the profile name dropdown — no per-persona cards
    // here. Demo state (bookings etc.) is preserved, mirroring the old
    // "Explore as <name>" behaviour.
    walkthrough.endAndStay();
    resetToDefault();
    router.push("/home");
  }

  function handleReset() {
    clearDemoStorage();
    resetToDefault();
    // Hard reload so any local component state on back-stack pages is wiped too.
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <div className="demo-page">
      <header className="demo-header">
        <img src="/logo.svg" alt="Doggo" className="demo-logo" />
        <span className="demo-eyebrow">Demo</span>
      </header>

      <main className="demo-main">
        <div className="demo-main-inner">
          <div className="demo-hero">
            <h1 className="demo-headline">
              <span className="demo-headline-primary">Your dog finds friends.</span>{" "}
              <span className="demo-headline-brand">You find people you trust.</span>
            </h1>
            <p className="demo-tagline">
              Meet local owners and trainers, build real trust, and find care
              from people you already know.
            </p>
          </div>

          {/* Primary: the guided-walkthrough cards, one per registered path, in a row. */}
          <div className="demo-section">
            <span className="demo-doors-eyebrow">
              <Compass size={13} weight="bold" aria-hidden="true" />
              Guided walkthroughs
            </span>
            <div className="demo-walk-grid">
              {WALKTHROUGH_LIST.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className="demo-walk-card"
                  onClick={() => handleStartWalkthrough(w.id)}
                >
                  <span className="demo-walk-card-title">{w.displayName}</span>
                  <span className="demo-walk-card-blurb">{w.blurb}</span>
                  <ArrowRight
                    size={18}
                    weight="bold"
                    aria-hidden="true"
                    className="demo-walk-card-go"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Secondary: a single free-exploration door (slim bar). */}
          <div className="demo-section">
            <span className="demo-doors-eyebrow">
              <MagnifyingGlass size={13} weight="bold" aria-hidden="true" />
              Or explore on your own
            </span>
            <button
              type="button"
              className="demo-door demo-door--explore"
              onClick={handleExploreFreely}
            >
              <span className="demo-door-body">
                <span className="demo-door-title">Look around freely</span>
                <span className="demo-door-blurb">
                  Explore the app at your own pace. Switch characters anytime
                  from the profile page.
                </span>
              </span>
              <ArrowRight
                size={18}
                weight="bold"
                aria-hidden="true"
                className="demo-door-arrow"
              />
            </button>
          </div>
        </div>
      </main>

      <footer className="demo-footer">
        {hasDemoState ? (
          <ButtonAction
            variant="tertiary"
            size="sm"
            leftIcon={<ArrowCounterClockwise size={13} weight="bold" />}
            onClick={handleReset}
          >
            Reset demo state
          </ButtonAction>
        ) : (
          <span aria-hidden="true" />
        )}
        <span className="demo-credit">
          Created by <strong>Alyssa Parkhurst</strong> and{" "}
          <strong>Shawn Talvacchia</strong>
        </span>
      </footer>
    </div>
  );
}

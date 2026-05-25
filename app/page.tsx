"use client";

/**
 * Landing page — the demo's front door.
 *
 * Standalone and chrome-free (GuestLayout treats `/` as a standalone
 * route — no AppNav, Sidebar, or BottomNav). The whole prototype sits
 * behind the `proxy.ts` password gate; this is the first surface past it.
 *
 * Layout (2026-05-20 iteration, full-bleed split):
 *  - The page is a full-bleed grid of two halves with different surface
 *    colours (`--surface-base` left, `--surface-top` right) rather than
 *    a centred shell. The colour split replaces a divider and makes the
 *    page take up the full viewport on desktop.
 *  - Left half = demo entry: logo + DEMO pill at the top, then headline,
 *    tagline, primary CTA, helper.
 *  - Right half = cast showcase + picker: MEET THE CAST framing, a
 *    horizontal profile card (photo left, name/role/goal/Explore CTA
 *    right), and slider controls.
 *  - Daniel (the walkthrough's lead) is the first card and the slider
 *    opens on him. On mobile the profile card is swipeable (left/right
 *    to change persona); desktop also has the arrow controls.
 *  - Mobile stacks the halves vertically.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowCounterClockwise,
  Compass,
} from "@phosphor-icons/react";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { clearDemoStorage } from "@/lib/demoReset";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { personas, NEW_USER_ID } from "@/lib/personas";
import "./page.css";

/**
 * Per-persona display content for the showcase cards. Short pill role +
 * a single-sentence goal that hints at where they live in the demo's
 * world (Prague neighbourhoods bubble up here naturally — that's where
 * the place context lands now that the eyebrow no longer announces it).
 */
const PERSONA_ROLES: Record<string, string> = {
  tereza: "Community anchor",
  daniel: "New owner",
  klara: "Trainer",
  tomas: "Busy professional",
  lena: "Marketplace customer",
  magda: "Neighbour",
};

const PERSONA_GOALS: Record<string, string> = {
  tereza: "Anchors the Vinohrady walking crew most days.",
  daniel: "Looking for a community where nervous Bára can settle in.",
  klara: "Runs free community walks at Stromovka; her clients come from them.",
  tomas: "Needs reliable care squeezed around a packed Karlín week.",
  lena: "Just wants a walker for Asha. Skips the community part.",
  magda: "Knows everyone on her street in Holešovice.",
};

/** The persona the walkthrough begins as — slider defaults to this card. */
const WALKTHROUGH_START_PERSONA_ID = "daniel";

export default function LandingPage() {
  const router = useRouter();
  const { resetToDefault, setUserById } = useDemoState();
  const walkthrough = useWalkthrough();

  // Hide the Reset action when there's nothing to reset — no `doggo*`
  // entries in local or session storage means the demo has never been
  // touched, so the button would be a no-op. Starts false (matches the
  // SSR snapshot — no storage on the server); the effect upgrades it
  // after hydration if state is actually present.
  const [hasDemoState, setHasDemoState] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasKey = (store: Storage) =>
      Object.keys(store).some((k) => k.startsWith("doggo"));
    setHasDemoState(
      hasKey(window.localStorage) || hasKey(window.sessionStorage),
    );
  }, []);

  function handleStartWalkthrough() {
    // Scripted demo must run against the canonical mock-data seed.
    // Reset first, then start. No reload needed: clearing the persisted
    // state cache re-seeds contexts in place, and the walkthrough
    // navigates forward into freshly mounted pages.
    clearDemoStorage();
    resetToDefault();
    walkthrough.start();
  }

  function handleReset() {
    clearDemoStorage();
    resetToDefault();
    // Hard reload so any local component state on back-stack pages
    // is wiped too. Mirrors ProfileNameDropdown's reset.
    if (typeof window !== "undefined") window.location.reload();
  }

  /**
   * "Explore freely as this persona" path — mirrors the retired
   * DemoPersonaDropdown's pick(): end any walkthrough that was running
   * (its on-surface card / pill shouldn't follow the tester into free
   * mode), swap to the picked persona, route to /home so the data swap
   * is immediately visible.
   */
  function handlePickPersona(personaId: string) {
    walkthrough.endAndStay();
    setUserById(personaId);
    router.push("/home");
  }

  // Cast = every persona except the "New user" meta-persona (an empty-state
  // test affordance, not a character in the world), with the walkthrough's
  // lead (Daniel) hoisted to the front so he's the first card.
  const castPersonas = (() => {
    const cast = personas.filter((p) => p.user.id !== NEW_USER_ID);
    const leadIdx = cast.findIndex(
      (p) => p.user.id === WALKTHROUGH_START_PERSONA_ID,
    );
    if (leadIdx > 0) cast.unshift(cast.splice(leadIdx, 1)[0]);
    return cast;
  })();

  return (
    <div className="demo-page">
      <header className="demo-top-header-left">
        <div className="demo-top-header-inner">
          <img src="/logo.svg" alt="Doggo" className="demo-logo" />
          <span className="demo-eyebrow">Demo</span>
        </div>
      </header>
      {/* Empty right-header cell — its job is to extend surface-top up to
          the top of the right column so the vertical seam between halves
          runs unbroken from the reset bar to the top of the page. */}
      <div className="demo-top-header-right" aria-hidden="true" />

      <section className="demo-left">
        <div className="demo-left-inner">
          <h1 className="demo-headline">
            <span className="demo-headline-primary">Your dog finds friends.</span>{" "}
            <span className="demo-headline-brand">You find people you trust.</span>
          </h1>

          <p className="demo-tagline">
            Meet local owners and trainers, build real trust, and find
            care from people you already know.
          </p>

          <button
            type="button"
            className="demo-start-btn"
            onClick={handleStartWalkthrough}
          >
            <Compass size={18} weight="bold" aria-hidden="true" />
            Start the walkthrough
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="demo-right">
        <div className="demo-right-inner">
          <div className="demo-cast-meta">
            <span className="demo-cast-eyebrow">Explore freely</span>
            <p className="demo-cast-subline">
              For an open-ended way to experience Doggo, pick a character
              and explore the app through their eyes, at your own pace.
            </p>
          </div>
        </div>

        {/* Full-bleed carousel of vertical cast cards — a direct child of
            .demo-right (NOT the max-width inner) so it can run off the right
            section edge. Cards start aligned with the eyebrow; native scroll
            (swipe on touch) replaced the prev/next stepper. */}
        <div className="demo-cast-scroller" role="list" aria-label="The cast">
          {castPersonas.map((p) => (
            <article
              key={p.user.id}
              className="demo-profile-card"
              role="listitem"
            >
              <div className="demo-profile-card-media">
                <img
                  src={p.user.avatarUrl}
                  alt=""
                  className="demo-profile-card-photo"
                />
                {/* Role chip overlaid on the photo (dark scrim, neutral) so
                    the body reads cleanly: name → goal → action. */}
                <span className="demo-profile-card-pill">
                  {PERSONA_ROLES[p.user.id] ?? p.archetype}
                </span>
              </div>
              <div className="demo-profile-card-body">
                <div className="demo-profile-card-name">
                  {p.user.firstName} {p.user.lastName}
                </div>
                <p className="demo-profile-card-goal">
                  {PERSONA_GOALS[p.user.id] ?? p.archetype}
                </p>
                <button
                  type="button"
                  className="demo-profile-card-explore"
                  onClick={() => handlePickPersona(p.user.id)}
                >
                  Explore as {p.user.firstName}
                  <ArrowRight size={13} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="demo-reset-row">
        <div className="demo-reset-cell">
          {hasDemoState && (
            <div className="demo-reset-inner demo-reset-inner--left">
              <ButtonAction
                variant="tertiary"
                size="sm"
                leftIcon={<ArrowCounterClockwise size={13} weight="bold" />}
                onClick={handleReset}
              >
                Reset demo state
              </ButtonAction>
            </div>
          )}
        </div>
        <div className="demo-reset-cell">
          <div className="demo-reset-inner demo-reset-inner--right">
            <span className="demo-credit">
              Created by <strong>Alyssa Parkhurst</strong> and{" "}
              <strong>Shawn Talvacchia</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

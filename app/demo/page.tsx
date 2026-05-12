"use client";

/**
 * /demo — persona picker route.
 *
 * Standalone page (no AppNav, Sidebar, BottomNav — see GuestLayout). Two
 * sections:
 *   1. **Guided journeys** — 3 large scenario cards (Tereza/Daniel/Klára)
 *      with rich storytelling. Tereza's card has both a tour entry and a
 *      "just enter" entry; the others land directly on /home as that persona.
 *   2. **Just explore** — 5 compact persona pills (T/D/K/Tomáš/New User) for
 *      reviewers who already know what they want to see.
 *
 * Tour entry preserves the persona via `?as=tereza` and triggers the overlay
 * via `?tour=tereza&step=1`. Tour overlay reads those params from the URL —
 * see `components/landing/TourOverlay.tsx`.
 *
 * Placement decision (D1, persona-wiring.md): a standalone route was picked
 * over a landing-page panel/launcher because the landing page is stale and
 * due for its own redesign. A route survives any landing changes and is
 * shareable (Slack a tester `…/demo` and they're in).
 *
 * "New User" appears as a regular persona option (rather than a separate
 * checkbox) — selecting it drops you into a profile with no pets, no bio,
 * no groups, etc. so empty states surface naturally across the app.
 */

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  House,
  ArrowCounterClockwise,
  Compass,
} from "@phosphor-icons/react";
import { personas, defaultPersona } from "@/lib/personas";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { resetPersistedState } from "@/lib/usePersistedState";
import "./demo.css";

const TOUR_ENTRY = "/home?as=tereza&tour=tereza&step=1";

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

/** Curated journey cards — the "guided" half of the picker. Story copy is
 *  hand-tuned to read like a narrative pitch, not a feature list. Persona
 *  references stay in `lib/personas.ts` (single source of truth). */
type Journey = {
  personaId: "tereza" | "daniel" | "klara";
  title: string;
  story: string;
  hasTour?: boolean;
};

const JOURNEYS: Journey[] = [
  {
    personaId: "tereza",
    title: "A morning walking crew",
    story:
      "Tereza walks Riegrovy every morning with the same six people. She runs the Vinohrady Evening Walkers and sits for neighbours on weekends. The community-anchor view of how trust accrues over months.",
    hasTour: true,
  },
  {
    personaId: "daniel",
    title: "Trust built from zero",
    story:
      "Daniel adopted Bára, a reactive rescue. His profile is locked, his connections are few. See how a single support group + one professional booking become the whole foundation of his confidence.",
  },
  {
    personaId: "klara",
    title: "A trainer's small business",
    story:
      "Klára runs a Care group for her training clients. Many joined a Saturday calm-dog session first and started booking weekday training by the third week. The community-as-funnel arc.",
  },
];

export default function DemoPage() {
  const router = useRouter();
  const { user: currentUser, setUserById, resetToDefault } = useDemoState();

  function pick(personaId: string) {
    setUserById(personaId);
    router.push("/home");
  }

  function launchTour() {
    setUserById("tereza");
    router.push(TOUR_ENTRY);
  }

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
          <div className="demo-brand">DOGGO · Demo mode</div>
          <h1 className="demo-title">View as&hellip;</h1>
          <p className="demo-subtitle">
            Pick a guided journey for a curated path through one persona&rsquo;s
            community-to-care arc, or jump straight in as anyone. The choice
            persists across navigation and refresh; switch back from the
            profile page&rsquo;s &ldquo;Change user&rdquo; menu.
          </p>
        </header>

        {/* ── Guided journeys ─────────────────────────────────────────── */}
        <section className="demo-section">
          <div className="demo-section-header">
            <Compass size={18} weight="bold" aria-hidden="true" />
            <span>Guided journeys</span>
          </div>
          <div className="demo-journeys">
            {JOURNEYS.map((j) => {
              const persona = personas.find((p) => p.user.id === j.personaId);
              if (!persona) return null;
              const { user } = persona;
              return (
                <article key={j.personaId} className="demo-journey-card">
                  <div className="demo-journey-row">
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="demo-journey-avatar"
                      loading="lazy"
                    />
                    <div className="demo-journey-meta">
                      <span className="demo-journey-archetype">
                        {persona.archetype}
                      </span>
                      <h3 className="demo-journey-title">{j.title}</h3>
                      <span className="demo-journey-name">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </div>
                  <p className="demo-journey-story">{j.story}</p>
                  <div className="demo-journey-actions">
                    {j.hasTour && (
                      <button
                        type="button"
                        className="demo-journey-btn demo-journey-btn--guided"
                        onClick={launchTour}
                      >
                        <Compass size={14} weight="bold" aria-hidden="true" />
                        Walk me through it
                        <ArrowRight size={14} weight="bold" aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="demo-journey-btn"
                      onClick={() => pick(j.personaId)}
                    >
                      {j.hasTour ? `Just enter as ${user.firstName}` : `Enter as ${user.firstName}`}
                      <ArrowRight size={14} weight="bold" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Just explore — flat persona pills ────────────────────────── */}
        <section className="demo-section">
          <div className="demo-section-header">
            <span>Just explore</span>
          </div>
          <div className="demo-pills">
            {personas.map((p) => {
              const active = currentUser.id === p.user.id;
              return (
                <button
                  key={p.user.id}
                  type="button"
                  className={`demo-pill${active ? " demo-pill--active" : ""}`}
                  onClick={() => pick(p.user.id)}
                >
                  <img
                    src={p.user.avatarUrl}
                    alt=""
                    className="demo-pill-avatar"
                    loading="lazy"
                  />
                  <div className="demo-pill-body">
                    <span className="demo-pill-name">
                      {p.user.firstName} {p.user.lastName}
                    </span>
                    <span className="demo-pill-archetype">{p.archetype}</span>
                  </div>
                  <span className="demo-pill-action">
                    {active ? "Active" : <ArrowRight size={14} weight="bold" />}
                  </span>
                </button>
              );
            })}
          </div>
          {currentUser.id !== defaultPersona.user.id && (
            <p className="demo-active-note">
              Currently active: <strong>{currentUser.firstName}</strong>. Reset
              below to return to the default ({defaultPersona.user.firstName}).
            </p>
          )}
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

"use client";

/**
 * /demo — persona picker route.
 *
 * Standalone page (no AppNav, Sidebar, BottomNav — see GuestLayout). Lists
 * the personas from `lib/personas.ts` and lets a reviewer pick whose
 * perspective to drop into. The chosen persona persists in localStorage via
 * CurrentUserContext; switch personas anytime from the profile page's
 * "Change user" menu, or via the `?as=<personaId>` URL param.
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
import { ArrowRight, House, ArrowCounterClockwise } from "@phosphor-icons/react";
import { personas } from "@/lib/personas";
import { useDemoState } from "@/contexts/CurrentUserContext";
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
}

export default function DemoPage() {
  const router = useRouter();
  const { user: currentUser, setUserById, resetToDefault } = useDemoState();

  function pick(personaId: string) {
    setUserById(personaId);
    // Send the reviewer to the home feed where the change is most visible.
    router.push("/home");
  }

  function handleReset() {
    clearDemoLocalStorage();
    resetToDefault();
    router.refresh();
  }

  return (
    <div className="demo-page">
      <div className="demo-shell">
        <header className="demo-header">
          <div className="demo-brand">DOGGO · Demo mode</div>
          <h1 className="demo-title">View as&hellip;</h1>
          <p className="demo-subtitle">
            Pick a persona to drop into the prototype from their perspective.
            The choice persists across navigation and refresh; switch back from
            the profile page&rsquo;s &ldquo;Change user&rdquo; menu.
          </p>
        </header>

        <section className="demo-options">
          {personas.map((p) => {
            const active = currentUser.id === p.user.id;
            return (
              <button
                key={p.user.id}
                type="button"
                className={`demo-card${active ? " demo-card--active" : ""}`}
                onClick={() => pick(p.user.id)}
              >
                <img
                  src={p.user.avatarUrl}
                  alt=""
                  className="demo-avatar"
                  loading="lazy"
                />
                <div className="demo-card-body">
                  <div className="demo-card-row">
                    <span className="demo-card-name">
                      {p.user.firstName} {p.user.lastName}
                    </span>
                    <span className="demo-card-archetype">{p.archetype}</span>
                  </div>
                  <p className="demo-card-tagline">{p.tagline}</p>
                  <span className="demo-card-action">
                    {active ? "Active" : (
                      <>
                        Enter <ArrowRight size={14} weight="bold" />
                      </>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
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

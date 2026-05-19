"use client";

/**
 * ProfileNameDropdown — persona switcher disguised as the profile name.
 *
 * On the profile page, the user's name is itself the dropdown trigger: tap
 * the name (or its caret) to open a popover listing the personas. This is a
 * **demo-only** affordance — the real product wouldn't surface a switcher
 * here at all. Sized down from the original `<h1 text-3xl>` so the caret
 * doesn't dominate; still uses the heading font.
 *
 * The popover behaviour mirrors the previous `ChangeUserMenu`:
 *  - 6 persona options including "New User" (empty-state preview)
 *  - "Demo home →" link to the landing page (the demo launcher)
 *  - Outside-click + Escape close
 *  - Picking a persona writes to CurrentUserContext and refreshes the route
 *
 * For one-off "preview as X" checks on any other page, use the URL param
 * `?as=<personaId>` (see `useCurrentUser` doc comment).
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretDown, ArrowSquareOut, Check, ArrowCounterClockwise } from "@phosphor-icons/react";
import { personas } from "@/lib/personas";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { clearDemoStorage } from "@/lib/demoReset";

interface ProfileNameDropdownProps {
  /** The displayed name (full name string). */
  name: string;
}

export function ProfileNameDropdown({ name }: ProfileNameDropdownProps) {
  const router = useRouter();
  const { setUserById, resetToDefault } = useDemoState();
  // Read the actually-resolved current user (which may be a `?as=` preview
  // override of the picker persona), so the dropdown's active checkmark
  // reflects who the user is *currently being rendered as* — not what the
  // picker holds in localStorage. Pricing & Proposals walkthrough 2026-05-05.
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(personaId: string) {
    setUserById(personaId);
    setOpen(false);
    router.refresh();
  }

  function handleReset() {
    clearDemoStorage();
    resetToDefault();
    setOpen(false);
    // Hard reload (not router.refresh) — components on the current page
    // can hold *local* state that isn't persisted to localStorage (e.g.
    // the in-memory `user.profileVisibility` from the profile About-tab
    // visibility toggle, edit-mode draft state, etc.). router.refresh
    // re-fetches server data but doesn't unmount client components, so
    // local state stays stale until a full reload. Reset is rare and
    // expected to be a "clean slate" gesture — accepting the brief
    // blank-flash is the right tradeoff. CCFT walkthrough 2026-05-11.
    if (typeof window !== "undefined") window.location.reload();
  }

  // True when the resolved current user isn't on the picker — i.e. we're in
  // a `?as=<non-picker>` preview (Petra, Shawn, Nikola, etc.). Surface an
  // "Exit preview" item so the tester has a clear path back to their picker
  // persona without opening a new tab. Pricing & Proposals walkthrough
  // 2026-05-05.
  const isPreviewingNonPicker = !personas.some((p) => p.user.id === user.id);
  function handleExitPreview() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("doggo-as-preview");
    window.dispatchEvent(new CustomEvent("doggo-as-preview-changed"));
    // Strip `?as=` from the current URL so subsequent navigation isn't
    // affected. router.replace lets us update the URL without a full
    // reload — the hook re-reads via the event above.
    const url = new URL(window.location.href);
    url.searchParams.delete("as");
    router.replace(url.pathname + url.search + url.hash, { scroll: false });
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="profile-name-dropdown-wrap">
      <button
        type="button"
        className="profile-name-dropdown-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <h1 className="profile-name-dropdown-name">{name}</h1>
        <CaretDown
          size={16}
          weight="bold"
          className={`profile-name-dropdown-caret${open ? " profile-name-dropdown-caret--open" : ""}`}
        />
      </button>

      {open && (
        <div className="profile-name-dropdown-menu" role="menu">
          <div className="profile-name-dropdown-label">View as</div>
          <ul className="profile-name-dropdown-list">
            {personas.map((p) => {
              const active = p.user.id === user.id;
              return (
                <li key={p.user.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={`profile-name-dropdown-item${active ? " profile-name-dropdown-item--active" : ""}`}
                    onClick={() => pick(p.user.id)}
                  >
                    <img
                      src={p.user.avatarUrl}
                      alt=""
                      className="profile-name-dropdown-avatar"
                    />
                    <span className="profile-name-dropdown-body">
                      <span className="profile-name-dropdown-personname">
                        {p.user.firstName} {p.user.lastName}
                      </span>
                      <span className="profile-name-dropdown-archetype">{p.archetype}</span>
                    </span>
                    {active && (
                      <Check size={14} weight="bold" className="profile-name-dropdown-check" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {isPreviewingNonPicker && (
            <button
              type="button"
              role="menuitem"
              className="profile-name-dropdown-reset"
              onClick={handleExitPreview}
            >
              <ArrowCounterClockwise size={12} weight="bold" />
              Exit preview ({user.firstName})
            </button>
          )}

          <button
            type="button"
            role="menuitem"
            className="profile-name-dropdown-reset"
            onClick={handleReset}
          >
            <ArrowCounterClockwise size={12} weight="bold" />
            Reset demo state
          </button>

          <Link
            href="/"
            className="profile-name-dropdown-footer"
            onClick={() => setOpen(false)}
          >
            Demo home
            <ArrowSquareOut size={12} weight="bold" />
          </Link>
        </div>
      )}
    </div>
  );
}

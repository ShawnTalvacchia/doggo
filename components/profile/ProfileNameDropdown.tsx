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
 *  - "Open full picker →" link to /demo for the bigger surface
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

/**
 * Wipe every `doggo:*` localStorage key — clears persona override, dismissed
 * review cards, and any future demo state we add behind that prefix. Used by
 * the "Reset demo state" menu action below.
 */
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

interface ProfileNameDropdownProps {
  /** The displayed name (full name string). */
  name: string;
}

export function ProfileNameDropdown({ name }: ProfileNameDropdownProps) {
  const router = useRouter();
  const { user, setUserById, resetToDefault } = useDemoState();
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
    clearDemoLocalStorage();
    resetToDefault();
    setOpen(false);
    router.refresh();
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
            href="/demo"
            className="profile-name-dropdown-footer"
            onClick={() => setOpen(false)}
          >
            Open full picker
            <ArrowSquareOut size={12} weight="bold" />
          </Link>
        </div>
      )}
    </div>
  );
}

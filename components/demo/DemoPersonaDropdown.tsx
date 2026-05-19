"use client";

/**
 * DemoPersonaDropdown — the "Explore freely" persona picker on the landing page.
 *
 * Replaces the old flat 7-pill list with a single dropdown control, mirroring
 * the profile-page `ProfileNameDropdown` pattern: a trigger showing the
 * active persona, tap to open a popover of all personas with a checkmark on
 * the active one. Picking ends any in-progress guided walkthrough, switches
 * persona, and routes to `/home` so the data swap is immediately visible.
 *
 * Reuses the `.profile-name-dropdown-*` menu CSS (popover rows) + the
 * `.demo-pill` trigger styling; `.demo-picker*` are the only additions.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CaretDown, Check } from "@phosphor-icons/react";
import { personas } from "@/lib/personas";
import { useDemoState } from "@/contexts/CurrentUserContext";
import { useWalkthrough } from "@/contexts/WalkthroughContext";

export function DemoPersonaDropdown() {
  const router = useRouter();
  const { user, setUserById } = useDemoState();
  const walkthrough = useWalkthrough();
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
    // "Explore freely" is a clean exit — end any in-progress walkthrough so
    // its on-surface card / pill doesn't follow the tester into free mode.
    walkthrough.endAndStay();
    setUserById(personaId);
    setOpen(false);
    router.push("/home");
  }

  const active = personas.find((p) => p.user.id === user.id) ?? personas[0];

  return (
    <div ref={wrapRef} className="demo-picker">
      <button
        type="button"
        className="demo-pill"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <img
          src={active.user.avatarUrl}
          alt=""
          className="demo-pill-avatar"
          loading="lazy"
        />
        <div className="demo-pill-body">
          <span className="demo-pill-name">
            {active.user.firstName} {active.user.lastName}
          </span>
          <span className="demo-pill-archetype">{active.archetype}</span>
        </div>
        <CaretDown
          size={16}
          weight="bold"
          className={`profile-name-dropdown-caret${open ? " profile-name-dropdown-caret--open" : ""}`}
        />
      </button>

      {open && (
        <div className="profile-name-dropdown-menu demo-picker-menu" role="menu">
          <div className="profile-name-dropdown-label">Explore as</div>
          <ul className="profile-name-dropdown-list">
            {personas.map((p) => {
              const isActive = p.user.id === user.id;
              return (
                <li key={p.user.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={`profile-name-dropdown-item${isActive ? " profile-name-dropdown-item--active" : ""}`}
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
                      <span className="profile-name-dropdown-archetype">
                        {p.archetype}
                      </span>
                    </span>
                    {isActive && (
                      <Check
                        size={14}
                        weight="bold"
                        className="profile-name-dropdown-check"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

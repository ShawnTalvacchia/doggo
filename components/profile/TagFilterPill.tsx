"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown, X, Check } from "@phosphor-icons/react";

interface TagFilterOption {
  id: string;
  label: string;
}

interface TagFilterPillProps {
  /** Display label for the pill when no value is selected ("Community",
   *  "Person", etc.). */
  label: string;
  /** Options the viewer can see for this tag type. Scope this list at
   *  the caller — never include values the viewer wouldn't otherwise
   *  have access to (Content Visibility Model line 166). */
  options: TagFilterOption[];
  /** Currently selected option ids (multi-select). */
  selectedIds: string[];
  /** Called with the new selection list after a checkbox toggle. */
  onChange: (next: string[]) => void;
}

/**
 * Pill-dropdown for a tag-type filter on the Posts tab. Multi-select
 * via checkbox rows inside a popover menu (the project's standard
 * `.dropdown-menu-wrap` + `.dropdown-menu` pattern — same shape used
 * by Follow / Joined / Sort menus elsewhere).
 *
 * Idle pill: "Label ▾" (caret).
 * Active pill: "Label · N" (count of selections) + × to clear all.
 *
 * Tap pill → toggles the menu. Click outside closes. Clicking a row
 * toggles that option's membership in the selection set; the URL
 * state updates immediately so the post grid filters live.
 *
 * Renders nothing when options is empty.
 *
 * Photos & Galleries phase, 2026-06-04 (Workstream B2 — menu+multi
 * refactor after the modal+single-select V1).
 */
export function TagFilterPill({
  label,
  options,
  selectedIds,
  onChange,
}: TagFilterPillProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click-outside to close. Mousedown rather than click so the menu
  // closes before any other element receives the click — matches the
  // pattern in app/communities/[id]/page.tsx + app/shelters/[id]/page.tsx.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (options.length === 0) return null;

  const count = selectedIds.length;
  const hasSelection = count > 0;
  const pillClass = `posts-tab-filter-pill ${hasSelection ? "is-active" : ""}`;

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div ref={wrapRef} className="posts-tab-filter-pill-wrap dropdown-menu-wrap">
      <button
        type="button"
        className={pillClass}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>
          {hasSelection ? `${label} · ${count}` : label}
        </span>
        {hasSelection ? (
          <span
            className="posts-tab-filter-pill-clear"
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
            aria-label={`Clear ${label} filter`}
          >
            <X size={12} weight="bold" />
          </span>
        ) : (
          <CaretDown size={12} weight="light" />
        )}
      </button>

      {open && (
        <div className="dropdown-menu posts-tab-filter-menu" role="menu">
          {options.map((opt) => {
            const isSelected = selectedIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                role="menuitemcheckbox"
                aria-checked={isSelected}
                className="dropdown-menu-item posts-tab-filter-menu-item"
                onClick={() => toggle(opt.id)}
              >
                <span className={`filter-checkbox ${isSelected ? "is-checked" : ""}`}>
                  {isSelected && <Check size={12} weight="bold" />}
                </span>
                <span style={{ flex: 1 }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

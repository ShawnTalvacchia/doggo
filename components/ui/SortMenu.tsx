"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";

/**
 * Shared sort dropdown. Uses the project's `.dropdown-menu` pattern (same as the
 * Follow / RSVP / Joined menus) so options render with our styling instead of
 * the OS-native select. Extracted from two byte-identical inline copies (shelter
 * Dogs tab + Help a Dog Dogs view). FC15 / Design-System Audit + Cleanup WS-D,
 * 2026-06-20.
 */
export function SortMenu({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape. Mirrors the meet-RSVP / shelter-Follow menus.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={wrapRef} className="dropdown-menu-wrap sort-menu-wrap">
      <button
        type="button"
        className="sort-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current?.label ?? "Sort"}</span>
        <CaretDown size={12} weight="bold" />
      </button>
      {open && (
        <div className="dropdown-menu" role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={`dropdown-menu-item${opt.value === value ? " is-active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <Check
                size={14}
                weight="light"
                style={{ opacity: opt.value === value ? 1 : 0 }}
                aria-hidden="true"
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

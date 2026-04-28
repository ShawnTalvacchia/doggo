"use client";

/**
 * PillToggle — a wrapping row of selectable pills. Single-select by default;
 * pass `multi` to allow multiple selections.
 *
 * Uses the canonical `.pill` / `.pill.active` styles from globals.css. Active
 * state is intentionally quieter than the primary meet-type picker — pills
 * are secondary refinements (pace / distance / terrain), not anchor choices,
 * so they get a brand-colored border + text without the subtle fill or
 * weight bump. See Walkthrough §1 "Form essentials" and the anatomy note
 * in `docs/features/meets.md`.
 */
export function PillToggle({
  options,
  selected,
  onToggle,
  multi = false,
  ariaLabel,
}: {
  options: { value: string; label: string }[];
  selected: string | string[];
  onToggle: (value: string) => void;
  multi?: boolean;
  /** Optional aria-label for the whole group (recommended when the control has no visible label). */
  ariaLabel?: string;
}) {
  const isSelected = (v: string) =>
    multi ? (selected as string[]).includes(v) : selected === v;

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label={ariaLabel}
      className="flex flex-wrap gap-xs"
    >
      {options.map((o) => {
        const active = isSelected(o.value);
        return (
          <button
            key={o.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={active}
            onClick={() => onToggle(o.value)}
            className={`pill text-sm${active ? " active" : ""}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

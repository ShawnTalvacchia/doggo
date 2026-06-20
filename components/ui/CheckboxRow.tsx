"use client";

import { Check } from "@phosphor-icons/react";

type CheckboxRowProps = {
  /**
   * id is accepted for backward compat but not used — the input is always a
   * child of the label so implicit association handles click routing.
   */
  id?: string;
  /** Label content — string or inline JSX (e.g. with <strong> for bold words). */
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /**
   * "left"  — checkbox left, label right. Default.
   *           Use for: signup flows, consent checkboxes, pet selection.
   * "right" — label left (fills width), checkbox right.
   *           Use for: filter lists, option lists, settings rows.
   */
  placement?: "left" | "right";
  /**
   * "default" — 48×48 touch frame around the 24×24 box (airy; good for
   *             standalone consent rows). Default.
   * "compact" — 24×24 indicator + 8px gap + larger check, for dense forms
   *             where the whole label is the click target (e.g. the pet-edit
   *             2-col grid). Replaces the old `.pet-edit-checkbox-row`
   *             descendant override. P78 / Design-System Audit WS-D.
   */
  density?: "default" | "compact";
};

export function CheckboxRow({
  label,
  checked,
  onChange,
  placement = "left",
  density = "default",
}: CheckboxRowProps) {
  // "right" placement is handled purely in CSS via .checkbox-row--reverse —
  // DOM order is always indicator → label; flex-direction: row-reverse does the rest.
  const reverse = placement === "right";
  const compact = density === "compact";

  return (
    <label
      className={[
        "checkbox-row",
        reverse ? "checkbox-row--reverse" : "",
        compact ? "checkbox-row--compact" : "",
        checked ? "checkbox-row--checked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Input is a child of the label — implicit association, no id/htmlFor needed. */}
      <input
        type="checkbox"
        className="checkbox-row-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {/* Touch-target container (48×48 default / 24×24 compact); box centered inside */}
      <span className="checkbox-row-indicator" aria-hidden>
        <span className="checkbox-row-box">
          {checked && <Check size={compact ? 14 : 12} weight="bold" />}
        </span>
      </span>
      <span className="checkbox-row-label">{label}</span>
    </label>
  );
}

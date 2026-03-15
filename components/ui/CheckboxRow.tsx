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
};

export function CheckboxRow({
  label,
  checked,
  onChange,
  placement = "left",
}: CheckboxRowProps) {
  // "right" placement is handled purely in CSS via .checkbox-row--reverse —
  // DOM order is always indicator → label; flex-direction: row-reverse does the rest.
  const reverse = placement === "right";

  return (
    <label
      className={[
        "checkbox-row",
        reverse ? "checkbox-row--reverse" : "",
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
      {/* 48×48 touch-target container; visual box is centered inside */}
      <span className="checkbox-row-indicator" aria-hidden>
        <span className="checkbox-row-box">
          {checked && <Check size={12} weight="bold" />}
        </span>
      </span>
      <span className="checkbox-row-label">{label}</span>
    </label>
  );
}

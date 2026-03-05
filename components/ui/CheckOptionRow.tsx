"use client";

import { Check } from "@phosphor-icons/react";

type CheckOptionRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckOptionRow({ label, checked, onChange }: CheckOptionRowProps) {
  return (
    <button
      type="button"
      className={`left-accordion-option${checked ? " active" : ""}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span className="left-accordion-option-label">{label}</span>
      <span className="left-accordion-option-check" aria-hidden>
        {checked ? <Check size={12} weight="bold" color="white" /> : null}
      </span>
    </button>
  );
}

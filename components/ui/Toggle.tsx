"use client";

type ToggleProps = {
  /** Visible label displayed alongside the toggle. */
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Optional: places label on the right side. Default is left. */
  labelPlacement?: "left" | "right";
};

export function Toggle({
  label,
  checked,
  onChange,
  labelPlacement = "left",
}: ToggleProps) {
  return (
    <div className={`toggle-row${labelPlacement === "right" ? " toggle-row--label-right" : ""}`}>
      {labelPlacement === "left" && (
        <span className="toggle-label">{label}</span>
      )}
      <button
        type="button"
        className={`toggle-track${checked ? " on" : ""}`}
        onClick={() => onChange(!checked)}
        aria-label={label}
        aria-pressed={checked}
        role="switch"
        aria-checked={checked}
      >
        <div className="toggle-knob" />
      </button>
      {labelPlacement === "right" && (
        <span className="toggle-label">{label}</span>
      )}
    </div>
  );
}

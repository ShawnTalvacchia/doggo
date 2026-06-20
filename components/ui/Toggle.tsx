"use client";

type ToggleProps = {
  /** Visible label displayed alongside the toggle. */
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Optional: places label on the right side. Default is left. */
  labelPlacement?: "left" | "right";
  /** Optional: "sm" renders a lighter toggle for secondary/inline rows. Default "md". */
  size?: "md" | "sm";
  /** Optional: bold the label — for use as a section/option header row. */
  strong?: boolean;
};

export function Toggle({
  label,
  checked,
  onChange,
  labelPlacement = "left",
  size = "md",
  strong = false,
}: ToggleProps) {
  const labelCls = `toggle-label${strong ? " toggle-label--strong" : ""}`;
  return (
    <div
      className={`toggle-row${labelPlacement === "right" ? " toggle-row--label-right" : ""}${size === "sm" ? " toggle-row--sm" : ""}`}
    >
      {labelPlacement === "left" && <span className={labelCls}>{label}</span>}
      <button
        type="button"
        className={`toggle-track${checked ? " on" : ""}${size === "sm" ? " toggle-track--sm" : ""}`}
        onClick={() => onChange(!checked)}
        aria-label={label}
        aria-pressed={checked}
        role="switch"
        aria-checked={checked}
      >
        <div className="toggle-knob" />
      </button>
      {labelPlacement === "right" && <span className={labelCls}>{label}</span>}
    </div>
  );
}

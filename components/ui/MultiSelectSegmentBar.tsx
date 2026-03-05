"use client";

type MultiSelectSegmentOption<T extends string> = {
  value: T;
  label: string;
  subLabel?: string;
};

type MultiSelectSegmentBarProps<T extends string> = {
  options: Array<MultiSelectSegmentOption<T>>;
  selectedValues: T[];
  onToggle: (value: T) => void;
  ariaLabel?: string;
};

export function MultiSelectSegmentBar<T extends string>({
  options,
  selectedValues,
  onToggle,
  ariaLabel,
}: MultiSelectSegmentBarProps<T>) {
  return (
    <div className="multi-segment" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            className={`multi-segment-btn${active ? " active" : ""}`}
            onClick={() => onToggle(option.value)}
            aria-pressed={active}
          >
            <span>{option.label}</span>
            {option.subLabel ? <span className="seg-sub">{option.subLabel}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

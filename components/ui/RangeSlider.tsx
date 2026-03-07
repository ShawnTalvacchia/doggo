"use client";

import { type CSSProperties } from "react";

type RangeSliderProps = {
  id?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (nextValue: number) => void;
  className?: string;
};

export function RangeSlider({
  id,
  min,
  max,
  step = 1,
  value,
  onChange,
  className,
}: RangeSliderProps) {
  const span = Math.max(1, max - min);
  const clampedValue = Math.max(min, Math.min(value, max));
  const rangePct = ((clampedValue - min) / span) * 100;

  const rootClass = className
    ? `left-range-row left-range-row-single ${className}`
    : "left-range-row left-range-row-single";
  const sliderStyle = {
    "--range-pct": `${Math.max(0, Math.min(100, rangePct))}%`,
  } as CSSProperties;

  return (
    <div className={rootClass}>
      <input
        id={id}
        className="left-range-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={clampedValue}
        style={sliderStyle}
        onChange={(event) => onChange(Number(event.target.value) || min)}
      />
    </div>
  );
}

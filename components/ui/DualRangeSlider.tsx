"use client";

import { type CSSProperties } from "react";

type DualRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onMinChange: (nextMin: number) => void;
  onMaxChange: (nextMax: number) => void;
  style?: CSSProperties;
  className?: string;
};

export function DualRangeSlider({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  style,
  className,
}: DualRangeSliderProps) {
  const span = Math.max(1, max - min);
  const minPct = ((Math.max(min, Math.min(minValue, max)) - min) / span) * 100;
  const maxPct = ((Math.max(min, Math.min(maxValue, max)) - min) / span) * 100;

  const rangeStyle = {
    "--min-pct": `${Math.max(0, Math.min(100, minPct))}%`,
    "--max-pct": `${Math.max(0, Math.min(100, maxPct))}%`,
    ...style,
  } as CSSProperties;

  const rootClass = className
    ? `left-range-row left-range-row-dual ${className}`
    : "left-range-row left-range-row-dual";

  return (
    <div className={rootClass} style={rangeStyle}>
      <input
        className="left-range-input left-range-input-min"
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={(event) => {
          const nextMin = Number(event.target.value) || min;
          onMinChange(Math.min(Math.max(nextMin, min), maxValue));
        }}
      />
      <input
        className="left-range-input left-range-input-max"
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={(event) => {
          const nextMax = Number(event.target.value) || max;
          onMaxChange(Math.max(Math.min(nextMax, max), minValue));
        }}
      />
    </div>
  );
}

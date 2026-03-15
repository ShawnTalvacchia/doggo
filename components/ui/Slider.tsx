"use client";

import { type CSSProperties } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type SliderBaseProps = {
  min: number;
  max: number;
  step?: number;
  className?: string;
};

type SingleSliderProps = SliderBaseProps & {
  dual?: false;
  id?: string;
  value: number;
  onChange: (nextValue: number) => void;
  style?: never;
  minValue?: never;
  maxValue?: never;
  onMinChange?: never;
  onMaxChange?: never;
};

type DualSliderProps = SliderBaseProps & {
  dual: true;
  style?: CSSProperties;
  minValue: number;
  maxValue: number;
  onMinChange: (nextMin: number) => void;
  onMaxChange: (nextMax: number) => void;
  id?: never;
  value?: never;
  onChange?: never;
};

type SliderProps = SingleSliderProps | DualSliderProps;

// ── Component ─────────────────────────────────────────────────────────────────

export function Slider(props: SliderProps) {
  const { min, max, step = 1, className } = props;
  const span = Math.max(1, max - min);

  if (props.dual) {
    const { minValue, maxValue, onMinChange, onMaxChange, style } = props;
    const minPct = ((Math.max(min, Math.min(minValue, max)) - min) / span) * 100;
    const maxPct = ((Math.max(min, Math.min(maxValue, max)) - min) / span) * 100;

    const rangeStyle = {
      "--min-pct": `${Math.max(0, Math.min(100, minPct))}%`,
      "--max-pct": `${Math.max(0, Math.min(100, maxPct))}%`,
      ...style,
    } as CSSProperties;

    const rootClass = className
      ? `filter-range-row filter-range-row-dual ${className}`
      : "filter-range-row filter-range-row-dual";

    return (
      <div className={rootClass} style={rangeStyle}>
        <input
          className="filter-range-input filter-range-input-min"
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => {
            const nextMin = Number(e.target.value) || min;
            onMinChange(Math.min(Math.max(nextMin, min), maxValue));
          }}
        />
        <input
          className="filter-range-input filter-range-input-max"
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => {
            const nextMax = Number(e.target.value) || max;
            onMaxChange(Math.max(Math.min(nextMax, max), minValue));
          }}
        />
      </div>
    );
  }

  // Single thumb
  const { id, value, onChange } = props;
  const clampedValue = Math.max(min, Math.min(value, max));
  const rangePct = ((clampedValue - min) / span) * 100;

  const sliderStyle = {
    "--range-pct": `${Math.max(0, Math.min(100, rangePct))}%`,
  } as CSSProperties;

  const rootClass = className
    ? `filter-range-row filter-range-row-single ${className}`
    : "filter-range-row filter-range-row-single";

  return (
    <div className={rootClass}>
      <input
        id={id}
        className="filter-range-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={clampedValue}
        style={sliderStyle}
        onChange={(e) => onChange(Number(e.target.value) || min)}
      />
    </div>
  );
}

"use client";

import { Toggle } from "@/components/ui/Toggle";

/**
 * A priced opt-in row used by carer service editors (walk delivery options +
 * appointment meeting-locations). One shared shape so the two editors read the
 * same:
 *
 *   **Bold option name** ............................ [toggle]
 *   muted description                     [ price ] Kč / unit   ← only when on
 *
 * The description + price share one row (description left, price right-aligned)
 * so each option reads as a single tidy unit instead of three stacked blocks.
 * Service Options & Booking Clarity walkthrough, 2026-06-16.
 */
export function PricedToggleRow({
  label,
  description,
  checked,
  onToggle,
  price,
  onPriceChange,
  unitLabel,
  inputId,
}: {
  /** Bold option name on the header row. */
  label: string;
  /** Optional muted subline shown next to the price when on. */
  description?: string;
  checked: boolean;
  onToggle: (next: boolean) => void;
  price: number;
  onPriceChange: (next: number) => void;
  /** e.g. "Kč / visit" or "Kč / appointment". */
  unitLabel: string;
  inputId: string;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <Toggle label={label} strong checked={checked} onChange={onToggle} />
      {checked && (
        <div className="flex items-center gap-sm">
          {description && (
            <span className="text-xs text-fg-tertiary flex-1">{description}</span>
          )}
          <input
            id={inputId}
            type="number"
            className="input"
            style={{ width: 104, marginLeft: description ? undefined : "auto" }}
            value={price.toString()}
            onChange={(e) => onPriceChange(parseInt(e.target.value) || 0)}
            aria-label={`${label} price`}
          />
          <span className="text-xs text-fg-tertiary whitespace-nowrap">
            {unitLabel}
          </span>
        </div>
      )}
    </div>
  );
}

"use client";

import { CaretRight } from "@phosphor-icons/react";
import type { CarerCareServiceConfig } from "@/lib/types";

interface LinkedCareCalloutProps {
  service: CarerCareServiceConfig;
  carer: { name: string; avatarUrl: string };
  /** Opens the linked-walk booking sheet for this service. */
  onBook: () => void;
}

/**
 * Callout on a free community-walk meet for a linked **Care** service
 * (Service ↔ Meet Linkage, config #2 — a "linked-care booking"). The walk
 * is free to join as a walker; this is the *separate* paid path — book the
 * carer to walk your dog, you don't come along. **Book ≠ attend:** tapping
 * this opens a booking flow that produces a Care `Booking`, it does NOT
 * RSVP you to the meet.
 *
 * Surfaces both delivery options when the carer offers them (pickup + drop-
 * off) so the choice is visible at decision time. When only one method is
 * offered, the callout shows the single price. Distinct chrome from the
 * required-link "About this service" card — this sits alongside an intact
 * free-RSVP path, so it reads as "or, instead."
 *
 * Copy rewritten 2026-05-20 in the Walk Service Delivery phase. The
 * previous "Drop-off — Klára takes your dog on this walk. You don't come
 * along." copy used "drop-off" to name the booking shape; that word now
 * names the literal delivery method (carer's location), so the prefix was
 * retired. The "book ≠ attend" idea is carried by the sentence itself.
 */
export function LinkedCareCallout({ service, carer, onBook }: LinkedCareCalloutProps) {
  const carerFirst = carer.name.split(" ")[0];

  // The callout shows a single price — the floor of the available delivery
  // options, prefixed "From" when the carer offers more than one. Listing
  // every option on the card would over-spec it; the picker inside the
  // booking sheet is where the owner makes the choice (and where the Q3
  // pickup-default + happy-surprise price drop on drop-off lives).
  // Walk Service Delivery, 2026-05-20.
  const options = service.deliveryOptions ?? [];
  const hasMultipleOptions = options.length > 1;
  const lowestPrice = options.length > 0
    ? Math.min(...options.map((o) => o.price))
    : service.pricePerUnit;

  return (
    <button
      type="button"
      onClick={onBook}
      className="flex items-start gap-md rounded-panel border border-edge-regular w-full text-left"
      style={{
        background: "var(--surface-top)",
        padding: "var(--space-md)",
        cursor: "pointer",
      }}
    >
      <img
        src={carer.avatarUrl}
        alt={carer.name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <span className="flex flex-col flex-1 min-w-0 gap-sm">
        <span className="flex flex-col gap-tiny">
          <span className="text-sm font-semibold text-fg-primary">
            Have {carerFirst} walk your dog
          </span>
          <span className="text-xs text-fg-tertiary">
            {carerFirst} takes your dog on this walk. You don&apos;t come along.
          </span>
        </span>
        <span className="flex items-center justify-between gap-xs">
          <span className="text-sm font-semibold text-info-strong">
            {hasMultipleOptions && (
              <span className="font-normal text-fg-tertiary">From </span>
            )}
            {lowestPrice.toLocaleString()} Kč
          </span>
          <CaretRight size={16} weight="bold" className="text-info-strong shrink-0" />
        </span>
      </span>
    </button>
  );
}

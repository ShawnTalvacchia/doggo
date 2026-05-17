"use client";

import { CaretRight } from "@phosphor-icons/react";
import type { CarerCareServiceConfig } from "@/lib/types";

interface LinkedCareCalloutProps {
  service: CarerCareServiceConfig;
  carer: { name: string; avatarUrl: string };
  /** Opens the drop-off booking flow for this service. */
  onBook: () => void;
}

/**
 * Callout on a free community-walk meet for a linked drop-off **Care**
 * service (Service ↔ Meet Linkage, config #2). The walk is free to join as
 * a walker; this is the *separate* paid path — book the carer to walk your
 * dog, you don't come along. Book ≠ attend: tapping this opens a booking
 * flow that produces a Care `Booking`, it does NOT RSVP you to the meet.
 *
 * Distinct chrome from the required-link "About this service" card — this
 * sits alongside an intact free-RSVP path, so it reads as "or, instead".
 * 2026-05-17.
 */
export function LinkedCareCallout({ service, carer, onBook }: LinkedCareCalloutProps) {
  const carerFirst = carer.name.split(" ")[0];
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
      {/* Avatar is its own column; the title/subline and the price·caret
          row stack in the content column. The price drops to its own row
          so it isn't squeezed against wrapping copy on narrow screens. */}
      <span className="flex flex-col flex-1 min-w-0 gap-sm">
        <span className="flex flex-col gap-tiny">
          <span className="text-sm font-semibold text-fg-primary">
            Have {carerFirst} walk your dog
          </span>
          <span className="text-xs text-fg-tertiary">
            Drop-off — {carerFirst} takes your dog on this walk. You don&apos;t come along.
          </span>
        </span>
        <span className="flex items-center justify-between gap-xs">
          <span className="text-sm font-semibold text-info-strong">
            {service.pricePerUnit.toLocaleString()} Kč
          </span>
          <CaretRight size={16} weight="bold" className="text-info-strong shrink-0" />
        </span>
      </span>
    </button>
  );
}

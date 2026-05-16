"use client";

import { CaretRight } from "@phosphor-icons/react";
import type { CarerMeetServiceConfig } from "@/lib/types";

interface LinkedServiceCalloutProps {
  service: CarerMeetServiceConfig;
  carer: { name: string; avatarUrl: string };
  /** Opens the booking flow for this service. */
  onBook: () => void;
}

/**
 * Inline callout on a meet detail page for an OPTIONAL linked Meet-type
 * service — the meet is free to join, and the carer also offers a paid
 * service on it (mixed roster). Surfaces the paid option as a supplementary
 * affordance without displacing the free "Join" path.
 *
 * Required-link meets don't use this — their booking IS the RSVP, carried
 * by the meet's primary CTA. Service ↔ Meet Linkage, Workstream D2.
 */
export function LinkedServiceCallout({
  service,
  carer,
  onBook,
}: LinkedServiceCalloutProps) {
  const carerFirst = carer.name.split(" ")[0];
  return (
    <button
      type="button"
      onClick={onBook}
      className="flex items-center gap-md rounded-panel border border-edge-regular w-full text-left"
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
      <span className="flex flex-col flex-1 min-w-0 gap-xs">
        <span className="text-sm font-semibold text-fg-primary">
          {service.title}
        </span>
        <span className="text-xs text-fg-tertiary">
          Optional — book to have {carerFirst} work with your dog on this walk
        </span>
      </span>
      <span className="text-sm font-semibold text-brand-strong shrink-0">
        {service.pricePerSession.toLocaleString()} Kč
      </span>
      <CaretRight size={16} weight="bold" className="text-fg-tertiary shrink-0" />
    </button>
  );
}

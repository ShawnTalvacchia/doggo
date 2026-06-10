"use client";

import Link from "next/link";
import { CalendarCheck, ArrowRight } from "@phosphor-icons/react";
import type { ChatMessage } from "@/lib/types";
import { formatShortDate } from "@/lib/dateUtils";

/**
 * BookingConfirmationCard — the chat artifact for DIRECT-booked services
 * (Cross-Shelter Mentor Network O1 resolution, 2026-06-10).
 *
 * Appointment-confirmation framing, not contract framing: there's
 * nothing to approve (fixed price, instant booking), so unlike
 * `BookingProposalCard` it has no pending state, no Review & sign, no
 * "Signed" stamp — just the booked facts and the same "View booking →"
 * link the accepted-proposal footer carries. Keeps the chronicle rule
 * intact: every booking in a relationship is findable from its chat
 * thread.
 *
 * Reuses the `.inbox-proposal-*` CSS family (accepted treatment) so the
 * artifact reads as the same species as the other booking cards.
 *
 * First consumer: mentor sessions. Any future instant-book shape can
 * post the same message type.
 */
export function BookingConfirmationCard({ msg }: { msg: ChatMessage }) {
  const ref = msg.bookingRef!;
  return (
    <div className="inbox-proposal-card inbox-proposal-card--accepted">
      <div className="inbox-proposal-header">
        <CalendarCheck size={18} weight="regular" className="inbox-proposal-icon" />
        <span className="inbox-proposal-label">Booking confirmed</span>
      </div>

      <div className="inbox-proposal-body">
        <div className="inbox-proposal-row">
          <span className="inbox-proposal-field">Service</span>
          <span className="inbox-proposal-value">{ref.title}</span>
        </div>
        <div className="inbox-proposal-row">
          <span className="inbox-proposal-field">Details</span>
          <span className="inbox-proposal-value">{ref.contextLine}</span>
        </div>
        <div className="inbox-proposal-row">
          <span className="inbox-proposal-field">Date</span>
          <span className="inbox-proposal-value">{formatShortDate(ref.date)}</span>
        </div>
        <div className="inbox-proposal-row">
          <span className="inbox-proposal-field">Price</span>
          <span className="inbox-proposal-value inbox-proposal-price">{ref.priceLabel}</span>
        </div>
      </div>

      <div className="inbox-proposal-footer">
        <Link
          href={`/bookings/${ref.bookingId}`}
          className="inbox-proposal-status inbox-proposal-status--accepted inbox-proposal-status-link"
        >
          View booking
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </div>
  );
}

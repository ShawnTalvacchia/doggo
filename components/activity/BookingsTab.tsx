"use client";

import Link from "next/link";
import {
  PawPrint,
  MagnifyingGlass,
  Sparkle,
  Briefcase,
  EnvelopeSimple,
  CalendarDots,
  ArrowRight,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingListCard } from "@/components/bookings/BookingListCard";
import { useBookings } from "@/contexts/BookingsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";

const CURRENT_USER = "shawn";

/* ── Helpers ────────────────────────────────────────────────────── */

function getNextSessionDate(booking: { sessions?: { date: string; status: string }[]; startDate: string }): string | null {
  if (booking.sessions) {
    const next = booking.sessions.find((s) => s.status === "upcoming");
    return next?.date ?? null;
  }
  return booking.startDate;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* ── Summary stat strip ─────────────────────────────────────────── */

function StatStrip({
  activeCount,
  nextDate,
  requestCount,
}: {
  activeCount: number;
  nextDate: string | null;
  requestCount: number;
}) {
  if (activeCount === 0 && requestCount === 0) return null;

  return (
    <div className="flex gap-md flex-wrap">
      {activeCount > 0 && (
        <div className="flex items-center gap-sm px-md py-sm rounded-sm bg-surface-top border border-edge-light text-sm">
          <CalendarDots size={16} weight="light" className="text-fg-tertiary" />
          <span className="font-semibold text-fg-primary">{activeCount}</span>
          <span className="text-fg-secondary">
            {activeCount === 1 ? "active booking" : "active bookings"}
          </span>
          {nextDate && (
            <>
              <span className="text-fg-tertiary">·</span>
              <span className="text-fg-secondary">next {formatDate(nextDate)}</span>
            </>
          )}
        </div>
      )}
      {requestCount > 0 && (
        <div className="flex items-center gap-sm px-md py-sm rounded-sm bg-brand-subtle border border-brand-main text-sm">
          <EnvelopeSimple size={16} weight="light" className="text-brand-main" />
          <span className="font-semibold text-brand-strong">{requestCount}</span>
          <span className="text-brand-strong">
            {requestCount === 1 ? "new request" : "new requests"}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export function BookingsTab() {
  const { bookings } = useBookings();
  const { conversations } = useConversations();

  const ownerBookings = bookings.filter((b) => b.ownerId === CURRENT_USER);
  const activeOwnerBookings = ownerBookings.filter(
    (b) => b.status === "active" || b.status === "upcoming"
  );

  const carerBookings = bookings.filter((b) => b.carerId === CURRENT_USER);
  const activeCarerBookings = carerBookings.filter(
    (b) => b.status === "active" || b.status === "upcoming"
  );

  const incomingRequests = conversations.filter((conv) => {
    if (conv.conversationType !== "booking") return false;
    if (conv.providerId !== CURRENT_USER) return false;
    if (conv.messages.length === 0) return false;
    return !conv.messages.some((m) => m.type === "booking_proposal");
  });

  const totalActive = activeOwnerBookings.length + activeCarerBookings.length;

  // Find the soonest upcoming session across all active owner bookings
  const nextSessionDate = activeOwnerBookings
    .map((b) => getNextSessionDate(b))
    .filter((d): d is string => d !== null)
    .sort()[0] ?? null;

  const hasAnything =
    activeOwnerBookings.length > 0 ||
    activeCarerBookings.length > 0 ||
    incomingRequests.length > 0;

  return (
    <div className="body-container-main">
      {/* Header: summary strip + CTAs */}
      <div className="activity-header">
        <StatStrip
          activeCount={totalActive}
          nextDate={nextSessionDate}
          requestCount={incomingRequests.length}
        />

        {/* CTAs */}
        <div className="flex gap-sm flex-wrap">
          <ButtonAction
            variant="secondary"
            size="sm"
            href="/explore/results"
            leftIcon={<MagnifyingGlass size={16} weight="light" />}
          >
            Find Care
          </ButtonAction>
          <ButtonAction
            variant="secondary"
            size="sm"
            href="/profile?tab=services"
            leftIcon={<Sparkle size={16} weight="light" />}
          >
            Offer Care
          </ButtonAction>
        </div>
      </div>

      <div className="flex flex-col gap-xl p-lg">

      {!hasAnything && (
        <EmptyState
          icon={<PawPrint size={48} weight="light" />}
          title="No active bookings."
          subtitle="Find care for your dog or offer care to your community."
          action={
            <ButtonAction variant="secondary" size="sm" href="/explore/results">
              Find Care
            </ButtonAction>
          }
        />
      )}

      {/* Incoming requests — shown first, most time-sensitive */}
      {incomingRequests.length > 0 && (
        <section className="flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <h2 className="font-heading text-base font-semibold text-fg-primary flex items-center gap-sm flex-1">
              <EnvelopeSimple size={18} weight="light" className="text-brand-main" />
              Incoming Requests
            </h2>
            <span className="bg-brand-main text-white text-xs font-semibold rounded-full px-sm py-px">
              {incomingRequests.length}
            </span>
          </div>
          <div className="flex flex-col gap-sm">
            {incomingRequests.map((conv) => (
              <Link
                key={conv.id}
                href={`/inbox/${conv.id}`}
                className="flex items-center gap-md rounded-panel p-md no-underline bg-surface-top border border-edge-light"
              >
                <img
                  src={conv.ownerAvatarUrl}
                  alt={conv.ownerName}
                  className="rounded-full shrink-0 w-10 h-10 object-cover"
                />
                <div className="flex flex-col flex-1 gap-xs min-w-0">
                  <span className="text-sm font-semibold text-fg-primary">
                    {conv.ownerName}
                  </span>
                  <span className="text-xs text-fg-tertiary truncate">
                    {SERVICE_LABELS[conv.inquiry.serviceType]}
                    {conv.inquiry.subService ? ` · ${conv.inquiry.subService}` : ""}
                    {conv.inquiry.pets.length > 0
                      ? ` · ${conv.inquiry.pets.join(", ")}`
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-sm flex-shrink-0">
                  <span className="text-xs font-semibold text-brand-strong bg-brand-subtle rounded-pill px-sm py-xs">
                    New
                  </span>
                  <ArrowRight size={16} weight="light" className="text-fg-tertiary" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Care bookings — as owner */}
      {activeOwnerBookings.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-base font-semibold text-fg-primary flex items-center gap-sm">
            <PawPrint size={18} weight="light" className="text-brand-main" />
            Your Care Bookings
          </h2>
          <div className="flex flex-col gap-sm">
            {activeOwnerBookings.map((booking) => (
              <BookingListCard
                key={booking.id}
                booking={booking}
                perspective="owner"
              />
            ))}
          </div>
          {/* Link to full booking history */}
          <Link
            href="/bookings"
            className="flex items-center gap-xs text-sm font-semibold text-brand-main no-underline self-start"
          >
            View all bookings
            <ArrowRight size={14} weight="bold" />
          </Link>
        </section>
      )}

      {/* Care services — as carer */}
      {activeCarerBookings.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-base font-semibold text-fg-primary flex items-center gap-sm">
            <Briefcase size={18} weight="light" className="text-brand-main" />
            Your Care Services
          </h2>
          <div className="flex flex-col gap-sm">
            {activeCarerBookings.map((booking) => (
              <BookingListCard
                key={booking.id}
                booking={booking}
                perspective="carer"
              />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}

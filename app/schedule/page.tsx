"use client";

import Link from "next/link";
import { CalendarDots, PawPrint, MagnifyingGlass, Sparkle, Plus, Briefcase, EnvelopeSimple } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { MeetCard } from "@/components/meets/MeetCard";
import { BookingListCard } from "@/components/bookings/BookingListCard";
import { getUserMeets } from "@/lib/mockMeets";
import { useBookings } from "@/contexts/BookingsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";

export default function SchedulePage() {
  const myMeets = getUserMeets("shawn");
  const { bookings } = useBookings();
  const { conversations } = useConversations();
  const upcoming = myMeets.filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const past = myMeets.filter((m) => m.status === "completed");

  // Split upcoming into "this week" (next 7 days) and "coming up" (after)
  const now = new Date("2026-03-16");
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const thisWeek = upcoming.filter((m) => {
    const d = new Date(m.date);
    return d >= now && d < weekEnd;
  });
  const comingUp = upcoming.filter((m) => {
    const d = new Date(m.date);
    return d >= weekEnd;
  });

  // Care bookings where user is the carer
  const carerBookings = bookings.filter((b) => b.carerId === "shawn");
  const activeCarerBookings = carerBookings.filter((b) => b.status === "active" || b.status === "upcoming");

  // Care bookings where user is the owner
  const ownerBookings = bookings.filter((b) => b.ownerId === "shawn");
  const activeOwnerBookings = ownerBookings.filter((b) => b.status === "active" || b.status === "upcoming");
  const pastOwnerBookings = ownerBookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  // Incoming care requests — booking conversations where user is the provider
  // and there's an inquiry but no booking proposal yet in the messages
  const incomingRequests = conversations.filter((conv) => {
    if (conv.conversationType !== "booking") return false;
    if (conv.providerId !== "shawn") return false;
    if (conv.messages.length === 0) return false;
    const hasProposal = conv.messages.some((m) => m.type === "booking_proposal");
    return !hasProposal;
  });

  return (
    <div className="flex flex-col gap-xl p-xl bg-surface-popout" style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%", minHeight: "calc(100vh - var(--nav-height))" }}>
      <header className="flex items-center justify-between pt-md">
        <h1 className="font-heading text-2xl font-semibold text-fg-primary">Schedule</h1>
        <ButtonAction
          variant="primary"
          size="sm"
          cta
          href="/meets/create"
          leftIcon={<Plus size={16} weight="bold" />}
        >
          Create Meet
        </ButtonAction>
      </header>

      {/* Secondary CTAs */}
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

      {/* This week */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">This Week</h2>
        {thisWeek.length > 0 ? (
          <div className="flex flex-col gap-md">
            {thisWeek.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<CalendarDots size={48} weight="light" />}
            title="Nothing scheduled this week."
          />
        )}
      </section>

      {/* Coming up */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Coming Up</h2>
        {comingUp.length > 0 ? (
          <div className="flex flex-col gap-md">
            {comingUp.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<CalendarDots size={48} weight="light" />}
            title="No meets scheduled beyond this week."
          />
        )}
      </section>

      {/* Care bookings — as owner */}
      {activeOwnerBookings.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-lg font-semibold text-fg-primary flex items-center gap-sm">
            <PawPrint size={22} weight="light" className="text-brand-main" />
            Your Care Bookings
          </h2>
          <div className="flex flex-col gap-sm">
            {activeOwnerBookings.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} perspective="owner" />
            ))}
          </div>
        </section>
      )}

      {/* Incoming care requests — as carer */}
      {incomingRequests.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-lg font-semibold text-fg-primary flex items-center gap-sm">
            <EnvelopeSimple size={22} weight="light" className="text-brand-main" />
            Incoming Requests
            <span className="bg-brand-main text-white text-xs font-semibold rounded-full px-sm py-px">
              {incomingRequests.length}
            </span>
          </h2>
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
                <div className="flex flex-col flex-1 gap-xs">
                  <span className="text-sm font-medium text-fg-primary">{conv.ownerName}</span>
                  <span className="text-xs text-fg-tertiary">
                    {SERVICE_LABELS[conv.inquiry.serviceType]}
                    {conv.inquiry.subService ? ` · ${conv.inquiry.subService}` : ""}
                    {conv.inquiry.pets.length > 0 ? ` · ${conv.inquiry.pets.join(", ")}` : ""}
                  </span>
                </div>
                <span className="text-xs font-medium text-brand-strong bg-brand-subtle rounded-pill px-sm py-xs whitespace-nowrap">
                  New
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Care bookings — as carer */}
      {activeCarerBookings.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-lg font-semibold text-fg-primary flex items-center gap-sm">
            <Briefcase size={22} weight="light" className="text-brand-main" />
            Your Care Services
          </h2>
          <div className="flex flex-col gap-sm">
            {activeCarerBookings.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} perspective="carer" />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Past</h2>
        {past.length > 0 || pastOwnerBookings.length > 0 ? (
          <div className="flex flex-col gap-md">
            {past.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
            {pastOwnerBookings.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} perspective="owner" />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<PawPrint size={48} weight="light" />}
            title="Completed meets and bookings will show here."
          />
        )}
      </section>
    </div>
  );
}

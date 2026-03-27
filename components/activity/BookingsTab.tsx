"use client";

import Link from "next/link";
import {
  PawPrint,
  MagnifyingGlass,
  Sparkle,
  Briefcase,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingListCard } from "@/components/bookings/BookingListCard";
import { useBookings } from "@/contexts/BookingsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";

export function BookingsTab() {
  const { bookings } = useBookings();
  const { conversations } = useConversations();

  const ownerBookings = bookings.filter((b) => b.ownerId === "shawn");
  const activeOwnerBookings = ownerBookings.filter(
    (b) => b.status === "active" || b.status === "upcoming"
  );

  const carerBookings = bookings.filter((b) => b.carerId === "shawn");
  const activeCarerBookings = carerBookings.filter(
    (b) => b.status === "active" || b.status === "upcoming"
  );

  const incomingRequests = conversations.filter((conv) => {
    if (conv.conversationType !== "booking") return false;
    if (conv.providerId !== "shawn") return false;
    if (conv.messages.length === 0) return false;
    const hasProposal = conv.messages.some((m) => m.type === "booking_proposal");
    return !hasProposal;
  });

  const hasAnything =
    activeOwnerBookings.length > 0 ||
    activeCarerBookings.length > 0 ||
    incomingRequests.length > 0;

  return (
    <div className="flex flex-col gap-xl">
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

      {!hasAnything && (
        <EmptyState
          icon={<PawPrint size={48} weight="light" />}
          title="No active bookings."
          subtitle="Find care for your dog or offer care to your community."
        />
      )}

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
    </div>
  );
}

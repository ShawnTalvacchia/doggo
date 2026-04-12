"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PawPrint,
  Briefcase,
  House,
  Moon,
  ArrowRight,
  EnvelopeSimple,
  PencilSimple,
  Eye,
  CalendarCheck,
  Coins,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { BookingListCard } from "@/components/bookings/BookingListCard";
import { useBookings } from "@/contexts/BookingsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { mockUser } from "@/lib/mockUser";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { CarerServiceConfig, CarerVisibility } from "@/lib/types";

const CURRENT_USER = "shawn";

const VISIBILITY_LABELS: Record<CarerVisibility, string> = {
  open: "Open to everyone",
  connected_only: "Connected only",
  familiar_and_above: "Familiar & above",
};

const VISIBILITY_COLORS: Record<CarerVisibility, string> = {
  open: "var(--status-success-main, #16a34a)",
  connected_only: "var(--brand-main)",
  familiar_and_above: "var(--text-secondary)",
};

const SERVICE_ICON_MAP: Record<string, React.ReactNode> = {
  walk_checkin: <PawPrint size={22} weight="fill" />,
  inhome_sitting: <House size={22} weight="fill" />,
  boarding: <Moon size={22} weight="fill" />,
};

/* ── Empty state ─────────────────────────────────────────────────── */

function ProviderEmptyState() {
  return (
    <div className="services-empty">
      <div className="services-empty-icon">
        <Briefcase size={52} weight="light" />
      </div>
      <h2 className="services-empty-title">Start offering care</h2>
      <p className="services-empty-body">
        Your neighbours are already looking for someone they can trust.
        Set up your services and start earning in your community — no
        experience required, just your love of dogs.
      </p>
      <ButtonAction variant="primary" size="md" cta href="/profile?tab=services">
        Set up your services
      </ButtonAction>
    </div>
  );
}

/* ── Provider status bar ─────────────────────────────────────────── */

function ProviderStatusBar({
  visibility,
  accepting,
  onToggle,
}: {
  visibility: CarerVisibility;
  accepting: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="services-status-bar">
      <div className="services-status-item">
        <Eye size={15} weight="light" className="text-fg-tertiary" />
        <span className="text-sm text-fg-secondary">Visible to</span>
        <span
          className="text-sm font-semibold"
          style={{ color: VISIBILITY_COLORS[visibility] }}
        >
          {VISIBILITY_LABELS[visibility]}
        </span>
        <Link href="/profile?tab=services" className="services-status-edit">
          Edit
        </Link>
      </div>

      <button type="button" className="services-toggle-row" onClick={onToggle}>
        <span className="text-sm text-fg-secondary">Accepting bookings</span>
        <span className={`services-toggle${accepting ? " services-toggle--on" : ""}`}>
          <span className="services-toggle-knob" />
        </span>
      </button>
    </div>
  );
}

/* ── Service card ────────────────────────────────────────────────── */

function ServiceCard({ service }: { service: CarerServiceConfig }) {
  return (
    <div className="services-service-card">
      <div className="services-service-card-header">
        <span className="services-service-icon">
          {SERVICE_ICON_MAP[service.serviceType] ?? <Briefcase size={22} weight="fill" />}
        </span>
        <div className="flex flex-col flex-1 min-w-0 gap-xs">
          <div className="flex items-center gap-sm flex-wrap">
            <h3 className="text-base font-semibold text-fg-primary">
              {SERVICE_LABELS[service.serviceType]}
            </h3>
            {!service.enabled && (
              <span className="text-xs text-fg-tertiary px-sm rounded-full border border-edge-light">
                Paused
              </span>
            )}
          </div>
          <span className="text-sm text-fg-secondary">
            {service.pricePerUnit} Kč{" "}
            {service.priceUnit === "per_visit" ? "/ visit" : "/ night"}
          </span>
        </div>
        <Link
          href="/profile?tab=services"
          className="services-service-edit"
          aria-label="Edit service"
        >
          <PencilSimple size={15} weight="light" />
          <span className="text-sm font-semibold">Edit</span>
        </Link>
      </div>

      {service.subServices.length > 0 && (
        <div className="flex flex-wrap gap-xs">
          {service.subServices.map((s) => (
            <span key={s} className="services-sub-chip">
              {s}
            </span>
          ))}
        </div>
      )}

      {service.notes && (
        <p className="text-sm text-fg-secondary leading-relaxed">{service.notes}</p>
      )}
    </div>
  );
}

/* ── Stats strip ─────────────────────────────────────────────────── */

function StatsStrip({
  sessions,
  earned,
  dogs,
}: {
  sessions: number;
  earned: number;
  dogs: number;
}) {
  if (sessions === 0) return null;

  return (
    <div className="services-stats-strip">
      <div className="services-stat">
        <CalendarCheck size={18} weight="light" className="text-brand-main" />
        <span className="services-stat-num">{sessions}</span>
        <span className="services-stat-label">
          {sessions === 1 ? "session" : "sessions"}
        </span>
      </div>
      <div className="services-stat-divider" />
      <div className="services-stat">
        <Coins size={18} weight="light" className="text-brand-main" />
        <span className="services-stat-num">{earned.toLocaleString("cs-CZ")} Kč</span>
        <span className="services-stat-label">earned</span>
      </div>
      <div className="services-stat-divider" />
      <div className="services-stat">
        <PawPrint size={18} weight="light" className="text-brand-main" />
        <span className="services-stat-num">{dogs}</span>
        <span className="services-stat-label">
          {dogs === 1 ? "dog" : "dogs"} cared for
        </span>
      </div>
    </div>
  );
}

/* ── Main tab ────────────────────────────────────────────────────── */

export function ServicesTab() {
  const { bookings } = useBookings();
  const { conversations } = useConversations();

  const carerProfile = mockUser.carerProfile;
  const hasServices = (carerProfile?.services?.length ?? 0) > 0;

  const [accepting, setAccepting] = useState(
    carerProfile?.acceptingBookings ?? false
  );

  // Carer-perspective bookings
  const carerBookings = bookings.filter((b) => b.carerId === CURRENT_USER);
  const activeCarerBookings = carerBookings.filter(
    (b) => b.status === "active" || b.status === "upcoming"
  );
  const completedCarerBookings = carerBookings.filter(
    (b) => b.status === "completed"
  );

  // Incoming requests where shawn is the provider and no proposal sent yet
  const incomingRequests = conversations.filter((conv) => {
    if (conv.conversationType !== "booking") return false;
    if (conv.providerId !== CURRENT_USER) return false;
    if (conv.messages.length === 0) return false;
    return !conv.messages.some((m) => m.type === "booking_proposal");
  });

  // Stats derived from mock data
  const completedSessions = [
    ...completedCarerBookings.flatMap(
      (b) =>
        b.sessions?.filter((s) => s.status === "completed") ??
        [{ id: "x", date: b.startDate, status: "completed" as const }]
    ),
    ...activeCarerBookings.flatMap(
      (b) => b.sessions?.filter((s) => s.status === "completed") ?? []
    ),
  ];

  const totalEarned =
    completedCarerBookings.reduce((sum, b) => {
      const count =
        b.sessions?.filter((s) => s.status === "completed").length ?? 1;
      const rate = b.price.lineItems[0]?.amount ?? 0;
      return (
        sum +
        (b.price.billingCycle === "per_session" ? count * rate : b.price.total)
      );
    }, 0) +
    activeCarerBookings.reduce((sum, b) => {
      const count =
        b.sessions?.filter((s) => s.status === "completed").length ?? 0;
      return sum + count * (b.price.lineItems[0]?.amount ?? 0);
    }, 0);

  const uniqueDogs = new Set(carerBookings.flatMap((b) => b.pets)).size;

  /* ── Empty state ── */
  if (!hasServices) {
    return (
      <div className="body-container-main">
        <ProviderEmptyState />
      </div>
    );
  }

  return (
    <div className="body-container-main">
      {/* Status bar in header */}
      <div className="activity-header">
        <ProviderStatusBar
          visibility={carerProfile!.visibility ?? "connected_only"}
          accepting={accepting}
          onToggle={() => setAccepting((v) => !v)}
        />
      </div>

      <div className="flex flex-col gap-xl p-lg">
        {/* Stats */}
        <StatsStrip
          sessions={completedSessions.length}
          earned={totalEarned}
          dogs={uniqueDogs}
        />

        {/* Your services */}
        <section className="flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <h2 className="services-section-label">Your Services</h2>
            <Link
              href="/profile?tab=services"
              className="flex items-center gap-xs text-sm font-semibold text-brand-main no-underline"
            >
              View profile
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          <div className="flex flex-col gap-sm">
            {carerProfile!.services.map((s) => (
              <ServiceCard key={s.serviceType} service={s} />
            ))}
          </div>
        </section>

        {/* Incoming requests */}
        {incomingRequests.length > 0 && (
          <section className="flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <h2 className="services-section-label flex-1">Requests</h2>
              <span className="bg-brand-main text-white text-xs font-semibold rounded-full px-sm py-px">
                {incomingRequests.length}
              </span>
            </div>
            <div className="flex flex-col gap-sm">
              {incomingRequests.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/profile/${conv.ownerId}?tab=chat`}
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
                      {conv.inquiry.subService
                        ? ` · ${conv.inquiry.subService}`
                        : ""}
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

        {/* Active bookings as carer */}
        {activeCarerBookings.length > 0 && (
          <section className="flex flex-col gap-md">
            <h2 className="services-section-label">Active</h2>
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

"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDots,
  MagnifyingGlass,
  Briefcase,
  MapPin,
  Dog,
  ChatCircleDots,
  Clock,
  ArrowLeft,
} from "@phosphor-icons/react";
import { useBookings } from "@/contexts/BookingsContext";
import type { Booking } from "@/lib/types";
import { BookingRow } from "@/components/ui/BookingRow";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ServicesTab } from "@/components/activity/ServicesTab";
import { MasterDetailShell, type MobileView } from "@/components/layout/MasterDetailShell";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { SERVICE_LABELS } from "@/lib/constants/services";

const TABS = [
  { key: "care", label: "My Care" },
  { key: "services", label: "My Services" },
];

/* ── Helpers ── */

function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateRange(start: string, end: string | null): string {
  if (!end) return `From ${formatShortDate(start)}`;
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

function scheduleLabel(booking: Booking): string {
  if (booking.recurringSchedule) {
    const { days, timeLabel } = booking.recurringSchedule;
    return `Every ${days.join(", ")} · ${timeLabel}`;
  }
  return formatDateRange(booking.startDate, booking.endDate);
}

/* ── Section group ── */

function BookingSection({
  title,
  bookings,
  onSelect,
  selectedId,
}: {
  title: string;
  bookings: Booking[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  if (bookings.length === 0) return null;
  return (
    <div className="bookings-section">
      <p className="bookings-section-heading">{title}</p>
      {bookings.map((b) => (
        <div
          key={b.id}
          onClick={(e) => {
            e.preventDefault();
            onSelect(b.id);
          }}
          style={{ cursor: "pointer" }}
        >
          <BookingRow booking={b} />
        </div>
      ))}
    </div>
  );
}

/* ── Booking detail panel ── */

function BookingDetail({
  booking,
  onBack,
}: {
  booking: Booking;
  onBack: () => void;
}) {
  const serviceLabel = SERVICE_LABELS[booking.serviceType];

  return (
      <div className="flex flex-col gap-xl" style={{ padding: "var(--space-lg)" }}>
        {/* Provider header */}
        <div className="flex items-center gap-md">
          <img
            src={booking.carerAvatarUrl}
            alt={booking.carerName}
            className="rounded-full object-cover shrink-0"
            style={{ width: 56, height: 56 }}
          />
          <div className="flex flex-col gap-xs">
            <span className="font-heading font-bold text-fg-primary text-lg">
              {booking.carerName}
            </span>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Service info */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <Briefcase size={16} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-secondary">{serviceLabel}</span>
            {booking.subService && (
              <span className="text-sm text-fg-tertiary">· {booking.subService}</span>
            )}
          </div>

          <div className="flex items-center gap-sm">
            <Dog size={16} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-secondary">{booking.pets.join(", ")}</span>
          </div>

          <div className="flex items-center gap-sm">
            <Clock size={16} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-secondary">{scheduleLabel(booking)}</span>
          </div>

          <div className="flex items-center gap-sm">
            <span className="text-md font-semibold text-fg-primary">
              {booking.price.billingCycle === "per_session"
                ? `${booking.price.total.toLocaleString()} Kč / session`
                : booking.price.billingCycle === "per_night"
                ? `${booking.price.total.toLocaleString()} Kč / night`
                : `${booking.price.total.toLocaleString()} Kč total`}
            </span>
          </div>
        </div>

        {/* Sessions */}
        {booking.sessions && booking.sessions.length > 0 && (
          <div className="flex flex-col gap-sm">
            <span className="font-body font-bold text-fg-secondary text-sm">Sessions</span>
            {booking.sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between bg-surface-inset rounded-sm"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                <span className="text-sm text-fg-secondary">
                  {formatShortDate(session.date)}
                </span>
                <StatusBadge status={session.status === "in_progress" ? "active" : session.status} />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-sm">
          <ButtonAction variant="secondary" size="sm" href={`/inbox`}>
            <ChatCircleDots size={16} weight="light" />
            Message {booking.carerName}
          </ButtonAction>
        </div>
      </div>
  );
}

/* ── My Care tab ── */

function MyCareContent({
  onSelect,
  selectedId,
}: {
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const { bookings } = useBookings();
  const ownerBookings = bookings.filter((b) => b.ownerId === "shawn");

  const active = ownerBookings.filter((b) => b.status === "active");
  const upcoming = ownerBookings.filter((b) => b.status === "upcoming");
  const past = ownerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (ownerBookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <EmptyState
          icon={<CalendarDots size={48} weight="light" />}
          title="No care bookings yet."
          subtitle="Find a trusted carer in your community."
          action={
            <ButtonAction variant="secondary" size="sm" href="/discover?tab=care">
              <MagnifyingGlass size={14} weight="light" />
              Find Care
            </ButtonAction>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <BookingSection title="Active" bookings={active} onSelect={onSelect} selectedId={selectedId} />
      <BookingSection title="Upcoming" bookings={upcoming} onSelect={onSelect} selectedId={selectedId} />
      <BookingSection title="Past" bookings={past} onSelect={onSelect} selectedId={selectedId} />
    </div>
  );
}

/* ── Page ── */

function BookingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "care";
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { bookings } = useBookings();

  const selectedBooking = selectedBookingId
    ? bookings.find((b) => b.id === selectedBookingId) ?? null
    : null;

  const handleTabChange = (key: string) => {
    router.replace(`/bookings?tab=${key}`, { scroll: false });
    setSelectedBookingId(null);
  };

  const mobileView: MobileView = selectedBooking ? "detail" : "list";

  const serviceLabel = selectedBooking ? SERVICE_LABELS[selectedBooking.serviceType] : null;

  return (
    <div className="page-container bookings-page-shell">
    <MasterDetailShell
      mobileView={mobileView}
      listPanel={
        <div className="list-panel">
          <div className="list-panel-header panel-header-desktop">
            <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
          </div>
          <PanelBody>
            {activeTab === "care" && (
              <MyCareContent
                onSelect={setSelectedBookingId}
                selectedId={selectedBookingId}
              />
            )}
            {activeTab === "services" && <ServicesTab />}
            <Spacer />
          </PanelBody>
        </div>
      }
      detailPanel={
        <div className="detail-panel">
          {selectedBooking && (
            <div className="detail-panel-header">
              <span className="font-heading text-base font-semibold text-fg-primary">
                {serviceLabel} with {selectedBooking.carerName}
              </span>
            </div>
          )}
          <PanelBody>
            {selectedBooking ? (
              <BookingDetail
                booking={selectedBooking}
                onBack={() => setSelectedBookingId(null)}
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center flex-1 gap-md"
                style={{ padding: "var(--space-xxxl)" }}
              >
                <Briefcase size={48} weight="light" className="text-fg-tertiary" />
                <span className="text-md text-fg-tertiary">
                  Select a booking to see details
                </span>
              </div>
            )}
            <Spacer />
          </PanelBody>
        </div>
      }
    />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsPageInner />
    </Suspense>
  );
}

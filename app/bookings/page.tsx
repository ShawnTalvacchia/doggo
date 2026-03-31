"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDots, MagnifyingGlass, Briefcase } from "@phosphor-icons/react";
import { useBookings } from "@/contexts/BookingsContext";
import type { Booking } from "@/lib/types";
import { BookingRow } from "@/components/ui/BookingRow";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ServicesTab } from "@/components/activity/ServicesTab";

const TABS = [
  { key: "care", label: "My Care" },
  { key: "services", label: "My Services" },
];

// ── Section group ────────────────────────────────────────────────────────────────

function BookingSection({
  title,
  bookings,
}: {
  title: string;
  bookings: Booking[];
}) {
  if (bookings.length === 0) return null;
  return (
    <div className="bookings-section">
      <p className="bookings-section-heading">{title}</p>
      {bookings.map((b) => (
        <BookingRow key={b.id} booking={b} />
      ))}
    </div>
  );
}

// ── My Care tab ──────────────────────────────────────────────────────────────────

function MyCareTab() {
  const { bookings } = useBookings();

  // Filter to owner's bookings only
  const ownerBookings = bookings.filter((b) => b.ownerId === "shawn");

  const active = ownerBookings.filter((b) => b.status === "active");
  const upcoming = ownerBookings.filter((b) => b.status === "upcoming");
  const past = ownerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const isEmpty = ownerBookings.length === 0;

  if (isEmpty) {
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
      <BookingSection title="Active" bookings={active} />
      <BookingSection title="Upcoming" bookings={upcoming} />
      <BookingSection title="Past" bookings={past} />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────────

function BookingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "care";

  const handleTabChange = (key: string) => {
    router.replace(`/bookings?tab=${key}`, { scroll: false });
  };

  return (
    <div className="page-container activity-page">
      {/* Tab header — sticky */}
      <div className="activity-tab-header">
        <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
      </div>

      {/* Tab content */}
      <div className="activity-body">
        {activeTab === "care" && (
          <div className="body-container-main">
            <MyCareTab />
          </div>
        )}
        {activeTab === "services" && <ServicesTab />}
      </div>
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

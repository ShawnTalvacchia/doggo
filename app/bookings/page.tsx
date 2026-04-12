"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarDots,
  Briefcase,
} from "@phosphor-icons/react";
import { useBookings } from "@/contexts/BookingsContext";
import type { Booking } from "@/lib/types";
import { BookingRow } from "@/components/ui/BookingRow";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PageColumn } from "@/components/layout/PageColumn";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { SectionLabel } from "@/components/ui/SectionLabel";

const CURRENT_USER = "shawn";

const TABS = [
  { key: "care", label: "My Care" },
  { key: "services", label: "My Services" },
];

/* ── Section group ── */

function BookingSection({
  title,
  bookings,
}: {
  title: string;
  bookings: Booking[];
}) {
  if (bookings.length === 0) return null;
  return (
    <div className="flex flex-col gap-xs">
      <SectionLabel className="px-md py-sm">{title}</SectionLabel>
      {bookings.map((b) => (
        <BookingRow key={b.id} booking={b} />
      ))}
    </div>
  );
}

/* ── My Care tab — owner-side bookings ── */

function MyCareContent() {
  const { bookings } = useBookings();
  const ownerBookings = bookings.filter((b) => b.ownerId === CURRENT_USER);

  const active = ownerBookings.filter((b) => b.status === "active");
  const upcoming = ownerBookings.filter((b) => b.status === "upcoming");
  const past = ownerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (ownerBookings.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDots size={48} weight="light" />}
        title="No care bookings yet."
        subtitle="Find a trusted carer in your community."
        action={
          <ButtonAction variant="primary" size="sm" href="/discover/care">
            Find Care
          </ButtonAction>
        }
      />
    );
  }

  return (
    <LayoutList>
      <BookingSection title="Active" bookings={active} />
      <BookingSection title="Upcoming" bookings={upcoming} />
      <BookingSection title="Past" bookings={past} />
    </LayoutList>
  );
}

/* ── My Services tab — carer-side bookings ── */

function MyServicesContent() {
  const { bookings } = useBookings();
  const carerBookings = bookings.filter((b) => b.carerId === CURRENT_USER);

  const active = carerBookings.filter((b) => b.status === "active");
  const upcoming = carerBookings.filter((b) => b.status === "upcoming");
  const past = carerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (carerBookings.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase size={48} weight="light" />}
        title="No service bookings yet."
        subtitle="Set up your services in your profile to start receiving bookings."
        action={
          <ButtonAction variant="primary" size="sm" href="/profile?tab=services">
            Set up services
          </ButtonAction>
        }
      />
    );
  }

  return (
    <LayoutList>
      <BookingSection title="Active" bookings={active} />
      <BookingSection title="Upcoming" bookings={upcoming} />
      <BookingSection title="Past" bookings={past} />
    </LayoutList>
  );
}

/* ── Page ── */

function BookingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "care";

  const handleTabChange = (key: string) => {
    if (key === "care") {
      router.replace("/bookings", { scroll: false });
    } else {
      router.replace(`/bookings?tab=${key}`, { scroll: false });
    }
  };

  return (
    <PageColumn title="Bookings">
      <div className="page-column-panel-body">
        <div className="page-column-panel-tabs">
          <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
        </div>
        {activeTab === "care" && <MyCareContent />}
        {activeTab === "services" && <MyServicesContent />}
        <Spacer />
      </div>
    </PageColumn>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsPageInner />
    </Suspense>
  );
}

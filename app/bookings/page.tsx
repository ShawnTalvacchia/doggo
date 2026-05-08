"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDots,
  Briefcase,
  HandHeart,
  MagnifyingGlass,
  ArrowRight,
  X,
} from "@phosphor-icons/react";
import { useBookings } from "@/contexts/BookingsContext";
import { usePersistedState } from "@/lib/usePersistedState";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import type { Booking } from "@/lib/types";
import { BookingRow } from "@/components/ui/BookingRow";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PageColumn } from "@/components/layout/PageColumn";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
  const CURRENT_USER = useCurrentUserId();
  const ownerBookings = bookings.filter((b) => b.ownerId === CURRENT_USER);

  // Pipeline view: proposed → upcoming → active → past. Discover & Care G5.
  const proposed = ownerBookings.filter((b) => b.status === "proposed");
  const active = ownerBookings.filter((b) => b.status === "active");
  const upcoming = ownerBookings.filter((b) => b.status === "upcoming");
  const past = ownerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (ownerBookings.length === 0) {
    return (
      <LayoutSection>
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
      </LayoutSection>
    );
  }

  return (
    <LayoutList>
      <BookingSection title="Pending" bookings={proposed} />
      <BookingSection title="Active" bookings={active} />
      <BookingSection title="Upcoming" bookings={upcoming} />
      <BookingSection title="Past" bookings={past} />
    </LayoutList>
  );
}

/* ── My Services tab — carer-side bookings ── */

function MyServicesContent() {
  const { bookings } = useBookings();
  const CURRENT_USER = useCurrentUserId();
  const carerBookings = bookings.filter((b) => b.carerId === CURRENT_USER);

  const proposed = carerBookings.filter((b) => b.status === "proposed");
  const active = carerBookings.filter((b) => b.status === "active");
  const upcoming = carerBookings.filter((b) => b.status === "upcoming");
  const past = carerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (carerBookings.length === 0) {
    return (
      <LayoutSection>
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
      </LayoutSection>
    );
  }

  return (
    <LayoutList>
      <BookingSection title="Pending" bookings={proposed} />
      <BookingSection title="Active" bookings={active} />
      <BookingSection title="Upcoming" bookings={upcoming} />
      <BookingSection title="Past" bookings={past} />
    </LayoutList>
  );
}

/* ── Cross-side upsell banner ──
   Renders at the TOP of single-mode (when the user only has bookings
   on one side) as a slim, dismissable banner — not a card. Owner-side
   nudges toward providing; carer-side toward booking care. The product
   strategy says everyone is on the same dial — *the provider role is
   a dial you turn up* — so this banner is the active discoverability
   path for users who signed up with one role.

   Persistent dismiss via `doggo-bookings-upsell-dismissed`. Once the
   user X's it out, it's gone for good — they can still find the role-
   expansion path on /profile?tab=services or /discover/care. Sized
   slim (single line), positioned above content not below, so it
   doesn't get buried as the booking list grows. 2026-05-08
   walkthrough refinement. */

const UPSELL_DISMISS_KEY = "doggo-bookings-upsell-dismissed";

function CrossSideUpsell({ mode }: { mode: "owner" | "carer" }) {
  const [dismissed, setDismissed] = usePersistedState<{ owner?: boolean; carer?: boolean }>(
    UPSELL_DISMISS_KEY,
    {},
  );

  if ((mode === "owner" && dismissed.owner) || (mode === "carer" && dismissed.carer)) {
    return null;
  }

  const config =
    mode === "owner"
      ? {
          href: "/profile?tab=services",
          icon: <HandHeart size={16} weight="fill" />,
          label: "Offer to help your neighbours? Set up a service on your profile",
        }
      : {
          href: "/discover/care",
          icon: <MagnifyingGlass size={16} weight="bold" />,
          label: "Need care for your dog? Find someone you trust",
        };

  return (
    <div className="bookings-upsell-banner">
      <Link href={config.href} className="bookings-upsell-banner-link">
        <span className="bookings-upsell-banner-icon">{config.icon}</span>
        <span className="bookings-upsell-banner-label">{config.label}</span>
        <ArrowRight size={14} weight="bold" className="bookings-upsell-banner-chevron" />
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setDismissed((prev) => ({ ...prev, [mode]: true }));
        }}
        className="bookings-upsell-banner-dismiss"
        aria-label="Dismiss"
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  );
}

/* ── Page ── */

function BookingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { bookings } = useBookings();
  const CURRENT_USER = useCurrentUserId();

  // Decide page mode based on what bookings the viewer actually has on
  // each side. Most users live firmly in one role (Daniel = owner only,
  // Klára = carer only); forcing them through tabs creates the
  // empty-tab-then-switch friction every visit. When the viewer has
  // bookings on BOTH sides (Tomáš in mock world, multi-role users in
  // production), tabs come back. Sessions & Service Execution A6
  // walkthrough refinement, 2026-05-06.
  const hasOwnerBookings = bookings.some((b) => b.ownerId === CURRENT_USER);
  const hasCarerBookings = bookings.some((b) => b.carerId === CURRENT_USER);
  const showTabs = hasOwnerBookings && hasCarerBookings;

  // Single-mode picks the side that's actually populated. Falls back
  // to "care" for brand-new users (typical owner entry path).
  const singleMode: "care" | "services" = hasCarerBookings && !hasOwnerBookings
    ? "services"
    : "care";

  const activeTab = showTabs
    ? (searchParams.get("tab") || "care")
    : singleMode;

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
        {showTabs && (
          <div className="page-column-panel-tabs">
            <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
          </div>
        )}
        {activeTab === "care" && (
          <>
            {!showTabs && <CrossSideUpsell mode="owner" />}
            <MyCareContent />
          </>
        )}
        {activeTab === "services" && (
          <>
            {!showTabs && <CrossSideUpsell mode="carer" />}
            <MyServicesContent />
          </>
        )}
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

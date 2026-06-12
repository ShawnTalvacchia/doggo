"use client";

import { Suspense, type ReactNode } from "react";
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
  { key: "volunteering", label: "Volunteering" },
];

type TabKey = "care" | "services" | "volunteering";

/** Shelter-dog activity — mentor sessions (paid onboarding toward solo
 *  walking) AND solo volunteer walks. Pulled OUT of My Care / My Services
 *  into its own Volunteering category so the whole shelter-walking arc
 *  (book a mentor → graduate → walk solo) reads in one place and the paid
 *  tabs stay about paid care. A mentor session is paid, but it's
 *  volunteering you pay to unlock, so it belongs with the walks. */
const isShelterActivity = (b: Booking) =>
  b.mentorSession != null || b.ownerKind === "shelter";

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

/* ── Shared pipeline renderer ── */

function BookingPipeline({
  bookings,
  empty,
}: {
  bookings: Booking[];
  empty: ReactNode;
}) {
  if (bookings.length === 0) return <LayoutSection>{empty}</LayoutSection>;

  // Pipeline view: proposed → active → upcoming → past. Discover & Care G5.
  const proposed = bookings.filter((b) => b.status === "proposed");
  const active = bookings.filter((b) => b.status === "active");
  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <LayoutList>
      <BookingSection title="Pending" bookings={proposed} />
      <BookingSection title="Active" bookings={active} />
      <BookingSection title="Upcoming" bookings={upcoming} />
      <BookingSection title="Past" bookings={past} />
    </LayoutList>
  );
}

/* ── My Care tab — owner-side PAID care (shelter activity excluded) ── */

function MyCareContent() {
  const { bookings } = useBookings();
  const CURRENT_USER = useCurrentUserId();
  const list = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && !isShelterActivity(b)
  );
  return (
    <BookingPipeline
      bookings={list}
      empty={
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
      }
    />
  );
}

/* ── My Services tab — carer-side PAID services (shelter activity excluded) ── */

function MyServicesContent() {
  const { bookings } = useBookings();
  const CURRENT_USER = useCurrentUserId();
  const list = bookings.filter(
    (b) => b.carerId === CURRENT_USER && !isShelterActivity(b)
  );
  return (
    <BookingPipeline
      bookings={list}
      empty={
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
      }
    />
  );
}

/* ── Volunteering tab — shelter-dog activity on either side ──
   Mentor sessions (you're the owner/mentee) + solo shelter walks (you're
   the carer/walker) both land here, so the whole shelter-walking arc —
   book a mentor, graduate, walk solo — reads in one place rather than
   split across the two paid tabs. 2026-06-12. */

function MyVolunteeringContent() {
  const { bookings } = useBookings();
  const CURRENT_USER = useCurrentUserId();
  const list = bookings.filter(
    (b) =>
      (b.ownerId === CURRENT_USER || b.carerId === CURRENT_USER) &&
      isShelterActivity(b)
  );
  return (
    <BookingPipeline
      bookings={list}
      empty={
        <EmptyState
          icon={<HandHeart size={48} weight="light" />}
          title="No volunteer walks yet."
          subtitle="Walk a shelter dog and your sessions show up here."
          action={
            <ButtonAction variant="primary" size="sm" href="/discover/help-a-dog">
              Help a Dog
            </ButtonAction>
          }
        />
      }
    />
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

  // Decide page mode from which CATEGORIES actually have content. Most
  // users live in one role (Daniel = care only, Klára = services only);
  // forcing them through empty tabs creates switch-friction every visit.
  // Tabs appear only when ≥2 categories are populated (Tomáš: care +
  // volunteering, or all three). Generalized from the 2-side owner/carer
  // split to N categories when Volunteering landed (2026-06-12); shelter-
  // dog activity is its own category (see isShelterActivity).
  const hasCare = bookings.some(
    (b) => b.ownerId === CURRENT_USER && !isShelterActivity(b)
  );
  const hasServices = bookings.some(
    (b) => b.carerId === CURRENT_USER && !isShelterActivity(b)
  );
  const hasVolunteering = bookings.some(
    (b) =>
      (b.ownerId === CURRENT_USER || b.carerId === CURRENT_USER) &&
      isShelterActivity(b)
  );

  const present: TabKey[] = [
    hasCare ? "care" : null,
    hasServices ? "services" : null,
    hasVolunteering ? "volunteering" : null,
  ].filter((k): k is TabKey => k !== null);

  const showTabs = present.length >= 2;
  // Single-mode shows the one populated category; brand-new users fall
  // back to care (the typical owner entry path).
  const fallback: TabKey = present[0] ?? "care";
  const paramTab = searchParams.get("tab") as TabKey | null;
  const activeTab: TabKey = showTabs
    ? paramTab && present.includes(paramTab)
      ? paramTab
      : present[0]
    : fallback;

  const visibleTabs = TABS.filter((t) => present.includes(t.key as TabKey));

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
            <TabBar tabs={visibleTabs} activeKey={activeTab} onChange={handleTabChange} />
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
        {activeTab === "volunteering" && <MyVolunteeringContent />}
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

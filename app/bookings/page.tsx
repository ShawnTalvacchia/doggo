"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDots, Sparkle } from "@phosphor-icons/react";
import { useBookings } from "@/contexts/BookingsContext";
import type { Booking } from "@/lib/types";
import { mockUser } from "@/lib/mockUser";
import { BookingRow } from "@/components/ui/BookingRow";


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

// ── My Services tab ───────────────────────────────────────────────────────────

function computeEarnings(bookings: Booking[]): { total: number; sessionCount: number } {
  let total = 0;
  let sessionCount = 0;
  for (const b of bookings) {
    const completed = (b.sessions ?? []).filter((s) => s.status === "completed");
    if (b.price.billingCycle === "per_session") {
      total += completed.length * b.price.total;
      sessionCount += completed.length;
    } else if (b.status === "completed") {
      total += b.price.total;
    }
  }
  return { total, sessionCount };
}

function MyServicesTab() {
  const { bookings } = useBookings();
  const user = mockUser;
  const carer = user.carerProfile;

  // Bookings where Shawn is the carer
  const carerBookings = bookings.filter((b) => b.carerId === "shawn");
  const activeCarerBookings = carerBookings.filter((b) => b.status === "active");
  const upcomingCarerBookings = carerBookings.filter((b) => b.status === "upcoming");

  const { total: totalEarned, sessionCount } = computeEarnings(carerBookings);

  if (!carer) {
    return (
      <div className="bookings-offer-cta">
        <Sparkle size={40} weight="light" className="bookings-offer-icon" />
        <h2 className="bookings-offer-title">Earn by offering care</h2>
        <p className="bookings-offer-body">
          Set up your carer profile to start accepting bookings for walks, drop-in
          visits, or boarding.
        </p>
        <Link href="/profile?tab=offering" className="bookings-offer-btn">
          Get started
        </Link>
      </div>
    );
  }

  return (
    <div className="bookings-services-tab">
      {/* Carer profile card */}
      <Link href="/profile?tab=offering" className="bookings-carer-profile-card">
        <div className="bookings-carer-profile-info">
          <p className="bookings-carer-profile-title">Your carer profile</p>
          <p className="bookings-carer-profile-sub">
            {carer.services.length} service{carer.services.length !== 1 ? "s" : ""} ·{" "}
            {carer.publicProfile ? "Public" : "Hidden"}
          </p>
        </div>
        <ArrowRight size={16} weight="bold" className="bookings-carer-profile-arrow" />
      </Link>

      {/* Earnings summary */}
      {(totalEarned > 0 || sessionCount > 0) && (
        <div className="bookings-earnings-card">
          <div className="bookings-earnings-row">
            <div className="bookings-earnings-item">
              <span className="bookings-earnings-value">{totalEarned.toLocaleString()} Kč</span>
              <span className="bookings-earnings-label">Total earned</span>
            </div>
            <div className="bookings-earnings-divider" />
            <div className="bookings-earnings-item">
              <span className="bookings-earnings-value">{sessionCount}</span>
              <span className="bookings-earnings-label">Sessions completed</span>
            </div>
            <div className="bookings-earnings-divider" />
            <div className="bookings-earnings-item">
              <span className="bookings-earnings-value">{carerBookings.length}</span>
              <span className="bookings-earnings-label">Total clients</span>
            </div>
          </div>
        </div>
      )}

      {/* Client bookings */}
      {carerBookings.length === 0 ? (
        <div className="bookings-services-empty">
          <p className="bookings-services-empty-title">No client bookings yet</p>
          <p className="bookings-services-empty-sub">
            Share your profile with pet owners to start receiving requests.
          </p>
        </div>
      ) : (
        <>
          {activeCarerBookings.length > 0 && (
            <div className="bookings-section">
              <p className="bookings-section-heading">Active clients</p>
              {activeCarerBookings.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </div>
          )}
          {upcomingCarerBookings.length > 0 && (
            <div className="bookings-section">
              <p className="bookings-section-heading">Upcoming</p>
              {upcomingCarerBookings.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────────

type Tab = "bookings" | "services";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const { bookings } = useBookings();

  // Filter to owner's bookings only
  const ownerBookings = bookings.filter((b) => b.ownerId === "shawn");

  const active = ownerBookings.filter((b) => b.status === "active");
  const upcoming = ownerBookings.filter((b) => b.status === "upcoming");
  const past = ownerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const isEmpty = ownerBookings.length === 0;

  return (
    <main className="bookings-page">
      {/* Header */}
      <div className="bookings-header">
        <h1 className="bookings-heading">Bookings</h1>
      </div>

      {/* Tabs */}
      <div className="bookings-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "bookings"}
          className={`bookings-tab${activeTab === "bookings" ? " active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "services"}
          className={`bookings-tab${activeTab === "services" ? " active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          My Services
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "bookings" ? (
        isEmpty ? (
          <div className="bookings-empty">
            <CalendarDots size={40} weight="light" className="bookings-empty-icon" />
            <p className="bookings-empty-text">No bookings yet</p>
            <p className="bookings-empty-sub">
              Find a carer on Explore to get started.
            </p>
          </div>
        ) : (
          <>
            <BookingSection title="Active" bookings={active} />
            <BookingSection title="Upcoming" bookings={upcoming} />
            <BookingSection title="Past" bookings={past} />
          </>
        )
      ) : (
        <MyServicesTab />
      )}
    </main>
  );
}

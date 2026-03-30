"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDots,
  PawPrint,
  Plus,
  Briefcase,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CardMyMeet, type MeetRole } from "./CardMyMeet";
import { getUserMeets } from "@/lib/mockMeets";
import { useBookings } from "@/contexts/BookingsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Meet, Booking } from "@/lib/types";

/* ── Constants ─────────────────────────────────────────────────── */

const TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Walks", value: "walk" },
  { label: "Park Hangouts", value: "park_hangout" },
  { label: "Playdates", value: "playdate" },
  { label: "Training", value: "training" },
];

const CURRENT_USER = "shawn";

/* ── Helpers ────────────────────────────────────────────────────── */

function getMeetRole(meet: Meet, userId: string): MeetRole {
  if (meet.creatorId === userId) return "hosting";
  const attendee = meet.attendees.find((a) => a.userId === userId);
  if (attendee?.rsvpStatus === "interested") return "interested";
  return "joining";
}

/** Next upcoming session date for a booking, or its startDate */
function getBookingNextDate(booking: Booking): string | null {
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

/* ── Unified timeline item type ─────────────────────────────────── */

type ScheduleItem =
  | { kind: "meet"; meet: Meet; role: MeetRole; sortKey: string }
  | { kind: "booking"; booking: Booking; perspective: "owner" | "carer"; sortKey: string };

/* ── Compact booking block ──────────────────────────────────────── */

function BookingBlock({
  booking,
  perspective,
}: {
  booking: Booking;
  perspective: "owner" | "carer";
}) {
  const other =
    perspective === "owner"
      ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
      : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };

  const nextDate = getBookingNextDate(booking);
  const nextDateLabel = nextDate ? formatDate(nextDate) : null;

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="card-booking-block"
      style={{ textDecoration: "none" }}
    >
      <div className="card-booking-block-icon">
        <Briefcase size={16} weight="light" />
      </div>
      <img
        src={other.avatarUrl}
        alt={other.name}
        className="rounded-full shrink-0 object-cover"
        style={{ width: 32, height: 32 }}
      />
      <div className="flex flex-col flex-1 gap-xs min-w-0">
        <span className="text-sm font-semibold text-fg-primary">
          {SERVICE_LABELS[booking.serviceType]}{" "}
          <span className="font-normal text-fg-secondary">with {other.name}</span>
        </span>
        {(nextDateLabel || booking.pets.length > 0) && (
          <span className="text-xs text-fg-tertiary truncate">
            {nextDateLabel && (
              <>
                {nextDateLabel}
                {booking.recurringSchedule && ` · ${booking.recurringSchedule.timeLabel}`}
              </>
            )}
            {booking.pets.length > 0 && ` · ${booking.pets.join(", ")}`}
          </span>
        )}
      </div>
      <StatusBadge status={booking.status} />
    </Link>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export function MyScheduleTab() {
  const [view, setView] = useState<"upcoming" | "history">("upcoming");
  const [typeFilter, setTypeFilter] = useState("all");

  const myMeets = getUserMeets(CURRENT_USER);
  const { bookings } = useBookings();

  /* Meets split by status */
  const upcomingMeets = myMeets.filter((m) => m.status === "upcoming");
  const historyMeets = myMeets.filter(
    (m) => m.status === "completed" || m.status === "cancelled"
  );

  /* Bookings split by status */
  const activeOwnerBookings = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );
  const activeCarerBookings = bookings.filter(
    (b) => b.carerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );
  const pastOwnerBookings = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && (b.status === "completed" || b.status === "cancelled")
  );
  const pastCarerBookings = bookings.filter(
    (b) => b.carerId === CURRENT_USER && (b.status === "completed" || b.status === "cancelled")
  );

  /* Unified upcoming timeline — meets + active bookings, sorted chronologically */
  const upcomingItems = useMemo((): ScheduleItem[] => {
    const meetItems: ScheduleItem[] = upcomingMeets
      .filter((m) => typeFilter === "all" || m.type === typeFilter)
      .map((m) => ({
        kind: "meet",
        meet: m,
        role: getMeetRole(m, CURRENT_USER),
        sortKey: `${m.date}T${m.time}`,
      }));

    const bookingItems: ScheduleItem[] = [
      ...activeOwnerBookings.flatMap((b) => {
        const d = getBookingNextDate(b);
        return d ? [{ kind: "booking" as const, booking: b, perspective: "owner" as const, sortKey: d }] : [];
      }),
      ...activeCarerBookings.flatMap((b) => {
        const d = getBookingNextDate(b);
        return d ? [{ kind: "booking" as const, booking: b, perspective: "carer" as const, sortKey: d }] : [];
      }),
    ];

    return [...meetItems, ...bookingItems].sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey)
    );
  }, [upcomingMeets, activeOwnerBookings, activeCarerBookings, typeFilter]);

  /* Unified history timeline — most recent first */
  const historyItems = useMemo((): ScheduleItem[] => {
    const meetItems: ScheduleItem[] = historyMeets
      .filter((m) => typeFilter === "all" || m.type === typeFilter)
      .map((m) => ({
        kind: "meet",
        meet: m,
        role: getMeetRole(m, CURRENT_USER),
        sortKey: `${m.date}T${m.time}`,
      }));

    const bookingItems: ScheduleItem[] = [
      ...pastOwnerBookings.map((b) => ({
        kind: "booking" as const,
        booking: b,
        perspective: "owner" as const,
        sortKey: b.startDate,
      })),
      ...pastCarerBookings.map((b) => ({
        kind: "booking" as const,
        booking: b,
        perspective: "carer" as const,
        sortKey: b.startDate,
      })),
    ];

    return [...meetItems, ...bookingItems].sort((a, b) =>
      b.sortKey.localeCompare(a.sortKey) // descending — most recent first
    );
  }, [historyMeets, pastOwnerBookings, pastCarerBookings, typeFilter]);

  const activeItems = view === "upcoming" ? upcomingItems : historyItems;

  return (
    <div className="flex flex-col gap-xl">

      {/* Controls row: toggle + create button */}
      <div className="flex items-center gap-md flex-wrap">
        <div className="schedule-toggle">
          <button
            type="button"
            className={`schedule-toggle-btn${view === "upcoming" ? " schedule-toggle-btn--active" : ""}`}
            onClick={() => setView("upcoming")}
          >
            Upcoming
          </button>
          <button
            type="button"
            className={`schedule-toggle-btn${view === "history" ? " schedule-toggle-btn--active" : ""}`}
            onClick={() => setView("history")}
          >
            History
          </button>
        </div>
        <div className="flex-1" />
        <ButtonAction
          variant="primary"
          size="sm"
          cta
          href="/meets/create"
          leftIcon={<Plus size={16} weight="bold" />}
        >
          Create
        </ButtonAction>
      </div>

      {/* Type filter pills */}
      <div className="activity-filters">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`pill${typeFilter === f.value ? " active" : ""}`}
            onClick={() => setTypeFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {activeItems.length > 0 ? (
        <div className="flex flex-col gap-md">
          {activeItems.map((item) => {
            if (item.kind === "meet") {
              return (
                <CardMyMeet
                  key={item.meet.id}
                  meet={item.meet}
                  role={item.role}
                  variant={view === "history" ? "history" : "upcoming"}
                />
              );
            }
            return (
              <BookingBlock
                key={item.booking.id}
                booking={item.booking}
                perspective={item.perspective}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={
            view === "upcoming" ? (
              <CalendarDots size={48} weight="light" />
            ) : (
              <PawPrint size={48} weight="light" />
            )
          }
          title={
            view === "upcoming"
              ? "Nothing coming up yet."
              : "No past activity yet."
          }
          subtitle={
            view === "upcoming"
              ? "Create a meet or find one to join."
              : undefined
          }
          action={
            view === "upcoming" ? (
              <ButtonAction variant="secondary" size="sm" href="/meets/create">
                Create a Meet
              </ButtonAction>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

"use client";

import { CalendarDots, PawPrint, Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { MeetCard } from "@/components/meets/MeetCard";
import { BookingListCard } from "@/components/bookings/BookingListCard";
import { getUserMeets } from "@/lib/mockMeets";
import { useBookings } from "@/contexts/BookingsContext";

export function MyScheduleTab() {
  const myMeets = getUserMeets("shawn");
  const { bookings } = useBookings();
  const upcoming = myMeets
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const past = myMeets.filter((m) => m.status === "completed");

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

  const pastOwnerBookings = bookings
    .filter((b) => b.ownerId === "shawn")
    .filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center justify-end">
        <ButtonAction
          variant="primary"
          size="sm"
          cta
          href="/meets/create"
          leftIcon={<Plus size={16} weight="bold" />}
        >
          Create Meet
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

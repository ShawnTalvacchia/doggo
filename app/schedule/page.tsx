"use client";

import { CalendarDots, PawPrint, MagnifyingGlass, Sparkle, Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { MeetCard } from "@/components/meets/MeetCard";
import { getUserMeets } from "@/lib/mockMeets";

export default function SchedulePage() {
  const myMeets = getUserMeets("shawn");
  const upcoming = myMeets.filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const past = myMeets.filter((m) => m.status === "completed");

  // Split upcoming into "this week" (next 7 days) and "coming up" (after)
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

  return (
    <div className="flex flex-col gap-xl p-xl" style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}>
      <header className="flex items-center justify-between pt-md">
        <h1 className="font-heading text-4xl font-semibold text-fg-primary">Schedule</h1>
      </header>

      {/* CTA row */}
      <div className="flex gap-sm flex-wrap">
        <ButtonAction
          variant="primary"
          size="sm"
          cta
          href="/meets/create"
          leftIcon={<Plus size={16} weight="bold" />}
        >
          Create Meet
        </ButtonAction>
        <ButtonAction
          variant="outline"
          size="sm"
          cta
          href="/explore/results"
          leftIcon={<MagnifyingGlass size={16} weight="light" />}
        >
          Find Care
        </ButtonAction>
        <ButtonAction
          variant="outline"
          size="sm"
          cta
          href="/signup/start"
          leftIcon={<Sparkle size={16} weight="light" />}
        >
          Offer Care
        </ButtonAction>
      </div>

      {/* This week */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-xl font-semibold text-fg-primary">This Week</h2>
        {thisWeek.length > 0 ? (
          <div className="flex flex-col gap-md">
            {thisWeek.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-md rounded-panel bg-surface-top p-xl shadow-sm">
            <CalendarDots size={48} weight="light" className="text-fg-tertiary" />
            <p className="text-sm text-fg-secondary text-center">
              Nothing scheduled this week.
            </p>
          </div>
        )}
      </section>

      {/* Coming up */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-xl font-semibold text-fg-primary">Coming Up</h2>
        {comingUp.length > 0 ? (
          <div className="flex flex-col gap-md">
            {comingUp.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-md rounded-panel bg-surface-top p-xl shadow-sm">
            <p className="text-sm text-fg-secondary text-center">
              No meets or bookings scheduled beyond this week.
            </p>
          </div>
        )}
      </section>

      {/* Past */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-xl font-semibold text-fg-primary">Past</h2>
        {past.length > 0 ? (
          <div className="flex flex-col gap-md">
            {past.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-md rounded-panel bg-surface-top p-xl shadow-sm">
            <PawPrint size={48} weight="light" className="text-fg-tertiary" />
            <p className="text-sm text-fg-secondary text-center">
              Completed meets and bookings will show here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

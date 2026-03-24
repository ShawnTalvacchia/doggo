"use client";

import { CalendarDots, MapPin, Users, PawPrint } from "@phosphor-icons/react";
import type { Meet } from "@/lib/types";

function totalDogs(meet: Meet): number {
  return meet.attendees.reduce((sum, a) => sum + a.dogNames.length, 0);
}

export function MeetRecapHeader({ meet }: { meet: Meet }) {
  const d = new Date(`${meet.date}T${meet.time}`);
  const dateStr = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="flex flex-col gap-md rounded-panel bg-surface-top p-lg shadow-sm">
      <div className="flex items-center gap-sm">
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 40, height: 40, background: "var(--brand-subtle)" }}
        >
          <PawPrint size={20} weight="light" style={{ color: "var(--brand-main)" }} />
        </div>
        <div className="flex flex-col gap-xs">
          <h2 className="font-heading text-lg font-semibold text-fg-primary m-0">
            {meet.title}
          </h2>
          <span className="text-sm text-fg-secondary">{dateStr}</span>
        </div>
      </div>
      <div className="flex items-center gap-lg text-sm text-fg-secondary">
        <span className="flex items-center gap-xs">
          <Users size={16} weight="light" />
          {meet.attendees.length} people
        </span>
        <span className="flex items-center gap-xs">
          <PawPrint size={16} weight="light" />
          {totalDogs(meet)} dogs
        </span>
        <span className="flex items-center gap-xs">
          <CalendarDots size={16} weight="light" />
          {meet.durationMinutes} min
        </span>
      </div>
      {meet.neighbourhood && (
        <span className="flex items-center gap-xs text-xs text-fg-tertiary">
          <MapPin size={12} weight="light" />
          {meet.location}
        </span>
      )}
    </div>
  );
}

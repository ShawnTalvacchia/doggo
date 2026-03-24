"use client";

import Link from "next/link";
import { CalendarDots, MapPin } from "@phosphor-icons/react";
import type { Meet } from "@/lib/types";

function formatShortDate(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  return `${weekday} ${time}`;
}

export function UpcomingStrip({ meets }: { meets: Meet[] }) {
  if (meets.length === 0) return null;

  return (
    <div className="flex flex-col gap-sm">
      <span className="text-xs font-medium text-fg-tertiary" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Your upcoming
      </span>
      <div
        className="flex gap-sm"
        style={{ overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 4 }}
      >
        {meets.map((meet) => (
          <Link
            key={meet.id}
            href={`/meets/${meet.id}`}
            className="flex flex-col gap-sm rounded-panel p-md shrink-0"
            style={{
              width: 200,
              background: "var(--surface-top)",
              border: "1px solid var(--border-light)",
              textDecoration: "none",
              scrollSnapAlign: "start",
            }}
          >
            <span className="text-sm font-semibold text-fg-primary" style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {meet.title}
            </span>
            <span className="flex items-center gap-xs text-sm text-fg-tertiary">
              <CalendarDots size={12} weight="light" />
              {formatShortDate(meet.date, meet.time)}
            </span>
            <span className="flex items-center gap-xs text-sm text-fg-tertiary">
              <MapPin size={12} weight="light" />
              {meet.neighbourhood || meet.location}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { CalendarDots, MapPin, UsersThree } from "@phosphor-icons/react";
import type { Meet } from "@/lib/types";

function formatShortDate(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  return `${weekday} ${time}`;
}

export function UpcomingStrip({ meets }: { meets: Meet[] }) {
  if (meets.length === 0) return null;

  return (
    <div
      className="flex flex-col gap-lg"
      style={{
        background: "var(--surface-inset)",
        padding: "var(--padding-small)",
        borderTop: "1px solid var(--border-strong)",
        borderBottom: "1px solid var(--border-strong)",
      }}
    >
      <span
        className="text-sm text-fg-tertiary font-normal"
        style={{ textTransform: "uppercase", letterSpacing: "0.6px" }}
      >
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
            className="flex flex-col gap-sm rounded-sm shrink-0"
            style={{
              minWidth: 280,
              padding: "var(--space-md)",
              background: "var(--surface-top)",
              textDecoration: "none",
              scrollSnapAlign: "start",
            }}
          >
            <span className="text-base font-semibold text-fg-primary" style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {meet.title}
            </span>
            <div className="flex gap-sm">
              <span className="flex items-center gap-xs text-base text-fg-tertiary flex-1">
                <CalendarDots size={16} weight="light" />
                {formatShortDate(meet.date, meet.time)}
              </span>
              <span className="flex items-center gap-xs text-base text-fg-tertiary flex-1">
                <MapPin size={16} weight="light" />
                {meet.neighbourhood || meet.location}
              </span>
            </div>
            {/* Group label */}
            <span
              className="flex items-center gap-xs text-base font-semibold"
              style={{ color: "var(--status-info-600, #4e63b8)" }}
            >
              <UsersThree size={16} weight="light" />
              {meet.groupName || "Vinohrady Morning Crew"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

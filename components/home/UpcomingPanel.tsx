"use client";

import Link from "next/link";
import { CalendarDots, MapPin, UsersThree } from "@phosphor-icons/react";
import { getGroupById } from "@/lib/mockGroups";
import type { Meet } from "@/lib/types";
import { formatCompactDateTime } from "@/lib/dateUtils";

function CardUpcomingEvent({ meet }: { meet: Meet }) {
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  return (
    <Link
      href={`/meets/${meet.id}`}
      className="flex flex-col gap-sm bg-surface-top rounded-sm p-md"
      style={{ textDecoration: "none" }}
    >
      <span className="text-base font-semibold text-fg-primary leading-normal" style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {meet.title}
      </span>
      <div className="flex gap-sm w-full">
        <span className="flex items-center gap-xs text-base text-fg-tertiary flex-1">
          <CalendarDots size={16} weight="light" />
          {formatCompactDateTime(meet.date, meet.time)}
        </span>
        <span className="flex items-center gap-xs text-base text-fg-tertiary flex-1">
          <MapPin size={16} weight="light" />
          {meet.neighbourhood || meet.location}
        </span>
      </div>
      {/* Group label — info color */}
      <span className="flex items-center gap-xs text-base font-semibold" style={{ color: "var(--status-info-600, #4e63b8)" }}>
        <UsersThree size={16} weight="light" />
        {group?.name || "Community"}
      </span>
    </Link>
  );
}

export function UpcomingPanel({ meets }: { meets: Meet[] }) {
  if (meets.length === 0) return null;

  return (
    <div className="page-side-panel">
      {/* Spacer to align panel with feed content below header */}
      <div style={{ height: 64 }} />
      <div
        className="flex flex-col gap-lg p-lg rounded-panel"
        style={{
          background: "var(--surface-inset)",
          border: "1px solid var(--border-strong)",
        }}
      >
        <span
          className="text-sm text-fg-tertiary font-normal"
          style={{ textTransform: "uppercase", letterSpacing: "0.6px" }}
        >
          Your upcoming
        </span>
        <div className="flex flex-col gap-lg">
          {meets.map((meet) => (
            <CardUpcomingEvent key={meet.id} meet={meet} />
          ))}
        </div>
      </div>
    </div>
  );
}

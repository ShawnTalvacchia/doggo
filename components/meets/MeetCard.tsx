"use client";

import Link from "next/link";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  MapPin,
  CalendarDots,
  Users,
  Lightning,
  UsersThree,
} from "@phosphor-icons/react";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS, getMeetTypeSummary, ENERGY_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={20} weight="light" />,
  park_hangout: <Tree size={20} weight="light" />,
  playdate: <PawPrint size={20} weight="light" />,
  training: <Target size={20} weight="light" />,
};

function formatMeetDate(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return `${weekday} ${day} ${month}, ${time}`;
}

function totalDogs(meet: Meet): number {
  return meet.attendees.reduce((sum, a) => sum + a.dogNames.length, 0);
}

export function MeetCard({ meet }: { meet: Meet }) {
  return (
    <Link
      href={`/meets/${meet.id}`}
      className="flex flex-col gap-sm rounded-panel bg-surface-top p-md shadow-sm"
      style={{ textDecoration: "none" }}
    >
      {/* Type badge + recurring */}
      <div className="flex items-center gap-xs">
        <span
          className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
          style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)" }}
        >
          {MEET_ICONS[meet.type]}
          {MEET_TYPE_LABELS[meet.type]}
        </span>
        {meet.isPopular && (
          <span
            className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
            style={{ background: "var(--success-subtle)", color: "var(--success-strong)" }}
          >
            Popular
          </span>
        )}
        {meet.recurring && (
          <span className="text-xs text-fg-tertiary">Weekly</span>
        )}
      </div>

      {/* Group badge */}
      {meet.groupId && (() => {
        const group = getGroupById(meet.groupId);
        return group ? (
          <span className="flex items-center gap-xs text-xs text-fg-tertiary">
            <UsersThree size={12} weight="light" />
            {group.name}
          </span>
        ) : null;
      })()}

      {/* Title */}
      <h3 className="font-heading text-md font-semibold text-fg-primary" style={{ margin: 0 }}>
        {meet.title}
      </h3>

      {/* Meta row */}
      <div className="flex flex-col gap-xs text-sm text-fg-secondary">
        <span className="flex items-center gap-xs">
          <CalendarDots size={16} weight="light" />
          {formatMeetDate(meet.date, meet.time)}
        </span>
        <span className="flex items-center gap-xs">
          <MapPin size={16} weight="light" />
          {meet.location}
        </span>
        <span className="flex items-center gap-xs">
          <Users size={16} weight="light" />
          {meet.attendees.length} {meet.attendees.length === 1 ? "person" : "people"} · {totalDogs(meet)} {totalDogs(meet) === 1 ? "dog" : "dogs"}
        </span>
      </div>

      {/* Type-specific summary */}
      {(() => {
        const summary = getMeetTypeSummary(meet);
        return summary ? (
          <div className="flex flex-wrap items-center gap-xs">
            <span
              className="text-xs font-medium rounded-pill px-sm py-xs"
              style={{ background: "var(--surface-gray)", color: "var(--text-secondary)" }}
            >
              {summary}
            </span>
            {meet.energyLevel && meet.energyLevel !== "any" && (
              <span
                className="text-xs font-medium rounded-pill px-sm py-xs"
                style={{
                  background: meet.energyLevel === "calm" ? "var(--success-subtle)" : meet.energyLevel === "high" ? "var(--warning-subtle)" : "var(--surface-gray)",
                  color: meet.energyLevel === "calm" ? "var(--success-strong)" : meet.energyLevel === "high" ? "var(--warning-strong)" : "var(--text-secondary)",
                }}
              >
                {ENERGY_LABELS[meet.energyLevel]}
              </span>
            )}
          </div>
        ) : null;
      })()}

      {/* Attendee avatars */}
      <div className="flex items-center">
        {meet.attendees.slice(0, 5).map((a, i) => (
          <img
            key={a.userId}
            src={a.avatarUrl}
            alt={a.userName}
            className="rounded-full border-2"
            style={{
              width: 28,
              height: 28,
              objectFit: "cover",
              borderColor: "var(--surface-top)",
              marginLeft: i > 0 ? -8 : 0,
            }}
          />
        ))}
        {meet.attendees.length > 5 && (
          <span
            className="flex items-center justify-center rounded-full text-xs font-medium"
            style={{
              width: 28,
              height: 28,
              marginLeft: -8,
              background: "var(--surface-gray)",
              color: "var(--text-secondary)",
            }}
          >
            +{meet.attendees.length - 5}
          </span>
        )}
        {meet.maxAttendees - meet.attendees.length > 0 && (
          <span className="ml-sm text-xs text-fg-tertiary">
            {meet.maxAttendees - meet.attendees.length} spots left
          </span>
        )}
      </div>

      {/* Activity indicator */}
      {meet.recentJoinText && (
        <div className="flex items-center gap-xs text-xs text-fg-tertiary">
          <Lightning size={12} weight="fill" className="text-brand-main" />
          {meet.recentJoinText}
        </div>
      )}
    </Link>
  );
}

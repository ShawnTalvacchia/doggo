"use client";

import Link from "next/link";
import {
  CalendarDots,
  MapPin,
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  UsersThree,
  ArrowsClockwise,
  Clock,
} from "@phosphor-icons/react";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";
import { formatMeetDateTime } from "@/lib/dateUtils";
import { AttendeeAvatarStack } from "@/components/meets/AttendeeAvatarStack";
import { getDisplayDate, isRecurring, recurrenceLabel } from "@/lib/meetUtils";

/**
 * FeedUpcomingMeet — the "a meet is happening soon" card that shows in the
 * community feed. Mirrors the shared meet-card anatomy (see
 * `docs/features/meets.md` → Meet-card anatomy): type pill → title → date row
 * → location → group context → avatar stack. The contextual reminder is
 * carried by a small "Coming up" badge in the top row, right of the type pill
 * — no separate banner, no group-avatar header.
 */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

export function FeedUpcomingMeet({ meet }: { meet: Meet }) {
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const goingAttendees = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  );

  return (
    <Link
      href={`/meets/${meet.id}`}
      className="card-schedule-meet"
      style={{ textDecoration: "none" }}
    >
      {/* Type pill + "Coming up" context badge — identity first, then the
          reason this card is surfaced in the feed. */}
      <div className="flex flex-wrap items-center gap-xs">
        <span className="card-schedule-chip card-schedule-chip--primary">
          {MEET_ICONS[meet.type]}
          {MEET_TYPE_LABELS[meet.type]}
        </span>
        <span className="flex items-center gap-xs text-xs font-semibold text-brand-main">
          <Clock size={14} weight="fill" />
          Coming up
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-heading"
        style={{
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "24px",
          margin: 0,
          color: "var(--text-primary)",
        }}
      >
        {meet.title}
      </h3>

      <div className="flex flex-col gap-xs">
        {/* Date row — recurring meets show next upcoming occurrence ("Next: ..."). */}
        <div className="flex items-center gap-xs text-sm text-fg-secondary flex-wrap">
          <CalendarDots size={16} weight="light" className="shrink-0" />
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {isRecurring(meet) ? "Next: " : ""}
            {formatMeetDateTime(getDisplayDate(meet), meet.time)}
          </span>
          {recurrenceLabel(meet) && (
            <>
              <span style={{ padding: "0 4px", color: "var(--text-tertiary)" }}>·</span>
              <ArrowsClockwise size={14} weight="light" className="text-fg-tertiary shrink-0" />
              <span className="text-fg-tertiary">{recurrenceLabel(meet)}</span>
            </>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <MapPin size={16} weight="light" className="shrink-0" />
          {meet.location}
        </div>

        {/* Group context */}
        {group && (
          <div className="flex items-center gap-xs text-sm">
            <UsersThree
              size={16}
              weight="light"
              className="shrink-0"
              style={{ color: "var(--status-info-600, #4e63b8)" }}
            />
            <span
              className="font-semibold"
              style={{ color: "var(--status-info-600, #4e63b8)" }}
            >
              {group.name}
            </span>
          </div>
        )}
      </div>

      {/* Dog-forward avatar stack */}
      <div className="flex items-center gap-sm flex-wrap">
        <AttendeeAvatarStack attendees={goingAttendees} maxAvatars={5} />
      </div>
    </Link>
  );
}

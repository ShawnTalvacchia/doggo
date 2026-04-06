"use client";

import Link from "next/link";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  MapPin,
  CalendarDots,
  UsersThree,
  ArrowsClockwise,
  Lightning,
  Flag,
  Check,
  Star,
} from "@phosphor-icons/react";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";

/* ── Constants ─────────────────────────────────────────────────── */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={16} weight="light" />,
  park_hangout: <Tree size={16} weight="light" />,
  playdate: <PawPrint size={16} weight="light" />,
  training: <Target size={16} weight="light" />,
};

/* ── Helpers ────────────────────────────────────────────────────── */

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


/* ── Types ──────────────────────────────────────────────────────── */

export type MeetRole = "hosting" | "joining" | "interested";

interface CardMeetProps {
  meet: Meet;
  /** Controls content emphasis. "discover" = browsing; "schedule" = committed; "group" = inside a group page. */
  variant: "discover" | "schedule" | "group";
  /** User's relationship to this meet (schedule variant primarily). */
  role?: MeetRole;
  /** Renders muted for past meets. */
  isHistory?: boolean;
}

/* ── Status chip config ────────────────────────────────────────── */

const STATUS_LABELS: Record<MeetRole, string> = {
  hosting: "Hosting",
  joining: "Joining",
  interested: "Interested",
};

const HISTORY_LABELS: Record<MeetRole, string> = {
  hosting: "Hosted",
  joining: "Attended",
  interested: "Interested",
};

const STATUS_ICONS: Record<MeetRole, React.ReactNode> = {
  hosting: <Flag size={13} weight="fill" />,
  joining: <Check size={13} weight="bold" />,
  interested: <Star size={13} weight="light" />,
};

/* ── Component ──────────────────────────────────────────────────── */

export function CardMeet({ meet, variant, role, isHistory = false }: CardMeetProps) {
  const goingAttendees = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  );
  const goingCount = goingAttendees.length;
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const isCancelled = meet.status === "cancelled";
  const maxAvatars = 5;

  return (
    <Link
      href={`/meets/${meet.id}`}
      className={[
        "card-schedule-meet",
        isHistory ? "card-my-meet--history" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Type pill + role status (attribute chips moved to detail pane) */}
      <div className="flex flex-wrap items-center gap-xs">
        <span className="card-schedule-chip card-schedule-chip--primary">
          {MEET_ICONS[meet.type]}
          {MEET_TYPE_LABELS[meet.type]}
        </span>

        {isCancelled && (
          <span
            className="card-schedule-chip"
            style={{ color: "var(--error-strong)", background: "var(--error-subtle)", borderColor: "var(--error-subtle)" }}
          >
            Cancelled
          </span>
        )}

        {role && (
          <>
            <span className="flex-1" />
            <span
              className="card-schedule-chip"
              style={
                role === "hosting" && !isHistory
                  ? {
                      background: "var(--brand-main)",
                      borderColor: "var(--brand-main)",
                      color: "white",
                    }
                  : {
                      background: "var(--surface-subtle)",
                      borderColor: "var(--surface-subtle)",
                      color: "var(--brand-main)",
                      opacity: isHistory ? 0.65 : 1,
                    }
              }
            >
              {STATUS_ICONS[role]}
              {isHistory ? HISTORY_LABELS[role] : STATUS_LABELS[role]}
            </span>
          </>
        )}
      </div>

      {/* Row 2: Title */}
      <h3
        className="font-heading"
        style={{
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "24px",
          margin: 0,
          color: isHistory ? "var(--text-tertiary)" : "var(--text-primary)",
          textDecoration: isCancelled ? "line-through" : "none",
        }}
      >
        {meet.title}
      </h3>

      {!isCancelled && (
        <div className="flex flex-col gap-xs">
          {/* Row 3: Date/time + recurring */}
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <CalendarDots size={16} weight="light" className="shrink-0" />
            <span style={{ fontWeight: 600, color: isHistory ? undefined : "var(--text-primary)" }}>
              {formatMeetDate(meet.date, meet.time)}
            </span>
            {meet.recurring && (
              <>
                <span style={{ padding: "0 4px", color: "var(--text-tertiary)" }}>·</span>
                <ArrowsClockwise size={14} weight="light" className="text-fg-tertiary shrink-0" />
                <span className="text-fg-tertiary">Weekly</span>
              </>
            )}
          </div>

          {/* Row 4: Location */}
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <MapPin size={16} weight="light" className="shrink-0" />
            {meet.location}
          </div>

          {/* Row 5: Group context + going/max */}
          {group && variant !== "group" && (
            <div className="flex items-center gap-xs text-sm">
              <UsersThree size={16} weight="light" className="shrink-0" style={{ color: "var(--status-info-600, #4e63b8)" }} />
              <span className="font-semibold" style={{ color: "var(--status-info-600, #4e63b8)" }}>
                {group.name}
              </span>
              <span style={{ color: "var(--text-tertiary)" }}>·</span>
              <span className="text-fg-tertiary">
                {goingCount}/{meet.maxAttendees} going
              </span>
            </div>
          )}

          {/* If no group, show going count on its own */}
          {(!group || variant === "group") && (
            <div className="flex items-center gap-xs text-sm text-fg-tertiary">
              <UsersThree size={16} weight="light" className="shrink-0" />
              {goingCount}/{meet.maxAttendees} going · {totalDogs(meet)} {totalDogs(meet) === 1 ? "dog" : "dogs"}
            </div>
          )}
        </div>
      )}

      {/* Row 6: Avatars + activity signal (combined) */}
      {!isCancelled && (
        <div className="flex items-center gap-sm">
          <div className="flex items-center shrink-0">
            {goingAttendees.slice(0, maxAvatars).map((a, i) =>
              a.avatarUrl ? (
                <img
                  key={a.userId}
                  src={a.avatarUrl}
                  alt={a.userName}
                  className="rounded-full border-2 border-surface-top"
                  style={{
                    width: 28,
                    height: 28,
                    objectFit: "cover",
                    marginLeft: i > 0 ? -8 : 0,
                    opacity: isHistory ? 0.6 : 1,
                  }}
                />
              ) : (
                <span key={a.userId} style={{ marginLeft: i > 0 ? -8 : 0 }}>
                  <DefaultAvatar
                    name={a.userName}
                    size={28}
                    className="border-2 border-surface-top"
                  />
                </span>
              )
            )}
            {goingAttendees.length > maxAvatars && (
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
                +{goingAttendees.length - maxAvatars}
              </span>
            )}
          </div>

          {/* Activity signal — inline next to avatars */}
          {meet.recentJoinText && !isHistory && (
            <div className="flex items-center gap-xs text-xs text-fg-tertiary">
              <Lightning size={12} weight="fill" className="text-brand-main" />
              {meet.recentJoinText}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}

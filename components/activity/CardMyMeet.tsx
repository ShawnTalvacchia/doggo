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
  UsersThree,
  ShareNetwork,
  ArrowsClockwise,
  Flag,
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

const LEASH_LABELS: Record<string, string> = {
  on_leash: "On Leash",
  off_leash: "Off Leash",
  mixed: "Mixed",
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

function getTypeChips(meet: Meet): string[] {
  const chips: string[] = [];
  if (meet.leashRule) chips.push(LEASH_LABELS[meet.leashRule] || meet.leashRule);
  if (meet.energyLevel && meet.energyLevel !== "any") {
    chips.push(meet.energyLevel.charAt(0).toUpperCase() + meet.energyLevel.slice(1));
  }
  return chips;
}

/* ── Types ──────────────────────────────────────────────────────── */

export type MeetRole = "hosting" | "joining" | "interested";

interface CardMyMeetProps {
  meet: Meet;
  /** User's relationship to this meet */
  role: MeetRole;
  /** "history" renders muted; default is "upcoming" */
  variant?: "upcoming" | "history";
}

/* ── Role badge ─────────────────────────────────────────────────── */

function RoleBadge({ role }: { role: MeetRole }) {
  if (role === "hosting") {
    return (
      <span className="card-my-meet-badge card-my-meet-badge--hosting">
        <Flag size={13} weight="fill" />
        Hosting
      </span>
    );
  }
  if (role === "interested") {
    return (
      <span className="card-my-meet-badge card-my-meet-badge--interested">
        Interested
      </span>
    );
  }
  return (
    <span className="card-my-meet-badge card-my-meet-badge--joining">
      Joining
    </span>
  );
}

/* ── Component ──────────────────────────────────────────────────── */

export function CardMyMeet({ meet, role, variant = "upcoming" }: CardMyMeetProps) {
  const goingAttendees = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  );
  const goingCount = goingAttendees.length;
  const newRsvpCount =
    role === "hosting" && variant === "upcoming"
      ? Math.max(0, goingAttendees.filter((a) => a.userId !== "shawn").length)
      : 0;

  const typeChips = getTypeChips(meet);
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const isCancelled = meet.status === "cancelled";
  const isHistory = variant === "history";

  return (
    <Link
      href={`/meets/${meet.id}`}
      className={[
        "card-schedule-meet card-my-meet",
        role === "hosting" ? "card-my-meet--hosting" : "",
        isHistory ? "card-my-meet--history" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Type chips + share + role badge */}
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-md flex-1 min-w-0 overflow-hidden">
          <span className="card-schedule-chip card-schedule-chip--primary flex-shrink-0">
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          {typeChips.map((chip) => (
            <span key={chip} className="card-schedule-chip flex-shrink-0">
              {chip}
            </span>
          ))}
          {isCancelled && (
            <span className="card-my-meet-cancelled-chip flex-shrink-0">
              Cancelled
            </span>
          )}
        </div>
        <button
          type="button"
          className="card-schedule-icon-btn flex-shrink-0"
          onClick={(e) => e.preventDefault()}
        >
          <ShareNetwork size={16} weight="light" />
        </button>
        {/* Tone down badge in history — just a muted label */}
        {isHistory ? (
          <span className="card-my-meet-badge card-my-meet-badge--interested" style={{ opacity: 0.7 }}>
            {role === "hosting" ? "Hosted" : role === "interested" ? "Interested" : "Attended"}
          </span>
        ) : (
          <RoleBadge role={role} />
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

      {/* Row 3: Meta grid — date gets extra weight in schedule context */}
      <div className="card-schedule-meta">
        <span className="card-schedule-meta-item">
          <CalendarDots size={16} weight="light" />
          <span style={{ fontWeight: isHistory ? undefined : 600 }}>
            {formatMeetDate(meet.date, meet.time)}
          </span>
          {meet.recurring && (
            <span className="flex items-center gap-xs text-sm font-semibold text-fg-tertiary" style={{ paddingLeft: 8 }}>
              <ArrowsClockwise size={14} weight="light" />
              Weekly
            </span>
          )}
        </span>
        <span className="card-schedule-meta-item">
          <MapPin size={16} weight="light" />
          {meet.location}
        </span>
        <span className="card-schedule-meta-item">
          <Users size={16} weight="light" />
          {goingCount} going · {totalDogs(meet)} dogs
        </span>
        {group && (
          <span className="card-schedule-meta-item card-schedule-meta-item--group">
            <UsersThree size={16} weight="light" />
            {group.name}
          </span>
        )}
      </div>

      {/* Row 4: Avatars + attendee signals (skip for cancelled) */}
      {!isCancelled && (
        <div className="flex items-center gap-2xl">
          <div className="flex items-center flex-1">
            {/* Show up to 5 avatars — you care who's coming */}
            {goingAttendees.slice(0, 5).map((a, i) =>
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
            <span
              className="text-sm text-fg-tertiary"
              style={{ paddingLeft: 8 }}
            >
              {goingCount} going
            </span>
          </div>
          {/* Host signal: new RSVPs since they created it */}
          {newRsvpCount > 0 && (
            <span className="text-sm font-semibold text-brand-main flex-shrink-0">
              {newRsvpCount} {newRsvpCount === 1 ? "RSVP" : "RSVPs"}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

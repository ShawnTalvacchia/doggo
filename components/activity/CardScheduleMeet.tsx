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
  ShareNetwork,
  Star,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";

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

/** Get type-specific detail chips for the top row */
function getTypeChips(meet: Meet): string[] {
  const chips: string[] = [];
  if (meet.leashRule && meet.leashRule !== "any") {
    chips.push(LEASH_LABELS[meet.leashRule] || meet.leashRule);
  }
  if (meet.energyLevel && meet.energyLevel !== "any") {
    const label = meet.energyLevel.charAt(0).toUpperCase() + meet.energyLevel.slice(1);
    chips.push(label);
  }
  return chips;
}

interface CardScheduleMeetProps {
  meet: Meet;
  /** User's RSVP status for this meet. null = not joined */
  userStatus?: "going" | "interested" | null;
}

export function CardScheduleMeet({ meet, userStatus = null }: CardScheduleMeetProps) {
  const goingCount = meet.attendees.filter((a) => (a.rsvpStatus ?? "going") === "going").length;
  const goingAttendees = meet.attendees.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const spotsLeft = meet.maxAttendees - goingCount;
  const typeChips = getTypeChips(meet);
  const group = meet.groupId ? getGroupById(meet.groupId) : null;

  return (
    <Link
      href={`/meets/${meet.id}`}
      className="card-schedule-meet"
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Type chips + actions */}
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-md flex-1">
          {/* Primary type chip */}
          <span className="card-schedule-chip card-schedule-chip--primary">
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          {/* Detail chips */}
          {typeChips.map((chip) => (
            <span key={chip} className="card-schedule-chip">
              {chip}
            </span>
          ))}
        </div>
        {/* Action icons */}
        <button type="button" className="card-schedule-icon-btn" onClick={(e) => e.preventDefault()}>
          <ShareNetwork size={16} weight="light" />
        </button>
        <button type="button" className="card-schedule-icon-btn" onClick={(e) => e.preventDefault()}>
          <Star size={16} weight="light" />
        </button>
        {/* CTA — inline on desktop, hidden on mobile */}
        {userStatus === "going" ? (
          <span className="card-schedule-cta card-schedule-cta--joined card-schedule-cta--inline">Joining</span>
        ) : (
          <span className="card-schedule-cta card-schedule-cta--ask card-schedule-cta--inline">Ask to Join</span>
        )}
      </div>

      {/* Row 2: Title */}
      <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", margin: 0, color: "var(--text-primary)" }}>
        {meet.title}
      </h3>

      {/* Row 3: Meta grid (2-column wrap) */}
      <div className="card-schedule-meta">
        <span className="card-schedule-meta-item">
          <CalendarDots size={16} weight="light" />
          <span>{formatMeetDate(meet.date, meet.time)}</span>
          {meet.recurring && (
            <span className="flex items-center gap-xs px-lg text-sm font-semibold text-fg-tertiary">
              <ArrowsClockwise size={16} weight="light" />
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
          {goingCount} people · {totalDogs(meet)} dogs
        </span>
        {group && (
          <span className="card-schedule-meta-item card-schedule-meta-item--group">
            <UsersThree size={16} weight="light" />
            {group.name}
          </span>
        )}
      </div>

      {/* Row 4: Avatars + spots + activity */}
      <div className="flex items-center gap-2xl">
        <div className="flex items-center flex-1">
          {goingAttendees.slice(0, 3).map((a, i) => (
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
                }}
              />
            ) : (
              <span key={a.userId} style={{ marginLeft: i > 0 ? -8 : 0 }}>
                <DefaultAvatar name={a.userName} size={28} className="border-2 border-surface-top" />
              </span>
            )
          ))}
          {spotsLeft > 0 && (
            <span className="text-sm text-fg-tertiary" style={{ paddingLeft: 8 }}>
              {spotsLeft} spots left
            </span>
          )}
        </div>
        {meet.recentJoinText && (
          <div className="flex items-center gap-xs text-sm text-fg-tertiary flex-1">
            <Lightning size={12} weight="fill" className="text-brand-main" />
            {meet.recentJoinText}
          </div>
        )}
      </div>

      {/* Bottom CTA row — mobile only (hidden on desktop via CSS) */}
      <div className="card-schedule-cta-row">
        {userStatus === "going" ? (
          <span className="card-schedule-cta card-schedule-cta--joined">Joining</span>
        ) : (
          <span className="card-schedule-cta card-schedule-cta--ask">Ask to Join</span>
        )}
      </div>
    </Link>
  );
}

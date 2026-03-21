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
} from "@phosphor-icons/react";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";

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
        {meet.recurring && (
          <span className="text-xs text-fg-tertiary">Weekly</span>
        )}
      </div>

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
    </Link>
  );
}

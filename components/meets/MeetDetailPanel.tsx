"use client";

import Link from "next/link";
import {
  CalendarDots,
  PawPrint,
  MapPin,
  Clock,
  UsersThree,
  Backpack,
  Info,
  PersonSimpleWalk,
  Tree,
  Target,
  Flag,
  Check,
  Star,
  ShareNetwork,
  BookmarkSimple,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { LayoutList } from "@/components/layout/LayoutList";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { getMeetRole } from "@/lib/meetUtils";
import { formatMeetDate } from "@/lib/dateUtils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MEET_TYPE_LABELS, LEASH_LABELS, ENERGY_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";
import type { Meet } from "@/lib/types";

const MEET_ICONS: Record<string, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

interface MeetDetailPanelProps {
  meet: Meet;
  currentUserId?: string;
}

export function MeetDetailPanel({ meet, currentUserId = "shawn" }: MeetDetailPanelProps) {
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const role = getMeetRole(meet, currentUserId);
  const goingCount = meet.attendees.filter((a) => (a.rsvpStatus ?? "going") !== "interested").length;
  const dogCount = meet.attendees.reduce((sum, a) => sum + a.dogNames.length, 0);
  const spotsLeft = meet.maxAttendees - goingCount;
  const organizers = meet.attendees.filter((a) => a.userId === meet.creatorId);
  const confirmed = meet.attendees.filter(
    (a) => a.userId !== meet.creatorId && (a.rsvpStatus ?? "going") === "going"
  );

  return (
    <LayoutList gap="lg">
      {/* Section 1 — Overview: chips + title + attendance */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        {/* Type + attribute chips + actions */}
        <div className="flex items-center gap-xs">
          <span className="card-schedule-chip card-schedule-chip--primary">
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          {meet.leashRule && (
            <span className="card-schedule-chip">
              {LEASH_LABELS[meet.leashRule] || meet.leashRule}
            </span>
          )}
          {meet.energyLevel && meet.energyLevel !== "any" && (
            <span className="card-schedule-chip">
              {ENERGY_LABELS[meet.energyLevel]}
            </span>
          )}
          <span className="flex-1" />
          <button className="detail-action-icon" aria-label="Share">
            <ShareNetwork size={18} weight="light" />
          </button>
          <button className="detail-action-icon" aria-label="Save">
            <BookmarkSimple size={18} weight="light" />
          </button>
        </div>

        {/* Title + group + description */}
        <div className="flex flex-col gap-sm">
          <h2
            className="font-heading font-bold text-fg-primary"
            style={{ fontSize: "var(--text-xl)", lineHeight: 1.3, margin: 0 }}
          >
            {meet.title}
          </h2>
          {group && (
            <Link
              href={`/groups/${group.id}`}
              className="flex items-center gap-xs text-sm font-semibold no-underline"
              style={{ color: "var(--status-info-600, #4e63b8)" }}
            >
              <UsersThree size={16} weight="light" />
              {group.name}
            </Link>
          )}
          <p className="text-sm text-fg-secondary" style={{ lineHeight: "22px", margin: 0 }}>
            {meet.description}
          </p>
        </div>

        {/* Attendance strip */}
        <div
          className="flex items-center gap-sm bg-surface-inset rounded-sm"
          style={{ padding: "var(--space-sm) var(--space-md)" }}
        >
          <div className="flex items-center shrink-0">
            {meet.attendees
              .filter((a) => (a.rsvpStatus ?? "going") === "going")
              .slice(0, 4)
              .map((a, i) =>
                a.avatarUrl ? (
                  <img
                    key={a.userId}
                    src={a.avatarUrl}
                    alt={a.userName}
                    className="rounded-full border-2 border-surface-top object-cover"
                    style={{ width: 28, height: 28, marginLeft: i > 0 ? -8 : 0 }}
                  />
                ) : (
                  <span key={a.userId} style={{ marginLeft: i > 0 ? -8 : 0 }}>
                    <DefaultAvatar name={a.userName} size={28} className="border-2 border-surface-top" />
                  </span>
                )
              )}
          </div>
          <span className="text-sm text-fg-secondary flex-1">
            <span className="font-semibold">{goingCount}</span> going · {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
          </span>
          {role && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap"
              style={
                role === "hosting"
                  ? { padding: "4px 10px", background: "var(--brand-main)", color: "white" }
                  : { padding: "4px 10px", background: "var(--surface-inset)", color: "var(--brand-main)" }
              }
            >
              {role === "hosting" && <Flag size={13} weight="fill" />}
              {role === "joining" && <Check size={13} weight="bold" />}
              {role === "interested" && <Star size={13} weight="light" />}
              {role === "hosting" ? "Hosting" : role === "joining" ? "Joining" : "Interested"}
            </span>
          )}
        </div>
      </LayoutSection>

      {/* Section 2 — Logistics: grid + what to bring + accessibility */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        <div className="schedule-detail-grid">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-fg-tertiary">
              <CalendarDots size={14} weight="light" />
              <SectionLabel>Date & Time</SectionLabel>
            </div>
            <span className="text-sm font-semibold text-fg-primary">
              {formatMeetDate(meet.date)}, {meet.time}
            </span>
            {meet.recurring && (
              <span className="flex items-center gap-xs text-xs text-fg-tertiary">
                <ArrowsClockwise size={12} weight="light" />
                Weekly
              </span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-fg-tertiary">
              <Clock size={14} weight="light" />
              <SectionLabel>Duration</SectionLabel>
            </div>
            <span className="text-sm font-semibold text-fg-primary">
              {meet.durationMinutes} min
            </span>
          </div>

          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-fg-tertiary">
              <MapPin size={14} weight="light" />
              <SectionLabel>Location</SectionLabel>
            </div>
            <span className="text-sm text-fg-primary">{meet.location}</span>
          </div>

          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-fg-tertiary">
              <UsersThree size={14} weight="light" />
              <SectionLabel>People</SectionLabel>
            </div>
            <span className="text-sm text-fg-primary">
              {goingCount}/{meet.maxAttendees} going · {dogCount} {dogCount === 1 ? "dog" : "dogs"}
            </span>
          </div>
        </div>

        {meet.whatToBring && meet.whatToBring.length > 0 && (
          <div className="flex flex-col gap-sm">
            <span className="flex items-center gap-xs font-body font-bold text-fg-secondary text-sm">
              <Backpack size={14} weight="light" />
              What to bring
            </span>
            <ul className="flex flex-col gap-xs" style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
              {meet.whatToBring.map((item) => (
                <li key={item} className="text-sm text-fg-secondary">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {meet.accessibilityNotes && (
          <div className="flex items-start gap-sm bg-surface-inset rounded-sm" style={{ padding: "var(--space-sm) var(--space-md)" }}>
            <Info size={16} weight="light" className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }} />
            <span className="text-sm text-fg-secondary">{meet.accessibilityNotes}</span>
          </div>
        )}
      </LayoutSection>

      {/* Section 3 — People: organisers + confirmed */}
      {(organizers.length > 0 || confirmed.length > 0) && (
        <LayoutSection py="lg" className="flex flex-col gap-md">
          {organizers.length > 0 && (
            <div className="flex flex-col gap-sm">
              <SectionLabel>Organisers</SectionLabel>
              <div className="flex flex-col gap-sm">
                {organizers.map((a) => (
                  <Link key={a.userId} href={`/profile/${a.userId}`} className="flex items-center gap-sm no-underline">
                    {a.avatarUrl ? (
                      <img src={a.avatarUrl} alt={a.userName} className="rounded-full object-cover shrink-0" style={{ width: 44, height: 44 }} />
                    ) : (
                      <DefaultAvatar name={a.userName} size={44} />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-fg-primary">
                        {a.userName}
                        {a.userId === currentUserId && <span className="text-fg-tertiary font-normal"> (you)</span>}
                      </span>
                      <span className="text-xs text-fg-tertiary">{a.dogNames.join(", ")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {confirmed.length > 0 && (
            <div className="flex flex-col gap-sm">
              <SectionLabel>Confirmed ({confirmed.length})</SectionLabel>
              <div className="flex flex-col gap-sm">
                {confirmed.map((a) => (
                  <Link key={a.userId} href={`/profile/${a.userId}`} className="flex items-center gap-sm no-underline">
                    {a.avatarUrl ? (
                      <img src={a.avatarUrl} alt={a.userName} className="rounded-full object-cover shrink-0" style={{ width: 44, height: 44 }} />
                    ) : (
                      <DefaultAvatar name={a.userName} size={44} />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-fg-primary">
                        {a.userName}
                        {a.userId === currentUserId && <span className="text-fg-tertiary font-normal"> (you)</span>}
                      </span>
                      <span className="text-xs text-fg-tertiary">{a.dogNames.join(", ")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </LayoutSection>
      )}
    </LayoutList>
  );
}

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
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";
import { formatMeetDateTime } from "@/lib/dateUtils";
import { AttendeeAvatarStack } from "@/components/meets/AttendeeAvatarStack";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { recurrenceLabel, getDisplayDate, isRecurring } from "@/lib/meetUtils";

/* ── Constants ─────────────────────────────────────────────────── */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={16} weight="light" />,
  park_hangout: <Tree size={16} weight="light" />,
  playdate: <PawPrint size={16} weight="light" />,
  training: <Target size={16} weight="light" />,
};

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

const HISTORY_LABELS: Record<MeetRole, string> = {
  hosting: "Hosted",
  joining: "Attended",
  interested: "Interested",
};

const STATUS_ICONS: Record<MeetRole, React.ReactNode> = {
  hosting: <Flag size={13} weight="fill" />,
  joining: <Check size={13} weight="bold" />,
  interested: <Star size={13} weight="fill" />,
};

/**
 * Label for the "joining" role depends on context:
 * - Paid meet (has serviceCTA) → "Booked" (the action that got the viewer here was a paid booking)
 * - Free meet, schedule variant → "Joining" (legacy schedule-card vocabulary)
 * - Free meet, group/discover variant → "Going" (matches RSVP state vocabulary)
 *
 * Hosting / interested labels are stable across variants.
 */
function resolveStatusLabel(
  role: MeetRole,
  variant: CardMeetProps["variant"],
  isPaid: boolean,
): string {
  if (role === "hosting") return "Hosting";
  if (role === "interested") return "Interested";
  // joining
  if (isPaid) return "Booked";
  return variant === "schedule" ? "Joining" : "Going";
}

/**
 * Compute viewer's role from meet data when not passed explicitly.
 * Mirrors `getMeetRole` (`lib/meetUtils.ts`) but stays local to keep CardMeet
 * a self-contained unit — the schedule variant still passes `role` explicitly.
 */
function deriveViewerRole(meet: Meet, viewerId: string | null): MeetRole | undefined {
  if (!viewerId) return undefined;
  if (meet.creatorId === viewerId) return "hosting";
  const attendee = meet.attendees.find((a) => a.userId === viewerId);
  if (attendee) {
    const status = attendee.rsvpStatus ?? "going";
    if (status === "going") return "joining";
    if (status === "interested") return "interested";
  }
  if (meet.followers?.includes(viewerId)) return "interested";
  return undefined;
}

/* ── Component ──────────────────────────────────────────────────── */

export function CardMeet({ meet, variant, role, isHistory = false }: CardMeetProps) {
  const currentUserId = useCurrentUserId();
  const goingAttendees = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  );
  const goingCount = goingAttendees.length;
  const spotsLeft = meet.maxAttendees - goingCount;
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const isCancelled = meet.status === "cancelled";
  const maxAvatars = 5;

  // Schedule variant passes `role` explicitly; other variants derive from viewer
  // so the role chip ("Going" / "Booked" / "Hosting" / "Interested") makes the
  // absence of a Book CTA self-explanatory.
  const effectiveRole: MeetRole | undefined = role ?? deriveViewerRole(meet, currentUserId);

  // Host signal: RSVP count (only for hosting + upcoming)
  const newRsvpCount =
    effectiveRole === "hosting" && !isHistory
      ? Math.max(0, goingAttendees.filter((a) => a.userId !== currentUserId).length)
      : 0;

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
          /* Status indicator — inline icon + colored text rather than a chip
             pill. Codifies the status-as-text convention introduced during
             Design System Cleanup (2026-05-11): `card-schedule-chip` hosts
             categorical labels (Type pills) only, never status, so the chip
             vocabulary can't be confused with the brand-subtle pill used as
             an interactive control elsewhere (meet-detail RSVP button).
             Mirrors the role-status indicator already in use below
             (lines ~254–267). */
          <span
            className="flex items-center gap-xs text-sm font-semibold shrink-0"
            style={{ color: "var(--error-strong)" }}
          >
            <Flag size={14} weight="fill" />
            Cancelled
          </span>
        )}

        {/* Status indicator moved out of this row — see avatar row below.
            Top-right was visually crowding the previous card's CTA strip. */}
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
          {/* Row 3: Date/time + recurring.
              For recurring meets the displayed date is the next upcoming
              occurrence (via `getDisplayDate`), prefixed "Next:" — `meet.date`
              alone is the series anchor (often deep in the past) and would
              read as stale. */}
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <CalendarDots size={16} weight="light" className="shrink-0" />
            <span style={{ fontWeight: 600, color: isHistory ? undefined : "var(--text-primary)" }}>
              {isRecurring(meet) && !isHistory ? "Next: " : ""}
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

          {/* Row 4: Location */}
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <MapPin size={16} weight="light" className="shrink-0" />
            {meet.location}
          </div>

          {/* Row 5: Group context + capacity (suppressed when already inside a group page) */}
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
        </div>
      )}

      {/* Row 6: Dog-forward avatar stack + surface-specific signals */}
      {!isCancelled && (
        <div className="flex items-center gap-sm flex-wrap">
          <AttendeeAvatarStack
            attendees={goingAttendees}
            maxAvatars={maxAvatars}
            muted={isHistory}
          />

          {/* Spots left — discover variant */}
          {variant === "discover" && spotsLeft > 0 && spotsLeft <= 5 && (
            <span className="text-xs font-semibold text-brand-main shrink-0">
              · {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
            </span>
          )}

          {/* Host signal: RSVPs — schedule variant */}
          {newRsvpCount > 0 && (
            <span className="text-sm font-semibold text-brand-main shrink-0">
              · {newRsvpCount} {newRsvpCount === 1 ? "RSVP" : "RSVPs"}
            </span>
          )}

          {/* Activity signal — inline */}
          {meet.recentJoinText && !isHistory && !newRsvpCount && (
            <div className="flex items-center gap-xs text-xs text-fg-tertiary">
              <Lightning size={12} weight="fill" className="text-brand-main" />
              {meet.recentJoinText}
            </div>
          )}

          {/* Status indicator (Hosting / Going / Booked / Interested).
              Right-aligned via ml-auto. Intentionally NOT chip/pill-shaped —
              the same icon+label vocabulary is used as an interactive RSVP
              button on the meet detail page; on a card the treatment must
              read as status, not as a tappable control.
              Pairs with the avatars row because both are "who's coming +
              your relationship to that"; also avoids crowding the previous
              card's CTA strip when it's at the top of this card. */}
          {effectiveRole && (
            <span
              className="ml-auto flex items-center gap-xs text-sm font-semibold shrink-0"
              style={{
                color: "var(--brand-main)",
                opacity: isHistory ? 0.65 : 1,
              }}
            >
              {STATUS_ICONS[effectiveRole]}
              {isHistory
                ? HISTORY_LABELS[effectiveRole]
                : resolveStatusLabel(effectiveRole, variant, !!meet.serviceCTA)}
            </span>
          )}
        </div>
      )}

      {/* Service CTA — care group events (hidden when user is host or already booked/going).
          Mirrors meet-detail page: hosts see "Hosting" framing, never their own Book CTA. */}
      {!isCancelled
        && meet.serviceCTA
        && meet.creatorId !== currentUserId
        && !(variant === "schedule" && (role === "joining" || role === "hosting"))
        && !goingAttendees.some((a) => a.userId === currentUserId) && (
        <div className="flex items-center justify-between rounded-sm bg-brand-subtle px-md py-sm">
          <div className="flex items-center gap-sm">
            {meet.serviceCTA.price && (
              <span className="text-sm font-semibold text-brand-strong">{meet.serviceCTA.price}</span>
            )}
            {meet.serviceCTA.spotsLeft != null && (
              <span className="text-xs text-fg-secondary">
                {meet.serviceCTA.spotsLeft} {meet.serviceCTA.spotsLeft === 1 ? "spot" : "spots"} left
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-brand-strong">
            {meet.serviceCTA.label} →
          </span>
        </div>
      )}
    </Link>
  );
}

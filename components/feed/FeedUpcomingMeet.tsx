"use client";

import {
  CalendarDots,
  MapPin,
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
} from "@phosphor-icons/react";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";
import { formatMeetDateTime } from "@/lib/dateUtils";
import { AttendeeAvatarStack } from "@/components/meets/AttendeeAvatarStack";
import { getDisplayDate, isRecurring } from "@/lib/meetUtils";

/**
 * FeedUpcomingMeet — the "a meet is happening soon" card that shows in the
 * community feed. Follows the shared meet-card anatomy (see
 * `docs/features/meets.md` → Meet-card anatomy) but sits inside the feed-card
 * article shell so it visually rhymes with moment posts.
 */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

export function FeedUpcomingMeet({ meet }: { meet: Meet }) {
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const avatarUrl = group?.coverPhotoUrl || meet.creatorAvatarUrl;
  const contextName = group?.name || meet.creatorName;
  const goingAttendees = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  );

  return (
    <article className="feed-card">
      <div className="feed-card-body">
        {/* Left column: group/creator avatar */}
        <div className="feed-card-col-avatar">
          <img src={avatarUrl} alt={contextName} className="feed-card-avatar" />
        </div>

        {/* Right column */}
        <div className="feed-card-col-content">
          {/* Context line */}
          <div className="feed-card-author-row">
            <span className="feed-card-author-name">{contextName}</span>
          </div>

          {/* Type pill */}
          <span
            className="card-schedule-chip card-schedule-chip--primary self-start"
            style={{ width: "fit-content" }}
          >
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>

          {/* Meet title — links to detail */}
          <a
            href={`/meets/${meet.id}`}
            className="font-heading text-md font-semibold text-fg-primary m-0"
            style={{ textDecoration: "none" }}
          >
            {meet.title}
          </a>

          {/* Meta */}
          <div className="feed-card-meta">
            <span className="feed-card-meta-item">
              <CalendarDots size={14} weight="light" />
              {/* Recurring meets show next upcoming occurrence ("Next: ...");
                  one-off meets show the meet's own date. See `getDisplayDate`. */}
              {isRecurring(meet) ? "Next: " : ""}
              {formatMeetDateTime(getDisplayDate(meet), meet.time)}
            </span>
            <span className="feed-card-meta-item">
              <MapPin size={14} weight="light" />
              {meet.location}
            </span>
          </div>

          {/* Dog-forward avatar stack + count */}
          <AttendeeAvatarStack attendees={goingAttendees} size={24} />
        </div>
      </div>
    </article>
  );
}

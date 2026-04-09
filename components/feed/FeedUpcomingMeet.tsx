"use client";

import { CalendarDots, MapPin, CheckCircle, Star } from "@phosphor-icons/react";
import type { Meet } from "@/lib/types";
import { getGroupById } from "@/lib/mockGroups";
import { formatMeetDateTime } from "@/lib/dateUtils";

export function FeedUpcomingMeet({ meet }: { meet: Meet }) {
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const avatarUrl = group?.coverPhotoUrl || meet.creatorAvatarUrl;
  const contextName = group?.name || meet.creatorName;

  const goingCount = meet.attendees.filter((a) => a.rsvpStatus !== "interested").length;
  const interestedCount = meet.attendees.filter((a) => a.rsvpStatus === "interested").length;

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
              {formatMeetDateTime(meet.date, meet.time)}
            </span>
            <span className="feed-card-meta-item">
              <MapPin size={14} weight="light" />
              {meet.location}
            </span>
          </div>

          {/* Avatars + status labels in one row */}
          <div className="feed-card-meet-status-row">
            <div className="flex items-center">
              {meet.attendees.slice(0, 4).map((a, i) => (
                <img
                  key={a.userId}
                  src={a.avatarUrl}
                  alt={a.userName}
                  className="rounded-full"
                  style={{
                    width: 22,
                    height: 22,
                    objectFit: "cover",
                    border: "2px solid var(--surface-top)",
                    marginLeft: i > 0 ? -5 : 0,
                  }}
                />
              ))}
            </div>
            {goingCount > 0 && (
              <span className="feed-card-meet-label feed-card-meet-label--going">
                <CheckCircle size={14} weight="fill" />
                {goingCount} Going
              </span>
            )}
            {interestedCount > 0 && (
              <span className="feed-card-meet-label feed-card-meet-label--interested">
                <Star size={14} weight="fill" />
                {interestedCount} Interested
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import { MapPin, Users, ArrowRight, CalendarDots } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { Meet } from "@/lib/types";

export function FeedMeetRecap({ meet }: { meet: Meet }) {
  const totalDogs = meet.attendees.reduce((s, a) => s + a.dogNames.length, 0);

  return (
    <article className="feed-card">
      <div className="feed-card-body">
        {/* Left column: icon as "avatar" */}
        <div className="feed-card-col-avatar">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: "var(--brand-subtle)" }}
          >
            <CalendarDots size={18} weight="fill" style={{ color: "var(--brand-main)" }} />
          </div>
        </div>

        {/* Right column */}
        <div className="feed-card-col-content">
          {/* Title + action */}
          <div className="flex items-start justify-between gap-md">
            <div className="flex flex-col flex-1">
              <span className="text-base font-semibold text-fg-primary">{meet.title}</span>
              <span className="text-sm text-fg-tertiary">Meet recap</span>
            </div>
            <ButtonAction
              variant="outline"
              size="sm"
              href={`/meets/${meet.id}`}
              rightIcon={<ArrowRight size={14} weight="bold" />}
            >
              View recap
            </ButtonAction>
          </div>

          {/* Photos — rounded row */}
          {meet.photos && meet.photos.length > 0 && (
            <div className="post-photo-grid">
              {meet.photos.slice(0, 3).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="post-photo-grid-img"
                  style={{ flex: "1 1 0", minWidth: 0, height: 160 }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ))}
            </div>
          )}

          {/* Meta + avatars */}
          <div className="feed-card-meta flex-wrap">
            <span className="feed-card-meta-item">
              <Users size={14} weight="light" />
              {meet.attendees.length} people · {totalDogs} dogs
            </span>
            <span className="feed-card-meta-item">
              <MapPin size={14} weight="light" />
              {meet.location}
            </span>
            <div className="flex items-center" style={{ marginLeft: "auto" }}>
              {meet.attendees.slice(0, 5).map((a, i) => (
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
                    marginLeft: i > 0 ? -6 : 0,
                  }}
                />
              ))}
              {meet.attendees.length > 5 && (
                <span style={{ marginLeft: 4 }}>+{meet.attendees.length - 5}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

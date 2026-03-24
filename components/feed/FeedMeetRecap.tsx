"use client";

import Link from "next/link";
import { MapPin, Users, ArrowRight, CalendarDots } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PawReaction } from "@/components/posts/PawReaction";
import type { Meet } from "@/lib/types";

export function FeedMeetRecap({ meet }: { meet: Meet }) {
  const totalDogs = meet.attendees.reduce((s, a) => s + a.dogNames.length, 0);

  return (
    <article className="feed-card">
      {/* Header — title + View recap link */}
      <div className="flex items-center gap-sm px-md pt-md pb-sm">
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 36, height: 36, background: "var(--brand-subtle)" }}
        >
          <CalendarDots size={18} weight="fill" style={{ color: "var(--brand-main)" }} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-sm font-semibold text-fg-primary">{meet.title}</span>
          <span className="text-xs text-fg-tertiary">Meet recap</span>
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

      {/* Photos — full bleed */}
      {meet.photos && meet.photos.length > 0 && (
        <div className="flex" style={{ height: 180, gap: 2 }}>
          {meet.photos.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="flex-1"
              style={{ objectFit: "cover", minWidth: 0 }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ))}
        </div>
      )}

      {/* Meta + action row */}
      <div className="feed-card-body">
        <div className="feed-card-body-text">
          <div className="flex items-center gap-md text-xs text-fg-tertiary flex-wrap">
            <span className="flex items-center gap-xs">
              <Users size={12} weight="light" />
              {meet.attendees.length} people · {totalDogs} dogs
            </span>
            <span className="flex items-center gap-xs">
              <MapPin size={12} weight="light" />
              {meet.location}
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
                  width: 24,
                  height: 24,
                  objectFit: "cover",
                  borderColor: "var(--surface-top)",
                  marginLeft: i > 0 ? -6 : 0,
                }}
              />
            ))}
            {meet.attendees.length > 5 && (
              <span className="text-xs text-fg-tertiary" style={{ marginLeft: 4 }}>
                +{meet.attendees.length - 5}
              </span>
            )}
          </div>
        </div>
        <div className="feed-card-body-action">
          <PawReaction reactions={[]} />
        </div>
      </div>
    </article>
  );
}

"use client";

import { CalendarDots, MapPin, Users } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { FeedCard } from "./FeedCard";
import type { Meet } from "@/lib/types";
import { formatMeetDateTime } from "@/lib/dateUtils";

export function FeedUpcomingMeet({ meet }: { meet: Meet }) {
  const totalDogs = meet.attendees.reduce((s, a) => s + a.dogNames.length, 0);

  return (
    <FeedCard>
      <div className="flex items-start justify-between gap-md">
        <div className="flex flex-col gap-xs flex-1">
          <h4 className="font-heading text-md font-semibold text-fg-primary m-0">{meet.title}</h4>
          <div className="flex flex-col gap-xs text-xs text-fg-tertiary">
            <span className="flex items-center gap-xs">
              <CalendarDots size={12} weight="light" />
              {formatMeetDateTime(meet.date, meet.time)}
            </span>
            <span className="flex items-center gap-xs">
              <MapPin size={12} weight="light" />
              {meet.location}
            </span>
            <span className="flex items-center gap-xs">
              <Users size={12} weight="light" />
              {meet.attendees.length} going · {totalDogs} dogs
            </span>
          </div>

          {/* Attendee avatars */}
          <div className="flex items-center" style={{ marginTop: 4 }}>
            {meet.attendees.slice(0, 4).map((a, i) => (
              <img
                key={a.userId}
                src={a.avatarUrl}
                alt={a.userName}
                className="rounded-full border-2"
                style={{
                  width: 22,
                  height: 22,
                  objectFit: "cover",
                  borderColor: "var(--surface-top)",
                  marginLeft: i > 0 ? -5 : 0,
                }}
              />
            ))}
          </div>
        </div>

        <ButtonAction variant="primary" size="sm" cta href={`/meets/${meet.id}`}>
          Join
        </ButtonAction>
      </div>
    </FeedCard>
  );
}

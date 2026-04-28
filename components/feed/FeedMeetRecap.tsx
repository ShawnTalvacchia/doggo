"use client";

import {
  MapPin,
  Users,
  ArrowRight,
  CalendarDots,
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { formatMeetDateTime } from "@/lib/dateUtils";

/**
 * FeedMeetRecap — the "here's how yesterday's meet went" card that appears
 * in the community feed for completed meets. Shares the meet-card anatomy
 * (type pill, title, date, location) but swaps the dog-forward avatar stack
 * for a photo row — photos carry the social proof for completed meets.
 * See `docs/features/meets.md` → Meet-card anatomy.
 */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

export function FeedMeetRecap({ meet }: { meet: Meet }) {
  const totalDogs = meet.attendees.reduce((s, a) => s + a.dogNames.length, 0);

  return (
    <article className="feed-card">
      <div className="feed-card-body">
        {/* Left column: icon as "avatar" */}
        <div className="feed-card-col-avatar">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, background: "var(--brand-subtle)" }}
          >
            <CalendarDots size={18} weight="fill" style={{ color: "var(--brand-main)" }} />
          </div>
        </div>

        {/* Right column */}
        <div className="feed-card-col-content">
          {/* Type pill + "Recap" framing */}
          <div className="flex items-center gap-xs flex-wrap">
            <span className="card-schedule-chip card-schedule-chip--primary">
              {MEET_ICONS[meet.type]}
              {MEET_TYPE_LABELS[meet.type]}
            </span>
            <span className="text-xs text-fg-tertiary">· Recap</span>
          </div>

          {/* Title + action */}
          <div className="flex items-start justify-between gap-md">
            <span className="text-base font-semibold text-fg-primary flex-1">
              {meet.title}
            </span>
            <ButtonAction
              variant="outline"
              size="sm"
              href={`/meets/${meet.id}`}
              rightIcon={<ArrowRight size={14} weight="bold" />}
            >
              View recap
            </ButtonAction>
          </div>

          {/* Meta — date/time + location */}
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

          {/* Photos — the social proof for a completed meet */}
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

          {/* People + dog count footer */}
          <div className="feed-card-meta">
            <span className="feed-card-meta-item">
              <Users size={14} weight="light" />
              {meet.attendees.length} {meet.attendees.length === 1 ? "person" : "people"}
              {totalDogs > 0 && ` · ${totalDogs} ${totalDogs === 1 ? "dog" : "dogs"}`}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  CalendarDots,
  Clock,
  MapPin,
  Users,
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
} from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/**
 * ShareMeetModal — link-share dialog for a meet.
 *
 * Rebuilt 2026-04-27. Prior version had a placeholder "Share via"
 * row of three non-functional buttons (Message / WhatsApp / Email)
 * styled with `--surface-gray` (way too dark per P18) plus an italic
 * tagline that didn't earn its keep. The new shape is just two
 * blocks — meet preview + copy link — with proper tokens and no
 * inline styles. If/when we want native sharing, `navigator.share`
 * is the right primitive (mobile share sheet); the per-channel
 * shortcuts can earn their place by being functional, not faked.
 */
export function ShareMeetModal({
  meet,
  open,
  onClose,
}: {
  meet: Meet;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `doggo.app/meets/${meet.id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${shareUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Going-count vs raw attendee count — matters when interested attendees
  // exist (they don't take a slot). Same math the meet detail page uses
  // for the "spots left" warning.
  const goingCount = meet.attendees.filter((a) => (a.rsvpStatus ?? "going") === "going").length;
  const spotsLeft = meet.maxAttendees - goingCount;
  const isFull = spotsLeft <= 0;
  const isCancelled = meet.status === "cancelled";

  return (
    <ModalSheet open={open} onClose={onClose} title="Share this meet">
      <div className="flex flex-col gap-lg p-md">
        {/* Meet preview */}
        <div className="flex flex-col gap-sm rounded-panel bg-surface-base p-md">
          <span className="inline-flex items-center gap-xs text-xs font-semibold text-brand-strong">
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          <span className="text-base font-semibold text-fg-primary">{meet.title}</span>
          <div className="flex flex-col gap-xs text-sm text-fg-secondary">
            <span className="inline-flex items-center gap-xs">
              <CalendarDots size={14} weight="light" className="shrink-0 text-fg-tertiary" />
              {formatShortDate(meet.date)}
              <span className="text-fg-tertiary">·</span>
              <Clock size={14} weight="light" className="shrink-0 text-fg-tertiary" />
              {meet.time}
            </span>
            <span className="inline-flex items-center gap-xs">
              <MapPin size={14} weight="light" className="shrink-0 text-fg-tertiary" />
              <span className="truncate">{meet.location}</span>
            </span>
            <span className="inline-flex items-center gap-xs">
              <Users size={14} weight="light" className="shrink-0 text-fg-tertiary" />
              {isCancelled ? (
                <span className="text-fg-tertiary">This meet has been cancelled</span>
              ) : isFull ? (
                <span className="font-medium text-fg-primary">Meet is full</span>
              ) : (
                <>
                  {goingCount}/{meet.maxAttendees} going
                  <span className="text-fg-tertiary">·</span>
                  <span>{spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Copy link */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="share-meet-link" className="text-sm font-medium text-fg-primary">
            Share link
          </label>
          <div className="flex items-stretch gap-sm">
            <input
              id="share-meet-link"
              type="text"
              readOnly
              value={shareUrl}
              className="input flex-1"
              onFocus={(e) => e.currentTarget.select()}
            />
            <ButtonAction
              variant={copied ? "primary" : "secondary"}
              size="md"
              onClick={handleCopy}
              leftIcon={copied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="light" />}
            >
              {copied ? "Copied" : "Copy"}
            </ButtonAction>
          </div>
        </div>
      </div>
    </ModalSheet>
  );
}

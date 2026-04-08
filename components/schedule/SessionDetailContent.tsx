"use client";

import { useState } from "react";
import {
  CalendarDots,
  PawPrint,
  ArrowsClockwise,
  ChatCircleDots,
  CheckCircle,
  Play,
  NoteBlank,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LayoutList } from "@/components/layout/LayoutList";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { formatMeetDate } from "@/lib/dateUtils";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Booking, BookingSession } from "@/lib/types";

const CURRENT_USER = "shawn";

export function SessionDetailContent({
  booking,
  session,
  onUpdateSession,
}: {
  booking: Booking;
  session: BookingSession;
  onUpdateSession: (bookingId: string, sessionId: string, update: Partial<BookingSession>) => void;
}) {
  const [noteText, setNoteText] = useState(session.note ?? "");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const isOwner = booking.ownerId === CURRENT_USER;
  const other = isOwner
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl, id: booking.carerId }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl, id: booking.ownerId };
  const timeLabel = booking.recurringSchedule?.timeLabel;

  return (
    <LayoutList gap="lg">
      {/* Section 1 — Session Info */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <img
            src={other.avatarUrl}
            alt={other.name}
            className="rounded-full shrink-0 object-cover"
            style={{ width: 48, height: 48 }}
          />
          <div className="flex flex-col flex-1">
            <span className="font-heading text-lg font-semibold text-fg-primary" style={{ margin: 0 }}>
              {SERVICE_LABELS[booking.serviceType]}
            </span>
            <span className="text-sm text-fg-secondary">
              with {other.name}
            </span>
          </div>
          <StatusBadge status={session.status} />
        </div>

        <div className="flex flex-col gap-sm">
          <div className="flex items-center gap-xs text-sm text-fg-primary">
            <CalendarDots size={14} weight="light" className="text-fg-tertiary" />
            <span className="font-semibold">{formatMeetDate(session.date)}</span>
            {timeLabel && <span className="text-fg-secondary">· {timeLabel}</span>}
          </div>
          {booking.pets.length > 0 && (
            <div className="flex items-center gap-xs text-sm text-fg-primary">
              <PawPrint size={14} weight="light" className="text-fg-tertiary" />
              <span>{booking.pets.join(", ")}</span>
            </div>
          )}
        </div>
      </LayoutSection>

      {/* Section 2 — Quick Actions */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        <SectionLabel>Actions</SectionLabel>

        <div className="flex flex-col gap-sm">
          {/* Status transitions */}
          {session.status === "upcoming" && (
            <ButtonAction
              variant="primary"
              size="sm"
              leftIcon={<Play size={14} weight="fill" />}
              onClick={() => onUpdateSession(booking.id, session.id, {
                status: "in_progress",
                checkedInAt: new Date().toISOString(),
              })}
            >
              Start session
            </ButtonAction>
          )}
          {session.status === "in_progress" && (
            <ButtonAction
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle size={14} weight="fill" />}
              onClick={() => {
                onUpdateSession(booking.id, session.id, {
                  status: "completed",
                  note: noteText || undefined,
                });
              }}
            >
              Mark as complete
            </ButtonAction>
          )}

          {/* Add note */}
          {(session.status === "in_progress" || session.status === "completed") && (
            <>
              {!showNoteInput && !session.note ? (
                <ButtonAction
                  variant="outline"
                  size="sm"
                  leftIcon={<NoteBlank size={14} weight="light" />}
                  onClick={() => setShowNoteInput(true)}
                >
                  Add note
                </ButtonAction>
              ) : (
                <div className="flex flex-col gap-sm">
                  <textarea
                    className="text-sm text-fg-primary bg-surface-inset rounded-sm border-0 resize-none"
                    style={{ padding: "var(--space-sm) var(--space-md)", minHeight: 72 }}
                    placeholder="How did the session go?"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <ButtonAction
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onUpdateSession(booking.id, session.id, { note: noteText });
                      setShowNoteInput(false);
                    }}
                  >
                    Save note
                  </ButtonAction>
                </div>
              )}
            </>
          )}

          {/* Message */}
          {booking.conversationId && (
            <ButtonAction
              variant="outline"
              size="sm"
              leftIcon={<ChatCircleDots size={14} weight="light" />}
              href={`/inbox/${booking.conversationId}`}
            >
              Message {other.name}
            </ButtonAction>
          )}
        </div>
      </LayoutSection>

      {/* Section 3 — Booking Context */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        <SectionLabel>Booking</SectionLabel>

        <div className="flex flex-col gap-sm">
          {booking.recurringSchedule && (
            <div className="flex items-center gap-xs text-sm text-fg-secondary">
              <ArrowsClockwise size={14} weight="light" className="text-fg-tertiary" />
              <span>
                Every {booking.recurringSchedule.days.join(", ")} · {booking.recurringSchedule.timeLabel}
              </span>
            </div>
          )}
          <ButtonAction
            variant="outline"
            size="sm"
            href="/bookings"
          >
            View full booking
          </ButtonAction>
        </div>
      </LayoutSection>
    </LayoutList>
  );
}

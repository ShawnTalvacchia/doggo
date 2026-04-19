"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Handshake,
  Check,
  CalendarDots,
  MapPin,
  User,
  ChatCircleDots,
  Camera,
  CaretRight,
} from "@phosphor-icons/react";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { Spacer } from "@/components/layout/Spacer";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { mockMeets } from "@/lib/mockMeets";
import { getConnectionState } from "@/lib/mockConnections";
import { getUserById } from "@/lib/mockUsers";
import type { MeetAttendee, ConnectionState } from "@/lib/types";

const CURRENT_USER = "shawn";

/* ── Attendee row ────────────────────────────────────────────────── */

type LocalAction = "familiar" | null;

/**
 * Build the dog avatar list for an attendee by looking up their pets.
 * Falls back to empty array for locked / unknown users.
 */
function getDogAvatars(attendee: MeetAttendee): { name: string; url: string | null }[] {
  const user = getUserById(attendee.userId);
  if (!user) {
    return attendee.dogNames.map((name) => ({ name, url: null }));
  }
  return attendee.dogNames.map((name) => {
    const pet = user.pets.find((p) => p.name.toLowerCase() === name.toLowerCase());
    return { name, url: pet?.imageUrl ?? null };
  });
}

function AttendeeRow({
  attendee,
  existingState,
  forceFamiliar,
}: {
  attendee: MeetAttendee;
  existingState: ConnectionState | undefined;
  forceFamiliar?: boolean;
}) {
  const [action, setAction] = useState<LocalAction>(null);
  const user = getUserById(attendee.userId);
  const state = action ?? (forceFamiliar ? "familiar" : null) ?? existingState ?? "none";

  // Locked = profile is locked AND we have no existing relationship beyond "none"
  const isLocked = user?.profileVisibility === "locked" && state === "none";

  const dogAvatars = isLocked ? [] : getDogAvatars(attendee);

  // Display name: first name only for locked, full name otherwise
  const displayName = isLocked
    ? user?.firstName ?? attendee.userName.split(" ")[0]
    : attendee.userName;

  // Dog names text under the name
  const dogNamesText = attendee.dogNames.join(" & ");

  return (
    <div className="attendee-row">
      {/* Name + dog names stacked (left) */}
      <div className="attendee-text">
        <span className="attendee-name">{displayName}</span>
        {!isLocked && dogNamesText && (
          <span className="attendee-dogs">{dogNamesText}</span>
        )}
      </div>

      {/* Avatar stack (person + dogs) with overlap + white stroke */}
      <div className="attendee-avatar-stack">
        {isLocked ? (
          <div className="attendee-avatar attendee-avatar--locked">
            <User size={20} weight="light" />
          </div>
        ) : (
          <img
            src={attendee.avatarUrl}
            alt={attendee.userName}
            className="attendee-avatar"
          />
        )}
        {dogAvatars.map((dog, i) =>
          dog.url ? (
            <img
              key={i}
              src={dog.url}
              alt={dog.name}
              className="attendee-avatar"
            />
          ) : (
            <div key={i} className="attendee-avatar attendee-avatar--locked">
              <User size={20} weight="light" />
            </div>
          )
        )}
      </div>

      {/* Right-side action */}
      <div className="attendee-action">
        {state === "connected" ? (
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<ChatCircleDots size={14} weight="light" />}
            href={`/profile/${attendee.userId}?tab=chat`}
          >
            Message
          </ButtonAction>
        ) : state === "familiar" ? (
          <span className="attendee-status">
            <Check size={14} weight="bold" />
            Saw them
          </span>
        ) : state === "pending" ? (
          <span className="attendee-status attendee-status--muted">Request sent</span>
        ) : (
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<Handshake size={14} weight="light" />}
            onClick={() => setAction("familiar")}
          >
            Saw them
          </ButtonAction>
        )}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function PostMeetConnectPage() {
  const params = useParams();
  const router = useRouter();
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const meet = mockMeets.find((m) => m.id === params.id);

  useEffect(() => {
    if (!meet) return;
    setDetailHeader("Review meet", () => router.back());
    return () => clearDetailHeader();
  }, [meet?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!meet) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Meet not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/schedule")}>
          Back to Schedule
        </ButtonAction>
      </div>
    );
  }

  const otherAttendees = meet.attendees.filter((a) => a.userId !== CURRENT_USER);
  const photos = meet.photos ?? [];

  const d = new Date(`${meet.date}T${meet.time}`);
  const dateStr = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });

  const coverUrl = meet.coverPhotoUrl || "/images/generated/group-walk-stromovka.jpeg";

  return (
    <div className="meet-detail-page">
      <DetailHeader backLabel="Back" title="Review meet" />

      <div className="meet-detail-panel">
        <div className="meet-detail-body">
          {/* Hero cover */}
          <div className="meet-hero" style={{ backgroundImage: `url(${coverUrl})` }} />

          <div className="meet-detail-info">
            {/* Completed pill + neutral title */}
            <div className="flex items-center gap-sm flex-wrap">
              <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong">
                <Check size={12} weight="bold" />
                Completed
              </span>
            </div>

            <h1 className="font-heading text-3xl font-medium text-fg-primary m-0">
              {meet.title}
            </h1>

            <div className="flex items-center gap-md text-sm text-fg-secondary flex-wrap">
              <span className="flex items-center gap-xs">
                <CalendarDots size={14} weight="light" />
                {dateStr}
              </span>
              <span className="flex items-center gap-xs">
                <MapPin size={14} weight="light" />
                {meet.neighbourhood ?? meet.location}
              </span>
              <Link
                href={`/meets/${meet.id}`}
                className="text-brand-main font-semibold inline-flex items-center gap-xs"
                style={{ textDecoration: "none" }}
              >
                Meet details
                <CaretRight size={12} weight="bold" />
              </Link>
            </div>
          </div>

          {/* Content sections — same spacing pattern as meet detail page */}
          <div className="meet-detail-content">
            {/* Photos */}
            <section className="meet-section">
              <div className="meet-section-header">
                <h2 className="meet-section-title">Photos</h2>
                <ButtonAction
                  variant="outline"
                  size="sm"
                  leftIcon={<Camera size={14} weight="light" />}
                >
                  Add photos
                </ButtonAction>
              </div>
              {photos.length > 0 ? (
                <div className="flex gap-sm overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
                  {photos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="rounded-panel shrink-0 object-cover"
                      style={{ width: 160, height: 160 }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-panel border border-edge-regular bg-surface-base p-md flex items-center gap-sm text-sm text-fg-tertiary">
                  <Camera size={16} weight="light" />
                  No photos yet — share one from the walk
                </div>
              )}
            </section>

            {/* Attendees */}
            <section className="meet-section">
              <h2 className="meet-section-title">Who was there</h2>
              <p className="text-sm text-fg-secondary m-0">
                Mark people you remember to build your network.
              </p>
              <div className="flex flex-col gap-sm mt-sm">
                {otherAttendees.map((attendee) => {
                  const conn = getConnectionState(attendee.userId);
                  return (
                    <AttendeeRow
                      key={attendee.userId}
                      attendee={attendee}
                      existingState={conn?.state}
                    />
                  );
                })}
              </div>
            </section>

            {/* Actions */}
            <section className="meet-section">
              <ButtonAction variant="primary" size="md" cta href="/schedule">
                Done
              </ButtonAction>
            </section>
          </div>

          <Spacer />
        </div>
      </div>
    </div>
  );
}

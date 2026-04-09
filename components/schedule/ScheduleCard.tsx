"use client";

import Link from "next/link";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  MapPin,
  ArrowsClockwise,
  Flag,
  Check,
  Star,
  Briefcase,
  Clock,
} from "@phosphor-icons/react";
import type { Meet, MeetType, Booking, BookingSession } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { getUserById } from "@/lib/mockUsers";
import type { MeetRole } from "@/components/meets/CardMeet";

/* ── Icons ─────────────────────────────────────────────────────── */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={13} weight="light" />,
  park_hangout: <Tree size={13} weight="light" />,
  playdate: <PawPrint size={13} weight="light" />,
  training: <Target size={13} weight="light" />,
};

const ROLE_ICONS: Record<MeetRole, React.ReactNode> = {
  hosting: <Flag size={11} weight="fill" />,
  joining: <Check size={11} weight="bold" />,
  interested: <Star size={11} weight="light" />,
};

const ROLE_LABELS: Record<MeetRole, string> = {
  hosting: "Hosting",
  joining: "Joining",
  interested: "Interested",
};

const CURRENT_USER = "shawn";

/* ── Helpers ───────────────────────────────────────────────────── */

function formatTime(time: string): string {
  return time.slice(0, 5);
}

/** Look up a pet's avatar from the owner's user profile */
function getPetAvatarUrl(ownerId: string, petName: string): string | null {
  const user = getUserById(ownerId);
  if (!user) return null;
  const pet = user.pets.find(
    (p) => p.name.toLowerCase() === petName.toLowerCase()
  );
  return pet?.imageUrl ?? null;
}

/* ── Avatar combo: person + dog overlapping ──────────────────── */

function AvatarCombo({
  personUrl,
  personName,
  petUrl,
  petName,
}: {
  personUrl: string;
  personName: string;
  petUrl: string | null;
  petName: string;
}) {
  return (
    <div className="sched-avatar-combo">
      <img
        src={personUrl}
        alt={personName}
        className="sched-avatar-person"
      />
      {petUrl ? (
        <img
          src={petUrl}
          alt={petName}
          className="sched-avatar-pet"
        />
      ) : (
        <span className="sched-avatar-pet sched-avatar-pet--fallback">
          <PawPrint size={12} weight="fill" />
        </span>
      )}
    </div>
  );
}

/* ── Meet schedule card ────────────────────────────────────────── */

export function ScheduleMeetCard({
  meet,
  role,
}: {
  meet: Meet;
  role: MeetRole;
}) {
  const goingCount = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  ).length;

  return (
    <Link
      href={`/meets/${meet.id}`}
      className="sched-card sched-card--meet"
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Time (left) · recurring · pill (right) */}
      <div className="sched-card-top">
        <span className="sched-card-time">
          <Clock size={14} weight="light" />
          {formatTime(meet.time)}
        </span>
        {meet.recurring && (
          <span className="sched-card-recurring">
            <ArrowsClockwise size={12} weight="light" />
            Weekly
          </span>
        )}
        <span className="flex-1" />
        <span className="sched-card-tag sched-card-tag--meet">
          {MEET_ICONS[meet.type]}
          {MEET_TYPE_LABELS[meet.type]}
        </span>
      </div>

      {/* Row 2: Title */}
      <h3 className="sched-card-title">{meet.title}</h3>

      {/* Row 3: Location + going + role */}
      <div className="sched-card-meta">
        <MapPin size={14} weight="light" className="shrink-0" />
        <span className="truncate">{meet.location}</span>
        <span className="sched-card-dot">·</span>
        <span>{goingCount}/{meet.maxAttendees}</span>
        <span className="flex-1" />
        <span
          className="sched-card-role"
          style={
            role === "hosting"
              ? { background: "var(--brand-main)", color: "white" }
              : undefined
          }
        >
          {ROLE_ICONS[role]}
          {ROLE_LABELS[role]}
        </span>
      </div>
    </Link>
  );
}

/* ── Care session schedule card ────────────────────────────────── */

export function ScheduleCareCard({
  booking,
  session,
}: {
  booking: Booking;
  session: BookingSession;
}) {
  const isOwner = booking.ownerId === CURRENT_USER;
  const other = isOwner
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };
  const timeLabel = booking.recurringSchedule?.timeLabel;

  // Get the first pet's avatar for the combo
  const firstPetName = booking.pets[0] ?? null;
  const firstPetAvatar = firstPetName
    ? getPetAvatarUrl(booking.ownerId, firstPetName)
    : null;

  // Build "Person and Pet(s)" label
  const petLabel = booking.pets.length > 0 ? booking.pets.join(" & ") : null;

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="sched-card sched-card--care"
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Time (left) · recurring · pill (right) */}
      <div className="sched-card-top">
        {timeLabel && (
          <span className="sched-card-time">
            <Clock size={14} weight="light" />
            {timeLabel}
          </span>
        )}
        {booking.recurringSchedule && (
          <span className="sched-card-recurring">
            <ArrowsClockwise size={12} weight="light" />
            Recurring
          </span>
        )}
        <span className="flex-1" />
        <span className="sched-card-tag sched-card-tag--care">
          <Briefcase size={13} weight="light" />
          Care
        </span>
      </div>

      {/* Row 2: Service type */}
      <h3 className="sched-card-title">
        {SERVICE_LABELS[booking.serviceType]}
      </h3>

      {/* Row 3: Avatar combo + "Person and Pet" */}
      <div className="sched-card-meta">
        {firstPetName && (
          <AvatarCombo
            personUrl={other.avatarUrl}
            personName={other.name}
            petUrl={firstPetAvatar}
            petName={firstPetName}
          />
        )}
        {!firstPetName && (
          <img
            src={other.avatarUrl}
            alt={other.name}
            className="rounded-full shrink-0 object-cover"
            style={{ width: 28, height: 28 }}
          />
        )}
        <span className="sched-card-names truncate">
          {other.name}
          {petLabel && <span className="sched-card-names-pets"> and {petLabel}</span>}
        </span>
      </div>
    </Link>
  );
}

/* ── Care booking card (for Care tab summary view) ─────────────── */

export function ScheduleBookingCard({
  booking,
  perspective,
}: {
  booking: Booking;
  perspective: "owner" | "carer";
}) {
  const other =
    perspective === "owner"
      ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
      : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };
  const timeLabel = booking.recurringSchedule?.timeLabel;

  const firstPetName = booking.pets[0] ?? null;
  const firstPetAvatar = firstPetName
    ? getPetAvatarUrl(booking.ownerId, firstPetName)
    : null;
  const petLabel = booking.pets.length > 0 ? booking.pets.join(" & ") : null;

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="sched-card sched-card--care"
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Time (left) · recurring · pill (right) */}
      <div className="sched-card-top">
        {timeLabel && (
          <span className="sched-card-time">
            <Clock size={14} weight="light" />
            {timeLabel}
          </span>
        )}
        {booking.recurringSchedule && (
          <span className="sched-card-recurring">
            <ArrowsClockwise size={12} weight="light" />
            Recurring
          </span>
        )}
        <span className="flex-1" />
        <span className="sched-card-tag sched-card-tag--care">
          <Briefcase size={13} weight="light" />
          Care
        </span>
      </div>

      {/* Row 2: Service type */}
      <h3 className="sched-card-title">
        {SERVICE_LABELS[booking.serviceType]}
      </h3>

      {/* Row 3: Avatar combo + names + status */}
      <div className="sched-card-meta">
        {firstPetName && (
          <AvatarCombo
            personUrl={other.avatarUrl}
            personName={other.name}
            petUrl={firstPetAvatar}
            petName={firstPetName}
          />
        )}
        {!firstPetName && (
          <img
            src={other.avatarUrl}
            alt={other.name}
            className="rounded-full shrink-0 object-cover"
            style={{ width: 28, height: 28 }}
          />
        )}
        <span className="sched-card-names truncate">
          {other.name}
          {petLabel && <span className="sched-card-names-pets"> and {petLabel}</span>}
        </span>
        <span className="flex-1" />
        <span className="sched-card-role">
          {booking.status === "active" ? "Active" : "Upcoming"}
        </span>
      </div>
    </Link>
  );
}

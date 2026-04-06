"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDots,
  PawPrint,
  Plus,
  Briefcase,
  MagnifyingGlass,
  MapPin,
  Clock,
  UsersThree,
  Lightning,
  Backpack,
  Dog,
  Info,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CardMyMeet, type MeetRole } from "@/components/activity/CardMyMeet";
import { MasterDetailShell } from "@/components/layout/MasterDetailShell";
import { ListPanel } from "@/components/layout/ListPanel";
import { DetailPanel } from "@/components/layout/DetailPanel";
import { getUserMeets } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";
import { useBookings } from "@/contexts/BookingsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Meet, Booking } from "@/lib/types";

const ENERGY_LABELS: Record<string, string> = {
  low: "Low energy",
  moderate: "Moderate",
  high: "High energy",
  very_high: "Very high energy",
};

const LEASH_LABELS: Record<string, string> = {
  off_leash: "Off leash",
  on_leash: "On leash",
  mixed: "Mixed (on & off leash)",
};

const CURRENT_USER = "shawn";

type ScheduleFilter = "joining" | "invited" | "care";

function getMeetRole(meet: Meet, userId: string): MeetRole {
  if (meet.creatorId === userId) return "hosting";
  const attendee = meet.attendees.find((a) => a.userId === userId);
  if (attendee?.rsvpStatus === "interested") return "interested";
  return "joining";
}

function getBookingNextDate(booking: Booking): string | null {
  if (booking.sessions) {
    const next = booking.sessions.find((s) => s.status === "upcoming");
    return next?.date ?? null;
  }
  return booking.startDate;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

type ScheduleItem =
  | { kind: "meet"; meet: Meet; role: MeetRole; sortKey: string }
  | { kind: "booking"; booking: Booking; perspective: "owner" | "carer"; sortKey: string };

function BookingBlock({
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

  const nextDate = getBookingNextDate(booking);
  const nextDateLabel = nextDate ? formatDate(nextDate) : null;

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="card-booking-block"
      style={{ textDecoration: "none" }}
    >
      <div className="card-booking-block-icon">
        <Briefcase size={16} weight="light" />
      </div>
      <img
        src={other.avatarUrl}
        alt={other.name}
        className="rounded-full shrink-0 object-cover"
        style={{ width: 32, height: 32 }}
      />
      <div className="flex flex-col flex-1 gap-xs min-w-0">
        <span className="text-sm font-semibold text-fg-primary">
          {SERVICE_LABELS[booking.serviceType]}{" "}
          <span className="font-normal text-fg-secondary">with {other.name}</span>
        </span>
        {(nextDateLabel || booking.pets.length > 0) && (
          <span className="text-xs text-fg-tertiary truncate">
            {nextDateLabel && (
              <>
                {nextDateLabel}
                {booking.recurringSchedule && ` · ${booking.recurringSchedule.timeLabel}`}
              </>
            )}
            {booking.pets.length > 0 && ` · ${booking.pets.join(", ")}`}
          </span>
        )}
      </div>
      <StatusBadge status={booking.status} />
    </Link>
  );
}

export default function SchedulePage() {
  const [filter, setFilter] = useState<ScheduleFilter>("joining");
  const [selectedMeetId, setSelectedMeetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const myMeets = getUserMeets(CURRENT_USER);
  const { bookings } = useBookings();
  const upcomingMeets = myMeets.filter((m) => m.status === "upcoming");

  const activeOwnerBookings = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );

  const filters: { key: ScheduleFilter; label: string }[] = [
    { key: "joining", label: "Joining" },
    { key: "invited", label: "Invited" },
    { key: "care", label: "Care" },
  ];

  const filteredItems = useMemo((): ScheduleItem[] => {
    if (filter === "care") {
      return activeOwnerBookings
        .map((b) => ({
          kind: "booking" as const,
          booking: b,
          perspective: "owner" as const,
          sortKey: getBookingNextDate(b) ?? b.startDate,
        }))
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    // Joining = meets user RSVP'd to; Invited = meets with interested status
    return upcomingMeets
      .filter((m) => {
        const role = getMeetRole(m, CURRENT_USER);
        if (filter === "joining") return role === "joining" || role === "hosting";
        if (filter === "invited") return role === "interested";
        return true;
      })
      .filter((m) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q);
      })
      .map((m) => ({
        kind: "meet" as const,
        meet: m,
        role: getMeetRole(m, CURRENT_USER),
        sortKey: `${m.date}T${m.time}`,
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [filter, upcomingMeets, activeOwnerBookings, searchQuery]);

  // Selected meet for detail panel (desktop)
  const selectedMeet = selectedMeetId
    ? myMeets.find((m) => m.id === selectedMeetId)
    : filteredItems.length > 0 && filteredItems[0].kind === "meet"
    ? filteredItems[0].meet
    : null;

  const mobileView = selectedMeetId ? "detail" as const : "list" as const;

  const listContent = (
    <>
      {/* Mobile actions */}
      <div className="activity-mobile-actions" style={{ padding: "0 var(--space-md)" }}>
        <ButtonAction variant="outline" size="sm" href="/discover?tab=care" leftIcon={<MagnifyingGlass size={14} weight="light" />}>
          Find Care
        </ButtonAction>
        <ButtonAction variant="primary" size="sm" href="/meets/create" leftIcon={<Plus size={14} weight="bold" />}>
          Create
        </ButtonAction>
      </div>

      {/* Timeline */}
      {filteredItems.length > 0 ? (
        <div className="flex flex-col">
          {filteredItems.map((item) => {
            if (item.kind === "meet") {
              return (
                <div key={item.meet.id} onClick={() => setSelectedMeetId(item.meet.id)} style={{ cursor: "pointer" }}>
                  <CardMyMeet meet={item.meet} role={item.role} variant="upcoming" />
                </div>
              );
            }
            return (
              <BookingBlock
                key={item.booking.id}
                booking={item.booking}
                perspective={item.perspective}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDots size={48} weight="light" />}
          title={filter === "care" ? "No care bookings yet." : filter === "invited" ? "No invitations right now." : "Nothing coming up yet."}
          subtitle={filter === "care" ? "Find care from people you trust." : "Browse meets near you and RSVP."}
          action={
            <ButtonAction
              variant="primary"
              size="sm"
              href={filter === "care" ? "/discover/care" : "/discover/meets"}
            >
              {filter === "care" ? "Find Care" : "Browse meets"}
            </ButtonAction>
          }
        />
      )}
    </>
  );

  const selectedMeetGroup = selectedMeet?.groupId ? getGroupById(selectedMeet.groupId) : null;
  const goingCount = selectedMeet
    ? selectedMeet.attendees.filter((a) => a.rsvpStatus !== "interested").length
    : 0;
  const dogCount = selectedMeet
    ? selectedMeet.attendees.reduce((sum, a) => sum + a.dogNames.length, 0)
    : 0;

  const detailContent = selectedMeet ? (
    <div className="detail-panel-scroll">
      <div className="flex flex-col gap-xl" style={{ padding: "var(--space-lg)" }}>
        {/* Title + type badge */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <span
              className="text-xs font-semibold rounded-pill"
              style={{
                padding: "2px 10px",
                background: "var(--surface-inset)",
                color: "var(--text-secondary)",
                textTransform: "capitalize",
              }}
            >
              {selectedMeet.type.replace("_", " ")}
            </span>
            {selectedMeet.recurring && (
              <span className="text-xs text-fg-tertiary">Recurring</span>
            )}
          </div>
          <h2
            className="font-heading font-bold text-fg-primary"
            style={{ fontSize: "var(--text-xl)", lineHeight: 1.3, margin: 0 }}
          >
            {selectedMeet.title}
          </h2>
        </div>

        {/* Details grid */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <CalendarDots size={16} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-secondary">
              {new Date(selectedMeet.date + "T00:00:00").toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          <div className="flex items-center gap-sm">
            <Clock size={16} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-secondary">
              {selectedMeet.time} · {selectedMeet.durationMinutes} min
            </span>
          </div>

          <div className="flex items-center gap-sm">
            <MapPin size={16} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-secondary">{selectedMeet.location}</span>
          </div>

          {selectedMeetGroup && (
            <div className="flex items-center gap-sm">
              <UsersThree size={16} weight="light" className="text-fg-tertiary shrink-0" />
              <span className="text-md text-fg-secondary">{selectedMeetGroup.name}</span>
            </div>
          )}

          <div className="flex items-center gap-sm">
            <Dog size={16} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-secondary">
              {goingCount} going · {dogCount} dogs · max {selectedMeet.maxAttendees}
            </span>
          </div>

          {selectedMeet.energyLevel && (
            <div className="flex items-center gap-sm">
              <Lightning size={16} weight="light" className="text-fg-tertiary shrink-0" />
              <span className="text-md text-fg-secondary">
                {ENERGY_LABELS[selectedMeet.energyLevel] || selectedMeet.energyLevel}
              </span>
            </div>
          )}

          {selectedMeet.leashRule && (
            <div className="flex items-center gap-sm">
              <PawPrint size={16} weight="light" className="text-fg-tertiary shrink-0" />
              <span className="text-md text-fg-secondary">
                {LEASH_LABELS[selectedMeet.leashRule] || selectedMeet.leashRule}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-md text-fg-secondary" style={{ lineHeight: "24px", margin: 0 }}>
          {selectedMeet.description}
        </p>

        {/* What to bring */}
        {selectedMeet.whatToBring && selectedMeet.whatToBring.length > 0 && (
          <div className="flex flex-col gap-sm">
            <span className="flex items-center gap-xs font-body font-bold text-fg-secondary text-sm">
              <Backpack size={14} weight="light" />
              What to bring
            </span>
            <ul className="flex flex-col gap-xs" style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
              {selectedMeet.whatToBring.map((item) => (
                <li key={item} className="text-sm text-fg-secondary">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Accessibility */}
        {selectedMeet.accessibilityNotes && (
          <div className="flex items-start gap-sm bg-surface-inset rounded-sm" style={{ padding: "var(--space-sm) var(--space-md)" }}>
            <Info size={16} weight="light" className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }} />
            <span className="text-sm text-fg-secondary">{selectedMeet.accessibilityNotes}</span>
          </div>
        )}

        {/* Attendees preview */}
        {selectedMeet.attendees.length > 0 && (
          <div className="flex flex-col gap-sm">
            <span className="font-body font-bold text-fg-secondary text-sm">Attendees</span>
            <div className="flex flex-col gap-sm">
              {selectedMeet.attendees.slice(0, 5).map((a) => (
                <div key={a.userId} className="flex items-center gap-sm">
                  <img
                    src={a.avatarUrl}
                    alt={a.userName}
                    className="rounded-full object-cover shrink-0"
                    style={{ width: 32, height: 32 }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-fg-primary">{a.userName}</span>
                    <span className="text-xs text-fg-tertiary">{a.dogNames.join(", ")}</span>
                  </div>
                </div>
              ))}
              {selectedMeet.attendees.length > 5 && (
                <span className="text-xs text-fg-tertiary">
                  +{selectedMeet.attendees.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Organizer */}
        <div className="flex items-center gap-sm">
          <img
            src={selectedMeet.creatorAvatarUrl}
            alt={selectedMeet.creatorName}
            className="rounded-full object-cover shrink-0"
            style={{ width: 28, height: 28 }}
          />
          <span className="text-sm text-fg-tertiary">
            Organised by <span className="font-semibold text-fg-secondary">{selectedMeet.creatorName}</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-sm">
          <ButtonAction variant="primary" size="md" href={`/meets/${selectedMeet.id}`}>
            View full details
          </ButtonAction>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col items-center justify-center flex-1 gap-md"
      style={{ padding: "var(--space-xxxl)" }}
    >
      <CalendarDots size={48} weight="light" className="text-fg-tertiary" />
      <span className="text-md text-fg-tertiary">
        Select a meet to see details
      </span>
    </div>
  );

  return (
    <div className="page-container schedule-page-shell">
      <MasterDetailShell
        mobileView={mobileView}
        listPanel={
          <ListPanel
            header={
              <div className="flex items-center justify-between">
                <h1 className="font-heading text-lg font-semibold text-fg-primary">My Schedule</h1>
                <ButtonAction variant="primary" size="sm" href="/meets/create" leftIcon={<Plus size={14} weight="bold" />}>
                  Create
                </ButtonAction>
              </div>
            }
            search={
              <input
                type="text"
                placeholder="Search meets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-sm border border-edge-regular bg-surface-base px-sm py-xs text-sm text-fg-primary"
                style={{ outline: "none" }}
              />
            }
            filters={
              <div className="pill-group">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    className={`pill ${filter === f.key ? "active" : ""}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            }
          >
            {listContent}
          </ListPanel>
        }
        detailPanel={
          <DetailPanel
            header={
              selectedMeet ? (
                <span className="font-heading text-base font-semibold text-fg-primary">{selectedMeet.title}</span>
              ) : undefined
            }
          >
            {detailContent}
          </DetailPanel>
        }
      />
    </div>
  );
}

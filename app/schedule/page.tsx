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
  Backpack,
  Info,
  PersonSimpleWalk,
  Tree,
  Target,
  Flag,
  Check,
  Star,
  ShareNetwork,
  BookmarkSimple,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TabBar } from "@/components/ui/TabBar";
import { CardMeet, type MeetRole } from "@/components/meets/CardMeet";
import { MasterDetailShell } from "@/components/layout/MasterDetailShell";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { getUserMeets, MEET_TYPE_LABELS, LEASH_LABELS, ENERGY_LABELS } from "@/lib/mockMeets";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { getGroupById } from "@/lib/mockGroups";
import { useBookings } from "@/contexts/BookingsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Meet, Booking } from "@/lib/types";

const CURRENT_USER = "shawn";

const MEET_ICONS: Record<string, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

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

  const myMeets = getUserMeets(CURRENT_USER);
  const { bookings } = useBookings();
  const upcomingMeets = myMeets.filter((m) => m.status === "upcoming");

  const activeOwnerBookings = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );

  const TABS = [
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
      .map((m) => ({
        kind: "meet" as const,
        meet: m,
        role: getMeetRole(m, CURRENT_USER),
        sortKey: `${m.date}T${m.time}`,
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [filter, upcomingMeets, activeOwnerBookings]);

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
                  <CardMeet meet={item.meet} variant="schedule" role={item.role} />
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

  const selectedRole = selectedMeet ? getMeetRole(selectedMeet, CURRENT_USER) : null;
  const spotsLeft = selectedMeet ? selectedMeet.maxAttendees - goingCount : 0;
  const organizers = selectedMeet
    ? selectedMeet.attendees.filter((a) => a.userId === selectedMeet.creatorId)
    : [];
  const confirmed = selectedMeet
    ? selectedMeet.attendees.filter(
        (a) => a.userId !== selectedMeet.creatorId && (a.rsvpStatus ?? "going") === "going"
      )
    : [];

  const detailContent = selectedMeet ? (
      <div className="flex flex-col gap-md" style={{ padding: "var(--space-md)" }}>
        {/* Card 1 — Overview: chips + title + attendance */}
        <div className="bg-surface-top rounded-panel p-md shadow-xs flex flex-col gap-md">
          {/* Type + attribute chips + actions */}
          <div className="flex items-center gap-xs">
            <span className="card-schedule-chip card-schedule-chip--primary">
              {MEET_ICONS[selectedMeet.type]}
              {MEET_TYPE_LABELS[selectedMeet.type]}
            </span>
            {selectedMeet.leashRule && (
              <span className="card-schedule-chip">
                {LEASH_LABELS[selectedMeet.leashRule] || selectedMeet.leashRule}
              </span>
            )}
            {selectedMeet.energyLevel && selectedMeet.energyLevel !== "any" && (
              <span className="card-schedule-chip">
                {ENERGY_LABELS[selectedMeet.energyLevel]}
              </span>
            )}
            <span className="flex-1" />
            <button className="detail-action-icon" aria-label="Share">
              <ShareNetwork size={18} weight="light" />
            </button>
            <button className="detail-action-icon" aria-label="Save">
              <BookmarkSimple size={18} weight="light" />
            </button>
          </div>

          {/* Title + group + description */}
          <div className="flex flex-col gap-sm">
            <h2
              className="font-heading font-bold text-fg-primary"
              style={{ fontSize: "var(--text-xl)", lineHeight: 1.3, margin: 0 }}
            >
              {selectedMeet.title}
            </h2>
            {selectedMeetGroup && (
              <Link
                href={`/groups/${selectedMeetGroup.id}`}
                className="flex items-center gap-xs text-sm font-semibold no-underline"
                style={{ color: "var(--status-info-600, #4e63b8)" }}
              >
                <UsersThree size={16} weight="light" />
                {selectedMeetGroup.name}
              </Link>
            )}
            <p className="text-sm text-fg-secondary" style={{ lineHeight: "22px", margin: 0 }}>
              {selectedMeet.description}
            </p>
          </div>

          {/* Attendance strip */}
          <div
            className="flex items-center gap-sm bg-surface-inset rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <div className="flex items-center shrink-0">
              {selectedMeet.attendees
                .filter((a) => (a.rsvpStatus ?? "going") === "going")
                .slice(0, 4)
                .map((a, i) =>
                  a.avatarUrl ? (
                    <img
                      key={a.userId}
                      src={a.avatarUrl}
                      alt={a.userName}
                      className="rounded-full border-2 border-surface-top object-cover"
                      style={{ width: 28, height: 28, marginLeft: i > 0 ? -8 : 0 }}
                    />
                  ) : (
                    <span key={a.userId} style={{ marginLeft: i > 0 ? -8 : 0 }}>
                      <DefaultAvatar name={a.userName} size={28} className="border-2 border-surface-top" />
                    </span>
                  )
                )}
            </div>
            <span className="text-sm text-fg-secondary flex-1">
              <span className="font-semibold">{goingCount}</span> going · {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
            </span>
            {selectedRole && (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap"
                style={
                  selectedRole === "hosting"
                    ? { padding: "4px 10px", background: "var(--brand-main)", color: "white" }
                    : { padding: "4px 10px", background: "var(--surface-inset)", color: "var(--brand-main)" }
                }
              >
                {selectedRole === "hosting" && <Flag size={13} weight="fill" />}
                {selectedRole === "joining" && <Check size={13} weight="bold" />}
                {selectedRole === "interested" && <Star size={13} weight="light" />}
                {selectedRole === "hosting" ? "Hosting" : selectedRole === "joining" ? "Joining" : "Interested"}
              </span>
            )}
          </div>
        </div>

        {/* Card 2 — Logistics: grid + what to bring + accessibility */}
        <div className="bg-surface-top rounded-panel p-md shadow-xs flex flex-col gap-md">
          <div className="schedule-detail-grid">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-xs text-fg-tertiary">
                <CalendarDots size={14} weight="light" />
                <span className="text-xs font-semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Date & Time</span>
              </div>
              <span className="text-sm font-semibold text-fg-primary">
                {new Date(selectedMeet.date + "T00:00:00").toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}, {selectedMeet.time}
              </span>
              {selectedMeet.recurring && (
                <span className="flex items-center gap-xs text-xs text-fg-tertiary">
                  <ArrowsClockwise size={12} weight="light" />
                  Weekly
                </span>
              )}
            </div>

            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-xs text-fg-tertiary">
                <Clock size={14} weight="light" />
                <span className="text-xs font-semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Duration</span>
              </div>
              <span className="text-sm font-semibold text-fg-primary">
                {selectedMeet.durationMinutes} min
              </span>
            </div>

            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-xs text-fg-tertiary">
                <MapPin size={14} weight="light" />
                <span className="text-xs font-semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</span>
              </div>
              <span className="text-sm text-fg-primary">{selectedMeet.location}</span>
            </div>

            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-xs text-fg-tertiary">
                <UsersThree size={14} weight="light" />
                <span className="text-xs font-semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>People</span>
              </div>
              <span className="text-sm text-fg-primary">
                {goingCount}/{selectedMeet.maxAttendees} going · {dogCount} {dogCount === 1 ? "dog" : "dogs"}
              </span>
            </div>
          </div>

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

          {selectedMeet.accessibilityNotes && (
            <div className="flex items-start gap-sm bg-surface-inset rounded-sm" style={{ padding: "var(--space-sm) var(--space-md)" }}>
              <Info size={16} weight="light" className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }} />
              <span className="text-sm text-fg-secondary">{selectedMeet.accessibilityNotes}</span>
            </div>
          )}
        </div>

        {/* Card 3 — People: organisers + confirmed */}
        {(organizers.length > 0 || confirmed.length > 0) && (
          <div className="bg-surface-top rounded-panel p-md shadow-xs flex flex-col gap-md">
            {organizers.length > 0 && (
              <div className="flex flex-col gap-sm">
                <span className="text-xs font-semibold text-fg-tertiary" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Organisers
                </span>
                <div className="flex flex-col gap-sm">
                  {organizers.map((a) => (
                    <Link key={a.userId} href={`/profile/${a.userId}`} className="flex items-center gap-sm no-underline">
                      {a.avatarUrl ? (
                        <img src={a.avatarUrl} alt={a.userName} className="rounded-full object-cover shrink-0" style={{ width: 44, height: 44 }} />
                      ) : (
                        <DefaultAvatar name={a.userName} size={44} />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-fg-primary">
                          {a.userName}
                          {a.userId === CURRENT_USER && <span className="text-fg-tertiary font-normal"> (you)</span>}
                        </span>
                        <span className="text-xs text-fg-tertiary">{a.dogNames.join(", ")}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {confirmed.length > 0 && (
              <div className="flex flex-col gap-sm">
                <span className="text-xs font-semibold text-fg-tertiary" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Confirmed ({confirmed.length})
                </span>
                <div className="flex flex-col gap-sm">
                  {confirmed.map((a) => (
                    <Link key={a.userId} href={`/profile/${a.userId}`} className="flex items-center gap-sm no-underline">
                      {a.avatarUrl ? (
                        <img src={a.avatarUrl} alt={a.userName} className="rounded-full object-cover shrink-0" style={{ width: 44, height: 44 }} />
                      ) : (
                        <DefaultAvatar name={a.userName} size={44} />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-fg-primary">
                          {a.userName}
                          {a.userId === CURRENT_USER && <span className="text-fg-tertiary font-normal"> (you)</span>}
                        </span>
                        <span className="text-xs text-fg-tertiary">{a.dogNames.join(", ")}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
          <div className="list-panel">
            <div className="list-panel-header panel-header-desktop">
              <TabBar tabs={TABS} activeKey={filter} onChange={(key) => setFilter(key as ScheduleFilter)} />
            </div>
            <PanelBody>
              <LayoutList>
                {listContent}
              </LayoutList>
              <Spacer />
            </PanelBody>
          </div>
        }
        detailPanel={
          <div className="detail-panel">
            {selectedMeet && (
              <div className="detail-panel-header">
                <span className="font-heading text-base font-semibold text-fg-primary">{selectedMeet.title}</span>
              </div>
            )}
            <PanelBody>
              {detailContent}
              <Spacer />
            </PanelBody>
          </div>
        }
      />
    </div>
  );
}

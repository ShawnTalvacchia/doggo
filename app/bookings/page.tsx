"use client";

import { Suspense, useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarDots,
  Briefcase,
  ChatCircleDots,
  ArrowsClockwise,
  ArrowLeft,
  XCircle,
  Star,
  PawPrint,
  CurrencyCircleDollar,
  CheckCircle,
  Circle,
  Timer,
  Plus,
  Flag,
  PencilSimple,
  Prohibit,
  Handshake,
  ShieldCheck,
  MapPin,
} from "@phosphor-icons/react";
import { useBookings } from "@/contexts/BookingsContext";
import { useReviews } from "@/contexts/ReviewsContext";
import type { Booking, BookingSession, ContractStatus } from "@/lib/types";
import { BookingRow } from "@/components/ui/BookingRow";
import { BookingListCard } from "@/components/bookings/BookingListCard";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ServicesTab } from "@/components/activity/ServicesTab";
import { CancelBookingModal } from "@/components/bookings/CancelBookingModal";
import { MasterDetailShell, type MobileView } from "@/components/layout/MasterDetailShell";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { formatShortDate, formatDateRange } from "@/lib/dateUtils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";

const CURRENT_USER = "shawn";

const TABS = [
  { key: "care", label: "My Care" },
  { key: "services", label: "My Services" },
];

function scheduleLabel(booking: Booking): string {
  if (booking.recurringSchedule) {
    const { days, timeLabel } = booking.recurringSchedule;
    return `Every ${days.join(", ")} · ${timeLabel}`;
  }
  return formatDateRange(booking.startDate, booking.endDate);
}

function priceLabel(booking: Booking): string {
  const { total, billingCycle } = booking.price;
  if (billingCycle === "per_session") return `${total.toLocaleString()} Kč / session`;
  if (billingCycle === "per_night") return `${total.toLocaleString()} Kč / night`;
  return `${total.toLocaleString()} Kč total`;
}

/* ── Section group ── */

function BookingSection({
  title,
  bookings,
  selectedId,
  onSelect,
}: {
  title: string;
  bookings: Booking[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (bookings.length === 0) return null;
  return (
    <div className="flex flex-col">
      <SectionLabel className="px-md py-sm">{title}</SectionLabel>
      {bookings.map((b) => (
        <div
          key={b.id}
          className={b.id === selectedId ? "booking-list-item--active" : ""}
          onClick={() => onSelect(b.id)}
          style={{ cursor: "pointer" }}
        >
          <div style={{ pointerEvents: "none" }}>
            <BookingRow booking={b} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Helpers ── */

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ── Session icon ── */

function SessionIcon({ status }: { status: BookingSession["status"] }) {
  if (status === "completed")
    return <CheckCircle size={18} weight="fill" className="session-icon session-icon--done" />;
  if (status === "cancelled")
    return <XCircle size={18} weight="fill" className="session-icon session-icon--cancelled" />;
  if (status === "in_progress")
    return <Timer size={18} weight="fill" className="session-icon session-icon--inprogress" />;
  return <Circle size={18} weight="regular" className="session-icon session-icon--upcoming" />;
}

/* ── Auto-complete banner ── */

function AutoCompleteBanner({ bookingId }: { bookingId: string }) {
  const { updateStatus } = useBookings();
  return (
    <div className="booking-autocomplete-banner">
      <div className="booking-autocomplete-banner-icon">
        <Flag size={18} weight="fill" />
      </div>
      <div className="booking-autocomplete-banner-body">
        <p className="booking-autocomplete-banner-title">All sessions done</p>
        <p className="booking-autocomplete-banner-sub">
          Every session has been completed or cancelled.
        </p>
      </div>
      <button
        className="booking-autocomplete-banner-btn"
        onClick={() => updateStatus(bookingId, "completed")}
      >
        Close booking
      </button>
    </div>
  );
}

/* ── Interactive sessions section ── */

function SessionsSection({
  bookingId,
  sessions,
  bookingStatus,
  timeLabel,
}: {
  bookingId: string;
  sessions: BookingSession[];
  bookingStatus: ContractStatus;
  timeLabel?: string;
}) {
  const { updateSession, addSession } = useBookings();
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState(todayIso());

  const inProgress = sessions.filter((s) => s.status === "in_progress");
  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const past = sessions.filter((s) => s.status === "completed" || s.status === "cancelled").reverse();
  const active = [...inProgress, ...upcoming];

  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const cancelledCount = sessions.filter((s) => s.status === "cancelled").length;

  const allDone =
    sessions.length > 0 &&
    active.length === 0 &&
    (bookingStatus === "active" || bookingStatus === "upcoming");

  function handleStart(session: BookingSession) {
    updateSession(bookingId, session.id, {
      status: "in_progress",
      checkedInAt: new Date().toISOString(),
    });
  }

  function handleComplete(session: BookingSession) {
    const note = noteInput[session.id]?.trim() || undefined;
    updateSession(bookingId, session.id, { status: "completed", note });
    setShowNoteFor(null);
    setNoteInput((prev) => {
      const next = { ...prev };
      delete next[session.id];
      return next;
    });
  }

  function handleCancel(sessionId: string) {
    updateSession(bookingId, sessionId, { status: "cancelled" });
    if (showNoteFor === sessionId) setShowNoteFor(null);
  }

  function handleAddSession() {
    if (!newSessionDate) return;
    addSession(bookingId, {
      id: `session-${Date.now()}`,
      date: newSessionDate,
      status: "upcoming",
    });
    setShowAddForm(false);
    setNewSessionDate(todayIso());
  }

  return (
    <>
      {allDone && <AutoCompleteBanner bookingId={bookingId} />}

      <div className="booking-detail-section">
        <div className="booking-sessions-title-row">
          <div>
            <p className="booking-detail-section-title" style={{ marginBottom: 0 }}>Sessions</p>
            {sessions.length > 0 && (
              <p className="booking-sessions-stats">
                {completedCount > 0 && <span className="sessions-stat sessions-stat--done">{completedCount} done</span>}
                {inProgress.length > 0 && <span className="sessions-stat sessions-stat--inprogress">{inProgress.length} in progress</span>}
                {upcoming.length > 0 && <span className="sessions-stat sessions-stat--upcoming">{upcoming.length} upcoming</span>}
                {cancelledCount > 0 && <span className="sessions-stat sessions-stat--cancelled">{cancelledCount} cancelled</span>}
              </p>
            )}
          </div>
          <button
            className="booking-sessions-add-btn"
            onClick={() => setShowAddForm((v) => !v)}
            aria-label="Add session"
          >
            <Plus size={14} weight="bold" /> Add
          </button>
        </div>

        {showAddForm && (
          <div className="booking-add-session-form">
            <input
              type="date"
              className="booking-add-session-date"
              value={newSessionDate}
              onChange={(e) => setNewSessionDate(e.target.value)}
            />
            <div className="booking-add-session-actions">
              <button className="booking-add-session-confirm" onClick={handleAddSession}>Add session</button>
              <button className="booking-add-session-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        <ul className="booking-sessions-list">
          {active.map((s) => (
            <li key={s.id} className="booking-session-row booking-session-row--interactive">
              <div className="booking-session-main">
                <SessionIcon status={s.status} />
                <div className="booking-session-date-block">
                  <span className="booking-session-date">{formatDate(s.date)}</span>
                  {s.status === "in_progress" && s.checkedInAt && (
                    <span className="booking-session-checkin-time">Started {formatTime(s.checkedInAt)}</span>
                  )}
                  {s.status === "upcoming" && timeLabel && (
                    <span className="booking-session-checkin-time">{timeLabel}</span>
                  )}
                </div>
              </div>
              <div className="booking-session-actions">
                {s.status === "upcoming" && (
                  <>
                    <button className="session-action-btn session-action-btn--start" onClick={() => handleStart(s)}>
                      <Timer size={13} weight="bold" /> Start
                    </button>
                    <button className="session-action-btn session-action-btn--cancel" onClick={() => handleCancel(s.id)}>
                      <XCircle size={13} weight="bold" /> Cancel
                    </button>
                  </>
                )}
                {s.status === "in_progress" && (
                  <>
                    {showNoteFor === s.id ? (
                      <div className="booking-session-note-form">
                        <input
                          className="booking-session-note-input"
                          placeholder="Add a note (optional)"
                          value={noteInput[s.id] ?? ""}
                          onChange={(e) => setNoteInput((prev) => ({ ...prev, [s.id]: e.target.value }))}
                          autoFocus
                        />
                        <button className="session-action-btn session-action-btn--complete" onClick={() => handleComplete(s)}>
                          <CheckCircle size={13} weight="bold" /> Done
                        </button>
                        <button className="session-action-btn session-action-btn--muted" onClick={() => setShowNoteFor(null)}>✕</button>
                      </div>
                    ) : (
                      <>
                        <button className="session-action-btn session-action-btn--complete" onClick={() => setShowNoteFor(s.id)}>
                          <CheckCircle size={13} weight="bold" /> Complete
                        </button>
                        <button className="session-action-btn session-action-btn--cancel" onClick={() => handleCancel(s.id)}>
                          <XCircle size={13} weight="bold" /> Cancel
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}

          {active.length > 0 && past.length > 0 && (
            <li className="booking-session-divider" aria-hidden />
          )}

          {past.map((s) => (
            <li key={s.id} className="booking-session-row">
              <div className="booking-session-main">
                <SessionIcon status={s.status} />
                <div className="booking-session-date-block">
                  <span className="booking-session-date">{formatDate(s.date)}</span>
                  {s.checkedInAt && (
                    <span className="booking-session-checkin-time">Checked in {formatTime(s.checkedInAt)}</span>
                  )}
                </div>
              </div>
              <span className={`booking-session-status booking-session-status--${s.status}`}>
                {s.status === "completed" ? "Done" : "Cancelled"}
              </span>
              {s.note && <span className="booking-session-note">{s.note}</span>}
            </li>
          ))}
        </ul>

        {sessions.length === 0 && !showAddForm && (
          <p className="booking-sessions-empty">No sessions yet. Tap + Add to log a session.</p>
        )}
      </div>
    </>
  );
}

/* ── Carer trust card ── */

function CarerTrustCard({ carerId, carerName }: { carerId: string; carerName: string }) {
  const conn = getConnectionState(carerId);
  const communityCarer = getCommunityCarers().find((c) => c.userId === carerId);
  if (!conn || conn.state === "none") return null;

  return (
    <LayoutSection py="lg" className="flex flex-col gap-sm">
      <SectionLabel>Your carer</SectionLabel>
      <div className="flex items-start gap-md">
        <ShieldCheck size={22} weight="light" style={{ color: "var(--brand-main)", flexShrink: 0, marginTop: 2 }} />
        <div className="flex flex-col gap-xs">
          {conn.state === "connected" && (
            <span className="flex items-center gap-xs text-sm font-medium text-fg-primary">
              <Handshake size={14} weight="fill" style={{ color: "var(--brand-main)" }} />
              Connected with {carerName}
            </span>
          )}
          {conn.state === "familiar" && (
            <span className="text-sm text-fg-secondary">{carerName} is marked as Familiar</span>
          )}
          {communityCarer && communityCarer.meetsShared > 0 && (
            <span className="text-xs text-fg-tertiary">{communityCarer.meetsShared} meets together</span>
          )}
          {conn.location && (
            <span className="flex items-center gap-xs text-xs text-fg-tertiary">
              <MapPin size={12} weight="light" /> {conn.location}
            </span>
          )}
          <Link href={`/profile/${carerId}`} className="text-xs text-brand-main mt-xs" style={{ textDecoration: "none" }}>
            View full profile →
          </Link>
        </div>
      </div>
    </LayoutSection>
  );
}

/* ── Price breakdown ── */

function PriceBreakdown({ booking }: { booking: Booking }) {
  const { lineItems, total, currency, billingCycle } = booking.price;

  return (
    <LayoutSection py="lg" className="flex flex-col gap-sm">
      <SectionLabel>Price</SectionLabel>
      <div className="booking-price-rows">
        {lineItems.map((item, i) => (
          <div key={i} className="booking-price-row">
            <span className="booking-price-label">{item.label}</span>
            <span className="booking-price-amount">
              {item.isModifier ? "+" : ""}
              {item.amount.toLocaleString()} {currency}
              <span className="booking-price-unit">/ {item.unit}</span>
            </span>
          </div>
        ))}
        {lineItems.length > 1 && (
          <>
            <div className="booking-price-divider" />
            <div className="booking-price-total-row">
              <span className="booking-price-total-label">Total</span>
              <span className="booking-price-total-amount">
                {total.toLocaleString()} {currency}
              </span>
            </div>
          </>
        )}
        {billingCycle === "per_session" && (
          <p className="booking-price-cycle-note">
            ~{(total * 12).toLocaleString()} Kč / month (est.)
          </p>
        )}
      </div>
    </LayoutSection>
  );
}

/* ── Review section ── */

function ReviewSection({ booking }: { booking: Booking }) {
  const { getReview, addReview } = useReviews();
  const existing = getReview(booking.id);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted || existing) {
    const r = existing ?? { rating, text, carerName: booking.carerName };
    return (
      <LayoutSection py="lg" className="flex flex-col gap-sm">
        <SectionLabel>Your review</SectionLabel>
        <div className="review-submitted-card">
          <div className="review-submitted-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={16} weight={n <= r.rating ? "fill" : "regular"}
                className={`review-star${n <= r.rating ? " review-star--filled" : ""}`} />
            ))}
          </div>
          {r.text && <p className="review-submitted-text">{r.text}</p>}
        </div>
      </LayoutSection>
    );
  }

  function handleSubmit() {
    if (rating === 0) return;
    addReview({
      bookingId: booking.id,
      authorId: "shawn",
      authorName: "Shawn Talvacchia",
      carerName: booking.carerName,
      carerAvatarUrl: booking.carerAvatarUrl,
      rating,
      text: text.trim(),
    });
    setSubmitted(true);
  }

  return (
    <LayoutSection py="lg" className="flex flex-col gap-sm">
      <SectionLabel>Leave a review</SectionLabel>
      <p className="text-xs text-fg-secondary m-0">How was your experience with {booking.carerName}?</p>
      <div className="review-star-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" className="review-star-btn"
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)} aria-label={`${n} star${n !== 1 ? "s" : ""}`}>
            <Star size={28} weight={n <= (hover || rating) ? "fill" : "regular"}
              className={`review-star${n <= (hover || rating) ? " review-star--filled" : ""}`} />
          </button>
        ))}
      </div>
      <textarea className="review-textarea" placeholder="Share what went well (optional)"
        value={text} onChange={(e) => setText(e.target.value)} rows={3} />
      <button className="review-submit-btn" onClick={handleSubmit} disabled={rating === 0}>
        Submit review
      </button>
    </LayoutSection>
  );
}

/* ── Booking detail panel ── */

function BookingDetail({
  booking,
  perspective = "owner",
}: {
  booking: Booking;
  perspective?: "owner" | "carer";
}) {
  const { cancelBooking } = useBookings();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modificationRequested, setModificationRequested] = useState(false);

  const serviceLabel = SERVICE_LABELS[booking.serviceType];
  const allSessions = booking.sessions ?? [];
  const completedCount = allSessions.filter((s) => s.status === "completed").length;
  const upcomingCount = allSessions.filter((s) => s.status === "upcoming" || s.status === "in_progress").length;

  const other = perspective === "owner"
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl, label: "with", id: booking.carerId }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl, label: "for", id: booking.ownerId };

  const isOwnerActive = perspective === "owner" && (booking.status === "active" || booking.status === "upcoming");

  return (
    <LayoutList gap="lg">
      {/* Hero */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        <div className="flex items-center gap-md">
          <img
            src={other.avatarUrl}
            alt={other.name}
            className="rounded-full object-cover shrink-0"
            style={{ width: 56, height: 56 }}
          />
          <div className="flex flex-col flex-1 gap-xs">
            <span className="font-heading text-xl font-bold text-fg-primary" style={{ margin: 0 }}>
              {serviceLabel}
            </span>
            <span className="text-sm text-fg-secondary">
              {other.label} {other.name}
            </span>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex items-center gap-xs flex-wrap">
          {booking.pets.map((pet) => (
            <span key={pet} className="card-schedule-chip">
              <PawPrint size={12} weight="light" /> {pet}
            </span>
          ))}
          {booking.subService && (
            <span className="card-schedule-chip">
              <Briefcase size={12} weight="light" /> {booking.subService}
            </span>
          )}
        </div>
      </LayoutSection>

      {/* Status banners */}
      {booking.status === "cancelled" && (
        <LayoutSection py="lg">
          <div
            className="rounded-panel"
            style={{ background: "var(--status-error-light)", padding: "var(--space-md)" }}
          >
            <p className="text-sm font-medium m-0" style={{ color: "var(--status-error-main)" }}>
              This booking has been cancelled
            </p>
            {booking.cancellationReason && (
              <p className="text-sm text-fg-secondary m-0" style={{ marginTop: "var(--space-xs)" }}>
                Reason: {booking.cancellationReason}
              </p>
            )}
          </div>
        </LayoutSection>
      )}

      {modificationRequested && booking.status !== "cancelled" && (
        <LayoutSection py="lg">
          <div
            className="rounded-panel"
            style={{ background: "var(--status-warning-light)", padding: "var(--space-md)" }}
          >
            <p className="text-sm font-medium m-0" style={{ color: "var(--status-warning-main)" }}>
              Modification requested — waiting for {other.name.split(" ")[0]} to respond
            </p>
          </div>
        </LayoutSection>
      )}

      {/* Carer trust card (owner perspective only) */}
      {perspective === "owner" && (
        <CarerTrustCard carerId={booking.carerId} carerName={booking.carerName} />
      )}

      {/* Key details grid */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        <div className="schedule-detail-grid">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-fg-tertiary">
              <ArrowsClockwise size={14} weight="light" />
              <SectionLabel>Schedule</SectionLabel>
            </div>
            <span className="text-sm font-semibold text-fg-primary">
              {scheduleLabel(booking)}
            </span>
          </div>

          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-fg-tertiary">
              <CurrencyCircleDollar size={14} weight="light" />
              <SectionLabel>Price</SectionLabel>
            </div>
            <span className="text-sm font-semibold text-fg-primary">
              {priceLabel(booking)}
            </span>
          </div>

          {allSessions.length > 0 && (
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-xs text-fg-tertiary">
                <CheckCircle size={14} weight="light" />
                <SectionLabel>Sessions</SectionLabel>
              </div>
              <span className="text-sm font-semibold text-fg-primary">
                {completedCount} completed · {upcomingCount} upcoming
              </span>
            </div>
          )}

          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-fg-tertiary">
              <CalendarDots size={14} weight="light" />
              <SectionLabel>Started</SectionLabel>
            </div>
            <span className="text-sm font-semibold text-fg-primary">
              {formatShortDate(booking.startDate)}
            </span>
          </div>
        </div>
      </LayoutSection>

      {/* Interactive sessions (ongoing bookings) */}
      {booking.type === "ongoing" && (
        <LayoutSection py="lg">
          <SessionsSection
            bookingId={booking.id}
            sessions={allSessions}
            bookingStatus={booking.status}
            timeLabel={booking.recurringSchedule?.timeLabel}
          />
        </LayoutSection>
      )}

      {/* Price breakdown */}
      <PriceBreakdown booking={booking} />

      {/* Review (completed bookings, owner perspective) */}
      {booking.status === "completed" && perspective === "owner" && (
        <ReviewSection booking={booking} />
      )}

      {/* Actions */}
      <LayoutSection py="lg" className="flex flex-col gap-md">
        <div className="flex gap-sm flex-wrap">
          <ButtonAction
            variant="primary"
            size="sm"
            leftIcon={<ChatCircleDots size={14} weight="light" />}
            href={booking.conversationId ? `/inbox/${booking.conversationId}` : "/inbox"}
          >
            Message {other.name.split(" ")[0]}
          </ButtonAction>

          {isOwnerActive && (
            <ButtonAction
              variant="outline"
              size="sm"
              onClick={() => setModificationRequested(true)}
              disabled={modificationRequested}
              leftIcon={<PencilSimple size={14} weight="light" />}
            >
              {modificationRequested ? "Requested" : "Request change"}
            </ButtonAction>
          )}

          {isOwnerActive && (
            <ButtonAction
              variant="destructive"
              size="sm"
              onClick={() => setShowCancelModal(true)}
              leftIcon={<Prohibit size={14} weight="light" />}
            >
              Cancel
            </ButtonAction>
          )}
        </div>
      </LayoutSection>

      {/* Contract meta */}
      <LayoutSection py="lg" className="flex flex-col gap-xs">
        <SectionLabel>Contract</SectionLabel>
        <p className="text-xs text-fg-tertiary m-0">
          Signed {formatShortDate(booking.signedAt?.slice(0, 10) ?? booking.startDate)} · ID: {booking.id}
        </p>
      </LayoutSection>

      {/* Cancel modal */}
      <CancelBookingModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={(reason) => {
          cancelBooking(booking.id, reason);
          setShowCancelModal(false);
        }}
        carerName={other.name}
      />
    </LayoutList>
  );
}

/* ── My Care tab (left panel) ── */

function MyCareContent({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { bookings } = useBookings();
  const ownerBookings = bookings.filter((b) => b.ownerId === CURRENT_USER);

  const active = ownerBookings.filter((b) => b.status === "active");
  const upcoming = ownerBookings.filter((b) => b.status === "upcoming");
  const past = ownerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (ownerBookings.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDots size={48} weight="light" />}
        title="No care bookings yet."
        subtitle="Find a trusted carer in your community."
        action={
          <ButtonAction variant="primary" size="sm" href="/discover/care">
            Find Care
          </ButtonAction>
        }
      />
    );
  }

  return (
    <LayoutList>
      <BookingSection title="Active" bookings={active} selectedId={selectedId} onSelect={onSelect} />
      <BookingSection title="Upcoming" bookings={upcoming} selectedId={selectedId} onSelect={onSelect} />
      <BookingSection title="Past" bookings={past} selectedId={selectedId} onSelect={onSelect} />
    </LayoutList>
  );
}

/* ── My Services tab (left panel — carer-side bookings) ── */

function MyServicesContent({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { bookings } = useBookings();
  const carerBookings = bookings.filter((b) => b.carerId === CURRENT_USER);

  const active = carerBookings.filter((b) => b.status === "active");
  const upcoming = carerBookings.filter((b) => b.status === "upcoming");
  const past = carerBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (carerBookings.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase size={48} weight="light" />}
        title="No service bookings yet."
        subtitle="Set up your services in your profile to start receiving bookings."
        action={
          <ButtonAction variant="primary" size="sm" href="/profile?tab=services">
            Set up services
          </ButtonAction>
        }
      />
    );
  }

  return (
    <LayoutList>
      {active.length > 0 && (
        <div className="flex flex-col">
          <SectionLabel className="px-md py-sm">Active</SectionLabel>
          {active.map((b) => (
            <div key={b.id} className={b.id === selectedId ? "booking-list-item--active" : ""} onClick={() => onSelect(b.id)} style={{ cursor: "pointer" }}>
              <div style={{ pointerEvents: "none" }}>
                <BookingListCard booking={b} perspective="carer" />
              </div>
            </div>
          ))}
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="flex flex-col">
          <SectionLabel className="px-md py-sm">Upcoming</SectionLabel>
          {upcoming.map((b) => (
            <div key={b.id} className={b.id === selectedId ? "booking-list-item--active" : ""} onClick={() => onSelect(b.id)} style={{ cursor: "pointer" }}>
              <div style={{ pointerEvents: "none" }}>
                <BookingListCard booking={b} perspective="carer" />
              </div>
            </div>
          ))}
        </div>
      )}
      {past.length > 0 && (
        <div className="flex flex-col">
          <SectionLabel className="px-md py-sm">Past</SectionLabel>
          {past.map((b) => (
            <div key={b.id} className={b.id === selectedId ? "booking-list-item--active" : ""} onClick={() => onSelect(b.id)} style={{ cursor: "pointer" }}>
              <div style={{ pointerEvents: "none" }}>
                <BookingListCard booking={b} perspective="carer" />
              </div>
            </div>
          ))}
        </div>
      )}
    </LayoutList>
  );
}

/* ── Page ── */

function BookingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "care";
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { bookings } = useBookings();

  const ownerBookings = useMemo(
    () => bookings.filter((b) => b.ownerId === CURRENT_USER),
    [bookings]
  );

  const carerBookings = useMemo(
    () => bookings.filter((b) => b.carerId === CURRENT_USER),
    [bookings]
  );

  const selectedBooking = selectedBookingId
    ? bookings.find((b) => b.id === selectedBookingId) ?? null
    : null;

  // Auto-select first booking when none selected (care tab only)
  const autoSelectedBooking = !selectedBooking && activeTab === "care"
    ? ownerBookings.find((b) => b.status === "active")
      ?? ownerBookings.find((b) => b.status === "upcoming")
      ?? ownerBookings[0]
      ?? null
    : null;

  const activeBooking = selectedBooking ?? autoSelectedBooking;

  // Determine perspective based on active tab
  const perspective: "owner" | "carer" = activeTab === "services" ? "carer" : "owner";

  const handleTabChange = (key: string) => {
    router.replace(`/bookings?tab=${key}`, { scroll: false });
    setSelectedBookingId(null);
  };

  const mobileView: MobileView = selectedBookingId ? "detail" : "list";

  // Detail panel header label
  const detailHeaderLabel = activeBooking
    ? perspective === "owner"
      ? `${SERVICE_LABELS[activeBooking.serviceType]} with ${activeBooking.carerName}`
      : `${SERVICE_LABELS[activeBooking.serviceType]} for ${activeBooking.ownerName}`
    : activeTab === "services"
      ? "Dashboard"
      : null;

  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const handleBack = useCallback(() => setSelectedBookingId(null), []);

  useEffect(() => {
    if (selectedBookingId && detailHeaderLabel) {
      setDetailHeader(detailHeaderLabel, handleBack);
    } else {
      clearDetailHeader();
    }
    return () => clearDetailHeader();
  }, [selectedBookingId, detailHeaderLabel, setDetailHeader, clearDetailHeader, handleBack]);

  return (
    <div className="page-container bookings-page-shell">
      {/* TabBar — visible on collapsed/mobile, hidden on desktop */}
      <div className="panel-tabbar" data-view={mobileView}>
        <div className="panel-tabbar-list">
          <div className="panel-tabbar-title">Bookings</div>
          <div className="panel-tabbar-tabs">
            <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
          </div>
        </div>
        <div className="panel-tabbar-detail">
          <button type="button" className="panel-tabbar-back" onClick={() => setSelectedBookingId(null)}>
            <ArrowLeft size={20} weight="light" />
          </button>
          <span className="panel-tabbar-detail-title">{detailHeaderLabel}</span>
        </div>
      </div>

      <MasterDetailShell
        mobileView={mobileView}
        listPanel={
          <div className="list-panel">
            <div className="list-panel-header panel-header-desktop">
              <h2 className="font-heading text-lg font-bold text-fg-primary m-0">Bookings</h2>
            </div>
            <div className="list-panel-filters panel-header-desktop">
              <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
            </div>
            <PanelBody>
              {activeTab === "care" && (
                <MyCareContent selectedId={activeBooking?.id ?? null} onSelect={setSelectedBookingId} />
              )}
              {activeTab === "services" && (
                <MyServicesContent selectedId={selectedBookingId} onSelect={setSelectedBookingId} />
              )}
              <Spacer />
            </PanelBody>
          </div>
        }
        detailPanel={
          <div className="detail-panel">
            {detailHeaderLabel && (
              <div className="detail-panel-header">
                <span className="font-heading text-base font-semibold text-fg-primary">
                  {detailHeaderLabel}
                </span>
              </div>
            )}
            <PanelBody>
              {activeBooking ? (
                <BookingDetail booking={activeBooking} perspective={perspective} />
              ) : activeTab === "services" ? (
                <ServicesTab />
              ) : (
                <div
                  className="flex flex-col items-center justify-center flex-1 gap-md"
                  style={{ padding: "var(--space-xxxl)" }}
                >
                  <Briefcase size={48} weight="light" className="text-fg-tertiary" />
                  <span className="text-md text-fg-tertiary">
                    Select a booking to see details
                  </span>
                </div>
              )}
              <Spacer />
            </PanelBody>
          </div>
        }
      />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsPageInner />
    </Suspense>
  );
}

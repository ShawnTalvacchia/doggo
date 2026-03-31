"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Circle,
  Plus,
  Star,
  Timer,
  XCircle,
  Flag,
} from "@phosphor-icons/react";
import { useBookings } from "@/contexts/BookingsContext";
import { useReviews } from "@/contexts/ReviewsContext";
import type { Booking, BookingSession, ContractStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";
import { Handshake, ShieldCheck, MapPin, CreditCard, Prohibit, ChatCircleDots as ChatIcon, PencilSimple } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { CancelBookingModal } from "@/components/bookings/CancelBookingModal";

// ── Helpers ─────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatSignedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function nightCount(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Session icon ──────────────────────────────────────────────────────────────────

function SessionIcon({ status }: { status: BookingSession["status"] }) {
  if (status === "completed")
    return <CheckCircle size={18} weight="fill" className="session-icon session-icon--done" />;
  if (status === "cancelled")
    return <XCircle size={18} weight="fill" className="session-icon session-icon--cancelled" />;
  if (status === "in_progress")
    return <Timer size={18} weight="fill" className="session-icon session-icon--inprogress" />;
  return <Circle size={18} weight="regular" className="session-icon session-icon--upcoming" />;
}

// ── Schedule section ──────────────────────────────────────────────────────────────

function ScheduleSection({ booking }: { booking: Booking }) {
  if (booking.recurringSchedule) {
    const { days, timeLabel } = booking.recurringSchedule;
    return (
      <div className="booking-detail-section">
        <p className="booking-detail-section-title">Schedule</p>
        <p className="booking-detail-schedule-text">Every {days.join(", ")}</p>
        <p className="booking-detail-schedule-sub">
          {timeLabel} · Started {formatShortDate(booking.startDate)}
        </p>
      </div>
    );
  }

  const nights = booking.endDate ? nightCount(booking.startDate, booking.endDate) : null;
  return (
    <div className="booking-detail-section">
      <p className="booking-detail-section-title">Dates</p>
      <p className="booking-detail-schedule-text">
        {formatShortDate(booking.startDate)}
        {booking.endDate ? ` – ${formatShortDate(booking.endDate)}` : ""}
      </p>
      {nights !== null && (
        <p className="booking-detail-schedule-sub">{nights} nights</p>
      )}
    </div>
  );
}

// ── Auto-complete banner ───────────────────────────────────────────────────────────

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

// ── Sessions section (ongoing only) ──────────────────────────────────────────────

function SessionsSection({
  bookingId,
  sessions,
  bookingStatus,
}: {
  bookingId: string;
  sessions: BookingSession[];
  bookingStatus: ContractStatus;
}) {
  const { updateSession, addSession, updateStatus } = useBookings();
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState(todayIso());

  const inProgress = sessions.filter((s) => s.status === "in_progress");
  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const past = sessions.filter((s) => s.status === "completed" || s.status === "cancelled").reverse();

  // Active sessions = in_progress + upcoming (shown at top)
  const active = [...inProgress, ...upcoming];

  // Stats
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const cancelledCount = sessions.filter((s) => s.status === "cancelled").length;

  // All-done state: no more upcoming or in_progress, has at least one session
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
    const newSession: BookingSession = {
      id: `session-${Date.now()}`,
      date: newSessionDate,
      status: "upcoming",
    };
    addSession(bookingId, newSession);
    setShowAddForm(false);
    setNewSessionDate(todayIso());
  }

  return (
    <>
      {/* Auto-complete banner */}
      {allDone && <AutoCompleteBanner bookingId={bookingId} />}

      <div className="booking-detail-section">
        {/* Title row + stats + Add button */}
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
            <Plus size={14} weight="bold" />
            Add
          </button>
        </div>

        {/* Add session form */}
        {showAddForm && (
          <div className="booking-add-session-form">
            <input
              type="date"
              className="booking-add-session-date"
              value={newSessionDate}
              onChange={(e) => setNewSessionDate(e.target.value)}
            />
            <div className="booking-add-session-actions">
              <button className="booking-add-session-confirm" onClick={handleAddSession}>
                Add session
              </button>
              <button
                className="booking-add-session-cancel"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <ul className="booking-sessions-list">
          {/* Active: in_progress first, then upcoming */}
          {active.map((s) => (
            <li key={s.id} className="booking-session-row booking-session-row--interactive">
              <div className="booking-session-main">
                <SessionIcon status={s.status} />
                <div className="booking-session-date-block">
                  <span className="booking-session-date">{formatDate(s.date)}</span>
                  {s.status === "in_progress" && s.checkedInAt && (
                    <span className="booking-session-checkin-time">
                      Started {formatTime(s.checkedInAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="booking-session-actions">
                {s.status === "upcoming" && (
                  <>
                    <button
                      className="session-action-btn session-action-btn--start"
                      onClick={() => handleStart(s)}
                    >
                      <Timer size={13} weight="bold" /> Start
                    </button>
                    <button
                      className="session-action-btn session-action-btn--cancel"
                      onClick={() => handleCancel(s.id)}
                    >
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
                          onChange={(e) =>
                            setNoteInput((prev) => ({ ...prev, [s.id]: e.target.value }))
                          }
                          autoFocus
                        />
                        <button
                          className="session-action-btn session-action-btn--complete"
                          onClick={() => handleComplete(s)}
                        >
                          <CheckCircle size={13} weight="bold" /> Done
                        </button>
                        <button
                          className="session-action-btn session-action-btn--muted"
                          onClick={() => setShowNoteFor(null)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className="session-action-btn session-action-btn--complete"
                          onClick={() => setShowNoteFor(s.id)}
                        >
                          <CheckCircle size={13} weight="bold" /> Complete
                        </button>
                        <button
                          className="session-action-btn session-action-btn--cancel"
                          onClick={() => handleCancel(s.id)}
                        >
                          <XCircle size={13} weight="bold" /> Cancel
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}

          {/* Divider */}
          {active.length > 0 && past.length > 0 && (
            <li className="booking-session-divider" aria-hidden />
          )}

          {/* Past: completed + cancelled (newest first) */}
          {past.map((s) => (
            <li key={s.id} className="booking-session-row">
              <div className="booking-session-main">
                <SessionIcon status={s.status} />
                <div className="booking-session-date-block">
                  <span className="booking-session-date">{formatDate(s.date)}</span>
                  {s.checkedInAt && (
                    <span className="booking-session-checkin-time">
                      Checked in {formatTime(s.checkedInAt)}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={`booking-session-status booking-session-status--${s.status}`}
              >
                {s.status === "completed" ? "Done" : "Cancelled"}
              </span>
              {s.note && (
                <span className="booking-session-note">{s.note}</span>
              )}
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

// ── Review section ────────────────────────────────────────────────────────────────

function ReviewSection({ booking }: { booking: Booking }) {
  const { hasReview, getReview, addReview } = useReviews();
  const existing = getReview(booking.id);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted || existing) {
    const r = existing ?? { rating, text, carerName: booking.carerName };
    return (
      <div className="booking-detail-section">
        <p className="booking-detail-section-title">Your review</p>
        <div className="review-submitted-card">
          <div className="review-submitted-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={16}
                weight={n <= r.rating ? "fill" : "regular"}
                className={`review-star${n <= r.rating ? " review-star--filled" : ""}`}
              />
            ))}
          </div>
          {r.text && <p className="review-submitted-text">{r.text}</p>}
        </div>
      </div>
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
    <div className="booking-detail-section">
      <p className="booking-detail-section-title">Leave a review</p>
      <p className="review-prompt-sub">How was your experience with {booking.carerName}?</p>
      {/* Star picker */}
      <div className="review-star-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="review-star-btn"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n !== 1 ? "s" : ""}`}
          >
            <Star
              size={28}
              weight={n <= (hover || rating) ? "fill" : "regular"}
              className={`review-star${n <= (hover || rating) ? " review-star--filled" : ""}`}
            />
          </button>
        ))}
      </div>
      {/* Optional comment */}
      <textarea
        className="review-textarea"
        placeholder="Share what went well (optional)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <button
        className="review-submit-btn"
        onClick={handleSubmit}
        disabled={rating === 0}
      >
        Submit review
      </button>
    </div>
  );
}

// ── Price section ─────────────────────────────────────────────────────────────────

function PriceSection({ booking }: { booking: Booking }) {
  const { lineItems, total, currency, billingCycle } = booking.price;

  const cycleLabel =
    billingCycle === "per_session"
      ? `~${(total * 12).toLocaleString()} Kč / month (est.)`
      : billingCycle === "total"
      ? `${total.toLocaleString()} ${currency} total`
      : null;

  return (
    <div className="booking-detail-section">
      <p className="booking-detail-section-title">Price</p>
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
          <p className="booking-price-cycle-note">{cycleLabel}</p>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────────

function CarerTrustCard({ carerId, carerName }: { carerId: string; carerName: string }) {
  const conn = getConnectionState(carerId);
  const communityCarer = getCommunityCarers().find((c) => c.userId === carerId);
  if (!conn || conn.state === "none") return null;

  return (
    <div className="booking-detail-section">
      <p className="booking-detail-section-title">Your carer</p>
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
            <span className="text-sm text-fg-secondary">
              {carerName} is marked as Familiar
            </span>
          )}
          {communityCarer && communityCarer.meetsShared > 0 && (
            <span className="text-xs text-fg-tertiary">
              {communityCarer.meetsShared} meets together
            </span>
          )}
          {conn.location && (
            <span className="flex items-center gap-xs text-xs text-fg-tertiary">
              <MapPin size={12} weight="light" /> {conn.location}
            </span>
          )}
          <Link
            href={`/profile/${carerId}`}
            className="text-xs text-brand-main mt-xs"
            style={{ textDecoration: "none" }}
          >
            View full profile →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const { getBooking, cancelBooking } = useBookings();
  const booking = getBooking(bookingId);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modificationRequested, setModificationRequested] = useState(false);

  if (!booking) {
    return (
      <main className="booking-detail-page">
        <DetailHeader backHref="/bookings" backLabel="Bookings" />
        <div className="booking-detail-not-found">
          <p>Booking not found.</p>
        </div>
      </main>
    );
  }

  const serviceLabel = SERVICE_LABELS[booking.serviceType];

  return (
    <div className="booking-detail-outer">
    <main className="booking-detail-page">
      <DetailHeader backHref="/bookings" backLabel="Bookings" />

      {/* Hero — carer + status */}
      <div className="booking-detail-hero">
        <img
          src={booking.carerAvatarUrl}
          alt={booking.carerName}
          className="booking-detail-avatar"
        />
        <div className="booking-detail-hero-body">
          <h1 className="booking-detail-hero-name">{booking.carerName}</h1>
          <div className="booking-detail-hero-chips">
            <span className="tag tag--brand">{serviceLabel}</span>
            {booking.subService && (
              <span className="tag tag--brand">{booking.subService}</span>
            )}
            {booking.pets.map((pet) => (
              <span key={pet} className="tag">
                {pet}
              </span>
            ))}
          </div>
          {/* Next session summary */}
          {(booking.status === "active" || booking.status === "upcoming") && (() => {
            const nextSession = booking.sessions?.find((s) => s.status === "upcoming" || s.status === "in_progress");
            if (nextSession) {
              return (
                <p className="text-xs text-fg-tertiary mt-xs">
                  {nextSession.status === "in_progress" ? "In progress" : `Next: ${formatDate(nextSession.date)}`}
                </p>
              );
            }
            if (booking.startDate && booking.status === "upcoming") {
              return (
                <p className="text-xs text-fg-tertiary mt-xs">
                  Starts {formatShortDate(booking.startDate)}
                </p>
              );
            }
            return null;
          })()}
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Carer trust context */}
      <CarerTrustCard carerId={booking.carerId} carerName={booking.carerName} />

      {/* Owner actions */}
      {booking.ownerId === "shawn" && (booking.status === "upcoming" || booking.status === "active") && (
        <div className="booking-detail-section">
          <div className="flex gap-sm flex-wrap">
            {booking.conversationId && (
              <ButtonAction
                variant="secondary"
                size="sm"
                href={`/inbox/${booking.conversationId}`}
                leftIcon={<ChatIcon size={14} weight="light" />}
              >
                Message {booking.carerName.split(" ")[0]}
              </ButtonAction>
            )}
            <ButtonAction
              variant="outline"
              size="sm"
              onClick={() => setModificationRequested(true)}
              disabled={modificationRequested}
              leftIcon={<PencilSimple size={14} weight="light" />}
            >
              {modificationRequested ? "Modification requested" : "Request change"}
            </ButtonAction>
            <ButtonAction
              variant="destructive"
              size="sm"
              onClick={() => setShowCancelModal(true)}
              leftIcon={<Prohibit size={14} weight="light" />}
            >
              Cancel
            </ButtonAction>
          </div>
        </div>
      )}

      {/* Cancellation notice */}
      {booking.status === "cancelled" && (
        <div
          className="booking-detail-section"
          style={{ background: "var(--status-error-light)", borderRadius: "var(--radius-panel)", padding: "var(--space-md)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--status-error-main)", margin: 0 }}>
            This booking has been cancelled
          </p>
          {booking.cancellationReason && (
            <p className="text-sm text-fg-secondary" style={{ marginTop: "var(--space-xs)", marginBottom: 0 }}>
              Reason: {booking.cancellationReason}
            </p>
          )}
        </div>
      )}

      {/* Modification requested banner */}
      {modificationRequested && booking.status !== "cancelled" && (
        <div
          className="booking-detail-section"
          style={{ background: "var(--status-warning-light)", borderRadius: "var(--radius-panel)", padding: "var(--space-md)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--status-warning-main)", margin: 0 }}>
            Modification requested — waiting for {booking.carerName.split(" ")[0]} to respond
          </p>
        </div>
      )}

      {/* Cancel modal */}
      <CancelBookingModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={(reason) => {
          cancelBooking(booking.id, reason);
          setShowCancelModal(false);
        }}
        carerName={booking.carerName}
      />

      {/* Schedule */}
      <ScheduleSection booking={booking} />

      {/* Sessions — ongoing only */}
      {booking.type === "ongoing" && (
        <SessionsSection
          bookingId={booking.id}
          sessions={booking.sessions ?? []}
          bookingStatus={booking.status}
        />
      )}

      {/* Price */}
      <PriceSection booking={booking} />

      {/* Payment status */}
      {booking.paymentStatus === "unpaid" && booking.status === "upcoming" && (
        <div className="booking-detail-section">
          <ButtonAction
            variant="primary"
            size="md"
            href={`/bookings/${booking.id}/checkout`}
            leftIcon={<CreditCard size={16} weight="light" />}
          >
            Proceed to payment
          </ButtonAction>
        </div>
      )}
      {booking.paymentStatus === "paid" && (
        <div className="booking-detail-section">
          <span
            className="inline-flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium"
            style={{ background: "var(--status-success-light)", color: "var(--status-success-main)" }}
          >
            <CheckCircle size={14} weight="fill" />
            Paid
          </span>
        </div>
      )}

      {/* Review — completed bookings only (owner perspective) */}
      {booking.status === "completed" && booking.ownerId === "shawn" && (
        <ReviewSection booking={booking} />
      )}

      {/* Contract meta */}
      <div className="booking-detail-section booking-detail-meta">
        <p className="booking-detail-section-title">Contract</p>
        <p className="booking-detail-meta-row">
          <strong>Signed</strong> · {formatSignedAt(booking.signedAt)}
        </p>
        <p className="booking-detail-meta-row">
          <strong>Booking ID</strong> · {booking.id}
        </p>
        {booking.conversationId && (
          <Link
            href={`/inbox/${booking.conversationId}`}
            className="booking-detail-thread-link"
          >
            <ChatCircleDots size={16} weight="regular" />
            View conversation
            <ArrowRight size={14} weight="bold" />
          </Link>
        )}
      </div>
    </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle, MapPin, CalendarDots } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBookings } from "@/contexts/BookingsContext";
import { mockMeets, setMeetRsvp } from "@/lib/mockMeets";
import { getMeetOccurrences } from "@/lib/meetUtils";
import type { CarerMeetServiceConfig, Meet } from "@/lib/types";

/**
 * BookSessionSheet — the single booking flow for Meet-type services
 * (Service ↔ Meet Linkage, Workstream C).
 *
 * Reached from two doorways, same sheet:
 *  - the carer's Services tab (a Meet-service card's Book CTA — no meet
 *    pre-seed; the picker spans every occurrence of every linked meet),
 *  - a linked meet's detail page (pre-seeded with that meet — the picker
 *    is scoped to that meet's occurrences).
 *
 * On confirm it does two things: creates a real `Booking` record (with
 * `meetBooking` set) via `BookingsContext`, and adds the owner to the
 * meet occurrence's roster via `setMeetRsvp`. The booking surfaces on
 * `/bookings` as a row that routes back to the meet.
 */
export type BookSessionSheetProps = {
  open: boolean;
  onClose: () => void;
  /** The Meet-type service being booked. */
  service: CarerMeetServiceConfig;
  /** The carer who owns the service. */
  carer: { id: string; name: string; avatarUrl: string };
  /** When opened from a meet detail page — scopes the picker to this meet. */
  preselectedMeetId?: string;
  /** When opened from a specific occurrence row — default-selects that date. */
  preselectedDate?: string;
  /** Fired after the booking commits (Booking created + roster updated) so
   *  the caller can sync any local RSVP state. */
  onBooked?: (meetId: string, date: string) => void;
};

type Occurrence = { meet: Meet; date: string };

function formatOccurrence(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${label} · ${time}`;
}

export function BookSessionSheet({
  open,
  onClose,
  service,
  carer,
  preselectedMeetId,
  preselectedDate,
  onBooked,
}: BookSessionSheetProps) {
  const viewer = useCurrentUser();
  const { createBooking } = useBookings();

  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Reset on close so reopening doesn't flash the previous success state.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("form");
        setMessage("");
        setSelectedKey(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Upcoming occurrences across the service's linked meets. When opened
  // from a meet detail page, scope to that meet only (the C4 doorway).
  const occurrences: Occurrence[] = useMemo(() => {
    const meetIds = preselectedMeetId
      ? service.linkedMeetIds.filter((id) => id === preselectedMeetId)
      : service.linkedMeetIds;
    const out: Occurrence[] = [];
    for (const id of meetIds) {
      const meet = mockMeets.find((m) => m.id === id);
      if (!meet || meet.status === "cancelled") continue;
      for (const occ of getMeetOccurrences(meet, 6)) {
        out.push({ meet: occ.meet, date: occ.date });
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  }, [service.linkedMeetIds, preselectedMeetId]);

  // Default-select: the pre-tapped occurrence if one was passed, else the
  // soonest. `selectedKey` (user picked a row) always wins once set.
  const defaultKey = useMemo(() => {
    if (preselectedDate) {
      const match = occurrences.find((o) => o.date === preselectedDate);
      if (match) return `${match.meet.id}::${match.date}`;
    }
    return occurrences[0]
      ? `${occurrences[0].meet.id}::${occurrences[0].date}`
      : null;
  }, [occurrences, preselectedDate]);
  const effectiveKey = selectedKey ?? defaultKey;
  const selected = occurrences.find(
    (o) => `${o.meet.id}::${o.date}` === effectiveKey,
  );

  const priceLabel = `${service.pricePerSession.toLocaleString()} Kč`;

  function handleConfirm() {
    if (!selected) return;
    createBooking({
      conversationId: null,
      ownerId: viewer.id,
      ownerName: `${viewer.firstName} ${viewer.lastName}`,
      ownerAvatarUrl: viewer.avatarUrl,
      carerId: carer.id,
      carerName: carer.name,
      carerAvatarUrl: carer.avatarUrl,
      type: "one_off",
      meetBooking: {
        serviceId: service.id,
        serviceTitle: service.title,
        meetId: selected.meet.id,
        occurrenceDate: selected.date,
      },
      subService: null,
      pets: viewer.pets.map((p) => p.name),
      startDate: selected.date,
      endDate: null,
      ownerNotes: message.trim() || undefined,
      price: {
        lineItems: [
          {
            label: service.title,
            amount: service.pricePerSession,
            unit: "per session",
          },
        ],
        total: service.pricePerSession,
        currency: "Kč",
        billingCycle: "per_session",
      },
      status: "upcoming",
    });
    // Add the owner to the meet occurrence's roster.
    setMeetRsvp(selected.meet, viewer, selected.date, "going");
    onBooked?.(selected.meet.id, selected.date);
    setStep("success");
  }

  const footer =
    step === "form" ? (
      <div className="flex items-center justify-end gap-sm w-full">
        <ButtonAction variant="tertiary" size="md" onClick={onClose}>
          Cancel
        </ButtonAction>
        <ButtonAction
          variant="primary"
          size="md"
          onClick={handleConfirm}
          disabled={!selected}
        >
          Book — {priceLabel}
        </ButtonAction>
      </div>
    ) : (
      <div className="flex items-center justify-end w-full">
        <ButtonAction variant="primary" size="md" onClick={onClose}>
          Done
        </ButtonAction>
      </div>
    );

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={step === "form" ? "Book a session" : "You're booked"}
      footer={footer}
    >
      {step === "form" ? (
        <div className="flex flex-col gap-md p-md">
          {/* Service + carer summary */}
          <div className="flex items-center gap-sm rounded-panel p-md bg-surface-base">
            <img
              src={carer.avatarUrl}
              alt={carer.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col gap-xs flex-1 min-w-0">
              <span className="text-sm font-semibold text-fg-primary">
                {service.title}
              </span>
              <span className="text-xs text-fg-tertiary">with {carer.name}</span>
            </div>
            <span className="text-base font-semibold text-fg-primary shrink-0">
              {priceLabel}
            </span>
          </div>

          {/* Session picker */}
          {occurrences.length === 0 ? (
            <p className="text-sm text-fg-secondary m-0">
              No upcoming sessions are scheduled for this service yet. Check
              back soon or message {carer.name.split(" ")[0]} to arrange one.
            </p>
          ) : (
            <div className="flex flex-col gap-xs">
              <span className="text-sm font-medium text-fg-primary">
                {occurrences.length === 1 ? "Session" : "Pick a session"}
              </span>
              {/* Capped + scrollable so the optional-message field below
                  stays in view without scrolling the whole sheet — a peek
                  of the next row signals there's more. 2026-05-16. */}
              <div
                className="flex flex-col gap-xs"
                style={{ maxHeight: 244, overflowY: "auto" }}
              >
                {occurrences.map((occ) => {
                  const key = `${occ.meet.id}::${occ.date}`;
                  const isSelected = key === effectiveKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      aria-pressed={isSelected}
                      className={`flex flex-col gap-xs rounded-form border p-md text-left ${
                        isSelected
                          ? "border-brand-main bg-brand-subtle"
                          : "border-edge-regular bg-surface-top"
                      }`}
                    >
                      {/* Date row — calendar icon leads, in a fixed-width box
                          so it aligns (centre + text start) with the location
                          pin on the row below. */}
                      <span className="flex items-center gap-xs">
                        <span
                          className="flex justify-center shrink-0"
                          style={{ width: 16 }}
                        >
                          <CalendarDots
                            size={16}
                            weight={isSelected ? "fill" : "light"}
                            className={
                              isSelected ? "text-brand-strong" : "text-fg-tertiary"
                            }
                          />
                        </span>
                        <span className="text-sm font-semibold text-fg-primary">
                          {formatOccurrence(occ.date, occ.meet.time)}
                        </span>
                      </span>
                      {/* Location row */}
                      <span className="flex items-center gap-xs">
                        <span
                          className="flex justify-center shrink-0"
                          style={{ width: 16 }}
                        >
                          <MapPin
                            size={12}
                            weight="light"
                            className="text-fg-tertiary"
                          />
                        </span>
                        <span className="text-xs text-fg-tertiary min-w-0">
                          {occ.meet.title}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional message */}
          {occurrences.length > 0 && (
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="book-session-message"
                className="text-sm font-medium text-fg-primary"
              >
                Message{" "}
                <span className="text-fg-tertiary font-normal">(optional)</span>
              </label>
              <textarea
                id="book-session-message"
                className="textarea resize-none"
                placeholder="Anything the host should know about your dog?"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-md p-xl text-center">
          <CheckCircle size={56} weight="fill" className="text-brand-main" />
          <div className="flex flex-col gap-xs">
            <span className="font-heading text-lg font-semibold text-fg-primary">
              You&apos;re booked
            </span>
            <span className="text-sm text-fg-secondary">
              {selected
                ? `${service.title} — ${formatOccurrence(selected.date, selected.meet.time)}. It's on your bookings, and you'll see it on the meet.`
                : "Your session is confirmed."}
            </span>
          </div>
          {selected && (
            <span className="text-sm text-fg-tertiary">
              {selected.meet.location} · {priceLabel} · paid on the day
            </span>
          )}
        </div>
      )}
    </ModalSheet>
  );
}

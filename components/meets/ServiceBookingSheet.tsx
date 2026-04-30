"use client";

import { useState, useEffect } from "react";
import { CheckCircle, CalendarDots, Clock, MapPin } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { Meet } from "@/lib/types";

/**
 * ServiceBookingSheet — lightweight "book this scheduled session" flow.
 *
 * Different from `BookingModal` (open-ended provider booking with date-range
 * + service picker). Here the user has already picked a specific session by
 * tapping a Book button on a meet detail page; the sheet exists to confirm
 * + capture an optional message + show success.
 *
 * Triggered by:
 *  - One-off care-group meets — top "Book this session" CTA on the service
 *    info card
 *  - Recurring care-group meets — per-occurrence Book button in the
 *    Upcoming dates section
 *
 * For recurring meets, callers pass `occurrenceDate` so the confirmation
 * shows the specific Wednesday/Saturday/etc. the user is booking, not the
 * series anchor date.
 *
 * Demo only: no actual booking is created. Success state simulates the
 * confirmation experience.
 */
export type ServiceBookingSheetProps = {
  open: boolean;
  onClose: () => void;
  meet: Meet;
  /**
   * The specific date being booked. For recurring meets this is the
   * tapped occurrence; for one-off it should match `meet.date`.
   */
  occurrenceDate: string;
  /**
   * Optional — fires when the user confirms the booking (after the
   * Confirm button click, before the success state shows). Used to flip
   * the calling row to a Booked state. Receives the occurrence date so
   * recurring meets can update the right per-date entry.
   */
  onConfirmed?: (date: string) => void;
};

function formatLongDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

export function ServiceBookingSheet({
  open,
  onClose,
  meet,
  occurrenceDate,
  onConfirmed,
}: ServiceBookingSheetProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [message, setMessage] = useState("");

  // Reset state when sheet closes — otherwise reopening shows the success
  // screen from the previous booking which is confusing.
  useEffect(() => {
    if (!open) {
      // Small delay so the close animation doesn't show the form flash back
      const t = setTimeout(() => {
        setStep("form");
        setMessage("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const service = meet.serviceCTA;
  if (!service) return null;

  const dateLabel = formatLongDate(occurrenceDate);
  const durationLabel = formatDuration(meet.durationMinutes);

  const footer =
    step === "form" ? (
      <div className="flex items-center justify-end gap-sm w-full">
        <ButtonAction variant="neutral" size="md" cta onClick={onClose}>
          Cancel
        </ButtonAction>
        <ButtonAction
          variant="primary"
          size="md"
          cta
          onClick={() => {
            onConfirmed?.(occurrenceDate);
            setStep("success");
          }}
        >
          Confirm — {service.price}
        </ButtonAction>
      </div>
    ) : (
      <div className="flex items-center justify-end w-full">
        <ButtonAction variant="primary" size="md" cta onClick={onClose}>
          Done
        </ButtonAction>
      </div>
    );

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={step === "form" ? "Book this session" : "You're booked"}
      footer={footer}
    >
      {step === "form" ? (
        <div className="flex flex-col gap-md p-md">
          {/* Provider + meet summary */}
          <div className="flex items-center gap-sm rounded-panel p-md bg-surface-base">
            <img
              src={meet.creatorAvatarUrl}
              alt={meet.creatorName}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col gap-xs flex-1 min-w-0">
              <span className="text-sm font-semibold text-fg-primary">{meet.title}</span>
              <span className="text-xs text-fg-tertiary">with {meet.creatorName}</span>
            </div>
          </div>

          {/* Session details */}
          <div className="flex flex-col gap-sm rounded-panel border border-edge-regular p-md">
            <div className="flex items-center gap-sm text-sm text-fg-primary">
              <CalendarDots size={16} weight="light" className="text-fg-tertiary shrink-0" />
              <span>{dateLabel}</span>
            </div>
            <div className="flex items-center gap-sm text-sm text-fg-primary">
              <Clock size={16} weight="light" className="text-fg-tertiary shrink-0" />
              <span>
                {meet.time} <span className="text-fg-tertiary">({durationLabel})</span>
              </span>
            </div>
            <div className="flex items-center gap-sm text-sm text-fg-primary">
              <MapPin size={16} weight="light" className="text-fg-tertiary shrink-0" />
              <span>{meet.location}</span>
            </div>
          </div>

          {/* Price line */}
          <div className="flex items-center justify-between gap-sm">
            <span className="text-sm text-fg-secondary">Price</span>
            <span className="text-base font-semibold text-fg-primary">{service.price}</span>
          </div>

          {/* Optional message */}
          <div className="flex flex-col gap-xs">
            <label htmlFor="booking-message" className="text-sm font-medium text-fg-primary">
              Message <span className="text-fg-tertiary font-normal">(optional)</span>
            </label>
            <textarea
              id="booking-message"
              className="textarea resize-none"
              placeholder="Anything the host should know about your dog?"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-md p-xl text-center">
          <CheckCircle size={56} weight="fill" className="text-brand-main" />
          <div className="flex flex-col gap-xs">
            <span className="font-heading text-lg font-semibold text-fg-primary">
              See you {dateLabel.replace(/^[A-Z][a-z]+, /, "")}
            </span>
            <span className="text-sm text-fg-secondary">
              Your booking is confirmed. {meet.creatorName} will send any prep details closer to the day.
            </span>
          </div>
          <div className="flex flex-col gap-xs items-center text-sm text-fg-tertiary">
            <span>{meet.time} · {meet.location}</span>
            <span>{service.price} · paid on the day</span>
          </div>
        </div>
      )}
    </ModalSheet>
  );
}

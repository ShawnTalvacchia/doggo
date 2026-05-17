"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle, CalendarDots } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBookings } from "@/contexts/BookingsContext";
import { getMeetOccurrences } from "@/lib/meetUtils";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { CarerCareServiceConfig, Meet } from "@/lib/types";

/**
 * DropoffBookingSheet — booking flow for a drop-off **Care** service linked
 * to a free community-walk meet (Service ↔ Meet Linkage, config #2).
 *
 * The owner picks a date from the meet's schedule and books the carer to
 * walk their dog. Crucially this is **book ≠ attend**: on confirm it creates
 * a Care `Booking` and does **NOT** add the owner to the meet roster — they
 * don't come along, only their dog does (with the carer). That's the whole
 * distinction from `BookSessionSheet` (Meet-type sessions, where booking IS
 * the RSVP). 2026-05-17.
 */
export type DropoffBookingSheetProps = {
  open: boolean;
  onClose: () => void;
  /** The drop-off Care service being booked. */
  service: CarerCareServiceConfig;
  /** The carer who owns the service. */
  carer: { id: string; name: string; avatarUrl: string };
  /** The free meet whose schedule the drop-off walk runs on. */
  meet: Meet;
  /** Fired after the booking commits. */
  onBooked?: () => void;
};

function formatOccurrence(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${label} · ${time}`;
}

export function DropoffBookingSheet({
  open,
  onClose,
  service,
  carer,
  meet,
  onBooked,
}: DropoffBookingSheetProps) {
  const viewer = useCurrentUser();
  const { createBooking } = useBookings();

  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("form");
        setMessage("");
        setSelectedDate(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Dates the drop-off walk can be booked for — the meet's upcoming run.
  const dates = useMemo(
    () => getMeetOccurrences(meet, 6).map((o) => o.date),
    [meet],
  );
  const effectiveDate = selectedDate ?? dates[0] ?? null;

  const priceLabel = `${service.pricePerUnit.toLocaleString()} Kč`;
  const dogLabel =
    viewer.pets.map((p) => p.name).join(" & ") || "your dog";

  function handleConfirm() {
    if (!effectiveDate) return;
    // A Care `Booking` — NOT a `meetBooking`, and no `setMeetRsvp`. The
    // owner isn't a meet attendee; only their dog is walked.
    createBooking({
      conversationId: null,
      ownerId: viewer.id,
      ownerName: `${viewer.firstName} ${viewer.lastName}`,
      ownerAvatarUrl: viewer.avatarUrl,
      carerId: carer.id,
      carerName: carer.name,
      carerAvatarUrl: carer.avatarUrl,
      type: "one_off",
      // Config #2 link — book ≠ attend, so this is the *only* trace back
      // to the meet (no `meetBooking`, no roster entry). Meet surfaces read
      // it to show "Drop-off booked" on the occurrence row.
      dropoffMeetId: meet.id,
      serviceType: service.serviceType,
      subService: "Group walk",
      pets: viewer.pets.map((p) => p.name),
      startDate: effectiveDate,
      endDate: null,
      ownerNotes: message.trim() || undefined,
      price: {
        lineItems: [
          {
            label: "Group walk",
            amount: service.pricePerUnit,
            unit: "per walk",
          },
        ],
        total: service.pricePerUnit,
        currency: "Kč",
        billingCycle: "total",
      },
      status: "upcoming",
    });
    onBooked?.();
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
          disabled={!effectiveDate}
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
      title={step === "form" ? "Book a drop-off walk" : "You're booked"}
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
                {carer.name.split(" ")[0]} walks {dogLabel}
              </span>
              <span className="text-xs text-fg-tertiary">
                {SERVICE_LABELS[service.serviceType]} · drop-off — you don&apos;t
                come along
              </span>
            </div>
            <span className="text-base font-semibold text-fg-primary shrink-0">
              {priceLabel}
            </span>
          </div>

          {/* Date picker — the meet's upcoming run */}
          {dates.length === 0 ? (
            <p className="text-sm text-fg-secondary m-0">
              No upcoming walks are scheduled. Check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-xs">
              <span className="text-sm font-medium text-fg-primary">
                Pick a date
              </span>
              <div
                className="flex flex-col gap-xs"
                style={{ maxHeight: 244, overflowY: "auto" }}
              >
                {dates.map((date) => {
                  const isSelected = date === effectiveDate;
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-xs rounded-form border p-md text-left ${
                        isSelected
                          ? "border-brand-main bg-brand-subtle"
                          : "border-edge-regular bg-surface-top"
                      }`}
                    >
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
                        {formatOccurrence(date, meet.time)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional message */}
          {dates.length > 0 && (
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="dropoff-message"
                className="text-sm font-medium text-fg-primary"
              >
                Message{" "}
                <span className="text-fg-tertiary font-normal">(optional)</span>
              </label>
              <textarea
                id="dropoff-message"
                className="textarea resize-none"
                placeholder="Anything the carer should know about your dog?"
                rows={2}
                style={{ minHeight: 56 }}
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
            {effectiveDate && (
              <>
                <span className="text-sm font-semibold text-fg-primary">
                  {carer.name.split(" ")[0]} walks {dogLabel} —{" "}
                  {formatOccurrence(effectiveDate, meet.time)}
                </span>
                <span className="text-sm text-fg-secondary">
                  It&apos;s on your bookings — you don&apos;t need to come; she&apos;ll
                  send a report after the walk.
                </span>
              </>
            )}
          </div>
          {effectiveDate && (
            <div className="flex flex-col gap-tiny">
              <span className="text-sm text-fg-tertiary">{meet.location}</span>
              <span className="text-sm text-fg-tertiary">
                {priceLabel} · paid on the day
              </span>
            </div>
          )}
        </div>
      )}
    </ModalSheet>
  );
}

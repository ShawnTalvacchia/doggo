"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { CheckCircle, CalendarDots, ArrowRight, MapPin } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBookings } from "@/contexts/BookingsContext";
import { getMeetOccurrences } from "@/lib/meetUtils";
import type {
  CarerCareServiceConfig,
  Meet,
  WalkDeliveryMethod,
} from "@/lib/types";

/**
 * LinkedWalkBookingSheet — booking flow for a *linked-care* Walks & Check-ins
 * service that runs on a free community-walk meet (Service ↔ Meet Linkage,
 * config #2 — see [[Groups & Care Model]] → Service ↔ Meet linkage).
 *
 * The owner picks a date from the meet's schedule + a delivery method
 * (pickup vs drop-off, when the carer offers both) and books the carer to
 * walk their dog. **Book ≠ attend:** on confirm this creates a Care
 * `Booking` and does NOT add the owner to the meet roster — they don't come
 * along, only their dog does (with the carer). That's the whole distinction
 * from `BookSessionSheet` (Meet-type sessions, where booking IS the RSVP).
 *
 * Renamed from `DropoffBookingSheet` in the Walk Service Delivery phase
 * (2026-05-20). Previously the sheet's title + copy used "drop-off" to mean
 * the config-#2 booking shape; that collided with the literal delivery method
 * (pickup vs drop-off — who travels for the handoff). The two are now
 * separate concerns: this sheet is *about* the linked-care booking shape;
 * delivery is one of the choices inside it.
 */
export type LinkedWalkBookingSheetProps = {
  open: boolean;
  onClose: () => void;
  /** The Walks & Check-ins Care service being booked. */
  service: CarerCareServiceConfig;
  /** The carer who owns the service. */
  carer: { id: string; name: string; avatarUrl: string };
  /** The free meet whose schedule the walk runs on. */
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

/** Resolve the available delivery options + the default selected method.
 *  Pickup default per Walk Service Delivery Q3 (research-backed: most owners
 *  prefer pickup; the cheaper drop-off becomes a happy surprise on
 *  selection). When the service has no `deliveryOptions[]`, falls back to a
 *  single drop-off at `pricePerUnit` so legacy data renders unchanged. */
function resolveDeliveryState(service: CarerCareServiceConfig): {
  options: { method: WalkDeliveryMethod; price: number }[];
  defaultMethod: WalkDeliveryMethod;
} {
  const opts = service.deliveryOptions ?? [];
  if (opts.length === 0) {
    return {
      options: [{ method: "dropoff", price: service.pricePerUnit }],
      defaultMethod: "dropoff",
    };
  }
  const hasPickup = opts.some((o) => o.method === "pickup");
  return {
    options: opts,
    defaultMethod: hasPickup ? "pickup" : opts[0].method,
  };
}

export function LinkedWalkBookingSheet({
  open,
  onClose,
  service,
  carer,
  meet,
  onBooked,
}: LinkedWalkBookingSheetProps) {
  const viewer = useCurrentUser();
  const { createBooking } = useBookings();

  const { options: rawOptions, defaultMethod } = useMemo(
    () => resolveDeliveryState(service),
    [service],
  );
  // Pickup-first sort so the default-selected option leads the row,
  // matching `LinkedCareCallout`'s order. Don't mutate; copy first.
  const deliveryOptions = useMemo(
    () =>
      rawOptions.slice().sort((a, b) => {
        if (a.method === b.method) return 0;
        return a.method === "pickup" ? -1 : 1;
      }),
    [rawOptions],
  );

  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] =
    useState<WalkDeliveryMethod>(defaultMethod);
  // Owner's handoff-location override. Empty = use the method's default
  // (their area for pickup; the meet's park for drop-off). Reset whenever
  // the method changes so the default re-resolves. C2, 2026-06-15.
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("form");
        setMessage("");
        setSelectedDate(null);
        setSelectedDelivery(defaultMethod);
        setDeliveryLocation("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open, defaultMethod]);

  // Dates the walk can be booked for — the meet's upcoming run.
  const dates = useMemo(
    () => getMeetOccurrences(meet, 6).map((o) => o.date),
    [meet],
  );
  const effectiveDate = selectedDate ?? dates[0] ?? null;

  const chosenOption =
    deliveryOptions.find((d) => d.method === selectedDelivery) ??
    deliveryOptions[0];
  const priceLabel = `${chosenOption.price.toLocaleString()} Kč`;
  const dogLabel =
    viewer.pets.map((p) => p.name).join(" & ") || "your dog";
  const meetSpotLabel = meet.location.split(",")[0];
  const carerFirst = carer.name.split(" ")[0];

  // Handoff location — event-aware default (C2, 2026-06-15). Pickup defaults
  // to the owner's area; drop-off defaults to the linked meet's park (this is
  // a meet-linked walk, so the park IS the natural drop point). The owner can
  // type a different spot — a proposal the carer reviews.
  const defaultLocation =
    selectedDelivery === "pickup"
      ? viewer.neighbourhood || "Your address"
      : meetSpotLabel;
  const effectiveLocation = deliveryLocation.trim() || defaultLocation;

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
      // Linked-care booking (config #2) — book ≠ attend, so this is the
      // *only* trace back to the meet (no `meetBooking`, no roster entry).
      // Meet surfaces read it to show "Walk booked" on the occurrence row.
      dropoffMeetId: meet.id,
      serviceType: service.serviceType,
      delivery: selectedDelivery,
      deliveryLocation: effectiveLocation,
      subService: "Small-group walk",
      pets: viewer.pets.map((p) => p.name),
      startDate: effectiveDate,
      endDate: null,
      ownerNotes: message.trim() || undefined,
      price: {
        lineItems: [
          {
            label: `Small-group walk (${selectedDelivery === "pickup" ? "pickup" : "drop-off"})`,
            amount: chosenOption.price,
            unit: "per walk",
          },
        ],
        total: chosenOption.price,
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
      title={step === "form" ? "Book a walk" : "You're booked"}
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
                {carerFirst} walks {dogLabel}
              </span>
              {/* Config #2 framing: the dog joins the carer's community group
                  walk; the owner stays home. Don't surface the raw
                  "Walks & Check-ins" service label here — it reads as a
                  check-in, which this isn't. Name the walk instead. */}
              <span className="text-xs text-fg-tertiary">
                On the {meetSpotLabel} group walk · no need to come along
              </span>
            </div>
            <span className="text-base font-semibold text-fg-primary shrink-0">
              {priceLabel}
            </span>
          </div>

          {/* Pivot to the carer's full catalogue. This sheet books one
              service; a curious owner can jump to everything the carer offers
              (training, sitting, etc.) rather than dead-ending here. Closes
              the sheet on the way out. 2026-05-22. */}
          <Link
            href={`/profile/${carer.id}?tab=services`}
            onClick={onClose}
            className="self-start inline-flex items-center gap-tiny text-xs font-semibold text-info-strong"
          >
            View all of {carerFirst}&apos;s services
            <ArrowRight size={12} weight="bold" aria-hidden="true" />
          </Link>

          {/* Delivery picker — uses the canonical `MultiSelectSegmentBar`
              pattern (same as Available times / Repeat-weekly days in
              FilterBody). Single-select usage: `selectedValues` always
              carries exactly one method; `onToggle` replaces rather than
              toggles. The "form" variant gives neutral active styling —
              this is a commit-context picker, not exploratory filtering,
              and stays away from the brand-tinted "filter" variant.
              Surfaces only when the carer offers more than one method;
              single-option services skip it. Walk Service Delivery, 2026-05-20. */}
          {deliveryOptions.length > 1 && (
            <div className="flex flex-col gap-xs">
              <span className="text-sm font-medium text-fg-primary">
                Pickup or drop-off?
              </span>
              <MultiSelectSegmentBar<WalkDeliveryMethod>
                ariaLabel="Delivery method"
                options={deliveryOptions.map((opt) => ({
                  value: opt.method,
                  label: opt.method === "pickup" ? "Pickup" : "Drop-off",
                  subLabel: `${opt.price.toLocaleString()} Kč`,
                }))}
                selectedValues={[selectedDelivery]}
                onToggle={(method) => {
                  setSelectedDelivery(method);
                  // Drop the override so the new method's default re-resolves.
                  setDeliveryLocation("");
                }}
              />
              <span className="text-xs text-fg-tertiary">
                {selectedDelivery === "pickup"
                  ? `${carerFirst} comes to ${viewer.firstName}'s address.`
                  : `Bring ${dogLabel} to ${meetSpotLabel} at the start.`}
              </span>
            </div>
          )}

          {/* Handoff location — event-aware default (C2, 2026-06-15). Pickup
              prefills the owner's area; drop-off prefills the linked meet's
              park. Editable: a non-default value is a proposal the carer
              reviews (fits the existing inquiry → review flow). Single field —
              the chosen method decides what kind of location it is. */}
          <div className="flex flex-col gap-xs">
            <label
              htmlFor="linked-walk-location"
              className="text-sm font-medium text-fg-primary"
            >
              {selectedDelivery === "pickup"
                ? "Pickup address"
                : "Drop-off location"}
            </label>
            <div className="input-with-leading-icon">
              <MapPin
                size={16}
                weight="light"
                className="input-leading-icon"
                aria-hidden="true"
              />
              <input
                id="linked-walk-location"
                type="text"
                className="input"
                value={effectiveLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
              />
            </div>
            <span className="text-xs text-fg-tertiary">
              {selectedDelivery === "pickup"
                ? "Where should the carer collect your dog? Defaults to your area."
                : `Defaults to the walk's spot. Change it if you'll hand off elsewhere.`}
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
                htmlFor="linked-walk-message"
                className="text-sm font-medium text-fg-primary"
              >
                Message{" "}
                <span className="text-fg-tertiary font-normal">(optional)</span>
              </label>
              <textarea
                id="linked-walk-message"
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
                  {carerFirst} walks {dogLabel} —{" "}
                  {formatOccurrence(effectiveDate, meet.time)}
                </span>
                <span className="text-sm text-fg-secondary">
                  {selectedDelivery === "pickup"
                    ? `${carerFirst} picks ${dogLabel} up from ${effectiveLocation}.`
                    : `Bring ${dogLabel} to ${effectiveLocation} at the start of the walk.`}{" "}
                  No need to come along. She&apos;ll send a report afterwards.
                </span>
              </>
            )}
          </div>
          {effectiveDate && (
            <div className="flex flex-col gap-tiny">
              <span className="text-sm text-fg-tertiary">
                {selectedDelivery === "pickup" ? "Pickup" : "Drop-off"} ·{" "}
                {priceLabel} · paid on the day
              </span>
            </div>
          )}
        </div>
      )}
    </ModalSheet>
  );
}

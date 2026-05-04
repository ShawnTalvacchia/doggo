"use client";

import { useState, useEffect } from "react";
import type {
  Conversation,
  ServiceType,
  BookingType,
  RecurringSchedule,
} from "@/lib/types";
import { SUB_SERVICES } from "@/lib/constants/services";
import { DateTrigger, DatePicker, type DateRange } from "@/components/ui/DatePicker";
import { RecurringSchedulePicker } from "@/components/ui/RecurringSchedulePicker";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ── Constants ────────────────────────────────────────────────────────────────

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: "walk_checkin", label: "Walks & Check-ins" },
  { value: "inhome_sitting", label: "In-home Sitting" },
  { value: "boarding", label: "Overnight Boarding" },
];

// No default days — preselecting Mon/Wed/Fri presumes intent. Owner must
// pick days deliberately. Time defaults to a common morning slot since some
// time has to be shown in the picker; user can change it. G3 fix 2026-05-04.
const DEFAULT_SCHEDULE: RecurringSchedule = {
  days: [],
  time: "08:00",
  timeLabel: "8:00–9:00am",
};

// ── Types ────────────────────────────────────────────────────────────────────

export type InquirySubmitData = {
  service: ServiceType;
  subService: string | null;
  pets: string[];
  bookingType: BookingType;
  dateRange: DateRange;
  recurringSchedule: RecurringSchedule | null;
  message: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function InquiryForm({
  conv,
  initialService,
  initialStart,
  initialEnd,
  onSubmit,
}: {
  conv: Conversation;
  initialService: ServiceType | null;
  initialStart: string | null;
  initialEnd: string | null;
  onSubmit: (data: InquirySubmitData) => void;
}) {
  const firstName = conv.providerName.split(" ")[0];
  // Pet checkboxes reflect the active persona's actual pets — read from
  // `useCurrentUser()` rather than the legacy `defaultExploreFilters.pets`
  // constant (which hardcoded ["Spot", "Goldie"] from before persona
  // switching was wired up). G1 fix, 2026-05-04.
  const currentUser = useCurrentUser();
  const allPets = currentUser.pets.map((p) => p.name);

  const [service, setService] = useState<ServiceType>(
    initialService ?? conv.inquiry.serviceType
  );
  const [subService, setSubService] = useState<string | null>(
    conv.inquiry.subService ?? null,
  );
  // Default selection: whatever the modal seeded into `conv.inquiry.pets`
  // (typically all of the user's pets). Falls back to allPets if the conv
  // didn't seed any.
  const [selectedPets, setSelectedPets] = useState<string[]>(
    conv.inquiry.pets.length > 0 ? conv.inquiry.pets : allPets
  );
  const [bookingType, setBookingType] = useState<BookingType>(
    conv.inquiry.bookingType ?? "one_off"
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    start: initialStart ?? conv.inquiry.startDate,
    end: initialEnd ?? conv.inquiry.endDate,
  });
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule>(
    conv.inquiry.recurringSchedule ?? DEFAULT_SCHEDULE
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Free-text "anything else?" notes — optional, empty by default. The
  // structured fields above carry the templated content; this textarea is
  // for context the form doesn't capture (special needs, scheduling
  // preferences, etc.). Discover & Care G2, 2026-05-02.
  const [message, setMessage] = useState("");

  // Reset sub-service when the service axis changes — the previous sub no
  // longer applies.
  useEffect(() => {
    setSubService(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  function togglePet(pet: string) {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  }

  // Submit gates on the structured inputs that the inquiry needs to be
  // actionable. Sub-service is required when the chosen service has options
  // (Walks → Group walk / Solo walk / Drop-in are differently priced and
  // structured — the carer can't propose without knowing which). For
  // ongoing bookings, at least one day must be selected — an "ongoing"
  // request with zero days is meaningless. For one-off bookings, a start
  // date is always required, plus an end > start when the service is
  // boarding (overnight needs ≥ 1 night). The "Anything else?" textarea
  // is optional and never blocks Send.
  const subOptions = SUB_SERVICES[service];
  const oneOffDatesValid =
    bookingType !== "one_off" ||
    (dateRange.start !== null &&
      (service !== "boarding" ||
        (dateRange.end !== null && dateRange.end > dateRange.start)));
  const canSubmit =
    selectedPets.length > 0 &&
    (subOptions.length === 0 || subService !== null) &&
    (bookingType !== "ongoing" || recurringSchedule.days.length > 0) &&
    oneOffDatesValid;

  return (
    <div className="inbox-inquiry-form">
      {/* Your Pets */}
      <div className="filter-field">
        <div className="label">Your pets</div>
        <div className="filter-pet-row">
          {allPets.map((pet) => (
            <label key={pet} className="filter-inline-check">
              <input
                type="checkbox"
                checked={selectedPets.includes(pet)}
                onChange={() => togglePet(pet)}
              />
              {pet}
            </label>
          ))}
        </div>
      </div>

      {/* Service type */}
      <div className="filter-field">
        <div className="label">Service</div>
        <div className="inq-service-row">
          {SERVICE_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-option-card inq-service-card${service === opt.value ? " active" : ""}`}
              onClick={() => {
                setService(opt.value);
                setSubService(null);
              }}
            >
              <strong>{opt.label}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-service */}
      <div className="filter-field">
        <div className="label">What specifically?</div>
        <div className="inq-sub-row">
          {subOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`filter-option-card inq-sub-card${subService === opt ? " active" : ""}`}
              onClick={() => setSubService((prev) => (prev === opt ? null : opt))}
            >
              <strong>{opt}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* How often? — markup mirrors Discover's filter pattern (filter-visit-row
          + filter-option-card with strong + span). Same shared CSS, same
          copy, so users see one consistent affordance across surfaces. G3
          fix 2026-05-04. */}
      <div className="filter-field">
        <div className="label">How often?</div>
        <div className="filter-visit-row">
          <button
            type="button"
            className={`filter-option-card${bookingType === "one_off" ? " active" : ""}`}
            onClick={() => setBookingType("one_off")}
          >
            <strong>One Time</strong>
            <span>Daily visits for a short period</span>
          </button>
          <button
            type="button"
            className={`filter-option-card${bookingType === "ongoing" ? " active" : ""}`}
            onClick={() => setBookingType("ongoing")}
          >
            <strong>Repeat Weekly</strong>
            <span>Ongoing weekly schedule</span>
          </button>
        </div>
      </div>

      {/* Dates (one-off) or Schedule (ongoing). Single-day allowed for walks
          and sitting; boarding requires a multi-day range (overnight implies
          ≥1 night). G3 fix 2026-05-04. */}
      {bookingType === "one_off" ? (
        <div className="filter-field">
          <div className="label">Dates</div>
          <DateTrigger
            label="Select dates"
            value={dateRange}
            onClick={() => setDatePickerOpen(true)}
          />
          <DatePicker
            mode="range"
            minRangeDays={service === "boarding" ? 2 : 1}
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
            value={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setDatePickerOpen(false);
            }}
            title="Dates"
          />
        </div>
      ) : (
        // RecurringSchedulePicker self-labels its two sub-sections ("For
        // which days?" + "Time"), so no outer wrapper label needed.
        <RecurringSchedulePicker
          value={recurringSchedule}
          onChange={setRecurringSchedule}
        />
      )}

      {/* Optional notes — context the form doesn't capture (special needs,
          scheduling preferences). Renders alongside the InquiryCard on send. */}
      <div className="filter-field">
        <div className="label" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
          <span>Anything else?</span>
          <span className="text-fg-tertiary text-xs font-normal">Optional</span>
        </div>
        <textarea
          className="input inq-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Optional notes for provider"
          placeholder={`Tell ${firstName} anything specific about your dog or schedule…`}
        />
      </div>

      {/* Submit */}
      <button
        className="inq-submit"
        disabled={!canSubmit}
        onClick={() =>
          onSubmit({
            service,
            subService,
            pets: selectedPets,
            bookingType,
            dateRange,
            recurringSchedule: bookingType === "ongoing" ? recurringSchedule : null,
            message,
          })
        }
      >
        Send inquiry →
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import type {
  Conversation,
  ServiceType,
  BookingType,
  RecurringSchedule,
} from "@/lib/types";
import { SERVICE_LABELS, SUB_SERVICES } from "@/lib/constants/services";
import { DateTrigger, DatePicker, type DateRange } from "@/components/ui/DatePicker";
import { RecurringSchedulePicker } from "@/components/ui/RecurringSchedulePicker";
import { defaultExploreFilters } from "@/lib/mockData";

// ── Constants ────────────────────────────────────────────────────────────────

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: "walk_checkin", label: "Walks & Check-ins" },
  { value: "inhome_sitting", label: "In-home Sitting" },
  { value: "boarding", label: "Overnight Boarding" },
];

const DEFAULT_SCHEDULE: RecurringSchedule = {
  days: ["Mon", "Wed", "Fri"],
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
  const allPets = defaultExploreFilters.pets; // ["Spot", "Goldie"]

  const [service, setService] = useState<ServiceType>(
    initialService ?? conv.inquiry.serviceType
  );
  const [subService, setSubService] = useState<string | null>(null);
  const [selectedPets, setSelectedPets] = useState<string[]>(allPets);
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

  function buildMessage(
    svc: ServiceType,
    sub: string | null,
    pets: string[],
    bType: BookingType
  ): string {
    const svcLabel = SERVICE_LABELS[svc].toLowerCase();
    const petStr = pets.length === 1 ? `my dog ${pets[0]}` : `my dogs ${pets.join(" and ")}`;
    const subStr = sub ? ` (${sub})` : "";
    const freqStr = bType === "ongoing" ? " on a regular basis" : "";
    return `Hi ${firstName}, I'm looking for ${svcLabel}${subStr}${freqStr} for ${petStr}. Are you available?`;
  }

  const [message, setMessage] = useState(() =>
    buildMessage(service, subService, selectedPets, bookingType)
  );

  // Reset sub-service and rebuild message on service change
  useEffect(() => {
    setSubService(null);
    setMessage(buildMessage(service, null, selectedPets, bookingType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  // Rebuild message when sub-service, pets, or booking type change
  useEffect(() => {
    setMessage(buildMessage(service, subService, selectedPets, bookingType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subService, selectedPets, bookingType]);

  function togglePet(pet: string) {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  }

  const canSubmit = selectedPets.length > 0 && message.trim().length > 0;
  const subOptions = SUB_SERVICES[service];

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

      {/* One time / Ongoing */}
      <div className="filter-field">
        <div className="label">Frequency</div>
        <div className="inq-type-row">
          <button
            type="button"
            className={`filter-option-card inq-type-card${bookingType === "one_off" ? " active" : ""}`}
            onClick={() => setBookingType("one_off")}
          >
            <strong>One time</strong>
            <span className="inq-type-sub">Holiday, one-off stay</span>
          </button>
          <button
            type="button"
            className={`filter-option-card inq-type-card${bookingType === "ongoing" ? " active" : ""}`}
            onClick={() => setBookingType("ongoing")}
          >
            <strong>Ongoing</strong>
            <span className="inq-type-sub">Regular schedule</span>
          </button>
        </div>
      </div>

      {/* Dates (one-off) or Schedule (ongoing) */}
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
        <div className="filter-field">
          <div className="label">Schedule</div>
          <RecurringSchedulePicker
            value={recurringSchedule}
            onChange={setRecurringSchedule}
          />
        </div>
      )}

      {/* Message */}
      <div className="filter-field">
        <div className="label">Message</div>
        <textarea
          className="input inq-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Message to provider"
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

"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  Conversation,
  ServiceType,
  BookingType,
  RecurringSchedule,
  CarerCareServiceConfig,
  DayCareDuration,
  InquiryDetails,
} from "@/lib/types";
import { SUB_SERVICES } from "@/lib/constants/services";
import { DateTrigger, DatePicker, type DateRange } from "@/components/ui/DatePicker";
import { RecurringSchedulePicker } from "@/components/ui/RecurringSchedulePicker";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getUserById } from "@/lib/mockUsers";
import { computeQuote } from "@/lib/pricing";

// ── Constants ────────────────────────────────────────────────────────────────

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  walks_checkins: "Walks & Check-ins",
  house_sitting: "House sitting",
  day_care: "Day care",
  boarding: "Boarding",
};

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
  /** For ongoing bookings, the date the recurring schedule should start
   *  from. Optional — provider can ask if not set, but useful to capture
   *  when the owner has a target. Pricing & Proposals walkthrough
   *  2026-05-05. */
  ongoingStart: string | null;
  recurringSchedule: RecurringSchedule | null;
  /** Day-care only: chosen duration when the carer offers a half-day
   *  price. Carried into the inquiry → proposal → booking chain.
   *  Half-day Care, 2026-06-07. */
  dayCareDuration?: DayCareDuration;
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

  // Service + sub-service options come from the carer's actual catalogue —
  // not the global SERVICE_TYPES / SUB_SERVICES constants. A carer who only
  // offers sitting shouldn't see Walks + Boarding picker tiles. When a
  // single service is offered (or the entry CTA already pre-selected one),
  // the picker collapses entirely. Pricing & Proposals, 2026-05-04.
  const provider = getUserById(conv.providerId);
  const carerCareServices: CarerCareServiceConfig[] = useMemo(
    () =>
      (provider?.carerProfile?.services ?? []).filter(
        (s): s is CarerCareServiceConfig => s.kind === "care" && s.enabled,
      ),
    [provider],
  );
  const carerServiceTypes = carerCareServices.map((s) => s.serviceType);

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
  // Day-care duration — only meaningful when the active service is day_care
  // AND the carer offers a half-day price via `durationOptions`. Defaults
  // to full_day so the live estimate has something to compute against;
  // owner can toggle to half_day. Half-day Care, 2026-06-07.
  const [dayCareDuration, setDayCareDuration] = useState<DayCareDuration>(
    conv.inquiry.dayCareDuration ?? "full_day",
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    start: initialStart ?? conv.inquiry.startDate,
    end: initialEnd ?? conv.inquiry.endDate,
  });
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule>(
    conv.inquiry.recurringSchedule ?? DEFAULT_SCHEDULE
  );
  // Separate from dateRange — that's only used for one-off bookings (start
  // + end). Ongoing bookings need a single "start from" date that sits
  // alongside the recurring schedule. Pricing & Proposals walkthrough
  // 2026-05-05.
  const [ongoingStart, setOngoingStart] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [ongoingDatePickerOpen, setOngoingDatePickerOpen] = useState(false);

  // Free-text "anything else?" notes — optional, empty by default. The
  // structured fields above carry the templated content; this textarea is
  // for context the form doesn't capture (special needs, scheduling
  // preferences, etc.). Discover & Care G2, 2026-05-02.
  const [message, setMessage] = useState("");

  // Reset sub-service when the service axis changes — the previous sub no
  // longer applies. When the new service offers exactly one sub-option,
  // auto-select it so the picker (now hidden — see render below) doesn't
  // leave canSubmit unsatisfied. 2026-06-08.
  useEffect(() => {
    const carerSubs =
      carerCareServices.find((s) => s.serviceType === service)?.subServices ?? [];
    const opts = carerSubs.length > 0 ? carerSubs : SUB_SERVICES[service];
    setSubService(opts.length === 1 ? opts[0]! : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  function togglePet(pet: string) {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  }

  // Submit gates on the structured inputs that the inquiry needs to be
  // actionable. Sub-service is required when the chosen service has options
  // (Walks → Small-group walk / Solo walk / Drop-in are differently priced and
  // structured — the carer can't propose without knowing which). For
  // ongoing bookings, at least one day must be selected — an "ongoing"
  // request with zero days is meaningless. For one-off bookings, a start
  // date is always required, plus an end > start when the service is
  // boarding (overnight needs ≥ 1 night). The "Anything else?" textarea
  // is optional and never blocks Send.
  //
  // Sub-options come from the carer's own `subServices` array on this
  // service config — we don't show generic catalogue options the carer
  // doesn't actually offer. Falls back to the global SUB_SERVICES catalogue
  // only if the carer hasn't seeded any (legacy directory entries).
  // Pricing & Proposals, 2026-05-04.
  const carerSubsForService =
    carerCareServices.find((s) => s.serviceType === service)?.subServices ?? [];
  const subOptions = carerSubsForService.length > 0 ? carerSubsForService : SUB_SERVICES[service];
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

  // Real-time estimate — same engine the provider's ProposalForm runs.
  // Surfaces the no-bargaining principle at inquiry time: the price is
  // computed from (carer config × inquiry data), not negotiated. Owner
  // sees the engine respond as they pick dates, pets, frequency. The
  // provider's "Send proposal" then becomes confirmation, not composition.
  // Pricing & Proposals walkthrough 2026-05-05.
  const careConfig = carerCareServices.find((s) => s.serviceType === service);
  // Day care: does this carer offer a half-day price? Drives the duration
  // picker visibility — single-rate day-care carers don't see one. Half-day
  // Care, 2026-06-07.
  const offersHalfDay =
    service === "day_care" &&
    !!careConfig?.durationOptions &&
    careConfig.durationOptions.length > 1 &&
    careConfig.durationOptions.some((o) => o.duration === "half_day");
  const todayISO = new Date().toISOString().slice(0, 10);
  const estimate = useMemo(() => {
    if (!careConfig || !canSubmit) return null;
    const draftInquiry: InquiryDetails = {
      bookingType,
      serviceType: service,
      subService,
      pets: selectedPets,
      startDate: bookingType === "one_off" ? dateRange.start : null,
      endDate: bookingType === "one_off" ? dateRange.end : null,
      recurringSchedule: bookingType === "ongoing" ? recurringSchedule : undefined,
      dayCareDuration: service === "day_care" ? dayCareDuration : undefined,
      status: "pending",
    };
    return computeQuote(careConfig, draftInquiry, todayISO);
    // canSubmit captures all the input deps; explicit list for clarity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careConfig, canSubmit, bookingType, service, subService, selectedPets, dateRange.start, dateRange.end, recurringSchedule, dayCareDuration, todayISO]);

  const triggeredModifiers = estimate?.lineItems.filter((li) => li.isModifier) ?? [];
  const cycleLabel =
    estimate?.billingCycle === "weekly" ? "/ week" : "";

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

      {/* Service type — only render when the carer offers more than one
          Care service AND the entry wasn't already service-specific. When
          the owner clicked "Book a session" on a specific service card,
          `initialService` is set and the picker hides — they already
          chose. Generic "Ask about care" entry (no service preselected)
          falls through to the picker. Each tile shows the carer's
          per-unit price so the choices read as distinct offerings rather
          than equivalent labels. 2026-06-08. */}
      {carerServiceTypes.length > 1 && initialService == null && (
        <div className="filter-field">
          <div className="label">Service</div>
          <div className="inq-service-row">
            {carerServiceTypes.map((value) => {
              const cfg = carerCareServices.find((s) => s.serviceType === value);
              const minPrice = cfg?.durationOptions?.length
                ? Math.min(...cfg.durationOptions.map((o) => o.price))
                : cfg?.deliveryOptions?.length
                  ? Math.min(...cfg.deliveryOptions.map((o) => o.price))
                  : cfg?.pricePerUnit;
              const unitLabel = cfg?.priceUnit === "per_night" ? "night" : "visit";
              return (
                <button
                  key={value}
                  type="button"
                  className={`filter-option-card inq-service-card${service === value ? " active" : ""}`}
                  onClick={() => {
                    setService(value);
                    setSubService(null);
                  }}
                >
                  <strong>{SERVICE_TYPE_LABELS[value]}</strong>
                  {minPrice !== undefined && (
                    <span className="text-xs text-fg-tertiary">
                      From {minPrice} Kč / {unitLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-service — hidden when the carer only offers one sub-option
          for this service (single-choice picker is just friction). The
          lone option is auto-selected via the useEffect above so canSubmit
          stays satisfied. 2026-06-08. */}
      {subOptions.length > 1 && (
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
      )}

      {/* Day-care duration — only when the carer offers a half-day price.
          Half-day Care, 2026-06-07. */}
      {offersHalfDay && (
        <div className="filter-field">
          <div className="label">Duration</div>
          <div className="filter-visit-row">
            {(["full_day", "half_day"] as const).map((d) => {
              const opt = careConfig?.durationOptions?.find((o) => o.duration === d);
              if (!opt) return null;
              return (
                <button
                  key={d}
                  type="button"
                  className={`filter-option-card${dayCareDuration === d ? " active" : ""}`}
                  onClick={() => setDayCareDuration(d)}
                >
                  <strong>{d === "full_day" ? "Full day" : "Half day"}</strong>
                  <span>{opt.price} Kč</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        <>
          {/* Start-from date for ongoing bookings. Optional — the schedule
              days are the required commitment, start date helps the
              provider plan but isn't blocking. Pricing & Proposals
              walkthrough 2026-05-05. */}
          <div className="filter-field">
            <div className="label" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
              <span>Start from</span>
              <span className="text-fg-tertiary text-xs font-normal">(Optional)</span>
            </div>
            <DateTrigger
              label="Pick a start date"
              value={ongoingStart}
              onClick={() => setOngoingDatePickerOpen(true)}
            />
            <DatePicker
              mode="single"
              open={ongoingDatePickerOpen}
              onClose={() => setOngoingDatePickerOpen(false)}
              value={ongoingStart}
              onChange={(iso) => {
                setOngoingStart(iso);
                setOngoingDatePickerOpen(false);
              }}
              title="Start from"
            />
          </div>
          {/* RecurringSchedulePicker self-labels its two sub-sections ("For
              which days?" + "Time"), so no outer wrapper label needed. */}
          <RecurringSchedulePicker
            value={recurringSchedule}
            onChange={setRecurringSchedule}
          />
        </>
      )}

      {/* Optional notes — context the form doesn't capture (special needs,
          scheduling preferences). Renders alongside the InquiryCard on send. */}
      <div className="filter-field">
        <div className="label" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
          <span>Anything else?</span>
          <span className="text-fg-tertiary text-xs font-normal">(Optional)</span>
        </div>
        <textarea
          className="textarea inq-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Optional notes for provider"
          placeholder={`Tell ${firstName} anything specific about your dog or schedule…`}
        />
      </div>

      {/* Real-time estimate. Hidden until canSubmit (all inputs the engine
          needs are filled in). Updates as the form changes. Same engine
          output the provider will see in the ProposalForm. Pricing &
          Proposals walkthrough 2026-05-05. */}
      {estimate && estimate.total > 0 && (
        <div className="inq-estimate">
          <div className="inq-estimate-row">
            <span className="inq-estimate-label">Estimate</span>
            <span className="inq-estimate-total">
              {estimate.total.toLocaleString()} Kč
              {cycleLabel && (
                <span className="inq-estimate-cycle"> {cycleLabel}</span>
              )}
            </span>
          </div>
          {triggeredModifiers.length > 0 && (
            <div className="inq-estimate-modifiers">
              {triggeredModifiers.map((m, i) => (
                <span key={i} className="inq-estimate-modifier">
                  {m.label}
                </span>
              ))}
            </div>
          )}
          <p className="inq-estimate-note">
            {firstName} will confirm this quote. Platform fee added at checkout.
          </p>
        </div>
      )}

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
            ongoingStart: bookingType === "ongoing" ? ongoingStart : null,
            recurringSchedule: bookingType === "ongoing" ? recurringSchedule : null,
            dayCareDuration: service === "day_care" && offersHalfDay ? dayCareDuration : undefined,
            message,
          })
        }
      >
        Send inquiry →
      </button>
    </div>
  );
}

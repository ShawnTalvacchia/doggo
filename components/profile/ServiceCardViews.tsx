import type { ReactNode } from "react";
import { CalendarBlank } from "@phosphor-icons/react";
import {
  SERVICE_LABELS,
  MEET_FORMAT_LABEL,
  MEET_CADENCE_LABEL,
  APPOINTMENT_CATEGORY_LABEL,
} from "@/lib/constants/services";
import { mockMeets } from "@/lib/mockMeets";
import { meetScheduleSummary } from "@/lib/meetUtils";
import { getShelterById } from "@/lib/mockShelters";
import type {
  Meet,
  CarerCareServiceConfig,
  CarerMeetServiceConfig,
  CarerAppointmentServiceConfig,
  CarerMentorSessionServiceConfig,
} from "@/lib/types";

/**
 * Shared presentational service-card views.
 *
 * Both the own-profile preview (`ProfileServicesTab`) and the viewer-facing
 * `/profile/[userId]` render the carer's catalogue. They previously carried two
 * independent copies of this markup, which drifted: the own-profile Care card
 * lost the "From" prefix, the pickup/drop-off delivery breakdown, and the
 * full-day/half-day duration breakdown — so a carer saw a different (wrong)
 * price on their own profile than everyone else saw. These components are the
 * single source of truth; the only per-surface difference is the optional
 * `action` slot (the viewer-facing surface passes a Book/Ask CTA, the
 * own-profile preview passes none). Design-System Audit + Cleanup WS-A,
 * 2026-06-20.
 */

const PILL =
  "rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary";

function ServicePill({ children }: { children: ReactNode }) {
  return <span className={PILL}>{children}</span>;
}

/** Resolve a Meet-service's `linkedMeetIds` to real meets (shared so the card
 *  body and a caller's Book/Ask CTA branch agree on bookability). */
export function resolveServiceLinkedMeets(svc: CarerMeetServiceConfig): Meet[] {
  return svc.linkedMeetIds.flatMap((id) => {
    const m = mockMeets.find((meet) => meet.id === id);
    return m ? [m] : [];
  });
}

export function CareServiceCardView({
  svc,
  viewerFirstName,
  action,
}: {
  svc: CarerCareServiceConfig;
  /** First name used in the pickup line ("Pickup — {name} comes to you"). */
  viewerFirstName?: string;
  action?: ReactNode;
}) {
  const deliveryOpts = svc.deliveryOptions ?? [];
  const hasMultipleDelivery = deliveryOpts.length > 1;
  // Day-care carries an analogous priced axis: full-day vs half-day
  // (`durationOptions[]`). Surface it the same way walks surface delivery, so
  // the two read consistently. Service Options & Booking Clarity, 2026-06-16.
  const durationOpts = svc.durationOptions ?? [];
  const hasMultipleDuration = durationOpts.length > 1;
  // Catalogue price reads from the cheapest option when a priced axis is
  // present (so the user sees the floor), with a "From" prefix to telegraph the
  // range.
  const optionPrices = hasMultipleDelivery
    ? deliveryOpts.map((o) => o.price)
    : hasMultipleDuration
      ? durationOpts.map((o) => o.price)
      : [];
  const priceFrom = optionPrices.length
    ? Math.min(...optionPrices)
    : svc.pricePerUnit;
  const showFromPrefix =
    (svc.modifiers ?? []).some((m) => m.enabled) ||
    hasMultipleDelivery ||
    hasMultipleDuration;

  return (
    <div className="profile-service-card">
      <div className="profile-service-top">
        <span className="profile-service-name">
          {SERVICE_LABELS[svc.serviceType]}
        </span>
        <div className="profile-service-price-wrap">
          <span className="profile-service-price">
            {/* "From" telegraphs that the final quote depends on inquiry
                specifics (multi-pet, holiday, delivery method, etc.) — surfaced
                in the proposal, not the catalogue. */}
            {showFromPrefix && (
              <span className="profile-service-price-from">From </span>
            )}
            {priceFrom.toLocaleString()} Kč
            <span className="profile-service-unit">
              {" "}/ {svc.priceUnit === "per_visit" ? "visit" : "night"}
            </span>
          </span>
        </div>
      </div>
      {svc.subServices.length > 0 && (
        <div className="profile-service-subs">
          {svc.subServices.map((sub) => (
            <ServicePill key={sub}>{sub}</ServicePill>
          ))}
        </div>
      )}
      {hasMultipleDelivery && (
        <div className="flex flex-col gap-tiny text-xs">
          {deliveryOpts
            .slice()
            .sort((a, b) =>
              a.method === b.method ? 0 : a.method === "pickup" ? -1 : 1,
            )
            .map((opt) => (
              <span
                key={opt.method}
                className="flex items-center justify-between gap-xs text-fg-secondary"
              >
                <span>
                  {opt.method === "pickup"
                    ? `Pickup — ${viewerFirstName ?? "the carer"} comes to you`
                    : "Drop-off — meet at the start"}
                </span>
                <span className="font-semibold text-fg-primary">
                  {opt.price.toLocaleString()} Kč
                </span>
              </span>
            ))}
        </div>
      )}
      {hasMultipleDuration && (
        <div className="flex flex-col gap-tiny text-xs">
          {durationOpts
            .slice()
            .sort((a, b) =>
              a.duration === b.duration
                ? 0
                : a.duration === "full_day"
                  ? -1
                  : 1,
            )
            .map((opt) => (
              <span
                key={opt.duration}
                className="flex items-center justify-between gap-xs text-fg-secondary"
              >
                <span>{opt.duration === "full_day" ? "Full day" : "Half day"}</span>
                <span className="font-semibold text-fg-primary">
                  {opt.price.toLocaleString()} Kč
                </span>
              </span>
            ))}
        </div>
      )}
      {svc.notes && <p className="profile-service-notes">{svc.notes}</p>}
      {action}
    </div>
  );
}

export function MeetServiceCardView({
  svc,
  action,
}: {
  svc: CarerMeetServiceConfig;
  action?: ReactNode;
}) {
  const linkedMeets = resolveServiceLinkedMeets(svc);
  return (
    <div className="profile-service-card">
      <div className="profile-service-top">
        <span className="profile-service-name">{svc.title}</span>
        <div className="profile-service-price-wrap">
          <span className="profile-service-price">
            {svc.pricePerSession.toLocaleString()} Kč
            <span className="profile-service-unit">{" "}/ session</span>
          </span>
        </div>
      </div>
      <div className="profile-service-subs">
        <ServicePill>{MEET_FORMAT_LABEL[svc.format] ?? svc.format}</ServicePill>
        <ServicePill>{MEET_CADENCE_LABEL[svc.cadence] ?? svc.cadence}</ServicePill>
        <ServicePill>{svc.durationMinutes} min</ServicePill>
      </div>
      {/* Linked-meet schedule grounding: when and where the sessions run. */}
      {linkedMeets.length > 0 && (
        <div className="flex flex-col gap-xs" style={{ marginTop: 4 }}>
          {linkedMeets.map((meet) => (
            <span
              key={meet.id}
              className="flex items-center gap-xs text-xs text-fg-tertiary"
            >
              <CalendarBlank size={13} weight="light" className="shrink-0" />
              <span>
                {meetScheduleSummary(meet)} · {meet.location}
              </span>
            </span>
          ))}
        </div>
      )}
      {svc.notes && <p className="profile-service-notes">{svc.notes}</p>}
      {action}
    </div>
  );
}

export function AppointmentServiceCardView({
  svc,
  action,
}: {
  svc: CarerAppointmentServiceConfig;
  action?: ReactNode;
}) {
  return (
    <div className="profile-service-card">
      <div className="profile-service-top">
        <span className="profile-service-name">{svc.title}</span>
        <div className="profile-service-price-wrap">
          <span className="profile-service-price">
            {svc.pricePerAppointment.toLocaleString()} Kč
            <span className="profile-service-unit">{" "}/ appointment</span>
          </span>
        </div>
      </div>
      <div className="profile-service-subs">
        <ServicePill>
          {APPOINTMENT_CATEGORY_LABEL[svc.appointmentCategory] ??
            svc.appointmentCategory}
        </ServicePill>
        <ServicePill>{svc.durationMinutes} min</ServicePill>
      </div>
      {svc.notes && <p className="profile-service-notes">{svc.notes}</p>}
      {action}
    </div>
  );
}

export function MentorServiceCardView({
  svc,
  progress,
  action,
}: {
  svc: CarerMentorSessionServiceConfig;
  /** Optional viewer-graduation-arc line (only the viewer-facing surface has
   *  the mentee context to compute it). */
  progress?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="profile-service-card">
      <div className="profile-service-top">
        <span className="profile-service-name">{svc.title}</span>
        <div className="profile-service-price-wrap">
          <span className="profile-service-price">
            {svc.pricePerSession.toLocaleString()} Kč
            <span className="profile-service-unit">{" "}/ session</span>
          </span>
        </div>
      </div>
      <div className="profile-service-subs">
        <ServicePill>Shelter mentoring</ServicePill>
        <ServicePill>{svc.durationMinutes} min</ServicePill>
        {svc.shelterIds.map((sid) => {
          const shelter = getShelterById(sid);
          return shelter ? (
            <ServicePill key={sid}>{shelter.name}</ServicePill>
          ) : null;
        })}
      </div>
      {svc.notes && <p className="profile-service-notes">{svc.notes}</p>}
      {progress}
      {action}
    </div>
  );
}

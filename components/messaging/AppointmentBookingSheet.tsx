"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { DateTrigger, DatePicker } from "@/components/ui/DatePicker";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useConversations } from "@/contexts/ConversationsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { computeAppointmentQuote } from "@/lib/pricing";
import { APPOINTMENT_LOCATION_META } from "@/lib/constants/services";
import { formatShortDate } from "@/lib/dateUtils";
import type {
  CarerAppointmentServiceConfig,
  ChatMessage,
  InquiryDetails,
  BookingProposal,
  AppointmentRef,
  AppointmentLocationKind,
} from "@/lib/types";

/**
 * AppointmentBookingSheet — owner-side booking surface for an Appointment-type
 * service (grooming / training, a fixed-time solo slot).
 *
 * Appointments aren't part of the Care `ServiceType` taxonomy, so they get
 * their own slim form rather than the Care `InquiryForm`: pick a date, pick
 * which dog, see the flat price, send. On send the sheet posts the inquiry
 * AND — because the demo runs one persona at a time — auto-posts the carer's
 * proposal so the owner can review & sign immediately in their chat (the
 * proposal would normally come from the carer opening the thread). This is
 * the single-persona "auto-proposal on send" affordance.
 *
 * Appointment booking flow, 2026-05-22. Replaces the appointment card's old
 * "Ask about this" → empty-chat stub. See `docs/features/explore-and-care.md`.
 */
export function AppointmentBookingSheet({
  open,
  onClose,
  provider,
  service,
}: {
  open: boolean;
  onClose: () => void;
  provider: { id: string; name: string; avatarUrl: string };
  service: CarerAppointmentServiceConfig;
}) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { getOrCreateDirectConversation, addMessage } = useConversations();
  const { markFamiliar } = useConnections();

  const allPets = currentUser.pets.map((p) => p.name);
  const firstName = provider.name.split(" ")[0];

  // Meeting-location options (Workstream B4). Empty = flat-rate legacy.
  const locations = service.appointmentLocations ?? [];
  const defaultLocation: AppointmentLocationKind | null =
    locations[0]?.kind ?? null;

  const [selectedPets, setSelectedPets] = useState<string[]>(allPets);
  const [date, setDate] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<AppointmentLocationKind | null>(defaultLocation);
  const [submitted, setSubmitted] = useState(false);

  // Reset on each fresh open so a re-open never shows stale success / inputs.
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setSelectedPets(allPets);
      setDate(null);
      setMessage("");
      setSelectedLocation(defaultLocation);
    }
    // allPets identity changes per render; key on `open` only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const quote = computeAppointmentQuote(service, selectedLocation);
  const canSubmit = selectedPets.length > 0 && date !== null;

  function togglePet(pet: string) {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet],
    );
  }

  function handleSubmit() {
    if (!canSubmit || !date) return;

    const convId = getOrCreateDirectConversation({
      id: provider.id,
      name: provider.name,
      avatarUrl: provider.avatarUrl,
    });

    // Sending a booking request is an explicit, two-sided action — mark
    // mutual Familiar so the carer can see the owner's profile (mirrors the
    // Care inquiry flow's auto-Familiar). markConnected follows on sign.
    markFamiliar(currentUser.id, provider.id);
    markFamiliar(provider.id, currentUser.id);

    const appointment: AppointmentRef = {
      serviceId: service.id,
      title: service.title,
      category: service.appointmentCategory,
      durationMinutes: service.durationMinutes,
      // Carry the chosen meeting location (when the service offers options) so
      // it rides inquiry → proposal → booking on the ref. Workstream B4.
      location: locations.length > 0 ? selectedLocation ?? undefined : undefined,
    };

    // 1. The owner's inquiry. Marked "responded" because the carer's
    //    proposal lands in the same beat (auto-proposal) — so the inquiry
    //    card collapses and the proposal carries the action.
    const inquiry: InquiryDetails = {
      bookingType: "one_off",
      appointment,
      subService: null,
      pets: selectedPets,
      startDate: date,
      endDate: null,
      notes: message.trim() || undefined,
      status: "responded",
    };
    const inquiryMsg: ChatMessage = {
      id: `msg-${Date.now()}-inq`,
      conversationId: convId,
      sender: "owner",
      type: "inquiry",
      inquiry,
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(convId, inquiryMsg);

    // 2. The carer's auto-proposal (single-persona demo affordance). Priced
    //    off the flat appointment config; pending, awaiting the owner's sign.
    const proposal: BookingProposal = {
      bookingType: "one_off",
      appointment,
      subService: null,
      pets: selectedPets,
      startDate: date,
      endDate: null,
      price: computeAppointmentQuote(service, selectedLocation),
      status: "pending",
    };
    const proposalMsg: ChatMessage = {
      id: `msg-${Date.now()}-prop`,
      conversationId: convId,
      sender: "provider",
      type: "booking_proposal",
      proposal,
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(convId, proposalMsg);

    setSubmitted(true);
  }

  function handleReviewProposal() {
    onClose();
    router.push(`/profile/${provider.id}?tab=chat`);
  }

  return (
    <ModalSheet open={open} onClose={onClose} title={`Book with ${firstName}`}>
      {submitted ? (
        <div className="inquiry-form-success">
          <CheckCircle size={40} weight="fill" className="inquiry-form-success-icon" />
          <p className="inquiry-form-success-title">Request sent</p>
          <p className="inquiry-form-success-sub">
            {firstName} has sent a proposal back. Review the details and sign to
            confirm the booking.
          </p>
          <ButtonAction
            variant="primary"
            size="md"
            cta
            className="mt-md"
            rightIcon={<ArrowRight size={16} weight="bold" />}
            onClick={handleReviewProposal}
          >
            Review the proposal
          </ButtonAction>
        </div>
      ) : (
        <div className="inbox-inquiry-form">
          {/* Service summary */}
          <div className="flex flex-col gap-xs border-b border-edge-regular pb-md">
            <span className="font-semibold text-fg-primary">{service.title}</span>
            <span className="text-sm text-fg-tertiary">
              {service.appointmentCategory === "training" ? "Training visit" : "Grooming"}
              {" · "}
              {service.durationMinutes} min
            </span>
          </div>

          {/* Where it happens (Workstream B4). More than one option → picker;
              exactly one → read-only line; none → omitted (flat-rate legacy). */}
          {locations.length > 1 && (
            <div className="filter-field">
              <div className="label">Where should this happen?</div>
              <div className="flex flex-col gap-xs">
                {locations.map((opt) => {
                  const sel = selectedLocation === opt.kind;
                  return (
                    <button
                      key={opt.kind}
                      type="button"
                      onClick={() => setSelectedLocation(opt.kind)}
                      aria-pressed={sel}
                      className={`flex items-center justify-between gap-sm rounded-form border p-md text-left ${
                        sel ? "border-info-strong" : "border-edge-regular"
                      }`}
                      style={sel ? { background: "var(--info-50)" } : undefined}
                    >
                      <span
                        className={`text-sm font-semibold ${sel ? "text-info-strong" : "text-fg-primary"}`}
                      >
                        {APPOINTMENT_LOCATION_META[opt.kind].label}
                      </span>
                      <span className="text-sm text-fg-secondary shrink-0">
                        {opt.price.toLocaleString()} Kč
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {locations.length === 1 && (
            <div className="filter-field">
              <div className="label">Where</div>
              <p className="text-sm text-fg-secondary m-0">
                {APPOINTMENT_LOCATION_META[locations[0].kind].ownerLine(firstName)}.
              </p>
            </div>
          )}

          {/* Your pets */}
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

          {/* Date */}
          <div className="filter-field">
            <div className="label">Preferred date</div>
            <DateTrigger
              label="Pick a date"
              value={date}
              onClick={() => setDatePickerOpen(true)}
            />
            <DatePicker
              mode="single"
              open={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              value={date}
              onChange={(iso) => {
                setDate(iso);
                setDatePickerOpen(false);
              }}
              title="Preferred date"
            />
          </div>

          {/* Optional notes */}
          <div className="filter-field">
            <div
              className="label"
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}
            >
              <span>Anything else?</span>
              <span className="text-fg-tertiary text-xs font-normal">(Optional)</span>
            </div>
            <textarea
              className="textarea inq-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-label="Optional notes for carer"
              placeholder={`Tell ${firstName} anything specific about your dog…`}
            />
          </div>

          {/* Flat estimate */}
          <div className="inq-estimate">
            <div className="inq-estimate-row">
              <span className="inq-estimate-label">Price</span>
              <span className="inq-estimate-total">
                {quote.total.toLocaleString()} Kč
              </span>
            </div>
            <p className="inq-estimate-note">
              {date
                ? `${firstName} will confirm for ${formatShortDate(date)}. Platform fee added at checkout.`
                : `${firstName} will confirm your slot. Platform fee added at checkout.`}
            </p>
          </div>

          <button className="inq-submit" disabled={!canSubmit} onClick={handleSubmit}>
            Send request →
          </button>
        </div>
      )}
    </ModalSheet>
  );
}

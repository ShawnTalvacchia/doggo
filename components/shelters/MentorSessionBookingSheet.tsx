"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Check, ShieldCheck } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { DateTrigger, DatePicker } from "@/components/ui/DatePicker";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useConversations } from "@/contexts/ConversationsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getShelterById } from "@/lib/mockShelters";
import { MENTOR_SESSION_DEFAULT_MINIMUM } from "@/lib/constants/services";
import { formatShortDate } from "@/lib/dateUtils";
import type { CarerMentorSessionServiceConfig, ChatMessage } from "@/lib/types";

/**
 * MentorSessionBookingSheet — mentee-side booking surface for a
 * mentor-session offering (Cross-Shelter Mentor Network B1/B2, 2026-06-09).
 *
 * Deliberately NOT the Care inquiry → proposal → sign round-trip: the
 * price is fixed (no quote to negotiate), the mentee may have no dog (no
 * pet selection), and the session's real product is graduation progress
 * at a shelter — so the sheet creates the Booking directly and drops a
 * short exchange into the mentor conversation. Flagged as a walkthrough
 * O item.
 *
 * Carries the layered waiver checklist (D4 / ASSUMPTION A2): the
 * platform baseline signs ONCE per user (subsequent bookings anywhere
 * show it pre-signed — the cross-shelter payoff), the shelter-specific
 * waiver signs per shelter. Demo signs via checkbox — honestly fake, no
 * real legal text.
 */
export function MentorSessionBookingSheet({
  open,
  onClose,
  mentor,
  service,
  defaultShelterId,
  lockShelter = false,
}: {
  open: boolean;
  onClose: () => void;
  mentor: { id: string; name: string; avatarUrl: string };
  service: CarerMentorSessionServiceConfig;
  defaultShelterId?: string;
  /** Entered from a shelter/dog page — the shelter IS the context, so
   *  no shelter picker renders (presenting other shelters as peer
   *  options there is incoherent; PO call 2026-06-11). Profile-entry
   *  keeps the picker, since no shelter has been chosen yet. */
  lockShelter?: boolean;
}) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { getOrCreateDirectConversation, addMessage } = useConversations();
  const { markFamiliar } = useConnections();
  const { createBooking } = useBookings();
  const {
    getApplication,
    beginMentorship,
    signShelterWaiver,
    getPlatformWaiverSignedAt,
    signPlatformWaiver,
  } = useWalkerApplications();

  const mentorFirstName = mentor.name.split(" ")[0];
  const shelterOptions = service.shelterIds
    .map((id) => getShelterById(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const [shelterId, setShelterId] = useState<string>(
    defaultShelterId && service.shelterIds.includes(defaultShelterId)
      ? defaultShelterId
      : service.shelterIds[0],
  );
  const [date, setDate] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [platformWaiverChecked, setPlatformWaiverChecked] = useState(false);
  const [shelterWaiverChecked, setShelterWaiverChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setDate(null);
      setPlatformWaiverChecked(false);
      setShelterWaiverChecked(false);
      if (defaultShelterId && service.shelterIds.includes(defaultShelterId)) {
        setShelterId(defaultShelterId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const shelter = getShelterById(shelterId);
  const application = getApplication(currentUser.id, shelterId);
  const platformSignedAt = getPlatformWaiverSignedAt(currentUser.id);
  const shelterSignedAt = application?.shelterWaiverSignedAt;
  const sessionsDone = application?.mentorship?.sessionsCompleted ?? 0;
  const minimum = shelter?.policy.mentorSessionMinimum ?? MENTOR_SESSION_DEFAULT_MINIMUM;
  const accepts = shelter?.policy.acceptsMentorVouches ?? false;
  const alreadyVouched = application?.state === "vouched";
  const nextSessionNumber = sessionsDone + 1;

  const platformOk = !!platformSignedAt || platformWaiverChecked;
  const shelterOk = !!shelterSignedAt || shelterWaiverChecked;
  const canSubmit = date !== null && !!shelter && platformOk && shelterOk;

  function handleSubmit() {
    if (!canSubmit || !date || !shelter) return;

    // Booking a session is an explicit two-sided act — mutual Familiar,
    // mirroring the Care inquiry + Appointment flows.
    markFamiliar(currentUser.id, mentor.id);
    markFamiliar(mentor.id, currentUser.id);

    // Waiver layers (D4): platform baseline once, shelter waiver per
    // shelter, then the mentorship record at this shelter.
    if (!platformSignedAt) signPlatformWaiver(currentUser.id);
    beginMentorship(currentUser.id, shelterId, { id: mentor.id, name: mentor.name });
    if (!shelterSignedAt) signShelterWaiver(currentUser.id, shelterId);

    const convId = getOrCreateDirectConversation({
      id: mentor.id,
      name: mentor.name,
      avatarUrl: mentor.avatarUrl,
    });

    const bookingId = createBooking({
      conversationId: convId,
      ownerKind: "user",
      ownerId: currentUser.id,
      ownerName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      ownerAvatarUrl: currentUser.avatarUrl ?? "",
      carerId: mentor.id,
      carerName: mentor.name,
      carerAvatarUrl: mentor.avatarUrl,
      type: "one_off",
      mentorSession: {
        serviceId: service.id,
        serviceTitle: service.title,
        shelterId: shelter.id,
        shelterName: shelter.name,
        sessionNumber: nextSessionNumber,
      },
      subService: null,
      pets: [],
      startDate: date,
      endDate: date,
      price: {
        lineItems: [
          {
            label: `${service.title} · ${shelter.name}`,
            amount: service.pricePerSession,
            unit: "per session",
          },
        ],
        total: service.pricePerSession,
        currency: "Kč",
        billingCycle: "per_session",
      },
      status: "upcoming",
      sessions: [
        {
          id: `mentor-session-${Date.now()}`,
          date,
          status: "upcoming",
        },
      ],
    });

    // Confirmation card in the mentor conversation (O1 resolution,
    // 2026-06-10): appointment-confirmation framing — nothing to
    // approve, but the chronicle rule holds: the booking is findable
    // from the chat thread via the card's "View booking" link, same as
    // every other booked service. The mentor reply below is the
    // single-persona auto-response affordance.
    const bookedMsg: ChatMessage = {
      id: `msg-${Date.now()}-mentor-booked`,
      conversationId: convId,
      sender: "owner",
      type: "booking_confirmation",
      bookingRef: {
        bookingId,
        title: service.title,
        contextLine: `${shelter.name} · session ${nextSessionNumber}${accepts ? ` of ${minimum}` : ""} · with ${mentorFirstName}`,
        date,
        priceLabel: `${service.pricePerSession.toLocaleString()} Kč / session`,
      },
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(convId, bookedMsg);
    const replyMsg: ChatMessage = {
      id: `msg-${Date.now()}-mentor-reply`,
      conversationId: convId,
      sender: "provider",
      type: "text",
      text: `See you at ${shelter.name} reception. Wear shoes that can handle kennel mud 🐾`,
      sentAt: new Date(Date.now() + 1000).toISOString(),
      read: true,
    };
    addMessage(convId, replyMsg);

    setSubmitted(true);
  }

  return (
    <ModalSheet open={open} onClose={onClose} title={`Mentored walk with ${mentorFirstName}`}>
      {submitted ? (
        <div className="inquiry-form-success">
          <CheckCircle size={40} weight="fill" className="inquiry-form-success-icon" />
          <p className="inquiry-form-success-title">Session booked</p>
          <p className="inquiry-form-success-sub">
            {mentorFirstName} will meet you at {shelter?.name}.{" "}
            {accepts && !alreadyVouched
              ? `${Math.max(minimum - sessionsDone, 0)} more ${minimum - sessionsDone === 1 ? "session" : "sessions"} and ${shelter?.name} vouches you to walk solo.`
              : ""}
          </p>
          <ButtonAction
            variant="primary"
            size="md"
            cta
            className="mt-md"
            rightIcon={<ArrowRight size={16} weight="bold" />}
            onClick={() => {
              onClose();
              router.push("/bookings");
            }}
          >
            See your bookings
          </ButtonAction>
        </div>
      ) : (
        <div className="inbox-inquiry-form">
          {/* Service summary — locked entry carries the shelter as static
              context (it was chosen by WHERE the user tapped). */}
          <div className="flex flex-col gap-xs border-b border-edge-regular pb-md">
            <span className="font-semibold text-fg-primary">{service.title}</span>
            <span className="text-sm text-fg-tertiary">
              Supervised shelter walk{lockShelter && shelter ? ` at ${shelter.name}` : ""} ·{" "}
              {service.durationMinutes} min
            </span>
          </div>

          {/* Shelter picker — only on mentor-profile entry (no shelter
              chosen yet) AND when the mentor serves multiple shelters.
              Shelter/dog-page entry locks the shelter as context. */}
          {!lockShelter && shelterOptions.length > 1 && (
            <div className="filter-field">
              <div className="label">Shelter</div>
              <div className="pill-group" style={{ flexWrap: "wrap" }}>
                {shelterOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`pill pill-sm${s.id === shelterId ? " active" : ""}`}
                    onClick={() => setShelterId(s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Graduation context — what these sessions add up to */}
          {shelter && (
            <p className="text-sm text-fg-secondary m-0">
              {alreadyVouched
                ? `You already walk solo at ${shelter.name} — extra sessions are coaching, not credentialing.`
                : accepts
                  ? `${shelter.name} accepts mentor vouching: after ${minimum} sessions, ${mentorFirstName}'s vouch makes you a solo walker there. This would be session ${nextSessionNumber}.`
                  : `${shelter.name} runs its own walker intake — mentor sessions still count as documented experience on your application.`}
            </p>
          )}

          {/* Waiver checklist — the three-layer requirements model, layers
              1 + 2 (layer 3 is the session minimum above). Sign-once
              platform baseline; per-shelter waiver. */}
          <div className="filter-field">
            <div className="label">Before the first walk</div>
            <div className="flex flex-col gap-sm">
              {platformSignedAt ? (
                <span className="flex items-center gap-sm text-sm text-fg-secondary">
                  <ShieldCheck size={16} weight="fill" style={{ color: "var(--brand-strong)" }} className="shrink-0" />
                  Platform waiver signed {formatShortDate(platformSignedAt.slice(0, 10))} — carries across shelters
                </span>
              ) : (
                <label className="filter-inline-check" style={{ alignItems: "flex-start" }}>
                  <input
                    type="checkbox"
                    checked={platformWaiverChecked}
                    onChange={(e) => setPlatformWaiverChecked(e.target.checked)}
                  />
                  <span>
                    Doggo baseline waiver — identity, emergency contact, general
                    liability. <strong>Signed once</strong>, valid at every
                    participating shelter.
                  </span>
                </label>
              )}
              {shelterSignedAt ? (
                <span className="flex items-center gap-sm text-sm text-fg-secondary">
                  <Check size={16} weight="bold" style={{ color: "var(--brand-strong)" }} className="shrink-0" />
                  {shelter?.name} waiver signed
                </span>
              ) : (
                <label className="filter-inline-check" style={{ alignItems: "flex-start" }}>
                  <input
                    type="checkbox"
                    checked={shelterWaiverChecked}
                    onChange={(e) => setShelterWaiverChecked(e.target.checked)}
                  />
                  <span>{shelter?.name}&rsquo;s own waiver — their liability terms and dog-handling rules.</span>
                </label>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="filter-field">
            <div className="label">Date</div>
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
              title="Session date"
            />
          </div>

          {/* Flat price */}
          <div className="inq-estimate">
            <div className="inq-estimate-row">
              <span className="inq-estimate-label">Price</span>
              <span className="inq-estimate-total">
                {service.pricePerSession.toLocaleString()} Kč
              </span>
            </div>
            <p className="inq-estimate-note">
              You pay {mentorFirstName} — the shelter pays nothing. Platform fee
              added at checkout.
            </p>
          </div>

          <button className="inq-submit" disabled={!canSubmit} onClick={handleSubmit}>
            Book session →
          </button>
        </div>
      )}
    </ModalSheet>
  );
}

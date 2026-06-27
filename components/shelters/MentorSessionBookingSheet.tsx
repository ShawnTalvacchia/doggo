"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Check,
  CaretRight,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { MentorProgressTrack } from "@/components/shelters/MentorProgressTrack";
import { DateTrigger, DatePicker } from "@/components/ui/DatePicker";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { useConversations } from "@/contexts/ConversationsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useStubNotice } from "@/contexts/StubFeatureContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getShelterById } from "@/lib/mockShelters";
import { getMentorGroupWalks } from "@/lib/mockMeets";
import { getDisplayDate, recurrenceLabel } from "@/lib/meetUtils";
import { buildGroupWalkBookingInput } from "@/lib/groupWalkBooking";
import { MENTOR_SESSION_DEFAULT_MINIMUM } from "@/lib/constants/services";
import { formatShortDate, formatMeetDateTime } from "@/lib/dateUtils";
import type {
  CarerMentorSessionServiceConfig,
  ChatMessage,
  PetProfile,
} from "@/lib/types";

/** Time-of-day preference for a mentored walk. No evening — shelter
 *  walks run within shelter hours (daytime + weekends; Útulek's
 *  "weekdays 9–5"). The mentor confirms the exact time. */
type WalkTimePref = "morning" | "afternoon";
const TIME_PREF_LABEL: Record<WalkTimePref, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
};

type Step = "waivers" | "choose";
type WalkChoice = "group" | "solo";

/**
 * MentorSessionBookingSheet — mentee-side booking surface for doing a
 * mentored shelter walk with a chosen mentor (Cross-Shelter Mentor Network
 * B1/B2, 2026-06-09; FC18 unified two-path rebuild 2026-06-23).
 *
 * Two steps, because the credential path is shared by BOTH ways to walk:
 *   1. **Before your first walk** — the progress frame (each mentored walk
 *      counts toward walking solo) + the layered waivers (needed no matter
 *      which walk you pick).
 *   2. **Choose your walk** — an explicit choice between the mentor's
 *      trainer-led GROUP walk (a free volunteer walk, the appealing on-ramp)
 *      and a private 1-on-1 (paid). Picking the group walk completes the
 *      sign-up right here — pre-loaded with the dog/date/price, with an
 *      optional link out to the meet — instead of bouncing to the meet page
 *      to start over (PO direction 2026-06-23).
 *
 * Both paths sign the waivers, begin/advance the mentorship, and count on the
 * same tracker. Deliberately NOT the Care inquiry → proposal round-trip: the
 * price is fixed, and the real product is graduation progress at a shelter.
 *
 * Layered waivers (D4 / ASSUMPTION A2): platform baseline signs ONCE per user
 * (carries to every shelter), the shelter-specific waiver per shelter. Demo
 * signs via checkbox — honestly fake, no real legal text.
 */
export function MentorSessionBookingSheet({
  open,
  onClose,
  mentor,
  service,
  defaultShelterId,
  lockShelter = false,
  dog,
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
  /** When entered from a dog page, the dog the walk is for — pre-selected on
   *  the group walk and carried onto both bookings so "your walk with Nora"
   *  stays consistent across the two paths. */
  dog?: PetProfile;
}) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { getOrCreateDirectConversation, addMessage } = useConversations();
  const { markFamiliar } = useConnections();
  const { bookings, createBooking } = useBookings();
  const {
    getApplication,
    beginMentorship,
    signShelterWaiver,
    getPlatformWaiverSignedAt,
    signPlatformWaiver,
  } = useWalkerApplications();
  const { notify: notifyStub } = useStubNotice();

  const mentorFirstName = mentor.name.split(" ")[0];
  const shelterOptions = service.shelterIds
    .map((id) => getShelterById(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const [shelterId, setShelterId] = useState<string>(
    defaultShelterId && service.shelterIds.includes(defaultShelterId)
      ? defaultShelterId
      : service.shelterIds[0],
  );
  const [step, setStep] = useState<Step>("waivers");
  const [choice, setChoice] = useState<WalkChoice | null>(null);
  const [groupDogName, setGroupDogName] = useState<string | null>(dog?.name ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePref, setTimePref] = useState<WalkTimePref | null>(null);
  const [platformWaiverChecked, setPlatformWaiverChecked] = useState(false);
  const [shelterWaiverChecked, setShelterWaiverChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedPath, setSubmittedPath] = useState<WalkChoice | null>(null);

  useEffect(() => {
    if (open) {
      setStep("waivers");
      setChoice(null);
      setGroupDogName(dog?.name ?? null);
      setSubmitted(false);
      setSubmittedPath(null);
      setDate(null);
      setTimePref(null);
      setPlatformWaiverChecked(false);
      setShelterWaiverChecked(false);
      if (defaultShelterId && service.shelterIds.includes(defaultShelterId)) {
        setShelterId(defaultShelterId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const shelter = getShelterById(shelterId);
  // The mentor's group walk at this shelter — the appealing way to do a
  // mentored first walk (WS-G). When the mentor runs one, step 2 offers it
  // alongside the 1-on-1; when they don't, step 2 is just the 1-on-1.
  const groupWalks = getMentorGroupWalks(mentor.id, shelterId);
  const groupWalk = groupWalks[0] ?? null;
  const hasGroup = !!groupWalk;
  // Walkable dogs at the shelter (skip any already adopted out) — the picker
  // when the flow didn't arrive with a specific dog.
  const walkableDogs = (shelter?.dogs ?? []).filter(
    (d) => !d.adoptionStatus || d.adoptionStatus !== "adopted",
  );

  const application = getApplication(currentUser.id, shelterId);
  const platformSignedAt = getPlatformWaiverSignedAt(currentUser.id);
  const shelterSignedAt = application?.shelterWaiverSignedAt;
  const sessionsDone = application?.mentorship?.sessionsCompleted ?? 0;
  const minimum = shelter?.policy.mentorSessionMinimum ?? MENTOR_SESSION_DEFAULT_MINIMUM;
  const accepts = shelter?.policy.acceptsMentorVouches ?? false;
  const alreadyVouched = application?.state === "vouched";
  // Session number counts every committed mentored walk at this shelter —
  // BOTH 1-on-1 sessions (mentorSession.shelterId) AND mentored group walks
  // (meet-linked shelter walks), so the two paths share one tracker and
  // booking ahead doesn't repeat "session 1".
  const committedSessions = bookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      ((b.ownerId === currentUser.id && b.mentorSession?.shelterId === shelterId) ||
        (b.carerId === currentUser.id &&
          b.ownerKind === "shelter" &&
          b.ownerId === shelterId &&
          !!b.dropoffMeetId &&
          b.subService === "Mentored first walk")),
  ).length;
  const nextSessionNumber = committedSessions + 1;
  const remainingAfterThis = Math.max(minimum - nextSessionNumber, 0);

  const platformOk = !!platformSignedAt || platformWaiverChecked;
  const shelterOk = !!shelterSignedAt || shelterWaiverChecked;
  const canContinue = platformOk && shelterOk && !!shelter;
  const canSubmitGroup = !!groupWalk && !!groupDogName && !!shelter;
  const canSubmitSolo = date !== null && timePref !== null && !!shelter;
  // No group walk → the choice is implicitly the 1-on-1; auto-select it so
  // step 2 shows the solo controls directly without an empty chooser.
  const effectiveChoice: WalkChoice | null = hasGroup ? choice : "solo";

  // Waiver-name links → stub toast (the real doc opens for review before
  // signing). Shared by click + keyboard activation on the inline link.
  const openPlatformWaiver = () =>
    notifyStub({
      feature: "Doggo baseline waiver",
      note: "The full waiver document — identity, emergency contact, general liability — opens here for review before signing. Signed once; valid at every participating shelter.",
    });
  const openShelterWaiver = () =>
    notifyStub({
      feature: `${shelter?.name ?? "Shelter"} waiver`,
      note: "Each shelter's own liability terms + dog-handling rules open here for review before signing. Signed once per shelter.",
    });
  const linkKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  /** Both paths sign the waivers + begin/advance the mentorship. */
  function commitWaiversAndMentorship() {
    if (!shelter) return;
    if (!platformSignedAt) signPlatformWaiver(currentUser.id);
    if (!shelterSignedAt) signShelterWaiver(currentUser.id, shelterId);
    if (!alreadyVouched) {
      beginMentorship(currentUser.id, shelterId, { id: mentor.id, name: mentor.name });
    }
  }

  function handleSignupGroup() {
    if (!canSubmitGroup || !groupWalk || !groupDogName || !shelter) return;
    // Booking with the mentor is a two-sided act — mutual Familiar.
    markFamiliar(currentUser.id, mentor.id);
    markFamiliar(mentor.id, currentUser.id);
    commitWaiversAndMentorship();
    createBooking(
      buildGroupWalkBookingInput({
        meet: groupWalk,
        shelter,
        user: currentUser,
        dogName: groupDogName,
        isVouched: alreadyVouched,
        // The mentored group walk is a paid mentor session — same fee as a
        // 1-on-1 (the group format just lets several mentees pay at once).
        mentorFee: { amount: service.pricePerSession, mentorName: mentor.name },
      }),
    );
    setSubmittedPath("group");
    setSubmitted(true);
  }

  function handleBookSolo() {
    if (!canSubmitSolo || !date || !shelter) return;
    markFamiliar(currentUser.id, mentor.id);
    markFamiliar(mentor.id, currentUser.id);
    commitWaiversAndMentorship();

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
      // Carry the working-toward dog when the flow came from a dog page.
      pets: dog ? [dog.name] : [],
      startDate: date,
      endDate: date,
      // Time-of-day preference (the mentor confirms the exact time).
      // No typed slot field on Booking — stash as an owner note.
      ownerNotes: timePref ? `Preferred time: ${TIME_PREF_LABEL[timePref]}` : undefined,
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
      sessions: [{ id: `mentor-session-${Date.now()}`, date, status: "upcoming" }],
    });

    // Confirmation card + a single-persona auto-reply in the mentor
    // conversation (the booking stays findable from the chat thread).
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

    setSubmittedPath("solo");
    setSubmitted(true);
  }

  const title = dog
    ? `Walk ${dog.name} with ${mentorFirstName}`
    : `Mentored walk with ${mentorFirstName}`;

  const vouchTail =
    accepts && !alreadyVouched
      ? `${remainingAfterThis} more ${remainingAfterThis === 1 ? "walk" : "walks"} and ${shelter?.name} vouches you to walk on your own.`
      : "";

  return (
    <ModalSheet open={open} onClose={onClose} title={title}>
      {submitted ? (
        <div className="inquiry-form-success">
          <CheckCircle size={40} weight="fill" className="inquiry-form-success-icon" />
          <p className="inquiry-form-success-title">
            {submittedPath === "group" ? "You're on the walk" : "Session booked"}
          </p>
          <p className="inquiry-form-success-sub">
            {submittedPath === "group"
              ? `${groupDogName} is on your schedule for ${groupWalk?.title}. ${mentorFirstName} will meet you there and get you started. `
              : `${mentorFirstName} will meet you at ${shelter?.name}. `}
            {vouchTail}
          </p>
          <ButtonAction
            variant="primary"
            size="md"
            cta
            className="mt-md"
            rightIcon={<ArrowRight size={16} weight="bold" />}
            onClick={() => {
              onClose();
              // Shelter walks live on the Volunteering tab.
              router.push("/bookings?tab=volunteering");
            }}
          >
            See your bookings
          </ButtonAction>
        </div>
      ) : step === "waivers" ? (
        /* ── Step 1 — Before your first walk ───────────────────────────── */
        <div className="inbox-inquiry-form">
          <StepBreadcrumb step="waivers" />
          <div className="flex flex-col gap-xs border-b border-edge-regular pb-md">
            <span className="font-semibold text-fg-primary">Mentored shelter walk</span>
            <span className="text-sm text-fg-tertiary">
              With {mentorFirstName}
              {lockShelter && shelter ? ` · ${shelter.name}` : ""}
            </span>
          </div>

          {/* Shelter picker — only on mentor-profile entry (no shelter chosen
              yet) AND when the mentor serves multiple shelters. */}
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

          {/* The shared credential frame — this is the path to walking solo,
              and BOTH the group walk and the 1-on-1 count toward it. */}
          {shelter &&
            (alreadyVouched ? (
              <p className="text-sm text-fg-secondary m-0">
                You already walk solo at {shelter.name} — extra walks, group or
                1-on-1, are coaching, not credentialing.
              </p>
            ) : accepts ? (
              <div className="flex flex-col gap-sm">
                <MentorProgressTrack
                  total={minimum}
                  completed={sessionsDone}
                  booking={nextSessionNumber}
                />
                <p className="text-xs text-fg-tertiary m-0">
                  Each mentored walk counts — group or 1-on-1. You&rsquo;re on
                  session {nextSessionNumber} of {minimum}; after {minimum},{" "}
                  {mentorFirstName}&rsquo;s vouch makes you a solo walker at{" "}
                  {shelter.name}.
                </p>
              </div>
            ) : (
              <p className="text-sm text-fg-secondary m-0">
                {shelter.name} runs its own walker intake — mentored walks still
                count as documented experience on your application.
              </p>
            ))}

          {/* Waivers — the layered requirements model (D4). When both are
              already signed, collapse to a quiet confirmation. */}
          {platformSignedAt && shelterSignedAt ? (
            <div className="flex items-start gap-sm text-sm text-fg-secondary">
              <ShieldCheck
                size={16}
                weight="fill"
                style={{ color: "var(--brand-strong)", marginTop: 2 }}
                className="shrink-0"
              />
              <span>
                Waivers signed — you&rsquo;re cleared to walk at {shelter?.name}.
                Your platform waiver carries across every participating shelter.
              </span>
            </div>
          ) : (
            <div className="filter-field">
              <div className="label">Before your first walk</div>
              <div className="flex flex-col gap-sm">
                {platformSignedAt ? (
                  <span className="flex items-start gap-sm text-sm text-fg-secondary">
                    <ShieldCheck
                      size={16}
                      weight="fill"
                      style={{ color: "var(--brand-strong)", marginTop: 2 }}
                      className="shrink-0"
                    />
                    Platform waiver signed {formatShortDate(platformSignedAt.slice(0, 10))} — carries across shelters
                  </span>
                ) : (
                  <CheckboxRow
                    checked={platformWaiverChecked}
                    onChange={setPlatformWaiverChecked}
                    label={
                      <span className="flex flex-col">
                        <span>
                          I&rsquo;ve read and agree to the{" "}
                          <span
                            role="button"
                            tabIndex={0}
                            className="mentor-waiver-link"
                            onClick={(e) => {
                              e.preventDefault();
                              openPlatformWaiver();
                            }}
                            onKeyDown={linkKeyActivate(openPlatformWaiver)}
                          >
                            Doggo baseline waiver
                          </span>
                        </span>
                        <span className="text-xs text-fg-tertiary">
                          Signed once — carries to every participating shelter
                        </span>
                      </span>
                    }
                  />
                )}
                {shelterSignedAt ? (
                  <span className="flex items-start gap-sm text-sm text-fg-secondary">
                    <Check
                      size={16}
                      weight="bold"
                      style={{ color: "var(--brand-strong)", marginTop: 2 }}
                      className="shrink-0"
                    />
                    {shelter?.name} waiver signed
                  </span>
                ) : (
                  <CheckboxRow
                    checked={shelterWaiverChecked}
                    onChange={setShelterWaiverChecked}
                    label={
                      <span className="flex flex-col">
                        <span>
                          I&rsquo;ve read and agree to{" "}
                          <span
                            role="button"
                            tabIndex={0}
                            className="mentor-waiver-link"
                            onClick={(e) => {
                              e.preventDefault();
                              openShelterWaiver();
                            }}
                            onKeyDown={linkKeyActivate(openShelterWaiver)}
                          >
                            {shelter?.name}&rsquo;s own waiver
                          </span>
                        </span>
                        <span className="text-xs text-fg-tertiary">Specific to this shelter</span>
                      </span>
                    }
                  />
                )}
              </div>
            </div>
          )}

          <ButtonAction
            variant="primary"
            size="md"
            className="w-full"
            rightIcon={<ArrowRight size={16} weight="bold" />}
            disabled={!canContinue}
            onClick={() => setStep("choose")}
          >
            Continue
          </ButtonAction>
        </div>
      ) : (
        /* ── Step 2 — Choose your walk ─────────────────────────────────── */
        <div className="inbox-inquiry-form">
          <button
            type="button"
            className="flex items-center gap-tiny text-sm text-fg-tertiary self-start"
            onClick={() => setStep("waivers")}
          >
            <ArrowLeft size={14} weight="bold" />
            Back
          </button>
          <StepBreadcrumb step="choose" />

          {hasGroup ? (
            <div className="filter-field">
              <div className="label">Choose your walk</div>
              <div className="flex flex-col gap-sm">
                {/* Option A — Klára's trainer-led group walk (the on-ramp). */}
                <div
                  className={`flex flex-col rounded-panel border ${
                    effectiveChoice === "group"
                      ? "border-edge-stronger bg-surface-base"
                      : "border-edge-regular bg-surface-top"
                  }`}
                >
                  <button
                    type="button"
                    className="flex items-center gap-md p-md text-left"
                    onClick={() => setChoice("group")}
                  >
                    <RadioDot selected={effectiveChoice === "group"} />
                    <span
                      className="shrink-0 inline-flex items-center justify-center rounded-panel"
                      style={{
                        width: 40,
                        height: 40,
                        background: "var(--brand-subtle)",
                        color: "var(--brand-strong)",
                      }}
                    >
                      <UsersThree size={20} weight="light" />
                    </span>
                    <span className="flex flex-col gap-tiny flex-1 min-w-0">
                      <span className="font-semibold text-fg-primary">{groupWalk!.title}</span>
                      <span className="text-xs text-fg-tertiary">
                        {formatMeetDateTime(getDisplayDate(groupWalk!), groupWalk!.time)}
                        {recurrenceLabel(groupWalk!) ? ` · ${recurrenceLabel(groupWalk!)}` : ""}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-fg-secondary shrink-0">
                      {alreadyVouched ? "Free" : `${service.pricePerSession.toLocaleString()} Kč`}
                    </span>
                  </button>
                  {effectiveChoice === "group" && (
                    <div className="flex flex-col gap-sm px-md pb-md">
                      {/* The dog — fixed when we arrived with one, a picker
                          otherwise. */}
                      {dog ? (
                        <div className="flex items-center gap-sm text-sm text-fg-secondary">
                          <img
                            src={dog.imageUrl}
                            alt={dog.name}
                            className="rounded-dog object-cover shrink-0"
                            style={{ width: 32, height: 32 }}
                          />
                          <span>
                            Walking <strong className="text-fg-primary">{dog.name}</strong>, with
                            the group and {mentorFirstName} alongside.
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-xs">
                          <span className="text-xs text-fg-tertiary">Which dog will you walk?</span>
                          {walkableDogs.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setGroupDogName(d.name)}
                              className={`flex items-center gap-sm rounded-panel border p-sm text-left ${
                                d.name === groupDogName
                                  ? "border-edge-stronger bg-surface-base"
                                  : "border-edge-regular bg-surface-top"
                              }`}
                            >
                              <img
                                src={d.imageUrl}
                                alt={d.name}
                                className="rounded-dog object-cover shrink-0"
                                style={{ width: 36, height: 36 }}
                              />
                              <span className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-fg-primary">{d.name}</span>
                                <span className="text-xs text-fg-tertiary truncate">
                                  {[d.breed, d.ageLabel].filter(Boolean).join(" · ")}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        className="flex items-center gap-tiny text-xs font-medium self-start"
                        style={{ color: "var(--brand-strong)" }}
                        // Opens the meet in a new tab so the sheet (and the
                        // waiver progress) stays put — it's an optional preview.
                        onClick={() =>
                          window.open(`/meets/${groupWalk!.id}`, "_blank", "noopener,noreferrer")
                        }
                      >
                        View the walk
                        <ArrowUpRight size={12} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Option B — a private 1-on-1 with the mentor. */}
                <div
                  className={`flex flex-col rounded-panel border ${
                    effectiveChoice === "solo"
                      ? "border-edge-stronger bg-surface-base"
                      : "border-edge-regular bg-surface-top"
                  }`}
                >
                  <button
                    type="button"
                    className="flex items-center gap-md p-md text-left"
                    onClick={() => setChoice("solo")}
                  >
                    <RadioDot selected={effectiveChoice === "solo"} />
                    <span className="flex flex-col gap-tiny flex-1 min-w-0">
                      <span className="font-semibold text-fg-primary">
                        Private 1-on-1 with {mentorFirstName}
                      </span>
                      <span className="text-xs text-fg-tertiary">Pick a time that suits you</span>
                    </span>
                    <span className="text-xs font-semibold text-fg-secondary shrink-0">
                      {service.pricePerSession.toLocaleString()} Kč
                    </span>
                  </button>
                  {effectiveChoice === "solo" && (
                    <div className="px-md pb-md">
                      <SoloFields
                        date={date}
                        onOpenDatePicker={() => setDatePickerOpen(true)}
                        timePref={timePref}
                        setTimePref={setTimePref}
                        availabilityLabel={service.availabilityLabel}
                        mentorFirstName={mentorFirstName}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* No group walk — the 1-on-1 is the only path. */
            <div className="filter-field">
              <div className="label">Your 1-on-1 with {mentorFirstName}</div>
              <SoloFields
                date={date}
                onOpenDatePicker={() => setDatePickerOpen(true)}
                timePref={timePref}
                setTimePref={setTimePref}
                availabilityLabel={service.availabilityLabel}
                mentorFirstName={mentorFirstName}
              />
            </div>
          )}

          {/* Single commit, reflecting the chosen path. */}
          {effectiveChoice === "group" ? (
            <ButtonAction
              variant="primary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight size={16} weight="bold" />}
              disabled={!canSubmitGroup}
              onClick={handleSignupGroup}
            >
              Sign up for the walk
            </ButtonAction>
          ) : effectiveChoice === "solo" ? (
            <ButtonAction
              variant="primary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight size={16} weight="bold" />}
              disabled={!canSubmitSolo}
              onClick={handleBookSolo}
            >
              Book session · {service.pricePerSession.toLocaleString()} Kč
            </ButtonAction>
          ) : (
            <ButtonAction variant="primary" size="md" className="w-full" disabled>
              Choose a walk above
            </ButtonAction>
          )}

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
      )}
    </ModalSheet>
  );
}

/** Two-step breadcrumb so the modal reads as a wizard — the user can see a
 *  "Choose your walk" step follows the waivers (the modal doesn't otherwise
 *  announce its second step). No numbers, to stay clear of the dotted vouch
 *  tracker on step 1. */
function StepBreadcrumb({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-xs text-xs font-semibold">
      <span className={step === "waivers" ? "text-fg-primary" : "text-fg-tertiary"}>
        Waivers
      </span>
      <CaretRight size={10} weight="bold" className="text-fg-tertiary shrink-0" />
      <span className={step === "choose" ? "text-fg-primary" : "text-fg-tertiary"}>
        Choose your walk
      </span>
    </div>
  );
}

/** Small radio indicator for the walk-choice cards. */
function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className="shrink-0 inline-flex items-center justify-center rounded-full border"
      style={{
        width: 18,
        height: 18,
        borderColor: selected ? "var(--brand-strong)" : "var(--border-strong)",
        borderWidth: selected ? 5 : 1.5,
      }}
    />
  );
}

/** Date + time-of-day fields for the 1-on-1 path. */
function SoloFields({
  date,
  onOpenDatePicker,
  timePref,
  setTimePref,
  availabilityLabel,
  mentorFirstName,
}: {
  date: string | null;
  onOpenDatePicker: () => void;
  timePref: WalkTimePref | null;
  setTimePref: (t: WalkTimePref) => void;
  availabilityLabel?: string;
  mentorFirstName: string;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div className="filter-field">
        <div className="label">Date</div>
        <DateTrigger label="Pick a date" value={date} onClick={onOpenDatePicker} />
      </div>
      <div className="filter-field">
        <div className="label">Time of day</div>
        <div className="pill-group">
          {(["morning", "afternoon"] as WalkTimePref[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`pill pill-sm${timePref === t ? " active" : ""}`}
              onClick={() => setTimePref(t)}
            >
              {TIME_PREF_LABEL[t]}
            </button>
          ))}
        </div>
        {availabilityLabel && (
          <span className="text-xs text-fg-tertiary" style={{ marginTop: 4 }}>
            {mentorFirstName} usually mentors: {availabilityLabel}
          </span>
        )}
      </div>
    </div>
  );
}

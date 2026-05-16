export type Role = "owner" | "walker" | "host";

/**
 * Care service taxonomy. Distinguishes services by *whose home* and
 * *day vs overnight*. Resolved 2026-05-10 (Care Catalog Taxonomy & Filter
 * Redesign) — replaces the earlier three-service model
 * (`walk_checkin | inhome_sitting | boarding`) where `inhome_sitting`
 * had drifted to mean "carer hosts dog at carer's home, daytime"
 * despite the label suggesting "carer comes to owner's home." See
 * [[Groups & Care Model]] → "Care taxonomy — the four services."
 *
 * - **walks_checkins** — Outdoor activity with the dog. Solo / group walks,
 *   walk-and-potty check-ins. Excludes home visits. Per-visit pricing.
 * - **house_sitting** — Carer goes to the OWNER's home. Includes drop-in
 *   visits (short version) through to overnight stays. Per-visit by
 *   default; per-night supported when the carer offers overnight stays.
 * - **day_care** — Carer hosts dog at the CARER's home, daytime only.
 *   Returns to owner same day. Per-visit pricing.
 * - **boarding** — Carer hosts dog at the CARER's home, overnight.
 *   Per-night pricing.
 *
 * Variant names carry intent — `house_sitting` (owner's home) vs
 * `day_care` (carer's home, day) vs `boarding` (carer's home, night).
 * Drift back to ambiguous "sitting" labels should be treated as a
 * regression in future reviews.
 */
export type ServiceType =
  | "walks_checkins"
  | "house_sitting"
  | "day_care"
  | "boarding";

export interface PetDraft {
  name: string;
  breed: string;
  size: string;
  age: string;
  temperament: string;
  goodWithDogs: boolean;
  goodWithKids: boolean;
  healthNotes: string;
}

export interface ServicePrices {
  walks_checkins: number | null; // Kč per visit
  house_sitting: number | null; // Kč per visit (per-night supported when carer offers overnight stays)
  day_care: number | null; // Kč per visit
  boarding: number | null; // Kč per night
}

export interface SignupDraft {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: Role[];
  bio: string;
  location: string;
  publicProfile: boolean;
  pet: PetDraft;
  // Dogs you can care for
  dogSizes: string[];
  dogAges: string[];
  dogTemperamentsExcluded: string[];
  dogSpecialNotes: string;
  /** @deprecated use dogSizes / dogAges / dogTemperamentsExcluded instead */
  dogsCanCareFor: string[];
  // Walking service setup
  walkingRadius: number;
  walkingDays: string[];
  walkingTimes: string[];
  // Hosting service setup
  hostDays: string[];
  hostTimes: string[];
  homeType: string;
  outdoorSpace: string;
  dogStayArea: string;
  // Pricing — set in /signup/pricing, after service setup
  prices: ServicePrices;
  acceptTos: boolean;
  acceptPrivacy: boolean;
}

export interface ExploreFilters {
  service: ServiceType | null;
  address: string;
  dateRange: { start: string | null; end: string | null };
  /** Start date for Repeat Weekly mode (ISO string YYYY-MM-DD) */
  startDate: string | null;
  times: Array<"6-11" | "11-15" | "15-22">;
  minRate: number;
  maxRate: number;
  pets: string[];
}

export interface ProviderCard {
  id: string;
  name: string;
  district: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  priceUnit: "per_walk" | "per_visit" | "per_night";
  blurb: string;
  avatarUrl: string;
  services: ServiceType[];
  /** Appointment-shape offerings (vet, grooming) tagged on the directory card
   *  so the "Appointment" filter pill on `/discover/care` matches them. The
   *  authoritative offering data lives on the bridged
   *  `UserProfile.carerProfile.services` (entries with `kind: "appointment"`);
   *  this field is the directory-level summary used for filtering and chip
   *  rendering. Discover Refinement D1, 2026-05-10. */
  appointmentTypes?: AppointmentCategory[];
  availableTimes?: Array<"6-11" | "11-15" | "15-22">;
  // Trust / proximity signals
  distanceKm?: number;
  neighbourhoodMatch?: boolean;
  mutualConnections?: number;
  // Map coordinates (WGS84) — client-side only, not stored in DB
  lat?: number;
  lng?: number;
  // Bridge to mockUsers — maps provider catalog ID to user registry ID
  userId?: string;
  // Trust badge inputs for directory-only providers (no UserProfile bridge).
  // When userId is set, the badge layer prefers the bridged UserProfile's
  // carerProfile.credentials. When directory-only, these fields are read
  // directly. Discover & Care 2026-05-04.
  credentials?: CarerCredentials;
  repeatClients?: number;
  /** Per-service base prices. When the active service filter is one of
   *  these, `CardExploreResult` swaps the displayed price to the matching
   *  entry instead of the legacy single `priceFrom + priceUnit`. Falls
   *  back to the single price on "All". Pricing & Proposals, 2026-05-04. */
  pricesByService?: Partial<
    Record<ServiceType, { priceFrom: number; priceUnit: ProviderCard["priceUnit"] }>
  >;
}

/** A single rate row inside a service block (e.g. Holiday Rate, Additional Dog Rate) */
export interface ServiceRateRow {
  label: string;
  price: string; // e.g. "480 Kč", "+ 130 Kč", "50–100%"
  unit: string; // e.g. "per visit", "per dog, per walk", "of nightly rate"
  hasTooltip?: boolean; // renders an ⓘ info icon next to the label
}

/** A weight/animal band shown as an icon row at the bottom of a service block */
export interface ServiceWeightBand {
  label: string; // e.g. "0–5 kg", "5–10 kg", "Cats"
  size: "tiny" | "small" | "medium" | "large" | "cat";
}

export interface ProviderServiceOffering {
  id: string;
  providerId: string;
  serviceType: ServiceType;
  title: string;
  shortDescription: string;
  priceFrom: number;
  priceUnit: ProviderCard["priceUnit"];
  // Extended fields for Services tab display (optional — fallback gracefully if absent)
  subtitle?: string; // e.g. "at Olga's home" shown under service title
  rates?: ServiceRateRow[]; // additional rate rows below the base price
  acceptedWeightBands?: ServiceWeightBand[]; // icon+label row at bottom of service block
}

export interface ProviderReview {
  id: string;
  providerId: string;
  authorName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface ProviderPetSummary {
  id: string;
  name: string;
  breed: string;
  weightLabel: string;
  ageLabel: string;
  imageUrl: string;
}

export interface ProviderProfileContent {
  providerId: string;
  aboutTitle: string;
  aboutHeading: string;
  aboutBody: string;
  photoMainUrl: string;
  photoSideUrl: string;
  photoCountLabel: string;
  careExperience: string[];
  medicalCare: string[];
  homeEnvironment: string[];
  pets: ProviderPetSummary[];
  services: ProviderServiceOffering[];
  reviews: ProviderReview[];
}

export type ProviderHeaderState = "expanded" | "condensed";

// ── Chat / Inbox ───────────────────────────────────────────────────────────────

export type MessageSender = "owner" | "provider";

/** `"contract"` was retired during Inbox & Notifications F3 (2026-05-08).
 *  The accepted-state footer on `BookingProposalCard` (`Signed HH:MM ·
 *  View booking →`) now carries the signing signal in the chat stream;
 *  Booking.signedAt is the canonical record. ContractCard.tsx + the
 *  `.inbox-contract-card` CSS were dropped at the same time. */
export type MessageType = "text" | "inquiry" | "booking_proposal" | "payment_summary" | "payment_confirmed";

export type BookingProposalStatus = "pending" | "accepted" | "declined" | "countered";

/**
 * Inquiry status — the lifecycle of an owner-initiated booking inquiry.
 * Discover & Care G2, 2026-05-02.
 *
 * - `pending`: just sent, awaiting any provider response.
 * - `responded`: provider has replied (chat or proposal); inquiry remains
 *   visible but the focal action moves to the proposal / chat.
 * - `withdrawn`: owner retracted, or provider declined to engage.
 */
export type InquiryStatus = "pending" | "responded" | "declined" | "withdrawn";

/**
 * Structured inquiry card — the artifact owners send when tapping "Book a
 * session" on a service card. Captures intent in a form the provider can
 * read at a glance. Lives as a `ChatMessage` of type `"inquiry"`.
 */
export interface InquiryDetails {
  bookingType: BookingType;
  serviceType: ServiceType;
  subService: string | null;
  pets: string[];
  startDate: string | null;       // ISO YYYY-MM-DD
  endDate: string | null;
  recurringSchedule?: RecurringSchedule;
  /** Optional free-text from the owner (additional context, not the
   *  templated stuff that's now structured above). */
  notes?: string;
  status: InquiryStatus;
  /** Provider's optional explanation when declining. Renders on the
   *  InquiryCard for the owner so they understand why and can decide
   *  whether to send a new request with different parameters.
   *  Pricing & Proposals walkthrough 2026-05-05. */
  declineReason?: string;
}

export type ConversationStatus = "active" | "confirmed" | "archived";

export interface BookingProposal {
  bookingType: BookingType;
  serviceType: ServiceType;
  subService: string | null;
  pets: string[];
  startDate: string;           // ISO YYYY-MM-DD
  endDate: string | null;      // null for open-ended ongoing
  recurringSchedule?: RecurringSchedule;
  price: BookingPrice;
  status: BookingProposalStatus;
  /** True when the provider deviated from the auto-computed quote. Surfaced
   *  on `BookingProposalCard` so the deviation is visible to the owner.
   *  Pricing & Proposals, 2026-05-04. */
  isOverride?: boolean;
  /** Provider's optional explanation for the deviation — "repeat client
   *  discount", "introductory rate", etc. Rendered alongside the price
   *  when `isOverride` is true. */
  overrideReason?: string;
  /** ISO timestamp set when the proposal flips to `accepted`. Rendered
   *  inline in the accepted-state footer (`Signed HH:MM · View booking`)
   *  so the chronicle artifact carries its own signing time without
   *  needing a separate contract card in the chat stream.
   *  Sessions & Service Execution, 2026-05-05. */
  signedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  text?: string;
  inquiry?: InquiryDetails;
  proposal?: BookingProposal;
  paymentSummary?: PaymentSummary;
  sentAt: string; // ISO timestamp
  read: boolean;
}

export interface PaymentSummary {
  lineItems: PriceLineItem[];
  platformFeePercent: number;
  platformFeeAmount: number;
  total: number;
  currency: "Kč";
  status: "pending" | "paid";
}

/** Structured inquiry card created when a conversation is first started */
export interface ConversationInquiry {
  bookingType: BookingType;
  serviceType: ServiceType;
  /** e.g. "Solo walk", "Day care" — sub-service from the filter accordion */
  subService: string | null;
  /** Pet names selected for this booking, e.g. ["Spot", "Goldie"] */
  pets: string[];
  startDate: string | null;
  endDate: string | null;
  recurringSchedule?: RecurringSchedule;
  /** Free-text dog name(s) for display when pets array is not enough */
  dogName: string;
  message: string;
}

// ── Bookings / Contracts ───────────────────────────────────────────────────────

export type BookingType = "one_off" | "ongoing";

export type ContractStatus =
  | "proposed"    // pending owner accept — proposal sent but not yet signed.
                  //   Mirrored to the Bookings tab as the "pipeline" state.
                  //   Discover & Care G5, 2026-05-02.
  | "upcoming"    // signed, hasn't started yet
  | "active"      // in progress
  | "completed"   // finished
  | "cancelled"   // cancelled by either party
  | "paused";     // ongoing, temporarily paused

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface RecurringSchedule {
  days: DayOfWeek[];
  time: string;       // e.g. "08:00"
  timeLabel: string;  // e.g. "8:00–9:00am"
}

export interface PriceLineItem {
  label: string;       // e.g. "Solo walk (Mon–Fri)"
  amount: number;      // Kč
  unit: string;        // e.g. "per session", "per night"
  isModifier?: boolean;
  /** Short explainer rendered under the label on proposal cards — e.g.
   *  "Dec 25 falls in this booking", "2 extra pets", "Booking starts in
   *  2 days." Set by `computeQuote` so the proposal explains itself.
   *  Pricing & Proposals, 2026-05-04. */
  triggerNote?: string;
}

export interface BookingPrice {
  lineItems: PriceLineItem[];
  total: number;
  currency: "Kč";
  billingCycle: "per_session" | "per_night" | "total" | "monthly_est" | "weekly";
}

/**
 * Visit report — the structured artifact a provider sends at session
 * close-out. Per Time To Pet research, this is what makes pet parents
 * feel safe: photos, notes, structured care checks, timestamps.
 *
 * The report object exists from the moment the provider adds anything
 * during the active session — photos accumulate, notes / checks /
 * metrics get composed inline on the Active panel — and is sealed when
 * the provider taps Finish. `completedAt` is the seal timestamp;
 * absence means the report is still draft (session.status === "in_progress").
 *
 * Sessions & Service Execution, 2026-05-05.
 */
export interface VisitReport {
  /** Photos sent with the report. Accumulate during the active session
   *  (mid-session photo updates); sealed when the provider finishes. */
  photos: string[];
  /** Provider's written notes. Required at finish (≥1 char). May be
   *  empty / undefined while the session is in progress. */
  notes?: string;
  /** **Dormant 2026-05-07** — UI removed (every-walk-has-Walked-✓ chips
   *  read as noise). Field kept on the type so a richer comeback (e.g.
   *  medication doses tied to pet info) doesn't need a migration. Not
   *  read by any current renderer; do not seed in new mock data. See
   *  Open Questions §4 → "Care checks — dormant." */
  checks?: {
    fed?: boolean;
    watered?: boolean;
    walked?: boolean;
    pottied?: boolean;
    medsGiven?: boolean;
  };
  /** Walk metrics — present when service is a walk. May be auto-derived
   *  from GPS tracking (when `gpsStartedAt` is set) or entered manually
   *  via the modal's walk-details inputs. */
  walkDistanceKm?: number;
  walkDurationMin?: number;
  /** ISO timestamp when the provider tapped "Log route with GPS" on the
   *  active panel. Demo-state field — actual GPS tracking is deferred;
   *  during the active session, distance/duration tick up via a simple
   *  time-based simulation. On finish, the simulated values get sealed
   *  into `walkDistanceKm` / `walkDurationMin`. Sessions & Service
   *  Execution A3 walkthrough, 2026-05-05. */
  gpsStartedAt?: string;
  /** Set when the provider seals the report (status flips to
   *  "completed"). Absence means draft / in-progress. */
  completedAt?: string;
  /** Set when the provider edits the report after sealing. Drives the
   *  silent "edited" tag on the visit-report card. Last-write-wins —
   *  no chronicle of prior versions; the field updates each time the
   *  provider saves an edit. Inbox & Notifications E2, 2026-05-08. */
  editedAt?: string;
}

export interface BookingSession {
  id: string;
  date: string;         // ISO YYYY-MM-DD
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
  checkedInAt?: string; // ISO timestamp — set when status moves to in_progress
  /** Visit report — created lazily when the provider adds the first
   *  artifact during an in-progress session (photo, note, check, metric).
   *  Lives in draft state through in_progress and is sealed when the
   *  provider taps Finish; sealing sets `completedAt` and flips
   *  `session.status` to "completed". Sessions & Service Execution,
   *  2026-05-05. */
  report?: VisitReport;
  /** Legacy single-note field. Pre-VisitReport completed sessions in
   *  seeded mock data may have `note` without `report`; renderers fall
   *  back to this when `report` is absent. New finish writes `report`. */
  note?: string;
  /** Legacy single-photo field. Same fallback rules as `note`. */
  photoUrl?: string;
}

export interface Booking {
  id: string;
  conversationId: string | null;  // links to inbox thread (null for seeded data with no thread)
  // Parties
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
  carerId: string;
  carerName: string;
  carerAvatarUrl: string;
  // Service
  type: BookingType;
  serviceType: ServiceType;
  subService: string | null;
  pets: string[];
  // Dates
  startDate: string;        // ISO YYYY-MM-DD
  endDate: string | null;   // null for open-ended ongoing
  recurringSchedule?: RecurringSchedule;  // only for ongoing
  // Price
  price: BookingPrice;
  // Notes
  ownerNotes?: string;  // care instructions from owner (feeding, habits, key location, etc.)
  carerNotes?: string;  // provider notes (house rules, what to bring, etc.)
  // State
  status: ContractStatus;
  sessions?: BookingSession[];  // ongoing only
  signedAt: string;  // ISO timestamp
  paymentStatus?: "unpaid" | "paid";
  cancellationReason?: string;
  /** Per-occurrence cancellations on a recurring booking. Keyed by ISO
   *  date — provider cancels a single session ("this Wednesday is rained
   *  out") without ending the whole booking. The session entry's status
   *  flips to "cancelled" and this map captures the reason + when.
   *  Sessions & Service Execution F1, 2026-05-05. Meets-side parallel
   *  (Open Questions §3) lives as a follow-up side task. */
  cancelledDates?: Record<string, { reason: string; cancelledAt: string }>;
}

export type ConversationType = "booking" | "direct";

export interface Conversation {
  id: string;
  /** "booking" = care inquiry thread; "direct" = 1:1 messaging between connected users */
  conversationType: ConversationType;
  providerId: string;
  providerName: string;
  providerAvatarUrl: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
  status: ConversationStatus;
  inquiry: ConversationInquiry;
  messages: ChatMessage[];
  /** Derived: id of most recent message */
  lastMessageId: string;
  unreadCount: number;
}

// ── Notifications ──────────────────────────────────────────────────────────────

export type NotificationType =
  | "session_started"
  | "session_completed"
  | "new_message"
  | "booking_message"
  | "booking_proposal"
  | "booking_confirmed"
  | "meet_invite"
  | "meet_reminder"
  | "meet_rsvp"
  /**
   * Fired when a recurring series the user is *following* publishes new
   * upcoming dates (or has the next occurrence approaching). Series-level
   * subscription is `Meet.followers`. Stubbed for the prototype — the full
   * delivery pipeline (24h-before reminders, batched "new dates added"
   * digests, opt-out) belongs with the broader notifications work, not this
   * phase. See `docs/phases/meet-recurrence-model.md` workstream G2.
   */
  | "meet_series_update"
  | "post_meet_review"
  | "connection_request"
  | "connection_accepted"
  | "group_activity"
  | "post_comment"
  | "care_review";

export interface AppNotification {
  id: string;
  type: NotificationType;
  /** The user this notification is addressed to. Notifications are
   *  filtered at the context layer so each persona's bell shows only
   *  their own — without this, an actor (e.g. carer triggering Start /
   *  Finish) would get notified about events they themselves caused.
   *  Inbox & Notifications walkthrough fix, 2026-05-08. */
  recipientId: string;
  title: string;
  body: string;
  avatarUrl?: string;
  href?: string;
  createdAt: string;
  read: boolean;
}

// ── Reviews ────────────────────────────────────────────────────────────────────

export interface UserReview {
  id: string;
  bookingId: string;
  authorId: string;
  authorName: string;
  carerName: string;
  carerAvatarUrl: string;
  rating: number;   // 1–5
  text: string;
  createdAt: string;
  /** Optional dog-photo from owner submitted with the review.
   *  Sessions & Service Execution, 2026-05-05. */
  photoUrl?: string;
  /** Default true. Surfaced on the carer's profile as a "would book
   *  again" tally. */
  wouldBookAgain?: boolean;
  /** Visibility rule (Sessions & Service Execution, 2026-05-05): rating
   *  + text both present → public review. Rating-only → private feedback
   *  to the carer (skipped from the public Reviews list). */
  isPrivate?: boolean;
}

// ── Meets ─────────────────────────────────────────────────────────────────────

export type MeetType = "walk" | "park_hangout" | "playdate" | "training";

export type MeetStatus = "upcoming" | "in_progress" | "completed" | "cancelled";

/**
 * Recurrence cadence for a meet.
 * - `"one_off"`: single non-recurring event. Per-instance attendance lives on `Meet.attendees`.
 * - `"weekly"` / `"biweekly"` / `"monthly"`: recurring series. Per-occurrence attendance
 *   lives on `Meet.attendeesByDate` (keyed by ISO YYYY-MM-DD); series-level subscription
 *   lives on `Meet.followers`.
 *
 * See `docs/phases/meet-recurrence-model.md` for the full model and rationale.
 */
export type MeetCadence = "one_off" | "weekly" | "biweekly" | "monthly";

/**
 * Per-meet visibility, layered on top of the parent group's visibility.
 * - "public": anyone can see and RSVP (only allowed when the parent group is open)
 * - "group_only": only members of the parent group can see and RSVP
 * - "participants_only": only the creator and the booked roster can see the meet.
 *   System-generated for contracted/package-booked instances (e.g. Hana's 8-session
 *   1-on-1 with Klára). Never user-selectable in the composer. Filtered out of
 *   group Meets tabs, Discover, and the schedule's "suggested" lane unless the
 *   viewer is on the roster. See `Groups & Care Model.md` → Services as Catalog.
 */
export type MeetVisibility = "public" | "group_only" | "participants_only";

export type LeashRule = "on_leash" | "off_leash" | "mixed";

export type DogSizeFilter = "small" | "medium" | "large" | "any";

/** Shared: dog energy level filter for all meet types */
export type MeetEnergyLevel = "calm" | "moderate" | "high" | "any";

// ── Walk-specific ──

export type WalkPace = "leisurely" | "moderate" | "brisk";
export type WalkDistance = "short" | "medium" | "long";
export type WalkTerrain = "paved" | "trails" | "mixed";

export interface WalkFields {
  pace?: WalkPace;
  distance?: WalkDistance;
  terrain?: WalkTerrain;
  routeNotes?: string;
}

// ── Park Hangout-specific ──

export type ParkAmenity = "fenced_area" | "water_available" | "shade" | "benches" | "parking_nearby";
export type ParkVibe = "casual" | "organised";

export interface ParkHangoutFields {
  /** When true, the meet time is a drop-in window (come anytime between time and endTime) */
  dropIn?: boolean;
  /** End of the drop-in window (e.g. "12:00"). Only used when dropIn is true */
  endTime?: string;
  amenities?: ParkAmenity[];
  vibe?: ParkVibe;
}

// ── Playdate-specific ──

export type PlaydateAgeRange = "puppy" | "young" | "adult" | "senior" | "any";
export type MeetPlayStyle = "gentle" | "active" | "mixed";

export interface PlaydateFields {
  ageRange?: PlaydateAgeRange;
  playStyle?: MeetPlayStyle;
  fencedArea?: boolean;
  maxDogsPerPerson?: number;
}

// ── Training-specific ──

export type TrainingSkill = "recall" | "leash_manners" | "socialisation" | "obedience" | "agility" | "tricks";
export type TrainingExperienceLevel = "beginner" | "intermediate" | "advanced" | "all_levels";
export type TrainerType = "peer" | "professional";

export interface TrainingFields {
  skillFocus?: TrainingSkill[];
  experienceLevel?: TrainingExperienceLevel;
  ledBy?: TrainerType;
  trainerName?: string;
  equipmentNeeded?: string[];
}

// ── Meet attendee & main interface ──

/** RSVP status for meet attendance */
export type RsvpStatus = "going" | "interested";

export interface MeetAttendee {
  userId: string;
  userName: string;
  avatarUrl: string;
  dogNames: string[];
  /** RSVP status: "going" (default, counted toward capacity) or "interested" (social signal only) */
  rsvpStatus?: RsvpStatus;
  /** Neighbourhood for participant card display */
  neighbourhood?: string;
  /** Dog breed for participant card display */
  dogBreed?: string;
  /** Whether this user's profile is open (for participant list tiering) */
  profileOpen?: boolean;
}

/**
 * A single occurrence of a meet — a one-off event, or one specific date of a
 * recurring series. The unit that schedule views, RSVP buttons, and
 * "next-3-occurrences" surfaces operate on. Construct via `getMeetOccurrences`
 * or `getUserMeetInstances` rather than ad-hoc literals so attendee resolution
 * stays in one place.
 */
export interface MeetOccurrence {
  meet: Meet;
  /** ISO YYYY-MM-DD. For one-off meets this equals `meet.date`. */
  date: string;
  /** Resolved attendee list for this specific occurrence. */
  attendees: MeetAttendee[];
}

export interface Meet {
  id: string;
  type: MeetType;
  title: string;
  description: string;
  location: string;
  /** Neighbourhood name for hyper-local framing (e.g. "Vinohrady") */
  neighbourhood?: string;
  /** WGS84 coordinates for map pin */
  lat: number;
  lng: number;
  date: string;          // ISO YYYY-MM-DD
  time: string;          // e.g. "08:00"
  durationMinutes: number;
  /**
   * Recurrence cadence. `"one_off"` = single non-recurring event; everything else is a
   * recurring series anchored at `(date, time)`. Replaces the legacy `recurring: boolean`
   * field — use the `isRecurring(meet)` helper if you need a boolean.
   */
  cadence: MeetCadence;
  /**
   * Optional ISO YYYY-MM-DD end date for a recurring series. Occurrences after this
   * date are not generated. Undefined = ongoing. Only meaningful when cadence !== "one_off".
   */
  seriesEndDate?: string;
  maxAttendees: number;
  dogSizeFilter: DogSizeFilter;
  leashRule: LeashRule;
  status: MeetStatus;
  /**
   * Reason the meet was cancelled — surfaced in the cancellation banner on
   * meet detail and on the Schedule cancelled card. Only meaningful when
   * `status === "cancelled"`. Kept as a separate field rather than rewriting
   * `description` so the original meet info stays intact (viewers can still
   * see what it was supposed to be).
   *
   * For recurring meets this represents *series-level* cancellation —
   * the entire series is dead. Per-occurrence cancellation ("just this
   * Wednesday is rained out") lives on `cancelledDates` instead, and the
   * series stays active.
   */
  cancellationReason?: string;
  /**
   * Per-occurrence cancellations for recurring meets, keyed by ISO YYYY-MM-DD.
   * The host marks a single date dead ("rained out") without killing the
   * series; the row renders as cancelled on meet detail's Upcoming dates
   * section and on the Schedule, with the original info preserved. The
   * series-level fields (`status`, `cancellationReason`) are untouched —
   * the series keeps generating future occurrences as normal.
   *
   * Distinct from per-user Skip (`useDismissedReviews` with `kind:
   * "meet-skip"`): cancel is a host action affecting all attendees;
   * Skip is a user action affecting only that user.
   *
   * Sparse — only contains keys for cancelled dates. Undefined / empty
   * for one-off meets (use `status === "cancelled"` + `cancellationReason`
   * for those — there's only one occurrence to cancel).
   */
  cancelledDates?: Record<string, { reason: string; cancelledAt: string }>;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl: string;
  /**
   * Attendees for this meet.
   *
   * - For one-off meets (`cadence: "one_off"`): the only attendee list. Authoritative.
   * - For recurring meets: a *representative* list — typically the next upcoming
   *   occurrence's attendees. Used by legacy/compact callsites that just want a
   *   single list to render (avatar stacks, summaries). Authoritative per-date
   *   attendees live on `attendeesByDate`. Instance-aware UI (Schedule cards,
   *   meet detail's per-date RSVP rows, post-meet review) should read via
   *   `getOccurrenceAttendees(meet, date)` instead.
   *
   * Carrying both fields on recurring meets is deliberate prototype-stage
   * tradeoff: data duplication in exchange for migration safety. See
   * `docs/phases/meet-recurrence-model.md`.
   */
  attendees: MeetAttendee[];
  /**
   * Per-occurrence attendees for recurring meets, keyed by ISO YYYY-MM-DD.
   * Sparse — only contains keys where someone has actually RSVP'd or where mock
   * data has seeded an occurrence. Use `getMeetOccurrences(meet, count)` to derive
   * the next N dates from `(date, cadence)` and merge in any keyed entries.
   * Undefined / empty for `cadence: "one_off"` meets.
   */
  attendeesByDate?: Record<string, MeetAttendee[]>;
  /**
   * Series-level subscribers — userIds following this recurring series.
   * Following surfaces the series in Discover and opts the user in to upcoming-date
   * notifications; it does NOT imply Going to any specific occurrence (RSVP is always
   * per-instance). Undefined / empty for `cadence: "one_off"` meets.
   */
  followers?: string[];
  createdAt: string;     // ISO timestamp
  /** The group this meet belongs to. Every meet belongs to a group (park, neighbor, interest, or care). */
  groupId: string;
  /** Who can see and RSVP — "public" (anyone, open groups only) or "group_only" (members only). */
  visibility: MeetVisibility;
  /** Activity indicator text (e.g. "Jana joined 2h ago") */
  recentJoinText?: string;
  /** Flagged as popular (shows badge on card) */
  isPopular?: boolean;
  /** Cover photo for the meet (hero image) */
  coverPhotoUrl?: string;
  /** Photo URLs from a completed meet */
  photos?: string[];

  // ── Shared enhancement fields (all types) ──

  /** Dog energy level filter */
  energyLevel?: MeetEnergyLevel;
  /** Suggested items to bring */
  whatToBring?: string[];
  /** Terrain/access notes for humans and dogs */
  accessibilityNotes?: string;

  // ── Type-specific fields (only relevant fields populated per type) ──

  /** Walk-specific: pace, distance, terrain, route notes */
  walk?: WalkFields;
  /** Park Hangout-specific: drop-in window, amenities, vibe */
  parkHangout?: ParkHangoutFields;
  /** Playdate-specific: age range, play style, fenced area, max dogs */
  playdate?: PlaydateFields;
  /** Training-specific: skill focus, experience level, trainer info, equipment */
  training?: TrainingFields;

  // ── Service group meets ──

  /** Optional CTA for service-group meets (booking link, price, spots) */
  serviceCTA?: {
    label: string;
    href: string;
    price?: string;
    spotsLeft?: number;
  };

  /**
   * Meet ↔ Service linkage (Service ↔ Meet Linkage phase, Workstream A1/A3,
   * 2026-05-13). The inverse side of `CarerMeetServiceConfig.linkedMeetIds[]`
   * — each entry references a carer's Meet-type service that's offered on
   * this meet, with the per-link `required` flag.
   *
   * - `required: true` → booking the service IS the RSVP. Free RSVP CTA
   *   collapses on the meet card; sole CTA is "Book session". Used for
   *   paid-only-roster meets (e.g. Klára's Group training).
   * - `required: false` → optional service link. Meet stays free-to-join;
   *   service surfaces as a supplementary callout ("Have your dog walked
   *   specifically: 300 Kč →"). Mixed roster (free attendees + paid
   *   attendees in the same occurrence).
   *
   * Sparse — undefined / empty for unlinked meets. Read via
   * `getServicesLinkedToMeet(meetId)`.
   *
   * Why `required` lives here and not on the service: required-ness is a
   * meet-level RSVP-gate property — it determines whether the free CTA
   * collapses for this meet, which is a meet concern. The same service
   * could in principle be required on one of its linked meets and
   * optional on another (e.g. Klára's "Group walk" service required on
   * her premium Saturday cohort, optional on her open Tuesday walk).
   * Storing required on the link rather than the service preserves that
   * flexibility.
   */
  linkedServices?: { serviceId: string; required: boolean }[];
}

// ── Connections ───────────────────────────────────────────────────────────────

/** Trust ladder: locked → open → familiar → connected */
export type ConnectionState = "none" | "familiar" | "pending" | "connected";

export interface Connection {
  id: string;
  /** The other user */
  userId: string;
  userName: string;
  avatarUrl: string;
  dogNames: string[];
  location: string;
  /** Current state from our perspective */
  state: ConnectionState;
  /** Meet where we first met (optional) */
  metAt?: string;
  /** When the connection state last changed */
  updatedAt: string;
  /** Number of meets attended together */
  meetsShared?: number;
  /** ISO date of first shared meet */
  firstMetDate?: string;
  /** ISO date of most recent shared meet */
  lastMetDate?: string;
  /** Mutual connection names for trust signals */
  mutualConnections?: string[];
  /** Shared community/group names */
  sharedGroups?: string[];
  /** Whether this person has marked *us* as Familiar (for "Wants to connect" framing) */
  theyMarkedFamiliar?: boolean;
  /** Dog breed (for participant card display) */
  dogBreed?: string;
  /** Neighbourhood */
  neighbourhood?: string;
  /** Whether this user's profile is open */
  profileOpen?: boolean;
}

// ── Groups (Communities) ─────────────────────────────────────────────────────

export type GroupVisibility = "open" | "approval" | "private";

/** Care group sub-categories for provider-hosted groups */
export type CareCategory = "training" | "walking" | "grooming" | "boarding" | "rehab" | "venue" | "other";

/** Gallery display mode for care groups */
export type GalleryMode = "standard" | "portfolio" | "updates";

/** A service listed within a care group (provider's service menu) */
export interface GroupServiceListing {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  priceUnit: string;        // e.g. "per session", "per walk", "per night"
  /** Optional booking link (routes to provider's care booking flow) */
  bookingHref?: string;
  /** Whether this service is currently offered */
  active: boolean;
}

/** Configuration for care groups — controls which features are enabled */
export interface CareGroupConfig {
  /** Can the group host events with booking CTAs? */
  eventsEnabled: boolean;
  /** Can events link to provider's booking flow? */
  bookingCTAsEnabled: boolean;
  /** Is the discussion/post feed active? */
  discussionEnabled: boolean;
  /** Show provider's service menu in the group? */
  serviceListingsVisible: boolean;
  /** Fixed address / Area-based / Mobile */
  locationType: "fixed" | "area" | "mobile";
  /** Show available spots on events/services? */
  capacityEnabled: boolean;
  /** Gallery display mode */
  galleryMode: GalleryMode;
}

/** Park = auto-generated for parks. Neighbor = hyperlocal mutual-aid. Interest = breed/activity/need. Care = provider-hosted. */
export type GroupType = "park" | "neighbor" | "interest" | "care";

export type PhotoPolicy = "encouraged" | "optional" | "none";

export type GroupMemberRole = "admin" | "member";

export interface GroupMember {
  userId: string;
  userName: string;
  avatarUrl: string;
  dogNames: string[];
  role: GroupMemberRole;
  joinedAt: string;
}

/**
 * One provider running (or co-running) a Care group. Carries display info
 * inline because not every Care group provider has a UserProfile — directory-
 * only providers (e.g. "dognut", "premiumvet") still need a name + avatar.
 * See [[Groups & Care Model]] → Care Group Admin Model.
 */
export interface GroupProviderRef {
  /** UserProfile id when the provider is a real user; otherwise a
   *  directory-only provider id (no UserProfile). Resolved via
   *  `getUserOrProvider` when richer info is needed. */
  userId: string;
  name: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  /** Park / Neighbor / Interest / Care archetype */
  groupType: GroupType;
  visibility: GroupVisibility;
  neighbourhood: string;
  location: string;
  coverPhotoUrl: string;
  creatorId: string;
  creatorName: string;
  members: GroupMember[];
  photos: string[];
  /** Photo culture setting — controls whether photo posts are allowed/encouraged */
  photoPolicy: PhotoPolicy;
  createdAt: string;
  /** Care groups only: provider(s) running the group. Generalised from
   *  single `hostedBy` to support multi-provider groups (vet practices,
   *  boarding facilities, rehab clinics with multiple staff). The first
   *  entry is the primary attribution for compact surfaces. */
  providers?: GroupProviderRef[];
  /** Care groups only: service sub-category */
  careCategory?: CareCategory;
  /** Care groups only: provider service listings */
  serviceListings?: GroupServiceListing[];
  /** Care groups only: gallery display mode (default: "standard") */
  galleryMode?: GalleryMode;
  /** Care groups only: fixed location address */
  locationFixed?: string;
  /** Care groups only: show capacity indicators */
  capacityEnabled?: boolean;
  /** Care groups only: full configuration */
  careConfig?: CareGroupConfig;
}

export type GroupMessageType = "user" | "system";
export type GroupActivityType = "member_joined" | "meet_posted" | "rsvp_milestone";

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  text: string;
  sentAt: string;
  type?: GroupMessageType;
  activityType?: GroupActivityType;
}

// ── Meet Group Threads ────────────────────────────────────────────────────────

export interface MeetMessage {
  id: string;
  meetId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  text: string;
  sentAt: string; // ISO timestamp
}

// ── User / Profile ─────────────────────────────────────────────────────────────

export type TimeSlot = "morning" | "afternoon" | "evening";

export type EnergyLevel = "low" | "moderate" | "high" | "very_high";

export type PlayStyle =
  | "fetch"
  | "tug"
  | "chase"
  | "wrestling"
  | "gentle"
  | "independent"
  | "sniffing";

export interface VetInfo {
  clinicName?: string;
  vetPhone?: string;
  lastCheckup?: string;       // ISO YYYY-MM-DD
  vaccinationsUpToDate: boolean;
  spayedNeutered: boolean;
  medications?: string;       // free-text list of current meds
  conditions?: string;        // free-text known conditions
}

export interface PetProfile {
  id: string;
  name: string;
  breed: string;
  weightLabel: string;  // e.g. "18 kg"
  ageLabel: string;     // e.g. "4 years"
  imageUrl: string;
  notes?: string;
  // Enhanced fields (Phase 5)
  energyLevel?: EnergyLevel;
  playStyles?: PlayStyle[];
  socialisationNotes?: string;
  vetInfo?: VetInfo;
  photoGallery?: string[];    // additional photo URLs beyond imageUrl
}

export interface CarerAvailabilitySlot {
  day: DayOfWeek;
  slots: TimeSlot[];
}

/**
 * A provider's catalogue entry. Three shapes, distinguished by what booking
 * produces (see [[Groups & Care Model]] → Services as Catalog):
 *
 * - **Care-type** (`kind: "care"`) — Walking, Sitting, Boarding. Drop-off.
 *   Owner doesn't sign up to a specific time; booking produces a Booking record.
 * - **Meet-type** (`kind: "meet"`) — Training sessions, workshops, paid group
 *   walks. Owner signs up to a specific time; booking produces an attendance
 *   on a specific Meet (with a public/private/participants_only roster).
 * - **Appointment-type** (`kind: "appointment"`) — Vet visits, grooming.
 *   Owner books a specific time slot but doesn't attend a session with other
 *   dogs (no roster). Booking produces a Booking record like Care, but is
 *   tied to a fixed time like Meet — solo. Specialised category (vet vs.
 *   grooming) influences card icon and copy.
 *
 * The Services tab on a profile renders all three kinds in a single catalogue;
 * tap routing differs by `kind`.
 *
 * **Service ↔ Meet linkage.** Only Meet-type services link to meets (via
 * `linkedMeetIds: string[]`). Care and Appointment services have no Meet
 * linkage — Care is drop-off without a roster, Appointment is solo + scheduled
 * without a roster. The link is one-to-many: one Meet service can run on
 * multiple meets (same product, different scheduled times). The inverse —
 * which services a given meet advertises, plus the per-link `required` flag —
 * lives on `Meet.linkedServices[]`. See Service ↔ Meet Linkage phase + OQ §13.
 */
export type CarerServiceConfig =
  | CarerCareServiceConfig
  | CarerMeetServiceConfig
  | CarerAppointmentServiceConfig;

/**
 * Per-service pricing modifiers. Discriminated union — each modifier kind
 * carries its own params. Stacked into `BookingPrice.lineItems` by
 * `computeQuote` in `lib/pricing.ts`. Stacking order: flat-per-unit
 * modifiers (multi-pet) apply to the base before percentage modifiers
 * compound on the subtotal.
 *
 * Pricing & Proposals, 2026-05-04. Starter set ships four kinds; future
 * passes will add longer-walk, off-hours, boarding-specific (yard, house
 * type, max-dogs-at-once), add-on services, and package rates.
 */
export type PricingModifier =
  | HolidayPricingModifier
  | WeekendPricingModifier
  | MultiPetPricingModifier
  | LastMinutePricingModifier;

export interface HolidayPricingModifier {
  kind: "holiday";
  enabled: boolean;
  /** Percentage applied to the running subtotal. 25 = +25%. */
  pct: number;
}

export interface WeekendPricingModifier {
  kind: "weekend";
  enabled: boolean;
  /** Percentage applied to the running subtotal. 15 = +15%. */
  pct: number;
}

export interface MultiPetPricingModifier {
  kind: "multi_pet";
  enabled: boolean;
  /** Flat Kč added per extra pet above the first. */
  flatPerExtra: number;
}

export interface LastMinutePricingModifier {
  kind: "last_minute";
  enabled: boolean;
  /** Percentage applied to the running subtotal. 10 = +10%. */
  pct: number;
  /** Booking starts within this many days from `today` → modifier triggers. */
  thresholdDays: number;
}

// `WalkPace` already exists higher up the file (Meet domain); reused here
// for the Carer service config so the filter and meet schemas align on
// "leisurely / moderate / brisk." Discover Refinement D3, 2026-05-10.

/** Walks-specific: leash policy. Surfaces as filter dimension and on
 *  profile. Discover Refinement D3, 2026-05-10. */
export type LeashPolicy = "always" | "off_leash_areas" | "case_by_case";

/** Sitting/Boarding-specific: home setting category. Discover Refinement
 *  D3, 2026-05-10. */
export type HomeType = "flat" | "house" | "ground_floor_with_garden";

export interface CarerCareServiceConfig {
  kind: "care";
  serviceType: ServiceType;
  enabled: boolean;
  pricePerUnit: number;
  priceUnit: "per_visit" | "per_night";
  subServices: string[];
  notes?: string;
  /** Optional pricing modifiers stacked onto the base rate at quote time.
   *  See `lib/pricing.ts:computeQuote`. Empty/undefined = base rate only.
   *  Pricing & Proposals, 2026-05-04. */
  modifiers?: PricingModifier[];

  /* ─── Service-aware filter dimensions (Discover Refinement D3, 2026-05-10) ───
   * Each serviceType reads only the fields relevant to it. The filter UI in
   * `/discover/care` renders different field groups per active service pill;
   * the data shape is flat (all-optional on this interface) so the discriminator
   * is `serviceType`, not a nested type — keeps the API legible.
   */

  /** Walks: pace expectation. */
  pace?: WalkPace;
  /** Walks: leash policy. */
  leashPolicy?: LeashPolicy;
  /** Sitting / Boarding: type of home the carer offers. */
  homeType?: HomeType;
  /** Sitting / Boarding: carer has own dog(s) on premises. */
  hasOwnDogs?: boolean;
  /** Boarding: outdoor space (yard / garden / terrace). */
  hasYard?: boolean;
  /** Boarding: max simultaneous dogs the carer takes. */
  maxDogs?: number;
}

/** Format hint for Meet-type catalogue cards. */
export type MeetServiceFormat = "one_on_one" | "small_group" | "workshop";

/** Cadence for Meet-type offerings. `ad_hoc` = scheduled per-request, no fixed series. */
export type MeetServiceCadence = "weekly" | "biweekly" | "monthly" | "ad_hoc";

export interface CarerMeetServiceConfig {
  kind: "meet";
  /** Stable id within the provider's catalogue (e.g. "klara-1on1-training"). */
  id: string;
  /** Display title (e.g. "1-on-1 training session", "Reactive dog session"). */
  title: string;
  enabled: boolean;
  pricePerSession: number;
  format: MeetServiceFormat;
  cadence: MeetServiceCadence;
  durationMinutes: number;
  notes?: string;
  /**
   * Meets this service is offered on. One-to-many — the same service can run
   * on multiple meets (e.g. a "Group walk" service offered on the carer's
   * Tuesday walk AND Saturday walk, same product at two scheduled times,
   * without duplicating the service entry).
   *
   * The link's `required` flag (booking-is-the-RSVP vs optional/mixed-roster)
   * lives on the **Meet** side at `Meet.linkedServices[].required` — that's
   * a meet-level RSVP-gate property (determines whether the free CTA
   * collapses). This array is the carer-authoritative declaration of which
   * meets advertise this service; the Meet side mirrors with link
   * properties. Use `getServicesLinkedToMeet(meetId)` for the inverse.
   *
   * Empty array = service exists but has no scheduled occurrences yet.
   * A valid state (carer is selling the offering ad-hoc / by arrangement).
   *
   * Service ↔ Meet Linkage, Workstream A1, 2026-05-13. Replaces the prior
   * singular `seriesMeetId?: string`.
   */
  linkedMeetIds: string[];
}

/**
 * Specialised Appointment-type sub-categories. Vet was retired 2026-05-11
 * — not a likely user-type for the demo arc (Lenka N. + the PremiumVet
 * group was already repurposed as Mánesova Grooming Salon during Discover
 * Refinement). `"training"` is the forward-looking variant for facilities
 * that offer in-house solo training visits (distinct from Klára's group
 * training meets, which model as `kind: "meet"`); no seeded data yet, but
 * the type carries the dimension so future arrivals don't require a
 * follow-up migration.
 */
export type AppointmentCategory = "grooming" | "training";

export interface CarerAppointmentServiceConfig {
  kind: "appointment";
  /** Stable id within the provider's catalogue (e.g. "premiumvet-checkup"). */
  id: string;
  /** Display title (e.g. "Annual checkup", "Full groom — small breed"). */
  title: string;
  enabled: boolean;
  pricePerAppointment: number;
  /** Approximate duration — drives slot scheduling and card display. */
  durationMinutes: number;
  /** Specialised category — vet vs grooming influences card icon + copy.
   *  Resolved 2026-05-02 in Discover & Care C1: vet/grooming offerings are
   *  neither pure Care (drop-off, no specific time) nor pure Meet (specific
   *  time, social roster) — they're appointment-type. */
  appointmentCategory: AppointmentCategory;
  notes?: string;
}

export type CarerVisibility = "open" | "connected_only" | "familiar_and_above";

/**
 * Self-declared credentials on a carer's profile. Mirror what Prague
 * providers already advertise (cynology degree, Národní kvalifikace,
 * force-free methodology, first aid). Power the credential trust badges
 * — see [[implementation/badges]] and [[Competitive Research - Prague Dog Care Scene]].
 *
 * `verified` is reserved for a future production verification flow.
 * Today every credential renders as self-declared.
 */
export interface CarerCredentials {
  yearsExperience?: number;
  /** Methodology statement — e.g. "Force-free, positive reinforcement". */
  methodology?: string;
  firstAidTrained?: boolean;
  /** Free-form certificate names (Národní kvalifikace, Agility Club, etc.). */
  certifications?: string[];
  insured?: boolean;
  /** Future production toggle. Today only used by demo seed data to flag a
   *  small handful of providers as having completed identity verification. */
  identityVerified?: boolean;
}

export interface CarerProfile {
  bio: string;
  location: string;
  availability: CarerAvailabilitySlot[];
  services: CarerServiceConfig[];
  publicProfile: boolean;
  visibility?: CarerVisibility;
  acceptingBookings?: boolean;
  credentials?: CarerCredentials;
  /** Repeat-booking metric — count of distinct owners who've booked 3+ times.
   *  Mock data field for demo; production derives from booking history. */
  repeatClients?: number;
}

export type TagApproval = "auto" | "approve" | "none";

/** Profile visibility: Locked (default) or Open */
export type ProfileVisibility = "locked" | "open";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  /** Hyper-local neighbourhood name (e.g. "Vinohrady") */
  neighbourhood?: string;
  memberSince: string;  // "YYYY-MM"
  pets: PetProfile[];
  openToHelping?: boolean;
  carerProfile?: CarerProfile;
  /** Controls how the user can be tagged in posts */
  tagApproval?: TagApproval;
  /** Global profile visibility setting (default: "locked") */
  profileVisibility?: ProfileVisibility;
  /** Short code for share-profile link (e.g. "shawn-abc123") */
  shareCode?: string;
}

// ── Posts & Feed ──────────────────────────────────────────────────────────────

export type PostTagType = "dog" | "person" | "community" | "place" | "meet";

export interface PostTag {
  type: PostTagType;
  /** ID of the tagged entity (dog ID, user ID, group ID, or place slug) */
  id: string;
  /** Display name */
  label: string;
}

export interface PostReaction {
  userId: string;
  userName: string;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  createdAt: string;  // ISO timestamp
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  /** If set, this is a community post visible to community members */
  groupId?: string;
  /** Denormalized for feed display */
  groupName?: string;
  /** 1-4 photos (required) */
  photos: string[];
  /** Optional short caption */
  caption?: string;
  tags: PostTag[];
  createdAt: string;  // ISO timestamp
  reactions: PostReaction[];
  comments: PostComment[];
}

export type FeedItemType =
  | "personal_post"
  | "community_post"
  | "meet_recap"
  | "upcoming_meet"
  | "connection_activity"
  | "connection_nudge"
  | "offer_care_prompt"
  | "find_care_prompt"
  | "milestone"
  | "dog_moment"
  | "care_review"
  | "share_nudge";

export interface FeedItemBase {
  feedId: string;
  type: FeedItemType;
  timestamp: string;  // ISO — used for sorting
}

export interface FeedPostItem extends FeedItemBase {
  type: "personal_post" | "community_post";
  post: Post;
}

export interface FeedMeetRecapItem extends FeedItemBase {
  type: "meet_recap";
  meet: Meet;
}

export interface FeedUpcomingMeetItem extends FeedItemBase {
  type: "upcoming_meet";
  meet: Meet;
}

export interface FeedConnectionActivityItem extends FeedItemBase {
  type: "connection_activity";
  userId: string;
  userName: string;
  avatarUrl: string;
  activity: string;        // e.g. "added Dog Walking services"
  connectionContext?: string; // e.g. "3 meets together"
}

export interface FeedConnectionNudgeItem extends FeedItemBase {
  type: "connection_nudge";
  userId: string;
  userName: string;
  avatarUrl: string;
  dogNames: string[];
  sharedMeets: number;
}

export interface FeedCarePromptItem extends FeedItemBase {
  type: "offer_care_prompt" | "find_care_prompt";
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface FeedMilestoneItem extends FeedItemBase {
  type: "milestone";
  text: string;
  subtext?: string;
}

export interface FeedDogMomentItem extends FeedItemBase {
  type: "dog_moment";
  dogName: string;
  ownerName: string;
  ownerAvatarUrl: string;
  momentText: string;    // e.g. "turned 3 today!"
}

export interface FeedCareReviewItem extends FeedItemBase {
  type: "care_review";
  reviewerName: string;
  reviewerAvatarUrl: string;
  carerName: string;
  carerAvatarUrl: string;
  rating: number;
  snippet: string;
}

export interface FeedShareNudgeItem extends FeedItemBase {
  type: "share_nudge";
  meet: Meet;
}

export type FeedItem =
  | FeedPostItem
  | FeedMeetRecapItem
  | FeedUpcomingMeetItem
  | FeedConnectionActivityItem
  | FeedConnectionNudgeItem
  | FeedCarePromptItem
  | FeedMilestoneItem
  | FeedDogMomentItem
  | FeedCareReviewItem
  | FeedShareNudgeItem;

// ── Places ────────────────────────────────────────────────────────────────────

export interface Place {
  id: string;
  name: string;
  neighbourhood: string;
}

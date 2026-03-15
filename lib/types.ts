export type Role = "owner" | "walker" | "host";

export type ServiceType = "walk_checkin" | "inhome_sitting" | "boarding";

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
  walk_checkin: number | null; // Kč per visit
  inhome_sitting: number | null; // Kč per night
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
  availableTimes?: Array<"6-11" | "11-15" | "15-22">;
  // Trust / proximity signals
  distanceKm?: number;
  neighbourhoodMatch?: boolean;
  mutualConnections?: number;
  // Map coordinates (WGS84) — client-side only, not stored in DB
  lat?: number;
  lng?: number;
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

export type MessageType = "text" | "booking_proposal" | "contract";

export type BookingProposalStatus = "pending" | "accepted" | "declined" | "countered";

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
}

export interface ContractConfirmation {
  bookingId: string;
  serviceType: ServiceType;
  subService: string | null;
  carerName: string;
  pets: string[];
  startDate: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  text?: string;
  proposal?: BookingProposal;
  contract?: ContractConfirmation;
  sentAt: string; // ISO timestamp
  read: boolean;
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
}

export interface BookingPrice {
  lineItems: PriceLineItem[];
  total: number;
  currency: "Kč";
  billingCycle: "per_session" | "per_night" | "total" | "monthly_est";
}

export interface BookingSession {
  id: string;
  date: string;         // ISO YYYY-MM-DD
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
  checkedInAt?: string; // ISO timestamp — set when status moves to in_progress
  note?: string;
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
  // State
  status: ContractStatus;
  sessions?: BookingSession[];  // ongoing only
  signedAt: string;  // ISO timestamp
}

export interface Conversation {
  id: string;
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
  | "session_completed"
  | "new_message"
  | "booking_proposal"
  | "booking_confirmed";

export interface AppNotification {
  id: string;
  type: NotificationType;
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
}

// ── User / Profile ─────────────────────────────────────────────────────────────

export type TimeSlot = "morning" | "afternoon" | "evening";

export interface PetProfile {
  id: string;
  name: string;
  breed: string;
  weightLabel: string;  // e.g. "18 kg"
  ageLabel: string;     // e.g. "4 years"
  imageUrl: string;
  notes?: string;
}

export interface CarerAvailabilitySlot {
  day: DayOfWeek;
  slots: TimeSlot[];
}

export interface CarerServiceConfig {
  serviceType: ServiceType;
  enabled: boolean;
  pricePerUnit: number;
  priceUnit: "per_visit" | "per_night";
  subServices: string[];
  notes?: string;
}

export interface CarerProfile {
  bio: string;
  location: string;
  availability: CarerAvailabilitySlot[];
  services: CarerServiceConfig[];
  publicProfile: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  memberSince: string;  // "YYYY-MM"
  pets: PetProfile[];
  carerProfile?: CarerProfile;
}

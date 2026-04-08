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

export type MessageType = "text" | "booking_proposal" | "contract" | "payment_summary" | "payment_confirmed";

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
  paymentStatus?: "unpaid" | "paid";
  cancellationReason?: string;
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
  | "session_completed"
  | "new_message"
  | "booking_message"
  | "booking_proposal"
  | "booking_confirmed"
  | "meet_invite"
  | "meet_reminder"
  | "meet_rsvp"
  | "connection_request"
  | "connection_accepted"
  | "group_activity"
  | "post_comment"
  | "care_review";

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

// ── Meets ─────────────────────────────────────────────────────────────────────

export type MeetType = "walk" | "park_hangout" | "playdate" | "training";

export type MeetStatus = "upcoming" | "in_progress" | "completed" | "cancelled";

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
  recurring: boolean;
  maxAttendees: number;
  dogSizeFilter: DogSizeFilter;
  leashRule: LeashRule;
  status: MeetStatus;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl: string;
  attendees: MeetAttendee[];
  createdAt: string;     // ISO timestamp
  /** Link to a community/group (optional) */
  groupId?: string;
  /** Activity indicator text (e.g. "Jana joined 2h ago") */
  recentJoinText?: string;
  /** Flagged as popular (shows badge on card) */
  isPopular?: boolean;
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
export type CareCategory = "training" | "walking" | "grooming" | "boarding" | "rehab" | "venue" | "vet" | "other";

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
  /** IDs of meets linked to this group */
  meetIds: string[];
  photos: string[];
  /** Photo culture setting — controls whether photo posts are allowed/encouraged */
  photoPolicy: PhotoPolicy;
  createdAt: string;
  /** Care groups only: provider user ID */
  hostedBy?: string;
  /** Care groups only: provider display name */
  hostedByName?: string;
  /** Care groups only: service sub-category */
  careCategory?: CareCategory;
  /** Care groups only: provider avatar URL */
  hostedByAvatarUrl?: string;
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

export interface CarerServiceConfig {
  serviceType: ServiceType;
  enabled: boolean;
  pricePerUnit: number;
  priceUnit: "per_visit" | "per_night";
  subServices: string[];
  notes?: string;
}

export type CarerVisibility = "open" | "connected_only" | "familiar_and_above";

export interface CarerProfile {
  bio: string;
  location: string;
  availability: CarerAvailabilitySlot[];
  services: CarerServiceConfig[];
  publicProfile: boolean;
  visibility?: CarerVisibility;
  acceptingBookings?: boolean;
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

export type PostTagType = "dog" | "person" | "community" | "place";

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
  | "care_review";

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

export type FeedItem =
  | FeedPostItem
  | FeedMeetRecapItem
  | FeedUpcomingMeetItem
  | FeedConnectionActivityItem
  | FeedConnectionNudgeItem
  | FeedCarePromptItem
  | FeedMilestoneItem
  | FeedDogMomentItem
  | FeedCareReviewItem;

// ── Places ────────────────────────────────────────────────────────────────────

export interface Place {
  id: string;
  name: string;
  neighbourhood: string;
}

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

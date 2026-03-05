import { ExploreFilters, ProviderCard, SignupDraft } from "@/lib/types";

export const defaultSignupDraft: SignupDraft = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  roles: [],
  bio: "",
  location: "",
  publicProfile: false,
  pet: {
    name: "",
    breed: "",
    size: "",
    age: "",
    temperament: "",
    goodWithDogs: false,
    goodWithKids: false,
    healthNotes: "",
  },
  // Dogs you can care for
  dogSizes: [],
  dogAges: [],
  dogTemperamentsExcluded: [],
  dogSpecialNotes: "",
  dogsCanCareFor: [],
  // Walking service setup
  walkingRadius: 5,
  walkingDays: [],
  walkingTimes: [],
  // Hosting service setup
  hostDays: [],
  hostTimes: [],
  homeType: "",
  outdoorSpace: "",
  dogStayArea: "",
  // Pricing — set in /signup/pricing
  prices: {
    walk_checkin: null,
    inhome_sitting: null,
    boarding: null,
  },
  acceptTos: false,
  acceptPrivacy: false,
};

export const defaultExploreFilters: ExploreFilters = {
  service: null,
  address: "",
  dateRange: { start: null, end: null },
  times: [],
  minRate: 1,
  maxRate: 2500,
  pets: ["Spot", "Goldie"],
};

export const dogsCareOptions = [
  "Small dogs (under 10kg)",
  "Medium dogs (10kg - 25kg)",
  "Large dogs (25kg+)",
  "Puppies",
  "Senior dogs",
  "High-energy breeds",
];

export const providers: ProviderCard[] = [
  {
    id: "olga-m",
    name: "Olga M.",
    district: "Prague 5",
    neighborhood: "Smichov",
    rating: 4.8,
    reviewCount: 12,
    priceFrom: 350,
    priceUnit: "per_walk",
    blurb: "Clean, fun & safe home for your pup",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    services: ["walk_checkin", "inhome_sitting"],
    availableTimes: ["6-11", "11-15"],
    distanceKm: 0.8,
    neighbourhoodMatch: true,
    mutualConnections: 2,
  },
  {
    id: "nikola-r",
    name: "Nikola R.",
    district: "Prague 2",
    neighborhood: "Vinohrady",
    rating: 4.9,
    reviewCount: 20,
    priceFrom: 420,
    priceUnit: "per_walk",
    blurb: "Structured walks and calm routines",
    avatarUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    services: ["walk_checkin", "boarding"],
    availableTimes: ["11-15", "15-22"],
    distanceKm: 2.3,
    neighbourhoodMatch: false,
    mutualConnections: 1,
  },
  {
    id: "jana-k",
    name: "Jana K.",
    district: "Prague 6",
    neighborhood: "Dejvice",
    rating: 4.7,
    reviewCount: 9,
    priceFrom: 290,
    priceUnit: "per_visit",
    blurb: "Patient care for shy and senior dogs",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    services: ["walk_checkin", "inhome_sitting", "boarding"],
    availableTimes: ["6-11", "15-22"],
    distanceKm: 3.7,
    neighbourhoodMatch: false,
    mutualConnections: 0,
  },
];

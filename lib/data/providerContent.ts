import { providers as localProviders } from "@/lib/mockData";
import {
  ProviderCard,
  ProviderProfileContent,
  ProviderReview,
  ProviderServiceOffering,
  ServiceRateRow,
  ServiceWeightBand,
  ServiceType,
} from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Default "About" banner image: person with dog (represents the provider). Used when photo_main_url is missing. */
export const DEFAULT_ABOUT_BANNER_URL = "/images/person-with-dog.png";

/** Unsplash photo IDs we used as old placeholders; treat as "no custom photo" so we use the new default. */
const LEGACY_ABOUT_BANNER_PHOTO_IDS = [
  "1543466835-00a7907e9de1", // old fallback (dog only)
  "1548199973-03cce0bbc87b",
  "1534361960057-19f4434a6b65",
  "1548767797-d8c844163c4c",
];

function resolveAboutBannerUrl(photoMainUrl: string | null | undefined): string {
  const url = photoMainUrl?.trim();
  if (!url) return DEFAULT_ABOUT_BANNER_URL;
  const isLegacy = LEGACY_ABOUT_BANNER_PHOTO_IDS.some((id) => url.includes(id));
  if (isLegacy) return DEFAULT_ABOUT_BANNER_URL;
  return url;
}

type ProviderProfileRow = {
  provider_id: string;
  about_title: string;
  about_heading: string;
  about_body: string;
  photo_main_url: string;
  photo_side_url: string;
  photo_count_label: string;
};

type ProviderExperienceRow = {
  id: string;
  provider_id: string;
  category: "care_experience" | "medical_care" | "home_environment";
  item_text: string;
  sort_order: number;
};

type ProviderPetRow = {
  id: string;
  provider_id: string;
  name: string;
  breed: string;
  weight_label: string;
  age_label: string;
  image_url: string;
  sort_order: number;
};

type ProviderServiceRow = {
  id: string;
  provider_id: string;
  service_type: ServiceType;
  title: string;
  short_description: string;
  price_from: number;
  price_unit: ProviderCard["priceUnit"];
  sort_order: number;
};

type ProviderReviewRow = {
  id: string;
  provider_id: string;
  author_name: string;
  rating: number;
  review_text: string;
  created_at: string;
};

function defaultServices(provider: ProviderCard): ProviderServiceOffering[] {
  return provider.services.map((service, index) => ({
    id: `${provider.id}-default-service-${index + 1}`,
    providerId: provider.id,
    serviceType: service,
    title:
      service === "walk_checkin"
        ? "Walks and Check-ins"
        : service === "inhome_sitting"
          ? "In-home Sitting"
          : "Boarding",
    shortDescription:
      service === "walk_checkin"
        ? "Neighborhood walks, potty breaks, and quick updates."
        : service === "inhome_sitting"
          ? "Care in your home with feeding and routine support."
          : "Overnight care in a calm, dog-friendly home.",
    priceFrom: provider.priceFrom,
    priceUnit: provider.priceUnit,
  }));
}

type PerProviderContent = Pick<
  ProviderProfileContent,
  | "aboutTitle"
  | "aboutHeading"
  | "aboutBody"
  | "photoMainUrl"
  | "photoSideUrl"
  | "photoCountLabel"
  | "careExperience"
  | "medicalCare"
  | "homeEnvironment"
  | "pets"
  | "reviews"
> & {
  // Optional: when present, overrides defaultServices() for this provider
  services?: ProviderServiceOffering[];
};

// ── Shared rate/weight helpers ────────────────────────────────────────────────

function walkRates(base: number): ServiceRateRow[] {
  return [
    { label: "Walk rate", price: `+ ${Math.round(base * 0.29)} Kč`, unit: "per 30 min walk" },
    {
      label: "Holiday Rate",
      price: `${Math.round(base * 1.37)} Kč`,
      unit: "per visit",
      hasTooltip: true,
    },
    {
      label: "Additional Dog Rate",
      price: `+ ${Math.round(base * 0.37)} Kč`,
      unit: "per dog, per walk",
    },
    { label: "Puppy Rate", price: `${Math.round(base * 1.11)} Kč`, unit: "per visit" },
  ];
}

function hostRates(base: number, includeCat: boolean): ServiceRateRow[] {
  const rows: ServiceRateRow[] = [
    {
      label: "Holiday Rate",
      price: `${Math.round(base * 1.2)} Kč`,
      unit: "per night",
      hasTooltip: true,
    },
    {
      label: "Additional Dog Rate",
      price: `+ ${Math.round(base * 0.54)} Kč`,
      unit: "per dog, per night",
    },
    { label: "Puppy Rate", price: `${Math.round(base * 1.1)} Kč`, unit: "per night" },
  ];
  if (includeCat) {
    rows.push({ label: "Cat Care", price: `${Math.round(base * 0.65)} Kč`, unit: "per night" });
    rows.push({
      label: "Additional Cat",
      price: `+ ${Math.round(base * 0.34)} Kč`,
      unit: "per cat, per night",
    });
  }
  rows.push({
    label: "Extended Care",
    price: "50–100%",
    unit: "of nightly rate",
    hasTooltip: true,
  });
  return rows;
}

const WEIGHT_TINY: ServiceWeightBand = { label: "0–5 kg", size: "tiny" };
const WEIGHT_SMALL: ServiceWeightBand = { label: "5–10 kg", size: "small" };
const WEIGHT_MEDIUM: ServiceWeightBand = { label: "10–25 kg", size: "medium" };
const WEIGHT_LARGE: ServiceWeightBand = { label: "25–45 kg", size: "large" };
const WEIGHT_CAT: ServiceWeightBand = { label: "Cats", size: "cat" };

const providerFallbackDetails: Record<
  string,
  (providerId: string, rating: number, reviewCount: number) => PerProviderContent
> = {
  "olga-m": (providerId, rating) => ({
    services: [
      {
        id: `${providerId}-svc-walk`,
        providerId,
        serviceType: "walk_checkin",
        title: "Walks & Check-ins",
        shortDescription: "Neighborhood walks, potty breaks, and photo updates.",
        priceFrom: 350,
        priceUnit: "per_visit",
        rates: walkRates(350),
        acceptedWeightBands: [WEIGHT_TINY, WEIGHT_SMALL, WEIGHT_MEDIUM],
      },
      {
        id: `${providerId}-svc-sitting`,
        providerId,
        serviceType: "inhome_sitting",
        title: "In-home Sitting",
        shortDescription: "Overnight care at your home with full routine support.",
        priceFrom: 650,
        priceUnit: "per_night",
        rates: hostRates(650, true),
        acceptedWeightBands: [WEIGHT_CAT, WEIGHT_TINY, WEIGHT_SMALL],
      },
    ],
    aboutTitle: "Home full-time with lots of love!",
    aboutHeading: "About Olga",
    aboutBody:
      "I've been caring for dogs since childhood — my family always had at least two at home. I work remotely full-time so your pup is never alone. My flat in Smíchov has a quiet courtyard and I take every dog on at least two proper walks a day. I send photo updates after every outing.",
    photoMainUrl: DEFAULT_ABOUT_BANNER_URL,
    photoSideUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    photoCountLabel: "(42 photos)",
    careExperience: [
      "Puppies and adolescent dogs",
      "Adult and senior dogs",
      "Shy or anxious dogs",
      "Dogs with feeding schedules",
      "Dogs on medication",
      "High-energy breeds",
    ],
    medicalCare: [
      "Comfortable giving oral medication",
      "Comfortable with topical treatments",
      "Will follow written vet care plans",
    ],
    homeEnvironment: [
      "Non-smoking household",
      "No children in home",
      "Quiet residential street",
      "Courtyard access for off-leash breaks",
      "Dogs allowed on sofa",
    ],
    pets: [
      {
        id: `${providerId}-pet-1`,
        name: "Mila",
        breed: "Beagle Mix",
        weightLabel: "11 kg",
        ageLabel: "4 years",
        imageUrl:
          "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=200&q=80",
      },
    ],
    reviews: [
      {
        id: `${providerId}-review-1`,
        providerId,
        authorName: "Tereza H.",
        rating,
        reviewText:
          "Olga was incredible with our anxious rescue. She sent us photos every walk and our dog came home calm and happy. Will absolutely book again.",
        createdAt: "2026-02-18T09:30:00.000Z",
      },
      {
        id: `${providerId}-review-2`,
        providerId,
        authorName: "Martin V.",
        rating: 5.0,
        reviewText:
          "Our puppy stayed with Olga for a long weekend. She handled the chaos with a smile and kept us updated the whole time.",
        createdAt: "2026-01-30T14:00:00.000Z",
      },
    ],
  }),

  "nikola-r": (providerId, rating) => ({
    services: [
      {
        id: `${providerId}-svc-walk`,
        providerId,
        serviceType: "walk_checkin",
        title: "Walks & Check-ins",
        shortDescription:
          "Purposeful, structured walks for dogs that need calm, confident handling.",
        priceFrom: 420,
        priceUnit: "per_visit",
        rates: walkRates(420),
        acceptedWeightBands: [WEIGHT_MEDIUM, WEIGHT_LARGE],
      },
      {
        id: `${providerId}-svc-boarding`,
        providerId,
        serviceType: "boarding",
        title: "Boarding",
        shortDescription: "Your dog stays with me and Rex in a spacious Vinohrady apartment.",
        priceFrom: 500,
        priceUnit: "per_night",
        subtitle: "at Nikola's home",
        rates: hostRates(500, false),
        acceptedWeightBands: [WEIGHT_MEDIUM, WEIGHT_LARGE],
      },
    ],
    aboutTitle: "Structured walks, calm routines.",
    aboutHeading: "About Nikola",
    aboutBody:
      "I'm a certified dog trainer with five years of experience in Prague's 2nd district. I specialise in structured, purposeful walks that help dogs feel secure and satisfied. Every walk starts with a brief sniff-and-settle and ends with a debrief note to the owner. I take a maximum of two dogs at a time so each one gets real attention.",
    photoMainUrl: DEFAULT_ABOUT_BANNER_URL,
    photoSideUrl:
      "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=800&q=80",
    photoCountLabel: "(78 photos)",
    careExperience: [
      "Adult dogs",
      "Reactive or leash-aggressive dogs",
      "Dogs in training programmes",
      "High-energy working breeds",
      "Dogs needing calm, structured handling",
    ],
    medicalCare: [
      "Comfortable giving oral medication",
      "Experience managing dogs post-surgery",
      "Will follow written vet care plans",
    ],
    homeEnvironment: [
      "Spacious Vinohrady apartment",
      "Non-smoking household",
      "One friendly resident dog (Border Collie)",
      "Nearby Riegrovy sady park for off-leash time",
      "Maximum two guest dogs at once",
    ],
    pets: [
      {
        id: `${providerId}-pet-1`,
        name: "Rex",
        breed: "Border Collie",
        weightLabel: "22 kg",
        ageLabel: "3 years",
        imageUrl:
          "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=200&q=80",
      },
    ],
    reviews: [
      {
        id: `${providerId}-review-1`,
        providerId,
        authorName: "Petra K.",
        rating,
        reviewText:
          "Nikola is the best. Our reactive rescue came back from every walk noticeably calmer. She clearly knows what she's doing.",
        createdAt: "2026-02-25T08:00:00.000Z",
      },
      {
        id: `${providerId}-review-2`,
        providerId,
        authorName: "Ondřej S.",
        rating: 4.8,
        reviewText:
          "Reliable, professional, and communicative. I always knew exactly how the walk went. Highly recommend for working breeds.",
        createdAt: "2026-02-10T16:45:00.000Z",
      },
      {
        id: `${providerId}-review-3`,
        providerId,
        authorName: "Lucie M.",
        rating: 5.0,
        reviewText:
          "Boarding with Nikola was stress-free. She sent daily updates and our dog clearly loved being with Rex.",
        createdAt: "2026-01-20T11:00:00.000Z",
      },
    ],
  }),

  "jana-k": (providerId, rating) => ({
    services: [
      {
        id: `${providerId}-svc-walk`,
        providerId,
        serviceType: "walk_checkin",
        title: "Walks & Check-ins",
        shortDescription: "Gentle, patient walks suited to shy, elderly, or recovering dogs.",
        priceFrom: 290,
        priceUnit: "per_visit",
        rates: walkRates(290),
        acceptedWeightBands: [WEIGHT_TINY, WEIGHT_SMALL],
      },
      {
        id: `${providerId}-svc-sitting`,
        providerId,
        serviceType: "inhome_sitting",
        title: "In-home Sitting",
        shortDescription:
          "Overnight care at your home. Medication, special diets, and post-surgical care welcome.",
        priceFrom: 580,
        priceUnit: "per_night",
        rates: hostRates(580, true),
        acceptedWeightBands: [WEIGHT_TINY, WEIGHT_SMALL, WEIGHT_CAT],
      },
      {
        id: `${providerId}-svc-boarding`,
        providerId,
        serviceType: "boarding",
        title: "Boarding",
        shortDescription: "Your dog stays in my quiet Dejvice house with a private garden.",
        priceFrom: 450,
        priceUnit: "per_night",
        subtitle: "at Jana's home",
        rates: hostRates(450, true),
        acceptedWeightBands: [WEIGHT_TINY, WEIGHT_SMALL],
      },
    ],
    aboutTitle: "Patient, gentle care for every dog.",
    aboutHeading: "About Jana",
    aboutBody:
      "I'm a retired veterinary nurse living in Dejvice. After 20 years working in a Prague clinic I know dogs inside out — especially the shy ones, the older ones, and the ones who need a little extra patience. My home is quiet and calm, and I have a small garden. I'm happy to accommodate special dietary needs or medication schedules.",
    photoMainUrl: DEFAULT_ABOUT_BANNER_URL,
    photoSideUrl:
      "https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=800&q=80",
    photoCountLabel: "(31 photos)",
    careExperience: [
      "Senior dogs",
      "Shy, fearful or trauma-background dogs",
      "Dogs with chronic health conditions",
      "Post-surgery recovery care",
      "Small and toy breeds",
      "Puppies needing socialisation",
    ],
    medicalCare: [
      "Experienced giving oral, topical and injectable medication",
      "Comfortable with dogs on special diets",
      "Post-surgical wound care",
      "Monitoring and reporting health changes",
    ],
    homeEnvironment: [
      "Detached house with private garden",
      "Non-smoking household",
      "No other pets",
      "Very quiet neighbourhood",
      "Potty breaks every 2–3 hours",
    ],
    pets: [],
    reviews: [
      {
        id: `${providerId}-review-1`,
        providerId,
        authorName: "Alžbeta N.",
        rating,
        reviewText:
          "Jana cared for our 14-year-old Lab during a difficult period. Her veterinary background was so reassuring and our dog genuinely relaxed in her care.",
        createdAt: "2026-02-05T10:00:00.000Z",
      },
      {
        id: `${providerId}-review-2`,
        providerId,
        authorName: "Radek P.",
        rating: 5.0,
        reviewText:
          "We have a very shy rescue and most sitters struggle. Jana was completely calm and patient — within an hour the dog was following her around.",
        createdAt: "2026-01-15T13:30:00.000Z",
      },
    ],
  }),
};

function fallbackContent(providerId: string): ProviderProfileContent | null {
  const provider = localProviders.find((item) => item.id === providerId);
  if (!provider) return null;

  const detailsFn = providerFallbackDetails[providerId];
  const details = detailsFn
    ? detailsFn(provider.id, provider.rating, provider.reviewCount)
    : {
        aboutTitle: "Experienced dog carer",
        aboutHeading: `About ${provider.name.split(" ")[0]}`,
        aboutBody:
          "Passionate dog lover with years of experience caring for dogs of all breeds and temperaments.",
        photoMainUrl: DEFAULT_ABOUT_BANNER_URL,
        photoSideUrl:
          "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
        photoCountLabel: "(12 photos)",
        careExperience: ["Adult Dogs", "Senior Dogs"],
        medicalCare: ["Comfortable following vet instructions"],
        homeEnvironment: ["Non-smoking household"],
        pets: [],
        reviews: provider.reviewCount
          ? [
              {
                id: `${provider.id}-review-1`,
                providerId: provider.id,
                authorName: "Verified owner",
                rating: provider.rating,
                reviewText: "Reliable, thoughtful updates, and clearly great with dogs.",
                createdAt: "2026-02-12T10:00:00.000Z",
              },
            ]
          : [],
      };

  return {
    providerId: provider.id,
    ...details,
    // Use per-provider services if defined; fall back to generic defaults
    services: details.services ?? defaultServices(provider),
  };
}

export async function getProviderProfileContent(
  providerId: string,
): Promise<ProviderProfileContent | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackContent(providerId);
  }

  const [
    { data: profileRow },
    { data: experienceRows },
    { data: petRows },
    { data: serviceRows },
    { data: reviewRows },
  ] = await Promise.all([
    supabase.from("provider_profiles").select("*").eq("provider_id", providerId).maybeSingle(),
    supabase
      .from("provider_experience_items")
      .select("*")
      .eq("provider_id", providerId)
      .order("sort_order"),
    supabase.from("provider_pets").select("*").eq("provider_id", providerId).order("sort_order"),
    supabase
      .from("provider_service_offerings")
      .select("*")
      .eq("provider_id", providerId)
      .order("sort_order"),
    supabase
      .from("provider_reviews")
      .select("*")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false }),
  ]);

  if (!profileRow) {
    return fallbackContent(providerId);
  }

  const rows = (experienceRows ?? []) as ProviderExperienceRow[];
  const careExperience = rows
    .filter((row) => row.category === "care_experience")
    .map((row) => row.item_text);
  const medicalCare = rows
    .filter((row) => row.category === "medical_care")
    .map((row) => row.item_text);
  const homeEnvironment = rows
    .filter((row) => row.category === "home_environment")
    .map((row) => row.item_text);

  // Build base services from DB, then enrich with local rate rows / weight bands
  // (rates and acceptedWeightBands are display-config defined per provider in fallback,
  //  not stored in the DB schema — merge them in by serviceType match)
  const fallbackDetailsFn = providerFallbackDetails[providerId];
  const fallbackDetails = fallbackDetailsFn ? fallbackDetailsFn(providerId, 0, 0) : null;

  const services: ProviderServiceOffering[] = ((serviceRows ?? []) as ProviderServiceRow[]).map(
    (row) => {
      const match = fallbackDetails?.services?.find((f) => f.serviceType === row.service_type);
      return {
        id: row.id,
        providerId: row.provider_id,
        serviceType: row.service_type,
        title: row.title,
        shortDescription: row.short_description,
        priceFrom: row.price_from,
        priceUnit: row.price_unit,
        // Enrich with locally-defined rate tiers and weight bands
        subtitle: match?.subtitle,
        rates: match?.rates,
        acceptedWeightBands: match?.acceptedWeightBands,
      };
    },
  );

  const reviews = ((reviewRows ?? []) as ProviderReviewRow[]).map(
    (row): ProviderReview => ({
      id: row.id,
      providerId: row.provider_id,
      authorName: row.author_name,
      rating: row.rating,
      reviewText: row.review_text,
      createdAt: row.created_at,
    }),
  );

  const profile = profileRow as ProviderProfileRow;
  const photoMain = resolveAboutBannerUrl(profile.photo_main_url);

  return {
    providerId,
    aboutTitle: profile.about_title,
    aboutHeading: profile.about_heading,
    aboutBody: profile.about_body,
    photoMainUrl: photoMain,
    photoSideUrl: profile.photo_side_url,
    photoCountLabel: profile.photo_count_label,
    careExperience,
    medicalCare,
    homeEnvironment,
    pets: ((petRows ?? []) as ProviderPetRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      breed: row.breed,
      weightLabel: row.weight_label,
      ageLabel: row.age_label,
      imageUrl: row.image_url,
    })),
    services,
    reviews,
  };
}

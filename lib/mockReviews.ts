import type { UserReview } from "./types";

export const mockReviews: UserReview[] = [
  /* ── Klára (6 reviews, avg 4.8) — most reviewed, social proof ─────── */
  {
    id: "review-klara-1",
    bookingId: "booking-klara-daniel",
    authorId: "daniel",
    authorName: "Daniel P.",
    carerName: "Klára Horáčková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Klára completely changed how I handle Bára's reactivity. Patient, knowledgeable, and her dog Eda is an amazing demo dog. Bára went from lunging at every dog to calmly passing them in 4 sessions.",
    createdAt: "2026-03-10T14:00:00Z",
  },
  {
    id: "review-klara-2",
    bookingId: "booking-klara-filip",
    authorId: "filip",
    authorName: "Filip N.",
    carerName: "Klára Horáčková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Toby's recall was non-existent before Klára. After 3 sessions he comes back 8/10 times, which is a miracle for a Jack Russell. Her methods are clear and easy to practice at home.",
    createdAt: "2026-02-12T10:00:00Z",
  },
  {
    id: "review-klara-3",
    bookingId: "booking-klara-hana",
    authorId: "hana",
    authorName: "Hana P.",
    carerName: "Klára Horáčková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Been working with Klára for 5 weeks on Runa's reactivity. She really understands the threshold work and adjusts the pace to the dog. Runa is visibly more relaxed on walks now.",
    createdAt: "2026-02-20T16:00:00Z",
  },
  {
    id: "review-klara-4",
    bookingId: "booking-klara-daniel",
    authorId: "shawn",
    authorName: "Shawn T.",
    carerName: "Klára Horáčková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Took Spot to one of Klára's group sessions for socialisation practice. She managed the group really well and gave specific feedback for each dog. Spot was calmer with new dogs afterwards.",
    createdAt: "2026-03-05T11:00:00Z",
  },
  {
    id: "review-klara-5",
    bookingId: "booking-klara-hana",
    authorId: "eva",
    authorName: "Eva S.",
    carerName: "Klára Horáčková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 4,
    text: "Good training session for Luna. Klára knows her stuff. Only reason for 4 stars is the session ran a bit short, but the content was solid and Luna responded well.",
    createdAt: "2026-01-28T15:00:00Z",
  },
  {
    id: "review-klara-6",
    bookingId: "booking-klara-filip",
    authorId: "martin",
    authorName: "Martin H.",
    carerName: "Klára Horáčková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Klára helped Charlie with his leash pulling. She explained the mechanics in a way that made sense and Charlie responded immediately. Highly recommend for any behavioural issues.",
    createdAt: "2026-02-01T09:00:00Z",
  },

  /* ── Olga (3 reviews, avg 4.8) — existing provider ───────────────── */
  {
    id: "review-olga-1",
    bookingId: "booking-olga-walks",
    authorId: "shawn",
    authorName: "Shawn T.",
    carerName: "Olga Mašková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Olga is incredibly reliable. Spot loves his walks with her and comes back happy and tired every time. The GPS tracking and photos she sends are a nice touch.",
    createdAt: "2026-03-08T18:00:00Z",
  },
  {
    id: "review-olga-2",
    bookingId: "booking-olga-walks",
    authorId: "tereza",
    authorName: "Tereza N.",
    carerName: "Olga Mašková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Franta had the best time. Olga is calm, patient, and clearly loves dogs. She even texted me when she noticed a small scratch on his paw. That attention to detail means a lot.",
    createdAt: "2026-01-20T12:00:00Z",
  },
  {
    id: "review-olga-3",
    bookingId: "booking-olga-walks",
    authorId: "jana",
    authorName: "Jana K.",
    carerName: "Olga Mašková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    rating: 4,
    text: "Rex can be a handful on walks but Olga handled him well. She's punctual and professional. Would recommend for medium/large dogs too.",
    createdAt: "2025-12-15T10:00:00Z",
  },

  /* ── Petra (2 reviews, avg 5.0) — neighbourhood helper ────────────── */
  {
    id: "review-petra-1",
    bookingId: "booking-petra-dropins",
    authorId: "shawn",
    authorName: "Shawn T.",
    carerName: "Petra Veselá",
    carerAvatarUrl: "/images/generated/petra-profile.jpeg",
    rating: 5,
    text: "Petra was wonderful with Spot and Goldie over the holidays. She sent daily updates and photos, and the dogs were clearly happy and well looked after. Would absolutely book again.",
    createdAt: "2025-12-29T10:00:00Z",
  },
  {
    id: "review-petra-2",
    bookingId: "booking-petra-tomas",
    authorId: "tomas",
    authorName: "Tomáš K.",
    carerName: "Petra Veselá",
    carerAvatarUrl: "/images/generated/petra-profile.jpeg",
    rating: 5,
    text: "Petra saved me when I had a family emergency. Hugo was happy and safe with her, and she even sent me photos of him playing with Daisy. Can't thank her enough.",
    createdAt: "2026-03-18T09:00:00Z",
  },

  /* ── Tereza (1 review) — friendship-based care ────────────────────── */
  {
    id: "review-tereza-1",
    bookingId: "booking-tereza-marek",
    authorId: "marek",
    authorName: "Marek D.",
    carerName: "Tereza Nováková",
    carerAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Tereza is amazing. Benny was so relaxed at her place — he and Franta are best friends. She sent me updates without me even asking. This is what community care should feel like.",
    createdAt: "2026-02-24T15:00:00Z",
  },

  /* ── Shawn (1 review) — new provider, first review ────────────────── */
  {
    id: "review-shawn-1",
    bookingId: "booking-shawn-carer-marie",
    authorId: "marie",
    authorName: "Marie N.",
    carerName: "Shawn Talvacchia",
    carerAvatarUrl: "/images/generated/shawn-profile.jpg",
    rating: 4,
    text: "Molly loves her walks with Shawn. He's reliable, great with dogs, and always on time. The route through Riegrovy sady is perfect. Only wish the walks were a bit longer!",
    createdAt: "2026-03-15T17:00:00Z",
  },
];

/** Get reviews for a specific carer by name */
export function getReviewsForCarer(carerName: string): UserReview[] {
  return mockReviews.filter((r) => r.carerName === carerName);
}

/** Get average rating for a carer */
export function getCarerAverageRating(carerName: string): number {
  const reviews = getReviewsForCarer(carerName);
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

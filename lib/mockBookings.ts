import type { Booking } from "./types";
import { daysAgo, daysAgoIso, daysFromNow } from "./mockDate";

// ── Active ongoing — Olga, solo walks Mon/Wed/Fri ──────────────────────────────
// Rolling weekly. Recent completed sessions + one upcoming next week.
// Booking started early March — weeks of history.

const olgaBooking: Booking = {
  id: "booking-olga-walks",
  conversationId: "shawn-olga-conv",
  ownerId: "shawn",
  ownerName: "Shawn Talvacchia",
  ownerAvatarUrl:
    "/images/generated/shawn-profile.jpg",
  carerId: "olga-m",
  carerName: "Olga Mašková",
  carerAvatarUrl: "/images/generated/lucie-profile.jpeg",
  type: "ongoing",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Spot"],
  startDate: "2026-03-02",
  endDate: null,
  recurringSchedule: {
    days: ["Mon", "Wed", "Fri"],
    time: "08:00",
    timeLabel: "8:00–9:00am",
  },
  price: {
    lineItems: [
      { label: "Solo walk", amount: 330, unit: "per session" },
    ],
    total: 990,
    currency: "Kč",
    billingCycle: "weekly",
  },
  ownerNotes: "Spot pulls on leash near other dogs — use the harness on the hook by the front door. Key is under the blue pot on the left. He gets one treat after the walk, they're in the jar on the kitchen counter.",
  carerNotes: "I usually do Riegrovy sady loop, about 45 min. I'll send a photo update after each walk.",
  status: "active",
  sessions: [
    // Past sessions (rolling history)
    { id: "s-olga-1", date: "2026-03-30", status: "completed" },
    { id: "s-olga-2", date: "2026-04-01", status: "completed" },
    { id: "s-olga-3", date: "2026-04-03", status: "completed", note: "Met a new friend in the park" },
    { id: "s-olga-4", date: "2026-04-06", status: "completed", note: "Spot did great, very energetic today!" },
    { id: "s-olga-5", date: "2026-04-08", status: "completed" },
    {
      id: "s-olga-6",
      date: "2026-04-10",
      status: "completed",
      report: {
        photos: [],
        notes:
          "Riegrovy Sady loop, full 45 min. Spot was bouncy off the leash by the fountain — big hello to a Vizsla called Tony. Treat after, key returned to the pot. All good.",
        walkDistanceKm: 3.2,
        walkDurationMin: 45,
        completedAt: "2026-04-10T09:52:00Z",
      },
    },
    // Next session only
    { id: "s-olga-7", date: daysFromNow(2), status: "upcoming" },
  ],
  signedAt: "2026-02-28T14:30:00Z",
  paymentStatus: "paid",
};

// ── Upcoming one-off — Nikola, overnight boarding Aug 12–18 ────────────────────

const nikolaBooking: Booking = {
  id: "booking-nikola-boarding",
  conversationId: "shawn-nikola-conv",
  ownerId: "shawn",
  ownerName: "Shawn Talvacchia",
  ownerAvatarUrl:
    "/images/generated/shawn-profile.jpg",
  carerId: "nikola-r",
  carerName: "Nikola Rada",
  carerAvatarUrl:
    "https://images.unsplash.com/photo-1530785602389-07594beb8b73?auto=format&fit=crop&w=120&q=80",
  type: "one_off",
  serviceType: "boarding",
  subService: "Overnight",
  pets: ["Spot", "Goldie"],
  startDate: "2026-08-12",
  endDate: "2026-08-18",
  price: {
    lineItems: [
      { label: "Overnight boarding", amount: 480, unit: "per night" },
      { label: "Additional dog", amount: 130, unit: "per night", isModifier: true },
    ],
    total: 3660,
    currency: "Kč",
    billingCycle: "total",
  },
  ownerNotes: "Spot takes half a Benadryl at bedtime — pills are in the kitchen drawer. Goldie needs her food mixed with warm water. Both dogs sleep in the living room, beds are already set up.",
  status: "upcoming",
  signedAt: "2026-03-05T10:15:00Z",
  paymentStatus: "unpaid",
};

// ── Completed — Petra, drop-in visits Dec 2025 ─────────────────────────────────

const petraBooking: Booking = {
  id: "booking-petra-dropins",
  conversationId: null,
  ownerId: "shawn",
  ownerName: "Shawn Talvacchia",
  ownerAvatarUrl:
    "/images/generated/shawn-profile.jpg",
  carerId: "petra",
  carerName: "Petra Veselá",
  carerAvatarUrl: "/images/generated/petra-profile.jpeg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Drop-in visit",
  pets: ["Spot", "Goldie"],
  startDate: "2025-12-22",
  endDate: "2025-12-28",
  price: {
    lineItems: [
      { label: "Drop-in visit (×2 daily)", amount: 280, unit: "per visit" },
    ],
    total: 3920,
    currency: "Kč",
    billingCycle: "total",
  },
  status: "completed",
  signedAt: "2025-12-18T09:00:00Z",
  paymentStatus: "paid",
};

// ── Shawn as carer — completed, Tomáš Kovář, solo walks Feb 2026 ───────────────

const shawnCarerCompletedBooking: Booking = {
  id: "booking-shawn-carer-tomas",
  conversationId: null,
  ownerId: "tomas",
  ownerName: "Tomáš Kovář",
  ownerAvatarUrl:
    "/images/generated/tomas-profile.jpeg",
  carerId: "shawn",
  carerName: "Shawn Talvacchia",
  carerAvatarUrl: "/images/generated/shawn-profile.jpg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Hugo"],
  startDate: "2026-02-10",
  endDate: "2026-02-21",
  sessions: [
    { id: "stc-1", date: "2026-02-10", status: "completed" },
    { id: "stc-2", date: "2026-02-12", status: "completed" },
    { id: "stc-3", date: "2026-02-14", status: "completed" },
    { id: "stc-4", date: "2026-02-17", status: "completed" },
    { id: "stc-5", date: "2026-02-19", status: "completed" },
    { id: "stc-6", date: "2026-02-21", status: "completed" },
  ],
  price: {
    lineItems: [{ label: "Solo walk", amount: 280, unit: "per visit" }],
    total: 1680,
    currency: "Kč",
    billingCycle: "total",
  },
  status: "completed",
  signedAt: "2026-02-07T10:00:00Z",
  paymentStatus: "paid",
};

// ── Shawn as carer — active, Marie Nováková, walks Tue/Thu ongoing ─────────────

const shawnCarerActiveBooking: Booking = {
  id: "booking-shawn-carer-marie",
  conversationId: null,
  ownerId: "marie",
  ownerName: "Marie Nováková",
  ownerAvatarUrl:
    "/images/generated/marie-profile.jpeg",
  carerId: "shawn",
  carerName: "Shawn Talvacchia",
  carerAvatarUrl: "/images/generated/shawn-profile.jpg",
  type: "ongoing",
  serviceType: "walks_checkins",
  subService: "Group walk",
  pets: ["Molly"],
  startDate: "2026-03-03",
  endDate: null,
  recurringSchedule: {
    days: ["Tue", "Thu"],
    time: "09:00",
    timeLabel: "9:00–10:00am",
  },
  ownerNotes: "Molly is friendly with all dogs but gets excited around bikes. Please keep her on a short lead near the cycle path.",
  sessions: [
    { id: "skc-1", date: "2026-03-31", status: "completed" },
    { id: "skc-2", date: "2026-04-02", status: "completed" },
    { id: "skc-3", date: "2026-04-07", status: "completed" },
    { id: "skc-4", date: "2026-04-09", status: "completed", note: "Molly was great with the group today" },
    // Next session only
    { id: "skc-5", date: daysFromNow(3), status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "Group walk", amount: 250, unit: "per session" }],
    total: 500,
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: "2026-03-01T11:30:00Z",
  paymentStatus: "paid",
};

// ── Klára training — Daniel, recurring sessions ──────────────────────────────

const klaraTrainingDaniel: Booking = {
  id: "booking-klara-daniel",
  conversationId: "daniel-klara-conv",
  ownerId: "daniel",
  ownerName: "Daniel Procházka",
  ownerAvatarUrl: "/images/generated/daniel-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "ongoing",
  serviceType: "day_care", // using day_care as proxy for training
  subService: "Reactive dog session",
  pets: ["Bára"],
  // startDate + signedAt relativised (CCFT walkthrough 2026-05-11) — the
  // "Since" stat on the booking detail Info tab was reading "10 Feb 2026"
  // (static) while the session timeline (kd-1 through kd-5) was relative
  // to today, so the booking appeared to start 3+ months before its first
  // session. Anchor: signed 2 days before the first session, started the
  // day after signing → coherent arc from sign → start → kd-1 (35d ago).
  startDate: daysAgo(36),
  endDate: null,
  recurringSchedule: {
    days: ["Wed"],
    time: "10:00",
    timeLabel: "10:00–11:00am",
  },
  ownerNotes: "Bára is reactive to other dogs, especially on-leash. She's fine with people. Please meet us at the park entrance, not the car park — too many dogs there.",
  carerNotes: "We're working on threshold training. Current distance is 5m from trigger dogs. Don't push closer than 4m yet.",
  // Weekly Wed cadence anchored to today: kd-6 (today, upcoming) is
  // preceded by 5 completed sessions one week apart. Dates are relative
  // (`daysAgo`) so the booking always reads as a live, ongoing
  // arrangement regardless of when the demo is opened. kd-5's report
  // sits a week in the past — outside the `findNewReport` recency
  // window, so it doesn't false-trigger the "new visit report"
  // indicator after demo reset. The indicator only fires when kd-6
  // gets sealed during the walkthrough. 2026-05-08.
  sessions: [
    { id: "kd-1", date: daysAgo(35), status: "completed", note: "Good session. Bára responded well to the threshold exercises." },
    { id: "kd-2", date: daysAgo(28), status: "completed", note: "Bára stayed under threshold with Eda at 5m. Big progress." },
    { id: "kd-3", date: daysAgo(21), status: "completed" },
    { id: "kd-4", date: daysAgo(14), status: "completed" },
    {
      id: "kd-5",
      date: daysAgo(7),
      status: "completed",
      report: {
        photos: ["/images/generated/bara-portrait.jpeg"],
        notes:
          "Threshold work at Stromovka. Bára held under-threshold at 4m today — first time we've closed the distance. We worked on the look-at-that game with three trigger dogs across the field. She was visibly tired by the end (good tired). I'd hold here for the next two sessions before stepping closer.",
        walkDurationMin: 60,
        completedAt: daysAgoIso(7, "11:08"),
      },
    },
    { id: "kd-6", date: daysFromNow(0), status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "1-on-1 reactive dog session", amount: 600, unit: "per session" }],
    total: 600,
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: daysAgoIso(38, "14:00"),
  paymentStatus: "paid",
};

// ── Klára training — Filip, one-off sessions ─────────────────────────────────

const klaraTrainingFilip: Booking = {
  id: "booking-klara-filip",
  conversationId: "klara-filip-conv",
  ownerId: "filip",
  ownerName: "Filip Novotný",
  ownerAvatarUrl: "/images/generated/filip-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "one_off",
  serviceType: "day_care",
  subService: "Recall training",
  pets: ["Toby"],
  startDate: "2026-01-20",
  endDate: "2026-02-10",
  sessions: [
    { id: "kf-1", date: "2026-01-20", status: "completed", note: "Toby's recall is non-existent. Starting with basics." },
    { id: "kf-2", date: "2026-01-27", status: "completed" },
    { id: "kf-3", date: "2026-02-03", status: "completed", note: "Great improvement. Toby recalls 7/10 times now." },
  ],
  price: {
    lineItems: [{ label: "1-on-1 training session", amount: 600, unit: "per session" }],
    total: 1800,
    currency: "Kč",
    billingCycle: "total",
  },
  status: "completed",
  signedAt: "2026-01-18T11:00:00Z",
  paymentStatus: "paid",
};

// ── Petra sitting — Tomáš emergency ──────────────────────────────────────────

const petraSittingTomas: Booking = {
  id: "booking-petra-tomas",
  conversationId: "tomas-petra-conv",
  ownerId: "tomas",
  ownerName: "Tomáš Kovář",
  ownerAvatarUrl: "/images/generated/tomas-profile.jpeg",
  carerId: "petra",
  carerName: "Petra Veselá",
  carerAvatarUrl: "/images/generated/petra-profile.jpeg",
  type: "one_off",
  serviceType: "day_care",
  subService: "Emergency sitting",
  pets: ["Hugo"],
  startDate: "2026-03-15",
  endDate: "2026-03-17",
  sessions: [
    { id: "pt-1", date: "2026-03-15", status: "completed", note: "Hugo is an angel. He and Daisy played all afternoon." },
    { id: "pt-2", date: "2026-03-16", status: "completed" },
    { id: "pt-3", date: "2026-03-17", status: "completed", note: "Sending him back clean and tired 😄" },
  ],
  price: {
    lineItems: [{ label: "Day sitting", amount: 120, unit: "per visit" }],
    total: 360,
    currency: "Kč",
    billingCycle: "total",
  },
  status: "completed",
  signedAt: "2026-03-14T20:00:00Z",
  paymentStatus: "paid",
};

// ── Tereza sitting — watched Marek's Benny ───────────────────────────────────

const terezaSittingMarek: Booking = {
  id: "booking-tereza-marek",
  conversationId: "tereza-marek-conv",
  ownerId: "marek",
  ownerName: "Marek Dvořák",
  ownerAvatarUrl: "/images/generated/marek-profile.jpeg",
  carerId: "tereza",
  carerName: "Tereza Nováková",
  carerAvatarUrl: "/images/generated/tereza-profile.jpeg",
  type: "one_off",
  serviceType: "day_care",
  subService: "Day sitting",
  pets: ["Benny"],
  startDate: "2026-02-22",
  endDate: "2026-02-23",
  sessions: [
    { id: "tm-1", date: "2026-02-22", status: "completed", note: "Benny and Franta had the best day. They napped together." },
    { id: "tm-2", date: "2026-02-23", status: "completed" },
  ],
  price: {
    lineItems: [{ label: "Day sitting", amount: 150, unit: "per visit" }],
    total: 300,
    currency: "Kč",
    billingCycle: "total",
  },
  status: "completed",
  signedAt: "2026-02-20T16:00:00Z",
  paymentStatus: "paid",
};

// ── Klára training — Hana, reactive dog, ongoing ─────────────────────────────

const klaraTrainingHana: Booking = {
  id: "booking-klara-hana",
  conversationId: "klara-hana-conv",
  ownerId: "hana",
  ownerName: "Hana Pokorná",
  ownerAvatarUrl: "/images/generated/hana-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "ongoing",
  serviceType: "day_care",
  subService: "Reactive dog session",
  pets: ["Runa"],
  startDate: "2026-01-15",
  endDate: null,
  recurringSchedule: {
    days: ["Thu"],
    time: "11:00",
    timeLabel: "11:00am–12:00pm",
  },
  ownerNotes: "Runa is nervous in new environments. Please give her a few minutes to settle before starting exercises.",
  sessions: [
    { id: "kh-1", date: "2026-03-20", status: "completed" },
    { id: "kh-2", date: "2026-03-27", status: "completed" },
    { id: "kh-3", date: "2026-04-03", status: "completed" },
    { id: "kh-4", date: "2026-04-10", status: "completed" },
    { id: "kh-5", date: daysFromNow(5), status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "1-on-1 reactive dog session", amount: 600, unit: "per session" }],
    total: 600,
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: "2026-01-14T09:00:00Z",
  paymentStatus: "paid",
};

// ── Tereza walks Marek's Benny — ongoing Tue/Thu mornings ─────────────────────
// Casual neighbour-help arrangement. Tereza already sat for Marek (see
// `terezaSittingMarek`); that trust deepened into routine walks. Lives on
// the default persona (Tereza) so testers can demo the GPS-tracked walk
// flow without a `?as=` URL injection. Today's session is upcoming →
// Schedule quick-start affordance surfaces immediately.
const terezaWalksMarek: Booking = {
  id: "booking-tereza-walks-marek",
  conversationId: "tereza-marek-conv",
  ownerId: "marek",
  ownerName: "Marek Dvořák",
  ownerAvatarUrl: "/images/generated/marek-profile.jpeg",
  carerId: "tereza",
  carerName: "Tereza Nováková",
  carerAvatarUrl: "/images/generated/tereza-profile.jpeg",
  type: "ongoing",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Benny"],
  startDate: "2026-04-21",
  endDate: null,
  recurringSchedule: {
    days: ["Tue", "Thu"],
    time: "08:00",
    timeLabel: "8:00–8:45am",
  },
  ownerNotes: "Benny's great off-leash but on-leash he gets twitchy with bigger dogs. Stick to the south fields at Riegrovy sady. Treats in the kitchen drawer, key under the geranium pot.",
  carerNotes: "South-fields loop, ~40 min. Benny knows me — slip-lead works fine.",
  sessions: [
    { id: "tw-marek-1", date: "2026-04-23", status: "completed" },
    { id: "tw-marek-2", date: "2026-04-28", status: "completed", note: "Quiet day at the park. Benny was gentle with a young whippet." },
    { id: "tw-marek-3", date: "2026-04-30", status: "completed" },
    {
      id: "tw-marek-4",
      date: "2026-05-05",
      status: "completed",
      report: {
        photos: [],
        notes:
          "South-fields loop, full 40 min. Benny had a long sniff session by the rose garden — could have stayed there all morning. Polite hello with a Bernese, no leash drama. Treat after, key returned.",
        walkDistanceKm: 2.6,
        walkDurationMin: 40,
        completedAt: "2026-05-05T08:42:00Z",
      },
    },
    { id: "tw-marek-5", date: daysFromNow(0), status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "Solo walk", amount: 200, unit: "per session" }],
    total: 400, // 2 walks/week × 200 Kč
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: "2026-04-20T18:00:00Z",
  paymentStatus: "paid",
};

// ── Olga walks Franta — Tereza's midday walks (owner-side for default persona) ─
//
// Tereza is the default picker persona and runs the Vinohrady Evening Walkers,
// so she shows up everywhere as a connector + carer. Adding an owner-side
// booking gives her bookings on both sides simultaneously, which (a) makes
// /bookings render the dual-tab UI on the default persona without `?as=`
// trickery, and (b) reinforces the narrative that even active community
// members sometimes need help themselves. Olga is a Vinohrady-adjacent
// neighbour she'd plausibly hire. Sessions & Service Execution walkthrough
// refinement, 2026-05-08.

const olgaWalksTereza: Booking = {
  id: "booking-olga-tereza",
  conversationId: null,
  ownerId: "tereza",
  ownerName: "Tereza Nováková",
  ownerAvatarUrl: "/images/generated/tereza-profile.jpeg",
  carerId: "olga-m",
  carerName: "Olga Mašková",
  carerAvatarUrl: "/images/generated/lucie-profile.jpeg",
  type: "ongoing",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Franta"],
  startDate: daysAgo(28),
  endDate: null,
  recurringSchedule: {
    days: ["Tue", "Thu"],
    time: "11:00",
    timeLabel: "11:00am–12:00pm",
  },
  ownerNotes: "Franta knows the Riegrovy loop — that's where I take him most mornings, so it's familiar. He's gentle with everyone but can pull a bit when he sees a squirrel. Treats are in the jar by the door.",
  carerNotes: "Riegrovy loop, ~50 min. Franta and I are old friends — slip-lead is fine.",
  sessions: [
    { id: "ot-1", date: daysAgo(28), status: "completed" },
    { id: "ot-2", date: daysAgo(23), status: "completed" },
    { id: "ot-3", date: daysAgo(21), status: "completed", note: "Quiet day at the park, Franta enjoyed a long sniff." },
    { id: "ot-4", date: daysAgo(16), status: "completed" },
    { id: "ot-5", date: daysAgo(14), status: "completed" },
    { id: "ot-6", date: daysAgo(9), status: "completed" },
    { id: "ot-7", date: daysAgo(7), status: "completed" },
    { id: "ot-8", date: daysAgo(2), status: "completed" },
    { id: "ot-9", date: daysFromNow(1), status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "Solo walk", amount: 330, unit: "per session" }],
    total: 660, // 2 walks/week × 330 Kč
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: daysAgoIso(29, "10:00"),
  paymentStatus: "paid",
};

// ── Exports ─────────────────────────────────────────────────────────────────────

export const mockBookings: Booking[] = [
  olgaBooking,
  nikolaBooking,
  petraBooking,
  shawnCarerCompletedBooking,
  shawnCarerActiveBooking,
  klaraTrainingDaniel,
  klaraTrainingFilip,
  petraSittingTomas,
  terezaSittingMarek,
  terezaWalksMarek,
  klaraTrainingHana,
  olgaWalksTereza,
];

export function getBooking(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id);
}

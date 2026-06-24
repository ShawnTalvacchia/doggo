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
  // Walk Service Delivery, 2026-05-20. Pickup: ownerNotes reference key
  // under the pot + treats in the kitchen — Olga enters Shawn's flat.
  delivery: "pickup",
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
  // Walk Service Delivery, 2026-05-20. Pickup: a drop-in visit is by
  // definition the carer coming to the owner's home.
  delivery: "pickup",
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
  // Walk Service Delivery, 2026-05-20. Pickup: Shawn (Vinohrady) collects
  // Hugo from Tomáš (Karlín) — owner doesn't travel cross-district.
  delivery: "pickup",
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
  // Walk Service Delivery, 2026-05-20. Pickup: group-walk pattern where
  // Shawn collects each dog on the route.
  delivery: "pickup",
  subService: "Small-group walk",
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
    lineItems: [{ label: "Small-group walk", amount: 250, unit: "per session" }],
    total: 500,
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: "2026-03-01T11:30:00Z",
  paymentStatus: "paid",
};

// ── Klára training — Filip, one-off sessions ─────────────────────────────────

// ── Klára training — Anežka's Nela, completed ────────────────────────────────
// Seeded for E4 (Circle attribution) so Daniel viewing Klára sees at least
// one of his Connected friends has booked her. Anežka is in Daniel's circle
// per mockConnections (both active in Prague Reactive Dog Support); this
// gives the "1 in your circle has booked them" signal a real source.
// 2026-06-09.

const klaraTrainingAnezka: Booking = {
  id: "booking-klara-anezka",
  conversationId: null,
  ownerId: "anezka",
  ownerName: "Anežka Veselá",
  ownerAvatarUrl: "/images/generated/anezka-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "one_off",
  serviceType: "day_care",
  subService: "Calm-handling session",
  pets: ["Nela"],
  startDate: "2026-03-05",
  endDate: "2026-03-26",
  sessions: [
    { id: "ka-1", date: "2026-03-05", status: "completed", note: "Nela is reactive on leash — starting with desensitization basics." },
    { id: "ka-2", date: "2026-03-12", status: "completed" },
    { id: "ka-3", date: "2026-03-19", status: "completed", note: "Good progress — Nela held a sit through two passing dogs." },
    { id: "ka-4", date: "2026-03-26", status: "completed", note: "Anežka's homework is paying off. We're good to wrap." },
  ],
  price: {
    lineItems: [{ label: "1-on-1 training session", amount: 600, unit: "per session" }],
    total: 2400,
    currency: "Kč",
    billingCycle: "total",
  },
  status: "completed",
  signedAt: "2026-03-03T18:00:00Z",
  paymentStatus: "paid",
};

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

// ── Klára drop-off — Filip's Toby on the Stromovka walk (config #2) ──────────
// Demo Narrative V2, Beat 2. Filip books Klára to bring Toby on her free
// Stromovka walk — a drop-off Care booking (`dropoffMeetId`), so Filip is NOT
// a meet-roster attendee (book ≠ attend). `kt-3` is dated today so Beat 2 has
// a startable session; the walkthrough's Start/Finish runs against it.

const klaraDropoffToby: Booking = {
  id: "booking-klara-toby",
  conversationId: null,
  ownerId: "filip",
  ownerName: "Filip Novotný",
  ownerAvatarUrl: "/images/generated/filip-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "ongoing",
  serviceType: "walks_checkins",
  // Walk Service Delivery, 2026-05-20. Pickup: Klára collects Toby from
  // Filip's place in Holešovice on her way to Stromovka — Beat 2's "first,
  // she's got a dog to pick up" copy. 380 Kč matches Klára's pickup rate.
  delivery: "pickup",
  subService: "Small-group walk",
  pets: ["Toby"],
  dropoffMeetId: "meet-klara-stromovka",
  startDate: daysAgo(14),
  endDate: null,
  recurringSchedule: {
    days: ["Sat"],
    time: "09:40",
    timeLabel: "9:40–11:15am",
  },
  ownerNotes: "Toby has loads of energy and needs the exercise — recall's a work in progress but he's friendly with everyone. He can pull on the leash near other dogs.",
  carerNotes: "I swing by your building at 9:40 and we walk over together. Toby joins the morning group — good socialisation, and we practise loose-leash as we go.",
  sessions: [
    { id: "kt-1", date: daysAgo(14), status: "completed", note: "Toby did great with the group — tired and happy." },
    { id: "kt-2", date: daysAgo(7), status: "completed" },
    { id: "kt-3", date: daysFromNow(0), status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "Walk (pickup)", amount: 380, unit: "per session" }],
    total: 380,
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: daysAgoIso(16, "14:00"),
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
    time: "12:00",
    timeLabel: "12:00pm–1:00pm",
  },
  ownerNotes: "Runa is nervous in new environments. Please give her a few minutes to settle before starting exercises.",
  // Demo Narrative & Personas, W3.1 (2026-05-14): kh-6 added at
  // daysFromNow(0) so Beat 2 of the demo (Klára runs an active session)
  // has a startable today's-session. kh-5 stays as a future session for
  // continuity. Keep kh-6 ahead of kh-5 in the array so the
  // upcoming-list rendering surfaces it first by date.
  sessions: [
    { id: "kh-1", date: "2026-03-20", status: "completed" },
    { id: "kh-2", date: "2026-03-27", status: "completed" },
    { id: "kh-3", date: "2026-04-03", status: "completed" },
    { id: "kh-4", date: "2026-04-10", status: "completed" },
    { id: "kh-6", date: daysFromNow(0), status: "upcoming" },
    { id: "kh-5", date: daysFromNow(7), status: "upcoming" },
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
  // Walk Service Delivery, 2026-05-20. Pickup: ownerNotes reference key
  // under the geranium pot — Tereza enters Marek's flat to collect Benny.
  delivery: "pickup",
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
  // Walk Service Delivery, 2026-05-20. Pickup: ownerNotes reference treats
  // jar by the door — Olga enters Tereza's flat to collect Franta.
  delivery: "pickup",
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

/**
 * Pawel ↔ Lena — recurring weekday mid-day walks for Asha (Vizsla).
 *
 * Anchor booking for the Marketplace Owner persona (CCFT 2026-05-13).
 * Lena hired Pawel through his open care group `group-pawel-walks` and
 * never engaged with the meet/community surfaces — this booking is the
 * shape of her entire relationship with Doggo.
 */
const pawelWalksLena: Booking = {
  id: "booking-pawel-lena",
  conversationId: "lena-pawel-conv",
  ownerId: "lena",
  ownerName: "Lena Marešová",
  ownerAvatarUrl: "/images/generated/anezka-profile.jpeg",
  carerId: "pawel",
  carerName: "Pawel Kowalski",
  carerAvatarUrl: "/images/generated/marek-profile.jpeg",
  type: "ongoing",
  serviceType: "walks_checkins",
  // Walk Service Delivery, 2026-05-20. Pickup: Pawel's pickup-route brand —
  // see mockNotifications "Pickup at your building" + mockGroups "Pickup
  // available in Vinohrady and Žižkov." Pawel is pickup-only narratively.
  delivery: "pickup",
  subService: "Small-group walk",
  pets: ["Asha"],
  startDate: daysAgo(35),
  endDate: null,
  recurringSchedule: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    time: "12:30",
    timeLabel: "12:30pm–1:30pm",
  },
  ownerNotes: "Asha is sweet but high-energy — she needs movement, not chaos. Small-group walks work great as long as the other dogs are calm. Treats in the bowl by the door; harness on the hook.",
  carerNotes: "Daily group walk, ~60 min. Asha runs with the calm group — fits well with the Letná pickup route.",
  sessions: [
    { id: "pl-1", date: daysAgo(35), status: "completed" },
    { id: "pl-2", date: daysAgo(34), status: "completed" },
    { id: "pl-3", date: daysAgo(33), status: "completed" },
    { id: "pl-4", date: daysAgo(28), status: "completed" },
    { id: "pl-5", date: daysAgo(21), status: "completed", note: "Stromovka loop today — Asha did great with the puppies." },
    { id: "pl-6", date: daysAgo(14), status: "completed" },
    { id: "pl-7", date: daysAgo(7), status: "completed" },
    { id: "pl-8", date: daysAgo(2), status: "completed" },
    { id: "pl-9", date: daysFromNow(1), status: "upcoming" },
    { id: "pl-10", date: daysFromNow(2), status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "Small-group walk", amount: 250, unit: "per walk" }],
    total: 1250, // 5 walks/week × 250 Kč
    currency: "Kč",
    billingCycle: "weekly",
  },
  status: "active",
  signedAt: daysAgoIso(36, "09:00"),
  paymentStatus: "paid",
};

// ── Required-link meet bookings (Demo Narrative & Personas W3.6) ─────────────
//
// Handed off from the Service ↔ Meet Linkage walkthrough (C6, closed
// 2026-05-17). meet-care-1 / meet-care-workshop-1 / meet-care-puppy-basics are
// `required`-link meets — by the linkage model, booking IS the RSVP, so every
// non-creator roster attendee must have a backing `Booking` carrying
// `meetBooking`. `seedRecurringAttendeesByDate` writes rosters only, never
// Booking records, so pre-seeded attendees had no booking and their session
// never appeared on `/bookings`. These four close that gap — one booking per
// non-creator pre-seeded attendee, for each meet's next occurrence. Klára
// (creator of all three) needs no booking.

/** meet-care-1 (Klára's group training, required-link) — Magda's seat. */
const meetCare1Magda: Booking = {
  id: "booking-meet-care-1-magda",
  conversationId: null,
  ownerId: "magda",
  ownerName: "Magda Vondráková",
  ownerAvatarUrl: "/images/generated/lucie-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "one_off",
  meetBooking: {
    serviceId: "klara-group-training",
    serviceTitle: "Group training session",
    meetId: "meet-care-1",
    occurrenceDate: daysFromNow(3),
  },
  subService: null,
  pets: ["Žofka"],
  startDate: daysFromNow(3),
  endDate: null,
  price: {
    lineItems: [{ label: "Group training session", amount: 350, unit: "per session" }],
    total: 350,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "upcoming",
  signedAt: daysAgoIso(4, "10:00"),
  paymentStatus: "paid",
};

/** meet-care-1 (Klára's group training, required-link) — Tomáš's seat. */
const meetCare1Tomas: Booking = {
  id: "booking-meet-care-1-tomas",
  conversationId: null,
  ownerId: "tomas",
  ownerName: "Tomáš Kovář",
  ownerAvatarUrl: "/images/generated/tomas-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "one_off",
  meetBooking: {
    serviceId: "klara-group-training",
    serviceTitle: "Group training session",
    meetId: "meet-care-1",
    occurrenceDate: daysFromNow(3),
  },
  subService: null,
  pets: ["Hugo"],
  startDate: daysFromNow(3),
  endDate: null,
  price: {
    lineItems: [{ label: "Group training session", amount: 350, unit: "per session" }],
    total: 350,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "upcoming",
  signedAt: daysAgoIso(6, "18:30"),
  paymentStatus: "paid",
};

/** meet-care-workshop-1 (Klára's reactive workshop, required-link) — Daniel's seat. */
const workshopDaniel: Booking = {
  id: "booking-meet-care-workshop-1-daniel",
  conversationId: null,
  ownerId: "daniel",
  ownerName: "Daniel Procházka",
  ownerAvatarUrl: "/images/generated/daniel-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "one_off",
  meetBooking: {
    serviceId: "klara-reactive",
    serviceTitle: "Reactive dog session",
    meetId: "meet-care-workshop-1",
    occurrenceDate: daysFromNow(10),
  },
  subService: null,
  pets: ["Bára"],
  startDate: daysFromNow(10),
  endDate: null,
  price: {
    lineItems: [{ label: "Reactive dog session", amount: 600, unit: "per session" }],
    total: 600,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "upcoming",
  signedAt: daysAgoIso(8, "20:15"),
  paymentStatus: "paid",
};

/** meet-care-puppy-basics (Klára's puppy cohort, required-link) — Jana's seat. */
const puppyBasicsJana: Booking = {
  id: "booking-meet-care-puppy-basics-jana",
  conversationId: null,
  ownerId: "jana",
  ownerName: "Jana Krejčí",
  ownerAvatarUrl: "/images/generated/jana-profile.jpeg",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "/images/generated/klara-profile.jpeg",
  type: "one_off",
  meetBooking: {
    serviceId: "klara-puppy-basics",
    serviceTitle: "Puppy basics",
    meetId: "meet-care-puppy-basics",
    occurrenceDate: daysFromNow(4),
  },
  subService: null,
  pets: ["Rex"],
  startDate: daysFromNow(4),
  endDate: null,
  price: {
    lineItems: [{ label: "Puppy basics", amount: 400, unit: "per session" }],
    total: 400,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "upcoming",
  signedAt: daysAgoIso(3, "12:00"),
  paymentStatus: "paid",
};

// ── Shelter handover seed — "today at Útulek" (Phase 2, 2026-06-24) ──────────────
//
// Representative shelter-walk Bookings (`ownerKind: "shelter"`) at Útulek Liběň
// for the operator handover board ("today's walks"). These give the operator
// view real, illustrative content — a realistic morning across the handover
// lifecycle: due to collect → out now → back safe. The shelter is the "owner"
// party; the walker is the carer. Volunteer walks (price 0). The operator's
// check-out/check-in actions write `session.releasedAt` / `session.returnedAt`
// (the logged custody trail); the walker's own check-in/finish write
// `checkedInAt` / `report.completedAt` (the walk itself).
//
// The board derives "today" loosely (any shelter walk not yet returned, plus
// today's returned rows), so these stay populated regardless of the run date.

const SHELTER = {
  ownerKind: "shelter" as const,
  ownerId: "utulek-liben",
  ownerName: "Útulek Liběň",
  ownerAvatarUrl: "/images/generated/shelter-utulek-liben-logo.jpeg",
};

const VOLUNTEER_PRICE = {
  lineItems: [{ label: "Volunteer walk", amount: 0, unit: "volunteer" }],
  total: 0,
  currency: "Kč" as const,
  billingCycle: "total" as const,
};

const WALK_PHOTO = "/images/generated/group-walk-utulek.jpeg";

// 1. Due to collect — Pavel D. is booked to walk Maja this morning; the
//    shelter hasn't released her yet (no releasedAt). Board action: Check out.
const handoverMajaPavel: Booking = {
  id: "booking-shelter-maja-pavel",
  conversationId: null,
  ...SHELTER,
  carerId: "pavel-d",
  carerName: "Pavel D.",
  carerAvatarUrl: "/images/generated/marek-profile.jpeg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Maja"],
  startDate: daysFromNow(0),
  endDate: daysFromNow(0),
  sessions: [{ id: "hv-maja-1", date: daysFromNow(0), status: "upcoming" }],
  price: VOLUNTEER_PRICE,
  signedAt: daysAgoIso(0, "07:00"),
  status: "upcoming",
};

// 2. Out now, walking — Marie B. has Tonda out; released 09:35, she checked
//    in 09:40, walk in progress. Board shows her live status (visibility axis);
//    action: Confirm back safe (disabled-feeling until she's done, but allowed).
const handoverTondaMarie: Booking = {
  id: "booking-shelter-tonda-marie",
  conversationId: null,
  ...SHELTER,
  carerId: "marie",
  carerName: "Marie B.",
  carerAvatarUrl: "/images/generated/marie-profile.jpeg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Tonda"],
  startDate: daysFromNow(0),
  endDate: daysFromNow(0),
  sessions: [
    {
      id: "hv-tonda-1",
      date: daysFromNow(0),
      status: "in_progress",
      releasedAt: daysAgoIso(0, "09:35"),
      checkedInAt: daysAgoIso(0, "09:40"),
    },
  ],
  price: VOLUNTEER_PRICE,
  signedAt: daysAgoIso(0, "07:00"),
  status: "active",
};

// 3. Out now, walk finished, awaiting back-safe — Lukáš P. walked Líza and
//    sealed his report, but the shelter hasn't confirmed her back yet (no
//    returnedAt). The gap between "walker done" and "shelter confirms back
//    safe" is exactly what the back-safe check-in closes (accountability axis).
const handoverLizaLukas: Booking = {
  id: "booking-shelter-liza-lukas",
  conversationId: null,
  ...SHELTER,
  carerId: "walker-lukas-p",
  carerName: "Lukáš P.",
  carerAvatarUrl: "/images/generated/vitek-profile.jpeg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Líza"],
  startDate: daysFromNow(0),
  endDate: daysFromNow(0),
  sessions: [
    {
      id: "hv-liza-1",
      date: daysFromNow(0),
      status: "completed",
      releasedAt: daysAgoIso(0, "08:30"),
      checkedInAt: daysAgoIso(0, "08:35"),
      report: {
        photos: [WALK_PHOTO],
        notes: "Good long loop by the river. Líza was a bit hesitant at the gate, all wags once we were out.",
        walkDistanceKm: 3.2,
        walkDurationMin: 45,
        completedAt: daysAgoIso(0, "09:20"),
      },
    },
  ],
  price: VOLUNTEER_PRICE,
  signedAt: daysAgoIso(0, "07:00"),
  status: "active",
};

// 4. Back safe — Anna K. took Theo out first thing; released 07:50, returned
//    08:45, confirmed back safe. A completed row on the board (the full trail).
const handoverTheoAnna: Booking = {
  id: "booking-shelter-theo-anna",
  conversationId: null,
  ...SHELTER,
  carerId: "walker-anna-k",
  carerName: "Anna K.",
  carerAvatarUrl: "/images/generated/hana-profile.jpeg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Solo walk",
  pets: ["Theo"],
  startDate: daysFromNow(0),
  endDate: daysFromNow(0),
  sessions: [
    {
      id: "hv-theo-1",
      date: daysFromNow(0),
      status: "completed",
      releasedAt: daysAgoIso(0, "07:50"),
      checkedInAt: daysAgoIso(0, "07:55"),
      returnedAt: daysAgoIso(0, "08:45"),
      report: {
        photos: [WALK_PHOTO],
        notes: "Quick morning walk, Theo did his business and was happy to head back.",
        walkDistanceKm: 2.1,
        walkDurationMin: 40,
        completedAt: daysAgoIso(0, "08:40"),
      },
    },
  ],
  price: VOLUNTEER_PRICE,
  signedAt: daysAgoIso(0, "07:00"),
  status: "completed",
};

// 5 + 6. Group walk batch — two dogs going out on Klára's trainer-led
//    Saturday group walk (linked via dropoffMeetId). Both due to collect; the
//    board groups them so the operator can release the batch at once. This is
//    the FC18 multi-dog checkout question, shown as a PROPOSAL (mentor as the
//    responsible party who signs out the group), not a committed model.
const handoverEddaGroup: Booking = {
  id: "booking-shelter-edda-group",
  conversationId: null,
  ...SHELTER,
  carerId: "walker-helena-s",
  carerName: "Helena S.",
  carerAvatarUrl: "/images/generated/eva-profile.jpeg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Group walk",
  pets: ["Edda"],
  startDate: daysFromNow(0),
  endDate: daysFromNow(0),
  dropoffMeetId: "meet-klara-stromovka",
  sessions: [{ id: "hv-edda-1", date: daysFromNow(0), status: "upcoming" }],
  price: VOLUNTEER_PRICE,
  signedAt: daysAgoIso(0, "07:00"),
  status: "upcoming",
};

const handoverNoraGroup: Booking = {
  id: "booking-shelter-nora-group",
  conversationId: null,
  ...SHELTER,
  carerId: "walker-karolina-m",
  carerName: "Karolína M.",
  carerAvatarUrl: "/images/generated/adela-profile.jpeg",
  type: "one_off",
  serviceType: "walks_checkins",
  subService: "Group walk",
  pets: ["Nora"],
  startDate: daysFromNow(0),
  endDate: daysFromNow(0),
  dropoffMeetId: "meet-klara-stromovka",
  sessions: [{ id: "hv-nora-1", date: daysFromNow(0), status: "upcoming" }],
  price: VOLUNTEER_PRICE,
  signedAt: daysAgoIso(0, "07:00"),
  status: "upcoming",
};

// Upcoming walks (future-dated) — so the operator Schedule shows more than
// today (today's handover board + an Upcoming section). No handover state yet
// (not collectable until their day).
function upcomingShelterWalk(
  id: string,
  carer: { id: string; name: string; avatarUrl: string },
  dog: string,
  dayOffset: number,
): Booking {
  return {
    id,
    conversationId: null,
    ...SHELTER,
    carerId: carer.id,
    carerName: carer.name,
    carerAvatarUrl: carer.avatarUrl,
    type: "one_off",
    serviceType: "walks_checkins",
    subService: "Solo walk",
    pets: [dog],
    startDate: daysFromNow(dayOffset),
    endDate: daysFromNow(dayOffset),
    sessions: [{ id: `${id}-s1`, date: daysFromNow(dayOffset), status: "upcoming" }],
    price: VOLUNTEER_PRICE,
    signedAt: daysAgoIso(0, "07:00"),
    status: "upcoming",
  };
}

const handoverUpcoming: Booking[] = [
  upcomingShelterWalk(
    "booking-shelter-up-1",
    { id: "marie", name: "Marie B.", avatarUrl: "/images/generated/marie-profile.jpeg" },
    "Maja",
    1,
  ),
  upcomingShelterWalk(
    "booking-shelter-up-2",
    { id: "pavel-d", name: "Pavel D.", avatarUrl: "/images/generated/marek-profile.jpeg" },
    "Theo",
    1,
  ),
  upcomingShelterWalk(
    "booking-shelter-up-3",
    { id: "walker-anna-k", name: "Anna K.", avatarUrl: "/images/generated/hana-profile.jpeg" },
    "Tonda",
    2,
  ),
];

// ── Exports ─────────────────────────────────────────────────────────────────────

/**
 * Seed version for the `doggo-bookings` persisted store. Bump this any
 * time a new entry is added (or an existing one is meaningfully edited)
 * that should appear without requiring testers to hit /demo Reset.
 * P55, 2026-06-02. See `lib/usePersistedState.ts` → `seedVersion`.
 */
export const BOOKINGS_SEED_VERSION = 3;

export const mockBookings: Booking[] = [
  olgaBooking,
  nikolaBooking,
  petraBooking,
  shawnCarerCompletedBooking,
  shawnCarerActiveBooking,
  klaraTrainingAnezka,
  klaraTrainingFilip,
  klaraDropoffToby,
  petraSittingTomas,
  terezaSittingMarek,
  terezaWalksMarek,
  klaraTrainingHana,
  olgaWalksTereza,
  pawelWalksLena,
  meetCare1Magda,
  meetCare1Tomas,
  workshopDaniel,
  puppyBasicsJana,
  // Shelter handover seed (today at Útulek)
  handoverMajaPavel,
  handoverTondaMarie,
  handoverLizaLukas,
  handoverTheoAnna,
  handoverEddaGroup,
  handoverNoraGroup,
  ...handoverUpcoming,
];

export function getBooking(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id);
}

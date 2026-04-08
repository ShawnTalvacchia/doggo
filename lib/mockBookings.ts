import type { Booking } from "./types";

// ── Active ongoing — Olga, solo walks Mon/Wed/Fri ──────────────────────────────
// Today is 2026-03-07 (Sat). Walks started Mon Mar 2.
// Completed: Mar 2, Mar 4, Mar 6 | Upcoming: Mar 9, Mar 11, Mar 13

const olgaBooking: Booking = {
  id: "booking-olga-walks",
  conversationId: "olga-conv",
  ownerId: "shawn",
  ownerName: "Shawn Talvacchia",
  ownerAvatarUrl:
    "/images/generated/shawn-profile.jpg",
  carerId: "olga-m",
  carerName: "Olga Mašková",
  carerAvatarUrl:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  type: "ongoing",
  serviceType: "walk_checkin",
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
    total: 330,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "active",
  sessions: [
    { id: "s-olga-1", date: "2026-03-02", status: "completed", note: "Spot did great, very energetic today!" },
    { id: "s-olga-2", date: "2026-03-04", status: "completed", note: "Met a new friend in the park 🐕" },
    { id: "s-olga-3", date: "2026-03-06", status: "completed" },
    { id: "s-olga-4", date: "2026-03-09", status: "upcoming" },
    { id: "s-olga-5", date: "2026-03-11", status: "upcoming" },
    { id: "s-olga-6", date: "2026-03-13", status: "upcoming" },
  ],
  signedAt: "2026-02-28T14:30:00Z",
  paymentStatus: "paid",
};

// ── Upcoming one-off — Nikola, overnight boarding Aug 12–18 ────────────────────

const nikolaBooking: Booking = {
  id: "booking-nikola-boarding",
  conversationId: "nikola-conv",
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
  carerId: "petra-v",
  carerName: "Petra Veselá",
  carerAvatarUrl:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  type: "one_off",
  serviceType: "walk_checkin",
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
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  carerId: "shawn",
  carerName: "Shawn Talvacchia",
  carerAvatarUrl: "/images/generated/shawn-profile.jpg",
  type: "one_off",
  serviceType: "walk_checkin",
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
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
  carerId: "shawn",
  carerName: "Shawn Talvacchia",
  carerAvatarUrl: "/images/generated/shawn-profile.jpg",
  type: "ongoing",
  serviceType: "walk_checkin",
  subService: "Group walk",
  pets: ["Molly"],
  startDate: "2026-03-03",
  endDate: null,
  recurringSchedule: {
    days: ["Tue", "Thu"],
    time: "09:00",
    timeLabel: "9:00–10:00am",
  },
  sessions: [
    { id: "skc-1", date: "2026-03-03", status: "completed" },
    { id: "skc-2", date: "2026-03-05", status: "completed" },
    { id: "skc-3", date: "2026-03-10", status: "upcoming" },
    { id: "skc-4", date: "2026-03-12", status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "Group walk", amount: 250, unit: "per session" }],
    total: 250,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "active",
  signedAt: "2026-03-01T11:30:00Z",
  paymentStatus: "paid",
};

// ── Klára training — Daniel, recurring sessions ──────────────────────────────

const klaraTrainingDaniel: Booking = {
  id: "booking-klara-daniel",
  conversationId: null,
  ownerId: "daniel",
  ownerName: "Daniel Procházka",
  ownerAvatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  type: "ongoing",
  serviceType: "inhome_sitting", // using inhome_sitting as proxy for training
  subService: "Reactive dog session",
  pets: ["Bára"],
  startDate: "2026-02-10",
  endDate: null,
  recurringSchedule: {
    days: ["Wed"],
    time: "10:00",
    timeLabel: "10:00–11:00am",
  },
  sessions: [
    { id: "kd-1", date: "2026-02-12", status: "completed", note: "Good first session. Bára responded well to the threshold exercises." },
    { id: "kd-2", date: "2026-02-19", status: "completed", note: "Bára stayed under threshold with Eda at 5m. Big progress." },
    { id: "kd-3", date: "2026-02-26", status: "completed" },
    { id: "kd-4", date: "2026-03-05", status: "completed" },
    { id: "kd-5", date: "2026-03-12", status: "upcoming" },
    { id: "kd-6", date: "2026-03-19", status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "1-on-1 reactive dog session", amount: 600, unit: "per session" }],
    total: 600,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "active",
  signedAt: "2026-02-08T14:00:00Z",
  paymentStatus: "paid",
};

// ── Klára training — Filip, one-off sessions ─────────────────────────────────

const klaraTrainingFilip: Booking = {
  id: "booking-klara-filip",
  conversationId: null,
  ownerId: "filip",
  ownerName: "Filip Novotný",
  ownerAvatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  type: "one_off",
  serviceType: "inhome_sitting",
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
  conversationId: null,
  ownerId: "tomas",
  ownerName: "Tomáš Kovář",
  ownerAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  carerId: "petra",
  carerName: "Petra Veselá",
  carerAvatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&q=80",
  type: "one_off",
  serviceType: "inhome_sitting",
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
  conversationId: null,
  ownerId: "marek",
  ownerName: "Marek Dvořák",
  ownerAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  carerId: "tereza",
  carerName: "Tereza Nováková",
  carerAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  type: "one_off",
  serviceType: "inhome_sitting",
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
  conversationId: null,
  ownerId: "hana",
  ownerName: "Hana Pokorná",
  ownerAvatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80",
  carerId: "klara",
  carerName: "Klára Horáčková",
  carerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  type: "ongoing",
  serviceType: "inhome_sitting",
  subService: "Reactive dog session",
  pets: ["Runa"],
  startDate: "2026-01-15",
  endDate: null,
  recurringSchedule: {
    days: ["Thu"],
    time: "11:00",
    timeLabel: "11:00am–12:00pm",
  },
  sessions: [
    { id: "kh-1", date: "2026-01-16", status: "completed" },
    { id: "kh-2", date: "2026-01-23", status: "completed" },
    { id: "kh-3", date: "2026-01-30", status: "completed" },
    { id: "kh-4", date: "2026-02-06", status: "completed" },
    { id: "kh-5", date: "2026-02-13", status: "completed" },
    { id: "kh-6", date: "2026-03-13", status: "upcoming" },
  ],
  price: {
    lineItems: [{ label: "1-on-1 reactive dog session", amount: 600, unit: "per session" }],
    total: 600,
    currency: "Kč",
    billingCycle: "per_session",
  },
  status: "active",
  signedAt: "2026-01-14T09:00:00Z",
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
  klaraTrainingHana,
];

export function getBooking(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id);
}

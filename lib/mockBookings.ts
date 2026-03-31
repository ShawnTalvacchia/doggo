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
  ownerId: "tomas-k",
  ownerName: "Tomáš Kovář",
  ownerAvatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  carerId: "shawn",
  carerName: "Shawn Talvacchia",
  carerAvatarUrl: "/images/generated/shawn-profile.jpg",
  type: "one_off",
  serviceType: "walk_checkin",
  subService: "Solo walk",
  pets: ["Rex"],
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

// ── Shawn as carer — active, Klára Horáčková, group walks ongoing ──────────────

const shawnCarerActiveBooking: Booking = {
  id: "booking-shawn-carer-klara",
  conversationId: null,
  ownerId: "klara-h",
  ownerName: "Klára Horáčková",
  ownerAvatarUrl:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
  carerId: "shawn",
  carerName: "Shawn Talvacchia",
  carerAvatarUrl: "/images/generated/shawn-profile.jpg",
  type: "ongoing",
  serviceType: "walk_checkin",
  subService: "Group walk",
  pets: ["Bruno"],
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

// ── Exports ─────────────────────────────────────────────────────────────────────

export const mockBookings: Booking[] = [
  olgaBooking,
  nikolaBooking,
  petraBooking,
  shawnCarerCompletedBooking,
  shawnCarerActiveBooking,
];

export function getBooking(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id);
}

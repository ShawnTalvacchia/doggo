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
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
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
};

// ── Upcoming one-off — Nikola, overnight boarding Aug 12–18 ────────────────────

const nikolaBooking: Booking = {
  id: "booking-nikola-boarding",
  conversationId: "nikola-conv",
  ownerId: "shawn",
  ownerName: "Shawn Talvacchia",
  ownerAvatarUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
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
};

// ── Completed — Petra, drop-in visits Dec 2025 ─────────────────────────────────

const petraBooking: Booking = {
  id: "booking-petra-dropins",
  conversationId: null,
  ownerId: "shawn",
  ownerName: "Shawn Talvacchia",
  ownerAvatarUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
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
};

// ── Exports ─────────────────────────────────────────────────────────────────────

export const mockBookings: Booking[] = [olgaBooking, nikolaBooking, petraBooking];

export function getBooking(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id);
}

import type { AppNotification } from "./types";

export const mockNotifications: AppNotification[] = [
  {
    id: "notif-1",
    type: "session_completed",
    title: "Walk completed",
    body: "Olga completed Spot's morning walk.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    href: "/bookings/booking-olga-walks",
    createdAt: "2026-03-09T09:15:00Z",
    read: false,
  },
  {
    id: "notif-2",
    type: "booking_proposal",
    title: "New booking proposal",
    body: "Jana sent a proposal for Mon–Fri walks starting Sep 1.",
    avatarUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80",
    href: "/inbox/jana-conv",
    createdAt: "2026-03-06T08:11:00Z",
    read: false,
  },
  {
    id: "notif-3",
    type: "new_message",
    title: "New message from Marie",
    body: "\"When are you free this week?\"",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    href: "/inbox/marie-conv",
    createdAt: "2026-03-07T10:02:00Z",
    read: true,
  },
  {
    id: "notif-4",
    type: "booking_confirmed",
    title: "Booking confirmed",
    body: "Overnight boarding with Nikola confirmed for Aug 12.",
    avatarUrl:
      "https://images.unsplash.com/photo-1530785602389-07594beb8b73?auto=format&fit=crop&w=120&q=80",
    href: "/bookings/booking-nikola-boarding",
    createdAt: "2026-03-05T10:15:00Z",
    read: true,
  },
];

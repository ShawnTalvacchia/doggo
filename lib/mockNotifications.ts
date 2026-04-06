import type { AppNotification } from "./types";
export type { AppNotification } from "./types";

export const mockNotifications: AppNotification[] = [
  {
    id: "notif-1",
    type: "meet_invite",
    title: "Jana invited you to a meet",
    body: "Weekend hangout — Stromovka, Sat 21 Mar at 10:00",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    href: "/meets/meet-2",
    createdAt: "2026-04-05T09:30:00Z",
    read: false,
  },
  {
    id: "notif-2",
    type: "connection_request",
    title: "Martin wants to connect",
    body: "You met at Stromovka Off-Leash Club",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    href: "/profile/martin",
    createdAt: "2026-04-05T08:15:00Z",
    read: false,
  },
  {
    id: "notif-3",
    type: "booking_confirmed",
    title: "Booking confirmed",
    body: "Klára accepted your booking for Tue 8 Apr, 14:00 — Solo walk",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    href: "/bookings",
    createdAt: "2026-04-04T18:00:00Z",
    read: false,
  },
  {
    id: "notif-4",
    type: "group_activity",
    title: "New post in Vinohrady Morning Crew",
    body: "Tereza shared a photo from this morning's walk",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    href: "/communities/group-1",
    createdAt: "2026-04-04T11:30:00Z",
    read: true,
  },
  {
    id: "notif-5",
    type: "meet_reminder",
    title: "Meet tomorrow",
    body: "Morning walk — Riegrovy sady, Tue 18 Mar at 08:00",
    avatarUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    href: "/meets/meet-1",
    createdAt: "2026-04-04T10:00:00Z",
    read: true,
  },
  {
    id: "notif-6",
    type: "connection_accepted",
    title: "Eva accepted your connection",
    body: "You're now connected — you can message each other and book care",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    href: "/profile/eva",
    createdAt: "2026-04-03T16:00:00Z",
    read: true,
  },
  {
    id: "notif-7",
    type: "care_review",
    title: "Jana left you a review",
    body: "\"Shawn was great with Rex. Very reliable and caring.\" ★★★★★",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    href: "/profile",
    createdAt: "2026-04-03T12:00:00Z",
    read: true,
  },
  {
    id: "notif-8",
    type: "meet_invite",
    title: "Eva invited you to training",
    body: "Recall practice — Letná, Sat 22 Mar at 09:00",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    href: "/meets/meet-3",
    createdAt: "2026-04-02T14:00:00Z",
    read: true,
  },
  {
    id: "notif-9",
    type: "group_activity",
    title: "Tomáš joined Vinohrady Morning Crew",
    body: "Your group now has 3 members",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    href: "/communities/group-1",
    createdAt: "2026-04-01T09:00:00Z",
    read: true,
  },
  {
    id: "notif-10",
    type: "session_completed",
    title: "Walk completed",
    body: "Klára completed Spot's solo walk. Leave a review?",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    href: "/bookings",
    createdAt: "2026-03-31T17:00:00Z",
    read: true,
  },
];

export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}

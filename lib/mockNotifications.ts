import type { AppNotification } from "./types";
import { daysAgoIso, daysFromNowIso } from "./mockDate";
export type { AppNotification } from "./types";

export const mockNotifications: AppNotification[] = [
  // Series-update notification — Shawn follows meet-7 (Thursday morning Vinohrady walk).
  // Stubbed entry to confirm the UI handles the new notification type. Full delivery
  // pipeline (24h reminders, batched "new dates added" digests) is out of scope —
  // see meet-recurrence-model phase doc workstream G2.
  {
    id: "notif-series-1",
    type: "meet_series_update",
    title: "Thursday morning walk — new dates",
    body: "Three new occurrences scheduled. Next one is Thu 30 Apr at 08:00.",
    avatarUrl: "/images/generated/post-franta-stick.jpeg",
    href: "/meets/meet-7",
    createdAt: daysAgoIso(1, "09:00"),
    read: false,
  },
  {
    id: "notif-postmeet-1",
    type: "post_meet_review",
    title: "How was Saturday Stromovka off-leash?",
    body: "Mark who you met and turn some familiar faces into connections",
    avatarUrl: "/images/generated/post-stromovka-saturday.jpeg",
    href: "/meets/meet-9/connect",
    createdAt: daysAgoIso(13, "19:00"),
    read: false,
  },
  {
    id: "notif-postmeet-2",
    type: "post_meet_review",
    title: "Thursday walk — review attendees",
    body: "Tereza, Marek, Lucie and Jana were there — want to mark anyone as familiar?",
    avatarUrl: "/images/generated/tereza-profile.jpeg",
    href: "/meets/meet-7/connect",
    createdAt: daysAgoIso(16, "10:30"),
    read: true,
  },
  {
    id: "notif-1",
    type: "meet_invite",
    title: "Jana invited you to a meet",
    body: "Weekend hangout — Stromovka, Sat 21 Mar at 10:00",
    avatarUrl:
      "/images/generated/jana-profile.jpeg",
    href: "/meets/meet-2",
    createdAt: daysAgoIso(21, "09:30"),
    read: false,
  },
  {
    id: "notif-2",
    type: "connection_request",
    title: "Martin wants to connect",
    body: "You met at Stromovka Off-Leash Club",
    avatarUrl:
      "/images/generated/martin-profile.jpeg",
    href: "/profile/martin",
    createdAt: daysAgoIso(21, "08:15"),
    read: false,
  },
  {
    id: "notif-3",
    type: "booking_confirmed",
    title: "Booking confirmed",
    body: "Klára accepted your booking for Tue 8 Apr, 14:00 — Solo walk",
    avatarUrl:
      "/images/generated/klara-profile.jpeg",
    href: "/bookings/booking-klara",
    createdAt: daysAgoIso(22, "18:00"),
    read: false,
  },
  {
    id: "notif-4",
    type: "group_activity",
    title: "New post in Vinohrady Morning Crew",
    body: "Tereza shared a photo from this morning's walk",
    avatarUrl:
      "/images/generated/tereza-profile.jpeg",
    href: "/communities/group-1",
    createdAt: daysAgoIso(22, "11:30"),
    read: true,
  },
  {
    id: "notif-5",
    type: "meet_reminder",
    title: "Meet tomorrow",
    body: "Morning walk — Riegrovy sady, Tue 18 Mar at 08:00",
    avatarUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    href: "/meets/meet-1",
    createdAt: daysAgoIso(22, "10:00"),
    read: true,
  },
  {
    id: "notif-6",
    type: "connection_accepted",
    title: "Eva accepted your connection",
    body: "You're now connected — you can message each other and book care",
    avatarUrl:
      "/images/generated/eva-profile.jpeg",
    href: "/profile/eva",
    createdAt: daysAgoIso(23, "16:00"),
    read: true,
  },
  {
    id: "notif-7",
    type: "care_review",
    title: "Jana left you a review",
    body: "\"Shawn was great with Rex. Very reliable and caring.\" ★★★★★",
    avatarUrl:
      "/images/generated/jana-profile.jpeg",
    href: "/profile",
    createdAt: daysAgoIso(23, "12:00"),
    read: true,
  },
  {
    id: "notif-8",
    type: "meet_invite",
    title: "Eva invited you to training",
    body: "Recall practice — Letná, Sat 22 Mar at 09:00",
    avatarUrl:
      "/images/generated/eva-profile.jpeg",
    href: "/meets/meet-3",
    createdAt: daysAgoIso(24, "14:00"),
    read: true,
  },
  {
    id: "notif-9",
    type: "group_activity",
    title: "Tomáš joined Vinohrady Morning Crew",
    body: "Your group now has 3 members",
    avatarUrl:
      "/images/generated/tomas-profile.jpeg",
    href: "/communities/group-1",
    createdAt: daysAgoIso(25, "09:00"),
    read: true,
  },
  {
    id: "notif-10",
    type: "session_completed",
    title: "Walk completed",
    body: "Klára completed Spot's solo walk. Leave a review?",
    avatarUrl:
      "/images/generated/klara-profile.jpeg",
    href: "/bookings/booking-klara",
    createdAt: "2026-03-31T17:00:00Z",
    read: true,
  },
  {
    id: "notif-11",
    type: "meet_rsvp",
    title: "Petra is going to your meet",
    body: "Morning walk — Riegrovy sady, Wed 18 Mar",
    avatarUrl:
      "/images/generated/zuzana-profile.jpeg",
    href: "/meets/meet-1",
    createdAt: "2026-03-30T14:00:00Z",
    read: true,
  },
  {
    id: "notif-11b",
    type: "meet_rsvp",
    title: "Tomáš is going to your meet",
    body: "Morning walk — Riegrovy sady, Wed 18 Mar",
    avatarUrl:
      "/images/generated/tomas-profile.jpeg",
    href: "/meets/meet-1",
    createdAt: "2026-03-30T13:30:00Z",
    read: true,
  },
  {
    id: "notif-12",
    type: "group_activity",
    title: "New post in Prague Doodle Owners",
    body: "Jana shared grooming day results",
    avatarUrl:
      "/images/generated/jana-profile.jpeg",
    href: "/communities/group-doodle-owners",
    createdAt: "2026-03-30T10:00:00Z",
    read: true,
  },
  {
    id: "notif-13",
    type: "booking_message",
    title: "New message from Olga",
    body: "Re: Walks & Check-ins — \"See you Monday at 8!\"",
    avatarUrl:
      "/images/generated/adela-profile.jpeg",
    href: "/profile/olga-m?tab=chat",
    createdAt: "2026-03-29T19:00:00Z",
    read: true,
  },
  {
    id: "notif-14",
    type: "meet_invite",
    title: "Pawel created a new meet",
    body: "Morning Pack Walk — Riegrovy sady, Fri 10 Apr at 09:00",
    avatarUrl:
      "/images/generated/marek-profile.jpeg",
    href: "/meets/meet-care-2",
    createdAt: "2026-03-28T12:00:00Z",
    read: true,
  },
  {
    id: "notif-15",
    type: "connection_request",
    title: "Petra wants to connect",
    body: "You met at Reactive Dog Support",
    avatarUrl:
      "/images/generated/zuzana-profile.jpeg",
    href: "/profile/petra",
    createdAt: "2026-03-27T11:00:00Z",
    read: true,
  },
  {
    id: "notif-16",
    type: "group_activity",
    title: "Klára posted in Calm Dog Sessions",
    body: "Next session is Thursday 10am at Letná",
    avatarUrl:
      "/images/generated/klara-profile.jpeg",
    href: "/communities/group-klara-training",
    createdAt: "2026-03-26T09:00:00Z",
    read: true,
  },
  {
    id: "notif-17",
    type: "meet_reminder",
    title: "Meet in 2 hours",
    body: "Recall practice — Letná, today at 09:00",
    avatarUrl: "/images/generated/training-session.jpeg",
    href: "/meets/meet-3",
    createdAt: "2026-03-25T07:00:00Z",
    read: true,
  },
  {
    id: "notif-18",
    type: "post_comment",
    title: "Eva commented on your post",
    body: "\"Luna loved it too. Same time tomorrow?\"",
    avatarUrl:
      "/images/generated/eva-profile.jpeg",
    href: "/communities/group-1",
    createdAt: "2026-03-24T10:30:00Z",
    read: true,
  },
  {
    id: "notif-19",
    type: "new_message",
    title: "New message from Jana",
    body: "\"Hey! Are you free for a walk this weekend?\"",
    avatarUrl: "/images/generated/jana-profile.jpeg",
    href: "/profile/jana?tab=chat",
    createdAt: "2026-03-23T15:00:00Z",
    read: true,
  },
  {
    id: "notif-20",
    type: "booking_proposal",
    title: "Klára sent a booking proposal",
    body: "Solo walk — 600 Kč per session, starting Tue 8 Apr",
    avatarUrl:
      "/images/generated/klara-profile.jpeg",
    href: "/profile/klara?tab=chat",
    createdAt: "2026-03-22T11:00:00Z",
    read: true,
  },
];

export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}

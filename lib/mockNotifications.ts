import type { AppNotification } from "./types";
import { daysAgoIso, daysFromNowIso } from "./mockDate";
export type { AppNotification } from "./types";

/**
 * Seed version for the `doggo-notifications` persisted store. Bump this
 * any time a new notification seed is added so testers see it without
 * a /demo Reset. P55, 2026-06-02.
 */
export const NOTIFICATIONS_SEED_VERSION = 2;

export const mockNotifications: AppNotification[] = [
  // Series-update notification — Shawn follows meet-7 (Thursday morning Vinohrady walk).
  // Stubbed entry to confirm the UI handles the new notification type. Full delivery
  // pipeline (24h reminders, batched "new dates added" digests) is out of scope —
  // see meet-recurrence-model phase doc workstream G2.
  {
    id: "notif-series-1",
    recipientId: "tereza",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "tereza",
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
    id: "notif-11",
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
    type: "connection_request",
    title: "Petra wants to connect",
    body: "You met at Reactive Dog Support",
    avatarUrl:
      "/images/generated/zuzana-profile.jpeg",
    href: "/profile/petra",
    createdAt: "2026-03-27T11:00:00Z",
    read: true,
  },
  // tag_pending notifications for Daniel — match the DEMO_PENDING_TAGS
  // entries in lib/usePendingTagsStore.ts. The /notifications surface
  // renders inline Approve/Reject buttons; resolved notifications are
  // filtered out at render time via the store's getDecision. Photos &
  // Galleries phase, 2026-06-04.
  {
    id: "notif-tag-pending-bara-klara",
    recipientId: "daniel",
    actorId: "klara",
    type: "tag_pending",
    title: "Klára tagged Bára in a post",
    body: "\"Bára and I worked on parallel walking with a calm helper dog…\"",
    avatarUrl: "/images/generated/klara-profile.jpeg",
    href: "/communities/group-reactive-dogs",
    createdAt: daysAgoIso(5, "11:30"),
    read: false,
    postId: "post-bara-klara-progress",
    dogId: "bara",
  },
  {
    id: "notif-tag-pending-bara-hana",
    recipientId: "daniel",
    actorId: "hana",
    type: "tag_pending",
    title: "Hana tagged Bára in a post",
    body: "\"Franta did the gentleman bow to Bára this morning…\"",
    avatarUrl: "/images/generated/hana-profile.jpeg",
    href: "/profile/hana",
    createdAt: daysAgoIso(14, "09:30"),
    read: false,
    postId: "post-franta-hana-meet",
    dogId: "bara",
  },
  {
    id: "notif-16",
    recipientId: "daniel",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
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
    recipientId: "shawn",
    type: "booking_proposal",
    title: "Klára sent a booking proposal",
    body: "Solo walk — 600 Kč per session, starting Tue 8 Apr",
    avatarUrl:
      "/images/generated/klara-profile.jpeg",
    href: "/profile/klara?tab=chat",
    createdAt: "2026-03-22T11:00:00Z",
    read: true,
  },
  /*
   * Narrative-bound notifications, added 2026-05-14 (Demo Narrative &
   * Personas, W3.4 — partial close of P59). Gives Klára / Magda / Lena
   * non-empty bells at demo session start so the notifications surface
   * doesn't read as broken when a tester switches personas. Tomáš still
   * runs on his existing seeded surface; broader P59 sweep across the
   * full supporting cast remains open.
   */
  {
    id: "notif-klara-1",
    recipientId: "klara",
    type: "meet_reminder",
    title: "Today's session: Hana + Runa",
    body: "Reactive-dog session at Stromovka — 11:00. Runa's been doing well with threshold work.",
    avatarUrl: "/images/generated/runa-portrait.jpeg",
    href: "/bookings/booking-klara-hana",
    createdAt: daysAgoIso(0, "07:30"),
    read: false,
  },
  {
    id: "notif-klara-2",
    recipientId: "klara",
    type: "booking_proposal",
    title: "Filip wants to book a follow-up",
    body: "Toby — recall practice, 1-on-1. Asking about next Saturday.",
    avatarUrl: "/images/generated/filip-profile.jpeg",
    href: "/profile/filip?tab=chat",
    createdAt: daysAgoIso(1, "18:20"),
    read: false,
  },
  {
    id: "notif-klara-3",
    recipientId: "klara",
    type: "meet_rsvp",
    title: "New RSVP — Sunday training session",
    body: "Magda + Žofka are joining Sunday's Calm Dog Group Session.",
    avatarUrl: "/images/generated/magda-profile.jpeg",
    href: "/meets/meet-care-1",
    createdAt: daysAgoIso(2, "14:05"),
    read: true,
  },
  // ── More texture for Klára's bell ───────────────────────────────────────
  // She's an established trainer-walker, so her notifications should read
  // like an active professional's — proposals, messages, RSVPs, reviews —
  // not the sparse 3 entries seeded earlier. 2026-05-20.
  {
    id: "notif-klara-4",
    recipientId: "klara",
    type: "care_review",
    title: "Eva left a review for last week's session",
    body: "5 stars — \"So patient with Luna. Her recall has come on noticeably.\"",
    avatarUrl: "/images/generated/eva-profile.jpeg",
    href: "/profile/klara?tab=reviews",
    createdAt: daysAgoIso(3, "16:40"),
    read: true,
  },
  {
    id: "notif-klara-5",
    recipientId: "klara",
    type: "booking_message",
    title: "Anežka sent a message",
    body: "Quick question about Nela's training plan — when's good to chat?",
    avatarUrl: "/images/generated/anezka-profile.jpeg",
    href: "/profile/anezka?tab=chat",
    createdAt: daysAgoIso(4, "11:20"),
    read: true,
  },
  {
    id: "notif-klara-6",
    recipientId: "klara",
    type: "meet_rsvp",
    title: "New RSVP — Wednesday morning Stromovka",
    body: "Martin + Charlie are joining Wednesday's walk.",
    avatarUrl: "/images/generated/martin-profile.jpeg",
    href: "/meets/meet-klara-stromovka",
    createdAt: daysAgoIso(4, "08:55"),
    read: true,
  },
  {
    id: "notif-klara-7",
    recipientId: "klara",
    type: "connection_request",
    title: "Vítek wants to connect",
    body: "You met at last week's Stromovka morning walk.",
    avatarUrl: "/images/generated/vitek-profile.jpeg",
    href: "/profile/vitek",
    createdAt: daysAgoIso(5, "08:15"),
    read: true,
  },
  {
    id: "notif-klara-8",
    recipientId: "klara",
    type: "post_comment",
    title: "Hana commented on your post",
    body: "\"This was such a calm crew today — Runa loved it.\"",
    avatarUrl: "/images/generated/hana-profile.jpeg",
    href: "/posts/post-klara-stromovka-walk",
    createdAt: daysAgoIso(6, "19:30"),
    read: true,
  },
  {
    // Demo Narrative V2, Beat 3 — Daniel accepts Magda's connection request
    // inline on /notifications. Reversed from V1 (was Daniel→Magda; V2's Beat
    // 3 is Daniel's POV, so it's Magda→Daniel). Seeded statically so the beat
    // works regardless of what the tester did earlier — the Familiar mark in
    // Beat 3 is a session-local mark, not a real send. The accept handler
    // resolves the connection from `actorId`. See demo-mode.md → "State
    // seeded between beats".
    // Demo Narrative V2, Beat 3 — Daniel's entry point. He attended Klára's
    // morning walk; Doggo prompts him to look back on it (the canonical
    // attendee-side post-meet-review). Tapping the notification opens the
    // meet, where Daniel reviews the People tab and marks Magda Familiar.
    // Set later in the day than Magda's invites below so it sorts to the
    // top of Daniel's bell at Beat 3's open. 2026-05-20.
    id: "notif-postmeet-daniel-stromovka",
    recipientId: "daniel",
    type: "post_meet_review",
    title: "How was the Stromovka walk?",
    body: "Look back on the morning — mark anyone you'd like to know better.",
    avatarUrl: "/images/generated/post-stromovka-walk.jpeg",
    // Lands Daniel straight on the walk's People tab — Beat 3's first step
    // sends him here to mark Magda Familiar, so skip the extra tab tap.
    href: "/meets/meet-klara-stromovka?tab=people",
    createdAt: daysAgoIso(0, "13:00"),
    read: false,
  },
  {
    id: "notif-magda-1",
    recipientId: "magda",
    type: "group_activity",
    title: "Eva posted in Holešovice Dog Block",
    body: "\"Stromovka tomorrow morning if anyone's around — Luna needs to burn energy.\"",
    avatarUrl: "/images/generated/eva-profile.jpeg",
    href: "/communities/group-holesovice-block",
    createdAt: daysAgoIso(0, "16:40"),
    read: false,
  },
  {
    id: "notif-magda-2",
    recipientId: "magda",
    type: "meet_reminder",
    title: "Tomorrow: Calm Dog Group Session",
    body: "Sunday 10:00 at Stromovka with Klára. You're going + Žofka.",
    avatarUrl: "/images/generated/care-klara-training.jpeg",
    href: "/meets/meet-care-1",
    createdAt: daysAgoIso(0, "08:15"),
    read: true,
  },
  {
    id: "notif-lena-1",
    recipientId: "lena",
    type: "booking_message",
    title: "Pawel: \"Asha was a star today\"",
    body: "Sent two photos from Stromovka. See you Wednesday.",
    avatarUrl: "/images/generated/marek-profile.jpeg",
    href: "/inbox/lena-pawel-conv",
    createdAt: daysAgoIso(1, "17:30"),
    read: true,
  },
  {
    id: "notif-lena-2",
    recipientId: "lena",
    type: "meet_reminder",
    title: "Wednesday walk with Pawel — 9:00am",
    body: "Pickup at your building, Letná park loop, drop-off ~10:30.",
    avatarUrl: "/images/generated/sam-portrait.jpeg",
    href: "/bookings/booking-pawel-lena",
    createdAt: daysAgoIso(0, "07:00"),
    read: false,
  },
];

/**
 * Deferred narrative notifications — NOT part of the always-on stream.
 *
 * Demo Narrative V2, Beat 3: Magda's connection request + group invite must
 * not appear in Daniel's bell until the story's time-passage interstitial
 * ("a couple of days later") fires them — otherwise they sit on the beat's
 * opening notifications screen before Daniel has even marked Magda Familiar,
 * which spoils the reveal and reads as impossible. The walkthrough fires
 * these via `addNotification` when the tester taps Continue on that
 * interstitial (`fireNotifications` on the step → `WalkthroughInterstitial`).
 * Firing is idempotent (upsert by id). createdAt sits just after the
 * post-meet-review (13:00) so they sort to the top of Daniel's bell on
 * arrival.
 */
export const deferredNotifications: AppNotification[] = [
  {
    // Magda's connection request — reaches Daniel after the time-passage.
    id: "notif-magda-connect-daniel",
    recipientId: "daniel",
    type: "connection_request",
    actorId: "magda",
    title: "Magda wants to connect",
    body: "You met on the Stromovka walk.",
    avatarUrl: "/images/generated/magda-profile.jpeg",
    href: "/profile/magda",
    createdAt: daysAgoIso(0, "13:30"),
    read: false,
  },
  {
    // Magda's group invite, the "message" half of "Magda's reached out."
    // Daniel taps through to Holešovice Dog Block. Deterministic id matches
    // the runtime invite-flow pattern (`handleInvite` in
    // app/communities/[id]/page.tsx) so a live invite would upsert.
    id: "notif-ginvite-group-holesovice-block-daniel",
    recipientId: "daniel",
    type: "group_invite",
    actorId: "magda",
    title: "Magda invited you to Holešovice Dog Block",
    body: "Lovely to meet you and Bára on the walk — come join our block's little group.",
    avatarUrl: "/images/generated/magda-profile.jpeg",
    href: "/communities/group-holesovice-block",
    createdAt: daysAgoIso(0, "13:31"),
    read: false,
  },
];

/** Look up a deferred notification payload by id (for the walkthrough's
 *  `fireNotifications`). Returns undefined for an unknown id. */
export function getDeferredNotification(id: string): AppNotification | undefined {
  return deferredNotifications.find((n) => n.id === id);
}

export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}

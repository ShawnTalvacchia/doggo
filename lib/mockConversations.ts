import type { Conversation, ChatMessage } from "./types";
import { providers } from "./mockData";

// ── Helpers ────────────────────────────────────────────────────────────────────

const olga = providers.find((p) => p.id === "olga-m")!;
const nikola = providers.find((p) => p.id === "nikola-r")!;
const jana = providers.find((p) => p.id === "jana-k")!;

const SHAWN_ID = "shawn";
const SHAWN_NAME = "Shawn Talvacchia";
const SHAWN_AVATAR =
  "/images/generated/shawn-profile.jpg";

const MARIE_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";

// ── Conversation 1 — Olga, walk/check-in, dog Mochi ───────────────────────────

const olgaMessages: ChatMessage[] = [
  {
    id: "om-1",
    conversationId: "olga-conv",
    sender: "owner",
    type: "text",
    text: "Hi Olga! I'm looking for someone to walk Mochi (my Shiba Inu) a few times a week around Smíchov. She's friendly but can be a bit nervous meeting new dogs. Would you be up for a meet & greet first?",
    sentAt: "2026-03-01T10:14:00Z",
    read: true,
  },
  {
    id: "om-2",
    conversationId: "olga-conv",
    sender: "provider",
    type: "text",
    text: "Hi! Mochi sounds lovely — Shibas are one of my favourites. A meet & greet is a great idea, I always recommend it. I'm free most mornings this week. Would Tuesday at 9am near Nusle steps work for you?",
    sentAt: "2026-03-01T11:02:00Z",
    read: true,
  },
  {
    id: "om-3",
    conversationId: "olga-conv",
    sender: "owner",
    type: "text",
    text: "Tuesday at 9am works perfectly! I'll bring Mochi and some treats so she can warm up to you. 🐕",
    sentAt: "2026-03-01T11:30:00Z",
    read: true,
  },
  {
    id: "om-4",
    conversationId: "olga-conv",
    sender: "provider",
    type: "text",
    text: "Perfect, see you Tuesday! I'll send you my number closer to the day in case anything changes. Looking forward to meeting Mochi 🐾",
    sentAt: "2026-03-02T08:45:00Z",
    read: false,
  },
];

// ── Conversation 2 — Nikola, boarding, dog Pepper ─────────────────────────────

const nikolaMessages: ChatMessage[] = [
  {
    id: "nm-1",
    conversationId: "nikola-conv",
    sender: "owner",
    type: "text",
    text: "Hi Nikola, we're going away August 12–18 and need boarding for our Golden, Pepper. She's 3 years old, very social, loves other dogs. Do you have space those dates?",
    sentAt: "2026-03-03T14:20:00Z",
    read: true,
  },
  {
    id: "nm-2",
    conversationId: "nikola-conv",
    sender: "provider",
    type: "text",
    text: "Hi! August 12–18 looks good for me. Pepper sounds like she'd get on great with my dog Bora. I usually do a short walk together before confirming — are you based in Prague 2?",
    sentAt: "2026-03-03T15:10:00Z",
    read: true,
  },
  {
    id: "nm-3",
    conversationId: "nikola-conv",
    sender: "owner",
    type: "text",
    text: "Yes, we're in Vinohrady. A walk sounds great actually — she needs to know she's going somewhere safe. What park do you usually use?",
    sentAt: "2026-03-03T15:42:00Z",
    read: true,
  },
  {
    id: "nm-4",
    conversationId: "nikola-conv",
    sender: "provider",
    type: "text",
    text: "I usually take dogs to Riegrovy sady — lots of space and a fenced section. Would a weekend morning work for you? I'm free Saturday or Sunday this week.",
    sentAt: "2026-03-04T09:18:00Z",
    read: false,
  },
];

// ── Conversation 3 — Jana, walk/check-in, dog Bruno, pending booking ──────────

const janaMessages: ChatMessage[] = [
  {
    id: "jm-1",
    conversationId: "jana-conv",
    sender: "owner",
    type: "text",
    text: "Hi Jana, I'm looking for Monday–Friday morning walks for Bruno starting in September. He's a 2-year-old Labrador, very energetic and good with other dogs. Would you have regular availability?",
    sentAt: "2026-03-05T09:00:00Z",
    read: true,
  },
  {
    id: "jm-2",
    conversationId: "jana-conv",
    sender: "provider",
    type: "text",
    text: "Hi! Mon–Fri mornings are my main slot so that works great. Bruno sounds like a fun one — Labs are always full of energy. My standard walk is 45–60 min. Would you want drop-in check-ins on any days, or just walks?",
    sentAt: "2026-03-05T09:55:00Z",
    read: true,
  },
  {
    id: "jm-3",
    conversationId: "jana-conv",
    sender: "owner",
    type: "text",
    text: "Just walks for now. If he settles in well I might add a lunchtime check-in later. Can you do around 8–9am?",
    sentAt: "2026-03-05T10:20:00Z",
    read: true,
  },
  {
    id: "jm-4",
    conversationId: "jana-conv",
    sender: "provider",
    type: "text",
    text: "8–9am works perfectly for me. I've put together a booking proposal for the regular slot — let me know what you think!",
    sentAt: "2026-03-06T08:10:00Z",
    read: true,
  },
  {
    id: "jm-5",
    conversationId: "jana-conv",
    sender: "provider",
    type: "booking_proposal",
    proposal: {
      bookingType: "ongoing",
      serviceType: "walk_checkin",
      subService: "Solo walk",
      pets: ["Bruno"],
      startDate: "2026-09-01",
      endDate: null,
      recurringSchedule: {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        time: "08:00",
        timeLabel: "8:00–9:00am",
      },
      price: {
        lineItems: [{ label: "Solo walk", amount: 330, unit: "per session" }],
        total: 330,
        currency: "Kč",
        billingCycle: "per_session",
      },
      status: "pending",
    },
    sentAt: "2026-03-06T08:11:00Z",
    read: false,
  },
];

// ── Conversation 4 — Marie Novak messages Shawn (Shawn is carer) ──────────────

const marieMessages: ChatMessage[] = [
  {
    id: "mm-1",
    conversationId: "marie-conv",
    sender: "owner",
    type: "text",
    text: "Hi Shawn! I found your profile on Doggo and I'm looking for regular walks for my Labrador, Molly. She's 3 years old, very friendly and loves other dogs. I'd need Mon, Wed, Fri mornings around Vinohrady — would that work for you?",
    sentAt: "2026-03-07T09:10:00Z",
    read: true,
  },
  {
    id: "mm-2",
    conversationId: "marie-conv",
    sender: "provider",
    type: "text",
    text: "Hi Marie! Molly sounds great — Mon/Wed/Fri mornings work perfectly for me. I do 45–60 min walks starting around 8am, usually through Riegrovy sady and back. Happy to do a quick meet & greet with Molly first if you'd like. My rate is 280 Kč per walk.",
    sentAt: "2026-03-07T09:45:00Z",
    read: true,
  },
  {
    id: "mm-3",
    conversationId: "marie-conv",
    sender: "owner",
    type: "text",
    text: "That sounds perfect! Riegrovy sady is great, Molly loves it there. A meet & greet would be lovely. When are you free this week?",
    sentAt: "2026-03-07T10:02:00Z",
    read: false,
  },
];

// ── Direct message conversations (1:1 between connected users) ──────────────

const janaDirectMessages: ChatMessage[] = [
  {
    id: "jd-1",
    conversationId: "jana-direct",
    sender: "owner",
    type: "text",
    text: "Hey Jana! Great meeting you and your pup at the park hangout yesterday. Spot really enjoyed playing with Rex!",
    sentAt: "2026-03-14T18:30:00Z",
    read: true,
  },
  {
    id: "jd-2",
    conversationId: "jana-direct",
    sender: "provider",
    type: "text",
    text: "Hi Shawn! It was lovely meeting you too! Rex was so tired after playing with Spot — he slept the whole evening 😄 We should do that again sometime!",
    sentAt: "2026-03-14T19:15:00Z",
    read: true,
  },
  {
    id: "jd-3",
    conversationId: "jana-direct",
    sender: "owner",
    type: "text",
    text: "Absolutely! Are you going to the Vinohrady walk this Saturday? I was thinking of taking both Spot and Goldie this time.",
    sentAt: "2026-03-15T08:20:00Z",
    read: true,
  },
  {
    id: "jd-4",
    conversationId: "jana-direct",
    sender: "provider",
    type: "text",
    text: "Yes, I'll be there! Looking forward to meeting Goldie. See you Saturday morning 🐾",
    sentAt: "2026-03-15T09:05:00Z",
    read: false,
  },
];

// Placeholder for second direct message (Eva — familiar, message request scenario)
const evaDirectMessages: ChatMessage[] = [
  {
    id: "ed-1",
    conversationId: "eva-direct",
    sender: "owner",
    type: "text",
    text: "Hi Eva! We met briefly at the Letná Park hangout last week. Luna and Spot seemed to get along really well — would love to set up a playdate sometime if you're up for it!",
    sentAt: "2026-03-16T10:00:00Z",
    read: true,
  },
];

// ── Exports ────────────────────────────────────────────────────────────────────

const EMPTY_INQUIRY = {
  bookingType: "one_off" as const,
  serviceType: "walk_checkin" as const,
  subService: null,
  pets: [],
  startDate: null,
  endDate: null,
  dogName: "",
  message: "",
};

export const mockConversations: Conversation[] = [
  // ── Direct messages ──
  {
    id: "jana-direct",
    conversationType: "direct",
    providerId: "jana-k",
    providerName: "Jana K.",
    providerAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: EMPTY_INQUIRY,
    messages: janaDirectMessages,
    lastMessageId: "jd-4",
    unreadCount: 1,
  },
  {
    id: "eva-direct",
    conversationType: "direct",
    providerId: "eva",
    providerName: "Eva",
    providerAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: EMPTY_INQUIRY,
    messages: evaDirectMessages,
    lastMessageId: "ed-1",
    unreadCount: 0,
  },
  // ── Booking conversations ──
  {
    id: "olga-conv",
    conversationType: "booking",
    providerId: olga.id,
    providerName: olga.name,
    providerAvatarUrl: olga.avatarUrl,
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "walk_checkin",
      subService: "Solo walk",
      pets: ["Spot"],
      startDate: null,
      endDate: null,
      recurringSchedule: { days: ["Mon", "Wed", "Fri"], time: "08:00", timeLabel: "8:00–9:00am" },
      dogName: "Spot",
      message: olgaMessages[0].text!,
    },
    messages: olgaMessages,
    lastMessageId: "om-4",
    unreadCount: 1,
  },
  {
    id: "nikola-conv",
    conversationType: "booking",
    providerId: nikola.id,
    providerName: nikola.name,
    providerAvatarUrl: nikola.avatarUrl,
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "one_off",
      serviceType: "boarding",
      subService: "Overnight",
      pets: ["Spot", "Goldie"],
      startDate: "2026-08-12",
      endDate: "2026-08-18",
      dogName: "Spot & Goldie",
      message: nikolaMessages[0].text!,
    },
    messages: nikolaMessages,
    lastMessageId: "nm-4",
    unreadCount: 1,
  },
  {
    id: "jana-conv",
    conversationType: "booking",
    providerId: jana.id,
    providerName: jana.name,
    providerAvatarUrl: jana.avatarUrl,
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "walk_checkin",
      subService: "Solo walk",
      pets: ["Goldie"],
      startDate: "2026-09-01",
      endDate: null,
      recurringSchedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], time: "08:00", timeLabel: "8:00–9:00am" },
      dogName: "Goldie",
      message: janaMessages[0].text!,
    },
    messages: janaMessages,
    lastMessageId: "jm-5",
    unreadCount: 1,
  },
  {
    id: "marie-conv",
    conversationType: "booking",
    providerId: SHAWN_ID,
    providerName: SHAWN_NAME,
    providerAvatarUrl: SHAWN_AVATAR,
    ownerId: "marie-n",
    ownerName: "Marie Novak",
    ownerAvatarUrl: MARIE_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "walk_checkin",
      subService: "Solo walk",
      pets: ["Molly"],
      startDate: null,
      endDate: null,
      recurringSchedule: { days: ["Mon", "Wed", "Fri"], time: "08:00", timeLabel: "8:00–9:00am" },
      dogName: "Molly",
      message: marieMessages[0].text!,
    },
    messages: marieMessages,
    lastMessageId: "mm-3",
    unreadCount: 1,
  },
];

export function getConversation(id: string): Conversation | undefined {
  return mockConversations.find((c) => c.id === id);
}

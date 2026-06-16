import type { Conversation, ChatMessage } from "./types";
import { daysAgoIso, daysFromNowIso } from "./mockDate";
import { providers } from "./mockData";

// ── Helpers ────────────────────────────────────────────────────────────────────

const olga = providers.find((p) => p.id === "olga-m")!;

const SHAWN_ID = "shawn";
// Display name follows the inbox-row convention (P35, Mock World Building C5):
// firstName + lastInitial. Compact across cultures, consistent across rows.
const SHAWN_NAME = "Shawn T.";
const SHAWN_AVATAR =
  "/images/generated/shawn-profile.jpg";

const MARIE_AVATAR =
  "/images/generated/marie-profile.jpeg";

// ── Conversation — Olga, walk/check-in, dog Mochi ────────────────────────────

const olgaMessages: ChatMessage[] = [
  {
    id: "om-1",
    conversationId: "shawn-olga-conv",
    sender: "owner",
    type: "text",
    text: "Hi Olga! I'm looking for someone to walk Mochi (my Shiba Inu) a few times a week around Smíchov. She's friendly but can be a bit nervous meeting new dogs. Would you be up for a meet & greet first?",
    sentAt: daysAgoIso(5, "10:14"),
    read: true,
  },
  {
    id: "om-2",
    conversationId: "shawn-olga-conv",
    sender: "provider",
    type: "text",
    text: "Hi! Mochi sounds lovely — Shibas are one of my favourites. A meet & greet is a great idea, I always recommend it. I'm free most mornings this week. Would Tuesday at 9am near Nusle steps work for you?",
    sentAt: daysAgoIso(5, "11:02"),
    read: true,
  },
  {
    id: "om-3",
    conversationId: "shawn-olga-conv",
    sender: "owner",
    type: "text",
    text: "Tuesday at 9am works perfectly! I'll bring Mochi and some treats so she can warm up to you. 🐕",
    sentAt: daysAgoIso(5, "11:30"),
    read: true,
  },
  {
    id: "om-4",
    conversationId: "shawn-olga-conv",
    sender: "provider",
    type: "text",
    text: "Perfect, see you Tuesday! I'll send you my number closer to the day in case anything changes. Looking forward to meeting Mochi 🐾",
    sentAt: daysAgoIso(4, "08:45"),
    read: false,
  },
];

// ── Conversation — Nikola, boarding, dog Pepper ──────────────────────────────

const nikolaMessages: ChatMessage[] = [
  {
    id: "nm-1",
    conversationId: "shawn-nikola-conv",
    sender: "owner",
    type: "text",
    text: "Hi Nikola, we're going away August 12–18 and need boarding for our Golden, Pepper. She's 3 years old, very social, loves other dogs. Do you have space those dates?",
    sentAt: daysAgoIso(6, "14:20"),
    read: true,
  },
  {
    id: "nm-2",
    conversationId: "shawn-nikola-conv",
    sender: "provider",
    type: "text",
    text: "Hi! August 12–18 looks good for me. Pepper sounds like she'd get on great with my dog Bora. I usually do a short walk together before confirming — are you based in Prague 2?",
    sentAt: daysAgoIso(6, "15:10"),
    read: true,
  },
  {
    id: "nm-3",
    conversationId: "shawn-nikola-conv",
    sender: "owner",
    type: "text",
    text: "Yes, we're in Vinohrady. A walk sounds great actually — she needs to know she's going somewhere safe. What park do you usually use?",
    sentAt: daysAgoIso(6, "15:42"),
    read: true,
  },
  {
    id: "nm-4",
    conversationId: "shawn-nikola-conv",
    sender: "provider",
    type: "text",
    text: "I usually take dogs to Riegrovy sady — lots of space and a fenced section. Would a weekend morning work for you? I'm free Saturday or Sunday this week.",
    sentAt: daysAgoIso(5, "09:18"),
    read: false,
  },
];

// ── Conversation — Jana (merged: direct social + booking for walks) ──────────
// Jana is a friend AND a dog walker — one unified thread covers both

const janaMessages: ChatMessage[] = [
  // Booking discussion (earlier)
  {
    id: "jm-1",
    conversationId: "shawn-jana-conv",
    sender: "owner",
    type: "text",
    text: "Hi Jana, I'm looking for Monday–Friday morning walks for Bruno starting in September. He's a 2-year-old Labrador, very energetic and good with other dogs. Would you have regular availability?",
    sentAt: daysAgoIso(11, "09:00"),
    read: true,
  },
  {
    id: "jm-2",
    conversationId: "shawn-jana-conv",
    sender: "provider",
    type: "text",
    text: "Hi! Mon–Fri mornings are my main slot so that works great. Bruno sounds like a fun one — Labs are always full of energy. My standard walk is 45–60 min. Would you want drop-in check-ins on any days, or just walks?",
    sentAt: daysAgoIso(11, "09:55"),
    read: true,
  },
  {
    id: "jm-3",
    conversationId: "shawn-jana-conv",
    sender: "owner",
    type: "text",
    text: "Just walks for now. If he settles in well I might add a lunchtime check-in later. Can you do around 8–9am?",
    sentAt: daysAgoIso(11, "10:20"),
    read: true,
  },
  {
    id: "jm-4",
    conversationId: "shawn-jana-conv",
    sender: "provider",
    type: "text",
    text: "8–9am works perfectly for me. I've put together a booking proposal for the regular slot — let me know what you think!",
    sentAt: daysAgoIso(10, "08:10"),
    read: true,
  },
  {
    id: "jm-5",
    conversationId: "shawn-jana-conv",
    sender: "provider",
    type: "booking_proposal",
    proposal: {
      bookingType: "ongoing",
      serviceType: "walks_checkins",
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
    sentAt: daysAgoIso(10, "08:11"),
    read: true,
  },
  // Social chat (later — after meeting at a park hangout)
  {
    id: "jd-1",
    conversationId: "shawn-jana-conv",
    sender: "owner",
    type: "text",
    text: "Hey Jana! Great meeting you and your pup at the park hangout yesterday. Spot really enjoyed playing with Rex!",
    sentAt: daysAgoIso(2, "18:30"),
    read: true,
  },
  {
    id: "jd-2",
    conversationId: "shawn-jana-conv",
    sender: "provider",
    type: "text",
    text: "Hi Shawn! It was lovely meeting you too! Rex was so tired after playing with Spot — he slept the whole evening 😄 We should do that again sometime!",
    sentAt: daysAgoIso(2, "19:15"),
    read: true,
  },
  {
    id: "jd-3",
    conversationId: "shawn-jana-conv",
    sender: "owner",
    type: "text",
    text: "Absolutely! Are you going to the Vinohrady walk this Saturday? I was thinking of taking both Spot and Goldie this time.",
    sentAt: daysAgoIso(1, "08:20"),
    read: true,
  },
  {
    id: "jd-4",
    conversationId: "shawn-jana-conv",
    sender: "provider",
    type: "text",
    text: "Yes, I'll be there! Looking forward to meeting Goldie. See you Saturday morning 🐾",
    sentAt: daysAgoIso(1, "09:05"),
    read: false,
  },
];

// ── Conversation — Marie (Shawn is carer/provider) ───────────────────────────

const marieMessages: ChatMessage[] = [
  {
    id: "mm-1",
    conversationId: "shawn-marie-conv",
    sender: "owner",
    type: "text",
    text: "Hi Shawn! I found your profile on Doggo and I'm looking for regular walks for my Labrador, Molly. She's 3 years old, very friendly and loves other dogs. I'd need Mon, Wed, Fri mornings around Vinohrady — would that work for you?",
    sentAt: daysAgoIso(6, "09:10"),
    read: true,
  },
  {
    id: "mm-2",
    conversationId: "shawn-marie-conv",
    sender: "provider",
    type: "text",
    text: "Hi Marie! Molly sounds great — Mon/Wed/Fri mornings work perfectly for me. I do 45–60 min walks starting around 8am, usually through Riegrovy sady and back. Happy to do a quick meet & greet with Molly first if you'd like. My rate is 280 Kč per walk.",
    sentAt: daysAgoIso(6, "09:45"),
    read: true,
  },
  {
    id: "mm-3",
    conversationId: "shawn-marie-conv",
    sender: "owner",
    type: "text",
    text: "That sounds perfect! Riegrovy sady is great, Molly loves it there. A meet & greet would be lovely. When are you free this week?",
    sentAt: daysAgoIso(6, "10:02"),
    read: false,
  },
];

// ── Conversation — Tereza, direct message (fellow walker) ────────────────────

const terezaDirectMessages: ChatMessage[] = [
  {
    id: "td-1",
    conversationId: "shawn-tereza-conv",
    sender: "provider",
    type: "text",
    text: "Hey Shawn! Thanks for coming to the evening walk last week. Franta and Spot really got on well. Are you planning to come again this Thursday?",
    sentAt: daysAgoIso(5, "17:30"),
    read: true,
  },
  {
    id: "td-2",
    conversationId: "shawn-tereza-conv",
    sender: "owner",
    type: "text",
    text: "Hey! Yes, Thursday works — I'll bring Spot. Should I bring Goldie too or is the group getting big?",
    sentAt: daysAgoIso(5, "18:15"),
    read: true,
  },
  {
    id: "td-3",
    conversationId: "shawn-tereza-conv",
    sender: "provider",
    type: "text",
    text: "Bring both! It's still a small group — just me, Marek, and Lucie confirmed so far. The more the merrier 🐕",
    sentAt: daysAgoIso(5, "18:40"),
    read: false,
  },
];

// ── Conversation — Klára, booking (training for Spot) ────────────────────────

const klaraBookingMessages: ChatMessage[] = [
  {
    id: "kb-1",
    conversationId: "shawn-klara-conv",
    sender: "owner",
    type: "text",
    text: "Hi Klára! I'd love to book a socialisation session for Spot. He's nervous around new dogs and I've heard amazing things about your work with Daniel's dog Bára. Do you have any openings?",
    sentAt: daysAgoIso(1, "09:00"),
    read: true,
  },
  {
    id: "kb-2",
    conversationId: "shawn-klara-conv",
    sender: "provider",
    type: "text",
    text: "Hi Shawn! Thanks for reaching out — Daniel's been great to work with. I have a spot in my Wednesday group session at Stromovka, or I can do a 1-on-1 if you'd prefer to start with something calmer. What works better for Spot?",
    sentAt: daysAgoIso(1, "10:30"),
    read: true,
  },
  {
    id: "kb-3",
    conversationId: "shawn-klara-conv",
    sender: "owner",
    type: "text",
    text: "I think 1-on-1 first would be best. He can be unpredictable with new dogs. How much is that?",
    sentAt: daysAgoIso(1, "11:00"),
    read: true,
  },
  {
    id: "kb-4",
    conversationId: "shawn-klara-conv",
    sender: "provider",
    type: "text",
    text: "600 Kč for a 60-minute session. We'd do it at Stromovka — quiet area near the pond. I'll bring Eda as the calm dog for controlled introductions. He's a Border Collie, super gentle. Want to try next Wednesday at 10?",
    sentAt: daysAgoIso(1, "11:45"),
    read: true,
  },
  {
    id: "kb-5",
    conversationId: "shawn-klara-conv",
    sender: "owner",
    type: "text",
    text: "That sounds perfect. Wednesday at 10 it is! Looking forward to it.",
    sentAt: daysAgoIso(1, "12:10"),
    read: true,
  },
  {
    id: "kb-6",
    conversationId: "shawn-klara-conv",
    sender: "provider",
    type: "booking_proposal",
    text: "I've sent you a booking proposal for the session.",
    proposal: {
      bookingType: "one_off",
      serviceType: "walks_checkins",
      subService: "Calm dog introduction",
      pets: ["Spot"],
      startDate: "2026-03-26",
      endDate: null,
      recurringSchedule: undefined,
      price: {
        lineItems: [{ label: "Calm dog introduction (60 min)", amount: 600, unit: "per session" }],
        total: 600,
        currency: "Kč",
        billingCycle: "per_session",
      },
      status: "pending",
    },
    sentAt: daysAgoIso(1, "12:30"),
    read: false,
  },
];

// ── Conversation — Eva, direct message (familiar, met at park) ───────────────

const evaDirectMessages: ChatMessage[] = [
  {
    id: "ed-1",
    conversationId: "shawn-eva-conv",
    sender: "owner",
    type: "text",
    text: "Hi Eva! We met briefly at the Letná Park hangout last week. Luna and Spot seemed to get along really well — would love to set up a playdate sometime if you're up for it!",
    sentAt: daysAgoIso(8, "10:00"),
    read: true,
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   CROSS-PERSONA THREADS — added 2026-04-26 (Mock World Building B1–B5)
   Each thread is visible from BOTH parties' inboxes via the persona switcher.
   `sender: "owner"` = the party in `ownerId`; `sender: "provider"` = `providerId`.
   ════════════════════════════════════════════════════════════════════════════ */

// ── Tomáš ↔ Petra — emergency 2-day sitting ───────────────────────────────────
// Booking: booking-petra-tomas (Mar 15-17). Conversation Mar 13-17.

const tomasPetraMessages: ChatMessage[] = [
  {
    id: "tp-1",
    conversationId: "tomas-petra-conv",
    sender: "owner",
    type: "text",
    text: "Petra — short notice, sorry. Got pulled into a 2-day project in Brno tomorrow morning. Any chance you could take Hugo Sat night through Mon morning? I know it's last-minute, totally understand if not.",
    sentAt: daysAgoIso(12, "22:14"),
    read: true,
  },
  {
    id: "tp-2",
    conversationId: "tomas-petra-conv",
    sender: "provider",
    type: "text",
    text: "Tomáš! Yes of course. Hugo and Daisy always have a blast. Drop him by 8am Saturday? Bring his bed and food, I have everything else.",
    sentAt: daysAgoIso(12, "22:28"),
    read: true,
  },
  {
    // Booking proposal — Petra formalises the emergency arrangement
    // through the app so vet info, payment, and dates flow cleanly.
    // Pre-marked `status: "accepted"` (mirrors daniel-klara dk-7) since
    // both parties had aligned in chat before the proposal landed.
    // Connects to `booking-petra-tomas`. Added 2026-05-11 (CCFT B4.6 —
    // chat history was missing the formalisation artifact).
    id: "tp-prop",
    conversationId: "tomas-petra-conv",
    sender: "provider",
    type: "booking_proposal",
    text: "Sending it through so the dates + Hugo's vet info are all in one place.",
    proposal: {
      bookingType: "one_off",
      serviceType: "day_care",
      subService: "Emergency sitting",
      pets: ["Hugo"],
      startDate: "2026-03-15",
      endDate: "2026-03-17",
      price: {
        lineItems: [{ label: "Day sitting", amount: 120, unit: "per visit" }],
        total: 360,
        currency: "Kč",
        billingCycle: "total",
      },
      status: "accepted",
    },
    sentAt: daysAgoIso(12, "22:32"),
    read: true,
  },
  {
    id: "tp-3",
    conversationId: "tomas-petra-conv",
    sender: "owner",
    type: "text",
    text: "You're saving me. 8am works. He's been a bit clingy this week so might need a few minutes to settle. I'll send his vet card and the emergency contact.",
    sentAt: daysAgoIso(12, "22:35"),
    read: true,
  },
  {
    id: "tp-4",
    conversationId: "tomas-petra-conv",
    sender: "provider",
    type: "text",
    text: "All good. He always settles fast here — Daisy does the heavy lifting. Drive safe tomorrow. I'll send a photo when you're in your meeting.",
    sentAt: daysAgoIso(12, "22:50"),
    read: true,
  },
  {
    id: "tp-5",
    conversationId: "tomas-petra-conv",
    sender: "provider",
    type: "text",
    text: "Update: Hugo is in his element. Just had a full afternoon at Vítkov, currently asleep on top of Daisy. He ate everything. Hope the project is going OK 🐾",
    sentAt: daysAgoIso(10, "17:42"),
    read: true,
  },
  {
    id: "tp-6",
    conversationId: "tomas-petra-conv",
    sender: "owner",
    type: "text",
    text: "This made my day. Thank you Petra. Project is a slog but ending on time. Will see you Mon morning.",
    sentAt: daysAgoIso(10, "19:08"),
    read: true,
  },
  {
    id: "tp-7",
    conversationId: "tomas-petra-conv",
    sender: "owner",
    type: "text",
    text: "On my way back. ETA 10am. How was he today?",
    sentAt: daysAgoIso(8, "08:30"),
    read: true,
  },
  {
    id: "tp-8",
    conversationId: "tomas-petra-conv",
    sender: "provider",
    type: "text",
    text: "Good as gold. Tired out from yesterday. Sending him back clean and full 😄",
    sentAt: daysAgoIso(8, "08:55"),
    read: false,
  },
];

// ── Tereza ↔ Marek — casual sitting favour ─────────────────────────────────────
// Booking: booking-tereza-marek (Feb 22-23). Conversation Feb 18-24.
// Direct conversation (not a paid arrangement); Tereza is "provider" because
// she did the sitting; Marek is "owner" of Benny.

const terezaMarekMessages: ChatMessage[] = [
  {
    id: "tmk-1",
    conversationId: "tereza-marek-conv",
    sender: "owner",
    type: "text",
    text: "Tereza — visiting my folks in Brno this weekend. Any chance Benny could spend Sat night with you and Franta? He gets so anxious at the kennels and I'd rather not.",
    sentAt: daysAgoIso(7, "19:00"),
    read: true,
  },
  {
    id: "tmk-2",
    conversationId: "tereza-marek-conv",
    sender: "provider",
    type: "text",
    text: "Of course! Bring him over Sat morning whenever works. Franta will be thrilled. We can do the morning Riegrovy walk together if you want, before you head off.",
    sentAt: daysAgoIso(7, "19:25"),
    read: true,
  },
  {
    id: "tmk-3",
    conversationId: "tereza-marek-conv",
    sender: "owner",
    type: "text",
    text: "Walk sounds great. Will bring his food + bed. Around 8?",
    sentAt: daysAgoIso(7, "19:30"),
    read: true,
  },
  {
    id: "tmk-4",
    conversationId: "tereza-marek-conv",
    sender: "provider",
    type: "text",
    text: "8 it is. Drive safe.",
    sentAt: daysAgoIso(7, "19:35"),
    read: true,
  },
  {
    id: "tmk-5",
    conversationId: "tereza-marek-conv",
    sender: "provider",
    type: "text",
    text: "Quick update — Benny's settled in. They had the best afternoon, both flopped on the rug now. No issues at all.",
    sentAt: daysAgoIso(3, "16:30"),
    read: true,
  },
  {
    id: "tmk-6",
    conversationId: "tereza-marek-conv",
    sender: "owner",
    type: "text",
    text: "You're the best. Coming back tomorrow afternoon, will text when I'm close.",
    sentAt: daysAgoIso(3, "17:00"),
    read: false,
  },
];

// ── Klára ↔ Filip — completed recall training ─────────────────────────────────
// Booking: booking-klara-filip (Jan 20 - Feb 10, completed). Brief thread.

const klaraFilipMessages: ChatMessage[] = [
  {
    id: "kf-msg-1",
    conversationId: "klara-filip-conv",
    sender: "owner",
    type: "text",
    text: "Hi Klára. Toby's recall is non-existent — he just runs. Need help before I lose him for real one day. Saw you in the Stromovka group, are you taking new clients?",
    sentAt: daysAgoIso(35, "14:00"),
    read: true,
  },
  {
    id: "kf-msg-2",
    conversationId: "klara-filip-conv",
    sender: "provider",
    type: "text",
    text: "Hi Filip. Yes, recall is one of my favourite things to work on — high-prey-drive Jacks especially. I'd suggest a 3-session block to start, 600 Kč each at Stromovka. We build the recall on long-line, no shortcuts. Tuesdays at noon work?",
    sentAt: daysAgoIso(35, "15:20"),
    read: true,
  },
  {
    id: "kf-msg-3",
    conversationId: "klara-filip-conv",
    sender: "owner",
    type: "text",
    text: "Perfect. Booking it.",
    sentAt: daysAgoIso(35, "15:45"),
    read: true,
  },
  {
    id: "kf-msg-4",
    conversationId: "klara-filip-conv",
    sender: "owner",
    type: "text",
    text: "Tested Toby off-leash at Letná this morning. Recalled 7/10 times, 8/10 if I had a treat. Couldn't have imagined this 3 weeks ago. Going to leave you a glowing review.",
    sentAt: daysAgoIso(12, "10:30"),
    read: false,
  },
];

// ── Klára ↔ Hana — recurring reactive dog training ────────────────────────────
// Booking: booking-klara-hana (Thursdays 11am, started Jan 15). Brief warm.

const klaraHanaMessages: ChatMessage[] = [
  {
    id: "kh-msg-1",
    conversationId: "klara-hana-conv",
    sender: "owner",
    type: "text",
    text: "Hi Klára — Eva said you're the person to talk to about Runa. She's a husky mix, reactive on-leash, fearful of new environments. We've been stuck for a year. Can we book something?",
    sentAt: daysAgoIso(28, "11:00"),
    read: true,
  },
  {
    id: "kh-msg-2",
    conversationId: "klara-hana-conv",
    sender: "provider",
    type: "text",
    text: "Hi Hana. Yes — recurring weekly is the way for fearful dogs, you need consistency. Thursdays 11 at Stromovka, 600/session. I usually bring Eda. We start where Runa is comfortable and only push when she tells us we can.",
    sentAt: daysAgoIso(28, "13:30"),
    read: true,
  },
  {
    id: "kh-msg-3",
    conversationId: "klara-hana-conv",
    sender: "owner",
    type: "text",
    text: "That's exactly the approach I want. Booking it.",
    sentAt: daysAgoIso(28, "14:00"),
    read: true,
  },
  {
    id: "kh-msg-4",
    conversationId: "klara-hana-conv",
    sender: "provider",
    type: "text",
    text: "Today was a turning point. Runa initiated a parallel walk with Eda — first time I've seen her offer engagement instead of just tolerating. Don't change anything at home, the work is doing its job.",
    sentAt: daysAgoIso(3, "12:15"),
    read: false,
  },
];

// ── Tereza ↔ Lucie — direct DM (peers in the same group) ──────────────────────

const terezaLucieMessages: ChatMessage[] = [
  {
    id: "tl-1",
    conversationId: "tereza-lucie-conv",
    sender: "provider",
    type: "text",
    text: "Lucie — quick one, are you good with the route changing this Thursday? Park's getting busy with the warmer weather, was thinking we loop around the back instead.",
    sentAt: daysAgoIso(6, "18:30"),
    read: true,
  },
  {
    id: "tl-2",
    conversationId: "tereza-lucie-conv",
    sender: "owner",
    type: "text",
    text: "Sounds great. Pepík hates the crowds anyway. See you 7pm.",
    sentAt: daysAgoIso(6, "18:45"),
    read: false,
  },
];

// ── Exports ────────────────────────────────────────────────────────────────────

const EMPTY_INQUIRY = {
  bookingType: "one_off" as const,
  serviceType: "walks_checkins" as const,
  subService: null,
  pets: [],
  startDate: null,
  endDate: null,
  dogName: "",
  message: "",
};

// ── Conversation — Lena ↔ Pawel, ongoing weekday group walks (Asha) ──
//
// Marketplace Owner persona anchor (CCFT 2026-05-13). Compact arc:
// inquiry → proposal → accepted → ongoing operational chat. Mirrors
// `daniel-klara-conv` shape but shorter because Lena's whole
// engagement with Doggo lives inside this thread — no need for the
// full multi-turn negotiation seen on more elaborate seeds.
const lenaPawelMessages: ChatMessage[] = [
  {
    id: "lp-1",
    conversationId: "lena-pawel-conv",
    sender: "owner",
    type: "text",
    text: "Hi Pawel — found you through the Prague Pack group. I have a Vizsla, Asha, who needs serious midday exercise five days a week. I work from home but I can't break up my afternoons. Do you have room?",
    sentAt: daysAgoIso(37, "08:42"),
    read: true,
  },
  {
    id: "lp-2",
    conversationId: "lena-pawel-conv",
    sender: "provider",
    type: "text",
    text: "Hi Lena — yes, I have a midday route through Letná/Stromovka that picks up around 12:30. Vizslas thrive on the group runs as long as the mix is calm. Want to start with a meet & greet this week so I can see how Asha does with my current pack?",
    sentAt: daysAgoIso(37, "09:18"),
    read: true,
  },
  {
    id: "lp-3",
    conversationId: "lena-pawel-conv",
    sender: "owner",
    type: "text",
    text: "Yes please. Friday afternoon works for me — I'll be home all day. She's a rescue from a hunting kennel so she can be a bit much at first, but she settles fast.",
    sentAt: daysAgoIso(37, "09:24"),
    read: true,
  },
  {
    id: "lp-4",
    conversationId: "lena-pawel-conv",
    sender: "provider",
    type: "text",
    text: "Perfect. Met Asha on Friday — she ran with the calm group and did great. Sending a proposal for the regular Mon–Fri slot.",
    sentAt: daysAgoIso(36, "08:50"),
    read: true,
  },
  {
    id: "lp-5",
    conversationId: "lena-pawel-conv",
    sender: "provider",
    type: "booking_proposal",
    proposal: {
      bookingType: "ongoing",
      serviceType: "walks_checkins",
      subService: "Small-group walk",
      pets: ["Asha"],
      startDate: daysAgoIso(35, "00:00").slice(0, 10),
      endDate: null,
      recurringSchedule: {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        time: "12:30",
        timeLabel: "12:30pm–1:30pm",
      },
      price: {
        lineItems: [{ label: "Small-group walk", amount: 250, unit: "per walk" }],
        total: 250,
        currency: "Kč",
        billingCycle: "per_session",
      },
      status: "accepted",
    },
    sentAt: daysAgoIso(36, "08:55"),
    read: true,
  },
  {
    id: "lp-6",
    conversationId: "lena-pawel-conv",
    sender: "owner",
    type: "text",
    text: "Signed. Thank you — this is going to make my afternoons so much better.",
    sentAt: daysAgoIso(36, "09:00"),
    read: true,
  },
  {
    id: "lp-7",
    conversationId: "lena-pawel-conv",
    sender: "provider",
    type: "text",
    text: "Stromovka loop today — Asha did great with the puppies. Photo from the park 📷",
    sentAt: daysAgoIso(21, "13:42"),
    read: true,
  },
  {
    id: "lp-8",
    conversationId: "lena-pawel-conv",
    sender: "provider",
    type: "text",
    text: "Tomorrow's pickup might be 12:45 instead of 12:30 — bringing in a new dog and want to give the intro a few extra minutes. Let me know if that's a problem.",
    sentAt: daysAgoIso(0, "20:18"),
    read: false,
  },
];

/**
 * Seed version for the `doggo-conversations` persisted store. Bump this
 * any time a new conversation or seeded message is added so testers
 * pick up the new content without a /demo Reset. P55, 2026-06-02.
 */
export const CONVERSATIONS_SEED_VERSION = 1;

export const mockConversations: Conversation[] = [
  // ── Jana (merged: social + booking) ──
  {
    id: "shawn-jana-conv",
    conversationType: "booking",
    providerId: "jana",
    providerName: "Jana K.",
    providerAvatarUrl: "/images/generated/jana-profile.jpeg",
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "walks_checkins",
      subService: "Solo walk",
      pets: ["Goldie"],
      startDate: "2026-09-01",
      endDate: null,
      recurringSchedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], time: "08:00", timeLabel: "8:00–9:00am" },
      dogName: "Goldie",
      message: janaMessages[0].text!,
    },
    messages: janaMessages,
    lastMessageId: "jd-4",
    unreadCount: 1,
  },
  // ── Tereza (direct) ──
  {
    id: "shawn-tereza-conv",
    conversationType: "direct",
    providerId: "tereza",
    providerName: "Tereza N.",
    providerAvatarUrl: "/images/generated/tereza-profile.jpeg",
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: EMPTY_INQUIRY,
    messages: terezaDirectMessages,
    lastMessageId: "td-3",
    unreadCount: 1,
  },
  // ── Klára (booking) ──
  {
    id: "shawn-klara-conv",
    conversationType: "booking",
    providerId: "klara",
    providerName: "Klára H.",
    providerAvatarUrl: "/images/generated/klara-profile.jpeg",
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "one_off",
      serviceType: "day_care",
      subService: "Training session",
      pets: ["Spot"],
      startDate: "2026-03-26",
      endDate: null,
      dogName: "Spot",
      message: klaraBookingMessages[0].text!,
    },
    messages: klaraBookingMessages,
    lastMessageId: "kb-6",
    unreadCount: 1,
  },
  // ── Olga (booking — no user profile yet, uses provider ID) ──
  {
    id: "shawn-olga-conv",
    conversationType: "booking",
    providerId: "olga-m",
    providerName: olga.name,
    providerAvatarUrl: olga.avatarUrl,
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "walks_checkins",
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
  // ── Nikola (booking) ──
  {
    id: "shawn-nikola-conv",
    conversationType: "booking",
    providerId: "nikola",
    providerName: "Nikola R.",
    providerAvatarUrl: "/images/generated/nikola-profile.jpeg",
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
  // ── Eva (direct — familiar, met at park) ──
  {
    id: "shawn-eva-conv",
    conversationType: "direct",
    providerId: "eva",
    providerName: "Eva S.",
    providerAvatarUrl: "/images/generated/eva-profile.jpeg",
    ownerId: SHAWN_ID,
    ownerName: SHAWN_NAME,
    ownerAvatarUrl: SHAWN_AVATAR,
    status: "active",
    inquiry: EMPTY_INQUIRY,
    messages: evaDirectMessages,
    lastMessageId: "ed-1",
    unreadCount: 0,
  },
  // ── Marie (Shawn is provider) ──
  {
    id: "shawn-marie-conv",
    conversationType: "booking",
    providerId: SHAWN_ID,
    providerName: SHAWN_NAME,
    providerAvatarUrl: SHAWN_AVATAR,
    ownerId: "marie",
    ownerName: "Marie N.",
    ownerAvatarUrl: MARIE_AVATAR,
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "walks_checkins",
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

  /* ══════════════════════════════════════════════════════════════════════════
     Mock World Building B1–B5 — cross-persona conversations (2026-04-26).
     Each visible from BOTH parties' inboxes via the persona switcher.
     ══════════════════════════════════════════════════════════════════════════ */

  // ── Tomáš ↔ Petra (booking — completed emergency sitting) ──
  {
    id: "tomas-petra-conv",
    conversationType: "booking",
    providerId: "petra",
    providerName: "Petra V.",
    providerAvatarUrl: "/images/generated/petra-profile.jpeg",
    ownerId: "tomas",
    ownerName: "Tomáš K.",
    ownerAvatarUrl: "/images/generated/tomas-profile.jpeg",
    status: "active",
    inquiry: {
      bookingType: "one_off",
      serviceType: "day_care",
      subService: "Emergency sitting",
      pets: ["Hugo"],
      startDate: "2026-03-15",
      endDate: "2026-03-17",
      dogName: "Hugo",
      message: tomasPetraMessages[0].text!,
    },
    messages: tomasPetraMessages,
    lastMessageId: "tp-8",
    unreadCount: 1,
  },

  // ── Tereza ↔ Marek (direct — casual sitting favour, completed) ──
  {
    id: "tereza-marek-conv",
    conversationType: "direct",
    providerId: "tereza",
    providerName: "Tereza N.",
    providerAvatarUrl: "/images/generated/tereza-profile.jpeg",
    ownerId: "marek",
    ownerName: "Marek D.",
    ownerAvatarUrl: "/images/generated/marek-profile.jpeg",
    status: "active",
    inquiry: EMPTY_INQUIRY,
    messages: terezaMarekMessages,
    lastMessageId: "tmk-6",
    unreadCount: 1,
  },

  // ── Klára ↔ Filip (booking — completed recall training) ──
  {
    id: "klara-filip-conv",
    conversationType: "booking",
    providerId: "klara",
    providerName: "Klára H.",
    providerAvatarUrl: "/images/generated/klara-profile.jpeg",
    ownerId: "filip",
    ownerName: "Filip N.",
    ownerAvatarUrl: "/images/generated/filip-profile.jpeg",
    status: "active",
    inquiry: {
      bookingType: "one_off",
      serviceType: "day_care",
      subService: "Recall training",
      pets: ["Toby"],
      startDate: "2026-01-20",
      endDate: "2026-02-10",
      dogName: "Toby",
      message: klaraFilipMessages[0].text!,
    },
    messages: klaraFilipMessages,
    lastMessageId: "kf-msg-4",
    unreadCount: 1,
  },

  // ── Klára ↔ Hana (booking — recurring reactive dog training) ──
  {
    id: "klara-hana-conv",
    conversationType: "booking",
    providerId: "klara",
    providerName: "Klára H.",
    providerAvatarUrl: "/images/generated/klara-profile.jpeg",
    ownerId: "hana",
    ownerName: "Hana P.",
    ownerAvatarUrl: "/images/generated/hana-profile.jpeg",
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "day_care",
      subService: "Reactive dog session",
      pets: ["Runa"],
      startDate: "2026-01-15",
      endDate: null,
      recurringSchedule: { days: ["Thu"], time: "11:00", timeLabel: "11:00am–12:00pm" },
      dogName: "Runa",
      message: klaraHanaMessages[0].text!,
    },
    messages: klaraHanaMessages,
    lastMessageId: "kh-msg-4",
    unreadCount: 1,
  },

  // ── Tereza ↔ Lucie (direct — co-regulars in Vinohrady Evening Walkers) ──
  {
    id: "tereza-lucie-conv",
    conversationType: "direct",
    providerId: "tereza",
    providerName: "Tereza N.",
    providerAvatarUrl: "/images/generated/tereza-profile.jpeg",
    ownerId: "lucie",
    ownerName: "Lucie Č.",
    ownerAvatarUrl: "/images/generated/lucie-profile.jpeg",
    status: "active",
    inquiry: EMPTY_INQUIRY,
    messages: terezaLucieMessages,
    lastMessageId: "tl-2",
    unreadCount: 1,
  },
  // ── Lena ↔ Pawel — Marketplace Owner anchor conversation ───────────
  {
    id: "lena-pawel-conv",
    conversationType: "booking",
    providerId: "pawel",
    providerName: "Pawel K.",
    providerAvatarUrl: "/images/generated/marek-profile.jpeg",
    ownerId: "lena",
    ownerName: "Lena M.",
    ownerAvatarUrl: "/images/generated/anezka-profile.jpeg",
    status: "active",
    inquiry: {
      bookingType: "ongoing",
      serviceType: "walks_checkins",
      subService: "Small-group walk",
      pets: ["Asha"],
      startDate: daysAgoIso(35, "00:00").slice(0, 10),
      endDate: null,
      recurringSchedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], time: "12:30", timeLabel: "12:30pm–1:30pm" },
      dogName: "Asha",
      message: lenaPawelMessages[0].text!,
    },
    messages: lenaPawelMessages,
    lastMessageId: "lp-8",
    unreadCount: 1,
  },
];

export function getConversation(id: string): Conversation | undefined {
  return mockConversations.find((c) => c.id === id);
}

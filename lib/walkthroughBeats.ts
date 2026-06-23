/**
 * walkthroughBeats.ts — the Guided Walkthrough's spine (Demo Narrative V2).
 *
 * Single source of truth for the demo's guided stories. Mirrors
 * `docs/strategy/Demo Narrative.md` — keep the two in sync. Consumed by:
 *   - `contexts/WalkthroughContext.tsx` — the beat + step sequencer
 *   - `components/walkthrough/WalkthroughInterstitial.tsx` — the persona
 *     handoff, the mid-beat interstitials, and the closing screen
 *   - `components/walkthrough/WalkthroughCard.tsx` — the on-surface step card
 *   - `app/page.tsx` — the launcher doors (one per WALKTHROUGH_LIST entry)
 *
 * REGISTRY (Multi-Path Demo, 2026-06-22): walkthroughs are named entries in
 * `WALKTHROUGH_LIST`, each `{ id, displayName, thesis, interviewee, closing,
 * beats }`; the sequencer runs one by id. Phase 1 ships `new-owner` (the
 * shipped V2 Daniel→Klára→Daniel spine, transitional home); `trainer` and
 * `shelter` join as Workstreams D/E land.
 *
 * Two-level structure:
 *   - A **beat** is one persona's segment. It opens with a full-screen
 *     persona-handoff interstitial (scene only — `context`) and lands on
 *     `startUrl`.
 *   - Within a beat, an ordered list of **steps**. Each step is one of:
 *       · `kind: "card"`         — shown on the on-surface card. A nav step
 *                                  (carries `advanceOn`), an action step, or
 *                                  a fire-off step (`fireOff` set).
 *       · `kind: "interstitial"` — a mid-beat full-screen interstitial
 *                                  (time-passage or explainer). The card
 *                                  hides; the interstitial screen shows.
 *
 * FORWARD REFERENCES — Workstream W4: Beat 1/2 nav steps point at two mock
 * records W4 still has to seed — the free walk meet `meet-klara-stromovka`
 * and the drop-off booking `booking-klara-toby`. W4 must create them with
 * exactly these ids; until then the walkthrough's nav to those routes 404s.
 */

export type WalkthroughStep =
  | {
      /** A step shown on the on-surface WalkthroughCard. */
      kind: "card";
      /** What the tester does — short, imperative. `**bold**` marks UI labels. */
      instruction: string;
      /** Optional supporting context — the "why", or what to notice. */
      detail?: string;
      /**
       * Navigation steps: the pathname the step sends the tester to. On
       * arrival the card auto-advances, so a "go here" step never sits
       * stale. Omit for action / fire-off steps (they advance on Next).
       */
      advanceOn?: string;
      /**
       * When set, the card renders NO "Next" button — the step advances
       * only when the tester performs the in-app action and the resulting
       * navigation reaches `advanceOn`. Use for an action with a side
       * effect that a plain Next would skip: e.g. "Start the session"
       * both routes to the active page AND flips the session in-progress;
       * routing straight there via Next leaves the walkthrough out of sync
       * with app state. Requires `advanceOn`.
       */
      awaitAction?: boolean;
      /**
       * Fire-off steps surface pre-written content for a one-tap commit.
       * When set, the card renders the image + caption as a post preview and
       * the primary action reads "Share". The matching post is seeded in
       * `mockPosts.ts` but HIDDEN from the group feed until the tester taps
       * Share (the card calls `sharePost(postId)`, which reveals it) — so the
       * post the card is about to share isn't already sitting in the feed.
       * `postId` links the card to that seeded post. 2026-05-22 (was a pure
       * narrated commit before; the post used to be pre-visible).
       */
      fireOff?: { imageUrl: string; caption: string; postId: string };
      /**
       * Notification ids to fire when this card step becomes active. Same
       * deferred-notification mechanism as the interstitial variant below, but
       * for card steps — used after the "a couple of days later" interstitial
       * was removed (2026-05-22): Magda's reach-out now fires as the "Open
       * Notifications" step activates. Payloads live in `deferredNotifications`
       * (`lib/mockNotifications.ts`); fired in `WalkthroughCard`. Idempotent.
       */
      fireNotifications?: string[];
    }
  | {
      /** A mid-beat full-screen interstitial — the card hides while it shows. */
      kind: "interstitial";
      /**
       * `time-passage` (move the clock) · `explainer` (unpack a concept) ·
       * `probe` (an assumption checkpoint — pose the interview question to the
       * viewer/room; rendered with a left accent bar so it reads as "ask this").
       * The probe mode is the "guided demo IS the interview" mechanism (FC17).
       */
      mode: "time-passage" | "explainer" | "probe";
      /** Small muted label — a time cue, "How this works", or "For the room". */
      eyebrow: string;
      heading: string;
      body: string;
      /**
       * Walkthrough A2 pre-staging: when set, tapping Continue on this
       * (time-passage) interstitial fast-forwards the walker to mentor-vouched
       * at the named shelter (via `vouchViaMentor`). Lets the `shelter` arc
       * narrate "a few good walks later, you're vouched" without the tester
       * grinding the per-session demo toggle. Idempotent. Fired in
       * `WalkthroughInterstitial`.
       */
      fireWalkerVouch?: {
        userId: string;
        shelterId: string;
        mentor: { id: string; name: string };
      };
      /**
       * Notification ids to fire (via `addNotification`) when the tester taps
       * Continue on this interstitial. Used by time-passage steps to defer
       * narrative notifications until the story's time has actually passed —
       * e.g. Magda's connection request + group invite must not appear in
       * Daniel's bell until Beat 3's "a couple of days later", or they're
       * visible (and impossible) at the beat's opening notifications screen.
       * Payloads live in `deferredNotifications` (`lib/mockNotifications.ts`),
       * deliberately kept OUT of the always-on stream. Firing is idempotent
       * (upsert by id). Fired in `WalkthroughInterstitial`.
       */
      fireNotifications?: string[];
    };

export type WalkthroughBeat = {
  /** 1-based beat number, for display ("Beat 1 of 3"). */
  n: number;
  /** Persona to switch to when this beat begins. Must exist in `lib/personas.ts`. */
  personaId: string;
  /** Time-of-day eyebrow. */
  when: string;
  /** Situational context — the persona-handoff interstitial. Scene-setting only. */
  context: string;
  /** Short one-liner describing the beat (one-per-beat synopsis). */
  summary: string;
  /** The surface the beat opens on (after the handoff interstitial's Continue). */
  startUrl: string;
  /** Ordered steps — card steps and mid-beat interstitials, interleaved. */
  steps: WalkthroughStep[];
};

/** Phase-1 walkthrough ids (the three community Worlds). Reconciled from
 *  FC17's four feature-paths: `neighbour-care` absorbs into `new-owner`; the
 *  two shelter flows combine into `shelter`. The shelter *operator* view is
 *  Phase 2, not a walkthrough id here. */
export type WalkthroughId = "new-owner" | "trainer" | "shelter";

export type Walkthrough = {
  /** Stable id — persisted in run state, used by the launcher doors. */
  id: WalkthroughId;
  /** Launcher door label. */
  displayName: string;
  /** Short owner-facing line shown on the launcher door (one sentence). */
  blurb: string;
  /** One-line thesis — what this path proves (interview framing, internal). */
  thesis: string;
  /** Who to show it to. The guided demo IS the interview (FC17). */
  interviewee: string;
  /** Closing-screen copy, shown after the final beat. */
  closing: { heading: string; body: string };
  /** Ordered beats. */
  beats: WalkthroughBeat[];
};

// ── new-owner ("Find your community") ────────────────────────────────────────
// Phase-1 transitional home for the shipped V2 Daniel→Klára→Daniel spine. Its
// Daniel beats + the neighbour-care absorption (Beat 3) are exactly W1's
// starting point; Workstreams C1/D1 split Beat 2's Klára POV into the standalone
// `trainer` walkthrough and refine what stays here.
const NEW_OWNER_BEATS: WalkthroughBeat[] = [
  // ── Beat 1 — Daniel: time to get Bára out ────────────────────────────────
  {
    n: 1,
    personaId: "daniel",
    when: "Earlier this week",
    context:
      "Daniel is still finding his feet in Prague. He adopted Bára a few months ago, a rescue who came to him nervous, quick to startle and slow to settle in. Since then it's mostly been the two of them and the apartment. He'd like her to have more than that: a walk she looks forward to, a few familiar dogs, somewhere she feels okay.",
    summary: "A newcomer finds a walk for his anxious dog.",
    startUrl: "/discover",
    steps: [
      {
        kind: "card",
        instruction:
          "In **Discover**, tap **Meets** to see what's happening nearby.",
        detail: "Daniel wants a walk where Bára can meet other dogs at her own pace.",
        advanceOn: "/discover/meets",
      },
      {
        kind: "card",
        instruction:
          "Open Klára's free **Stromovka morning walk**. It's near the top, under **Meets from your circle**.",
        detail: "It shows up there because Daniel already joined Klára's group.",
        advanceOn: "/meets/meet-klara-stromovka",
      },
      {
        kind: "card",
        instruction:
          "It's free, open to everyone, and Klára's note welcomes nervous dogs. Tap **Join** on the next session, then **Next**.",
        detail: "The first outing Daniel was hoping to find for Bára.",
      },
    ],
  },
  // ── Beat 2 — Daniel: review, convert, belong ─────────────────────────────
  // Same persona as Beat 1 (the walk happened in between). The interstitial
  // renders this as a time-passage continuation (no "You're now Daniel"
  // re-intro) because prevBeat.personaId === this beat's personaId.
  {
    n: 2,
    personaId: "daniel",
    when: "Later that day",
    context:
      "The walk's done. Bára started out nervous and settled in by the end, a real first step. Doggo just nudged Daniel to look back on the morning — and he keeps thinking about the people he met along the way.",
    summary: "From one walk: a trainer, a neighbour, a community.",
    startUrl: "/notifications",
    steps: [
      {
        kind: "card",
        instruction:
          "Tap the **Stromovka walk** notification to revisit the morning.",
        detail:
          "After a meet, Doggo nudges you to look back at who came.",
        // The notification's href carries `?tab=people`, so tapping it lands
        // Daniel straight on the walk's People tab. advanceOn is the bare
        // pathname (query ignored) so the card auto-advances on arrival —
        // no separate "open the People tab" step needed.
        advanceOn: "/meets/meet-klara-stromovka",
      },
      {
        kind: "card",
        instruction:
          "Daniel got talking to **Magda** on the walk, a neighbour from his own street. Find her on the **People** tab and mark her **Familiar**, then tap **Next**.",
        detail:
          "Everyone who came this morning is here, grouped by who Daniel already knows.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "What “Familiar” means",
        body:
          "Daniel's profile is private. Other people can't see his content or send him a message. Marking Magda Familiar opens his profile to her. It isn't a friend request: Magda is never notified, and it commits Daniel to nothing. It's the first step from stranger to familiar face.",
      },
      {
        kind: "card",
        instruction:
          "Daniel keeps thinking about how Klára handled the nervous dogs. Tap **Next** to open her **Services**.",
        detail: "A group walk is a great start, but Bára needs focused, one-on-one help.",
        advanceOn: "/profile/klara?tab=services",
      },
      {
        kind: "card",
        instruction:
          "Tap **Book a session** on the **1-on-1 training session**. Pick a date for Bára, check the **800 Kč** price, and send the request.",
        detail:
          "Choose the details, see the price up front, send. Klára replies with a proposal right away.",
        // Completes when the sheet's "Review the proposal" routes Daniel to
        // the chat thread where Klára's auto-proposal is waiting.
        advanceOn: "/profile/klara?tab=chat",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Klára sent a **proposal** straight back. Tap **Review & sign**, confirm the booking, then tap **Next**.",
        detail:
          "The free walk is what led Daniel here. Now he's investing in something bigger: the confident dog Bára could become.",
      },
      {
        kind: "card",
        instruction:
          "The next day, Magda's been in touch. Open Daniel's **Notifications**.",
        // Her connection request fires as this step becomes active (replacing
        // the removed "a couple of days later" interstitial), so it's waiting
        // when Daniel opens the bell — but not before he marked her Familiar
        // earlier in the beat. The group invite is deferred to the invite step
        // below (after he accepts), so it reads as sent once they're connected.
        // Fired in WalkthroughCard; idempotent.
        fireNotifications: ["notif-magda-connect-daniel"],
        advanceOn: "/notifications",
      },
      {
        kind: "card",
        instruction:
          "Magda has sent a **connection request**. **Accept** it, then tap **Next**.",
        detail:
          "Accepting connects them for real: now they can message each other and arrange care.",
      },
      {
        kind: "card",
        instruction:
          "Now that they're connected, Magda invites Daniel to her private group, **Holešovice Dog Block**. Open the invite.",
        detail: "Daniel's local circle is starting to take shape.",
        // The group invite fires HERE (not with the connection request), so it
        // arrives only after Daniel accepted — Magda invites a connection into
        // her private group, not a stranger. It pops into the notifications
        // list live as this step lands. Fired in WalkthroughCard; idempotent.
        fireNotifications: ["notif-ginvite-group-holesovice-block-daniel"],
        // Tapping the invite (or the card's Next) routes to the group, so the
        // tester lands there before the private-groups interstitial — no
        // separate "open the group" step needed afterwards.
        advanceOn: "/communities/group-holesovice-block",
      },
      {
        kind: "card",
        instruction:
          "Have a look around the feed, then tap **Join community** to become a member. Then tap **Next**.",
        detail: "A tight crew of Holešovice neighbours, and Daniel's one of them now.",
      },
      {
        kind: "card",
        instruction:
          "Open the **Members** tab and switch on **Show members' services**. See that **Veronika** offers walks to the circle, right on her card. Then tap **Next**.",
        detail:
          "Care from a neighbour, there whenever Daniel needs it. Booking her works just like Klára's, so no need to repeat it.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "Private groups, and mutual care",
        body:
          "A private group is a closed circle of neighbours, invite-only, not a marketplace of strangers. Inside it, anyone can offer care to the circle, you don't have to be a trainer or a business. A neighbour like Veronika just walks dogs, at a clear price that keeps it fair and easy.",
      },
    ],
  },
];

// ── trainer ("Meet your trainer") ────────────────────────────────────────────
// W2 — the walker-trainer's own POV: the walk IS the business. Split out of the
// V2 spine's Klára beat (D1, 2026-06-22). Single beat for now — the morning's
// work (run the linked-care session, seal the report) plus the walk post as
// lead-gen. The meet→booking *conversion* from Klára's side is the next
// enrichment (needs a pre-staged incoming inquiry — A2); the closing carries it
// as the payoff line until then. See the phase walkthrough O-items.
const TRAINER_BEATS: WalkthroughBeat[] = [
  {
    n: 1,
    personaId: "klara",
    when: "Morning",
    context:
      "Klára is a walker-trainer in Holešovice. Every week she hosts a free walk at Stromovka. It's how the neighbourhood's dogs get out, and it's how she meets her training clients. To her, the walk isn't a sideline. It's the business: demonstration, lead generation, and content, all at once. First, though, she's got a dog to pick up.",
    summary: "The walk is the work, and the work is the funnel.",
    startUrl: "/schedule",
    steps: [
      {
        kind: "card",
        instruction:
          "This is Klára's **My Schedule**. It holds the Stromovka walk she hosts and a paid walk for Toby, whom she picks up on the way. Tap **Start session** on Toby's booking.",
        detail:
          "The walk is free for everyone. Klára earns through the dogs she's booked to bring, like Toby.",
        advanceOn: "/bookings/booking-klara-toby/active",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Toby's session is live. An **active session** banner now rides along on every screen, so Klára can jump back anytime. Tap **Next**.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "A free walk, a growing business",
        body:
          "The walk is free and open to everyone, part exercise, part crew, part coaching. It's also Klára's shopfront: owners see how she works, the nervous dogs settle, and trust builds in the open. That trust is what turns a walk into a booked training client.",
      },
      {
        kind: "interstitial",
        mode: "probe",
        eyebrow: "For the room",
        heading: "Would you run a walk like this?",
        body:
          "For a walker or trainer watching: would you host a free public walk as your shopfront, knowing it's where clients come from? And would you take on newer walkers as paid mentees, the way Klára does? At what price would that be worth your time?",
      },
      {
        kind: "card",
        instruction:
          "The walk's done. Back on the active session, tap **Finish session** and seal the **visit report**. Photos and notes are optional.",
        detail:
          "Filip booked a walk for Toby; the report is how he knows it happened.",
        advanceOn: "/bookings/booking-klara-toby",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Head to the **Groups** tab on the Community page. Select **Klára's Calm Dog Sessions**.",
        detail:
          "After a walk wraps, this is where she shares the moment with the crew.",
        advanceOn: "/communities/group-klara-training",
      },
      {
        kind: "card",
        fireOff: {
          imageUrl: "/images/generated/post-stromovka-walk.jpeg",
          caption:
            "Some new faces on the morning walk. Look at these good boys. 🐾",
          postId: "post-klara-stromovka-walk",
        },
        instruction:
          "Klára's walk post is ready for the group. Tap **Share** to post it.",
      },
      {
        kind: "card",
        instruction:
          "Klára's post is live in the group feed. Take a look, then tap **Next**.",
        detail:
          "The crew sees it first, but the next owner with a nervous dog, scrolling Holešovice's groups, finds it too. That's how a walk becomes a client.",
      },
    ],
  },
];

// ── shelter ("Help a shelter dog") ───────────────────────────────────────────
// W3 — the shelter demand-side arc (E, 2026-06-22). Single POV: Eliška, the
// adoption-curious explorer, focal dog Nora (Útulek long-stayer). The arc weaves
// the credentialing mechanism (mentored → vouched) INTO the advocacy→adoption
// story, so it carries the full W3 thesis on one spine — Tomáš's separate mentee
// arc would be redundant (same mechanism, second persona) and stays in Open View
// + feeds the Phase-2 operator/interview material. Several steps run through
// modals or the demo state-toggles (no URL change) → action steps; A2 will
// pre-stage the walker/adoption state so those advances aren't hand-driven.
// See `strategy/Demo Narrative` → "The Adoption-Curious Arc" for the source beats.
const SHELTER_BEATS: WalkthroughBeat[] = [
  // ── Beat 1 — Find Nora, see how it works ──────────────────────────────────
  {
    n: 1,
    personaId: "eliska",
    when: "A quiet Saturday",
    context:
      "Eliška has been wondering about adopting, but it's a big step and she isn't sure. What she'd like first is to spend time with dogs, the ones who need it most, with no pressure to commit.",
    summary: "An adoption-curious newcomer looks for a low-pressure way in.",
    startUrl: "/discover",
    steps: [
      {
        kind: "card",
        instruction:
          "This is **Discover**, where you find what's near you on Doggo. Tap **Help a Dog**.",
        detail:
          "Parks and groups, local care, and shelter dogs who need walks. Walking one asks nothing more than a walk.",
        advanceOn: "/discover/help-a-dog",
      },
      {
        kind: "card",
        instruction:
          "This is **Help a Dog**: local shelters and the dogs who need a walk. Browse the list, then open **Nora**, a long-stayer at Útulek who's lovely on the trail.",
        detail:
          "No adoption obligation, just time with a dog. For a long-stayer like Nora, getting out is her best shot at being noticed.",
        advanceOn: "/dogs/shelter-dog-nora",
      },
      {
        kind: "card",
        instruction:
          "Tap **Walk Nora**, choose **Walk with a mentor**, and pick **Klára**. Her booking opens, then tap **Next**.",
        detail: "Klára's a trainer here who'll mentor your first walks.",
      },
    ],
  },
  // ── Beat 2 — The mentored walk: waivers, then the group walk ───────────────
  {
    n: 2,
    personaId: "eliska",
    when: "Setting up the walk",
    context:
      "Now to set up the mentored walk with Klára. First the waivers, then the walk. Whichever way Eliška goes out, it counts the same toward walking on her own.",
    summary: "Agree to the waivers, then sign up for the mentored group walk, all in one place.",
    startUrl: "/dogs/shelter-dog-nora",
    steps: [
      {
        kind: "card",
        instruction:
          "**Before your first walk**, agree to both waivers and tap **Continue**. They're required either way, group or 1-on-1.",
        detail:
          "The Doggo waiver signs once and carries to every shelter; the shelter's own signs here.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "From walker to trusted walker",
        body:
          "Your first walks are mentored: the trainer meets you at the shelter, makes the first pickup easy, and you walk in a group. After a few, the trainer vouches for you and you can walk on your own. The shelter keeps the final say throughout.",
      },
      {
        kind: "interstitial",
        mode: "probe",
        eyebrow: "For the room",
        heading: "Would your shelter accept this vouch?",
        body:
          "This is the load-bearing question. If your most trusted walker assessed and vouched for a newcomer, supervised and documented, would you accept that in place of your own intake? And today, is your walker count limited by applicants, or by what you can afford to vet?",
      },
      {
        kind: "card",
        instruction:
          "Pick **Klára's group walk** (Nora's already set), then **Sign up for the walk**.",
        detail:
          "The friendly way in: alongside the group, with Klára to get you started. Eliška's in, walking Nora.",
        // FC18 in-sheet sign-up: choosing the group walk in MentorSessionBookingSheet
        // creates the meet-linked shelter-walk booking + begins the mentorship,
        // no bounce to the meet page. Modal flow → manual advance.
      },
    ],
  },
  // ── Beat 3 — The walk, and the recap ──────────────────────────────────────
  {
    n: 3,
    personaId: "eliska",
    when: "Walk day",
    context:
      "Eliška's mentored first walk is here. With Klára and the group alongside, she takes Nora out, a real morning in the world for a dog who spends most of hers in a kennel.",
    summary: "The walk happens, and the recap is the advocacy loop's first move.",
    startUrl: "/bookings?tab=volunteering",
    steps: [
      {
        kind: "card",
        instruction:
          "Eliška's mentored walk with Nora is here on the **Volunteering** tab. Open it and **Start** the session.",
        detail: "Walk day. Nora gets a morning out, in good company.",
      },
      {
        kind: "card",
        instruction:
          "The walk's done. **Finish** the session to seal it. You'll land back on Nora's page, then tap **Next**.",
        detail: "Útulek sees the walk happened, with a record on Nora.",
      },
      {
        kind: "card",
        instruction:
          "Nora's page shows a **Share a moment** prompt. Tap it and post the recap (Nora and Útulek are pre-tagged). No pressure, but a recap is the most powerful thing a walker can do.",
        detail:
          "The recap is the adoption ad. A dog seen out, happy, in the world, is a dog people fall for.",
      },
      {
        kind: "interstitial",
        mode: "time-passage",
        eyebrow: "A few walks later",
        heading: "A trusted walker now.",
        body:
          "Eliška's walked with the group a few times since. She's calm with the dogs and reliable, so Klára vouches for her and Útulek agrees. She can walk on her own now, no mentor needed.",
        // Keeps the credentialing payoff visible (the probe's answer in action)
        // and the A2 vouch mechanism in use; not load-bearing for the adoption.
        fireWalkerVouch: {
          userId: "eliska",
          shelterId: "utulek-liben",
          mentor: { id: "klara", name: "Klára Horáčková" },
        },
      },
    ],
  },
  // ── Beat 4 — The recap reaches the network ────────────────────────────────
  {
    n: 4,
    personaId: "eliska",
    when: "Later",
    context:
      "Eliška shared a moment from Nora's walk. Because she follows Útulek, and so do others, that recap doesn't sit in a void. It travels.",
    summary: "Community exposure is the adoption engine.",
    startUrl: "/home",
    steps: [
      {
        kind: "card",
        instruction:
          "Here's the **home feed**. Recaps of Nora keep adding up, yours now among them, and they're working: **Kateřina** saw one and is asking the shelter about adopting her. Tap her comment to read it. She wasn't even one of Nora's walkers.",
        detail:
          "It's working: walkers surface the dog to people who'd never have found her at the kennel.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "The advocacy loop",
        body:
          "Dogs that get out and get seen are far more likely to be adopted, by a wide margin. The lift almost never comes from the walker adopting; it comes from the dog being photographed, shared, and noticed by someone else. Every walker is an advocate.",
      },
      {
        kind: "interstitial",
        mode: "probe",
        eyebrow: "For the room",
        heading: "How many of your adopters walked first?",
        body:
          "If walkers becoming advocates is the engine, this is the number that proves it: of the people who adopted from you, how many spent time with a dog first, walking, fostering, or a day-trip outing, before they committed?",
      },
      {
        kind: "card",
        instruction:
          "Kateřina wants to know more about Nora. Tap **Next** to follow where that leads.",
        detail: "A recap became real interest from a real adopter.",
      },
    ],
  },
  // ── Beat 5 — Nora finds a home ────────────────────────────────────────────
  {
    n: 5,
    personaId: "eliska",
    when: "Nora's happy ending",
    context:
      "The interest those recaps sparked turns into the thing it was all for: a home for Nora. The adoption path is gentle by design, with off-ramps the whole way.",
    summary: "The capstone: the network adopts, and the loop closes.",
    startUrl: "/dogs/shelter-dog-nora",
    steps: [
      {
        kind: "card",
        instruction:
          "On Nora's page, open **Adopt Nora**. Read the no-obligation framing and the ladder: walk, then a sleepover or foster, then adopt, returns always welcome, never a failure.",
        detail:
          "Útulek curates the meet-and-greet. There's no auto-match, the shelter stays in charge.",
      },
      {
        kind: "card",
        instruction:
          "Drive the adoption in the sheet: **Express interest**, then **Arrange meet-and-greet (demo)**, then **Finalise — network adopts (demo)** (Kateřina, from the recap). Nora reads **Adopted**. Then tap **Next**.",
        detail:
          "The home that found Nora came from a walk recap, not a kennel listing. The walker surfaced her; the network adopted. That's the engine. (Eliška-adopts is the alternate ending.)",
        // Adoption stages run through the AdoptInquirySheet demo controls
        // (interested → pending → adopted) with no URL change → action step.
      },
      {
        kind: "card",
        instruction:
          "Nora's page now shows her **Adopted** state and a happy ending. Take it in, then tap **Next** to wrap up.",
        detail:
          "One overlooked long-stayer, seen on a walk, shared to the network, home. Multiply that across every walker.",
      },
    ],
  },
];

// ── Registry ─────────────────────────────────────────────────────────────────
// Named walkthroughs. The launcher reads WALKTHROUGH_LIST for its doors; the
// sequencer (WalkthroughContext) runs one by id. Phase 1 ships all three
// community Worlds: `new-owner`, `trainer`, `shelter`.

const NEW_OWNER: Walkthrough = {
  id: "new-owner",
  displayName: "Find your community",
  blurb:
    "Follow an anxious new owner from a first nervous walk to a trainer, a neighbour, and a community his dog belongs to.",
  thesis:
    "A nervous newcomer lands in a community, finds trust, and the community→trust→care funnel turns — a pro to teach, a neighbour to lean on.",
  interviewee:
    "A new, recent, or anxious dog owner (especially first-time / expat).",
  closing: {
    heading: "End of walkthrough.",
    body:
      "One free walk at Stromovka. From it, Daniel found a trainer for nervous Bára, a neighbour to lean on, and a community to belong to. The community came first; the care followed. Want to keep exploring?",
  },
  beats: NEW_OWNER_BEATS,
};

const TRAINER: Walkthrough = {
  id: "trainer",
  displayName: "Build community, and a living",
  blurb:
    "See a walker-trainer's free public walk for what it really is: her demonstration, her lead generation, and her livelihood.",
  thesis:
    "The supply side is real: a pro builds a following and earns from the same community walk that grows the network. The walk IS the funnel.",
  interviewee:
    "A Prague walker, trainer, or sitter (the cold-start engine to recruit).",
  closing: {
    heading: "End of walkthrough.",
    body:
      "One free walk, and for Klára it was the whole business at once: a sealed visit report for a paying client, and a post that tomorrow's nervous-dog owner scrolls past and books her from. Community and livelihood, the same morning. Want to keep exploring?",
  },
  beats: TRAINER_BEATS,
};

const SHELTER: Walkthrough = {
  id: "shelter",
  displayName: "Help a shelter dog",
  blurb:
    "Walk an overlooked shelter dog, share the moment, and watch the network turn that walk into a home.",
  thesis:
    "Vetted community walkers + the advocacy loop turn a shelter's dogs into an adoption engine, easing vetting and coordination without more work or risk.",
  interviewee:
    "A shelter or rescue coordinator (the World-3 partner to win over).",
  closing: {
    heading: "End of walkthrough.",
    body:
      "Eliška came to spend time with a dog, no commitment. She earned a vouch through a mentor, walked Nora, and shared one moment, and that moment found Nora a home. Vetted walkers, a recap that travels, and an adoption, with the shelter keeping every veto. Want to keep exploring?",
  },
  beats: SHELTER_BEATS,
};

/** Ordered for the launcher doors — the three community Worlds. */
export const WALKTHROUGH_LIST: Walkthrough[] = [NEW_OWNER, TRAINER, SHELTER];

/** Lookup by id (the persisted run-state id). Undefined-safe. */
export function getWalkthrough(id: string | undefined): Walkthrough | undefined {
  return WALKTHROUGH_LIST.find((w) => w.id === id);
}

/** A walkthrough's beat by 0-based index. Undefined past the end (the closing interstitial). */
export function getBeat(
  walkthroughId: string | undefined,
  index: number,
): WalkthroughBeat | undefined {
  return getWalkthrough(walkthroughId)?.beats[index];
}

/** A walkthrough's beat count (0 if the id is unknown). */
export function getBeatCount(walkthroughId: string | undefined): number {
  return getWalkthrough(walkthroughId)?.beats.length ?? 0;
}

/**
 * Fire-off post ids across ALL walkthroughs — seeded in `mockPosts.ts` but kept
 * HIDDEN from feeds until the tester "Shares" them on the matching fire-off step
 * (tracked in `WalkthroughContext.sharedPostIds`). Aggregated across the
 * registry so any walkthrough's fire-off post stays hidden until shared,
 * regardless of which one is active. 2026-05-22 (registry-sourced 2026-06-22).
 */
export const WALKTHROUGH_FIREOFF_POST_IDS: Set<string> = new Set(
  WALKTHROUGH_LIST.flatMap((w) =>
    w.beats.flatMap((b) =>
      b.steps.flatMap((s) =>
        s.kind === "card" && s.fireOff ? [s.fireOff.postId] : [],
      ),
    ),
  ),
);

/**
 * Should this post be hidden from feeds right now? True when a walkthrough is
 * active, the post is a fire-off post, and the tester hasn't "Shared" it yet —
 * so the post a fire-off card is about to share isn't already sitting in any
 * feed (group feed, Community/Home feed). Outside a walkthrough this is always
 * false, so free-explore shows the seeded post normally. Shared across every
 * feed surface that reads `mockPosts`. 2026-05-22.
 */
export function isFireOffPostHidden(
  postId: string,
  walkthroughActive: boolean,
  sharedPostIds: string[],
): boolean {
  return (
    walkthroughActive &&
    WALKTHROUGH_FIREOFF_POST_IDS.has(postId) &&
    !sharedPostIds.includes(postId)
  );
}

/**
 * Meet ids whose "Coming up" feed card should be hidden while a walkthrough is
 * active. The Stromovka walk is run during Beat 2 (Klára's morning), and its
 * occurrence is dated today — so it would otherwise sit in Klára's feed as
 * "Coming up" even after she's just finished it, which contradicts the story.
 * Hidden only during the walkthrough; free-explore shows it normally (a
 * recurring weekly walk legitimately has an upcoming occurrence). 2026-05-22.
 */
export const WALKTHROUGH_HIDDEN_FEED_MEET_IDS: Set<string> = new Set([
  "meet-klara-stromovka",
]);

/** Should this meet's feed card be hidden right now (walkthrough-only)? */
export function isWalkthroughHiddenMeet(
  meetId: string,
  walkthroughActive: boolean,
): boolean {
  return walkthroughActive && WALKTHROUGH_HIDDEN_FEED_MEET_IDS.has(meetId);
}

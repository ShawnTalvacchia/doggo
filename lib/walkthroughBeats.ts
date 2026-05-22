/**
 * walkthroughBeats.ts — the Guided Walkthrough's spine (Demo Narrative V2).
 *
 * Single source of truth for the demo's guided story. Mirrors
 * `docs/strategy/Demo Narrative.md` — keep the two in sync. Consumed by:
 *   - `contexts/WalkthroughContext.tsx` — the beat + step sequencer
 *   - `components/walkthrough/WalkthroughInterstitial.tsx` — the persona
 *     handoff, the mid-beat interstitials, and the closing screen
 *   - `components/walkthrough/WalkthroughCard.tsx` — the on-surface step card
 *
 * V2 structure (re-authored 2026-05-18): 3 beats, 2 personas — Daniel's
 * journey is the spine, with one cut to Klára's POV (Beat 2).
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
      mode: "time-passage" | "explainer";
      /** Small muted label — a time cue, or "How this works" for explainers. */
      eyebrow: string;
      heading: string;
      body: string;
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

export const WALKTHROUGH_BEATS: WalkthroughBeat[] = [
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
          "**Discover** has three doors. Tap **Meets** to see what's happening nearby.",
        detail: "Daniel's after a walk where Bára can meet other dogs gently.",
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
          "Read the walk. It's free, open to everyone, and Klára's note welcomes nervous dogs. Tap **Join** on the upcoming session. Then tap **Next**.",
        detail: "This is the gentle first outing Daniel was hoping to find for Bára.",
      },
    ],
  },
  // ── Beat 2 — Klára: the walk is the work ─────────────────────────────────
  {
    n: 2,
    personaId: "klara",
    when: "Morning",
    context:
      "Klára runs a free walk at Stromovka every week, it's how the neighbourhood's dogs get out. First, though, she's got a dog to pick up.",
    summary: "Run the morning. The walk is the work.",
    startUrl: "/schedule",
    steps: [
      {
        kind: "card",
        instruction:
          "This is Klára's **My Schedule**, her day in time order. It holds the Stromovka walk she hosts and a booked walk for Toby, whom she picks up on the way. Tap **Start session** on Toby's booking.",
        advanceOn: "/bookings/booking-klara-toby/active",
        // No card "Next" — the schedule's quick-start is what advances this
        // step: tapping Start flips the session in-progress and routes to the
        // active page, so the walkthrough can't reach Finish with an unstarted
        // session. If the tester reaches the active page then navigates away
        // before the auto-advance registers, WalkthroughCard's Continue
        // fallback recovers the step (no dead-end).
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Toby's session is live. From here on, an **active session** banner rides along on every screen, so Klára can jump back to the walk from anywhere in the app. Tap **Next** to carry on.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "A free walk, a growing network",
        body:
          "The walk is free and open to everyone, part exercise, part crew, part gentle guidance. Klára earns from the dogs she's booked to bring, like Toby, and the walk is how she earns owners' trust, books training clients, and grows her network.",
      },
      {
        kind: "card",
        instruction:
          "The walk's done. Back on the active session, tap **Finish session** and seal the **visit report**. Photos and notes are optional.",
        detail:
          "Filip gets the report afterwards, photos and all. He booked a walk; this is how he knows it happened.",
        // Finish session routes to `/bookings/<id>?tab=sessions` — the
        // pathname is `/bookings/<id>` (query string is excluded from
        // `usePathname`), which is the advanceOn target. `awaitAction`
        // hides the Next button so the tester must actually finish the
        // session (the action this step is about) rather than skip past.
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
          "The crew sees it first, but the next owner scrolling Holešovice's groups finds it too. That's how the walk grows.",
      },
    ],
  },
  // ── Beat 3 — Daniel: review, convert, belong ─────────────────────────────
  {
    n: 3,
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
          "After a meet, Doggo prompts attendees to look back: who came, and who Daniel might want to know.",
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
          "Daniel keeps thinking about how calmly Klára handled the nervous dogs. Tap **Next** to open her full list of **Services**.",
        detail: "A group walk is a great start, but Bára needs focused, one-on-one help to really get there.",
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
          "A connection request is the open ask to actually connect. When Daniel accepts, the two of them are connected for real: they can message each other and arrange care.",
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
          "Care from inside the circle, there whenever Daniel needs it. Booking her works just like the request he sent Klára, so no need to repeat it here.",
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

/** Total beat count. */
export const WALKTHROUGH_BEAT_COUNT = WALKTHROUGH_BEATS.length;

/**
 * Post ids that are seeded in `mockPosts.ts` but should stay HIDDEN from the
 * group feed until the tester "Shares" them on the matching fire-off step
 * (tracked in `WalkthroughContext.sharedPostIds`). Lets a fire-off step
 * present a post that isn't already sitting in the feed. Derived from every
 * beat's fire-off `postId`. 2026-05-22.
 */
export const WALKTHROUGH_FIREOFF_POST_IDS: Set<string> = new Set(
  WALKTHROUGH_BEATS.flatMap((b) =>
    b.steps.flatMap((s) =>
      s.kind === "card" && s.fireOff ? [s.fireOff.postId] : [],
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

/** Get a beat by 0-based index. Returns undefined past the end (the closing interstitial). */
export function getBeat(index: number): WalkthroughBeat | undefined {
  return WALKTHROUGH_BEATS[index];
}

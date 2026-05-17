/**
 * walkthroughBeats.ts — the Guided Walkthrough's four-beat spine.
 *
 * Single source of truth for the demo's guided story. Mirrors
 * `docs/strategy/Demo Narrative.md` — keep the two in sync. Consumed by:
 *   - `contexts/WalkthroughContext.tsx` — the beat + step sequencer
 *   - `components/walkthrough/WalkthroughInterstitial.tsx` — the handoff screen
 *   - `components/walkthrough/WalkthroughCard.tsx` — the on-surface step card
 *   - `app/demo/page.tsx` — the beat preview on the launcher
 *
 * Two-level structure:
 *   - A **beat** is one persona's segment. It opens with a full-screen
 *     interstitial (persona handoff — scene only, no task) and lands on
 *     `startUrl`.
 *   - Within a beat, the on-surface card walks the tester through ordered
 *     **steps** — one instruction at a time, with optional `detail` context.
 *     The tester does each step (navigating the app themselves), taps Next,
 *     and the card advances. Past the last step → the next beat's interstitial.
 *
 * Persona display data (avatar, name, archetype) is resolved from
 * `lib/personas.ts` via `personaId`.
 *
 * Step copy is first-draft — expected to be refined against real walkthroughs.
 */

export type WalkthroughStep = {
  /** What the tester should do — short, imperative. `**bold**` marks UI labels. */
  instruction: string;
  /** Optional supporting context — the "why", or what to notice. */
  detail?: string;
  /**
   * For pure "navigate here" steps: the pathname the step sends the tester
   * to. When the tester reaches it, the card auto-advances to the next step —
   * so a navigation step never sits stale after it's been done. Omit for
   * action steps (book, mark Familiar, etc.) — those advance on manual Next.
   */
  advanceOn?: string;
};

export type WalkthroughBeat = {
  /** 1-based beat number, for display ("Beat 1 of 4"). */
  n: number;
  /** Persona to switch to when this beat begins. Must exist in `lib/personas.ts`. */
  personaId: string;
  /** Time-of-day eyebrow. */
  when: string;
  /** Situational context — the interstitial handoff. Scene-setting only, no task. */
  context: string;
  /** Short one-liner for the `/demo` beat preview. */
  summary: string;
  /** The surface the beat opens on (after the interstitial's Continue). */
  startUrl: string;
  /** Ordered steps the on-surface card walks the tester through. */
  steps: WalkthroughStep[];
};

export const WALKTHROUGH_BEATS: WalkthroughBeat[] = [
  {
    n: 1,
    personaId: "daniel",
    when: "Saturday morning",
    context:
      "Daniel adopted Bára, a reactive rescue, and slowly found his footing — first a support group, then private 1-on-1 training with Klára. Today he's trying her group session for the first time.",
    summary: "Find a meet, book it, and meet a neighbour.",
    startUrl: "/discover",
    steps: [
      {
        instruction: "Doggo's **Discover** page has three doors — Meets, Groups, and Dog Care. Tap **Meets** to see what's happening nearby.",
        detail: "Daniel is after community walks and training sessions near him.",
        advanceOn: "/discover/meets",
      },
      {
        instruction: "Open Klára's **Calm Dog Group Session — Stromovka**. It's near the top, under “Meets from your circle”.",
        detail: "It surfaces first because Daniel already trains 1-on-1 with Klára, so she counts as part of his circle.",
        advanceOn: "/meets/meet-care-1",
      },
      {
        instruction: "Tap **Book session** and confirm the booking. Once it's booked, tap **Next** below to carry on.",
        detail:
          "It's a paid group session — for Klára's training meets, booking IS the RSVP, so there's no separate “Going” button.",
      },
      {
        instruction: "Open the **People** tab, find **Magda**, mark her **Familiar**, then tap **Connect**. Tap **Next** when you've done both.",
        detail:
          "Magda is another owner at the session. Daniel's profile is locked, so marking Magda Familiar is what lets her see it — it's silent, it isn't a connection request, and Magda is never notified. Connect is the separate, mutual step that actually links the two of them.",
      },
    ],
  },
  {
    n: 2,
    personaId: "klara",
    when: "Saturday morning · earlier",
    context:
      "Rewind to earlier that Saturday. Before the group session, Klára has a private booking — Hana's dog Runa, who's working through reactivity. This is the everyday work of a community trainer.",
    summary: "Run a care session start to finish.",
    startUrl: "/bookings",
    steps: [
      {
        instruction: "This is Klára's **Bookings**. Find the active booking with **Hana** (her dog Runa) and open it.",
        detail: "Klára sees the carer side of every booking — her clients, her schedule.",
        advanceOn: "/bookings/booking-klara-hana",
      },
      {
        instruction: "Open the **Sessions** tab and **Start** today's session.",
        detail: "Starting a session lights up the active panel — and a live banner across the whole app.",
        advanceOn: "/bookings/booking-klara-hana/active",
      },
      {
        instruction: "Tap **Add a photo** and **Add a note** to see how a carer logs a visit — both are optional, so there's no need to actually upload anything. Then tap **Finish** to seal the visit report, and tap **Next**.",
        detail: "The sealed report — photos, notes, time and distance — is exactly what Hana sees afterward.",
      },
    ],
  },
  {
    n: 3,
    personaId: "magda",
    when: "Saturday afternoon",
    context:
      "Saturday afternoon. Magda anchors a tight private group of a dozen Holešovice neighbours — and she met Daniel at this morning's session. Tonight she's heading out, and Žofka needs company.",
    summary: "Connect, invite, and arrange neighbour care.",
    startUrl: "/notifications",
    steps: [
      {
        instruction: "Daniel sent a **connection request** after the meet. Find it in Magda's notifications and tap **Accept** — then tap **Next**.",
        detail: "They marked each other Familiar at the session — accepting is the mutual step that makes them Connected.",
      },
      {
        instruction: "Go to the **Community** tab and open Magda's group, **Holešovice Dog Block**. **Invite Daniel** to join, then tap **Next**.",
        detail: "Your groups live under the Community tab. This one's a small, private group of a dozen neighbours — the kind that replaces a building's WhatsApp thread.",
      },
      {
        instruction: "Magda's going out tonight. Open **Veronika**'s profile from the group and **book her** for an evening drop-in. Tap **Next** when it's booked.",
        detail:
          "Veronika is a neighbour, not a hired stranger — a posted rate and a quick booking, no awkward “what do I owe you”. Good fences make good neighbours.",
      },
    ],
  },
  {
    n: 4,
    personaId: "lena",
    when: "The following Monday",
    context:
      "The following Monday. Lena joined Doggo for one thing — reliable care for Asha. The community did its job; her week now runs on a steady recurring booking, and that's success.",
    summary: "See what life looks like after the funnel.",
    startUrl: "/home",
    steps: [
      {
        instruction: "This is Lena's home feed. Find the **discovery banner** and scroll past it, the way she would. Tap **Next** to carry on.",
        detail: "Lena has settled into care — the app nudges her toward community gently, and never nags.",
      },
      {
        instruction: "Open **Bookings** and find the recurring weekday walks with **Pawel**. Tap **Finish** when you've had a look.",
        detail: "A quiet, steady arrangement — this is what “graduated to care” looks like, and where most Doggo users end up.",
      },
    ],
  },
];

/** Total beat count. */
export const WALKTHROUGH_BEAT_COUNT = WALKTHROUGH_BEATS.length;

/** Get a beat by 0-based index. Returns undefined past the end (the closing interstitial). */
export function getBeat(index: number): WalkthroughBeat | undefined {
  return WALKTHROUGH_BEATS[index];
}

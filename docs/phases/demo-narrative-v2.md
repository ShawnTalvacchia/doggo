---
status: draft
last-reviewed: 2026-05-18
review-trigger: When any task is completed or blocked
---

# Demo Narrative V2 — Walker-Trainer Story

**Goal:** Re-author the guided demo as a polished narrated *concept* story — a tighter 3-beat walkthrough framed around the walker-trainer hybrid, with pre-loaded content fired off step by step and richer interstitials — good enough to answer one question: *is this idea sticky?*

**Why now:** the V1 walkthrough functions, but it's an *interactive tour* — the tester performs every action, so every step is a surface that has to fully work (this is why the V1 build kept hitting feature stubs). V2 shifts to a *narrated story*: the world is pre-staged, the tester taps through it. More robust, richer, faster-paced, and on-message for what the demo is for — testing the concept, not the UX. The 2026-05-15 PO briefing also sharpened the framing: the **walker-trainer hybrid** (80–90% of the Prague pro market) is the cold-start engine, and *every walk is demonstration + lead-gen* — a headline payoff V1 underplays.

**Not for the imminent PO meeting.** The V1 demo is intact and shippable; it's the fallback. V2 is quality-over-speed — the user will show V1 + V2 progress at the meeting and discuss strategy.

**Depends on:** Demo Narrative & Personas + Guided Walkthrough Build (both closed 2026-05-18) — V2 re-authors their output. The walkthrough infrastructure (`WalkthroughContext`, interstitial, on-surface card) exists and is extended here, not rebuilt.

**Validation note:** the PO briefing §4 recommended validating the walker-trainer angle via pro conversations before redesigning. The user chose to proceed in parallel — the polished V2 demo is itself the concept-testing instrument. Not a blocker; flagged so the team keeps the briefing's validation moves on the table.

**Refs:**
- `docs/meetings/po-briefing-2026-05-15.md` — the walker-trainer hybrid framing + meet→booking conversion
- `docs/strategy/Demo Narrative.md` — the V1 four-beat spine; **W1 re-authors this file**
- `docs/features/demo-mode.md` → "Guided Walkthrough" — the as-built walkthrough spec
- `docs/strategy/Cold-Start Playbook.md` — trainer-led walks as the cold-start engine
- `docs/strategy/User Archetypes.md` — persona archetypes
- `lib/walkthroughBeats.ts`, `contexts/WalkthroughContext.tsx`, `components/walkthrough/` — the infrastructure V2 extends
- `docs/strategy/Groups & Care Model.md` — config #2 (drop-off care on a free meet), circle-audience Carer

---

## Narrative design (decided 2026-05-18)

Locked in conversation before this board was drafted. The workstreams execute this; don't re-litigate it without reason.

**Audience.** A polished narrated story for the PO / first-time viewers — "is the concept sticky?" The free-explore persona picker on `/demo` stays as the hands-on usability-testing mode; V2 optimizes the *walkthrough* for narration and stops trying to be both.

**Three beats, three layers** (anchor event = Klára's Stromovka group walk; Beats 1 & 2 are two POVs of it):

1. **Klára — the walker-trainer (the engine).** Picks up a side character's dog (a drop-off **Care** booking — config #2), starts that care session, leads the group walk. Closes with a pre-written, pre-photo'd post from the walk (tester taps Share).
2. **Daniel — the newcomer (the funnel).** New in town, anxious rescue. Discover → finds Klára's walk → joins. *Time-passage interstitial.* Reviews the meet, joins Klára's group, meets Magda (same neighbourhood) → marks her Familiar. *Explainer interstitial: what Familiar does.* *Time-passage.* A connection request + message from Magda is waiting (pre-seeded); accepts; the message invites him to the private group. Capstone: books Klára's training — the **meet → booking conversion**.
3. **Magda — the neighbourhood circle.** *Explainer interstitial: private groups + mutual care.* Inside Holešovice Dog Block: a closed circle where members offer care to each other — Veronika's circle-scoped Carer offering is visible *in the group*; a neighbour books her. Magda heads out on a casual neighbour walk.

Closing interstitial ties Daniel's arc + the community↔marketplace balance. Lena's V1 "graduated to care" end-state is **absorbed into the closing screen**, not a beat.

**Payoffs the demo must land:** (1) a walk is a community, not just exercise; (2) for a pro, the walk *is* the business — meet→booking; (3) the funnel: stranger → Familiar → Connected; (4) Familiar is a real, distinct, silent thing; (5) private groups + mutual care (the new, careful one); (6) the loop closes — the sealed visit report.

**Key calls:**
- **Pre-loaded content.** Posts, messages, other people's activity are staged; the tester performs only 1–2 *hero* actions per beat and "fires off" pre-filled content with one tap.
- **Interstitials become a 3-mode device:** persona handoff · time-passage ("the next morning…") · feature explainer. Time-passage doubles as the honest cover for pre-seeded state.
- **A meet has no "start session."** Only **care** has Start/Finish (it's an accountable paid service with a deliverable). Klára's Beat 1 "start" is the drop-off **care** session; the walk/meet around it has no start gate.
- **Connector = Magda**, not Tereza — geography (Klára's walk at Stromovka, Holešovice Dog Block + Veronika's circle-care already built there). Tereza stays the free-explore default.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [ ] Read every task + its referenced docs — the PO briefing, the V1 `Demo Narrative.md`, `demo-mode.md` Guided Walkthrough spec, Cold-Start Playbook
- [ ] Review Open Questions log — §7 (cold start / go-to-market) + §10 (demo framing — resolved) for anything affecting V2
- [ ] Audit for conflicts between this plan and the current codebase — the V1 walkthrough is live; V2 re-authors `walkthroughBeats.ts` + extends the interstitial/step model
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks
- [ ] Confirm scope — narrative re-author + content staging + walkthrough-infra extension + mock-data reshaping; **no new product surface** beyond what the private-care concept needs (W5)

---

## Workstream W1 — Narrative re-author

Produces the V2 spine. Everything else reads from it. Doc work only.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W1.1 | **Re-author `docs/strategy/Demo Narrative.md` as the V2 spine.** Replace the V1 four-beat outline with the 3-beat structure above: walker-trainer framing, the anchor event, per-beat persona + surfaces + payoffs + steps, and "what's cut" (Lena beat → closing screen). | `docs/strategy/Demo Narrative.md`, `po-briefing-2026-05-15.md` | todo |
| W1.2 | **Map every payoff + feature to a beat + step.** Walk the 6 payoffs; confirm each has a concrete home in a step. Flag any feature that needs a surface that doesn't exist (feeds W5 / scope). | output of W1.1, `docs/features/demo-mode.md` | todo |
| W1.3 | **Spec the three interstitial modes** — persona handoff, time-passage, feature explainer — and place each one in the 3-beat flow. Copy structure with examples; final copy is build-time. | `docs/features/demo-mode.md` (interstitial spec) | todo |
| W1.4 | **Spec the pre-loaded-content mechanic.** How a "fire off" step presents staged content — composer pre-filled → tester taps Share; message pre-written in a thread; etc. Define the tester's role: 1–2 hero actions per beat, everything else staged. | output of W1.1 | todo |

---

## Workstream W2 — Persona & character sharpening

Reshape the cast for the V2 narrative. Mostly sharpening existing personas, not new people.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W2.1 | **Reframe Klára as an explicit walker-trainer hybrid** (per the PO briefing), not just "trainer." Audit profile hero, Services tab, group description, bio — does "walks *and* trains" read clearly? Adjust copy/data where it reads trainer-only. | `lib/mockUsers.ts:klara`, `lib/mockGroups.ts`, `po-briefing-2026-05-15.md` | todo |
| W2.2 | **Daniel as the Holešovice/Bubeneč newcomer.** Align his neighbourhood to Klára's Stromovka walk + Magda's Holešovice group so "same neighbourhood as Magda" lands. Re-check the V1 "rewind vs after-picture" data concerns. | `lib/mockUsers.ts:daniel`, `lib/mockConnections.ts` | todo |
| W2.3 | **Beat 1 drop-off owner — pick + sharpen a side character.** The owner who books Klára (drop-off care) and hands off a beloved dog. Use an existing supporting persona; give them just enough to read as a converted client ("met Klára at one of these walks"). | `lib/mockUsers.ts`, `lib/mockBookings.ts` | todo |
| W2.4 | **Magda as connector + private-group anchor; Veronika as the circle-Carer.** Confirm Holešovice Dog Block + Veronika's `publicProfile:false` Carer profile fit V2 Beat 3; reshape where the V2 narrative needs it. | `lib/mockUsers.ts` (magda, veronika), `lib/mockGroups.ts` (holesovice block) | todo |
| W2.5 | **Photo needs.** Generate what's missing — mainly pre-loaded post imagery (Klára's walk post). Attempt character consistency where feasible; accept imperfect. | `public/images/generated/` | todo |

---

## Workstream W3 — Walkthrough infrastructure

Extend the built walkthrough (don't rebuild it) to support the V2 structure.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W3.1 | **Re-author `lib/walkthroughBeats.ts`** — 3 beats (Klára → Daniel → Magda), new step lists per W1. | `lib/walkthroughBeats.ts`, output of W1 | todo |
| W3.2 | **Interstitial modes.** Extend `WalkthroughInterstitial` / the beat-step model to support **mid-beat** interstitials (time-passage + feature-explainer), not just the per-beat persona handoff. Decide the data shape (e.g. an interstitial-type step kind). | `components/walkthrough/WalkthroughInterstitial.tsx`, `contexts/WalkthroughContext.tsx` | todo |
| W3.3 | **"Fire off pre-loaded content" step type.** A step kind that surfaces staged content and lets the tester send/share it with one tap (pre-filled composer → Share; pre-written message; etc.). | `lib/walkthroughBeats.ts`, `components/walkthrough/WalkthroughCard.tsx` | todo |
| W3.4 | **Verify the 3-beat flow end to end** — start → 3 beats → closing → exit; pause/resume; the new interstitial modes; the fire-off steps. `npx tsc --noEmit` clean. | running app | todo |

---

## Workstream W4 — Pre-loaded content staging

Seed the staged assets the narrative fires off. Lean — only what the demo walks past.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W4.1 | **Klára's walk post** — pre-written caption + photo, staged so Beat 1's tester taps Share. | `lib/mockPosts.ts`, output of W2.5 | todo |
| W4.2 | **Magda's connection request + message** (carrying the private-group invite) — pre-staged for Beat 2's accept step. | `lib/mockNotifications.ts`, `lib/mockConversations.ts`, `lib/mockConnections.ts` | todo |
| W4.3 | **State behind the time-passage interstitials.** Pre-seed whatever "a day passed → X is waiting" reveals, so the jump reads honest. | `lib/mock*.ts`, `lib/mockDate.ts` | todo |
| W4.4 | **Beat 1 drop-off care booking + the meet→booking conversion.** Seed the drop-off booking (config #2); wire Daniel booking Klára's training as Beat 2's capstone. | `lib/mockBookings.ts`, `lib/mockMeets.ts` | todo |

---

## Workstream W5 — Private-group mutual-care concept

The "closed circle where members care for each other" idea is new and needs careful, deliberate display. Its own workstream because it's the one place V2 may need real surface work.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W5.1 | **Explainer interstitial copy** — unpack it plainly: a private group is a closed circle of neighbours; inside it, members offer care to each other; not a marketplace of strangers. | output of W1.3 | todo |
| W5.2 | **Surface a member's circle-scoped care offering inside the group.** Veronika's `publicProfile:false` Carer offering should be visible/legible *within* Holešovice Dog Block. Assess whether the group surface needs a small addition (a "care offered here" affordance) or existing surfaces suffice. | `app/communities/[id]/page.tsx`, `lib/identityBadges.ts`, `docs/strategy/Groups & Care Model.md` | todo |
| W5.3 | **A member-to-member booking inside the private group** — a neighbour books Veronika for a drop-in. The concrete mutual-care moment; contrast it with the marketplace (same booking machinery, pre-existing trust). | `components/bookings/`, `lib/mockBookings.ts` | todo |

---

## Acceptance Criteria

- [ ] `docs/strategy/Demo Narrative.md` is re-authored as the 3-beat V2 spine (Klára → Daniel → Magda), walker-trainer framing, payoffs mapped, the cut documented.
- [ ] `lib/walkthroughBeats.ts` is 3 beats; the Guided Walkthrough runs them start → closing → exit.
- [ ] Interstitials support all three modes — persona handoff, time-passage, feature explainer.
- [ ] Pre-loaded content (Klára's post, Magda's message) fires off via dedicated steps; the tester performs only the hero actions.
- [ ] The meet → booking conversion is shown explicitly (Daniel books Klára).
- [ ] The private-group mutual-care concept is shown *and* explained — explainer interstitial + a circle-scoped offering + a member-to-member booking.
- [ ] Klára reads clearly as a walker-trainer hybrid across her surfaces.
- [ ] `npx tsc --noEmit` compiles clean.

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk every acceptance criterion against the running app
- [ ] Sweep the walkthrough's Decisions log → propagate to home docs
- [ ] Update `docs/features/demo-mode.md` — the Guided Walkthrough spec (interstitial modes, step kinds, the 3-beat structure)
- [ ] Update affected feature docs (`meets.md`, `messaging.md`, `Groups & Care Model.md` if W5 touched the group surface)
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md + CLAUDE.md
- [ ] Archive this phase board + walkthrough
- [ ] Structural audit — see `CONTRIBUTING.md` → Closing a Phase step 9a
- [ ] Strategic review

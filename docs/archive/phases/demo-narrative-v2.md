---
status: archived
last-reviewed: 2026-06-01
review-trigger: archived — phase closed 2026-06-01
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

Decided in conversation. **Revised mid-W1 (2026-05-18)** from a 3-persona structure (Klára → Daniel → Magda) to the **2-persona structure below** — Daniel's journey is the spine, with one cut to Klára's POV. Full spine: `docs/strategy/Demo Narrative.md`; this is the summary. Don't re-litigate without reason.

**Audience.** The walkthrough's first audience is **walker-trainers** — a concept-test + recruitment instrument (does the positioning make a trainer want to use the platform?). Also serves a PO / first-time viewer. The free-explore persona picker on `/demo` stays the hands-on usability-testing mode; V2 optimizes the *walkthrough* for narration.

**Three beats, two personas** (anchor event = Klára's free Stromovka walk, config #2; the demo orbits it):

1. **Daniel — the newcomer.** New to Prague, anxious rescue Bára, already in Klára's care group. Finds her free Stromovka walk under "Meets from your circle" → joins (RSVP).
2. **Klára — the walker-trainer (the engine).** Her morning: picks up a client's dog (a drop-off **Care** booking — config #2), starts the care session. *Explainer interstitial: what happens on a trainer's walk.* Opens the meet (Daniel's there). Finishes the session + seals the visit report. Fires off a pre-written walk post (viewer taps Share).
3. **Daniel — review, convert, belong.** Reviews the walk → marks Magda Familiar. *Explainer: what Familiar does.* Books Klára's 1-on-1 training (concise, auto-accepted — the **meet → booking conversion**). *Time-passage.* A pre-seeded connection request + message from Magda is waiting; accepts → Connected; her message invites him to the private group. *Explainer: private groups + mutual care.* Joins **Holešovice Dog Block**; books **Veronika** — a group member's circle-only, low-rate care offering.

Closing screen ties Daniel's arc + the community↔marketplace balance. Lena's V1 "graduated to care" end-state is **absorbed into the closing screen**, not a beat. Magda is a **supporting character**, not a POV — her Hub Member archetype stays in Open View.

**Payoffs the demo must land:** (1) a walk is a community, not just exercise; (2) for a pro, the walk *is* the business — meet→booking; (3) the funnel: stranger → Familiar → Connected; (4) Familiar is a real, distinct, silent thing; (5) private groups + mutual care (the new, careful one); (6) the loop closes — the sealed visit report; (7) training is the on-ramp to belonging.

**Key calls:**
- **Pre-loaded content.** Posts, messages, other people's activity are staged; the viewer performs only 1–2 *hero* actions per beat and "fires off" pre-filled content with one tap. Low cognitive load — narrated, not an interactive tour.
- **Interstitials are a 3-mode device:** persona handoff · time-passage · explainer (a Doggo feature *or* a concept like the trainer's on-walk method).
- **A meet has no "start session."** Only **care** has Start/Finish (an accountable paid service with a deliverable). Klára's Beat 2 "start" is the drop-off **care** session; the walk/meet has no start gate.
- **Linear, no backflip.** Daniel joins → the walk happens (Klára's POV) → Daniel reviews.
- **Magda = the connector** (geography — Klára's Stromovka walk, Holešovice Dog Block + Veronika's circle-care), now a supporting character. Tereza stays the Open View default.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task + its referenced docs — the PO briefing, the V1 `Demo Narrative.md`, `demo-mode.md` Guided Walkthrough spec, Cold-Start Playbook
- [x] Review Open Questions log — §7 (cold start / go-to-market) + §10 (demo framing — resolved) for anything affecting V2
- [x] Audit for conflicts between this plan and the current codebase — the V1 walkthrough is live; V2 re-authors `walkthroughBeats.ts` + extends the interstitial/step model
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — none; all referenced docs reviewed 2026-05-15..05-17
- [x] Confirm scope — narrative re-author + content staging + walkthrough-infra extension + mock-data reshaping; **no new product surface** beyond what the private-care concept needs (W5)

**Opening audit (2026-05-18).** Conflicts surfaced, none blocking — all are anticipated re-author work:
- `walkthroughBeats.ts` is 4 beats (Daniel→Klára→Magda→Lena); V2 re-authors to 3 (Klára→Daniel→Magda). `WALKTHROUGH_BEAT_COUNT` is derived, so counts auto-propagate — but hardcoded prose ("Four beats, four personas") in `WalkthroughInterstitial.tsx:71` (closing screen) + `app/demo/page.tsx:83` must be re-authored (W3).
- The step model is a flat `{ instruction, detail?, advanceOn? }` list; `phase` ("interstitial"|"running") is beat-level. Mid-beat interstitials (W3.2) + fire-off steps (W3.3) need a step-`kind` discriminator — anticipated by the board.
- **Anchor-meet open call for W1.1:** the V1 anchor `meet-care-1` is a *required-link paid* meet (booking IS RSVP). V2 Beat 1 showcases config #2 (drop-off Care on a *free* meet — book ≠ attend) and Beat 2 has Daniel *join* the walk (free RSVP). These are incompatible — config #2 requires a free meet. W1.1 must decide whether the V2 anchor is a re-modelled/new free meet or a different structure. The V1 narrative deliberately left config #2 out of the guided path; V2 reverses that.
- **Daniel rewind reopened:** V1 locked "after-picture" (Daniel already Klára's Connected client) to avoid `klaraTrainingDaniel` cascade. V2's "new in town, finds Klára's walk, joins" framing leans back toward rewind. W2.2 must re-resolve.
- Open Q §10 explicitly anticipates this phase ("revises the narrative, not the resolved framing decisions"). §7 (marketplace-vs-community fork, credentialing moat) is not resolved here — V2 produces the concept-test instrument, per the Validation note.
- Punch-list overlap: **P69** (connection-roster symmetrization — partial) overlaps W2/W4.2; **P55** (stale localStorage masks new seeds) will affect testers seeing V2's new mock seeds; **P60** (Carer sub-spec badge) is a candidate mechanism for W2.1's walker-trainer framing. Adopt or note as each task opens.

---

## Workstream W1 — Narrative re-author

Produces the V2 spine. Everything else reads from it. Doc work only.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W1.1 | **Re-author `docs/strategy/Demo Narrative.md` as the V2 spine.** Replace the V1 four-beat outline with the 3-beat structure above: walker-trainer framing, the anchor event, per-beat persona + surfaces + payoffs + steps, and "what's cut" (Lena beat → closing screen). | `docs/strategy/Demo Narrative.md`, `po-briefing-2026-05-15.md` | done |
| W1.2 | **Map every payoff + feature to a beat + step.** Walk the 6 payoffs; confirm each has a concrete home in a step. Flag any feature that needs a surface that doesn't exist (feeds W5 / scope). | output of W1.1, `docs/features/demo-mode.md` | done |
| W1.3 | **Spec the three interstitial modes** — persona handoff, time-passage, feature explainer — and place each one in the 3-beat flow. Copy structure with examples; final copy is build-time. | `docs/features/demo-mode.md` (interstitial spec) | done |
| W1.4 | **Spec the pre-loaded-content mechanic.** How a "fire off" step presents staged content — composer pre-filled → tester taps Share; message pre-written in a thread; etc. Define the tester's role: 1–2 hero actions per beat, everything else staged. | output of W1.1 | done |

### W1.2 — Feature → step map + surface flags (verified 2026-05-18)

The 7 payoffs each have a concrete step home — see `docs/strategy/Demo Narrative.md` → "Payoffs → beats". Every interactive surface the walkthrough lands on, with build-readiness status (beats: B1 Daniel, B2 Klára, B3 Daniel):

| Surface / feature | Beat·step | Status |
|---|---|---|
| `/discover/meets` + "Meets from your circle" section | B1·1–2 | exists — **surfacing logic must count group co-membership** (V1 used Connected) → W3 / W4 |
| Free meet detail (Klára's walk) | B1·2–3, B2·3 | exists — new meet record, W4 |
| Free meet RSVP ("Going") | B1·4 | exists |
| `/bookings` carer-side list | B2·1 | exists |
| Config #2 drop-off Care booking + active session (Start / photo / note / Finish) | B2·1–2,4 | exists — W4.4 seeds the drop-off booking |
| Visit-report seal | B2·4 | exists |
| Post composer + Share | B2·5 | exists; **fire-off step kind** is walkthrough infra → W3.3 |
| Stromovka walk's People tab + Familiar marking | B3·1–2 | exists — Daniel acts via his Beat 1 RSVP (W4.3 retargeted this off the post-meet review — see Demo Narrative Beat 3) |
| Klára's profile → Services → book 1-on-1 (Appointment) | B3·4–5 | exists — **verify the capstone reads as a real conversion (Connected + Booking), not a stub** → W4.4 / W3.4 |
| `/notifications` + inline Accept on `connection_request` | B3·6–7 | exists (Guided Walkthrough Build) |
| Pre-written message + `group_invite` / `GroupInviteSheet` | B3·8 | exists (Guided Walkthrough Build) |
| Private group detail (Feed / Members tabs) | B3·8–9 | exists |
| Circle-scoped Carer offering visible **inside the group** | B3·10 | **possible missing surface** → W5.2 |
| Member-to-member booking flow | B3·10 | exists — same machinery as the capstone → W5.3 |
| Mid-beat interstitials (explainer ×3, time-passage ×1) | B2, B3 | walkthrough infra → W3.2 |
| Closing interstitial | close | walkthrough infra — re-author the hardcoded "four personas" copy → W3 |

**Genuine flags:** (1) a circle-scoped offering visible *inside* the group — W5.2's open call; (2) "Meets from your circle" must surface group co-membership, not just Connected — W3 / W4; (3) the capstone Appointment booking must read as a satisfying conversion — verify W3.4. Everything else is either built or a walkthrough-infra extension already scoped in W3.

---

## Workstream W2 — Persona & character sharpening

Reshape the cast for the V2 narrative. Mostly sharpening existing personas, not new people.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W2.1 | **Reframe Klára as an explicit walker-trainer hybrid** (per the PO briefing), not just "trainer." Audit profile hero, Services tab, group description, bio — does "walks *and* trains" read clearly? Adjust copy/data where it reads trainer-only. | `lib/mockUsers.ts:klara`, `lib/mockGroups.ts`, `po-briefing-2026-05-15.md` | done |
| W2.2 | **Daniel as the Holešovice/Bubeneč newcomer.** Align his neighbourhood to Klára's Stromovka walk + Magda's Holešovice group so "same neighbourhood as Magda" lands. Re-check the V1 "rewind vs after-picture" data concerns. | `lib/mockUsers.ts:daniel`, `lib/mockConnections.ts` | done |
| W2.3 | **Beat 2 drop-off client — pick + sharpen a side character.** The client who books Klára (drop-off Care) so their dog rides along on the walk. Use an existing supporting persona with a friendly, group-ready dog; sharpen them to read as a training client ("met Klára at one of these walks"). **→ Filip Novotný + Toby** (existing Klára client, Holešovice neighbour, group-member; Toby's a high-energy Jack Russell — gained a group-ready `socialisationNotes`). | `lib/mockUsers.ts`, `lib/mockBookings.ts` | done |
| W2.4 | **Magda as supporting character; Veronika as the circle-Carer.** Magda is no longer a POV persona — she's the neighbour Daniel marks Familiar + who sends the request + private-group invite. Confirm Holešovice Dog Block + Veronika's `publicProfile:false` Carer offering fit V2 Beat 3 (Daniel joins, books Veronika); reshape where needed. | `lib/mockUsers.ts` (magda, veronika), `lib/mockGroups.ts` (holesovice block) | done |
| W2.5 | **Photo needs.** Generate what's missing — pre-loaded post imagery + dedicated cast avatars. Plan drafted, photos generated by user, files wired into mock data. **Done.** | `public/images/generated/`, `lib/mockUsers.ts`, `lib/mockMeets.ts`, `lib/mockGroups.ts`, `lib/mockNotifications.ts`, `lib/mockConnections.ts` | done |

### W2.5 — Photo plan

5 photos generated + wired (the Holešovice group cover was optional — skipped, `evening-walk-group.jpeg` stays the cover): **`post-stromovka-walk.jpeg`** (Klára's walk post — already referenced by `mockPosts.ts` + the Beat 2 fire-off step), **`magda-profile.jpeg`** / **`veronika-profile.jpeg`** (dedicated avatars, repointed off the borrowed `lucie`/`marie` stand-ins), **`zofka-portrait.jpeg`** / **`kuba-portrait.jpeg`** (their dogs, off the `pepik`/`benny` stand-ins). Image-generation prompts archived to `docs/archive/image-prompts/demo-narrative-v2-photo-prompts.md` (reference only — e.g. to regenerate a photo).

---

## Workstream W3 — Walkthrough infrastructure

Extend the built walkthrough (don't rebuild it) to support the V2 structure.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W3.1 | **Re-author `lib/walkthroughBeats.ts`** — 3 beats (Daniel → Klára → Daniel, 2 personas), new step lists per W1. | `lib/walkthroughBeats.ts`, output of W1 | done |
| W3.2 | **Interstitial modes.** Extend `WalkthroughInterstitial` / the beat-step model to support **mid-beat** interstitials (time-passage + feature-explainer), not just the per-beat persona handoff. Decide the data shape (e.g. an interstitial-type step kind). | `components/walkthrough/WalkthroughInterstitial.tsx`, `contexts/WalkthroughContext.tsx` | done |
| W3.3 | **"Fire off pre-loaded content" step type.** A step kind that surfaces staged content and lets the tester send/share it with one tap (pre-filled composer → Share; pre-written message; etc.). | `lib/walkthroughBeats.ts`, `components/walkthrough/WalkthroughCard.tsx` | done |
| W3.4 | **Verify the 3-beat flow end to end** — start → 3 beats → closing → exit; pause/resume; the new interstitial modes; the fire-off steps. **`tsc --noEmit` clean ✓ across W1–W5 (2026-05-18). End-to-end flow verification = `demo-narrative-v2-walkthrough.md` Workstream A — instrument ready, walk pending.** | running app | todo |

---

## Workstream W4 — Pre-loaded content staging

Seed the staged assets the narrative fires off. Lean — only what the demo walks past.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W4.1 | **Klára's walk post** — pre-written caption + photo, staged so Beat 2's tester taps Share. **→ `post-klara-stromovka-walk`** (funnel-copy caption, `post-stromovka-walk.jpeg`). | `lib/mockPosts.ts` | done |
| W4.2 | **Magda's connection request + group invite** — pre-staged for Beat 3's accept step. **→** `notif-magda-connect-daniel` (reversed to Magda→Daniel) + `notif-ginvite-group-holesovice-block-daniel` (`group_invite` type). Delivered as notifications, not conversation messages. | `lib/mockNotifications.ts`, `lib/mockConnections.ts` | done |
| W4.3 | **State behind the time-passage interstitials.** Pre-seed whatever "a day passed → X is waiting" reveals, so the jump reads honest. **→** Magda's reach-out notifications dated today (`daysAgoIso(0)`); the drop-off session `kt-3` dated today. | `lib/mock*.ts`, `lib/mockDate.ts` | done |
| W4.4 | **Beat 2 drop-off care booking + Beat 3 meet→booking conversion.** **→** `booking-klara-toby` (config #2 drop-off, `dropoffMeetId: "meet-klara-stromovka"`, ongoing, session today) + `meet-klara-stromovka` (free public weekly walk linking `klara-walks`). Beat 3 capstone (Daniel books Klára's training) runs against `klara-1on1`. | `lib/mockBookings.ts`, `lib/mockMeets.ts` | done |

---

## Workstream W5 — Private-group mutual-care concept

The "closed circle where members care for each other" idea is new and needs careful, deliberate display. Its own workstream because it's the one place V2 may need real surface work.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W5.1 | **Explainer interstitial copy** — unpack it plainly: a private group is a closed circle of neighbours; inside it, members offer care to each other; not a marketplace of strangers. | output of W1.3 | done |
| W5.2 | **Surface a member's circle-scoped care offering inside the group.** Assessment: existing surfaces don't suffice (circle-Carer badge + profile Services tab both gate on Connection). **→ Built `components/groups/GroupNeighbourCare.tsx`** — a "Care from neighbours" section on the group's Members tab; group co-membership grants the visibility. | `components/groups/GroupNeighbourCare.tsx`, `app/communities/[id]/page.tsx` | done |
| W5.3 | **A member-to-member booking inside the private group** — Daniel (a new group member) books Veronika for a routine neighbourhood walk. → The "Care from neighbours" Book action opens `InquiryFormModal` — the same machinery as a marketplace Care booking. | `components/groups/GroupNeighbourCare.tsx`, `components/messaging/InquiryFormModal.tsx` | done |

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
- [ ] Strategic review — expand the trainer-positioning note in `Product Vision.md` (stubbed 2026-05-18) into a full positioning section; revisit the trainer-validation gate (`Open Questions` §7)

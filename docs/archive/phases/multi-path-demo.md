---
status: archived
last-reviewed: 2026-06-22
review-trigger: When any task is completed or blocked
---

# Multi-Path Demo — Three Community Worlds

**Goal:** Three tight, single-thesis guided walkthroughs over one shared world — **W1 new owner→community**, **W2 trainer/walker→community+living**, **W3 shelter→adopted (demand-side)** — each doubling as a one-audience interview artifact ("the guided demo IS the interview"), launched from a restructured front door with distinct journey doors and powered by a named-walkthrough registry.

**Depends on:** The shipped V2 guided-walkthrough infra (`lib/walkthroughBeats.ts`, `WalkthroughContext`, interstitial + on-surface step card), the shipped Adoption-Curious Arc content, and the mentor-network shelter-demo beat script.

**Arc:** Phase 1 of a two-phase validation arc. **Phase 2 = "The Shelter's Side"** (operator/handover POV + feasibility interview kit; graduates a slice of FC16). See ROADMAP → What's Next.

**Refs:** [[Future Considerations]] FC17 · [[features/demo-mode]] (guided-walkthrough spec) · [[strategy/Demo Narrative]] (V2 spine + Adoption-Curious Arc) · [[strategy/mentor-network-shelter-demo]] (beat script to convert) · [[strategy/Doggo_Positioning_and_Three_Worlds]] (the Three Worlds) · [[strategy/Competitive Research - Prague Snapshot (2026-06 refresh)]]

---

## Open notes (phase-specific only)

> Canonical opening process: `CONTRIBUTING.md` → "Opening a Phase." Ran 2026-06-22 — board + refs read; OQ log reviewed + 3 new questions migrated (give-back §6, shelter binding-constraint §14, name/trademark §19; HCMC second-market explicitly dropped per PO); stale-doc check clean (all refs ≤10 days); punch-list scanned (P82 design-system code-health is orthogonal — no overlap).

**Scope call — 3 vs 4 paths (the central open audit, resolved 2026-06-22).** FC17 documented FOUR feature-axis paths (`trainer-walker` / `neighbour-care` / `shelter-mentor` / `adoption-curious`); PO framing is THREE audience Worlds. Resolved to **three community Worlds**, mapping all four FC17 paths:
- `trainer-walker` (Daniel half) **+ `neighbour-care`** → **W1 new owner** (neighbour-care absorbs as "a neighbour to lean on").
- `trainer-walker` (Klára half) → **W2 trainer**.
- `shelter-mentor` **+ `adoption-curious`** → **W3 shelter, demand-side**.

**Scope call — the real "fourth" is the shelter operator view (resolved 2026-06-22).** A shelter coordinator watching W3 sees the demand side through community members' eyes but never their *own* side ("what do I do / how little work + risk"). That operator POV exists nowhere as a walkthrough (faked toggles only; full build = FC16). PO direction: build it out properly for buy-in — but it's net-new, deep, and may span phases. **Deferred to Phase 2** ("The Shelter's Side") so Phase 1 stays the community-facing, mostly-packaging phase. Phase 1's W3 is **demand-side only.**

**Scope call — depth posture (resolved 2026-06-22).** "Wrap, don't redesign" is NOT a hard cap; keep redesigns minimal *unless new findings call for more*. Phase 1's two genuine redesigns are the **launcher journey doors** and the **named-walkthrough registry**; the three paths are mostly re-cut/wrapped from existing beats.

**Governing interview principle.** **Desirability before feasibility** — the demo paints an appealing, clear picture first; the hard feasibility questions (insurance, liability, the binding-constraint) come after, in conversation. Each path embeds *assumption-probe checkpoints* (desirability-side); the feasibility-question kit ships in Phase 2 with the shelter work.

---

## Workstream A — Walkthrough registry + infra generalization

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Generalize `lib/walkthroughBeats.ts` from a single beat list to a **named registry** (`id → { displayName, thesis, interviewee, closing, beats }`); generalize `WalkthroughContext` sequencer to load + run a walkthrough by id. | [[features/demo-mode]] | done |
| A2 | Per-path **pre-staged state** — step-fired state transitions so a guided run advances mid-world without hand-driving toggles. Shipped the load-bearing case: `fireWalkerVouch` on the `shelter` time-passage interstitial fast-forwards Eliška to mentor-vouched (verified → unlocks "Walk Nora"). W1/W2 start clean from the canonical seed (no mid-arc staging needed); the adoption capstone stays tester-driven by design (it's the climax). | [[features/demo-mode]] (Hidden-affordance pattern) | done |
| A3 | Generalize `strategy/Demo Narrative.md` framing from "the walkthrough" to **named walkthroughs**; record the 3-World registry + the FC17 four→three mapping. | [[strategy/Demo Narrative]] | done |

---

## Workstream B — Launcher restructure (`/`)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | The `/` launcher gets **distinct journey doors** (one per path) instead of a single "Start the walkthrough" CTA; reshuffle the cast-card half around them. Each door names its audience. | [[features/demo-mode]] (Switcher surfaces §2) | done |

---

## Workstream C — W1 New owner (find your community)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Re-cut the V2 Daniel beats into the **W1 registry entry** (new-owner thesis), **absorbing the neighbour-care beats** (Magda Familiar → connect → Holešovice block group → book Veronika) as the "neighbour to lean on" half. Dropped Klára's operational beat (→ W2); two consecutive Daniel beats now read as a time-passage continuation. | [[strategy/Demo Narrative]] (Beats 1 & 3) | done |
| C2 | W1 interstitial/step copy + **interviewee framing + assumption-probe checkpoints**. *Framing (displayName/blurb/thesis/interviewee/closing) + continuation copy done; in-demo probe checkpoints deferred to the cross-path checkpoint pattern (with E).* | [[strategy/Doggo_Positioning_and_Three_Worlds]] (World 1) | in_progress |

---

## Workstream D — W2 Trainer (build community, and a living)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Re-cut the **Klára-POV beats** into the W2 registry entry (the walk-is-the-business thesis). Shipped as a single beat (run the linked-care session → seal report → share lead-gen post). The **meet→booking conversion from Klára's side** is deferred (needs a pre-staged incoming inquiry — A2); the closing carries it as the payoff line. See walkthrough O1. | [[strategy/Demo Narrative]] (Beat 2) | done |
| D2 | W2 copy + probes (run a free walk as lead-gen?; meet→booking match reality?; credentialing valuable vs bureaucratic?; mentor-for-pay / A5). *Framing + copy done; in-demo probe checkpoints deferred to the checkpoint pattern (with E).* | [[strategy/Doggo_Positioning_and_Three_Worlds]] (World 2), [[strategy/mentor-network-shelter-demo]] (A5) | in_progress |

---

## Workstream E — W3 Shelter, demand-side (get dogs adopted)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Mentor mechanism (intake-filtered → mentored → vouched). **Decision:** folded into Eliška's spine (Beats 2–3) rather than wrapping Tomáš's separate arc — same mechanism, second persona = redundant. Tomáš stays Open-View + Phase-2 operator/interview material. | [[strategy/mentor-network-shelter-demo]] | done |
| E2 | Wrap the **Adoption-Curious Arc** (Eliška/Nora: vouched walker → walk recap → advocacy loop → network adopts) in guided UI (Beats 4–6 of the `shelter` walkthrough). | [[strategy/Demo Narrative]] (Adoption-Curious Arc) | done |
| E3 | Single `shelter` walkthrough weaving mechanism → advocacy → adoption on one POV (Eliška, 6 beats). Built + structurally verified (door, handoff, Beat-1 nav). Modal/demo-toggle steps + assumption checkpoints to drive in review. | [[strategy/mentor-network-shelter-demo]] (crosswalk) | done |

---

## Workstream F — Cross-path framing + polish

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Capture the **demo-IS-interview framing** per path. Done via the registry (`interviewee` + `thesis` per walkthrough) + the Demo Narrative "three guided walkthroughs" table + the in-demo **probe checkpoints** (O5 — new `probe` interstitial mode, "For the room" accent). Shelter ×2 (A1/A8, A9), trainer ×1 (A5). | [[strategy/Demo Narrative]] | done |
| F2 | **Shared-world overlap** — satisfied by the shared-world design rather than extra build: Klára is the trainer (W2) AND Eliška's mentor (W3); Stromovka anchors W1+W2; the trainer probe references taking on mentees (the W3 role). Convergence is visible, not walled. | [[strategy/Doggo_Positioning_and_Three_Worlds]] | done |
| F3 | Per-path **closing screens** — each walkthrough carries its own `closing` (registry), wired to the closing interstitial; verified rendering per-path. | [[features/demo-mode]] (closing interstitial) | done |

---

## Workstream G — Group shelter walk (FC18 demo slice)

> **Scope expansion (PO call, 2026-06-22).** FC18 graduated INTO this phase rather than a separate phase — it's tightly coupled to W3 (the shelter walkthrough's core flow). Build the demo-facing slice so "sign up to walk a shelter dog on a trainer-led group walk" is REAL, not narrated. **Boundary — faked/narrated (FC18 deferred to shelter interviews):** physical multi-dog checkout/release logistics, mentor-as-responsible-party / liability, group-context waiver specifics.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| G1 | **Meet-side shelter-dog sign-up.** New `GroupWalkSignupSheet` (on `ShelterWalkPanel`): a walker signs up to walk a shelter dog → creates a shelter-walk `Booking` linked to the meet via `Booking.dropoffMeetId`. **Verified:** Eliška → Nora → booking `{pets:[Nora], ownerKind:shelter, dropoffMeetId, subService:"Mentored first walk"}`. | [[Future Considerations]] FC18, [[Groups & Care Model]] (config #2) | done |
| G2 | **Two-tier sign-up.** Panel CTA varies by tier (vouched: "Walk a dog on this walk"; newcomer: "Walk one with a mentor"). Newcomer sign-up = **mentored first walk** + `beginMentorship` toward a vouch. **Verified.** | FC18, [[strategy/mentor-network-shelter-demo]] | done |
| G3 | **Capture.** The meet-linked shelter-walk booking rides the existing session → Start → Finish → Visit Report → `?finished=1` recap rails (same shape as solo shelter walks). Full start→finish→recap on a group-walk booking to confirm in walkthrough review (V4). | FC18 | done |
| G4 | **Mentor-as-discovery-bridge.** Closes the Beat 1→2 "how does the user find the group walk" gap *without* a shelter event listing (anti-scoreboard). New `getMentorGroupWalks(mentorId, shelterId)` in `lib/mockMeets.ts`. `MentorListSheet` row shows a violet **"Runs group walks"** line for mentors who host one. `MentorSessionBookingSheet` **features the mentor's group walks at top** (tap → routes to the meet's sign-up), with the 1-on-1 demoted under an "Or book a private 1-on-1 walk" divider. Walk Nora → Walk with a mentor → Klára → her Saturday group walk. **Verified end-to-end** (Eliška) + walkthrough Beat 1 re-routed through the mentor (no teleport). *(The "features → routes to the meet" sheet behavior here was superseded by G6 — the group walk now completes in-sheet; the "Runs group walks" mentor-list line stands.)* | FC18 | done |
| G5 | **Re-authored the `shelter` walkthrough** to a tighter 5-beat arc centered on the group walk: (1) Find Nora + see the options, (2) **sign up for the mentored group walk** (FC18 hero), (3) the walk + recap + "a few walks later, vouched" (keeps A2), (4) recap reaches network, (5) Nora adopted. Old "book a 1-on-1 mentor" + "walk solo" beats collapsed into the group-walk flow. Structurally verified (5 beats, handoff); full drive = V4 review. | [[strategy/Demo Narrative]] | done |
| G6 | **Unified two-step mentored-walk sheet (PO rework 2026-06-23).** `MentorSessionBookingSheet` rebuilt: **Step 1** waivers + shared progress tracker (frames *both* paths), **Step 2** explicit choice between Klára's **group walk** (dog pre-set; completes **in-sheet**, optional "View the walk" link) and a **1-on-1** (date/time). Both feed one vouch tracker (`committedSessions` counts mentored group walks too); 1-on-1 inherits the dog. Extracted `lib/groupWalkBooking.ts` shared by both sign-up surfaces. Beat 1→2 re-authored to sign up in-sheet (no meet-page bounce; open sheet survives the handoff). **Verified end-to-end** (both paths + live walkthrough). | FC18 | done |
| G7 | **Mentored first walk is a PAID mentor session (PO correction 2026-06-23).** "Free" was wrong on the group option: the choice is *how the mentored session runs*, and the trainer is paid her fee either way (group format just lets several mentees pay at once). A mentored (un-vouched) group walk now carries the host's per-session fee — same price as the 1-on-1 — via `buildGroupWalkBookingInput`'s new `mentorFee`; a vouched walker's plain group walk stays free. Fee surfaced in both sign-up sheets; `priceLabel`/`perSessionPrice` (BookingRow + booking detail) now show "Volunteer · no charge" only when `price.total === 0`, so the paid mentored walk reads "450 Kč / session" on the Volunteering tab. **Verified** (both sheets + Volunteering tab). | FC18 | done |
| G8 | **Booking surfaces the mentor + group walk (PO note 2026-06-23).** The booking squeezes a 3-party arrangement (shelter owns Nora, walker walks, trainer mentors + is paid) into owner/carer, so Klára went unnamed. Both are now derived from `dropoffMeetId` (→ meet → its creator is the host): the **card** adds a "with Klára · Saturday morning group walk" context line under the service; the **detail Info tab** adds two tappable rows — "Klára Horáčková · Your mentor" (→ profile) and "Saturday morning group walk · Group walk" (→ meet). New `getMeetById` in `lib/mockMeets.ts`. Mentor name resolved full via `getUserById` (the meet stores a short `creatorName`). **Verified** (card + detail). *Deeper modeling of the mentor as a first-class booking party deferred — derived-from-meet is the demo-scope answer.* | FC18 | done |
| G9 | **`shelter` walkthrough tightened to a 4-beat desirability cut (PO task 2026-06-24).** Was following the 8-beat live-interview script too literally: too long + instructed **unbuilt actions** (walk session start/finish — a real broken step — and operator actions). Re-authored: (1) the discovery (Discover → Help a Dog → Nora — how a walker finds the shelter's dogs; the original front kept), (2) a new walker gets in safely (mentored first walk; waiver/pricing/session detail dropped), (3) interstitial "what happens on your end" (vouch + shelter-did-nothing/veto/documented; described-not-shown), (4) the shelter's payoff (wall fills with walk posts → adoption interest as an interstitial). The shelter-side turn happens AFTER the signup, not the front. Removed the walk-session beat + the tester-driven adoption capstone + both per-beat probes. **Soft close** = registry `closing` screen ("If you run a shelter, this part's for you" + 3 light questions). Session execution / operator side / adoption-interest landing are **Phase 2 (The Shelter's Side)** — interstitialled, not built. `strategy/mentor-network-shelter-demo.md` untouched (Phase-2 source). **Verified end-to-end** via the live walkthrough. | [[strategy/mentor-network-shelter-demo]] | done |

---

## Acceptance Criteria

- [x] The `/` launcher presents three distinct journey doors; each launches its own guided walkthrough. *(verified)*
- [x] A named-walkthrough registry drives all three paths; adding/selecting a walkthrough is id-based (no single hardcoded beat list). *(verified)*
- [~] **W1** (new-owner) — built + driven programmatically; **PO drive-through deferred → verification-checklist V14** (early close).
- [~] **W2** (trainer) — built + driven programmatically; **PO drive-through deferred → verification-checklist V15** (early close).
- [~] **W3** (shelter) — built + verified live as the **tightened 4-beat desirability cut**; copy/story intentionally **left for Phase 2 revision** (Phase 2 builds the shelter's side against this path). Probes removed from the guided flow (the A1–A10 kit is Phase 2).
- [x] Each path starts from correct pre-staged state without manual toggle-driving. *(W1/W2 clean seed; W3 vouch fired by A2 — verified)*
- [x] Paths share one world; overlap reads as intentional convergence, not contradiction. *(Klára trainer↔mentor; shared Stromovka/Útulek)*

---

## Close notes (phase-specific only)

> Canonical close process: `CONTRIBUTING.md` → "Closing a Phase." List below only phase-specific close items.

- **Feature docs likely touched:** `features/demo-mode.md` (registry, launcher doors, per-path staging), `strategy/Demo Narrative.md` (named walkthroughs).
- **Outward-facing artifacts to graduate:** a demo-interview reference (F1), if it lands as its own doc.
- **Future Considerations to update:** mark FC17 promoted/closed; note FC16's Phase-2 graduation.
- **Sets up Phase 2** ("The Shelter's Side") — W3's demand-side + the registry/launcher are its foundation.

**Closed 2026-06-24 (early, per PO).** The phase shipped its thesis (named-walkthrough registry + multi-door launcher + three single-thesis walkthroughs + the FC18 group-walk sign-up). The collaborative walkthrough did **not** fully pass — a deliberate early close so Phase 2 (which builds the shelter's side and revises this path) can start: W1/W2 PO drive-throughs carried to `planning/verification-checklist.md` (V14/V15); the shelter path's copy/story carried into Phase 2 as an explicit input. All 26 decision-log entries in the walkthrough were propagated to their home docs (demo-mode, shelters, Demo Narrative, Groups & Care, explore-and-care, design-system, landing-page, meets, Future Considerations, CLAUDE.md, Open Questions, ROADMAP). Structural audit clean; no newly-completed punch-list items to propagate.

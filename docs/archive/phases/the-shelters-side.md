---
status: archived
last-reviewed: 2026-06-28
review-trigger: When any task is completed or blocked
---

# The Shelter's Side — operator experience + feasibility kit

**Goal:** Make the shelter's *own* (operator) view real enough to **show and to interview against** — the other half of the shelter pitch. Phase 1 built the demand side (walker discovers → mentored first walk → the shelter's payoff) but only *narrated* the shelter's side. This phase builds illustrative operator surfaces — chiefly the **handover** (check-out → back-safe check-in, logged) — plus a feasibility interview kit, and revises the shelter walkthrough's deferred back half against the real surfaces.

**Depends on:** Phase 1 (Multi-Path Demo, archived) — the `shelter` walkthrough (Eliška, 4-beat desirability cut), the named-walkthrough registry, the FC18 group-walk sign-up, and the demo state-toggle / `?admin=1` operator gate are this phase's foundation.

**Arc:** Phase 2 of the two-phase validation arc. Phase 1 = the three community Worlds (demand side). Phase 2 = the shelter operator side. After this: **Validation → Build decision** (run the paths as interviews, then decide whether/how to build for real).

**Refs:** [[Future Considerations]] FC16 (the graduating operator-surface scope) · FC18 (group-walk checkout tension) · [[strategy/mentor-network-shelter-demo]] (the 8-beat live-interview script + A1–A10 crosswalk — the Phase-2 source) · [[features/shelters]] (operator-side stub + "Group shelter walk (FC18)") · [[strategy/Doggo_Positioning_and_Three_Worlds]] (§3 The shelter + the four axes + the Appendix interview questions) · [[planning/Open Questions & Assumptions Log]] (§14 binding-constraint + FC18-tension-2 + §5 + §6) · [[strategy/Demo Narrative]] (the `shelter` walkthrough back half to revise)

---

## Open notes (phase-specific only)

> Canonical opening process: `CONTRIBUTING.md` → "Opening a Phase." Ran 2026-06-24 — board + refs read; conflict audit clean (positioning §3's four axes + "a human always releases/receives the dog during staff hours" is the design anchor for the handover, no contradiction with shipped code); stale-doc check clean (all refs ≤12 days, mentor-network-shelter-demo oldest at 2026-06-12); punch-list scanned (P82 design-system code-health + P81 recap copy are orthogonal — no overlap); OQ §14 / FC18-tension / §5 / §6 reviewed (they are this phase's feasibility-kit fodder).

**Code audit — verify-don't-rebuild baseline (2026-06-24).**
- **Already there (verify + bring to illustrative parity, don't rebuild):** the `?admin=1` Members-tab operator gate + "Operator view (demo)" banner; demo state-toggles (promote/demote, credit walks, remove-from-walkers, advance-state, log-walk, complete-mentor-session); `WalkerApplicationsContext` (full `applied→invited→vouched` machine + `tierOverrides` + `creditWalks` + mentor path); adoption stages (`useAdoptionStore` — `interested|pending|adopted`); seeded rosters (`lib/mockShelters.ts` — Útulek full, Pes v nouzi + Druhá šance thin).
- **Genuinely missing (the main build):** **no check-out / back-safe check-in / release concept exists anywhere.** Shelter-walk `Booking`s carry `checkedInAt` + `report.completedAt` (the walker's session rails) but no shelter-side *release* or *back-safe return*. This is the heavy net-new surface (WS-B).
- **No discoverable operator entry** — `?admin=1` is the only operator affordance; there is no shelter-operator entry in the persona switcher (WS-A).

**Scope call — sequencing (decided at open, PO 2026-06-24): illustrative now, then interview.** Build operator surfaces as illustrative in-app examples (real product chrome, representative seeded content, behind the operator gate) — enough to show a shelter "here's how little work this is" and provoke a real reaction, NOT a fully-wired state machine. Scaffolding carries into a real build later. Do NOT over-build before interviews tell us which surfaces matter. This resolves the "interview-informed-build vs build-then-interview" question raised in the kickoff: it's neither pure thin-stub-first nor build-deep-first — build the *illustrative middle*, interview, then build deep.

**Scope call — operator entry (PO 2026-06-24): add a shelter-operator entry to the switcher; trim the roster.** The viewer enters the shelter's own POV from the demo switcher (most legible for the "here's your side" pitch). A shelter is not a `UserProfile`, so this is real persona-layer plumbing (an institutional "operator" entry, not a user persona). PO also flagged the switcher has too many personas — audit + drop the easy ones (surface the cut list for ratification; don't cut blind). See WS-A.

**Scope call — handover shape (decided at open, agent recommendation, PO deferred to it): dedicated operator handover board, booking-backed.** The hero surface is a shelter-side "today's walks" board (dogs out / due back; check-out (release) → back-safe check-in; logged), because the phase's pitch is "look how little work this is" and a single glanceable board sells that. The per-walk check-out/check-in record rides the existing shelter-walk `Booking` as the data substrate (the audit trail). The board is also where **N dogs get released at once for a group walk** — the live FC18 checkout question — **designed as a proposal shelters react to, not a committed model** (mentor-as-responsible-party is one option to show, not assert). See WS-B.

---

## Workstream A — Operator entry + persona roster

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Add a **shelter-operator entry to the demo switcher** ("Útulek — operator" or similar) that drops the viewer into the shelter's own POV (operator view ON). A shelter isn't a `UserProfile`, so model the institutional operator entry in the persona/demo layer (not a user persona slot). Reuse / consolidate the existing `?admin=1` gate as the underlying flag the operator entry sets; keep `?admin=1` as an escape hatch. | [[features/demo-mode]] (Switcher surfaces), [[features/shelters]] (operator-view gate) | done |
| A2 | **Operator-view shell coherence.** When in operator POV, the shelter page's operator affordances are always-on (not URL-gated) and read as a coherent "your side" view, not scattered demo toggles — the connective tissue tying WS-B/WS-C surfaces together ("what do I do today"). Keep illustrative: make existing tabs operator-aware + add the handover board; do NOT build a net-new dashboard route unless the shell demands it. | [[features/shelters]] (page chrome) | done |
| A3 | **Persona-roster audit + trim.** List every switcher persona, mark which are referenced by a shipped walkthrough / highlight reel, and **drop the clearly-unreferenced ones now** (surface the cut list in the walkthrough's "Open for your call" for ratification before deleting; default to keeping anything a walkthrough touches). Add the operator entry from A1. | [[features/demo-mode]] (personas + highlight reels) | done |

---

## Workstream B — Handover (the main build)

> The heaviest + genuinely-missing surface. Design it as a **proposal shelters react to**, not a committed model — esp. the group-walk N-at-once release and the mentor-as-responsible-party question (Open Q FC18-tension-2). Anchored on the positioning §3 four axes: **visibility / accountability / competence / control.**

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | **Operator handover board ("today's walks").** A shelter-side surface: dogs out now / due back / not yet collected, each row a walker + dog + time. The glanceable "how little work this is" hero. Representative seeded content (a realistic day at Útulek). | [[strategy/Doggo_Positioning_and_Three_Worlds]] (§3 axes), [[features/shelters]] | done |
| B2 | **Check-out (release) → back-safe check-in, logged.** Operator confirms a dog released to a walker (check-out), then confirms it back safe on return (check-in). The record rides the existing shelter-walk `Booking` (new check-out/check-in fields on the session/booking, parallel to `checkedInAt`/`completedAt`) so the audit trail lives where the walk already lives. Surfaces the accountability axis (logged check-out/check-in trail). | [[features/shelters]] (the walk is a Booking), [[planning/Open Questions & Assumptions Log]] §14 | done |
| B3 | **Group-walk multi-dog release (the FC18 checkout question).** Releasing N shelter dogs to one group walk at once, from the board. Build it as a **proposal** — show one plausible model (e.g. mentor-as-responsible-party signs out the batch) clearly framed as "here's how we'd handle this — does this fit?", not as a settled flow. Ties the handover board to the FC18 group-walk `Booking`s (`dropoffMeetId`). | [[Future Considerations]] FC18, [[planning/Open Questions & Assumptions Log]] (FC18-tension-2), [[features/shelters]] (Group shelter walk) | done |
| B4 | **The other three axes, lightly.** Surface visibility (the walker's check-ins/photos/"back safe" confirmation visible to the operator), competence (eligibility/vouch/tier already gates who can book which dog — confirm it reads on the operator side), control (the operator can revoke a walker / flag a dog — verify the existing kebab controls express this). Illustrative parity, not new machinery. | [[strategy/Doggo_Positioning_and_Three_Worlds]] (§3 four axes) | done |

---

## Workstream C — Existing operator surfaces: verify + illustrative parity

> Believed mostly there already — VERIFY each works end-to-end and bring to illustrative parity (real chrome + representative seeded content); do NOT rebuild what exists.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | **Vouch / application landing.** Verify the `applied→invited→vouched` flow + per-shelter waiver + mentor-vouched path render as a coherent operator-side **application queue** (incoming applicant + message + mentor-recommendation line + approve/advance). Bring the demo state-toggle to illustrative parity (reads like a real queue, not a lone dropdown). | [[features/shelters]] (mentor network), `WalkerApplicationsContext` | done |
| C2 | **Walker pool view.** Verify the Members tab + `tierOverrides` promote/demote + credit-walks + remove read as a coherent operator **walker-pool management** surface with representative seeded depth. Confirm the demotion-revokes-Super-Volunteer cascade is legible. | [[features/shelters]] (Volunteer badge, tier overrides), [[implementation/badges]] | done |
| C3 | **Adoption-interest landing.** Build the missing shelter-side view of **who's interested in which dog** (today `useAdoptionStore` stages exist but no operator surface lists them). Illustrative: a list of dogs with interest + stage (`interested`/`pending`/`adopted`) + the advocacy-loop hook (interest came from a walk recap). | [[features/shelters]] (Adoption funnel), `useAdoptionStore` | done |

---

## Workstream D — Shelter walkthrough: revise the deferred back half + settle copy/story

> Phase 1 closed the `shelter` walkthrough as a 4-beat desirability cut whose back half **narrated** the operator side ("what happens on your end" interstitial) and **left the shelter copy/story explicitly unsettled for revision here.** Now make the narration real demonstration where it earns it — and keep the demo question-light (the soft-close keeps three questions; do NOT re-add per-beat probes — those live in the interview kit).

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Revise **Beats 3–4** of the `shelter` walkthrough so the "what happens on your end" narration becomes **demonstration** of the WS-B/WS-C operator surfaces where it earns it (the handover, the application landing, the payoff). Some beats may switch into the operator POV (WS-A entry). | [[strategy/Demo Narrative]] (Adoption-Curious Arc / shelter back half), `lib/walkthroughBeats.ts` | done |
| D2 | **Settle the shelter copy/story** Phase 1 left open — the shelter-side narrative voice across the walkthrough + the soft-close screen (keep its three light questions). | [[strategy/Demo Narrative]], [[strategy/Doggo_Positioning_and_Three_Worlds]] (§3) | done |

---

## Workstream E — Feasibility / interview kit (a doc WE drive, NOT in the demo)

> Desirability-first: the demo paints the picture; the hard feasibility questions live in a doc we read **during** interviews, not baked into the demo. Built on [[strategy/mentor-network-shelter-demo]] (the 8-beat script + A1–A10 crosswalk).

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Author the **feasibility interview kit** doc. Contents: **(1) the pain-point ladder** — (a) what limits getting your dogs out / adopted? (b) walk us through what's painful about your volunteers today [rank the pain-point map] (c) if your top pains were solved, would you take more volunteers — and would that move (a)? (d) would you accept a trusted volunteer's vouch in place of your own intake? **(2) the volunteer pain-point map to rank** — vetting/onboarding staff time · trust & liability · skill mismatch · reliability/churn · coordination overhead · documentation/accountability · supervision capacity · volunteer motivation/impact · physical checkout/release. **(3) per-example discussion prompts** — for each operator surface this phase builds, "here's how we'd handle X — does this fit how you actually do it?" | [[strategy/mentor-network-shelter-demo]] (A1–A10 crosswalk), [[strategy/Doggo_Positioning_and_Three_Worlds]] (Appendix interview questions), [[planning/Open Questions & Assumptions Log]] §14/§5/§6 | done |
| E2 | **Reframe Open Q §14's binding-constraint entry to the pain-point ladder** — the applicants-vs-vetting-cost binary becomes the fuller ladder (which subsumes it). Point the entry at the kit doc. | [[planning/Open Questions & Assumptions Log]] §14 | done |

---

## Acceptance Criteria

- [ ] A demo viewer enters the shelter's own (operator) POV from the switcher and lands on a coherent operator view (not scattered demo toggles).
- [ ] **Handover:** an operator can check a dog OUT (release) to a walker and confirm BACK-SAFE check-in, logged on the walk record; the group walk releases N dogs at once — presented as a proposal, not a committed model.
- [ ] The operator surfaces (handover board, application/vouch landing, walker pool, adoption-interest landing) read as a coherent **illustrative** operator view with representative seeded content — no visibly-broken stubs.
- [ ] The `shelter` walkthrough's back half **demonstrates** the real operator surfaces where it earns it (narration → shown); the shelter copy/story is settled; the soft-close keeps three light questions (no per-beat probes).
- [ ] The **feasibility interview kit** exists as a doc (pain-point ladder + volunteer pain-point map + per-surface discussion prompts); Open Q §14 is reframed to the pain-point ladder.
- [ ] Persona roster audited; operator entry added; clearly-unreferenced personas dropped (cut list ratified).
- [ ] A defined slice of **FC16** is marked graduated (the surfaces this phase built); the rest stays faked/future.

---

## Close notes (phase-specific only)

> Canonical close process: `CONTRIBUTING.md` → "Closing a Phase." List below only phase-specific close items.

- **Feature docs likely touched:** `features/shelters.md` (operator surfaces — handover, application landing, walker pool, adoption-interest landing; operator-view shell), `features/demo-mode.md` (operator entry + persona-roster trim).
- **Outward-facing artifacts to graduate:** the **feasibility interview kit** (E1) → `strategy/` (an ongoing-use interview artifact, like the mentor-network demo doc graduated).
- **Future Considerations:** mark the graduated **FC16** slice (this phase's operator surfaces); the rest stays.
- **Open Questions:** §14 reframed to the pain-point ladder (E2); resolve/advance FC18-tension-2 (checkout model) with whatever the handover proposal settles vs leaves for interviews; note §5 (safety/liability) + §6 (give-back) remain interview-gated.
- **Sets up:** the **Validation → Build decision** phase (run all three paths as interviews using the kit; decide whether/how to build for real).
- **Carried-in verification debt (not this phase):** `planning/verification-checklist.md` V14/V15 (Phase-1 W1/W2 PO drive-throughs).

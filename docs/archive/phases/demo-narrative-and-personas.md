---
status: archived
last-reviewed: 2026-05-18
review-trigger: When any task is completed or blocked
---

# Demo Narrative & Personas

**Goal:** A documented narrative + a persona roster v2 + the mock-world data those personas require — all ready for a follow-on phase to build the walkthrough infrastructure against.

**What this phase is:** decisions, research, and persona/data labor.
**What this phase is not:** the walkthrough infrastructure build, walkthrough copy authoring, marketing-style landing polish, or user-testing protocol design — all explicitly deferred.

**Two-mode demo (already decided, not re-debated):**
- **Open View** — free exploration. Tester switches between personas on their own. This is today's persona picker + app behavior; no new infrastructure.
- **Guided Walkthrough** — auto-switching between personas at scripted points. Full-screen interstitial between switches names the new persona, sets context, and tells the tester what to look at or try. Linear progression.

**Threaded narrative thesis (already decided):** centered on a single anchor event with offshoots into different persona POVs. NOT a literal day-in-the-life (forces synchronicity that doesn't exist) and NOT independent vignettes (loses the "one community, multiple views" feel). The anchor event roots the demo; offshoots let each persona showcase their distinct feature loop.

**Replaces:** Demo Presentation phase (retired 2026-05-14, archived to `docs/archive/phases/demo-presentation.md`). The shipped guest-viewer / AuthGate / `?guest=1` infrastructure remains in production; the Tereza-only `TourOverlay` is prior art, not the model this phase designs against.

**Depends on:**
- Persona & Demo Mode Wiring (closed 2026-04-26) — `useCurrentUser()`, `?as=` URL param, persona registry
- Mock World Building (closed 2026-05-02) + per-persona content updates from every subsequent phase
- Cross-Cutting Flow Testing (closed 2026-05-14) — Marketplace Owner persona precedent + per-persona seeding decisions

**Refs:**
- [[strategy/User Archetypes]] — current archetype enumeration + Marketplace Owner addition from CCFT
- [[strategy/Product Vision]] → Navigation Structure + Schedule + Discover IA
- [[strategy/Cold-Start Playbook]] — archetype hints, market realities
- [[strategy/Competitive Research - Fluv]] + [[strategy/Competitive Research - Time To Pet]] — competitor archetype patterns + demo-flow conventions
- [[implementation/mock-data-plan]] — current data conventions; W3 adds a new section
- [[features/demo-mode]] — current persona-switching plumbing
- [[strategy/Open Questions & Assumptions Log]] §10 (this phase resolves both open items)
- `phases/punch-list.md` → P69 (connection-roster symmetrization), P59 (notification seed enrichment for non-Shawn personas)
- `archive/phases/cross-cutting-flow-testing.md` + walkthrough — the drift evidence + Marketplace Owner addition + Decisions log conventions
- `archive/phases/demo-presentation.md` — what was there and what got retired

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs (User Archetypes, Product Vision nav, Cold-Start Playbook, Fluv + TTP research, mock-data-plan, demo-mode, CCFT archive + walkthrough, retired Demo Presentation board, punch-list P59 + P69, Open Questions §10)
- [x] Review Open Questions log — §10 (Demo & Presentation) both items resolve at this phase's close (hybrid: Open View + Guided Walkthrough; persona-led with scenario framing). §1 ("aha moment") is W1-adjacent but not blocking. §11 P59 (notification seed enrichment) is adopted into W3.4
- [x] Audit for conflicts between phase plan and current codebase — current persona registry is 6 (Tereza/Daniel/Klára/Tomáš/Lena/New User); W2 will push it to 8–9, requiring `lib/personas.ts` + `docs/features/demo-mode.md` updates. Existing `TourOverlay` is single-persona; the new full-screen interstitial model is distinct and does not reuse it. No code conflicts with active Service ↔ Meet Linkage phase (different surface area)
- [x] Update referenced docs with `last-reviewed` older than 2 weeks — all in scope are within the window; no bumps required at open
- [x] Scan Punch List for overlap — P69 explicitly in W3.2; P59 adopted into W3.4. Other open items (P67 component consolidation, P63 status pill, P64 training Appointment seeding) are out of scope
- [x] Confirm scope — workstreams W1–W4 match the phase brief. Build, copy authoring, landing polish, user-testing protocol all deferred

---

## Workstreams

Each workstream's table is **decision items + concrete deliverables**, not strategy prose. Strategy lives in the docs each task references or produces. Emergent decisions during workstream discussion go in the walkthrough's "Decisions surfaced" log.

### Workstream W1 — Anchor event + thread structure

The narrative spine. Picks the anchor event, identifies the persona POVs that thread off it, decides the time/place rules, and produces the narrative outline doc the rest of the phase reads from.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W1.1 | **Pick the anchor event.** Likely a Saturday morning meet in a real Prague neighbourhood, but not assumed. Decide: which neighbourhood, which group, which meet (one-off vs recurring occurrence), which week relative to mock "today." Lean toward an event that already exists in mock data so W3 doesn't have to invent it. | `lib/mockMeets.ts`, `lib/mockGroups.ts`, `docs/strategy/Product Vision.md` ("Three Ways In") | done |
| W1.2 | **Enumerate persona POVs threading off the anchor.** Pick 3–5 personas whose stories naturally orbit the anchor. Resist the urge to thread every persona — the anchor's job is gravitational pull, not roll call. Each POV must demonstrate a distinct feature loop (community participation, trust → care funnel, provider in-session execution, marketplace customer flow, new-user onboarding, etc.). | `docs/strategy/User Archetypes.md`, `docs/features/demo-mode.md` ("Highlight reels") | done |
| W1.3 | **Per-POV breakdown.** For each POV from W1.2, document: (a) what this persona DOES in their segment (concrete actions on concrete surfaces), (b) which feature is on display, (c) the task or question the tester is asked here. Keep prompts open enough to support qualitative feedback ("does this feel useful?") without being so vague they yield nothing. | output of W1.2 | done |
| W1.4 | **Decide time/place rules of the thread.** Two options: (a) **strict** — the same Saturday for every POV, all events within a few hours of the anchor; (b) **anchor-as-starting-point** — the anchor is where the demo begins but POVs may drift into their own time/place (Daniel's training session is the following Tuesday, etc.). Trade-off: strict feels coherent but constrains feature coverage; loose covers more ground but risks losing "one community, multiple views" feel. Pick one. | output of W1.3 | done |
| W1.5 | **Decide the narrative outline doc location + name.** Two reasonable homes: `docs/strategy/Demo Narrative.md` (treats the demo as a strategic artifact alongside Product Vision) or `docs/features/demo-mode.md` (folds it into the existing demo-mode spec as a new section). Probably `strategy/` — it's a positioning artifact, and the file that names "what we want testers/investors to see" deserves its own home. Land the call, then write the outline: anchor + per-persona segment + feature focus + tester prompt for each. | new file or `docs/features/demo-mode.md` | done |

---

### Workstream W2 — Persona roster v2

The current roster (Tereza, Daniel, Klára, Tomáš, Lena, New User) has known gaps and drift. Audit, decide, document. Per-persona implementation lives in W3.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W2.1 | **Audit each persona in the W1 narrative against `User Archetypes.md`.** For each persona named in W1.2: does the seeded data actually represent the archetype, or has it drifted from the strategy doc? Document gaps as input to W3. | `docs/strategy/User Archetypes.md`, `docs/implementation/mock-data-plan.md` "The Cast," `lib/mockUsers.ts`, `lib/personas.ts` | done |
| W2.2 | **Decide on Neighborhood Hub Member persona.** A person whose primary engagement is one private group of ~12 neighbors. High in-group activity, some peer-to-peer care between members. Demonstrates Doggo as the WhatsApp replacement for an app-mediated community — the strongest demo of the "Find Your People" door from `Product Vision.md` → "Three Ways In." Currently has no persona embodiment. Decision: add as a new persona. If yes, draft (name, neighbourhood, dog, group, connections, key behaviors). Marketplace Owner / Lena (added during CCFT 2026-05-13) is the precedent for adding a missing-archetype persona under pressure. | `docs/strategy/User Archetypes.md`, `archive/phases/cross-cutting-flow-testing.md` (Lena addition decisions log) | done |
| W2.3 | **Decide Casual Carer merge vs separate.** Casual Carer (Ramp 2 dial barely turned, audience: circle) has no persona embodiment today. May be the same persona as Neighborhood Hub Member (their in-group peer-care IS casual-caring). Decide: merge into Hub Member, or seed as separate persona. Lean merge unless a story beat requires the split. | `docs/strategy/User Archetypes.md` ("The Casual Carer") | done |
| W2.4 | **Decide Daniel framing: rewind vs after-picture.** Strategy doc has him as "anxious new owner with thin network." His current data has him post-arrival (creator of meet-17, recurring Klára training, dense connections). Two ways to handle in the narrative: (a) **rewind** his data to an in-journey snapshot (sparser connections, no booking yet), (b) **keep** as-is and use walkthrough copy to frame him as the "after" picture (the journey worked). Decide based on which serves the W1 anchor narrative better. Note: rewinding has cascading effects (other personas' connection rosters reference Daniel). | `lib/mockUsers.ts:daniel`, `lib/mockBookings.ts:klaraTrainingDaniel`, `lib/mockConnections.ts` | done |
| W2.5 | **Decide Recent-mover persona inclusion.** A "Day 0" persona that's not literally the empty New User but has minimal seed: one dog, no connections, no groups joined yet, just landed in Prague. Demonstrates the actual onboarding entry point in a way New User (truly empty) can't (because real users have a dog at minimum). Decide: include or skip. If included, draft. | `docs/strategy/User Archetypes.md`, `lib/personas.ts:newUserPersona` | done |
| W2.6 | **Verify Klára as trainer through a focused audit.** Does her profile + Calm Dog Sessions group + service catalog + Eda the Border Collie visibly communicate trainer-as-promoter (per Cold-Start Playbook framing)? Specifically check: profile hero badges, Services tab card content, group description, recent posts. Likely passes — flag any gaps for W3. No new data expected. | `lib/mockUsers.ts:klara`, `lib/mockGroups.ts:svc-klara-training`, `app/profile/[userId]/page.tsx` (live check), `docs/strategy/Cold-Start Playbook.md` ("framing principle") | done |
| W2.7 | **Document roster v2 in `personas.ts` + `User Archetypes.md`.** Update `lib/personas.ts` with new entries (W2.2 + W2.3 + W2.5 outcomes) — `archetype` and `tagline` fields aligned with archetype vocabulary. Add new archetypes to `User Archetypes.md` where they don't exist (Neighborhood Hub Member at minimum). Update `docs/features/demo-mode.md` persona table to match new count. Marketplace Owner / Lena addition (CCFT 2026-05-13) is the doc-update precedent. | `lib/personas.ts`, `docs/strategy/User Archetypes.md`, `docs/features/demo-mode.md` | done |

---

### Workstream W3 — Mock-world data adjustments

Implements W2 persona changes, closes connection-roster gaps, and fills any narrative-required seed gaps. Lean — add only what the W1 narrative actually requires; no speculative seeding.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W3.1 | **Implement the W2 persona changes.** New persona entries (Neighborhood Hub Member, possibly Casual Carer, possibly Recent-mover) seeded across `mockUsers.ts`, `mockGroups.ts`, `mockMeets.ts`, `mockConnections.ts`, `mockConversations.ts`, `mockBookings.ts`, `mockPosts.ts` as required by their archetype. Daniel rewind (if W2.4 chose that) cascades through connection rosters that reference him. | output of W2.7, `lib/mock*.ts` | done |
| W3.2 | **Symmetrize connection rosters — close P69.** Surfaced 2026-05-13 during PDP walkthrough G1. Only 5 personas have seeded connection rosters today (Shawn, Tereza, Daniel, Klára, Tomáš); every other persona (Eva, Petra, Marek, Lucie, Jana, Filip, Hana, Nikola, etc.) appears in others' rosters but has no roster of their own. Mutual-connection computation only works when both ends are seeded. **Fix:** seed `mockConnectionsByViewer` entries for the remaining supporting personas — at minimum, the inverse of every existing seeded entry pointing AT them (if Tereza has Marek as `state: "connected"`, Marek's roster should have Tereza as `state: "connected"` too). Out of scope: generating new Connections from scratch — just symmetrize the existing seed. **Shipped partial:** rosters added for the 6 anchor supporting personas (Marek, Eva, Hana, Jana, Pawel, Petra) + open-viewer hygiene fix on Magda/Veronika. Broader sweep (bridged providers + lighter cast) stays open — P69 not fully closed; punch-list item stays with narrowed scope. | `lib/mockConnections.ts:mockConnectionsByViewer`, `phases/punch-list.md` P69 | partial |
| W3.3 | **Fill seed gaps the W1 narrative requires.** Specific meets, posts, bookings the anchor event + per-persona segments need to exist. **Lean rule:** only what the demo narrative actually walks past. Don't speculatively flesh out broader world. Each addition uses `daysAgo` / `daysFromNow` per `mock-data-plan.md` date strategy so the demo always reads as live. | output of W1, `lib/mock*.ts`, `lib/mockDate.ts`, `docs/implementation/mock-data-plan.md` "Date strategy" | done |
| W3.4 | **Adopt P59 (notification seed enrichment for non-Shawn personas).** 23 seeded notifications were originally Shawn-centric; only 3 re-attributed to viewer personas (Tereza, Daniel) by Inbox & Notifications close. Klára and Tomáš (and now Lena + new W2 personas) start with empty bells, weakening the demo of the notifications surface. Sweep remaining 20 seeds, re-attribute or duplicate where one event has multiple recipients, give every viewer persona a coherent starting bell. Scope: bound to what each W1 POV actually needs — don't enrich notifications for personas not in the narrative. | `lib/mockNotifications.ts`, `phases/punch-list.md` P59 | done |
| W3.5 | **Document realism standards as a new section in `mock-data-plan.md`.** Capture the conventions that have accreted across phases (dog-name + person-name patterns, neighbourhood mapping, pricing realism, connection-density targets per persona, the relative-date strategy, the bridged-provider contract, profileVisibility ratio aim) as a single canonical "Realism standards" section so future seeding stops drifting. NOT a re-write of the doc — additive section after "Current State" or before "Cleanup: Resolved." | `docs/implementation/mock-data-plan.md` | done |
| W3.6 | **Seed `Booking` records for pre-seeded required-link meet rosters.** Handed off from the Service ↔ Meet Linkage walkthrough (C6, closed 2026-05-17). `meet-care-1` / `meet-care-workshop-1` / `meet-care-puppy-basics` are `required`-link meets — by the linkage model every non-creator roster attendee should have a backing `Booking` (booking IS the RSVP). But `seedRecurringAttendeesByDate` spreads a recurring meet's base `attendees` across occurrences writing **rosters only, never `Booking`s** — so a pre-seeded attendee (e.g. Tomáš on `meet-care-1`'s May 20 roster) has no booking record and the session never appears on `/bookings`. **Shipped:** 4 `meetBooking` bookings seeded — `meet-care-1` → Magda + Tomáš (klara-group-training, 350 Kč); `meet-care-workshop-1` → Daniel (klara-reactive, 600 Kč); `meet-care-puppy-basics` → Jana (klara-puppy-basics, 400 Kč). One booking per non-creator attendee, each meet's next occurrence; Klára (creator) needs none. | `lib/mockBookings.ts` (`meetCare1Magda` + 3 siblings), `archive/phases/service-meet-linkage-walkthrough.md` (C6 Decisions entry) | done |

---

### Workstream W4 — Walkthrough UX design (DESIGN ONLY, no build)

Specifies the interstitial pattern, the Open View vs Guided Walkthrough mode toggle, and the persona-switch transition. Output is a design spec the follow-on build phase implements against. Mocks helpful but not required. Resist the urge to start building.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W4.1 | **Full-screen interstitial spec.** Layout, copy structure (persona name + avatar + situational context + tester prompt), dismissal mechanic (tap-anywhere? explicit "Continue"? persona-themed pill?), navigation back/forward, what happens when the tester wants to step out of the walkthrough mid-segment. Document copy *structure* with placeholder text — final copy is build-phase work. | `docs/strategy/User Archetypes.md` (persona vocabulary), prior art: `components/landing/TourOverlay.tsx` (single-persona float, NOT the model — referenced for what to differ from) | done |
| W4.2 | **Open View vs Guided Walkthrough mode toggle.** Where the controls live (in-app affordance? `/demo` route? both?), how transitions work between modes, what happens at the end of a guided run (return to Open View on the last persona? back to `/demo`? credits screen?), how to re-enter Guided after exiting. The Open View mode is today's persona-picker behavior — no new infrastructure required for that side; only the toggle in/out and the "I'm in Guided mode" indicator are new. | `app/demo/page.tsx`, `components/profile/ProfileNameDropdown.tsx`, `docs/features/demo-mode.md` "Switcher surfaces" | done |
| W4.3 | **Persona-switch transition design.** What happens between when an interstitial dismisses and the new persona's surface loads. Loading state? Persona-themed transition (avatar morph, name fade)? Hard cut with the interstitial covering the swap? Decide the right answer for both feel ("you ARE this person now") and engineering simplicity (the persona change is a context state update + a route push — no real load). | `contexts/CurrentUserContext.tsx`, `hooks/useCurrentUser.ts`, output of W4.1 | done |
| W4.4 | **Decide the design spec doc location + write it.** Two reasonable homes: `docs/features/demo-mode.md` (folded in as a new "Guided Walkthrough" section, sibling to "Switcher surfaces") or `docs/implementation/walkthrough-ux.md` (new file, treats walkthrough as its own implementation surface). Probably `features/demo-mode.md` — keeps demo infrastructure consolidated. Write the spec: interstitial layout + copy structure + dismissal + mode toggle + transition. **Out of scope:** code, copy beyond placeholder, mocks beyond what aids communication. | `docs/features/demo-mode.md` or new file | done |
| W4.5 | **On-surface step card (spec revision, added 2026-05-17).** The first W4 draft had only the between-beats interstitial — the step task was shown once and dismissed, forcing the tester to memorize a multi-step task. Revised: the spec now designs **two guidance surfaces** — the interstitial for the persona handoff PLUS a persistent collapsible **on-surface step card** that carries the step task while the tester works. The card revives the shipped `TourOverlay` pattern (desktop floating card / mobile bottom accordion, collapse/expand) — the build phase reuses it rather than rebuilding. Separate header bar dropped (the collapsed card is the persistent chrome). | `docs/features/demo-mode.md` ("Two guidance surfaces" + "On-surface step card" sections), `components/landing/TourOverlay.tsx` (prior art to reuse) | done |

---

### Workstream W5 — `/demo` entry rebuild (emergent, added 2026-05-17)

Not in the original W1–W4 plan. Added after a PO-briefing review surfaced that `/demo` was stale + bloated and there was no clean demo front door before an imminent PO meeting. Scope: de-bloat `/demo` and surface the four-beat narrative as a **manually-followed** path. This is a small build — explicitly NOT the auto-switching Guided Walkthrough (that stays the deferred follow-on phase per W4 + Out of scope). Sanctioned mid-phase by the user.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W5.1 | **De-bloat `/demo`.** Remove the stale "Guided journeys" section (3 scenario cards whose "Walk me through it" button launched the superseded single-persona Tereza `TourOverlay`; the cards also duplicated personas already in the pills row). Refresh header copy. | `app/demo/page.tsx`, `app/demo/demo.css` | done |
| W5.2 | **Surface the four-beat narrative as a manual path.** Four numbered beat cards (Daniel → Klára → Magda → Lena), each: persona avatar + time-of-day + context + "Do:" action line + "Start beat N as {Name}" button that sets the persona and routes to the beat's opening surface. Tester walks the beat freely, returns to `/demo` for the next. | `app/demo/page.tsx` (`BEATS` array), `docs/strategy/Demo Narrative.md` | done |
| W5.3 | **Keep the free-explore picker.** The 7-persona pill row stays as the "Or explore freely" second section (Open View). | `app/demo/page.tsx` | done |
| W5.4 | **Update `features/demo-mode.md`.** Rewrite the "`/demo` route" section to describe the rebuilt two-section page. | `docs/features/demo-mode.md` | done |

---

## Out of scope (deferred to follow-on phase)

These are deliberately excluded from this phase's commitments:

- Building the walkthrough infrastructure (auto-switch wiring, interstitial component, mode toggle implementation)
- Walkthrough copy authoring (placeholder copy in W4 to validate structure; final copy is build-phase work)
- Marketing-style landing-page polish (was Demo Presentation A/B/C/E territory; revisit in the follow-on build phase if relevant)
- User-testing protocol design — separate research artifact, not phase scope
- Re-litigating two-mode decision (Open View + Guided) or the threaded-narrative thesis — both pre-decided

---

## Acceptance Criteria

- [x] **W1.** Narrative outline doc exists, names the anchor event, lists 3–5 persona POVs with per-POV action + feature + tester prompt, and states the time/place rule (strict vs anchor-as-starting-point)
- [x] **W2.** `lib/personas.ts` reflects the new roster (Neighborhood Hub Member added; Casual Carer + Recent-mover decisions documented in the file or User Archetypes.md). User Archetypes.md updated with any new archetypes. demo-mode.md persona table matches reality
- [x] **W3.** All W2 persona data seeded; P69 closed *(partial — see W3.2; remainder stays on the punch list)*; P59 closed for personas in the narrative (notifications enriched); W1-required meets / posts / bookings exist; mock-data-plan.md has a "Realism standards" section
- [x] **W4.** Design spec for the interstitial + on-surface step card + mode toggle + persona-switch transition lives in its chosen home doc, sufficient for a follow-on build phase to implement against
- [x] **W5.** `/demo` is rebuilt — stale Guided-journeys section removed, four-beat narrative surfaced as a manual path, free-explore picker kept; `features/demo-mode.md` "`/demo` route" section updated to match

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [x] Walk through every acceptance criterion against the running app + the produced docs
- [x] Walkthrough Decisions log swept — every entry propagated to the named home doc per `→` annotation, then checked off here (not in the walkthrough — entries stay as the historical record)
- [x] Update affected feature docs (`docs/features/demo-mode.md` at minimum; possibly `docs/features/profiles.md` if persona changes touch profile rendering)
- [x] Update `docs/strategy/User Archetypes.md` with any new archetypes (Neighborhood Hub Member, Casual Carer if separate, Recent-mover if included)
- [x] Update `docs/implementation/mock-data-plan.md` with new persona entries in The Cast + the new Realism standards section
- [x] Update Open Questions log — close §10 ("scenarios vs profiles?" + "guided tour or free?") with hybrid resolution; add any new questions surfaced
- [x] Close P69 + (P59 if narrative-bound) on the punch list
- [x] Update ROADMAP.md — move this phase out of Current Phases; add to archive index. Add the follow-on **Walkthrough Build** phase (or whatever it's named) to Upcoming if the spec is locked enough to reference
- [x] Review CLAUDE.md — update Current Phases section; add a key-decisions bullet for the threaded-narrative thesis + two-mode model + new personas if they materially shift the project's mental model
- [x] Archive this phase board (`status: archived`, `git mv docs/phases/demo-narrative-and-personas.md docs/archive/phases/`) and the walkthrough (same treatment)
- [x] **Structural audit** — see CONTRIBUTING.md → Closing a Phase step 9a
- [x] **Strategic review** — Read Open Questions, Roadmap, relevant strategy + competitive research, and the next phase's scope. Brief: what changed about our understanding of the demo? What surfaced about the personas that should shift the product? Is the follow-on build phase scoped right? Any research worth doing before it opens?

---
status: archived
last-reviewed: 2026-06-13
review-trigger: When any task is completed or blocked; at the mid-phase advocacy-loop checkpoint
---

# Adoption-Curious Journey

> **One unified narrative, built as a coherent phase.** An adoption-curious person (never owned a dog) discovers a shelter → joins a **group shelter walk / mentoring** → walks shelter dogs → becomes an **advocate** (shares photos/stories) → and either the dog gets adopted **by the network** OR the walker adopts. Builds on the Cross-Shelter Mentor Network mechanic (shipped 2026-06-12) — does **not** rebuild it.
>
> **Research-driven (2026-06-12 deep-research pass).** The headline reframe: the adoption engine is the **advocacy loop** (a walker surfaces the dog to OTHER adopters — the proven ~5×/14× lift), **not** self-adoption (only ~4–12% of caregivers adopt). **Build advocacy-loop-first, self-adoption second.** See [[Competitive Research - Adoption-Curious Journeys]].

**Goal:** A reviewer can drive one continuous story — adoption-curious newcomer → group shelter walk → mentored → vouched → walks a shelter dog → shares a walk recap that surfaces to the network → a long-stayer draws adoption interest (network path) and/or the walker moves to adopt (self path) → shelter-curated meet-and-greet → `adoption-pending` → graceful resolution — with de-coupled "no adoption obligation" framing throughout and non-failure off-ramps at every step.

**Depends on:**
- **Cross-Shelter Mentor Network** (2026-06-12) — `mentor_session` service kind, `WalkEntrySheet` / mentor-vouched path, `MentorSessionBookingSheet`, shelter-walk `Booking` (`ownerKind: "shelter"`), Volunteering tab, platform Super Volunteer tier, layered waivers. The mentoring on-ramp reuses this end-to-end.
- **Shelter Foundation** (2026-06-02) — `ShelterProfile` / `ShelterPolicy` / three seeded shelters / non-owned `ShelterProfile.dogs[]` / `adoptionStatus` enum.
- **Help a Dog Discover door** (2026-06-08) — `/discover/help-a-dog` (Dogs/Shelters pill split), shelter-membership sort elevation, `ShelterDogCard`.
- **Meets + Services as Catalog** — `Meet` (roster + RSVP) machinery, the `meet` service shape; the group shelter walk is a Meet whose dogs come from a shelter.
- **Demo Mode / personas** — persona registry (`lib/personas.ts`), `?as=` preview, post composition + shelter feed for the advocacy loop.

**Refs:** [[Competitive Research - Adoption-Curious Journeys]] (the design driver), [[Future Considerations]] FC18 (group shelter walk) + FC7 (Dogs-tab carousel, adjacent), [[Cold-Start Playbook]] → "adoption-curious / pre-adopter persona" + "Two paths in steady state", [[Product Vision]] → Ways In ("Help a Dog"), [[features/shelters]] → "Shelter-walking journey & mentor network" + "Deferred for later phases", [[strategy/mentor-network-shelter-demo]] (graduated demo precedent), [[features/demo-mode]] (persona + hidden-affordance conventions), [[planning/Open Questions & Assumptions Log]] §1 + §14 (adopted-dog transition), [[Groups & Care Model]] → Services as Catalog / Meet shape.

---

## Scope disciplines

Set at open; not renegotiated mid-build.

1. **Advocacy-loop-first.** The research is unambiguous: the proven adoption engine is the walker-as-advocate surfacing the dog to *other* adopters, not the walker adopting. The phase spine is the advocacy loop (Workstream D); the self-adopt capstone (Workstream E) is real but secondary. Sequence and seed accordingly.
2. **De-couple walking from adoption commitment — in copy, everywhere.** The single most-documented operational friction is "take a dog out = commit to adopt." Entry copy on every shelter-walk / group-walk / mentor surface must carry the *"walk a shelter dog — no adoption obligation"* framing. This is an acceptance criterion, not a nicety.
3. **Shelter stays the curator.** Adoption routes through the shelter's curated meet-and-greet (matches our shelter-authority principle and the Mentor Network's vouching model). The Adopt CTA opens interest/application → **shelter-curated** meet-and-greet → `pending`; it does **not** auto-match.
4. **Story, not presentation infra — the FC17 split is honoured, and this phase feeds it.** The destination is the in-product **guided walkthrough expanded to multiple arcs** — today it carries one arc (Daniel→Klára→Daniel); FC17 splits that and adds `shelter-mentor` + `adoption-curious`. This phase builds the *content half* of the adoption-curious arc — surfaces, persona, seed data, **and an explicit ordered beat list** (same shape the V2 arc uses) — drivable in **Open View** (`?as=` + hand-driving) and verified by a dev walkthrough. The **guided-UI packaging (interstitial/step-card registry, per-arc staging, landing-page doorway restructure, "cut each path tighter") is FC17** ("Multi-Path Demo & Guided Walkthroughs") — built once across all arcs, not per-arc here. The clean-handoff test: FC17 should be able to *wrap* this arc's beats in guided UI without *redesigning* them.
5. **Peel FC18 if it balloons.** The group shelter walk (Workstream C) is the inviting on-ramp and starts unified with the rest. If the group-walk mechanic (shelter-dog roster source, group dog-checkout model) balloons mid-build, peel C into its own phase and ship the persona + doorway + advocacy + capstone without it. Decide-and-flag at the mid-phase checkpoint.

**Not in scope (honestly deferred):**
- **Guided-walkthrough registry / `/` launcher doorway restructure / multi-path tightening** — FC17, next phase (discipline 4).
- **Full adopted-dog → new-owner profile migration** — does an adopted shelter dog migrate to the adopter's `UserProfile.pets[]`? Deferred per [[features/shelters]] "Deferred for later phases" + OQ §1/§14. This phase models the `pending` state + the celebration / "happy endings" archived state; the literal `PetProfile` ownership migration stays V2 (DR7).
- **Shelter operator surface** — application review, meet-and-greet scheduling UI, adoption finalisation queue. State-toggle / hidden-affordance fakes per the established pattern; the real operator side is FC16.
- **Real payments / marketplace cut** — mentor-session price is a stub line (unchanged from Mentor Network).
- **Dogs-tab carousel view (FC7)** — the emotional one-dog-at-a-time pattern is adjacent and tempting for the doorway, but it's a ~1-day standalone build; deferred unless the doorway demonstrably needs it (decide-and-flag).
- **Czech/Prague adoption specifics** — a confirmed research gap; carried into shelter interviews, not invented here (O-items).

---

## Opening Checklist

Completed 2026-06-12.

- [x] **Read every task + referenced docs** — Adoption-Curious research, FC18/FC17/FC7, `features/shelters.md` (shelter-walking journey + deferred items), Cold-Start Playbook adoption-curious thread + two-paths model, Product Vision Ways In, demo-mode persona conventions, archived Cross-Shelter Mentor Network board (shape/precedent), CONTRIBUTING "Opening a Phase".
- [x] **Review Open Questions log** — §1 (Community Adoption) + §14 adopted-dog-transition entry confirm the transition is a known-direction *deferred* item (celebration → archived "Happy endings"; full profile migration is the open sub-question) → ratified as DR7. No blocker.
- [x] **Audit for conflicts** — five surfaced, captured below.
- [x] **Update stale docs** — every referenced doc is `last-reviewed` ≤ 6 days (Cold-Start Playbook 06-09; Product Vision 06-08; User Archetypes 06-02; all others 06-12). None over the 2-week trigger; no open-time bumps.
- [x] **Scan the Punch List** — no adoption overlap; P77 was closed by the prior phase. Remaining items are design-system / mock-data (deferred to the Design-System phase). Nothing to adopt.
- [x] **Confirm scope** — ROADMAP bundles this with Multi-Path Demo; the 2026-06-12 PO call **splits** FC17 out (discipline 4). Group-walk peel-off escape hatch set (discipline 5). Persona is a NEW non-owner (not Tomáš — he stays the owner-mentee thread).

### Conflicts surfaced during opening

1. **`Adopt {dog}` CTA is a stub.** `app/dogs/[id]/page.tsx` `onAdoptClick` just `router.push`es to the shelter page — no funnel. Workstream E **replaces** it with the real interest → curated meet-and-greet → `pending` flow. Not a contradiction, but the starting point E builds from.
2. **All three seeded shelters are `groupWalksPermitted: false`** (`lib/mockShelters.ts`). The Mentor Network deliberately set this — group walks were orthogonal there. FC18's group shelter walk needs an enabling shelter; **Útulek Liběň flips to `groupWalksPermitted: true`** as the host (DR3), and the newcomer-in-a-group liability question (FC18 tension #1) becomes an O-item for shelter interviews — not a build blocker.
3. **`Meet` requires a `groupId`** (`lib/types.ts:981`); today a Meet's roster is people, and dogs are members' own. The group shelter walk is *a Meet whose dogs come from `ShelterProfile.dogs[]`* — a new linkage. How the Meet attaches to the shelter (a shelter-linked group? a host's care group? a direct `shelterId` on the Meet?) is a build-targeting decision → DR4.
4. **ROADMAP phase name = "Adoption-Curious Doorway + Multi-Path Demo."** This board is the Adoption-Curious *story* only; Multi-Path Demo + guided walkthroughs split to a later phase (discipline 4). ROADMAP row gets reconciled at close (compass-not-changelog).
5. **No non-owner persona exists.** Registry has 7 personas, all owners or new-user. The adoption-curious explorer (never owned a dog) is a NEW persona (DR1). Tomáš ("drawn to shelter dogs") stays the *owner*-mentee thread, untouched.

---

## Design Decisions (ratify at walkthrough)

The first three ratify the 2026-06-12 PO calls; the rest are build-targeting picks (decide-and-flag).

### DR1 — New adoption-curious persona (non-owner)
A new persona in `lib/personas.ts`: an adoption-curious explorer who has **never owned a dog** and is walking shelter dogs to "try before committing." Distinct from Daniel (anxious *new owner*) and Tomáš (busy *owner*, drawn to shelter dogs). Empty `pets[]`, no `carerProfile` at start (dials up volunteer standing through the journey). **Proposed: "Eliška Dvořáková," Žižkov** (fresh neighbourhood for geographic spread) — name/neighbourhood to bless at walkthrough. Adds a `User Archetypes` entry ("Adoption-Curious Explorer").

### DR2 — Doorway is `/discover/help-a-dog`, tuned for "explore before commitment"
Reuse the shipped Help a Dog door rather than a fifth door. The adoption-curious tuning is **copy + an explore-first framing layer** on the existing Dogs/Shelters surface (the "no adoption obligation" header from discipline 2, an "explore before you commit" intro), plus surfacing the group shelter walk as the warm entry. No new top-level route.

### DR3 — Útulek hosts the group shelter walk (`groupWalksPermitted: true`)
Útulek Liběň (full roster, accepts mentor vouches, min 3) is the natural host. Flip its policy flag; Pes v nouzi / Druhá šance stay `false` (the contrast cases remain). The host of the *walk itself* is a Super Volunteer / mentor — **Klára** (the keystone trainer-walker archetype, already the seeded mentor), giving her the recurring-product / retention mechanic FC18 describes.

### DR4 — The group shelter walk is a Meet linked to a shelter for its dog roster *(build-targeting)*
A Meet (community green) whose attendees, if **vouched**, can claim a shelter dog from `ShelterProfile.dogs[]` for the walk. The linkage mechanism (direct `shelterId` on the Meet vs hanging off a shelter-adjacent group vs the host's care group) is settled in build — leaning toward a lightweight `shelterId` reference on the Meet so the roster source is explicit. **Two-tier roster** is the load-bearing UI: vouched attendees show "walking {dog}"; un-vouched newcomers join (social, no dog handling) and see the **"get mentored by me"** CTA in their slot — the green→violet funnel boundary. Group dog-checkout logistics (a shelter releasing N dogs at once, mentor-as-responsible-party) are an O-item, not fully modelled.

### DR5 — Advocacy loop: walk-finish → "Share a moment" as a first-class action *(per research #2)*
On shelter-walk Booking session **Finish** (and group-walk completion), prompt photo/story capture as a first-class action that drops a post into the shelter feed, tagged to the dog + shelter (reusing existing post composition + `getShelterFeed`). The walk recap **is** the adoption ad. The recap surfaces in the network feed and on the dog page — that surfacing IS the network-adoption path. Distinct from the existing visit report (operational) — this is the public advocacy artifact.

### DR6 — Adoption as a state machine with non-failure off-ramps *(per research #3+#4)*
Model the escalation ladder **walk → repeat walk → (sleepover/foster) → adopt**, each step a graceful exit, not a binary commit. The `Adopt {dog}` CTA opens an **interest/application** (de-coupled copy: exploring, not committing) → **shelter-curated meet-and-greet** (DR-curated, not auto-matched) → `adoptionStatus: "pending"` (the existing enum + the shipped "Adoption pending" hero pill) → resolution. "Returns are not failures" framing where a trial/foster step appears. Shelter-side scheduling of the meet-and-greet is a hidden-affordance state-toggle (operator surface = FC16).

### DR7 — Adopted-dog resolution: celebration + archived state; full migration deferred
On `adopted`, the dog becomes a brief **celebration** moment and then an archived "Happy endings"-style state (per OQ §14 strong direction). The **literal migration** of the `PetProfile` into the adopter's `UserProfile.pets[]` (with the network-adopter or self-adopter as new owner) stays **V2-deferred** — modelled as a celebration/transition surface, not a real ownership move. This keeps the capstone honest without opening the cross-account migration design.

---

## Sequencing

**Advocacy spine first** (per discipline 1). Persona + doorway + the advocacy loop are the half that proves the thesis; the group walk and the capstone build on it.

**Build order (each line ≈ one focused commit):**
1. **A1–A2** — New persona + seed data (the protagonist the rest of the story needs).
2. **B1–B2** — Doorway tuning on `/discover/help-a-dog` (de-coupled framing + explore-first layer).
3. **D1–D3** — Advocacy loop: walk-finish "Share a moment" → shelter feed → network/dog-page surfacing. *(spine)*
4. **C1–C3** — Group shelter walk Meet (shelter-dog roster + two-tier roster + newcomer mentor CTA). *(peel candidate — discipline 5)*
5. **Mid-phase checkpoint** — drive: persona → doorway → group walk → mentored → vouched → walk → share → recap surfaces. Re-confirm the spine before the capstone.
6. **E1–E3** — Adoption funnel capstone: Adopt CTA → interest → shelter-curated meet-and-greet → `pending` → off-ramps → celebration/archived resolution.
7. **F1–F2** — Storyline seeding pass + standard dev walkthrough.

**Ship target:** the unified narrative drives start-to-finish in Open View — adoption-curious newcomer to a graceful adoption resolution (network path primary, self-adopt path available) — with "no adoption obligation" framing throughout and a non-failure exit at every step.

---

## Workstream A — Adoption-curious persona + seed data *(DR1)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| A1 | New non-owner persona in `lib/personas.ts` (proposed Eliška, Žižkov) — empty `pets[]`, no `carerProfile` at start, locked/Open as fits an explorer; switcher tagline + archetype framing. Add to the picker. | DR1 | todo |
| A2 | Seed data for the journey: her starting state (following/curious at Útulek), the long-stayer she'll bond with (reuse/seed a Útulek long-stayer, e.g. "Maja"), and the empty→populated arc her surfaces need (connections, Volunteering tab, Volunteer-work section fill as she progresses). `User Archetypes` gains an "Adoption-Curious Explorer" entry. | DR1, [[features/demo-mode]] | todo |

---

## Workstream B — Adoption-curious doorway *(DR2 — per research #1)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| B1 | "Explore before you commit" framing on `/discover/help-a-dog` — the **"walk a shelter dog · no adoption obligation"** header/intro (discipline 2), tuned for someone considering ownership for the first time. Copy-led; no new route. | DR2, research #1 | todo |
| B2 | Surface the group shelter walk as the warm entry from the doorway (and/or the shelter page) — "join a group walk to meet the dogs and how it works," pointing un-vouched explorers at the social on-ramp rather than a cold solo shelter process. | DR2, DR4 | todo |

---

## Workstream C — Group shelter walk (FC18) *(DR3, DR4 — peel candidate)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| C1 | Útulek `groupWalksPermitted: true` seed flip (DR3); a group-shelter-walk **Meet** hosted by Klára, linked to Útulek for its dog roster (`shelterId` linkage per DR4). | DR3, DR4, FC18 | todo |
| C2 | **Two-tier roster** rendering — vouched attendees show "walking {dog}" (claim a `ShelterProfile.dogs[]` dog); un-vouched newcomers join as social attendees (no dog handling) with the **"get mentored by me"** CTA in their slot (the green→violet funnel boundary). | DR4, FC18, [[features/shelters]] | todo |
| C3 | Walk-eligibility reuse — the existing per-shelter + per-dog strictest-wins check gates who can claim a dog; newcomer CTA routes into the shipped mentor-session flow. No new credentialing logic. | [[features/shelters]] eligibility | todo |

> **Peel rule (discipline 5):** if C balloons (roster-source data model, group dog-checkout), peel to its own phase at the mid-phase checkpoint and ship A/B/D/E without it. Open O-items: newcomer-in-group liability (FC18 #1), group checkout logistics (FC18 #2) — shelter-interview questions, not build blockers.

---

## Workstream D — The advocacy loop *(DR5 — per research #2; the spine)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| D1 | Walk-finish → **"Share a moment"** as a first-class action on shelter-walk Booking Finish (and group-walk completion) — opens post composition pre-tagged to the dog + shelter. Distinct from the operational visit report. | DR5, research #2 | todo |
| D2 | Recap routes into the shelter feed (`getShelterFeed`) and the dog page Posts/Highlights — the walk recap is the adoption ad. Reuses the shipped post + feed plumbing; no new collection. | DR5, [[features/shelters]] feed | todo |
| D3 | Network surfacing — the recap appears in the network/Home feed so it reaches **other** potential adopters (the proven mechanism). Wire the "this dog is looking for a home" advocacy framing on long-stayer recaps without re-introducing commitment pressure (research's core tension). | DR5, research headline | todo |

---

## Workstream E — Adoption funnel capstone *(DR6, DR7 — per research #3/#4/#5)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| E1 | Replace the stub `Adopt {dog}` CTA (`app/dogs/[id]/page.tsx`) with an **interest/application** opening — de-coupled "exploring adoption, not committing" copy; routes to the shelter, not auto-match (DR6, discipline 3). | DR6, conflict 1 | todo |
| E2 | **Shelter-curated meet-and-greet** → `adoptionStatus: "pending"` (existing enum + shipped hero pill). Shelter-side scheduling is a hidden-affordance state-toggle (operator surface = FC16). Both paths feed it: a network adopter (from a recap) and the walker themselves. | DR6, research #5 | todo |
| E3 | **Off-ramps + resolution** — model the escalation ladder (walk → repeat → sleepover/foster → adopt) with a graceful exit at each step and "returns aren't failures" framing; on `adopted`, a celebration + archived "Happy endings" state (DR7). Full `PetProfile` migration stays deferred. | DR6, DR7, research #3/#4 | todo |

---

## Workstream F — Storyline seeding + dev walkthrough

| # | Description | Refs | Status |
|---|-------------|------|--------|
| F1 | Storyline seeding pass — the full arc drives in Open View via `?as=` + hand-driving (persona → doorway → group walk → mentored → vouched → walk → share → recap surfaces → adoption interest → curated meet-and-greet → pending → resolution). V2 Daniel→Klára + Tomáš mentee threads untouched (smoke-checked). | discipline 4 | todo |
| F2 | **Define the arc as an explicit ordered beat list** (same shape as the V2 Daniel→Klára beats) — the FC17 source material so its guided wrapper is a wrap, not a redesign. Lands as a Demo Narrative addition, NOT a standalone outward sales doc (the outward demo IS the FC17 guided walkthrough; a separate markdown script only if a shelter-interview need surfaces first — decide-and-flag). | discipline 4, FC17, [[strategy/mentor-network-shelter-demo]] | todo |
| F3 | Standard dev walkthrough from `_walkthrough-template.md` — "Open for your call" pre-queued: persona name/neighbourhood (DR1), Meet↔shelter linkage (DR4), group dog-checkout depth + peel decision (C/discipline 5), adoption transition boundary (DR7), advocacy framing vs commitment-pressure (D3). | `_walkthrough-template.md` | todo |

---

## Workstream G — Adoption transition *(scope expansion, sanctioned by PO 2026-06-12)*

DR7 deferred the adopted-dog transition; the PO called it back in mid-phase. Built the **baseline** (the frozen "Adopted" profile — works for any adopter, no migration); the **take-over** rendering stays deferred (option 1) as the genuine cross-container migration + claim flow.

| # | Description | Refs | Status |
|---|-------------|------|--------|
| G1 | Effective adoption-status resolution (seed + `useAdoptionStore` override) + green "Adopted" hero pill; shed shelter-context auto-chips when adopted. | DR7 | done |
| G2 | Suppress Walk/Adopt actions on an adopted dog (`WalkAffordance` returns null); celebration + pill carry the state. | DR7 | done |
| G3 | Propagate adopted state: shelter Dogs-tab "Happy endings" subsection + `ShelterDogCard` `adopted` prop; Discover excludes adopted; in-care counts exclude adopted. | DR7 | done |
| G4 | Take-over / start-fresh choice (adopter continues profile as their owned dog) — **deferred** (option 1): the real cross-container migration + claim/consent flow, a later phase. | DR7, OQ §1/§14 | deferred |
| G5 | Docs — resolved transition model + deferral into Open Questions §1/§14 + `features/shelters.md`; walkthrough V10 + O7; this board. | | done |

---

## Acceptance Criteria

- [x] A reviewer can drive the unified narrative start-to-finish in Open View: adoption-curious newcomer → group shelter walk → mentored → vouched → walks a shelter dog → shares a recap → recap surfaces to the network → adoption interest → shelter-curated meet-and-greet → `pending` → resolution.
- [x] **"Walk a shelter dog — no adoption obligation"** framing is present on every shelter-walk / group-walk / mentor entry surface (research #1; discipline 2).
- [x] Walk-finish prompts **photo/story capture as a first-class action**; the recap lands in the shelter feed and surfaces in the network feed + dog page (research #2; the advocacy spine).
- [x] The group shelter walk renders a **two-tier roster** — vouched attendees claim a shelter dog; un-vouched newcomers join socially and see the mentor CTA (FC18).
- [x] Adoption is a **state machine with non-failure off-ramps** — Adopt CTA → interest → shelter-curated meet-and-greet → `pending`; no auto-match; a graceful exit at each ladder step (research #3/#4/#5; disciplines 3).
- [x] On `adopted`, a celebration + archived resolution renders; full `PetProfile` migration is honestly deferred (DR7).
- [x] New non-owner persona is in the picker with seed data that reads coherent at every stage of her arc.
- [x] Existing V2 (Daniel→Klára) + Tomáš mentee threads still drive intact; TypeScript compiles clean.
- [x] FC17 (guided-walkthrough registry, launcher restructure, path-tightening) is NOT built here (discipline 4).

---

## Close notes (phase-specific only)

> Canonical close process: `docs/CONTRIBUTING.md` → "Closing a Phase." Phase-specific items only below.

- **Feature docs to update:** `features/shelters.md` (group shelter walk + adoption funnel + walk-finish advocacy + `groupWalksPermitted` host), `features/demo-mode.md` (new persona + highlight reel + any hidden affordances), `features/explore-and-care.md` (Adopt CTA flow if it touches booking surfaces), `features/profiles.md` (Volunteer-work fill for the new persona if changed).
- **Strategy docs:** `strategy/User Archetypes.md` (Adoption-Curious Explorer entry), `strategy/Product Vision.md` (Help a Dog Ways In row gains adoption-funnel language), `strategy/Cold-Start Playbook.md` (adoption-curious thread — which assumptions building this REVISED before interviews).
- **Trackers:** Open Questions §1/§14 (adoption transition resolution + the deferred migration sub-question; any new O-items from C/D/E); promote/retire **FC18** (group shelter walk — shipped or peeled) and note FC7 disposition; ROADMAP row reconcile (split Multi-Path Demo / FC17 into its own next-phase row — conflict 4).
- **Next-phase dependency satisfied:** Multi-Path Demo & Guided Walkthroughs (FC17) inherits the persona + surfaces + seed data **and the adoption-curious beat list** (F2) this phase ships — its job becomes wrapping these beats in guided UI alongside the other arcs, not designing the arc. Update FC17's registry row (`adoption-curious` source → "built").
- **Outward sales doc (decide-and-flag, F2):** only if a shelter-interview need surfaces before FC17 — otherwise the in-product guided arc is the outward artifact.
- **CLAUDE.md:** "Ways In → Help a Dog" line gains the adoption-funnel close if the funnel changes the one-liner.

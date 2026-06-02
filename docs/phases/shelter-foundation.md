---
status: active
last-reviewed: 2026-06-01
review-trigger: When any task is completed or blocked
---

# Shelter Foundation

**Goal:** Doggo accepts shelters as a top-level entity. A demo shelter (Útulek Liběň) renders with a full page (Feed / Dogs / Members / Gallery), a roster of non-owned dogs whose cards link through to a minimal Dog Profile, a Members tab grouped by walker / supporter / team, and shelter-authored + walker-authored content seeded into mock data. The walker journey, walker credentialing UX, and shelter operator/admin view are explicitly NOT in scope — they land in the merged Carer Portfolio + Shelter Walker Credentialing phase later.

**Depends on:**
- Open Questions §14 strategic resolutions (2026-06-01) — entity shape, account model, tab structure, walker tier model, anti-scoreboard discipline
- Cold-Start Playbook → "The shelter angle" + "Walker credentialing as a shelter trust layer"
- Communities pattern (`/communities/[id]`) — page chrome shape we mirror with the Meets → Dogs swap

**Refs:** [[strategy/Open Questions & Assumptions Log#14]], [[Cold-Start Playbook]], [[features/profiles]] (PetCard), [[strategy/Groups & Care Model]] (we are NOT a Group type — important contrast), [[implementation/badges]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — §14 is the primary; also §7, §8, §12 for cross-references; flag anything affecting this phase
- [x] Audit for conflicts between phase plan and current codebase — see "Pre-build audit" section below
- [x] Update referenced docs with `last-reviewed` older than 2 weeks:
    - `docs/strategy/Cold-Start Playbook.md` — content edit (status line + TL;DR reflect shelter graduation) + bump to 2026-06-01
    - `docs/strategy/Trust & Connection Model.md` — touch-review (content current) + bump to 2026-06-01
    - `docs/strategy/Content Visibility Model.md` — touch-review (content current) + bump to 2026-06-01
    - `docs/strategy/User Archetypes.md` — touch-review (content current) + bump to 2026-06-01
    - `docs/features/connections.md` — touch-review (content current) + bump to 2026-06-01
- [x] Scan punch list — no overlap found (2026-06-01). Re-scan if items land while phase is active.
- [x] Confirm scope — all seven scope calls resolved 2026-06-01:
    1. Route: `/shelters/[id]`
    2. `PetProfile` ownership: containment-on-both-sides (no field on `PetProfile`)
    3. `PostTagType "shelter"` slot: add now
    4. Supporters shape: `ShelterProfile.supporters: { userId, since }[]`
    5. Demo persona shelter affiliation: defer to credentialing-moat phase
    6. Shelter feed authoring: mock-only this phase
    7. Walker tier surface depth: flat affiliation chip this phase, tier intensification later

---

## Pre-build audit

Captured during opening, before any code edits.

### Data-model alignment

- **`PetProfile` discriminator.** Today `PetProfile` has no owner reference; ownership is implicit via `UserProfile.pets[]` containment. §14 says shelter dogs need `shelterId`. Three implementations possible: (a) flip ownership inside-out (`PetProfile.ownerId` becomes required, drop containment) — biggest blast radius, touches every pet lookup; (b) keep containment for owned dogs, add a parallel `ShelterProfile.dogs[]` list for shelter dogs, no field on `PetProfile` itself — symmetric, minimal change; (c) add an optional `PetProfile.shelterId` discriminator alongside containment — both axes coexist. **Recommendation: (b).** Containment stays the source of truth on both sides; lookups (`getDogById`) check both lists. No `ownerId` field added to `PetProfile`. Captured here so we don't drift mid-phase.

- **PostTag `shelter` type.** `PostTagType` is `"dog" | "person" | "community" | "place" | "meet"`. Posts authored *by* a shelter aren't tags — they're authored. But a meet-recap post tagging "Bára (Útulek Liběň)" surfaces in the dog's auto-album AND should ideally surface in the shelter's Gallery (Photos & Galleries phase). Decide whether to add `"shelter"` to `PostTagType` now (cheap; future-proofs auto-album infrastructure) or defer to Photos & Galleries. **Recommendation: add the slot now**, even if no surface consumes it yet.

- **`tagApproval` on shelter.** §14 says the shelter carries its own setting (`ShelterProfile.tagApproval`). Trivial mirror.

- **`PetProfile.imageUrl` is required.** Today every dog has an avatar via containment seeding. Same applies — shelter seed must provide for each dog.

### Page chrome alignment

- **Route shape.** `/communities/[id]` is the prior art. Shelter route: open scope call (see below) — `/shelters/[id]` or `/orgs/[id]` (forward-compat with §14's OrgProfile generalization). **Recommendation: `/shelters/[id]`** — concrete > forward-compat right now; rename when OrgProfile lands.

- **Tab structure.** Communities use `groupType`-keyed tab lists in `app/communities/[id]/page.tsx`. Shelter tabs (Feed / Dogs / Members / Gallery) don't fit that switch cleanly because shelters aren't groups. New file (`app/shelters/[id]/page.tsx`) — copy the layout/Tabbar/Detail-header pattern, drop the group-specific tab logic.

- **Detail header.** `DetailHeader` is reused across surfaces — should accept a shelter the same way it accepts a group/user. May need a small generic-source prop tweak; verify before assuming.

### Members tab

- **PersonRow today carries one Role badge** (per `badges.md`). Shelter Walker tier badge belongs in that slot — but the visual escalation language for walker tiers (outlined → filled → filled+ring) is sized for the credentialing-moat phase. **This phase ships a flat walker affiliation chip** (e.g. "Walker · Útulek Liběň") with no tier intensification; the credentialing-moat phase upgrades it. Members tab works; the badge layer doesn't ship its full feature here.

- **Supporters filter pill.** Backing data shape isn't defined in §14. Sketch: `ShelterProfile.supporters: { userId, since }[]` — followers/sponsors/adoption-curious. Single Supporter chip on PersonRow. Confirm during scope-confirm step.

- **Team filter pill.** Renders only when staff are linked. §14 says "Optional Team mode UX design" is open. **This phase: leave the Team subsection wired with zero linked staff** (renders only on data presence) so the same page shape supports both modes from day one. Full link-staff UX deferred.

### Dogs tab + minimal Dog Profile

- **Card design.** Single-column photo-led feed. Cards need: hero photo, name, breed/age/sex, days-in-kennel, last-walked-N-days-ago, tags (e.g. "Solo only," "Long-stayer," "New arrival"). Reuses no existing pet-card surface 1:1 — closest precedent is `PetCard` but that's owner-side.

- **"Needs walks now" sort.** Derived from `lastWalkedAt` field on `PetProfile` shelter-side. Mock seed must populate.

- **Long-stayer pill.** §14 flags this as open ("currently just a sort"). For V1 of this phase: it's a sort + a one-word tag chip; full long-stayer treatment (urgency framing, fuller story) deferred per §14 open item.

- **Minimal Dog Profile.** Functional but shallow per ROADMAP. Hero photo + name + breed/age/sex + tags + backstory blurb + kennel stats (days in, last walked) + recent walkers (avatars only) + adoption-status pill. NO photo gallery (that's the Dog Profile phase + Photos & Galleries phase). NO walker history depth, NO visit reports surfaced (no walker journey in scope). Lives at `/dogs/[id]`.

### Gallery tab

- §14 says "Gallery inherits the Photos & Galleries phase machinery." That phase is unbuilt. **This phase: ship the Gallery tab as a stub** — heading, empty-state placeholder, no per-dog filtering, no upload affordance. The tab exists so the chrome is in place; content arrives when Photos & Galleries lands.

### Discovery / navigation

- **How does a user reach a shelter today?** Nothing wires shelters into the existing nav or Discover surface. Cold-Start Playbook proposes a fourth "Help a Dog" door but that's pre-roadmap. **This phase: link only by direct URL + shelter-authored posts in the feed deep-linking to `/shelters/[id]`.** No new top-level Discover entry. Cold-start surface ("Help a Dog") is its own design call deferred to a future phase.

- **Bottom-nav awareness.** The bottom-nav regex (`AppNav.tsx`) needs to stay visible on `/shelters/[id]` sub-tabs — same scroll-to-hide treatment as community detail.

### Demo personas

- The five demo personas (Tereza / Daniel / Klára / Tomáš / New User) don't currently include a shelter walker. Either: (a) wire an existing persona's profile to show a small "Volunteer work" section pointing at Útulek Liběň (low cost), or (b) defer the cross-shelter affiliation surface to the credentialing-moat phase. **Recommendation: (b).** Persona archetypes don't shift; this phase ships the shelter side without per-persona walker history populating. Walker-history on Dog Profile cards can use unbridged seed names ("Walked recently by Anna K., Jakub V.") — directory-style references.

---

## Pre-build scope calls

Surface these to the team before the first task moves to `in_progress`. Each has a recommendation; the user picks.

1. **Route name.** `/shelters/[id]` (recommended) vs. `/orgs/[id]` (forward-compat).
2. **`PetProfile` ownership model.** Containment-on-both-sides recommended (no field on `PetProfile`); confirm before A1 lands.
3. **`PostTagType` `"shelter"` slot.** Add now (recommended) vs defer to Photos & Galleries.
4. **Supporters data shape.** `ShelterProfile.supporters: { userId, since }[]` (recommended). Confirm.
5. **Demo persona shelter affiliation.** Defer (recommended) vs add a small Volunteer section now.
6. **Shelter feed authoring.** Mock-only for this phase (recommended) vs build the actual "post as the shelter" composer affordance. Recommendation: mock-only — the shelter operator admin view is V3+ per §14 and the shared-account composer flow has design ambiguity that belongs with it.
7. **Walker tier surface depth.** Flat affiliation chip in this phase (recommended), with tier intensification deferred to credentialing-moat phase. Confirm.

---

## Workstream A — Type model

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | `ShelterProfile` shape — `id`, `name`, `slug`, `logoUrl`, `bannerUrl?`, `location`, `neighbourhood?`, `bio`, `establishedYear?`, `dogs: PetProfile[]` (contained), `walkers: ShelterWalker[]`, `supporters: ShelterSupporter[]`, `team?: { userId }[]` (optional), `tagApproval`, `policy: ShelterPolicy`, `socialLinks?`. Add `ShelterPolicy`, `ShelterWalker { userId, tier, vouchedAt, walkCount }`, `WalkerTier = "vetted" \| "experienced" \| "trusted"`. | [[OQ §14]] | done |
| A2 | Per-dog policy overrides — `PetProfile.soloOnly?`, `PetProfile.experiencedHandlersOnly?`, `PetProfile.adoptionStatus?: "available" \| "pending" \| "adopted"`, `PetProfile.daysInKennel?`, `PetProfile.lastWalkedAt?`, `PetProfile.backstory?`, `PetProfile.tags?: string[]`. Document inline that fields are shelter-only via JSDoc — no runtime discriminator. | [[OQ §14]], [[Cold-Start Playbook]] (per-dog flags) | done |
| A3 | Add `"shelter"` to `PostTagType` (if scope call #3 lands as recommended). Update tag-rendering surfaces to no-op on unknown types defensively. | [[OQ §12]] | done |
| A4 | `PostTagType` `"shelter"` slot consumers — verify no surface breaks. (Search for switch statements; add a default arm so unknown types render as a passive chip.) | A3 | done |

---

## Workstream B — Mock data

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Seed Útulek Liběň as the demo shelter — name, slug, logo, banner, location (Libeň), neighbourhood, bio (bilingual sketch — Czech subtitle, English body), policy (`groupWalksPermitted: false` per shelter heterogeneity principle), `tagApproval: "auto"`. Lives in new file `lib/mockShelters.ts`. | [[Cold-Start Playbook]] | done |
| B2 | Seed 6–10 shelter dogs with realistic stats — names (Bára, Tonda, Maja, Šimon, Líza, Edda, …), breed/age/sex, hero photos, backstory blurbs (1–2 sentences), days-in-kennel (mix: 3 / 8 / 14 / 27 / 45 / 62 — show range), `lastWalkedAt` (mix: today / 1d ago / 3d ago / 5d ago / 8d ago — drives "Needs walks now" sort), tags ("Solo only," "Reactive to other dogs," "New arrival," "Long-stayer," "Good with kids"), 1–2 adoption-status "pending" + the rest "available". | B1, A2 | done |
| B3 | Seed walker roster — ~8 walkers across all three tiers (4 Vetted, 3 Experienced, 1 Trusted). Names only (directory-style), no `UserProfile` bridge needed this phase. `walkCount` and `vouchedAt` populated. | B1, A1 | done |
| B4 | Seed supporters — ~12 supporters (followers + adoption-curious). | B1, A1 | done |
| B5 | Seed posts — ~6 shelter-authored posts (3 dog spotlights, 1 adoption celebration, 1 volunteer-recruit blurb, 1 general), ~4 walker-authored posts tagging specific dogs ("Walked Bára at Stromovka today"). Posts use existing `Post` shape; author resolves through new `getPostAuthor` helper handling shelter-as-author. | B1, B2, A3 | done |

---

## Workstream C — Shelter page chrome

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | New route `app/shelters/[id]/page.tsx`. Mirror the Communities detail-page layout (Suspense wrapper, `usePageHeader`, `DetailHeader`, `TabBar`, sub-tab routing via search params). Stub all four tabs initially. | `app/communities/[id]/page.tsx` (prior art) | done |
| C2 | DetailHeader for shelter — logo as 64px avatar (rounded-panel — institutional, not a person), name, location/neighbourhood subline, "Run by …" line that adapts ("the Útulek Liběň team" when no linked staff; avatar-stack later). Verify `DetailHeader` accepts the shape or extend it minimally. | C1 | done |
| C3 | Bottom-nav visibility — extend the `AppNav` regex to keep nav visible on `/shelters/[id]?tab=…`. | `components/layout/AppNav.tsx` | done |
| C4 | Deep-link routing — `?tab=feed` (default) / `?tab=dogs` / `?tab=members` / `?tab=gallery`. Selected-tab state persists via URL. | C1 | done |

---

## Workstream D — Feed tab

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Shelter info card — bio, established year, location/neighbourhood, "Run by …" line, social links chip row. Top of feed. | C2, B1 | done |
| D2 | Dogs-in-care summary card — "12 dogs in care · 3 need walks now · 1 long-stayer." Counts derive from seeded shelter `dogs[]`. Tap routes to Dogs tab. | D1, B2 | done |
| D3 | Post stream — interleaves shelter-authored + walker-authored posts (chronological). Reuses `MomentCardFromPost`. Posts about a specific dog deep-link to the Dog Profile from the tag. | B5, F1 | done |

---

## Workstream E — Dogs tab

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Single-column photo-led dog card — hero photo, name, breed/age/sex, days-in-kennel, last-walked subline, tag chips, adoption-status pill (when not "available"). Tap → `/dogs/[id]`. New component `components/shelters/ShelterDogCard.tsx`. | B2, F1 | done |
| E2 | Default sort: "Needs walks now" — orders by `lastWalkedAt` ascending (oldest first), with never-walked-yet dogs at the top. | A2, E1 | done |
| E3 | Sort pills — "Needs walks now" (default) / "Recently arrived" / "Long-stayers" / "All". No-leaderboard discipline (no "Walk count" sort). | E2 | done |
| E4 | Long-stayer tag chip surfaces on cards where `daysInKennel >= 30`. Visible language for tags shared with E1. | E1, A2 | done |

---

## Workstream F — Minimal Dog Profile

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | New route `app/dogs/[id]/page.tsx`. Hero photo + name + breed/age/sex (the spine that Dog Profile phase deepens). | A2 | done |
| F2 | Backstory blurb + kennel stats (days in care, last walked, source if known). | F1 | done |
| F3 | Tags chip row (Solo only, Reactive, Long-stayer, etc.) + adoption-status pill. | F1 | done |
| F4 | "Recent walkers" row — small avatar stack (names only, directory-style for this phase). NO walker journey CTAs ("Schedule a walk"); those land with the credentialing-moat phase. | F1, B3 | done |
| F5 | "Posts about Bára" section — filters posts by tag where `type === "dog"` and `id === dog.id`. Stub-friendly: zero posts → empty state. | F1, B5 | done |
| F6 | Backlink to shelter ("Cared for by Útulek Liběň") routes to `/shelters/[id]`. | F1 | done |

---

## Workstream G — Members tab

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| G1 | Filter pills — All / Walkers / Supporters / Team. Team renders only when `team?.length > 0`. | A1, B3, B4 | done |
| G2 | PersonRow rendering — single badge per row: Walker → "Walker · Útulek Liběň" affiliation chip (no tier intensification this phase); Supporter → "Supporter" chip; Team → "Staff" chip (if/when seeded). | [[implementation/badges]] (PersonRow rule), B3, B4 | done |
| G3 | Sort default — most-recent activity (vouchedAt / supporter since / staff link recency). NOT walk count — no scoreboard. | B3, B4 | done |
| G4 | Counts in section subline — "12 walkers · 18 supporters" — derived from data. | G1 | done |

---

## Workstream H — Gallery tab (stub)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| H1 | Empty-state stub — placeholder copy "Photos from walks and shelter posts will land here." No surface logic; ships chrome only. Photos & Galleries phase fills it in. | [[OQ §12]], [[OQ §14]] | done |

---

## Workstream I — Doc updates

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| I1 | Create `docs/features/shelters.md` — the canonical home for shelter UX (account model, tab structure, walker tier model, anti-scoreboard discipline, deferred items). Folds in the resolutions currently inline in §14. Pattern: lift from the Open Question; leave the §14 resolved-marker pointing here. | [[OQ §14]] | done |
| I2 | Update `User Archetypes.md` — add shelter walker as a fifth entry-persona ramp (the no-dog-of-their-own path). Per Cold-Start Playbook. | [[Cold-Start Playbook]] | done |
| I3 | Update `Content Visibility Model.md` — shelter-owned dogs inherit `ShelterProfile.tagApproval`. One paragraph in the existing tag-approval section. | [[OQ §12]] | done |
| I4 | Update `Trust & Connection Model.md` — add forward cross-reference to shelter walker credentialing for the credentialing-moat phase. | [[OQ §14]] | done |
| I5 | Update `Cold-Start Playbook.md` `last-reviewed` after this phase confirms the dog-as-unit framing in shipped code. | [[Cold-Start Playbook]] | done |
| I6 | Update `CLAUDE.md` if any new principle lands (shelter avatar shape, route convention, etc.). | — | done |
| I7 | Update `features/connections.md` `last-reviewed` (stale at 2026-04-30) — touch-only review if no content change needed. | — | done |

---

## Acceptance Criteria

The phase thesis is: **Doggo accepts shelters as a first-class entity, with a complete page chrome and content depth that lets a tester land on Útulek Liběň, browse the dog roster, tap through to a dog, and forget the page didn't exist last week.**

- [ ] `/shelters/utulek-liben` renders a working page with all four tabs reachable
- [ ] Feed tab shows the shelter info card, dogs-in-care summary, and interleaved post stream
- [ ] Dogs tab lists ≥6 dogs in single-column photo-led cards, defaults to "Needs walks now," supports the four sort pills
- [ ] Tapping a dog card lands on `/dogs/[id]` with hero, backstory, kennel stats, tags, recent walkers, dog-tagged posts, and a backlink to the shelter
- [ ] Members tab shows walkers and supporters with the All / Walkers / Supporters filter pills; Team filter only appears when seeded
- [ ] Members rows show a single badge (affiliation chip — tier intensification belongs to credentialing-moat phase)
- [ ] Gallery tab renders as a polite stub
- [ ] Bottom-nav stays visible on all four shelter sub-tabs
- [ ] No walker-journey CTAs anywhere (no "Schedule a walk," no booking flow, no visit reports) — those land later
- [ ] Walks through cleanly in the walkthrough doc (`docs/phases/shelter-foundation-walkthrough.md`, created as the phase closes)
- [ ] All scope deferrals from "Pre-build audit" remain deferred (no scope sprawl into credentialing, walker journey, or Photos & Galleries)

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Sweep the walkthrough's "Decisions surfaced" section — propagate each entry to its home feature/strategy doc per the `→` annotation
- [ ] Update `docs/features/shelters.md` with anything that drifted from this board during build
- [ ] Update Open Questions log — close §14 sub-items resolved this phase; add any new ones (especially around walker journey since this phase only does the static side)
- [ ] Update ROADMAP.md only if upcoming scope shifted (likely: Dog Profile phase scope tightens once we see the minimal version shipped)
- [ ] Review CLAUDE.md — if shelter avatar shape, route convention, or principles changed, update
- [ ] Review Punch List items added during the phase — update affected feature docs
- [ ] Archive this phase board AND walkthrough — copy to `archive/phases/`, mark `status: archived`, then `git mv`
- [ ] **Structural audit:**
    - `grep -rl "status: archived\|status: complete" docs/phases/` → expect only `_phase-template.md`
    - No filename overlap between `docs/phases/` and `docs/archive/phases/`
    - No `last-reviewed` older than 21 days in `strategy/`, `features/`, `implementation/`
    - No dead references in `README.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md`
- [ ] **Strategic review** — read OQ + ROADMAP + relevant strategy docs + next phase scope. Brief on: what changed about our understanding (especially around the merged credentialing-moat phase now that the shelter side is real), open questions worth resolving now, alternatives/challenges, research suggestions (real Útulek Liběň conversation prerequisites?), next-phase readiness (Dog Profile phase scope — does the minimal version we shipped change what the deepening phase needs to do?).

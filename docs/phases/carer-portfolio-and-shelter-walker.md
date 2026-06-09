---
status: active
last-reviewed: 2026-06-08
review-trigger: When any task is completed or blocked; at the mid-phase Carer-Portfolio-side ship
---

# Carer Portfolio + Shelter Walker Credentialing

> **The merged credentialing-moat phase.** Same thesis — *verifiable credentials accumulating from real engagement* — applied to two domains: cross-platform Carer Portfolio aggregate badges (Carer / Experienced Carer / Trusted Carer) and per-shelter institutional walker tiers (Volunteer / Regular Volunteer / Super Volunteer). The two share visual escalation language and TrustBadgeStrip placement; the merge is what makes the shared infrastructure worth building once.
>
> **Opened 2026-06-08** after the Help a Dog Discover door close — the front door for shelter dogs now exists; this phase ships the walker journey behind it AND the Carer Portfolio aggregate badge that lets Klára's profile read as "Trusted Carer · 47 sessions" in the V2 demo narrative.
>
> Originally drafted 2026-05-11 (Profiles Deep Pass) as Carer-Portfolio-only. Scope expanded 2026-06-02 to add Circle Attribution (Workstream E) and Review form (Workstream F). Merged with Shelter Walker Credentialing per the 2026-06-01 strategy conversation (Open Questions §7 + §8 + §14); merge formalized in the board on 2026-06-08.

**Goal:** Completed engagement becomes a visible trust credential across two domains:

1. **Carer side** — A carer's profile carries an aggregate "{tier} · {N} sessions" badge (Carer 3–9 outlined / Experienced Carer 10–24 filled / Trusted Carer 25+ filled+ring) computed from `Booking` records where `state === "completed"` plus `MeetAttendee` records on past hosted meets. Circle attribution on Discover ("{N} in your circle have booked them") + named reviews from completed bookings.
2. **Shelter walker side** — Walker → UserProfile bridge so walkers exist as actual users. The journey from "I see a dog I'd walk" to "I'm booked to walk her": apply → vouch → vetted → first walk → tier progression. Per-shelter institutional tiers (Volunteer / Regular Volunteer / Super Volunteer) with the same visual escalation language as the Carer aggregate. In-circle elevation on `/discover/help-a-dog` lights up once walkers bridge to UserProfiles.

**Thesis.** The platform already records every booking completion, every meet attendance, and (now) every shelter walk session. Those are two-sided ground truth (engaged → delivered → record exists). Surfacing them as trust signals — with shared visual language for the credential ladder — is the credentialing-layer moat per [[Cold-Start Playbook]] → "The credentialing-gap moat" + "Walker credentialing as a shelter trust layer."

**Depends on:**
- Existing `Booking` records with `state: "completed"` (Carer side aggregation).
- Existing `MeetAttendee` records on past hosted meets (Carer side aggregation).
- Existing `TrustBadgeStrip` + `lib/trustBadges.ts` badge system (extend, don't replace).
- Shelter Foundation (2026-06-02) — `ShelterProfile`, `/shelters/[id]`, shelter dog page, walker tier model (data shape; visual escalation deferred to this phase).
- Help a Dog Discover door (2026-06-08) — front door exists; this phase ships the journey behind it.
- Sessions & Service Execution (2026-05-08) — Start → Finish → Visit Report flow reused for shelter walks.

**Refs:** [[implementation/badges]], [[features/shelters]], [[strategy/Trust & Connection Model]], [[strategy/Groups & Care Model]], [[strategy/Cold-Start Playbook]], [[planning/Open Questions & Assumptions Log]] §7 + §8 + §14.

**Not in scope:**
- **Photo-tag-based portfolio** (rejected by §8 resolution — engagement records only).
- **Dog-level credit** (a list of named dogs the carer trained) — declined as non-consensual leak. Aggregate counts only.
- **Anonymised review excerpts to non-Connected viewers** — Workstream E shows reviewer name only to viewers Connected to the reviewer; outside that, count is shown without attribution.
- **Shelter operator/admin view** (dog edit, walker application queue, dashboard) — V3+.
- **Full vouching state-machine UX** — demo fakes the happy path with state-toggle; real implementation is post-demo.
- **Adopted-dog transition pattern** — V2.
- **Insurance / liability layer** — operational not product. Acknowledged in [[Cold-Start Playbook]].

---

## Sequencing

**Ship the Carer Portfolio side first** (Workstreams A–F) — locks in the shared visual escalation language for the credential ladder. Walker tier badges (H) inherit it.

After the Carer Portfolio half ships, open the Shelter Walker side (Workstreams G–M). They share the badge infrastructure; only G (walker → UserProfile bridge) needs to land before the rest of the shelter walker work begins.

**Mid-phase checkpoint:** when Workstreams A–F are done, walk through the Carer Portfolio acceptance criteria as a sub-ship before moving on. Treat it as a phase-within-the-phase.

---

## Opening Checklist

Completed 2026-06-08.

- [x] Read every task and its referenced docs (ROADMAP, badges.md, shelters.md, Cold-Start Playbook, Open Questions §7+§8+§14, archived Help a Dog board, Trust & Connection Model, Groups & Care Model)
- [x] Confirm Open Questions §8 resolutions (threshold, surface, copy, time scope, unit naming) locked — done 2026-06-01.
- [x] Audit `Booking` seed sufficiency for `state: "completed"` — assumed believable from prior phases (Klára especially); verify during Workstream A3.
- [x] Audit `MeetAttendee` seed sufficiency for past hosted meets — assumed believable from Mock World Building + Demo Narrative V2; verify during Workstream A3.
- [x] Re-read `lib/trustBadges.ts` — extend the existing pattern, don't fork it (D2 of Workstream B).
- [x] Review Open Questions log §7 (resolved), §8 (resolved with rich detail), §14 (resolved + two new open items 2026-06-08).
- [x] Audit for conflicts between phase plan and current codebase — six surfaced, captured below.
- [x] Update referenced docs older than 2 weeks — all reviewed ≤ 7 days. None updated.
- [x] Scan punch list for overlap — P67 (component consolidation), P51 (Familiar/Connected chip alignment), P60b (Carer sub-spec picker UI). None phase-blocking; adjacent quality work only.
- [x] Confirm scope — Carer-Portfolio-only board renamed + restructured; Shelter Walker side added (G–M); F kept in scope per design call.

### Conflicts surfaced during opening

1. **Board predates the merge.** Existing `carer-portfolio.md` (last-reviewed 2026-06-02) was Workstreams A–F only. Renamed to `carer-portfolio-and-shelter-walker.md`; added G–M for the shelter walker half.
2. **Walker tier names diverged.** Board + Roadmap row + §8 used "Vetted/Experienced/Trusted Walker." Shelter Foundation shipped "Volunteer / Regular Volunteer / Super Volunteer" with violet + Leaf/Plant/Tree icons. `features/shelters.md` is the source of truth on shipped state. This board uses the shipped names throughout. Roadmap row update follows at phase close (don't pre-emptively edit ROADMAP per "Roadmap is a compass, not a changelog" doc-hygiene rule).
3. **Visual escalation (outlined → filled → filled+ring) was sized as shared.** Shelter Foundation deferred it to this phase. Aligned with merge thesis; ships here on both sides. See Workstream B + H.
4. **Walker → UserProfile bridge not on prior board.** Now Workstream G — infrastructure prereq for H, I, K, L.
5. **Two new Open Questions opened 2026-06-08.** Walker-circle elevation on `/discover/help-a-dog` (in scope — see Workstream K). Thin-shelter content-authoring authority (defer; flagged in Workstream M).
6. **Workstream F (Review form) sits between domains.** Kept in scope per design call — F1 is prerequisite for E3 (circle-attribution review excerpts). Acceptable risk: if the merged phase feels overstuffed at the mid-phase checkpoint, split F into its own follow-up.

---

## Design Decisions

Captured 2026-06-08 at phase open. Decisions land here so build steps target fixed values.

### D1 — Shipped walker tier names + visual system

This phase uses the names Shelter Foundation shipped:

| Tier | Icon | Label | Threshold (typical) |
|---|---|---|---|
| `vetted` | 🍃 Leaf | Volunteer | Default after vouching |
| `experienced` | 🌱 Plant | Regular Volunteer | ~10 walks at this shelter |
| `trusted` | 🌳 Tree | Super Volunteer | ~25 walks + coordinator sign-off |

Color violet (`#ede9fe` bg / `#5b21b6` text) per Shelter Foundation. Visual escalation (outlined → filled → filled+ring) added in Workstream H — same intensification language as the Carer aggregate badge (B).

### D2 — Shared visual escalation language

Outlined → filled → filled+ring carries the credential ladder for BOTH:

- **Carer aggregate badge** (B2): Carer (outlined) / Experienced Carer (filled) / Trusted Carer (filled+ring).
- **Walker tier badge** (H1): Volunteer (outlined) / Regular Volunteer (filled) / Super Volunteer (filled+ring).

One CSS pattern, two consumers. Implementation: a shared `.credential-pill--{tier}` modifier set used by both `TrustBadgeStrip` (Carer aggregate) and `.shelter-member-chip--volunteer` (walker badge). Build the Carer side first (B), refactor walker side to inherit (H).

### D3 — Walker → UserProfile bridge model

Today `ShelterWalker` is a denormalized record on the shelter. Bridge model: walker records gain an optional `userId` field pointing at a `UserProfile`. When set, walker's profile surface (avatar, name link, posts authored) resolves through the user. When unset, falls back to current directory-style behavior (already used by shelter posts via `resolveAuthorAvatarUrl` / `resolveAuthorHref`).

Demo seeds 4–6 anchor walkers as bridged (UserProfile-backed); rest stay directory-style. This avoids ballooning the user roster while letting circle attribution + cross-shelter affiliation work for the bridged subset.

### D4 — Booking shape supports shelter-dog reference

Don't fork. Overload existing `Booking`: petId resolves through a new `getDogById` (or extend the existing) that checks both `UserProfile.pets[]` and `ShelterProfile.dogs[]`. Owner side of the booking carries the shelter for shelter walks (ownerId points to a shelter-account UserProfile shim, or — likely cleaner — a new `ownerKind: "user" | "shelter"` discriminator on Booking). Decide concretely in Workstream I scoping.

### D5 — My Schedule integration

Shelter walks attach under the existing Bookings tab — same surface as paid care. Session-detail surface uses the shipped Pet-as-protagonist pattern; the "owner" slot resolves to the shelter (logo + name as the contact context). No new "Volunteer walks" subsection — keeps the surface coherent and matches anti-scoreboard discipline (volunteer walks are bookings, full stop).

### D6 — Vouching state machine (demo scope)

Four states per §14: `applied → invited → vouched → vetted`. Demo ships:

- `applied`: walker submits via the existing "Walk a dog" sheet (now collecting handle + attestation + a brief why-walk-here paragraph).
- `invited`: shelter "responds" via an in-context system message — fake-shelter behavior triggered by a state-toggle (no operator UI).
- `vouched`: another state-toggle confirms after the simulated in-person visit. Walker now appears in the shelter's Members tab as `Volunteer`.
- `vetted`: synonym for vouched in demo; reserved for post-demo if we add a deeper credentialing layer.

Real implementation post-demo. The state-machine shape is honest about what's faked.

### D7 — In-circle elevation on /discover/help-a-dog

Section-level pattern (matches Discover Care). Two sections:

```
[ In your circle ]      ← Dogs you've walked + Shelters your circle volunteers at
[ Other shelter dogs ]  ← everything else
```

Uses the same `ResultsSectionHeader` `in-circle` variant. Lights up once walker → UserProfile bridge exists (depends on G). Pre-builds a placeholder slot in the page layout so the wire-up at the end of Workstream K is one-line.

### D8 — Walk eligibility check

Three-axis composition (already documented in `features/shelters.md`):
1. Walker tier (Volunteer / Regular Volunteer / Super Volunteer).
2. Per-shelter policy (`ShelterPolicy.groupWalksPermitted`).
3. Per-dog policy overrides (`PetProfile.soloOnly`, `PetProfile.experiencedHandlersOnly`).

Strictest rule wins. Surfaces as: the "Book a walk" affordance on `/dogs/[id]` carries an eligibility check; below-threshold viewers see an explanatory state (e.g. "This dog needs a Regular Volunteer or higher"). Per-shelter group-walk policy carries through to whether the booking flow offers Solo or Group options.

### D9 — Cross-shelter affiliation on /profile/[id]

New "Volunteer work" section on user profiles (between Carer info and Posts). Renders per-shelter affiliation chips with tier (e.g. `Regular Volunteer at Útulek Liběň · 14 walks`). Multi-shelter walkers render a chip stack; single-shelter renders one chip. Section omitted entirely when the user has zero shelter affiliations.

Open detail per §14: whether the section header carries an aggregate ("Vetted at 3 shelters · 47 walks") or stays per-shelter only. Decide in Workstream L design — recommend per-shelter only for V1 (matches anti-scoreboard discipline; aggregate framing risks reading as a leaderboard signal).

### D10 — Thin-shelter walker rosters

Pes v nouzi + Druhá šance shipped with empty walker rosters. Demo can stay honest by leaving them empty (small rescues genuinely run thin) OR seed each with 1–2 bridged walkers. Recommend: **stay empty.** Demo richness comes from Útulek's walker pool; thin rosters communicate the demographic reality that small rescues often don't have credentialed walker pools yet — which is part of what Doggo's credentialing layer is meant to address. Flag for revisit at phase close.

---

## Workstreams — Carer Portfolio side (ships first)

### Workstream A — Aggregate computer

| # | Description | Refs | Status |
|---|-------------|------|--------|
| A1 | Helper `getCompletedEngagements(userId, options?)` in `lib/trustBadges.ts`. Returns `{ bookings: number, sessions: number, dogs: number, sinceDate: string }`. | | todo |
| A2 | Time-scope variants. §8 resolved as all-time for V1 — expose `getCompletedEngagementsAllTime(userId)` as the default; reserve a `ThisYear` variant for future use. | | todo |
| A3 | Mock data sanity check — log persona aggregates, verify believable. Klára high; Tereza modest; Daniel + Tomáš near-zero. | | todo |

### Workstream B — Aggregate badge: design + render

| # | Description | Refs | Status |
|---|-------------|------|--------|
| B1 | Add the badge to `TrustBadge` taxonomy (`lib/trustBadges.ts`). Type: community-earned. Threshold: ≥3 (per §8). | [[badges]] | todo |
| B2 | Three visual states per D2: outlined (3–9) / filled (10–24) / filled+ring (25+). Implement via `.credential-pill--{tier}` modifier set, designed for reuse by Workstream H. **Also render the three states in `/styleguide/components`** so the user can sign off on the visual jump (especially top-tier filled+ring) before B4 lands the badge on profile surfaces — per walkthrough O1 resolution. | D2 | todo |
| B3 | Copy format `"{tier-label} · {N} sessions"` per §8 (a-resolved). Tier labels: Carer / Experienced Carer / Trusted Carer. | | todo |
| B4 | Render in `TrustBadgeStrip` on carer profile hero. | | todo |
| B5 | PersonRow + Discover card propagation per existing priority rule (top 1 / top 2 slots). | | todo |
| B6 | Empty state — below threshold, badge doesn't render (not "0 sessions"). | | todo |

### Workstream C — Cross-surface visibility audit

| # | Description | Refs | Status |
|---|-------------|------|--------|
| C1 | Public-vs-circle Carer audience — for `publicProfile: false` carers, badge respects circle-Carer privacy rule. | | todo |
| C2 | Locked profile — badge surfaces appropriately gated by relationship. | | todo |
| C3 | Viewer matrix walkthrough — Stranger / Familiar / Pending / Connected. | | todo |

### Workstream D — Mock data calibration

| # | Description | Refs | Status |
|---|-------------|------|--------|
| D1 | Calibrate engagement counts across personas + bridged carers (olgaM, marketaH, janaK, etc.). | | todo |
| D2 | Carer-side phase walkthrough — each persona's carer profile shows the right badge (or correctly hides). | | todo |

### Workstream E — Circle attribution

| # | Description | Refs | Status |
|---|-------------|------|--------|
| E1 | Helper `getCircleAttribution(viewerId, providerId)` — returns `{ count, attributedReviews }`. Privacy gate: reviewer names only to Connected viewers. | | todo |
| E2 | Discover Care card — "{N} in your circle have booked them" row when count ≥1. Wins over "Met at N walks" when both fire. | E1 | todo |
| E3 | Provider profile — "Booked by people you know" section on About tab. Connected → named PersonRow + review excerpt; non-Connected → anonymous row. | E1, F1 | todo |
| E4 | Mock data — calibrate bridged carers so each persona sees believable counts. Klára needs 1–2 of Daniel's connections to have booked her. | E1, D1 | todo |
| E5 | Empty state — silent absence when count === 0. | E2 | todo |

### Workstream F — Review form

| # | Description | Refs | Status |
|---|-------------|------|--------|
| F1 | `BookingReview` data shape + `ReviewsContext` (mirrors `BookingsContext`). | | todo |
| F2 | Review form modal — Pet-as-protagonist hero, 5-star rating, optional text. | F1 | todo |
| F3 | Submission flow — `BookingReview` record + system message in booking conversation. | F1, F2 | todo |
| F4 | Provider profile — Reviews section on About tab. | F1 | todo |
| F5 | Aggregate display — average-star rating + review count on profile hero + Discover Care cards. | F1, F4 | todo |
| F6 | Mock data — backfill reviews across completed bookings. Mix 4–5★ (warm); occasional 3★ (texture); no negative reviews seeded. | F1, D1 | todo |
| F7 | Stub cleanup — "Leave a review" button now opens the real form. | F2 | todo |

### Mid-phase checkpoint — Carer Portfolio acceptance

Run before opening the Shelter Walker side:

- [ ] Aggregate computer correct across personas (A)
- [ ] Badge renders with three visual states + correct thresholds (B)
- [ ] Below-threshold suppression works (B6)
- [ ] Circle-only Carers' badge respects audience-visibility rule (C1)
- [ ] Discover Care + provider profile carry circle attribution (E2, E3)
- [ ] Reviews can be submitted; flow lands on profile + system message + aggregate display (F2–F5)
- [ ] Mock data reads believable
- [ ] `badges.md` updated with the aggregate badge spec
- [ ] `features/explore-and-care.md` updated — review form no longer in Future
- [ ] TypeScript compiles clean

---

## Workstreams — Shelter Walker side (ships after Carer Portfolio mid-phase)

### Workstream G — Walker → UserProfile bridge

| # | Description | Refs | Status |
|---|-------------|------|--------|
| G1 | Add optional `userId` to `ShelterWalker` shape. When set, walker's avatar/name/posts resolve through the linked `UserProfile`. | D3 | todo |
| G2 | Update `resolveAuthorAvatarUrl` + `resolveAuthorHref` to prefer linked-user when bridged; fall back to directory-style. | D3 | todo |
| G3 | Seed 4–6 anchor walkers as bridged across the three shelters. Pick walkers Klára-adjacent so the demo narrative connects walker work to her credentialing. | D3, M1 | todo |
| G4 | `getWalkerAffiliations(userId)` helper — returns `{ shelterId, tier, walkCount }[]` for any user. Underlies Workstreams K + L. | G1, G3 | todo |

### Workstream H — Walker tier badge: visual escalation

| # | Description | Refs | Status |
|---|-------------|------|--------|
| H1 | Apply the `.credential-pill--{tier}` modifier set (built in B2) to `.shelter-member-chip--volunteer`. Three states: Volunteer (outlined) / Regular Volunteer (filled) / Super Volunteer (filled+ring). Violet retained. | D1, D2, B2 | todo |
| H2 | Verify the icon shape progression (Leaf/Plant/Tree) still renders correctly alongside the new intensification. The icon AND the fill carry the signal — belt-and-suspenders is OK; readers shouldn't have to rely on either alone. | H1 | todo |
| H3 | Update `features/shelters.md` → Volunteer badge section: remove "Visual escalation deferred" line; document the shipped escalation. | H1 | todo |

### Workstream I — Walker journey (apply → vouch → vetted → first walk)

| # | Description | Refs | Status |
|---|-------------|------|--------|
| I1 | Extend the "Walk a dog" sheet on `/shelters/[id]` + `/dogs/[id]` to collect: walker handle (current user), brief attestation ("I understand the dog's needs and shelter policy"), optional why-walk-here paragraph. Submit → lands a `ShelterWalkerApplication` record. | D6 | todo |
| I2 | `ShelterWalkerApplication` data shape — `{ id, walkerId, shelterId, state: "applied" \| "invited" \| "vouched" \| "vetted", submittedAt, attestation, message? }`. Persisted via `usePersistedState`. | D6 | todo |
| I3 | System message lands in the walker's inbox from the shelter — fake-shelter response triggered by a state-toggle ("Invite to visit") in the demo persona switcher OR a small dev affordance for walkthrough. | D6 | todo |
| I4 | State-toggle for "Vouched" — once toggled, walker appears in shelter's Members tab as Volunteer (tier `vetted`). Bookings to that shelter's dogs now permitted (per J1). | D6, J1 | todo |
| I5 | Book a walk on `/dogs/[id]` for a shelter dog — new affordance gated by eligibility (J1). Reuses `Booking` shape per D4; reuses Sessions infra (Start → Finish → Visit Report). Visit report seals to the dog's profile via existing tag-the-dog plumbing. | D4, J1 | todo |
| I6 | Tier progression triggers — `getWalkerTier(walkerId, shelterId)` reads booking count + checks the coordinator sign-off toggle for Super Volunteer. Demo: state-toggle for sign-off; thresholds auto-apply (10 walks → Regular, 25 + sign-off → Super). | I5 | todo |
| I7 | My Schedule — shelter walks attach under the existing Bookings tab per D5. Booking detail's "owner" slot resolves to the shelter (logo + name). | D5, I5 | todo |

### Workstream J — Walk eligibility check

| # | Description | Refs | Status |
|---|-------------|------|--------|
| J1 | `canWalkDog(walkerId, dogId)` helper — three-axis composition per D8. Returns `{ permitted: boolean, reason?: string }`. | D8 | todo |
| J2 | Wire to the "Book a walk" affordance on `/dogs/[id]`. Below-threshold viewers see an explanatory state. | J1 | todo |
| J3 | Per-shelter group-walk policy carries through to the booking flow's Solo / Group option. Group hidden when shelter policy or dog policy forbids. | J1 | todo |

### Workstream K — In-circle elevation on /discover/help-a-dog

| # | Description | Refs | Status |
|---|-------------|------|--------|
| K1 | Pre-build a placeholder section slot in `/discover/help-a-dog/page.tsx` (Dogs view). Empty until G ships. | D7 | todo |
| K2 | Implement section-level elevation per D7: "In your circle" section (dogs the viewer's circle has walked + shelters they volunteer at) + "Other shelter dogs" section. Uses `ResultsSectionHeader` `in-circle` variant. | G4, D7 | todo |
| K3 | Shelters pill equivalent — "Shelters your circle volunteers at" section above other shelters. | G4, D7 | todo |
| K4 | Resolve §14 open item — close the row-level-vs-section-level question with the section-level resolution + reference this workstream. | D7 | todo |

### Workstream L — Profile cross-shelter affiliation

| # | Description | Refs | Status |
|---|-------------|------|--------|
| L1 | "Volunteer work" section on `/profile/[id]` — between Carer info and Posts. Per-shelter chips per D9: `{tier-label} at {shelter} · {N} walks`. | D9, G4 | todo |
| L2 | Per-shelter chips link to the shelter detail page. Multi-shelter walkers render a chip stack; section omitted entirely for zero affiliations. | L1 | todo |
| L3 | Section header treatment — V1 stays per-shelter (no aggregate framing). Doc decision in `features/profiles.md`. | D9 | todo |

### Workstream M — Mock data + walker-side seeding

| # | Description | Refs | Status |
|---|-------------|------|--------|
| M1 | Seed 4–6 bridged walkers (per G3). Pick names + UserProfiles that anchor the Daniel/Klára narrative; one bridged walker should be in Daniel's circle (sets up the in-circle elevation demo). | G3 | todo |
| M2 | Backfill walk counts on the bridged walkers to land them at varied tiers — at least one Super Volunteer (Tree, filled+ring) for visual escalation showcase. | M1, I6 | todo |
| M3 | Thin shelters (Pes v nouzi + Druhá šance) — stay empty per D10. Document the choice in `features/shelters.md` as intentional demographic representation, not a backlog item. | D10 | todo |
| M4 | Phase walkthrough — Daniel discovers a dog via `/discover/help-a-dog` → applies to walk → state-toggles his way through vouching → books a walk → completes session → visit report seals → tier-progression visible on his profile + Útulek Members tab. End-to-end. | I1–I7 | todo |

---

## Closing Checklist

- [ ] Walk through every Carer Portfolio acceptance criterion against the running app (mid-phase checkpoint)
- [ ] Walk through every Shelter Walker acceptance criterion against the running app (full phase close)
- [ ] Update `badges.md` — aggregate badge spec + walker tier visual escalation update
- [ ] Update `features/shelters.md` — Volunteer badge section, walker journey description, "Deferred" list trimmed
- [ ] Update `features/profiles.md` — Volunteer work section spec
- [ ] Update `features/explore-and-care.md` — review form no longer in Future
- [ ] Update Open Questions log — close §8 Carer Portfolio entry, close §14 walker-circle elevation entry, update §14 thin-shelter content-authoring authority with the empty-by-design resolution
- [ ] Update ROADMAP.md only if upcoming scope shifted (likely small adjustment — credentialing-moat phase complete)
- [ ] Review CLAUDE.md — update if the merged credentialing layer affects key principles or trust model framing
- [ ] Archive this phase board + walkthrough (`git mv` to `docs/archive/phases/`, status: archived in frontmatter)
- [ ] Structural audit (per CONTRIBUTING.md → Closing Checklist 9a)
- [ ] **Strategic review** — does this land the credentialing-layer moat? Does Klára's profile carry the credibility weight it should? Does the walker journey honor the anti-scoreboard discipline? Feed observations back into Cold-Start Playbook.

---

## Build punch list — for the next session

Sequenced for the Carer Portfolio half first. Each line is one focused commit (or close to it). Walk down the list — don't reshuffle.

**Carer Portfolio half (ship target — phase mid-point):**

1. **A1** — `getCompletedEngagements(userId)` in `lib/trustBadges.ts`. Returns the four fields per spec.
2. **A2** — `getCompletedEngagementsAllTime` exported as the V1 default.
3. **A3** — Log persona aggregates during seeded data + sanity-check against D1.
4. **B1** — Add badge entry to `TrustBadge` taxonomy.
5. **B2** — `.credential-pill--{tier}` modifier set + render the three states in `/styleguide/components` for user sign-off before B4. Build the CSS now so H1 inherits.
6. **B3** — Copy format `"{tier-label} · {N} sessions"`. Wire the three tier labels.
7. **B4 + B5** — Render in TrustBadgeStrip; PersonRow + Discover card propagation via existing priority rule.
8. **B6 + C1 + C2 + C3** — Threshold + visibility audit, in one commit.
9. **D1** — Mock data calibration commit — persona aggregates believable.
10. **F1 + F2** — Review form data shape + modal (lands the prereq for E3).
11. **F3 + F4 + F5** — Submission flow + Reviews section + aggregate display.
12. **F6 + F7** — Mock review backfill + stub cleanup.
13. **E1** — `getCircleAttribution` helper.
14. **E2** — Discover Card "{N} in your circle have booked them" row.
15. **E3** — Provider profile "Booked by people you know" section.
16. **E4 + E5** — Mock data + empty-state handling.
17. **D2** — Carer-side phase walkthrough.
18. **Mid-phase checkpoint** — run through acceptance criteria.

**Shelter Walker half (after mid-phase checkpoint):**

19. **G1 + G2** — Bridge the data shape + author resolvers.
20. **G3** — Seed 4–6 bridged anchor walkers.
21. **G4** — `getWalkerAffiliations` helper.
22. **H1 + H2 + H3** — Walker tier visual escalation refactored to inherit B2's modifier set; docs updated.
23. **J1** — `canWalkDog` eligibility helper.
24. **I1 + I2** — Application form + data shape.
25. **I3 + I4** — Vouching state machine (system message + state-toggle).
26. **I5** — "Book a walk" affordance on `/dogs/[id]` + booking flow integration.
27. **I6** — Tier progression triggers.
28. **I7** — My Schedule integration.
29. **J2 + J3** — Eligibility surfaces in booking flow + group/solo option gating.
30. **K1** — Placeholder elevation slot on `/discover/help-a-dog`.
31. **K2 + K3** — In-circle elevation lit up (Dogs + Shelters pills).
32. **K4** — Close §14 walker-circle elevation question.
33. **L1 + L2 + L3** — "Volunteer work" section on `/profile/[id]`.
34. **M1 + M2** — Walker-side mock data calibration + visual showcase.
35. **M3** — Thin-shelter empty-roster decision documented in `features/shelters.md`.
36. **M4** — End-to-end Daniel walker journey walkthrough.

Estimated: 4–6 focused build sessions. Carer Portfolio half ~2 sessions; Shelter Walker half ~2–4 sessions.

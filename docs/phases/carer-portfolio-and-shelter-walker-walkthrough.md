---
status: active
last-reviewed: 2026-06-08
review-trigger: "Update as items are walked, edit as scope adjusts"
tags: [walkthrough, credentialing, carer-portfolio, shelter-walker]
---

# Carer Portfolio + Shelter Walker Credentialing — Walkthrough

Verification scaffold for the merged credentialing-moat phase. Pinned to two phase theses:

1. **Carer side** — does a carer's profile carry the right credential weight from accumulated engagement? Does Klára's "Trusted Carer · 47 sessions" badge land Daniel's booking decision in V2?
2. **Shelter walker side** — does the walker journey honor the anti-scoreboard discipline while showing that credentials accumulate? Does the in-circle elevation on `/discover/help-a-dog` light up honestly once walkers bridge to UserProfiles?

Items are scaffolded at phase open; they sharpen as workstreams land. Items prefixed `(pre-build)` are projected — refine descriptions when the workstream ships.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, `/demo`, or `?as=<personaId>`.
3. Walk top-to-bottom — categories ordered by "needs your eyeballs most" → "least."

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), New User.

**Phase seed data note:** Carer-side aggregate counts are calibrated in D1 (Klára high → Trusted Carer; Tereza modest → Carer; Daniel + Tomáš no badge). Walker-side seeding adds 4–6 bridged walkers in M1 spanning the three shelters; thin shelters (Pes v nouzi + Druhá šance) stay empty-walker by design (D10).

---

## Open for your call

Decisions made at phase open that another reasonable person could land differently. The build proceeds against these defaults; flag here if any should flip. Each item points at the closest live surface so you can evaluate the call in context — even when the proposed surface doesn't exist yet, the BEFORE state is usually enough to anchor the question.

- [x] **O1. Shared three-tier credential pill via saturation ramp + icon escalation + label change.** D2 commits both the new Carer aggregate badge and the existing walker tier badge to the same shared `.credential-pill` family with three composable tier modifiers (`--tier-1` / `--tier-2` / `--tier-3`).
  - **Resolved 2026-06-08:** ship a saturation ramp instead of the originally-sized outlined → filled → filled+ring intensification (rejected because the outer ring extended past the chip's bounding box and varied size across tiers). New mechanic: **Tier 1** neutral inset surface + family-color text muted ~80%/20% via `color-mix` + NO icon; **Tier 2** soft family fill + strong family text + family icon (regular weight); **Tier 3** dark family fill + near-white text + filled-weight icon + distinguishing label. Tier 1 and Tier 2 share the short label ("Volunteer" / "Carer"); only Tier 3 distinguishes ("Super Volunteer" / "Trusted Carer"). Session count moves OUT of the pill — consuming surface handles its own subtitle. Saturation ramp runs in BOTH list contexts and profile hero (no uniform-tier-1-in-lists carve-out). Walker icons: Plant (T2) / Tree (T3) — Leaf dropped with T1's icon-removal. Carer icon: Sparkle (T2) / Sparkle fill (T3). CSS family + `/styleguide/components` render landed (commits ed6f4fb → c5e65ae); wiring into TrustBadgeStrip + walker chip is B4 / H1.
- [ ] **O2. Walker → UserProfile bridge — 4–6 anchor walkers, rest stay directory-style.** D3 + G3 keep the user roster from ballooning while making circle attribution + cross-shelter affiliation work for the bridged subset.
  - **See the directory-style walker pool today:** Tereza → `/shelters/utulek-liben?tab=members` (Walkers filter) — 8 walkers shown, none are clickable to a real profile. Pavel D., Helena S., Karolína M. are demo names only — no `/profile/pavel-d` etc.
  - **See an existing bridged "user":** Tereza → tap any persona name in a meet attendee row → real profile loads. That's what bridged walkers will get.
  - **Alternative:** bridge all 8 on Útulek so the Members tab reads as a real user community. Cost: ~3–4 more UserProfiles to author + seed believably across feeds, posts, connections.
- [ ] **O3. Booking shape overloaded, not forked, for shelter-dog references.** D4 takes the overload route: `getDogById` checks both `UserProfile.pets[]` and `ShelterProfile.dogs[]`; a new `ownerKind: "user" | "shelter"` discriminator gates owner-side resolution.
  - **No UI to look at — data-shape call.** Closest analog: skim `lib/types.ts:Booking` + how Sessions infra reads bookings today.
  - **Tradeoff:** overload is cheaper but spreads conditional logic through Booking surfaces (booking detail Sessions tab, My Schedule, system messages); fork is cleaner separation but doubles the count of booking surfaces to maintain.
- [ ] **O4. Vouching state machine is state-toggled in demo, not a theatrical fake.** D6 fakes `applied → invited → vouched` with persona-switcher toggles + system messages, no simulated delays.
  - **See the existing fake-flow pattern this extends:** Tereza → `/shelters/utulek-liben` → tap "Walk a dog" hero CTA — sheet opens, "Express interest" flips to "Interest sent ▾" with a Withdraw option. That single-flip pattern is what the multi-state version will extend.
  - **See the demo's existing theatrical-fake patterns for comparison:** `/demo` walkthrough beats use mid-step interstitials + fire-off step types to simulate time passing.
  - **Tradeoff:** state-toggle reads as an honest demo affordance (clearly faked); theatrical fake reads as a real product moment but risks "where does the time go?" confusion across persona switches.
- [ ] **O5. Section-level in-circle elevation on /discover/help-a-dog, matching Discover Care.** D7 picked section-level over row-level.
  - **See the section-level pattern in production:** Tereza → `/discover/care` — "Carers in your circle" header above "Other carers." That same `ResultsSectionHeader` lands on Help a Dog.
  - **See the current flat list it's replacing:** Tereza → `/discover/help-a-dog` — single ungrouped feed of all shelter dogs.
  - **Concern this raises:** with 4–6 bridged walkers and thin social graphs, the "In your circle" section may be 0–1 items per persona — risks reading as broken when empty. Row-level "Walked by N in your circle" on each card handles sparsity better but breaks pattern coherence with Discover Care.
- [ ] **O6. Cross-shelter affiliation section header — per-shelter chips only, no aggregate framing.** D9 + L3 keep `Volunteer at Útulek Liběň · 14 walks` / `Super Volunteer at Druhá šance · 32 walks` as separate chips, not `Volunteered at 3 shelters · 47 walks` as a single aggregate.
  - **See the closest analog today:** Tereza → `/profile/klara` → her Carer info card. "Dog Trainer" sub-spec, no aggregate framing.
  - **See what the per-shelter chips will look like:** the volunteer pills on Tereza → `/shelters/utulek-liben?tab=members` (Walkers filter) — that's the chip shape that would stack vertically on a profile's "Volunteer work" section.
  - **Tradeoff:** per-shelter chips honor anti-scoreboard discipline (no totals); aggregate framing is honest about cumulative effort across shelters and may matter for cross-platform credibility.
- [ ] **O7. Thin shelters (Pes v nouzi + Druhá šance) stay empty-walker.** D10 — small-rescue demographic honesty over demo richness.
  - **See the thin shelters as they ship today (which IS the proposal):** Tereza → `/shelters/pes-v-nouzi?tab=members` and `/shelters/druha-sance?tab=members` — empty walker + supporter rosters with the "coming soon" framing.
  - **See the populated comparison:** Tereza → `/shelters/utulek-liben?tab=members` (Walkers filter) — 8 walkers.
  - **Alternative:** seed 1 bridged walker each so the thin shelters aren't completely empty. Modest demo richness gain; small honesty cost (real small rescues often do run on zero credentialed walkers).

---

## Worth verifying

Behaviors that need a human at the keyboard. Walker-side items light up only after the bridge ships.

- [ ] **V1. (pre-build) Carer aggregate badge tier thresholds suppress correctly at boundaries.** Tereza → `/profile/tereza` should show "Carer" pill at Tier 1 (3–9 sessions, neutral surface). Klára → `/profile/klara` should show "Trusted Carer" pill at Tier 3 (25+ sessions, dark blue + filled Sparkle), with the session count rendered SEPARATELY as a subtitle below the pill (handled by the consuming surface, not the pill itself). New User → no badge at all (below threshold). Daniel + Tomáš → no badge (not carers). Specifically check the 9/10 and 24/25 boundary cases via mock-data tweaks if necessary.
- [ ] **V2. (pre-build) Circle-only Carer audience respects the badge privacy rule.** Tomáš (not Connected to Tereza) viewing `/profile/tereza` should NOT see the aggregate badge (circle-Carer privacy rule per C1). Daniel (Connected) sees it. Tereza herself (self) sees it. Verify across PersonRow + Discover card propagation too.
- [ ] **V3. (pre-build) Review submission round-trip.** Daniel → a completed booking detail → Leave a review → submit 5★ + text. Verify: review lands in `ReviewsContext`, surfaces in provider profile Reviews section, contributes to aggregate count + average on profile hero + Discover card, system message posts in the booking conversation thread.
- [ ] **V4. (pre-build) Circle attribution shows + hides correctly.** Daniel → `/discover/care` → cards for carers his circle has booked carry "{N} in your circle have booked them." Verify the count matches Connected-only (no Familiar leakage). Cards for carers with 0 connections-in-circle carry no row (silent absence per E5). Klára especially should show 1–2 of Daniel's connections per E4.
- [ ] **V5. (pre-build) Walker journey end-to-end (Daniel persona).** Daniel → `/discover/help-a-dog` → tap a dog → "Walk a dog" → fill application → submit. State-toggle "Invite to visit" → system message lands. State-toggle "Vouched." Daniel now appears in shelter's Members tab as Volunteer. Daniel → `/dogs/[id]` → "Book a walk" affordance now permitted → book → Start session → Finish → seal Visit Report → walk count increments → tier progression visible.
- [ ] **V6. (pre-build) Eligibility check refuses + permits correctly.** Verify `canWalkDog` honors strictest-rule-wins: (a) Volunteer can't book a Solo-only dog when shelter policy doesn't permit her tier; (b) Per-dog `experiencedHandlersOnly` overrides walker tier; (c) Per-shelter `groupWalksPermitted: false` hides the Group option in the booking flow.
- [ ] **V7. (pre-build) In-circle elevation lights up post-bridge.** Once G3 + M1 land, Daniel → `/discover/help-a-dog` should show "Dogs in your circle have walked" / "Shelters your circle volunteers at" sections above other shelter dogs. Verify the elevation is honest (only Connected viewers + walkers Daniel knows surface there). Tomáš (different circle) sees a different elevation set.
- [ ] **V8. (pre-build) Walker tier escalation reads correctly at all three states.** "Volunteer" (Tier 1, neutral surface, no icon) → "Volunteer" (Tier 2, soft violet fill, Plant icon) → "Super Volunteer" (Tier 3, dark violet fill, filled Tree icon). Verify the saturation ramp + the icon appearance/intensification both read at 12px. Útulek Members tab should show varied tiers across the seeded walkers (M2 — at least one Super Volunteer for the showcase).

---

## Surfaces to glance

Phase-thesis confirmation. One look each. Filled in as workstreams ship.

### Carer side (ships first)

- **G1.** (pre-build) Tereza → `/profile/klara` — Trust badge strip carries the "Trusted Carer" pill at Tier 3 (dark blue + filled Sparkle), with "47 sessions" rendered separately as a subtitle below.
- **G2.** (pre-build) Tereza → `/profile/tereza` — Self-view shows her own aggregate badge as a "Carer" pill at Tier 1 (neutral surface), with her session count as a subtitle below.
- **G3.** (pre-build) Tereza → `/discover/care` → Klára's card carries the aggregate badge in the top-2 priority slot, replaces a lower-priority existing badge.
- **G4.** (pre-build) Daniel → `/discover/care` → at least one carer card carries the "{N} in your circle have booked them" row.
- **G5.** (pre-build) Daniel → `/profile/klara` → "Booked by people you know" section under the trust strip with named Connected reviewers + anonymous attribution for non-Connected.
- **G6.** (pre-build) Tomáš → a completed-booking detail → tap "Leave a review" → real form opens (Pet-as-protagonist hero + 5-star rating + textarea), submit lands review on the provider profile.

### Shelter walker side (ships after mid-phase checkpoint)

- **G7.** (pre-build) Tereza → `/shelters/utulek-liben?tab=members` — Walker tier chips render via the shared credential-pill saturation ramp (neutral / soft violet / dark violet) with shipped icon convention (no icon at Tier 1; Plant at Tier 2; filled Tree at Tier 3). Violet retained.
- **G8.** (pre-build) Daniel → `/discover/help-a-dog` → flat list replaced with "In your circle" + "Other shelter dogs" sections. (Lights up once Daniel has at least one connection bridged as a walker.)
- **G9.** (pre-build) Klára → `/profile/klara` — "Volunteer work" section between her Carer info and Posts, showing her per-shelter affiliation chips (if she's seeded as a bridged walker).
- **G10.** (pre-build) Daniel → `/dogs/[id]` for a shelter dog → "Book a walk" affordance gated by `canWalkDog`; below-threshold viewers see an explanatory state, not a broken button.
- **G11.** (pre-build) Daniel → `/schedule` → Bookings tab carries his completed shelter walks alongside paid-care bookings, shelter resolves as the "owner" slot.

---

## Decisions surfaced during walkthrough

Running log — append as decisions land during the build. Each entry carries a `→ target-doc.md` annotation for the phase-close sweep.

Format:
```
- **{Decision in one line.}** {Optional one-line context.} → `features/foo.md`
```

- **O1 resolved — shared three-tier credential pill via saturation ramp + icon escalation + label change.** Originally sized as outlined → filled → filled+ring; rejected during walkthrough sign-off because the top-tier ring extended past the chip's bounding box and varied the pill size across tiers. Landed mechanic: Tier 1 neutral inset + ~80% family text + no icon; Tier 2 soft family fill + strong family text + family icon; Tier 3 dark family fill + near-white text + filled-weight icon + distinguishing label. Tier 1 and Tier 2 share the short label ("Volunteer" / "Carer"); only Tier 3 distinguishes ("Super Volunteer" / "Trusted Carer"). Session count moves OUT of the pill — consuming surface owns its own subtitle. Saturation ramp runs in BOTH list and profile-hero contexts. Carer icon: Sparkle. Walker icons: Plant (T2) / Tree (T3), Leaf dropped with T1's icon-removal. CSS family + styleguide render landed; wiring into TrustBadgeStrip (B4) and walker chip (H1) remains. → `implementation/badges.md` at phase close.

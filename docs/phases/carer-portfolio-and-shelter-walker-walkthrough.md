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

- [x] **O1. Shared visual escalation across both badge families — originally sized as outlined → filled → filled+ring.** Resolved with a different mechanic — see Decisions log below.
  - BEFORE-state references: Tereza → `/shelters/utulek-liben?tab=members` (current walker pills) and Tereza → `/profile/klara` (TrustBadgeStrip the Carer aggregate joins).
- [x] **O2. Walker → UserProfile bridge — 4–6 anchor walkers vs all 8 of Útulek's pool.** D3's recommendation (4–6) stands — see Decisions log below.
  - BEFORE-state references: Tereza → `/shelters/utulek-liben?tab=members` (Walkers filter, current directory-style walkers — names not clickable).
- [x] **O3. Booking shape — overload existing `Booking` vs fork a parallel `ShelterWalkBooking` type for shelter-dog references.** D4's overload recommendation stands — see Decisions log below.
  - No UI to look at — pure data-shape call.
- [x] **O4. Vouching state machine — state-toggle (hidden demo affordance) vs theatrical fake (simulated delays + auto-notifications).** D6's state-toggle recommendation stands — see Decisions log below.
  - Existing fake-flow this extends: Tereza → `/shelters/utulek-liben` → "Walk a dog" → "Interest sent ▾" (single flip pattern).
- [x] **O5. In-circle elevation on /discover/help-a-dog — originally framed as section-level (Discover Care match) vs row-level per-card pattern.** Resolved differently — neither original option. See Decisions log below.
  - BEFORE-state references: Tereza → `/discover/care` (section-level pattern in production) and Tereza → `/discover/help-a-dog` (current flat list).
- [x] **O6. Cross-shelter affiliation framing — originally sized as per-shelter chips only, no aggregate.** Resolved with a hybrid (chips + conditional aggregate header). See Decisions log below.
  - BEFORE-state references: Tereza → `/shelters/utulek-liben?tab=members` (Walkers filter — the chip shape that stacks on the profile's "Volunteer work" section).
- [x] **O7. Thin shelters (Pes v nouzi + Druhá šance) stay empty-walker vs seed 1 bridged walker each.** D10's "stay empty" recommendation stands — see Decisions log below.
  - BEFORE-state references: Tereza → `/shelters/pes-v-nouzi?tab=members` and `/shelters/druha-sance?tab=members` (current empty rosters, which IS the proposal).

---

## Worth verifying

Behaviors that need a human at the keyboard. Walker-side items light up only after the bridge ships.

- [ ] **V1. (pre-build) Carer aggregate badge tier thresholds suppress correctly at boundaries.** Tereza → `/profile/tereza` should show "Carer" pill at Tier 1 (3–9 sessions, neutral surface). Klára → `/profile/klara` should show "Trusted Carer" pill at Tier 3 (25+ sessions, dark blue + filled Sparkle), with the session count rendered SEPARATELY as a subtitle below the pill (handled by the consuming surface, not the pill itself). New User → no badge at all (below threshold). Daniel + Tomáš → no badge (not carers). Specifically check the 9/10 and 24/25 boundary cases via mock-data tweaks if necessary.
- [ ] **V2. (pre-build) Circle-only Carer audience respects the badge privacy rule.** Tomáš (not Connected to Tereza) viewing `/profile/tereza` should NOT see the aggregate badge (circle-Carer privacy rule per C1). Daniel (Connected) sees it. Tereza herself (self) sees it. Verify across PersonRow + Discover card propagation too.
- [ ] **V3. (pre-build) Review submission round-trip.** Daniel → a completed booking detail → Leave a review → submit 5★ + text. Verify: review lands in `ReviewsContext`, surfaces in provider profile Reviews section, contributes to aggregate count + average on profile hero + Discover card, system message posts in the booking conversation thread.
- [ ] **V4. (pre-build) Circle attribution shows + hides correctly.** Daniel → `/discover/care` → cards for carers his circle has booked carry "{N} in your circle have booked them." Verify the count matches Connected-only (no Familiar leakage). Cards for carers with 0 connections-in-circle carry no row (silent absence per E5). Klára especially should show 1–2 of Daniel's connections per E4.
- [ ] **V5. (pre-build) Walker journey end-to-end (Daniel persona).** Daniel → `/discover/help-a-dog` → tap a dog → "Walk a dog" → fill application → submit. State-toggle "Invite to visit" → system message lands. State-toggle "Vouched." Daniel now appears in shelter's Members tab as Volunteer. Daniel → `/dogs/[id]` → "Book a walk" affordance now permitted → book → Start session → Finish → seal Visit Report → walk count increments → tier progression visible.
- [ ] **V6. (pre-build) Eligibility check refuses + permits correctly.** Verify `canWalkDog` honors strictest-rule-wins: (a) Volunteer can't book a Solo-only dog when shelter policy doesn't permit her tier; (b) Per-dog `experiencedHandlersOnly` overrides walker tier; (c) Per-shelter `groupWalksPermitted: false` hides the Group option in the booking flow.
- [ ] **V7. (pre-build) Shelter-membership elevation sorts correctly.** Per O5: per-dog walker-relationship elevation was dropped; shelter-membership elevation kept. Pre-walker Daniel → `/discover/help-a-dog` should surface Útulek and its dogs above the other shelters/dogs because his connection Klára volunteers there (small inline meta-label reads "Klára volunteers here" on Útulek card / its dogs). Once Daniel becomes a walker at Útulek (post-vouching), his own membership elevation surfaces Útulek above the circle-only elevation. Tomáš (different circle, no Útulek connection) sees a different elevation set. New User → no elevation; flat sort.
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
- **G8.** (pre-build) Daniel → `/discover/help-a-dog` → shelter-membership elevation: dogs/shelters from "your shelters" sort first (once Daniel is a walker), then "shelters your circle volunteers at," then everything else. Small inline meta-label on elevated items explains the reason (e.g. "Klára volunteers here"). No section headers.
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
- **O2 resolved — keep D3's 4–6 bridged anchor walkers.** Bridging all 8 of Útulek's walker pool would make the Members tab read as a fuller user community, but the cost (3–4 more UserProfiles authored + seeded across feeds, posts, connections) is content-pass work, not phase-feature work. This phase focuses on features + surfaces; the broader "support cast feels thin" question is the standing trigger for FC2 (Mock-world densification), and a future content + demo-flow enrichment pass — when that fires — can revisit whether to bridge more walkers across Útulek and the thin shelters together. → `planning/Future Considerations.md` FC2 (no edit needed; FC2 already names this trigger).
- **O3 resolved — overload `Booking` with `ownerKind: "user" | "shelter"` discriminator; do not fork a parallel `ShelterWalkBooking` type.** Paid care and shelter walks share ~80% of structure (lifecycle states, session flow Start → Finish → Visit Report, My Schedule surface, status badges, booking detail page, system messages in the conversation thread). Differences are narrow and concentrated: the "owner" tile resolves to a shelter (logo + name), `getDogById` checks `ShelterProfile.dogs[]` in addition to `UserProfile.pets[]`, pricing is zero. Fork would double the booking-surface count to maintain and force every booking-flow improvement into two places. Discriminator branches stay concentrated (booking-detail page, dog lookup helper, pricing override) rather than sprawled — manageable. Reversibility preserved: if shelter walks evolve significantly from paid care later, splitting a discriminated type is much cheaper than merging two parallel ones. → `features/schedule.md` at phase close (Booking shape extension).
- **O4 resolved — state-toggle (hidden demo affordance) advances the walker through `applied → invited → vouched`; no theatrical fake (simulated delays + auto-notifications).** State machine itself is a real feature; this is just the demo-pattern call for how state advances during a walkthrough. Toggle: honest about being faked, survives persona switching, inspectable, cheap to build. Theatrical fake: more "magical" but breaks when testers switch personas mid-flow (the simulated time gets confused). Toggle matches the existing production pattern (`/shelters/utulek-liben` → "Walk a dog" → "Interest sent ▾" — already a state toggle). Demo-pattern polish (theatrical animations, time-passage interstitials, notification timing) is explicitly future work — a richer fake-time layer can sit on top of this state machine later without changing the machine itself. → `features/demo-mode.md` at phase close (document the hidden-affordance pattern alongside the persona switcher).
- **O5 resolved — shelter-membership elevation only; per-dog walker-relationship elevation dropped; sort-based, not section-headers.** D7 originally picked section-level matching Discover Care ("In your circle" header above "Other"). Reframed during walkthrough: the per-dog "Walked by N in your circle" signal is thin — shelter dogs don't belong to walkers, and Klára walking Bára six times doesn't tell the viewer anything Bára's profile doesn't already say. Stronger signals live at the shelter level. Landed mechanic: two elevation reasons, applied as sort priority (not section headers): **(a) shelters you walk at** — your home base, only relevant once you're a walker somewhere; **(b) shelters your circle volunteers at** — the social-proof hook, strongest for the demo's main journey (Daniel discovers Help a Dog via Klára's Útulek connection). Sort priority applied to both pills: Dogs pill sorts dogs by their shelter's elevation; Shelters pill sorts shelters directly. Small inline meta-label on elevated cards explains the reason (e.g. "Klára volunteers here" / "You walk here") — no section box. Dropping section headers dissolves the "empty section reads as broken" concern the original framing raised. → `planning/Open Questions & Assumptions Log.md` §14 at phase close: drop "Dogs you've walked" elevation hook, retain "Shelters your circle volunteers at," add "Shelters you walk at," resolve the row-vs-section open with "neither — sort priority." Also → `features/shelters.md` Discovery section at phase close.
- **O6 resolved — per-shelter chips + conditional aggregate header for multi-shelter walkers.** D9 originally recommended per-shelter chips only on strict anti-scoreboard grounds. Anti-scoreboard discipline relaxed at sign-off: the user is open to accumulation signals provided they don't read as competition. Landed mechanic: **Option C with two refinements.** (1) Per-shelter chips stack vertically as primary content (e.g. `Volunteer at Útulek Liběň · 14 walks` / `Super Volunteer at Druhá šance · 32 walks`). (2) Section header carries an aggregate ONLY when the walker is affiliated with 2+ shelters (e.g. `Volunteer work · 3 shelters · 47 walks total`). Single-shelter walkers render the chip alone — the aggregate would be redundant. (3) Aggregate framing stays FACTUAL: no percentile ranks ("Top 10% volunteers"), no streaks/recency callouts, no comparison against other walkers. The number is information, not position. This preserves the anti-scoreboard spirit (you're not racing anyone) while letting the cumulative number be visible because it genuinely matters when a viewer is deciding whether to trust someone with their dog. → `features/shelters.md` Volunteer-work section spec at phase close; → `planning/Open Questions & Assumptions Log.md` §14 (Cross-shelter walker affiliations on user profile) at phase close — close with this resolution.
- **O7 resolved — thin shelters (Pes v nouzi + Druhá šance) stay empty-walker.** D10's recommendation stands: demo richness comes from Útulek's walker pool; thin rosters communicate the demographic reality that small rescues often run on zero credentialed walkers (which is part of what Doggo's credentialing layer is meant to address). Same deferral logic as O2: any "should we seed more walkers" question is content-pass work, not feature work. The standing trigger for revisiting the count call (here AND for O2's 4-6 bridge count together) is FC2 (Mock-world densification) — a future content + demo-flow enrichment pass. D10's "flag for revisit at phase close" still applies as a checkpoint to confirm the empty rosters haven't degraded any demo journey by the time the phase closes. → `planning/Future Considerations.md` FC2 (no edit needed; FC2 already names this trigger).
- **B5 PersonRow propagation deferred.** §8 said propagate the Carer Portfolio badge to PersonRow + Discover Care cards. Discover Care propagation lands automatically (carer-portfolio has priority 0 in `TrustBadgeStrip` → leads the top-2 slice; verified on Klára's card as Daniel: "Trusted Carer" + "Trusted by your network"). PersonRow is different: `implementation/badges.md` caps PersonRow at 2 badges (Role + Identity); adding the aggregate as a 3rd would break that rule AND compete with the Carer Identity sub-spec ("Dog Trainer") which carries more meaning at row density. Deferred — current B5 ships Discover Care only. PersonRow propagation gets a separate design call when a concrete surface need surfaces (e.g. a meet-attendee list where viewers benefit from tier nuance). → no doc update needed; `implementation/badges.md` PersonRow rules unchanged.

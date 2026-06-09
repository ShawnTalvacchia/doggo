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

Decisions made at phase open that another reasonable person could land differently. The build proceeds against these defaults; flag during the walkthrough if any should flip.

- [ ] **O1. (pre-build) Shared visual escalation language — outlined → filled → filled+ring across both badge families.** D2 commits both the Carer aggregate badge and the walker tier badge to the same three-state intensification. The top tier (Trusted Carer / Super Volunteer) gets the ring accent. Question: is filled+ring distinctive enough for "25+ sessions / Super Volunteer," or should the top tier carry a sharper visual jump (e.g. ring + brand-strong border, or a different surface tone)? See once B2 + H1 ship — Klára → `/profile/klara` (Carer side) and Útulek Members tab (walker side).
- [ ] **O2. (pre-build) Walker → UserProfile bridge: 4–6 anchor walkers, rest stay directory-style.** D3 + G3 keep the user roster from ballooning while making circle attribution + cross-shelter affiliation work for the bridged subset. Alternative: bridge every walker on Útulek's full roster (~8) so the Members tab reads more like a real user community than a partial. Tradeoff: ~3 more UserProfiles to author + seed believably. (Confirm at M1.)
- [ ] **O3. (pre-build) Booking shape overloaded, not forked, for shelter-dog references.** D4 takes the overload route: `getDogById` checks both `UserProfile.pets[]` and `ShelterProfile.dogs[]`; a new `ownerKind: "user" | "shelter"` discriminator gates the owner-side resolution. Alternative: a parallel `ShelterWalkBooking` type that doesn't go through `Booking` at all. Overload is cheaper but spreads conditional logic through booking surfaces; fork is cleaner but doubles surface count. Re-evaluate concretely during I scoping.
- [ ] **O4. (pre-build) Vouching state machine is state-toggled in demo (not a real flow).** D6 fakes `applied → invited → vouched` with persona-switcher state-toggles + system messages. Alternative: a more theatrical fake (e.g. simulated 5-second delay on "Application received" → notification land) that reads less obviously stubbed. State-toggle reads as an honest demo affordance; richer fake reads as a real product moment but risks "where does the time go?" confusion. Confirm at I3 + I4.
- [ ] **O5. (pre-build) Section-level in-circle elevation on /discover/help-a-dog (matches Discover Care).** D7 picked section-level over row-level. With a thin shelter-dog social graph in V1 (4–6 bridged walkers, 1–2 of whom are in any persona's circle), the "In your circle" section may be very short — possibly 0–1 items per persona. Row-level "Walked by N in your circle" on each card would be denser if the social graph stays thin. Re-check at K2 once the bridge data is live.
- [ ] **O6. (pre-build) Cross-shelter affiliation section header: per-shelter only (no aggregate framing).** D9 + L3 keep `Regular Volunteer at Útulek Liběň · 14 walks` as separate chips, not `Volunteered at 3 shelters · 47 walks` as an aggregate. Anti-scoreboard reasoning — aggregate framing reads as a leaderboard signal. Counter: aggregate framing is honest about cumulative effort across shelters and may matter for cross-platform credibility. Re-check at L1.
- [ ] **O7. (pre-build) Thin shelters (Pes v nouzi + Druhá šance) stay empty-walker.** D10 — small-rescue demographic honesty over demo richness. Alternative: seed 1 bridged walker each so they're not completely empty. Decide at M3.

---

## Worth verifying

Behaviors that need a human at the keyboard. Walker-side items light up only after the bridge ships.

- [ ] **V1. (pre-build) Carer aggregate badge state thresholds suppress correctly at boundaries.** Tereza → `/profile/tereza` should show "Carer · {3–9} sessions" (outlined). Klára → `/profile/klara` should show "Trusted Carer · 25+" (filled+ring). New User → no badge at all (below threshold). Daniel + Tomáš → no badge (not carers). Specifically check the 9/10 and 24/25 boundary cases via mock-data tweaks if necessary.
- [ ] **V2. (pre-build) Circle-only Carer audience respects the badge privacy rule.** Tomáš (not Connected to Tereza) viewing `/profile/tereza` should NOT see the aggregate badge (circle-Carer privacy rule per C1). Daniel (Connected) sees it. Tereza herself (self) sees it. Verify across PersonRow + Discover card propagation too.
- [ ] **V3. (pre-build) Review submission round-trip.** Daniel → a completed booking detail → Leave a review → submit 5★ + text. Verify: review lands in `ReviewsContext`, surfaces in provider profile Reviews section, contributes to aggregate count + average on profile hero + Discover card, system message posts in the booking conversation thread.
- [ ] **V4. (pre-build) Circle attribution shows + hides correctly.** Daniel → `/discover/care` → cards for carers his circle has booked carry "{N} in your circle have booked them." Verify the count matches Connected-only (no Familiar leakage). Cards for carers with 0 connections-in-circle carry no row (silent absence per E5). Klára especially should show 1–2 of Daniel's connections per E4.
- [ ] **V5. (pre-build) Walker journey end-to-end (Daniel persona).** Daniel → `/discover/help-a-dog` → tap a dog → "Walk a dog" → fill application → submit. State-toggle "Invite to visit" → system message lands. State-toggle "Vouched." Daniel now appears in shelter's Members tab as Volunteer. Daniel → `/dogs/[id]` → "Book a walk" affordance now permitted → book → Start session → Finish → seal Visit Report → walk count increments → tier progression visible.
- [ ] **V6. (pre-build) Eligibility check refuses + permits correctly.** Verify `canWalkDog` honors strictest-rule-wins: (a) Volunteer can't book a Solo-only dog when shelter policy doesn't permit her tier; (b) Per-dog `experiencedHandlersOnly` overrides walker tier; (c) Per-shelter `groupWalksPermitted: false` hides the Group option in the booking flow.
- [ ] **V7. (pre-build) In-circle elevation lights up post-bridge.** Once G3 + M1 land, Daniel → `/discover/help-a-dog` should show "Dogs in your circle have walked" / "Shelters your circle volunteers at" sections above other shelter dogs. Verify the elevation is honest (only Connected viewers + walkers Daniel knows surface there). Tomáš (different circle) sees a different elevation set.
- [ ] **V8. (pre-build) Tier visual escalation reads correctly at all three states.** Volunteer (outlined Leaf) → Regular Volunteer (filled Plant) → Super Volunteer (filled+ring Tree). Verify the icon shape progression + the new fill intensification both read at 12px. Util Members tab should show varied tiers across the seeded walkers (M2 — at least one Super Volunteer for the showcase).

---

## Surfaces to glance

Phase-thesis confirmation. One look each. Filled in as workstreams ship.

### Carer side (ships first)

- **G1.** (pre-build) Tereza → `/profile/klara` — Trust badge strip carries "Trusted Carer · 47 sessions" (filled+ring), top priority.
- **G2.** (pre-build) Tereza → `/profile/tereza` — Self-view shows her own aggregate badge ("Carer · {modest count} sessions," outlined).
- **G3.** (pre-build) Tereza → `/discover/care` → Klára's card carries the aggregate badge in the top-2 priority slot, replaces a lower-priority existing badge.
- **G4.** (pre-build) Daniel → `/discover/care` → at least one carer card carries the "{N} in your circle have booked them" row.
- **G5.** (pre-build) Daniel → `/profile/klara` → "Booked by people you know" section under the trust strip with named Connected reviewers + anonymous attribution for non-Connected.
- **G6.** (pre-build) Tomáš → a completed-booking detail → tap "Leave a review" → real form opens (Pet-as-protagonist hero + 5-star rating + textarea), submit lands review on the provider profile.

### Shelter walker side (ships after mid-phase checkpoint)

- **G7.** (pre-build) Tereza → `/shelters/utulek-liben?tab=members` — Walker tier chips render with the new intensification (outlined / filled / filled+ring), Leaf/Plant/Tree icons retained, violet color retained.
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

(Empty at phase open — decisions accrue as workstreams land.)

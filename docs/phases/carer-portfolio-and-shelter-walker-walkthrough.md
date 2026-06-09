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

Behaviors that need a human at the keyboard. Drive each one yourself — automated checks already passed; these surface interaction nuance and persona-switching round-trips.

- [ ] **V1. Carer aggregate badge thresholds + persona suppression.** As Tomáš, view `/profile/klara` → "Trusted Carer" pill (Tier 3, dark blue + filled Sparkle) leads the TrustBadgeStrip. As Klára, view `/profile/tereza` → "Carer" pill (Tier 2 currently — soft blue + Sparkle, because Tereza's seeded 6 + 2 completed bookings + a few past Vinohrady Evening Walkers occurrences pushes her into the 10+ band). Daniel and Tomáš's own profiles (`/profile/daniel`, `/profile/tomas`) → NO badge (no carerProfile, no completed bookings as carer). Specifically inspect Tereza's tier — A3 seeded her at 6; she lands at T2 not T1 because past meet hosting bumps her over 10. If you want her strictly at T1 for narrative, lower `seededCompletedSessions`.
- [ ] **V2. Review form round-trip.** As Daniel, navigate to a completed booking detail (e.g. `/bookings/booking-klara-daniel` if it's seeded as completed, or any owner-side completed booking) → "Leave a review" CTA opens the CareReviewSheet → submit 5★ + text → review lands on `/profile/klara` in the Reviews section, becomes the new preview, and the count in the section header increments. System-message integration was already in place pre-phase.
- [ ] **V3. Circle attribution + privacy.** As Daniel, view `/discover/care` → Klára's card carries "1 in your circle has booked them" row (Anežka, seeded for E4). View `/profile/klara` → "Booked by people you know" section under the trust strip renders Anežka's row with avatar + name + "Booked with Klára." As Tomáš (different circle, no Connection overlap with Klára's completed-booking owners), neither row renders — silent absence per E5.
- [ ] **V4. Walker application → invited → vouched state machine.** As Daniel, navigate to `/shelters/utulek-liben` → action row shows "Walk a dog" → tap → application sheet opens ("Apply to walk dogs," textarea required, 10-char minimum) → submit. Action button flips to "Application sent ▾" with dropdown carrying "Advance state (demo)" and "Withdraw application." Tap Advance → button becomes "Invited to visit ▾" (same dropdown). Tap Advance again → "Vouched walker ▾" with dropdown now showing "Log walk (demo)" + "Leave shelter." Daniel appears on the shelter's Members tab as Volunteer at Tier 1 (neutral surface, no icon). Tap "Log walk" ten times → his chip on the Members tab escalates to Volunteer T2 (Plant icon, soft violet). Twenty-five total → "Super Volunteer" T3 (Tree fill, dark violet).
- [ ] **V5. Walker affordance on shelter dog profile.** As Daniel pre-application, navigate from `/discover/help-a-dog` → tap any Útulek dog (e.g. shelter-dog-berta) → above the shelter backlink at the bottom, the "Walk dogs at Útulek Liběň" CTA card surfaces with "Apply at the shelter →" link. As Daniel post-vouching (after V4 ran to vouched), the same surface shows "You walk at Útulek Liběň" with the "(booking flow ships in follow-up)" honest caveat. As Daniel vouched but still at vetted tier on an `experiencedHandlersOnly` dog → the "needs an experienced walker" explanatory state renders instead of the book CTA.
- [ ] **V6. Help a Dog shelter-membership sort elevation.** As Daniel pre-application (no walker affiliations, no Connections at Útulek-affiliated users yet bridged), `/discover/help-a-dog` renders a flat sort — no elevation. After V4 (Daniel becomes vouched at Útulek), revisit `/discover/help-a-dog` → Útulek's dogs sort to the top, then dogs from other shelters. Tomáš (different circle, no Útulek walker affiliations) sees flat sort throughout. New User → flat sort. NO section headers per O5.
- [ ] **V7. Walker tier escalation in dense list.** As Tereza, view `/shelters/utulek-liben?tab=members` (Walkers filter) → tier escalation reads correctly across the eight walkers: Karolína M. + Anna K. + Petr H. + Jakub V. all at Tier 1 (neutral surface, no icon, "Volunteer" label); Helena S. + Marie B. + Lukáš P. at Tier 2 (soft violet, Plant icon, "Volunteer"); Pavel D. at Tier 3 (dark violet, filled Tree, "Super Volunteer"). Avatar + name on Pavel D., Marie B., Jakub V. are clickable links to their UserProfiles (G bridge); the other five walkers' names + avatars are non-clickable directory entries.
- [ ] **V8. Volunteer work profile section.** Navigate to `/profile/pavel-d` → "Volunteer work" section between the carer info and the dogs section. Single shelter affiliation (Útulek) renders the chip alone without an aggregate header (per O6: conditional aggregate only when 2+). Chip reads "Super Volunteer at Útulek Liběň · 87 walks" via the credential-pill family at Tier 3. Same shape on `/profile/marie` (Volunteer at Útulek T2 · 32 walks) and `/profile/jakub` (Volunteer at Útulek T1 · 6 walks). Multi-shelter affiliations + aggregate header would surface if you used the demo's Log walk affordance to bring a dynamically-vouched walker through multiple shelters — not seeded by default.

---

## Surfaces to glance

Phase-thesis confirmation. One look each — flag anything that reads off.

### Carer side

- **G1.** Tomáš → `/profile/klara` — TrustBadgeStrip carries "Trusted Carer" pill (Tier 3, dark blue + filled Sparkle) leading the strip.
- **G2.** Daniel → `/profile/klara` → Reviews section: header "Reviews · ★ 4.8 · 4," one preview (Hana P.) with 28px avatar, "See all 4 reviews →" opens the modal with all 4 rows + dividers + 40px avatars + generous spacing.
- **G3.** Daniel → `/discover/care` → Klára's card in "Carers in your circle" section. "Trusted Carer" leads the trust strip + "Trusted by your network" + the "1 in your circle has booked them" trust-row signal (Anežka via E4).
- **G4.** Klára → `/profile/tereza` — Tereza's aggregate badge renders as "Carer" pill at Tier 2 (soft blue + Sparkle, naturally landed at T2 because seeded 6 + past meet hosting pushes her to 10+). Mutual connections section collapses inline (one mutual = direct row to Hana, no modal trigger).
- **G5.** Daniel → `/profile/klara` → "Booked by people you know" section under the Reviews section: Anežka Veselá's row with avatar + "Booked with Klára."

### Shelter walker side

- **G6.** Tereza → `/shelters/utulek-liben?tab=members` (Walkers filter) — eight walkers across the three tiers via the shared credential-pill saturation ramp: 4 Tier-1 ("Volunteer," no icon, near-white surface), 3 Tier-2 ("Volunteer," soft violet + Plant), 1 Tier-3 ("Super Volunteer," dark violet + filled Tree). Three walkers (Pavel D., Marie B., Jakub V.) are clickable links to UserProfiles per G; the other five are non-clickable directory entries.
- **G7.** Daniel → `/shelters/utulek-liben` action row — "Walk a dog" CTA. Tap → "Apply to walk dogs" sheet with required message textarea (10 chars min). Submit lands an applied-state WalkerApplication.
- **G8.** Post-application action row dropdown carries "Advance state (demo)" + "Withdraw application." Per O4 hidden-affordance pattern.
- **G9.** Daniel post-vouching → `/dogs/[id]` for a Útulek shelter dog → WalkAffordance card above the shelter backlink reads "You walk at Útulek Liběň" with the honest "(booking flow ships in follow-up)" caveat. Daniel pre-application sees the "Walk dogs at Útulek Liběň · Apply at the shelter →" CTA instead.
- **G10.** Daniel post-vouching → `/discover/help-a-dog` → Útulek's dogs sort to the top per K's shelter-membership elevation. Pre-vouching → flat sort.
- **G11.** Pavel D. → `/profile/pavel-d` → "Volunteer work" section between carer info and dogs section. Single shelter, no aggregate header (per O6 conditional rule). Chip: "Super Volunteer at Útulek Liběň · 87 walks."

### Honestly deferred (flagged in commits, not hidden)

- **D1.** Shelter-walk Booking flow with `ownerKind: "shelter"` discriminator end-to-end. The type extension landed in I1; consumer wiring (booking creation surface, My Schedule integration, visit report attaching to dog) is a follow-up. WalkAffordance text says so honestly.
- **D2.** Meta-label rendering on Help a Dog elevated cards ("Klára volunteers here"). Sort works; the inline label is K1 polish.
- **D3.** Walker-circle elevation on Discover Care (cross-pollination from circle attribution to shelter-walker side).

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

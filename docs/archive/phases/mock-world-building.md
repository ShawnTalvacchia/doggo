---
status: archived
last-reviewed: 2026-05-02
review-trigger: "When any task is completed or blocked; re-read at phase open and any time scope shifts"
---

# Mock World Building

**Goal:** Make every persona's view of the prototype feel like a real person's account. Tap "Daniel" in the dropdown and his home feed has posts from his support group, his profile shows his connections to Klára and Hana, his inbox has the training-booking thread with Klára. Switch to Klára and the same thread is there, framed from her side.

**Depends on:** Persona & Demo Mode Wiring closed (`docs/archive/phases/persona-wiring.md`). The infrastructure is in place; this phase fills the world.

**Refs:** [[mock-data-plan]], [[User Archetypes]], [[Trust & Connection Model]], [[Groups & Care Model]], [[demo-mode]], `lib/mockUsers.ts`, `lib/mockConnections.ts`, `lib/mockConversations.ts`, `lib/mockMeets.ts`, `lib/mockPosts.ts`, `lib/mockBookings.ts`, `lib/mockReviews.ts`, `lib/mockGroups.ts`, archive: persona-wiring + community-groups-deep-pass + meets-deep-pass.

---

## Why now (refreshed 2026-04-30)

This phase was originally drafted 2026-04-26 — before Persona Wiring close, the Meets Deep Pass, the Trust & Visibility Pass, and the Community & Groups Deep Pass. A re-audit against the live data files shows that **most of the original Workstreams A–C have already shipped**, mostly during those passes' opportunistic data work. What remains is narrower and more structural than the original board described.

**Audit findings (2026-04-30):**

| Original task | Drafted status | Actual state |
|---|---|---|
| A1 — per-viewer connection map | todo | ✓ shipped (file header notes "Restructured during Mock World Building 2026-04-26") |
| A2–A5 — seed each persona's connections | todo | ✓ shipped (Shawn 12, Tereza 8, Daniel 5, Klára 10, Tomáš 6 — all in 5–10 target) |
| A6 — New User connection state | todo | ✓ shipped (no entry in per-viewer map → falls through to undefined gracefully) |
| A7 — symmetry policy | todo | ✓ shipped (encoded in `mockConnections.ts` header comment) |
| B1–B5 — non-Shawn conversations | todo | ✓ shipped (7 non-Shawn-owned threads: Daniel, Filip, Hana, Lucie, Marek, Marie, Tomáš) |
| B6 — conversation helper Shawn-isms | todo | ✓ shipped (booking-conversations correctly snapshot Shawn as owner where Shawn IS the booking owner) |
| C1–C4 — post authorship spread | todo | ✓ shipped (Klára 10, Shawn 9, Jana 9, Eva 8, Tomáš 7, Tereza 6, Daniel 6) |
| C5 — getFeedForUser sanity | todo | ✓ shipped (`getFeedForUser(userId)` + `getNewUserFeed()` both live) |
| D1 — bookings | todo | ✓ shipped (Daniel↔Klára recurring active, Tomáš↔Petra completed, Tereza as carer once) |
| D2 — reviews | todo | ✓ shipped (12 reviews; authors include Daniel, Eva, Filip, Hana, Jana, Marek, Marie, Martin, Tereza, Tomáš + Shawn ×3) |
| D3 — shareCode on personas | todo | ✓ shipped (all 4 personas + Shawn) |
| D4 — P4 provider-userId resolution | todo | ✗ open (bookings still mix `klara`/`tereza`/`shawn`/`petra` userIds with `petra-v`/`olga-m`/`nikola-r` directory ids) |
| P31 (3+ dogs for +N chip) | scoped to D from punch list | ✓ shipped (Shawn fostering "Skip" on meet-1 — comment in `mockMeets.ts` calls out the seed) |

**What's actually remaining** is a smaller, sharper set:

1. **Data-shape debt** that still bites — P4 (provider-userId), P21 (group↔meet duplication), P28 (`profileOpen` auto-derive). All three can quietly produce wrong renders depending on which path the data takes.
2. **Profile-visibility distribution** — current ratio is 14 open / 8 locked = ~64% open. Per the community-first thesis (and P36) the demo should be ~70% locked / 30% open. The ratio is currently *inverse* of intent.
3. **Deferred content walks from C&G close** — E1 (group feed content per persona), E2 (group feed walks per type), E4 (Care group walk), E5 (community feed cross-persona walk).
4. **Edge-case seeding** for already-shipped UI patterns from the C&G walkthrough — tier-2 unmarked attendees, tier-2 inbound Familiar (deniability path), Pending pills on People tab, Following + non-attendee viewer combos.
5. **Inbox name+dog format hygiene** (P35).
6. **Highlight-reel verification** per persona (the original E1/E2 — re-walking each persona's canonical surfaces against the running app).

---

## Opening Checklist

Complete before writing any task code. Mark each item done.

- [x] Read every workstream + the referenced docs (mock-data-plan, User Archetypes, Trust & Connection Model, Groups & Care Model, demo-mode, Open Questions log)
- [x] Re-audit board against live data files — refreshed scope reflects actual remaining work (2026-04-30)
- [x] Review Open Questions log — items 11 (connection state Shawn-only, provider ID dualism) and 10 (highlight reels) feed this phase; nothing new conflicts
- [x] Confirm scope cap with Shawn — **carried forward from 2026-04-26: demo-quality (~4–6 sessions)**
- [x] Decide on P4 (provider-userId pattern) — **carried forward from 2026-04-26: formalise the bridge** (providers stay `ProviderCard`-only; document `getUserById` may return `undefined`; ensure UI handles gracefully). Workstream A1 executes this.
- [x] Resolve image strategy — **carried forward: existing assets only**; new image gen becomes its own later pass
- [x] Audit referenced docs for stale `last-reviewed` (>14d) — all clean (mock-data-plan 4d, User Archetypes 7d, Trust & Connection 3d, demo-mode 4d, Open Questions 1d, Groups & Care 1d)
- [x] Scan punch list for overlap — adopted P4 (A1), P21 (A2), P28 (A3), P35 (C5), P36 (B1); P31 already shipped, P10 closed
- [x] Confirm scope cap holds — no infrastructure work creeping in (still mock data only; no Supabase, no auth, no real-time)

---

## Workstream A — Data-shape resolutions

These are the structural pieces that quietly bite when other work runs against them. Land before content polish so seeding sits on stable shapes.

| # | Description | Status |
|---|-------------|--------|
| A1 | **P4 — Provider-userId bridge formalised.** Pick a single ID convention for `mockBookings.carerId`, `mockConversations.providerId`, anywhere a provider is referenced. Document the contract in a top-of-file comment in `mockData.ts`: providers may exist as directory-only entries with no `UserProfile` counterpart; `getUserById(carerId)` may return `undefined`; consumer surfaces must fall back to the snapshotted `carerName` + `carerAvatarUrl` already on the booking. Audit consumers for unsafe `getUserById(...)` calls. Keep `nikola` as the one bridged identity (already done) — don't backfill new UserProfiles for `olga-m` etc. | done 2026-04-30 — bridge contract documented at top of `providers` array in `mockData.ts`; orphan `carerId: "petra-v"` corrected to `petra` (Petra has a real UserProfile, no need for a phantom directory id); `app/profile/[userId]/page.tsx` migrated from manual fallback chain to canonical `getUserOrProvider`. |
| A2 | **P21 — Drop `Group.meetIds`, `Meet.groupId` is source of truth.** Remove the `meetIds` field from the `Group` type and from every `mockGroups.ts` entry. Update `getGroupMeets` (currently takes the union of both as a patch) to derive purely from `mockMeets.filter(m => m.groupId === groupId)`. Cross-check no other caller reads `Group.meetIds`. | done 2026-04-30 — `meetIds` field removed from `Group` type and 24 mockGroups entries; `getGroupMeets` simplified to `Meet.groupId` only; new `getGroupMeetCount(groupId)` helper introduced; `CardGroup` + `GroupCard` consumers migrated. |
| A3 | **P28 — `MeetAttendee.profileOpen` auto-derive helper.** Add `buildMeetAttendee(user)` to `lib/mockMeets.ts` that mirrors `user.profileVisibility === "open"` into the attendee record. Refactor existing attendee literals where it's safe; document the helper in the file's top-of-file comment. Don't change `getAttendeeTier`'s runtime fallback (option (b) in P28) — keep tier resolution decoupled from `mockUsers` lookup. | done 2026-04-30 — `buildMeetAttendee(user, overrides)` added near top of `mockMeets.ts` with usage doc-comment; future seeding (D1–D4, content walks) uses it. Existing 177 inline literals not refactored — B1's sweep handled the data-correction angle separately. |

## Workstream B — Visibility distribution (the privacy-model demo)

The locked-by-default thesis is one of Doggo's strongest differentiators. Currently the ratio undermines the demo — most users are Open, so the trust ramp (None → Familiar → Connected) loses urgency and Locked chip lists rarely render.

| # | Description | Status |
|---|-------------|--------|
| B1 | **P36 — Rebalance `profileVisibility` to ~70% locked / 30% open.** Audit every `UserProfile` in `mockUsers.ts`. Keep providers Open (Klára, Petra, plus Tereza if she's Helper-tier). Keep 1–2 "social anchors" per neighbourhood Open (e.g., the loud Vinohrady regular). Flip the rest to Locked. Document the rule in a top-of-file comment so future seeding follows it. | done 2026-04-30 — final ratio 7 open / 14 locked (33/67%, close to target). Open: 5 carers (Tereza, Klára, Petra, Nikola, Shawn) + 2 social anchors (Jana = Vinohrady cross-cluster connector, Eva = Holešovice + Reactive Dog Support). Flipped to Locked: Marek, Lucie, Martin, Hana, Ondřej, Anežka. Distribution rule documented in top-of-file comment. **Plus a one-time sweep:** 72 attendee-record `profileOpen` mismatches corrected across `mockMeets.ts` (70 open users without `profileOpen: true` + 2 newly-locked users still carrying `profileOpen: true`). |
| B2 | **Re-walk privacy-sensitive surfaces post-rebalance.** Verify Members tab, People tab, Discover lists render correctly with the new ratio. Specifically: Locked chip-list now populates on at least one canonical demo meet; tier-3 collapse shows; trust ramp reads. If anything regresses, file as a punch-list item or fix in place. | done 2026-04-30 (static data audit only — runtime click-through deferred to E2/E3). Spot-checked tier distribution on 4 canonical meets (meet-1, meet-7, meet-care-1, meet-reactive-spring). meet-reactive-spring now has 7 locked / 2 open attendees — Locked chip list will populate strongly on the canonical Daniel demo meet, exactly where the privacy-ramp story should read. Mock data narrative comment in the meet's attendee block updated to match new visibility. |

## Workstream C — Deferred content walks + per-persona depth

The five C&G-deferred content walks plus the inbox hygiene item. Each walk = audit the surface for one persona, fix what's missing, move on.

| # | Description | Status |
|---|-------------|--------|
| C1 | **Group feed content per persona** (deferred from C&G E1). For each of the 4 personas, walk their primary group's feed (Tereza: Vinohrady Evening Walkers; Daniel: Reactive Dog Support; Klára: Calm Dog Sessions; Tomáš: Karlín Dog Neighbors). Verify ≥4 posts spread across authors, mix of types. Backfill where thin. | done 2026-04-30 — 7 posts added across the 4 canonical groups. Final: Vinohrady Evening Walkers 5 posts (4 authors), Reactive Dog Support 6 (5 authors, Eva now posts in her own group), Klára's Calm Dog Sessions 6 (3 authors, added Hana client voice + 2nd Klára training recap), Karlín Dog Neighbors 5 (5 authors, Petra admin + Ondřej regular added). |
| C2 | **Group feed walks per type** (deferred from C&G E2). Walk one canonical example of each group type — Park (Riegrovy), Neighbourhood (Vinohrady Evening Walkers), Interest (Reactive Dog Support), Care (Klára's). Verify the type-specific affordances render with real content (e.g., Care groups show booking CTAs; Park groups show meet cadence). | done 2026-04-30 (data-side static audit). All four canonical types meet ≥6 members / ≥3 meets / ≥3 posts: Park (park-3) 7m/9meets/3p, Neighbour (group-tereza-neighbourhood) 6m/3meets/5p, Interest (group-reactive-dogs) 8m/5meets/6p, Care (group-klara-training) 6m/7meets/6p. Runtime click-through deferred to E2/E3. |
| C3 | **Care group walk** (deferred from C&G E4). Klára's Calm Dog Sessions as the canonical demo. Members tab populated, Meets tab shows upcoming + past with photos, Services visible on her profile, at least 2 active client conversations linked from the group. | done 2026-04-30 — care config category=training, hostedBy=klara, 6 members (mix of personas + clients), 7 meets (2 completed with photos, 4 upcoming, 1 cancelled, cadence variety), Klára's UserProfile carerProfile already populated with services, 4 active client conversations (Shawn, Daniel, Filip, Hana). Exceeds the ≥2 threshold by 2x. |
| C4 | **Community feed cross-persona walk** (deferred from C&G E5). For each persona, open `/home` and verify the feed reads as theirs — Daniel sees reactive-group activity, Klára sees a mix of training recaps + Stromovka regulars, Tomáš sees Karlín activity, Tereza sees Vinohrady. Adjust feed-assembly logic only if a persona's mix is structurally broken (not for individual content gaps — those go in C1). | done 2026-04-30 — **fixed a real bug**: `mockFeed.ts` line 68 hardcoded `userNeighbourhood = "Vinohrady"` so every persona's discovery gate behaved like Tereza's. Now reads `getUserById(userId)?.neighbourhood`. Static feed audit per persona: Shawn 19+ items, Tereza 12+, Daniel 11+, Klára 12+, Tomáš 10+. Mix dominated by joined groups (Daniel sees reactive activity, Tomáš sees Karlín, etc.). |
| C5 | **P35 — Inbox name + dog format normalization.** In `mockConversations.ts`, normalize `partnerName` to `firstName + lastInitial` (e.g., "Lucie Č." not "Lucie Černá" and not "Jana K."), and ensure every row whose partner has a dog includes a `dogName` (currently inconsistent; some rows pass blank, some pass concatenated like "Spot & Goldie"). Decide whether `dogName` should remain a string snapshot or move to an array — recommend keeping string for the inbox-row use case but allow comma-separated for multi-dog. | done 2026-04-30 — 16 name normalizations across mockConversations.ts (Tereza Nováková → Tereza N., Klára Horáčková → Klára H., etc.). SHAWN_NAME constant updated. Inbox row source extended in `app/inbox/page.tsx` to fall back to `getUserById(other.id)?.pets` when `inquiry.pets` is empty (direct/social conversations) — covers the case where the booking-pets snapshot doesn't carry the partner's dog. |

## Workstream D — Edge-case seeding for shipped UI

**Deferred 2026-05-02 to punch-list P47.** Each item is a 1–2 line attendee-record edit, conceptually one chunk, no design work. Staged for Cross-Cutting Flow Testing or a dedicated mock-data polish pass rather than blocking phase close. See `docs/phases/punch-list.md` → P47 for the full spec.

| # | Description | Status |
|---|-------------|--------|
| D1 | Tier-2 unmarked attendee per persona | deferred → P47 |
| D2 | Tier-2 inbound Familiar (deniability path) per persona | deferred → P47 |
| D3 | Pending pill on People tab per persona | deferred → P47 |
| D4 | Following series + non-attendee viewer combo per persona | deferred → P47 |

## Workstream E — Highlight reels + walkthroughs + close

Verification mechanics only — no change reports or "what shipped" summaries inside this section per Shawn's walkthrough doc format.

| # | Description | Status |
|---|-------------|--------|
| E1 | **Document each persona's highlight reel in `docs/features/demo-mode.md`.** 3–4 surfaces per persona where their story reads strongest. Tereza: home feed + Vinohrady Evening Walkers + her profile + a recurring Riegrovy meet she hosts. Daniel: Reactive Dog Support + his profile (Locked) + the Klára training booking detail + post-meet review on a small calm meet. Klára: her care group + her provider profile + an active booking with sessions + a training-recap post. Tomáš: Karlín Dog Neighbors + his profile (Locked) + the Petra emergency conversation + Hugo's bookings list. | todo |
| E2 | **Walk each persona's highlight reel against the running app.** Flag any surface that's incoherent. Fix inline if 1–2 minutes; punt to the punch list otherwise. | todo |
| E3 | **Walk each persona's "rest of the app"** — Discover, Inbox, Schedule, Bookings, Notifications. Same fix-or-punt rule. | todo |
| E4 | **Update `docs/features/demo-mode.md` "Known limitations" section.** Most of the 6 limitations should now resolve to "fixed" — connections (1), conversations (2), posts (3), share codes (4) all addressed during the work captured in this board. Profile-edit-state (5) and SSR-flash (6) are accepted limitations, not Mock World Building scope. Also remove the "Cleanup pending" section — those files were deleted via P17. | todo |
| E5 | **Update `docs/implementation/mock-data-plan.md`.** Promote shipped sections from Target → Current. Close mock-data Open Questions where applicable. | todo |
| E6 | **Update Open Questions log.** Close item 10 (highlight reels) and item 11's connection-state line. P4 may also close depending on A1 resolution. | todo |
| E7 | **Update ROADMAP.md.** Move phase out of "Current Phase." Note that Cross-Cutting Flow Testing now has rich content to test against. Don't add a completion summary — archived board IS the record. | todo |
| E8 | **CLAUDE.md review.** Likely just removing Mock World Building from the Next Phase Recommended notes; structure didn't change. | todo |
| E9 | **Punch-list review.** Read change reports since phase open. Update any feature/design docs that completed punch-list fixes touched. | todo |
| E10 | **Structural audit (CONTRIBUTING step 8a).** Three checks — `status: archived\|complete` files in phases/, filename overlap with archive/, stale `last-reviewed` >21d. | todo |
| E11 | **Strategic review.** What did building this teach us about the demo arc? Are we ready to start packaging it? Open Questions worth resolving before Discover & Care opens? Recommendations on next-phase scope. | todo |
| E12 | **Show user the closing checklist before archiving.** Per memory: phase close is high-leverage; confirm before editing docs. | todo |
| E13 | **Archive this phase board.** Mark `status: archived`, `git mv docs/phases/mock-world-building.md docs/archive/phases/` (per P33 — single command, no duplicate-file risk). | todo |

---

## Acceptance Criteria

- [ ] `getConnectionState(userId, viewerId)` returns a populated `Connection` for any (user, viewer) pair where the relationship was seeded.
- [ ] Each of the 4 journey personas has at least 5 connections (mix of Connected / Familiar / Pending) reflecting their archetype. *(Already met — re-verify holds after rebalance.)*
- [ ] Picking Daniel from the dropdown shows: a non-empty home feed, a non-empty inbox, connection pills on meets, and a Locked profile that reflects his trust state. Same for Klára / Tomáš / Tereza.
- [ ] New User persona renders gracefully across every surface — empty states feel intentional.
- [ ] **Profile-visibility ratio is ~70% locked / 30% open.** Locked chip lists populate on at least one canonical demo meet. Privacy ramp reads.
- [ ] **Provider-userId pattern (P4) resolved.** No unsafe `getUserById(carerId)` calls in live code paths; bridge contract documented in `mockData.ts`.
- [ ] **Group↔Meet duplication (P21) resolved.** `Group.meetIds` removed from the type and all data; `getGroupMeets` derives from `Meet.groupId` only.
- [ ] **`MeetAttendee.profileOpen` auto-derive helper (P28)** in place; new attendee seeding goes through it.
- [ ] All four edge-case seedings (D1–D4) render correctly when walked.
- [ ] Inbox row format is consistent — `firstName + lastInitial` for every row, dog name present for every partner with a dog.
- [ ] Each persona's highlight reel walked against the running app; documented in `demo-mode.md`.
- [ ] TypeScript compiles clean.
- [ ] No regressions when viewing as Shawn — his existing world stays intact.

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update affected feature docs (`demo-mode.md`, `connections.md`, `messaging.md`)
- [ ] Update `mock-data-plan.md` (promote shipped → Current; close Open Questions)
- [ ] Update Open Questions log (items 10, 11; P4 if A1 resolved it)
- [ ] Update ROADMAP.md (move phase out)
- [ ] Review CLAUDE.md
- [ ] Review Punch List changes since phase open
- [ ] Structural audit (CONTRIBUTING step 8a)
- [ ] Strategic review
- [ ] Show user the closing checklist before archiving
- [ ] Archive this phase board (`git mv` per P33)

---

## Not in scope

- **Image generation.** Mock World Building uses existing assets only. New image gen is its own later pass.
- **Surface design changes.** If a page's design is broken, it's the next surface-deep-pass's job (Discover & Care, Schedule & Bookings). This phase only fills/fixes data.
- **Authentication, real backend, real-time messaging.** All still mock.
- **New product features.** If something is missing because we never built it, file it on the punch list — don't expand scope here.
- **Multi-user state mutations.** If Daniel marks Jana as Familiar in this session, Jana's view doesn't reflect it next session. Out of scope.
- **Notifications work.** Inbox & Notifications is its own upcoming phase. This phase doesn't touch notification triggers, badge counts, or the request-vs-thread distinction.

---

## Decisions made at phase open (carried forward from 2026-04-26)

1. **Scope cap: Demo-quality** (~4–6 sessions).
2. **Execution order: Workstream A first** (data-shape debt) → B (visibility ratio) → C (content walks) → D (edge cases) → E (verification + close).
3. **P4 (provider-userId): Formalise the bridge.** Providers stay `ProviderCard`-only; document `getUserById` may return `undefined`; ensure UI handles gracefully.
4. **Images: Existing assets only.**

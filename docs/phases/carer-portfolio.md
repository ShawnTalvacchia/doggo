---
status: draft
last-reviewed: 2026-06-02
review-trigger: When any task is completed or blocked; when prerequisite Open Questions resolve
---

# Carer Portfolio

> **Status: draft.** Sketched 2026-05-11 during Profiles Deep Pass walkthrough as the natural follow-on from resolving "what's the source of a carer's portfolio signal?" — Open Questions §8 (resolved). **Scope expanded 2026-06-02 from PO user interviews** — Workstreams E (circle attribution) and F (review form) added per Roman's insight that "has anyone in my circle booked this provider + what they said" is KEY to booking decisions. Sibling phase to Photos & Galleries (`docs/phases/photos-and-galleries.md`) but independent — they don't block each other. **Do not open as active until the threshold + display Open Questions resolve** — those decisions shape Workstream B.

**Goal:** Completed work becomes a visible trust credential. A carer's profile (and the surfaces that point at it) carries: (1) an aggregate signal — "30 completed sessions," "trained 25 dogs," however we frame it — computed from verifiable engagement records, not from photo tags or self-declared counts; (2) circle attribution — "N people in your circle booked {name}" — surfaced on Discover cards and the provider profile; (3) actual reviews (star + text) from completed bookings. Aligns with the Cold-Start Playbook credentialing-layer thesis: hard to fake, accumulates with real work, builds the moat.

**Thesis:** The platform already records every booking completion and every meet attendance. Those are two-sided ground truth (owner engaged → carer delivered → record exists). Surfacing them as a trust signal is mechanical once the design decisions resolve. The phase ships the aggregation + the circle-attribution lens + the review form — three views of the same credentialing-moat thesis.

**Depends on:**
- Existing `Booking` records with `state` field (need `completed` state populated for past sessions).
- Existing `MeetAttendee` records on past hosted meets.
- Existing `TrustBadgeStrip` + `lib/trustBadges.ts` badge system (extends, doesn't replace).
- Existing `getTrustBadges` computer pattern (the "Repeat Clients" badge already aggregates engagement-shaped data — this is the same family).

**Refs:** [[badges]], [[Trust & Connection Model]], [[Groups & Care Model]], [[Cold-Start Playbook]], `Open Questions §8`.

**Not in scope:**
- Photo-tag-based portfolio (rejected by the resolved Open Q §8 — see explanation there).
- Dog-level credit (a list of named dogs the carer trained, like a creator portfolio) — declined as a non-consensual leak of owner→carer engagement metadata. Aggregate counts only.
- Anonymised review excerpts to non-Connected viewers (Workstream E shows reviewer name only to viewers Connected to the reviewer; outside that, the count is shown without attribution).

---

## Opening Checklist

- [ ] Read every task and its referenced docs
- [ ] Confirm Open Questions §8 resolutions (threshold, surface, copy, time scope, unit naming) are decided. Phase can't open until these are locked.
- [ ] Audit `Booking` seed: enough `state: "completed"` records across personas that the aggregate reads believable. Klára especially (anchor carer for this phase).
- [ ] Audit `MeetAttendee` seed: past-meet attendance counts on Klára's training sessions, Tereza's hosted walks. Tomáš + Daniel won't have meaningful aggregates (intentional — they're not primary carers).
- [ ] Re-read `lib/trustBadges.ts` — extend the existing pattern, don't fork it
- [ ] Confirm scope — no scope leak into reviews, photo-portfolio, or owner-consent-for-named-dog-credit

---

## Tasks

### Workstream A — Aggregate computer

The data layer. Compute the engagement count, broken out by source so the display can choose what to show.

| # | Description | Status |
|---|-------------|--------|
| A1 | Helper `getCompletedEngagements(userId, options?)` in `lib/trustBadges.ts` (or a new sibling file if scope warrants). Returns `{ bookings: number, sessions: number, dogs: number, sinceDate: string }` where `bookings` = `Booking` records with `state: "completed"` AND `providerId === userId`; `sessions` = `MeetAttendee` records where `meet.hostId === userId` AND the meet's date is in the past AND the attendee was Going; `dogs` = unique-dog-count across both sources. | todo |
| A2 | Time-scope variants — `getCompletedEngagementsThisYear(userId)`, `getCompletedEngagementsAllTime(userId)`. Decide which gets exposed based on Open Q resolution. | todo |
| A3 | Mock data sanity check — log persona aggregates during phase opening, verify they read believable. Klára should show meaningful training-session counts; Tereza a smaller informal-carer count; Daniel + Tomáš near-zero (not the primary carer arc). | todo |

### Workstream B — Trust badge: design + render

The visible surface. Decisions resolved up front in Open Q §8; this workstream is the implementation.

| # | Description | Status |
|---|-------------|--------|
| B1 | Add a new badge entry to `TrustBadge` taxonomy (`lib/trustBadges.ts`). Type: community-earned (per the existing three-tier taxonomy: community-earned > credential > platform). Threshold to show: per Open Q resolution (e.g. show after 3 completed engagements; hide on 0–2). | todo |
| B2 | Copy format — apply the resolved Open Q decision. E.g. "30 completed sessions" (neutral) vs "Trained 25 dogs" (warmer). Pick one per surface and stick with it. | todo |
| B3 | Render in `TrustBadgeStrip` on carer profile hero (top-priority surface — already exists, badge just slots in). | todo |
| B4 | Decide PersonRow + Discover card propagation. Per the existing `TrustBadgeStrip` priority rule, Discover cards show top 2 badges; this new badge competes with existing ones for that slot. May not always make the cut — that's fine, the priority rule handles it. | todo |
| B5 | Empty-state — for new carers with 0 engagements, the badge doesn't render at all (not "0 completed sessions"). Hide entirely below threshold; no apologetic empty state. | todo |

### Workstream C — Cross-surface visibility audit

Verify the badge surfaces correctly without leaking the wrong privacy semantics.

| # | Description | Status |
|---|-------------|--------|
| C1 | Public-vs-circle carer audience — for `carerProfile.publicProfile: false` (circle-only) carers, does the badge show to non-Connected viewers? Probably no (consistent with the rest of the circle-Carer privacy rule). For `publicProfile: true` carers, yes universally. Document and enforce. | todo |
| C2 | Locked profile — does the badge show on a locked profile gated by relationship? Probably yes (the badge is a trust signal — that's exactly when a viewer is deciding whether to engage). But verify it doesn't bypass the lock for *other* profile content. | todo |
| C3 | Other-user viewer matrix walkthrough — Stranger / Familiar / Pending / Connected — the badge displays consistently with the rest of the hero's trust signals across these states. | todo |

### Workstream D — Mock data calibration + cross-cutting walkthrough

| # | Description | Status |
|---|-------------|--------|
| D1 | Calibrate persona engagement counts so the badge reads believable across the four personas + bridged carers (olgaM, marketaH, janaK, etc.). The bridged carers especially need realistic numbers — they exist as "established providers." | todo |
| D2 | Phase walkthrough: verify each persona's carer profile shows the right badge (or correctly hides it for non-carers + new carers). Walk Klára (high count from sessions), Tereza (modest count from informal sits), Daniel + Tomáš (no badge — not carers), Shawn (modest count), New User (no badge), bridged Carers (high counts). | todo |
| D3 | Strategic-review writeup at phase close — does the badge land the credentialing-layer thesis? Does Klára's profile feel more credible with it than without? Is the threshold right? Feed back into Cold-Start Playbook and `badges.md`. | todo |

### Workstream E — Circle attribution

Added 2026-06-02. The Discover-surface lens that says "N people in your circle have booked {name}." Roman flagged this as KEY to booking decisions — it's the credentialing-moat thesis at the moment-of-decision.

| # | Description | Status |
|---|-------------|--------|
| E1 | Helper `getCircleAttribution(viewerId, providerId)` in `lib/trustBadges.ts` (or sibling). Returns `{ count: number, attributedReviews: { reviewerId, bookingId, reviewSnippet? }[] }` where the count is unique-Connected-users of the viewer who have a completed Booking with the provider; `attributedReviews` includes those who left a review. Privacy gate: only surface reviewer names for users the viewer is Connected to (no Familiar leakage, no inference about other Connected-Connected relationships). | todo |
| E2 | Discover Care card — when `count >= 1`, render an inline-icon row "{N} in your circle have booked them." Sits next to the existing connection-signals row (community context). Compete-for-space rule: this signal wins over "Met at N walks" when both fire (it's more booking-relevant). | E1 | todo |
| E3 | Provider profile — new section "Booked by people you know" on the About tab (between the trust-badge strip and the Services preview). Renders as a small PersonRow stack (reviewer name + avatar + review excerpt + star rating if available) for Connected reviewers; non-Connected reviewers contribute to the count but render as anonymous rows ("Someone in your circle, 5 ★"). | E1, F1 | todo |
| E4 | Mock data — calibrate the bridged carers (olgaM, janaK, marketaH, etc.) so each demo persona viewing them sees a believable circle-attribution count. Klára especially needs at least 1-2 of Daniel's connections to have booked her (sets up the demo conversion narrative). | E1, D1 | todo |
| E5 | Empty-state — no surface when `count === 0`. Don't say "0 people in your circle have booked them" — silent absence is the correct treatment. | E2 | todo |

### Workstream F — Review form

Added 2026-06-02. Today the "Leave a review" button on completed bookings is a stub. This workstream lands the real form, which is the prerequisite for Workstream E's review excerpts.

| # | Description | Status |
|---|-------------|--------|
| F1 | `BookingReview` data shape — `{ id, bookingId, reviewerId, providerId, stars: 1-5, text: string, submittedAt: ISO, hiddenByModerator?: boolean }`. Persisted via `usePersistedState` in a new `ReviewsContext` (mirrors `BookingsContext`). | [[features/explore-and-care]] | todo |
| F2 | Review form modal — opens from the "Leave a review" CTA on a completed booking. Pet-as-protagonist hero (mirrors Sessions tab pattern), star rating (5-star tap-select), optional text area, submit. Validation: stars required, text optional but encouraged. | F1, [[features/explore-and-care]] Sessions tab anatomy | todo |
| F3 | Submission flow — on submit, lands a `BookingReview` record + posts a system message in the booking conversation ("Daniel left a 5★ review"). Familiar/Connected state unchanged (review action itself doesn't escalate; the Connected mark was already made on contract sign). | F1, F2 | todo |
| F4 | Provider profile — Reviews section on About tab (or its own tab if the count grows large). Renders reviews chronologically with star rating + reviewer name + text + booking-date context. Hidden reviews (moderator-flagged) skipped. | F1 | todo |
| F5 | Aggregate display — provider profile hero carries average-star rating + review count (e.g. "4.8 ★ · 24 reviews"). Discover Care cards carry the same. | F1, F4 | todo |
| F6 | Mock data — backfill reviews for completed bookings across the persona world. Klára gets 8-15 reviews; Tereza 2-4 (informal Carer); bridged carers vary from 5 to 30 to match their seeded engagement counts. Mix of all 4-5 star (warm); occasional 3-star (texture, not damning); no negative reviews seeded (mock world prefers a generous ecosystem). | F1, D1 | todo |
| F7 | Existing stub cleanup — the "Leave a review" placeholder button on completed bookings now opens the real form. Verify the "Stub" pill (if present) is removed. | F2 | todo |

---

## Acceptance Criteria

- [ ] Aggregate computer accurately counts completed bookings + past meet attendances per carer (Workstream A)
- [ ] Badge renders on carer profile hero (and propagates per priority rule) with the resolved copy + threshold (Workstream B)
- [ ] Threshold suppression works — carers below threshold don't show the badge
- [ ] Circle-only carers' badge respects the audience-visibility rule (Workstream C)
- [ ] Discover Care cards show "{N} in your circle have booked them" when count ≥ 1 (Workstream E)
- [ ] Provider profile carries the "Booked by people you know" section with named reviewers (Connected) + anonymous attribution (non-Connected) (Workstream E)
- [ ] Reviews can be submitted via the form modal; submission posts to provider profile + system message lands in conversation (Workstream F)
- [ ] Provider profile + Discover cards show aggregate star rating + review count (Workstream F)
- [ ] Privacy gate verified — no Familiar leakage; non-Connected reviewers anonymous in circle-attribution display
- [ ] Mock data reads believable across all personas + bridged carers
- [ ] `badges.md` updated with the new badge spec
- [ ] `features/profiles.md` and/or `Groups & Care Model.md` updated where the credit is described
- [ ] `features/explore-and-care.md` updated — review form is no longer in the Future section
- [ ] TypeScript compiles clean

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/` (badges.md especially)
- [ ] Update Open Questions §8 — mark threshold + display decisions as resolved (or point at the implementation docs); compress the entry to a one-liner pointing at its home
- [ ] Update ROADMAP.md — mark phase complete (move out of Current)
- [ ] Review CLAUDE.md — update if Carer Portfolio affects key decisions or trust model framing
- [ ] Archive this phase board + walkthrough (status: archived, `git mv` to `docs/archive/phases/`)
- [ ] Structural audit
- [ ] **Strategic review** — does this land the credentialing-layer moat? Anything to feed back into Cold-Start Playbook?

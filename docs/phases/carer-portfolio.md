---
status: draft
last-reviewed: 2026-05-11
review-trigger: When any task is completed or blocked; when prerequisite Open Questions resolve
---

# Carer Portfolio

> **Status: draft.** Sketched 2026-05-11 during Profiles Deep Pass walkthrough as the natural follow-on from resolving "what's the source of a carer's portfolio signal?" — Open Questions §8 (resolved). Sibling phase to Photos & Galleries (`docs/phases/photos-and-galleries.md`) but independent — they don't block each other. **Do not open as active until the threshold + display Open Questions resolve** — those decisions shape Workstream B.

**Goal:** Completed work becomes a visible trust credential. A carer's profile (and the surfaces that point at it) carries an aggregate signal — "30 completed sessions," "trained 25 dogs," however we frame it — computed from verifiable engagement records, not from photo tags or self-declared counts. Aligns with the Cold-Start Playbook credentialing-layer thesis: hard to fake, accumulates with real work, builds the moat.

**Thesis:** The platform already records every booking completion and every meet attendance. Those are two-sided ground truth (owner engaged → carer delivered → record exists). Surfacing them as a trust signal is mechanical once the design decisions resolve. The phase ships the aggregation + the surfaces; the strategy is already locked in.

**Depends on:**
- Existing `Booking` records with `state` field (need `completed` state populated for past sessions).
- Existing `MeetAttendee` records on past hosted meets.
- Existing `TrustBadgeStrip` + `lib/trustBadges.ts` badge system (extends, doesn't replace).
- Existing `getTrustBadges` computer pattern (the "Repeat Clients" badge already aggregates engagement-shaped data — this is the same family).

**Refs:** [[badges]], [[Trust & Connection Model]], [[Groups & Care Model]], [[Cold-Start Playbook]], `Open Questions §8`.

**Not in scope:**
- Photo-tag-based portfolio (rejected by the resolved Open Q §8 — see explanation there).
- Carer reviews / ratings system (separate concern; the rating data exists but display + computation is its own piece).
- Dog-level credit (a list of named dogs the carer trained, like a creator portfolio) — declined as a non-consensual leak of owner→carer engagement metadata. Aggregate counts only.

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

---

## Acceptance Criteria

- [ ] Aggregate computer accurately counts completed bookings + past meet attendances per carer.
- [ ] Badge renders on carer profile hero (and propagates per priority rule) with the resolved copy + threshold.
- [ ] Threshold suppression works — carers below threshold don't show the badge.
- [ ] Circle-only carers' badge respects the audience-visibility rule.
- [ ] Mock data reads believable across all personas + bridged carers.
- [ ] `badges.md` updated with the new badge spec.
- [ ] `features/profiles.md` and/or `Groups & Care Model.md` updated where the credit is described.
- [ ] TypeScript compiles clean.

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

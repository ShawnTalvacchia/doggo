---
status: archived
last-reviewed: 2026-05-14
review-trigger: When opening this phase, or when adding new deferred items
---

# Cross-Cutting Flow Testing

**Goal:** Every persona journey works end-to-end. Trust signals accumulate. No dead ends. With Mock World Building closed, per-persona feeds, inboxes, profiles, schedules, and bookings are populated — this phase tests that the flows between them hold up under scrutiny.

**Depends on:** Mock World Building (closed 2026-05-02), Discover & Care.

**Refs:** [[strategy/User Journeys.pptx]], [[strategy/Trust & Connection Model]], [[strategy/User Archetypes]]

---

## Pre-loaded Scope (deferred from punch list — 2026-05-03)

These items were raised on the punch list as data-hygiene gaps and a People-tab disclosure model gap. All become testable / fixable when the cross-cutting walkthroughs run, so they're loaded here.

### Mock-world edge-case seeding (was P47)

Each is a 1–2 line attendee-record edit on an existing meet — protects the tier/visibility model from quietly drifting in later passes.

- **(D1) Tier-2 unmarked attendee** on a canonical demo meet per persona — at least one attendee per persona's primary upcoming meet should have `profileVisibility: "open"` AND `connectionState === "none"` AND no `theyMarkedFamiliar` from the viewer. Verifies "Not Familiar" section renders.
- **(D2) Tier-2 inbound Familiar (deniability path).** On at least one meet per persona, seed an attendee where `theyMarkedFamiliar: true` from viewer's perspective WITHOUT outbound `state === "familiar"`. Row should bump to tier 2; no pill renders (deniability).
- **(D3) Pending pill on People tab.** At least one attendee per persona has `state === "pending"` from viewer's side. Verifies the Pending pill renders (currently rare in seeded data — most relationships skip Pending).
- **(D4) Following series + non-attendee viewer combo.** For one recurring meet per persona, seed `Meet.followers` with a viewer NOT in `attendeesByDate`. Verifies meet shows up in `/schedule?view=interested` even without an RSVP.

Touches `lib/mockMeets.ts`, `lib/mockConnections.ts`, attendee records on canonical demo meets.

### People tab disclosure model (was P32)

Separate **information** (open) from **action** (gated). **Pre-meet (any viewer):** owner+dog cards with names, grouped by relationship state (Connected, then Familiar, then unmarked tier-1/2). NO action pills — cards are info-only. Locked attendees → chip list at the bottom (matching post-meet review treatment). **Post-meet (attendee):** same content + action pills appear (Familiar / Connect / Message). Either keep the post-meet review sheet as the canonical action surface OR enable inline actions on the People tab too — both surfaces converge on the same content. **Post-meet (no-show):** same as pre-meet — no actions. The "earned reward" for showing up isn't seeing people; it's *deepening* with them. Implementation cascade depends on the owner+dog avatar pattern (see Design System Cleanup). Touches `components/meets/ParticipantList.tsx`, `app/meets/[id]/page.tsx` PeopleTab, and the matrix layer (probably an `actions: false` pass-through prop on PersonRow). Was tagged "Should ship before first-round testing" — fits this phase's scope. Surfaced 2026-04-27.

### Mock-user profileVisibility distribution skews too Open (was P36)

Per the community-first thesis, most users should default to **Locked** (privacy-by-default) — Open is the exception for users who actively want discoverability (providers needing clients, socially comfortable owners). Current mock data has many Open profiles, which weakens the demo of the privacy model: the Locked chip list rarely fills up, the trust ramp loses urgency, and the new-user test (Workstream B5) shows most members as visible cards rather than mostly-Locked. Recommend ~70% locked / 30% open as a starting ratio, with the open subset being mostly Helper/Provider tier carers + a few "social anchors" per neighbourhood. Keep providers (Klára, Olga, etc.) Open since their service visibility depends on it. Touches `lib/mockUsers.ts`. Surfaced 2026-04-29.

### MeetAttendee.profileOpen doesn't auto-derive from UserProfile (was P28)

Has to be set manually when seeding mock attendees. Caught us out on `meet-reactive-spring` (2026-04-27): added Marek/Lucie/Petra without `profileOpen: true` → they fell to tier 3 (Locked section) instead of tier 2 (Not Familiar) because `getAttendeeTier`'s open-profile check defaults to false. Two options: (a) helper `buildMeetAttendee(user)` that mirrors profileVisibility automatically — preferred; (b) update `getAttendeeTier` to look up the user's UserProfile when the attendee record's `profileOpen` is missing (heavier — couples runtime tier logic to mockUsers lookup, only works in demo mode). Lean (a). Surfaced 2026-04-27.

### Group ↔ meet relationship duplicated (was P21)

Each `Meet` has a `groupId`; each `Group` has a `meetIds` array. They drift — e.g. group-1 lists only `meet-1` in `meetIds`, but `meet-4` declares `groupId: "group-1"` and never makes it into the array. `getGroupMeets` was patched 2026-04-26 to take the union, papering over the inconsistency. Real fix: pick one as source of truth and make the other derived (or remove it). Recommendation: keep `m.groupId` (single source on the meet side, naturally maintained when authoring meets), drop `Group.meetIds` entirely. Touches `lib/mockGroups.ts`, `lib/mockMeets.ts`, `lib/types.ts`. Surfaced 2026-04-26.

### Mock-date staleness sweep (was P20)

The relative-date pattern (`lib/mockDate.ts` → `daysAgo`/`daysFromNow`/`daysAgoIso`) was applied 2026-04-26 to every `2026-04-*` date in the major mock files. Older timestamps (Jan/Feb/March 2026, Dec 2025) were left static as "deeper history." Mostly fine, but check whether any of those drive UI that benefits from being relatively recent — e.g. "completed bookings" with notes that say "2 weeks ago" reading as "3 months ago." If a sweep is needed, follow the same pattern. Also worth verifying: `createdAt` timestamps on meets in `mockMeets.ts` (kept static) — confirm they don't surface as "X ago" labels anywhere. Surfaced 2026-04-26.

---

## Status at open (2026-05-11)

Three of the pre-loaded data-hygiene items were already closed by earlier phases — the board language was stale:

- **P21 (Group ↔ meet dedupe)** — closed in Mock World Building A2 (2026-04-30). `Group.meetIds` was removed; `Meet.groupId` is the single source of truth. `getGroupMeets` reads only from the meet side. No work needed.
- **P28 (MeetAttendee.profileOpen auto-derive helper)** — closed in MWB A3 (2026-04-30). `buildMeetAttendee(user, overrides)` lives at the top of `lib/mockMeets.ts`. No work needed.
- **P36 (profileVisibility distribution skew)** — substantively closed in MWB B1. Current ratio is 17 Open / 14 Locked (~55/45). The 70/30 target isn't reachable while keeping all bridged providers Open (the Discover Refinement + Care Catalog phases added 7 more bridged providers — `jana-k`, `tomas-b`, `pavel-d`, `simona-v`, `martin-k`, `lenka-s`, `petr-v`). The documented intent (Locked-by-default for everyone *except* providers + a couple of social anchors) is satisfied: the non-provider Open set is exactly `eva` + `jana`. Further rebalance would require either making providers Locked-but-discoverable (awkward demo flow) or removing bridged inventory (weakens marketplace demo). Treating as closed.

## Tasks

### A — Edge-case attendee seeding (D1–D4) — **shipped 2026-05-11**

Each persona's canonical upcoming meet was seeded with the three edge-case attendees plus connection records to drive tier promotion. D4 (following-without-attending) was already satisfied for Tereza + Daniel via existing `SEED_FOLLOWERS`; Klára + Tomáš were added on meet-15.

- **D1 (tier-2 unmarked open):** Tereza→meet-15 (Nikola), Daniel→meet-17 (Petra), Klára→meet-18 (Petra), Tomáš→meet-19 (Jana).
- **D2 (tier-2 inbound Familiar — deniability):** Connection records added with `state: "none"` + `theyMarkedFamiliar: true` for Tereza→Filip, Daniel→Marek, Klára→Jakub, Tomáš→Vítek; each is also seeded as a meet attendee.
- **D3 (Pending pill):** Tereza→Jakub (existing pending), Daniel→Lucie (new pending), Klára→Jana (existing pending), Tomáš→Shawn (existing pending). All added to canonical meet attendees.
- **D4 (follower + non-attendee):** Tereza follows meet-1 (existing), Daniel follows meet-5 + meet-7 (existing), Klára + Tomáš added to meet-15 via `SEED_FOLLOWERS`.

Verification → `cross-cutting-flow-testing-walkthrough.md` Workstream A.

### B — Mock-date staleness sweep (P20) — **shipped 2026-05-11**

- `components/feed/FeedCard.tsx` — removed hardcoded `now = "2026-03-23T12:00:00Z"` constant; uses `Date.now()`.
- `lib/mockPosts.ts:post-klara-community` — migrated to `daysAgoIso(0, "10:30")` so the "Great session this morning!" caption aligns regardless of when the demo opens.

Verification → walkthrough Workstream C. Older static feed-post dates (deeper history) intentionally kept static; they fall through to the absolute-date branch (>7d) and read as "23 Mar" etc.

### C — Cross-persona discovery walkthrough — **pending user verification**

Discovery sweep checklist lives in walkthrough Workstream B. The intent is to catch dead-ends, broken cards, or persona-specific oddities not covered by the pre-loaded scope. New findings get appended to the walkthrough's *Decisions surfaced* section.

### D — People tab disclosure model (P32) — **shipped 2026-05-11**

Resolved during cross-persona walkthrough: tested Tomáš viewing his own upcoming `meet-19` (creator of a meet he's hosting) and the row stack was half-empty with no actions. The original past-attendance gate framed actions as the "earned reward for showing up." Walking it surfaced the inconsistency: the Group Members tab already grants actions on group co-membership, and a meet RSVP is the meet analog of group co-membership — opting into a specific gathering of people. The half-gate produced odd behaviour without preserving anything meaningful.

**Resolution.** Information stays open across all viewers. Action is gated by *meet-level engagement* (not past attendance): viewers who are the creator, have any RSVP on any occurrence (past or future, going or interested), or follow the series get Familiar / Connect / Message inline. Random Discover viewers with no commitment still see info-only rows. Single code change: `viewerCanAct(meet, viewerId)` in `lib/meetUtils.ts` was widened from past-attendance-only to creator OR any-RSVP OR series-follower. `viewerSharedMeetWith` (the locked-profile shared-context gate) keeps narrower past-shared-attendance semantics — different surface, different stake.

Docs updated: Trust & Connection Model → "Meet participant visibility rules"; features/meets.md → People tab; Content Visibility Model § People-tab disclosure; Open Questions log § P32 marked resolved.

---

## Acceptance Criteria

- [x] D1–D4 edge cases seeded on each persona's canonical upcoming meet (data-only).
- [x] Mock-date staleness sweep (P20) — FeedCard relative-time bug fixed; post-klara migrated to relative.
- [x] Cross-persona walkthrough completed by user; emergent issues resolved inline or filed (full record in walkthrough's *Decisions surfaced* section).
- [x] People tab disclosure model (P32) shipped — `viewerCanAct` widened to meet-level engagement (creator / any RSVP / series follower); info-vs-action separation preserved.
- [x] Typecheck clean — pre-existing `ButtonAction "ghost"` + duplicate `photos` errors fixed during walkthrough.

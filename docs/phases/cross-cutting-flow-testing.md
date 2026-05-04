---
status: planned
last-reviewed: 2026-05-03
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

## Tasks

To be defined when this phase opens. The pre-loaded scope above is the seed.

---

## Acceptance Criteria

To be defined when this phase opens.

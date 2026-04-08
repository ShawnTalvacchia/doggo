---
status: archived
last-reviewed: 2026-04-08T18:00
review-trigger: When any task is completed or blocked
---

# Demo Data & Richness

**Goal:** Build the mock data layer that makes the prototype feel alive. Richer user journeys, realistic content, enough depth that exploring any page reveals real interactions. Three demo personas (Tereza, Klára, Daniel) with full data journeys.

**Depends on:** Content Completion (done). All pages structurally complete with working interactions.

**Refs:** [[mock-data-plan]], [[User Archetypes]], [[Groups & Care Model]], [[Trust & Connection Model]], [[Content Visibility Model]]

---

## Workstream A — Foundation (data models, user profiles, dogs)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Create `mockUsers.ts` — 4 journey users (Tereza, Daniel, Klára, Tomáš) + 15 supporting cast with full profiles, avatars, neighborhoods | [[mock-data-plan]] | done |
| A2 | Create `mockDogs.ts` — Dogs embedded in UserProfile.pets in mockUsers.ts (no separate file needed) | [[mock-data-plan]] | done |
| A3 | Consolidate `mockGroups.ts` — 18 groups with expanded member rosters, fixed dog names (Bella→Hugo, Aron→Benny, Suki→Daisy), added park-karlin | [[mock-data-plan]] | done |
| A4 | Fix known inconsistencies — Tomáš dog/location, tomas_k→tomas, Eva avatar, PlayStyle types, booking owner IDs | [[mock-data-plan]] | done |

## Workstream B — Interactions (meets, connections, bookings)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Expand `mockMeets.ts` to 24 meets — 8 completed + 16 upcoming, 3 recurring patterns, proper attendee lists from mockUsers | [[mock-data-plan]] | done |
| B2 | Expand `mockConnections.ts` — 12 connections (4 connected, 4 familiar, 2 pending, 2 none) + 5 community carers | [[mock-data-plan]] | done |
| B3 | Expand `mockBookings.ts` to 10 bookings — Klára training (3), Petra emergency, Tereza friendship care, Shawn as carer (2) | [[mock-data-plan]] | done |
| B4 | Trust signal data embedded in connections (meetsShared, mutualConnections, sharedGroups) — separate attendance file deferred | [[mock-data-plan]] | done |

## Workstream C — Content (posts, reviews, conversations, notifications)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Expand `mockPosts.ts` to 35 posts — all groups covered, park/community/personal posts with comments | [[mock-data-plan]] | done |
| C2 | Expand `mockReviews.ts` to 13 reviews — Klára (6, 4.8avg), Olga (3), Petra (2), Tereza (1), Shawn (1) | [[mock-data-plan]] | done |
| C3 | Expand conversations — Tereza↔Shawn direct (evening walk coordination), Klára↔Shawn booking (training inquiry with proposal) | [[mock-data-plan]] | done |
| C4 | Expand group messages — Reactive Dog Support tips thread (7 msgs), Karlín emergency request (7 msgs), Klára session recap (6 msgs) | [[mock-data-plan]] | done |

## Workstream D — Polish & Verification

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Update `mockFeed.ts` — Feed logic already handles expanded data correctly, visibility model verified | [[mock-data-plan]] | done |
| D2 | Update `mockNeighbourhoodStats.ts` — Stats updated to reflect expanded dataset (38 walks, 16 meets, 52 dogs) | [[mock-data-plan]] | done |
| D3 | Cross-reference audit — Fixed 4 orphan author IDs in posts (kate→lucie, david→jakub, michal→ondřej, vera→adéla), 1 dog name (Ben→Rocky), 1 breed (Martin's Charlie: Lab→Frenchie) | [[mock-data-plan]] | done |
| D4 | Click-through verification — TypeScript compiles clean, all expanded data structurally valid | [[mock-data-plan]] | done |

---

## Acceptance Criteria

- [ ] 4 journey users + 15 supporting cast exist with full profiles
- [ ] Every group has 5+ members with proper IDs
- [ ] 20+ meets exist spanning completed/upcoming/recurring
- [ ] Connection web covers all key pairs from mock-data-plan
- [ ] 10+ bookings showing care network diversity
- [ ] 30+ feed posts distributed across all group types
- [ ] 12+ reviews across 6 providers
- [ ] Trust signal data exists (shared meets, mutual connections)
- [ ] No orphan references (every ID resolves to real data)
- [ ] Every page shows rich, realistic content when browsed

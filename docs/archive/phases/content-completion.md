---
status: archived
last-reviewed: 2026-04-08
review-trigger: When any task is completed or blocked
---

# Content Completion

**Goal:** Make every page feel finished. Fix structural issues, wire up interactions, fill content gaps. After this phase, no page should have empty panels, placeholder text, or non-functional controls.

**Depends on:** Doc restructure (completed April 8 session). All strategy and feature docs reviewed and aligned.

**Refs:** [[meets]], [[messaging]], [[explore-and-care]], [[Groups & Care Model]], [[profiles]], [[schedule]]

---

## Workstream A — Structural Changes (from recent decisions)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Remove Chat tab from neighbor/interest group detail. Update `getTabsForGroupType()` | [[meets]], [[Groups & Care Model]] | done |
| A2 | Add flat comment UI to group Feed posts (author avatar, name, text, timestamp). Local-state add. | [[meets]], [[messaging]] | done |
| A3 | Restructure meet detail page to tabs: Details · People · Chat. Extract current sections into tab content. | [[meets]] | done |

## Workstream B — Critical Fixes

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Wire Discover/Care results — render provider cards from mock data when a service type is selected | [[explore-and-care]] | done |
| B2 | Wire Discover/Meets filter logic — checkboxes and sliders should filter the results list | [[meets]] | done |
| B3 | Wire Discover/Groups filter logic — same as B2 for groups | [[meets]] | done |
| B4 | Replace Discover hub placeholder descriptions ("Short text about that") with real copy | [[explore-and-care]] | done |
| B5 | Build out Bookings "My Services" tab — provider view showing their service groups, active bookings as provider, incoming requests | [[schedule]], [[profiles]] | done |
| B6 | Make Inbox compose input functional (local-state send, message appears in thread) | [[messaging]] | done |

## Workstream C — Content Fill

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Ensure every group has 2-3 feed posts with mock comments (once A2 lands) | [[meets]], [[mock-data-plan]] | done |
| C2 | Ensure every care group has 1-2 upcoming events in mock data | [[Groups & Care Model]] | done |
| C3 | Ensure care group galleries have 6+ photos (enough for all 3 modes to look real) | [[Groups & Care Model]] | done |
| C4 | Add mock posts authored by "shawn" so profile Posts tab isn't empty | [[profiles]] | done |
| C5 | Expand notification mock data to 15-20 items across all types | -- | done |
| C6 | Add feed filtering by category tab on Community right panel | [[meets]] | done |

## Workstream D — Polish

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Schedule card consistency: unify Meet vs Care card patterns (shared structure, distinct color accents/strokes) | [[schedule]] | done |
| D2 | Remove redundant "Upcoming" label from cards shown under the Upcoming tab | [[schedule]] | done |
| D3 | "Book a spot" CTA should not appear on cards in Upcoming (user already booked) — move to Interested tab or Discover | [[schedule]] | done |
| D4 | Rename "Invited" tab → "Interested" and wire interest actions to populate it | [[schedule]], [[meets]] | done |
| D5 | General UI tweaks backlog (accumulated during development — list here as discovered) | -- | todo |

---

## Acceptance Criteria

- [ ] Group detail for neighbor/interest groups has no Chat tab
- [ ] Group Feed posts show flat comments with add-comment input
- [ ] Meet detail uses tabbed layout (Details · People · Chat)
- [ ] Discover/Care shows provider result cards when service type selected
- [ ] Discover/Meets filters actually filter the results list
- [ ] Discover/Groups filters actually filter the results list
- [ ] Discover hub has real descriptive copy (no placeholder text)
- [ ] Bookings "My Services" tab shows provider-relevant content
- [ ] Inbox compose sends a message (local state, appears in thread)
- [ ] Every group has feed posts; every care group has events and gallery content
- [ ] No page has an empty primary content area when viewed as the demo user

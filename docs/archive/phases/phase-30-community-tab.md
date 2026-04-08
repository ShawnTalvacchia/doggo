---
status: done
last-reviewed: 2026-04-08
review-trigger: When any task is completed or blocked
---

# Phase 30 — Community Tab & Group Taxonomy

**Goal:** Rename Home → Community, replace the binary Groups/Feed tabs with category sub-tabs (All / Parks / Neighbors / Interest / Care), expand the group type system, and update the left panel to filter groups by category with the right panel showing a category-filtered feed or group detail.

**Depends on:** Phase 29 (component consolidation), [[Community & Provider Groups Evolution]] (strategy doc).

**Key reference:** `docs/strategy/Community & Provider Groups Evolution.md`

---

## Workstream A — Navigation Rename (Home → Community)

| Task | Description | Status |
|------|-------------|--------|
| A1 | Update `BottomNav.tsx`: change "Home" label to "Community", switch to UsersThree icon | done |
| A2 | Update `Sidebar.tsx` (desktop sidebar): "Home" → "Community" with Users icon | done |
| A3 | `pageMenuGroups.ts` no longer exists — dev menu references N/A | done |
| A4 | Route mappings verified: `/home`, `/communities/*`, `/groups/*` all map to Community tab | done |

## Workstream B — Group Type System Expansion

| Task | Description | Status |
|------|-------------|--------|
| B1 | `lib/types.ts`: `GroupType` is `"park" \| "neighbor" \| "interest" \| "care"` | done |
| B2 | `CareCategory` type added: `"training" \| "walking" \| "grooming" \| "boarding" \| "rehab" \| "venue" \| "vet" \| "other"` | done |
| B3 | `mockGroups.ts`: 19 groups classified under new types | done |
| B4 | `getGroupsByType()` and `getGroupsByCareCategory()` helpers added | done |
| B5 | `CardGroup.tsx`: TYPE_CONFIG + CARE_LABELS render correct badges per type | done |
| B6 | `GroupCard.tsx`: TYPE_CONFIG updated for new types | done |

## Workstream C — Category Sub-tabs on Community Page

| Task | Description | Status |
|------|-------------|--------|
| C1 | 5 category tabs: All, Parks, Neighbors, Interest, Care | done |
| C2 | Left panel: group list filtered by active category tab | done |
| C3 | Right panel: feed shown when no group selected (not yet category-filtered — shows all feed items) | done |
| C4 | Group selection → group detail in right panel (preserved via `/communities/[id]` route) | done |
| C5 | Mobile panel-tabbar: category tabs work in collapsed/mobile view via `home-tab-bar` | done |
| C6 | URL state: `?tab=all|parks|neighbors|interest|care` via `useSearchParams` | done |

## Workstream D — Mock Data Migration & Expansion

| Task | Description | Status |
|------|-------------|--------|
| D1 | 6 park groups retained as type `"park"` | done |
| D2 | Community groups reclassified to `"neighbor"` (4 groups) | done |
| D3 | Service groups reclassified to `"care"` with careCategory (3 groups) | done |
| D4 | 4 neighbor groups present (Vinohrady Morning Crew, Žižkov Dog Parents, Vinohrady Evening Walkers, Karlín Dog Neighbors) | done |
| D5 | 4 interest groups present (Stromovka Off-Leash Club, Reactive Dog Support, Prague Doodle Owners, Senior Dogs & Slow Walks) | done |
| D6 | Each category tab has 3+ groups | done |

## Workstream E — Discover Groups Page Update

| Task | Description | Status |
|------|-------------|--------|
| E1 | `app/discover/groups/page.tsx` type picker: Parks / Neighbors / Interest / Care | done |
| E2 | Filter logic uses `GroupType` values with `getAllPublicGroups()` | done |
| E3 | CardGroup renders correctly with new type badges | done |

---

## Out of scope (future phases)

- Care group configuration model (service listings, booking CTAs, gallery modes) → Phase 31
- Empty states and onboarding messaging → Phase 32
- Demo entry page and user scenario data → Phase 33
- Provider "Hosted by" badge and service tab on group detail → Phase 31

---

## Acceptance Criteria

- [x] Bottom nav and sidebar say "Community" not "Home"
- [x] Community page has 5 category tabs that filter the left panel group list
- [x] Right panel shows feed when no group selected (category filtering of feed is partial — shows all items)
- [x] Selecting a group shows group detail in right panel (existing behavior preserved)
- [x] Group types in code are `park | neighbor | interest | care`
- [x] All 19 mock groups classified under new types
- [x] Each category tab shows at least 3 groups
- [x] Discover > Groups filter uses new taxonomy
- [x] Mobile/collapsed view works with new tabs

## Notes

- C3 (category-filtered feed): The feed currently shows all items regardless of tab. True category filtering would require tagging feed items by group type, which is a future enhancement.
- Tab bar border consistency fix applied during this phase: all panel section dividers normalized to 1px solid.

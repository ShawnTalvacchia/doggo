---
status: done
last-reviewed: 2026-04-09
review-trigger: When any task is completed or blocked
---

# Phase 31 — Care Groups & Provider Configuration

**Goal:** Make Care groups functionally distinct from other group types. Add provider configuration, "Hosted by" badge, service listings within groups, booking CTAs on events, and varied group detail tabs per type. Flesh out care mock data across all provider categories.

**Depends on:** Phase 30 (Community tab & group taxonomy).

**Key reference:** `docs/strategy/Community & Provider Groups Evolution.md` → "Provider Types & How They Use Groups" and "Group Configuration Model" sections.

---

## Workstream A — Care Group Data Model

| Task | Description | Status |
|------|-------------|--------|
| A1 | Extend Group type with care-specific fields: `hostedByAvatarUrl`, `serviceListings` (array), `galleryMode` (`"standard" \| "portfolio" \| "updates"`), `locationFixed` (address), `capacityEnabled` (boolean), `careConfig` | done |
| A2 | Create `CareGroupConfig` type, `GroupServiceListing` type, `GalleryMode` type | done |
| A3 | Add `CARE_CONFIG_DEFAULTS` per category (training, walking, grooming, boarding, rehab, venue, vet, other) in mockGroups.ts | done |

## Workstream B — "Hosted by" Provider Badge

| Task | Description | Status |
|------|-------------|--------|
| B1 | Add "Hosted by [Provider Name]" card to group detail header for care groups (avatar, name, category, "View profile" link) | done |
| B2 | Link to provider's profile page via `/profile/{hostedBy}` | done |
| B3 | Show provider's care category label (Dog Trainer, Dog Walker, etc.) | done |
| B4 | Update CardGroup to show "Hosted by [name]" line with Storefront icon for care groups | done |
| B5 | Show fixed location address for care groups with `locationFixed` | done |

## Workstream C — Group Detail Tabs Per Type

| Task | Description | Status |
|------|-------------|--------|
| C1 | Dynamic tab sets per group type via `getTabsForGroupType()`: | done |
|     | — Park: Feed, Meets, Members | |
|     | — Neighbor: Feed, Meets, Members, Chat | |
|     | — Interest: Feed, Meets, Members, Chat | |
|     | — Care: Feed, Events, Services, Members, Gallery | |
| C2 | Build Services tab: provider service menu with title, description, pricing, booking CTA | done |
| C3 | Build Gallery tab with 3 mode support: standard (grid), portfolio (before/after labels), updates (date-grouped) | done |
| C4 | Rename "Meets" to "Events" for care groups (shared `MeetsTab` with `isCare` prop) | done |

## Workstream D — Booking CTAs on Events

| Task | Description | Status |
|------|-------------|--------|
| D1 | `serviceCTA` field already existed on Meet type — used by 3 new care group meets | done |
| D2 | Render booking CTA bar on CardMeet (price, spots left, label with arrow) | done |
| D3 | CTA links to `/bookings` (provider booking flow) | done |
| D4 | Show capacity indicator: spots left and going count | done |

## Workstream E — Care Mock Data

| Task | Description | Status |
|------|-------------|--------|
| E1 | Klára's Calm Dog Sessions (training) — 3 services, 5 members, 1 event with CTA | done |
| E2 | Pawel's Prague Pack (walking) — 3 services, 4 members, 1 event with CTA, updates gallery | done |
| E3 | Dognut Grooming Prague (grooming) — 4 services, 4 members, portfolio gallery | done |
| E4 | Happy Tails Boarding (boarding) — 3 services, 4 members, updates gallery, approval required | done |
| E5 | PhysioDOG Recovery Community (rehab) — 3 services, 3 members, private | done |
| E6 | Café Letka Dog Corner (venue) — no services, 5 members, 1 puppy social event | done |
| E7 | PremiumVet Prague Community (vet) — no services, 6 members | done |
| E8 | Provider users wired: klara, pawel, dognut, happy_tails, physiodog, cafe_letka, premiumvet | done |
| E9 | Reclassified Letná Recall Training from care→interest (Klára's group is the sole training care group) | done |

## Workstream F — Discover Integration

| Task | Description | Status |
|------|-------------|--------|
| F1 | CardGroup already shows provider badge + category tag via TYPE_CONFIG + CARE_LABELS (Phase 30) | done |
| F2 | Discover > Dog Care surfacing deferred (future: surface care groups alongside provider listings) | deferred |
| F3 | Care group cards show service highlights: top 2 service titles + "from X Kč" on CardGroup | done |

---

## Out of scope (future phases)

- Care group creation flow (provider creating their own group) → future
- Empty states for care groups → Phase 32
- Demo entry page per user type → Phase 33
- Discover > Dog Care: surface care groups alongside individual provider listings → future

---

## Acceptance Criteria

- [x] Care groups display "Hosted by [Provider]" with link to profile
- [x] Care group detail has differentiated tabs (Feed, Events, Services, Members, Gallery)
- [x] Services tab shows provider's service menu with pricing
- [x] Events in care groups can show booking CTAs with capacity
- [x] Gallery supports three modes (standard, portfolio, updates)
- [x] 7 care mock groups exist, one per provider category
- [x] Each care group has realistic mock data (events, posts, members, services)
- [x] Discover pages surface care groups appropriately (CardGroup enhancements)
- [x] Non-care group types unaffected (same tabs and behavior as before)

## Notes

- The `serviceCTA` field on the Meet type pre-existed from Phase 19. Phase 31 added mock data using it and rendered it in CardMeet.
- Letná Recall Training was reclassified from `care` to `interest` to avoid 2 training care groups. Klára's Calm Dog Sessions is the canonical training care group.
- F2 (Discover > Dog Care integration) deferred — care groups already appear in Discover > Groups. Surfacing them in the Dog Care tab requires deeper work on the care discovery page.

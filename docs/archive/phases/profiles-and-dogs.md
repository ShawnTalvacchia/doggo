---
status: archived
last-reviewed: 2026-04-12
review-trigger: n/a — archived
---

# Profiles & Dogs

**Goal:** Design and build comprehensive profile pages (self and other-user) and decide how dogs are surfaced. Include provider profile services section deferred from Bookings phase. Make profiles feel like the relationship hub they need to be for the demo story.

**Depends on:** Bookings & Care Provider Flow (done), Page Content & Interactions (done).

**Refs:** [[profiles]], [[Trust & Connection Model]], [[User Archetypes]], [[explore-and-care]]

---

## Opening Checklist

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Audit own profile page (`/profile`) current state
- [x] Audit other-user profile page (`/profile/[userId]`) current state
- [x] Audit provider profile page (`/discover/profile/[providerId]`) current state
- [x] Review profile mock data structure and pet data
- [x] Confirm scope — no tasks that belong in a different phase

---

## Tasks

### Own Profile Redesign

| # | Description | Status |
|---|-------------|--------|
| S1 | Own profile layout — rewritten to PageColumn + TabBar pattern matching all other pages | done |
| S2 | About tab — hero (avatar, name, location, member since), bio, PetCards, connections, edit mode all inline | done |
| S3 | Pet section — PetCards inline on About tab with expand/collapse toggle (defaultExpanded prop) | done |
| S4 | Edit flow — edit mode for bio, pets, settings works within the new layout | done |

### Other-User Profile

| # | Description | Status |
|---|-------------|--------|
| O1 | Other-user profile on PageColumn — unified layout with DetailHeader, TabBar, URL-based tab state | done |
| O2 | Connection state display — connection badge + trust signals in hero section | done |
| O3 | CTA row — pill-shaped buttons gated by connection state (Message/Book/Connect/disabled) | done |
| O4 | Pet visibility — PetCards shown collapsed (defaultExpanded=false) on other profiles | done |

### Provider Profile Services (deferred from Bookings)

| # | Description | Status |
|---|-------------|--------|
| P1 | Services tab on profile — shows care offerings from provider or community carer data | done |
| P2 | Reviews section — reviews displayed on Services tab from mockData | done |
| P3 | Provider badge / indicator — provider stats (rating, reviews, services) shown in hero when user is a provider | done |

### Dog Profiles

| # | Description | Status |
|---|-------------|--------|
| D1 | Dog profile decision — inline PetCards on owner profile with expand/collapse, no separate dog pages needed for demo | done |
| D2 | Dog profile content — photo, breed, size, age, energy, play styles, socialisation, health notes, gallery — all visible when expanded | done |
| D3 | Dog profile in context — PetCards used consistently on own and other-user profiles | done |

### Profile Completeness

| # | Description | Status |
|---|-------------|--------|
| C1 | Profile completeness indicator | deferred — not critical for demo, moved to future |
| C2 | Empty state design | deferred — not critical for demo, moved to future |

### Unification & Cleanup

| # | Description | Status |
|---|-------------|--------|
| U1 | Provider ID bridge — added userId field to ProviderCard type, mapped nikola-r → nikola | done |
| U2 | Provider profile redirect — `/discover/profile/[providerId]` → `/profile/[userId]` | done |
| U3 | Link updates — all profile links across app updated to `/profile/[userId]` pattern | done |
| U4 | CSS cleanup — ~200 lines of dead profile layout classes removed from globals.css | done |
| U5 | Dead file cleanup — ProfileHeader.tsx, ProfileHeaderOwn.tsx deleted, styleguide updated | done |

---

## Acceptance Criteria

- [x] Own profile uses PageColumn and feels consistent with other pages
- [x] Other-user profile shows relationship-aware content and gated CTAs
- [x] Dogs are surfaced in a clear, decided-upon pattern (inline PetCards with expand/collapse)
- [x] Provider profiles show services and reviews
- [x] At least one dog has rich profile data (photo, breed, energy, play styles)
- [ ] Profile completeness indicator exists on own profile — **deferred**
- [x] TypeScript compiles clean
- [x] Feature docs updated for any changed behavior

---

## Closing Checklist

- [x] Walk through every acceptance criterion against the running app
- [x] Update all affected feature docs in `docs/features/`
- [x] Update Open Questions log — close resolved, add new
- [x] Update ROADMAP.md — mark phase complete with summary
- [x] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [x] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [x] Check next phase scope for conflicts with what was just built

---

## Key Outcomes

- **Three profile pages → one pattern.** Own profile, other-user profile, and provider profile all use PageColumn + TabBar. Provider profile route redirects to `/profile/[userId]`.
- **PetCard expand/collapse.** Cards show header by default, full details on expand. Own profile defaults expanded, other profiles collapsed.
- **Connection-gated CTAs.** Pill-shaped action buttons on other-user profiles: Message + Book Care (connected), Connect (familiar), disabled states (pending/none).
- **Provider data on unified profile.** Services tab appears when user has provider data. Hero shows provider stats (rating, review count).
- **Provider ID bridge.** `userId` field on ProviderCard maps provider catalog IDs to user registry IDs.
- **~200 lines dead CSS removed.** Old profile shell, header, desktop two-column layout, and tab classes cleaned up.
- **Deferred:** Profile completeness indicator and empty state design — not critical for demo story.

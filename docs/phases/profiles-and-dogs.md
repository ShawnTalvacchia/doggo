---
status: active
last-reviewed: 2026-04-13
review-trigger: When any task is completed or blocked
---

# Profiles & Dogs

**Goal:** Design and build comprehensive profile pages (self and other-user) and decide how dogs are surfaced. Include provider profile services section deferred from Bookings phase. Make profiles feel like the relationship hub they need to be for the demo story.

**Depends on:** Bookings & Care Provider Flow (done), Page Content & Interactions (done).

**Refs:** [[profiles]], [[Trust & Connection Model]], [[User Archetypes]], [[explore-and-care]]

---

## Opening Checklist

- [ ] Read every task and its referenced docs
- [ ] Review Open Questions log — flag anything affecting this phase
- [ ] Audit own profile page (`/profile`) current state
- [ ] Audit other-user profile page (`/profile/[userId]`) current state
- [ ] Audit provider profile page (`/discover/profile/[providerId]`) current state
- [ ] Review profile mock data structure and pet data
- [ ] Confirm scope — no tasks that belong in a different phase

---

## Tasks

### Own Profile Redesign

| # | Description | Status |
|---|-------------|--------|
| S1 | Own profile layout audit — does the current desktop sidebar + right panel feel right on PageColumn? Decide if profile should follow the same single-column pattern as other pages | todo |
| S2 | About tab content review — bio, location, member since, connections list, visibility toggle. Are these the right sections? Is anything missing? | todo |
| S3 | Pet section redesign — should dogs be inline cards on the About tab, their own tab, or tappable sub-pages? Decide and build | todo |
| S4 | Edit flow polish — ensure edit mode for bio, pets, and settings feels smooth and complete | todo |

### Other-User Profile

| # | Description | Status |
|---|-------------|--------|
| O1 | Other-user profile on PageColumn — unified layout matching own profile, with relationship-aware content | todo |
| O2 | Connection state display — connection badge, shared meets/groups, mutual connections | todo |
| O3 | CTA row — relationship-gated actions (Message, Connect, Book Care, etc.) matching the patterns from booking detail | todo |
| O4 | Pet visibility — what dog info does a non-connected user see vs a connected one? | todo |

### Provider Profile Services (deferred from Bookings)

| # | Description | Status |
|---|-------------|--------|
| P1 | Services tab on profile — list of offered services with pricing, availability summary | todo |
| P2 | Reviews section — existing reviews displayed on Services tab (data exists in mockData) | todo |
| P3 | Provider badge / indicator — how does a profile visually signal "this person offers care"? | todo |

### Dog Profiles

| # | Description | Status |
|---|-------------|--------|
| D1 | Dog profile decision — own page (`/dogs/[dogId]`), expandable section on owner profile, or both? | todo |
| D2 | Dog profile content — photo, breed, size, age, energy level, play styles, socialisation notes, vet info | todo |
| D3 | Dog profile in context — how dogs appear on meet cards, booking cards, community posts (avatar, name, breed summary) | todo |

### Profile Completeness

| # | Description | Status |
|---|-------------|--------|
| C1 | Profile completeness indicator — gentle progress bar or checklist nudging users to fill out profile and pet info | todo |
| C2 | Empty state design — what does a sparse profile look like? Encouraging, not embarrassing | todo |

---

## Acceptance Criteria

- [ ] Own profile uses PageColumn and feels consistent with other pages
- [ ] Other-user profile shows relationship-aware content and gated CTAs
- [ ] Dogs are surfaced in a clear, decided-upon pattern (inline, sub-page, or both)
- [ ] Provider profiles show services and reviews
- [ ] At least one dog has rich profile data (photo, breed, energy, play styles)
- [ ] Profile completeness indicator exists on own profile
- [ ] TypeScript compiles clean
- [ ] Feature docs updated for any changed behavior

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [ ] Check next phase scope for conflicts with what was just built

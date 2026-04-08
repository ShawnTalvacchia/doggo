---
status: planned
last-reviewed: 2026-04-08
review-trigger: When any task is completed or blocked
---

# Phase 32 — Empty States & Community Polish

**Goal:** Make the Community tab work for new users and sparsely populated states. Add meaningful empty states at every level, onboarding messaging, tab counts, and visual polish.

**Depends on:** Phase 31 (care groups).

---

## Workstream A — Community Tab Empty States

| Task | Description | Status |
|------|-------------|--------|
| A1 | Full empty state: user has no groups at all. Show explanation + CTAs (Create a Group, Explore). Copy from strategy doc. | todo |
| A2 | Per-category empty state: user has groups but none in this category. Contextual messaging per tab (e.g., Care tab: "No care providers yet — find them in Discover") | todo |
| A3 | Feed empty state: user is on "All" tab, in groups, but no recent posts. "Your groups are quiet — check out upcoming events or start a conversation" | todo |

## Workstream B — Group Detail Empty States

| Task | Description | Status |
|------|-------------|--------|
| B1 | No posts in Feed tab: "No posts yet. Share a moment or start a discussion." | todo |
| B2 | No events in Meets/Events tab: "No upcoming events. [Create one]" (if user has permission) | todo |
| B3 | No members beyond creator: "Invite people to grow this group." | todo |
| B4 | No photos in Gallery tab: "Photos from events and members will appear here." | todo |
| B5 | No services in Services tab (care groups): "The host hasn't listed services yet." | todo |

## Workstream C — Tab Counts & Signals

| Task | Description | Status |
|------|-------------|--------|
| C1 | Show group count badge on each category tab: "Parks (4)", "Care (2)" | todo |
| C2 | Consider unread/new activity indicator on tabs with recent posts | todo |
| C3 | "All" tab shows total group count | todo |

## Workstream D — Onboarding Messaging

| Task | Description | Status |
|------|-------------|--------|
| D1 | First-visit banner on Community tab (dismissible): brief explanation of what Community is and how groups work | todo |
| D2 | Suggested groups section: when user has < 3 groups, show "Groups near you" or "Popular in Prague" recommendations below their group list | todo |
| D3 | Post-join prompt: after joining first group, brief prompt about what they can do (browse events, introduce yourself, etc.) | todo |

## Workstream E — Visual Polish

| Task | Description | Status |
|------|-------------|--------|
| E1 | Ensure category tabs look good with 5 items on mobile (horizontal scroll if needed) | todo |
| E2 | Verify group list sorting feels right in each tab | todo |
| E3 | Feed content cards render correctly with category filtering | todo |
| E4 | Consistent loading states for tab switching | todo |
| E5 | Review and refine all group-related icons and badges for new taxonomy | todo |

---

## Acceptance Criteria

- [ ] New user with no groups sees a helpful empty state with clear CTAs
- [ ] Each category tab has a contextual empty state when no groups of that type
- [ ] Group detail tabs each have appropriate empty states
- [ ] Category tabs show group counts
- [ ] First-visit onboarding messaging exists and is dismissible
- [ ] 5 tabs work on mobile without visual breakage
- [ ] Suggested groups appear for users with few group memberships

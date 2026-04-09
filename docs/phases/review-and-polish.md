---
status: active
last-reviewed: 2026-04-08
review-trigger: When any task is completed or blocked
---

# Review & Polish

**Goal:** Walk through the entire prototype with fresh eyes, identify and fix visual issues, interaction bugs, content gaps, and UX rough edges. The prototype should feel polished and coherent before we build persona switching and the demo entry page.

**Depends on:** Content Completion (done), Demo Data & Richness (done).

**Refs:** [[frontend-style]], [[component-inventory]], [[design-tokens]], [[mock-data-plan]]

---

## Opening Checklist

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — no blockers for this phase
- [x] Audit for conflicts — no conflicts (this phase is reactive to user review)
- [x] Referenced docs all updated within last session
- [x] Scope confirmed — user-driven review, tasks added as discovered

---

## How This Phase Works

Unlike other phases, Review & Polish starts with an **empty task list**. Shawn reviews the prototype page by page, identifies issues, and they get logged here. Tasks are grouped into workstreams as patterns emerge.

**Categories for incoming issues:**
- **Visual** — spacing, alignment, colors, typography, card layout
- **Interaction** — broken clicks, missing hover states, non-functional controls
- **Content** — placeholder text, thin data, inconsistent copy
- **UX** — confusing flows, missing feedback, navigation gaps
- **Data** — mock data issues, wrong names/avatars, broken references

---

## Workstream A — Issues from Review

| # | Description | Category | Page/Component | Status |
|---|-------------|----------|----------------|--------|
| A1 | ~~Community groups should open in detail panel~~ → Superseded by A6 | Interaction | — | superseded |
| A2 | Inbox panel widths should match Discover (400/640/640) | Visual | inbox/page.tsx, globals.css | done |
| A3 | Inbox should show full conversation inline (not last 5 + "Open full") | UX | inbox/page.tsx | done |
| A4 | Inbox third panel: rich contact info (dogs, relationship, shared groups/meets, booking context) | UX | inbox/page.tsx | done |
| A5 | Inbox detail panel: add message composer UI | UX | inbox/page.tsx, globals.css | done |
| A6 | Community page: single panel, Groups/Feed tabs, header above panel, groups link to full subpage | UX | home/page.tsx, globals.css | done |
| A7 | Group detail: banner → info → sticky tabs, back button via router.back() | UX | communities/[id]/page.tsx, globals.css | done |
| A8 | CardGroup: remove onSelect/isSelected dual-mode, always use Link navigation | Cleanup | CardGroup.tsx | done |
| A9 | Feed card redesign: Threads-style two-column layout, unified FeedCard component | Visual | FeedCard.tsx, globals.css | done |
| A10 | Group detail: tabs at panel top (outside scroll), banner/info inside Feed tab | UX | communities/[id]/page.tsx, globals.css | done |
| A11 | Dynamic header action per tab (Post / Create meet / Invite) | UX | communities/[id]/page.tsx | done |
| A12 | Outline button hover: surface-popout + shadow-sm | Visual | globals.css | done |
| A13 | Feed-first default tab on Community page | UX | home/page.tsx | done |
| A14 | Members tab: group by connection state, add actions (message, connect), shared groups/meets labels, richer pet info | UX | communities/[id]/page.tsx | future |
| A15 | Gallery tab: album support, grouping by event/date | UX | communities/[id]/page.tsx | future |

---

## Workstream B — Known Backlog (from previous phases)

| # | Description | Category | Page/Component | Status |
|---|-------------|----------|----------------|--------|
| B1 | D5 backlog items from Content Completion (general UI tweaks) | Visual | Various | todo |
| B2 | Swap Unsplash placeholder URLs for generated images (when ready) | Content | All mock files | done |

---

## Acceptance Criteria

- [ ] Shawn has reviewed all major pages and is satisfied with current state
- [ ] All raised issues are either fixed or explicitly deferred to a future phase
- [ ] No visual or interaction bugs that would undermine a demo
- [ ] TypeScript compiles clean
- [ ] Feature docs updated if any review fixes changed feature behaviour

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [ ] Check next phase scope for conflicts with what was just built

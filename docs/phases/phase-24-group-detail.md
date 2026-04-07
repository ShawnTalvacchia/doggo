---
status: complete
last-reviewed: 2026-04-06
review-trigger: When any task is completed or blocked
---

# Phase 24 — Group Detail Restructure

**Goal:** Restructure the Group/Community detail page from a single scrollable column into a tabbed layout with panel architecture, consistent with every other page in the app.

**Depends on:** Phase 22 (panel architecture), Phase 23 (CardMeet unified component).

**References:**
- `docs/implementation/content-audit.md` — Groups section
- `app/home/page.tsx` — Reference pattern for URL-based tabs

---

## Workstream A — Page Restructure

| Task | Description | Status |
|------|-------------|--------|
| A1 | Persistent header: cover, name, badges, actions (above tabs) | done |
| A2 | Tab system: Feed · Meets · Members · Chat (URL state) | done |
| A3 | Feed tab: posts + gallery | done |
| A4 | Meets tab: CardMeet variant="group" + create CTA | done |
| A5 | Members tab: member cards with connection badges | done |
| A6 | Chat tab: join-gated, messages, compose | done |

**File:** `app/communities/[id]/page.tsx`

---

## Workstream B — Layout & CSS

| Task | Description | Status |
|------|-------------|--------|
| B1 | Page wrapper (single centered column) | done |
| B2 | Tab content in PanelBody + Spacer | done |
| B3 | Always-visible tabs (not panel-tabbar) | done |

---

## Workstream C — Doc Updates

| Task | Description | Status |
|------|-------------|--------|
| C1 | Phase board + roadmap + CLAUDE.md | done |
| C2 | Content audit status updates | done |

---

## Workstream D — CardGroup & Filter Polish

| Task | Description | Status |
|------|-------------|--------|
| D1 | Align CardGroup layout with CardMeet (stacked icon-text rows) | done |
| D2 | Change Hosted icon from Wrench to Storefront | done |
| D3 | Visibility filter: single-select, default Open | done |
| D4 | Group size slider: "No limit" at max value | done |
| D5 | Add dog size filter (Small/Medium/Large segments) | done |
| D6 | Add focus area filter (6 checkboxes in accordion) | done |
| D7 | Remove orphaned card-schedule-meta CSS | done |

---

## Verification

- Preview at desktop: tabs visible, header persistent, tab content scrollable
- Preview at mobile: same layout, tabs always visible
- Tab switching works (Feed → Meets → Members → Chat)
- Chat tab: join gate for non-members, messages for members
- TypeScript compiles clean
- URL updates on tab change

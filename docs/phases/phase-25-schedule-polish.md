---
status: complete
last-reviewed: 2026-04-07
review-trigger: When any task is completed or blocked
---

# Phase 25 — Schedule Polish & Detail Panel Pattern

**Goal:** Fix Schedule page list/detail panels and establish a reusable detail section card pattern for other pages.

**Depends on:** Phase 23 (Schedule detail rebuild), Phase 22 (panel architecture).

---

## Workstream A — List Panel Cleanup

| Task | Description | Status |
|------|-------------|--------|
| A1 | Replace pill filters with TabBar in schedule list panel | done |
| A2 | Move Create button out of header (stays in mobile actions) | done |
| A3 | Remove search bar from list panel | done |
| A4 | Replace pill filters with TabBar in inbox list panel | done |

## Workstream B — Detail Panel Restructure

| Task | Description | Status |
|------|-------------|--------|
| B1 | Wrap detail sections in 3 elevated cards (bg-surface-top rounded-panel shadow-xs) | done |
| B2 | Remove "View full details" button | done |
| B3 | Fix role badge styling (Tailwind utilities instead of card-schedule-chip overrides) | done |

## Workstream C — Docs

| Task | Description | Status |
|------|-------------|--------|
| C1 | Phase board + roadmap + CLAUDE.md | done |

---

## Detail Section Card Pattern (reusable)

For any detail panel in a MasterDetailShell layout:

```
Outer container: flex flex-col gap-md, padding: var(--space-md)
Each section:    bg-surface-top rounded-panel p-md shadow-xs flex flex-col gap-md
Section headers: text-xs font-semibold text-fg-tertiary uppercase tracking-wide
```

PanelBody provides the surface-popout scroll container. Spacer fills remaining space.

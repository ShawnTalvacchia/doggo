---
category: phase
status: archived
last-reviewed: 2026-03-16
tags: [phase-1, design-system, styleguide, css]
review-trigger: "archived — Phase 1 complete"

kanban-plugin: basic
---

# Phase 1 — Design System & Foundation Clean-up

## Backlog


## In Progress


## Done

- [x] Audit and document form layout classes (.form-*) #classes
	- 13 classes — all used, clean
- [x] Audit and document button class variants (.btn-*) #classes
	- 29 classes audited. Removed dead: `.btn-disabled-variant`, `.btn-has-left-icon`, `.btn-has-right-icon`. Updated `ButtonAction.tsx` types + styleguide page.
- [x] Audit app navigation classes (.app-nav-*) #classes
	- 24 classes — all used, clean
- [x] Audit explore/search CSS classes #classes
	- 67 classes (`.explore-*`, `.filter-*`, `.result-*`, `.map-*`) — all used, clean
- [x] Audit inbox/messaging CSS classes #classes
	- ~94 classes — all used, clean
- [x] Audit booking flow CSS classes #classes
	- ~116 classes — all used, clean
- [x] Audit profile page CSS classes #classes
	- 103 classes — all used, clean
- [x] Audit notification classes (.notif-*) #classes
	- 32 classes — all used, clean
- [x] Audit landing page CSS classes #classes
	- 81 classes — all used, clean
- [x] Audit signup flow CSS classes #classes
	- 57 classes — all used, clean
- [x] Audit utility/shared classes (badge, pill, chip, avatar, etc.) #classes
	- 19 classes audited. Removed 7 unused `.avatar-base`/`.avatar--*` classes (8 lines). Remaining all used.

- [x] Add missing token sections to styleguide (border-widths, layout tokens) #tokens
	- Added Border Widths, Layout, Convenience Aliases, Interaction Usage Guide sections
- [x] Add `--font-size-fine` and `--font-size-sub` to typography styleguide #tokens
	- Inserted into body scale between REG/SM and SM/XS
- [x] Document convenience aliases in tokens page #tokens
	- 7 aliases: `--surface-page`, `--surface-hover`, `--border-subtle`, `--border-default`, `--text-muted`, `--success`, `--error`
- [x] Add interaction token usage guidance #tokens
	- Live demos showing lighten (dark bg), darken (light bg), subtle (ghost) with usage explanation
- [x] Add shadow token usage guidance #tokens
	- Labels updated with context: XS for chips, SM for cards, MD for dropdowns, etc.
- [x] Update [[design-tokens]] with convenience aliases, layout tokens, font-size-fine/sub
- [x] Archive Board.md and prototype-decisions.md → extracted useful content to [[chat-design]] and [[signup-reference]]
- [x] Set up doc system: folder structure, frontmatter, ROADMAP, CONTRIBUTING, Obsidian vault
- [x] Remove dead/unused CSS — 61 unreferenced classes, 509 lines removed #cleanup
	- booking-bar/cta, contact-modal, explore-map, filter-dow/time, form-progress, landing-how/why, profile-edit/setup, misc utilities
- [x] Token-ize raw values — 277 font-size + font-weight replacements #cleanup
	- All hardcoded px font-sizes now use `var(--font-size-*)` tokens
	- All hardcoded font-weights now use `var(--weight-*)` tokens
- [x] Token-ize border-radius — 118 replacements #cleanup
	- All hardcoded border-radius now use `var(--radius-*)` tokens
- [x] Fix raw hex colors — 14 replacements #cleanup
	- Replaced raw hex with status/neutral tokens, removed incorrect purple fallbacks
- [x] Consolidate duplicate patterns #cleanup
	- Trust items: merged `.result-trust` + `.profile-trust` → shared `.trust-row`/`.trust-item` (TSX updated)
	- Chips: merged `.inbox-inquiry-chip` → `.chip` + `.chip--ongoing` modifier (TSX updated)
	- Added shared utility bases: `.avatar-base` sizes, `.divider` variants (for future use)
	- globals.css: 10,834 → 10,304 lines (530 lines net reduction)
- [x] Update [[MVP Scope Boundaries]] for community pivot #docs
	- Rewrote from provider-first to community-first scope. New in-scope: meets, visibility model, connections, home feed, nav restructure. Care marketplace moved to out-of-scope (Phase 4).
- [x] Sync open questions from Community Exploration into assumptions log #docs
	- Restructured around 9 categories. Marked resolved decisions (visibility model, match triggers, care surfacing). Added community adoption, UX, and technical questions from strategy doc.
- [x] Tailwind CSS v4 setup (Phase 0) #setup
	- `@tailwindcss/postcss` + `@theme` block mapping all tokens. Verified working.
- [x] Add `--weight-medium` to typography styleguide #tokens
- [x] Add deprecation notes for legacy aliases (--on-hover-*, --space-1–16) #tokens
- [x] Exit criteria verified: token coverage, component inventory parity, CONTRIBUTING enforced


## Notes

**Phase goal:** Every token documented, every reusable class inventoried, dead CSS removed, styleguide = source of truth.

**Exit criteria:**
1. Zero CSS variables in `globals.css` that aren't shown in the styleguide
2. Component inventory matches actual codebase (no phantom entries, no missing entries)
3. [[CONTRIBUTING]] rules are enforced — no new token without styleguide entry
4. Stale docs updated or archived

**Start date:** 2026-03-16

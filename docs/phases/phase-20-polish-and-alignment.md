---
category: phase
status: active
last-reviewed: 2026-04-05
tags: [phase-20, polish, alignment, mobile, discover, cleanup]
review-trigger: "when completing workstreams or closing this phase"
---

# Phase 20 — Polish & Alignment

**Goal:** Capture recent mobile UX fixes, Discover filter rebuild, and component cleanup. Realign docs that drifted during rapid Phase 19 iteration. Audit for dead code and consolidate component inventory.

**Depends on:** Phase 19 (UI rebuild complete)

---

## What prompted this phase

Post-Phase-19 iteration introduced several improvements that were never captured in a phase board:
- Mobile scroll-hide nav with content-depth threshold
- Mobile panel layout fixes (border-radius, flex-direction, bottom padding)
- Bottom nav border removal
- Feed image height caps
- Discover Care filter panel rebuild with interactive components
- DiscoverShell shared layout pattern

Additionally, doc audit revealed 5 undocumented components, stale feature docs, and potentially orphaned legacy components.

---

## Workstreams

### A — Doc Realignment ✓

Update all docs that drifted during post-Phase-19 work.

| Task | Status |
|------|--------|
| Add DiscoverShell, FeedUpdate, FeedCTA, UpcomingPanel, useScrollHideNav to component inventory | ✓ |
| Update `explore-and-care.md` — DiscoverShell, interactive filters, 3-door hub | ✓ |
| Update `care-discovery.md` flow — new Discover hub → CarePickerPanel → CareFilterPanel UX | ✓ |
| Review `design-tokens.md` for staleness | ✓ (content current, added Tailwind mapping section, bumped date) |
| Review `connections.md` for staleness | ✓ (content current, bumped date) |
| Update ROADMAP.md with Phase 20 | ✓ |
| Update CLAUDE.md current phase reference | ✓ |

### B — Component Audit & Cleanup

Identify unused/legacy components, consolidate duplicates, remove dead code.

| Task | Status |
|------|--------|
| Audit `components/activity/DiscoverTab.tsx` — check if still imported | ✓ Dead code — removed |
| Audit `components/activity/ServicesTab.tsx` — check if still imported | ✓ Active — used in `app/bookings/page.tsx` |
| Audit `components/discover/CareTab.tsx` — possibly superseded by `/discover/care/page.tsx` | ✓ Dead code — removed |
| Remove or archive confirmed dead components | ✓ Deleted DiscoverTab.tsx and CareTab.tsx |
| Verify all feed card types in `components/feed/` are used | ✓ Removed 7 orphaned: FeedUpdate, FeedPersonalPost, FeedCommunityPost, ShareMomentBar, HomeFAB, CompactGreeting, UpcomingStrip |
| Broader orphan scan (meets, home, posts folders) | ✓ All used except `UpcomingPanel` (built but not yet wired into home page) |

### C — Recent Fixes (already built, documenting for record)

These were implemented in the previous session but not captured in any phase board.

| Fix | Details |
|-----|---------|
| Mobile panel layout | `flex-direction: column` on mobile `logged-shell-main` to constrain panel heights |
| Mobile panel border-radius | Bottom radius now visible; radius removed when `nav-hidden` for edge-to-edge fill |
| Scroll-hide nav | `useScrollHideNav` hook with 400ms cooldown, content-depth threshold (`clientHeight * 0.5 + 120px`) |
| Bottom nav border | Removed `border-top` from `.bottom-nav` |
| Feed image caps | `PostPhotoGrid` maxHeight: 1 photo = 420px, 2 = 320px, 3-4 = 260px |
| Discover Care filters | Rebuilt with interactive MultiSelectSegmentBar, dual Slider, CheckboxRow, accordion pattern |
| Scroll container padding | `padding-bottom: var(--radius-panel)` on mobile scroll containers to prevent last-card clipping |

### D — Remaining Polish (if time)

| Task | Status |
|------|--------|
| Refresh `design-tokens.md` (last reviewed 2026-03-16) | on deck |
| Refresh `landing-page.md` (last reviewed 2026-03-21) | on deck |
| Review `signup-reference.md` for staleness | on deck |

---

## Implementation order

1. **20a** — Doc realignment (Workstream A) — fast, low risk
2. **20b** — Component audit (Workstream B) — research then cleanup
3. **20c** — Remaining polish (Workstream D) — as time allows

---

## Verification checklist

- [ ] All components in `components/` have entries in component-inventory.md
- [ ] No component files exist that are imported by zero pages/components
- [ ] All feature docs have `last-reviewed` within 7 days
- [ ] All flow docs reflect current UX patterns
- [ ] ROADMAP.md and CLAUDE.md reference Phase 20

---
status: active
last-reviewed: 2026-04-13
review-trigger: "any time — add items as they're noticed, fix them when convenient"
---

# Polish Log

Running list of UI tweaks, small bugs, and visual fixes. Not a phase — this lives permanently alongside whatever phase is active. Items get added as they're noticed and fixed when there's time or when they block other work.

**Rules:**
- Anyone can add items at any time
- Fix items in any session — no phase dependency
- Mark done when fixed, remove periodically
- If something grows into real feature work, move it to the active phase board

---

## Open Items

| # | Description | Category | Page/Area | Added |
|---|-------------|----------|-----------|-------|
| P1 | "Any" filter pill logic — selecting Any + a specific filter shouldn't be possible, toggle behavior still wrong | Interaction | Discover filters | 2026-04-10 |
| P2 | Group size slider has no "no max" option — some groups are unlimited | Interaction | Discover filters / group creation | 2026-04-10 |
| P3 | Schedule care cards need header info — drop-off time or relevant scheduling detail | Content | My Schedule | 2026-04-10 |
| P4 | Provider ID mismatch — mockData.ts uses `olga-m`, `nikola-r`; mockUsers.ts uses `olga`, `nikola` | Data | Mock data files | 2026-04-10 |
| P5 | ButtonAction variant system — `destructive` should be a modifier (like `cta`) not a standalone variant, to combine with primary/secondary/tertiary. Current destructive too strong for inline "Decline" | Design system | ButtonAction | 2026-04-13 |
| P6 | Booking proposal card buttons — primary/outline don't feel right for Review & sign / Decline. Revisit after variant system cleanup | Design | Chat thread | 2026-04-13 |
| P7 | Post composer modal — layout is broken, needs rebuild | Bug | Post creation | 2026-04-13 |
| P8 | Profile Posts tab — losing corner radius; post headers need group/meet/care attribution; missing link in header that exists on main feed | Visual | Profile | 2026-04-13 |
---

## Done

| # | Description | Fixed |
|---|-------------|-------|
| — | *(nothing yet)* | — |

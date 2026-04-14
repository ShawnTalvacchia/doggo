---
status: active
last-reviewed: 2026-04-14
review-trigger: "any time — add items as they're noticed, fix them when convenient"
---

# Punch List

Running list of UI tweaks, small bugs, and visual fixes that live permanently alongside whatever phase is active. Items get added as they're noticed and fixed when there's time.

---

## Workflow

This section tells the agent how to run a punch list session. Read and follow these instructions when working from this file.

### Adding Items

- Add new items to the **Open Items** table with the next available number, a description, category, affected page/area, any file or doc references that will help when fixing it, and today's date.
- Keep descriptions specific enough that someone can fix them without asking follow-up questions.

### Working on Items

1. **Read this file first.** Pick items to work on (user may specify, or choose by priority/proximity).
2. **Read only the referenced docs/files** for the items being worked on. Do not review the full doc tree.
3. Fix the items. If a fix touches a feature doc, design-system.md, or design-tokens.md, update those docs too.
4. Move completed items from **Open Items** to **Done** with today's date.
5. Write a **Change Report** entry below with: date, items fixed, files changed, and any doc updates made.

### Promoting Items

If an item turns out to be too large for a quick fix (needs design thinking, touches multiple pages, or would take more than ~30 minutes):

1. Move it from **Open Items** to **Parked**.
2. Add a one-line note explaining why it was promoted.
3. Add it to the **Backlog** section in `ROADMAP.md` so it gets picked up in future phase planning.
4. Don't let it sit silently — the point is that nothing gets lost.

### Review

Punch list changes are reviewed as part of the phase open/close lifecycle (see CONTRIBUTING.md). Between phase boundaries, change reports below serve as the audit trail.

---

## Open Items

| # | Description | Category | Page/Area | Refs | Added |
|---|-------------|----------|-----------|------|-------|
| P1 | "Any" filter pill logic — selecting Any + a specific filter shouldn't be possible, toggle behavior still wrong | Interaction | Discover filters | | 2026-04-10 |
| P2 | Group size slider has no "no max" option — some groups are unlimited | Interaction | Discover filters / group creation | | 2026-04-10 |
| P3 | Schedule care cards need header info — drop-off time or relevant scheduling detail | Content | My Schedule | | 2026-04-10 |
| P4 | Provider ID mismatch — mockData.ts uses `olga-m`, `nikola-r`; mockUsers.ts uses `olga`, `nikola` | Data | Mock data files | `lib/mockData.ts`, `lib/mockUsers.ts` | 2026-04-10 |
| P5 | ButtonAction variant system — `destructive` should be a modifier (like `cta`) not a standalone variant, to combine with primary/secondary/tertiary. Current destructive too strong for inline "Decline" | Design system | ButtonAction | `components/ui/ButtonAction.tsx`, `design-system.md` | 2026-04-13 |
| P6 | Booking proposal card buttons — primary/outline don't feel right for Review & sign / Decline. Revisit after variant system cleanup | Design | Chat thread | | 2026-04-13 |
| P8 | Profile Posts tab — losing corner radius on post images (attribution + header link DONE in Profiles Deep Pass B2/B3) | Visual | Profile | `components/posts/FeedCommunityPost.tsx` | 2026-04-13 |

---

## Parked

Items promoted out of the punch list because they're too large for a quick fix. Each should have a corresponding entry in `ROADMAP.md > Backlog`.

| # | Description | Why parked | Parked |
|---|-------------|-----------|--------|
| — | *(nothing yet)* | — | — |

---

## Done

| # | Description | Fixed |
|---|-------------|-------|
| P7 | Post composer modal rebuilt as ModalSheet (desktop modal / mobile sheet) with photo hero, accordion tag rows, suggestion pills | 2026-04-14 |

---

## Change Reports

<!--
Format:
### YYYY-MM-DD
**Items:** P#, P#
**Files changed:** list
**Docs updated:** list (or "none")
**Notes:** anything notable
-->

### 2026-04-14
**Items:** P7
**Files changed:** `components/posts/PostComposer.tsx`, `contexts/PostComposerContext.tsx`, `app/layout.tsx`, `app/globals.css`, plus all entry points (`AppNav`, `HomeFAB`, `ShareMomentBar`, `FeedCTA`, `CompactGreeting`, `PostsTab`, `GroupDetailPanel`, `app/communities/page.tsx`)
**Docs updated:** none
**Notes:** Composer rebuilt as ModalSheet via PostComposerProvider. Photo-first empty state, accordion tag rows (place/dog/person/community/meet) with inline pickers, single-select for place + meet, dog suggestions limited to owner's pets (max 3, persist after partial selection), no auto-suggestions for person/community/meet.

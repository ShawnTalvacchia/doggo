---
status: active
last-reviewed: 2026-06-20
review-trigger: When any task is completed or blocked
---

# Design-System Audit + Cleanup

**Goal:** Sweep the whole component + CSS surface for accumulated debt (now that shelter / Dog Profile / Carer Portfolio / Mentor Network / booking-options surfaces have landed), then consolidate — dead code gone, drifted variants converged, inlined values promoted to tokens, recurring shapes extracted to primitives, so the design system reads as one coherent thing.

**Depends on:** Service Options & Booking Clarity (closed) — clean once, after the surfaces settled.

**Refs:** [[design-system]], [[design-tokens]], [[Future Considerations]] (FC4/FC5/FC11/FC15), [[punch-list]] (P51/P67/P76/P78)

---

## Open notes (phase-specific only)

> Canonical open process: `docs/CONTRIBUTING.md` → "Opening a Phase". Worked through below; only phase-specific results recorded here.

**This phase leads with a broad audit.** A 6-lane parallel sweep (CSS structure · tokens/colour · inline styles · component duplication · named targets · variant drift) ran across `app/globals.css` (~18,978 lines), 171 components, and 58 route pages. The findings below scoped the eight workstreams. Full findings live in this session's audit; the load-bearing conflicts + calls are captured here.

**Conflicts / corrections surfaced during the audit:**
- **Service-card drift is a LIVE correctness bug, not just duplication.** The own-profile renderer (`ProfileServicesTab.tsx`) shows a flat `pricePerUnit` with no "From" prefix, no pickup/drop-off delivery breakdown, and no full-day/half-day day-care breakdown — all of which the other-user renderer (`app/profile/[userId]/page.tsx`) renders correctly. A carer sees a different (wrong) price on their own profile than everyone else sees. The priced-axis work from the last two phases landed in one renderer only. → WS-A.
- **FC4 doc is stale.** Future Considerations FC4 says the offending gap is `gap-md` (12px); the actual rule (`globals.css:5674`) is `gap: var(--space-sm)` (8px) + an `:nth-child(n+3)` margin-top rhythm. A `Section` component must reproduce the **two-tier rhythm**, not a flat gap. The rhythm rule is also shared with `.dog-profile-section`, arguing for a `components/layout/` home, not `components/profile/`. → WS-D (and fix FC4 text at close).
- **FC5 IdentityChip — extraction trigger NOT met.** Only 2 of the 3 hero-chip consumers exist; the other `getCarerIdentity` callers feed the dense PersonRow `.person-row-pill--carer`, a deliberately different role. **Excluded from scope** to avoid over-extraction. → recorded as a decision (WS-D), FC5 stays in Future Considerations.
- **`--text-xs` is split-brain** — `@theme` defines 10px, `:root` redefines 12px; the Tailwind utility and the CSS var silently disagree. Must be reconciled before the font-size migration (WS-H) or that migration changes rendered sizes. → WS-C precedes WS-H.

**Scope calls ratified with PO (2026-06-20):**
- **Everything on the board, incl. the 294-site `font-size: var(--font-size-*)` → `var(--text-*)` migration** (WS-H), risk-gated behind the WS-C `--text-xs` fix.
- **ScheduleCard status pills → converge to inline icon+text** (CardMeet treatment), enforcing Principle 7 app-wide rather than documenting a carve-out. → WS-F.
- **Verification batched at the end** — build + commit per workstream, then one consolidated dev-server walk with screenshots. Walkthrough doc maintained from the start regardless.

**Punch-list items adopted into this board** (removed from `punch-list.md`): **P51** (design-system audit + convergence), **P67** (component-consolidation audit), **P76** (dropdown specificity footgun → WS-C), **P78** (CheckboxRow density variant → WS-D). P79/P80/P81 stay on the punch list — they're concrete one-off fixes (layout / React-correctness / copy), not design-system consolidation.

**Open Questions:** none in the log gate this phase (internal cleanup, not strategy-gated). **Stale-doc check:** `design-tokens.md` last-reviewed 2026-06-08 (12 days, within window); all other referenced docs recent. No forced bumps at open; all get touched at close anyway.

---

## Workstream A — Service-card reconciliation (correctness)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Extract per-kind presentational views (`Care/Meet/Appointment/MentorServiceCardView` in `components/profile/ServiceCardViews.tsx`) taking a service config + optional `action` slot. Both renderers consume them; viewer-facing passes the Book CTA, own-profile passes none. | [[design-system]], [[profiles]] | done |
| A2 | Fix the own-profile Care card to show the full priced axis ("From" prefix, cheapest-option floor, pickup/drop-off rows, full-day/half-day rows) — falls out of A1's shared view. Also converged kind-order (appointment → mentor → care → meet) + chip chrome so the preview mirrors the viewer surface. | [[explore-and-care]] | done |
| A3 | Moved `MEET_FORMAT_LABEL` / `MEET_CADENCE_LABEL` / `APPOINTMENT_CATEGORY_LABEL` to `lib/constants/services.ts`; both files import. | — | done |
| A4 | **Declined (decide-and-flag).** The 5 "raw inputs" are a specialized compact numeric control (`.profile-modifier-*` with inline `%`/`Kč`/`days` unit suffixes), not standard labeled-field territory — `InputField` would regress the layout. Left as-is. | — | done |

---

## Workstream B — Volunteer tokenization + colour-affordance rule

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Added the violet base ramp (`--violet-50/100/300/700/800`) + `--status-volunteer-*` semantic family (soft/light/border/main/strong) in `:root`, mirroring `--status-info-*`. | [[design-tokens]] | done |
| B2 | Migrated every violet hex/rgba to the tokens (sed pass: solid hex → semantic tokens; the 3 alpha rgba → `color-mix(... var(--status-volunteer-*) N%, transparent)`) + the inline `#6d28d9` in `help-a-dog/page.tsx`. The `--mentor-progress-violet*` scoped vars now alias the family. **Zero raw violet hex remains** outside the primitive ramp defs — except `.alert--info` (flagged, see B-note). Also dropped a misleading `var(--brand-50, #ede9fe)` dead fallback. | [[design-system]] (Principle 14/15) | done |
| B3 | Surfaced `--status-volunteer-*` + the missing `--status-info-600` in the styleguide tokens page, and the `--violet-*` primitive ramp on the colors page (no-orphan-tokens). | [[design-tokens]] | done |
| B4 | Formalized Principle 15 in design-system.md and applied it: the rounded violet `variant="volunteer"` "Book session" submit (`MentorSessionBookingSheet`) → `variant="primary"` rectangular (Principle 8 footer commit; violet stays on nav affordances per Principle 14); dropped the `cta` pill on `FilterPanelMobile`'s "View Results". | [[design-system]] | done |
| B5 | **Flag (not built).** `.alert--info` is styled with raw violet hex — semantically odd for an *info* alert (should it be `--status-info` blue?). Left untokenized + raw, surfaced as a walkthrough open call rather than mis-tokenized as volunteer. | [[design-system]] | flagged |

---

## Workstream C — Dead-code + CSS hygiene

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Deleted the dead MASTER-DETAIL SHELL family — `.md-shell` / `.list-panel` / `.detail-panel` + every rule referencing them (main block + mobile override + 4 scattered media-query/page-shell overrides). 0 consumers confirmed. **~216 lines removed** (more refs than the audit's named 3 blocks). | [[design-system]] | done |
| C2 | Deleted `.discover-type-pill`/`-pills` (0 consumers) and `components/schedule/SessionRow.tsx` (0 imports — note the live `SessionRow` in `bookings/[id]` is a separate local fn). | — | done |
| C3 | **Deferred.** `.dropdown-menu` specificity footgun (P76) — hoisting the base block above its variants is a blind cascade change across sort/kebab/filter menus that genuinely needs the visual walk to verify safely (batch-verify-at-end). Do as a focused careful pass. | [[punch-list]] P76 | deferred |
| C4 | **Deferred — needs PO decision (bigger than the audit found).** The `:root` "legacy aliases" block re-maps THREE tokens up one step vs `@theme`, not just `--text-xs`: `--text-xs` (10↔12), `--text-sm` (12↔14), `--text-base` (14↔16). Utilities use `@theme`, CSS vars use `:root`. Reconciling is an app-wide typography shift (~280 utility + ~hundreds of CSS consumers) with no clear-right answer. **Blocks WS-H.** See walkthrough O5. | [[design-tokens]] | deferred |
| C5 | **Corrected scope.** Audit's "dead aliases" were mostly WRONG — `--status-error-surface/-border/-text` ARE used (globals.css error-state rule), and `--status-info-600`/`-strong` are both live semantic tokens (sharing a value is fine). Only real issue: `--radius-full` was defined TWICE (identical) — removed the redundant `:root` copy. | [[design-tokens]] | done |
| C6 | **Deferred.** Styleguide hardcoded hex has drifted from `globals.css` — but it's a 3-way reconciliation (styleguide ↔ design-tokens.md ↔ globals' actual current values), display-only, and doing it right means a runtime-derive refactor so it can't re-drift. Focused pass. | [[design-tokens]] | deferred |
| C7 | Doc-scrubbed design-system.md: removed the stale `ListPanel`/`DetailPanel` Layout rows (files already gone), the `.md-shell`/`.list-panel`/`.detail-panel` tombstone, and the resolved Consolidation-Queue rows (MasterDetailShell/DiscoverShell, discover-type-pill, ListPanel/DetailPanel). | [[design-system]] | done |
| C8 | **DONE (the bulk) — ~947 lines of dead CSS removed across 3 commits, each brace-balanced + grep-verified + live-anchors-confirmed (visual walk still pending per batch-verify).** Deleted the dead `.discover-page-shell` family (~232 lines), the old master-detail inbox family (~450 lines), and the `.community-*`/`.schedule-*`/`bookings`/`notifications`/`inbox`-page-shell+panel family (~265 lines) — all superseded by `PageColumn`. Surgically preserved every interleaved LIVE rule (`.discover-hub-body`/`.filter-pill*`/`.discover-floating-btn`; `inbox-nav-search*`/`inbox-thread-*`/`inbox-message*`/`inbox-proposal-*`/`inbox-direct-empty`; `community-group-list`/`sched-*`/`group-detail-*`/`home-header`/`page-column`). The dynamic template-literal modifiers (`inbox-message--${sender}` etc.) were identified and left intact. **Original detail map (kept for reference):** Two dead-code surfaces, each ~hundreds of lines, **superseded by `PageColumn`** but interleaved with live rules: **(1) `.discover-page-shell` family** (globals.css ~3303–3640) — DEAD: `.discover-page-shell`, `-hub-panel`, `-results-panel`, `-results-list`, `-map-panel`, `-mobile-tabbed`, `-mobile-tabs`, `-mobile-tab-content` + every `.discover-page-shell`-scoped/`:has()` rule (incl. the responsive `[data-mobile-view]` blocks); **PRESERVE** the interleaved live `.discover-hub-body` (5 consumers, incl. its rule inside the mobile `@media` at ~3550), `.filter-pill*`, `.filter-pill-row`, `.dogs-near-you-strip`, `.discover-floating-btn`. **(2) old master-detail inbox** (~9450+) — DEAD: `.inbox-page`/`-header`/`-heading`/`-list`/`-row*`/`-detail`/`-messages`/`-msg*`/`-composer*`/`-contact*`/`-mobile-back`/`-avatar*`/`-unread-dot`/`-service-chip`/`-direct-chip`/`-section-label`/`-empty*`/`-thread-outer`/`-thread-embedded`; **PRESERVE** live `.inbox-nav-search*`, `.inbox-thread-shell`(+`--embedded`)/`-header`/`-back`/`-avatar`/`-name`/`-body`/`-footer`/`-name-row`/`-connection-badge`/`-profile-link`, `.inbox-message*`, `.inbox-message-wrap*`, `.inbox-message-time`, `.inbox-proposal-*`, `.inbox-date-*`, `.inbox-carer-badge*`, `.inbox-compose-*`, `.inbox-direct-empty`, `.inbox-inquiry-form*`. ⚠️ The `inbox-message--${sender}` / `inbox-proposal-card--${status}` / `inbox-proposal-status--${status}` **modifiers are built via template literals** (ThreadClient, BookingProposalCard) — they look 0-consumer to grep but are LIVE; do NOT delete. Also `.bookings-page-shell`/`.notifications-page-shell` non-md-shell rules (~13625, ~18304) are dead static classes. | [[design-system]] | todo |

---

## Workstream D — Named primitive extractions

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | **FC4 `Section` shell — deferred.** Componentizing the header+description+body wrapper is a named target, but the agent flagged that the two-tier rhythm (`.profile-tab-stack > section` `gap-sm` + `:nth-child(n+3)` margin) can regress if the extraction is naive, and the 3 `ProfileAboutTab` call sites vary (editing-mode subheaders, empty-state). Best done with eyes on the spacing — deferred to a focused pass. | [[Future Considerations]] FC4 | deferred |
| D2 | **FC15 `SortMenu`** extracted → `components/ui/SortMenu.tsx` from the two byte-identical copies; renamed `.shelter-sort-*` → `.sort-menu-*` CSS; both `shelters/[id]` + `discover/help-a-dog` consume it. (Left the small per-page `SORT_OPTIONS`/`DogsSortKey` in place — coupled to each page's comparator; marginal to dedupe.) | [[Future Considerations]] FC15 | done |
| D3 | **P78 `CheckboxRow` `density="compact"`** — added the variant (24×24 indicator + 8px margin + 14px check), migrated `PetEditCard`'s spay/neuter row, retired the `.pet-edit-checkbox-row` indicator override. Kept the default check at 12px (a global check-size bump is a separate app-wide visual call — not done blind). | [[punch-list]] P78 | done |
| D4 | Renamed `.input-with-icon` → `.input-with-trailing-icon` (3 tsx + CSS) — fixes the misleading name and makes the affix family consistent (`with-trailing-icon` / `with-leading-icon` / `with-trailing`). The fuller "unify under one base + position modifiers" refactor is lower-value/higher-churn — left noted. | [[design-system]] | done |
| D5 | **FC5 IdentityChip — decision recorded, not built.** Trigger not met (2 of 3 consumers). Left inlined to avoid over-extraction. | [[Future Considerations]] FC5 | done |

---

## Workstream E — Shared shells + recurring shapes

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | **Resolved as dead-code, not a merge.** The premise was wrong: both `.community-*` and `.schedule-*` page-shell/panel families are **0-consumer** — the community feed + schedule pages use `PageColumn` + `page-column-*` now. So there was nothing to merge; deleted the whole family in WS-C8 instead (see C8). | [[design-system]] (Consolidation Queue) | done |
| E2 | Promote a `Card`/`.card-shell` primitive (rounded-panel + surface bg + subtle border + padding + flex-col gap) for the ~37 inline reimplementations; migrate the highest-traffic clusters (checkout, profile link cards, settings option cards). Reconcile the border drift (1px vs 1.5px). | [[punch-list]] P67 | todo |
| E3 | Route the 5 inline section-header reimplementations through the existing `SectionHeader`; dedupe the two near-identical in-file mutual-connection rows in `page.tsx`. | [[punch-list]] P67 | todo |

---

## Workstream F — Variant-drift convergence

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Converged the five optional-field-label treatments [`(Optional)`, `(optional)`, `Optional`, `— optional`, `· optional`] onto one canonical **`(Optional)`** across all sites (kills the em-dash + mid-dot variants). The right-aligned bare-`Optional` spans now read `(Optional)` too; their right-aligned *layout* (vs inline) was left as a finer secondary call. | [[punch-list]] P51 | done |
| F2 | **Deferred (PO-approved direction).** Converge ScheduleCard status (Hosting/Cancelled/Providing/Care) from corner chip-pills to CardMeet's inline icon+colored-text (Principle 7). It's a corner-pill→inline **layout** change with per-status icon choices on a visible surface — best done with eyes-on the schedule, not blind under batch-verify. | [[design-system]] (Principle 7) | deferred |
| F3 | **Deferred.** Extract a single-select primitive for the One-time/Repeat-weekly picker hand-rolled in 3 places (discover/care, FilterBody, InquiryForm) — a new primitive + 3 migrations, better bundled with the other selection-control work (F4). | [[design-system]] | deferred |
| F4 | **Deferred.** Migrate the ~7 inline `.pill-group` rows to `PillToggle` — each call site differs (selected-state shape, single vs multi), needs per-site care + verify. | [[design-system]] | deferred |
| F5 | **Deferred — carries a design decision.** Connection-chip convergence (Discover inline vs PersonRow class) requires deciding whether Connected earns a chip on cards but not rows; surface that to the PO rather than pick blind. | [[punch-list]] P51, [[Trust & Connection Model]] | deferred |
| F6 | Principle-13 CTA wrap migration: fixed the 5 broken `flex-1` paired-CTA rows (`bookings/[bookingId]` action block + the 4 Cancel/Delete modals) to `flex flex-wrap gap-sm` + `grow basis-[140px]`; fixed the stale `flex-1` comment in `ProfileAboutTab`. Content-column `flex-1 min-w-0` left untouched. | [[design-system]] (Principle 13) | done |

---

## Workstream G — Inline-style mechanical sweep

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| G1 | Mechanical Tailwind conversions for the repeated static inline clusters: `textDecoration:"none"` (45×), `objectFit:"cover"` (12×), `flexWrap:"wrap"` (9×), `marginTop:2` (9×), the signup `flex flex-col gap-*` cluster. | [[CONTRIBUTING]] (inline-style policy) | todo |
| G2 | Extract the complex repeated inline patterns into classes: `.btn-reset` (button-reset, 4+ sites), `.lightbox-btn` (44px overlay button, 3×), `.autocomplete-dropdown`. | [[design-system]] | todo |
| G3 | Tokenize the overlay rgba literals onto `--transparent-dark-*` / `--transparent-light-*` (MeetPhotoGallery + `.meet-photo-*` CSS, posts/create, FeedCarePrompt). | [[design-tokens]] | todo |

---

## Workstream H — Font-size semantic-layer migration

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| H1 | **(After C4.)** Migrate the 294 raw `font-size: var(--font-size-*)` declarations in `globals.css` onto the `--text-*` semantic aliases. Scripted sweep + spot-check rendered sizes against the reconciled `--text-xs`. | [[design-tokens]] | todo |

---

## Acceptance Criteria

- [ ] Own-profile and other-user service cards render identical pricing (the priced-axis breakdown shows on both); the wrong-price bug is gone.
- [ ] A `--status-volunteer-*` token family exists, is surfaced in the styleguide, and there are **zero** raw violet hex literals in `components/` or product CSS.
- [ ] The dead MASTER-DETAIL SHELL family, `.discover-type-pill`, and `SessionRow.tsx` are deleted; `grep` confirms no consumers.
- [ ] `--text-xs` resolves to one value across `@theme` and `:root`; the font-size migration leaves no `font-size: var(--font-size-*)` in `globals.css`.
- [ ] FC4 `Section` and FC15 `SortMenu` are extracted and consuming sites migrated; FC5 is recorded as deliberately deferred.
- [ ] `CheckboxRow` has a `density="compact"` variant and the `.pet-edit-checkbox-row` override is retired.
- [ ] Optional-field labels read identically app-wide; ScheduleCard status renders as inline icon+text, not chips.
- [ ] design-system.md and design-tokens.md reflect the new reality (no references to deleted components/classes; new primitives + token family documented); styleguide has no orphan tokens and no drifted hex.
- [ ] Consolidated dev-server walk passes with screenshots; no visual regressions on the touched surfaces.

---

## Close notes (phase-specific only)

> Canonical close process: `docs/CONTRIBUTING.md` → "Closing a Phase". Only phase-specific items here.

- **Feature/impl docs to update:** `design-system.md` (new primitives `Section`/`SortMenu`/`Card`, `CheckboxRow` density, input-affix rename, ScheduleCard status convergence, Principle 15 button-shape rule; remove dead-component rows + close Consolidation Queue entries), `design-tokens.md` (`--volunteer-*` family, `--text-xs` resolution, dead aliases removed), `profiles.md` + `explore-and-care.md` (shared `ServiceCard`), `badges.md` (connection-pill convergence if it lands there).
- **Future Considerations to graduate/correct at close:** FC4 → built (and fix the stale `gap-md` text), FC15 → built, FC11 → violet-token thread resolved (note it shipped here). FC5 stays (trigger not met — leave the entry, note the deferral decision).
- **Punch-list items this phase closes:** P51, P67, P76, P78 (already removed from `punch-list.md` at open; confirm closed).
- **Verification:** batch dev-server walk (PO call) — confirm the walkthrough's V items all passed before archiving.

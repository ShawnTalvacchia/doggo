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
| A1 | Extract a shared presentational `ServiceCard` (or per-kind Care/Meet/Appointment views) taking a service config + optional `action` slot. Both renderers consume it; viewer-facing passes the Book CTA, own-profile passes none. | [[design-system]], [[profiles]] | todo |
| A2 | Fix the own-profile Care card to show the full priced axis: "From" prefix, cheapest-option floor price, pickup/drop-off delivery rows, full-day/half-day duration rows. (Falls out of A1 if the shared view is the correct one.) | [[explore-and-care]] | todo |
| A3 | Move the duplicated `MEET_FORMAT_LABEL` / `MEET_CADENCE_LABEL` maps (inlined in `page.tsx`, module-const in `ProfileServicesTab`) to `lib/constants/services.ts`; both files import. | — | todo |
| A4 | Migrate `ProfileServicesTab`'s 5 raw `<input type="number">` pricing-modifier inputs to `InputField` (file already imports it). | — | todo |

---

## Workstream B — Volunteer tokenization + colour-affordance rule

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Add the violet base ramp (`--violet-50/100/300/700/800`) + a `--status-volunteer-*` semantic family (soft/light/border/main/strong), mirroring `--status-info-*`. Map to the actual hex in use. | [[design-tokens]] | todo |
| B2 | Migrate the ~11 violet-using classes (`.btn-volunteer`, `.booking-card--volunteer`, `.credential-pill--volunteer` + tier vars, `.shelter-summary-card-icon`, `.shelter-walk-mentor-link`, mentor CTA/wash, shelter chip) + the inline `#6d28d9` in `help-a-dog/page.tsx:272` onto the tokens. Delete the scoped `--mentor-progress-violet*` one-offs. | [[design-system]] (Principle 14/15) | todo |
| B3 | Surface the new `--status-volunteer-*` family + the missing `--status-info-600` in the styleguide tokens page. | [[design-tokens]] | todo |
| B4 | Formalize design-system Principle 15 ("coloured affordance = pill or text link, never a rounded coloured button"): fix the rounded volunteer "Book session" button (`MentorSessionBookingSheet.tsx:506`) and the filter-footer `cta` pill (`FilterPanelMobile.tsx:72`, Principle 8 — footer cta is for celebratory commits only). | [[design-system]] | todo |

---

## Workstream C — Dead-code + CSS hygiene

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Delete the dead MASTER-DETAIL SHELL family — `.md-shell` / `.list-panel` / `.detail-panel` + the 3 dead override blocks (globals.css 922–1045, 6468, 9496, 18505). 0 consumers confirmed; superseded by `.page-column-*`. ~196 lines. | [[design-system]] | todo |
| C2 | Delete `.discover-type-pill`/`-pills` (globals.css 3538, 0 consumers) and `components/schedule/SessionRow.tsx` (0 imports). | — | todo |
| C3 | Fix the `.dropdown-menu` specificity footgun (P76): hoist the base `.dropdown-menu-wrap` / `.dropdown-menu` / `-item` block above its variants; collapse the double-class hacks; split the `flex:1` dual-duty on `.dropdown-menu-wrap` into an explicit modifier. | [[punch-list]] P76 | todo |
| C4 | Reconcile the split-brain `--text-xs` (10px `@theme` vs 12px `:root`) to one deliberate value. **Blocks WS-H.** | [[design-tokens]] | todo |
| C5 | Remove dead compat aliases (`--status-error-surface`/`-border`/`-text` — 0 uses); collapse the `--status-info-600` ≡ `--status-info-strong` duplicate; review `--radius-full` (0 component uses). | [[design-tokens]] | todo |
| C6 | Regenerate the styleguide hardcoded hex arrays from `globals.css` (5+ drifted values; ideally derive at runtime so it can't re-drift). | [[design-tokens]] | todo |
| C7 | Doc-scrub: remove the deleted `ListPanel`/`DetailPanel`/`MasterDetailShell` rows from design-system.md tables + Consolidation Queue. | [[design-system]] | todo |

---

## Workstream D — Named primitive extractions

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | **FC4 `Section` shell** → `components/layout/Section.tsx`, owning the two-tier rhythm internally (header→first-body tight, body→body looser) so the `.profile-tab-stack > section` `:nth-child` hack can retire. Migrate the 3 `ProfileAboutTab` call sites. | [[Future Considerations]] FC4 | todo |
| D2 | **FC15 `SortMenu`** → `components/ui/SortMenu.tsx` from the two byte-identical copies (`shelters/[id]`, `discover/help-a-dog`); rename `.shelter-sort-trigger`/`-wrap` → `.sort-menu-*`; dedupe the copied `SORT_OPTIONS` / `DogsSortKey`. | [[Future Considerations]] FC15 | todo |
| D3 | **P78 `CheckboxRow` `density="compact"`** — absorb the `.pet-edit-checkbox-row` override into a real variant (24×24 indicator + 8px margin), bump `<Check>` to ~14–16px, migrate `PetEditCard`, delete the override. | [[punch-list]] P78 | todo |
| D4 | Reconcile the 3-way input-affix family (`.input-with-icon` [actually trailing], `.input-with-leading-icon`, `.input-with-trailing`): unify under a shared base + position modifiers, and rename `.input-with-icon` → `.input-with-trailing-icon` to fix the misleading name. | [[design-system]] | todo |
| D5 | **FC5 IdentityChip — decision recorded, not built.** Trigger not met (2 of 3). At most, lift the two inline hero-chip `style` blocks to a shared constant; no component. | [[Future Considerations]] FC5 | todo |

---

## Workstream E — Shared shells + recurring shapes

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Extract `.single-panel-shell` base from the byte-identical community/schedule shells (header/title/panel); the two pages add only their `background` override. | [[design-system]] (Consolidation Queue) | todo |
| E2 | Promote a `Card`/`.card-shell` primitive (rounded-panel + surface bg + subtle border + padding + flex-col gap) for the ~37 inline reimplementations; migrate the highest-traffic clusters (checkout, profile link cards, settings option cards). Reconcile the border drift (1px vs 1.5px). | [[punch-list]] P67 | todo |
| E3 | Route the 5 inline section-header reimplementations through the existing `SectionHeader`; dedupe the two near-identical in-file mutual-connection rows in `page.tsx`. | [[punch-list]] P67 | todo |

---

## Workstream F — Variant-drift convergence

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Optional-field label: converge the five treatments [`(Optional)`, `(optional)`, `Optional`, `— optional`, `· optional`] onto one canonical `(Optional)` via `.label-secondary`/`secondaryLabel`. Kill the em-dash variant (`PetEditCard.tsx:344`) and the right-aligned `space-between` variant. | [[punch-list]] P51 | todo |
| F2 | Converge ScheduleCard status (Hosting/Cancelled/Providing/Care) from chip pills to CardMeet's inline icon+colored-text treatment (Principle 7). | [[design-system]] (Principle 7) | todo |
| F3 | Extract one single-select primitive (or `MultiSelectSegmentBar` single-select) for the One-time/Repeat-weekly picker hand-rolled identically in 3 places (discover/care, FilterBody, InquiryForm). | [[design-system]] | todo |
| F4 | Migrate the ~7 inline `.pill-group` + `.map` + conditional `.active` rows to the existing `PillToggle` primitive (PetEditCard, AppointmentServiceEditCard, MeetServiceEditCard, MentorSessionBookingSheet). | [[design-system]] | todo |
| F5 | Connection chip: extract the inline-styled Discover chip (`CardExploreResult.tsx:219`) into a shared `.connection-pill--familiar/--connected` class so it and PersonRow draw from one definition; decide + document whether Connected earns a chip on cards but not rows. | [[punch-list]] P51, [[Trust & Connection Model]] | todo |
| F6 | Principle-13 CTA wrap migration: fix the 5 still-broken `flex-1` paired-CTA rows (`bookings/[bookingId]` + CancelBooking/CancelSession/CancelOccurrence/DeleteService modals) to `flex flex-wrap gap-sm` + `grow basis-[140px]`; fix the stale comment in `ProfileAboutTab.tsx:598`. | [[design-system]] (Principle 13) | todo |

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

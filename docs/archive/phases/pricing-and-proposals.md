---
status: archived
last-reviewed: 2026-05-05
review-trigger: When any task is completed or blocked
---

# Pricing & Proposals

**Goal:** Structurally enforce the no-bargaining principle. Provider pricing config (base + a starter set of modifiers) drives an auto-pricing engine that takes (config × inquiry) → quote. ProposalForm refactors from "compose price" to "review system quote and confirm." Override path stays available but is visually flagged as a deviation.

**Depends on:** Discover & Care (closed 2026-05-04) — services-as-catalog, structured inquiry artifact, ProposalForm/InquiryFormModal, persisted demo state. Without those the pricing loop has nothing to drive.

**Refs:**
- [[Open Questions & Assumptions Log]] §6 → "Structured pricing model + no-bargaining principle"
- [[Open Questions & Assumptions Log]] §4 last entry → Discover Care surface gaps cluster (only F3 — per-service pricing on cards — pulled into this phase)
- [[Open Questions & Assumptions Log]] §6 (intro session toggle, group-anchored discounts — deferred to a future Bookings & Monetisation pass)
- [[features/explore-and-care]] → Booking conversation flow, "next pass" entry
- [[strategy/Groups & Care Model]] → Services as Catalog
- [[strategy/Competitive Research - Prague Dog Care Scene]] (transparent rate signalling)
- [[strategy/Competitive Research - Fluv]] (seasonal peaks rationale for holiday surcharge)
- `lib/types.ts` → `CarerCareServiceConfig`, `CarerMeetServiceConfig`, `CarerAppointmentServiceConfig`, `BookingPrice`, `PriceLineItem`, `InquiryDetails`
- `lib/pricing.ts` → `buildProposalPrice` (current foundation — extends, doesn't replace)
- `components/messaging/ProposalForm.tsx`, `components/messaging/InquiryFormModal.tsx`, `components/profile/ProfileServicesTab.tsx`

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs (Open Q §6, Roadmap entry, ProposalForm, pricing.ts, types, ProfileServicesTab, InquiryFormModal, explore-and-care.md, Prague + Fluv + TTP research)
- [x] Review Open Questions log — flagged §6 (resolved by this phase), §4 last entry (cluster — F3 pulled in, F1/F2/F4/F5 deferred to a Discover refinement pass), §6 discount/intro-session (deferred to Bookings & Monetisation)
- [x] Audit for conflicts between phase plan and current codebase — none. `buildProposalPrice` is a clean foundation; this phase extends it.
- [x] Update referenced docs with `last-reviewed` older than 2 weeks — none triggering today (all strategy/feature/implementation docs are within 21 days as of 2026-05-04; TTP at 20 days is borderline but content unchanged)
- [x] Confirm scope — starter modifier set (4) + workstreams A–F locked with PO. Deferred items routed (longer-walk / off-hours / boarding-specific modifiers → future modifier pass; F1/F2/F4/F5 from §4 cluster → Discover refinement pass)

---

## Starter modifier set (locked)

Four modifiers ship in v1. Picked because all four work with **already-captured inquiry data** (no inquiry-form expansion needed for the loop to close), and because they exercise distinct math + trigger paths so the engine is properly stress-tested.

| # | Modifier | Math | Trigger source | Applies to |
|---|---------|------|----------------|------------|
| 1 | **Holiday surcharge** | +25% on subtotal (configurable) | Czech public holidays table — date-driven | Care + Appointment |
| 2 | **Weekend** | +15% on subtotal (configurable) | `recurringSchedule.days` or `startDate` weekday | Walking primarily; opt-in for Sitting/Boarding |
| 3 | **Multi-pet** | Flat +N Kč per extra pet over 1 (configurable) | `inquiry.pets.length` | All Care |
| 4 | **Last-minute** | +10% on subtotal (configurable) | `today + N days < startDate` (threshold configurable) | All Care |

**Stacking order (locked):** flat-per-unit modifiers (multi-pet) apply to base before percentage modifiers compound on the subtotal. Each modifier is its own `PriceLineItem` with `isModifier: true` and a `triggerNote` so the proposal can render "*Holiday surcharge — Dec 25 falls in this booking*" inline.

**Each modifier is per-service opt-in.** Provider sets a base rate then toggles which modifiers apply with their params. Reasonable defaults so opt-in is one tap.

**Deliberately deferred to a future modifier pass:** longer-walk (needs `durationMinutes` on inquiry), off-hours (needs time-of-day on inquiry), boarding-specific (yard, house type, max-dogs-at-once), add-on services (bath, grooming reinforcement, photo updates), package rates (5-night bundle).

---

## Workstream A — Provider pricing config schema + storage

Foundation. Sequenced first; the engine + ProposalForm + onboarding UI all read from this shape.

| Task | Description | Refs | Status |
|------|-------------|------|---------|
| A1 | Add `PricingModifier` discriminated union to `lib/types.ts`. Variants: `{ kind: "holiday"; pct: number; enabled: boolean }`, `{ kind: "weekend"; pct: number; enabled: boolean }`, `{ kind: "multi_pet"; flatPerExtra: number; enabled: boolean }`, `{ kind: "last_minute"; pct: number; thresholdDays: number; enabled: boolean }`. | `lib/types.ts`, [[Open Questions]] §6 | done |
| A2 | Extend `CarerCareServiceConfig` with `modifiers: PricingModifier[]`. Empty array = no modifiers active. Decide: store on `CarerMeetServiceConfig` and `CarerAppointmentServiceConfig` too, or Care-only for v1? Recommended: Care-only for v1 (Meet has fixed `pricePerSession`, Appointment has fixed `pricePerAppointment` — no inquiry-driven dimensions exist yet). | `lib/types.ts` | done |
| A3 | Czech public holidays table — `lib/holidays.ts`. Static array of 2026/2027 Czech public holidays (Jan 1, Easter Mon, May 1, May 8, Jul 5, Jul 6, Sep 28, Oct 28, Nov 17, Dec 24, Dec 25, Dec 26). Helper: `isHolidayInRange(start, end)` returns matched dates so the engine can label the line item. | new `lib/holidays.ts` | done |
| A4 | Mock-data backfill. Pick 3–4 carers across personas to seed with realistic modifier configs (Tereza walking — multi-pet + weekend; Klára training — none on Care services since hers are mostly Meet-type; Petra/another walker — holiday surcharge + last-minute). Document choices inline so demo is reproducible. | `lib/mockUsers.ts`, `lib/mockData.ts` | done |

---

## Workstream B — Auto-pricing engine

Pure function. No side effects, fully testable in head + by inspection. Replaces `buildProposalPrice` for Care-type; Meet-type and Appointment-type retain today's flat-rate pricing path.

| Task | Description | Refs | Status |
|------|-------------|------|---------|
| B1 | `computeQuote(config, inquiry, today) → BookingPrice` in `lib/pricing.ts`. Inputs: `CarerCareServiceConfig` + `InquiryDetails` + ISO date for "today" (testability — never pull `new Date()` inside). Outputs: `BookingPrice` with line items in stack order (base, then flat modifiers, then percentage modifiers), totals reflecting the math. | `lib/pricing.ts`, `lib/types.ts` | done |
| B2 | Modifier evaluators — one per kind. `evalHoliday`, `evalWeekend`, `evalMultiPet`, `evalLastMinute`. Each takes (modifier, inquiry, today) → `PriceLineItem | null`. Composable, easy to add the next batch. | `lib/pricing.ts` | done |
| B3 | Per-line-item `triggerNote` field on `PriceLineItem` (e.g. "Dec 25 falls in this booking", "2 extra pets", "Booking starts in 2 days"). Renders as small text under the line item label. Type addition: optional string on `PriceLineItem`. | `lib/types.ts`, `lib/pricing.ts` | done |
| B4 | Recurring (ongoing) bookings: weekly total reflects modifiers that apply to the *cycle*, not one-off (e.g. weekend surcharge applies if Sat/Sun is in the recurring days; multi-pet applies always; holiday surcharge surfaces only on the line item for occurrences that fall on a holiday — for v1, accept the simplification of "doesn't apply to ongoing" since rolling weekly billing means each week's quote is computed independently anyway). Document the simplification inline. | `lib/pricing.ts` | done |
| B5 | Replace `buildProposalPrice` callers with `computeQuote`. Keep `buildProposalPrice` for one revision as a thin wrapper that adapts old call sites if any survive — or delete if all are migrated. | `components/messaging/ProposalForm.tsx`, `lib/pricing.ts` | done |

---

## Workstream C — ProposalForm refactor

From "edit line items freely" → "review system quote, confirm — or override (flagged)."

| Task | Description | Refs | Status |
|------|-------------|------|---------|
| C1 | Read-only quote view as default. Render `BookingPrice.lineItems` as labelled rows with their `triggerNote` inline ("*Holiday surcharge — Dec 25 falls in this booking*"). Subtotal + platform fee + owner-pays — same as today. No edit affordance unless the provider opts in. | `components/messaging/ProposalForm.tsx` | done |
| C2 | Override mode. "Adjust this quote" button below the line items reveals an editable layer — provider can change line item amounts or add a new flat-amount line. When any field deviates from the system-computed value, the line is visually flagged (small chip or muted background) and a deviation note is recorded on the proposal. | `components/messaging/ProposalForm.tsx`, `lib/types.ts` | done |
| C3 | Optional override reason. When the provider deviates, prompt for a one-line reason ("repeat client discount", "introductory rate", "off-platform familiarity"). Stored on `BookingProposal.overrideReason?: string`; rendered on the receiving owner's `BookingProposalCard` so it's not silent. | `lib/types.ts`, `components/messaging/ProposalForm.tsx`, `components/messaging/BookingProposalCard.tsx` | done |
| C4 | Counter flow (already wired via `initialPrice` prop) inherits the override behaviour automatically — a counter is by definition a deviation, but if the engine still produces the same quote, the override flag clears. Verify. | `components/messaging/ProposalForm.tsx` | done |

---

## Workstream D — Inquiry form expansion (deferred for v1)

The starter modifier set works with already-captured inquiry data. No inquiry-form changes needed for v1. **This workstream stays open as documentation only** — future modifier passes (longer-walk, off-hours) will expand the inquiry form and slot in here.

| Task | Description | Refs | Status |
|------|-------------|------|---------|
| D1 | Document path forward in `features/explore-and-care.md` → "Future inquiry-form fields" section. Map each deferred modifier to the inquiry field it would need (longer-walk → `durationMinutes`; off-hours → time-of-day picker; boarding-specific → home-attribute fields, but those probably go on the carer config, not inquiry). | `docs/features/explore-and-care.md` | done |

---

## Workstream E — Provider onboarding UI for pricing

Extend the Services edit panel in `ProfileServicesTab.tsx`. Per-service: base rate (already exists) + modifier toggles with their own params.

| Task | Description | Refs | Status |
|------|-------------|------|---------|
| E1 | "Pricing modifiers" section per Care service in edit mode. Default-collapsed accordion to keep the Services edit form scannable. Inside: a row per modifier kind (Holiday / Weekend / Multi-pet / Last-minute) with a toggle + the param input(s) appearing once the toggle is on. | `components/profile/ProfileServicesTab.tsx` | done |
| E2 | Reasonable defaults so opt-in is one tap. Holiday → 25%; Weekend → 15%; Multi-pet → 100 Kč per extra; Last-minute → 10% within 3 days. Provider can adjust. | `components/profile/ProfileServicesTab.tsx`, `lib/types.ts` (default factory) | done |
| E3 | Read view (non-editing) shows enabled modifiers as a small chip strip under the base rate ("+ Holiday +25%   + Multi-pet +100 Kč/extra"). Quick-scan shape so providers see what they've configured without re-entering edit mode. | `components/profile/ProfileServicesTab.tsx` | done |

---

## Workstream F — Per-service pricing on Discover cards (Open Q §4 last entry, item 3)

Pulled from the Discover Care surface gaps cluster because it's the one item tightly bound to the pricing model — when the engine knows a base rate per service, the card needs to reflect it. Other gaps from the cluster (Appointment filter pill, ProviderCard ↔ UserProfile fragmentation, service-aware filters, unwired filter panel) stay deferred to a Discover refinement pass.

| Task | Description | Refs | Status |
|------|-------------|------|---------|
| F1 | Extend `ProviderCard` with `pricesByService?: Partial<Record<ServiceType, { priceFrom: number; priceUnit: ProviderCard["priceUnit"] }>>`. Backfill mock data from each carer's `services[]` so the values are derived, not duplicated by hand. | `lib/types.ts`, `lib/mockData.ts` | done |
| F2 | `CardExploreResult` reads from `pricesByService` keyed by the active service filter (`activeService` prop already exists). When the filter is "All", fall back to the existing single `priceFrom` + `priceUnit`. | `components/explore/CardExploreResult.tsx` | done |
| F3 | Hide the redundant service-chip row when a specific service filter is active (the context is already implied by the filter). | `components/explore/CardExploreResult.tsx` | done |

---

## Acceptance Criteria

- [x] Provider can configure base rate + modifier set per Care service in `ProfileServicesTab.tsx` edit mode. Modifier toggles + params persist via `usePersistedState`.
- [x] Owner sends inquiry → ProposalForm pre-fills with auto-computed quote that visibly applies all enabled modifiers as labelled line items with trigger notes.
- [x] Provider can review-and-send the system quote without editing it (the "no bargaining" path). The default state is **read-only**, not editable.
- [x] Provider can override the system quote when needed; deviations are visually flagged (chip/muted bg), and a `overrideReason` is captured + surfaced on `BookingProposalCard` for the owner.
- [x] Counter flow (G4 from Discover & Care) still works — pre-filling with an existing proposal's price round-trips through `computeQuote` cleanly.
- [x] At least one demo persona path produces a non-trivial quote (multiple modifiers triggered): B5 flagship — Daniel + Bára Christmas-week boarding at Nikola → boarding × 5 nights + Holiday +30% (3 holidays) = 3,120 Kč.
- [x] Discover Care result cards show the right per-service price when a specific service filter is active; fall back to single price on "All".
- [x] No regressions on the inquiry → proposal → contract → upcoming flow shipped in Discover & Care G.
- [x] Mock world reset (`/demo`) wipes pricing config along with other persisted state, since `CarerCareServiceConfig.modifiers` lives on the user profile (which is mock data, not persisted yet — so this is mostly a reminder to verify the persistence boundary stayed clean).

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [x] Walk through every acceptance criterion against the running app — see walkthrough doc (A–J ✅ minus deferred items moved to verification-checklist V1–V12)
- [x] Update all affected feature docs in `docs/features/` (`explore-and-care.md` — pricing flow section, `messaging.md` — proposal artifact, `profiles.md` — services edit pricing UI)
- [x] Update Open Questions log — closed §6 "Structured pricing model + no-bargaining principle"; surfaced two new sub-questions (ongoing-vs-one-off divergence, holiday line-item granularity)
- [x] Updated `docs/strategy/Groups & Care Model.md` with "Pricing model" subsection under Services as Catalog
- [x] Update `ROADMAP.md` — moved out of Current Phase, Sessions & Service Execution confirmed as next
- [x] Review `CLAUDE.md` — current phase set to None active, added pricing-model bullet to Key decisions, added side-task and verification-checklist bullets (process docs landed during the phase)
- [x] Archive this phase board (`git mv docs/phases/pricing-and-proposals.md docs/archive/phases/`, mark `status: archived`)
- [x] **Structural audit** — see Strategic Review section below
- [x] Check next phase scope (Sessions & Service Execution) for conflicts — no conflicts; the inquiry→proposal→contract loop just shipped is the natural feed for session execution
- [x] **Strategic review** — see below

---

## Status snapshot — 2026-05-04

**All workstream tasks (A1–F3) coded.** Engine math verified via four unit-test scenarios (Christmas-week boarding 2 dogs far-out, same with 3-day last-minute, Saturday day-sitting, ongoing weekly walks 2 dogs). UI verified visually for: provider modifier-config accordion (all 4 kinds render, "N on" badge correct), modifier chips on viewer profile cards, per-service price swap + chip-row hide on Discover Care.

**Modifier configs seeded on 4 carers:**
- Tereza (sitting per-visit) — weekend +15%, multi-pet +80 Kč/extra
- Petra (sitting per-visit) — weekend +20%, last-minute +10% within 3d
- Shawn (walks) — holiday +25%, multi-pet +100 Kč/extra
- Nikola (boarding per-night) — holiday +30%, multi-pet +200 Kč/extra, last-minute +15% within 5d (flagship demo: stack of 3)

**Key files touched this phase:**
- `lib/types.ts` — `PricingModifier` union, `CarerCareServiceConfig.modifiers`, `BookingProposal.isOverride/overrideReason`, `PriceLineItem.triggerNote`, `ProviderCard.pricesByService`
- `lib/holidays.ts` (new) — Czech holidays 2026/2027 + range helpers
- `lib/pricing.ts` — `computeQuote` engine, evaluators per modifier kind, `quotesMatch`, `defaultModifiers`; old `buildProposalPrice` retained as deprecated shim
- `lib/mockUsers.ts` — modifier seeds on 4 carers
- `components/messaging/ProposalForm.tsx` — full refactor to read-only quote default + override mode + deviation flagging
- `components/messaging/BookingProposalCard.tsx` — Custom-quote badge + line-item `triggerNote` rendering + override-reason callout
- `components/profile/ProfileServicesTab.tsx` — `PricingModifiersEditor` accordion + view-mode `ModifierChips` strip
- `components/explore/CardExploreResult.tsx` — `resolveDisplayPrice` helper, service-tag suppression on filter
- `app/profile/[userId]/page.tsx` — modifier chips on viewer-side service cards
- `app/discover/care/page.tsx` — `activeService` plumbing into `CardExploreResult`
- `app/bookings/[bookingId]/page.tsx` — line-item `triggerNote` rendering on Pricing breakdown
- `app/globals.css` — proposal-form quote/override CSS, modifier editor + chips CSS, BookingProposalCard custom-quote-badge + triggerNote + override-reason CSS

**What's NOT yet verified in browser:** the full inquiry → ProposalForm modal walkthrough as a real user. The form opens cleanly (no compile errors, no runtime errors), and the engine that powers it is unit-test verified, but driving an end-to-end click-through (owner sends inquiry → switch persona → provider responds → see system quote → toggle override) via preview_eval was blocked by InquiryFormModal state-handling complexity (controlled checkboxes, date picker plumbing). Worth a focused human walkthrough next session — likely surfaces a few small UX rough edges (override-reason copy tone, deviation chip subtlety, accordion default-collapsed-vs-open behavior).

**Walkthrough rework expected.** Per Shawn 2026-05-04 — opening this phase noted the walkthrough always takes a lot of reworking. Reasonable rough edges to expect: trigger-note copy ("Booking starts in 2 days" feels stilted on the proposal), deviation flag visual register (current muted-amber may be too subtle or too strong), holiday surcharge label specificity (currently lumps multiple holidays into a single "+30%" line — may want to split per-holiday).

---

## Strategic Review — 2026-05-05

### What changed

- **The no-bargaining thesis is structurally enforced.** The phase opened with a critique: "provider edits the line item" was bargaining at the structural level even when the UI made it look like quoting. Engine-as-canonical-answer with override-as-flagged-exception flips that. Override is now a deliberate act with its own visual register and an optional reason — provider can't drift the price silently.
- **Engine output as a 3-surface artifact.** Building the InquiryForm live estimate revealed something we didn't plan: when both parties see the same number on the chat artifact (InquiryCard), the proposal stage stops feeling like a price reveal and starts feeling like a confirmation. The owner walks into the proposal already knowing the number. That changes the social dynamic — cheaper providers can't get a "is this really the price?" double-take, more expensive ones can't anchor low and surprise high.
- **Auto-mutual-Connected on contract sign** (resolves part of Open Q §2). The inquiry-driven trust transitions question that opened in Discover & Care is now mostly resolved — only the Appointment-flow first-message-trigger remains open and is correctly scoped to Inbox & Notifications.
- **Process discoveries:** spawned tasks need rules (CONTRIBUTING.md → Side Tasks, written 2026-05-05), and walkthrough docs have a thesis-vs-edge-case scope problem (verification-checklist.md, written 2026-05-05). Both surfaced during this phase's walkthrough and are now documented patterns. **The walkthrough scope rule is the single most important process change** — phases can drift indefinitely if walkthroughs become exhaustive QA passes instead of thesis verification.

### Open questions worth resolving now

- **Ongoing-vs-one-off pricing divergence.** Logged in §6 of Open Questions. Engine v1 deliberately skips Holiday + Last-minute on ongoing bookings. Worth a 30-min product think before Sessions & Service Execution opens — sessions phase will inherit any ongoing-quote semantics we lock in here.
- **Holiday line-item granularity.** Logged in §6. Single line vs per-holiday split. Cosmetic but affects the "engine output as legible artifact" thesis. Not blocking; revisit when designing session-level price views.
- **§4 Discover refinement cluster** stays deferred. Pulled F3 (per-service pricing on cards) into this phase as planned; the rest (Appointment filter pill, ProviderCard ↔ UserProfile fragmentation, service-aware filters, unwired filter panel, community-first ordering) remain coherent as a post-Sessions Discover Refinement phase.

### Alternatives and challenges

- **Override visual register may be too soft.** The amber tint on the deviated row + the "CUSTOM QUOTE" callout in the body work, but during walkthrough they read as "informational" more than "this is unusual, are you sure?" If demo testing shows providers using override casually for routine cases (not exceptional ones), tighten — make the override gesture require an explicit confirm, or surface the deviation more prominently.
- **The four starter modifiers cover ~70% of typical cases.** Longer-walk and off-hours are the most common gaps (mentioned in Prague provider research). Both need inquiry-form expansion. The decision to defer them was right for v1 — the engine architecture is generalised, adding modifier #5 is small. Worth scheduling a "v2 modifier pack" pass after Sessions if demo testing confirms walking-specific gaps.
- **Inquiry form is doing a lot.** It now captures pet selection, service type, sub-service, frequency (one-off / ongoing), date(s), Start-from for ongoing, free-text notes, AND surfaces a live estimate. The form is dense. Worth a UX think during Inbox & Notifications when we revisit messaging surfaces — could the form be progressive (show estimate only when complete, hide complexity until needed)?

### Research suggestions

- **Demo testing on the override path.** The most interesting design call — provider can deviate but it's flagged. Watch real testers: do they understand the flag is informational? Do they read the reason? Does the social pressure of the flag actually deter casual deviation? This is the testable hypothesis and the answer dictates whether the deterrent needs strengthening.
- **Prague provider interviews on modifier preferences.** Which modifiers do real providers actually want? The starter four were chosen from competitive research; no Prague-provider validation yet. Could be a 2-hour discovery call with 2–3 providers from the cold-start network. Pairs with Discover Refinement / cold-start phase work.

### Next phase readiness

**Sessions & Service Execution** is correctly sequenced behind this. The inquiry→proposal→contract→upcoming loop now feeds it cleanly:
- `Booking.price.lineItems` carries the engine output through to the booking record
- Booking detail Pricing breakdown is already wired to render the new line-item shape (verified in V7)
- Mutual Connected on contract sign means session messages happen in a real connected thread
- Rolling weekly billing on ongoing bookings is the contract Sessions inherits

One small consideration: if Sessions builds session-level price summaries (e.g. "this completed walk: 280 Kč" on the session report), the engine architecture needs a per-occurrence quote helper. Easy extension — the engine is already pure-function and inquiry-driven. Note for the Sessions Opening Checklist.

### Structural audit results

- Live `docs/phases/` files with `status: archived` or `status: complete`: none ✓
- Filename overlap between `docs/phases/` and `docs/archive/phases/`: this board is archived in this commit; no other duplicates ✓
- Docs with `last-reviewed` older than 21 days: bumped explore-and-care, messaging, profiles, Open Questions, Groups & Care Model, ROADMAP, CONTRIBUTING, profiles-deep-pass during phase close ✓
- Dead references to non-existent files in CLAUDE.md / ROADMAP / CONTRIBUTING: none observed ✓

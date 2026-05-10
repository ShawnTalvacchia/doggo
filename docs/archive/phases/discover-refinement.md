---
status: archived
last-reviewed: 2026-05-10
review-trigger: When any task is completed or blocked
archived: 2026-05-10
---

# Discover Refinement

**Goal:** Make `/discover/care` community-first instead of marketplace-first — surface Carers you know above carers you don't, and resolve the data fragmentation underneath that makes today's cards inconsistent. Collapses the Helper/Provider tier into a single noun (Carer) where public-vs-circle is a configuration, not a different identity.

**Depends on:** Discover & Care (services-as-catalog, trust badges, inquiry → proposal → contract), Pricing & Proposals (per-service pricing data on cards, modifier engine), Inbox & Notifications (inquiry-driven trust transitions wire into the same pages).

**Refs:** [[Open Questions & Assumptions Log]] §4 (Discover Care surface gaps cluster), [[Trust & Connection Model]], [[Groups & Care Model]], [[Competitive Research - Prague Dog Care Scene]], [[Competitive Research - Fluv]], [[explore-and-care]], [[badges]], [[punch-list]] P58

---

## Phase decisions (settled at open, 2026-05-10)

These two terminology / scope calls were decided in the opening discussion before this board was drafted. They shape every workstream below.

1. **Helper → Carer; Provider tier label retired.** "Carer" becomes the only noun for anyone who offers care. The previous Helper/Provider split is reframed as a single role with a configuration: a Carer either has services *open to their Connected circle only* or *open to anyone*. Same person, same role, wider audience — the dial finally fits the data model literally. The data field stays `CarerProfile.publicProfile: boolean` (no migration); the user-facing question it answers shifts from "are you a Helper or a Provider?" to "are your services open to anyone, or just your circle?" Visual signaling primarily via card chrome + section grouping (see C); a small "Open to bookings" pill may earn its keep on profile hero, decided per-surface during C.

2. **Avatar shape Rule B (P58) folds in app-wide.** Originally a punch-list item; the Discover Refinement card work touches enough of the same surfaces that splitting would be wasteful. Rule: People = circle, Dogs = rounded square. Familiar/Connected avatar ring on Discover provider cards is its own pattern and not affected by Rule B.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs *(done in opening discussion)*
- [x] Review Open Questions log — flag anything affecting this phase *(§4 cluster maps directly into A–E)*
- [x] Audit for conflicts between phase plan and current codebase *(ProviderCard ↔ UserProfile bridging confirmed unfixed: 5 of 12 bridged, 7 directory-only)*
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks *(check at phase start)*
- [x] Confirm scope — no tasks that belong in a different phase *(out-of-scope items noted at bottom)*

---

## Workstream A — Terminology collapse: Helper → Carer, Provider tier retired

Foundational. Light code, broad doc impact. Lands first so downstream workstreams are written in the new vocabulary.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Delete `.person-row-pill--helper`, `--provider`, and `--care` CSS classes (no replacement — surface implies via section grouping + chrome). | `app/globals.css` | done |
| A2 | Remove `careTier?: "helper" \| "provider"` prop from `PersonRow` and all callers. Connection grouping + section labels do the work; trust badges reclaim the badge real estate. Delete `components/people/TierBadge.tsx`. | `components/people/PersonRow.tsx`, `components/meets/ParticipantList.tsx`, group Members tab in `app/communities/[id]/page.tsx` | done |
| A3 | Rewrite [[Groups & Care Model]] → "Carers on Profiles" section. Two-state model (Owner; Carer with `publicProfile` configuration) replaces the three-tier table. Updated the dial framing in copy rules. | `docs/strategy/Groups & Care Model.md` | done |
| A4 | Rewrite [[badges]]. Two categories (Role / Trust); Tier category retired with explicit deprecation note. Display rules per surface updated. | `docs/implementation/badges.md` | done |
| A5 | Rewrite [[Trust & Connection Model]] "How visibility applies to Carers" section. Updated to single-role framing; pointer to profiles + Groups & Care for composition. | `docs/strategy/Trust & Connection Model.md` | done |
| A6 | Updated [[profiles]] "Lock + Carer audience: two settings, one role" section + [[explore-and-care]] tier references + frontmatter tags. | `docs/features/profiles.md`, `docs/features/explore-and-care.md` | done |
| A7 | Swept [[User Archetypes]]. Casual Helper → Casual Carer; Aspiring Provider → Aspiring Carer; Professional Provider → Professional Carer. Bridge-to-role-model section rewritten; Carer Dial section updated. | `docs/strategy/User Archetypes.md` | done |
| A8 | Code-level cleanup — `careTier` references in code all removed; `MessageSender = "owner" \| "provider"` retained (chat-side role, unrelated to tier). Data field `CarerProfile.publicProfile: boolean` untouched. | App-wide | done |
| A9 | CLAUDE.md sweep — current phase pointer updated; Lock-vs-Tier callout reframed to "Lock + Carer audience" single-axis framing; Badges taxonomy callout reduced to two categories; Carer Dial language. | `CLAUDE.md` | done |
| A10 | Open Questions §4: closed Helper-vs-Carer terminology entry with full resolution marker; updated Lock-vs-Tier resolved entry with the reframe. ROADMAP Onboarding scope mention updated; Profiles Deep Pass D7 entry reframed. | `docs/strategy/Open Questions & Assumptions Log.md`, `docs/ROADMAP.md` | done |

---

## Workstream B — Bridge completion: every provider is a real user

Foundational data work. Without bridged UserProfiles, per-viewer ranking in C and per-service price resolution in D have to fall through bridge-or-card branches everywhere. Promoting the remaining 7 directory-only providers collapses the conditional.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Synthesized full `UserProfile` exports for all 7 directory-only carers — `janaK`, `tomasB`, `pavelD`, `simonaV`, `martinK`, `lenkaS`, `petrV`. Each carries: bio, location/neighbourhood, memberSince, profileVisibility:open, openToHelping:true, full `carerProfile` block with availability, services array (Care config per ServiceType offered with sensible per-service pricing), credentials block, repeatClients. Modifier defaults (weekend/holiday/multi-pet/last-minute) seeded per provider character. | `lib/mockUsers.ts` | done |
| B2 | Backfilled `userId` field on each ProviderCard (`jana-k`, `tomas-b`, etc. — IDs match user IDs since none collide). All 12 ProviderCards now bridge. Per-card legacy `credentials` + `repeatClients` fields removed (now read from bridged UserProfile via the existing trust-badge resolver). | `lib/mockData.ts` | done |
| B3 | `pricesByService` decision: deferred — no ProviderCards carry the field today (`grep -n pricesByService lib/mockData.ts` returns 0). The `CardExploreResult.resolveDisplayPrice` helper already prefers bridged Care config over the legacy single price; keeping `pricesByService` available on the type as future-state for cards that want to override the bridge for a specific service. | `lib/mockData.ts`, `components/explore/CardExploreResult.tsx` | done |
| B4 | Rewrote `lib/mockData.ts` providers-array header comment to document the bridge contract: every provider has a bridged UserProfile, ID-mapping rules, per-service data-resolution path, future Supabase migration note. Updated `getUserOrProvider` synthesis fallback comment to reflect that no live ProviderCard hits it post-bridge. | `lib/mockData.ts`, `lib/mockUsers.ts` | done |
| B5 | Walkthrough verified via preview server: Discover Care surface renders all 12 carers with bridged trust badges + connection signals; per-service pricing differs by active filter pill (Olga 500 sitting / 390 walks; Markéta 700 sitting / 600 walks). | All personas (verified Tereza viewer; cross-persona walkthrough pending demo prep) | done |

---

## Workstream C — Community-first ordering on `/discover/care`

The phase thesis. Carers in your circle render distinctly above the broader marketplace.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Section structure shipped: `CareResultsList` splits results into "Carers in your circle" (resolved per-viewer via `useConnections().getConnection` so session marks reflect immediately) above "Other carers." Section headers via local `ResultsSectionHeader` (caps + tracking, mirrors `SectionHeader` density). Empty-circle case falls through to a flat list — no section header noise when there's only one section. | `app/discover/care/page.tsx`, `contexts/ConnectionsContext.tsx` | done |
| C2 | In-circle card variant shipped: `variant?: "marketplace" \| "in-circle"` prop on `CardExploreResult`. In-circle hides the platform-style rating + review-count row in JSX and adds `.result-card--in-circle` CSS — `var(--brand-subtle)` background + 3px `var(--brand-main)` left accent stripe. Standard marketplace variant unchanged for the rest. CTA copy still inherits from `Link` (no separate CTA button per card today); the "Ask {firstName}" framing happens on the profile destination, not the card. | `components/explore/CardExploreResult.tsx`, `app/globals.css` (`.result-card--in-circle`) | done |
| C3 | Empty-state at section level handled implicitly by `showSplit = inCircle.length > 0` — when the viewer has no in-circle carers, the surface renders one flat marketplace list (no empty section, no header). Whole-page empty-state copy for zero filter results retained. | `app/discover/care/page.tsx` | done |
| C4 | "Open to bookings" pill decision **deferred to user review.** Phase work shipped without an explicit Carer-status pill on profile hero — surface implies (Discover surface = public, in-circle section header = circle-audience implication). Open call: should profile hero show a small "Open to bookings" status pill where the public-vs-circle distinction matters and the surface itself doesn't carry it? Decide when reviewing the live cards. | Profile hero, `docs/implementation/badges.md` | **deferred — needs user weigh-in** |
| C5 | Trusted-by-Your-Network audit — no change needed. The badge speaks about *second-degree* network ("Used by N people you know"); the in-circle section header speaks about *first-degree* relationship. They carry different signals and don't double-up; keeping both. | `lib/trustBadges.ts` | done |
| C6 | Walkthrough verified via preview server: Tereza-as-viewer sees Klára (Familiar) in the in-circle section above 11 marketplace carers; Klára's card renders with brand-subtle background + brand-stripe + no rating row; section headers carry counts. Cross-persona walkthrough (Daniel/Tomáš/Klára/New User) pending demo prep. | All personas | partial |

---

## Workstream D — Service catalog completion: Appointment pill, per-service pricing, service-aware fields

Resolves the data-model gaps the filter UX needs to stand on.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Decision: kept `ServiceType` narrow (Care subtypes only) and added a parallel `appointmentTypes?: AppointmentCategory[]` field on `ProviderCard` for the directory-level summary. Filter pill `"appointment"` matches `appointmentTypes.length > 0`. Avoids the cascade of widening `ServiceType` (9 `Record<ServiceType, X>` consumers) for a single new pill. Vet/Grooming split deferred until more than one vet seeds the directory. | `app/discover/care/page.tsx`, `lib/types.ts:ProviderCard`, `lib/mockData.ts` | done |
| D2 | Lenka N. backfilled with `appointmentTypes: ["vet"]`. `services: []` Care array intentionally retained empty (vet appointments aren't a Care subtype); the appointment offering data continues to live on `lenkaVet.carerProfile.services` as `kind: "appointment"`. Card chip row now renders both Care service tags + appointment subtype labels (Vet / Grooming). | `lib/mockData.ts` | done |
| D3 | Service-aware filter fields added to `CarerCareServiceConfig` as optional flat properties (the existing `serviceType` discriminator gates which fields are interpreted): `pace?: WalkPace` (reuses meets-domain enum: leisurely / moderate / brisk), `leashPolicy?: LeashPolicy`, `homeType?: HomeType`, `hasOwnDogs?: boolean`, `hasYard?: boolean`, `maxDogs?: number`. Backfilled across all bridged carers (olgaM, marketaH, janaK, tomasB, pavelD, simonaV, martinK, lenkaS, petrV) per provider character (Tomáš = case-by-case leash + moderate pace because trainer; Pavel = house + has own dogs; Martin = brisk + off-leash-areas; etc.). Existing journey-persona carers (Tereza, Klára, Petra, Nikola) untouched — their fields read as undefined (treated as "no preference matched" by the filter). | `lib/types.ts:CarerCareServiceConfig`, `lib/mockUsers.ts` | done |
| D4 | Per-service pricing resolution — `CardExploreResult.resolveDisplayPrice` extended for appointment-flavor: when `activeFilterCategory === "appointment"` and the bridged user has appointment offerings, surface the cheapest `pricePerAppointment`. Falls back to legacy single price for unbridged or unmatched cases. Verified live: Lenka shows 900 Kč (cheapest of 900 skin-consult / 1200 annual checkup). | `components/explore/CardExploreResult.tsx` | done |

---

## Workstream E — Wire the filter panel

`CareResultsList` filters by the top pill only today; `selectedDays`, `visitMode`, price slider, and the services accordion are all visual no-ops. Wire the predicates and add service-aware shape.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | `applyAllFilters(provider, filters, pillKey)` predicate function added — composes pill match + price range (compared against the displayed price under active pill via `resolveListedPrice`) + day-of-week match (mapped from 2-letter chip codes to `DayOfWeek` via `DAY_TO_DOW`) + time-of-day slot match. Replaces the broken accordion-services hooks-rule violation. `visitMode` retained as inquiry-form prefill (most carers do both modes, so it's not a result predicate). | `app/discover/care/page.tsx` | done |
| E2 | "Time of day" multi-select chip row added (Morning / Afternoon / Evening) using `MultiChipFilter` primitive. Filters against `CarerProfile.availability[].slots`. Distinct from inquiry-form's per-session time picker. | `app/discover/care/page.tsx` | done |
| E3 | Service-aware filter shape shipped: `MultiChipFilter` reused for service-conditional groups. Walks pill exposes Walk pace (leisurely / moderate / brisk) + Leash policy (always / off-leash areas / case by case). Sitting/Boarding expose Home setting (flat / house / ground floor + garden) + own-dogs toggle. Boarding adds Has yard. Pill switch resets service-aware fields (the previous pill's choices don't translate). Appointment pill keeps the universal fields only (no service-specific dimensions yet — vet/grooming-specific filters are a future-state addition). | `app/discover/care/page.tsx` (`CareFilterPanel`, `MultiChipFilter`) | done |
| E4 | Result count in floating "View N results" button now uses `applyAllFilters` against the full set — reflects every active filter, not just the top pill. Verified: switching to Walks + Brisk shows "View 1 result" (Martin K. only); switching to Sitting shows 6 results post-bounds-fix. | `app/discover/care/page.tsx` | done |
| E5 | Walkthrough verified: filter combinations behave sensibly. Bonus discovery — `getExploreRateBounds` floors for Sitting (was 500) and Boarding (was 450) hid 4 affordable bridged carers (Simona 350, Lenka S 410, Jana 430, Petr V 480 sitting). Lowered Sitting floor to 300 and Boarding floor to 400 to fit the seeded data. Documented in `lib/pricing.ts` comment. | All personas | done |

---

## Workstream F — Avatar Rule B app-wide sweep (P58)

Independent of A–E; can run in parallel.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Audit complete. Already correct (Rule B applied pre-sweep): `OwnerDogAvatar` (`.person-avatar-dog` = radius-md), `PetCard` (`.pet-profile-avatar` = radius-sm), `SessionsPetHeader`, Pet info section. Drift identified: `.sched-avatar-pet` (50%), `.booking-card-avatar-pet` (50%), `AttendeeAvatarStack` (slot-agnostic rounded-full), `meet-summary-avatar` (50%), `CompactGreeting` dog stack (rounded-full despite "Dog avatars" comment), `DogsNearYou` (rounded-full despite dog-forward), `FeedCTA` "Dog avatar stack" (rounded-full). | App-wide | done |
| F2 | Applied Rule B to every drift surface: `.sched-avatar-pet` → `var(--radius-md)`. `.booking-card-avatar-pet` → `var(--radius-md)`. `AttendeeAvatarStack` slot now applies `rounded-md` when image resolves to a dog photo, `rounded-full` when it falls back to owner avatar. `meet-summary-avatar` got a `--dog` modifier class applied conditionally on the consumer side. `CompactGreeting` dog stack → `rounded-md`. `DogsNearYou` switches between `rounded-md` (dog photo) and `rounded-full` (owner fallback). `FeedCTA` dog stack → `rounded-md`. Other `rounded-full` instances confirmed person/icon/status — left alone. **Excluded** (per spec): Familiar/Connected ring on Discover provider cards. | Multiple files | done |
| F3 | Updated `design-system.md` Principle 5 — Rule B now documents both small (`--radius-md` / `rounded-md`) and large (`--radius-panel` / `rounded-panel`) pet treatments and the dog-vs-owner-fallback `--dog` modifier pattern for surfaces that resolve to either entity type. | `docs/implementation/design-system.md` | done |
| F4 | P58 removed from punch list. | `docs/phases/punch-list.md` | done |
| F5 | Walkthrough verified via preview: AttendeeAvatarStack on `/communities` renders dog photos as 12px-radius rounded squares, person fallbacks as 50% circles. Sample queried: Franta (Tereza's dog), Spot (Shawn's dog) → 12px; Marek, Lucie, Hana, Klára, Tereza (people) → 9999px. | App-wide | done |

---

## Acceptance Criteria

- [x] No "Helper" tier label or `careTier` prop anywhere in product surfaces or strategy docs (data field `publicProfile` retained).
- [x] No `Provider` tier label rendered as a PersonRow badge anywhere; "Open to bookings" (or chosen equivalent) status pill **deferred — needs user weigh-in (C4)**.
- [x] `/discover/care` orders results community-first per viewer — in-circle Carers above the broader marketplace, with a softer card chrome.
- [x] All 12 providers in the directory bridge to a `UserProfile` via `userId`; no synth-fallback paths active in resolved cards.
- [x] Per-service pricing displays correctly when filtering by service; "All" falls back to single price. Appointment-flavor pricing surfaces cheapest bridged appointment offering.
- [x] Appointment filter pill exists; Lenka Nováková tagged via `appointmentTypes: ["vet"]` (Vet chip on card; Vet/Grooming split deferred until ≥2 vet/grooming entries).
- [x] Filter panel predicates wired — selectedDays, time-of-day slots, price range, service-aware fields (pace/leash/home/own-dogs/yard) all affect results. `visitMode` retained as inquiry-prefill state, not a result predicate.
- [x] Service-aware filter fields render contextually based on the active service pill.
- [x] Coarse availability window filter (morning/afternoon/evening) on Discover Care.
- [x] Avatar Rule B applied app-wide; no dogs-as-circles or people-as-rounded-squares except the Familiar/Connected ring exception.
- [partial] Discover Care thesis verified via preview as Tereza viewer; cross-persona walkthrough (Daniel/Tomáš/Klára/New User) deferred to demo prep — not blocking phase close because the thesis structurally holds for any viewer.

---

## Out of Scope (deferred elsewhere)

Surfacing here so they don't creep in:

- **Notification settings UI** → Onboarding & In-Product Communication phase ([[Open Questions & Assumptions Log]] §11)
- **Multi-pet booking treatment** → defer until a multi-pet booking enters mock data ([[Open Questions & Assumptions Log]] §4)
- **Provider-replaceable booking hero photo** → Demo Presentation polish ([[Open Questions & Assumptions Log]] §4)
- **Per-service visibility** (third axis of trust) → future Trust & Privacy refinement ([[Open Questions & Assumptions Log]] §4)
- **Selective care offering** (Helper-style services to a subset of Connected) → same Trust & Privacy refinement; loosely related to C4's pill decision
- **Pet-profile-based provider matching** (Fluv-style) → noted in [[Competitive Research - Fluv]] as a future Discover refinement; not blocking phase thesis
- **Free intro session toggle on proposals** → future Bookings & Monetisation pass

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [x] Walk through every acceptance criterion against the running app — all `[x]` except cross-persona walkthrough explicitly deferred to demo prep per board (thesis structurally holds for any viewer)
- [x] Sweep walkthrough's "Decisions surfaced" section — three entries (Carer Identity badge, Vet sunset, Care Catalog Taxonomy phase) all reflected in home docs, all marked `[x]`
- [x] Update all affected feature docs — `explore-and-care.md`, `profiles.md`, `badges.md`, `design-system.md` updated during phase
- [x] Update Open Questions log — §4 Discover Care surface gaps cluster marked resolved with shipped-vs-deferred summary; §4 Care service taxonomy + filter cluster stays open as next phase scope
- [x] Update ROADMAP.md — Discover Refinement moved to closed; Care Catalog Taxonomy & Filter Redesign promoted to Current Phase
- [x] Review CLAUDE.md — current phase pointer updated; Discover Refinement closing summary added with role-collapse + Carer Identity + bridging + per-service pricing + Appointment pill + vet sunset + Rule B sweep
- [x] Punch list audit — P58 confirmed closed during phase (F4); P59/P60/P61/P62 added during walkthrough; P63 added at close (C4 deferred Open-to-bookings pill)
- [x] Archive this phase board — frontmatter `status: archived`, `git mv` to `docs/archive/phases/`
- [x] Strategic review — written in close conversation (kickoff-message brief)
- [x] **Structural audit** — three grep checks run at close
- [x] Check next phase scope for conflicts with what was just built — none; Care Catalog Taxonomy is a natural continuation, takes the partial filter-panel work as its starting point

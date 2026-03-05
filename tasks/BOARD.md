# Doggo — Task Board

> Format: `T-NNN · [P1/P2/P3] · area · title`
> P1 = blocks demo/correctness · P2 = important but not blocking · P3 = polish / nice-to-have
> Last audited: 2026-03-05 (updated after docs pass + styleguide additions)

---

## 🔄 In Progress

_Nothing actively in progress — pick from P1 backlog._

---

## 📋 Backlog

### Demo Readiness (P1 — do these first)

_All P1 items complete. See Done section._

---

### Explore (P2)

---

### Signup (P2)

---

### Design System (P2–P3)

**T-003 · P3 · design-system**
Sync design-tokens.md after next Figma session
Current doc accurate as of 2026-03-02. Needs re-sync whenever Figma variables are updated.

---

### Data / Trust Signals (P2–P3)

---

### Docs (P3)

_All docs tasks complete. See Done section._

---

### Styleguide (P3)

_All styleguide tasks complete. See Done section._

---

### Community Version (Parked)

_Explicitly deferred until Provider Version is validated._

**T-C01 · parked · community** — Familiar faces / seen-before indicators
**T-C02 · parked · community** — Trust ladder signals (Presence → Helper)
**T-C03 · parked · community** — Community version product principles and scope

---

## ✅ Done

**T-D01 · design-system** — Sync globals.css with Figma token values

**T-D02 · design-system** — Fix --brand-main / --brand-strong swap

**T-D03 · design-system** — Font weight token pass
All 25+ hardcoded `font-weight` values replaced with `var(--weight-*)` tokens.

**T-D04 · design-system** — Remove redundant `sans-serif` fallbacks

**T-D05 · design-system** — Fix undefined --brand-focus reference

**T-D06 · styleguide** — Rebuild Colors page with correct Figma hex values

**T-D07 · styleguide** — Rebuild Tokens page with full semantic token set

**T-D08 · styleguide** — Rebuild Typography page with actual token names

**T-D09 · styleguide** — Add responsive sg-two-col class

**T-D33 · styleguide** — Add Toggle, Segment bar, Slider to Components page (T-015)
Interactive live demos added: toggle (on/off state), segment bar single-select (dog age) + multi-select (dog sizes), slider with value box. All components sourced from existing CSS classes in `globals.css`.

**T-D34 · styleguide** — Expand component inventory in styleguide (T-016)
Inventory updated: added `AppNav`, `BottomNav`, `SignupProfilePreview` to the not-yet-previewed list. Existing entries (`FormHeader`, `FormFooter`, `CardExploreResult`, `ExploreFilterPanelDesktop/Mobile`, `ProviderHeaderState`) retained. Inventory now reflects all 14 components in `components/`.

**T-D35 · design-system** — Audit and tokenize hardcoded font-size values (T-002)
Added `--font-size-fine: 11px` and `--font-size-sub: 13px` tokens to `globals.css`. All `font-size: 11px` and `font-size: 13px` literals replaced with `var()` references. 15px/22px/28px left as literals (rare, decorative use only).

**T-D36 · docs** — Docs pass: signup flow, filename normalization, cross-links (T-014/T-021/T-022)
`prototype-decisions.md` rewritten: added full signup flow table (step sequence by role, data per step, draft→Supabase mapping), updated component inventory to reflect all 14 components, updated V1.1 backlog. `MVP Scope Boundaries.md` cross-links to prototype-decisions. `README.md` route map expanded to all signup steps; Core product docs section updated to list all 6 docs. T-021 confirmed: no stale copies, no duplicates in `/docs`.

**T-D10 · docs** — Rewrite design-tokens.md

**T-D11 · docs** — Rewrite Product Principles for two-version strategy

**T-D12 · docs** — Rewrite MVP Scope Boundaries for Provider Version

**T-D13 · signup** — Fix signup routing + step progress indicator
Pet back button role-aware. All 7 steps chain forward/back correctly. FormHeader progress bar. `lib/signupSteps.ts` utility.

**T-D14 · backend** — Supabase phase-1 foundation
Supabase clients/config (`lib/supabase/*`), provider repository with local fallback (`lib/data/providers.ts`), read endpoints (`/api/providers`, `/api/providers/[providerId]`), SQL setup files.

**T-D15 · backend** — Wire Explore/Profile reads to Supabase-backed API
Explore results and profile pages fetch via API routes. Client helpers in `lib/data/providersClient.ts`. Fallback preserved.

**T-D16 · backend** — Extend Supabase schema for profile tab content
Normalized tables: `provider_profiles`, `provider_experience_items`, `provider_pets`, `provider_service_offerings`, `provider_reviews`. Public read RLS policies. Idempotent SQL.

**T-D17 · backend** — Seed realistic provider content
Tab-ready seed data for about copy, services, reviews, experience lists, home environment, pets. Partial/empty-state coverage included. Content read path via `/api/providers/[providerId]/content`.

**T-D18 · explore** — Provider profile page — full layout + tabs
`/explore/profile/[providerId]` is complete: back row, hero composition, tab navigation (Info / Services / Reviews), all tab content (about, photos, care experience, medical, home environment, pets, services, pricing, reviews). Desktop/mobile layout detection. Loading and error states.

**T-D19 · signup** — Inline password validation on signup start page
Password field shows "Must be at least 8 characters" on blur. Confirm field shows "Passwords don't match". `InputField` extended with `error` and `onBlur` props. CSS error states added.

**T-D20 · data** — Align mock fallback data with full schema (T-004)
`fallbackContent()` in `lib/data/providerContent.ts` now returns distinct, realistic per-provider content for all 3 providers (Olga, Nikola, Jana). Each has unique about copy, photos, care experience, home environment, pets, and 2–3 reviews. Generic catch-all fallback kept for any unknown provider IDs.

**T-D21 · explore** — Provider result cards content pass (T-010)
`CardExploreResult` updated: star glyph (★) added before rating, review count shown as `(N)`, service tags row added below header (Walks / Home sitting / Boarding chips). CSS classes `.result-rating`, `.result-star`, `.result-price`, `.result-services`, `.result-service-tag`, `.result-blurb` added to `globals.css`.

**T-NAV01 · nav** — Bottom tab bar for mobile
`BottomNav` component with Explore / Calendar / Inbox / Profile tabs. Shown at < 804px. Route-aware: hides during signup, explore profile page, and explore sub-flow (service selected). Top nav (`app-nav-shell`) hidden at < 804px via CSS. `--nav-height: 0px` override at mobile so sticky positioning and height calculations remain correct.

**T-NAV03 · nav** — Subnav back → explicit exit URL
`router.back()` replaced with `router.push('/explore/results')`. Back button now always returns to the service chooser (no service param) regardless of browser history. Fixes the bug where back would land on a previously-visited provider profile or other unpredictable page.

**T-NAV02 · nav** — Mobile explore entry: service chooser as full-screen
When on mobile (< 804px) with no service selected, `/explore/results` now renders a full-screen `MobileServiceChooser` section above the bottom nav — the same service cards from the desktop left panel, but full-width. Subnav is conditionally rendered only when `filters.service` is truthy, so it doesn't appear on the initial explore landing. Icons added to all service cards (desktop + mobile) to match the Figma design.

**T-D22 · backend** — Supabase connection verified + schema/seed fixes (T-026)
`config.ts` detects placeholder keys (accepts `eyJ` and `sb_` prefixes). `schema.sql` reordered so `providers` table is created before child tables. `README.md` expanded with clear setup steps. `useMemo` dependency bug fixed in `results/page.tsx` (`[filters]` → `[providers, filters]`). Confirmed working end-to-end.

**T-D23 · ui** — UI/UX review pass (explore + signup)
Times filter wired to `filteredProviders`. Results header/subtitle dynamic by service type. "Apply Filters" → "View Results". Capitalisation unified (Walks & Check-ins, In-home Sitting). Address label unified ("Your location"). Star ★ glyph → Phosphor `Star` icon. Results skeleton loading state. T-001 closed (nav hex colors → design tokens).

**T-D24 · signup** — Signup → profile data wiring (Option A)
`lib/draftToProfile.ts` mapping utility: `bio` → `aboutBody`, `dogSizes`/`dogAges` → `careExperience[]`, `homeType`/`outdoorSpace`/`dogStayArea` → `homeEnvironment[]`, `pet` → `pets[]`, roles + availability → `services[]`. `components/signup/SignupProfilePreview.tsx` renders live draft as a tabbed profile card. Success page shows two-column layout (CTA + preview) for caregiver roles, collapses to single column on mobile.

**T-D26 · explore** — Services tab redesign + mobile full-bleed profile
Full Figma services tab implemented: flat open service blocks, rate rows with `+` pricing, weight/animal band chips, horizontal dividers. Supabase service rows enriched with local rate data by serviceType match. Mobile profile body is full-bleed: cards are 100% viewport width, square corners (no border-radius), same card border/background/gap as desktop.

**T-D32 · data** — ProviderCard type audit (T-006)
Full field-by-field audit. All 15 fields actively used — none deprecated. `ProviderRow` mapper correct for current DB schema (`available_times` intentionally absent from DB; filter logic handles `undefined` gracefully). Trust signal fields (`distanceKm`, `neighbourhoodMatch`, `mutualConnections`) intentionally client-side only for V1.

**T-D31 · data** — Trust signals on result cards + profile header (T-005)
Added `distanceKm?`, `neighbourhoodMatch?`, `mutualConnections?` to `ProviderCard` type. Mock data: Olga (0.8 km, same neighbourhood, 2 mutual), Nikola (2.3 km, 1 mutual), Jana (3.7 km, none). `CardExploreResult` shows a trust row below the blurb: MapPin icon + distance/neighbourhood label (brand-coloured when match), Users icon + mutual owner count. `ProviderHeaderState` expanded state shows the same row below ratings. CSS: `.result-trust`, `.profile-trust`, `--match` modifier classes.

**T-D30 · signup** — Inline validation on Profile + Pet steps (T-008)
Profile page: `locationTouched` state, `onBlur` on location input, "Location is required" error with `input-invalid` class and `aria-invalid`. Pet page: `nameTouched` + `sizeTouched` state; `nameError` wired to `InputField`'s `onBlur`/`error` props; `sizeError` wired to the size `<select>` manually (same pattern). Continue button remains disabled until fields are valid.

**T-D29 · explore** — Explore filter state URL params round-trip (T-012)
`parseFiltersFromQuery` / `buildQueryFromFilters` verified correct. Fixed back-nav: `CardExploreResult` now carries the full results query string into the profile URL; profile page reconstructs `backHref` from all filter params (service, minRate, maxRate, times) so pressing back restores the exact filtered results view.

**T-D28 · explore** — Empty state for explore results
`EmptyState` component: PawPrint icon, "No providers found" heading, body copy, "Clear filters" button that resets price range and times while keeping the selected service. Only shown when a service is selected and filters return zero results.

**T-D27 · explore** — Reviews tab redesign
`ReviewCard` component: circular avatar with name initial, formatted date (e.g. "March 2025"), Phosphor star icons (filled/empty), review text body. Each review renders as its own `profile-info-card`. Full-bleed on mobile.

**T-D25 · signup** — Pricing step (Option B)
`ServicePrices` interface added to `SignupDraft`. `/signup/pricing` page: shows only services the provider offers, Kč input per service, market rate hints, required before continuing. `signupSteps.ts` updated to insert `pricing` after walking/hosting. Walking → pricing → (pet/success), hosting → pricing → (pet/success). `draftToProfile.ts` uses real `draft.prices` values; `FALLBACK_PRICE` only if step was skipped.

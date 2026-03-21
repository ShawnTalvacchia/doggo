---
category: meta
status: active
last-reviewed: 2026-03-17
tags: [roadmap, phases, planning]
review-trigger: "at the start and end of every phase"
---

# Doggo — Product Roadmap

Phases for the interactive prototype. Each phase has a kanban board in `phases/`.

**Priority:** Demo-quality prototype for user testing and investment. Build horizontally — get the full product story demoable, not one feature deep.

---

## Phase 1 — Design System & Foundation ✓

**Goal:** Clean CSS foundation, documented tokens, Tailwind v4 integrated, styleguide as source of truth.

**Status:** Complete. All CSS audited, 61 dead classes removed, 409 raw values tokenized, Tailwind v4 set up, styleguide parity verified.

**Board:** [[phase-1-design-system]]

---

## Phase 2 — App Shell & Navigation ✓

**Goal:** Restructure the app so every subsequent feature has a home. New nav, new landing page, cleaned-up signup, home feed shell.

**Status:** Complete. Nav restructured (5-tab mobile + desktop links/CTAs), landing page rewritten community-first, home/meets/schedule page shells built, signup simplified (start → profile → pet → visibility → success, role step removed in Phase 6), provider steps deferred to Profile.

**Board:** [[phase-2-app-shell]]

---

## Phase 3 — Community Core ✓

**Goal:** Build the features that make Doggo a community product — meets, connections, and the trust layer.

**Status:** Complete. Meets (browse, create, detail, group chat), connections (none → familiar → pending → connected), post-meet connect prompts, home feed (nearby meets, suggested connections, highlights), schedule populated, meet group threads.

**Board:** [[phase-3-community-core]]

---

## Phase 4 — Polish & UX ✓

**Goal:** Styling consistency, responsive refinement, interaction details, visual polish. Make the prototype feel cohesive.

**Status:** Complete. Navbar simplified, modal pattern formalised, shadow softened, create meet form flattened, status page consolidated, profile page demo nav, logo link fix.

---

## Phase 5 — Care & Profile Enhancement ✓

**Goal:** Polish the existing care/booking flows and make profiles fully functional. Complete the demo story: meets → trust → care.

**Status:** Complete. Booking detail page (status flow, pricing, reviews), profile edit mode (bio, pets, visibility), unified profile layout (own + explore share structure), provider trust signals (connection badges, relationship-aware CTAs), explore interactive map (Leaflet + price markers), 1:1 direct messaging (conversation types, split inbox), enhanced pet profiles (energy, play styles, socialisation, vet info, photo gallery).

**Board:** [[phase-5-care-profile]]

---

## Phase 6 — Audit & Alignment (current)

**Goal:** Review everything built in Phases 1–5 against the updated strategy and feature docs. Identify gaps, inconsistencies, and polish opportunities. No new features — refine what exists.

**Key outcomes:**
- Audit every page against updated strategy docs and feature specs
- Home page overhaul — more welcoming, more photos, community-focused, features-forward
- Landing page review — does it communicate the community thesis clearly?
- Signup flow review — does it match current strategy (no provider role, visibility choice)?
- Visual consistency pass — do all pages feel like one product?
- Navigation review — do labels, ordering, and flows match the strategy?
- Component and token cleanup — any drift or dead code from Phases 1–5?
- Final doc update pass — ensure all docs match what's actually built

**Progress (March 2026):**
- ✅ Desktop nav: added "Offer Care" link to `/profile`
- ✅ Signup: removed Role step, flow is now `start → profile → pet → visibility → success`
- ✅ `/explore` redirect: bare route now redirects to `/explore/results`
- ✅ Home page overhaul: personalised greeting, dog photos, community-first CTAs, neighbourhood highlights
- ✅ Landing page rewrite: hero photo, photo-based meet cards, 4-step trust story (public meet → familiar → connect → private group), care section, offer care banner, testimonials, bottom CTA
- ✅ Feature docs: updated meets.md (location flexibility, public→private group progression)
- ✅ Signup docs: updated signup-reference.md (role + provider steps marked archived)
- Remaining: visual consistency pass, component/token cleanup, final doc update

**Approach:**
1. Page-by-page audit: screenshot each page, compare against feature docs, note gaps
2. Prioritise fixes by demo impact (home page is the biggest opportunity)
3. Implement fixes
4. Final doc update pass

---

## Out of Scope

Not built, not demoed:
- Real payment processing (Stripe)
- Cross-city expansion / i18n
- Mobile native app
- Real-time location / route tracking
- Algorithmic matching
- Referral programs
- Insurance / liability

---

## Principles for phasing

1. **Each phase starts and ends with a doc review.** Read all docs, update stale ones, archive completed ones, raise new questions in [[Open Questions]].
2. **Tasks reference docs.** Every task card links to the docs it should consult.
3. **No phase ships without styleguide parity.** If a phase adds components or tokens, the styleguide must be updated before the phase closes.
4. **Demo-first.** When in doubt, prioritise what makes the product story more convincing, not what's technically deepest.

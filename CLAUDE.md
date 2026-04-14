# Doggo — Project Instructions

Read this before every session. These rules override defaults.

## Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS v4 + plain CSS in `app/globals.css`. PostCSS via `@tailwindcss/postcss`
- **Fonts:** Poppins (`--font-heading`, 600) + Open Sans (`--font-body`, 400/600/700), loaded in `app/layout.tsx`
- **Icons:** `@phosphor-icons/react` (weight `"light"` preferred)
- **Backend:** Supabase (auth, database, edge functions)
- **Dev server:** `npm run dev` on port 3000

## CSS & Design System Rules

These are non-negotiable. See `docs/implementation/design-system.md` for components, patterns, and consolidation targets.

1. **Tailwind utilities first** for new code. Use token-mapped utilities. See `@theme` block in `globals.css` for all available mappings.
2. **No new simple CSS classes.** If a style is 1-3 properties, use Tailwind utilities in JSX. Only create CSS classes for complex patterns (pseudo-elements, animations, 9+ properties).
3. **Existing CSS classes are fine** — migrate incrementally, not all at once.
4. **Semantic tokens only.** Never raw hex/rgb. See `docs/implementation/design-tokens.md`.
5. **No orphan tokens.** Every CSS variable in `globals.css` must appear in the styleguide.
6. **Check `components/ui/` and `components/layout/` before building anything.** Use existing components instead of raw HTML + utility classes.

### Tailwind naming conventions
| Token | Tailwind utility | Example |
|-------|-----------------|---------|
| `--surface-*` | `bg-surface-*` | `bg-surface-base` |
| `--text-*` (colors) | `text-fg-*` | `text-fg-primary` |
| `--brand-*` | `bg-brand-*`, `text-brand-*` | `bg-brand-main` |
| `--border-*` | `border-edge-*` | `border-edge-regular` |
| `--space-*` | `p-*`, `m-*`, `gap-*` | `gap-md`, `p-xl` |
| `--radius-*` | `rounded-*` | `rounded-panel` |
| `--shadow-*` | `shadow-*` | `shadow-sm` |
| `--font-size-*` | `text-*` | `text-lg` |
| `--weight-*` | `font-*` | `font-semibold` |

## Workflow Rules

See `docs/CONTRIBUTING.md` for full details, including the phase open/close lifecycle.

1. **Work from the current phase board** in `docs/phases/`. Check it before starting.
2. **Read referenced docs** before starting a task. Update them if anything changed.
3. **Doc frontmatter:** Every doc has `status`, `last-reviewed`, `review-trigger`. Update `last-reviewed` when you touch a doc.
4. **No feature sprawl.** If it's not on the phase board, don't build it without discussion.
5. **Update feature docs** in `docs/features/` when you modify a feature.
6. **Phase close = doc review.** Update feature docs, open questions, ROADMAP, and this file. Archive the phase board. See CONTRIBUTING.md for full checklist.

## Key Docs

| Doc | What it covers |
|-----|---------------|
| `docs/ROADMAP.md` | Phase overview, current state assessment, upcoming work |
| `docs/CONTRIBUTING.md` | Workflow rules, phase lifecycle, CSS conventions |
| `docs/strategy/Product Vision.md` | Product strategy, principles, business model, nav structure |
| `docs/strategy/User Archetypes.md` | Behavioral profiles, two ramps (engagement + provider dial) |
| `docs/strategy/Trust & Connection Model.md` | Connection states, trust principles, safety & privacy |
| `docs/strategy/Groups & Care Model.md` | Group taxonomy, provider types, config model, user journeys |
| `docs/strategy/Content Visibility Model.md` | Two-gate visibility system, tagging privacy rules |
| `docs/strategy/Open Questions & Assumptions Log.md` | Unresolved strategic questions — review before each phase |
| `docs/features/` | Feature specs: meets, connections, messaging, explore-and-care, profiles, schedule, landing-page |
| `docs/implementation/design-system.md` | Components, patterns, CSS classes, consolidation targets |
| `docs/implementation/design-tokens.md` | Token reference and Figma→CSS mapping |
| `docs/implementation/mock-data-plan.md` | Mock data strategy and user journey planning |

## Current Phase: Meets Deep Pass

Deep page-by-page passes to make every surface the best it can be. See `docs/ROADMAP.md` for the full arc.

**Phase board:** `docs/phases/meets-deep-pass.md`

**Punch List:** `docs/phases/punch-list.md` — running list of UI tweaks and small fixes. Self-contained workflow instructions inside the file. Work from it in any session — read the file and follow its workflow section.

**Recently completed / paused:** Profiles Deep Pass paused 2026-04-14 — trust signals, post composer rebuild (ModalSheet), and post header attribution shipped; remaining content enrichment folded into Mock World Building. Inbox & Notifications. Profiles & Dogs. Bookings & Care Provider Flow. Page Content & Interactions. Layout Unification. 30+ prior phases.

**Upcoming phases:** Community & Groups → Discover & Care → Schedule & Bookings → Design System Maturation → Mock World Building → Cross-Cutting Flow Testing → Demo Presentation. See ROADMAP.md.

## Strategic Context

**Build the best version, not the fastest.** The goal is a world that feels real — when a tester sits down with a persona, they should forget they're looking at a prototype. Deep page-by-page passes before demo layer. Quality over speed.

**Community-first thesis.** Meets build trust → trust enables care → care is booked and tracked. The prototype demonstrates this full funnel. Full strategy in `docs/strategy/Product Vision.md`.

**Three Ways In:** Find Your Park (open groups) → Find Your People (neighbourhood/interest groups) → Find Your Help (provider-run care groups). All doors lead to the same place: a network of people who know each other and each other's dogs.

**User Journeys deck** (`docs/strategy/User Journeys.pptx`): Four personas — Tereza (routine owner/neighbourhood anchor), Daniel (anxious new owner), Klára (professional trainer), Tomáš (busy professional). Each journey demonstrates the community→trust→care funnel.

Key decisions:
- **Connection model:** None (default) → Familiar (one-sided, silent) → Pending → Connected (mutual). Post-meet review flow is the primary Familiar trigger. See `docs/strategy/Trust & Connection Model.md`.
- **Everyone starts as an owner.** No separate provider signup. Offering care is a dial, not a switch.
- **Chat on profiles.** Profiles are the relationship hub — About, Posts, Services, Chat tabs. Inbox is a connections list linking to `/profile/[userId]?tab=chat`.
- **Rolling weekly billing.** Recurring bookings use `billingCycle: "weekly"` with one upcoming session at a time.
- **Booking detail tabs.** Info / Sessions / Chat. Provider sees session check-in actions, owner sees aggregate stats.
- **Nav:** Community | Discover | My Schedule | Bookings | Profile (mobile bottom, 5 tabs). Desktop sidebar adds Inbox + Notifications (7 items). Mobile header: create + notifications + inbox.
- **Discover as hub.** Three doors: Meets, Groups, Dog Care → results with FilterPillRow + floating Filters button.
- **Groups:** Four types: Park / Neighbor / Interest / Care. See `docs/strategy/Groups & Care Model.md`.
- **Unified profiles.** All profiles use PageColumn + TabBar. Connection-gated CTAs. Provider profile route redirects to `/profile/[userId]`.
- **Content visibility.** Two-gate model: context gate + relationship gate. See `docs/strategy/Content Visibility Model.md`.

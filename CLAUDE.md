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

These are non-negotiable. See `docs/implementation/frontend-style.md` for full details.

1. **Tailwind utilities first** for new code. Use token-mapped utilities (`bg-surface-base`, `text-fg-primary`, `gap-md`, `rounded-panel`, `font-semibold`). See `@theme` block in `globals.css` for all available mappings.
2. **No new simple CSS classes.** If a style is 1-3 properties (flex, color, spacing, typography), use Tailwind utilities in JSX. Only create CSS classes for complex patterns (pseudo-elements, animations, 9+ properties).
3. **Existing CSS classes are fine** — migrate incrementally, not all at once. Old and new styles coexist.
4. **Semantic tokens still apply.** Tailwind utilities reference the same CSS custom properties. Never raw hex/rgb.
5. **No orphan tokens.** Every CSS variable in `globals.css` must appear in the styleguide. New token = styleguide entry in the same session.
6. **Component inventory:** New reusable components get an entry in `docs/implementation/component-inventory.md`.

## Component Usage Rules

**Always use existing components instead of raw HTML + utility classes.** Check `components/ui/` and `components/layout/` before building anything from scratch.

| Need | Use | NOT |
|------|-----|-----|
| Any clickable action (button, link, CTA) | `<ButtonAction>` with appropriate `variant`, `size`, `cta`, `href` props | Raw `<a>`, `<button>`, or `<Link>` with utility classes |
| Icon-only button | `<ButtonIcon>` | Raw `<button>` with an icon inside |
| Text input | `<InputField>` | Raw `<input>` with manual label/error markup |
| Checkbox | `<CheckboxRow>` | Raw `<input type="checkbox">` |
| Filter pill group | `.pill-group` + `.pill` / `.pill.active` CSS classes | Inline Tailwind pill recreations |
| Form page header | `<FormHeader>` | Manual `<h1>` + `<p>` in form pages |
| Form page footer (back/continue) | `<FormFooter>` | Manual button rows in form pages |
| Scrollable panel body | `<PanelBody>` inside raw `<div className="list-panel">` or `<div className="detail-panel">` | Old `<ListPanel>` / `<DetailPanel>` (removed) |
| Bottom spacer in panels | `<Spacer>` (last child of PanelBody) | Manual `<div>` with flex-grow |
| Padded content block | `<LayoutSection>` inside PanelBody | Manual `<div>` with inline padding |
| Edge-to-edge card list | `<LayoutList>` inside PanelBody | Manual `<div className="flex flex-col">` |

**Why:** Consistency. Raw elements bypass the design system and produce visual mismatches (wrong padding, colors, hover states, font weights). The component handles all of that.

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

See `docs/CONTRIBUTING.md` for full details.

1. **Work from the current phase board** in `docs/phases/`. Check it before starting.
2. **Read referenced docs** before starting a task. Update them if anything changed.
3. **Doc frontmatter:** Every doc has `status`, `last-reviewed`, `review-trigger`. Update `last-reviewed` when you touch a doc.
4. **No feature sprawl.** If it's not on the phase board, don't build it without discussion.
5. **Update feature docs** in `docs/features/` when you modify a feature.
6. **Flows are the source of truth for user journeys.** `docs/flows/` contains Mermaid-based flow charts for every major user flow. Reference them when planning new phases and writing tasks. When closing a phase, review all affected flows — update step statuses, flag conflicts, and note any new considerations that emerged during the work.

## Key Docs

| Doc | What it covers |
|-----|---------------|
| `docs/ROADMAP.md` | Phase overview and sequencing |
| `docs/strategy/Product Vision.md` | Product strategy, principles, business model, nav structure |
| `docs/strategy/User Archetypes.md` | Behavioral profiles, two ramps (engagement + provider dial) |
| `docs/strategy/Trust & Connection Model.md` | Connection states, trust principles, safety & privacy |
| `docs/strategy/MVP Scope Boundaries.md` | Prototype scope — required / nice-to-have / out |
| `docs/strategy/Groups Strategy.md` | Three group archetypes, user journeys, provider groups |
| `docs/strategy/Content Visibility Model.md` | Two-gate visibility system, tagging privacy rules |
| `docs/strategy/Open Questions & Assumptions Log.md` | Unresolved strategic questions |
| `docs/flows/` | User flow charts (Mermaid) with step-by-step build status |
| `docs/features/` | Feature specs: meets, connections, messaging, explore-and-care, profiles, schedule |
| `docs/implementation/frontend-style.md` | CSS conventions and rules |
| `docs/implementation/design-tokens.md` | Token reference and mapping notes |
| `docs/implementation/component-inventory.md` | Built components catalog |
| `docs/CONTRIBUTING.md` | Workflow rules, doc categories, naming conventions |

## Current Phase: 22 (complete) — Panel Architecture & Page Alignment

**Completed.** Canonical panel system built (PanelBody → LayoutSection/LayoutList → Spacer) and all pages migrated. Old ListPanel/DetailPanel removed. See `docs/phases/phase-22-panel-architecture.md`.

**Previous phases:** Phase 21 built out all page content (filters, notifications, bookings detail). Phase 20 cleaned up docs + removed dead components. Phase 19 delivered layout system + groups + feed.

**Board:** See `docs/phases/phase-22-panel-architecture.md` and `docs/ROADMAP.md`.

## Strategic Context

**Demo-first.** The highest priority is fleshing out the full product as an interactive prototype for user testing and investment. Not a production MVP — a convincing demo that tells the complete Doggo story.

**Community-first thesis.** Meets build trust → trust enables care → care is booked and tracked. The prototype demonstrates this full funnel. Full strategy in `docs/strategy/Product Vision.md`.

Key decisions:
- **Connection model:** None (default) → Familiar (one-sided) → Pending → Connected (mutual). See `docs/strategy/Trust & Connection Model.md`.
- **Everyone starts as an owner.** No separate provider signup. Offering care is a dial, not a switch.
- **Nav:** Home | Discover | My Schedule | Bookings | Profile (mobile bottom, 5 tabs). Desktop sidebar: Home, Discover, My Schedule, Bookings, Inbox, Notifications, Profile (7 items). Mobile header: create + notifications + inbox.
- **Discover as hub.** Three doors: Meets, Groups, Dog Care — not tabs.
- **Groups strategy.** Three archetypes: Park (auto-generated, open), People (user-created, defaults private), Help (provider-created, service CTAs). See `docs/strategy/Groups Strategy.md`.
- **Content visibility.** Two-gate model: context gate (group/meet membership) + relationship gate (connection state). See `docs/strategy/Content Visibility Model.md`.
- See `docs/strategy/MVP Scope Boundaries.md` for feature priorities (Required / Nice-to-have / Out).

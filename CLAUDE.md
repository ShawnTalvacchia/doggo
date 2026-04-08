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
| `docs/implementation/frontend-style.md` | CSS conventions and rules |
| `docs/implementation/design-tokens.md` | Token reference and mapping notes |
| `docs/implementation/component-inventory.md` | Built components catalog |
| `docs/implementation/mock-data-plan.md` | Mock data strategy and user journey planning |

## Current Phase: Review & Polish

User-driven review of the full prototype. Shawn walks through the app, raises issues (visual bugs, interaction problems, content gaps, UX rough edges). Issues get added to the phase board and fixed before Demo Presentation.

**Phase board:** `docs/phases/review-and-polish.md`

**Recently completed:** Content Completion (structural changes, filter wiring, content fill) → Demo Data & Richness (20 users, 24 meets, 35 posts, 13 reviews, rich conversations and group threads).

**Upcoming:** Demo Presentation (3 user personas with switching, demo entry page).

## Strategic Context

**Demo-first.** The highest priority is fleshing out the full product as an interactive prototype for user testing and investment. Not a production MVP — a convincing demo that tells the complete Doggo story.

**Community-first thesis.** Meets build trust → trust enables care → care is booked and tracked. The prototype demonstrates this full funnel. Full strategy in `docs/strategy/Product Vision.md`.

Key decisions:
- **Connection model:** None (default) → Familiar (one-sided) → Pending → Connected (mutual). See `docs/strategy/Trust & Connection Model.md`.
- **Everyone starts as an owner.** No separate provider signup. Offering care is a dial, not a switch.
- **Nav:** Community | Discover | My Schedule | Bookings | Profile (mobile bottom, 5 tabs). Desktop sidebar: Community, Discover, My Schedule, Bookings, Inbox, Notifications, Profile (7 items). Mobile header: create + notifications + inbox.
- **Discover as hub.** Three doors: Meets, Groups, Dog Care — not tabs.
- **Groups:** Four types: Park (auto-generated, open), Neighbor (hyperlocal, private), Interest (shared characteristic, open/private), Care (provider-created, service CTAs). See `docs/strategy/Groups & Care Model.md`.
- **Group detail:** No Chat tab. Feed with flat comments for async discussion. Meet-level Chat tab for real-time event coordination.
- **Meet detail:** Tabbed view — Details · People · Chat.
- **Content visibility.** Two-gate model: context gate (group/meet membership) + relationship gate (connection state). See `docs/strategy/Content Visibility Model.md`.

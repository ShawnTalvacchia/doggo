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

## Current Phase: Page Content & Interactions

Building out page content, interaction flows, and provider-focused features across the prototype. Meet page tabs, schedule card differentiation, RSVP states, create flows (meets, groups, posts), photo sharing and tagging.

**Phase board:** `docs/phases/page-content-and-interactions.md`

**Polish Log:** `docs/phases/polish-log.md` — running list of UI tweaks and small fixes, worked on alongside any active phase.

**Recently completed:** Review & Polish (feed card redesign, community filter rework, spacing tightening, scroll-to-hide rewrite, sidebar hover states, header weight unification).

**Upcoming phases:** Bookings & Care Provider Flow → Profiles & Dogs → Inbox & Notifications → Demo Presentation. See ROADMAP.md.

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

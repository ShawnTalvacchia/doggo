# Doggo — Project Instructions

Read this before every session. These rules override defaults.

## Phase Rituals — Important

**Do not use the global `/phase-open` or `/phase-close` skills in this project.** They were written for a different project (Webflow portfolio) and reference docs, folder paths, and tooling that don't exist in Doggo.

Instead:
- **Opening a phase:** Follow the Opening Checklist in `docs/CONTRIBUTING.md` → "Opening a Phase," plus the Opening Checklist on the specific phase board in `docs/phases/`.
- **Closing a phase:** Follow the Closing Checklist in `docs/CONTRIBUTING.md` → "Closing a Phase" (9 steps including the structural audit), plus the Closing Checklist on the phase board.
- **Before closing:** Show the user the checklist you're about to work through so they can catch anything missed. Phase close is a high-leverage moment — confirm before editing docs.

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
| `docs/strategy/Competitive Research - Prague Dog Care Scene.md` | Prague provider trust patterns, trust badge taxonomy, cold-start seeding strategy |
| `docs/strategy/Competitive Research - Fluv.md` | Fluv analysis, hybrid trust model question, pre-booking meet-and-greet |
| `docs/strategy/Competitive Research - Time To Pet.md` | TTP analysis, visit report cards, real-time session updates, in-session UI |
| `docs/features/` | Feature specs: meets, connections, messaging, explore-and-care, profiles, schedule, landing-page |
| `docs/implementation/design-system.md` | Components, patterns, CSS classes, consolidation targets |
| `docs/implementation/design-tokens.md` | Token reference and Figma→CSS mapping |
| `docs/implementation/mock-data-plan.md` | Mock data strategy and user journey planning |
| `docs/features/demo-mode.md` | Persona switcher (name dropdown + `/demo` + `?as=` URL param), persona registry, current limitations |

## Current Phase: Between phases

Community & Groups Deep Pass closed 2026-04-29. Meets Deep Pass and Trust & Visibility Pass closed earlier on 2026-04-29. See `docs/archive/phases/` for the records.

**Punch List:** `docs/phases/punch-list.md` — running list of UI tweaks and small fixes. Self-contained workflow instructions inside the file. Work from it in any session — read the file and follow its workflow section.

**Profiles Deep Pass:** Paused 2026-04-14. Trust signals, post composer, post attribution shipped. Remaining work folded into Mock World Building.

**Next phase recommended:** Mock World Building. Many UI patterns shipped during Community & Groups depend on richer per-persona seeded data to demonstrate well — locked-by-default ratio (P36), inbox data normalization (P35), provider-userId pattern (P4), per-persona connection rosters, deferred Community & Groups E1/E2/E4/E5 content walks. Discover & Care is also valid; choose based on whether data quality or new-surface-design takes priority.

**Upcoming:** Mock World Building → Discover & Care → Inbox & Notifications → Schedule & Bookings → Cross-Cutting Flow Testing → Demo Presentation. See ROADMAP.md.

## Strategic Context

**Build the best version, not the fastest.** The goal is a world that feels real — when a tester sits down with a persona, they should forget they're looking at a prototype. Deep page-by-page passes before demo layer. Quality over speed.

**Community-first thesis.** Meets build trust → trust enables care → care is booked and tracked. The prototype demonstrates this full funnel. Full strategy in `docs/strategy/Product Vision.md`.

**Three Ways In:** Find Your Park (open groups) → Find Your People (neighbourhood/interest groups) → Find Your Help (provider-run care groups). All doors lead to the same place: a network of people who know each other and each other's dogs.

**User Journeys deck** (`docs/strategy/User Journeys.pptx`): Four personas — Tereza (routine owner/neighbourhood anchor), Daniel (anxious new owner), Klára (professional trainer), Tomáš (busy professional). Each journey demonstrates the community→trust→care funnel.

Key decisions:
- **Connection model:** None (default) → Familiar (one-sided, silent) → Pending → Connected (mutual). Post-meet review flow is the primary Familiar trigger. **Action matrix v3 (2026-04-27):** Familiar gates Connect app-wide for locked viewers — Connect appears only after marking Familiar. Open viewers skip Familiar entirely (it's redundant). See `lib/personActions.ts` + `docs/strategy/Trust & Connection Model.md`.
- **People tab disclosure model (2026-04-29):** information is open (anyone visiting the meet sees attendees grouped by relationship state); action is gated by attendance. Same single principle on Group Members tab — group co-membership IS the action context (no past-meet attendance gate). Implementation: `viewerCanAct(meet, viewerId)` for People tab + `viewerSharedMeetWith` for cross-attendee queries. PersonRow's mark-state ladder (`+ Familiar` → `Connect` → `Connect ✓`) mirrors the post-meet review's `AttendeeActionCard` pattern with a session-scoped Undo footer.
- **Lock vs Tier (2026-04-29):** orthogonal axes. **Lock** = profile visibility (privacy axis — who can see). **Tier** = action availability on services (action axis — who can act). Independent settings that compose. Owner / Helper / Provider tiers; Open / Locked profile visibility. Helper-tier badge gated on Connected viewer (privacy rule). See `docs/features/profiles.md` → "Lock and Tier" + `docs/strategy/Groups & Care Model.md`.
- **Badges taxonomy (2026-04-29):** three categories — Tier (Helper / Provider, info-blue palette), Role (Admin / Host, contextual to surface), Trust (community-earned / credential / platform — mostly future-state). PersonRow renders ≤2 badges per row; full taxonomy lives on profiles + provider cards. See `docs/implementation/badges.md`.
- **Deniability principle.** Privacy of Familiar marks is preserved by deniability about the cause, not by absence of effect. UI surfaces never explain WHY a row was promoted (e.g. no "they marked you Familiar" tooltip). Multiple actions converge on the same UI effect — the receiver can't infer specific intent.
- **Everyone starts the same way.** No separate provider signup — and no separate owner signup either. Add a dog if you have one, offer care if you want to, or just participate. The provider role is a dial you turn up from your profile, not a separate identity.
- **Chat on profiles.** Profiles are the relationship hub — About, Posts, Services, Chat tabs. Inbox is a connections list linking to `/profile/[userId]?tab=chat`.
- **Rolling weekly billing.** Recurring bookings use `billingCycle: "weekly"` with one upcoming session at a time.
- **Meet recurrence is per-occurrence.** Recurring meets carry a `cadence` field (`one_off | weekly | biweekly | monthly`). For non–one-off meets, RSVP is always to a specific date (`Meet.attendeesByDate`), never to the series itself. Each upcoming date has its own Going + Skip controls. A series-level "Interested" toggle (data: `Meet.followers`) is the soft-commitment affordance for following without RSVPing. Read paths are centralised in `lib/meetUtils.ts` (`getMeetOccurrences`, `getOccurrenceAttendees`, `nextOccurrenceDates`). See `docs/features/meets.md` → Recurrence model.
- **Booking detail tabs.** Info / Sessions / Chat. Provider sees session check-in actions, owner sees aggregate stats.
- **Nav:** Community | Discover | My Schedule | Bookings | Profile (mobile bottom, 5 tabs). Desktop sidebar adds Inbox + Notifications (7 items). Mobile header: create + notifications + inbox.
- **Discover as hub.** Three doors: Meets, Groups, Dog Care → results with FilterPillRow + floating Filters button.
- **Groups:** Four types: Park / Neighbor / Interest / Care. See `docs/strategy/Groups & Care Model.md`.
- **Unified profiles.** All profiles use PageColumn + TabBar. Connection-gated CTAs. Provider profile route redirects to `/profile/[userId]`.
- **Content visibility.** Two-gate model: context gate + relationship gate. See `docs/strategy/Content Visibility Model.md`.
- **Persona switching for demo/testing.** Profile-page name doubles as a dropdown (demo-only affordance — wouldn't ship in real product). Tap → switch between Tereza (default) / Daniel / Klára / Tomáš / New User. Or visit `/demo` for the canonical picker. Or paste `?as=<personaId>` onto any URL to preview that page as another persona without persisting. **Shawn is NOT a viewer persona** (removed 2026-04-26 — actual developer's name shouldn't double as a demo character) but still exists in mock-world data as a Vinohrady regular other personas encounter. Product code reads `useCurrentUser()` from `@/hooks/useCurrentUser` — never hardcoded user lookups. Source of truth for the picker list: `lib/personas.ts`. See `docs/features/demo-mode.md`.

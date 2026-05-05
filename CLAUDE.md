# Doggo — Project Instructions

Read this before every session. These rules override defaults.

## Phase Rituals — Important

**Do not use the global `/phase-open` or `/phase-close` skills in this project.** They were written for a different project (Webflow portfolio) and reference docs, folder paths, and tooling that don't exist in Doggo.

Instead:
- **Opening a phase:** Follow the Opening Checklist in `docs/CONTRIBUTING.md` → "Opening a Phase," plus the Opening Checklist on the specific phase board in `docs/phases/`.
- **Closing a phase:** Follow the Closing Checklist in `docs/CONTRIBUTING.md` → "Closing a Phase" (9 steps including the structural audit), plus the Closing Checklist on the phase board.
- **Before closing:** Show the user the checklist you're about to work through so they can catch anything missed. Phase close is a high-leverage moment — confirm before editing docs.
- **Side tasks (spawned via `spawn_task`, or focused work between/alongside phases):** Follow `docs/CONTRIBUTING.md` → "Side Tasks." A side task lands as one focused PR, updates only the feature docs it touches, and does NOT modify CLAUDE.md, ROADMAP, phase boards, or the Open Questions log. Default for "should I resume a paused phase?" is **no — ask the user first.**

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

## Current Phase: None active

**Pricing & Proposals closed 2026-05-05.** Auto-pricing engine (`computeQuote(config, inquiry, today)` in `lib/pricing.ts`) takes carer config × inquiry data → quote with stacked modifier line items. ProposalForm refactored from "compose price freely" to "review system quote, confirm — or override (visibly flagged with optional reason)." Starter modifier set: holiday surcharge, weekend, multi-pet, last-minute. Engine output visible at three surfaces (InquiryForm live estimate, InquiryCard estimate, ProposalForm System quote) — same number throughout the lifecycle. Per-service pricing on Discover cards. Mutual Connected on contract sign (resolves part of Open Q §2). Decline path on inquiries. InquiryCard + BookingProposalCard collapse on response with `View booking →` link footer for accepted proposals. Phase board archived to `docs/archive/phases/pricing-and-proposals.md`.

**Next phase to open:** Sessions & Service Execution.

**Discover & Care closed 2026-05-04.** Services-as-Catalog (Care/Meet/Appointment), multi-provider Care-group hero, trust badges + connection signals on Discover, soft Familiar avatar ring (Discover-only), structured inquiry → proposal → contract flow, auto-Familiar on inquiry send (stop-gap), localStorage persistence on demo state, Bookings detail page Review & sign action. Phase board archived to `docs/archive/phases/discover-and-care.md`.

**Punch List:** `docs/phases/punch-list.md` — running list of UI tweaks and small fixes. Self-contained workflow instructions inside the file. Work from it in any session — read the file and follow its workflow section.

**Profiles Deep Pass:** Paused 2026-04-14. Trust signals, post composer, post attribution shipped. Remaining content enrichment shipped during Mock World Building.

**Upcoming:** Pricing & Proposals → Sessions & Service Execution → Inbox & Notifications → Cross-Cutting Flow Testing → Onboarding & In-Product Communication → Design System Cleanup → Demo Presentation. Reorganized 2026-05-04 around services-as-core. See ROADMAP.md.

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
- **Services as Catalog (Discover & Care 2026-05-04).** Three offering shapes via `CarerServiceConfig` discriminated union: **Care** (per-visit/night drop-off — produces Booking), **Meet** (sessions with rosters — produces RSVP on linked meet), **Appointment** (vet/grooming, solo time slot — produces Booking like Care but tied to a fixed time). Two test questions: *"Sign up to a specific time?"* (no → Care; yes → Meet/Appointment) + *"Other dogs?"* (yes → Meet; no → Appointment). See `docs/strategy/Groups & Care Model.md` → Services as Catalog.
- **Multi-provider Care groups (Discover & Care 2026-05-04).** `Group.providers: GroupProviderRef[]` replaces single `hostedBy: string`. Avatar stack with "+N" tail; tagline suppressed in multi-provider mode. Service-intersection rule (per-group surfaces only contextually-relevant services from each provider) is groundwork — full per-service location/methodology metadata deferred. See `docs/strategy/Groups & Care Model.md` → Care-group hero anatomy.
- **Trust badges MVP (Discover & Care 2026-05-04).** Six badges across three categories: community-earned (Community Regular, Trusted by Your Network, Repeat Clients) > credential (Certified Trainer, X Years Experience) > platform (Verified Identity). Priority rule for trimming. Discover cards show top 2 (compact); profile hero shows full earned set. `lib/trustBadges.ts` + `components/badges/TrustBadgeStrip.tsx`. See `docs/implementation/badges.md`.
- **Soft Familiar avatar ring is Discover-only (Discover & Care 2026-05-04).** Brand-tinted ring on the viewer's Familiar marks on Discover provider cards; neutral ring on Connected (paired hierarchy). Removed from `AttendeeAvatarStack` and other meet/group surfaces — relationship is already signaled by section grouping + labels + CTAs there. Ring solves "find the people I know in a sea of strangers"; that problem doesn't exist on grouped surfaces.
- **Inquiry → proposal → contract flow (Discover & Care G).** `InquiryFormModal` opens over Services tab, posts a structured `InquiryCard` (replaces templated text). Provider responds via `ProposalForm` → `BookingProposalCard` (three-action row: Not now / Suggest changes / Review & sign). `SigningModal` confirms; on sign, booking flips proposed → upcoming, contract message lands in thread. Counter = new proposal in same thread (single Booking record per conversation). Bookings detail page also renders Review & sign on Pending state — no need to dig through chat.
- **Auto-Familiar on inquiry send (Discover & Care 2026-05-04, stop-gap).** Sending an inquiry mutually marks both parties Familiar so the provider can see the owner's profile to write a proposal. The deniability principle for Familiar doesn't apply since inquiry is explicit + two-sided. Full inquiry-driven trust transitions model (mutual Connected on contract accept, edge cases) belongs to Inbox & Notifications phase. See `docs/strategy/Trust & Connection Model.md` → Inquiry-driven transitions.
- **Persisted demo state (Discover & Care 2026-05-04).** `usePersistedState` hook in `lib/usePersistedState.ts` mirrors `ConversationsContext`, `ConnectionsContext`, `BookingsContext` to localStorage. Storage keys: `doggo-conversations`, `doggo-connection-overrides`, `doggo-bookings`. Reset via `/demo` page or profile dropdown (existing `clearDemoLocalStorage` helper wipes all `doggo*` keys). Bridges to a future Supabase migration. Conversation IDs use `${owner}-${provider}-conv` format (collision-safe across personas — fixes a bug where Tomáš creating a Klára conversation collided with Shawn's seeded `klara-conv`).
- **Auto-priced proposals + no-bargaining principle (Pricing & Proposals 2026-05-05).** Provider configures pricing once (`CarerCareServiceConfig.modifiers: PricingModifier[]` — Holiday / Weekend / Multi-pet / Last-minute, all per-service opt-in). Auto-pricing engine (`computeQuote(config, inquiry, today)` in `lib/pricing.ts`) takes config × inquiry → `BookingPrice` with stacked line items + `triggerNote` per modifier. ProposalForm defaults to read-only "System quote" with one-tap send; "Adjust this quote" reveals editable mode flagging deviations + capturing optional reason. Override surfaces on owner's `BookingProposalCard` as a "CUSTOM QUOTE" callout. Same engine output visible at three surfaces (InquiryForm live estimate, InquiryCard estimate, ProposalForm) so both parties see the same number throughout. Decline path on inquiries with optional reason. InquiryCard + BookingProposalCard collapse on response. Mutual Connected on contract sign. See `docs/features/explore-and-care.md` → "Pricing model" + `docs/strategy/Groups & Care Model.md` → "Pricing model" subsection.
- **Side-task workflow (2026-05-05).** When work doesn't fit a phase board (between phases, alongside an active phase, or surfaced from a walkthrough): use `spawn_task` for ~30min–few-hour focused chunks, punch list for ≤30min isolated fixes, phase for multi-task design work. See `docs/CONTRIBUTING.md` → "Side Tasks." Side tasks land as one PR, update only feature docs they touch, do NOT modify CLAUDE.md / ROADMAP / phase boards / Open Questions. If a paused phase clearly fits, **ask the user — default no on resuming.**
- **Verification checklist (2026-05-05).** Phase walkthroughs verify the **phase thesis** (the structural change the phase delivered), not every edge case. Items that should work but weren't worth the phase walkthrough's time go in `docs/phases/verification-checklist.md` for pre-demo verification passes. Distinct from punch list (punch = fix, verification = check). See `docs/phases/_walkthrough-template.md` for the scope rule.

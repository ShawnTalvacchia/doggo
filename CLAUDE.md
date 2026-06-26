# Doggo — Project Instructions

Read this before every session. These rules override defaults.

## Phase Rituals

- **Opening a phase:** Follow the Opening Checklist in `docs/CONTRIBUTING.md` → "Opening a Phase," plus the Opening Checklist on the specific phase board in `docs/phases/`.
- **Walking a phase (the review stage):** After the build commits, the phase enters the **walkthrough** — a collaborative, iterative review of the walkthrough doc (`docs/phases/<name>-walkthrough.md`), done WITH the user, point by point. This is a **main chunk of the phase, not a closing step**; expect many iterations of polish before points pass. Closing only begins once the walkthrough has fully passed. See `docs/CONTRIBUTING.md` → "Walkthrough (the review stage)."
- **Closing a phase:** Follow the canonical Closing Checklist in `docs/CONTRIBUTING.md` → "Closing a Phase" — the single source of truth. The phase board carries only **phase-specific** close items (feature docs touched, outward-facing artifacts to graduate, punch-list items it closes), never a copy of the generic steps.
- **Before closing:** Show the user the checklist you're about to work through so they can catch anything missed. Phase close is a high-leverage moment — confirm before editing docs.
- **Side tasks (focused work between/alongside phases):** Follow `docs/CONTRIBUTING.md` → "Side Tasks." A side task lands as one focused PR, updates only the feature docs it touches, and does NOT modify CLAUDE.md, ROADMAP, phase boards, or the Open Questions log. Default for "should I resume a paused phase?" is **no — ask the user first.**
- **System work (meta-work on the docs/workflow itself):** Restructuring a tracker, rewriting these rules, reorganizing the doc tree, editing CLAUDE.md or the ROADMAP's structure — not a phase, not a side task. It's the **inverse of a side task**: the one mode allowed to touch the governance docs. Done with the user, between phases (not mid-walkthrough), as its own commit. See `docs/CONTRIBUTING.md` → "System Work."

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
| `docs/planning/Open Questions & Assumptions Log.md` | Unresolved questions affecting upcoming work — review before each phase. Lives in `planning/` with the other work-trackers (it's a work-tracker, not strategy itself). |
| `docs/planning/Future Considerations.md` | Long-term ideas + possible add-ons waiting for a trigger (data scale, user feedback, related work). Distinct from Open Questions (those are questions to answer; these are known-direction items waiting to land). Distinct from punch list (those are concrete fixes; these are speculative). Items graduate out — to punch list, phase board, or feature scope — when triggered. |
| `docs/strategy/research/competitive/` — start at **Competitive Research - Overview & Index.md** | Competitive research cluster (Prague landscape + Fluv / Time To Pet / Adoption-Curious teardowns); the Overview indexes each doc. Load-bearing carry-over: the **advocacy loop** — walkers surface shelter dogs to OTHER adopters (the proven 5×/14× mechanism, not self-adoption). Read the Adoption-Curious doc before any adoption-curious work. |
| `docs/strategy/research/Vets as a Credentialing Layer.md` | Parked research — vets as an institutional credentialing partner (entity-model options, tier breakdown). No current trigger. |
| `docs/strategy/Cold-Start Playbook.md` | Draft playbook (renamed + expanded from Shelter Dogs 2026-05-11) — three converging threads: paid trainer partnerships as cold-start engine, shelter dogs as always-on walking inventory, Doggo-as-credentialing-layer for an uncredentialed Prague training market. Includes 2026-05-11 market research. NOT on the roadmap; read before any phase touching cold-start, monetization, account types, or category strategy. |
| `docs/features/` | Feature specs: meets, connections, messaging, explore-and-care, profiles, schedule, landing-page |
| `docs/implementation/design-system.md` | Components, patterns, CSS classes, consolidation targets |
| `docs/implementation/design-tokens.md` | Token reference and Figma→CSS mapping |
| `docs/implementation/mock-data-plan.md` | Mock data strategy and user journey planning |
| `docs/features/demo-mode.md` | Persona switcher (name dropdown + `/demo` + `?as=` URL param), persona registry, current limitations |
| `docs/features/shelters.md` | Institutional accounts (`ShelterProfile` parallel to `UserProfile`), shelter page chrome (Feed/Dogs/Members/Gallery), walker tier model, non-owned dog handling, anti-scoreboard discipline |

## Where We Are

See `docs/ROADMAP.md` for current phase, upcoming work, and recent closes. Archived phase boards in `docs/archive/phases/`.

**Punch List:** `docs/planning/punch-list.md` — running list of UI tweaks and small fixes. Self-contained workflow instructions inside the file. Work from it in any session — read the file and follow its workflow section.

## Strategic Context

**Build the best version, not the fastest.** The goal is a world that feels real — when a tester sits down with a persona, they should forget they're looking at a prototype. Deep page-by-page passes before demo layer. Quality over speed.

**Community-first thesis.** Meets build trust → trust enables care → care is booked and tracked. The prototype demonstrates this full funnel. Full strategy in `docs/strategy/Product Vision.md`.

**Ways In:** Find Your Park (open groups) → Find Your People (neighbourhood/interest groups) → Find Your Help (provider-run care groups) → **Help a Dog** (shelter dogs; Shelter Foundation shipped 2026-06-02, Discover door at `/discover/help-a-dog` shipped 2026-06-08 with three seeded shelters, walker journey wired end-to-end 2026-06-09 — apply → invited → vouched + walk-count tier escalation, "Volunteer work" cross-shelter section on user profiles, shelter-membership sort elevation on the Discover door; **Cross-Shelter Mentor Network shipped 2026-06-12** — `mentor_session` service kind, mentor-vouched path to solo walking, layered waivers, platform Super Volunteer tier with an aggregate badge, shelter-walk Bookings on a Volunteering tab; **Adoption-Curious Journey shipped 2026-06-13** — adoption-curious explorer persona (Eliška), an explore-first `/discover/help-a-dog` doorway, a mixed group shelter walk (`Meet.shelterWalk`), the **advocacy loop** (walk-finish → "Share a moment" recap → followed-shelter feed → adoption interest, the proven ~5×/14× engine), and an adoption funnel — Adopt CTA → shelter-curated meet-and-greet → `pending` → frozen "Adopted" profile, with full owner-migration deferred; **Multi-Path Demo & Guided Walkthroughs shipped 2026-06-24 (FC17/FC18)** — a named-walkthrough registry + multi-door landing launching three single-thesis guided walkthroughs (new-owner, trainer, shelter), and the FC18 group-shelter-walk sign-up that creates a real meet-linked shelter-walk `Booking` (un-vouched = a paid mentored first walk). **Next: Phase 2 "The Shelter's Side"** — the shelter operator surface + the live-interview feasibility kit). All doors lead to the same place: a network of people who know each other and each other's dogs. See `docs/strategy/Product Vision.md`.

**User Journeys deck** (`docs/strategy/User Journeys.pptx`): Four personas — Tereza (routine owner/neighbourhood anchor), Daniel (anxious new owner), Klára (professional trainer), Tomáš (busy professional). Each journey demonstrates the community→trust→care funnel.

## Core Principles

Foundational rules that shape decisions across the app. Implementation details (data shapes, component patterns, route structures) live in their home docs — `features/`, `implementation/`, `strategy/` — and aren't enumerated here.

### Trust & Visibility

- **Connection gradient:** None → Familiar (one-sided, silent — no notification) → Pending → Connected (mutual). Post-meet review is the primary Familiar trigger. Care services gate on Connected. Locked viewers see Familiar before Connect (gradient enforced); Open viewers skip Familiar (redundant). See `docs/strategy/Trust & Connection Model.md`.
- **Deniability principle.** Privacy of Familiar marks is preserved by deniability about the cause, not by absence of effect. UI surfaces never explain WHY a row was promoted; multiple actions converge on the same UI effect so the receiver can't infer specific intent.
- **Lock + Carer audience are two orthogonal axes.** Lock = privacy (who can see the profile). Carer audience (`carerProfile.publicProfile`) = action eligibility (who can act on services — circle vs anyone). One Carer role, two settings. See `docs/features/profiles.md` → "Lock + Carer audience."
- **Three visibility paths for circle-scoped Carer offerings:** Lock (profile visibility), 1:1 Connection (Services tab gate), and **group co-membership** (private-group members see other members' circle-scoped Care via the "Care from neighbours" surface — group membership grants visibility without 1:1 Connection). See `docs/strategy/Groups & Care Model.md` → "Group co-membership as a third visibility path."
- **Two-gate content visibility:** context gate + relationship gate. Tags never expand audience. See `docs/strategy/Content Visibility Model.md`.
- **Posts and photos are the same collection.** Every Post has 1–4 photos; no separate Photos tab/route exists. Profile Posts tab + dog page Posts section both mount the shared `PostsCollectionView` (List ⇄ Grid view toggle + +Filter tag-type pills); both surface tap-targets that open `PostLightbox` via `usePostDetail().openPost()`. Highlights (`UserProfile.highlights` / `PetProfile.highlights`) is a curated layer ON TOP of the same posts, not a parallel collection. See `docs/features/profiles.md` → "Post detail surface" + "Posts tab".

### Identity & Architecture

- **Everyone starts the same way.** No separate Carer signup, no separate owner signup. Add a dog if you have one, offer care if you want to, or just participate. Carer is a dial from the profile (with a single audience-setting boolean), not a separate identity.
- **Chat lives on profiles.** Profiles are the relationship hub — About / Posts / Services / Chat tabs. Inbox is a connections list linking to `/profile/[userId]?tab=chat`.
- **Shelters are a top-level institutional entity, NOT a Group type.** `ShelterProfile` parallel to `UserProfile`. Institutional-by-default account model (shared login + shelter logo as avatar). Non-owned dogs live in `ShelterProfile.dogs[]` — containment IS the ownership signal on both sides (owned: `UserProfile.pets[]`; shelter: `ShelterProfile.dogs[]`); no `ownerId`/`shelterId` discriminator field. Route: `/shelters/[id]`. Page chrome mirrors Communities (Feed/Dogs/Members/Gallery — Meets→Dogs swap). See `docs/features/shelters.md`.

### Care & Services

- **Services as Catalog.** Four offering shapes via `CarerServiceConfig` discriminated union: **Care** (per-visit drop-off → Booking), **Meet** (sessions with rosters → RSVP), **Appointment** (solo time slot → Booking), **Mentor Session** (`mentor_session` — a Super Volunteer's paid supervised shelter first-walk toward a vouch; books via `MentorSessionBookingSheet`, lands on the Volunteering tab). Routing tests: *sign up to a specific time?* (no → Care; yes → Meet/Appointment) + *other dogs?* (yes → Meet; no → Appointment); Mentor Session is identified by context (a shelter-walking credential, not care for the owner's dog). See `docs/strategy/Groups & Care Model.md` → Services as Catalog.
- **Four-service Care taxonomy:** `walks_checkins` / `house_sitting` / `day_care` / `boarding`, with documented meanings inline next to the enum in `lib/types.ts:ServiceType` to prevent re-drift. Canonical labels in `lib/constants/services.ts`.
- **Trust badges — three categories** (community-earned > credential > platform) with priority-rule trimming. PersonRow carries at most 1 badge (Role); Profile + Carer cards carry more (trust). Carer audience signaling lives at the surface level (Discover section structure / hero status pill), NOT on PersonRow. See `docs/implementation/badges.md`.
- **No-bargaining principle.** Providers configure pricing once via `CarerCareServiceConfig.modifiers`; the auto-pricing engine (`computeQuote` in `lib/pricing.ts`) produces quotes; provider overrides surface to owners as visibly flagged "CUSTOM QUOTE." Same engine output visible at every surface (InquiryForm estimate, InquiryCard, ProposalForm) — both parties see the same number throughout.

### Visual Conventions

- **Pet-as-protagonist** on care surfaces. The dog anchors the booking detail via a compact avatar-left header (`SessionsPetHeader variant="compact"`) on both the Sessions tab and the active/live session page, so the header stays stable across Start-session and only the body changes. (The earlier full-bleed hero on the Sessions tab was retired 2026-06; the `full` variant is retained but unused. See `docs/implementation/design-system.md`.)
- **Avatar Rule B.** Circle: people, communities, shelters (every entity that has a "presence" on the platform). Rounded square (`rounded-panel`): dogs only. The square encodes the creature-of-bonding case, not "institutional." Shape encodes the entity type, not the layout role — same dog renders the same way across surfaces.
- **Care = blue, community = green, volunteer = violet.** `--status-info` / `text-info-*` (blue) = care + paid services. `--brand-*` (green) = community (meets, groups, group links). `--status-volunteer-*` (violet) = the volunteer path (shelter walking, mentor sessions). See `docs/implementation/design-system.md` → Principle 14/15.

### Workflow

- **Decide-and-flag.** During the build, make reasonable design and implementation calls and keep moving. Raise true blockers and anything that shifts phase scope or strategy. Ordinary judgment calls get MADE during the build and surfaced in the walkthrough's "Open for your call" — that section is the build-time audit trail; the reviewer ratifies or redirects there. Deciding fast + explaining the choice beats pausing for approval. "No feature sprawl" still applies: if a call would EXPAND scope, that's a scope shift and gets raised. See `docs/CONTRIBUTING.md` → "During a Phase."
- **Push back, don't just comply.** When there's a better approach than what's asked, say so and make the case — briefly. Lead with a clear recommendation, not a menu; surface alternatives only when they're genuinely worth weighing, and offer to expand rather than front-loading detail. Challenge on merit, not reflex — the goal is a better outcome, not the appearance of rigor.
- **Side-task scope.** A side task lands as one focused PR, updates only the feature docs it touches, and does NOT modify CLAUDE.md, ROADMAP, phase boards, or the Open Questions log. Default for "should I resume a paused phase?" is **no — ask the user first.** See `docs/CONTRIBUTING.md` → "Side Tasks."
- **Verification checklist scope.** Phase walkthroughs verify the **phase thesis** (the structural change the phase delivered), not every edge case. Items that should work but weren't worth the walkthrough's time go in `docs/planning/verification-checklist.md`. Distinct from punch list (fix vs check).

### Demo Affordances

- **Persona switching is a demo-only affordance.** Product code reads `useCurrentUser()` from `@/hooks/useCurrentUser` — never hardcoded user lookups. Switcher surfaces: profile-page name dropdown, the `/` launcher, `?as=<personaId>` URL param for non-persistent preview. Persona list source: `lib/personas.ts`. Not a shipping product feature. See `docs/features/demo-mode.md`.

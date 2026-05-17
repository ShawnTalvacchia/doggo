---
category: feature
status: built
last-reviewed: 2026-05-17
tags: [profile, pets, carer, edit, posts, tagging]
review-trigger: "when modifying profile pages, pet cards, posts, or carer sections"
---

# Profiles

Owner profiles, pet profiles, posts, and care provider sections — all part of one unified profile system.

---

## Overview

Every user has one profile. There is no separate "provider account" — and no separate "Carer account" either. Users who offer care have additional sections visible on the same profile (services, availability, reviews). The profile page serves double duty: it's how you manage your own identity/pets/settings, and it's how others learn about you and your dogs.

### Lock + Carer audience: two settings, one role

Two independent settings govern who can see a profile and who can act on its services. There is no third "tier" axis — that earlier framing collapsed during Discover Refinement (2026-05-10) once we accepted that "Helper" and "Provider" weren't really different roles, just two settings of the same audience configuration on a single role: **Carer**.

- **Lock (profile visibility):** controls who can **see** the profile and its content. Open = anyone; Locked = only Familiar/Connected viewers see expanded content. Privacy axis.
- **Carer audience (`carerProfile.publicProfile`):** controls who can **act** on a Carer's services — book, inquire, transact. `false` = open to your Connected circle only. `true` = open to anyone. Same Carer either way; what changes is the audience their services reach.

These compose:

| Lock × Carer audience | Visibility | Service action |
|---|---|---|
| Open + (no carer profile) | Profile visible to anyone | No services to act on |
| Open + Carer (circle) | Profile visible to anyone | Only Connected viewers can book/inquire |
| Open + Carer (anyone) | Profile visible to anyone | Anyone can book/inquire — surfaces in `/discover/care` |
| Locked + (no carer profile) | Profile gated to Familiar/Connected | No services to act on |
| Locked + Carer (circle) | Profile gated to Familiar/Connected | Connected viewers can book — within those who can see the profile |
| Locked + Carer (anyone) | Profile gated to Familiar/Connected | "Open to anyone" but only viewers who can see the profile reach the action — banner advises Open |

The dial framing in [[User Archetypes]] and [[Groups & Care Model]] maps onto this directly: dial at zero = Owner (no carerProfile); dial turned slightly = Carer with a small audience (circle); dial turned all the way = Carer open to anyone. Same person, same role, wider audience as the dial moves up.

Visual signaling of the audience setting is primarily implicit:
- **Surface implies it.** `/discover/care` only lists Carers with `publicProfile === true`. The surface itself is the public signal — no badge needed.
- **Card chrome differential.** Discover Care results split into "Carers in your circle" (softer chrome, no marketplace-style ratings) above "Other carers" (standard chrome). Audience setting is invisible to the viewer; their relationship to the Carer is what surfaces.
- **Profile hero status.** A small "Open to bookings" pill or equivalent may earn its keep on profile hero where the public-vs-circle distinction matters and the surface itself doesn't carry it. Decided per-surface during Discover Refinement.

PersonRow surfaces (Members tab, People tab) carry **no Carer-status badge** — connection grouping + section labels do the work. Trust badges (Community Regular, Trusted by Your Network, etc.) reclaim the badge real estate.

All profile pages use the **PageColumn + TabBar** pattern — the same layout as every other page in the app. No custom shell, no two-column desktop layout.

---

## Current State

- **Pages:** `/profile` (own profile, edit mode), `/profile/[userId]` (other user and provider profiles)
- **Redirects:** `/discover/profile/[providerId]` → `/profile/[userId]` (via `userId` field on ProviderCard), `/explore/profile/[providerId]` → `/profile/[userId]`
- **Components:** `PetCard` (expand/collapse), `PetEditCard`, `PostsTab`, `TagApprovalSetting`, `TabBar`, `PageColumn`, `DetailHeader`
- **Data:** `lib/mockUser.ts` (own profile + pets), `lib/mockPosts.ts` (posts), `lib/mockData.ts` (provider profiles with `userId` bridge field)
- **Status:** Built — unified PageColumn layout, edit mode, PetCard expand/collapse, connection-gated CTAs, provider services on profile

### Layout structure

**All viewports:** PageColumn → page-column-panel-body → page-column-panel-tabs → TabBar → tab content. Single column, 640px max-width, centered. Same pattern as meets, groups, bookings, schedule.

**Own profile:** PageColumn with title="Profile" (standard header). Tabs: About | Posts | Services.

**Other-user profile:** PageColumn with hideHeader + DetailHeader (back nav via abovePanel prop). Tabs: About | Posts | Services | Chat. Services only shown if user has provider data. Chat tab shown when connected or when an existing conversation exists.

**Locked profile:** No tabs. Lock icon + explanation message. No CTA buttons.

### Chat tab

The Chat tab embeds the full messaging thread directly on the profile page using `ProfileChatTab` → `ThreadClient` in embedded mode. This makes profiles the relationship hub — About, Posts, Services, Chat all in one place.

- **Shown when:** user is connected OR has an existing conversation
- **Entry points:** "Message" CTA on profile, "Book care" CTA, inbox row tap, notification tap
- **Empty state:** conversation starter with "Say hello" button
- **URL:** `/profile/[userId]?tab=chat` — deep-linkable
- **Scroll:** `page-column-panel-body--no-scroll` disables parent scroll when chat is active; thread manages its own scroll

### Own profile

- **Horizontal hero inside the About tab body** (Profiles Deep Pass 2026-05-11): avatar (200×200) on the left, name (persona dropdown trigger) + chips row + meta lines + Share Profile button stacked on the right. Stacks vertically on narrow viewports. Matches `/profile/[userId]` hero shape so own-vs-other look the same. Hero lives inside the About tab — Posts and Services no longer show it above their content. **Hero chips sit on their own row UNDER the name** (Profiles Deep Pass 2026-05-13): order is Profile visibility chip first (always present, structural fact), Carer identity chip second (conditional supplementary metadata). Both chips use the same chip chrome on hero surfaces (12px font, `px-sm py-xs`, 24px tall) for sibling-pair consistency; colors stay distinct (visibility = neutral surface, carer = info-blue). Share Profile button is `size="sm"` so it reads as light action, not competing chrome. (Previous centered hero above tabs was removed because the layout diverged from other-user profiles.)
- **Edit mode is a locked state via the AppNav page-action slot** (Profiles Deep Pass A6, 2026-05-11). About and Services tabs declare an `Edit` (outline, pencil icon) button into `PageHeaderContext.pageAction`; the same node also fills `PageColumn.headerAction` so it shows on mobile (AppNav row) and desktop (page-column-header). Tapping Edit swaps the slot to `Cancel` + `Save` and sets `navLockedIn: true` — TabBar, Bell, and Inbox hide. The user must commit or abort to leave. Auto-discard on Cancel; no confirm modal. Posts tab declares `suppressCreate: true` (no Edit verb on Posts; the AppNav Camera+ also hides because the new-post action lives in-panel — see below).
- Tab content uses `.profile-tab-stack` — sections sit on the page surface separated by thin dividers, no card-per-section nesting.
- Edit mode for bio, pets (About tab); care offering (off/circle/anyone), services, availability, carer bio (Services tab — see the **Care-offering picker** section below).
- Pet management: PetCards with expand/collapse (defaultExpanded=true on own profile). Health & vet section uses the **treatment ladder**: affirmative checks (Vaccinations / Spayed) as icon + colored text inline; conditions as body copy; vet clinic as a neutral pill (future-clickable when a vet directory wires up).
- **PetEditCard collapse-in-edit** (Profiles Deep Pass 2026-05-13). Each pet card in edit mode carries an always-visible compact summary row (48px rounded-square photo thumb + name + breed + caret toggle + Trash delete). Saved pets default collapsed; newly added pets (only in editState, not in user.pets) auto-expand so the "+ Add dog" path doesn't trap users behind an empty collapsed card. Form body (Basic info / Personality / Socialisation / Health & vet sections) renders below when expanded. Trash on the summary row so deletion is reachable from collapsed state. View-mode PetCard stays fully expanded; collapse is edit-mode-only.
- **Profile visibility + Tagging preferences are gated behind edit mode** (Profiles Deep Pass 2026-05-11). View mode renders a compact bordered summary card (icon + label + description); edit mode renders the full row picker. Visibility labels read **Private / Public** (data field stays `"locked" | "open"`, UI strings updated per Open Q §9). The Private description is Familiar-inclusive: "Only people you've marked Familiar or are Connected with can see your full profile." For Private profiles only, the "About marking people Familiar" explainer card nests inside the Profile visibility section (Familiar IS the visibility mechanism for Private profiles — the teaching belongs with the setting). Public profile owners don't see the explainer per Action matrix v3 ("Open viewers skip Familiar entirely").
- Tag approval setting: auto-approve / review first / don't allow tagging
- Care CTAs: Find Care + Offer Care / Manage Services. CTA row uses `flex flex-wrap gap-sm` + `grow basis-[140px]` per button so the pair wraps to stacked full-width on narrow viewports (`.btn` has `white-space: nowrap` so `flex-1` alone can't shrink — the basis pattern earns the row the right behavior).
- **Connections — three summary cards + View all modal** (Profiles Deep Pass 2026-05-11 / refactored 2026-05-13). In-tab summary renders one `ConnectionGroupCard` per non-empty state (Connected / Familiar / Pending) — avatar stack (cap 5 + "+N" overflow chip) on the left, label + count line on the right; non-interactive. "View all (N)" lives in the section header action slot; opens a `ModalSheet` titled "Connections · N" rendering the full uncapped list using shared meet-list primitives (`SectionHeader` from `components/people/PersonSections.tsx` + `PersonRow` variant `default`). Modal rows surface actions automatically (Connected → Message; Familiar → Connect; Pending → inline status pill) via PersonRow's default `actions="auto"` matrix. Search + filter pills deferred until rosters grow past ~50 — logged in `Future Considerations.md` FC1.
- **Posts tab:** `ShareMomentBar` 3-part inviting-affordance strip at the top of the panel (Profiles Deep Pass B5, 2026-05-11 / redesigned 2026-05-13). Self-contained `--surface-top` strip with top + bottom borders. Three parts: (1) current-user avatar (40px circle) on the left, establishing card grammar; (2) sunken pill input prompt ("Share a moment...") — primary tap target, opens `PostComposer`; (3) shortcut row of `Photo · Dog · Location · Group` light tertiary buttons. Each shortcut opens the composer with that tag picker auto-active via `PostComposerContext.openComposer({ initialTagPicker })` — Photo opens plain (composer surfaces the photo-add affordance prominently); Dog/Location/Group route to `"dog"` / `"place"` / `"community"` pickers. AppNav Camera+ is suppressed here via `suppressCreate` — the strip is the affordance. **Propagated to the community feed** (`app/home/page.tsx` feed view, between sticky tabs and feed list) — same component, same affordances. Suppressed in newUserMode where DogsNearYou leads the feed.
- **Services tab:** editable services, availability, audience toggle. **Comprehensive catalogue** — Care-type offerings (Walking, Sitting, Boarding), Meet-type offerings (Training sessions, Workshops, paid Group meets), and Appointment offerings (grooming / training visits) all live here in one list. See [[Groups & Care Model]] → Services as Catalog for the split.
  - Care-service edit rows use `Select` for service type, `ButtonIcon` for the remove action, and `InputField` with the `trailing` prop for the price unit suffix ("Kč / visit"). All inputs are design-system-aligned (Profile Deep Pass).
  - **Meet + Appointment service authoring (Service ↔ Meet Linkage 2026-05-17).** The Services edit list holds all three service kinds — Care, Meet, Appointment — in one "Services" section (cards grouped Care → Meet → Appointment). The dishonest "managed separately" footnote is gone. `MeetServiceEditCard` carries title / price-per-session / format / cadence / duration / notes + a **linked-meets picker** — search-and-add, not list-all: it shows only the *linked* meets as rows (each with an × to unlink) plus a "+ Link a meet" control that filter-searches the carer's other hosted meets. Each linked meet gets a per-link "Booking required to RSVP" toggle (persists to `Meet.linkedServices[].required`). `AppointmentServiceEditCard` carries name / price / type (grooming · training) / duration / notes — no meets picker (appointments have no roster). "+ Session offering" + "+ Appointment" add buttons sit alongside the per-Care-type buttons. Delete: a service with bookings soft-archives to a muted strip with Undo; a fresh service hard-deletes. Components: `components/profile/MeetServiceEditCard.tsx`, `AppointmentServiceEditCard.tsx`.
  - **Pricing modifiers (Pricing & Proposals 2026-05-05):** per-Care-service `PricingModifiersEditor` accordion below Notes. Default-collapsed; "N on" badge reflects enabled count. All four modifier kinds (Holiday / Weekend / Multi-pet / Last-minute) always render so providers can flip any on. Reasonable defaults so opt-in is one tap. Implementation: `components/profile/ProfileServicesTab.tsx`. View-mode card shows "From {price}" prefix when modifiers are enabled.
  - **Care-offering picker** (Profiles Deep Pass C6, 2026-05-11). One section at the top of the Services edit form with three radio-style option cards: **Not offering care** / **Connected circle only** / **Open to anyone**. Replaced the prior two-Toggle pattern ("Open to helping" + "Open to anyone") which hid the trichotomy and made the relationship between the two switches invisible. The picker derives the selected option from the underlying `openToHelping` + `carerProfile.publicProfile` booleans (off → `openToHelping = false`; circle → `openToHelping + !publicProfile`; anyone → `openToHelping + publicProfile`) so the data model is unchanged. When "Not offering" is selected, the bio / services / modifier / availability blocks below are hidden. The view-mode "Open to helping" pill that previously sat above the Carer bio is gone — the Carer Identity badge on the profile hero already carries the role + audience signal; the redundant pill went away in the same sweep. Empty-state header reworded from "Open to helping?" → "Want to offer care?". The "Open to helping" UI string is retired across the app; the `openToHelping` data field name stays as the internal boolean.
  - **Locked-provider banner** — visible on own Services tab when `profileVisibility === "locked"` AND the user has carerProfile services. Carries a wired `Make profile public` button that flips `profileVisibility: locked → open` in-memory via `onUnlockProfile` (one-tap, no confirm — the banner is the affordance, it goes away the moment unlock takes effect). (Profiles Deep Pass D6, 2026-05-11.)

### Other user profiles (`/profile/[userId]`)

- Same TabBar pattern, read-only
- Hero section: avatar, name, location, dogs summary, connection badge, trust signal badges
- Provider stats (rating, reviews) shown in hero when user has provider data
- PetCards shown collapsed (defaultExpanded=false)
- **Mutual connections section** (Profiles Deep Pass 2026-05-11). Below Dogs on the About tab: avatar stack of up to 5 + "N mutual connections" count + "View →" → opens `ModalSheet` "You both know · N" with the full list. Each row links to that user's `/profile/[id]`. Section is hidden entirely when there are zero mutuals. **Privacy:** Connected-only — Familiar marks are deliberately excluded. Surfacing Familiar would break the deniability principle (viewers must never infer who marked whom Familiar). Helper: `getMutualConnectedUserIds(viewerId, subjectId)` in `lib/mockConnections.ts`. See [[Trust & Connection Model]] → Familiar privacy.
- Posts tab shows their posts visible to you
- **Own-self redirect + hydration gate** (Profiles Deep Pass 2026-05-11 + C11 bugfix 2026-05-13). Visiting `/profile/<ownId>` while logged in as that user redirects to `/profile`. Without this the page applies the viewer-vs-subject lock gate to your own self — locked personas see "this profile is private" about their own profile. Tab param preserved when the destination tab exists on the own-profile route. **Hydration gate:** `useCurrentUser` resolves to the SSR/first-paint Tereza fallback until `localStorage` hydrates; pre-hydration `isSelf` evaluated as `tereza === userId` and falsely fired the redirect when a non-Tereza persona visited `/profile/tereza`. Fix: `isSelf` gated on `isHydrated && !isGuest && userId === currentUserId` using the new `useIsHydrated()` hook (reads `hydrated` flag on `CurrentUserContext`, flips true at end of mount-hydration `useEffect`). See [[demo-mode]] → Hydration gate for the reusable pattern.
- **Services tab** only appears if user has carerProfile, matching provider card, OR runs publishable Meet-type offerings (training sessions, workshops). Acts as the comprehensive catalogue of paid offerings — see [[Groups & Care Model]] → Services as Catalog. Tap routing differs by offering type:
  - **Care offering** (Walking / Sitting / Boarding) → request-booking flow → produces a Booking
  - **Meet offering** (Training / Workshop / paid Group session) → "see upcoming sessions" → produces a Meet attendance
- Relationship-aware CTAs (pill-shaped, full-width):
  - **Connected:** "Message [name]" + "Book care"
  - **Familiar:** "Connect with [name]"
  - **Pending:** "Request sent" (disabled)
  - **None:** "Meet [name] first" (disabled)

### Provider data resolution

Other-user profiles check multiple data sources to build provider content:
1. `getUserById(userId)` — base user data + carerProfile
2. `providers.find(p => p.userId === userId || p.id === userId)` — provider catalog data
3. `getCommunityCarers()` — community carer entries

The `userId` field on `ProviderCard` bridges between provider catalog IDs (e.g. `nikola-r`) and user registry IDs (e.g. `nikola`).

---

## Key Decisions

1. **One profile, one layout** — own and other-user profiles both use PageColumn + TabBar. No custom shells. Consistent with every other page.

2. **Providers are just users with more sections** — no separate provider profile page. The same profile gains a Services tab when a user offers care. "Dial, not a switch."

3. **Provider profile redirect** — the old `/discover/profile/[providerId]` route now redirects to `/profile/[userId]`. All links across the app (Discover cards, map popups, inbox) point directly to `/profile/[userId]`.

4. **PetCard expand/collapse** — pet cards show header (photo, name, breed, age) by default. Expanded view shows energy level, play styles, socialisation notes, health info, and photo gallery. `defaultExpanded` prop controls initial state (true on own profile, false on other profiles).

5. **Connection-gated CTAs** — pill-shaped ButtonAction components with `cta` prop. Actions gated by connection state: Message + Book Care for connected users, Connect for familiar, disabled states for pending/none.

6. **URL-based tab state** — tabs use `?tab=about` query params for persistence and deep linking.

7. **Posts are first-class** — the Posts tab shows a user's photo posts with captions, tags, and paw reactions. Posts replace the old Reviews tab as the second tab. Reviews moved into the Services tab.

8. **Profile gallery is a filtered view** — the gallery/posts visible on a profile are filtered per-viewer using the Content Visibility Model's two-gate system.

9. **Tags filtered by relationship gate** — tags on posts and photos are visibility-filtered per-viewer. A viewer only sees tags for people/dogs they have a relationship with.

10. **Tag approval is per-user** — users control how they can be tagged: auto-approve (default), review first, or don't allow.

11. **Provider setup lives in the profile** — all "Offer Care" entry points across the app route to `/profile?tab=services`.

12. **Edit-mode is a locked AppNav slot state, not in-tab chrome (Profiles Deep Pass A6, 2026-05-11).** Edit / Cancel / Save render in the AppNav nav row (mobile) + page-column-header (desktop) via `PageHeaderContext.setPageAction`. While editing, `navLockedIn` hides Bell + Inbox and the page hides its own TabBar — the user can't tab-switch or escape mid-edit. Auto-discard on Cancel; no confirm modal (prototype-grade). About and Services have independent edit lifecycles (state per-tab in `app/profile/page.tsx`); Posts is non-editing. The same slot pattern is available for any future page (booking detail, meet detail, group detail) that wants a contextual primary action + optional lock-in — see [[design-system]] Principle 10.

13. **Mutual connections on other-user profiles are Connected-only (Profiles Deep Pass, 2026-05-11).** The "Mutual connections" section below Dogs on `/profile/[userId]` surfaces only Connected mutuals. Familiar marks are deliberately excluded — surfacing them would let viewers infer who marked whom Familiar, breaking the deniability principle (see [[Trust & Connection Model]] → Familiar privacy). Connected is mutual + acknowledged so it's safe to expose. Pending is one-sided and also excluded. Hard rule, enforced in the helper docstring (`getMutualConnectedUserIds` in `lib/mockConnections.ts`).

14. **Own-profile connections: compact in-tab + Show all modal (Profiles Deep Pass, 2026-05-11).** Each connection group (Connected / Familiar / Pending) caps at 5 rows in the About-tab compact view; if any group exceeds the cap, a "Show all (N) →" button opens a `ModalSheet` with the uncapped grouped list. No dedicated `/connections` route — modal scope creep avoided for the prototype. Promote to a route if the inbox-like flow earns it.

---

## Pet Profile Fields

### Basic (all pets)

| Field | Type | Notes |
|-------|------|-------|
| Name | text | Required |
| Breed | text + search | Searchable breed list |
| Size | dropdown | Small / Medium / Large / Giant |
| Age | text | Free-form ("2 years", "8 months") |
| Health & notes | textarea | Allergies, medical conditions, etc. |
| Photo | image | Primary pet photo |

### Enhanced (optional, visible when expanded)

| Field | Type | Notes |
|-------|------|-------|
| Energy level | select | Low / Moderate / High / Very high |
| Play styles | multi-select pills | Fetch, Tug, Chase, Wrestling, Gentle, Independent, Sniffing |
| Socialisation notes | textarea | How they are with other dogs, people, kids |
| Vet info | fieldset | Clinic name, phone, last checkup, vaccinations, spayed/neutered, medications, conditions |
| Photo gallery | image array | Multiple photos beyond the primary |

---

## Posts

Added in Phase 10. Users can post photos (1-4 required) with optional captions and tags.

- **Personal posts:** visible to connections + tagged people/communities
- **Community posts:** visible to community members (posted within a community)
- **Tags:** dogs, people, communities, places — rendered as tappable pills
- **Reactions:** paw-print with count ("Paw it" / "X Paws")
- **Post composer:** accessible from profile Posts tab, home page "Add Post" CTA, and community detail pages

### Tag approval setting

Located in the About tab under "Tagging preferences":

| Setting | Behaviour |
|---------|-----------|
| Auto-approve | Tags appear immediately (default) |
| Review first | Tags need owner approval before showing |
| Don't allow | Others can't tag this user or their dogs |

---

## User Flows

### Edit own profile

```
Profile About tab → Click "Edit" on a section → Section enters edit mode
→ Modify bio, dogs, visibility, tag preferences
→ "Save" → changes persisted locally → view mode restored
```

### View another user's profile

```
Feed / meet attendees / connection list / explore results
→ Tap user → /profile/[userId] (PageColumn + DetailHeader)
→ See trust signals + connection badge + PetCards (collapsed)
→ CTA gated by connection state
```

### Create a post

```
Profile Posts tab → "New post" / Home "Add Post" CTA
→ Post composer: select photos → caption → tags → optional community
→ Post appears in feed and on profile Posts tab
```

---

## Locked Profile View (Phase 15)

When a non-Familiar, non-Connected user views a Locked profile:

- Avatar (blurred/dimmed), first name only, dog name + breed, neighbourhood
- Explanation: "[Name] has a private profile. Connect with them at a meet or community to see more."
- No action CTA — the profile owner controls who gets access
- If viewer shares a community: "You're both in [community name] — they may mark you as Familiar after a meet"

In list contexts (search results, community members, meet attendees):
- **Open** profiles show a subtle globe icon
- **Locked** profiles with no relationship get muted/collapsed treatment (shown as count, not individual cards)

### Locked provider banner

When a user adds care services while their profile is Locked, an informational banner appears on the services tab: "Your profile is private — only people you've marked as Familiar or Connected with can see your services. Want to make your profile public?"

### Default avatar

Users with no photo get an initials-based avatar on a coloured background (colour derived from user ID for consistency). Component: `components/ui/DefaultAvatar.tsx`.

---

## Future

- **Care history section** — past bookings (as owner and as carer) visible on profile
- **Profile completeness indicator** — gentle nudge to fill out enhanced pet fields (deferred from Profiles & Dogs phase)
- **Empty state design** — what does a sparse profile look like? (deferred from Profiles & Dogs phase)
- **Video posts** — deferred from Phase 10 due to hosting complexity
- **Comments on posts** — future phase, currently reactions only
- **Personal post audience controls** — currently connections + tagged communities, no custom audience picker

---

## Related Docs

- [[Trust & Connection Model]] — how trust signals display on profiles
- [[Content Visibility Model]] — two-gate system that controls what content is visible per-viewer on profiles
- [[connections]] — connection states that determine what's visible
- [[explore-and-care]] — provider profiles in the care discovery flow
- [[phase-10-home-feed]] — posts, tagging, and paw reactions
- [[phase-11-booking-care-polish]] — connection gating, provider setup consolidation
- `docs/implementation/design-system.md` — components, patterns, CSS classes

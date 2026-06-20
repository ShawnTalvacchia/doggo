---
category: feature
status: built
last-reviewed: 2026-06-16
tags: [profile, pets, carer, edit, posts, tagging, photos, volunteer]
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
- **Components:** `PetSummaryCard` (photo-led tile linking to `/dogs/[id]`), `PetEditCard` (renders inside `/dogs/[id]` edit mode), `PostsTab`, `TagApprovalSetting`, `TabBar`, `PageColumn`, `DetailHeader`. `PetCard` (the older expand/collapse component) is retained but no longer mounted on profile surfaces — pending deletion in a follow-up cleanup pass.
- **Data:** `lib/mockUser.ts` (own profile + pets), `lib/mockPosts.ts` (posts), `lib/mockData.ts` (provider profiles with `userId` bridge field)
- **Status:** Built — unified PageColumn layout, edit mode, photo-led PetSummaryCard grid (Dog Profile phase 2026-06-03), connection-gated CTAs, provider services on profile

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
- **Pet management** (Dog Profile phase 2026-06-03 — Workstream G). Dogs render as a photo-led `PetSummaryCard` grid (2-up desktop, 1-up mobile) — large square photo top, name + breed/sex/age/weight meta below. Tap → `/dogs/[id]` (the canonical dog profile). No inline expand on profile surfaces. Edit mode on `/profile` mutes the cards (no click, 0.6 opacity) and shows a helper line: **"Edit a dog's details from its profile."** The Add dog button stays in the section header → creates a blank pet and routes to `/dogs/[newId]?edit=1` for fill-in. Single source of truth for dog presentation across `/profile`, `/profile/[userId]`, shelter Dogs tab, and `/dogs/[id]` — visual parity via the shared `.shelter-dog-card-*` CSS family.
- **Dog editing lives on `/dogs/[id]`** (Workstream G). The owner sees an Edit button in the page-action slot when viewing their own dog; tapping it locks the nav (Cancel + Save chrome) and renders `PetEditCard` as the body. The same vaccine inputs, personality tag picker, preference editor, and Health & vet section that previously lived inline on `/profile` now live here. Delete (Trash in PetEditCard's summary row) routes back to `/profile`. PROTOTYPE NOTE: Save currently exits edit without persisting app-wide — matches the rest of the prototype's stub mutation pattern; real persistence wires up when a user-state context lands.
- **Profile visibility + Tagging preferences are gated behind edit mode** (Profiles Deep Pass 2026-05-11). View mode renders a compact bordered summary card (icon + label + description); edit mode renders the full row picker. Visibility labels read **Private / Public** (data field stays `"locked" | "open"`, UI strings updated per Open Q §9). The Private description is Familiar-inclusive: "Only people you've marked Familiar or are Connected with can see your full profile." For Private profiles only, the "About marking people Familiar" explainer card nests inside the Profile visibility section (Familiar IS the visibility mechanism for Private profiles — the teaching belongs with the setting). Public profile owners don't see the explainer per Action matrix v3 ("Open viewers skip Familiar entirely").
- Tag approval setting: auto-approve / review first / don't allow tagging
- Care CTAs: Find Care + Offer Care / Manage Services. CTA row uses `flex flex-wrap gap-sm` + `grow basis-[140px]` per button so the pair wraps to stacked full-width on narrow viewports (`.btn` has `white-space: nowrap` so `flex-1` alone can't shrink — the basis pattern earns the row the right behavior).
- **Connections — three summary cards + View all modal** (Profiles Deep Pass 2026-05-11 / refactored 2026-05-13). In-tab summary renders one `ConnectionGroupCard` per non-empty state (Connected / Familiar / Pending) — avatar stack (cap 5 + "+N" overflow chip) on the left, label + count line on the right; non-interactive. "View all (N)" lives in the section header action slot; opens a `ModalSheet` titled "Connections · N" rendering the full uncapped list using shared meet-list primitives (`SectionHeader` from `components/people/PersonSections.tsx` + `PersonRow` variant `default`). Modal rows surface actions automatically (Connected → Message; Familiar → Connect; Pending → inline status pill) via PersonRow's default `actions="auto"` matrix. Search + filter pills deferred until rosters grow past ~50 — logged in `Future Considerations.md` FC1.
- **Posts tab** (Photos & Galleries 2026-06-04). Two contained sections — **Highlights** + **Posts** — both using `.dog-profile-section` chrome so the layout mirrors `/dogs/[id]` exactly. ShareMomentBar retired from the panel; the "Post" button moved to the page-action slot (outline + CameraPlus icon, registered via `setPageAction` — same pattern as Communities). AppNav Camera+ stays suppressed via `suppressCreate: true`. The community-feed surface (`app/home/page.tsx`) still uses ShareMomentBar.
  - **Highlights strip** — owner-curated photos (`UserProfile.highlights: string[]`) above the Posts collection. New field 2026-06-04, parallel to `PetProfile.highlights`. Renders nothing when empty; tappable thumbnails resolve to source posts via global `mockPosts` scan and open the lightbox (see Post detail surface below). Edit pencil opens the reorder/unpin modal. Add via the per-post kebab — "Pin to your Highlights" — same as for dog Highlights.
  - **PostsCollectionView** (`components/posts/PostsCollectionView.tsx`) carries List ⇄ Grid view toggle + tag-type filter pills. List = chronological MomentCards (unchanged from prior surface); Grid = first-photo tiles, tap → opens the parent post in the lightbox with the visible-posts collection for cross-post nav.
  - **+Filter pattern** for the filter pills. Default state shows just a dashed-border `+ Filter ▾` button on the top row alongside the view toggle (right-aligned). Tap → menu of available types (Dog / Person / Place / Community / Meet — `shelter` excluded as reserved infrastructure). Pick a type → `pendingType` set → that type's pill renders in `defaultOpen` mode → user lands in the values picker. Multi-select via checkbox rows; multiple types AND together; multiple values within a type OR together. Active filter pills wrap to a SECOND row below; top row stays anchored regardless of how many filters are active. Filter dropdown options reveal only contexts the viewer can see (Content Visibility Model line 166). URL: `?view=grid&f_dog=bella,franta&f_community=group-1`.
  - **Visibility filter** — `isPostVisibleTo` is applied to every post BEFORE filter dropdowns render, so dropdown options, view counts, and both view modes all read from the gated set.
  - The same PostsCollectionView mounts on `/dogs/[id]` for the dog's Posts section, scoped to dog-tagged posts instead of by-author. Single source of truth across the two surfaces.
- **Services tab:** editable services, availability, audience toggle. **Comprehensive catalogue** — Care-type offerings (Walking, Sitting, Boarding), Meet-type offerings (Training sessions, Workshops, paid Group meets), and Appointment offerings (grooming / training visits) all live here in one list. See [[Groups & Care Model]] → Services as Catalog for the split.
  - Care-service edit rows use `Select` for service type, `ButtonIcon` for the remove action, and `InputField` with the `trailing` prop for the price unit suffix ("Kč / visit"). All inputs are design-system-aligned (Profile Deep Pass).
  - **Meet + Appointment service authoring (Service ↔ Meet Linkage 2026-05-17).** The Services edit list holds all three service kinds — Care, Meet, Appointment — in one "Services" section (cards grouped Care → Meet → Appointment). The dishonest "managed separately" footnote is gone. `MeetServiceEditCard` carries title / price-per-session / format / cadence / duration / notes + a **linked-meets picker** — search-and-add, not list-all: it shows only the *linked* meets as rows (each with an × to unlink) plus a "+ Link a meet" control that filter-searches the carer's other hosted meets. Each linked meet gets a per-link "Booking required to RSVP" toggle (persists to `Meet.linkedServices[].required`). `AppointmentServiceEditCard` carries name / **Description** / type (grooming · training) / duration / **meeting-location options** (`appointmentLocations` — curated priced tuples via `PricedToggleRow`; flat price hidden when options are set) — no meets picker (appointments have no roster). The earlier Type + Training-focus + Notes trio collapsed to a single Description (reuses `notes`); the `trainingType` enum retired (Service Options & Booking Clarity 2026-06-16 — Type kept for Discover findability). "+ Session offering" + "+ Appointment" add buttons sit alongside the per-Care-type buttons. Delete: a service with bookings soft-archives to a muted strip with Undo; a fresh service hard-deletes. Components: `components/profile/MeetServiceEditCard.tsx`, `AppointmentServiceEditCard.tsx`.
  - **Pricing modifiers (Pricing & Proposals 2026-05-05):** per-Care-service `PricingModifiersEditor` accordion below Notes. Default-collapsed; "N on" badge reflects enabled count. All four modifier kinds (Holiday / Weekend / Multi-pet / Last-minute) always render so providers can flip any on. Reasonable defaults so opt-in is one tap. Implementation: `components/profile/ProfileServicesTab.tsx`. View-mode card shows "From {price}" prefix when modifiers are enabled.
  - **Care-offering picker** (Profiles Deep Pass C6, 2026-05-11). One section at the top of the Services edit form with three radio-style option cards: **Not offering care** / **Connected circle only** / **Open to anyone**. Replaced the prior two-Toggle pattern ("Open to helping" + "Open to anyone") which hid the trichotomy and made the relationship between the two switches invisible. The picker derives the selected option from the underlying `openToHelping` + `carerProfile.publicProfile` booleans (off → `openToHelping = false`; circle → `openToHelping + !publicProfile`; anyone → `openToHelping + publicProfile`) so the data model is unchanged. When "Not offering" is selected, the bio / services / modifier / availability blocks below are hidden. The view-mode "Open to helping" pill that previously sat above the Carer bio is gone — the Carer Identity badge on the profile hero already carries the role + audience signal; the redundant pill went away in the same sweep. Empty-state header reworded from "Open to helping?" → "Want to offer care?". The "Open to helping" UI string is retired across the app; the `openToHelping` data field name stays as the internal boolean.
  - **Locked-provider banner** — visible on own Services tab when `profileVisibility === "locked"` AND the user has carerProfile services. Carries a wired `Make profile public` button that flips `profileVisibility: locked → open` in-memory via `onUnlockProfile` (one-tap, no confirm — the banner is the affordance, it goes away the moment unlock takes effect). (Profiles Deep Pass D6, 2026-05-11.)

### Other user profiles (`/profile/[userId]`)

- Same TabBar pattern, read-only
- Hero section: avatar, name, location, dogs summary, connection badge, trust signal badges
- Provider stats (rating, reviews) shown in hero when user has provider data
- Dogs render as `PetSummaryCard` grid (Workstream G, 2026-06-03) — same photo-led tiles as own-profile; tap → `/dogs/[id]` honoring the visibility gate there.
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

4. **Photo-led PetSummaryCard tiles + dog editing on `/dogs/[id]`** (Dog Profile phase 2026-06-03 — Workstream G). Dogs render as a 2-up grid of photo-led summary tiles on profile surfaces; tap routes to the canonical `/dogs/[id]` profile. No inline expand. Owner editing lives on the dog page (Edit button in the page-action slot → locks the nav → PetEditCard form). The earlier expandable PetCard pattern was retired because it duplicated content the dog profile now shows in richer form.

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

15. **Volunteer standing — aggregate badge + per-shelter breakdown (credentialing-moat 2026-06-09; restructured Mentor Network 2026-06-12, Decision #16).** Renders in TWO places. (1) An **aggregate badge in About**, directly under the carer aggregate: `Super Volunteer · N walks` (Tree icon, tier-3) or `Volunteer · N walks` (tier-1), where N is the sum of walks across all shelters — the volunteer parallel to `Trusted Carer · N sessions`. Renders for any volunteer, carer or not (the About badges block is ungated from `carerProfile`). This deliberately reverses the earlier "no walk-count totals" call. (2) The **"Volunteer work" section** (between Carer info and dogs): one row per shelter affiliation — tier pill (label only — `Volunteer` for T1/T2, `Super Volunteer` for T3) + right-side context (`at {Shelter} · N walks`); multi-shelter walkers stack rows; header is plain "Volunteer work" (its former Super Volunteer pill + "recognized at every shelter" subline moved up to the aggregate). Data: `getUserShelterAffiliations(userId, dynamicVouched, tierOverrides)` + `getPlatformVolunteerTier`. Full treatment: [[features/shelters]] → "Volunteer work on user profiles" + [[badges]].

16. **Carer Portfolio aggregate badge leads the TrustBadgeStrip (credentialing-moat phase, 2026-06-09).** Profile hero now leads the trust strip with the Carer Portfolio aggregate pill when earned (priority 0). Three tiers via the shared credential-pill family — `Carer` T1 / `Carer` T2 / `Trusted Carer` T3, family color blue (info), Sparkle icon. The pill renders as the LEAD chip in the strip, supporting trust badges follow as smaller pills. Session count lives in the consuming surface's subtitle line, NOT inside the pill. Privacy gate (C1): circle-Carers (`publicProfile: false`) hide the aggregate from non-Connected viewers. Self always sees own badge.

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
| Exercise needs | text | `PetProfile.exerciseNeeds?: string` — the *prescription* (distinct from `energyLevel` the level): "Two long walks a day; loves to run off-leash." Care-handling info; renders as an "Exercise" row in the standing-preferences section. Service Options & Booking Clarity, 2026-06-16. |
| Microchip number | text | `PetProfile.microchipNumber?: string` — quiet identity line under the Health section. Especially relevant for shelter dogs (chipped on intake). Same phase. |
| Play styles | multi-select pills | Fetch, Tug, Chase, Wrestling, Gentle, Independent, Sniffing |
| Personality tags | multi-select pills | Typed `PersonalityTag` vocabulary — see [[features/shelters]] → "Dog profile tag taxonomy." |
| Socialisation notes | textarea | How they are with other dogs, people, kids |
| Standing preferences | fieldset | Four chip groups — Likes / Dislikes / Triggers / Play preferences *(see below)* |
| Vet info | fieldset | Clinic name, phone, last checkup, vaccinations *(structured — see below)*, spayed/neutered, medications, conditions |
| Highlights | image array | **Highlights** — owner-curated pinned photos surfaced above the auto-album on `/dogs/[id]`. Field is `PetProfile.highlights: string[]` (renamed from `photoGallery` 2026-06-04 for symmetry with `UserProfile.highlights`). Pin via the per-post kebab → "Pin to {Dog}'s Highlights" (universal — any viewer can pin photos from any author's post, since Highlights is about the curator's surfaces, not authorship). Reorder/unpin via Edit Highlights modal. Tapping a thumbnail opens the lightbox in "Highlights mode" — carousel scopes to the highlights themselves (URL resolved globally so cross-author entries work), within-post nav hidden (each highlight is a single curated photo). |

### Standing preferences (2026-06-02)

Pet-level standing preferences authored once by the owner and visible to anyone who can see the dog profile (and explicitly to carers on the booking detail Info tab). Eliminates the "tell every new carer what they need to know" tax. Per Roman's PO interview (2026-06-02).

Shape: `PetProfile.preferences?: { likes?: string[]; dislikes?: string[]; triggers?: string[]; playPreferences?: string[] }`. Each sub-field is a list of short chips. V1 is free-text; a controlled vocabulary is out of scope until usage signals a need.

**Per-booking overrides are deferred** — solo-today, longer-today, "she's been off-food this week" style notes belong to the third-comms-surface decision. See [[features/explore-and-care]] → "Key Decision #8." Standing preferences are the per-pet baseline; the booking-level layer rides on top.

Read surfaces: `app/dogs/[id]/page.tsx` `DogPreferencesSection` (dog profile), booking detail Info tab via the existing pet-info surface. (As of Workstream G the `PetCard` profile surface no longer renders preferences — profile dogs are summary tiles linking to the dog page.) **`DogPreferencesSection` also renders an "Exercise" row from `exerciseNeeds`** (Service Options & Booking Clarity, 2026-06-16). For **shelter-managed dogs only**, when the section is empty it shows a neutral **"No care notes yet."** instead of hiding (owned dogs hide); copy stays neutral because every viewer sees it — the staff "add notes" prompt belongs in the operator view (FC16).

### Vaccines V1 (2026-06-02)

`VetInfo.vaccinations: VaccinationRecord[]` replaces the legacy `vaccinationsUpToDate: boolean`. Owner self-declared with a single per-dog acknowledgement timestamp (`vaccinationsAcknowledgedAt`). No platform gating, no verification — verification belongs to V2 ([[planning/Open Questions §15]] + [[planning/Open Questions §16]] — Vets as a Credentialing Layer).

| Sub-field | Type | Notes |
|-----------|------|-------|
| `vaccinations[].type` | enum | `rabies \| parvovirus \| distemper \| hepatitis \| parainfluenza` — the five standard Czech canine vaccines per PO interviews. Rabies is legally mandatory; V1 treats all five uniformly. |
| `vaccinations[].lastGivenAt` | ISO YYYY-MM-DD | When the dose was administered. |
| `vaccinations[].confidence` | enum | `"self-declared"` in V1. V2 adds `"photo-confirmed"` and `"vet-confirmed"`. |
| `vaccinationsAcknowledgedAt` | ISO YYYY-MM-DD | Single per-dog confirmation — "I confirm {Dog}'s vaccination record is accurate as of today." Per-dog, not per-vaccine. |
| `vaccinationsUpToDate` | boolean *(deprecated)* | Bridged for one phase via `isVaccinationsCurrent` in `lib/petUtils.ts`; slated for removal at Dog Profile phase close. |

Read surface: `app/dogs/[id]/page.tsx` `DogHealthSection` (Syringe-prefixed chips + acknowledgement caption). Edit surface: `PetEditCard` Health & vet section rendered inside `/dogs/[id]` edit mode (per-vaccine date input + per-dog confirmation checkbox). Helper: `lib/petUtils.ts:isVaccinationsCurrent(vet, today)`. As of Workstream G the `PetCard` profile surface no longer renders vaccines — profile dogs are summary tiles linking to the dog page. **`DogHealthSection` also surfaces `spayedNeutered` + `vetInfo.conditions` + a quiet `microchipNumber` line** (Service Options & Booking Clarity, 2026-06-16 — these previously rendered only on `PetCard`); `PetEditCard` Health & vet gains a Microchip number field, and the preferences area gains an Exercise needs field.

---

## Posts

Added in Phase 10. Users can post photos (1-4 required) with optional captions and tags.

- **Personal posts:** visible to connections + tagged people/communities
- **Community posts:** visible to community members (posted within a community)
- **Tags:** dogs, people, communities, places — rendered as tappable pills
- **Reactions:** paw-print with count ("Paw it" / "X Paws")
- **Post composer:** accessible from profile Posts tab header action ("Post" button — mirrors Communities pattern; Photos & Galleries 2026-06-04 retired the in-panel ShareMomentBar), home page "Add Post" CTA, and community detail pages. Accepts an optional `initialTags` (Adoption-Curious Journey, 2026-06-12) so a caller can open it **pre-tagged** — the shelter walk-finish "Share a moment" prompt opens it pre-tagged to the dog + shelter. No persistence change (composer still doesn't persist, FC13); the recap that *surfaces* in the demo is pre-seeded.

### Post detail surface — PostLightbox (Photos & Galleries 2026-06-04)

Doggo has no `/posts/[id]` route by design — comments aren't a primary platform thread, so a modal-scoped lightbox is sufficient and keeps "tap → see → close" consistent across surfaces.

`PostLightbox` (`components/posts/PostLightbox.tsx`) is opened via the global `usePostDetail().openPost(postId, opts)` context. Photo-led layout: dark backdrop overlay, photo dominant on the left (~60% desktop width) with the post sidebar on the right (author + caption + tag pills + reactions + comments + the `PostKebabMenu` in the header). On mobile (≤768px): photo + sidebar stack vertically (photo 55dvh top, sidebar flows below); the whole overlay scrolls as a document; close × pins via `position: fixed` so it remains reachable after scrolling. Touch swipe ←/→ on the photo area triggers cross-post nav (with edge-attached chevron hints as a discoverability cue).

`openPost` accepts:
- `collection?: Post[]` — when present, ←/→ keys and on-screen prev/next traverse the collection. Photo-area-anchored cross-post arrows. Esc closes.
- `photoIndex?: number` — open at a specific photo within a multi-photo post (e.g., user clicked photo #3 in a list-view post's photo grid).
- `photoIndices?: number[]` — parallel to `collection`. When provided, each cross-post navigation step seeds the new post's photo from this array (not always 0). Used by Highlights so each curated entry lands on its specific photo.
- `withinPostNav?: boolean` (default true) — when false, hides the small `< >` + "N/M" counter on the photo. Used by Highlights, where each entry is a single curated photo, not a way to browse the post's other photos.

`PhotoGrid` tiles (auto-album / Posts-tab grid) and `PostPhotoGrid` photos inside feed list cards both open the lightbox via `openPost(postId, { collection: filteredPosts, photoIndex })`. Tag-pending notification rows open without a collection.

FC14 logs the Instagram-style drag-over-photo bottom sheet as eventual mobile polish.

### Per-post kebab menu — PostKebabMenu (Photos & Galleries 2026-06-04)

Top-right of every post card, in the lightbox sidebar header, and on every album/grid tile. Floating popover (`.dropdown-menu` pattern), click-outside to close. Three layers of items:

**Curation actions** — available regardless of authorship. Highlights and the per-dog album are about the VIEWER's surfaces, not about who took the photo:
- **Pin / Unpin to Highlights** — destination is context-aware via `usePathname()`. On `/dogs/[id]` for a viewer-owned dog → that dog's Highlights. Anywhere else (feed, owner profile) → the viewer's own Highlights. Single state-toggling row.
- **Hide / Show in album** — only renders when in a dog-page context for an owned dog. Adds the post to a per-dog hide list that the auto-album filters out.

**Author-only** — Edit post, Delete post. Both stubs (Photos & Galleries D1 didn't ship the editable-post store; clicking the row pops a toast via `useStubNotice()` naming FC13 as the trigger).

**Non-author-only** — Untag {Dog} (per owned dog the post tags), Report, Block {Author}. Untag is REAL (records suppression via `useUntagStore`; the dog's auto-album filters that post out for the owner). Report/Block are stubs pointing at the moderation backend.

`AlbumTileLongPressMenu` was the prior approach; retired 2026-06-04 because long-press read as finicky and forked the action surface from the post card's kebab. The kebab is now the single unified action surface.

### Posts tab — List ⇄ Grid views + multi-select filters (Photos & Galleries 2026-06-04)

The Posts tab body has two contained sections: **Highlights** strip (above) and **Posts** collection (below). Both use `.dog-profile-section` chrome so the layout mirrors the dog page exactly.

The Posts section carries a section-header icon-pair toggle (`List` / `Grid`). Grid renders each post as its first-photo tile, tap → opens the parent post in the lightbox with the visible-posts collection. Default = list.

**Filter row — `+ Filter` pattern.** Top row anchors `+ Filter ▾` (dashed-border chip) left + view toggle right. Tap +Filter → menu of available types (Dog / Person / Place / Community / Meet — `shelter` excluded). Pick a type → its TagFilterPill mounts in `defaultOpen` mode → user lands directly in the values picker. Active pills wrap to a SECOND row below; top row stays stable regardless of how many filters are active. Pill + toggle matched to 32px height.

Multi-select: tick multiple values in one type's menu to widen (OR within type). Add filters across types to narrow (AND across types). Tap an active pill to re-open its values picker; tap × to clear that filter. Each pill renders only its viewer-visible options (Content Visibility Model line 166 — never leak group/value existence).

URL state: `?view=grid` for the toggle, `?f_<type>=<id,id,...>` per active filter. Both default to no-param.

Visibility filtering: `isPostVisibleTo` is applied to every post BEFORE the dropdown lists, the filter pills, or either view render. Pre-Photos & Galleries, the Posts surface showed `getPostsByUser` unfiltered; that visibility leak is now closed.

**Forward direction (Open Q §12 — V2+):** "Albums" become saved filter compositions. The pill-dropdown multi-select shape IS the foundation; an Album = "this filter state, saved with a name." Auto-link from contextual surfaces ("View posts from this booking") then becomes a pre-filled album. Highlights becomes one album in a dropdown switcher next to the strip header. Not built in this phase.

### Tag approval setting

Located in the About tab under "Tagging preferences":

| Setting | Behaviour |
|---------|-----------|
| Auto-approve | Tags appear immediately (default) |
| Review first | Tags need owner approval before showing |
| Don't allow | Others can't tag this user or their dogs |

When the owner is in **Review first** mode, pending tags surface on `/notifications` as `tag_pending` rows with inline **Approve / Reject** buttons — same surface affinity as `connection_request`. Decisions persist per viewer via `usePendingTagsStore`; resolved notifications filter out of the list at render time so already-decided tags don't reappear on reload. Matches the standard pattern across Instagram / Twitter / Facebook tag review flows.

**Default rule** (Photos & Galleries 2026-06-04 model): every dog-tag-on-owned-dog pair resolves to approved unless explicitly listed in `DEMO_PENDING_TAGS` (in `lib/usePendingTagsStore.ts`). Pre-existing tags are grandfathered to avoid forcing review-mode users to wade through historical content; only the explicit carve-out (and, in production, newly-arriving tags) routes through the queue. Pending stays pending forever — no aging-out, no auto-approval from inaction. Decisions the owner explicitly makes override the default.

Demo curation is a one-line edit to the constant — add/remove `(postId, dogId)` pairs to control what surfaces in the queue (and pair the carve-out with a `tag_pending` entry in `lib/mockNotifications.ts` so the notification row appears).

Pending or rejected tags are excluded from the dog's auto-album on `/dogs/[id]` when the owner is in approve mode.

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

## Locked Profile View

When a non-Familiar, non-Connected user views a Locked profile on `/profile/[userId]`:

- Avatar (blurred/dimmed), first name only, dog name + breed, neighbourhood
- **Lock card** — full-width inset-fill card with bold title + lighter subtitle + Learn link (Dog Profile phase 2026-06-03 refactor; was a single paragraph before):
  - Title: **"{firstName}'s profile is private"** (text-base, font-semibold, fg-primary)
  - Subtitle: "People typically see more after meeting at a walk or community." (text-sm, fg-secondary)
  - **"Learn how privacy works"** link → `/help/privacy`
- If viewer shares a community: contextual SharedContextCard surfaces the shared groups + meets above the lock card (deniability-safe — surfaces context that's already public)

In list contexts (search results, community members, meet attendees):
- **Open** profiles show a subtle globe icon
- **Locked** profiles with no relationship get muted/collapsed treatment (shown as count, not individual cards)

### Locked dog profile

Same title + subtitle pattern on `/dogs/[id]` when the owner is locked and the viewer can't see them (Dog Profile phase, 2026-06-03). Empty state carries:
- Lock icon
- Title: **"{Dog}'s profile is private"**
- Subtitle: **"Connect with {firstName} at a meet to see {Dog}'s profile."**
- **"View {firstName}'s profile"** action button → `/profile/{ownerId}` (the connection path: the dog's lock derives from the owner's lock, so meeting the owner is the only path through). Owner profile honors its own lock when visited — no additional privacy leak vs. a meet-attendee row.

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

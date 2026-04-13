---
category: feature
status: built
last-reviewed: 2026-04-13
tags: [profile, pets, provider, edit, posts, tagging]
review-trigger: "when modifying profile pages, pet cards, posts, or provider sections"
---

# Profiles

Owner profiles, pet profiles, posts, and care provider sections — all part of one unified profile system.

---

## Overview

Every user has one profile. There is no separate "provider account." Users who offer care have additional sections visible on the same profile (services, availability, reviews). The profile page serves double duty: it's how you manage your own identity/pets/settings, and it's how others learn about you and your dogs.

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

- Hero section inline in About tab: avatar (large), name, location, member since, Edit/Save/Cancel buttons, Share Profile
- Edit mode for bio, location, visibility toggle
- Pet management: PetCards with expand/collapse (defaultExpanded=true on own profile)
- Tag approval setting: auto-approve / review first / don't allow tagging
- Care CTAs: Find Care + Offer Care / Manage Services
- Connection list with state badges
- **Posts tab:** photo grid of user's posts with "New post" CTA
- **Services tab:** editable services, availability, visibility toggle

### Other user profiles (`/profile/[userId]`)

- Same TabBar pattern, read-only
- Hero section: avatar, name, location, dogs summary, connection badge, trust signal badges
- Provider stats (rating, reviews) shown in hero when user has provider data
- PetCards shown collapsed (defaultExpanded=false)
- Posts tab shows their posts visible to you
- Services tab only appears if user has carerProfile or matching provider card
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

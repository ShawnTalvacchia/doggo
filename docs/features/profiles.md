---
category: feature
status: built
last-reviewed: 2026-04-04
tags: [profile, pets, provider, edit, posts, tagging]
review-trigger: "when modifying profile pages, pet cards, posts, or provider sections"
---

# Profiles

Owner profiles, pet profiles, posts, and care provider sections — all part of one unified profile system.

---

## Overview

Every user has one profile. There is no separate "provider account." Users who offer care have additional sections visible on the same profile (services, availability, reviews). The profile page serves double duty: it's how you manage your own identity/pets/settings, and it's how others learn about you and your dogs.

Own profile and explore provider profile share the same layout structure, CSS classes, and tab pattern — ensuring visual consistency whether you're viewing yourself or someone else.

---

## Current State

- **Pages:** `/profile` (own profile, edit mode), `/profile/[userId]` (other user's profile), `/discover/profile/[providerId]` (provider profile with trust signals)
- **Components:** `ProfileHeaderOwn`, `ProfileHeader`, `PetCard`, `PetEditCard`, `PostsTab`, `TagApprovalSetting`
- **Data:** `lib/mockUser.ts` (own profile + pets), `lib/mockPosts.ts` (posts), `lib/mockData.ts` (provider profiles)
- **Status:** Built — unified layout, edit mode, enhanced pet profiles, trust signals, posts tab, tag approval

### Layout structure (shared)

**Desktop:** Sidebar (avatar, name, location, member-since, actions) + right panel (tabs + scrollable content)

**Mobile:** Fixed top bar (condensed header + tabs) + scrollable body below

**Tabs:** About | Posts | Services (Phase 10 — replaces the previous About | Services | Reviews)

### Own profile

- Edit mode for bio, location, visibility toggle
- Pet management: add, edit, delete pets
- PetEditCard matches signup flow layout
- Tag approval setting: auto-approve / review first / don't allow tagging
- Care CTAs: Find Care + Offer Care / Manage Services
- Connection list with state badges
- **Posts tab:** photo grid of user's posts with "New post" CTA

### Other user profiles (`/profile/[userId]`)

- Same three tabs (About / Posts / Services), read-only
- Posts tab shows their posts visible to you
- Trust signals: connection badge, shared meets
- Relationship-aware CTAs:
  - **Connected:** "Message [name]" + "Book care"
  - **Familiar:** "Connect with [name]"
  - **Pending:** "Request sent" (disabled)
  - **None:** "Meet [name] first" (disabled)

### Provider profiles (`/discover/profile/[providerId]`)

- Extended profile with Info / Services / Reviews tabs
- Trust signals: connection badge, distance, mutual connections
- **TrustGateBanner** (Phase 11): contextual banner when not connected, explaining why actions are locked
- Connection-gated CTAs enforced (Phase 11):
  - **Connected:** Message + Book care
  - **Familiar:** Connect first (booking blocked)
  - **None:** Disabled — "Meet [name] first"
  - **Pending:** Disabled — "Request sent"

---

## Key Decisions

1. **One profile, one layout** — own and other-user profiles use the same CSS classes. Visual consistency at the layout level.

2. **Providers are just users with more sections** — no separate provider profile page. The same profile gains Services sections when a user offers care. "Dial, not a switch."

3. **Posts are first-class** — the Posts tab shows a user's photo posts with captions, tags, and paw reactions. Posts replace the old Reviews tab as the second tab. Reviews moved into the Services tab.

4. **Profile gallery is a filtered view** — the gallery/posts visible on a profile are filtered per-viewer using the Content Visibility Model's two-gate system: the **context gate** (does the viewer share a group/meet context with this user?) and the **relationship gate** (connection state between viewer and profile owner). A Connected user sees more content than a Familiar viewer, who sees more than a stranger. See [[Content Visibility Model]] for the full rules.

5. **Tags filtered by relationship gate** — tags on posts and photos are visibility-filtered per-viewer. A viewer only sees tags for people/dogs they have a relationship with (Connected or Familiar). Tags for unknown users are hidden, not removed — the content owner still sees all their tags. This prevents profile galleries from leaking social graph information to strangers.

6. **Tag approval is per-user** — users control how they can be tagged: auto-approve (default), review first, or don't allow. Dog tagging inherits the owner's setting.

7. **Connection state gates actions** — not just badges. Phase 11 enforces that non-connected users cannot book care or initiate conversations from profiles.

8. **Provider setup lives in the profile** — all "Offer Care" entry points across the app route to `/profile?tab=services`. No separate provider signup flow.

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

### Enhanced (optional)

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
→ Tap user → Profile page (About / Posts / Services)
→ See trust signals + connection badge
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

The banner links to the existing visibility toggle. Dismissing is fine — casual providers who only help friends should stay Locked.

### Default avatar

Users with no photo get an initials-based avatar on a coloured background (colour derived from user ID for consistency). Component: `components/ui/DefaultAvatar.tsx`.

---

## Future

- **Care history section** — past bookings (as owner and as carer) visible on profile
- **Profile completeness indicator** — gentle nudge to fill out enhanced pet fields
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
- `docs/implementation/component-inventory.md` — component catalog

---
category: feature
status: built
last-reviewed: 2026-03-17
tags: [profile, pets, provider, edit]
review-trigger: "when modifying profile pages, pet cards, or provider sections"
---

# Profiles

Owner profiles, pet profiles, and care provider sections — all part of one unified profile system.

---

## Overview

Every user has one profile. There is no separate "provider account." Users who offer care have additional sections visible on the same profile (services, availability, reviews). The profile page serves double duty: it's how you manage your own identity/pets/settings, and it's how others learn about you and your dogs.

Own profile and explore provider profile share the same layout structure, CSS classes, and tab pattern — ensuring visual consistency whether you're viewing yourself or someone else.

---

## Current State

- **Pages:** `/profile` (own profile, edit mode), `/explore/profile/[providerId]` (other user's profile)
- **Components:** `ProfileHeaderOwn` (own profile header), `ProfileHeader` (explore profile header with trust signals), `PetCard` (view), `PetEditCard` (edit)
- **Data:** `lib/mockUser.ts` (own profile + pets), `lib/mockProviders.ts` (explore profiles)
- **Status:** Built — unified layout, edit mode, enhanced pet profiles, trust signals

### Layout structure (shared)

**Desktop:** Sidebar (avatar, name, location, member-since, actions) + right panel (tabs + scrollable content)

**Mobile:** Fixed top bar (condensed header + tabs) + scrollable body below

**Tabs:** About | Services | Reviews (3 tabs, same on both own and explore profiles)

### Own profile

- Edit mode for bio, location, visibility toggle
- Pet management: add, edit, delete pets
- PetEditCard matches signup flow layout (photo, name, breed search, size dropdown, age, health notes, plus enhanced fields)
- Visibility toggle (Locked/Open)
- Connection list (future)

### Explore profile (viewing others)

- Trust signals: connection badge (Connected/Familiar/None), mutual connections
- Relationship-aware CTAs: Message + Book (Connected), Connect (Familiar), Contact (None)
- Provider sections: services offered, availability, pricing, reviews
- Pet profiles with enhanced details

---

## Key Decisions

1. **One profile, one layout** — own profile and explore profile use the same CSS classes (`.profile-page-shell`, `.profile-header-state`, `.profile-tabs`, `.profile-info-card`, etc.). Visual consistency is enforced at the layout level.

2. **Providers are just users with more sections** — no separate provider profile page. The same profile gains Services and Reviews tabs when a user offers care. This supports the "dial, not a switch" philosophy.

3. **Pet profiles are first-class** — pets are prominent on profiles with their own detailed cards. Enhanced fields (energy level, play style, socialisation notes, vet info, photo gallery) make pet profiles useful for meet compatibility and care suitability.

4. **Edit mode is local-state** — changes are held in React state and "saved" locally. No Supabase writes yet. This supports the demo-first approach.

5. **PetEditCard matches signup flow** — the pet editing experience in the profile uses the same card layout as the signup flow (`.pet-card` class) for consistency.

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
| Energy level | select | Low / Medium / High |
| Play styles | multi-select pills | Rough play, Chase, Tug, Parallel walker, Observer |
| Socialisation notes | textarea | How they are with other dogs, people, kids |
| Vet info | fieldset | Vet name, last checkup date, vaccinations up to date toggle |
| Photo gallery | image array | Multiple photos beyond the primary |

---

## User Flows

### Edit own profile

```
Profile tab → "Edit" button → Edit mode activates
→ Modify bio, location, visibility toggle
→ Edit/add/remove pets (PetEditCard)
→ "Save" → changes persisted locally → view mode restored
```

### View another user's profile

```
Explore results / meet attendee list / connection list
→ Tap user → Profile page (About / Services / Reviews)
→ See trust signals (connection badge, mutual connections)
→ CTA based on relationship state
```

---

## Future

- **Connection list management** — view and manage Familiar/Connected users from profile
- **Care history section** — past bookings (as owner and as carer) visible on profile
- **"Open to helping" toggle** — prominent profile setting that turns up the provider dial
- **Provider onboarding from profile** — add services, set pricing, configure availability directly from profile edit
- **Profile completeness indicator** — gentle nudge to fill out enhanced pet fields

---

## Related Docs

- [[Trust & Connection Model]] — how trust signals display on profiles
- [[connections]] — connection states that determine what's visible
- [[explore-and-care]] — provider profiles in the care discovery flow
- `docs/implementation/component-inventory.md` — component catalog

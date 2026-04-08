---
category: phase
status: active
last-reviewed: 2026-03-27
tags: [phase-15, connections, trust, discoverability, profiles, meet-participants, images, mock-data]
review-trigger: "when modifying connection states, profile visibility, meet attendee lists, or mock data images"
---

# Phase 15 — Trust, Connections & Mock Data Quality

**Goal:** Refine the connection model UX, redesign meet participant lists as a social discovery surface, add share-profile linking, and replace all Unsplash mock images with generated assets that feel authentic to Prague.

**Depends on:** Phase 14 (community & activity restructure), Phase 11 (connection gating).

---

## Why

The connection model works conceptually but the UX for *how* users discover, evaluate, and connect with each other is underdeveloped. Key gaps:

1. **Locked profiles with no action are dead ends.** Showing a user card with no way to interact is noise. The participant list should only show people you have an actionable relationship path with.
2. **No way for IRL friends to connect directly.** Two people who meet at a park need a share-profile link or code — not a requirement to join the same group first.
3. **Provider visibility is unclear.** The existing Locked/Open toggle already handles this — care services follow the same visibility as the rest of the profile — but the UI doesn't explain this well when a user adds services while Locked.
4. **Meet participant lists are utilitarian.** They should be a rich social discovery surface — the "who's at the party" moment that makes you want to attend.
5. **Mock images look stock.** Unsplash portraits and dog photos don't feel like a real Prague community. AI-generated images matched to our actual mock data characters will make the demo significantly more convincing.

---

## Workstream A — Connection Model Refinement

### A1 · Locked provider banner

Care services follow the same visibility rules as the rest of the profile — no separate setting. When a user adds care services while their profile is Locked, show an informational banner: "Your profile is private — only people you've marked as Familiar or Connected with can see your services. Want to make your profile public?"

The banner links to the existing profile visibility toggle. Dismissing it is fine — casual providers who only help friends *should* stay Locked.

**Refs:** [[Trust & Connection Model]], [[profiles]], [[explore-and-care]]

**Files:** Profile services tab (add banner when Locked + has services)

### A2 · Share profile link

Add a "Share profile" action that generates a direct link (e.g., `/connect/[shortcode]`). Visiting the link shows the user's basic profile (avatar, name, dogs, neighbourhood) with a "Connect" CTA — bypassing all discovery gates because the link itself is the trust signal.

**Use cases:**
- Two IRL friends who are both on Doggo
- Someone you meet at a park who says "I'm on the app"
- QR code on a name tag at a larger meet

**Refs:** [[connections]], [[profiles]]

**New files:** `app/connect/[code]/page.tsx`
**Modified files:** Profile page (add share action), `lib/mockUser.ts` (add shortcode)

### A3 · Update connection state documentation

Update Trust & Connection Model and connections feature docs to reflect:
- Single visibility toggle governs all content including care services
- Share profile link as a connection path
- Updated "who can reach you" matrix
- Clarified meet participant visibility rules (Workstream B)

**Refs:** [[Trust & Connection Model]], [[connections]]

---

## Workstream B — Meet Participant List Redesign

### B1 · Tiered participant list with smart visibility

Redesign the meet attendee list with three tiers, sorted by relationship proximity:

**Tier 1 — Connected users (full cards)**
- Avatar, name, dog name + breed, neighbourhood
- Relationship context: "Connected since January", "3rd meet together"
- Mutual connections: "You both know Jana and Tomáš"
- Subtle care provider indicator if applicable

**Tier 2 — Actionable users: Open profiles + Familiar (either direction)**
- Avatar, name, dog name + breed, neighbourhood
- Context signal: "Also in Vinohrady Dog Owners", "Attended Stromovka walk last week"
- Connect action (small button at card edge)
- If they marked you Familiar: warmer framing ("Wants to connect")

**Tier 3 — Hidden / collapsed**
- Locked users with no relationship → not shown individually
- Instead: "3 other attendees" count at bottom
- Post-meet prompt surfaces them: "You met 3 new people — here's who they are"

**Refs:** [[Trust & Connection Model]], [[meets]], [[connections]]

**New components:** `components/meets/ParticipantCard.tsx`, `components/meets/ParticipantList.tsx`
**Modified files:** `app/meets/[id]/page.tsx`

### B2 · Connection status icons (not text pills)

Design icon system for connection states in participant cards and other list contexts:

| State | Icon | Notes |
|-------|------|-------|
| Connected | Link/handshake | Visible, meaningful |
| Familiar (they → you) | Eye/visibility | "They've opened the door" |
| Familiar (you → them) | Check | "You've marked them" |
| Open profile | Globe/public | Subtle, not prominent |
| None | No icon | Absence = the signal |

Icons should use Phosphor Icons (weight `"light"` per project rules).

**Refs:** [[component-inventory]], [[frontend-style]]

**New components:** `components/ui/ConnectionIcon.tsx`

### B3 · Relationship context signals

Build a utility that generates contextual relationship text for participant cards:

- "Connected since [month]"
- "[N]th meet together"
- "[N] mutual connections"
- "Also in [community name]"
- "Joined [timeframe] ago" (for new members)
- "Regular at [meet series]" (for recurring meet attendees)

This utility is reusable beyond participant lists (profile pages, connection suggestions, feed cards).

**Refs:** [[Trust & Connection Model]] (trust signals section)

**New files:** `lib/relationshipContext.ts`
**Modified files:** `lib/mockConnections.ts` (add relationship metadata)

### B4 · RSVP status: Going / Interested

Add "Interested" as a third RSVP state alongside Going and Not Going. Interested users appear in a secondary list section below "Going."

- "Going" = committed, counted toward capacity
- "Interested" = social signal, not counted toward capacity
- Creates lower commitment bar, more social proof ("12 going, 5 interested")

**Refs:** [[meets]]

**Modified files:** `lib/mockMeets.ts` (add interested attendees), meet detail page, `MeetCard` (show interested count)

### B5 · Post-meet participant reveal

After a meet ends, users who were in Tier 3 (hidden/locked) get surfaced in a post-meet screen:

- "You met 3 new people at today's walk"
- Each new person shown with basic info (name, dog, neighbourhood)
- Actions: "Mark as Familiar" / "Connect" / "Skip"
- Bulk action: "Mark all as Familiar"

This extends the existing post-meet recap (Phase 8) with the new tiered model.

**Refs:** [[meets]], [[connections]]

**Modified files:** Post-meet recap component, `lib/mockMeets.ts`

---

## Workstream C — Profile Locked State

### C1 · Locked profile view for non-Familiar viewers

When a non-Familiar, non-Connected user views a Locked profile, show:
- Avatar (blurred or dimmed), first name, dog name + breed, neighbourhood
- Clear explanation: "[Name] has a private profile. Connect with them at a meet or community to see more."
- No action CTA (the profile owner controls who gets access)
- If you share a group: "You're both in [group name] — they may mark you as Familiar after a meet"

**Refs:** [[Trust & Connection Model]], [[profiles]]

**Modified files:** `/profile/[userId]/page.tsx`, `/explore/profile/[providerId]/page.tsx`

### C2 · Visual distinction for Open vs Locked profiles in lists

In any list context (search results, community members, meet attendees), Open profiles get a subtle globe icon. Locked profiles with no relationship get the muted/collapsed treatment from B1.

**Refs:** [[profiles]], [[connections]]

---

## Workstream D — Mock Data Image Replacement

### D1 · Generate remaining AI images

Complete image generation from `docs/image-generation-prompts.md` using Google Flow:
- Pet portraits (Spot, Goldie, Rex, Bella, Luna, Max, Charlie, Mila)
- Meet/activity context photos (group walks, playdates, training, cafe)
- Community cover images
- Feed post images
- Owner avatars (dog-as-avatar, object/abstract)
- Landing page hero

Save all to `public/images/generated/` with naming from the prompt doc.

### D2 · Swap mock data image URLs

Replace all Unsplash URLs in mock data files with local paths to generated images:

**Files to update:**
- `lib/mockUser.ts` — own profile avatar, pet photos, photo galleries
- `lib/mockConnections.ts` — connection avatars
- `lib/mockGroups.ts` — group covers, member avatars
- `lib/mockMeets.ts` — attendee avatars, meet photos
- `lib/mockPosts.ts` — post images, author avatars
- `lib/mockFeed.ts` — feed card images
- `lib/mockData.ts` — provider avatars, explore results
- `lib/mockBookings.ts` — booking-related avatars
- `lib/mockReviews.ts` — reviewer avatars
- `lib/mockNotifications.ts` — notification avatars
- `app/page.tsx` — landing page images
- Any component with hardcoded Unsplash URLs

### D3 · Default avatar component

Create a default avatar component for users with no custom photo (like Petr V. in mock data). Use initials on a coloured background (colour derived from user ID for consistency).

**New components:** `components/ui/DefaultAvatar.tsx`

### D4 · Image audit and cleanup

Verify all image references resolve correctly. Remove any unused Unsplash URLs. Ensure generated images are optimised for web (reasonable file sizes, appropriate dimensions).

---

## Workstream E — Documentation

### E1 · Update Trust & Connection Model

Add sections for:
- Single visibility toggle governs care services (no separate setting)
- Locked provider banner behaviour
- Share profile link connection path
- Meet participant visibility rules
- Updated "who can reach you" matrix

### E2 · Update connections feature doc

Add sections for:
- Share profile link flow
- Interested RSVP state
- Tiered participant list behaviour
- Post-meet reveal flow
- Connection icon system

### E3 · Update profiles feature doc

Add sections for:
- Locked profile view (non-Familiar viewer)
- Default avatar component
- Locked provider banner (informational, links to existing visibility toggle)

### E4 · Update meets feature doc

Add sections for:
- Redesigned participant list
- Going / Interested RSVP states
- Post-meet participant reveal

### E5 · Update component inventory

Add: `ParticipantCard`, `ParticipantList`, `ConnectionIcon`, `DefaultAvatar`

### E6 · Update image-generation-prompts.md

Mark completed images, note any prompts that needed adjustment, document final image inventory.

---

## Execution Order

1. **E1 + E2 + E3 + E4** — Update strategy and feature docs first (decisions are made, capture them)
2. **A1** — Locked provider banner
3. **A2** — Share profile link
4. **B2** — Connection status icons
5. **B3** — Relationship context utility
6. **B1** — Tiered participant list (depends on B2 + B3)
7. **B4** — Going / Interested RSVP
8. **B5** — Post-meet participant reveal
9. **C1 + C2** — Locked profile view + list distinction
10. **D1** — Generate remaining images (manual, ongoing)
11. **D3** — Default avatar component
12. **D2** — Swap mock data image URLs (after D1 complete)
13. **D4** — Image audit
14. **A3 + E5 + E6** — Final doc pass

---

## Verification

- [ ] Single profile visibility toggle (Locked/Open) governs all content including care services
- [ ] Informational banner appears when services added while profile is Locked, linking to visibility toggle
- [ ] Share profile link generates a working `/connect/[code]` URL
- [ ] Visiting share link shows basic profile + Connect CTA
- [ ] Meet participant list sorted: Connected → Familiar/Open → hidden count
- [ ] Connected users show link icon, relationship context, mutual connections
- [ ] Familiar/Open users show appropriate icon + Connect action
- [ ] Locked/None users collapsed to "N other attendees" count
- [ ] Connection icons use Phosphor (weight "light"), not text pills
- [ ] Going / Interested RSVP states work on meet detail
- [ ] MeetCard shows "N going, N interested"
- [ ] Post-meet screen reveals previously hidden attendees with Familiar/Connect/Skip actions
- [ ] Locked profile view shows blurred avatar + explanation message
- [ ] No action CTA on locked profiles for None-state viewers
- [ ] Open profiles show globe icon in list contexts
- [ ] All mock data images replaced with local generated images
- [ ] No remaining Unsplash URLs in mock data files
- [ ] DefaultAvatar component renders for users with no photo
- [ ] All generated images load correctly at all sizes
- [ ] Component inventory updated with new components
- [ ] Trust & Connection Model doc reflects all changes
- [ ] Connections, profiles, meets feature docs updated

---

## Out of Scope

- Real profile link shortcode generation (mock only)
- QR code rendering for share profile
- Push notifications for connection requests
- Algorithmic connection suggestions
- Real-time meet attendance tracking
- Profile verification / identity checks
- Video in posts
- Search-by-name user lookup (share link covers the IRL friend case)

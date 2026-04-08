---
category: phase
status: complete
last-reviewed: 2026-03-23
tags: [phase-10, home, feed, social, community, posts, reactions, tagging, profile]
review-trigger: "when revisiting feed UX or post features"
---

# Phase 10 — Home Feed & Social Posts

**Goal:** Transform Home from a section-based dashboard into a social feed. Introduce user-authored posts (photos + tags) as a core content type alongside community activity. Rework the Profile page to surface posts prominently. The result: Doggo feels like a living community you scroll through, not a tool you bounce off.

**Depends on:** Phase 9 (Groups & Belonging) — communities are a primary content engine for the feed.

---

## Why

The current home page has two prominent CTAs ("Create Meet" + "Find Care") that treat Home as a transaction launcher. This conflicts with the product's community-first thesis and several core principles:

- **"Low-pressure participation by default"** — two loud CTAs are pressure
- **"Invisible infrastructure"** — should feel like a neighbourhood, not an app
- **"The product facilitates — it does not force"**

A social feed aligns better: users come back to see what's new, not to pick an action. The home page becomes proof that the community is alive — which is exactly what a demo needs to show investors and testers.

Adding user-authored posts (dog moments, community shares) makes the feed genuinely interesting to browse. Dog photos are the #1 content type this audience already creates — Doggo just gives them a place to share it with people who actually know the dog.

---

## Prerequisite: Community Visibility Model Upgrade

Phase 9 shipped with a simple `"public" | "private"` visibility toggle. The feed exposes community content to a wider audience, which requires a more nuanced privacy model. **This upgrade should happen early in Phase 10**, before feed cards start surfacing community content.

### Three-tier visibility

| Tier | UI label | Discovery | Joining | Content visibility to non-members |
|------|----------|-----------|---------|-----------------------------------|
| **Open** | "Open community" | Listed publicly, searchable | Anyone joins instantly, no approval | Everything visible: posts, photos, members, meets |
| **Approval** | "Public community" | Listed publicly, searchable | Request to join → admin approves | Name, description, member count visible. Posts, photos, chat, gallery require membership |
| **Private** | "Private community" | Not listed, not searchable | Invite-only by existing members or admin | Nothing visible to non-members |

**Type change:** `GroupVisibility = "open" | "approval" | "private"` (replaces `"public" | "private"`)

**Migration note:** Existing mock groups currently marked `"public"` should map to `"open"` (they behave as open — anyone can join, everything visible). The `"Reactive Dog Support"` group marked `"private"` stays `"private"`.

### Visibility is permanent

Once a community is created, its visibility tier **cannot be changed**. This is shown clearly during creation ("This can't be changed later") and the setting is locked/greyed out in any community settings view.

**Why:** Changing Open → Private retroactively betrays members who joined under open expectations. Changing Private → Open leaks content people shared assuming privacy. Getting consent from all members to change would be impractical. Better to start a new community.

### Photo culture setting

A community-level setting chosen at creation time:

| Setting | Label | Behaviour |
|---------|-------|-----------|
| `encouraged` | "Photos encouraged" | Photo posts are highlighted; feed cards from this community often lead with photos |
| `optional` | "Photos welcome" (default) | Photos allowed but not emphasised |
| `none` | "No photos" | Photo uploads disabled in community posts and gallery. Useful for support groups (e.g., reactive dog group where owners don't want their dogs photographed mid-meltdown) |

This setting is displayed in the community detail header and respected by the feed — communities with `none` never produce photo-based feed cards.

**Type addition:** `photoPolicy: "encouraged" | "optional" | "none"` on the `Group` interface.

### Create form updates

The existing create form at `/groups/create` needs:
1. **Three visibility cards** instead of two (Open / Public / Private) with clear descriptions
2. **"Can't be changed later" label** under the visibility selection
3. **Photo culture selector** — three-option radio or card group

---

## Posts: The Content Model

Phase 10 introduces two types of user-authored posts. Both are photo-first (1-4 photos required, optional short caption) and support tagging.

### Two post types

| Type | Where created | Default audience | Example |
|------|--------------|------------------|---------|
| **Personal post** | Home feed ("Share a moment" bar) or Profile | User's connections + tagged people | "Bowie's first snow day!" with @Bowie tagged, 📍Riegrovy Sady |
| **Community post** | Community detail page | Community members + tagged people | "Great turnout at the morning walk!" posted in Vinohrady Morning Crew |

Both types share the same underlying data model — a community post is just a personal post with a `groupId` attached. This keeps things simple while serving both use cases.

### Why both types, not just community posts

Community posts alone would mean the feed only has content for users who are in active communities. Personal posts fill the feed for users who have connections but haven't joined communities yet, and they let people share moments that aren't tied to any particular group — just "here's my dog doing something cute." This is the content that makes a feed addictive.

Community posts are still important — they contextualize content ("this happened at the morning walk") and drive community engagement. But personal posts are the low-barrier entry point: anyone with a dog and a phone can post.

### Post data model

```typescript
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  groupId?: string;              // if set, this is a community post
  groupName?: string;            // denormalized for feed display
  photos: string[];              // 1-4 photos (required)
  caption?: string;              // optional short text
  tags: PostTag[];               // tagged dogs, people, communities, places
  createdAt: string;
  reactions: {
    pawPrint: number;
    reactedByUser: boolean;
  };
}

export type PostTagType = "dog" | "person" | "community" | "place";

export interface PostTag {
  type: PostTagType;
  id: string;                    // dog ID, user ID, group ID, or place slug
  label: string;                 // display name ("Bowie", "Sara", "Vinohrady Morning Crew", "Riegrovy Sady")
}
```

### No video in Phase 10

Video is intentionally deferred. Video hosting, playback, compression, and thumbnail generation are genuinely complex infrastructure. Photos-only keeps the prototype honest — we're designing as if we'd build this, and video would be a significant engineering investment. It's a natural future-phase addition.

### Where posts are created

1. **Home feed** — "Share a moment" bar below the upcoming strip. Camera icon + prompt text. Tapping opens the post composer.
2. **Community detail page** — "New post" action at top of the Posts section. Auto-fills the `groupId` (the post is automatically a community post).
3. **Profile page** — prominent "New post" CTA on the Posts tab header.

### Post composer flow

1. Select 1-4 photos (tap to add, drag to reorder)
2. Add optional caption (short text, not a blog post)
3. Add tags — autocomplete search across dogs, people, communities, and places
4. If started from a community page, the community is pre-tagged and shown as context
5. Post

For the prototype, the composer can be a full-page form (easier to build, clear flow). A future iteration could make it inline/modal.

---

## Tagging

Tags are the feature that makes posts more than just photos. They create **discovery paths** — every tag is a link to something else in the product.

### Four tag types

| Tag type | Icon | Tapping links to | Example |
|----------|------|-------------------|---------|
| **Dog** | PawPrint | Dog's section on owner's profile | @Bowie |
| **Person** | User | User's profile page | @Sara |
| **Community** | UsersThree | Community detail page | #Vinohrady Morning Crew |
| **Place** | MapPin | Label only (no destination for now; could link to map/location view in future) | 📍Riegrovy Sady |

### Tag display

Tags appear as small pills below the caption on post cards. Each pill has the type icon + label. Tapping navigates to the linked entity (except places, which are non-interactive labels for now).

### Tag approval settings

Users control how they can be tagged in other people's posts. This is a **per-user setting on the Profile page** (in a Privacy/Settings section):

| Setting | Label | Behaviour |
|---------|-------|-----------|
| `auto` | "Auto-approve tags" (default) | Tags from anyone appear immediately. User can remove themselves from a post after the fact. |
| `approve` | "Review tags first" | Tags from other users go to a pending state. The tagged user gets a notification and can approve or decline. Post shows without the tag until approved. |
| `none` | "Don't allow tagging" | Other users cannot tag this person or their dogs. The tag autocomplete won't show them as options. |

**Dog tagging inherits the owner's setting.** If Sara's setting is `approve`, tagging any of Sara's dogs also requires her approval. No separate per-dog settings — that would be over-engineering.

**Type addition on UserProfile:**
```typescript
export type TagApproval = "auto" | "approve" | "none";
// Add to UserProfile:
tagApproval: TagApproval;  // default: "auto"
```

### Tag autocomplete

The composer's tag input searches across all four entity types simultaneously. Results are grouped by type with icons. For the prototype, this is a filtered list of mock data (dogs from mock pets, users from mock connections, communities from mock groups, places from a small hardcoded list of Prague locations).

### Feed visibility with tags

Post visibility follows simple, predictable rules:

1. **Your connections** always see your personal posts
2. **Community members** see community posts from that community
3. **Tagged people** see the post regardless of connection status (respects their tag approval setting)
4. **If you tag a community** on a personal post, that community's members also see it (the tag acts as a share)

Rule 4 is the key bridge — tagging a community on a personal post effectively cross-posts it. This means a personal post tagged with #Vinohrady Morning Crew appears in that community's feed without being a "community post" per se. It keeps the posting UX simple (always post from the same composer) while allowing community reach.

---

## Profile Page Rework

The current profile has three tabs: **About | Services | Reviews**. Phase 10 restructures it to put posts front-and-centre, similar to how Facebook separates profile details from the timeline.

### New tab structure

| Tab | Content | Notes |
|-----|---------|-------|
| **About** | Bio, dogs, location, connection/trust signals, services summary, care CTA — all with inline edit actions | Reworked from current About, more action-oriented |
| **Posts** | Grid of user's posts (photos), plus "New post" CTA | New tab — the user's "wall" |
| **Services** | Care services detail (availability, pricing, reviews) | Mostly unchanged from current Services tab |

### About tab changes

The About tab becomes the "at a glance" view with edit affordances, similar to Facebook's profile overview:

- **Header area:** avatar, name, neighbourhood, bio — with edit icon/button
- **Dogs section:** pet cards with photos, key details — each with edit action
- **Community badges:** communities they belong to (linking to community pages)
- **Trust signals:** connection stats, meets attended, member since
- **Services summary:** if offering care, a compact summary with "Manage services" link to the Services tab. If not, the "Offer Care" CTA: "Want to help your neighbours? Set up care services"
- **Find Care CTA:** "Need help with [dog name]? Find care from your network" — links to explore/care

Key difference from current: information is presented as **viewable cards with edit actions** (pencil icons, "Edit" links) rather than toggling the whole page into edit mode. Each section is independently editable.

### Posts tab

- **Header:** "Posts" label + "New post" button (prominent, branded)
- **Grid layout:** 2-3 column photo grid (tapping opens the post detail with caption, tags, reactions)
- **Empty state:** "Share your first dog moment" with camera illustration and post CTA
- **Viewing other profiles:** shows their public posts (posts where you're a connection or where a shared community is tagged)

### Other profiles

When viewing someone else's profile (at `/profile/[userId]`), the same tab structure applies but without edit actions, and the Posts tab shows only posts visible to you based on the connection/community rules.

---

## Feed Card Types

Each card type is a distinct component. Cards are mixed in the feed by recency/relevance.

| Card type | Content | Subtle CTA | Priority |
|-----------|---------|------------|----------|
| **Personal post** | Author + photo(s) + caption + tag pills + connection context | Paw-print reaction | Required |
| **Community post** | Community name + author + photo(s) + caption + tag pills | Paw-print reaction · "View community" | Required |
| **Meet recap** | Photo grid, title, attendee/dog count, timestamp | "View recap" / "Join this community" · Reaction | Required |
| **Upcoming meet** | Title, location, date, attendee count, going avatars | "Join" pill | Required |
| **Connection activity** | "[Name] added [service]" + connection context | Profile link | Required |
| **New connection nudge** | "You and [Name] were both at [N] meets" | "Say hi" | Required |
| **Offer Care prompt** | "Your connections are looking for help — want to offer care?" | "Set up on Profile" | Required |
| **Neighbourhood milestone** | "50 dogs walked in Vinohrady this month" | None — ambient | Nice-to-have |
| **Dog birthday / new dog** | "[Owner]'s dog [Name] turned [N]!" | React | Nice-to-have |
| **Care review** | "[Name] left a review for [Name] — 5 stars" | Social proof, no CTA | Nice-to-have |

---

## Reactions

**Paw-print with text label.** The reaction button shows a paw-print icon + the word "Paw" (or the count, e.g., "3 Paws"). The text makes the unconventional icon immediately understandable.

- Single reaction type (paw-print), not multiple
- Tap to toggle (react/unreact)
- Shows count + "Paw" / "Paws" label
- Available on: personal posts, community posts, meet recaps, dog moments
- **No comments in Phase 10.** Reactions only. Comments are a future-phase feature.

---

## Page Structure

```
┌─────────────────────────────────┐
│  Hey, Shawn! · Vinohrady        │  ← compact 1-line greeting
│  [dog avatar] [dog avatar]      │     (replaces current hero block)
├─────────────────────────────────┤
│  📷 Share a moment...           │  ← post composer entry point
├─────────────────────────────────┤
│  ● Your upcoming (horizontal)   │  ← sticky/pinned mini-cards
│  [Walk tmrw] [Playdate Sat]     │     horizontally scrollable
├─────────────────────────────────┤
│                                 │
│  Sara · Vinohrady               │  ← personal post
│  [photo of dog in snow]         │
│  "Milo's first snow day!"      │
│  🐾 @Milo  📍 Riegrovy Sady    │  ← tag pills
│  🐾 7 Paws                     │
│                                 │
│  📷 Vinohrady Morning Crew      │  ← community post
│  Sara: "Great turnout today!"   │
│  [photo]                        │
│  🐾 3 Paws     View community → │
│                                 │
│  Riegrovy Sady Morning Walk     │  ← meet recap card
│  6 dogs · 4 people · Yesterday  │
│  [photo grid]                   │
│  🐾 5 Paws      View recap →   │
│                                 │
│  Sara added Dog Walking         │  ← connection activity (compact)
│  3 meets together · Vinohrady   │
│                                 │
│  🐾 Park hangout tomorrow      │  ← upcoming public meet
│  Stromovka · 4 going            │
│                  Join →         │
│                                 │
│  50 dogs walked this month      │  ← neighbourhood milestone
│  Vinohrady is getting active    │
│                                 │
│  Need help with Bowie?          │  ← periodic care prompt
│  4 people in your network       │
│  offer care.    Find Care →     │
│                                 │
└─────────────────────────────────┘
        [+ FAB: Create Meet]       ← floating action button (bottom-right)
```

### What changes from current home

| Current | Phase 10 |
|---------|----------|
| Large hero greeting block | Compact 1-line greeting with dog avatars inline |
| Two prominent CTAs ("Create Meet" + "Find Care") | "Create Meet" → FAB; "Find Care" → contextual in feed + nav |
| Section-based layout (Upcoming / People / Care / Neighbourhood) | Single mixed feed with card types |
| Static modules | Scrollable, content-first feed |
| No user-generated content | Personal + community posts as core feed content |
| "Care from your network" section | Care signals appear naturally in feed (service adds, reviews) |
| "Your neighbourhood" stats section | Milestone cards mixed into feed |
| "Your communities" section | Community content is the feed itself |

### What stays

- **Greeting** — still personalised, still shows dog names. Just compact.
- **Upcoming meets prominence** — pinned horizontal strip at top so you always see commitments.
- **New user state** — `DEMO_NEW_USER` toggle still works; new users see public/nearby content in the feed instead of connection-based content.

---

## CTA Relocation

### "Create Meet" → FAB
- Floating action button, bottom-right, branded colour
- Always visible while scrolling
- Icon-only on mobile (+ icon), expands on hover/desktop
- Power users who create meets regularly will use it; it doesn't need to dominate the page

### "Find Care" → contextual in feed + fixed on Schedule & Profile
- **In feed:** periodic prompt card ("Need help with [dog name]? [N] people in your network offer care") — appears roughly every 8-10 cards, not aggressive
- **On Schedule page:** fixed card/CTA — "Need care for an upcoming commitment?" — natural context since you're looking at your timeline
- **On Profile page:** fixed CTA on About tab — "Find care from your network" — in the services summary section
- **Desktop nav:** already exists as "Find Care" CTA

### "Offer Care" → periodic prompt in feed + fixed on Schedule & Profile
- **In feed:** periodic prompt card ("Your connections are looking for help — want to offer care?") — less frequent than Find Care, maybe every 15-20 cards
- **On Schedule page:** fixed card — "Have free time? Your neighbours could use help" — contextual next to your availability
- **On Profile page:** fixed CTA on About tab — "Set up care services" — in the services summary section, if not already offering
- Should not appear if user already has services configured

---

## Design Principles

1. **Content-first, CTA-second.** Every card leads with a photo, name, or story. Actions are small, secondary, optional.

2. **Mixed card types prevent monotony.** A feed of just one card type is boring. Mixing photos, milestones, connection updates, posts, and meet recaps creates scroll-worthy variety.

3. **Connection context on everything.** "Sara posted a photo" is OK. "Sara posted a photo — you've been to 3 meets together" is better. Answer "why should I care?" without the user thinking.

4. **Tags create discovery, not obligation.** Tapping a tag is a natural way to explore — see a dog's profile, find a community, discover a location. But tags are never required on posts, and tagged people control whether they appear.

5. **Reactions only, no comments.** A paw-print reaction on a photo is low-friction. Full comments are a future-phase feature. Keeps the "low-pressure participation" principle.

6. **Ambient social proof.** Milestone cards ("50 dogs walked this month"), care reviews, and dog birthdays fill the feed with life without requiring any action. They prove the community exists.

---

## Cold Start / New User Feed

New users with no connections or community memberships see:

1. **Public meets nearby** — same data as current "Happening near you"
2. **Popular open communities in neighbourhood** — join suggestions with member count and next meet
3. **Posts from open communities** — photo-first cards from active open communities in their neighbourhood
4. **Neighbourhood milestones** — ambient proof that the community is active
5. **"Dogs near you" cards** — remixed from current `DogsNearYou` carousel into feed cards

As the user attends meets and joins communities, the feed progressively fills with connection-based and community-based content. Their first personal post is prompted gently ("Share your first dog moment").

---

## Mock Data Needed

New mock data types beyond what exists today:

- **Posts** — 10-12 sample posts: mix of personal and community posts, varied authors, 1-4 photos each, tags of different types, some with captions and some without
- **Feed items** — a unified feed model with `type` discriminator (personal_post, community_post, meet_recap, upcoming_meet, connection_activity, nudge, milestone, offer_care_prompt, etc.)
- **Tag entities** — dogs, people, communities, and places. Most already exist in mock data; places need a small hardcoded list of Prague locations (Riegrovy Sady, Stromovka, Letná, Havlíčkovy Sady, etc.)
- **Service-added events** — timestamped log of when connections add/change services
- **Reactions** — paw-print count + reactedByUser boolean per feed item
- **Updated mock groups** — visibility migrated from `"public"/"private"` to `"open"/"approval"/"private"`, `photoPolicy` added
- **Updated mock user** — `tagApproval` setting added (default: `"auto"`)

---

## Components to Build

### Feed components

| Component | Description |
|-----------|-------------|
| `FeedCard` (wrapper) | Shared card chrome — avatar, timestamp, connection context line |
| `FeedPersonalPost` | Author + photo(s) + caption + tag pills + reaction |
| `FeedCommunityPost` | Community name + author + photo(s) + caption + tag pills + reaction |
| `FeedMeetRecap` | Photo grid + meet summary + "View recap" + reaction |
| `FeedUpcomingMeet` | Compact meet info + "Join" pill |
| `FeedConnectionActivity` | "[Name] did [thing]" + context + profile link |
| `FeedConnectionNudge` | Shared-meet context + "Say hi" |
| `FeedOfferCarePrompt` | Contextual CTA to find or offer care |
| `FeedMilestone` | Ambient stat card, no CTA |
| `FeedDogMoment` | Birthday/new dog, react option |
| `FeedCareReview` | Review summary, social proof |
| `PawReaction` | Paw-print icon + count + "Paws" label, tap to toggle |
| `TagPill` | Icon + label pill for each tag type (dog/person/community/place), tappable |
| `UpcomingStrip` | Horizontal scrollable mini-cards for pinned upcoming meets |
| `HomeFAB` | Floating "Create Meet" button |
| `CompactGreeting` | 1-line greeting + inline dog avatars |
| `ShareMomentBar` | "Share a moment" prompt bar with camera icon on Home |

### Post components

| Component | Description |
|-----------|-------------|
| `PostComposer` | Full-page form: photo picker, caption, tag autocomplete. Used from Home, Profile, and Community pages |
| `TagAutocomplete` | Search input that filters dogs, people, communities, places with grouped results |
| `PostPhotoGrid` | 1-4 photo layout (single = full width, 2 = side-by-side, 3-4 = grid) |

### Profile components

| Component | Description |
|-----------|-------------|
| `ProfileAboutTab` | Reworked About view: info cards with inline edit actions, services summary, care CTAs |
| `ProfilePostsTab` | Photo grid of user's posts + "New post" CTA + empty state |
| `ProfilePostsGrid` | 2-3 column photo grid, tappable to expand post detail |
| `TagApprovalSetting` | Three-option selector for tag approval preference (auto/approve/none) |

---

## Tasks

### Planning
- [x] Define all TypeScript types (Post, PostTag, TagApproval, updated Group types, feed item discriminator)
- [x] Design card components (can use Pencil or sketch)
- [x] Design post composer flow (photo selection → caption → tags → post)
- [x] Design Profile page rework (About tab layout, Posts tab grid)

### Build — Community model upgrade
- [x] Update `GroupVisibility` type: `"public" | "private"` → `"open" | "approval" | "private"`
- [x] Add `photoPolicy: "encouraged" | "optional" | "none"` to `Group` interface
- [x] Update mock groups with new visibility values and photo policies
- [x] Update create form with three visibility cards + "can't be changed" label + photo policy selector
- [x] Update community detail page to show visibility tier and photo policy
- [x] Update community browse page filters (Open / Public / Private)
- [x] Add join-request flow for "approval" communities (request button → pending state → admin approve/deny)

### Build — Posts & tagging
- [x] Add `Post`, `PostTag`, `PostTagType` types to `lib/types.ts`
- [x] Add `TagApproval` type and `tagApproval` field to `UserProfile`
- [x] Create mock posts data (`lib/mockPosts.ts`) — 10-12 varied posts
- [x] Create places list for tag autocomplete (`lib/mockPlaces.ts`)
- [x] Build `PostComposer` (full-page form: photos, caption, tag autocomplete)
- [x] Build `TagAutocomplete` component (search across dogs/people/communities/places)
- [x] Build `TagPill` component (four variants with icons, tappable)
- [x] Build `PostPhotoGrid` component (1-4 photo layouts)
- [x] Build `PawReaction` component
- [x] Add "Posts" section to community detail page with composer entry point
- [x] Respect `photoPolicy: "none"` (disable photo uploads in those communities)

### Build — Profile rework
- [x] Restructure Profile tabs: About | Posts | Services (replaces About | Services | Reviews — reviews move into Services)
- [x] Build `ProfileAboutTab` — info cards with inline edit actions, services summary, Find/Offer Care CTAs
- [x] Build `ProfilePostsTab` — photo grid + "New post" CTA + empty state
- [x] Build `ProfilePostsGrid` — 2-3 column tappable grid
- [x] Build `TagApprovalSetting` — three-option selector in profile settings/privacy area
- [x] Update `/profile/[userId]` (other user's profile) with same tab structure, no edit actions, visibility-aware posts

### Build — Feed core
- [x] Create unified feed mock data (`lib/mockFeed.ts`) assembling all card types
- [x] Build `FeedCard` wrapper (shared card chrome)
- [x] Build `CompactGreeting` component
- [x] Build `ShareMomentBar` component
- [x] Build `UpcomingStrip` component (horizontal scroll)
- [x] Build `FeedPersonalPost` card
- [x] Build `FeedCommunityPost` card
- [x] Build `FeedMeetRecap` card
- [x] Build `FeedUpcomingMeet` card
- [x] Build `FeedConnectionActivity` card
- [x] Build `FeedConnectionNudge` card
- [x] Build `FeedOfferCarePrompt` card
- [x] Build `HomeFAB` (floating action button)
- [x] Rebuild `app/home/page.tsx` with feed layout

### Build — Care CTA placement
- [x] Add "Find Care" fixed CTA to Schedule page
- [x] Add "Find Care" fixed CTA to Profile About tab (services summary section)
- [x] Add "Offer Care" fixed CTA to Schedule page
- [x] Add "Offer Care" fixed CTA to Profile About tab (if not already offering)

### Build — Polish
- [x] Build `FeedMilestone` card
- [x] Build `FeedDogMoment` card
- [x] Build `FeedCareReview` card
- [x] New-user feed variant (open community content + public meets + neighbourhood stats)
- [x] Update component inventory doc
- [x] Update flow charts (`docs/flows/`) for new posting and profile flows

### Verify
- [x] Feed looks alive with mixed content (not monotonous)
- [x] CTAs feel ambient, not pushy
- [x] Upcoming meets are still clearly visible (pinned strip)
- [x] New user state works and doesn't feel empty
- [x] Scrolling feels natural on mobile
- [x] Desktop layout works (max-width, card sizing)
- [x] Community visibility tiers behave correctly (open content in discovery feed, approval/private content members-only)
- [x] Photo policy respected (no photos from `none` communities in feed)
- [x] Paw-print reactions work and show count with label
- [x] Tag pills render correctly for all four types and navigate to correct destinations
- [x] Tag approval setting works (auto shows immediately, approve shows pending, none hides from autocomplete)
- [x] Profile About tab shows info with edit actions
- [x] Profile Posts tab shows photo grid with new-post CTA
- [x] Post composer works end-to-end (photos → caption → tags → post appears in feed)

---

## Resolved Decisions

1. **Reactions:** Paw-print with text label ("3 Paws"). Single reaction type, no hearts.
2. **Comments:** No comments in Phase 10. Reactions only. Future-phase feature.
3. **User-authored content:** Both personal posts AND community posts. Personal posts visible to connections + tagged people/communities. Community posts visible to community members.
4. **No video:** Photos only. Video deferred — real engineering cost, not appropriate for a prototype that should be buildable.
5. **Tagging:** Four types (dog, person, community, place). Tag approval is a per-user setting (auto/approve/none). Dog tagging inherits owner's setting.
6. **Profile rework:** Facebook-style — About tab with details + edit actions, Posts tab with photo grid/wall, Services tab for care.
7. **"Offer Care" placement:** Periodic prompt in feed + fixed CTA on Schedule and Profile About tab.
8. **"Find Care" placement:** Contextual in feed + fixed CTA on Schedule and Profile About tab + desktop nav.
9. **Cold start:** New users see open community content, public meets, neighbourhood milestones.
10. **Community visibility:** Three tiers (open/approval/private), permanent once created, with photo policy setting.

## Open Questions

1. **Feed algorithm or chronological?** For a demo, chronological with some manual ordering is fine. Real product would need relevance ranking.
2. **Infinite scroll or paginated?** For demo, a fixed set of ~12-15 mock cards is sufficient.
3. **Approval community UX** — what does the admin approval flow look like? Notification in inbox? A "Requests" tab on community detail? Keep it minimal for demo.
4. **Should the FAB have a menu?** Just "Create Meet" for now, or expand to "Create Meet" + "New Post" (which would need a community picker for community posts)? Leaning single-action — posting is handled by the ShareMomentBar and community pages.
5. **Tag approval notification** — when someone tags you and your setting is `approve`, where does the notification appear? Inbox? A dedicated "Tag requests" section? Leaning inbox with a distinct notification type.
6. **Post detail view** — when you tap a post in the Profile grid, does it open full-screen, as a modal, or inline-expand? Full-screen is simplest for prototype.

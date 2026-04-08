---
status: active
last-reviewed: 2026-04-06
review-trigger: Any new card/pane built or filter logic changed
---

# Content Audit — Cards, Panes & Filter Logic

> Track what's built, what needs fleshing out, and open UX questions for every major content area.
> Organized by domain. Each entry = one distinct view a user sees.

## Status Key

| Tag | Meaning |
|-----|---------|
| `✅ done` | Content complete, logic solid, in code |
| `🔧 needs-work` | Built but has open questions or thin content |
| `📋 on-deck` | Not yet built, ready to spec |
| `💭 idea` | Exploratory, not committed |

---

## How to Read This Doc

**Cards** are compact, tappable items — usually in a list panel. Clicking reveals detail in the next panel (or navigates on mobile).

**Panes** are the main body content of a panel — either a detail view, a filter/options panel, or a full-page layout.

**Variants** are context-driven versions of the same domain card (e.g., a meet card looks different in discover vs. schedule vs. feed).

---

## 1. Meets

### Cards

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `card-meet` (discover) | Discover > Meets results | 🔧 needs-work | Currently `CardScheduleMeet`. Overloaded — has share/star actions, inline CTA, too many pills. See [Card-Meet Redesign](#card-meet-redesign) below. |
| `card-meet` (schedule) | My Schedule list | 🔧 needs-work | `CardMyMeet`. Similar issues to discover card (share icon, dense pill row). Role badge is good but layout needs same cleanup. |
| `card-meet` (group-detail) | Community > Meets tab | 🔧 needs-work | Currently uses `MeetCard` (a third variant). Should converge with discover card. |
| `card-meet` (compact) | Group chat event strip | ✅ done | 200px horizontal scroll card. Minimal: icon, type, title, date, count. Component: `MeetCardCompact`. Good as-is. |
| `card-meet` (feed) | Home feed | 🔧 needs-work | Embedded in `FeedUpcomingMeet`. Needs review — is content rich enough vs. the discover card? |
| `card-participant` | Meet detail attendee list | ✅ done | Avatar, name, dogs, neighbourhood, connection state, Connect CTA. Component: `ParticipantCard` |

### Card-Meet Redesign

> **Goal:** One card component with variant props, not three separate components. The card is a **scannable summary that invites a tap** — not a mini action panel.

#### What's wrong now (CardScheduleMeet — discover)

| Element | Problem |
|---------|---------|
| Share icon | Action on a card whose entire surface is a link. Tap target conflict. Move to detail pane. |
| Star/bookmark icon | Feature doesn't exist in any spec. Remove entirely, or spec the feature first. |
| "Joining" / "Ask to Join" CTA | Styled like a button but can't function as one (whole card is `<Link>`). Creates false affordance. |
| Leash + Energy pills (row 1) | Secondary filter data competing with the title. Too much to scan. |
| Meta grid | All items same visual weight — date (the most important field) doesn't stand out. |
| "3 people" + "5 spots left" | Redundant — both convey attendance. Pick one per context. |

#### Proposed content hierarchy

**Discover variant** — user is browsing, deciding which meets to explore:

```
┌─────────────────────────────────────────────────┐
│  [Walk pill]                    [Joining badge]  │  ← type + status only
│                                                  │
│  Morning walk — Riegrovy sady                    │  ← title (bold, primary)
│                                                  │
│  📅 Wed 18 Mar, 08:00  ·  🔄 Weekly             │  ← date+time (semibold) + recurring
│  📍 Riegrovy sady, Prague 2                      │  ← location
│                                                  │
│  👥 Vinohrady Morning Crew                       │  ← group context (if has group)
│                                                  │
│  [ava][ava][ava]  5 spots left                   │  ← social proof + scarcity
│  ⚡ Tomáš joined 2h ago                          │  ← activity signal
└─────────────────────────────────────────────────┘
```

**Key changes:**
- **Row 1:** Only type pill + status badge (Joining/Interested/Popular). No share, star, leash, or energy pills.
- **Title:** Stands alone, not competing with pills for attention.
- **Date is primary meta** — bold weight. It's the #1 decision factor ("can I make it?").
- **Group context** gets its own line — it's meaningful for trust ("I know this crew").
- **Spots left** replaces people count — scarcity is more actionable than headcount.
- **Activity signal** stays — good engagement driver.

**Schedule variant** — user already committed, needs logistics:

```
┌─────────────────────────────────────────────────┐
│  [Walk pill]       [Hosting badge w/ flag icon]  │
│                                                  │
│  Morning walk — Riegrovy sady                    │
│                                                  │
│  📅 Wed 18 Mar, 08:00  ·  🔄 Weekly             │  ← date bold (when do I need to be there?)
│  📍 Riegrovy sady, Prague 2                      │  ← where am I going?
│                                                  │
│  [ava][ava][ava]  3 going · 4 dogs               │  ← who's coming (more relevant post-commit)
│  ⚡ 2 new RSVPs                                  │  ← host signal (if hosting)
└─────────────────────────────────────────────────┘
```

**Key changes vs. discover:**
- No spots left (already committed). Show "X going · Y dogs" instead.
- Host gets RSVP count signal (already in `CardMyMeet`, keep it).
- No group line needed (you already know which group).
- History variant: muted colors, past-tense badge ("Attended" / "Hosted").

**Group-detail variant** — browsing a group's upcoming meets:

Same as discover, but drop the group context line (you're already in the group).

#### What moves to the detail pane

| Element | Why |
|---------|-----|
| Share action | Intentional action, not a browse-time impulse |
| Bookmark/save | Needs feature spec first. If built: detail pane action. |
| Leash rule (On/Off/Mixed) | Type-specific detail — shown with other type-specific fields |
| Energy level (Calm/Moderate/High) | Same — secondary filter, not card-level |
| "Ask to Join" CTA | Detail pane primary action. Card tap = navigate to detail. |
| People count (when spots-left is shown) | Redundant — detail shows full breakdown |

#### Variant consolidation

Propose one `CardMeet` component with a `variant` prop:

```typescript
interface CardMeetProps {
  meet: Meet;
  variant: "discover" | "schedule" | "group";
  role?: "hosting" | "joining" | "interested";  // schedule only
  isHistory?: boolean;                            // schedule only
}
```

Replaces: `CardScheduleMeet`, `CardMyMeet`, `MeetCard` (3 → 1).
`MeetCardCompact` stays separate — it's a fundamentally different layout (horizontal scroll).

### Panes

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `pane-meet-detail` | Meet detail (right panel) | ✅ done | Tabs: Details / Attendees / Chat. Type-specific fields render per meet type. |
| `pane-meets-options` | Discover > Meets type picker | ✅ done | Four doors: Walks, Park Hangouts, Playdates, Training |
| `pane-meets-filters` | Discover > Meets filter panel | 🔧 needs-work | See [Filter Deep Dive: Meets](#filter-deep-dive-meets) below |

### Filter Deep Dive: Meets

**Shared filters (all meet types):**

| Filter | UI | Default | Status | Open Questions |
|--------|----|---------|--------|----------------|
| Which Days? | `MultiSelectSegmentBar` (Su–Sa) | Empty (no filter) | ✅ done | — |
| Energy Level | `MultiSelectSegmentBar` | `["any"]` | 🔧 needs-work | See [Any Toggle Pattern](#any-toggle-pattern) |
| Dog Size | `MultiSelectSegmentBar` | `["any"]` | 🔧 needs-work | See [Any Toggle Pattern](#any-toggle-pattern) |
| Leash Rule | `MultiSelectSegmentBar` | Empty | 🔧 needs-work | Should this default to all selected? On-leash/off-leash/mixed are mutually relevant — most users probably want all. |
| Max Group Size | `Slider` (2–20) | 12 | 🔧 needs-work | Is 12 a good default? Feels arbitrary. Should it just be max (20) = no filter? |
| Nearby | Read-only text | "Vinohrady" | 🔧 needs-work | Hardcoded. Should pull from user profile location. Not interactive yet. |

**Walk-specific filters:**

| Filter | UI | Default | Status | Open Questions |
|--------|----|---------|--------|----------------|
| Pace | `CheckboxRow` (Leisurely / Moderate / Brisk) | None checked | 🔧 needs-work | Nothing checked = show all? Or should all be checked by default? Unclear UX. |
| Distance | `CheckboxRow` (Short / Medium / Long) | None checked | 🔧 needs-work | Same issue — empty = all, but visually looks like nothing is selected. |
| Terrain | `CheckboxRow` (Paved / Trails / Mixed) | None checked | 🔧 needs-work | Same. |

**Park Hangout-specific filters:**

| Filter | UI | Default | Status | Open Questions |
|--------|----|---------|--------|----------------|
| Amenities | `CheckboxRow` (Fenced / Water / Shade / Benches / Parking) | None checked | 🔧 needs-work | These feel more like "nice to have" than hard filters. Should they be additive (show meets that have ANY checked amenity) or restrictive (must have ALL)? |
| Vibe | `CheckboxRow` (Casual / Organised) | None checked | ✅ done | Simple binary, works fine. |

**Playdate-specific filters:**

| Filter | UI | Default | Status | Open Questions |
|--------|----|---------|--------|----------------|
| Age Range | `CheckboxRow` (Puppy / Young / Adult / Senior / Any) | None checked | 🔧 needs-work | Another "Any" option mixed with specifics. Same pattern issue. |
| Play Style | `CheckboxRow` (Gentle / Active / Mixed) | None checked | 🔧 needs-work | "Mixed" is not the same as "Any" — it's a specific play style. Should there be an "Any" here too, or is empty = any? |

**Training-specific filters:**

| Filter | UI | Default | Status | Open Questions |
|--------|----|---------|--------|----------------|
| Skills | `CheckboxRow` (Recall / Leash manners / Socialisation / Obedience / Agility / Tricks) | None checked | ✅ done | Multi-select makes sense here — you want specific skills. Empty = show all. |
| Experience | `CheckboxRow` (Beginner / Intermediate / Advanced / All levels) | None checked | 🔧 needs-work | "All levels" is another "Any" variant. Same pattern issue. |
| Trainer Type | `CheckboxRow` (Peer / Professional) | None checked | ✅ done | Clear binary. |

---

## 2. Groups

### Cards

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `card-group` (discover) | Discover > Groups results | ✅ done | Circular cover, type badge, name, location, member/dog/event counts. Component: `GroupCard` |
| `card-group` (home) | Home > Groups tab/panel | ✅ done | Same component, used in My Groups list |
| `card-group` (feed) | Feed context chips | 🔧 needs-work | Group name appears as pill/chip on feed posts. Not a full card — is this enough? |

### Panes

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `pane-group-detail` | Group detail page | ✅ done | Tabbed layout (Feed · Meets · Members · Chat) with URL state, persistent header above tabs, PanelBody + Spacer. |
| `pane-group-feed` | Group > Feed tab | ✅ done | Post cards + gallery, new post CTA for members, empty state. |
| `pane-group-meets` | Group > Meets tab | ✅ done | CardMeet variant="group" list, create-meet CTA, empty state. |
| `pane-group-members` | Group > Members tab | ✅ done | Member cards with avatar, admin badge, dog names, connection state badge. |
| `pane-group-chat` | Group > Chat tab | ✅ done | Join-gated EmptyState for non-members, event card strip + MessageBubble/SystemMessage + compose for members. |
| `pane-group-options` | Discover > Groups type picker | ✅ done | Three doors: Park Groups, Community, Hosted |
| `pane-groups-filters` | Discover > Groups filter panel | 🔧 needs-work | See [Filter Deep Dive: Groups](#filter-deep-dive-groups) |

### Filter Deep Dive: Groups

| Filter | UI | Default | Status | Open Questions |
|--------|----|---------|--------|----------------|
| Nearby | Read-only text | "Vinohrady" | 🔧 needs-work | Same as meets — hardcoded, should be from user profile. |
| Visibility | `MultiSelectSegmentBar` (Open / Approval) | Empty | 🔧 needs-work | Hidden for Park groups (always open). For Community/Hosted — does empty = show all? Should both be selected by default? |
| Max Members | `Slider` (2–50) | 50 | ✅ done | Max = no filter. Makes sense. |
| Neighbourhoods | `CheckboxRow` (7 Prague neighbourhoods) | None checked | 🔧 needs-work | Empty = show all? Should user's neighbourhood be pre-checked? This could be the most useful default. |

---

## 3. Care

### Cards

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `card-care` (discover) | Discover > Care results | ✅ done | Provider avatar, name, location, rating, price, services, trust signals. Component: `CardExploreResult` |
| `card-care` (feed) | Feed care prompts | 🔧 needs-work | `FeedCarePrompt` / `FeedCareReview` — are these fleshed out enough? |

### Panes

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `pane-care-detail` | Provider profile | ✅ done | Tabs: Info / Services / Reviews. Trust gate banner. Connection-gated CTAs. |
| `pane-care-options` | Discover > Care service picker | ✅ done | Three services: Walks & Check-ins, In-home Sitting, Boarding |
| `pane-care-filters` | Discover > Care filter panel | 🔧 needs-work | See [Filter Deep Dive: Care](#filter-deep-dive-care) |

### Filter Deep Dive: Care

| Filter | UI | Default | Status | Open Questions |
|--------|----|---------|--------|----------------|
| Your Pets | Inline checkboxes | All checked | ✅ done | Good default — you're looking for care for your dogs. |
| Address | Text input (read-only) | Empty | 🔧 needs-work | Should pre-fill from user profile location. Placeholder changes by service type — good. |
| How Often? | Option cards (One Time / Repeat Weekly) | "One Time" | ✅ done | Walks only. Clear single-select. |
| Dates | Date range picker | Empty | ✅ done | Required before results show? Or optional filter? |
| Which Days? | `MultiSelectSegmentBar` (Su–Sa) | Empty | ✅ done | Repeat Weekly mode only. |
| Available Times | `MultiSelectSegmentBar` (3 slots) | Empty | 🔧 needs-work | Walks only. Are 3 time blocks granular enough? "6am–11am" is very wide. |
| Rate | Dual `Slider` + number inputs | Full range (service-dependent) | ✅ done | Bounds adjust per service. Good UX. |
| Services accordion | `CheckboxRow` per sub-type | None (except "Walking" for sitting) | 🔧 needs-work | Why is "Walking" pre-checked for in-home sitting? Is that the most common add-on? Should document reasoning. |
| Home Features | `CheckboxRow` (Fenced / No other dogs / No kids) | None | ✅ done | Boarding only. These are hard requirements, not preferences — empty = no requirement. Correct. |
| Type of Home | `CheckboxRow` (House / Apartment / Farm) | None | ✅ done | Boarding only. Same — empty = any home type. |

---

## 4. Bookings

### Cards

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `card-booking` (list) | Bookings page list | ✅ done | Avatar, name, service, pets, status badge. Component: `BookingListCard` |
| `card-booking` (schedule) | My Schedule > Care tab | ✅ done | Same component, filtered to owner perspective |
| `card-booking` (proposal) | Inbox thread | ✅ done | Inline proposal with service, dates, line items, accept/decline. Component: `BookingProposalCard` |
| `card-booking` (payment) | Inbox thread | ✅ done | Payment summary card. Component: `PaymentCard` |
| `card-booking` (contract) | Inbox thread | 🔧 needs-work | `ContractCard` exists but thin. |

### Panes

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `pane-booking-detail` | Booking detail (right panel) | ✅ done | Schedule, sessions, pricing, review section, status, owner actions |
| `pane-bookings-list` | Bookings page | ✅ done | Tabs: My Care / My Services |

---

## 5. Messaging

### Cards

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `card-conversation` | Inbox list | ✅ done | Preview, timestamp, unread badge, type indicator. Component: `ConversationRow` |
| `card-inquiry-response` | Inbox thread (carer view) | ✅ done | Inquiry summary pills + Send Proposal / Decline / Suggest Changes. Component: `InquiryResponseCard` |

### Panes

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `pane-inbox-thread` | Conversation detail | ✅ done | MessageBubble chat + inline booking cards |
| `pane-inbox-info` | Contact info (desktop right panel) | 📋 on-deck | Does not exist yet. Specced as: avatar, trust signals, care CTA. Desktop-only third column. |
| `pane-inbox-list` | Inbox conversation list | ✅ done | Tabs: All / Care / Groups |

---

## 6. Profile

### Cards

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `card-pet` | Profile > About tab | ✅ done | Photo, breed, size, age, energy, play styles, expandable vet info. Component: `PetCard` |
| `card-pet-edit` | Profile edit mode | ✅ done | Full form variant. Component: `PetEditCard` |
| `card-notification` | Notifications list | 🔧 needs-work | Rendered inline in `NotificationsPanel` as `notif-row` items, not a reusable card component. Content exists but not componentized. Notification types need documenting. |

### Panes

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `pane-profile-about` | Profile > About tab | ✅ done | Bio, location, pets, connections |
| `pane-profile-posts` | Profile > Posts tab | ✅ done | Photo grid + "New post" CTA |
| `pane-profile-services` | Profile > Services tab | ✅ done | Care setup, availability, service cards |
| `pane-user` (other) | Other user's profile | ✅ done | Same layout, read-only, trust signals, gated CTAs |

---

## 7. Feed

### Cards

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `card-post` (moment) | Home feed | ✅ done | Unified photo card: author, caption, photos, tags, paw reaction. Component: `MomentCard` |
| `card-post` (upcoming-meet) | Home feed | ✅ done | `FeedUpcomingMeet` |
| `card-post` (connection-activity) | Home feed | ✅ done | `FeedConnectionActivity` — avatar, linked username, activity text, profile link. 43 lines. |
| `card-post` (connection-nudge) | Home feed | ✅ done | `FeedConnectionNudge` — shared meets count, dog names, "Say hi" CTA. 37 lines. |
| `card-post` (care-prompt) | Home feed | ✅ done | `FeedCarePrompt` — branded CTA (offer/request care), icon + text + button. 37 lines. |
| `card-post` (care-review) | Home feed | ✅ done | `FeedCareReview` — paired avatars, star rating, review snippet. 49 lines. |
| `card-post` (milestone) | Home feed | 🔧 needs-work | `FeedMilestone` — trophy icon + text. Component exists (30 lines) but: what milestones trigger this? Need to define milestone types and thresholds. |
| `card-post` (dog-moment) | Home feed | 🔧 needs-work | `FeedDogMoment` — paw icon, dog name, moment text. Component exists (28 lines) but: what "moments" are these? Auto-generated? User-posted? Need to define content source. |
| `card-post` (cta) | Home feed | ✅ done | `FeedCTA` — completion prompts, engagement nudges |

---

## 8. Schedule

### Panes

| Name | Context | Status | Notes |
|------|---------|--------|-------|
| `pane-schedule-list` | My Schedule list panel | ✅ done | Tabs: Joining / Invited / Care. Unified meet + booking timeline. |
| `pane-schedule-detail` | My Schedule detail panel | ✅ done | Shows meet or booking detail based on selection |

---

## UX Pattern: "Any" Toggle

> **Applies to:** Dog Size, Energy Level, Playdate Age Range, Training Experience Level

### Current Behavior
"Any" sits alongside specific options as a peer in `MultiSelectSegmentBar`. Selected by default for Dog Size and Energy Level. Not pre-selected for Age Range or Experience.

### Problem
- "Any" isn't a value — it's the absence of a filter
- Clicking "Any" off with nothing else selected = unclear state (no filter? or no results?)
- "Any" selected alongside "Small" makes no sense but is technically possible

### Proposed Pattern

**Option A: "Any" as smart toggle (recommended)**
- Default state: "Any" selected (all options active, visually muted)
- Click specific option → deselects "Any", selects that option
- Click "Any" → resets to all
- Manually selecting all specifics → auto-flips back to "Any"
- "Any" is visually distinct (different style, e.g., outline vs. filled)

**Option B: Empty = no filter**
- No "Any" button at all
- Nothing selected = show everything (no filter applied)
- Select options to filter down
- Simpler, but "nothing selected" can feel broken to users

**Option C: All-selected default**
- No "Any" button
- All specific options pre-selected
- Deselect to filter down
- Risk: users think they need to select, not deselect

### Recommendation
Option A for segments with few options (Dog Size: 3 + Any, Energy: 3 + Any). Option B for checkboxes in accordions (amenities, skills, terrain) where empty clearly means "no preference."

---

## UX Pattern: Checkbox Defaults (Accordion Filters)

> **Applies to:** Walk Pace, Distance, Terrain, Park Amenities, Playdate Age Range, Training Skills

### Current Behavior
All checkboxes start unchecked. Empty = show all results (no filter applied).

### Problem
- Visually, empty checkboxes look like "nothing configured" rather than "everything included"
- Users might check one option thinking they're adding results, when they're actually restricting

### Recommendation
- For **preference filters** (pace, terrain, play style): Empty = any. Add subtle helper text: "Leave blank to see all"
- For **requirement filters** (amenities, home features): Empty = no requirements. This is correct and intuitive.
- For **match filters** (skills, experience): Empty = any. Consider showing result count change when selecting.

---

## UX Pattern: Filter Logic (AND vs OR)

### Current Behavior
Not explicitly documented. Assumed OR within a filter group, AND across filter groups.

### Recommended Logic
- **Within a group** (e.g., Dog Size: Small + Large selected): **OR** — show meets that accept small OR large dogs
- **Across groups** (e.g., Dog Size: Small AND Energy: Calm): **AND** — must match both
- **Amenities exception**: Consider offering AND/OR toggle, or default to OR ("has any of these amenities") since requiring ALL amenities is very restrictive

---

## Next Steps

1. Work through each `🔧 needs-work` item — resolve open questions, flesh out content
2. Build dummy data that exercises all card variants (diverse, realistic)
3. Implement "Any" toggle pattern (Option A) in `MultiSelectSegmentBar`
4. Add helper text to accordion checkbox filters
5. Document filter logic (AND/OR) in code comments and here

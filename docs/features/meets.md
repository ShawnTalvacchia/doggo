---
category: feature
status: active
last-reviewed: 2026-05-05
tags: [meets, groups, community, social]
review-trigger: "when modifying meets, groups, group detail tabs, or meet discovery"
---

# Groups & Meets

Organised dog social activities — the core community feature that drives trust and engagement.

---

## Overview

Groups are persistent communities. Meets are events within them.

A group is an ongoing thing — "the Tuesday morning Letná crew," "Prague Reactive Dog Support," "Klára's Calm Dog Sessions." It has members, a feed (posts with comments), and events (meets). Being a member doesn't mean attending every meet — it means you're part of that community.

Meets are individual events within a group — a specific walk on a specific day. You RSVP to meets, not to groups. Joining a group is the gateway to seeing its meets and participating in event chat.

This distinction matters because meets alone aren't enough. Without a persistent home, the conversations between events have nowhere to live, the social graph has no container, and recurring groups default to WhatsApp. Groups are what make Doggo the place people organise, not just attend.

---

## Groups

### Four group types

| Type | `groupType` | Visibility | Admin | How created | Primary value |
|------|-------------|------------|-------|-------------|---------------|
| **Park** | `"park"` | Open | None (community-moderated) | Auto-generated | Discovery, coordination. Lowest-barrier entry. |
| **Neighbor** | `"neighbor"` | Default private | Creator | User-created | Mutual aid, hyperlocal trust. Small (5–20). |
| **Interest** | `"interest"` | Open or private | Creator | User-created | Shared interest, knowledge. Medium (10–100+). |
| **Care** | `"care"` | Provider chooses | Provider | Provider-created | Service delivery, client community. Provider badge. |

The natural progression: **join a park group → attend meets → get invited to (or create) a neighborhood group of regulars.** Care groups run in parallel, discoverable through `/discover/groups`.

### Group detail tabs

Tabs vary by group type. No Chat tab on any group — async discussion lives in Feed (posts with flat comments). Real-time coordination lives in meet-level chat.

| Group type | Tabs |
|-----------|------|
| Park | Feed · Meets · Members |
| Neighbor | Feed · Meets · Members |
| Interest | Feed · Meets · Members |
| Care | Feed · Events · Services · Members · Gallery |

**Feed tab:** Posts with photos, captions, tags, paw reactions, and flat comments. Who can post varies by type: any member for Park/Neighbor/Interest, provider/admin only for Care groups (members comment and react).

**Meets/Events tab:** Upcoming meets rendered via CardMeet with "Create meet" CTA. Care groups label this "Events" (same data, different framing). Visibility is gated by `careConfig.eventsEnabled` for care groups: event-driven categories (training, walking, boarding, venue) show it; appointment-driven categories (grooming, rehab, vet) hide it.

**Members tab:** Member list with avatars, dog names, roles (admin badge), and connection state indicators.

**Services tab (Care, conditional):** Provider's service menu — titles, descriptions, pricing, "Book" CTAs. Visibility is gated by `careConfig.serviceListingsVisible`. Event-driven categories (training, walking, venue) hide the tab — each meet IS the service offering, with price + spots + booking flow already on the meet card; a separate Services tab would duplicate the same content. Appointment-driven categories (grooming, rehab, vet) show the tab — no events, so this is the only booking surface. Boarding shows both. The `serviceListings` data field stays populated regardless: used by `CardGroup` for Discover-card pricing snippets and reserved for future on-demand 1-on-1 booking surfaces on the provider profile.

**Gallery tab (Care only):** Three display modes — standard (grid), portfolio (before/after pairs), updates (date-grouped chronological). Mode is set per care group based on provider category.

### Visibility

| Setting | Who can see | How to join | Who can post meets |
|---------|------------|-------------|-------------------|
| **Open** | Anyone browsing | Join directly | Any member (Park/Neighbor/Interest), provider only (Care) |
| **Private** | Members only | Invited or request approval | Admin or any member |

### Care group configuration

Care groups have additional configuration. See [[Groups & Care Model]] for full provider type mapping and config defaults.

Key fields: `careCategory` (training/walking/grooming/boarding/rehab/venue/vet), `hostedBy`/`hostedByName` (provider link), `serviceListings` (service menu), `galleryMode`, `locationFixed`, `capacityEnabled`, `careConfig` (full config object).

---

## Meets (Events)

### Core concept

A meet is an event within a group. It has its own date/time, location, attendee list, type, and rules. Meets link to their parent group via `groupId`.

### Meet detail view

Meet detail uses a tabbed layout:

| Tab | Content |
|-----|---------|
| **Details** | Type badge, date/time, location, duration, description. Type-specific info (pace, terrain, age range, etc.). RSVP actions. Link to parent group. Includes a "Who's coming" summary card with tier-sorted avatar stack, tier-aware count line ("3 of 8 going / 2 people you know"), and dog-first social proof when no known people are going ("Rex, Luna + 4 more dogs"). Terminology: "people you know" spans both Connected and Familiar; "connections" is reserved for Connected only. |
| **People** | Attendee list rendered via `PersonRow` (variant `meet-attendee`) with the owner-forward avatar pattern (`OwnerDogAvatar`, extracted from the post-meet review during this phase). **Disclosure model:** information is open — any viewer sees attendees grouped by relationship state. Going section: Connected (top, viewer pinned to first slot) → Familiar (subsection header) → other tier-2 attendees (Pending / Open / inbound `theyMarkedFamiliar` — flat, unlabeled to preserve deniability for inbound Familiar marks). Interested section repeats the same structure if anyone RSVP'd Interested. Locked attendees → chip list at the bottom (names + small avatars, no row affordance). **Recurring meets get a lens pill row** at the top: `[All]` plus the next 3 upcoming dates. **All** = series community — union of past + upcoming attendees + series-level Interested followers, with a "Following this series" subsection between Interested and Locked. **Date pills** = that occurrence's specific roster via `getOccurrenceAttendees`. Default lens is the first upcoming date (most operational: "who's coming next"); past-only series fall through to All. One-off meets skip the pill row. Frequent-attendee / "regular" treatment within the All view is filed as punch-list P34. **Action is gated by attendance:** Familiar / Connect / Message pills appear only for viewers who attended a past occurrence of this meet. Pre-meet, no-show, and non-attendee viewers see the same content with no action affordances. Gating is series-level (any past occurrence counts) regardless of selected lens. The "earned reward" for showing up is the deepening, not the visibility. **Implementation:** `viewerCanAct(meet, viewerId)` in `lib/meetUtils.ts` is the People-tab gate (true iff viewer was Going on a completed one-off meet OR on any past occurrence of a recurring meet); the parallel cross-attendee gate for the Group Members tab is `viewerSharedMeetWith(viewerId, subjectId)` in `lib/mockMeets.ts`. Same principle, two helpers — both consumed by passing `actions={[]}` to `PersonRow` for the info-only mode. Roster helpers: `getSeriesAttendees(meet)` (`meetUtils.ts`) returns the deduped All-lens roster; `getSeriesFollowers(meet)` (`mockMeets.ts`) returns followers as MeetAttendee-shaped objects via `getUserById` lookup. Tier classification via `getAttendeeTier()` in `lib/meetUtils.ts`. Deniability guardrail (no UI may explain WHY a row was promoted) lives in `PersonRow` (pill suppression) and `ConnectionIcon` (single rendering across directions). The post-meet review sheet (`PostMeetReviewSheet`) coexists with People-tab inline actions — different jobs: the sheet is the warm-moment guided pass with the bulk action and explainer; the People tab is the persistent surface where you can act later. |
| **Photos** | `MeetPhotoGallery` — photo grid wired to mock data for completed meets. For completed meets with no photos, a share prompt (CameraPlusFill icon + "Share your photos from this meet") encourages attendees to add photos. For upcoming meets, tab shows a placeholder. **Visibility gating** (`Content Visibility Model.md` §1): attendees and group members see the full gallery; non-members of an open group with a `group_only` meet see a 1-photo tease + "Join [Group] to see all"; private/approval groups gate fully (no tease). |
| **Chat** | Event-scoped coordination thread. Requires RSVP to participate. Time-bound — "running late", "great walk today!" |

### Meet types

Four types with type-specific creation fields and display:

1. **Walk** — pace, distance, terrain, route notes
2. **Park hangout** — drop-in window, amenities (fenced/water/shade/benches), vibe
3. **Playdate** — dog age range, play style, fenced area, max dogs per person
4. **Training** — skill focus, experience level, led by (peer/professional), trainer name, equipment

All types share enhancement fields: energy level, what to bring, accessibility notes.

**Not yet built:** Outing type (destination, logistics).

### RSVP states

- **Going** — committed, counted toward capacity
- **Interested** — social signal, not counted toward capacity (one-off meets only) OR series-level subscription (recurring meets — see Recurrence model below)

**One-off meets:** single Going/Interested dropdown in the top action row. Tap cycles through Going → Interested → Not going.

**Recurring meets:** per-occurrence Going + Skip on each upcoming date row + a separate series-level Interested toggle. Going commits to that specific date; Skip explicitly marks "not this one" without changing series-level subscription.

**Paid (care-group) meets:** RSVP is replaced by Book — opens `ServiceBookingSheet`. One-off paid: Book CTA on the service info card (RSVP dropdown suppressed). Recurring paid: per-row Book button on each Upcoming dates row. Booking propagates to Schedule via `setMeetRsvp` (`lib/mockMeets.ts`) — flips per-occurrence row to a Booked state and surfaces the meet under Schedule → Upcoming + Meets → Going.

RSVPs and bookings made on the meet detail page propagate to mockMeets in-memory (survives navigation, not page reload — reload-safe persistence is Schedule & Bookings Deep Pass scope).

### Recurrence model

A meet's `cadence` field (`"one_off" | "weekly" | "biweekly" | "monthly"`) decides whether it's a single event or a *series* anchored at `(date, time)`. RSVP semantics differ:

- **One-off meets:** Going / Interested attach to the meet directly (the legacy model). Stored on `Meet.attendees`.
- **Recurring meets:** Per-occurrence Going + Skip on each upcoming date. Going commits to that specific date; Skip explicitly marks "not this one" without changing the user's relationship to the series (Skipped rows render muted in place with an inline Undo). Per-date attendees live on `Meet.attendeesByDate` (sparse, keyed by ISO YYYY-MM-DD). Skip persistence: `useDismissedReviews` hook with `kind: "meet-skip"`.
- **Series-level Interested:** A separate, lighter affordance on recurring meets — soft commitment to the series without committing to specific dates. Surfaces the series in Discover and opts into upcoming-date notifications. Stored on `Meet.followers` (the underlying field name is historical; UI labels it "Interested").

The split applies only when `cadence !== "one_off"`. Per-occurrence Interested was considered and dropped — "maybe to a specific Wednesday" added noise without much value. Skip is the sharper second affordance per row.

**Read paths.** `lib/meetUtils.ts` provides:
- `isRecurring(meet)`, `recurrenceLabel(meet)` — convenience.
- `nextOccurrenceDates(meet, count, from?)` — derive upcoming dates from `(date, cadence)`. Honors `seriesEndDate`.
- `getOccurrenceAttendees(meet, date)` — single primitive for "the right attendee list for this date." One-off → `meet.attendees`; recurring → `attendeesByDate[date] ?? []`.
- `getMeetOccurrences(meet, count, from?)` — `[{ meet, date, attendees }]` for "what's coming up."
- `getDisplayDate(meet)` — single date a card-style summary should show. For recurring, the next upcoming occurrence (prefixed "Next:" in card UI).
- `getMeetRole(meet, userId, date?)` — instance-aware role when `date` is provided; series-level fallback otherwise.

`lib/mockMeets.ts` adds `getUserMeetInstances(userId)` (per-occurrence) and `getFollowedSeries(userId)`.

**Meet detail UI for recurring meets.** The detail page renders an "Upcoming dates" section listing the next ~3 occurrences with per-row Going + Skip. The series-level "Interested" toggle in the top action row replaces the single RSVP control. "Who's coming" defaults to the next occurrence's roster.

**Carrying both fields.** On recurring meets, `meet.attendees` stays populated as a *representative* list (typically next-occurrence) so legacy callsites — cards, summaries, post-meet review — continue to render without per-call migration. The authoritative per-date data is on `attendeesByDate`. Surfaces that need to be instance-aware (Schedule cards, meet-detail RSVP rows, Who's coming) read via `getOccurrenceAttendees`. This is a deliberate prototype tradeoff documented in `Meet.attendees` and the `meet-recurrence-model` phase board.

**Per-occurrence cancellation.** A host can cancel a single date of a recurring series without killing the series. Stored on `Meet.cancelledDates` — sparse `Record<ISO date, { reason; cancelledAt }>`, distinct from series-level `meet.status === "cancelled"` + `meet.cancellationReason`. Affordance lives on the meet-detail "Upcoming dates" rows: a quiet inline "Cancel" link sits alongside the host's Hosting pill; tapping opens `CancelOccurrenceModal` (`components/meets/CancelOccurrenceModal.tsx`) — reason required because attendees see it. Confirmed cancellation mutates via `setOccurrenceCancellation(meet, date, reason)` in `lib/mockMeets.ts`. The cancelled row renders muted with strikethrough title + reason caption; attendees see a "Cancelled" pill, host sees a single-tap Restore (no modal — undo doesn't need the gauntlet). On Schedule, cancelled occurrences keep rendering on Upcoming with the same muted treatment + reason caption (calendar-app convention: don't silently disappear). They're filtered out of the History review pipeline (`isOccurrenceCancelled` gate in `app/schedule/page.tsx`) — a host-cancelled date isn't a reviewable past meet. Read paths in `lib/meetUtils.ts`: `isOccurrenceCancelled(meet, date)` and `getOccurrenceCancellation(meet, date)` — both fall back to series-level cancellation for one-off meets so callers can use one helper for either shape.

**Cancel vs Skip distinction.** Cancel is a host action affecting all attendees (mutates `cancelledDates`, surfaces on every viewer's Schedule). Skip is a user action affecting only that user (persists via `useDismissedReviews` with `kind: "meet-skip"`, hides the row in place with inline Undo). The two states are independent and the cancellation supersedes Skip — a cancelled occurrence renders as Cancelled even if the user had Skipped it.

**Out of scope (future):** per-occurrence editing (different time/location/cover on a single instance — cancel kills, doesn't reschedule), end-of-series UI semantics, full notification delivery for Following, broadcast notification when a host cancels a date (the data is in place; the delivery pipeline belongs to Inbox & Notifications).

### Care-group meets (paid sessions)

Meets hosted inside care groups can carry a `serviceCTA` field — `{ label, price, spotsLeft, href }` — marking them as paid sessions. When present, the meet renders differently from a peer meet:

- A "Paid session" pill appears in the badge row next to the type pill (Storefront icon, info colour).
- A **service info card** renders near the top of the content area (above Upcoming dates / Hosted by / Who's coming). Provider avatar + "From [care group] →" link + service label + price + spots-left. Heading reads "Book this session" for one-off, "About this service" for recurring.
- **Booking is the only commitment path.** The standard RSVP dropdown is suppressed for one-off paid meets — the Book CTA on the service info card carries the action. For recurring paid meets, per-occurrence Book buttons replace the per-row Join button on each Upcoming dates row.
- The series-level "Interested" toggle still renders on recurring paid meets (subscription without committing to specific dates).

**`ServiceBookingSheet`** — lightweight booking sheet at `components/meets/ServiceBookingSheet.tsx`. Different from `BookingModal` (open-ended provider booking with date-range and service picker). The sheet pre-fills date / time / provider / price from the meet + tapped occurrence; the user adds an optional message and confirms. Success state shows a brief confirmation. On confirm, the per-occurrence row flips to a Booked state (secondary variant, Check icon, disabled — cancellation lives elsewhere).

Triggers:
- One-off paid meet: the Book CTA on the service info card → opens sheet pre-filled with `meet.date`.
- Recurring paid meet: each Upcoming dates row's Book button → opens sheet pre-filled with that occurrence date.

Row meta line on recurring paid meets carries the price too: "10:00 · 350 Kč · 1/6 booked".

### Meet-card anatomy (shared spec)

Meet cards appear across Discover, Schedule, Group detail, Community feed, and a compact variant used in chat-context strips. They share the same content stack so the card-to-detail transition feels continuous. Full reference implementation: `components/meets/CardMeet.tsx`.

**Every card carries, in this order:**

1. **Type pill** — icon + label. Canonical icons: walk → `PersonSimpleWalk`, park hangout → `Tree`, playdate → `PawPrint`, training → `Target` (all 16px, weight `"light"` when inline in the pill row).
2. **Title** — heading font, 16px, 600 weight.
3. **Date + time** — `formatMeetDateTime(date, time)`. Calendar icon 16px light.
4. **Location** — `MapPin` icon + text.
5. **Group chip** *(when relevant)* — `UsersThree` + group name, info color, clickable to the group.
6. **Count line** — "N/max going · M dogs" (or "M dogs" when in-group).
7. **Dog-forward avatar stack** — dog photos primary. See "Dog-forward avatars" below.
8. **Status indicator** *(when viewer has a role)* — small inline icon + colored label sitting at the right end of the avatar row. Hosting (flag, brand) / Going / Booked (check, brand) / Interested (filled star). Intentionally NOT chip/pill-shaped — the same icon+label vocabulary is used as an interactive RSVP button on the meet detail page; on a card the treatment must read as status, not as a tappable control.
9. **Surface-specific signals** — activity text, spots-left warning, service CTA strip (paid meets only).

**No cover photo on cards.** Cards don't expect a cover image. Cover photos are optional on creation; forcing them into the card visual would punish meets without one and make routine walks look like curated events. Continuity with the detail page is carried by anatomy consistency (same type pill, same title typography, same date format, same group chip, same dog-first attendee rendering), not by echoing an image.

**Dog-forward avatars.** Cards lead with dogs, not owners. The stack shows up to 5 dog photos (28px, -8px overlap); overflow renders as "+N". The count line says "3 people · 4 dogs" (not "4 dogs" under "3 people" avatars). Dog photos are resolved via `getDogImageByOwnerAndName(userId, dogName)` in `lib/dogLookup.ts` — if a dog's photo can't be resolved, that attendee falls back to their owner avatar in the same slot, and the count line still reports the real total. Rationale: dog photos are the recognition hook; owner identity lives on the detail page.

**Per-surface variants:**

| Surface | Component | Notes |
|---|---|---|
| Discover — Meets | `CardMeet variant="discover"` | Full spec. Spots-left warning when ≤ 5 spots left. |
| Schedule — upcoming/history | `CardMeet variant="schedule"` | Role passed explicitly. Free meet → "Joining"; paid meet → "Booked". RSVP count signal for hosts. |
| Group detail — Meets tab | `CardMeet variant="group"` | Group chip is redundant here — hide it. Show dog count inline instead. Role derived from viewer; non-paid → "Going", paid → "Booked", host → "Hosting". Book CTA suppressed when viewer is host or already going. |
| Community feed — upcoming | `FeedUpcomingMeet` | Mirrors CardMeet anatomy directly. "Coming up" leads inline with the date row (brand-main + filled clock icon). Surfaces only when viewer is attending and meet starts within 48h (see `lib/mockFeed.ts` → `getHomeFeed`). |
| Community feed — completed meet | `FeedMeetRecap` | Photo row replaces the dog-avatar stack (photos carry the social proof); type pill + date still required. |
| Group detail — chat context strip | `MeetCardCompact` | 200px wide, horizontal scroll. Keep type pill, title, date/time, location, small dog-name row (no avatars — no room). |

When adding a new meet-card surface, start from `CardMeet` and diverge only where the surface genuinely requires it.

### Visibility (per meet)

Every meet belongs to a group (required field `Meet.groupId`). Within that group, the meet carries its own `visibility: MeetVisibility` — `"public"` or `"group_only"`:

| Group visibility | Meet `visibility` | Who can see & RSVP |
|-----------------|-------------|-------------------|
| Open group | `"public"` | Anyone |
| Open group | `"group_only"` | Group members only |
| Private / approval group | `"group_only"` (forced) | Group members only |

The creation form enforces this: private and approval groups disable the public option. Only open groups offer both choices.

**Planned: `participants_only`.** A third visibility level for meets generated by a package booking or contracted 1-on-1 — visible only to creator + roster, never surfaced on the group's Meets tab. Tied to the Services-as-Catalog model. Spec lives in [[Content Visibility Model]] §1; tracked in Open Questions §4 + punch-list.

### Post-meet connection

`PostMeetReviewSheet` (`components/meets/PostMeetReviewSheet.tsx`) — two-step modal sheet triggered from the History tab's review-recent section. Step 1 reflects on the meet (recap card + photo upload + caption). Step 2 ("Make connections") surfaces attendees grouped by relationship state.

**Make Connections step (state-grouped sections):**

- **Top (unlabeled)**: Not Familiar — most cards live here. Inline pill EVOLVES with the mark: `Familiar` (outline) → `Connect` (secondary outline) → `Connect ✓` (primary brand-fill). When marked, a quieter footer appears below: `✓ Familiar` label + `Undo` link.
- **Familiar**: previously marked. Inline secondary Connect pill (only escalation available).
- **Connected**: already mutual. Inline primary Message pill.
- **Locked profiles**: tier 3 attendees, name + small avatar pills only, no actions.

**Cards use an owner-forward layout** — owner avatar 64px primary + dog(s) 32px overlapping bottom-right (rounded-md, white box-shadow ring). Distinct from `PersonRow`'s pattern; cascade to other surfaces tracked in punch-list P27.

**Profile-state-aware explainer** at the top: locked viewers see lock-icon header + "People who don't know you only see your name and [primary dog]" + bold-labeled Familiar/Connect lines. Open viewers see globe-icon header + Connect-only explanation (Familiar redundant for them).

**Bulk action**: "Mark everyone familiar" — applies only to the Not Familiar bucket where Familiar is matrix-applicable. Morphs in place to `✓ N marked Familiar` + `Undo` link after firing. Bound to `familiarApplicable` set so it doesn't promise actions for Connected/already-Familiar/Pending attendees.

**Footer buttons** use the system-primary pattern (`primary` no `cta`) — dark fill, no pill, small radius. Footer = navigation; body = decisions; visual hierarchy reflects that.

This remains the highest-intent moment for building relationships — connecting with people from your group after a shared experience. Action matrix v3 (Familiar gates Connect for locked viewers) lives in `lib/personActions.ts`; deniability guardrails (no UI explaining cause) preserve the silent-grant principle.

---

## Key Decisions

1. **No Chat tab on groups.** Feed posts with flat comments handle async discussion. Meet-level chat handles real-time coordination. Inbox handles private messages. Three surfaces, no overlap.
2. **Public meets remain the default entry point** — low barrier for new users.
3. **Post-meet connect prompts** are the primary connection trigger, now within group context.
4. **Location flexibility** — meet creators set their own meeting point.
5. **Recurring meets** — weekly / biweekly / monthly on the same day/time. RSVP is always per-occurrence: each upcoming date has its own Going + Skip controls. Series-level subscription is a separate "Interested" toggle in the top action row.
6. **Care groups use "Events" label** for meets — same data model, different framing.

---

## Routes

| Route | What |
|-------|------|
| `/discover/meets` | Meet browse with filters |
| `/discover/groups` | Group browse with filters |
| `/meets/[meetId]` | Meet detail (Details · People · Chat tabs) |
| `/meets/create` | Legacy route — redirects to `/activity` and opens the `MeetComposer` ModalSheet. New creation flow is an overlay; entry points call `useMeetComposer().openComposer({ groupId })` directly. |
| `/communities/[id]` | Group detail (tabs vary by type) |
| `/home` | Community tab with category sub-tabs (All/Parks/Neighbors/Interest/Care) |
| `/schedule` | My Schedule (top-level, shows meets + care bookings) |

---

## Not Yet Built

- ~~**Meet detail tabs**~~ — **done** (Details · People · Chat)
- ~~**Group Chat tab removal**~~ — **done** (removed from neighbor/interest groups)
- ~~**Feed comments**~~ — **done** (flat comment UI on group Feed posts, local-state add, built in Content Completion A2)
- **Outing meet type** — specced but not built
- **Multiple chat threads per group** — deferred
- **Map-based meet/group discovery** — deferred
- **Attendance patterns** — "Petra usually comes Tuesdays" — deferred
- **Share profile link** — `/connect/[shortcode]` for IRL-to-app connections — deferred

---

## Related Docs

- [[Product Vision]] — community-first thesis, groups as the core
- [[Groups & Care Model]] — group taxonomy, provider types, configuration model, user journeys
- [[connections]] — post-meet connect flow, connection states
- [[schedule]] — meets in the user's schedule
- [[Content Visibility Model]] — two-gate visibility rules for group content
- [[messaging]] — inbox conversations (separate from group feed and meet chat)

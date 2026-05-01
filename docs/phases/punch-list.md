---
status: active
last-reviewed: 2026-04-30
review-trigger: "any time — add items as they're noticed, fix them when convenient"
---

# Punch List

Running list of UI tweaks, small bugs, and visual fixes that live permanently alongside whatever phase is active. Items get added as they're noticed and fixed when there's time.

---

## Workflow

This section tells the agent how to run a punch list session. Read and follow these instructions when working from this file.

### Adding Items

- Add new items to the **Open Items** table with the next available number, a description, category, affected page/area, any file or doc references that will help when fixing it, and today's date.
- Keep descriptions specific enough that someone can fix them without asking follow-up questions.

### Working on Items

1. **Read this file first.** Pick items to work on (user may specify, or choose by priority/proximity).
2. **Read only the referenced docs/files** for the items being worked on. Do not review the full doc tree.
3. Fix the items. If a fix touches a feature doc, design-system.md, or design-tokens.md, update those docs too.
4. Move completed items from **Open Items** to **Done** with today's date.
5. Write a **Change Report** entry below with: date, items fixed, files changed, and any doc updates made.

### Promoting Items

If an item turns out to be too large for a quick fix (needs design thinking, touches multiple pages, or would take more than ~30 minutes):

1. Move it from **Open Items** to **Parked**.
2. Add a one-line note explaining why it was promoted.
3. Add it to the **Backlog** section in `ROADMAP.md` so it gets picked up in future phase planning.
4. Don't let it sit silently — the point is that nothing gets lost.

### Review

Punch list changes are reviewed as part of the phase open/close lifecycle (see CONTRIBUTING.md). Between phase boundaries, change reports below serve as the audit trail.

---

## Open Items

| # | Description | Category | Page/Area | Refs | Added |
|---|-------------|----------|-----------|------|-------|
| P41 | **Share-profile link affordance + privacy-explainer page coverage.** Two related gaps: (1) the share-link bypass mechanism (`/connect/[shareCode]`) exists in code + strategy but has no clear in-product surfacing — audit whether a "Share profile" button is rendered on the user's own profile, and if not, build it. (2) When the privacy-explainer page (P37 destination) lands, it should explain the share-link bypass for the "we already know each other IRL but share no in-app context" case (e.g. Tomáš → Filip, B8). Don't surface the bypass on the locked-no-context lock card itself — keeps that surface focused on the privacy moment. The owner-side framing ("share your link with friends who aren't yet here") is the right place for the affordance, including potentially a hint at first-time profile setup ("Want specific people to see your profile? Share your link"). **Surfaced 2026-04-30** during Mock World Building B8 walkthrough — Shawn flagged that the no-shared-context dead-end should have a path forward via direct link. | Trust / Linking | Owner profile (Share button); future privacy explainer page | `app/connect/[code]/page.tsx`, `lib/personas.ts` (shareCode field), `lib/mockUser.ts` | 2026-04-30 |
| P40 | "Familiar ✓" tag on profile pages should be tappable to reverse the mark. Today the tag is a passive label — there's no way to undo a Familiar mark from the receiving end of the relationship. Recommended pattern: tap the tag → small ModalSheet/popover with "You marked [Name] as Familiar" + "Unmark" button + "Cancel". Friction-by-design — Familiar is a deliberate trust signal, reversing it should also be deliberate, not accidental. Don't surface Connect/Block here (Connect is its own CTA below; Block is a separate concern). Implementation touches `app/profile/[userId]/page.tsx` (the tag-rendering site) plus probably a new small sheet component. **Surfaced 2026-04-30** during Mock World Building walkthrough B3 — Shawn flagged that Familiar tag should be reversible but not encouraged. | Trust / Interaction | Profile page (when viewer has Familiar relationship to subject) | `app/profile/[userId]/page.tsx`, `components/ui/ConnectionIcon.tsx` (or wherever the Familiar tag renders) | 2026-04-30 |
| P39 | Mobile nav "+" button stays in active/brand-strong state while the create-modal it triggered is open. Should reset to neutral once the modal opens (the button isn't "currently selected" — it triggered a transient overlay). Likely a stuck `aria-expanded` or hover/active className that doesn't clear on modal mount. **Surfaced 2026-04-30** during meet-create flow walkthrough. | Visual / Interaction | Mobile nav (any logged-in surface) | `components/layout/AppNav.tsx` (the create button), possibly `LoggedNavLinks` | 2026-04-30 |
| P38 | Generic "+" icon on the mobile nav create button reads as ambiguous — what's being created? Currently the action IS context-aware (post on most surfaces, meet on `/schedule`, meet on group detail) and the AppNav comment claims "icon flips to match" — but in practice the icon may not be flipping per context, OR the icon used (Plus) doesn't visually communicate "meet/post" any more clearly than a generic +. Audit: check what icon renders on each context (group detail, schedule, home, discover, profile) and pick more specific icons (e.g. `CalendarPlus` for meet creation, `PencilSimple` or `ChatCircleDots`-with-+ for post). The brand pill itself can stay; just the icon needs to communicate intent. **Surfaced 2026-04-30** during meet-create flow walkthrough. | Visual / Content | Mobile nav (any logged-in surface) | `components/layout/AppNav.tsx` (`LoggedNavLinks`, look for `Plus` icon) | 2026-04-30 |
| P37 | "Learn how privacy works" link on Locked profile pages — currently a placeholder (`href="#"`, `onClick` no-ops) added 2026-04-30 during Mock World Building locked-profile copy update. Wire it to a real privacy explainer page. The destination should explain the privacy model (open vs locked, who sees what, how Familiar marks unlock visibility) and double as the route the viewer can adjust *their own* settings from — the lock card is the natural moment for a new user to wonder "wait, am I locked too?" Could live at `/profile?tab=privacy` (settings) or as a standalone explainer at `/help/privacy`; decide when the page is built. **Surfaced 2026-04-30** during locked-profile copy review. | Content / Linking | Locked profile state (any `/profile/[userId]` where viewer has no relationship to a Locked owner) | `app/profile/[userId]/page.tsx` (the placeholder anchor element) | 2026-04-30 |
| P1 | "Any" filter pill logic — selecting Any + a specific filter shouldn't be possible, toggle behavior still wrong | Interaction | Discover filters | | 2026-04-10 |
| P36 | Mock-user `profileVisibility` distribution skews too Open. Per the community-first thesis, most users should default to **Locked** (privacy-by-default) — Open is the exception for users who actively want discoverability (providers needing clients, socially comfortable owners, etc.). Current mock data has many Open profiles, which weakens the demo of the privacy model: the Locked chip list rarely fills up, the trust ramp (None → Familiar → Connected) loses urgency, and Workstream B's New User test (B5) shows most members as visible cards rather than mostly-Locked. Recommend ~70% locked / 30% open as a starting ratio, with the open subset being mostly Helper/Provider tier carers + a few "social anchors" per neighbourhood. Keep providers (Klára, Olga, etc.) Open since their service visibility depends on it. **Surfaced 2026-04-29** during Community & Groups Deep Pass B5 walkthrough. Belongs to **Mock World Building**. | Mock data | App-wide | `lib/mockUsers.ts` (every UserProfile's `profileVisibility`) | 2026-04-29 |
| P35 | Inbox conversation rows — name + dog data inconsistency. Some rows show full last names ("Lucie Černá", "Shawn Talvacchia"), others show last initial only ("Jana K."). Some rows include a dog name (Spot, Hugo, Goldie) under the paw icon, others don't. Likely a `lib/mockConversations.ts` (or upstream `lib/mockUsers.ts`) data hygiene issue — rows pull a snapshot of name/dog from somewhere and the seeded values aren't normalized. Fix: pick one display format (recommend `firstName + lastNameInitial` for compactness across cultures) and ensure every conversation row populates a dog when the partner has one. Likely fits **Mock World Building**, but small enough to take sooner if convenient. **Surfaced 2026-04-29** during Community & Groups Deep Pass walkthrough item 8 (inbox regression check). | Mock data / Content | Inbox | `app/inbox/page.tsx`, `lib/mockConversations.ts`, possibly `lib/mockUsers.ts` | 2026-04-29 |
| P34 | Frequent-attendee badges / regular treatment on the People tab "All" view for recurring meets. Currently the All lens lists everyone who's ever been associated with the series flatly — no signal that someone came to 5 of the last 6 walks vs. one walk a year ago. Options: (a) "Regular" pill next to the name (similar to the Care badge); (b) attendance-frequency contextual line ("Came to 5 of last 6"); (c) sort priority — regulars surface first within each relationship-state section; (d) some combination. Pairs with P29 (soft Familiar indicator) — both are quiet trust/social-proof signals on person rows. **Surfaced 2026-04-29** during Community & Groups Deep Pass A workstream walkthrough — Shawn rejected a separate "Past" pill in favor of frequency expressed as a treatment on cards within the All view. Belongs to a future phase or punch-list pass; not blocking the A workstream. | Trust / Design | Meet detail People tab (recurring) | `components/meets/ParticipantList.tsx`, `components/people/PersonRow.tsx`, `lib/meetUtils.ts` (would need a `getAttendanceFrequency(meet, userId)` helper) | 2026-04-29 |
| P2 | Group size slider has no "no max" option — some groups are unlimited | Interaction | Discover filters / group creation | | 2026-04-10 |
| P3 | Schedule care cards need header info — drop-off time or relevant scheduling detail | Content | My Schedule | | 2026-04-10 |
| P4 | Provider ID mismatch — *not* a simple rename. **Investigated 2026-04-25:** `mockData.ts` providers use `olga-m`, `nikola-r`. `mockUsers.ts` has a `nikola` UserProfile (provider Nikola has a `userId: "nikola"` bridge field) but **no Olga UserProfile at all**. Same gap exists for other providers (`jana-k`, `tomas-b`, `marketa-h`, `pavel-d`) — they're directory-only, not full users. Pick one: (a) backfill UserProfiles for every provider so meets/posts/connections work uniformly, or (b) decide that providers are a separate identity surface and document the bridge pattern. Belongs in **Mock World Building**, not a quick fix. | Data | Mock data files | `lib/mockData.ts`, `lib/mockUsers.ts`, `lib/mockMeets.ts`, `lib/mockBookings.ts`, `lib/mockConversations.ts` | 2026-04-10 |
| P5 | ButtonAction variant system — `destructive` should be a modifier (like `cta`) not a standalone variant, to combine with primary/secondary/tertiary. Current destructive too strong for inline "Decline" | Design system | ButtonAction | `components/ui/ButtonAction.tsx`, `design-system.md` | 2026-04-13 |
| P8 | Profile Posts tab — losing corner radius on post images (attribution + header link DONE in Profiles Deep Pass B2/B3) | Visual | Profile | `components/posts/FeedCommunityPost.tsx` | 2026-04-13 |
| P9 | `meet-care-1` cover (`spot-park-walk.jpeg`) is a personal one-dog shot, off-theme for a "Calm Dog Group Session" — swap for a group-training or calm-group image | Content | Mock data | `lib/mockMeets.ts` | 2026-04-24 |
| P10 | DogsNearYou unclear product role — only renders in new-user mode (`DEMO_NEW_USER`), header count is hardcoded (`mockNeighbourhoodStats.activeDogs = 52`), "Vinohrady" label is hardcoded, and the dog list is actually every meet attendee's dog (not filtered by locality). Decide during **Community & Groups Deep Pass** whether this is: onboarding-only scaffold, always-on dog-discovery surface on Community, a Discover-page tile, or killed entirely. Fix the mismatches once the product role is decided. **Resolved 2026-04-29 (Community & Groups Deep Pass E3, data side):** kept onboarding-only. `getNeighbourhoodStats(neighbourhood)` now takes a neighbourhood arg; activeDogs is computed from `allUsers` filtered by neighbourhood (real number). DogsNearYou reads `useCurrentUser().neighbourhood` (defaults to "Vinohrady" for the new-user persona who has no neighbourhood set) and filters dogs by owner's neighbourhood. Always-on / Discover-tile rebuilds remain deferred. | Design / Content | Community feed | `components/home/DogsNearYou.tsx`, `lib/mockNeighbourhoodStats.ts`, `app/home/page.tsx` | 2026-04-25 |
| P12 | Meet location input — currently free-text. `Meet.lat` and `Meet.lng` exist in the type but the form doesn't collect them, so attendees can't tap for directions and there's no way to disambiguate (Stromovka big field vs east gate). Recommended post-demo: Prague-specific POI autocomplete using a curated list of 40-60 dog parks + tram stops + addresses. Backfills lat/lng from the POI list; no external API dependency; feels locally considered. Alternative paths: full map picker (Google/Mapbox) or text + optional "drop a pin." Decide during either Community & Groups Deep Pass (care groups at fixed locations need this too) or a dedicated Geo & Discovery pass. | Design / Data | MeetComposer location field + meet detail map/directions | `components/meets/MeetComposer.tsx`, `lib/types.ts` (Meet.lat/lng), possibly a new `lib/praguePlaces.ts` | 2026-04-25 |
| P16 | Orphan files in `components/activity/`: `MyScheduleTab.tsx` and `ServicesTab.tsx` have no live importers (the old `/activity` route is now a redirect-only shim, and `app/bookings/page.tsx` no longer imports `ServicesTab`). Verify zero importers, then delete. | Cleanup | Code hygiene | `components/activity/MyScheduleTab.tsx`, `components/activity/ServicesTab.tsx` | 2026-04-25 |
| P22 | Explore: occasional feed card as a secondary trigger for the post-meet review walkthrough. Rejected for now — and notifications are explicitly OUT (would feel like a productivity nag, undermines the trust/community vibe). The History tab is the primary, canonical entry point. A feed card could be a quiet additional surface IF carefully gated — not "every completed meet" (becomes noise), but contextual signals like: lots of new people the user hasn't marked Familiar, photos were posted by others, or it's been N days since a meet they haven't reviewed. Per-card dismissable like the History cards. Build only if testers report missing the prompt without it. **Not for**: inbox/chat triggers (too pushy in a social context), profile prompts (productivity-nag tone). | Design exploration | Home feed | `components/feed/`, `lib/dismissedReviews.ts` (could share dismiss state) | 2026-04-26 |
| P21 | Group ↔ meet relationship duplicated in two places. Each `Meet` has a `groupId` field; each `Group` has a `meetIds` array. They drift — e.g. group-1 lists only `meet-1` in its `meetIds`, but `meet-4` declares `groupId: "group-1"` and never makes it into the array. `getGroupMeets` was patched 2026-04-26 to take the union of both, papering over the inconsistency. Real fix: pick one as the source of truth and make the other derived (or remove it). My recommendation: keep `m.groupId` (single source on the meet side, naturally maintained when authoring meets), drop `Group.meetIds` entirely. Belongs in **Mock World Building** since it's a data-shape decision. | Mock data | App-wide | `lib/mockGroups.ts`, `lib/mockMeets.ts`, `lib/types.ts` (Group + Meet shapes) | 2026-04-26 |
| P20 | Mock-date staleness sweep — Feb/March timestamps. The relative-date pattern (`lib/mockDate.ts` → `daysAgo`/`daysFromNow`/`daysAgoIso`) was applied 2026-04-26 to every `2026-04-*` date in `lib/mockMeets.ts`, `lib/mockBookings.ts`, `lib/mockNotifications.ts`, `lib/mockConversations.ts`, `lib/mockPosts.ts`. Older timestamps (Jan/Feb/March 2026, Dec 2025) were left static as "deeper history." That's mostly fine, but check whether any of those drive UI that benefits from being relatively recent — e.g. "completed bookings" with notes that say "2 weeks ago" reading as "3 months ago." If a sweep is needed, follow the same pattern: shift via Python anchored to MOCK_NOW = 2026-04-26. **Also worth verifying:** `createdAt` timestamps on meets in `mockMeets.ts` (kept static since they're "when this was authored" metadata) — confirm they don't surface as "X ago" labels anywhere. | Mock data | App-wide | `lib/mockDate.ts`, all `lib/mock*.ts` files | 2026-04-26 |
| P33 | CONTRIBUTING.md phase-archive wording — currently prescribes "copy to archive/, mark status: archived, delete original" as a two-step. `git mv` is the cleaner operation: single command, atomic in git history, no opportunity for duplicate files when delete fails. Suggested rewrite: "Mark status: archived in frontmatter, then `git mv docs/phases/<name>.md docs/archive/phases/`". The two-step has no functional benefit (git rename detection works for both cp+rm-in-one-commit and mv); the rationale was clarity-of-reading, not a real workflow advantage. **Surfaced 2026-04-29** during Meets Deep Pass + Trust & Visibility Pass close — the prescribed two-step left orphan duplicates when sandbox blocked the delete step. | Doc hygiene | Workflow doc | `docs/CONTRIBUTING.md` → "Closing a Phase" → "Archive the phase board" line | 2026-04-29 |
| P32 | People tab disclosure model — separate **information** (open) from **action** (gated). **Pre-meet (any viewer):** owner+dog cards with names, grouped by relationship state (Connected, then Familiar, then unmarked tier-1/2). **NO action pills** — the cards are info-only. Locked attendees → chip list at the bottom (matching post-meet review treatment). **Post-meet (attendee):** same content + action pills appear (Familiar / Connect / Message). Either keep the post-meet review sheet as the canonical action surface OR enable inline actions on the People tab too — both surfaces would converge on the same content. **Post-meet (no-show):** same as pre-meet — no actions. The "earned reward" for showing up isn't seeing people; it's *deepening* with them. **Implementation cascade:** depends on P27 (owner+dog avatar pattern) since the cards should match the post-meet review's visual vocabulary. Touches `ParticipantList.tsx`, `app/meets/[id]/page.tsx` PeopleTab, and the matrix layer (probably an `actions: false` pass-through prop on PersonRow). **Should ship before first-round testing** per Shawn — this is core to the community-first thesis demonstration. | Trust / Conversion | Meet detail People tab | `components/meets/ParticipantList.tsx`, `components/people/PersonRow.tsx`, `app/meets/[id]/page.tsx` (PeopleTab + isJoined gating logic) | 2026-04-27 |
| P31 | Seed mock data for the post-meet review's "+N" dog chip. No current attendee has 3+ dogs, so the OwnerDogAvatar's "+N" chip rendering (when more than 2 dogs) can't be visually verified. Two cheap options: (a) add a third dog name to an existing attendee record on one past meet — e.g., Shawn at `meet-1` already has Spot + Goldie in his profile, could add a foster dog like "Skip" just on that meet's attendee entry, OR (b) introduce a new ambient character with 3 dogs (rescue/foster narrative) and add them to `meet-reactive-spring` so the demo path naturally exercises both 2-dog and 3+-dog cases. Either works; (b) richer for the demo. Low priority — verification is "look at the card and make sure +N renders correctly." | Mock data | Post-meet review (Make Connections step) | `lib/mockMeets.ts`, `components/meets/PostMeetReviewSheet.tsx` (`OwnerDogAvatar`) | 2026-04-27 |
| P30 | ModalSheet footer button audit — process-oriented footers should use the **system-primary pattern** (`primary` variant, NO `cta` modifier — dark fill, small radius, no pill), NOT the brand CTA pill. Rationale: footer = navigation (advance / close); body = decisions (the brand-colored CTA pills on attendee cards, etc.). Mixing CTA-pill shapes (Continue/Done) with non-CTA small-radius shapes (Maybe later/Back) on the same row reads as inconsistent. The system-primary keeps a clear "this is the way forward" signal without the brand-CTA competing with body actions. **Applied 2026-04-27 to PostMeetReviewSheet** (Continue + Done both → `primary` no CTA). **Sweep candidates:** `BookingModal` Confirm, `ServiceBookingSheet` Confirm + Done, `MeetComposer` Create + success-state actions, `ShareMeetModal` (no footer buttons currently), `PostComposer`, any other ModalSheet consumer. **Don't blindly cascade** — some footers are the legitimate primary action of the entire flow (e.g., BookingModal Confirm IS the commit; the body is just data entry, not decisions). Audit each surface individually. | Design system | App-wide modals | grep `<ModalSheet`, then per consumer audit footer buttons | 2026-04-27 |
| P29 | Soft Familiar indicator on non-grouped person-row surfaces. **Original scope refined 2026-04-29 (Community & Groups Deep Pass D, deferred):** Members tab + People tab now section-group by relationship state, so FAMILIAR-marked rows surface under their own subheader — section grouping IS the indicator there. The remaining gap is **non-grouped surfaces**: Discover lists (group/meet cards, attendee previews), avatar stacks on hero anatomy, compact card-context strips. In those contexts users can't tell "have I marked this person?" without expanding. Quiet visual treatment options: tiny corner check icon overlaying the avatar (16px circle with check), subtle brand-tinted ring around the avatar, or a small "Familiar" label inline. Privacy-safe (own data; no deniability concern). Defer to a focused pass — likely fits during **Discover & Care Deep Pass** (where Discover lists become the primary surface) or a later card-hero anatomy review. | Design / Trust | Non-grouped person surfaces (Discover lists, avatar stacks, compact previews) | `components/people/PersonRow.tsx`, `components/meets/CardMeet.tsx`, group cards, anywhere small avatars stack without section context | 2026-04-27, refined 2026-04-29 |
| P28 | `MeetAttendee.profileOpen` doesn't auto-derive from `UserProfile.profileVisibility` — has to be set manually when seeding mock attendees. Caught us out on `meet-reactive-spring` (2026-04-27): added Marek/Lucie/Petra without `profileOpen: true` → they fell to tier 3 (Locked section) instead of Tier 2 (Not Familiar) because `getAttendeeTier`'s open-profile check defaults to false when neither attendee record nor connection record carries it. **Options:** (a) helper `buildMeetAttendee(user)` that mirrors profileVisibility automatically — preferred for future mock seeding; (b) update `getAttendeeTier` to look up the user's UserProfile when the attendee record's `profileOpen` is missing (heavier — couples runtime tier logic to mockUsers lookup, only works in demo mode). Lean toward (a). Cross-reference whenever someone adds new attendees to mock meets. | Mock data | Mock seeding | `lib/types.ts` (MeetAttendee shape), `lib/meetUtils.ts` (`getAttendeeTier`), `lib/mockMeets.ts` (every attendee literal), `lib/mockUsers.ts` (source of truth for visibility) | 2026-04-27 |
| P27 | Cascade owner+dog avatar pattern (64+32 overlap, 1-many dogs with "+N" chip when more) to all person-listing surfaces. Currently scoped to the post-meet review's `AttendeeActionCard`; users want it everywhere. **Surfaces to update:** PersonRow (`components/people/PersonRow.tsx`) drives meet detail People tab + group Members tab + inbox conversation list + profile pages. **Pattern:** owner avatar primary (large), dog(s) secondary (small, overlapping bottom-right). Dog name list rendered as text in body row ("Bára and Eda" / "Bára, Eda + 2"). Reference implementation in `components/meets/PostMeetReviewSheet.tsx` (`OwnerDogAvatar` + `formatDogNames`) and CSS at `globals.css` (`.pmr-avatar-*` class set — rename to `.person-avatar-*` or similar when extracting). Inverts the prior "dog-forward" principle for *list contexts* — dog-forward stays on the meet card hero anatomy where the dog is the social-proof unit. | Design system | App-wide | `components/people/PersonRow.tsx`, `components/meets/PostMeetReviewSheet.tsx` (reference), `app/globals.css` (`.pmr-avatar-*`) | 2026-04-27 |
| P26 | Per-occurrence cancellation for recurring meets. Today's `cancellationReason` field handles series-level / one-off cancellation, but recurring series cancel one date at a time ("this Wednesday is rained out") far more often than the whole series ends. **Needs:** (a) `Meet.cancelledDates?: Record<string, { reason: string; cancelledAt: string }>` shape, (b) host-side cancel-this-occurrence affordance (no UI exists today — meets get cancelled by editing mock data), (c) per-date Schedule filtering + per-date cancelled rendering on the Upcoming Dates section, (d) cancel-vs-skip distinction (cancel = host action, affects everyone; skip = user action, affects only you), (e) notification triggering for affected attendees. Belongs to **Schedule & Bookings Deep Pass** — booking flows have the same shape problem. | Trust / Schedule | Meet detail (recurring) + Schedule | `lib/types.ts` (Meet shape), `app/meets/[id]/page.tsx` (RecurringUpcomingDates), `app/schedule/page.tsx` (filter), `lib/meetUtils.ts` (instance helpers) | 2026-04-27 |
| P18 | `--surface-gray` overuse — the token reads too dark for the app's light/airy aesthetic and is being misapplied to surface roles that should be lighter (pills, icon containers, avatar slots, hover backgrounds). Convention emerging: pills use brand-subtle / status-tinted / no-background / surface-base; icon containers use `--surface-base`; categorical chips never use the dark surface tone. Fixed 2026-04-26: meet detail "Completed" badge (no background + check icon), `.meet-icon-box` (group avatar slot — `--surface-gray` → `--surface-base`), `GroupDetailPanel.tsx:142` Private/Approval-required pill (`bg-surface-gray` → `bg-surface-base`), `app/communities/[id]/page.tsx:272` Private/Approval-required pill (same fix). Fixed 2026-04-27 (Trust & Visibility A5): community Members tab pill — replaced by `PersonRow` which uses `--surface-inset`/`--brand-subtle`. Fixed 2026-04-27 (Meets walkthrough): three categorical pill classes flipped from `--surface-gray` → `--surface-inset` — `.meet-bring-pill` (Skills covered / Equipment / Bring), `.meet-title-badge`, `.pet-profile-play-pill` (play-style). Still open: `GroupDetailPanel.tsx:398` (likely a connection-state pill, Shawn flagged but deferred), plus remaining raw CSS usages in `app/globals.css` (lines 4338 cal-day today, 12654 .meet-organiser-card hover, 12796 .meet-rsvp-menu-item hover) — these may be legitimately hover-state and OK to leave. For each remaining: decide whether the element is a category chip (brand/status tint), a state chip (no background + icon, like Completed), an icon/avatar container (`--surface-base`), or a hover state (the only role where `--surface-gray` may legitimately be appropriate). | Design system | App-wide | grep `bg-surface-gray` and `var(--surface-gray)` across `app/`, `components/`, `app/globals.css` | 2026-04-26 |

---

## Parked

Items promoted out of the punch list because they're too large for a quick fix. Each should have a corresponding entry in `ROADMAP.md > Backlog`.

| # | Description | Why parked | Parked |
|---|-------------|-----------|--------|
| — | *(nothing yet)* | — | — |

---

## Done

| # | Description | Fixed |
|---|-------------|-------|
| P7 | Post composer modal rebuilt as ModalSheet (desktop modal / mobile sheet) with photo hero, accordion tag rows, suggestion pills | 2026-04-14 |
| P11 | `/activity` vs `/schedule` IA — decision: `/activity` **stays as a permanent thin redirect** for legacy URL compat. Orphan callers updated to point to `/discover/meets` directly (landing hero CTA, landing close-CTA, How-It-Works community CTA, profile About empty-state CTA, signup-success Browse Meets, `/meets` server redirect). | 2026-04-25 |
| P13 | `LayoutSection` sweep — wrapped naked `EmptyState` callsites in `LayoutSection` for `app/meets/[id]/page.tsx` (chat tab × 2), `app/inbox/page.tsx`, `app/bookings/page.tsx` (×2). `components/groups/GroupDetailPanel.tsx` and `app/communities/[id]/page.tsx` already wrapped. `components/activity/MyScheduleTab.tsx` + `components/activity/ServicesTab.tsx` skipped — orphaned (logged as P16). `components/discover/CareTab.tsx` skipped — uses a custom local `EmptyState` div, not the shared component. | 2026-04-25 |
| P14 | Deleted `components/home/HomeWelcome.tsx`. Zero importers confirmed — only references were comments in docs and one comment in `lib/mockUserState.ts`. | 2026-04-25 |
| P15 | Deleted `components/meets/PostMeetReveal.tsx`. The remaining live usage in `app/meets/[id]/page.tsx` PeopleTab was removed (per phase doc D-e: superseded by `PostMeetReviewSheet`). PeopleTab signature simplified — no longer needs `isJoined`. | 2026-04-25 |
| P6 | Booking proposal card buttons — added new `btn-neutral` ButtonAction variant (filled `--surface-inset`, no border, no chroma — for "secondary action without brand commitment"). Updated `BookingProposalCard.tsx`: Decline (left, neutral pill) + Review & sign (right, primary brand pill), both `cta`-shape, auto-width to text. `design-system.md` updated to document the new variant. | 2026-04-26 |
| P17 | Persona-Wiring orphans deleted (file deletion unblocked via `mcp__cowork__allow_cowork_file_delete` during the Meet Recurrence Model phase close). Verified zero importers via import-statement grep (substring matches in earlier agent runs were `mockUsers` containing `mockUser`, etc. — not real importers). Removed: `lib/mockUserState.ts`, `lib/mockUser.ts`, `components/layout/PersonaBanner.tsx`, `components/profile/ChangeUserMenu.tsx`, `A2-A3-HANDOFF.md`, `docs/phases/persona-wiring.md`. TypeScript clean post-deletion. | 2026-04-27 |
| P23 | Dead `ChatTab` code in `app/communities/[id]/page.tsx` deleted as part of Trust & Visibility A5 (the file was being rewritten anyway for the MembersTab → PersonRow migration, so closing P23 in the same patch was natural). Removed: `ChatTab` function, `ChatTabProps` interface, the `activeTab === "chat"` render branch, and 8 imports that became orphan (`ChatCircleDots`, `PaperPlaneRight`, `Handshake`, `PawPrint`, `MessageBubble`, `SystemMessage`, `MeetCardCompact`, `getMessagesForGroup`, `GroupMessage` type) plus the unused `messages` variable. | 2026-04-27 |
| P24 | Orphan group action button CSS deleted as part of Trust & Visibility A5. `.group-action-btn-status` and `.group-action-btn-invite` (43 lines around `globals.css:12125-12167`) had zero remaining usages — verified by codebase grep before deletion. | 2026-04-27 |

---

## Change Reports

<!--
Format:
### YYYY-MM-DD
**Items:** P#, P#
**Files changed:** list
**Docs updated:** list (or "none")
**Notes:** anything notable
-->

### 2026-04-27 (Action matrix v3 — Familiar gates Connect app-wide; "Open profile" indicator removed)
**Items:** none directly; refines in-flight Trust & Visibility Pass work
**Files changed:** `lib/personActions.ts` (matrix), `components/meets/PostMeetReviewSheet.tsx` (explainer copy + dropped Open profile indicator), `docs/phases/trust-visibility-pass.md` (matrix table + rationale)
**Docs updated:** trust-visibility-pass.md → matrix table v3 + new "Familiar gates Connect" rationale
**Notes:** Surfaced during Meets Deep Pass walkthrough on the post-meet review's Make Connections step. Two changes:
  1. **Gating:** locked viewers now see only Familiar in the unmarked state, regardless of subject visibility (open or theyMarkedFamiliar). Connect appears only after marking Familiar. Open viewers unchanged — they still get Connect directly. Reasoning: the trust gradient (Familiar before Connect) is the model's intent; the UI now enforces it. Cleaner one-action-per-card UX in the post-meet review and consistency across PersonRow surfaces.
  2. **Open profile indicator removed** from `AttendeeActionCard`: it leaked deniability info (open profile vs they-marked-me-Familiar should be visually indistinguishable per the D2 silence principle) and was breaking mobile row layout.
  Explainer copy also updated to "People who don't know you only see your name and Bára" (was "These people only saw…" which overgeneralized to attendees the viewer already knows). All consumers of `resolvePersonActions` (PersonRow, AttendeeActionCard) inherit the matrix change automatically.

### 2026-04-27 (Action matrix refinement — Familiar hidden for open viewers)
**Items:** none directly; refines work in-flight on Trust & Visibility Pass
**Files changed:** `lib/personActions.ts`, `docs/phases/trust-visibility-pass.md` (matrix table + rationale)
**Docs updated:** trust-visibility-pass.md → matrix table split + new "why open viewers don't get Familiar" rationale paragraph
**Notes:** Surfaced during Meets Deep Pass walkthrough (post-meet review explainer copy work). The previous matrix collapsed two distinct cases — "I'm open" and "they marked me Familiar" — into a single row, both producing `[connect, familiar]`. Splitting them: open viewers get `[connect]` only; the Familiar action is redundant when your profile is already public (no quiet grant to make). Locked viewers with inbound Familiar still get both actions (Familiar there is meaningful reciprocation). All consumers of `resolvePersonActions` (PersonRow, AttendeeActionCard, etc.) inherit the change automatically — no per-call updates needed. The Trust & Visibility Pass parallel chat was already closed at the time of this change; no coordination conflict.

### 2026-04-27 (Trust & Visibility Pass — Workstreams B + C + E2 + F finalized)
**Items:** none directly
**Files changed:**
- `app/profile/[userId]/page.tsx` — primary CTA block now resolves via `resolvePersonActions` (B2). Self-check added (no CTAs render on own profile). Pending kept as a special case ("Request sent" disabled). Connected → Message + Book care (when hasCare). Familiar (outbound) → Familiar ✓ + Connect when reciprocate/open. None + signal → Connect + Familiar. Locked-locked → Familiar only. md-size buttons preserved. Also removed the now-no-op `theyMarkedFamiliar` prop pass to ConnectionIcon (D3 follow-on).
- `app/meets/[id]/page.tsx` — Photos section gated per Trust & Visibility C1. Logic inlined as IIFE (single callsite). Resolves to `"full"` / `"tease"` / `"none"` based on viewer attendance, group membership, group visibility, and meet visibility. Tease render: 1 hero photo (16:9) + "Join [Group] to see all N photos" link.
- `components/meets/PostMeetReviewSheet.tsx` — soft inline "✓ N marked Familiar" confirmation now shows when "Mark everyone familiar" button is hidden but at least one Familiar mark exists. Counts Familiar marks within the actionable set only. Closes E2.

**Docs updated:**
- `docs/strategy/Content Visibility Model.md` — Section 1 (Meet-attached content) reshaped: added `Meet visibility` column, added the tease row, added a paragraph explaining the bounded scope of the tease layer. `last-reviewed` bumped to 2026-04-27.
- `docs/strategy/Trust & Connection Model.md` — added a "Deniability about the cause" subsection under post-meet review key rules. Codifies the principle that the receiver should never be able to pinpoint who/when/why for a Familiar grant. Documents the three implementation guardrails (no cause-revealing copy, no per-row visual variation by direction, pill suppression on inbound). Cross-references to the canonical implementations.
- `docs/features/connections.md` — Current State refreshed with action matrix + tier function + deniability guardrail. Planned/Phase 15 section moved to "Built (formerly 'Planned')" with notes on what shipped vs what was retired during D3 (Eye icon, "Wants to connect" signal). `last-reviewed` bumped.
- `docs/features/meets.md` — People tab description updated to reference `PersonRow` + the D2 `theyMarkedFamiliar` bump + the deniability guardrail. Photos tab description now references `Content Visibility Model.md` §1 for the gating rules.
- `docs/phases/trust-visibility-pass.md` — B1, B2, B3, C2, C3, E2, F1, F3 marked done. E3, E4, F2 marked deferred (stretch goals per acceptance criteria).

**Notes for the walkthrough chat:**
- **Profile page CTAs are now matrix-driven.** Locked-locked profiles will show a single "Mark Familiar" button (where they used to show nothing). Open profiles you don't have a relationship with will show Connect + Familiar. Self-profile renders no relationship CTAs.
- **Meet detail Photos section now gates by group/meet visibility.** Open-group public meets behave as before (full gallery for everyone). Open-group group_only meets show 1 photo + Join CTA to non-members; full gallery to attendees and group members. Private/approval groups hide entirely from non-members.
- **Post-meet review sheet's "Mark everyone familiar" button** is unchanged in its primary behavior, but now collapses into a soft "✓ N marked Familiar" line once everyone applicable is marked. Users get acknowledgement that the bulk action took effect.
- **Stretch items deferred (E3, E4, F2):** bulk-select mode on People/Members tabs and the People tab helper line. The acceptance criteria explicitly tagged these as stretch. PersonRow already supports `selectMode`/`selected`/`onToggleSelect` props from A2, so the wiring is the only remaining work.
- TypeScript clean, ESLint clean for all touched files. Matrix verifier 11/11 cases pass.

### 2026-04-27 (Trust & Visibility Pass — Workstream D landed)
**Items:** none directly
**Files changed:**
- `lib/meetUtils.ts` — `getAttendeeTier` now reads `conn?.theyMarkedFamiliar` and bumps to tier 2 on inbound Familiar in addition to outbound `state === "familiar"`. D2 decision implemented. Doc-comment expanded to note the deniability guardrail lives in consumer surfaces (not in tier resolution).
- `lib/relationshipContext.ts` — "Wants to connect" signal removed. Replaced with an inline comment explaining why per-row cause-revealing strings violate the deniability guardrail. The receiver should not be able to pinpoint that a specific person performed a specific Familiar grant.
- `components/ui/ConnectionIcon.tsx` — `theyMarkedFamiliar` parameter dropped from the API. The `familiar_them` config (Eye icon, "Wants to connect" label) removed. Inbound and outbound Familiar now share the same Check + "Familiar" rendering — the per-row visual variation that revealed direction is gone. Note added at the top of the file explaining the rationale.
- `components/messaging/RelationshipBanner.tsx` — "is marked as Familiar" reframed to "You've marked [name] as Familiar". The state is outbound only; describing one's own action is fine — deniability only constrains revealing OTHER people's actions.
- `app/profile/[userId]/page.tsx` — dropped the now-no-op `theyMarkedFamiliar` prop pass to ConnectionIcon.

**Docs updated:** `docs/phases/trust-visibility-pass.md` (D1, D3 marked done with detailed scope).

**Notes for the walkthrough chat:**
- **People tab + Members tab will now surface inbound-Familiar attendees in the visible list** instead of collapsing them into the "+ N other attendees" footer. Per the trust model this is correct — those attendees granted you visibility, so you should be able to act on them. The corresponding row will not carry a connection-state pill (PersonRow suppresses pills on `none + theyMarkedFamiliar`); the actionable card itself is the signal.
- **No "Wants to connect" or Eye-icon row** anywhere in the app anymore. ConnectionIcon's API surface shrank — `theyMarkedFamiliar` is gone. If a future surface adds ConnectionIcon, it doesn't need to thread that flag.
- **Strategy doc (`Trust & Connection Model.md`) already said "Familiar (either direction) = Tier 2"** — code now matches. No doc update needed.
- TypeScript clean, ESLint clean, matrix verifier 11/11 cases pass.

### 2026-04-27 (Trust & Visibility Pass — A6 + A7 landed; E2 partially completed)
**Items:** none directly; flagging for the walkthrough chat
**Files changed:**
- `app/inbox/page.tsx` — inline `InboxUserRow` deleted; rows now render via `PersonRow` (variant `inbox-conversation`). Each row passes connection state from `getConnectionState`. Three-line layout preserved (name+timeAgo on top, dogs middle, preview bottom); unread state drives bold-name + emphasized-preview typography via `unreadDot` prop.
- `components/people/PersonRow.tsx` — inbox variant refined: `timeAgo` now sits on the name row (right-aligned via `ml-auto`), pets row is text-only with paw icon for inbox (avatars feel out of place in chat-list shape), preview row is third with bold-on-unread treatment, name itself bolds when `unreadDot` is true. `PawPrint` import added.
- `components/meets/PostMeetReviewSheet.tsx` — `AttendeeActionCard` now uses `resolvePersonActions` to gate which pills render per attendee. Locked-locked-no-action attendees see [Familiar, Skip]; attendees with mutual visibility see [Familiar, Connect, Skip]; already-Connected attendees see [Skip] + an "Already connected" hint; already-Familiar attendees see Connect (when reciprocate/open) + Skip + a "You've marked them Familiar" hint. Grid columns now match the visible pill count. `MakeConnectionsStep`'s `markAllFamiliar` now only marks attendees where the matrix lists Familiar as available — Connected/Pending/already-Familiar attendees are skipped. `useCurrentUserId` import dropped in favor of `useCurrentUser` (needed for `profileVisibility`).

**Docs updated:** `docs/phases/trust-visibility-pass.md` (A6 + A7 marked done; E2 marked partial with remaining work scoped).

**Notes for the walkthrough chat:**
- **Inbox UX is unchanged structurally** — same three-line layout, same click target. Connection-state pills now show inline when relevant (most rows are with Connected users, which renders a small "Connected" pill next to the name).
- **Post-meet review sheet's action pill row is now per-attendee variable.** Some cards show 3 pills (Familiar / Connect / Skip); some show 2 (Familiar / Skip when locked-to-locked); some show 1 (Skip alone for already-Connected). This is correct per the trust model — but visually it'll look uneven across a list. Worth eyeballing during A8.
- **"Mark everyone familiar" honors the matrix.** It used to mark every actionable attendee Familiar; now it only marks the ones where Familiar is a valid action. Should fix the silent regression where Connected attendees got auto-promoted to Familiar (which the model prohibits — you can't be both).
- TypeScript clean, ESLint clean for my edits.

### 2026-04-27 (Trust & Visibility Pass — A5 landed; closes P23, P24, member-list slice of P18)
**Items:** P23 (closed), P24 (closed), P18 (member-list slice closed; broader sweep still open)
**Files changed:**
- `app/communities/[id]/page.tsx` — `MembersTab` rewritten to use `PersonRow` (variant `group-member`); inline pill markup gone. Dead `ChatTab` + `ChatTabProps` + `activeTab === "chat"` render branch deleted. 8 orphan imports removed (`ChatCircleDots`, `PaperPlaneRight`, `Handshake`, `PawPrint`, `MessageBubble`, `SystemMessage`, `MeetCardCompact`, `getMessagesForGroup`, plus the `GroupMessage` type). Orphan `messages` variable removed. `PersonRow` imported.
- `app/globals.css` — `.group-action-btn-status` and `.group-action-btn-invite` (43 lines, ~12125-12167) deleted. Zero remaining usages confirmed.

**Docs updated:** `docs/phases/trust-visibility-pass.md` (A5 marked done with detailed scope), `docs/phases/punch-list.md` Done section (P23, P24 added; P18 description updated to reflect partial close).

**Notes for the walkthrough chat:**
- **Group detail Members tab now uses `PersonRow` (variant `group-member`).** Identical content, cleaner chrome — admin badge, optional Care badge, connection-state pill (Connected/Familiar/Pending) where applicable. Action matrix surfaces but most rows currently render with no actions visible because `connectionState === "none"` resolves to a single Familiar button per the matrix — that's correct per the deniability frame, but means the "before" state (no actions) is now (one quiet Familiar). Worth a glance when you re-walk the group detail page.
- **No Chat tab regression risk** — the dead `ChatTab` was unreachable via UI before (no tab key registered for "chat" in `getTabsForGroupType`); deleting it is purely a cleanup.
- **Pre-existing hooks-rule error at line 177** of the file is structural (early-return `if (!group)` at line 132 before useEffect at 177). Unchanged by this work; same shape as the meet detail file's pre-existing hooks errors.
- TypeScript clean throughout.

### 2026-04-27 (Trust & Visibility Pass — Workstream A1–A4 landed)
**Items:** none directly; flagging for the walkthrough chat
**Files changed:**
- `lib/personActions.ts` (new) — `resolvePersonActions` matrix function (action affordances per the Trust & Visibility action matrix).
- `lib/personActions.cases.ts` (new) — 11 framework-agnostic matrix coverage cases + `verifyMatrix()` runner.
- `components/people/PersonRow.tsx` (new) — canonical row component. Four variants (`meet-attendee` / `group-member` / `inbox-conversation` / `default`); auto-resolves actions via `resolvePersonActions`; internal dog-image lookup; deniability-correct pill rule (no pill on `none + theyMarkedFamiliar`).
- `components/meets/ParticipantList.tsx` — rewritten to render via `PersonRow` (variant `meet-attendee`). Inline tier-classification removed in favor of `getAttendeeTier` from `lib/meetUtils.ts`. "Connected since" line dropped. Pets passed as `{ name, breed }` (PersonRow does the dog-image lookup internally).
- `components/meets/ParticipantCard.tsx` (deleted) — zero importers after the rewrite.
- `app/meets/[id]/page.tsx` — `PeopleTab` wrapped in `LayoutSection` to fix the horizontal padding bug (was sitting flush against the panel edges because `.meet-detail-content` only adds vertical padding).
- `app/globals.css` — `.person-row` + variant modifiers, four `.person-row-pill--*` states (connected/familiar/pending/admin/care), unread dot, select-mode checkbox box. Added at the end of the file.

**Docs updated:** `docs/implementation/design-system.md` (PersonRow + new CSS classes); `docs/phases/trust-visibility-pass.md` (A1 spec sub-section + A1/A2/A3/A4 marked done + C1/E1/D2/D3 resolved with rationale).

**Notes for the walkthrough chat:**
- **People tab is now the canonical reference for `meet-attendee` variant.** When you re-walk section 3.B, the tier filter + "+ N other attendees" footer behaviour is unchanged from before — that part was already correct in the old code; the rewrite consolidated tier rules to a single source.
- **Cards now sit inside `LayoutSection`'s 16px horizontal padding** rather than flush against the panel. Visual change but should read as a fix, not a regression.
- **Care badge preserved.** The old `ParticipantCard` rendered a small "Care" pill for community providers; `PersonRow` now does the same via `isCareProvider` prop + `.person-row-pill--care`. No regression.
- **D2 implementation (`theyMarkedFamiliar` → tier 2 bump in `getAttendeeTier`) NOT yet landed.** That's a Workstream D3 follow-up — current behaviour mirrors what the codebase did before. The deniability-correct copy/pill rules ARE already enforced in `PersonRow` (no pill renders on `none + theyMarkedFamiliar`), so when D3 lands the row will quietly bump to tier 2 without leaking the cause.
- **Pre-existing lint warnings on `app/meets/[id]/page.tsx`** (2 react-hooks errors + 1 unused-var on `ChatTab` `meet` param) are unchanged. They've been present since at least 2026-04-25 (logged in that day's punch-list change report) and aren't from this work.
- TypeScript clean throughout. Matrix verification: all 11 cases pass.

### 2026-04-14
**Items:** P7
**Files changed:** `components/posts/PostComposer.tsx`, `contexts/PostComposerContext.tsx`, `app/layout.tsx`, `app/globals.css`, plus all entry points (`AppNav`, `HomeFAB`, `ShareMomentBar`, `FeedCTA`, `CompactGreeting`, `PostsTab`, `GroupDetailPanel`, `app/communities/page.tsx`)
**Docs updated:** none
**Notes:** Composer rebuilt as ModalSheet via PostComposerProvider. Photo-first empty state, accordion tag rows (place/dog/person/community/meet) with inline pickers, single-select for place + meet, dog suggestions limited to owner's pets (max 3, persist after partial selection), no auto-suggestions for person/community/meet.

### 2026-04-27 (Meet Recurrence Model phase — parallel to active Meets Deep Pass walkthrough)
**Items:** none directly; flagging for cross-chat coordination
**Files changed:**
- `lib/types.ts` — `Meet.recurring: boolean` replaced by `Meet.cadence: MeetCadence` ("one_off" | "weekly" | "biweekly" | "monthly"); added `seriesEndDate?`, `attendeesByDate?`, `followers?`. New `MeetOccurrence` type. `attendees` semantics on recurring meets: now a *representative* list (typically next-occurrence) for legacy callsites; authoritative per-date data is on `attendeesByDate`.
- `lib/meetUtils.ts` — added `isRecurring`, `recurrenceLabel`, `nextOccurrenceDates`, `getOccurrenceAttendees`, `getMeetOccurrences`. `getMeetRole` gained an optional `date` param (instance-aware role).
- `lib/mockMeets.ts` — every meet migrated from `recurring: true|false` to `cadence: "weekly"|"one_off"`. Module-load IIFE seeds `attendeesByDate` for all 26 recurring meets (anchor + next 3 upcoming, subset 100/70/55/45). Followers seeded for 5 representative meets across personas (meet-1, meet-5, meet-7, meet-12, meet-care-1). New helpers: `getUserMeetInstances`, `getFollowedSeries`. `getUserMeets` now correctly handles recurring meets via `attendeesByDate`.
- `components/meets/CardMeet.tsx`, `components/schedule/ScheduleCard.tsx`, `app/meets/[id]/page.tsx` — `meet.recurring` reads migrated to `recurrenceLabel(meet)` (also makes the pill cadence-aware: "Weekly" / "Biweekly" / "Monthly").

**Docs updated:** punch-list change report only (this entry); phase board + feature docs to land in workstream H.

**Notes for the walkthrough chat:**
- **Surfaces under active walkthrough review SHOULD continue to render correctly.** Cards reading `meet.attendees` for avatar stacks etc. will see a populated representative list on recurring meets (intentional dual-write — see `Meet.attendees` doc-comment).
- **Don't be alarmed if `meet.recurring` autocomplete/intellisense disappears** — it's `meet.cadence !== "one_off"` now. The "Weekly" pill is now `recurrenceLabel(meet)`.
- **Workstream D (meet detail page) is the next high-overlap edit** — I'll surface a separate change report before pushing those edits, and will pause to coordinate before touching the RSVP rows that the walkthrough is currently verifying. Likely areas: the "Upcoming dates" section for recurring meets, a "Follow series" toggle, and instance-aware "Who's coming."
- TypeScript clean throughout. ESLint not yet re-run on the touched surfaces — will sweep before phase close.

### 2026-04-27 (Meet Recurrence Model — design polish + final close)
**Items:** none directly; final design refinements after walkthrough review
**Files changed:**
- `app/meets/[id]/page.tsx` — Joined state moved from `variant="outline"` to `variant="secondary"` (brand-border + brand-text on white surface; the canonical active/committed treatment). Skip is hidden when Joined — single Joined button right-aligned, asymmetric vs the two-button rows as intentional signal of committed state. Click Joined toggles back to Join. All four inline-style violations (`borderBottom`, `opacity`, `textDecoration: line-through`, `textDecoration: underline`) replaced with Tailwind utilities (`border-b border-edge-strong last:border-b-0`, `opacity-60`, `line-through`, `underline underline-offset-2`).
- `app/globals.css` — `--radius-panel` changed from primitive `20px` → `var(--radius-md)` (12px). Affects every panel/sheet/modal callsite that uses the alias (~30 places). Brings `rounded-panel` Tailwind utility in line with the lower radius the rest of the app already uses via `border-radius: var(--radius-md)` directly.
- `app/styleguide/tokens/page.tsx` — radius-panel alias entry corrected (was previously mislabeled as mapping to `--radius-sm`).
- "Going" / "Going (active)" → "Join" / "Joined" relabel (sharper verb pair than the ambiguous active/inactive "Going").

**Notes:**
- Earlier inline-style use of `var(--edge-light)` was rendering nothing because the variable doesn't exist directly — only `--color-edge-light` (the Tailwind theme alias) does. That's why dividers were invisible. Tailwind utility `border-edge-strong` resolves correctly to `--border-strong` (#e5e5e5), the canonical light-divider value used by `.divider`, `.discover-type-pills`, etc.
- The radius change is a global visual shift — modal sheets (PostComposer, MeetComposer, PostMeetReviewSheet) drop from 20→12px corners. Worth a smoke check on those surfaces during walkthrough re-verification.

### 2026-04-27 (Meet Recurrence Model — Upcoming Dates revision)
**Items:** none directly; layout bug + design refinement on the recurring meet detail Upcoming Dates section
**Files changed:**
- `app/meets/[id]/page.tsx` — Upcoming Dates section rebuilt as `RecurringUpcomingDates` component. Layout bug fixed (was using `meet-info-card` which has `flex-direction: row` baked in — rows squashed horizontally). New container is a plain rounded-panel with vertically-stacked rows. Per-row buttons changed from `[Going] [Interested]` to `[Going] [Skip]`. Skipped rows render muted in place with line-through date and inline "Skipped · Undo" — affordance is reversible without hunting. Top action row renamed "Follow series" / "Following series" → "Interested" (single label, toggles via fill weight on the star icon). Data shape unchanged (still `Meet.followers` underneath).
- `lib/dismissedReviews.ts` — `DismissKind` extended with `"meet-skip"`. Same hook plumbing, separate namespace from review-recent dismissals so the two surfaces don't collide.
- `docs/features/meets.md` — Recurrence model section updated to reflect Going + Skip per occurrence + series-level Interested. Removed "Follow series" terminology (kept the underlying field name `followers` since renaming the data field would be churn for no UX gain).
- `docs/phases/meets-deep-pass-walkthrough.md` — cross-ref note updated.

**Notes:** Per-occurrence Interested was dropped after Shawn's review of the first cut — "maybe to a specific Wednesday" added noise without much value. Skip is the sharper second affordance per row and gives the user a real way to express "not this one" without the host miscounting Going.

### 2026-04-27 (Meet Recurrence Model — UI integration batch)
**Items:** none directly; second flag for the walkthrough chat
**Files changed:**
- `app/meets/[id]/page.tsx` — recurring meet detail rebuilt: per-occurrence Going/Interested rows in a new "Upcoming dates" section, separate "Follow series" toggle (replaces single RSVP for recurring), Who's coming + People tab now read the next occurrence's roster (`focusAttendees`). One-off path unchanged. Recurring meets with legacy `status: "completed"` now render the active-series UI; "Completed" badge pill hidden for recurring.
- `app/schedule/page.tsx` — Upcoming, Meets→Going, Meets→Interested, History all consume `getUserMeetInstances` (one card per (meet, occurrence-date)). Interested includes followed-series + per-instance Interested + group-suggested. Dismiss IDs now include occurrence date.
- `components/schedule/ReviewRecentSection.tsx`, `lib/dismissedReviews.ts` (read-only) — `ReviewItem.date` field added; per-occurrence dismiss key (`meet:${meetId}::${date}`) so dismissing one occurrence doesn't dismiss every other Wednesday.
- `components/meets/CardMeet.tsx`, `components/meets/MeetCardCompact.tsx`, `components/feed/FeedUpcomingMeet.tsx` — recurring meets show "Next: [date]" via `getDisplayDate` (was rendering `meet.date` = potentially-stale series anchor).
- `app/discover/meets/page.tsx` — "Following" pill added to TYPE_TABS.
- `lib/types.ts`, `components/ui/NotificationsPanel.tsx`, `app/notifications/page.tsx`, `lib/mockNotifications.ts` — `meet_series_update` notification type wired through both render paths + one mock entry on meet-7 for Shawn.

**Docs updated:** punch-list change report only (this entry); feature docs land in workstream H next.

**Notes for the walkthrough chat:**
- **Walkthrough section 3 (Meet Detail) — re-walk for recurring meets.** Specifically: meet-1 (cadence: weekly, status: completed in legacy data), meet-care-1 (weekly, future-anchor) should now show the new Upcoming Dates section + Follow Series toggle. One-off meets (meet-2, meet-3, meet-4) should look exactly as before.
- **Walkthrough section 2 — Schedule timeline.** Cards now render per-occurrence — a recurring meet you're going to multiple weeks of will appear multiple times under different date headers. That's intentional, not a bug.
- **Walkthrough section 2 — Group detail Meets tab + chat-context strip.** Recurring cards now say "Next: [date]" with the actual upcoming occurrence. meet-7's card will say "Next: 30 Apr" not "22 Jan" — this is a fix.
- **Walkthrough section 4 — Post-Meet Review Flow.** Untouched in this phase. PostMeetReviewSheet still uses `meet.attendees` (representative list) — works for one-off and for the "review the most recent occurrence" semantic on recurring. Future advanced-editing pass would make it instance-aware.
- TypeScript clean throughout.

### 2026-04-25 (cleanup chat — parallel to active Meets Deep Pass walkthrough)
**Items:** P11, P13, P14, P15; refined P4; logged new P16
**Files changed:**
- `components/home/HomeWelcome.tsx` (deleted), `components/meets/PostMeetReveal.tsx` (deleted)
- `app/meets/[id]/page.tsx` — removed PostMeetReveal import + PeopleTab usage; wrapped 2 chat-tab EmptyStates in LayoutSection; PeopleTab signature trimmed
- `app/inbox/page.tsx` — wrapped 2 EmptyStates in LayoutSection (moved out of LayoutList for empty branches)
- `app/bookings/page.tsx` — wrapped 2 EmptyStates in LayoutSection
- `app/page.tsx` — landing hero + landing close CTA `/activity` → `/discover/meets`
- `components/landing/HowItWorksTabs.tsx` — community CTA `/activity` → `/discover/meets`
- `components/profile/ProfileAboutTab.tsx` — Browse Meets CTA `/activity` → `/discover/meets`
- `app/signup/success/page.tsx` — Browse Meets `/activity` → `/discover/meets`
- `app/meets/page.tsx` — server redirect now goes directly to `/discover/meets` (was `/activity?tab=discover`)

**Docs updated:** `docs/phases/punch-list.md` only (this file)

**Notes:**
- P11 decision: `/activity` STAYS as permanent thin redirect — handles bookmarks gracefully; removing it would force re-mapping legacy URLs. `loggedRoutes` in `AppNav.tsx` still includes `/activity` intentionally.
- P4 turned out not to be a rename. Real shape: providers in `mockData.ts` are a directory-only surface with no UserProfile counterparts (only Nikola has a `userId` bridge). Refined P4 description; punted to Mock World Building.
- New P16 logged: `components/activity/MyScheduleTab.tsx` + `ServicesTab.tsx` are orphaned files with no live importers — P11 cleanup confirmed they're dead. Left in place rather than deleting blind in case the active phase chat is mid-edit.
- Verified: `npm run typecheck` clean. `npx eslint` on all touched files: 0 new errors/warnings introduced (the 2 pre-existing react-hooks errors + 1 unused-var warning in `app/meets/[id]/page.tsx` exist on `main` and are unrelated to this work).

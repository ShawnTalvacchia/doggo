---
status: active
last-reviewed: 2026-04-27
review-trigger: When any task is completed or blocked
---

# Meets Deep Pass

**Goal:** Meets are the core trust-building mechanic in the product. A meet detail page should make a hesitant new owner like Daniel actually *want* to attend — and make a regular like Tereza feel like the host she's joining is someone she'd already trust with her dog. Every meet surface (detail page, card, creation flow, post-meet flow) should feel like the most considered surface in the app.

**Depends on:** Inbox & Notifications (done), Bookings & Care Provider Flow (done). Profiles & Dogs is partial — foundations shipped (trust signals, post composer, post attribution) but dog surfacing across the app (owner walls, posts, feeds) is still open. In-meet dog surfacing (A3/A4/B/D tasks) lands inside this phase; the broader cross-app work defers to a dedicated pass after Meets Deep Pass.

**Refs:** [[meets]], [[Trust & Connection Model]], [[Content Visibility Model]], [[Groups & Care Model]], [[design-system]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase *(reviewed 2026-04-23 for Creation Flow scope — §3 cross-category/crossover deferred, §10 persona context informs entry points)*
- [ ] Walk through `/meets` (list/feed) — does the entry point sell attending?
- [ ] Walk through every meet detail variant — walk, park hangout, playdate, training, care-group meet, completed (with photos), upcoming, full
- [ ] Review meet card variants — community feed, schedule timeline, group detail, search results
- [x] Check meet creation flow end-to-end (if it exists) — what's missing for a real flow? *(C1 audit completed 2026-04-23 — see Creation Flow workstream below)*
- [ ] Check post-meet review/connect flow against Trust & Connection Model (Familiar trigger)
- [ ] Audit mock meet data — do meets have rich enough metadata to drive the new detail page (cover photos, attendees with dogs, host trust signals, type-specific fields)?
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks
- [ ] Confirm scope — flag any tasks that belong to a different phase

---

## Tasks

### Meet Detail Page — Make It Inviting

Initial redesign landed (cover photo hero, info strip, attendees, rules, organiser, sticky RSVP). Iterating from user feedback.

| # | Description | Status |
|---|-------------|--------|
| A1 | Initial redesign — cover photo hero, info strip (date + location), "Who's coming" with dogs, "People you know" social proof, urgency warning, type-specific details, rules grid, what-to-bring, organiser card, sticky mobile RSVP, photos section. _(Originally spec'd with overlay + glassmorphism badges on the hero; subsequent iteration pared the hero back to a clean photo with pills moved below into `.meet-detail-info`. A1 description updated to match shipped state — 2026-04-24.)_ | done |
| A2 | Iterate on hero — fallback covers per meet type, hero sizing, overlay/badge question. **Outcome (2026-04-24):** (a) Fallback map corrected — playdate → `puppy-socialization.jpeg`, training → `training-session.jpeg`; (b) `meet-21` stripped of explicit `coverPhotoUrl` so the playdate fallback is actually exercised in the running app; (c) Hero height kept at 240/220 — intentional parity with `.group-detail-banner`. Revisit both surfaces together in Community & Groups Deep Pass if we want a shorter banner; (d) Overlay/glassmorphism badges explicitly decided against — clean photo hero + pills in info block is the committed direction; (e) Deleted dead `components/meets/MeetDetailPanel.tsx` (zero consumers). | done |
| A3 | "Who's coming" section — does the dog social proof feel right? Visibility rules per Content Visibility Model (familiar/connected). **Outcome (2026-04-24):** (a) Added `getAttendeeTier()` helper implementing the canonical Tier 1 / Tier 2 / Tier 3 rule from Trust & Connection Model §74–82; (b) Rewrote `getKnownAttendees` to use the tier helper so this section matches `ParticipantList` exactly (previous logic ignored `profileOpen` on both sides); (c) Avatar stack now tier-sorted before slicing — tier-3 faces never leak into the preview; (d) Section title flips to "Who came" on completed meets; (e) Trust/social-proof line rewritten: named copy when known attendees ≤ 3 ("Jana is joining" / "Jana and Eva" / "Jana, Eva and Marek"), aggregated beyond that ("Jana + 4 people you know"), dog-first fallback when no tier-1/2 going ("Rex, Luna + 4 more dogs"); (f) Terminology swept: "connections" → "people you know" (the old copy counted both Connected and Familiar, so the word was misleading); (g) Dog names intentionally pulled from tier-3 attendees for the fallback — dogs aren't privacy-sensitive and Daniel needs the dog fallback when he knows no one. | done |
| A4 | "People you know" — overlap math, copy, empty state. | done (2026-04-25) — added empty state for 0 going attendees ("No one's going yet · Be the first to RSVP"), dog-forward avatar resolution in the summary stack via `getDogImageByOwnerAndName`, and a Daniel-flavored fallback copy for "you don't know anyone yet — that's how most meets start." |
| A5 | Type-specific detail blocks — content depth and visual treatment. | done (2026-04-25) — no color accenting. Added a short narrative intro line under each section title (walk / park hangout / playdate / training), echoing the creation-flow type descriptions so there's a mental rhyme between posting and attending. Section titles + distinct icon set remain. |
| A6 | Rules grid + what-to-bring — are items right? | done (2026-04-25) — "Good to know" section revised: added `dog size` stat cell (was referenced in the conditional but not rendered), removed `max attendees` (duplicative — already shown in going/max count line above). Bring + accessibility stay as full-width prose rows. |
| A7 | Organiser card — trust signals. | done (2026-04-25) — added connection-state pill (Connected / Familiar / Request sent, shown only for non-self viewers), neighbourhood, and "X meets hosted" count (pulled from `mockMeets.filter(m => m.creatorId === meet.creatorId)`). Verified-ID / hybrid trust badges deferred to a future hybrid-trust pass per the lean. |
| A8 | Care-group meets — "paid offering" framing. | done (2026-04-25) — "Paid session" pill added to the badge row next to the type pill (info color, Storefront icon). Replaced the bare service-CTA row with a framed "Book this session" card: provider (via `group.hostedBy`), provider avatar, "From {group.name} →" link back to the care group, price + spots, Book CTA. **Restructured 2026-04-27:** the framed card moved from bottom-of-page to near the top (above all other content sections — Booking is the primary action). One-off paid meets carry the Book CTA on the card and suppress the standard RSVP dropdown. Recurring paid meets render the card info-only and put per-occurrence Book buttons on each Upcoming dates row with the price visible in the row meta line. Built `ServiceBookingSheet` (`components/meets/ServiceBookingSheet.tsx`) — lightweight pre-filled booking flow distinct from `BookingModal`'s open-ended provider booking. On confirm, recurring rows flip to a Booked state. |
| A9 | Completed meets — photo gallery, share prompt, tag who came, post-meet review entry. | mostly done — photo gallery via `MeetPhotoGallery`, share-photos prompt already renders for attended + no-photos case, post-meet review entry shipped via D-work ("Review this meet" button + schedule-timeline pill). **Tag who came deferred** — ties into the photo-tagging feature that belongs with gallery commenting. |
| A10 | RSVP states. | done (2026-04-25) — confirmed: sticking with Going / Interested (two-state model). Going button + dropdown with Going / Interested / Leave options + disabled state when full. Sticky mobile + inline desktop parity already present. "Maybe / Can't" expansion rejected — reserved for a future model change if testers surface the need. |
| A11 | Empty/edge states. | mostly done — cancelled: type-row "Cancelled" badge + strike-through title + RSVP hidden. At-capacity: RSVP button text flips to "Meet is full", Going option in dropdown disabled, and added (2026-04-25) a dedicated "This meet is full" warning chip for upcoming full meets. **Deferred** — host-left and you're-banned-from-group states. Both need product decisions + mock data that doesn't exist yet. |
| A12 | Mobile responsiveness sweep. | deferred — needs real device testing. From code review, known risks to check: (1) sticky RSVP bar behavior with the virtual keyboard; (2) cover photo reflow on narrow screens; (3) meet-stat-grid wrapping on 320px viewports; (4) badge-row wrapping with paid-session + weekly + completed pills all present. Not code-blockable without a device; carry into testing QA. |

### Meet Cards — Across Surfaces

B-workstream opened 2026-04-25. Scope decided:
- No cover photos on cards — cover upload is optional in creation; forcing it into the card visual punishes routine meets and breaks the community-first vibe. Continuity with the detail page is carried by anatomy (type pill, typography, date format, group chip, dog-first rendering), not image echo.
- Dogs lead avatars on every card — owner avatar is a fallback when a dog image can't be resolved. Lookup via `getDogImageByOwnerAndName` in `lib/dogLookup.ts`.
- Medium consolidation — keep four components (`CardMeet`, `MeetCardCompact`, `FeedUpcomingMeet`, `FeedMeetRecap`); share anatomy + icon set + `AttendeeAvatarStack`; don't force-merge feed cards into `CardMeet`.
- Anatomy spec shipped in `docs/features/meets.md` → Meet-card anatomy.

| # | Description | Status |
|---|-------------|--------|
| B1 | Community feed meet card — tell enough story to drive a tap. Dog-forward avatars, type pill restored. | done — `FeedUpcomingMeet` got type pill + `AttendeeAvatarStack` + count line; `FeedMeetRecap` got type pill + date/time (photos still carry completed-meet social proof). |
| B2 | Schedule timeline meet card — action-verb labels, hosting/providing accents. | done — no code change needed: `CardMeet variant="schedule"` already had role chips (Hosting/Joining/Interested with color tiers) and host-side RSVP-count signal. Dog-forward avatars inherited from `AttendeeAvatarStack` update. |
| B3 | Group detail meet list card + compact chat-strip card. | done — `CardMeet variant="group"` inherits new avatar stack; `MeetCardCompact` restored with location + group chip + people/dog count (no avatars — too narrow at 200px), icon set aligned with canonical (Footprints → PersonSimpleWalk; Student → Target). |
| B4 | Discover results card — differentiation from groups and providers. | partial — the meet card itself is done (dog-forward, spots-left signal preserved). The open question "does it visually differentiate from CardGroup / CardProvider on the same Discover results page" is a cross-component comparison that belongs in Discover & Care Deep Pass, not Meets Deep Pass. Flagging for hand-off. |
| B5 | Card-to-detail visual continuity — no jarring transitions. | partial — anatomy-level continuity landed (same type pill, typography, date format, group chip, dog-first avatar rendering). Full visual echo between card avatar stack and detail page's `ParticipantList` is an A-workstream concern — needs a spot-check that the detail page leads with dog photos in the attendee list (A3 updated the summary card; the full list may still be owner-first). |
| B6 | *(new)* Shared anatomy + utilities. | done — `docs/features/meets.md` Meet-card anatomy section; `lib/dogLookup.ts` (`getDogByOwnerAndName`, `getDogImageByOwnerAndName`, `getDogsForAttendee`); `components/meets/AttendeeAvatarStack.tsx` (shared dog-forward stack used by `CardMeet` and `FeedUpcomingMeet`). |

### Meet Creation Flow

Audit done 2026-04-23. Current state: single-page form at `/meets/create` with type picker, type-specific sections, details, date/time, recurring toggle, and rules. Gaps: no group selection (meets should always belong to a group per Content Visibility Model), no per-meet visibility, no cover photo, thin recurring, no confirmation state, entry points don't pass context.

**Decisions:**
- Every meet has a group — no escape hatch (auto-parks, neighborhood, interest, or care groups cover all cases).
- Single-page with progressive disclosure. Not stepped.
- Type-model work is in scope: add `MeetVisibility` enum, make `groupId` required.
- Light style cleanup folded in as we touch each section.

| # | Description | Status |
|---|-------------|--------|
| C1 | Audit current creation flow — entry points map, spec/code mismatches, open questions review | done |
| C2 | Type picker (walk / park hangout / playdate / training) — different fields per type | done (pre-existing) |
| C3 | Required vs optional fields — title, location, date, time, type required | done (pre-existing) |
| C4a | Add `MeetVisibility` type (`"public" \| "group_only"`), make `Meet.groupId` required, fix 3 groupless mock meets | done — `meet-4 → group-1`, `meet-5 → group-5`, `meet-6 → park-3`. All 24 mocks default to `visibility: "public"`. Null-check sites left in place; fold simplification into a later cleanup |
| C4b | Group + visibility section in form — group picker (your groups, grouped by type), visibility radio (public only shown for open groups), prefill when launched from group detail | done — select with `<optgroup>`s, prefill via `?groupId=`, private/approval groups force `group_only` via effect, no-groups state with CTAs to browse or create |
| C4c | Update entry points to pass `groupId` context — group detail, community detail, schedule, home welcome. No-groups state routes to "join or create a group first" | done — community detail + GroupDetailPanel now pass `?groupId=`. Schedule / home welcome stay context-less by design (no group in scope) |
| C5 | Cover photo upload (mock) — user uploads or picks from type-fallback set. Fallback covers per meet type (walk / park hangout / playdate / training) | done — FileReader-based mock upload + 4 starter images per type |
| C6 | Recurring expansion — weekly/biweekly/monthly, optional end-date, series preview ("Every Tuesday at 8:00 through June"). Supports Tereza's morning Stromovka | done — frequency + end-date UI + plain-English preview. Form-local only; `Meet` type still stores `recurring: boolean`, extend later |
| C7 | Confirmation + share — success page with meet card preview, "Invite from group" button, "Copy link" button, "Go to meet" primary action. Replace the current `/activity` redirect | done — preview card + "View in group" primary + Copy link (mock URL, "Copied!" feedback) + Create another (resets form, keeps group) |
| C8 | Light style cleanup — extract `PillToggle` to `components/ui/`, clean inline styles in sections we rewrite. Full cleanup of meet-type cards stays on punch list | done — `components/ui/PillToggle.tsx` created (uses canonical `.pill` + tint). Cleaned inline styles in `VisibilityOption`, `CoverPhotoSection`, `CreatedSuccessView`. Meet-type cards still use inline styles — punch-list |
| C9a | Create `MeetComposer` component + `MeetComposerContext` + mount provider in `app/layout.tsx`. Port form body from `/meets/create` into a ModalSheet wrapper; preselected-group sync mirrors `PostComposer` pattern. | done — `components/meets/MeetComposer.tsx`, `contexts/MeetComposerContext.tsx`. Provider nested inside `PostComposerProvider` in `app/layout.tsx`. |
| C9b | Update all live entry points to call `useMeetComposer().openComposer({ groupId })` instead of linking to `/meets/create`. | done — community detail header + Meets-tab empty state, `GroupDetailPanel` MeetsTab (header + empty state), `HomeWelcome` "Create a meet" button, `MyScheduleTab` (desktop button + mobile button + upcoming-empty-state). Dev-menu entries in `app/pages/page.tsx` and `lib/navigation/pageMenuGroups.ts` still point to the legacy route (they keep working via redirect). |
| C9c | Retire `/meets/create` route. | done — route couldn't be deleted (sandbox restriction), so `app/meets/create/page.tsx` was replaced with a 41-line Suspense-wrapped redirect that opens the composer on mount and `router.replace("/activity")`s away. Handles `?groupId=` query param pass-through. Feature-doc routes table updated. |
| C9d | **Progressive disclosure.** Move description, cover photo, duration, max attendees, recurring, rules (leash/size/energy), what-to-bring, accessibility behind a "More options" expander. Essentials visible by default: group + visibility, type picker, title, location, type-specific fields (when type is chosen), date + time. | done — `showMoreOptions` toggle with `CaretDown` affordance. Secondary sections collapse into a single expandable block with four groups inside: description · cover photo · duration/max/recurring · rules/preferences/bring/accessibility. Resets to collapsed on full sheet close and on "Create another" in the success state. Note: **duration** was moved to secondary despite being called out as primary in earlier planning — it has a sensible 60-min default and most creators will accept it. Revisit if testers trip on it. |

### Post-Meet Flow (Familiar Trigger)

D-workstream opened 2026-04-25. Scope decided:
- Stepped ModalSheet (welcome → photos → make connections), not a full page. Mirrors the MeetComposer pattern.
- Attendee-side only in this pass. Host-side (D5) deferred.
- Photos step = add one photo + caption. Photo tagging of people/dogs deferred to when gallery commenting ships.
- Tier-3 (Locked) attendees get a minimal "Also there" list (name + avatar only, no actions). Tier-1/2 get full dog-forward cards with Mark Familiar / Connect / Skip actions + bulk "Mark everyone familiar".
- Marks are sheet-local state — they don't propagate to `mockConnections`. Cross-surface reactivity is a follow-up when we need it for demos.
- Design direction memory: `project_doggo_post_meet_flow.md` (stepped, not Tinder, photos and members separate).

| # | Description | Status |
|---|-------------|--------|
| D1 | Post-meet prompt entry — when does it appear? | partial — "Review this meet →" pill on completed meets in the schedule history view. Notification trigger deferred (mock notifications with `type: "post_meet_review"` already exist in `mockNotifications.ts` but now point to a route that just opens the sheet and redirects — fine for the demo). |
| D2 | "Who did you meet?" review screen — dog-forward attendee list, mark Familiar (silent). | done — step 3 of `PostMeetReviewSheet`. Dog-forward cards with tier-aware rendering, three actions per attendee (Familiar / Connect / Skip), bulk action, Tier-3 "Also there" list. Actions are sheet-local mock state. |
| D3 | Optional: rate the meet, leave a note, share a photo. | partial — Photos step (step 2) ships with mock upload + caption. "Rate the meet" and "leave a note for the host" deferred to host-side flow (D5) where they're more meaningful. |
| D4 | Connection escalation prompt — "You marked X familiar, want to connect?" after multiple meets. | todo — needs cross-meet state (count shared meets) that doesn't exist yet. Belongs with the Familiar→Connected escalation work. |
| D5 | Host-side post-meet — see who came, thanks, reattendance signals. | todo — deferred to a dedicated pass. Different UX from attendee-side (host sees their whole attendee list + thanks affordance, no "who did you meet" framing). |
| D-a | *(build)* `PostMeetReviewContext` + `PostMeetReviewSheet` scaffold + provider mount. | done — `contexts/PostMeetReviewContext.tsx` + `components/meets/PostMeetReviewSheet.tsx` + layout integration. |
| D-b | *(build)* Steps 1 (welcome) + 2 (photos). | done — inside `PostMeetReviewSheet`. |
| D-c | *(build)* Step 3 (make connections, tiered). | done — inside `PostMeetReviewSheet`. Extracted `getAttendeeTier` + `getKnownAttendees` to `lib/meetUtils.ts` (canonical location — `app/meets/[id]/page.tsx` now imports from there). **Rebuilt 2026-04-27** (during walkthrough): owner-first card layout (64px owner avatar + 32px overlapping dog cluster, white box-shadow ring, "+N" chip when more than 2 dogs), state-grouped sections (Not Familiar / Familiar / Connected / Locked profiles — empty sections hide), Skip pill removed, profile-state-aware explainer (locked: lock icon + bold-labeled Familiar/Connect lines with personalized dog name; open: globe icon + Connect-only). Connected cards gained a Message pill. Added `meet-reactive-spring` to mock data — purpose-built post-meet demo with curated attendee mix for Daniel. |
| D-d | *(build)* Triggers + route redirect. | done — schedule-timeline pill on completed meets opens the sheet; meet-detail "Review this meet" button opens the sheet; legacy `/meets/[id]/connect` route converted to a thin redirect that opens the sheet and `router.replace`s to `/activity`. |
| D-e | *(known debt)* `components/meets/PostMeetReveal.tsx` is orphaned and now superseded by `PostMeetReviewSheet`. File deletion is blocked in sandbox; remove it during phase close. | todo |

### Mock Data Quality

Audit done 2026-04-25 against the 24 mock meets. Most gaps the phase board anticipated turned out already filled by parallel B/C work (cover photos, dog-image resolution, type-specific blocks). Detail below.

| # | Description | Status |
|---|-------------|--------|
| E1 | Cover photos for every meet (or strong type-fallback). | done — 23/24 meets have `coverPhotoUrl`; `meet-21` intentionally omits its cover to exercise the playdate type-fallback (documented in A2). No gaps. |
| E2 | Attendee lists — realistic depth + dog pairing. | done — every meet has 3–7 attendees. Group-neighbourhood alignment is reasonable (Vinohrady meets pull Vinohrady users, etc.). One bug flagged on punch-list P4: `meet-2` has `nikola-r` / `olga-m` attendee IDs that don't match `mockConnections` (`nikola` / no `olga`) — tier falls through to tier-3, not great but not blocking. Carry into Mock World Building. |
| E3 | Type-specific fields populated. | done — every walk has a `walk: {}` block, every park hangout has `parkHangout`, every playdate has `playdate`, every training has `training`. Individual field populations vary (not all walks have `terrain`, etc.) but detail page degrades gracefully via `hasMeetTypeDetails`. Acceptable for demo. |
| E4 | "People you know" plausibility. | done — `shawn` has 10 connections (4 Connected, 4 Familiar, 2 Pending) plus Open-profile attendees across the mock set. Enough overlap exists for tier-1/2 copy to render on most meets; fallback copy kicks in where it shouldn't — flag for Mock World Building. |
| E5 | Completed meets with photos. | done — 6 of 11 completed meets have photo galleries (meet-6, 7, 9, 10, 11, 12). Meets 1, 8, 13, 14, 20 are completed without photos — that's intentional mixture so the "Share your photos from this meet" prompt fires for some. Demo covers both states. |

### Schedule IA Cleanup (F)

Workstream opened 2026-04-25 mid-walkthrough. Triggered by the review-recent-meets card surfacing two IA problems: (1) review section was meet-only and would create asymmetry once Care reviews exist; (2) the `Interested` top-level tab was a relationship-filter pretending to be a type-filter. Scope-expansion call: do the IA restructure now while the pattern is fresh, defer the actual care-side review/close-out flows to Schedule & Bookings. Punch-list P11 (`/activity` vs `/schedule` IA ambiguity) partly resolves through this work.

Initial F1–F6 scope landed with three tabs (Upcoming/Meets/Care) and review-recent as a section on Upcoming. Re-scoped 2026-04-25 after revisiting Shawn's original 4-tab proposal — the **History tab** earns its own slot because it carries both pending reviews AND past chronicle, and "Review on a tab with notification badge" is a stronger affordance than "section header buried in Upcoming." Added F7 (History tab) + F8 (doc update for the 4-tab IA).

Deferred to Schedule & Bookings (captured in `docs/phases/schedule-bookings-deep-pass.md`): care review sheet content, provider session close-out flow, Hosted sub-pill question, Care sub-pill structure question, care side of History.

| # | Description | Status |
|---|-------------|--------|
| F1 | Schedule IA — drop `Interested` top-level tab, add Going/Interested sub-pills under Meets. | done — landed initially as 3-tab; re-scoped to 4-tab via F7 |
| F2 | Extract `ReviewRecentSection` — type-agnostic data flow accepting mixed meet + care items. | done |
| F3 | Per-card × dismiss with localStorage persistence — `lib/dismissedReviews.ts` utility. | done |
| F4 | Bulk "Dismiss all" action near the section header. | done |
| F5 | Empty state for review section — implemented as section self-hide. | done |
| F6 | Doc updates — phase board, walkthrough Schedule section, punch list P11, Schedule & Bookings stub. | done |
| F7 | Add History tab (4th tab) with badge support. Move `ReviewRecentSection` from Upcoming to History. Add "Earlier" section using `isPast` variant of `ScheduleMeetCard` (past-tense role labels + muted styling). Extend `TabBar` with optional badge prop. | done |
| F8 | Update walkthrough + phase board + Schedule & Bookings stub for the 4-tab IA. | done |

### Cross-Cutting

Audit done 2026-04-25. All four X-tasks were incidentally closed by earlier workstreams.

| # | Description | Status |
|---|-------------|--------|
| X1 | Visibility rules — meets respect the two-gate model. | done — tier logic via `getAttendeeTier` (see A3 + Make Connections step in D-c) is now canonical in `lib/meetUtils.ts`. Summary card, ParticipantList, and post-meet review all read from it. Per-meet `visibility` field (`"public" \| "group_only"`) enforced in creation flow (C4b) and respected by meet → group inclusion logic. Context gate + relationship gate both honoured. |
| X2 | Meet → Profile transitions. | done — `ParticipantCard` wraps both avatar and name in `<Link href="/profile/${userId}">`; organiser card on meet detail also links to profile. Clicking any attendee goes to their profile. |
| X3 | Meet → Group transitions. | done — organiser card's second row ("Hosted in this community") links to `/communities/${group.id}`. Summary count line also surfaces the group name (info color) as a visible chip. |
| X4 | Meet → Booking transitions. | done — landed via A8. "Book this session" card on care-group meets surfaces the provider (via `group.hostedBy`), links back to the care group, and the Book CTA goes straight to the booking flow. Feels like a natural extension, not a marketplace pivot. |

---

## Acceptance Criteria

- [ ] Meet detail page makes a tester say "I'd actually go to this"
- [ ] All four meet types render distinctively and tell the right story
- [ ] Meet cards across surfaces feel like one family
- [ ] Meet creation flow exists end-to-end and is pleasant
- [ ] Post-meet flow drives Familiar marking per Trust & Connection Model
- [ ] Mock meet data is rich enough that randomly opening any meet feels real
- [ ] Care-group meets connect cleanly to the booking flow
- [ ] Visibility rules respected (context gate + relationship gate)
- [ ] TypeScript compiles clean
- [ ] Feature docs updated (`docs/features/meets.md`)

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Review Punch List changes since phase open
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived, then delete original from `phases/`)
- [ ] **Structural audit** — archived-status docs in live folders, duplicated filenames between `phases/` and `archive/phases/`, docs with `last-reviewed` > 21 days, dead refs in README/CLAUDE/ROADMAP/CONTRIBUTING
- [ ] Check next phase scope (Community & Groups Deep Pass) for conflicts

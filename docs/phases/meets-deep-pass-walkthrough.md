---
status: active
last-reviewed: 2026-04-27
review-trigger: "walkthrough in progress; archive once ticked through"
---

# Meets Deep Pass — Walkthrough Checklist

Tick through each item to verify the work landed. Every check has:
- **What to do** — the specific surface / action
- **Expected** — what should happen
- **Known exception** — where applicable, a note so you don't flag intentional behavior as a bug

Recommend doing this with `npm run dev` open. Work through a workstream at a time; come back between sessions if needed.

**How to mark:** change `- [ ]` to `- [x]` as you confirm. If something's off, add a sub-bullet with what you saw.

---

## 1. Meet Creation Flow (C)

### Sheet entry + prefill

- [x] ~~**Home welcome card** entry point~~ **Scrapped 2026-04-25.** HomeWelcome component removed from the home feed after review — oversized, redundant CTA with Discover, and meet creation isn't a frequent-enough action for a hero slot. Component file orphaned (cleanup at phase close). Schedule + Group-detail Create entry points below remain the canonical ways to launch the MeetComposer.
- [x] **My Schedule header** (`/schedule`) → click Create → sheet opens, no group prefilled. *Fixed 2026-04-25 — the button was originally wired to `/activity`'s `MyScheduleTab` component, which isn't in the live bottom nav. Button now lives on `/schedule` via `PageColumn`'s `headerAction` slot.*
- [x] **Group detail page** (`/communities/group-1`) → header action Create → sheet opens with Vinohrady Morning Crew pre-selected
- [x] **Group detail Meets tab empty state** → Create meet button → same prefill
- [x] **Legacy URL** `/meets/create?groupId=group-1` → sheet opens with group-1 pre-selected (locked chip: "Posting to Vinohrady Morning Crew"), URL immediately flips to `/schedule`. Also try `/meets/create` (no query param) — sheet opens with no prefill, URL still lands on `/schedule`. Purpose: backward compat for bookmarks, mock notifications, and dev-menu entries that reference the pre-refactor route.

### Group + visibility section

The picker dropdown is only visible when no group is pre-selected. **To reach it,** open the composer from a no-prefill entry point: the Create button in `/schedule`'s header, or the calendar-plus icon in the top nav on `/schedule`. (From a group detail page the group is locked to that group by default; you can also reach the dropdown from there by tapping "Change" inside the locked chip.)

- [x] **Locked state** (open from `/communities/group-1`) → compact "Posting to Vinohrady Morning Crew" chip appears instead of the dropdown. Icon is grey (neutral), not blue. Change button on the right has breathing room from the edge.
- [x] Tap **Change** → chip is replaced by the full picker dropdown
- [x] **Dropdown** (from /schedule Create, or after tapping Change) → options grouped into Parks / Neighborhoods / Interest groups / Care groups
- [x] Private/approval groups show "(private)" suffix in the dropdown
- [x] **Pick an open group** (e.g. Vinohrady Morning Crew) → two tiles appear below: Anyone / Members only. Tap each, selection updates
- [x] **Pick a private group** (e.g. Vinohrady Evening Walkers) → tiles disappear, locked notice appears explaining `group_only` is forced
- [x] **Pick an approval group** (e.g. Prague Reactive Dog Support) → same locked notice

### Form essentials + progressive disclosure

Still inside the same MeetComposer sheet — scroll down past the group + visibility section.

- [x] Meet type picker — 2×2 grid, compact horizontal cards (icon + label only, no description). Selection toggles the brand tint + border.
- [x] Title + Location fields are required; Create button stays disabled until filled
- [x] Date + time are required (inside the "When" section); Create button still disabled until filled
- [x] **Time picker steps in 15-minute increments** (native spinner ticks :00, :15, :30, :45). Manual typing still accepts any value. Same step applied to Park Hangout's "Ends at" field.
- [x] **Location input is free text for now** — `Meet.lat` / `Meet.lng` exist in the type but aren't collected. POI autocomplete / map-picker tracked as punch-list P12 for post-demo.
- [x] **Type-specific section appears only after a type is picked.** Current state (after 2026-04-25 revisions):
  - **Walk** → "Walk details" — pace / distance / terrain pills. Route notes field removed (was a duplicate of the universal Description).
  - **Park hangout** → "Hangout details" — short explainer line, "Ends at" time input, amenities pills. Drop-in checkbox and Vibe selector removed (park hangouts are drop-in by definition).
  - **Playdate** → "Playdate details" — age range, play style, fenced area, max dogs per person.
  - **Training** → "Training details" — skill focus, experience level, led by, trainer name (if professional), equipment needed.
- [x] ~~**"Add more details" expander** collapses description, cover photo, duration/capacity/recurring, and rules/bring/accessibility by default.~~ **Superseded 2026-04-25** — split into two separate expanders (see next two items).
- [x] ~~Toggle the expander — caret rotates, text flips "Add more details" ↔ "Hide extras", body sections appear/disappear~~ **Superseded.**
- [x] **"Add details" expander** (below the When section) — collapses Description + Cover photo by default. Duration + Cadence moved up to the essentials "When" section (no longer hidden).
- [x] **"Rules & preferences" expander** (below the Add details one) — collapses Leash policy, Dog size, Energy level, Max attendees, What to bring, Accessibility notes.
- [x] Both expanders toggle independently — caret rotates, labels flip ("Add details" ↔ "Hide details", "Rules & preferences" ↔ "Hide rules & preferences").
- [x] **When section layout** — 2×2 grid on desktop (Date | Cadence / Time | Duration); single column on mobile with consistent `gap-md` spacing (no uneven vertical gaps).

### Cover photo

Inside the "Add details" expander.

- [x] Before picking a meet type: expander shows placeholder "Pick a meet type above to see starter images"
- [x] After picking Walk: 4 starter thumbs appear
- [x] Tap a starter → replaces the upload prompt with a 16:9 cover; X removes
- [x] ~~Upload a real file → works via FileReader; shows in the same slot~~ **Skipped 2026-04-25.** File upload is mock-only (in-memory data-URL preview, not persisted). Not worth formal verification for this prototype. FileReader code path is small and covered by code review.

### Cadence (formerly "Recurring expansion")

Cadence lives in the essentials **When** section now (upper-right of the 2×2 grid), not behind an expander. Default value is "One off." The "Repeat this meet" checkbox pattern was replaced 2026-04-25.

- [x] Cadence dropdown present in the When section — default "One off"
- [x] Leave as "One off" → no End date field, no preview line
- [x] Change to "Every week" → **Ends on** (optional) date field appears below the 2×2 grid, plus a plain-English series preview line
- [x] Weekly + no end date → "Every [Weekday] at [Time], ongoing."
- [x] Biweekly + end date → "Every other [Weekday] at [Time], through [Month Day, Year]."
- [x] Monthly → "Monthly on the first [Weekday] at [Time]…"
- [x] Change back to "One off" → End date + preview line disappear

### Success state

- [x] Fill required fields → Create button enables
- [x] Click Create → sheet swaps to success view. Title changes to "Your meet is live"
- [x] Preview card shows cover (if set), type + group tag, title, date/time, location, visibility line with icon
- [x] **Three actions stacked full-width, top-to-bottom:**
  - **Share meet** (primary, cta pill, share icon) — on mobile invokes the native share sheet (`navigator.share`); on desktop falls back to clipboard and button text flips to "Copied!" for ~2s
  - **View in group** (secondary, cta pill — matched visual weight to the primary) — routes to the group detail AND closes the sheet
  - **Create another** (tertiary text button) — resets form but keeps the group and visibility selected
- [x] **"What happens next" section** anchored at the bottom of the sheet via `mt-auto`, with a divider line above. Three check-listed reassurances about hosting:
  - `{Group name} members will see it in their feed`
  - `RSVPs come through to your notifications`
  - `You can edit or cancel anytime from the meet page`
- [x] Body fills the 72vh mobile sheet naturally — no awkward empty space, generous padding around the button group and the "What happens next" section

### Cancel

- [x] Cancel button → dismisses sheet, all state clears
- [x] Tap the X or overlay → same behavior

---

## 2. Meet Cards (B)

### Community feed (home)

- [x] Upcoming meet card (`FeedUpcomingMeet`) → shows type pill, title, date/time, location, **dog-forward avatars** (real dog photos, not owner faces), "N people · M dogs" count line
- [x] Completed meet recap card (`FeedMeetRecap`) → shows type pill, "· Recap", title, date/time, location, photo strip, people+dog footer

### Schedule timeline

**IA restructured 2026-04-25 (F-workstream).** Four top-level tabs now: **Upcoming** (cross-type committed view) · **Meets** (with Going / Interested sub-pills) · **Care** (with All / Getting / Providing sub-pills) · **History** (review queue + past chronicle, with notification badge). The old top-level `Interested` tab is gone — that filter lives under Meets now. Old `?view=interested` URLs redirect to Meets → Interested for backwards compat.

Schedule meet cards are intentionally text-first — no avatar stack. By the time a meet hits this surface you've already RSVP'd or hosted it, so the card's job is to identify the meet at a glance, not sell it. Avatars belong on discover/feed surfaces where the social signal drives the action.

#### Upcoming tab

- [x] Streamlined cross-type list of committed items (meets where you're going/hosting + active care sessions), grouped by date with Today / Tomorrow / weekday headers.
- [x] No review section here — review surface is on History now. Upcoming stays focused on its real job.

#### Meets tab

- [x] Sub-pills: **Going** / **Interested**.
- [x] Going = meets where you're joining or hosting. **Hosting cards stand out via two coordinated signals only**: full brand border around the card (vs the brand left stripe on joining cards) + brand-colored role chip with flag icon ("Hosting") on row 3. Type badge styling stays consistent regardless of role — a Walk badge looks the same whether you're hosting or joining (revised 2026-04-26: previously the badge inverted to filled-brand on hosting cards, which conflated type with ownership and made scanning by meet type harder).
- [x] Interested = explicitly interested + auto-suggested upcoming meets from groups you joined.
- [x] Card anatomy: row 1 = time + recurring chip (if weekly) + type tag (right-aligned, consistent styling). Row 2 = title. Row 3 = location + going count + role chip.

#### Care tab

- [x] Sub-pills: **All** / **Getting Care** / **Providing**. Sub-structure to be revisited in Schedule & Bookings phase.

#### History tab (NEW)

The past surface — pending review items at the top, older chronicle below. Notification badge on the tab itself shows the count of items still needing review.

**Tab badge:**
- [x] Brand-filled count badge appears next to "History" label when there are pending review items.
- [x] Badge updates immediately when items are dismissed or all are dismissed via bulk.
- [x] Badge disappears when all pending items are actioned.

**"Review recent meets" section (top of History):**
- [x] **Header row** — "REVIEW RECENT MEETS" left, "Skip all" right (small, tertiary).
- [x] **Review card (`isRecent`)** — visual identity comes from the standard schedule-card chrome (surface-top body, the same `--meet`/`--care`/`--providing` left stripe + border the regular cards use). What "recent" changes is the layout: body holds title + muted meta row (type · time · location · count); a footer action bar runs edge-to-edge below the body with a `--border-strong` top divider and `--surface-base` background. Footer split 50/50: **× Skip** on the left (text-tertiary), **Review →** on the right (brand-main text + caret), vertical divider between. Urgency communication is owned by the History tab's notification badge — the cards themselves only need to identify themselves.
- [x] **Skip button** — left half of the footer. Clicking does NOT navigate; it removes the card from this section (the card falls into the past chronicle below). `e.preventDefault()` + `e.stopPropagation()` on the button stops the wrapping `<Link>` from firing. State persists across reloads (localStorage via `useDismissedReviews`).
- [x] **Review button + the rest of the card** — clicking anywhere except Skip navigates to the meet's connect page (`/meets/[id]/connect`).
- [x] **Bulk "Skip all"** — header link. Skips every visible card at once.
- [x] **Section hides itself** when there's nothing left to review (or everything has been dismissed).
- [x] **"View N more" toggle** — when there are 2+ recent meets, only the most recent renders by default.

**Past chronicle (below review):**
- [x] Quieter chronological list of older past meets (older than 14 days, OR dismissed/reviewed-recent items that fell out of the top section).
- [x] **Date headers throughout** — every group, including the first, shows its date (e.g. "Saturday 11 Apr"). No "Earlier" category header — the History tab + muted card styling already establish the chronicle frame, and a separate label introduced an inconsistency where the first group had a categorical header while later groups had date headers.
- [x] Cards use `isPast` variant: standard meet card layout but with `.sched-card--past` muted styling (reduced opacity + base background). Role chip labels flip to past tense — Hosting → Hosted, Joining → Attended, Interested → Was interested.
- [x] Click on a past card routes to the meet detail page (not the connect/review page).
- [x] Empty state — "No history yet · Past meets and care sessions will show up here" — only when both review section AND past list are empty.

**Care side of History:** architected for but not populated. Care review and provider session-close cards land here once Schedule & Bookings designs them. See `docs/phases/schedule-bookings-deep-pass.md`.

### Discover meets (`/discover/meets`)

- [x] Cards are dog-forward
- [x] Spots-left signal appears only when ≤ 5 spots remain (and > 0)

### Group detail Meets tab (`/communities/group-1` → Meets tab)

- [x] Cards render with group chip hidden (since you're inside the group)
- [x] Dog-forward avatars

### ~~Group chat-context horizontal strip (group-detail chat section)~~

**Removed 2026-04-27.** Group detail tabs are Feed / Meets / Members / Gallery — no Chat tab. The `ChatTab` component + the meet-card strip in `app/communities/[id]/page.tsx` (lines 221–230, 625+) exist in code but are unreachable via UI. Dead code logged on the punch list. The compact-card walkthrough was intended for a chat surface that never landed (or was removed without full cleanup).

### Card-to-detail continuity

- [x] Tap a card → detail page loads. Type pill matches. Title matches. Date format matches. Group chip matches. No jarring transitions.

---

## 3. Meet Detail (A)

### Upcoming meet — all four types

Test each type at least once with one-off (non-recurring) meets, so the per-type rendering isn't tangled with the per-occurrence UI from the recurrence model:
- walk — `/meets/meet-33` (one-off walk)
- park hangout — `/meets/meet-2` (one-off park hangout)
- playdate — `/meets/meet-21` (one-off playdate)
- training — `/meets/meet-3` (one-off training)

- [x] Type badge row: type pill + (if care group) Paid session pill + (if recurring) Weekly pill + (if completed) Completed pill
- [x] Hero cover photo displays (or falls back to type image for meet-21)
- [x] Title → **parent-group eyebrow link** (small blue UsersThree icon + group name + caret, links to the community) → description → info card (date, time, location). The eyebrow is the canonical "go up to parent group" affordance.
- [x] **One-off meet RSVP** — single Going / Interested / Leave dropdown + Invite button
- [x] **"Organised by" section** — organiser avatar + name + connection-state pill (for non-self) + neighbourhood + "X meets hosted". Focused on host trust only — the in-section group row was removed 2026-04-27 (now redundant with the eyebrow link near the title).
- [x] **"Who's coming" summary** — avatar stack (dog-forward), count, trust signal line. _For recurring meets, instance-aware: defaults to next occurrence._
- [x] **Type-specific section** — has a narrative intro line under the title, distinct from other types
- [x] **Good to know section** — leash rule, energy (if set), dog size (if filtered), bring, accessibility. Max attendees does NOT appear here
- [x] **Photos section** (for an upcoming meet) → placeholder / empty state

### Recurring meet — `/meets/meet-1` (Shawn's morning walk, weekly)

The recurrence model (Meet Recurrence Model phase, 2026-04-27) split RSVP from series-level following. Verify both:

- [x] **"Upcoming dates" section** — lists the next ~3 occurrences, each row with its own date + going-count + per-row Going / Skip controls
- [x] **Skip an occurrence** → row goes muted with an inline Undo affordance (Skip is reversible per-occurrence; doesn't affect any other date or your relationship to the series)
- [x] **Mark Going on one occurrence** → that occurrence shows up on Schedule as its own card; other occurrences are independent
- [x] **Series-level "Interested" toggle** — separate from per-occurrence RSVP; subscribes you to the series (data: `Meet.followers`). Surfaces in the top action area next to Invite, distinct from the per-date Going / Skip rows below. Star icon swaps between light (inactive) and fill (active); button uses neutral fill (inactive) → brand-subtle fill (active).
- [x] **Interested only ≠ Going** — if you mark series Interested but don't Join any occurrence, the series shows up under Schedule → Meets → Interested but not under Going.

### Completed meet — `/meets/meet-14` (small dog playdate, completed)

Note: meet-14 is the only non-recurring completed meet in mock data. meet-6 (Sunday walk) is recurring + completed, but the Completed pill is suppressed on recurring meets per the recurrence model — recurring series don't "complete" in the singular sense.

- [x] "Completed" pill in the badge row
- [x] Section titles swap: "Who came" instead of "Who's coming"; photos gallery renders
- [x] Count line reads "N attended"
- [x] **No "Review this meet" CTA** — dropped 2026-04-26. Verify: there is NO Review button on the meet detail page. The review walkthrough lives only on Schedule → History.

### Care-group meet — `/meets/meet-care-1` (Klára's weekly training, recurring + paid)

Restructured 2026-04-27. Service info now lives near the top (above all other content sections). Booking happens per-occurrence — each Upcoming dates row carries a Book button. The bottom-of-page Book CTA is gone.

- [x] Paid session pill renders next to the type pill
- [x] **Service info card** at the top (before Upcoming dates) — heading "About this service" (recurring) — provider avatar + "From [care group] →" link + service label + price + spots-left. **No Book CTA on the card** (recurring uses per-row).
- [x] Below the price: helper line "Pick a date below to book a specific session."
- [x] **Upcoming dates rows** — each row's primary CTA is **Book** (not Join). Row meta line shows "10:00 · 350 Kč · 1/6 booked". Skip stays available as the soft decline.
- [x] **Tap Book** on a row → `ServiceBookingSheet` opens with date/time/location/price pre-filled
- [x] **Confirm in sheet** → success state ("See you Wednesday 30 April"), Done closes — and the row flips to a "Booked" committed state (secondary variant, Check icon, disabled — no toggle-back; cancellation lives elsewhere)
- [x] **Series-level "Interested" toggle** + Invite still render in the action row above (subscribe to the series without committing to specific dates)

### Care-group meet — one-off paid — `/meets/meet-care-workshop-1` (Klára's reactive dog workshop)

Added 2026-04-27 as a real test case for one-off paid rendering. Klára-hosted, 2-hour intensive workshop format — proves the "not every paid offering is a recurring weekly class" surface.

- [x] Service info card heading reads **"Book this session"** (not "About this service")
- [x] Card shows Book CTA + Invite inline (no separate action row above)
- [x] **The standalone RSVP/Invite action row is suppressed** — booking IS the commitment
- [x] No "Upcoming dates" section renders (one-off has no per-occurrence rows)
- [x] Tap Book → ServiceBookingSheet opens with `meet.date` (10 days from today) as the occurrence
- [x] After confirm: success state. The card stays — there's no per-row equivalent to flip to Booked. The booking propagates to Schedule via `setMeetRsvp` (verify under Upcoming + Meets → Going).
- [x] As a host (`?as=klara`) — the card shows price + spots context but no Book CTA (host can't book their own session). RSVP dropdown also still suppressed.

### Edge states

Mock data for these added 2026-04-27 — concrete meet IDs replace the prior "if any exist" hedges.

- [x] **Full meet** — `/meets/meet-full-playdate` (small-dog playdate at Stromovka, capacity 4, all 4 attendees ambient). View as any persona to see: "This meet is full" warning chip on Who's coming + RSVP dropdown copy "Meet is full" + Going option in dropdown disabled.
- [x] **Cancelled meet** — `/meets/meet-cancelled-walk` (Saturday morning walk at Riegrovy, host: Tereza, cancelled due to weather). View as any non-Tereza persona to see: "Cancelled" pill in badge row + strike-through title + RSVP block hidden + **cancellation banner** (status-error styling, X icon, "This meet has been cancelled" + reason) above the description. **Original description is preserved** — the banner carries the cancellation context, not the description.
- [x] Cancelled meet **DOES appear** in Schedule → Upcoming with cancelled treatment (strike-through title, "Cancelled" pill replacing role pill, muted card opacity). Calendar-app convention — silently disappearing would surprise the user. Falls off naturally when its date passes.
- [x] Self-viewed meet (you're the organiser) — view `/meets/meet-care-1` as `?as=klara` OR `/meets/meet-7` as `?as=tereza`. Organiser card says "That's you!" + no connection pill + "Hosting" indicator in place of RSVP/Book.

---

## 4. Post-Meet Review Flow (D)

### Triggers

The post-meet review walkthrough has exactly one canonical entry point now: the History tab's review-recent section. This was deliberately consolidated 2026-04-26 — the review walkthrough's value is the *prompt*, and the History tab is where the prompt earns its keep. Don't expect to find a "Review this meet" CTA on the meet detail page (it was there until 2026-04-26; dropped because it duplicated functionality the detail page already offers via Photos + click-through to attendees).

- [x] **History tab → review section** → tap a review card body or its "Review →" footer action → sheet opens. (Visual identity is the brand-colored left stripe + Skip/Review footer, not a full border.)
- [x] **Skip on a review card** → does NOT open the sheet; dismisses that card from the section instead (state persists via localStorage)
- [x] **Legacy URL** `/meets/meet-9/connect` → sheet opens for meet-9 and the URL lands on `/schedule` (the redirect was repointed from `/activity` to `/schedule` during F-workstream cleanup)
- [x] **Meet detail page** → confirm there is **no** "Review this meet" CTA. If you find one, the cleanup didn't take.

### Step 1 — Reflect (welcome + photos, merged 2026-04-25)

- [x] Sheet title: "Your meet"
- [x] Step indicator: 2 dots; dot 1 is wide + brand-filled, dot 2 is small + muted
- [x] Heading: "How was your [type]?" with subtitle
- [x] Recap card shows type pill, title, date/time, location, group (if set), "You walked with N people and M dogs"
- [x] **Body has horizontal padding** (`p-lg` on the inner wrapper — recurring miss; verify by checking that the heading and recap card don't run edge-to-edge)
- [x] **Photos block** below the recap (restructured 2026-04-27):
  - If `meet.photos` exists → 3-col square grid with the **Add cell as the first square** (dashed border, surface-base bg, upload icon + "Add" label). Existing photos follow.
  - If no existing photos → full-width dashed "Add a photo" prompt instead (since there's no grid to nest into)
  - Selecting a new photo → 16:9 preview with X to remove + "Change photo" button. The Add cell disappears from the grid (only one new photo per session — the preview's Change handles re-selection).
  - Caption textarea appears only after a new photo is added (optional)
- [x] Footer: Maybe later (dismisses sheet) / Continue (advances to step 2)

### Step 2 — Make connections

Heavily rebuilt 2026-04-27. Owner-first card layout (name peeks above dogs via `items-start`), state-grouped sections, Skip removed, Familiar gates Connect app-wide, "Open profile" indicator removed (deniability + mobile fit), section-aware card structure (footer for Not Familiar, inline pills for already-Familiar/Connected), profile-state-aware explainer.

**Best demo path:** view as Daniel (`?as=daniel`) → Schedule → History → tap the review card for `meet-reactive-spring` (curated to populate all four sections).

- [x] Sheet title flips to "Make connections"; both dots filled
- [x] **Profile-state-aware explainer card** at the top:
  - **Locked viewer** (Daniel, Tomáš): 🔒 "Your profile is locked" header, "People who don't know you only see your name and **[Bára]**" line (dog name personalized from `currentUser.pets[0]?.name`), then bold-labeled Familiar / Connect explanation lines.
  - **Open viewer** (Tereza, Klára): 🌐 "Your profile is open" header + Connect-only explanation.
- [ ] **Bulk button "Mark everyone familiar"** — applies only to the Not Familiar top section. Hidden for open viewers (no Familiar action) and when the section is empty / already-marked.
- [ ] **State-grouped sections** (empty sections hide entirely):
  - **Top (unlabeled)** — Not Familiar. Most cards live here.
  - **Familiar** — previously marked.
  - **Connected** — already mutual.
  - **Locked profiles** — tier 3 attendees, name + small avatar pills only.
- [ ] **Owner-first card body:** owner avatar 64px primary (left), dog(s) 32px overlapping bottom-right with white `box-shadow` ring (NOT `border` — image stays a true 32×32). Owner name primary, dog list "Bára and Eda" / "Bára, Eda + 2" secondary. **Row uses `items-start`** so the name sits at the row top while the dog cluster anchors at the bottom of the avatar combo.
- [ ] Multi-dog attendees (e.g., Eva with Luna + Max) show 2 dog avatars; 3+ would show a "+N" chip.

**Section-specific card behaviors:**

- [ ] **Not Familiar cards: inline pill always present, label EVOLVES with the mark.**
  - Unmarked: `Familiar` pill (secondary, outline) — tap to mark
  - Marked Familiar: pill becomes `Connect` (secondary, outline) — tap to escalate; quiet footer appears below: `✓ Familiar` label + `Undo` link (right-side, uppercase)
  - Marked Connect: pill becomes `Connect` (primary, brand-fill) — tap to downgrade back to marked Familiar; footer stays
  - **Tap Undo** → cascades back to unmarked (clears both Familiar AND Connect since Connect implies Familiar). Card returns to its initial state.
- [ ] **Familiar section cards** — inline secondary Connect pill on the right (no footer). Tap → primary-fill (selected). To undo the prior Familiar mark, the user goes elsewhere (member detail / profile) — not from this sheet.
- [ ] **Connected section cards** — inline primary Message pill on the right (no footer). Currently a no-op click; placeholder for inbox routing.
- [ ] **Skip is gone** — section position carries the "I'm not acting on this" meaning. Cards left untouched stay where they are.
- [ ] **No "Open profile" indicator** on cards — leaks deniability info (open profile vs they-marked-me-Familiar should be visually indistinguishable) and was breaking mobile layout.
- [ ] **Card sizing:** 12px padding, 32×32 dog avatars with `radius-md` (slightly rounded square — differentiates from owner's round avatar), white box-shadow ring on dogs, dogs bottom-aligned to owner (no longer extending below).
- [ ] Footer: Back / Done

### Sheet lifecycle

- [ ] Done (step 2) → sheet closes
- [ ] Close with X or overlay click from any step → all state resets
- [ ] Re-open → starts at step 1

---

## 5. Cross-cutting (X)

### Visibility + tier rendering

- [ ] Meet-2 (has tier-3 attendees) → detail page summary shows dog names as fallback or tier-1/2 copy if Shawn knows someone. Tier-3 faces don't leak into the avatar preview
- [ ] Post-meet review step 3 for meet-2 → tier-3 attendees are in "Also there", not in the main cards
- [ ] ParticipantList (People tab on meet detail) → honours the same tier model

### Link transitions

- [ ] Tap any attendee avatar or name in ParticipantList → `/profile/[userId]` loads correctly
- [ ] Group chip on meet detail → community page loads
- [ ] Service CTA "Book" on care-group meet → booking flow loads

---

## 6. Regression — things that shouldn't have broken

- [ ] Tap-through from any meet card → correct meet detail
- [ ] RSVP cycle (Going → Interested → Leave) still works on meet detail
- [ ] Meet detail tabs (Details / People / Chat) still switch cleanly
- [ ] Meet photo gallery (completed meet) still renders
- [ ] Home feed still shows a reasonable mix of posts + upcoming meets + completed recaps
- [ ] Community detail — Feed, Meets, Members (+ Events, Services, Gallery for Care groups) all render

---

## 7. Known deferrals — NOT bugs, don't flag

These were consciously scoped out. If you notice them and they matter for testing, raise them; otherwise they're on the follow-up list.

- **Photo tagging of people/dogs** — post-meet Photos step is upload+caption only. Photo-tagging ties into gallery comments (future)
- **D4 connection-escalation prompt** — "You marked X familiar — want to connect?" after multiple meets. Needs cross-meet state
- **D5 host-side post-meet flow** — different UX from attendee side, deferred
- **A9 "Tag who came"** — ties to photo tagging
- **A11 edge states** — host-left, banned-from-group — no mock data for these yet
- **A12 mobile responsiveness polish** — deferred to real device testing
- **B4 "differentiates from groups and providers"** — cross-component comparison belongs in Discover & Care Deep Pass
- **Post-meet marks don't persist globally** — sheet-local state; Familiar marks don't propagate to ParticipantList or profile cards
- **Meet-2 attendee ID mismatch** (`nikola-r`, `olga-m`) — tier falls through to tier-3; flagged for Mock World Building (punch list P4)
- **`PostMeetReveal.tsx` orphan** — superseded by `PostMeetReviewSheet`; file-delete blocked in sandbox, clean up at phase close
- **`/meets/create` route is a redirect, not a full page** — intentional, legacy compat for bookmarks + the dev-menu entries
- **Recurring-meet RSVP behaviour is now instance-aware** (Meet Recurrence Model phase, 2026-04-27). The meet detail for recurring meets shows an "Upcoming dates" section with per-occurrence Going + Skip rows (Skip is persistent and reversible inline) and a separate series-level "Interested" toggle in the top action row. Schedule renders one card per (meet, occurrence-date). Cards across the app show "Next: [date]" for recurring meets. One-off meets unchanged. See `docs/phases/meet-recurrence-model.md` and the doc updates in `Trust & Connection Model.md` and `features/meets.md`.

---

## 7b. Deferred verification — needs Persona & Demo Mode Wiring

These items *can't* be practically tested in the current state because they require viewing the app as a different persona (or with different state) than Shawn's default. They're intentional behavior, verified by code review, and will be ticked off during the **Persona & Demo Mode Wiring** phase (`docs/phases/persona-wiring.md`) once the switcher lets reviewers drop into each persona's view.

Add items here as you find them during the walkthrough — don't try to hack around them in the current build.

- [x] **No-groups empty state in MeetComposer** — verified 2026-04-26 as the `new-user` persona (`/profile` → name dropdown → New User). `getGroupsUserCanPostMeetsIn("new-user")` returns `[]`, so `MeetComposer`'s `GroupVisibilitySection` renders the empty-state panel ("You need to join a group first") with Browse / Create CTAs. Re-verifiable any time via `?as=new-user`.
- [x] **"People you know" dog-first fallback copy** — verified 2026-04-26 as Daniel (`?as=daniel`). `getConnectionState(userId, viewerId)` returns `undefined` for non-Shawn viewers (Mock-World-Building scope), so `knownAttendees` resolves to `[]` for any meet Daniel views, and the summary line falls through to the dog-first copy ("Rex, Luna + N more dogs"). Re-verifiable any time via `?as=daniel` or `?as=tomas`.
- [x] **Connection-state pill on organiser card** — verified 2026-04-26 as Shawn viewing `/meets/meet-2`. The organiser is Tomáš; `getConnectionState("tomas", "shawn")` returns the `conn-tomas` entry with `state: "pending"`, so the "Request sent" pill renders next to the organiser card. (Cleaner Pending-specific verification awaits Mock-World-Building seeding pending connections for non-Shawn personas.)

**Resolved at Persona Wiring close (2026-04-26).** All three items verified live via the dropdown picker + URL-param overrides. Switcher contracts: `?as=<personaId>` URL param + name dropdown on `/profile` (`docs/features/demo-mode.md`).

---

## 8. Pre-existing lint / type issues — NOT mine, don't flag

- `app/meets/[id]/page.tsx:213, 242` — `useEffect` called conditionally after early return. Pre-existing from 2026-04-09/10 commits.
- `app/meets/[id]/page.tsx:888` — unused `meet` param in a sub-component. Pre-existing.
- `app/communities/[id]/page.tsx:162` — same conditional `useEffect` pattern. Pre-existing.

Worth a targeted lint sweep in a future pass, but not in scope for Meets Deep Pass.

---

## 9. Wrap-up actions after ticking through

Once the walkthrough is done:

- [ ] Raise anything that surprised you in `punch-list.md` or (for bigger items) a new phase doc entry
- [ ] Walk `docs/phases/meets-deep-pass.md` acceptance criteria top-to-bottom and sign them off
- [ ] Start the phase close per `CONTRIBUTING.md` → Closing a Phase (9 steps)
- [ ] Archive this walkthrough doc alongside the phase board when you close

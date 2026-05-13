---
status: active
last-reviewed: 2026-05-11
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Cross-Cutting Flow Testing — Walkthrough

Verification checklist for the Cross-Cutting Flow Testing phase. **Primarily for checking** — decisions and follow-ups belong in the phase board, Open Questions log, or feature docs. Emergent decisions land in the **"Decisions surfaced during walkthrough"** section at the bottom.

**Scope rule.** This phase tests the thesis that *every persona's journey holds end-to-end with no dead ends*. The pre-loaded data-hygiene seeds (D1–D4 edge cases) and the People-tab disclosure model (P32) are the structural changes to verify. Wider regression / cross-persona permutation work goes in `verification-checklist.md` if it surfaces.

**How to use:**

1. Dev server runs on port 3000.
2. Switch personas via profile-name dropdown, `/demo`, or `?as=<personaId>`.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza, Daniel, Klára, Tomáš, New User.

**Pre-walkthrough reset.** Before walking, hit `/demo` → "Reset demo state" so any cached connection overrides from prior sessions don't mask the seeded edge cases.

---

## Workstream A — D1–D4 edge-case seeding (data-only)

Each persona has one canonical upcoming meet seeded with D1 (tier-2 unmarked open), D2 (tier-2 inbound Familiar — deniability), D3 (Pending pill). D4 (following + non-attendee) is satisfied via `SEED_FOLLOWERS` on a different recurring series per persona.

**People-tab section model** (from `components/meets/ParticipantList.tsx`):
- **Connected** — viewer's outbound `state === "connected"`.
- **Familiar** — viewer's outbound `state === "familiar"` only. Empty / hidden when the viewer has no outbound Familiar marks on this meet's roster.
- **Other attendees** — neutral catch-all for everything else tier-1/2: Open profiles (D1), inbound `theyMarkedFamiliar` (D2), and Pending (D3) all land here. Header is intentionally neutral so the receiver can't infer cause — the deniability rule.
- **Locked** (tier 3, chip list at bottom) — Locked profile + no relationship.

D1 + D2 + D3 attendees all surface in **Other attendees**. D3 additionally renders a Pending pill on the row itself.

**P32 (action gating) resolved 2026-05-11.** Action pills (Familiar / Connect / Message) now render for viewers with **meet-level engagement** — creator, any RSVP (past or future, going or interested), or series follower. All four personas qualify for their own canonical meets (they're creators), so action pills are visible on A1–A4 rows.

### A1 — Tereza

- [x] **A1.1 — People tab (D1–D3).** Go to `/meets/meet-15?as=tereza` → *"Thursday morning — Riegrovy sady"* (weekly, Tereza creator). Tap the **People** tab. Verify:
  - **Connected:** Marek.
  - **Familiar:** Shawn (Tereza's outbound `state: "familiar"` on Shawn).
  - **Other attendees:** Nikola (D1 — Open), Filip (D2 — *no pill; promoted by inbound Familiar*), Jakub (D3 — Pending pill on the row).
- [x] **A1.2 — Discover Meets "your circle" (D4).** *Surface moved 2026-05-11 — Schedule's Interested lane retired; followed series + group-meets now elevated on Discover Meets via the "Meets from your circle" section.* Go to `/discover/meets?as=tereza`. **"Meets from your circle"** section at top should include **"Morning walk — Riegrovy sady"** (the Vinohrady Morning Crew weekly Tereza follows). Visual: same `CardMeet` shape, under a section header above the broader marketplace.

### A2 — Daniel

- [x] **A2.1 — People tab (D1–D3).** Go to `/meets/meet-17?as=daniel` → *"Reactive dog walk — Stromovka quiet zone"* (weekly, Daniel creator). Tap the **People** tab. Verify:
  - **Connected:** Hana.
  - **Familiar:** Vítek (Daniel's outbound `state: "familiar"` on Vítek).
  - **Other attendees:** Petra (D1 — Open), Marek (D2 — *no pill; inbound Familiar*), Lucie (D3 — Pending pill on the row).
- [x] **A2.2 — Discover Meets "your circle" (D4).** Go to `/discover/meets?as=daniel`. **"Meets from your circle"** section should include both **"Evening stroll — Vítkov"** and **"Thursday morning walk — Riegrovy sady"** (Daniel follows both). Plus any reactive-dog group meets he's eligible for (group-member inclusion).

### A3 — Klára

- [x] **A3.1 — People tab (D1–D3).** Go to `/meets/meet-18?as=klara` → *"Klára's group training — socialisation"* (weekly, Klára creator). Tap the **People** tab. Verify:
  - **Connected:** Filip, Hana, Shawn.
  - **Familiar:** *empty / not rendered* — Klára has no outbound Familiar marks on this roster.
  - **Other attendees:** Petra (D1 — Open), Jakub (D2 — *no pill; inbound Familiar*), Jana (D3 — Pending pill on the row).
- [x] **A3.2 — Discover Meets "your circle" (D4).** Go to `/discover/meets?as=klara`. **"Meets from your circle"** section should include **"Thursday morning — Riegrovy sady"** (newly seeded — Klára follows Tereza's series). Klára's own training series may also appear here via group-member inclusion (she runs Calm Dog Sessions).

### A4 — Tomáš

- [x] **A4.1 — People tab (D1–D3).** Go to `/meets/meet-19?as=tomas` → *"Karlín riverside hangout"* (one-off, Tomáš creator). Tap the **People** tab. Verify:
  - **Connected:** Petra, Ondřej, Adéla.
  - **Familiar:** *empty / not rendered* — Tomáš's outbound Familiar marks (Jakub, Marek) aren't on this meet's roster.
  - **Other attendees:** Jana (D1 — Open), Vítek (D2 — *no pill; inbound Familiar*), Shawn (D3 — Pending pill on the row).
- [x] **A4.2 — Discover Meets "your circle" (D4).** Go to `/discover/meets?as=tomas`. **"Meets from your circle"** section should include **"Thursday morning — Riegrovy sady"** (newly seeded — Tomáš follows) and Karlín-group meets (he's a Karlín Dog Neighbors member). "Karlín morning coffee walk" appears here once even though he's both a follower and a group-member — dedup by meet id.

### A5 — New User

- [x] **A5.1 — Empty states intact.** Go to `/?as=new-user`. No connections, no attended meets, no edge-case attendees on any People tab (per the empty-state design). Then `/schedule?as=new-user` should render the empty Upcoming state. `/discover/meets?as=new-user` skips the "Meets from your circle" section entirely (no in-circle data) and renders the flat marketplace list.

---

## Workstream B — Cross-persona discovery walkthrough

Discovery sweep: switch persona, hit each top-level surface, note dead-ends. **Don't tick a row until you've actually clicked through the persona.** Every URL carries its `?as=<persona>` explicitly so you can copy-paste without losing context.

### B1 — Tereza (`?as=tereza`)

- [x] **B1.1 — `/home?as=tereza`.** Vinohrady-anchored feed reads coherent — group activity, Riegrovy posts, neighbour connections.
- [x] **B1.2 — `/discover/meets?as=tereza`, `/discover/groups?as=tereza`, `/discover/care?as=tereza`.** Each surface populates; no empty-state on a populated archetype.
- [x] **B1.3 — `/profile?as=tereza`.** Open profile renders Carer audience pill (circle), Franta + Bella pet cards, **About / Posts / Services tabs** (no Chat tab — own-profile route has no chat; that surface lives at `/profile/[userId]` for viewing others).
- [x] **B1.4 — `/bookings?as=tereza`.** Dual-tab view (My Care = Olga walking Franta; My Services = Tereza sitting Benny). Active session if any.
- [x] **B1.5 — `/schedule?as=tereza`.** Upcoming + History tabs populated; no broken cards.
- [x] **B1.6 — `/inbox?as=tereza`.** Conversation threads load; unread dots consistent with notification bell.

### B2 — Daniel (`?as=daniel`)

- [x] **B2.1 — `/home?as=daniel`.** Reactive-dog-leaning feed; Klára training booking surfaces.
- [x] **B2.2 — `/communities/group-reactive-dogs?as=daniel`.** Eva's admin posts, Daniel's own contributions in the feed. Members tab reflects Daniel's relationships, not raw profile visibility: **Connected** = Klára, Hana, Anežka; **Familiar** = Vítek, Eva; **Other attendees** = Shawn (Open, no rel); **Locked chip** = Martin (the only no-relationship Locked member). Daniel's broad Connected/Familiar coverage of this group is the demo arc — the support group is where his trust network was built. Visibility chip in the hero reads **"Approval-only"** (was "Approval to join" pre-2026-05-11 — copy refreshed during the walkthrough; tap the chip for the explainer).
- [x] **B2.3 — `/profile?as=daniel`.** Daniel's own profile reads as: sparse bio, Bára (reactive rescue) pet card, **Smíchov** as the neighbourhood (Prague district) in the hero meta row. Hero now carries a **"Locked profile"** chip (Lock icon, neutral pill) next to his name — self-view privacy disclosure. Tap the chip → tooltip: *"Only Connected members see your full profile. Others see a placeholder until you mark them Familiar or accept a Connect."*

### B2.7 — Profile visibility chip across personas (verifies the new chip)

- [x] **B2.7a — Locked persona.** `/profile?as=daniel` → chip reads **"Locked profile"** with `Lock` icon.
- [x] **B2.7b — Open persona.** `/profile?as=tereza` → chip reads **"Open profile"** with `Eye` icon. Tap → tooltip: *"Anyone using Doggo can see your full profile, posts, and dogs."*
- [x] **B2.7c — New user defaults to Locked.** `/profile?as=new-user` → chip reads **"Locked profile"** (the spec default for unset `profileVisibility`).
- [x] **B2.7d — Chip is self-view only.** Switch persona via `?as=tereza` then visit `/profile/daniel` (other-user route) — **no visibility chip** in that hero. The chip is the owner's privacy mirror; locked-vs-open communicates to others via full-card-vs-placeholder rendering.
- [x] **B2.7f — Locked-profile layout (CCFT 2026-05-11 redesign).** Continuing on `/profile/daniel?as=tereza` (Tereza viewing Daniel — locked, shared context via group co-membership). Verify:
  1. **Hero (horizontal at sm+):** 160px locked-treatment avatar (slight darken + tiny blur — the privacy filter) on the left; firstName + invitation copy + Familiar pill stacked in the right column. Stacks vertically on narrow viewports. Mirrors the unlocked-profile hero shape so locked and unlocked feel like the same surface in different states.
  2. **Familiar pill:** outline aesthetic (transparent bg, border-strong, tertiary text) at the `.private-profile-row-pill--lg` size — bigger than the row-list version but still quiet. A brief brand-filled experiment was tested + reverted; locked surfaces should read as *considered invitation* not *loud commit*. Above the button: "Have you met Daniel? Mark them familiar to let them see your profile." Tap → button flips to `is-marked` state ("Familiar ✓") + copy updates to "Daniel can now see your profile and tags from shared contexts."
  3. **Shared context card (full-width, no fill, border):** UsersThree icon + "You and Daniel" heading, then a sentence listing *all* shared groups: "You're both in **Prague Reactive Dog Support** and **Klára's Calm Dog Sessions**." Card chrome is `border: 1px solid var(--border-regular)` with no background fill.
  4. **Lock card (full-width, inset fill):** LockSimple icon + privacy copy ("Daniel keeps their profile private…") + **"Learn how privacy works"** link inline at the bottom of the card. Keeps its muted inset fill so the visual hierarchy reads "warmth = clean, gate = muted."

  *Future-state: shared past-meets line ("You attended 3 meets together") is filed as punch-list P66 pending a `getSharedMeetsBetween` list-returning helper.*
- [x] **B2.7e — Edit affordance + section order + nested Familiar card.** Go to `/profile?as=daniel`. About tab section order is **Hero → Bio → Dogs → Profile visibility → Tagging preferences → Connections (with Familiar aside nested) → Care**. Privacy + Tagging now sit ABOVE the Connections list (reordered 2026-05-11 so settings aren't buried below a scroll-heavy roster). Profile visibility section has two full-width option rows (Locked + Lock icon / Open + Eye icon) — same layout as Tagging preferences. **Locked** is active by default for Daniel. Tap **Open** → row highlights brand-subtle, hero chip flips to **"Open profile"** with the `Eye` icon in real time. Tap **Locked** again → reverts. *(State doesn't persist across persona swaps in the prototype; accepted limitation.)* Scroll past the settings — Connections renders with the *About marking people Familiar* aside nested inline (no divider above; reads as part of the Connections section). *Note: whether Connections belongs on the About tab at all is a [Profiles Deep Pass E4](./profiles-deep-pass.md) decision; this reorder is tactical and doesn't preempt it.*
- [x] **B2.4 — `/bookings/booking-klara-daniel?as=daniel`.** Recurring Wed booking, kd-1 through kd-5 sessions readable as relative dates. "Since" stat on Info tab now reads ~5 weeks ago (was a static 2026-02-10; relativised 2026-05-11).
- [x] **B2.5 — `/schedule?as=daniel` (post-IA-refresh).** Schedule now has **only two top-level tabs — Upcoming + History** (Meets + Care tabs retired 2026-05-11). Upcoming carries sub-pills **All / Meets / Care** for type filtering.
  - **Upcoming → All:** **"Reactive dog walk — Stromovka quiet zone"** appears alongside Daniel's care booking sessions in date order.
  - **Upcoming → Meets:** Just the meets — "Reactive dog walk — Stromovka quiet zone".
  - **Upcoming → Care:** Just the booking sessions (Klára training sessions).
  - **History tab:** **"Reactive dog small-group walk"** (meet-10, weekly, completed ~8 days ago) and **"Spring reactive dog community walk"** (meet-reactive-spring, one-off, completed ~6 days ago).
  - **Interested / followed series are NOT in Schedule anymore** — they live on Discover Meets' "Meets from your circle" section (verified in A2.2). Schedule = pure commitments + past.
  - No broken cards or empty placeholders across any tab/sub-pill.
- [x] **B2.6 — `/inbox?as=daniel`.** Daniel's inbox should render **a single conversation row** for **Klára H.** — Daniel has only one seeded conversation (`daniel-klara-conv`, the recurring training booking thread). Row content: Klára avatar (circle, 44px) + "Klára H." + latest message preview (from `dk-10`) + relative timestamp + **unread dot** (`unreadCount: 1`) + booking-service label (e.g. "Reactive dog session" or similar). Tap the row → opens the thread with the full message history: inquiry → proposal → contract → session reports. *(Daniel's "thin network" persona arc shows up here as a one-row inbox; that's by design, not a missing-data bug.)*

### B3 — Klára (`?as=klara`)

- [x] **B3.1 — `/home?as=klara`.** Provider-side feed: training recaps, client posts.
- [x] **B3.2 — `/communities/group-klara-training?as=klara`.** Care config (training), Hosting suppressed CTAs, multi-client members tab.
- [x] **B3.3 — `/profile?as=klara`.** Open profile, Carer audience = anyone (public), Services tab with full catalogue.
- [x] **B3.4 — `/bookings/booking-klara-daniel?as=klara`.** Provider-side view (session check-ins visible).
- [x] **B3.5 — `/schedule?as=klara`.** Training meets in Upcoming; cross-cluster (Stromovka, Reactive) past meets in History.
- [x] **B3.6 — `/inbox?as=klara`.** Client threads (Daniel + others); proposal artifacts visible.

### B4 — Tomáš (`?as=tomas`)

- [x] **B4.1 — `/home?as=tomas`.** Karlín-leaning feed; Petra emergency-sitting story arc.
- [x] **B4.2 — `/communities/group-karlin-neighbours?as=tomas`.** Petra's admin announcement, Filip/Adéla posts.
- [ ] **B4.3 — `/profile?as=tomas`.** Locked profile, Hugo, Karlín. Low-key user, provider switch off.
- [ ] **B4.4 — `/bookings?as=tomas`.** Past Petra emergency booking + any others; "trail of care arrangements that worked."
- [ ] **B4.5 — `/schedule?as=tomas`.** Karlín / Riegrovy meets in Upcoming + History.
- [ ] **B4.6 — `/inbox?as=tomas`.** Petra emergency thread surfaces with booking context on the row.

### B5 — New User (`?as=new-user`)

- [ ] **B5.1 — `/home?as=new-user`.** `getNewUserFeed()` welcome state — no connections, no completed meets.
- [ ] **B5.2 — `/discover/meets?as=new-user`, `/discover/groups?as=new-user`, `/discover/care?as=new-user`.** Discovery surfaces populate from public data (groups + meets visible; care = global directory).
- [ ] **B5.3 — `/profile?as=new-user`.** Empty pets, blank bio, locked. No carer config.
- [ ] **B5.4 — `/inbox?as=new-user` + `/bookings?as=new-user`.** Empty states render gracefully (no errors, no broken cards).

---

## Workstream C — Mock-date staleness sweep (P20)

Static dates that drive UI relative-time labels were checked. Fixes landed:
- `components/feed/FeedCard.tsx:formatRelativeDate` — removed hardcoded `now = "2026-03-23T12:00:00Z"` constant; uses `Date.now()` now. *Previously calculated bogus diffs against a fixed moment.*
- `lib/mockPosts.ts:post-klara-community` — migrated to `daysAgoIso(0, "10:30")` so the "Great session this morning!" caption aligns regardless of when the demo opens.

- [ ] **C1 — `/home?as=tereza`.** Klára's community post (Vinohrady Morning Crew) reads as "Just now" or "Xh ago" rather than "23 Mar."
- [ ] **C2 — Feed cards across all personas.** No timestamps render as future dates or absurd "Xd ago" values (e.g. negative).
- [ ] **C3 — Older feed posts (deeper history).** Still render as absolute date ("23 Mar") via the >7d fallback — these are intentionally static.

---

## Workstream D — People tab disclosure model (P32, **shipped 2026-05-11**)

Resolved during the cross-persona walkthrough: actions are now gated by **meet-level engagement** rather than past attendance. Viewers who are the creator, have any RSVP on any occurrence (past or future, going or interested), or follow the series get Familiar / Connect / Message inline. Random Discover viewers with no commitment still see info-only rows. Info-vs-action separation preserved.

Code change: `viewerCanAct(meet, viewerId)` in `lib/meetUtils.ts` (widened); `viewerSharedMeetWith` (locked-profile shared-context gate) kept narrower past-shared-attendance semantics. See phase board for full rationale.

- [ ] **D1.** Tereza on `/meets/meet-15?as=tereza` (creator + attendee): action pills (Familiar / Connect / Message) render on Connected, Familiar, and Other-attendees rows; chip-list on Locked-with-no-context rows.
- [ ] **D2.** Daniel on `/meets/meet-17?as=daniel` (creator + attendee): same — action pills visible.
- [ ] **D3.** Switch persona via `?as=` to a non-RSVP'd viewer on a public meet (e.g. `/meets/meet-19?as=daniel` — Daniel hasn't RSVP'd to Tomáš's one-off Karlín hangout): **no action pills**; info is still visible.
- [ ] **D4.** Tomáš on `/meets/meet-19?as=tomas` (creator of a one-off upcoming meet): action pills visible — the case that surfaced the original P32 issue.

---

## Workstream E — Group join flow + visibility chip refresh (shipped 2026-05-11)

Two design changes landed mid-walkthrough off a B2.2 observation that the "Approval to join" chip read like an instruction:

1. **Tri-state `GroupVisibilityChip`** — all three visibility states now render a chip with parallel structure (icon + single-word label + tap-tooltip explainer). Open was previously absence-as-signal; now it carries a `Users` icon + "Open" label so users learn the system regardless of which group type they hit first. Copy: `Open` / `Approval-only` / `Private` (was `Open=nothing` / `Approval to join` / `Private · approval to join`).
2. **Helper line + request-to-join modal** — small tertiary text under the Join/Joined CTA that teaches the action behaviour (for non-members) or gives ambient privacy reassurance (for members). Approval-only groups open a `RequestToJoinModal` that captures an optional context note ("Tell Eva about your dog (optional)") so the admin gets more than a blind state flip.

Implementation: `components/groups/GroupVisibilityChip.tsx`, `components/groups/RequestToJoinModal.tsx`, `app/communities/[id]/page.tsx` (`getJoinHelperText` resolver + modal wiring). Strategy spec: `strategy/Groups & Care Model.md` → "Group visibility + join flow."

### E1 — Visibility chip tri-state

- [ ] **E1.1 — Open group chip.** Go to `/discover/groups?as=tereza` and scan the cards. Open groups (Vinohrady Morning Crew, Stromovka Off-Leash Club, etc.) should each show an **Open** chip with the `Users` icon. Tap the chip → tooltip reads *"Anyone can see this group and join instantly."*
- [ ] **E1.2 — Approval chip copy.** Go to `/communities/group-reactive-dogs?as=daniel`. Hero chip reads **"Approval-only"** (was "Approval to join"). Tap → tooltip: *"Anyone can see this group. Joining requires admin approval."*
- [ ] **E1.3 — Private chip copy.** Go to `/communities/group-tereza-neighbourhood?as=tereza`. Hero chip reads **"Private"** (was "Private · approval to join"). Tap → tooltip: *"Hidden from non-members. Joining requires admin approval."*

### E2 — Helper line under Join CTA (non-member states)

The helper line is the small tertiary-text line that sits directly under the action button row.

- [ ] **E2.1 — Open + non-member.** Go to `/communities/group-1?as=daniel` (Daniel isn't in Vinohrady Morning Crew). Button reads **"Join community"**; helper line reads *"Anyone can join — no approval needed."*
- [ ] **E2.2 — Approval + non-member, fresh.** Go to `/communities/group-reactive-dogs?as=tomas` (Tomáš isn't in the reactive group). Button reads **"Request to join"**; helper line reads *"Eva will review your request."*
- [ ] **E2.3 — Approval + non-member, after sending request.** Continuing from E2.2, tap "Request to join" → modal opens → tap **Send request**. Button flips to **"Request sent"** (brand-subtle, disabled); helper line changes to *"Awaiting Eva's response."*

### E3 — Helper line for members + admins

- [ ] **E3.1 — Open + member.** Go to `/communities/group-1?as=tereza` (Tereza is a member of Vinohrady Morning Crew). Button reads **"Joined"**; helper line is *silent / not rendered* (no useful copy to add on open + member).
- [ ] **E3.2 — Approval + member.** Go to `/communities/group-reactive-dogs?as=daniel` (Daniel is a member). Button reads **"Joined"**; helper line reads *"New members reviewed by admin."*
- [ ] **E3.3 — Approval + admin.** Go to `/communities/group-reactive-dogs?as=eva` (Eva is admin; only reachable via `?as=` URL param since Eva isn't in the persona picker). Button reads **"Admin"** (disabled); helper line reads *"New members reviewed by you."*
- [ ] **E3.4 — Private + member-admin.** Go to `/communities/group-tereza-neighbourhood?as=tereza` (Tereza is creator/admin of her own private neighbourhood group). Button reads **"Admin"**; helper line reads *"Members-only — content stays in the group."*

### E4a — Header-action convention sweep

Header-slot actions now use **`outline + sm + leftIcon + text`, no `cta` (rectangular)** — same render desktop + mobile, replaces the earlier mix of brand-filled pills and icon-only buttons. Documented as Principle 11 in `design-system.md`.

- [ ] **E4a.1 — Group detail header.** Go to `/communities/group-reactive-dogs?as=daniel`, scan Feed / Meets / Members tabs:
  - Feed → header right reads **`[+ Post]`** (was an icon-only AddPostIcon).
  - Meets → **`[+ Create]`** (was brand pill).
  - Members → **`[👤+ Invite]`** (was brand pill).
  - All three: outline border, neutral fill, rectangular.
- [ ] **E4a.2 — Meet detail header.** Go to `/meets/meet-15?as=tereza`, Details tab. Right action **`[↗ Share]`** is rectangular (was outline pill — dropped `cta`).
- [ ] **E4a.3 — Home header.** Go to `/home?as=tereza`. Feed tab right reads **`[📷+ Post]`**, Groups tab **`[+ Create]`** — both outline rectangles.
- [ ] **E4a.4 — Schedule header.** Go to `/schedule?as=tereza`. Right action **`[+ Create]`** — outline rectangle.
- [ ] **E4a.5 — Profile header (regression check).** Go to `/profile?as=tereza`. **`[✎ Edit]`** unchanged (was already the canonical example). Edit mode → **`[✗ Cancel]`** + **`[✓ Save]`** still pairs outline + primary (the documented carve-out for focused-edit surfaces).
- [ ] **E4a.6 — Visual hierarchy check.** On `/communities/group-reactive-dogs?as=daniel` Members tab: the header `[👤+ Invite]` is visually quieter than the per-row `Message` brand pills — header reads as "utility," rows read as "commit."

### E4 — Request-to-join modal behaviour

All against `/communities/group-reactive-dogs?as=tomas` (approval group, Tomáš is non-member).

- [ ] **E4.1 — Modal opens on tap.** Tap "Request to join" → `ModalSheet` opens with title **"Request to join"**, body copy *"Request to join Prague Reactive Dog Support. Eva will review your request and let you know."*, optional textarea labeled **"Tell Eva about your dog (optional)"** with a placeholder note, footer with **Cancel** + **Send request** buttons.
- [ ] **E4.2 — Cancel returns cleanly.** Open the modal, type a partial note, hit **Cancel**. Modal closes, button stays **"Request to join"** (no state change). Reopen → textarea is empty (state was reset on close).
- [ ] **E4.3 — Send request flips state.** Open the modal, optionally type a note, hit **Send request**. Modal closes; button flips to **"Request sent"** + helper line updates per E2.3.
- [ ] **E4.4 — Open group has no modal.** Go to `/communities/group-1?as=daniel` and tap "Join community" — *no modal opens* (open groups stay one-tap; the existing prototype state-flip happens or doesn't — open-group join persistence is a pre-existing gap, not introduced by this work).
- [ ] **E4.5 — Guest gating still works.** Open a private/incognito tab → visit `/communities/group-reactive-dogs` without a persona → tap "Request to join" → `AuthGate` opens *(not* the request modal). Guest auth path runs first; modal only appears for authed users.

---

## Workstream F — Schedule + Discover IA refresh (shipped 2026-05-11)

Tactical reshape of the Schedule + Discover IA so soft-interest (followed series + group-meets you haven't RSVP'd to) lives where it naturally belongs — Discover — rather than buried two clicks deep in Schedule's Meets→Interested pill. Three pieces:

1. **Schedule simplification** — `/schedule` collapses from four tabs (Upcoming · Meets · Care · History) to two (Upcoming · History) with `All / Meets / Care` type pills on Upcoming. Going/Interested distinction retires from Schedule entirely.
2. **Discover Meets "your circle" elevation** — `/discover/meets` gains a top section *"Meets from your circle"* (mirroring the existing *"Carers in your circle"* pattern on `/discover/care`). Includes followed series + meets from groups the viewer is a member of. The earlier "Following" type pill retires (subsumed by the section).
3. **Home discovery banner** — feed-shaped nudge card that appears at index 2 of the feed when the viewer is in groups but has < 2 upcoming meet RSVPs. Routes to `/discover/meets` with copy that mentions their group context. Trigger sophistication (frequency caps, variants, dismiss memory) is filed as a follow-up.

Implementation: `app/schedule/page.tsx` (rewrite), `app/discover/meets/page.tsx` (partitioning + section), new `components/home/DiscoveryBanner.tsx`, `app/home/page.tsx` (banner insertion).

### F1 — Schedule simplification

- [ ] **F1.1 — Two tabs only.** Go to `/schedule?as=tereza`. Top tab bar has **Upcoming · History** — no Meets, no Care.
- [ ] **F1.2 — Upcoming sub-pills.** Upcoming carries pill row **All · Meets · Care**. Default is All. Switching to Meets filters to just meet items; Care to just care sessions. Counts re-render per pill.
- [ ] **F1.3 — Legacy URL redirects.** `/schedule?view=meets&as=tereza` lands on Upcoming with Meets pill active. `/schedule?view=care&as=tereza` lands on Upcoming with Care pill active. `/schedule?view=interested&as=tereza` redirects to `/discover/meets` (Interested concept retired from Schedule).
- [ ] **F1.4 — History unchanged.** Past meets + the review-recent section render as before. Pending review badge on the tab still works.

### F2 — Discover Meets "your circle" section

- [ ] **F2.1 — Tereza in-circle visible.** Go to `/discover/meets?as=tereza`. Top section **"Meets from your circle"** renders above the broader list. Should include meets from Tereza's joined groups + her followed series ("Morning walk — Riegrovy sady", etc.).
- [ ] **F2.2 — Daniel in-circle.** Go to `/discover/meets?as=daniel`. Top section includes reactive-dog-group meets + his followed series ("Evening stroll — Vítkov", "Thursday morning walk — Riegrovy sady").
- [ ] **F2.3 — "Other meets" header renders only when split is present.** When `inCircle.length > 0` AND `otherMeets.length > 0`, both section headers render. When `inCircle.length === 0` (or guest), flat list with no headers — section headers with one section below them are noise.
- [ ] **F2.4 — Type pills cross-cut both sections.** Pick "Walks" — circle section shrinks to in-circle walks, broader list to non-circle walks.
- [ ] **F2.5 — Guest sees flat list.** `/discover/meets` without persona (guest mode) → no "Meets from your circle" section, just the flat marketplace.
- [ ] **F2.6 — Following pill retired.** Type pill row reads **All · Walks · Hangouts · Playdates · Training** — no Following pill.

### F3 — Home discovery banner

- [ ] **F3.1 — Banner fires for under-engaged grouped users.** Go to `/home?as=daniel`. Daniel is in groups + has limited upcoming RSVPs → the **"Find a meet near you"** banner should appear at index 2 (after the third feed post), styled with brand-subtle bg + brand-main left stripe. Tap → routes to `/discover/meets`.
- [ ] **F3.2 — Banner skipped for fully-engaged users.** Go to `/home?as=tereza`. Tereza has many upcoming RSVPs → banner does NOT appear.
- [ ] **F3.3 — Banner skipped for new users.** Go to `/home?as=new-user`. New-user mode renders the welcome state without the discovery banner.

### F4 — Discover door pattern unification (2026-05-11)

The three Discover doors (Care / Meets / Groups) now share the same filter-panel anatomy: **page-level pill row → tap Filters → panel opens → in-panel `<TypeDropdown>` takes over the scope axis (page pill row hides) → standard filter fields below → primary "Filters" / "View N results" floating button.** Pulled into parity 2026-05-11 because Care had been updated mid-flight; Meets + Groups were missed in the original Care Catalog phase. Walkthrough verification:

- [ ] **F4.1 — Filters button is `primary` on all three.** `/discover/care`, `/discover/meets`, `/discover/groups` — the floating Filters button bottom-of-page is brand-filled (was `secondary` on Meets + Groups).
- [ ] **F4.2 — Top type-input on Meets.** Open Filters on `/discover/meets`. The first field below the **"Filters"** heading is a large dropdown trigger (icon + heading-style label + sub-line + caret) — selected meet type. Page-level pill row is hidden while the panel is open. Tap the trigger → menu lists all five types with icon + label + sub-line per row. Pick "Walks" → trigger updates + panel filter context flips.
- [ ] **F4.3 — Top type-input on Groups.** Same pattern on `/discover/groups` — large dropdown for group type (All / Parks / Neighbors / Interest / Care) with icon + sub-line per option.
- [ ] **F4.4 — In-circle card chrome on Meets.** On `/discover/meets?as=daniel`, cards in the "Meets from your circle" section carry a 3px brand-main left stripe (mirroring `/discover/care`'s in-circle treatment). Cards in "Other meets" below have no stripe.
- [ ] **F4.5 — Pill row hides on panel open.** All three doors: tapping Filters hides the page-level type pill row (the in-panel dropdown becomes the scope axis). Closing the panel restores the pill row.

---

## Decisions surfaced during walkthrough

Emergent decisions, design changes, or rationale that surfaced during verification and need to land in their proper home docs. Append as you walk.

- [ ] **P21 (Group ↔ meet dedupe) confirmed already complete from Mock World Building A2 (2026-04-30).** Cross-Cutting Flow Testing inherited it on the board but no new work was needed. → `phases/cross-cutting-flow-testing.md` mark this item as inherited.
- [ ] **P28 (MeetAttendee.profileOpen auto-derive helper) confirmed already complete from MWB A3.** `buildMeetAttendee` helper lives in `lib/mockMeets.ts`. → mark inherited.
- [ ] **P36 (profileVisibility distribution skew) substantively closed from MWB B1; new bridged providers (7) added in Discover Refinement + Care Catalog pushed the ratio from 70/30 toward 55/45.** Providers must remain Open by spec. The non-provider Open set is just `eva` + `jana` (anchors) — exactly the documented rule. → mark inherited; note in phase board.
- [ ] **`FeedCard.formatRelativeDate` was using a hardcoded `now` from MWB era.** Fixed during P20 sweep. → no feature-doc update needed (implementation bug fix).
- [x] **P32 resolved during the walkthrough: action gating widened from past-attendance to meet-level engagement.** Surfaced on Tomáš's `meet-19` (creator of an upcoming one-off meet, half-empty row stack, no actions). Meet RSVP is opt-in to "be in this group of people" — the meet analog of group co-membership, which already grants actions on the Group Members tab. → `Trust & Connection Model.md`, `features/meets.md`, `Content Visibility Model.md`, `Open Questions & Assumptions Log.md`, phase board (all updated). Code: `lib/meetUtils.ts:viewerCanAct` + `lib/mockMeets.ts:viewerSharedMeetWith` JSDoc divergence note.
- [x] **GroupVisibilityChip refresh + join-flow redesign shipped mid-walkthrough.** Tri-state chip (Open / Approval-only / Private) replaces the old Open=nothing pattern and the "Approval to join" / "Private · approval to join" verbose copy. Helper line under the Join/Joined CTA teaches action behaviour per (visibility × member × admin × requested). Request-to-join modal (approval-only) captures an optional admin context note. → `strategy/Groups & Care Model.md` → "Group visibility + join flow." Code: `components/groups/GroupVisibilityChip.tsx`, new `components/groups/RequestToJoinModal.tsx`, `app/communities/[id]/page.tsx` (`getJoinHelperText` resolver + modal wiring). Follow-ups filed in the strategy doc: admin-side approval queue, note persistence, `private` invited-state copy.
- [x] **Header-action convention codified + swept (Principle 11).** Surfaced on the reactive-dogs Members tab — header `Invite` brand pill competed with per-row `Message` brand pills, no visual hierarchy. Convention: header actions use `outline + sm + leftIcon + text` (rectangular, no `cta`); brand-filled pills reserved for row/hero/modal-footer primary commits. Same render desktop + mobile. Swept: Group detail (Invite, Create, Post), Meet detail (Share), Home (Create, Post), Schedule (Create). Profile Edit was already the canonical example (untouched). → `implementation/design-system.md` Principle 11.
- [x] **Profile visibility chip + editable setting shipped (self-view only).** Surfaced on Daniel's B2.3 — a tester opening their own Locked profile had no visual signal of the privacy state and no edit affordance to change it. Two pieces: read-only `ProfileVisibilityChip` (icon + label + tap-tooltip) in the hero next to the name + Carer badge; editable `ProfileVisibilitySetting` (full-width row picker, same layout as TagApprovalSetting) as a new "Profile visibility" section on the About tab. **Self-view only** — other-user profiles communicate locked/open via card-vs-placeholder rendering, not a chip (surfacing a "this person is Locked" badge to viewers leaks the subject's setting against the deniability rule). Two states: Open (Eye icon) / Locked (Lock icon). Also: nested the "About marking people Familiar" explainer card inside the Connections section so it no longer renders a divider line above as a peer-level section. → `components/profile/ProfileVisibilityChip.tsx`, `components/profile/ProfileVisibilitySetting.tsx`, `ProfileAboutTab.tsx` (new section + nested aside), `app/profile/page.tsx` (state wiring via `setUser`). No feature-doc update needed for this iteration — fits naturally under existing Trust & Connection Model + design-system Principle 11 chip-rhythm conventions.
- [x] **About-tab section reorder: settings ABOVE Connections (tactical, 2026-05-11).** Surfaced after shipping the visibility setting — settings shouldn't sit below a scroll-heavy roster. New order: Hero → Bio → Dogs → **Profile visibility → Tagging preferences** → Connections (with Familiar aside nested) → Care. This is a tactical move that doesn't preempt the structural question of whether Connections belongs on the About tab at all — that decision is filed as **Profiles Deep Pass E4** ("Connection list on own profile — review how your connections display. Useful information?"), still `todo` in that phase. → no feature-doc update; cross-referenced from CCFT walkthrough B2.7e.
- [x] **Locked-profile layout redesign (2026-05-11).** Three changes from walkthrough B2.7 feedback: **(1)** Familiar CTA promoted from compact `.private-profile-row-pill` to `ButtonAction variant="primary" size="md" cta` — matches design-system Principle 11's hero-CTA carve-out. **(2)** "Learn how privacy works" link moved inside the lock card (was a floating standalone element below the stack). **(3)** "You're both in {first group}" inline copy pulled out of the lock card into a new `SharedContextCard` component that lists *all* shared groups, with room to grow (next: shared past-meets — filed as P66). Trust gradient on the locked-profile surface reads cleanly now: **action → warmth → privacy explainer.** → `components/profile/SharedContextCard.tsx` (new), `app/profile/[userId]/page.tsx` (layout + button promotion). Follow-up P66 captures the future shared-meets line.
- [x] **Schedule + Discover IA refresh (2026-05-11).** Surfaced as a meta-design question while reviewing the buried "Interested" sub-pill on Schedule. Settled on a three-surface restructure that respects the existing carers-in-circle pattern: **Schedule = pure commitments** (Upcoming · History; type sub-pills All/Meets/Care on Upcoming); **Discover Meets = exploration + elevated "Meets from your circle"** section (mirrors `/discover/care`'s pattern — followed series + group-meets visually elevated, broader marketplace below); **Home = passive feed + occasional discovery banner** at index 2 when the viewer is in groups but under-engaged. The "Interested" concept retired from Schedule; the "Following" type pill retired from Discover Meets (subsumed by the elevated section). → `strategy/Product Vision.md` → new section "Schedule + Discover IA" (to be added). Code: `app/schedule/page.tsx` rewrite, `app/discover/meets/page.tsx` partitioning, new `components/home/DiscoveryBanner.tsx`. Follow-ups filed: banner trigger sophistication (frequency caps, dismiss memory, variant rotation), shared `card-meet` in-circle visual variant for tighter chrome differentiation if the section header alone doesn't carry enough signal.
- [x] **P68 absorbed: outbound Familiar on Open-viewer rosters cleaned (2026-05-11).** Mock-data drift from before Action matrix v3 — Open viewers (Shawn, Tereza, Klára) had `state: "familiar"` entries that contradict the rule "Open viewers skip Familiar entirely (it's redundant)." Twelve entries audited + fixed across three viewers: outbound state flipped to `"none"`; `theyMarkedFamiliar` flags dropped where the other side was also Open (no-op in both directions) and preserved where the other side was Locked (their mark IS meaningful — they're opening up). Visible effect: Klára's, Tereza's, and Shawn's Connections lists no longer show a Familiar section on their own About tab. Interaction metadata (meetsShared, sharedGroups, firstMetDate) preserved on every entry so the locked-profile shared-context card + mutual-connection signals still resolve. → punch-list P68 removed; surfaced from Profiles Deep Pass C6 walkthrough, absorbed by CCFT per the file-overlap-risk note.

---
status: archived
last-reviewed: 2026-04-27
review-trigger: archived — phase complete; preserved as the record of what shipped
---

# Meet Recurrence Model

**Goal:** Fix the conflation between a recurring meet (the *series*) and a single occurrence of it (an *instance*). Today, marking "Going" on a recurring meet implies you're attending every future occurrence — which isn't how anyone uses recurring events. Make Going always per-instance, separate "follow this series" as its own action, and update mock data + UI + schedule logic to reflect the new model.

**Constraint:** This phase **blocks Meets Deep Pass close.** It was raised mid-walkthrough as a gap in the meet model that needs to land before Meets ships.

**Depends on:** Active Meets Deep Pass (walkthrough). Coordinate with the active chat — share the punch list as the cross-chat surface; don't touch surfaces under active walkthrough review without flagging.

**Refs:** [[meets]], [[Trust & Connection Model]], [[mock-data-plan]], [[schedule]], `lib/mockMeets.ts`, `lib/types.ts` (Meet shape), `app/meets/[id]/page.tsx`, `app/schedule/page.tsx`

---

## Why now

The Meets Deep Pass walkthrough surfaced this on 2026-04-26. Concrete trigger: a recurring meet (e.g. "Morning walk — Riegrovy sady, weekly") has a single `attendees` array. If a tester marks Going, they're effectively committed to every future Wednesday. There's no instance entity, no per-date RSVP, no way to say "I'll come this Saturday but not next."

Symptoms beyond the immediate RSVP bug:
- Schedule shows "Morning walk" once, not as recurring entries
- "Going" count on a recurring meet is meaningless (going to which one?)
- Post-meet review on a recurring meet doesn't know which occurrence the user attended
- Group meet lists can't show next-3-occurrences for a series — only the meet record itself

The fix is a real model change, not a copy tweak.

---

## Decisions already made (from 2026-04-26 walkthrough discussion)

Captured here so the phase-open chat doesn't re-litigate them:

- **Going is always per-instance.** There's no such thing as "Going to a series."
- **Two valid uses for Interested**, depending on scope:
  - **Series-level Interested = "Follow series."** Subscription. Surfaces the series in Discover/feed, opts you into notifications about upcoming dates.
  - **Instance-level Interested = "thinking about this specific date."** A maybe.
- **Non-recurring meets unchanged.** Going / Interested attach to the meet directly. The new model is layered on top *only* for `recurring: true` meets.
- **UI direction for recurring meet detail:** show the next ~3 occurrences with individual Going / Interested buttons per date. A separate "Follow series" action sits at the meet level (subscription, not per-date).
- **Data shape choice (path 3 from the design discussion):** keep the current `attendees` field for non-recurring meets; add `attendeesByDate: Record<isoDate, MeetAttendee[]>` (or equivalent) for recurring meets. Less invasive than separate `Instances` entities or a global RSVP table; sufficient for prototype scope. Revisit if the prototype grows toward production.
- **Cancelling/editing a single occurrence is OUT of scope.** Full series editing only for now. Single-occurrence overrides (different time/location/cancellation) are a future advanced-editing pass.
- **Notifications for series subscribers can be stubbed.** Notification system is shared infrastructure; full wiring is its own concern. This phase's job is to make the data model support it, not deliver the full notification UX.

---

## Opening Checklist

Complete before writing any code.

- [x] Read every task below and the referenced docs (`Trust & Connection Model`, `meets`, `schedule`, `mock-data-plan`)
- [x] Read the active Meets Deep Pass walkthrough (`docs/phases/meets-deep-pass-walkthrough.md`) — note any open items that overlap this phase's surfaces
- [x] Audit current data: which meets have `recurring: true`? Which `cadence` values appear? How many users currently RSVP'd to recurring meets? — 26 recurring meets, all defaulted to weekly cadence in migration; per-user RSVPs surfaced via `getUserMeetInstances` post-migration
- [x] Audit current code: every consumer of `meet.attendees` — list them. The migration touches all of them. — 23 files; centralised via `getOccurrenceAttendees` + carrying `attendees` as representative list to avoid forced full-cascade migration
- [x] Confirm scoping decisions above still hold — push back on any that feel wrong on a fresh read — confirmed; surfaced cadence-persistence gap (replaced `recurring: boolean` with `cadence: MeetCadence`)
- [x] Confirm scope — no advanced editing or full notification UX creep
- [x] State the phase at the start of work + show the active Meets Deep Pass chat what you're touching to avoid stepping on each other — three change reports filed in `punch-list.md` for cross-chat coordination

---

## Workstream A — Data model

| # | Description | Status |
|---|-------------|--------|
| A1 | Update `Meet` type in `lib/types.ts`: keep `attendees` for non-recurring meets; add optional `attendeesByDate?: Record<string, MeetAttendee[]>` for recurring meets. Document the discriminator (`recurring: true` ⇒ use `attendeesByDate`). | done |
| A2 | Add a `followers?: string[]` field on `Meet` (userIds following the series). Used only on recurring meets. Optional / undefined on one-offs. | done |
| A3 | Decide on instance-date generation strategy. Two options: (a) materialise a rolling N-week window into `attendeesByDate` keys at module load (each key has empty attendees if no RSVPs yet); (b) keep `attendeesByDate` sparse, generate "next N occurrences" view at render time from `(startDate, cadence)`. Pick one. Document. | done |
| A4 | Helpers for date math: given a recurring meet's `(date, cadence)`, compute the next N occurrence dates. Belongs in `lib/meetUtils.ts`. | done |

## Workstream B — Mock data migration

| # | Description | Status |
|---|-------------|--------|
| B1 | Audit all `recurring: true` meets in `mockMeets.ts`. List them. Decide for each which dates to seed attendees on. | done |
| B2 | For each recurring meet, convert its `attendees` array into `attendeesByDate` keyed by 2-3 specific occurrence dates (using `daysFromNow` from `lib/mockDate.ts` so dates stay relative). The current single `attendees` becomes either: (a) the next-occurrence's attendees, or (b) duplicated across the seeded dates if that's narratively right. | done |
| B3 | Seed a few `followers` arrays on recurring meets so the demo shows the "Following" affordance is non-empty. Cover at least one meet per persona. | done |

## Workstream C — Helpers + read paths

| # | Description | Status |
|---|-------------|--------|
| C1 | New helper `getMeetOccurrences(meet, count)` returning `[{ date, attendees: MeetAttendee[] }]` for the next N occurrences (or just the single non-recurring meet wrapped in an array). Single read path for any UI that wants "what's coming up for this meet." | done |
| C2 | New helper `getUserMeetInstances(userId)` — every (meet, occurrenceDate) pair where this user is in `attendeesByDate[date]` (recurring) or `attendees` (non-recurring). Drives the Schedule "Going" tab. | done |
| C3 | New helper `getFollowedSeries(userId)` — every recurring meet where `followers` includes this user. Drives the Discover/feed "Following" surface. | done |
| C4 | Update `getUserMeets` consumers: think carefully about which need "occurrences I'm attending" (most schedule surfaces) vs "meets I'm associated with at all" (profile activity). Migrate callsites individually. | done |
| C5 | Update `getMeetRole` (`lib/meetUtils.ts`): for recurring meets, role needs an instance date (am I "joining" a specific date?). Decide whether to change the signature or add an instance-aware variant. | done |
| C6 | Update `getAttendeeTier` / `getKnownAttendees` similarly — they need to know which date's attendee list to evaluate, for recurring meets. | done |

## Workstream D — Meet detail page UI

| # | Description | Status |
|---|-------------|--------|
| D1 | Recurring meet detail: add an "Upcoming dates" section listing the next 3 occurrences. Each row: date + time + going-count + per-row Going/Interested buttons. Replace the single-meet "Going" CTA when `recurring: true`. | done |
| D2 | Add a "Follow series" toggle on recurring meet detail (separate from per-date RSVPs). Visual: distinct from the per-date buttons — maybe a top-right pill or a row in the organiser/info area. Toggling adds/removes the user from the meet's `followers`. | done |
| D3 | Update "Who's coming" to be instance-aware on recurring meets: default to next occurrence; allow switching the date being viewed. Or simpler: render the section per-date inline. Decide what reads cleanest. | done |
| D4 | Update Cancelled / Full edge states to be instance-aware where applicable. | done |
| D5 | Non-recurring meet detail unchanged — verify no regressions. | done |

## Workstream E — Schedule integration

| # | Description | Status |
|---|-------------|--------|
| E1 | Schedule → Upcoming: render each (meet, occurrenceDate) the user is Going to as its own card. A user Going to "Morning walk" on next Wednesday AND the following Wednesday should see two entries. | done |
| E2 | Schedule → Meets → Going: same as above. | done |
| E3 | Schedule → Meets → Interested: include both per-instance Interested AND series-Following. Decide grouping: separate sections, or a unified list with a small badge marking "Following series" vs "Interested in date." | done |
| E4 | Schedule → History: instance-aware. Past occurrences with attendees become individual review-eligible items. Drive the History tab review queue from instance date, not series. | done |

## Workstream F — Discover + feed integration

| # | Description | Status |
|---|-------------|--------|
| F1 | Discover Meets: each recurring meet card shows "Next: [date]" instead of a single fixed date. Card click goes to the meet detail. | done |
| F2 | Surface a "Following" filter or section on Discover that shows the user's Followed series. | done |
| F3 | Feed: if any feed surface lists upcoming meets, audit it for the same instance-aware treatment. | done |

## Workstream G — Notifications (stubbed)

| # | Description | Status |
|---|-------------|--------|
| G1 | Add a `MeetSeriesUpdate` notification type to the notifications system (or stub it). Triggered when a new occurrence is added to a series the user follows. Don't build the full delivery pipeline — just the data shape + a placeholder mock entry to confirm the UI handles it. | done |
| G2 | Document the longer-term notification flow in a follow-up note (when a Following user gets notified — likely 24h before, maybe also "new dates added" for irregular series). Punch-list rather than implement. | done |

## Workstream H — Docs

| # | Description | Status |
|---|-------------|--------|
| H1 | Update `docs/strategy/Trust & Connection Model.md` if the per-instance attendance changes anything about Familiar/Connect post-meet flow. Likely just a clarifying note that "post-meet" means "post-occurrence" for recurring meets. | done |
| H2 | Update `docs/features/meets.md` with the recurrence model (series vs instance, Following). | done |
| H3 | Update `docs/features/schedule.md` if the Schedule tab semantics shift. | done |
| H4 | Cross-reference from Meets Deep Pass walkthrough — note that recurring-meet RSVP behavior is now instance-aware. | done |

---

## Acceptance Criteria

- [x] Marking Going on a recurring meet attaches the user to a specific occurrence date, not the series
- [x] A user can mark Going to multiple occurrences of the same series and see each as its own Schedule entry
- [x] "Follow series" is a separate action with its own affordance; following doesn't imply Going — shipped as series-level "Interested" toggle (label refined post-walkthrough; data still on `Meet.followers`)
- [x] Following a series surfaces it in Discover (and triggers a stubbed notification entry) — "Following" pill on `/discover/meets`; `meet_series_update` notification stub on meet-7 for Shawn
- [x] Recurring meet detail page shows the next ~3 occurrences with per-date RSVP — per-row `Skip` + `Join`/`Joined` (Interested-per-occurrence dropped post-walkthrough; Going + Skip is the sharper pattern)
- [x] Schedule → Upcoming, Meets → Going, History all reflect the per-instance model
- [x] Non-recurring meets render and behave identically to before (no regressions) — verified against meet-2, meet-3, meet-4 paths
- [x] Mock data has at least one recurring meet per persona with seeded `attendeesByDate` and `followers` — 26 recurring meets seeded; followers cover Shawn / Tereza / Daniel / Klára / Tomáš
- [x] TypeScript compiles clean
- [x] Doc updates landed (meets.md, Trust & Connection Model.md if needed, walkthrough cross-ref) — plus schedule.md and the design-tokens styleguide

---

## Closing Checklist

- [x] Walk through every acceptance criterion against the running app — verified live in the meet-detail design-polish pass; remaining live verification continues in the Meets Deep Pass walkthrough chat
- [x] Update affected feature docs — `features/meets.md`, `features/schedule.md`, `strategy/Trust & Connection Model.md`
- [x] Update Meets Deep Pass walkthrough — tick any items this phase enabled or fixed — cross-ref note added at the bottom of section 7
- [x] Read punch list change reports since phase open — flag anything you may have stepped on — four change reports filed during this phase (data-layer, UI integration, Upcoming Dates revision, design polish + final close); no pre-existing reports needed re-review
- [x] Update ROADMAP.md — note as completed, cross-reference from Schedule & Bookings if any care-side parallel emerged
- [x] Structural audit (per CONTRIBUTING.md step 8a) — clean except for the pre-existing `persona-wiring.md` stub (P17, manual delete blocked in agent mode)
- [ ] Confirm Meets Deep Pass can now close — coordinate handoff with the active chat — **owned by walkthrough chat**
- [x] Archive this phase board (move to `docs/archive/phases/`, mark archived, delete original)

---

## Not in scope (will be tempting)

- **Per-occurrence editing** — different time / location / cover photo on a single instance. Future advanced-editing pass.
- **Per-occurrence cancellation** — "skip this Wednesday only." Future.
- **Full notification delivery pipeline** for Following — just stub the data shape (G1). The full UX (when notifications fire, batching, opt-out) belongs with the broader notifications work.
- **Care session model alignment** — care bookings already have per-session structure; they don't need this fix. If audit reveals they have a similar bug, log it for Schedule & Bookings.
- **End-of-series semantics** — recurring meets with an end date that's reached. Treat as inactive series; don't build special UI.
- **Series creation UX changes** — creation flow is unchanged; you create the series with cadence and the per-instance behavior just emerges.

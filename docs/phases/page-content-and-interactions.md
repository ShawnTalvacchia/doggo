---
status: active
last-reviewed: 2026-04-10
review-trigger: When any task is completed or blocked
---

# Page Content & Interactions

**Goal:** Build out real content under page tabs, create interaction flows, and elevate provider presence. Pages exist structurally — now they need to feel complete and interactive.

**Depends on:** Review & Polish (done).

**Refs:** [[meets]], [[schedule]], [[profiles]], [[messaging]], [[explore-and-care]], [[Groups & Care Model]], [[Content Visibility Model]]

---

## Opening Checklist

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag any blockers
- [x] Audit for conflicts with current code
- [x] Referenced docs updated within last 2 weeks (all within 48h)
- [x] Scope confirmed — most tasks already partially built, focus on gaps

**Audit notes (2026-04-10):**
- Meet tabs (M1–M3): 80–90% built. Chat needs polish, photo gallery exists but not wired in.
- RSVP (M4): UI buttons exist, state mutations missing.
- Create flows (C1–C3): Forms ~90% complete, need backend wiring.
- Schedule cards (S1–S2): 3 card types exist, need provider visual distinction + care header info.
- Photo sharing (C4): Component exists, not integrated into meet detail.
- Provider elevation (V1–V2): Cards/profiles built, feed/schedule presence needs work.
- Open Questions: 8 unresolved in Groups & Care Model (non-blocking for this phase). Feed hardcoded to Vinohrady (needs fix if touching home feed). Provider ID dualism in mock data.

---

## Tasks

Tasks will be added as work begins. Initial scope based on current priorities:

### Meet Page

| # | Description | Status |
|---|-------------|--------|
| M1 | Flesh out Details tab content (location, description, attendee info, schedule) | done (pre-existing) |
| M2 | Flesh out People tab (attendee list with connection states, dog info) | done (pre-existing) |
| M3 | Flesh out Chat tab (real-time coordination UI) | done (pre-existing) |
| M4 | RSVP interaction — Going / Interested / Not Going states with clear UI | done |
| M5 | Meet creation flow (compose UI for creating a new meet within a group) | done (pre-existing) |

### Schedule & Cards

| # | Description | Status |
|---|-------------|--------|
| S1 | Differentiate provider/host cards — solid color or strong visual distinction | done |
| S2 | Care card headers — add drop-off time and relevant scheduling info | done |
| S3 | Expand "Interested" list with auto-populated events from joined groups | done |

### Create Flows

| # | Description | Status |
|---|-------------|--------|
| C1 | Create meet flow (within group context) | done (pre-existing) |
| C2 | Create group flow | done (pre-existing) |
| C3 | Create post / share moment flow | done (pre-existing) |
| C4 | Photo sharing UX — upload, tag-a-dog, tag-a-place | done |
| C5 | Encourage sharing — prompts, post-meet nudges, photo tagging suggestions | done |

### Provider Elevation

| # | Description | Status |
|---|-------------|--------|
| V1 | Provider activity more visible in feeds and schedule | done |
| V2 | Provider-specific card treatments across the app | done |

---

## Acceptance Criteria

- [ ] Meet page tabs have real, useful content
- [ ] Users can express interest / RSVP on meets
- [ ] At least one create flow works end-to-end (meet or post)
- [ ] Provider cards are visually distinct from regular user cards
- [ ] Schedule page shows relevant header info on all card types
- [ ] TypeScript compiles clean
- [ ] Feature docs updated for any changed behavior

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [ ] Check next phase scope for conflicts with what was just built

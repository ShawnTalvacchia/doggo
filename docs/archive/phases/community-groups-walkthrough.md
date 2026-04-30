---
status: archived
last-reviewed: 2026-04-29
review-trigger: "archived — phase closed"
---
# Community & Groups Deep Pass — Walkthrough

Living doc for visual walkthroughs of the Community & Groups Deep Pass. One section per workstream. Each section has a numbered checklist (where to go + what to verify) plus space for findings and follow-ups that surface during the walk.

**How to use:**

1. After a workstream lands, work through that section's checklist with the dev server running (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go. Drop notes inline on items that need follow-up.
4. Anything that needs fixing or a product call lands in the **Findings & follow-ups** section for that workstream.
5. Cross-cutting observations (things spanning multiple workstreams) land in **Cross-cutting observations** at the bottom.

**Status legend:** `[ ]` = not yet walked · `[x]` = walked, no issues · `[!]` = walked, finding logged below.

**Available personas** (per `lib/personas.ts`): Tereza (default — Vinohrady routine owner / connector), Daniel (anxious new owner, locked profile, few connections), Klára (professional trainer with Care group), Tomáš (busy Karlín professional), New User (empty profile). Shawn exists in mock-world data but is NOT a viewer persona — he appears as an attendee/group member other personas encounter.

---

## Workstream A — People Tab Disclosure (P32)

### Walkthrough checklist

- [x] **1. Tereza → `/meets/meet-7`** ("Thursday morning walk — Riegrovy sady" — recurring weekly, completed, **Tereza is the host**, attendees: Tereza, Marek, Shawn, Lucie, Jana) → **People tab.** Verify: Connected section at top with "Tereza (you)" pinned, Familiar subsection if Shawn renders there, other tier-2 below flat, Locked chip list at the bottom for any Locked attendees. **Action pills should appear** (Familiar / Connect / Message) — Tereza has past attendance.
- [x] **2. Tereza → `/meets/meet-2`** ("Weekend hangout — Stromovka", upcoming, Jana hosts) → **People tab.** Verify: same section layout, but **NO action pills** (`status: "upcoming"` → no past attendance for anyone → info-only). The headline count should match the meet's full attendee count, including any locked attendees who appear in the chip list.
- [x] **3. Daniel → `/meets/meet-1`** ("Morning walk — Riegrovy sady", Shawn hosts, Daniel is NOT an attendee) → **People tab.** Verify: Daniel's perspective. **info-only** for everyone (no pills, no buttons). Pending status pill still shows on rows where Daniel has a pending outbound Connect request (won't show without seeded data). Open-profile attendees (e.g. Shawn) render as Tier 2 cards; locked attendees with no Daniel relationship fall to the Locked chip list. 
- [x] **5. Tereza → `/meets/meet-care-1`** (recurring care-group meet, Klára's Calm Dog Sessions) → **People tab.** Verify: recurring meet behavior — pill row at the top with `[All]` + 3 upcoming dates. Default selection is the first upcoming date pill; the visible roster shows that date's specific attendees. Action pills show if Tereza has past attendance on ANY occurrence (gating is series-level). **If Tereza has no past attendance on this care meet, log as a finding** — likely worth seeding (Tereza's a Vinohrady regular, plausible Klára client).

#### Lens pill row (recurring meets only)

- [x] **5a. Tereza → `/meets/meet-7`** → **People tab.** Tap the **`[All]`** pill. Verify: roster expands to the series community — past attendees + upcoming attendees + a "Following this series" subsection (if any seeded followers). Locked attendees and locked followers merge into a single chip list at the bottom. Heading reads "Series community" (not "Who attended").
- [x] **5b. Tereza → `/meets/meet-7`** → **People tab.** Tap a **specific upcoming date pill** (e.g. "Thu May 7"). Verify: roster narrows to that date's attendees only. No "Following this series" subsection (followers are All-lens only). Heading reflects whether the date is past or future.
- [x] **5c. Tereza → one-off meet (`/meets/meet-2` or any one-off)** → **People tab.** Verify: **NO pill row** appears. Single roster as before.
- [x] **6. Card visual (final form).** On any People tab card, confirm:
    - **Owner avatar** 64px circle on left.
    - **Dog cluster** right-aligned in a 44px slot anchored to the owner's right edge. **1 dog → 36px avatar.** 2 dogs → 32px each. **3+ dogs → 1 dog avatar (32px) + "+N" chip (32px).** Never more than 2 slots.
    - **Owner name** offset 12px LEFT of where the identity column would naturally start (the asymmetric pull toward the owner). 32px tall row, font-semibold.
    - **Dog text line** below the name — `text-sub` (13px), `leading-8`. Format: "Bára" / "Bára and Eda" / "Bára, +N more".
    - Card height: ~88px (64px content + 12px padding × 2). Row gap between avatar combo and identity column: 20px (`space-xl`).
- [x] **6a. Helper / Provider badge visibility.** Identify a Connected Helper-tier carer (e.g. someone with `carerProfile.publicProfile === false` whom Tereza is Connected to — Jana is the canonical case). Verify: as Tereza, **"Helper" badge** renders next to the name (quieter neutral pill, not brand-tinted). Switch to a persona NOT Connected to that carer (Daniel, New User) and verify the **Helper badge does NOT render** — privacy rule preserved. Provider-tier carers (`publicProfile: true`) should show **"Provider" badge** (brand-tinted) regardless of viewer.

#### Pre-cascade (B1 inheritance) check

- [x] **7. Tereza → `/communities/group-1`** (any group) → **Members tab.** Verify: PersonRow cards now use the new owner+dog overlap avatar (because PersonRow's `variant="group-member"` inherited the OwnerDogAvatar change). Actions still resolve via matrix — gating won't kick in until B2.

#### Regression watch — should look UNCHANGED

- [x] **8. Tereza → `/inbox`.** Verify: conversation list rows unchanged (44px owner avatar circle, paw icon + dog text line, no dog avatars). This is the only PersonRow surface that should NOT pick up the owner+dog overlap.
- [x] **9. Tereza → `/schedule`** → tap a completed meet that's eligible for review → **post-meet review sheet** opens. Verify: Make Connections step looks identical to before — same `OwnerDogAvatar` cards, same Familiar/Connect pill behavior. The extraction was lift-and-shift.
- [x] **10. Tereza → `/profile/daniel`** (or any other persona's profile). Verify: relationship CTAs at the top still render correctly (Connect/Message/Mark Familiar based on relationship state). PersonRow doesn't render here, so this is unchanged.


---

## Workstream B — Group Members Convergence + Matrix v3

### Walkthrough checklist

- [x] **B1. Tereza → `/communities/group-1`** (or any group she's a member of) → **Members tab.** Verify section structure: **ADMINS** subheader at top with admin members, **CONNECTED** below with Tereza pinned to the top of that subsection, **FAMILIAR** if any, **OTHER** tier-1/2 unlabeled below, **LOCKED PROFILES** chip list at the bottom. Card visual matches People tab (owner avatar + dogs combo, name offset left, dog text 13px).
- [x] **B2. Tereza on the same group's Members tab.** Verify visual pattern matches the People tab: inline Familiar/Pending pill + tier badge (Provider/Helper) on the left of the name area, **Connect/Message buttons on the right side** vertically centered with the row. Members tab does NOT gate on past-meet attendance — group co-membership IS the context, so all matrix-resolved actions surface.
- [x] **B3. Daniel → `/communities/group-1`** → **Members tab.** Verify: each row's actions resolve from the matrix without an attendance gate. Open-profile members render as tier-2 cards; locked members fall to the Locked chip list at the bottom. ADMINS subheader still renders for any admins; CONNECTED subheader only renders if Daniel has any Connected members in this group. Admin rows do NOT carry a redundant Admin pill (section header carries the role).
- [x] **B4. Klára → her own care group** (find via `/communities` or `/discover/groups`). Verify: Klára appears in the **ADMINS** section (no per-card Admin badge — section header carries the role) with the **Provider** tier badge next to her name. Members of her care group should mostly be Connected to her — verify action buttons render correctly per matrix.
- [x] **B5. New User → `/communities/group-1`** → **Members tab.** Verify: members with `profileVisibility: "open"` render as tier-2 cards with `+ Familiar` buttons (the on-ramp), members with `profileVisibility: "locked"` fall to the LOCKED PROFILES chip list. NO **CONNECTED** subheader (New User has zero connections); NO **FAMILIAR** subheader (no marks). Most of the mock-world members are open, so the visible card list will be longer than you might first expect — that's correct.
- [x] **B9. Mark-state ladder.** As Daniel, find a row with `+ Familiar` button. Tap it. Verify: button advances to **Connect**, footer "✓ Familiar | Undo" appears below the row. Tap **Connect**. Verify: button becomes **Connect ✓** (brand-fill), footer still shows. Tap **Undo** in footer. Verify: button resets to `+ Familiar`, footer disappears. Navigate away from the page and back. Verify: marks reset (session-scoped).
- [x] **B10. Connected row.** Find a row where state is `connected` (Tereza viewing one of her connections). Verify: the right-side button shows **Message** (primary brand fill); no `+ Familiar` or Connect button. No footer. Tapping the row navigates to the profile (or doesn't break — Message tap target is the action).

#### Deniability + matrix v3 spot-checks

- [x] **B6. No pill leak on inbound marks.** Find a row where `theyMarkedFamiliar` is true but `connectionState` is `"none"` (subject marked viewer; viewer hasn't reciprocated). Verify: the row renders as a tier-2 card (correctly bumped), but **no pill or copy reveals the inbound mark**. The card's existence in the visible list is the only signal — there's no "Wants to connect" label, no directional icon, no tooltip explaining why the row was promoted.
- [x] **B7. Action button parity across direction.** A row with state=`familiar` (viewer marked subject) and a row with state=`none` + `theyMarkedFamiliar` (subject marked viewer) should render the SAME `+ Familiar` button — the button's appearance doesn't reveal which direction the existing mark came from. Once the viewer taps `+ Familiar`, both states behave the same way going forward.
- [x] **B8. No cause-revealing copy.** Hover/tap any row — no tooltip or sub-label should explain WHY the row is in its section ("they marked you Familiar," "you're both at last week's walk," etc.). Section headers (CONNECTED / FAMILIAR) only describe the viewer's own outbound state, never explain inbound signals.

---

## Workstream C — Avatar Pattern Cascade (P27)

### Walkthrough checklist

- [x] **C1. `/meets/meet-1` → People tab.** Find Shawn's row in the Going section. Verify: 1 visible dog avatar (32px, rounded-md) + "+2" chip in the dogs slot. Pet text reads "Spot, +2 more" (per `formatPetsLine`).
- [x] **C2. Browse a few PersonRow surfaces** — meet People tab, group Members tab, inbox conversations. Verify the avatar pattern: non-inbox surfaces use the OwnerDogAvatar combo (64px owner + overlapping 36/32px dogs); inbox uses a 44px owner circle with **no dog avatars** (dog names show as text with paw icon). The structural difference is "no dog avatar in inbox," not just sizing.

---

## Workstream D — Soft Familiar Indicator (P29) — DEFERRED

Section grouping on Members + People tabs already conveys outbound Familiar status (rows live under the FAMILIAR subheader). P29 refined to "non-grouped surfaces" only (Discover lists, avatar stacks) and deferred — picked up during Discover & Care Deep Pass or a later card-anatomy review. No walkthrough items.

---

## Workstream E — Group Surfaces Feel Alive

E1 (group feed content audit), E2 (group feed walk per type), E4 (Care group walk), E5 (community feed cross-persona walk) are content-heavy and benefit from being folded into Mock World Building, where per-persona seeding handles the underlying data. E3 (DogsNearYou onboarding-only fix) shipped during this phase. Recommendation: defer E1/E2/E4/E5 to Mock World Building.

---

## Workstream F — Lock vs Tier Reconciliation

Doc-only — no walkthrough needed. Acceptance: framing reflected accurately in `features/profiles.md` + `Groups & Care Model.md`.

---

## Cross-cutting observations

Anything that doesn't fit a single workstream — patterns spotted across surfaces, tone/copy issues, design system gaps, things to raise at phase close.

_(empty — populate as you go)_

---

## Edge cases to verify later

Code paths that exist but couldn't be visually confirmed in the active walkthrough — usually because the mock data doesn't exercise them. Drain this list during Mock World Building, or whenever someone seeds data that hits one of these paths. Not blockers; not punch-list items.

- **Tier-2 unmarked attendee (open profile, no relationship)** — the unlabeled `other` subsection in `PeopleSection` should render attendees who are open-profile + no Familiar mark + no Connected status. Tereza on meet-1/meet-7 has no such attendees in the visible roster. Verify when seeded data includes an open-profile attendee the viewer hasn't acted on.
- **Tier-2 inbound Familiar (deniability path)** — an attendee who has marked the viewer Familiar, where the viewer hasn't reciprocated. Should render in the same `other` subsection (no per-row pill, no "they marked you" copy — the deniability guardrail). Verify when mock data seeds inbound `theyMarkedFamiliar` for the active persona.
- **Pending pill on People tab row** — appears when the viewer has sent a Connect request that hasn't been accepted. Display-only; renders even in info-only mode. Verify when mock data seeds an outbound pending connection for the active persona.
- **Following this series subsection** — `getSeriesFollowers` resolves `meet.followers` into MeetAttendee-shaped objects; the subsection renders only on the All lens of recurring meets. Verify with a meet that has seeded followers AND a viewer who isn't already in the attendee list (so they appear as cards, not deduped).

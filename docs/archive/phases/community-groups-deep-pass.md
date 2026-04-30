---
status: archived
last-reviewed: 2026-04-29
review-trigger: "archived — phase closed"
---

# Community & Groups Deep Pass

**Goal:** Groups and feeds read as living communities. The People-tab disclosure model demonstrates the community-first thesis (information open, action earned by attendance). The owner-forward card pattern cascades from the post-meet review across person-row surfaces. Per-persona group content makes Daniel's lurk-mode and Tomáš's emergency-posting feel real.

**Depends on:** Meets Deep Pass (closed 2026-04-29), Trust & Visibility Pass (closed 2026-04-29). Both shipped the action matrix v3, deniability guardrails, the canonical `PersonRow`, and the owner-forward `AttendeeActionCard` pattern that this phase builds on.

**Refs:** `features/meets.md`, `strategy/Groups & Care Model.md`, `strategy/Trust & Connection Model.md`, `strategy/Content Visibility Model.md`, `features/connections.md`, `strategy/Open Questions & Assumptions Log.md`, punch-list P10/P26/P27/P29/P32, `lib/personActions.ts`, `components/people/PersonRow.tsx`, `components/meets/PostMeetReviewSheet.tsx` (owner-forward card reference), `app/meets/[id]/page.tsx` (PeopleTab), `app/communities/[id]/page.tsx` (Members tab + group detail).

---

## Phase-level decisions (resolved 2026-04-29)

1. **Action gating: attendance-based, app-wide.** People tab AND Group Members tab both gate Familiar/Connect on prior shared-meet attendance. Single rule, single mental model. Group-type nuance (e.g. neighbor groups where not everyone attends every meet) filed as future-state — surface only if testing flags it. Drives A3 + B2.

2. **Lock vs Tier framing: Lock is visibility, Tier is action.** Lock controls who can SEE the profile/services (privacy). Tier controls who can ACT on services (book/inquire). Distinct axes, both apply. Drives F1 — small doc patch in `features/profiles.md` and `Groups & Care Model.md`, plus close in `Open Questions & Assumptions Log.md` §4.

3. **DogsNearYou: onboarding-only, fix the data plumbing.** Keep the new-user surface, fix the lies — real neighborhood label per persona, real dog count, persona-aligned dog list (not "every meet attendee's dog"). Always-on and Discover-tile rebuilds deferred. Drives E3.

**Card-pattern decisions (resolved 2026-04-29)**

- **A4 + B1 People tab/Members tab inline actions COEXIST with the post-meet review sheet.** Different jobs: People tab inline = minimal persistent surface ("act when you see them"); review sheet = guided warm-moment framing + bulk action + explainer. Both stay.
- **`OwnerDogAvatar` extracted during A4.** Lives at `components/people/OwnerDogAvatar.tsx` as a sibling to `PersonRow` (not nested). Internal `getDogImageByOwnerAndName` lookup stays inside the component. CSS classes renamed `.pmr-avatar-*` → `.person-avatar-*` as part of the move.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs (CLAUDE.md, ROADMAP.md, Groups & Care Model.md, meets.md, Trust & Connection Model.md, Content Visibility Model.md, Open Questions log, punch-list P10/P26/P27/P29/P32, `lib/personActions.ts`, `components/people/PersonRow.tsx`, `components/meets/PostMeetReviewSheet.tsx`, `app/meets/[id]/page.tsx`, `app/communities/[id]/page.tsx`)
- [x] Review Open Questions log — flag anything affecting this phase (§2 P32 + soft-Familiar; §3 cross-category groups; §4 Lock vs Tier — surfaced as phase-level Q above)
- [x] Audit for conflicts between phase plan and current codebase (matrix v3 already lives in `personActions.ts`; PersonRow already supports `actions: "auto" | PersonAction[]` override which the P32 work needs; AttendeeActionCard pattern lives only in `PostMeetReviewSheet.tsx` — extraction is a real piece of work, not a copy-paste; Group Members tab already migrated to PersonRow per Trust & Visibility A5)
- [x] All referenced docs reviewed within last 21 days (most are within 6 days; checked at draft time)
- [x] Resolve the three phase-level open questions (resolved 2026-04-29 — see Phase-level decisions above)
- [x] Confirm scope with Shawn — board accepted 2026-04-29; out-of-scope items below stay deferred (Schedule & Bookings: P26; Mock World Building: per-persona connection rosters, provider userId backfill)

---

## Workstream A — People Tab Disclosure (P32)

**Lands first.** Resolves the highest-priority Open Question on the People tab. Establishes the visual cascade pattern (owner-forward + section-grouped cards) that B and C extend.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Spec the disclosure model in writing. **Pre-meet (any viewer):** info open, NO action pills, owner-forward cards section-grouped by relationship state (Connected → Familiar → unmarked tier-1/2), Locked attendees → chip list at bottom. **Post-meet (attendee):** same content + matrix-resolved action pills (Familiar / Connect / Message). **Post-meet (no-show):** same as pre-meet, no actions. **People tab inline actions COEXIST with the post-meet review sheet** — different jobs (persistent vs warm-moment), see Phase-level decisions. | `features/meets.md`, `strategy/Trust & Connection Model.md`, `strategy/Content Visibility Model.md` | done |
| A2 | `PersonRow` already supports `actions: PersonAction[] \| "auto"`. Confirm an empty array `[]` correctly suppresses both the right-side CTAs and the inline Familiar pill. If not, add a clean info-only mode (e.g. `actions: "none"` or a `readOnly` prop). Update doc-comment on `PersonRow.tsx`. | `components/people/PersonRow.tsx`, `lib/personActions.ts` | done — needed a small fix: the Familiar ✓ toggle pill was rendering unconditionally on `state === "familiar"`, ignoring the resolved actions. Gated on `familiarMatrixAction` presence so `actions={[]}` now suppresses both CTAs and the toggle pill. Pending status pill stays. |
| A3 | Implement attendance-based gating in `PeopleTab` (`app/meets/[id]/page.tsx`). New helper `viewerCanAct(meet, viewerId)` = true iff meet is `completed` AND viewer attended. Wire to `PersonRow`'s `actions` prop. **Single rule app-wide** — same helper used by B2 on Members tab. Lives in `lib/personActions.ts` next to the matrix (or `lib/meetUtils.ts` if it fits cleaner there — decide during implementation). | `app/meets/[id]/page.tsx`, `lib/personActions.ts` or `lib/meetUtils.ts` | done — `viewerCanAct` lives in `lib/meetUtils.ts` (single-meet check) + `viewerSharedMeetWith` lives in `lib/mockMeets.ts` (cross-attendee check for B2). Same principle, two helpers; `meetUtils` stays pure, `mockMeets` carries the cross-meet query. |
| A4 | Apply owner-forward + section-grouped layout to PeopleTab. **Extract `OwnerDogAvatar` to `components/people/OwnerDogAvatar.tsx`** — sibling to `PersonRow`, not nested. Internal `getDogImageByOwnerAndName` lookup stays inside the component. CSS classes renamed `.pmr-avatar-*` → `.person-avatar-*` and moved into the canonical block in `app/globals.css`. Section headers per relationship state. Locked attendees → chip list at bottom. After extraction, `PostMeetReviewSheet` consumes the new component (no behavior change there). | `components/meets/PostMeetReviewSheet.tsx` (current home), `components/people/OwnerDogAvatar.tsx` (new), `components/people/PersonRow.tsx`, `app/globals.css` | done — `OwnerDogAvatar` extracted; CSS renamed; `PostMeetReviewSheet` consumes the new component. **Bonus:** updated `PersonRow` to use `OwnerDogAvatar` for non-inbox variants (drops the inline dog avatar row, keeps a text dogLine in the identity column). This pre-cascades the look to `variant="group-member"` — B1 will inherit it for free. Inbox stays unchanged (44px circle, no dog avatars — chat-list shape). |
| A5 | Update feature docs: `meets.md` People tab description (current copy says "Tier 1 Connected → Tier 2 Familiar / Pending / Open → Tier 3 hidden count" — rewrite for the new disclosure model). `Trust & Connection Model.md` and `Content Visibility Model.md` add a paragraph about the information-vs-action split + the attendance-gated single rule. | `features/meets.md`, `strategy/Trust & Connection Model.md`, `strategy/Content Visibility Model.md` | done — covered by A1 + a follow-up tightening pass (corrected "single helper" wording to "single principle, two helpers" since People-tab uses `viewerCanAct` and Members will use `viewerSharedMeetWith`). |

---

## Workstream B — Group Members Convergence + Matrix v3

**Pattern test.** Migrate Group Members tab to the owner-forward card pattern from A4. If it works visually + interactively, the P27 cascade in C becomes "extract the shared component."

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Apply owner-forward + section-grouped layout to Group Members tab in `app/communities/[id]/page.tsx`. Section headers: Admins → Connected → Familiar → unmarked tier-1/2 → Locked (chip list). Consume the `OwnerDogAvatar` extracted in A4. | `app/communities/[id]/page.tsx`, `components/people/PersonRow.tsx`, `components/people/OwnerDogAvatar.tsx` (built in A4) | todo |
| B2 | Implement **attendance-based action gating** on Members tab. Add helper `viewerSharedMeetWith(viewerId, subjectId)` (returns true iff the two have ever both been Going on a `completed` meet). Wire to `PersonRow`'s `actions` prop — non-attendance pairs render info-only. Cross-references the same gating helper home as A3 (single rule app-wide). Group-type nuance (e.g. neighbor groups where not everyone attends) deferred to testing. | `lib/personActions.ts` or `lib/meetUtils.ts`, `app/communities/[id]/page.tsx` | todo |
| B3 | Verify matrix v3 + deniability across Members tab. Pill rules render correctly (no pill on `none + theyMarkedFamiliar`); no copy explains why a row sits where it sits; ConnectionIcon renders identically across directions. Spot-check with each persona. | `lib/personActions.ts`, `components/people/PersonRow.tsx`, `components/ui/ConnectionIcon.tsx`, `strategy/Trust & Connection Model.md` (deniability subsection) | todo |
| B4 | Update `Groups & Care Model.md` Members tab description with the new layout + attendance-gated action rule. `features/meets.md` already covered by A5. Cross-reference `Trust & Connection Model.md` deniability subsection. | `strategy/Groups & Care Model.md` | todo |

---

## Workstream C — Avatar Pattern Cascade (P27)

**Closes P27.** Extraction lands in A4. C is the rollout to remaining surfaces + the design-system documentation pass.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Audit remaining `PersonRow` consumers for adoption. Grep `<PersonRow` for the full list. Apply the new owner-forward look where it fits — profile page (relationship rows), any other person-listing surface. **Inbox stays denser** per existing rule (44px owner, no dog avatars — chat-list shape). | `components/people/PersonRow.tsx`, `app/profile/[userId]/page.tsx`, grep `<PersonRow` | blocked-by-A4 |
| C2 | Update `implementation/design-system.md` — add `OwnerDogAvatar` primitive entry; refresh PersonRow section to reflect the new card pattern. Reaffirm the "dog-forward principle stays only on meet card hero anatomy, owner-forward in list contexts" rule. | `docs/implementation/design-system.md` | todo |
| C3 | Mock data verification (closes P31): seed at least one attendee with 3+ dogs so the "+N" chip rendering can be visually verified across the new surfaces. Either add a third dog to an existing attendee (e.g. Shawn at meet-1 — fostering "Skip") or introduce a new ambient 3-dog character. | `lib/mockMeets.ts`, `components/people/OwnerDogAvatar.tsx` | todo |

---

## Workstream D — Soft Familiar Indicator (P29)

**Cascades via PersonRow.** Quiet treatment so users scanning a list see "I've marked this person before" without remembering. Ships with C.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Decide visual treatment. Options: (a) small icon (check/handshake glyph) tucked near owner avatar, (b) tertiary-color "Familiar" label next to name, (c) subtle row tint, (d) something else. Should NOT render on the post-meet review sheet (already has explicit per-section grouping). Should NOT render where a Familiar pill is already shown (the pill is the indicator there). Worth a brief design discussion before D2 — this is the only design call left in the phase. | `components/people/PersonRow.tsx`, `lib/personActions.ts` (matrix output exposes `state: "on"` for outbound Familiar) | todo |
| D2 | Implement on `PersonRow`. Conditional render based on `connectionState === "familiar"` (outbound only — `theyMarkedFamiliar` does NOT trigger the indicator per deniability; that's not the viewer's data). | `components/people/PersonRow.tsx` | blocked-by-D1 |
| D3 | Verify indicator does not duplicate or compete with: `Familiar ✓` pill (PersonRow), `AttendeeActionCard` Familiar/Connect pill states, `ConnectionIcon` Familiar rendering. Document the rule in `design-system.md`. | `docs/implementation/design-system.md` | todo |

---

## Workstream E — Group Surfaces Feel Alive

**The "feels alive" half of the phase scope.** Per-persona content depth + product-role decisions for surfaces that currently feel scaffolded.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Group feed content audit + seeding. For each of the four journey personas (Tereza, Daniel, Klára, Tomáš), walk every group they're in and verify the Feed tab tells their story. Tomáš's emergency posts (lost dog / "anyone walking tonight") and ambient activity Daniel can lurk through are explicit acceptance criteria. Use `lib/mockPosts.ts` + `lib/mockGroups.ts`. | `lib/mockPosts.ts`, `lib/mockGroups.ts`, `strategy/User Archetypes.md`, `strategy/User Journeys.pptx` | todo |
| E2 | Group Feed tab walk for all four group types (Park / Neighbor / Interest / Care). Visual quality + posting affordances + comments. Care groups: provider/admin posting only — verify the rule holds and the empty-state for non-admin members reads well. | `app/communities/[id]/page.tsx` (FeedTab), `components/posts/`, `lib/mockPosts.ts` | todo |
| E3 | DogsNearYou — onboarding-only, fix the data plumbing (closes the data side of P10). Real neighborhood label per persona (not hardcoded "Vinohrady"). Real dog count (not `mockNeighbourhoodStats.activeDogs = 52`). Persona-aligned dog list — actually filter by locality, not "every meet attendee's dog." Component stays new-user-only (`DEMO_NEW_USER` gating). Always-on / Discover-tile rebuild stays deferred. | `components/home/DogsNearYou.tsx`, `lib/mockNeighbourhoodStats.ts`, `app/home/page.tsx`, `lib/mockUsers.ts` (per-persona neighborhood) | todo |
| E4 | Care group walk for Pawz + Klára's groups. Services tab content quality, Gallery tab photo quality (if Care group has gallery enabled), Hosted by section, paid-meet rendering on Events tab. Verify the visibility-gating across event-driven vs appointment-driven categories still feels right. | `app/communities/[id]/page.tsx`, `lib/mockGroups.ts`, `strategy/Groups & Care Model.md` (Care Group Admin Model) | todo |
| E5 | Community feed (`/home`) cross-persona walk. Feed item mix per persona — upcoming meets, recap cards, connection nudges, care prompts, share nudges. Verify each persona's feed reads as their story. | `app/home/page.tsx`, `lib/mockFeed.ts`, `components/feed/` | todo |

---

## Workstream F — Lock vs Tier Reconciliation

**Doc-only.** Per Open Q log §4 — best resolved this phase or in Discover & Care. Lean here so the Care group walk in E lands on consistent ground.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Update `features/profiles.md` and `Groups & Care Model.md` to use the **Lock = visibility, Tier = action** framing. Lock controls who can SEE the profile/services (privacy axis). Tier controls who can ACT — book/inquire on services (action axis). Distinct, both apply. Close `Open Questions & Assumptions Log.md` §4. If implementation already diverges from this framing, log the gap as a follow-up task here (likely small — most existing logic already maps cleanly to "show vs act"). | `docs/features/profiles.md`, `docs/strategy/Groups & Care Model.md`, `docs/strategy/Open Questions & Assumptions Log.md` | todo |

---

## Out of scope (explicitly deferred)

- **P26 — per-occurrence recurring cancellation.** Punch-list note assigns this to Schedule & Bookings Deep Pass. May surface in group walks (E2/E4) — log as observation, don't build.
- **Per-persona connection rosters / provider userId backfill (P4).** Mock World Building scope. May make B3's per-persona spot-checks thinner than ideal; document the gap.
- **Cross-category groups exact rules** (Open Q §3 partial). Deferred — current intersection rule in `Groups & Care Model.md` is sufficient for this phase's walks.
- **Series subscription notifications** (Open Q §3). Notifications work, not group work.
- **DogsNearYou always-on or Discover-tile rebuilds** (P10). Q3 resolved as onboarding-only; rebuilds stay deferred.

---

## Acceptance Criteria

- [x] **People tab disclosure model** — info open pre-meet/no-show, action pills only for post-meet attendees, locked attendees → chip list at bottom. *(A1–A5)*
- [x] **Owner-forward + section-grouped card pattern** lands on People tab (A4) and Group Members tab (B1).
- [x] **`OwnerDogAvatar` extracted** to `components/people/OwnerDogAvatar.tsx`; CSS renamed `.pmr-avatar-*` → `.person-avatar-*`; `PostMeetReviewSheet` consumes the new component.
- [x] **Single attendance-based action-gating rule** — `viewerCanAct` (single-meet) + `viewerSharedMeetWith` (cross-attendee) wired to People tab (A3) and Group Members tab (B2).
- [x] **Matrix v3 + deniability** — pill rules, ConnectionIcon parity, no cause-revealing copy. Code-level verification across PersonRow consumers; persona-level visual check pending.
- [x] **P27 closed** — owner-forward card applied to remaining `PersonRow` consumers (inbox excepted, by design).
- [x] **Soft Familiar indicator (P29) — deferred.** Section grouping on Members + People tabs covers the original list-context use case. Remaining concern (non-grouped surfaces — Discover lists, avatar stacks) refined into P29 punch-list scope. Picked up later, likely during Discover & Care Deep Pass.
- [ ] **P10 onboarding-only fix** — real neighborhood label, real count, persona-aligned dog list. *(E3 — pending)*
- [ ] **Per-persona group + feed walk** — Daniel can lurk, Tomáš has emergency posts. *(E1 + E2 — pending, content-heavy)*
- [ ] **Care group walk** (Pawz, Klára's groups) reads as a real provider channel. *(E4 — pending)*
- [x] **Lock vs Tier reconciliation closed** (Open Q §4) — Lock = visibility, Tier = action framing reflected in `features/profiles.md` + `Groups & Care Model.md`. *(F1)*
- [x] **No new untokenized CSS, no raw hex/rgb, no orphan tokens.** New components added to `design-system.md`. Inline-style discipline corrected mid-phase via token-first migration.
- [x] **TypeScript clean, ESLint clean** for all touched files. (Pre-existing react-hooks errors in `app/meets/[id]/page.tsx` and `app/communities/[id]/page.tsx` are unchanged from main.)

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/` (meets.md, profiles.md if F1 lands here, connections.md if action gating changes the post-meet flow)
- [ ] Update strategy docs (Trust & Connection Model.md, Content Visibility Model.md, Groups & Care Model.md) per the disclosure model spec
- [ ] Update Open Questions log — close §2 P32, §4 Lock vs Tier (if F1 lands here); add anything new that emerged
- [ ] Update ROADMAP.md — move out of "Current Phase," surface the next-phase brief
- [ ] Review CLAUDE.md — update current phase, Key Decisions if the disclosure model or action gating rule deserves a top-level callout
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived, then delete original from `phases/`)
- [ ] **Structural audit** — run before marking the phase done:
    - Any files in `docs/phases/` with `status: archived` or `status: complete`? Delete them (archive copy should already exist).
    - Any filename duplicated between `docs/phases/` and `docs/archive/phases/`? Delete the live copy.
    - Any docs in `strategy/`, `features/`, `implementation/` with `last-reviewed` older than 21 days? Review or bump.
    - Any dead references in `README.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md` to files that no longer exist? Fix.
- [ ] **Strategic review.** What changed about our understanding of community and trust by building this? What's the next phase (Discover & Care) likely to inherit, change, or contradict? Run the full review per CONTRIBUTING.md → "Closing a Phase" → step 9.
- [ ] Check next phase scope (Discover & Care) for conflicts with what was just built

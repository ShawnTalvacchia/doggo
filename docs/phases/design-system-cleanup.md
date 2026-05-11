---
status: open
last-reviewed: 2026-05-11
review-trigger: When opening this phase, or when adding new deferred items
---

# Design System Cleanup

**Goal:** Resolve accumulated design-system inconsistencies — chip vs button visual collision, ButtonAction variant overlap, ModalSheet footer pattern drift, and the owner+dog avatar pattern that should cascade across all person-listing surfaces. This phase doesn't add new components; it audits the ones we have and brings them into a coherent vocabulary.

**Depends on:** None — can run any time. Best opened after a content phase (Discover & Care, Inbox & Notifications) so the audit has the latest patterns to work from.

**Refs:** [[implementation/design-system]], `app/globals.css`, `components/ui/`

**Opened:** 2026-05-11. Walkthrough doc: [[phases/design-system-cleanup-walkthrough]].

---

## Pre-loaded Scope (deferred from punch list — 2026-05-03)

These items were raised on the punch list as design-system audits — each too large for a quick fix, none belonging to a content phase.

### Chip and button styles visually collide (was P45)

`card-schedule-chip` is used for passive status indicators (Type pill, status flag) and shares its pill+fill vocabulary with interactive controls — the meet-detail RSVP button looks visually identical to the card status chip, so passive badges read as tappable. CardMeet status indicator was patched 2026-05-02 to drop the chip treatment for role labels (now renders as inline icon + colored text), but the deeper issue remains: the design system shouldn't have chip and button styles that resolve to the same component. Audit pass: every `card-schedule-chip` usage classified as passive (categorical badge) vs active (action/control), then split into two visual vocabularies. Pairs with the ButtonAction variant work below. Surfaced 2026-05-02.

### ModalSheet footer button audit (was P30)

Process-oriented footers should use the **system-primary pattern** (`primary` variant, NO `cta` modifier — dark fill, small radius, no pill), NOT the brand CTA pill. Rationale: footer = navigation (advance / close); body = decisions (the brand-colored CTA pills on attendee cards, etc.). Mixing CTA-pill shapes (Continue/Done) with non-CTA small-radius shapes (Maybe later/Back) on the same row reads as inconsistent. Applied 2026-04-27 to `PostMeetReviewSheet` (Continue + Done both → `primary` no CTA). Sweep candidates: `BookingModal` Confirm, `ServiceBookingSheet` Confirm + Done, `MeetComposer` Create + success-state actions, `ShareMeetModal`, `PostComposer`, any other ModalSheet consumer. Don't blindly cascade — some footers are the legitimate primary action of the entire flow (e.g., `BookingModal` Confirm IS the commit; the body is just data entry, not decisions). Audit each surface individually. Surfaced 2026-04-27.

### Cascade owner+dog avatar pattern (was P27)

Cascade owner+dog avatar pattern (64+32 overlap, 1-many dogs with "+N" chip when more than 2) to all person-listing surfaces. Currently scoped to the post-meet review's `AttendeeActionCard`; users want it everywhere. Surfaces to update: `PersonRow` (which drives meet detail People tab + group Members tab + inbox conversation list + profile pages). Pattern: owner avatar primary (large), dog(s) secondary (small, overlapping bottom-right). Dog name list rendered as text in body row ("Bára and Eda" / "Bára, Eda + 2"). Reference implementation in `components/meets/PostMeetReviewSheet.tsx` (`OwnerDogAvatar` + `formatDogNames`) and CSS at `globals.css` (`.pmr-avatar-*` class set — rename to `.person-avatar-*` or similar when extracting). Inverts the prior "dog-forward" principle for *list contexts*; dog-forward stays on the meet card hero anatomy where the dog is the social-proof unit. **Note:** People tab disclosure model (Cross-Cutting Flow Testing) depends on this. Surfaced 2026-04-27.

### ButtonAction variant system — destructive should be a modifier (was P5)

`destructive` should be a modifier (like `cta`) not a standalone variant, so it can combine with primary/secondary/tertiary. Current `destructive` is too strong for inline "Decline." Touches `components/ui/ButtonAction.tsx` and `design-system.md`. Surfaced 2026-04-13.

---

## Status (2026-05-11)

### Landed

**A. ButtonAction `destructive` → modifier.** `destructive` is now a boolean modifier (like `cta`), composable with primary/secondary/outline/tertiary. CSS `.btn-destructive` replaced by combinator rules on `.btn-is-destructive`. Four call sites (CancelBookingModal, CancelSessionModal, CancelOccurrenceModal, InquiryResponseCard) ported via `variant="primary" destructive` to preserve current visuals. Styleguide + `design-system.md` table row updated. Commit: `Design System Cleanup: ButtonAction destructive variant -> modifier`.

**B. Owner+dog avatar cascade.** Audit found this work already landed in Community & Groups Deep Pass (commit `6dac451`, 2026-04-30) — `OwnerDogAvatar` already lives at `components/people/OwnerDogAvatar.tsx`, the `.pmr-avatar-*` rename to `.person-avatar-*` is complete, and PersonRow already consumes the primitive for `meet-attendee` / `group-member` / `default` variants. Inbox stays on the 44px chat-list shape by design. All consumers (ParticipantList for People tab, communities/[id] for Members tab, inbox/page.tsx, BookingDetail attendee block) correctly pass `pets`. **No further work needed.** The phase board's pre-loaded description was stale at pre-load time; treat this item as closed.

### Decisions needed (deferred to a waking session)

**C. Chip vs button visual collision.** Audit complete; visual choice deferred.

**Audit findings.** Every `card-schedule-chip` usage in the codebase classified:

| Site | Role | Notes |
|---|---|---|
| `GroupVisibilityChip.tsx:63` | passive | Visibility status (open / private / care) |
| `CardGroup.tsx:77` | passive | Group type pill (Park / Neighbor / Interest / Care) |
| `CardGroup.tsx:88` | passive | "Joined" status indicator |
| `MeetCardCompact.tsx:56` | passive | Meet type pill |
| `PostMeetReviewSheet.tsx:210` | passive | Meet type pill in recap card |
| `CardMeet.tsx:138` | passive | Meet type pill |
| `CardMeet.tsx:145` | passive | "Cancelled" status pill |
| `FeedUpcomingMeet.tsx:53` | passive | Meet type pill |
| `FeedMeetRecap.tsx:53` | passive | Meet type pill |

**Result:** every `card-schedule-chip` is passive. The collision the punch-list flagged isn't *within* the chip class — it's *between* `card-schedule-chip` (small rounded pill) and `ButtonAction variant="brand-subtle"|"neutral" cta` (also small rounded pill, used as the RSVP control on meet detail page). Same visual vocabulary, opposite semantics. CardMeet line 246–267 already shows the awareness: the status indicator on the card was *deliberately removed from the chip treatment* because "the same icon+label vocabulary is used as an interactive RSVP button on the meet detail page; on a card the treatment must read as status, not as a tappable control."

**Three approaches for the user to weigh:**

1. **Reshape passive chips** — flat tag (no border, square corners) so passive doesn't read as tappable. Most disruption but cleanest semantic split.
2. **Reshape active controls** — keep passive chips as-is; recolor the RSVP/Interested pill so its fill/contrast reads unmistakably as "tap me." E.g., active brand-subtle gets a stronger fill or an explicit hover affordance hint.
3. **Status-as-text convention (codify the CardMeet pattern)** — passive *categorical* labels stay as `card-schedule-chip`; passive *status* labels (Going / Booked / Hosting / Cancelled) go to inline icon + colored text (no chip chrome), matching CardMeet lines 254–267. Cheapest sweep; leaves the `card-schedule-chip` ↔ RSVP-pill collision intact but reduces its surface area.

Recommend (3) as the bridge: it codifies a pattern already in use, leaves type-pill usage stable, and defers (1)/(2) to a fuller rework if the residual collision still bothers in usage. But this is an aesthetic call — left for the user.

---

**D. ModalSheet footer audit.** Per-surface judgment needed, not blind cascade.

**Audit findings.**

Footers *already aligned* to the system-primary pattern (primary, no `cta`, dark fill + small radius):

- `PostMeetReviewSheet` Step 1 (Maybe later → Continue) ✓
- `PostMeetReviewSheet` Step 2 (Back → Done) ✓
- `CareReviewSheet` (Maybe later → Send review) ✓
- `BookingModal` success (Done) ✓
- `BookingModal` form (Send Request) ✓
- `ProposalForm` (Cancel → Send / Send Quote) ✓
- `SigningModal` (Cancel → Sign Contract) ✓
- `CancelBookingModal` / `CancelSessionModal` / `CancelOccurrenceModal` (Keep → Cancel … destructive) ✓

Footers *still using `cta`* (pill shape), candidates for the sweep:

| Surface | Buttons | Recommendation |
|---|---|---|
| `MeetComposer` line 358 | `tertiary` Cancel + `primary cta` Create meet | Drop `cta` on Create meet. Direct parallel to `BookingModal` Send Request (also a commit-of-the-whole-flow, already non-cta). Strong yes. |
| `ServiceBookingSheet` line 96 (form step) | `neutral cta` Cancel + `primary cta` Confirm | Drop `cta` on both. Reconsider `neutral` vs `tertiary` on Cancel — `tertiary` matches every other footer dismiss in the system; `neutral` is the FB-toggle "inactive" vocabulary, which doesn't fit a footer dismiss role. **Decision needed: tertiary or keep neutral?** |
| `ServiceBookingSheet` line 113 (success step) | `primary cta` Done | Drop `cta`. Parallel to `BookingModal` success Done (already non-cta). |
| `PostComposer` line 405 (custom `composer-share-btn`) | Bespoke pill button, not ButtonAction | Out of scope for the cta sweep, but worth flagging: this footer doesn't use ButtonAction at all. Either migrate to ButtonAction (would inherit the no-cta footer convention) or document why the bespoke pattern is justified. **Decision: migrate, or leave bespoke?** |

Footers correctly *keeping* `cta`-equivalents (the carve-out per the phase board):

- *None found.* The carve-out language in the original P30 note ("some footers are the legitimate primary action of the entire flow") suggested some would stay pill-shaped. The audit shows that BookingModal Send Request — the canonical "form's primary commit" — already dropped cta and reads correctly. So in practice the system-primary pattern is the right default for ALL footers; the carve-out doesn't seem to apply anywhere. The user should confirm this read, or point to a footer where the pill shape genuinely belongs.

**Open questions for the user:**

1. Apply the recommended sweep (drop `cta` on `MeetComposer` Create meet + both `ServiceBookingSheet` footers)? Yes/no.
2. `ServiceBookingSheet` Cancel: keep `neutral` or switch to `tertiary`?
3. `PostComposer` share button: migrate to ButtonAction or leave bespoke?
4. Does the "legitimate primary action stays cta" carve-out apply anywhere — or is the truth that ALL ModalSheet footers should be non-cta, and the carve-out was a hypothesis that didn't survive contact with the audit?

---

## Tasks

Acceptance criteria to be finalized once the deferred decisions land.

- [x] A. ButtonAction `destructive` modifier refactor
- [x] B. Owner+dog avatar cascade (resolved as already-landed)
- [ ] C. Chip vs button collision — pick approach (1/2/3) + apply
- [ ] D. ModalSheet footer sweep — answer open questions + apply
- [ ] Close-out: verify pass on each touched surface, update design-system.md, archive phase board

---

## Acceptance Criteria

- ButtonAction `destructive` is a modifier, not a variant, in code + docs + styleguide. ✓ (landed 2026-05-11)
- Owner+dog avatar pattern is consumed by every person-listing surface that should carry it (meet attendees, group members, booking attendee blocks). ✓ (resolved as already-landed)
- A clear visual distinction between passive chips and active buttons exists in the codebase, with a documented convention.
- ModalSheet footers follow a single rule (system-primary, no cta), with any deliberate carve-outs explicitly documented.

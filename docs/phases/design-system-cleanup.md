---
status: planned
last-reviewed: 2026-05-03
review-trigger: When opening this phase, or when adding new deferred items
---

# Design System Cleanup

**Goal:** Resolve accumulated design-system inconsistencies — chip vs button visual collision, ButtonAction variant overlap, ModalSheet footer pattern drift, and the owner+dog avatar pattern that should cascade across all person-listing surfaces. This phase doesn't add new components; it audits the ones we have and brings them into a coherent vocabulary.

**Depends on:** None — can run any time. Best opened after a content phase (Discover & Care, Inbox & Notifications) so the audit has the latest patterns to work from.

**Refs:** [[implementation/design-system]], `app/globals.css`, `components/ui/`

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

## Tasks

To be defined when this phase opens. The pre-loaded scope above is the seed.

---

## Acceptance Criteria

To be defined when this phase opens.

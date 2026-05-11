---
status: in-progress
last-reviewed: 2026-05-11
review-trigger: When closing the Design System Cleanup phase
---

# Design System Cleanup — Walkthrough

Overnight session, 2026-05-11. Phase opened; two mechanical items landed, two aesthetic items audited and deferred for the user to decide on. No phase close — phases only close with the user.

## What landed

### 1. ButtonAction `destructive` variant → modifier

`destructive` is now a `boolean` prop (like `cta`), not a variant. It recolors the chosen variant with the error palette, so the destructive treatment can scale loud → quiet:

- `variant="primary" destructive` — filled error + white text (loud commit; current Cancel-modal pattern preserved)
- `variant="secondary" destructive` — error-tinted fill + error text (mid)
- `variant="outline" destructive` — transparent + error border + error text (ringed)
- `variant="tertiary" destructive` — transparent + error text (text-only, quietest)

**Files changed:**
- `components/ui/ButtonAction.tsx` — variant union loses `"destructive"`; adds `destructive?: boolean` prop. Old `CTAButtonVariant` kept as a deprecated alias for safety.
- `app/globals.css` — `.btn-destructive` removed; replaced by combinator rules `.btn-primary.btn-is-destructive`, `.btn-secondary.btn-is-destructive`, `.btn-outline.btn-is-destructive`, `.btn-tertiary.btn-is-destructive`. Disabled state handled once at `.btn-is-destructive` level.
- `components/bookings/CancelBookingModal.tsx`
- `components/bookings/CancelSessionModal.tsx`
- `components/meets/CancelOccurrenceModal.tsx`
- `components/messaging/InquiryResponseCard.tsx`
- `app/styleguide/components/page.tsx` — playground gains a `destructive` toggle alongside `cta` / `onDark`. PropTable row updated.
- `docs/implementation/design-system.md` — ButtonAction row in the primitives table re-describes destructive as a modifier with the new combinator rules.

**Visuals to eyeball in the morning:**
- `/styleguide/components` — ButtonAction playground. Flip the `destructive` toggle across each variant and confirm:
  - `primary destructive` = filled red (the old standalone `destructive` look)
  - `secondary destructive` = light error-tinted fill
  - `outline destructive` = error-colored border + text
  - `tertiary destructive` = error-colored text only
  - Disabled state on each looks dimmed correctly
- Any Cancel modal — `Cancel booking` button on a booking detail page; `Cancel date` on a recurring meet host view; `Decline` confirmation step on an inquiry. Should look identical to before.

**Why this matters:** the punch-list P5 noted `destructive` was too strong for inline "Decline" — the modifier model means inline Decline can now use `tertiary destructive` (quietest) without inventing a new component. Future work can adopt those quieter combinations where appropriate.

---

### 2. Owner+dog avatar cascade — already complete

The audit found this work landed during Community & Groups Deep Pass (commit `6dac451`, 2026-04-30):

- `OwnerDogAvatar` lives at `components/people/OwnerDogAvatar.tsx` (not inside PostMeetReviewSheet).
- CSS classes are already `.person-avatar-*` (the `.pmr-avatar-*` rename completed).
- `PersonRow` consumes the primitive for `meet-attendee` / `group-member` / `default` variants (line 399).
- All consumers (ParticipantList → People tab; communities/[id] → Members tab; inbox/page.tsx → inbox row; bookings/[bookingId] → attendee block) pass `pets` properly.

The phase board's pre-loaded description was stale at pre-load time. No code change needed.

**Visuals to confirm (optional reassurance):** any meet detail People tab, any group Members tab, any booking detail with attendees — the 64px owner avatar + 32px dog(s) overlapping the bottom-right should render uniformly. Inbox keeps the dense 44px chat-list shape on purpose.

---

## What's deferred

### 3. Chip vs button visual collision (was P45)

**Audit complete.** Every `card-schedule-chip` usage in the codebase is passive (categorical badges and status indicators). The collision the punch-list flagged is *between* `card-schedule-chip` (small pill) and `ButtonAction variant="brand-subtle"|"neutral" cta` (also a small pill, used as the RSVP control on `/meets/[id]`). Same visual vocabulary, opposite semantics.

CardMeet already shows the half-shipped fix: status indicators on cards were deliberately dropped from chip treatment and rendered as inline icon + colored text (line 246–267) precisely because the chip vocabulary collides with the meet-detail RSVP control.

Three options for the user to weigh, written up in detail on the phase board ([[phases/design-system-cleanup]] under "Decisions needed"):

1. Reshape passive chips → flat tag (no border, square corners).
2. Reshape active controls → keep chips, redesign RSVP pill to read unmistakably as tappable.
3. Status-as-text convention → codify the CardMeet pattern app-wide; categorical labels keep the chip; status labels go to inline icon + colored text.

Walkthrough proposal recommends (3) as the bridge.

**Why deferred:** aesthetic decision the user wants to make awake.

---

### 4. ModalSheet footer audit (was P30)

**Audit complete.** Eight ModalSheet footers already follow the system-primary pattern (primary variant, no `cta`, small radius). Three still use `cta` (pill shape) and are candidates for the sweep:

- `MeetComposer` Create meet
- `ServiceBookingSheet` Cancel + Confirm (form step)
- `ServiceBookingSheet` Done (success step)

Plus a fourth surface — `PostComposer` Share button — uses a bespoke `composer-share-btn` class instead of ButtonAction at all.

Open questions written up on the phase board:

1. Apply the recommended sweep (drop `cta` on those three)? Yes/no.
2. `ServiceBookingSheet` Cancel: keep `neutral` (FB-toggle inactive vocab) or switch to `tertiary` (canonical footer dismiss)?
3. `PostComposer` Share: migrate to ButtonAction or leave bespoke?
4. Does the "legitimate primary action stays cta" carve-out actually apply anywhere — or is the truth that ALL ModalSheet footers should be non-cta? The audit found zero footers where the pill shape genuinely belongs.

**Why deferred:** per-surface judgment, not blind cascade. Each commit semantically a "would I want this button to feel celebratory or task-like?" question — the user's call.

---

## Verification done overnight

- `npx tsc --noEmit` matches the documented baseline (2 known pre-existing errors: `"ghost"` variant in `app/bookings/[bookingId]/page.tsx:184` + duplicate `photos` key at line 355). Both unrelated to this work. **No new TS errors introduced.**
- No files Care Catalog Taxonomy touched were modified (verified via `git log -1 --name-only` against last commit).
- Did not start a preview server — per the standing rule, visual changes are documented for morning eyeball rather than verified via curl/SSR HTML, which can't render style.

---

## Suggested morning workflow

1. Open `/styleguide/components`, exercise the `destructive` toggle across each variant.
2. Visit one Cancel modal (booking detail → Cancel booking, or any recurring meet host view → Cancel date) to confirm the destructive commit button still reads correctly.
3. Read the phase board's "Decisions needed" section ([[phases/design-system-cleanup]]) and pick directions on items C and D.
4. Resume work on items C and D in a new session (or as side tasks) once decided.

---

## Commits

- `Design System Cleanup: ButtonAction destructive variant -> modifier` (8 files changed, +98/-42).

---
category: phase
status: active
last-reviewed: 2026-03-24
tags: [phase-12, demo-ready, polish, carer, css-cleanup, component-extraction]
review-trigger: "when modifying booking flows, extracting components, or cleaning CSS"
---

# Phase 12 — Demo Ready

**Goal:** Close the last functional gap (carer inbox actions), clean up the design system and CSS, extract inlined components, and polish UX consistency — leaving the codebase ready for a Figma design pass.

**Depends on:** Phase 11 (booking & care polish complete).

---

## Why

The full product funnel works end-to-end (signup → meets → trust → care → booking → payment). But three things hold back the demo:

1. **Carer side is incomplete.** Carers can't accept/decline/counter inquiries — the booking conversation is one-directional.
2. **CSS accumulated over 11 phases.** globals.css is 9,720 lines with dead code. Inline styles violate our own rules. Pages mix Tailwind, CSS classes, and inline styles inconsistently.
3. **Page files are monoliths.** ThreadClient.tsx (664 lines) and profile/page.tsx (1,438 lines) have substantial components inlined that should be reusable.

---

## Workstream A — Complete the Care Funnel

### A1 · Carer inquiry response actions in inbox

**What:** When the carer views a booking conversation, show action buttons to Accept, Decline, or Suggest Changes on the inquiry.

**New components:**
- `components/messaging/InquiryResponseCard.tsx` — Accept / Decline / Suggest Changes buttons
- `components/messaging/ProposalForm.tsx` — simplified proposal builder for carers

**Files to modify:** `ThreadClient.tsx`, `lib/types.ts`

### A2 · Incoming requests on Schedule page

**What:** Show pending inquiries on Schedule for carers (currently only visible in Inbox).

**File:** `app/schedule/page.tsx`

---

## Workstream B — Component Extraction & Page Decomposition

### B1 · Extract ThreadClient inline components

Extract `RelationshipBanner`, `PaymentCard`, `ContractCard`, `SigningModal` → `components/messaging/`. Convert inline styles to Tailwind. Target: ThreadClient.tsx < 300 lines.

### B2 · Extract Schedule booking row card

Same booking card markup repeated 3× in schedule. New `components/bookings/BookingListCard.tsx`.

### B3 · Decompose profile/page.tsx

Extract `ProfileAboutTab`, `ProfileServicesTab`, `PetCard` → `components/profile/`. Target: profile/page.tsx < 600 lines.

### B4 · Component inventory update

Add all new/extracted components to `docs/implementation/component-inventory.md`.

---

## Workstream C — CSS & Design System Polish

### C1 · Dead CSS audit

Grep every class in globals.css, cross-reference .tsx files, remove unused classes. Target: globals.css < 8,000 lines.

### C2 · Inline style migration (5 priority pages)

Convert inline `style={{}}` to Tailwind on: profile/page.tsx, meets/[id]/page.tsx, checkout/page.tsx, groups/[id]/page.tsx, schedule/page.tsx.

### C3 · EmptyState component

Create `components/ui/EmptyState.tsx` and replace ad-hoc empty state patterns.

### C4 · ButtonAction adoption pass

Replace remaining raw `<button>` and `<a>` with `ButtonAction` — mainly in SigningModal, PaymentCard, and "View all" links.

---

## Execution Order

1. B1 — Extract ThreadClient components (clean files before adding features)
2. A1 — Carer inbox actions (critical feature gap)
3. A2 — Schedule incoming requests (completes carer story)
4. C1 — Dead CSS audit (clear the deck)
5. C2 — Inline style migration
6. B3 — Decompose profile page
7. B2 — Extract schedule booking card
8. C3 + C4 — EmptyState + ButtonAction
9. B4 — Component inventory

---

## Verification

- [ ] Carer can accept an inquiry and send a booking proposal from inbox
- [ ] Carer can decline an inquiry with optional message
- [ ] Schedule page shows incoming requests for carers
- [ ] Full booking flow works both directions (owner→carer→owner→pay)
- [ ] ThreadClient.tsx < 300 lines
- [ ] profile/page.tsx < 600 lines
- [ ] globals.css < 8,000 lines
- [ ] Zero inline styles on the 5 priority pages
- [ ] No raw `<button>`/`<a>` — all use ButtonAction/ButtonIcon
- [ ] Component inventory up to date

---

## Out of Scope

- Availability calendar/filtering (revisit post-Figma)
- Provider earnings dashboard (existing inline version sufficient)
- Explore results redesign (works fine, revisit post-Figma)
- Counter-proposal negotiation loop (just show "Suggestion sent" state)

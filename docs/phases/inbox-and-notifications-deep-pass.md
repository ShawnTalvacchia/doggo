---
status: planned
last-reviewed: 2026-05-03
review-trigger: When opening this phase, or when adding new deferred items
---

# Inbox & Notifications

**Goal:** Inbox conversation list visual polish, notification card patterns, badge counts, request-vs-thread distinction, and (likely) threading model + read state. Inbox needs a focused pass rather than piecemeal patches.

**Depends on:** Discover & Care (closes G6 — service-thread inquiry/proposal preview styling).

**Refs:** [[features/messaging]], `app/inbox/`, `app/notifications/`, `components/messaging/`, `components/people/PersonRow.tsx` (inbox-conversation variant)

---

## Pre-loaded Scope (deferred from punch list — 2026-05-03)

These items were raised on the punch list as small visual or content fixes, then left there until the bigger Inbox pass actually opens. Captured here so the phase has a starting punchlist instead of starting from scratch.

### Inbox visual + UX hygiene (was P46)

Three sub-items, all surfaced 2026-05-02 during Mock World Building C11 walkthrough.

- **Density / cramped feel.** Rows feel visually heavy even after the same-row owner+dog tightening. Likely needs a row-rhythm pass — line-heights, vertical padding, divider weight.
- **System-message preview styling.** Booking-proposal previews currently render as plain text indistinguishable from message previews ("Booking proposal" reads like an unsent draft, not a system event). Options: small leading icon, italic treatment, chip+label, distinct color. Touches `getPreview` in `app/inbox/page.tsx` + the preview rendering in `PersonRow` inbox-conversation variant. **Note:** the *service-thread* slice of this lands under Discover & Care G6 (inquiry/proposal previews specifically). The broader audit across all system messages remains here.
- **"You:" prefix on outgoing previews.** Per FB / iMessage / most chat apps, when the last message is from the current user, the preview should be prefixed "You: …" so the reader can see who said the previewed line. Requires checking `lastMsg.sender` against the persona-context viewer and conditionally prepending.

### Inbox row name + dog data inconsistency (was P35)

Inbox conversation rows show inconsistent name and dog formatting. Some rows show full last names ("Lucie Černá", "Shawn Talvacchia"), others show last initial only ("Jana K."). Some include a dog name (Spot, Hugo, Goldie) under the paw icon, others don't. Likely a `lib/mockConversations.ts` (or upstream `lib/mockUsers.ts`) data hygiene issue — rows pull a snapshot of name/dog and the seeded values aren't normalised. Pick one display format (recommend `firstName + lastNameInitial` for compactness across cultures) and ensure every row populates a dog when the partner has one.

---

## Tasks

To be defined when this phase opens. The pre-loaded scope above is the seed.

---

## Acceptance Criteria

To be defined when this phase opens.

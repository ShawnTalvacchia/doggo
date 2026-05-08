---
status: planned
last-reviewed: 2026-05-05
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

## Pre-loaded Scope (deferred from Sessions & Service Execution walkthrough — 2026-05-05)

Surfaced while walking the Pricing & Proposals chat surface during the Sessions phase. These are messaging-stream design questions, not session-execution work — captured here for the Inbox pass to resolve.

### Per-message vs separator timestamp pattern

Today: timestamps render below each message bubble / card as `.inbox-message-time`, centered for full-width cards (proposal/inquiry/contract), trailing for left/right-aligned text bubbles. Date dividers (`.inbox-date-sep`) carry the day labels.

Question: should the chat stream adopt **per-message inline timestamps** (WhatsApp / iMessage pattern — time tucked into the bottom-right corner of each text bubble) and let the date dividers carry the day/time-of-day separation, OR keep the current **trailing timestamp** pattern that works uniformly for plain text + structured cards (proposal, inquiry, contract)?

Tension: WhatsApp-style inline times are cleaner for plain text, but proposal cards already have internal structure — adding a per-card footer timestamp risks doubling up with the trailing/separator timestamp. Mixed surfaces (text + structured cards + system messages) often read better with a uniform trailing/separator pattern.

Recommended starting point: keep separator pattern, but verify breathing room is right across all card types and consider whether the per-card footers (e.g. Booking proposal's `Awaiting response` / `View booking` row) should also carry the time inline so the structured artifacts feel timestamped at a glance.

Files: `app/inbox/[conversationId]/ThreadClient.tsx` (timestamp rendering logic), `components/messaging/BookingProposalCard.tsx`, `components/messaging/InquiryCard.tsx`, `components/messaging/ContractCard.tsx`, `app/globals.css` `.inbox-message-time` + `.inbox-date-sep`.

### Contract signed — RESOLVED 2026-05-05

Decision: dropped the separate `ContractCard` entirely. The accepted proposal card carries the signing signal via its accepted-state footer (`Signed HH:MM · View booking →`). The booking detail page's `Booking.signedAt` is the canonical record.

Shipped:
- `BookingProposal.signedAt?: string` field added in `lib/types.ts`. `updateProposalStatus` in `ConversationsContext.tsx` stamps it automatically when the status flips to `"accepted"` so all call sites land the timestamp.
- `BookingProposalCard` accepted-state footer renders `Signed HH:MM · View booking →`.
- ThreadClient's `msg.type === "contract"` branch now returns `null` (legacy contract messages on seeded conversations are silently skipped). Both `ThreadClient.handleSign` and the booking detail's `handleSign` no longer create new contract messages.
- Green border on accepted proposals dropped (`.inbox-proposal-card--accepted` inherits default border).

Cleanup deferred to a future trim pass:
- `components/messaging/ContractCard.tsx` is no longer imported anywhere — delete on next code-hygiene sweep.
- `.inbox-contract-card` CSS rules in `globals.css` (lines ~10616+) are unused — delete.
- `ChatMessage.type === "contract"` and `contract: { ... }` field could be removed from `lib/types.ts` once seeded mock conversations are confirmed to not depend on them.

### Edit-after-submission on visit reports

Surfaced during Sessions & Service Execution walkthrough A5 (2026-05-05). The user pushed back on requiring a confirmation modal before sealing a visit report — friction without value when composition is already inline. Single-tap Finish shipped, but the *real* long-term answer to "what if the provider made a typo or hit Finish accidentally" is letting them edit the report for some window after sending.

Why this belongs on the Inbox board, not Sessions: the ergonomics interact with messaging-level patterns. If the owner already viewed the old version and the provider edits it, does the owner see "edited" indicator? Does the chat thread show a system message? Does the report version-history get tracked? These are the same questions chat itself is going to face for message-edit support during this phase.

Open questions to resolve here:
- **Edit window** — open-ended, or N hours / until owner views?
- **Versioning** — single-version with last-write-wins, or a chronicle of edits the owner can scroll?
- **Owner-already-saw indicator** — if the owner read the report and the provider edits, does the owner get notified? See an "edited" tag?
- **Chat thread integration** — does an edit appear as a system message in the booking thread, or stay silent?

If we ship edit-after-submission cleanly, single-tap Finish stays right (irreversibility is no longer a real concern). Without it, the ergonomic ceiling on Finish is slightly lower — accidentally-tapped sealings have no recovery path.

Touches: `BookingSession.report` shape (probably needs `editedAt` / `version`), the visit-report inline rendering on the Sessions tab (needs an "edited" indicator), the Inbox conversation thread (system message integration).

### Owner pre-session notes vs chat — a coherent principle

Surfaced during Sessions & Service Execution walkthrough A2 (2026-05-05). User asked whether owners should be able to attach a note to an upcoming session ("Bára's recovering from a tummy upset, please walk shorter today"). They acknowledged chat handles the same use case and were OK deferring.

The deeper question this poses for the Inbox pass: with three places to communicate about a booking — chat, `Booking.ownerNotes` (whole-booking care instructions), and a hypothetical `BookingSession.ownerNote` (per-occurrence note) — what's the principle that tells users which goes where? Without one, users get confused or duplicate.

Sketch of a possible principle to test:
- **Chat** = conversation, time-stamped, bidirectional, ephemeral context.
- **`ownerNotes`** = persistent care instructions, true for every session ("key under the blue pot, Bára gets one treat after walks").
- **`session.ownerNote`** (if we ship it) = forward-looking date-anchored note, expires after the session ("today only, please skip the leash"). Symmetric with `session.report` (provider's backward-looking date-anchored artifact).

If we adopt the per-session note, the data shape is trivial — `BookingSession.ownerNote?: string`. The product question is whether the trio reads coherently or muddles. Resolve here, then either implement during Inbox phase or punt.

### Superseded proposal card — subdue + expand-on-click

Today: countered / declined / accepted proposal cards collapse to header + service title (`isCollapsed` branch in `BookingProposalCard.tsx`). The header background still uses `--status-info-main` (vivid blue) at full saturation — superseded cards visually compete with the active proposal above or below.

Want: collapsed/superseded cards should **subdue** (lower opacity, muted header background, lower-contrast type) AND become **tappable to expand** the full details inline so the chronicle is still inspectable on demand without leaving the chat.

Touches: `BookingProposalCard.tsx` (add expand-on-click state, accept controlled expand prop or self-managed), CSS rules for `.inbox-proposal-card--countered` / `--declined` / `--accepted` collapsed states (subdue), the header background treatment.

Pairs naturally with the Contract-signed pattern decision above — both are about how a chat thread handles superseded artifacts vs. live ones.

---

## Tasks

To be defined when this phase opens. The pre-loaded scope above is the seed.

---

## Acceptance Criteria

To be defined when this phase opens.

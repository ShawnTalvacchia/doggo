---
status: active
last-reviewed: 2026-05-08
review-trigger: When any task is completed or blocked
---

# Inbox & Notifications

**Goal:** Turn typed-but-undelivered notifications into real notifications, finish the inquiry-driven trust transitions model, collapse the two notification surfaces into one, and bring inbox row hygiene + lingering messaging-stream design questions to phase-thesis quality.

**Depends on:** Sessions & Service Execution (closed 2026-05-08 — typed `session_started` / `session_completed` notification types but didn't fire them).

**Refs:** [[features/messaging]], [[strategy/Trust & Connection Model]], `app/inbox/`, `app/notifications/`, `components/ui/NotificationsPanel.tsx` (slated for removal in C1), `components/messaging/`, `components/people/PersonRow.tsx` (inbox-conversation variant), `Open Questions §2` (inquiry-driven trust transitions)

---

## Opening Checklist

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Audit for conflicts between phase plan and current codebase
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks
- [x] Confirm scope — no tasks that belong in a different phase

---

## Workstream A — Notification delivery wiring

Real `addNotification` path; session lifecycle fires. Replaces the typed-but-mocked seed pattern.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Add `addNotification` to NotificationsContext, persisted via `usePersistedState("doggo-notifications")`. Reset wired into `clearDemoLocalStorage` automatically (prefix wipe + `resetPersistedState("doggo")`). | `contexts/NotificationsContext.tsx`, `lib/usePersistedState.ts` | done |
| A2 | Fire `session_started` on Start. Two real call sites converge through `handleUpdateSession` wrapper (booking detail) + an explicit `addNotification` call (ScheduleCard quick-start). `SessionDetailContent` is orphan per P56 — skipped. Builders in `lib/notificationBuilders.ts`. | `app/bookings/[bookingId]/page.tsx:889`, `components/schedule/ScheduleCard.tsx:386`, `lib/notificationBuilders.ts` | done |
| A3 | Fire `session_completed` on Finish. Body carries "Tap to view the visit report and leave a review."; href routes to `/bookings/[id]?tab=sessions` so the report is the landing surface (G3 adds inline review CTA there). Funneled through the same wrapper as A2. | `app/bookings/[bookingId]/page.tsx:889`, `lib/notificationBuilders.ts` | done |
| A4 | Removed `notif-10` mock seed. Confirmed `care_review` seed (notif-7 — "Jana left you a review") is unrelated to the live-fire path and stays. | `lib/mockNotifications.ts` | done |
| A5 | Three-surface coordination verified by audit: bell demotes via `markRead` (per-notification); `/schedule` review-recent card demotes via dismissed state OR `useReviews().hasReview` (per-booking); `/bookings` strip demotes via `markViewed` when owner opens Sessions tab (per-booking + 5-day recency). Mechanics are independent — the natural bell-tap → Sessions tab → `markViewed` chain coordinates as a user-flow side effect, not a forced suppression. G2 (strip not firing for fresh seals) is a separate issue tracked in Workstream G. | `components/schedule/ReviewRecentSection.tsx`, `components/ui/BookingRow.tsx:findNewReport`, `lib/useViewedReports.ts` | done |

---

## Workstream B — Inquiry-driven trust transitions, finishing

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | First-message → mutual Familiar in non-Connected conversations. Wired at `ThreadClient.handleSend` (compose boundary) — checks `getConnection(other, viewer)` and gates on neither side already familiar/connected. Idempotent; no-op on already-Connected via state-rank merge in ConnectionsContext. Covers Appointment-flow "Ask about this" path. | `app/inbox/[conversationId]/ThreadClient.tsx:handleSend` | done |
| B2 | Trust & Connection Model updated with the four-rule resolved model (inquiry send → mutual Familiar; contract sign → mutual Connected; first message → mutual Familiar; declined doesn't roll back). Open Q §2 sub-bullet struck through. `last-reviewed` bumped on Trust model. | `docs/strategy/Trust & Connection Model.md`, `docs/strategy/Open Questions & Assumptions Log.md` | done |

---

## Workstream C — Collapse to one notification surface

Drop the dropdown; route all bell clicks to `/notifications`. Cleaner code path, mobile-first.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Deleted `components/ui/NotificationsPanel.tsx`. Removed stale references in styleguide components page (text + component list). | `components/ui/NotificationsPanel.tsx`, `app/styleguide/components/page.tsx` | done |
| C2 | Bell now uses `ButtonIcon` with `href="/notifications"` — same icon-button pattern as the inbox link next to it. State (`notifOpen`, `notifWrapRef`) and the panel render dropped. | `components/layout/AppNav.tsx` | done |
| C3 | Pruned `.app-nav-notif-wrap`, `.notif-panel*`, `.notif-list`, `.notif-row*`, `.notif-row-inner*`, `.notif-avatar-wrap`, `.notif-avatar` + `--placeholder`, `.notif-type-icon*`, `.notif-body`, `.notif-title`, `.notif-preview`, `.notif-time`, `.notif-unread-dot`, `.notif-empty*`, `.notif-mark-all-btn`, `.notif-close-btn`. Kept `.notif-avatar-stack` + items, `.notif-unread-badge`, `.notif-cat-tag`. Comment block records what got dropped. | `app/globals.css` | done |

---

## Workstream D — Inbox visual + UX hygiene

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Density bumped: inbox-row body padding 8/12 → 12/12, identity column gap `gap-xs` → `gap-sm`, list divider `divide-edge-regular` → `divide-edge-subtle`. Three small breathing-room moves rather than one big restyle — the row stays compact but stops feeling packed. | `components/people/PersonRow.tsx`, `app/globals.css` (`.person-row--inbox-conversation .person-row-body`), `app/inbox/page.tsx` | done |
| D2 | "You:" prefix appears on outgoing previews when last message is text-kind (system-message kinds — inquiry / proposal / contract / payment — keep their own framing). Inbox page gates on `!lastFromOther && previewKind === "text"`. | `app/inbox/page.tsx` | done |
| D3 | Added `compactName(fullName)` helper in inbox page (firstName + lastInitial.) — applied to both branches (conversations + connected-without-conversation). Existing dog-name fallback chain (inquiry pets → partner profile pets) confirmed adequate via code review. | `app/inbox/page.tsx` | done |
| D4 | Audit: all five `PreviewKind` values have styling. `inquiry` / `proposal` → `brand-strong` + `✦` glyph; `contract` / `payment` → `success-strong` + `✓` glyph; `text` falls through to default tertiary color. No new types missing styling. (`contract` kind becomes unreachable after F3 — handled there.) | `app/globals.css` (`.person-row-preview--*`) | done |

---

## Workstream E — Messaging-stream design questions

Decide each in walkthrough; ship minimum viable for the ones that need build.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Decided: keep current trailing/separator pattern. Per-message inline timestamps would compete with the structured cards' existing footers (`Awaiting response` / `View booking`). No build. Decision recorded in `messaging.md` Key Decisions §9. | `docs/features/messaging.md` | done |
| E2 | Added `VisitReport.editedAt`. `VisitReportInline` gains `canEdit` + `onSaveEdit` props; SessionRow computes window (`canAct && completed && < 24h since seal && (!ownerLastViewedAt \|\| ownerLastViewedAt < completedAt)`). Provider-only Edit affordance flips notes into a textarea + Save / Cancel; save merges new notes + stamps `editedAt`. Owner sees a quiet `edited` tag next to "Completed at HH:MM". No notification, no chat system message — silent edit per the lean defaults. | `lib/types.ts:VisitReport`, `app/bookings/[bookingId]/page.tsx` (VisitReportInline + SessionRow + Past sessions render) | done |
| E3 | Subdued chrome on `--countered` / `--declined` / `--accepted` cards (opacity 0.7, surface-inset header background, tertiary icon, secondary label color). Collapsed body wraps in a `<button>` (`inbox-proposal-collapsed-trigger`) with a trailing CaretDown — tap expands to full chronicle inline. "Show less" toggle in the expanded body collapses back. Pending cards retain full vivid header + chrome. | `components/messaging/BookingProposalCard.tsx`, `app/globals.css` | done |
| E4 | Decided: chat = ephemeral conversation; `Booking.ownerNotes` = persistent care instructions; `BookingSession.ownerNote` = forward-looking date-anchored (deferred build). Build of the third surface is deferred — adding it warrants its own walkthrough. Decision recorded in `explore-and-care.md` Key Decisions §7. | `docs/features/explore-and-care.md` | done |

---

## Workstream F — Cleanup from Pricing & Proposals close

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Deleted `components/messaging/ContractCard.tsx`. | `components/messaging/ContractCard.tsx` | done |
| F2 | Pruned `.inbox-contract-card` + header / body / link / icon / label / service / meta rules. Kept `.inbox-message-wrap--center` (used by other surfaces). | `app/globals.css` | done |
| F3 | Audited seeded data: zero `type: "contract"` messages remain. Removed: `ChatMessage.type === "contract"` from MessageType union, `ContractConfirmation` interface, `contract?:` field on ChatMessage, the dead `if (msg.type === "contract")` branch in ThreadClient, the `if (lastMsg.type === "contract")` preview branch + `"contract"` from PreviewKind union in inbox page, `"contract"` from `messagePreviewKind` prop type on PersonRow, `.person-row-preview--contract` CSS rule. Note in `lib/types.ts` records the cleanup. | `lib/types.ts`, `app/inbox/page.tsx`, `app/inbox/[conversationId]/ThreadClient.tsx`, `components/people/PersonRow.tsx`, `app/globals.css` | done |

---

## Workstream G — Walkthrough audit findings

Surfaced during scope-locking conversation 2026-05-08 — Daniel ↔ Klára training session walkthrough.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| G1 | Section header already adapts (`hasMeet && hasSession ? "Review recent activity" : ...`). Real bug: the schedule's session-items filter excluded today's completed sessions (`lastCompleted < todayIso`). Daniel's list went empty when Klára sealed Bára's session today. Fixed by inclusive bound (`<= todayIso`) — a session sealed an hour ago is the strongest moment to ask for a review. | `app/schedule/page.tsx` | done |
| G2 | Root cause: `markViewed` effect re-fired every time `CURRENT_USER` changed (it's in the deps). Persona-switch from Klára back to Daniel post-seal stamped `lastViewedAt` AFTER `completedAt`, suppressing the strip. Fixed via `markedBookingRef` sentinel — fires once per mounted booking; persona switches no longer re-stamp. | `app/bookings/[bookingId]/page.tsx` | done |
| G3 | Added inline "Leave a review for {carer}" prompt at the top of the Sessions tab. Renders only when the viewer is the owner, no review yet exists, the booking isn't cancelled, and at least one session has a sealed report. Shares the existing `setReviewOpen(true)` modal flow with the Info tab CTA. | `app/bookings/[bookingId]/page.tsx` | done |

---

## Acceptance Criteria

- [ ] Klára (provider) starting Bára's training session fires a `session_started` notification visible in Daniel's `/notifications`. Tap routes to booking detail.
- [ ] Klára finishing the session fires a `session_completed` notification with "Leave a review?" body. Tap routes to booking detail; Daniel can land on the Sessions tab and review inline (G3) or via Info tab.
- [ ] Daniel's `/bookings` row shows the "New visit report from Klára" strip after the seal (G2 fixed).
- [ ] Daniel's `/schedule` review-recent card label adapts to mixed contents (G1 fixed).
- [ ] All three demotion surfaces (bell, /schedule, /bookings) coexist without contradicting each other.
- [ ] First-service-message in a non-Connected conversation auto-marks both parties Familiar (Tomáš → Lenka Appointment flow demonstrates).
- [ ] Bell click on desktop routes to `/notifications` (no dropdown panel).
- [ ] No imports of deleted ContractCard remain. Seeded conversations have no `type: "contract"` messages.
- [ ] Inbox row density passes a side-by-side review against current state; "You: " prefix appears on outgoing previews; row data is consistent across all rows.
- [ ] Provider can edit a sealed visit report within the window; owner sees a quiet "edited" tag on the report card if it was modified.
- [ ] Superseded proposal cards are visually subdued and expand on click.
- [ ] Open Q §2 (Trust transitions) has zero open sub-bullets.

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Sweep walkthrough's "Decisions surfaced" section — every entry processed
- [ ] Update all affected feature docs (messaging, explore-and-care, profiles)
- [ ] Update Open Questions log — close §2 transitions
- [ ] Update ROADMAP.md — mark phase complete; next phase = Discover Refinement
- [ ] Review CLAUDE.md — update current phase / key decisions
- [ ] Punch list scan — clear or migrate any items this phase touched (P46 should fully retire)
- [ ] Archive this phase board + walkthrough
- [ ] Trim pass on Roadmap, CLAUDE.md, touched docs
- [ ] Structural audit (3 checks per CONTRIBUTING.md)
- [ ] Strategic review brief
- [ ] Check Discover Refinement scope for conflicts

---

## Design notes (preserved context)

These are substantive design questions referenced by the workstreams above.

### Per-message vs separator timestamp pattern (E1)

Today: timestamps render below each message bubble / card as `.inbox-message-time`, centered for full-width cards (proposal/inquiry/contract), trailing for left/right-aligned text bubbles. Date dividers (`.inbox-date-sep`) carry the day labels.

Question: should the chat stream adopt **per-message inline timestamps** (WhatsApp / iMessage pattern — time tucked into the bottom-right corner of each text bubble) and let the date dividers carry the day/time-of-day separation, OR keep the current **trailing timestamp** pattern that works uniformly for plain text + structured cards?

Tension: WhatsApp-style inline times are cleaner for plain text, but proposal cards already have internal structure — adding a per-card footer timestamp risks doubling up with the trailing/separator timestamp. Mixed surfaces (text + structured cards + system messages) often read better with a uniform pattern.

Recommended starting point: keep separator pattern, but verify breathing room across all card types and consider whether the per-card footers (e.g. Booking proposal's `Awaiting response` / `View booking` row) should also carry the time inline so the structured artifacts feel timestamped at a glance.

### Edit-after-submission on visit reports (E2)

Locked defaults from scope conversation 2026-05-08:
- **Window:** 24h, or until owner views the report (whichever is shorter).
- **Versioning:** last-write-wins. No chronicle.
- **Owner-saw indicator:** silent "edited" tag on the report card. No notification.
- **Chat thread integration:** silent. No system message.

Reasoning: edits are typo fixes 95% of the time; loud edits create anxiety that doesn't exist in messaging-app conventions. Chronicle versioning is overengineered for the demo. Field shape (`editedAt`) leaves room to upgrade.

### Owner pre-session notes vs chat (E4 — decide-only)

Three places to communicate about a booking — chat, `Booking.ownerNotes` (whole-booking), hypothetical `BookingSession.ownerNote` (per-occurrence). Without a principle, users get confused or duplicate.

Sketch to validate in walkthrough:
- **Chat** = conversation, time-stamped, bidirectional, ephemeral context.
- **`ownerNotes`** = persistent care instructions, true for every session ("key under the blue pot").
- **`session.ownerNote`** = forward-looking date-anchored note, expires after the session ("today only, please skip the leash"). Symmetric with `session.report` (provider's backward-looking date-anchored artifact).

Decide-only this phase. Build deferred — adopting the per-session note adds a third comms surface that warrants its own walkthrough.

### Superseded proposal card (E3)

Today: countered / declined / accepted proposal cards collapse to header + service title. Header background still uses `--status-info-main` (vivid blue) at full saturation — superseded cards visually compete with the active proposal.

Want: collapsed/superseded cards should **subdue** (lower opacity, muted header background, lower-contrast type) AND become **tappable to expand** the full details inline so the chronicle is still inspectable on demand without leaving the chat.

Pairs with the contract-signed pattern (Pricing & Proposals close) — both are about how a chat thread handles superseded artifacts vs. live ones.

---

## Out of scope (explicitly)

Flagged during opening checklist; defer to other phases.

- **§4 Multi-active-session banner / Multi-leg tracking** — Open Questions §4, deferred.
- **§4 Multi-pet booking treatment** — Open Questions §4, future phase.
- **Punch list P38 (mobile create-button icon)** — nav iconography; Design System Cleanup or punch list.
- **Punch list P54 (Connected ✓ profile dropdown)** — profile/trust UI, not inbox.
- **Punch list P55 / P57** — general demo plumbing; punch list unless we're already touching the file.
- **Inbox threading model + read-receipt overhaul** — current "one conversation per pair" + lastFromOther unread inference is sufficient for demo.

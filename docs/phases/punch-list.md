---
status: active
last-reviewed: 2026-05-10
review-trigger: "any time — add items as they're noticed, fix them when convenient"
---

# Punch List

Running list of small UI tweaks, visual fixes, and quick bugs that live alongside whatever phase is active.

---

## Workflow

### What belongs here

- Quick fixes (≤30 min): visual nits, small bugs, content tweaks, dead-code cleanup.
- **Description column is 1–2 sentences.** The refs column carries deeper context (file paths, feature docs).
- If an item needs paragraphs of justification, design discussion, sub-items, or has "open product calls," it's phase work, not a punch-list item — promote it.

### Adding items

Add to the table with the next number, a one-sentence description, category, affected page/area, file refs, and today's date.

### Fixing items

1. Read the item's referenced files. If the fix touches a feature doc or design doc, update it too.
2. Make the change.
3. **Remove the item from the table.** The commit message is the record — don't log fixes here.

### Promoting items

If an item turns out to need design thinking or more than ~30 minutes:

1. Move it to the relevant phase board's pre-loaded scope (or to Open Questions if the question itself is open).
2. Remove it from this file.
3. Don't let it sit silently — the point is that nothing gets lost.

---

## Open Items

| # | Description | Category | Page/Area | Refs | Added |
|---|-------------|----------|-----------|------|-------|
| P51 | **Design-system audit + convergence pass.** Running list of areas that need unification — running collection, build into a single phase when it's worth a focused sweep. (a) Optional-field label pattern across forms (today: inline em-dash `— optional`, right-aligned `Optional`, no marker — pick one, apply everywhere). (b) Familiar / Connected chip pattern — Discover Card now uses brand outline (Familiar) + brand fill (Connected) at brand-strong text. PersonRow surfaces (`person-row-pill--familiar` etc.) still use the older neutral-grey treatment. Bring those in line so the chip language is consistent across cards, member lists, and meet attendee rows. | Design system | App-wide | `components/ui/InputField.tsx`, `components/messaging/InquiryForm.tsx`, filter fields in Discover, `components/people/PersonRow.tsx`, `app/globals.css` (`.person-row-pill--*`) | 2026-05-04 |
| P1 | "Any" filter pill — selecting Any + a specific filter shouldn't be possible; toggle behaviour still wrong. | Interaction | Discover filters | | 2026-04-10 |
| P2 | Group size slider has no "no max" option — some groups are unlimited. | Interaction | Discover filters / group creation | | 2026-04-10 |
| P8 | Profile Posts tab — losing corner radius on post images. | Visual | Profile | `components/posts/FeedCommunityPost.tsx` | 2026-04-13 |
| P16 | Orphan files in `components/activity/` — `MyScheduleTab.tsx` and `ServicesTab.tsx` have no live importers. Verify zero importers, then delete. | Cleanup | Code hygiene | `components/activity/MyScheduleTab.tsx`, `components/activity/ServicesTab.tsx` | 2026-04-25 |
| P38 | Generic "+" icon on the mobile nav create button reads as ambiguous — action is context-aware (post / meet) but the icon doesn't flip per context. Audit and pick context-specific icons. | Visual / Content | Mobile nav | `components/layout/AppNav.tsx` (`LoggedNavLinks`) | 2026-04-30 |
| P40 | "Familiar ✓" tag on profile pages should be tappable to reverse the mark. Today the tag is a passive label with no way to undo. Recommended: tap → small popover with "Unmark" + "Cancel" (friction-by-design). | Trust / Interaction | Profile page (Familiar viewer) | `app/profile/[userId]/page.tsx`, `components/ui/ConnectionIcon.tsx` | 2026-04-30 |
| P42 | Inline comment compose on feed posts — `CommentThread` has a `canComment` prop but the send action is a stub. Wire to session-scoped local state (mirrors `ConnectionsContext` pattern), or skip until backend is real. Low priority. | Content / Interaction | Feed posts | `components/feed/FeedCard.tsx`, `components/feed/CommentThread.tsx` | 2026-04-30 |
| P43 | Group join/leave actions are stubs — "Join Community" calls `setJoinRequested(true)` (local React state) but doesn't mutate membership. Real fix: `GroupsContext` mirroring `ConnectionsContext` (session-scoped overrides). Not load-bearing for the demo. | Trust / Interaction | Group detail | `app/communities/[id]/page.tsx`, `components/groups/GroupDetailPanel.tsx`, `lib/mockGroups.ts` | 2026-04-30 |
| P54 | "Connected ✓" button on profile hero is a placeholder — currently non-interactive. Wire a small dropdown menu on tap with options: Unconnect, Block, Report. Friction-by-design (these are heavy actions; not a quick toggle like Familiar). Mirrors P40 pattern but with more options. | Trust / Interaction | Profile page (Connected viewer) | `app/profile/[userId]/page.tsx` | 2026-05-05 |
| P55 | **Stale localStorage masks new mock seeds.** `usePersistedState` hydrates `doggo-bookings` / `doggo-conversations` / `doggo-connection-overrides` from localStorage on first read; once a tab has persisted state, newly-added mock entries (e.g. a booking added during phase work) never appear until the tester resets via `/demo`. Surfaced 2026-05-07 — D1 review prompt was missing because the tab cached an older `mockBookings` snapshot. Sketch: add a `seedVersion` constant in `lib/mockBookings.ts` (and friends), persist alongside data, reset cache when version mismatches. Means we bump the version any time we add seeds; testers get fresh data automatically. Worth doing before user-testing rounds so we don't have to chase resets. | Demo plumbing | App-wide demo state | `lib/usePersistedState.ts`, `contexts/BookingsContext.tsx`, `contexts/ConversationsContext.tsx`, `contexts/ConnectionsContext.tsx` | 2026-05-07 |
| P56 | **Orphan: `components/schedule/SessionDetailContent.tsx`** has zero importers. Surfaced 2026-05-08 during the textarea-audit pass. Verify nothing reaches it via dynamic import, then delete. | Cleanup | Code hygiene | `components/schedule/SessionDetailContent.tsx` | 2026-05-08 |
| P57 | **localStorage key naming inconsistency.** Two conventions in use: hyphen-snake (`doggo-care-reviews`, `doggo-bookings`, `doggo-conversations`, `doggo-connection-overrides`) vs colon-camel (`doggo:dismissedReviews`, `doggo:dismissedReviews:change` event). Pick one — the hyphen-snake form is more common across the codebase — and migrate the dismissedReviews module. Update `clearDemoLocalStorage` and any wildcard wipes if they pattern-match on the prefix. Surfaced 2026-05-08 during Sessions walkthrough audit (D6 doc was wrong about the dismissed-reviews key). | Cleanup | Code hygiene | `lib/dismissedReviews.ts`, `contexts/ReviewsContext.tsx`, `lib/usePersistedState.ts` | 2026-05-08 |
| P58 | **Avatar shape audit — Rule B (People = circle, Dogs = rounded square).** Decided 2026-05-08 during Sessions walkthrough as the consistent rule. Sweep the codebase for places where dogs render as circles or people render as rounded squares; align to the rule. Known correct surfaces: PetCard, new SessionsPetHeader, updated Pet info section. Suspected drift: pet avatars in inbox row combos, schedule cards, discover cards, profile pet sections, group hero member stacks, AvatarStack components. Take care with semantically-loaded shapes (Familiar/Connected ring on Discover provider cards is its own pattern, not affected by the Rule B audit). | Design system | App-wide | `components/people/OwnerDogAvatar.tsx`, `components/profile/PetCard.tsx`, `components/ui/BookingRow.tsx`, `components/schedule/ScheduleCard.tsx`, `components/explore/CardExploreResult.tsx`, `app/globals.css` (any `.pet-avatar`, `.dog-avatar` or rounded-full applied to pet imagery) | 2026-05-08 |
| P59 | **Notification seed enrichment for non-Shawn personas.** Inbox & Notifications walkthrough added `recipientId` to AppNotification and routes by it. The 23 seeded notifications were originally Shawn-centric (he was the main persona). 3 were re-attributed (notif-series-1 + notif-9 → Tereza, notif-16 → Daniel) so the active viewer personas have non-empty bells, but Klára and Tomáš still start with 0 seeded notifications. Sweep the remaining 20 seeds and re-attribute (or duplicate where one event has multiple recipients) to give every viewer persona a coherent starting bell — booking-related to owners, post-meet review prompts to attendees, group-activity to group members. Possibly larger than ≤30 min if done thoroughly — could promote to Demo Presentation phase if it grows. | Demo polish | Mock data | `lib/mockNotifications.ts` | 2026-05-08 |

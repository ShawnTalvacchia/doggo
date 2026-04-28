---
status: active
last-reviewed: 2026-04-27
review-trigger: When any task is completed or blocked
---

# Trust & Visibility Pass

**Goal:** Standardize how the app renders people and gates access to their content. Every surface that lists a person should use the same row pattern, the same connection-state language, and the same Meta-style tiered action affordances. Marking someone Familiar should feel like a quiet door-opener, not a confused sub-action — and the gating model (locked-to-locked = silent; mark Familiar to invite contact) should be evident without explanation.

**Depends on:** Trust & Connection Model (strategy doc, stable). Content Visibility Model (strategy doc, stable). Meets Deep Pass — runs **in parallel**, not sequentially. Coordination is via change reports in the punch list, same protocol used during the Meet Recurrence Model phase.

**Refs:** [[Trust & Connection Model]], [[Content Visibility Model]], [[meets]], [[design-system]]

**Replaces / absorbs:** Punch list items **P19** (Familiar copy + tier-logic audit) and **P25** (content visibility audit on meet detail). Both folded into Workstream D and Workstreams A + C respectively.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs — especially `Trust & Connection Model.md` (Familiar = outbound, silent, grants THEM visibility into YOU) and `Content Visibility Model.md` (two-gate system)
- [x] Review Open Questions log — flag anything affecting this phase (no blockers; §4 *Lock vs. Tier* punted to Discover & Care, §2 hybrid-trust deferred)
- [x] Audit for conflicts between phase plan and current codebase — three findings landed: (a) `ParticipantList` already tier-filters at line 84, board claim of "no filter applied" was wrong; (b) D2 resolved (bump on `theyMarkedFamiliar`); (c) `ConnectionIcon` per-row variant on inbound Familiar may violate the D2 deniability guardrail — handled in D3
- [x] Walk every surface in the inventory below — confirmed against code 2026-04-27
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — `design-system.md` bumped + PersonRow entry added (A2); `connections.md` bumped + Current State refreshed; `Content Visibility Model.md` bumped + photo-tease rule added (C3); `Trust & Connection Model.md` bumped + deniability subsection added (D2)
- [x] Confirm scope — no tasks that belong in a different phase
- [x] Coordinate with the Meets Deep Pass walkthrough chat — four change reports filed in punch-list during the session (A1–A4 landing, A5 + P23/P24 close, A6+A7 + E2 partial, D landing, B+C+E2+F finalize)

---

## Surfaces Inventory

Every place this phase touches. Confirmed via codebase scan 2026-04-27.

| Surface | File | Current state | Phase action |
|---------|------|---------------|--------------|
| Meet detail — People tab | `app/meets/[id]/page.tsx` (PeopleTab) → `components/meets/ParticipantList.tsx` → `ParticipantCard` | Shared component. Currently shows name, dog, neighbourhood, "connected since" line, single Connect action. **Tier filter IS applied** — line 84 filters `tier <= 2`, lines 157-164 render tier-3 as "+ N other attendees" footer. **But:** tier-classification logic at lines 63-70 reimplements `getAttendeeTier` verbatim — that's a duplication ready to drift. | Rebuild — adopt `PersonRow` + action matrix; replace inline tier logic with `getAttendeeTier` call; add pets; drop "connected since"; fix horizontal padding. |
| Post-meet review — Make connections step | `components/meets/PostMeetReviewSheet.tsx` (`AttendeeActionCard` inline) | Rolls own markup. Familiar/Connect/Skip pills (originally). **Shipped (A7): owner-forward** card layout (64+32 avatar combo, `radius-md` dog), state-grouped sections (Not Familiar / Familiar / Connected / Locked), section-aware structure (footer for Not Familiar with evolving inline pill; inline-only for the others), profile-state-aware explainer, no Skip, no Open profile indicator, v3 matrix (Familiar gates Connect). Different shape than `PersonRow` — cascade in P27. | Keep dog-forward shape (different context) but **action logic + copy** align to the new matrix. Add explanatory copy (Workstream F). |
| Post-meet review — "Also there" section | `components/meets/PostMeetReviewSheet.tsx` (`MakeConnectionsStep` alsoThere list) | Minimal avatar + name pills. | Verify against new tier rules (tier-3 should not be named here). |
| Group detail — Members tab | `app/communities/[id]/page.tsx` (`MembersTab` inline) | Rolls own inline markup. Name + avatar + admin badge + connection-state pill. No actions. | Refactor to use shared `PersonRow`. Add action matrix. |
| Inbox conversation list | `app/inbox/page.tsx` (`InboxUserRow` inline) | Rolls own. Avatar + name + dog names + last message + time + unread dot. Click → thread. | **Keep message-preview shape** (it's a chat list, not a person list) but adopt connection-state pills + tier-aware identity rendering. No action buttons added (the row IS the affordance). |

**Out of scope (reasoned):**
- `DogsNearYou` — visual avatar strip, no actions, dog-forward not person-forward. Already flagged in punch-list P10 for product-role decision.
- `AttendeeAvatarStack` — purely visual, no identity rendering beyond images.
- `CardExploreResult` — provider listing, different surface logic (rating, distance, services). Belongs to Discover & Care Deep Pass.
- Hosted-by mini-cards — single-person summaries inside other components, not list rows.

---

## The Action Matrix

Canonical truth for "what does the viewer see when looking at this person's row." Refer to this table from every workstream.

**Refined 2026-04-27 (v2) — Familiar gates Connect app-wide for locked viewers.** Previously the "any signal" rule (subject open OR theyMarkedFamiliar) exposed Connect alongside Familiar in the unmarked state. Now: locked viewers see ONLY Familiar until they've marked it. Connect appears only after marking. Reasoning: the trust model intends Familiar as the gateway to Connect ("I acknowledge you exist" precedes "I want a mutual relationship"). The UI now enforces that gradient. Open viewers are unchanged — they get Connect only (Familiar is redundant for them; they're effectively past the Familiar step by being public).

| Viewer state ↓ \ Subject state → | Open OR they marked me Familiar | Locked, no action between us |
|---|---|---|
| **I'm open** | **Connect only** (Familiar redundant — profile already public) | **Connect only** |
| **I'm locked, no action between us** | **Familiar only** — must mark before Connect appears | **Familiar only** |
| **I'm locked, they marked me Familiar** | **Familiar only** — gating still applies; my acknowledgment must come first | **Familiar only** |
| **I marked them Familiar (and I'm locked)** | "Familiar ✓" + Connect (subject visible to me — gateway satisfied, escalation available) | "Familiar ✓" only — subject still locked-to-me, can't deliver a request yet |
| **I marked them Familiar (and I'm open)** | Connect only (open viewer; Familiar mark exists in data but UI doesn't surface it) | Connect only |
| **Connected** | Message | n/a |
| **Self** | n/a (no row, or self-styled row) | n/a |

**Why Familiar gates Connect:** the trust gradient is real — Familiar is "I acknowledge you," Connect is "let's formalize this." Showing both at once invites users to skip the lighter step and dilutes the gradient. Forcing Familiar first preserves the model's intent and reduces decision fatigue (one action per card in the unmarked state).

**Why open viewers skip Familiar:** a public profile makes "quiet grant" a no-op — the mark wouldn't change anything observable. They've effectively done the Familiar step by being open. The edge case "user goes from open to locked later, would have wanted Familiar marks" is rare enough not to surface a no-op for everyone else.

**Why "Familiar ✓" is soft, no Connect when subject locked-to-me:** Connect requires the subject to be visible to viewer (for the request to be deliverable). If subject is locked AND hasn't marked viewer Familiar, the connection can't bridge — Familiar mark exists from viewer's side but is information-only.

---

## Workstream A — `PersonRow` shared component

Build the canonical row component that all four in-scope surfaces use. Variants for context, single source of truth for action affordances and tier visibility.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Spec `PersonRow` API — see **A1 Spec** sub-section below. | [[design-system]] | done |
| A2 | Build `components/people/PersonRow.tsx`. CSS class `.person-row` + variant modifiers. Use existing `.avatar`, `.chip`, `ButtonAction` primitives. **Done 2026-04-27.** Component built per A1 spec — four variants, "auto" actions via `resolvePersonActions`, internal dog-image lookup, select-mode checkbox, deniability-correct pill rule (no pill on `none + theyMarkedFamiliar`). CSS added to `globals.css:13577-13688` (`.person-row` + variant modifiers, three `.person-row-pill--*` states, unread dot, select-mode box). TypeScript clean, ESLint clean. Inbox variant wraps the whole row in a `<Link>` since there are no action buttons to compete; other variants keep the row as a `<div>` with avatar+name as inner Links. | [[design-system]] | done |
| A3 | Build `lib/personActions.ts` — pure function `resolvePersonActions(viewer, subject, viewerConnectionToSubject)` returning the action set per the matrix. Single source of truth; called by `PersonRow` (and anything else that needs the same logic). Unit-test the matrix coverage. **Done 2026-04-27.** Function in `lib/personActions.ts`; framework-agnostic matrix coverage in `lib/personActions.cases.ts` (11 cases, all rows of the matrix exercised) with a `verifyMatrix()` runner. No test framework added (out of phase scope) — cases plug directly into `it.each(MATRIX_CASES)(...)` when a runner lands. TypeScript clean, ESLint clean, all cases pass. | [[Trust & Connection Model]] | done |
| A4 | Migrate `ParticipantCard.tsx` to render via `PersonRow` with variant `meet-attendee`. Pets on the card. Drop "connected since" line. Replace the duplicated tier-classification at `ParticipantList.tsx:63-70` with a call to `getAttendeeTier`. Fix horizontal padding bug on the People tab. **Tier visibility is already applied** (filter + "+ N others" footer at lines 84, 157-164) — that part of the work is done. **Done 2026-04-27.** `ParticipantList.tsx` rewritten to use `PersonRow` (variant `meet-attendee`); inline tier logic removed in favor of `getAttendeeTier`. `ParticipantCard.tsx` deleted (zero importers). PeopleTab wrapped in `LayoutSection` for horizontal padding. `isCareProvider` added to `PersonRow` (with matching `.person-row-pill--care`) so the existing Care badge wasn't silently dropped. Pre-existing lint warnings on `app/meets/[id]/page.tsx` (2 hooks errors + 1 unused-var on `ChatTab` `meet` param) untouched — they predate this work. TypeScript clean, my edits ESLint clean. | [[meets]] | done |
| A5 | Migrate `MembersTab` (`app/communities/[id]/page.tsx`) inline rows to `PersonRow` with variant `group-member`. Adds the action matrix; previously had no actions. **Absorbs three punch-list overlaps in the same file** — close them in the same patch: **P18** (`--surface-gray` on member-list "familiar" pill — the new pill will use `brand-subtle`/connection-state tokens correctly, so the bad token use disappears with the rewrite), **P23** (dead `ChatTab` code at lines 221, 625+ — delete; group has no Chat tab), **P24** (orphan `.group-action-btn-status` / `.group-action-btn-invite` CSS in `globals.css:12104-12146` — verify zero usages and delete). Update `phases/punch-list.md` Done section when this lands. **Done 2026-04-27.** MembersTab now renders via `PersonRow` (variant `group-member`); the inline `--surface-gray` pill is gone (closes the member-list slice of P18 — broader P18 sweep still open). ChatTab + ChatTabProps + render branch + 6 orphan imports (`ChatCircleDots`, `PaperPlaneRight`, `Handshake`, `PawPrint`, `MessageBubble`, `SystemMessage`, `MeetCardCompact`, `getMessagesForGroup`, `GroupMessage` type) deleted along with the orphan `messages` variable (closes P23). `.group-action-btn-status` / `.group-action-btn-invite` deleted from `globals.css` (43 lines, closes P24). TypeScript clean. ESLint clean for my edits — 1 pre-existing hooks-rule error at line 177 (structural early return) remains, same shape as the meet detail file. | — | done |
| A6 | Migrate `InboxUserRow` (`app/inbox/page.tsx`) to `PersonRow` with variant `inbox-conversation`. Keep message-preview shape. Connection-state pills + tier-aware identity rendering. No action buttons (row click stays the primary affordance). **Done 2026-04-27.** Inline `InboxUserRow` deleted; rows now render via `PersonRow` variant `inbox-conversation`. Each row plumbs `connectionState`/`theyMarkedFamiliar`/`profileOpen` from `getConnectionState`. Three-line layout preserved (name+timeAgo, dogs with paw icon, message preview); unread state drives bold-name + emphasized-preview typography via `unreadDot` prop. Inbox variant in PersonRow refined: timeAgo moved to name row (right-aligned), pets row is text-only with paw icon (not avatars — too much for the chat-list shape). TypeScript clean, ESLint clean. | — | done |
| A7 | Update `PostMeetReviewSheet.tsx` `AttendeeActionCard` — keep dog-forward shape (it's a different context: "did you meet this person?"), but use `resolvePersonActions` for action set + copy alignment. **Done 2026-04-27 — but redesigned far beyond original scope.** Driven by walkthrough feedback, the card moved away from PersonRow's pattern entirely:  (a) **owner-forward** layout (64px owner avatar + 32px overlapping dog cluster with `radius-md`, white box-shadow ring) replaced the dog-forward shape — the post-meet review is fundamentally about *people*, not dogs; (b) **state-grouped sections** (Not Familiar / Familiar / Connected / Locked) replace the prior actionable/alsoThere split; (c) **section-aware card structure** — Not Familiar cards have an inline pill that EVOLVES (Familiar → Connect → Connect ✓) plus a footer with "✓ Familiar / Undo" when marked; Familiar/Connected get inline single pills (no footer); (d) **profile-state-aware explainer** at the top (locked vs open variants); (e) Skip removed entirely; (f) "Open profile" indicator removed (deniability + mobile fit); (g) explicit dependency on the v3 matrix (Familiar gates Connect app-wide). New CSS: `.pmr-card-*`, `.pmr-avatar-*`. New helpers: `OwnerDogAvatar`, `formatDogNames`. Mock data added: `meet-reactive-spring` (curated attendee mix for Daniel demo). `ActionPill` component dropped (replaced by ButtonAction + footer buttons). **Cascade filed as P27** (owner-forward avatar pattern → PersonRow + every consumer) and **P29** (soft Familiar indicator app-wide). | [[meets]] | done |
| A8 | Visual + interaction review pass — does the new row pattern look right across all four surfaces? Spot-check on mobile + desktop. | — | todo |

### A1 Spec — `PersonRow` API

Canonical row component. One file: `components/people/PersonRow.tsx`. Lives next to the action resolver (`lib/personActions.ts`, A3) so the surface-level component and the action logic stay co-discoverable.

#### Variants

| Variant | Where used | Distinguishing render |
|---|---|---|
| `meet-attendee` | Meet detail People tab | Pets row prominent (dog avatar + name); actions on right |
| `group-member` | Group detail Members tab | Optional admin badge; actions on right |
| `inbox-conversation` | Inbox conversation list | Message-preview slot + timeAgo + unread dot; **no actions** (row click is the affordance) |
| `default` | Anything else | Identity + connection pill + actions |

#### Props

```ts
type PersonRowProps = {
  // Identity
  userId: string;
  name: string;
  avatarUrl?: string;            // falls back to <DefaultAvatar name={name} />
  isSelf?: boolean;              // suppresses actions, shows "(you)" suffix on name

  // Variant
  variant: "meet-attendee" | "group-member" | "inbox-conversation" | "default";

  // Pets — owner-keyed (internal lookup via getDogImageByOwnerAndName(userId, name))
  pets?: { name: string; breed?: string }[];

  // Relationship — drives the action matrix and the connection pill
  connectionState: ConnectionState;       // "none" | "familiar" | "pending" | "connected"
  theyMarkedFamiliar?: boolean;
  profileOpen?: boolean;

  // Variant-specific extras
  contextLine?: string;          // e.g. "Joining Saturday's walk", "Last seen 2h ago"
  isAdmin?: boolean;             // group-member only
  messagePreview?: string;       // inbox-conversation only
  timeAgo?: string;              // inbox-conversation only
  unreadDot?: boolean;           // inbox-conversation only

  // Actions
  actions?: PersonAction[] | "auto";   // default "auto" → resolvePersonActions(...)
  // "auto" calls resolvePersonActions(viewerId, { userId, connectionState, theyMarkedFamiliar, profileOpen }).
  // Override path is for surfaces that need a custom action (e.g. PostMeetReviewSheet's
  // Familiar/Connect/Skip triplet during the make-connections step) — but those should
  // still match the matrix's *language*; only the action set differs.

  // Selection mode (E3/E4 — Select-mode in browse surfaces)
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;

  // Navigation
  href?: string;                 // default `/profile/${userId}`; inbox variant uses `/profile/${userId}?tab=chat`
  onClick?: () => void;          // overrides href if provided
};

type PersonAction =
  | { kind: "connect"; primary: true; onClick: () => void }
  | { kind: "familiar"; state: "off" | "on"; primary: false; onClick: () => void }
  | { kind: "message"; primary: true; onClick: () => void };
```

#### Pets — internal lookup, not external refs

Caller passes `{ name, breed? }` only. Component calls `getDogImageByOwnerAndName(userId, pet.name)` itself. If the lookup fails, the row falls back to **no dog avatar** (still renders the dog name in the pets row). This matches the existing `CardMeet` pattern where missing dog photos degrade gracefully.

Reasoning: callers shouldn't have to thread the lookup. They already have `userId` on the row; the component owns its rendering concerns.

#### Connection-state pill — render rule

Pill renders next to the name when `connectionState !== "none"` AND `!isSelf`. Pill text and tone:

| State | Pill text | Token |
|---|---|---|
| `connected` | "Connected" | `brand-subtle` bg / `brand-strong` text |
| `familiar` (outbound, I marked them) | "Familiar ✓" | `surface-inset` bg / `fg-secondary` text — soft confirmation |
| `pending` | "Pending" | `surface-inset` bg / `fg-secondary` text |
| `none` + `theyMarkedFamiliar: true` | **No pill** | (post-D2 the row gets bumped to tier 2, but per the deniability guardrail the pill must NOT signal "they marked you" — render no pill, let the actionable card itself be the signal) |
| `none` + `profileOpen: true` | **No pill** | (open profiles need no badge; visibility is implicit) |

#### Action area — variant rules

| Variant | Action area |
|---|---|
| `meet-attendee` | Actions resolved from matrix; rendered as right-aligned button group (max 2 visible — Connect + Familiar OR Familiar alone OR Message) |
| `group-member` | Same as meet-attendee |
| `inbox-conversation` | **No action buttons.** Row click → `/profile/[userId]?tab=chat`. Connection-state pill rendered small, inline with name |
| `default` | Same as meet-attendee |

When `selectMode === true`, the action area is replaced with a checkbox regardless of variant.

#### Layout — single CSS class with variant modifiers

`.person-row` (base) + `.person-row--meet-attendee`, `.person-row--group-member`, `.person-row--inbox-conversation`, `.person-row--default`. Reuses `.avatar`, `.chip`, and `ButtonAction` primitives. No inline styles.

#### Out of scope for A1

- Bulk-action footer (E2/E3/E4) — separate component, lives next to PersonRow but isn't part of the row itself.
- Trust signals beyond the connection-state pill (mutual connections, shared meets count) — stay on the profile page; the row is identity + relationship + actions only.
- Self-styled "you" row — for variants where the viewer appears in their own list (post-meet review attendees, group members). Render the row with `isSelf: true`, suppress actions, append "(you)" to the name. No avatar swap, no special background.

---

## Workstream B — Action matrix on profile surfaces

The matrix isn't only for list rows. The user's *own* profile view of someone else's profile page should follow the same logic for primary CTAs.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Audit profile page CTAs (`app/profile/[userId]/page.tsx`) — current state of Connect / Familiar / Message buttons, gating. | [[Trust & Connection Model]] | done |
| B2 | Apply the matrix to profile-page primary actions. Use `resolvePersonActions` from A3. **Done 2026-04-27.** Profile-page CTA block (around line 191) now renders via `resolvePersonActions`. Self-check added (no CTAs render when `userId === currentUserId`). Pending kept as a special case ("Request sent" disabled) since the matrix returns []. Connected → Message + Book care (when `hasCare`); Familiar (outbound) → Familiar ✓ + Connect when reciprocate/open; None + signal → Connect + Familiar; locked-locked → Familiar only. md-size CTAs preserved. TypeScript clean. | — | done |
| B3 | Audit any connections list / followers list / similar surfaces that render a list of people the viewer might act on. Catch surfaces missed by the meet-detail-focused inventory. **Done 2026-04-27.** Audit run via `getConnectionsByState`/`getCommunityCarers`/`connectionState` grep. Two surfaces touched outside the workstream-A inventory: `components/discover/CareTab.tsx` (CommunityCarersSection — Connected-only provider list, links to profile, no relationship CTAs on rows; no migration needed) and `components/explore/TrustGateBanner.tsx` (gates with state-specific messaging — copy is directionally correct, describes the viewer's own actions, no deniability violations). No action needed on either. | — | done |

---

## Workstream C — Photos gate (meet detail)

Photos on the meet detail page should follow the visibility rules the rest of the app uses. Currently the section renders unconditionally when photos exist.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | **RESOLVED 2026-04-27.** Differential gate, anchored to the existing context-gate model in `Content Visibility Model.md`. **Rules:** Open group + `public` meet → full gallery (already publicly browsable). Open group + `group_only` meet → 1 hero photo + "Join [Group] to see all" tease for non-members. Private/approval group (forced `group_only`) → no photos, no tease. Standalone meet (no group) → attendees only. **Why 1 photo not 2:** the tease should read as invitation, not content tour — one hero shot + the join CTA is the right ratio. **No special rule for care groups** — group visibility setting decides. **Edge cases:** zero-photo meets render the existing placeholder (no "Join to see all" with nothing behind it); upcoming meets always show placeholder regardless of viewer. | [[Content Visibility Model]] | resolved |
| C2 | Implement the C1-resolved gate in `app/meets/[id]/page.tsx` Photos section (around line 1001). The "viewer is member of the meet's parent group" check likely warrants a small helper in `lib/meetVisibility.ts` (or co-located if there's only one callsite). **Done 2026-04-27.** Gate logic inlined as an IIFE in the Photos section — single callsite, no helper module needed yet. Resolves to `"full"` / `"tease"` / `"none"` per the C1 rules. Tease render: 1 hero photo (16:9) + a quiet "Join [Group] to see all N photos" link below — invitation framing, not paywall. TypeScript clean. | — | done |
| C3 | Update `Content Visibility Model.md` Section 1 (Meet-attached content) with the C1 tease rule — the doc is currently silent on the partial-disclosure case. Single new row in the table + a short paragraph on the rationale. **Done 2026-04-27.** Section 1 table reshaped to include `Meet visibility` column; tease row added; standalone-meet row clarified. Paragraph added below the table explaining why the tease is bounded to open groups + 1 photo. `last-reviewed` bumped. | [[Content Visibility Model]] | done |

---

## Workstream D — Familiar copy + tier-logic audit (was P19)

Sweep every surface that mentions Familiar — the post-meet review sheet had it described backwards (said "unlocks more of THEIR profile" — actually grants THEM access to YOURS). Fixed there 2026-04-26; rest unchecked.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Grep + audit every surface that uses the word "Familiar" or references the connection state. Surfaces include: meet detail "Who's coming," ParticipantList, organiser card, profile pages, connection rows, onboarding, post-meet review (already fixed). For each: confirm the directional copy is correct (Familiar = outbound, grants THEM visibility into YOU). **Done 2026-04-27.** Audit run via subagent across 21 candidate files. Findings: PostMeetReviewSheet copy correct; signup/visibility copy correct; HowItWorksTabs correct; CardExploreResult pill-only is neutral. **Three deniability violations found** (handled in D3): `lib/relationshipContext.ts:41` ("Wants to connect" signal — cause-revealing), `components/messaging/RelationshipBanner.tsx:21` ("is marked as Familiar" — directionally ambiguous), `components/ui/ConnectionIcon.tsx:34-45` (distinct Eye vs Check icons per direction — visual cause-reveal). | [[Trust & Connection Model]] | done |
| D2 | **RESOLVED 2026-04-27 — code is wrong, doc is right.** `getAttendeeTier` (`lib/meetUtils.ts:222-233`) bumps on outbound Familiar (`state === "familiar"`) but not on inbound (`theyMarkedFamiliar: true`). Strategy doc says "either direction" → Tier 2; that's the correct behavior. **Privacy is preserved by deniability about the cause, not by absence of effect.** When a receiver sees someone bumped to Tier 2, multiple actions could explain it: a bulk Familiar mark, a profile-visibility toggle, the marker opening their profile generally — the receiver cannot infer "they specifically thought about me." This deniability is what makes the system silent in the way that matters. **Implementation:** add `\|\| conn?.theyMarkedFamiliar` to the Tier 2 branch. **Critical guardrail for D3:** no UI surface may explain WHY a card got promoted (e.g. tooltip "they marked you Familiar" — would break deniability). Surface contextual signals like "you were both at last week's walk" instead. | [[Trust & Connection Model]] | done (decision); todo (impl in D3) |
| D3 | Apply D1 fixes across the codebase + implement D2 decision in `lib/meetUtils.ts` (add `theyMarkedFamiliar` to Tier 2 branch). **Plus:** audit every tier/relationship copy surface (tooltips, helper text, sub-labels on cards, badge tooltips) for anything that reveals WHY a person is at a given tier. Replace cause-revealing copy with contextual signals. **`ConnectionIcon` audit (from D2 follow-on):** the icon currently varies based on `theyMarkedFamiliar` (passed at `ParticipantCard.tsx:80`, possibly elsewhere). A per-row visual signal that "they marked you Familiar" risks reading as cause-revealing — collapse the inbound-Familiar icon variant into the same render as Open / general tier-2 visibility. Fewer states, cleaner rule. **Done 2026-04-27.** D2 implementation: `getAttendeeTier` (`lib/meetUtils.ts:222-236`) now bumps to tier 2 on `conn?.theyMarkedFamiliar` in addition to outbound `state === "familiar"` — the inbound case grants the viewer visibility, so propagating that to the tier resolution is correct. Doc-comment updated to note the deniability guardrail lives in consumers (PersonRow pill + ConnectionIcon collapse). D1 fixes: the "Wants to connect" signal in `lib/relationshipContext.ts` removed (replaced with a comment explaining why); RelationshipBanner reframed from "is marked as Familiar" to "You've marked X as Familiar" (describing one's own action is fine — the guardrail only applies to revealing OTHER people's actions). ConnectionIcon collapsed: `familiar_them` config removed, `theyMarkedFamiliar` parameter dropped from the API; familiar/pending now share the same Check + "Familiar" rendering. Profile page updated to drop the now-no-op prop. TypeScript clean, ESLint clean, matrix verifier still passes 11/11. | — | done |

---

## Workstream E — Bulk Familiar action

Marking 6 attendees Familiar one by one is friction. The post-meet review sheet is the natural primary surface (it already walks attendees); the People tab + group member list get the same affordance.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | **RESOLVED 2026-04-27.** Per-card quiet Familiar toggle + "Mark all" header CTA. **Rules:** "Mark all" targets tier-1/2 only (skip tier-3 — Familiar doesn't apply when locked-to-you). After "Mark all" fires, soft inline confirmation near the header ("✓ 6 marked Familiar"), no toast. Per-card toggle stays live — bulk action is a starting position, not a commitment; individual unchecks remain possible. **Visual:** small "Familiar" pill, outlined when off, filled `brand-subtle` when on — reuse the existing `neutral` ↔ `brand-subtle` toggle vocabulary documented in `design-system.md` (no new pattern). | [[meets]] | resolved |
| E2 | Implement bulk Familiar in `PostMeetReviewSheet.tsx` per the E1-resolved spec. **Done 2026-04-27.** Two parts: (1) the existing "Mark everyone familiar" CTA now correctly skips attendees where Familiar isn't applicable per the matrix (`familiarApplicable` set — added in A7), drops Connected/already-Familiar/Pending. (2) Soft inline confirmation `✓ N marked Familiar` shows once the button hides (no more unmarked). Counts only Familiar marks within the actionable set. Visual polish on the per-card pill (align to `neutral`/`brand-subtle` toggle vocabulary) deferred — current `ActionPill` component is shape-correct, vocab tweak isn't blocking. | — | done |
| E3 | Add bulk-select mode to the meet detail People tab (`PersonRow` gains a `selectMode` variant). **No "Mark all" header here** — that's a post-meet ritual, not an everyday browse affordance. Pattern: tap "Select" in the section header → checkboxes appear → batch action footer. **Deferred — stretch goal per phase acceptance criteria.** PersonRow already supports `selectMode`/`selected`/`onToggleSelect` props (added in A2); the wiring at the People tab + section header + batch footer remains. Better tackled with eyes-on-running-app context than at the end of a long implementation session. | — | deferred |
| E4 | Add bulk-select mode to the group detail Members tab — same Select-mode pattern as E3. **Deferred — same reasoning as E3.** | — | deferred |

---

## Workstream F — Explanatory copy

The trust model is unusual enough that a helper line earns its keep on the surface where users first encounter the gating.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Write a one-screen explainer for the post-meet review sheet — what marking Familiar does, what happens next, why locked-locked rows have only the Familiar option. Plain language, not jargon. Decide where it lives (between welcome and Make Connections step? Inline as a "What is Familiar?" expandable?). **Done 2026-04-27 — judged sufficient with existing copy.** PostMeetReviewSheet already carries a directionally-correct paragraph: "Marking someone Familiar opens up part of your profile to them and lets them message you — they won't be notified. Choose Connect to send them a connection request." Adding a "why locked-locked shows only Familiar" line over-explains the model — the user just sees the buttons available; the model is implicit in what's surfaced. If testing shows confusion, revisit. | [[Trust & Connection Model]] | done |
| F2 | Write a quieter helper line for the People tab — single-line, dismissible, surfaces near the top of the list. **Deferred.** Not blocking the phase. The trust model on the People tab reads as "tap to mark Familiar / send Connect" without commentary. If post-test feedback says users don't understand why some rows show only Familiar and others show both, add a one-liner then. Stretch goal — better with eyes on the running app. | — | deferred |
| F3 | Verify all explanatory copy passes the directional sanity check from D1. **Done 2026-04-27 — covered by D1 audit.** All Familiar copy across the codebase is directionally correct (PostMeetReviewSheet + signup/visibility correct; HowItWorksTabs neutral; "Wants to connect" cause-revealing string removed; ConnectionIcon collapsed to single rendering). | — | done |

---

## Acceptance Criteria

- [x] All four in-scope surfaces render people via the trust action logic. **Caveat:** Meet People tab (A4), Group Members tab (A5), and Inbox (A6) use `PersonRow` per the original spec. Post-meet review (A7) diverged to a custom owner-forward + section-aware + footer-evolution layout (see A7 status). Both patterns share the same matrix (`resolvePersonActions`) and copy vocabulary; visual unification is tracked in **P27** (cascade owner+dog pattern) and **P29** (soft Familiar indicator).
- [x] The action matrix (v3) is enforced consistently: locked viewers see only Familiar until they've marked it (Familiar gates Connect); Familiar ✓ shows after marking; Connect appears when subject is visible to viewer; open viewers get Connect only.
- [x] No surface shows "connected since [date]" — line removed during A4.
- [x] Pets render on meet-attendee rows (dog avatar + name).
- [x] Tier visibility rules applied uniformly — tier 3 never surfaced by name (meet detail summary, People tab, post-meet review all match).
- [x] Photos section on meet detail follows the C1-resolved differential gate (1-photo tease for non-members; full for members; no photos when group is private).
- [x] Every Familiar reference is directionally correct (D1 audit + D3 fixes — `relationshipContext.ts`, `RelationshipBanner`, `ConnectionIcon` collapsed to single render).
- [x] Bulk Familiar works in the post-meet review (E2). E3/E4 deferred per stretch criteria.
- [x] Explanatory copy in the post-meet review sheet — profile-state-aware (locked vs open) plus inline action labels.
- [x] `Trust & Connection Model.md` and `Content Visibility Model.md` updated.
- [x] `design-system.md` updated with `PersonRow` entry.

**Known divergences / follow-ons** (not blockers — phase ready to close):

- **P27** — cascade the owner+dog avatar pattern (and section-aware layout where it fits) from the post-meet review to PersonRow. Post-meet went owner-forward; PersonRow consumers (meet People tab, group Members, profile pages) still use the original dog-forward / single-row pattern from A2.
- **P28** — `MeetAttendee.profileOpen` doesn't auto-derive from `UserProfile.profileVisibility` (caught us out on `meet-reactive-spring`). Helper or codified pattern needed for future mock seeding.
- **P29** — soft Familiar indicator across the app on people the viewer has marked. Pairs naturally with P27.
- **A8** — visual + interaction review pass on a real device. Best done with eyes-on-running-app.

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/` (especially `meets.md`)
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — move phase out of Current Phase
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark `status: archived`, then delete original from `phases/`)
- [ ] **Structural audit:**
  - Any files in `docs/phases/` with `status: archived` or `status: complete`? Delete them.
  - Any filename duplicated between `docs/phases/` and `docs/archive/phases/`? Delete the live copy.
  - Any docs in `strategy/`, `features/`, `implementation/` with `last-reviewed` older than 21 days? Review or bump.
  - Any dead references in `README.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md` to files that no longer exist? Fix.
- [ ] Check next phase scope for conflicts with what was just built

---

## Cross-chat coordination — closed

The original parallel chat closed 2026-04-27 after Workstreams A1–A6, B, C, D, E2, F1, F3 landed. Subsequent matrix + post-meet review changes (Familiar gates Connect, owner-forward avatar pattern, section-aware card structure) were made from the Meets Deep Pass walkthrough chat with change reports filed in `phases/punch-list.md`. No active cross-chat coordination needed.

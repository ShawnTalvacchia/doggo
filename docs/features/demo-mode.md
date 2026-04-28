---
category: feature
status: built
last-reviewed: 2026-04-26
tags: [demo, persona-switching, testing, infrastructure]
review-trigger: "when adding a new persona, when changing persona-switching surfaces, when wiring per-persona mock data"
---

# Demo Mode — Persona Switching

Runtime persona switcher that lets reviewers and testers view the prototype as any of six personas without rebuilding or editing source. **Demo-only infrastructure** — none of these surfaces would ship in the real product.

Implementation lives behind one rule: **product code reads `useCurrentUser()`**, never `mockUser` directly. The hook resolves to the active persona; switching is a one-click affordance.

---

## What's in scope

This is the *plumbing* — context, hook, switcher UI, URL params. Per-persona content (Daniel's thin connections, Klára's provider dashboard, Tomáš's care bookings) is curated separately during **Mock World Building**.

What this phase shipped:

1. A current-user context that any component can read via hook.
2. A persona registry with five real journey users + one synthetic empty-user persona.
3. Three switcher surfaces (profile-page name dropdown, `/demo` route, `?as=...` URL param).
4. A C-sweep migrating ~30 callsites from hardcoded `"shawn"` to the hook.

What it didn't ship — see "Known limitations" below.

---

## Persona registry

**File:** `lib/personas.ts`

Six personas, ordered for the picker:

| ID | Name | Archetype | Source |
|----|------|-----------|--------|
| `shawn` | Shawn Talvacchia | Default | `lib/mockUser.ts` |
| `tereza` | Tereza Nováková | Routine Owner / Connector | `lib/mockUsers.ts` |
| `daniel` | Daniel Procházka | Anxious New Owner | `lib/mockUsers.ts` |
| `klara` | Klára Horáčková | Professional Provider | `lib/mockUsers.ts` |
| `tomas` | Tomáš Kovář | Busy Professional | `lib/mockUsers.ts` |
| `new-user` | New User | Just signed up | `lib/personas.ts` (synthetic) |

Each entry pairs a `UserProfile` with `archetype` + `tagline` framing copy. The `new-user` persona is defined inline in `personas.ts` — empty `pets[]`, blank bio, no `carerProfile`, generic SVG avatar, locked profile visibility, `tagApproval: "approve"`.

**Helpers:**
- `getPersona(userId): PersonaOption | undefined` — registry lookup by ID
- `defaultPersona` — Shawn (the canonical signed-in user)
- `isNewUser(userId): boolean` — predicate for empty-state gating
- `NEW_USER_ID = "new-user"` — exported for code paths that need to compare directly

---

## Reading the current user

**Files:** `contexts/CurrentUserContext.tsx`, `hooks/useCurrentUser.ts`

```tsx
import { useCurrentUser, useCurrentUserId, useIsNewUser } from "@/hooks/useCurrentUser";

const user = useCurrentUser();          // → UserProfile
const id = useCurrentUserId();          // → string (shorthand)
const onboarding = useIsNewUser();      // → true iff currentUser.id === "new-user"
```

Use these in any component that needs persona-aware data. Don't import `mockUser` directly — that pattern is reserved for the persona registry itself.

**SSR fallback:** server-render and first paint resolve to Shawn. The provider's `useEffect` hydrates from `localStorage` on mount. There's a brief flash of Shawn-content during hydration when a non-default persona is active — accepted limitation.

**For switcher / picker code** (writes the active persona), use `useDemoState()` from `@/contexts/CurrentUserContext`:

```tsx
const { user, isDefault, setUserById, resetToDefault } = useDemoState();
```

---

## Switcher surfaces

### 1. Profile-page name dropdown (primary)

**File:** `components/profile/ProfileNameDropdown.tsx`

The user's name on `/profile` is itself the dropdown trigger — `text-2xl` heading + small caret. Tap → 280px popover anchored below, listing the 6 personas with avatars, archetypes, and a checkmark on the active one. Footer links to `/demo` for the bigger surface.

Picking a persona writes to `localStorage` via `setUserById`, then calls `router.refresh()` so the profile page re-renders for the picked persona in place. Outside-click + Escape close the popover.

**Demo-only.** Wouldn't ship in the real product — name as dropdown trigger is a "switch which persona I am" affordance, which has no equivalent in normal use.

### 2. `/demo` route (alternate / shareable)

**Files:** `app/demo/page.tsx`, `app/demo/demo.css`

Standalone picker — no AppNav, no sidebar, no bottom nav (added to `GuestLayout`'s `isStandaloneRoute` list). Six persona cards with avatar, name, archetype, tagline, neighbourhood, dog summary. Active persona shows "Active" pill; others show "Enter →".

Picking writes to localStorage and routes to `/home` so the data swap is immediately visible.

**Why it exists alongside the dropdown:** the route survives any future landing-page redesign and is shareable as a URL — Slack a tester `…/demo` and they're in the picker. The dropdown is the convenient in-app switcher; `/demo` is the canonical entry surface.

### 3. `?as=<personaId>` URL param (preview, non-persistent)

Implemented in `useCurrentUser` via `useSearchParams`. Adding `?as=daniel` to any URL renders that page as Daniel without writing to localStorage. Removing the param (or navigating away) reverts to whatever the context state is.

Use cases:
- "What does this profile page look like to Tomáš?" → `/profile/tereza?as=tomas`
- "What does the home feed look like for a brand-new user?" → `/home?as=new-user`
- "What does this group page look like to a non-member?" → `/communities/svc-klara-training?as=daniel`

The override applies per-render and per-URL only — no global state mutation.

---

## How "new user" empty state works

Originally scoped as a separate `newUserMode: boolean` toggle on the context (with a `?new=1` URL param). **Revised mid-phase** to a regular persona option for cleaner mental model — the picker has 6 entries, not 5 + a checkbox.

Empty state is now expressed as `currentUser.id === "new-user"`. Surfaces that need to gate on it call `useIsNewUser()`. Currently:

- `app/home/page.tsx` — switches to `getNewUserFeed()` (no connections, no completed meets, welcome state) when `useIsNewUser()` is true.
- Other surfaces inherit the empty state naturally because the new-user persona has empty `pets[]`, no group memberships, etc. — `getUserGroups("new-user")` returns `[]`, so the home Groups tab shows "no groups joined", `MeetComposer` hits its no-groups empty branch, and so on.

Data-gap surfaces (e.g., Inbox is empty as new-user because mock conversations are Shawn-relative) are intentional empty-state previews, not bugs.

---

## What "the C-sweep" migrated

~25 callsites moved from hardcoded `"shawn"` to `useCurrentUserId()` / `useCurrentUser()`. Three patterns:

**Pattern 1 — `CURRENT_USER` constants** (8 files):
- `app/schedule/page.tsx`, `app/bookings/page.tsx`, `app/bookings/[bookingId]/page.tsx`
- `app/inbox/page.tsx`, `app/inbox/[conversationId]/page.tsx`, `app/inbox/[conversationId]/ThreadClient.tsx`
- `components/schedule/ScheduleCard.tsx`, `components/schedule/SessionRow.tsx`, `components/schedule/SessionDetailContent.tsx`
- `components/activity/MyScheduleTab.tsx`, `components/activity/ServicesTab.tsx`
- `components/meets/PostMeetReviewSheet.tsx`

**Pattern 2 — inline `"shawn"` literals** (~12 files):
- `app/communities/[id]/page.tsx`, `app/meets/[id]/page.tsx`, `app/profile/page.tsx`, `app/profile/[userId]/page.tsx`
- `app/discover/meets/page.tsx`, `app/discover/groups/page.tsx`, `app/posts/create/page.tsx`, `app/connect/[code]/page.tsx`, `app/home/page.tsx`
- `components/groups/GroupDetailPanel.tsx`, `components/messaging/RelationshipBanner.tsx`, `components/explore/CardExploreResult.tsx`
- `components/posts/PawReaction.tsx`, `components/posts/PostComposer.tsx`, `components/posts/TagAutocomplete.tsx`
- `components/feed/FeedCard.tsx`, `components/meets/CardMeet.tsx`, `components/meets/ParticipantList.tsx`, `components/meets/MeetComposer.tsx`
- `components/home/DogsNearYou.tsx`
- `contexts/ConversationsContext.tsx`

**Pattern 3 — helper defaults** (1 file):
- `lib/meetUtils.ts` — `getAttendeeTier(a, currentUserId)` and `getKnownAttendees(attendees, currentUserId)` now require the user ID, no default. Decision rationale: silent defaults are bug magnets in a runtime-switching world.

**Mock-data seeds** in `lib/mock*.ts` correctly excluded — `userId: "shawn"` in seed data is the *content*, not a "current user" reference.

---

## Connection state — viewer-aware

`getConnectionState(userId, viewerId = "shawn")` in `lib/mockConnections.ts` now takes a viewer parameter. For `viewerId !== "shawn"`, returns `undefined`.

**Why:** `mockConnections.ts` is currently populated only from Shawn's perspective. Until **Mock World Building** seeds per-persona connection rosters, non-Shawn personas see no connection pills (everyone is tier-3 / "no connection"). That keeps the persona-switched view *safe* (no fabricated relationships) but means the empty-state will be common in non-Shawn views.

The `viewerId = "shawn"` default is intentional — pre-existing callers who don't yet pass through a `viewerId` keep working. New code should always pass the active persona's ID explicitly.

---

## Known limitations (will fill during Mock World Building)

These are expected — not bugs. Surface them in a closing-summary so the next phase knows what to backfill.

1. **Connections are Shawn-only.** `mockConnections.ts` has Shawn's view of each user; non-Shawn personas see no connection pills, no Familiar/Connected badges, no shared-groups counts. Feed surfaces that lean on connection state (e.g., "Tereza is joining" social proof) fall back to dog-first copy or render empty.

2. **Conversations are Shawn-only.** `mockConversations.ts` threads have Shawn as one of the two parties. Non-Shawn personas see an empty inbox until per-persona threads are seeded.

3. **Posts are mostly Shawn-authored.** The home feed, community feeds, and profile Posts tab feel sparse for non-Shawn personas. Mock World Building will broaden authorship.

4. **Share codes only on Shawn.** The Share Profile button now renders for every persona (it falls back to `user.id` as the slug if no `shareCode` is set), but real codes — `tereza-r4m2`, `klara-p3n8`, etc. — would feel more authentic.

5. **Profile-page edit state doesn't persist across persona swaps.** Local state in `app/profile/page.tsx` resets on persona change (via `useEffect` watching `currentUser.id`). Real product would persist edits per-user; the prototype just resets.

6. **SSR briefly flashes Shawn content.** First paint always renders as Shawn; localStorage hydrates on mount. ~50ms flicker when the active persona is non-default. Accepted.

---

## Cleanup pending

These files are stubs flagged for manual deletion (sandbox `rm` blocked, interactive permission tool unavailable in agent mode). See `docs/phases/punch-list.md` P17:

- `lib/mockUserState.ts` — superseded by `useIsNewUser()`
- `components/layout/PersonaBanner.tsx` — superseded by `ProfileNameDropdown` + `?as=` URL param
- `components/profile/ChangeUserMenu.tsx` — superseded by `ProfileNameDropdown`
- `A2-A3-HANDOFF.md` (repo root) — fully merged 2026-04-24 handoff note

All four are reduced to `export {};` with deprecation comments pointing at the replacement, so leaving them in place doesn't cause runtime issues.

---

## Related docs

- `docs/strategy/User Archetypes.md` — behavioural profiles each persona maps to
- `docs/implementation/mock-data-plan.md` — Mock World Building scope (per-persona content)
- `docs/strategy/Open Questions & Assumptions Log.md` §10 — closed by this phase; see for original framing
- `docs/archive/phases/persona-wiring.md` — full phase board (workstreams, decisions, closing summary)

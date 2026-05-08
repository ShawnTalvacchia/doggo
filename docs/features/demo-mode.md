---
category: feature
status: built
last-reviewed: 2026-05-08
tags: [demo, persona-switching, testing, infrastructure]
review-trigger: "when adding a new persona, when changing persona-switching surfaces, when wiring per-persona mock data"
---

# Demo Mode — Persona Switching

Runtime persona switcher that lets reviewers and testers view the prototype as any of five personas without rebuilding or editing source. **Demo-only infrastructure** — none of these surfaces would ship in the real product.

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

Five personas, ordered for the picker:

| ID | Name | Archetype | Source |
|----|------|-----------|--------|
| `tereza` | Tereza Nováková | Routine Owner / Connector (default) | `lib/mockUsers.ts` |
| `daniel` | Daniel Procházka | Anxious New Owner | `lib/mockUsers.ts` |
| `klara` | Klára Horáčková | Professional Provider | `lib/mockUsers.ts` |
| `tomas` | Tomáš Kovář | Busy Professional | `lib/mockUsers.ts` |
| `new-user` | New User | Just signed up | `lib/personas.ts` (synthetic) |

Shawn was removed from the picker 2026-04-26 — the actual developer's name shouldn't double as a demo character. He still exists in mock-world data as a Vinohrady regular other personas encounter; he's just no longer a "view as" option.

Each entry pairs a `UserProfile` with `archetype` + `tagline` framing copy. The `new-user` persona is defined inline in `personas.ts` — empty `pets[]`, blank bio, no `carerProfile`, generic SVG avatar, locked profile visibility, `tagApproval: "approve"`.

**Tereza is a dual-role persona** (Sessions & Service Execution, 2026-05-08). She's both an owner (Olga walks Franta — recurring Tue/Thu, ongoing, `booking-olga-tereza`) and a carer (sits + walks Marek's Benny). On `/bookings`, this triggers the dual-tab UI (My Care + My Services) on the default persona without any `?as=` URL trickery. Reinforces the narrative that even active community members are sometimes on the receiving end of care — and demonstrates the cross-side surface naturally.

**Helpers:**
- `getPersona(userId): PersonaOption | undefined` — registry lookup by ID
- `defaultPersona` — Tereza (the canonical default)
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

**SSR fallback:** server-render and first paint resolve to Tereza (the default persona). The provider's `useEffect` hydrates from `localStorage` on mount. There's a brief flash of Tereza-content during hydration when a non-default persona is active — accepted limitation.

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

**Sticky `?as=` (Pricing & Proposals, 2026-05-05).** The override now mirrors to `sessionStorage["doggo-as-preview"]` so it survives route changes within a tab — matters for directory-only personas (Petra, Shawn, Nikola) you can't reach from the picker. Picker actions clear the sessionStorage and strip the URL param via custom event so a deliberate persona switch wins over a stuck preview.

---

## Reset behavior

The `/demo` route and the profile-name dropdown both expose a "Reset demo state" action. Reset wipes:

1. **localStorage** — all `doggo*` keys (`doggo-bookings`, `doggo-conversations`, `doggo-connection-overrides`, `doggo-care-reviews`, `doggo:dismissedReviews`, `doggo-bookings-upsell-dismissed`, `doggo-viewed-reports`, `doggo-as-preview`).
2. **In-memory `usePersistedState` cache** (Sessions & Service Execution, 2026-05-08). Previous behavior cleared localStorage but left the module-level Map holding stale values until a full page reload swapped modules — leading to confusing "I reset but state didn't change" symptoms during walkthroughs. `resetPersistedState("doggo")` now broadcasts a notification so all subscribed components re-read fresh state on next render.

After reset, mock data re-seeds from the static modules (`lib/mockBookings.ts`, etc.). Mock dates use `daysAgo` / `daysFromNow` (Sessions & Service Execution, 2026-05-08) so the demo always reads as a live ongoing arrangement regardless of when a tester opens it — kd-1 through kd-5 step weekly back from today; `notif-10` is dated relative to today.

---

## Highlight reels

Per-persona "where their story reads strongest." When showing the prototype to a reviewer, drop into these surfaces in order — each one is curated to demonstrate the persona's archetype against the trust → care funnel. Use the `?as=<id>` URL param to swap personas without committing the switch to localStorage.

### Tereza — Routine Owner / Connector

The community-anchor archetype. Vinohrady regular who runs the evening walking group, knows everyone, occasionally sits for neighbours.

1. **Home feed** — `/home?as=tereza` — Vinohrady Evening Walkers + Vinohrady Morning Crew + Riegrovy posts dominate. Reads as "someone embedded in a neighbourhood."
2. **Vinohrady Evening Walkers** — `/communities/group-tereza-neighbourhood?as=tereza` — admin role, recurring evening loop, members tab shows neighbour cluster. Description in admin's voice (first-person).
3. **Profile** — `/profile?as=tereza` — Open profile, Helper-tier carer (sitting at modest rate), Open visibility, Vinohrady neighbourhood, Franta the dog.
4. **Riegrovy morning recurring meet** — `/meets/meet-1?as=tereza` — weekly Riegrovy walk she's part of (group-1 Vinohrady Morning Crew). People tab shows her connection cluster; Photos tab from completed sessions.

### Daniel — Anxious New Owner

The trust-ramp archetype. Reactive rescue, Locked profile, few connections, found his footing through one support group + one professional booking.

1. **Reactive Dog Support** — `/communities/group-reactive-dogs?as=daniel` — Eva's admin posts, Hana's gratitude post, his own posts. Members tab leans heavily Locked (intentional for support context).
2. **Profile** — `/profile?as=daniel` — Locked, sparse but coherent. Bára (rescue, reactive). Smíchov.
3. **Klára training booking** — `/bookings/booking-klara-daniel?as=daniel` — recurring Wed 10am, sessions list, the "trust → care payoff" arc.
4. **Post-meet review on a small calm meet** — `/schedule?as=daniel` History tab → tap a completed reactive-group meet (e.g. `meet-reactive-spring`) → review prompt. Demonstrates the Familiar marking flow on a privacy-sensitive meet.

### Klára — Professional Provider

The provider-deeply-embedded-in-community archetype. Trainer with her own care group, also joins park groups as regular owner.

1. **Klára's Calm Dog Sessions** — `/communities/group-klara-training?as=klara` — Care config (training category), her client community, Members tab shows mix of personas + clients, Meets tab with paid sessions (Hosting suppressed CTAs).
2. **Provider profile** — `/profile?as=klara` — Services tab with care offerings + (forthcoming) meet-type entries, Posts tab with training recaps, trust signals.
3. **Active recurring booking with sessions** — `/bookings/booking-klara-daniel?as=klara` — same booking as Daniel's view but from the provider side: session check-ins, owner-side aggregate suppressed.
4. **Training-recap post in her group** — drill into her recent group-feed post with photo (`/communities/group-klara-training?as=klara` → Feed tab). Demonstrates provider posts as social proof.

### Tomáš — Busy Professional

The utility-user archetype. Karlín commuter, Hugo the labrador, leans on care help when work runs late.

1. **Karlín Dog Neighbors** — `/communities/group-karlin-neighbours?as=tomas` — Petra's admin announcement, Filip's posts, Adéla's posts, his own light contribution.
2. **Profile** — `/profile?as=tomas` — Locked, Hugo, Karlín. Reads as low-key user who hasn't dialed up the provider switch.
3. **Petra emergency conversation** — `/inbox?as=tomas` → tap the Petra thread (`tomas-petra-conv`) — the "neighbour I trusted in a pinch" arc. Booking context (emergency sitting) shows on the row.
4. **Hugo's bookings list** — `/bookings?as=tomas` — completed Petra emergency booking + any others. Reads as trail of "care arrangements that worked."

### New User

Empty-state preview. Use to verify graceful empty states across surfaces.

- `/home?as=new-user` — `getNewUserFeed()` welcome state (no connections, no completed meets).
- `/profile?as=new-user` — empty pets, blank bio, locked.
- `/inbox?as=new-user` — empty (no conversations seeded for `new-user`).
- `/discover/groups?as=new-user` — discoverability surface for someone who hasn't joined anything yet.

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

`getConnectionState(userId, viewerId = "shawn")` in `lib/mockConnections.ts` takes a viewer parameter. The underlying `mockConnectionsByViewer` map is keyed per-persona, so each persona has their own connection roster.

**Current rosters** (seeded during Mock World Building):

| Persona | Connections |
|---------|-------------|
| Shawn | 12 |
| Tereza | 8 |
| Daniel | 5 |
| Klára | 10 |
| Tomáš | 6 |
| New User | 0 (intentional empty state) |

The `viewerId = "shawn"` default is intentional — pre-existing callers that don't yet pass through a `viewerId` keep working. New code should always pass the active persona's ID explicitly.

---

## Known limitations

Two accepted limitations remain. The pre-Mock-World-Building list of six was resolved during that phase — connections, conversations, posts, and share codes are all per-persona now. See the highlight reels above for verification surfaces.

1. **Profile-page edit state doesn't persist across persona swaps.** Local state in `app/profile/page.tsx` resets on persona change (via `useEffect` watching `currentUser.id`). Real product would persist edits per-user; the prototype just resets. Accepted.

2. **SSR briefly flashes Tereza content.** First paint always renders as Tereza (the default persona); localStorage hydrates on mount. ~50ms flicker when the active persona is non-default. Accepted.

---

## Related docs

- `docs/strategy/User Archetypes.md` — behavioural profiles each persona maps to
- `docs/implementation/mock-data-plan.md` — Mock World Building scope (per-persona content)
- `docs/strategy/Open Questions & Assumptions Log.md` §10 — closed by this phase; see for original framing
- `docs/archive/phases/persona-wiring.md` — full phase board (workstreams, decisions, closing summary)

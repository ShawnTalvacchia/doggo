---
category: feature
status: built
last-reviewed: 2026-05-17
tags: [demo, persona-switching, testing, infrastructure, narrative]
review-trigger: "when adding a new persona, when changing persona-switching surfaces, when wiring per-persona mock data, when the Demo Narrative changes"
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

Seven personas, ordered for the picker:

| ID | Name | Archetype | Source |
|----|------|-----------|--------|
| `tereza` | Tereza Nováková | Routine Owner / Connector (default) | `lib/mockUsers.ts` |
| `daniel` | Daniel Procházka | Anxious New Owner | `lib/mockUsers.ts` |
| `klara` | Klára Horáčková | Professional Provider | `lib/mockUsers.ts` |
| `tomas` | Tomáš Kovář | Busy Professional | `lib/mockUsers.ts` |
| `lena` | Lena Marešová | Marketplace Owner | `lib/mockUsers.ts` |
| `magda` | Magda Vondráková | Neighborhood Hub Member | `lib/mockUsers.ts` |
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
import { useCurrentUser, useCurrentUserId, useIsNewUser, useIsHydrated } from "@/hooks/useCurrentUser";

const user = useCurrentUser();          // → UserProfile
const id = useCurrentUserId();          // → string (shorthand)
const onboarding = useIsNewUser();      // → true iff currentUser.id === "new-user"
const isHydrated = useIsHydrated();     // → true once localStorage has hydrated on mount
```

Use these in any component that needs persona-aware data. Don't import `mockUser` directly — that pattern is reserved for the persona registry itself.

**SSR fallback:** server-render and first paint resolve to Tereza (the default persona). The provider's `useEffect` hydrates from `localStorage` on mount. There's a brief flash of Tereza-content during hydration when a non-default persona is active — accepted limitation for read-only display.

**Hydration gate for persona-identity-dependent side effects (Profiles Deep Pass C11, 2026-05-13).** Any side effect that reads `currentUserId` and acts on it (own-self redirects, audience gates, render-null branches keyed on identity) MUST gate on `useIsHydrated()`. Pre-hydration, `currentUserId` resolves to the Tereza fallback regardless of who's actually logged in — so a naive `currentUserId === userId` check false-positives any time the URL or context happens to match Tereza. Pattern:

```tsx
const isHydrated = useIsHydrated();
const isSelf = isHydrated && !isGuest && userId === currentUserId;

useEffect(() => {
  if (!isSelf) return;          // pre-hydration, isSelf is false → no false-fire
  router.replace("/profile");
}, [isSelf]);
```

First consumer: `/profile/[userId]` own-self redirect. Reusable for any future identity-dependent side effect (booking ownership checks, schedule view-mode gates, etc.).

**For switcher / picker code** (writes the active persona), use `useDemoState()` from `@/contexts/CurrentUserContext`:

```tsx
const { user, isDefault, hydrated, setUserById, resetToDefault } = useDemoState();
```

---

## Switcher surfaces

### 1. Profile-page name dropdown (primary)

**File:** `components/profile/ProfileNameDropdown.tsx`

The user's name on `/profile` is itself the dropdown trigger — `text-2xl` heading + small caret. Tap → 280px popover anchored below, listing the 7 personas with avatars, archetypes, and a checkmark on the active one. Footer links to `/demo` for the bigger surface.

Picking a persona writes to `localStorage` via `setUserById`, then calls `router.refresh()` so the profile page re-renders for the picked persona in place. Outside-click + Escape close the popover.

**Demo-only.** Wouldn't ship in the real product — name as dropdown trigger is a "switch which persona I am" affordance, which has no equivalent in normal use.

### 2. `/demo` route (the demo front door)

**Files:** `app/demo/page.tsx`, `app/demo/demo.css`

Standalone page — no AppNav, no sidebar, no bottom nav (added to `GuestLayout`'s `isStandaloneRoute` list). **Rebuilt 2026-05-17** (Demo Narrative & Personas — de-bloat). Two sections:

1. **Guided story** — the four-beat demo narrative (see [[strategy/Demo Narrative]]) as a manually-followed path. Four numbered beat cards (Daniel → Klára → Magda → Lena), each with the persona avatar, time-of-day, a one-line situational context, a **"Do:"** action line, and a **"Start beat N as {Name}"** button that sets the persona and routes to that beat's opening surface. The tester walks the beat's steps freely, then returns to `/demo` for the next beat. This is the **manual stand-in** for the auto-switching Guided Walkthrough — that's a follow-on build phase (spec: "Guided Walkthrough — UX design spec" below).
2. **Or explore freely** — flat persona pills (all 7 personas) for free Open View exploration. Picking writes to localStorage and routes to `/home`.

**What was removed in the rebuild:** the prior "Guided journeys" section — three scenario cards whose "Walk me through it" button launched the single-persona Tereza `TourOverlay`. That tour is superseded by the four-beat narrative; the scenario cards also duplicated personas already in the pills row. The page is now one clean front door.

**Why it exists alongside the dropdown:** the route survives any future landing-page redesign and is shareable as a URL — Slack a tester `…/demo` and they're in. The dropdown is the convenient in-app switcher; `/demo` is the canonical entry surface.

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
3. **Local component state** via a full `window.location.reload()` (Cross-Cutting Flow Testing, 2026-05-11). Earlier reset used `router.refresh()` — it re-fetches server data but doesn't unmount client components, so any in-component state that isn't persisted (e.g. the About-tab visibility toggle's `setUser` update, edit-mode draft state, transient UI flags) stayed stale until the user manually refreshed. Hard reload solves it deterministically; reset is rare and a "clean slate" gesture, so the brief blank-flash is the right tradeoff.

After reset, mock data re-seeds from the static modules (`lib/mockBookings.ts`, etc.). Mock dates use `daysAgo` / `daysFromNow` (Sessions & Service Execution, 2026-05-08) so the demo always reads as a live ongoing arrangement regardless of when a tester opens it — kd-1 through kd-5 step weekly back from today; `notif-10` is dated relative to today.

---

## Highlight reels

Per-persona "where their story reads strongest." When showing the prototype to a reviewer, drop into these surfaces in order — each one is curated to demonstrate the persona's archetype against the trust → care funnel. Use the `?as=<id>` URL param to swap personas without committing the switch to localStorage.

### Tereza — Routine Owner / Connector

The community-anchor archetype. Vinohrady regular who runs the evening walking group, knows everyone, occasionally sits for neighbours.

1. **Home feed** — `/home?as=tereza` — Vinohrady Evening Walkers + Vinohrady Morning Crew + Riegrovy posts dominate. Reads as "someone embedded in a neighbourhood."
2. **Vinohrady Evening Walkers** — `/communities/group-tereza-neighbourhood?as=tereza` — admin role, recurring evening loop, members tab shows neighbour cluster. Description in admin's voice (first-person).
3. **Profile** — `/profile?as=tereza` — Open profile, Carer with circle audience (`publicProfile: false` — sitting at modest rate for Connected viewers only), Vinohrady neighbourhood, Franta the dog.
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

### Magda — Neighborhood Hub Member

The narrow-and-deep archetype. Holešovice resident, anchors a tight private neighbour group of 6 (will grow to ~12 as we keep seeding), barely turns the carer dial. Open profile — socially comfortable. Carries Beat 3 of the demo narrative — see [[strategy/Demo Narrative]].

1. **Holešovice Dog Block** — `/communities/group-holesovice-block?as=magda` — admin role, private neighbour group, the *Find Your People* door of Three Ways In. Members tab shows the Holešovice cluster (Veronika + Eva + Martin + Filip + Hana).
2. **Profile** — `/profile?as=magda` — Open, Žofka the Schnauzer mix, Holešovice. Reads as "settled neighbour, not looking for more, plenty of community already."
3. **Klára's training meet (the anchor)** — `/meets/meet-care-1?as=magda` — she's a pre-seeded attendee at the recurring Calm Dog Group Session. People tab shows Daniel as a fellow attendee post-Beat-1 demo (after his RSVP commits to her view).
4. **Veronika's profile** — `/profile/veronika?as=magda` — fellow group member, peer Carer, casual rate. Magda books her here in Beat 3 of the demo (drop-in care, 200 Kč, same evening).

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

## Guided Walkthrough — UX design spec

Status: **design only, build deferred.** Specified during Demo Narrative & Personas phase (W4, 2026-05-14; on-surface step card added 2026-05-17). The follow-on build phase implements against this spec; nothing in this section is shipped code.

### Two demo modes

The demo runs in two modes that share the same persona infrastructure:

| Mode | What it is | Infrastructure cost |
|---|---|---|
| **Open View** | Today's behavior. Tester picks a persona via the picker / `/demo` / `?as=` and explores freely. No scripted progression. | None new — already shipped. |
| **Guided Walkthrough** | Auto-switching between personas at scripted beats — a full-screen interstitial sets the scene at each handoff, and a persistent collapsible card carries the step task while the tester works. Linear progression through the [[strategy/Demo Narrative]] spine. | Interstitial component, on-surface step card, mode toggle, beat sequencer, pause/resume affordance. |

Open View is unchanged; this spec is the Guided Walkthrough.

### Two guidance surfaces, two jobs

The Guided Walkthrough guides with **two distinct UI elements** — keep them distinct:

1. **The full-screen interstitial** — the persona *handoff*. Fires once per beat transition, covers the viewport, sets the scene ("you're now Klára…"). The dramatic, deliberate moment that makes a persona switch land and not get missed.
2. **The on-surface step card** — the *live task reference*. Persists on every surface for the duration of a beat, collapsible. Carries the step's task so the tester can glance at "what am I doing here" anytime without losing their place.

They are separate because they do separate jobs — scene-setting vs. ongoing reference. An earlier draft of this spec (2026-05-14) had only the interstitial; that meant the step task was shown once and then gone, forcing the tester to memorize a multi-step task. The on-surface card — revived from the **shipped `TourOverlay` pattern** — fixes that. The two together are the design; neither alone is sufficient.

### Full-screen interstitial — the handoff between beats

Renders between beats. Covers the entire viewport (no peek-through to the surface beneath) so the tester never sees the persona-swap itself. Single sheet with the following structure:

**Layout (top-to-bottom), left-aligned:**

1. **Top row** — eyebrow ("Beat 1 of 4 · Saturday morning", small, muted) on the left; a quiet **"Skip beat →"** link on the right that jumps straight to the next beat's interstitial (skips this persona without walking the beat).
2. **Header row** — persona avatar (64px circle, uses `avatarUrl`) on the left; **heading** "You're now {first name}." + a secondary **{full name} · {archetype}** line stacked to its right. Profile-hero arrangement.
3. **Situational context** — 1–2 sentences placing the persona in time and motivation, left-aligned below the header row. ("Saturday afternoon. Magda anchors a tight private group of Holešovice neighbours — and she met Daniel at this morning's session. Tonight she's heading out, and Žofka needs company.") **This is the only body content — the interstitial sets the scene; it does NOT list the task.** The task lives on the on-surface step card, which walks the tester through it one step at a time once the beat begins (decision 2026-05-17 — see "atomic vs stepped" below).
4. **Primary CTA** — "Continue as {first name} →" (brand-fill pill button, full-width on mobile).
5. **Secondary** — "Pause walkthrough" (text-link or tertiary button, smaller).

**Dismissal:**
- Primary CTA dismisses + persona-swaps + lands on the beat's start surface, with the on-surface card already present (expanded) on step 1.
- "Pause walkthrough" dismisses, persona-swaps to the new beat's persona BUT keeps them in Open View on the new persona's home page (no scripted nav). Surfaces a "Resume walkthrough" pill (see "Pause / Resume" below).
- No tap-anywhere-to-dismiss — the interstitial is a deliberate consent step.
- Esc + backdrop-click are NOT bound (would risk skipping a step accidentally).

**Copy authoring is build-phase work.** This spec validates the *structure*; final wording lands in the build phase against the [[strategy/Demo Narrative]] beats.

### On-surface step card — the live task reference during a beat

After the interstitial dismisses, a **persistent, collapsible card** rides along on every surface for the duration of the beat. It **walks the tester through the beat's ordered steps, one at a time** — instruction + optional detail — with Prev/Next driving the sequencer. Adapted from the `TourOverlay` pattern (collapse/expand, desktop-floating-card / mobile-bottom-accordion placement, `env(safe-area-inset)` handling), reading `WalkthroughContext` instead of `?tour=` params.

**Placement:**
- **Desktop (>600px):** floating card anchored bottom-left, left edge aligned with the sidebar's padding, width capped ~440px.
- **Mobile (≤600px):** full-width sheet flush with the screen bottom, rounded top corners only, `env(safe-area-inset-bottom)` padding.

**Expanded content (top-to-bottom):**
1. **Header row** — persona mini-identity (compass + first name) on the left; "Step 2 of 4" (the tester's position within the *current beat's* steps) + **collapse caret** + **✕** on the right.
2. **Step instruction** — the current step's imperative; `**bold**` in the copy marks UI labels. One step on screen at a time.
3. **Step detail** — optional supporting "why" / what-to-notice context under the instruction. Same 14px size as the instruction (a size mismatch read as off) — the tertiary colour carries the hierarchy.
4. **Footer** — **Prev** / **Next** only (no standalone Exit row — the **✕** in the header pauses the walkthrough immediately instead). Next advances one step — and on a navigation step it also routes the tester to that step's target surface (see "Step advancement" below); past a beat's last step it lands on the next beat's interstitial. Prev steps back; from a beat's first step it re-opens the previous beat's interstitial. The card **auto-expands** on every step change so new content is always visible.

**Collapsed state** — a slim pill: compass/step icon + "Step 2 of 4" + expand caret + a single **✕**. This *is* the walkthrough's persistent chrome — there is **no separate header bar**. The page beneath stays fully usable while collapsed.

**Step advancement — auto for navigation, manual for actions.** A step is one of two kinds:
- **Navigation step** ("tap into Meets", "open Klára's session") — carries an `advanceOn` pathname. The tester can reach that surface either way: by using the in-app control the step describes, or by tapping the card's **Next**, which routes there for them. On arrival the card **auto-advances** to the next step, so it never sits stale after a navigation it asked for. Verified for Beat 1 steps 1–2 and Beat 2 steps 1–2.
- **Action step** ("book the session", "mark Familiar", "finish the session") — produces no reliable URL signal (a booking sheet doesn't change the route; marking Familiar is in-page). These advance on **manual Next**, and the step copy says so explicitly ("…then tap **Next**"). Auto-detecting arbitrary in-app actions would mean coupling the walkthrough to every feature's state (and some, like group invites, aren't even persisted) — not worth the fragility.

**The ✕ pauses immediately.** Tapping the header ✕ pauses the walkthrough on the spot — no confirm step — shrinking the card to the slim **"Walkthrough"** pill. Tapping that pill opens a small menu with three full-width choices: **Resume walkthrough** (primary), **Keep paused** (secondary), **Exit walkthrough** (destructive). Resume re-expands the card; Keep paused returns to the pill; Exit ends the walkthrough. Parking the leave choice in the paused menu rather than the running card keeps the card footer a clean Prev/Next.

**Why stepped (not one task per beat).** The first build had one task per beat shown whole on the card. Stepped — multiple ordered steps the card advances through — won out (decision 2026-05-17): it lets each step carry focused context and guide more precisely (e.g. Beat 1 opens on `/discover` and step 1 is just "tap into Meets"), and it keeps the interstitial clean (scene only, no task list).

**Behaviour:**
- **Auto-expands** when a new beat begins, so the new task is visible at beat start.
- Collapse state is **local to the current beat** — collapsing doesn't carry into the next beat.
- The card is walkthrough scaffolding — it never blocks surface interaction (the tester books, marks Familiar, etc., with the card present).

### Mode toggle — entering and exiting Guided

**Entry:** `/demo` route gains a "Start guided walkthrough" entry above the persona pills. Single primary card — large, brand-fill, with an avatar stack of the walkthrough's personas + a "4 beats · about 25 minutes" context line. Tap → first interstitial → Beat 1 surface. *(The current `/demo` already surfaces the four beats as a manual list — see "`/demo` route" above. The guided-walkthrough entry is the auto-switching upgrade of that.)*

**Active-walkthrough chrome:** the on-surface step card (above) IS the persistent chrome. Collapsed, it's the slim pill carrying the step counter + ✕. No separate header bar.

> **Color-rule note (Service ↔ Meet Linkage, 2026-05-17).** The codebase has a care/community color convention — blue (`status-info` / `text-info-*`) = care/paid; green (brand) = community. **The walkthrough scaffolding (interstitial + on-surface step card) is not a product surface and is exempt from this rule** — it uses a neutral brand-tinted treatment regardless of which persona/surface a beat lands on. The build phase should not recolor it per-beat to match care-vs-community context.

**End of walkthrough:** after the final beat (Lena coda), a closing interstitial fires. Same layout shape as the beat interstitials but with:
- Heading: "End of walkthrough."
- Body: "You've watched four personas live one weekend in Doggo. *Want to keep exploring?*"
- Primary CTA: "Pick another persona →" (routes to `/demo` Open View)
- Secondary: "Stay as Lena" (dismisses interstitial, keeps Lena as the active persona, Open View)

### Pause / Resume

**Pause** (the card's header ✕ — on the running card or its collapsed pill) stops scripted progression:
- Persona stays as the current beat's persona; the tester drops to Open View on that surface.
- The card shrinks to a slim **"Walkthrough"** pill (bottom-left desktop / bottom mobile anchor).
- Tapping the pill opens a three-choice menu: **Resume walkthrough**, **Keep paused**, **Exit walkthrough**.
- Resume → re-expands the card on the paused beat (or re-opens that beat's interstitial if the beat hadn't begun). Keep paused → collapses back to the pill.

**Exit** (the paused menu's third choice) ends the walkthrough entirely → returns to `/demo`. No pill.

Pause state persists in `sessionStorage` so within-tab reloads don't lose it. Closing the tab ends the walkthrough cleanly.

### Persona-switch transition

Engineering reality: persona change is a `setUserById` context update + a `router.push` to the next beat's surface. There's no real load. The interstitial dismissal is the visual cover for the swap.

**The transition itself:**
- Tap "Continue as {first name}" → interstitial fades (200ms) while the new persona's surface mounts beneath, with the on-surface card already present (expanded) in its corner.
- No spinner, no skeleton, no separate loading state — the new surface should be ready by the time the fade completes.
- If a surface is genuinely slow (rare in this codebase), the interstitial holds until the next route's first paint signals ready (Next.js navigation event).

**Inside the interstitial:**
- Avatar enters with a subtle scale-in (95% → 100%, 200ms) so each interstitial has personality without being heavy.
- Text content fades in sequentially (eyebrow → heading → context → prompt → CTAs, ~50ms stagger) — feels paced, not snapped.
- Total interstitial entry animation: ~400ms. The interstitial is then static until tester taps Continue.

### Open build-time questions

Surfaced during W4 spec drafting; resolve during the build phase:

- **Beat surface routing.** Each beat needs to land on a specific surface (Daniel → `/discover/meets`, Klára → `/bookings/booking-klara-hana/active`, etc.). Routing data lives where? — likely a `walkthroughBeats.ts` registry like `tourSteps.ts`, but with `personaId + initialUrl + interstitialCopy + taskCopy` per beat (task copy feeds both the interstitial and the on-surface card).
- ~~**On-surface card: Pause vs Exit affordance.**~~ **Resolved 2026-05-17 — ✕ = Pause, no confirm.** The header ✕ pauses immediately (reversible — Resume is always available), shrinking the card to the "Walkthrough" pill. Exit isn't on the running card at all: tapping the pill opens a three-choice paused menu (Resume walkthrough / Keep paused / Exit walkthrough).
- **Card ↔ AppNav overlap on mobile.** The card is a bottom sheet; AppNav is the bottom nav. The shipped TourOverlay covered the nav with its z-index while expanded (collapse or pause to reach the nav). Confirm that's still the right call for the walkthrough, or whether the card should sit above the nav.
- ~~**Tester actions vs scripted nav — atomic vs stepped beats.**~~ **Resolved 2026-05-17 — stepped.** Each beat is a sequence of ordered steps; the on-surface card shows one at a time and advances on Next (crossing into the next beat's interstitial past the last step). The tester still navigates the app themselves (a step can say "tap into Meets"); steps don't auto-route — only the beat's `startUrl` routes, on the interstitial's Continue. Beats live in `lib/walkthroughBeats.ts` as `{ ...beat, startUrl, steps: WalkthroughStep[] }`.
- ~~**State seeded between beats.**~~ **Resolved 2026-05-17 — statically seeded.** Beat 3 (Magda) needs Daniel's connection request to exist. Beat 1's "Connect" is a cosmetic session-local mark — it sends no real request — so depending on the tester's Beat 1 action wasn't viable. Instead the `connection_request` notification is seeded statically in `mockNotifications.ts` (`notif-magda-connect-daniel`): it always exists for Magda regardless of beat order or what the tester did in Beat 1. Accepting it inline (new Accept / Decline on `connection_request` notification rows — `app/notifications/page.tsx`) writes mutual Connected via `ConnectionsContext.markConnected`. The notification carries an `actorId` (the sender) so the accept handler can resolve the connection without parsing `href`.
- **Mid-beat exit handling.** What happens if a tester closes the tab mid-beat? Does Resume reopen on the same surface or restart the beat from its interstitial? Default: restart the beat from interstitial.
- **Mobile vs desktop interstitial layout.** The spec assumes mobile-first (full-width sheet); desktop should probably cap at ~520px wide and center. Confirm during build.

### What this spec deliberately does NOT specify

- Final interstitial copy (build-phase work, authored against the [[strategy/Demo Narrative]] beats).
- Visual mocks beyond the structural description above. Token reuse (existing brand colors, surface tokens, button components) is the expectation.
- Accessibility specifics (focus management on interstitial open, ARIA roles, keyboard nav). Build phase responsibility, but the structure above is built to support standard modal-dialog accessibility patterns.
- Analytics / telemetry. Out of scope.

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

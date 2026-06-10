---
category: feature
status: built
last-reviewed: 2026-06-09
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

### 2. Landing page (`/`) — the demo front door

**Files:** `app/page.tsx`, `app/landing.css`

**Rebuilt 2026-05-19** (Demo Narrative V2 — `/demo` folded into the landing page). The standalone `/demo` route was deleted; the landing page is now the demo's single front door — a slim, chrome-free launcher with the new brand logo (`public/logo.svg`), no AppNav, and two paths:

1. **Start the walkthrough** — primary CTA. Auto-resets demo state and launches the V2 Guided Walkthrough at Beat 1's interstitial.
2. **Explore freely** — secondary persona picker, all 7 personas. Picking writes to localStorage and routes to `/home`; ends any active walkthrough.

The prior 8-section marketing landing page was retired. `proxy.ts` now gates **everything** (the landing page included — nothing is public but the unlock page + its API + static assets). `exit()`, `AuthGateContext`, `AppNav`, and `ProfileNameDropdown` all route their "back to launcher" exits to `/`. The `/demo` URL no longer resolves.

**Why a landing page rather than a dedicated route:** the launcher *is* the product's first impression in demo mode. Folding the picker into the landing page means a tester opening the URL goes straight to the demo (after the unlock gate) — no marketing splash to bounce off, no extra click.

### 3. `?as=<personaId>` URL param (preview, non-persistent)

Implemented in `useCurrentUser` via `useSearchParams`. Adding `?as=daniel` to any URL renders that page as Daniel without writing to localStorage. Removing the param (or navigating away) reverts to whatever the context state is.

Use cases:
- "What does this profile page look like to Tomáš?" → `/profile/tereza?as=tomas`
- "What does the home feed look like for a brand-new user?" → `/home?as=new-user`
- "What does this group page look like to a non-member?" → `/communities/svc-klara-training?as=daniel`

**Sticky `?as=` (Pricing & Proposals, 2026-05-05).** The override now mirrors to `sessionStorage["doggo-as-preview"]` so it survives route changes within a tab — matters for directory-only personas (Petra, Shawn, Nikola) you can't reach from the picker. Picker actions clear the sessionStorage and strip the URL param via custom event so a deliberate persona switch wins over a stuck preview.

---

## Reset behavior

The landing page (`/`) "Reset demo state" link and the profile-name dropdown's "Reset demo state" action both call the shared **`clearDemoStorage`** helper in `lib/demoReset.ts` (Demo Narrative V2, 2026-05-19). Reset wipes:

1. **localStorage + sessionStorage** — all `doggo*` keys (`doggo-bookings`, `doggo-conversations`, `doggo-connection-overrides`, `doggo-care-reviews`, `doggo:dismissedReviews`, `doggo-bookings-upsell-dismissed`, `doggo-viewed-reports`, `doggo-as-preview`). Session storage clearing was added with V2 so the `?as=` override doesn't survive a reset.
2. **In-memory `usePersistedState` cache** (Sessions & Service Execution, 2026-05-08). Previous behavior cleared localStorage but left the module-level Map holding stale values until a full page reload swapped modules — leading to confusing "I reset but state didn't change" symptoms during walkthroughs. `resetPersistedState("doggo")` now broadcasts a notification so all subscribed components re-read fresh state on next render.
3. **Local component state** via a full `window.location.reload()` (Cross-Cutting Flow Testing, 2026-05-11). Earlier reset used `router.refresh()` — it re-fetches server data but doesn't unmount client components, so any in-component state that isn't persisted (e.g. the About-tab visibility toggle's `setUser` update, edit-mode draft state, transient UI flags) stayed stale until the user manually refreshed. Hard reload solves it deterministically; reset is rare and a "clean slate" gesture, so the brief blank-flash is the right tradeoff.

**Walkthrough auto-reset (V2).** Because the walkthrough is scripted against canonical mock seeds, **Start guided walkthrough** auto-resets demo state before launching, and **Exit walkthrough** wipes the state the walkthrough mutated then hard-navigates to `/`. "Explore freely" persona-pick also ends any active walkthrough.

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
2. **Profile** — `/profile?as=daniel` — Locked, sparse but coherent. Bára (rescue, reactive). **Holešovice** (Demo Narrative V2 — re-localised from Smíchov so the Beat-3 "same neighbourhood as Magda" lands).
3. **Klára's Stromovka walk (the anchor meet)** — `/meets/meet-klara-stromovka?as=daniel` — the free public walk that surfaces under "Meets from your circle" because Daniel is a member of Klára's care group. Beat 1 of the V2 walkthrough joins here. Daniel has no prior booking with Klára pre-demo (Demo Narrative V2 removed `booking-klara-daniel` so the Beat-3 1-on-1 capstone reads as a genuine first conversion).
4. **Post-meet review on a small calm meet** — `/schedule?as=daniel` History tab → tap a completed reactive-group meet (e.g. `meet-reactive-spring`) → review prompt. Demonstrates the Familiar marking flow on a privacy-sensitive meet.

### Klára — Professional Provider

The provider-deeply-embedded-in-community archetype. Trainer with her own care group, also joins park groups as regular owner.

1. **Klára's Calm Dog Sessions** — `/communities/group-klara-training?as=klara` — Care config (training category), her client community, Members tab shows mix of personas + clients, Meets tab with paid sessions (Hosting suppressed CTAs).
2. **Walker-trainer profile** — `/profile?as=klara` — Services tab with Walks (300/380 Kč delivery options) + training Appointment + Meet-type sessions, Posts tab with training recaps, trust signals. Bio frames her as **walker-trainer hybrid** — hosts a free Saturday walk + runs training (Demo Narrative V2 — walker-trainer reframing).
3. **Active drop-off walk booking with sessions** — `/bookings/booking-klara-toby?as=klara` — Filip's Toby, recurring pickup walks (380 Kč), today's session startable. Replaces the removed `booking-klara-daniel` as Klára's anchor live booking.
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

Status: **built — V2 re-authored 2026-05-19** (Demo Narrative V2 phase, closed 2026-06-01). Originally shipped 2026-05-18 (Guided Walkthrough Build); V2 re-authored the narrative + extended the infrastructure (`lib/walkthroughBeats.ts` beat registry, `contexts/WalkthroughContext.tsx` sequencer, `components/walkthrough/WalkthroughInterstitial.tsx`, `components/walkthrough/WalkthroughCard.tsx`, mounted globally in `app/layout.tsx`). This section is the as-built V2 spec — it reflects shipped behaviour.

**V2 narrative.** 3 beats, 2 personas: **Daniel → Klára → Daniel** (Daniel's journey is the spine; Beat 2 is a single cut to Klára's POV for the walker-trainer engine). Anchor event = Klára's free Stromovka walk (config #2 linked-care booking). Full spine: [[strategy/Demo Narrative]]. Magda is a supporting character, not a POV; Lena's V1 "graduated to care" arc is absorbed into the closing screen.

### Two demo modes

The demo runs in two modes that share the same persona infrastructure:

| Mode | What it is | Infrastructure cost |
|---|---|---|
| **Open View** | Today's behavior. Tester picks a persona via the picker / `/demo` / `?as=` and explores freely. No scripted progression. | None new — already shipped. |
| **Guided Walkthrough** | Auto-switching between personas at scripted beats — a full-screen interstitial sets the scene at each handoff, and a persistent collapsible card carries the step task while the tester works. Linear progression through the [[strategy/Demo Narrative]] spine. Pre-loaded content (posts, messages) fires off via dedicated card-handled steps; the tester performs only one or two hero actions per beat. | Interstitial component (3 modes — persona handoff / time-passage / explainer), on-surface step card (dark chrome, minimise/restore), beat sequencer, fire-off step type, `awaitAction` flag for action-gated nav. |

Open View is unchanged; this spec is the Guided Walkthrough.

### Two guidance surfaces, two jobs

The Guided Walkthrough guides with **two distinct UI elements** — keep them distinct:

1. **The full-screen interstitial** — the persona *handoff*. Fires once per beat transition, covers the viewport, sets the scene ("you're now Klára…"). The dramatic, deliberate moment that makes a persona switch land and not get missed.
2. **The on-surface step card** — the *live task reference*. Persists on every surface for the duration of a beat, collapsible. Carries the step's task so the tester can glance at "what am I doing here" anytime without losing their place.

They are separate because they do separate jobs — scene-setting vs. ongoing reference. An earlier draft of this spec (2026-05-14) had only the interstitial; that meant the step task was shown once and then gone, forcing the tester to memorize a multi-step task. The on-surface card — revived from the **shipped `TourOverlay` pattern** — fixes that. The two together are the design; neither alone is sufficient.

### Full-screen interstitial — three modes

Renders at scripted moments. Covers the entire viewport (no peek-through to the surface beneath) so the tester never sees what happens behind. **Three modes** (V2 extended from one):

1. **Persona handoff** — fires at the start of every beat (the original V1 mode). Header heading: "You're now {first name}." Avatar + archetype + 1–2 sentence situational context placing the persona in time and motivation. Primary CTA dismisses + persona-swaps + lands on the beat's start surface, with the on-surface card already present (expanded) on step 1.
2. **Time-passage** — fires mid-beat to land a temporal jump ("A couple of days later…"). Same layout shape; no persona-swap; the on-surface card re-mounts on the same persona's next step. Pre-seeded state (e.g. a notification dated today) makes the jump read honest.
3. **Feature explainer** — fires mid-beat to unpack a concept ("What 'Familiar' means", "What happens on a Klára walk", "Private groups, and mutual care"). The on-surface card stands down while the explainer shows; Continue returns to the card.

All three modes share the chrome — dark "system" treatment (`--neutral-850`, WCAG AA via `--brand-300` accent + `--neutral-400` muted text) so the walkthrough reads unmistakably as a guide layer, distinct from the light platform UI.

**Layout (top-to-bottom), left-aligned:**

1. **Top row** — eyebrow ("Beat 1 of 3 · Saturday morning", small, muted) on the left; a quiet **"Skip beat →"** link on the right that jumps to the next beat (persona handoff mode only — time-passage and explainer have no skip).
2. **Header row** — persona avatar (64px circle, uses `avatarUrl`) on the left; heading on the right.
3. **Situational context / explainer body** — 1–2 sentences (handoff/time-passage) or 2–4 sentences (explainer) below the header row. The interstitial sets the scene or explains a concept; it does NOT list the beat's task. The task lives on the on-surface step card, which walks the tester through one step at a time.
4. **Primary CTA** — "Continue as {first name} →" (handoff) or "Continue" (time-passage / explainer). Dark-chrome equivalent of brand-fill, full-width on mobile.
5. ~~Pause secondary~~ — removed in V2 (the pause/exit model is gone; see "Minimise / Restore + Exit" below).

**Dismissal:**
- Primary CTA dismisses + (for handoff) persona-swaps + lands on the target surface.
- No tap-anywhere-to-dismiss — the interstitial is a deliberate consent step.
- Esc + backdrop-click are NOT bound (would risk skipping a step accidentally).

**Copy.** V2 re-authored the copy direction: step `detail` lines pull back to the persona's goal (instruction = action + light context, detail = the character's stake); platform jargon removed ("trust ladder", "the meet → booking conversion", "content and lead-gen", "there's a deliverable"); em dashes dropped throughout. The interstitial example copy in [[strategy/Demo Narrative]] is the canonical reference.

### On-surface step card — the live task reference during a beat

After the interstitial dismisses, a **persistent, collapsible card** rides along on every surface for the duration of the beat. It walks the tester through the beat's ordered steps, one at a time — instruction + optional detail + footer — with Back/Next driving the sequencer.

**Chrome.** Dark "system" treatment (`--neutral-850` surface, `--brand-300` accent, `--neutral-400` muted text — all WCAG AA against the dark surface) so the card reads unmistakably as a guide layer, distinct from the light platform UI. Matches the interstitial chrome.

**Placement:**
- **Desktop (>600px):** floating card anchored bottom-left, left edge aligned with the sidebar's padding, width capped ~440px.
- **Mobile (≤600px):** full-width sheet flush with the screen bottom, rounded top corners only, `env(safe-area-inset-bottom)` padding.

**Expanded content (top-to-bottom):**
1. **Header row** — persona mini-identity (avatar + first name) on the left; "Step 2 of 4" + **minimise caret** on the right.
2. **Step instruction** — the current step's imperative; `**bold**` in the copy marks UI labels. One step on screen at a time.
3. **Step detail** — optional supporting "the character's stake" context under the instruction. Same size as the instruction; the muted colour carries the hierarchy.
4. **Footer** — **Back** / **Next** separated by a hairline divider. Next advances one step — and on a navigation step it also routes the tester to that step's target surface (see "Step advancement"). Past a beat's last step it lands on the next beat's interstitial. Back steps back; from a beat's first step it re-opens the previous beat's interstitial. The card **auto-expands** on every step change so new content is always visible.
5. **Exit link** — a quiet "Exit walkthrough" link below the footer (under the hairline). Tapping it ends the walkthrough — calls `clearDemoStorage` and hard-navigates to `/`.

**Step kinds (V2).** A step is one of:
- **Navigation step** (default kind, "tap into Meets", "open Klára's session") — carries an `advanceOn` pathname. The tester can reach that surface either way: by using the in-app control the step describes, or by tapping the card's **Next**, which routes there for them. On arrival the card auto-advances.
- **`awaitAction` navigation step** (V2 — added for Beat 2's "Start the session") — renders **no card Next**. The card advances only when the tester performs the in-app action AND the resulting navigation reaches `advanceOn`. Used when the walkthrough must not land on a downstream step (e.g. "Finish the session") with the upstream state unstarted.
- **Action step** ("mark Familiar", "accept the request") — produces no reliable URL signal. These advance on **manual Next**, and the step copy says so explicitly.
- **Fire-off step** (V2 — for "send the pre-written content"). The card itself renders a preview of staged content (caption + photo for a post; message body for a thread) plus a **Share** / **Send** button. Tapping it advances to the next beat — no real composer involvement, no dependency on app state. The post / message is pre-seeded in `mockPosts.ts` / `mockNotifications.ts`. The "fire-off" content is the demo-script's, not the persona's authored creation; this is the **Option 1, card-handled** model (decided 2026-05-19).

**Minimise / Restore (V2 — pause model removed).** The card has one control: a minimise caret in the header. Tapping it shrinks the card to a slim **"Walkthrough · {step}/{n}"** pill anchored at the bottom-left (desktop) / bottom (mobile). Tapping the pill restores the card. There is no pause state, no menu, no Resume/Keep-paused/Exit triad — the walkthrough is always running while it exists. Exit is the quiet link below the footer (and is the only way to end mid-walkthrough other than completing it).

**Why the pause model was removed.** V1 had ✕ pauses → pill → menu → Resume / Keep paused / Exit. That gave the leave-and-come-back behaviour a confused affordance (three choices to make one decision) and meant the walkthrough could be in three states (running / paused / exited). V2's single minimise/restore + Exit link keeps the leave path obvious and the running state binary (visible or minimised) — simpler to author against, simpler to read.

**Behaviour:**
- **Auto-expands** when a new beat begins, so the new task is visible at beat start.
- Minimise state is **local to the current beat** — minimising doesn't carry into the next beat.
- The card is walkthrough scaffolding — it never blocks surface interaction (the tester books, marks Familiar, etc., with the card present).
- **Discover Filters button co-exists.** The floating `.discover-floating-btn` right-aligns while the walkthrough is active (`body:has(.wt-card, .wt-pill)` rule) so the bottom-left card/pill never overlaps it.

### Mode toggle — entering and exiting Guided

**Entry:** landing page (`/`) primary CTA — "Start the walkthrough." Tap → `clearDemoStorage` (auto-reset to canonical seeds) → first interstitial → Beat 1 surface.

**Active-walkthrough chrome:** the on-surface step card (above) IS the persistent chrome. Minimised, it's the slim "Walkthrough · {step}/{n}" pill. No separate header bar.

> **Color-rule note (Service ↔ Meet Linkage, 2026-05-17, refined Demo Narrative V2 2026-05-19).** The codebase has a care/community color convention — blue (`status-info` / `text-info-*`) = care/paid; green (brand) = community. **The walkthrough scaffolding (interstitial + on-surface step card) is not a product surface and is exempt from this rule** — V2 settled on a **dark neutral treatment** (`--neutral-850` surface, brand-300 accent) regardless of which persona/surface a beat lands on. The dark chrome reads as a guide layer; the build phase should not recolor it per-beat.

**End of walkthrough:** after Beat 3 completes, a closing interstitial fires:
- Heading: "End of walkthrough."
- Body: V2 recap — one free walk, one trainer, one neighbour, one community.
- Primary CTA: "Pick another persona →" (routes to `/` Explore freely)
- Secondary: "Stay as Daniel" (dismisses interstitial, keeps Daniel as the active persona, Open View)

### Exit

There is no pause state in V2 — the walkthrough is binary (visible card / minimised pill). To leave:
- **Exit walkthrough** link below the card footer → calls `clearDemoStorage` + hard-navigates to `/`.
- "Explore freely" persona-pick on `/` also ends an active walkthrough cleanly.
- Closing the tab ends the walkthrough.

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

## Hidden-affordance pattern (state-toggle demos)

Some shipped features model a real state machine (Walker apply → invited → vouched, future Connect → Familiar bumps, etc.) where the demo can't reasonably WAIT for the real trigger (a shelter coordinator vouching, a meet getting hosted, days passing). The pattern: surface a small dropdown affordance on the same action button that holds the canonical "state advances" action — `Advance state (demo)`. Honest about being faked, survives persona switching (state lives in the persisted context, not in simulated time), inspectable in localStorage.

**Where this pattern lives today:**

- **Walker journey** (`contexts/WalkerApplicationsContext.tsx`, 2026-06-09) — shelter-page action row + dog-page Walk button. Same dropdown carries `Advance state (demo)` / `Log walk (demo)` / `Withdraw application` depending on current state.
- **Pre-existing reference:** the "Walk a dog" → "Interest sent ▾" single-flip pattern on the shelter action row predates this — same demo principle.

**Why not a theatrical fake (simulated delays + auto-notifications)?** Tested poorly across persona switching: the simulated time gets confused when testers swap personas mid-flow. Toggle keeps the state machine honest and testable. A richer fake-time layer (time-passage interstitials, notification timing) can sit on top of the state machine later without changing the machine itself.

---

## Known limitations

Two accepted limitations remain. The pre-Mock-World-Building list of six was resolved during that phase — connections, conversations, posts, and share codes are all per-persona now. See the highlight reels above for verification surfaces.

1. **Profile-page edit state doesn't persist across persona swaps.** Local state in `app/profile/page.tsx` resets on persona change (via `useEffect` watching `currentUser.id`). Real product would persist edits per-user; the prototype just resets. Accepted.

2. **SSR briefly flashes Tereza content.** First paint always renders as Tereza (the default persona); localStorage hydrates on mount. ~50ms flicker when the active persona is non-default. Accepted.

---

## Related docs

- `docs/strategy/User Archetypes.md` — behavioural profiles each persona maps to
- `docs/implementation/mock-data-plan.md` — Mock World Building scope (per-persona content)
- `docs/planning/Open Questions & Assumptions Log.md` §10 — closed by this phase; see for original framing
- `docs/archive/phases/persona-wiring.md` — full phase board (workstreams, decisions, closing summary)

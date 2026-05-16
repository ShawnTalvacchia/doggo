---
status: archived
last-reviewed: 2026-05-14
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Demo Presentation — Walkthrough

> **Archived 2026-05-14** alongside `demo-presentation.md`. The Tereza-only guided tour walkthrough items (Workstream C) are superseded by the multi-persona walkthrough infrastructure being designed in **Demo Narrative & Personas** (`docs/phases/demo-narrative-and-personas.md`). Guest-viewer / AuthGate verification items (Workstreams D / F) verify shipped infrastructure that remains in production — re-run those against the running app if guest-route behaviour ever needs re-verification.

Verification checklist for the Demo Presentation phase. **This document is for checking, not record-keeping** — decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), New User.

> The whole purpose of this phase is the *outside-in* path. Walk it as a fresh reviewer would: open `/` cold, click through the demo entry, run the tour. Don't pre-set persona via the dropdown — let the surfaces drive it.

---

## Workstream A — Landing redesign

Open `/` cold. No localStorage persona, no `?as=`. The page should feel like a confident "here's what we built — come see," not a marketing brochure.

- [x] **A1. `/` hero.** Eyebrow reads **"Doggo prototype · Prague"** so the audience is honest about who's reading. Headline + subline unchanged. Two CTAs: primary **"Choose a persona →"** to `/demo`, secondary **"Walk me through Tereza's day"** to `/home?as=tereza&tour=tereza&step=1`. Photo background renders unchanged.
- [x] **A2. `/` Three Doors section.** Below the emotional-hook teal band: three large cards labelled **Find Your Park**, **Find Your People**, **Find Your Help**. Each card has icon + label + title + 2-line body + "→ See it in the demo" link. **No bulleted example list** (dropped 2026-05-05 — names of mock-world groups don't earn their visual weight for a first-time visitor; the demo entry is the proof). Section padding feels generous (88px top/bottom) and the gap between the section header and the card grid is wider than in-app surfaces (40px).
- [x] **A3. `/` Persona preview row.** Four cards in a **2x2 grid on desktop**, one per journey persona (Tereza/Daniel/Klára/Tomáš). **Desktop card layout**: 96px avatar on the left spans all three content rows (titles, story, cta); content (archetype label, name, story, "Enter as {first name} →" CTA) stacks on the right. **Tablet (≤900px)**: 1 card per row, same desktop grid layout. **Mobile (≤600px)**: hybrid — 72px avatar sits inline with the titles row only; story + CTA wrap below at full card width. Clicking any card lands on `/home?as=<persona>` with that persona active.
- [x] **A4. `/` archetypes section.** Existing three-card spectrum still reads (Regular / Connector / Organiser). Soft CTA below: **"See the spectrum →"** → `/demo` (no more "/signup/start" dead-end).
- [x] **A5. `/` care section.** Existing care-split unchanged in copy + photo. Section closes with a **"Browse the prototype" primary pill button** (brand-fill, large) → `/demo`. The CTA is visually elevated and has a 32px gap above it (bigger than the 20px gap between care bullets) so it reads as its own beat, not a continuation of the bullet list. Matches the section-level CTA pattern of Hero / Archetypes / Bottom CTA.
- [ ] **A6. `/` testimonials.** Three quotes with **persona avatars from `lib/personas.ts`** (Tereza, Klára, Tomáš). No more Unsplash placeholder portraits. Names + neighbourhoods match `mockUsers.ts`.
- [ ] **A7. `/` bottom CTA.** "Your dog deserves a crew." Headline unchanged. CTA pair matches the hero — **Choose a persona** (white) + **Walk me through Tereza's day** (outline-white). No more `/discover/meets` or `/signup/start` from the bottom CTA.
- [ ] **A8. Old "How it works" tabs gone.** No "Join the Community / Find Care / Provide Care" tab section anywhere on `/`. Remove sweep verified — `HowItWorksTabs` import gone from `app/page.tsx`.
- [ ] **A9. Landing CSS holds at narrow breakpoints.** Resize to 600px and 360px. Three Doors stack to a single column; persona row stacks to one column with avatar above name; testimonial grid collapses; nothing overflows horizontally.

---

## Workstream B — `/demo` redesign

Hit `/demo` cold (or via the landing primary CTA).

- [ ] **B1. `/demo` two-row layout.** Top section labelled **"Guided journeys"** with three large scenario cards: "A morning walking crew" (Tereza), "Trust built from zero" (Daniel), "A trainer's small business" (Klára). Each card has avatar + scenario title + 2–3 line story.
- [ ] **B2. `/demo` Tereza scenario card.** Has **two** actions, both rendered as **text links with arrows** (no pill chrome — toned down 2026-05-05 because three pill CTAs at once on `/demo` was visual shouting). The first reads "**[compass icon] Walk me through it →**" (launches tour at `/home?as=tereza&tour=tereza&step=1`) and the second reads "Just enter as Tereza →" (drops into `/home?as=tereza` without the tour overlay). The Compass icon prefix is the only visual differentiator marking the curated path.
- [ ] **B3. `/demo` Daniel + Klára scenario cards.** Each has a single "Enter as {name} →" action, **text-link styled** (no pill chrome) matching the lighter treatment on B2.
- [ ] **B4. `/demo` "Just explore" pills.** Bottom section labelled **"Just explore"**. Five compact persona pills (T/D/K/Tomáš/New User), each with mini avatar + name + archetype + chevron. Clicking writes to localStorage and navigates to `/home`.
- [ ] **B5. `/demo` footer.** Reset state link + "Back to landing" link still present. Reset still wipes `doggo*` localStorage keys and routes back to default.
- [ ] **B6. `/demo` standalone shell.** No AppNav, no Sidebar, no BottomNav (GuestLayout standalone-route handling unchanged).

---

## Workstream C — Tereza-only guided tour

Launch via either landing hero secondary CTA, landing bottom-CTA secondary, or the `/demo` Tereza scenario "Walk me through it" button. The tour should land on Tereza's home feed with the floating tour card visible at bottom-center.

- [ ] **C1. Tour step 1 — `/home?as=tereza&tour=tereza&step=1`.** Floating card at bottom-center reads "1 of 6 · Tereza's neighbourhood feed" (or similar). Body explains what to look for. Buttons: Exit, Next. Prev disabled on step 1.
- [ ] **C2. Tour step 2 — Vinohrady Morning Crew group.** Clicking Next from step 1 navigates to `/communities/group-1?as=tereza&tour=tereza&step=2`. Card updates to step 2 copy. Persona context preserved (avatar/data still Tereza).
- [ ] **C3. Tour step 3 — Riegrovy morning meet.** Next from step 2 → `/meets/meet-1?as=tereza&tour=tereza&step=3`.
- [ ] **C4. Tour step 4 — Tereza's profile.** Next from step 3 → `/profile?as=tereza&tour=tereza&step=4`. Profile page renders Tereza's full profile (bio, **both pets — Franta + Bella** per Care Catalog Taxonomy 2026-05-11, About tab default). Card body no longer says "Helper-tier sitting" — Carer-tier collapse 2026-05-10 retired the Helper/Provider noun. Hero shows the Carer Identity badge (info-blue pill, circle variant since `publicProfile: false`).
- [ ] **C5. Tour step 5 — Services tab.** Next from step 4 → `/profile?as=tereza&tab=services&tour=tereza&step=5`. Services tab is active; **three** service cards visible — Day care, House sitting, Walks (four-service taxonomy from Care Catalog Taxonomy 2026-05-11) — each with pricing modifier chips where configured (Day care + House sitting carry the weekend modifier; Day care also carries multi-pet). Card body emphasises the **circle audience** (Connected viewers only) rather than the old Helper-tier vocabulary.
- [ ] **C6. Tour step 6 — Bookings.** Next from step 5 → `/bookings?as=tereza&tour=tereza&step=6`. Card body emphasises "care that emerged from community." Next button replaced with **"Finish"** which exits cleanly. **Dual-tab UI** renders (Sessions & Service Execution 2026-05-08): My Care (Olga walks Franta — recurring Tue/Thu, ongoing) + My Services (Tereza sits Marek's Benny). Confirms Tereza-as-dual-role narrative reads on the surface the tour lands on.
- [ ] **C7. Prev navigation.** From any step ≥2, Prev button takes you back one step (URL updates, persona persists, card updates).
- [ ] **C8. Exit any step.** Exit button removes `tour` and `step` query params from the URL (keeps `as=tereza`), tour overlay disappears, the page below stays put.
- [ ] **C9. Tour does NOT appear without `?tour`.** Visit `/home?as=tereza` without `?tour=tereza` → no overlay rendered. Visit `/home` cold → no overlay. Tour state is fully URL-driven, zero global state cost.
- [ ] **C10. Tour overlay positioning.** **Desktop (>600px):** card anchored to **bottom-left**, with its left edge aligned to the sidebar's left padding (12px from the screen edge) so it visually lines up with the sidebar nav items above it. Width capped at 440px. **Mobile (≤600px):** **full-width bottom sheet flush with the screen bottom** (no nav clearance — tour's z-index covers any nav while open; collapse or exit to access the nav). Rounded top corners only; no side/bottom borders. Bottom padding includes `env(safe-area-inset-bottom)` for notched devices.
- [ ] **C11. Tour overlay collapse + expand.** Header row has a **caret-down button** (next to the Exit X). Clicking it collapses the card to a slim header pill — just compass + "Step N of M" + caret-up (expand) + Exit. The page beneath becomes visible. Click caret-up to re-expand. Navigating to a new step (Next / Prev) **auto-expands** so the new step's content is always visible. Collapse state is local to the current step — doesn't persist into URL.
- [ ] **C12. Page-header back during tour preserves tour state.** On step 2 (`/communities/group-1?as=tereza&tour=tereza&step=2`), click the page header's back arrow. The browser navigates back to step 1 (`/home`) and **the tour overlay is still active** — it doesn't silently disappear. (Implementation: when `?tour=` is in the URL, the page back arrow defers to `router.back()` so browser history carries the tour params instead of the page hardcoding `/home`.) Same expected behavior on step 3's meet detail back arrow.

---

## Workstream D — Logged-out flows

The "guest viewer" model. Open `/communities/group-1?guest=1` cold (no localStorage persona, no `?as=`). The page should render real content with action affordances gated by `AuthGate`. D4 / D5 / D6 (logged-out `/discover/meets`, `/discover/care`, `/profile/[userId]`) shipped 2026-05-11 alongside guest-mode sessionStorage persistence so `?guest=1` survives in-app navigation.

### Guest viewer state

- [ ] **D1a. Guest mode hydrates from URL.** Visit `/communities/group-1?guest=1` cold. The action row reads **"Join community"** (open visibility) + **"Invite"** — not "Admin" or "Joined." This proves `isGuest` flipped true on mount, forcing `isMember` and `isAdmin` to false even though Tereza (the read-only fallback) is the group's admin.
- [ ] **D1b. Guest mode is ephemeral.** Navigate away (e.g. click the AppNav "Try the demo" pill → `/demo`, then pick Tereza). Now visit `/communities/group-1` (no `?guest=1`). The page renders Tereza-as-admin; guest mode did not persist to localStorage.
- [ ] **D1c. Picker exits guest mode.** From `/communities/group-1?guest=1`, navigate to `/demo` and pick any persona. Then visit `/communities/group-1` directly. Guest mode is cleared — the persona's view renders, not the guest view.

### AuthGate

- [ ] **D2a. Join community → AuthGate.** From `/communities/group-1?guest=1`, click **Join community**. Modal sheet opens. Title: "Sign up to continue". Headline: **"Sign up to join this community"** (with "join this community" rendered in brand teal). Body: explanatory paragraph about the prototype. Two CTAs: **"Try the demo →"** (primary brand pill) + **"Sign up"** (secondary outline pill). Footnote: lists the four personas.
- [ ] **D2b. Invite → AuthGate.** Same page, click **Invite** in the action row. Sheet opens with headline **"Sign up to invite friends"**. Same two CTAs.
- [ ] **D2c. Try the demo button navigates.** With the sheet open, click **Try the demo →**. Sheet closes; URL becomes `/demo`. The persona picker renders.
- [ ] **D2d. Sign up button navigates.** Reopen the sheet (Join community). Click **Sign up**. Sheet closes; URL becomes `/signup/start`. (Signup flow itself is a stub — that's expected.)
- [ ] **D2e. Close + Esc + outside-click.** Reopen the sheet. The X button in the header closes it. Pressing Escape closes it. Clicking the dimmed backdrop closes it. Underlying page state is preserved (still on `/communities/group-1?guest=1`, action row unchanged).

### Guest mode survives in-app navigation

- [ ] **D1d. Guest mode mirrors to sessionStorage.** From `/communities/group-1?guest=1`, click any in-app link (e.g. tap a meet card → `/meets/meet-1`). The destination renders in guest mode too — action affordances trigger AuthGate, the AppNav still shows the GuestNavLinks (no Bell / Inbox / Create). Without the sessionStorage mirror (added 2026-05-11) the destination would lose the `?guest=1` URL param and silently revert to the Tereza fallback persona.
- [ ] **D1e. Closing the tab clears guest mode.** Open `/communities/group-1?guest=1` in a fresh tab, navigate around in guest mode, then close the tab. Open the same URL (no `?guest=1`) in a new tab. Renders normally as Tereza — guest didn't leak via localStorage.

### Vinohrady Morning Crew logged-out preview

- [ ] **D3a. `/communities/group-1?guest=1` Feed tab.** Banner image, group name **"Vinohrady Morning Crew"**, description, meta row (members count, dogs, photos), action row (Join + Invite — both gated), then the post feed (3 visible posts). No "Create post" icon in the AppNav header — guests don't see the gated icon.
- [ ] **D3b. Meets tab.** Click the Meets tab. Real meets render (Riegrovy morning recurring etc.). If empty-state appears, the **"Create meet"** button triggers AuthGate with headline "Sign up to create a meet" — does NOT open the meet composer.
- [ ] **D3c. Members tab.** Click the Members tab. **Flat list** of all group members under a single section header `"N members"`. No section grouping by relationship state (no Connected / Familiar / Other / Private sections). No row action affordances (no "+ Familiar" / "Connect" pills). Avatars + names + dog names only.
- [ ] **D3d. Back nav → `/`.** Click the back arrow in the page header. URL becomes `/` (the landing page), NOT `/home`. Guests don't have a `/home` to fall back to.
- [ ] **D3e. No client-side crash on tab switch.** Click between Feed → Members → Meets in any order. No "Application error" overlay appears. (Hooks-rules fix applied 2026-05-05 — `useState` hoisted above the early return in `MembersTab`.)
- [ ] **D3f. Toggling out of guest mode shows logged-in view.** From `/communities/group-1?guest=1`, navigate to `/demo` and pick Tereza. Visit `/communities/group-1` (no `?guest=1`). Action row now shows **"Admin"** (disabled brand-subtle) instead of Join + Invite — guest mode cleared, real persona-as-admin renders.

---

### Logged-out /discover/meets (D4)

- [ ] **D4a. `/discover/meets?guest=1` cold.** Browse cards render. Pill row shows All / Walks / Hangouts / Playdates / Training — **no "Following"** pill (guest has no series to follow). No "Going" / "Hosting" / "Interested" status indicator on any card (CardMeet skips role derivation for guests).
- [ ] **D4b. Tap a meet card.** Lands on `/meets/<id>` still in guest mode. The "Going" RSVP button is the inactive entry state (brand-outline). Clicking it opens AuthGate with headline **"Sign up to RSVP to this meet"**.
- [ ] **D4c. Tap "Interested" inside the RSVP menu.** Same AuthGate prompt fires.
- [ ] **D4d. Share button absent.** Detail tab's header right action (Share) is suppressed in guest mode. (Guests have no audience to share to from a real identity.)
- [ ] **D4e. Following toggle on a recurring meet.** If shown, tapping it triggers AuthGate with headline **"Sign up to follow this series"**.
- [ ] **D4f. Chat tab empty state.** Tap the Chat tab. Renders the "RSVP to see the conversation" empty state — guest's `isJoined` is false. Inline "Join this meet" button is presentation-only (pre-existing — out of scope for D4).

### Logged-out /discover/care (D5)

- [ ] **D5a. `/discover/care?guest=1` cold.** Provider cards render. **No "Carers in your circle" section** — guests have no circle, so every card renders as marketplace under a single flat list. Self-exclude check is skipped, so Tereza's card surfaces in results (the read-only fallback would otherwise be filtered out).
- [ ] **D5b. Filter panel.** Tap Filters. Pets row reads **"Sign up to add your dog"** (button, not link); tapping it opens AuthGate with headline **"Sign up to add your dog"**. Nearby row reads **"Sign up to set your neighbourhood"**; tapping opens AuthGate. The viewer fallback's pets + neighbourhood don't leak into the panel.
- [ ] **D5c. Service pill scope works.** Walks / House sitting / Day care / Boarding / Appointment pills still filter results in guest mode. Filters that don't depend on a viewer identity (days, time of day, price slider, leash policy) all work.
- [ ] **D5d. Tap a provider card.** Lands on `/profile/<userId>` (e.g. `/profile/klara`) still in guest mode. Action gating per D6 below.

### Logged-out /profile/[userId] (D6)

- [ ] **D6a. `/profile/tereza?guest=1` cold** (open profile). About tab renders with Tereza's bio, two dogs (Franta + Bella), Carer identity badge. **Action row** shows a single brand-fill **"Connect with Tereza"** button (matrix collapsed for guests). Tapping it opens AuthGate with headline **"Sign up to connect with Tereza"**.
- [ ] **D6b. Posts tab.** Tereza's recent posts render — read-only browsing works.
- [ ] **D6c. Services tab.** Three service cards render (Day care + House sitting + Walks) with pricing modifier chips. Tapping any **"Book a session"** button opens AuthGate with headline **"Sign up to book Tereza's service"**. The "Ask about this" CTA on appointment-type cards (if seeded on another profile) similarly triggers AuthGate.
- [ ] **D6d. Chat tab absent.** No Chat tab in the TabBar for guests — `showChatTab` forces false. No existing Tereza-thread leaks into the preview.
- [ ] **D6e. `/profile/daniel?guest=1` (locked profile) cold.** Renders the locked-profile state. **"+ Familiar"** button — if rendered for guest because of shared context — opens AuthGate with headline **"Sign up to recognise Daniel"**.
- [ ] **D6f. Back navigation.** Profile-header back arrow on a fresh tab (no in-app history) routes to `/`, not `/home`. Guests have no `/home` to fall back to.

## Workstream F — Persistent demo affordance

Visible on every guest route — `/`, `/signin`, `/signup`, and the logged-out `/communities/group-1?guest=1` preview.

- [ ] **F1a. AppNav "Try the demo" pill.** On `/` cold, the AppNav right side shows **"Try the demo"** (compass icon + label, brand-outline pill) and **"Sign Up"** (brand-fill pill). The demo pill fills with brand teal on hover.
- [ ] **F1b. Demo pill on signup routes.** Visit `/signup/start`. The "Try the demo" pill is still visible in the AppNav (signup nav doesn't strip it).
- [ ] **F1c. Demo pill on logged-out group preview.** Visit `/communities/group-1?guest=1`. The "Try the demo" pill is still in the AppNav. Clicking it navigates to `/demo`.
- [ ] **F1d. Mobile rendering.** Resize to 375px. The demo pill collapses to icon-only (label hidden via `.app-nav-link-label` display: none breakpoint). Sign Up pill is hidden on mobile entirely (`--hide-mobile`). Tap target ≥32px.

<!--
Conventions:
- Each item starts with a bold persona + URL anchor so the reader knows where to go without reading the rest.
- DO NOT add "Findings & follow-ups" sections — those belong in the phase board, Open Questions log, or a relevant feature doc.
- DO NOT track decisions inline. If the walkthrough surfaces a product call, capture it in the right home doc and update the walkthrough item to reflect the new expected behavior.
- Workstream E (real product landing) verification items will be added when E1 (Claude Design exploration) returns a picked direction and E2 lands the implementation.
-->

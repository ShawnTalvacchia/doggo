---
status: planned
last-reviewed: 2026-04-08
review-trigger: When any task is completed or blocked
---

# Phase 33 — Demo Entry Page & Scenario Data

**Goal:** Build a demo entry page that lets testers/investors experience the app through different user perspectives. Define complete user profiles for each scenario with rich enough mock data that the demo feels alive.

**Depends on:** Phase 31 (care groups exist), Phase 32 (empty states handle sparse data gracefully).

**Key reference:** `docs/strategy/Community & Provider Groups Evolution.md` → "Demo Planning" section.

---

## Workstream A — Demo Entry Page

| Task | Description | Status |
|------|-------------|--------|
| A1 | Create demo entry page at `/demo` (or root, replacing current landing): short header/subheader explaining context | todo |
| A2 | List of demo user links, each loading the app as that user type | todo |
| A3 | Link to existing landing page (marketing page) | todo |
| A4 | Link for "New user" experience (empty state, onboarding) | todo |
| A5 | Visual design: clean, minimal, explains what each persona demonstrates | todo |

## Workstream B — Demo User Profiles

Define complete profiles for each user type. Each needs: name, dog(s), neighborhood, bio, connections, group memberships, recent activity, booking history, provider details (if applicable).

| Task | Description | Status |
|------|-------------|--------|
| B1 | **Active community member** (Tereza archetype): in 3 park groups, runs a neighborhood group, 12+ connections, regular meet attendance, casual helper dial barely turned. Demonstrates: the core community experience, how trust builds, the neighborhood group dynamic. | todo |
| B2 | **Solo dog trainer** (Klára archetype): runs a training care group, participates in park groups as owner, has bookings and reviews, provider dial high. Demonstrates: how a professional uses the platform, care group features, community-embedded business. | todo |
| B3 | **Professional walker** (new archetype): runs a walking pack care group with daily updates, recurring bookings, multiple client dogs. Demonstrates: daily update gallery, walking service model, capacity management. | todo |
| B4 | **Anxious new owner** (Daniel archetype): in reactive dog support interest group, few connections, exploring cautiously. Demonstrates: interest groups, privacy controls, trust building from zero. | todo |
| B5 | **Newcomer to Prague** (Tomáš archetype): just joined, 1-2 park groups, no neighborhood group yet, building first connections. Demonstrates: discovery, first-time experience with some data, the "new in town" journey. | todo |
| B6 | **Small boarding business** (new archetype): runs a boarding care group with daily photo updates, facility gallery, client reviews. Demonstrates: boarding/daycare use case, trust through transparency. | todo |
| B7 | Optional: **Grooming salon**, **Café owner**, or **Vet clinic** — stretch goals if time allows | todo |

## Workstream C — Mock Data Expansion

| Task | Description | Status |
|------|-------------|--------|
| C1 | Create mock user profiles for each demo persona (name, avatar, dog(s), neighborhood, bio) | todo |
| C2 | Create supporting cast: 20-30 additional mock users who populate groups, attend events, post content | todo |
| C3 | Flesh out group content: 5-10 posts per active group, 3-5 upcoming events, photo galleries | todo |
| C4 | Create booking/care history for provider personas: past sessions, reviews, earnings | todo |
| C5 | Create connection graphs: who knows who, connection states, familiar/connected relationships | todo |
| C6 | Create notification/inbox data per persona: recent messages, event reminders, connection requests | todo |

## Workstream D — User Switching Mechanism

| Task | Description | Status |
|------|-------------|--------|
| D1 | Implement mock auth context that loads different user data per demo persona | todo |
| D2 | Ensure all pages read from the active persona's data (groups, connections, feed, bookings) | todo |
| D3 | "Switch user" affordance within the app (dev menu or floating button) for easy demo navigation | todo |
| D4 | Each persona starts on the most relevant page (community member → Community tab, trainer → their care group, newcomer → Discover) | todo |

---

## Demo Narrative per Persona

Brief description of what a demo walkthrough looks like for each:

**Active community member (Tereza):** Opens to Community tab with populated groups across all categories. Show the neighborhood group, scroll the feed, click into a park group, show upcoming meets. Click a connection's profile. Show how casual care arrangements work.

**Solo trainer (Klára):** Opens to her care group. Show the events with booking CTAs, the services tab, the community discussion. Switch to Community "All" tab — show she's also in park groups as a regular owner. Check bookings page — show incoming session requests.

**Professional walker:** Opens to their walking pack group. Show the daily updates gallery, today's walk with photos. Show the recurring schedule. Check bookings — active walking contracts.

**Anxious new owner (Daniel):** Opens to Community tab with just the reactive dog support group. Show the supportive discussion, small meets. Show his locked profile settings. Show Discover — he's browsing but cautious.

**Newcomer (Tomáš):** Opens to Discover. Show park groups nearby, join one. Browse Care tab — see what's available. Sparse but not empty — the app feels useful even at this stage.

**Boarding business:** Opens to their care group. Show daily photo updates (the killer feature). Show the booking calendar, upcoming stays. Show client testimonials in the group feed.

---

## Acceptance Criteria

- [ ] Demo entry page exists with clear persona descriptions and entry links
- [ ] Each persona loads with appropriate mock data across all app sections
- [ ] Switching between personas works without page reload issues
- [ ] Each persona's Community tab shows a different, coherent set of groups
- [ ] Care provider personas show functional group detail with services and events
- [ ] Non-provider personas show the community experience without provider features
- [ ] The demo feels alive — enough posts, events, members, and photos to be convincing
- [ ] A first-time viewer can walk through any persona in 3-5 minutes and understand the product

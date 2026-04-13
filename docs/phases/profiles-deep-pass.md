---
status: active
last-reviewed: 2026-04-13
review-trigger: When any task is completed or blocked
---

# Profiles Deep Pass

**Goal:** Make profiles feel like real people with real lives. The profile is the relationship hub — About, Posts, Services, Chat — it needs to be the strongest page in the app. When a tester views a profile, they should think: "I'd trust this person with my dog."

**Depends on:** Inbox & Notifications (done — chat-on-profiles architecture, connections list), Profiles & Dogs (done — unified PageColumn + TabBar, connection-gated CTAs, PetCard expand/collapse).

**Refs:** [[profiles]], [[Trust & Connection Model]], [[Content Visibility Model]], [[explore-and-care]], [[design-system]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [ ] Read every task and its referenced docs
- [ ] Review Open Questions log — flag anything affecting this phase
- [ ] Walk through own profile (`/profile`) — note what feels thin, broken, or missing
- [ ] Walk through other-user profiles (`/profile/tereza`, `/profile/klara`, `/profile/daniel`) — note gaps
- [ ] Walk through locked profile view — is the explanation clear and the gate working?
- [ ] Review current About tab content for each mock user — is it enough to tell a story?
- [ ] Review post composer — confirm the broken modal layout (P7 on polish log)
- [ ] Review Posts tab — confirm corner radius and attribution issues (P8 on polish log)
- [ ] Check Services tab with provider profiles (klara, nikola, olga) — is the content rich enough?
- [ ] Confirm scope — no tasks that belong in a different phase

---

## Tasks

### About Tab — Richer Content & Layout

The About tab is the first thing a visitor sees. It needs to tell a story — not just list facts.

| # | Description | Status |
|---|-------------|--------|
| A1 | Review and enrich mock user bios — every user should have a distinct, personality-rich bio (2-4 sentences). Currently most are one-liners or fallback text | todo |
| A2 | "About" section structure — consider splitting into subsections: bio, interests/lifestyle, neighbourhood context. What would make someone feel they *know* this person? | todo |
| A3 | Trust signals review — TrustSignalBadges currently shows walks together, known since, met at. Are these the right signals? Do they tell a trust story? Consider: mutual connections, shared groups, care history | todo |
| A4 | Connection state display — review how None/Familiar/Pending/Connected render. Is the badge clear? Is the gate understandable? | todo |
| A5 | Dogs section — PetCards are feature-complete but review the content. Do mock dogs have enough personality (socialisation notes, play styles, vet info)? Expand where thin | todo |
| A6 | Own profile About tab — review the edit experience. Is the flow smooth? Does it feel like a real profile editor? | todo |
| A7 | "Member since" and location display — are these prominent enough for trust building? | todo |

### Posts Tab — Fix & Enrich

| # | Description | Status |
|---|-------------|--------|
| B1 | Fix corner radius on post images in profile context (P8 from polish log) | todo |
| B2 | Add group/meet/care attribution to post headers — posts on the profile should show where they were posted (e.g. "in Riegrovy Sady Dog Walks" or "from Morning Walk at Letná") | todo |
| B3 | Add header link matching main feed — post headers should link to the group/meet/context the same way community feed headers do | todo |
| B4 | Review post content — do mock posts tell stories? Does each user have enough posts to feel real? | todo |
| B5 | "New post" CTA on own profile — review placement and styling | todo |

### Post Composer — Fix Broken Layout

| # | Description | Status |
|---|-------------|--------|
| C1 | Diagnose and fix post composer layout (P7 from polish log). Currently broken — full audit of the FormHeader/FormBody/FormFooter structure | todo |
| C2 | Review composer flow: does selecting photos, writing caption, adding tags, and choosing community feel smooth? | todo |
| C3 | Verify composer is accessible from all entry points (profile Posts tab CTA, community page, home header +) | todo |

### Services Tab — Fuller Content

| # | Description | Status |
|---|-------------|--------|
| D1 | Review provider service cards — are service descriptions, pricing, and units clear? Does the layout sell the service? | todo |
| D2 | Enrich mock provider data — Klára (trainer), Nikola (walker), Olga (sitter) should each have distinct, detailed service listings with realistic pricing and descriptions | todo |
| D3 | Availability grid review — is the day/time grid readable? Does it communicate availability clearly? | todo |
| D4 | "Open to helping" badge and provider stats — are these trust signals prominent enough? Do they help a potential booker decide? | todo |
| D5 | Own profile services edit — review the edit flow for adding/removing services, setting availability, toggling visibility | todo |
| D6 | Locked provider banner — verify the "your profile is private" banner appears and the CTA works | todo |

### Own Profile Polish

| # | Description | Status |
|---|-------------|--------|
| E1 | Profile hero section — avatar, name, location, edit controls. Does it feel like *your* space? | todo |
| E2 | Share profile link — review the share code UX. Is it discoverable? Does the shared page look good? | todo |
| E3 | Care CTAs — "Find Care" + "Offer Care" / "Manage Services". Are these prominent enough to drive the community→care funnel? | todo |
| E4 | Connection list on own profile — review how your connections display. Useful information? | todo |

### Cross-Cutting

| # | Description | Status |
|---|-------------|--------|
| X1 | Profile-to-profile consistency — walk through tereza, klara, daniel, tomas, marek. Do they all render consistently? Any edge cases (no pets, no posts, no care, locked)? | todo |
| X2 | Mobile responsiveness — review all tabs at mobile widths. Any overflow, truncation, or layout breaks? | todo |
| X3 | Locked profile experience — does the gate feel right? Is the explanation clear without being preachy? Does it make the user want to meet the person? | todo |
| X4 | Profile from different entry points — from inbox, from community feed, from meet attendee list, from discover. Is the transition smooth everywhere? | todo |

---

## Acceptance Criteria

- [ ] Every mock user has a personality-rich About tab that tells a story
- [ ] Trust signals on profiles communicate genuine trustworthiness, not just data points
- [ ] Posts tab shows posts with correct corner radius, group/meet attribution, and header links
- [ ] Post composer works correctly — layout intact, full flow functional
- [ ] Services tab for provider profiles (klara, nikola, olga) has rich, detailed content
- [ ] Own profile edit experience is smooth across About and Services tabs
- [ ] All profiles render consistently across users and viewports
- [ ] Locked profile gate feels respectful and motivating
- [ ] TypeScript compiles clean
- [ ] Feature docs updated

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [ ] Check next phase scope for conflicts with what was just built

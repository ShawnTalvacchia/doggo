---
status: active
last-reviewed: 2026-05-04
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Onboarding & In-Product Communication — Walkthrough

Verification checklist for the Onboarding & In-Product Communication phase. **This document is for checking, not record-keeping** — decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), New User.

**Persona convention:** Items prefixed with **Any persona** are persona-agnostic — verify with whichever persona is already active, no need to switch. Items prefixed with a specific persona name (Tereza, Daniel, etc.) require that persona because the page reads persona-specific data (locked relationships, owned groups, tier badges, etc.).

---

## V1.1 — Privacy explainer page + lock-card link

The canonical "how does this work" destination for the trust model. Wired from the locked-profile lock card and reachable directly via URL. Page content is fully static.

- [x] **V1.1.a — Any persona → `/help/privacy`.** Page renders with all six sections (Intro, Private or public, Familiar, Connected, "When you already know each other", "If you offer care"). Sidebar nav on desktop, back-arrow + title in the AppNav on mobile.
- [x] **V1.1.b — Any persona → `/help/privacy#familiar`.** Anchor scrolls to the Familiar section. Same for `#open-vs-locked`, `#connected`, `#share-link`, `#tier`.
- [ ] **V1.1.c — Daniel → `/profile/marek?as=daniel`.** Locked profile. Lock card renders. Tap "Learn how privacy works" link → routes to `/help/privacy` (no more dead anchor). Browser back returns to Marek's locked profile.
- [ ] **V1.1.d — Any persona → `/help/privacy` on mobile width (resize to 375px).** Page reads cleanly — no overflow, headings stack, body text wraps. Anchor links still navigate. Mobile detail header (back arrow + "How privacy works") shows in the AppNav.

---

## V1.2 — Group visibility chip clarity

Chip label rewrite + tap-tooltip explainer. Four callsites; verify all four. Chip rendering and tooltip behaviour are persona-agnostic — only the *which group is shown* depends on persona.

- [ ] **V1.2.a — Any persona → `/discover/groups`.** Group cards render with new labels: "Approval to join" or "Private · approval to join" where the visibility is `approval` or `private`. Open groups still render no chip.
- [ ] **V1.2.b — Any persona → `/discover/groups`.** Tap an "Approval to join" chip → popover opens with explainer ("Anyone can see this group. Joining requires admin approval."). Tap-away closes. (CardGroup callsite)
- [ ] **V1.2.c — Any persona → `/communities` (left panel group list).** Group cards in the panel render with new labels. Tap chip → popover opens. (GroupCard callsite — verify if used here, or alternate surface)
- [ ] **V1.2.d — Tereza → `/communities/group-tereza-neighbourhood?as=tereza`.** Vinohrady Evening Walkers — private/approval group. Detail panel header chip reads new label; tap → popover. (GroupDetailPanel callsite — Tereza needed because she's an admin/member with access.)
- [ ] **V1.2.e — Daniel → `/communities/group-reactive-dogs?as=daniel`.** Reactive Dog Support — private group. Standalone group page header chip reads "Private · approval to join"; tap → popover ("Hidden from non-members. Joining requires admin approval."). (app/communities/[id]/page.tsx callsite — Daniel needed because he's a member.)
- [ ] **V1.2.f — Any persona → tap chip, then tap chip again.** Toggle: tap closes popover. Multiple chips on the same page work independently (only one open at a time is fine, but no visual stuck state).

---

## V1.3 — Familiar asymmetry explainer on own-profile About tab

Persistent card, low-key, on own profile. Card itself is persona-agnostic — it renders the same on every own-profile. The persona-specific items below verify it shows across different account shapes (Locked vs Public, Helper vs Provider).

- [ ] **V1.3.a — Any persona → `/profile?tab=about`.** About tab renders. Familiar asymmetry card visible in the stack — title "About marking people Familiar" + body explaining the asymmetric grant + link "Learn more about how privacy works →".
- [ ] **V1.3.b — Any persona → tap "Learn more" link.** Routes to `/help/privacy#familiar` and scrolls to the Familiar section.
- [ ] **V1.3.c — Daniel → `/profile?as=daniel&tab=about`.** Same card renders on a Locked-profile persona (confirms no privacy-state gating).
- [ ] **V1.3.d — Klára → `/profile?as=klara&tab=about`.** Same card renders on a Provider-tier persona (confirms no tier gating — explainer is about Familiar mechanics, not tier).
- [ ] **V1.3.e — Any persona → `/profile/daniel?as=tereza`** (or any other-user profile). Other-user profile About tab does NOT show the explainer card (it's an own-profile-only surface).

---

## V1.4 — Tier-badge tooltip

Tap a Helper or Provider badge → explainer popover with link to /help/privacy#tier. **Persona-dependent throughout** — tier badges render on PersonRow surfaces (Members tab, People tab) and visibility of the Helper badge is gated on viewer-Connected status, so the right viewer needs to be active to see the right badges.

- [ ] **V1.4.a — Daniel → `/communities/group-tereza-neighbourhood?as=daniel&tab=members`.** Tereza or another Helper-tier member's row shows the Helper badge (Daniel needs to be Connected to see it). Tap → popover with "Helper — …" copy + "How tiers work →" link.
- [ ] **V1.4.b — Any persona → `/communities/group-tereza-neighbourhood?tab=members`** (default Tereza works). A Provider-tier member's row (e.g. Shawn under FAMILIAR section) shows the Provider badge. Tap → popover with "Provider — Shawn offers care…" + link to `/help/privacy#tier`.
- [ ] **V1.4.c — Klára → `/communities/group-klara-training?as=klara&tab=members`** (or any group with carer attendees). Tier badges render on rows. Same popover behaviour.
- [ ] **V1.4.d — Any persona → tap a tier badge → tap "How tiers work →" link.** Routes to `/help/privacy#tier`.

---

## Cross-cutting

- [ ] **X.a — Tereza → `/profile/daniel?as=tereza`** (locked profile, no shared context). Lock card still renders cleanly without the Familiar action surface (no shared context). "Learn how privacy works" link works. (Persona-dependent: Tereza viewing Daniel verifies the no-context lock-card path.)
- [ ] **X.b — Any persona → mobile + desktop parity.** All touchpoints work at 375px and 1280px widths. Tap-tooltips (V1.2, V1.4) anchor correctly at both widths.
- [ ] **X.c — Avoid-list intact.** No edits to `components/messaging/*`, `ProfileServicesTab.tsx`, `AvailabilityGrid.tsx`, `app/discover/care/*`, `lib/pricing.ts`, or pricing-related sections of `lib/types.ts` and `app/globals.css`. (Inspection check, not a click-through — no persona switch needed.)

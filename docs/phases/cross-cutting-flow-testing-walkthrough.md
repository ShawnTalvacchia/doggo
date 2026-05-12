---
status: active
last-reviewed: 2026-05-11
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Cross-Cutting Flow Testing — Walkthrough

Verification checklist for the Cross-Cutting Flow Testing phase. **Primarily for checking** — decisions and follow-ups belong in the phase board, Open Questions log, or feature docs. Emergent decisions land in the **"Decisions surfaced during walkthrough"** section at the bottom.

**Scope rule.** This phase tests the thesis that *every persona's journey holds end-to-end with no dead ends*. The pre-loaded data-hygiene seeds (D1–D4 edge cases) and the People-tab disclosure model (P32) are the structural changes to verify. Wider regression / cross-persona permutation work goes in `verification-checklist.md` if it surfaces.

**How to use:**

1. Dev server runs on port 3000.
2. Switch personas via profile-name dropdown, `/demo`, or `?as=<personaId>`.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza, Daniel, Klára, Tomáš, New User.

**Pre-walkthrough reset.** Before walking, hit `/demo` → "Reset demo state" so any cached connection overrides from prior sessions don't mask the seeded edge cases.

---

## Workstream A — D1–D4 edge-case seeding (data-only)

Each persona has one canonical upcoming meet seeded with D1 (tier-2 unmarked open), D2 (tier-2 inbound Familiar — deniability), D3 (Pending pill). D4 (following + non-attendee) is satisfied via `SEED_FOLLOWERS` on a different recurring series per persona.

### A1 — Tereza on `/meets/meet-15?as=tereza`

Thursday Riegrovy walk, weekly. Tereza is creator + attendee.

- [x] **A1.1 — People tab.** On the People tab, verify the following sections / rows:
  - **Connected:** Marek.
  - **Familiar / Open (tier 2):** Shawn (Familiar both directions + Open), Nikola (D1 — Open, no relationship), Filip (D2 — *no pill rendered; row simply present in tier 2*; promotion driven by inbound Familiar, deniability rule means UI does **not** explain why).
  - **Pending:** Jakub (D3 — Pending pill).
- [ ] **A1.2 — D4 verification.** Open `/schedule?view=interested&as=tereza`. **"Morning walk — Riegrovy sady"** (meet-1, the Vinohrady Morning Crew weekly walk Tereza follows but doesn't attend) should appear in the Interested lane. *Note: meet-7 also has Tereza as a follower, but she's auto-seeded as an attendee on its upcoming dates so it dedupes into the Going lane instead of Interested.*

### A2 — Daniel on `/meets/meet-17?as=daniel`

Reactive dog walk Stromovka, weekly. Daniel is creator + attendee.

- [ ] **A2.1 — People tab.** Verify:
  - **Connected:** Hana.
  - **Familiar / Open (tier 2):** Vítek (Familiar both directions), Petra (D1 — Open, no relationship), Marek (D2 — *no pill; row in tier 2 via inbound Familiar*).
  - **Pending:** Lucie (D3 — Pending pill).
- [ ] **A2.2 — D4 verification.** `/schedule?view=interested&as=daniel` should show **meet-5** and **meet-7** in the Interested lane (Daniel in followers, not in attendees).

### A3 — Klára on `/meets/meet-18?as=klara`

Klára's group training, weekly. Klára is creator + attendee.

- [ ] **A3.1 — People tab.** Verify:
  - **Connected:** Filip, Hana, Shawn.
  - **Familiar / Open (tier 2):** Petra (D1 — Open, no relationship), Jakub (D2 — *no pill; tier 2 via inbound Familiar*).
  - **Pending:** Jana (D3 — Pending pill).
- [ ] **A3.2 — D4 verification.** `/schedule?view=interested&as=klara` should show **meet-15** in the Interested lane (newly seeded — Klára follows Tereza's series but doesn't attend). Plus `meet-care-1` if the surface includes self-followed series (Klára follows her own).

### A4 — Tomáš on `/meets/meet-19?as=tomas`

Karlín riverside hangout, **one-off**. Tomáš is creator + attendee.

- [ ] **A4.1 — People tab.** Verify:
  - **Connected:** Petra, Ondřej, Adéla.
  - **Familiar / Open (tier 2):** Jana (D1 — Open, no relationship), Vítek (D2 — *no pill; tier 2 via inbound Familiar*).
  - **Pending:** Shawn (D3 — Pending pill).
- [ ] **A4.2 — D4 verification.** `/schedule?view=interested&as=tomas` should show **meet-12** (existing) and **meet-15** in the Interested lane. *meet-15 is newly seeded for Tomáš — he follows but doesn't attend.*

### A5 — New User on `/?as=new-user`

- [ ] **A5.1 — Empty state preserved.** No connections, no attended meets, no edge-case attendees on People tabs (per the empty-state design). `/schedule?view=interested` should render the empty Interested state.

---

## Workstream B — Cross-persona discovery walkthrough

Discovery sweep: switch persona, hit each top-level surface, note dead-ends. **Don't tick a row until you've actually clicked through the persona.**

### B1 — Tereza (`?as=tereza`)

- [ ] **B1.1 — `/home`.** Vinohrady-anchored feed reads coherent — group activity, Riegrovy posts, neighbour connections.
- [ ] **B1.2 — `/discover/meets`, `/discover/groups`, `/discover/care`.** Each surface populates; no empty-state on a populated archetype.
- [ ] **B1.3 — `/profile`.** Open profile renders Carer audience pill (circle), Franta + Bella pet cards, About / Posts / Services / Chat tabs.
- [ ] **B1.4 — `/bookings`.** Dual-tab view (My Care = Olga walking Franta; My Services = Tereza sitting Benny). Active session if any.
- [ ] **B1.5 — `/schedule`.** Upcoming + History tabs populated; no broken cards.
- [ ] **B1.6 — `/inbox`.** Conversation threads load; unread dots consistent with notification bell.

### B2 — Daniel (`?as=daniel`)

- [ ] **B2.1 — `/home`.** Reactive-dog-leaning feed; Klára training booking surfaces.
- [ ] **B2.2 — `/communities/group-reactive-dogs`.** Eva's admin posts, Hana's gratitude post, members tab leans Locked.
- [ ] **B2.3 — `/profile`.** Locked profile, sparse, Bára (reactive rescue) profile, Smíchov.
- [ ] **B2.4 — `/bookings/booking-klara-daniel`.** Recurring Wed booking, kd-1 through kd-5 sessions readable as relative dates.
- [ ] **B2.5 — `/schedule`.** Reactive Dog Support meets in Upcoming + History.
- [ ] **B2.6 — `/inbox`.** Klára thread surfaces; trust-arc framing readable.

### B3 — Klára (`?as=klara`)

- [ ] **B3.1 — `/home`.** Provider-side feed: training recaps, client posts.
- [ ] **B3.2 — `/communities/group-klara-training`.** Care config (training), Hosting suppressed CTAs, multi-client members tab.
- [ ] **B3.3 — `/profile`.** Open profile, Carer audience = anyone (public), Services tab with full catalogue.
- [ ] **B3.4 — `/bookings/booking-klara-daniel?as=klara`.** Provider-side view (session check-ins visible).
- [ ] **B3.5 — `/schedule`.** Training meets in Upcoming; cross-cluster (Stromovka, Reactive) past meets in History.
- [ ] **B3.6 — `/inbox`.** Client threads (Daniel + others); proposal artifacts visible.

### B4 — Tomáš (`?as=tomas`)

- [ ] **B4.1 — `/home`.** Karlín-leaning feed; Petra emergency-sitting story arc.
- [ ] **B4.2 — `/communities/group-karlin-neighbours`.** Petra's admin announcement, Filip/Adéla posts.
- [ ] **B4.3 — `/profile`.** Locked profile, Hugo, Karlín. Low-key user, provider switch off.
- [ ] **B4.4 — `/bookings`.** Past Petra emergency booking + any others; "trail of care arrangements that worked."
- [ ] **B4.5 — `/schedule`.** Karlín / Riegrovy meets in Upcoming + History.
- [ ] **B4.6 — `/inbox`.** Petra emergency thread surfaces with booking context on the row.

### B5 — New User (`?as=new-user`)

- [ ] **B5.1 — `/home`.** `getNewUserFeed()` welcome state — no connections, no completed meets.
- [ ] **B5.2 — `/discover/*`.** Discovery surfaces populate from public data (groups + meets visible; care = global directory).
- [ ] **B5.3 — `/profile`.** Empty pets, blank bio, locked. No carer config.
- [ ] **B5.4 — `/inbox` + `/bookings`.** Empty states render gracefully (no errors, no broken cards).

---

## Workstream C — Mock-date staleness sweep (P20)

Static dates that drive UI relative-time labels were checked. Fixes landed:
- `components/feed/FeedCard.tsx:formatRelativeDate` — removed hardcoded `now = "2026-03-23T12:00:00Z"` constant; uses `Date.now()` now. *Previously calculated bogus diffs against a fixed moment.*
- `lib/mockPosts.ts:post-klara-community` — migrated to `daysAgoIso(0, "10:30")` so the "Great session this morning!" caption aligns regardless of when the demo opens.

- [ ] **C1 — `/home?as=tereza`.** Klára's community post (Vinohrady Morning Crew) reads as "Just now" or "Xh ago" rather than "23 Mar."
- [ ] **C2 — Feed cards across all personas.** No timestamps render as future dates or absurd "Xd ago" values (e.g. negative).
- [ ] **C3 — Older feed posts (deeper history).** Still render as absolute date ("23 Mar") via the >7d fallback — these are intentionally static.

---

## Workstream D — People tab disclosure model (P32, **not yet implemented**)

Captured here so the verification slot is ready once the work lands. *This work has NOT started yet — check with user before opening.* The design:

- Pre-meet / any viewer: People tab renders owner+dog cards grouped by relationship state, **no action pills**.
- Post-meet / attendee viewer: same content **+ action pills** (Familiar, Connect, Message).
- Post-meet / no-show viewer: same as pre-meet — no actions.
- Locked attendees → chip list at bottom (matches post-meet review treatment).

- [ ] **D1.** Tereza on meet-15 (upcoming): grouped-by-relationship-state cards visible; **no action pills**.
- [ ] **D2.** Tereza on a completed meet she attended: same content + action pills.
- [ ] **D3.** Tereza on a completed meet she didn't attend (e.g. via direct URL): no action pills.
- [ ] **D4.** Locked attendees rendered as chips at bottom across all viewers.

---

## Decisions surfaced during walkthrough

Emergent decisions, design changes, or rationale that surfaced during verification and need to land in their proper home docs. Append as you walk.

- [ ] **P21 (Group ↔ meet dedupe) confirmed already complete from Mock World Building A2 (2026-04-30).** Cross-Cutting Flow Testing inherited it on the board but no new work was needed. → `phases/cross-cutting-flow-testing.md` mark this item as inherited.
- [ ] **P28 (MeetAttendee.profileOpen auto-derive helper) confirmed already complete from MWB A3.** `buildMeetAttendee` helper lives in `lib/mockMeets.ts`. → mark inherited.
- [ ] **P36 (profileVisibility distribution skew) substantively closed from MWB B1; new bridged providers (7) added in Discover Refinement + Care Catalog pushed the ratio from 70/30 toward 55/45.** Providers must remain Open by spec. The non-provider Open set is just `eva` + `jana` (anchors) — exactly the documented rule. → mark inherited; note in phase board.
- [ ] **`FeedCard.formatRelativeDate` was using a hardcoded `now` from MWB era.** Fixed during P20 sweep. → no feature-doc update needed (implementation bug fix).

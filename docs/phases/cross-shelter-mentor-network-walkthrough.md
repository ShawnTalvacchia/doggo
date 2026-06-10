---
status: active
last-reviewed: 2026-06-10
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Cross-Shelter Mentor Network — Walkthrough

Verification checklist for the Cross-Shelter Mentor Network phase. **Concise by design** — the build was driven end-to-end in the preview during development (mentee loop, graduation, solo walk booking, portability, non-accepting fallback, credit toggle all exercised); this walkthrough surfaces what's worth YOUR judgment.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/` launcher, or the `?as=<personaId>` URL param.
3. **Most items want a fresh demo state** — clear localStorage (or use a private window) before V1; later V items build on V1's state deliberately.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Key state for this phase:** Útulek accepts mentor-vouches (min 3) · Pes v nouzi accepts (min 5) · Druhá šance does NOT accept. Klára is seeded as Útulek's second trusted walker (64 walks · 60 shelter-credited) and the only mentor (450 Kč/session at Útulek + Pes v nouzi).

---

## Open for your call

Decisions made during the build instead of stopping to ask — ratify or redirect (CONTRIBUTING.md → decide-and-flag).

- [ ] **O1. Mentor booking skips the inquiry → proposal → sign round-trip.** The sheet creates the Booking directly and drops a two-message exchange into the mentor conversation. Rationale: price is fixed (no quote to negotiate), the mentee may have no dog (no pet selection), and the product is graduation progress — the Care machinery doesn't apply. The board's B1 hinted at "chat-based slot per prototype convention"; this is a deliberate departure. (Tomáš → `/profile/klara?tab=services` → Book a session on "Mentored shelter walk".)
- [ ] **O2. Tomáš is the storyline mentee.** Pre-approved direction ("reuse a persona, not Daniel") — ratify the specific pick. He's the A8 latent-demand thesis in person (9–6 professional whom Útulek's weekday filter excludes); his thread doesn't touch the V2 Daniel→Klára narrative. (Drive V1 as Tomáš.)
- [ ] **O3. Platform Super Volunteer renders as a status pill on the Volunteer-work section title row** + "Recognized at every participating shelter" subtitle — no walk-count totals (those were dropped 2026-06-09; the tier is a status, not a stat). This is the reconciliation flagged at phase open (conflict 5). (Tomáš → `/profile/klara` → Volunteer work.)
- [ ] **O4. Demo platform-tier rule: cross-shelter walks ≥ 25 AND ≥ 1 trusted affiliation.** The Playbook's production rule ("≥2 trainer vouches") isn't modeled — vouch records don't exist as data. Marie (32 walks, experienced) correctly does NOT resolve as platform Super Volunteer. (Code: `lib/volunteerTier.ts:getPlatformVolunteerTier`.)
- [ ] **O5. Klára's bootstrap is seeded statically** (Útulek roster: 64 walks, 60 credited) rather than driven live, so the world is coherent from any entry point — her mentor offering must be live before the demo's first beat. The crediting MECHANISM stays drivable live via the toggle (V4). (Útulek → Members → Klára H. row.)
- [ ] **O6. "Credit historical walks (demo)" acts on the CURRENT USER at this shelter** (+25 credited walks, auto-vouch if needed). It's an operator stub in walker clothing — honest per scope discipline 2, but a coordinator watching might ask why the walker can credit themselves. Alternative: hide it deeper. (Any persona → any shelter → walker-button dropdown.)
- [ ] **O7. Mentor service card uses neutral chip chrome** ("Shelter mentoring" + duration + shelter-name chips) — not the violet volunteer family or the blue care family. It's a PAID service (blue?) rendered next to volunteer credentials (violet?); neutral dodges the conflict. Could go either way. (`/profile/klara?tab=services`.)
- [ ] **O8. Graduation message comes from the MENTOR, not "the shelter."** Shelters can't message (no institutional conversation infra); Klára announcing her own vouch ("I've vouched for you at Útulek") is honest and warmer than faking a shelter sender. (Inbox after V1's third session.)
- [x] **O9. The shelter-facing demo drives the storyline LIVE from fresh state** rather than pre-staging Tomáš mid-mentorship (board H1 said "pre-staged"). The state-toggles make live driving fast, and a pre-staged state would collide with demonstrating the booking beat. **Ratified 2026-06-10** — live-drive stands for coordinator interviews; feature-focused GUIDED walkthroughs (with per-walkthrough pre-staged state) are future work after the feature/surface arc settles → see FC17 in `planning/Future Considerations.md`.

---

## Worth verifying

- [ ] **V1. The full mentee loop, fresh state, as Tomáš.** Clear localStorage → `/shelters/utulek-liben?as=tomas`. The "New to shelter walking?" mentor card shows Klára at 450 Kč. Book a mentored walk → sheet shows shelter picker (Útulek/Pes v nouzi), "session 1 of 3" context, BOTH waiver rows as checkboxes → tick + date + submit → success names the remaining-session count. Button now reads "In mentorship · 0/3"; progress line below the action row. Dropdown → Complete mentor session (demo) ×3 → button flips to "Vouched walker", graduation message lands in Inbox from Klára, the mentor booking in `/bookings` shows completed with a sealed report.
- [ ] **V2. Waiver sign-once carry-over.** Continuing V1's state: book a mentor session at Pes v nouzi (via Klára's profile, switch the shelter pill). The platform waiver row shows "signed {date} — carries across shelters" ✓; the Pes v nouzi waiver row is a fresh checkbox. Graduation context says 5 sessions (their override), not 3.
- [ ] **V3. The real solo walk (P77's replacement).** Continuing V1: `/dogs/shelter-dog-tonda?as=tomas` → status "You walk at Útulek Liběň" → Walk Tonda opens the WalkBookingSheet (not a dropdown) → book → `/bookings` My Services shows "Útulek Liběň · Tonda · Volunteer · no charge" → detail page: shelter logo as the partner, partner link routes to `/shelters/utulek-liben`, PET INFO resolves Tonda from the roster. Start → Finish the session and confirm the Members-tab walk count ticks up (booking-derived).
- [ ] **V4. Credit toggle + provenance.** Any persona at a thin shelter → apply (or not) → walker-button dropdown → Credit historical walks (demo) → instantly vouched, Members row reads "25 walks · 25 credited by the shelter", profile Volunteer-work row carries the same provenance.
- [ ] **V5. Druhá šance non-accepting posture.** As a mentee with sessions (post-V1 Tomáš): no mentor card on their Feed; apply → sheet carries "Mentor-recommended · 3 sessions with Klára Horáčková"; after applying, the progress line explains the shelter reviews walkers directly.
- [ ] **V6. Eligibility still composes.** As a freshly-vouched vetted walker, an `experiencedHandlersOnly` dog (Šimon, Berta) shows the explanatory state with a DISABLED Walk button; Tonda books fine. Strictest-rule-wins unchanged.
- [ ] **V7. Klára's surfaces as the mentor.** `/profile/klara`: Volunteer work shows the Super Volunteer platform pill + "64 walks · 60 credited by the shelter"; Services tab shows the mentor card with shelter chips; her OWN Services edit mode shows the read-only mentor card ("managed with the shelters you mentor at"). At Pes v nouzi her application sheet shows the Super Volunteer recognition line; she does NOT see her own mentor card anywhere.
- [ ] **V8. V2 demo narrative untouched.** Run the guided walkthrough from `/`. Klára's Services surfaces now include the mentor card (additive); confirm no beat's framing breaks and the Daniel thread plays as before.

---

## Decisions surfaced during walkthrough

*(Append as you walk — each entry carries a `→ target-doc.md` annotation for the phase-close sweep.)*

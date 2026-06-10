---
category: meta
status: active
last-reviewed: 2026-06-09
tags: [roadmap, phases, planning]
review-trigger: "at the start and end of every phase"
---

# Doggo — Product Roadmap

**Goal:** A demo-quality prototype that makes testers forget they're looking at a prototype. When someone sits down with a persona, the world should feel real — the data, the interactions, the flow between pages.

**Process:** Phase lifecycle in `CONTRIBUTING.md`. Phase boards in `phases/`. Archive in `archive/phases/`.

---

## Principles

1. **Build the best version, not the fastest.** Quality over speed.
2. **Think like a user.** Every page should feel useful, clear, and trustworthy.
3. **No phase ships without working content.** Empty tabs and placeholder text are bugs.
4. **Each phase starts and ends with a doc review.** Read referenced docs, update stale ones, check open questions.
5. **The demo is the finish line.** Every phase makes the world richer and more convincing.

---

## Where We Are

The full product skeleton exists. Every page renders with real content and working interactions. But many surfaces are 60-70% — they tell the story at a glance but don't hold up under scrutiny. The path forward is deep page-by-page passes, then world-building, then demo packaging.

**30+ phases completed.** Full history in `archive/phases/`.

**Punch list:** `planning/punch-list.md` — runs alongside whatever phase is active.

---

## Upcoming Phases

Reorganized 2026-06-09 after Carer Portfolio + Shelter Walker Credentialing close. The credentialing-moat phase landed end-to-end: shared three-tier `.credential-pill` family powering both the Carer Portfolio aggregate (carer family — blue, Sparkle) and the Volunteer badge (volunteer family — violet, Plant/Tree), state-toggle walker journey (apply → invited → vouched + walk count → tier escalation), per-dog eligibility states on the dog hero, shelter-membership sort elevation on `/discover/help-a-dog`, "Volunteer work" cross-shelter section on user profiles, CareReviewSheet for booking review round-trip + `BookingReview` shape. **Cross-Shelter Mentor Network is next** — the moat phase laid the foundation (state machine, per-shelter affiliation, walker tier model, Booking ownerKind discriminator); the Mentor Network phase is what turns it into a scalable trust unlock. Prior shifts retained: (a) **shelter direction graduated** to an active strategic thread (Shelter Foundation shipped 2026-06-02), (b) **Dog Profile shipped 2026-06-03** — unified `/dogs/[id]` surface, (c) **Help a Dog Discover door shipped 2026-06-08** — three seeded shelters with the elevated sort hook in place, (d) **Photos & Galleries shipped 2026-06-07** — unified Posts/Highlights, PostKebabMenu, PostLightbox.

| Phase | Goal | Key refs |
|-------|------|----------|
| **Service Options & Booking Clarity** *(next — draft, sized 2026-06-02 from PO interviews; W/A half-day Care SKU already shipped)* | Three workstreams of booking-flow transparency: A) Day-care half-day SKU via `durationOptions` mirror (shipped); B) Appointment meeting-options (where does training happen?) — carries the generalise-vs-separate + curated-vs-free-form design Qs as Pre-build scope calls; C) Walks pickup/drop-off address specificity. Generalises the Walk Service Delivery pattern across walks + appointments + day-care duration. Small remaining scope; slot in as palate-cleanser between bigger phases. | `meetings/po-briefing-2026-06-02.md`, `phases/service-options-and-booking-clarity.md`, `Open Questions §17` |
| **Cross-Shelter Mentor Network** *(sized 2026-06-09 — strategic anchor for the credentialing-as-moat thesis)* | The mentor-vouching mechanism that turns the credentialing layer into a scalable unlock. Two halves, one phase: **Mentor side** — new `mentor_session` service type on `CarerServiceConfig`; Super Volunteers offer paid mentor sessions at shelters that accept mentor-vouches; mentor session is a Booking shape with sponsor reference + shelter context; mentor service surfaces on Carer profile (alongside walks/sitting/etc.). **Cross-shelter side** — Super Volunteer promoted to platform-level tier (not per-shelter); profile renders portable credentials with shelter context ("Super Volunteer · Útulek 87 walks · vouched by Klára H., Pavel D."); per-shelter waiver layer separated from platform-level baseline (identity + emergency contact + general liability signed ONCE); per-shelter policy controls `acceptsMentorVouches?: boolean` + `mentorSessionMinimum?: number` overrides; bootstrap affordance for shelter admins to credit historical real-world walks. Lands the platform's "trust gets built here" positioning. Carries the strategic pitch to real shelters: less admin burden + higher-quality + larger walker pool + portable credentials, without giving up shelter authority. | `Cold-Start Playbook.md` → "Mentor-vouching as the scalable trust mechanism" + "Walker credentialing as a shelter trust layer", `Open Questions §14`, `features/shelters.md` (per-shelter policy extension) |
| **Adoption-Curious Doorway + Multi-Path Demo** *(sized 2026-06-09)* | Add a second demo doorway aimed at non-dog-owner / adoption-curious users. New persona shape (someone considering ownership for the first time, walking shelter dogs to explore before committing); adoption-curious discovery surface (tuned for "explore before commitment"); mentor session as the natural entry point (paid supervised first walks → solo walker status → ongoing volunteering → potential adoption). Existing V2 demo (Daniel → Klára → Daniel walker-trainer thread) stays intact and runs in parallel — this adds a parallel path, doesn't reshape the existing one. Cuts each individual demo path tighter so multiple paths stay streamlined. Connects volunteer journey to adoption journey as a natural funnel. Depends on Cross-Shelter Mentor Network for the mentor mechanic to exist. | `features/demo-mode.md`, `strategy/Demo Narrative.md`, `Cold-Start Playbook.md` → "Adoption-curious / pre-adopter persona" |
| **Onboarding & Communication (rewrite)** *(paused — needs re-scope when surfaces stabilize)* | With shelter direction landed, Carer Portfolio shipped, the Mentor Network mechanism in place, and the multi-doorway demo defining who's onboarding for what, the onboarding question is finally well-posed. Re-scope from the archived 2026-05-04 board against the V2 walker-trainer narrative + multi-doorway personas (existing owner with reactive dog, adoption-curious explorer, trainer-walker offering mentor sessions, walker applying to shelter via mentor) + Photos & Galleries gates + four-service Care taxonomy + mentor-session as a service-config shape. **Pre-open block:** original board needs full re-read + reassessment; expect significant rewrite. | `archive/phases/onboarding-and-communication.md`, `Trust & Connection Model.md`, `Open Questions §2 + §3 + §4` |
| **Design System Cleanup** *(sized 2026-05-14; intentionally late in the arc)* | Consolidation pass before demo polish. Section shell component (FC4), IdentityChip (FC5), the recurring `flex-1 + white-space:nowrap` CTA pattern, P67 component-consolidation audit, the bundle-wrapper pattern applied 3+ times during PDP. Originally proposed earlier in the queue; deferred 2026-06-01 because by the time it runs there'll be additional shelter + Dog Profile + Carer Portfolio surfaces with new consolidation opportunities — cleaning up everything at once is higher leverage than a clean-then-make-mess-again cycle. | `Future Considerations.md` FC4/FC5, `planning/punch-list.md` P67, `docs/implementation/design-system.md` |

**Side tasks running alongside (not phases):**

- **Config #2 meet-side link authoring** *(small, technical — slot whenever)* — A meet-side editor declaring which drop-off Care services run on a meet. Needs a meet-edit screen (`MeetComposer` is create-only). Not blocking anything strategic; palate-cleanser between bigger phases. See `archive/phases/service-meet-linkage.md` Workstream H4.
- **Punch list** — Continuous. `planning/punch-list.md`.

Phase boards are created when a phase opens — that's where detailed tasks live. The research docs referenced above contain specific action items and open questions that feed into each phase's board.

---

## Key Considerations

Things to keep in mind across phases. Not tasks — lenses.

**Trust badges for providers.** Three-tier system (community-earned, credential, platform) that reinforces but doesn't replace the community trust model. Designed from how Prague providers actually build trust today. → `Competitive Research - Prague Dog Care Scene.md`

**Cold-start seeding.** Providers use meets/groups as a client acquisition channel, solving both sides of the marketplace simultaneously. Meets generate trust signals organically. → `Competitive Research - Prague Dog Care Scene.md`

**Session experience.** Visit report cards, real-time updates, and a focused provider in-session UI are table stakes for care confidence. → `Competitive Research - Time To Pet.md`

**Hybrid trust model.** The three-tier badge architecture (community-earned > credential > platform) IS the hybrid model in shipped form. Community-built signals (visit reports, post-meet reviews, mutual connections, repeat-client counts) compose with credential signals (KYNOLOG.cz cert, methodology affiliations, shelter walker tier badges, Carer Portfolio aggregate) and platform signals (Verified Identity — taxonomy slot, not yet built). Credentialing layer is the **deliberate strategic moat** (per Open Questions §7 resolution 2026-06-01). → `Open Questions §2 + §7 + §8`, `Cold-Start Playbook.md`

---

## Beyond the Demo

Not yet planned, but will become relevant:

- Real backend (Supabase data model, auth, real-time messaging)
- Cold-start seeding execution (recruit providers, test the meets→clients loop)
- Production design pass
- User testing
- Insurance & dispute resolution
- Credential verification (self-declared → platform-verified)
- Live GPS during sessions (requires Supabase Realtime)
- Mobile native (React Native or PWA)

See `Open Questions & Assumptions Log.md` for the full list of unresolved questions.

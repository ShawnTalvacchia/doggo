---
category: strategy
status: active
last-reviewed: 2026-04-14
tags: [research, competitive, care, bookings, sessions]
review-trigger: "when designing care session flow, visit reports, booking UX, or provider tools"
---

# Competitive Research: Time To Pet

Research conducted 2026-04-14. Notes on features, positioning, and takeaways for Doggo.

---

## What Time To Pet Is

B2B SaaS for pet care businesses — dog walking, pet sitting, daycare. 4,000+ customers, primarily US-based. Solves the operational back-office: scheduling, staff management, client communication, invoicing, payments.

**Not a competitor to Doggo.** TTP assumes you already run a business with clients. Doggo is community-first — care emerges from trust built through meets and connections. Different category entirely.

**Pricing:** $25/mo (Lite solo), $50/mo (Solo advanced), $40/mo + $16/active staff (Team). No long-term contracts. Per-staff pricing gets expensive fast — a 10-walker team pays ~$200/mo.

---

## Features Worth Studying

### 1. Visit Report Cards (high priority)

After every walk or visit, the walker sends a report card to the pet parent containing:

- Photos from the walk/visit
- Written notes on behaviour, mood, activities
- GPS track of the route taken
- Time tracking (check-in/check-out timestamps)
- Delivered via push notification, email, or SMS

**Why this matters for Doggo:** This is the feature that makes pet parents feel safe and delighted. It turns an invisible service into a tangible, shareable experience. For Doggo's care session flow, the provider "Complete session" action should generate something similar — a session summary card with photos, notes, and optionally GPS data.

**Where it fits:** Booking detail → Sessions tab → individual session entries. The provider's "Complete" action could open a quick form (notes + photos + optional GPS summary) that becomes the session record visible to the owner.

### 2. Real-Time Walk Updates (medium priority)

During an active walk, pet parents can:

- See the walker's live GPS location on a map
- Receive mid-walk photo updates
- Get push notifications when the walk starts and ends

**Why this matters for Doggo:** This is a trust accelerator. For anxious owners (Daniel archetype), knowing exactly where their dog is right now reduces anxiety enormously. Even for confident owners, it's a "delight" feature.

**Where it fits:** Active session state on the booking detail page. When a provider hits "Start Session," the owner's view could show a live indicator. Full GPS streaming is complex (requires real-time infrastructure), but even a simpler version — start notification + mid-session photo + end notification — captures most of the value.

### 3. Automated Recurring Scheduling + Invoicing (already aligned)

TTP auto-generates invoices from completed services and handles recurring schedule templates. Doggo's rolling weekly billing model (one upcoming session at a time, `billingCycle: "weekly"`) is already well-aligned with this pattern. No changes needed, but good validation that we're on the right track.

### 4. Staff/Provider Mobile Workflow (medium priority)

TTP's staff app is purpose-built for field workers:

- View today's schedule at a glance
- Access client/pet info (keys, alarm codes, medication, vet details)
- Check in/out with GPS
- Complete events and send updates without leaving the app

**Why this matters for Doggo:** Doggo's provider experience currently lives within the same app as the owner experience, which is the right call (everyone starts as owner, care is a dial). But the provider's "active session" workflow should be equally streamlined — a focused mode that surfaces only what they need: pet info, session actions, photo upload, notes.

**Where it fits:** The booking detail page's provider view. When a session is active, the provider should see a simplified "in-session" state with quick actions rather than the full booking detail.

---

## Features That Don't Apply to Doggo

- **QuickBooks integration** — Doggo handles payments internally, no external accounting sync needed for prototype
- **Staff payroll reports** — Doggo providers are independent, not employees
- **Multi-staff scheduling/assignment** — Doggo is 1:1 provider-to-owner, not dispatching teams
- **Key/access management** — Not relevant for Doggo's care model (primarily walks, daycare, not home visits)

---

## Strategic Observations

### Doggo's Differentiation

TTP serves businesses that already exist. Doggo creates care providers from community members. The "everyone starts as owner, care is a dial" model is fundamentally different — there's no onboarding friction, no business setup, no staff management overhead. A neighbour who watches your dog twice a week doesn't think of themselves as running a pet care business, but they're providing real value. Doggo captures that.

### The Trust Gap TTP Doesn't Solve

TTP assumes the client already trusts the business. They found the dog walker through a referral or Google search, and now they need operational tooling. Doggo solves the harder problem upstream: how do you go from stranger to trusted enough to hand over your dog? The community → trust → care funnel is Doggo's moat.

### Vietnam/SEA Market Note

The Vietnam pet market is booming (~$500M, 12M+ cats and dogs). PetBacker is the main marketplace platform in the region. TTP has no localization for Vietnam or SEA. If Doggo ever expands beyond Prague, the community-first model could be especially compelling in markets where trust in strangers is lower and word-of-mouth matters more.

---

## Action Items for Doggo

| Item | Priority | Target Phase | Notes |
|------|----------|-------------|-------|
| Design visit report card for session completion | High | Bookings Deep Pass | Provider completes session → report card (photos, notes, GPS summary, timestamps) sent to owner |
| Add session start/end push notifications | High | Bookings Deep Pass | Owner gets notified when provider starts and completes a session |
| Design mid-session photo update flow | Medium | Bookings Deep Pass | Provider can send photo updates during active session, owner sees them in real-time |
| Explore live GPS during active sessions | Low | Post-demo / Technical | Requires real-time infrastructure (Supabase Realtime). Park for now, but note it as a future differentiator |
| Streamline provider "in-session" UI | Medium | Bookings Deep Pass | Focused mode during active session: pet info, quick actions, photo upload, notes field |
| Validate rolling weekly billing against TTP pattern | Low | Already aligned | Our spec matches. No action needed, just confidence |

---

## References

- [timetopet.com](https://www.timetopet.com/)
- [TTP Pricing](https://www.timetopet.com/pricing)
- [TTP Dog Walking Features](https://www.timetopet.com/dog-walking-software)
- [Capterra Reviews](https://www.capterra.com/p/144329/Time-To-Pet/)
- [Software Advice Reviews](https://www.softwareadvice.com/kennel/time-to-pet-profile/reviews/)

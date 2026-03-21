---
category: strategy
status: active
last-reviewed: 2026-03-18
tags: [scope, prototype, priorities]
review-trigger: "before adding new features or starting a new flow"
---

# Doggo — Prototype Scope

This document defines **what the Doggo prototype needs to demonstrate** and in what priority order.

The primary goal is a **demo-quality interactive prototype** — good enough for user testing and investor conversations. Community-first is the strategic thesis, and the prototype shows the full product vision: meets build trust, trust enables care, care is booked and tracked.

## Related docs

- [[Product Vision]] — product strategy, principles, business model
- [[User Archetypes]] — who we're building for
- [[Trust & Connection Model]] — trust principles and connection states
- Feature specs in `features/` — detailed feature docs

---

## Strategic Direction

**Community-first.** Meets build relationships → relationships build trust → trust enables paid care. The community is the acquisition and trust layer; the marketplace emerges from it.

**Prototype-first.** Flesh out the product, create an interactive prototype for testing and investment. Features are built to demo quality — realistic flows with mock data, not production infrastructure. Decisions about what to make "real" come later.

---

## Feature Flows — Priority Tiers

### Required — Demo the full product story

These flows are needed to tell the complete Doggo story end-to-end.

| Feature | Status | Feature doc |
|---------|--------|-------------|
| **Landing page** | Built (needs Phase 6 review) | — |
| **Signup flow** | Built | `docs/implementation/signup-reference.md` |
| **Nav restructure** | Built | [[Product Vision]] nav section |
| **Home feed** | Built (needs Phase 6 overhaul) | — |
| **Groups & Meets** | Meets built; Groups not yet built | [[meets]] |
| **Connections & visibility** | Built | [[connections]] |
| **Schedule** | Built | [[schedule]] |
| **Messaging** | Built | [[messaging]] |
| **Explore / provider search** | Built | [[explore-and-care]] |
| **Provider profiles** | Built | [[profiles]] |
| **Bookings & care tracking** | Built | [[explore-and-care]] |
| **Owner profile + edit mode** | Built | [[profiles]] |
| **Pet profiles (enhanced)** | Built | [[profiles]] |

All Required features are built. Phase 6 focuses on auditing and polishing them.

---

### Nice-to-have — If time and momentum allow

These strengthen the demo but aren't needed to tell the core story.

| Feature | Notes |
|---------|-------|
| **Payment mock** | Fake checkout/confirmation screen at end of booking flow. |
| **Business profiles & directory** | Local pet businesses (vets, groomers, shops). Separate from individual providers. |
| **~~Private groups~~** | ~~Invite-only meets with persistent chat and gallery.~~ **Promoted to Required** — groups (public + private) are now considered essential to the meets architecture. See [[meets]]. |
| **Photo gallery per meet** | Post-meet photo sharing. Social proof and engagement. |
| **Browse & discover** | Browse nearby Open owners/dogs outside of meets context. |
| **Provider onboarding tools** | Calendar, availability editor, pricing setup from profile. |
| **"Open to helping" toggle** | Profile signal that you'd accept care requests. |

---

### Out of scope — Not demoed

- Real payment processing (Stripe integration, actual charges)
- Platform fees and commission logic
- Cross-city expansion / internationalisation
- Mobile native app
- Real-time location ("who's at the park now")
- Walking route tracking
- Activity feeds / "last active" indicators
- Algorithmic matching beyond neighbourhood + dog compatibility
- Referral programs
- Insurance / liability features

---

## Hard Constraints

Non-negotiable regardless of priority tier.

- No feature that pressures users into visibility they didn't choose
- No fake or inflated trust/social signals
- No irreversible user actions without confirmation
- No real-time location data visible to others
- No unsolicited contact from strangers (None-state = unreachable)
- Community features remain free — no paywalls on core social functionality

---

## Success Criteria

The prototype is demo-ready when:

- A user can walk through the full story: sign up → find a meet → attend → connect → find care → book
- The community angle is immediately clear from the landing page
- Meets feel like the centre of the product, not an afterthought
- The trust progression (None → Familiar → Connected) is visible and intuitive
- Booking/care tracking flows are realistic enough to demo without caveats
- Design quality is consistent enough for investor/stakeholder presentations

---

## Revision Rule

Any proposal that adds or changes scope must answer:

1. Does it strengthen the demo story?
2. What tier does it belong to (Required / Nice-to-have / Out)?
3. If Required, what gets deprioritised to make room?

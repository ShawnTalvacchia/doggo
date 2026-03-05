# Doggo – MVP Scope Boundaries

This document defines **what Doggo will and will not attempt** in its first version, split by product version.
Its primary purpose is to prevent overbuilding, agent sprawl, and premature complexity.

If something is not clearly inside the current scope, it should be assumed **out**.

## Related docs

- Strategic scope uncertainties and unresolved assumptions live in **Open Questions & Assumptions Log** (`docs/Open Questions & Assumptions Log.md`).
- Trust model details live in **Trust Model** (`docs/Trust Model.md`).
- Implementation decisions, signup flow, and component inventory live in **Prototype Decisions** (`docs/prototype-decisions.md`).

---

## Which Version Are We Building?

**Now: Provider Version** — a marketplace-functional dog care discovery and booking app for Prague.
**Later: Community Version** — a proximity-based, non-commercial trust layer. Parked until Provider Version is validated.

These documents track the **Provider Version MVP**.

---

## Provider Version MVP Goals

The MVP exists to:

- Validate that **Prague dog owners will use a local, trust-forward marketplace** for finding dog care providers
- Support **provider discovery with meaningful trust signals** (ratings, proximity, mutual connections)
- Enable **booking coordination** without full automation
- Demonstrate that a **high-quality, design-system-consistent prototype** is pitch-ready

The MVP does **not** aim to:

- Handle real payments end-to-end
- Support professional-scale provider tooling (scheduling, route optimization, invoicing)
- Optimize for growth, referrals, or virality
- Build the Community Version features

---

## In Scope — Provider Version (Must-Haves)

### User Accounts

- Signup flow: profile → pet → role selection → service preferences → success
- Owner and Provider roles (role determines which features are shown)
- Basic profile display (photo, name, neighbourhood)

### Provider Discovery

- Explore page with filterable provider results
- Provider profile pages (photo, bio, services, ratings, reviews)
- Filter by service type, availability, location radius

### Trust & Quality Signals

- Star ratings and review counts on provider cards and profiles
- Neighbourhood proximity indicator
- Verified / response-rate indicators (where data exists)
- Provider trust badges (future: mutual connections)

### Service & Booking Basics

- Service types: dog walking, drop-in visits, boarding, daycare
- Availability display
- Contact / message initiation (actual booking flow is post-MVP)

### Safety (Baseline)

- Basic reporting
- Clear participation boundaries
- Opt-out and privacy controls

---

## Conditional / Experimental (Nice-to-Have)

These may be included **only if time and clarity allow**.

- Inline booking flow (initiate a booking request within the app)
- Saved / favourited providers
- Provider response time tracking
- Mutual connection display ("2 people you know use this provider")

These features should be:

- Clearly labelled as experimental
- Easy to disable or remove

---

## Explicitly Out of Scope — Provider Version MVP

### Full Payment Infrastructure

- Payment processing (Stripe, etc.)
- Platform fees and commissions
- Dynamic pricing
- Invoicing or payouts

### Professional Provider Tooling

- Advanced scheduling calendar
- Route optimization
- Multi-dog / staff management

### Social / Community Features

_These belong to the Community Version, not this MVP._

- Familiar faces / seen-before indicators
- Shared walk or meetup tracking
- Personal "familiar" lists
- Non-commercial help requests

### Growth & Scale

- Referral programs
- Virality loops
- Cross-city expansion
- Internationalization

---

## Hard Constraints — Provider Version

These are non-negotiable for v1.

- No feature that pressures owners into booking they are not ready for
- No fake or inflated trust signals
- No irreversible user actions without confirmation
- No assumptions about professional scale (multiple staff, complex routing)

---

## Exit Criteria — Provider Version MVP "Success" Signals

The MVP can be considered successful if:

- A Prague dog owner can complete signup and find a relevant local provider in under 5 minutes
- Provider profiles feel trustworthy and informative (ratings, bio, services are clear)
- The design system and flow quality is consistent enough to present to stakeholders/investors
- A founder can demo the app without narrating around broken flows

Revenue is **not** a success criterion for v1.

---

## Revision Rule

Any proposal that changes or expands scope must answer:

1. Which version does this apply to?
2. What assumption does it test?
3. Why can't it wait?
4. What gets removed or deprioritised to make room?

If these cannot be answered clearly, the proposal is out.

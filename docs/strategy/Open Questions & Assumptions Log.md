---
category: strategy
status: active
last-reviewed: 2026-03-18
tags: [questions, risks, assumptions]
review-trigger: "after any strategic discussion"
---

# Doggo — Open Questions & Assumptions Log

This document tracks **known unknowns**, assumptions, and risks.
Its purpose is to make uncertainty explicit, visible, and actionable — not to resolve everything upfront.

## Related docs

- [[Product Vision]] — product strategy and principles
- [[Prototype Scope]] — what's in and out of scope
- [[Trust & Connection Model]] — trust principles and connection states

---

## How to Use This Document

- Add questions as soon as they arise
- Do not rush to resolve them
- Mark assumptions clearly
- Revisit this log at each major product decision
- Questions move: **Open** → **Partially Answered** → **Resolved** (never deleted without reason)

---

## 1. Community Adoption

**Assumption:**
Prague dog owners will use an app for social dog meets rather than sticking with WhatsApp/Facebook groups.

**Open Questions:**

- Will owners use Doggo to organise meets, or is WhatsApp good enough?
- What's the minimum neighbourhood density for community features to feel alive?
- How do we seed initial activity without it feeling artificial?
- What's the "aha moment" — the first experience that makes a user come back?

---

## 2. Trust & Connection Model

**Assumption:**
The four-state connection model (None → Familiar → Pending → Connected) maps to how people actually build trust IRL.

**Resolved:**

- Familiar is one-sided (you grant visibility). Connected is mutual (both accept). *(March 2026)*
- Post-meet attendee list is the primary connection trigger. Browse/discover is secondary, Open users only. *(March 2026)*
- Care services surface only within Connected relationships. *(March 2026)*
- Connection model is universal — same between any two users (owner↔owner, owner↔carer). No separate "provider relationships." *(March 2026)*
- Trust ladder (5-level progression) replaced by connection states. Trust is signalled contextually, not through levels. *(March 2026)*
- Post-meet connect prompt built — shows attendees with connect/familiar actions. *(March 2026)*

**Open Questions:**

- How many IRL interactions before users feel comfortable going from Familiar → Connected?
- Do users prefer explicit confirmation ("connect with this person") or implicit signals?
- Will Locked users feel excluded, or empowered?

---

## 3. Meets & Real-World Interaction

**Assumption:**
Low-pressure, dog-centred meetups are socially acceptable and desirable in Prague's park culture.

**Resolved:**

- Meets are owner-created. Five types: Walk, Park hangout, Playdate, Training session, Outing. *(March 2026)*
- Recurring meets work on a weekly basis with per-occurrence attendee lists. *(March 2026)*
- Each meet has a persistent page, group thread, and attendee list. *(March 2026)*

**Resolved:**

- Meets need a persistent container: Groups. Groups are the ongoing community; meets are events within them. Standalone meets don't provide enough structure for between-event conversation, photo sharing, or recurring coordination. *(March 2026)*

**Open Questions:**

- Can the platform suggest meets (e.g., "3 regulars walk near Letna on Tuesdays — create a meet?")?
- What's the minimum structure needed to avoid awkwardness?
- What's the right max group size for different meet types?
- Should meet discovery include a map view?
- Who can create groups? Any user, or minimum activity level?
- Public vs private group defaults — should new groups default to public?
- Can any group member create meets, or only admins?
- How do private group invitations work — admin-only, or any member can invite?
- Can a group exist without upcoming meets (purely social / chat)?

---

## 4. Owner-to-Provider Funnel

**Assumption:**
Users are comfortable evolving from owner → helper → occasional provider when framed as community contribution rather than gig work. There is no separate provider identity — it's a dial, not a switch.

**Resolved:**

- No separate provider signup or account type. Offering care is a toggle/dial from existing profile. *(March 2026)*
- Provider profiles use the same layout as owner profiles, with additional sections. *(March 2026)*

**Open Questions:**

- At what point does "helping" feel like a job? Does that matter?
- Do helpers set their own prices? Is there a suggested range?
- How visible is pricing before a formal care arrangement?
- What's the natural conversion rate from meet attendee to care provider/consumer?
- Where exactly does the "open to helping" toggle live? What options does it include?

---

## 5. Safety & Liability

**Assumption:**
Lightweight safeguards + Locked-by-default + mutual Connected status are sufficient in early stages.

**Open Questions:**

- What liability does the platform assume during meets?
- Are disclaimers enough, or are additional safeguards expected?
- Does blocking someone remove you from their view of a public meet you've both joined?
- What about private groups you're both in?
- Are there age restrictions? How do we handle minor/vulnerable users?
- What incidents require trust regression (e.g., removing Connected status)?

---

## 6. Monetization Timing

**Assumption:**
Trust must exist before monetization is introduced. Community features stay free.

**Open Questions:**

- What user behaviour indicates readiness for paid care transactions?
- At what point does the trust flywheel generate enough transactions to sustain the platform?
- Does monetization reduce trust if introduced too early?
- Should payment be peer-to-peer first or platform-mediated from the start?
- Do business owners in Prague's pet industry see value in a community-embedded directory?

---

## 7. Cultural & Local Norms (Prague)

**Assumption:**
Prague dog culture values routine, parks, and informal socialisation. Letna, Stromovka, Riegrovy sady are the right seed neighbourhoods.

**Open Questions:**

- Are there existing informal dog-owner networks we're replicating or competing with?
- What expectations exist around verification and identity in Czech culture?
- Are there local sensitivities around data visibility or privacy (GDPR awareness)?
- Are the chosen seed neighbourhoods actually the densest for dog owners?

---

## 8. Platform & UX

**Assumption:**
Five mobile tabs (Home | Meets | Schedule | Inbox | Profile) is the right structure and won't feel crowded.

**Resolved:**

- Five-tab nav built and functional on mobile and desktop. No truncation issues observed. *(March 2026)*
- Nav restructure complete: Home | Meets | Schedule | Inbox | Profile. *(March 2026)*
- Desktop nav: horizontal links + Find Care / Offer Care CTAs. *(March 2026)*

**Open Questions:**

- What populates the Home feed for a brand-new user with zero activity?
- Is "Find Care" discoverable enough as a card on the Home feed?

---

## 9. Technical

**Resolved:**

- Chat infrastructure — mock conversations with local state, designed for Supabase Realtime swap later. Architecture doc: `docs/decisions/chat-design.md`. *(March 2026)*
- Nav restructure — all pages/components updated. *(March 2026)*

**Open Questions:**

- Notification strategy — what triggers push notifications? Too many kills the app; too few = no engagement.
- Data model for production Supabase — meets, groups, attendees, connections, galleries. Design before building real backend.
- Image storage/hosting for pet galleries and meet photos.

---

## Review Cadence

This document should be reviewed:

- After strategic discussions or decisions
- Before expanding scope
- Before starting a new phase
- Before introducing monetization

Questions should never be deleted — mark as Resolved with date and reference.

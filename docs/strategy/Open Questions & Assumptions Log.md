---
category: strategy
status: active
last-reviewed: 2026-04-08
tags: [questions, risks, assumptions]
review-trigger: "before starting a new phase, after any strategic discussion"
---

# Open Questions & Assumptions Log

Tracks known unknowns, assumptions, and risks. Reviewed at the start and end of every phase.

---

## 1. Community Adoption

**Assumption:** Prague dog owners will use an app for social dog meets rather than sticking with WhatsApp/Facebook groups.

**Open:**
- What's the minimum neighbourhood density for community features to feel alive?
- How do we seed initial activity without it feeling artificial?
- What's the "aha moment" — the first experience that makes a user come back?

---

## 2. Trust & Connection Model

**Assumption:** The four-state connection model (None → Familiar → Pending → Connected) maps to real trust-building.

**Resolved:** Familiar is one-sided, Connected is mutual. Post-meet connect prompt is the primary trigger. Care services gate on Connected status. Connection model is universal (no separate provider relationships). Trust ladder replaced by contextual signals.

**Open:**
- How many IRL interactions before users feel comfortable going Familiar → Connected?
- Will Locked users feel excluded or empowered?

---

## 3. Groups & Meets

**Assumption:** Groups are the right persistent container for community — meets alone aren't enough.

**Resolved:** Four group types (park/neighbor/interest/care). Park groups auto-generated. Group detail tabs vary by type. No Chat tab on groups — Feed with flat comments for async, meet-level chat for real-time coordination. Going/Interested RSVP states. Meet detail restructuring to tabs (Details · People · Chat) — decided, not yet built.

**Open:**
- Can the platform suggest meets based on patterns? ("3 regulars walk near Letná on Tuesdays")
- What's the right max group size for different meet types?
- Should meet discovery include a map view?
- Park group scaling — what happens when a park group hits 500 members?
- Can neighborhood groups be auto-suggested based on user density?
- Care group discovery path — how do new users find care groups? (Discover > Groups > Care? Provider profiles? Both?)
- Cross-category groups — a trainer at a specific park: Care or Parks?
- Can community groups (neighbor/interest) have optional service CTAs for casual helpers?

---

## 4. Provider Model

**Assumption:** Users are comfortable evolving owner → helper → provider when framed as community contribution. No separate provider identity — it's a dial, not a switch.

**Resolved:** No separate provider signup. Provider toggle from existing profile. Same layout with additional sections. Care groups created by providers with config options per category.

**Open:**
- At what point does "helping" feel like a job?
- Where does pricing surface before a formal arrangement?
- Should creating a Care group require having services listed first?

---

## 5. Safety & Liability

**Open:**
- Platform liability during meets?
- Does blocking someone remove you from shared public meets/groups?
- What incidents require trust regression (removing Connected status)?

---

## 6. Monetization

**Assumption:** Trust must exist before monetization. Community features stay free.

**Open:**
- What user behaviour indicates readiness for paid transactions?
- Platform-mediated payment from the start, or peer-to-peer first?
- Do Prague pet businesses see value in a community-embedded directory?

---

## 7. Prague & Cultural

**Assumption:** Prague dog culture values routine, parks, informal socialisation. Letná, Stromovka, Riegrovy sady are the right seed neighbourhoods.

**Open:**
- Are there existing informal networks we're replicating or competing with?
- What expectations exist around verification/identity in Czech culture?
- Are the chosen seed neighbourhoods actually the densest for dog owners?

---

## 8. Navigation & UX

**Resolved:** Mobile bottom nav: Community | Discover | My Schedule | Bookings | Profile (5 tabs). Desktop sidebar: Community, Discover, My Schedule, Bookings, Inbox, Notifications, Profile (7 items). Mobile header: create + notifications + inbox. Home renamed to Community with category sub-tabs.

**Open:**
- What populates the Community feed for a brand-new user with zero activity?
- Is Discover the right place for care provider search, or should it be more prominent?

---

## 9. Demo & Presentation

**Open:**
- Which 3 user personas tell the most compelling demo story?
- Should the demo entry page present scenarios ("See what it's like as a...") or user profiles?
- How much mock data is needed per user to feel convincing?
- Should the demo include a guided tour or let users explore freely?

---

## 10. Technical

**Resolved:** Chat uses mock data, designed for Supabase Realtime swap.

**Open:**
- Notification strategy — what triggers push vs. quiet delivery?
- Supabase data model for production — design before building backend.
- Image storage/hosting for galleries and meet photos.

---
category: strategy
status: active
last-reviewed: 2026-04-13
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

**Resolved:** Four group types (park/neighbor/interest/care). Park groups auto-generated. Group detail tabs vary by type. No Chat tab on groups — Feed with flat comments for async (built), meet-level chat for real-time coordination (built). Going/Interested RSVP states with interactive cycle (Going/Interested/Leave). Meet detail tabs (Details · People · Chat) — built with photo gallery. Schedule tabs: Upcoming / Care / Interested. Care tab has sub-filter pills (All / Getting Care / Providing). Interested tab auto-populates from joined groups. Discover flow refactored: hub → results with FilterPillRow + floating Filters button (no more type picker pages). Care group discovery path resolved: Discover > Dog Care with filter pills for service type.

**Open:**
- Can the platform suggest meets based on patterns? ("3 regulars walk near Letná on Tuesdays")
- What's the right max group size for different meet types?
- Should meet discovery include a map view?
- Park group scaling — what happens when a park group hits 500 members?
- Can neighborhood groups be auto-suggested based on user density?
- Cross-category groups — a trainer at a specific park: Care or Parks?
- Can community groups (neighbor/interest) have optional service CTAs for casual helpers?

---

## 4. Provider Model

**Assumption:** Users are comfortable evolving owner → helper → provider when framed as community contribution. No separate provider identity — it's a dial, not a switch.

**Resolved:** No separate provider signup. Provider toggle from existing profile. Same layout with additional sections. Care groups created by providers with config options per category. Rolling weekly billing model for recurring bookings — sessions generate one at a time, no fixed session count. Provider session actions: Start → Complete → Add note. Booking detail page works for both owner and provider perspectives with tabbed layout (Info / Sessions / Chat).

**Open:**
- At what point does "helping" feel like a job?
- Where does pricing surface before a formal arrangement?
- Should creating a Care group require having services listed first?
- How does a booking proposal actually get created? (conversation → proposal card flow not yet designed)
- Should providers be able to set cancellation policies (e.g. 24hr notice)?

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

**Resolved:** Mobile bottom nav: Community | Discover | My Schedule | Bookings | Profile (5 tabs). Desktop sidebar: Community, Discover, My Schedule, Bookings, Inbox, Notifications, Profile (7 items). Mobile header: create + notifications + inbox. Home renamed to Community with category sub-tabs. All pages unified to PageColumn single-column layout (640px centered). Sidebar tightened to 180px. MasterDetailShell and DiscoverShell deleted. Sidebar active state: neutral (transparent-dark-4 + text-primary). Header action buttons: CTA pill variant (brand for primary, outline for secondary). DetailHeader and PageColumn headers aligned (40px, 16px padding). Scroll-to-hide nav restored via page-column-panel-body class.

**Open:**
- What populates the Community feed for a brand-new user with zero activity?

---

## 9. Demo & Presentation

**Partially resolved:** Three personas chosen — Tereza (routine owner/neighbourhood anchor), Klára (professional trainer), Daniel (anxious new owner). Mock data layer built with 20 users, 24 meets, 35 posts, 13 reviews, 10 bookings, 8 conversations, 20 group message threads. Image generation prompts prepared (40 prompts across 7 tiers).

**Open:**
- Should the demo entry page present scenarios ("See what it's like as a...") or user profiles?
- Should the demo include a guided tour or let users explore freely?
- How does persona switching work technically — context provider with user state, or URL-based routing?
- What does each persona's "highlight reel" look like — which 3-4 pages tell their story best?

---

## 10. Technical

**Resolved:** Chat uses mock data, designed for Supabase Realtime swap.

**Open:**
- Notification strategy — what triggers push vs. quiet delivery?
- Supabase data model for production — design before building backend.
- Image storage/hosting for galleries and meet photos.
- Provider ID dualism — mockData.ts uses `olga-m`, `nikola-r`, `jana-k` while mockUsers.ts uses `jana`, `nikola`. These coexist but will need unification before real backend work.
- Feed algorithm for multi-user — currently hardcoded to "Vinohrady" neighbourhood. Needs to be user-context-aware for persona switching.

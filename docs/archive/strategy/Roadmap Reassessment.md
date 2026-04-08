---
category: strategy
status: draft
last-reviewed: 2026-03-23
tags: [roadmap, planning, community-first, reassessment]
review-trigger: "before starting a new phase"
---

# Roadmap Reassessment — Community-First Lens

The current roadmap (Phases 1–7) was built incrementally. Early phases predate the community-first thesis. Now that the vision is clear, this document looks at the prototype fresh and asks: **what should we focus on next to make the demo most convincing?**

This isn't just about features. Some of the highest-value improvements are psychological — how the product *feels*, what it communicates, what behaviour it nudges.

---

## What we have (summary)

Phases 1–7 built a functional prototype covering:
- Landing page (community-first rewrite)
- Full signup flow (owner-first, optional provider dial)
- Home dashboard (community highlights, upcoming meets, care network)
- Meets (browse, create, detail, group chat, post-meet connections)
- Connections (None → Familiar → Connected with visibility controls)
- Explore/Find Care (map, filters, provider cards, community carers section)
- Messaging (DMs + booking threads with inquiry → proposal → contract)
- Bookings (detail page with pricing, trust signals, payment cards)
- Profile (own + others, edit mode, dog profiles, provider setup)
- Schedule (upcoming meets + bookings)

**The full funnel is demoable:** signup → meet → connect → find care → book → manage.

---

## What's missing or weak — by category

### A. Features not yet built (from the deck)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **Groups** | High | Medium | Persistent communities (the "Tuesday Letna crew"). Public or private. Chat, gallery, shared event list. This is the glue that makes meets feel like belonging, not one-offs. Mentioned prominently in the deck. |
| **Business profiles** | Medium | Medium | Local pet businesses get community-embedded listings. Revenue angle. Not critical for demo story but strengthens the "neighbourhood" feel. |
| **Payment flow in conversations** | Medium | Low | PaymentCard component exists but the full flow (summary → pay → confirmed) isn't wired in mock conversations. Quick win. |
| **Photo gallery per meet/group** | Medium | Low | Post-meet photo sharing. Social proof and engagement driver. Makes meets feel more real. |

### B. Empty states & cold start design

The prototype assumes populated data everywhere. But the deck identifies density as the #1 challenge. **The prototype should demonstrate what a new user in a seeded neighbourhood sees on day one.**

| Improvement | Impact | Effort | Notes |
|-------------|--------|--------|-------|
| **Home — new user state** | High | Low | What does Home look like before you've attended a meet? Should feel inviting, not empty. Suggested meets nearby, "dogs in your area" preview, a clear first action. |
| **Meets — seeded feel** | High | Low | Even with few real events, the UI should feel alive. Upcoming walks with attendee counts, recent activity indicators, "dogs nearby" passive discovery. |
| **Explore — empty results** | Medium | Low | What if no community carers exist yet? Should gracefully promote marketplace results without feeling hollow. |
| **Connections — zero state** | Medium | Low | First-time user has no connections. Home shouldn't feel lonely — should nudge toward first meet. |

### C. Community psychology & behaviour design

These aren't traditional features — they're design choices that shape how the community forms and sustains itself.

| Improvement | Impact | Effort | Notes |
|-------------|--------|--------|-------|
| **Post-meet recap** | High | Medium | After a meet ends: photo gallery upload prompt, "who was there" summary, quick-connect suggestions. This is the conversion moment — meet attendance → lasting connection. |
| **Trust signal accumulation** | High | Low | Make trust visible over time: "You've walked with Petra 5 times" on her profile. "Met through Doggo 3 months ago." The more context, the more comfortable the care transition. |
| **Meet social proof** | Medium | Low | "12 dogs have attended walks at Letna this week." Neighbourhood activity indicators on Home. Makes the community feel real even before you've participated. |
| **Gentle care transition nudges** | Medium | Low | After repeated meets: "You've walked with 3 people's dogs — ever thought about offering care?" Not a prompt every time. Contextual, opt-in, easy to dismiss. |
| **Dog compatibility signals** | Medium | Medium | During meet browse: "3 dogs similar to yours are attending." Uses existing pet profile data (size, energy, play style) to suggest good matches. |
| **"Your neighbourhood" feel** | Medium | Low | Neighbourhood name prominently on Home. Local context everywhere. "Letna has 24 active dogs" not "Prague has 500 users." |
| **Repeat visit hooks** | Medium | Low | Light notification strategy: "A new walk was posted near you", "Petra just offered boarding". Not spammy — relevant, community-driven triggers. |
| **Invite flow** | Medium | Low | "Invite a friend to this meet" — organic growth through the activity people are already doing. Share link with meet preview. |

### D. Polish & UX improvements

| Improvement | Impact | Effort | Notes |
|-------------|--------|--------|-------|
| **Onboarding that shows value** | High | Medium | Current signup is forms. Could add a "preview" step after signup showing nearby meets, dogs in the area — payoff before they've done anything. |
| **Connection management UX** | Medium | Medium | Bulk actions after meets (mark all as Familiar), connection list management, visibility controls per person. The deck's "Selective Controls" concept. |
| **Provider profile richness** | Medium | Low | Reviews, care history, "dogs I've cared for" gallery. Makes provider profiles feel trustworthy for the care transition. |
| **Responsive polish** | Medium | Medium | Some pages are desktop-focused. Mobile is the primary use case for dog owners out at parks. |

---

## Proposed next phases

### Phase 8 — Community Feel & Empty States

**Goal:** Make the prototype feel alive for new users and strengthen the psychological hooks that turn one-time users into regulars.

**Why this first:** Groups and business profiles are important, but the current prototype's biggest weakness is that it assumes an established community. A new user or investor demo should feel alive from the first screen.

| Task | Category |
|------|----------|
| Home — new user welcome state | Empty states |
| Meets — seeded neighbourhood feel (activity indicators) | Empty states |
| Neighbourhood identity on Home ("Letna" not "Prague") | Psychology |
| Meet social proof ("12 dogs walked at Letna this week") | Psychology |
| Post-meet recap screen (photos, who-was-there, quick connect) | Psychology |
| Trust signal accumulation on profiles ("walked together 5 times") | Psychology |
| Onboarding payoff step (preview nearby activity after signup) | Polish |
| Invite a friend to a meet (share link) | Growth |

### Phase 9 — Groups & Belonging

**Goal:** Build persistent communities (groups) — the feature that turns meets from one-off events into ongoing belonging.

| Task | Category |
|------|----------|
| Group model (create, join, leave, public/private) | Feature |
| Group detail page (members, upcoming meets, chat, gallery) | Feature |
| Meets tied to groups (group-only vs. open events) | Feature |
| Group chat (persistent, separate from meet threads) | Feature |
| Photo gallery per group | Feature |
| Group discovery (browse nearby groups) | Feature |
| "Your groups" section on Home | Integration |

### Phase 10 — Business & Growth Layer

**Goal:** Business profiles, payment flow polish, and growth-oriented features.

| Task | Category |
|------|----------|
| Business profile pages (groomers, vets, shops) | Feature |
| Business directory / browse | Feature |
| Payment mock flow in conversations (full send → confirm) | Polish |
| Care transition nudges ("thought about offering care?") | Psychology |
| Dog compatibility signals in meet browse | Psychology |
| Provider profile enrichment (care history, dog gallery) | Polish |

---

## Things to consider

1. **Phase 8 is mostly low-effort, high-impact.** It's design and copy work more than engineering. Could be done fast.
2. **Groups (Phase 9) are the biggest new feature.** They change the information architecture — meets become "events within groups" rather than standalone. Worth thinking through before building.
3. **Business profiles could be deferred** if the priority is demonstrating the community → care funnel. They're a revenue angle but not part of the core story.
4. **Mobile-first polish** should be threaded throughout, not a separate phase. Every new screen should work on mobile from day one.
5. **The cold start problem is a design problem as much as a marketing problem.** The prototype can't solve the real cold start, but it can demonstrate *how* the product handles low density gracefully.

---

## Related Docs

- [[ROADMAP]] — current phase overview
- [[MVP Scope Boundaries]] — feature priority tiers
- [[Product Vision]] — product strategy and principles
- [[Business Strategy]] — revenue and development paths

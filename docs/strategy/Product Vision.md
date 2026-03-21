---
category: strategy
status: active
last-reviewed: 2026-03-18
tags: [vision, principles, strategy, monetization]
review-trigger: "before any major feature decision or strategic discussion"
---

# Doggo — Product Vision

Doggo is a community-first platform for dog owners in Prague. It connects people through their dogs — building neighbourhood familiarity through shared activities, then enabling trusted care arrangements between people who already know each other.

---

## The Thesis

Organic growth comes from owners connecting with each other, not from owners searching for paid services. If Doggo becomes the place where dog owners in Prague socialise their pets, meet up for walks, and build neighbourhood familiarity, everything else follows. Paid care, business profiles, and bookings become natural extensions of an already-engaged user base — not cold marketplace features competing with word-of-mouth.

**Meets build trust. Trust enables care. Care is booked and tracked.**

The community is the acquisition and trust layer. The marketplace emerges from it.

---

## Dog-First Positioning

Every feature leads with the dog — their socialisation, their health, their care. Human social connections are a natural byproduct, not the pitch.

This is deliberate. People wary of "social apps" will happily join a dog app. Users who join "for their dog" and end up making friends are the highest-retention users — the social reward lands harder because it wasn't sold to them.

This framing also makes the care transition feel natural. You're not "becoming a gig worker" — you're helping with dogs, which you already love doing.

---

## Product Principles

These guide judgment, prevent drift, and align everyone around the same intent.

### 1. Prague First

Doggo is designed for Prague's specific context — cultural expectations, neighbourhood density, how locals use shared spaces. Global patterns are a reference, not a requirement.

### 2. Everyone Starts as an Owner

There is no separate "provider signup" or "provider account." Every user starts as a dog owner. Offering care is a dial you turn up from your existing profile — toggle visibility, add services, set constraints. The platform blurs the line between "community member who helps" and "service provider" intentionally.

### 3. Real-World Proximity Beats Abstract Matching

Shared places, routines, and repeated encounters create stronger trust than algorithmic similarity. Location and physical context are first-class signals.

### 4. Low-Pressure Participation by Default

Users should be able to explore, observe, and participate without commitment. Actions feel reversible, optional, and safe. No one is pressured into visibility, roles, or transactions they aren't ready for.

### 5. The Product Facilitates — It Does Not Force

Doggo creates opportunities for connection, trust, and help. It does not pressure users into transactions, roles, or visibility. The user controls the pace at every stage.

### 6. Trust is Earned Through Participation, Not Claims

Trust is built through real-world interaction — attending meets, being a reliable presence, helping when asked. Profile claims and self-descriptions are context, not credentials. The platform's job is to make genuine trust signals visible. See [[Trust & Connection Model]] for details.

### 7. Community Signals Over Vanity Metrics

Consistency, presence, and familiarity matter more than scores or rankings. No public leaderboards. Trust signals are contextual ("shared 5 morning walks") not numeric ("trust score: 47"). Reviews exist for care transactions, where accountability matters — but community participation is never scored.

### 8. Invisible Infrastructure

The product should feel social, not transactional. Features that feel like "platform mechanics" (points, levels, streaks, gamification) are a signal something has gone wrong. The best version of Doggo feels like your neighbourhood, not an app.

---

## Business Model

Revenue comes from platform-mediated care between people who already trust each other.

### Revenue priority stack

1. **Transaction fee on care arrangements (10–15%)** — the core. Only works because community built the trust first. The platform offers clear records, cancellation handling, care history, and payment without the social awkwardness of paying a friend directly.
2. **Business profiles (freemium directory)** — supplemental. Local pet businesses (groomers, vets, pet shops) get community-embedded profiles. Enhanced listings, not ads.
3. **Premium owner features (later, careful)** — advanced group tools, expanded gallery storage, priority visibility. Community features remain free — no paywalls on core social functionality.

### Why on-platform beats side conversations

People could Venmo each other and skip the platform. But the platform offers:

- **Clear record** — dates, price, pet details, confirmed in writing
- **Cancellation and change handling** — structured beats awkward texts
- **Care history** — "Petra has watched 4 dogs from this group with no issues"
- **Insurance/liability** (eventually) — coverage while in care through Doggo
- **Payment without the awkward** — paying through the app normalises paying a friend

---

## Navigation Structure

### Mobile (bottom tabs)

```
Home  |  Meets  |  Schedule  |  Inbox  |  Profile
```

- **Home** — personalised feed: nearby meets, suggested connections, community highlights, care CTAs
- **Meets** — browse groups and meets. "What can I do?" (Note: nav label may stay "Meets" even though the underlying model is Groups & Meets — shorter, familiar to dog culture.)
- **Schedule** — your timeline of upcoming meets and care bookings. "What am I committed to?"
- **Inbox** — direct messages and booking conversations
- **Profile** — you, your dogs, settings, care history, provider dial

### Desktop (horizontal nav)

```
DOGGO logo  |  Home  Meets  Schedule  |  [Find Care]  [Offer Care]  |  Bell  Inbox  Avatar
```

### Care discovery

Provider search is accessed via "Find Care" CTA — an intentional action from within the community context, not a default tab. See [[explore-and-care]] for the full flow.

---

## Related Docs

- [[User Archetypes]] — who we're building for (ramps, behavioral profiles)
- [[Trust & Connection Model]] — how trust and relationships work
- [[Prototype Scope]] — what the demo needs to show
- [[Open Questions]] — unresolved strategic questions

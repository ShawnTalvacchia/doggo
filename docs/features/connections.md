---
category: feature
status: built
last-reviewed: 2026-03-17
tags: [connections, trust, visibility, privacy]
review-trigger: "when modifying connection states, visibility settings, or trust signals"
---

# Connections

The relationship system that governs visibility, contact, and trust between users.

---

## Overview

Connections are how users build their social graph on Doggo. The system has four states (None → Familiar → Pending → Connected) that control what users can see about each other and how they can interact. The model applies equally to all users — owner↔owner, owner↔carer, carer↔carer.

The primary path to building connections is through meets: attend together IRL, then connect in the app. A secondary path exists for Open users who want to discover others proactively.

See [[Trust & Connection Model]] for the full strategic rationale and trust principles.

---

## Current State

- **Pages:** Connection management is on the Profile page (connection list, visibility toggle)
- **Components:** Post-meet connect prompts, connection badges on profiles and provider cards, relationship-aware CTAs on provider profiles
- **Data:** `lib/mockConnections.ts` — mock connection states for demo users
- **Status:** Built — four states implemented, post-meet prompts, trust signals on profiles, relationship-aware CTAs

---

## Key Decisions

1. **Four states, not a trust ladder** — None / Familiar / Pending / Connected are the real states users interact with. No hidden scores, no multi-level progression system.

2. **Familiar is one-sided** — you grant expanded visibility to a specific person without them knowing. They can then send you a message request. This serves cautious users who want to control exactly who sees more of their profile.

3. **Connected is mutual** — both people accept. Unlocks direct messaging and, if applicable, care service CTAs.

4. **Connection model is universal** — providers don't have a different relationship model. They just have more sections visible on their profile. The connection flow between any two users works identically.

5. **Post-meet prompts are the primary connection trigger** — the moment after a shared IRL experience is the highest-intent moment for building a relationship.

6. **Locked is the default** — new accounts are not discoverable. Users opt into visibility, not out of it. This is a core safety decision.

---

## User Flows

### Post-meet connection (primary path)

```
Attend a meet → Meet ends → See attendee list
             → For each attendee: "Connect?" / "Mark as Familiar"
             → If "Connect": request sent (state = Pending)
             → Other person accepts → state = Connected → messaging unlocked
```

### Manual connection (Open users)

```
Browse profiles (home feed suggestions, meet attendee profiles)
→ View profile → "Connect with [name]"
→ Request sent → acceptance → Connected
```

### Visibility toggle

```
Profile → Settings → Visibility: Locked / Open
→ Locked: only Familiar + Connected see expanded profile
→ Open: anyone can see expanded profile and send message requests
```

---

## Future

- **Familiar management UI** — dedicated screen to view/revoke Familiar grants
- **Browse & discover** — for Open users, browse nearby owners/dogs with compatibility signals
- **Mutual connection indicators** — "You both know Petra and Jana" on profiles
- **Connection suggestions** — "People from your Tuesday walk" surfaced on Home feed

---

## Related Docs

- [[Trust & Connection Model]] — strategic rationale, trust principles, safety model
- [[profiles]] — how connection state displays on profiles
- [[meets]] — post-meet connect prompts
- [[messaging]] — contact gates based on connection state

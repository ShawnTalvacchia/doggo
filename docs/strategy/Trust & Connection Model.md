---
category: strategy
status: active
last-reviewed: 2026-04-13
tags: [trust, connections, privacy, safety]
review-trigger: "when touching connection states, visibility, or trust signals"
---

# Doggo — Trust & Connection Model

Trust is the foundation of Doggo. The platform connects people in nearby neighbourhoods — around their dogs, their routines, their parks. That proximity creates real value, but it also demands careful handling. Every design decision about visibility, contact, and relationships must prioritise user safety and earned trust.

---

## Why Trust Matters

Competitor platforms (Rover, Care.com) struggle with trust. Reviews can be faked, profiles can misrepresent, and strangers are matched based on availability rather than genuine familiarity. Doggo's community-first model solves this differently: trust is built through real-world interaction before any care arrangement happens.

The trust model is not a feature — it's the reason the product works. Every feature in Doggo either builds trust, signals trust, or relies on trust.

---

## Connection States

Users have one of four relationship states with each other person. These are the real, implemented states that govern visibility and contact.

| State | Scope | What's visible | Contact allowed |
|---|---|---|---|
| **None** | Default between strangers | Profile pic, first name, dog profile, neighbourhood | No contact — no messages, no connect requests |
| **Familiar** | Per-person, one-sided | Grants expanded profile visibility to that specific person | That person can send a message request |
| **Pending** | Transitional | Connect request sent, awaiting acceptance | No messaging yet |
| **Connected** | Per-person, mutual | Full profile, direct messaging, care services CTA if applicable | Full messaging, care arrangements |

### How states work

**None** is the default. Like a private Instagram account — you see the profile pic, name, dog, and neighbourhood. Enough to recognise someone from a meet. Not enough to dig deeper or make contact.

**Familiar** is one-sided and silent. A user can mark specific people as Familiar — granting them expanded visibility and the ability to send a message request or connect request — without exposing themselves broadly. **No notification is sent.** The other person simply sees more of your profile the next time they visit. This is the primary mechanism for cautious users to build their social graph after meeting people IRL.

**Who can mark Familiar:** Only users with locked profiles. Open profiles are already visible to everyone, so the Familiar action doesn't apply — they skip straight to connect requests. A user can only mark someone as Familiar if that person's profile is not locked (i.e., the profile is visible enough to evaluate). You cannot mark a locked stranger as Familiar — you'd need to meet them at an event first (see post-meet review below).

**Pending** is transitional. One person has sent a connect request; the other hasn't responded yet.

**Connected** is mutual. Both people accept. It unlocks full profile content, a direct message window, and — if either person offers care services — a CTA on their profile visible only to the other. Connected is where the community-to-care transition happens.

### Profile visibility toggle

Separately from per-person states, users have a global visibility setting:

- **Locked** (default) — only people you've explicitly marked as Familiar (or who you're Connected with) see your expanded profile
- **Open** — anyone can see your expanded profile and send message requests

A Locked user builds their network selectively through Familiar/Connected. An Open user is broadly discoverable. Neither is penalised. Both paths lead to trusted relationships.

### How visibility applies to care providers

Care services follow the same visibility rules as everything else on a profile. There is no separate "care discoverability" setting — the profile visibility toggle controls it all:

- **Open** providers are discoverable by anyone in care search. This is the natural choice for professional providers who want clients.
- **Locked** providers are only visible to people they've marked as Familiar or are Connected with. This fits the casual/neighbourhood helper who only wants to help people they already know.

When a user adds care services but their profile is Locked, an informational banner explains: "Your profile is private — only people you've marked as Familiar or Connected with can see your services. Want to make your profile public?"

This simplicity is intentional. The connection model is the same between any two users regardless of whether care is involved. A provider doesn't need a different relationship model — they just have more content visible on their profile.

### Share profile link

Users can generate a direct profile link (e.g., `/connect/[shortcode]`) to share with people they know IRL. Visiting the link shows basic profile info (avatar, name, dogs, neighbourhood) with a "Connect" CTA.

The link bypasses all discovery gates because the link itself is the trust signal — one person deliberately shared it with another. This solves the "we're already friends in real life" problem without requiring both users to join the same group or attend the same meet.

Use cases: two friends who are both on the app, someone you meet at the park, a QR code on a name tag at a larger event.

### Meet participant visibility rules

Meet attendee lists are filtered by actionable relationship, not shown as a flat list:

1. **Visible with full cards:** Connected users, Familiar (either direction), Open profiles
2. **Hidden individually, shown as count:** Locked users with None relationship → "3 other attendees"
3. **Post-meet review:** After a meet ends, all attendees are surfaced in a review flow (see below)

This prevents dead-end cards (locked profile with no action available) while maintaining the privacy of locked users. The meet itself is the trust-building event — hidden attendees become visible *because* you showed up and met them in person.

### Post-meet review flow

After a meet ends, attendees are prompted to review the people they met. This is the primary moment where Familiar relationships are created.

**The flow:**
1. Meet ends (time passes, or organiser marks it complete)
2. Each attendee sees a prompt: "How was the meet? Review who you met"
3. A card stack or list shows each attendee with: avatar, name, dog name, and action buttons
4. **Actions per person:**
   - **Mark as Familiar** (if your profile is locked and theirs is not locked) — silently grants them expanded access to your profile
   - **Connect** (if their profile is visible to you — Open or you've been marked Familiar by them) — sends a connection request
   - **Skip** — no action, move to next person
5. **Batch action:** "Mark all as Familiar" for users who want to open up to the whole group at once

**Key rules:**
- Familiar is silent — no notification sent, no "Someone marked you as Familiar" alert
- You can only mark someone Familiar if you can see their profile (it's not locked to you). You can't mark a locked stranger — the meet is what earned the visibility, and the post-meet reveal shows them
- Open profile users don't need to mark Familiar (their profile is already visible) — they go straight to Connect
- The review flow is optional — users can dismiss it and mark people individually later from their profiles
- Attendees who didn't actually show up (RSVP'd but weren't confirmed/checked in) are excluded from the review

---

## Trust Principles

These principles guide how trust is designed into the product:

1. **Trust is earned through participation, not claims.** Real-world interaction (attending meets, being a reliable presence) builds trust. Self-descriptions are context, not credentials.

2. **Trust signals are contextual, not numeric.** "Shared 5 morning walks" and "Known to 3 people in your network" — not "trust score: 47." No public leaderboards, no gamification.

3. **Trust is visible and legible.** Users can see why someone appears trustworthy — mutual connections, shared meets, care history. Nothing is a black box.

4. **Trust decays naturally.** Inactivity reduces visibility of trust signals. No permanent penalties for stepping back, but signals reflect recent behaviour.

5. **Trust is never mandatory.** Users can remain at any connection state indefinitely. The platform never pressures advancement.

6. **Trust applies equally to everyone.** The connection model works the same between any two users — owner↔owner, owner↔carer, carer↔carer. Users offering care services simply have more sections visible on their profile; they don't have a different relationship model.

---

## Trust Signals

Trust signals are displayed on profiles and in relevant contexts (provider cards, meet attendee lists). They are always earned, never manufactured.

### Between any users

- Mutual connections ("You both know Petra and Jana")
- Shared meet attendance ("Attended 3 meets together")
- Connection state badge (Connected / Familiar / None)
- Member since date

### For users offering care

- Care history ("Watched 4 dogs from your neighbourhood")
- Reviews from completed care arrangements
- Response consistency
- Verified identity (future — when implemented)

### What we avoid

- Star ratings on community participation (only on care transactions)
- Public scores, points, or levels
- "Last active" indicators
- Competitive rankings
- Any signal that can be gamed without real-world interaction

---

## Safety & Privacy

### Location

- **Neighbourhood-level only** by default. "Near Letna" not "on Korunovacni street at 7:15am"
- No GPS tracks, no real-time location, no route history visible to others
- Meet locations use named public parks and landmarks, not custom pin-drops

### Contact gates

- None-state users cannot be contacted — no messages, no connect requests
- Open users can receive message requests (recipient must accept)
- Direct messaging requires Connected status (mutual)
- Strangers can join public meets but cannot contact other attendees unless visibility permits

### Blocking and reporting

- **Block is immediate and total.** Blocked user can't see your profile, your meets, or that you exist
- Report with categories (harassment, inappropriate behaviour, safety concern)
- Reports from in-person meets are treated with higher urgency

### Pattern detection

- Flag accounts that repeatedly view the same profile without interacting
- Flag accounts that join meets but never check in or get confirmed (lurker pattern)
- Surface for review, not automated action

### What we never build

- Real-time "who's at this park right now" for anyone except Connected users
- Walking route or history tracking visible to others
- "People who walk near you" based on precise location overlap
- Public activity feed showing when someone was last active

---

## Two User Journeys

**Cautious user**: None → attends public meets → marks a few attendees as Familiar → exchanges messages → mutually Connects with regulars → may never go Open.

**Social user**: Open from day one → receives message requests → Connects with people they click with → builds a large Connected list quickly.

Both paths lead to the same place: a network of Connected users who trust each other enough for group meets, private groups, and eventually care arrangements.

---

## Related Docs

- [[Product Vision]] — why trust is central to the product
- [[User Archetypes]] — how different users experience the trust ramps
- [[connections]] — feature spec for the connection system
- [[profiles]] — how trust signals display on profiles

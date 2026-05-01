---
category: feature
status: built
last-reviewed: 2026-04-30
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
- **Components:** Post-meet connect prompts (`PostMeetReviewSheet`), connection badges on profiles and provider cards, relationship-aware CTAs on profile pages, canonical person rows (`components/people/PersonRow.tsx`)
- **Action matrix:** `lib/personActions.ts:resolvePersonActions` is the single source of truth for "what actions does the viewer see for this subject?" Used by `PersonRow` (auto mode), profile page primary CTAs, and `PostMeetReviewSheet`. Matrix coverage cases in `lib/personActions.cases.ts`.
- **Tiered meet attendees:** `lib/meetUtils.ts:getAttendeeTier` — Tier 1 Connected, Tier 2 Familiar (either direction)/Pending/Open, Tier 3 Locked + None. Tier 3 rendering depends on the surface: on context-rich surfaces (People tab when viewer attended, Members tab when viewer is a member) Tier 3 attendees render as compact `PrivateProfileRow`s with a "+ Familiar" pill; on no-context surfaces (preview lists, browsing meets you didn't attend) they collapse to the chip list with no action affordance. The locked profile page surfaces the same Familiar pill below the lock card when `connection.sharedGroups` or `connection.meetsShared` indicates shared context.
- **Session-scoped Familiar mutations:** `contexts/ConnectionsContext.tsx` provides `getConnection(target, viewer)` (overlays session overrides on `mockConnections`), `markFamiliar(viewer, target)`, `unmarkFamiliar(viewer, target)`. Profile page Familiar pill + the new `PrivateProfileRow` component both drive through this context. Marks reflect across surfaces within a session (resets on reload). PostMeetReviewSheet still has its own local mark state — migration tracked separately.
- **Deniability guardrail:** No UI surface explains WHY a row was promoted to Tier 2. The `theyMarkedFamiliar` flag bumps the tier silently; consumer surfaces (PersonRow pill suppression, ConnectionIcon single-rendering) preserve cause-deniability. See `Trust & Connection Model.md` and the Trust & Visibility Pass D2 decision.
- **Data:** `lib/mockConnections.ts` — mock connection states for demo users
- **Status:** Built — four states, post-meet prompts, trust signals, action matrix, deniability-correct rendering

---

## Key Decisions

1. **Four states, not a trust ladder** — None / Familiar / Pending / Connected are the real states users interact with. No hidden scores, no multi-level progression system.

2. **Familiar is one-sided** — you grant expanded visibility to a specific person without them knowing. They can then send you a message request. This serves cautious users who want to control exactly who sees more of their profile.

3. **Connected is mutual** — both people accept. Unlocks direct messaging and, if applicable, care service CTAs.

4. **Connection model is universal** — providers don't have a different relationship model. They just have more sections visible on their profile. The connection flow between any two users works identically.

5. **Post-meet prompts are the primary connection trigger** — the moment after a shared IRL experience is the highest-intent moment for building a relationship.

6. **Locked is the default** — new accounts are not discoverable. Users opt into visibility, not out of it. This is a core safety decision.

7. **Familiar requires shared context — but the action is available on every surface where context exists, not just the post-meet review.** Marking a Locked subject Familiar requires the viewer and subject to share a meet, group, or other relationship-record context. The action is surfaced on the People tab (when viewer attended), the Members tab (when viewer is a member), the locked profile page (when sharedGroups/meetsShared on the connection), and the post-meet review. On no-context surfaces (browsing meets you didn't attend, previewing groups you're not in), the action is suppressed and Locked subjects render as a chip list. (Mock World Building, 2026-04-30. Earlier the action was effectively post-meet-review-only because tier-3 collapsed to a non-actionable chip list everywhere.)

8. **Connect requires an opening signal from the subject.** A Locked viewer cannot send Connect to a Locked subject — the matrix returns Familiar only. After the viewer marks Familiar, Connect appears IF the subject is Open or has marked the viewer Familiar back; otherwise Connect stays absent. This preserves the model's intent: Connected is mutual, so Connect can't initiate toward someone who hasn't given any indication of wanting a relationship. See `lib/personActions.ts` matrix v3.

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

## Built (formerly "Planned")

The original phase-15 list is now built and folded into the canonical infrastructure:

- **Tiered meet participant list** — `getAttendeeTier` in `lib/meetUtils.ts` + `ParticipantList` rendering via `PersonRow`. Tier-3 collapse to "+ N other attendees" footer.
- **Post-meet connection** — `PostMeetReviewSheet` walks attendees with Familiar / Connect / Skip per-card; bulk "Mark all Familiar" honors the matrix.
- **Connection state icons** — `ConnectionIcon` in `components/ui/`. Connected (Handshake), Familiar/Pending (Check, single rendering across directions), Open (Globe). The previously-planned "Familiar (they→you) → eye icon" was retired during Trust & Visibility Pass D3 — per-direction visual variation revealed cause and broke the deniability principle.
- **Relationship context signals** — `lib/relationshipContext.ts:getRelationshipSignals`. "Connected since [month]", "Nth meet together", mutual connections, shared groups. The "Wants to connect" signal was removed (cause-revealing — violated the silent-grant deniability frame).
- **Going / Interested RSVP** — built. Recurring meets carry a separate series-level Interested toggle (see `meets.md` recurrence model).

## Future

- **Familiar management UI** — dedicated screen to view/revoke Familiar grants
- **Browse & discover** — for Open users, browse nearby owners/dogs with compatibility signals
- **Connection suggestions** — "People from your Tuesday walk" surfaced on Home feed

---

## Related Docs

- [[Trust & Connection Model]] — strategic rationale, trust principles, safety model
- [[profiles]] — how connection state displays on profiles
- [[meets]] — post-meet connect prompts
- [[messaging]] — contact gates based on connection state

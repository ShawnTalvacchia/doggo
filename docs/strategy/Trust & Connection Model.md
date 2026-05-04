---
category: strategy
status: active
last-reviewed: 2026-04-30
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

**Familiar** is one-sided and silent. A user can mark specific people as Familiar — granting them expanded visibility and shaping how they appear in tier-grouped lists — without exposing themselves broadly. **No notification is sent.** The other person simply sees more of your profile the next time they visit. This is the primary mechanism for cautious users to build their social graph after meeting people IRL.

**Who can mark Familiar:** Locked-profile viewers. Open viewers skip the Familiar step entirely — their profile is already public, so the silent grant has nothing to grant; they go straight to connect requests.

**Who can be marked Familiar:** Anyone the viewer has shared context with. The viewer needs *some* basis for claiming "I recognise this person" — the trust model treats shared context as that basis. Specifically:

- **Open subjects** can be marked from any surface (their profile is publicly visible — no shared context required to recognise them).
- **Locked subjects** can be marked from surfaces where the viewer and subject share context: a meet the viewer attended, a group the viewer is a member of, or a profile page where the connection record carries shared groups or shared meets. The shared context IS the recognition signal.
- **Locked subjects in zero-context surfaces** (browsing meets you didn't attend, previewing groups you're not in) cannot be marked. They render as a chip list — visible, named, but not actionable. Privacy holds for genuine strangers.

**What the Familiar mark does (and does not do):** The mark is a one-sided **outbound grant** from the marker to the marked person. It opens **the marker's** profile up — the marked person, on their next visit, sees more of the marker's profile. **It does not unlock the marked person's profile for the marker.** Unlocking the OTHER direction requires the *subject* to open up — by being Open, by marking the viewer back, or by becoming Connected/Pending.

Practically: if Daniel marks Marek Familiar, Marek will see more of Daniel's profile next time. Daniel's view of Marek is unchanged. For Marek's profile to unlock for Daniel, Marek would have to do something — mark Daniel, switch to Open, or accept a Connect request.

The reciprocity model is deliberate: it treats opening up as a personal choice, not something a stranger can force on you. It's also why Connect (the mutual ask) is gated behind one party already having opened up — you can't ask to be Connected with someone who hasn't given you any opening.

**The unlock loop:** participate → share context → mark people you recognise as Familiar (this opens YOU up to them) → those people, when they look at you, see more and may mark you back → over time you see each other's full profiles, leading to Connect. The post-meet review sheet is the warm-moment guided pass for this; the same Familiar action is also surfaced inline on the People tab, the Members tab, and the locked profile page (when shared context exists).

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

Meet attendee lists separate **information** (open) from **action** (earned by attendance). The community-first thesis is that showing up is what unlocks deepening — not seeing.

**Information is open.** Anyone who can see a meet can see who's attending, grouped by relationship state:

1. **Connected** (header) — Connected users render as full cards. Viewer pinned to top.
2. **Familiar** (header) — Outbound Familiar marks render as full cards **when the subject is also visible to the viewer** (Open profile or has marked the viewer back). A subject the viewer marked Familiar but who is still Locked-with-no-reciprocation stays in **Private profiles** below — the mark is a grant from viewer to subject, not a content unlock for the viewer. The "Familiar ✓" pill on the compact row signals the mark took effect.
3. **Other attendees / Other members** (header) — Tier 2 rows that aren't Connected or outbound-Familiar: Open profiles you haven't marked, and rows where the subject has marked you Familiar (inbound). Same full-card treatment. The header is intentionally neutral — it doesn't reveal *why* anyone is in this group, so inbound-Familiar marks remain deniable.
4. **Private profiles** (header, context-rich surfaces only) — Locked users still locked-to-the-viewer (None state, or outbound-Familiar without reciprocation) render as compact `PrivateProfileRow`s on surfaces where the viewer has shared context (a meet they attended, a group they're in): 32px avatar, single-line identity, "+ Familiar" / "Familiar ✓" pill on the right. The meet/group itself is the shared context, so the action is available. Connect never appears even after marking — Connect requires the subject to have given an opening signal first.
5. **Chip list (no-context surfaces only)** — When a viewer encounters Locked-with-None on a surface where they have no shared context (e.g., previewing a meet they didn't attend), the row collapses to chip-only — name + small avatar, no action affordance.

**Action is gated by attendance.** Familiar / Connect / Message pills appear only for viewers who attended the meet (and only on completed meets). Pre-meet viewers, no-shows, and non-attendees see the same content but with no action affordances. The card stack is identical across viewers; the action affordances differ.

The trust gradient is preserved: **the meet itself is the trust-building event.** What changes after attendance is your ability to deepen — Familiar, Connect, Message. What doesn't change is the information itself. Letting any viewer scope the room (who's coming, who you'd recognise, who you might want to meet) drives meet conversion without leaking anything the people in the room wouldn't show off.

**Single principle app-wide.** The same attendance-based gating applies on the Group Members tab. Co-membership in a group is not enough on its own — the action affordance follows the same earned-by-showing-up rule. Two helpers implement the principle in different shapes:

- `viewerCanAct(meet, viewerId)` (`lib/meetUtils.ts`) — single-meet check used by the People tab. True iff viewer was Going on a `completed` one-off meet OR any past occurrence of a recurring meet.
- `viewerSharedMeetWith(viewerId, subjectId)` (`lib/mockMeets.ts`) — cross-attendee check used by the Group Members tab. True iff the two have ever both been Going on the same past meet/occurrence.

Both are consumed by passing `actions={[]}` to `PersonRow` for the info-only mode (PersonRow suppresses all action affordances; the Pending status pill still renders). Group-type nuance (e.g. neighbor groups where not everyone attends every meet) is a future-state question to surface only if testing flags it.

**Post-meet review (separate surface, different job).** After a meet ends, attendees are prompted to review the people they met (see "Post-meet review flow" below). The review sheet and the People tab inline actions coexist — the sheet is the warm-moment guided pass with the bulk Familiar action and the profile-state-aware explainer; the People tab is the persistent surface where the same actions remain available later.

**Recurring meets and the lens pill row.** Recurring meets ask two questions on the People tab: per-occurrence ("who's coming this Wednesday") and series-level ("who is this community"). The People tab handles both via a pill row — `[All]` plus the next upcoming dates. All aggregates past + upcoming attendees + series-level Interested followers; date pills show a specific occurrence's roster. The disclosure-model rules (info open, action gated) apply identically across every lens — switching to a date pill doesn't change WHAT actions are available, only WHICH people are in view. Action gating is series-level: if the viewer has past attendance on any occurrence, action affordances render across all lenses. See `features/meets.md` → People tab.

### Post-meet review flow

After a meet ends, attendees are prompted to review the people they met. This is the primary moment where Familiar relationships are created.

For recurring meets (`cadence !== "one_off"`), "post-meet" means **post-occurrence** — each attended date triggers its own review prompt against that occurrence's attendee roster (`Meet.attendeesByDate[date]`). One-off meets are unchanged. See [[meets]] → Recurrence model.

**The flow:**
1. Meet (or recurring meet's individual occurrence) ends (time passes, or organiser marks it complete)
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

### Deniability about the cause

Silent doesn't just mean "no notification." It means **the receiver should never be able to pinpoint *who* performed a Familiar grant or *when* it happened**. When a row gets promoted to a higher tier (or a profile becomes more visible to the viewer), multiple actions could explain it: a bulk Familiar mark, a profile-visibility toggle, the marker opening their profile generally. The viewer cannot infer "they specifically thought about me." This deniability is what makes the silent grant actually private.

This principle constrains UI design in the consuming surfaces, not the underlying state model:
- **No cause-revealing copy.** No tooltip, sub-label, helper text, or notification text may say "they marked you Familiar" or describe the inbound grant directly.
- **No per-row visual variation by direction.** The same icon and treatment apply whether Familiar is outbound, inbound, or mutual — distinguishing them visually leaks the cause.
- **Pill suppression on inbound.** When a row is bumped to Tier 2 because the subject marked the viewer Familiar (state still `none` from viewer's side), the connection-state pill is suppressed. The actionable card itself is the signal.

Implementation references: `lib/meetUtils.ts:getAttendeeTier` (bumps on either direction), `components/people/PersonRow.tsx` (pill suppression), `components/ui/ConnectionIcon.tsx` (single rendering across directions), `lib/personActions.ts:resolvePersonActions` (matrix of action affordances). See `Trust & Visibility Pass D2` for the original decision rationale.

### Inquiry-driven transitions (open question — proposed model)

**Status:** stub — full model lives in [[Open Questions & Assumptions Log]] §2 → "Inquiry-driven trust transitions". Stop-gap shipped 2026-05-04: `InquiryFormModal` auto-marks mutual Familiar on send so the proposal flow isn't blocked by locked-profile views.

The community-first thesis assumes Familiar is *earned* through community interaction (meets, shared groups, post-meet review). The Discover→Inquiry path bypasses this — a stranger can send a structured booking inquiry to a provider they've never met, then neither side can see the other's profile to act on it.

Proposed resolution (to be ratified next phase):
- **Inquiry send → mutual Familiar.** Two-sided because the inquiry itself is explicit and known to both parties; the deniability principle for stranger-encounter Familiar doesn't apply to a transactional handshake.
- **Contract acceptance → mutual Connected.** Strongest possible "we're working together" milestone.
- **First service-context message → same mutual Familiar trigger.** Covers the Appointment-type "Ask about this" path which doesn't go through the structured inquiry form.
- **Withdrawn / declined doesn't roll back.** Awareness, once created, persists.

Open implementation questions: hook locations (InquiryFormModal — done; ProposalForm accept handler — pending; first-message detection in chat thread — pending); edge cases for re-inquiring after a decline; interaction with the existing manual Familiar/Connect controls. Inbox & Notifications phase.

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
- Provider trust badges — three-tier system (community-earned, credential, platform). See `Competitive Research - Prague Dog Care Scene.md` for full taxonomy.

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
- [[Competitive Research - Prague Dog Care Scene]] — badge taxonomy, Prague trust patterns, cold-start seeding strategy
- [[Competitive Research - Fluv]] — hybrid trust model question, vetting vs. community trust

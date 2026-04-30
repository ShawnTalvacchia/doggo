---
category: strategy
status: active
last-reviewed: 2026-04-29
tags: [privacy, visibility, content, groups, photos]
review-trigger: "when touching content sharing, photo features, feed logic, or group visibility"
---

# Doggo — Content Visibility Model

This document defines **who can see what content and why**. It governs the home feed, profile galleries, group feeds, and meet albums. Every rendering decision in the app should trace back to a rule in this doc.

Depends on: [[Trust & Connection Model]] (connection states, profile visibility toggle), [[groups]] (group types), [[profiles]] (profile structure).

---

## Core Concepts

### Content always has an origin context

Every piece of shared content (photo, moment, post) belongs to exactly one context:

| Origin | Example | Default audience |
|--------|---------|-----------------|
| **Meet** | Photo taken at "Stromovka Sunday Walk" | Meet attendees + group members (if meet belongs to a group) |
| **Group** | Photo shared to "Letná Dog Owners" | Group members |
| **Profile** | Personal photo on user's own profile | Governed by profile visibility (Locked/Open) + connection state |
| **Message** | Photo sent in a DM | Recipient only |

Content does **not** float freely. There is no "post to the void." The origin context determines the base audience, and the viewer's relationship to the author further filters what they actually see.

### Two independent access gates

For any piece of content, visibility requires passing **both** gates:

1. **Context gate** — Is the viewer allowed to see content from this origin? (group membership, meet attendance, etc.)
2. **Relationship gate** — Does the viewer's relationship with the author permit visibility? (connection state + profile toggle)

If either gate fails, the content is hidden.

---

## The Truth Table

### Reading the table

- **Author** = the person who shared the content
- **Viewer** = the person whose feed/view we're rendering
- **Connection** = relationship state between Author and Viewer (None / Familiar / Connected)
- **Author profile** = Locked or Open (global toggle from Trust & Connection Model)
- **Visible?** = whether the content appears to the Viewer

---

### 1. Meet-attached content

Photos/moments shared to a specific meet.

| Viewer is meet attendee? | Meet belongs to a group? | Meet visibility | Viewer is group member? | Visible? | Notes |
|---|---|---|---|---|---|
| Yes | — | — | — | **Yes** | Attendees always see meet content |
| No | Yes (open group) | `public` | — | **Yes (full)** | Public meets in open groups are publicly browsable |
| No | Yes (open group) | `group_only` | Yes | **Yes (full)** | Group members see all meets from their group |
| No | Yes (open group) | `group_only` | No | **Tease** | Non-members see 1 hero photo + "Join [Group] to see all" CTA |
| No | Yes (private/approval group) | (forced `group_only`) | Yes | **Yes (full)** | Private group member, has access |
| No | Yes (private/approval group) | (forced `group_only`) | No | **No** | Cannot see private group content (no tease either) |
| No | No (standalone meet) | — | — | **No** | Only attendees see standalone meet content |

**Note:** The relationship gate (connection state) does **not** apply to meet-attached content. If you're in the meet or the group, you see the photos regardless of whether you're connected to the author. Meets are communal spaces — the context is the trust signal.

**On the tease layer.** The 1-photo tease for `open group + group_only meet` exists to convert browsers into members. It earns its keep there because the group itself is publicly discoverable but the meet's content isn't — one hero shot reads as an invitation, not a paywall. Capped at 1 photo intentionally: more than that starts to feel like a content tour and weakens the join incentive. Private and approval-required groups never tease — even one photo would leak group content to non-members and violate the context gate. Implementation: `app/meets/[id]/page.tsx` Photos section.

**On the People tab disclosure model.** The meet attendee list separates **information** (open) from **action** (gated by attendance). Anyone who can see a meet can see who's attending, grouped by relationship state, with locked attendees shown as a chip list at the bottom. Action affordances (Familiar / Connect / Message pills) appear only for viewers who attended the meet on a `completed` meet. This is a People-tab rule, not a content-visibility rule per se — but it shares the underlying principle that meet attendance is the trust-building event that unlocks deepening. The same attendance-based gating helper (`viewerSharedMeetWith`) is used on the Group Members tab. Spec: `Trust & Connection Model.md` → "Meet participant visibility rules" + `features/meets.md` → People tab.

---

### 2. Group-posted content

Photos/moments shared directly to a group (not tied to a specific meet).

| Group type | Viewer is member? | Visible? | Notes |
|---|---|---|---|
| Open | Yes | **Yes** | — |
| Open | No | **Yes** | Open groups are publicly browsable |
| Private (request/invite) | Yes | **Yes** | — |
| Private (request/invite) | No | **No** | Must join to see content |

**Note:** Same as meets — the relationship gate does not apply within groups. Group membership is the trust boundary. If you're in the group, you see all group content regardless of your connection state with individual authors.

---

### 3. Profile content

Photos/moments on a user's personal profile (not tied to a meet or group).

| Author profile | Connection state | Visible? | Notes |
|---|---|---|---|
| Open | None | **Yes** | Open profiles are fully visible |
| Open | Familiar | **Yes** | — |
| Open | Connected | **Yes** | — |
| Locked | None | **No** | Locked profile, no relationship |
| Locked | Familiar (viewer marked author) | **No** | Familiar is one-sided; author hasn't granted access |
| Locked | Familiar (author marked viewer) | **Yes** | Author explicitly granted expanded visibility |
| Locked | Familiar (mutual) | **Yes** | At least one direction grants access |
| Locked | Connected | **Yes** | Full access |

**Note:** For Locked profiles, the direction of Familiar matters. "Author marked Viewer as Familiar" = author trusts viewer = content visible. "Viewer marked Author as Familiar" ≠ access, because the author hasn't reciprocated.

---

### 4. Message content

| Relationship | Visible? | Notes |
|---|---|---|
| Message recipient | **Yes** | Only the conversation participants |
| Anyone else | **No** | Messages are always private |

---

## Cross-context visibility: The Home Feed

The home feed assembles content from multiple origins. For each item, apply the relevant table above.

### What appears in Viewer's home feed

| Content type | Appears if... |
|---|---|
| Meet photos from a group Viewer belongs to | Always (context gate: group member) |
| Meet photos from a group Viewer doesn't belong to (open) | Yes — open group content is browsable |
| Meet photos from a private group Viewer isn't in | Never |
| Group posts from Viewer's groups | Always |
| Group posts from open groups Viewer follows or has interacted with | Yes |
| Profile posts from Connected users | Always |
| Profile posts from Open users in Viewer's neighbourhood | Yes (discovery feed) |
| Profile posts from Locked users with no relationship | Never |

### Feed ranking signals (not visibility — these affect order, not access)

- Recency
- Viewer's group activity (more active in group → higher priority)
- Connection strength (Connected > Familiar > None)
- Meet attendance overlap with author
- Neighbourhood proximity

---

## Cross-context visibility: Profile Gallery

When Viewer visits Author's profile, they see a filtered gallery. This is the scenario Shawn described (User A / User B).

### What Viewer sees on Author's profile

| Content origin | Visible on Author's profile? | Rule applied |
|---|---|---|
| Author's personal profile posts | Profile content rules (table 3) | Relationship gate |
| Author's posts in shared groups (both are members) | **Yes** | Context gate: shared membership |
| Author's posts in groups Viewer isn't in (open) | **Yes** | Context gate: open group |
| Author's posts in groups Viewer isn't in (private) | **No** | Context gate: private group, not a member |
| Author's meet photos from shared meets | **Yes** | Context gate: both attended |
| Author's meet photos from meets Viewer didn't attend (in shared group) | **Yes** | Context gate: shared group membership |
| Author's meet photos from private group Viewer isn't in | **No** | Context gate: private group, not a member |

**Profile gallery is filterable:** Viewer can filter by "All (visible to me)" / by specific shared group / by personal posts only. The filter options themselves reveal only contexts the Viewer has access to — they never see a filter label for a private group they're not in.

---

## The "Share a Moment" Flow

When a user shares a photo, the flow determines the origin context:

1. **Auto-detect**: If the user recently attended a meet (within last 24h), suggest that meet as the context
2. **Choose context**: Meet → Group → Profile → Message
3. **Audience label**: Before confirming, show a plain-language summary:
   - Meet: "Visible to attendees of [Meet Name] and members of [Group Name]"
   - Group: "Visible to members of [Group Name]" (or "Visible to anyone" for open groups)
   - Profile: "Visible to your connections" (Locked) or "Visible to anyone" (Open)
   - Message: "Only [recipient name] will see this"
4. **Tagging**: Tag dogs, people, locations. Tags create cross-references but do **not** expand the audience. A tagged person who isn't in the audience doesn't gain access — the tag simply creates a link for people who *can* already see the content.

**Key rule: Tags never expand audience.** If User A posts a meet photo and tags User C who wasn't at the meet and isn't in the group, User C cannot see the photo. The tag exists as metadata for people who can see the post. This prevents accidental privacy leaks through tagging.

---

## Auto-generated Park Groups

Groups auto-created for known dog parks/locations follow these rules:

- **Default type: Open** — anyone can join, content is publicly visible
- **No designated admin** — any member can post meets/events
- **Moderation**: Community-flagging model (report content → review queue)
- **Content**: Primarily meet-attached (photos from walks at this park)
- **Naming**: "[Park Name] Dog Walks" or similar, clearly tied to location
- **Transition**: If a group grows and members want tighter control, any member can request conversion to private (requires community vote or platform review)

---

## Edge Cases & Rules

1. **Blocked users**: Content from blocked users is invisible everywhere, regardless of context. Block overrides all visibility rules.

2. **Deleted content**: Removed immediately from all feeds and galleries. Cached versions are purged.

3. **User leaves a group**: Their past contributions remain visible to current group members (the content belongs to the group context). The user's profile gallery no longer shows that group's content to non-members.

4. **User leaves a meet after posting photos**: Photos remain on the meet (they were shared to that context). Author can delete individually.

5. **Profile changes from Open to Locked**: Profile-origin content becomes invisible to non-Familiar/non-Connected viewers. Group and meet content is unaffected (governed by context gate, not relationship gate).

6. **Cross-posted content**: Content belongs to one origin only. If a user wants the same photo in a group and on their profile, those are two separate shares with two separate visibility scopes.

7. **Tagged in content you can't see the origin of**: You receive a notification that you were tagged, but the notification links to the content only if you pass the visibility gates. Otherwise: "You were tagged in a post in a private group."

---

## Summary: The Two Rules

If you remember nothing else from this document:

1. **Context gate first.** Group membership and meet attendance determine the base audience. This is the primary access control.
2. **Relationship gate for profile content.** Personal/profile-origin content follows the connection state + profile visibility toggle.

Tags, feed ranking, and UI filtering are all secondary to these two gates. Get these right and the privacy model is sound.

---

## Related Docs

- [[Trust & Connection Model]] — connection states, profile visibility toggle, contact gates
- [[profiles]] — profile structure and display rules
- [[groups]] — group types and membership
- [[meets]] — meet structure and attendee lists

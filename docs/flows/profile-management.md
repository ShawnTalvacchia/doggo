---
status: built
last-reviewed: 2026-03-23
---

# Profile Management Flow

Managing your profile — personal info, dog profiles, posts, tagging preferences, visibility controls, connections, and carer settings.

```mermaid
flowchart TD
    A["Profile Page"] --> B{"Tab"}
    B -->|About| C["Personal Info, Dogs,\nConnections, Tags, Care CTAs"]
    B -->|Posts| D["Photo Grid of Posts\n+ New Post CTA"]
    B -->|Services| E["Carer Profile\n(see provider-setup.md)"]

    C --> C1["Edit sections inline\n(bio, dogs, tag preferences)"]
    C --> C2["Tag Approval Setting\n(auto / review / none)"]
    C --> C3["Care CTAs\n(Find Care / Offer Care)"]

    D --> D1["View post detail\n(photos, caption, tags, reactions)"]
    D --> D2["New post → /posts/create"]

    F["Other User's Profile"] --> G["View Profile\n(/profile/[userId])"]
    G --> G1["About Tab"]
    G --> G2["Posts Tab"]
    G --> G3["Services Tab\n(if offering care)"]
    G --> H{"Actions based on\nconnection state"}
    H -->|None| I["Disabled — Meet first"]
    H -->|Familiar| J["Connect with [name]"]
    H -->|Pending| K["Request sent (disabled)"]
    H -->|Connected| L["Message / Book Care"]
```

## Step status

| Step | Route | Status |
|------|-------|--------|
| Own profile (view) | `/profile` | Done |
| Own profile (edit mode) | `/profile` | Done |
| Dog profile CRUD | `/profile` | Done |
| Posts tab | `/profile?tab=posts` | Done (Phase 10) |
| Tag approval setting | `/profile?tab=about` | Done (Phase 10) |
| Care CTAs on About tab | `/profile?tab=about` | Done (Phase 10) |
| Connection management | `/profile` | Partial — list shown, actions mocked |
| Other user's profile | `/profile/[userId]` | Done |
| About / Posts / Services tabs | `/profile/[userId]` | Done (Phase 10 — replaces About/Services/Reviews) |
| Connection state gating | `/profile/[userId]` | Done (Phase 11) — None=disabled, Familiar=connect, Connected=full |

## Notes

- Phase 10 changed tabs from About / Services / Reviews to About / Posts / Services. Reviews content moved into the Services tab.
- Tag approval is per-user (dog tagging inherits owner setting).
- All "Offer Care" CTAs route to `/profile?tab=services` (Phase 11 consolidation).
- Connection state now gates actions, not just appearance — non-connected users see disabled CTAs with explanatory text.

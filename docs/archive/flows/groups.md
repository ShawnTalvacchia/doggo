---
status: done
last-reviewed: 2026-04-04
---

# Groups (Communities) Flow

Persistent communities that turn meets from one-off events into ongoing belonging. Three archetypes: Park (auto-generated, open), Community (user-created, defaults private), Service (provider-created, service CTAs). Public or private, with chat, gallery, and linked meets.

```mermaid
flowchart TD
    A["Home > Groups tab\n(/home?tab=groups)"] --> B["Community Detail Page\n(/communities/[id])"]
    A3["Discover hub > Groups card\n(/discover/groups)"] --> B
    B --> C["Members List\n(with connection state badges)"]
    B --> D["Upcoming Meets\n(linked meets via MeetCard)"]
    B --> E["Community Chat\n(persistent group thread)"]
    B --> F["Photo Gallery"]

    G["Create Community\n(/communities/create)"] --> H["Name, Description,\nNeighbourhood, Visibility"]
    H --> I["Community Created\n(appears in browse + Home)"]

    D --> J["Meet Detail Page\n(shows 'Part of [Community]' link)"]
    J --> B

    K["MeetCard\n(anywhere in app)"] -->|"community badge"| B
```

## Step status

| Step | Route / Component | Status |
|------|-------------------|--------|
| Groups tab within Home | `/home?tab=groups` | Done (Phase 18) |
| Discover hub > Groups card | `/discover/groups` | Done (Phase 19) |
| Communities browse page | `/communities` | Done |
| Filter pills (All / Yours / Public / Private) | `/communities` | Done |
| Community detail page | `/communities/[id]` | Done |
| Members list with connection badges | `/communities/[id]` | Done |
| Upcoming meets section | `/communities/[id]` | Done |
| Community chat (toggle) | `/communities/[id]` | Done |
| Join-gated chat (EmptyState + Join CTA for non-members) | `/communities/[id]` | Done |
| System messages (member_joined, meet_posted, rsvp_milestone) | `/communities/[id]` chat | Done |
| Event card strip (horizontal scroll of upcoming meets) | `/communities/[id]` chat | Done |
| Photo gallery | `/communities/[id]` | Done |
| Create community form | `/communities/create` | Done |
| "Your communities" on Home | `/home` | Done |
| Community badge on MeetCard | MeetCard component | Done |
| "Part of [Community]" on meet detail | `/meets/[id]` | Done |
| Join/Leave community | `/communities/[id]` | Done (mock) |
| Invite members | `/communities/[id]` | Done (non-functional button) |

## Redirects

| Old route | New destination | Status |
|-----------|----------------|--------|
| `/communities` (direct nav) | Accessible via Home > Groups tab | Done |

## Notes

- User-facing label is "Groups" (renamed from "Communities" in Phase 16) — code internals use `group` for brevity, routes remain `/communities`
- Groups browse is accessible via two paths: **Home > Groups tab** (Feed | Groups) and **Discover hub > Groups card** (`/discover/groups`). Bottom nav has 5 tabs: Home | Discover | My Schedule | Bookings | Profile (Phase 19).
- Three group archetypes (Phase 19): Park (auto-generated, open, Tree badge), Community (user-created, defaults private), Service (provider-created, Hosted badge, service CTAs on meets).
- Route is `/communities` (moved from `/groups` in Phase 14)
- Meets link to groups via `groupId` field (optional). Standalone meets still work without a group.
- Group chat uses the shared `MessageBubble` component (extracted from meet detail in Phase 9)
- Group chat is join-gated: non-members see EmptyState with Join CTA (Phase 14)
- System messages (member_joined, meet_posted, rsvp_milestone) rendered via SystemMessage component (Phase 14)
- Event card strip at top of chat shows upcoming meets via MeetCardCompact (Phase 14)
- Detail page uses `DetailHeader` with back button (Phase 18)

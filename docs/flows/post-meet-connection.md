---
status: done
last-reviewed: 2026-03-23
---

# Post-Meet Connection Flow

After attending a meet, users can mark attendees as Familiar or send Connect requests. This is the primary trust-building mechanism — the conversion moment from "attended" to "connected."

```mermaid
flowchart TD
    A["Meet ends"] --> B["Post-Meet Connection Page\n(list of attendees)"]
    B --> C{"For each attendee"}
    C --> D["Mark as Familiar\n(one-sided, grants visibility)"]
    C --> E["Send Connect Request\n(mutual connection)"]
    C --> F["Skip / Ignore"]
    D --> G["Attendee sees expanded profile"]
    E --> H["Attendee receives request\n(Pending state)"]
    H --> I{"Accept?"}
    I -->|Yes| J["Connected\n(full messaging, care CTAs)"]
    I -->|No| K["Stays at current level"]

    style L stroke-dasharray: 5 5
    style M stroke-dasharray: 5 5
    style N stroke-dasharray: 5 5
    A -.-> L["Future: Post-Meet Recap\n(photos, who-was-there summary)"]
    L -.-> M["Upload / browse photos"]
    L -.-> N["Quick-connect suggestions\nbased on dogs that played together"]
```

## Step status

| Step | Route | Status |
|------|-------|--------|
| Post-meet connection page | `/meets/[id]/connect` | Done |
| Attendee list with actions | `/meets/[id]/connect` | Done |
| Mark as Familiar | `/meets/[id]/connect` | Done (mock) |
| Send Connect request | `/meets/[id]/connect` | Done (mock) |
| Bulk "Mark all as Familiar" | `/meets/[id]/connect` | Done (Phase 8) |
| Post-meet recap (photos, summary) | `/meets/[id]/connect` | Done (Phase 8) |

## Notes

- **Pending** is a real connection state in the code — it exists between sending a Connect request and the other user accepting. It's an internal implementation detail, not surfaced in external comms (decks, landing page).
- Phase 8 proposes expanding this into a **post-meet recap** — photos, who-was-there, quick-connect suggestions. This is the highest-leverage moment for building lasting connections.
- The deck's **Selective Controls** concept (mark the whole guest list as Familiar, or pick individuals) maps to this screen.

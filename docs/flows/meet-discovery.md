---
status: partial
last-reviewed: 2026-03-23
---

# Meet Discovery & Attendance Flow

Finding, browsing, and attending meets — the primary community engagement loop.

```mermaid
flowchart TD
    A["Home Dashboard\n(upcoming meets section)"] --> B["Meets List\n(filters: All / Walks / Park / Playdates / Training)"]
    B --> C["Meet Detail Page\n(description, attendees, location, rules)"]
    C --> D{"RSVP / Join"}
    D -->|Join| E["Added to attendee list"]
    E --> F["Meet appears in Schedule"]
    F --> G["Attend the meet"]
    G --> H["Post-Meet Recap\n(see post-meet-connection.md)"]

    style I stroke-dasharray: 5 5
    style J stroke-dasharray: 5 5
    I["Future: Group Page\n(your Tuesday Letna crew)"] -.-> B
    J["Future: Group-only meets\n(restricted to members)"] -.-> C
```

## Step status

| Step | Route | Status |
|------|-------|--------|
| Home — upcoming meets | `/home` | Done |
| Meets list + filters | `/meets` | Done |
| Meet detail page | `/meets/[id]` | Done |
| RSVP / join action | `/meets/[id]` | Done (mock) |
| Schedule view | `/schedule` | Done |
| Post-meet connection | `/meets/[id]/connect` | Done |

## Future (Phase 9)

In the proposed Groups model, meets become **events within groups** — you can browse open meets or see meets from groups you belong to. Group-only meets would be restricted to members. This changes the entry points but not the core attend → connect loop.

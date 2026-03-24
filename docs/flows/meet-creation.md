---
status: done
last-reviewed: 2026-03-23
---

# Meet Creation Flow

Creating a new meet — walks, park hangouts, playdates, or training sessions.

```mermaid
flowchart TD
    A["Meets List"] --> B["Create Meet button"]
    B --> C["Choose Meet Type\n(walk, park hangout, playdate, training)"]
    C --> D["Title & Description"]
    D --> E["Location\n(map picker or address)"]
    E --> F["Date & Time"]
    F --> G["Rules & Details\n(leash policy, dog size, max attendees)"]
    G --> H["Review & Publish"]
    H --> I["Meet Detail Page\n(live, accepting RSVPs)"]
```

## Step status

| Step | Route | Status |
|------|-------|--------|
| Create meet button | `/meets` | Done |
| Multi-step form | `/meets/create` | Done |
| Meet type selection | `/meets/create` | Done |
| Title & description | `/meets/create` | Done |
| Location picker | `/meets/create` | Done |
| Date & time | `/meets/create` | Done |
| Rules & details | `/meets/create` | Done |
| Published meet | `/meets/[id]` | Done |

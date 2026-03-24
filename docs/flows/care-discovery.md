---
status: built
last-reviewed: 2026-03-23
---

# Care Discovery Flow

Finding a care provider — accessed via "Find Care" CTA, not a default tab. Community trust signals surface throughout. Available any time — no social participation required.

```mermaid
flowchart TD
    A["Home — Find Care CTA\nor nav action"] --> B["Explore Results\n(map + provider cards)"]
    B --> C["Filter & Search\n(service type, price, dates, availability)"]
    B --> B1["Community Carers Section\n(Connected users who offer care)"]
    C --> D["Provider Card\n(name, photo, price, reviews, trust signals)"]
    B1 --> D
    D --> E["Provider Profile\n(about, services, reviews, connection state)"]
    E --> F{"Connection state?"}
    F -->|Connected| G["Message / Book directly"]
    F -->|Familiar| H["Send message or connect request"]
    F -->|None| I["Limited info, connect first"]
    G --> J["Booking Conversation\n(see booking-conversation.md)"]

    style K stroke-dasharray: 5 5
    K["Future: Business Profiles\n(groomers, vets, pet shops)"] -.-> B
```

## Step status

| Step | Route | Status |
|------|-------|--------|
| Find Care CTA on Home | `/home` | Done |
| Explore results (map + cards) | `/explore/results` | Done |
| Filter panel (desktop) | `/explore/results` | Done |
| Filter panel (mobile) | `/explore/results` | Done |
| Provider result cards | `/explore/results` | Done |
| Community carer section | `/explore/results` | Done |
| Provider profile page | `/explore/profile/[providerId]` | Done |
| Connection-gated actions | `/explore/profile/[providerId]` | Done (Phase 11) — TrustGateBanner + disabled CTAs for non-connected |
| Payment mock checkout | `/bookings/[bookingId]/checkout` | Done (Phase 11) |
| Business profiles | — | Not built (deferred) |

## Notes

- The deck emphasises that care discovery should show **real trust signals from the community** — even for users who skip the social side entirely.
- **Business profiles** (groomers, vets, pet shops) are a separate discovery path proposed in the deck and reassessment (Phase 10). They'd appear alongside individual providers.

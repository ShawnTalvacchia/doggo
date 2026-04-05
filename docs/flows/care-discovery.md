---
status: built
last-reviewed: 2026-04-04
---

# Care Discovery Flow

Finding a care provider — accessed via the Discover hub > Dog Care card or "Find Care" CTAs. Community trust signals surface throughout.

```mermaid
flowchart TD
    A["Discover hub > Dog Care card\n(/discover/care)"] --> B["Filtered Provider List\n(map + provider cards)"]
    A2["Home — Find Care CTA"] --> B
    B --> C["Filter & Search\n(service type, price, dates, availability)"]
    B --> B1["Community Carers Section\n(Connected users who offer care)"]
    C --> D["Provider Card\n(name, photo, price, reviews, trust signals)"]
    B1 --> D
    D --> E["Provider Profile\n(/discover/profile/[providerId])"]
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
| Discover hub with three doors (Meets, Groups, Dog Care) | `/discover` | Done |
| Dog Care sub-page — provider search (map + cards) | `/discover/care` | Done |
| Filter panel (desktop) | `/discover/care` | Done |
| Filter panel (mobile) | `/discover/care` | Done |
| Provider result cards | `/discover/care` | Done |
| Community carer section | `/discover/care` | Done |
| Provider profile page | `/discover/profile/[providerId]` | Done |
| Connection-gated actions | `/discover/profile/[providerId]` | Done (Phase 11) — TrustGateBanner + disabled CTAs for non-connected |
| Payment mock checkout | `/bookings/[bookingId]/checkout` | Done (Phase 11) |
| Business profiles | — | Not built (deferred) |

## Redirects

| Old route | New destination | Status |
|-----------|----------------|--------|
| `/explore/results` | `/discover/care` | Done |
| `/explore/profile/[id]` | `/discover/profile/[id]` | Done |
| `/discover?tab=care` | `/discover/care` | Done (Phase 19) |

## Notes

- Care discovery is accessible via the Discover hub > Dog Care card (Phase 19 restructured Discover from tabs to three-door hub).
- Previously at `/explore/results` — moved to `/discover?tab=care` in Phase 18, then to `/discover/care` sub-page in Phase 19.
- Provider profiles moved from `/explore/profile/[id]` to `/discover/profile/[id]`.
- The deck emphasises that care discovery should show **real trust signals from the community** — even for users who skip the social side entirely.
- **Business profiles** (groomers, vets, pet shops) are a separate discovery path proposed in the deck and reassessment (Phase 10). They'd appear alongside individual providers.

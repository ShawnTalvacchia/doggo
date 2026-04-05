---
status: built
last-reviewed: 2026-04-05
---

# Care Discovery Flow

Finding a care provider — accessed via the Discover hub > Dog Care card or "Find Care" CTAs. Community trust signals surface throughout.

```mermaid
flowchart TD
    A["Discover hub (/discover)\nThree doors: Meets, Groups, Dog Care"] --> A1["Dog Care door\n→ CarePickerPanel\n(/discover/care)"]
    A1 --> A2["Select service type\n(Walks & check-ins, In-home sitting, Boarding)"]
    A2 --> B["CareFilterPanel + Results\n(DiscoverShell layout)"]
    A3["Home — Find Care CTA"] --> A1
    B --> B1["Filters:\nPet selector, location, visit frequency\n(One Time / Repeat Weekly),\nday picker (MultiSelectSegmentBar),\nprice range (dual Slider),\nsub-type accordion (CheckboxRow)"]
    B1 --> B2["Results panel (desktop: middle panel)\n(mobile: Results/Filters tab switching)"]
    B2 --> B3["Community Carers Section\n(Connected users who offer care)"]
    B2 --> D["Provider Card\n(name, photo, price, reviews, trust signals)"]
    B3 --> D
    D --> E["Provider Profile\n(/discover/profile/[providerId])"]
    E --> F{"Connection state?"}
    F -->|Connected| G["Message / Book directly"]
    F -->|Familiar| H["Send message or connect request"]
    F -->|None| I["Limited info, connect first"]
    G --> J["Booking Conversation\n(see booking-conversation.md)"]

    style K stroke-dasharray: 5 5
    K["Future: Business Profiles\n(groomers, vets, pet shops)"] -.-> B2
```

## Step status

| Step | Route | Status |
|------|-------|--------|
| Discover hub with three doors (Meets, Groups, Dog Care) | `/discover` | Done |
| CarePickerPanel — service type selector (Walks & check-ins, In-home sitting, Boarding) | `/discover/care` | Done |
| CareFilterPanel — interactive filters (pet selector, location, frequency, day picker, price range, sub-type accordion) | `/discover/care` | Done |
| Filter panel (mobile) — Results/Filters tab switching via DiscoverShell | `/discover/care` | Done |
| Results panel (desktop: middle panel in DiscoverShell) | `/discover/care` | Done |
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

- Care discovery starts at the **Discover hub** (`/discover`), which presents three doors: Meets, Groups, Dog Care. Selecting Dog Care loads `/discover/care`.
- `/discover/care` opens the **CarePickerPanel** — a service type selector offering Walks & check-ins, In-home sitting, and Boarding. Selecting a type loads the **CareFilterPanel** with interactive filters: service display, pet selector, location, visit frequency toggle (One Time / Repeat Weekly), day picker (MultiSelectSegmentBar), price range (dual Slider), and service sub-type accordion (CheckboxRow).
- Results appear in the middle panel on desktop or via Results/Filters tab switching on mobile, all powered by the **DiscoverShell** layout component.
- Previously at `/explore/results` — moved to `/discover?tab=care` in Phase 18, then to `/discover/care` sub-page in Phase 19.
- Provider profiles moved from `/explore/profile/[id]` to `/discover/profile/[id]`.
- The deck emphasises that care discovery should show **real trust signals from the community** — even for users who skip the social side entirely.
- **Business profiles** (groomers, vets, pet shops) are a separate discovery path proposed in the deck and reassessment (Phase 10). They'd appear alongside individual providers.

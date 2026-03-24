---
status: built
last-reviewed: 2026-03-23
---

# Booking Conversation Flow

The full booking journey — from first message through to payment and active booking management.

```mermaid
flowchart TD
    A["Provider Profile\nor Connection"] --> B["Open / Start Conversation"]
    B --> C["Message Thread\n(chat with provider)"]
    C --> D["Send Booking Inquiry\n(service, dates, dog details)"]
    D --> E["Provider Reviews Inquiry"]
    E --> F{"Provider response"}
    F -->|Accept| G["Booking Proposal Card\n(service, schedule, pricing breakdown)"]
    F -->|Decline / Modify| H["Continue conversation"]
    G --> I{"Owner reviews proposal"}
    I -->|Accept| J["Contract Review Modal\n(terms, cancellation, platform fee)"]
    I -->|Negotiate| H
    J --> K["Sign Contract"]
    K --> L["Payment Checkout\n(price + platform fee, mock payment)"]
    L --> M["Booking Created\n(appears in /bookings + /schedule)"]
    M --> N["Booking Detail Page\n(schedule, sessions, pricing)"]
    N --> O{"Owner actions"}
    O -->|Message carer| C
    O -->|Request change| P["Modification Requested banner"]
    O -->|Cancel| Q["Cancel Modal\n(optional reason)"]
    Q --> R["Booking Cancelled"]
```

## Step status

| Step | Route / Component | Status |
|------|-------------------|--------|
| Conversation list (inbox) | `/inbox` | Done |
| Message thread | `/inbox/[conversationId]` | Done |
| Inquiry form (multi-step modal) | `InquiryForm` in thread | Done |
| Inquiry chips display | `InquiryChips` | Done |
| Booking proposal card | `BookingProposalCard` | Done |
| Contract signing modal | `SigningModal` in thread | Done |
| Payment mock checkout | `/bookings/[bookingId]/checkout` | Done (Phase 11) |
| Platform fee display | Checkout page + booking detail | Done (Phase 11) |
| Booking dashboard | `/bookings` | Done |
| Booking detail page | `/bookings/[bookingId]` | Done |
| Owner actions (cancel/modify/message) | Booking detail page | Done (Phase 11) |
| Booking cancellation modal | `CancelBookingModal` | Done (Phase 11) |
| Carer inquiry response (accept/decline) | Inbox thread | Deferred to Phase 12 |

## Notes

- Payment checkout is a mock — Visa ending in 4242, no real payment processing
- Platform fee is 12%, shown transparently on the checkout page
- Cancellation reason is optional but stored on the booking
- Modification is a mock state — shows a "Modification requested" banner, no real negotiation flow
- Bookings now appear on both `/bookings` and `/schedule` (Phase 11)

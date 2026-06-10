---
status: active
last-reviewed: 2026-05-05
review-trigger: "any time — add items as walkthroughs surface them; run focused passes pre-demo"
---

# Verification Checklist

Running list of "should work — verify before demo" items. Distinct from the **punch list** (which is for *fixing* known issues, ≤30 min) — this file is for *checking* things that weren't part of a phase thesis verification but want a sanity pass before the demo lands.

---

## Workflow

### What belongs here

- Edge cases, regression checks, cross-persona permutations, filter combinations, alternate state paths — anything that *should* work but wasn't worth the time during phase walkthrough.
- Items pulled from walkthroughs at phase close, observations during regular work, or pre-demo audits.

### What does NOT belong here

- Known bugs → punch list.
- Open product calls → phase board or Open Questions log.
- Strategic uncertainty → Open Questions log.

### Adding items

Add to the relevant Surface section as a one-line table row with: what to check, where it came from, file/URL refs, today's date. Use the next number.

### Running a verification pass

1. Pick a Surface or batch a few. Run the dev server.
2. For each item: check the behavior.
   - Works as expected → **remove the row** (commit history is the record).
   - Broken → **move to punch list** with a one-line description and the file ref. Remove from here.
   - Reveals a design issue → flag in phase board, Open Questions, or relevant feature doc. Remove from here.
3. Don't accumulate verified items — the file should shrink as items get checked.

### When to run a pass

- **Pre-demo** — required pass before any external tester sits down with the prototype.
- **Mid-phase** — optional, when the active phase touches a related surface.
- **Ad-hoc** — anytime the file's getting bloated and a focused QA hour would help.

---

## Open Items

### Profile / Provider edit

| # | What to check | Came from | Refs | Added |
|---|---------------|-----------|------|-------|
| V1 | Modifier-config save flow — edits close cleanly; view-mode chips reflect new values in same session. | Pricing & Proposals walkthrough E7 | `components/profile/ProfileServicesTab.tsx` (PricingModifiersEditor) | 2026-05-05 |
| V2 | New service defaults — "Add a service" produces all 4 modifier kinds OFF with defaults (Holiday 25%, Weekend 15%, Multi-pet 100 Kč, Last-minute 10% / 3d). | Pricing & Proposals walkthrough E8 | `lib/pricing.ts` (`defaultModifiers`), `ProfileServicesTab.tsx` | 2026-05-05 |
| V3 | Modifier-less carer (Klára) — accordion present with "0 on", expand shows all 4 kinds in default-OFF state. | Pricing & Proposals walkthrough E9 | `ProfileServicesTab.tsx` | 2026-05-05 |
| V4 | New User flow — pick **Connected circle only** (or **Open to anyone**) in the care-offering picker → "Add a service" → modifier accordion present. | Pricing & Proposals walkthrough E10 (updated 2026-05-11 — care-offering picker replaced the Open-to-helping Toggle) | `ProfileServicesTab.tsx` | 2026-05-05 |

### Discover

| # | What to check | Came from | Refs | Added |
|---|---------------|-----------|------|-------|
| V5 | Discover filter permutations — Sitting / Boarding / All filters resolve correct per-service prices, chip rows hide under specific filter and reappear on All. Boarding filter: Nikola resolves to 480 Kč per night. | Pricing & Proposals walkthrough F3–F5 | `app/discover/care/` | 2026-05-05 |
| V6 | Locked-viewer regression (Daniel) — same per-service pricing behavior across all filters. | Pricing & Proposals walkthrough F6 | same | 2026-05-05 |

### Bookings

| # | What to check | Came from | Refs | Added |
|---|---------------|-----------|------|-------|
| V7 | Booking-detail Pricing breakdown — modifier rows prefixed `+` with italic trigger note, base rows keep `/ visit` / `/ night`, total matches signed proposal. Test with B5's Christmas boarding: 2,400 + 720 = 3,120 Kč. Same rendering on owner and provider sides. | Pricing & Proposals walkthrough G1–G2 | `app/bookings/[bookingId]/page.tsx` | 2026-05-05 |

### Inbox / Messaging

| # | What to check | Came from | Refs | Added |
|---|---------------|-----------|------|-------|
| V8 | Inquiry decline path — Decline button → form opens with optional reason → Send → status flips to Declined + system message lands (with reason if set) + reason callout below title. Cancel restores action row. Owner sees collapsed declined state. | Pricing & Proposals walkthrough H2–H5 | `components/messaging/InquiryCard.tsx` | 2026-05-05 |
| V9 | Engine-estimate visibility — same total + modifier chips on InquiryCard (both sides) and ProposalForm System quote subtotal. Engine output is the canonical answer throughout the lifecycle. | Pricing & Proposals walkthrough I2–I3 | `components/messaging/InquiryCard.tsx`, `ProposalForm.tsx` | 2026-05-05 |
| V10 | InquiryCard collapses post-response — body rows / estimate / notes hidden. Decline-collapse keeps reason callout visible. | Pricing & Proposals walkthrough I4–I5 | `components/messaging/InquiryCard.tsx` | 2026-05-05 |
| V11 | Ongoing booking "Start from" date — optional field above schedule picker; renders as "Starting May 12" on InquiryCard schedule line. | Pricing & Proposals walkthrough I6 | `components/messaging/InquiryForm.tsx`, `InquiryCard.tsx` | 2026-05-05 |
| V12 | BookingProposalCard collapse states — declined renders muted "Declined" footer; accepted renders "View booking →" link routing to `/bookings/[id]`; pending stays expanded with three-action row. | Pricing & Proposals walkthrough J2–J4 | `components/messaging/BookingProposalCard.tsx` | 2026-05-05 |
| V13 | `session_started` notification type renders correctly when delivered — Timer icon + "Care" label in NotificationsPanel + `/notifications`. Verifiable once Inbox & Notifications phase wires actual delivery; no mock seed fires one today. Type + icon mapping already wired in `NotificationsPanel.tsx` + `app/notifications/page.tsx`. | Sessions walkthrough H1 | `lib/types.ts` (NotificationType), `components/ui/NotificationsPanel.tsx`, `app/notifications/page.tsx` | 2026-05-08 |

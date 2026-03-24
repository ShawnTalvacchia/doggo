# Doggo — Task Board

> Format: `T-NNN · [P1/P2/P3] · area · title`
> P1 = blocks demo/correctness · P2 = important but not blocking · P3 = polish / nice-to-have
> Last audited: 2026-03-24 (Phase 12 kickoff)

---

## 🔄 In Progress

_Starting Phase 12 — Demo Ready_

---

## 📋 Backlog

### Phase 12 — Demo Ready

**Workstream A — Complete the Care Funnel**

**T-050 · P1 · inbox** — Carer inquiry response actions
Carers can accept/decline/suggest changes on booking inquiries in inbox threads. New InquiryResponseCard + ProposalForm components.

**T-051 · P2 · schedule** — Incoming requests section for carers
Show pending inquiries on Schedule page (currently only visible in Inbox).

**Workstream B — Component Extraction**

**T-052 · P1 · inbox** — Extract ThreadClient inline components
Move RelationshipBanner, PaymentCard, ContractCard, SigningModal → components/messaging/. Convert inline styles to Tailwind. Target: ThreadClient.tsx < 300 lines.

**T-053 · P2 · schedule** — Extract Schedule booking row card
Same card markup repeated 3×. New BookingListCard component.

**T-054 · P2 · profile** — Decompose profile/page.tsx
Extract ProfileAboutTab, ProfileServicesTab, PetCard → components/profile/. Target: < 600 lines.

**T-055 · P3 · docs** — Component inventory update
Add all new/extracted components to component-inventory.md.

**Workstream C — CSS & Design System Polish**

**T-056 · P2 · design-system** — Dead CSS audit
Grep globals.css classes, cross-reference .tsx files, remove unused. Target: < 8,000 lines.

**T-057 · P2 · design-system** — Inline style migration (5 pages)
Convert inline style={{}} to Tailwind on: profile, meets detail, checkout, groups detail, schedule.

**T-058 · P3 · ui** — EmptyState component
Create components/ui/EmptyState.tsx, replace ad-hoc empty state patterns.

**T-059 · P3 · ui** — ButtonAction adoption pass
Replace remaining raw <button>/<a> with ButtonAction in SigningModal, PaymentCard, "View all" links.

---

### Design System (Parked)

**T-003 · P3 · design-system**
Sync design-tokens.md after next Figma session.
Deferred until after Phase 12 build is complete and Figma pass happens.

---

### Community Version (Parked)

_Explicitly deferred until Provider Version is validated._

**T-C01 · parked · community** — Familiar faces / seen-before indicators
**T-C02 · parked · community** — Trust ladder signals (Presence → Helper)
**T-C03 · parked · community** — Community version product principles and scope

---

## ✅ Done

### Phase 11 — Booking & Care Polish

**T-D43 · booking** — Connection gating on care CTAs
**T-D44 · booking** — Payment mock checkout page
**T-D45 · booking** — Provider setup consolidation
**T-D46 · booking** — Owner booking actions
**T-D47 · schedule** — Care bookings section on Schedule page
**T-D48 · explore** — UI consistency pass

### Earlier Phases

See git history and phase docs in `docs/phases/` for full task history (Phases 1–10).

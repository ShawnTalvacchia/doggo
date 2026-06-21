---
status: active
last-reviewed: 2026-06-21
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Design-System Audit + Cleanup — Walkthrough (bare-bones)

Per the demo-scope pivot (board → Open notes), I drove this phase myself and
**self-verified the visible changes on the dev server**. This doc is deliberately
minimal: only what's worth your glance, plus the one thing that's genuinely your
call. Everything else was a call I made — full rationale lives in the commits +
the board.

**What shipped (14 commits):** the own-profile price bug fixed (shared
`ServiceCardViews`); a real `--status-volunteer-*` token family (all violet hex
gone); **~1,150 lines of dead CSS removed** (master-detail shell, discover-shell,
old inbox, page-shell families — `globals.css` 18,978 → ~17,500); `SortMenu` +
`CheckboxRow density` + input-affix rename; optional labels canonicalized;
Principle-13 CTA-wrap; ScheduleCard status → inline (Principle 7); info alert →
blue. **Deferred for the demo:** the invisible code-health tail (C3, C4/WS-H, C6,
FC4, F3/F4/F5, E2/E3, WS-G) — see board Open notes.

---

## Glance to confirm (optional — I verified these)

These are the only changes a demo-walker would actually see. I checked them; a
second glance is welcome but not required.

- [ ] **Service cards show correct prices on the carer's OWN profile.** `/profile?as=klara` → Services. *Expect:* "From" prefix + pickup/drop-off + full/half-day rows — identical to what a visitor sees (this was the real bug).
- [ ] **ScheduleCard status reads as inline coloured text, not pills.** `/schedule?as=klara`. *Expect:* "Hosting" green, "Providing" blue, "Cancelled" red — icon + text, no chip chrome. *(Verified.)*
- [ ] **Volunteer surfaces + info alerts unchanged-but-tokenized.** `/discover/help-a-dog` (violet intact) and any info toast (now blue, not violet).
- [ ] **No broken layouts on the de-dead-coded surfaces.** Discover, Inbox, Community, Schedule, Bookings still render (the ~1,150-line CSS deletion preserved every live class; braces balanced + grep-verified, but these are the surfaces it touched).

---

## One call, only if you want code-health later

- [ ] **C4 / WS-H — type-scale reconciliation.** `--text-xs/sm/base` are mapped one step apart between `@theme` (Tailwind utilities) and `:root` (CSS vars). I **deliberately did not touch it**: reconciling shifts text sizes app-wide with real visual risk and **zero demo payoff**. It blocks the (also-deferred) 294-site font-size migration. Only worth doing as a code-health task, never for the demo. Your call if/when that matters.

---

## Decisions surfaced (propagation log for close)

- **WS-A: shared `ServiceCardViews`** — own-profile price bug fixed; both profile surfaces render through it. → `design-system.md` (done), `features/profiles.md` + `features/explore-and-care.md` (service-card note)
- **WS-B: `--status-volunteer-*` family** promoted; `.alert--info` moved off violet onto blue `--status-info-*`. → `design-system.md` + `design-tokens.md` (done)
- **WS-C/C8: ~1,150 lines dead CSS removed** (4 dead shell/panel families, all PageColumn-superseded); resolves E1 (shells were dead, not mergeable). → `design-system.md` (done)
- **WS-D: `SortMenu` (FC15), `CheckboxRow density` (P78), `.input-with-trailing-icon` rename.** → `design-system.md` (done)
- **WS-F: optional labels → `(Optional)`; Principle-13 CTA-wrap; ScheduleCard status → inline (Principle 7).** → `design-system.md` Principle 7/13 (already documented)
- **Deferred-for-demo (code-health, mapped on board):** C3, C4/WS-H, C6, FC4, F3/F4/F5, E2/E3, WS-G. → no doc update needed (board carries them)

---
status: archived
last-reviewed: 2026-06-21
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Design-System Audit + Cleanup — Quick Look

The big things, where to see them. ~30 seconds each. Everything else was a call I
made + self-verified; detail lives in the commits + board.

## Worth a glance

1. **The bug fix — own-profile prices.** `/profile?as=klara` → Services tab.
   Carers used to see a wrong, flat price on their *own* profile (missing the
   "From" / pickup vs drop-off / full vs half-day breakdown). Now it matches
   exactly what a visitor sees. *This was the real prize of the phase.*

2. **ScheduleCard status is now clean inline text, not pills.** `/schedule?as=klara`.
   "Hosting" (green), "Providing" (blue), "Cancelled" (red) — icon + coloured
   text in the corner, no chip chrome.

3. **~1,150 lines of dead CSS gone — and nothing broke.** Click around Inbox,
   Community, Discover, Schedule. They all render exactly as before (I removed
   four dead layout systems that `PageColumn` had already replaced). Nothing new
   to *see* — the point is it still works.

4. **Volunteer colour is now a real token; info alerts are blue.** `/discover/help-a-dog`
   (violet unchanged) and any "info" toast (was oddly violet → now blue).

## One thing only you can decide (skip unless you care about code-health)

The `--text-*` font-size scale has a long-standing internal split. Reconciling it
is invisible to the demo but carries app-wide visual risk, so I left it alone. We
only touch it if/when code-health matters, not for the demo.

---

<details>
<summary>Decisions log (for phase close — ignore)</summary>

- **WS-A** shared `ServiceCardViews` (own-profile price bug fixed) → `design-system.md`, `features/profiles.md`, `features/explore-and-care.md`
- **WS-B** `--status-volunteer-*` family + `.alert--info` → blue → `design-system.md`, `design-tokens.md`
- **WS-C/C8** ~1,150 lines dead CSS removed (4 PageColumn-superseded families); resolves E1 → `design-system.md`
- **WS-D** `SortMenu` (FC15), `CheckboxRow density` (P78), `.input-with-trailing-icon` rename → `design-system.md`
- **WS-F** optional labels → `(Optional)`; Principle-13 CTA-wrap; ScheduleCard status → inline (Principle 7) → `design-system.md`
- **Deferred-for-demo** (mapped on board, no doc update): C3, C4/WS-H, C6, FC4, F3/F4/F5, E2/E3, WS-G

</details>

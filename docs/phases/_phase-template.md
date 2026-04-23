---
status: active
last-reviewed: YYYY-MM-DD
review-trigger: When any task is completed or blocked
---

# Phase Name

**Goal:** One sentence describing what "done" looks like.

**Depends on:** Previous phases or conditions.

**Refs:** [[doc-1]], [[doc-2]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [ ] Read every task and its referenced docs
- [ ] Review Open Questions log — flag anything affecting this phase
- [ ] Audit for conflicts between phase plan and current codebase
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks
- [ ] Confirm scope — no tasks that belong in a different phase

---

## Workstream A — Name

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Description | [[ref]] | todo |

---

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived, then delete original from `phases/`)
- [ ] **Structural audit** — run before marking the phase done:
    - Any files in `docs/phases/` with `status: archived` or `status: complete`? Delete them (archive copy should already exist).
    - Any filename duplicated between `docs/phases/` and `docs/archive/phases/`? Delete the live copy.
    - Any docs in `strategy/`, `features/`, `implementation/` with `last-reviewed` older than 21 days? Review or bump.
    - Any dead references in `README.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md` to files that no longer exist? Fix.
- [ ] Check next phase scope for conflicts with what was just built

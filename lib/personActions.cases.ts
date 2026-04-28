/**
 * Matrix coverage cases for `resolvePersonActions`.
 *
 * Framework-agnostic test fixtures. There's no test runner wired up in the
 * project yet (out of scope for Trust & Visibility Pass — see phase A3 notes),
 * so for now `verifyMatrix()` is the canonical assertion path. When a runner
 * lands, these cases plug straight into `it.each(MATRIX_CASES)(...)`.
 *
 * Every row of the action matrix
 * (`docs/phases/trust-visibility-pass.md` → Action Matrix) has at least one case
 * here. Add a case before adding a branch to the function.
 */

import {
  resolvePersonActions,
  type PersonAction,
  type PersonActionSubject,
  type PersonActionViewer,
} from "./personActions";

export type MatrixCase = {
  label: string;
  viewer: PersonActionViewer;
  subject: PersonActionSubject;
  expected: PersonAction[];
};

const VIEWER_LOCKED: PersonActionViewer = { userId: "viewer", profileOpen: false };
const VIEWER_OPEN: PersonActionViewer = { userId: "viewer", profileOpen: true };

const sub = (overrides: Partial<PersonActionSubject> = {}): PersonActionSubject => ({
  userId: "subject",
  connectionState: "none",
  ...overrides,
});

export const MATRIX_CASES: MatrixCase[] = [
  // ── Self ───────────────────────────────────────────────────────────────────
  {
    label: "self → no actions",
    viewer: VIEWER_LOCKED,
    subject: sub({ userId: "viewer" }),
    expected: [],
  },

  // ── Connected ──────────────────────────────────────────────────────────────
  {
    label: "connected → message only",
    viewer: VIEWER_LOCKED,
    subject: sub({ connectionState: "connected" }),
    expected: [{ kind: "message" }],
  },

  // ── Pending ────────────────────────────────────────────────────────────────
  {
    label: "pending → no actions (pill only)",
    viewer: VIEWER_LOCKED,
    subject: sub({ connectionState: "pending" }),
    expected: [],
  },

  // ── Outbound Familiar (I marked them) ──────────────────────────────────────
  {
    label: "I marked them Familiar + subject locked-to-me → familiar(on) only",
    viewer: VIEWER_LOCKED,
    subject: sub({ connectionState: "familiar" }),
    expected: [{ kind: "familiar", state: "on" }],
  },
  {
    label: "I marked them Familiar + subject open → connect + familiar(on)",
    viewer: VIEWER_LOCKED,
    subject: sub({ connectionState: "familiar", profileOpen: true }),
    expected: [{ kind: "connect" }, { kind: "familiar", state: "on" }],
  },
  {
    label: "I marked them Familiar + they marked me back → connect + familiar(on)",
    viewer: VIEWER_LOCKED,
    subject: sub({ connectionState: "familiar", theyMarkedFamiliar: true }),
    expected: [{ kind: "connect" }, { kind: "familiar", state: "on" }],
  },

  // ── None — signal variations ───────────────────────────────────────────────
  {
    label: "none + locked-locked-no-action → familiar(off) only",
    viewer: VIEWER_LOCKED,
    subject: sub(),
    expected: [{ kind: "familiar", state: "off" }],
  },
  {
    label: "none + viewer open → connect + familiar(off)",
    viewer: VIEWER_OPEN,
    subject: sub(),
    expected: [{ kind: "connect" }, { kind: "familiar", state: "off" }],
  },
  {
    label: "none + subject open → connect + familiar(off)",
    viewer: VIEWER_LOCKED,
    subject: sub({ profileOpen: true }),
    expected: [{ kind: "connect" }, { kind: "familiar", state: "off" }],
  },
  {
    label: "none + theyMarkedFamiliar → connect + familiar(off)",
    viewer: VIEWER_LOCKED,
    subject: sub({ theyMarkedFamiliar: true }),
    expected: [{ kind: "connect" }, { kind: "familiar", state: "off" }],
  },
  {
    label: "none + both profiles open → connect + familiar(off)",
    viewer: VIEWER_OPEN,
    subject: sub({ profileOpen: true }),
    expected: [{ kind: "connect" }, { kind: "familiar", state: "off" }],
  },
];

export type MatrixFailure = {
  label: string;
  expected: PersonAction[];
  got: PersonAction[];
};

/**
 * Verify every matrix case. Returns failures (empty array = all pass).
 *
 * Usage from a script or REPL:
 *   import { verifyMatrix } from "@/lib/personActions.cases";
 *   const failures = verifyMatrix();
 *   if (failures.length) console.error(failures); else console.log("matrix ok");
 */
export function verifyMatrix(): MatrixFailure[] {
  const failures: MatrixFailure[] = [];
  for (const c of MATRIX_CASES) {
    const got = resolvePersonActions(c.viewer, c.subject);
    if (JSON.stringify(got) !== JSON.stringify(c.expected)) {
      failures.push({ label: c.label, expected: c.expected, got });
    }
  }
  return failures;
}

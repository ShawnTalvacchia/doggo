/**
 * ResultsSectionHeader — section header for grouped results on Discover
 * surfaces (e.g. "Carers in your circle" / "Other carers" on
 * `/discover/care`; "Meets from your circle" / "Other meets" on
 * `/discover/meets`).
 *
 * Distinct from `components/people/PersonSections.tsx:SectionHeader` —
 * that one is a quieter sub-section label inside a person list (CONNECTED
 * / FAMILIAR / ADMINS within one tab); this one separates higher-level
 * result groupings on a directory surface and reads more prominent
 * (heading-weight, secondary text color, surface-base background that
 * sits the header on the page surface beneath the cards above and below).
 *
 * **Variants** (CCFT 2026-05-11):
 * - `"default"` — neutral chrome (surface-base bg, text-primary label,
 *   tertiary count). Used for "Other carers" / "Other meets" sections
 *   and any non-elevated grouping.
 * - `"in-circle"` — brand chrome (brand-subtle bg, 3px brand-main left
 *   stripe, brand-strong label, brand-main count). Reads as one elevated
 *   block with the in-circle cards below (which carry the matching
 *   `.result-card--in-circle` / `.card-schedule-meet--in-circle` stripe).
 *
 * Discover Refinement walkthrough decision, 2026-05-10 — extracted from
 * inline JSX in `app/discover/care/page.tsx`. In-circle variant added
 * during the CCFT IA-refresh walkthrough (2026-05-11).
 */
export function ResultsSectionHeader({
  label,
  count,
  variant = "default",
}: {
  label: string;
  count: number;
  variant?: "default" | "in-circle";
}) {
  return (
    <h3
      className={`results-section-header${
        variant === "in-circle" ? " results-section-header--in-circle" : ""
      }`}
    >
      {label}{" "}
      <span className="results-section-header-count">({count})</span>
    </h3>
  );
}

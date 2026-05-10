/**
 * ResultsSectionHeader — section header for grouped results on Discover
 * surfaces (e.g. "Carers in your circle" / "Other carers" on
 * `/discover/care`).
 *
 * Distinct from `components/people/PersonSections.tsx:SectionHeader` —
 * that one is a quieter sub-section label inside a person list (CONNECTED
 * / FAMILIAR / ADMINS within one tab); this one separates higher-level
 * result groupings on a directory surface and reads more prominent
 * (heading-weight, secondary text color, surface-base background that
 * sits the header on the page surface beneath the cards above and below).
 *
 * Discover Refinement walkthrough decision, 2026-05-10 — extracted from
 * inline JSX in `app/discover/care/page.tsx` to give it a proper component
 * home, drop the inline-style usage, and wrap the styling in a CSS class.
 */
export function ResultsSectionHeader({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  return (
    <h3 className="results-section-header">
      {label}{" "}
      <span className="results-section-header-count">({count})</span>
    </h3>
  );
}

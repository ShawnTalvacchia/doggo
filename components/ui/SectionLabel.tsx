/**
 * Uppercase section label — the small caps heading used in detail panels
 * and list sections (e.g. "Overview", "Schedule & Pricing", "Sessions").
 */
export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-xs font-semibold text-fg-tertiary uppercase tracking-wider ${className}`.trim()}
    >
      {children}
    </span>
  );
}

"use client";

interface FilterPill {
  key: string;
  label: string;
}

interface FilterPillRowProps {
  pills: FilterPill[];
  activeKey: string;
  onChange: (key: string) => void;
}

/**
 * Horizontal row of filter pills — single select.
 * Used for sub-filtering within a tab (Community groups, Schedule care, Discover types).
 */
export function FilterPillRow({ pills, activeKey, onChange }: FilterPillRowProps) {
  return (
    <div className="filter-pill-row">
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          className={`filter-pill${activeKey === pill.key ? " filter-pill--active" : ""}`}
          onClick={() => onChange(pill.key)}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}

"use client";

interface Tab {
  key: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function TabBar({ tabs, activeKey, onChange }: TabBarProps) {
  return (
    <div className="flex gap-xs border-b border-edge-light">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`px-md py-sm text-sm font-medium bg-transparent border-none cursor-pointer transition-colors ${
            tab.key === activeKey
              ? "text-brand-main border-b-2 border-brand-main -mb-px"
              : "text-fg-secondary hover:text-fg-primary"
          }`}
          style={tab.key === activeKey ? { borderBottom: "2px solid var(--brand-main)" } : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

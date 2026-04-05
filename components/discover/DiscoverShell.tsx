"use client";

import { useState, type ReactNode } from "react";
import { TabBar } from "@/components/ui/TabBar";
import { CardExploreResult } from "@/components/explore/CardExploreResult";
import { providers } from "@/lib/mockData";
import MapView from "@/components/explore/MapView";
import type { ServiceType } from "@/lib/types";

const MOBILE_TABS = [
  { key: "results", label: "Results" },
  { key: "filters", label: "Filters" },
];

interface DiscoverShellProps {
  /** Content for the left hub panel */
  hubPanel: ReactNode;
  /** Header text for the results panel */
  resultsTitle: string;
  /** Icon element for the results header */
  resultsIcon?: ReactNode;
  /** Active service filter for results */
  activeService?: ServiceType | null;
  /** Max providers to show */
  maxResults?: number;
  /** Custom results content — overrides the default provider cards */
  resultsContent?: ReactNode;
  /** Custom right panel content — overrides the default map */
  rightPanel?: ReactNode;
  /** Hide the right panel entirely */
  hideRightPanel?: boolean;
  /** On mobile, show tabbed Results/Filters view */
  mobileShowResults?: boolean;
}

export function DiscoverShell({
  hubPanel,
  resultsTitle,
  resultsIcon,
  activeService = null,
  maxResults = 4,
  resultsContent,
  rightPanel,
  hideRightPanel = false,
  mobileShowResults = false,
}: DiscoverShellProps) {
  const [mobileTab, setMobileTab] = useState("results");

  const filteredProviders = activeService
    ? providers.filter((p) => p.services.includes(activeService))
    : providers;
  const visibleProviders = filteredProviders.slice(0, maxResults);

  const resultsBody = (
    <div className="discover-results-list">
      <div
        className="discover-results-subheader bg-surface-popout flex items-center gap-sm"
        style={{
          height: 64,
          padding: "0 var(--space-lg)",
          borderBottom: "1px solid var(--border-strong)",
        }}
      >
        {resultsIcon}
        <span className="font-body font-semibold text-md text-fg-primary">
          {resultsTitle}
        </span>
      </div>
      {resultsContent ??
        visibleProviders.map((p) => (
          <CardExploreResult
            key={p.id}
            provider={p}
            activeService={activeService}
          />
        ))}
    </div>
  );

  return (
    <div
      className="discover-page-shell"
      data-mobile-view={mobileShowResults ? "results" : "hub"}
      data-mobile-tab={mobileTab}
    >
      {/* Mobile tabbed view — only visible on mobile when mobileShowResults */}
      {mobileShowResults && (
        <div className="discover-mobile-tabbed">
          <div className="discover-mobile-tabs">
            <TabBar tabs={MOBILE_TABS} activeKey={mobileTab} onChange={setMobileTab} />
          </div>
          <div className="discover-mobile-tab-content">
            {mobileTab === "results" ? resultsBody : hubPanel}
          </div>
        </div>
      )}

      {/* Left panel — hub/navigation (desktop) */}
      <div className="discover-hub-panel">
        {hubPanel}
      </div>

      {/* Middle panel — results (desktop) */}
      <div className="discover-results-panel">
        <div className="discover-results-list">
          <div
            className="discover-results-subheader bg-surface-popout flex items-center gap-sm"
            style={{
              height: 64,
              padding: "0 var(--space-lg)",
              borderBottom: "1px solid var(--border-strong)",
            }}
          >
            {resultsIcon}
            <span className="font-body font-semibold text-md text-fg-primary">
              {resultsTitle}
            </span>
          </div>
          {resultsContent ??
            visibleProviders.map((p) => (
              <CardExploreResult
                key={p.id}
                provider={p}
                activeService={activeService}
              />
            ))}
        </div>
      </div>

      {/* Right panel — map (or custom) */}
      {!hideRightPanel && (
        <div className="discover-map-panel">
          {rightPanel ?? (
            <MapView providers={filteredProviders} service={activeService} />
          )}
        </div>
      )}
    </div>
  );
}

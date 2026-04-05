"use client";

import { useState, type ReactNode } from "react";
import {
  ListDashes,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { CardExploreResult } from "@/components/explore/CardExploreResult";
import { providers } from "@/lib/mockData";
import MapView from "@/components/explore/MapView";
import type { ServiceType } from "@/lib/types";

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
  const [mobileTab, setMobileTab] = useState<"results" | "filters">("results");

  const filteredProviders = activeService
    ? providers.filter((p) => p.services.includes(activeService))
    : providers;
  const visibleProviders = filteredProviders.slice(0, maxResults);

  const resultsBody = (
    <>
      <div
        className="discover-results-subheader bg-surface-popout flex items-center gap-sm"
        style={{
          padding: "var(--space-md) var(--space-lg)",
          borderBottom: "1px solid var(--border-strong)",
        }}
      >
        {resultsIcon}
        <span className="font-body font-semibold text-md text-fg-primary">
          {resultsTitle}
        </span>
      </div>
      <div className="discover-results-list">
        {resultsContent ??
          visibleProviders.map((p) => (
            <CardExploreResult
              key={p.id}
              provider={p}
              activeService={activeService}
            />
          ))}
      </div>
    </>
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
            <button
              className={`discover-mobile-tab${mobileTab === "results" ? " discover-mobile-tab--active" : ""}`}
              onClick={() => setMobileTab("results")}
            >
              <ListDashes size={18} weight={mobileTab === "results" ? "bold" : "regular"} />
              Results
            </button>
            <button
              className={`discover-mobile-tab${mobileTab === "filters" ? " discover-mobile-tab--active" : ""}`}
              onClick={() => setMobileTab("filters")}
            >
              <SlidersHorizontal size={18} weight={mobileTab === "filters" ? "bold" : "regular"} />
              Filters
            </button>
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
        <div
          className="bg-surface-popout flex items-center gap-sm"
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
        <div className="discover-results-list">
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

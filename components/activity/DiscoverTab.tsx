"use client";

import { useState } from "react";
import { Plus, MapPin, CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { CardScheduleMeet } from "./CardScheduleMeet";
import { mockMeets, getUserMeets } from "@/lib/mockMeets";

const FILTERS = ["All", "Walks", "Park Hangouts", "Playdates", "Training"] as const;

const FILTER_TYPE_MAP: Record<string, string | null> = {
  All: null,
  Walks: "walk",
  "Park Hangouts": "park_hangout",
  Playdates: "playdate",
  Training: "training",
};

export function DiscoverTab() {
  const [activeFilter, setActiveFilter] = useState("All");

  const typeFilter = FILTER_TYPE_MAP[activeFilter];
  const allUpcoming = mockMeets
    .filter((m) => m.status === "upcoming")
    .filter((m) => !typeFilter || m.type === typeFilter)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  // Determine user's status for each meet
  const userMeetIds = new Set(
    getUserMeets("shawn")
      .filter((m) => m.status === "upcoming")
      .map((m) => m.id)
  );

  return (
    <div className="body-container-main">
      {/* Header: action buttons + location + filters */}
      <div className="activity-header">
        {/* Mobile action buttons — Find Care + Create (scrolls with content) */}
        <div className="activity-mobile-actions">
          <button
            type="button"
            className="flex items-center justify-center gap-xs flex-1 h-[32px] rounded-xs text-base font-semibold cursor-pointer"
            style={{
              background: "white",
              border: "1px solid var(--border-stronger)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            <MagnifyingGlass size={16} weight="light" />
            Find Care
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-xs flex-1 h-[32px] rounded-xs text-base font-semibold cursor-pointer"
            style={{
              background: "var(--surface-base-inverse)",
              color: "var(--text-inverse)",
              border: "none",
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            <Plus size={16} weight="bold" />
            Create
          </button>
        </div>

        {/* Location picker + Create button (desktop) */}
        <div className="activity-location-row">
          <button
            type="button"
            className="activity-location-picker"
          >
            <MapPin size={20} weight="light" />
            Prague 1
            <CaretDown size={20} weight="light" />
          </button>

          {/* Create button — desktop only */}
          <button
            type="button"
            className="activity-create-desktop"
          >
            <Plus size={16} weight="bold" />
            Create
          </button>
        </div>

        {/* Filter pills */}
        <div className="activity-filters">
          {FILTERS.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="rounded-full text-base cursor-pointer"
                style={{
                  padding: "4.5px 12.5px",
                  fontFamily: "var(--font-body), sans-serif",
                  border: `1px solid ${isActive ? "white" : "var(--border-stronger)"}`,
                  background: isActive ? "var(--brand-main)" : "var(--surface-base)",
                  color: isActive ? "white" : "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card list */}
      <div className="flex flex-col">
        {allUpcoming.length > 0 ? (
          allUpcoming.map((meet) => (
            <CardScheduleMeet
              key={meet.id}
              meet={meet}
              userStatus={userMeetIds.has(meet.id) ? "going" : null}
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-md p-xl">
            <p className="text-sm text-fg-secondary text-center">
              No meets in your area yet. Create one and invite your neighbours!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

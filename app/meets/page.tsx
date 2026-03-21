"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { MeetCard } from "@/components/meets/MeetCard";
import { mockMeets, getUserMeets } from "@/lib/mockMeets";
import type { Meet } from "@/lib/types";

const FILTERS = ["All", "Walks", "Park Hangouts", "Playdates", "Training"] as const;

const FILTER_TYPE_MAP: Record<string, string | null> = {
  All: null,
  Walks: "walk",
  "Park Hangouts": "park_hangout",
  Playdates: "playdate",
  Training: "training",
};

export default function MeetsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const typeFilter = FILTER_TYPE_MAP[activeFilter];
  const allUpcoming = mockMeets
    .filter((m) => m.status === "upcoming")
    .filter((m) => !typeFilter || m.type === typeFilter)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  // "Nearby" = all upcoming (mock — no real geo filtering)
  const nearby = allUpcoming;

  // "Your upcoming" = meets user has joined
  const myUpcoming = getUserMeets("shawn")
    .filter((m) => m.status === "upcoming")
    .filter((m) => !typeFilter || m.type === typeFilter);

  // Recent = completed meets
  const recent = mockMeets
    .filter((m) => m.status === "completed")
    .filter((m) => !typeFilter || m.type === typeFilter);

  return (
    <div className="flex flex-col gap-xl p-xl" style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}>
      <header className="flex items-center justify-between pt-md">
        <h1 className="font-heading text-4xl font-semibold text-fg-primary">Meets</h1>
        <ButtonAction
          variant="primary"
          size="sm"
          cta
          href="/meets/create"
          leftIcon={<Plus size={16} weight="bold" />}
        >
          Create
        </ButtonAction>
      </header>

      {/* Filter pills */}
      <div className="pill-group">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`pill${filter === activeFilter ? " active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Nearby meets */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-xl font-semibold text-fg-primary">Nearby</h2>
        {nearby.length > 0 ? (
          <div className="flex flex-col gap-md">
            {nearby.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-md rounded-panel bg-surface-top p-xl shadow-sm">
            <p className="text-sm text-fg-secondary text-center">
              No meets in your area yet. Create one and invite your neighbours!
            </p>
          </div>
        )}
      </section>

      {/* Your upcoming */}
      {myUpcoming.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-xl font-semibold text-fg-primary">Your Upcoming</h2>
          <div className="flex flex-col gap-md">
            {myUpcoming.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      {recent.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-xl font-semibold text-fg-primary">Recent</h2>
          <div className="flex flex-col gap-md">
            {recent.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  PawPrint,
  MapPin,
  CaretRight,
  Path,
  TreePalm,
  Dog,
  Barbell,
} from "@phosphor-icons/react";
import { DiscoverShell } from "@/components/discover/DiscoverShell";
import { CardScheduleMeet } from "@/components/activity/CardScheduleMeet";
import { mockMeets, getUserMeets } from "@/lib/mockMeets";

const MEET_TYPES = [
  {
    key: "walk",
    label: "Walks",
    description: "Leashed neighbourhood walks",
    icon: Path,
  },
  {
    key: "park_hangout",
    label: "Park Hangouts",
    description: "Off-leash play at local parks",
    icon: TreePalm,
  },
  {
    key: "playdate",
    label: "Playdates",
    description: "Small group dog dates",
    icon: Dog,
  },
  {
    key: "training",
    label: "Training",
    description: "Group training sessions",
    icon: Barbell,
  },
] as const;

function MeetsHubPanel() {
  return (
    <>
      <div className="list-panel-header">
        <Link
          href="/discover"
          className="flex items-center gap-sm"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={20} weight="regular" className="text-fg-primary" />
          <h2
            className="font-heading font-bold text-fg-primary"
            style={{ fontSize: "var(--text-2xl)", lineHeight: 1.2 }}
          >
            Meets
          </h2>
        </Link>
      </div>
      <div className="discover-hub-body">
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            Near
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-tertiary">Vinohrady</span>
          </div>
        </div>

        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            What kind of meet?
          </span>
          <div className="flex flex-col gap-lg">
            {MEET_TYPES.map((mt) => (
              <div
                key={mt.key}
                className="bg-surface-top border border-edge-stronger flex items-center gap-md rounded-sm"
                style={{
                  padding: "var(--space-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <mt.icon size={32} weight="regular" className="text-fg-secondary shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-semibold text-md text-fg-secondary">
                    {mt.label}
                  </span>
                  <span className="text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>
                    {mt.description}
                  </span>
                </div>
                <CaretRight size={20} weight="light" className="text-fg-secondary shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function MeetsResultsList() {
  const allUpcoming = mockMeets
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  const userMeetIds = new Set(
    getUserMeets("shawn")
      .filter((m) => m.status === "upcoming")
      .map((m) => m.id)
  );

  return (
    <>
      {allUpcoming.map((meet) => (
        <CardScheduleMeet
          key={meet.id}
          meet={meet}
          userStatus={userMeetIds.has(meet.id) ? "going" : null}
        />
      ))}
    </>
  );
}

export default function DiscoverMeetsPage() {
  return (
    <DiscoverShell
      hubPanel={<MeetsHubPanel />}
      resultsTitle="Find your pack"
      resultsIcon={<PawPrint size={20} weight="regular" className="text-fg-primary" />}
      resultsContent={<MeetsResultsList />}
      hideRightPanel
    />
  );
}

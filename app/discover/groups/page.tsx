"use client";

import Link from "next/link";
import {
  ArrowLeft,
  UsersThree,
  MapPin,
  CaretRight,
  Tree,
  UsersFour,
  Wrench,
} from "@phosphor-icons/react";
import { DiscoverShell } from "@/components/discover/DiscoverShell";
import { GroupCard } from "@/components/groups/GroupCard";
import { getAllPublicGroups, getUserGroups } from "@/lib/mockGroups";

const GROUP_TYPES = [
  {
    key: "park",
    label: "Park groups",
    description: "Auto-created for local parks",
    icon: Tree,
  },
  {
    key: "community",
    label: "Community",
    description: "User-created social groups",
    icon: UsersFour,
  },
  {
    key: "service",
    label: "Hosted",
    description: "Provider-run service groups",
    icon: Wrench,
  },
] as const;

function GroupsHubPanel() {
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
            Groups
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
            Type of group
          </span>
          <div className="flex flex-col gap-lg">
            {GROUP_TYPES.map((gt) => (
              <div
                key={gt.key}
                className="bg-surface-top border border-edge-stronger flex items-center gap-md rounded-sm"
                style={{
                  padding: "var(--space-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <gt.icon size={32} weight="regular" className="text-fg-secondary shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-semibold text-md text-fg-secondary">
                    {gt.label}
                  </span>
                  <span className="text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>
                    {gt.description}
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

function GroupsResultsList() {
  const userGroups = getUserGroups("shawn");
  const userGroupIds = new Set(userGroups.map((g) => g.id));
  const publicGroups = getAllPublicGroups().filter((g) => !userGroupIds.has(g.id));

  return (
    <>
      {publicGroups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </>
  );
}

export default function DiscoverGroupsPage() {
  return (
    <DiscoverShell
      hubPanel={<GroupsHubPanel />}
      resultsTitle="Discover Groups"
      resultsIcon={<UsersThree size={20} weight="regular" className="text-fg-primary" />}
      resultsContent={<GroupsResultsList />}
      hideRightPanel
    />
  );
}

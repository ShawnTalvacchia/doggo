"use client";

import { useState } from "react";
import { UsersThree, Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { GroupCard } from "@/components/groups/GroupCard";
import { getUserGroups, getAllPublicGroups } from "@/lib/mockGroups";

type Filter = "all" | "yours" | "open" | "approval" | "private";

export default function GroupsBrowsePage() {
  const [filter, setFilter] = useState<Filter>("all");

  const userGroups = getUserGroups("shawn");
  const publicGroups = getAllPublicGroups();

  const userGroupIds = new Set(userGroups.map((g) => g.id));
  const discoverGroups = publicGroups.filter((g) => !userGroupIds.has(g.id));

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "yours", label: "Your Communities" },
    { key: "open", label: "Open" },
    { key: "approval", label: "Approval" },
    { key: "private", label: "Private" },
  ];

  const showYours = filter === "all" || filter === "yours";
  const showDiscover =
    filter === "all" || filter === "open" || filter === "approval";
  const showPrivate = filter === "private";

  return (
    <div
      className="flex flex-col gap-xl p-xl"
      style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl font-semibold text-fg-primary flex items-center gap-sm">
          <UsersThree size={28} weight="light" className="text-brand-main" />
          Communities
        </h1>
        <ButtonAction
          variant="primary"
          size="md"
          href="/groups/create"
          leftIcon={<Plus size={18} weight="bold" />}
        >
          Create
        </ButtonAction>
      </div>

      {/* Filter pills */}
      <div className="pill-group">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`pill ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Your communities */}
      {showYours && userGroups.length > 0 && (
        <section className="flex flex-col gap-md">
          <h2 className="font-heading text-xl font-semibold text-fg-primary">
            Your communities
          </h2>
          <div className="flex flex-col gap-md">
            {userGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {/* Discover */}
      {showDiscover && discoverGroups.length > 0 && (
        <section className="flex flex-col gap-md">
          <h2 className="font-heading text-xl font-semibold text-fg-primary">
            Discover
          </h2>
          <div className="flex flex-col gap-md">
            {discoverGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {/* Private groups the user is in */}
      {showPrivate && (
        <section className="flex flex-col gap-md">
          <h2 className="font-heading text-xl font-semibold text-fg-primary">
            Private communities
          </h2>
          {userGroups.filter((g) => g.visibility === "private").length > 0 ? (
            <div className="flex flex-col gap-md">
              {userGroups
                .filter((g) => g.visibility === "private")
                .map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-md rounded-panel bg-surface-top p-xl shadow-sm">
              <UsersThree size={48} weight="light" className="text-fg-tertiary" />
              <p className="text-sm text-fg-secondary text-center">
                You&apos;re not in any private communities yet.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

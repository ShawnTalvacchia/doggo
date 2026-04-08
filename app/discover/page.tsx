"use client";

import Link from "next/link";
import {
  PawPrint,
  UsersThree,
  Heart,
  MapPin,
  CaretRight,
} from "@phosphor-icons/react";
import { DiscoverShell } from "@/components/discover/DiscoverShell";
import { Spacer } from "@/components/layout/Spacer";

const CATEGORIES = [
  {
    key: "meets",
    label: "Meets",
    description: "Walks, playdates, and hangouts with other dog owners nearby",
    icon: PawPrint,
    href: "/discover/meets",
  },
  {
    key: "groups",
    label: "Groups",
    description: "Join local communities based on neighbourhood, interests, or care",
    icon: UsersThree,
    href: "/discover/groups",
  },
  {
    key: "care",
    label: "Dog Care",
    description: "Find trusted walkers, sitters, and boarding from people you know",
    icon: Heart,
    href: "/discover/care",
  },
] as const;

function HubPanel() {
  return (
    <>
      <div className="list-panel-header panel-header-desktop">
        <h2 className="font-heading text-lg font-bold text-fg-primary m-0">
          Discover
        </h2>
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
            What are you looking for?
          </span>
          <div className="flex flex-col gap-lg">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className="bg-surface-top border border-edge-stronger flex items-center gap-md rounded-sm"
                style={{
                  textDecoration: "none",
                  padding: "var(--space-lg)",
                  overflow: "hidden",
                }}
              >
                <cat.icon size={32} weight="regular" className="text-fg-secondary shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-semibold text-md text-fg-secondary">
                    {cat.label}
                  </span>
                  <span className="text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>
                    {cat.description}
                  </span>
                </div>
                <CaretRight size={20} weight="light" className="text-fg-secondary shrink-0" />
              </Link>
            ))}
          </div>
        </div>
        <Spacer size="sm" />
      </div>
    </>
  );
}

export default function DiscoverPage() {
  return (
    <DiscoverShell
      hubPanel={<HubPanel />}
      resultsTitle="Find your pack"
      resultsIcon={<PawPrint size={20} weight="regular" className="text-fg-primary" />}
    />
  );
}

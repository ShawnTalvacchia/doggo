"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Buildings,
  Dog,
  Users,
  Images,
  Heart,
  Clock,
  ShieldCheck,
  PawPrint,
  CaretRight,
  Globe,
  FacebookLogo,
  InstagramLogo,
  Envelope,
} from "@phosphor-icons/react";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { Spacer } from "@/components/layout/Spacer";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { ShelterDogCard } from "@/components/shelters/ShelterDogCard";
import { ShelterMemberRow } from "@/components/shelters/ShelterMemberRow";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import {
  getShelterById,
  getShelterFeed,
  getDogsNeedingWalks,
  countDogsNeedingWalks,
  countLongStayers,
} from "@/lib/mockShelters";
import type {
  PetProfile,
  Post,
  ShelterProfile,
  ShelterSupporter,
  ShelterWalker,
} from "@/lib/types";

/* ── Page wrapper (Suspense for useSearchParams) ───────────────────── */

export default function ShelterDetailPage() {
  return (
    <Suspense>
      <ShelterDetailInner />
    </Suspense>
  );
}

function ShelterDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawActiveTab = searchParams.get("tab") || "feed";
  const { setDetailHeader, clearDetailHeader } = usePageHeader();

  const shelter = getShelterById(params.id as string);

  const tabs = useMemo(
    () => [
      { key: "feed", label: "Feed" },
      { key: "dogs", label: "Dogs" },
      { key: "members", label: "Members" },
      { key: "gallery", label: "Gallery" },
    ],
    [],
  );
  const visibleKeys = new Set(tabs.map((t) => t.key));
  const activeTab = visibleKeys.has(rawActiveTab) ? rawActiveTab : "feed";

  // Mobile detail header — back goes to home (no /shelters list view yet).
  useEffect(() => {
    if (!shelter) return;
    setDetailHeader(shelter.name, () => router.push("/home"));
    return () => clearDetailHeader();
  }, [shelter?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shelter) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Shelter not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/home")}>
          Back to home
        </ButtonAction>
      </div>
    );
  }

  const handleTabChange = (key: string) => {
    if (key === "feed") {
      router.replace(`/shelters/${shelter.id}`, { scroll: false });
    } else {
      router.replace(`/shelters/${shelter.id}?tab=${key}`, { scroll: false });
    }
  };

  return (
    <div className="shelter-detail-page">
      <DetailHeader backLabel="Back" title={shelter.name} />

      <div className="shelter-detail-panel">
        <div className="shelter-detail-body">
          {/* Banner + info chrome — only on Feed tab (mirrors profile pattern
              where the hero collapses on sub-tabs to give content room). */}
          {activeTab === "feed" && <ShelterHero shelter={shelter} />}

          <div className="detail-tabs detail-tabs--fill">
            <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
          </div>

          {activeTab === "feed" && <FeedTab shelter={shelter} />}
          {activeTab === "dogs" && <DogsTab shelter={shelter} />}
          {activeTab === "members" && <MembersTab shelter={shelter} />}
          {activeTab === "gallery" && <GalleryTab />}

          <Spacer />
        </div>
      </div>
    </div>
  );
}

/* ── Hero (banner + logo + name + location) ────────────────────────── */

function ShelterHero({ shelter }: { shelter: ShelterProfile }) {
  return (
    <>
      <div
        className="shelter-detail-banner"
        style={{ backgroundImage: shelter.bannerUrl ? `url(${shelter.bannerUrl})` : undefined }}
      />
      <div className="shelter-detail-info">
        <div className="shelter-detail-avatar-row">
          <img
            src={shelter.logoUrl}
            alt={shelter.name}
            className="shelter-detail-avatar"
          />
          <div className="flex flex-col gap-xxs">
            <h1 className="text-2xl font-semibold text-fg-primary m-0" style={{ fontFamily: "var(--font-heading)" }}>
              {shelter.name}
            </h1>
            <div className="flex items-center gap-xs text-sm text-fg-tertiary">
              <MapPin size={14} weight="light" />
              <span>{shelter.location}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Feed tab ──────────────────────────────────────────────────────── */

function FeedTab({ shelter }: { shelter: ShelterProfile }) {
  const posts = getShelterFeed(shelter);

  return (
    <div className="shelter-feed">
      <ShelterInfoCard shelter={shelter} />
      <DogsInCareSummaryCard shelter={shelter} />

      {posts.length === 0 ? (
        <div className="px-lg pb-lg">
          <EmptyState
            icon={<PawPrint size={32} weight="light" />}
            title="No posts yet"
            subtitle="Walks, adoption celebrations, and dog stories will land here."
          />
        </div>
      ) : (
        <div className="shelter-feed-list">
          {posts.map((post) => (
            <MomentCardFromPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShelterInfoCard({ shelter }: { shelter: ShelterProfile }) {
  const teamCount = shelter.team?.length ?? 0;
  const runBy = teamCount > 0
    ? `Run by ${teamCount} ${teamCount === 1 ? "team member" : "team members"}`
    : `Run by the ${shelter.name} team`;

  return (
    <div className="shelter-info-card">
      <p className="shelter-info-bio">{shelter.bio}</p>

      <div className="shelter-info-meta">
        <div className="shelter-info-meta-row">
          <Users size={14} weight="light" />
          <span>{runBy}</span>
        </div>
        {shelter.establishedYear && (
          <div className="shelter-info-meta-row">
            <Clock size={14} weight="light" />
            <span>Caring for dogs since {shelter.establishedYear}</span>
          </div>
        )}
        {shelter.policy.groupWalksPermitted === false && (
          <div className="shelter-info-meta-row">
            <ShieldCheck size={14} weight="light" />
            <span>Solo walks only — even our calmest dogs do best one-on-one.</span>
          </div>
        )}
      </div>

      {(shelter.website || shelter.socialLinks) && (
        <div className="shelter-info-links">
          {shelter.website && (
            <a
              href={`https://${shelter.website}`}
              target="_blank"
              rel="noreferrer"
              className="shelter-info-link"
            >
              <Globe size={12} weight="light" />
              {shelter.website}
            </a>
          )}
          {shelter.socialLinks?.facebook && (
            <span className="shelter-info-link">
              <FacebookLogo size={12} weight="light" />
              {shelter.socialLinks.facebook}
            </span>
          )}
          {shelter.socialLinks?.instagram && (
            <span className="shelter-info-link">
              <InstagramLogo size={12} weight="light" />
              {shelter.socialLinks.instagram}
            </span>
          )}
          {shelter.socialLinks?.email && (
            <span className="shelter-info-link">
              <Envelope size={12} weight="light" />
              {shelter.socialLinks.email}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function DogsInCareSummaryCard({ shelter }: { shelter: ShelterProfile }) {
  const dogCount = shelter.dogs.length;
  const needWalks = countDogsNeedingWalks(shelter);
  const longStayers = countLongStayers(shelter);

  const summaryParts: string[] = [`${dogCount} dogs in care`];
  if (needWalks > 0) summaryParts.push(`${needWalks} need walks now`);
  if (longStayers > 0) summaryParts.push(`${longStayers} long-stayer${longStayers === 1 ? "" : "s"}`);

  return (
    <Link
      href={`/shelters/${shelter.id}?tab=dogs`}
      className="shelter-summary-card"
      style={{ textDecoration: "none" }}
    >
      <div className="shelter-summary-card-icon">
        <Dog size={20} weight="light" />
      </div>
      <div className="flex flex-col gap-xxs flex-1 min-w-0">
        <span className="text-sm font-semibold text-fg-primary">
          {summaryParts.join(" · ")}
        </span>
        <span className="text-xs text-fg-tertiary">See the dog roster</span>
      </div>
      <CaretRight size={14} weight="bold" className="text-fg-tertiary flex-shrink-0" />
    </Link>
  );
}

/* ── Dogs tab ──────────────────────────────────────────────────────── */

type DogsSortKey = "needs-walks" | "recent-arrivals" | "long-stayers" | "all";

function DogsTab({ shelter }: { shelter: ShelterProfile }) {
  const [sortKey, setSortKey] = useState<DogsSortKey>("needs-walks");

  const sorted = useMemo<PetProfile[]>(() => {
    switch (sortKey) {
      case "needs-walks":
        return getDogsNeedingWalks(shelter);
      case "recent-arrivals":
        return [...shelter.dogs].sort(
          (a, b) => (a.daysInKennel ?? 0) - (b.daysInKennel ?? 0),
        );
      case "long-stayers":
        return [...shelter.dogs]
          .filter((d) => (d.daysInKennel ?? 0) >= 30)
          .sort((a, b) => (b.daysInKennel ?? 0) - (a.daysInKennel ?? 0));
      case "all":
        return [...shelter.dogs].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [shelter, sortKey]);

  return (
    <div className="shelter-dogs">
      <div className="shelter-dogs-filter">
        <FilterPillRow
          pills={[
            { key: "needs-walks", label: "Needs walks now" },
            { key: "recent-arrivals", label: "Recently arrived" },
            { key: "long-stayers", label: "Long-stayers" },
            { key: "all", label: "All" },
          ]}
          activeKey={sortKey}
          onChange={(k) => setSortKey(k as DogsSortKey)}
        />
      </div>

      {sorted.length === 0 ? (
        <div className="px-lg py-xl">
          <EmptyState
            icon={<PawPrint size={32} weight="light" />}
            title="No dogs in this view"
            subtitle="Switch the filter to see more."
          />
        </div>
      ) : (
        <div className="shelter-dogs-list">
          {sorted.map((dog) => (
            <ShelterDogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Members tab ───────────────────────────────────────────────────── */

type MembersFilterKey = "all" | "walkers" | "supporters" | "team";

function MembersTab({ shelter }: { shelter: ShelterProfile }) {
  const teamCount = shelter.team?.length ?? 0;

  const filters = useMemo(() => {
    const base: { key: MembersFilterKey; label: string }[] = [
      { key: "all", label: "All" },
      { key: "walkers", label: `Walkers · ${shelter.walkers.length}` },
      { key: "supporters", label: `Supporters · ${shelter.supporters.length}` },
    ];
    if (teamCount > 0) {
      base.push({ key: "team", label: `Team · ${teamCount}` });
    }
    return base;
  }, [shelter, teamCount]);

  const [filter, setFilter] = useState<MembersFilterKey>("all");

  // Build sortable, typed entries that flow through ShelterMemberRow.
  type WalkerEntry = { kind: "walker"; data: ShelterWalker; sortAt: string };
  type SupporterEntry = { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  type Entry = WalkerEntry | SupporterEntry;

  const entries = useMemo<Entry[]>(() => {
    const walkerEntries: Entry[] = shelter.walkers.map((w) => ({
      kind: "walker",
      data: w,
      // Sort by most-recent walk for active walkers; fall back to vouchedAt.
      sortAt: w.lastWalkedAt ?? w.vouchedAt,
    }));
    const supporterEntries: Entry[] = shelter.supporters.map((s) => ({
      kind: "supporter",
      data: s,
      sortAt: s.since,
    }));

    let list: Entry[];
    if (filter === "walkers") list = walkerEntries;
    else if (filter === "supporters") list = supporterEntries;
    else if (filter === "team") list = []; // No staff seeded — UI is forward-compat.
    else list = [...walkerEntries, ...supporterEntries];

    // Sort by recency (newest sortAt first) — anti-scoreboard discipline.
    return list.sort((a, b) => b.sortAt.localeCompare(a.sortAt));
  }, [shelter, filter]);

  return (
    <div className="shelter-members">
      <div className="shelter-members-filter">
        <FilterPillRow
          pills={filters}
          activeKey={filter}
          onChange={(k) => setFilter(k as MembersFilterKey)}
        />
      </div>

      {entries.length === 0 ? (
        <div className="px-lg py-xl">
          <EmptyState
            icon={<Heart size={32} weight="light" />}
            title={
              filter === "team"
                ? "No team members linked yet"
                : "No members in this view"
            }
            subtitle={
              filter === "team"
                ? "Útulek Liběň operates as a shared-account team. Individual staff can opt to link their profiles."
                : "Switch the filter to see walkers or supporters."
            }
          />
        </div>
      ) : (
        <div className="shelter-members-list">
          {entries.map((entry) => (
            <ShelterMemberRow
              key={`${entry.kind}-${entry.data.userId}`}
              entry={entry}
              shelterName={shelter.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Gallery tab (stub) ────────────────────────────────────────────── */

function GalleryTab() {
  return (
    <div className="px-lg py-xl">
      <EmptyState
        icon={<Images size={32} weight="light" />}
        title="Gallery coming soon"
        subtitle="Photos from walks and shelter posts will live here. Lands with the Photos & Galleries phase."
      />
    </div>
  );
}

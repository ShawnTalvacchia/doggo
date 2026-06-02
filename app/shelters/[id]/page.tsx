"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Dog,
  Users,
  Images,
  Heart,
  Clock,
  ShieldCheck,
  PawPrint,
  CaretRight,
  CaretDown,
  Check,
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
import { ModalSheet } from "@/components/overlays/ModalSheet";
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

  // Mobile detail header. Back goes to home (no /shelters list view yet).
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
          {/* Tabs are sticky at the top of the scrollable body. Mirrors the
              community-detail pattern: tabs always accessible, hero scrolls
              away inside the Feed tab, no banner-jump between tabs. */}
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

/* ── Feed tab ──────────────────────────────────────────────────────── */

function FeedTab({ shelter }: { shelter: ShelterProfile }) {
  const posts = getShelterFeed(shelter);
  const [isFollowing, setIsFollowing] = useState(false);
  const [walkerInterestSent, setWalkerInterestSent] = useState(false);
  const [walkSheetOpen, setWalkSheetOpen] = useState(false);
  const [followMenuOpen, setFollowMenuOpen] = useState(false);
  const [walkerMenuOpen, setWalkerMenuOpen] = useState(false);

  return (
    <div className="shelter-feed">
      <ShelterBanner shelter={shelter} />
      <ShelterIntro shelter={shelter} />
      <ShelterActionRow
        isFollowing={isFollowing}
        walkerInterestSent={walkerInterestSent}
        followMenuOpen={followMenuOpen}
        walkerMenuOpen={walkerMenuOpen}
        onToggleFollow={() => {
          if (isFollowing) setFollowMenuOpen((v) => !v);
          else setIsFollowing(true);
        }}
        onUnfollow={() => {
          setIsFollowing(false);
          setFollowMenuOpen(false);
        }}
        onToggleWalker={() => {
          if (walkerInterestSent) setWalkerMenuOpen((v) => !v);
          else setWalkSheetOpen(true);
        }}
        onWithdrawInterest={() => {
          setWalkerInterestSent(false);
          setWalkerMenuOpen(false);
        }}
      />
      <DogsInCareSummaryCard shelter={shelter} />

      {posts.length === 0 ? (
        <div className="px-lg py-xl">
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

      <WalkInterestSheet
        open={walkSheetOpen}
        shelter={shelter}
        onClose={() => setWalkSheetOpen(false)}
        onConfirm={() => {
          setWalkerInterestSent(true);
          setWalkSheetOpen(false);
        }}
      />
    </div>
  );
}

/* ── Hero pieces ───────────────────────────────────────────────────── */

function ShelterBanner({ shelter }: { shelter: ShelterProfile }) {
  return (
    <div
      className="shelter-detail-banner"
      style={{ backgroundImage: shelter.bannerUrl ? `url(${shelter.bannerUrl})` : undefined }}
    />
  );
}

function ShelterIntro({ shelter }: { shelter: ShelterProfile }) {
  const teamCount = shelter.team?.length ?? 0;
  const runBy = teamCount > 0
    ? `Run by ${teamCount} ${teamCount === 1 ? "team member" : "team members"}`
    : `Run by the ${shelter.name} team`;
  const policyNote = shelter.policy.groupWalksPermitted === false
    ? "Solo walks only. Even our calmest dogs do best one-on-one."
    : null;

  return (
    <div className="shelter-intro">
      <h1 className="shelter-intro-name">{shelter.name}</h1>
      <div className="shelter-intro-location">
        <MapPin size={14} weight="light" />
        <span>{shelter.location}</span>
      </div>

      <p className="shelter-intro-bio">{shelter.bio}</p>

      <div className="shelter-intro-meta">
        <div className="shelter-intro-meta-row">
          <Users size={14} weight="light" />
          <span>{runBy}</span>
        </div>
        {shelter.establishedYear && (
          <div className="shelter-intro-meta-row">
            <Clock size={14} weight="light" />
            <span>Caring for dogs since {shelter.establishedYear}</span>
          </div>
        )}
        {policyNote && (
          <div className="shelter-intro-meta-row">
            <ShieldCheck size={14} weight="light" />
            <span>{policyNote}</span>
          </div>
        )}
      </div>

      {(shelter.website || shelter.socialLinks) && (
        <div className="shelter-intro-socials" aria-label="Shelter links">
          {shelter.website && (
            <a
              href={`https://${shelter.website}`}
              target="_blank"
              rel="noreferrer"
              className="shelter-intro-social"
              aria-label={`Website: ${shelter.website}`}
              title={shelter.website}
            >
              <Globe size={16} weight="light" />
            </a>
          )}
          {shelter.socialLinks?.facebook && (
            <span
              className="shelter-intro-social"
              aria-label={`Facebook: ${shelter.socialLinks.facebook}`}
              title={shelter.socialLinks.facebook}
            >
              <FacebookLogo size={16} weight="light" />
            </span>
          )}
          {shelter.socialLinks?.instagram && (
            <span
              className="shelter-intro-social"
              aria-label={`Instagram: ${shelter.socialLinks.instagram}`}
              title={shelter.socialLinks.instagram}
            >
              <InstagramLogo size={16} weight="light" />
            </span>
          )}
          {shelter.socialLinks?.email && (
            <a
              href={`mailto:${shelter.socialLinks.email}`}
              className="shelter-intro-social"
              aria-label={`Email: ${shelter.socialLinks.email}`}
              title={shelter.socialLinks.email}
            >
              <Envelope size={16} weight="light" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Action row (Follow + Walk a dog) ──────────────────────────────── */

interface ShelterActionRowProps {
  isFollowing: boolean;
  walkerInterestSent: boolean;
  followMenuOpen: boolean;
  walkerMenuOpen: boolean;
  onToggleFollow: () => void;
  onUnfollow: () => void;
  onToggleWalker: () => void;
  onWithdrawInterest: () => void;
}

function ShelterActionRow({
  isFollowing,
  walkerInterestSent,
  followMenuOpen,
  walkerMenuOpen,
  onToggleFollow,
  onUnfollow,
  onToggleWalker,
  onWithdrawInterest,
}: ShelterActionRowProps) {
  return (
    <div className="shelter-action-row">
      <div className="shelter-action-button-wrap">
        <ButtonAction
          variant={isFollowing ? "brand-subtle" : "neutral"}
          size="md"
          cta
          leftIcon={isFollowing ? <Check size={16} weight="bold" /> : undefined}
          rightIcon={isFollowing ? <CaretDown size={12} weight="bold" /> : undefined}
          onClick={onToggleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </ButtonAction>
        {followMenuOpen && isFollowing && (
          <div className="shelter-action-menu" role="menu">
            <button type="button" className="shelter-action-menu-item" onClick={onUnfollow}>
              Unfollow
            </button>
          </div>
        )}
      </div>

      <div className="shelter-action-button-wrap">
        <ButtonAction
          variant={walkerInterestSent ? "brand-subtle" : "primary"}
          size="md"
          cta
          leftIcon={walkerInterestSent ? <Check size={16} weight="bold" /> : undefined}
          rightIcon={walkerInterestSent ? <CaretDown size={12} weight="bold" /> : undefined}
          onClick={onToggleWalker}
        >
          {walkerInterestSent ? "Interest sent" : "Walk a dog"}
        </ButtonAction>
        {walkerMenuOpen && walkerInterestSent && (
          <div className="shelter-action-menu" role="menu">
            <button type="button" className="shelter-action-menu-item" onClick={onWithdrawInterest}>
              Withdraw interest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WalkInterestSheet({
  open,
  shelter,
  onClose,
  onConfirm,
}: {
  open: boolean;
  shelter: ShelterProfile;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Walk a dog"
      compact
      footer={
        <div className="flex gap-sm justify-end px-md py-md">
          <ButtonAction variant="neutral" size="md" onClick={onClose}>
            Not yet
          </ButtonAction>
          <ButtonAction variant="primary" size="md" cta onClick={onConfirm}>
            Express interest
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md p-md">
        <p className="text-sm text-fg-secondary m-0">
          {shelter.name} pairs new walkers with the right dog through a short
          intro visit at the shelter.
        </p>
        {shelter.policy.vouchingNote && (
          <p className="text-sm text-fg-primary m-0">
            <em>{shelter.policy.vouchingNote}</em>
          </p>
        )}
        <p className="text-xs text-fg-tertiary m-0">
          We&rsquo;ll be in touch via the email on your profile to schedule
          your visit. The full walker journey (booking walks, visit reports,
          tier progression) arrives in a later phase.
        </p>
      </div>
    </ModalSheet>
  );
}

/* ── Dogs-in-care summary card ─────────────────────────────────────── */

function DogsInCareSummaryCard({ shelter }: { shelter: ShelterProfile }) {
  const dogCount = shelter.dogs.length;
  const needWalks = countDogsNeedingWalks(shelter);
  const longStayers = countLongStayers(shelter);

  const subParts: string[] = [];
  if (needWalks > 0) subParts.push(`${needWalks} need walks now`);
  if (longStayers > 0) subParts.push(`${longStayers} long-stayer${longStayers === 1 ? "" : "s"}`);

  return (
    <Link
      href={`/shelters/${shelter.id}?tab=dogs`}
      className="shelter-summary-card"
      style={{ textDecoration: "none" }}
    >
      <div className="shelter-summary-card-icon">
        <Dog size={24} weight="light" />
      </div>
      <div className="flex flex-col gap-xxs flex-1 min-w-0">
        <span className="shelter-summary-card-headline">
          {dogCount} {dogCount === 1 ? "dog" : "dogs"} in care
        </span>
        {subParts.length > 0 && (
          <span className="shelter-summary-card-sub">{subParts.join(" · ")}</span>
        )}
        <span className="shelter-summary-card-action">See the roster</span>
      </div>
      <CaretRight size={16} weight="bold" className="text-fg-tertiary flex-shrink-0" />
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

  // Sortable, typed entries that flow through ShelterMemberRow.
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
    else if (filter === "team") list = []; // No staff seeded; UI is forward-compat.
    else list = [...walkerEntries, ...supporterEntries];

    // Sort by recency (newest sortAt first). Anti-scoreboard discipline.
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

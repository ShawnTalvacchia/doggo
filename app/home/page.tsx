"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Camera } from "@phosphor-icons/react";
import { getFeedForUser, getNewUserFeed } from "@/lib/mockFeed";
import { DEMO_NEW_USER } from "@/lib/mockUserState";
import { HomeWelcome } from "@/components/home/HomeWelcome";
import { DogsNearYou } from "@/components/home/DogsNearYou";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { FeedMeetRecap } from "@/components/feed/FeedMeetRecap";
import { FeedUpcomingMeet } from "@/components/feed/FeedUpcomingMeet";
import { FeedConnectionActivity } from "@/components/feed/FeedConnectionActivity";
import { FeedConnectionNudge } from "@/components/feed/FeedConnectionNudge";
import { FeedCarePrompt } from "@/components/feed/FeedCarePrompt";
import { FeedMilestone } from "@/components/feed/FeedMilestone";
import { FeedDogMoment } from "@/components/feed/FeedDogMoment";
import { FeedCareReview } from "@/components/feed/FeedCareReview";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { CardGroup } from "@/components/groups/CardGroup";
import { getUserGroups } from "@/lib/mockGroups";
import type { FeedItem, GroupType } from "@/lib/types";

// ── Feed rendering ──────────────────────────────────────────────────────────

function FeedItemRenderer({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "personal_post":
    case "community_post":
      return <MomentCardFromPost post={item.post} />;
    case "meet_recap":
      return <FeedMeetRecap meet={item.meet} />;
    case "upcoming_meet":
      return <FeedUpcomingMeet meet={item.meet} />;
    case "connection_activity":
      return <FeedConnectionActivity item={item} />;
    case "connection_nudge":
      return <FeedConnectionNudge item={item} />;
    case "offer_care_prompt":
    case "find_care_prompt":
      return <FeedCarePrompt item={item} />;
    case "milestone":
      return <FeedMilestone item={item} />;
    case "dog_moment":
      return <FeedDogMoment item={item} />;
    case "care_review":
      return <FeedCareReview item={item} />;
    default:
      return null;
  }
}

// ── Group category filter pills ─────────────────────────────────────────────

type CategoryFilter = "all" | "parks" | "neighbors" | "interest" | "care";

const CATEGORY_PILLS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "parks", label: "Parks" },
  { key: "neighbors", label: "Neighbors" },
  { key: "interest", label: "Interest" },
  { key: "care", label: "Care" },
];

const FILTER_TO_GROUP_TYPE: Record<CategoryFilter, GroupType | null> = {
  all: null,
  parks: "park",
  neighbors: "neighbor",
  interest: "interest",
  care: "care",
};

// ── Main tabs (inside panel) ────────────────────────────────────────────────

type MainTab = "groups" | "feed";

const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: "feed", label: "Feed" },
  { key: "groups", label: "Groups" },
];

// ── Main page ───────────────────────────────────────────────────────────────

function HomePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Main tab: groups or feed
  const mainTab = (searchParams.get("view") as MainTab) || "feed";
  const handleMainTabChange = (key: string) => {
    const tab = key as MainTab;
    if (tab === "feed") {
      router.replace("/home", { scroll: false });
    } else {
      router.replace(`/home?view=${tab}`, { scroll: false });
    }
  };

  // Category filter (only relevant in groups view)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const userGroups = getUserGroups("shawn");
  const allFeedItems = getFeedForUser("shawn");

  // Filter groups by category
  const groupType = FILTER_TO_GROUP_TYPE[categoryFilter];
  const filteredGroups = useMemo(() => {
    if (!groupType) return userGroups;
    return userGroups.filter((g) => g.groupType === groupType);
  }, [userGroups, groupType]);

  // Filter feed items when category is active
  const feedItems = useMemo(() => {
    if (!groupType) return allFeedItems;
    const groupIdsOfType = new Set(
      userGroups.filter((g) => g.groupType === groupType).map((g) => g.id)
    );
    return allFeedItems.filter((item) => {
      if (item.type === "community_post" || item.type === "personal_post") {
        const post = (item as any).post;
        if (post?.groupId) return groupIdsOfType.has(post.groupId);
        return false;
      }
      if (item.type === "upcoming_meet" || item.type === "meet_recap") {
        const meet = (item as any).meet;
        if (meet?.groupId) return groupIdsOfType.has(meet.groupId);
        return false;
      }
      return false;
    });
  }, [allFeedItems, groupType, userGroups]);

  // Header action button changes per tab
  const headerAction = mainTab === "groups" ? (
    <ButtonAction
      variant="outline"
      size="sm"
      cta
      leftIcon={<Plus size={14} weight="bold" />}
      href="/communities/create"
    >
      Create Community
    </ButtonAction>
  ) : (
    <ButtonAction
      variant="outline"
      size="sm"
      cta
      leftIcon={<Camera size={14} weight="light" />}
      href="/posts/create"
    >
      Post
    </ButtonAction>
  );

  return (
    <div className="community-page-shell">
      {/* ── Page header ───────────────────────────────────── */}
      <div className="community-page-header">
        <h1 className="community-page-title">Community</h1>
        <div className="community-page-header-action">
          {headerAction}
        </div>
      </div>

      {/* ── Panel ─────────────────────────────────────────── */}
      <div className="community-panel">
        {/* Main tab bar */}
        <div className="community-panel-tabs">
          <TabBar tabs={MAIN_TABS} activeKey={mainTab} onChange={handleMainTabChange} />
        </div>

        {/* Groups view */}
        {mainTab === "groups" && (
          <>
            {/* Category filter pills */}
            <div className="community-filter-pills">
              {CATEGORY_PILLS.map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  className={`pill${categoryFilter === pill.key ? " active" : ""}`}
                  onClick={() => setCategoryFilter(pill.key)}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Group cards */}
            <div className="community-panel-body">
              {filteredGroups.length > 0 ? (
                <div className="community-group-list">
                  {filteredGroups.map((group) => (
                    <CardGroup key={group.id} group={group} variant="my-groups" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-md p-xl text-center">
                  <p className="text-fg-tertiary text-md">
                    {categoryFilter === "all"
                      ? "You haven\u2019t joined any groups yet."
                      : `No ${categoryFilter} groups yet.`}
                  </p>
                  <Link
                    href="/discover/groups"
                    className="text-brand-main font-semibold text-md"
                    style={{ textDecoration: "none" }}
                  >
                    Explore groups →
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Feed view */}
        {mainTab === "feed" && (
          <div className="community-panel-body">
            {DEMO_NEW_USER ? (
              <>
                <HomeWelcome />
                <DogsNearYou />
                {getNewUserFeed().map((item) => (
                  <FeedItemRenderer key={item.feedId} item={item} />
                ))}
              </>
            ) : (
              <>
                {feedItems.map((item) => (
                  <FeedItemRenderer key={item.feedId} item={item} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}

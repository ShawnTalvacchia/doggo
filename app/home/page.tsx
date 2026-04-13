"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { CameraPlusFill } from "@/components/icons/CameraPlusFill";
import { usePostComposer } from "@/contexts/PostComposerContext";
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
import { FeedShareNudge } from "@/components/feed/FeedShareNudge";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PageColumn } from "@/components/layout/PageColumn";
import { CardGroup } from "@/components/groups/CardGroup";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
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
    case "share_nudge":
      return <FeedShareNudge item={item} />;
    default:
      return null;
  }
}

// ── Group category filter pills ─────────────────────────────────────────────

const CATEGORY_PILLS: { key: GroupType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "park", label: "Parks" },
  { key: "neighbor", label: "Neighbors" },
  { key: "interest", label: "Interest" },
  { key: "care", label: "Care" },
];

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
  const { openComposer } = usePostComposer();

  // Main tab: groups or feed
  const mainTab = (searchParams.get("view") as MainTab) || "feed";
  const handleMainTabChange = (key: string) => {
    const tab = key as MainTab;
    // Reset scroll position when switching tabs
    const scrollBody = document.querySelector(".page-column-panel-body");
    if (scrollBody) scrollBody.scrollTop = 0;

    if (tab === "feed") {
      router.replace("/home", { scroll: false });
    } else {
      router.replace(`/home?view=${tab}`, { scroll: false });
    }
  };

  // Category filter — single select
  const [activeCategory, setActiveCategory] = useState<GroupType | "all">("all");

  const userGroups = getUserGroups("shawn");
  const allFeedItems = getFeedForUser("shawn");

  // Filter groups by selected category
  const filteredGroups = useMemo(() => {
    if (activeCategory === "all") return userGroups;
    return userGroups.filter((g) => g.groupType === activeCategory);
  }, [userGroups, activeCategory]);

  // Filter feed items by selected category
  const feedItems = useMemo(() => {
    if (activeCategory === "all") return allFeedItems;
    const groupIdsOfType = new Set(
      userGroups.filter((g) => g.groupType === activeCategory).map((g) => g.id)
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
  }, [allFeedItems, activeCategory, userGroups]);

  // Header action button changes per tab
  const headerAction = mainTab === "groups" ? (
    <ButtonAction
      variant="primary"
      size="sm"
      cta
      leftIcon={<Plus size={14} weight="bold" />}
      href="/communities/create"
    >
      Create
    </ButtonAction>
  ) : (
    <ButtonAction
      variant="primary"
      size="sm"
      cta
      leftIcon={<CameraPlusFill size={14} />}
      onClick={() => openComposer()}
    >
      Post
    </ButtonAction>
  );

  return (
    <PageColumn title="Community" headerAction={headerAction}>
      {/* Single scroll body — tabs sticky inside for glassmorphism */}
      <div className="page-column-panel-body">
        {/* Sticky glass tab bar */}
        <div className="page-column-panel-tabs">
          <TabBar tabs={MAIN_TABS} activeKey={mainTab} onChange={handleMainTabChange} />
        </div>

          {/* Groups view */}
          {mainTab === "groups" && (
            <>
              {/* Category filter pills */}
              <FilterPillRow
                pills={CATEGORY_PILLS}
                activeKey={activeCategory}
                onChange={(key) => setActiveCategory(key as GroupType | "all")}
              />

              {/* Group cards */}
              {filteredGroups.length > 0 ? (
                <div className="community-group-list">
                  {filteredGroups.map((group) => (
                    <CardGroup key={group.id} group={group} variant="my-groups" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-md p-xl text-center">
                  <p className="text-fg-tertiary text-md">
                    {activeCategory === "all"
                      ? "You haven\u2019t joined any groups yet."
                      : "No groups match your filters."}
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
            </>
          )}

          {/* Feed view */}
          {mainTab === "feed" && (
            <>
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
            </>
          )}
      </div>
    </PageColumn>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}

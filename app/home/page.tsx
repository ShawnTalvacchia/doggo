"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mockUser } from "@/lib/mockUser";
import { getFeedForUser, getNewUserFeed } from "@/lib/mockFeed";
import { DEMO_NEW_USER } from "@/lib/mockUserState";
import { HomeWelcome } from "@/components/home/HomeWelcome";
import { DogsNearYou } from "@/components/home/DogsNearYou";
import { FeedCTA } from "@/components/feed/FeedCTA";
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
import { MasterDetailShell, type MobileView } from "@/components/layout/MasterDetailShell";
import { ListPanel } from "@/components/layout/ListPanel";
import { DetailPanel } from "@/components/layout/DetailPanel";
import { GroupCard } from "@/components/groups/GroupCard";
import { UpcomingPanel } from "@/components/home/UpcomingPanel";
import { getUserGroups } from "@/lib/mockGroups";
import { getUpcomingMeets } from "@/lib/mockMeets";
import type { FeedItem } from "@/lib/types";

// ── Feed rendering ──────────────────────────────────────────────────────────

function FeedItemRenderer({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "personal_post":
      return <MomentCardFromPost post={item.post} />;
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

// ── Groups list panel — simple flat list matching Figma ──────────────────────

function GroupsListContent() {
  const userGroups = getUserGroups("shawn");

  return (
    <div className="flex flex-col">
      {userGroups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}

// ── Feed content ────────────────────────────────────────────────────────────

function FeedContent() {
  const feedItems = getFeedForUser("shawn");

  if (DEMO_NEW_USER) {
    return (
      <>
        <HomeWelcome />
        <DogsNearYou />
        <div className="feed-list">
          {getNewUserFeed().map((item) => (
            <FeedItemRenderer key={item.feedId} item={item} />
          ))}
        </div>
      </>
    );
  }

  const dogPhotos = mockUser.pets.map((p) => p.imageUrl);

  return (
    <div className="feed-list">
      <FeedCTA dogPhotos={dogPhotos} />
      {feedItems.map((item) => (
        <FeedItemRenderer key={item.feedId} item={item} />
      ))}
    </div>
  );
}

// ── Mobile tabs (Feed | Groups) ─────────────────────────────────────────────

const TABS = [
  { key: "groups", label: "Groups" },
  { key: "feed", label: "Feed" },
];

// ── Main page ───────────────────────────────────────────────────────────────

function HomePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "feed";

  const handleTabChange = (key: string) => {
    if (key === "feed") {
      router.replace("/home", { scroll: false });
    } else {
      router.replace(`/home?tab=${key}`, { scroll: false });
    }
  };

  // Mobile view: map tab to panel
  const mobileView: MobileView = activeTab === "groups" ? "list" : "detail";

  // Groups panel header — matches Figma heading/3 style
  const groupsHeader = (
    <h2 className="font-heading text-lg font-bold text-fg-primary" style={{ fontSize: "var(--text-xl)", lineHeight: 1.2 }}>
      My Groups
    </h2>
  );

  const upcomingMeets = getUpcomingMeets();

  return (
    <div className="page-container home-page-shell">
      {/* Tab bar — mobile only */}
      <div className="home-tab-bar">
        <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
      </div>

      <MasterDetailShell
        mobileView={mobileView}
        listPanel={
          <ListPanel header={groupsHeader}>
            <GroupsListContent />
          </ListPanel>
        }
        detailPanel={
          <DetailPanel>
            <FeedContent />
          </DetailPanel>
        }
        infoPanel={<UpcomingPanel meets={upcomingMeets} />}
      />
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

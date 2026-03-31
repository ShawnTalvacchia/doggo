"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mockMeets } from "@/lib/mockMeets";
import { mockUser } from "@/lib/mockUser";
import { getFeedForUser, getNewUserFeed } from "@/lib/mockFeed";
import { DEMO_NEW_USER } from "@/lib/mockUserState";
import { HomeWelcome } from "@/components/home/HomeWelcome";
import { DogsNearYou } from "@/components/home/DogsNearYou";
import { CompactGreeting } from "@/components/feed/CompactGreeting";
import { UpcomingStrip } from "@/components/feed/UpcomingStrip";
import { UpcomingPanel } from "@/components/home/UpcomingPanel";
import { FeedPersonalPost } from "@/components/feed/FeedPersonalPost";
import { FeedCommunityPost } from "@/components/feed/FeedCommunityPost";
import { FeedMeetRecap } from "@/components/feed/FeedMeetRecap";
import { FeedUpcomingMeet } from "@/components/feed/FeedUpcomingMeet";
import { FeedConnectionActivity } from "@/components/feed/FeedConnectionActivity";
import { FeedConnectionNudge } from "@/components/feed/FeedConnectionNudge";
import { FeedCarePrompt } from "@/components/feed/FeedCarePrompt";
import { FeedMilestone } from "@/components/feed/FeedMilestone";
import { FeedDogMoment } from "@/components/feed/FeedDogMoment";
import { FeedCareReview } from "@/components/feed/FeedCareReview";
import { TabBar } from "@/components/ui/TabBar";
import type { FeedItem } from "@/lib/types";

// ── Groups tab (inline — reuses communities page content) ───────────────────
import { useState } from "react";
import { UsersThree, Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { GroupCard } from "@/components/groups/GroupCard";
import { getUserGroups, getAllPublicGroups } from "@/lib/mockGroups";

type GroupFilter = "all" | "yours" | "open" | "approval" | "private";

function GroupsTab() {
  const [filter, setFilter] = useState<GroupFilter>("all");

  const userGroups = getUserGroups("shawn");
  const publicGroups = getAllPublicGroups();

  const userGroupIds = new Set(userGroups.map((g) => g.id));
  const discoverGroups = publicGroups.filter((g) => !userGroupIds.has(g.id));

  const filters: { key: GroupFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "yours", label: "Your Groups" },
    { key: "open", label: "Open" },
    { key: "approval", label: "Approval" },
    { key: "private", label: "Private" },
  ];

  const showYours = filter === "all" || filter === "yours";
  const showDiscover =
    filter === "all" || filter === "open" || filter === "approval";
  const showPrivate = filter === "private";

  return (
    <div className="flex flex-col gap-xl p-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-fg-primary flex items-center gap-sm">
          <UsersThree size={22} weight="light" className="text-brand-main" />
          Groups
        </h2>
        <ButtonAction
          variant="primary"
          size="sm"
          href="/communities/create"
          leftIcon={<Plus size={16} weight="bold" />}
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

      {/* Your groups */}
      {showYours && userGroups.length > 0 && (
        <section className="flex flex-col gap-md">
          <h3 className="font-heading text-base font-semibold text-fg-primary">
            Your groups
          </h3>
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
          <h3 className="font-heading text-base font-semibold text-fg-primary">
            Discover
          </h3>
          <div className="flex flex-col gap-md">
            {discoverGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {/* Private groups */}
      {showPrivate && (
        <section className="flex flex-col gap-md">
          <h3 className="font-heading text-base font-semibold text-fg-primary">
            Private groups
          </h3>
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
                You&apos;re not in any private groups yet.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ── Feed rendering ──────────────────────────────────────────────────────────

function FeedItemRenderer({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "personal_post":
      return <FeedPersonalPost post={item.post} />;
    case "community_post":
      return <FeedCommunityPost post={item.post} />;
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

// ── Feed tab ────────────────────────────────────────────────────────────────

function FeedTab() {
  const feedItems = getFeedForUser("shawn");

  const myUpcoming = mockMeets
    .filter((m) => m.status === "upcoming" && m.attendees.some((a) => a.userId === "shawn"))
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 5);

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

  return (
    <>
      {/* Header: greeting + Add Post / Find Care */}
      <div className="home-header">
        <CompactGreeting user={mockUser} />
      </div>

      {/* Upcoming strip — shown on mobile/tablet when side panel is hidden */}
      <div className="home-upcoming-inline">
        <UpcomingStrip meets={myUpcoming} />
      </div>

      {/* Social feed */}
      <div className="feed-list">
        {feedItems.map((item) => (
          <FeedItemRenderer key={item.feedId} item={item} />
        ))}
      </div>
    </>
  );
}

// ── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "feed", label: "Feed" },
  { key: "groups", label: "Groups" },
];

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

  // Meets for upcoming panel (desktop sidebar)
  const myUpcoming = mockMeets
    .filter((m) => m.status === "upcoming" && m.attendees.some((a) => a.userId === "shawn"))
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 5);

  return (
    <>
      <div className="page-container activity-page">
        {/* Tab header — sticky */}
        <div className="activity-tab-header">
          <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
        </div>

        {/* Tab content */}
        <div className="activity-body">
          <div className="body-container-main">
            {activeTab === "feed" && <FeedTab />}
            {activeTab === "groups" && <GroupsTab />}
          </div>
        </div>
      </div>

      {/* Side panel: Your Upcoming (desktop only, Feed tab only) */}
      {!DEMO_NEW_USER && activeTab === "feed" && <UpcomingPanel meets={myUpcoming} />}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}

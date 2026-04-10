import type {
  FeedItem,
  FeedPostItem,
  FeedMeetRecapItem,
  FeedUpcomingMeetItem,
  FeedShareNudgeItem,
} from "./types";
import { mockPosts } from "./mockPosts";
import { mockMeets } from "./mockMeets";
import { mockConnections } from "./mockConnections";
import { mockGroups, getUserGroups } from "./mockGroups";

/**
 * Feed content sourcing per Content Visibility Model (two-gate system):
 *
 * 1. Context gate — moments from groups the user has joined
 * 2. Relationship gate — moments from connected/familiar users (profile-origin content)
 * 3. Discovery — moments from open groups in user's neighbourhood
 * 4. Social proof — moments from open groups that user's connections are in
 *
 * Primary content: photo moments (MomentCard). Contextual: upcoming meets within 24h.
 * Removed from feed: connection activity, nudges, milestones, care prompts, dog moments, care reviews.
 */
export function getFeedForUser(userId: string): FeedItem[] {
  const items: FeedItem[] = [];
  const addedPostIds = new Set<string>();

  // ── Gate 1: Context gate — posts from joined groups ──────────────────────
  const userGroups = getUserGroups(userId);
  const userGroupIds = new Set(userGroups.map((g) => g.id));

  for (const post of mockPosts) {
    if (post.groupId && userGroupIds.has(post.groupId)) {
      if (!addedPostIds.has(post.id)) {
        addedPostIds.add(post.id);
        items.push({
          feedId: `feed-post-${post.id}`,
          type: "community_post",
          timestamp: post.createdAt,
          post,
        } as FeedPostItem);
      }
    }
  }

  // ── Gate 2: Relationship gate — personal posts from connections ──────────
  const connectionUserIds = new Set(
    mockConnections
      .filter((c) => c.state === "connected" || c.state === "familiar")
      .map((c) => c.userId)
  );

  for (const post of mockPosts) {
    if (!post.groupId && connectionUserIds.has(post.authorId)) {
      if (!addedPostIds.has(post.id)) {
        addedPostIds.add(post.id);
        items.push({
          feedId: `feed-post-${post.id}`,
          type: "personal_post",
          timestamp: post.createdAt,
          post,
        } as FeedPostItem);
      }
    }
  }

  // ── Gate 3: Discovery — posts from open groups in user's neighbourhood ──
  const userNeighbourhood = "Vinohrady"; // mock: derive from user profile
  const openNeighbourhoodGroups = mockGroups.filter(
    (g) =>
      g.visibility === "open" &&
      g.neighbourhood === userNeighbourhood &&
      !userGroupIds.has(g.id)
  );
  const openNeighbourhoodGroupIds = new Set(openNeighbourhoodGroups.map((g) => g.id));

  for (const post of mockPosts) {
    if (post.groupId && openNeighbourhoodGroupIds.has(post.groupId)) {
      if (!addedPostIds.has(post.id)) {
        addedPostIds.add(post.id);
        items.push({
          feedId: `feed-post-${post.id}`,
          type: "community_post",
          timestamp: post.createdAt,
          post,
        } as FeedPostItem);
      }
    }
  }

  // ── Gate 4: Social proof — posts from open groups connections are in ─────
  const connectionGroupIds = new Set<string>();
  for (const group of mockGroups) {
    if (group.visibility === "open" && !userGroupIds.has(group.id)) {
      const hasConnection = group.members.some((m) => connectionUserIds.has(m.userId));
      if (hasConnection) connectionGroupIds.add(group.id);
    }
  }

  for (const post of mockPosts) {
    if (post.groupId && connectionGroupIds.has(post.groupId)) {
      if (!addedPostIds.has(post.id)) {
        addedPostIds.add(post.id);
        items.push({
          feedId: `feed-post-${post.id}`,
          type: "community_post",
          timestamp: post.createdAt,
          post,
        } as FeedPostItem);
      }
    }
  }

  // ── Own posts always visible ─────────────────────────────────────────────
  for (const post of mockPosts) {
    if (post.authorId === userId && !addedPostIds.has(post.id)) {
      addedPostIds.add(post.id);
      items.push({
        feedId: `feed-post-${post.id}`,
        type: post.groupId ? "community_post" : "personal_post",
        timestamp: post.createdAt,
        post,
      } as FeedPostItem);
    }
  }

  // ── Meet recaps (completed meets user attended, with photos) ─────────────
  const completedMeets = mockMeets.filter(
    (m) =>
      m.status === "completed" &&
      m.photos &&
      m.photos.length > 0 &&
      m.attendees.some((a) => a.userId === userId)
  );
  for (const meet of completedMeets) {
    items.push({
      feedId: `feed-recap-${meet.id}`,
      type: "meet_recap",
      timestamp: meet.createdAt,
      meet,
    } as FeedMeetRecapItem);
  }

  // ── Share nudges: completed meets user attended, no photos yet ───────────
  const completedNoPhotos = mockMeets.filter(
    (m) =>
      m.status === "completed" &&
      (!m.photos || m.photos.length === 0) &&
      m.attendees.some((a) => a.userId === userId)
  );
  // Show the most recent one as a nudge (use recent timestamp so it surfaces high)
  if (completedNoPhotos.length > 0) {
    const nudgeMeet = completedNoPhotos[0];
    items.push({
      feedId: `feed-share-nudge-${nudgeMeet.id}`,
      type: "share_nudge",
      timestamp: "2026-03-22T08:00:00Z",
      meet: nudgeMeet,
    } as FeedShareNudgeItem);
  }

  // ── Contextual: upcoming meets within 48h that user is attending ─────────
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const soonMeets = mockMeets
    .filter((m) => {
      if (m.status !== "upcoming") return false;
      if (!m.attendees.some((a) => a.userId === userId)) return false;
      const meetDate = new Date(`${m.date}T${m.time}`);
      return meetDate <= in48h && meetDate >= now;
    })
    .slice(0, 1);

  for (const meet of soonMeets) {
    items.push({
      feedId: `feed-upcoming-${meet.id}`,
      type: "upcoming_meet",
      timestamp: meet.date,
      meet,
    } as FeedUpcomingMeetItem);
  }

  // Sort by timestamp descending
  items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return items;
}

/** Feed for new users — open community content, public meets, milestones */
export function getNewUserFeed(): FeedItem[] {
  const items: FeedItem[] = [];

  // Posts from open communities
  const openGroupIds = new Set(mockGroups.filter((g) => g.visibility === "open").map((g) => g.id));
  const openPosts = mockPosts.filter((p) => p.groupId && openGroupIds.has(p.groupId));
  for (const post of openPosts) {
    items.push({
      feedId: `feed-new-post-${post.id}`,
      type: "community_post",
      timestamp: post.createdAt,
      post,
    });
  }

  // Upcoming public meets
  const upcomingMeets = mockMeets
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 3);
  for (const meet of upcomingMeets) {
    items.push({
      feedId: `feed-new-upcoming-${meet.id}`,
      type: "upcoming_meet",
      timestamp: meet.date,
      meet,
    });
  }

  // Completed meet recaps
  const recaps = mockMeets.filter((m) => m.status === "completed" && m.photos && m.photos.length > 0);
  for (const meet of recaps) {
    items.push({
      feedId: `feed-new-recap-${meet.id}`,
      type: "meet_recap",
      timestamp: meet.createdAt,
      meet,
    });
  }

  // Milestones
  items.push({
    feedId: "feed-new-milestone-1",
    type: "milestone",
    timestamp: "2026-03-20T06:00:00Z",
    text: "50 dogs walked in Vinohrady this month",
    subtext: "Your neighbourhood is getting active!",
  });

  items.push({
    feedId: "feed-new-milestone-2",
    type: "milestone",
    timestamp: "2026-03-18T06:00:00Z",
    text: "12 communities active in Prague this week",
    subtext: "Find one near you!",
  });

  items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return items;
}

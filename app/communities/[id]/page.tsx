"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { LayoutList } from "@/components/layout/LayoutList";
import {
  MapPin,
  UsersThree,
  Lock,
  Globe,
  ShieldCheck,
  Camera,
  CameraSlash,
  Prohibit,
  ChatCircleDots,
  PaperPlaneRight,
  Handshake,
  Plus,
  PawPrint,
  Storefront,
  Star,
  MapPinLine,
  Images,
  CalendarBlank,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardMeet } from "@/components/meets/CardMeet";
import { MeetCardCompact } from "@/components/meets/MeetCardCompact";
import { MeetPhotoGallery } from "@/components/meets/MeetPhotoGallery";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { SystemMessage } from "@/components/chat/SystemMessage";
import { getGroupById, getGroupMeets } from "@/lib/mockGroups";
import { getMessagesForGroup } from "@/lib/mockGroupMessages";
import { getPostsByGroup } from "@/lib/mockPosts";
import { getConnectionState } from "@/lib/mockConnections";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { PawReaction } from "@/components/posts/PawReaction";
import { CommentThread } from "@/components/feed/CommentThread";

/* ── Tab config per group type ─────────────────────────────────── */

import type { GroupType } from "@/lib/types";

function getTabsForGroupType(groupType: GroupType) {
  switch (groupType) {
    case "park":
      return [
        { key: "feed", label: "Feed" },
        { key: "meets", label: "Meets" },
        { key: "members", label: "Members" },
      ];
    case "care":
      return [
        { key: "feed", label: "Feed" },
        { key: "events", label: "Events" },
        { key: "services", label: "Services" },
        { key: "members", label: "Members" },
        { key: "gallery", label: "Gallery" },
      ];
    default: // neighbor, interest
      return [
        { key: "feed", label: "Feed" },
        { key: "meets", label: "Meets" },
        { key: "members", label: "Members" },
      ];
  }
}

/** Care category display labels */
const CARE_CATEGORY_LABELS: Record<string, string> = {
  training: "Dog Trainer",
  walking: "Dog Walker",
  grooming: "Grooming Salon",
  boarding: "Boarding & Daycare",
  rehab: "Canine Rehabilitation",
  venue: "Dog-Friendly Venue",
  vet: "Vet Clinic",
  other: "Care Provider",
};

/* ── Page (with Suspense boundary for useSearchParams) ─────────── */

export default function GroupDetailPage() {
  return (
    <Suspense>
      <GroupDetailInner />
    </Suspense>
  );
}

function GroupDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "feed";

  const group = getGroupById(params.id as string);
  const [joinRequested, setJoinRequested] = useState(false);

  if (!group) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Community not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/communities")}>
          Back to Communities
        </ButtonAction>
      </div>
    );
  }

  const groupMeets = getGroupMeets(group.id);
  const groupPosts = getPostsByGroup(group.id);
  const messages = getMessagesForGroup(group.id);
  const isMember = group.members.some((m) => m.userId === "shawn");
  const isAdmin = group.members.some((m) => m.userId === "shawn" && m.role === "admin");
  const totalDogs = group.members.reduce((sum, m) => sum + m.dogNames.length, 0);
  const isCare = group.groupType === "care";
  const tabs = getTabsForGroupType(group.groupType);

  const handleTabChange = (key: string) => {
    if (key === "feed") {
      router.replace(`/communities/${group.id}`, { scroll: false });
    } else {
      router.replace(`/communities/${group.id}?tab=${key}`, { scroll: false });
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}
    >
      {/* ── Persistent header (above tabs) ──────────────────────── */}

      <DetailHeader backHref="/home?tab=groups" backLabel="Groups" />

      {/* Cover photo */}
      <div
        className="w-full h-[200px] bg-cover bg-center"
        style={{ backgroundImage: `url(${group.coverPhotoUrl})` }}
      />

      <div className="flex flex-col gap-md px-xl pt-lg pb-md">
        {/* Group name + badges */}
        <div className="flex items-center gap-sm flex-wrap">
          <h1 className="font-heading text-2xl font-semibold text-fg-primary m-0">
            {group.name}
          </h1>
          {group.visibility !== "open" && (
            <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-gray text-fg-secondary">
              {group.visibility === "private" ? (
                <><Lock size={10} weight="fill" /> Private</>
              ) : (
                <><ShieldCheck size={10} weight="fill" /> Approval required</>
              )}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-fg-secondary m-0">{group.description}</p>

        {/* Hosted by — care groups only */}
        {isCare && group.hostedByName && (
          <div className="flex items-center gap-md rounded-panel bg-surface-top p-md shadow-xs">
            <img
              src={group.hostedByAvatarUrl || group.members.find(m => m.userId === group.hostedBy)?.avatarUrl || ""}
              alt={group.hostedByName}
              className="rounded-full shrink-0 w-10 h-10 object-cover"
            />
            <div className="flex flex-col gap-xs flex-1">
              <div className="flex items-center gap-xs">
                <Storefront size={14} weight="fill" className="text-brand-main" />
                <span className="text-xs font-medium text-fg-tertiary">Hosted by</span>
              </div>
              <span className="text-sm font-semibold text-fg-primary">{group.hostedByName}</span>
              {group.careCategory && (
                <span className="text-xs text-fg-secondary">
                  {CARE_CATEGORY_LABELS[group.careCategory] || group.careCategory}
                </span>
              )}
            </div>
            <ButtonAction variant="outline" size="sm" href={`/profile/${group.hostedBy}`}>
              View profile
            </ButtonAction>
          </div>
        )}

        {/* Fixed location — care groups with address */}
        {isCare && group.locationFixed && (
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <MapPinLine size={14} weight="light" />
            {group.locationFixed}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-lg text-sm text-fg-tertiary flex-wrap">
          <span className="flex items-center gap-xs">
            <MapPin size={14} weight="light" />
            {group.neighbourhood}
          </span>
          <span className="flex items-center gap-xs">
            <UsersThree size={14} weight="light" />
            {group.members.length} members · {totalDogs} dogs
          </span>
          <span className="flex items-center gap-xs">
            {group.photoPolicy === "encouraged" ? (
              <><Camera size={14} weight="light" /> Photos encouraged</>
            ) : group.photoPolicy === "none" ? (
              <><Prohibit size={14} weight="light" /> No photos</>
            ) : (
              <><CameraSlash size={14} weight="light" /> Photos optional</>
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-sm flex-wrap">
          {isMember ? (
            <ButtonAction variant={isAdmin ? "secondary" : "outline"} size="md" disabled={isAdmin}>
              {isAdmin ? "You're an admin" : "Leave community"}
            </ButtonAction>
          ) : group.visibility === "approval" ? (
            <ButtonAction
              variant={joinRequested ? "secondary" : "primary"}
              size="md"
              disabled={joinRequested}
              onClick={() => setJoinRequested(true)}
            >
              {joinRequested ? "Request sent" : "Request to join"}
            </ButtonAction>
          ) : (
            <ButtonAction variant="primary" size="md">
              Join community
            </ButtonAction>
          )}
          <ButtonAction
            variant="outline"
            size="md"
            leftIcon={<UsersThree size={16} weight="light" />}
          >
            Invite
          </ButtonAction>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────── */}

      <div
        className="flex items-center px-xl"
        style={{ borderBottom: "1px solid var(--border-light)" }}
      >
        <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
      </div>

      {/* ── Tab content ─────────────────────────────────────────── */}

      <PanelBody>
        {activeTab === "feed" && (
          <FeedTab
            groupPosts={groupPosts}
            group={group}
            isMember={isMember}
          />
        )}

        {(activeTab === "meets" || activeTab === "events") && (
          <MeetsTab groupMeets={groupMeets} isCare={isCare} />
        )}

        {activeTab === "services" && isCare && (
          <ServicesTab group={group} />
        )}

        {activeTab === "members" && (
          <MembersTab group={group} />
        )}

        {activeTab === "gallery" && isCare && (
          <GalleryTab group={group} />
        )}

        {activeTab === "chat" && (
          <ChatTab
            group={group}
            messages={messages}
            groupMeets={groupMeets}
            isMember={isMember}
            joinRequested={joinRequested}
            onJoinRequest={() => setJoinRequested(true)}
          />
        )}

        <Spacer />
      </PanelBody>
    </div>
  );
}

/* ── Feed tab ──────────────────────────────────────────────────── */

import type { Group, Meet } from "@/lib/types";
import type { GroupMessage } from "@/lib/types";

interface FeedTabProps {
  groupPosts: ReturnType<typeof getPostsByGroup>;
  group: Group;
  isMember: boolean;
}

function FeedTab({ groupPosts, group, isMember }: FeedTabProps) {
  return (
    <LayoutSection>
      <div className="flex flex-col gap-lg">
        {/* Post CTA */}
        {isMember && group.photoPolicy !== "none" && (
          <div className="flex justify-end">
            <ButtonAction
              variant="tertiary"
              size="sm"
              href="/posts/create"
              leftIcon={<Camera size={14} weight="light" />}
            >
              New post
            </ButtonAction>
          </div>
        )}

        {/* Posts */}
        {group.photoPolicy !== "none" && groupPosts.length > 0 ? (
          <div className="flex flex-col gap-md">
            {groupPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-sm rounded-panel bg-surface-top p-md shadow-xs"
              >
                <div className="flex items-center gap-sm">
                  <img
                    src={post.authorAvatarUrl}
                    alt={post.authorName}
                    className="rounded-full shrink-0 w-7 h-7 object-cover"
                  />
                  <span className="text-sm font-medium text-fg-primary">{post.authorName}</span>
                  <span className="text-xs text-fg-tertiary">
                    {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <PostPhotoGrid photos={post.photos} />
                {post.caption && (
                  <p className="text-sm text-fg-primary m-0">{post.caption}</p>
                )}
                <TagPillRow tags={post.tags} />
                <PawReaction reactions={post.reactions} />
                <CommentThread comments={post.comments} canComment={isMember} />
              </div>
            ))}
          </div>
        ) : group.photoPolicy === "none" ? null : (
          <div className="flex flex-col items-center gap-md rounded-panel p-lg text-center bg-surface-inset">
            <p className="text-sm text-fg-secondary m-0">
              No posts yet. {isMember ? "Share a moment with the community!" : "Join to see and create posts."}
            </p>
          </div>
        )}

        {/* Gallery */}
        {group.photos.length > 0 && (
          <div className="flex flex-col gap-sm">
            <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
              Community photos
            </h3>
            <MeetPhotoGallery photos={group.photos} />
          </div>
        )}
      </div>
    </LayoutSection>
  );
}

/* ── Meets / Events tab ───────────────────────────────────────── */

function MeetsTab({ groupMeets, isCare }: { groupMeets: Meet[]; isCare: boolean }) {
  const noun = isCare ? "events" : "meets";
  const nounSingular = isCare ? "event" : "meet";

  return (
    <div className="flex flex-col">
      <LayoutSection>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
            Upcoming {noun}
          </h3>
          <ButtonAction
            variant="tertiary"
            size="sm"
            href="/meets/create"
            leftIcon={<Plus size={14} weight="bold" />}
          >
            Create {nounSingular}
          </ButtonAction>
        </div>
      </LayoutSection>

      {groupMeets.length > 0 ? (
        <LayoutList>
          {groupMeets.map((meet) => (
            <CardMeet key={meet.id} meet={meet} variant="group" />
          ))}
        </LayoutList>
      ) : (
        <LayoutSection>
          <EmptyState
            icon={<CalendarBlank size={48} weight="light" />}
            title={`No upcoming ${noun}`}
            subtitle={`Create one for the community!`}
            action={
              <ButtonAction variant="primary" size="sm" href="/meets/create">
                Create {nounSingular}
              </ButtonAction>
            }
          />
        </LayoutSection>
      )}
    </div>
  );
}

/* ── Members tab ───────────────────────────────────────────────── */

function MembersTab({ group }: { group: Group }) {
  return (
    <LayoutSection>
      <div className="flex flex-col gap-md">
        <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
          Members ({group.members.length})
        </h3>
        <div className="flex flex-col gap-sm">
          {group.members.map((member) => {
            const conn = getConnectionState(member.userId);
            const isYou = member.userId === "shawn";

            return (
              <div
                key={member.userId}
                className="flex items-center gap-md rounded-panel bg-surface-top p-md shadow-xs"
              >
                <img
                  src={member.avatarUrl}
                  alt={member.userName}
                  className="rounded-full shrink-0 w-10 h-10 object-cover"
                />
                <div className="flex flex-col flex-1 gap-xs">
                  <div className="flex items-center gap-xs">
                    <span className="text-sm font-medium text-fg-primary">
                      {member.userName}
                      {isYou && " (you)"}
                    </span>
                    {member.role === "admin" && (
                      <span className="rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-fg-tertiary flex items-center gap-xs">
                    <PawPrint size={10} weight="light" />
                    {member.dogNames.join(", ")}
                  </span>
                </div>
                {!isYou && conn && conn.state !== "none" && (
                  <span
                    className={`flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium ${
                      conn.state === "connected"
                        ? "bg-brand-subtle text-brand-strong"
                        : "bg-surface-gray text-fg-secondary"
                    }`}
                  >
                    {conn.state === "connected" && <Handshake size={12} weight="fill" />}
                    {conn.state === "connected" ? "Connected" : conn.state === "familiar" ? "Familiar" : "Pending"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LayoutSection>
  );
}

/* ── Services tab (care groups) ───────────────────────────────── */

function ServicesTab({ group }: { group: Group }) {
  const listings = group.serviceListings || [];

  if (listings.length === 0) {
    return (
      <LayoutSection>
        <EmptyState
          icon={<Storefront size={48} weight="light" />}
          title="No services listed yet"
          subtitle="This provider hasn't added their service menu."
        />
      </LayoutSection>
    );
  }

  return (
    <LayoutSection>
      <div className="flex flex-col gap-md">
        <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
          Services
        </h3>
        {listings.filter(s => s.active).map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-sm rounded-panel bg-surface-top p-md shadow-xs"
          >
            <div className="flex items-start justify-between gap-md">
              <div className="flex flex-col gap-xs flex-1">
                <span className="text-sm font-semibold text-fg-primary">{service.title}</span>
                <span className="text-xs text-fg-secondary">{service.description}</span>
              </div>
              <div className="flex flex-col items-end gap-xs shrink-0">
                <span className="text-sm font-semibold text-fg-primary">
                  {service.priceFrom} Kč
                </span>
                <span className="text-xs text-fg-tertiary">{service.priceUnit}</span>
              </div>
            </div>
            {service.bookingHref && (
              <ButtonAction variant="primary" size="sm" href={service.bookingHref}>
                Book
              </ButtonAction>
            )}
          </div>
        ))}
      </div>
    </LayoutSection>
  );
}

/* ── Gallery tab (care groups) ───────────────────────────────── */

function GalleryTab({ group }: { group: Group }) {
  const photos = group.photos || [];
  const mode = group.galleryMode || "standard";

  if (photos.length === 0) {
    return (
      <LayoutSection>
        <EmptyState
          icon={<Images size={48} weight="light" />}
          title="No photos yet"
          subtitle="Photos from events and updates will appear here."
        />
      </LayoutSection>
    );
  }

  return (
    <LayoutSection>
      <div className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
            {mode === "portfolio" ? "Portfolio" : mode === "updates" ? "Updates" : "Gallery"}
          </h3>
          <span className="text-xs text-fg-tertiary">{photos.length} photos</span>
        </div>

        {mode === "portfolio" ? (
          /* Portfolio mode: 2-column before/after style grid */
          <div className="grid grid-cols-2 gap-sm">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-panel overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                {i % 2 === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-pill bg-black/60 text-white text-xs px-sm py-xs">
                    Before
                  </span>
                )}
                {i % 2 === 1 && (
                  <span className="absolute bottom-1 left-1 rounded-pill bg-brand-main text-white text-xs px-sm py-xs">
                    After
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : mode === "updates" ? (
          /* Updates mode: date-grouped chronological feed */
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-sm">
              <span className="text-xs font-medium text-fg-tertiary">Today</span>
              <div className="grid grid-cols-3 gap-xs">
                {photos.slice(0, Math.min(3, photos.length)).map((photo, i) => (
                  <div key={i} className="aspect-square rounded-sm overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            {photos.length > 3 && (
              <div className="flex flex-col gap-sm">
                <span className="text-xs font-medium text-fg-tertiary">Earlier this week</span>
                <div className="grid grid-cols-3 gap-xs">
                  {photos.slice(3).map((photo, i) => (
                    <div key={i} className="aspect-square rounded-sm overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Standard mode: simple grid */
          <div className="grid grid-cols-3 gap-xs">
            {photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-sm overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutSection>
  );
}

/* ── Chat tab ──────────────────────────────────────────────────── */

interface ChatTabProps {
  group: Group;
  messages: GroupMessage[];
  groupMeets: Meet[];
  isMember: boolean;
  joinRequested: boolean;
  onJoinRequest: () => void;
}

function ChatTab({ group, messages, groupMeets, isMember, joinRequested, onJoinRequest }: ChatTabProps) {
  if (!isMember) {
    return (
      <LayoutSection>
        <EmptyState
          icon={<ChatCircleDots size={48} weight="light" />}
          title="Join this community to access the chat"
          subtitle="Members can chat, share photos, and coordinate meets."
          action={
            group.visibility === "approval" ? (
              <ButtonAction
                variant="primary"
                size="sm"
                disabled={joinRequested}
                onClick={onJoinRequest}
              >
                {joinRequested ? "Request sent" : "Request to join"}
              </ButtonAction>
            ) : (
              <ButtonAction variant="primary" size="sm">
                Join community
              </ButtonAction>
            )
          }
        />
      </LayoutSection>
    );
  }

  const upcomingGroupMeets = groupMeets.filter((m) => m.status === "upcoming").slice(0, 5);

  return (
    <div className="flex flex-col gap-md">
      {/* Event card strip */}
      {upcomingGroupMeets.length > 0 && (
        <div className="flex gap-sm overflow-x-auto pb-sm px-lg pt-md">
          {upcomingGroupMeets.map((meet) => (
            <MeetCardCompact key={meet.id} meet={meet} />
          ))}
        </div>
      )}

      {/* Messages */}
      <LayoutSection>
        <div className="flex flex-col gap-md">
          {messages.map((msg) =>
            msg.type === "system" ? (
              <SystemMessage
                key={msg.id}
                text={msg.text}
                activityType={msg.activityType}
              />
            ) : (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === "shawn"}
              />
            )
          )}
        </div>
      </LayoutSection>

      {/* Compose */}
      <div className="flex gap-sm px-lg pb-md">
        <input
          type="text"
          placeholder="Say something..."
          className="flex-1 rounded-form px-md py-sm text-sm border border-edge-regular bg-surface-top"
        />
        <ButtonAction variant="primary" size="sm">
          <PaperPlaneRight size={16} weight="fill" />
        </ButtonAction>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
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
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { MeetCard } from "@/components/meets/MeetCard";
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

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  const group = getGroupById(params.id as string);

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
  const [joinRequested, setJoinRequested] = useState(false);

  return (
    <div
      className="flex flex-col gap-xl"
      style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}
    >
      {/* Back */}
      <div className="px-xl pt-xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-xs text-sm text-fg-secondary bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft size={16} weight="light" /> Back
        </button>
      </div>

      {/* Cover photo */}
      <div
        className="w-full h-[200px] bg-cover bg-center"
        style={{ backgroundImage: `url(${group.coverPhotoUrl})` }}
      />

      <div className="flex flex-col gap-xl px-xl pb-xl">
        {/* Header */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-sm flex-wrap">
            <h1 className="font-heading text-2xl font-semibold text-fg-primary m-0">
              {group.name}
            </h1>
            {group.visibility !== "open" && (
              <span
                className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-gray text-fg-secondary"
              >
                {group.visibility === "private" ? (
                  <><Lock size={10} weight="fill" /> Private</>
                ) : (
                  <><ShieldCheck size={10} weight="fill" /> Approval required</>
                )}
              </span>
            )}
          </div>
          <p className="text-sm text-fg-secondary m-0">{group.description}</p>
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
          <ButtonAction
            variant={showChat ? "secondary" : "outline"}
            size="md"
            onClick={() => setShowChat(!showChat)}
            leftIcon={<ChatCircleDots size={16} weight="light" />}
          >
            Chat{messages.length > 0 ? ` (${messages.length})` : ""}
          </ButtonAction>
        </div>

        {/* Chat section */}
        {showChat && (
          <section
            className="flex flex-col gap-md rounded-panel p-md bg-surface-base border border-edge-light"
          >
            <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
              Community chat
            </h3>

            {!isMember ? (
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
                      onClick={() => setJoinRequested(true)}
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
            ) : (
              <>
                {/* Event card strip — upcoming meets for this community */}
                {(() => {
                  const upcomingGroupMeets = groupMeets.filter((m) => m.status === "upcoming").slice(0, 5);
                  return upcomingGroupMeets.length > 0 ? (
                    <div className="flex gap-sm overflow-x-auto pb-sm -mx-sm px-sm">
                      {upcomingGroupMeets.map((meet) => (
                        <MeetCardCompact key={meet.id} meet={meet} />
                      ))}
                    </div>
                  ) : null;
                })()}

                {/* Messages */}
                <div
                  className="flex flex-col gap-md overflow-y-auto py-2 px-0"
                  style={{ maxHeight: 400 }}
                >
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

                {/* Compose */}
                <div className="flex gap-sm">
                  <input
                    type="text"
                    placeholder="Say something..."
                    className="flex-1 rounded-form px-md py-sm text-sm border border-edge-regular bg-surface-top"
                  />
                  <ButtonAction variant="primary" size="sm">
                    <PaperPlaneRight size={16} weight="fill" />
                  </ButtonAction>
                </div>
              </>
            )}
          </section>
        )}

        {/* Members */}
        <section className="flex flex-col gap-md">
          <h2 className="font-heading text-lg font-semibold text-fg-primary">
            Members ({group.members.length})
          </h2>
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
                        <span
                          className="rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong"
                        >
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
        </section>

        {/* Posts */}
        {group.photoPolicy !== "none" && (
          <section className="flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-fg-primary">
                Posts
              </h2>
              {isMember && (
                <ButtonAction
                  variant="tertiary"
                  size="sm"
                  href="/posts/create"
                  leftIcon={<Camera size={14} weight="light" />}
                >
                  New post
                </ButtonAction>
              )}
            </div>
            {groupPosts.length > 0 ? (
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
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center gap-md rounded-panel p-lg text-center bg-surface-inset"
              >
                <p className="text-sm text-fg-secondary">
                  No posts yet. {isMember ? "Share a moment with the community!" : "Join to see and create posts."}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Upcoming meets */}
        <section className="flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-fg-primary">
              Upcoming meets
            </h2>
            <ButtonAction
              variant="tertiary"
              size="sm"
              href="/meets/create"
              leftIcon={<Plus size={14} weight="bold" />}
            >
              Create meet
            </ButtonAction>
          </div>
          {groupMeets.length > 0 ? (
            <div className="flex flex-col gap-md">
              {groupMeets.map((meet) => (
                <MeetCard key={meet.id} meet={meet} />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-md rounded-panel p-lg text-center bg-surface-inset"
            >
              <p className="text-sm text-fg-secondary">
                No upcoming meets. Create one for the community!
              </p>
            </div>
          )}
        </section>

        {/* Gallery */}
        {group.photos.length > 0 && (
          <section className="flex flex-col gap-md">
            <h2 className="font-heading text-lg font-semibold text-fg-primary">
              Community photos
            </h2>
            <MeetPhotoGallery photos={group.photos} />
          </section>
        )}
      </div>
    </div>
  );
}

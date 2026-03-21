"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CalendarDots,
  Clock,
  Users,
  PawPrint,
  PersonSimpleWalk,
  Tree,
  Target,
  ArrowsClockwise,
  ChatCircleDots,
  PaperPlaneRight,
  Handshake,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { mockMeets, MEET_TYPE_LABELS, LEASH_LABELS } from "@/lib/mockMeets";
import { getMessagesForMeet } from "@/lib/mockMeetMessages";
import { getConnectionState, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";
import type { MeetType, MeetMessage } from "@/lib/types";

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={24} weight="light" />,
  park_hangout: <Tree size={24} weight="light" />,
  playdate: <PawPrint size={24} weight="light" />,
  training: <Target size={24} weight="light" />,
};

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function formatMessageTime(sentAt: string): string {
  const d = new Date(sentAt);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ message, isOwn }: { message: MeetMessage; isOwn: boolean }) {
  return (
    <div className={`flex gap-sm ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <img
          src={message.senderAvatarUrl}
          alt={message.senderName}
          className="rounded-full shrink-0"
          style={{ width: 28, height: 28, objectFit: "cover" }}
        />
      )}
      <div
        className="flex flex-col gap-xs rounded-lg px-md py-sm"
        style={{
          maxWidth: "75%",
          background: isOwn ? "var(--brand-subtle)" : "var(--surface-top)",
          border: isOwn ? "none" : "1px solid var(--border-light)",
        }}
      >
        {!isOwn && (
          <span className="text-xs font-medium text-fg-primary">{message.senderName}</span>
        )}
        <span className="text-sm text-fg-primary">{message.text}</span>
        <span className="text-xs text-fg-tertiary" style={{ alignSelf: isOwn ? "flex-start" : "flex-end" }}>
          {formatMessageTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}

export default function MeetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meet = mockMeets.find((m) => m.id === params.id);
  const [showThread, setShowThread] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  if (!meet) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Meet not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/meets")}>
          Back to Meets
        </ButtonAction>
      </div>
    );
  }

  const totalDogs = meet.attendees.reduce((sum, a) => sum + a.dogNames.length, 0);
  const spotsLeft = meet.maxAttendees - meet.attendees.length;
  const isJoined = meet.attendees.some((a) => a.userId === "shawn");
  const isCreator = meet.creatorId === "shawn";
  const messages = getMessagesForMeet(meet.id);

  return (
    <div
      className="flex flex-col gap-xl p-xl"
      style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-xs text-sm text-fg-secondary"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <ArrowLeft size={16} weight="light" />
        Back
      </button>

      {/* Header */}
      <header className="flex flex-col gap-sm">
        <div className="flex items-center gap-sm">
          <span
            className="flex items-center gap-xs rounded-pill px-sm py-xs text-sm font-medium"
            style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)" }}
          >
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          {meet.recurring && (
            <span className="flex items-center gap-xs text-xs text-fg-tertiary">
              <ArrowsClockwise size={14} weight="light" />
              Weekly
            </span>
          )}
          {meet.status === "completed" && (
            <span
              className="rounded-pill px-sm py-xs text-xs font-medium"
              style={{ background: "var(--surface-gray)", color: "var(--text-secondary)" }}
            >
              Completed
            </span>
          )}
        </div>
        <h1 className="font-heading text-4xl font-semibold text-fg-primary">{meet.title}</h1>
        <p className="text-base text-fg-secondary">{meet.description}</p>
      </header>

      {/* Details grid */}
      <div
        className="grid gap-md rounded-panel bg-surface-top p-lg shadow-sm"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        <div className="flex items-start gap-sm">
          <CalendarDots size={20} weight="light" className="text-fg-tertiary shrink-0 mt-xs" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{formatDate(meet.date)}</span>
            <span className="text-sm text-fg-secondary">{meet.time}</span>
          </div>
        </div>
        <div className="flex items-start gap-sm">
          <Clock size={20} weight="light" className="text-fg-tertiary shrink-0 mt-xs" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{formatDuration(meet.durationMinutes)}</span>
            <span className="text-sm text-fg-secondary">Duration</span>
          </div>
        </div>
        <div className="flex items-start gap-sm">
          <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0 mt-xs" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{meet.location}</span>
            <span className="text-sm text-fg-secondary">{LEASH_LABELS[meet.leashRule]}</span>
          </div>
        </div>
        <div className="flex items-start gap-sm">
          <Users size={20} weight="light" className="text-fg-tertiary shrink-0 mt-xs" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">
              {meet.attendees.length}/{meet.maxAttendees} people · {totalDogs} dogs
            </span>
            <span className="text-sm text-fg-secondary">
              {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-sm flex-wrap">
        {meet.status === "upcoming" && (
          <>
            {isJoined ? (
              <ButtonAction variant={isCreator ? "secondary" : "outline"} size="md" disabled={isCreator}>
                {isCreator ? "You're hosting" : "Leave meet"}
              </ButtonAction>
            ) : (
              <ButtonAction variant="primary" size="md" disabled={spotsLeft === 0}>
                {spotsLeft > 0 ? "Join this meet" : "Meet is full"}
              </ButtonAction>
            )}
          </>
        )}
        {meet.status === "completed" && isJoined && (
          <ButtonAction
            variant="primary"
            size="md"
            href={`/meets/${meet.id}/connect`}
            leftIcon={<Handshake size={18} weight="light" />}
          >
            Connect with attendees
          </ButtonAction>
        )}
        {messages.length > 0 && (
          <ButtonAction
            variant={showThread ? "secondary" : "outline"}
            size="md"
            onClick={() => setShowThread(!showThread)}
            leftIcon={<ChatCircleDots size={18} weight="light" />}
          >
            Group chat ({messages.length})
          </ButtonAction>
        )}
      </div>

      {/* Group thread */}
      {showThread && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-heading text-lg font-semibold text-fg-primary">Group Chat</h2>
          <div
            className="flex flex-col gap-md rounded-panel p-md"
            style={{
              background: "var(--surface-base)",
              border: "1px solid var(--border-light)",
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === "shawn"}
              />
            ))}
          </div>
          {/* Compose */}
          <div className="flex gap-sm">
            <input
              className="input flex-1"
              placeholder="Message the group..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <ButtonAction
              variant="primary"
              size="md"
              disabled={!newMessage.trim()}
              leftIcon={<PaperPlaneRight size={16} weight="light" />}
              onClick={() => setNewMessage("")}
            >
              Send
            </ButtonAction>
          </div>
        </section>
      )}

      {/* Organiser */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Organiser</h2>
        <div className="flex items-center gap-md">
          <img
            src={meet.creatorAvatarUrl}
            alt={meet.creatorName}
            className="rounded-full"
            style={{ width: 40, height: 40, objectFit: "cover" }}
          />
          <span className="text-base font-medium text-fg-primary">{meet.creatorName}</span>
        </div>
      </section>

      {/* Attendees */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">
          {meet.status === "completed" ? "Who attended" : "Who\u2019s coming"} ({meet.attendees.length})
        </h2>
        <div className="flex flex-col gap-sm">
          {meet.attendees.map((a) => {
            const conn = a.userId !== "shawn" ? getConnectionState(a.userId) : undefined;
            return (
              <div key={a.userId} className="flex items-center gap-md rounded-panel bg-surface-top p-sm">
                <img
                  src={a.avatarUrl}
                  alt={a.userName}
                  className="rounded-full"
                  style={{ width: 36, height: 36, objectFit: "cover" }}
                />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-fg-primary">
                    {a.userName}
                    {a.userId === "shawn" && <span className="text-fg-tertiary"> (you)</span>}
                  </span>
                  <span className="text-xs text-fg-tertiary">
                    {a.dogNames.join(", ")}
                  </span>
                </div>
                {conn && conn.state !== "none" && (
                  <span
                    className="text-xs font-medium rounded-pill px-sm py-xs"
                    style={{
                      background:
                        conn.state === "connected"
                          ? "var(--brand-subtle)"
                          : "var(--surface-gray)",
                      color:
                        conn.state === "connected"
                          ? "var(--brand-strong)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {CONNECTION_STATE_LABELS[conn.state]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

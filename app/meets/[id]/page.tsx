"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import {
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
  ShareNetwork,
  UsersThree,
  Lightning,
  Path,
  Mountains,
  Ruler,
  FlagBanner,
  Park,
  Dog,
  GraduationCap,
  Chalkboard,
  Backpack,
  ShieldCheck,
  Heartbeat,
  Star,
  Check,
  SignOut,
  Camera,
} from "@phosphor-icons/react";
import Link from "next/link";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShareMeetModal } from "@/components/meets/ShareMeetModal";
import { ParticipantList } from "@/components/meets/ParticipantList";
import { PostMeetReveal } from "@/components/meets/PostMeetReveal";
import { MeetPhotoGallery } from "@/components/meets/MeetPhotoGallery";
import { getConnectionState as getConnState } from "@/lib/mockConnections";
import { getGroupById } from "@/lib/mockGroups";
import {
  mockMeets,
  MEET_TYPE_LABELS,
  LEASH_LABELS,
  ENERGY_LABELS,
  PACE_LABELS,
  DISTANCE_LABELS,
  TERRAIN_LABELS,
  AMENITY_LABELS,
  VIBE_LABELS,
  AGE_RANGE_LABELS,
  PLAY_STYLE_LABELS,
  SKILL_LABELS,
  EXPERIENCE_LABELS,
  TRAINER_TYPE_LABELS,
} from "@/lib/mockMeets";
import { getMessagesForMeet } from "@/lib/mockMeetMessages";
import { getConnectionState, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";
import { formatMeetDate } from "@/lib/dateUtils";
import type { Meet, MeetType, MeetMessage } from "@/lib/types";

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={24} weight="light" />,
  park_hangout: <Tree size={24} weight="light" />,
  playdate: <PawPrint size={24} weight="light" />,
  training: <Target size={24} weight="light" />,
};

const MEET_TABS = [
  { key: "details", label: "Details" },
  { key: "people", label: "People" },
  { key: "chat", label: "Chat" },
];

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
          className="w-7 h-7 rounded-full shrink-0 object-cover"
        />
      )}
      <div
        className={`flex flex-col gap-xs rounded-lg px-md py-sm ${isOwn ? "bg-brand-subtle" : "bg-surface-top border border-edge-light"}`}
        style={{ maxWidth: "75%" }}
      >
        {!isOwn && (
          <span className="text-xs font-medium text-fg-primary">{message.senderName}</span>
        )}
        <span className="text-sm text-fg-primary">{message.text}</span>
        <span className={`text-xs text-fg-tertiary ${isOwn ? "self-start" : "self-end"}`}>
          {formatMessageTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}

/* ── Page (with Suspense boundary for useSearchParams) ─────────── */

export default function MeetDetailPage() {
  return (
    <Suspense>
      <MeetDetailInner />
    </Suspense>
  );
}

function MeetDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "details";
  const { setDetailHeader, clearDetailHeader } = usePageHeader();

  const meet = mockMeets.find((m) => m.id === params.id);
  const [showShare, setShowShare] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"none" | "going" | "interested">("none");

  if (!meet) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Meet not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/activity")}>
          Back to Activity
        </ButtonAction>
      </div>
    );
  }

  // Derive RSVP from mock data on first render
  const myAttendee = meet.attendees.find((a) => a.userId === "shawn");
  const isCreator = meet.creatorId === "shawn";

  useEffect(() => {
    if (isCreator) {
      setRsvpStatus("going");
    } else if (myAttendee) {
      setRsvpStatus(myAttendee.rsvpStatus === "interested" ? "interested" : "going");
    }
  }, [meet.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isJoined = rsvpStatus === "going" || isCreator;
  const goingAttendees = meet.attendees.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interestedCount = meet.attendees.filter((a) => a.rsvpStatus === "interested").length;
  const totalDogs = meet.attendees.reduce((sum, a) => sum + a.dogNames.length, 0);
  const spotsLeft = meet.maxAttendees - goingAttendees.length;
  const messages = getMessagesForMeet(meet.id);

  // Right action changes per tab
  const headerAction = (() => {
    switch (activeTab) {
      case "details":
        return (
          <ButtonAction
            variant="outline"
            size="sm"
            cta
            leftIcon={<ShareNetwork size={14} weight="bold" />}
            onClick={() => setShowShare(true)}
          >
            Share
          </ButtonAction>
        );
      default:
        return undefined;
    }
  })();

  // Feed detail header into AppNav on mobile
  useEffect(() => {
    setDetailHeader(meet.title, () => router.push("/home"), headerAction);
    return () => clearDetailHeader();
  }, [meet.title, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (key: string) => {
    if (key === "details") {
      router.replace(`/meets/${meet.id}`, { scroll: false });
    } else {
      router.replace(`/meets/${meet.id}?tab=${key}`, { scroll: false });
    }
  };

  return (
    <div className="meet-detail-page">
      {/* ── Header (above panel on desktop, becomes mobile top bar) ── */}
      <DetailHeader backLabel="Back" title={meet.title} rightAction={headerAction} />

      {/* ── Panel (rounded card container) ── */}
      <div className="meet-detail-panel">

        {/* ── Scrollable tab content (tabs sticky inside for glassmorphism) ── */}
        <div className="meet-detail-body">
          <div className="meet-detail-tabs">
            <TabBar tabs={MEET_TABS} activeKey={activeTab} onChange={handleTabChange} />
          </div>
          {activeTab === "details" && (
            <DetailsTab
              meet={meet}
              goingAttendees={goingAttendees}
              interestedCount={interestedCount}
              totalDogs={totalDogs}
              spotsLeft={spotsLeft}
              isCreator={isCreator}
              rsvpStatus={rsvpStatus}
              onRsvpChange={setRsvpStatus}
              onShare={() => setShowShare(true)}
            />
          )}

          {activeTab === "people" && (
            <PeopleTab meet={meet} isJoined={isJoined} />
          )}

          {activeTab === "chat" && (
            <ChatTab
              meet={meet}
              messages={messages}
              isJoined={isJoined}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
            />
          )}

          <Spacer />
        </div>

      </div>{/* end meet-detail-panel */}

      <ShareMeetModal meet={meet} open={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Details tab
   ═══════════════════════════════════════════════════════════════ */

function DetailsTab({
  meet,
  goingAttendees,
  interestedCount,
  totalDogs,
  spotsLeft,
  isCreator,
  rsvpStatus,
  onRsvpChange,
  onShare,
}: {
  meet: Meet;
  goingAttendees: Meet["attendees"];
  interestedCount: number;
  totalDogs: number;
  spotsLeft: number;
  isCreator: boolean;
  rsvpStatus: "none" | "going" | "interested";
  onRsvpChange: (status: "none" | "going" | "interested") => void;
  onShare: () => void;
}) {
  return (
    <>
      {/* ── Meet header (banner equivalent) ── */}
      <div className="meet-detail-header">
        <div className="flex items-center gap-sm">
          <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-sm font-medium bg-brand-subtle text-brand-strong">
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
            <span className="rounded-pill px-sm py-xs text-xs font-medium bg-surface-gray text-fg-secondary">
              Completed
            </span>
          )}
        </div>
        {meet.groupId && (() => {
          const group = getGroupById(meet.groupId);
          return group ? (
            <Link
              href={`/communities/${group.id}`}
              className="inline-flex items-center gap-sm rounded-panel p-sm no-underline bg-brand-subtle border border-brand-main self-start"
            >
              <UsersThree size={16} weight="fill" className="text-brand-main" />
              <span className="text-sm font-medium text-brand-strong">
                {group.name}
              </span>
            </Link>
          ) : null;
        })()}
        <h1>{meet.title}</h1>
        <p>{meet.description}</p>
      </div>

      {/* ── Details content ── */}
      <div className="meet-detail-content">

      {/* Details grid */}
      <div
        className="grid grid-cols-2 gap-lg rounded-panel p-lg bg-surface-top border border-edge-light"
      >
        <div className="flex items-start gap-md">
          <CalendarDots size={24} weight="light" className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }} />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{formatMeetDate(meet.date)}</span>
            <span className="text-sm text-fg-secondary">{meet.time}</span>
          </div>
        </div>
        <div className="flex items-start gap-md">
          <Clock size={24} weight="light" className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }} />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{formatDuration(meet.durationMinutes)}</span>
            <span className="text-sm text-fg-secondary">Duration</span>
          </div>
        </div>
        <div className="flex items-start gap-md">
          <MapPin size={24} weight="light" className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }} />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">{meet.location}</span>
            <span className="text-sm text-fg-secondary">{LEASH_LABELS[meet.leashRule]}</span>
          </div>
        </div>
        <div className="flex items-start gap-md">
          <Users size={24} weight="light" className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }} />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">
              {goingAttendees.length} going{interestedCount > 0 ? `, ${interestedCount} interested` : ""} · {totalDogs} dogs
            </span>
            <span className="text-sm text-fg-secondary">
              {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
            </span>
          </div>
        </div>
      </div>

      {/* Type-specific details */}
      <MeetTypeDetails meet={meet} />

      {/* Shared enhancement fields */}
      {(meet.energyLevel || meet.whatToBring?.length || meet.accessibilityNotes) && (
        <div className="flex flex-col gap-sm">
          {meet.energyLevel && meet.energyLevel !== "any" && (
            <div className="flex items-center gap-sm">
              <Heartbeat size={18} weight="light" className="text-fg-tertiary" />
              <span className="text-sm text-fg-primary">
                <span className="font-medium">Energy:</span> {ENERGY_LABELS[meet.energyLevel]}
              </span>
            </div>
          )}
          {meet.whatToBring && meet.whatToBring.length > 0 && (
            <div className="flex items-start gap-sm">
              <Backpack size={18} weight="light" className="text-fg-tertiary shrink-0 mt-xs" />
              <div className="flex flex-col gap-xs">
                <span className="text-sm font-medium text-fg-primary">What to bring</span>
                <div className="flex flex-wrap gap-xs">
                  {meet.whatToBring.map((item) => (
                    <span
                      key={item}
                      className="text-xs rounded-pill px-sm py-xs bg-surface-gray text-fg-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {meet.accessibilityNotes && (
            <div className="flex items-center gap-sm">
              <ShieldCheck size={18} weight="light" className="text-fg-tertiary" />
              <span className="text-sm text-fg-secondary">{meet.accessibilityNotes}</span>
            </div>
          )}
        </div>
      )}

      {/* Organiser */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Organiser</h2>
        <div className="flex items-center gap-md">
          <img
            src={meet.creatorAvatarUrl}
            alt={meet.creatorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-base font-medium text-fg-primary">{meet.creatorName}</span>
        </div>
      </section>

      {/* Photo gallery for completed meets / share prompt for upcoming */}
      {meet.photos && meet.photos.length > 0 ? (
        <MeetPhotoGallery photos={meet.photos} />
      ) : meet.status === "completed" && rsvpStatus === "going" ? (
        <div
          className="flex items-center gap-md rounded-panel p-lg border-2 border-dashed border-edge-light"
          style={{ cursor: "pointer" }}
        >
          <Camera size={28} weight="light" className="text-fg-tertiary shrink-0" />
          <div className="flex flex-col gap-xs">
            <span className="text-sm font-semibold text-fg-primary">Share photos from this meet</span>
            <span className="text-xs text-fg-tertiary">Add your moments — attendees will see them here.</span>
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex gap-sm flex-wrap">
        {meet.status === "upcoming" && (
          <>
            {isCreator ? (
              <ButtonAction variant="secondary" size="md" disabled>
                You&apos;re hosting
              </ButtonAction>
            ) : rsvpStatus === "going" ? (
              <>
                <ButtonAction
                  variant="primary"
                  size="md"
                  leftIcon={<Check size={16} weight="bold" />}
                  onClick={() => {}}
                >
                  Going
                </ButtonAction>
                <ButtonAction
                  variant="outline"
                  size="md"
                  leftIcon={<SignOut size={16} weight="light" />}
                  onClick={() => onRsvpChange("none")}
                >
                  Leave
                </ButtonAction>
              </>
            ) : rsvpStatus === "interested" ? (
              <>
                <ButtonAction
                  variant="primary"
                  size="md"
                  onClick={() => onRsvpChange("going")}
                  disabled={spotsLeft === 0}
                >
                  {spotsLeft > 0 ? "Join this meet" : "Meet is full"}
                </ButtonAction>
                <ButtonAction
                  variant="primary"
                  size="md"
                  leftIcon={<Star size={16} weight="fill" />}
                  onClick={() => {}}
                  className="!bg-[var(--status-warning-main)] !text-white"
                >
                  Interested
                </ButtonAction>
                <ButtonAction
                  variant="outline"
                  size="md"
                  onClick={() => onRsvpChange("none")}
                >
                  Remove
                </ButtonAction>
              </>
            ) : (
              <>
                <ButtonAction
                  variant="primary"
                  size="md"
                  disabled={spotsLeft === 0}
                  onClick={() => onRsvpChange("going")}
                >
                  {spotsLeft > 0 ? "Join this meet" : "Meet is full"}
                </ButtonAction>
                <ButtonAction
                  variant="outline"
                  size="md"
                  leftIcon={<Star size={16} weight="light" />}
                  onClick={() => onRsvpChange("interested")}
                >
                  Interested
                </ButtonAction>
              </>
            )}
          </>
        )}
        {meet.status === "completed" && rsvpStatus === "going" && (
          <ButtonAction
            variant="primary"
            size="md"
            href={`/meets/${meet.id}/connect`}
            leftIcon={<Handshake size={18} weight="light" />}
          >
            Connect with attendees
          </ButtonAction>
        )}
        <ButtonAction
          variant="outline"
          size="md"
          onClick={onShare}
          leftIcon={<ShareNetwork size={18} weight="light" />}
        >
          Share
        </ButtonAction>
      </div>

      </div>{/* end meet-detail-content */}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   People tab
   ═══════════════════════════════════════════════════════════════ */

function PeopleTab({ meet, isJoined }: { meet: Meet; isJoined: boolean }) {
  return (
    <div className="meet-detail-content">
      {/* Post-meet reveal for completed meets */}
      {meet.status === "completed" && isJoined && (() => {
        const hiddenAttendees = meet.attendees.filter((a) => {
          if (a.userId === "shawn") return false;
          const conn = getConnState(a.userId);
          const state = conn?.state ?? "none";
          const isOpen = a.profileOpen ?? conn?.profileOpen ?? false;
          return state === "none" && !isOpen;
        });
        return hiddenAttendees.length > 0 ? (
          <PostMeetReveal meetTitle={meet.title} hiddenAttendees={hiddenAttendees} />
        ) : null;
      })()}

      {/* Attendees — tiered participant list */}
      <ParticipantList
        attendees={meet.attendees}
        isCompleted={meet.status === "completed"}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Chat tab
   ═══════════════════════════════════════════════════════════════ */

function ChatTab({
  meet,
  messages,
  isJoined,
  newMessage,
  onNewMessageChange,
}: {
  meet: Meet;
  messages: MeetMessage[];
  isJoined: boolean;
  newMessage: string;
  onNewMessageChange: (val: string) => void;
}) {
  return (
    <div className="meet-detail-content">
      <h2 className="font-heading text-lg font-semibold text-fg-primary">Meet Chat</h2>
      {!isJoined ? (
        <EmptyState
          icon={<ChatCircleDots size={48} weight="light" />}
          title="RSVP to see the conversation"
          subtitle="Join this meet to chat with other attendees."
          action={
            <ButtonAction variant="primary" size="sm">
              Join this meet
            </ButtonAction>
          }
        />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<ChatCircleDots size={48} weight="light" />}
          title="No messages yet"
          subtitle="Start the conversation — say hello or ask a question about the meet."
        />
      ) : (
        <div className="meet-chat-messages">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === "shawn"}
            />
          ))}
        </div>
      )}
      {isJoined && (
        <div className="meet-chat-input">
          <input
            className="input flex-1"
            placeholder="Message the group..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
          />
          <ButtonAction
            variant="primary"
            size="md"
            disabled={!newMessage.trim()}
            leftIcon={<PaperPlaneRight size={16} weight="light" />}
            onClick={() => onNewMessageChange("")}
          >
            Send
          </ButtonAction>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Type-specific detail sections
   ═══════════════════════════════════════════════════════════════ */

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-md">
      <span className="text-fg-tertiary shrink-0" style={{ marginTop: 2 }}>{icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-fg-primary">{value}</span>
        <span className="text-xs text-fg-tertiary">{label}</span>
      </div>
    </div>
  );
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-xs">
      {items.map((item) => (
        <span key={item} className="text-xs font-medium rounded-pill px-sm py-xs bg-brand-subtle text-brand-strong">
          {item}
        </span>
      ))}
    </div>
  );
}

function MeetTypeDetails({ meet }: { meet: Meet }) {
  if (meet.type === "walk" && meet.walk) {
    const w = meet.walk;
    const hasFields = w.pace || w.distance || w.terrain || w.routeNotes;
    if (!hasFields) return null;
    return (
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Walk details</h2>
        <div className="grid grid-cols-2 gap-md rounded-panel p-lg bg-surface-top border border-edge-light sm:grid-cols-3">
          {w.pace && <DetailRow icon={<PersonSimpleWalk size={20} weight="light" />} label="Pace" value={PACE_LABELS[w.pace]} />}
          {w.distance && <DetailRow icon={<Ruler size={20} weight="light" />} label="Distance" value={DISTANCE_LABELS[w.distance]} />}
          {w.terrain && <DetailRow icon={<Mountains size={20} weight="light" />} label="Terrain" value={TERRAIN_LABELS[w.terrain]} />}
        </div>
        {w.routeNotes && (
          <div className="flex items-start gap-sm rounded-panel p-md bg-surface-top border border-edge-light">
            <Path size={18} weight="light" className="text-fg-tertiary shrink-0 mt-xs" />
            <div className="flex flex-col gap-xs">
              <span className="text-sm font-medium text-fg-primary">Route</span>
              <span className="text-sm text-fg-secondary">{w.routeNotes}</span>
            </div>
          </div>
        )}
      </section>
    );
  }

  if (meet.type === "park_hangout" && meet.parkHangout) {
    const p = meet.parkHangout;
    const hasFields = p.dropIn || p.amenities?.length || p.vibe;
    if (!hasFields) return null;
    return (
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Hangout details</h2>
        <div className="flex flex-col gap-md rounded-panel p-lg bg-surface-top border border-edge-light">
          {p.dropIn && p.endTime && (
            <DetailRow
              icon={<Clock size={20} weight="light" />}
              label="Drop-in window"
              value={`Come anytime ${meet.time}–${p.endTime}`}
            />
          )}
          {p.vibe && (
            <DetailRow icon={<FlagBanner size={20} weight="light" />} label="Vibe" value={VIBE_LABELS[p.vibe]} />
          )}
          {p.amenities && p.amenities.length > 0 && (
            <div className="flex flex-col gap-xs">
              <span className="text-sm font-medium text-fg-primary">Amenities</span>
              <PillList items={p.amenities.map((a) => AMENITY_LABELS[a])} />
            </div>
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "playdate" && meet.playdate) {
    const pd = meet.playdate;
    const hasFields = pd.ageRange || pd.playStyle || pd.fencedArea !== undefined || pd.maxDogsPerPerson;
    if (!hasFields) return null;
    return (
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Playdate details</h2>
        <div className="grid grid-cols-2 gap-md rounded-panel p-lg bg-surface-top border border-edge-light">
          {pd.ageRange && <DetailRow icon={<Dog size={20} weight="light" />} label="Age range" value={AGE_RANGE_LABELS[pd.ageRange]} />}
          {pd.playStyle && <DetailRow icon={<PawPrint size={20} weight="light" />} label="Play style" value={PLAY_STYLE_LABELS[pd.playStyle]} />}
          {pd.fencedArea !== undefined && (
            <DetailRow icon={<Park size={20} weight="light" />} label="Fenced area" value={pd.fencedArea ? "Yes — dogs can be off-leash" : "No — stay aware"} />
          )}
          {pd.maxDogsPerPerson && pd.maxDogsPerPerson > 0 && (
            <DetailRow icon={<Users size={20} weight="light" />} label="Max dogs per person" value={`${pd.maxDogsPerPerson} ${pd.maxDogsPerPerson === 1 ? "dog" : "dogs"}`} />
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "training" && meet.training) {
    const t = meet.training;
    const hasFields = t.skillFocus?.length || t.experienceLevel || t.ledBy || t.equipmentNeeded?.length;
    if (!hasFields) return null;
    return (
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">Training details</h2>
        <div className="flex flex-col gap-md rounded-panel p-lg bg-surface-top border border-edge-light">
          {t.skillFocus && t.skillFocus.length > 0 && (
            <div className="flex flex-col gap-xs">
              <span className="text-sm font-medium text-fg-primary">Skills</span>
              <PillList items={t.skillFocus.map((s) => SKILL_LABELS[s])} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-md">
            {t.experienceLevel && <DetailRow icon={<GraduationCap size={20} weight="light" />} label="Level" value={EXPERIENCE_LABELS[t.experienceLevel]} />}
            {t.ledBy && (
              <DetailRow
                icon={<Chalkboard size={20} weight="light" />}
                label="Led by"
                value={<>
                  {TRAINER_TYPE_LABELS[t.ledBy]}
                  {t.ledBy === "professional" && t.trainerName && (
                    <span className="text-fg-secondary"> — {t.trainerName}</span>
                  )}
                </>}
              />
            )}
          </div>
          {t.equipmentNeeded && t.equipmentNeeded.length > 0 && (
            <div className="flex flex-col gap-xs">
              <span className="text-sm font-medium text-fg-primary">Equipment needed</span>
              <PillList items={t.equipmentNeeded} />
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
}

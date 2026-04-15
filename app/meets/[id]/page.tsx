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
  CaretRight,
  CaretDown,
  UserPlus,
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
  getMeetTypeSummary,
} from "@/lib/mockMeets";
import { getMessagesForMeet } from "@/lib/mockMeetMessages";
import type { Meet, MeetType, MeetMessage, MeetAttendee } from "@/lib/types";

/* ── Constants ── */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={16} weight="light" />,
  park_hangout: <Tree size={16} weight="light" />,
  playdate: <PawPrint size={16} weight="light" />,
  training: <Target size={16} weight="light" />,
};

const MEET_TABS = [
  { key: "details", label: "Details" },
  { key: "people", label: "People" },
  { key: "chat", label: "Chat" },
];

/** Fallback cover photos per meet type when no cover is set */
const TYPE_FALLBACK_COVERS: Record<MeetType, string> = {
  walk: "/images/generated/group-walk-stromovka.jpeg",
  park_hangout: "/images/generated/park-hangout-riegrovy.jpeg",
  playdate: "/images/generated/meet-greeting.jpeg",
  training: "/images/generated/evening-walk-group.jpeg",
};

/* ── Helpers ── */

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function formatShortDate(dateStr: string): { weekday: string; day: string; month: string } {
  const d = new Date(dateStr + "T12:00:00");
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d.getDate().toString(),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
  };
}

function formatMessageTime(sentAt: string): string {
  const d = new Date(sentAt);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Whether MeetTypeDetails will render any content for this meet */
function hasMeetTypeDetails(meet: Meet): boolean {
  if (meet.type === "walk" && meet.walk) {
    const w = meet.walk;
    return Boolean(w.pace || w.distance || w.terrain || w.routeNotes);
  }
  if (meet.type === "park_hangout" && meet.parkHangout) {
    const p = meet.parkHangout;
    return Boolean(p.dropIn || p.amenities?.length || p.vibe);
  }
  if (meet.type === "playdate" && meet.playdate) {
    const pd = meet.playdate;
    return Boolean(pd.ageRange || pd.playStyle || pd.fencedArea !== undefined || pd.maxDogsPerPerson);
  }
  if (meet.type === "training" && meet.training) {
    const t = meet.training;
    return Boolean(t.skillFocus?.length || t.experienceLevel || t.ledBy || t.equipmentNeeded?.length);
  }
  return false;
}

/** Get connected/familiar attendees (people the user knows) */
function getKnownAttendees(attendees: MeetAttendee[]): MeetAttendee[] {
  return attendees.filter((a) => {
    if (a.userId === "shawn") return false;
    const conn = getConnState(a.userId);
    const state = conn?.state ?? "none";
    return state === "connected" || state === "familiar";
  });
}

/* ── Sub-components ── */

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

/* ── Page (with Suspense boundary for useSearchParams) ── */

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
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/home")}>
          Back to Home
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
  const headerAction = activeTab === "details" ? (
    <ButtonAction
      variant="outline"
      size="sm"
      cta
      leftIcon={<ShareNetwork size={14} weight="bold" />}
      onClick={() => setShowShare(true)}
    >
      Share
    </ButtonAction>
  ) : undefined;

  // Feed detail header into AppNav on mobile
  useEffect(() => {
    setDetailHeader(meet.title, () => router.back(), headerAction);
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
      <DetailHeader backLabel="Back" title={meet.title} rightAction={headerAction} />

      <div className="meet-detail-panel">
        <div className="meet-detail-body">
          <div className="detail-tabs detail-tabs--fill">
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
      </div>

      <ShareMeetModal meet={meet} open={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Details tab — redesigned
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
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const coverUrl = meet.coverPhotoUrl || meet.photos?.[0] || TYPE_FALLBACK_COVERS[meet.type];
  const knownAttendees = getKnownAttendees(meet.attendees);
  const shortDate = formatShortDate(meet.date);
  const typeSummary = getMeetTypeSummary(meet);
  const [rsvpMenuOpen, setRsvpMenuOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    if (!rsvpMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".meet-rsvp-menu-wrap")) setRsvpMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [rsvpMenuOpen]);

  return (
    <>
      {/* ── Hero cover photo (no overlays / no badges) ── */}
      <div
        className="meet-hero"
        style={{ backgroundImage: `url(${coverUrl})` }}
      />

      {/* ── Title, description, info card, RSVP actions (mirrors .group-detail-info) ── */}
      <div className="meet-detail-info">
        {/* Type badge — at the top, light brand coloring */}
        <div className="flex items-center gap-sm flex-wrap">
          <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong">
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          {meet.recurring && (
            <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong">
              <ArrowsClockwise size={10} weight="bold" /> Weekly
            </span>
          )}
          {meet.status === "completed" && (
            <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-gray text-fg-secondary">
              Completed
            </span>
          )}
        </div>

        {/* Title — match group exactly via Tailwind utilities */}
        <h1 className="font-heading text-3xl font-medium text-fg-primary m-0">
          {meet.title}
        </h1>

        {/* Description */}
        {meet.description && (
          <p className="meet-description">{meet.description}</p>
        )}

        {/* When + where — side-by-side row card */}
        <div className="meet-info-card">
          <div className="meet-info-row">
            <CalendarDots size={16} weight="light" />
            <span>
              <strong>{shortDate.weekday}, {shortDate.day} {shortDate.month}</strong>
              {" · "}
              {meet.time}
              {" "}
              <span className="text-fg-tertiary">({formatDuration(meet.durationMinutes)})</span>
            </span>
          </div>
          <div className="meet-info-row">
            <MapPin size={16} weight="light" />
            <span>
              <strong>{meet.location}</strong>
              {" · "}
              <span className="text-fg-tertiary">{LEASH_LABELS[meet.leashRule]}</span>
            </span>
          </div>
        </div>

        {/* RSVP action row — left = status (with dropdown), right = invite */}
        {meet.status === "upcoming" && (
          <div className="group-action-buttons">
            {isCreator ? (
              <ButtonAction variant="outline" size="md" cta leftIcon={<Check size={16} weight="bold" />} disabled>
                Hosting
              </ButtonAction>
            ) : (
              <div className="meet-rsvp-menu-wrap">
                <ButtonAction
                  variant={rsvpStatus === "none" ? "primary" : "outline"}
                  size="md"
                  cta
                  leftIcon={
                    rsvpStatus === "going" ? (
                      <Check size={16} weight="bold" />
                    ) : rsvpStatus === "interested" ? (
                      <Star size={16} weight="fill" />
                    ) : undefined
                  }
                  rightIcon={<CaretDown size={12} weight="bold" />}
                  disabled={rsvpStatus === "none" && spotsLeft === 0}
                  onClick={() => setRsvpMenuOpen((v) => !v)}
                >
                  {rsvpStatus === "going"
                    ? "Going"
                    : rsvpStatus === "interested"
                    ? "Interested"
                    : spotsLeft > 0
                    ? "Join this meet"
                    : "Meet is full"}
                </ButtonAction>

                {rsvpMenuOpen && (
                  <div className="meet-rsvp-menu" role="menu">
                    <button
                      type="button"
                      className={`meet-rsvp-menu-item${rsvpStatus === "going" ? " is-active" : ""}`}
                      onClick={() => { onRsvpChange("going"); setRsvpMenuOpen(false); }}
                      disabled={spotsLeft === 0 && rsvpStatus !== "going"}
                    >
                      <Check size={16} weight="bold" /> Going
                    </button>
                    <button
                      type="button"
                      className={`meet-rsvp-menu-item${rsvpStatus === "interested" ? " is-active" : ""}`}
                      onClick={() => { onRsvpChange("interested"); setRsvpMenuOpen(false); }}
                    >
                      <Star size={16} weight="fill" /> Interested
                    </button>
                    {rsvpStatus !== "none" && (
                      <button
                        type="button"
                        className="meet-rsvp-menu-item"
                        onClick={() => { onRsvpChange("none"); setRsvpMenuOpen(false); }}
                      >
                        <SignOut size={16} weight="light" /> Not going
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <ButtonAction variant="primary" size="md" cta leftIcon={<UserPlus size={16} weight="bold" />} onClick={onShare}>
              Invite
            </ButtonAction>
          </div>
        )}
      </div>

      {/* ── Content sections ── */}
      <div className="meet-detail-content">

      {/* ── Hosted by + group context (combined card) ── */}
      <section className="meet-section">
        <h2 className="meet-section-title">Organised by</h2>
        <div className="meet-context-card">
          <Link
            href={meet.creatorId === "shawn" ? "/profile" : `/profile/${meet.creatorId}`}
            className="meet-context-row"
            style={{ textDecoration: "none" }}
          >
            <img src={meet.creatorAvatarUrl} alt={meet.creatorName} className="meet-organiser-avatar" />
            <div className="flex flex-col flex-1">
              <span className="text-sm font-semibold text-fg-primary">{meet.creatorName}</span>
              <span className="text-xs text-fg-tertiary">
                {meet.creatorId === "shawn" ? "That's you!" : "Organiser"}
              </span>
            </div>
            <CaretRight size={16} weight="bold" className="text-fg-tertiary" />
          </Link>
          {group && (
            <>
              <div className="meet-context-divider" />
              <Link
                href={`/communities/${group.id}`}
                className="meet-context-row"
                style={{ textDecoration: "none" }}
              >
                <div className="meet-icon-box">
                  <UsersThree size={18} weight="fill" className="text-brand-main" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-fg-primary">{group.name}</span>
                  <span className="text-xs text-fg-tertiary">Hosted in this community</span>
                </div>
                <CaretRight size={16} weight="bold" className="text-fg-tertiary" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── Who's coming (summary card with avatar pile + trust signal) ── */}
      <section className="meet-section">
        <div className="meet-section-header">
          <h2 className="meet-section-title">Who's coming</h2>
          <Link
            href={`/meets/${meet.id}?tab=people`}
            className="text-xs font-medium text-brand-main"
            style={{ textDecoration: "none" }}
          >
            View all
          </Link>
        </div>

        <div className="meet-summary-card">
          <div className="meet-summary-row">
            <div className="meet-summary-avatars">
              {goingAttendees.slice(0, 4).map((a) => (
                <img
                  key={a.userId}
                  src={a.avatarUrl}
                  alt={a.userName}
                  className="meet-summary-avatar"
                />
              ))}
            </div>
            <div className="meet-summary-meta">
              <span className="meet-summary-count">
                {goingAttendees.length} going
                {interestedCount > 0 ? ` · ${interestedCount} interested` : ""}
              </span>
              <span className="meet-summary-trust">
                {knownAttendees.length > 0
                  ? knownAttendees.length === 1
                    ? `${knownAttendees[0].userName} is joining`
                    : `${knownAttendees.length} of your connections joining`
                  : `${totalDogs} dog${totalDogs !== 1 ? "s" : ""} expected`}
              </span>
            </div>
          </div>
        </div>

        {spotsLeft <= 3 && spotsLeft > 0 && (
          <div className="meet-spots-warning">
            <Lightning size={14} weight="fill" className="text-warning-main" />
            <span className="text-xs font-medium text-fg-primary">
              Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </span>
          </div>
        )}
      </section>

      {/* ── Type-specific details (with inline summary if available) ── */}
      {typeSummary && !hasMeetTypeDetails(meet) && (
        <section className="meet-section">
          <h2 className="meet-section-title">{MEET_TYPE_LABELS[meet.type]} details</h2>
          <div className="flex items-center gap-sm">
            {MEET_ICONS[meet.type]}
            <span className="text-sm text-fg-primary">{typeSummary}</span>
          </div>
        </section>
      )}
      <MeetTypeDetails meet={meet} />

      {/* ── Good to know (stat grid subcard) ── */}
      {(meet.energyLevel || meet.dogSizeFilter !== "any" || meet.whatToBring?.length || meet.accessibilityNotes) && (
        <section className="meet-section">
          <h2 className="meet-section-title">Good to know</h2>
          <div className="meet-stat-grid meet-stat-grid--3">
            {meet.energyLevel && meet.energyLevel !== "any" && (
              <StatCell icon={<Heartbeat size={16} weight="light" />} label="Energy" value={ENERGY_LABELS[meet.energyLevel]} />
            )}
            <StatCell icon={<PawPrint size={16} weight="light" />} label="Leash rule" value={LEASH_LABELS[meet.leashRule]} />
            <StatCell icon={<Users size={16} weight="light" />} label="Max attendees" value={String(meet.maxAttendees)} />
            {meet.accessibilityNotes && (
              <StatCell
                icon={<ShieldCheck size={16} weight="light" />}
                label="Accessibility"
                value={meet.accessibilityNotes}
                full
              />
            )}
            {meet.whatToBring && meet.whatToBring.length > 0 && (
              <StatCell
                icon={<Backpack size={16} weight="light" />}
                label="Bring"
                value={meet.whatToBring.join(", ")}
                full
              />
            )}
          </div>
        </section>
      )}

      {/* ── Service CTA (care group events) ── */}
      {meet.serviceCTA && (
        <section className="meet-service-cta">
          <div className="flex flex-col gap-xs flex-1">
            <span className="text-sm font-semibold text-fg-primary">{meet.serviceCTA.label}</span>
            {meet.serviceCTA.price && (
              <span className="text-xs text-fg-tertiary">{meet.serviceCTA.price}{meet.serviceCTA.spotsLeft ? ` · ${meet.serviceCTA.spotsLeft} spots left` : ""}</span>
            )}
          </div>
          <ButtonAction variant="primary" size="sm" cta href={meet.serviceCTA.href}>
            Book
          </ButtonAction>
        </section>
      )}

      {/* ── Photos (completed meets) ── */}
      {meet.photos && meet.photos.length > 0 && (
        <section className="meet-section">
          <h2 className="meet-section-title">Photos</h2>
          <MeetPhotoGallery photos={meet.photos} />
        </section>
      )}

      {/* ── Share prompt for completed meets ── */}
      {meet.status === "completed" && rsvpStatus === "going" && !(meet.photos && meet.photos.length > 0) && (
        <div className="meet-share-photos-prompt">
          <Camera size={28} weight="light" className="text-fg-tertiary shrink-0" />
          <div className="flex flex-col gap-xs">
            <span className="text-sm font-semibold text-fg-primary">Share photos from this meet</span>
            <span className="text-xs text-fg-tertiary">Add your moments — attendees will see them here.</span>
          </div>
        </div>
      )}

      {/* ── Post-meet connect CTA ── */}
      {meet.status === "completed" && rsvpStatus === "going" && (
        <div className="meet-rsvp-actions" style={{ padding: "0 var(--space-xl)" }}>
          <ButtonAction
            variant="primary"
            size="md"
            href={`/meets/${meet.id}/connect`}
            leftIcon={<Handshake size={18} weight="light" />}
          >
            Connect with attendees
          </ButtonAction>
        </div>
      )}
      </div>{/* end .meet-detail-content */}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   People tab
   ═══════════════════════════════════════════════════════════════ */

function PeopleTab({ meet, isJoined }: { meet: Meet; isJoined: boolean }) {
  return (
    <div className="meet-detail-content">
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
      <ParticipantList attendees={meet.attendees} isCompleted={meet.status === "completed"} />
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
            <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === "shawn"} />
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

function StatCell({
  icon,
  label,
  value,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`meet-stat-cell${full ? " meet-stat-cell--full" : ""}`}>
      {icon}
      <div className="meet-stat-cell-text">
        <span className="meet-stat-cell-label">{label}</span>
        <span className="meet-stat-cell-value">{value}</span>
      </div>
    </div>
  );
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-xs">
      {items.map((item) => (
        <span key={item} className="meet-bring-pill">
          {item}
        </span>
      ))}
    </div>
  );
}

function MeetTypeDetails({ meet }: { meet: Meet }) {
  if (meet.type === "walk" && meet.walk) {
    const w = meet.walk;
    if (!(w.pace || w.distance || w.terrain || w.routeNotes)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Walk details</h2>
        <div className="meet-stat-grid meet-stat-grid--3">
          {w.pace && <StatCell icon={<PersonSimpleWalk size={16} weight="light" />} label="Pace" value={PACE_LABELS[w.pace]} />}
          {w.distance && <StatCell icon={<Ruler size={16} weight="light" />} label="Distance" value={DISTANCE_LABELS[w.distance]} />}
          {w.terrain && <StatCell icon={<Mountains size={16} weight="light" />} label="Terrain" value={TERRAIN_LABELS[w.terrain]} />}
          {w.routeNotes && (
            <StatCell icon={<Path size={16} weight="light" />} label="Route" value={w.routeNotes} full />
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "park_hangout" && meet.parkHangout) {
    const p = meet.parkHangout;
    if (!(p.dropIn || p.amenities?.length || p.vibe)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Hangout details</h2>
        <div className="meet-stat-grid meet-stat-grid--2">
          {p.dropIn && p.endTime && (
            <StatCell icon={<Clock size={16} weight="light" />} label="Drop-in" value={`${meet.time}–${p.endTime}`} />
          )}
          {p.vibe && (
            <StatCell icon={<FlagBanner size={16} weight="light" />} label="Vibe" value={VIBE_LABELS[p.vibe]} />
          )}
          {p.amenities && p.amenities.length > 0 && (
            <div className="meet-stat-cell meet-stat-cell--full">
              <Park size={16} weight="light" />
              <div className="meet-stat-cell-text">
                <span className="meet-stat-cell-label">Amenities</span>
                <div className="flex flex-wrap gap-xs mt-xs">
                  <PillList items={p.amenities.map((a) => AMENITY_LABELS[a])} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "playdate" && meet.playdate) {
    const pd = meet.playdate;
    if (!(pd.ageRange || pd.playStyle || pd.fencedArea !== undefined || pd.maxDogsPerPerson)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Playdate details</h2>
        <div className="meet-stat-grid meet-stat-grid--2">
          {pd.ageRange && <StatCell icon={<Dog size={16} weight="light" />} label="Age range" value={AGE_RANGE_LABELS[pd.ageRange]} />}
          {pd.playStyle && <StatCell icon={<PawPrint size={16} weight="light" />} label="Play style" value={PLAY_STYLE_LABELS[pd.playStyle]} />}
          {pd.fencedArea !== undefined && (
            <StatCell icon={<Park size={16} weight="light" />} label="Fenced area" value={pd.fencedArea ? "Yes" : "No"} />
          )}
          {pd.maxDogsPerPerson && pd.maxDogsPerPerson > 0 && (
            <StatCell icon={<Users size={16} weight="light" />} label="Max per person" value={`${pd.maxDogsPerPerson} dog${pd.maxDogsPerPerson === 1 ? "" : "s"}`} />
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "training" && meet.training) {
    const t = meet.training;
    if (!(t.skillFocus?.length || t.experienceLevel || t.ledBy || t.equipmentNeeded?.length)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Training details</h2>
        <div className="meet-stat-grid meet-stat-grid--2">
          {t.experienceLevel && <StatCell icon={<GraduationCap size={16} weight="light" />} label="Level" value={EXPERIENCE_LABELS[t.experienceLevel]} />}
          {t.ledBy && (
            <StatCell
              icon={<Chalkboard size={16} weight="light" />}
              label="Led by"
              value={`${TRAINER_TYPE_LABELS[t.ledBy]}${t.ledBy === "professional" && t.trainerName ? ` — ${t.trainerName}` : ""}`}
            />
          )}
          {t.skillFocus && t.skillFocus.length > 0 && (
            <div className="meet-stat-cell meet-stat-cell--full">
              <Target size={16} weight="light" />
              <div className="meet-stat-cell-text">
                <span className="meet-stat-cell-label">Skills covered</span>
                <div className="flex flex-wrap gap-xs mt-xs">
                  <PillList items={t.skillFocus.map((s) => SKILL_LABELS[s])} />
                </div>
              </div>
            </div>
          )}
          {t.equipmentNeeded && t.equipmentNeeded.length > 0 && (
            <div className="meet-stat-cell meet-stat-cell--full">
              <Backpack size={16} weight="light" />
              <div className="meet-stat-cell-text">
                <span className="meet-stat-cell-label">Equipment needed</span>
                <div className="flex flex-wrap gap-xs mt-xs">
                  <PillList items={t.equipmentNeeded} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
}

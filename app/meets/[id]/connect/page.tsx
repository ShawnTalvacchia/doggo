"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PawPrint, Handshake, UserPlus, Check } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { mockMeets } from "@/lib/mockMeets";
import { getConnectionState } from "@/lib/mockConnections";
import type { MeetAttendee, ConnectionState } from "@/lib/types";

type LocalAction = "familiar" | "connect" | null;

function AttendeeConnectCard({
  attendee,
  existingState,
}: {
  attendee: MeetAttendee;
  existingState: ConnectionState | undefined;
}) {
  const [action, setAction] = useState<LocalAction>(null);
  const effectiveState = action || existingState || "none";

  return (
    <div className="flex items-center gap-md rounded-panel bg-surface-top p-md shadow-sm">
      <img
        src={attendee.avatarUrl}
        alt={attendee.userName}
        className="rounded-full shrink-0"
        style={{ width: 48, height: 48, objectFit: "cover" }}
      />
      <div className="flex flex-col flex-1 gap-xs">
        <span className="text-base font-medium text-fg-primary">{attendee.userName}</span>
        <span className="text-xs text-fg-tertiary">
          with {attendee.dogNames.join(" & ")}
        </span>
      </div>
      <div className="flex gap-xs">
        {effectiveState === "connected" ? (
          <span className="flex items-center gap-xs text-sm font-medium" style={{ color: "var(--brand-main)" }}>
            <Check size={16} weight="bold" />
            Connected
          </span>
        ) : effectiveState === "familiar" ? (
          <span className="flex items-center gap-xs text-sm font-medium" style={{ color: "var(--brand-main)" }}>
            <Check size={16} weight="bold" />
            Familiar
          </span>
        ) : effectiveState === "pending" ? (
          <span className="text-sm text-fg-tertiary">Request sent</span>
        ) : effectiveState === "connect" ? (
          <span className="flex items-center gap-xs text-sm font-medium" style={{ color: "var(--brand-main)" }}>
            <Check size={16} weight="bold" />
            Request sent
          </span>
        ) : (
          <>
            <ButtonAction
              variant="outline"
              size="sm"
              onClick={() => setAction("familiar")}
              leftIcon={<Handshake size={14} weight="light" />}
            >
              Familiar
            </ButtonAction>
            <ButtonAction
              variant="primary"
              size="sm"
              onClick={() => setAction("connect")}
              leftIcon={<UserPlus size={14} weight="light" />}
            >
              Connect
            </ButtonAction>
          </>
        )}
      </div>
    </div>
  );
}

export default function PostMeetConnectPage() {
  const params = useParams();
  const router = useRouter();
  const meet = mockMeets.find((m) => m.id === params.id);

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

  const otherAttendees = meet.attendees.filter((a) => a.userId !== "shawn");

  // Generate dog-centred framing
  const myDogs = meet.attendees.find((a) => a.userId === "shawn")?.dogNames || [];
  const firstOtherDog = otherAttendees[0]?.dogNames[0];
  const dogPhrase =
    myDogs[0] && firstOtherDog
      ? `${myDogs[0]} and ${firstOtherDog} seemed to get along!`
      : "Looks like the dogs had a great time!";

  return (
    <div
      className="flex flex-col gap-xl p-xl"
      style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}
    >
      {/* Header */}
      <header className="flex flex-col items-center gap-md text-center pt-lg">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 64, height: 64, background: "var(--brand-subtle)" }}
        >
          <PawPrint size={32} weight="light" style={{ color: "var(--brand-main)" }} />
        </div>
        <h1 className="font-heading text-4xl font-semibold text-fg-primary">
          Great meet!
        </h1>
        <p className="text-base text-fg-secondary">{dogPhrase}</p>
        <p className="text-sm text-fg-tertiary">
          Build your community — mark people as <strong>Familiar</strong> or send a <strong>Connect</strong> request.
        </p>
      </header>

      {/* Meet context */}
      <div
        className="flex items-center gap-sm rounded-panel p-sm text-sm text-fg-secondary"
        style={{ background: "var(--surface-inset)" }}
      >
        <PawPrint size={16} weight="light" />
        <span>{meet.title} · {meet.location}</span>
      </div>

      {/* Attendee list */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-heading text-lg font-semibold text-fg-primary">
          Who was there ({otherAttendees.length})
        </h2>
        <div className="flex flex-col gap-sm">
          {otherAttendees.map((attendee) => {
            const conn = getConnectionState(attendee.userId);
            return (
              <AttendeeConnectCard
                key={attendee.userId}
                attendee={attendee}
                existingState={conn?.state}
              />
            );
          })}
        </div>
      </section>

      {/* Trust explainer */}
      <div
        className="rounded-panel p-md text-sm text-fg-secondary"
        style={{ background: "var(--surface-base)" }}
      >
        <strong>How connections work:</strong>
        <ul className="flex flex-col gap-xs mt-sm" style={{ paddingLeft: 16 }}>
          <li><strong>Familiar</strong> — You recognise them. They get more visibility into your profile.</li>
          <li><strong>Connect</strong> — Send a request. If they accept, you can message each other and arrange care.</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-md justify-center">
        <ButtonAction variant="primary" size="md" cta href="/home">
          Done
        </ButtonAction>
        <ButtonAction variant="tertiary" size="md" href={`/meets/${meet.id}`}>
          Back to meet
        </ButtonAction>
      </div>
    </div>
  );
}

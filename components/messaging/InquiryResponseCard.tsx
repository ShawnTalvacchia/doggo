"use client";

import { useState } from "react";
import {
  CalendarCheck,
  XCircle,
  ChatText,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Conversation } from "@/lib/types";
import { formatShortDate } from "@/lib/dateUtils";

/**
 * Shown to the carer when a booking inquiry exists but no proposal has been sent yet.
 * Three actions: Send Proposal, Decline, Suggest Changes.
 */
export function InquiryResponseCard({
  conv,
  onSendProposal,
  onDecline,
  onSuggestChanges,
}: {
  conv: Conversation;
  onSendProposal: () => void;
  onDecline: (reason: string) => void;
  onSuggestChanges: () => void;
}) {
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const inq = conv.inquiry;
  const ownerFirst = conv.ownerName.split(" ")[0];

  const scheduleText = inq.recurringSchedule
    ? `Every ${inq.recurringSchedule.days.join(", ")} · ${inq.recurringSchedule.timeLabel}`
    : inq.startDate && inq.endDate
    ? `${formatShortDate(inq.startDate)} – ${formatShortDate(inq.endDate)}`
    : inq.startDate
    ? `From ${formatShortDate(inq.startDate)}`
    : "Dates not specified";

  if (showDecline) {
    return (
      <div className="rounded-panel bg-surface-base border border-edge-regular p-md w-full max-w-md">
        <p className="text-sm font-semibold text-fg-primary mb-sm">
          Decline {ownerFirst}&apos;s inquiry?
        </p>
        <textarea
          className="input w-full mb-sm"
          rows={2}
          placeholder={`Optional message to ${ownerFirst}…`}
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
        />
        <div className="flex gap-sm">
          <ButtonAction
            variant="destructive"
            size="sm"
            onClick={() => onDecline(declineReason)}
          >
            Decline
          </ButtonAction>
          <ButtonAction
            variant="tertiary"
            size="sm"
            onClick={() => setShowDecline(false)}
          >
            Cancel
          </ButtonAction>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-panel bg-surface-base border border-edge-regular p-md w-full max-w-md">
      <p className="text-sm font-semibold text-fg-primary mb-sm">
        New inquiry from {ownerFirst}
      </p>
      <div className="flex flex-wrap gap-xs mb-md">
        <span className="pill">{SERVICE_LABELS[inq.serviceType]}</span>
        {inq.subService && <span className="pill">{inq.subService}</span>}
        <span className="pill">{inq.pets.length > 0 ? inq.pets.join(", ") : inq.dogName || "—"}</span>
        <span className="pill">{scheduleText}</span>
      </div>
      <div className="flex flex-col gap-xs">
        <ButtonAction
          variant="primary"
          size="sm"
          leftIcon={<CalendarCheck size={16} weight="light" />}
          onClick={onSendProposal}
        >
          Send proposal
        </ButtonAction>
        <div className="flex gap-xs">
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<ChatText size={16} weight="light" />}
            onClick={onSuggestChanges}
            className="flex-1"
          >
            Suggest changes
          </ButtonAction>
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<XCircle size={16} weight="light" />}
            onClick={() => setShowDecline(true)}
            className="flex-1"
          >
            Decline
          </ButtonAction>
        </div>
      </div>
    </div>
  );
}


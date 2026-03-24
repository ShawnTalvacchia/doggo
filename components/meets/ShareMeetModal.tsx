"use client";

import { useState } from "react";
import { Check, Copy, EnvelopeSimple, ChatCircleDots, ShareNetwork } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { Meet } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";

export function ShareMeetModal({
  meet,
  open,
  onClose,
}: {
  meet: Meet;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `doggo.app/meets/${meet.id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${shareUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalSheet open={open} onClose={onClose} title="Share this meet">
      <div className="flex flex-col gap-lg">
        {/* Meet preview */}
        <div
          className="flex flex-col gap-sm rounded-panel p-md"
          style={{ background: "var(--surface-inset)" }}
        >
          <span
            className="text-xs font-medium"
            style={{ color: "var(--brand-strong)" }}
          >
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          <span className="text-base font-medium text-fg-primary">{meet.title}</span>
          <span className="text-sm text-fg-secondary">{meet.location}</span>
          <span className="text-sm text-fg-tertiary">
            {meet.attendees.length} attending · {meet.maxAttendees - meet.attendees.length} spots left
          </span>
        </div>

        {/* Copy link */}
        <div className="flex flex-col gap-sm">
          <label className="text-sm font-medium text-fg-primary">Share link</label>
          <div className="flex gap-sm">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-form px-md py-sm text-sm"
              style={{
                border: "1px solid var(--border-regular)",
                background: "var(--surface-base)",
                color: "var(--text-secondary)",
              }}
            />
            <ButtonAction
              variant={copied ? "primary" : "secondary"}
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="light" />}
            >
              {copied ? "Copied!" : "Copy"}
            </ButtonAction>
          </div>
        </div>

        {/* Share via icons (non-functional for demo) */}
        <div className="flex flex-col gap-sm">
          <label className="text-sm font-medium text-fg-primary">Share via</label>
          <div className="flex gap-md">
            {[
              { icon: <ChatCircleDots size={20} weight="light" />, label: "Message" },
              { icon: <ShareNetwork size={20} weight="light" />, label: "WhatsApp" },
              { icon: <EnvelopeSimple size={20} weight="light" />, label: "Email" },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center gap-xs rounded-panel p-sm"
                style={{
                  background: "var(--surface-gray)",
                  border: "none",
                  cursor: "pointer",
                  minWidth: 64,
                }}
              >
                <span className="text-fg-secondary">{item.icon}</span>
                <span className="text-xs text-fg-tertiary">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-fg-tertiary text-center" style={{ fontStyle: "italic" }}>
          Invite a friend — their dog will thank you
        </p>
      </div>
    </ModalSheet>
  );
}

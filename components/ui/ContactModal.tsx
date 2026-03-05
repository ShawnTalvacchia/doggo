"use client";

import { useState, useEffect } from "react";
import { ChatCircleDots } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { ServiceType } from "@/lib/types";

const SERVICE_LABELS: Record<ServiceType, string> = {
  walk_checkin: "walks & check-ins",
  inhome_sitting: "in-home sitting",
  boarding: "boarding",
};

/**
 * Build a natural opening message from whatever context we have.
 * The owner edits it before sending — this just saves them the blank-page problem.
 */
function buildInitialMessage(
  firstName: string,
  service: ServiceType | null,
): string {
  const serviceStr = service ? SERVICE_LABELS[service] : null;

  if (serviceStr) {
    return `Hi ${firstName}, I'm looking for ${serviceStr} for my dog. Are you available?`;
  }
  return `Hi ${firstName}, I'd love to arrange care for my dog. Are you available?`;
}

export type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  providerName: string;
  /** Service the owner was browsing — used to pre-fill the message */
  service?: ServiceType | null;
};

export function ContactModal({
  open,
  onClose,
  providerName,
  service,
}: ContactModalProps) {
  const firstName = providerName.split(" ")[0];
  const [step, setStep] = useState<"compose" | "sent">("compose");
  const [message, setMessage] = useState(() => buildInitialMessage(firstName, service ?? null));

  // Rebuild the draft when context changes (e.g. modal opens with a different provider)
  useEffect(() => {
    setMessage(buildInitialMessage(firstName, service ?? null));
  }, [firstName, service]);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep("compose");
      setMessage(buildInitialMessage(firstName, service ?? null));
    }, 300);
  }

  // ── Sent confirmation ─────────────────────────────────────────────────────
  if (step === "sent") {
    return (
      <ModalSheet
        open={open}
        onClose={handleClose}
        title="Message sent"
        footer={
          <ButtonAction
            variant="primary"
            onClick={handleClose}
            className="contact-modal-done-btn"
          >
            Done
          </ButtonAction>
        }
      >
        <div className="contact-modal-success">
          <ChatCircleDots size={52} weight="fill" className="contact-modal-success-icon" />
          <h2 className="contact-modal-success-heading">Message sent to {firstName}!</h2>
          <p className="contact-modal-success-body">
            You&apos;ll be notified as soon as {firstName} replies. In the meantime, feel free to
            message other providers too.
          </p>
        </div>
      </ModalSheet>
    );
  }

  // ── Compose ───────────────────────────────────────────────────────────────
  return (
    <ModalSheet
      open={open}
      onClose={handleClose}
      title={`Message ${firstName}`}
      footer={
        <ButtonAction
          variant="primary"
          onClick={() => setStep("sent")}
          disabled={!message.trim()}
          className="contact-modal-send-btn"
        >
          Send message
        </ButtonAction>
      }
    >
      <div className="contact-modal-body">
        <p className="contact-modal-hint">
          Edit the message below before sending — {firstName} will see exactly what you write.
        </p>
        <textarea
          className="contact-modal-textarea"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label={`Message to ${firstName}`}
        />
      </div>
    </ModalSheet>
  );
}

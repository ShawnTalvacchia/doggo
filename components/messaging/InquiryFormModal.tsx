"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { InquiryForm, type InquirySubmitData } from "@/components/messaging/InquiryForm";
import { useConversations } from "@/contexts/ConversationsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { ChatMessage, ServiceType, Conversation } from "@/lib/types";

/**
 * InquiryFormModal — owner-side composing surface for a structured booking
 * inquiry. Opens over whatever the owner was looking at (service card on
 * the provider profile is the primary entry point); on submit, creates or
 * elevates the (owner, provider) conversation, posts an `inquiry`-type
 * message, and shows a brief success state before closing.
 *
 * Discover & Care 2026-05-03 refactor — replaces the body-replacing
 * InquiryForm rendering inside ThreadClient. See
 * `Groups & Care Model.md` → Services as Catalog.
 */
export function InquiryFormModal({
  open,
  onClose,
  provider,
  service,
  subService,
}: {
  open: boolean;
  onClose: () => void;
  provider: { id: string; name: string; avatarUrl: string };
  service: ServiceType;
  subService: string | null;
}) {
  const currentUser = useCurrentUser();
  const {
    getOrCreateServiceConversation,
    updateInquiry,
    addMessage,
  } = useConversations();
  const { markFamiliar } = useConnections();
  const [submitted, setSubmitted] = useState(false);

  // Reset success state whenever the modal opens fresh.
  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  // Build the synthetic conversation shape the InquiryForm expects.
  // Pets default to all of viewer's dogs; sub-service from the entry CTA.
  const seededConv: Conversation = {
    id: `${provider.id}-conv`,
    conversationType: "booking",
    providerId: provider.id,
    providerName: provider.name,
    providerAvatarUrl: provider.avatarUrl,
    ownerId: currentUser.id,
    ownerName: `${currentUser.firstName} ${currentUser.lastName}`,
    ownerAvatarUrl: currentUser.avatarUrl,
    status: "active",
    inquiry: {
      bookingType: "one_off",
      serviceType: service,
      subService,
      pets: currentUser.pets.map((p) => p.name),
      startDate: null,
      endDate: null,
      dogName: "",
      message: "",
    },
    messages: [],
    lastMessageId: "",
    unreadCount: 0,
  };

  function handleSubmit(data: InquirySubmitData) {
    const convId = getOrCreateServiceConversation(provider, data.service, data.subService);

    // Auto-mark mutual Familiar on inquiry send. Sending an inquiry is an
    // explicit, two-sided action — both parties know it happened — so the
    // deniability principle that normally keeps Familiar marks one-sided
    // doesn't apply here. The provider needs to see the owner's profile
    // to write a meaningful proposal; the owner already chose to engage.
    // Stop-gap fix 2026-05-04 — full inquiry-and-trust-state model is
    // logged for the Inbox & Notifications phase.
    markFamiliar(currentUser.id, provider.id);
    markFamiliar(provider.id, currentUser.id);

    // Resolve startDate from the right source: one-off uses the picked
    // range's start; ongoing uses the optional "Start from" date.
    // Pricing & Proposals walkthrough 2026-05-05.
    const resolvedStartDate =
      data.bookingType === "one_off"
        ? data.dateRange.start
        : data.ongoingStart;

    updateInquiry(convId, {
      bookingType: data.bookingType,
      serviceType: data.service,
      subService: data.subService,
      pets: data.pets,
      dogName: data.pets.join(" & "),
      startDate: resolvedStartDate,
      endDate: data.bookingType === "one_off" ? data.dateRange.end : null,
      recurringSchedule: data.recurringSchedule ?? undefined,
      message: data.message,
    });

    const inquiryMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      sender: "owner",
      type: "inquiry",
      inquiry: {
        bookingType: data.bookingType,
        serviceType: data.service,
        subService: data.subService,
        pets: data.pets,
        startDate: resolvedStartDate,
        endDate: data.bookingType === "one_off" ? data.dateRange.end : null,
        recurringSchedule: data.recurringSchedule ?? undefined,
        notes: data.message?.trim() || undefined,
        status: "pending",
      },
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(convId, inquiryMsg);

    // Show inline success for ~1.5s before closing — modal serves as its
    // own confirmation, no separate toast needed.
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  }

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={`Ask ${provider.name.split(" ")[0]} about care`}
    >
      {submitted ? (
        <div className="inquiry-form-success">
          <CheckCircle size={40} weight="fill" className="inquiry-form-success-icon" />
          <p className="inquiry-form-success-title">Inquiry sent</p>
          <p className="inquiry-form-success-sub">
            {provider.name.split(" ")[0]} will see it in their inbox and respond with a proposal. You can find it in your chat with them or in Bookings.
          </p>
        </div>
      ) : (
        <InquiryForm
          conv={seededConv}
          initialService={service}
          initialStart={null}
          initialEnd={null}
          onSubmit={handleSubmit}
        />
      )}
    </ModalSheet>
  );
}

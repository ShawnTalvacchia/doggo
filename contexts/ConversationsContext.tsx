"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { mockConversations } from "@/lib/mockConversations";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type {
  Conversation,
  ChatMessage,
  BookingProposalStatus,
  ServiceType,
  ConversationInquiry,
} from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProviderInfo {
  id: string;
  name: string;
  avatarUrl: string;
}

interface DirectMessageTarget {
  id: string;
  name: string;
  avatarUrl: string;
}

interface ConversationsContextValue {
  conversations: Conversation[];
  getConversation: (id: string) => Conversation | undefined;
  getConversationByProvider: (providerId: string) => Conversation | undefined;
  /** Find the conversation where the other party matches userId (checks providerId and ownerId) */
  getConversationForUser: (userId: string) => Conversation | undefined;
  /** Returns existing booking conversation id, or creates a new one and returns its id */
  getOrCreateConversation: (provider: ProviderInfo, service: ServiceType | null) => string;
  /** Returns existing direct message conversation id, or creates a new one and returns its id */
  getOrCreateDirectConversation: (target: DirectMessageTarget) => string;
  addMessage: (convId: string, message: ChatMessage) => void;
  updateInquiry: (convId: string, inquiry: Partial<ConversationInquiry>) => void;
  updateProposalStatus: (
    convId: string,
    msgId: string,
    status: BookingProposalStatus
  ) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────

const ConversationsContext = createContext<ConversationsContextValue | undefined>(
  undefined
);

// ── Provider ───────────────────────────────────────────────────────────────────

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const currentUser = useCurrentUser();
  const currentUserFullName = `${currentUser.firstName} ${currentUser.lastName}`;
  // The mock conversation seed data is currently Shawn-relative (Mock World
  // Building will populate per-persona threads). Non-Shawn personas will see
  // an empty inbox until that lands — that's expected.

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  const getConversationByProvider = useCallback(
    (providerId: string) => conversations.find((c) => c.providerId === providerId),
    [conversations]
  );

  const getConversationForUser = useCallback(
    (userId: string) => {
      // Find the conversation where the current persona and the target user are
      // the two parties (in either owner/provider role).
      const me = currentUser.id;
      return conversations.find(
        (c) =>
          (c.ownerId === me && c.providerId === userId) ||
          (c.providerId === me && c.ownerId === userId)
      );
    },
    [conversations, currentUser.id]
  );

  const getOrCreateConversation = useCallback(
    (provider: ProviderInfo, service: ServiceType | null): string => {
      // Return existing booking conversation for this provider if it exists
      const existing = conversations.find(
        (c) => c.conversationType === "booking" && c.providerId === provider.id
      );
      if (existing) return existing.id;

      // Create a new empty booking conversation
      const newId = `${provider.id}-conv`;
      const newConv: Conversation = {
        id: newId,
        conversationType: "booking",
        providerId: provider.id,
        providerName: provider.name,
        providerAvatarUrl: provider.avatarUrl,
        ownerId: currentUser.id,
        ownerName: currentUserFullName,
        ownerAvatarUrl: currentUser.avatarUrl,
        status: "active",
        inquiry: {
          bookingType: "one_off",
          serviceType: service ?? "walk_checkin",
          subService: null,
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

      setConversations((prev) => [newConv, ...prev]);
      return newId;
    },
    [conversations, currentUser.id, currentUser.avatarUrl, currentUser.pets, currentUserFullName]
  );

  const getOrCreateDirectConversation = useCallback(
    (target: DirectMessageTarget): string => {
      // Return existing direct conversation with this user
      const existing = conversations.find(
        (c) => c.conversationType === "direct" && c.providerId === target.id
      );
      if (existing) return existing.id;

      // Create a new direct message conversation
      const newId = `${target.id}-direct`;
      const newConv: Conversation = {
        id: newId,
        conversationType: "direct",
        providerId: target.id,
        providerName: target.name,
        providerAvatarUrl: target.avatarUrl,
        ownerId: currentUser.id,
        ownerName: currentUserFullName,
        ownerAvatarUrl: currentUser.avatarUrl,
        status: "active",
        inquiry: {
          bookingType: "one_off",
          serviceType: "walk_checkin",
          subService: null,
          pets: [],
          startDate: null,
          endDate: null,
          dogName: "",
          message: "",
        },
        messages: [],
        lastMessageId: "",
        unreadCount: 0,
      };

      setConversations((prev) => [newConv, ...prev]);
      return newId;
    },
    [conversations, currentUser.id, currentUser.avatarUrl, currentUserFullName]
  );

  const addMessage = useCallback((convId: string, message: ChatMessage) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const updatedMessages = [...c.messages, message];
        return {
          ...c,
          messages: updatedMessages,
          lastMessageId: message.id,
          unreadCount: message.sender === "provider" ? c.unreadCount + 1 : c.unreadCount,
        };
      })
    );
  }, []);

  const updateInquiry = useCallback(
    (convId: string, inquiry: Partial<ConversationInquiry>) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, inquiry: { ...c.inquiry, ...inquiry } } : c
        )
      );
    },
    []
  );

  const updateProposalStatus = useCallback(
    (convId: string, msgId: string, status: BookingProposalStatus) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === msgId && m.proposal
                ? { ...m, proposal: { ...m.proposal, status } }
                : m
            ),
          };
        })
      );
    },
    []
  );

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        getConversation,
        getConversationByProvider,
        getConversationForUser,
        getOrCreateConversation,
        getOrCreateDirectConversation,
        addMessage,
        updateInquiry,
        updateProposalStatus,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useConversations(): ConversationsContextValue {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations must be used within ConversationsProvider");
  return ctx;
}

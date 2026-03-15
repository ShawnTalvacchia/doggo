"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { mockConversations } from "@/lib/mockConversations";
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

interface ConversationsContextValue {
  conversations: Conversation[];
  getConversation: (id: string) => Conversation | undefined;
  getConversationByProvider: (providerId: string) => Conversation | undefined;
  /** Returns existing conversation id, or creates a new one and returns its id */
  getOrCreateConversation: (provider: ProviderInfo, service: ServiceType | null) => string;
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

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  const getConversationByProvider = useCallback(
    (providerId: string) => conversations.find((c) => c.providerId === providerId),
    [conversations]
  );

  const getOrCreateConversation = useCallback(
    (provider: ProviderInfo, service: ServiceType | null): string => {
      // Return existing conversation for this provider if it exists
      const existing = conversations.find((c) => c.providerId === provider.id);
      if (existing) return existing.id;

      // Create a new empty conversation
      const newId = `${provider.id}-conv`;
      const newConv: Conversation = {
        id: newId,
        providerId: provider.id,
        providerName: provider.name,
        providerAvatarUrl: provider.avatarUrl,
        ownerId: "shawn",
        ownerName: "Shawn Talvacchia",
        ownerAvatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        status: "active",
        inquiry: {
          bookingType: "one_off",
          serviceType: service ?? "walk_checkin",
          subService: null,
          pets: ["Spot", "Goldie"],
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
    [conversations]
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
        getOrCreateConversation,
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

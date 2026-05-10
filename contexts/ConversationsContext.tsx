"use client";

import { createContext, useContext, useCallback } from "react";
import { mockConversations } from "@/lib/mockConversations";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePersistedState } from "@/lib/usePersistedState";
import type {
  Conversation,
  ChatMessage,
  BookingProposalStatus,
  ServiceType,
  ConversationInquiry,
  InquiryStatus,
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
  /**
   * Service-context entry point — used by the "Book a session" / "Ask about this"
   * CTAs on profile service cards. There's only one thread per (owner, provider)
   * pair (per the booking-flow design); if an existing conv is "direct" we elevate
   * it to "booking" and attach the inquiry context, preserving the message history.
   * Discover & Care G1, 2026-05-02.
   */
  getOrCreateServiceConversation: (
    provider: ProviderInfo,
    service: ServiceType,
    sub?: string | null
  ) => string;
  addMessage: (convId: string, message: ChatMessage) => void;
  updateInquiry: (convId: string, inquiry: Partial<ConversationInquiry>) => void;
  updateProposalStatus: (
    convId: string,
    msgId: string,
    status: BookingProposalStatus
  ) => void;
  /** Update the status of a specific inquiry-type message. Used when a
   *  provider responds (status flips to `responded`) or owner withdraws. */
  updateInquiryStatus: (
    convId: string,
    msgId: string,
    status: InquiryStatus
  ) => void;
  /** Provider-side decline. Flips status to "declined" and saves the
   *  optional reason on the inquiry artifact so the owner sees why.
   *  Pricing & Proposals walkthrough 2026-05-05. */
  declineInquiry: (convId: string, msgId: string, reason?: string) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────

const ConversationsContext = createContext<ConversationsContextValue | undefined>(
  undefined
);

// ── Provider ───────────────────────────────────────────────────────────────────

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  // Persisted across reloads so an inquiry sent in one tab survives a
  // navigation/refresh — see `lib/usePersistedState.ts` for the rationale.
  const [conversations, setConversations] = usePersistedState<Conversation[]>(
    "doggo-conversations",
    mockConversations,
  );
  // Use useCurrentUser to honor `?as=` URL preview / sticky session
  // overrides. Without this, conversations filter by picker persona only,
  // and walkthrough scenarios where a tester views inbox/profile chat AS a
  // non-picker persona (Petra, Shawn, Nikola) see empty results — even
  // though the conversation exists. The earlier comment about avoiding
  // useCurrentUser referenced an older implementation that used
  // useSearchParams; the current version uses usePathname +
  // window.location.search, which doesn't need a Suspense boundary.
  // Pricing & Proposals walkthrough 2026-05-05.
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
          serviceType: service ?? "walks_checkins",
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

  const getOrCreateServiceConversation = useCallback(
    (
      provider: ProviderInfo,
      service: ServiceType,
      sub?: string | null,
    ): string => {
      // Single thread per (owner, provider) per the booking-flow design.
      // All state reads happen inside the functional setConversations
      // callback so this useCallback doesn't have to depend on the
      // conversations array — important for callers that invoke this in a
      // useEffect (avoids infinite render loops). Discover & Care G1.
      const me = currentUser.id;
      // Include owner in the ID — `${provider.id}-conv` collided with
      // legacy seed data that used the provider-only pattern (e.g. Shawn's
      // pre-seeded `klara-conv`). The owner-prefixed form matches the
      // newer seeded pattern (`daniel-klara-conv`, etc.) and is collision-
      // safe across personas. G3 fix 2026-05-04.
      const newId = `${me}-${provider.id}-conv`;
      let resolvedId = newId;
      setConversations((prev) => {
        const existing = prev.find(
          (c) =>
            (c.ownerId === me && c.providerId === provider.id) ||
            (c.providerId === me && c.ownerId === provider.id),
        );
        if (existing) {
          resolvedId = existing.id;
          // Idempotency: if the existing inquiry already matches the
          // requested service, skip the state update so this callback is
          // safe to call repeatedly.
          if (
            existing.conversationType === "booking" &&
            existing.inquiry.serviceType === service &&
            existing.inquiry.subService === (sub ?? null)
          ) {
            return prev;
          }
          return prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  conversationType: "booking",
                  inquiry: {
                    ...c.inquiry,
                    serviceType: service,
                    subService: sub ?? null,
                  },
                }
              : c,
          );
        }
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
            serviceType: service,
            subService: sub ?? null,
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
        return [newConv, ...prev];
      });
      return resolvedId;
    },
    [
      currentUser.id,
      currentUser.avatarUrl,
      currentUser.pets,
      currentUserFullName,
    ],
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
          serviceType: "walks_checkins",
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
      // Stamp signedAt automatically when a proposal flips to `accepted`.
      // Single source of truth — every call site lands the timestamp,
      // so the proposal card's accepted footer can render "Signed HH:MM"
      // without each caller threading the value separately.
      const stampedAt = status === "accepted" ? new Date().toISOString() : undefined;
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === msgId && m.proposal
                ? {
                    ...m,
                    proposal: {
                      ...m.proposal,
                      status,
                      ...(stampedAt ? { signedAt: stampedAt } : {}),
                    },
                  }
                : m
            ),
          };
        })
      );
    },
    []
  );

  const updateInquiryStatus = useCallback(
    (convId: string, msgId: string, status: InquiryStatus) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === msgId && m.inquiry
                ? { ...m, inquiry: { ...m.inquiry, status } }
                : m,
            ),
          };
        }),
      );
    },
    [],
  );

  const declineInquiry = useCallback(
    (convId: string, msgId: string, reason?: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === msgId && m.inquiry
                ? {
                    ...m,
                    inquiry: {
                      ...m.inquiry,
                      status: "declined",
                      declineReason: reason && reason.length > 0 ? reason : undefined,
                    },
                  }
                : m,
            ),
          };
        }),
      );
    },
    [],
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
        getOrCreateServiceConversation,
        addMessage,
        updateInquiry,
        updateProposalStatus,
        updateInquiryStatus,
        declineInquiry,
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

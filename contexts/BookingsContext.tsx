"use client";

import { createContext, useContext, useCallback } from "react";
import { mockBookings } from "@/lib/mockBookings";
import type { Booking, ContractStatus, BookingSession } from "@/lib/types";
import { usePersistedState } from "@/lib/usePersistedState";

// ── Context value ───────────────────────────────────────────────────────────────

interface BookingsContextValue {
  bookings: Booking[];
  getBooking: (id: string) => Booking | undefined;
  getBookingByConversation: (conversationId: string) => Booking | undefined;
  updateStatus: (bookingId: string, status: ContractStatus) => void;
  addSession: (bookingId: string, session: BookingSession) => void;
  updateSession: (bookingId: string, sessionId: string, update: Partial<BookingSession>) => void;
  /** Creates a new booking and returns its generated id */
  createBooking: (data: Omit<Booking, "id" | "signedAt">) => string;
  /**
   * Upsert a `proposed`-status booking for a conversation. If a booking
   * already exists for that conversation, its proposal-derived fields
   * (dates, price, schedule, status) are refreshed in place — used by the
   * counter flow so multiple proposals don't spawn multiple booking
   * records. Returns the booking id (existing or newly created).
   * Discover & Care G5, 2026-05-02.
   */
  upsertProposedBooking: (data: Omit<Booking, "id" | "signedAt">) => string;
  cancelBooking: (bookingId: string, reason?: string) => void;
  updatePaymentStatus: (bookingId: string, status: "unpaid" | "paid") => void;
}

// ── Context ─────────────────────────────────────────────────────────────────────

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

// ── Provider ────────────────────────────────────────────────────────────────────

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  // Persisted across reloads so signed contracts, proposed bookings, and
  // session updates survive navigation. See `lib/usePersistedState.ts`.
  const [bookings, setBookings] = usePersistedState<Booking[]>(
    "doggo-bookings",
    mockBookings,
  );

  const getBooking = useCallback(
    (id: string) => bookings.find((b) => b.id === id),
    [bookings]
  );

  const getBookingByConversation = useCallback(
    (conversationId: string) =>
      bookings.find((b) => b.conversationId === conversationId),
    [bookings]
  );

  const updateStatus = useCallback((bookingId: string, status: ContractStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  }, []);

  const addSession = useCallback((bookingId: string, session: BookingSession) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, sessions: [...(b.sessions ?? []), session] }
          : b
      )
    );
  }, []);

  const createBooking = useCallback((data: Omit<Booking, "id" | "signedAt">): string => {
    const id = `booking-${Date.now()}`;
    const newBooking: Booking = {
      ...data,
      id,
      signedAt: new Date().toISOString(),
    };
    setBookings((prev) => [...prev, newBooking]);
    return id;
  }, []);

  const upsertProposedBooking = useCallback(
    (data: Omit<Booking, "id" | "signedAt">): string => {
      let resolvedId = "";
      setBookings((prev) => {
        const existing = data.conversationId
          ? prev.find((b) => b.conversationId === data.conversationId)
          : undefined;
        if (existing) {
          resolvedId = existing.id;
          return prev.map((b) =>
            b.id === existing.id
              ? {
                  ...b,
                  // Refresh proposal-derived fields; preserve booking-side
                  // metadata (id, signedAt, sessions, notes) where present.
                  type: data.type,
                  serviceType: data.serviceType,
                  subService: data.subService,
                  pets: data.pets,
                  startDate: data.startDate,
                  endDate: data.endDate,
                  recurringSchedule: data.recurringSchedule,
                  price: data.price,
                  status: data.status,
                }
              : b,
          );
        }
        const id = `booking-${Date.now()}`;
        resolvedId = id;
        const next: Booking = {
          ...data,
          id,
          signedAt: new Date().toISOString(),
        };
        return [...prev, next];
      });
      return resolvedId;
    },
    [],
  );

  const cancelBooking = useCallback((bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: "cancelled" as ContractStatus, cancellationReason: reason }
          : b
      )
    );
  }, []);

  const updatePaymentStatus = useCallback((bookingId: string, status: "unpaid" | "paid") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus: status } : b))
    );
  }, []);

  const updateSession = useCallback(
    (bookingId: string, sessionId: string, update: Partial<BookingSession>) => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            sessions: (b.sessions ?? []).map((s) =>
              s.id === sessionId ? { ...s, ...update } : s
            ),
          };
        })
      );
    },
    []
  );

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        getBooking,
        getBookingByConversation,
        updateStatus,
        addSession,
        updateSession,
        createBooking,
        upsertProposedBooking,
        cancelBooking,
        updatePaymentStatus,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────────────────────────

export function useBookings(): BookingsContextValue {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}

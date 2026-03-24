"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { mockBookings } from "@/lib/mockBookings";
import type { Booking, ContractStatus, BookingSession } from "@/lib/types";

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
  cancelBooking: (bookingId: string, reason?: string) => void;
  updatePaymentStatus: (bookingId: string, status: "unpaid" | "paid") => void;
}

// ── Context ─────────────────────────────────────────────────────────────────────

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

// ── Provider ────────────────────────────────────────────────────────────────────

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

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

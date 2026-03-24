"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CaretLeft,
  CreditCard,
  CheckCircle,
  PawPrint,
  CalendarDots,
  Dog,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useBookings } from "@/contexts/BookingsContext";
import { calculatePaymentSummary } from "@/lib/pricing";
import { SERVICE_LABELS } from "@/lib/constants/services";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  const { getBooking, updatePaymentStatus } = useBookings();
  const booking = getBooking(bookingId);
  const [paid, setPaid] = useState(false);

  if (!booking) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Booking not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/bookings")}>
          Back to bookings
        </ButtonAction>
      </div>
    );
  }

  const payment = calculatePaymentSummary(booking.price);

  function handlePay() {
    updatePaymentStatus(bookingId, "paid");
    setPaid(true);
  }

  // Date display
  const startDate = new Date(booking.startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const endDate = booking.endDate
    ? new Date(booking.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  if (paid) {
    return (
      <div
        className="flex flex-col items-center gap-xl p-xl bg-surface-base w-full"
        style={{
          maxWidth: 540,
          margin: "0 auto",
          minHeight: "calc(100vh - var(--nav-height))",
        }}
      >
        <div className="flex flex-col items-center gap-lg text-center mt-4xl">
          <div
            className="flex items-center justify-center rounded-full w-16 h-16 bg-success-light"
          >
            <CheckCircle size={36} weight="fill" className="text-success" />
          </div>
          <h1 className="font-heading text-2xl font-semibold text-fg-primary">
            Booking confirmed & paid
          </h1>
          <p className="text-sm text-fg-secondary">
            {payment.total.toLocaleString()} Kč paid to {booking.carerName} for{" "}
            {SERVICE_LABELS[booking.serviceType].toLowerCase()}.
          </p>
        </div>

        <div className="flex flex-col gap-sm w-full">
          <ButtonAction variant="primary" size="md" href={`/bookings/${bookingId}`}>
            View booking details
          </ButtonAction>
          <ButtonAction variant="tertiary" size="md" href="/home">
            Back to Home
          </ButtonAction>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-xl p-xl bg-surface-base w-full"
      style={{
        maxWidth: 540,
        margin: "0 auto",
        minHeight: "calc(100vh - var(--nav-height))",
      }}
    >
      {/* Back nav */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-xs text-sm text-fg-secondary bg-transparent border-none cursor-pointer p-0"
      >
        <CaretLeft size={16} weight="bold" /> Back to booking
      </button>

      <h1 className="font-heading text-2xl font-semibold text-fg-primary">
        Checkout
      </h1>

      {/* Summary card */}
      <section
        className="flex flex-col gap-md rounded-panel p-lg bg-surface-top border border-edge-light"
      >
        {/* Carer */}
        <div className="flex items-center gap-md">
          <img
            src={booking.carerAvatarUrl}
            alt={booking.carerName}
            className="rounded-full w-11 h-11 object-cover"
          />
          <div className="flex flex-col gap-xs">
            <span className="text-sm font-semibold text-fg-primary">{booking.carerName}</span>
            <span
              className="inline-flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong self-start"
            >
              <PawPrint size={10} weight="fill" />
              {SERVICE_LABELS[booking.serviceType]}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-xs text-sm text-fg-secondary">
          <span className="flex items-center gap-xs">
            <Dog size={14} weight="light" />
            {booking.pets.join(", ")}
          </span>
          <span className="flex items-center gap-xs">
            <CalendarDots size={14} weight="light" />
            {startDate}{endDate ? ` – ${endDate}` : ""}
            {booking.recurringSchedule && (
              <> · {booking.recurringSchedule.days.join(", ")} {booking.recurringSchedule.timeLabel}</>
            )}
          </span>
        </div>
      </section>

      {/* Price breakdown */}
      <section
        className="flex flex-col gap-md rounded-panel p-lg bg-surface-top border border-edge-light"
      >
        <h2 className="text-sm font-semibold text-fg-primary">Price breakdown</h2>

        <div className="flex flex-col gap-sm">
          {payment.lineItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={`text-sm ${item.isModifier ? "text-fg-tertiary" : "text-fg-secondary"}`}>
                {item.isModifier ? `+ ${item.label}` : item.label}
              </span>
              <span className="text-sm text-fg-primary">
                {item.amount.toLocaleString()} Kč
                <span className="text-xs text-fg-tertiary"> / {item.unit}</span>
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-between pt-sm border-t border-edge-light"
        >
          <span className="text-sm text-fg-secondary">Subtotal</span>
          <span className="text-sm font-medium text-fg-primary">{booking.price.total.toLocaleString()} Kč</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-fg-tertiary">
            Platform fee ({payment.platformFeePercent}%)
          </span>
          <span className="text-sm text-fg-tertiary">{payment.platformFeeAmount.toLocaleString()} Kč</span>
        </div>

        <div
          className="flex items-center justify-between pt-sm border-t border-edge-regular"
        >
          <span className="text-sm font-semibold text-fg-primary">Total</span>
          <span className="text-lg font-semibold text-fg-primary">{payment.total.toLocaleString()} Kč</span>
        </div>
      </section>

      {/* Payment method */}
      <section
        className="flex flex-col gap-md rounded-panel p-lg bg-surface-top border border-edge-light"
      >
        <h2 className="text-sm font-semibold text-fg-primary">Payment method</h2>

        <label className="flex items-center gap-md rounded-panel p-md border-2 border-brand-main bg-brand-subtle cursor-pointer">
          <input type="radio" name="payment" defaultChecked style={{ accentColor: "var(--brand-main)" }} />
          <CreditCard size={20} weight="light" className="text-brand-main" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg-primary">Visa ending in 4242</span>
            <span className="text-xs text-fg-tertiary">Expires 12/28</span>
          </div>
        </label>

        <label className="flex items-center gap-md rounded-panel p-md border border-edge-light opacity-50 cursor-not-allowed">
          <input type="radio" name="payment" disabled />
          <CreditCard size={20} weight="light" className="text-fg-tertiary" />
          <span className="text-sm text-fg-tertiary">Add payment method</span>
        </label>
      </section>

      {/* Pay button */}
      <ButtonAction variant="primary" size="lg" onClick={handlePay}>
        Pay {payment.total.toLocaleString()} Kč
      </ButtonAction>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { DateTrigger, DatePicker } from "@/components/ui/DatePicker";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useBookings } from "@/contexts/BookingsContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { PetProfile, ShelterProfile } from "@/lib/types";

/**
 * WalkBookingSheet — a vouched walker books a solo walk with a specific
 * shelter dog (Cross-Shelter Mentor Network G1, 2026-06-09). This is the
 * real surface behind what `Log walk (demo)` used to fake (P77): the
 * walk lands as a Booking with `ownerKind: "shelter"` — the shelter is
 * the "owner" party, the walker is the carer — so Schedule/Bookings and
 * the Sessions flow (Start → Finish → Visit Report) all run on existing
 * rails. Completed walks feed tier escalation at read time
 * (`countCompletedShelterWalks`).
 *
 * Volunteer walks are unpaid: price total 0, labeled as volunteer work,
 * never rendered as "0 Kč" (BookingRow branches on ownerKind).
 */
export function WalkBookingSheet({
  open,
  onClose,
  shelter,
  dog,
}: {
  open: boolean;
  onClose: () => void;
  shelter: ShelterProfile;
  dog: PetProfile;
}) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { createBooking } = useBookings();

  const [date, setDate] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setDate(null);
    }
  }, [open]);

  const canSubmit = date !== null;

  function handleSubmit() {
    if (!date) return;
    createBooking({
      conversationId: null,
      ownerKind: "shelter",
      ownerId: shelter.id,
      ownerName: shelter.name,
      ownerAvatarUrl: shelter.logoUrl,
      carerId: currentUser.id,
      carerName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      carerAvatarUrl: currentUser.avatarUrl ?? "",
      type: "one_off",
      serviceType: "walks_checkins",
      subService: "Solo walk",
      pets: [dog.name],
      startDate: date,
      endDate: date,
      price: {
        lineItems: [
          { label: `Volunteer walk · ${dog.name}`, amount: 0, unit: "volunteer" },
        ],
        total: 0,
        currency: "Kč",
        billingCycle: "total",
      },
      status: "upcoming",
      sessions: [
        {
          id: `shelter-walk-${Date.now()}`,
          date,
          status: "upcoming",
        },
      ],
    });
    setSubmitted(true);
  }

  return (
    <ModalSheet open={open} onClose={onClose} title={`Walk ${dog.name}`}>
      {submitted ? (
        <div className="inquiry-form-success">
          <CheckCircle size={40} weight="fill" className="inquiry-form-success-icon" />
          <p className="inquiry-form-success-title">Walk booked</p>
          <p className="inquiry-form-success-sub">
            {dog.name} is on your schedule. Check in at {shelter.name} when you
            arrive — start the session from the booking to log the walk.
          </p>
          <ButtonAction
            variant="primary"
            size="md"
            cta
            className="mt-md"
            rightIcon={<ArrowRight size={16} weight="bold" />}
            onClick={() => {
              onClose();
              // Shelter walks live on the Volunteering tab (shelter-dog
              // activity, pulled out of the paid Care/Services tabs) — route
              // there or the walk you just booked looks missing.
              router.push("/bookings?tab=volunteering");
            }}
          >
            See your bookings
          </ButtonAction>
        </div>
      ) : (
        <div className="inbox-inquiry-form">
          <div className="flex items-center gap-md border-b border-edge-regular pb-md">
            <img
              src={dog.imageUrl}
              alt={dog.name}
              className="rounded-dog object-cover shrink-0"
              style={{ width: 56, height: 56 }}
            />
            <div className="flex flex-col gap-xs min-w-0">
              <span className="font-semibold text-fg-primary">Solo walk with {dog.name}</span>
              <span className="text-sm text-fg-tertiary">
                {shelter.name} · volunteer walk, no charge
              </span>
            </div>
          </div>

          {shelter.policy.vouchingNote && (
            <p className="text-sm text-fg-secondary m-0">
              <em>{shelter.policy.vouchingNote}</em>
            </p>
          )}

          <div className="filter-field">
            <div className="label">Date</div>
            <DateTrigger
              label="Pick a date"
              value={date}
              onClick={() => setDatePickerOpen(true)}
            />
            <DatePicker
              mode="single"
              open={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              value={date}
              onChange={(iso) => {
                setDate(iso);
                setDatePickerOpen(false);
              }}
              title="Walk date"
            />
          </div>

          <button className="inq-submit" disabled={!canSubmit} onClick={handleSubmit}>
            Book the walk →
          </button>
        </div>
      )}
    </ModalSheet>
  );
}

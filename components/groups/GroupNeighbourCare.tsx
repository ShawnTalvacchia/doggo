"use client";

/**
 * GroupNeighbourCare — the "Care from neighbours" section on a group's
 * Members tab. Demo Narrative V2, Workstream W5 (the private-group
 * mutual-care concept).
 *
 * Inside a neighbour circle, members offer care to one another. This section
 * makes a member's care offering legible *to fellow members* — group
 * co-membership is the visibility grant. That lets a member discover and book
 * a circle-scoped Carer (one whose `carerProfile.publicProfile` is `false`,
 * so they never appear in `/discover/care`) without being 1:1 Connected to
 * them. Booking routes through the same Care inquiry flow as the marketplace
 * (`InquiryFormModal`) — the same machinery, reached through the circle.
 *
 * Renders nothing for: guests / non-members (co-membership is the grant),
 * Care groups (those already foreground their providers via the hero), or
 * groups with no member-carers.
 */

import { useState } from "react";
import { getUserById } from "@/lib/mockUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { SectionHeader } from "@/components/profile/SectionHeader";
import { PersonRow } from "@/components/people/PersonRow";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { InquiryFormModal } from "@/components/messaging/InquiryFormModal";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Group, CarerCareServiceConfig } from "@/lib/types";

type MemberCarer = {
  id: string;
  name: string;
  avatarUrl: string;
  pets: { name: string }[];
  service: CarerCareServiceConfig;
};

export function GroupNeighbourCare({ group }: { group: Group }) {
  const viewer = useCurrentUser();
  const [booking, setBooking] = useState<MemberCarer | null>(null);

  // Care groups already foreground their providers — this section is for the
  // neighbour / park / interest circles.
  if (group.groupType === "care") return null;

  // Co-membership is the visibility grant: only members see the circle's care.
  const isMember = group.members.some((m) => m.userId === viewer.id);
  if (!isMember) return null;

  const carers: MemberCarer[] = [];
  for (const m of group.members) {
    if (m.userId === viewer.id) continue;
    const user = getUserById(m.userId);
    const service = user?.carerProfile?.services.find(
      (s): s is CarerCareServiceConfig => s.kind === "care" && s.enabled,
    );
    if (user && service) {
      carers.push({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
        pets: user.pets.map((p) => ({ name: p.name })),
        service,
      });
    }
  }
  if (carers.length === 0) return null;

  return (
    <LayoutSection>
      <section className="flex flex-col gap-md">
        <SectionHeader title="Care from neighbours" />
        <p className="text-sm text-fg-secondary">
          Members of this circle who&rsquo;ll help with your dog — at
          neighbourly rates, because you already know each other.
        </p>
        <div className="flex flex-col gap-sm">
          {carers.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-sm rounded-panel border border-edge-regular p-md"
            >
              <PersonRow
                variant="group-member"
                userId={c.id}
                name={c.name}
                avatarUrl={c.avatarUrl}
                pets={c.pets}
                connectionState="none"
                actions={[]}
              />
              <div className="flex items-center justify-between gap-sm">
                <span className="text-sm text-fg-secondary">
                  {SERVICE_LABELS[c.service.serviceType]} · from{" "}
                  {c.service.pricePerUnit} Kč
                </span>
                <ButtonAction
                  variant="primary"
                  size="sm"
                  onClick={() => setBooking(c)}
                >
                  Book
                </ButtonAction>
              </div>
            </div>
          ))}
        </div>
      </section>
      {booking && (
        <InquiryFormModal
          open
          onClose={() => setBooking(null)}
          provider={{
            id: booking.id,
            name: booking.name,
            avatarUrl: booking.avatarUrl,
          }}
          service={booking.service.serviceType}
          subService={null}
        />
      )}
    </LayoutSection>
  );
}

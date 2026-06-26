"use client";

/**
 * ShelterAdoptionsPanel — the operator's adoption-interest landing (Phase 2
 * "The Shelter's Side", 2026-06-24). The genuinely-missing operator surface:
 * the adoption stages exist (`useAdoptionStore` + `PetProfile.adoptionStatus`)
 * but nowhere did the shelter SEE who's interested in which dog. This lists
 * dogs with live interest and lets the operator move the funnel forward —
 * arrange a meet-and-greet, then finalise — as honest demo state-toggles.
 *
 * The advocacy loop is the thesis: interest mostly comes from someone seeing a
 * walk recap, not from the adopter walking the dog themselves. The panel names
 * that so the operator reads "the walks are doing the adoption work."
 */

import Link from "next/link";
import { Heart, CalendarCheck, House, PawPrint } from "@phosphor-icons/react";
import type { AdoptionStage } from "@/lib/useAdoptionStore";
import { useAdoptionStore } from "@/lib/useAdoptionStore";
import type { PetProfile, ShelterProfile } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";

type DogInterest = {
  dog: PetProfile;
  stage: AdoptionStage;
  adopterName?: string;
};

export function ShelterAdoptionsPanel({ shelter }: { shelter: ShelterProfile }) {
  const { getStage, setStage } = useAdoptionStore();

  // Combine live store interest with any statically-pending dogs (e.g. Káťa).
  const interests: DogInterest[] = [];
  for (const dog of shelter.dogs) {
    const entry = getStage(dog.id);
    const stage: AdoptionStage | undefined =
      entry?.stage ?? (dog.adoptionStatus === "pending" ? "pending" : undefined);
    if (!stage || stage === "adopted") continue;
    interests.push({ dog, stage, adopterName: entry?.adopterName });
  }
  // Pending (meet-and-greet booked) ahead of plain interest.
  interests.sort((a, b) => (a.stage === "pending" ? -1 : 1) - (b.stage === "pending" ? -1 : 1));

  if (interests.length === 0) {
    return (
      <div className="px-lg py-xl">
        <EmptyState
          icon={<Heart size={32} weight="light" />}
          title="No adoption interest yet"
          subtitle="When a walker or someone who saw a walk recap asks about a dog, they show up here."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md p-md">
      <p className="m-0 text-xs text-fg-tertiary">
        Most interest comes from someone seeing a walk recap, not from the adopter walking the dog
        themselves. The walks do the work.
      </p>
      {interests.map(({ dog, stage, adopterName }) => (
        <div
          key={dog.id}
          className="flex flex-col gap-sm rounded-panel border border-edge-regular bg-surface-top p-md"
        >
          <div className="flex items-center gap-sm">
            {dog.imageUrl ? (
              <Link href={`/dogs/${dog.id}`} className="flex-shrink-0">
                <img src={dog.imageUrl} alt="" className="h-11 w-11 rounded-md object-cover" />
              </Link>
            ) : (
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-surface-inset">
                <PawPrint size={18} weight="light" className="text-fg-tertiary" />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-fg-primary">{dog.name}</span>
              <span className="truncate text-xs text-fg-secondary">
                {stage === "pending"
                  ? adopterName
                    ? `Meet-and-greet with ${adopterName}`
                    : "Meet-and-greet arranged"
                  : adopterName
                    ? `${adopterName} is interested`
                    : "Someone is interested"}
              </span>
            </div>
            {stage === "pending" ? (
              <span className="flex flex-shrink-0 items-center gap-tiny rounded-pill bg-volunteer-light px-sm py-tiny text-xs font-medium text-volunteer-strong">
                <CalendarCheck size={12} weight="fill" /> Pending
              </span>
            ) : (
              <span className="flex flex-shrink-0 items-center gap-tiny rounded-pill bg-surface-inset px-sm py-tiny text-xs font-medium text-fg-secondary">
                <Heart size={12} weight="fill" /> Interested
              </span>
            )}
          </div>

          <div className="flex items-center gap-sm">
            {stage === "interested" ? (
              <ButtonAction
                variant="secondary"
                size="sm"
                className="w-full"
                leftIcon={<CalendarCheck size={14} weight="bold" />}
                onClick={() => setStage(dog.id, "pending", adopterName)}
              >
                Arrange meet-and-greet
              </ButtonAction>
            ) : (
              <ButtonAction
                variant="secondary"
                size="sm"
                className="w-full"
                leftIcon={<House size={14} weight="bold" />}
                onClick={() => setStage(dog.id, "adopted", adopterName)}
              >
                Finalise adoption
              </ButtonAction>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

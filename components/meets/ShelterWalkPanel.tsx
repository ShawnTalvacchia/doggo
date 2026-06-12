"use client";

/**
 * The FC18 group-shelter-walk panel (Adoption-Curious Journey, 2026-06-12;
 * reframed 2026-06-12 to the mixed-walk model per PO feedback).
 *
 * Renders on a Meet's details tab when `meet.shelterWalk` is set. The walk is
 * a MIXED community walk: most people bring their own dog; vouched walkers can
 * swing by the linked shelter and bring one of its dogs along too; and
 * dogless newcomers are welcome to come along. So this panel stays SLIM — the
 * concept, a light count of shelter dogs joining, and the one conversion CTA.
 * The full who's-walking-what roster lives on the **People tab** (each row
 * badges a shelter dog via `contextLine`), not here — the details panel was
 * overloaded when it tried to be the roster.
 *
 * The conversion is the green→violet funnel boundary: an un-vouched viewer
 * sees "walk with a mentor" (the group walk is the warm top-of-funnel,
 * mentorship is how you graduate to bringing a shelter dog yourself). The
 * shelter's `groupWalksPermitted` policy is what allows shelter dogs to join;
 * per-dog overrides still gate genuinely-difficult dogs (strictest rule wins).
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint, GraduationCap } from "@phosphor-icons/react";
import type { Meet } from "@/lib/types";
import { getShelterById, getShelterDogByName } from "@/lib/mockShelters";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { ButtonAction } from "@/components/ui/ButtonAction";

export function ShelterWalkPanel({ meet }: { meet: Meet }) {
  const shelter = meet.shelterWalk ? getShelterById(meet.shelterWalk.shelterId) : undefined;
  const currentUserId = useCurrentUserId();
  const { getApplication } = useWalkerApplications();
  const router = useRouter();

  if (!shelter) return null;

  // Vouched at this shelter? Static roster OR a vouched dynamic application
  // (the demo can advance a walker to vouched via the hidden affordance).
  const isVouched =
    shelter.walkers.some((w) => w.userId === currentUserId) ||
    getApplication(currentUserId, shelter.id)?.state === "vouched";

  // How many shelter dogs are joining this week (attendees whose dog resolves
  // on the shelter roster). Owned dogs don't count.
  const shelterDogCount = meet.attendees.filter((a) =>
    (a.dogNames ?? []).some((name) => !!getShelterDogByName(shelter.id, name)),
  ).length;

  return (
    <div className="flex flex-col gap-sm rounded-panel border border-edge-regular bg-surface-top p-md mb-md">
      <div className="flex items-center gap-xs text-sm text-info-strong">
        <PawPrint size={16} weight="fill" className="shrink-0" />
        {shelterDogCount > 0 ? (
          <span>
            {shelterDogCount}{" "}
            <Link href={`/shelters/${shelter.id}`} className="font-semibold underline">
              {shelter.name}
            </Link>{" "}
            dog{shelterDogCount === 1 ? "" : "s"} joining this week — see who's
            walking whom on the People tab.
          </span>
        ) : (
          <span>
            Vouched walkers can bring a dog from{" "}
            <Link href={`/shelters/${shelter.id}`} className="font-semibold underline">
              {shelter.name}
            </Link>{" "}
            along.
          </span>
        )}
      </div>

      {/* The conversion — the green→violet funnel boundary. */}
      {!isVouched && (
        <ButtonAction
          variant="volunteer"
          size="sm"
          leftIcon={<GraduationCap size={16} weight="bold" />}
          onClick={() => router.push(`/shelters/${shelter.id}`)}
        >
          New to shelter walking? Walk with a mentor
        </ButtonAction>
      )}
    </div>
  );
}

"use client";

/**
 * The FC18 group-shelter-walk panel (Adoption-Curious Journey, 2026-06-12).
 *
 * Renders on a Meet's details tab when `meet.shelterWalk` is set — the Meet
 * sources its dogs from a shelter roster instead of attendees' homes. It
 * carries the two-tier funnel that makes the group walk strategically
 * load-bearing:
 *
 *  - **Dogs out today** — vouched walkers each take a shelter dog (carried in
 *    `MeetAttendee.dogNames`), shown as walker → dog pairs (dog is tappable).
 *  - **Coming along** — un-vouched newcomers join socially (empty `dogNames`),
 *    no dog to handle yet, no adoption obligation.
 *  - **The conversion** — an un-vouched viewer sees a "walk with a mentor" CTA
 *    (the green→violet boundary): the group walk is the warm top-of-funnel,
 *    mentorship is how you graduate to taking a dog yourself.
 *
 * The shelter's `groupWalksPermitted` policy is what allows this; per-dog
 * overrides still gate genuinely-difficult dogs (strictest rule wins).
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HandHeart, PawPrint, GraduationCap } from "@phosphor-icons/react";
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

  const walkers = meet.attendees.filter((a) => a.dogNames.length > 0);
  const comingAlong = meet.attendees.filter((a) => a.dogNames.length === 0);

  return (
    <div className="flex flex-col gap-md rounded-panel border border-edge-regular bg-surface-top p-md mb-md">
      <div className="flex items-center gap-sm">
        <HandHeart size={20} weight="light" className="text-info-strong shrink-0" />
        <p className="text-sm text-fg-secondary m-0">
          A group walk with dogs from{" "}
          <Link href={`/shelters/${shelter.id}`} className="font-semibold text-fg-primary underline">
            {shelter.name}
          </Link>
          . Vouched walkers each take a dog; everyone's welcome to come along —
          no dog to handle yet, no adoption obligation.
        </p>
      </div>

      {/* Dogs out today — the vouched walker → shelter dog pairs. */}
      {walkers.length > 0 && (
        <div className="flex flex-col gap-sm">
          <p className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide m-0">
            Dogs out today
          </p>
          <div className="flex flex-col gap-sm">
            {walkers.map((a) =>
              a.dogNames.map((dogName) => {
                const dog = getShelterDogByName(shelter.id, dogName);
                const row = (
                  <div className="flex items-center gap-sm">
                    {dog && (
                      <img
                        src={dog.imageUrl}
                        alt={dogName}
                        className="w-9 h-9 rounded-sm object-cover shrink-0"
                      />
                    )}
                    <span className="text-sm text-fg-primary">
                      <span className="font-semibold">{dogName}</span>
                      <span className="text-fg-tertiary"> with {a.userName}</span>
                    </span>
                  </div>
                );
                return dog ? (
                  <Link key={`${a.userId}-${dogName}`} href={`/dogs/${dog.id}`} className="no-underline">
                    {row}
                  </Link>
                ) : (
                  <div key={`${a.userId}-${dogName}`}>{row}</div>
                );
              }),
            )}
          </div>
        </div>
      )}

      {/* Coming along — un-vouched newcomers, here to meet the dogs. */}
      {comingAlong.length > 0 && (
        <div className="flex flex-col gap-xs">
          <p className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide m-0">
            Coming along
          </p>
          <div className="flex items-center gap-sm flex-wrap">
            {comingAlong.map((a) => (
              <div key={a.userId} className="flex items-center gap-xs">
                <img src={a.avatarUrl} alt={a.userName} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-sm text-fg-secondary">{a.userName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The conversion — the green→violet funnel boundary. */}
      {isVouched ? (
        <div className="flex items-center gap-xs text-sm text-info-strong">
          <PawPrint size={16} weight="fill" className="shrink-0" />
          You're vouched at {shelter.name} — collect a dog when you arrive.
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          <p className="text-sm text-fg-secondary m-0">
            Want to take a dog out yourself next time? A few mentored walks and
            you're vouched to walk solo.
          </p>
          <ButtonAction
            variant="volunteer"
            size="sm"
            leftIcon={<GraduationCap size={16} weight="bold" />}
            onClick={() => router.push(`/shelters/${shelter.id}`)}
          >
            Walk with a mentor
          </ButtonAction>
        </div>
      )}
    </div>
  );
}

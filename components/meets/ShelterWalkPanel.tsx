"use client";

/**
 * The FC18 group-shelter-walk panel (Adoption-Curious Journey, 2026-06-12;
 * reframed to the mixed-walk model + restyled to the "Who's coming" summary-
 * card pattern per PO feedback, 2026-06-12).
 *
 * Renders on a Meet's details tab when `meet.shelterWalk` is set. The walk is
 * a MIXED community walk: most people bring their own dog; vouched walkers can
 * swing by the linked shelter and bring one of its dogs along too; dogless
 * newcomers come along. This panel is the shelter-dog counterpart to the
 * "Who's coming" attendee summary — a `.meet-summary-card` with the shelter
 * dogs' faces on the left (rounded squares, Avatar Rule B), a count, and the
 * names, "View all" → People tab (where the who-walks-whom pairing lives).
 * Below it, the one conversion CTA — the green→violet funnel boundary: an
 * un-vouched viewer sees "walk with a mentor" (the group walk is the warm
 * top-of-funnel; mentorship is how you graduate to bringing a dog yourself).
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap } from "@phosphor-icons/react";
import type { Meet } from "@/lib/types";
import { getShelterById, getShelterDogByName } from "@/lib/mockShelters";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { ButtonAction } from "@/components/ui/ButtonAction";

/** "Nora" / "Nora and Šimon" / "Nora, Šimon and Tonda" / "Nora, Šimon +2". */
function formatDogList(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`;
  return `${names[0]}, ${names[1]} +${names.length - 2}`;
}

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

  // Shelter dogs joining this week — every attendee dog that resolves on the
  // shelter roster (owned dogs don't appear here).
  const shelterDogs = meet.attendees.flatMap((a) =>
    (a.dogNames ?? [])
      .map((name) => getShelterDogByName(shelter.id, name))
      .filter((d): d is NonNullable<typeof d> => !!d),
  );

  const mentorCta = !isVouched && (
    <ButtonAction
      variant="volunteer"
      size="sm"
      leftIcon={<GraduationCap size={16} weight="bold" />}
      onClick={() => router.push(`/shelters/${shelter.id}`)}
    >
      New to shelter walking? Walk with a mentor
    </ButtonAction>
  );

  // No shelter dogs on this occurrence — fall back to a one-line invitation
  // + the CTA (no avatar card to show).
  if (shelterDogs.length === 0) {
    return (
      <section className="meet-section flex flex-col gap-sm">
        <p className="text-sm text-fg-secondary m-0">
          Vouched walkers can bring a dog from{" "}
          <Link href={`/shelters/${shelter.id}`} className="font-semibold text-fg-primary underline">
            {shelter.name}
          </Link>{" "}
          along on the walk.
        </p>
        {mentorCta}
      </section>
    );
  }

  return (
    <section className="meet-section flex flex-col gap-sm">
      <div className="meet-section-header">
        <h2 className="meet-section-title">Shelter dogs joining</h2>
        <Link
          href={`/meets/${meet.id}?tab=people`}
          className="text-xs font-medium text-brand-main"
          style={{ textDecoration: "none" }}
        >
          View all
        </Link>
      </div>

      <div className="meet-summary-card">
        <div className="meet-summary-row">
          <div className="meet-summary-avatars">
            {shelterDogs.slice(0, 4).map((dog) => (
              <img
                key={dog.id}
                src={dog.imageUrl}
                alt={dog.name}
                className="meet-summary-avatar meet-summary-avatar--dog"
              />
            ))}
          </div>
          <div className="meet-summary-meta">
            <span className="meet-summary-count">
              {shelterDogs.length} from {shelter.name}
            </span>
            <span className="meet-summary-trust">
              {formatDogList(shelterDogs.map((d) => d.name))} joining — brought
              along by vouched walkers, out for a walk in good company.
            </span>
          </div>
        </div>
      </div>

      {mentorCta}
    </section>
  );
}

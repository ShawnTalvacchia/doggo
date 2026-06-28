"use client";

/**
 * ShelterStaysPanel — the middle rung of the commitment ladder (Walks → Stays
 * → Adoptions), Phase 2 "The Shelter's Side", 2026-06-28.
 *
 * A "stay" is "the dog goes home with someone for a while" — a night, a
 * weekend, or a longer trial. Two flavours live here under one queue:
 *   - Sleepover / respite — time away from the noisy shelter, and (the thesis)
 *     a longer walk that produces a richer advocacy moment for the foster's
 *     own network.
 *   - Adoption trial — a serious adopter living with the dog before committing;
 *     the same mechanic, different intent.
 *
 * ILLUSTRATIVE per the phase posture: the requests are seeded representative
 * content (there's no foster/stay data model yet — that's deliberate, pending
 * interview signal on which flavour matters), and the action is an honest stub.
 * The point is to show the shape and provoke the "do you do this today?"
 * conversation, not to wire a foster pipeline.
 */

import Link from "next/link";
import { Moon, Heart, House, PawPrint, CalendarCheck } from "@phosphor-icons/react";
import type { PetProfile, ShelterProfile } from "@/lib/types";
import { useAdoptionStore } from "@/lib/useAdoptionStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useStubNotice } from "@/contexts/StubFeatureContext";

type StayIntent = "respite" | "trial";

type StaySeed = {
  /** Matched to a shelter dog by name; falls back to nothing if absent. */
  dogName?: string;
  personName: string;
  personAvatarUrl?: string;
  intent: StayIntent;
  duration: string;
  note: string;
};

/** Representative inbound stay requests at Útulek. Two flavours on purpose. */
const STAY_SEED: StaySeed[] = [
  {
    personName: "Marie K.",
    personAvatarUrl: "/images/generated/zuzana-profile.jpeg",
    intent: "respite",
    duration: "This weekend (2 nights)",
    note: "Walks here on Saturdays. Happy to give one of the long-stayers a quiet weekend at home.",
  },
  {
    personName: "Tomáš R.",
    personAvatarUrl: "/images/generated/ondrej-profile.jpeg",
    intent: "trial",
    duration: "Two-week trial",
    note: "Saw a walk recap and would like to try living together before adopting.",
  },
];

const INTENT_LABEL: Record<StayIntent, string> = {
  respite: "Sleepover",
  trial: "Adoption trial",
};

export function ShelterStaysPanel({ shelter }: { shelter: ShelterProfile }) {
  const { getStage } = useAdoptionStore();
  const { notify: notifyStub } = useStubNotice();

  // Attach each seeded request to a real dog (skip adopted ones) so the rows
  // render with a genuine dog + photo. Assigned by order; no live data model.
  const activeDogs = shelter.dogs.filter(
    (d) => getStage(d.id)?.stage !== "adopted" && d.adoptionStatus !== "adopted",
  );
  const requests = STAY_SEED.map((seed, i) => ({
    seed,
    dog: activeDogs[i] as PetProfile | undefined,
  })).filter((r) => r.dog);

  if (requests.length === 0) {
    return (
      <div className="px-lg py-xl">
        <EmptyState
          icon={<House size={32} weight="light" />}
          title="No stay requests yet"
          subtitle="When someone offers a sleepover or asks for an adoption trial, it shows up here."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md p-md">
      <p className="m-0 text-xs text-fg-tertiary">
        A stay is a dog going home for a while: a weekend away from the noise, or a trial before
        adopting. Time at home makes the next walk recap a richer story.
      </p>
      {requests.map(({ seed, dog }) => (
        <div
          key={seed.personName}
          className="flex flex-col gap-sm rounded-panel border border-edge-regular bg-surface-top p-md"
        >
          <div className="flex items-center gap-sm">
            {seed.personAvatarUrl ? (
              <img
                src={seed.personAvatarUrl}
                alt=""
                className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface-inset">
                <PawPrint size={18} weight="light" className="text-fg-tertiary" />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-tiny">
              <span className="flex items-center gap-xs">
                <span className="truncate text-sm font-semibold text-fg-primary">
                  {seed.personName}
                </span>
                <IntentChip intent={seed.intent} />
              </span>
              <span className="flex items-center gap-xs truncate text-xs text-fg-secondary">
                {dog!.imageUrl && (
                  <Link href={`/dogs/${dog!.id}`} className="flex-shrink-0">
                    <img src={dog!.imageUrl} alt="" className="h-5 w-5 rounded-dog object-cover" />
                  </Link>
                )}
                <span className="truncate">
                  {dog!.name} · {seed.duration}
                </span>
              </span>
            </div>
          </div>

          <p className="m-0 rounded-sm border border-edge-regular bg-surface-base px-md py-sm text-sm text-fg-secondary">
            &ldquo;{seed.note}&rdquo;
          </p>

          <ButtonAction
            variant="secondary"
            size="sm"
            className="w-full"
            leftIcon={<CalendarCheck size={14} weight="bold" />}
            onClick={() =>
              notifyStub({
                feature: "Plan a stay",
                note: "Setting up a foster or trial stay (dates, waiver, hand-off) is illustrative for now. It lands with the operator build once interviews tell us which kind of stay matters most.",
              })
            }
          >
            Plan the stay
          </ButtonAction>
        </div>
      ))}
    </div>
  );
}

function IntentChip({ intent }: { intent: StayIntent }) {
  if (intent === "trial") {
    return (
      <span className="flex flex-shrink-0 items-center gap-tiny rounded-pill bg-surface-inset px-sm py-tiny text-xs font-medium text-fg-secondary">
        <Heart size={11} weight="fill" /> {INTENT_LABEL.trial}
      </span>
    );
  }
  return (
    <span className="flex flex-shrink-0 items-center gap-tiny rounded-pill bg-volunteer-light px-sm py-tiny text-xs font-medium text-volunteer-strong">
      <Moon size={11} weight="fill" /> {INTENT_LABEL.respite}
    </span>
  );
}

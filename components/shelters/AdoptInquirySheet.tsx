"use client";

/**
 * The adoption funnel capstone (Adoption-Curious Journey, Workstream E,
 * 2026-06-12). Replaces the stub "Adopt {dog}" CTA (which just routed to the
 * shelter page) with a real, research-faithful flow:
 *
 *  - **De-coupled from commitment.** Expressing interest is not adopting.
 *    Copy says so plainly — the #1 documented friction is people thinking
 *    interest = obligation (Competitive Research — Adoption-Curious Journeys).
 *  - **Shelter curates the meet-and-greet.** Interest routes to the shelter,
 *    which arranges a meet-and-greet — it does NOT auto-match. Matches our
 *    shelter-authority principle.
 *  - **A state machine with non-failure off-ramps.** The escalation ladder
 *    (walk again → sleepover/foster → adopt) is shown as graceful steps, each
 *    a fine place to stop. Returns are framed as the welfare-positive path,
 *    not a failure.
 *
 * Stage persists via `useAdoptionStore` (demo override). The shelter-side
 * advances are honest state-toggles — the real operator surface is FC16. The
 * adopted → new-owner PetProfile migration stays deferred (DR7).
 */

import { Footprints, House, HandHeart, Check, ArrowCounterClockwise } from "@phosphor-icons/react";
import type { PetProfile, ShelterProfile } from "@/lib/types";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useAdoptionStore } from "@/lib/useAdoptionStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function AdoptInquirySheet({
  open,
  onClose,
  dog,
  shelter,
}: {
  open: boolean;
  onClose: () => void;
  dog: PetProfile;
  shelter: ShelterProfile;
}) {
  const { getStage, setStage, clearStage } = useAdoptionStore();
  const currentUser = useCurrentUser();
  const entry = getStage(dog.id);
  const stage = entry?.stage;

  return (
    <ModalSheet open={open} onClose={onClose} title={`Adopt ${dog.name}`}>
      <div className="flex flex-col gap-lg p-md">
        {/* No-obligation framing — always shown, leads the sheet. */}
        <p className="text-sm text-fg-secondary m-0">
          Adopting {dog.name} starts with meeting her — nothing is decided
          today. {shelter.name} arranges a meet-and-greet so you can see how you
          get on, in person and unhurried. There's no obligation until you've
          met her and you're sure.
        </p>

        {/* The escalation ladder — graceful steps, each a fine place to stop. */}
        <div className="flex flex-col gap-sm">
          <p className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide m-0">
            Take it at your pace
          </p>
          <LadderRow
            icon={<Footprints size={18} weight="light" />}
            title="Walk her first"
            body="Spend time with her on a walk or two before anything else. Many people start exactly here."
          />
          <LadderRow
            icon={<House size={18} weight="light" />}
            title="A sleepover or short foster"
            body="Try her at home for a night or a couple of weeks. If it isn't the right fit, bringing her back is a normal, welcome part of the process — never a failure."
          />
          <LadderRow
            icon={<HandHeart size={18} weight="light" />}
            title="Adopt"
            body="When you both know, the shelter helps you make it official."
          />
        </div>

        {/* Stage-aware action / status. */}
        {stage === "adopted" ? (
          <div className="flex items-center gap-sm rounded-panel bg-surface-base p-md text-sm text-fg-primary">
            <Check size={18} weight="bold" className="text-info-strong shrink-0" />
            {dog.name} has found her home{entry?.adopterName ? ` with ${entry.adopterName}` : ""}. 🎉
          </div>
        ) : stage === "pending" ? (
          <div className="flex flex-col gap-xs rounded-panel bg-surface-base p-md">
            <p className="text-sm font-semibold text-fg-primary m-0">
              Meet-and-greet arranged
            </p>
            <p className="text-sm text-fg-secondary m-0">
              {shelter.name} is setting up a time for you to meet {dog.name}.
              You'll hear from them soon. Still no commitment — this is just the
              meeting.
            </p>
          </div>
        ) : stage === "interested" ? (
          <div className="flex flex-col gap-xs rounded-panel bg-surface-base p-md">
            <p className="text-sm font-semibold text-fg-primary m-0">
              Interest sent
            </p>
            <p className="text-sm text-fg-secondary m-0">
              {shelter.name} will be in touch to arrange a meet-and-greet. They
              match each dog thoughtfully, so this is the start of a
              conversation — not a decision.
            </p>
          </div>
        ) : (
          <ButtonAction
            variant="primary"
            size="md"
            leftIcon={<HandHeart size={16} weight="bold" />}
            onClick={() => setStage(dog.id, "interested")}
          >
            Express interest in adopting {dog.name}
          </ButtonAction>
        )}

        {/* Demo controls — the shelter-side advances are state-toggles
            (hidden-affordance pattern). Real operator surface is FC16. */}
        <div className="flex flex-col gap-xs border-t border-edge-regular pt-sm">
          <p className="text-xs text-fg-tertiary m-0">Demo — shelter side</p>
          <div className="flex items-center gap-sm flex-wrap">
            {stage !== "pending" && stage !== "adopted" && (
              <ButtonAction
                variant="tertiary"
                size="sm"
                onClick={() => setStage(dog.id, "pending")}
              >
                Arrange meet-and-greet (demo)
              </ButtonAction>
            )}
            {stage !== "adopted" && (
              <>
                {/* Primary path: the network adopts (the proven ~5×/14×
                    engine). Tied to Kateřina, who saw the walk recap and
                    commented interest — the advocacy loop completed. */}
                <ButtonAction
                  variant="tertiary"
                  size="sm"
                  onClick={() => setStage(dog.id, "adopted", "Kateřina, who saw her walk recap")}
                >
                  Finalise — network adopts (demo)
                </ButtonAction>
                {/* Secondary path: the walker adopts (the minority outcome). */}
                <ButtonAction
                  variant="tertiary"
                  size="sm"
                  onClick={() => setStage(dog.id, "adopted", currentUser.firstName)}
                >
                  Finalise — {currentUser.firstName} adopts (demo)
                </ButtonAction>
              </>
            )}
            {stage && (
              <ButtonAction
                variant="tertiary"
                size="sm"
                leftIcon={<ArrowCounterClockwise size={14} weight="bold" />}
                onClick={() => clearStage(dog.id)}
              >
                Reset
              </ButtonAction>
            )}
          </div>
        </div>
      </div>
    </ModalSheet>
  );
}

function LadderRow({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-sm">
      <span className="text-info-strong shrink-0 mt-tiny">{icon}</span>
      <div className="flex flex-col gap-tiny">
        <span className="text-sm font-semibold text-fg-primary">{title}</span>
        <span className="text-sm text-fg-secondary">{body}</span>
      </div>
    </div>
  );
}

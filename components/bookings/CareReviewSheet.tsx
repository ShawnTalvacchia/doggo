"use client";

/**
 * CareReviewSheet — owner reviews carer post-completed-booking. Closes
 * the loop. Stepped pattern reused from PostMeetReviewSheet, simplified
 * to a single screen since "review your carer" is one cohesive moment.
 *
 * Visibility rule (Sessions & Service Execution, 2026-05-05): rating +
 * text both present → public review on carer profile. Rating-only →
 * private feedback (still recorded; not shown publicly). Photo &
 * "would book again" are optional regardless. The sheet shows a soft
 * "this will be public on {carer}'s profile" hint when text is present
 * so owners aren't surprised.
 */

import { useEffect, useState } from "react";
import { Star, UploadSimple, X, Camera } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

export type CareReviewPayload = {
  rating: number;
  text: string;
  photoUrl?: string;
  wouldBookAgain: boolean;
  isPrivate: boolean;
};

export type CareReviewSheetProps = {
  open: boolean;
  onClose: () => void;
  carerName: string;
  onSubmit: (review: CareReviewPayload) => void;
};

export function CareReviewSheet({
  open,
  onClose,
  carerName,
  onSubmit,
}: CareReviewSheetProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [wouldBookAgain, setWouldBookAgain] = useState<boolean>(true);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoverRating(0);
      setText("");
      setPhotoUrl("");
      setWouldBookAgain(true);
    }
  }, [open]);

  const canSubmit = rating > 0;
  const trimmedText = text.trim();
  const isPrivate = trimmedText.length === 0;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      rating,
      text: trimmedText,
      photoUrl: photoUrl || undefined,
      wouldBookAgain,
      isPrivate,
    });
  }

  const carerFirstName = carerName.split(" ")[0];

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Review your carer"
      footer={
        <div className="flex items-center justify-between w-full gap-sm">
          <ButtonAction variant="tertiary" size="md" onClick={onClose}>
            Maybe later
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Send review
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-xl p-lg">
        <div className="flex flex-col gap-xs">
          <h2 className="font-heading text-xl font-semibold text-fg-primary m-0">
            How was working with {carerFirstName}?
          </h2>
          <p className="text-sm text-fg-secondary m-0">
            Your review helps the community know who to trust.
          </p>
        </div>

        {/* Star rating — privacy pill sits on the right edge of the
            Rating label row because the visibility state describes the
            WHOLE review (rating + optional text). Rating-only stays
            private; adding text flips the entire review to public on
            the carer's profile. Putting the pill on the first label the
            user encounters frames the privacy choice before they reach
            the textarea that flips it. */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between gap-sm">
            <span className="text-sm font-semibold text-fg-primary">Rating</span>
            {trimmedText.length > 0 ? (
              <span
                className="inline-flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-semibold"
                style={{
                  background: "var(--status-success-light)",
                  color: "var(--status-success-strong)",
                }}
              >
                Public on profile
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-semibold"
                style={{
                  background: "var(--surface-inset)",
                  color: "var(--text-secondary)",
                }}
              >
                Private feedback
              </span>
            )}
          </div>
          <div className="flex items-center gap-xs">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = n <= (hoverRating || rating);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer p-xs rounded-md hover:bg-surface-inset transition-colors"
                  aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                >
                  <Star
                    size={28}
                    weight={filled ? "fill" : "regular"}
                    className={filled ? "text-[var(--status-warning-main)]" : "text-fg-tertiary"}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Free text — adding any text flips the review to public
            (privacy pill at the top reflects this). Helper sentence
            below the textarea repeats the consequence in plain English
            for anyone who missed the pill. */}
        <div className="input-block">
          {/* Label uses the same Tailwind recipe as Rating + Add a
              photo? for visual consistency — the .label design-system
              primitive renders at text-secondary, which mismatched the
              primary-text section labels above and below. */}
          <label
            className="inline-flex items-center gap-xs text-sm font-semibold text-fg-primary"
            htmlFor="care-review-text"
          >
            What went well?
            <span className="text-xs font-normal text-fg-tertiary">(Optional)</span>
          </label>
          <textarea
            id="care-review-text"
            className="textarea"
            placeholder={`What stood out about ${carerFirstName}? Helps other owners decide.`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
          <span className="text-xs text-fg-tertiary mt-xs">
            {trimmedText.length > 0
              ? `Your written review will appear on ${carerFirstName}'s profile.`
              : `Without text, your rating stays private feedback to ${carerFirstName}.`}
          </span>
        </div>

        {/* Photo */}
        <div className="flex flex-col gap-sm">
          <span className="text-sm font-semibold text-fg-primary">
            Add a photo?
          </span>
          <span className="text-xs text-fg-tertiary">
            One of your dog from the booking, if you have one. Optional.
          </span>
          {photoUrl ? (
            <div className="flex flex-col gap-sm">
              <div
                className="relative overflow-hidden rounded-panel bg-surface-inset"
                style={{ aspectRatio: "16 / 9", maxHeight: 220 }}
              >
                <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  aria-label="Remove photo"
                  className="absolute top-xs right-xs w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-white bg-[color:var(--transparent-dark-40)] hover:bg-[color:var(--transparent-dark-64)]"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
              <label className="flex items-center justify-center gap-xs rounded-panel p-sm text-sm font-medium cursor-pointer bg-surface-top border border-edge-stronger text-fg-secondary">
                <Camera size={16} weight="light" />
                Change photo
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>
          ) : (
            // Stronger border so the dropzone reads against the modal's
            // surface-popout fill — `border-edge-regular` (#ececec) was
            // too close to the modal bg for the dashes to register.
            <label className="flex flex-col items-center justify-center gap-xs rounded-panel p-lg text-sm font-medium cursor-pointer bg-surface-top border border-dashed border-edge-stronger text-fg-secondary">
              <UploadSimple size={24} weight="light" />
              <span>Add a photo</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          )}
        </div>

        {/* Would book again — proper switch (track + knob) replaces the
            previous custom button-row. The earlier "Tap to toggle"
            subtext read as instruction (testers would tap, switching it
            OFF). Switch carries the state visually via .toggle-track;
            subtext now describes the consequence, not the mechanic.
            Inlined the track because the `Toggle` component renders a
            text label we don't want here (we have multi-line title +
            subtext on the left). */}
        <div className="flex items-start justify-between gap-md">
          <div className="flex flex-col gap-xs">
            <span className="text-sm font-semibold text-fg-primary">
              I&apos;d book {carerFirstName} again
            </span>
            <span className="text-xs text-fg-tertiary">
              Helps other owners decide who to trust.
            </span>
          </div>
          <button
            type="button"
            className={`toggle-track${wouldBookAgain ? " on" : ""}`}
            onClick={() => setWouldBookAgain((v) => !v)}
            role="switch"
            aria-checked={wouldBookAgain}
            aria-label={`I'd book ${carerFirstName} again`}
          >
            <div className="toggle-knob" />
          </button>
        </div>
      </div>
    </ModalSheet>
  );
}

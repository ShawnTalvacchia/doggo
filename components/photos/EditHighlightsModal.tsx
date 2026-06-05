"use client";

import { ArrowUp, ArrowDown, X } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

interface EditHighlightsModalProps {
  open: boolean;
  onClose: () => void;
  subjectLabel: string;
  highlights: string[];
  onReorder: (next: string[]) => void;
  onUnpin: (photoUrl: string) => void;
}

/**
 * Owner-only Highlights editor — manages the order and unpinning of
 * the pinned set. **Does not add photos.** Adding to Highlights is an
 * in-context action via the post's three-dot menu → "Pin to
 * {Dog}'s Highlights" / "Pin to your Highlights." This keeps
 * "Highlights" conceptually a tag/state on a photo, not a separate
 * collection the owner builds — the same menu carries the inverse
 * Unpin action when the photo IS already pinned. Aligns with the
 * §12 V2 direction (albums-as-tag-type).
 *
 * Mutates the owner's persisted Highlights list directly through the
 * provided callbacks. The strip below re-renders on each mutation
 * because the underlying `usePersistedState` is reactive.
 *
 * Photos & Galleries phase, 2026-06-04 (Workstream C4). Reverted from
 * an inline "Add photos" picker 2026-06-04 — see above for rationale.
 */
export function EditHighlightsModal({
  open,
  onClose,
  subjectLabel,
  highlights,
  onReorder,
  onUnpin,
}: EditHighlightsModalProps) {
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...highlights];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onReorder(next);
  };

  const moveDown = (idx: number) => {
    if (idx >= highlights.length - 1) return;
    const next = [...highlights];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onReorder(next);
  };

  const footer = (
    <div className="flex justify-end">
      <ButtonAction variant="primary" size="md" onClick={onClose}>
        Done
      </ButtonAction>
    </div>
  );

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={`Edit ${subjectLabel}'s Highlights`}
      footer={footer}
    >
      <div className="edit-highlights-body">
        {highlights.length === 0 ? (
          <p className="text-sm text-fg-secondary text-center" style={{ padding: "var(--space-lg) 0" }}>
            No Highlights yet. Open a post's ⋮ menu and pick "Pin to Highlights" to add one.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-sm">
              {highlights.map((url, idx) => (
                <div key={`${url}-${idx}`} className="highlights-edit-row">
                  <img src={url} alt={`Highlight ${idx + 1}`} className="highlights-edit-row-thumb" />
                  <span className="text-xs text-fg-tertiary">{idx + 1}</span>
                  <div className="highlights-edit-row-actions">
                    <button
                      type="button"
                      className="highlights-edit-icon-btn"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      aria-label="Move up"
                    >
                      <ArrowUp size={16} weight="light" />
                    </button>
                    <button
                      type="button"
                      className="highlights-edit-icon-btn"
                      onClick={() => moveDown(idx)}
                      disabled={idx === highlights.length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDown size={16} weight="light" />
                    </button>
                    <button
                      type="button"
                      className="highlights-edit-icon-btn"
                      onClick={() => onUnpin(url)}
                      aria-label="Unpin"
                    >
                      <X size={16} weight="light" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-fg-tertiary" style={{ marginTop: "var(--space-md)", textAlign: "center" }}>
              To add a photo, open its ⋮ menu and pick "Pin to Highlights."
            </p>
          </>
        )}
      </div>
    </ModalSheet>
  );
}

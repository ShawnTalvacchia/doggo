"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";

/**
 * ModalSheet — reusable overlay pattern.
 *
 * Desktop: centered modal card with blurred overlay.
 * Mobile (< 804px): bottom sheet that slides up.
 *
 * Usage:
 *   <ModalSheet open={open} onClose={onClose} title="Select Date" footer={<...>}>
 *     {content}
 *   </ModalSheet>
 */
export type ModalSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional sticky footer rendered below the scrollable body */
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function ModalSheet({ open, onClose, title, footer, children }: ModalSheetProps) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-sheet-overlay"
      role="dialog"
      aria-modal
      aria-label={title}
      onClick={onClose}
    >
      {/* Stop propagation so clicks inside the card don't close the overlay */}
      <div className="modal-sheet-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-sheet-header">
          <span className="modal-sheet-title">{title}</span>
          <button type="button" className="modal-sheet-close" onClick={onClose} aria-label="Close">
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="modal-sheet-body">{children}</div>

        {/* Optional footer */}
        {footer && <div className="modal-sheet-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

"use client";

/**
 * TourOverlay — floating guided-tour card mounted globally.
 *
 * URL contract:
 *   - `?tour=<tourId>` activates the overlay.
 *   - `?step=<N>` (1-indexed) selects which step to render.
 *   - `?as=<personaId>` is preserved across navigation so the persona context
 *     follows the tour.
 *
 * The overlay returns `null` when `?tour` is absent — zero rendering cost
 * outside the tour. Mount once in `app/layout.tsx` (already inside the
 * Suspense boundary that wraps other useSearchParams consumers).
 *
 * Why URL-driven (vs context state): tours cross page boundaries. A context
 * provider would need to re-mount across route changes, and would lose state
 * on hard reloads. URL params survive everything and are shareable — drop a
 * teammate the URL and they're at the same tour step.
 *
 * Layout (2026-05-05):
 *   - Desktop: anchored bottom-left, sharing the sidebar's left padding so
 *     the card lines up with the sidebar nav items above it.
 *   - Mobile: full-width bottom sheet, sitting above the BottomNav so the
 *     user can still navigate the page.
 *
 * Collapse (2026-05-05): the overlay can be minimised to a slim header pill
 * (compass + counter + expand + exit) so the user can read the page beneath
 * without exiting the tour entirely. Auto-expands when the step changes so
 * the new step's content is always visible.
 *
 * Today only Tereza has a tour; see `lib/tourSteps.ts`. Adding another
 * persona's tour requires no changes here.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Compass,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { tours, tourLength, getTourStep, type TourId } from "@/lib/tourSteps";

function buildHref(
  path: string,
  query: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export function TourOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tourId = searchParams.get("tour");
  const stepParam = searchParams.get("step");
  const asParam = searchParams.get("as") ?? undefined;
  const step = stepParam ? parseInt(stepParam, 10) : 1;

  const isValidTour = tourId !== null && tourId in tours;
  const total = isValidTour ? tourLength(tourId) : 0;
  const currentStep = isValidTour ? getTourStep(tourId, step) : undefined;

  // Collapse is local state — survives only as long as the user stays on the
  // current step. Auto-resets on step/tour change so the new content is
  // always visible. Storing in URL was considered but ruled out: it would
  // mean every Next/Prev URL needs to track the collapse flag, and the
  // intent is "let me peek at the page without exiting" — not "preserve
  // collapse state across deep links."
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(false);
  }, [step, tourId]);

  const goToStep = useCallback(
    (nextStep: number) => {
      if (!isValidTour || !tourId) return;
      const target = getTourStep(tourId, nextStep);
      if (!target) return;
      const href = buildHref(target.path, {
        as: asParam,
        tour: tourId,
        step: String(nextStep),
        ...(target.query ?? {}),
      });
      router.push(href);
    },
    [router, tourId, asParam, isValidTour],
  );

  const exitTour = useCallback(() => {
    // Strip tour params from current URL, keep `as` + any other existing params.
    const next = new URLSearchParams(searchParams.toString());
    next.delete("tour");
    next.delete("step");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [router, pathname, searchParams]);

  // Keyboard handler — wired only when the tour is active.
  // (Implemented inline rather than via useEffect because the overlay only
  // renders when active; the keyboard listeners attach to the card itself.)
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        exitTour();
      } else if (e.key === "ArrowRight" && step < total) {
        e.preventDefault();
        goToStep(step + 1);
      } else if (e.key === "ArrowLeft" && step > 1) {
        e.preventDefault();
        goToStep(step - 1);
      }
    },
    [exitTour, goToStep, step, total],
  );

  // Memoise so the card doesn't re-render every parent rerender if nothing changed.
  const card = useMemo(() => {
    if (!isValidTour || !currentStep) return null;
    const isFirst = step <= 1;
    const isLast = step >= total;
    return (
      <div
        className={`tour-overlay${collapsed ? " tour-overlay--collapsed" : ""}`}
        role="dialog"
        aria-label={`Guided tour — step ${step} of ${total}`}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className="tour-overlay-meta">
          <span className="tour-overlay-tag">
            <Compass size={12} weight="bold" aria-hidden="true" />
            Guided tour · {tourId === "tereza" ? "Tereza" : tourId}
          </span>
          <span className="tour-overlay-counter">
            Step {step} of {total}
          </span>
          <button
            type="button"
            className="tour-overlay-collapse"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand tour card" : "Collapse tour card"}
            aria-expanded={!collapsed}
          >
            {collapsed
              ? <CaretUp size={14} weight="bold" aria-hidden="true" />
              : <CaretDown size={14} weight="bold" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="tour-overlay-exit"
            onClick={exitTour}
            aria-label="Exit tour"
          >
            <X size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>
        {!collapsed && (
          <>
            <h2 className="tour-overlay-title">{currentStep.title}</h2>
            <p className="tour-overlay-body">{currentStep.body}</p>
            <div className="tour-overlay-actions">
              <button
                type="button"
                className="tour-overlay-btn tour-overlay-btn--secondary"
                onClick={() => goToStep(step - 1)}
                disabled={isFirst}
              >
                <ArrowLeft size={14} weight="bold" aria-hidden="true" />
                Prev
              </button>
              {isLast ? (
                <button
                  type="button"
                  className="tour-overlay-btn tour-overlay-btn--primary"
                  onClick={exitTour}
                >
                  Finish
                </button>
              ) : (
                <button
                  type="button"
                  className="tour-overlay-btn tour-overlay-btn--primary"
                  onClick={() => goToStep(step + 1)}
                >
                  Next
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }, [
    isValidTour,
    currentStep,
    step,
    total,
    tourId,
    collapsed,
    exitTour,
    goToStep,
    onKeyDown,
  ]);

  return card;
}

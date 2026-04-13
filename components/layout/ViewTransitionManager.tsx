"use client";

import { useViewTransitionDirection } from "@/hooks/useViewTransitionDirection";

/**
 * Client component that enables direction-aware view transitions.
 * Renders nothing — just runs the hook.
 */
export function ViewTransitionManager() {
  useViewTransitionDirection();
  return null;
}

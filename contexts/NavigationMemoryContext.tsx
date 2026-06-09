"use client";

/**
 * NavigationMemoryContext
 *
 * Tracks the last "list-level" path the viewer visited in this session so
 * detail pages can offer source-aware back navigation — go back to the
 * list view the viewer arrived from, instead of always defaulting to a
 * fixed tree-parent destination.
 *
 * Two back-navigation patterns coexist:
 *
 *   1. Tree-hierarchy — page has a clear structural parent regardless of
 *      how the viewer arrived. Example: `/dogs/[id]` belongs to its
 *      shelter; back always goes to the shelter's Dogs tab. These pages
 *      ignore the memory.
 *
 *   2. Source-aware — page is reachable from multiple list surfaces, so
 *      back should remember where the viewer came from. Example:
 *      `/communities/[id]` reached from `/home` → back to `/home`; from
 *      `/discover/groups` → back to `/discover/groups`. These pages
 *      consume `lastListPath` and fall back to a sensible default when
 *      the memory is empty (deep link / fresh load).
 *
 * Memory is session-only (React state, no persistence). A refresh or a
 * deep link to a detail page resets to `null` — pages MUST provide a
 * fallback parent.
 *
 * "List-level" is the inverse of "detail page" — paths matching one of
 * `DETAIL_PATTERNS` below DON'T update the memory; everything else does.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Routes that are detail/subpages — visiting one does NOT update the
 *  memory. The memory always reflects the last LIST page visited. */
const DETAIL_PATTERNS = [
  /^\/communities\/[^/]+/,
  /^\/shelters\/[^/]+/,
  /^\/dogs\/[^/]+/,
  /^\/profile\/[^/]+/, // /profile (own profile) IS list-level; /profile/<userId> is detail
  /^\/meets\/[^/]+/,
  /^\/bookings\/[^/]+/,
  /^\/help\/[^/]+/,
  /^\/posts\/create/,
  /^\/signup/,
  /^\/unlock/,
];

function isDetailPath(path: string): boolean {
  return DETAIL_PATTERNS.some((p) => p.test(path));
}

interface NavigationMemoryContextValue {
  /** The last list-level path the viewer visited (with search params
   *  preserved, e.g. `/discover/groups?tab=neighbour`). Null on first
   *  load or after a deep link with no in-app history. */
  lastListPath: string | null;
  /** The full URL immediately before the current one — INCLUDING detail
   *  paths. Lets consumers disambiguate arrival source when `lastListPath`
   *  doesn't carry enough signal (e.g. did the viewer reach `/dogs/[id]`
   *  directly from a Discover surface, or via a shelter detail page in
   *  between?). One-render delay vs the current pathname — `previousPath`
   *  is "the URL the viewer was on a render ago." */
  previousPath: string | null;
}

/** Internal context shape — exposes the setters to the PathTracker child.
 *  Consumers go through `useNavigationMemory()`, which returns only the
 *  read-only state. */
interface InternalContextValue extends NavigationMemoryContextValue {
  _setLastListPath: (path: string) => void;
  _setPreviousPath: (path: string) => void;
}

const NavigationMemoryContext = createContext<InternalContextValue>({
  lastListPath: null,
  previousPath: null,
  _setLastListPath: () => {},
  _setPreviousPath: () => {},
});

/**
 * Lives under a Suspense boundary because `useSearchParams` requires it
 * in Next.js App Router. Renders nothing — it's just a side-effect that
 * updates the parent provider's state whenever the path changes.
 */
function PathTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ctx = useContext(NavigationMemoryContext);
  // Tracks the FULL path of the previous render so we can publish it as
  // `previousPath` on the next pathname change. A ref (not state) because
  // we only care about its value during the effect, not for re-rendering.
  const lastFullPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const search = searchParams.toString();
    const full = search ? `${pathname}?${search}` : pathname;

    // Publish the BEFORE-this-change full path as `previousPath`. Includes
    // detail paths (shelter / dog / community / etc.) — that's the point;
    // `lastListPath` already filters those out.
    if (lastFullPathRef.current && lastFullPathRef.current !== full) {
      ctx._setPreviousPath(lastFullPathRef.current);
    }
    lastFullPathRef.current = full;

    if (!isDetailPath(pathname)) {
      ctx._setLastListPath(full);
    }
  }, [pathname, searchParams, ctx]);

  return null;
}

export function NavigationMemoryProvider({ children }: { children: ReactNode }) {
  const [lastListPath, setLastListPath] = useState<string | null>(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  return (
    <NavigationMemoryContext.Provider
      value={{
        lastListPath,
        previousPath,
        _setLastListPath: setLastListPath,
        _setPreviousPath: setPreviousPath,
      }}
    >
      <Suspense fallback={null}>
        <PathTracker />
      </Suspense>
      {children}
    </NavigationMemoryContext.Provider>
  );
}

/**
 * Read the last list-level path visited in this session.
 *
 * Usage:
 * ```ts
 * const { lastListPath } = useNavigationMemory();
 * // Source-aware back destination:
 * const parentHref = lastListPath ?? "/home";
 * // Tree-hierarchy back destination ignoring memory:
 * const parentHref = `/shelters/${shelter.id}?tab=dogs`;
 * ```
 */
export function useNavigationMemory(): NavigationMemoryContextValue {
  const { lastListPath, previousPath } = useContext(NavigationMemoryContext);
  return { lastListPath, previousPath };
}

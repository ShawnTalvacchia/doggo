"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useCurrentUserId, useIsGuest } from "@/hooks/useCurrentUser";
import { countUnreadConversations } from "@/lib/conversationUtils";
import {
  ArrowLeft,
  Bell,
  ChatCircleDots,
  CalendarPlus,
  Compass,
} from "@phosphor-icons/react";
import { AddPostIcon } from "@/components/icons/AddPostIcon";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { useMeetComposer } from "@/contexts/MeetComposerContext";

function GuestNavLinks() {
  return (
    <div className="app-nav-right" aria-label="Guest navigation">
      {/* Persistent demo affordance (Demo Presentation F1, 2026-05-05).
          Replaces the prior text-only "Enter Demo" link — testers absorb
          the value prop through the landing page and need a one-click
          door into the prototype from any guest route. The "..." → /pages
          dev menu was removed 2026-04-29; /pages stays reachable via
          direct URL but isn't pinned to the chrome. Sign Up can flip back
          to primary when real signup flows wire up. */}
      <Link
        href="/demo"
        className="app-nav-link app-nav-link--demo"
        aria-label="Try the prototype demo"
      >
        <Compass size={16} weight="bold" aria-hidden="true" />
        <span className="app-nav-link-label">Try the demo</span>
      </Link>
      <Link href="/signup/start" className="app-nav-link app-nav-link--primary app-nav-link--hide-mobile">
        Sign Up
      </Link>
    </div>
  );
}

function SignupNavLinks() {
  return (
    <div className="app-nav-right" aria-label="Signup navigation">
      {/* The "..." → /pages dev menu was removed 2026-04-29 from guest
          + signup nav. /pages remains reachable via direct URL. */}
    </div>
  );
}

function LoggedNavLinks({ hideCreate = false }: { hideCreate?: boolean }) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { conversations } = useConversations();
  const { openComposer } = usePostComposer();
  const { openComposer: openMeetComposer } = useMeetComposer();
  const currentUserId = useCurrentUserId();
  const { pageAction, suppressCreate, navLockedIn } = usePageHeader();

  // Inbox badge count — viewer-aware (matches the inbox's own dot
  // rendering). Earlier formula `c.unreadCount > 0` read the
  // owner-centric counter and gave divergent counts on provider-side
  // viewers vs the inbox itself + the desktop sidebar. 2026-05-08.
  const unreadInbox = countUnreadConversations(conversations, currentUserId);

  // Context-aware Create action: on /schedule the primary create is a meet,
  // everywhere else it's a post. Icon flips to match.
  const isScheduleRoute = pathname.startsWith("/schedule");
  const createLabel = isScheduleRoute ? "Create meet" : "Create post";
  const createIcon = isScheduleRoute
    ? <CalendarPlus size={28} weight="light" />
    : <AddPostIcon size={28} />;
  const handleCreate = () => {
    if (isScheduleRoute) openMeetComposer();
    else openComposer();
  };

  // Page-action slot precedence:
  //   pageAction set        → render it in the create-icon position
  //   suppressCreate true   → render nothing in that position
  //   neither               → render default Create icon (subject to route-level hideCreate)
  // navLockedIn additionally hides Bell + Inbox for full edit-mode lock-in.
  const showCreate = !pageAction && !suppressCreate && !hideCreate;

  return (
    <div className="app-nav-logged" aria-label="Logged-in navigation">
      <div className="app-nav-icon-row">
        {pageAction && (
          <div className="app-nav-page-action">{pageAction}</div>
        )}
        {showCreate && (
          <ButtonIcon label={createLabel} onClick={handleCreate}>
            {createIcon}
          </ButtonIcon>
        )}
        {!navLockedIn && (
          <>
            {/* Bell routes to the full /notifications page on every device.
                Desktop dropdown panel was dropped 2026-05-08. */}
            <ButtonIcon
              label="Notifications"
              href="/notifications"
              showBadge={unreadCount > 0}
              badgeCount={unreadCount}
            >
              <Bell size={28} weight="light" />
            </ButtonIcon>
            <ButtonIcon label="Messages" href="/inbox" showBadge={unreadInbox > 0} badgeCount={unreadInbox}>
              <ChatCircleDots size={28} weight="light" />
            </ButtonIcon>
          </>
        )}
      </div>
    </div>
  );
}

const loggedRoutes = ["/home", "/communities", "/groups", "/activity", "/discover", "/meets", "/schedule", "/explore", "/inbox", "/notifications", "/bookings", "/profile", "/help"];

function getPageTitle(pathname: string): string | null {
  if (pathname.startsWith("/discover/care")) return "Dog Care";
  if (pathname.startsWith("/discover/meets")) return "Meets";
  if (pathname.startsWith("/discover/groups")) return "Groups";
  if (pathname === "/discover") return "Discover";
  if (pathname.startsWith("/home")) return null;
  if (pathname.startsWith("/schedule")) return "My Schedule";
  if (pathname.startsWith("/bookings")) return "Bookings";
  if (pathname.startsWith("/inbox")) return "Inbox";
  if (pathname === "/profile") return "Profile";
  if (pathname.startsWith("/profile/")) return null; // Detail header handles it
  if (pathname.startsWith("/notifications")) return "Notifications";
  return null;
}

export function AppNav() {
  const pathname = usePathname();
  const { detailTitle, onBack, rightAction, leadingAvatar } = usePageHeader();
  const isGuest = useIsGuest();
  // Guest visitors on a normally-logged surface (e.g. /communities/group-1?guest=1)
  // get the guest nav — `Try the demo` + `Sign Up`, no Bell/Inbox/Create. Without
  // this branch, AppNav would key off the route alone and render LoggedNavLinks
  // bound to the read-only Tereza fallback, leaking her unread counts into the
  // guest preview. Demo Presentation F1c, 2026-05-05.
  const mode = isGuest
    ? "guest"
    : loggedRoutes.some((r) => pathname.startsWith(r)) ? "logged" : "guest";
  const isSignupRoute = pathname.startsWith("/signup");
  const isStyleguideRoute = pathname.startsWith("/styleguide");
  const isDiscoverRoute = pathname.startsWith("/discover");
  const isDiscoverSubpage = isDiscoverRoute && pathname !== "/discover";
  const pageTitle = getPageTitle(pathname);
  const showDetailHeader = detailTitle !== null;
  const isContainedNav =
    pathname === "/" ||
    pathname === "/signin" ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/styleguide");
  const navContent = (
    <>
      <div className="app-nav-brand-wrap">
        <Link href={mode === "logged" ? "/home" : "/"} className={`app-nav-brand${pageTitle || showDetailHeader ? " app-nav-brand--hide-mobile" : ""}`}>
          DOGGO
        </Link>
        {/* Detail header (back + title) — shown on mobile when a page sets it */}
        {showDetailHeader && (
          <div className="app-nav-detail-header">
            {onBack && (
              <button type="button" className="app-nav-detail-back" onClick={onBack}>
                <ArrowLeft size={20} weight="regular" />
              </button>
            )}
            {leadingAvatar && <div className="app-nav-detail-avatar">{leadingAvatar}</div>}
            <span className="app-nav-detail-title">{detailTitle}</span>
            {rightAction && <div className="app-nav-detail-action">{rightAction}</div>}
          </div>
        )}
        {/* Page title — shown on mobile for list views (hidden when detail is active) */}
        {pageTitle && !showDetailHeader && (
          <div className="app-nav-page-title">
            {isDiscoverSubpage && (
              <Link href="/discover" className="app-nav-page-title-back">
                <ArrowLeft size={20} weight="regular" />
              </Link>
            )}
            <span>{pageTitle}</span>
          </div>
        )}
      </div>
      <div className={`app-nav-mode${showDetailHeader ? " app-nav-mode--detail" : ""}`}>
        {mode === "guest" ? (
          isSignupRoute || isStyleguideRoute ? (
            <SignupNavLinks />
          ) : (
            <GuestNavLinks />
          )
        ) : (
          <LoggedNavLinks hideCreate={isDiscoverRoute || pathname.startsWith("/bookings") || pathname.startsWith("/inbox") || pathname.startsWith("/notifications")} />
        )}
      </div>
    </>
  );

  return (
    <header
      className={`app-nav-shell${
        mode === "logged" ? " app-nav-shell--logged" : ""
      }${isSignupRoute ? " app-nav-shell--signup" : ""
      }${isStyleguideRoute ? " app-nav-shell--styleguide" : ""}`}
    >
      <nav
        className={`app-nav${isContainedNav ? " app-nav--contained" : ""}${mode === "logged" ? " app-nav--logged" : ""}`}
      >
        {isContainedNav ? <div className="app-nav-inner">{navContent}</div> : navContent}
      </nav>
    </header>
  );
}

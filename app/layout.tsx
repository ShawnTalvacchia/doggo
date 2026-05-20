import type { Metadata } from "next";
import { Suspense } from "react";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { SignupProvider } from "@/contexts/SignupContext";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { AuthGateProvider } from "@/contexts/AuthGateContext";
import { ConversationsProvider } from "@/contexts/ConversationsContext";
import { ConnectionsProvider } from "@/contexts/ConnectionsContext";
import { BookingsProvider } from "@/contexts/BookingsContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import { PageHeaderProvider } from "@/contexts/PageHeaderContext";
import { PostComposerProvider } from "@/contexts/PostComposerContext";
import { MeetComposerProvider } from "@/contexts/MeetComposerContext";
import { PostMeetReviewProvider } from "@/contexts/PostMeetReviewContext";
import { GuestLayout } from "@/components/layout/GuestLayout";
import { AppNav } from "@/components/layout/AppNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { PostComposer } from "@/components/posts/PostComposer";
import { MeetComposer } from "@/components/meets/MeetComposer";
import { PostMeetReviewSheet } from "@/components/meets/PostMeetReviewSheet";
import { WalkthroughProvider } from "@/contexts/WalkthroughContext";
import { WalkthroughInterstitial } from "@/components/walkthrough/WalkthroughInterstitial";
import { WalkthroughCard } from "@/components/walkthrough/WalkthroughCard";

const headingFont = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "900"],
});

const bodyFont = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Doggo Prototype",
  description: "Doggo V1 clickable prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable}`}
        style={{ fontFamily: "var(--font-body), sans-serif" }}
      >
        <SignupProvider>
          <CurrentUserProvider>
            <WalkthroughProvider>
            <AuthGateProvider>
            <NotificationsProvider>
              <ReviewsProvider>
                <ConversationsProvider>
                  <ConnectionsProvider>
                  <BookingsProvider>
                    <PageHeaderProvider>
                      <PostComposerProvider>
                        <MeetComposerProvider>
                          <PostMeetReviewProvider>
                            <GuestLayout>
                              <AppNav />
                              {children}
                              {/* BottomNav reads ?as= via useSearchParams — must be in Suspense
                                  so the layout can statically prerender (e.g. /_not-found). */}
                              <Suspense fallback={null}>
                                <BottomNav />
                              </Suspense>
                            </GuestLayout>
                            {/* These three modals consume useCurrentUser() which reads search params.
                                Same Suspense rule — without these boundaries the build fails on
                                /_not-found prerender in Next 16. */}
                            <Suspense fallback={null}>
                              <PostComposer />
                            </Suspense>
                            <Suspense fallback={null}>
                              <MeetComposer />
                            </Suspense>
                            <Suspense fallback={null}>
                              <PostMeetReviewSheet />
                            </Suspense>
                            {/* Guided Walkthrough — full-screen handoff
                                interstitial + persistent on-surface step
                                card. Both return null outside an active
                                walkthrough (WalkthroughContext).
                                WalkthroughCard reads useSearchParams (for
                                query-aware advanceOn), so it must sit in
                                a Suspense boundary for static prerender
                                — same rule that wraps BottomNav above. */}
                            <WalkthroughInterstitial />
                            <Suspense fallback={null}>
                              <WalkthroughCard />
                            </Suspense>
                          </PostMeetReviewProvider>
                        </MeetComposerProvider>
                      </PostComposerProvider>
                    </PageHeaderProvider>
                  </BookingsProvider>
                  </ConnectionsProvider>
                </ConversationsProvider>
              </ReviewsProvider>
            </NotificationsProvider>
            </AuthGateProvider>
            </WalkthroughProvider>
          </CurrentUserProvider>
        </SignupProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { SignupProvider } from "@/contexts/SignupContext";
import { ConversationsProvider } from "@/contexts/ConversationsContext";
import { BookingsProvider } from "@/contexts/BookingsContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import { PageHeaderProvider } from "@/contexts/PageHeaderContext";
import { PostComposerProvider } from "@/contexts/PostComposerContext";
import { GuestLayout } from "@/components/layout/GuestLayout";
import { AppNav } from "@/components/layout/AppNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { PostComposer } from "@/components/posts/PostComposer";
import { ViewTransitionManager } from "@/components/layout/ViewTransitionManager";

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
          <NotificationsProvider>
            <ReviewsProvider>
              <ConversationsProvider>
                <BookingsProvider>
                  <PageHeaderProvider>
                    <PostComposerProvider>
                      <ViewTransitionManager />
                      <GuestLayout>
                        <AppNav />
                        {children}
                        <BottomNav />
                      </GuestLayout>
                      <PostComposer />
                    </PostComposerProvider>
                  </PageHeaderProvider>
                </BookingsProvider>
              </ConversationsProvider>
            </ReviewsProvider>
          </NotificationsProvider>
        </SignupProvider>
      </body>
    </html>
  );
}

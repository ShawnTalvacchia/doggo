import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { SignupProvider } from "@/contexts/SignupContext";
import { GuestLayout } from "@/components/GuestLayout";
import { AppNav } from "@/components/AppNav";
import { BottomNav } from "@/components/BottomNav";

const headingFont = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600"],
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
          <GuestLayout>
            <AppNav />
            {children}
            <BottomNav />
          </GuestLayout>
        </SignupProvider>
      </body>
    </html>
  );
}

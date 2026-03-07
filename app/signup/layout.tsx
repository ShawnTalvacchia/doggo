"use client";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="signup-layout">
      <div className="signup-scroll">{children}</div>
    </div>
  );
}

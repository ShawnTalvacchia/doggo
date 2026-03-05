"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { label: "Colors", href: "/styleguide" },
  { label: "Typography", href: "/styleguide/typography" },
  { label: "Tokens", href: "/styleguide/tokens" },
  { label: "Components", href: "/styleguide/components" },
];

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("styleguide");
    return () => document.body.classList.remove("styleguide");
  }, []);

  const currentHref =
    pathname === "/styleguide"
      ? "/styleguide"
      : (tabs.find((t) => pathname.startsWith(t.href))?.href ?? "/styleguide");

  return (
    <div className="sg-layout">
      <nav className="sg-nav" aria-label="Styleguide sections">
        <div className="sg-nav-inner">
          {tabs.map(({ label, href }) => {
            const isActive =
              href === "/styleguide" ? pathname === "/styleguide" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`sg-tab${isActive ? " sg-tab-active" : ""}`}>
                {label}
              </Link>
            );
          })}
        </div>
        <div className="sg-nav-dropdown">
          <select
            className="select sg-nav-select"
            value={currentHref}
            onChange={(e) => router.push(e.target.value)}
            aria-label="Styleguide section"
          >
            {tabs.map(({ label, href }) => (
              <option key={href} value={href}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <div className="sg-scroll">{children}</div>
    </div>
  );
}

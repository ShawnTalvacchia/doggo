import Link from "next/link";

export function TopNavDesktop() {
  return (
    <nav className="top-nav desktop-only">
      <div className="brand">DOGGO</div>
      <Link href="/explore/results">Search</Link>
      <a href="#" aria-disabled>
        Offer Care
      </a>
      <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
        <span>Notifications</span>
        <span>Messages</span>
        <span>Calendar</span>
      </div>
    </nav>
  );
}

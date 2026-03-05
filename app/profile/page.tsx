import Link from "next/link";
import { PAGE_MENU_GROUPS } from "@/lib/navigation/pageMenuGroups";

export default function ProfileMenuPage() {
  return (
    <main className="page-shell profile-menu-page">
      <div className="page-width profile-menu-wrap">
        <section className="profile-menu-card">
          <h1 className="profile-menu-title">Menu</h1>
          <p className="profile-menu-subtitle">
            Temporary profile tab view while the full profile page is in progress.
          </p>
          <div className="profile-menu-groups">
            {PAGE_MENU_GROUPS.map((group) => (
              <div key={group.title} className="profile-menu-group">
                <h2 className="profile-menu-group-title">{group.title}</h2>
                <div className="profile-menu-links">
                  {group.items.map((item) => (
                    <Link key={item.value} href={item.value} className="profile-menu-link">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

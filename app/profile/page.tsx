import Link from "next/link";
import { PAGE_MENU_GROUPS } from "@/lib/navigation/pageMenuGroups";

export default function ProfileMenuPage() {
  return (
    <main className="page-shell profile-menu-page">
      <div className="page-width profile-menu-wrap">
        <section className="profile-menu-card">
          <div className="profile-menu-header">
            <h1 className="profile-menu-title">Pages</h1>
            <p className="profile-menu-subtitle">
              Quick navigation for the prototype. We’ll keep adding more as we build.
            </p>
          </div>
          <div className="profile-menu-groups">
            {PAGE_MENU_GROUPS.map((group) => (
              <div key={group.title} className="profile-menu-group input-block">
                <div className="label profile-menu-group-title">
                  <span className="label-primary-group">
                    <span>{group.title}</span>
                  </span>
                </div>
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

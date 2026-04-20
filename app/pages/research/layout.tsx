import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import "../hub.css";

/**
 * Shared shell for competitive research pages at /pages/research/*.
 * Renders the hub top strip, a thin back-row, and an article panel
 * that scrolls internally — same contained-panel pattern as the hub.
 */
export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="hub">
      <header className="hub-top-strip">
        <div className="hub-wrap hub-top-strip-inner">
          <Link href="/pages" className="hub-brand">
            DOGGO
          </Link>
          <div className="hub-header-meta">
            <span className="hub-header-meta-chip">
              <span className="hub-header-meta-dot" />
              Private preview
            </span>
            <span className="hub-header-meta-date">Research</span>
          </div>
        </div>
      </header>

      <div className="hub-panel-wrap">
        <section className="hub-panel">
          <div className="research-back-row">
            <Link href="/pages?tab=research" className="research-back">
              <ArrowLeft size={14} weight="bold" />
              <span>Back to Research</span>
            </Link>
          </div>

          <article className="research-article">{children}</article>
        </section>
      </div>
    </main>
  );
}

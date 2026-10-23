import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CrystalField } from "@/components/visuals/CrystalField";
import { nav } from "@/content/site";
import { notes } from "@/content/notes";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found | NxtOrbis®",
  robots: { index: false },
};

/**
 * The page that is not there.
 *
 * A dead end is still a page somebody is standing on, so it is art-directed
 * like the rest: the crystal field behind it, the address they asked for in
 * monospace as a fact rather than an apology, and then the way out — every
 * place on the site, named, plus the newest engineering note so there is
 * something to read rather than only somewhere to go.
 */
export default function NotFound() {
  const latest = notes[notes.length - 1];

  return (
    <section className={styles.wrap} aria-labelledby="nf-title">
      <div className={styles.visual} aria-hidden="true">
        <CrystalField variant="ambient" parallax={false} id="nf-cf" seed={5} />
      </div>
      <div className="container">
        <div className={styles.inner}>
          <p className="eyebrow">Error 404</p>
          <h1 id="nf-title" className="t-display">
            Off <span className="t-serif">orbit.</span>
          </h1>
          <p className="t-lead">
            Nothing lives at this address. It may have moved, or it may never have been here — either way, the rest of the
            site is below.
          </p>

          <nav className={styles.map} aria-label="Everywhere else">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className={styles.mapLabel}>{item.label}</span>
                    <span className={styles.mapPath}>{item.href}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/notes">
                  <span className={styles.mapLabel}>Engineering notes</span>
                  <span className={styles.mapPath}>/notes</span>
                </Link>
              </li>
            </ul>
          </nav>

          <p className={styles.read}>
            Or read the newest note: <Link href={`/notes/${latest.slug}`}>{latest.title}</Link>
          </p>

          <div className={styles.actions}>
            <Button href="/" variant="primary" arrow>
              Back to home
            </Button>
            <Button href="/contact" variant="secondary">
              Tell us what you were looking for
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

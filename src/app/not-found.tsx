import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { CrystalField } from "@/components/visuals/CrystalField";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found | NxtOrbis®",
  robots: { index: false },
};

export default function NotFound() {
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
          <p className="t-lead">The page you were looking for does not exist or has moved.</p>
          <div className={styles.actions}>
            <Button href="/" variant="primary" arrow>
              Back to home
            </Button>
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

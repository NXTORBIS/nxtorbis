"use client";

import { cx } from "@/lib/cx";
import { withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisCopy } from "@/content/orbis";
import { useInView } from "../shared";
import styles from "../Orbis.module.css";

/**
 * The last frame.
 *
 * Pages usually stop at a footer. This one ends: the light goes down, the
 * page darkens to its floor, and a single line is left standing. The Orb has
 * already gone by here — the final slot is above — so what remains is the
 * dark it came out of.
 */
export function OrbisEnding() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <section ref={ref} className={cx(styles.ending, inView && styles.inView)} aria-labelledby="orbis-ending">
      <div className="container">
        <p id="orbis-ending" className={styles.endingLine}>
          {withOrbisLogo(orbisCopy.ending.line)}
        </p>
        <span className={styles.endingMark} aria-hidden="true" />
      </div>
    </section>
  );
}

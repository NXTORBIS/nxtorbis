"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { orbisFeatures } from "@/content/orbis";
import styles from "./Orbis.module.css";

/**
 * A rail of the eight worlds down the side, marking where you are.
 *
 * One IntersectionObserver watches the feature sections and lights whichever
 * holds the middle of the screen; the dots are links, so the rail is also a
 * way to jump. It appears when the features begin and leaves when they end, so
 * it never floats over the hero or the download.
 *
 * Wide screens only (there is no room beside the copy on a phone), and it is a
 * nav landmark with its own label rather than decoration.
 */
export function Spine() {
  const [active, setActive] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sections = orbisFeatures
      .map((f) => document.getElementById(`orbis-feature-${f.id}`)?.closest("article"))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.querySelector("[id^='orbis-feature-']")?.id.replace("orbis-feature-", "");
          if (id) setActive(id);
        }
      },
      // A band across the middle of the screen: whatever crosses it is "here".
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((el) => io.observe(el));

    const features = document.getElementById("features");
    const edge = features
      ? new IntersectionObserver((entries) => setShown(entries[0]?.isIntersecting ?? false), { rootMargin: "-10% 0px -20% 0px" })
      : null;
    if (features && edge) edge.observe(features);

    return () => {
      io.disconnect();
      edge?.disconnect();
    };
  }, []);

  return (
    <nav ref={ref} className={cx(styles.spine, shown && styles.spineOn)} aria-label="The eight worlds">
      <ol>
        {orbisFeatures.map((f) => (
          <li key={f.id}>
            <a
              href={`#orbis-feature-${f.id}`}
              className={cx(styles.spineLink, active === f.id && styles.spineActive)}
              aria-current={active === f.id ? "true" : undefined}
            >
              <span className={styles.spineDot} aria-hidden="true" />
              <span className={styles.spineName}>{f.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

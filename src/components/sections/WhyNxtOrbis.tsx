"use client";

import { useState } from "react";
import { principles } from "@/content/site";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import styles from "./WhyNxtOrbis.module.css";

export function WhyNxtOrbis() {
  const [active, setActive] = useState(0);
  const current = principles[active];

  return (
    <section className={cx("section", styles.section)} aria-labelledby="why-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.statement}>
          <Reveal as="p" className="eyebrow" variant="fade">
            <span>Why NxtOrbis</span>
            <span className="eyebrow-index">06</span>
          </Reveal>
          <Reveal variant="clip">
            <h2 id="why-title" className={`t-h1 ${styles.title}`}>
              Built <span className="t-serif">with</span> you, not just for you.
            </h2>
          </Reveal>
          <Reveal as="p" className="t-lead" delay={80}>
            We are committed to delivering innovative, reliable and scalable software tailored to your business
            — whether that is a software product, a custom solution, AI integration, blockchain security or a
            cloud-based application.
          </Reveal>

          <div className={styles.activeBox} aria-live="polite">
            <span className={styles.activeNum}>{current.index}</span>
            <p className={styles.activeBody}>{current.body}</p>
          </div>
        </div>

        <Reveal as="ul" className={styles.list} variant="right" delay={120}>
          {principles.map((p, i) => {
            const selected = i === active;
            return (
              <li key={p.index}>
                <button
                  type="button"
                  className={cx(styles.item, selected && styles.itemActive)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={selected}
                >
                  <span className={styles.itemNum}>{p.index}</span>
                  <span className={styles.itemTitle}>{p.title}</span>
                  <span className={styles.itemBody}>{p.body}</span>
                </button>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

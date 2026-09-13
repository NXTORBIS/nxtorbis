"use client";

import { useEffect, useRef, useState } from "react";
import { processStages } from "@/content/site";
import { cx } from "@/lib/cx";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ProcessTimeline.module.css";

/**
 * "How we build" — a seven-stage timeline.
 * Desktop: horizontal progression, the active stage advances as the section
 * scrolls through the viewport. Mobile: vertical, activated per item.
 */
export function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress from when the section top hits 70% of the viewport until its bottom reaches 40%
        const start = vh * 0.7;
        const end = vh * 0.4;
        const total = rect.height + start - end;
        const progressed = start - rect.top;
        const p = Math.min(1, Math.max(0, progressed / total));
        setActive(Math.min(processStages.length - 1, Math.floor(p * processStages.length)));
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.indexOf(entry.target as HTMLLIElement);
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    const bind = () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      if (mq.matches) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else {
        itemRefs.current.forEach((li) => li && io.observe(li));
      }
    };

    bind();
    mq.addEventListener("change", bind);
    return () => {
      mq.removeEventListener("change", bind);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className={cx("section", styles.section)} aria-labelledby="process-title" id="process">
      <div className="container">
        <SectionHeading
          id="process-title"
          eyebrow="Process"
          index="07"
          title={
            <>
              How we <span className="t-serif">build.</span>
            </>
          }
          lead="Seven stages, one continuous line — from understanding the problem to evolving the software long after launch."
          split
        />

        <div className={styles.track} aria-hidden="true">
          <div className={styles.progress} style={{ transform: `scaleX(${(active + 1) / processStages.length})` }} />
        </div>

        <ol className={styles.list}>
          {processStages.map((step, i) => {
            const state = i < active ? "done" : i === active ? "active" : "todo";
            return (
              <li
                key={step.index}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={cx(styles.item, styles[state])}
                aria-current={state === "active" ? "step" : undefined}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.index}>{step.index}</span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

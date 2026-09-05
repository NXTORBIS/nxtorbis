"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cta, services } from "@/content/site";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";
import { Plus } from "@/components/ui/Icons";
import styles from "./ServiceExplorer.module.css";

/**
 * Editorial service explorer.
 * Desktop: an accessible tab list (numbers left, active service right).
 * Mobile: an accordion where every service stays reachable.
 */
export function ServiceExplorer({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const [animKey, setAnimKey] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = useCallback((i: number) => {
    setActive(i);
    setAnimKey((k) => k + 1);
  }, []);

  // Roving tabindex + arrow-key navigation for the tab list
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = services.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      select(next);
      tabRefs.current[next]?.focus();
    }
  };

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, services.length);
  }, []);

  const current = services[active];

  return (
    <section className={cx("section", styles.section)} aria-labelledby="services-title" id="services">
      <div className="container">
        {!compact && (
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            index="02"
            title={
              <>
                Engineering across the <span className="t-serif">whole</span> stack.
              </>
            }
            lead="Six service lines, one engineering discipline — from bespoke systems and product development to mobile, AI, blockchain and cloud."
            action={
              <Button href={cta.services.href} variant="ghost" arrow>
                {cta.services.label}
              </Button>
            }
            split
          />
        )}

        {/* Desktop explorer */}
        <div className={styles.explorer}>
          <div className={styles.tabs} role="tablist" aria-orientation="vertical" aria-label="Services">
            {services.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`${baseId}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={cx(styles.tab, selected && styles.tabActive)}
                  onClick={() => select(i)}
                  onMouseEnter={() => select(i)}
                  onFocus={() => select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className={styles.tabNum}>{s.index}</span>
                  <span className={styles.tabLabel}>{s.title}</span>
                  <span className={styles.tabBar} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            className={cx("glass", "glass--l3", "glass--panel", styles.panel)}
          >
            <div key={animKey} className={styles.panelInner}>
              <div className={styles.panelCopy}>
                <p className="num">{current.index} / 06</p>
                <h3 className={cx("t-h2", styles.panelTitle)}>{current.title}</h3>
                <p className={cx("t-lead", styles.panelDesc)}>{current.description}</p>
                <p className={cx("t-sm", styles.panelDetail)}>{current.detail}</p>
                <Button href={`/contact?service=${encodeURIComponent(current.title)}`} variant="ghost" arrow>
                  Discuss {current.title.toLowerCase()}
                </Button>
              </div>
              <div className={styles.panelVisual}>
                <ServiceGlyph kind={current.glyph} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile accordion */}
        <div className={styles.accordion}>
          {services.map((s, i) => {
            const open = openMobile === i;
            return (
              <Reveal key={s.id} className={styles.accItem} variant="up" delay={i * 40}>
                <h3 className={styles.accHeading}>
                  <button
                    type="button"
                    className={styles.accTrigger}
                    aria-expanded={open}
                    aria-controls={`${baseId}-acc-${i}`}
                    onClick={() => setOpenMobile(open ? null : i)}
                  >
                    <span className={styles.tabNum}>{s.index}</span>
                    <span className={styles.accLabel}>{s.title}</span>
                    <span className={cx("glass", "glass--l2", "glass--pill", styles.accIcon, open && styles.accIconOpen)}>
                      <Plus />
                    </span>
                  </button>
                </h3>
                <div id={`${baseId}-acc-${i}`} className={cx(styles.accBody, open && styles.accBodyOpen)} hidden={!open}>
                  <div className={styles.accBodyInner}>
                    <p className="t-body">{s.description}</p>
                    <div className={styles.accVisual}>
                      <ServiceGlyph kind={s.glyph} />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

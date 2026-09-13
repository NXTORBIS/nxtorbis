"use client";

import { useState } from "react";
import { technology } from "@/content/site";
import { Reveal } from "@/lib/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import styles from "./TechnologySection.module.css";

/**
 * Technology ecosystem: Software Engineering at the centre, connected to
 * seven capability nodes. Architectural, not decorative — and definitely
 * not a logo wall.
 */
export function TechnologySection() {
  const [active, setActive] = useState<string | null>(null);
  const nodes = technology.nodes;
  const W = 900;
  const H = 640;
  const cx0 = W / 2;
  const cy0 = H / 2;
  const R = 250;
  const RY = R * 0.82;
  const positions = nodes.map((n, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
    return { ...n, x: cx0 + R * Math.cos(a), y: cy0 + RY * Math.sin(a) };
  });

  return (
    <section className={`section ${styles.section}`} aria-labelledby="tech-title" id="technology">
      <div className="container">
        <SectionHeading
          id="tech-title"
          eyebrow="Technology"
          index="05"
          title={
            <>
              One engineering core, <span className="t-serif">many</span> capabilities.
            </>
          }
          lead="Software engineering sits at the centre of everything. AI, cloud, blockchain, mobile, web and automation connect to it — not the other way around."
          split
        />

        {/* Desktop diagram */}
        <Reveal className={styles.diagram} variant="scale">
          <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden="true">
            <defs>
              <radialGradient id="tech-core" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx={cx0} cy={cy0} rx={R} ry={RY} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="2 6" />
            <circle cx={cx0} cy={cy0} r="150" fill="url(#tech-core)" />
            {positions.map((p) => {
              const on = active === p.id;
              return (
                <line
                  key={p.id}
                  x1={cx0}
                  y1={cy0}
                  x2={p.x}
                  y2={p.y}
                  className={cx(styles.edge, on && styles.edgeOn, active && !on && styles.edgeOff)}
                />
              );
            })}
            {positions.map((p) => {
              const on = active === p.id;
              return (
                <circle
                  key={`${p.id}-dot`}
                  cx={p.x}
                  cy={p.y}
                  r={on ? 6 : 4}
                  className={cx(styles.dot, on && styles.dotOn, active && !on && styles.dotOff)}
                />
              );
            })}
            <circle cx={cx0} cy={cy0} r="6" fill="var(--accent)" />
            <circle cx={cx0} cy={cy0} r="16" fill="none" stroke="var(--accent)" strokeOpacity="0.45" />
          </svg>

          <div className={styles.labels}>
            <div className={cx("glass", "glass--l2", styles.core, active && styles.coreOn)} style={{ left: `${(cx0 / W) * 100}%`, top: `${(cy0 / H) * 100}%` }}>
              <span className="num">CORE</span>
              <strong>{technology.core}</strong>
            </div>
            {positions.map((p, i) => {
              const left = (p.x / W) * 100;
              const top = (p.y / H) * 100;
              // Labels sit outside the ring: above/below near the poles, left/right elsewhere.
              const side = Math.abs(left - 50) < 16 ? (top < 50 ? "top" : "bottom") : left < 50 ? "left" : "right";
              return (
                <div
                  key={p.id}
                  className={cx(
                    "glass",
                    "glass--l1",
                    "glass--interactive",
                    styles.node,
                    styles[`node_${side}`],
                    active === p.id && styles.nodeOn,
                    active && active !== p.id && styles.nodeOff,
                  )}
                  style={{ left: `${left}%`, top: `${top}%`, ["--i" as string]: i } as React.CSSProperties}
                  onPointerEnter={() => setActive(p.id)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(p.id)}
                  onBlur={() => setActive(null)}
                  tabIndex={0}
                >
                  <span className="num">0{i + 1}</span>
                  <strong>{p.label}</strong>
                  <span className={styles.note}>{p.note}</span>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Mobile list */}
        <ol className={styles.list} aria-label="Technology ecosystem">
          <li className={styles.listCore}>
            <span className="num">CORE</span>
            <strong>{technology.core}</strong>
          </li>
          {nodes.map((n, i) => (
            <Reveal as="li" key={n.id} className={styles.listItem} delay={i * 40}>
              <span className="num">0{i + 1}</span>
              <div>
                <strong>{n.label}</strong>
                <span className={styles.note}>{n.note}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

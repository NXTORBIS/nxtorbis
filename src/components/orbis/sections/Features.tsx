"use client";

import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisCapabilities, orbisCopy, orbisFeatures, type OrbisCapabilityId } from "@/content/orbis";
import { OrbSlot } from "../orb/OrbStage";
import { useInView } from "../shared";
import styles from "../Orbis.module.css";

const v = (name: string, value: string) => ({ [name]: value }) as CSSProperties;

/**
 * Built around you. Seven compositions, one per capability. The Orb travels
 * into each one and becomes that capability (see ORB_STATES); the DOM layer
 * around it adds a restrained illustration. Nothing here shows data — no
 * counts, no metrics, no invented content inside the fragments.
 */
export function OrbisFeatures() {
  return (
    <section id="features" className={cx(styles.section, styles.features)} aria-labelledby="orbis-features-title">
      <div className="container">
        <Reveal as="h2" id="orbis-features-title" className={cx(styles.sectionTitle, styles.center)}>
          {orbisCopy.features.heading}
        </Reveal>
      </div>
      {orbisFeatures.map((feature, i) => (
        <FeatureComposition key={feature.id} id={feature.id} title={feature.title} copy={feature.copy} index={i} />
      ))}
    </section>
  );
}

function FeatureComposition({ id, title, copy, index }: { id: OrbisCapabilityId; title: string; copy: string; index: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  return (
    <article className={cx(styles.feature, index % 2 === 1 && styles.featureFlip, inView && styles.inView)} aria-labelledby={`orbis-feature-${id}`}>
      <div className={cx("container", styles.featureGrid)}>
        <div className={styles.featureText}>
          <Reveal as="p" className={cx("eyebrow", styles.featureIndex)} variant="fade">
            {String(index + 1).padStart(2, "0")}
          </Reveal>
          <Reveal as="h3" id={`orbis-feature-${id}`} className={styles.featureTitle}>
            {title}
          </Reveal>
          <Reveal as="p" className={styles.featureCopy} delay={120}>
            {withOrbisLogo(copy)}
          </Reveal>
        </div>
        <div ref={ref} className={styles.featureStage}>
          <FeatureVisual id={id} />
          <div className={styles.featureOrb}>
            <OrbSlot state={id} />
          </div>
        </div>
      </div>
    </article>
  );
}

const MEMORY_NODES: [number, number][] = [[20, 30], [38, 14], [62, 12], [84, 26], [92, 52], [80, 78], [58, 90], [34, 88], [12, 70], [8, 46], [46, 34], [58, 64]];
const MEMORY_EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [0, 10], [2, 10], [10, 11], [11, 5], [11, 7], [10, 4]];
const LEARN_POINTS: [number, number][] = [[10, 82], [27, 67], [42, 58], [57, 40], [73, 38], [90, 14]];

function FeatureVisual({ id }: { id: OrbisCapabilityId }) {
  switch (id) {
    case "ai":
      return (
        <svg className={cx(styles.fx, styles.fxFlow)} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M4,50 C24,20 40,80 50,50 S76,20 96,50" vectorEffect="non-scaling-stroke" />
          <path d="M50,4 C80,24 20,40 50,50 S80,76 50,96" vectorEffect="non-scaling-stroke" />
          <path d="M12,18 C34,34 40,44 50,50 S70,74 88,84" vectorEffect="non-scaling-stroke" />
          <path d="M88,16 C66,34 60,44 50,50 S30,70 12,86" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "workspace":
      return (
        <div className={styles.fx} aria-hidden="true">
          {["Project", "Tasks", "Document", "Activity"].map((label, i) => (
            <div key={label} className={cx(styles.panel, styles[`p${i + 1}`])}>
              <span className={styles.panelLabel}>{label}</span>
              <i />
              <i />
              <i />
            </div>
          ))}
        </div>
      );
    case "memory":
      return (
        <svg className={cx(styles.fx, styles.fxDraw)} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {MEMORY_EDGES.map(([a, b], i) => (
            <line
              key={`${a}-${b}`}
              x1={MEMORY_NODES[a][0]}
              y1={MEMORY_NODES[a][1]}
              x2={MEMORY_NODES[b][0]}
              y2={MEMORY_NODES[b][1]}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              style={v("--d", `${i * 90}ms`)}
            />
          ))}
          {MEMORY_NODES.map(([x, y], i) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" style={v("--d", `${300 + i * 80}ms`)} />
          ))}
        </svg>
      );
    case "files":
      return (
        <div className={styles.fx} aria-hidden="true">
          {[".md", ".txt", ".ts", ".json", ".py"].map((ext, i) => (
            <div key={ext} className={cx(styles.fileCard, styles[`f${i + 1}`])}>
              <span className={styles.fileExt}>{ext}</span>
            </div>
          ))}
        </div>
      );
    case "tools":
      return (
        <svg className={cx(styles.fx, styles.fxTools)} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <circle className={styles.toolTrack} cx="50" cy="50" r="44" vectorEffect="non-scaling-stroke" />
          {[0, 72, 144, 216, 288].map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            const x = +(50 + Math.cos(a) * 44).toFixed(3);
            const y = +(50 + Math.sin(a) * 44).toFixed(3);
            return (
              <g key={deg} transform={`translate(${x - 4} ${y - 4})`} className={styles.toolGlyph}>
                {i === 0 && <><rect x="0" y="0" width="8" height="8" rx="1" vectorEffect="non-scaling-stroke" /><path d="M2 3h4M2 5.5h1M5 5.5h1" vectorEffect="non-scaling-stroke" /></>}
                {i === 1 && <path d="M1 2.5h6l-1.5-1.5M7 5.5H1l1.5 1.5" vectorEffect="non-scaling-stroke" />}
                {i === 2 && <><circle cx="4" cy="4" r="3.5" vectorEffect="non-scaling-stroke" /><path d="M4 2v2l1.5 1" vectorEffect="non-scaling-stroke" /></>}
                {i === 3 && <path d="M1 2h6M1 4h4M1 6h3M5.5 6l1 1 1.5-2" vectorEffect="non-scaling-stroke" />}
                {i === 4 && <path d="M4.5 0.5 1.5 4.5h2.5l-0.5 3 3-4H4z" vectorEffect="non-scaling-stroke" />}
              </g>
            );
          })}
        </svg>
      );
    case "learning":
      return (
        <svg className={cx(styles.fx, styles.fxLearn)} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M10,82 C20,70 22,72 27,67 S36,60 42,58 S52,44 57,40 S66,36 73,38 S86,22 90,14" vectorEffect="non-scaling-stroke" />
          <path className={styles.learnProgress} d="M10,82 C20,70 22,72 27,67 S36,60 42,58 S52,44 57,40 S66,36 73,38 S86,22 90,14" pathLength={1} vectorEffect="non-scaling-stroke" />
          {LEARN_POINTS.map(([x, y], i) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" vectorEffect="non-scaling-stroke" style={v("--d", `${400 + i * 350}ms`)} />
          ))}
        </svg>
      );
    case "voice":
      return (
        <div className={cx(styles.fx, styles.fxWave)} aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              className={styles.waveBar}
              style={{ ["--d" as string]: `${(-i * 0.13).toFixed(2)}s`, ["--h" as string]: (0.35 + 0.6 * Math.abs(Math.sin(i * 1.7))).toFixed(3) } as CSSProperties}
            />
          ))}
        </div>
      );
  }
}

/** More than software. The page's quietest, darkest moment: the Orb alone, the capabilities fading in around it. */
export function OrbisMore() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  return (
    <section className={cx(styles.section, styles.more, inView && styles.inView)} aria-labelledby="orbis-more-title">
      <div className={cx("container", styles.moreInner)}>
        <Reveal as="h2" id="orbis-more-title" className={styles.statement}>
          {orbisCopy.more.heading}
        </Reveal>
        <div ref={ref} className={styles.moreStage}>
          <div className={styles.moreOrb}>
            <OrbSlot state="cinematic" />
          </div>
          <ul className={styles.moreLabels} aria-hidden="true">
            {orbisCapabilities.map((c, i) => {
              const a = ((-90 + (i * 360) / orbisCapabilities.length) * Math.PI) / 180;
              return (
                <li
                  key={c.id}
                  className={styles.moreLabel}
                  style={{
                    ["--x" as string]: `${(50 + Math.cos(a) * 48).toFixed(3)}%`,
                    ["--y" as string]: `${(50 + Math.sin(a) * 48).toFixed(3)}%`,
                    ["--d" as string]: `${300 + i * 260}ms`,
                  } as CSSProperties}
                >
                  {c.label}
                </li>
              );
            })}
          </ul>
        </div>
        <Reveal as="p" className={cx(styles.lead, styles.center)} delay={120}>
          {withOrbisLogo(orbisCopy.more.text)}
        </Reveal>
      </div>
    </section>
  );
}

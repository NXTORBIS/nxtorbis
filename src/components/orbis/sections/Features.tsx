"use client";

import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisCapabilities, orbisCopy, orbisFeatures, type OrbisCapabilityId } from "@/content/orbis";
import { useOrbisReleases } from "@/lib/orbisReleases";
import { OrbSlot } from "../orb/OrbStage";
import { useInView } from "../shared";
import { useTilt } from "../useTilt";
import { FeatureVisual } from "./FeatureVisuals";
import styles from "../Orbis.module.css";

/**
 * What is inside. One composition per headline feature, taken from the app's
 * own capability registry: the Orb travels into each one and becomes that
 * feature (see ORB_STATES), with a drawing of that world around it. Nothing
 * here shows data, and nothing claims an interface Orbis does not have.
 */
export function OrbisFeatures() {
  // Six of the eight arrive in 5.0.0. While the published release is older than
  // that, the page says so and marks them, rather than describing a build that
  // cannot be downloaded yet.
  const { state } = useOrbisReleases();
  const published = state.status === "ready" ? state.releases[0]?.version ?? null : null;
  const shipped = published ? Number(published.split(".")[0]) >= 5 : false;

  return (
    <section id="features" className={cx(styles.section, styles.features)} aria-labelledby="orbis-features-title">
      <div className="container" data-rail="what is inside">
        <Reveal as="h2" id="orbis-features-title" className={cx(styles.sectionTitle, styles.center)}>
          {orbisCopy.features.heading}
        </Reveal>
        {!shipped && published && (
          <Reveal as="p" className={cx(styles.upcomingNote, styles.center)} variant="fade" delay={80}>
            {withOrbisLogo(orbisCopy.features.upcomingNote.replace("{version}", published))}
          </Reveal>
        )}
      </div>
      {orbisFeatures.map((feature, i) => (
        <FeatureComposition
          key={feature.id}
          id={feature.id}
          title={feature.title}
          copy={feature.copy}
          index={i}
          upcoming={Boolean(feature.upcoming) && !shipped}
        />
      ))}
    </section>
  );
}

function FeatureComposition({ id, title, copy, index, upcoming }: { id: OrbisCapabilityId; title: string; copy: string; index: number; upcoming: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const tilt = useTilt<HTMLDivElement>(6);
  return (
    <article
      className={cx(styles.feature, index % 2 === 1 && styles.featureFlip, inView && styles.inView)}
      aria-labelledby={`orbis-feature-${id}`}
      // The chapter numeral behind the act, and the temperature this world is
      // graded to (see .feature[data-world] in Orbis.module.css).
      data-chapter={String(index + 1).padStart(2, "0")}
      data-world={id}
    >
      <div className={cx("container", styles.featureGrid)}>
        <div className={styles.featureText}>
          <Reveal as="p" className={cx("eyebrow", styles.featureIndex)} variant="fade">
            {String(index + 1).padStart(2, "0")}
          </Reveal>
          <Reveal as="h3" id={`orbis-feature-${id}`} className={styles.featureTitle}>
            {title}
          </Reveal>
          {upcoming && (
            <Reveal as="p" className={styles.upcomingBadge} variant="fade" delay={60}>
              {orbisCopy.features.upcomingBadge}
            </Reveal>
          )}
          <Reveal as="p" className={styles.featureCopy} delay={120}>
            {withOrbisLogo(copy)}
          </Reveal>
        </div>
        <div
          ref={(node) => {
            ref.current = node;
            tilt.current = node;
          }}
          className={styles.featureStage}
          data-cursor="drawing"
        >
          <div className={styles.featureDepth}>
            <FeatureVisual id={id} />
          </div>
          <div className={styles.featureOrb}>
            <OrbSlot state={id} />
          </div>
        </div>
      </div>
    </article>
  );
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

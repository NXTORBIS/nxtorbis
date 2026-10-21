"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisCopy, orbisFeatures } from "@/content/orbis";
import { OrbSlot } from "../orb/OrbStage";
import { useInView } from "../shared";
import { FeatureVisual } from "./FeatureVisuals";
import styles from "../Orbis.module.css";

/**
 * All eight at once.
 *
 * The same drawings the page has shown one at a time, running together in a
 * grid, then drawn inward as the Orb takes the middle — eight worlds becoming
 * one window, which is the whole argument of the page in one picture.
 *
 * It reuses FeatureVisual rather than copying it, so a change to any drawing
 * shows here too. Everything is CSS; the cells only animate while the section
 * is in view, and reduced motion keeps the grid and drops the gathering.
 */
export function OrbisGathering() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [settled, setSettled] = useState(false);
  // How many have arrived. They are mounted one at a time rather than all at
  // once: eight drawings starting together dropped the page to 25fps for the
  // length of the reveal, and arriving in turn is the better picture anyway.
  const [arrived, setArrived] = useState(0);
  const grid = useRef<HTMLDivElement | null>(null);

  // The planets and flights are SMIL, which the CSS above cannot reach. They
  // are let run while the grid assembles, then frozen where they stand.
  // The finale is a reveal, not a loop. Once the eight have gathered, every
  // drawing holds where it stands: eight running at once cost about fifteen
  // frames a second, and a still grid says the same thing.
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const step = window.setInterval(() => {
      i += 1;
      setArrived(i);
      if (i >= orbisFeatures.length) window.clearInterval(step);
    }, 260);
    return () => window.clearInterval(step);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => {
      grid.current?.querySelectorAll("svg").forEach((svg) => svg.pauseAnimations());
      setSettled(true);
    }, orbisFeatures.length * 260 + 1800);
    return () => window.clearTimeout(t);
  }, [inView]);

  return (
    <section className={cx(styles.section, styles.gathering, inView && styles.inView, settled && styles.gatherSettled)} aria-labelledby="orbis-gathering-title">
      <div className="container">
        <Reveal as="h2" id="orbis-gathering-title" className={cx(styles.sectionTitle, styles.center)}>
          {orbisCopy.gathering.heading}
        </Reveal>
        <Reveal as="p" className={cx(styles.lead, styles.center, styles.gatheringLead)} delay={100}>
          {withOrbisLogo(orbisCopy.gathering.text)}
        </Reveal>

        <div ref={ref} className={styles.gatherStage}>
          <div ref={grid} className={styles.gatherGrid}>
            {orbisFeatures.map((feature, i) => (
              <div key={feature.id} className={cx(styles.gatherCell, i < arrived && styles.gatherCellIn)} style={{ ["--i" as string]: String(i) }}>
                <span className={styles.gatherLabel}>{feature.title}</span>
                <div className={styles.gatherArt}>{i < arrived && <FeatureVisual id={feature.id} compact />}</div>
              </div>
            ))}
          </div>
          <div className={styles.gatherOrb}>
            <OrbSlot state="cinematic" />
          </div>
        </div>
      </div>
    </section>
  );
}

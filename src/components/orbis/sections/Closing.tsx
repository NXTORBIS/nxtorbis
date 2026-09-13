"use client";

import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisCopy } from "@/content/orbis";
import { OrbSlot } from "../orb/OrbStage";
import { goToDownload } from "../shared";
import styles from "../Orbis.module.css";

/** Orbis belongs to NxtOrbis. Deliberately quiet — a reminder, not a second page. */
export function OrbisEcosystem() {
  return (
    <section className={cx(styles.section, styles.ecosystem)} aria-labelledby="orbis-eco-title">
      <div className={cx("container", styles.ecoInner)}>
        <Reveal as="p" className="eyebrow" variant="fade">
          {orbisCopy.label}
        </Reveal>
        <Reveal as="h2" id="orbis-eco-title" className={cx(styles.sectionTitle, styles.ecoTitle)}>
          {withOrbisLogo(orbisCopy.ecosystem.heading, { display: true })}
        </Reveal>
        <Reveal as="p" className={cx(styles.muted, styles.center)} delay={100}>
          {orbisCopy.ecosystem.text}
        </Reveal>
        <Reveal delay={180}>
          <Button href="/" variant="secondary" size="md" arrow>
            {orbisCopy.ecosystem.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/** Ready for Orbis? The Orb large and alone again, and the two actions that matter. */
export function OrbisFinal() {
  return (
    <section className={cx(styles.section, styles.final)} aria-labelledby="orbis-final-title">
      <div className={cx("container", styles.finalInner)}>
        <Reveal as="p" className="eyebrow" variant="fade">
          {orbisCopy.label}
        </Reveal>
        <div className={styles.finalOrb}>
          <OrbSlot state="final" />
        </div>
        <Reveal as="h2" id="orbis-final-title" className={styles.statement}>
          {withOrbisLogo(orbisCopy.final.heading, { display: true })}
        </Reveal>
        <Reveal as="p" className={cx(styles.lead, styles.center)} delay={100}>
          {orbisCopy.final.support}
        </Reveal>
        <Reveal className={styles.actions} delay={180}>
          {/* Glass, not the cream primary: the Orbis logo is white artwork made for dark grounds. */}
          <Button variant="secondary" size="lg" intensity="hero" arrow onClick={goToDownload}>
            {withOrbisLogo(orbisCopy.hero.primary)}
          </Button>
          <Button href="/" variant="ghost" size="lg" arrow>
            {orbisCopy.ecosystem.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

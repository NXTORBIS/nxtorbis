"use client";

import { useLayoutEffect, useState, type CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { orbisCopy, orbisPlatforms } from "@/content/orbis";
import { useOrbisReleases } from "@/lib/orbisReleases";
import { OrbSlot } from "../orb/OrbStage";
import { goToDownload, platformsOf, scrollToId } from "../shared";
import styles from "../Orbis.module.css";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

/**
 * Hero. The Orb forms first (point → gathering → sphere → energy → rings), then
 * the name, tagline, supporting line and actions arrive in that order — timed
 * against ORB_INTRO_MS so the copy lands as the Orb completes.
 *
 * The copy is hidden before paint only when the intro will actually play; on
 * a deep link, under reduced motion, or without scripting it is simply there.
 */
export function OrbisHero() {
  const [intro, setIntro] = useState<"pending" | "play" | "instant">("pending");
  const { state } = useOrbisReleases();

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIntro(!reduced && window.scrollY < window.innerHeight * 0.5 ? "play" : "instant");
  }, []);

  const platforms = state.status === "ready" ? platformsOf(state.releases[0]).map((p) => orbisPlatforms[p.platform].label) : [];

  return (
    <section className={cx(styles.hero, intro === "play" && styles.introOn, intro === "instant" && styles.introInstant)} aria-labelledby="orbis-title">
      <div className={cx("container", styles.heroGrid)}>
        <div className={cx(styles.heroText, styles.introGroup)}>
          <p className={cx("eyebrow", styles.label)} style={delay(1000)}>
            {orbisCopy.label}
          </p>
          {/* The original Orbis logo is the heading. Its alt text keeps the name
              "Orbis" for search engines and screen readers. */}
          <h1 id="orbis-title" className={styles.heroTitle} style={delay(1080)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.heroLogo} src="/orbis/orbis-logo.png" alt={orbisCopy.hero.title} width={1321} height={399} fetchPriority="high" />
          </h1>
          <p className={styles.tagline} style={delay(1260)}>
            {orbisCopy.hero.tagline}
          </p>
          <p className={styles.support} style={delay(1400)}>
            {orbisCopy.hero.support}
          </p>
          <p className={styles.heroDesc} style={delay(1500)}>
            {orbisCopy.hero.description}
          </p>
        </div>

        <div className={styles.heroOrb}>
          <OrbSlot state="hero" interactive />
        </div>

        <div className={cx(styles.heroActions, styles.introGroup)}>
          <div className={styles.actions} style={delay(1650)}>
            <Button variant="primary" size="lg" intensity="hero" arrow onClick={goToDownload}>
              {orbisCopy.hero.primary}
            </Button>
            <Button variant="ghost" size="lg" arrow onClick={() => scrollToId("intro")}>
              {orbisCopy.hero.secondary}
            </Button>
          </div>
          <p className={styles.platforms} style={delay(1780)} aria-live="polite">
            {platforms.length > 0 ? `Available for ${platforms.join(" · ")}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

/** "This is Orbis." Quiet on purpose: type, space, and the Orb drifting beside it. */
export function OrbisIntro() {
  return (
    <section id="intro" className={cx(styles.section, styles.intro)} aria-labelledby="orbis-intro-title">
      <div className={cx("container", styles.introGrid)}>
        <div className={styles.introText}>
          <Reveal as="h2" id="orbis-intro-title" className={styles.statement} variant="clip">
            {orbisCopy.intro.heading}
          </Reveal>
          <Reveal as="p" className={styles.lead} delay={120}>
            {orbisCopy.intro.support}
          </Reveal>
          <Reveal as="p" className={styles.muted} delay={220}>
            {orbisCopy.intro.detail}
          </Reveal>
        </div>
        <div className={styles.introOrb}>
          <OrbSlot state="interactive" />
        </div>
      </div>
    </section>
  );
}

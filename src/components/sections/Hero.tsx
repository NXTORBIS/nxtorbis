import { company, cta } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/lib/Reveal";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { HeroMotion } from "./HeroMotion";
import { MaskedTitle } from "@/components/ui/MaskedTitle";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.visual} aria-hidden="true">
        <HeroVisual />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.light} aria-hidden="true" />
      <HeroMotion />

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <Reveal as="p" className={`eyebrow ${styles.eyebrow}`} variant="fade">
            {company.legalName}
          </Reveal>

          <MaskedTitle
            id="hero-title"
            className={`t-display ${styles.title}`}
            delay={160}
            lines={[
              "Building",
              <>
                what’s&nbsp;<em>next.</em>
              </>,
            ]}
          />

          <Reveal as="p" className={`t-lead ${styles.lead}`} delay={160}>
            A software development and software product company. We engineer custom software, mobile
            applications and our own products — combining software engineering with AI, blockchain and cloud.
          </Reveal>

          <Reveal className={styles.actions} delay={240}>
            <Button href={cta.primary.href} variant="primary" size="lg" arrow intensity="hero" magnetic fillFrom="left">
              {cta.primary.label}
            </Button>
            <Button href={cta.secondary.href} variant="ghost" arrow>
              {cta.secondary.label}
            </Button>
          </Reveal>
        </div>
      </div>

      <Reveal className={styles.foot} variant="fade" delay={500}>
        <span className={styles.footLine} aria-hidden="true" />
        <p className={styles.tagline}>Software · Products · Intelligence</p>
        <span className={styles.footLine} aria-hidden="true" />
      </Reveal>
    </section>
  );
}

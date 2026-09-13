import { about, company, cta } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/lib/Reveal";
import styles from "./Intro.module.css";

export function Intro() {
  return (
    <section id="intro" className={`section ${styles.section}`} aria-labelledby="intro-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.left}>
          <Reveal as="p" className="eyebrow" variant="fade">
            <span>Who we are</span>
            <span className="eyebrow-index">01</span>
          </Reveal>
        </div>

        <div className={styles.right}>
          <Reveal variant="clip">
            <h2 id="intro-title" className={`t-h1 ${styles.title}`}>
              We turn ideas and challenges into <span className="t-serif">useful</span> technology.
            </h2>
          </Reveal>

          <div className={styles.body}>
            <Reveal as="p" className="t-lead" delay={80}>
              {about.intro}
            </Reveal>
            <Reveal as="p" className="t-body" delay={140}>
              {about.expertise}
            </Reveal>
          </div>

          <Reveal className={styles.foot} variant="right" delay={200}>
            <ul className={styles.caps} aria-label="Capability ecosystem">
              {company.capabilities.map((c) => (
                <li key={c} className="glass glass--l1 glass--pill">{c}</li>
              ))}
            </ul>
            <Button href={cta.about.href} variant="ghost" arrow>
              {cta.about.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

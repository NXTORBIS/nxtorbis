import type { Metadata } from "next";
import { about, company, cta, seo, services } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CultureSection } from "@/components/sections/CultureSection";
import { CTASection } from "@/components/sections/CTASection";
import { MissionList } from "@/components/sections/MissionList";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({ ...seo.about, path: "/about" });

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About NxtOrbis"
        title={
          <>
            Technology <span className="t-serif">with</span> purpose.
          </>
        }
        lead={about.intro}
        meta={company.capabilities.map((c, i) => (
          <span key={c} className={styles.metaItem}>
            <span className="num">0{i + 1}</span> {c}
          </span>
        ))}
      />

      {/* Company statement */}
      <section className={`section ${styles.statement}`} aria-labelledby="statement-title">
        <div className={`container ${styles.statementGrid}`}>
          <div>
            <Reveal as="p" className="eyebrow" variant="fade">
              Company statement
            </Reveal>
          </div>
          <div className={styles.statementBody}>
            <Reveal variant="clip">
              <h2 id="statement-title" className="t-h2">
                A software development and software product company — with the emphasis on{" "}
                <span className="t-serif">building.</span>
              </h2>
            </Reveal>
            <div className={styles.statementCols}>
              <Reveal as="p" className="t-lead" delay={80}>
                {about.expertise}
              </Reveal>
              <Reveal as="p" className="t-body" delay={140}>
                {about.team}
              </Reveal>
              <Reveal as="p" className="t-body" delay={200}>
                {about.productsLine}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className={`section ${styles.capabilities}`} aria-labelledby="capabilities-title">
        <div className="container">
          <SectionHeading
            id="capabilities-title"
            eyebrow="Capabilities"
            title={
              <>
                Six ways we <span className="t-serif">build.</span>
              </>
            }
            lead="Every engagement draws on the same engineering discipline, whatever the platform or technology."
            action={
              <Button href={cta.services.href} variant="ghost" arrow>
                {cta.services.label}
              </Button>
            }
            split
          />
          <ol className={styles.capList}>
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} className={styles.capItem} delay={i * 40}>
                <span className="num">{s.index}</span>
                <h3 className={styles.capTitle}>{s.title}</h3>
                <p className={`t-sm ${styles.capBody}`}>{s.short}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Vision */}
      <section className={`section ${styles.vision}`} aria-labelledby="vision-title">
        <div className={`container ${styles.visionInner}`}>
          <Reveal as="p" className="eyebrow" variant="fade">
            Vision
          </Reveal>
          <Reveal variant="clip">
            <h2 id="vision-title" className={styles.visionText}>
              <span className="t-serif">“</span>
              {about.vision}
              <span className="t-serif">”</span>
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className={`section ${styles.mission}`} aria-labelledby="mission-title">
        <div className="container">
          <SectionHeading
            id="mission-title"
            eyebrow="Mission"
            title={
              <>
                Four verbs we <span className="t-serif">live by.</span>
              </>
            }
            split
          />
          <MissionList />
        </div>
      </section>

      <CultureSection full />

      <CTASection
        title={
          <>
            Let’s build something <span className="t-serif">useful.</span>
          </>
        }
        body="Whether you have a defined brief or an early idea, we would like to hear about it."
      />
    </>
  );
}

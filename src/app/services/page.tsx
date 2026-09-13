import type { Metadata } from "next";
import { cta, seo, services } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CTASection } from "@/components/sections/CTASection";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({ ...seo.services, path: "/services" });

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Engineering across the <span className="t-serif">whole</span> stack.
          </>
        }
        lead="We provide innovative, high-performance and scalable software solutions tailored to the evolving needs of modern businesses — using current technologies, industry best practices and agile methodologies to help organisations improve efficiency, security and digital transformation."
        aside={
          <nav aria-label="Services on this page" className={styles.jump}>
            {services.map((s) => (
              <a key={s.id} href={`#${s.slug}`} className={styles.jumpLink}>
                <span className="num">{s.index}</span>
                <span>{s.title}</span>
              </a>
            ))}
          </nav>
        }
      />

      <div className={styles.list}>
        {services.map((s, i) => (
          <section key={s.id} id={s.slug} className={styles.service} aria-labelledby={`${s.slug}-title`}>
            <div className={`container ${styles.serviceGrid} ${i % 2 ? styles.flip : ""}`}>
              <Reveal className={styles.serviceVisual} variant="fade">
                <ServiceGlyph kind={s.glyph} />
              </Reveal>
              <div className={styles.serviceCopy}>
                <Reveal as="p" className="num" variant="fade">
                  {s.index} / 06
                </Reveal>
                <Reveal>
                  <h2 id={`${s.slug}-title`} className={`t-h1 ${styles.serviceTitle}`}>
                    {s.title}
                  </h2>
                </Reveal>
                <Reveal as="p" className="t-lead" delay={80}>
                  {s.description}
                </Reveal>
                <Reveal as="p" className="t-body" delay={140}>
                  {s.detail}
                </Reveal>
                <Reveal delay={200}>
                  <Button href={`/contact?service=${encodeURIComponent(s.title)}`} variant="secondary" arrow fillFrom="bottom">
                    Discuss {s.title.toLowerCase()}
                  </Button>
                </Reveal>
              </div>
            </div>
          </section>
        ))}
      </div>

      <ProcessTimeline />

      <CTASection
        title={
          <>
            Have a project <span className="t-serif">in mind?</span>
          </>
        }
        body="Tell us what you are trying to build and which platforms matter. We will come back with a clear next step."
        primary={cta.primary}
        secondary={cta.quote}
      />
    </>
  );
}

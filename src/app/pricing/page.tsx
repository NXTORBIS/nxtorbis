import type { Metadata } from "next";
import { advocatePlans, cta, pricingFactors, seo } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTASection } from "@/components/sections/CTASection";
import { Check } from "@/components/ui/Icons";
import { cx } from "@/lib/cx";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({ ...seo.pricing, path: "/pricing" });

const steps = [
  { index: "01", title: "Tell us about the project", body: "A short description of the problem, the users and the platforms is enough to start." },
  { index: "02", title: "We shape the scope together", body: "We ask the questions that matter, and agree what the first version should — and should not — do." },
  { index: "03", title: "You receive a clear proposal", body: "A proposal based on the actual scope, complexity and requirements — not a generic package." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Pricing that starts with the <span className="t-serif">problem.</span>
          </>
        }
        lead="No two software projects carry the same scope, so we do not publish generic project packages. Pricing is shaped by what you actually need to build — and we would rather have that conversation early."
        aside={
          <div className={styles.heroAction}>
            <Button href={cta.quote.href} variant="primary" size="lg" arrow intensity="major" fillFrom="bottom">
              {cta.quote.label}
            </Button>
            <p className="t-xs">Free, no-obligation conversation.</p>
          </div>
        }
      />

      {/* Factors */}
      <section className={`section ${styles.factors}`} aria-labelledby="factors-title">
        <div className="container">
          <SectionHeading
            id="factors-title"
            eyebrow="What shapes a quote"
            title={
              <>
                Seven things that <span className="t-serif">move</span> the number.
              </>
            }
            lead="Project pricing depends on the shape of the work. These are the factors we look at first."
            split
          />
          <ol className={styles.factorList}>
            {pricingFactors.map((f, i) => (
              <Reveal as="li" key={f.title} className={styles.factor} delay={i * 40}>
                <span className="num">0{i + 1}</span>
                <h3 className={styles.factorTitle}>{f.title}</h3>
                <p className={`t-sm ${styles.factorBody}`}>{f.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* How it works */}
      <section className={`section ${styles.how}`} aria-labelledby="how-title">
        <div className={`container ${styles.howGrid}`}>
          <div className={styles.howIntro}>
            <Reveal as="p" className="eyebrow" variant="fade">
              How it works
            </Reveal>
            <Reveal>
              <h2 id="how-title" className="t-h2">
                From first message to <span className="t-serif">proposal.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <Button href={cta.quote.href} variant="secondary" arrow fillFrom="bottom">
                {cta.quote.label}
              </Button>
            </Reveal>
          </div>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <Reveal as="li" key={s.index} className={styles.step} delay={i * 80}>
                <span className={styles.stepNum}>{s.index}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className="t-sm">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Advocate Office Management System plans — published on the existing site */}
      <section className={`section ${styles.plans}`} id="advocate-plans" aria-labelledby="plans-title">
        <div className="container">
          <SectionHeading
            id="plans-title"
            eyebrow="Product plans"
            title={
              <>
                {advocatePlans.productName} <span className="t-serif">plans.</span>
              </>
            }
            lead={advocatePlans.intro}
            split
          />
          <div className={styles.planGrid}>
            {advocatePlans.plans.map((plan, i) => (
              <Reveal as="article" key={plan.name} className={cx("glass", "glass--l3", "glass--panel", "glass--interactive", styles.plan, "featured" in plan && plan.featured && styles.planFeatured)} variant="scale" delay={i * 80}>
                <header className={styles.planHead}>
                  <span className="num">0{i + 1}</span>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planPrice}>
                    <span className={styles.planCurrency}>{advocatePlans.currency}</span>
                    <span className={styles.planAmount}>{plan.price}</span>
                    <span className={styles.planPeriod}>{advocatePlans.period}</span>
                  </p>
                  <p className="t-sm">{plan.audience}</p>
                </header>
                <ul className={styles.planList}>
                  {plan.includes.map((item) => (
                    <li key={item}>
                      <Check size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href={`/contact?intent=product&product=${encodeURIComponent(`${advocatePlans.productName} — ${plan.name} plan`)}`}
                  variant={"featured" in plan && plan.featured ? "primary" : "secondary"}
                  arrow
                  className={styles.planCta}
                >
                  {plan.action}
                </Button>
              </Reveal>
            ))}
          </div>
          <p className={`t-xs ${styles.planNote}`}>
            Plans apply to the Advocate Office Management System only. Custom software, product development and
            other services are quoted per project.
          </p>
        </div>
      </section>

      <CTASection
        title={
          <>
            Let’s talk about <span className="t-serif">scope.</span>
          </>
        }
        body="Send a few lines about your project and we will respond with the questions that shape a fair quote."
        primary={cta.quote}
        secondary={cta.contact}
      />
    </>
  );
}

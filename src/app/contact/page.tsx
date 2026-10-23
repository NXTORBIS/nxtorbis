import type { Metadata } from "next";
import { Suspense } from "react";
import { contactAfter, seo } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { Reveal } from "@/lib/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({ ...seo.contact, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Have an idea worth <span className="t-serif">building?</span>
          </>
        }
        lead="Tell us about the product, the problem or the idea. A few sentences are enough to start the conversation — we will come back with the questions that matter."
      />

      <section className={`section section--sm ${styles.after}`} aria-labelledby="contact-after-title">
        <div className="container">
          <Reveal as="h2" id="contact-after-title" className={`t-h3 ${styles.afterTitle}`}>
            What happens when you send it.
          </Reveal>
          <ol className={styles.afterSteps}>
            {contactAfter.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 90}>
                <span className="num">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${styles.section}`} aria-label="Contact form and details">
        <div className={`container ${styles.grid}`}>
          <div className={styles.formCol}>
            <Reveal as="p" className="eyebrow" variant="fade">
              Tell us about your project
            </Reveal>
            <Suspense fallback={<div className={styles.formSkeleton} aria-hidden="true" />}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className={styles.detailsCol} aria-label="Contact details">
            <Reveal as="p" className="eyebrow" variant="fade">
              Or reach us directly
            </Reveal>
            <ContactBlock />
          </aside>
        </div>
      </section>
    </>
  );
}

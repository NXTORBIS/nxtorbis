import type { Metadata } from "next";
import { Suspense } from "react";
import { seo } from "@/content/site";
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

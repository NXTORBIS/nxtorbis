import type { Metadata } from "next";
import { seo } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Hero } from "@/components/sections/Hero";
import { CredibilityStrip } from "@/components/sections/CredibilityStrip";
import { Intro } from "@/components/sections/Intro";
import { ServiceExplorer } from "@/components/sections/ServiceExplorer";
import { AISection } from "@/components/sections/AISection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { WhyNxtOrbis } from "@/components/sections/WhyNxtOrbis";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CultureSection } from "@/components/sections/CultureSection";
import { CTASection } from "@/components/sections/CTASection";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({ ...seo.home, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <Intro />
      <ServiceExplorer />
      <AISection />
      <ProductShowcase />
      <TechnologySection />
      <WhyNxtOrbis />
      <ProcessTimeline />
      <CultureSection />
      <CTASection />
      <section className={`section section--sm ${styles.contact}`} aria-labelledby="home-contact-title">
        <div className={`container ${styles.contactGrid}`}>
          <SectionHeading
            id="home-contact-title"
            eyebrow="Contact"
            title={
              <>
                Talk to <span className="t-serif">us.</span>
              </>
            }
            lead="Email us directly, or visit the contact page to tell us about your project."
            className={styles.contactHeading}
          />
          <ContactBlock />
        </div>
      </section>
    </>
  );
}

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
import { CTASection } from "@/components/sections/CTASection";

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
      <CTASection />
    </>
  );
}

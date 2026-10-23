import type { Metadata } from "next";
import { seo } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Hero } from "@/components/sections/Hero";
import { CredibilityStrip } from "@/components/sections/CredibilityStrip";
import { Intro } from "@/components/sections/Intro";
import { ServiceExplorer } from "@/components/sections/ServiceExplorer";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { WhyNxtOrbis } from "@/components/sections/WhyNxtOrbis";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = pageMeta({ ...seo.home, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <Intro />
      <ServiceExplorer />
      <ProductShowcase />
      <TechnologySection />
      <WhyNxtOrbis />
      <CTASection />
    </>
  );
}

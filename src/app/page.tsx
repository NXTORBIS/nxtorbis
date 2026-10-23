import type { Metadata } from "next";
import { seo } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Hero } from "@/components/sections/Hero";
import { CredibilityStrip } from "@/components/sections/CredibilityStrip";
import { Intro } from "@/components/sections/Intro";
import { HomeBelowFold } from "@/components/sections/BelowFold";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = pageMeta({ ...seo.home, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <Intro />
      <HomeBelowFold />
      <CTASection />
    </>
  );
}

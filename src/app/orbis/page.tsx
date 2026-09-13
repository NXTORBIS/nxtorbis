import type { Metadata } from "next";
import { company } from "@/content/site";
import { orbisSeo } from "@/content/orbis";
import { OrbisExperience } from "@/components/orbis/OrbisExperience";

const OG = { url: "/orbis/og-orbis.png", width: 1200, height: 630, alt: "Orbis — Intelligence, within reach." };

export const metadata: Metadata = {
  title: orbisSeo.title,
  description: orbisSeo.description,
  alternates: { canonical: "/orbis" },
  openGraph: {
    type: "website",
    siteName: company.legalName,
    title: orbisSeo.title,
    description: orbisSeo.description,
    url: "/orbis",
    images: [OG],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: orbisSeo.title,
    description: orbisSeo.description,
    images: [OG.url],
  },
};

/**
 * Structured data states only what is verified: the product, its publisher,
 * and the platform that has a release. Versions and downloads live in the
 * live release data, so nothing here can go stale into a false claim.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Orbis",
  description: orbisSeo.description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Windows 10, Windows 11",
  url: `${company.domain}/orbis`,
  publisher: { "@type": "Organization", name: company.legalName, url: company.domain },
};

export default function OrbisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <OrbisExperience />
    </>
  );
}

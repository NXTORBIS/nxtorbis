import type { Metadata } from "next";
import { company } from "@/content/site";

const OG_IMAGE = { url: "/brand/og-image.png", width: 1200, height: 630, alt: "NxtOrbis® — Building what’s next." };

/**
 * Builds complete per-page metadata. Next.js replaces (rather than merges)
 * nested objects like `openGraph` between layout and page, so every page
 * declares the full Open Graph / Twitter set here to keep the OG image.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: company.legalName,
      title,
      description,
      url: path,
      images: [OG_IMAGE],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

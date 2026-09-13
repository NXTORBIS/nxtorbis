import type { MetadataRoute } from "next";
import { company, products } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.domain;
  const lastModified = new Date();
  const pages = ["", "/about", "/services", "/products", "/ai", "/pricing", "/contact"];
  return [
    ...pages.map((p) => ({
      url: `${base}${p}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

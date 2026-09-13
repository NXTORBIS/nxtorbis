import type { MetadataRoute } from "next";
import { company, seo } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.legalName,
    short_name: company.shortName,
    description: seo.home.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0806",
    theme_color: "#0a0806",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

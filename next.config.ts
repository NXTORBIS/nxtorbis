import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Five separate stylesheets were blocking the first paint for about two
    // seconds between them (measured with Lighthouse). This inlines what the
    // page needs to render and loads the rest after.
    optimizeCss: true,
  },
};

export default nextConfig;

/**
 * Note: stop `npm run dev` before running `npm run build`.
 *
 * Both use the `.next` directory. Building while the dev server is running
 * replaces the chunks dev is still serving, and the browser then fails with
 * "Cannot find module './###.js'". If that happens, stop dev, delete `.next`,
 * and start dev again.
 */

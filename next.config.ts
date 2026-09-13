import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
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

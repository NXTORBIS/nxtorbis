/**
 * Prepares brand assets from the official source artwork in public/brand/source/.
 *
 *   nxtorbis-logo-dark.png   white wordmark with the ring as its O, for dark surfaces
 *   nxtorbis-logo-light.png  black wordmark with the ring as its O, for light surfaces
 *   nxtorbis-mark.png        the ring on its own
 *
 * The artwork is never redrawn or recoloured: the wordmarks are only trimmed
 * of their transparent margins, and the ring is only trimmed and centred. The
 * ring alone is used wherever a full wordmark cannot be read — the browser
 * tab, the home-screen icon, the PWA icons.
 *
 * Run: npm run assets
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/brand/source";
const OUT = "public/brand";
const BG = "#0a0806";

await mkdir(OUT, { recursive: true });

/** Trim transparent margins only. Returns the trimmed PNG and its size. */
async function trimmed(file) {
  const { data, info } = await sharp(`${SRC}/${file}`).trim({ threshold: 10 }).png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

// 1. Wordmarks — dark is what the site uses; light is kept ready for light surfaces.
// Shipped at 800px wide: the largest use is the entrance at about 350px, so
// this covers 2x screens without sending the full source to every visitor.
const dark = await trimmed("nxtorbis-logo-dark.png");
await sharp(dark.data).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${OUT}/nxtorbis-wordmark.png`);
const light = await trimmed("nxtorbis-logo-light.png");
await sharp(light.data).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${OUT}/nxtorbis-wordmark-light.png`);

// 2. The ring, trimmed and centred on a transparent square.
const ring = await trimmed("nxtorbis-mark.png");
const side = Math.max(ring.width, ring.height);
const square = await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: ring.data, gravity: "centre" }])
  .png()
  .toBuffer();
await sharp(square).toFile(`${OUT}/nxtorbis-mark.png`);

/**
 * Icons. The browser-tab favicon stays transparent so the ring sits naturally
 * on light and dark tab strips alike. Home-screen and PWA icons need a solid
 * tile — platforms fill transparency with black or white unpredictably — so
 * those sit on the site's own dark ground.
 */
async function icon(size, out, { bg = BG, pad = 0.16 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const g = await sharp(square).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const base = bg
    ? { create: { width: size, height: size, channels: 4, background: bg } }
    : { create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } };
  await sharp(base).composite([{ input: g, gravity: "centre" }]).png({ compressionLevel: 9 }).toFile(out);
}
await icon(64, "src/app/icon.png", { bg: null, pad: 0.04 });
await icon(180, "src/app/apple-icon.png");
await icon(192, `${OUT}/icon-192.png`);
await icon(512, `${OUT}/icon-512.png`);

// 3. Open Graph image 1200x630
const ogWordmark = await sharp(dark.data).resize({ width: 560 }).png().toBuffer();
const ogWordmarkH = Math.round((560 * dark.height) / dark.width);
const ogSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="78%" cy="20%" r="70%">
      <stop offset="0" stop-color="#edb166" stop-opacity=".28"/>
      <stop offset="1" stop-color="#0a0806" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0806"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g stroke="#ffffff" stroke-opacity=".08" fill="none">
    <line x1="80" y1="0" x2="80" y2="630"/><line x1="1120" y1="0" x2="1120" y2="630"/>
    <line x1="0" y1="80" x2="1200" y2="80"/><line x1="0" y1="550" x2="1200" y2="550"/>
  </g>
  <text x="120" y="${196 + ogWordmarkH + 96}" fill="#f7f3ec" font-family="Helvetica, Arial, sans-serif" font-size="58" font-weight="500" letter-spacing="-1">Building what’s next.</text>
  <text x="120" y="${196 + ogWordmarkH + 150}" fill="#b8b0a2" font-family="Helvetica, Arial, sans-serif" font-size="24">Software · Products · AI · Mobile · Blockchain · Cloud</text>
  <text x="120" y="512" fill="#857e72" font-family="Courier New, monospace" font-size="16" letter-spacing="3">NXTORBIS® TECHNOLOGIES PRIVATE LIMITED — CHENNAI, INDIA</text>
</svg>`);
const ogRing = await sharp(square).resize({ width: 300, height: 300, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
await sharp(ogSvg)
  .composite([
    { input: ogRing, left: 820, top: 165, blend: "screen" },
    { input: ogWordmark, left: 120, top: 196 },
  ])
  .png()
  .toFile(`${OUT}/og-image.png`);

console.log(JSON.stringify({ dark: [dark.width, dark.height], light: [light.width, light.height], ring: [ring.width, ring.height] }));

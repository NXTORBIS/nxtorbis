/**
 * Prepares brand + media assets from the original source files.
 * - Trims transparent margins from the official wordmark (no redraw, proportions untouched)
 * - Crops the globe glyph from the official wordmark for favicon / app icons
 * - Renders a static Open Graph image
 * Run: npm run assets
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC_LOGO = "public/brand/nxtorbis-logo-source.png";
// Measured alpha bounds of the source wordmark (947x240): x 217-826, y 73-168.
// Globe glyph occupies x 438-534 within the same rows.
const LOGO_BOX = { left: 217, top: 73, width: 610, height: 96 };
const GLOBE_BOX = { left: 436, top: 73, width: 100, height: 96 };

await mkdir("public/brand", { recursive: true });
await mkdir("src/app", { recursive: true });

// 1. Trimmed wordmark (white on transparent)
await sharp(SRC_LOGO).extract(LOGO_BOX).png({ compressionLevel: 9 }).toFile("public/brand/nxtorbis-wordmark.png");

// 2. Globe glyph -> square icons with generous padding, dark background for app icons
const globe = await sharp(SRC_LOGO).extract(GLOBE_BOX).png().toBuffer();
async function icon(size, out, { bg = "#0a0806", pad = 0.18 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const g = await sharp(globe).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: g, gravity: "centre" }])
    .png()
    .toFile(out);
}
await icon(512, "public/brand/icon-512.png");
await icon(192, "public/brand/icon-192.png");
await icon(180, "src/app/apple-icon.png");
await icon(64, "src/app/icon.png");

// 4. Open Graph image 1200x630
const wordmark = await sharp("public/brand/nxtorbis-wordmark.png").resize({ width: 520 }).png().toBuffer();
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
  <g fill="none" stroke="#ffffff" stroke-opacity=".22">
    <ellipse cx="930" cy="315" rx="230" ry="230"/>
    <ellipse cx="930" cy="315" rx="230" ry="88" transform="rotate(-24 930 315)"/>
    <ellipse cx="930" cy="315" rx="230" ry="150" transform="rotate(-24 930 315)"/>
    <ellipse cx="930" cy="315" rx="88" ry="230" transform="rotate(-24 930 315)"/>
  </g>
  <circle cx="1108" cy="212" r="5" fill="#edb166"/>
  <text x="120" y="392" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="500" fill="#f4f4f5" letter-spacing="-2">Building what’s next.</text>
  <text x="120" y="448" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#b8b0a2">Software · Products · AI · Mobile · Blockchain · Cloud</text>
  <text x="120" y="520" font-family="Courier New, monospace" font-size="18" fill="#857e72" letter-spacing="3">NXTORBIS® TECHNOLOGIES PRIVATE LIMITED — CHENNAI, INDIA</text>
</svg>`);
await sharp(ogSvg).composite([{ input: wordmark, left: 120, top: 160 }]).png().toFile("public/brand/og-image.png");
console.log("done");

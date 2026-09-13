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

// 4. Orbis Open Graph image 1200x630. Product name and tagline only; no claims.
await mkdir("public/orbis", { recursive: true });
const orbisOg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="bg" cx="72%" cy="48%" r="62%"><stop offset="0" stop-color="#18171a"/><stop offset="1" stop-color="#050506"/></radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f2e2c8" stop-opacity=".22"/><stop offset=".55" stop-color="#e8c79a" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <radialGradient id="shell" cx="42%" cy="36%" r="64%"><stop offset="0" stop-color="#fff6e6" stop-opacity=".45"/><stop offset=".2" stop-color="#e9e4dc" stop-opacity=".14"/><stop offset=".64" stop-color="#1b1b1f" stop-opacity=".6"/><stop offset=".92" stop-color="#d9dce4" stop-opacity=".2"/><stop offset="1" stop-color="#f0e6d6" stop-opacity=".5"/></radialGradient>
    <radialGradient id="core" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4e2" stop-opacity=".95"/><stop offset=".25" stop-color="#f3d7a8" stop-opacity=".32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="880" cy="315" r="300" fill="url(#glow)"/>
  <circle cx="880" cy="315" r="170" fill="url(#shell)"/>
  <circle cx="880" cy="315" r="105" fill="url(#core)"/>
  <g fill="none" stroke-width="1.2">
    <ellipse cx="880" cy="315" rx="250" ry="72" transform="rotate(-18 880 315)" stroke="#ece6da" stroke-opacity=".28"/>
    <ellipse cx="880" cy="315" rx="272" ry="96" transform="rotate(24 880 315)" stroke="#edb166" stroke-opacity=".22"/>
    <ellipse cx="880" cy="315" rx="232" ry="58" transform="rotate(66 880 315)" stroke="#ece6da" stroke-opacity=".14"/>
  </g>
  <text x="96" y="178" fill="#7a7771" font-family="Courier New, monospace" font-size="20" letter-spacing="6">NXTORBIS®</text>
  <text x="88" y="352" fill="#f3f1ec" font-family="Helvetica, Arial, sans-serif" font-size="176" font-weight="500" letter-spacing="-8">Orbis</text>
  <text x="96" y="432" fill="#d9d5cd" font-family="Helvetica, Arial, sans-serif" font-size="40" letter-spacing="-1">Intelligence, within reach.</text>
  <text x="96" y="486" fill="#8b8882" font-family="Helvetica, Arial, sans-serif" font-size="24">Your AI. Your workspace. Your world.</text>
</svg>`);
await sharp(orbisOg).png({ compressionLevel: 9 }).toFile("public/orbis/og-orbis.png");

// 5. The original Orbis logo for the /orbis heading: the wordmark artwork as
//    supplied. The file still carries a faint haze across a rectangle behind
//    the letters (alpha 3-10 of 255), which shows as a grey box on a dark page.
//    Pixels below alpha 8 are removed, easing in up to 24, so the letters,
//    their glow and the ring are unchanged. Then the empty margin is trimmed.
{
  const src = "public/orbis/source/orbis-wordmark.png";
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    const t = Math.min(1, Math.max(0, (data[i] - 8) / 16));
    data[i] = Math.round(data[i] * t * t * (3 - 2 * t));
  }
  const keyed = await sharp(data, { raw: info }).png().toBuffer();
  const trimmedLogo = await sharp(keyed).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true });
  await sharp(trimmedLogo.data).toFile("public/orbis/orbis-logo.png");
  console.log("orbis-logo.png " + trimmedLogo.info.width + "x" + trimmedLogo.info.height);
}

console.log(JSON.stringify({ dark: [dark.width, dark.height], light: [light.width, light.height], ring: [ring.width, ring.height] }));

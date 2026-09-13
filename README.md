# NxtOrbis® — Digital flagship website

Production website for **NxtOrbis® Technologies Private Limited**, built as a fully static
Next.js site (App Router, `output: "export"`). No server is required to host it: the `out/`
folder can be deployed to any static host or CDN.

## Stack

| Concern            | Choice                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Framework          | Next.js 15 (App Router, static export), React 19, TypeScript          |
| Styling            | CSS Modules + design tokens in `src/app/globals.css` (no CSS framework) |
| Typography         | Instrument Serif (display statements), Inter Tight (sub-headings), Inter (body), JetBrains Mono (metadata) — self-hosted via `next/font` |
| Liquid Glass       | A four-level material system in `globals.css` (`.glass` + `--glass-*` tokens). Each surface stacks a translucent tinted body, backdrop blur, a directional gradient edge (bright top, dark base, brighter toward the cursor) and an inner sheen. `GlassRuntime` tracks the pointer once for the whole page and drives every surface. Floating menus use `.glass--opaque` so transparency never costs readability |
| Art direction      | Warm near-black foundation, gold accent taken from the crystal rim light. All crystal artwork is one SVG renderer (`CrystalField.tsx`) shared by the home hero, page heroes, product tiles and the final CTA, with five silhouette families so no two crystals match. Light rays, dust, film grain. No WebGL, no stock renders |
| Motion             | CSS transitions/animations + one `IntersectionObserver` hook. Masked line reveals for hero titles, light-sweep buttons, a subtle trailing cursor ring on fine pointers. No animation libraries. `prefers-reduced-motion` respected globally; hover-only effects are gated behind `@media (hover: hover)` so nothing sticks on touch |
| Images             | No photography; all visuals are generated SVG. `scripts/prepare-assets.mjs` (sharp, dev-only) prepares the logo crops, icons and OG image |
| Runtime deps       | `next`, `react`, `react-dom` — nothing else                            |

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export -> out/
npm run start      # serve out/ locally (npx serve)
npm run typecheck
npm run lint
npm run assets     # regenerate logo crops, icons, OG image
```

## Project structure

```
src/
  app/                 routes: / about services products products/[slug] pricing contact
  components/
    layout/            Navbar, Footer, PageHero
    sections/          Hero, ServiceExplorer, AISection, ProductShowcase, TechnologySection,
                       WhyNxtOrbis, ProcessTimeline, CultureSection, CTASection, ScrollRail,
                       ContactForm, ContactBlock, MissionList, CredibilityStrip, Intro
    ui/                Button (signature glass CTA: travelling liquid fill, perimeter trace from
                       the cursor's entry angle, masked text/arrow rolls, press pulse, stable
                       loading), GlassSelect (accessible glass listbox), GlassRuntime,
                       SectionHeading, MaskedTitle, Cursor, Logo, Icons
    visuals/           CrystalField (hero / product / CTA art), ServiceGlyph, ProductVisual
  content/site.ts      ALL copy and structured content — the single place to edit text
  lib/                 Reveal (scroll reveal), contact (form submission), cx
public/
  brand/               official wordmark (trimmed, never redrawn), app icons, OG image
```

## Content rules baked into this build

* Every fact comes from the previous nxtorbis.com site. Nothing is invented: no clients,
  statistics, testimonials, awards or product features.
* The four products are presented **at a high level only** (name, positioning, technology
  direction). Do not add feature lists unless they come from real product material.
* AI is one capability inside NxtOrbis®. There is no “NxtOrbis.ai” brand or AI-only navigation.
* The six “Trusted by” logos on the previous site were template placeholders (Logoipsum), so no
  client-logo section exists. Add one in `src/content/site.ts` only when real, approved logos are available.
* The previous site’s phone number was a template placeholder, so only the email address and
  registered address are shown. Add a real phone number to `company` in `src/content/site.ts`.
* The Advocate Office Management System plans on `/pricing` reproduce the figures published on
  the previous site. Edit or remove them in `advocatePlans` if they change.

## Liquid Glass rules

* Use the intensity levels deliberately: `l1` for navigation and small controls, `l2` for buttons,
  pills and form controls, `l3` for feature panels, `l4` only for a rare signature moment. If every
  surface is glass, none of them read as glass.
* Anything floating over live text (menus, dropdowns, popovers) needs `.glass--opaque` or its own
  dense background. Readability outranks transparency, always.
* Never add a per-element pointer listener for the cursor light. `GlassRuntime` already tracks the
  pointer once for the whole page; adding `.glass` to an element is enough.
* Cursor response, and only cursor response, is disabled under `prefers-reduced-motion` and on
  touch. Translucency, the edge, the sheen and the depth stay, so the material never disappears.

## Contact form

The form is complete (validation, focus management, loading, error and success states) and is
ready to connect to any backend:

* Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to an HTTPS endpoint that accepts a JSON `POST`
  (`{ name, email, service, message, context }`) and returns 2xx. Rebuild and the form will
  submit there and show the success state.
* Without the variable, submitting opens the visitor’s email client with a pre-filled message to
  `nxtorbis@gmail.com` — and the UI says so. It never claims a message was delivered when it was not.

## Brand assets

The untouched official artwork lives in `public/brand/source/`:

| File | Use |
|---|---|
| `nxtorbis-logo-dark.png` | White wordmark for dark surfaces — the one the site uses |
| `nxtorbis-logo-light.png` | Black wordmark for light surfaces — generated, ready when a light surface needs it |
| `nxtorbis-mark.png` | The ring alone — browser tab, home-screen and PWA icons |

`npm run assets` trims transparent margins and sizes the files; proportions, colour and form are
never changed. To update a logo, replace the file in `source/` and run the script.

## Deployment

`npm run build` writes a fully static site to `out/`, including `sitemap.xml`, `robots.txt`,
`manifest.webmanifest`, favicons and per-page metadata (titles, descriptions, canonical URLs,
Open Graph and Twitter cards). Point your host’s document root at `out/` and set the domain to
`https://nxtorbis.com` (used by `metadataBase` in `src/app/layout.tsx`).

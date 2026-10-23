/**
 * Engineering notes.
 *
 * Every number in this file was measured on this site, and every change
 * described is in its git history. Nothing here is a client story, a case
 * study or a claim about work done for somebody else: those need the client's
 * agreement and their facts, and neither belongs in a file we can verify on
 * our own.
 */

export type Note = {
  slug: string;
  title: string;
  standfirst: string;
  date: string;
  readingMinutes: number;
  body: { heading?: string; paragraphs: string[]; list?: string[] }[];
};

export const notes: Note[] = [
  {
    slug: "the-orb",
    title: "The Orb is one object on one canvas",
    standfirst:
      "The Orbis page has a sphere that follows you down the page, becomes each feature in turn, and reacts when a download starts. It is drawn once, in WebGL, with no library.",
    date: "2026-09-13",
    readingMinutes: 4,
    body: [
      {
        paragraphs: [
          "The obvious way to build it is one canvas per section. That gives you eight WebGL contexts, eight render loops and eight copies of the same shader, and browsers cap how many contexts a page may hold.",
          "So there is one. Sections declare a slot — a box with a state name — and the stage measures them, blends between the two nearest the middle of the screen, and tells the engine where to be and what to look like. The engine eases every value toward its target and stops drawing when nothing is moving.",
        ],
      },
      {
        heading: "Four passes, one frame",
        paragraphs: [
          "Glow, then the sphere itself raymarched in a fragment shader, then the lines that wrap it, then the points that drift around it. Each feature is a set of weights over those passes rather than a different object: the Toolkit is the same sphere with its tool knob at one, the Arena with its energy knob high.",
        ],
      },
      {
        heading: "What it cost to get right",
        paragraphs: [
          "Positioning was the hard part. The page sits inside a wrapper that animates a transform during the entrance, and a transformed ancestor makes position: fixed resolve against that ancestor instead of the viewport, so the Orb vanished below the hero. It is absolutely positioned now, placed from the scroll offset minus the layer's own origin.",
          "Quality steps down on its own. If frames run long for a second, the engine drops a tier and never climbs back, because oscillating between tiers is more visible than running at the lower one.",
        ],
      },
    ],
  },
  {
    slug: "lighting-a-page",
    title: "Lighting a page from one moving source",
    standfirst:
      "Cards that brighten on the side facing the Orb, caustics pooling beneath it, a flare across it. The hard part was doing it without repainting the screen sixty times a second.",
    date: "2026-10-22",
    readingMinutes: 5,
    body: [
      {
        paragraphs: [
          "The Orb publishes where it is as CSS variables. Everything else — the light on the page, the gradient along each card's border, the brightening of a headline as the light passes — reads those variables. No component subscribes to scroll, and nothing but the stage does layout work.",
        ],
      },
      {
        heading: "Four things that each cost about ten frames a second",
        paragraphs: ["Every one of these was measured before and after, on the same machine, at the same point on the page."],
        list: [
          "A filter on the whole page for the time-of-day grading: every frame went through one enormous filtered layer. The grading moved onto the air alone.",
          "Gradients positioned from the Orb's variables: moving the Orb repainted the full viewport. The light became one fixed-size disc moved by transform, which the compositor handles without repainting anything.",
          "A blurred layer for the caustics, and a blurred reflection under the download cards. Both are gradients now; the softness is in the colour stops.",
          "Eight feature drawings animating at once in the finale. They arrive one at a time and hold still once gathered.",
        ],
      },
      {
        heading: "Richer where there is room",
        paragraphs: [
          "After all that the page still costs more on a slow machine than a fast one, so it measures a second of frames after load and drops the light and the weather if it cannot afford them. The grain and the dot matrix stay, because they are painted once and never again.",
        ],
      },
    ],
  },
  {
    slug: "a-front-door-at-eleven-frames",
    title: "A front door running at eleven frames a second",
    standfirst:
      "The home page stuttered badly, and the cause was not the number of elements. It was blur that moved.",
    date: "2026-10-23",
    readingMinutes: 3,
    body: [
      {
        paragraphs: [
          "Measured on the live site, the home page ran at 11 to 21 frames a second while every other page sat in the forties. The page has crystals drifting in the background: fifty-nine of them across its sections, several deliberately out of focus.",
        ],
      },
      {
        heading: "A Gaussian blur that moves is drawn again every frame",
        paragraphs: [
          "An SVG filter is rendered to a surface and reused while nothing changes. Animate the element under it and the whole chain runs again — and the chain here is two specular lights, a turbulence grain and four composites.",
          "So the soft shards hold still. A crystal that far out of focus reads as depth whether it drifts or not, and nobody reports seeing it move. The brushed-metal filter is now reserved for crystals above 110 pixels, where it is actually visible. Fields off screen animate nothing at all.",
        ],
      },
      {
        heading: "The result",
        paragraphs: [
          "The hero went from 11–21 to 55 frames a second, and every other page to 59–61, with the composition unchanged: the same crystals, the same light, the same focal object still drifting.",
        ],
      },
    ],
  },
];

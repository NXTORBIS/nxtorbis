/**
 * Readiness signals for the entrance sequence.
 *
 * Every milestone here is something the browser genuinely finished. Nothing
 * is driven by a timer pretending to be progress: if the page is ready in
 * 200ms, progress reports complete in 200ms. That rule matters more than the
 * animation — a progress indicator that lies is worse than none at all.
 *
 * The only timer is the safety net. If a font server hangs or an image never
 * decodes, `timeout` forces readiness so a decorative layer can never hold
 * the site hostage.
 */

export type Milestone = "hydrate" | "fonts" | "logo" | "load";

/** Weights sum to 1. Ordered roughly by when each typically lands. */
const WEIGHT: Record<Milestone, number> = {
  hydrate: 0.2, // React has taken over the server-rendered HTML
  fonts: 0.3, // the display face is resolved, so type will not jump on reveal
  logo: 0.2, // the wordmark is decoded, so the brand mark is real pixels
  load: 0.3, // window load: the critical subresources are in
};

export type Readiness = {
  /** Mark a milestone reached. Safe to call more than once. */
  reach: (m: Milestone) => void;
  /** Detach every listener and stop reporting. */
  cancel: () => void;
};

export function trackReadiness({
  onProgress,
  onReady,
  timeout = 5000,
  logoSrc = "/brand/nxtorbis-wordmark.png",
}: {
  onProgress: (progress: number) => void;
  onReady: () => void;
  timeout?: number;
  logoSrc?: string;
}): Readiness {
  const reached = new Set<Milestone>();
  let settled = false;
  let cancelled = false;
  const detach: Array<() => void> = [];

  const emit = () => {
    if (cancelled) return;
    let p = 0;
    for (const m of reached) p += WEIGHT[m];
    onProgress(Math.min(1, p));
    if (!settled && p >= 0.999) finish();
  };

  const finish = () => {
    if (settled || cancelled) return;
    settled = true;
    onProgress(1);
    onReady();
  };

  const reach = (m: Milestone) => {
    if (settled || cancelled || reached.has(m)) return;
    reached.add(m);
    emit();
  };

  /* Fonts. `document.fonts.ready` settles once every pending face has either
     loaded or failed, which is exactly the guarantee we want: it resolves on
     failure too, so a missing font cannot stall the entrance. */
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.ready.then(() => reach("fonts"), () => reach("fonts"));
  } else {
    reach("fonts");
  }

  /* Logo. Decoded rather than merely loaded, so the reveal cannot land on a
     frame where the mark is still being rasterised. */
  if (typeof Image !== "undefined") {
    const img = new Image();
    img.src = logoSrc;
    const ok = () => reach("logo");
    if (img.decode) {
      img.decode().then(ok, ok);
    } else {
      img.onload = ok;
      img.onerror = ok;
    }
  } else {
    reach("logo");
  }

  /* Window load. */
  if (typeof document !== "undefined" && document.readyState === "complete") {
    reach("load");
  } else if (typeof window !== "undefined") {
    const onLoad = () => reach("load");
    window.addEventListener("load", onLoad, { once: true });
    detach.push(() => window.removeEventListener("load", onLoad));
  } else {
    reach("load");
  }

  // Safety net: never let a stalled resource trap the visitor behind a
  // decorative layer. Real progress still reports whatever it reached.
  const safety = setTimeout(finish, timeout);
  detach.push(() => clearTimeout(safety));

  // Report the starting position (some milestones may already be in).
  emit();

  return {
    reach,
    cancel: () => {
      cancelled = true;
      for (const d of detach) d();
    },
  };
}

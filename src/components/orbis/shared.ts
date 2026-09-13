"use client";

import { useEffect, useRef, useState } from "react";
import type { OrbisPlatform } from "@/content/orbis";
import type { OrbisRelease } from "@/lib/orbisReleases";

export const ORBIS_FOCUS_DOWNLOAD = "orbis:focus-download";
export const ORBIS_OPEN_GUIDE = "orbis:open-guide";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
}

/** Scroll to Download and hand keyboard focus to the most relevant download button. Never downloads by itself. */
export function goToDownload() {
  scrollToId("download");
  window.setTimeout(() => window.dispatchEvent(new Event(ORBIS_FOCUS_DOWNLOAD)), reducedMotion() ? 60 : 750);
}

export function openInstallGuide() {
  window.dispatchEvent(new Event(ORBIS_OPEN_GUIDE));
  scrollToId("install");
}

const PLATFORM_ORDER: OrbisPlatform[] = ["windows", "macos", "linux"];

/** Platforms that genuinely have a build in this release, in a stable order. */
export function platformsOf(release: OrbisRelease) {
  return PLATFORM_ORDER.map((platform) => ({ platform, builds: release.builds.filter((b) => b.platform === platform) })).filter(
    (p) => p.builds.length > 0,
  );
}

/**
 * True once the element has reached the viewport, and it stays true.
 *
 * `isIntersecting` alone is not enough: a fast scroll or an anchor jump can
 * carry an element from below the fold to above it without it ever
 * intersecting, and it would never be revealed. So a scroll check backs the
 * observer up, and anything already above the fold counts.
 */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const done = () => {
      setInView(true);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) done();
      },
      { threshold },
    );
    const onScroll = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) done();
    };
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold, inView]);

  return [ref, inView] as const;
}

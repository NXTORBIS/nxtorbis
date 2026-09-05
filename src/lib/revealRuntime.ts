/**
 * Reveal runtime.
 *
 * The guarantee: content is never permanently invisible. A reveal is an
 * enhancement on the way in, never a gate that can trap content.
 *
 * The previous implementation gave each element its own IntersectionObserver
 * and revealed only on `isIntersecting`. Two ways that stranded content:
 *
 *   - Scroll fast, or jump with End / an anchor, and an element can go from
 *     below the fold to above it between callbacks. It is then never
 *     "intersecting" again, so it stayed at opacity 0 forever.
 *   - A 15% threshold meant a quick scroll could skip the window entirely.
 *
 * So this runtime:
 *   - uses ONE observer for the whole page rather than one per element
 *   - fires at threshold 0, so any sliver counts
 *   - reveals anything already level with or above the fold, not just what is
 *     intersecting right now
 *   - keeps a scroll and resize sweep over the remaining elements as a
 *     backstop, and detaches it the moment nothing is left pending
 */

const VISIBLE = "is-visible";

let observer: IntersectionObserver | null = null;
let pending: Set<Element> | null = null;
let raf = 0;
let listening = false;

function show(el: Element) {
  el.classList.add(VISIBLE);
  pending?.delete(el);
  observer?.unobserve(el);
  if (pending && pending.size === 0) stopSweep();
}

/** Anything whose top has reached the fold has had its moment; show it. */
function sweep() {
  raf = 0;
  if (!pending || pending.size === 0) return;
  const limit = window.innerHeight * 0.94;
  for (const el of Array.from(pending)) {
    if (el.getBoundingClientRect().top < limit) show(el);
  }
}

function queueSweep() {
  if (!raf) raf = requestAnimationFrame(sweep);
}

function startSweep() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", queueSweep, { passive: true });
  window.addEventListener("resize", queueSweep);
}

function stopSweep() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", queueSweep);
  window.removeEventListener("resize", queueSweep);
  cancelAnimationFrame(raf);
  raf = 0;
}

function ensure() {
  if (observer || typeof IntersectionObserver === "undefined") return;
  pending = new Set();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // `isIntersecting` alone is not enough: an element scrolled past
        // reports false, and would otherwise never be shown.
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
          show(entry.target);
        }
      }
    },
    { threshold: 0, rootMargin: "0px 0px -6% 0px" },
  );
}

export function observeReveal(el: Element): () => void {
  if (typeof window === "undefined") return () => {};

  // No observer support: show immediately rather than risk hiding content.
  if (typeof IntersectionObserver === "undefined") {
    el.classList.add(VISIBLE);
    return () => {};
  }

  ensure();
  if (!observer || !pending) {
    el.classList.add(VISIBLE);
    return () => {};
  }

  pending.add(el);
  observer.observe(el);
  startSweep();
  // Catch anything already on screen or above it at mount, before any scroll.
  queueSweep();

  return () => {
    pending?.delete(el);
    observer?.unobserve(el);
    if (pending && pending.size === 0) stopSweep();
  };
}

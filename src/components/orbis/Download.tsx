"use client";

import { OrbisIcon } from "./Icons";
import { releaseMeta, useOrbisRelease } from "./release";

/** The primary Download button, with version and size once GitHub answers. */
export function OrbisDownload({ size = "lg" }: { size?: "lg" | "sm" }) {
  const r = useOrbisRelease();
  if (size === "sm") {
    return (
      <a className="ob-btn ob-btn-primary ob-btn-sm" href={r.href} rel="noopener">
        <OrbisIcon name="windows" fill />
        Download v{r.version}
      </a>
    );
  }
  return (
    <a className="ob-btn ob-btn-primary ob-btn-lg" href={r.href} rel="noopener">
      <OrbisIcon name="windows" fill />
      <span className="ob-btn-stack">
        <span>Download for Windows</span>
        <small>{releaseMeta(r)}</small>
      </span>
    </a>
  );
}

export function OrbisReleaseNotes() {
  const r = useOrbisRelease();
  return (
    <a className="ob-btn ob-btn-glass ob-btn-lg" href={r.notes} target="_blank" rel="noopener">
      Release notes <OrbisIcon name="external" />
    </a>
  );
}

/** "Latest release: v0.1.0, Sep 12, 2026 (Orbis-Setup-0.1.0.exe)." — only when known. */
export function OrbisReleaseDate() {
  const r = useOrbisRelease();
  if (r.status !== "ready" || !r.date) return null;
  return (
    <p className="ob-fine">
      Latest release: v{r.version}, {r.date}
      {r.file ? ` (${r.file})` : ""}.
    </p>
  );
}

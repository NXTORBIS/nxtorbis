"use client";

import { useEffect, useState } from "react";
import { orbisLatestUrl, orbisRelease } from "@/content/orbis";

/**
 * The newest Orbis installer, looked up on GitHub Releases.
 *
 * The Download buttons never hard-code a file: publishing a new Release
 * updates the page with no site change. Until GitHub answers — or when it
 * cannot (no release yet, offline, rate-limited) — every button points at the
 * repository's latest-release page, which is always the right place to land.
 */
export type OrbisReleaseInfo = {
  status: "loading" | "ready" | "unavailable";
  href: string;
  version: string;
  size: string | null;
  date: string | null;
  file: string | null;
  notes: string;
};

const FALLBACK: OrbisReleaseInfo = {
  status: "loading",
  href: orbisLatestUrl,
  version: orbisRelease.fallbackVersion,
  size: null,
  date: null,
  file: null,
  notes: orbisLatestUrl,
};

const CACHE_KEY = `orbis-release:${orbisRelease.owner}/${orbisRelease.repo}`;
const CACHE_MS = 10 * 60 * 1000;

type GithubAsset = { name: string; size: number; browser_download_url: string };
type GithubRelease = { tag_name?: string; name?: string; html_url: string; published_at?: string; assets?: GithubAsset[] };

let pending: Promise<OrbisReleaseInfo> | null = null;

function fromRelease(release: GithubRelease): OrbisReleaseInfo {
  const assets = release.assets ?? [];
  const exe = assets.find((a) => /setup.*\.exe$/i.test(a.name)) ?? assets.find((a) => /\.exe$/i.test(a.name));
  const version = String(release.tag_name || release.name || orbisRelease.fallbackVersion).replace(/^v/i, "");
  return {
    status: exe ? "ready" : "unavailable",
    href: exe ? exe.browser_download_url : release.html_url,
    version,
    size: exe ? `${Math.max(1, Math.round(exe.size / 1048576))} MB` : null,
    date: release.published_at
      ? new Date(release.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : null,
    file: exe ? exe.name : null,
    notes: release.html_url,
  };
}

async function fetchRelease(): Promise<OrbisReleaseInfo> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.at < CACHE_MS) return fromRelease(cached.release);
  } catch {
    /* storage unavailable */
  }
  const res = await fetch(`https://api.github.com/repos/${orbisRelease.owner}/${orbisRelease.repo}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const release: GithubRelease = await res.json();
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), release }));
  } catch {
    /* ignore */
  }
  return fromRelease(release);
}

/** One request per page, shared by every Download button on it. */
export function useOrbisRelease(): OrbisReleaseInfo {
  const [info, setInfo] = useState<OrbisReleaseInfo>(FALLBACK);
  useEffect(() => {
    let alive = true;
    pending ??= fetchRelease().catch(() => ({ ...FALLBACK, status: "unavailable" as const }));
    pending.then((r) => alive && setInfo(r));
    return () => {
      alive = false;
    };
  }, []);
  return info;
}

export function releaseMeta(r: OrbisReleaseInfo) {
  return [`v${r.version}`, r.size, "Windows 10/11"].filter(Boolean).join(" · ");
}

"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  orbisGithub,
  orbisPlatforms,
  orbisTrustedDownloadPrefix,
  type OrbisPlatform,
} from "@/content/orbis";

/**
 * Orbis releases — the single source of truth for everything the page says
 * about a build.
 *
 * Read live from GitHub Releases (public API, no token). Version, date, file,
 * size, download URL, checksum and notes all come from there; nothing is
 * typed into the UI. Publish a release and the page adapts: new platforms
 * appear, missing ones disappear, and the history grows.
 *
 * Nothing is inferred that GitHub does not state, with one documented
 * exception: an installer whose file name carries no architecture takes the
 * platform's verified default (see content/orbis).
 */

export type OrbisBuildKind = "installer" | "portable" | "archive";

export type OrbisBuild = {
  platform: OrbisPlatform;
  /** Installer, portable (runs without installing), or a plain archive. */
  kind: OrbisBuildKind;
  arch: string | null;
  fileName: string;
  size: number;
  url: string;
  /** SHA-256 as published by GitHub for the asset, when GitHub provides one. */
  sha256: string | null;
};

export type OrbisNotesBlock = { type: "p"; text: string } | { type: "ul"; items: string[] } | { type: "code"; text: string };
export type OrbisNotesSection = { heading: string | null; blocks: OrbisNotesBlock[] };

export type OrbisRelease = {
  tag: string;
  version: string;
  name: string;
  publishedAt: string;
  url: string;
  notes: OrbisNotesSection[];
  builds: OrbisBuild[];
};

export type OrbisReleasesState =
  | { status: "loading" }
  | { status: "ready"; releases: OrbisRelease[] }
  | { status: "empty" }
  | { status: "error"; message: string };

type GithubAsset = { name: string; size: number; browser_download_url: string; digest?: string | null };
type GithubRelease = {
  tag_name: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
  body: string | null;
  assets: GithubAsset[];
};

/* ----------------------------------------------------------- parsing -- */

const PLATFORM_PATTERNS: [OrbisPlatform, RegExp][] = [
  ["windows", /\.(exe|msi|msix|appx)$/i],
  ["macos", /\.(dmg|pkg)$/i],
  ["macos", /(mac|darwin|osx).*\.zip$/i],
  ["linux", /\.(appimage|deb|rpm|snap|flatpak)$/i],
  ["linux", /linux.*\.(tar\.gz|tar\.xz|zip)$/i],
  ["windows", /(portable|windows|win32|win64|win).*\.zip$/i],
];

function platformOf(fileName: string): OrbisPlatform | null {
  if (/\.(blockmap|yml|yaml|sig|asc)$/i.test(fileName)) return null;
  for (const [platform, pattern] of PLATFORM_PATTERNS) if (pattern.test(fileName)) return platform;
  return null;
}

function kindOf(fileName: string, platform: OrbisPlatform): OrbisBuildKind {
  if (/portable/i.test(fileName) || (platform === "windows" && /\.zip$/i.test(fileName))) return "portable";
  if (/\.(exe|msi|msix|appx|dmg|pkg|deb|rpm|appimage|snap|flatpak)$/i.test(fileName)) return "installer";
  return "archive";
}

const KIND_ORDER: Record<OrbisBuildKind, number> = { installer: 0, portable: 1, archive: 2 };

function extensionOf(fileName: string): string {
  const m = /\.(tar\.gz|tar\.xz|[a-z0-9]+)$/i.exec(fileName);
  return m ? `.${m[1].toLowerCase()}` : "";
}

/** "Installer (.exe)", "Portable (.zip)" — plus the architecture when siblings differ by it. */
export function buildLabel(build: OrbisBuild, siblings: OrbisBuild[]): string {
  const kinds = new Set(siblings.map((s) => s.kind));
  const arches = new Set(siblings.filter((s) => s.kind === build.kind).map((s) => s.arch));
  const kind = build.kind === "installer" ? "Installer" : build.kind === "portable" ? "Portable" : "Archive";
  const parts: string[] = [];
  if (kinds.size > 1 || siblings.length === 1) parts.push(`${kind} (${extensionOf(build.fileName)})`);
  if (arches.size > 1) parts.push(archLabel(build.platform, build.arch) ?? "");
  return parts.filter(Boolean).join(" · ") || build.fileName;
}

function archOf(fileName: string, platform: OrbisPlatform): string | null {
  if (/(arm64|aarch64)/i.test(fileName)) return "arm64";
  if (/universal/i.test(fileName)) return "universal";
  if (/(x64|amd64|x86_64|win64)/i.test(fileName)) return "x64";
  if (/(ia32|i386|win32|x86)/i.test(fileName)) return "x86";
  return orbisPlatforms[platform].defaultArch;
}

export function archLabel(platform: OrbisPlatform, arch: string | null): string | null {
  if (!arch) return null;
  if (platform === "macos") return arch === "arm64" ? "Apple Silicon" : arch === "x64" ? "Intel" : arch === "universal" ? "Apple Silicon and Intel" : arch;
  return arch === "x64" ? "x64 (64-bit)" : arch === "x86" ? "x86 (32-bit)" : arch === "arm64" ? "ARM64" : arch;
}

/** A download may only start from the trusted release prefix, for the file it names. */
export function isTrustedBuild(build: OrbisBuild): boolean {
  try {
    const u = new URL(build.url);
    return build.url.startsWith(orbisTrustedDownloadPrefix) && u.protocol === "https:" && decodeURIComponent(u.pathname).endsWith(`/${build.fileName}`) && build.size > 0;
  } catch {
    return false;
  }
}

/** Minimal Markdown reader for release notes: headings, paragraphs, lists and code blocks. */
export function parseNotes(markdown: string): OrbisNotesSection[] {
  const sections: OrbisNotesSection[] = [];
  let current: OrbisNotesSection = { heading: null, blocks: [] };
  let para: string[] = [];
  let list: string[] | null = null;
  let code: string[] | null = null;

  const flushPara = () => {
    if (para.length) current.blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list?.length) current.blocks.push({ type: "ul", items: list });
    list = null;
  };
  const closeSection = () => {
    flushPara();
    flushList();
    if (current.heading || current.blocks.length) sections.push(current);
  };

  for (const raw of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    if (code) {
      if (/^```/.test(line.trim())) {
        current.blocks.push({ type: "code", text: code.join("\n").trim() });
        code = null;
      } else code.push(line);
      continue;
    }
    if (/^```/.test(line.trim())) {
      flushPara();
      flushList();
      code = [];
      continue;
    }
    const heading = /^#{1,4}\s+(.*)$/.exec(line);
    if (heading) {
      closeSection();
      current = { heading: heading[1].trim(), blocks: [] };
      continue;
    }
    const item = /^\s*[-*]\s+(.*)$/.exec(line);
    if (item) {
      flushPara();
      (list ??= []).push(item[1].trim());
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  if (code) current.blocks.push({ type: "code", text: code.join("\n").trim() });
  closeSection();
  return sections;
}

/** The first plain sentence of a release's notes, for the timeline. */
export function releaseSummary(release: OrbisRelease): string | null {
  for (const section of release.notes) {
    for (const block of section.blocks) {
      if (block.type === "p") return block.text.replace(/\*\*|`/g, "");
    }
  }
  return null;
}

function normalize(raw: GithubRelease[]): OrbisRelease[] {
  return raw
    .filter((r) => !r.draft && !r.prerelease && r.published_at)
    .map((r) => {
      const builds: OrbisBuild[] = [];
      for (const asset of r.assets ?? []) {
        const platform = platformOf(asset.name);
        if (!platform) continue;
        const digest = asset.digest ? /^sha256:([0-9a-f]{64})$/i.exec(asset.digest) : null;
        const build: OrbisBuild = {
          platform,
          kind: kindOf(asset.name, platform),
          arch: archOf(asset.name, platform),
          fileName: asset.name,
          size: asset.size,
          url: asset.browser_download_url,
          sha256: digest ? digest[1].toLowerCase() : null,
        };
        if (isTrustedBuild(build)) builds.push(build);
      }
      builds.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
      return {
        tag: r.tag_name,
        version: r.tag_name.replace(/^v/i, ""),
        name: r.name || `Orbis ${r.tag_name}`,
        publishedAt: r.published_at as string,
        url: r.html_url,
        notes: parseNotes(r.body ?? ""),
        builds,
      };
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

/* ------------------------------------------------------------- store -- */

const SERVER_STATE: OrbisReleasesState = { status: "loading" };
const CACHE_KEY = "orbis-releases:v2";
const CACHE_MS = 10 * 60 * 1000;

let state: OrbisReleasesState = SERVER_STATE;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function set(next: OrbisReleasesState) {
  state = next;
  listeners.forEach((l) => l());
}

function load(force = false): Promise<void> {
  if (inflight) return inflight;
  if (force) set({ status: "loading" });
  inflight = (async () => {
    try {
      let raw: GithubRelease[] | null = null;
      if (!force) {
        try {
          const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
          if (cached && Date.now() - cached.at < CACHE_MS) raw = cached.data;
        } catch {
          /* storage unavailable */
        }
      }
      if (!raw) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 10000);
        try {
          const res = await fetch(`https://api.github.com/repos/${orbisGithub.owner}/${orbisGithub.repo}/releases?per_page=20`, {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          });
          if (!res.ok) {
            throw new Error(
              res.status === 403 || res.status === 429
                ? "GitHub is limiting requests right now. Please try again in a few minutes."
                : `GitHub responded with an error (${res.status}).`,
            );
          }
          raw = (await res.json()) as GithubRelease[];
        } finally {
          window.clearTimeout(timer);
        }
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: raw }));
        } catch {
          /* ignore */
        }
      }
      const releases = normalize(raw);
      set(releases.length ? { status: "ready", releases } : { status: "empty" });
    } catch (e) {
      const message =
        e instanceof DOMException && e.name === "AbortError"
          ? "Release information took too long to load."
          : e instanceof TypeError
            ? "We couldn’t reach GitHub to load release information."
            : e instanceof Error
              ? e.message
              : "Release information couldn’t be loaded.";
      set({ status: "error", message });
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Live release data, shared by every component on the page (one request). */
export function useOrbisReleases() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  useEffect(() => {
    if (state.status === "loading" && !inflight) void load();
  }, []);
  const retry = useCallback(() => load(true), []);
  return { state: snapshot, retry };
}

/* ----------------------------------------------------------- helpers -- */

export function formatSize(bytes: number): string {
  const mb = bytes / 1048576;
  return mb >= 1 ? `${Math.round(mb)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

/** The visitor's desktop platform, when it can be told reliably. Phones and tablets return null. */
export function detectPlatform(): OrbisPlatform | null {
  if (typeof navigator === "undefined") return null;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const ua = nav.userAgent || "";
  const platform = nav.userAgentData?.platform || nav.platform || "";
  if (/android|iphone|ipad|ipod/i.test(ua)) return null;
  if (/mac/i.test(platform) && nav.maxTouchPoints > 1) return null; // iPadOS reporting as a Mac
  if (/win/i.test(platform) || /windows/i.test(ua)) return "windows";
  if (/mac/i.test(platform) || /mac os x/i.test(ua)) return "macos";
  if (/linux/i.test(platform) || /x11|linux/i.test(ua)) return "linux";
  return null;
}

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

export type OrbisBuildKind = "installer" | "portable" | "bundle" | "archive";

/** One numbered piece of a download that is too large for a single file. */
export type OrbisBuildPart = { fileName: string; size: number; url: string; sha256: string | null };

export type OrbisBuild = {
  platform: OrbisPlatform;
  /** Installer, portable (runs without installing), all-in-one bundle, or a plain archive. */
  kind: OrbisBuildKind;
  arch: string | null;
  /** The file's name; for a download in parts, the name the parts join back into. */
  fileName: string;
  /** Bytes; for a download in parts, all parts together. */
  size: number;
  url: string;
  /** SHA-256 as published by GitHub for the asset, when GitHub provides one. */
  sha256: string | null;
  /**
   * Set when the download is published in numbered parts (name.zip.001, .002, …)
   * because GitHub accepts at most 2 GB per file. In order.
   */
  parts: OrbisBuildPart[] | null;
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
  if (/all-?in-?one/i.test(fileName)) return "bundle";
  if (/portable/i.test(fileName) || (platform === "windows" && /\.zip$/i.test(fileName))) return "portable";
  if (/\.(exe|msi|msix|appx|dmg|pkg|deb|rpm|appimage|snap|flatpak)$/i.test(fileName)) return "installer";
  return "archive";
}

const KIND_ORDER: Record<OrbisBuildKind, number> = { installer: 0, portable: 1, bundle: 2, archive: 3 };
const KIND_LABEL: Record<OrbisBuildKind, string> = { installer: "Installer", portable: "Portable", bundle: "All-in-One", archive: "Archive" };

function extensionOf(fileName: string): string {
  const m = /\.(tar\.gz|tar\.xz|[a-z0-9]+)$/i.exec(fileName);
  return m ? `.${m[1].toLowerCase()}` : "";
}

/** "Installer (.exe)", "All-in-One (.zip, 7 parts)" — plus the architecture when siblings differ by it. */
export function buildLabel(build: OrbisBuild, siblings: OrbisBuild[]): string {
  const kinds = new Set(siblings.map((s) => s.kind));
  const arches = new Set(siblings.filter((s) => s.kind === build.kind).map((s) => s.arch));
  const detail = build.parts ? `${extensionOf(build.fileName)}, ${build.parts.length} parts` : extensionOf(build.fileName);
  const bits: string[] = [];
  if (kinds.size > 1 || siblings.length === 1) bits.push(`${KIND_LABEL[build.kind]} (${detail})`);
  if (arches.size > 1) bits.push(archLabel(build.platform, build.arch) ?? "");
  return bits.filter(Boolean).join(" · ") || build.fileName;
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

function isTrustedFile(url: string, fileName: string, size: number): boolean {
  try {
    const u = new URL(url);
    return url.startsWith(orbisTrustedDownloadPrefix) && u.protocol === "https:" && decodeURIComponent(u.pathname).endsWith(`/${fileName}`) && size > 0;
  } catch {
    return false;
  }
}

/** A download may only start from the trusted release prefix, for the file it names — every part of it, for a download in parts. */
export function isTrustedBuild(build: OrbisBuild): boolean {
  if (build.parts) return build.parts.length > 1 && build.parts.every((p) => isTrustedFile(p.url, p.fileName, p.size));
  return isTrustedFile(build.url, build.fileName, build.size);
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

function digestOf(asset: GithubAsset): string | null {
  const m = asset.digest ? /^sha256:([0-9a-f]{64})$/i.exec(asset.digest) : null;
  return m ? m[1].toLowerCase() : null;
}

/** name.zip.001 → ["name.zip", "001"] */
const PART = /^(.+)\.(\d{3})$/;

/**
 * Joins numbered parts into one build. Shown only when the set is complete:
 * numbered from 001 with none missing, and a last part smaller than the first.
 * A split cuts equal pieces and leaves the remainder for last, so while the
 * parts are still being uploaded the download stays hidden.
 */
function joinParts(base: string, pieces: { index: number; asset: GithubAsset }[]): OrbisBuild | null {
  const platform = platformOf(base);
  if (!platform || pieces.length < 2) return null;
  const sorted = [...pieces].sort((a, b) => a.index - b.index);
  if (!sorted.every((p, i) => p.index === i + 1)) return null;
  const parts = sorted.map(({ asset }) => ({ fileName: asset.name, size: asset.size, url: asset.browser_download_url, sha256: digestOf(asset) }));
  if (parts[parts.length - 1].size >= parts[0].size) return null;
  return {
    platform,
    kind: kindOf(base, platform),
    arch: archOf(base, platform),
    fileName: base,
    size: parts.reduce((sum, p) => sum + p.size, 0),
    url: parts[0].url,
    sha256: null,
    parts,
  };
}

function normalize(raw: GithubRelease[]): OrbisRelease[] {
  return raw
    .filter((r) => !r.draft && !r.prerelease && r.published_at)
    .map((r) => {
      const builds: OrbisBuild[] = [];
      const pieces = new Map<string, { index: number; asset: GithubAsset }[]>();
      for (const asset of r.assets ?? []) {
        const part = PART.exec(asset.name);
        if (part) {
          pieces.set(part[1], [...(pieces.get(part[1]) ?? []), { index: Number(part[2]), asset }]);
          continue;
        }
        const platform = platformOf(asset.name);
        if (!platform) continue;
        const build: OrbisBuild = {
          platform,
          kind: kindOf(asset.name, platform),
          arch: archOf(asset.name, platform),
          fileName: asset.name,
          size: asset.size,
          url: asset.browser_download_url,
          sha256: digestOf(asset),
          parts: null,
        };
        if (isTrustedBuild(build)) builds.push(build);
      }
      for (const [base, list] of pieces) {
        const build = joinParts(base, list);
        if (build && isTrustedBuild(build)) builds.push(build);
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
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
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

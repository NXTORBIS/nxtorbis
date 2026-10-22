"use client";

import { cx } from "@/lib/cx";
import { formatSize, useOrbisReleases } from "@/lib/orbisReleases";
import styles from "./Orbis.module.css";

/**
 * The page's real numbers, used as ornament.
 *
 * Everything drawn here is live release data — the published version, its
 * date, the installer's size, its checksum, and one notch per release ever
 * published. It is set as microtype along the page's edge, the way a measuring
 * instrument carries its markings: decorative because it is true, not instead
 * of being true.
 *
 * Nothing is invented. With no releases loaded, the rail draws nothing.
 */
export function Instruments() {
  const { state } = useOrbisReleases();
  if (state.status !== "ready" || !state.releases.length) return null;

  const latest = state.releases[0];
  const build = latest.builds[0] ?? null;
  const checksum = build?.sha256 ?? null;

  return (
    <aside className={styles.instruments} aria-hidden="true">
      <div className={styles.instrumentTicker}>
        <span>
          {latest.version} · {new Date(latest.publishedAt).toISOString().slice(0, 10)}
          {build ? ` · ${formatSize(build.size)}` : ""} · {latest.builds.length} build{latest.builds.length === 1 ? "" : "s"}
        </span>
      </div>

      {checksum && (
        <div className={styles.instrumentHash}>
          {/* The checksum as a strip: each pair of hex digits one bar, its
              height the byte it stands for. A real fingerprint, drawn. */}
          {checksum.match(/.{2}/g)?.map((pair, i) => (
            <i key={i} style={{ ["--v" as string]: String(parseInt(pair, 16) / 255) }} />
          ))}
        </div>
      )}

      <ol className={styles.instrumentSpine}>
        {state.releases.map((r) => (
          <li key={r.tag}>
            <span className={cx(styles.instrumentNotch, r.tag === latest.tag && styles.instrumentNotchNow)} />
            <em>{r.version}</em>
          </li>
        ))}
      </ol>
    </aside>
  );
}

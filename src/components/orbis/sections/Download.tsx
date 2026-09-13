"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisCopy, orbisDocsUrl, orbisInstallGuide, orbisPlatforms, orbisPortableGuide, orbisReleasesUrl, type OrbisPlatform } from "@/content/orbis";
import {
  archLabel,
  buildLabel,
  detectPlatform,
  formatDate,
  formatSize,
  isTrustedBuild,
  useOrbisReleases,
  type OrbisBuild,
  type OrbisRelease,
} from "@/lib/orbisReleases";
import { OrbSlot, useOrb } from "../orb/OrbStage";
import { PlatformIcon } from "../PlatformIcon";
import { ORBIS_FOCUS_DOWNLOAD, ORBIS_OPEN_GUIDE, openInstallGuide, platformsOf, reducedMotion, sleep } from "../shared";
import { ReleaseError } from "./Releases";
import styles from "../Orbis.module.css";

/**
 * Download Orbis — the page's functional core.
 *
 * Cards are rendered from the live release: a platform without a build has no
 * card. Every download is checked before it starts (the release exists, the
 * build belongs to it, the URL is a trusted GitHub release asset) and is then
 * started for real, inside the click, so the browser treats it as the user's
 * action.
 *
 * Browsers do not report progress for a cross-origin file download, so none
 * is shown: the Orb's ring is indeterminate, and no percentage ever appears.
 */

type Phase = "idle" | "preparing" | "starting" | "started" | "ready" | "error";

export function OrbisDownload() {
  const { state, retry } = useOrbisReleases();
  const orb = useOrb();
  const [detected, setDetected] = useState<OrbisPlatform | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [active, setActive] = useState<OrbisBuild | null>(null);
  const [highlight, setHighlight] = useState(false);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const run = useRef(0);
  const latest = state.status === "ready" ? state.releases[0] : null;
  const busy = phase === "preparing" || phase === "starting";

  useEffect(() => setDetected(detectPlatform()), []);

  // The Orb pulses gently while release information loads.
  useEffect(() => {
    orb.setLoading(state.status === "loading");
  }, [orb, state.status]);

  // "Download Orbis" elsewhere on the page lands here: focus the best button, briefly highlight it.
  useEffect(() => {
    const onFocus = () => {
      const root = cardsRef.current;
      if (!root) return;
      const target =
        root.querySelector<HTMLElement>(`[data-platform="${detected}"] [data-cta] button, [data-platform="${detected}"] [data-cta] a`) ??
        root.querySelector<HTMLElement>("[data-cta] button, [data-cta] a");
      target?.focus({ preventScroll: true });
      setHighlight(true);
      window.setTimeout(() => setHighlight(false), 1800);
    };
    window.addEventListener(ORBIS_FOCUS_DOWNLOAD, onFocus);
    return () => window.removeEventListener(ORBIS_FOCUS_DOWNLOAD, onFocus);
  }, [detected]);

  useEffect(
    () => () => {
      run.current += 1;
      orb.setDownloadPhase("idle");
      orb.setOverride(null);
    },
    [orb],
  );

  const start = useCallback(
    async (build: OrbisBuild) => {
      const token = ++run.current;
      const alive = () => token === run.current;
      const reduced = reducedMotion();
      setActive(build);
      setPhase("preparing");
      orb.setOverride("download");
      orb.setDownloadPhase("contract");
      try {
        // 1–3. The release exists, this build belongs to it, and the URL is a trusted release asset.
        if (!latest || !latest.builds.includes(build) || !isTrustedBuild(build)) throw new Error("Untrusted or missing build");

        // 4. Begin the real download while the click's user activation is still live.
        const link = document.createElement("a");
        link.href = build.url;
        link.rel = "noopener";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setPhase("starting");
        orb.setDownloadPhase("ring");
        await sleep(reduced ? 150 : 1300);
        if (!alive()) return;
        setPhase("started");
        await sleep(reduced ? 150 : 1000);
        if (!alive()) return;
        orb.setOverride("success");
        orb.setDownloadPhase("expand");
        setPhase("ready");
        await sleep(1600);
        if (!alive()) return;
        orb.setDownloadPhase("idle");
        orb.setOverride(null);
      } catch {
        if (!alive()) return;
        setPhase("error");
        orb.setDownloadPhase("error");
        orb.setOverride("error");
        await sleep(2600);
        if (!alive()) return;
        orb.setDownloadPhase("idle");
        orb.setOverride(null);
      }
    },
    [latest, orb],
  );

  const platforms = latest ? platformsOf(latest) : [];

  return (
    <section id="download" className={cx(styles.section, styles.download)} aria-labelledby="orbis-download-title">
      <div className="container">
        <header className={styles.downloadHead}>
          <Reveal as="h2" id="orbis-download-title" className={styles.sectionTitle}>
            {withOrbisLogo(orbisCopy.download.heading, { display: true })}
          </Reveal>
          <Reveal as="p" className={styles.muted} delay={100}>
            {withOrbisLogo(orbisCopy.download.sub)}
          </Reveal>
        </header>

        <div className={styles.downloadOrb}>
          <OrbSlot state="download" />
        </div>

        <div className={styles.downloadStatus} role="status" aria-live="polite">
          <DownloadStatus phase={phase} build={active} release={latest} onRetry={() => active && start(active)} />
        </div>

        {state.status === "loading" && <p className={cx(styles.softNote, styles.center)}>Checking the latest release…</p>}
        {state.status === "error" && <ReleaseError message={state.message} onRetry={retry} />}
        {state.status === "empty" && (
          <div className={styles.panelBox}>
            <p className={styles.statusTitle}>{withOrbisLogo(orbisCopy.empty.heading)}</p>
            <p className={styles.statusText}>{orbisCopy.empty.text}</p>
          </div>
        )}
        {latest && platforms.length === 0 && (
          <div className={styles.panelBox}>
            <p className={styles.statusText}>{orbisCopy.download.unavailable}</p>
          </div>
        )}
        {latest && platforms.length > 0 && (
          <div ref={cardsRef} className={cx(styles.cards, highlight && styles.cardsHighlight)}>
            {platforms.map(({ platform, builds }) => (
              <PlatformCard
                key={platform}
                platform={platform}
                builds={builds}
                release={latest}
                recommended={platform === detected}
                busy={busy}
                activeBuild={active}
                idle={!busy && phase !== "started"}
                onDownload={(b) => {
                  if (!busy) void start(b);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DownloadStatus({
  phase,
  build,
  release,
  onRetry,
}: {
  phase: Phase;
  build: OrbisBuild | null;
  release: OrbisRelease | null;
  onRetry: () => void;
}) {
  if (phase === "idle") return null;

  if (phase === "preparing" || phase === "starting") {
    return (
      <div className={styles.status}>
        <p className={styles.statusText}>{phase === "preparing" ? withOrbisLogo("Preparing Orbis…") : "Starting download…"}</p>
        <span className={styles.indeterminate} aria-hidden="true" />
      </div>
    );
  }

  if (phase === "started" && build) {
    return (
      <div className={styles.status}>
        <p className={styles.statusTitle}>Download started</p>
        <p className={styles.statusText}>
          Your browser should now be downloading {build.fileName}. If it doesn’t begin, <a href={build.url}>use the direct link</a>.
        </p>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className={styles.status}>
        <p className={styles.statusTitle}>{withOrbisLogo("Orbis is ready.")}</p>
        <p className={styles.statusText}>Your download has started — check your browser’s downloads.</p>
        <div className={styles.statusActions}>
          <button type="button" className={styles.pill} onClick={openInstallGuide}>
            Installation guide
          </button>
          <a className={styles.pill} href={release?.url ?? orbisReleasesUrl} target="_blank" rel="noopener noreferrer">
            Release notes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.status}>
      <p className={styles.statusTitle}>Something went wrong.</p>
      <p className={styles.statusText}>The download could not be started. Please try again or view the available releases.</p>
      <div className={styles.statusActions}>
        <Button variant="primary" size="md" onClick={onRetry}>
          Try again
        </Button>
        <Button href={orbisReleasesUrl} external variant="ghost" size="md" arrow>
          View releases
        </Button>
      </div>
    </div>
  );
}

function PlatformCard({
  platform,
  builds,
  release,
  recommended,
  busy,
  activeBuild,
  idle,
  onDownload,
}: {
  platform: OrbisPlatform;
  builds: OrbisBuild[];
  release: OrbisRelease;
  recommended: boolean;
  busy: boolean;
  activeBuild: OrbisBuild | null;
  idle: boolean;
  onDownload: (build: OrbisBuild) => void;
}) {
  const orb = useOrb();
  const meta = orbisPlatforms[platform];
  const [choice, setChoice] = useState(0);
  const build = builds[Math.min(choice, builds.length - 1)];
  const arch = archLabel(platform, build.arch);
  const compatibility =
    meta.compatibility ??
    ([...new Set(builds.map((b) => archLabel(platform, b.arch)).filter(Boolean))].join(" / ") || null);

  return (
    <article
      className={cx(styles.card, recommended && styles.cardRecommended)}
      data-platform={platform}
      aria-labelledby={`orbis-card-${platform}`}
      onPointerEnter={(e) => idle && e.pointerType === "mouse" && orb.setOverride("interactive")}
      onPointerLeave={(e) => idle && e.pointerType === "mouse" && orb.setOverride(null)}
    >
      <span className={styles.cardSheen} aria-hidden="true" />
      <span className={styles.cardDots} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>

      <div className={styles.cardTop}>
        <span className={styles.cardIcon}>
          <PlatformIcon platform={platform} />
        </span>
        {recommended && <span className={styles.badge}>For this device</span>}
      </div>

      <div>
        <h3 id={`orbis-card-${platform}`} className={styles.cardTitle}>
          {withOrbisLogo(meta.title)}
        </h3>
        {compatibility && <p className={styles.cardCompat}>{compatibility}</p>}
      </div>

      {builds.length > 1 && (
        <div className={styles.archPicker} role="radiogroup" aria-label={`${meta.label} download type`}>
          {builds.map((b, i) => (
            <button
              key={b.fileName}
              type="button"
              role="radio"
              aria-checked={i === choice}
              className={cx(styles.pill, i === choice && styles.pillActive)}
              onClick={() => setChoice(i)}
            >
              {buildLabel(b, builds)}
            </button>
          ))}
        </div>
      )}

      <dl className={styles.facts}>
        {builds.length > 1 && (
          <div>
            <dt>Download</dt>
            <dd>{buildLabel(build, [build])}</dd>
          </div>
        )}
        <div>
          <dt>Version</dt>
          <dd>{release.version}</dd>
        </div>
        <div>
          <dt>Released</dt>
          <dd>
            <time dateTime={release.publishedAt}>{formatDate(release.publishedAt)}</time>
          </dd>
        </div>
        {arch && (
          <div>
            <dt>Architecture</dt>
            <dd>{arch}</dd>
          </div>
        )}
        <div>
          <dt>File size</dt>
          <dd>{formatSize(build.size)}</dd>
        </div>
      </dl>

      {build.sha256 && <Checksum value={build.sha256} />}

      <div className={styles.cardCta} data-cta>
        <Button
          variant="primary"
          size="md"
          arrow
          loading={busy && activeBuild === build}
          loadingLabel="Starting download…"
          onClick={() => onDownload(build)}
        >
          {builds.length > 1 && build.kind === "portable" ? "Download portable" : meta.cta}
        </Button>
      </div>
      <p className={styles.fileName}>{build.fileName}</p>
    </article>
  );
}

function Checksum({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard unavailable: the full value stays in the page to select by hand. */
    }
  };
  return (
    <div className={styles.checksum}>
      <span className={styles.checksumLabel}>SHA-256</span>
      <code className={styles.checksumValue}>{value}</code>
      <button type="button" className={cx(styles.pill, styles.copyButton)} onClick={copy} aria-label="Copy the SHA-256 checksum">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** From download to Orbis: three steps, the Orb travelling between them, and the real platform guide. */
export function OrbisInstallation() {
  const { state } = useOrbisReleases();
  const [open, setOpen] = useState(false);
  const latest = state.status === "ready" ? state.releases[0] : null;
  const guides = latest ? platformsOf(latest).map((p) => p.platform).filter((p) => (orbisInstallGuide[p]?.length ?? 0) > 0) : [];
  const hasPortable = (p: OrbisPlatform) =>
    !!latest?.builds.some((b) => b.platform === p && b.kind === "portable") && (orbisPortableGuide[p]?.length ?? 0) > 0;

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(ORBIS_OPEN_GUIDE, onOpen);
    return () => window.removeEventListener(ORBIS_OPEN_GUIDE, onOpen);
  }, []);

  return (
    <section id="install" className={cx(styles.section, styles.install)} aria-labelledby="orbis-install-title">
      <div className="container">
        <Reveal as="h2" id="orbis-install-title" className={styles.sectionTitle}>
          {withOrbisLogo(orbisCopy.install.heading, { display: true })}
        </Reveal>

        <div className={styles.stepsWrap}>
          <div className={styles.stepPath} aria-hidden="true">
            <span className={styles.stepDot} />
          </div>
          <ol className={styles.steps}>
            {orbisCopy.install.steps.map((s, i) => (
              <Reveal as="li" key={s.n} className={styles.step} delay={i * 120}>
                <span className={styles.stepNum}>{s.n}</span>
                <h3 className={styles.stepTitle}>{withOrbisLogo(s.title)}</h3>
                <p className={styles.muted}>{withOrbisLogo(s.body)}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className={styles.guideRow}>
          {orbisDocsUrl ? (
            <Button href={orbisDocsUrl} external variant="secondary" size="md" arrow>
              Installation guide
            </Button>
          ) : guides.length > 0 ? (
            <button type="button" className={styles.pill} aria-expanded={open} aria-controls="orbis-install-guide" onClick={() => setOpen((v) => !v)}>
              {open ? "Hide installation guide" : "Installation guide"}
            </button>
          ) : state.status !== "loading" ? (
            <p className={styles.softNote}>An installation guide will be published with the first supported release.</p>
          ) : null}
        </div>

        {open && guides.length > 0 && (
          <div id="orbis-install-guide" className={styles.guide}>
            {guides.map((p) => (
              <div key={p}>
                <h3 className={styles.guideTitle}>Installing on {orbisPlatforms[p].label}</h3>
                <ol className={styles.guideSteps}>
                  {(orbisInstallGuide[p] ?? []).map((g) => (
                    <li key={g.title}>
                      <strong>{withOrbisLogo(g.title)}</strong>
                      {withOrbisLogo(g.body)}
                    </li>
                  ))}
                </ol>
                {hasPortable(p) && (
                  <>
                    <h3 className={cx(styles.guideTitle, styles.guideTitleNext)}>Portable on {orbisPlatforms[p].label}</h3>
                    <ol className={styles.guideSteps}>
                      {(orbisPortableGuide[p] ?? []).map((g) => (
                        <li key={g.title}>
                          <strong>{withOrbisLogo(g.title)}</strong>
                          {withOrbisLogo(g.body)}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

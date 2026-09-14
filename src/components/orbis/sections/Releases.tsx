"use client";

import { Fragment, useState, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { OrbisLogo, withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisBundleRequirements, orbisCopy, orbisPlatforms, orbisReleasesUrl, orbisRequirements } from "@/content/orbis";
import {
  archLabel,
  buildLabel,
  formatDate,
  formatSize,
  releaseSummary,
  useOrbisReleases,
  type OrbisNotesSection,
} from "@/lib/orbisReleases";
import { goToDownload, platformsOf } from "../shared";
import styles from "../Orbis.module.css";

/** **bold** and `code` inside release-note text. Everything else is plain text — never HTML. */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i}>{withOrbisLogo(part.slice(2, -2))}</strong>
        ) : part.startsWith("`") ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          <Fragment key={i}>{withOrbisLogo(part)}</Fragment>
        ),
      )}
    </>
  );
}

/** The release's own notes, rendered with the headings it actually has — nothing added, nothing renamed. */
export function ReleaseNotes({ sections }: { sections: OrbisNotesSection[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <div key={i} className={styles.notesSection}>
          {section.heading && <h4>{section.heading}</h4>}
          {section.blocks.map((block, j) =>
            block.type === "p" ? (
              <p key={j}>
                <InlineText text={block.text} />
              </p>
            ) : block.type === "ul" ? (
              <ul key={j}>
                {block.items.map((item, k) => (
                  <li key={k}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <pre key={j}>
                <code>{block.text}</code>
              </pre>
            ),
          )}
        </div>
      ))}
    </>
  );
}

export function ReleaseError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={styles.panelBox} role="alert">
      <p className={styles.statusTitle}>Release information couldn’t be loaded.</p>
      <p className={styles.statusText}>{message}</p>
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

/** The latest Orbis, straight from the release. */
export function OrbisLatestRelease() {
  const { state, retry } = useOrbisReleases();
  const [notesOpen, setNotesOpen] = useState(false);
  const latest = state.status === "ready" ? state.releases[0] : null;
  const platforms = latest ? platformsOf(latest) : [];

  return (
    <section id="latest" className={cx(styles.section, styles.latest)} aria-labelledby="orbis-latest-title">
      <div className="container">
        <Reveal as="h2" id="orbis-latest-title" className={cx(styles.sectionTitle, styles.center)}>
          {withOrbisLogo(orbisCopy.latest.heading, { display: true })}
        </Reveal>

        {state.status === "loading" && <p className={cx(styles.softNote, styles.center, styles.spaced)}>Loading the latest release…</p>}
        {state.status === "error" && <ReleaseError message={state.message} onRetry={retry} />}
        {state.status === "empty" && (
          <div className={styles.panelBox}>
            <p className={styles.statusTitle}>{withOrbisLogo(orbisCopy.empty.heading)}</p>
            <p className={styles.statusText}>{withOrbisLogo(orbisCopy.latest.empty)}</p>
          </div>
        )}

        {latest && (
          <Reveal className={styles.latestCard} variant="glass">
            <p className="eyebrow">Latest release</p>
            <h3 className={styles.latestVersion}>
              <OrbisLogo display /> {latest.version}
            </h3>
            <dl className={cx(styles.facts, styles.latestFacts)}>
              <div>
                <dt>Released</dt>
                <dd>
                  <time dateTime={latest.publishedAt}>{formatDate(latest.publishedAt)}</time>
                </dd>
              </div>
              {platforms.length > 0 && (
                <div>
                  <dt>Platforms</dt>
                  <dd>{platforms.map((p) => orbisPlatforms[p.platform].label).join(", ")}</dd>
                </div>
              )}
              {latest.builds.map((b) => {
                const prefix = latest.builds.length > 1 ? `${buildLabel(b, latest.builds)} · ` : "";
                const arch = archLabel(b.platform, b.arch);
                return (
                  <Fragment key={b.fileName}>
                    {arch && (
                      <div>
                        <dt>{prefix}Architecture</dt>
                        <dd>{arch}</dd>
                      </div>
                    )}
                    <div>
                      <dt>{prefix}File size</dt>
                      <dd>{formatSize(b.size)}</dd>
                    </div>
                  </Fragment>
                );
              })}
            </dl>
            <div className={styles.actions}>
              {platforms.length > 0 && (
                <Button variant="primary" size="md" arrow onClick={goToDownload}>
                  Download
                </Button>
              )}
              {latest.notes.length > 0 ? (
                <button type="button" className={styles.pill} aria-expanded={notesOpen} aria-controls="orbis-latest-notes" onClick={() => setNotesOpen((v) => !v)}>
                  {notesOpen ? "Hide release notes" : "View release notes"}
                </button>
              ) : (
                <a className={styles.pill} href={latest.url} target="_blank" rel="noopener noreferrer">
                  View release notes
                </a>
              )}
            </div>
            {notesOpen && (
              <div id="orbis-latest-notes" className={styles.notes}>
                <ReleaseNotes sections={latest.notes} />
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** Every published release, newest first. Shown only when there is history to show. */
export function OrbisReleaseHistory() {
  const { state } = useOrbisReleases();
  const [open, setOpen] = useState<string | null>(null);
  if (state.status !== "ready") return null;

  return (
    <section id="releases" className={cx(styles.section, styles.releases)} aria-labelledby="orbis-history-title">
      <div className="container">
        <Reveal as="h2" id="orbis-history-title" className={cx(styles.sectionTitle, styles.center)}>
          {orbisCopy.history.heading}
        </Reveal>
        <ol className={styles.timeline}>
          {state.releases.map((r) => {
            const summary = releaseSummary(r);
            const isOpen = open === r.tag;
            const notesId = `orbis-notes-${r.tag.replace(/[^a-z0-9]/gi, "-")}`;
            return (
              <Reveal as="li" key={r.tag} className={styles.timelineItem}>
                <span className={styles.timelineDot} aria-hidden="true" />
                <div className={styles.timelineHead}>
                  <h3 className={styles.timelineVersion}>
                    <OrbisLogo /> {r.version}
                  </h3>
                  <time dateTime={r.publishedAt}>{formatDate(r.publishedAt)}</time>
                </div>
                {summary && (
                  <p className={styles.muted}>
                    <InlineText text={summary} />
                  </p>
                )}
                <div className={styles.actions}>
                  {r.notes.length > 0 && (
                    <button type="button" className={styles.pill} aria-expanded={isOpen} aria-controls={notesId} onClick={() => setOpen(isOpen ? null : r.tag)}>
                      {isOpen ? "Hide details" : "Show details"}
                    </button>
                  )}
                  <a className={styles.textLink} href={r.url} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </div>
                {isOpen && (
                  <div id={notesId} className={styles.notes}>
                    <ReleaseNotes sections={r.notes} />
                  </div>
                )}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Ready for your system. Only platforms with a release and verified requirements get a tab. */
export function OrbisRequirements() {
  const { state } = useOrbisReleases();
  const [tab, setTab] = useState(0);
  const latest = state.status === "ready" ? state.releases[0] : null;
  const platforms = latest ? platformsOf(latest).map((p) => p.platform).filter((p) => (orbisRequirements[p]?.length ?? 0) > 0) : [];
  const current = platforms.length ? platforms[Math.min(tab, platforms.length - 1)] : null;
  const tabs = platforms.length > 1;
  // The All-in-One download has its own, heavier requirements: it runs ORION and its models too.
  const bundleRequirements =
    current && latest?.builds.some((b) => b.platform === current && b.kind === "bundle" && b.parts) ? (orbisBundleRequirements[current] ?? null) : null;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (tab + (e.key === "ArrowRight" ? 1 : -1) + platforms.length) % platforms.length;
    setTab(next);
    document.getElementById(`orbis-req-tab-${platforms[next]}`)?.focus();
  };

  return (
    <section id="requirements" className={cx(styles.section, styles.requirements)} aria-labelledby="orbis-req-title">
      <div className="container">
        <Reveal as="h2" id="orbis-req-title" className={cx(styles.sectionTitle, styles.center)}>
          {orbisCopy.requirements.heading}
        </Reveal>
        <div className={styles.reqWrap}>
          {state.status !== "loading" && !current && <p className={cx(styles.muted, styles.center)}>{orbisCopy.requirements.empty}</p>}

          {tabs && (
            <div className={styles.reqTabs} role="tablist" aria-label="Platform">
              {platforms.map((p, i) => (
                <button
                  key={p}
                  id={`orbis-req-tab-${p}`}
                  type="button"
                  role="tab"
                  aria-selected={p === current}
                  aria-controls="orbis-req-panel"
                  tabIndex={p === current ? 0 : -1}
                  className={cx(styles.pill, p === current && styles.pillActive)}
                  onClick={() => setTab(i)}
                  onKeyDown={onKey}
                >
                  {orbisPlatforms[p].label}
                </button>
              ))}
            </div>
          )}

          {current && (
            <Reveal
              className={styles.reqPanel}
              variant="glass"
              id="orbis-req-panel"
              {...(tabs ? { role: "tabpanel", "aria-labelledby": `orbis-req-tab-${current}` } : {})}
            >
              <h3 className={styles.reqTitle}>{withOrbisLogo(orbisPlatforms[current].title)}</h3>
              <dl className={styles.reqList}>
                {(orbisRequirements[current] ?? []).map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>{withOrbisLogo(r.value)}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {bundleRequirements && (
            <Reveal className={cx(styles.reqPanel, styles.reqPanelNext)} variant="glass">
              <h3 className={styles.reqTitle}>All-in-One download</h3>
              <p className={styles.reqLead}>
                {withOrbisLogo("Orbis, ORION and its AI models in one download, so ORION doesn’t need to be set up separately.")}
              </p>
              <dl className={styles.reqList}>
                {bundleRequirements.map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

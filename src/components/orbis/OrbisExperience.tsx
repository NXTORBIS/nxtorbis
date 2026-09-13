"use client";

import { OrbStage } from "./orb/OrbStage";
import { OrbisHero, OrbisIntro } from "./sections/Opening";
import { OrbisConnected } from "./sections/Connected";
import { OrbisFeatures, OrbisMore } from "./sections/Features";
import { OrbisDownload, OrbisInstallation } from "./sections/Download";
import { OrbisLatestRelease, OrbisReleaseHistory, OrbisRequirements } from "./sections/Releases";
import { OrbisEcosystem, OrbisFinal } from "./sections/Closing";
import styles from "./Orbis.module.css";

/**
 * NxtOrbis presents Orbis.
 *
 * Discover → Understand → Explore → Interact → Download → Enter Orbis.
 * The pacing is deliberate: loud, quiet, interactive, rich, cinematic,
 * functional, informational, simple, quiet, cinematic.
 */
export function OrbisExperience() {
  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <OrbStage>
        <div className={styles.content}>
          <OrbisHero />
          <OrbisIntro />
          <OrbisConnected />
          <OrbisFeatures />
          <OrbisMore />
          <OrbisDownload />
          <OrbisLatestRelease />
          <OrbisReleaseHistory />
          <OrbisRequirements />
          <OrbisInstallation />
          <OrbisEcosystem />
          <OrbisFinal />
        </div>
      </OrbStage>
    </div>
  );
}

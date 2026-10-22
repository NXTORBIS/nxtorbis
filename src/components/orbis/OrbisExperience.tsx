"use client";

import { BackgroundParticles } from "./BackgroundParticles";
import { Spotlight } from "./Spotlight";
import { Atmosphere } from "./Atmosphere";
import { Cursor } from "./Cursor";
import { Filament } from "./Filament";
import { Instruments } from "./Instruments";
import { WireframeKey } from "./WireframeKey";
import { Spine } from "./Spine";
import { OrbStage } from "./orb/OrbStage";
import { OrbisHero, OrbisIntro } from "./sections/Opening";
import { OrbisConnected } from "./sections/Connected";
import { OrbisFeatures, OrbisMore } from "./sections/Features";
import { OrbisGathering } from "./sections/Gathering";
import { OrbisDownload, OrbisInstallation } from "./sections/Download";
import { OrbisLatestRelease, OrbisReleaseHistory, OrbisRequirements } from "./sections/Releases";
import { OrbisEcosystem, OrbisFinal } from "./sections/Closing";
import { OrbisEnding } from "./sections/Ending";
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
    <div className={styles.page} data-orbis-page>
      <div className={styles.atmosphere} aria-hidden="true" />
      <Atmosphere />
      <BackgroundParticles />
      <Spotlight />
      <Spine />
      <Instruments />
      <Cursor />
      <Filament />
      <WireframeKey />
      <OrbStage>
        <div className={styles.content}>
          <OrbisHero />
          <OrbisIntro />
          <OrbisConnected />
          <OrbisFeatures />
          <OrbisGathering />
          <OrbisMore />
          <OrbisDownload />
          <OrbisLatestRelease />
          <OrbisReleaseHistory />
          <OrbisRequirements />
          <OrbisInstallation />
          <OrbisEcosystem />
          <OrbisFinal />
          <OrbisEnding />
        </div>
      </OrbStage>
    </div>
  );
}

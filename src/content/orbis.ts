import { company } from "@/content/site";

/**
 * Orbis — every word on nxtorbis.com/orbis, and every fact the page relies on.
 *
 * Two kinds of content live here and they are kept apart on purpose:
 *
 *  - Product copy, supplied by NxtOrbis for the Orbis page.
 *  - Verified facts about the shipped build (platform, architecture,
 *    requirements, installation). Each one is traced to its source in a
 *    comment. Anything not verified is simply absent — the page hides a field
 *    rather than filling it.
 *
 * Release data (version, date, file size, download URL, checksum, notes) is
 * NOT here. It is read live from GitHub Releases by lib/orbisReleases, so
 * publishing a release updates the page with no code change.
 */

export type OrbisPlatform = "windows" | "macos" | "linux";

export const orbisGithub = { owner: "NXTORBIS", repo: "Orbis" } as const;
export const orbisRepoUrl = `https://github.com/${orbisGithub.owner}/${orbisGithub.repo}`;
export const orbisReleasesUrl = `${orbisRepoUrl}/releases`;
export const orbisIssuesUrl = `${orbisRepoUrl}/issues`;

/** Downloads are only ever started from this prefix. Anything else is refused. */
export const orbisTrustedDownloadPrefix = `${orbisRepoUrl}/releases/download/`;

/**
 * External documentation. None exists yet, so the installation guide is the
 * one on this page. Set a real URL here when documentation is published.
 */
export const orbisDocsUrl: string | null = null;

export type OrbisPlatformMeta = {
  label: string;
  title: string;
  cta: string;
  /** Compatibility line, only where verified. */
  compatibility: string | null;
  /**
   * Architecture to assume when an asset's file name does not state one.
   * Windows: the shipped Orbis.exe is an x64 PE binary (checked from its
   * header, 13 Sep 2026). No default for platforms without a verified build.
   */
  defaultArch: string | null;
};

export const orbisPlatforms: Record<OrbisPlatform, OrbisPlatformMeta> = {
  // Electron 44 supports Windows 10 and later; the installer targets x64.
  windows: { label: "Windows", title: "Orbis for Windows", cta: "Download for Windows", compatibility: "Windows 10 / 11", defaultArch: "x64" },
  macos: { label: "macOS", title: "Orbis for macOS", cta: "Download for macOS", compatibility: null, defaultArch: null },
  linux: { label: "Linux", title: "Orbis for Linux", cta: "Download for Linux", compatibility: null, defaultArch: null },
};

/** Requirements are shown only for platforms that have both a release and verified requirements. */
export const orbisRequirements: Partial<Record<OrbisPlatform, { label: string; value: string }[]>> = {
  windows: [
    { label: "Operating system", value: "Windows 10 or 11" },
    { label: "Architecture", value: "x64 (64-bit)" },
    // Since 0.3.0, src/main/nim.ts sends chats to Groq's cloud API (GROQ_BASE_URL); nothing needs to run locally.
    { label: "Internet", value: "Required. The AI runs in the cloud, so nothing else needs to be installed or running." },
  ],
};

/** Installation steps per platform, from the shipped installer's configuration. */
export const orbisInstallGuide: Partial<Record<OrbisPlatform, { title: string; body: string }[]>> = {
  windows: [
    {
      title: "Run the installer",
      // electron-builder.yml: NSIS, oneClick false, allowToChangeInstallationDirectory true; not code-signed.
      body: "Open the Orbis installer and choose where to install. The installer isn’t code-signed yet, so Windows SmartScreen may show a notice — select More info, then Run anyway.",
    },
    {
      // Same appId (ai.nxtorbis.desktop) across versions, so a newer installer upgrades in place and keeps user data.
      title: "Already have Orbis?",
      body: "Run the new installer over your current version. It upgrades in place and keeps your chats and settings.",
    },
    {
      // WelcomeExperience.tsx: the first launch asks for a name; chats need an internet connection.
      title: "Enter Orbis",
      body: "Launch Orbis from the Start menu, tell it your name the first time, and begin. Make sure you’re connected to the internet.",
    },
  ],
};

/** Steps for the portable download, shown only when a portable build is published. */
export const orbisPortableGuide: Partial<Record<OrbisPlatform, { title: string; body: string }[]>> = {
  windows: [
    { title: "Extract the zip", body: "Unzip the portable download wherever you like. Nothing is installed." },
    {
      title: "Run Orbis.exe",
      // Orbis-0.1.0-Portable.zip contains win-unpacked/Orbis.exe; the executable is not code-signed.
      body: "Open the win-unpacked folder and run Orbis.exe. It isn’t code-signed yet, so Windows SmartScreen may show a notice — select More info, then Run anyway.",
    },
    { title: "Start ORION", body: "This release talks only to ORION on your own computer, so make sure ORION is running before you open Orbis." },
  ],
};

/**
 * Steps for the All-in-One download: Orbis, ORION, its models and a private
 * Python in one zip, published in parts. From the bundle's README.txt and
 * Start-Orbis.bat. `{file}` in a command is replaced with the joined file name.
 */
export const orbisBundleGuide: Partial<Record<OrbisPlatform, { title: string; body: string; command?: string }[]>> = {
  windows: [
    { title: "Download every part", body: "Save all the parts in the same folder." },
    {
      title: "Extract",
      body: "Open the first part, the file ending in .001, with 7-Zip and extract it. Without 7-Zip, join the parts first by running this in Command Prompt in that folder, then extract the joined zip:",
      command: "copy /b {file}.* {file}",
    },
    {
      title: "Start Orbis",
      body: "Open the extracted folder and double-click Start-Orbis.bat. The first start loads the AI models and can take a few minutes. A minimized window called “ORION - keep this window open” appears on the taskbar, and Orbis opens by itself when ORION is ready.",
    },
    { title: "Stop", body: "Close Orbis, then close the ORION window." },
  ],
};

/** Requirements for the All-in-One download, from its README.txt and ORION's laptop profile (configs/system/laptop.yaml). */
export const orbisBundleRequirements: Partial<Record<OrbisPlatform, { label: string; value: string }[]>> = {
  windows: [
    { label: "Operating system", value: "Windows 10 or 11, 64-bit" },
    { label: "Memory", value: "16 GB RAM recommended. The 14B chat model uses about 9 GB." },
    // Parts total 12.2 GB and the extracted folder is 12.2 GB; the README asks for about 15 GB to run.
    { label: "Disk space", value: "About 25 GB free to download and extract, and about 15 GB once the parts are deleted." },
    // llama.cpp CPU build; laptop.yaml records 3.2 tokens per second measured.
    { label: "Processor", value: "Runs on the processor, no graphics card needed. Replies are slow: about 3 tokens a second on the laptop it was measured on." },
    { label: "Internet", value: "Only for web search and the browser panel. The AI runs on this PC." },
  ],
};

export type OrbisCapabilityId = "browser" | "ai" | "toolkit" | "courses" | "chess" | "arena" | "eye" | "cosmos";

export const orbisCopy = {
  label: company.name,
  hero: {
    title: "Orbis",
    tagline: "A browser with a mind of its own.",
    support: "Browse, ask, build, learn and play — in one window.",
    description:
      "Orbis puts Orion beside every page you open, and brings eight worlds of its own along with it. What you do stays on your computer.",
    primary: "Download Orbis",
    secondary: "Explore Orbis",
  },
  intro: {
    heading: "This is Orbis.",
    support: `A browser built by ${company.name}, with Orion inside it.`,
    detail: "Ask about the page you are on. Then step into the Toolkit, Courses, Chess, the Arena, Earth and the universe.",
  },
  connected: { heading: "Eight worlds, one window." },
  features: { heading: "What is inside." },
  privacy: {
    heading: "It all stays here.",
    text: "Orbis keeps what you do on your own computer, and gives you the locks to keep it there.",
  },
  more: {
    heading: "More than a browser.",
    text: "Orbis is designed to feel less like another application and more like a place you work, learn and play.",
  },
  download: {
    heading: "Download Orbis",
    sub: "Bring Orbis to your device.",
    unavailable: "Release information will appear here when available.",
  },
  latest: {
    heading: "The latest Orbis.",
    empty: "The first Orbis release will appear here.",
  },
  history: { heading: "Every release." },
  requirements: {
    heading: "Ready for your system.",
    empty: "System requirements will be published with the first supported release.",
  },
  install: {
    heading: "From download to Orbis.",
    steps: [
      { n: "01", title: "Download", body: "Choose your platform." },
      { n: "02", title: "Install", body: "Install Orbis on your device." },
      { n: "03", title: "Enter Orbis", body: "Launch and begin." },
    ],
  },
  ecosystem: {
    heading: "Orbis is part of something bigger.",
    text: `Explore more products and experiences from ${company.name}.`,
    cta: `Explore ${company.name}`,
  },
  final: {
    heading: "Ready for Orbis?",
    support: "One window, and everything in it.",
  },
  empty: {
    heading: "Orbis is getting ready.",
    text: "Release information will appear here when the first supported build is available.",
  },
} as const;

export const orbisCapabilities: { id: OrbisCapabilityId; label: string; description: string }[] = [
  { id: "browser", label: "Browser", description: "Tabs, workspaces, downloads and permissions, with ads blocked." },
  { id: "ai", label: "Orion", description: "Ask about the page you are on, and have it answered with sources." },
  { id: "toolkit", label: "Toolkit", description: "Thousands of calculators, converters and lab tools, offline." },
  { id: "courses", label: "Courses", description: "Structured learning, with what you know actually measured." },
  { id: "chess", label: "Chess", description: "Play the engine, study your games and follow live tournaments." },
  { id: "arena", label: "Arena", description: "Live football and Formula 1, with scores, tables and timing." },
  { id: "eye", label: "OrbisEye", description: "A live 3D Earth: aircraft, ships, satellites and earthquakes." },
  { id: "cosmos", label: "Cosmos", description: "A real-time 3D universe, from the Solar System to the Milky Way." },
];

export const orbisFeatures: { id: OrbisCapabilityId; title: string; copy: string }[] = [
  {
    id: "browser",
    title: "Browser",
    copy: "Tabs, workspaces, history, downloads and per-site permissions — with ad blocking built in, not bolted on.",
  },
  {
    id: "ai",
    title: "Orion",
    copy: "Orion sits beside the page you are reading. Ask about it, have it acted on, or research a question and get the sources back with the answer.",
  },
  {
    id: "toolkit",
    title: "Toolkit",
    copy: "Over two thousand calculators, converters and lab tools, from engineering to chemistry — all of them working on this computer, with or without a connection.",
  },
  {
    id: "courses",
    title: "Courses",
    copy: "Structured learning that measures what you actually know, instead of how many videos you have watched.",
  },
  {
    id: "chess",
    title: "Chess World",
    copy: "Play the engine, study your own games move by move, train against your weaknesses, and follow live tournaments.",
  },
  {
    id: "arena",
    title: "Arena",
    copy: "Live football and Formula 1: scores, fixtures, tables, form, the race calendar, and lap and sector timing.",
  },
  {
    id: "eye",
    title: "OrbisEye",
    copy: "A live 3D Earth. Aircraft in the air, ships at sea, satellites overhead and earthquakes as they are recorded.",
  },
  {
    id: "cosmos",
    title: "Cosmos",
    copy: "A real-time 3D universe, simulated to scale — the Solar System, the stars around it, and the Milky Way beyond.",
  },
];

/**
 * What Orbis keeps on the visitor's own computer, and the locks on it. Each line
 * is traced to the app's code:
 *
 *  - store.ts writes chats, settings and profile data under the user's app folder
 *  - accountSecurity.ts wraps a random account key with a scrypt key from the
 *    password, and never stores anything to compare a password against
 *  - portable/encryption.ts seals an exported profile with AES-256-GCM, each file
 *    bound to its own path, the key derived by scrypt (~0.25s, 64 MB per guess)
 *  - platformElectron.ts keeps keys in Windows' own encrypted storage (safeStorage)
 *  - the Toolkit and the Arcade need no connection; Orion's answers do
 */
export const orbisPrivacy: { title: string; body: string }[] = [
  {
    title: "Your data stays here",
    body: "Chats, history, bookmarks, workspaces and course progress are files on your own computer. NxtOrbis runs no server that holds them.",
  },
  {
    title: "Lock a profile",
    body: "A password derives the key that unwraps your profile. Nothing is stored to compare it against, so there is no password sitting there to be taken.",
  },
  {
    title: "Carry it, sealed",
    body: "Move a profile to another computer as an encrypted package: AES-256-GCM, every file sealed separately, the key slowed to about a quarter of a second per guess.",
  },
  {
    title: "Honest about the cloud",
    body: "Orion answers from the cloud, so that part needs a connection — but the Toolkit and everything you have saved keep working without one.",
  },
];

export const orbisSeo = {
  title: "Orbis — Intelligence, within reach. | NxtOrbis®",
  description: `Explore Orbis, the connected intelligent environment from ${company.name} for AI, workspace, memory, files, tools, learning, and voice.`,
} as const;

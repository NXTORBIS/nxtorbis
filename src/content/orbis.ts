/**
 * Orbis — every word on nxtorbis.com/ai.
 *
 * Sourced from the Orbis app itself (README, electron-builder.yml, src/shared)
 * and the Orbis download site. Where the two disagreed, the app wins: the
 * current installer installs as "Orbis" and keeps its data in %APPDATA%\Orbis,
 * whatever the older download page said.
 *
 * Nothing here is a claim the app does not back up. Voice, image upload and
 * web search are listed as not built yet, because they are not.
 */

export const orbisRelease = {
  owner: "NXTORBIS",
  repo: "Orbis",
  /** Shown until GitHub answers, and whenever it cannot. */
  fallbackVersion: "0.1.0",
} as const;

export const orbisRepoUrl = `https://github.com/${orbisRelease.owner}/${orbisRelease.repo}`;
export const orbisReleasesUrl = `${orbisRepoUrl}/releases`;
export const orbisLatestUrl = `${orbisRepoUrl}/releases/latest`;

export const orbisSeo = {
  title: "Orbis — Desktop AI assistant for Windows | NxtOrbis®",
  description:
    "Orbis is a free desktop AI assistant for Windows from NxtOrbis®, with a sci-fi HUD interface. Stream replies from Kimi K3, DeepSeek V4 and other leading models, with readable reasoning, code and math.",
  ogTitle: "Orbis — Desktop AI assistant for Windows",
  ogDescription: "A free desktop AI assistant with a sci-fi HUD. Kimi K3, DeepSeek V4 and more, streaming on your Windows PC.",
} as const;

export const orbisHero = {
  eyebrow: "Desktop AI for Windows · by NxtOrbis",
  lead:
    "Orbis is a free desktop assistant for Windows. Stream answers from Kimi K3, DeepSeek V4 and other leading models through a sci-fi interface — with reasoning you can read, code you can copy, and chat history that stays on your PC.",
  glance: [
    { value: "5", label: "models on board" },
    { value: "4", label: "assistants" },
    { value: "0", label: "accounts — just your key" },
    { value: "Windows", label: "10 / 11 · 64-bit" },
  ],
} as const;

export type OrbisIconName =
  | "layers" | "message" | "brain" | "refresh" | "files" | "history" | "shield" | "palette"
  | "sparkles" | "zap" | "gauge" | "sliders" | "users" | "monitor" | "check" | "chevron"
  | "windows" | "external";

export const orbisFeatures: { icon: OrbisIconName; title: string; body: string }[] = [
  { icon: "layers", title: "HUD interface", body: "An animated particle grid, a system bar with live CPU load and clock, an icon rail, a glowing composer and a holographic thinking orb." },
  { icon: "message", title: "Streaming replies", body: "Answers stream into glass cards with Markdown, tables, syntax-highlighted code and LaTeX math — while you watch them arrive." },
  { icon: "brain", title: "Reasoning you can read", body: "Models that think show their work in a collapsible reasoning panel, along with how long they thought before answering." },
  { icon: "refresh", title: "Never left waiting", body: "If a model is rate-limited, the next one answers. If they’re all busy, Orbis waits for the window to reset and retries. Every switch is logged in the activity panel." },
  { icon: "files", title: "Files and prompt help", body: "Attach text and code files to any message. Improve prompt rewrites your draft with the Fast model before you send it." },
  { icon: "history", title: "Chats that stay put", body: "A history drawer with search, rename and delete. Share any chat as Markdown. Stop, regenerate, edit-and-resend, rate, or have replies read aloud." },
  { icon: "shield", title: "Your key stays yours", body: "Your API key is encrypted with Windows DPAPI and never reaches the interface process. Conversations are stored on your own PC." },
  { icon: "palette", title: "Make it yours", body: "Name your assistant, tell it how to address you, write custom instructions, choose dark or light, and switch the visual effects on or off." },
];

export const orbisModes: { icon: OrbisIconName; name: string; model: string; note: string }[] = [
  { icon: "sparkles", name: "Auto", model: "Kimi K3", note: "General use — the default." },
  { icon: "zap", name: "Fast", model: "DeepSeek V4 Flash", note: "Quick responses at low effort." },
  { icon: "gauge", name: "Advanced", model: "DeepSeek V4 Pro", note: "Higher quality for harder work." },
  { icon: "brain", name: "Reasoning", model: "Kimi K3 · max effort", note: "Deep thinking, shown step by step." },
  { icon: "sliders", name: "Customize", model: "Any model", note: "Choose a specific NVIDIA model." },
];

export const orbisModels: { name: string; note: string; tag?: string }[] = [
  { name: "Kimi K3", note: "Most capable. Always thinks first.", tag: "Default" },
  { name: "DeepSeek V4 Pro", note: "Strong reasoning and code." },
  { name: "Kimi K2.6", note: "Previous Kimi generation." },
  { name: "DeepSeek V4 Flash", note: "Faster replies." },
  { name: "Nemotron 3 Ultra", note: "NVIDIA’s largest model." },
];

export const orbisAssistants = [
  { name: "General AI", note: "Everyday questions and tasks" },
  { name: "Code Engineer", note: "Programming, debugging, architecture" },
  { name: "Research Analyst", note: "Deep dives, comparisons, summaries" },
  { name: "Creative Writer", note: "Stories, copy and editing" },
] as const;

export const orbisRequirements = ["Windows 10 or 11, 64-bit", "An internet connection", "A free NVIDIA API key"] as const;

export const orbisShortcuts: { action: string; keys: string[][] }[] = [
  { action: "Send · new line", keys: [["Enter"], ["Shift", "Enter"]] },
  { action: "Stop generating", keys: [["Esc"]] },
  { action: "New chat", keys: [["Ctrl", "Shift", "O"]] },
  { action: "Toggle chat history", keys: [["Ctrl", "B"]] },
  { action: "Settings", keys: [["Ctrl", ","]] },
];

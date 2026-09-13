import type { Metadata } from "next";
import { company } from "@/content/site";
import {
  orbisAssistants,
  orbisFeatures,
  orbisHero,
  orbisModels,
  orbisModes,
  orbisReleasesUrl,
  orbisRequirements,
  orbisSeo,
  orbisShortcuts,
} from "@/content/orbis";
import { Reveal } from "@/lib/Reveal";
import { orbitron } from "@/components/orbis/fonts";
import { OrbisIcon, OrbisIconSheet } from "@/components/orbis/Icons";
import { OrbisDownload, OrbisReleaseDate, OrbisReleaseNotes } from "@/components/orbis/Download";
import { OrbisBackdropParticles } from "@/components/orbis/Particles";
import { HudPreview } from "@/components/orbis/HudPreview";
import "./orbis.css";

const OG = { url: "/orbis/og-image.png", width: 1200, height: 630, alt: "Orbis — Desktop AI assistant for Windows" };

export const metadata: Metadata = {
  title: orbisSeo.title,
  description: orbisSeo.description,
  alternates: { canonical: "/ai" },
  openGraph: {
    type: "website",
    siteName: company.legalName,
    title: orbisSeo.ogTitle,
    description: orbisSeo.ogDescription,
    url: "/ai",
    images: [OG],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: orbisSeo.ogTitle, description: orbisSeo.ogDescription, images: [OG.url] },
};

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <Reveal className="ob-section-head">
      <p className="ob-eyebrow"><span className="ob-dot" />{eyebrow}</p>
      <h2 className="ob-section-title">{title}</h2>
      {sub && <p className="ob-section-sub">{sub}</p>}
    </Reveal>
  );
}

export default function OrbisPage() {
  return (
    <div className={`orbis-page ${orbitron.variable}`}>
      <OrbisIconSheet />
      <div className="ob-bg" aria-hidden="true">
        <div className="ob-bg-grid" />
        <OrbisBackdropParticles />
      </div>

      {/* ------------------------------------------------------------ hero -- */}
      <section className="ob-hero" aria-labelledby="orbis-title">
        <div className="ob-container ob-hero-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ob-hero-logo" src="/orbis/orbis-wordmark.png" alt="Orbis" width={1200} height={461} fetchPriority="high" />
          <p className="ob-eyebrow"><span className="ob-dot" />{orbisHero.eyebrow}</p>
          <h1 id="orbis-title" className="ob-hero-title">
            Your desktop AI,<br />with a <span className="ob-glow">HUD</span>.
          </h1>
          <p className="ob-hero-sub">{orbisHero.lead}</p>
          <div className="ob-hero-cta">
            <OrbisDownload />
            <a className="ob-btn ob-btn-glass ob-btn-lg" href="#demo">
              See it in action <OrbisIcon name="chevron" />
            </a>
          </div>
          <p className="ob-hero-note">
            Free, no account. Bring a free{" "}
            <a href="https://build.nvidia.com" target="_blank" rel="noopener">NVIDIA API key</a> — it takes about two minutes.{" "}
            <a href="#start">How it works</a>
          </p>
        </div>

        <div className="ob-container" id="demo">
          <HudPreview />
          <ul className="ob-glance" aria-label="At a glance">
            {orbisHero.glance.map((g) => (
              <li key={g.label}><b>{g.value}</b> {g.label}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------- features -- */}
      <section className="ob-section" id="features">
        <div className="ob-container">
          <SectionHead
            eyebrow="Features"
            title={<>Built like a cockpit.<br />Works like a chat.</>}
            sub="Everything you expect from a modern AI chat app, inside an interface that feels like mission control."
          />
          <div className="ob-grid ob-features">
            {orbisFeatures.map((f, i) => (
              <Reveal key={f.title} as="article" className="ob-card ob-glass" delay={i * 60}>
                <span className="ob-card-icon"><OrbisIcon name={f.icon} /></span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- modes -- */}
      <section className="ob-section ob-section-alt" id="modes">
        <div className="ob-container">
          <SectionHead
            eyebrow="Modes & models"
            title="Five ways to think."
            sub="Pick a mode and Orbis picks the model. Or take the controls and choose any model yourself."
          />
          <Reveal className="ob-modes">
            {orbisModes.map((m) => (
              <div key={m.name} className="ob-mode ob-glass">
                <span className="ob-mode-icon"><OrbisIcon name={m.icon} /></span>
                <div className="ob-mode-text">
                  <b>{m.name}</b>
                  <span className="ob-mode-model">{m.model}</span>
                  <small>{m.note}</small>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="ob-models ob-glass">
            <div className="ob-models-head">
              <h3>Models on board</h3>
              <p>Served through NVIDIA’s API. The order is also the fallback chain — when a model is busy, the next one answers.</p>
            </div>
            <ol className="ob-model-list">
              {orbisModels.map((m, i) => (
                <li key={m.name}>
                  <span className="ob-num">{String(i + 1).padStart(2, "0")}</span>
                  <b>{m.name}</b>
                  <span>{m.note}</span>
                  {m.tag && <i className="ob-tag">{m.tag}</i>}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="ob-assistants">
            <h3 className="ob-assistants-title"><OrbisIcon name="users" />Four assistants on the rail</h3>
            <ul className="ob-assistant-list">
              {orbisAssistants.map((a) => (
                <li key={a.name} className="ob-glass"><b>{a.name}</b><span>{a.note}</span></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- get started -- */}
      <section className="ob-section" id="start">
        <div className="ob-container">
          <SectionHead
            eyebrow="Get started"
            title="Ready in three steps."
            sub="No sign-up, no subscription. Orbis talks to the models with your own free NVIDIA API key."
          />
          <div className="ob-start-grid">
            <ol className="ob-steps">
              <Reveal as="li" className="ob-step ob-glass">
                <span className="ob-step-num">01</span>
                <div>
                  <h3>Download and install</h3>
                  <p>
                    Run the installer and pick a folder. It installs as <em>Orbis</em>. Windows may show a SmartScreen notice
                    because the installer isn’t code-signed yet — choose <b>More info → Run anyway</b>.
                  </p>
                  <OrbisDownload size="sm" />
                </div>
              </Reveal>
              <Reveal as="li" className="ob-step ob-glass" delay={80}>
                <span className="ob-step-num">02</span>
                <div>
                  <h3>Get a free NVIDIA API key</h3>
                  <p>
                    Sign in at <a href="https://build.nvidia.com" target="_blank" rel="noopener">build.nvidia.com</a>, open any
                    model and click <b>Get API key</b>. Your key starts with <code>nvapi-</code>.
                  </p>
                </div>
              </Reveal>
              <Reveal as="li" className="ob-step ob-glass" delay={160}>
                <span className="ob-step-num">03</span>
                <div>
                  <h3>Connect and say hi</h3>
                  <p>
                    Open Orbis, press <kbd>Ctrl</kbd> + <kbd>,</kbd> (or click your avatar), paste the key and click{" "}
                    <b>Save</b>. Orbis tests it on the spot. That’s it.
                  </p>
                </div>
              </Reveal>
            </ol>
            <Reveal as="aside" className="ob-requirements ob-glass" delay={240}>
              <h3><OrbisIcon name="monitor" />Requirements</h3>
              <ul>
                {orbisRequirements.map((r) => (
                  <li key={r}><OrbisIcon name="check" />{r}</li>
                ))}
              </ul>
              <p className="ob-fine">
                NVIDIA’s free tier allows roughly 40 requests per minute and is intended for testing and evaluation. Orbis
                handles the limits for you; the activity panel shows every wait and switch.
              </p>
              <OrbisReleaseDate />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- shortcuts -- */}
      <section className="ob-section ob-section-alt" id="shortcuts">
        <div className="ob-container ob-shortcuts-inner">
          <SectionHead eyebrow="Shortcuts" title="Fly it from the keyboard." sub="The controls you’ll reach for most, without touching the mouse." />
          <Reveal className="ob-shortcuts ob-glass">
            {orbisShortcuts.map((s) => (
              <div key={s.action} className="ob-shortcut">
                <span>{s.action}</span>
                <span className="ob-keys">
                  {s.keys.map((combo, ci) => (
                    <span key={ci}>
                      {ci > 0 && " · "}
                      {combo.map((k, ki) => (
                        <span key={k}>{ki > 0 && "+"}<kbd>{k}</kbd></span>
                      ))}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- faq -- */}
      <section className="ob-section" id="faq">
        <div className="ob-container ob-faq-inner">
          <SectionHead eyebrow="FAQ" title="Questions, answered." />
          <Reveal className="ob-faq">
            <details className="ob-glass" open>
              <summary>Is Orbis free?<OrbisIcon name="chevron" /></summary>
              <p>
                Yes. Orbis is free to download and use. It connects to the models with your own NVIDIA API key, which NVIDIA
                offers on a free tier for testing and evaluation — about 40 requests a minute. There is no Orbis account and
                nothing to subscribe to.
              </p>
            </details>
            <details className="ob-glass">
              <summary>Where do my chats and my key go?<OrbisIcon name="chevron" /></summary>
              <p>
                Your messages are sent to NVIDIA’s API to generate replies. Your chat history and settings live on your PC in{" "}
                <code>%APPDATA%\Orbis</code>. The API key is encrypted with Windows DPAPI and is only ever read by the app’s
                background process, never by the interface.
              </p>
            </details>
            <details className="ob-glass">
              <summary>Windows warned me when I ran the installer. Is that normal?<OrbisIcon name="chevron" /></summary>
              <p>
                Yes, for now. The installer isn’t code-signed yet, so Windows SmartScreen shows a notice the first time. Click{" "}
                <b>More info</b>, then <b>Run anyway</b>. Only download Orbis from this page or from the{" "}
                <a href={orbisReleasesUrl} target="_blank" rel="noopener">GitHub releases</a> it links to.
              </p>
            </details>
            <details className="ob-glass">
              <summary>Which models can I use?<OrbisIcon name="chevron" /></summary>
              <p>
                Kimi K3, DeepSeek V4 Pro, Kimi K2.6, DeepSeek V4 Flash and Nemotron 3 Ultra, all through NVIDIA’s API. Auto,
                Fast, Advanced and Reasoning modes pick one for you; Customize lets you choose directly.
              </p>
            </details>
            <details className="ob-glass">
              <summary>Is there a Mac or Linux version?<OrbisIcon name="chevron" /></summary>
              <p>Not yet — Orbis ships for Windows first. It’s built with Electron, so other platforms are possible later.</p>
            </details>
            <details className="ob-glass">
              <summary>What about voice, images and web search?<OrbisIcon name="chevron" /></summary>
              <p>
                The buttons are on the HUD, but those features aren’t built yet: they show a “coming soon” notice. Text and
                code file attachments work today.
              </p>
            </details>
            <details className="ob-glass">
              <summary>I found a bug. Where do I report it?<OrbisIcon name="chevron" /></summary>
              <p>
                Write to <a href={`mailto:${company.email}`}>{company.email}</a>. Include what you typed, what you expected, and
                what the activity panel logged.
              </p>
            </details>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta -- */}
      <section className="ob-section ob-cta-section">
        <div className="ob-container">
          <Reveal className="ob-cta ob-glass">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="ob-cta-mark"><img src="/orbis/orbis-mark.png" alt="" width={256} height={228} /></span>
            <h2 className="ob-section-title">Ready for liftoff?</h2>
            <p className="ob-section-sub">Download Orbis for Windows. Free, no account — just your NVIDIA key.</p>
            <div className="ob-hero-cta">
              <OrbisDownload />
              <OrbisReleaseNotes />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

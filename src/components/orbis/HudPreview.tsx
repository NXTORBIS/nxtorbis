"use client";

import { useEffect, useRef } from "react";
import { OrbisIcon } from "./Icons";
import { particleField } from "./Particles";

/**
 * A live recreation of the Orbis window: a scripted, looping exchange that
 * shows the app's real behaviour — a rate-limited model handing over to the
 * next one in the fallback chain.
 *
 * The frame is laid out at the real window's fixed size, then scaled to fit,
 * so it reads like a screenshot at any width. Particles and the script only
 * run while the frame is on screen; under reduced motion it shows the
 * finished exchange with nothing moving.
 */

const PHRASES = ["what are we working on?", "need help with something?", "what would you like to accomplish?", "shall we get started?", "what’s on your mind?"];
const PROMPT = "Kimi K3 is rate-limited right now. What happens to my message?";
const THINK_MS = 3400;
type Block = { type: "p"; text: string } | { type: "ul"; items: { b: string; t: string }[] };
const REPLY: Block[] = [
  { type: "p", text: "Nothing is lost. When Kimi K3 is rate-limited, Orbis keeps the conversation moving:" },
  {
    type: "ul",
    items: [
      { b: "Fallback.", t: " Your message goes to the next model in the chain — here, DeepSeek V4 Pro — and the switch is logged in the activity panel." },
      { b: "Waiting.", t: " If every model is busy, Orbis waits for the per-minute window to reset and retries on its own." },
      { b: "Transparency.", t: " Each reply is tagged with the model that actually answered." },
    ],
  },
  { type: "p", text: "Want me to switch to Fast mode for quicker replies in the meantime?" },
];

const MARK = "/orbis/orbis-mark.png";
const icon = (name: string, cls = "") => `<svg class="ob-icon ${cls}" aria-hidden="true"><use href="#ob-i-${name}"/></svg>`;
const ORB = `<div class="ob-orb" aria-hidden="true"><svg viewBox="0 0 40 40">
  <circle class="ob-orb-shell" cx="20" cy="20" r="18.5"/><circle class="ob-orb-shell ob-inner" cx="20" cy="20" r="13.5"/>
  <g class="ob-orb-net"><path d="M12 15 L20 10.5 L28 16 L26.5 25 L18 29.5 L11.5 23.5 Z M20 10.5 L20 20 L28 16 M11.5 23.5 L20 20 L26.5 25 M18 29.5 L20 20 M12 15 L20 20"/>
  <circle cx="12" cy="15" r="1.3"/><circle cx="20" cy="10.5" r="1.3"/><circle cx="28" cy="16" r="1.3"/><circle cx="26.5" cy="25" r="1.3"/><circle cx="18" cy="29.5" r="1.3"/><circle cx="11.5" cy="23.5" r="1.3"/></g>
  <circle class="ob-orb-core" cx="20" cy="20" r="2.6"/></svg></div>`;

export function HudPreview() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const hud = hudRef.current;
    if (!viewport || !hud) return;
    const $ = <T extends Element>(sel: string) => hud.querySelector(sel) as T;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;
    const timers = new Set<number>();
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          resolve();
        }, ms);
        timers.add(t);
      });

    /* ------------------------------------------------------------ fit -- */
    const fit = () => {
      const compact = viewport.clientWidth < 680;
      hud.classList.toggle("ob-compact", compact);
      const W = compact ? 720 : 1080;
      const H = compact ? 620 : 660;
      hud.style.width = `${W}px`;
      hud.style.height = `${H}px`;
      const scale = Math.min(1, viewport.clientWidth / W);
      hud.style.transform = `scale(${scale})`;
      viewport.style.height = `${Math.round(H * scale)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(viewport);

    /* ------------------------------------------------- clock and CPU -- */
    const fmtTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeEl = $<HTMLElement>("[data-hud-time]");
    const dateEl = $<HTMLElement>("[data-hud-date]");
    const cpuEl = $<HTMLElement>("[data-hud-cpu]");
    const tickClock = () => {
      const now = new Date();
      timeEl.textContent = fmtTime(now);
      dateEl.textContent = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };
    tickClock();
    let cpu = 9;
    const tickCpu = () => {
      cpu = Math.max(3, Math.min(28, cpu + Math.round((Math.random() - 0.5) * 8)));
      cpuEl.textContent = `${cpu}%`;
    };
    tickCpu();
    const clockTimer = window.setInterval(tickClock, 10000);
    const cpuTimer = window.setInterval(tickCpu, 2000);

    /* ---------------------------------------------------- visibility -- */
    const particles = particleField($<HTMLCanvasElement>("[data-hud-particles]"));
    let visible = false;
    const waiters: Array<() => void> = [];
    const whenVisible = () => (visible ? Promise.resolve() : new Promise<void>((r) => waiters.push(r)));
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (!reduced) particles.start();
          waiters.splice(0).forEach((r) => r());
        } else {
          particles.stop();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(viewport);

    /* ------------------------------------------------------ elements -- */
    const empty = $<HTMLElement>("[data-hud-empty]");
    const messages = $<HTMLElement>("[data-hud-messages]");
    const inner = $<HTMLElement>("[data-hud-inner]");
    const greeting = $<HTMLElement>("[data-hud-greeting]");
    const typed = $<HTMLElement>("[data-hud-typed]");
    const input = $<HTMLElement>("[data-hud-input]");
    const send = $<HTMLElement>("[data-hud-send]");
    const status = $<HTMLElement>("[data-hud-status]");
    const title = $<HTMLElement>("[data-hud-title]");

    const el = (html: string) => {
      const t = document.createElement("template");
      t.innerHTML = html.trim();
      return t.content.firstElementChild as HTMLElement;
    };
    const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
    const setStatus = (thinking: boolean) => {
      status.classList.toggle("ob-thinking", thinking);
      (status.lastElementChild as HTMLElement).textContent = thinking ? "THINKING" : "IDLE";
    };
    const scrollToEnd = () => (messages.scrollTop = messages.scrollHeight);

    const dateDivider = () => el(`<div class="ob-date-divider"><span>${fmtDate(new Date())}</span></div>`);
    const userMessage = (text: string, time: string) =>
      el(`<div class="ob-msg ob-user"><div class="ob-msg-body"><div class="ob-msg-meta"><time>${time}</time><span class="ob-msg-name">Commander</span></div>
        <div class="ob-user-bubble">${escapeHtml(text)}</div></div><span class="ob-avatar ob-user-avatar">C</span></div>`);
    const pendingMessage = () =>
      el(`<div class="ob-msg ob-assistant ob-pending">${ORB}<div class="ob-msg-body"><span class="ob-thinking-text"><span class="ob-think-word"></span><span class="ob-block-caret"></span></span></div></div>`);
    const assistantMessage = (time: string) =>
      el(`<div class="ob-msg ob-assistant"><span class="ob-avatar ob-assistant-avatar"><img src="${MARK}" alt="" width="22" height="22"></span><div class="ob-msg-body">
        <div class="ob-msg-meta"><span class="ob-msg-name">Orbis</span>${icon("sparkles", "ob-meta-icon")}<time>${time}</time></div>
        <div class="ob-msg-card ob-glass">
          <div class="ob-reasoning"><span class="ob-reasoning-toggle"><span class="ob-reasoning-label">Reasoning</span> ${icon("chevron")}</span></div>
          <div class="ob-stream-status">Kimi K3 was busy, so DeepSeek V4 Pro is answering.</div>
          <div class="ob-markdown"></div><span class="ob-stream-caret"></span>
        </div>
        <div class="ob-msg-actions" hidden>
          <span class="ob-icon-btn ob-small">${icon("copy")}</span><span class="ob-icon-btn ob-small">${icon("thumb-up")}</span><span class="ob-icon-btn ob-small">${icon("thumb-down")}</span>
          <span class="ob-icon-btn ob-small">${icon("refresh")}</span><span class="ob-icon-btn ob-small">${icon("upload")}</span><span class="ob-icon-btn ob-small">${icon("ellipsis")}</span>
          <span class="ob-model-tag">DeepSeek V4 Pro</span>
        </div></div></div>`);

    const renderBlocks = (container: HTMLElement) => {
      for (const block of REPLY) {
        if (block.type === "p") {
          const p = document.createElement("p");
          p.textContent = block.text;
          container.appendChild(p);
        } else {
          const ul = document.createElement("ul");
          for (const item of block.items) {
            const li = document.createElement("li");
            const b = document.createElement("b");
            b.textContent = item.b;
            li.append(b, item.t);
            ul.appendChild(li);
          }
          container.appendChild(ul);
        }
      }
    };

    const finishReply = (reply: HTMLElement) => {
      reply.querySelector(".ob-stream-caret")?.remove();
      reply.querySelector(".ob-reasoning-label")!.textContent = `Thought for ${Math.round(THINK_MS / 1000)}s`;
      (reply.querySelector(".ob-msg-actions") as HTMLElement).hidden = false;
    };

    const showConversation = () => {
      empty.hidden = true;
      messages.hidden = false;
      title.textContent = PROMPT.length > 42 ? `${PROMPT.slice(0, 42).trimEnd()}…` : PROMPT;
    };

    const reset = () => {
      inner.innerHTML = "";
      inner.classList.remove("ob-fade");
      messages.hidden = true;
      empty.hidden = false;
      title.textContent = "New chat";
      input.textContent = "";
      setStatus(false);
    };

    /* --------------------------------------------------- the script -- */
    const startGreeting = () => {
      let phrase = 0;
      let length = 0;
      let deleting = false;
      let running = true;
      let timer = 0;
      let glitchTimer = 0;
      const burst = (ms: number) => {
        greeting.classList.add("ob-glitching");
        clearTimeout(glitchTimer);
        glitchTimer = window.setTimeout(() => greeting.classList.remove("ob-glitching"), ms);
      };
      const tick = () => {
        if (!running || !alive) return;
        const target = PHRASES[phrase];
        if (!deleting) {
          length += 1;
          typed.textContent = target.slice(0, length);
          if (length === 1) burst(420);
          if (length >= target.length) {
            deleting = true;
            timer = window.setTimeout(tick, 2400);
            return;
          }
          timer = window.setTimeout(tick, 40 + Math.random() * 45);
        } else {
          length -= 1;
          typed.textContent = target.slice(0, length);
          if (length === target.length - 1) burst(300);
          if (length <= 0) {
            deleting = false;
            phrase = (phrase + 1) % PHRASES.length;
            timer = window.setTimeout(tick, 400);
            return;
          }
          timer = window.setTimeout(tick, 20);
        }
      };
      timer = window.setTimeout(tick, 450);
      return () => {
        running = false;
        clearTimeout(timer);
        clearTimeout(glitchTimer);
        greeting.classList.remove("ob-glitching");
      };
    };

    const typeInto = async (text: string) => {
      input.classList.add("ob-typing");
      for (let i = 1; i <= text.length && alive; i++) {
        input.textContent = text.slice(0, i);
        await sleep(26 + Math.random() * 38);
      }
      await sleep(380);
      input.classList.remove("ob-typing");
    };

    const think = async (pending: HTMLElement) => {
      const WORDS = ["Understanding", "Analyzing", "Reasoning", "Composing"];
      const word = pending.querySelector(".ob-think-word") as HTMLElement;
      const end = Date.now() + THINK_MS;
      for (let i = 0; Date.now() < end && alive; i++) {
        const w = `${WORDS[i % WORDS.length]}...`;
        for (let c = 1; c <= w.length && Date.now() < end && alive; c++) {
          word.textContent = w.slice(0, c);
          await sleep(55);
        }
        await sleep(900);
      }
    };

    const streamText = async (target: HTMLElement, text: string) => {
      const node = document.createTextNode("");
      target.appendChild(node);
      for (const word of text.split(/(?<=\s)/)) {
        if (!alive) return;
        node.data += word;
        scrollToEnd();
        await sleep(22 + Math.random() * 36);
      }
    };

    const streamBlocks = async (container: HTMLElement) => {
      for (const block of REPLY) {
        if (block.type === "p") {
          const p = document.createElement("p");
          container.appendChild(p);
          await streamText(p, block.text);
        } else {
          const ul = document.createElement("ul");
          container.appendChild(ul);
          for (const item of block.items) {
            const li = document.createElement("li");
            ul.appendChild(li);
            const b = document.createElement("b");
            li.appendChild(b);
            await streamText(b, item.b);
            await streamText(li, item.t);
          }
        }
      }
    };

    const runDemo = async () => {
      while (alive) {
        await whenVisible();
        if (!alive) return;
        reset();
        const stopGreeting = startGreeting();
        await sleep(6800);
        stopGreeting();
        if (!alive) return;

        await typeInto(PROMPT);
        send.classList.add("ob-pressed");
        await sleep(160);
        send.classList.remove("ob-pressed");
        input.textContent = "";

        showConversation();
        inner.append(dateDivider(), userMessage(PROMPT, fmtTime(new Date())));
        setStatus(true);

        const pending = pendingMessage();
        inner.appendChild(pending);
        scrollToEnd();
        await think(pending);
        pending.remove();
        if (!alive) return;

        const reply = assistantMessage(fmtTime(new Date()));
        inner.appendChild(reply);
        scrollToEnd();
        await streamBlocks(reply.querySelector(".ob-markdown") as HTMLElement);
        finishReply(reply);
        setStatus(false);
        scrollToEnd();

        await sleep(6500);
        inner.classList.add("ob-fade");
        await sleep(500);
      }
    };

    if (reduced) {
      showConversation();
      const time = fmtTime(new Date());
      const reply = assistantMessage(time);
      renderBlocks(reply.querySelector(".ob-markdown") as HTMLElement);
      finishReply(reply);
      inner.append(dateDivider(), userMessage(PROMPT, time), reply);
    } else {
      runDemo();
    }

    return () => {
      alive = false;
      waiters.splice(0).forEach((r) => r());
      timers.forEach((t) => clearTimeout(t));
      clearInterval(clockTimer);
      clearInterval(cpuTimer);
      io.disconnect();
      ro.disconnect();
      particles.dispose();
    };
  }, []);

  return (
    <>
      <div className="ob-hud-viewport" ref={viewportRef}>
        <div
          className="ob-hud"
          ref={hudRef}
          role="img"
          aria-label="Preview of the Orbis app: a chat interface styled as a heads-up display, answering a question about model fallback."
        >
          <div className="ob-hud-bg">
            <div className="ob-hud-grid" />
            <canvas className="ob-hud-particles" data-hud-particles />
          </div>

          <div className="ob-sys-bar">
            <div className="ob-sys-group">
              <span className="ob-sys-btn"><OrbisIcon name="panel" /></span>
              <span className="ob-core"><OrbisIcon name="cpu" />CORE: <b data-hud-cpu>--</b></span>
              <span className="ob-sys-btn"><OrbisIcon name="plus" /></span>
            </div>
            <div className="ob-sys-group">
              <span className="ob-sys-btn"><OrbisIcon name="search" /></span>
              <span className="ob-sys-btn"><OrbisIcon name="hash" /></span>
              <span className="ob-sys-btn"><OrbisIcon name="globe" /></span>
              <span className="ob-sys-btn ob-framed"><OrbisIcon name="mic" /></span>
              <span className="ob-sys-btn"><OrbisIcon name="bell" /><i className="ob-badge">1</i></span>
              <span className="ob-sys-btn"><OrbisIcon name="sun" /></span>
              <span className="ob-clock" data-hud-time>--:--</span>
              <span className="ob-clock ob-hud-date" data-hud-date />
              <span className="ob-caption-btns">
                <span className="ob-cap"><OrbisIcon name="min" /></span>
                <span className="ob-cap"><OrbisIcon name="max" /></span>
                <span className="ob-cap"><OrbisIcon name="close" /></span>
              </span>
            </div>
          </div>

          <div className="ob-hud-body">
            <div className="ob-rail">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <span className="ob-rail-logo"><img src={MARK} alt="" width={32} height={32} /></span>
              <span className="ob-rail-btn"><OrbisIcon name="pen" /></span>
              <span className="ob-rail-btn"><OrbisIcon name="search" /></span>
              <span className="ob-rail-btn"><OrbisIcon name="users" /></span>
              <div className="ob-rail-recent">
                <span className="ob-rail-chat ob-active">K<i /></span>
                <span className="ob-rail-chat">P<i /></span>
                <span className="ob-rail-chat">D<i /></span>
              </div>
              <span className="ob-rail-spacer" />
              <span className="ob-rail-btn"><OrbisIcon name="settings" /></span>
              <span className="ob-rail-btn"><OrbisIcon name="help" /></span>
            </div>

            <div className="ob-stage">
              <div className="ob-chat-header">
                <div className="ob-header-side">
                  <span className="ob-persona-pill"><OrbisIcon name="orbit" />General AI<OrbisIcon name="chevron" /></span>
                  <span className="ob-status" data-hud-status><i /><span>IDLE</span></span>
                </div>
                <div className="ob-header-title" data-hud-title>New chat</div>
                <div className="ob-header-side ob-right">
                  <span className="ob-icon-btn"><OrbisIcon name="users" /></span>
                  <span className="ob-icon-btn"><OrbisIcon name="pen" /></span>
                  <span className="ob-share-btn"><OrbisIcon name="share" />Share</span>
                  <span className="ob-icon-btn"><OrbisIcon name="ellipsis" /></span>
                  <span className="ob-avatar ob-user-avatar">C</span>
                </div>
              </div>

              <div className="ob-stage-content">
                <div className="ob-empty-state" data-hud-empty>
                  <div className="ob-greeting" data-hud-greeting>
                    <span className="ob-greeting-prefix">Hi Commander,</span> <span data-hud-typed />
                    <span className="ob-greeting-caret" />
                  </div>
                </div>
                <div className="ob-messages" data-hud-messages hidden>
                  <div className="ob-messages-inner" data-hud-inner />
                </div>
              </div>

              <div className="ob-composer-dock">
                <div className="ob-composer">
                  <div className="ob-composer-tools">
                    <span className="ob-tool-btn"><OrbisIcon name="files" /></span>
                    <span className="ob-tool-btn"><OrbisIcon name="upload" /></span>
                    <span className="ob-tool-btn"><OrbisIcon name="penline" /></span>
                  </div>
                  <div className="ob-composer-input" data-hud-input data-placeholder="Ask anything" />
                  <div className="ob-composer-tools">
                    <span className="ob-tool-btn ob-mode-btn"><OrbisIcon name="sparkles" /></span>
                    <span className="ob-tool-btn"><OrbisIcon name="mic" /></span>
                    <span className="ob-send-btn" data-hud-send><OrbisIcon name="send" /></span>
                  </div>
                </div>
                <p className="ob-disclaimer">AI can make mistakes. Check important info.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="ob-hud-caption">A live recreation of the Orbis interface, running right here in your browser.</p>
    </>
  );
}

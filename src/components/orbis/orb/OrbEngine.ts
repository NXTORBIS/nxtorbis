/**
 * The Orb — Orbis's visual identity, rendered with raw WebGL (no library).
 *
 * One engine, many states. Every section of the page asks the same Orb to
 * become something slightly different — a network, a workspace, a waveform, a
 * download core — and the engine eases between them rather than swapping
 * implementations.
 *
 * Four passes, all additive-premultiplied onto a transparent canvas:
 *   glow    cheap radial light around the object (and the first point of light)
 *   sphere  translucent shell, fresnel rim, raymarched inner energy, surface ripple
 *   lines   orbital rings, network edges, workspace panels, waveform, progress, ripple ring
 *   points  circulating particles, network nodes, file and tool objects
 *
 * All motion is computed on the GPU from per-vertex seeds and a handful of
 * uniforms, so a frame costs a few uniform uploads and four draw calls — no
 * buffer rewrites and no React renders.
 *
 * The canvas is sized once for the largest slot and moved/scaled with a CSS
 * transform, so following the page as it scrolls costs nothing on the GPU.
 * Layout values are viewport coordinates (they drive pointer response); the
 * transform converts them into the stage layer's coordinates using the
 * current scroll position, so the Orb tracks the screen, not the document.
 */

export type OrbStateName =
  | "idle" | "hero" | "interactive" | "network" | "ai" | "workspace" | "memory" | "files"
  | "tools" | "learning" | "voice" | "cinematic" | "download" | "loading" | "success" | "error" | "final";

export type OrbDownloadPhase = "idle" | "contract" | "ring" | "expand" | "error";
export type OrbQuality = "high" | "medium" | "low";

type Mix = {
  activity: number; energy: number; glow: number; core: number; rings: number;
  network: number; panels: number; files: number; tools: number; learning: number;
  voice: number; dim: number; pulse: number;
};

const BASE: Mix = {
  activity: 0.45, energy: 0.8, glow: 0.8, core: 0.5, rings: 1,
  network: 0, panels: 0, files: 0, tools: 0, learning: 0, voice: 0, dim: 0, pulse: 0,
};
const mix = (m: Partial<Mix>): Mix => ({ ...BASE, ...m });

export const ORB_STATES: Record<OrbStateName, Mix> = {
  idle: mix({}),
  hero: mix({ activity: 0.55, glow: 1, core: 0.6 }),
  interactive: mix({ activity: 0.7, core: 0.7 }),
  network: mix({ activity: 0.6, network: 1, rings: 0.55 }),
  ai: mix({ activity: 1, energy: 1, core: 0.95, network: 0.35, rings: 0.7 }),
  workspace: mix({ activity: 0.5, panels: 1, rings: 0.35 }),
  memory: mix({ activity: 0.55, network: 1, rings: 0.3 }),
  files: mix({ activity: 0.5, files: 1, rings: 0.3 }),
  tools: mix({ activity: 0.55, tools: 1, rings: 0.45 }),
  learning: mix({ activity: 0.6, learning: 1, network: 0.4, rings: 0.3 }),
  voice: mix({ activity: 0.65, voice: 1, rings: 0.2, core: 0.7 }),
  cinematic: mix({ activity: 0.5, glow: 1.2, core: 0.65 }),
  download: mix({ activity: 0.5, rings: 0.7 }),
  loading: mix({ activity: 0.4, pulse: 1, rings: 0.5 }),
  success: mix({ activity: 0.8, glow: 1.15, core: 0.9 }),
  error: mix({ activity: 0.2, energy: 0.45, glow: 0.45, dim: 1, rings: 0.3 }),
  final: mix({ activity: 0.5, glow: 1.15, core: 0.65 }),
};

/** How long the first-load formation takes. Page copy is timed against this. */
export const ORB_INTRO_MS = 1700;

/** Canvas half-extent in Orb units (radius 1). Leaves room for rings, ripple and gathering particles. */
const EXTENT = 2.0;
const NODES = 64;
const FILES = 14;
const TOOLS = 12;
const INNER = 900;
const SPECIAL = NODES + FILES + TOOLS;

const QUALITY = {
  high: { steps: 5, points: 1, dpr: 2, cap: 1600 },
  medium: { steps: 4, points: 0.6, dpr: 1.5, cap: 1200 },
  low: { steps: 2, points: 0.3, dpr: 1, cap: 760 },
} as const;

/* ------------------------------------------------------------- shaders -- */

const QUAD_VS = `
attribute vec2 a_pos;
uniform float u_extent;
varying vec2 v_uv;
void main() {
  v_uv = a_pos;
  gl_Position = vec4(a_pos / u_extent, 0.0, 1.0);
}`;

const GLOW_FS = `
precision mediump float;
varying vec2 v_uv;
uniform float u_glow, u_dim, u_pulse, u_intro, u_near, u_scaleAll, u_time;
void main() {
  float rr = length(v_uv);
  float r = rr / max(u_scaleAll, 0.25);
  float g = exp(-max(r - 0.85, 0.0) * 2.6) * smoothstep(2.0, 0.95, rr);
  float level = (0.15 * u_glow + 0.06 * u_near + 0.07 * u_pulse * (0.5 + 0.5 * sin(u_time * 2.0))) * smoothstep(0.35, 0.9, u_intro);
  vec3 col = vec3(0.86, 0.80, 0.70) * g * level;
  // Stage 02: a single point of light before anything else exists.
  float pt = exp(-dot(v_uv, v_uv) * 900.0) * smoothstep(0.0, 0.1, u_intro) * (1.0 - smoothstep(0.45, 0.75, u_intro));
  col += vec3(1.0, 0.96, 0.9) * pt * 1.4;
  col *= 1.0 - 0.6 * u_dim;
  float a = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}`;

const SPHERE_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v_uv;
uniform mat3 u_rot;
uniform vec2 u_light;
uniform float u_time, u_energy, u_activity, u_core, u_dim, u_intro, u_scaleAll, u_rippleT, u_rippleOn, u_near, u_pulse, u_steps;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
                 mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
                 mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  float R = u_scaleAll * smoothstep(0.32, 0.82, u_intro);
  if (R < 0.002) discard;
  vec2 p = v_uv / R;
  float r2 = dot(p, p);

  if (r2 > 1.0) {
    // A hairline of light just outside the shell, for a clean edge.
    float edge = smoothstep(1.035, 1.0, sqrt(r2));
    if (edge <= 0.0) discard;
    vec3 c = vec3(0.9, 0.86, 0.8) * edge * 0.22 * (1.0 - 0.5 * u_dim);
    gl_FragColor = vec4(c, edge * 0.22);
    return;
  }

  float z = sqrt(1.0 - r2);
  vec3 n = vec3(p, z);
  float fres = pow(1.0 - z, 2.6);

  // Inner energy: a short march through the sphere along the view ray.
  vec3 acc = vec3(0.0);
  float transmit = 1.0;
  float tint = 0.0;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= u_steps) break;
    float t = (float(i) + 0.5) / u_steps;
    vec3 q = vec3(p, mix(z, -z, t));
    vec3 qr = u_rot * q;
    float rad = length(q);
    float d = fbm(qr * 2.2 + vec3(0.0, u_time * 0.07, u_time * 0.05));
    float filaments = pow(abs(sin(d * 6.0 + u_time * 0.25)), 8.0);
    float dens = (smoothstep(0.38, 0.95, d) * 0.6 + filaments * 0.55) * (1.0 - rad * rad);
    dens *= u_energy * (0.5 + 0.5 * u_activity + 0.3 * u_near);
    tint = smoothstep(-0.4, 0.7, qr.y + u_light.y * 0.4);
    vec3 col = mix(vec3(0.76, 0.82, 0.94), vec3(1.0, 0.82, 0.55), tint * 0.7);
    acc += col * dens * transmit * (1.6 / u_steps);
    transmit *= 1.0 - dens * 0.12;
  }
  acc *= smoothstep(0.5, 0.9, u_intro);

  // Core.
  float core = exp(-r2 * 9.0) * (0.35 + 0.65 * u_core) * (0.85 + 0.15 * sin(u_time * 1.3)) * smoothstep(0.45, 0.85, u_intro);
  acc += vec3(1.0, 0.93, 0.82) * core;

  // Shell: fresnel rim, a soft specular highlight, and a warm lower rim.
  vec3 L = normalize(vec3(u_light, 0.9));
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 38.0);
  vec3 shell = vec3(0.86, 0.88, 0.92) * fres * 0.55 + vec3(1.0, 0.95, 0.88) * spec * (0.55 + 0.35 * u_near);
  shell += vec3(0.93, 0.72, 0.42) * pow(1.0 - z, 6.0) * 0.32;

  // Click ripple travelling across the surface.
  float rip = u_rippleOn * exp(-pow((sqrt(r2) - u_rippleT * 1.1) * 9.0, 2.0)) * (1.0 - u_rippleT);

  vec3 col = acc + shell + vec3(0.95, 0.9, 0.8) * rip * 0.6;
  col *= 1.0 + u_near * 0.22 + u_pulse * 0.15;
  float grey = dot(col, vec3(0.333));
  col = mix(col, vec3(grey), u_dim * 0.6) * (1.0 - u_dim * 0.35);

  float glass = 0.1 + fres * 0.35;
  float a = clamp(max(max(col.r, col.g), col.b) + glass, 0.0, 1.0);
  gl_FragColor = vec4(col + vec3(0.02, 0.02, 0.025) * glass, a);
}`;

const POINTS_VS = `
attribute vec4 a_seed;
attribute float a_kind;
uniform mat3 u_rot;
uniform float u_extent, u_time, u_intro, u_scaleAll, u_burst, u_activity, u_files, u_tools, u_network, u_learning, u_px, u_dim, u_near;
uniform vec2 u_bias;
varying float v_a;
varying float v_kind;
const float TAU = 6.2831853;
void main() {
  vec3 pos;
  float size;
  float a;
  if (a_kind < 0.5) {
    float rad = 0.18 + 0.74 * sqrt(a_seed.x);
    float speed = (0.04 + a_seed.y * 0.1) * (0.55 + 0.9 * u_activity + 0.5 * u_near);
    float ang = a_seed.z * TAU + u_time * speed;
    float tilt = (a_seed.w - 0.5) * 2.6;
    vec3 o = vec3(cos(ang) * rad, sin(ang) * rad * cos(tilt), sin(ang) * rad * sin(tilt));
    o.y += u_bias.y * 0.08 * rad;
    o.x += sin(u_time * 0.21 + a_seed.x * 31.0) * 0.02;
    vec3 dir = normalize(vec3(a_seed.z, a_seed.w, a_seed.x) - 0.5 + 0.0001);
    vec3 far = dir * (1.55 + a_seed.y * 0.4);
    float g = smoothstep(0.1 + a_seed.y * 0.3, 0.45 + a_seed.y * 0.3, u_intro);
    pos = mix(far, o, g) * u_scaleAll;
    pos *= 1.0 + u_burst * (0.45 + a_seed.w * 0.8);
    size = 1.1 + a_seed.x * 1.8;
    a = (0.3 + 0.7 * a_seed.y) * smoothstep(0.08, 0.3, u_intro);
  } else if (a_kind < 1.5) {
    float ang = a_seed.z * TAU + u_time * (0.035 + a_seed.y * 0.04);
    float rad = 1.2 + a_seed.x * 0.3;
    pos = vec3(cos(ang) * rad, (a_seed.w - 0.5) * 1.0, sin(ang) * rad);
    size = 9.0 + a_seed.x * 5.0;
    a = u_files * 0.8;
  } else if (a_kind < 2.5) {
    float ang = a_seed.z * TAU + u_time * (0.08 + a_seed.y * 0.06);
    float rad = 1.3 + a_seed.x * 0.25;
    float tilt = (a_seed.w - 0.5) * 1.4;
    pos = vec3(cos(ang) * rad, sin(ang) * rad * sin(tilt), sin(ang) * rad * cos(tilt));
    size = 9.0 + a_seed.x * 4.0;
    a = u_tools * 0.85;
  } else {
    pos = normalize(a_seed.xyz * 2.0 - 1.0) * 1.03 * u_scaleAll;
    size = 2.4 + a_seed.w * 2.0;
    a = max(u_network, u_learning * 0.8) * (0.55 + 0.45 * sin(u_time * 0.9 + a_seed.w * 40.0)) * smoothstep(0.7, 1.0, u_intro);
  }
  vec3 r = u_rot * pos;
  float persp = 3.0 / (3.0 - r.z);
  float depth = smoothstep(-1.6, 1.6, r.z);
  gl_Position = vec4(r.xy * persp / u_extent, 0.0, 1.0);
  gl_PointSize = max(1.0, size * u_px * persp);
  v_a = a * (0.3 + 0.7 * depth) * (1.0 - 0.5 * u_dim);
  v_kind = a_kind;
}`;

const POINTS_FS = `
precision mediump float;
varying float v_a;
varying float v_kind;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float m;
  vec3 col = vec3(0.88, 0.9, 0.96);
  if (v_kind < 0.5 || v_kind > 2.5) {
    float d = dot(c, c);
    if (d > 1.0) discard;
    m = exp(-d * 3.0);
  } else if (v_kind < 1.5) {
    // A document silhouette: outline and two lines of "text".
    vec2 q = abs(c) - vec2(0.5, 0.72);
    float box = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    m = smoothstep(0.14, 0.0, abs(box));
    float lines = step(abs(c.x), 0.3) * (smoothstep(0.08, 0.0, abs(c.y + 0.2)) + smoothstep(0.08, 0.0, abs(c.y - 0.15))) * 0.6;
    m = max(m, lines);
    col = vec3(0.95, 0.88, 0.75);
  } else {
    float dd = abs(c.x) + abs(c.y) - 0.72;
    m = smoothstep(0.14, 0.0, abs(dd));
    col = vec3(0.95, 0.85, 0.66);
  }
  float a = m * v_a;
  gl_FragColor = vec4(col * a, a);
}`;

const LINES_VS = `
attribute vec3 a_p;
attribute vec3 a_m;
uniform mat3 u_rot;
uniform mat3 u_ringM[3];
uniform float u_extent, u_time, u_intro, u_rings, u_network, u_learning, u_voice, u_progress, u_ripple, u_rippleOn, u_panels, u_dim, u_scaleAll;
varying float v_a;
varying vec3 v_col;
const float TAU = 6.2831853;

vec2 project(vec3 p, out float depth) {
  vec3 r = u_rot * p;
  float persp = 3.0 / (3.0 - r.z);
  depth = smoothstep(-1.6, 1.6, r.z);
  return r.xy * persp;
}

void main() {
  float k = a_m.x;
  vec2 xy = vec2(0.0);
  float a = 0.0;
  float depth = 0.5;
  vec3 col = vec3(0.86, 0.88, 0.93);

  if (k < 0.5) {
    // Orbital rings: thin, tilted, slightly irregular.
    float fi = a_m.y;
    int i = int(fi + 0.5);
    float th = a_m.z * TAU;
    float rx = 1.40 + fi * 0.14;
    float ry = rx * (0.30 + fi * 0.09);
    float wob = 1.0 + 0.02 * sin(th * 3.0 + u_time * (0.15 + fi * 0.05) + fi * 2.1);
    vec3 c = vec3(cos(th) * rx * wob, sin(th) * ry * wob, 0.0);
    mat3 m = u_ringM[0];
    if (i == 1) m = u_ringM[1];
    if (i == 2) m = u_ringM[2];
    xy = project(m * c, depth);
    a = u_rings * (0.2 - fi * 0.035) * smoothstep(0.62, 0.95, u_intro) * (0.35 + 0.65 * depth);
    col = mix(vec3(0.86, 0.88, 0.93), vec3(0.93, 0.76, 0.5), 0.25 + fi * 0.1);
  } else if (k < 1.5) {
    // Network edges on the surface; learning sends light along them.
    xy = project(a_p * 1.03 * u_scaleAll, depth);
    float travel = smoothstep(0.86, 1.0, fract(a_m.y * 7.0 - u_time * 0.12 + a_m.z * 0.15));
    a = (u_network * 0.2 + u_learning * (0.08 + 0.55 * travel)) * (0.25 + 0.75 * depth) * smoothstep(0.7, 1.0, u_intro);
    col = mix(col, vec3(1.0, 0.84, 0.58), u_learning * travel);
  } else if (k < 2.5) {
    // Voice: a soft waveform around the Orb, driven by ambient motion only.
    float th = a_m.y * TAU;
    float w = sin(th * 7.0 + u_time * 1.4) * 0.6 + sin(th * 12.0 - u_time * 2.2) * 0.4;
    float env = 0.55 + 0.45 * sin(u_time * 0.6 + th * 2.0);
    xy = vec2(cos(th), sin(th)) * (1.3 + u_voice * 0.06 * w * env) * u_scaleAll;
    a = u_voice * 0.5;
    col = vec3(0.95, 0.9, 0.82);
  } else if (k < 3.5) {
    // Download ring around the contracted core. Indeterminate: no real progress is known.
    float th = a_m.y;
    float start = fract(u_time * 0.32);
    float len = 0.2 + 0.1 * sin(u_time * 1.1);
    float d = fract(th - start);
    float inArc = step(d, len) * smoothstep(0.0, 0.03, d) * smoothstep(len, len - 0.03, d);
    xy = vec2(sin(th * TAU), cos(th * TAU)) * 0.52;
    a = u_progress * (0.12 + 0.78 * inArc);
    col = vec3(1.0, 0.9, 0.72);
  } else if (k < 4.5) {
    // Click ripple: one thin ring expanding outwards.
    float th = a_m.y * TAU;
    xy = vec2(cos(th), sin(th)) * (1.0 + u_ripple * 0.95) * u_scaleAll;
    a = u_rippleOn * (1.0 - u_ripple) * 0.65;
  } else {
    // Workspace: translucent interface fragments orbiting the Orb.
    float fi = a_m.y;
    float ang = fi * 1.2566 + u_time * 0.05;
    vec3 center = vec3(cos(ang) * 1.38, (fract(fi * 0.37) - 0.5) * 0.9, sin(ang) * 1.38);
    vec3 cr = u_rot * center;
    float persp = 3.0 / (3.0 - cr.z);
    depth = smoothstep(-1.6, 1.6, cr.z);
    xy = cr.xy * persp + a_p.xy * vec2(0.3, 0.19) * persp;
    a = u_panels * 0.42 * (0.2 + 0.8 * depth);
  }

  a *= 1.0 - 0.55 * u_dim;
  v_a = a;
  v_col = col;
  gl_Position = vec4(xy / u_extent, 0.0, 1.0);
}`;

const LINES_FS = `
precision mediump float;
varying float v_a;
varying vec3 v_col;
void main() {
  gl_FragColor = vec4(v_col * v_a, v_a);
}`;

/* --------------------------------------------------------------- maths -- */

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
function smooth(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Column-major 3x3 matrices, as WebGL expects. */
function mul3(a: Float32Array, b: Float32Array, out = new Float32Array(9)) {
  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 3; r++) {
      out[c * 3 + r] = a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2];
    }
  }
  return out;
}
const rotX = (t: number) => { const c = Math.cos(t), s = Math.sin(t); return new Float32Array([1, 0, 0, 0, c, s, 0, -s, c]); };
const rotY = (t: number) => { const c = Math.cos(t), s = Math.sin(t); return new Float32Array([c, 0, -s, 0, 1, 0, s, 0, c]); };
const rotZ = (t: number) => { const c = Math.cos(t), s = Math.sin(t); return new Float32Array([c, s, 0, -s, c, 0, 0, 0, 1]); };

/* ------------------------------------------------------------- webgl -- */

class Program {
  readonly p: WebGLProgram;
  private readonly uniforms = new Map<string, WebGLUniformLocation | null>();

  constructor(private readonly gl: WebGLRenderingContext, vs: string, fs: string) {
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) throw new Error("Orb: could not create a shader");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`Orb shader: ${gl.getShaderInfoLog(s)}`);
      return s;
    };
    const p = gl.createProgram();
    if (!p) throw new Error("Orb: could not create a program");
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`Orb program: ${gl.getProgramInfoLog(p)}`);
    this.p = p;
  }

  u(name: string) {
    if (!this.uniforms.has(name)) this.uniforms.set(name, this.gl.getUniformLocation(this.p, name));
    return this.uniforms.get(name) ?? null;
  }

  attrib(name: string) {
    return this.gl.getAttribLocation(this.p, name);
  }
}

/* ------------------------------------------------------------- engine -- */

export class OrbEngine {
  static isSupported(): boolean {
    try {
      const c = document.createElement("canvas");
      return !!c.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    } catch {
      return false;
    }
  }

  /** Called every frame with the Orb's current screen position, radius and opacity. */
  onLayout: ((x: number, y: number, r: number, opacity: number) => void) | null = null;
  /** Called if the GPU context is lost; the stage falls back to a static Orb. */
  onLost: (() => void) | null = null;

  private readonly gl: WebGLRenderingContext;
  private readonly pGlow: Program;
  private readonly pSphere: Program;
  private readonly pPoints: Program;
  private readonly pLines: Program;
  private readonly bGlow: WebGLBuffer;
  private readonly bSphere: WebGLBuffer;
  private readonly bPoints: WebGLBuffer;
  private readonly bLines: WebGLBuffer;
  private readonly lineCount: number;

  private quality: OrbQuality;
  private steps = 5;
  private pointFraction = 1;
  private running = false;
  private raf = 0;
  private last = 0;
  private clock = 20;
  private frameAcc = 0;
  private frameN = 0;
  private dirty = true;
  private lost = false;

  private cur: Mix = { ...BASE };
  private state: OrbStateName = "idle";
  private override: OrbStateName | null = null;
  private loading = false;

  private baseRadius = 0;
  private cssSide = 0;
  private pxPerCss = 1;
  private layoutInit = false;
  private lx = 0; private ly = 0; private lr = 1; private lo = 0;
  private tx = 0; private ty = 0; private tr = 1; private to = 0;
  private lastTransform = "";
  private lastOpacity = "";
  private originX = 0;
  private originY = 0;

  private pointerActive = false;
  private px = 0; private py = 0;
  private yawP = 0; private pitchP = 0; private biasY = 0; private near = 0;
  private lightX = -0.55; private lightY = 0.62;

  private intro = 1;
  private introStart = -1;
  private rippleStart = -1e9;
  private rippleT = 1;
  private rippleOn = 0;
  private burst = 0;
  private burstStart = -1e9;
  private phase: OrbDownloadPhase = "idle";
  private contract = 0;
  private progress = 0;

  private rot = new Float32Array(9);
  private ringM = new Float32Array(27);

  private readonly onVisibility = () => (document.hidden ? this.stop() : this.start());
  private readonly onContextLost = (e: Event) => {
    e.preventDefault();
    this.lost = true;
    this.stop();
    this.onLost?.();
  };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly opts: { reducedMotion: boolean; quality: OrbQuality },
  ) {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true, depth: false, stencil: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("Orb: WebGL unavailable");
    this.gl = gl;
    this.quality = opts.quality;
    this.applyQuality();

    this.pGlow = new Program(gl, QUAD_VS, GLOW_FS);
    this.pSphere = new Program(gl, QUAD_VS, SPHERE_FS);
    this.pPoints = new Program(gl, POINTS_VS, POINTS_FS);
    this.pLines = new Program(gl, LINES_VS, LINES_FS);

    const buffer = (data: Float32Array) => {
      const b = gl.createBuffer();
      if (!b) throw new Error("Orb: could not create a buffer");
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };
    this.bGlow = buffer(new Float32Array([-EXTENT, -EXTENT, EXTENT, -EXTENT, -EXTENT, EXTENT, EXTENT, EXTENT]));
    this.bSphere = buffer(new Float32Array([-1.08, -1.08, 1.08, -1.08, -1.08, 1.08, 1.08, 1.08]));

    const { points, lines } = OrbEngine.geometry();
    this.bPoints = buffer(points);
    this.bLines = buffer(lines);
    this.lineCount = lines.length / 6;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    canvas.addEventListener("webglcontextlost", this.onContextLost);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  /** Deterministic seeds and static line geometry, built once. */
  private static geometry() {
    const rand = mulberry32(20260913);

    // Points: [network nodes][files][tools][inner particles]. Inner last, so
    // lowering quality simply draws fewer of them.
    const points = new Float32Array((SPECIAL + INNER) * 5);
    const nodes: [number, number, number][] = [];
    let o = 0;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODES; i++) {
      const y = 1 - (i / (NODES - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const x = Math.cos(th) * rad, z = Math.sin(th) * rad;
      nodes.push([x, y, z]);
      points.set([x * 0.5 + 0.5, y * 0.5 + 0.5, z * 0.5 + 0.5, rand(), 3], o);
      o += 5;
    }
    for (let i = 0; i < FILES; i++) { points.set([rand(), rand(), i / FILES + rand() * 0.04, rand(), 1], o); o += 5; }
    for (let i = 0; i < TOOLS; i++) { points.set([rand(), rand(), i / TOOLS + rand() * 0.05, rand(), 2], o); o += 5; }
    for (let i = 0; i < INNER; i++) { points.set([rand(), rand(), rand(), rand(), 0], o); o += 5; }

    // Lines: pairs of vertices, each [a_p.xyz, a_m.xyz].
    const verts: number[] = [];
    const seg = (p1: number[], m1: number[], p2: number[], m2: number[]) => verts.push(...p1, ...m1, ...p2, ...m2);
    const loop = (kind: number, count: number, extra: number) => {
      for (let s = 0; s < count; s++) {
        const a = s / count, b = (s + 1) / count;
        if (kind === 0) seg([0, 0, 0], [0, extra, a], [0, 0, 0], [0, extra, b]);
        else seg([0, 0, 0], [kind, a, 0], [0, 0, 0], [kind, b, 0]);
      }
    };
    for (let ring = 0; ring < 3; ring++) loop(0, 120, ring);

    const seen = new Set<string>();
    nodes.forEach((n, i) => {
      const nearest = nodes
        .map((m, j) => ({ j, d: j === i ? -2 : n[0] * m[0] + n[1] * m[1] + n[2] * m[2] }))
        .sort((p, q) => q.d - p.d)
        .slice(0, 3);
      for (const { j } of nearest) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const phase = rand();
        seg(n, [1, phase, 0], nodes[j], [1, phase, 1]);
      }
    });

    loop(2, 180, 0);
    loop(3, 160, 0);
    loop(4, 120, 0);

    const panel: [number, number, number, number][] = [
      [-1, -1, 1, -1], [1, -1, 1, 1], [1, 1, -1, 1], [-1, 1, -1, -1],
      [-0.7, 0.35, 0.4, 0.35], [-0.7, -0.05, 0.1, -0.05],
    ];
    for (let i = 0; i < 5; i++) {
      for (const [x1, y1, x2, y2] of panel) seg([x1, y1, 0], [5, i, 0], [x2, y2, 0], [5, i, 0]);
    }

    return { points, lines: new Float32Array(verts) };
  }

  private applyQuality() {
    const q = QUALITY[this.quality];
    this.steps = q.steps;
    this.pointFraction = q.points;
  }

  /* ------------------------------------------------------------ API -- */

  /** Size the canvas for the largest radius the Orb will take on this layout. */
  setBaseRadius(radius: number) {
    const r = Math.max(60, Math.min(560, Math.round(radius)));
    if (this.baseRadius && Math.abs(r - this.baseRadius) < 2) return;
    this.baseRadius = r;
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const q = QUALITY[this.quality];
    const side = Math.ceil(this.baseRadius * 2 * EXTENT);
    const dpr = Math.min(window.devicePixelRatio || 1, q.dpr);
    const px = Math.min(q.cap, Math.round(side * dpr));
    this.cssSide = side;
    this.canvas.style.width = `${side}px`;
    this.canvas.style.height = `${side}px`;
    this.canvas.width = px;
    this.canvas.height = px;
    this.pxPerCss = px / side;
    this.lastTransform = "";
    this.dirty = true;
  }

  /** Document position of the stage layer's top-left corner. */
  setOrigin(x: number, y: number) {
    if (x === this.originX && y === this.originY) return;
    this.originX = x;
    this.originY = y;
    this.lastTransform = "";
  }

  setLayout(x: number, y: number, r: number, opacity: number, immediate = false) {
    this.tx = x; this.ty = y; this.tr = Math.max(1, r); this.to = clamp01(opacity);
    if (!this.layoutInit || immediate) {
      this.lx = x; this.ly = y; this.lr = this.tr; this.lo = this.to;
      this.layoutInit = true;
    }
    this.dirty = true;
  }

  setState(name: OrbStateName) {
    if (name !== this.state) { this.state = name; this.dirty = true; }
  }

  setOverride(name: OrbStateName | null) {
    if (name !== this.override) { this.override = name; this.dirty = true; }
  }

  setLoading(loading: boolean) {
    if (loading !== this.loading) { this.loading = loading; this.dirty = true; }
  }

  setPointer(x: number, y: number) {
    this.px = x; this.py = y; this.pointerActive = true; this.dirty = true;
  }

  clearPointer() {
    this.pointerActive = false; this.dirty = true;
  }

  ripple() {
    this.rippleStart = performance.now();
    this.dirty = true;
  }

  setDownloadPhase(phase: OrbDownloadPhase) {
    if (phase === this.phase) return;
    if (phase === "expand") this.burstStart = performance.now();
    this.phase = phase;
    this.dirty = true;
  }

  playIntro() {
    if (this.opts.reducedMotion) return this.skipIntro();
    this.intro = 0;
    this.introStart = performance.now();
    this.dirty = true;
  }

  skipIntro() {
    this.intro = 1;
    this.introStart = -1;
    this.dirty = true;
  }

  start() {
    if (this.running || this.lost || document.hidden) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  /* ---------------------------------------------------------- frame -- */

  private readonly frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    if (!this.opts.reducedMotion) this.clock += dt;

    this.monitor(dt);
    const moving = this.update(dt, now);
    if (!this.opts.reducedMotion || this.dirty || moving) this.draw();
    this.dirty = false;
    this.raf = requestAnimationFrame(this.frame);
  };

  /** If frames run long for a couple of seconds, step quality down. Never back up, to avoid oscillation. */
  private monitor(dt: number) {
    if (this.opts.reducedMotion || this.quality === "low") return;
    this.frameAcc += dt;
    this.frameN += 1;
    if (this.frameN < 90) return;
    const avg = this.frameAcc / this.frameN;
    this.frameAcc = 0;
    this.frameN = 0;
    if (avg > 0.028) {
      this.quality = this.quality === "high" ? "medium" : "low";
      this.applyQuality();
      if (this.baseRadius) this.resizeCanvas();
    }
  }

  /** Advance every eased value. Returns true while anything is still settling. */
  private update(dt: number, now: number): boolean {
    const reduced = this.opts.reducedMotion;
    const k = (tau: number) => (reduced ? 1 : 1 - Math.exp(-dt / tau));
    let moving = false;

    // State mix.
    const target = { ...ORB_STATES[this.override ?? this.state] };
    if (this.loading && !this.override) target.pulse = 1;
    const ks = k(0.7);
    for (const key of Object.keys(target) as (keyof Mix)[]) {
      const d = target[key] - this.cur[key];
      if (Math.abs(d) > 0.001) moving = true;
      this.cur[key] += d * ks;
    }

    // Layout.
    const kl = k(0.3);
    this.lx += (this.tx - this.lx) * kl;
    this.ly += (this.ty - this.ly) * kl;
    this.lr += (this.tr - this.lr) * kl;
    this.lo += (this.to - this.lo) * k(0.35);
    if (Math.abs(this.tx - this.lx) + Math.abs(this.ty - this.ly) + Math.abs(this.tr - this.lr) > 0.3) moving = true;
    this.applyLayout();

    // Pointer.
    const R = Math.max(1, this.lr);
    const nx = this.pointerActive && !reduced ? Math.max(-1, Math.min(1, (this.px - this.lx) / (R * 3))) : 0;
    const ny = this.pointerActive && !reduced ? Math.max(-1, Math.min(1, (this.py - this.ly) / (R * 3))) : 0;
    const dist = this.pointerActive && !reduced ? Math.hypot(this.px - this.lx, this.py - this.ly) / R : 99;
    const kp = k(0.9);
    this.yawP += (nx * 0.45 - this.yawP) * kp;
    this.pitchP += (ny * 0.28 - this.pitchP) * kp;
    this.biasY += (ny - this.biasY) * kp;
    this.lightX += (-0.55 + nx * 0.35 - this.lightX) * kp;
    this.lightY += (0.62 - ny * 0.55 - this.lightY) * kp;
    this.near += (smooth(2.4, 0.9, dist) - this.near) * k(0.5);

    // Intro.
    if (this.introStart >= 0) {
      const t = (now - this.introStart) / ORB_INTRO_MS;
      this.intro = t >= 1 ? 1 : t;
      if (t >= 1) this.introStart = -1;
      moving = true;
    }

    // Ripple and bursts.
    const rt = (now - this.rippleStart) / 1100;
    this.rippleOn = !reduced && rt >= 0 && rt < 1 ? 1 : 0;
    this.rippleT = rt < 1 ? 1 - Math.pow(1 - clamp01(rt), 3) : 1;
    const b1t = (now - this.rippleStart) / 800;
    const b2t = (now - this.burstStart) / 1400;
    const b1 = b1t >= 0 && b1t < 1 ? Math.sin(Math.PI * b1t) * 0.28 : 0;
    const b2 = b2t >= 0 && b2t < 1 ? Math.sin(Math.PI * b2t) * 0.5 : 0;
    this.burst = reduced ? 0 : Math.max(b1, b2);
    if (this.rippleOn || this.burst > 0) moving = true;

    // Download geometry.
    const contractTarget = this.phase === "contract" || this.phase === "ring" ? 1 : this.phase === "error" ? 0.18 : 0;
    this.contract += (contractTarget - this.contract) * k(0.38);
    this.progress += ((this.phase === "ring" ? 1 : 0) - this.progress) * k(0.25);

    // Rotation.
    const yaw = (reduced ? 0.6 : this.clock * 0.055) + this.yawP;
    const pitch = -0.2 + this.pitchP;
    mul3(rotY(yaw), rotX(pitch), this.rot);
    for (let i = 0; i < 3; i++) {
      const m = mul3(rotX(1.2 + i * 0.45 + Math.sin(this.clock * 0.04 + i) * 0.04), rotZ(0.25 - i * 0.8 + this.clock * 0.012 * (i + 1)));
      this.ringM.set(m, i * 9);
    }

    this.onLayout?.(this.lx, this.ly, this.lr, this.lo);
    return moving;
  }

  private applyLayout() {
    if (!this.baseRadius) return;
    const scale = this.lr / this.baseRadius;
    const x = this.lx + window.scrollX - this.originX;
    const y = this.ly + window.scrollY - this.originY;
    const transform = `translate3d(${(x - this.cssSide / 2).toFixed(1)}px, ${(y - this.cssSide / 2).toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
    if (transform !== this.lastTransform) {
      this.canvas.style.transform = transform;
      this.lastTransform = transform;
    }
    const opacity = this.lo.toFixed(3);
    if (opacity !== this.lastOpacity) {
      this.canvas.style.opacity = opacity;
      this.lastOpacity = opacity;
    }
  }

  /* ----------------------------------------------------------- draw -- */

  private draw() {
    const gl = this.gl;
    const c = this.cur;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.lo < 0.003 && this.to < 0.003) return;

    const scaleAll = 1 - 0.68 * this.contract;
    const f1 = (p: Program, name: string, v: number) => gl.uniform1f(p.u(name), v);

    const quad = (p: Program, b: WebGLBuffer) => {
      gl.useProgram(p.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      const loc = p.attrib("a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      f1(p, "u_extent", EXTENT);
      return loc;
    };

    // Glow.
    let loc = quad(this.pGlow, this.bGlow);
    for (const [n, v] of [["u_glow", c.glow], ["u_dim", c.dim], ["u_pulse", c.pulse], ["u_intro", this.intro], ["u_near", this.near], ["u_scaleAll", scaleAll], ["u_time", this.clock]] as const) f1(this.pGlow, n, v);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(loc);

    // Sphere.
    loc = quad(this.pSphere, this.bSphere);
    gl.uniformMatrix3fv(this.pSphere.u("u_rot"), false, this.rot);
    gl.uniform2f(this.pSphere.u("u_light"), this.lightX, this.lightY);
    for (const [n, v] of [
      ["u_time", this.clock], ["u_energy", c.energy], ["u_activity", c.activity], ["u_core", c.core], ["u_dim", c.dim],
      ["u_intro", this.intro], ["u_scaleAll", scaleAll], ["u_rippleT", this.rippleT], ["u_rippleOn", this.rippleOn],
      ["u_near", this.near], ["u_pulse", c.pulse], ["u_steps", this.steps],
    ] as const) f1(this.pSphere, n, v);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(loc);

    // Lines.
    const pl = this.pLines;
    gl.useProgram(pl.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bLines);
    const aP = pl.attrib("a_p"), aM = pl.attrib("a_m");
    gl.enableVertexAttribArray(aP);
    gl.enableVertexAttribArray(aM);
    gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(aM, 3, gl.FLOAT, false, 24, 12);
    gl.uniformMatrix3fv(pl.u("u_rot"), false, this.rot);
    gl.uniformMatrix3fv(pl.u("u_ringM[0]"), false, this.ringM);
    for (const [n, v] of [
      ["u_extent", EXTENT], ["u_time", this.clock], ["u_intro", this.intro], ["u_rings", c.rings], ["u_network", c.network],
      ["u_learning", c.learning], ["u_voice", c.voice], ["u_progress", this.progress], ["u_ripple", this.rippleT],
      ["u_rippleOn", this.rippleOn], ["u_panels", c.panels], ["u_dim", c.dim], ["u_scaleAll", scaleAll],
    ] as const) f1(pl, n, v);
    gl.drawArrays(gl.LINES, 0, this.lineCount);
    gl.disableVertexAttribArray(aP);
    gl.disableVertexAttribArray(aM);

    // Points.
    const pp = this.pPoints;
    gl.useProgram(pp.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bPoints);
    const aS = pp.attrib("a_seed"), aK = pp.attrib("a_kind");
    gl.enableVertexAttribArray(aS);
    gl.enableVertexAttribArray(aK);
    gl.vertexAttribPointer(aS, 4, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(aK, 1, gl.FLOAT, false, 20, 16);
    gl.uniformMatrix3fv(pp.u("u_rot"), false, this.rot);
    gl.uniform2f(pp.u("u_bias"), 0, this.biasY);
    for (const [n, v] of [
      ["u_extent", EXTENT], ["u_time", this.clock], ["u_intro", this.intro], ["u_scaleAll", scaleAll], ["u_burst", this.burst],
      ["u_activity", c.activity], ["u_files", c.files], ["u_tools", c.tools], ["u_network", c.network], ["u_learning", c.learning],
      ["u_px", this.pxPerCss], ["u_dim", c.dim], ["u_near", this.near],
    ] as const) f1(pp, n, v);
    gl.drawArrays(gl.POINTS, 0, SPECIAL + Math.floor(INNER * this.pointFraction));
    gl.disableVertexAttribArray(aS);
    gl.disableVertexAttribArray(aK);
  }
}

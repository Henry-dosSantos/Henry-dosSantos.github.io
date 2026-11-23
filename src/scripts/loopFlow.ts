import {
  GEO_IDS,
  LEGEND,
  PORT_IN,
  PORT_OUT,
  RADIATOR_ENTRY_X,
  RADIATOR_EXIT_X,
  SERP_SEGS,
  STRAIGHT_CH,
  DENSE_CH,
  TUBE_SEGS,
  px,
  py,
  type GeoId,
  type Seg,
} from '../lib/loopGeometry';

interface Pt {
  x: number;
  y: number;
  t: number;
  v: number;
}

interface Path {
  n: number;
  length: number;
  x: Float32Array;
  y: Float32Array;
  nx: Float32Array;
  ny: Float32Array;
  t: Float32Array;
  v: Float32Array;
}

interface Particle {
  path: number;
  pos: number;
  px: number;
  py: number;
  off: number;
}

const STEP = 1.5;
const FADE_LEN = 8;
const FULL_VIEW = '0 0 720 500';
const PLATE_VIEW = '108 148 504 344';
const FULL_BOX = { x: 0, y: 0, w: 720, h: 500 };
const PLATE_BOX = { x: 108, y: 148, w: 504, h: 344 };

const COUNTS: Record<GeoId, number> = { straight: 850, dense: 950, serpentine: 480, pin: 850 };
const PIPE_COUNT = 180;
const FAN_SPEED = 38;
const CHANNEL_SPEED: Record<GeoId, number> = { straight: 70, dense: 70, pin: 62, serpentine: 150 };
const PIPE_SPEED = 95;
const FANS_PER: Record<GeoId, number> = { straight: 8, dense: 6, serpentine: 16, pin: 6 };

const LUT: string[] = [];
for (let i = 0; i < 64; i++) {
  const t = i / 63;
  const mix = (a: number[], b: number[], u: number) => a.map((c, k) => Math.round(c + (b[k] - c) * u));
  const rgb =
    t < 0.5 ? mix([255, 255, 255], [222, 189, 136], t / 0.5) : mix([222, 189, 136], [255, 106, 61], (t - 0.5) / 0.5);
  LUT.push(`rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`);
}
const lutIndex = (t: number) => Math.max(0, Math.min(63, Math.round(t * 63)));

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

// Start or end point inside a port, pushed toward the channel it connects to so the paths fan out.
function radialPoint(cx: number, cy: number, tx: number, ty: number): [number, number] {
  const len = Math.hypot(tx - cx, ty - cy) || 1;
  const r = rand(1.5, 6.5);
  return [cx + (r * (tx - cx)) / len + rand(-0.5, 0.5), cy + (r * (ty - cy)) / len + rand(-0.5, 0.5)];
}

function sampleSeg(seg: Seg, ds: number): { x: number; y: number; tx: number; ty: number }[] {
  const out: { x: number; y: number; tx: number; ty: number }[] = [];
  if (seg.k === 'L') {
    const dx = seg.x1 - seg.x0;
    const dy = seg.y1 - seg.y0;
    const len = Math.hypot(dx, dy);
    const n = Math.max(1, Math.ceil(len / ds));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      out.push({ x: seg.x0 + dx * u, y: seg.y0 + dy * u, tx: dx / len, ty: dy / len });
    }
  } else {
    const a0 = (seg.a0 * Math.PI) / 180;
    const a1 = (seg.a1 * Math.PI) / 180;
    const dir = Math.sign(a1 - a0);
    const n = Math.max(2, Math.ceil((Math.abs(a1 - a0) * seg.r) / ds));
    for (let i = 0; i <= n; i++) {
      const a = lerp(a0, a1, i / n);
      out.push({
        x: seg.cx + seg.r * Math.cos(a),
        y: seg.cy + seg.r * Math.sin(a),
        tx: -dir * Math.sin(a),
        ty: dir * Math.cos(a),
      });
    }
  }
  return out;
}

function polyline(segs: Seg[], ds: number) {
  const pts: { x: number; y: number; tx: number; ty: number }[] = [];
  segs.forEach((s) => {
    const sampled = sampleSeg(s, ds);
    pts.push(...(pts.length ? sampled.slice(1) : sampled));
  });
  return pts;
}

function resample(pts: Pt[]): Path {
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const length = cum[cum.length - 1];
  const n = Math.max(2, Math.floor(length / STEP) + 1);
  const x = new Float32Array(n);
  const y = new Float32Array(n);
  const t = new Float32Array(n);
  const v = new Float32Array(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const s = Math.min(length, i * STEP);
    while (j < pts.length - 2 && cum[j + 1] < s) j++;
    const span = cum[j + 1] - cum[j];
    const u = span > 0 ? (s - cum[j]) / span : 0;
    x[i] = lerp(pts[j].x, pts[j + 1].x, u);
    y[i] = lerp(pts[j].y, pts[j + 1].y, u);
    t[i] = lerp(pts[j].t, pts[j + 1].t, u);
    v[i] = lerp(pts[j].v, pts[j + 1].v, u);
  }
  const nx = new Float32Array(n);
  const ny = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(n - 1, i + 1);
    const dx = x[b] - x[a];
    const dy = y[b] - y[a];
    const len = Math.hypot(dx, dy) || 1;
    nx[i] = -dy / len;
    ny[i] = dx / len;
  }
  return { n, length: (n - 1) * STEP, x, y, nx, ny, t, v };
}

function bezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
  v: number,
  count = 28,
): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= count; i++) {
    const u = i / count;
    const w = 1 - u;
    const a = w * w * w;
    const b = 3 * w * w * u;
    const c = 3 * w * u * u;
    const d = u * u * u;
    out.push({
      x: px(a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0]),
      y: py(a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]),
      t,
      v,
    });
  }
  return out;
}

const PIN_FAMILIES: { A: number; yc: number }[] = [];
for (let m = 1; m <= 6; m++) PIN_FAMILIES.push({ A: 1.775, yc: 50 + 7.1 * (m - 3) - 1.775 });
for (let m = 0; m <= 5; m++) PIN_FAMILIES.push({ A: -1.775, yc: 50 + 7.1 * (m - 3) + 1.775 });

const SERP_CENTRE = polyline(SERP_SEGS, 0.3);

// Channel section in mm as {x, y} points from x = 42 to x = 108.
function channelSection(geo: GeoId, index: number): { x: number; y: number }[] {
  if (geo === 'straight' || geo === 'dense') {
    const ch = (geo === 'straight' ? STRAIGHT_CH : DENSE_CH)[index];
    const d = geo === 'straight' ? rand(-1.1, 1.1) : rand(-0.6, 0.6);
    return [
      { x: 42, y: ch.cy + d },
      { x: 108, y: ch.cy + d },
    ];
  }
  if (geo === 'serpentine') {
    const d = rand(-1.8, 1.8);
    return SERP_CENTRE.map((p) => ({ x: p.x - p.ty * d, y: p.y + p.tx * d }));
  }
  const fam = PIN_FAMILIES[index];
  const d = rand(-0.35, 0.35);
  const out: { x: number; y: number }[] = [];
  for (let x = 42; x <= 108.0001; x += 0.25) {
    out.push({ x, y: fam.yc + fam.A * Math.cos((Math.PI * (x - 45.5)) / 6.3) + d });
  }
  return out;
}

function platePath(geo: GeoId, index: number): Path {
  const section = channelSection(geo, index);
  const first = section[0];
  const last = section[section.length - 1];
  const a = radialPoint(PORT_IN.x, PORT_IN.y, 42, first.y);
  const b = radialPoint(PORT_OUT.x, PORT_OUT.y, 108, last.y);
  const inlet = bezier(
    a,
    [lerp(a[0], 42, 0.35), lerp(a[1], first.y, 0.75)],
    [36, first.y],
    [42, first.y],
    0,
    FAN_SPEED,
  );
  const outlet = bezier(
    [108, last.y],
    [114, last.y],
    [lerp(b[0], 108, 0.35), lerp(b[1], last.y, 0.75)],
    b,
    1,
    FAN_SPEED,
  );
  const cum: number[] = [0];
  for (let i = 1; i < section.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(section[i].x - section[i - 1].x, section[i].y - section[i - 1].y));
  }
  const total = cum[cum.length - 1];
  const mid: Pt[] = section.map((p, i) => ({
    x: px(p.x),
    y: py(p.y),
    t: cum[i] / total,
    v: CHANNEL_SPEED[geo],
  }));
  return resample([...inlet, ...mid.slice(1, -1), ...outlet]);
}

function pipePath(): Path {
  const raw = polyline(TUBE_SEGS, 1);
  const pts: Pt[] = raw.map((p) => ({ x: p.x, y: p.y, t: 0, v: PIPE_SPEED }));
  let seenTop = false;
  pts.forEach((p, i) => {
    if (Math.abs(p.y - 70) < 0.01 && p.x < 646) seenTop = true;
    if (!seenTop) p.t = 1;
    else if (Math.abs(p.y - 70) < 0.01) {
      p.t = Math.max(0, Math.min(1, (p.x - RADIATOR_EXIT_X) / (RADIATOR_ENTRY_X - RADIATOR_EXIT_X)));
    } else p.t = 0;
    if (i === 0) p.t = 1;
  });
  return resample(pts);
}

export function initLoop(fig: HTMLElement): void {
  const stage = fig.querySelector<HTMLElement>('.loop__stage');
  const canvas = fig.querySelector<HTMLCanvasElement>('.loop__cv');
  const svg = fig.querySelector<SVGSVGElement>('.loop__svg');
  const pauseBtn = fig.querySelector<HTMLButtonElement>('.loop__pause');
  const geoBtns = Array.from(fig.querySelectorAll<HTMLButtonElement>('.loop__geo button'));
  const legendChannels = fig.querySelector<HTMLElement>('[data-legend="channels"]');
  const legendFlow = fig.querySelector<HTMLElement>('[data-legend="flow"]');
  const ctx = canvas?.getContext('2d');
  if (!stage || !canvas || !svg || !ctx) return;

  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motionQuery.matches;
  let paused = false;
  let visible = true;
  let running = false;
  let raf = 0;
  let cleanup = 0;
  let scratch: HTMLCanvasElement | undefined;
  let last = 0;
  let geo: GeoId = 'straight';
  let plateView = false;
  let scale = 1;
  let plates: Path[] = [];
  const pipe = pipePath();
  let particles: Particle[] = [];
  let pipeParticles: Particle[] = [];

  const box = () => (plateView ? PLATE_BOX : FULL_BOX);

  function applyTransform() {
    const b = box();
    const sx = canvas!.width / b.w;
    const sy = canvas!.height / b.h;
    ctx!.setTransform(sx, 0, 0, sy, -b.x * sx, -b.y * sy);
    scale = sx;
  }

  function buildPaths() {
    plates = [];
    const per = FANS_PER[geo];
    if (geo === 'straight' || geo === 'dense') {
      const count = (geo === 'straight' ? STRAIGHT_CH : DENSE_CH).length;
      for (let k = 0; k < count; k++) for (let i = 0; i < per; i++) plates.push(platePath(geo, k));
    } else if (geo === 'serpentine') {
      for (let i = 0; i < per; i++) plates.push(platePath(geo, 0));
    } else {
      for (let f = 0; f < PIN_FAMILIES.length; f++) for (let i = 0; i < per; i++) plates.push(platePath(geo, f));
    }
  }

  function spawn(p: Particle, pathIndex: number, pos: number) {
    const path = plates[pathIndex];
    p.path = pathIndex;
    p.pos = pos;
    const i = Math.floor(pos);
    p.px = path.x[i];
    p.py = path.y[i];
  }

  function buildParticles() {
    buildPaths();
    const factor = plateView ? 0.6 : 1;
    const plateCount = Math.round(COUNTS[geo] * factor);
    particles = [];
    for (let i = 0; i < plateCount; i++) {
      const p: Particle = { path: 0, pos: 0, px: 0, py: 0, off: 0 };
      const pi = Math.floor(Math.random() * plates.length);
      spawn(p, pi, Math.random() * (plates[pi].n - 1));
      particles.push(p);
    }
    pipeParticles = [];
    if (!plateView) {
      for (let i = 0; i < Math.round(PIPE_COUNT * factor); i++) {
        const pos = Math.random() * (pipe.n - 1);
        const k = Math.floor(pos);
        const off = rand(-2, 2);
        pipeParticles.push({ path: 0, pos, px: pipe.x[k] + pipe.nx[k] * off, py: pipe.y[k] + pipe.ny[k] * off, off });
      }
    }
  }

  function advance(p: Particle, path: Path, dt: number, loop: boolean) {
    const k = Math.min(path.n - 1, Math.floor(p.pos));
    p.pos += (path.v[k] * dt) / STEP;
    if (p.pos >= path.n - 1) {
      if (loop) {
        p.pos -= path.n - 1;
        const j = Math.floor(p.pos);
        p.px = path.x[j] + path.nx[j] * p.off;
        p.py = path.y[j] + path.ny[j] * p.off;
      } else {
        spawn(p, Math.floor(Math.random() * plates.length), 0);
      }
      return false;
    }
    return true;
  }

  function strokeSeg(p: Particle, path: Path, off: number) {
    const i = Math.floor(p.pos);
    const u = p.pos - i;
    const j = Math.min(path.n - 1, i + 1);
    const x = lerp(path.x[i], path.x[j], u) + lerp(path.nx[i], path.nx[j], u) * off;
    const y = lerp(path.y[i], path.y[j], u) + lerp(path.ny[i], path.ny[j], u) * off;
    const s = p.pos * STEP;
    const alpha = Math.max(0, Math.min(1, s / FADE_LEN, (path.length - s) / FADE_LEN));
    ctx!.globalAlpha = alpha;
    ctx!.strokeStyle = LUT[lutIndex(lerp(path.t[i], path.t[j], u))];
    ctx!.beginPath();
    ctx!.moveTo(p.px, p.py);
    ctx!.lineTo(x, y);
    ctx!.stroke();
    p.px = x;
    p.py = y;
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx!.globalCompositeOperation = 'destination-out';
    ctx!.globalAlpha = 1;
    ctx!.fillStyle = 'rgba(0, 0, 0, 0.055)';
    const b = box();
    ctx!.fillRect(b.x, b.y, b.w, b.h);
    ctx!.globalCompositeOperation = 'source-over';
    ctx!.lineCap = 'round';
    ctx!.lineWidth = Math.max(1.3, 1.1 / scale);
    for (const p of particles) {
      const path = plates[p.path];
      if (advance(p, path, dt, false)) strokeSeg(p, path, 0);
    }
    for (const p of pipeParticles) {
      if (advance(p, pipe, dt, true)) strokeSeg(p, pipe, p.off);
    }
    ctx!.globalAlpha = 1;
  }

  function drawStatic() {
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    applyTransform();
    ctx!.lineWidth = 1;
    ctx!.lineCap = 'round';
    ctx!.globalAlpha = 0.55;
    const line = (path: Path) => {
      for (let i = 1; i < path.n; i++) {
        ctx!.strokeStyle = LUT[lutIndex(path.t[i])];
        ctx!.beginPath();
        ctx!.moveTo(path.x[i - 1], path.y[i - 1]);
        ctx!.lineTo(path.x[i], path.y[i]);
        ctx!.stroke();
      }
    };
    plates.forEach(line);
    if (!plateView) line(pipe);
    ctx!.globalAlpha = 1;
  }

  function sync() {
    const shouldRun = !reduced && !paused && visible && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  function resize() {
    const w = stage!.clientWidth;
    if (!w) return;
    const wantPlate = w < 480;
    const viewChanged = wantPlate !== plateView;
    if (viewChanged) {
      plateView = wantPlate;
      fig.dataset.view = plateView ? 'plate' : 'full';
      svg!.setAttribute('viewBox', plateView ? PLATE_VIEW : FULL_VIEW);
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(stage!.clientHeight * dpr);
    applyTransform();
    if (viewChanged || !particles.length) buildParticles();
    if (reduced) drawStatic();
  }

  // destination-out fading leaves a faint rounding residue; drop it once the old streaks are gone.
  function dropResidue() {
    scratch ??= document.createElement('canvas');
    scratch.width = canvas!.width;
    scratch.height = canvas!.height;
    const sctx = scratch.getContext('2d', { willReadFrequently: true });
    if (!sctx) return;
    sctx.drawImage(canvas!, 0, 0);
    const img = sctx.getImageData(0, 0, scratch.width, scratch.height);
    const d = img.data;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 14) d[i] = 0;
    sctx.putImageData(img, 0, 0);
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx!.drawImage(scratch, 0, 0);
    applyTransform();
  }

  function setGeo(next: GeoId) {
    geo = next;
    fig.dataset.geo = next;
    geoBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.geo === next)));
    if (legendChannels) legendChannels.innerHTML = LEGEND[next].channels;
    if (legendFlow) legendFlow.innerHTML = LEGEND[next].flow;
    buildParticles();
    if (reduced) drawStatic();
    else {
      window.clearTimeout(cleanup);
      cleanup = window.setTimeout(dropResidue, 3200);
    }
  }

  geoBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const id = GEO_IDS.find((g) => g === b.dataset.geo);
      if (id) setGeo(id);
    }),
  );

  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.textContent = paused ? 'Play animation' : 'Pause animation';
    sync();
  });

  motionQuery.addEventListener('change', () => {
    reduced = motionQuery.matches;
    if (reduced) drawStatic();
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyTransform();
    sync();
  });

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(stage);
  document.addEventListener('visibilitychange', sync);
  new ResizeObserver(() => {
    resize();
    sync();
  }).observe(stage);

  resize();
  sync();
  fig.dataset.ready = 'true';
}

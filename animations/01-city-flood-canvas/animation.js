/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Suraksha: Procedural City Flood & Push-in Canvas Animation Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * Label: HTML5 2D Canvas Procedural Flood Simulation
 * Features:
 *   - 3-Layer Parallax Scrolling (Far, Mid, Near skylines)
 *   - Deterministic pseudo-random generation (reproducible seed across runs)
 *   - Dynamic multi-phase camera director (wide drift -> district pan -> push-in)
 *   - Atmospheric lightning strikes with dynamic flash falloff & window flicker
 *   - Wave surface deformation with sine superposition
 *   - Floating buoyant debris with surface slope alignment
 *   - Interactive scrubber, playback state machine, and shot chapter markers
 */

(() => {
  'use strict';

  /* ───────────────────────── 1. Tweakable Parameters ───────────────────────── */
  const CONFIG = {
    duration: 20,        // Total timeline duration in seconds
    rainDrops: 340,      // Maximum raindrop streaks rendered per frame
    floodRise: 135,      // Foreground water climb in virtual units
    panStart: 6,         // Start of horizontal camera pan across the district (sec)
    panLength: 8,        // Duration of pan (sec)
    zoomStart: 8,        // Start of camera push-in towards the lit house (sec)
    zoomLength: 7.5,     // Duration of zoom transition (sec)
    endZoom: 2.3,        // Final camera magnification factor
    flashes: [           // Lightning timeline configuration
      { t: 4.6,  d: 0.75, bx: 700, bolt: true  },
      { t: 11.9, d: 0.60, bx: 300, bolt: false },
      { t: 16.8, d: 0.75, bx: 930, bolt: true  }
    ]
  };

  /* ───────────────────────── 2. Geometry & Canvas Setup ───────────────────────── */
  const W = 1280, H = 720;                  // Virtual coordinate space (16:9 standard)
  const DURATION = CONFIG.duration;
  const GF = 560;                           // Foreground ground line coordinate
  const HX = 2000;                          // World-space X anchor of target house
  const REF = { x: 700, y: 372, z: 0.8 };   // Default initial camera transform

  const canvas = document.getElementById('c');
  const stage = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  let K = 1;                                // Scale factor: pixels per virtual unit

  /* ───────────────────────── 3. Mathematical Helpers ───────────────────────── */
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = k => k * k * (3 - 2 * k);
  const inOutCubic = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const inOutSine = k => -(Math.cos(Math.PI * k) - 1) / 2;
  const mod = (a, n) => ((a % n) + n) % n;
  const TAU = Math.PI * 2;

  // Deterministic 32-bit hash for reproducible procedural values
  function hash(n) {
    n |= 0;
    n = (n ^ 61) ^ (n >>> 16);
    n = (n + (n << 3)) | 0;
    n = n ^ (n >>> 4);
    n = Math.imul(n, 0x27d4eb2d);
    n = n ^ (n >>> 15);
    return (n >>> 0) / 4294967296;
  }

  // Mulberry32 pseudo-random generator
  function mulberry(a) {
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const hex = s => [
    parseInt(s.slice(1, 3), 16),
    parseInt(s.slice(3, 5), 16),
    parseInt(s.slice(5, 7), 16)
  ];
  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const mixC = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

  /* ───────────────────────── 4. Color Palettes ───────────────────────── */
  const SKY = {
    top: [hex('#243a5a'), hex('#0f1a2e')],
    mid: [hex('#5f8196'), hex('#2b4559')],
    hor: [hex('#e6d5a2'), hex('#7f9c9b')]
  };

  const C = {
    wall: '#e8d9bc',
    wallShade: '#d5c3a1',
    gable: '#eddfc4',
    trim: '#f4ead2',
    roof: '#5d3b5b',
    roofDark: '#46294a',
    door: '#2e5d63',
    found: '#9a977f',
    brick: '#7b5a50'
  };

  /* ───────────────────────── 5. Timeline & Camera Logic ───────────────────────── */
  function rise(t) {
    const u = clamp(t / DURATION);
    return 0.55 * u + 0.45 * inOutSine(u);
  }

  function camera(t) {
    const pPan = inOutCubic(clamp((t - CONFIG.panStart) / CONFIG.panLength));
    const pZoom = inOutCubic(clamp((t - CONFIG.zoomStart) / CONFIG.zoomLength));
    const driftX = REF.x + 9 * Math.min(t, CONFIG.panStart);
    const driftZ = REF.z + 0.012 * t;

    let x = lerp(driftX, HX, pPan);
    let y = lerp(REF.y, 432, pPan);
    let z = lerp(driftZ, CONFIG.endZoom, pZoom);
    z += 0.1 * smooth(clamp((t - 15.5) / 4.5));

    // Subtle handheld camera shake
    const sway = 0.4 + 0.6 * pZoom;
    x += (Math.sin(t * 0.9) * 2.2 + Math.sin(t * 2.3)) * sway / z;
    y += (Math.sin(t * 0.7 + 1) * 1.8 + Math.sin(t * 1.9)) * sway / z;

    return { x, y, z };
  }

  function flash(t) {
    let f = 0;
    for (const F of CONFIG.flashes) {
      const a = t - F.t;
      if (a > 0 && a < F.d) {
        const v = Math.exp(-a * 10) * (0.75 + 0.25 * Math.sin(a * 90)) + 0.6 * Math.exp(-Math.pow((a - 0.24) / 0.05, 2));
        f = Math.max(f, v);
      }
    }
    return clamp(f);
  }

  /* ───────────────────────── 6. Parallax Background Layers ───────────────────────── */
  const LAYERS = [
    {
      id: 'far', p: 0.12, sg: 428, seed: 11, wMin: 24, wMax: 58, hMin: 40, hMax: 170, pw: 1.5,
      body: '#6c879d', shade: 'rgba(15,35,55,.16)', roof: '#5b758a', ground: '#587389',
      win: { w: 3, h: 4, gx: 4, gy: 5, lit: 0.25, col: 'rgba(255,238,180,.6)', dark: null },
      start: 12, rise: 62, amp: 1, wTop: hex('#a4c6c9'), wBot: hex('#4f8095'), aTop: 0.5, aBot: 0.72, depth: 120, haze: 0.55, crest: 0.35, glints: 0
    },
    {
      id: 'mid', p: 0.30, sg: 456, seed: 23, wMin: 30, wMax: 72, hMin: 60, hMax: 220, pw: 1.6,
      body: '#4b6883', shade: 'rgba(10,25,45,.2)', roof: '#3f5873', ground: '#3d566e',
      win: { w: 4, h: 5, gx: 5, gy: 7, lit: 0.30, col: 'rgba(255,226,150,.75)', dark: 'rgba(6,14,28,.22)' },
      start: 16, rise: 92, amp: 1.3, wTop: hex('#78aab8'), wBot: hex('#2f6b84'), aTop: 0.55, aBot: 0.80, depth: 160, haze: 0.35, crest: 0.45, glints: 30
    },
    {
      id: 'near', p: 0.55, sg: 484, seed: 37, wMin: 40, wMax: 96, hMin: 70, hMax: 230, pw: 1.8,
      body: '#2f4866', shade: 'rgba(5,14,30,.26)', roof: '#243a56', ground: '#233a55',
      win: { w: 5, h: 7, gx: 6, gy: 9, lit: 0.34, col: 'rgba(255,214,128,.9)', dark: 'rgba(6,14,28,.35)' },
      start: 22, rise: 122, amp: 1.8, wTop: hex('#4f93aa'), wBot: hex('#1e5873'), aTop: 0.58, aBot: 0.85, depth: 220, haze: 0.20, crest: 0.50, glints: 60
    }
  ];

  const FGL = {
    amp: 2.4, wTop: hex('#2f87a3'), wBot: hex('#0b3652'), aTop: 0.5, aBot: 0.9, depth: 240, crest: 0.6, glints: 90, start: 70, rise: CONFIG.floodRise
  };

  function genBuildings(L) {
    const r = mulberry(L.seed);
    const out = [];
    let x = -900;
    while (x < 4300) {
      const w = lerp(L.wMin, L.wMax, r());
      const h = lerp(L.hMin, L.hMax, Math.pow(r(), L.pw));
      const t = r();
      const type = t < 0.45 ? 0 : t < 0.62 ? 1 : t < 0.75 ? 2 : t < 0.90 ? 3 : 4;
      const b = { x, w, h, type, seed: Math.floor(r() * 1e6) };
      const c = L.win, px = c.w + c.gx, py = c.h + c.gy;
      const cols = Math.max(1, Math.floor((b.w - 6) / px));
      const rows = Math.max(1, Math.floor((b.h - 12) / py));
      const x0 = b.x + (b.w - cols * px + c.gx) / 2;
      const n = cols * rows;
      const xs = new Float32Array(n), ys = new Float32Array(n), on = new Uint8Array(n), off = new Float32Array(n);
      let i = 0;
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          xs[i] = x0 + cc * px;
          ys[i] = L.G - 10 - (rr + 1) * py + c.gy;
          on[i] = r() < c.lit ? 1 : 0;
          off[i] = 0.18 + r();
          i++;
        }
      }
      b.win = { n, xs, ys, on, off };
      out.push(b);
      x += w + (r() < 0.3 ? lerp(4, 18, r()) : lerp(-4, 3, r()));
    }
    return out;
  }

  for (const L of LAYERS) {
    L.G = (L.sg - 360) / (1 + (REF.z - 1) * L.p) + REF.y * L.p;
    L.blds = genBuildings(L);
  }

  /* ───────────────────────── 7. Drawing Primitives ───────────────────────── */
  let cam = { x: REF.x, y: REF.y, z: REF.z };

  function setT(p) {
    const zl = 1 + (cam.z - 1) * p;
    ctx.setTransform(K * zl, 0, 0, K * zl, K * (640 - cam.x * p * zl), K * (360 - cam.y * p * zl));
    return zl;
  }

  const wv = (x, t, a) =>
    a * (Math.sin(x * 0.021 + t * 1.4) + 0.6 * Math.sin(x * 0.047 - t * 2.1) + 0.3 * Math.sin(x * 0.11 + t * 3.3));

  function drawWindows(b, L, yS, u) {
    const c = L.win, w = b.win;
    if (c.dark) {
      ctx.fillStyle = c.dark;
      ctx.beginPath();
      for (let i = 0; i < w.n; i++) {
        if (!(w.on[i] && u < w.off[i] && w.ys[i] < yS - 4)) ctx.rect(w.xs[i], w.ys[i], c.w, c.h);
      }
      ctx.fill();
    }
    ctx.fillStyle = c.col;
    ctx.beginPath();
    for (let i = 0; i < w.n; i++) {
      if (w.on[i] && u < w.off[i] && w.ys[i] < yS - 4) ctx.rect(w.xs[i], w.ys[i], c.w, c.h);
    }
    ctx.fill();
  }

  function drawBuilding(b, L, yS, u, t) {
    const top = L.G - b.h, x = b.x, w = b.w;
    ctx.fillStyle = L.body;
    ctx.fillRect(x, top, w, b.h + 1);
    ctx.fillStyle = L.shade;
    ctx.fillRect(x + w * 0.7, top, w * 0.3, b.h + 1);

    switch (b.type) {
      case 1: {
        const sh = b.h * 0.16;
        ctx.fillStyle = L.body;
        ctx.fillRect(x + w * 0.18, top - sh, w * 0.64, sh + 1);
        ctx.fillStyle = L.shade;
        ctx.fillRect(x + w * 0.62, top - sh, w * 0.20, sh + 1);
        break;
      }
      case 2:
        ctx.fillStyle = L.roof;
        ctx.beginPath();
        ctx.moveTo(x - 2, top + 1);
        ctx.lineTo(x + w / 2, top - w * 0.34);
        ctx.lineTo(x + w + 2, top + 1);
        ctx.closePath();
        ctx.fill();
        break;
      case 3: {
        const ah = Math.min(60, b.h * 0.3) + 10;
        ctx.strokeStyle = L.body;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x + w / 2, top);
        ctx.lineTo(x + w / 2, top - ah);
        ctx.stroke();
        if (Math.sin(t * 3 + b.seed) > 0.55) {
          ctx.fillStyle = 'rgba(255,96,80,.95)';
          ctx.beginPath();
          ctx.arc(x + w / 2, top - ah, 2.4, 0, TAU);
          ctx.fill();
        }
        break;
      }
      case 4:
        ctx.fillStyle = L.shade;
        ctx.fillRect(x + w * 0.3, top - 14, 2, 14);
        ctx.fillRect(x + w * 0.6, top - 14, 2, 14);
        ctx.fillStyle = L.roof;
        ctx.fillRect(x + w * 0.26, top - 26, w * 0.42, 13);
        break;
      default:
        ctx.fillStyle = L.body;
        ctx.fillRect(x - 1, top - 3, w + 2, 3);
        ctx.fillStyle = L.shade;
        ctx.fillRect(x + w * 0.15, top - 8, w * 0.2, 5);
    }
    drawWindows(b, L, yS, u);
  }

  function drawWater(L, yS, t, x0, x1, y1, zl) {
    const step = Math.max(3, 9 / zl);
    ctx.beginPath();
    ctx.moveTo(x0, y1);
    for (let x = x0; x <= x1 + step; x += step) ctx.lineTo(x, yS + wv(x, t, L.amp));
    ctx.lineTo(x1 + step, y1);
    ctx.closePath();

    const g = ctx.createLinearGradient(0, yS, 0, yS + L.depth);
    g.addColorStop(0, rgb(L.wTop, L.aTop));
    g.addColorStop(1, rgb(L.wBot, L.aBot));
    ctx.fillStyle = g;
    ctx.fill();

    if (L.glints) {
      ctx.strokeStyle = 'rgba(222,242,244,.22)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < L.glints * 3; i++) {
        const gx = mod(hash(i * 5 + 1) * 4200 + t * (6 + hash(i) * 12), 4200) - 400;
        if (gx < x0 || gx > x1) continue;
        const gy = yS + 5 + hash(i * 5 + 2) * L.depth * 0.35;
        const len = 8 + hash(i * 5 + 3) * 16;
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + len, gy);
      }
      ctx.stroke();
    }

    ctx.beginPath();
    for (let x = x0; x <= x1 + step; x += step) {
      const y = yS + wv(x, t, L.amp);
      x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(235,247,246,${L.crest})`;
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }

  function drawCity(L, t, u, R) {
    const zl = setT(L.p);
    const x0 = cam.x * L.p - 640 / zl - 40;
    const x1 = cam.x * L.p + 640 / zl + 40;
    const y1 = cam.y * L.p + 360 / zl + 40;
    const yS = L.G + L.start - L.rise * R;

    ctx.fillStyle = L.ground;
    ctx.fillRect(x0, L.G, x1 - x0, y1 - L.G);

    for (const b of L.blds) {
      if (b.x + b.w < x0 || b.x > x1) continue;
      drawBuilding(b, L, yS, u, t);
    }

    const hz = mixC(SKY.hor[0], SKY.hor[1], u);
    const g = ctx.createLinearGradient(0, L.G - 110, 0, L.G + 10);
    g.addColorStop(0, rgb(hz, 0));
    g.addColorStop(1, rgb(hz, L.haze));
    ctx.fillStyle = g;
    ctx.fillRect(x0, L.G - 110, x1 - x0, 120);

    drawWater(L, yS, t, x0, x1, y1, zl);
  }

  /* ───────────────────────── 8. Sky & Lightning ───────────────────────── */
  const CLOUDS = Array.from({ length: 14 }, (_, i) => ({
    x: hash(i * 3 + 1) * 2600,
    y: 30 + hash(i * 3 + 2) * 230,
    rx: 150 + hash(i * 3 + 3) * 230,
    ry: 20 + hash(i * 7 + 4) * 30,
    v: 4 + hash(i * 11) * 8
  }));

  function drawSky(t, u) {
    ctx.setTransform(K, 0, 0, K, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.78);
    g.addColorStop(0, rgb(mixC(SKY.top[0], SKY.top[1], u)));
    g.addColorStop(0.55, rgb(mixC(SKY.mid[0], SKY.mid[1], u)));
    g.addColorStop(1, rgb(mixC(SKY.hor[0], SKY.hor[1], u)));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const mx = 940 - cam.x * 0.02, ma = 1 - 0.75 * u;
    const mg = ctx.createRadialGradient(mx, 150, 0, mx, 150, 170);
    mg.addColorStop(0, `rgba(255,248,215,${0.38 * ma})`);
    mg.addColorStop(1, 'rgba(255,248,215,0)');
    ctx.fillStyle = mg;
    ctx.fillRect(mx - 170, -20, 340, 340);
    ctx.fillStyle = `rgba(255,250,228,${0.6 * ma})`;
    ctx.beginPath();
    ctx.arc(mx, 150, 24, 0, TAU);
    ctx.fill();

    const cc = mixC(hex('#4a6584'), hex('#18263d'), u);
    ctx.fillStyle = rgb(cc, 0.3 + 0.3 * u);
    for (const c of CLOUDS) {
      const x = mod(c.x + t * c.v - cam.x * 0.03, 2800) - 500;
      ctx.beginPath();
      ctx.ellipse(x, c.y, c.rx, c.ry, 0, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + c.rx * 0.5, c.y - c.ry * 0.4, c.rx * 0.6, c.ry * 0.8, 0, 0, TAU);
      ctx.fill();
    }
  }

  const BOLT = (() => {
    const r = mulberry(77), pts = [[0, 0]];
    let x = 0, y = 0;
    for (let i = 0; i < 14; i++) {
      y += 22 + r() * 22;
      x += (r() - 0.5) * 46;
      pts.push([x, y]);
    }
    return pts;
  })();

  function drawBolt(F, f) {
    ctx.setTransform(K, 0, 0, K, 0, 0);
    ctx.save();
    ctx.translate(F.bx - cam.x * 0.04, -10);
    ctx.strokeStyle = `rgba(240,248,255,${clamp(f * 1.4)})`;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(190,220,255,1)';
    ctx.shadowBlur = 24 * K;
    ctx.beginPath();
    BOLT.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(BOLT[6][0], BOLT[6][1]);
    ctx.lineTo(BOLT[6][0] + 34, BOLT[6][1] + 40);
    ctx.lineTo(BOLT[6][0] + 22, BOLT[6][1] + 84);
    ctx.stroke();
    ctx.restore();
  }

  /* ───────────────────────── 9. Foreground & Lit House ───────────────────────── */
  const HOUSES = [
    { x: 560,  w: 124, wh: 78, rh: 46, wall: '#9d917d', roof: '#47384a' },
    { x: 830,  w: 148, wh: 92, rh: 54, wall: '#8b979d', roof: '#39485a' },
    { x: 1130, w: 112, wh: 70, rh: 44, wall: '#a89a80', roof: '#573f42' },
    { x: 1395, w: 150, wh: 98, rh: 58, wall: '#8a9492', roof: '#3b4a53' },
    { x: 1600, w: 100, wh: 74, rh: 46, wall: '#a39280', roof: '#4a3c4d' },
    { x: 2400, w: 130, wh: 84, rh: 50, wall: '#97a0a2', roof: '#3f4b5e' },
    { x: 2650, w: 150, wh: 92, rh: 54, wall: '#a69884', roof: '#4d3c45' }
  ];
  const TREES = [690, 975, 1262, 1505, 2520];
  const POLES = [[640, 940, 1240, 1540], [2430, 2700, 2900]];
  const DEBRIS = [
    { k: 'plank',  x0: 900,  v: 54,   s: 34 },
    { k: 'crate',  x0: 1296, v: 28,   s: 16 },
    { k: 'barrel', x0: 1900, v: 14,   s: 14 },
    { k: 'buoy',   x0: 1900, v: 10.5, s: 9  }
  ];

  function tree(x, s) {
    ctx.fillStyle = '#2c2a2a';
    ctx.fillRect(x - 5, GF - 90, 10, 90);
    ctx.fillStyle = '#1d3a38';
    ctx.beginPath();
    ctx.arc(x, GF - 112, 40 * s, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#23463f';
    ctx.beginPath();
    ctx.arc(x - 26, GF - 92, 26 * s, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 28, GF - 94, 28 * s, 0, TAU);
    ctx.fill();
  }

  function neighbour(h, i, u) {
    const l = h.x - h.w / 2, top = GF - h.wh;
    if (i % 2 === 0) {
      ctx.fillStyle = '#4a3a3a';
      ctx.fillRect(h.x + h.w * 0.18, top - h.rh * 0.8, 12, h.rh * 0.8);
    }
    ctx.fillStyle = h.wall;
    ctx.fillRect(l, top, h.w, h.wh);
    ctx.fillStyle = h.roof;
    ctx.beginPath();
    ctx.moveTo(l - 10, top + 2);
    ctx.lineTo(h.x, top - h.rh);
    ctx.lineTo(l + h.w + 10, top + 2);
    ctx.closePath();
    ctx.fill();

    for (let k = 0; k < 2; k++) {
      const lit = u < 0.15 + 0.7 * hash(i * 5 + k + 40);
      ctx.fillStyle = lit ? '#f6c76a' : 'rgba(10,20,34,.6)';
      ctx.fillRect(l + h.w * (k ? 0.62 : 0.14), top + h.wh * 0.22, h.w * 0.24, h.wh * 0.34);
    }
    ctx.fillStyle = 'rgba(20,28,40,.55)';
    ctx.fillRect(h.x - 8, GF - h.wh * 0.5, 16, h.wh * 0.5);
  }

  function pane(x, y, w, h, shutters) {
    if (shutters) {
      ctx.fillStyle = C.door;
      ctx.fillRect(x - 16, y - 2, 11, h + 4);
      ctx.fillRect(x + w + 5, y - 2, 11, h + 4);
    }
    ctx.fillStyle = C.trim;
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, '#ffe9a8');
    g.addColorStop(1, '#ffb54f');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(190,92,60,.55)';
    ctx.fillRect(x, y, w * 0.18, h);
    ctx.fillRect(x + w * 0.82, y, w * 0.18, h);
    ctx.fillStyle = C.trim;
    ctx.fillRect(x + w / 2 - 1.5, y, 3, h);
    ctx.fillRect(x, y + h / 2 - 1.5, w, 3);
    ctx.fillStyle = '#cdbd9b';
    ctx.fillRect(x - 7, y + h + 4, w + 14, 5);
  }

  function drawHouse(t, fl) {
    const cx = HX;
    // Chimney
    ctx.fillStyle = '#7b5a50';
    ctx.fillRect(cx + 62, 314, 26, 70);
    ctx.fillStyle = '#5f433b';
    ctx.fillRect(cx + 58, 308, 34, 9);

    // Lean-to side shed
    ctx.fillStyle = C.wallShade;
    ctx.beginPath();
    ctx.moveTo(cx - 240, 486);
    ctx.lineTo(cx - 150, 458);
    ctx.lineTo(cx - 150, 540);
    ctx.lineTo(cx - 240, 540);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = C.roofDark;
    ctx.beginPath();
    ctx.moveTo(cx - 252, 474);
    ctx.lineTo(cx - 150, 446);
    ctx.lineTo(cx - 150, 459);
    ctx.lineTo(cx - 252, 487);
    ctx.closePath();
    ctx.fill();

    // Main wall
    ctx.fillStyle = C.wall;
    ctx.fillRect(cx - 150, 410, 300, 130);
    ctx.fillStyle = C.gable;
    ctx.beginPath();
    ctx.moveTo(cx - 150, 411);
    ctx.lineTo(cx, 318);
    ctx.lineTo(cx + 150, 411);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(90,70,40,.09)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = 420; y < 540; y += 9) {
      ctx.moveTo(cx - 150, y);
      ctx.lineTo(cx + 150, y);
    }
    ctx.stroke();

    // Bargeboards
    ctx.strokeStyle = C.roof;
    ctx.lineWidth = 15;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(cx - 170, 420);
    ctx.lineTo(cx, 305);
    ctx.lineTo(cx + 170, 420);
    ctx.stroke();

    ctx.strokeStyle = '#7d5479';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 166, 413);
    ctx.lineTo(cx, 301);
    ctx.lineTo(cx + 166, 413);
    ctx.stroke();
    ctx.fillStyle = C.roofDark;
    ctx.fillRect(cx - 172, 414, 344, 6);

    // Foundation
    ctx.fillStyle = C.found;
    ctx.fillRect(cx - 150, 538, 300, 22);
    ctx.fillRect(cx - 240, 538, 90, 22);
    ctx.strokeStyle = 'rgba(40,36,30,.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = cx - 240; x < cx + 150; x += 30) {
      ctx.moveTo(x, 538);
      ctx.lineTo(x, 560);
    }
    ctx.moveTo(cx - 240, 549);
    ctx.lineTo(cx + 150, 549);
    ctx.stroke();

    // Windows (warm lit glow)
    ctx.globalAlpha = fl;
    ctx.fillStyle = C.trim;
    ctx.beginPath();
    ctx.arc(cx, 372, 22, 0, TAU);
    ctx.fill();

    const ag = ctx.createLinearGradient(0, 355, 0, 389);
    ag.addColorStop(0, '#ffe9a8');
    ag.addColorStop(1, '#ffb54f');
    ctx.fillStyle = ag;
    ctx.beginPath();
    ctx.arc(cx, 372, 17, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = C.trim;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 17, 372);
    ctx.lineTo(cx + 17, 372);
    ctx.moveTo(cx, 355);
    ctx.lineTo(cx, 389);
    ctx.stroke();

    pane(cx - 127, 462, 44, 52, true);
    pane(cx + 83, 462, 44, 52, true);
    pane(cx - 218, 494, 32, 24, false);
    ctx.globalAlpha = 1;

    // Doorway
    ctx.fillStyle = C.door;
    ctx.fillRect(cx - 22, 452, 44, 86);
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillRect(cx - 16, 488, 32, 44);
    ctx.globalAlpha = fl;
    ctx.fillStyle = '#ffd47a';
    ctx.fillRect(cx - 14, 459, 28, 22);
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.door;
    ctx.fillRect(cx - 1.5, 459, 3, 22);
    ctx.fillStyle = '#f0c46a';
    ctx.beginPath();
    ctx.arc(cx + 14, 500, 2.6, 0, TAU);
    ctx.fill();

    ctx.fillStyle = C.trim;
    ctx.fillRect(cx - 36, 448, 4, 90);
    ctx.fillRect(cx + 32, 448, 4, 90);
    ctx.fillStyle = C.roof;
    ctx.beginPath();
    ctx.moveTo(cx - 50, 450);
    ctx.lineTo(cx, 428);
    ctx.lineTo(cx + 50, 450);
    ctx.closePath();
    ctx.fill();

    // Steps
    ctx.fillStyle = '#b3aea0';
    ctx.fillRect(cx - 42, 550, 84, 10);
    ctx.fillStyle = '#c4bfb1';
    ctx.fillRect(cx - 34, 543, 68, 7);

    // Porch lamp
    ctx.fillStyle = '#3b2d29';
    ctx.fillRect(cx + 56, 468, 9, 3);
    ctx.globalAlpha = fl;
    ctx.fillStyle = '#ffe4a0';
    ctx.fillRect(cx + 61, 470, 8, 13);
    ctx.globalAlpha = 1;

    // Window box plants
    ctx.fillStyle = '#6a4a3a';
    ctx.fillRect(cx + 79, 520, 52, 10);
    ctx.fillStyle = '#3f6b4f';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(cx + 87 + i * 13, 518, 7, 0, TAU);
      ctx.fill();
    }

    // Chimney smoke dissipation
    for (let i = 0; i < 9; i++) {
      const a = mod(t * 0.32 + i / 9, 1);
      ctx.fillStyle = `rgba(205,214,222,${0.36 * (1 - a)})`;
      ctx.beginPath();
      ctx.arc(cx + 75 - a * 70 + Math.sin(a * 5 + i) * 6, 304 - a * 95, 5 + a * 17, 0, TAU);
      ctx.fill();
    }

    // Garden fence & trees
    ctx.fillStyle = '#d9ceb4';
    for (let x = cx + 142; x < cx + 224; x += 13) {
      ctx.beginPath();
      ctx.moveTo(x, GF);
      ctx.lineTo(x, GF - 38);
      ctx.lineTo(x + 4, GF - 44);
      ctx.lineTo(x + 8, GF - 38);
      ctx.lineTo(x + 8, GF);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillRect(cx + 138, GF - 30, 92, 4);
    ctx.fillRect(cx + 138, GF - 14, 92, 4);
    ctx.fillStyle = '#3b2c2a';
    ctx.fillRect(cx + 240, 452, 12, 108);
    ctx.fillStyle = '#1f3d3a';
    ctx.beginPath();
    ctx.arc(cx + 246, 418, 44, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#244640';
    ctx.beginPath();
    ctx.arc(cx + 216, 440, 30, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 278, 442, 32, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#1b3835';
    ctx.beginPath();
    ctx.arc(cx - 262, 540, 22, 0, TAU);
    ctx.fill();
  }

  function debris(d, yS, t) {
    const x = d.x0 + d.v * t;
    const y = yS + wv(x, t, FGL.amp) + 1.5 * Math.sin(t * 1.7 + d.x0);
    const slope = Math.atan2(wv(x + 4, t, FGL.amp) - wv(x - 4, t, FGL.amp), 8);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(slope + 0.06 * Math.sin(t * 1.3 + d.x0));
    const s = d.s;

    if (d.k === 'crate') {
      ctx.fillStyle = '#9a7448';
      ctx.fillRect(-s / 2, -s * 0.65, s, s * 0.85);
      ctx.strokeStyle = '#6e5230';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-s / 2, -s * 0.65, s, s * 0.85);
      ctx.beginPath();
      ctx.moveTo(-s / 2, -s * 0.65);
      ctx.lineTo(s / 2, s * 0.2);
      ctx.stroke();
    } else if (d.k === 'barrel') {
      ctx.fillStyle = '#7d5a3c';
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.3, s * 0.5, s * 0.6, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#403028';
      ctx.fillRect(-s * 0.5, -s * 0.45, s, 2.5);
      ctx.fillRect(-s * 0.5, -s * 0.05, s, 2.5);
    } else if (d.k === 'plank') {
      ctx.fillStyle = '#b28b5c';
      ctx.fillRect(-s / 2, -3, s, 5);
      ctx.fillStyle = '#8a6a44';
      ctx.fillRect(-s / 2, 0, s, 2);
    } else {
      ctx.fillStyle = '#d9503f';
      ctx.beginPath();
      ctx.arc(0, -s * 0.3, s * 0.6, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#f4ead2';
      ctx.fillRect(-s * 0.6, -s * 0.38, s * 1.2, s * 0.2);
    }
    ctx.restore();
  }

  function drawFG(t, u, R, fl) {
    const zl = setT(1);
    const x0 = cam.x - 640 / zl - 60;
    const x1 = cam.x + 640 / zl + 60;
    const y1 = cam.y + 360 / zl + 40;
    const yS = GF + FGL.start - FGL.rise * R;

    // Quay wall
    ctx.fillStyle = '#2b3d56';
    ctx.fillRect(x0, GF, x1 - x0, y1 - GF);
    ctx.fillStyle = '#3b5472';
    ctx.fillRect(x0, GF, x1 - x0, 7);
    ctx.strokeStyle = 'rgba(8,18,32,.38)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let r = 0, y = GF + 7; y < y1; r++, y += 26) {
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      for (let x = Math.floor(x0 / 54) * 54 + (r % 2) * 27; x < x1; x += 54) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 26);
      }
    }
    ctx.stroke();

    // Utility poles & wires
    ctx.fillStyle = '#1b2536';
    ctx.strokeStyle = 'rgba(14,22,36,.9)';
    ctx.lineWidth = 1.2;
    for (const grp of POLES) {
      for (const px of grp) {
        ctx.fillRect(px - 2.5, GF - 190, 5, 190);
        ctx.fillRect(px - 22, GF - 192, 44, 4);
      }
      for (let i = 0; i < grp.length - 1; i++) {
        for (const d of [-18, 18]) {
          ctx.beginPath();
          ctx.moveTo(grp[i] + d, GF - 190);
          ctx.quadraticCurveTo((grp[i] + grp[i + 1]) / 2 + d, GF - 190 + 34, grp[i + 1] + d, GF - 190);
          ctx.stroke();
        }
      }
    }

    for (const x of TREES) tree(x, 1);
    HOUSES.forEach((h, i) => neighbour(h, i, u));
    drawHouse(t, fl);

    for (const d of DEBRIS) {
      if (d.x0 + d.v * t > x0 - 40 && d.x0 + d.v * t < x1 + 40) debris(d, yS, t);
    }

    drawWater(FGL, yS, t, x0, x1, y1, zl);

    // Warm window reflections in turbulent floodwater
    for (const [wx, ww] of [[HX - 105, 44], [HX + 105, 44], [HX - 202, 32], [HX, 26]]) {
      for (let k = 0; k < 8; k++) {
        const off = Math.sin(t * 2.2 + k * 1.3 + wx) * 3;
        const w = ww * (1 - k * 0.09);
        ctx.fillStyle = `rgba(255,196,96,${(0.34 - 0.04 * k) * fl})`;
        ctx.fillRect(wx - w / 2 + off, yS + 4 + k * 7, w, 2.2);
      }
    }

    // Impact ripples
    const I = 0.4 + 0.6 * u;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(228,243,244,1)';
    for (let j = 0; j < 220; j++) {
      const T = 1.2 + 0.5 * hash(j + 300);
      const q = t / T + hash(j);
      const c = Math.floor(q);
      const ph = q - c;
      if (hash(j * 7 + 2) > I) continue;
      const x = hash(j * 31 + c * 7 + 5) * 3600 - 400;
      if (x < x0 || x > x1) continue;
      const y = yS + wv(x, t, FGL.amp) + 3 + hash(j * 17 + c * 3 + 9) * 16;
      const rx = 3 + ph * 26;
      ctx.globalAlpha = (1 - ph) * 0.5;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, rx * 0.22, 0, 0, TAU);
      ctx.stroke();
    }

    // Doorstep lapping water
    for (let i = 0; i < 3; i++) {
      const ph = mod(t / 3.2 + i / 3, 1);
      const rx = 24 + ph * 110;
      ctx.globalAlpha = (1 - ph) * 0.42 * clamp(u * 3);
      ctx.beginPath();
      ctx.ellipse(HX, yS + 7, rx, rx * 0.1, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* ───────────────────────── 10. Post-processing: Rain, Glow, Grading ───────────────────────── */
  function glowAt(x, y, r, a, col) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${col},${a})`);
    g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function drawGlow(u, fl) {
    setT(1);
    const a = (0.16 + 0.34 * u) * fl;
    const col = '255,196,100';
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, r, k] of [
      [HX - 105, 488, 80, 1],
      [HX + 105, 488, 80, 1],
      [HX, 372, 54, 0.8],
      [HX - 202, 506, 56, 0.7],
      [HX + 65, 477, 70, 1.3],
      [HX, 470, 60, 0.6]
    ]) {
      glowAt(x, y, r, a * k, col);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawRain(t, u, z) {
    ctx.setTransform(K, 0, 0, K, 0, 0);
    const I = 0.4 + 0.6 * u;
    const rs = 1 + (z - 1) * 0.3;
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? 'rgba(215,232,238,.5)' : 'rgba(205,225,232,.28)';
      ctx.lineWidth = (pass ? 1.6 : 1) * rs;
      ctx.beginPath();
      for (let i = 0; i < CONFIG.rainDrops; i++) {
        if ((hash(i * 13 + 6) > 0.75) !== !!pass || hash(i * 13 + 1) > I) continue;
        const sp = 620 + 380 * hash(i * 13 + 2);
        const len = (10 + 14 * hash(i * 13 + 3)) * rs;
        const y = mod(hash(i * 13 + 4) * (H + 80) + t * sp, H + 80) - 40;
        const x = hash(i * 13 + 5) * (W + 260) - 130 - y * 0.2;
        ctx.moveTo(x, y);
        ctx.lineTo(x - len * 0.2, y + len);
      }
      ctx.stroke();
    }
  }

  function drawGrade(u, f) {
    ctx.setTransform(K, 0, 0, K, 0, 0);
    ctx.fillStyle = 'rgba(210,230,255,' + f * 0.3 + ')';
    if (f > 0.01) ctx.fillRect(0, 0, W, H);
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
    v.addColorStop(0, 'rgba(4,9,18,0)');
    v.addColorStop(1, 'rgba(4,9,18,.55)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }

  /* ───────────────────────── 11. Master Frame Render ───────────────────────── */
  let t = 0;
  function render() {
    const u = clamp(t / DURATION);
    const R = rise(t);
    const f = flash(t);
    cam = camera(t);
    const fl = clamp(0.94 + 0.06 * Math.sin(t * 7.3) * Math.sin(t * 2.9 + 1) - 0.5 * clamp(f * 2), 0.35, 1);

    drawSky(t, u);
    for (const F of CONFIG.flashes) {
      if (F.bolt && t > F.t && t < F.t + F.d && f > 0.04) drawBolt(F, f);
    }
    for (const L of LAYERS) drawCity(L, t, u, R);
    drawFG(t, u, R, fl);

    ctx.setTransform(K, 0, 0, K, 0, 0);
    ctx.fillStyle = `rgba(8,16,30,${0.34 * u})`;
    ctx.fillRect(0, 0, W, H);

    drawGlow(u, fl);
    drawRain(t, u, cam.z);
    drawGrade(u, f);
  }

  /* ───────────────────────── 12. Interactive Controls & UI ───────────────────────── */
  const $ = id => document.getElementById(id);
  const playBtn = $('play');
  const scrub = $('scrub');
  const timeEl = $('time');
  const chapters = [...document.querySelectorAll('.chapters button')];

  const ICON = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5h3.5v13H3zm6.5 0H13v13H9.5z"/></svg>',
    replay: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.2V.2L4.6 3.1 8 6V4a4 4 0 1 1-4 4H2a6 6 0 1 0 6-5.8z"/></svg>'
  };

  let playing = false, raf = 0, last = 0, wasPlaying = false;
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  function updateUI() {
    const done = t >= DURATION;
    const [icon, label] = playing ? [ICON.pause, 'Pause'] : done ? [ICON.replay, 'Replay'] : [ICON.play, 'Play'];
    playBtn.innerHTML = icon + '<span>' + label + '</span>';
    scrub.value = Math.round((t / DURATION) * 1000);
    scrub.style.setProperty('--fill', (t / DURATION) * 100 + '%');
    timeEl.textContent = `${fmt(t)} / ${fmt(DURATION)}`;
    const shot = t >= 14.5 ? 2 : t >= 6 ? 1 : 0;
    chapters.forEach((b, i) => b.setAttribute('aria-current', i === shot ? 'true' : 'false'));
  }

  function tick(now) {
    if (!playing) return;
    t = Math.min(DURATION, t + Math.min(0.05, (now - last) / 1000));
    last = now;
    if (t >= DURATION) playing = false;
    render();
    updateUI();
    if (playing) raf = requestAnimationFrame(tick);
  }

  function play() {
    if (t >= DURATION) t = 0;
    cancelAnimationFrame(raf);
    playing = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
    updateUI();
  }

  function pause() {
    playing = false;
    cancelAnimationFrame(raf);
    updateUI();
  }

  function seek(s) {
    t = clamp(s, 0, DURATION);
    render();
    updateUI();
  }

  playBtn.addEventListener('click', () => (playing ? pause() : play()));
  scrub.addEventListener('pointerdown', () => {
    wasPlaying = playing;
    pause();
  });
  scrub.addEventListener('input', () => seek((scrub.value / 1000) * DURATION));
  scrub.addEventListener('change', () => {
    if (wasPlaying) play();
    wasPlaying = false;
  });

  chapters.forEach(b =>
    b.addEventListener('click', () => {
      seek(parseFloat(b.dataset.t));
    })
  );

  document.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('button, input')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      playing ? pause() : play();
    } else if (e.code === 'ArrowRight') seek(t + 1);
    else if (e.code === 'ArrowLeft') seek(t - 1);
  });

  function resize() {
    const r = stage.getBoundingClientRect(),
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.round(r.width * dpr));
    canvas.height = Math.round((canvas.width * 9) / 16);
    K = canvas.width / W;
    render();
  }

  new ResizeObserver(resize).observe(stage);
  resize();
  updateUI();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) play();

  // Exported global handle for testing or recording
  window.__flood = { render, seek, play, pause };
})();

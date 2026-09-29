// PF-174 explainer series: the shared engine. Load after core.js, studio.js,
// cels.js, materials.js, fonts.js and parts.js; then call PF.film(n).
// Each part is one film. Scenes are data (parts.js): the engine lays out the
// cards, times them from the amount of text (so every card stays up long
// enough to read) and writes the score from the same timings.
'use strict';
const PF = (() => {
// ---------------------------------------------------------------- look
const PAPER = '#f4efe3', INK = '#16213a', INK2 = '#2d3752', MUTED = '#6b7186', TEAL = '#0e8f9b', TEAL2 = '#c9e7ea',
  YEL = '#f5c542', RED = '#d64541', GRN = '#2e9e5b', GRN2 = '#d3ecd9', CARD = '#fffbf3', LINE = '#d6ccb6', KRAFT = '#d9a86c', SKY = '#dbeef1';
const X0 = 80, CW = 920, XC = 540, TOP = 250, BOT = 1650;
const FPS = 24, PRESS = [[0, .35], [.1, .9], [.5, 1], [.9, .9], [1, .35]], DEG = Math.PI/180;
const span = (t, a, b, e = x => x) => e(clamp((t - a)/(b - a), 0, 1));
const lp2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const uz = s => String(s).replace(/([oOgG])'/g, '$1ʻ').replace(/'/g, 'ʼ');
const words = s => s ? uz(s).replace(/\*/g, '').split(/[ \n\t]+/).filter(Boolean).length : 0;
const SERIES = 'Bojxona islohoti · PF-174';
const DISCLAIMER = "Video farmon mazmunini soddalashtirib tushuntiradi, huquqiy maslahat emas. Rasmiy matn: *lex.uz* (PF-174, 27.08.2026).";

for (const f of SERIES_FONTS) { const ff = new FontFace(f.family, `url(${f.src})`, {weight: f.weight, unicodeRange: f.range}); document.fonts.add(ff); _photoLoads.push(ff.load()); }
_photoLoads.push(document.fonts.load('500 40px Onest', uz("o'g' ma'")), document.fonts.load('800 40px Onest'), document.fonts.load('600 60px Fraunces', uz("O'zbekiston")), document.fonts.load('900 60px Fraunces', '0123456789'));

// ---------------------------------------------------------------- type
const MC = document.createElement('canvas').getContext('2d');
const lsFor = (size, fam) => ((fam === 'Fraunces' ? -.012 : size >= 60 ? -.02 : size >= 34 ? -.01 : 0)*size).toFixed(2) + 'px';
function font(c, w, size, fam = 'Onest', ls = null) { c.font = `${w} ${size}px ${fam}`; c.letterSpacing = ls ?? lsFor(size, fam); }
function measure(s, w, size, fam = 'Onest', ls = null) { font(MC, w, size, fam, ls); return MC.measureText(uz(s)).width; }
function label(c, s, x, y, {size = 36, w = 600, fam = 'Onest', color = INK, align = 'left', alpha = 1, ls = null} = {}) {
  if (alpha <= 0) return;
  c.save(); font(c, w, size, fam, ls); c.textAlign = align; c.textBaseline = 'alphabetic'; c.globalAlpha *= alpha; c.fillStyle = color; c.fillText(uz(s), x, y); c.restore();
}
// Rich text: *stars* mark the words that matter. They are set bolder and get
// a marker stroke that sweeps in after the line appears.
function tokenize(s) {
  const out = []; let hl = false, cur = null;
  for (const ch of uz(s)) {
    if (ch === '*') { hl = !hl; continue; }
    if (ch === ' ' || ch === '\n' || ch === '\t') { cur = null; continue; }   // no-break spaces stay inside a word
    if (!cur) { cur = {segs: []}; out.push(cur); }
    const last = cur.segs[cur.segs.length - 1];
    if (last && last.hl === hl) last.s += ch; else cur.segs.push({s: ch, hl});
  }
  return out;
}
function rich(s, size, maxW, {w0 = 500, w1 = 760, fam = 'Onest', lh = 1.3, align = 'left'} = {}) {
  const ws = tokenize(s), sp = measure(' ', w0, size, fam);
  for (const wd of ws) { let x = 0; for (const g of wd.segs) { g.x = x; g.w = measure(g.s, g.hl ? w1 : w0, size, fam); x += g.w; } wd.w = x; }
  const lines = []; let line = null;
  for (const wd of ws) {
    if (!line || (line.words.length && line.w + sp + wd.w > maxW)) { line = {words: [], w: 0}; lines.push(line); }
    wd.x = line.words.length ? line.w + sp : 0; line.w = wd.x + wd.w; line.words.push(wd);
  }
  const L = {lines, size, w0, w1, fam, lh: size*lh, maxW, align, sp, runs: []};
  L.h = lines.length ? (lines.length - 1)*L.lh + size*1.2 : 0;
  L.wMax = Math.max(0, ...lines.map(l => l.w));
  lines.forEach((ln, i) => {
    const off = align === 'center' ? (maxW - ln.w)/2 : 0; let run = null;
    for (const wd of ln.words) for (const g of wd.segs) {
      const x0 = off + wd.x + g.x, x1 = x0 + g.w;
      if (g.hl) { if (run && x0 - run.x1 < sp + 2) run.x1 = x1; else { run = {line: i, x0, x1}; L.runs.push(run); } } else run = null;
    }
  });
  L.runLen = L.runs.reduce((a, r) => a + r.x1 - r.x0, 0);
  return L;
}
function marker(c, x0, x1, y0, y1, color, seed, alpha = .6) {
  if (x1 <= x0 + 1) return;
  const n = Math.max(2, Math.ceil((x1 - x0)/40)), top = [], bot = [];
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i/n); top.push([x, y0 + 3*noise1(i*.7, seed)]); bot.push([x, y1 + 3*noise1(i*.7 + 20, seed)]); }
  c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha *= alpha; c.fillStyle = color; c.beginPath();
  top.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.lineTo(x1 + 4, (y0 + y1)/2);
  for (let i = bot.length - 1; i >= 0; i--) c.lineTo(...bot[i]); c.lineTo(x0 - 3, (y0 + y1)/2); c.closePath(); c.fill(); c.restore();
}
function drawRich(c, L, x, y, {color = INK2, hl = INK, alpha = 1, mark = 1, markColor = YEL, mode = 'marker'} = {}) {
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  const base = i => y + i*L.lh + L.size*.95;
  if (mode === 'marker' && mark > 0 && L.runLen) {
    let budget = mark*L.runLen;
    L.runs.forEach((r, k) => { if (budget <= 0) return; const len = Math.min(budget, r.x1 - r.x0); budget -= r.x1 - r.x0;
      marker(c, x + r.x0 - 6, x + r.x0 + len + 6, base(r.line) - L.size*.74, base(r.line) + L.size*.2, markColor, k + 3); });
  }
  L.lines.forEach((ln, i) => {
    const off = L.align === 'center' ? (L.maxW - ln.w)/2 : 0;
    for (const wd of ln.words) for (const g of wd.segs) { font(c, g.hl ? L.w1 : L.w0, L.size, L.fam); c.fillStyle = g.hl ? hl : color; c.fillText(g.s, x + off + wd.x + g.x, base(i)); }
  });
  c.restore();
}
const markDur = L => .3 + L.runLen/1100 + .12*L.runs.length;

// ---------------------------------------------------------------- ink
// Every line is a cel: authored once, drawn on stroke by stroke, then held
// still. A held drawing keeps its marks (no boil).
const CELS = new Map();
function celOf(id, make) {
  let v = CELS.get(id);
  if (!v) { v = compileCel({strokes: make().map((s, k) => ({id: s.id ?? `s${k}`, points: s.pts, width: s.w ?? 3.2, opacity: s.o ?? 1, pressure: PRESS, ...(s.color ? {color: s.color} : {})}))}, {id}); CELS.set(id, v); }
  return v;
}
function inkReveal(c, cel, u, color = INK) {
  if (u <= 0) return;
  if (u >= 1) return drawCel(c, cel, {material: 'ink', color});
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  const alpha = c.globalAlpha, total = cel.strokes.reduce((a, s) => a + s.samples.length - 1, 0); let budget = u*total;
  for (const s of cel.strokes) {
    const last = Math.min(s.samples.length - 1, Math.floor(budget)); budget -= s.samples.length - 1; if (last < 1) break;
    c.strokeStyle = s.color ?? color;
    const pt = a => { const d = noise1(a.u*5, s.seed)*.20*Math.sin(Math.PI*a.u); return [a.p[0] - a.tangent[1]*d, a.p[1] + a.tangent[0]*d]; };
    for (let i = 1; i <= last; i++) { const a = s.samples[i - 1], b = s.samples[i]; c.lineWidth = Math.max(.04, (a.w + b.w)/2); c.globalAlpha = alpha*(s.opacity ?? 1)*.9; c.beginPath(); c.moveTo(...pt(a)); c.lineTo(...pt(b)); c.stroke(); }
  }
  c.restore();
}
function rrect(cx, cy, w, h, r, per = 5) {
  const pts = [], x0 = cx - w/2, y0 = cy - h/2, x1 = cx + w/2, y1 = cy + h/2;
  const corner = (x, y, a0) => { for (let i = 0; i <= per; i++) { const a = a0 + i/per*Math.PI/2; pts.push([x + r*Math.cos(a), y + r*Math.sin(a)]); } };
  corner(x1 - r, y0 + r, -Math.PI/2); corner(x1 - r, y1 - r, 0); corner(x0 + r, y1 - r, Math.PI/2); corner(x0 + r, y0 + r, Math.PI);
  return pts;
}
const ring = (c, rx, ry, a0, sweep, n) => Array.from({length: n}, (_, k) => { const a = a0 + sweep*k/(n - 1); return [c[0] + rx*Math.cos(a), c[1] + ry*Math.sin(a)]; });
const circ = (c, r, n = 16) => ring(c, r, r, 0, TAU, n + 1).slice(0, -1);
const pathOf = (pts, close = true) => { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); if (close) p.closePath(); return p; };
function densify(pts, step = 30, close = true) {
  const out = [], P = close ? [...pts, pts[0]] : pts;
  for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])/step)); for (let k = 0; k < n; k++) out.push(lp2(a, b, k/n)); }
  if (!close) out.push(P[P.length - 1]);
  return out;
}
const jit = (pts, amp, seed) => pts.map((p, k) => [p[0] + amp*noise1(k*.5, seed), p[1] + amp*noise1(k*.5 + 37, seed)]);
const loopOf = (pts, amp = 1.6, seed = 1, step = 30) => { const d = jit(densify(pts, step), amp, seed); return [...d, ...d.slice(0, 3)]; };
const lineOf = (pts, amp = 1.2, seed = 1) => jit(densify(pts, 22, false), amp, seed);
function fillPts(c, pts, color, alpha = 1, dx = 0, dy = 0) { if (alpha <= 0) return; c.save(); c.globalAlpha *= alpha; c.fillStyle = color; c.translate(dx, dy); c.fill(pathOf(pts)); c.restore(); }
// A card: flat fill printed slightly off the ink line, the line drawn on.
function card(c, id, x, y, w, h, {r = 22, u = 1, fillC = CARD, fillA = 1, stroke = INK, width = 2.6, seed = 1} = {}) {
  const cel = celOf(`card:${id}:${Math.round(w)}x${Math.round(h)}`, () => [{pts: loopOf(rrect(w/2, h/2, w, h, r, 6), 1.8, seed, 36), w: width}]);
  c.save(); c.translate(x, y);
  if (fillC) fillPts(c, rrect(w/2, h/2, w, h, r, 6), fillC, fillA*span(u, .2, 1), 4, 5);
  inkReveal(c, cel, u, stroke); c.restore();
}
function brush(c, id, x0, y0, x1, y1, u, color = YEL, width = 9) {
  const cel = celOf(`brush:${id}`, () => [{pts: lineOf([[0, 0], [x1 - x0, y1 - y0]], 1.4, 7), w: width}]);
  c.save(); c.translate(x0, y0); inkReveal(c, cel, u, color); c.restore();
}
function arrow(c, id, x0, y0, x1, y1, u, color = INK) {
  const L = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0);
  const cel = celOf(`arrow:${id}:${Math.round(L)}`, () => [{id: 'shaft', pts: lineOf([[0, 0], [L, 0]], 1, 3), w: 3}, {id: 'head', pts: [[L - 16, -11], [L, 0], [L - 16, 11]], w: 3}]);
  c.save(); c.translate(x0, y0); c.rotate(a); inkReveal(c, cel, u, color); c.restore();
}

// ---------------------------------------------------------------- icons
// Local box about ±100. Fills print first (a little off register), then the line.
const C = (id, pts, w = 3.2, color) => ({id, pts: loopOf(pts, 1.3, id.length*7 + pts.length), w, color});
const O = (id, pts, w = 3.2, color) => ({id, pts: lineOf(pts, 1.1, id.length*5 + pts.length), w, color});
const ICONS = {
  doc: () => { const page = [[-62, -88], [36, -88], [66, -58], [66, 88], [-62, 88]];
    return {fills: [[page, CARD]], lines: [C('page', page), O('fold', [[36, -88], [36, -58], [66, -58]], 2.6),
      O('l1', [[-38, -44], [40, -44]], 2.6), O('l2', [[-38, -18], [40, -18]], 2.6), O('l3', [[-38, 8], [18, 8]], 2.6),
      C('seal', circ([30, 50], 17, 14), 2.6, RED), O('rb1', [[22, 65], [15, 86]], 2.4, RED), O('rb2', [[38, 65], [45, 86]], 2.4, RED)]}; },
  gatePost: () => { const post = [[-100, -14], [-72, -14], [-72, 92], [-100, 92]];
    return {fills: [[post, RED]], lines: [C('post', post), O('ground', [[-132, 92], [132, 92]], 2.8), O('rd1', [[-40, 112], [-2, 112]], 2.4), O('rd2', [[40, 112], [78, 112]], 2.4)]}; },
  gateArm: () => { const arm = [[0, -10], [200, -10], [200, 10], [0, 10]];
    return {fills: [[arm, CARD], [[[44, -10], [76, -10], [76, 10], [44, 10]], RED], [[[108, -10], [140, -10], [140, 10], [108, 10]], RED], [[[172, -10], [200, -10], [200, 10], [172, 10]], RED]], lines: [C('arm', arm, 3)]}; },
  truck: () => { const box = [[-96, -54], [26, -54], [26, 34], [-96, 34]], cab = [[26, -22], [62, -22], [88, 6], [88, 34], [26, 34]];
    return {fills: [[box, TEAL2], [cab, YEL], [circ([-60, 40], 15), INK2], [circ([56, 40], 15), INK2]],
      lines: [C('box', box), C('cab', cab), C('win', [[36, -12], [58, -12], [72, 4], [36, 4]], 2.4), C('w1', circ([-60, 40], 15)), C('w2', circ([56, 40], 15)), O('gr', [[-122, 58], [120, 58]], 2.6)]}; },
  clock: () => { const lines = [C('rim', circ([0, 0], 84, 26))]; for (let i = 0; i < 12; i++) { const a = i*30*DEG; lines.push(O('t' + i, [[70*Math.cos(a), 70*Math.sin(a)], [80*Math.cos(a), 80*Math.sin(a)]], i % 3 ? 2 : 3.4)); }
    return {fills: [[circ([0, 0], 84, 26), CARD]], lines}; },
  coins: () => { const top = ring([-30, -12], 58, 18, 0, TAU, 21).slice(0, -1), sil = [...ring([-30, -12], 58, 18, Math.PI, Math.PI, 11), ...ring([-30, 62], 58, 18, 0, Math.PI, 11)];
    const coin = circ([70, 24], 38, 18);
    return {fills: [[sil, YEL], [coin, YEL]], lines: [C('top', top), O('bot', ring([-30, 62], 58, 18, 0, Math.PI, 12)), O('m1', ring([-30, 13], 58, 18, 0, Math.PI, 12), 2.2), O('m2', ring([-30, 38], 58, 18, 0, Math.PI, 12), 2.2),
      O('sl', [[-88, -12], [-88, 62]]), O('sr', [[28, -12], [28, 62]]), C('coin', coin), C('coin2', circ([70, 24], 26, 14), 2.2)]}; },
  chip: () => { const lines = [C('body', rrect(0, 0, 124, 124, 18)), C('core', rrect(0, 0, 78, 78, 10), 2.4)];
    for (let i = 0; i < 4; i++) { const p = -42 + i*28; lines.push(O('t' + i, [[p, -62], [p, -86]], 2.8), O('b' + i, [[p, 62], [p, 86]], 2.8), O('l' + i, [[-62, p], [-86, p]], 2.8), O('r' + i, [[62, p], [86, p]], 2.8)); }
    return {fills: [[rrect(0, 0, 124, 124, 18), TEAL2]], lines, text: [['AI', 0, 15, 44, INK]]}; },
  magnifier: () => ({fills: [[circ([-18, -18], 56, 22), SKY]], lines: [C('lens', circ([-18, -18], 56, 22)), O('h', [[22, 22], [78, 78]], 8), O('shine', ring([-18, -18], 36, 36, -2.7, 1.1, 8), 2.4)]}),
  parcel: () => { const front = [[-76, -18], [30, -18], [30, 76], [-76, 76]], top = [[-76, -18], [-44, -56], [64, -56], [30, -18]], side = [[30, -18], [64, -56], [64, 40], [30, 76]];
    return {fills: [[front, KRAFT], [top, '#e8c08c'], [side, '#c58f55']], lines: [C('f', front), C('t', top), C('s', side), O('tape', [[-26, -18], [6, -56]], 6, CARD)]}; },
  suitcase: () => { const b = rrect(0, 16, 180, 124, 18);
    return {fills: [[b, TEAL2]], lines: [C('b', b), O('h', [[-30, -46], [-30, -70], [30, -70], [30, -46]], 4), O('s1', [[-52, -44], [-52, 76]], 2.6), O('s2', [[52, -44], [52, 76]], 2.6)]}; },
  robot: () => { const head = rrect(0, -26, 128, 96, 24), body = rrect(0, 62, 96, 64, 14);
    return {fills: [[head, SKY], [body, TEAL2], [circ([-28, -30], 11, 10), INK], [circ([28, -30], 11, 10), INK]],
      lines: [C('head', head), C('body', body), O('m', [[-22, 0], [22, 0]], 2.8), O('ant', [[0, -74], [0, -98]], 2.8), C('bulb', circ([0, -105], 8, 8), 2.6, RED), O('a1', [[-48, 48], [-80, 80]], 3.4), O('a2', [[48, 48], [80, 80]], 3.4)]}; },
  phone: () => { const b = rrect(0, 0, 104, 186, 20), s = rrect(0, -6, 82, 140, 8);
    return {fills: [[b, INK2], [s, SKY], [rrect(-18, -44, 28, 28, 6), TEAL], [rrect(18, -44, 28, 28, 6), YEL], [rrect(-18, -8, 28, 28, 6), RED], [rrect(18, -8, 28, 28, 6), GRN]],
      lines: [C('b', b), C('btn', circ([0, 78], 6, 8), 2.2, CARD)]}; },
  server: () => { const lines = [], fills = [];
    for (let k = 0; k < 3; k++) { const y = -58 + k*58, r = rrect(0, y, 180, 46, 10); fills.push([r, k === 1 ? TEAL2 : SKY], [circ([62, y], 6, 8), k === 2 ? GRN : YEL]); lines.push(C('r' + k, r), O('sl' + k, [[-68, y], [-12, y]], 2.6)); }
    return {fills, lines}; },
  pin: () => { const p = [...ring([0, -34], 54, 54, 150*DEG, 240*DEG, 26), [0, 78]];
    return {fills: [[p, RED], [circ([0, -34], 19, 12), CARD]], lines: [C('pin', p), C('dot', circ([0, -34], 19, 12), 2.6)]}; },
  shield: () => { const s = [[0, -92], [72, -64], [66, 16], [36, 62], [0, 90], [-36, 62], [-66, 16], [-72, -64]];
    return {fills: [[s, SKY]], lines: [C('s', s), O('ck', [[-32, 0], [-8, 26], [36, -28]], 7, GRN)]}; },
  people: () => { const h1 = circ([-46, -34], 28, 14), h2 = circ([50, -22], 24, 14), b1 = ring([-46, 70], 52, 62, Math.PI, Math.PI, 14), b2 = ring([50, 72], 44, 52, Math.PI, Math.PI, 12);
    return {fills: [[b2, TEAL2], [h2, TEAL2], [b1, YEL], [h1, YEL]], lines: [C('b2', b2), C('h2', h2), C('b1', b1), C('h1', h1)]}; },
  building: () => { const ped = [[-96, -36], [0, -92], [96, -36]], base = [[-86, -36], [86, -36], [86, 70], [-86, 70]];
    const lines = [C('ped', ped), O('st1', [[-100, 78], [100, 78]], 3.2), O('st2', [[-112, 92], [112, 92]], 3.2)];
    for (let i = 0; i < 4; i++) { const x = -60 + i*40; lines.push(O('col' + i, [[x, -24], [x, 68]], 6)); }
    return {fills: [[ped, SKY], [base, CARD]], lines}; },
  chart: () => { const bars = [[-58, 30], [-10, -4], [38, -44]], fills = [], lines = [O('ax', [[-92, -86], [-92, 76], [92, 76]], 3)];
    bars.forEach(([x, y], k) => { const r = [[x - 17, y], [x + 17, y], [x + 17, 74], [x - 17, 74]]; fills.push([r, [TEAL2, TEAL, GRN][k]]); lines.push(C('b' + k, r, 2.6)); });
    lines.push(O('tr', [[-78, 6], [-30, -26], [8, -18], [66, -80]], 3.4, RED), O('th', [[44, -80], [66, -80], [66, -58]], 3.4, RED));
    return {fills, lines}; },
  globe: () => { const r = circ([0, 0], 80, 28);
    return {fills: [[r, SKY]], lines: [C('r', r), C('m', ring([0, 0], 34, 80, 0, TAU, 21).slice(0, -1), 2.4), O('eq', [[-80, 0], [80, 0]], 2.4), O('t', ring([0, -120], 110, 90, 60*DEG, 60*DEG, 12), 2.2), O('b', ring([0, 120], 110, 90, 240*DEG, 60*DEG, 12), 2.2)]}; },
  percent: () => ({fills: [], lines: [O('sl', [[58, -80], [-58, 80]], 8), C('a', circ([-44, -46], 25, 14), 7), C('b', circ([44, 46], 25, 14), 7)]}),
  calendar: () => { const b = rrect(0, 8, 170, 150, 16), lines = [C('b', b), O('r1', [[-40, -86], [-40, -54]], 6), O('r2', [[40, -86], [40, -54]], 6)];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) lines.push(C(`d${i}${j}`, rrect(-50 + i*50, 14 + j*40, 26, 22, 4), 2.2));
    return {fills: [[b, CARD], [[[-85, -52], [85, -52], [85, -22], [-85, -22]], RED]], lines}; },
  cash: () => { const b = rrect(0, 0, 196, 108, 10);
    return {fills: [[b, GRN2]], lines: [C('b', b), C('i', rrect(0, 0, 164, 78, 6), 2.2), C('c', circ([0, 0], 24, 12), 2.6)]}; },
};
const ICON_CACHE = {};
function iconOf(name) {
  if (ICON_CACHE[name]) return ICON_CACHE[name];
  const def = ICONS[name](); return ICON_CACHE[name] = {cel: celOf('icon:' + name, () => def.lines), fills: def.fills, text: def.text ?? []};
}
function icon(c, name, x, y, s = 1, u = 1, rot = 0) {
  if (u <= 0) return;
  const ic = iconOf(name); c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const fa = span(u, .55, 1);
  for (const [pts, col] of ic.fills) fillPts(c, pts, col, fa, 5, 6);
  inkReveal(c, ic.cel, u, INK);
  for (const [str, tx, ty, sz, col] of ic.text) label(c, str, tx, ty, {size: sz, w: 900, fam: 'Fraunces', color: col, align: 'center', alpha: span(u, .7, 1)});
  c.restore();
}
// A rubber stamp, inked on its own layer so wear can knock paper back through it.
const STAMPS = {};
function stampLayer(text, color, size) {
  const key = text + color + size; if (STAMPS[key]) return STAMPS[key];
  const tw = measure(text, 800, size, 'Onest', (size*.08).toFixed(1) + 'px'), w = tw + size*1.4, h = size*1.9, k = 2;
  const cv = document.createElement('canvas'); cv.width = Math.ceil((w + 20)*k); cv.height = Math.ceil((h + 20)*k); const g = cv.getContext('2d'); g.scale(k, k); g.translate(10, 10);
  const o = celOf(`stamp:${key}:o`, () => [{pts: loopOf(rrect(w/2, h/2, w, h, 10, 4), 1.4, 5), w: 5}]), i = celOf(`stamp:${key}:i`, () => [{pts: loopOf(rrect(w/2, h/2, w - 16, h - 16, 6, 4), 1.2, 9), w: 2.4}]);
  drawCel(g, o, {material: 'ink', color}); drawCel(g, i, {material: 'ink', color});
  font(g, 800, size, 'Onest', (size*.08).toFixed(1) + 'px'); g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText(uz(text), w/2 + size*.04, h/2 + size*.36);
  g.globalCompositeOperation = 'destination-out'; const r = rng(text.length*13 + size);
  for (let n = 0; n < w*h/60; n++) { const x = r()*w, y = r()*h, rad = .4 + r()*r()*2.4; g.globalAlpha = .5 + r()*.5; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill(); }
  return STAMPS[key] = {cv, w: w + 20, h: h + 20};
}
function stamp(c, text, color, size, x, y, l, rot = -10*DEG) {
  if (l < 0) return;
  const st = stampLayer(text, color, size), q = span(l, 0, .125), s = lerp(1.7, 1, q);
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha *= .92*q; c.drawImage(st.cv, -st.w/2, -st.h/2, st.w, st.h); c.restore();
}
const BADGE = () => celOf('badge', () => [{pts: loopOf(circ([0, 0], 32, 18), 1.2, 4), w: 2.6}]);
const TICK = () => celOf('tick', () => [{pts: lineOf([[10, 28], [24, 44], [58, -2]], 1, 2), w: 8}]);
const shake = (l, t0) => { const d = l - t0; return d >= 0 && d < .125 ? [(hash(Math.round(d*FPS), 3) - .5)*10, (hash(Math.round(d*FPS), 4) - .5)*8] : [0, 0]; };
function pill(c, x, y, w, h, fillC, a = 1) { if (a <= 0) return; fillPts(c, rrect(x + w/2, y + h/2, w, h, h/2, 6), fillC, a); }
function calGlyph(c, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = INK; c.lineWidth = 3; c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = CARD; c.fill(pathOf(rrect(0, 2, 30, 26, 4))); c.stroke(pathOf(rrect(0, 2, 30, 26, 4))); c.fillStyle = RED; c.fillRect(-15, -11, 30, 7);
  c.beginPath(); c.moveTo(-7, -15); c.lineTo(-7, -8); c.moveTo(7, -15); c.lineTo(7, -8); c.stroke(); c.restore();
}

// ---------------------------------------------------------------- blocks
// read(b): seconds a block holds the viewer before the next one comes.
// layout(b, sc, id): {h, draw(c, l, y), sfx: [[t, kind]]}; l is local time.
const rd = (s, k = .32, base = .9) => base + k*words(s);
const numFmt = (v, dec) => { const s = Math.abs(v).toFixed(dec).replace('.', ','); const [i, f] = s.split(','); return (v < 0 ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (f ? ',' + f : ''); };
const decOf = v => (String(v).split(',')[1] ?? '').length;
const numOf = v => Number(String(v).replace(',', '.'));
const KINDS = {
  text: {read: b => rd(b.s, .32, 1),
    layout: b => { const L = rich(b.s, b.size ?? 42, CW, {align: b.center ? 'center' : 'left', w0: b.w ?? 500}); const md = markDur(L);
      return {h: L.h, draw: (c, l, y) => drawRich(c, L, X0, y, {color: b.color ?? INK2, mark: span(l, .45, .45 + md, easeInOutSine)})}; }},
  note: {read: b => rd(b.s, .22, .6),
    layout: b => { const L = rich(b.s, 30, CW - 34, {w0: 500, w1: 700}); return {h: L.h, sfx: [],
      draw: (c, l, y) => { c.save(); c.strokeStyle = TEAL; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(X0 + 4, y + 8); c.lineTo(X0 + 4, y + L.h - 4); c.stroke(); c.restore();
        drawRich(c, L, X0 + 30, y, {color: MUTED, hl: INK2, mode: 'none'}); }}; }},
  item: {read: b => 1.2 + .32*(words(b.s) + words(b.head)) + (b.stamp ? .8 : 0),
    layout: (b, sc, id) => {
      const pad = 30, off = b.n != null ? pad + 64 + 22 : pad + 4, tw = CW - off - pad - (b.stamp ? 178 : 0);
      const H = b.head ? rich(b.head, b.headSize ?? 40, tw, {w0: 760, w1: 800}) : null, B = b.s ? rich(b.s, b.size ?? 36, tw) : null;
      const tagW = b.tag ? measure(b.tag, 700, 28) + 36 : 0;
      let h = pad; const yT = h; if (b.tag) h += 44 + 14; const yH = h; if (H) h += H.h + (B ? 10 : 0); const yB = h; if (B) h += B.h; h += pad;
      h = Math.max(h, b.n != null ? 64 + 2*pad : 0, b.stamp ? 150 : 0);
      const md = B ? markDur(B) : 0, stAt = Math.max(1.1, KINDS.item.read(b) - 1.3);
      return {h, sfx: b.stamp ? [[0, 'tick'], [stAt, 'thud']] : [[0, 'tick']], draw: (c, l, y) => {
        const [sx, sy] = b.stamp ? shake(l, stAt) : [0, 0]; c.save(); c.translate(sx, sy);
        card(c, id, X0, y, CW, h, {u: span(l, 0, .4), fillC: b.fill ?? CARD, seed: id.length});
        if (b.n != null) { const bx = X0 + pad + 32, by = y + pad + 32; fillPts(c, circ([bx, by], 32, 18), b.badge ?? YEL, span(l, .1, .3), 3, 4);
          c.save(); c.translate(bx, by); inkReveal(c, BADGE(), span(l, .1, .4), INK); c.restore();
          label(c, String(b.n), bx, by + 13, {size: 38, w: 800, fam: 'Fraunces', align: 'center', alpha: span(l, .2, .4)}); }
        if (b.tag) { pill(c, X0 + off, y + yT, tagW, 44, b.tagColor ?? TEAL2); label(c, b.tag, X0 + off + 18, y + yT + 31, {size: 28, w: 700, color: INK}); }
        if (H) drawRich(c, H, X0 + off, y + yH, {color: INK, hl: b.hlColor ?? TEAL, mode: 'color'});
        if (B) drawRich(c, B, X0 + off, y + yB, {mark: span(l, .5, .5 + md, easeInOutSine)});
        c.restore();
        if (b.stamp) stamp(c, b.stamp, b.stampColor ?? RED, 34, X0 + CW - 98, y + h/2, l - stAt, (b.stampRot ?? -9)*DEG);
      }};
    }},
  check: {read: b => rd(b.s, .32, 1.1),
    layout: (b, sc, id) => { const L = rich(b.s, 38, CW - 92), h = Math.max(58, L.h), tick = Math.max(.9, KINDS.check.read(b) - .7);
      return {h, sfx: [[0, 'tick'], [tick, 'check']], draw: (c, l, y) => {
        card(c, id, X0, y + 2, 54, 54, {r: 10, u: span(l, 0, .3), fillC: CARD, width: 3});
        c.save(); c.translate(X0, y + 2); inkReveal(c, TICK(), span(l, tick, tick + .25), GRN); c.restore();
        drawRich(c, L, X0 + 92, y + (L.lines.length === 1 ? 4 : 0), {mark: span(l, .45, .45 + markDur(L), easeInOutSine)});
      }}; }},
  step: {read: b => rd(b.s, .32, 1.1),
    layout: (b, sc, id) => { const L = rich(b.s, 38, CW - 100), h = Math.max(64, L.h);
      const it = {h, draw: (c, l, y) => {
        if (it.prev) arrow(c, id, X0 + 32, it.prev.y + 70, X0 + 32, y - 6, span(l, 0, .3), MUTED);
        fillPts(c, circ([X0 + 32, y + 32], 32, 18), b.color ?? TEAL, span(l, 0, .2), 3, 4);
        c.save(); c.translate(X0 + 32, y + 32); inkReveal(c, BADGE(), span(l, .05, .35), INK); c.restore();
        label(c, String(b.n), X0 + 32, y + 45, {size: 36, w: 800, fam: 'Fraunces', align: 'center', color: CARD, alpha: span(l, .15, .35)});
        drawRich(c, L, X0 + 100, y + (L.lines.length === 1 ? 6 : 0), {mark: span(l, .45, .45 + markDur(L), easeInOutSine)});
      }}; return it; }},
  tl: {read: b => rd(b.s, .32, 1.1),
    layout: (b, sc, id) => { const pw = b.pw ?? 250, L = rich(b.s, 36, CW - pw - 28), h = Math.max(54, L.h);
      return {h, draw: (c, l, y) => {
        card(c, id, X0, y, pw, 54, {r: 27, u: span(l, 0, .3), fillC: b.color ?? YEL, width: 2.4});
        label(c, b.when, X0 + pw/2, y + 38, {size: measure(b.when, 800, 30) > pw - 30 ? 25 : 30, w: 800, align: 'center', alpha: span(l, .1, .3)});
        drawRich(c, L, X0 + pw + 28, y + (L.lines.length === 1 ? 5 : 0), {mark: span(l, .45, .45 + markDur(L), easeInOutSine)});
      }}; }},
  stat: {read: b => 2.3 + .3*words(b.label),
    layout: (b, sc, id) => { const nw = b.nw ?? 360, L = rich(b.label, 36, CW - nw - 20), size = b.size ?? 128, h = Math.max(size*1.05, L.h + 16);
      const N = numOf(b.v), F = b.from != null ? numOf(b.from) : 0, dec = decOf(b.v), full = (b.pre ?? '') + numFmt(N, dec) + (b.suf ?? '');
      return {h, sfx: [[0, 'tick'], [.3, 'count'], [1.25, 'ding']], draw: (c, l, y) => {
        const v = lerp(F, N, span(l, .15, 1.2, easeOutQuint)), s = (b.pre ?? '') + numFmt(v, dec) + (b.suf ?? '');
        const base = y + h/2 + size*.34, w = measure(full, 900, size, 'Fraunces');
        if (l > 1.15) brush(c, `${id}:u`, X0, base + 16, X0 + w, base + 12, span(l, 1.15, 1.45), YEL, 12);
        label(c, s, X0, base, {size, w: 900, fam: 'Fraunces', color: b.color ?? TEAL});
        drawRich(c, L, X0 + nw + 20, y + (h - L.h)/2, {mark: span(l, .8, .8 + markDur(L), easeInOutSine)});
      }}; }},
  big: {read: b => 2.6 + .3*words(b.label),
    layout: (b, sc, id) => { const size = b.size ?? 170, L = rich(b.label, 38, CW, {align: 'center'}), h = size*1.02 + 24 + L.h;
      const N = numOf(b.v), F = b.from != null ? numOf(b.from) : 0, dec = decOf(b.v), uw = b.unit ? measure(b.unit, 800, 54) + 16 : 0;
      return {h, sfx: [[0, 'tick'], [.3, 'count'], [1.3, 'ding']], draw: (c, l, y) => {
        const v = lerp(F, N, span(l, .15, 1.25, easeOutQuint)), s = (b.pre ?? '') + numFmt(v, dec) + (b.suf ?? ''), full = (b.pre ?? '') + numFmt(N, dec) + (b.suf ?? '');
        const w = measure(full, 900, size, 'Fraunces'), x = XC - (w + uw)/2, base = y + size*.8;
        if (l > 1.2) brush(c, `${id}:u`, x, base + 18, x + w + uw, base + 14, span(l, 1.2, 1.55), YEL, 14);
        label(c, s, x, base, {size, w: 900, fam: 'Fraunces', color: b.color ?? TEAL});
        if (b.unit) label(c, b.unit, x + w + 16, base, {size: 54, w: 800, color: INK});
        drawRich(c, L, X0, y + size*1.02 + 24, {mark: span(l, .9, .9 + markDur(L), easeInOutSine)});
      }}; }},
  lanes: {read: b => 2 + 1.4*b.segs.length,
    layout: (b, sc, id) => { const bh = 96, rows = b.segs.map(s => rich(`*${s.v}%* — ${s.label}`, 34, CW - 60)); const h = bh + 36 + rows.reduce((a, r) => a + r.h + 16, 0);
      return {h, sfx: b.segs.map((s, k) => [.3 + k*1.2, 'tick']), draw: (c, l, y) => {
        fillPts(c, rrect(XC, y + bh/2, CW, bh, 14, 6), CARD, 1, 4, 5);
        let x = X0, yy = y + bh + 36;
        b.segs.forEach((s, k) => { const t0 = .3 + k*1.2, w = CW*s.v/100*span(l, t0, t0 + .7, easeOutQuint);
          if (w > 0) { c.save(); c.beginPath(); c.rect(X0 + 3, y + 3, CW - 6, bh - 6); c.clip(); fillPts(c, [[x, y], [x + w, y], [x + w, y + bh], [x, y + bh]], s.color, .95); c.restore();
            if (w > 110) label(c, s.v + '%', x + w/2, y + bh/2 + 17, {size: 46, w: 800, fam: 'Fraunces', align: 'center', color: s.ink ?? INK, alpha: span(l, t0 + .4, t0 + .7)}); }
          x += CW*s.v/100;
          const a = span(l, t0, t0 + .35); if (a > 0) { fillPts(c, rrect(X0 + 17, yy + 22, 34, 34, 6), s.color, a); drawRich(c, rows[k], X0 + 60, yy, {alpha: a, mode: 'color', hl: INK}); }
          yy += rows[k].h + 16; });
        card(c, id, X0, y, CW, bh, {r: 14, u: span(l, 0, .3), fillC: null});
      }}; }},
  bars: {read: b => 1.6 + 1.3*b.rows.length,
    layout: (b, sc, id) => { const rows = b.rows.map(r => rich(r, 34, CW, {w0: 600})), bh = 50; const h = rows.reduce((a, r) => a + r.h + 10 + bh + 30, -30);
      return {h, sfx: rows.map((r, k) => [.9 + k*.45, 'down']), draw: (c, l, y) => {
        let yy = y;
        rows.forEach((r, k) => { drawRich(c, r, X0, yy, {color: INK}); yy += r.h + 10;
          const t0 = .9 + k*.45, f = lerp(b.from, b.to, span(l, t0, t0 + .8, easeInOutQuint))/b.from, W0 = CW - 150;
          c.save(); c.setLineDash([10, 8]); c.strokeStyle = LINE; c.lineWidth = 3; c.strokeRect(X0, yy, W0, bh); c.restore();
          fillPts(c, [[X0, yy], [X0 + W0*f, yy], [X0 + W0*f, yy + bh], [X0, yy + bh]], b.color ?? TEAL, .95);
          label(c, b.tag, X0 + W0*f + 18, yy + bh/2 + 14, {size: 40, w: 800, color: RED, alpha: span(l, t0 + .6, t0 + .9)});
          yy += bh + 30; });
      }}; }},
  chips: {read: b => .8 + .45*b.items.length,
    layout: (b, sc, id) => { const sz = b.size ?? 36, ph = sz*1.75, gap = 18, items = []; let x = 0, y = 0;
      for (const s of b.items) { const w = measure(s, 700, sz) + sz*1.4; if (x && x + w > CW) { x = 0; y += ph + gap; } items.push({s, x, y, w}); x += w + gap; }
      const rowsW = {}; items.forEach(it => rowsW[it.y] = it.x + it.w); if (b.center !== false) items.forEach(it => it.x += (CW - rowsW[it.y])/2);
      const h = y + ph;
      return {h, sfx: items.map((it, k) => [.15 + k*.2, 'pop']), draw: (c, l, yy) => items.forEach((it, k) => {
        const t0 = .15 + k*.2, a = span(l, t0, t0 + .25, easeOutBack); if (a <= 0) return;
        c.save(); c.translate(X0 + it.x + it.w/2, yy + it.y + ph/2); c.scale(a, a);
        card(c, `${id}:${k}`, -it.w/2, -ph/2, it.w, ph, {r: ph/2, fillC: (b.colors ?? [YEL, TEAL2, GRN2, SKY])[k % (b.colors ?? [1, 2, 3, 4]).length], width: 2.4});
        label(c, it.s, 0, sz*.36, {size: sz, w: 700, align: 'center'}); c.restore(); })}; }},
  icon: {read: b => b.read ?? .6,
    layout: b => { const s = b.scale ?? 1.3; return {h: 210*s, sfx: [], draw: (c, l, y) => icon(c, b.k, b.x ?? XC, y + 105*s, s, span(l, 0, .8))}; }},
  formula: {read: () => 6,
    layout: (b, sc, id) => { const h = 470;
      return {h, sfx: [[0, 'tick'], [1.4, 'tick'], [2.6, 'ding']], draw: (c, l, y) => {
        const a1 = span(l, 0, .4, easeOut), a2 = span(l, 1.4, 1.8, easeOut), a3 = span(l, 2.6, 3.0, easeOut);
        label(c, '20%', X0, y + 140, {size: 160, w: 900, fam: 'Fraunces', color: TEAL, alpha: a1});
        label(c, 'tovarning', X0 + 400, y + 72, {size: 40, w: 500, color: INK2, alpha: a1}); label(c, 'bojxona qiymatidan', X0 + 400, y + 122, {size: 40, w: 760, color: INK, alpha: a1});
        label(c, 'lekin kamida', X0, y + 240, {size: 42, w: 700, color: MUTED, alpha: a2}); brush(c, `${id}:l`, X0 + 290, y + 226, X0 + CW, y + 226, span(l, 1.5, 2.0), LINE, 5);
        label(c, '$2', X0, y + 410, {size: 160, w: 900, fam: 'Fraunces', color: RED, alpha: a3});
        label(c, 'har bir kilogrammi', X0 + 260, y + 342, {size: 40, w: 760, color: INK, alpha: a3}); label(c, 'uchun', X0 + 260, y + 392, {size: 40, w: 500, color: INK2, alpha: a3});
        if (l > 3.2) { c.save(); c.translate(X0 + 780, y + 350); inkReveal(c, celOf(`${id}:kg`, () => [{pts: loopOf(circ([0, 0], 64, 20), 2, 6), w: 4}]), span(l, 3.2, 3.6), RED); c.restore(); label(c, '1 kg', X0 + 780, y + 364, {size: 38, w: 800, align: 'center', alpha: span(l, 3.4, 3.7)}); }
      }}; }},
  example: {read: () => 6.8,
    layout: (b, sc, id) => { const H = rich(b.head, 36, CW - 60, {w0: 600, w1: 800}), pad = 30, lh = 64, h = pad + H.h + 22 + lh*2 + 20 + 90 + pad;
      const pct = b.v*.2, min = b.kg*2, pay = Math.max(pct, min), usePct = pct >= min;
      return {h, sfx: [[0, 'tick'], [1.4, 'tick'], [2.6, 'tick'], [3.9, 'ding']], draw: (c, l, y) => {
        card(c, id, X0, y, CW, h, {u: span(l, 0, .4)});
        drawRich(c, H, X0 + pad, y + pad, {color: INK, mode: 'color', hl: INK});
        let yy = y + pad + H.h + 22 + 46;
        const row = (t0, str, res, win) => { const a = span(l, t0, t0 + .35); label(c, str, X0 + pad, yy, {size: 40, w: 600, color: INK2, alpha: a}); label(c, res, X0 + CW - pad, yy, {size: 44, w: 800, color: win ? INK : MUTED, align: 'right', alpha: a});
          if (!win && l > 4.1) { const rw = measure(res, 800, 44); c.save(); c.globalAlpha *= span(l, 4.1, 4.4); c.strokeStyle = MUTED; c.lineWidth = 3; c.beginPath(); c.moveTo(X0 + CW - pad - rw - 6, yy - 14); c.lineTo(X0 + CW - pad + 6, yy - 14); c.stroke(); c.restore(); } yy += lh; };
        row(1.4, `20% × $${b.v}`, `$${numFmt(pct, pct % 1 ? 2 : 0)}`, usePct);
        row(2.6, `${b.kg} kg × $2`, `$${numFmt(min, 0)}`, !usePct);
        yy += 38; const a = span(l, 3.9, 4.3, easeOut);
        label(c, "To'lov (kattasi):", X0 + pad, yy, {size: 40, w: 700, color: INK, alpha: a});
        label(c, `$${numFmt(pay, pay % 1 ? 2 : 0)}`, X0 + CW - pad, yy + 4, {size: 64, w: 900, fam: 'Fraunces', color: GRN, align: 'right', alpha: a});
        if (l > 4.3) { c.save(); c.translate(X0 + CW - pad - 70, yy - 18); inkReveal(c, celOf(`${id}:ring`, () => [{pts: loopOf(ring([0, 0], 96, 48, 0, TAU, 25).slice(0, -1), 2.2, 5), w: 4}]), span(l, 4.3, 4.7), GRN); c.restore(); }
      }}; }},
  compare: {read: () => 5.2,
    layout: (b, sc, id) => { const h = 330;
      return {h, sfx: [[0, 'tick'], [.9, 'tick'], [2.3, 'thud']], draw: (c, l, y) => {
        const W0 = CW - 40, w1 = W0*.34*span(l, .2, .8, easeOutQuint), w2 = W0*.62*span(l, .9, 1.5, easeOutQuint);
        label(c, b.a, X0, y + 36, {size: 36, w: 760, color: INK, alpha: span(l, 0, .3)});
        fillPts(c, [[X0, y + 56], [X0 + w1, y + 56], [X0 + w1, y + 116], [X0, y + 116]], TEAL, .95);
        label(c, b.b, X0, y + 190, {size: 36, w: 760, color: INK, alpha: span(l, .9, 1.2)});
        fillPts(c, [[X0, y + 210], [X0 + w2, y + 210], [X0 + w2, y + 270], [X0, y + 270]], LINE, .95);
        if (l > 2.3) { brush(c, `${id}:x`, X0 - 10, y + 250, X0 + W0*.62 + 16, y + 226, span(l, 2.3, 2.55), RED, 10); stamp(c, b.stamp, RED, 32, X0 + W0*.62 + 150, y + 238, l - 2.5, -8*DEG); }
      }}; }},
  clocks: {read: () => 5,
    layout: (b, sc, id) => { const h = 440, cols = [X0 + 230, X0 + CW - 230];
      return {h, sfx: [[0, 'tick'], [.6, 'count'], [1.6, 'ding']], draw: (c, l, y) => b.items.forEach((it, k) => {
        const cx = cols[k], cy = y + 70 + 130, t0 = .2 + k*.5;
        label(c, it.label, cx, y + 40, {size: 40, w: 800, align: 'center', alpha: span(l, t0, t0 + .3)});
        icon(c, 'clock', cx, cy, 1.35, span(l, t0, t0 + .6));
        const f = it.frac*span(l, t0 + .5, t0 + 1.5, easeInOutQuint);
        if (f > 0) { c.save(); c.globalAlpha *= .45; c.fillStyle = it.color ?? TEAL; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, 100, -Math.PI/2, -Math.PI/2 + f*TAU); c.closePath(); c.fill(); c.restore(); }
        if (l > t0 + .5) { const a = -Math.PI/2 + f*TAU; c.save(); c.strokeStyle = INK; c.lineCap = 'round'; c.lineWidth = 7; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 86*Math.cos(a), cy + 86*Math.sin(a)); c.stroke(); c.fillStyle = INK; c.beginPath(); c.arc(cx, cy, 9, 0, TAU); c.fill(); c.restore(); }
        label(c, it.v, cx, y + 70 + 260 + 76, {size: 60, w: 900, fam: 'Fraunces', color: it.color ?? TEAL, align: 'center', alpha: span(l, t0 + 1.3, t0 + 1.6)});
      })}; }},
  years: {read: b => 2.4 + .5*b.data.length,
    layout: (b, sc, id) => { const bh = 380, h = bh + 110, max = Math.max(...b.data.map(d => d[1])), n = b.data.length, cw = CW/n;
      return {h, sfx: b.data.map((d, k) => [.3 + k*.35, 'pop']), draw: (c, l, y) => {
        c.save(); c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(X0, y + bh + 50); c.lineTo(X0 + CW, y + bh + 50); c.stroke(); c.restore();
        b.data.forEach(([yr, v], k) => { const t0 = .3 + k*.35, f = span(l, t0, t0 + .6, easeOutQuint), x = X0 + k*cw + cw*.18, w = cw*.64, top = y + 50 + bh*(1 - v/max*f);
          if (f > 0) { fillPts(c, [[x, top], [x + w, top], [x + w, y + bh + 50], [x, y + bh + 50]], k % 2 ? TEAL : TEAL2, 1); c.save(); c.strokeStyle = INK; c.lineWidth = 2.6; c.strokeRect(x, top, w, y + bh + 50 - top); c.restore(); }
          label(c, numFmt(v*f, 0), x + w/2, top - 14, {size: 36, w: 800, align: 'center', alpha: span(l, t0 + .3, t0 + .6)});
          label(c, yr, x + w/2, y + bh + 96, {size: 32, w: 700, color: MUTED, align: 'center'}); });
      }}; }},
  pins: {read: b => 1.8 + 1.4*b.items.length,
    layout: (b, sc, id) => { const n = b.items.length, cw = CW/n, h = 420;
      return {h, sfx: b.items.map((it, k) => [.2 + k*1.1, 'pop']), draw: (c, l, y) => b.items.forEach((it, k) => {
        const t0 = .2 + k*1.1, cx = X0 + cw*(k + .5), a = span(l, t0, t0 + .35, easeOut);
        icon(c, 'pin', cx, y + 90 - 20*(1 - a), .8, span(l, t0, t0 + .6));
        label(c, it.ha, cx, y + 250, {size: 72, w: 900, fam: 'Fraunces', color: RED, align: 'center', alpha: span(l, t0 + .3, t0 + .6)});
        label(c, it.r, cx, y + 316, {size: 34, w: 800, align: 'center', alpha: span(l, t0 + .4, t0 + .7)});
        label(c, it.p, cx, y + 362, {size: 30, w: 500, color: MUTED, align: 'center', alpha: span(l, t0 + .5, t0 + .8)});
      })}; }},
  merge: {read: () => 4.4,
    layout: (b, sc, id) => { const h = 330, w = 400;
      return {h, sfx: [[0, 'tick'], [1.6, 'whoosh'], [2.2, 'ding']], draw: (c, l, y) => {
        const m = span(l, 1.5, 2.2, easeInOutQuint), a2 = span(l, 2.1, 2.5);
        [[b.a, -1], [b.b, 1]].forEach(([s, side], k) => { const x = XC + side*lerp(250, 0, m) - w/2;
          c.save(); c.globalAlpha *= 1 - a2; card(c, `${id}:${k}`, x, y + 20, w, 190, {u: span(l, k*.4, k*.4 + .4), fillC: k ? SKY : '#f9e6c2'});
          icon(c, 'doc', x + 70, y + 115, .6, span(l, k*.4 + .1, k*.4 + .6)); const L = rich(s, 32, w - 150, {w0: 700}); drawRich(c, L, x + 130, y + 115 - L.h/2, {color: INK}); c.restore(); });
        if (a2 > 0) { c.save(); c.globalAlpha *= a2; const W2 = 640, x = XC - W2/2, s2 = lerp(.9, 1, easeOutBack(a2)); c.translate(XC, y + 115); c.scale(s2, s2); c.translate(-XC, -y - 115);
          card(c, `${id}:m`, x, y + 20, W2, 190, {fillC: GRN2}); icon(c, 'shield', x + 90, y + 115, .72); const L = rich(b.c, 36, W2 - 190, {w0: 760}); drawRich(c, L, x + 170, y + 115 - L.h/2, {color: INK}); c.restore(); }
      }}; }},
  progress: {read: () => 5,
    layout: (b, sc, id) => { const h = 300, bh = 84, yb = 110;
      return {h, sfx: [[.2, 'tick'], [1.6, 'count'], [2.8, 'ding']], draw: (c, l, y) => {
        card(c, id, X0, y + yb, CW, bh, {r: 14, u: span(l, 0, .3), fillC: CARD});
        const f1 = b.from/100*span(l, .3, .9, easeOutQuint), f2 = lerp(b.from, b.to, span(l, 1.6, 2.8, easeInOutQuint))/100;
        c.save(); c.beginPath(); c.rect(X0 + 3, y + yb + 3, CW - 6, bh - 6); c.clip();
        if (l > 1.6) fillPts(c, [[X0, y + yb], [X0 + CW*f2, y + yb], [X0 + CW*f2, y + yb + bh], [X0, y + yb + bh]], TEAL, .9);
        fillPts(c, [[X0, y + yb], [X0 + CW*f1, y + yb], [X0 + CW*f1, y + yb + bh], [X0, y + yb + bh]], INK2, .95); c.restore();
        const xn = X0 + CW*b.from/100, xt = X0 + CW*b.to/100;
        label(c, `${b.a}: ${b.from}%`, xn - 20, y + yb + bh + 62, {size: 36, w: 800, color: INK2, alpha: span(l, .7, 1)});
        c.save(); c.globalAlpha *= span(l, .9, 1.2); c.setLineDash([12, 10]); c.strokeStyle = RED; c.lineWidth = 4; c.beginPath(); c.moveTo(xt, y + 70); c.lineTo(xt, y + yb + bh + 12); c.stroke(); c.restore();
        label(c, `${b.b}: ${b.to}%`, xt, y + 50, {size: 38, w: 800, color: RED, align: 'center', alpha: span(l, .9, 1.2)});
      }}; }},
  next: {read: () => 2.8,
    layout: (b, sc, id) => { const P = PARTS[b.n - 1], L = rich(P.title, 50, CW - 230, {w0: 600, fam: 'Fraunces'}), h = Math.max(200, L.h + 90);
      return {h, draw: (c, l, y) => {
        card(c, id, X0, y, CW, h, {u: span(l, 0, .4), fillC: SKY});
        fillPts(c, circ([X0 + 110, y + h/2], 70, 22), YEL, span(l, .1, .4), 4, 5);
        c.save(); c.translate(X0 + 110, y + h/2); inkReveal(c, celOf('bigbadge', () => [{pts: loopOf(circ([0, 0], 70, 22), 1.6, 8), w: 3.2}]), span(l, .1, .5), INK); c.restore();
        label(c, String(b.n), X0 + 110, y + h/2 + 34, {size: 96, w: 900, fam: 'Fraunces', align: 'center', alpha: span(l, .3, .5)});
        drawRich(c, L, X0 + 210, y + (h - L.h)/2, {color: INK, mode: 'none'});
      }}; }},
  series: {read: () => 2.4,
    layout: (b, sc, id) => { const rows = PARTS.map(P => `${P.n}. ${P.short}`), lh = 54, h = rows.length*lh;
      return {h, sfx: [], draw: (c, l, y) => rows.forEach((s, k) => { const a = span(l, k*.12, k*.12 + .3), n = k + 1, done = n <= b.cur, now = n === b.cur, yy = y + k*lh + 40;
        if (n === b.cur + 1) marker(c, X0 + 66, X0 + 80 + measure(s, 800, 34), yy - 28, yy + 8, YEL, 40 + k, .5*a);
        label(c, s, X0 + 74, yy, {size: 34, w: now || n === b.cur + 1 ? 800 : 500, color: done ? INK : MUTED, alpha: a});
        if (done) { c.save(); c.translate(X0 + 4, yy - 28); c.scale(.72, .72); c.globalAlpha *= a; inkReveal(c, TICK(), 1, GRN); c.restore(); }
      })}; }},
  stampBig: {read: () => 1.8,
    layout: (b, sc, id) => ({h: 150, sfx: [[.3, 'thud']], draw: (c, l, y) => stamp(c, b.s, b.color ?? GRN, b.size ?? 60, XC, y + 75, l - .3, (b.rot ?? -6)*DEG)})},
  gap: {read: () => 0, layout: b => ({h: b.h ?? 20, sfx: [], draw: () => {}})},
};

// ---------------------------------------------------------------- scenes
function timeScene(sc) {
  let t = .2; sc.tEye = t; if (sc.eyebrow) t += .4;
  sc.tTitle = t; if (sc.title) t += .5 + .28*words(sc.title);
  for (const b of sc.blocks ?? []) { b.t0 = t + (b.delay ?? 0); t = b.t0 + (b.par ? 0 : KINDS[b.t].read(b)); }
  sc.dur = sc.dur ?? t + (sc.hold ?? 1.5);
}
function layoutScene(sc) {
  const items = []; let h = 0;
  const push = (it, gap) => { if (items.length) h += gap; it.y = h; h += it.h; items.push(it); return it; };
  if (sc.eyebrow) {
    if (sc.date) { const w = measure(sc.eyebrow, 800, 32) + 100; push({h: 58, t0: sc.tEye, sfx: [], draw: (c, l, y) => { card(c, `${sc.key}:date`, X0, y, w, 58, {r: 29, u: span(l, 0, .3), fillC: YEL, width: 2.4}); calGlyph(c, X0 + 40, y + 30, 1); label(c, sc.eyebrow, X0 + 70, y + 41, {size: 32, w: 800}); }}, 0); }
    else push({h: 40, t0: sc.tEye, sfx: [], draw: (c, l, y) => label(c, sc.eyebrow.toUpperCase(), X0, y + 30, {size: 28, w: 800, color: TEAL, ls: '2.5px'})}, 0);
  }
  if (sc.title) {
    const tw = sc.icon ? CW - 220 : CW, L = rich(sc.title, sc.titleSize ?? (words(sc.title) <= 4 ? 72 : 64), tw, {w0: 600, w1: 700, fam: 'Fraunces', lh: 1.14});
    push({h: L.h + 34, t0: sc.tTitle, sfx: [], draw: (c, l, y) => {
      drawRich(c, L, X0, y, {color: INK, hl: TEAL, mode: 'color'});
      brush(c, `${sc.key}:ul`, X0, y + L.h + 18, X0 + 150, y + L.h + 16, span(l, .25, .55), sc.accent ?? YEL, 9);
      if (sc.icon) icon(c, sc.icon, X0 + CW - 95, y + L.h/2 + 6, sc.iconScale ?? .85, span(l, .1, .9));
    }}, sc.eyebrow ? 22 : 0);
  }
  let prevStep = null;
  (sc.blocks ?? []).forEach((b, k) => {
    const it = KINDS[b.t].layout(b, sc, `${sc.key}:${k}`); it.t0 = b.t0; it.b = b;
    push(it, b.gap ?? (items.length ? 34 : 0));
    if (b.t === 'step') { it.prev = prevStep; prevStep = it; } else prevStep = null;
  });
  const avail = BOT - TOP, k = Math.min(1, avail/h);
  if (k < 1) console.warn(`PF: ${sc.key} is ${Math.round(h)}px tall, scaled to ${k.toFixed(2)}`);
  window.__pfLayout = window.__pfLayout || {}; window.__pfLayout[sc.key] = {h: Math.round(h), k: +k.toFixed(3), dur: +sc.dur.toFixed(2)};
  return {items, h, k, y0: TOP + Math.max(0, (avail - h*k)/2)*.8};
}
function drawScene(c, sc, lt, fade) {
  const Lz = sc.L ??= layoutScene(sc), out = fade ? span(lt, sc.dur - .4, sc.dur, easeIn) : 0;
  c.save(); c.globalAlpha = 1 - out; c.translate(0, -36*out);
  c.translate(XC, Lz.y0); c.scale(Lz.k, Lz.k); c.translate(-XC, 0);
  for (const it of Lz.items) { const l = lt - it.t0; if (l < 0) continue; const a = span(l, 0, .35, easeOut); c.save(); c.globalAlpha *= a; c.translate(0, 24*(1 - a)); it.draw(c, l, it.y); c.restore(); }
  c.restore();
}
// Cover: the part number in a drawn ring, the part's picture, the title.
function coverScene(P) {
  const sc = {key: `p${P.n}cover`, cover: true, dur: P.n === 1 ? 7.4 : 5.4, blocks: []};
  sc.draw = (c, lt) => {
    const out = span(lt, sc.dur - .4, sc.dur, easeIn); c.save(); c.globalAlpha = 1 - out; c.translate(0, -36*out);
    if (!sc.L) { sc.L = {T: rich(P.title, 80, CW, {w0: 600, w1: 700, fam: 'Fraunces', align: 'center', lh: 1.12}), S: rich(P.sub, 38, CW - 60, {align: 'center'})}; }
    const {T, S: Sb} = sc.L;
    label(c, P.n === 1 ? "BOJXONA ISLOHOTI · SODDA TILDA" : 'BOJXONA ISLOHOTI · PF-174', XC, 330, {size: 30, w: 800, color: TEAL, align: 'center', ls: '3px', alpha: span(lt, .1, .4)});
    const a = span(lt, .25, .7, easeOutBack);
    fillPts(c, circ([XC, 540], 128, 26), YEL, span(lt, .3, .6), 6, 7);
    c.save(); c.translate(XC, 540); inkReveal(c, celOf('coverRing', () => [{pts: loopOf(circ([0, 0], 128, 26), 2.2, 11, 30), w: 4.2}]), span(lt, .2, .75), INK); c.restore();
    c.save(); c.translate(XC, 540); c.scale(a, a); label(c, String(P.n), 0, 64, {size: 190, w: 900, fam: 'Fraunces', align: 'center'}); c.restore();
    label(c, `${P.n}-QISM · 6 QISMDAN`, XC, 725, {size: 30, w: 800, color: INK2, align: 'center', ls: '3px', alpha: span(lt, .5, .8)});
    const u = span(lt, .6, 1.5);
    if (P.icon === 'gate') {
      c.save(); c.translate(XC + 20, 990); c.scale(1.25, 1.25);
      icon(c, 'gatePost', 0, 0, 1, u); const lift = span(lt, 1.8, 2.6, easeInOutQuint);
      icon(c, 'gateArm', -86, -4, 1, span(lt, .9, 1.6), -lift*52*DEG); c.restore();
    } else icon(c, P.icon, XC, 960, 1.45, u);
    drawRich(c, T, X0, 1150, {color: INK, alpha: span(lt, .9, 1.3), mode: 'color', hl: TEAL});
    drawRich(c, Sb, X0 + 30, 1150 + T.h + 30, {color: MUTED, hl: INK2, alpha: span(lt, 1.3, 1.7), mode: 'color'});
    if (P.n === 1) {
      const y = 1150 + T.h + 30 + Sb.h + 40, s = uz('Prezident Farmoni · 27.08.2026'), w = measure(s, 700, 32) + 60;
      const a2 = span(lt, 2.2, 2.6); card(c, 'cover:chip', XC - w/2, y, w, 60, {r: 30, u: a2, fillC: SKY, width: 2.4}); label(c, s, XC, y + 41, {size: 32, w: 700, align: 'center', alpha: a2});
    }
    c.restore();
  };
  return sc;
}
function outroScene(P, full = false) {
  const last = P.n === PARTS.length;
  if (full) return {eyebrow: 'Yakun', title: 'Rahmat!', blocks: [{t: 'text', s: "Videoda ko'rib chiqilgan mavzular:", size: 36, color: MUTED}, {t: 'series', cur: P.n, gap: 20}, {t: 'note', s: DISCLAIMER}], hold: 3.6, outro: true};
  return last ? {eyebrow: 'Seriya yakuni', title: 'Rahmat!', blocks: [{t: 'text', s: "Seriyaning barcha qismlari:", size: 36, color: MUTED}, {t: 'series', cur: P.n, gap: 20}, {t: 'note', s: DISCLAIMER}], hold: 3.2, outro: true}
    : {eyebrow: 'Seriya davom etadi', title: 'Keyingi qism', blocks: [{t: 'next', n: P.n + 1}, {t: 'series', cur: P.n}, {t: 'note', s: DISCLAIMER}], hold: 2.4, outro: true};
}

// ---------------------------------------------------------------- frame
// The "shopo" wordmark: lowercase, tight, the last o in teal and a yellow dot.
function logo(c, x, y, size = 44, ink = INK) {
  c.save(); font(c, 800, size, 'Onest', (-.05*size).toFixed(1) + 'px'); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  const w1 = c.measureText('shop').width, w2 = c.measureText('o').width;
  c.fillStyle = ink; c.fillText('shop', x, y); c.fillStyle = TEAL; c.fillText('o', x + w1, y);
  c.fillStyle = YEL; c.beginPath(); c.arc(x + w1 + w2 + size*.15, y - size*.09, size*.11, 0, TAU); c.fill();
  c.restore(); return w1 + w2 + size*.26;
}
function header(c, P, t, dur) {
  const lw = logo(c, X0, 134, 46);
  c.save(); c.fillStyle = LINE; c.fillRect(X0 + lw + 20, 100, 3, 40); c.restore();
  label(c, 'PF-174 · Bojxona islohoti', X0 + lw + 42, 130, {size: 28, w: 700, color: INK2});
  label(c, `${P.n}/${PARTS.length}`, X0 + CW, 130, {size: 30, w: 800, color: INK2, align: 'right'});
  for (let k = 0; k < PARTS.length; k++) { const x = X0 + CW - 90 - (PARTS.length - 1 - k)*28, n = k + 1; c.save(); c.beginPath(); c.arc(x, 120, n === P.n ? 10 : 7, 0, TAU);
    if (n <= P.n) { c.fillStyle = n === P.n ? YEL : TEAL; c.fill(); } c.strokeStyle = n <= P.n ? INK : LINE; c.lineWidth = 2.4; c.stroke(); c.restore(); }
  c.save(); c.fillStyle = LINE; c.fillRect(X0, 172, CW, 5); c.fillStyle = TEAL; c.fillRect(X0, 172, CW*clamp(t/dur, 0, 1), 5); c.restore();
}
function footer(c) { label(c, 'Manba: Prezident Farmoni PF-174, 27.08.2026', XC, 1808, {size: 26, w: 500, color: MUTED, align: 'center'}); }

// ---------------------------------------------------------------- sound
// Every sound cue comes from the same timings as the pictures (sound.js).
function soundEvents(scenes) {
  const ev = [];
  for (const sc of scenes) {
    if (sc.cover) { ev.push({t: sc.start + .25, kind: 'sting'}); if (sc.P.icon === 'gate') ev.push({t: sc.start + 2.55, kind: 'gate'}); continue; }
    ev.push({t: sc.start + .05, kind: 'sweep'});
    for (const it of sc.L.items) for (const [dt, kind] of it.sfx ?? [[0, 'tick']]) ev.push({t: sc.start + it.t0 + dt, kind});
  }
  return ev;
}

// ---------------------------------------------------------------- film
let PARTS = [];
// film(n): one part (cover, its scenes, a "next part" card).
// film('all'): the whole series as one film — the part covers become chapter
// cards, the in-between "next part" cards go, the music runs through.
function film(n) {
  PARTS = PF_PARTS;
  const full = n === 'all', list = full ? PARTS : [PARTS[n - 1]], scenes = [];
  for (const P of list) {
    const tag = (sc, i) => Object.assign(sc, {P, vo: `${P.n}-${String(i + 1).padStart(2, '0')}`});   // vo: the scene's line in diktor-vo.mjs
    scenes.push(tag(coverScene(P), 0));
    P.scenes.forEach((sc, i) => scenes.push(tag(sc, i + 1)));
    if (!full || P.n === PARTS.length) scenes.push(tag(outroScene(P, full), P.scenes.length + 1));
  }
  let t = 0;
  scenes.forEach((sc, i) => { sc.key = sc.key ?? `${full ? 'f' : 'p'}${sc.P.n}s${i}`; sc.idx = i; if (!sc.cover) timeScene(sc); sc.start = t; t += sc.dur; });
  const total = t, last = scenes[scenes.length - 1];
  window.__pfScenes = scenes.map(s => ({key: s.key, vo: s.vo, part: s.P.n, start: +s.start.toFixed(2), dur: +s.dur.toFixed(2), title: s.title ?? (s.cover ? 'cover' : '')}));
  function shot(c, tau) {
    const t = Math.round(tau*FPS)/FPS;
    paper(c, PAPER, null, 7);
    const sc = scenes.find(s => t < s.start + s.dur) ?? last, lt = t - sc.start;
    if (sc.cover) sc.draw(c, lt); else drawScene(c, sc, lt, sc !== last);
    header(c, sc.P, t, total); footer(c);
  }
  // Layouts need the fonts; the score needs the layouts. Both wait for the fonts.
  const breaks = scenes.filter(s => s.cover && s.start > 0).map(s => [s.start, s.start + s.dur]);
  const score = (ac, t0, dest) => { scenes.forEach(sc => { if (!sc.cover) sc.L ??= layoutScene(sc); });
    return PF_SOUND.score({total, introEnd: scenes[0].dur, outroStart: last.start, events: soundEvents(scenes), breaks})(ac, t0, dest); };
  defineFilm({palette: {...PALETTES.pencilMinimal, paper: PAPER}, format: {ar: '9:16', width: 1080}, fps: 24, timeline: [{name: `pf174-${n}`, dur: total, fn: shot}], score});
  Promise.all(_photoLoads).then(() => document.fonts.ready).then(() => scenes.forEach(sc => { if (!sc.cover) sc.L ??= layoutScene(sc); }));
}
return {film, uz, logo, C: {PAPER, INK, INK2, MUTED, TEAL, TEAL2, YEL, RED, GRN, GRN2, CARD, LINE, SKY}};
})();

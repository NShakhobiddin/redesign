// 3D scenes of the video (three.js, rendered offscreen and drawn into the overlay canvas):
//   route(t, ev)  — the passenger's way through the terminal, with a dot travelling along it;
//   pin(t, ev)    — the same map, close on one station ("the kassa is here");
//   days(t, ev)   — three day pages: at least 3 days abroad;
//   month(t, ev)  — a month with arrivals: the 3rd arrival in a month loses the norm.
import * as THREE from './node_modules/three/build/three.module.js';

const COL = {floor: 0x08251c, zone: 0x0d4a37, hall: 0x11634a, path: 0x3ee0a8, gold: 0xf5b731, red: 0xe5484d,
  white: 0xf4f7f5, ink: 0x0f1a16, steel: 0x9fb3ab};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const eb = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const io = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

let R, W, H, canvas;
export function init(w, h) {
  W = w; H = h; canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  R = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, preserveDrawingBuffer: true});
  R.setPixelRatio(1); R.setSize(w, h, false); R.setClearColor(0x000000, 0);
  R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  buildRoute(); buildDays(); buildMonth();
  return canvas;
}

// ---------------------------------------------------------------- helpers
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({color: c, roughness: .55, metalness: .05, ...o});
function lights(scene) {
  scene.add(new THREE.HemisphereLight(0xdff7ee, 0x0a2a20, 1.1));
  const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(4, 9, 6); scene.add(d);
  const f = new THREE.DirectionalLight(0x9fe8cf, .6); f.position.set(-6, 3, -4); scene.add(f);
}
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function shadowDisc(r) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 62); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false}));
  m.rotation.x = -Math.PI / 2; m.position.y = .01; return m;
}

// ---------------------------------------------------------------- route map
const ST = [   // stations: position on the floor, label, icon
  {p: [-5.2, 0, 7.6], t: 'Samolyot', icon: 'plane'},
  {p: [-3.4, 0, 3.6], t: 'Bagaj zali', sub: 'deklaratsiya shu yerda', icon: 'bag', n: '1'},
  {p: [0, 0, 0], t: 'Bojxona nazorati', sub: 'QR-kod', icon: 'gate', n: '2'},
  {p: [3.2, 0, -2.6], t: "To'lovlar kassasi", sub: 'kelish zali', icon: 'kassa', n: '3'},
  {p: [1.0, 0, -5.8], t: 'Bojxona servis', sub: 'kelish zali · UZ IMEI', icon: 'servis', n: '4'},
  {p: [4.6, 0, -8.6], t: 'Chiqish', icon: 'exit', n: '5'},
];
const RT = {};
function icon(kind) {
  const g = new THREE.Group(), white = mat(COL.white), green = mat(0x0b5a43), mint = mat(COL.path, {emissive: 0x0f5a43});
  if (kind === 'plane') {
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(.22, 1.4, 6, 16), white); body.rotation.z = Math.PI / 2; g.add(body);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, 1.9), white); g.add(wing);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(.3, .5, .05), mint); tail.position.set(-.75, .3, 0); g.add(tail);
    g.position.y = .9; g.rotation.y = -.75;
  } else if (kind === 'bag') {
    const b = new THREE.Mesh(new THREE.BoxGeometry(.7, .9, .4), mat(0x2a8c8c)); b.position.y = .6; g.add(b);
    const h = new THREE.Mesh(new THREE.TorusGeometry(.16, .04, 8, 20, Math.PI), mat(0x222222)); h.position.y = 1.08; g.add(h);
    const belt = new THREE.Mesh(new THREE.TorusGeometry(1.0, .12, 8, 40), mat(0x1c2522)); belt.rotation.x = Math.PI / 2; belt.position.y = .15; g.add(belt);
  } else if (kind === 'gate') {
    for (const x of [-.6, .6]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.18, 1.4, .5), white); p.position.set(x, .7, 0); g.add(p); }
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, .22, .55), green); top.position.y = 1.45; g.add(top);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(.9, .6, .45), white); desk.position.set(1.4, .3, 0); g.add(desk);
  } else if (kind === 'kassa' || kind === 'servis') {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.5, .75, .7), white); desk.position.y = .38; g.add(desk);
    const sign = new THREE.Mesh(new THREE.BoxGeometry(1.4, .45, .06), kind === 'kassa' ? mat(COL.gold) : mat(0x111111));
    sign.position.set(0, 1.55, -.2); g.add(sign);
    for (const x of [-.6, .6]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .8), mat(COL.steel)); r.position.set(x, 1.15, -.2); g.add(r); }
    const scr = new THREE.Mesh(new THREE.BoxGeometry(.4, .3, .04), mint); scr.position.set(.3, .95, .1); scr.rotation.x = -.3; g.add(scr);
  } else if (kind === 'exit') {
    const fr = new THREE.Mesh(new THREE.TorusGeometry(.7, .1, 8, 24, Math.PI), green); fr.position.y = .8; g.add(fr);
    for (const x of [-.7, .7]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.2, .8, .2), green); p.position.set(x, .4, 0); g.add(p); }
    const ar = new THREE.Mesh(new THREE.ConeGeometry(.25, .5, 3), mint); ar.rotation.z = -Math.PI / 2; ar.position.set(0, .7, 0); g.add(ar);
  }
  return g;
}
function buildRoute() {
  const s = new THREE.Scene(); lights(s); RT.scene = s;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat(COL.floor, {roughness: .9})); floor.rotation.x = -Math.PI / 2; s.add(floor);
  // zones: baggage hall, control line, arrivals hall
  const zone = (x, z, w, d, c, ry = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .06, d), mat(c, {roughness: .8}));
    m.position.set(x, .03, z); m.rotation.y = ry; s.add(m); return m; };
  zone(-3.6, 4.2, 5.2, 5.2, COL.zone, .45);
  zone(2.8, -5.4, 6.6, 7.4, COL.hall, .45);
  const line = new THREE.Mesh(new THREE.BoxGeometry(9, .08, .14), mat(COL.gold, {emissive: 0x332200})); line.position.set(0.2, .05, -.9); line.rotation.y = .45; s.add(line);
  RT.hall = new THREE.Vector3(5.2, .2, -4.6);
  // path
  const pts = ST.map(q => new THREE.Vector3(q.p[0], .12, q.p[2]));
  RT.curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .3);
  const tube = new THREE.TubeGeometry(RT.curve, 400, .09, 10, false);
  RT.tube = new THREE.Mesh(tube, new THREE.MeshStandardMaterial({color: COL.path, emissive: 0x1d8c66, roughness: .4}));
  RT.tubeCount = tube.index.count; s.add(RT.tube);
  RT.dot = new THREE.Mesh(new THREE.SphereGeometry(.26, 24, 16), new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x3ee0a8, emissiveIntensity: .8}));
  s.add(RT.dot);
  RT.ring = new THREE.Mesh(new THREE.RingGeometry(.35, .45, 40), new THREE.MeshBasicMaterial({color: COL.path, transparent: true, side: THREE.DoubleSide}));
  RT.ring.rotation.x = -Math.PI / 2; s.add(RT.ring);
  RT.st = ST.map(q => {
    const g = new THREE.Group(); g.position.set(...q.p);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, .16, 48), mat(0xffffff, {roughness: .35})); base.position.y = .08; g.add(base);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.15, .04, 8, 48), mat(COL.path, {emissive: 0x1d8c66})); rim.rotation.x = Math.PI / 2; rim.position.y = .17; g.add(rim);
    g.add(shadowDisc(1.8)); const ic = icon(q.icon); ic.position.y += .16; g.add(ic);
    s.add(g); return {g, icon: ic};
  });
  RT.pin = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(.42, 24, 16), mat(COL.red, {emissive: 0x551111})); head.position.y = .9;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(.3, .8, 24), mat(COL.red)); tip.rotation.x = Math.PI; tip.position.y = .35;
  RT.pin.add(head, tip); RT.pin.visible = false; s.add(RT.pin);
  RT.cam = new THREE.PerspectiveCamera(46, W / H, .1, 200);
}
// progress u (0..1 along the path) for each station
const U = ST.map((q, i) => i / (ST.length - 1));
function placeDot(u) { const p = RT.curve.getPointAt(clamp(u)); RT.dot.position.set(p.x, .38, p.z); RT.ring.position.set(p.x, .14, p.z); return p; }

// t: seconds; ev: {t0, t1, at:[times when the dot reaches stations 1..5]}
export function route(t, ev) {
  const {t0, t1, at} = ev;
  // dot progress: piecewise between station arrival times
  const times = [t0 + .3, ...at];
  let u = 0;
  for (let i = 0; i < times.length - 1; i++) {
    if (t >= times[i]) u = U[i] + (U[i + 1] - U[i]) * io((t - times[i]) / Math.max(.4, times[i + 1] - times[i]));
  }
  const p = placeDot(u);
  RT.tube.geometry.setDrawRange(0, Math.floor(RT.tubeCount * clamp(u + .004) / 6) * 6);
  RT.ring.scale.setScalar(1 + .5 * ((t * 1.6) % 1)); RT.ring.material.opacity = 1 - ((t * 1.6) % 1);
  RT.st.forEach((s, i) => { const k = clamp((t - (i === 0 ? t0 : times[i] - .35)) / .45); s.g.scale.setScalar(Math.max(1e-3, .6 + .4 * eb(k))); s.g.visible = k > 0; });
  RT.pin.visible = false;
  // camera: overview at start, follows the dot, pulls back at the end
  const intro = io((t - t0) / 1.4), outro = io((t - (t1 - 1.8)) / 1.5);
  const follow = new THREE.Vector3(p.x - 6.5, 12.5, p.z + 11.5);
  const over = new THREE.Vector3(-4, 30, 20), look = new THREE.Vector3(p.x * .8, 0, p.z * .8);
  const pos = over.clone().lerp(follow, intro).lerp(new THREE.Vector3(-4, 27, 15), outro);
  RT.cam.position.copy(pos); RT.cam.lookAt(look.lerp(new THREE.Vector3(.2, 0, -.8), outro));
  R.render(RT.scene, RT.cam); project(RT.cam, times); return canvas;
}
// screen positions of the stations for the 2D labels
export const proj = {st: [], hall: null, flags: []};
function toScreen(v, cam) { const q = v.clone().project(cam); return {x: (q.x + 1) / 2 * W, y: (1 - q.y) / 2 * H, on: q.z < 1}; }
function project(cam, times) {
  proj.st = ST.map((q, i) => ({...toScreen(new THREE.Vector3(q.p[0], 1.9, q.p[2]), cam), t: q.t, sub: q.sub || '', n: q.n || '', at: times ? times[i] : -1}));
  proj.hall = toScreen(RT.hall, cam);
}
// close view of one station with a bouncing pin
export function pin(t, ev) {
  const {t0, t1, station} = ev, q = ST[station];
  placeDot(U[station]); RT.tube.geometry.setDrawRange(0, Infinity);
  RT.st.forEach(s => { s.g.visible = true; s.g.scale.setScalar(1); });
  RT.pin.visible = true; const b = Math.abs(Math.sin((t - t0) * 4)) * .5 * Math.exp(-(t - t0) * .8);
  RT.pin.position.set(q.p[0] + .9, 1.6 + b, q.p[2] + .2); RT.pin.scale.setScalar(eb(clamp((t - t0 - .3) / .4)) || 1e-3);
  const a = io((t - t0) / 1.4), orbit = (t - t0) * .1;
  const far = new THREE.Vector3(-4, 27, 15), near = new THREE.Vector3(q.p[0] - 5.5 * Math.cos(orbit), 8.5, q.p[2] + 8.5);
  RT.cam.position.copy(far.lerp(near, a)); RT.cam.lookAt(new THREE.Vector3(q.p[0], .6, q.p[2] - .4));
  R.render(RT.scene, RT.cam); project(RT.cam, null); return canvas;
}

// ---------------------------------------------------------------- three days abroad
const DY = {};
function dayPage(n, sub) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 600; const x = c.getContext('2d');
  rrect(x, 0, 0, 512, 600, 48); x.fillStyle = '#ffffff'; x.fill();
  x.fillStyle = '#0b5a43'; rrect(x, 0, 0, 512, 150, 48); x.fill(); x.fillRect(0, 100, 512, 50);
  x.fillStyle = '#fff'; x.font = '800 64px Onest'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(sub, 256, 80);
  x.fillStyle = '#0f1a16'; x.font = '800 300px Onest'; x.fillText(n, 256, 390);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function buildDays() {
  const s = new THREE.Scene(); lights(s); DY.scene = s;
  DY.pages = [1, 2, 3].map((n, i) => {
    const g = new THREE.Group();
    const page = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.46, .12), [mat(COL.white), mat(COL.white), mat(COL.white), mat(COL.white),
      new THREE.MeshStandardMaterial({map: dayPage(String(n), 'kun'), roughness: .5}), mat(COL.white)]);
    page.position.y = 1.23; g.add(page); g.position.set((i - 1) * 1.25, (1 - i) * 1.75, i * .5); s.add(g); return g;
  });
  DY.plane = icon('plane'); DY.plane.scale.setScalar(.9); s.add(DY.plane);
  DY.check = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, .18, 48), mat(COL.path, {emissive: 0x1d8c66})); disc.rotation.x = Math.PI / 2; DY.check.add(disc);
  const a = new THREE.Mesh(new THREE.BoxGeometry(.18, .55, .2), mat(0xffffff)); a.position.set(-.18, -.05, .12); a.rotation.z = .8; DY.check.add(a);
  const b = new THREE.Mesh(new THREE.BoxGeometry(.18, 1.0, .2), mat(0xffffff)); b.position.set(.18, .12, .12); b.rotation.z = -.62; DY.check.add(b);
  DY.check.position.set(1.6, -2.2, 3.0); DY.check.scale.setScalar(.8); s.add(DY.check);
  DY.cam = new THREE.PerspectiveCamera(40, W / H, .1, 100);
}
export function days(t, ev) {
  const {t0, t1, pages, ok} = ev;   // pages: times the 3 pages flip up; ok: time of the check
  DY.pages.forEach((g, i) => { const k = clamp((t - pages[i]) / .55); g.rotation.x = -(1 - eb(k)) * Math.PI / 2; g.visible = k > 0; });
  const pk = clamp((t - pages[0] + .3) / (pages[2] - pages[0] + .9));
  DY.plane.position.set(-3.0 + 5.4 * io(pk), 4.0 - 3.6 * io(pk) + Math.sin(pk * Math.PI) * .6, 2.2); DY.plane.rotation.set(0, 0, -.5);
  const ck = clamp((t - ok) / .45); DY.check.scale.setScalar(.8 * eb(ck) || 1e-3); DY.check.visible = ck > 0;
  const orbit = Math.sin((t - t0) * .5) * .22;
  DY.cam.position.set(Math.sin(orbit) * 15, 2.0, Math.cos(orbit) * 15); DY.cam.lookAt(0, 1.2, .5);
  R.render(DY.scene, DY.cam); return canvas;
}

// ---------------------------------------------------------------- a month of arrivals
const MO = {};
function buildMonth() {
  const s = new THREE.Scene(); lights(s); MO.scene = s;
  const board = new THREE.Mesh(new THREE.BoxGeometry(8.2, .25, 6.4), mat(COL.white, {roughness: .4})); board.position.y = -.13; s.add(board);
  const top = new THREE.Mesh(new THREE.BoxGeometry(8.2, .3, 1.0), mat(0x0b5a43)); top.position.set(0, .02, -3.7); s.add(top);
  MO.tiles = [];
  for (let d = 0; d < 30; d++) {
    const r = Math.floor(d / 7), c = d % 7;
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.0, .12, .95), mat(0xe8eeeb));
    m.position.set(-3.3 + c * 1.1, .06, -2.5 + r * 1.15); s.add(m);
    const tx = document.createElement('canvas'); tx.width = tx.height = 128; const x = tx.getContext('2d');
    x.fillStyle = '#3d4d46'; x.font = '700 64px Onest'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(d + 1), 64, 68);
    const tex = new THREE.CanvasTexture(tx); tex.colorSpace = THREE.SRGBColorSpace;
    const num = new THREE.Mesh(new THREE.PlaneGeometry(.62, .62), new THREE.MeshBasicMaterial({map: tex, transparent: true}));
    num.rotation.x = -Math.PI / 2; num.position.set(m.position.x, .125, m.position.z); s.add(num);
    MO.tiles.push(m);
  }
  MO.flags = [3, 13, 24].map((d, i) => {
    const g = new THREE.Group(), red = i === 2, c = red ? COL.red : COL.path;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.3), mat(0x333333)); pole.position.y = .65; g.add(pole);
    const fl = new THREE.Mesh(new THREE.BoxGeometry(.62, .4, .04), mat(c, {emissive: red ? 0x441111 : 0x0f5a43})); fl.position.set(.33, 1.08, 0); g.add(fl);
    const t = MO.tiles[d - 1].position; g.position.set(t.x, .12, t.z); s.add(g);
    return {g, d};
  });
  MO.cam = new THREE.PerspectiveCamera(42, W / H, .1, 100);
}
export function month(t, ev) {
  const {t0, short, flags} = ev;   // short: time the 2-day trip lights red; flags: times of the 3 arrivals
  MO.tiles.forEach(m => m.material.color.setHex(0xe8eeeb));
  const sk = clamp((t - short) / .3);
  if (t >= short && t < flags[0] + .2) for (const d of [7, 8]) MO.tiles[d].material.color.lerpColors(new THREE.Color(0xe8eeeb), new THREE.Color(COL.red), sk);
  MO.flags.forEach((f, i) => { const k = clamp((t - flags[i]) / .45); f.g.visible = k > 0; f.g.position.y = .12 + (1 - eo(k)) * 2.5;
    if (k > 0) MO.tiles[f.d - 1].material.color.setHex(i === 2 ? COL.red : 0xbff3df); });
  const a = io((t - t0) / 1.2), orbit = (t - t0) * .05;
  MO.cam.position.set(Math.sin(orbit) * 2.5, 18.5 - 1.5 * a, 12.5 - 1.2 * a); MO.cam.lookAt(0, 0, -.6);
  R.render(MO.scene, MO.cam);
  proj.flags = MO.flags.map((f, i) => ({...toScreen(new THREE.Vector3(f.g.position.x, 1.6, f.g.position.z), MO.cam), at: flags[i]}));
  return canvas;
}

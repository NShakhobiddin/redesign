// Sound for the PF-174 series, all synthesized here with Web Audio: no samples,
// no licensed music. A quiet background track (C major, 100 BPM:
// Cadd9 – G/B – Am7 – Fmaj7) and sound effects tuned to the same key, so every
// tick, stamp and chime sits inside the music instead of on top of it.
// Load after core.js; series.js calls PF_SOUND.score(...).
'use strict';
const PF_SOUND = (() => {
const BPM = 100, BEAT = 60/BPM, BAR = 4*BEAT;
const mtof = m => 440*Math.pow(2, (m - 69)/12);
const PROG = [
  {pad: [55, 60, 62, 64], bass: 48, arp: [67, 72, 74, 76], top: 76},   // Cadd9
  {pad: [55, 59, 62, 67], bass: 47, arp: [67, 71, 74, 79], top: 74},   // G/B
  {pad: [57, 60, 64, 67], bass: 45, arp: [69, 72, 76, 79], top: 76},   // Am7
  {pad: [53, 57, 60, 64], bass: 41, arp: [65, 69, 72, 76], top: 72},   // Fmaj7
];
const ARP = [[0, 1, 2, 3, 2, 1, 2, 3], [0, 2, 1, 3, 0, 2, 3, 1]], VEL = [1, .55, .8, .55, .9, .55, .8, .6];
const SCALE = [60, 62, 64, 67, 69];                                   // C major pentatonic
const pent = (i, oct = 0) => SCALE[((i % 5) + 5) % 5] + 12*oct;

// ---------------------------------------------------------------- instruments
function kit(ac) {
  const sr = ac.sampleRate, noise = ac.createBuffer(1, sr*2, sr), nd = noise.getChannelData(0), r = rng(911);
  for (let i = 0; i < nd.length; i++) nd[i] = r()*2 - 1;
  // attack to a peak, then an exponential fall; always from and to silence (no clicks)
  const env = (p, t, a, peak, d) => { p.setValueAtTime(0, t); p.linearRampToValueAtTime(peak, t + a); p.exponentialRampToValueAtTime(.0001, t + a + d); p.setValueAtTime(0, t + a + d + .01); };
  const tone = (type, f, t, d, dest, gain, a = .004) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; env(g.gain, t, a, gain, d); o.connect(g); g.connect(dest); o.start(t); o.stop(t + a + d + .05); return o; };
  const noiseHit = (t, d, dest, {gain = .1, type = 'bandpass', f = 2000, f1 = 0, q = .7, a = .002, seed = 0} = {}) => {
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = noise;
    fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f, t); if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t + a + d);
    env(g.gain, t, a, gain, d); s.connect(fl); fl.connect(g); g.connect(dest); s.start(t, (seed*.137) % 1.4, a + d + .05);
  };
  // struck wood: fundamental plus the bar's 4th partial, which dies first
  const marimba = (f, t, dest, gain, d = .32) => { tone('sine', f, t, d, dest, gain, .003); tone('sine', f*3.93, t, d*.3, dest, gain*.22, .002); };
  // soft FM chime (harmonic ratio, falling brightness)
  const bell = (f, t, dest, gain, d = 1.2) => {
    const c = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
    c.frequency.value = f; m.frequency.value = f*2; mg.gain.setValueAtTime(f*1.6, t); mg.gain.exponentialRampToValueAtTime(f*.02, t + d);
    m.connect(mg); mg.connect(c.frequency); env(g.gain, t, .003, gain, d); c.connect(g); g.connect(dest);
    c.start(t); m.start(t); c.stop(t + d + .1); m.stop(t + d + .1);
  };
  // pitched thump: a kick drum, a stamp, a cover's boom
  const thump = (t, dest, gain, f0 = 140, f1 = 48, d = .32) => {
    const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + d*.4);
    env(g.gain, t, .002, gain, d); o.connect(g); g.connect(dest); o.start(t); o.stop(t + d + .05);
  };
  const reverb = (seconds, decay, seed) => {
    const len = Math.ceil(sr*seconds), b = ac.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch), rr = rng(seed + ch); for (let i = 0; i < len; i++) d[i] = (rr()*2 - 1)*Math.pow(1 - i/len, decay); }
    const cv = ac.createConvolver(); cv.buffer = b; return cv;
  };
  const gain = (v, dest) => { const g = ac.createGain(); g.gain.value = v; if (dest) g.connect(dest); return g; };
  const filter = (type, f, q, dest) => { const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; if (dest) fl.connect(dest); return fl; };
  return {env, tone, noiseHit, marimba, bell, thump, reverb, gain, filter};
}

// ---------------------------------------------------------------- background track
// Intro (cover): pad, sparse plucks. Body: bass, eighth-note plucks, a soft
// kick / finger-snap / hat groove. Outro card: the groove drops out and the
// last chord rings into the fade.
function music(ac, K, out, t0, total, introEnd, outroStart) {
  const bus = K.gain(1, out);
  bus.gain.setValueAtTime(0, t0); bus.gain.linearRampToValueAtTime(1, t0 + 1.5);
  bus.gain.setValueAtTime(1, t0 + total - 2.6); bus.gain.linearRampToValueAtTime(0, t0 + total - .05);
  const pads = K.gain(1, K.filter('lowpass', 1100, .4, bus)), bassBus = K.gain(1, K.filter('lowpass', 700, .5, bus)), drums = K.gain(.8, bus);
  const plucks = K.gain(1, K.filter('lowpass', 3200, .5, bus));
  const dly = ac.createDelay(2), fb = K.gain(.3), wet = K.gain(.2, bus), dlp = K.filter('lowpass', 2400, .5);   // dotted-eighth echo on the plucks
  dly.delayTime.value = BEAT*.75; plucks.connect(dly); dly.connect(dlp); dlp.connect(fb); fb.connect(dly); dlp.connect(wet);
  const bars = Math.floor((total - 1.5)/BAR) + 1;
  for (let b = 0; b < bars; b++) {
    const s = b*BAR, tb = t0 + s, ch = PROG[b % 4], lastBar = s + BAR >= total - 1.5;
    const body = s >= introEnd - .01 && s < outroStart - BAR*.5, intro = s < introEnd - .01;
    // pad: two detuned saws per note, slow swell, overlapping release
    const hold = lastBar ? total - s : BAR;
    for (const m of ch.pad) for (const det of [-8, 8]) {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det;
      g.gain.setValueAtTime(0, tb); g.gain.linearRampToValueAtTime(.011, tb + .7); g.gain.setValueAtTime(.011, tb + hold - .05); g.gain.linearRampToValueAtTime(0, tb + hold + (lastBar ? 0 : 1.1));
      o.connect(g); g.connect(pads); o.start(tb); o.stop(tb + hold + 1.2);
    }
    if (lastBar) { K.bell(mtof(72), tb + .02, bus, .03, 2.6); K.bell(mtof(79), tb + .1, bus, .02, 2.6); break; }
    // bass: root on 1 and 3 (whole notes in the intro and outro)
    if (body) for (const beat of [0, 2, 3.5]) { const f = mtof(ch.bass), d = beat === 3.5 ? BEAT*.45 : BEAT*1.6;
      K.tone('triangle', f, tb + beat*BEAT, d, bassBus, beat === 3.5 ? .06 : .1, .01); K.tone('sine', f/2, tb + beat*BEAT, d, bassBus, beat === 3.5 ? .02 : .035, .01); }
    else K.tone('triangle', mtof(ch.bass), tb, BAR*.9, bassBus, .06, .08);
    // plucks: eighths in the body, quarters around it
    const pat = ARP[(b >> 1) % 2];
    for (let i = 0; i < 8; i++) { if (!body && i % 2) continue; const t = tb + i*BEAT/2;
      K.tone('triangle', mtof(ch.arp[pat[i]]), t, .42, plucks, .045*VEL[i]*(body ? 1 : .8)); }
    if (b % 2 === 0) K.bell(mtof(ch.top + 12), tb, bus, intro ? .018 : .012, 1.8);
    // groove, body only: soft kick on 1 and 3, finger snap on 2 and 4, hats on eighths
    if (!body) continue;
    const fill = b % 8 === 7;
    for (const beat of [0, 2]) K.thump(tb + beat*BEAT, drums, .22, 140, 58, .26);
    for (const beat of [1, 3]) { K.noiseHit(tb + beat*BEAT, .09, drums, {gain: .09, f: 2300, q: 1.4, seed: b*4 + beat}); K.noiseHit(tb + beat*BEAT + .012, .07, drums, {gain: .05, f: 1600, q: 1, seed: b*4 + beat + 2}); }
    for (let i = 0; i < (fill ? 12 : 8); i++) { const step = fill && i >= 6 ? 6 + (i - 6)*.5 : i, t = tb + step*BEAT/2;
      K.noiseHit(t, .035, drums, {gain: step % 1 || (i % 2) ? .028 : .016, type: 'highpass', f: 8000, q: .5, seed: b*16 + i}); }
  }
}

// ---------------------------------------------------------------- effects
const FX = {
  // a card lands: a woody note in key and a little air
  tick: (ac, K, o, t, k) => { K.marimba(mtof(pent(k*2, 1)), t, o, .06); K.noiseHit(t, .08, o, {gain: .02, f: 3500, q: 1.2, seed: k}); },
  pop: (ac, K, o, t, k) => { const f = mtof(pent(k, 1)), osc = ac.createOscillator(), g = ac.createGain(); osc.frequency.setValueAtTime(f*1.7, t); osc.frequency.exponentialRampToValueAtTime(f, t + .05);
    K.env(g.gain, t, .003, .07, .14); osc.connect(g); g.connect(o); osc.start(t); osc.stop(t + .2); },
  check: (ac, K, o, t) => { K.bell(mtof(76), t, o, .045, .7); K.bell(mtof(79), t + .08, o, .045, .9); K.marimba(mtof(88), t + .08, o, .025, .2); },
  thud: (ac, K, o, t, k) => { K.thump(t, o, .3, 190, 62, .28); K.noiseHit(t, .07, o, {gain: .2, type: 'lowpass', f: 1400, q: .4, seed: k}); K.noiseHit(t, .02, o, {gain: .06, f: 3200, q: 1, seed: k + 3});
    K.tone('sine', mtof(43), t + .005, .45, o, .08, .004); },
  count: (ac, K, o, t) => { [60, 62, 64, 67, 69, 72, 74].forEach((m, i) => K.marimba(mtof(m + 12), t + i*.1, o, .025 + i*.004, .2)); },
  ding: (ac, K, o, t) => { K.bell(mtof(84), t, o, .04, 1.1); K.bell(mtof(91), t + .05, o, .022, 1.3); K.bell(mtof(88), t + .1, o, .015, 1.4); },
  down: (ac, K, o, t) => { [69, 67, 64].forEach((m, i) => K.marimba(mtof(m + 12), t + i*.11, o, .04, .25));
    const g = ac.createGain(), s = ac.createOscillator(); s.frequency.setValueAtTime(mtof(72), t); s.frequency.exponentialRampToValueAtTime(mtof(64), t + .35); K.env(g.gain, t, .02, .025, .35); s.connect(g); g.connect(o); s.start(t); s.stop(t + .45); },
  whoosh: (ac, K, o, t, k) => { K.noiseHit(t - .25, .45, o, {gain: .09, f: 400, f1: 3500, q: 1.2, a: .25, seed: k}); K.bell(mtof(79), t + .45, o, .03, 1); K.bell(mtof(84), t + .5, o, .025, 1.1); },
  sweep: (ac, K, o, t, k) => K.noiseHit(t, .3, o, {gain: .03, f: 2600, f1: 700, q: .9, a: .1, seed: k}),
  sting: (ac, K, o, t, k) => { K.noiseHit(t - .02, .6, o, {gain: .08, type: 'lowpass', f: 900, f1: 200, q: .3, seed: k}); K.thump(t, o, .28, 110, 50, .6);
    [72, 76, 79, 84].forEach((m, i) => K.bell(mtof(m), t + .03 + i*.07, o, .024, 1.8)); K.bell(mtof(96), t + .35, o, .01, 2); },
  gate: (ac, K, o, t, k) => { K.noiseHit(t, .05, o, {gain: .14, f: 1900, q: 3, seed: k}); K.tone('sine', mtof(79), t, .08, o, .04, .002); K.thump(t + .01, o, .12, 220, 90, .12); },
};

// ---------------------------------------------------------------- mix
// events: [{t, kind}]; introEnd: end of the cover; outroStart: the closing card.
function score({total, introEnd, outroStart, events}) {
  return (ac, t0, dest) => {
    const K = kit(ac);
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 2.5; comp.attack.value = .006; comp.release.value = .25;
    const master = K.gain(.9, dest), hp = K.filter('highpass', 45, .6, master); comp.connect(hp);   // nothing below what speakers can play
    const solo = window.__pfSolo;                                                                    // 'music' | 'fx': for level checks
    const room = K.reverb(1.9, 3.2, 21); room.connect(K.gain(.9, comp));
    const musicBus = K.gain(.4, comp), fxBus = K.gain(1.5, comp);   // the music stays under the effects
    musicBus.connect(K.gain(.12, room)); fxBus.connect(K.gain(.28, room));
    if (solo !== 'fx') music(ac, K, musicBus, t0, total, introEnd, outroStart);
    if (solo !== 'music') events.forEach((e, k) => FX[e.kind](ac, K, fxBus, t0 + e.t, k));
  };
}
return {score, BPM};
})();

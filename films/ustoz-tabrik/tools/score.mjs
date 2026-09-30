// Renders only a film's sound (no frames) to a WAV, for quick work on the score.
// node tools/score.mjs 1 out/qism-1-score.wav [music|fx]
// node tools/score.mjs pf174-toliq.html out/pf174-toliq-score.wav --chunks 90
// Long films render in chunks on parallel pages: each chunk starts 4 s early
// (so reverb, echo and held chords are already sounding) and chunks meet in a
// 50 ms crossfade. Offline Web Audio slows down sharply on very long graphs.
import puppeteer from 'puppeteer-core';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2), ci = args.indexOf('--chunks'), chunk = ci >= 0 ? Number(args.splice(ci, 2)[1]) : 0;
const [n, out, solo] = args;                                                    // solo: music | fx
const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true, protocolTimeout: 0});
const url = pathToFileURL(path.join(dir, String(n).endsWith('.html') ? n : `qism-${n}.html`)); url.searchParams.set('bare', '1');
const open = async () => {
  const page = await browser.newPage(), errors = [];
  page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url.href, {waitUntil: 'load'}); await page.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
  if (solo) await page.evaluate(s => { window.__pfSolo = s; }, solo);
  return {page, errors};
};
const t = Date.now(), SR = 48000, PRE = 4, XF = .05;
let wav;
if (!chunk) { const {page, errors} = await open(); wav = Buffer.from(await page.evaluate(() => window.__wav()), 'base64'); if (errors.length) throw new Error(errors.join('\n')); }
else {
  const first = await open(), dur = await first.page.evaluate(() => window.__FILM.DUR), wins = [];
  for (let w0 = 0; w0 < dur; w0 += chunk) wins.push([w0, Math.min(dur, w0 + chunk)]);
  // one chunk: film time [w0 - PRE, w1 + XF] rendered, [w0, w1 + XF] returned as interleaved 16-bit PCM
  const renderChunk = async (page, [w0, w1]) => page.evaluate(async (w0, w1, dur, SR, PRE, XF) => {
    const ws = Math.max(0, w0 - PRE), we = Math.min(dur, w1 + XF), oac = new OfflineAudioContext(2, Math.ceil(SR*(we - ws)), SR);
    window.__FILM.score(oac, -ws, oac.destination);
    const buf = await oac.startRendering(), off = Math.round(SR*(w0 - ws)), n = buf.length - off, L = buf.getChannelData(0), R = buf.getChannelData(1), pcm = new Int16Array(n*2);
    for (let i = 0; i < n; i++) { pcm[2*i] = Math.max(-1, Math.min(1, L[off + i]))*32767; pcm[2*i + 1] = Math.max(-1, Math.min(1, R[off + i]))*32767; }
    let b = ''; const u = new Uint8Array(pcm.buffer); for (let k = 0; k < u.length; k += 32768) b += String.fromCharCode.apply(null, u.subarray(k, k + 32768)); return btoa(b);
  }, w0, w1, dur, SR, PRE, XF);
  const pages = [first, ...await Promise.all(Array.from({length: Math.min(3, wins.length) - 1}, open))], parts = new Array(wins.length);
  let next = 0;
  await Promise.all(pages.map(async ({page}) => { while (next < wins.length) { const k = next++; parts[k] = new Int16Array(Buffer.from(await renderChunk(page, wins[k]), 'base64').buffer.slice(0)); console.log(`chunk ${k + 1}/${wins.length}`); } }));
  const total = Math.round(SR*dur), pcm = new Int16Array(total*2), xf = Math.round(SR*XF);
  wins.forEach(([w0], k) => { const p = parts[k], at = Math.round(SR*w0);
    for (let i = 0; i < p.length/2 && at + i < total; i++) for (let c = 0; c < 2; c++) {
      const v = p[2*i + c], j = 2*(at + i) + c;
      pcm[j] = k && i < xf ? Math.round(pcm[j]*(1 - i/xf) + v*(i/xf)) : v;            // fade the tail of the last chunk into this one
    } });
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.byteLength, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR*4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.byteLength, 40);
  wav = Buffer.concat([h, Buffer.from(pcm.buffer)]);
}
await browser.close();
writeFileSync(path.resolve(out), wav);
console.log(`${out} (${((Date.now() - t)/1000).toFixed(1)} s)`);

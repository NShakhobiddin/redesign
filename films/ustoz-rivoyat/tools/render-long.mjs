// Renders a long film's picture with several pages in parallel (frames split
// into contiguous runs), then encodes it. The sound is rendered separately in
// one pass: node tools/score.mjs ustoz-rivoyat.html out/ustoz-rivoyat-score.wav
// node tools/render-long.mjs ustoz-rivoyat.html out 3
// Output: out/<name>.mp4 (picture only) and out/<name>-render.json.
import puppeteer from 'puppeteer-core';
import {execFileSync} from 'node:child_process';
import {mkdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const [file, outDir = 'out', workers = '3'] = process.argv.slice(2);
const name = path.basename(file, '.html'), out = path.resolve(outDir), frames = path.join(out, `${name}-frames`), W = Number(workers);
rmSync(frames, {recursive: true, force: true}); mkdirSync(frames, {recursive: true});
const url = pathToFileURL(path.resolve(file)); url.searchParams.set('bare', '1');
const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true, protocolTimeout: 0});
const open = async () => {
  const page = await browser.newPage(), errors = [];
  page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url.href, {waitUntil: 'load'}); await page.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
  const err = await page.evaluate(() => window.__error); if (err || errors.length) throw new Error(err || errors.join('\n'));
  return {page, errors};
};
const t0 = Date.now();
const first = await open(), N = await first.page.evaluate(() => window.__NDRAW), chunk = Math.ceil(N/W);
console.log(`${name}: ${N} frames, ${W} workers`);
let done = 0;
const work = async k => {
  const {page, errors} = k ? await open() : first;
  for (let i = k*chunk; i < Math.min(N, (k + 1)*chunk); i++) {
    const data = await page.evaluate(i => window.__frame(i), i);
    writeFileSync(path.join(frames, `${String(i).padStart(5, '0')}.png`), Buffer.from(data.split(',')[1], 'base64'));
    if (errors.length) throw new Error(`frame ${i}: ${errors.join('\n')}`);
    if (++done % 600 === 0) console.log(`Rendered ${done}/${N} (${Math.round((Date.now() - t0)/1000)} s)`);
  }
};
await Promise.all(Array.from({length: W}, (_, k) => work(k)));
await browser.close();
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '24', '-i', path.join(frames, '%05d.png'), '-frames:v', String(N), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', path.join(out, `${name}.mp4`)], {stdio: 'inherit'});
writeFileSync(path.join(out, `${name}-render.json`), JSON.stringify({file: path.basename(file), fps: 24, frames: N, duration: N/24, size: {w: 1080, h: 1920}, audio: true}, null, 2) + '\n');
rmSync(frames, {recursive: true, force: true});
console.log(`Finished: ${path.join(out, name + '.mp4')} in ${Math.round((Date.now() - t0)/1000)} s`);

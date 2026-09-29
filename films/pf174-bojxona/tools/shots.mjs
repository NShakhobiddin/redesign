// Renders chosen moments of a part and tiles them into one review sheet.
// node tools/shots.mjs 1 out/review 3.5 12 20 ...   (times in seconds; "end" = last scene ends)
// node tools/shots.mjs 1 out/review scenes          (each scene near its end, when all cards are in)
import puppeteer from 'puppeteer-core';
import {execFileSync} from 'node:child_process';
import {mkdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [n, outDir, ...when] = process.argv.slice(2);
const out = path.resolve(outDir); mkdirSync(out, {recursive: true});
const tmp = path.join(out, `.shots-${n}`); rmSync(tmp, {recursive: true, force: true}); mkdirSync(tmp);
const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true});
const page = await browser.newPage();
const url = pathToFileURL(path.join(dir, `qism-${n}.html`)); url.searchParams.set('bare', '1');
await page.goto(url.href, {waitUntil: 'load'});
await page.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
const scenes = await page.evaluate(() => window.__pfScenes), N = await page.evaluate(() => window.__NDRAW);
const times = when[0] === 'scenes' ? scenes.map(s => s.start + s.dur - (s.dur > 3 ? .8 : .1)) : when.map(Number);
let k = 0;
for (const t of times) {
  const i = Math.min(N - 1, Math.max(0, Math.round(t*24)));
  const data = await page.evaluate(i => window.__frame(i), i);
  writeFileSync(path.join(tmp, `${String(k++).padStart(3, '0')}.png`), Buffer.from(data.split(',')[1], 'base64'));
}
await browser.close();
const cols = Math.min(4, k), rows = Math.ceil(k/cols), sheet = path.join(out, `qism-${n}-${when[0] === 'scenes' ? 'scenes' : 'shots'}.jpg`);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(tmp, '%03d.png'), '-vf', `scale=432:-2,tile=${cols}x${rows}:padding=6:color=white`, '-frames:v', '1', '-q:v', '3', sheet]);
rmSync(tmp, {recursive: true, force: true});
console.log(sheet);

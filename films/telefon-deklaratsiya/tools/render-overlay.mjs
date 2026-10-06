// Renders overlay.html to transparent PNG frames: OUT/00000.png ... (30 fps).
//   node tools/render-overlay.mjs --out DIR [--jobs 4] [--times 1.5,30,62.2]
// --times renders only those moments (t-<seconds>.png) for checking.
import puppeteer from 'puppeteer-core';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const film = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'overlay.html');
const out = path.resolve(opt('--out', 'out/overlay')); mkdirSync(out, {recursive: true});
const jobs = Number(opt('--jobs', 4)), times = opt('--times') ? opt('--times').split(',').map(Number) : null;
const chrome = process.env.CHROME || ['/usr/local/bin/chromium', '/opt/pw-browsers/chromium'].find(existsSync)
  || execFileSync('which', ['chromium']).toString().trim();
const url = pathToFileURL(film); url.searchParams.set('bare', '1');
const save = (f, data) => writeFileSync(f, Buffer.from(data.split(',')[1], 'base64'));

const browser = await puppeteer.launch({executablePath: chrome, headless: true, args: ['--allow-file-access-from-files']});
try {
  const open = async () => {
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(url.href, {waitUntil: 'load'});
    await page.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
    const err = await page.evaluate(() => window.__error);
    if (err || errors.length) throw new Error(err || errors.join('\n'));
    return page;
  };
  const first = await open(), {N, fps} = await first.evaluate(() => ({N: window.__N, fps: window.__fps}));
  if (times) {
    for (const t of times) save(path.join(out, `t-${t.toFixed(2)}.png`), await first.evaluate(i => window.__frame(i), Math.round(t * fps)));
    console.log(`overlay: ${times.length} frames -> ${out}`);
  } else {
    const pages = [first, ...await Promise.all(Array.from({length: jobs - 1}, open))];
    let done = 0;
    await Promise.all(pages.map(async (page, j) => {
      for (let i = j; i < N; i += jobs) {
        save(path.join(out, `${String(i).padStart(5, '0')}.png`), await page.evaluate(i => window.__frame(i), i));
        if (++done % 300 === 0) console.log(`  ${done}/${N}`);
      }
    }));
    console.log(`overlay: ${N} frames, ${fps} fps -> ${out}`);
  }
} finally { await browser.close(); }

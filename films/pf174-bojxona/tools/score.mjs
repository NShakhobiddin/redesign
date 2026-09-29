// Renders only a part's sound (no frames) to a WAV, for quick work on the score.
// node tools/score.mjs 1 out/qism-1-score.wav
import puppeteer from 'puppeteer-core';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [n, out, solo] = process.argv.slice(2);                       // solo: music | fx
const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true});
const page = await browser.newPage(), errors = [];
page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const url = pathToFileURL(path.join(dir, `qism-${n}.html`)); url.searchParams.set('bare', '1');
await page.goto(url.href, {waitUntil: 'load'});
await page.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
if (solo) await page.evaluate(s => { window.__pfSolo = s; }, solo);
const t = Date.now(), wav = await page.evaluate(() => window.__wav());
await browser.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
writeFileSync(path.resolve(out), Buffer.from(wav, 'base64'));
console.log(`${out} (${((Date.now() - t)/1000).toFixed(1)} s)`);

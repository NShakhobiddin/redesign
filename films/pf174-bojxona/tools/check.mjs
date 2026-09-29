// Loads each part headless and prints its scene timings and layout fit.
// A layout that had to shrink to fit the safe area is reported as "scaled".
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const parts = process.argv.slice(2).length ? process.argv.slice(2) : ['1', '2', '3', '4', '5', '6'];
const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true});
let total = 0;
for (const n of parts) {
  const page = await browser.newPage(), logs = [];
  page.on('console', m => logs.push(`${m.type()}: ${m.text()}`)); page.on('pageerror', e => logs.push(`pageerror: ${e.message}`));
  const url = pathToFileURL(path.join(dir, String(n).endsWith('.html') ? n : `qism-${n}.html`)); url.searchParams.set('bare', '1');
  await page.goto(url.href, {waitUntil: 'load'});
  await page.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
  await page.evaluate(() => window.__frame(Math.floor(window.__NDRAW/2)));
  const r = await page.evaluate(() => ({scenes: window.__pfScenes, layout: window.__pfLayout, N: window.__NDRAW, err: window.__error}));
  const dur = r.N/24; total += dur;
  console.log(`\n== qism-${n}: ${dur.toFixed(1)} s (${r.N} frames)${r.err ? ' ERROR ' + r.err : ''}`);
  for (const s of r.scenes) { const L = r.layout?.[s.key]; console.log(`  ${String(s.start).padStart(6)}  ${String(s.dur).padStart(5)}s  ${L ? `h=${String(L.h).padStart(4)} k=${L.k}` : '            '}  ${s.title}`); }
  for (const l of logs) console.log('  ' + l);
  await page.close();
}
console.log(`\nTotal: ${total.toFixed(1)} s (${(total/60).toFixed(1)} min)`);
await browser.close();

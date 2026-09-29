// Saves the "shopo" wordmark as transparent PNGs: brand/shopo-logo.png (dark
// ink, for light backgrounds) and brand/shopo-logo-light.png (for dark ones).
import puppeteer from 'puppeteer-core';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true});
const page = await browser.newPage();
const url = pathToFileURL(path.join(dir, 'qism-1.html')); url.searchParams.set('bare', '1');
await page.goto(url.href, {waitUntil: 'load'}); await page.waitForFunction('window.__ready === true');
for (const [name, ink] of [['shopo-logo.png', null], ['shopo-logo-light.png', '#fbf7ee']]) {
  const data = await page.evaluate(ink => {
    const size = 400, probe = document.createElement('canvas').getContext('2d'), w = PF.logo(probe, 0, -9999, size, ink ?? undefined);
    const cv = document.createElement('canvas'); cv.width = Math.ceil(w + size*.3); cv.height = Math.ceil(size*1.35);
    PF.logo(cv.getContext('2d'), size*.12, size*1.0, size, ink ?? undefined); return cv.toDataURL('image/png');
  }, ink);
  writeFileSync(path.join(dir, 'brand', name), Buffer.from(data.split(',')[1], 'base64')); console.log('brand/' + name);
}
await browser.close();

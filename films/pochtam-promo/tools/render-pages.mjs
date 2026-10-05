// Renders the two generic pages the capture uploads: a store page (price screenshot) and a cart page,
// plus the sneaker alone (the "photo" for photo search). node tools/render-pages.mjs <outDir>
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const dir = path.dirname(new URL(import.meta.url).pathname), out = process.argv[2];
const b = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true});
const p = await b.newPage(); await p.setViewport({width: 390, height: 844, deviceScaleFactor: 2});
for (const f of ['demo-store-page', 'demo-cart-page']) { await p.goto(pathToFileURL(path.join(dir, f + '.html')).href); await new Promise(r => setTimeout(r, 300)); await p.screenshot({path: path.join(out, f + '.png')}); }
await p.goto(pathToFileURL(path.join(dir, 'demo-store-page.html')).href); const r = await p.evaluate(() => { const e = document.querySelector('.img'); const q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; });
await p.screenshot({path: path.join(out, 'demo-photo.png'), clip: {x: r[0], y: r[1], width: r[2], height: r[3]}});
await b.close(); console.log('ok');

// Run from a checkout of NShakhobiddin/Pochtachi (needs its playwright):
//   cp capture-screens.mjs <Pochtachi>/.capture-video.mjs && cd <Pochtachi> && node .capture-video.mjs <outDir> <demo-store-page.png>
// then embed the PNGs into ../app-screens.js (webp, data URLs).
// Captures real Pochtam screens for the promo video. Offline: every request that
// leaves localhost is blocked or answered with the same mocks the smoke test uses,
// so nothing reaches the live Worker (no AI spend, no metrics).
import { createServer } from 'node:http';
import { readFile, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2];
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  readFile(join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, '')), (err, body) => { if (err) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(body); });
});
await new Promise(r => server.listen(8131, r));
const base = 'http://localhost:8131';
const src = readFileSync(join(ROOT, 'Xarid Yordamchisi v2.dc.html'), 'utf8');
const METRICS_URL = (/const METRICS_URL = '([^']*)'/.exec(src) || [])[1] || '';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
const blocked = [];
await context.route('**/*', r => {
  const u = r.request().url();
  if (u.startsWith(base) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
  if (u === METRICS_URL + 'ai/status') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ai: true }) });
  if (/cbu\.uz/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify([{ Ccy: 'USD', Rate: '12650.00', Nominal: '1', Date: '28.09.2026', Diff: '0' }, { Ccy: 'EUR', Rate: '13900.00', Nominal: '1', Date: '28.09.2026', Diff: '0' }, { Ccy: 'CNY', Rate: '1770.00', Nominal: '1', Date: '28.09.2026', Diff: '0' }]) });
  if (u === METRICS_URL + 'ai') {
    const body = JSON.parse(r.request().postData() || '{}');
    if (body.image) {
      const sh = { found: true, name: 'Krossovka (erkaklar), 42', price: 699, currency: 'CNY', priceUsd: 97.86, fxApprox: true, qty: 1, store: 'Taobao', confidence: 0.92, category: 'poyabzal', country: 'Xitoy', weightKg: 0.8 };
      return new Promise(res => setTimeout(res, globalThis.shotDelay || 0)).then(() => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: '', shot: sh, cart: { name: sh.name, store: sh.store, country: sh.country, cat: sh.category, cur: sh.currency, price: sh.price, kg: sh.weightKg, qty: 1, courier: '', totalUsd: 0 }, cards: [{ type: 'product', ...sh }], tools: [], model: 'm', usage: {}, stop: 'shot' }) }));
    }
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: "Erkaklar krossovkasi uchun mos do'konlar: Xitoydan arzonroq, AQShdan original tanlov ko'p.",
      cards: [{ type: 'stores', got: { category: 'poyabzal', original: false, budgetUsd: 120, query: 'men sneakers 42' }, stores: [{ id: 'taobao', name: 'Taobao', searchUrl: 'https://s.taobao.com/search?q=sneakers' }, { id: 'poizon', name: 'Poizon', searchUrl: 'https://www.dewu.com' }, { id: 'amazon', name: 'Amazon', searchUrl: 'https://www.amazon.com/s?k=men+sneakers' }] }], tools: ['suggest_stores'], model: 'm', usage: {} }) });
  }
  blocked.push(new URL(u).host); return r.abort();
});
const page = await context.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
const BOXES = {};
const box = async (name, key, sel, re) => {
  const r = await page.evaluate(([sel, re]) => {
    let el = null;
    if (re) { const rx = new RegExp(re); el = [...document.querySelectorAll(sel)].find(e => rx.test(e.innerText || '')); }
    else el = document.querySelector(sel);
    if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)];
  }, [sel, re || null]);
  (BOXES[name] ??= {})[key] = r; console.log('box', name, key, r);
};
const shot = async (name, note = '') => { await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name, note); };
const txt = async () => (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ');
await page.goto(base + '/', { waitUntil: 'load' }); await page.waitForTimeout(1500);
for (let i = 0; i < 14; i++) {
  if (await page.locator('nav').count()) break;
  const b = page.locator('button:visible'); const n = await b.count(); let t = null;
  for (let j = 0; j < n; j++) { const s = (await b.nth(j).innerText().catch(() => '')).trim(); if (/^(Davom|Boshlash|Keyingi|Tayyor|Boshladik|Kirish|Ha,|Yo'q)/i.test(s)) { t = b.nth(j); break; } }
  await (t || b.first()).click().catch(() => {}); await page.waitForTimeout(350);
}
await page.waitForTimeout(1300);
for (let i = 0; i < 4; i++) { const d = page.locator('[role="dialog"] button').filter({ hasText: /Keyingi|Tushunarli|Yopish/ }).first(); if (await d.count()) { await d.click(); await page.waitForTimeout(400); } }
await shot('01-home', (await txt()).slice(0, 140)); await box('01-home', 'shotBtn', 'main button', 'Topdim'); await box('01-home', 'field', 'main input[aria-label="Mahsulot nomi"]');
// 1. Find the store: the reference list of stores.
await page.locator('nav button', { hasText: "Ma'lumotnoma" }).first().click(); await page.waitForTimeout(400);
await shot('02-ref', (await txt()).slice(0, 120)); await box('02-ref', 'list', 'main');
await page.locator('main button').filter({ has: page.locator('span', { hasText: /^\s*Do'konlar\s*$/ }) }).first().click(); await page.waitForTimeout(700);
await shot('03-stores', (await txt()).slice(0, 160)); await box('03-stores', 'shoes', 'main button', '^\\s*Poyabzal');
await page.mouse.wheel(0, 700); await page.waitForTimeout(400); await shot('03b-stores-scroll');
// 1b. ... or ask: product name in the field -> AI suggests stores.
await page.locator('nav button', { hasText: 'Boshlash' }).first().click(); await page.waitForTimeout(500);
const field = page.locator('main input[aria-label="Mahsulot nomi"]').first();
if (await field.count()) { await field.fill('erkaklar krossovkasi 42'); await page.waitForTimeout(200); await shot('04-type'); await field.press('Enter'); await page.waitForTimeout(1800); await shot('05-find', (await txt()).slice(0, 200)); await box('05-find', 'stores', 'main a[target="_blank"]'); await box('05-find', 'ask', 'main', ''); }
// 2. Upload a screenshot -> scanning -> 3. total price.
await page.locator('nav button', { hasText: 'Boshlash' }).first().click(); await page.waitForTimeout(500);
await page.evaluate(() => window.scrollTo(0, 0));
await shot('06-home-again', (await txt()).slice(0, 120));
globalThis.shotDelay = 3600;
await page.locator('input[type="file"][data-shot]').first().setInputFiles(process.argv[3]);
await page.waitForTimeout(700); await shot('07-scan1', (await txt()).slice(0, 120)); await box('07-scan1', 'busy', 'main [data-shot-busy]');
await page.waitForTimeout(1500); await shot('07-scan2', (await txt()).slice(0, 120));
await page.waitForTimeout(2200); globalThis.shotDelay = 0;
await shot('08-result', (await txt()).slice(0, 220)); await box('08-result', 'total', 'main div', '^\\s*SIZGA JAMI TUSHADI[\\s\\S]*kun'); await box('08-result', 'guideBtn', 'button', 'Qanday buyurtma qilaman');
const scrollTo = async sel => { await page.evaluate(s => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -70); }, sel); await page.waitForTimeout(500); };
await scrollTo('main [data-breakdown]'); await box('09-breakdown', 'bd', 'main [data-breakdown]'); await shot('09-breakdown', (await page.locator('main [data-breakdown]').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200));
await scrollTo('main [data-b4m]'); await box('10-b4m', 'b4m', 'main [data-b4m]'); await box('10-b4m', 'write', 'main [data-b4m] button', 'Yozish'); await shot('10-b4m', (await page.locator('main [data-b4m]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200));
const btns = await page.evaluate(() => [...document.querySelectorAll('main button')].map(b => b.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
console.log('buttons:', btns.join(' | ').slice(0, 400));
// 4. The ordering guide.
await page.evaluate(() => window.scrollTo(0, 0));
await page.locator('button').filter({ hasText: /Qanday buyurtma qilaman\?/ }).first().click(); await page.waitForTimeout(1800);
await shot('11-guide', (await txt()).slice(0, 200));
const fr = page.frameLocator('iframe').first();
await page.waitForTimeout(800); await shot('11-guide');
const gf = page.frames().find(f => /guides\/inline/.test(f.url()));
console.log('guide frame', gf && gf.url());
if (gf) {
  console.log('tabs html', (await gf.evaluate(() => (document.querySelector('#tabs') || document.body).outerHTML.slice(0, 700))));
  await gf.evaluate(() => { const el = [...document.querySelectorAll('#tabs *')].reverse().find(e => /Bosqichlar/.test(e.textContent)); if (el) el.click(); window.scrollTo(0, 0); });
  await page.waitForTimeout(900); await shot('12-steps-0', (await gf.evaluate(() => document.querySelector('#p-steps')?.innerText || '')).replace(/\s+/g, ' ').slice(0, 300));
  for (let k = 1; k <= 5; k++) {
    const ok = await gf.evaluate(() => { const n = document.querySelector('#wnext'); if (!n) return false; n.click(); return true; });
    await page.waitForTimeout(700); await shot('12-steps-' + k, ok ? (await gf.evaluate(() => document.querySelector('#wizcard')?.innerText || '')).replace(/\s+/g, ' ').slice(0, 160) : 'no next');
  }
}
// 5. Order: save to Xaridlarim, then walk the stages.
await page.goBack().catch(() => {}); await page.waitForTimeout(800);
let add = page.locator('button').filter({ hasText: /Xaridlarimga qo'shish/ }).first();
if (!(await add.count())) { await page.locator('header button').first().click().catch(() => {}); await page.waitForTimeout(800); add = page.locator('button').filter({ hasText: /Xaridlarimga qo'shish/ }).first(); }
console.log('add found', await add.count(), (await txt()).slice(0, 100));
if (await add.count()) { await add.click(); await page.waitForTimeout(900); }
await page.locator('nav button', { hasText: 'Xaridlarim' }).first().click(); await page.waitForTimeout(800);
await shot('13-mine', (await txt()).slice(0, 220)); await box('13-mine', 'ordered', 'button', 'Buyurtma qildim'); await box('13-mine', 'b4m', 'button', 'Kuryer men uchun'); await box('13-mine', 'guide', 'button', 'qanday buyurtma');
for (const [lbl, name] of [["Buyurtma qildim", '14-ordered'], ["Omborga yetib keldi", '15-warehouse'], ["Yo'lga chiqdi", '16-road'], ["Qo'limga tegdi", '17-arrived']]) {
  const b = page.locator('button').filter({ hasText: new RegExp(lbl) }).first();
  if (await b.count()) { await b.click(); await page.waitForTimeout(800); const inp = page.locator('main input').first(); await shot(name, (await txt()).slice(0, 200)); }
  else console.log('no button', lbl, (await txt()).slice(0, 160));
}
(await import('node:fs')).writeFileSync(`${OUT}/boxes.json`, JSON.stringify(BOXES, null, 1));
console.log('blocked hosts:', [...new Set(blocked)].join(', '));
console.log('page errors:', errs.slice(0, 5).join(' | '));
await browser.close(); server.close();

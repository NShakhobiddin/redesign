// Captures the current Pochtam screens for the fast-cut promo. Run from a checkout of
// NShakhobiddin/Pochtachi (uses its playwright):
//   cp capture-v2.mjs <Pochtachi>/.capture-promo.mjs && cd <Pochtachi> && node .capture-promo.mjs <outDir> <pagesDir>
// <pagesDir> holds demo-store-page.png, demo-cart-page.png and demo-photo.png (tools/render-pages.mjs).
// Offline: everything that leaves localhost is blocked or answered with mocks in the style of the app's
// smoke test (AI status, Central Bank rates, Pochtam AI) — nothing reaches the live Worker.
import {createServer} from 'node:http';
import {readFile, readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {dirname, join, extname, normalize} from 'node:path';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const ROOT = dirname(fileURLToPath(import.meta.url)), OUT = process.argv[2], PAGES = process.argv[3];
const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8'};
const server = createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  readFile(join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, '')), (err, body) => { if (err) { res.writeHead(404); res.end(); return; } res.writeHead(200, {'content-type': MIME[extname(p)] || 'application/octet-stream'}); res.end(body); }); });
await new Promise(r => server.listen(8132, r));
const base = 'http://localhost:8132';
const src = readFileSync(join(ROOT, 'Xarid Yordamchisi v2.dc.html'), 'utf8');
const METRICS_URL = (/const METRICS_URL = '([^']*)'/.exec(src) || [])[1] || '';
const browser = await chromium.launch({executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}).catch(() => chromium.launch());
const context = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: true, hasTouch: true});
const blocked = [], aiLog = [];
// what the mocked AI answers: a photo is recognised as a product; a store screenshot reads one price;
// a cart screenshot reads three items; a product query gets stores and exact links; a question gets duty and couriers
let imageMode = 'photo', shotDelay = 0;
const SHOT = {found: true, kind: 'price', name: 'Krossovka (erkaklar), 42', price: 699, currency: 'CNY', priceUsd: 97.86, fxApprox: true, qty: 1, store: 'Taobao', confidence: 0.92, category: 'poyabzal', country: 'Xitoy', weightKg: 0.8};
const PHOTO = {found: false, kind: 'product', name: 'Oq krossovka (erkaklar)', brand: '', query: 'white men running sneakers', price: 0, currency: '', qty: 1, store: '', category: 'poyabzal', country: '', weightKg: 0, confidence: 0.9};
const CART = {found: true, kind: 'price', multi: true, name: '3 ta tovar: Krossovka, Futbolka, Kepka', brand: '', query: '', price: 99.99, currency: 'USD', priceUsd: 99.99, fxApprox: false, qty: 1, store: 'Amazon', category: '', country: 'AQSh', weightKg: 0, confidence: 0.9,
  items: [{name: 'Krossovka', price: 59.99, currency: 'USD', qty: 1, priceUsd: 59.99, category: 'poyabzal', weightKg: 0}, {name: 'Futbolka', price: 12.5, currency: 'USD', qty: 2, priceUsd: 12.5, category: 'kiyim va moda', weightKg: 0}, {name: 'Kepka', price: 15, currency: 'USD', qty: 1, priceUsd: 15, category: 'kiyim va moda', weightKg: 0}]};
const cartOf = sh => sh.found && !sh.multi ? {name: sh.name, store: sh.store, country: sh.country, cat: sh.category, cur: sh.currency, price: sh.price, kg: sh.weightKg, qty: sh.qty, courier: '', totalUsd: 0} : null;
const json = (r, body, status = 200) => r.fulfill({status, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: JSON.stringify(body)});
await context.route('**/*', async r => {
  const u = r.request().url();
  if (u.startsWith(base) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
  if (u === METRICS_URL + 'ai/status') return json(r, {ai: true});
  if (/cbu\.uz/.test(u)) return json(r, [{Ccy: 'USD', Rate: '12650.00', Nominal: '1', Date: '05.10.2026', Diff: '0'}, {Ccy: 'EUR', Rate: '13900.00', Nominal: '1', Date: '05.10.2026', Diff: '0'}, {Ccy: 'CNY', Rate: '1770.00', Nominal: '1', Date: '05.10.2026', Diff: '0'}]);
  if (u === METRICS_URL + 'ai') {
    const body = JSON.parse(r.request().postData() || '{}'); aiLog.push({...body, image: body.image ? '[image]' : undefined});
    if (body.image) { const sh = imageMode === 'photo' ? PHOTO : imageMode === 'cart' ? CART : SHOT;
      if (shotDelay) await new Promise(z => setTimeout(z, shotDelay));
      return json(r, {text: '', shot: sh, cart: cartOf(sh), cards: sh.found && !sh.multi ? [{type: 'product', ...sh}] : [], tools: [], model: 'm', usage: {}, stop: 'shot'}); }
    const q = body.q || '';
    if (body.find || /krossovka|Rasmdagi tovar/i.test(q)) return json(r, {text: "Oq erkaklar krossovkasi uchun mos do'konlar: Xitoydan arzonroq, AQShdan original tanlov ko'p.",
      cards: [{type: 'stores', got: {category: 'poyabzal', original: false, budgetUsd: 120, query: 'white men running sneakers'}, stores: [{id: 'taobao', name: 'Taobao', searchUrl: 'https://s.taobao.com/search?q=sneakers'}, {id: 'poizon', name: 'Poizon', searchUrl: 'https://www.dewu.com'}, {id: 'amazon', name: 'Amazon', searchUrl: 'https://www.amazon.com/s?k=men+white+sneakers'}]},
        {type: 'links', links: [{title: 'Erkaklar oq krossovkasi, yugurish uchun', url: 'https://item.taobao.com/item.htm?id=1', host: 'taobao.com', store: 'Taobao', price: 699, currency: 'CNY'}, {title: "Men's white running sneakers", url: 'https://www.amazon.com/dp/B0EXAMPLE', host: 'amazon.com', store: 'Amazon', price: 59.99, currency: 'USD'}]}],
      tools: ['suggest_stores', 'product_links'], model: 'm', usage: {}});
    // the app's own rule (its guides and customs screen): $200 a month duty-free, 30% on the excess
    return json(r, {text: "Oyiga $200 gacha bojsiz. $250 lik telefonda ortig'i $50 — undan 30%: boj $15.00.\nTaxminiy hisob.",
      cards: [{type: 'duty', got: {goodsUsd: 250, kg: 0.5}, duty: {dutyUsd: 15, totalUzs: 189750}}], tools: ['customs_duty'], model: 'm', usage: {}});
  }
  blocked.push(new URL(u).host); return r.abort();
});
const page = await context.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
const BOXES = {};
const box = async (name, key, sel, re) => { const r = await page.evaluate(([sel, re]) => { let el = null;
    if (re) { const rx = new RegExp(re); el = [...document.querySelectorAll(sel)].find(e => rx.test(e.innerText || '')); } else el = document.querySelector(sel);
    if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }, [sel, re || null]);
  (BOXES[name] ??= {})[key] = r; console.log('  box', name, key, JSON.stringify(r)); };
const txt = async () => (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ');
const shot = async (name, wait = 500) => { await page.waitForTimeout(wait); await page.screenshot({path: `${OUT}/${name}.png`}); console.log('shot', name, '|', (await txt()).slice(0, 170)); };
const tab = async t => { await page.locator('nav button', {hasText: t}).first().click(); await page.waitForTimeout(600); await page.evaluate(() => window.scrollTo(0, 0)); };
const clickText = async (re, sel = 'main button') => { const b = page.locator(sel).filter({hasText: re}).first(); if (await b.count()) { await b.click(); await page.waitForTimeout(700); return true; } console.log('  (not found)', re); return false; };
const back = async () => { const b = page.locator('header button[aria-label="Orqaga qaytish"]').first(); if (await b.count()) { await b.click(); await page.waitForTimeout(600); } };

await page.goto(base + '/', {waitUntil: 'load'}); await page.waitForTimeout(1500);
for (let i = 0; i < 14; i++) { if (await page.locator('nav').count()) break; const b = page.locator('button:visible'); const n = await b.count(); let t = null;
  for (let j = 0; j < n; j++) { const s = (await b.nth(j).innerText().catch(() => '')).trim(); if (/^(Davom|Boshlash|Keyingi|Tayyor|Boshladik|Kirish|Ha,|Yo'q)/i.test(s)) { t = b.nth(j); break; } }
  await (t || b.first()).click().catch(() => {}); await page.waitForTimeout(350); }
await page.waitForTimeout(1300); await page.keyboard.press('Escape'); await page.waitForTimeout(300);
for (let i = 0; i < 4; i++) { const d = page.locator('[role="dialog"] button').filter({hasText: /Keyingi|Tushunarli|Yopish|Tayyor/}).first(); if (await d.count()) { await d.click(); await page.waitForTimeout(400); } }
// home
await shot('p01-home', 900); await box('p01-home', 'photoCard', 'main button[data-photo-search]'); await box('p01-home', 'shotBtn', 'main [data-tour="camera"]'); await box('p01-home', 'field', 'main form'); await box('p01-home', 'camIcon', 'main form button[aria-label="Rasm bilan qidirish"]');
// photo search: a photo of the product -> AI recognises it -> stores and exact links
imageMode = 'photo'; shotDelay = 2200;
await page.locator('input[type="file"][data-photo]').first().setInputFiles(`${PAGES}/demo-photo.png`);
await shot('p02-photo-busy', 900); await page.waitForTimeout(2600); shotDelay = 0;
await shot('p03-photo-find', 1200); await box('p03-photo-find', 'stores', 'main', ''); await box('p03-photo-find', 'links', 'main a[href*="amazon.com/dp"]');
await page.mouse.wheel(0, 380); await shot('p03b-photo-links', 600);
// a store screenshot -> AI reads the price -> the total
await tab('Boshlash'); imageMode = 'price'; shotDelay = 3600;
await page.locator('input[type="file"][data-shot]').first().setInputFiles(`${PAGES}/demo-store-page.png`);
await shot('p04-scan1', 700); await box('p04-scan1', 'busy', 'main [data-shot-busy]'); await page.waitForTimeout(1500); await shot('p04-scan2', 0); await page.waitForTimeout(2200); shotDelay = 0;
await shot('p05-result', 900); await box('p05-result', 'total', 'main div', '^\\s*SIZGA JAMI TUSHADI[\\s\\S]*kun'); await box('p05-result', 'guideBtn', 'button', 'Qanday buyurtma qilaman');
const scrollTo = async sel => { await page.evaluate(s => { const e = document.querySelector(s); if (e) e.scrollIntoView({block: 'start'}); window.scrollBy(0, -70); }, sel); await page.waitForTimeout(500); };
await scrollTo('main [data-breakdown]'); await box('p06-breakdown', 'bd', 'main [data-breakdown]'); await shot('p06-breakdown', 300);
await scrollTo('main [data-b4m]'); await box('p07-b4m', 'b4m', 'main [data-b4m]'); await box('p07-b4m', 'write', 'main [data-b4m] button', 'Yozish'); await shot('p07-b4m', 300);
// the ordering guide
await page.evaluate(() => window.scrollTo(0, 0)); await clickText(/Qanday buyurtma qilaman\?/, 'button'); await page.waitForTimeout(1500); await shot('p08-guide', 600);
const gf = page.frames().find(f => /guides\/inline/.test(f.url()));
if (gf) { await gf.evaluate(() => { const el = [...document.querySelectorAll('#tabs *')].reverse().find(e => /Bosqichlar/.test(e.textContent)); if (el) el.click(); window.scrollTo(0, 0); }); await page.waitForTimeout(900); await shot('p09-steps', 300);
  for (let k = 1; k <= 3; k++) { await gf.evaluate(() => { const n = document.querySelector('#wnext'); if (n) n.click(); }); await page.waitForTimeout(700); await shot('p09-steps-' + k, 200); } }
await page.goBack().catch(() => {}); await page.waitForTimeout(900);
// save it, then walk the parcel's stages in Xaridlarim
let add = page.locator('button').filter({hasText: /Xaridlarimga qo'shish/}).first();
if (await add.count()) { await add.click(); await page.waitForTimeout(900); }
await tab('Xaridlarim'); await shot('p10-mine', 600); await box('p10-mine', 'ordered', 'button', 'Buyurtma qildim');
for (const [lbl, name] of [["Buyurtma qildim", 'p11-ordered'], ["Omborga yetib keldi", 'p12-warehouse'], ["Yo'lga chiqdi", 'p13-road'], ["Bojxonaga keldi", 'p13b-customs'], ["Qo'limga tegdi", 'p14-arrived']]) {
  const b = page.locator('button').filter({hasText: new RegExp(lbl)}).first(); if (await b.count()) { await b.click(); await page.waitForTimeout(800); await shot(name, 200); } else console.log('  no button', lbl); }
// the whole cart in one screenshot
await tab('Boshlash'); imageMode = 'cart';
await page.locator('input[type="file"][data-shot]').first().setInputFiles(`${PAGES}/demo-cart-page.png`); await page.waitForTimeout(1500);
await shot('p15-cart', 600); await box('p15-cart', 'list', 'main div', '^\\s*Skrinshotdagi tovarlar');
await page.evaluate(() => { const e = [...document.querySelectorAll('main div')].find(d => /^\s*Skrinshotdagi tovarlar/.test(d.innerText || '')); if (e) { e.scrollIntoView({block: 'center'}); } }); await shot('p15b-cart-list', 600); await box('p15b-cart-list', 'list', 'main div', '^\\s*Skrinshotdagi tovarlar');
// the reference: stores, couriers, customs, guides
await tab("Ma'lumotnoma"); await shot('p16-ref', 400);
for (const [re, name] of [[/^\s*Do'konlar/, 'p17-stores'], [/^\s*Kuryerlar/, 'p18-couriers'], [/^\s*Bojxona/, 'p19-customs'], [/^\s*Qo'llanmalar/, 'p20-guides']]) {
  await tab("Ma'lumotnoma"); const b = page.locator('main button').filter({hasText: re}).first(); if (await b.count()) { await b.click(); await page.waitForTimeout(900); await shot(name, 300); } else console.log('  no ref row', re); }
// Pochtam AI: a question
await tab('Boshlash'); const field = page.locator('main input[aria-label="Mahsulot nomi"]').first();
await field.fill("250 dollarlik telefonga boj qancha?"); await page.waitForTimeout(200); await shot('p21-ask-type', 200);
await page.locator('main form button[aria-label="Yuborish"]').first().click().catch(async () => field.press('Enter')); await page.waitForTimeout(1500); await shot('p22-ai', 600);
await tab('Boshlash'); await page.locator('main input[aria-label="Mahsulot nomi"]').first().fill(''); await page.waitForTimeout(200);
// three languages: the home page in Cyrillic and Russian
await tab("Ma'lumotnoma"); await clickText(/Sozlamalar/); await shot('p23-settings', 300);
for (const [re, name] of [[/Ўзбекча/, 'p24-home-cyr'], [/Русский/, 'p25-home-ru']]) { await tab("Ma'lumotnoma").catch(() => {});
  const nav = page.locator('nav button').nth(2); await nav.click().catch(() => {}); await page.waitForTimeout(500);
  const set = page.locator('main button').filter({hasText: /Sozlamalar|Созламалар|Настройки/}).first(); if (await set.count()) { await set.click(); await page.waitForTimeout(600); }
  const l = page.locator('button').filter({hasText: re}).first(); if (await l.count()) { await l.click(); await page.waitForTimeout(700); }
  await page.locator('nav button').nth(0).click(); await page.waitForTimeout(800); await page.evaluate(() => window.scrollTo(0, 0)); await shot(name, 300); }
writeFileSync(`${OUT}/boxes.json`, JSON.stringify(BOXES, null, 1));
writeFileSync(`${OUT}/ai-log.json`, JSON.stringify(aiLog, null, 1));
console.log('blocked hosts:', [...new Set(blocked)].join(', '));
console.log('page errors:', errs.slice(0, 5).join(' | '));
await browser.close(); server.close();

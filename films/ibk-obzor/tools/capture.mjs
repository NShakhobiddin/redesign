// Captures the screens of the guide (https://nshakhobiddin.github.io/ibkdarslik/) for the overview film.
// Serve the site's repository locally first:  cd ibkdarslik && python3 -m http.server 8765
// node tools/capture.mjs [http://127.0.0.1:8765/index.html]
// Writes shots.js: each screen as a JPEG data URL (390x844 CSS px at 2x), plus META: where the taps land
// (CSS px rects) and the header/tab-bar heights of the tall learn screen that the film scrolls.
// External requests (telegram.org) are blocked; the app runs as in a browser.
import puppeteer from 'puppeteer-core';
import {writeFileSync} from 'node:fs';
import path from 'node:path';

const URL0 = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true});
const p = await b.newPage();
await p.setRequestInterception(true); p.on('request', r => r.url().startsWith(new URL(URL0).origin) ? r.continue() : r.abort());
const errors = []; p.on('pageerror', e => errors.push(String(e)));
const VP = {width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true};
await p.setViewport(VP);
await p.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'light'}]);
await p.goto(URL0, {waitUntil: 'networkidle0'}); await p.evaluate(() => localStorage.clear());
await p.goto(URL0, {waitUntil: 'networkidle0'});

const SHOTS = {}, META = {};
const shot = async (name, opt = {}) => { const buf = await p.screenshot({type: opt.png ? 'png' : 'jpeg', quality: opt.png ? undefined : 90, ...(opt.clip ? {clip: opt.clip} : {}), omitBackground: !!opt.png});
  SHOTS[name] = `data:image/${opt.png ? 'png' : 'jpeg'};base64,${Buffer.from(buf).toString('base64')}`; console.log(name, Math.round(buf.length/1024) + ' KB'); };
const rect = sel => p.evaluate(s => { const e = typeof s === 'string' ? document.querySelector(s) : null; if (!e) return null; const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }, sel);
const rectByText = (sel, txt) => p.evaluate((s, t) => { const e = [...document.querySelectorAll(s)].find(x => x.innerText.includes(t)); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }, sel, txt);
const clickText = (sel, txt) => p.evaluate((s, t) => { const e = [...document.querySelectorAll(s)].find(x => x.innerText.includes(t)); e.click(); }, sel, txt);
const clickLast = (sel, txt) => p.evaluate((s, t) => { const e = [...document.querySelectorAll(s)].filter(x => x.innerText.includes(t)).pop(); e.click(); }, sel, txt);   // a sheet's button comes after the page's
const go = async (r, wait = 1000) => { await p.evaluate(r => App.go(r), r); await sleep(wait); };

// the splash emblem, on a transparent background
await sleep(700);
await p.evaluate(() => { const s = document.querySelector('.splash'); s.style.background = 'transparent'; s.style.animation = 'none';
  document.querySelectorAll('#app > *:not(.splash), .splash > :not(svg)').forEach(e => e.style.visibility = 'hidden');
  for (const e of [document.body, document.documentElement, document.getElementById('app')]) e.style.background = 'transparent'; });
const em = await rect('.splash svg'); await shot('emblem', {png: true, clip: {x: em[0], y: em[1], width: em[2], height: em[3]}});
await sleep(2600); await p.evaluate(() => document.querySelector('.intro-top button').click()); await sleep(700);

// home: the "new decree" card
await go(''); await shot('home');
META.homePf = await p.evaluate(() => { const r = document.querySelector('.pill.new').closest('button, a, .card').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
META.homeVideo = await rectByText('.qa, .tool-tile, button', 'Video-darslar');
META.tabs = await p.evaluate(() => [...document.querySelectorAll('nav.tabbar .tab')].map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }));
// the learn path, rendered tall so the film can scroll it under a fixed header and tab bar
await p.setViewport({...VP, height: 1640}); await go('learn', 1400);
META.learn = {h: 1640, top: (await rect('header.topbar') || [0, 0, 0, 0])[3], tab: (await rect('nav.tabbar'))[3], pf: await rectByText('.mod-row, .path-item, button, a', 'PF-174')};
await shot('learnTall'); await p.setViewport(VP);
// the PF-174 module, its goals step (after the gauges have counted up), the strategy step
await go('m/pf174', 1300); await shot('pf174'); META.start = await rectByText('button', 'Darsni boshlash');
await go('l/pf174/2', 2800); await shot('goals');
// the drawn video lesson, at a few moments as the pen works
await go('v/v10', 1200); META.play = await rect('.big-play'); await p.evaluate(() => document.querySelector('.big-play').click());
for (const [k, ms] of [[1, 3000], [2, 4000], [3, 5000], [4, 6000]]) { await sleep(ms); await shot('video' + k); }
await p.evaluate(() => { const v = document.querySelector('[aria-label="Ijro / pauza"]'); if (v) v.click(); });
// tools
await go('tools', 1200); await shot('tools'); META.importRow = await rectByText('.list-row, button', 'Import kalkulyatori');
await go('t/import', 1400); await shot('calc');
// the PF-174 section test: the first question answered correctly, then checked
await go('q/pf174', 1200); await shot('quiz');
const ok = await p.evaluate(() => { const qt = document.querySelector('.qtext').innerText.replace(/\s+/g, ' ').trim().slice(0, 40);
  const q = QUESTIONS.find(x => x.q.replace(/\*\*/g, '').replace(/\s+/g, ' ').startsWith(qt)); const want = q.o[q.a].replace(/\*\*/g, '').trim();
  const opts = [...document.querySelectorAll('.opt')], k = opts.findIndex(o => o.innerText.replace(/^[A-D]\s*/, '').trim().startsWith(want.slice(0, 20))); const r = opts[k].getBoundingClientRect(); opts[k].click(); return [r.x, r.y, r.width, r.height]; });
META.quizOpt = ok; await sleep(500); await shot('quizSel');
await clickText('button', 'Tekshirish'); await sleep(900); await shot('quizOk');
// the final exam: the start screen, a question, then a finished attempt (23 of 25 right, 12½ minutes)
await go('exam', 1200); await shot('exam'); META.examStart = await rectByText('button', 'Testni boshlash');
await clickText('button', 'Testni boshlash'); await sleep(1200); await shot('examQ');
META.examOpt = await p.evaluate(() => { const o = document.querySelectorAll('.opt')[1]; const r = o.getBoundingClientRect(); o.click(); return [r.x, r.y, r.width, r.height]; }); await sleep(400); await shot('examSel');
await p.evaluate(() => { const run = Store.d.run, byId = {}; QUESTIONS.forEach(q => byId[q.id] = q);
  run.q.forEach((x, k) => { const c = x.o.indexOf(byId[x.id].a); x.u = k === 6 || k === 17 ? (c + 1) % 4 : c; });
  run.i = run.q.length - 1; run.s = Date.now() - (12*60 + 30)*1000; Store.d.run = run; Store.save(); });
await p.evaluate(() => App.go('exam/run', {replace: true, force: true})); await sleep(900); await clickText('button', 'Yakunlash'); await sleep(700); await clickLast('button', 'Yakunlash'); await sleep(2600);
await shot('result'); META.cert = await rectByText('button', 'Sertifikat');
await clickText('button', 'Sertifikat'); await sleep(1200); await shot('cert'); META.sheetTop = (await rect('.sheet'))[1];

await b.close();
if (errors.length) console.log('page errors:', errors);
const js = `// Screens of the guide captured by tools/capture.mjs (390x844 CSS px at 2x); JPEG data URLs.\n'use strict';\nconst SHOTS = ${JSON.stringify(SHOTS)};\nconst SHOT_META = ${JSON.stringify(META)};\n`;
writeFileSync(path.join(dir, 'shots.js'), js);
console.log('shots.js', Math.round(js.length/1024) + ' KB', JSON.stringify(META));

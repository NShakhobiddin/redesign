// Builds diktor-matni.md: the voice-over script laid on the films' own scene
// timings. Each scene gets its time window (in its part and in the single full
// film), the text, its word count and whether it fits at the planning pace.
// node tools/diktor.mjs [words-per-second]      (default 1.9 ≈ 115 words/min)
import puppeteer from 'puppeteer-core';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {VO} from '../diktor-vo.mjs';

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const RATE = Number(process.argv[2] ?? 1.9), LEAD = .3, TAIL = .5;
const uz = s => String(s).replace(/([oOgG])'/g, '$1ʻ').replace(/'/g, 'ʼ');
const count = s => s.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
const tc = s => { const t = Math.round(s*10)/10, m = Math.floor(t/60); return `${m}:${(t - 60*m).toFixed(1).padStart(4, '0')}`; };
const mmss = s => { const t = Math.floor(s + 1e-6); return `${Math.floor(t/60)}:${String(t % 60).padStart(2, '0')}`; };   // whole seconds, as a player shows them
const dec = (v, d = 1) => v.toFixed(d).replace('.', ',');

const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/local/bin/chromium', headless: true});
const parts = [];
for (const n of [1, 2, 3, 4, 5, 6]) {
  const page = await browser.newPage();
  const url = pathToFileURL(path.join(dir, `qism-${n}.html`)); url.searchParams.set('bare', '1');
  await page.goto(url.href, {waitUntil: 'load'});
  await page.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
  const r = await page.evaluate(() => ({scenes: window.__pfScenes, N: window.__NDRAW, title: PF_PARTS.map(P => P.title)}));
  if (r.scenes.length !== VO[n].length) throw new Error(`qism-${n}: ${r.scenes.length} scenes, ${VO[n].length} voice-over entries`);
  parts.push({n, dur: r.N/24, scenes: r.scenes, title: r.title[n - 1]}); await page.close();
}
// The single full film: the same scenes, without the "next part" cards between parts.
const fullPage = await browser.newPage(), furl = pathToFileURL(path.join(dir, 'pf174-toliq.html')); furl.searchParams.set('bare', '1');
await fullPage.goto(furl.href, {waitUntil: 'load'}); await fullPage.waitForFunction('window.__ready === true || window.__error', {timeout: 60000});
const full = await fullPage.evaluate(() => ({scenes: window.__pfScenes, N: window.__NDRAW}));
const inFull = Object.fromEntries(full.scenes.map(s => [s.vo, s])), fullDur = full.N/24, fullLast = full.scenes[full.scenes.length - 1].vo;
await browser.close();

let out = [], summary = [], over = 0;
for (const P of parts) {
  P.off = inFull[P.scenes[0].vo].start;
  P.rows = P.scenes.map((s, i) => {
    const last = i === P.scenes.length - 1, a = s.start + LEAD, b = s.start + s.dur - (last ? .3 : TAIL);
    const text = uz(VO[P.n][i]), w = count(text), est = w/RATE, f = inFull[s.vo];
    if (est > b - a) over++;
    return {i, a, b, text, w, est, fit: est <= b - a, title: s.title === 'cover' ? `Muqova: ${P.n}-qism` : uz(s.title),
      fa: f ? f.start + LEAD : null, fb: f ? f.start + f.dur - (f.vo === fullLast ? .3 : TAIL) : null};
  });
  P.words = P.rows.reduce((x, r) => x + r.w, 0);
  summary.push(`| ${P.n}. ${uz(P.title)} | ${mmss(P.dur)} | ${mmss(P.off)} | ${P.scenes.length} | ${P.words} | ${mmss(P.words/RATE)} |`);
}
const total = parts.reduce((x, P) => x + P.words, 0);

out.push(`# Diktor matni: «Bojxona islohoti: PF-174 sodda tilda»

6 qismli video seriya uchun o'qiladigan matn (yozib olish ssenariysi). Matn
videolarning mavjud sahnalariga moslab yozilgan: har bir sahna o'z vaqt
oralig'iga sig'adi, videoni qayta montaj qilish shart emas.

Bu fayl [\`tools/diktor.mjs\`](tools/diktor.mjs) orqali
[\`diktor-vo.mjs\`](diktor-vo.mjs) matni va videolarning o'z sahna vaqtlaridan
yaratilgan. Matnni o'zgartirsangiz, skriptni qayta ishga tushiring: vaqtlar va
sig'ish tekshiruvi yangilanadi.

| Qism | Davomiyligi | To'liq filmda boshlanishi | Sahnalar | So'zlar | Taxminiy o'qish |
| --- | --- | --- | --- | --- | --- |
${summary.join('\n')}
| **Alohida qismlar jami** | **${mmss(parts.reduce((x, P) => x + P.dur, 0))}** | **To'liq film: ${mmss(fullDur)}** | **${parts.reduce((x, P) => x + P.scenes.length, 0)}** | **${total}** | **${mmss(total/RATE)}** |

## Diktorga ko'rsatmalar

- **Ohang:** sokin, aniq, ishonchli. Bu reklama emas, rasmiy hujjatni
  tushuntirish: betaraf axborot ohangi, ortiqcha hayajonsiz.
- **Sur'at:** daqiqasiga taxminan ${Math.round(RATE*60)} so'z (soniyasiga ${dec(RATE)}). Har bir sahna uchun
  "oyna" berilgan: matn shu vaqt ichida bemalol o'qib bo'linishi kerak.
  Gaplar orasida qisqa pauza qiling. Shoshilishga to'g'ri kelsa, sur'atni
  oshirmang, bizga ayting: matnni qisqartiramiz.
- **Raqamlar so'z bilan yozilgan** ("to'rt butun o'ndan to'rt foiz",
  "ikki ming o'ttizinchi yil"), ekrandagi raqamlar bilan bir xil. Yozilganidek
  o'qing.
- **Yozib olish:** har bir sahna alohida faylda, nomi sahna raqami bilan:
  \`qism-1-03.wav\` (1-qism, 3-sahna). 48 kHz, 24 bit, mono; jim xona, fon
  musiqasiz (musiqa videoda bor). Fayl boshida taxminan 0,3 soniya jimlik
  qoldiring.
- Har bir sahnada **"Vaqt"** — ovoz qo'yiladigan oraliq (alohida qism
  videosida), **"To'liq filmda"** — ${mmss(fullDur)} lik bitta yaxlit videodagi o'rni.
  Yaxlit filmda qismlar orasidagi "Keyingi qism" kartalari yo'q, ularning
  matni faqat alohida qism videolari uchun.

### Talaffuz

| Yozuv | O'qilishi |
| --- | --- |
| PF-174 | pe-ef bir yuz yetmish to'rt (matnda ishlatilmagan, faqat ekranda) |
| lex.uz | leks nuqta uz |
| QQS | qe-qe-es (qo'shilgan qiymat solig'i) |
| AQSH | a-qe-sha |
| «AI-tahlil» | ey-ay tahlil |
| «Customs fine» | kastoms fayn |
| «Safe Customs» | seyf kastoms |
| «Smart CCTV» | smart si-si-ti-vi |
| OCR | o-si-ar |
| GPS | ji-pi-es |
| IT | ay-ti |
| «S. Najimov» | post nomi, yozilganidek: Es. Najimov |
`);
for (const P of parts) {
  out.push(`\n## ${P.n}-qism. ${uz(P.title)}\n\nDavomiyligi ${mmss(P.dur)}; to'liq filmda ${mmss(P.off)} dan boshlanadi. ${P.words} so'z.\n`);
  for (const r of P.rows) {
    const id = `${P.n}-${String(r.i + 1).padStart(2, '0')}`;
    out.push(`**${id} · ${r.title}**  \nVaqt: ${tc(r.a)}–${tc(r.b)} · To'liq filmda: ${r.fa == null ? "yo'q (faqat alohida qismda)" : `${tc(r.fa)}–${tc(r.fb)}`}\n\n> ${r.text}\n\n<sub>${r.w} so'z · ~${dec(r.est)} s / oyna ${dec(r.b - r.a)} s ${r.fit ? '✓' : '⚠ sigʻmaydi'}</sub>\n`);
  }
}
out.push(`\n---\n\nMatn farmon mazmunini soddalashtirib tushuntiradi, huquqiy maslahat emas.\nRasmiy matn: lex.uz (PF-174, 27.08.2026).\n`);
writeFileSync(path.join(dir, 'diktor-matni.md'), uz(out.join('\n')));   // prose and script alike in Uzbek ʻ/ʼ
console.log(`diktor-matni.md: ${total} words, ~${mmss(total/RATE)} at ${RATE} w/s; ${over} scene(s) over their window`);
for (const P of parts) for (const r of P.rows) if (!r.fit) console.log(`  over: ${P.n}-${r.i + 1} ${r.w} words, ${r.est.toFixed(1)} s > ${(r.b - r.a).toFixed(1)} s`);

// Packs the captured screens (and the generic upload pages) into screens.js as WebP data URLs.
// node tools/embed.mjs <captureDir> <pagesDir>
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
const [cap, pages] = process.argv.slice(2), dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), tmp = mkdtempSync(path.join(tmpdir(), 'pp-'));
const NAMES = ['p01-home', 'p02-photo-busy', 'p03-photo-find', 'p04-scan1', 'p05-result', 'p06-breakdown', 'p07-b4m', 'p08-guide', 'p09-steps', 'p09-steps-1', 'p10-mine', 'p11-ordered', 'p13-road',
  'p15-cart', 'p15b-cart-list', 'p16-ref', 'p17-stores', 'p18-couriers', 'p19-customs', 'p20-guides', 'p22-ai', 'p24-home-cyr', 'p25-home-ru'];
const webp = (src, q = 82) => { const o = path.join(tmp, path.basename(src) + '.webp'); execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-c:v', 'libwebp', '-quality', String(q), o]); return 'data:image/webp;base64,' + readFileSync(o).toString('base64'); };
const S = {}; for (const n of NAMES) S[n] = webp(path.join(cap, n + '.png'));
for (const n of ['demo-store-page', 'demo-cart-page', 'demo-photo']) S[n] = webp(path.join(pages, n + '.png'), 86);
const boxes = JSON.parse(readFileSync(path.join(cap, 'boxes.json'), 'utf8'));
const js = `// Pochtam screens (390x844 CSS px at 2x) captured offline from the current app (NShakhobiddin/Pochtachi)
// by tools/capture-v2.mjs with mocked AI and rates; 'demo-*' are generic pages made for the film.
// Boxes are CSS-pixel rects of key elements.
'use strict';
const SCREENS = ${JSON.stringify(S)};
const SCREEN_BOXES = ${JSON.stringify(boxes)};
`;
writeFileSync(path.join(dir, 'screens.js'), js); console.log('screens.js', Math.round(js.length/1024) + ' KB', Object.keys(S).length, 'images');

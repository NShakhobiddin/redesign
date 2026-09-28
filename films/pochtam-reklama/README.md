# Pochtam — reklama-motivatsion video

[pochtam.uz](https://pochtam.uz) uchun 33 soniyalik vertikal (9:16) reklama.
Instagram Reels, Telegram va TikTok uchun mos.

![Pochtam reklamasi](out/pochtam-reklama-preview.gif)

## G'oya: "Orzuingiz — eshigingiz oldida"

Chet eldan xarid qilishdagi eng katta to'siq — noaniqlik. Film shu
noaniqlikni ko'rsatadi va Pochtam uni qanday bitta aniq yo'lga
aylantirishini namoyish qiladi.

| Vaqt | Sahna | Ekranda |
| --- | --- | --- |
| 0–5 s | **Orzu.** Qalamda chizilgan telefon, chet el do'konida orzu krossovkasi o'zini chizadi, yurakcha paydo bo'ladi | *"Orzuingizdagi narsa dunyoning narigi chekkasidami?"* |
| 5–10.5 s | **Savollar.** Atrofda savol pufakchalari chiqadi, ular orasida chalkash chiziq o'sadi, hammasi xavotirdan titraydi | *Qaysi do'kon? Qaysi kuryer? Boj qancha? Jami necha pul? Qachon keladi?* |
| 10.6–12.5 s | **Pochtam.** Yashil **p** ilova introsidagidek tushib, ko'k olti burchakka o'tiradi. Olti burchak kengayib, dunyoni brend ranglariga bo'yaydi. Chalkash chiziq bitta to'g'ri yo'lga aylanadi, telefon Pochtam ilovasiga o'zgaradi | *"Endi hammasi aniq."* |
| 12.5–22.5 s | **Yo'l.** "Buyurtma" bosiladi, Pochtam qutisi yo'lga tushadi. Yo'lda 5 bekat bor, har birida belgi yashilga aylanadi | *43 ta do'kon · 20 ta kuryer · Boj va jami narx · Qo'llanma va AI · Kuzatib boring* |
| 22.5–26.8 s | **Eshikda.** Quti eshik oldiga tushadi, ochiladi, krossovka yulduzchalar bilan chiqadi | *"Orzuingiz — eshigingiz oldida."* |
| 26.8–33 s | **Brend.** Qutidagi olti burchak butun ekranni egallaydi, ilovaning haqiqiy introsi o'ynaydi | *Pochtam. Global xaridlar biz bilan oson · pochtam.uz · "Orzu qiling — qolganini biz hal qilamiz"* |

Raqamlar saytdan olingan: 43 do'kon, 20 kuryer, bojxona va jami narx
kalkulyatori, 7 qo'llanma, Pochtam AI, jo'natmalarni kuzatish.

## Uslub

- **Qalam → siyoh va brend rangi.** Shubha qalamda, iliq qog'ozda chizilgan.
  Aniqlik siyoh chiziq va tekis brend ranglarida: ko'k `#1A1FB0`,
  to'q ko'k `#131429`, salat `#bbef45`, fon `#F1F1F8`. O'tishning sababi
  bor: uni brend belgisi boshlaydi. Telefon, krossovka va chiziq o'tish
  chegarasidan uzilmay o'tadi.
- **Brend aniqligi.** Logotip bo'laklari (olti burchak, yashil p, harflar,
  shior) va Onest shrifti ilova repozitoriyasidan olingan
  ([`NShakhobiddin/Pochtachi`](https://github.com/NShakhobiddin/Pochtachi)).
  Yakundagi intro ilovadagi xoreografiyaning aynan ko'chirmasi: vaqtlar,
  easing'lar va o'lchamlar o'zgarmagan.
- **Animatsiya.** Tushish, sakrash, quti va kamera birtadan (24 fps).
  Qalam chizilishi, titrash va yulduzchalar ikkitadan. Oxirgi pauza
  qimirlamaydi, faqat krossovka yengil tebranadi.
- **Ovoz sintezlangan:** musiqa qutisi, pufakchalar va soat chiqillashi,
  tushish va akkord, yo'l ritmi va har bekatda qo'ng'iroq, intro ohangi.

## Fayllar

- [`pochtam-reklama.html`](pochtam-reklama.html) — film manbasi: brief, beat
  sheet, chizmalar, kamera, intro va ovoz
- [`brand-assets.js`](brand-assets.js) — logotip bo'laklari va Onest shrifti,
  data-URL ko'rinishida (canvas "ifloslanmasligi" va oflayn render uchun)
- [`out/pochtam-reklama-final.mp4`](out/pochtam-reklama-final.mp4) — ovozli video;
  [`out/pochtam-reklama-poster.jpg`](out/pochtam-reklama-poster.jpg) — muqova;
  [`out/pochtam-reklama-contact.jpg`](out/pochtam-reklama-contact.jpg) — kontakt varag'i
- Dvigatel: `core.js`, `studio.js`, `cels.js`, `materials.js`, `render.mjs` —
  [`hand-drawn-canvas-animation`](../../.claude/skills/hand-drawn-canvas-animation/)
  skill'idan o'zgartirilmasdan nusxa olingan (MIT)

## Render qilish

```bash
cd films/pochtam-reklama
npm i --no-audit --no-fund
node render.mjs pochtam-reklama.html --grid 36 --out out       # tezkor ko'rik
node render.mjs pochtam-reklama.html --strip 252,36 --out out  # p tushishi
node render.mjs pochtam-reklama.html --out out                 # to'liq MP4 + ovoz (~1 daqiqa)
```

Matnlar, raqamlar va vaqtlar `pochtam-reklama.html` ichida joylashgan:
`T` (vaqtlar), `STOPS` (bekatlar), `BUBBLES` (savollar) va `captions()`.

## Tekshiruv va cheklovlar

- MP4 xatosiz ochiladi: 792 kadr, 33,0 s, 1080×1920. Ovoz balandligi eng
  yuqori nuqtada -9,4 dB. Oxirgi pauzadagi kadrlar aynan bir xil.
- Harakat ketma-ket kadrlar lentasi va alohida kadrlar orqali tekshirildi.
  Bu muhitda videoni odatiy tezlikda tomosha qilish va ovozni eshitish
  imkoni bo'lmadi.
- Krossovka va do'kon sahifasi umumiy tarzda chizilgan, hech qaysi brendga
  o'xshatilmagan. Uchinchi tomon do'kon va kuryer logotiplari ataylab
  ishlatilmagan.
- `$89` va `$101` misol sifatida olingan summalar, real narx emas.
- Brend assetlari Pochtam'ga tegishli. Onest shrifti SIL Open Font License
  1.1 ostida.

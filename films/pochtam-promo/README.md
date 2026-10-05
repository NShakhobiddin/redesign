# Pochtam — tezkor promo (30 s)

[pochtam.uz](https://pochtam.uz) uchun noldan qayta ishlangan 30 soniyalik
vertikal (9:16) promo. Reels, TikTok va Telegram uchun mo'ljallangan. Kadrlar
har 0,25–2 soniyada almashadi. Birinchi kadrdanoq savol bilan boshlanadi:
*"Xitoyda shu narxda. Uyingizgacha qanchaga tushadi?"*

![Kadr](out/pochtam-promo-poster.jpg)

- Video (vaqtinchalik musiqa bilan): [`out/pochtam-promo-final.mp4`](out/pochtam-promo-final.mp4)
- Ovozsiz nusxa (o'z musiqangiz uchun): [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4)
- Musiqa uchun prompt, soniyama-soniya: **[`MUSIC-PROMPT.md`](MUSIC-PROMPT.md)**
- Vaqtinchalik musiqa (namuna): [`out/pochtam-promo-score.mp3`](out/pochtam-promo-score.mp3)
- Kadrlar varag'i: [`out/pochtam-promo-contact.jpg`](out/pochtam-promo-contact.jpg)

## Ketma-ketlik

Montaj 120 BPM to'rida: zarb 0,5 s, takt 2 s. Har bir kesim zarbga yoki
yarim zarbga tushadi.

| Vaqt | Ekranda | Kesimlar |
| --- | --- | --- |
| 0–1 s | Krossovka va ¥699 yorlig'i: **"Xitoyda shu narxda"** | birinchi kadrdan to'liq kompozitsiya |
| 1–2 s | **"Uyingizgacha qanchaga tushadi?"** | so'zlar zarbda "urilib" chiqadi |
| 2–3 s | **Boj? · Kargo? · Kurs? · Kuryer?** | har 0,25 s da yangi rang va so'z |
| 3–4 s | **"Javob — bitta skrinshotda"**, telefon ko'tariladi, oq chaqnash | |
| 4–5 s | **Drop**: ilovaning logotip introsi | |
| 5–7 s | **Rasmini yuklang** — AI tovarni topadi | bosish → skan → topilgan do'konlar |
| 7–9 s | **Skrinshot oling** → **AI narxni o'qiydi**: jami $102.20 (misol) | do'kon sahifasi, chaqnash, hisob |
| 9–11 s | **Narx tarkibi** (qatorlar belgilanadi), **Boj: $0** — $200 me'yor ichida | |
| 11–13 s | **Butun savat?** → **Bitta skrinshot — bitta hisob**: 3 ta tovar → $117.99 | |
| 13–15 s | **Eng arzon kuryer** → **Kuryer siz uchun sotib oladi**: "Yozish", "Xabar tayyor ✓" | |
| 15–17 s | **Qadam-baqadam qo'llanma** (7 ta do'kon uchun) | ekran har 0,5 s da |
| 17–19 s | **Jo'natmani kuzating**: Topish → Narx → Buyurtma → Yo'lda → Keldi | |
| 19–22 s | **43** do'kon · **20** kuryer · **7** qo'llanma · **$200** oyiga bojsiz · **AI** · **3 til** | har zarbda bitta raqam |
| 22–24 s | **"Hammasi — bitta ilovada"**: ilova ekranlari mozaikasi | |
| 24–26 s | **Drop 2**: quti eshik oldiga tushadi — **"Orzuingiz — eshigingiz oldida."** | |
| 26–30 s | Logotip, **pochtam.uz**, "Orzu qiling — qolganini biz hal qilamiz" | |

## Qanday ishlangan

- **Ekranlar ilovaning hozirgi holatidan olingan.** Ilova repozitoriyi
  (`NShakhobiddin/Pochtachi`, 2026-yil 5-oktabr, `d1fbbaf`) lokal serverda
  ochilib, telefon o'lchamida (390×844, 2x) Chromium'da ichidan o'tildi
  ([`tools/capture-v2.mjs`](tools/capture-v2.mjs)). Tarmoqqa chiqish yo'q edi:
  AI va Markaziy bank kurslari javoblari ilovaning smoke-testi uslubida
  soxta javob (mock) bilan berildi. Jonli Worker'ga ham, AI'ga ham so'rov
  ketmagan.
- **Yuklangan sahifalar** — umumiy, brendsiz do'kon va savat sahifalari
  ([`tools/demo-store-page.html`](tools/demo-store-page.html),
  [`tools/demo-cart-page.html`](tools/demo-cart-page.html)). Ularni
  [`tools/render-pages.mjs`](tools/render-pages.mjs) rasmga aylantiradi.
- **Raqamlar** ilovaning o'z formulalari bilan hisoblangan. Kurs sinov
  qiymati (1 USD = 12 650 so'm), shuning uchun jami summalar ekranda
  "misol" deb belgilangan. 43 do'kon, 20 kuryer, 7 qo'llanma va oyiga $200
  gacha bojsiz qoidasi ilova ma'lumotlaridan tekshirildi.
- Ekranlar WebP holida [`screens.js`](screens.js) ga joylangan
  ([`tools/embed.mjs`](tools/embed.mjs)). Brend shrifti Onest, logotip
  bo'laklari [`brand-assets.js`](brand-assets.js) da.
- **Ko'rinish** — Pochtam ranglari (ko'k #1A1FB0, salat #bbef45, to'q
  ko'k, och binafsha). Katta harakatli yozuvlar, butun kadrni egallagan rangli
  fonlar, telefon ichida haqiqiy ekranlar (status-bar bilan). Kamera telefonga
  yaqinlashadi, bosishlar to'lqin bilan, muhim joylar salat ramka bilan
  ko'rsatiladi. Skrinshot paytida viewfinder burchaklari va oq chaqnash
  chiqadi, zarbalarda kadr bir oz silkinadi.
- **Ovoz.** Video tashqi trek uchun kesilgan (prompt:
  [`MUSIC-PROMPT.md`](MUSIC-PROMPT.md)). Ichidagi vaqtinchalik musiqa xuddi
  shu to'rda Web Audio bilan sintez qilingan va faqat ohangli tovushlardan
  iborat: F#m–D–A–E akkordlari, 120 BPM, ikkita drop, logotip zarbasi.

## Fayllar va buyruqlar

```bash
cd films/pochtam-promo
npm i --no-audit --no-fund
# 1) yuklanadigan sahifalar va ekranlar (Pochtachi checkout'ida, playwright bilan)
node tools/render-pages.mjs /tmp/pp
cp tools/capture-v2.mjs <Pochtachi>/.capture-promo.mjs && (cd <Pochtachi> && node .capture-promo.mjs /tmp/cap /tmp/pp)
node tools/embed.mjs /tmp/cap /tmp/pp
# 2) render, ovoz balandligi, ovozsiz nusxa
node render.mjs pochtam-promo.html --out out
cd out && ffmpeg -y -i pochtam-promo.mp4 -i pochtam-promo-score.wav -map 0:v:0 -map 1:a:0 \
  -af "volume=2.2dB,alimiter=limit=0.891:attack=5:release=80:level=disabled,apad" -t 30 \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart pochtam-promo-final.mp4
ffmpeg -y -i pochtam-promo.mp4 -c:v copy -an -movflags +faststart pochtam-promo-silent.mp4
```

## Tekshiruv va cheklovlar

- MP4 xatosiz dekodlanadi: 720 kadr, 30,0 s, 1080×1920, 24 fps, ovoz AAC
  48 kHz. Vaqtinchalik musiqa −11,3 LUFS, eng baland nuqta −1,5 dBFS.
  6 kHz dan yuqorida energiya deyarli yo'q (−65,8 dB), ya'ni shovqin yo'q.
- Grid, ketma-ket kadrlar (hook 0–4 s) va to'liq o'lchamdagi kadrlar ko'zdan
  kechirildi: telefon ichidagi ekranlar kesilmaydi, sarlavhalar telefon
  ostida qolmaydi.
- Bu muhitdan pochtam.uz ning o'ziga kirib bo'lmadi. Shuning uchun ekranlar
  repozitoriydagi kod bilan lokal serverda olindi.
- Videoni odatiy tezlikda ko'rish va ovozni eshitish imkoni bo'lmadi.

# "Ishonmang, lekin bajarib ko‘ring!" — kitob reklamasi

Dilshod Mannopov (psixolog-trenyer) kitobi uchun 36 soniyalik vertikal
(9:16) reklama-motivatsion video. Instagram Reels, Telegram va TikTok uchun.

![Limon tajribasi](out/kitob-reklama-preview.gif)

## G'oya: video tajribani tomoshabinning o'zida o'tkazadi

Kitobning eng kuchli joyi — **limon tajribasi**: limonni faqat tasavvur
qilasiz, lekin og'izda so'lak paydo bo'ladi. Video shu tajribani
tomoshabin bilan birga qiladi. Tomoshabin natijani o'z tanasida his
qiladi va kitob nima haqida ekanini darhol tushunadi.

| Vaqt | Sahna | Ekranda |
| --- | --- | --- |
| 0–2.8 s | Ilmoq | **"Ishonmang."** → *"Lekin bajarib ko‘ring."* |
| 2.8–4.4 s | Taklif | *"20 soniyalik tajriba. Tasavvur qiling…"* |
| 4.4–8.4 s | Limon krem chiziqlar bilan o'zini chizadi, sariqqa to'ladi, undan hid ko'tariladi | *"Yangi uzilgan, sap-sariq limon." · "Hidi o‘tkir, nordon…"* |
| 8.4–11 s | Pichoq: limon ikkiga bo'linadi, sharbati tomadi | *"Teng ikkiga kesing — shart!" · "Sharbati tomchilab oqyapti…"* |
| 11–13.6 s | Muqovadagidek limon bo'lagi, tishlanadi, sharbat sachraydi | *"Endi… tishlang!"* → **"G‘ARCHCH!"** |
| 13.6–16.8 s | Chizilgan yuz: hayrat → burishish (titraydi) → yengillik | *"Og‘zingizda so‘lak keldimi?"* |
| 16.8–19.7 s | Limon teskari tartibda "o'chib", yo'qoladi | **"To‘xtang." · "Qani limon?"** |
| 19.8–23.6 s | Xulosa, kitobdan iqtibos (muallif nomi bilan) | *"Limon yo‘q edi. Lekin tanangiz ishondi."* · «Tanangiz uchun reallik bilan tasavvurning zarracha farqi yo‘q.» |
| 23.6–26.9 s | Kitobdagi raqam | **5% so‘z / 95% tasavvur** |
| 26.9–30.2 s | Kitobda nima bor | Limon effekti · 18 yosh kodi · Ongning qarshiligini yengish · Ichki qo‘riqchilar — *4 bob · 4 amaliyot* |
| 30.2–36 s | Haqiqiy muqova (kitob ko'rinishida) | **"Ishonmang — bajarib ko‘ring!"** · «Qomatni rostlang, tabassum qiling!» · Dilshod Mannopov |

## Uslub

- **Muqovaning o'zi.** Ranglar muqovadan olingan: to'q yashil-moviy
  `#0a3f48`, limon sarig'i `#f6ca44`, krem `#fbf7ea`. Shriftlar ham
  muqovadagi: Fraunces (sarlavhalar), Literata italic (matn), Poppins
  (yorliqlar). Hammasi SIL OFL, Google Fonts'dan olinib, faylga joylangan.
- **Qo'lda chizilgan siyoh va tekis bosma rang.** Limon avval krem
  chiziqlar bilan chiziladi, sariq rang to'lganda chiziqlar to'q siyohga
  o'tadi. Kesilgan yarimlar qattiq jism kabi harakatlanadi. Tishlangan bo'lak
  alohida chizma bilan almashtiriladi. Yuz 5 ta butun chizmadan iborat.
- **Exposure.** Kesish, tomchilar, tishlash va sachrash birtadan (24 fps).
  Chizilish, titrash va hid chiziqlari ikkitadan. Iqtibos va muqova uzoq
  ushlab turiladi.
- **Da'volar.** Video faqat kitobning o'z fikrlarini keltiradi, iqtibosda
  muallif nomi ko'rsatilgan. Reklama o'zidan tibbiy va'da qo'shmaydi.

## Fayllar

- [`kitob-reklama.html`](kitob-reklama.html) — film manbasi: brief, beat
  sheet, chizmalar, matnlar va ovoz
- [`book-assets.js`](book-assets.js) — muallif PDF'idan chizilgan muqova va
  shriftlar, data-URL ko'rinishida. PDF'ning o'zi repozitoriyaga
  qo'shilmagan
- [`out/kitob-reklama-final.mp4`](out/kitob-reklama-final.mp4) — ovozli video;
  [`out/kitob-reklama-poster.jpg`](out/kitob-reklama-poster.jpg) — muqova kadr;
  [`out/kitob-reklama-contact.jpg`](out/kitob-reklama-contact.jpg) — kontakt varag'i
- Dvigatel: [`hand-drawn-canvas-animation`](../../.claude/skills/hand-drawn-canvas-animation/)
  skill'i (MIT)

## Render qilish

```bash
cd films/kitob-reklama
npm i --no-audit --no-fund
node render.mjs kitob-reklama.html --grid 36 --out out   # tezkor ko'rik
node render.mjs kitob-reklama.html --out out             # to'liq MP4 + ovoz (~2 daqiqa)
```

## Tekshiruv va cheklovlar

- MP4 xatosiz ochiladi: 864 kadr, 36,0 s, 1080×1920. Ovoz balandligi eng
  yuqori nuqtada -7,6 dB. Oxirgi pauzadagi 62 kadr bir xil.
- Harakat kadrlar orqali tekshirildi. Bu muhitda videoni odatiy tezlikda
  tomosha qilish va ovozni eshitish imkoni bo'lmadi.
- Kitobni sotib olish manzili (sayt, Telegram, narx) PDF'da yo'q, shuning
  uchun videoda ham ko'rsatilmagan. Kerak bo'lsa, oxirgi kadrga qo'shiladi.

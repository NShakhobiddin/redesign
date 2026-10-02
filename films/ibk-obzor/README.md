# Bojxona xodimi qo'llanmasi — obzor

Yangilangan **"Bojxona xodimi qo'llanmasi"** (Toshkent-AERO IBK) saytining
29,5 soniyalik rasmiy video obzori. Format vertikal (9:16), Telegram,
Instagram va boshqa platformalar uchun mo'ljallangan.

Sayt: <https://nshakhobiddin.github.io/ibkdarslik/>

![Kadr](out/ibk-obzor-poster.jpg)

- Video: [`out/ibk-obzor-final.mp4`](out/ibk-obzor-final.mp4) (1080×1920, 24 fps, ovozli)
- Kadrlar varag'i: [`out/ibk-obzor-contact.jpg`](out/ibk-obzor-contact.jpg)

## Nima aytiladi

| Vaqt | Sarlavha | Telefonda (saytning haqiqiy ekranlari) |
| --- | --- | --- |
| 0–3 s | **Bojxona xodimi qo'llanmasi**, "Yangilandi · 2-oktabr, 2026" | Qo'llanma gerbi |
| 3–8 s | Yangilangan versiya: **Interaktiv o'quv qo'llanma** (10 modul, 95 qadam, telefon va Telegram) | Bosh sahifa. "Darslar" bosiladi, o'quv yo'li PF-174 moduligacha suriladi |
| 8–14 s | Yangi bo'lim: **PF-174 farmoni qo'shildi** (23 qadam, videodars, 20 savollik test) | PF-174 moduli, "Darsni boshlash", 2030-yil maqsadlari |
| 14–19,5 s | **Videodarslar joylandi**: 10 ta videodars, subtitr, tezlik, kalkulyatorlar | PF-174 videodarsi qalamda chizilib boradi, keyin import kalkulyatori |
| 19,5–25,5 s | **Test topshirish mumkin**: yakuniy test (25 savol, 30 daqiqa, 100 ball), natija tahlili, o'quv sertifikati, PF-174 testi | Test sahifasi, savol, javob tanlanadi, natija (92 ball, a'lo), sertifikat |
| 25,5–29,5 s | **Qo'llanmani hoziroq oching**: Telegram bot manzili **t.me/ibkdarslik_bot** va uning QR-kodi, "Telegram bot orqali oching". "Huquqiy ma'lumotlar 2026-yil 2-oktabr holatiga ko'ra" | — |

## Qanday ishlangan

- **Ekranlar saytning o'zidan olingan.**
  [`tools/capture.mjs`](tools/capture.mjs) qo'llanma repozitoriyini lokal
  serverda ochadi va Chromium'da telefon o'lchamida (390×844, 2x) ichidan
  o'tadi. Bosh sahifa, darslar ro'yxati, PF-174 moduli va darsi, ishlayotgan
  videodars, kalkulyator, PF-174 testi, yakuniy test, natija va sertifikat
  suratga olinadi. Natija toza holatdan ochilgan haqiqiy urinishdan olingan:
  25 savoldan 23 tasiga to'g'ri javob berilgan. Ekranlar JPEG holida
  [`shots.js`](shots.js) ga yoziladi. Shu fayldan bosish nuqtalarining
  koordinatalari ham olinadi.
- **Telefon ichidagi harakat.** Bosishlar barmoq izi va to'lqin bilan
  ko'rsatiladi. Ekranlar ilovadagidek o'tadi: yon tomondan surilish yoki
  almashinish. Sertifikat varag'i pastdan chiqadi. Darslar ro'yxati sarlavha
  va pastki menyu joyida turgan holda suriladi. Natijada konfetti uchadi.
- **Ko'rinish** qo'llanmaning o'z dizayn tizimida: to'q ko'k (#0b1f3a),
  ko'k (#2563eb), PF-174 bo'limining binafsha rangi, oltin urg'u va saytning
  shrifti Plus Jakarta Sans (SIL OFL 1.1, [`fonts.js`](fonts.js)).
- **QR-kod** qo'llanmaning Telegram botiga (<https://t.me/ibkdarslik_bot>)
  olib boradi. Uni [`tools/qr.mjs`](tools/qr.mjs) (`qrcode` paketi)
  [`qr.js`](qr.js) ga yozadi, film esa kodni katakma-katak o'zi chizadi.
  Yakuniy MP4 dagi QR-kod skaner kutubxonasi (jsQR) bilan o'qib
  tekshirildi: aynan shu manzil chiqadi.
- **Ovoz** to'liq shu faylda Web Audio bilan sintez qilingan va faqat
  ohangli tovushlardan iborat: chertma akkordlar, yumshoq fon, bas, past
  zarb, bosishdagi qisqa "pop" tovushlar va sahna almashganda ko'tariluvchi
  ohang. Re-majorda, daqiqasiga 120 zarb.

## Fayllar va buyruqlar

- [`ibk-obzor.html`](ibk-obzor.html) — film. Unda brif, telefon va ekranlar
  jadvali (`SEG`, `TAPS`), sarlavhalar (`HEADS`), ochilish va yakun kadrlari,
  hamda musiqa (`score`) bor.
- [`tools/capture.mjs`](tools/capture.mjs), [`tools/qr.mjs`](tools/qr.mjs).

```bash
# 1) qo'llanmani lokal serverda ochish (alohida terminalda)
git clone https://github.com/NShakhobiddin/ibkdarslik && cd ibkdarslik && python3 -m http.server 8765
# 2) ekranlarni olish, QR-kod, render
cd films/ibk-obzor
npm i --no-audit --no-fund
node tools/capture.mjs http://127.0.0.1:8765/index.html
node tools/qr.mjs
node render.mjs ibk-obzor.html --out out
cd out && ffmpeg -y -i ibk-obzor.mp4 -i ibk-obzor-score.wav -map 0:v:0 -map 1:a:0 \
  -af "volume=5.2dB,alimiter=limit=0.891:attack=5:release=80:level=disabled,apad" -t 29.5 \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart ibk-obzor-final.mp4
```

## Tekshiruv va cheklovlar

- MP4 xatosiz dekodlanadi: 708 kadr, 29,5 s (30 soniyadan kam), 1080×1920,
  ovoz AAC 48 kHz. Ovoz balandligi −15,1 LUFS, eng baland nuqta −1,5 dBFS.
  6 kHz dan yuqori chastotalarda energiya deyarli yo'q, ya'ni shovqin yo'q.
- Grid, to'liq o'lchamdagi kadrlar va yakuniy MP4 dan olingan ketma-ket
  kadrlar ko'zdan kechirildi: ro'yxatning surilishi, ekranlar o'tishi,
  sertifikat varag'i, yorliqlar qatori va QR-kod.
- Bu muhitda saytning o'ziga (nshakhobiddin.github.io) kirish tarmoq siyosati
  bilan yopiq edi. Shuning uchun ekranlar repozitoriyning
  2026-yil 2-oktabrdagi holatidan (`c8aacd6`) lokal serverda olindi. Bu
  GitHub Pages'dagi bilan bir xil kod.
- Videoni odatiy tezlikda ko'rish va ovozni eshitish imkoni bo'lmadi.

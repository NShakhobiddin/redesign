# Mobil telefon deklaratsiyasi — montaj

Videoni montaj qiluvchi kod shu papkada. Kadrlar, ovozlar va tayyor video
(aeroport, bojxona, ekran yozuvi) ochiq repozitoriyga **qo'shilmaydi**: kod
ularni `--media` papkasidan nomi bo'yicha topadi, oraliq va tayyor fayllarni
`--work` papkasiga yozadi. Sahnalar: [`SSENARIY.md`](SSENARIY.md).

## 2-versiya — 2:29

Video 1080×1920, 30 fps. Ovoz balandligi −14 LUFS. Hamma vaqtlar diktor
ovoziga qarab qo'yilgan.

| Vaqt | Sahna | Kadr | Ekranda |
| --- | --- | --- | --- |
| 0:00 | 1 · Hook | Flow: illyuminator → K05 (qo'lda telefon) → 4 ta tez kadr (sayt, xodim, QR, chiqish) | "Yangi telefon?", muhr "Deklaratsiya majburiy!", "Qanday? Hozir ko'rsatamiz" |
| 0:08 | 2 · Qo'nish | Flow: g'ildirak "Xush kelibsiz!" so'zida yerga tegadi → K03 | "Xush kelibsiz!" |
| 0:15 | 3 · Bagaj zali | K04 → K04-alt → K05 | "Bagaj kutyapsizmi?" |
| 0:22 | 4 · Sayt | K05 → saytning o'zi (ekran yozuvi) | manzil yoziladi, saytga QR-kod, "Ilova o'rnatish shart emas" |
| 0:30 | 5 · To'ldirish | ybdweb ekran yozuvi | 1–4-qadam, "Mobil qurilmani deklaratsiyalash" tugmasi belgilanadi |
| 0:44 | 6 · IMEI maslahati | AI01 → *#06# grafikasi | `*#06#`, IMEI 1 · IMEI 2 |
| 0:54 | 5 · Tekshiruv | ekran yozuvi, 3 ta tez kadr | shakllantirish → joylashuv → bojxona tekshiruvi 100% |
| 0:57 | 5 · QR-kod | ekran yozuvi | 5-qadam, QR-kod va "Yuklab olish" belgilanadi |
| 1:02 | 7 · Qiymat | grafika, orqada xiralashgan zal | $1 000 me'yor, $1 300 misolida +$300 |
| 1:10 | 8 · Istisno | grafika | UZIMEI'dagi telefon |
| 1:16 | 9–10 · Nazorat | K06 → K07 → AI03 → K07 (yo'lovchi o'tib ketadi) | "Bojxona nazorati", "Me'yor ichida — to'lovsiz" |
| 1:31 | 11 · Oshganda | AI04 → AI05 | yagona bojxona to'lovi, to'lovdan keyin BKO |
| 1:40 | 12 · To'lov | K08 → to'lov grafikasi | 1 · bank kassasi, 2 · istalgan to'lov tizimi |
| 1:48 | 13 · BKO | AI06 (chekni uzatadi) | "BKO — bojxona kirim orderi" |
| 1:56 | 14 · UZIMEI | grafika → K09b (IMEI kioski) → grafika → K09-pullik-xizmat | "Oxirgi qadam — hamma uchun", IMEI → UZIMEI, uzimei.uz · Birda · Bojxona servis |
| 2:10 | 15 · Eslatma | K10 → xiralashtirilgan | 5 band |
| 2:23 | 16 · Yakun | K10, xiralashtirilgan | «Toshkent-AERO», ybdweb.customs.uz, uzimei.uz |

1-versiyadan farqlar:
- **Lab harakati.** Xodimning har bir gapi bo'laklarga bo'lingan va
  Veo'dagi xodim og'zini ochgan joyga qo'yilgan. Bo'lak ±12–18 % ga
  cho'ziladi yoki qisqaradi (`SYNC` jadvali). AI03 dagi gapning ikkinchi
  yarmi ("Me'yor ichida — to'lov yo'q. Marhamat…") yo'lovchi o'tib ketayotgan
  kadrga ko'chirildi, chunki Veo xodimi qisqaroq gapirgan.
- **Sust joylar qisqardi:**
  - pauzalar 0,45 dan 0,3 soniyaga tushdi;
  - tekshiruv kadrlari 4,6 dan 2,7 soniyaga qisqardi;
  - QR skanerlashdagi jimlik 3,3 dan 1,7 soniyaga qisqardi.
- **Hook.** Bitta uzun kadr o'rniga uch kadr, oxirida videoning qisqa
  ko'rinishi (teaser).
- **4-sahna.** Tugashida saytning o'zi ochiladi.
- **14-sahna.** "Ro'yxatdan o'tkazing" so'zida haqiqiy IMEI kioski,
  "Bojxona servis" so'zida — haqiqiy peshtaxta.
- **Grafika sahnalari.** Orqasida xiralashgan, harakatlanuvchi kadr bor;
  bir xil yashil fon endi yo'q.

Ssenariydan farqi: IMEI maslahati (xodim) 4-qadamdan keyin turadi, ya'ni
aynan IMEI kiritiladigan joyda. Diktorning 5-sahnadagi gaplari uchun
keyingi yozilgan ovoz (10:32) olindi.

## Maxfiylik

Montajdan oldin ekran yozuvida xiralashtiriladi (`tools/edit.py`, `MASKS`):
- pasport seriya-raqami va klaviaturadagi taklif;
- Face ID'dagi yuz;
- IMEI raqamlari;
- ro'yxatga olish raqami, haqiqiy QR-kod va skrinshot nusxasi.

Kadrlarda:
- K09-kompyuterda kadri ishlatilmadi (o'rniga AI06), K09b va K09-kioskda
  kadrlaridan yo'lovchining yuzi ko'rinmaydigan qismi olinadi.

Ishlatilmaganlar:
- yo'lak belgilari (K07-alt);
- valyuta ayirboshlash (K08-alt);
- ma'lumot peshtaxtasi (K09);
- K01 va K05-alt — ularning o'rnini ekran yozuvi egalladi;
- K09-kompyuterda va K09-kioskda — vaqt yetmadi.

## Hali kerak

1. **Musiqa** — [`MUSIC-PROMPT.md`](MUSIC-PROMPT.md). Video 2:29. Suno'da
   Duration'ni 2:40 qilib qo'ying, qisqaroq bo'lsa ham uzaytiraman.
2. Ixtiyoriy: to'lov ilovasining ekran yozuvi (hozir brendsiz grafika).

## Qayta yig'ish

```
export TEL_MEDIA=/kadrlar/papkasi TEL_WORK=/ish/papkasi
python3 tools/edit.py cues      # vaqtlar -> cues.js
python3 tools/edit.py clean     # ekran yozuvini xiralashtirish
python3 tools/edit.py video     # kadrlar -> base.mp4
python3 tools/edit.py audio     # diktor, xodim, fon, effektlar -> voice-mix.wav
npm install && node tools/render-overlay.mjs --out $TEL_WORK/overlay
python3 tools/edit.py final --out telefon-deklaratsiya.mp4
```

[`overlay.html`](overlay.html) ni brauzerda ochsangiz, yozuvlar va grafikani
vaqt bo'yicha ko'rish mumkin.

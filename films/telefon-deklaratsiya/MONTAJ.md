# Mobil telefon deklaratsiyasi — montaj

Videoni montaj qiluvchi kod shu papkada. Kadrlar, ovozlar va tayyor video
(aeroport, bojxona, ekran yozuvi) ochiq repozitoriyga **qo'shilmaydi**: kod
ularni `--media` papkasidan nomi bo'yicha topadi, oraliq va tayyor fayllarni
`--work` papkasiga yozadi. Sahnalar: [`SSENARIY.md`](SSENARIY.md).

## 1-versiya (qoralama) — 2:33

Video 1080×1920, 30 fps. Ovoz balandligi −14 LUFS. Hamma vaqtlar diktor
ovoziga qarab qo'yilgan.

| Vaqt | Sahna | Kadr | Ekranda |
| --- | --- | --- | --- |
| 0:00 | 1 · Hook | Flow: illyuminator, qo'lda telefon | "Yangi telefon?" + muhr "Deklaratsiya majburiy!" |
| 0:08 | 2 · Qo'nish | Flow: Uzbekistan Airways qo'nadi → K03 | "Xush kelibsiz!" |
| 0:15 | 3 · Bagaj zali | K04 → K04-alt → K05 | "Bagaj kutyapsizmi?" |
| 0:22 | 4 · Sayt | K05 | manzil yoziladi, saytga QR-kod, "Ilova o'rnatish shart emas" |
| 0:29 | 5 · To'ldirish | ybdweb ekran yozuvi | 1–4-qadam kartochkalari, "Mobil qurilmani deklaratsiyalash" tugmasi belgilanadi |
| 0:44 | 6 · IMEI maslahati | AI01 → *#06# grafikasi | `*#06#`, IMEI 1 · IMEI 2 |
| 0:55 | 5 · Tekshiruv | ekran yozuvi, tezlashtirilgan | shakllantirish → joylashuv → bojxona tekshiruvi 100% |
| 0:59 | 5 · QR-kod | ekran yozuvi | 5-qadam, QR-kod va "Yuklab olish" belgilanadi |
| 1:04 | 7 · Qiymat | grafika | $1 000 me'yor, $1 300 misolida +$300 |
| 1:13 | 8 · Istisno | grafika | UZIMEI'dagi telefon |
| 1:18 | 9 · Nazorat | K06 → K07 → AI03 | "Bojxona nazorati", "Me'yor ichida — to'lovsiz" |
| 1:35 | 11 · Oshganda | **AI04, AI05 o'rnida vaqtincha grafika** | yagona bojxona to'lovi, BKO |
| 1:44 | 12 · To'lov | K08 → to'lov grafikasi | 1 · bank kassasi, 2 · istalgan to'lov tizimi |
| 1:52 | 13 · BKO | **AI06 o'rnida vaqtincha K09-kompyuterda** | "BKO — bojxona kirim orderi" |
| 1:58 | 14 · UZIMEI | grafika → K09-pullik-xizmat → K09-kioskda | IMEI → UZIMEI, uchta yo'l |
| 2:13 | 15 · Eslatma | K10, xiralashtirilgan | 5 band |
| 2:26 | 16 · Yakun | K10, xiralashtirilgan | «Toshkent-AERO», ybdweb.customs.uz, uzimei.uz |

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
- K09-kompyuterda: monitor (deklaratsiyalar ro'yxati) xiralashtiriladi.
- K09-kioskda: yo'lovchining yuzi ko'rinmaydigan qismi olinadi.

Ishlatilmaganlar:
- yo'lak belgilari (K07-alt);
- valyuta ayirboshlash (K08-alt);
- ma'lumot peshtaxtasi (K09);
- K01 va K05-alt — ularning o'rnini ekran yozuvi egalladi.

## Hali kerak

1. **AI04, AI05, AI06** — Flow'dagi xodim kliplari. Ovozi tayyor:
   AI04 5,4 s, AI05 3,2 s, AI06 5,6 s.
2. **Musiqa** — [`MUSIC-PROMPT.md`](MUSIC-PROMPT.md). Video 2:33 bo'ldi,
   musiqani bo'limlarini takrorlab uzaytiraman.
3. Ixtiyoriy: to'lov ilovasining ekran yozuvi (hozir brendsiz grafika).

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

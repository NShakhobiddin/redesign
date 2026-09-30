# Qalam

**Ustoz va murabbiylar kuni** uchun ikkinchi tabrik: shogirddan ustozi
**Dilshod Bahodirovich Mannopov**ga. 58 soniyalik vertikal (9:16) film.
Birinchi tabrik ("Bir chiroqdan — ming chiroq") bilan bitta videoga ham
ulanadi, pastda [Birlashgan video](#birlashgan-video) ga qarang.
Shogird ustozining portretini qalamda chizadi, har bir chizgi bilan bir xotira
aytiladi.

> **Rasm va video repozitoriyda yo'q.** Repozitoriy ochiq (public), shuning
> uchun ustozning surati (`portrait-photo.js`) va undan tayyorlangan video
> (`out/`) `.gitignore` orqali tashqarida qoldirilgan. Bu yerda faqat film
> kodi bor. Qayta render qilish uchun suratni `portrait-photo.js` ga
> `const PORTRAIT_PHOTO = "data:image/webp;base64,..."` ko'rinishida qo'ying.

## Hikoya

| Vaqt | Ekranda | Izoh (shogird tilidan) |
| --- | --- | --- |
| 0–9 s | Bo'sh qog'oz, qalam keladi, yordamchi chiziqlar (bosh, ko'z va burun chizig'i, yelka, qo'llar), keyin kamera ko'zlarga yaqinlashadi | *Sizni qalamda chizmoqchi bo'ldim… Qayerdan boshlashni bilmadim.* |
| 9–15 s | Yaqin plan: ko'zlar, keyin yuz chiziladi | *Ko'zlaringizdan boshladim — ular menga birinchi bo'lib ishongan edi.* |
| 15–20 s | Kamera biroz uzoqlashadi: soch, bo'yin; yordamchi chiziqlar o'chiriladi | *Har bir chizgi — bir xotira, bir saboq.* |
| 20–26 s | Kamera qo'llarga tushadi: birlashgan qo'llar | *Keyin qo'llaringiz… Siz menga nima o'ylashni emas, qanday o'ylashni o'rgatdingiz.* |
| 26–31 s | Butun rasm ko'rinadi: ko'ylak erkin chiziqlar bilan chiziladi va pastda qog'ozga singib ketadi; qalam ketadi | *Chizib bo'lgach, bir narsani angladim:* |
| 31–36 s | Qo'llar orasida kichik nur yonadi, undan iliq akvarel yoyiladi | *qo'llaringizda doim bir yorug'lik bo'lgan ekan.* |
| 36–41 s | Nurdan uchqunlar uchib, atrofda rasmlarga aylanadi: chiroq, kitob, yulduz, yurak, qog'oz samolyot, moychiroq | *Siz uni hammamizga ulashdingiz.* |
| 41–45 s | Tagiga «Qalbingga quloq sol!» qo'lda yozilgandek chiqadi va tagi chiziladi | — |
| 45–58 s | Portret yuqoriga ko'tariladi, tabrik chiqadi | Aziz Ustozim, Dilshod Bahodirovich Mannopov! Ustoz va murabbiylar kuni muborak bo'lsin! Bergan har bir saboqingiz — yo'limni yoritgan chiroq. Sizga sihat-salomatlik, baraka va shogirdlaringiz quvonchini tilayman. Minnatdor shogirdingiz |

## Surat qanday qalam rasmiga aylanadi

`buildPortrait()` kadrlar render qilinishidan oldin, sahifaning o'zida bir
marta ishlaydi. Maqsad fotofiltr emas, odam chizgan portret:

1. **Fonni olib tashlash.** Surat qirqiladi. Qora studiya foni chetdan
   boshlab qorong'i piksellar bo'ylab to'ldirish (flood fill) bilan olib
   tashlanadi. Keyingi barcha o'rtachalar faqat ustozning o'zidan olinadi,
   shuning uchun bosh chetida qora halqa qolmaydi.
2. **Tafsilot xaritasi.** Yuz, soch va qo'llar to'liq aniqlikda chiziladi.
   Ko'ylakdagi mayda yo'l-yo'l chiziqlar silliqlanadi, ular rastrga
   o'xshab qolmaydi.
3. **Haqiqiy shtrixlar.** Soya uch qatlam qalam shtrixidan iborat. Har bir
   qatlamda minglab qisqa, biroz egilgan chizgilar bor, ularning uzunligi va
   bosimi har xil. Birinchi qatlam o'ng qo'l qiyaligida chiziladi, soya
   quyuqlashgan sari keyingi qatlamlar ustiga kesishib tushadi. Yuzda
   shtrix kam, u yumshoq, surtilgan grafit bilan beriladi. Yorug' teri qog'oz
   rangida qoladi.
4. **Chiziq qatlami.** Har bir piksel atrofidagi o'rtacha yorug'lik bilan
   solishtiriladi (dodge usuli). Ko'z, qosh, lab va sochdagi tuklar shu
   qatlamda chiqadi.
5. **Qog'oz donadorligi.** Grafit qog'oz bo'rtiqlariga ilashadi: ikkala
   qatlam ham qog'oz tishiga qarab notekis tushadi.
6. **Erkin konturlar.** Qomat chegarasi marching squares usuli bilan
   chiziqlarga aylantiriladi. Ular bo'laklarga bo'linib, har biri alohida
   qalam chizig'i sifatida chiziladi, ba'zilari ikki marta.
7. **Vinyetka.** Rasm yelkadan pastda asta siyraklashib, qog'ozga singib
   ketadi. Tirsaklar va stol chizilmaydi, qirqib olingan qattiq chet yo'q.
8. **Chizilish tartibi.** Rasm shtrix qiyaligidagi ingichka izlar bilan
   ochiladi. Ular odam chizadigan tartibda chiqadi: ko'zlar, yuz, soch,
   bo'yin, qo'llar, ko'ylak. Konturlar va chiziqlar oldin, soya bir soniya
   keyin keladi.
9. **Qalam va kamera.** To'q yashil 2B qalamning qog'ozga soyasi tushadi.
   U chizgilar paydo bo'layotgan joyda shtrix chizgandek oldinga-orqaga
   yuradi, o'tishlar orasida ko'tariladi. Kamera ko'zlardan boshlab asta
   uzoqlashadi.

Rang faqat nur bilan keladi: qo'llar orasidan yoyilgan akvarel va atrofdagi
siyoh bilan chizilgan, akvarel bilan bo'yalgan rasmlar.

## Ovoz

Hamma tovush shu faylda Web Audio bilan sintez qilingan. Tayyor namuna
ham, shovqin ham yo'q.
- Pianino va musiqa qutisi G-majorda, daqiqasiga 72 zarb chalinadi.
- Portretning har bir qismi chizila boshlaganda yumshoq nota eshitiladi.
- Nur yonganda qo'ng'iroq chalinadi, har bir rasm paydo bo'lganda jiringlaydi.
- Balandlik: −17,7 LUFS, eng baland nuqta −1,5 dBFS.

## Fayllar

- [`ustoz-portret.html`](ustoz-portret.html) — film: brif, vaqtlar (`T`),
  izohlar (`CAPS`), portretni qayta ishlash (`buildPortrait`), rasmlar
  (`DOODLES`), tabrik (`card`), musiqa (`score`)
- `portrait-photo.js` — surat (mahalliy, repozitoriyda yo'q)
- [`fonts.js`](fonts.js) — Fraunces va Literata Italic (SIL OFL 1.1)

```bash
cd films/ustoz-portret
npm i --no-audit --no-fund
node render.mjs ustoz-portret.html --grid 24 --out out
node render.mjs ustoz-portret.html --out out
cd out && ffmpeg -y -i ustoz-portret.mp4 -i ustoz-portret-score.wav -map 0:v:0 -map 1:a:0 \
  -af "volume=7.5dB,alimiter=limit=0.891:attack=5:release=80:level=disabled,apad" -t 58 \
  -c:v copy -c:a aac -b:a 192k ustoz-portret-final.mp4
```

## Birlashgan video

Ikkala tabrik bitta videoda (1:42): avval "Bir chiroqdan — ming chiroq"
([`../ustoz-tabrik/`](../ustoz-tabrik/)) chiroqlar hikoyasi, keyin "Qalam",
oxirida bitta umumiy tabrik.

| Vaqt | Qism |
| --- | --- |
| 0–44 s | "Bir chiroqdan — ming chiroq": savollar, ustoz chirog'i, «Qalbingga quloq sol!», chiroq chiroqdan yonadi, nurlar kitobni chizadi. Kadr iliq qorong'ilikka so'nadi. |
| 44–102 s | "Qalam": portret chiziladi, qo'llar orasida nur yonadi, rasmlar uchib chiqadi, tabrik. |

Birinchi film `--look merge` rejimida render qilinadi: tabrik kartasisiz,
44 soniyada "Qalam" ochiladigan rangga so'nadi, musiqasi G–D bilan
yakunlanadi. Ikkala ovoz yo'lagi ulangach, bitta umumiy kuchaytirish
beriladi, shuning uchun qismlarning nisbiy balandligi o'zgarmaydi. Video
surat asosida bo'lgani uchun `out/` da qoladi, repozitoriyga qo'yilmaydi.

```bash
cd films/ustoz-tabrik
node render.mjs ustoz-tabrik.html --look merge --out ../ustoz-portret/out/birlashma
cd ../ustoz-portret
node render.mjs ustoz-portret.html --out out
cd out && ffmpeg -y -i birlashma/ustoz-tabrik.mp4 -i ustoz-portret.mp4 \
  -i birlashma/ustoz-tabrik-score.wav -i ustoz-portret-score.wav -filter_complex \
  "[0:v][1:v]concat=n=2:v=1:a=0[v];[2:a][3:a]concat=n=2:v=0:a=1,volume=7.5dB,alimiter=limit=0.891:attack=5:release=80:level=disabled[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k ustoz-tabrik-birlashgan.mp4
```

## Tekshiruv va cheklovlar

- MP4 xatosiz dekodlanadi: 1392 kadr, 58,0 s, 1080×1920, ovoz AAC 48 kHz.
- Grid, to'liq o'lchamdagi kadrlar va ketma-ket kadrlar (qalamning ko'zlarga
  o'tishi 7,2–7,9 s, qalam ketishi 30,1–30,5 s, kamera harakatlari) ko'zdan
  kechirildi. Qalam sakramaydi, kamera silliq yuradi. Yordamchi chiziqlar yuz
  chizilgach to'liq o'chadi. Qalam ham, rasm ham izohlarni to'smaydi.
- Birlashgan video xatosiz dekodlanadi: 2448 kadr (1056 + 1392), 1:42,0,
  1080×1920; ovoz −17,4 LUFS, eng baland nuqta −1,5 dBFS. Ulanish joyi
  (43–45 s) kadrma-kadr tekshirildi: birinchi film iliq qorong'ilikka so'nadi,
  "Qalam" aynan shu rangdan ochiladi, sakrash yo'q.
- Bu muhitda videoni odatiy tezlikda ko'rish va ovozni eshitish imkoni
  bo'lmadi.

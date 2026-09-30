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
| 0–9 s | Bo'sh qog'oz, qalam keladi, yordamchi chiziqlar (bosh, ko'z chizig'i, yelka, qo'llar) | *Sizni qalamda chizmoqchi bo'ldim… Qayerdan boshlashni bilmadim.* |
| 9–15 s | Ko'zlar, keyin yuz chiziladi | *Ko'zlaringizdan boshladim — ular menga birinchi bo'lib ishongan edi.* |
| 15–20 s | Soch, bo'yin; yordamchi chiziqlar o'chiriladi | *Har bir chizgi — bir xotira, bir saboq.* |
| 20–26 s | Birlashgan qo'llar | *Keyin qo'llaringiz… Siz menga nima o'ylashni emas, qanday o'ylashni o'rgatdingiz.* |
| 26–31 s | Ko'ylak, stol; qalam ketadi | *Chizib bo'lgach, bir narsani angladim:* |
| 31–36 s | Qo'llar orasida kichik nur yonadi | *qo'llaringizda doim bir yorug'lik bo'lgan ekan.* |
| 36–41 s | Nurdan uchqunlar uchib, atrofda rasmlarga aylanadi: chiroq, kitob, yulduz, yurak, qog'oz samolyot, moychiroq | *Siz uni hammamizga ulashdingiz.* |
| 41–45 s | Tagida «Qalbingga quloq sol!» yoziladi | — |
| 45–58 s | Portret yuqoriga ko'tariladi, tabrik chiqadi | Aziz Ustozim, Dilshod Bahodirovich Mannopov! Ustoz va murabbiylar kuni muborak bo'lsin! Bergan har bir saboqingiz — yo'limni yoritgan chiroq. Sizga sihat-salomatlik, baraka va shogirdlaringiz quvonchini tilayman. Minnatdor shogirdingiz |

## Surat qanday qalam rasmiga aylanadi

`buildPortrait()` kadrlar render qilinishidan oldin, sahifaning o'zida bir
marta ishlaydi:

1. **Fonni olib tashlash.** Surat qirqiladi. Qora studiya foni chetdan
   boshlab qorong'i piksellar bo'ylab to'ldirish (flood fill) bilan olib
   tashlanadi. Faqat ustozning o'zi qoladi, fon qog'ozga aylanadi.
2. **Chiziq qatlami.** Har bir piksel atrofidagi o'rtacha yorug'lik bilan
   solishtiriladi (dodge usuli). Qirralar va tuklar qalam chizig'iga aylanadi.
3. **Soya qatlami.** To'q joylarga diagonal shtrix bilan grafit soyasi
   beriladi. Ikkala qatlamda qog'oz donadorligi bor.
4. **Chizilish tartibi.** Rasm qalam kengligidagi taxminan 3000 ta "chizgi"
   bilan ochiladi. Ular odam chizadigan tartibda chiqadi: ko'zlar, yuz,
   soch, bo'yin, qo'llar, ko'ylak. Chiziqlar bir soniya oldin chiqadi, soya
   ulardan keyin keladi.
5. **Qalam.** Rasmdagi qalam aynan shu payt chizgilar paydo bo'layotgan
   joyda ishlaydi va shtrix chizgandek oldinga-orqaga yuradi.

Yakunda rang faqat qo'llar orasidagi nur va siyoh bilan chizilgan
rasmlarda bo'ladi.

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
  "[0:v][1:v]concat=n=2:v=1:a=0[v];[2:a][3:a]concat=n=2:v=0:a=1,volume=GAINdB,alimiter=limit=0.891:attack=5:release=80:level=disabled[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k ustoz-tabrik-birlashgan.mp4
```

## Tekshiruv va cheklovlar

- MP4 xatosiz dekodlanadi: 1392 kadr, 58,0 s, 1080×1920, ovoz AAC 48 kHz.
- Grid va to'liq o'lchamdagi kadrlar ko'zdan kechirildi. Yordamchi chiziqlar
  yuz chizilgach to'liq o'chadi. Qalam izohlarni to'smaydi.
- Bu muhitda videoni odatiy tezlikda ko'rish va ovozni eshitish imkoni
  bo'lmadi.

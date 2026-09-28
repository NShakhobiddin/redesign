# Tomchi tomib, tosh teshar

Maqol asosida qalamda chizilgan 38 soniyalik motivatsion film. Format vertikal
(9:16), telefon, Telegram va Instagram uchun mos.

![Yorilish va lola](out/tosh-teshar-preview.gif)

## G'oya

Og'ir tosh ostida kichkina urug' yotibdi. Barg uchidan tosh ustiga tomchilar
birma-bir tomadi. Har bir tomchi kichik, lekin ular to'xtamaydi.

1. **Sabr.** Tomchilar tosh ustiga tushadi. Suv yerga singib, urug'ga yetib
   boradi va uni uyg'otadi. Shu tomchilar ham toshni yoradi, ham urug'ni
   oziqlantiradi.
2. **Kurash.** Nihol toshga taqaladi va itaradi. Tosh qimirlamaydi. Nihol
   yana, kuchliroq itaradi.
3. **Vaqt.** Tomchilar tezlashadi. Har bir tomchi yoriqni biroz uzaytiradi.
4. **Yo'l topiladi.** Yoriq pastgacha yetganda, zulmatga ingichka oltin nur
   tushadi. Bu filmdagi birinchi rang. Nihol nurga qarab buriladi va yoriqqa
   kiradi.
5. **Yutuq.** Oxirgi og'ir tomchi tushadi, nihol esa shu lahzada itaradi.
   Tosh ikkiga bo'linadi. Nur yoriqdan tashqariga yoyilib, kulrang qalam
   dunyosini rangga bo'yaydi. Qizil lola ochiladi.
6. **Xulosa.** Osmonda maqol qo'lyozma bo'lib yoziladi:
   *"Tomchi tomib, tosh teshar."* Barg uchida esa yangi tomchi yig'ilmoqda,
   ya'ni ish davom etadi.

## Texnik ma'lumot

- 912 kadr, 24 fps, 1080×1920, 38 s, sintezlangan ovoz bilan
- [`tosh-teshar.html`](tosh-teshar.html) — film manbasi: brief, beat sheet,
  chizmalar, kamera, ovoz
- [`out/tosh-teshar-final.mp4`](out/tosh-teshar-final.mp4) — ovozli video;
  [`out/tosh-teshar-contact.jpg`](out/tosh-teshar-contact.jpg) — kontakt varag'i
- Dvigatel: `core.js`, `studio.js`, `cels.js`, `materials.js`, `render.mjs` —
  [`hand-drawn-canvas-animation`](../../.claude/skills/hand-drawn-canvas-animation/)
  skill'idan o'zgartirilmasdan nusxa olingan (MIT)

### Skill usullari qanday qo'llangan

- **Aralash material, sababi bilan.** Rang — bu nur. Urug' zulmatda ekan,
  dunyo grafitda chizilgan. Birinchi rang yoriqdan tushgan oltin ip.
  Yorilishdan keyin rang yoriqdan boshlab tarqaladi. O'tish chegarasidan
  nihol, tosh yarimlari, barg va kamera harakati uzilmay o'tadi.
- **Butun chizmalar.** Nihol 14 ta kalit pozadan iborat: o'sish, tegish,
  egilish, bo'shashish, kuchliroq egilish, nurga burilish, yoriqqa kirish,
  cho'kkalash va ko'tarilish. Barglar va lola ham kalit chizmalardan
  quriladi. Oraliq kadrlar `inbetweenCel` bilan faqat mos chiziqlar orasida
  yasaladi.
- **Uchidan o'sadigan narsalar.** Ildiz, yoriq va qo'lyozma bitta qat'iy
  chizmaning ochilishi sifatida chiziladi. Shu sababli chiziq izlari
  "suzmaydi".
- **Qattiq jism.** Tosh ezilmaydi: ikki yarim o'z tayanch nuqtasi atrofida
  buriladi va og'irlik bilan o'tiradi. Shtrixlar ham yarimlar bilan birga
  buriladi. Yoriqni kesib o'tadigan shtrixlar faqat butun toshda bor, shuning
  uchun yoriq oldindan ko'rinib qolmaydi.
- **Exposure.** Tomchi, sachrash, parchalar va toshning ochilishi birtadan;
  nihol, barg, lola va yozuv ikkitadan. Bosim paytida uzun ushlab turishlar.
- **Yozuv shriftsiz.** Harflar bir chiziqli qo'lyozma glif sifatida chizilgan,
  shu sababli har qanday kompyuterda bir xil chiqadi.

## Render qilish

```bash
cd films/tosh-teshar
npm i --no-audit --no-fund
node render.mjs tosh-teshar.html --grid 24 --out out      # tezkor ko'rik
node render.mjs tosh-teshar.html --strip 548,24 --out out # yorilish atrofi
node render.mjs tosh-teshar.html --out out                # to'liq MP4 + ovoz (~3 daqiqa)
```

Chrome/Chromium va `libx264` bilan qurilgan ffmpeg kerak. Chrome root sifatida
ishlasa, `--no-sandbox` qo'shadigan o'ram skriptni `CHROME=` orqali bering.

## Tekshiruv va cheklovlar

- MP4 xatosiz ochiladi: 912 kadr, 38,0 s. Ovoz balandligi eng yuqori
  nuqtada -6,4 dB. Oxirgi pauzadagi 62 kadr md5 bo'yicha bir xil, ya'ni
  chizmalar titramaydi.
- Harakat kontakt varag'i, ketma-ket kadrlar lentasi va alohida kadrlar
  orqali tekshirildi. Bu muhitda videoni odatiy tezlikda tomosha qilish va
  ovozni eshitish imkoni bo'lmadi.
- Nihol toshga nisbatan ingichka. Kurash sahnasi yaqin plan va kuch
  chiziqlari bilan kuchaytirilgan, lekin juda kichik ekranda nozik ko'rinishi
  mumkin.
- Chizmalar kod bilan yaratilgan, animator qo'li bilan emas.
- Video hajmi ~12 MB (CRF 18). Qalam donadorligi bitreytni oshiradi.

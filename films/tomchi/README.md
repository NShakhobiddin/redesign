# Tomchi — qalamda chizilgan qisqa film

Qiziquvchan shilliqqurt barg uchidagi shudring tomchisiga ko'z shoxchasi bilan
tegadi. Tomchi uning boshiga tushadi, shoxchalari zarb bilan ichkariga kiradi.
Keyin u sekin mo'ralab chiqadi, suvdan bahramand bo'lib jilmayadi.

![Tomchi](out/tomchi-preview.gif)

- **Davomiylik:** 8,3 s, 200 kadr, 24 fps, 1920×1080, 16:9
- **Ko'rinish:** `pencil` (asosiy), `?look=ink` / `--look ink` ham ishlaydi
- **Fayllar:** [`tomchi.html`](tomchi.html) — film manbasi (brief, chizmalar,
  exposure sheet, sahna, ovoz); [`out/tomchi-final.mp4`](out/tomchi-final.mp4) —
  ovozli video; [`out/tomchi-contact.jpg`](out/tomchi-contact.jpg) — kontakt varag'i
- **Dvigatel:** `core.js`, `studio.js`, `cels.js`, `render.mjs` —
  [`hand-drawn-canvas-animation`](../../.claude/skills/hand-drawn-canvas-animation/)
  skill'idan o'zgartirilmasdan nusxa olingan (MIT, Alexey Fateev)

## Skill usuli bo'yicha qanday qilingan

1. **Brief.** `brief-template.md` to'ldirildi, u film manbasining boshida turibdi.
2. **Butun pozalar (whole cels).** Shilliqqurtda bo'g'imli rig yo'q. Har bir
   kalit poza (`rest`, `notice`, `gather`, `stretch`, `touch`, `flinch`,
   `recoil`, `peek`, `happyUp`, `happy`) parametrlardan boshlab to'liq kontur
   sifatida qayta chiziladi: bo'yin, tomoq, oyoq, shoxchalar, chig'anoq.
   Chig'anoq qattiq jism: faqat suriladi va qiyshayadi, hech qachon ezilmaydi.
   Yumshoq tana esa cho'ziladi va siqiladi.
3. **Almashtirma chizmalar.** Ko'z yumish (`closed`), qisilgan ko'zlar
   (`shut`) va ho'l yuz (`wet`) — alohida chizmalar. Topologiyasi bir xil
   chizmalar orasidagina `inbetweenCel` ishlatiladi.
4. **Exposure sheet.** Uzoq ushlab turishlar; sekin cho'zilish ikkitadan
   (shilliqqurt sekin); tushish, zarba, sachrash va cho'chish birtadan;
   tiklanish ikkitadan. Barg prujinasi ikkitadan, tomchi birtadan.
5. **Kontakt.** Tomchi `touch` chizmasidagi yaqin shoxcha asosiga aynan
   `T+6` kadrda tushadi, `flinch` esa `T+7` da boshlanadi. Dum uchi va oyoq
   tagi butun film davomida yerda turadi. Kamera qimirlamaydi.
6. **Tekshiruv.** `--grid 24`, harakat atrofida `--strip 86,18`, yaqindan
   `--only` kadrlar, keyin to'liq MP4. Ushlab turilgan chizmalarning PNG'lari
   md5 bo'yicha bir xilligi tekshirildi. Shu tekshiruv oxirgi pauzada
   barg ikki chizma orasida "titrab" turganini ko'rsatdi; bu tuzatildi.

## Render qilish

Node 22.12+, Chrome/Chromium va `libx264` bilan qurilgan ffmpeg kerak.

```bash
cd films/tomchi
npm i --no-audit --no-fund
node render.mjs tomchi.html --grid 24 --out out        # tezkor ko'rik
node render.mjs tomchi.html --strip 86,18 --out out    # zarba atrofidagi kadrlar
node render.mjs tomchi.html --out out                  # to'liq MP4 + ovoz
node render.mjs tomchi.html --look ink --grid 24 --out out-ink
```

Chrome'ni root sifatida ishga tushirsangiz, u `--no-sandbox` talab qiladi.
Bunday holda `--no-sandbox` qo'shadigan kichik o'ram skript yozing va unga
`CHROME=/path/to/wrapper` orqali yo'l ko'rsating. HTML faylni brauzerda
to'g'ridan-to'g'ri ochib, filmni kadrma-kadr ko'rish va ovoz bilan
tinglash ham mumkin.

## Ma'lum cheklovlar

- Chizmalar kod bilan yaratilgan. Ular inson animatori qo'lida chizilgan
  kadrlar emas.
- Ushbu muhitda videoni normal tezlikda tomosha qilishning imkoni bo'lmadi.
  Harakat kontakt varag'i, ketma-ket kadrlar lentasi va alohida kadrlar
  orqali tekshirildi.
- Tomchi tushayotganda uch kadr davomida yaqin shoxcha ustidan o'tadi
  (chiziqlar bir-birini yopmaydi, qalam uslubida ustma-ust ko'rinadi).

# redesign

## Qo'lda chizilgandek animatsiya

[`alesha-pro/tools`](https://github.com/alesha-pro/tools/tree/main/skills/hand-drawn-canvas-animation)
repozitoriyasidagi `hand-drawn-canvas-animation` skill'i
[`.claude/skills/hand-drawn-canvas-animation/`](.claude/skills/hand-drawn-canvas-animation/)
papkasiga o'rnatilgan (MIT litsenziyasi, manba commit `98450c6`). Claude Code
bu repozitoriyada ishlaganda skill'ni avtomatik taniydi. Masalan, shunday
so'rash kifoya: *"10 soniyalik qalam uslubidagi film: mushuk kapalakni
quvlaydi"*.

Skill Canvas 2D va JavaScript yordamida film yaratadi. Headless Chrome
kadrlarni chizadi, ffmpeg esa ularni MP4'ga yig'adi. Blender, WebGL yoki
video modeli kerak emas. Beshta ko'rinish bor: ink, pencil, riso, screen va
doodle (foto ustida chizish). Shuningdek uchta dvigatel mavjud: found motion
(rotoskop), sand (qum animatsiyasi) va paper3d (pop-up kitob).

### Asosiy qoidalar (skill'dan o'rganilgani)

- **Butun pozalar.** Personaj aylanadigan bo'laklardan yig'ilmaydi. Har bir
  kalit poza to'liq qayta chiziladi, oraliq kadrlar (`inbetweenCel`) faqat
  mos keluvchi chiziqlar orasida quriladi.
- **Exposure sheet.** Har bir harakat uchun birtadan, ikkitadan yoki ushlab
  turish tanlanadi (24 fps). Tez harakat birtadan, sekin harakat ikkitadan.
- **Barqaror chiziqlar.** Tasodifiylik faqat seed orqali olinadi
  (`Math.random` ishlatilmaydi). Chizma ushlab turilganda uning chiziqlari
  ham qimirlamaydi, "boil" faqat ataylab qo'llanadi.
- **Kontakt va vazn.** Oyoq yerda turadi, tayyorgarlik (anticipation),
  zarba va tiklanish aniq kadrlarga rejalashtiriladi.
- **Tekshiruv.** Avval `--grid`, keyin `--strip` va `--only`, oxirida to'liq
  MP4. Faqat kontakt varag'ining o'zi harakatni tekshirishga yetmaydi.

### Namuna film

[`films/tomchi/`](films/tomchi/) — skill usulida noldan chizilgan 8 soniyalik
original film: shilliqqurt va shudring tomchisi.

![Tomchi](films/tomchi/out/tomchi-preview.gif)

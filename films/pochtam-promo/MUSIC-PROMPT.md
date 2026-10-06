# Pochtam promo — musiqa uchun prompt (soniyama-soniya)

Video 44,5 soniya, diktor ovozi bilan. Montaj **120 BPM** to'rida qilingan:
bitta zarb (beat) 0,5 s, bitta takt (bar) 2,000 s. Barcha kesimlar zarbga
tushadi. Logotip zarbasi va ikkinchi drop takt boshida keladi: **0:08** va
**0:38**. Musiqa diktor uchun fon bo'ladi, shuning uchun o'rta chastotalarda
bo'sh joy qoldiradi va gap paytida band melodiya chalmaydi.

Musiqa generatorlari ingliz tilidagi promptni yaxshiroq tushunadi, shuning
uchun promptlar inglizcha. Tushuntirishlar o'zbekcha. Diktor matni
[`VOICEOVER.md`](VOICEOVER.md) da.

- Ovozsiz video: [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4)
- Vaqtinchalik sintez musiqa (namuna, xuddi shu to'rda):
  [`out/pochtam-promo-score.mp3`](out/pochtam-promo-score.mp3)

## 1. Uslub (Suno: "Style of Music", Udio: prompt)

```
instrumental background music for a 45-second voice-over app commercial, energetic but uncluttered electro-pop / future bass, 120 BPM, F# minor, cold open on a hit with no intro, playful quiz-show hook with three answer pops at 0:03.5 and a ticking 3-2-1 clock at 0:04.5, 0:05 and 0:05.5, pitched riser into a logo drop at 0:08, light four-on-the-floor groove under narration, bouncy sub bass, soft plucky synth chords, glassy bell accents, short breakdown at 0:35, second drop at 0:38, logo sting at 0:41, final hit at 0:42.5, clean modern mix, no vocals
```

**Exclude styles** (Suno'dagi "Exclude" maydoni):

```
vocals, singing, lyrics, spoken word, vocal chops, choir, busy lead melody, guitar solo, white-noise riser, hiss, noise sweep, vinyl crackle, lo-fi, slow intro, fade-in, dubstep wobble
```

## 2. Tuzilma (Suno: "Lyrics" maydoni)

Suno'da **Instrumental** tugmasini o'chiring va "Lyrics" maydoniga faqat
quyidagi teglarni qo'ying (so'z yozmang). Suno teglarga qarab bo'limlarni
quradi, lekin soniyani aniq ushlamaydi. Aniq moslash pastdagi 5-bo'limda.

```
[Instrumental]

[Cold Open: 0:00-0:06, quiz-show hook, starts instantly on a hit, no intro, hits at 0:00, 0:02 and 0:02.5, three playful rising answer pops at 0:03.5, 0:03.75 and 0:04, a ticking clock on 0:04.5, 0:05 and 0:05.5]

[Build: 0:06-0:08, two hits at 0:06 and 0:06.5, pitched riser, camera-shutter click and tiny silence right before 0:08]

[Drop: 0:08, logo impact, light groove starts]

[Verse Groove: 0:08-0:32, light four-on-the-floor under a voice-over, soft chords F#m - D - A - E one per bar, sub bass, a soft bell accent on each scene change, three rising plinks at 0:16.3, a sparkle at 0:17.25, a bright reveal ding at 0:17.5, an accent at 0:19, no lead melody]

[Counters: 0:32-0:35, three big rising stabs at 0:32, 0:33 and 0:34 with quick ticking]

[Breakdown: 0:35-0:38, kick out, sustained pad, riser, snare roll speeding up, tiny silence before 0:38]

[Drop 2: 0:38-0:41, biggest drop, heavy impact, sparkles]

[Logo Sting: 0:41, impact and a sparkling A major chord with bells]

[Final Hit: 0:42.5, last hit with a rising bell arpeggio]

[Outro: ring out, silence by 0:44.5]

[End]
```

## 3. Soniyama-soniya (cue sheet)

| Vaqt (s) | Ekranda | Diktor | Musiqada |
| --- | --- | --- | --- |
| 0.0 | **Hook:** "Taxmin qiling!" yozuvi, krossovka, ¥699 | "Taxmin qiling!" | Intro yo'q, birinchi kadrdan zarba: kick, sub va stab. Ostida yumshoq akkord |
| 2.0 | Ko'k fon: **"Uyingizgacha"** | "Uyingizgacha qanchaga tushadi?" | Zarba |
| 2.5 | **"qanchaga tushadi?"** | | Stab, savol ohangi |
| 3.5 · 3.75 · 4.0 | Javoblar chiqadi: **A $98 · B $102 · C $150** | | Uchta o'ynoqi "pop", ko'tarilib boradi |
| 4.5 · 5.0 · 5.5 | Soat: **3 · 2 · 1** | "Uch… ikki… bir…" (ixtiyoriy) | Soat chiqillashi, har zarbda |
| 6.0 · 6.5 | **"Javob — bitta skrinshotda"**, telefon ko'tariladi | "Javob — bitta skrinshotda." | Ikki zarba, riser boshlanadi |
| 7.75 | Oq chaqnash | — | "Chirt" va juda qisqa sukunat |
| **8.0** | **Logotip tushadi** | "Bu — Pochtam." | **DROP**: impact, yengil groove boshlanadi |
| 10.0 | **"Rasmini yuklang"** (o'tish effekti), bosish 10.5 | "Rasmini yuklang — sun'iy intellekt tovarni topadi." | Bell urg'usi, bosishda kichik "pop" |
| 14.0 | **"Skrinshot oling"**, chaqnash 15.45 | "Narxni skrinshot qiling — jami summa boj, kargo va kurs bilan tayyor." | Bell urg'usi, 15.45 da "chirt" |
| 16.3 · 16.6 · 16.9 | Hisob quriladi: **$97.80 + $4.40 + $0** | | Uchta ko'tariluvchi "plink" |
| 17.25 | **= $102.20** | | Yaltiroq arpedjio |
| 17.5 | **B ✓** — viktorinaning to'g'ri javobi | | Yorqin "ding" |
| 19.0 | Salat fon: **"Boj: $0"**, 19.7 da **BOJSIZ** muhri | "Oyiga ikki yuz dollargacha — bojsiz." | Urg'uli stab va bell, muhrda past "tuk" |
| 22.0 | **"Butun savat?"**: savatdagi 3 tovar belgilanadi (22.2 · 22.35 · 22.5), chaqnash 22.95 | "Butun savatni ham — bitta skrinshotda." | Bell urg'usi, uchta kichik "pop", "chirt" |
| 23.0–24.0 | **"Bitta skrinshot — bitta hisob"**: chek chiqadi, 24.05 da **JAMI $117.99** belgilanadi | | Yengil "printer" tiqillashi, 24.05 da bell |
| 25.0 | **"Eng arzon kuryer"** → 26.25 da **"Kuryer siz uchun sotib oladi"** | "Eng arzon kuryer — u siz uchun sotib oladi." | Bell urg'usi, 26.75 da "pop", 26.85 da bildirishnoma ohangi |
| 28.5 | **"Qadam-baqadam qo'llanma"** | "Qadam-baqadam qo'llanma va kuzatuv." | Bell urg'usi |
| 30.25 | **"Jo'natmani kuzating"** | | Bell urg'usi |
| 32 · 33 · 34 | **43 do'kon · 20 kuryer · 3 til** (raqamlar sanaladi) | "Qirq uch do'kon. Yigirma kuryer. Uch til." | Har raqamda katta stab va tez "tik-tik" |
| **35.0** | **"Hammasi — bitta ilovada"** | "Hammasi — bitta ilovada." | **BREAK**: kick yo'q, pad, 36 dan riser, 37 dan snare roll |
| 37.5–38.0 | Kadr oqarib boradi | — | Qisqa sukunat |
| **38.0** | **Quti tushadi** (38.3 da yerga uriladi, konfetti) | "Orzuingiz — eshigingiz oldida." | **DROP 2**, eng kuchli, 38.3 da yaltiroq ohang |
| **41.0** | Oq fon, logotip; "p" 41.23 da qo'nadi | — | Impact, 41.23 da yaltiroq A-major akkord va bell |
| **42.5** | **pochtam.uz** | "Pochtam nuqta uz." | Oxirgi zarba va ko'tariluvchi bell arpedjiosi |
| 43.5–44.5 | Logotip va manzil turibdi | — | Ohang so'nib boradi, 44.5 da jimlik |

## 4. ElevenLabs Music uchun (composition plan)

Bo'limlar: 6 + 2 + 14 + 10 + 3 + 3 + 3 + 3,5 = 44,5 s.

```json
{
  "positive_global_styles": ["background music for a voice-over commercial", "energetic but uncluttered electro-pop", "future bass", "120 BPM", "F# minor", "instrumental", "bouncy sub bass", "soft plucky synth chords", "glassy bell accents", "clean modern mix"],
  "negative_global_styles": ["vocals", "lyrics", "spoken word", "busy lead melody", "white noise", "hiss", "lo-fi", "slow intro", "fade-in"],
  "sections": [
    {"section_name": "Cold open hook", "duration_ms": 6000, "lines": [],
     "positive_local_styles": ["quiz-show hook, starts instantly on a hit, no intro", "hits at 0, 2 and 2.5 seconds", "three playful rising answer pops at 3.5, 3.75 and 4 seconds", "a ticking clock at 4.5, 5 and 5.5 seconds"],
     "negative_local_styles": ["steady groove", "fade-in"]},
    {"section_name": "Build to the logo", "duration_ms": 2000, "lines": [],
     "positive_local_styles": ["two hits at 0 and 0.5 seconds", "pitched synth riser", "a short camera-shutter click and a tiny silence at the very end"],
     "negative_local_styles": ["white noise riser"]},
    {"section_name": "Drop and groove under the voice", "duration_ms": 14000, "lines": [],
     "positive_local_styles": ["logo impact on the first beat", "light four-on-the-floor", "soft chords F#m D A E, one per bar", "sub bass", "soft bell accents at 2 and 6 seconds into the section", "three rising plinks at 8.3, 8.6 and 8.9 seconds and a sparkle at 9.25", "a bright reveal ding at 9.5 seconds", "an accent at 11 seconds", "leaves room for narration"],
     "negative_local_styles": ["lead melody", "breakdown"]},
    {"section_name": "Groove continued", "duration_ms": 10000, "lines": [],
     "positive_local_styles": ["same light groove", "soft bell accents at 0, 3, 6.5 and 8.25 seconds into the section", "three tiny pops at 0.2, 0.35 and 0.5 seconds and a camera-shutter click at 0.95", "soft receipt-printer ticks from 1.2 to 1.65 seconds and a bell at 2.05", "leaves room for narration"],
     "negative_local_styles": ["lead melody", "breakdown"]},
    {"section_name": "Counters", "duration_ms": 3000, "lines": [],
     "positive_local_styles": ["three big rising stabs, one each second", "quick ticking after each stab"],
     "negative_local_styles": ["breakdown"]},
    {"section_name": "Breakdown", "duration_ms": 3000, "lines": [],
     "positive_local_styles": ["kick out", "sustained pad", "pitched riser in the last two seconds", "snare roll speeding up", "tiny silence right before the next drop"],
     "negative_local_styles": ["white noise riser"]},
    {"section_name": "Drop 2", "duration_ms": 3000, "lines": [],
     "positive_local_styles": ["biggest drop on the first beat", "full groove", "heavy impact", "sparkles"],
     "negative_local_styles": ["breakdown"]},
    {"section_name": "Logo outro", "duration_ms": 3500, "lines": [],
     "positive_local_styles": ["one impact and a sparkling A major chord with bells", "groove stops", "final hit with a rising bell arpeggio at 1.5 seconds", "rings out to silence at the end"],
     "negative_local_styles": ["long fade", "new melody"]}
  ]
}
```

## 5. Videoga moslash

1. **Tempni tekshiring.** Trek 120 BPM bo'lishi shart. Boshqa tempda chiqsa,
   o'sha variantni tashlab, yangisini yarating.
2. **Birinchi zarbani 00:00.00 ga qo'ying.** Generator ko'pincha boshiga
   1–4 takt intro qo'shadi. Uni kesib tashlang, birinchi kuchli zarba videoning
   birinchi kadriga tushsin.
3. **Asosiy nuqtalarni tekshiring:** logotip **00:08.00**, ikkinchi drop
   **00:38.00**, final logotip **00:41.00**. Takt 2,000 s bo'lgani uchun
   trekni istalgan takt chegarasidan (2, 4, 6 … s) kesib ulasangiz ham,
   vaqt buzilmaydi. Groove qismi (8–32 s) uzun, uni bir xil taktlarni
   takrorlab cho'zish yoki qisqartirish oson.
4. **Namuna bilan yaratish.** Generatorda audio yuklash (Upload → Cover /
   Remix) imkoni bo'lsa, [`out/pochtam-promo-score.mp3`](out/pochtam-promo-score.mp3)
   ni yuklab, 1-bo'limdagi uslubni bering. Shunda tuzilma va vaqtlar
   saqlanib qolish ehtimoli yuqori bo'ladi.
5. **Diktor bilan aralashtirish:** diktor gapirganda musiqa 10–14 dB
   pastroq bo'lsin. Yakuniy balandlik taxminan −14 LUFS, eng baland nuqta
   −1 dBFS dan oshmasin.

# Pochtam promo — musiqa uchun prompt (soniyama-soniya)

Video 66 soniya, diktor ovozi bilan. Montaj **120 BPM** to'rida qilingan:
bitta zarb (beat) 0,5 s, bitta takt (bar) 2,000 s. Barcha kesimlar zarbga
tushadi. Logotip zarbasi va ikkala drop takt boshida keladi: **0:12**, **0:56**,
**1:00**. Musiqa diktor uchun fon bo'ladi, shuning uchun o'rta chastotalarda
bo'sh joy qoldiradi va gap paytida band melodiya chalmaydi.

Musiqa generatorlari ingliz tilidagi promptni yaxshiroq tushunadi, shuning
uchun promptlar inglizcha. Tushuntirishlar o'zbekcha. Diktor matni
[`VOICEOVER.md`](VOICEOVER.md) da.

- Ovozsiz video: [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4)
- Vaqtinchalik sintez musiqa (namuna, xuddi shu to'rda):
  [`out/pochtam-promo-score.mp3`](out/pochtam-promo-score.mp3)

## 1. Uslub (Suno: "Style of Music", Udio: prompt)

```
instrumental background music for a 66-second voice-over app commercial, energetic but uncluttered electro-pop / future bass, 120 BPM, F# minor, cold open on a hit with no intro, stop-and-hit hook, build with a pitched riser into a logo drop at 0:12, light four-on-the-floor groove under narration, bouncy sub bass, soft plucky synth chords, glassy bell accents, leaves space for the voice, breakdown at 0:52, second drop at 0:56, logo sting at 1:00, final hit at 1:03, clean modern mix, no vocals
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

[Cold Open: 0:00-0:08, starts instantly on a hit, no intro, sparse stop-and-hit, hits at 0:00, 0:03 and 0:04, four punchy stabs at 0:05.5, 0:06.25, 0:07 and 0:07.75]

[Build: 0:08-0:12, two hits at 0:08.5 and 0:09, drums out, pitched riser, camera-shutter click and tiny silence right before 0:12]

[Drop: 0:12, logo impact, light groove starts]

[Verse Groove: 0:12-0:46, light four-on-the-floor under a voice-over, soft chords F#m - D - A - E one per bar, sub bass, a soft bell accent on each scene change, no lead melody]

[Lift: 0:46-0:52, short pitched riser, three big stabs at 0:47.5, 0:49 and 0:50.5]

[Breakdown: 0:52-0:56, kick out, sustained pad, riser, snare roll speeding up, tiny silence before 0:56]

[Drop 2: 0:56-1:00, biggest drop, heavy impact]

[Logo Sting: 1:00, impact and a sparkling A major chord with bells]

[Final Hit: 1:03.5, last hit with a rising bell arpeggio]

[Outro: ring out, silence by 1:06]

[End]
```

## 3. Soniyama-soniya (cue sheet)

| Vaqt (s) | Ekranda | Diktor | Musiqada |
| --- | --- | --- | --- |
| 0.0 | Krossovka, **"Xitoyda — ¥699"** | "Xitoyda — olti yuz to'qson to'qqiz yuan." | Intro yo'q, birinchi kadrdan zarba: kick, sub va stab. Ostida yumshoq akkord |
| 3.0 | Ko'k fon: **"Uyingizgacha"** | "Uyingizgacha qanchaga tushadi?" | Zarba |
| 4.0 | **"qanchaga tushadi?"** | | Stab, savol ohangi |
| 5.5 · 6.25 · 7.0 · 7.75 | **Boj? · Kargo? · Kurs? · Kuryer?** | so'zlar shu lahzalarda | Har so'zda bitta stab, ko'tarilib boradi |
| 8.5 · 9.0 | **"Javob — bitta skrinshotda"** | "Javob — bitta skrinshotda." | Ikki zarba, keyin barabanlar to'xtaydi |
| 10.0–12.0 | Telefon ko'tariladi, 11.75 da oq chaqnash | — | Ohangli riser, 11.75 da "chirt", juda qisqa sukunat |
| **12.0** | **Logotip tushadi** | "Bu — Pochtam. Global xaridlar biz bilan oson." | **DROP**: impact, yengil groove boshlanadi |
| 15.5 | **"Rasmini yuklang"**, bosish 16.1 | "Rasmini yuklang — sun'iy intellekt tovarni do'konlardan topadi." | Bell urg'usi, bosishda kichik "pop" |
| 20.5 | **"Skrinshot oling"**, chaqnash 22.45 | "Narxni skrinshot qiling — ilova boj, kargo va kurs bilan jami summani chiqaradi." | Bell urg'usi, 22.45 da "chirt" |
| 23.5 | Jami narx sanaladi: **$102.20** | | Yuqoriga yuguruvchi qisqa arpedjio |
| 26.5 | **"Narx tarkibi"** | "Narx tarkibi ochiq. Oyiga ikki yuz dollargacha — bojsiz." | Bell urg'usi |
| 29.0 | Salat fon: **"Boj: $0"** | | Urg'uli bell |
| 31.5 | **"Butun savat?"**, chaqnash 32.95 | "Butun savatni ham bitta skrinshot bilan hisoblang." | Bell urg'usi, "chirt" |
| 35.5 | **"Eng arzon kuryer"** → **"Kuryer siz uchun sotib oladi"** (37.25) | "Eng arzon kuryerni tanlang — u siz uchun sotib oladi." | Bell urg'usi, 37.85 da "pop", 37.95 da bildirishnoma ohangi |
| 40.0 | **"Qadam-baqadam qo'llanma"**, ekran har 1 s da almashadi | "Yetti do'kon uchun — qadam-baqadam qo'llanma." | Bell urg'usi |
| 44.0 | **"Jo'natmani kuzating"** | "Jo'natmangizni eshigingizgacha kuzating." | Bell urg'usi |
| 46.5–47.5 | | | Qisqa ohangli riser |
| 47.5 · 49.0 · 50.5 | **43 do'kon · 20 kuryer · 3 til** | "Qirq uch do'kon. Yigirma kuryer. Uch til." | Har raqamda katta stab, ko'tarilib boradi: C# · E · A |
| **52.0** | **"Hammasi — bitta ilovada"** | "Hammasi — bitta ilovada." | **BREAK**: kick yo'q, pad, 54 dan riser, 55 dan snare roll |
| 55.5–56.0 | Kadr oqarib boradi | — | Qisqa sukunat |
| **56.0** | **Quti tushadi** (56.3 da yerga uriladi) | "Orzuingiz — eshigingiz oldida." | **DROP 2**, eng kuchli |
| **60.0** | Oq fon, logotip; "p" 60.3 da qo'nadi | "Pochtam. Orzu qiling — qolganini biz hal qilamiz." | Impact, 60.3 da yaltiroq A-major akkord va bell |
| **63.5** | **pochtam.uz** | "Pochtam nuqta uz." | Oxirgi zarba va ko'tariluvchi bell arpedjiosi |
| 64.5–66.0 | Logotip va manzil turibdi | — | Ohang so'nib boradi, 66 da jimlik |

## 4. ElevenLabs Music uchun (composition plan)

Bo'limlar takt chegarasida: 8 + 4 + 20 + 14 + 6 + 4 + 4 + 6 = 66 s.

```json
{
  "positive_global_styles": ["background music for a voice-over commercial", "energetic but uncluttered electro-pop", "future bass", "120 BPM", "F# minor", "instrumental", "bouncy sub bass", "soft plucky synth chords", "glassy bell accents", "clean modern mix"],
  "negative_global_styles": ["vocals", "lyrics", "spoken word", "busy lead melody", "white noise", "hiss", "lo-fi", "slow intro", "fade-in"],
  "sections": [
    {"section_name": "Cold open hook", "duration_ms": 8000, "lines": [],
     "positive_local_styles": ["starts instantly on a hit, no intro", "sparse stop-and-hit", "hits at 0, 3 and 4 seconds", "four punchy rising stabs at 5.5, 6.25, 7 and 7.75 seconds"],
     "negative_local_styles": ["steady groove", "fade-in"]},
    {"section_name": "Build to the logo", "duration_ms": 4000, "lines": [],
     "positive_local_styles": ["two hits at the start", "drums drop out", "pitched synth riser", "a short camera-shutter click and a tiny silence at the very end"],
     "negative_local_styles": ["white noise riser"]},
    {"section_name": "Drop and groove under the voice", "duration_ms": 20000, "lines": [],
     "positive_local_styles": ["logo impact on the first beat", "light four-on-the-floor", "soft chords F#m D A E, one per bar", "sub bass", "soft bell accents at 3.5, 8.5, 14.5 and 19.5 seconds into the section", "leaves room for narration"],
     "negative_local_styles": ["lead melody", "breakdown"]},
    {"section_name": "Groove continued", "duration_ms": 14000, "lines": [],
     "positive_local_styles": ["same light groove", "soft bell accents at 3.5, 8 and 12 seconds into the section", "leaves room for narration"],
     "negative_local_styles": ["lead melody", "breakdown"]},
    {"section_name": "Numbers lift", "duration_ms": 6000, "lines": [],
     "positive_local_styles": ["short pitched riser from 0.5 to 1.5 seconds", "three big rising stabs at 1.5, 3 and 4.5 seconds into the section"],
     "negative_local_styles": ["white noise riser"]},
    {"section_name": "Breakdown", "duration_ms": 4000, "lines": [],
     "positive_local_styles": ["kick out", "sustained pad", "pitched riser in the second half", "snare roll speeding up", "tiny silence right before the next drop"],
     "negative_local_styles": ["white noise riser"]},
    {"section_name": "Drop 2", "duration_ms": 4000, "lines": [],
     "positive_local_styles": ["biggest drop on the first beat", "full groove", "heavy impact"],
     "negative_local_styles": ["breakdown"]},
    {"section_name": "Logo outro", "duration_ms": 6000, "lines": [],
     "positive_local_styles": ["one impact and a sparkling A major chord with bells", "groove stops", "final hit with a rising bell arpeggio at 3.5 seconds", "rings out to silence at the end"],
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
3. **Asosiy nuqtalarni tekshiring:** logotip **00:12.00**, ikkinchi drop
   **00:56.00**, final logotip **01:00.00**. Takt 2,000 s bo'lgani uchun
   trekni istalgan takt chegarasidan (2, 4, 6 … s) kesib ulasangiz ham,
   vaqt buzilmaydi. Groove qismi (12–46 s) uzun, uni bir xil taktlarni
   takrorlab cho'zish yoki qisqartirish oson.
4. **Namuna bilan yaratish.** Generatorda audio yuklash (Upload → Cover /
   Remix) imkoni bo'lsa, [`out/pochtam-promo-score.mp3`](out/pochtam-promo-score.mp3)
   ni yuklab, 1-bo'limdagi uslubni bering. Shunda tuzilma va vaqtlar
   saqlanib qolish ehtimoli yuqori bo'ladi.
5. **Diktor bilan aralashtirish:** diktor gapirganda musiqa 10–14 dB
   pastroq bo'lsin. Yakuniy balandlik taxminan −14 LUFS, eng baland nuqta
   −1 dBFS dan oshmasin.

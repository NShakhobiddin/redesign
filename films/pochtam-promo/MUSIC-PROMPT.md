# Pochtam promo — musiqa uchun prompt (soniyama-soniya)

Video **120 BPM** to'riga kesilgan: bitta zarb (beat) 0,5 s, bitta takt (bar)
2,000 s, 30 soniya = 15 takt. Barcha kesimlar zarbga yoki yarim zarbga tushadi.
Shuning uchun 120 BPM da yaratilgan trek videoga aniq tushadi.

Musiqa generatorlari ingliz tilidagi promptni yaxshiroq tushunadi, shuning
uchun promptlar inglizcha. Tushuntirishlar o'zbekcha.

- Ovozsiz video: [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4)
- Vaqtinchalik sintez musiqa (namuna, xuddi shu to'rda):
  [`out/pochtam-promo-score.mp3`](out/pochtam-promo-score.mp3)

## 1. Uslub (Suno: "Style of Music", Udio: prompt)

```
instrumental, energetic electro-pop / future-bass commercial, 120 BPM, F# minor, cold open on a huge hit with no intro, four-on-the-floor kick, tight claps, bouncy sub bass, bright plucky saw-synth stabs, glassy bell lead, two big sidechained drops at 0:04 and 0:24, pitched synth risers, stop-and-hit transitions, modern TikTok/Reels ad energy, clean punchy mix, no vocals
```

**Exclude styles** (Suno'dagi "Exclude" maydoni):

```
vocals, singing, lyrics, spoken word, vocal chops, choir, white-noise riser, hiss, noise sweep, vinyl crackle, lo-fi, slow intro, fade-in, ambient, guitar solo, dubstep wobble
```

## 2. Tuzilma (Suno: "Lyrics" maydoni)

Suno'da **Instrumental** tugmasini o'chiring va "Lyrics" maydoniga faqat
quyidagi teglarni qo'ying (so'z yozmang). Suno teglarga qarab bo'limlarni
quradi, lekin soniyani aniq ushlamaydi. Aniq moslash pastdagi 5-bo'limda.

```
[Instrumental]

[Cold Open: 0:00-0:04, 2 bars, starts instantly on a huge hit, stop-start hits at 0:00, 0:01 and 0:01.5, four rising eighth-note stabs 0:02-0:03, drums cut at 0:03, pitched riser, tiny silence right before 0:04]

[Drop 1: 0:04, full beat, logo impact, crash]

[Groove: 0:04-0:18, driving four-on-the-floor, chords F#m - D - A - E one per bar, bright bell accent every 2 seconds on beat 3]

[Lift: 0:18-0:19, short pitched riser]

[Stabs: 0:19-0:22, six punchy stabs one per beat, each one step higher: C# E F# G# A B]

[Break: 0:22-0:24, kick out, sustained E major pad, pitched riser, snare roll speeding up, cut to silence at 0:23.75]

[Drop 2: 0:24-0:26, biggest drop, heavy impact]

[Logo Sting: 0:26, single impact, sparkling A major chord at 0:26.3, bells]

[Final Hit: 0:28, last hit with a rising bell arpeggio]

[Outro: ring out, silence by 0:30]

[End]
```

## 3. Soniyama-soniya (cue sheet)

Takt.zarb: 1.1 = 1-takt 1-zarb (0,00 s), 1.3 = 1-takt 3-zarb (1,00 s) va h.k.
"&" belgisi zarbdan keyingi yarim zarb (0,25 s keyin) degani.

| Vaqt (s) | Takt.zarb | Ekranda | Musiqada |
| --- | --- | --- | --- |
| 0.00 | 1.1 | Krossovka uchib kiradi, **"Xitoyda"** | Intro yo'q, birinchi kadrdan katta zarba: kick, sub-bas va yorqin stab |
| 0.50 | 1.2 | "shu narxda", ¥699 yorlig'i tebranadi | Kichik pluck-javob |
| 1.00 | 1.3 | Ko'k fon: **"Uyingizgacha"** | Zarba (kick va bas) |
| 1.50 | 1.4 | **"qanchaga tushadi?"** (salat rangda) | Zarba va balandroq stab, savol ohangi |
| 2.00 · 2.25 · 2.50 · 2.75 | 2.1 · 2.1& · 2.2 · 2.2& | **Boj? · Kargo? · Kurs? · Kuryer?** (4 ta tez kesim) | 4 ta ko'tariluvchi stab (sakkizdan bir), har birida kick |
| 3.00 | 2.3 | Qora fon: **"Javob —"** | Barabanlar to'xtaydi, bitta zarb, ohangli riser boshlanadi |
| 3.50 | 2.4 | **"bitta skrinshotda"**, telefon ko'tariladi | Riser cho'qqiga chiqadi |
| 3.75 | 2.4& | Oq "chirt" (skrinshot chaqnashi) | Kamera "chirt" tovushi va juda qisqa sukunat |
| **4.00** | **3.1** | **DROP 1**: Pochtam logotipi tushadi (4.1), "Pochtam." yozuvi (4.5) | To'liq drop: kick, sub, akkord stablari, crash |
| 5.00 | 3.3 | **"Rasmini yuklang"**, bosish (5.3), skan (5.5) | Qo'ng'iroqcha (bell) urg'usi |
| 6.00 | 4.1 | AI do'konlarni topdi | Groove davom etadi |
| 7.00 | 4.3 | **"Skrinshot oling"** — do'kon sahifasi | Bell urg'usi |
| 7.45 | 4.4 dan sal oldin | Oq chaqnash | "Chirt" |
| 7.50 | 4.4 | **"AI narxni o'qiydi"** | — |
| 8.00 | 5.1 | Jami narx sanaladi: **$102.20** (8.05–8.45) | Yuqoriga yuguruvchi qisqa arpedjio |
| 9.00 | 5.3 | **"Narx tarkibi"**, belgilar 9.2 · 9.4 · 9.6 · 9.8 da | Bell urg'usi va 4 ta sakkizdan bir "tik" |
| 10.00 | 6.1 | Salat fon: **"Boj: $0"** | Urg'uli zarba |
| 11.00 | 6.3 | **"Butun savat?"** — savat sahifasi, chaqnash 11.45 | Bell urg'usi va "chirt" |
| 11.50 | 6.4 | **"Bitta skrinshot — bitta hisob"** | — |
| 12.50 | 7.2 | Jami: **3 ta tovar → $117.99** | — |
| 13.00 | 7.3 | **"Eng arzon kuryer"** | Bell urg'usi |
| 13.75 | 7.4& | **"Kuryer siz uchun sotib oladi"** | — |
| 14.10–14.20 | 8.1 | "Yozish" bosiladi, **"Xabar tayyor ✓"** chiqadi | Qisqa bildirishnoma "pop"i |
| 15.00 | 8.3 | **"Qadam-baqadam qo'llanma"**, ekran har 0,5 s da almashadi | Bell urg'usi, sakkizdan bir pluck naqshi |
| 17.00 | 9.3 | **"Jo'natmani kuzating"**, holat chizig'i 18.9 gacha to'ladi | Bell urg'usi |
| 18.00–19.00 | 10.1–10.3 | Chiziq "Keldi"ga yetadi | Qisqa ohangli riser |
| 19.00 · 19.50 · 20.00 · 20.50 · 21.00 · 21.50 | 10.3 … 11.4 | **43 do'kon · 20 kuryer · 7 qo'llanma · $200 oyiga bojsiz · AI · 3 til** | Har zarbda bitta stab, ko'tarilib boradi: C# E F# G# A B |
| **22.00** | **12.1** | **"Hammasi —"** ekranlar mozaikasi, 22.5 da "bitta ilovada" | **BREAK**: kick yo'q, pad akkord (E), riser |
| 23.50–24.00 | 12.4 | Kadr oqarib boradi | Snare roll tezlashadi, 23.75 dan qisqa sukunat |
| **24.00** | **13.1** | **DROP 2**: quti tushadi (24.3 da yerga uriladi), **"Orzuingiz — eshigingiz oldida."** | Eng kuchli drop |
| **26.00** | **14.1** | Oq fon, logotip: zarba; "p" 26.3 da qo'nadi | Bitta impact, 26.3 da yaltiroq A-major akkord va bell |
| 27.00–28.20 | 14.3–15.1 | "Pochtam." yozuvi, yaltirash, shior | Cho'zilgan akkord, yengil hi-hat |
| **28.00** | **15.1** | **pochtam.uz** paydo bo'ladi | Oxirgi zarba va ko'tariluvchi bell arpedjiosi |
| 28.50–30.00 | 15.2–15.4 | "Orzu qiling — qolganini biz hal qilamiz" | Ohang so'nib boradi, 29.8 da jimlik |

## 4. ElevenLabs Music uchun (composition plan, bo'limlar aniq uzunlikda)

Bo'limlar takt chegarasida: 4 + 8 + 6 + 6 + 6 = 30 s.

```json
{
  "positive_global_styles": ["energetic electro-pop", "future bass", "commercial ad music", "120 BPM", "F# minor", "instrumental", "punchy sidechained drops", "bright plucky synth stabs", "glassy bell lead", "clean punchy mix"],
  "negative_global_styles": ["vocals", "lyrics", "spoken word", "white noise", "hiss", "lo-fi", "slow intro", "fade-in"],
  "sections": [
    {"section_name": "Cold open hook", "duration_ms": 4000, "lines": [],
     "positive_local_styles": ["starts instantly on a huge hit, no intro", "stop-start hits at 0, 1 and 1.5 seconds", "four rising eighth-note stabs from 2 to 3 seconds", "drums cut at 3 seconds, pitched riser", "tiny silence right before the drop"],
     "negative_local_styles": ["steady groove", "fade-in"]},
    {"section_name": "Drop 1 and groove", "duration_ms": 8000, "lines": [],
     "positive_local_styles": ["full drop on the first beat", "four-on-the-floor", "chords F#m D A E, one per bar", "bell accent every 2 seconds on beat 3"],
     "negative_local_styles": ["breakdown"]},
    {"section_name": "Groove 2", "duration_ms": 6000, "lines": [],
     "positive_local_styles": ["same groove, slightly brighter", "plucky eighth-note arpeggio", "bell accent every 2 seconds on beat 3"],
     "negative_local_styles": ["breakdown"]},
    {"section_name": "Ascending stabs and break", "duration_ms": 6000, "lines": [],
     "positive_local_styles": ["first second: short pitched riser", "then six punchy stabs one per beat, each one step higher", "last 2 seconds: kick out, sustained pad, riser, snare roll speeding up", "a tiny silence right before the next drop"],
     "negative_local_styles": ["white noise riser"]},
    {"section_name": "Drop 2 and logo outro", "duration_ms": 6000, "lines": [],
     "positive_local_styles": ["biggest drop on the first beat", "after 2 seconds: groove stops, one impact and a sparkling A major chord with bells", "after 4 seconds: final hit with a rising bell arpeggio", "rings out to silence at the end"],
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
3. **Droplarni tekshiring:** birinchisi **00:04.00** da (logotip), ikkinchisi
   **00:24.00** da (quti). Takt 2,000 s bo'lgani uchun trekni istalgan takt
   chegarasidan (2, 4, 6 … s) kesib ulasangiz ham, vaqt buzilmaydi.
   Ishonchli yo'li: ~60 soniyalik trek yarating, keyin uni bo'laklardan
   yig'ing: [hook 4 s] + [drop va groove 18 s] + [break 2 s] + [drop 2 va
   final 6 s].
4. **Namuna bilan yaratish.** Generatorda audio yuklash (Upload → Cover /
   Remix) imkoni bo'lsa, [`out/pochtam-promo-score.mp3`](out/pochtam-promo-score.mp3)
   ni yuklab, 1-bo'limdagi uslubni bering. Shunda tuzilma va vaqtlar
   saqlanib qolish ehtimoli yuqori bo'ladi.
5. **Yakuniy ovoz:** oxirgi 0,3 s ni so'ndiring. Reels va TikTok uchun
   balandlik taxminan −14 LUFS bo'lsin, eng baland nuqta −1 dBFS dan oshmasin.

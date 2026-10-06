# Pochtam promo — diktor matni (ElevenLabs uchun, yakuniy)

Video 44,5 soniya davom etadi. Har bir sahnaga diktorning bitta satri to'g'ri keladi, ekrandagi
yozuvlar esa aytilayotgan gapni takrorlaydi. Matn TTS uchun tayyorlangan:
- raqamlar so'z bilan yozilgan;
- qisqartmalar yo'q: "AI" o'rniga "sun'iy intellekt", "pochtam.uz" o'rniga
  "Pochtam nuqta uz".

- Ovozsiz video: [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4)
- Satrlar vaqti (subtitr, montajga yuklash uchun): [`out/pochtam-promo-voiceover.srt`](out/pochtam-promo-voiceover.srt)

## 1. Satrma-satr (eng aniq usul)

Har bir satrni ElevenLabs'da alohida yarating va montajda "Boshlanish"
ustunidagi vaqtga qo'ying. Satr o'z "Oyna"sidan chiqib ketmasligi kerak.

| # | Boshlanish | Oyna | Matn |
| --- | --- | --- | --- |
| 1 | 00:00.2 | 0–4,5 s | Taxmin qiling! Uyingizgacha qanchaga tushadi? |
| 2 | 00:04.5 | 4,5–6 s | Uch… ikki… bir… |
| 3 | 00:06.1 | 6–8 s | Javob — bitta skrinshotda. |
| 4 | 00:08.2 | 8–10 s | Bu — Pochtam. |
| 5 | 00:10.1 | 10–14 s | Rasmini yuklang — sun'iy intellekt tovarni topadi. |
| 6 | 00:14.1 | 14–19 s | Narxni skrinshot qiling — jami summa boj, kargo va kurs bilan tayyor. |
| 7 | 00:19.1 | 19–22 s | Oyiga ikki yuz dollargacha — bojsiz. |
| 8 | 00:22.1 | 22–25 s | Butun savatni ham — bitta skrinshotda. |
| 9 | 00:25.1 | 25–28,5 s | Eng arzon kuryer — u siz uchun sotib oladi. |
| 10 | 00:28.6 | 28,5–32 s | Qo'llanma va jo'natmani kuzatish. |
| 11 | 00:32.1 | 32–35 s | Qirq uch do'kon. Yigirma kuryer. Uch til. |
| 12 | 00:35.1 | 35–38 s | Hammasi — bitta ilovada. |
| 13 | 00:38.4 | 38–41 s | Orzuingiz — eshigingiz oldida. |
| 14 | 00:41.4 | 41–44,5 s | Hoziroq sinab ko'ring — Pochtam nuqta uz. |

Satrlarni ekrandagi lahzalarga moslash:
- **1-satr (hook).** Birinchi kadrdanoq "Taxmin qiling!" yozuvi chiqadi.
  2,0 s da "Uyingizgacha qanchaga tushadi?" savoli keladi, 3,5 · 3,75 · 4,0 s
  da esa javob variantlari: A $98 · B $102 · C $150. "Taxmin qiling!" dan
  keyin qisqa pauza qiling, shunda "Uyingizgacha" so'zi taxminan 2,0 s ga
  to'g'ri keladi.
- **2-satr.** 3-2-1 sanog'i ekranda zarbda chiqadi: 4,5 · 5,0 · 5,5 s.
  - Bu satr ixtiyoriy: musiqada soat chiqillaydi, uni aytmasa ham bo'ladi.
  - Aniq tushishi uchun "uch", "ikki", "bir" ni uchta alohida klip qiling.
- **6-satr.** Hisob ekranda bo'lak-bo'lak quriladi: $97.80 (16,3 s),
  + $4.40 (16,6 s), + $0 (16,9 s), = $102.20 (17,25 s). To'g'ri javob
  (**B ✓**) 17,5 s da, jami narx yonida chiqadi.
- **8-satr.** Savatdagi uchta tovar 22,2–22,5 s da belgilanadi, 23 s dan chek
  chiqadi, 24 s da JAMI $117.99 belgilanadi.
- **10-satr.** 28,5 s da "Qadam-baqadam qo'llanma" kadri, 30,25 s da
  "Jo'natmani kuzating" kadri chiqadi. "Jo'natmani kuzatish" so'zlari
  ikkinchi kadrga tushadi.
- **11-satr.** Raqamlar 32 · 33 · 34 s da chiqadi.
- **14-satr.** Logotip 41 s da tushadi, "pochtam.uz" yozuvi 42,5 s da
  chiqadi. "Pochtam nuqta uz" so'zlari shu yozuvga to'g'ri kelsin.

## 2. Bitta matn holida

Butun matnni bir martada yaratish ham mumkin. Pauzalar shu videoga qarab
hisoblangan, lekin ovozga qarab biroz farq qiladi. Shuning uchun montajda
satrlarni ozgina surib to'g'rilang.

**Multilingual v2 / Turbo uchun** (`<break>` pauza teglari bilan):

```
Taxmin qiling! <break time="0.6s" /> Uyingizgacha qanchaga tushadi? <break time="0.5s" />
Uch... <break time="0.15s" /> ikki... <break time="0.15s" /> bir... <break time="0.3s" />
Javob — bitta skrinshotda. <break time="0.4s" />
Bu — Pochtam. <break time="1.0s" />
Rasmini yuklang — sun'iy intellekt tovarni topadi. <break time="0.5s" />
Narxni skrinshot qiling — jami summa boj, kargo va kurs bilan tayyor. <break time="0.8s" />
Oyiga ikki yuz dollargacha — bojsiz. <break time="0.3s" />
Butun savatni ham — bitta skrinshotda. <break time="0.5s" />
Eng arzon kuryer — u siz uchun sotib oladi. <break time="0.4s" />
Qo'llanma va jo'natmani kuzatish. <break time="1.0s" />
Qirq uch do'kon. <break time="0.3s" /> Yigirma kuryer. <break time="0.3s" /> Uch til. <break time="0.2s" />
Hammasi — bitta ilovada. <break time="1.2s" />
Orzuingiz — eshigingiz oldida. <break time="0.5s" />
Hoziroq sinab ko'ring — Pochtam nuqta uz.
```

**Eleven v3 uchun, ohang teglari (promptlar) bilan.** v3 `<break>` teglarini
o'qimaydi, shuning uchun pauzalar tinish belgilari bilan beriladi. Kvadrat
qavsdagi inglizcha teglar diktorga har bir satrni qanday aytishni buyuradi.
Ular o'qilmaydi. Butun matnni bitta qilib qo'yish ham, har satrni alohida
yaratish ham mumkin.

```
[excited] Taxmin qiling!... [curious] Uyingizgacha qanchaga tushadi?

[playful] Uch... ikki... bir...

[confident] Javob — bitta skrinshotda.

[excited] Bu — Pochtam!

[friendly] Rasmini yuklang — sun'iy intellekt tovarni topadi.

[upbeat] Narxni skrinshot qiling — jami summa boj, kargo va kurs bilan tayyor.

[impressed] Oyiga ikki yuz dollargacha — bojsiz!

[playful] Butun savatni ham — bitta skrinshotda.

[warm] Eng arzon kuryer — u siz uchun sotib oladi.

[reassuring] Qo'llanma va jo'natmani kuzatish.

[energetic] Qirq uch do'kon... Yigirma kuryer... Uch til.

[confident] Hammasi — bitta ilovada.

[warm] Orzuingiz — eshigingiz oldida.

[excited] Hoziroq sinab ko'ring — Pochtam nuqta uz!
```

Har bir teg nima qiladi:

| Teg | Satr | Qanday aytiladi |
| --- | --- | --- |
| `[excited]` | Taxmin qiling! · Bu — Pochtam! · Hoziroq sinab ko'ring | Quvnoq, ko'tarinki, e'tiborni tortadi |
| `[curious]` | Uyingizgacha qanchaga tushadi? | Savol ohangida, qiziqtirib |
| `[playful]` | Uch… ikki… bir… · Butun savatni ham… | O'ynoqi, viktorinadagidek |
| `[confident]` | Javob — bitta skrinshotda · Hammasi — bitta ilovada | Ishonch bilan, aniq |
| `[friendly]` `[upbeat]` | Rasmini yuklang… · Narxni skrinshot qiling… | Do'stona, tushuntirib, shoshmasdan |
| `[impressed]` | Oyiga ikki yuz dollargacha — bojsiz! | Hayratlanib, yaxshi xabar sifatida |
| `[warm]` `[reassuring]` | Eng arzon kuryer… · Qo'llanma… · Orzuingiz… | Iliq, xotirjam qiladi |
| `[energetic]` | Qirq uch do'kon… | Tez, har raqam alohida urg'u bilan |

- Teglar **Creative** yoki **Natural** rejimida yaxshi ishlaydi. Agar ohang
  haddan oshib ketsa, o'sha satrdan tegni olib tashlang.
- Satr o'z vaqtiga sig'masa, tegni `[fast-paced]` ga almashtirib ko'ring
  yoki faqat o'sha satrni qayta yarating.

## 3. Ovoz va sozlamalar

- **Ovoz:** iliq, quvnoq, ishonchli. Reklama ohangida, lekin baqirmasdan,
  "jilmayib" gapiradi. Erkak ham, ayol ham bo'lishi mumkin. Bir nechta ovozda
  1–3-satrlarni sinab ko'ring va o'zbekchani eng toza o'qiganini tanlang.
- **Voice Design orqali ovoz yaratsangiz**, tavsif (inglizcha):

  ```
  Energetic, warm young adult narrator for a mobile app commercial in Uzbek. Friendly smile in the voice, clear diction, confident, medium-fast pace, studio quality, no background noise.
  ```
- **Model:** avval Eleven v3 bilan sinang, keyin Multilingual v2 bilan
  solishtiring. Qaysi biri o'zbekchani tabiiyroq o'qisa, o'shani oling.
- **Sozlamalar (Multilingual v2):**
  - Stability 45–55%
  - Similarity 75–80%
  - Style 15–25%
  - Speaker boost yoqilgan
  - Speed 1.0
  - Satr oynasiga sig'masa, Speed'ni 1.05–1.1 qiling.
- **Sozlamalar (v3):** Stability — Natural (ohang teglari ko'proq sezilishi uchun Creative ni ham sinab ko'ring).

## 4. Talaffuz bo'yicha maslahatlar

- So'z noto'g'ri o'qilsa, uni eshitilishiga qarab yozing yoki bo'g'inlarga
  ajrating, masalan "skrinshot" → "skrin-shot".
- Apostrofli harflar (o', g') yomon chiqsa, `ʻ` belgisini sinab ko'ring:
  "toʻqson", "doʻkon".
- Bir satr yoqmasa, faqat o'sha satrni qayta yarating. Qolganlari o'z joyida
  qolaveradi.

## 5. Montajda

1. [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4) ni oching.
   Subtitr faylini ([`out/pochtam-promo-voiceover.srt`](out/pochtam-promo-voiceover.srt))
   yuklasangiz, har satr qayerga tushishi ko'rinib turadi.
2. Har bir satrni o'z vaqtiga qo'ying. Asosiysi, satr o'z oynasidan
   chiqib ketmasin.
3. Musiqa diktor ostida 10–14 dB pastroq bo'lsin. Gap yo'q joylarda
   (taxminan 9–10 s, 37–38 s va 44 s dan keyin) musiqani balandroq
   qo'ying.
4. Yakuniy balandlik: taxminan −14 LUFS, eng baland nuqta −1 dBFS.

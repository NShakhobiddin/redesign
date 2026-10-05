# Pochtam promo — diktor matni (ElevenLabs uchun)

Video 66 soniya. Har bir sahnaga bitta satr to'g'ri keladi. Ekrandagi yozuvlar
diktor aytayotgan gapni takrorlaydi. Matn TTS uchun tayyorlangan: raqamlar so'z
bilan yozilgan, qisqartmalar yo'q ("AI" o'rniga "sun'iy intellekt",
"pochtam.uz" o'rniga "Pochtam nuqta uz").

- Ovozsiz video: [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4)
- Subtitr / joylash uchun belgilar: [`out/pochtam-promo-voiceover.srt`](out/pochtam-promo-voiceover.srt)

## 1. Satrma-satr (eng aniq usul)

Har bir satrni ElevenLabs'da alohida yarating va montajda "Boshlanish"
ustunidagi vaqtga qo'ying. Har satr o'z "Oyna"sidan oshmasligi kerak.

| # | Boshlanish | Oyna | Matn |
| --- | --- | --- | --- |
| 1 | 00:00.2 | 0–3 s | Xitoyda — olti yuz to'qson to'qqiz yuan. |
| 2 | 00:03.1 | 3–5,5 s | Uyingizgacha qanchaga tushadi? |
| 3 | 00:05.5 | 5,5–8,5 s | Boj? Kargo? Kurs? Kuryer? |
| 4 | 00:08.6 | 8,5–12 s | Javob — bitta skrinshotda. |
| 5 | 00:12.2 | 12–15,5 s | Bu — Pochtam. Global xaridlar biz bilan oson. |
| 6 | 00:15.7 | 15,5–20,5 s | Rasmini yuklang — sun'iy intellekt tovarni do'konlardan topadi. |
| 7 | 00:20.7 | 20,5–26,5 s | Narxni skrinshot qiling — ilova boj, kargo va kurs bilan jami summani chiqaradi. |
| 8 | 00:26.7 | 26,5–31,5 s | Narx tarkibi ochiq. Oyiga ikki yuz dollargacha — bojsiz. |
| 9 | 00:31.6 | 31,5–35,5 s | Butun savatni ham bitta skrinshot bilan hisoblang. |
| 10 | 00:35.7 | 35,5–40 s | Eng arzon kuryerni tanlang — u siz uchun sotib oladi. |
| 11 | 00:40.2 | 40–44 s | Yetti do'kon uchun — qadam-baqadam qo'llanma. |
| 12 | 00:44.2 | 44–47,5 s | Jo'natmangizni eshigingizgacha kuzating. |
| 13 | 00:47.6 | 47,5–52 s | Qirq uch do'kon. Yigirma kuryer. Uch til. |
| 14 | 00:52.2 | 52–56 s | Hammasi — bitta ilovada. |
| 15 | 00:56.4 | 56–60 s | Orzuingiz — eshigingiz oldida. |
| 16 | 01:00.3 | 60–63,5 s | Pochtam. Orzu qiling — qolganini biz hal qilamiz. |
| 17 | 01:03.6 | 63,5–66 s | Pochtam nuqta uz. |

Ekrandagi aniq lahzalar:
- 3-satr: so'zlar 5,5 · 6,25 · 7,0 · 7,75 s da chiqadi.
- 13-satr: raqamlar 47,5 · 49,0 · 50,5 s da chiqadi.
- 17-satr: "pochtam.uz" yozuvi 63,5 s da chiqadi.

## 2. Bitta matn holida (tez sinash uchun)

Butun matnni bir martada yaratish ham mumkin. Pauzalar taxminiy, shuning
uchun keyin montajda satrlarni biroz surib to'g'rilash kerak bo'ladi.

**Multilingual v2 / Turbo uchun** (`<break>` pauza teglari bilan):

```
Xitoyda — olti yuz to'qson to'qqiz yuan. <break time="0.4s" />
Uyingizgacha qanchaga tushadi? <break time="0.2s" />
Boj? <break time="0.4s" /> Kargo? <break time="0.3s" /> Kurs? <break time="0.4s" /> Kuryer? <break time="0.4s" />
Javob — bitta skrinshotda. <break time="1.8s" />
Bu — Pochtam. Global xaridlar biz bilan oson. <break time="0.5s" />
Rasmini yuklang — sun'iy intellekt tovarni do'konlardan topadi. <break time="0.5s" />
Narxni skrinshot qiling — ilova boj, kargo va kurs bilan jami summani chiqaradi. <break time="0.5s" />
Narx tarkibi ochiq. Oyiga ikki yuz dollargacha — bojsiz. <break time="0.6s" />
Butun savatni ham bitta skrinshot bilan hisoblang. <break time="0.8s" />
Eng arzon kuryerni tanlang — u siz uchun sotib oladi. <break time="0.7s" />
Yetti do'kon uchun — qadam-baqadam qo'llanma. <break time="0.9s" />
Jo'natmangizni eshigingizgacha kuzating. <break time="0.5s" />
Qirq uch do'kon. <break time="0.5s" /> Yigirma kuryer. <break time="0.4s" /> Uch til. <break time="1.0s" />
Hammasi — bitta ilovada. <break time="2.0s" />
Orzuingiz — eshigingiz oldida. <break time="1.4s" />
Pochtam. Orzu qiling — qolganini biz hal qilamiz. <break time="0.5s" />
Pochtam nuqta uz.
```

**Eleven v3 uchun.** v3 `<break>` teglarini o'qimaydi, shuning uchun pauzalar
tinish belgilari bilan beriladi. Kvadrat qavsdagi teglar ovoz ohangini
boshqaradi; ularni o'chirib tashlasangiz ham bo'ladi.

```
Xitoyda — olti yuz to'qson to'qqiz yuan.

[curious] Uyingizgacha qanchaga tushadi?

Boj?... Kargo?... Kurs?... Kuryer?

Javob — bitta skrinshotda.

[excited] Bu — Pochtam. Global xaridlar biz bilan oson.

Rasmini yuklang — sun'iy intellekt tovarni do'konlardan topadi.

Narxni skrinshot qiling — ilova boj, kargo va kurs bilan jami summani chiqaradi.

Narx tarkibi ochiq. Oyiga ikki yuz dollargacha — bojsiz.

Butun savatni ham bitta skrinshot bilan hisoblang.

Eng arzon kuryerni tanlang — u siz uchun sotib oladi.

Yetti do'kon uchun — qadam-baqadam qo'llanma.

Jo'natmangizni eshigingizgacha kuzating.

Qirq uch do'kon... Yigirma kuryer... Uch til.

Hammasi — bitta ilovada.

[excited] Orzuingiz — eshigingiz oldida.

Pochtam. Orzu qiling — qolganini biz hal qilamiz. Pochtam nuqta uz.
```

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
- **Sozlamalar (v3):** Stability — Natural.

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
   (taxminan 10,5–12 s, 54,5–56 s va 65 s dan keyin) musiqani balandroq
   qo'ying.
4. Yakuniy balandlik: taxminan −14 LUFS, eng baland nuqta −1 dBFS.

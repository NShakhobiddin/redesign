# Pochtam promo — diktor matni (ElevenLabs uchun)

Video 44,5 soniya. Har bir sahnaga bitta satr to'g'ri keladi. Ekrandagi
yozuvlar diktor aytayotgan gapni takrorlaydi. Matn TTS uchun tayyorlangan:
raqamlar so'z bilan yozilgan, qisqartmalar yo'q ("AI" o'rniga "sun'iy
intellekt", "pochtam.uz" o'rniga "Pochtam nuqta uz").

- Ovozsiz video: [`out/pochtam-promo-silent.mp4`](out/pochtam-promo-silent.mp4)
- Subtitr / joylash uchun belgilar: [`out/pochtam-promo-voiceover.srt`](out/pochtam-promo-voiceover.srt)

## 1. Satrma-satr (eng aniq usul)

Har bir satrni ElevenLabs'da alohida yarating va montajda "Boshlanish"
ustunidagi vaqtga qo'ying. Har satr o'z "Oyna"sidan oshmasligi kerak.

| # | Boshlanish | Oyna | Matn |
| --- | --- | --- | --- |
| 1 | 00:00.2 | 0–3 s | Xitoyda — olti yuz to'qson to'qqiz yuan. |
| 2 | 00:03.1 | 3–6 s | Uyingizgacha qanchaga tushadi? |
| 3 | 00:06.1 | 6–8 s | Javob — bitta skrinshotda. |
| 4 | 00:08.2 | 8–10 s | Bu — Pochtam. |
| 5 | 00:10.1 | 10–14 s | Rasmini yuklang — sun'iy intellekt tovarni topadi. |
| 6 | 00:14.1 | 14–19 s | Narxni skrinshot qiling — jami summa boj, kargo va kurs bilan tayyor. |
| 7 | 00:19.1 | 19–22 s | Oyiga ikki yuz dollargacha — bojsiz. |
| 8 | 00:22.1 | 22–25 s | Butun savatni ham — bitta skrinshotda. |
| 9 | 00:25.1 | 25–28,5 s | Eng arzon kuryer — u siz uchun sotib oladi. |
| 10 | 00:28.6 | 28,5–32 s | Qadam-baqadam qo'llanma va kuzatuv. |
| 11 | 00:32.1 | 32–35 s | Qirq uch do'kon. Yigirma kuryer. Uch til. |
| 12 | 00:35.1 | 35–38 s | Hammasi — bitta ilovada. |
| 13 | 00:38.4 | 38–41 s | Orzuingiz — eshigingiz oldida. |
| 14 | 00:42.6 | 41–44,5 s | Pochtam nuqta uz. |

Ekrandagi aniq lahzalar:
- 2-satr: "Boj? Kargo? Kurs? Kuryer?" yorliqlari 4,5–5,25 s da chiqadi.
- 6-satr: hisob ekranda bo'lak-bo'lak quriladi: $97.80 (16,3 s), + $4.40
  (16,6 s), + $0 (16,9 s), = $102.20 (17,25 s).
- 10-satr: 30,25 s da "Jo'natmani kuzating" kadri chiqadi.
- 11-satr: raqamlar 32 · 33 · 34 s da chiqadi.
- 14-satr: "pochtam.uz" yozuvi 42,5 s da chiqadi.

## 2. Bitta matn holida (tez sinash uchun)

Butun matnni bir martada yaratish ham mumkin. Pauzalar taxminiy, shuning
uchun keyin montajda satrlarni biroz surib to'g'rilash kerak bo'ladi.

**Multilingual v2 / Turbo uchun** (`<break>` pauza teglari bilan):

```
Xitoyda — olti yuz to'qson to'qqiz yuan. <break time="0.4s" />
Uyingizgacha qanchaga tushadi? <break time="0.6s" />
Javob — bitta skrinshotda. <break time="0.3s" />
Bu — Pochtam. <break time="1.0s" />
Rasmini yuklang — sun'iy intellekt tovarni topadi. <break time="0.5s" />
Narxni skrinshot qiling — jami summa boj, kargo va kurs bilan tayyor. <break time="0.8s" />
Oyiga ikki yuz dollargacha — bojsiz. <break time="0.4s" />
Butun savatni ham — bitta skrinshotda. <break time="0.5s" />
Eng arzon kuryer — u siz uchun sotib oladi. <break time="0.4s" />
Qadam-baqadam qo'llanma va kuzatuv. <break time="0.8s" />
Qirq uch do'kon. <break time="0.3s" /> Yigirma kuryer. <break time="0.3s" /> Uch til. <break time="0.3s" />
Hammasi — bitta ilovada. <break time="1.5s" />
Orzuingiz — eshigingiz oldida. <break time="1.7s" />
Pochtam nuqta uz.
```

**Eleven v3 uchun.** v3 `<break>` teglarini o'qimaydi, shuning uchun pauzalar
tinish belgilari bilan beriladi. Kvadrat qavsdagi teglar ovoz ohangini
boshqaradi; ularni o'chirib tashlasangiz ham bo'ladi.

```
Xitoyda — olti yuz to'qson to'qqiz yuan.

[curious] Uyingizgacha qanchaga tushadi?

Javob — bitta skrinshotda.

[excited] Bu — Pochtam.

Rasmini yuklang — sun'iy intellekt tovarni topadi.

Narxni skrinshot qiling — jami summa boj, kargo va kurs bilan tayyor.

Oyiga ikki yuz dollargacha — bojsiz.

Butun savatni ham — bitta skrinshotda.

Eng arzon kuryer — u siz uchun sotib oladi.

Qadam-baqadam qo'llanma va kuzatuv.

Qirq uch do'kon... Yigirma kuryer... Uch til.

Hammasi — bitta ilovada.

[excited] Orzuingiz — eshigingiz oldida.

Pochtam nuqta uz.
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
   (taxminan 9–10 s, 37–38 s, 41–42,5 s va 43,7 s dan keyin) musiqani
   balandroq qo'ying.
4. Yakuniy balandlik: taxminan −14 LUFS, eng baland nuqta −1 dBFS.

# Mobil telefon deklaratsiyasi — montaj rejasi

Bu fayl qaysi kadr qaysi sahnaga borishini belgilaydi. Kadrlarning o'zi
(aeroport, bojxona, ovozlar) ochiq repozitoriyga **qo'shilmaydi**, ular faqat
montaj vaqtida ishlatiladi. Sahnalar: [`SSENARIY.md`](SSENARIY.md).

Hamma kadrlar vertikal, 1080×1920. Ko'pi 60 fps, K06, K07-alt-yashil va
K09b-alt 30 fps. Flow kliplari 720×1280, 24 fps, ular 1080×1920 ga
kattalashtiriladi. Yakuniy video 1080×1920, 30 fps bo'ladi.

## Kelgan materiallar

| Fayl | Nima ko'rinadi | Sahna | Qaysi qismi |
| --- | --- | --- | --- |
| Flow · Airplane landing from passenger | Illyuminator yonida qo'lda telefon, tashqarida Uzbekistan Airways samolyotlari | **1 · Hook** | 0–4 s |
| Flow · Aircraft landing at airport | Uzbekistan Airways samolyoti yerga tegadi (tutun), terminal oldidan o'tadi | **2 · Qo'nish** | 1,5–6 s |
| K03-terminalga-kirish | Kelish zali bo'ylab oldinga yurish | 2 · Qo'nish | 0–4 s |
| K04-bagaj-lentasi | Qahramon 2-lenta yonida telefonga qaraydi → "Bagajni olish" belgisi | **3 · Bagaj zali** | 0–3 s, 4–6,5 s |
| K05-telefonga-qarash | Lenta ustida telefon yozayotgan qo'llar, yaqin plan | 3 · Bagaj zali | 0–3 s |
| K04-alt-bagaj-lentasi-odamlar | Bagaj zali, umumiy plan | 3 · zaxira | 3,7–7,5 s (odamlarsiz qismi) |
| K01-telefon-qolda | Lenta yonida ybdweb'ni to'ldirish: kirish sahifasi → Face ID | **4–5 · Sayt / to'ldirish** | 0–6 s |
| K05-alt-telefon-lenta-yaqin | Face ID ovali, yaqin plan | **5b · Face ID** | 1–4,3 s |
| K09-alt-inspektor-kioskda | Xodim kioskda yo'lovchiga yordam beradi; devorda "Mobil qurilma olib kirdingizmi? · ybdweb.customs.uz" plakati | **4 · Sayt** (plakat) · 14 · UZIMEI | 4–6 s (plakat), 0–10 s |
| K06-chamadon-olish | Chamadonni lentadan olib, yurib ketadi | **9 · Nazorat** | 0–7 s |
| K07-bojxona-nazorati | Nazorat postiga yurish | 9 · Nazorat | 1,5–9 s (yo'lak belgisidan keyin) |
| K09b-alt-imei-darcha-past-sifat | Qahramon darchada xodimga telefonini ko'rsatadi | 9 · Nazorat (QR ko'rsatish) | 2–9 s |
| K08-bank-kassasi | "To'lovlar uchun kassa / Payment Desk" ga yaqinlashish | **12 · To'lov** | 2–8 s |
| K09-alt-inspektor-kompyuterda | Xodim kompyuterda, qo'lida telefon, skaner | **13 · BKO** | 0–8 s |
| K09-alt-uzimei-pullik-xizmat | "Bojxona-servis" banneri, "UZ IMEI" peshtaxtalari | **14 · UZIMEI** | 0–6 s |
| K09b-imei-royxatga-olish | Yo'lovchi IMEI kioskida | 14 · UZIMEI | 1,5–7,5 s |
| K09-alt-uzimei-peshtaxtalar | UZ IMEI peshtaxtalari, umumiy plan | 14 · zaxira | 2–5 s |
| K10-chiqish | Eskalatordan tushib, shaharga chiqish | **14 → 16 · Chiqish / yakun** | 1,5–9 s |
| K07-alt-qizil-yolak · K07-alt-yashil-yolak | Yo'lak belgilari | ishlatilmaydi | yo'lak nomi videoda ko'rsatilmaydi |
| K08-alt-valyuta-ayirboshlash | Valyuta ayirboshlash, odamlar yaqin | ishlatilmaydi | to'lov kassasi emas, yuzlar yaqin |
| K09-bojxona-servis | Ma'lumot peshtaxtasi va robot | zaxira | bojxona servisi emas |
| K10-chiqish (2-nusxa) | Birinchisi bilan bir xil fayl | — | — |

## Maxfiylik (montajda xiralashtiriladi)

- **K01** 1,3–2,8 s: ekranda pasport seriya-raqami ko'rinadi → maydon
  xiralashtiriladi.
- **K09-alt-inspektor-kompyuterda**: monitordagi jadval (deklaratsiyalar
  ro'yxati) → monitor xiralashtiriladi.
- **K09b-imei-royxatga-olish**, **K09-alt-inspektor-kioskda**: yo'lovchining
  yuzi yon tomondan ko'rinadi → yuz xiralashtiriladi.
- K03, K04, K07 va K10 dagi uzoqdagi odamlar juda kichik, ular
  xiralashtirilmaydi.

## Xodim ovozi (Jahongir)

Bitta yozuvdagi oltita gap ajratildi. Har bir Flow klipida xodim taxminan
shuncha vaqt gapirishi kerak:

| Klip | Gap | Uzunligi |
| --- | --- | --- |
| AI01 | Imey kodini bilish oson… | 6,6 s |
| AI02 | Ikki SIM-kartali telefonda… | 4,0 s |
| AI03 | Assalomu alaykum!… Marhamat, xush kelibsiz! | 7,2 s |
| AI04 | Telefoningiz qiymati me'yordan oshgan… | 5,4 s |
| AI05 | To'lovdan so'ng be-ka-o'ni… | 3,2 s |
| AI06 | To'lov qabul qilindi… | 5,6 s |

## Hali kerak

1. **V01 · Diktor ovozi** — [`VOICEOVER.md`](VOICEOVER.md) dagi diktor matni,
   bitta yozuvda. Montaj vaqtlari shu ovozga qarab belgilanadi. Ovoz xodimning
   ovozidan (Jahongir) aniq farq qilsin.
2. **E01 · ybdweb ekran yozuvi** — butun jarayon: pasport → Face ID → "Mobil
   qurilmani deklaratsiyalash" → IMEI va narx → QR-kod.
3. **AI01–AI06 · Flow'dagi xodim kliplari** — xodim ovozi tayyor, uni
   kliplarga o'zim qo'yaman.
4. **Musiqa** — [`MUSIC-PROMPT.md`](MUSIC-PROMPT.md) dagi Suno prompti bilan.
5. Ixtiyoriy:
   - **E02** — to'lov ilovasidagi to'lov (bo'lmasa, brendsiz grafika chizaman);
   - **E03** — uzimei.uz yoki Birda'da ro'yxatdan o'tish.

# Mobil telefon deklaratsiyasi — ElevenLabs uchun matn

Ssenariy: [`SSENARIY.md`](SSENARIY.md). Uchta ovoz bor: 🎙 diktor, 👮 bojxona
xodimi, 🧳 yo'lovchi (ixtiyoriy).

**Model:** Eleven v3. Kvadrat qavsdagi teglar ovozning ohangini (emotsiyasini)
belgilaydi va o'qilmaydi.

**Talaffuz.** Qisqartma va sayt nomlari quyidagi matnlarda o'qilishiga qarab
yozilgan, aks holda ElevenLabs ularni harfma-harf yoki g'alati o'qishi mumkin.
Ekrandagi yozuvlar asl holida qoladi.

| Ekranda | Matnda (talaffuz) |
| --- | --- |
| ybdweb.customs.uz | ye-be-de-veb nuqta kastoms nuqta uz |
| IMEI | imey |
| UZIMEI · uzimei.uz | uzimey · uzimey nuqta uz |
| QR-kod | kyu-ar kod |
| BKO | be-ka-o |
| «Toshkent-AERO» | Toshkent-Aero |

## 🎙 Diktor

**Butun matnni bitta qilib yarating.** Bo'sh qatorlar pauza beradi. Tayyor
yozuvni menga yuborsangiz, Pochtam videosidagidek uni gaplarga bo'lib, har
birini o'z sahnasiga o'zim qo'yaman.

```
[excited] Chet eldan yangi telefon olib keldingizmi? [serious] Uni deklaratsiya qilish — majburiy! [friendly] Qanday qilishni hozir ko'rsatamiz.

[warm] Xush kelibsiz! Bojxonadan tez va muammosiz o'tish uchun bor-yo'g'i bir necha oddiy qadam qoldi.

[friendly] Bagaj kelguncha vaqtingiz bor. Deklaratsiya aynan shu yerda — aeroportning o'zida, telefoningizdan to'ldiriladi.

[clear] Brauzerda ye-be-de-veb nuqta kastoms nuqta uz saytini oching. [reassuring] Hech qanday ilova o'rnatish shart emas.

[calm] Avval pasport ma'lumotlaringizni kiriting.

[calm] Reys raqamini va qaysi davlatdan uchib kelganingizni belgilang.

[calm] Tovarlar bo'limida "Mobil telefon"ni tanlang.

[clear] Har bir telefonning imey kodini, modelini va narxini yozing.

[satisfied] Tekshirib, yuboring. Ekranda kyu-ar kod chiqadi — uni saqlab qo'ying.

[clear] Eng muhimi — qiymat. Havo yo'li bilan jami ming dollargacha — bojsiz. [serious] Oshsa — oshgan qismi uchun to'lov olinadi.

[reassuring] O'zbekistonda sotib olinib, uzimeyda ro'yxatdan o'tgan telefon esa deklaratsiya qilinmaydi.

[confident] Bagajni olgach, bojxona nazoratiga o'ting va xodimga deklaratsiyangizning kyu-ar kodini ko'rsating.

[reassuring] To'lovni terminalning o'zidagi bank kassasida qilishingiz mumkin — [upbeat] yoki telefoningizdan, istalgan to'lov tizimi orqali onlayn.

[serious] Oxirgi qadam — hamma uchun, me'yor ichida bo'lsa ham: imey kodini uzimey tizimida ro'yxatdan o'tkazing — [friendly] uzimey nuqta uz saytida, Birda ilovasida yoki aeroportdagi Bojxona servisda.

[confident] Eslab qoling: bagaj kutayotganda — deklaratsiya. Nazoratda — kyu-ar kod. Qiymat oshsa — to'lov va be-ka-o. Oxirida esa, har doim — uzimey. [happy] Bor-yo'g'i shu!

[warm] Toshkent-Aero ixtisoslashtirilgan bojxona kompleksi. [cheerful] Xayrli yo'l!
```

Qaysi gap qaysi sahnaga tushadi:

| Gap | Sahna |
| --- | --- |
| Chet eldan yangi telefon… | 1 · Hook |
| Xush kelibsiz!… | 2 · Qo'nish |
| Bagaj kelguncha… | 3 · Bagaj zali |
| Brauzerda ye-be-de-veb… | 4 · Saytni ochish |
| Avval pasport… · Reys raqamini… · Tovarlar bo'limida… · Har bir telefonning… · Tekshirib, yuboring… | 5 · To'ldirish (5 qadam) |
| Eng muhimi — qiymat… | 7 · Qiymat |
| O'zbekistonda sotib olinib… | 8 · Istisno |
| Bagajni olgach… | 9 · Bojxona nazorati |
| To'lovni terminalning… | 12 · To'lov |
| Oxirgi qadam — hamma uchun… | 14 · UZIMEI |
| Eslab qoling… | 15 · Eslatma |
| Toshkent-Aero… | 16 · Yakun |

## 👮 Bojxona xodimi

Bu matnlar ikki holatda kerak:
- Google Flow'dagi xodim kliplarida ovozni almashtirsak (B yo'l);
- yoki Veo o'zbekchani yaxshi talaffuz qilolmasa.

Agar Veo o'zi yaxshi gapirsa, ular kerak emas. Har bir gapni **alohida**
yarating. Raqamlar Flow kliplarining raqamlari bilan bir xil.

**1-klip · IMEI (6-sahna)**
```
[friendly] Imey kodini bilish oson: telefoningizda yulduzcha, panjara, nol, olti, panjara tering.
```
**2-klip · Ikki SIM-karta (6-sahna)**
```
[helpful] Ikki SIM-kartali telefonda ikkita kod chiqadi — ikkalasini ham yozing.
```
**3-klip · Me'yor ichida (10-sahna)**
```
[warm] Assalomu alaykum! Deklaratsiyangiz tayyor ekan. [reassuring] Me'yor ichida — to'lov yo'q. [cheerful] Marhamat, xush kelibsiz!
```
**4-klip · Qiymat oshganda (11-sahna)**
```
[calm] Telefoningiz qiymati me'yordan oshgan. Oshgan qismiga yagona bojxona to'lovi to'lanadi.
```
**5-klip · To'lovdan keyin BKO (11-sahna)**
```
[reassuring] To'lovdan so'ng be-ka-o'ni rasmiylashtirib beraman.
```
**6-klip · BKO berildi (13-sahna)**
```
[warm] To'lov qabul qilindi. Mana, bojxona kirim orderingiz — be-ka-o. [cheerful] Telefoningiz rasmiylashtirildi.
```

## 🧳 Yo'lovchi (ixtiyoriy, 3-sahna)

```
[curious] Telefonimni deklaratsiya qilishim kerakmi? [confused] Qayerda qilaman?
```

## Ovozlar va sozlamalar

**Ovoz tanlash** — Voice Library'dan tanlang yoki Voice Design orqali yarating.
Voice Design uchun tavsiflar (inglizcha):

- 🎙 **Diktor** (Pochtam'dagi Bekzod ovozi ham mos keladi):
  ```
  Warm, confident Uzbek male narrator in his thirties for a public information video. Friendly and trustworthy, clear diction, medium pace, studio quality, no background noise.
  ```
- 👮 **Xodim:**
  ```
  Calm, polite Uzbek male customs officer in his thirties. Professional and reassuring, clear official diction, warm but not casual, medium pace, studio quality, no background noise.
  ```
- 🧳 **Yo'lovchi:**
  ```
  Young Uzbek traveler in his twenties, curious and slightly unsure, natural conversational tone, close microphone, no background noise.
  ```

Diktor va xodim ovozlari bir-biridan aniq farq qilsin, masalan, biri chuqurroq,
biri yengilroq.

**Sozlamalar (Eleven v3):**
- Stability — **Natural**. Emotsiyalar kuchliroq bo'lsin desangiz — **Creative**.
- Robust rejimida teglar kam ta'sir qiladi.
- Biror gapda ohang haddan oshsa, o'sha gapdan tegni olib tashlab, faqat shu
  gapni qayta yarating.

**Sozlamalar (Multilingual v2, agar v3 o'zbekchani yomon o'qisa):**
- Stability 45–55%
- Similarity 75–80%
- Style 15–25%
- Speaker boost yoqilgan
- Speed 1.0

v2 kvadrat qavsdagi teglarni tushunmaydi, ularni olib tashlang.

**Tekshirish uchun:** avval diktor matnidagi 4-, 8- va 14-gaplarni yaratib,
talaffuzni tinglang. Ularda "ye-be-de-veb", "imey" va "uzimey" so'zlari bor. Biror so'z yoqmasa,
uni boshqacha yozib ko'ring, masalan "imey" o'rniga "ay-em-i-ay".

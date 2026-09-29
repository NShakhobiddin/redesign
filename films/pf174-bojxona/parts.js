// The series script: six parts, each a list of scenes. Text follows the decree
// (PF-174, 27.08.2026, lex.uz); *stars* mark what the viewer should notice.
// Plain apostrophes are typeset as Uzbek ʻ (after o, g) and ʼ (elsewhere).
'use strict';
const PF_PARTS = (() => {
const {YEL, TEAL, RED, GRN, GRN2, SKY} = PF.C;
return [
// ================================================================== 1
{n: 1, title: "Farmon nima haqida?", short: "Farmon nima haqida?", icon: 'gate',
 sub: "Asosiy maqsadlar va «Yangi O'zbekiston bojxonasi — 2030» strategiyasi",
 scenes: [
  {eyebrow: "Hujjat", title: "Prezident Farmoni PF-174", icon: 'doc', blocks: [
    {t: 'text', s: "*2026-yil 27-avgustda* imzolangan."},
    {t: 'text', s: "Mavzusi: davlat bojxona xizmati organlari faoliyatini takomillashtirish va bojxona ma'murchiligida zamonaviy yondashuvlarni joriy etish chora-tadbirlari.", size: 38},
    {t: 'chips', items: ["7 bo'lim", "21 band", "3 ilova"]},
    {t: 'note', s: "Ilovalar: *strategiya*, 56 bandli *«yo'l xaritasi»* va ayrim hujjatlarga o'zgartirishlar."},
  ]},
  {eyebrow: "Asosiy g'oya", title: "«Intellektual bojxona»", icon: 'chip', blocks: [
    {t: 'text', s: "Zamonaviy axborot texnologiyalarini keng joriy etib, bojxonani *«Intellektual bojxona»*ga aylantirish."},
    {t: 'chips', items: ["Ochiqlik", "Shaffoflik", "Ishonchlilik"]},
    {t: 'text', s: "Maqsad — bojxona sohasini *korrupsiyadan xoli* tizimga aylantirish."},
  ]},
  {eyebrow: "2030-yilga qadar", title: "Uchta raqamli maqsad", blocks: [
    {t: 'stat', v: '60', suf: '%', label: "*inson omilisiz* bojxona rasmiylashtiruvi ko'lami"},
    {t: 'stat', v: '4,4', suf: '%', label: "bojxona tushumlarining *yalpi ichki mahsulotdagi* ulushi"},
    {t: 'stat', v: '2', suf: '×', label: "bojxona rasmiylashtiruvi vaqti *ikki barobar* qisqaradi"},
    {t: 'text', s: "Shuningdek: xizmat sifatini yaxshilash va tadbirkorlarning bojxonaga *ishonchini* mustahkamlash.", size: 36},
  ]},
  {eyebrow: "Strategiya ko'rsatkichi", title: "Rasmiylashtiruv qancha vaqt oladi?", blocks: [
    {t: 'clocks', items: [{label: 'Importda', v: '2 soat', frac: 2/12}, {label: 'Eksportda', v: '30 daqiqa', frac: .5, color: GRN}]},
    {t: 'text', s: "2030-yilga borib bojxona rasmiylashtiruvining *o'rtacha* vaqtini shunchaga qisqartirish ko'zlangan.", size: 38},
  ]},
  {eyebrow: "2026–2030", title: "«Yangi O'zbekiston bojxonasi — 2030»", blocks: [
    {t: 'text', s: "Farmon bilan strategiya tasdiqlandi. Uning *5 ta ustuvor yo'nalishi*:", size: 38},
    {t: 'item', n: 1, head: "Tadbirkorlar va jismoniy shaxslarga qulay sharoit", headSize: 36, gap: 18},
    {t: 'item', n: 2, head: "Infratuzilma va sun'iy intellekt bilan raqamlashtirish", headSize: 36, gap: 18},
    {t: 'item', n: 3, head: "Bojxona ma'murchiligini takomillashtirish", headSize: 36, gap: 18},
    {t: 'item', n: 4, head: "Kadrlar bilan ishlash va komplayens tizimi", headSize: 36, gap: 18},
    {t: 'item', n: 5, head: "Xalqaro hamkorlikni rivojlantirish", headSize: 36, gap: 18},
  ]},
  {eyebrow: "Joriy holat", title: "Deklaratsiyalar qaysi yo'lakdan o'tadi?", blocks: [
    {t: 'text', s: "Xavflarni boshqarish axborot tizimi joriy etilgach, deklaratsiyalar shunday taqsimlangan:", size: 36},
    {t: 'lanes', segs: [{v: 79, color: YEL, label: "«sariq» va «yashil» yo'lak — soddalashtirilgan tartib"}, {v: 10, color: TEAL, label: "inson omilisiz, avtomatik"}, {v: 11, color: RED, label: "«qizil» yo'lak — to'liq nazorat"}]},
    {t: 'note', s: "Manba: strategiyaning «Joriy holat tahlili» bobi."},
  ]},
  {eyebrow: "Joriy holat", title: "So'nggi yillar natijalari", blocks: [
    {t: 'stat', v: '76,2', size: 116, label: "*trln so'm* — 2025-yilda bojxona to'lovlari tushumi, 2024-yilga nisbatan *21% ko'p*"},
    {t: 'stat', v: '74', from: '140', size: 116, label: "Jahon banki LPI indeksining *bojxona samaradorligi* subindikatorida o'rin (avval *140-o'rin*; 2024-yil hisoboti)"},
    {t: 'stat', v: '3', suf: '×', size: 116, label: "rasmiylashtiruvning o'rtacha vaqti *3 baravar* qisqardi — u masofaviy tarzga o'tkazildi"},
  ]},
  {eyebrow: "Muammolar", title: "Nimalar hali to'siq bo'lmoqda?", icon: 'magnifier', blocks: [
    {t: 'item', n: 1, s: "Axborot tizimlari *ko'p*, ular o'zaro *yaxshi bog'lanmagan*.", gap: 18},
    {t: 'item', n: 2, s: "Ayrim bojxona postlari infratuzilmasi *zamonaviy talablarga* to'liq javob bermaydi.", gap: 18},
    {t: 'item', n: 3, s: "Chegarada *jismoniy tekshiruvlar ko'p*, idoralar hamkorligi sust — yuk *to'xtab turadi*.", gap: 18},
    {t: 'item', n: 4, s: "Import bo'yicha oldindan beriladigan *ma'lumotlar sifati past*.", gap: 18},
    {t: 'note', s: "Strategiyadagi SWOT tahlili va Jahon bankining «Connecting to Compete 2025» hisoboti asosida."},
  ]},
 ]},
// ================================================================== 2
{n: 2, title: "Tadbirkorlarga yengilliklar", short: "Tadbirkorlarga yengilliklar (2026)", icon: 'truck',
 sub: "2026-yil 1-sentabr va 1-oktabrdan boshlanadigan o'zgarishlar",
 scenes: [
  {eyebrow: "2026-yil 1-sentabrdan", date: true, title: "Beshta talab bekor qilinadi", icon: 'doc', blocks: [
    {t: 'text', s: "Farmonning 3-bandi tashqi savdodagi *ortiqcha to'siqlarni* olib tashlaydi. Ularni birma-bir ko'ramiz:"},
    {t: 'chips', items: ["Invoys bo'yicha import", "Invoys bo'yicha eksport", "So'mdagi eksport", "Oziq-ovqat namunasi", "Ruxsatnomalar"], size: 34},
  ]},
  {eyebrow: "2026-yil 1-sentabrdan", date: true, title: "Invoys asosidagi savdo", blocks: [
    {t: 'item', n: 1, head: "Import — shartnomasiz, invoys asosida", s: "Xorijiy hamkorga *oldindan to'lov* o'tkazish cheklovi.", stamp: 'BEKOR'},
    {t: 'item', n: 2, head: "Eksport — shartnomasiz, invoys asosida", s: "Oldindan *50 foiz tushumni* ta'minlash talabi.", stamp: 'BEKOR'},
  ]},
  {eyebrow: "2026-yil 1-sentabrdan", date: true, title: "Milliy valyutadagi eksport", icon: 'cash', blocks: [
    {t: 'item', n: 3, head: "So'mda eksport qilishda", s: "*Oldindan to'lov* yoki kafolatli to'lov shakllarini (*akkreditiv, bank kafolati, sug'urta polisi*) taqdim etish talabi.", stamp: 'BEKOR'},
  ]},
  {eyebrow: "2026-yil 1-sentabrdan", date: true, title: "Oziq-ovqat va ruxsatnomalar", blocks: [
    {t: 'item', n: 4, head: "Oziq-ovqat namunasi sinovga yetmasa", s: "*Sanitariya-epidemiologik xulosa* rasmiylashtirish talabi. Bunda vakolatli organ namuna sinov uchun yetarli emasligi haqida *xat* beradi.", stamp: 'BEKOR'},
    {t: 'item', n: 5, head: "Bojxonada ruxsatnoma va guvohnoma", s: "Biologik aktiv va yangi kimyoviy moddalar, oziq-ovqat qo'shimchalari, polimer, parfyumeriya-kosmetika uchun *ruxsatnoma*, dori vositalari va tibbiy jihozlar uchun *davlat ro'yxati guvohnomasi*ni taqdim etish.", stamp: 'BEKOR'},
    {t: 'note', s: "Ruxsatnoma va guvohnoma borligi endi *majburiy muvofiqlikni baholash* va sanitariya-epidemiologik xulosa rasmiylashtirilayotganda nazorat qilinadi."},
  ]},
  {eyebrow: "2026-yil 1-oktabrdan", date: true, title: "QQSni o'zaro hisobga olish", icon: 'coins', blocks: [
    {t: 'text', s: "Tovar import qilishda to'lanadigan *qo'shilgan qiymat solig'i* summalarini o'zaro hisobga olish imkoniyati yaratiladi."},
    {t: 'text', s: "Kimlar uchun:", size: 36, color: '#6b7186'},
    {t: 'check', s: "Soliq organlarida *xavf darajasi past*", gap: 20},
    {t: 'check', s: "*QQS guvohnomasi faol*", gap: 20},
    {t: 'note', s: "Tashqi iqtisodiy faoliyat ishtirokchilari uchun. Hisobga olish tartibi — yo'l xaritasi bo'yicha 2026-yil oktabrda."},
  ]},
  {eyebrow: "2026-yil 1-oktabrdan", date: true, title: "Eksport yig'imlari 30% kamayadi", icon: 'percent', blocks: [
    {t: 'bars', rows: ["Bojxona rasmiylashtiruvi", "Fitosanitariya sertifikati va fumigatsiya", "Tovarning kelib chiqish sertifikati"], from: 100, to: 70, tag: '−30%'},
    {t: 'text', s: "Sabab — eksportda nazorat jarayonlari *raqamlashtiriladi* va takomillashtiriladi.", size: 38},
  ]},
  {eyebrow: "Yana nimalar kutilmoqda", title: "Tadbirkor uchun keyingi qadamlar", icon: 'phone', blocks: [
    {t: 'tl', when: "2028-yilgacha", s: "Bojxonaning *barcha xizmatlari va to'lovlari* — bitta *mobil ilovada* (farmon, 3-band)."},
    {t: 'tl', when: "2027-yil noyabr", s: "Bojxona to'lovlarida tijorat banklari *foiz undirishini bekor qilish* — qonun loyihasi."},
    {t: 'tl', when: "2027-yil iyul", s: "*«Feedback»* moduli: tadbirkorlar bahosi asosida postlar va xodimlar *reytingi*."},
    {t: 'tl', when: "Strategiya", s: "«20 ming tadbirkor — 500 ming malakali mutaxassis» dasturi ishtirokchilariga to'lovlarni ta'minot asosida *120 kungacha bo'lib* to'lash huquqi."},
    {t: 'tl', when: "Doimiy", s: "*«Customs Open Dialogue»* platformasi va har oylik ochiq muloqotlar."},
  ]},
 ]},
// ================================================================== 3
{n: 3, title: "Bojxona qiymati va hujjatlar", short: "Bojxona qiymati va hujjatlar (2027)", icon: 'magnifier',
 sub: "2027-yildan: qiymat nazorati, sertifikatlar, pulni qaytarish va dastlabki deklaratsiya",
 scenes: [
  {eyebrow: "2027-yil 1-yanvardan", date: true, title: "Bojxona qiymati nazorati soddalashadi", blocks: [
    {t: 'item', n: 1, s: "Xavf darajasi past ishtirokchilar tovarining qiymati tovar *erkin muomalaga chiqarilgandan keyin* nazorat qilinadi.", gap: 22},
    {t: 'item', n: 2, s: "Qiymatni nazorat qilish uchun *qat'iy bojxona qiymati* belgilash *taqiqlanadi*.", gap: 22},
    {t: 'item', n: 3, s: "Bojxona qiymati bo'yicha *dastlabki qaror* qabul qilish amaliyoti joriy etiladi.", gap: 22},
    {t: 'item', n: 4, s: "Qiymat nazoratida *rasmiy diller va distribyutorlarning* narx ma'lumotlaridan foydalaniladi.", gap: 22},
  ]},
  {eyebrow: "2027-yil 1-apreldan", date: true, title: "Tekshiruv — birgalikda", blocks: [
    {t: 'merge', a: "Soliq tekshiruvi", b: "Bojxona tekshiruvi", c: "Sayyor tekshiruv — *birgalikda*"},
    {t: 'text', s: "Import bilan shug'ullanuvchi subyektlarda sayyor *soliq va bojxona tekshiruvlarini birgalikda* o'tkazish amaliyoti joriy etiladi.", size: 38},
  ]},
  {eyebrow: "2027-yil 1-iyundan", date: true, title: "Kelib chiqish sertifikati", icon: 'doc', blocks: [
    {t: 'item', n: 1, s: "Sertifikat va hujjatlar orasidagi, tovar xususiyatiga ta'sir qilmaydigan *kichik tafovutlar* — sertifikatni *rad etishga asos emas*."},
    {t: 'item', n: 2, s: "To'lovli bojxona rejimiga qabul qilingan kundan *1 yil ichida* to'g'ri sertifikat berilsa — *eng ko'p qulaylik* yoki *erkin savdo* rejimi tiklanadi."},
    {t: 'item', n: 3, s: "Tovar chiqarilgandan keyin sertifikatdagi xato aniqlansa — *3 yil ichida* to'g'ri sertifikat berib, *tarif preferensiyasini* tiklash mumkin."},
  ]},
  {eyebrow: "2027-yil 1-iyundan", date: true, title: "Pulni qaytarish va eksport", icon: 'cash', blocks: [
    {t: 'item', n: 1, s: "Ortiqcha to'langan yoki undirilgan to'lovlarni qaytarish: ariza, ko'rib chiqish va javob — *markazlashgan, elektron* tarzda.", gap: 22},
    {t: 'item', n: 2, s: "Reeksportda talablar bajarilib, chegara postida nazorat yakunlansa — ilgari to'langan *boj va soliqlar qaytariladi*.", gap: 22},
    {t: 'item', n: 3, s: "Eksportda *ekologik sertifikat* — eksportchining *ixtiyoriy* murojaatiga ko'ra.", gap: 22},
    {t: 'item', n: 4, s: "Vakolatli iqtisodiy operatorlarga eksport bo'yicha muddati o'tgan debitor qarzdorlik uchun *moliyaviy jarimalar qo'llanmaydi*.", gap: 22},
  ]},
  {eyebrow: "2027-yil 1-iyundan", date: true, title: "Dastlabki deklaratsiya: yangi tartib", blocks: [
    {t: 'step', n: 1, s: "Dastlabki deklaratsiya sertifikat va ruxsat hujjatlari uchun *ariza* sifatida qabul qilinadi."},
    {t: 'step', n: 2, s: "Xavf darajasi past tovarlarga bu hujjatlar *oldindan* beriladi."},
    {t: 'step', n: 3, s: "Yakuniy deklaratsiyada ularni qayta ko'rsatish *bekor qilinadi*."},
    {t: 'step', n: 4, s: "Tovar chegara postiga yetganda xavf darajasiga qarab *tezlashtirilgan* tartibda chiqariladi.", color: GRN},
    {t: 'note', s: "Tranzit deklaratsiyasi ham transport chegara postiga *yetib kelishidan oldin* taqdim etiladigan bo'ladi. Bosqichlarni Bojxona qo'mitasi belgilaydi."},
  ]},
 ]},
// ================================================================== 4
{n: 4, title: "Fuqarolar va bojxona to'lovlari", short: "Fuqarolar va to'lovlar", icon: 'suitcase',
 sub: "Yagona bojxona to'lovi, yig'imlar, imtiyozlar va yo'lovchilar uchun rejalar",
 scenes: [
  {eyebrow: "2027-yil 1-yanvardan", date: true, title: "Yagona bojxona to'lovi stavkasi", blocks: [
    {t: 'formula'},
    {t: 'text', s: "Farmonning 8-bandi: stavka tovarning bojxona qiymatidan *20 foiz*, lekin har bir kilogrammi uchun *2 AQSH dollaridan kam bo'lmagan* miqdorda belgilanadi.", size: 36},
  ]},
  {eyebrow: "Hisob namunasi", title: "Qaysi summa olinadi?", icon: 'parcel', blocks: [
    {t: 'example', head: "Qimmat, yengil tovar: qiymati *$300*, og'irligi *5 kg*", v: 300, kg: 5},
    {t: 'example', head: "Arzon, og'ir tovar: qiymati *$40*, og'irligi *8 kg*", v: 40, kg: 8},
    {t: 'note', s: "Misollar faqat stavka qoidasini tushuntiradi: ikki hisobdan *kattasi* olinadi."},
  ]},
  {eyebrow: "2027-yil 1-iyundan", date: true, title: "Kichik to'lovda yig'im olinmaydi", icon: 'people', blocks: [
    {t: 'text', s: "Jismoniy shaxslar *notijorat maqsadda* olib o'tadigan tovarlar bo'yicha:", size: 38},
    {t: 'compare', a: "Yagona bojxona to'lovi", b: "Bojxona yig'imlari", stamp: 'UNDIRILMAYDI'},
    {t: 'text', s: "Agar yagona bojxona to'lovi *yig'imlardan kam* bo'lsa, bu yig'imlar *undirilmaydi*.", size: 38},
  ]},
  {eyebrow: "Qonun loyihasi · 3 oyda", title: "Boj imtiyozlari qanday bo'ladi?", icon: 'calendar', blocks: [
    {t: 'item', n: 1, s: "Amaldagi bojdan ozod etish va *nol stavka* imtiyozlari — *muddati tugaguniga qadar* saqlanadi."},
    {t: 'item', n: 2, s: "*Muddatsiz* berilgan boj imtiyozlari — *2029-yil 1-yanvargacha* amal qiladi."},
    {t: 'note', s: "Bu qoidalarni 2027-yil 1-yanvardan joriy etish uchun Iqtisodiyot va moliya vazirligi qonun loyihasini *uch oy* ichida Vazirlar Mahkamasiga kiritadi."},
  ]},
  {eyebrow: "Yo'l xaritasi va strategiya", title: "Yo'lovchilar uchun rejalar", icon: 'robot', blocks: [
    {t: 'tl', when: "2027-yil dekabr", s: "Naqd valyutani olib chiqish me'yori — *10 ming AQSH dollari* ekvivalenti; faqat undan oshsa deklaratsiya qilinadi (qonun loyihasi)."},
    {t: 'tl', when: "2026–2030", s: "Chegara postlarida *sun'iy intellektli robotlar* yo'lovchilarga qoidalar va deklaratsiya bo'yicha tezkor ma'lumot beradi."},
    {t: 'tl', when: "Strategiya", s: "*«Customs fine»* mobil ilovasi: bojxona jarimasini ko'rish va *imtiyozli muddatda* to'lash."},
    {t: 'note', s: "Bular — rejalashtirilgan tadbirlar; aniq tartib alohida hujjatlarda belgilanadi."},
  ]},
 ]},
// ================================================================== 5
{n: 5, title: "Inson omilisiz bojxona", short: "Inson omilisiz bojxona", icon: 'robot',
 sub: "Avtomatik rasmiylashtiruv, «AI-tahlil» va qayta ishlash rejimidagi intizom",
 scenes: [
  {eyebrow: "Maqsad", title: "10% dan 60% gacha", icon: 'chip', blocks: [
    {t: 'text', s: "Hozir deklaratsiyalarning *10 foizi* inson omilisiz, avtomatik rasmiylashtiriladi.", size: 38},
    {t: 'progress', from: 10, to: 60, a: "Hozir", b: "2030-yil"},
    {t: 'text', s: "2030-yilga qadar bu ko'lamni *60 foizga* yetkazish ko'zlangan.", size: 38},
  ]},
  {eyebrow: "2027-yil 1-yanvardan", date: true, title: "Deklaratsiya avtomatik rasmiylashadi", blocks: [
    {t: 'text', s: "Xavf darajasi past tadbirkorlar uchun («Post Clearance» shartlari bilan). Quyidagi *4 shart birga* bajarilsa:", size: 36},
    {t: 'check', s: "Tovar *bir shartnoma* doirasida bir necha bor olib kelingan", gap: 20},
    {t: 'check', s: "Tizim aniqlagan qo'shimcha to'lov — *BHMning 10 baravarigacha*", gap: 20},
    {t: 'check', s: "Shaxsiy g'azna hisobvarag'ida *yetarli mablag'* bor", gap: 20},
    {t: 'check', s: "Deklarant qo'shimcha to'lov *avtomatik undirilishiga rozi*", gap: 20},
    {t: 'stampBig', s: 'AVTOMATIK', color: GRN, gap: 10},
    {t: 'note', s: "Shartlar Jahon bojxona tashkilotining xavflarni boshqarish tavsiyalariga asoslangan. BHM — bazaviy hisoblash miqdori.", gap: 10},
  ]},
  {eyebrow: "2027-yil 1-yanvardan", date: true, title: "Erkin savdo hamkorlari bilan", icon: 'globe', blocks: [
    {t: 'text', s: "Axborot almashinuvi yo'lga qo'yilgan *erkin savdo* hamkori davlatlarda ishlab chiqarilgan tovarlar *avtomatik* rasmiylashtiriladi, agar:", size: 38},
    {t: 'check', s: "taqdim etilgan ma'lumotlarda *tafovut yo'q*", gap: 20},
    {t: 'check', s: "deklaratsiyada *eksportyor davlat deklaratsiyasi* rekvizitlari ko'rsatilgan", gap: 20},
    {t: 'item', s: "Deklarant rozi bo'lsa, deklaratsiya *xodim aralashuvisiz* rasmiylashtirilishi mumkin. Bunda *bosh ta'minot* taqdim etish majburiy.", fill: GRN2},
  ]},
  {eyebrow: "2028-yil 1-yanvardan", date: true, title: "«AI-tahlil»: tekshiruvdan oldin", icon: 'chip', blocks: [
    {t: 'step', n: 1, s: "Tovar chiqarilgandan keyin tizim ma'lumotlarda *tafovut* aniqlaydi."},
    {t: 'step', n: 2, s: "Tadbirkor bu haqda *avtomatik xabar* oladi."},
    {t: 'step', n: 3, s: "Tadbirkor tafovutni *o'z ixtiyori bilan* bartaraf etadi — *tekshiruvgacha*.", color: GRN},
    {t: 'note', s: "Bojxona qo'mitasi buni axborot tizimlari orqali joriy etadi (farmon, 5-band)."},
  ]},
  {eyebrow: "2027-yil 1-yanvardan", date: true, title: "Qayta ishlash rejimida intizom", icon: 'parcel', blocks: [
    {t: 'item', n: 1, s: "Qayta ishlash muddati tugab, tovar *30 kun* ichida olib chiqilmasa yoki boshqa rejimga o'tkazilmasa — import sifatida rasmiylashtirilganda to'lovlar *so'zsiz undiriladi*."},
    {t: 'item', n: 2, s: "Tovar amalda qayta ishlanmasa yoki faqat *sodda operatsiyalar* (qadoqlash, o'rash, saralash, tozalash) bajarilsa — har bir kun uchun *Markaziy bank asosiy stavkasi* miqdorida foiz olinadi."},
  ]},
  {eyebrow: "Strategiyadagi raqamli vositalar", title: "Yana qanday texnologiyalar?", icon: 'server', blocks: [
    {t: 'item', n: 1, s: "*OCR* — invoys va hujjatlarni avtomatik o'qish va solishtirish", gap: 18},
    {t: 'item', n: 2, s: "Sun'iy intellekt yordamida *bojxona qiymati* nazorati", gap: 18},
    {t: 'item', n: 3, s: "*«Smart CCTV»* — raqamlarni avtomatik o'qish (ANPR), oqim tahlili", gap: 18},
    {t: 'item', n: 4, s: "*GPS elektron plombalar* bilan yukni kuzatish", gap: 18},
    {t: 'item', n: 5, s: "Transport turini *o'lchamlaridan* avtomatik aniqlash", gap: 18},
  ]},
 ]},
// ================================================================== 6
{n: 6, title: "Raqamli markaz, chegara va ijro", short: "Raqamli markaz, chegara va ijro", icon: 'server',
 sub: "Raqamli texnologiyalar markazi, «Bojxona-servis», chegara infratuzilmasi va ijro nazorati",
 scenes: [
  {eyebrow: "Yangi tuzilma", title: "Raqamli texnologiyalar markazi", icon: 'server', blocks: [
    {t: 'text', s: "Bojxona qo'mitasining AKT va kiberxavfsizlik boshqarmasi negizida — *alohida yuridik shaxs*.", size: 38},
    {t: 'chips', items: ["Sun'iy intellekt", "Kiberxavfsizlik", "Axborot tizimlari", "Axborot almashinuvi"], size: 32},
    {t: 'item', s: "Markaz xorijiy bojxona xizmatlariga *IT xizmatlar ko'rsatishi* va *dasturiy mahsulot eksport qilishi* mumkin.", fill: SKY},
    {t: 'note', s: "Bojxona organlarining umumiy shtat soni va ish haqi fondi doirasida tuziladi. Qaror loyihasi — 3 oyda."},
  ]},
  {eyebrow: "Moliyalashtirish", title: "Markaz qanday moliyalashtiriladi?", icon: 'coins', blocks: [
    {t: 'item', n: 1, s: "Respublika budjeti va Bojxona qo'mitasining *budjetdan tashqari* mablag'lari", gap: 18},
    {t: 'item', n: 2, s: "Xalqaro moliya institutlari va xorijiy tashkilotlar *grantlari*", gap: 18},
    {t: 'item', n: 3, s: "Chet el avtotransporti kirishi va tranziti uchun yig'imning *10 foizi*", gap: 18},
    {t: 'item', n: 4, s: "Bojxona hamrohligida kuzatib borish yig'imlarining *100 foizi*", gap: 18},
    {t: 'note', s: "Shuningdek, fitosanitariya va veterinariya obyektlari xizmatlari uchun yig'imlarning belgilangan qismi va taqiqlanmagan boshqa manbalar."},
  ]},
  {eyebrow: "Qayta tashkil etish", title: "«Bojxona-servis» va «Safe Customs»", icon: 'building', blocks: [
    {t: 'item', n: 1, s: "«Bojxona-servis» davlat muassasasi *xorijiy investitsiya* jalb qilingan holda *mas'uliyati cheklangan jamiyat*ga aylantiriladi."},
    {t: 'item', n: 2, s: "Vazirlar Mahkamasi *2 oy* ichida uning faoliyati va *«Safe Customs»* yagona raqamli axborot ekotizimi bo'yicha hujjat qabul qiladi."},
  ]},
  {eyebrow: "2026–2028", title: "Chegarada avtoturargoh va terminallar", blocks: [
    {t: 'text', s: "Chegara postlariga tutash hududlarda *avtoturargoh va logistika* infratuzilmasi quriladi: tartibli harakat va postlarning *o'tkazuvchanligi* uchun.", size: 38},
    {t: 'pins', items: [{ha: '5 ga', r: 'Andijon', p: "«Xonobod» posti"}, {ha: '27 ga', r: 'Surxondaryo', p: "«Ayritom» posti"}, {ha: '20 ga', r: 'Toshkent viloyati', p: "«S. Najimov» posti"}]},
    {t: 'note', s: "Hokimliklar *3 oyda* yer ajratadi; bu yerlar qishloq xo'jaligi nobudgarchiligi o'rnini qoplash to'lovidan ozod. Maydonlar yo'l xaritasining 39-bandida."},
  ]},
  {eyebrow: "Strategiya byudjeti", title: "2026–2030: 1,7 trln so'm", icon: 'chart', blocks: [
    {t: 'years', data: [['2026', 175], ['2027', 387], ['2028', 352], ['2029', 405], ['2030', 397]]},
    {t: 'text', s: "Mlrd so'mda. Jami *1\u00A0716 mlrd*. Asosiy manba — Bojxona qo'mitasining *budjetdan tashqari* jamg'armalari (1\u00A0529\u00A0mlrd); davlat budjeti — 109, Markaz — 78\u00A0mlrd.", size: 34},
    {t: 'note', s: "Dastlabki hisob-kitob: yakuniy qiymat loyiha hujjatlari tayyorlangach aniqlanadi."},
  ]},
  {eyebrow: "Ijro nazorati", title: "Kim javob beradi?", icon: 'shield', blocks: [
    {t: 'tl', when: "1 oy", s: "Bojxona qo'mitasi rahbariyati boshchiligida *monitoring guruhi* tuziladi."},
    {t: 'tl', when: "Har oy", s: "Vazirlik va idoralar strategiya ijrosi bo'yicha Bojxona qo'mitasiga *ma'lumot beradi*."},
    {t: 'tl', when: "3 oy", s: "Qonunchilikka o'zgartirishlar bo'yicha *takliflar* kiritiladi."},
    {t: 'tl', when: "Mas'ul", s: "Strategiya uchun shaxsan: Bojxona qo'mitasi raisi *A.Yu.\u00A0Mavlonov*."},
    {t: 'tl', when: "Nazorat", s: "Bosh vazir o'rinbosari *J.A.\u00A0Qo'chqorov*."},
    {t: 'note', s: "Qo'shimcha chora-tadbirlar — 56 bandli *«yo'l xaritasi»* (2-ilova)."},
  ]},
  {eyebrow: "Xulosa", title: "2030-yilga qadar maqsad", blocks: [
    {t: 'stat', v: '60', suf: '%', size: 116, label: "rasmiylashtiruv — *inson omilisiz*"},
    {t: 'stat', v: '4,4', suf: '%', size: 116, label: "bojxona tushumlarining *YaIMdagi* ulushi"},
    {t: 'stat', v: '2', suf: ' soat', size: 116, nw: 420, label: "importda o'rtacha rasmiylashtiruv; eksportda — *30 daqiqa*"},
    {t: 'chips', items: ["Ochiq", "Shaffof", "Korrupsiyadan xoli", "Raqamli"]},
  ]},
 ]},
];
})();

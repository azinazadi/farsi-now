/** Random encouraging Farsi phrases for every interaction, with audio */

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Latin phonetic guides for TTS pronunciation */
export const phrasePhonetics: Record<string, string> = {
  // greeting
  "سلام! چطوری؟": "salaam! chetori?",
  "سلام عزیزم! خوبی؟": "salaam azizam! khoobi?",
  "هی! حالت چطوره؟": "hey! haalet chetoreh?",
  "خوش اومدی! دلم برات تنگ شده بود": "khosh oomadi! delam baraat tang shode bood",
  "سلام قهرمان! آماده‌ای؟": "salaam ghahremaan!aamaade-i?",
  "به به! خوشحالم که اومدی!": "bah bah! khoshhalam ke oomadi!",
  "سلام خوشگلم! بزن بریم!": "salaam khoshgelam! bezan berim!",
  "چه خوب که برگشتی!": "che khoob ke bargashti!",
  "سلام گل من! امروز چیکار می‌کنی که اینقدر باحالی؟": "salaam gole man! emrooz chikaar mikoni ke inqadr bahaali?",
  "هی رفیق! اومدی که دنیا رو فتح کنیم؟": "hey rafigh! oomadi ke donyaa ro fath konim?",
  "خوش اومدی ستاره! بدون تو اپ مات و مبهوته": "khosh oomadi setaareh! bedoone to app maat o mabhooteh",
  "سلام جوجه قهرمان! بریم یه ماجراجویی دیگه؟": "salaam joojeh ghahremaan! berim ye maajaraajooyi digeh?",
  "به به به! اومدی که دوباره همه رو گاز بگیری؟": "bah bah bah! oomadi ke dobaareh hameh ro gaaz begiri?",
  "سلام! آماده‌ای امروز مغزتو شارژ کنی یا فقط اومدی لبخند بزنی؟": "salaam! aamaade-i emrooz maghzeto shaarzh koni yaa faghat oomadi labkhand bezani?",
  // perfect
  "عالیییی بود!": "aaliiiii bood!",
  "خیلی قشنگ نوشتی!": "kheyli ghashang neveshti!",
  "دمت گرم! معرکه بود!": "damet garm! ma'rekeh bood!",
  "واااای عالی! مثل یه هنرمند!": "vaaaaay aali! mesle ye honarmand!",
  "سه ستاره! آفرین آفرین!": "seh setaareh! aafarin aafarin!",
  "به به. عاااشق دست خطتم. چه کردی!": "bah bah. aaasheghe dast-khattatam. che kardi!",
  "وای خدای من! این دیگه چی بود؟ تو که سوپراستار شدی!": "vaay khodaaye man! in digeh chi bood? to ke sooperestaar shodi!",
  "سه تا ستاره کامل! برو بالا، مردم دارن دست می‌زنن برات": "seh taa setaareh kaamel! boro baalaa, mardom daaran dast mizanan baraat",
  "آفرین! اینجوری که بری، ناسا زنگ می‌زنه استخدامت کنه!": "aafarin! injoori ke beri, naasaa zang mizaneh estekhdaamat koneh!",
  "معرکه بود! انگار با طلا نوشتی، درخشیدی!": "ma'rekeh bood! engaar baa talaa neveshti, derakhshidi!",
  "سه ستاره؟ نه بابا، این که چهار ستاره هم کم داره! تو بهترینی": "seh setaareh? nah baabaa, in ke chahaar setaareh ham kam daareh! to behtarini",
  "واای! این دست‌خط تو رو دیدم، دلم خواست قابش کنم و بذارم تو موزه!": "vaay! in dast-khatte to ro didam, delam khaast ghaabesh konam o bezaaram too moozeh!",
  "تو که امروز رفتی تو فاز خدای یادگیری!": "to ke emrooz rafti too faaze khodaaye yaadgiri!",
  // twoStars
  "خوب بود! یه کم دیگه تمرین کن!": "khoob bood! ye kam digeh tamrin kon!",
  "آفرین! داری خوب پیش میری!": "aafarin! daari khoob pish miri!",
  "خیلی خوبه! دفعه بعد بهتر میشه!": "kheyli khoobeh! daf'eh ba'd behtar misheh!",
  "قشنگ بود! ادامه بده!": "ghashang bood! edaameh bedeh!",
  "نه سیسشو داری. ماشالا": "nah sisesho daari. maashaalaa",
  "خوب بود رفیق! فقط یه ذره مونده بود بشه شاهکار، دفعه بعد می‌ترکونی!": "khoob bood rafigh! faghat ye zarreh moondeh bood besheh shaahkaar, daf'eh ba'd mitarkooni!",
  "دو ستاره؟ یعنی داری داغون می‌کنی! فقط گاز بده بیشتر": "do setaareh? ya'ni daari daaghoon mikoni! faghat gaaz bedeh bishtar",
  "آفرین! داری پرواز می‌کنی، فقط هنوز بالات کامل درنیومده!": "aafarin! daari parvaaz mikoni, faghat hanooz baalaat kaamel darnayoomadeh!",
  "خیلی خوبه عزیزم! انگار یه کم خواب‌آلود بودی، بیدار شو بریم مرحله بعد!": "kheyli khoobeh azizam! engaar ye kam khaab-aalood boodi, bidaar sho berim marhaleh ba'd!",
  "ماشالا! دو ستاره یعنی نصف راه رو با سرعت نور رفتی، حالا گازشو بیشتر کن!": "maashaalaa! do setaareh ya'ni nesfe raah ro baa sor'ate noor rafti, haalaa gaazesho bishtar kon!",
  // oneStar
  "بد نبود! دوباره امتحان کن!": "bad nabood! dobaareh emtehaan kon!",
  "اولش سخته، نگران نباش!": "avalesh sakhteh, negaraan nabaash!",
  "آفرین که تلاش کردی!": "aafarin ke talaash kardi!",
  "یه بار دیگه بزن، بهتر میشه!": "ye baar digeh bezan, behtar misheh!",
  "یکم دیگه تمرین کنی بهترم میشه.": "yekam digeh tamrin koni behtaram misheh.",
  "آفرین جنگجو! یه ستاره هم بهتر از صفره، حالا بریم یکی دیگه بگیریم!": "aafarin jangjoo! ye setaareh ham behtar az sefreh, haalaa berim yeki digeh begirim!",
  "یکی ستاره؟ یعنی تازه داری گرم می‌شی! مثل موتور که اولش تکون می‌خوره": "yeki setaareh? ya'ni taazeh daari garm mishi! mesle motor ke avalesh tekoon mikhooreh",
  "تلاشتو دیدم، حالا فقط یه کم جادو اضافه کن و می‌ترکونی!": "talaasheto didam, haalaa faghat ye kam jaadoo ezaafeh kon o mitarkooni!",
  "نگران نباش، حتی سوپرمنم اولش نتونست پرواز کنه!": "negaraan nabaash, hattaa soopermanam avalesh natoonest parvaaz koneh!",
  "یه ستاره یعنی داری شروع می‌کنی، دفعه بعد می‌شی ستاره دنباله‌دار!": "ye setaareh ya'ni daari shoru' mikoni, daf'eh ba'd mishi setaareh donbaaleh-daar!",
  // fail
  "عیب نداره! دوباره امتحان کن!": "eyb nadaareh! dobaareh emtehaan kon!",
  "نگران نباش، همه اولش سخته!": "negaraan nabaash, hameh avalesh sakhteh!",
  "یه بار دیگه تلاش کن، میتونی!": "ye baar digeh talaash kon, mitooni!",
  "اشکال نداره عزیزم!": "eshkaal nadaareh azizam!",
  "خیلی خوشحالم که تلاشتو کردی. میخای باز امتحان کنی؟": "kheyli khoshhalam ke talaasheto kardi. mikhaay baaz emtehaan koni?",
  "نرود میخ آهنین در سنگ!": "naravad mikh-e aahanin dar sang!",
  "بیا بریم کوه": "biaa berim kooh",
  "صفر ستاره؟ یعنی تازه داری با چالش دوست می‌شی! دفعه بعد می‌ری تو فاز نابود کردنش": "sefr setaareh? ya'ni taazeh daari baa chaalesh doost mishi! daf'eh ba'd miri too faaze naabood kardanesh",
  "عیبی نداره قهرمان! حتی باتمانم گاهی می‌افته، بلند شو دوباره!": "eybi nadaareh ghahremaan! hattaa baatmaanam gaahi miofteh, boland sho dobaareh!",
  "اشکال نداره! این فقط یه تمرین بود که بگی «بعدی!»": "eshkaal nadaareh! in faghat ye tamrin bood ke begi ba'di!",
  "صفر؟ نه بابا، این که یعنی فرصت داری دوباره بترکونی و همه رو شگفت‌زده کنی!": "sefr? nah baabaa, in ke ya'ni forsat daari dobaareh betarkooni o hameh ro shegeft-zadeh koni!",
  "نگران نباش جونم! حتی گوگل هم گاهی جواب اشتباه می‌ده، تو خیلی بهتری!": "negaraan nabaash joonam! hattaa google ham gaahi javaab eshtebaah mideh, to kheyli behtari!",
  "بیا دوباره امتحان کنیم، این بار با کلی انرژی و یه لبخند بزرگ!": "biaa dobaareh emtehaan konim, in baar baa kolli energy o ye labkhand-e bozorg!",
  // levelComplete
  "ایول! این مرحله رو رد کردی!": "eyvol! in marhaleh ro rad kardi!",
  "آفرین! مرحله تموم شد! بریم بعدی!": "aafarin! marhaleh tamoom shod! berim ba'di!",
  "عالی بود! یه قدم جلوتری!": "aali bood! ye ghadam jolotari!",
  "دمت گرم! حالا بریم مرحله بعد!": "damet garm! haalaa berim marhaleh ba'd!",
  "تموم شد! چقدر باهوشی!": "tamoom shod! cheqadr baahoshi!",
  "وایی بهترین روز زندگیم بود": "vaay behtarin rooze zendegiam bood",
  "وای خدای من! این مرحله رو با کلاس رد کردی، انگار رقصیدی توش!": "vaay khodaaye man! in marhaleh ro baa kelaas rad kardi, engaar raghsidi toosh!",
  "لِوِل کامپلیت! حالا بریم بعدی که منتظرته مثل کیک تولد!": "level complete! haalaa berim ba'di ke montazereteh mesle cake-e tavalod!",
  "تموم شد! تو که داری مثل راکت می‌ری بالا، ناسا حسودیش شده!": "tamoom shod! to ke daari mesle raaket miri baalaa, naasaa hasoodish shodeh!",
  "آفرین گل من! این مرحله رو خوردی و هضم کردی، حالا بریم بعدی رو قورت بدیم": "aafarin gole man! in marhaleh ro khordi o hazm kardi, haalaa berim ba'di ro ghoort bedim",
  "بهترین لِوِل بود! تو امروز یه قهرمان واقعی بودی، جایزه‌ت یه بغل مجازی و ستاره‌های بیشتره!": "behtarin level bood! to emrooz ye ghahremaan-e vaaghe'i boodi, jaayezat ye baghal-e majaazi o setaareh-haaye bishtareh!",
  // lockedLevel
  "هنوز اینجا قفله! بیشتر ستاره جمع کن!": "hanooz injaa gofleh! bishtar setaareh jam' kon!",
  "صبر داشته باش! اول قبلیشو تموم کن!": "sabr daashteh baash! aval ghablisho tamoom kon!",
  "این مرحله منتظرته!": "in marhaleh montazereteh!",
  "آروم آروم! این قفل با ستاره باز می‌شه، نه با کلید جادویی!": "aaroom aaroom! in gofl baa setaareh baaz misheh, nah baa kelid-e jaadooyi!",
  "صبر کن عزیزم، این مرحله داره حسودیش می‌شه به ستاره‌هات، بیشتر جمع کن تا باز بشه": "sabr kon azizam, in marhaleh daareh hasoodish misheh be setaareh-haat, bishtar jam' kon taa baaz besheh",
  "هنوز قفله؟ یعنی باید اول یه قهرمان واقعی بشی! برو ستاره بگیر بعد بیا!": "hanooz gofleh? ya'ni baayad aval ye ghahremaan-e vaaghe'i beshi! boro setaareh begir ba'd biaa!",
  "این یکی هنوز خوابیده، بیدارش کن با کلی ستاره!": "in yeki hanooz khaabideh, bidaaresh kon baa kolli setaareh!",
  "قفلشه؟ خب، بریم قبلی‌ها رو بترکونیم تا بیاد پیشمون مثل سگ وفادار!": "goflesheh? khob, berim ghablihaa ro betarkoonim taa biaad pishemoon mesle sag-e vafaadaar!",
};

/** Map phrase text (without emoji) → audio hash filename */
const audioMap: Record<string, string> = {
  "سلام! چطوری؟": "a3f5bdccd3bd",
  "سلام عزیزم! خوبی؟": "9dd9329d50db",
  "هی! حالت چطوره؟": "86dc529dc82e",
  "خوش اومدی! دلم برات تنگ شده بود": "4331a30bd5fe",
  "سلام قهرمان! آماده‌ای؟": "00456c4ee1a6",
  "به به! خوشحالم که اومدی!": "fae5a422fac4",
  "سلام خوشگلم! بزن بریم!": "86015abe860d",
  "چه خوب که برگشتی!": "ceaa8abb3687",
  "سلام گل من! امروز چیکار می‌کنی که اینقدر باحالی؟": "3800bae7a2cc",
  "هی رفیق! اومدی که دنیا رو فتح کنیم؟": "ab9a274e7b7f",
  "خوش اومدی ستاره! بدون تو اپ مات و مبهوته": "a2348db958ce",
  "سلام جوجه قهرمان! بریم یه ماجراجویی دیگه؟": "06f24e8a551d",
  "به به به! اومدی که دوباره همه رو گاز بگیری؟": "a2ca43405abe",
  "سلام! آماده‌ای امروز مغزتو شارژ کنی یا فقط اومدی لبخند بزنی؟": "cc80a4557b7f",
  "عالیییی بود!": "7e4dd591dd2a",
  "خیلی قشنگ نوشتی!": "153b21064816",
  "دمت گرم! معرکه بود!": "adb905c18eb2",
  "واااای عالی! مثل یه هنرمند!": "d3d9d0db33c7",
  "سه ستاره! آفرین آفرین!": "2fcee8e4d934",
  "به به. عاااشق دست خطتم. چه کردی!": "56e4a3a99276",
  "وای خدای من! این دیگه چی بود؟ تو که سوپراستار شدی!": "c101bc0df677",
  "سه تا ستاره کامل! برو بالا، مردم دارن دست می‌زنن برات": "75e071bffb2b",
  "آفرین! اینجوری که بری، ناسا زنگ می‌زنه استخدامت کنه!": "787c852aeff5",
  "معرکه بود! انگار با طلا نوشتی، درخشیدی!": "abd155988299",
  "سه ستاره؟ نه بابا، این که چهار ستاره هم کم داره! تو بهترینی": "6821d22bdf34",
  "واای! این دست‌خط تو رو دیدم، دلم خواست قابش کنم و بذارم تو موزه!": "91dfd7d3dfd0",
  "تو که امروز رفتی تو فاز خدای یادگیری!": "92b9943c7acf",
  "خوب بود! یه کم دیگه تمرین کن!": "5ed6ab46635d",
  "آفرین! داری خوب پیش میری!": "d6c4358a028a",
  "خیلی خوبه! دفعه بعد بهتر میشه!": "fb792a534a35",
  "قشنگ بود! ادامه بده!": "92225e69e596",
  "نه سیسشو داری. ماشالا": "f0238dfa3c39",
  "خوب بود رفیق! فقط یه ذره مونده بود بشه شاهکار، دفعه بعد می‌ترکونی!": "e17b2d7271bf",
  "دو ستاره؟ یعنی داری داغون می‌کنی! فقط گاز بده بیشتر": "f76e9c91238e",
  "آفرین! داری پرواز می‌کنی، فقط هنوز بالات کامل درنیومده!": "795f1b09fa37",
  "خیلی خوبه عزیزم! انگار یه کم خواب‌آلود بودی، بیدار شو بریم مرحله بعد!": "200203534b60",
  "ماشالا! دو ستاره یعنی نصف راه رو با سرعت نور رفتی، حالا گازشو بیشتر کن!": "62b82c865d81",
  "بد نبود! دوباره امتحان کن!": "74f2b5dbc5bf",
  "اولش سخته، نگران نباش!": "ca2d52c9699c",
  "آفرین که تلاش کردی!": "df0fb04d2206",
  "یه بار دیگه بزن، بهتر میشه!": "7dad3233ef42",
  "یکم دیگه تمرین کنی بهترم میشه.": "5e180db8cb67",
  "آفرین جنگجو! یه ستاره هم بهتر از صفره، حالا بریم یکی دیگه بگیریم!": "ffd694a36c34",
  "یکی ستاره؟ یعنی تازه داری گرم می‌شی! مثل موتور که اولش تکون می‌خوره": "38815231a2df",
  "تلاشتو دیدم، حالا فقط یه کم جادو اضافه کن و می‌ترکونی!": "728fcef627b7",
  "نگران نباش، حتی سوپرمنم اولش نتونست پرواز کنه!": "1dbd53b2cda4",
  "یه ستاره یعنی داری شروع می‌کنی، دفعه بعد می‌شی ستاره دنباله‌دار!": "ef2a5f16e609",
  "عیب نداره! دوباره امتحان کن!": "1094aa0e42da",
  "نگران نباش، همه اولش سخته!": "96b2a6cb0db8",
  "یه بار دیگه تلاش کن، میتونی!": "184a8937f3b7",
  "اشکال نداره عزیزم!": "ba964a6b5d80",
  "خیلی خوشحالم که تلاشتو کردی. میخای باز امتحان کنی؟": "0da8031297bc",
  "نرود میخ آهنین در سنگ!": "10cf331a4b22",
  "بیا بریم کوه": "455cbd7f20bc",
  "صفر ستاره؟ یعنی تازه داری با چالش دوست می‌شی! دفعه بعد می‌ری تو فاز نابود کردنش": "8bcf8ece90e8",
  "عیبی نداره قهرمان! حتی باتمانم گاهی می‌افته، بلند شو دوباره!": "6f2e6e9d61ce",
  "اشکال نداره! این فقط یه تمرین بود که بگی بعدی!": "efc9b2b0cc88",
  "صفر؟ نه بابا، این که یعنی فرصت داری دوباره بترکونی و همه رو شگفت‌زده کنی!": "d30ec14981fe",
  "نگران نباش جونم! حتی گوگل هم گاهی جواب اشتباه می‌ده، تو خیلی بهتری!": "9698ad1826a1",
  "بیا دوباره امتحان کنیم، این بار با کلی انرژی و یه لبخند بزرگ!": "5e9960aa912a",
  "ایول! این مرحله رو رد کردی!": "4f2d758146b5",
  "آفرین! مرحله تموم شد! بریم بعدی!": "d8c38aa4e8dc",
  "عالی بود! یه قدم جلوتری!": "3ab5a7b2fb48",
  "دمت گرم! حالا بریم مرحله بعد!": "5672ab9dedb9",
  "تموم شد! چقدر باهوشی!": "4907ab31933e",
  "وایی بهترین روز زندگیم بود": "9d8987a3bb79",
  "وای خدای من! این مرحله رو با کلاس رد کردی، انگار رقصیدی توش!": "7175f4c32212",
  "لِوِل کامپلیت! حالا بریم بعدی که منتظرته مثل کیک تولد!": "ba8fa67f989f",
  "تموم شد! تو که داری مثل راکت می‌ری بالا، ناسا حسودیش شده!": "e4be477608ef",
  "آفرین گل من! این مرحله رو خوردی و هضم کردی، حالا بریم بعدی رو قورت بدیم": "9a8fc61754e2",
  "بهترین لِوِل بود! تو امروز یه قهرمان واقعی بودی، جایزه‌ت یه بغل مجازی و ستاره‌های بیشتره!": "586d754f0fcc",
  "هنوز اینجا قفله! بیشتر ستاره جمع کن!": "012850ab9eb0",
  "صبر داشته باش! اول قبلیشو تموم کن!": "9674e31529ab",
  "این مرحله منتظرته!": "324845cb9b08",
  "آروم آروم! این قفل با ستاره باز می‌شه، نه با کلید جادویی!": "63eeed8c4995",
  "صبر کن عزیزم، این مرحله داره حسودیش می‌شه به ستاره‌هات، بیشتر جمع کن تا باز بشه": "e2a4edec4883",
  "هنوز قفله؟ یعنی باید اول یه قهرمان واقعی بشی! برو ستاره بگیر بعد بیا!": "8904dac2c282",
  "این یکی هنوز خوابیده، بیدارش کن با کلی ستاره!": "7c744196c88d",
  "قفلشه؟ خب، بریم قبلی‌ها رو بترکونیم تا بیاد پیشمون مثل سگ وفادار!": "e38ad7ea03e3",
};

export const phrases = {
  greeting: [
    "سلام! چطوری؟ 😊",
    "سلام عزیزم! خوبی؟",
    "هی! حالت چطوره؟ 🌟",
    "خوش اومدی! دلم برات تنگ شده بود",
    "سلام قهرمان! آماده‌ای؟ 💪",
    "به به! خوشحالم که اومدی!",
    "سلام خوشگلم! بزن بریم! 🎉",
    "چه خوب که برگشتی! 🔥",
    "سلام گل من! امروز چیکار می‌کنی که اینقدر باحالی؟ 🌸",
    "هی رفیق! اومدی که دنیا رو فتح کنیم؟ 🚀",
    "خوش اومدی ستاره! بدون تو اپ مات و مبهوته 😍",
    "سلام جوجه قهرمان! بریم یه ماجراجویی دیگه؟ 🐥",
    "به به به! اومدی که دوباره همه رو گاز بگیری؟ 😂",
    "سلام! آماده‌ای امروز مغزتو شارژ کنی یا فقط اومدی لبخند بزنی؟ ⚡",
  ],
  perfect: [
    "عالیییی بود! 🌟🌟🌟",
    "خیلی قشنگ نوشتی!",
    "دمت گرم! معرکه بود! 💪",
    "واااای عالی! مثل یه هنرمند!",
    "سه ستاره! آفرین آفرین! 🎉",
    "به به. عاااشق دست خطتم. چه کردی!",
    "وای خدای من! این دیگه چی بود؟ تو که سوپراستار شدی! 🌟",
    "سه تا ستاره کامل! برو بالا، مردم دارن دست می‌زنن برات 👏👏",
    "آفرین! اینجوری که بری، ناسا زنگ می‌زنه استخدامت کنه! 🚀",
    "معرکه بود! انگار با طلا نوشتی، درخشیدی!",
    "سه ستاره؟ نه بابا، این که چهار ستاره هم کم داره! تو بهترینی 😎",
    "واای! این دست‌خط تو رو دیدم، دلم خواست قابش کنم و بذارم تو موزه! 🖼️",
    "تو که امروز رفتی تو فاز خدای یادگیری! 🔥",
  ],
  twoStars: [
    "خوب بود! یه کم دیگه تمرین کن!",
    "آفرین! داری خوب پیش میری! 👏",
    "خیلی خوبه! دفعه بعد بهتر میشه!",
    "قشنگ بود! ادامه بده! 🌟",
    "نه سیسشو داری. ماشالا",
    "خوب بود رفیق! فقط یه ذره مونده بود بشه شاهکار، دفعه بعد می‌ترکونی!",
    "دو ستاره؟ یعنی داری داغون می‌کنی! فقط گاز بده بیشتر 😜",
    "آفرین! داری پرواز می‌کنی، فقط هنوز بالات کامل درنیومده!",
    "خیلی خوبه عزیزم! انگار یه کم خواب‌آلود بودی، بیدار شو بریم مرحله بعد! ☕",
    "ماشالا! دو ستاره یعنی نصف راه رو با سرعت نور رفتی، حالا گازشو بیشتر کن!",
  ],
  oneStar: [
    "بد نبود! دوباره امتحان کن!",
    "اولش سخته، نگران نباش! 💪",
    "آفرین که تلاش کردی!",
    "یه بار دیگه بزن، بهتر میشه!",
    "یکم دیگه تمرین کنی بهترم میشه.",
    "آفرین جنگجو! یه ستاره هم بهتر از صفره، حالا بریم یکی دیگه بگیریم! 🛡️",
    "یکی ستاره؟ یعنی تازه داری گرم می‌شی! مثل موتور که اولش تکون می‌خوره 😂",
    "تلاشتو دیدم، حالا فقط یه کم جادو اضافه کن و می‌ترکونی!",
    "نگران نباش، حتی سوپرمنم اولش نتونست پرواز کنه! 💪",
    "یه ستاره یعنی داری شروع می‌کنی، دفعه بعد می‌شی ستاره دنباله‌دار! 🌠",
  ],
  fail: [
    "عیب نداره! دوباره امتحان کن!",
    "نگران نباش، همه اولش سخته!",
    "یه بار دیگه تلاش کن، میتونی! 💪",
    "اشکال نداره عزیزم!",
    "خیلی خوشحالم که تلاشتو کردی. میخای باز امتحان کنی؟",
    "نرود میخ آهنین در سنگ!",
    "بیا بریم کوه",
    "صفر ستاره؟ یعنی تازه داری با چالش دوست می‌شی! دفعه بعد می‌ری تو فاز نابود کردنش 😈",
    "عیبی نداره قهرمان! حتی باتمانم گاهی می‌افته، بلند شو دوباره! 🦇",
    "اشکال نداره! این فقط یه تمرین بود که بگی «بعدی!» 😂",
    "صفر؟ نه بابا، این که یعنی فرصت داری دوباره بترکونی و همه رو شگفت‌زده کنی!",
    "نگران نباش جونم! حتی گوگل هم گاهی جواب اشتباه می‌ده، تو خیلی بهتری! 📱",
    "بیا دوباره امتحان کنیم، این بار با کلی انرژی و یه لبخند بزرگ! 😄",
  ],
  levelComplete: [
    "ایول! این مرحله رو رد کردی! 🎉",
    "آفرین! مرحله تموم شد! بریم بعدی!",
    "عالی بود! یه قدم جلوتری! 🌟",
    "دمت گرم! حالا بریم مرحله بعد! 💪",
    "تموم شد! چقدر باهوشی! 🧠",
    "وایی بهترین روز زندگیم بود",
    "وای خدای من! این مرحله رو با کلاس رد کردی، انگار رقصیدی توش! 💃",
    "لِوِل کامپلیت! حالا بریم بعدی که منتظرته مثل کیک تولد! 🍰",
    "تموم شد! تو که داری مثل راکت می‌ری بالا، ناسا حسودیش شده! 🚀",
    "آفرین گل من! این مرحله رو خوردی و هضم کردی، حالا بریم بعدی رو قورت بدیم 😋",
    "بهترین لِوِل بود! تو امروز یه قهرمان واقعی بودی، جایزه‌ت یه بغل مجازی و ستاره‌های بیشتره! 🤗",
  ],
  lockedLevel: [
    "هنوز اینجا قفله! بیشتر ستاره جمع کن!",
    "صبر داشته باش! اول قبلیشو تموم کن!",
    "این مرحله منتظرته! 🔑",
    "آروم آروم! این قفل با ستاره باز می‌شه، نه با کلید جادویی! 🗝️",
    "صبر کن عزیزم، این مرحله داره حسودیش می‌شه به ستاره‌هات، بیشتر جمع کن تا باز بشه 😂",
    "هنوز قفله؟ یعنی باید اول یه قهرمان واقعی بشی! برو ستاره بگیر بعد بیا!",
    "این یکی هنوز خوابیده، بیدارش کن با کلی ستاره! 🌟🌟🌟",
    "قفلشه؟ خب، بریم قبلی‌ها رو بترکونیم تا بیاد پیشمون مثل سگ وفادار! 🐶",
  ],
} as const;

/** Strip emoji to find the audio map key */
const stripEmoji = (text: string): string =>
  text.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u200D\uFE0F]|[😊😍😂😈😜😋🤗⚡🌟🌸🚀🐥🐶💪🎉🔥👏🛡️🌠📱☕🗝️🔑💃🍰🧠🖼️😎🦇]/gu, '').trim();

/** Get audio URL for a phrase */
const getPhraseAudioUrl = (phrase: string): string | null => {
  const clean = stripEmoji(phrase);
  const hash = audioMap[clean];
  if (hash) return `/assets/audio/phrases/${hash}.mp3`;
  // Try exact match with emoji
  const hash2 = audioMap[phrase];
  if (hash2) return `/assets/audio/phrases/${hash2}.mp3`;
  return null;
};

/** Play a phrase audio (respects mute via passed flag) */
let currentPhraseAudio: HTMLAudioElement | null = null;

const getCustomPhraseAudio = (phrase: string): string | null => {
  try {
    const stored = localStorage.getItem("admin-audio-files");
    if (!stored) return null;
    const audioFiles = JSON.parse(stored);
    const clean = stripEmoji(phrase);
    // Check by hash path (admin saves as "audio/phrases/{hash}")
    const hash = audioMap[clean] || audioMap[phrase];
    if (hash) {
      const customSrc = audioFiles[`audio/phrases/${hash}`];
      if (customSrc) return customSrc;
    }
    // Also check admin-audio-map for updated hashes
    try {
      const adminMap = JSON.parse(localStorage.getItem("admin-audio-map") || "{}");
      const adminHash = adminMap[clean] || adminMap[phrase];
      if (adminHash) {
        const customSrc = audioFiles[`audio/phrases/${adminHash}`];
        if (customSrc) return customSrc;
      }
    } catch {}
    return null;
  } catch {
    return null;
  }
};

export const playPhraseAudio = (phrase: string, isMuted = false) => {
  if (isMuted) return;
  // Check for custom recorded audio first
  const customSrc = getCustomPhraseAudio(phrase);
  const url = customSrc || getPhraseAudioUrl(phrase);
  if (!url) return;
  try {
    if (currentPhraseAudio) currentPhraseAudio.pause();
    currentPhraseAudio = new Audio(url);
    currentPhraseAudio.play().catch(() => {});
  } catch {
    // Audio unavailable
  }
};

export const getPhrase = (category: keyof typeof phrases): string => pick([...phrases[category]]);

export const getScorePhrase = (stars: number): string => {
  if (stars === 3) return getPhrase("perfect");
  if (stars === 2) return getPhrase("twoStars");
  if (stars === 1) return getPhrase("oneStar");
  return getPhrase("fail");
};

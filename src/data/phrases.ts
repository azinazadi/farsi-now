/** Random encouraging Farsi phrases for every interaction, with audio */

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Latin phonetic guides for TTS pronunciation */
export const phrasePhonetics: Record<string, string> = {
  // ================= GREETING (~30)
  "سلام! چطوری؟": "salaam! chetori?",
  "هی! حالت چطوره؟": "hey! halet chetore?",
  "خوش اومدی!": "khosh oomadi!",
  "سلام رفیق!": "salaam rafigh!",
  "چه خبر؟": "che khabar?",
  "اومدییی": "oomadii!",
  "به به!": "bah bah!",
  "سلام قهرمان!": "salaam ghahreman!",
  "بزن بریم": "bezan berim!",
  "هیولا برگشت": "hioola bargasht!",
  "سلام سلطان": "salaam soltan",
  "عه! اومدی؟": "eh! oomadi?",
  "دلم برات تنگ شده بود": "delam barat tang shode bood",
  "چطوری داداش": "chetori dadash",
  "حالت کوکه؟": "halet kooke?",
  "اوضاع چطوره؟": "ooza chetore?",
  "بریم یه چیزی بترکونیم": "berim ye chizi betarkoonim",
  "حاضری؟": "haazeri?",
  "شروع کنیم؟": "shoroo konim?",
  "آماده‌ای؟": "amade-i?",
  "بریم بالا": "berim bala!",
  "تو اومدی یعنی حال می‌کنیم": "to oomadi yani hal mikonim",
  "شروع شددد": "shoroo shod!",
  "اینجایی هنوز؟": "injaee hanooz?",
  "بزن بترکون": "bezan betarkoon",
  "حالت خوبه؟": "halet khoobe?",
  "رفیق کجایی": "rafigh kojaei?",
  "اومدی کارو جمع کنیم؟": "oomadi karo jam konim?",
  "بریم حال بدیم": "berim hal bedim",
  "شروع کنیم بریم جلو": "shoroo konim berim jolo",

  // ================= PERFECT (~40)
  "ترکوندییی!": "tarkoondi!",
  "خفن زدی!": "khafan zadi!",
  "دمت گرم!": "damet garm!",
  "عالی بود!": "aali bood!",
  "نههههه این چی بوددد!": "naaa in chi bood!",
  "پشمام ریخت": "pashmam rikht!",
  "کارت درستههه": "karet dorostee!",
  "اصن ترکوندی رفت": "aslan tarkoondi raft!",
  "داری له می‌کنی": "dari leh mikoni!",
  "خفن‌تر از این نداریم": "khafan-tar az in nadarim!",
  "داداش تو دیگه تمومی": "dadash to dige tamoomi",
  "یه لِول بالاتری": "ye level balatar!",
  "وحشی زدی": "vahshi zadi!",
  "خیلی خفنی": "kheyli khafani!",
  "سوپراستار شدی": "superstar shodi!",
  "این دیگه خیلی زیاد بود": "in dige kheyli ziad bood!",
  "داری بازیو نابود می‌کنی": "dari bazi ro nabood mikoni!",
  "خفن بازی کردی": "khafan bazi kardi!",
  "مگه میشه": "mage mishe?",
  "بی‌رحم شدی": "bi-rahm shodi!",
  "عجب زدییی": "ajab zadii!",
  "اصن حال کردم": "aslan hal kardam!",
  "فوق‌العاده بود": "fogholade bood",
  "بی‌نقص زدی": "bi-naqs zadi!",
  "دستت درد نکنه": "dastet dard nakone!",
  "حرف نداری": "harf nadari!",
  "استاد شدی": "ostad shodi!",
  "خفن جمعش کردی": "khafan jamesh kardi!",
  "این شد کار": "in shod kar!",
  "عجب حرکتی زدی": "ajab harekati zadi!",
  "بمب بود": "bomb bood!",
  "تو دیگه کی هستی": "to dige ki hasti!",
  "وحشتناک خوب": "vahshatnak khub!",
  "اصن ترکوندی": "aslan tarkoondi!",
  "خفن به توان دو": "khafan be tavan do!",
  "دیگه حرفی نیست": "dige harfi nist!",
  "برو بالااا": "boro balaaa!",
  "کلاس کارتو بردی بالا": "kelas karo bordi bala!",
  "ماشین شدی رفتی": "mashin shodi rafti!",

  // ================= TWOSTARS (~30)
  "بد نبودا": "bad nabooda!",
  "نزدیک بود": "nazdik bood",
  "یه کم دیگه": "ye kam dige",
  "اوکی بود": "ok bood",
  "داری میای بالا": "dari miay bala",
  "گرم شدی": "garm shodi",
  "خوبه ولی بهتر میشه": "khube vali behtar mishe",
  "تقریبا گرفتی": "taghriban gerefti",
  "یه ذره مونده": "ye zare moonde",
  "داره میاد دستت": "dare miad dastet",
  "بد نبود ولی جا داشت": "bad nabood vali ja dasht",
  "اوکیه": "okey",
  "رو راهی": "roo rahi",
  "داری یاد میگیری": "dari yad migiri",
  "یه کم دیگه تمرکز": "ye kam dige tamarkoz",
  "خوبه رفیق": "khube rafigh",
  "یه ذره دقت کن": "ye zare deghat kon",
  "تقریبا ترکوندی": "taghriban tarkoondi",
  "خوب پیش میری": "khub pish miri",
  "یه کم دیگه زور بزن": "ye kam dige zoor bezan",
  "تقریبا شد": "taghriban shod",
  "اوکیه ادامه بده": "okey edame bede",
  "داری نزدیک میشی": "dari nazdik mishi",
  "بد نبود، جدی": "bad nabood jadi",
  "یه بار دیگه بزنی میشه": "ye bar dige bezani mishe",
  "کم مونده": "kam moonde",
  "داره جور میشه": "dare joor mishe",
  "خوبه ولی نه عالی": "khube vali na aali",

  // ================= ONESTAR (~25)
  "بد نبود": "bad nabood",
  "اولشه": "avaleshe",
  "آروم آروم": "aaroom aaroom",
  "داری شروع می‌کنی": "dari shoroo mikoni",
  "گرم میشی": "garm mishi",
  "یه بار دیگه": "ye bar dige",
  "نترس": "natars",
  "طبیعیه": "tabiie",
  "جا داری": "ja dari",
  "راه میفتی الان": "rah miofti alan",
  "قلقش میاد": "gholesh miad",
  "آفرین که زدی": "afarin ke zadi",
  "بازی کن درست میشه": "bazi kon dorost mishe",
  "یه کم تمرین": "ye kam tamrin",
  "میاد دستت": "miad dastet",
  "آروم بگیر": "aaroom begir",
  "فشار نیا": "feshar nayar",
  "اول راهی": "aval rahi",
  "میگیریش": "migirish",
  "یه کم دیگه صبر": "ye kam dige sabr",
  "داره شکل می‌گیره": "dare shekl migire",

  // ================= FAIL (~35)
  "هیچی نشد": "hichi nashod",
  "اوپس": "oops",
  "دوباره!": "dobare",
  "از اول برو": "az aval boro",
  "بیخیال یکی دیگه": "bikhial yeki dige",
  "سیو نشد": "save nashod",
  "نشد ولی میشه": "nashod vali mishe",
  "عیب نداره": "eyb nadare",
  "باز بزن": "baz bezan",
  "هیچی نشده": "hichi nashode",
  "اشکال نداره": "eshkal nadare",
  "دوباره امتحان کن": "dobare emtehan kon",
  "نترس ادامه بده": "natars edame bede",
  "میگیریش بعدی": "migirish badi",
  "این یکی رد شد": "in yeki rad shod",
  "بیخیال": "bikhial",
  "دوباره بزن بترکون": "dobare bezan betarkoon",
  "اشتباه شد": "eshtebah shod",
  "ریست شد": "reset shod",
  "حله دوباره": "hale dobare",
  "نشد دیگه": "nashod dige",
  "یه بار دیگه بزن": "ye bar dige bezan",
  "اوکی از اول": "ok az aval",
  "نشد مهم نیست": "nashod mohem nist",
  "بزن از نو": "bezan az no",
  "عیبی نداره رفیق": "eybi nadare rafigh",
  "دوباره قوی‌تر": "dobare ghavitar",

  // ================= LEVEL COMPLETE (~25)
  "ایول!": "eyval!",
  "تمومش کردی": "tamoomeh kardi",
  "ردش کردی": "radesh kardi",
  "دمت گرم": "damet garm",
  "بریم بعدی": "berim badi",
  "پاکش کردی": "pak kardi",
  "لهش کردی": "lehesh kardi",
  "حال داد": "hal dad",
  "خفن تمومش کردی": "khafan tamoomesh kardi",
  "بریم نابود کنیم بعدی رو": "berim nabood konim badi ro",
  "مثل راکت رفتی بالا": "mesle raket rafti bala",
  "کارو بستی": "karo basti",
  "تمیز زدی": "tamiz zadi",
  "جمعش کردی": "jamesh kardi",
  "فوق‌العاده تموم شد": "fogholade tamoom shod",
  "رد شد رفت": "rad shod raft",
  "یه مرحله کمتر": "ye marhale kamtar",
  "عالی تموم شد": "aali tamoom shod",
  "بزن بریم بعدی": "bezan berim badi",

  // ================= LOCKED (~20)
  "هنوز قفله": "hanooz gofle",
  "صبر کن": "sabr kon",
  "اول قبلی": "aval ghabli",
  "باید لولت بره بالا": "bayad level bere bala",
  "اینجا هنوز زوده": "inja hanooz zoode",
  "فعلا بسته‌ست": "felan bastast",
  "ستاره جمع کن": "setare jam kon",
  "باز نمیشه هنوز": "baz nemishe hanooz",
  "یه کم دیگه تلاش": "ye kam dige talash",
  "برو قوی شو": "boro ghavi sho",
  "این یکی فعلا نه": "in yeki felan na",
  "بعدا بیا": "badan bia",
  "فعلا تعطیله": "felan tatile",
  "قفل مونده": "ghofl moonde",
  "اول اونارو بزن": "aval oonaro bezan",
  "نرسیدی هنوز": "naresidi hanooz",
};

/** Map phrase text (without emoji) → audio hash filename */
const audioMap: Record<string, string> = {};

export const phrases = {
  greeting: [
    "سلام! چطوری؟ 😊",
    "هی! حالت چطوره؟ 🌟",
    "خوش اومدی!",
    "سلام رفیق!",
    "چه خبر؟",
    "اومدییی 😄",
    "به به!",
    "سلام قهرمان!",
    "بزن بریم 😎",
    "هیولا برگشت 😄",
    "سلام سلطان",
    "عه! اومدی؟",
    "دلم برات تنگ شده بود",
    "چطوری داداش",
    "حالت کوکه؟",
    "اوضاع چطوره؟",
    "بریم یه چیزی بترکونیم",
    "حاضری؟ 😏",
    "شروع کنیم؟",
    "آماده‌ای؟",
    "بریم بالا 😎",
    "تو اومدی یعنی حال می‌کنیم",
    "شروع شددد 😄",
    "اینجایی هنوز؟",
    "بزن بترکون",
    "حالت خوبه؟",
    "رفیق کجایی 😄",
    "اومدی کارو جمع کنیم؟",
    "بریم حال بدیم",
    "شروع کنیم بریم جلو",
  ],
  perfect: [
    "ترکوندییی!",
    "خفن زدی!",
    "دمت گرم!",
    "عالی بود!",
    "نههههه این چی بوددد!",
    "پشمام ریخت 😳",
    "کارت درستههه",
    "اصن ترکوندی رفت",
    "داری له می‌کنی 😄",
    "خفن‌تر از این نداریم",
    "داداش تو دیگه تمومی",
    "یه لِول بالاتری 😎",
    "وحشی زدی",
    "خیلی خفنی",
    "سوپراستار شدی",
    "این دیگه خیلی زیاد بود 😂",
    "داری بازیو نابود می‌کنی",
    "خفن بازی کردی",
    "مگه میشه 😳",
    "بی‌رحم شدی 😂",
    "عجب زدییی",
    "اصن حال کردم 😎",
    "فوق‌العاده بود",
    "بی‌نقص زدی",
    "دستت درد نکنه 🔥",
    "حرف نداری",
    "استاد شدی",
    "خفن جمعش کردی",
    "این شد کار 😄",
    "عجب حرکتی زدی",
    "بمب بود 💣",
    "تو دیگه کی هستی 😄",
    "وحشتناک خوب",
    "اصن ترکوندی 😎",
    "خفن به توان دو",
    "دیگه حرفی نیست",
    "برو بالااا",
    "کلاس کارتو بردی بالا",
    "ماشین شدی رفتی",
  ],
  twoStars: [
    "بد نبودا 😏",
    "نزدیک بود",
    "یه کم دیگه",
    "اوکی بود",
    "داری میای بالا",
    "گرم شدی",
    "خوبه ولی بهتر میشه",
    "تقریبا گرفتی",
    "یه ذره مونده",
    "داره میاد دستت",
    "بد نبود ولی جا داشت",
    "اوکیه 👍",
    "رو راهی",
    "داری یاد میگیری",
    "یه کم دیگه تمرکز",
    "خوبه رفیق",
    "یه ذره دقت کن",
    "تقریبا ترکوندی",
    "خوب پیش میری",
    "یه کم دیگه زور بزن",
    "تقریبا شد",
    "اوکیه ادامه بده",
    "داری نزدیک میشی",
    "بد نبود، جدی",
    "یه بار دیگه بزنی میشه",
    "کم مونده",
    "داره جور میشه",
    "خوبه ولی نه عالی",
  ],
  oneStar: [
    "بد نبود",
    "اولشه 😄",
    "آروم آروم",
    "داری شروع می‌کنی",
    "گرم میشی",
    "یه بار دیگه",
    "نترس",
    "طبیعیه",
    "جا داری 😏",
    "راه میفتی الان",
    "یه کم دیگه",
    "قلقش میاد",
    "آفرین که زدی",
    "بازی کن درست میشه",
    "یه کم تمرین",
    "میاد دستت",
    "آروم بگیر",
    "فشار نیا 😄",
    "اول راهی",
    "میگیریش",
    "یه کم دیگه صبر",
    "داره شکل می‌گیره",
  ],
  fail: [
    "هیچی نشد 😄",
    "اوپس 😂",
    "دوباره!",
    "از اول برو",
    "بیخیال یکی دیگه",
    "سیو نشد 😄",
    "نشد ولی میشه",
    "عیب نداره",
    "باز بزن",
    "یه بار دیگه",
    "هیچی نشده 😏",
    "اشکال نداره",
    "دوباره امتحان کن",
    "نترس ادامه بده",
    "میگیریش بعدی",
    "این یکی رد شد",
    "بیخیال 😄",
    "دوباره بزن بترکون",
    "اشتباه شد",
    "ریست شد 😄",
    "حله دوباره",
    "نشد دیگه 😂",
    "یه بار دیگه بزن",
    "اوکی از اول",
    "نشد مهم نیست",
    "بزن از نو",
    "عیبی نداره رفیق",
    "دوباره قوی‌تر",
  ],
  levelComplete: [
    "ایول!",
    "تمومش کردی",
    "ردش کردی",
    "دمت گرم",
    "بریم بعدی",
    "پاکش کردی 😄",
    "لهش کردی",
    "حال داد",
    "خفن تمومش کردی",
    "بریم نابود کنیم بعدی رو",
    "مثل راکت رفتی بالا",
    "کارو بستی 😎",
    "تمیز زدی",
    "جمعش کردی",
    "فوق‌العاده تموم شد",
    "رد شد رفت",
    "یه مرحله کمتر 😄",
    "عالی تموم شد",
    "بزن بریم بعدی",
  ],
  lockedLevel: [
    "هنوز قفله",
    "صبر کن",
    "اول قبلی",
    "باید لولت بره بالا",
    "اینجا هنوز زوده",
    "فعلا بسته‌ست",
    "ستاره جمع کن",
    "باز نمیشه هنوز",
    "یه کم دیگه تلاش",
    "برو قوی شو 😎",
    "این یکی فعلا نه",
    "بعدا بیا",
    "فعلا تعطیله 😄",
    "قفل مونده",
    "اول اونارو بزن",
    "نرسیدی هنوز",
  ],
} as const;

/** Strip emoji to find the audio map key */
const stripEmoji = (text: string): string =>
  text.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u200D\uFE0F]|[😊😍😂😈😜😋🤗⚡🌟🌸🚀🐥🐶💪🎉🔥👏🛡️🌠📱☕🗝️🔑💃🍰🧠🖼️😎🦇😳💣👍😏]/gu, '').trim();

/** Get audio URL for a phrase */
const getPhraseAudioUrl = (phrase: string): string | null => {
  const clean = stripEmoji(phrase);
  const hash = audioMap[clean];
  if (hash) return `/assets/audio/phrases/${hash}.mp3`;
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
    const hash = audioMap[clean] || audioMap[phrase];
    if (hash) {
      const customSrc = audioFiles[`audio/phrases/${hash}`];
      if (customSrc) return customSrc;
    }
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
  const customSrc = getCustomPhraseAudio(phrase);
  const url = customSrc || getPhraseAudioUrl(phrase);
  if (!url) return;
  try {
    if (currentPhraseAudio) currentPhraseAudio.pause();
    currentPhraseAudio = new Audio(url);
    currentPhraseAudio.play().catch(() => {});
  } catch {}
};

export const getPhrase = (category: keyof typeof phrases): string => pick([...phrases[category]]);

export const getScorePhrase = (stars: number): string => {
  if (stars === 3) return getPhrase("perfect");
  if (stars === 2) return getPhrase("twoStars");
  if (stars === 1) return getPhrase("oneStar");
  return getPhrase("fail");
};

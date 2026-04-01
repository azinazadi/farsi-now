import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LevelsEditor from "@/components/Admin/LevelsEditor";
import PhrasesEditor from "@/components/Admin/PhrasesEditor";
import LettersEditor from "@/components/Admin/LettersEditor";
import { levels as defaultLevels } from "@/data/levels";
import { phrases as defaultPhrases } from "@/data/phrases";
import { toast } from "sonner";

const LEVELS_STORAGE_KEY = "admin-levels";
const PHRASES_STORAGE_KEY = "admin-phrases";
const AUDIO_MAP_STORAGE_KEY = "admin-audio-map";
const AUDIO_FILES_STORAGE_KEY = "admin-audio-files";
const PHONETICS_STORAGE_KEY = "admin-phonetics";

/** Strip emoji helper (same as phrases.ts) */
const stripEmoji = (text: string): string =>
  text.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u200D\uFE0F]|[😊😍😂😈😜😋🤗⚡🌟🌸🚀🐥🐶💪🎉🔥👏🛡️🌠📱☕🗝️🔑💃🍰🧠🖼️😎🦇😄]/gu, '').trim();

/** Default Latin phonetics for all phrases */
const defaultPhonetics: Record<string, string> = {
  // greeting
  "سلام! چطوری؟": "salaam! chetori?",
  "سلام عزیزم! خوبی؟": "salaam azizam! khoobi?",
  "هی! حالت چطوره؟": "hey! haalet chetoreh?",
  "خوش اومدی! دلم برات تنگ شده بود": "khosh oomadi! delam baraat tang shode bood",
  "سلام قهرمان! آماده‌ای؟": "salaam ghahremaan! amaade-i?",
  "به به! خوشحالم که اومدی!": "bah bah! khoshhalam ke oomadi!",
  "سلام خوشگلم! بزن بریم!": "salaam khoshgelam! bezan berim!",
  "چه خوب که برگشتی!": "che khoob ke bargashti!",
  "سلام گل من! امروز چیکار می‌کنی که اینقدر باحالی؟": "salaam gol-e man! emrooz chikar mikoni ke inghadr bahaali?",
  "هی رفیق! اومدی که دنیا رو فتح کنیم؟": "hey rafigh! oomadi ke donya ro fath konim?",
  "خوش اومدی ستاره! بدون تو اپ مات و مبهوته": "khosh oomadi setaare! bedoon-e to app maat-o mabhoote",
  "سلام جوجه قهرمان! بریم یه ماجراجویی دیگه؟": "salaam jooje ghahremaan! berim ye majarajooi-ye dige?",
  "به به به! اومدی که دوباره همه رو گاز بگیری؟": "bah bah bah! oomadi ke dobaare hame ro gaaz begiri?",
  "سلام! آماده‌ای امروز مغزتو شارژ کنی یا فقط اومدی لبخند بزنی؟": "salaam! amaade-i emrooz maghzeto shaarzh koni ya faghat oomadi labkhand bezani?",
  // perfect
  "عالیییی بود!": "aaliiiii bood!",
  "خیلی قشنگ نوشتی!": "kheyli ghashang neveshti!",
  "دمت گرم! معرکه بود!": "damet garm! ma'reke bood!",
  "واااای عالی! مثل یه هنرمند!": "vaaay aali! mesl-e ye honarmand!",
  "سه ستاره! آفرین آفرین!": "se setaare! aafarin aafarin!",
  "به به. عاااشق دست خطتم. چه کردی!": "bah bah. aasheghe dast khattatam. che kardi!",
  "وای خدای من! این دیگه چی بود؟ تو که سوپراستار شدی!": "vay khodaye man! in dige chi bood? to ke sooperestaar shodi!",
  "سه تا ستاره کامل! برو بالا، مردم دارن دست می‌زنن برات": "se ta setaare kaamel! boro baala, mardom daaran dast mizanan baraat",
  "آفرین! اینجوری که بری، ناسا زنگ می‌زنه استخدامت کنه!": "aafarin! injoori ke beri, naasa zang mizane estekhdaamat kone!",
  "معرکه بود! انگار با طلا نوشتی، درخشیدی!": "ma'reke bood! engaar ba talaa neveshti, derakhshidi!",
  "سه ستاره؟ نه بابا، این که چهار ستاره هم کم داره! تو بهترینی": "se setaare? na baaba, in ke chahaar setaare ham kam daare! to behtarini",
  "واای! این دست‌خط تو رو دیدم، دلم خواست قابش کنم و بذارم تو موزه!": "vaay! in dast-khatt-e to ro didam, delam khaast ghaabesh konam o bezaaram too moze!",
  "تو که امروز رفتی تو فاز خدای یادگیری!": "to ke emrooz rafti too faaz-e khodaye yaadgiri!",
  // twoStars
  "خوب بود! یه کم دیگه تمرین کن!": "khoob bood! ye kam dige tamrin kon!",
  "آفرین! داری خوب پیش میری!": "aafarin! daari khoob pish miri!",
  "خیلی خوبه! دفعه بعد بهتر میشه!": "kheyli khoobe! daf'e ba'd behtar mishe!",
  "قشنگ بود! ادامه بده!": "ghashang bood! edaame bede!",
  "نه سیسشو داری. ماشالا": "na sisesho daari. maashaalaa",
  "خوب بود رفیق! فقط یه ذره مونده بود بشه شاهکار، دفعه بعد می‌ترکونی!": "khoob bood rafigh! faghat ye zarre moonde bood beshe shaahkaar, daf'e ba'd mitarkooni!",
  "دو ستاره؟ یعنی داری داغون می‌کنی! فقط گاز بده بیشتر": "do setaare? ya'ni daari daaghoon mikoni! faghat gaaz bede bishtar",
  "آفرین! داری پرواز می‌کنی، فقط هنوز بالات کامل درنیومده!": "aafarin! daari parvaaz mikoni, faghat hanooz baalaat kaamel darnayoomade!",
  "خیلی خوبه عزیزم! انگار یه کم خواب‌آلود بودی، بیدار شو بریم مرحله بعد!": "kheyli khoobe azizam! engaar ye kam khaab-aalood boodi, bidaar sho berim marhale ba'd!",
  "ماشالا! دو ستاره یعنی نصف راه رو با سرعت نور رفتی، حالا گازشو بیشتر کن!": "maashaalaa! do setaare ya'ni nesf-e raah ro ba sor'at-e noor rafti, halaa gaazesho bishtar kon!",
  // oneStar
  "بد نبود! دوباره امتحان کن!": "bad nabood! dobaare emtehaan kon!",
  "اولش سخته، نگران نباش!": "avalesh sakhte, negaraan nabaash!",
  "آفرین که تلاش کردی!": "aafarin ke talaash kardi!",
  "یه بار دیگه بزن، بهتر میشه!": "ye baar dige bezan, behtar mishe!",
  "یکم دیگه تمرین کنی بهترم میشه.": "yekam dige tamrin koni behtaram mishe.",
  "آفرین جنگجو! یه ستاره هم بهتر از صفره، حالا بریم یکی دیگه بگیریم!": "aafarin jangejoo! ye setaare ham behtar az sefre, halaa berim yeki dige begirim!",
  "یکی ستاره؟ یعنی تازه داری گرم می‌شی! مثل موتور که اولش تکون می‌خوره": "yeki setaare? ya'ni taaze daari garm mishi! mesl-e motor ke avalesh tekoon mikhore",
  "تلاشتو دیدم، حالا فقط یه کم جادو اضافه کن و می‌ترکونی!": "talaasheto didam, halaa faghat ye kam jaadoo ezaafe kon o mitarkooni!",
  "نگران نباش، حتی سوپرمنم اولش نتونست پرواز کنه!": "negaraan nabaash, hatta soopermanam avalesh natoonest parvaaz kone!",
  "یه ستاره یعنی داری شروع می‌کنی، دفعه بعد می‌شی ستاره دنباله‌دار!": "ye setaare ya'ni daari shoroo mikoni, daf'e ba'd mishi setaare donbaale-daar!",
  // fail
  "عیب نداره! دوباره امتحان کن!": "eyb nadaare! dobaare emtehaan kon!",
  "نگران نباش، همه اولش سخته!": "negaraan nabaash, hame avalesh sakhte!",
  "یه بار دیگه تلاش کن، میتونی!": "ye baar dige talaash kon, mitooni!",
  "اشکال نداره عزیزم!": "eshkaal nadaare azizam!",
  "خیلی خوشحالم که تلاشتو کردی. میخای باز امتحان کنی؟": "kheyli khoshhalam ke talaasheto kardi. mikhaay baaz emtehaan koni?",
  "نرود میخ آهنین در سنگ!": "naravad mikh-e aahanin dar sang!",
  "بیا بریم کوه": "bia berim kooh",
  "صفر ستاره؟ یعنی تازه داری با چالش دوست می‌شی! دفعه بعد می‌ری تو فاز نابود کردنش": "sefr setaare? ya'ni taaze daari ba chaalesh doost mishi! daf'e ba'd miri too faaz-e naabood kardanesh",
  "عیبی نداره قهرمان! حتی باتمانم گاهی می‌افته، بلند شو دوباره!": "eybi nadaare ghahremaan! hatta baatmaanam gaahi miofte, boland sho dobaare!",
  "اشکال نداره! این فقط یه تمرین بود که بگی «بعدی!»": "eshkaal nadaare! in faghat ye tamrin bood ke begi ba'di!",
  "صفر؟ نه بابا، این که یعنی فرصت داری دوباره بترکونی و همه رو شگفت‌زده کنی!": "sefr? na baaba, in ke ya'ni forsat daari dobaare betarkooni o hame ro shegeft-zade koni!",
  "نگران نباش جونم! حتی گوگل هم گاهی جواب اشتباه می‌ده، تو خیلی بهتری!": "negaraan nabaash joonam! hatta google ham gaahi javaab eshtebaah mide, to kheyli behtari!",
  "بیا دوباره امتحان کنیم، این بار با کلی انرژی و یه لبخند بزرگ!": "bia dobaare emtehaan konim, in baar ba kolli energy o ye labkhand-e bozorg!",
  // levelComplete
  "ایول! این مرحله رو رد کردی!": "eyvaal! in marhale ro rad kardi!",
  "آفرین! مرحله تموم شد! بریم بعدی!": "aafarin! marhale tamoom shod! berim ba'di!",
  "عالی بود! یه قدم جلوتری!": "aali bood! ye ghadam jolotari!",
  "دمت گرم! حالا بریم مرحله بعد!": "damet garm! halaa berim marhale ba'd!",
  "تموم شد! چقدر باهوشی!": "tamoom shod! cheghadr bahooshi!",
  "وایی بهترین روز زندگیم بود": "vaay behtarin rooz-e zendegim bood",
  "وای خدای من! این مرحله رو با کلاس رد کردی، انگار رقصیدی توش!": "vay khodaye man! in marhale ro ba kelaas rad kardi, engaar raghsidi toosh!",
  "لِوِل کامپلیت! حالا بریم بعدی که منتظرته مثل کیک تولد!": "level kaamplit! halaa berim ba'di ke montazerete mesl-e keyk-e tavalod!",
  "تموم شد! تو که داری مثل راکت می‌ری بالا، ناسا حسودیش شده!": "tamoom shod! to ke daari mesl-e raaket miri baala, naasa hasoodish shode!",
  "آفرین گل من! این مرحله رو خوردی و هضم کردی، حالا بریم بعدی رو قورت بدیم": "aafarin gol-e man! in marhale ro khordi o hazm kardi, halaa berim ba'di ro ghoort bedim",
  "بهترین لِوِل بود! تو امروز یه قهرمان واقعی بودی، جایزه‌ت یه بغل مجازی و ستاره‌های بیشتره!": "behtarin level bood! to emrooz ye ghahremaan-e vaagh'i boodi, jaayezat ye baghal-e majaazi o setaare-haaye bishtare!",
  // lockedLevel
  "هنوز اینجا قفله! بیشتر ستاره جمع کن!": "hanooz inja ghofle! bishtar setaare jam' kon!",
  "صبر داشته باش! اول قبلیشو تموم کن!": "sabr daashte baash! aval ghablisho tamoom kon!",
  "این مرحله منتظرته!": "in marhale montazerete!",
  "آروم آروم! این قفل با ستاره باز می‌شه، نه با کلید جادویی!": "aaroom aaroom! in ghofl ba setaare baaz mishe, na ba kelid-e jaadooi!",
  "صبر کن عزیزم، این مرحله داره حسودیش می‌شه به ستاره‌هات، بیشتر جمع کن تا باز بشه": "sabr kon azizam, in marhale daare hasoodish mishe be setaare-haat, bishtar jam' kon ta baaz beshe",
  "هنوز قفله؟ یعنی باید اول یه قهرمان واقعی بشی! برو ستاره بگیر بعد بیا!": "hanooz ghofle? ya'ni baayad aval ye ghahremaan-e vaagh'i beshi! boro setaare begir ba'd bia!",
  "این یکی هنوز خوابیده، بیدارش کن با کلی ستاره!": "in yeki hanooz khaabide, bidaaresh kon ba kolli setaare!",
  "قفلشه؟ خب، بریم قبلی‌ها رو بترکونیم تا بیاد پیشمون مثل سگ وفادار!": "ghofleshe? khob, berim ghablihaa ro betarkoonim ta biaad pishemoon mesl-e sag-e vafaadaar!",
};

// Default audio map from phrases.ts (extracted)
const defaultAudioMap: Record<string, string> = {
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
};

const AdminPage = () => {
  const navigate = useNavigate();

  const [levels, setLevels] = useState(() => {
    try {
      const saved = localStorage.getItem(LEVELS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [...defaultLevels];
    } catch {
      return [...defaultLevels];
    }
  });

  const [phrases, setPhrases] = useState(() => {
    try {
      const saved = localStorage.getItem(PHRASES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { ...defaultPhrases };
    } catch {
      return { ...defaultPhrases };
    }
  });

  const [audioMap, setAudioMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(AUDIO_MAP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { ...defaultAudioMap };
    } catch {
      return { ...defaultAudioMap };
    }
  });

  const [phonetics, setPhonetics] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(PHONETICS_STORAGE_KEY);
      return saved ? { ...defaultPhonetics, ...JSON.parse(saved) } : { ...defaultPhonetics };
    } catch {
      return { ...defaultPhonetics };
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(phrases));
  }, [phrases]);

  useEffect(() => {
    localStorage.setItem(AUDIO_MAP_STORAGE_KEY, JSON.stringify(audioMap));
  }, [audioMap]);

  useEffect(() => {
    localStorage.setItem(PHONETICS_STORAGE_KEY, JSON.stringify(phonetics));
  }, [phonetics]);

  const handleAudioSave = async (blob: Blob, path: string) => {
    try {
      const { uploadAudio } = await import("@/services/audioStorage");
      const url = await uploadAudio(blob, path);
      toast.success(`Audio uploaded: ${path.split("/").pop()}`);
      console.log("Uploaded to:", url);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(`Failed to upload audio: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const exportAll = () => {
    const data = {
      levels,
      phrases,
      audioMap,
      phonetics,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farsi-app-config-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Full config exported!");
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">Admin Panel</h1>
        <Button variant="outline" size="sm" onClick={exportAll}>
          <Download className="h-4 w-4 mr-1" /> Export All
        </Button>
      </div>

      <Tabs defaultValue="levels" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="levels">Levels & Words</TabsTrigger>
          <TabsTrigger value="phrases">Phrases</TabsTrigger>
          <TabsTrigger value="letters">Letters</TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="mt-4">
          <LevelsEditor levels={levels} onLevelsChange={setLevels} onAudioSave={handleAudioSave} />
        </TabsContent>

        <TabsContent value="phrases" className="mt-4">
          <PhrasesEditor
            phrases={phrases}
            onPhrasesChange={setPhrases}
            audioMap={audioMap}
            onAudioMapChange={setAudioMap}
            onAudioSave={handleAudioSave}
            phonetics={phonetics}
            onPhoneticsChange={setPhonetics}
          />
        </TabsContent>

        <TabsContent value="letters" className="mt-4">
          <LettersEditor onAudioSave={handleAudioSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;

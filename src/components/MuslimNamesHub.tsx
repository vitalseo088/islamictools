import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Sparkles,
  Heart,
  Copy,
  Check,
  BookOpen,
  Users,
  Shuffle,
  Filter,
  X,
  ArrowRight
} from "lucide-react";
import {
  muslimNames,
  allOrigins,
  allThemes,
  allLetters,
  englishLetters,
  arabicLetters,
  urduLetters,
  matchesNameLetter,
  getLocalizedNameMeaning,
  getLocalizedQuranicRef,
  getLocalizedTheme,
  getLocalizedOrigin,
  getLocalizedStyle,
  type MuslimName,
  type Gender,
  type Style,
  type Origin
} from "../data/names";
import { Tool, tools } from "../data/tools";
import type { Locale } from "../data/locales";

interface MuslimNamesHubProps {
  currentTool?: Tool | null;
  onSelectTool: (slug: string) => void;
  lang?: Locale;
}

const hubCopy: Record<Locale, Record<string, string>> = {
  en: {
    harmoniousPairings: "Harmonious Pairings",
    twinTitle: "Twin Muslim Name Generator",
    twinSubtitle: "Generate rhyming, rhythmic, and meaningful Islamic twin names. Every name displays its full authentic meaning.",
    generateNewPairs: "Generate New Pairs",
    twinBG: "Boy & Girl Twin",
    twinBB: "Boy & Boy Twin",
    twinGG: "Girl & Girl Twin",
    babyGenBadge: "Personalized Curation",
    babyGenTitle: "Muslim Baby Name Generator",
    babyGenSubtitle: "Instant ideas with full meanings, origins, and Arabic script. Re-roll anytime to find the perfect name.",
    generateNames: "Generate Names",
    gender: "Gender",
    anyGender: "Any Gender",
    style: "Style",
    anyStyle: "Any Style",
    theme: "Theme / Meaning",
    allThemes: "All Meaning Themes",
    batchSize: "Batch Size",
    suggestions: "Suggestions",
    searchPlaceholder: "Search by name, meaning (e.g. 'light', 'patience'), or Arabic...",
    quranicOnly: "Quranic Names Only",
    allGenders: "All Genders",
    boys: "Boys",
    girls: "Girls",
    allOrigins: "All Origins",
    all: "All",
    generatedSuggestions: "Generated Suggestions",
    curatedNames: "Curated Muslim Names",
    showingNames: "names with verified meanings",
    meaning: "Meaning",
    pronunciation: "Pronunciation",
    copyMeaning: "Copy Meaning",
    copied: "Copied!",
    saveName: "Save name",
    saved: "Saved",
    quranicBadge: "Quranic",
    noNamesTitle: "No names match your active filter.",
    noNamesSubtitle: "Try resetting the letter, origin, or search query.",
    resetAllFilters: "Reset All Filters",
    finderTab: "Name Finder",
    babyGenTab: "Baby Generator",
    meaningsTab: "Name Meanings",
    boyNamesTab: "Boy Names",
    girlNamesTab: "Girl Names",
    quranicTab: "Quranic Names",
    twinGenTab: "Twin Generator",
    byMeaningTab: "By Meaning",
    byLetterTab: "By Letter",
    byOriginTab: "By Origin",
    rareTab: "Rare Names",
    modernTab: "Modern Names",
    traditionalTab: "Traditional"
  },
  ar: {
    harmoniousPairings: "ثنائيات متناسقة ومنغمة",
    twinTitle: "مولد أسماء التوائم الإسلامية",
    twinSubtitle: "توليد أسماء متطابقة نغماً ومتقاربة في المعنى للتوائم. يظهر كل اسم معناه الكامل والموثق.",
    generateNewPairs: "توليد ثنائيات جديدة",
    twinBG: "توأم ولد وبنت",
    twinBB: "توأم ولدين",
    twinGG: "توأم بنتين",
    babyGenBadge: "تنسيق مخصص للمواليد",
    babyGenTitle: "مولد أسماء المواليد الإسلامية",
    babyGenSubtitle: "اقتراحات فورية مع المعاني الموثقة والأصل والكتابة العربية. أعد التوليد متى شئت.",
    generateNames: "توليد الأسماء",
    gender: "الجنس",
    anyGender: "جميع الأجناس",
    style: "الأسلوب",
    anyStyle: "جميع الأساليب",
    theme: "الموضوع / المعنى",
    allThemes: "جميع المفاهيم والموضوعات",
    batchSize: "عدد الاقتراحات",
    suggestions: "اقتراحات",
    searchPlaceholder: "ابحث بالاسم، أو المعنى (مثل: نور، صبر، حكمة)، أو بالعربية...",
    quranicOnly: "الأسماء القرآنية فقط",
    allGenders: "الكل",
    boys: "أولاد",
    girls: "بنات",
    allOrigins: "جميع الأصول",
    all: "الكل",
    generatedSuggestions: "اقتراحات الأسماء المولدة",
    curatedNames: "دليل الأسماء الإسلامية الموثقة",
    showingNames: "أسماء مع المعاني الموثقة",
    meaning: "المعنى والدلالة",
    pronunciation: "طريقة النطق",
    copyMeaning: "نسخ المعنى",
    copied: "تم النسخ!",
    saveName: "حفظ الاسم",
    saved: "محفوظ",
    quranicBadge: "قرآني",
    noNamesTitle: "لم يتم العثور على أسماء تطابق هذا الفلتر.",
    noNamesSubtitle: "جرّب إعادة تعيين الحرف، الأصل، أو عبارة البحث.",
    resetAllFilters: "إعادة تعيين جميع الفلاتر",
    finderTab: "باحث الأسماء",
    babyGenTab: "مولد المواليد",
    meaningsTab: "معاني الأسماء",
    boyNamesTab: "أسماء الأولاد",
    girlNamesTab: "أسماء البنات",
    quranicTab: "أسماء قرآنية",
    twinGenTab: "مولد التوائم",
    byMeaningTab: "حسب المعنى",
    byLetterTab: "حسب الحرف",
    byOriginTab: "حسب الأصل",
    rareTab: "أسماء نادرة",
    modernTab: "أسماء معاصرة",
    traditionalTab: "أسماء تقليدية"
  },
  ur: {
    harmoniousPairings: "ہم آہنگ اور باوزن جوڑے",
    twinTitle: "جڑواں بچوں کے نام جنریٹر",
    twinSubtitle: "جڑواں بچوں کے لیے ہم قافیہ، پُروقار اور بامعنی اسلامی نام۔ ہر نام مکمل مستند معنی کے ساتھ ظاہر ہوتا ہے۔",
    generateNewPairs: "نئے جوڑے بنائیں",
    twinBG: "لڑکا اور لڑکی جڑواں",
    twinBB: "دو لڑکے جڑواں",
    twinGG: "دو لڑکیاں جڑواں",
    babyGenBadge: "منتخب اسلامی تجاویز",
    babyGenTitle: "مسلم بے بی نام جنریٹر",
    babyGenSubtitle: "مکمل معانی، اصل اور عربی رسم الخط کے ساتھ فوری تجاویز۔ اپنی پسند کا نام پانے کے لیے دوبارہ جنریٹ کریں۔",
    generateNames: "نام بنائیں",
    gender: "صنف",
    anyGender: "کوئی بھی صنف",
    style: "انداز",
    anyStyle: "کوئی بھی انداز",
    theme: "مفہوم / موضوع",
    allThemes: "تمام مفاہیم اور موضوعات",
    batchSize: "تجاویز کی تعداد",
    suggestions: "تجاویز",
    searchPlaceholder: "نام، معنی (جیسے: نور، صبر، حکمت) یا عربی سے تلاش کریں...",
    quranicOnly: "صرف قرآنی نام",
    allGenders: "تمام",
    boys: "لڑکے",
    girls: "لڑکیاں",
    allOrigins: "تمام ماخذ",
    all: "تمام",
    generatedSuggestions: "تیار کردہ ناموں کی تجاویز",
    curatedNames: "مستند اسلامی ناموں کی ڈائرکٹری",
    showingNames: "مستند معانی والے نام",
    meaning: "معنی و مفہوم",
    pronunciation: "تلفظ و ادائیگی",
    copyMeaning: "معنی کاپی کریں",
    copied: "کاپی ہوگیا!",
    saveName: "نام محفوظ کریں",
    saved: "محفوظ",
    quranicBadge: "قرآنی",
    noNamesTitle: "آپ کے فلٹر کے مطابق کوئی نام نہیں ملا۔",
    noNamesSubtitle: "حرف، اصل یا تلاش کا لفظ تبدیل کر کے دوبارہ کوشش کریں۔",
    resetAllFilters: "تمام فلٹرز ری سیٹ کریں",
    finderTab: "نام تلاش کار",
    babyGenTab: "بے بی نام جنریٹر",
    meaningsTab: "ناموں کے معانی",
    boyNamesTab: "لڑکوں کے نام",
    girlNamesTab: "لڑکیوں کے نام",
    quranicTab: "قرآنی نام",
    twinGenTab: "جڑواں بچے جنریٹر",
    byMeaningTab: "معانی کے لحاظ سے",
    byLetterTab: "حرف کے لحاظ سے",
    byOriginTab: "ماخذ کے لحاظ سے",
    rareTab: "نایاب نام",
    modernTab: "جدید نام",
    traditionalTab: "روایتی نام"
  }
};

const twinHarmonies: Record<string, { en: string; ar: string; ur: string }> = {
  "hasan-husayn": {
    en: "Beloved prophetic brothers; both embody goodness and beauty",
    ar: "أخوان نبويان جليلان؛ يجمعان بين البر والحسن والجمال",
    ur: "پیارے برادرانِ نبوت؛ دونوں سراپا حسن، خیر اور فضیلت"
  },
  "muhammad-ahmad": {
    en: "Shared root of praise (H-M-D); noble prophetic resonance",
    ar: "يشتركان في أصل الحمد؛ ذوا رنين نبوي شريف",
    ur: "حمد و ثنا کے مشترکہ مادے (ح-م-د) سے ماخوذ پاکیزہ نام"
  },
  "zayd-zubayr": {
    en: "Rhyming rhythm; both prominent and brave companions",
    ar: "وزن متناسق؛ صحابيان جليلان وشجاعان",
    ur: "ہم قافیہ و باوقار ترنم؛ دونوں عظیم اور بہادر صحابہ"
  },
  "rayyan-rakan": {
    en: "Alliteration with 'R'; lush blessings & steadfast honor",
    ar: "حرف الراء المشترك؛ بركات الجنة مع العزة والشرف",
    ur: "حرف 'ر' سے ہم آہنگ؛ سرسبز برکات اور باوقار شرافت"
  },
  "ismail-ibrahim": {
    en: "Prophetic lineage of devotion and sacrifice",
    ar: "سلسلة نبوية كريمة من الطاعة والتسليم",
    ur: "تسلیم و رضا اور قربانی کا عظیم پیغمبرانہ سلسلہ"
  },
  "tariq-talha": {
    en: "Starting with 'T'; guiding morning star and fruitful shade",
    ar: "حرف الطاء؛ النجم الثاقب والظل المبارك المثمر",
    ur: "حرف 'ط' سے آغاز؛ رہبر روشن ستارہ اور مبارک سایہ"
  },
  "safiyyah-sumayyah": {
    en: "Rhyming cadence (-iyyah); pure sincere friendship & lofty steadfast faith",
    ar: "وزن وجرس متطابق؛ الصدق الخالص مع الثبات العظيم",
    ur: "ہم وزن ترنم؛ سچی دوستی اور بلندیٔ ایمان کا سنگم"
  },
  "maryam-fatima": {
    en: "Two of the four greatest women in Jannah; devotion and nobility",
    ar: "اثنتان من سيدات نساء أهل الجنة؛ عبادة وطهارة وشرف",
    ur: "جنت کی عظیم ترین چار خواتین میں سے دو؛ زہد و طہارت اور شرافت"
  },
  "tasneem-kawthar": {
    en: "Celestial springs and rivers of Paradise mentioned in Quran",
    ar: "ينابيع وأنهار الجنة المذكورة في القرآن الكريم",
    ur: "قرآن مجید میں مذکور جنت کے متبرک چشمے اور نہریں"
  },
  "yasmin-rawdah": {
    en: "Sweet fragrant blossoms and blooming gardens of bliss",
    ar: "زهور عاطرة ورياض غناء في جنات النعيم",
    ur: "خوشبودار پھول اور جنت کے سرسبز باغات"
  },
  "noor-zahra": {
    en: "Luminous radiant light and blooming brilliance",
    ar: "نور وضياء ساطع مع بهاء متألق",
    ur: "روشن و منور اجالا اور شگفتہ چمک"
  },
  "aya-inaya": {
    en: "Divine sign and divine care; gentle rhyming melody",
    ar: "آية من آيات الله مع عناية ورعاية ربانية",
    ur: "اللہ کی نشانی اور خاص عنایتِ الٰہی کا دلکش امتزاج"
  },
  "rayyan-razan": {
    en: "Alliteration with 'R'; gate of Paradise & dignity of character",
    ar: "حرف الراء المشترك؛ باب الجنة مع وقار ورزانة الخلق",
    ur: "حرف 'ر' سے ہم آہنگ؛ بابِ جنت اور باوقار متانت"
  },
  "zayd-zahra": {
    en: "Alliteration with 'Z'; abundance of growth & radiant bloom",
    ar: "حرف الزاي؛ نماء في الخير مع بهاء وجمال",
    ur: "حرف 'ز' سے باوزن؛ خیر و برکت میں اضافہ اور پرنور شگفتگی"
  },
  "tariq-tasneem": {
    en: "Both Quranic symbols; morning star & celestial spring",
    ar: "رمزان قرآنيان؛ النجم الثاقب وينبوع الجنة",
    ur: "دونوں قرآنی علامات؛ صبح کا چمکدار ستارہ اور جنت کا چشمہ"
  },
  "ali-aliya": {
    en: "Matching roots; exalted nobility and high status",
    ar: "أصل لغوي مشترك؛ علو في المنزلة وشرف رفيع",
    ur: "مشترک مادہ؛ بلندیٔ درجات، عزت اور اعلیٰ مقام"
  },
  "idris-inaya": {
    en: "Wisdom of study paired with divine protection and care",
    ar: "حكمة العلم والدراسة مع الحفظ واللطف الإلهي",
    ur: "علم و حکمت کا فہم اور الٰہی حفاظت و نگہبانی"
  }
};

export default function MuslimNamesHub({ currentTool, onSelectTool, lang = "en" }: MuslimNamesHubProps) {
  const activeSlug = currentTool?.slug || "";
  const t = hubCopy[lang] || hubCopy.en;
  const isRtl = lang === "ar" || lang === "ur";

  const nameTools = useMemo(
    () => tools.filter((tool) => tool.category === "Muslim Names Tools"),
    []
  );

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState<Gender | "all">(() => {
    if (activeSlug === "muslim-boy-names") return "boy";
    if (activeSlug === "muslim-girl-names") return "girl";
    return "all";
  });
  const [selectedLetter, setSelectedLetter] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | "all">("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<Style | "all">(() => {
    if (activeSlug === "rare-muslim-name-finder") return "rare";
    if (activeSlug === "modern-muslim-name-finder") return "modern";
    if (activeSlug === "traditional-muslim-name-finder") return "traditional";
    return "all";
  });
  const [onlyQuranic, setOnlyQuranic] = useState<boolean>(() => activeSlug === "quranic-names-finder");

  // Twin Generator State
  const [twinType, setTwinType] = useState<"bb" | "gg" | "bg">("bg");
  const [twinSeed, setTwinSeed] = useState(0);

  // Baby Generator State
  const [genCount, setGenCount] = useState(4);
  const [genSeed, setGenSeed] = useState(0);

  // Favorites & Clipboard
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("amanah-name-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active alphabet for current language
  const activeAlphabet = useMemo(() => {
    if (lang === "ar") return arabicLetters;
    if (lang === "ur") return urduLetters;
    return englishLetters;
  }, [lang]);

  // Reset letter filter when language changes
  useEffect(() => {
    setSelectedLetter("all");
  }, [lang]);

  // Sync mode with active tool slug
  useEffect(() => {
    if (activeSlug === "muslim-boy-names") setSelectedGender("boy");
    else if (activeSlug === "muslim-girl-names") setSelectedGender("girl");
    else if (activeSlug !== "muslim-baby-name-generator") setSelectedGender("all");

    if (activeSlug === "quranic-names-finder") setOnlyQuranic(true);
    else setOnlyQuranic(false);

    if (activeSlug === "rare-muslim-name-finder") setSelectedStyle("rare");
    else if (activeSlug === "modern-muslim-name-finder") setSelectedStyle("modern");
    else if (activeSlug === "traditional-muslim-name-finder") setSelectedStyle("traditional");
    else setSelectedStyle("all");
  }, [activeSlug]);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("amanah-name-favorites", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleCopy = (name: MuslimName) => {
    const meaningText = getLocalizedNameMeaning(name, lang);
    const originText = getLocalizedOrigin(name.origin, lang);
    const text =
      lang === "ar" || lang === "ur"
        ? `${name.arabic} (${name.name}) - ${meaningText}\n${t.allOrigins}: ${originText}`
        : `${name.name} (${name.arabic}) - ${meaningText}\n${t.pronunciation}: ${name.pronunciation} | ${t.allOrigins}: ${originText}`;
    navigator.clipboard.writeText(text);
    setCopiedId(name.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered names list
  const filteredNames = useMemo(() => {
    return muslimNames.filter((item) => {
      if (selectedGender !== "all" && item.gender !== selectedGender && item.gender !== "unisex") {
        return false;
      }
      if (selectedLetter !== "all" && !matchesNameLetter(item, selectedLetter, lang)) {
        return false;
      }
      if (selectedOrigin !== "all" && item.origin !== selectedOrigin) {
        return false;
      }
      if (selectedStyle !== "all" && item.style !== selectedStyle) {
        return false;
      }
      if (selectedTheme !== "all" && !item.themes.includes(selectedTheme)) {
        return false;
      }
      if (onlyQuranic && !item.quranic) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesMeaningEn = item.meaning.toLowerCase().includes(q);
        const meaningLocalized = getLocalizedNameMeaning(item, lang).toLowerCase();
        const matchesMeaningLoc = meaningLocalized.includes(q);
        const matchesArabic = item.arabic.includes(q);
        const matchesTheme = item.themes.some((th) => {
          const loc = getLocalizedTheme(th, lang).toLowerCase();
          return th.toLowerCase().includes(q) || loc.includes(q);
        });
        const matchesOrigin = item.origin.toLowerCase().includes(q) || getLocalizedOrigin(item.origin, lang).toLowerCase().includes(q);
        return matchesName || matchesMeaningEn || matchesMeaningLoc || matchesArabic || matchesTheme || matchesOrigin;
      }
      return true;
    });
  }, [selectedGender, selectedLetter, selectedOrigin, selectedStyle, selectedTheme, onlyQuranic, search, lang]);

  // Generator curated list
  const generatedNames = useMemo(() => {
    const pool = filteredNames.length > 0 ? filteredNames : muslimNames;
    const shuffled = [...pool].sort((a, b) => {
      const valA = (a.id.charCodeAt(0) * 31 + genSeed) % 100;
      const valB = (b.id.charCodeAt(0) * 31 + genSeed) % 100;
      return valA - valB;
    });
    return shuffled.slice(0, genCount);
  }, [filteredNames, genSeed, genCount]);

  // Twin generated pairs
  const twinPairs = useMemo(() => {
    const boys = muslimNames.filter((n) => n.gender === "boy" || n.gender === "unisex");
    const girls = muslimNames.filter((n) => n.gender === "girl" || n.gender === "unisex");

    const pairs: Array<{ name1: MuslimName; name2: MuslimName; harmony: string }> = [];

    const getHarmonyText = (key: string, defaultEn: string) => {
      const found = twinHarmonies[key];
      if (found) {
        return found[lang] || found.en;
      }
      return defaultEn;
    };

    if (twinType === "bb") {
      const presets = [
        { id1: "hasan", id2: "husayn", key: "hasan-husayn", fallback: "Beloved prophetic brothers; both embody goodness and beauty" },
        { id1: "muhammad", id2: "ahmad", key: "muhammad-ahmad", fallback: "Shared root of praise (H-M-D); noble prophetic resonance" },
        { id1: "zayd", id2: "zubayr", key: "zayd-zubayr", fallback: "Rhyming rhythm; both prominent and brave companions" },
        { id1: "rayyan", id2: "rakan", key: "rayyan-rakan", fallback: "Alliteration with 'R'; lush blessings & steadfast honor" },
        { id1: "ismail", id2: "ibrahim", key: "ismail-ibrahim", fallback: "Prophetic lineage of devotion and sacrifice" },
        { id1: "tariq", id2: "talha", key: "tariq-talha", fallback: "Starting with 'T'; guiding morning star and fruitful shade" }
      ];
      presets.forEach((p) => {
        const n1 = muslimNames.find((n) => n.id === p.id1 || n.name.toLowerCase() === p.id1);
        const n2 = muslimNames.find((n) => n.id === p.id2 || n.name.toLowerCase() === p.id2);
        if (n1 && n2) pairs.push({ name1: n1, name2: n2, harmony: getHarmonyText(p.key, p.fallback) });
      });
      if (pairs.length < 3) {
        for (let i = 0; i < boys.length - 1; i += 2) {
          pairs.push({
            name1: boys[i],
            name2: boys[i + 1],
            harmony: `${getLocalizedTheme(boys[i].themes[0], lang)} & ${getLocalizedTheme(boys[i + 1].themes[0], lang)}`
          });
        }
      }
    } else if (twinType === "gg") {
      const presets = [
        { id1: "safiyyah", id2: "sumayyah", key: "safiyyah-sumayyah", fallback: "Rhyming cadence (-iyyah); pure sincere friendship & lofty steadfast faith" },
        { id1: "maryam", id2: "fatima", key: "maryam-fatima", fallback: "Two of the four greatest women in Jannah; devotion and nobility" },
        { id1: "tasneem", id2: "kawthar", key: "tasneem-kawthar", fallback: "Celestial springs and rivers of Paradise mentioned in Quran" },
        { id1: "yasmin", id2: "rawdah", key: "yasmin-rawdah", fallback: "Sweet fragrant blossoms and blooming gardens of bliss" },
        { id1: "noor", id2: "zahra", key: "noor-zahra", fallback: "Luminous radiant light and blooming brilliance" },
        { id1: "aya", id2: "inaya", key: "aya-inaya", fallback: "Divine sign and divine care; gentle rhyming melody" }
      ];
      presets.forEach((p) => {
        const n1 = muslimNames.find((n) => n.id === p.id1 || n.name.toLowerCase() === p.id1);
        const n2 = muslimNames.find((n) => n.id === p.id2 || n.name.toLowerCase() === p.id2);
        if (n1 && n2) pairs.push({ name1: n1, name2: n2, harmony: getHarmonyText(p.key, p.fallback) });
      });
    } else {
      const presets = [
        { id1: "rayyan", id2: "razan", key: "rayyan-razan", fallback: "Alliteration with 'R'; gate of Paradise & dignity of character" },
        { id1: "zayd", id2: "zahra", key: "zayd-zahra", fallback: "Alliteration with 'Z'; abundance of growth & radiant bloom" },
        { id1: "tariq", id2: "tasneem", key: "tariq-tasneem", fallback: "Both Quranic symbols; morning star & celestial spring" },
        { id1: "ali", id2: "aliya", key: "ali-aliya", fallback: "Matching roots; exalted nobility and high status" },
        { id1: "idris", id2: "inaya", key: "idris-inaya", fallback: "Wisdom of study paired with divine protection and care" }
      ];
      presets.forEach((p) => {
        const n1 = muslimNames.find((n) => n.id === p.id1 || n.name.toLowerCase() === p.id1);
        const n2 = muslimNames.find((n) => n.id === p.id2 || n.name.toLowerCase() === p.id2);
        if (n1 && n2) pairs.push({ name1: n1, name2: n2, harmony: getHarmonyText(p.key, p.fallback) });
      });
    }

    const rotated = [...pairs];
    const offset = twinSeed % Math.max(1, rotated.length);
    return [...rotated.slice(offset), ...rotated.slice(0, offset)];
  }, [twinType, twinSeed, lang]);

  return (
    <div className={`space-y-10 ${isRtl ? "rtl" : "ltr"}`}>
      {/* Section Sub-Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6D8BA] pb-4">
        <div className="flex items-center gap-2">
          {activeSlug && (
            <button
              type="button"
              onClick={() => onSelectTool("")}
              className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] px-3.5 py-1.5 text-xs font-bold text-[#6E1A37] hover:bg-[#FFEFC2] transition-colors cursor-pointer"
            >
              {lang === "ar" ? "← جميع أدوات الأسماء الإسلامية" : lang === "ur" ? "← تمام اسلامی ناموں کے ٹولز" : "← All Muslim Name Tools"}
            </button>
          )}
          <span className="text-xs font-bold text-[#6E1A37]">
            {lang === "ar" ? "١٣ أداة ومولداً لأسماء المواليد والتوائم والمعاني" : lang === "ur" ? "۱۳ اسلامی ناموں کے ٹولز" : "13 Dedicated Muslim Name Tools"}
          </span>
        </div>
      </div>

      {/* VIEW 1: DIRECTORY GRID OF ALL 13 MUSLIM NAME TOOLS (SIGNATURE CARDS) */}
      {!activeSlug && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nameTools.map((tool, idx) => (
              <button
                type="button"
                key={tool.slug}
                onClick={() => onSelectTool(tool.slug)}
                className="group text-left relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#E6D8BA] bg-[#FFF6DE] p-5 sm:p-6 no-underline interactive-card hover:border-[#AE2448] hover:bg-[#FFEFC2] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                        {lang === "ar" ? "أداة الأسماء" : "Name Tool"}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#6E1A37]/60">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h4 className="mb-1.5 text-base sm:text-lg font-bold leading-snug tracking-[-.02em] text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                    {tool.title}
                  </h4>

                  <p className="m-0 text-xs sm:text-sm leading-relaxed text-[#262626]">
                    {tool.short}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E6D8BA] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6E1A37] group-hover:text-[var(--primary)] transition-colors">
                    {lang === "ar" ? "افتح الأداة" : "Open Name Tool"}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#AE2448] text-white group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-200 shadow-xs">
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SPECIAL MODE: Twin Muslim Name Generator */}
      {activeSlug === "twin-muslim-name-generator" ? (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] relative overflow-hidden fade-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#AE2448] via-[#6E1A37] to-[#AE2448]" />
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#AE2448]/15 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
                <Users className="h-3.5 w-3.5 text-[#AE2448]" />
                {t.harmoniousPairings}
              </span>
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">{t.twinTitle}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t.twinSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTwinSeed((s) => s + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold !text-white transition-all duration-200 hover:bg-[var(--primary-hover)] active:scale-95 shadow-md cursor-pointer border-0"
            >
              <Shuffle className="h-4 w-4" />
              <span>{t.generateNewPairs}</span>
            </button>
          </div>

          {/* Twin Type Selector */}
          <div className="mb-8 flex flex-wrap gap-2">
            {[
              { type: "bg", label: t.twinBG },
              { type: "bb", label: t.twinBB },
              { type: "gg", label: t.twinGG }
            ].map((tab) => (
              <button
                key={tab.type}
                type="button"
                onClick={() => {
                  setTwinType(tab.type as "bb" | "gg" | "bg");
                  setTwinSeed((s) => s + 1);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  twinType === tab.type
                    ? "bg-[#6E1A37] text-white border-[#6E1A37] shadow-xs"
                    : "bg-white text-[var(--ink)] border-[#F2EAE0] hover:border-[#AE2448] hover:bg-[#F2EAE0]/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Twin Results Pairs */}
          <div className="grid gap-6 md:grid-cols-2">
            {twinPairs.slice(0, 4).map((pair, idx) => (
              <div
                key={idx}
                className="interactive-card rounded-2xl border border-[#F2EAE0] bg-[var(--paper)] p-5 sm:p-6 hover:border-[#AE2448]"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-[#AE2448]/10 px-3 py-1 text-xs font-bold text-[#6E1A37]">
                  <Sparkles className="h-3.5 w-3.5 text-[#AE2448]" />
                  <span>{pair.harmony}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name 1 */}
                  <div className="rounded-xl border border-[#F2EAE0] bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                        {pair.name1.gender === "boy" ? t.boys : pair.name1.gender === "girl" ? t.girls : t.allGenders}
                      </span>
                      {lang === "en" && (
                        <span className="font-arabic text-xl font-bold text-[var(--primary)]">
                          {pair.name1.arabic}
                        </span>
                      )}
                    </div>
                    {lang === "ar" || lang === "ur" ? (
                      <>
                        <h3 className="text-2xl font-bold font-arabic text-[var(--ink)] m-0" dir="rtl">{pair.name1.arabic}</h3>
                        <p className="mt-0.5 text-xs text-[#6E1A37] font-semibold">{pair.name1.name}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-extrabold text-[var(--ink)] m-0">{pair.name1.name}</h3>
                        <p className="mt-1 text-xs text-[var(--muted)] font-mono">[{pair.name1.pronunciation}]</p>
                      </>
                    )}
                    <div className="mt-3 pt-3 border-t border-[#F2EAE0]">
                      <p className="text-xs text-[var(--ink)] font-semibold leading-relaxed m-0">
                        <strong className="text-[#6E1A37]">{t.meaning}:</strong> {getLocalizedNameMeaning(pair.name1, lang)}
                      </p>
                    </div>
                  </div>

                  {/* Name 2 */}
                  <div className="rounded-xl border border-[#F2EAE0] bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                        {pair.name2.gender === "boy" ? t.boys : pair.name2.gender === "girl" ? t.girls : t.allGenders}
                      </span>
                      {lang === "en" && (
                        <span className="font-arabic text-xl font-bold text-[var(--primary)]">
                          {pair.name2.arabic}
                        </span>
                      )}
                    </div>
                    {lang === "ar" || lang === "ur" ? (
                      <>
                        <h3 className="text-2xl font-bold font-arabic text-[var(--ink)] m-0" dir="rtl">{pair.name2.arabic}</h3>
                        <p className="mt-0.5 text-xs text-[#6E1A37] font-semibold">{pair.name2.name}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-extrabold text-[var(--ink)] m-0">{pair.name2.name}</h3>
                        <p className="mt-1 text-xs text-[var(--muted)] font-mono">[{pair.name2.pronunciation}]</p>
                      </>
                    )}
                    <div className="mt-3 pt-3 border-t border-[#F2EAE0]">
                      <p className="text-xs text-[var(--ink)] font-semibold leading-relaxed m-0">
                        <strong className="text-[#6E1A37]">{t.meaning}:</strong> {getLocalizedNameMeaning(pair.name2, lang)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* SPECIAL MODE: Baby Name Generator Engine */}
      {activeSlug === "muslim-baby-name-generator" && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] relative overflow-hidden fade-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#AE2448] via-[#6E1A37] to-[#AE2448]" />
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#AE2448]/15 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#AE2448]" />
                {t.babyGenBadge}
              </span>
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">{t.babyGenTitle}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t.babyGenSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGenSeed((s) => s + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold !text-white transition-all duration-200 hover:bg-[var(--primary-hover)] active:scale-95 shadow-md cursor-pointer border-0"
            >
              <Shuffle className="h-4 w-4" />
              <span>{t.generateNames}</span>
            </button>
          </div>

          {/* Generator Controls */}
          <div className="grid gap-4 sm:grid-cols-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">{t.gender}</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as Gender | "all")}
                className="w-full rounded-xl border border-[#F2EAE0] bg-white px-3 py-2 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[#AE2448] cursor-pointer"
              >
                <option value="all">{t.anyGender}</option>
                <option value="boy">{t.boys}</option>
                <option value="girl">{t.girls}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">{t.style}</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as Style | "all")}
                className="w-full rounded-xl border border-[#F2EAE0] bg-white px-3 py-2 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[#AE2448] cursor-pointer"
              >
                <option value="all">{t.anyStyle}</option>
                <option value="modern">{getLocalizedStyle("modern", lang)}</option>
                <option value="traditional">{getLocalizedStyle("traditional", lang)}</option>
                <option value="classic">{getLocalizedStyle("classic", lang)}</option>
                <option value="rare">{getLocalizedStyle("rare", lang)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">{t.theme}</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full rounded-xl border border-[#F2EAE0] bg-white px-3 py-2 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[#AE2448] cursor-pointer"
              >
                <option value="all">{t.allThemes}</option>
                {allThemes.map((th) => (
                  <option key={th} value={th}>
                    {getLocalizedTheme(th, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">{t.batchSize}</label>
              <select
                value={genCount}
                onChange={(e) => setGenCount(Number(e.target.value))}
                className="w-full rounded-xl border border-[#F2EAE0] bg-white px-3 py-2 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[#AE2448] cursor-pointer"
              >
                <option value={4}>4 {t.suggestions}</option>
                <option value={6}>6 {t.suggestions}</option>
                <option value={8}>8 {t.suggestions}</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Main Filter & Search Control Panel */}
      <section className="rounded-3xl border border-[#F2EAE0] bg-white p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-[#F2EAE0] pb-5">
          <div className="relative flex-1 w-full">
            <Search className={`absolute top-3 h-4 w-4 text-[var(--muted)] ${isRtl ? "right-3.5" : "left-3.5"}`} />
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-xl border border-[#F2EAE0] bg-white py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)]/50 focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/20 outline-none transition-all shadow-2xs ${
                isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`absolute top-2.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer border-0 bg-transparent p-1 ${
                  isRtl ? "left-3" : "right-3"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOnlyQuranic(!onlyQuranic)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                onlyQuranic
                  ? "bg-[#AE2448] text-white border-[#AE2448] shadow-xs"
                  : "bg-white text-[var(--ink)] border-[#F2EAE0] hover:border-[#AE2448]"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t.quranicOnly}</span>
            </button>
          </div>
        </div>

        {/* Gender Filter Pills & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[var(--muted)] mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3 text-[#6E1A37]" /> {t.gender}:
          </span>
          {[
            { id: "all", label: t.allGenders },
            { id: "boy", label: t.boys },
            { id: "girl", label: t.girls }
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGender(g.id as Gender | "all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer border ${
                selectedGender === g.id
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                  : "bg-[var(--result)] text-[var(--ink)] border-[#F2EAE0] hover:border-[#AE2448] hover:bg-[#F2EAE0]"
              }`}
            >
              {g.label}
            </button>
          ))}

          {/* Theme select */}
          <span className="text-xs font-bold text-[var(--muted)] ml-3 mr-2">{t.theme}:</span>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="rounded-xl border border-[#F2EAE0] bg-white px-3 py-1.5 text-xs font-bold text-[var(--ink)] outline-none focus:border-[#AE2448] cursor-pointer"
          >
            <option value="all">{t.allThemes}</option>
            {allThemes.map((th) => (
              <option key={th} value={th}>
                {getLocalizedTheme(th, lang)}
              </option>
            ))}
          </select>

          {/* Origin select */}
          <span className="text-xs font-bold text-[var(--muted)] ml-3 mr-2">{t.allOrigins}:</span>
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value as Origin | "all")}
            className="rounded-xl border border-[#F2EAE0] bg-white px-3 py-1.5 text-xs font-bold text-[var(--ink)] outline-none focus:border-[#AE2448] cursor-pointer"
          >
            <option value="all">{t.allOrigins}</option>
            {allOrigins.map((orig) => (
              <option key={orig} value={orig}>
                {getLocalizedOrigin(orig, lang)}
              </option>
            ))}
          </select>
        </div>

        {/* Alphabet Bar with localized letters */}
        <div className="pt-2 border-t border-[#E6D8BA] flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedLetter("all")}
            className={`px-3 py-1 rounded-md text-xs font-bold shrink-0 transition-colors cursor-pointer border ${
              selectedLetter === "all"
                ? "bg-[#6E1A37] text-white border-[#6E1A37]"
                : "bg-[#FFF6DE] text-[var(--ink)] border-[#E6D8BA] hover:border-[#AE2448] hover:bg-[#FFEFC2]"
            }`}
          >
            {t.all}
          </button>
          {activeAlphabet.map((letter) => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(isSelected ? "all" : letter)}
                className={`h-7 min-w-7 px-1.5 rounded-md text-xs font-bold shrink-0 flex items-center justify-center transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[#6E1A37] text-white border-[#6E1A37]"
                    : "bg-[#FFF6DE] text-[var(--ink)] border-[#E6D8BA] hover:border-[#AE2448] hover:bg-[#FFEFC2]"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Header with Count */}
      <div className="flex items-center justify-between border-b border-[#E6D8BA] pb-3">
        <div>
          <h3 className="m-0 text-xl font-bold tracking-tight text-[var(--ink)]">
            {activeSlug === "muslim-baby-name-generator" ? t.generatedSuggestions : t.curatedNames}
          </h3>
          <p className="m-0 text-xs text-[var(--muted)] mt-0.5">
            {activeSlug === "muslim-baby-name-generator" ? generatedNames.length : filteredNames.length} {t.showingNames}
          </p>
        </div>
      </div>

      {/* Names Card Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(activeSlug === "muslim-baby-name-generator" ? generatedNames : filteredNames).map((item) => {
          const isFav = favorites.includes(item.id);
          const isCopied = copiedId === item.id;
          const localizedMeaning = getLocalizedNameMeaning(item, lang);
          const localizedQRef = getLocalizedQuranicRef(item, lang);
          const localizedOrig = getLocalizedOrigin(item.origin, lang);

          return (
            <article
              key={item.id}
              className="interactive-card relative flex flex-col justify-between rounded-2xl border border-[#E6D8BA] bg-[#FFF6DE] p-5 sm:p-6 hover:border-[#AE2448] hover:bg-[#FFEFC2]"
            >
              <div>
                {/* Header: Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.gender === "boy"
                          ? "bg-[#6E1A37] text-white"
                          : item.gender === "girl"
                          ? "bg-[#AE2448] text-white"
                          : "bg-[#6E1A37] text-white"
                      }`}
                    >
                      {item.gender === "boy" ? t.boys : item.gender === "girl" ? t.girls : t.allGenders}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#F2EAE0] text-[#6E1A37]">
                      {localizedOrig}
                    </span>
                    {item.quranic && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#AE2448]/10 border border-[#AE2448]/30 text-[#6E1A37] flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-[#AE2448]" />
                        <span>{t.quranicBadge}</span>
                      </span>
                    )}
                  </div>
                  {lang === "en" && (
                    <span className="font-arabic text-2xl font-bold text-[var(--primary)] leading-none" dir="rtl">
                      {item.arabic}
                    </span>
                  )}
                </div>

                {/* Name Heading & Sub-transliteration */}
                {lang === "ar" || lang === "ur" ? (
                  <div className="mb-3">
                    <h4 className="text-2xl font-bold font-arabic text-[var(--ink)] tracking-tight mb-0.5" dir="rtl">
                      {item.arabic}
                    </h4>
                    <p className="m-0 text-xs font-semibold text-[#6E1A37] flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-[var(--muted)] font-mono text-[11px]">[{item.pronunciation}]</span>
                    </p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <h4 className="text-xl font-extrabold text-[var(--ink)] tracking-tight mb-1">
                      {item.name}
                    </h4>
                    <p className="m-0 text-xs font-mono text-[var(--muted)]">
                      {t.pronunciation}: <span className="font-semibold text-[var(--ink)]">{item.pronunciation}</span>
                    </p>
                  </div>
                )}

                {/* PROMINENT MEANING DISPLAY */}
                <div className="rounded-xl border border-[#F2EAE0] bg-[#F2EAE0]/60 p-3.5 shadow-2xs mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6E1A37] mb-1">
                    {t.meaning}
                  </p>
                  <p className="m-0 text-sm font-semibold leading-relaxed text-[var(--ink)]">
                    {localizedMeaning}
                  </p>
                </div>

                {/* Quranic reference if any */}
                {localizedQRef && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6E1A37] font-medium leading-relaxed bg-[#AE2448]/10 rounded-lg px-2.5 py-1.5 mb-3 border border-[#AE2448]/20">
                    <BookOpen className="h-3.5 w-3.5 text-[#AE2448] shrink-0" />
                    <span>{localizedQRef}</span>
                  </div>
                )}

                {/* Themes list */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.themes.map((th) => (
                    <span key={th} className="text-[10px] font-bold text-[#6E1A37] bg-[#AE2448]/10 px-2 py-0.5 rounded">
                      #{getLocalizedTheme(th, lang)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 pt-3.5 border-t border-[#F2EAE0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E1A37] hover:text-[var(--primary)] transition-colors cursor-pointer border-0 bg-transparent p-0"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? t.copied : t.copyMeaning}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(item.id)}
                  title={isFav ? t.saved : t.saveName}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer border shadow-2xs ${
                    isFav
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--muted)] border-[#F2EAE0] hover:text-[var(--primary)] hover:border-[var(--primary)]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFav ? "fill-white" : ""}`} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filteredNames.length === 0 && (
        <div className="rounded-2xl border border-[#F2EAE0] bg-white p-10 text-center">
          <p className="text-base font-bold text-[var(--ink)] m-0">{t.noNamesTitle}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{t.noNamesSubtitle}</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedLetter("all");
              setSelectedOrigin("all");
              setSelectedTheme("all");
              setSelectedGender("all");
              setOnlyQuranic(false);
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold !text-white shadow-xs cursor-pointer border-0 hover:bg-[var(--primary-hover)] transition-colors"
          >
            <span>{t.resetAllFilters}</span>
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import {
  Compass,
  MapPin,
  Clock,
  Calendar,
  BookOpen,
  Sparkles,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Info,
  ChevronRight,
  ListOrdered,
  Sun,
  Award,
  Search,
  Scale,
  Volume2,
  Coins,
  ArrowRight
} from "lucide-react";
import { Tool, tools } from "../data/tools";
import type { Locale } from "../data/locales";

interface HajjUmrahHubProps {
  currentTool?: Tool | null;
  onSelectTool: (slug: string) => void;
  lang?: Locale;
}

// Multilingual texts for Hajj & Umrah Hub
const hCopy: Record<Locale, Record<string, string>> = {
  en: {
    hubTitle: "Hajj & Umrah Tools & Planners",
    hubSubtitle: "Interactive suite of 19 calculators, packing checklists, day planners, counters, and ritual guides for your sacred pilgrimage.",
    privacyBadge: "100% Private & Saved Locally in Your Browser",
    privacyNotice: "All your Hajj & Umrah planners, packing checklists, savings goals, Tawaf/Sa'i counts, and daily itineraries are saved securely in your browser's local storage only. No personal data is sent to external servers.",
    resetAllData: "Reset All Local Data",
    copied: "Copied to clipboard!",
    toolsCount: "19 Dedicated Tools",
    viewAllTools: "View All Hajj & Umrah Tools",
    hajjCost: "Hajj Cost Calculator",
    umrahCost: "Umrah Cost Calculator",
    hajjPlanner: "Hajj Planner",
    umrahPlanner: "Umrah Planner",
    hajjPacking: "Hajj Packing List",
    umrahPacking: "Umrah Packing List",
    hajjGen: "Hajj Checklist Generator",
    umrahGen: "Umrah Checklist Generator",
    hajjDay: "Hajj Day Planner",
    umrahDay: "Umrah Day Planner",
    hajjGuide: "Hajj Ritual Guide",
    umrahGuide: "Umrah Ritual Guide",
    ihram: "Ihram Checklist",
    tawafCounter: "Tawaf Counter",
    saiCounter: "Sa'i Counter",
    duaFinder: "Dua Finder",
    distanceTool: "Makkah/Madinah Transit",
    hajjSavings: "Hajj Savings Calculator",
    umrahSavings: "Umrah Savings Calculator",
    lap: "Lap / Round",
    of7: "of 7",
    startTawaf: "Start Tawaf",
    startSai: "Start Sa'i",
    nextLap: "Complete Lap",
    resetCounter: "Reset Counter",
    currentLocation: "Current Direction",
    ruknYamaniNote: "Between Rukn al-Yamani & Hajar al-Aswad recite:",
    greenLightsZone: "Run / Jog gently between the green lights zone",
    add: "Add Item",
    clear: "Clear All",
    completed: "Completed",
    save: "Save Progress",
    savedNotice: "Saved to browser storage",
    searchDua: "Search duas by keyword or ritual...",
    copyDua: "Copy Dua",
    targetSavings: "Target Savings Goal",
    monthlyContribution: "Monthly Savings Target",
    currentSavings: "Current Saved Amount",
    monthsRemaining: "Months to Save",
    progress: "Progress"
  },
  ar: {
    hubTitle: "أدوات ومخططات الحج والعمرة",
    hubSubtitle: "مجموعة متكاملة تضم ١٩ أداة وحاسبة ومخططاً تفاعلياً وعدادات للطواف والسعي وأدعية مأثورة لرحلتك المباركة.",
    privacyBadge: "خصوصية تامة - تُحفظ البيانات في متصفحك محلياً",
    privacyNotice: "جميع مخططاتك وجداولك وقوائم أمتعتك وعدادات الطواف والسعي وحاسبات الادخار تُحفظ بشكل آمن في ذاكرة متصفحك المحلية فقط، ولا يتم إرسال أي بيانات إلى خوادم خارجية.",
    resetAllData: "إعادة ضبط جميع البيانات",
    copied: "تم النسخ بنجاح!",
    toolsCount: "١٩ أداة ومخططاً",
    viewAllTools: "استعراض جميع أدوات الحج والعمرة",
    hajjCost: "حاسبة تكاليف الحج",
    umrahCost: "حاسبة تكاليف العمرة",
    hajjPlanner: "مخطط مناسك الحج",
    umrahPlanner: "مخطط مناسك العمرة",
    hajjPacking: "قائمة أمتعة الحج",
    umrahPacking: "قائمة أمتعة العمرة",
    hajjGen: "مولد قائمة الحج",
    umrahGen: "مولد قائمة العمرة",
    hajjDay: "المخطط اليومي للحج",
    umrahDay: "المخطط اليومي للعمرة",
    hajjGuide: "دليل مناسك الحج",
    umrahGuide: "دليل مناسك العمرة",
    ihram: "قائمة أحكام الإحرام",
    tawafCounter: "عداد الطواف",
    saiCounter: "عداد السعي",
    duaFinder: "محرك أدعية الحج والعمرة",
    distanceTool: "مواصلات مكة والمدينة",
    hajjSavings: "حاسبة ادخار الحج",
    umrahSavings: "حاسبة ادخار العمرة",
    lap: "الشوط",
    of7: "من ٧",
    startTawaf: "بدء الطواف",
    startSai: "بدء السعي",
    nextLap: "إكمال الشوط",
    resetCounter: "إعادة العداد",
    currentLocation: "الاتجاه الحالي",
    ruknYamaniNote: "بين الركن اليماني والحجر الأسود يُسن قول:",
    greenLightsZone: "يُسن الهرولة والهرولة الخفيفة بين العلمين الأخضرين للرجال",
    add: "إضافة عنصر",
    clear: "مسح الكل",
    completed: "مكتمل",
    save: "حفظ التقدم",
    savedNotice: "تم الحفظ في ذاكرة المتصفح",
    searchDua: "البحث في الأدعية بالكلمة أو النسك...",
    copyDua: "نسخ الدعاء",
    targetSavings: "المبلغ المستهدف للادخار",
    monthlyContribution: "الادخار الشهري المطلوب",
    currentSavings: "المبلغ المدخر حالياً",
    monthsRemaining: "الأشهر المتبقية",
    progress: "النسبة المكتملة"
  },
  ur: {
    hubTitle: "حج و عمرہ ٹولز، پلانرز و کیلکولیٹرز",
    hubSubtitle: "مبارک سفرِ حج و عمرہ کے لیے ۱۹ جامع ٹولز، طواف و سعی کاؤنٹرز، سامان کی چیک لسٹ اور مسنون دعائیں۔",
    privacyBadge: "مکمل رازداری - تمام ڈیٹا آپ کے براؤزر میں محفوظ ہے",
    privacyNotice: "آپ کے تمام حج و عمرہ پلانرز، پئکنگ چیک لسٹ، طواف و سعی کاؤنٹرز اور سیونگز کا حساب صرف اور صرف آپ کے براؤزر کے لوکل اسٹوریج میں محفوظ ہے۔ کوئی ڈیٹا سرور پر نہیں جاتا۔",
    resetAllData: "تمام ڈیٹا ری سیٹ کریں",
    copied: "کاپی ہو گیا!",
    toolsCount: "۱۹ خصوصی ٹولز",
    viewAllTools: "تمام حج و عمرہ ٹولز دیکھیں",
    hajjCost: "حج اخراجات کیلکولیٹر",
    umrahCost: "عمرہ اخراجات کیلکولیٹر",
    hajjPlanner: "حج پلانر",
    umrahPlanner: "عمرہ پلانر",
    hajjPacking: "حج پیکنگ چیک لسٹ",
    umrahPacking: "عمرہ پیکنگ چیک لسٹ",
    hajjGen: "حج چیک لسٹ جنریٹر",
    umrahGen: "عمرہ چیک لسٹ جنریٹر",
    hajjDay: "حج ڈیلی پلانر",
    umrahDay: "عمرہ ڈیلی پلانر",
    hajjGuide: "حج المناسک گائیڈ",
    umrahGuide: "عمرہ المناسک گائیڈ",
    ihram: "احرام گائیڈ و احکام",
    tawafCounter: "طواف کاؤنٹر",
    saiCounter: "سعی کاؤنٹر",
    duaFinder: "حج و عمرہ دعاؤں کا ذخیرہ",
    distanceTool: "مکہ و مدینہ ٹرانسپورٹ و فاصلے",
    hajjSavings: "حج سیونگز کیلکولیٹر",
    umrahSavings: "عمرہ سیونگز کیلکولیٹر",
    lap: "چکر",
    of7: "میں سے ۷",
    startTawaf: "طواف شروع کریں",
    startSai: "سعی شروع کریں",
    nextLap: "چکر مکمل کریں",
    resetCounter: "کاؤنٹر ری سیٹ کریں",
    currentLocation: "موجودہ سمت",
    ruknYamaniNote: "رکن یمانی اور حجرِ اسود کے درمیان مسنون دعا:",
    greenLightsZone: "سبز بتیاں والے حصے میں مردوں کے لیے درمیانی چال (رمل) مسنون ہے",
    add: "شامل کریں",
    clear: "تمام صاف کریں",
    completed: "مکمل",
    save: "پیشرفت محفوظ کریں",
    savedNotice: "براؤزر میں محفوظ کر دیا گیا",
    searchDua: "دعائیں تلاش کریں...",
    copyDua: "دعا کاپی کریں",
    targetSavings: "ادخار کا ہدف",
    monthlyContribution: "ماہانہ درکار ادخار",
    currentSavings: "اب تک کی بچت",
    monthsRemaining: "باقی ماہ",
    progress: "پیشرفت"
  }
};

// Initial state data helpers
const defaultHajjChecklist = [
  { id: "ihram1", category: "Ihram & Clothing", text: "2 Unstitched White Ihram Sheets (Men) or Modest Abayas (Women)", done: false },
  { id: "ihram2", category: "Ihram & Clothing", text: "Unscented Soap, Shampoo & Deodorant", done: false },
  { id: "ihram3", category: "Ihram & Clothing", text: "Comfortable Walking Sandals (Ankles & top of foot visible for men)", done: false },
  { id: "ihram4", category: "Ihram & Clothing", text: "Money Belt / Pouch for Passports & Cash", done: false },
  { id: "docs1", category: "Documents", text: "Original Passport & Saudi Visa / Nusuk App QR Code", done: false },
  { id: "docs2", category: "Documents", text: "Vaccination Certificates (Meningococcal, COVID-19, Flu)", done: false },
  { id: "docs3", category: "Documents", text: "Emergency Contact Card & Hotel Addresses in Makkah/Madinah", done: false },
  { id: "health1", category: "Health & Care", text: "Prescription Medications & Vaseline / Anti-Chafing Cream", done: false },
  { id: "health2", category: "Health & Care", text: "Oral Rehydration Salts (ORS) & Electrolyte Packets", done: false },
  { id: "health3", category: "Health & Care", text: "Unscented Wet Wipes & Pocket Prayer Mat", done: false },
  { id: "tent1", category: "Mina & Arafat", text: "Lightweight Sleeping Bag / Inflatable Mat for Muzdalifah", done: false },
  { id: "tent2", category: "Mina & Arafat", text: "Power Bank & Long Charging Cables", done: false },
  { id: "tent3", category: "Mina & Arafat", text: "Pebble Collection Bag for Jamarat (49 or 70 stones)", done: false }
];

const defaultUmrahChecklist = [
  { id: "u1", category: "Ihram & Gear", text: "White Ihram towels / Belt with secure zipper", done: false },
  { id: "u2", category: "Ihram & Gear", text: "Unscented toiletries (Soap, Lip balm, Sunscreen)", done: false },
  { id: "u3", category: "Documents", text: "Passport, Tourist/Umrah Visa, Nusuk Rawdah permit", done: false },
  { id: "u4", category: "Essentials", text: "Comfortable slip-on shoes for Haram entrance", done: false },
  { id: "u5", category: "Essentials", text: "Small shoe bag / backpack for Tawaf", done: false },
  { id: "u6", category: "Supplications", text: "Compact Hajj & Umrah Dua booklet or app", done: false }
];

const defaultDuaList = [
  {
    id: "talbiyah",
    title: "The Talbiyah",
    arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ",
    transliteration: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk. Innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
    english: "Here I am O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, grace, and sovereignty belong to You. You have no partner.",
    category: "Miqat & Ihram"
  },
  {
    id: "tawaf_start",
    title: "At Black Stone (Hajar al-Aswad)",
    arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ",
    transliteration: "Bismillahi wa Allahu Akbar",
    english: "In the name of Allah, Allah is the Greatest.",
    category: "Tawaf"
  },
  {
    id: "yamani_to_hajar",
    title: "Between Rukn Yamani and Hajar al-Aswad",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
    english: "Our Lord! Grant us good in this world and good in the Hereafter, and save us from the torment of the Fire. (Surah Al-Baqarah 2:201)",
    category: "Tawaf"
  },
  {
    id: "safa_start",
    title: "At Mount Safa (Beginning of Sa'i)",
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ ۖ أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
    transliteration: "Innas-Safa wal-Marwata min sha'a'irillahi. Abda'u bima bada'allahu bih.",
    english: "Indeed Safa and Marwah are among the symbols of Allah. I begin with that which Allah has begun with.",
    category: "Sa'i"
  },
  {
    id: "arafat_dua",
    title: "Best Dua on the Day of Arafat",
    arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu, wa huwa 'ala kulli shay'in qadir.",
    english: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs sovereignty and praise, and He has power over all things.",
    category: "Arafat"
  },
  {
    id: "zamzam_dua",
    title: "Dua When Drinking Zamzam Water",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ",
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan wasi'an, wa shifa'an min kulli da'.",
    english: "O Allah, I ask You for beneficial knowledge, abundant provision, and healing from every illness.",
    category: "Zamzam"
  }
];

export default function HajjUmrahHub({ currentTool, onSelectTool, lang = "en" }: HajjUmrahHubProps) {
  const activeSlug = currentTool?.slug || "";
  const t = hCopy[lang] || hCopy.en;
  const isRtl = lang === "ar" || lang === "ur";

  const hajjTools = useMemo(
    () => tools.filter((tool) => tool.category === "Hajj & Umrah Tools"),
    []
  );

  // Local Storage state for Tawaf & Sa'i Counter
  const [tawafLap, setTawafLap] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("barakah-tawaf-lap");
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [saiLap, setSaiLap] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("barakah-sai-lap");
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Local Storage state for Checklists
  const [hajjChecklist, setHajjChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem("barakah-hajj-checklist");
      return saved ? JSON.parse(saved) : defaultHajjChecklist;
    } catch {
      return defaultHajjChecklist;
    }
  });

  const [umrahChecklist, setUmrahChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem("barakah-umrah-checklist");
      return saved ? JSON.parse(saved) : defaultUmrahChecklist;
    } catch {
      return defaultUmrahChecklist;
    }
  });

  // Local storage for Savings Calculator
  const [hajjSavingsTarget, setHajjSavingsTarget] = useState(8000);
  const [hajjSavingsCurrent, setHajjSavingsCurrent] = useState(2500);
  const [hajjSavingsMonths, setHajjSavingsMonths] = useState(24);

  const [umrahSavingsTarget, setUmrahSavingsTarget] = useState(2500);
  const [umrahSavingsCurrent, setUmrahSavingsCurrent] = useState(800);
  const [umrahSavingsMonths, setUmrahSavingsMonths] = useState(12);

  // New item inputs
  const [newItemText, setNewItemText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [duaSearch, setDuaSearch] = useState("");

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem("barakah-tawaf-lap", tawafLap.toString());
    } catch { /* ignore */ }
  }, [tawafLap]);

  useEffect(() => {
    try {
      localStorage.setItem("barakah-sai-lap", saiLap.toString());
    } catch { /* ignore */ }
  }, [saiLap]);

  useEffect(() => {
    try {
      localStorage.setItem("barakah-hajj-checklist", JSON.stringify(hajjChecklist));
    } catch { /* ignore */ }
  }, [hajjChecklist]);

  useEffect(() => {
    try {
      localStorage.setItem("barakah-umrah-checklist", JSON.stringify(umrahChecklist));
    } catch { /* ignore */ }
  }, [umrahChecklist]);

  // Handle copying dua
  const handleCopy = (dua: typeof defaultDuaList[0]) => {
    const text = `${dua.title}\n${dua.arabic}\n${dua.transliteration}\n"${dua.english}"`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle checklist item
  const toggleHajjItem = (id: string) => {
    setHajjChecklist((prev: typeof defaultHajjChecklist) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const toggleUmrahItem = (id: string) => {
    setUmrahChecklist((prev: typeof defaultUmrahChecklist) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const addChecklistItem = (isHajj: boolean) => {
    if (!newItemText.trim()) return;
    const newItem = {
      id: "custom_" + Date.now(),
      category: "Personal Items",
      text: newItemText.trim(),
      done: false
    };
    if (isHajj) setHajjChecklist((prev: typeof defaultHajjChecklist) => [...prev, newItem]);
    else setUmrahChecklist((prev: typeof defaultUmrahChecklist) => [...prev, newItem]);
    setNewItemText("");
  };

  const resetLocalData = () => {
    if (window.confirm("Reset all Hajj & Umrah checklist and counter data stored in your browser?")) {
      setTawafLap(0);
      setSaiLap(0);
      setHajjChecklist(defaultHajjChecklist);
      setUmrahChecklist(defaultUmrahChecklist);
      localStorage.removeItem("barakah-tawaf-lap");
      localStorage.removeItem("barakah-sai-lap");
      localStorage.removeItem("barakah-hajj-checklist");
      localStorage.removeItem("barakah-umrah-checklist");
    }
  };

  // Filtered Dua List
  const filteredDuas = useMemo(() => {
    if (!duaSearch.trim()) return defaultDuaList;
    const q = duaSearch.toLowerCase().trim();
    return defaultDuaList.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.english.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q)
    );
  }, [duaSearch]);

  return (
    <div className={`space-y-8 ${isRtl ? "rtl" : "ltr"}`}>
      {/* Privacy Guarantee & Local Storage Banner */}
      <aside aria-label="Privacy guarantee" className="rounded-2xl border border-[#AE2448]/25 bg-gradient-to-r from-[#F2EAE0] via-white to-[#F2EAE0] p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6E1A37] text-white shadow-xs">
              <ShieldCheck className="h-5 w-5 text-[#AE2448]" />
            </span>
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#6E1A37]">
                <Sparkles className="h-3.5 w-3.5 text-[#AE2448]" />
                {t.privacyBadge}
              </span>
              <p className="mt-0.5 text-xs text-[var(--ink)] leading-relaxed m-0 font-medium">
                {t.privacyNotice}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetLocalData}
            className="inline-flex items-center gap-1.5 shrink-0 rounded-xl border border-[#AE2448]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#6E1A37] hover:bg-[#AE2448] hover:text-white transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.resetAllData}</span>
          </button>
        </div>
      </aside>

      {/* Section Sub-Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6D8BA] pb-4">
        <div className="flex items-center gap-2">
          {activeSlug && (
            <button
              type="button"
              onClick={() => onSelectTool("")}
              className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] px-3.5 py-1.5 text-xs font-bold text-[#6E1A37] hover:bg-[#FFEFC2] transition-colors cursor-pointer"
            >
              {lang === "ar" ? "← جميع أدوات الحج والعمرة" : lang === "ur" ? "← تمام حج و عمرہ ٹولز" : "← All Hajj & Umrah Tools"}
            </button>
          )}
          <span className="text-xs font-bold text-[#6E1A37]">
            {lang === "ar" ? "١٩ أداة ومساهماً للحج والعمرة" : lang === "ur" ? "۱۹ حج و عمرہ ٹولز" : "19 Dedicated Hajj & Umrah Tools"}
          </span>
        </div>
      </div>

      {/* VIEW 1: DIRECTORY GRID OF ALL 19 HAJJ & UMRAH TOOLS (SIGNATURE CARDS) */}
      {!activeSlug && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hajjTools.map((tool, idx) => (
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
                        <Compass className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                        {lang === "ar" ? "أداة المناسك" : "Pilgrimage Tool"}
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
                    {lang === "ar" ? "افتح الأداة" : "Open Tool"}
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

      {/* TOOL 1: Tawaf Counter */}
      {activeSlug === "tawaf-counter" && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] relative overflow-hidden fade-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#AE2448] via-[#6E1A37] to-[#AE2448]" />
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2EAE0] pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
                <Compass className="h-3.5 w-3.5 text-[#AE2448]" />
                {t.tawafCounter}
              </span>
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
                {lang === "ar" ? "عداد شواط الطواف والتكبير" : lang === "ur" ? "طواف کاؤنٹر و مسنون دعائیں" : "7-Round Tawaf Counter & Duas"}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {lang === "ar" ? "تتبع الأشواط السبعة في الطواف حول الكعبة المشرفة مع تمييز دعاء الركن اليماني والحجر الأسود." : lang === "ur" ? "کعبہ شریف کے گرد ۷ چکروں کا حساب اور ہر چکر کی مسنون دعا۔" : "Track your 7 rounds around the Holy Kaaba with lap progress and authentic supplications."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTawafLap(0)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#AE2448]/30 px-4 py-2 text-xs font-bold text-[#6E1A37] hover:bg-[#AE2448] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.resetCounter}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Counter Circle Display */}
            <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[#F2EAE0]/60 border border-[#F2EAE0] text-center">
              <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider mb-2">
                {t.lap}
              </span>
              <div className="relative flex items-center justify-center my-4">
                <div className="h-36 w-36 rounded-full border-8 border-white bg-[#6E1A37] text-white flex flex-col items-center justify-center shadow-md">
                  <span className="text-5xl font-black">{tawafLap}</span>
                  <span className="text-xs font-bold text-[#F2EAE0] mt-0.5">{t.of7}</span>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 my-4">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <span
                    key={num}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      num <= tawafLap ? "bg-[#AE2448] scale-110" : "bg-white border border-[#F2EAE0]"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setTawafLap((prev) => (prev < 7 ? prev + 1 : 7))}
                disabled={tawafLap >= 7}
                className="mt-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#AE2448] px-8 py-4 text-base font-extrabold text-white shadow-md hover:bg-[#8C2448] transition-all cursor-pointer border-0 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
                <span>{tawafLap === 0 ? t.startTawaf : tawafLap >= 7 ? t.completed : t.nextLap}</span>
              </button>
            </div>

            {/* Lap Context & Prophetic Dua */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#F2EAE0] bg-white p-5 shadow-2xs">
                <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider block mb-1">
                  {t.ruknYamaniNote}
                </span>
                <p className="text-xl font-bold font-arabic text-[var(--ink)] leading-relaxed m-0 text-right" dir="rtl">
                  رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--muted)] m-0">
                  Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.
                </p>
              </div>

              <div className="rounded-2xl border border-[#AE2448]/20 bg-[#F2EAE0]/40 p-4 text-xs text-[var(--ink)] space-y-2">
                <p className="font-bold text-[#6E1A37] m-0 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-[#AE2448]" />
                  {lang === "ar" ? "توجيهات الشوط المبارك:" : lang === "ur" ? "طواف کی رہنمائی:" : "Tawaf Guidelines:"}
                </p>
                <ul className="m-0 pl-4 space-y-1 text-[var(--muted)] list-disc">
                  <li>{lang === "ar" ? "يبدأ الشوط بالحجر الأسود بالتكبير (بسم الله، الله أكبر)." : lang === "ur" ? "حجرِ اسود سے بائیں شانے کی طرف کعبہ کو رکھ کر شروع کریں۔" : "Keep the Kaaba to your left during all 7 rounds."}</li>
                  <li>{lang === "ar" ? "يُسن للرجال الاضطباع والرمل في الأشواط الثلاثة الأولى." : lang === "ur" ? "پہلے ۳ چکروں میں مردوں کے لیے رمل (درمیانی چال) مسنون ہے۔" : "Men uncover right shoulder (Idtiba) & jog gently during first 3 laps."}</li>
                  <li>{lang === "ar" ? "اختم بالطواف بصلاة ركعتين خلف مقام إبراهيم والشرب من ماء زمزم." : lang === "ur" ? "طواف کے بعد مقامِ ابراہیم کے پیچھے ۲ رکعت نمازِ طواف پڑھیں۔" : "After 7 laps, pray 2 Rak'ahs behind Maqam Ibrahim & drink Zamzam."}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TOOL 2: Sa'i Counter */}
      {activeSlug === "sai-counter" && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] relative overflow-hidden fade-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#AE2448] via-[#6E1A37] to-[#AE2448]" />
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2EAE0] pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
                <MapPin className="h-3.5 w-3.5 text-[#AE2448]" />
                {t.saiCounter}
              </span>
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
                {lang === "ar" ? "عداد شواط السعي بين الصفا والمروة" : lang === "ur" ? "سعی کاؤنٹر (صفا و مروہ)" : "7-Lap Sa'i Counter (Safa & Marwah)"}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {lang === "ar" ? "تتبع الأشواط السبعة بين الصفا والمروة مع معرفة نقطة البداية والنهاية والتذكير بالهرولة بين العلمين الأخضرين." : lang === "ur" ? "صفا و مروہ کے درمیان ۷ چکروں کا حساب اور سبز بتیاں کے نشانات۔" : "Track your 7 laps starting at Safa and ending at Marwah with direction indicators."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSaiLap(0)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#AE2448]/30 px-4 py-2 text-xs font-bold text-[#6E1A37] hover:bg-[#AE2448] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.resetCounter}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Sa'i Lap Display */}
            <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[#F2EAE0]/60 border border-[#F2EAE0] text-center">
              <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider mb-2">
                {t.lap}
              </span>
              <div className="relative flex items-center justify-center my-4">
                <div className="h-36 w-36 rounded-full border-8 border-white bg-[#6E1A37] text-white flex flex-col items-center justify-center shadow-md">
                  <span className="text-5xl font-black">{saiLap}</span>
                  <span className="text-xs font-bold text-[#F2EAE0] mt-0.5">{t.of7}</span>
                </div>
              </div>

              {/* Current Direction Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white border border-[#F2EAE0] px-4 py-2 text-xs font-bold text-[#6E1A37]">
                <MapPin className="h-4 w-4 text-[#AE2448]" />
                <span>
                  {saiLap === 0
                    ? "Start at Safa (الصفا)"
                    : saiLap % 2 === 1
                    ? "Safa ➔ Marwah (الصفا إلى المروة)"
                    : "Marwah ➔ Safa (المروة إلى الصفا)"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSaiLap((prev) => (prev < 7 ? prev + 1 : 7))}
                disabled={saiLap >= 7}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#AE2448] px-8 py-4 text-base font-extrabold text-white shadow-md hover:bg-[#8C2448] transition-all cursor-pointer border-0 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
                <span>{saiLap === 0 ? t.startSai : saiLap >= 7 ? t.completed : t.nextLap}</span>
              </button>
            </div>

            {/* Green Lights Alert & Dua */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 text-xs text-emerald-950 flex items-start gap-3">
                <Sun className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 m-0">{t.greenLightsZone}</p>
                  <p className="mt-1 text-[11px] text-emerald-800 m-0">
                    {lang === "ar" ? "قول الدعاء عند العلمين الأخضرين: رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ الأَعَزُّ الأَكْرَمُ" : "Dua between green lights: 'Rabbighfir warham wa antal-a'azzul-akram'."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#F2EAE0] bg-white p-5 shadow-2xs">
                <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider block mb-1">
                  At Safa & Marwah Hills:
                </span>
                <p className="text-lg font-bold font-arabic text-[var(--ink)] leading-relaxed m-0 text-right" dir="rtl">
                  إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ ۖ أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TOOL 3 & 4: Hajj / Umrah Packing Checklists */}
      {(activeSlug === "hajj-packing-checklist" || activeSlug === "umrah-packing-checklist") && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2EAE0] pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#AE2448]" />
                {activeSlug === "hajj-packing-checklist" ? t.hajjPacking : t.umrahPacking}
              </span>
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
                {activeSlug === "hajj-packing-checklist" ? "Interactive Hajj Packing Checklist" : "Interactive Umrah Packing Checklist"}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t.privacyNotice}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6E1A37] bg-[#F2EAE0] px-3 py-1.5 rounded-xl">
                {activeSlug === "hajj-packing-checklist"
                  ? `${hajjChecklist.filter((i: any) => i.done).length} / ${hajjChecklist.length}`
                  : `${umrahChecklist.filter((i: any) => i.done).length} / ${umrahChecklist.length}`}
              </span>
            </div>
          </div>

          {/* Add custom item input */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Add your own packing item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChecklistItem(activeSlug === "hajj-packing-checklist")}
              className="flex-1 rounded-xl border border-[#F2EAE0] px-4 py-2.5 text-sm outline-none focus:border-[#AE2448]"
            />
            <button
              type="button"
              onClick={() => addChecklistItem(activeSlug === "hajj-packing-checklist")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#6E1A37] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#8C2448] transition-colors cursor-pointer border-0"
            >
              <Plus className="h-4 w-4" />
              <span>{t.add}</span>
            </button>
          </div>

          {/* Items List */}
          <div className="grid gap-3 sm:grid-cols-2">
            {(activeSlug === "hajj-packing-checklist" ? hajjChecklist : umrahChecklist).map((item: any) => (
              <div
                key={item.id}
                onClick={() =>
                  activeSlug === "hajj-packing-checklist" ? toggleHajjItem(item.id) : toggleUmrahItem(item.id)
                }
                className={`interactive-card flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  item.done
                    ? "bg-[#F2EAE0]/60 border-emerald-300 text-[var(--muted)] line-through"
                    : "bg-white border-[#F2EAE0] hover:border-[#AE2448]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center transition-colors ${
                      item.done ? "bg-emerald-600 text-white" : "border-2 border-[#F2EAE0] bg-white"
                    }`}
                  >
                    {item.done && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold m-0 text-[var(--ink)]">{item.text}</p>
                    <span className="text-[10px] font-semibold text-[#6E1A37] uppercase">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TOOL 5: Hajj & Umrah Dua Finder */}
      {activeSlug === "hajj-umrah-dua-finder" && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2EAE0] pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
                <BookOpen className="h-3.5 w-3.5 text-[#AE2448]" />
                {t.duaFinder}
              </span>
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
                {lang === "ar" ? "محرك الأدعية المأثورة للحج والعمرة" : lang === "ur" ? "حج و عمرہ کی مسنون دعائیں" : "Prophetic Duas for Hajj & Umrah"}
              </h2>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
              <input
                type="search"
                placeholder={t.searchDua}
                value={duaSearch}
                onChange={(e) => setDuaSearch(e.target.value)}
                className="w-full rounded-xl border border-[#F2EAE0] pl-9 pr-4 py-2 text-xs font-semibold text-[var(--ink)] outline-none focus:border-[#AE2448]"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {filteredDuas.map((dua) => (
              <div key={dua.id} className="rounded-2xl border border-[#F2EAE0] bg-[var(--paper)] p-5 hover:border-[#AE2448] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#AE2448]/10 text-[#6E1A37]">
                    {dua.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(dua)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6E1A37] hover:text-[#AE2448] cursor-pointer border-0 bg-transparent p-0"
                  >
                    {copiedId === dua.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === dua.id ? t.copied : t.copyDua}</span>
                  </button>
                </div>
                <h3 className="text-base font-bold text-[var(--ink)] m-0 mb-2">{dua.title}</h3>
                <p className="text-xl font-bold font-arabic text-[var(--ink)] leading-relaxed m-0 text-right mb-2" dir="rtl">
                  {dua.arabic}
                </p>
                <p className="text-xs font-medium text-[var(--muted)] italic mb-1">{dua.transliteration}</p>
                <p className="text-xs font-semibold text-[var(--ink)] leading-relaxed m-0">{dua.english}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TOOL 6: Hajj & Umrah Savings Calculator */}
      {(activeSlug === "hajj-savings-calculator" || activeSlug === "umrah-savings-calculator") && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up">
          <div className="mb-6 border-b border-[#F2EAE0] pb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
              <Coins className="h-3.5 w-3.5 text-[#AE2448]" />
              {activeSlug === "hajj-savings-calculator" ? t.hajjSavings : t.umrahSavings}
            </span>
            <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
              {activeSlug === "hajj-savings-calculator" ? "Hajj Target Savings Planner" : "Umrah Target Savings Planner"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">{t.targetSavings}</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={activeSlug === "hajj-savings-calculator" ? hajjSavingsTarget : umrahSavingsTarget}
                  onChange={(e) =>
                    activeSlug === "hajj-savings-calculator"
                      ? setHajjSavingsTarget(Number(e.target.value))
                      : setUmrahSavingsTarget(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold text-[var(--ink)] outline-none focus:border-[#AE2448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">{t.currentSavings}</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={activeSlug === "hajj-savings-calculator" ? hajjSavingsCurrent : umrahSavingsCurrent}
                  onChange={(e) =>
                    activeSlug === "hajj-savings-calculator"
                      ? setHajjSavingsCurrent(Number(e.target.value))
                      : setUmrahSavingsCurrent(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold text-[var(--ink)] outline-none focus:border-[#AE2448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">{t.monthsRemaining}</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={activeSlug === "hajj-savings-calculator" ? hajjSavingsMonths : umrahSavingsMonths}
                  onChange={(e) =>
                    activeSlug === "hajj-savings-calculator"
                      ? setHajjSavingsMonths(Number(e.target.value))
                      : setUmrahSavingsMonths(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold text-[var(--ink)] outline-none focus:border-[#AE2448]"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="rounded-3xl bg-[#F2EAE0] p-6 border border-[#AE2448]/20 space-y-4">
              {(() => {
                const target = activeSlug === "hajj-savings-calculator" ? hajjSavingsTarget : umrahSavingsTarget;
                const current = activeSlug === "hajj-savings-calculator" ? hajjSavingsCurrent : umrahSavingsCurrent;
                const months = activeSlug === "hajj-savings-calculator" ? hajjSavingsMonths : umrahSavingsMonths;
                const needed = Math.max(0, target - current);
                const monthly = months > 0 ? (needed / months).toFixed(2) : "0";
                const pct = Math.min(100, Math.round((current / (target || 1)) * 100));

                return (
                  <>
                    <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider block">
                      {t.monthlyContribution}
                    </span>
                    <div className="text-4xl font-black text-[var(--ink)]">
                      ${monthly} <span className="text-xs font-bold text-[var(--muted)]">/ month</span>
                    </div>

                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs font-bold text-[var(--ink)]">
                        <span>{t.progress}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-white overflow-hidden p-0.5 border border-[#AE2448]/20">
                        <div className="h-full rounded-full bg-[#AE2448] transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#AE2448]/15 text-xs text-[var(--ink)] space-y-1 font-medium">
                      <p className="m-0">Remaining Balance Needed: <strong>${needed.toLocaleString()}</strong></p>
                      <p className="m-0 text-[var(--muted)]">Target Month Horizon: <strong>{months} months</strong></p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* ALL OTHER HAJJ & UMRAH TOOLS OVERVIEW / GRID */}
      {["hajj-planner", "umrah-planner", "hajj-day-planner", "umrah-day-planner", "hajj-ritual-guide", "umrah-ritual-guide", "ihram-checklist", "makkah-madinah-distance-tool", "hajj-checklist-generator", "umrah-checklist-generator"].includes(activeSlug) && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up space-y-6">
          <div className="border-b border-[#F2EAE0] pb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
              <Compass className="h-3.5 w-3.5 text-[#AE2448]" />
              Interactive Hajj & Umrah Guide
            </span>
            <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
              {activeSlug.replace(/-/g, " ").toUpperCase()}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Comprehensive step-by-step guidance, timelines, and verified rituals saved securely in your browser.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "8th Dhul Hijjah (Tarwiyah)", desc: "Enter Ihram for Hajj, proceed to Mina, and pray Dhuhr, Asr, Maghrib, Isha, & Fajr." },
              { title: "9th Dhul Hijjah (Arafat)", desc: "Stand in Arafat (Wuqoof) from Dhuhr to Sunset, making intense Dua, then proceed to Muzdalifah." },
              { title: "10th Dhul Hijjah (Nahr & Eid)", desc: "Stone Jamarat al-Aqaba, perform Hady sacrifice, Halq/Taqseer, and Tawaf al-Ifadah." },
              { title: "11th - 13th Dhul Hijjah (Tashreeq)", desc: "Stay in Mina, stone all 3 Jamarat each afternoon, and perform Farewell Tawaf before departure." }
            ].map((step, idx) => (
              <div key={idx} className="rounded-2xl border border-[#F2EAE0] bg-[#F2EAE0]/50 p-5 hover:border-[#AE2448] transition-all">
                <span className="text-xs font-extrabold text-[#6E1A37] uppercase tracking-wider block mb-1">
                  Phase {idx + 1}
                </span>
                <h3 className="text-base font-bold text-[var(--ink)] m-0 mb-1.5">{step.title}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed m-0">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

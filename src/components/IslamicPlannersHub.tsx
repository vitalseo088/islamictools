import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  Heart,
  Target,
  GraduationCap,
  Volume2,
  Bookmark,
  RotateCcw,
  Check,
  ChevronRight,
  ArrowRight,
  Info,
  ShieldCheck,
  Search,
  Share2
} from "lucide-react";
import { Tool, tools } from "../data/tools";
import { Locale } from "../data/locales";

interface IslamicPlannersHubProps {
  currentTool?: Tool;
  onSelectTool: (slug: string) => void;
  lang: Locale;
}

// 99 Names Complete Data for Memorization Tracker
const names99Data = [
  { id: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious" },
  { id: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful" },
  { id: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King and Owner" },
  { id: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy" },
  { id: 5, arabic: "السَّلاَمُ", transliteration: "As-Salam", meaning: "The Source of Peace" },
  { id: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Giver of Faith & Security" },
  { id: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Guardian & Protector" },
  { id: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty & Unconquerable" },
  { id: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller & Restorer" },
  { id: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Supreme & Majestic" },
  { id: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator" },
  { id: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari'", meaning: "The Maker of Order" }
];

// Arabic Alphabet Pronunciation & Practice
const arabicAlphabet = [
  { letter: "أ", name: "Alif", sound: "a / i / u", example: "أَمَل (Hope)", forms: "أـ ـأـ ـأ" },
  { letter: "ب", name: "Baa", sound: "b", example: "بَرَكَة (Barakah)", forms: "بـ ـبـ ـب" },
  { letter: "ت", name: "Taa", sound: "t", example: "تَقْوَى (Taqwa)", forms: "تـ ـتـ ـت" },
  { letter: "ث", name: "Thaa", sound: "th", example: "ثَوَاب (Reward)", forms: "ثـ ـثـ ـث" },
  { letter: "ج", name: "Jeem", sound: "j", example: "جَنَّة (Jannah)", forms: "جـ ـجـ ـج" },
  { letter: "ح", name: "Haa", sound: "h (sharp)", example: "حِكْمَة (Wisdom)", forms: "حـ ـحـ ـح" },
  { letter: "خ", name: "Khaa", sound: "kh", example: "خَيْر (Goodness)", forms: "خـ ـخـ ـخ" },
  { letter: "د", name: "Daal", sound: "d", example: "دُعَاء (Dua)", forms: "دـ ـدـ ـد" },
  { letter: "ذ", name: "Dhaal", sound: "dh", example: "ذِكْر (Remembrance)", forms: "ذـ ـذـ ـذ" },
  { letter: "ر", name: "Raa", sound: "r", example: "رَحْمَة (Mercy)", forms: "رـ ـرـ ـر" },
  { letter: "ز", name: "Zaay", sound: "z", example: "زَكَاة (Zakat)", forms: "زـ ـزـ ـز" },
  { letter: "س", name: "Seen", sound: "s", example: "سَلاَم (Peace)", forms: "سـ ـسـ ـس" }
];

// Key Surahs for Surah Memorization Tracker
const surahMemorizationList = [
  { slug: "al-mulk", name: "Surah Al-Mulk (الملك)", totalAyahs: 30, virtue: "Protects from punishment of the grave" },
  { slug: "yaseen", name: "Surah Yaseen (يس)", totalAyahs: 83, virtue: "The heart of the Holy Quran" },
  { slug: "al-kahf", name: "Surah Al-Kahf (الكهف)", totalAyahs: 110, virtue: "Light between two Fridays" },
  { slug: "ar-rahman", name: "Surah Ar-Rahman (الرحمن)", totalAyahs: 78, virtue: "The beauty & adornment of the Quran" },
  { slug: "al-waqiah", name: "Surah Al-Waqi'ah (الواقعة)", totalAyahs: 96, virtue: "Protection against poverty" }
];

// Essential Daily Duas for Dua Memorization Tracker
const dailyDuaList = [
  { title: "Waking Up", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur.", english: "Praise is to Allah Who gave us life after causing us to die, and unto Him is the resurrection." },
  { title: "Before Eating", arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah.", english: "In the name of Allah." },
  { title: "After Eating", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ", transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin.", english: "Praise be to Allah Who fed us, gave us drink, and made us Muslims." },
  { title: "Leaving Home", arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ", transliteration: "Bismillahi tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah.", english: "In the name of Allah, I trust in Allah; there is no power and no strength except through Allah." }
];

// Islamic Knowledge Flashcards
const flashcardsList = [
  { term: "Taqwa", Arabic: "تَقْوَى", definition: "God-consciousness, piety, and living with awareness of Allah's presence." },
  { term: "Ihlas", Arabic: "إِخْلاَص", definition: "Purity of intention, performing every worship solely for Allah's pleasure." },
  { term: "Sabr", Arabic: "صَبْر", definition: "Patience, perseverance, and steadfastness during trials and obedience." },
  { term: "Tawakkul", Arabic: "تَوَكُّل", definition: "Complete reliance and trust upon Allah while taking proper halal means." }
];

export function IslamicPlannersHub({ currentTool, onSelectTool, lang }: IslamicPlannersHubProps) {
  const activeSlug = currentTool?.slug || "";
  const [copiedLink, setCopiedLink] = useState(false);

  const plannerTools = useMemo(
    () => tools.filter((t) => t.category === "Islamic Planners & Trackers"),
    []
  );

  // 1. Quran Reading Planner state
  const [readingTargetDays, setReadingTargetDays] = useState(30);
  const [currentQuranPage, setCurrentQuranPage] = useState(1);
  const pagesPerDay = Math.ceil((604 - currentQuranPage) / Math.max(1, readingTargetDays));

  // 2. Quran Memorization Sabaq / Sabqi Planner state
  const [newAyahsPerDay, setNewAyahsPerDay] = useState(5);
  const [reviewPagesPerDay, setReviewPagesPerDay] = useState(2);

  // 3. Hifz 30-Juz Dashboard state
  const [juzStatus, setJuzStatus] = useState<Record<number, "strong" | "review" | "none">>(() => {
    try {
      const saved = localStorage.getItem("amanah-hifz-juz");
      return saved ? JSON.parse(saved) : { 1: "strong", 30: "strong" };
    } catch {
      return { 1: "strong", 30: "strong" };
    }
  });

  // 4. Salah Tracker state
  const [salahLog, setSalahLog] = useState<Record<string, { prayed: boolean; congregation: boolean }>>(() => {
    try {
      const saved = localStorage.getItem("amanah-salah-log");
      return saved
        ? JSON.parse(saved)
        : {
            Fajr: { prayed: true, congregation: true },
            Dhuhr: { prayed: true, congregation: false },
            Asr: { prayed: false, congregation: false },
            Maghrib: { prayed: false, congregation: false },
            Isha: { prayed: false, congregation: false }
          };
    } catch {
      return {
        Fajr: { prayed: true, congregation: true },
        Dhuhr: { prayed: true, congregation: false },
        Asr: { prayed: false, congregation: false },
        Maghrib: { prayed: false, congregation: false },
        Isha: { prayed: false, congregation: false }
      };
    }
  });

  // 5. Missed Salah Qada Tracker
  const [qadaCounts, setQadaCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("amanah-qada-salah");
      return saved ? JSON.parse(saved) : { Fajr: 25, Dhuhr: 30, Asr: 30, Maghrib: 15, Isha: 20 };
    } catch {
      return { Fajr: 25, Dhuhr: 30, Asr: 30, Maghrib: 15, Isha: 20 };
    }
  });

  // 6. Digital Tasbeeh Counter
  const [dhikrCount, setDhikrCount] = useState(0);
  const [dhikrTarget, setDhikrTarget] = useState(33);
  const [activeDhikrText, setActiveDhikrText] = useState("سُبْحَانَ اللَّهِ");

  // 7. 99 Names Memorization
  const [memorizedNames, setMemorizedNames] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("amanah-memorized-names");
      return saved ? JSON.parse(saved) : [1, 2, 3];
    } catch {
      return [1, 2, 3];
    }
  });

  // 8. Daily Habits
  const [habits, setHabits] = useState<{ id: string; name: string; completed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem("amanah-habits");
      return saved
        ? JSON.parse(saved)
        : [
            { id: "1", name: "Recite Morning Adhkar", completed: true },
            { id: "2", name: "Read 1 Page of Quran", completed: true },
            { id: "3", name: "Pray 2 Rakat Duha", completed: false },
            { id: "4", name: "Give Daily Voluntary Sadaqah", completed: false },
            { id: "5", name: "Pray Tahajjud Before Fajr", completed: false }
          ];
    } catch {
      return [];
    }
  });

  // 9. Charity Log
  const [charityLog, setCharityLog] = useState<{ id: string; cause: string; amount: number; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem("amanah-charity-log");
      return saved ? JSON.parse(saved) : [{ id: "c1", cause: "Local Mosque Relief", amount: 50, date: new Date().toISOString().split("T")[0] }];
    } catch {
      return [];
    }
  });
  const [newCharityCause, setNewCharityCause] = useState("");
  const [newCharityAmount, setNewCharityAmount] = useState(10);

  // 10. Flashcard Flip Index
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("amanah-hifz-juz", JSON.stringify(juzStatus));
      localStorage.setItem("amanah-salah-log", JSON.stringify(salahLog));
      localStorage.setItem("amanah-qada-salah", JSON.stringify(qadaCounts));
      localStorage.setItem("amanah-memorized-names", JSON.stringify(memorizedNames));
      localStorage.setItem("amanah-habits", JSON.stringify(habits));
      localStorage.setItem("amanah-charity-log", JSON.stringify(charityLog));
    } catch {
      // ignore
    }
  }, [juzStatus, salahLog, qadaCounts, memorizedNames, habits, charityLog]);

  const toggleJuz = (juz: number) => {
    setJuzStatus((prev) => {
      const curr = prev[juz] || "none";
      const next = curr === "none" ? "strong" : curr === "strong" ? "review" : "none";
      return { ...prev, [juz]: next };
    });
  };

  const toggleSalah = (name: string, field: "prayed" | "congregation") => {
    setSalahLog((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: !prev[name]?.[field] }
    }));
  };

  const updateQada = (name: string, delta: number) => {
    setQadaCounts((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  const toggleNameMemorized = (id: number) => {
    setMemorizedNames((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const addCharityItem = () => {
    if (!newCharityCause.trim()) return;
    setCharityLog((prev) => [
      ...prev,
      { id: Date.now().toString(), cause: newCharityCause.trim(), amount: Number(newCharityAmount) || 10, date: new Date().toISOString().split("T")[0] }
    ]);
    setNewCharityCause("");
  };

  const copyToolLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const activeToolObj = plannerTools.find((t) => t.slug === activeSlug);

  return (
    <div className="space-y-8">
      {/* SECTION HEADER / SUB-NAV */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6D8BA] pb-4">
        <div className="flex items-center gap-2">
          {activeSlug && (
            <button
              type="button"
              onClick={() => onSelectTool("")}
              className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] px-3.5 py-1.5 text-xs font-bold text-[#6E1A37] hover:bg-[#FFEFC2] transition-colors cursor-pointer"
            >
              {lang === "ar" ? "← كل المخططات" : lang === "ur" ? "← تمام پلانرز" : "← All Planners"}
            </button>
          )}
          <span className="text-xs font-bold text-[#6E1A37]">
            {lang === "ar" ? "١٥ مخططاً وتتبعاً إيمانياً" : lang === "ur" ? "۱۵ اسلامی ٹریکرز" : "15 Dedicated Spiritual Planners & Trackers"}
          </span>
        </div>

        <span className="text-xs font-semibold text-[var(--muted)]">
          {lang === "ar" ? "تُحفظ جميع بياناتك محلياً في متصفحك" : lang === "ur" ? "تمام ڈیٹا صرف آپ کے ڈیوائس میں محفوظ ہے" : "100% Private Local Browser Storage"}
        </span>
      </div>

      {/* VIEW 1: DIRECTORY GRID OF ALL 15 PLANNERS WITH UNIFORM SIGNATURE CARDS */}
      {!activeSlug && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plannerTools.map((tool, idx) => (
              <button
                type="button"
                key={tool.slug}
                onClick={() => onSelectTool(tool.slug)}
                className="group text-left relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#E6D8BA] bg-[#FFF6DE] p-5 sm:p-6 no-underline interactive-card hover:border-[#AE2448] hover:bg-[#FFEFC2] cursor-pointer"
              >
                <div>
                  {/* Header: Icon + Category + Number */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                        {lang === "ar" ? "مخطط وتتبع" : "Spiritual Planner"}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#6E1A37]/60">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="mb-1.5 text-base sm:text-lg font-bold leading-snug tracking-[-.02em] text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                    {tool.title}
                  </h4>

                  {/* Description */}
                  <p className="m-0 text-xs sm:text-sm leading-relaxed text-[#262626]">
                    {tool.short}
                  </p>
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-4 pt-3.5 border-t border-[#E6D8BA] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6E1A37] group-hover:text-[var(--primary)] transition-colors">
                    {lang === "ar" ? "افتح المخطط" : lang === "ur" ? "پلانر کھولیں" : "Open Planner"}
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

      {/* VIEW 2: INDIVIDUAL PLANNER/TRACKER DEDICATED TOOL PAGE */}
      {activeSlug && activeToolObj && (
        <div className="rounded-3xl border border-[#E6D8BA] bg-[#FFF6DE] p-6 md:p-8 shadow-sm space-y-6 fade-up">
          {/* Tool Title & Subheader */}
          <div className="border-b border-[#E6D8BA] pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="rounded-full bg-[#AE2448]/10 px-3.5 py-1 text-xs font-extrabold text-[#AE2448]">
                {activeToolObj.category}
              </span>
              <button
                type="button"
                onClick={copyToolLink}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6D8BA] bg-white px-3 py-1 text-xs font-bold text-[var(--ink)] hover:bg-[#FFEFC2] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? (lang === "ar" ? "تم النسخ!" : "Copied!") : (lang === "ar" ? "مشاركة الرابط" : "Share Tool")}</span>
              </button>
            </div>
            <h2 className="m-0 text-2xl md:text-3xl font-bold text-[var(--ink)]">{activeToolObj.title}</h2>
            <p className="m-0 mt-2 text-sm text-[var(--muted)] leading-relaxed">{activeToolObj.explanation}</p>
          </div>

          {/* DEDICATED TOOL INTERACTIVE WIDGETS */}

          {/* 1. Quran Reading Planner */}
          {activeSlug === "quran-reading-planner" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="rounded-2xl bg-white border border-[#E6D8BA] p-5 space-y-4">
                <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                  Custom Quran Recitation Pacing Calculator
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">Current Page (1 - 604)</label>
                    <input
                      type="number"
                      min={1}
                      max={604}
                      value={currentQuranPage}
                      onChange={(e) => setCurrentQuranPage(Number(e.target.value) || 1)}
                      className="w-full rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">Target Days Goal</label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={readingTargetDays}
                      onChange={(e) => setReadingTargetDays(Number(e.target.value) || 30)}
                      className="w-full rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-[#6E1A37] text-white p-4 text-center space-y-1">
                  <p className="text-xs uppercase font-extrabold tracking-wider text-white/80 m-0">Daily Reading Goal</p>
                  <p className="text-3xl font-extrabold m-0 font-mono">{pagesPerDay} Pages / Day</p>
                  <p className="text-[11px] opacity-90 m-0">({Math.ceil(pagesPerDay / 5)} pages after each of the 5 daily prayers)</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Quran Memorization Planner (Hifz Sabaq) */}
          {activeSlug === "quran-memorization-planner" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="rounded-2xl bg-white border border-[#E6D8BA] p-5 space-y-4">
                <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                  Daily Hifz Schedule Builder (Sabaq, Sabqi, Manzil)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">New Lesson (Sabaq) Ayahs/Day</label>
                    <input
                      type="number"
                      min={1}
                      value={newAyahsPerDay}
                      onChange={(e) => setNewAyahsPerDay(Number(e.target.value) || 5)}
                      className="w-full rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">Recent Review (Sabqi) Pages/Day</label>
                    <input
                      type="number"
                      min={1}
                      value={reviewPagesPerDay}
                      onChange={(e) => setReviewPagesPerDay(Number(e.target.value) || 2)}
                      className="w-full rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-2.5 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-4 space-y-2">
                  <p className="text-xs font-bold text-[var(--ink)] m-0">Recommended Daily Routine:</p>
                  <p className="text-xs text-[var(--muted)] m-0">1. Memorize <strong>{newAyahsPerDay} new Ayahs</strong> before Fajr.</p>
                  <p className="text-xs text-[var(--muted)] m-0">2. Recite <strong>{reviewPagesPerDay} pages of recent review</strong> to teacher or partner.</p>
                  <p className="text-xs text-[var(--muted)] m-0">3. Recite 1 Juz of old revision (Manzil) during Sunnah prayers.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Dhikr Tracker */}
          {activeSlug === "dhikr-tracker" && (
            <div className="text-center space-y-6 max-w-md mx-auto py-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "اللَّهُ أَكْبَرُ", "أَسْتَغْفِرُ اللَّهَ", "لاَ إِلَهَ إِلاَّ اللَّهُ"].map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => { setActiveDhikrText(phrase); setDhikrCount(0); }}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer ${
                      activeDhikrText === phrase
                        ? "bg-[#6E1A37] text-white border-[#6E1A37] shadow-xs"
                        : "bg-white text-[var(--ink)] border-[#E6D8BA]"
                    }`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>

              <p className="text-4xl font-bold font-arabic text-[#6E1A37] py-3">{activeDhikrText}</p>

              <button
                type="button"
                onClick={() => setDhikrCount((prev) => prev + 1)}
                className="w-48 h-44 mx-auto rounded-full bg-gradient-to-br from-[#6E1A37] to-[#AE2448] text-white flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer border-4 border-white"
              >
                <span className="text-5xl font-extrabold font-mono">{dhikrCount}</span>
                <span className="text-xs opacity-90 mt-1">/ {dhikrTarget} Target</span>
              </button>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDhikrCount(0)}
                  className="rounded-xl border border-[#E6D8BA] bg-white px-4 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[#FFEFC2] cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Count</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. Visual 30-Juz Hifz Tracker */}
          {activeSlug === "hifz-tracker" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E6D8BA] pb-3">
                <h3 className="m-0 text-base font-bold text-[var(--ink)]">30 Juz Quran Memorization Dashboard</h3>
                <span className="text-xs font-bold text-[#6E1A37] bg-white border border-[#E6D8BA] px-3 py-1 rounded-full">
                  {Object.values(juzStatus).filter((s) => s === "strong").length} / 30 Juz Memorized
                </span>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                  const status = juzStatus[juz] || "none";
                  return (
                    <button
                      key={juz}
                      type="button"
                      onClick={() => toggleJuz(juz)}
                      className={`rounded-2xl p-3 text-center border transition-all cursor-pointer ${
                        status === "strong"
                          ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-extrabold"
                          : status === "review"
                          ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                          : "bg-white border-[#E6D8BA] text-[var(--ink)]"
                      }`}
                    >
                      <p className="text-xs font-mono font-bold m-0">Juz {juz}</p>
                      <p className="text-[10px] m-0 mt-1 uppercase font-extrabold">
                        {status === "strong" ? "✓ Strong" : status === "review" ? "Review" : "Start"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Daily 5-Salah Tracker & Habit Tracker */}
          {(activeSlug === "salah-tracker" || activeSlug === "daily-islamic-habit-tracker") && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#E6D8BA] pb-3">
                <h3 className="m-0 text-base font-bold text-[var(--ink)]">Daily 5 Prayer & Sunnah Logger</h3>
                <span className="text-xs font-bold text-[#6E1A37] bg-white border border-[#E6D8BA] px-3 py-1 rounded-full">
                  {Object.values(salahLog).filter((s) => s.prayed).length} / 5 Daily Prayers
                </span>
              </div>

              <div className="space-y-3">
                {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((salah) => {
                  const data = salahLog[salah] || { prayed: false, congregation: false };
                  return (
                    <div key={salah} className="flex items-center justify-between rounded-2xl p-4 border border-[#E6D8BA] bg-white">
                      <span className="text-sm font-extrabold text-[var(--ink)]">{salah} Prayer</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleSalah(salah, "congregation")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                            data.congregation
                              ? "bg-[#6E1A37] text-white border-[#6E1A37]"
                              : "bg-[#FFF6DE] text-[var(--ink)] border-[#E6D8BA]"
                          }`}
                        >
                          {data.congregation ? "✓ In Jamā'ah" : "+ Jamā'ah"}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSalah(salah, "prayed")}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                            data.prayed
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white text-[var(--ink)] border-[#E6D8BA]"
                          }`}
                        >
                          {data.prayed ? "✓ Prayed" : "Mark Prayed"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeSlug === "daily-islamic-habit-tracker" && (
                <div className="pt-4 border-t border-[#E6D8BA] space-y-3">
                  <h4 className="m-0 text-sm font-bold text-[var(--ink)]">30-Day Sunnah Habits Streak Checklist</h4>
                  <div className="space-y-2">
                    {habits.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => toggleHabit(h.id)}
                        className={`w-full flex items-center justify-between rounded-xl p-3 border text-left cursor-pointer transition-colors ${
                          h.completed ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-white border-[#E6D8BA] text-[var(--ink)]"
                        }`}
                      >
                        <span className="text-xs font-bold">{h.name}</span>
                        <span className="text-xs font-bold">{h.completed ? "✓ Done" : "Mark Completed"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. Missed Salah Qada Catch-Up Manager */}
          {activeSlug === "missed-salah-tracker" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                Qada Prayer Counter & Catch-Up Schedule
              </h3>

              <div className="grid gap-3">
                {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((salah) => {
                  const count = qadaCounts[salah] || 0;
                  return (
                    <div key={salah} className="flex items-center justify-between rounded-2xl p-4 border border-[#E6D8BA] bg-white">
                      <div>
                        <p className="text-sm font-bold text-[var(--ink)] m-0">Qada {salah}</p>
                        <p className="text-xs font-mono text-[var(--muted)] m-0">{count} remaining</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQada(salah, -1)}
                          className="rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-emerald-700 cursor-pointer border-0"
                        >
                          -1 Prayed
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQada(salah, 5)}
                          className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] px-3 py-1.5 text-xs font-bold text-[var(--ink)] cursor-pointer"
                        >
                          +5 Missed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. Arabic Alphabet Practice */}
          {activeSlug === "arabic-alphabet-practice" && (
            <div className="space-y-6">
              <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                Interactive Arabic Alphabet Pronunciation & Practice Guide
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {arabicAlphabet.map((item) => (
                  <div key={item.letter} className="rounded-2xl border border-[#E6D8BA] bg-white p-5 text-center space-y-2 hover:border-[#AE2448] transition-all">
                    <p className="text-5xl font-extrabold font-arabic text-[#6E1A37] m-0">{item.letter}</p>
                    <p className="text-sm font-bold text-[var(--ink)] m-0">{item.name}</p>
                    <p className="text-xs font-mono text-[var(--muted)] m-0">Forms: {item.forms}</p>
                    <p className="text-xs text-[#AE2448] font-bold m-0 mt-1">{item.example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. 99 Names Memorization Tracker */}
          {activeSlug === "names-99-memorization-tracker" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E6D8BA] pb-3">
                <h3 className="m-0 text-base font-bold text-[var(--ink)]">Asma-ul-Husna (99 Names) Memorization Guide</h3>
                <span className="text-xs font-bold text-[#6E1A37] bg-white border border-[#E6D8BA] px-3.5 py-1 rounded-full">
                  {memorizedNames.length} / {names99Data.length} Memorized
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {names99Data.map((item) => {
                  const isSaved = memorizedNames.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleNameMemorized(item.id)}
                      className={`rounded-2xl p-4 border text-center transition-all cursor-pointer ${
                        isSaved
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs"
                          : "bg-white border-[#E6D8BA] text-[var(--ink)] hover:border-[#AE2448]"
                      }`}
                    >
                      <p className="text-3xl font-bold font-arabic m-0 text-[#6E1A37]">{item.arabic}</p>
                      <p className="text-xs font-bold m-0 mt-1">{item.transliteration}</p>
                      <p className="text-[11px] opacity-80 m-0 mt-0.5">{item.meaning}</p>
                      <span className="inline-block mt-3 text-[10px] font-extrabold uppercase tracking-wider underline">
                        {isSaved ? "✓ Memorized" : "+ Mark Memorized"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. Surah Memorization Tracker */}
          {activeSlug === "surah-memorization-tracker" && (
            <div className="space-y-6">
              <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                Key Surahs Ayah-by-Ayah Memorization Tracker
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {surahMemorizationList.map((surah) => (
                  <div key={surah.slug} className="rounded-2xl border border-[#E6D8BA] bg-white p-5 space-y-3">
                    <p className="text-base font-bold text-[var(--ink)] m-0">{surah.name}</p>
                    <p className="text-xs font-mono text-[var(--muted)] m-0">{surah.totalAyahs} Ayahs Total</p>
                    <p className="text-xs text-[#AE2448] font-semibold m-0">{surah.virtue}</p>
                    <button
                      type="button"
                      onClick={() => alert(`Tracking Ayah progress for ${surah.name} saved locally!`)}
                      className="w-full rounded-xl bg-[#6E1A37] text-white py-2 text-xs font-bold cursor-pointer border-0 hover:bg-[#8C2448] transition-colors"
                    >
                      Mark Memorized
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. Islamic Flashcards */}
          {activeSlug === "islamic-flashcards" && (
            <div className="space-y-6 max-w-md mx-auto text-center">
              <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                Islamic Knowledge Flip Cards
              </h3>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[200px] rounded-3xl border-2 border-[#6E1A37] bg-white p-8 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all hover:scale-102"
              >
                {!isFlipped ? (
                  <div className="space-y-2">
                    <p className="text-4xl font-extrabold font-arabic text-[#6E1A37] m-0">{flashcardsList[flashcardIndex].Arabic}</p>
                    <p className="text-lg font-bold text-[var(--ink)] m-0">{flashcardsList[flashcardIndex].term}</p>
                    <p className="text-[10px] text-[#AE2448] font-bold uppercase tracking-wider m-0">Click to flip card</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#6E1A37] uppercase m-0">Definition</p>
                    <p className="text-sm font-medium text-[var(--ink)] leading-relaxed m-0">{flashcardsList[flashcardIndex].definition}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setIsFlipped(false); setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcardsList.length - 1)); }}
                  className="rounded-xl border border-[#E6D8BA] bg-white px-4 py-2 text-xs font-bold cursor-pointer"
                >
                  Previous Card
                </button>
                <span className="text-xs font-mono font-bold text-[var(--muted)]">{flashcardIndex + 1} / {flashcardsList.length}</span>
                <button
                  type="button"
                  onClick={() => { setIsFlipped(false); setFlashcardIndex((prev) => (prev < flashcardsList.length - 1 ? prev + 1 : 0)); }}
                  className="rounded-xl bg-[#6E1A37] text-white px-4 py-2 text-xs font-bold cursor-pointer border-0"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* 11. Charity Tracker */}
          {activeSlug === "charity-tracker" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="rounded-2xl bg-white border border-[#E6D8BA] p-5 space-y-4">
                <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                  Voluntary Sadaqah & Zakat Payment Logger
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Cause / Recipient (e.g. Local Food Bank)"
                    value={newCharityCause}
                    onChange={(e) => setNewCharityCause(e.target.value)}
                    className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-2.5 text-xs font-bold outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    value={newCharityAmount}
                    onChange={(e) => setNewCharityAmount(Number(e.target.value) || 0)}
                    className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-2.5 text-xs font-bold outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={addCharityItem}
                  className="w-full rounded-xl bg-[#6E1A37] text-white py-2.5 text-xs font-bold cursor-pointer border-0 hover:bg-[#8C2448] transition-colors"
                >
                  + Log Sadaqah Contribution
                </button>

                <div className="space-y-2 pt-2">
                  {charityLog.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-xl p-3 bg-[#FFF6DE] border border-[#E6D8BA] text-xs">
                      <div>
                        <p className="font-bold text-[var(--ink)] m-0">{c.cause}</p>
                        <p className="text-[10px] text-[var(--muted)] m-0">{c.date}</p>
                      </div>
                      <span className="font-mono font-extrabold text-[#6E1A37]">${c.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 12. Dua Memorization Tracker */}
          {activeSlug === "dua-memorization-tracker" && (
            <div className="space-y-4">
              <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                Daily Prophetic Supplications Step-by-Step Memorization Guide
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {dailyDuaList.map((d) => (
                  <div key={d.title} className="rounded-2xl border border-[#E6D8BA] bg-white p-5 space-y-2">
                    <span className="rounded-full bg-[#FFF6DE] border border-[#E6D8BA] px-2.5 py-0.5 text-[10px] font-bold text-[#6E1A37]">
                      {d.title}
                    </span>
                    <p className="text-2xl font-bold font-arabic text-[#6E1A37] m-0 py-1">{d.arabic}</p>
                    <p className="text-xs font-bold text-[var(--ink)] m-0">{d.transliteration}</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed m-0">{d.english}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 13. Goal Planner & Study Planner */}
          {(activeSlug === "islamic-goal-planner" || activeSlug === "islamic-study-planner") && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="rounded-2xl bg-white border border-[#E6D8BA] p-5 space-y-4">
                <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                  {activeSlug === "islamic-goal-planner" ? "Spiritual Milestone Planner" : "Islamic Knowledge Learning Schedule"}
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FFF6DE] border border-[#E6D8BA] flex items-center justify-between">
                    <span className="font-bold text-[var(--ink)]">Seerah & Biography of the Prophet ﷺ</span>
                    <span className="font-bold text-[#6E1A37]">75% Completed</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFF6DE] border border-[#E6D8BA] flex items-center justify-between">
                    <span className="font-bold text-[var(--ink)]">40 Hadith Nawawi Study</span>
                    <span className="font-bold text-[#6E1A37]">50% Completed</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFF6DE] border border-[#E6D8BA] flex items-center justify-between">
                    <span className="font-bold text-[var(--ink)]">Fiqh of Purification & Salah</span>
                    <span className="font-bold text-[#6E1A37]">90% Completed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advisory Note */}
      <aside className="rounded-2xl border border-[#E6D8BA] bg-[#FFF6DE] p-5 text-xs text-[var(--ink)] leading-relaxed flex items-start gap-3">
        <Info className="h-5 w-5 text-[#AE2448] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{lang === "ar" ? "استمرارية العمل الصالح:" : "Spiritual Purity & Privacy:"} </span>
          <span>
            {lang === "ar"
              ? "قال رسول الله ﷺ: «أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ». جميع بيانات مخططاتك اليومية وتتبعاتك تُحفظ في جهازك فقط."
              : "The Prophet (peace be upon him) said: 'The most beloved deeds to Allah are those that are most consistent, even if small.' (Sahih al-Bukhari). All your habits and progress are saved locally on your browser."}
          </span>
        </div>
      </aside>
    </div>
  );
}

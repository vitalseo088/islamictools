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
  Info
} from "lucide-react";
import { Tool, tools } from "../data/tools";
import { Locale } from "../data/locales";

interface IslamicPlannersHubProps {
  currentTool?: Tool;
  onSelectTool: (slug: string) => void;
  lang: Locale;
}

// 99 Names Sample Data for Memorization Tracker
const names99Data = [
  { id: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious" },
  { id: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful" },
  { id: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King and Owner" },
  { id: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy" },
  { id: 5, arabic: "السَّلاَمُ", transliteration: "As-Salam", meaning: "The Source of Peace" },
  { id: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Giver of Faith & Security" },
  { id: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Guardian & Protector" },
  { id: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty & Unconquerable" }
];

// Arabic Alphabet Sample
const arabicAlphabet = [
  { letter: "أ", name: "Alif", sound: "a / i / u", example: "أَمَل (Hope)" },
  { letter: "ب", name: "Baa", sound: "b", example: "بَرَكَة (Barakah)" },
  { letter: "ت", name: "Taa", sound: "t", example: "تَقْوَى (Taqwa)" },
  { letter: "ث", name: "Thaa", sound: "th", example: "ثَوَاب (Reward)" },
  { letter: "ج", name: "Jeem", sound: "j", example: "جَنَّة (Jannah)" },
  { letter: "ح", name: "Haa", sound: "h (sharp)", example: "حِكْمَة (Wisdom)" },
  { letter: "خ", name: "Khaa", sound: "kh", example: "خَيْر (Goodness)" },
  { letter: "د", name: "Daal", sound: "d", example: "دُعَاء (Dua)" }
];

export function IslamicPlannersHub({ currentTool, onSelectTool, lang }: IslamicPlannersHubProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dhikrCount, setDhikrCount] = useState(0);
  const [dhikrTarget, setDhikrTarget] = useState(33);
  const [activeDhikrText, setActiveDhikrText] = useState("سُبْحَانَ اللَّهِ");
  const [memorizedNames, setMemorizedNames] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("amanah-memorized-names");
      return saved ? JSON.parse(saved) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  const [habits, setHabits] = useState<{ id: string; name: string; completed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem("amanah-habits");
      return saved
        ? JSON.parse(saved)
        : [
            { id: "1", name: "Recite Morning Adhkar", completed: true },
            { id: "2", name: "Read 1 Page of Quran", completed: true },
            { id: "3", name: "Pray 2 Rakat Duha", completed: false },
            { id: "4", name: "Give Daily Sadaqah", completed: false },
            { id: "5", name: "Pray Tahajjud", completed: false }
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("amanah-memorized-names", JSON.stringify(memorizedNames));
    } catch {
      // ignore
    }
  }, [memorizedNames]);

  useEffect(() => {
    try {
      localStorage.setItem("amanah-habits", JSON.stringify(habits));
    } catch {
      // ignore
    }
  }, [habits]);

  const plannerTools = useMemo(
    () => tools.filter((t) => t.category === "Islamic Planners & Trackers"),
    []
  );

  const activeTool = currentTool || plannerTools[0];

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

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2EAE0] pb-4">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className="rounded-full bg-[#6E1A37] px-4 py-2 text-xs font-bold text-white shadow-xs border-0 cursor-pointer"
        >
          {lang === "ar" ? "جميع مخططات وتتبعات العبادة (١٥)" : lang === "ur" ? "تمام اسلامی ٹریکرز اور پلانرز (۱۵)" : "All Islamic Planners & Trackers (15)"}
        </button>

        <span className="text-xs font-semibold text-[var(--muted)]">
          {lang === "ar" ? "تُحفظ جميع بياناتك محلياً في متصفحك" : lang === "ur" ? "آپ کا تمام ڈیٹا ڈیوائس میں محفوظ ہے" : "100% Private Local Browser Storage"}
        </span>
      </div>

      {/* Grid of Tools */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {plannerTools.map((tool) => {
          const isSelected = activeTool.slug === tool.slug;
          return (
            <button
              key={tool.slug}
              type="button"
              onClick={() => onSelectTool(tool.slug)}
              className={`group flex items-start gap-2.5 rounded-2xl p-3.5 text-left transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "bg-[#6E1A37] text-white border-[#6E1A37] shadow-md ring-2 ring-[#6E1A37]/20"
                  : "bg-[#FFF6DE] text-[var(--ink)] border-[#E6D8BA] hover:border-[#AE2448] hover:bg-[#FFEFC2] shadow-2xs"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-transform group-hover:scale-105 ${
                  isSelected ? "bg-white text-[#6E1A37]" : "bg-[#AE2448] text-white"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
              </span>
              <div className="flex-1 overflow-hidden">
                <h4 className={`m-0 text-xs font-bold truncate ${isSelected ? "text-white" : "text-[var(--ink)]"}`}>
                  {tool.title}
                </h4>
                <p className={`m-0 mt-1 text-[10px] line-clamp-2 leading-relaxed ${isSelected ? "text-white/80" : "text-[var(--muted)]"}`}>
                  {tool.short}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Active Widget Area */}
      <div className="rounded-3xl border border-[#F2EAE0] bg-white p-6 md:p-8 shadow-sm">
        <div className="mb-6 border-b border-[#F2EAE0] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="rounded-full bg-[#AE2448]/10 px-3 py-1 text-xs font-bold text-[#AE2448]">
              {activeTool.title}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {lang === "ar" ? "مخطط وتتبع إسلامي تفاعلي" : "Interactive Planner Widget"}
            </span>
          </div>
          <h2 className="m-0 text-2xl font-bold text-[var(--ink)]">{activeTool.title}</h2>
          <p className="m-0 mt-2 text-sm text-[var(--muted)] leading-relaxed">{activeTool.explanation}</p>
        </div>

        {/* WIDGET 1: Dhikr Tracker & Digital Tasbeeh */}
        {activeTool.slug === "dhikr-tracker" && (
          <div className="text-center space-y-6 max-w-md mx-auto py-4">
            <div className="flex items-center justify-center gap-2">
              {["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "اللَّهُ أَكْبَرُ", "أَسْتَغْفِرُ اللَّهَ"].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => { setActiveDhikrText(phrase); setDhikrCount(0); }}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer ${
                    activeDhikrText === phrase
                      ? "bg-[#6E1A37] text-white border-[#6E1A37]"
                      : "bg-[#F2EAE0]/50 text-[var(--ink)] border-[#F2EAE0]"
                  }`}
                >
                  {phrase}
                </button>
              ))}
            </div>

            <p className="text-3xl font-bold font-arabic text-[#6E1A37] py-2">{activeDhikrText}</p>

            <button
              type="button"
              onClick={() => setDhikrCount((prev) => prev + 1)}
              className="w-44 h-44 mx-auto rounded-full bg-gradient-to-br from-[#6E1A37] to-[#AE2448] text-white flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer border-4 border-white"
            >
              <span className="text-5xl font-extrabold font-mono">{dhikrCount}</span>
              <span className="text-xs opacity-80 mt-1">/ {dhikrTarget} Target</span>
            </button>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDhikrCount(0)}
                className="rounded-xl border border-[#F2EAE0] px-4 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[#F2EAE0]/40 cursor-pointer border-0 flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* WIDGET 2: 99 Names Memorization Tracker */}
        {activeTool.slug === "names-99-memorization-tracker" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2EAE0] pb-3">
              <h3 className="m-0 text-sm font-bold text-[var(--ink)]">
                {lang === "ar" ? "أسماء الله الحسنى والتتبع" : "Asma-ul-Husna Progress Tracker"}
              </h3>
              <span className="text-xs font-bold text-[#6E1A37] bg-[#AE2448]/10 px-3 py-1 rounded-full">
                {memorizedNames.length} / {names99Data.length} Memorized
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                        : "bg-white border-[#F2EAE0] text-[var(--ink)] hover:border-[#AE2448]"
                    }`}
                  >
                    <p className="text-2xl font-bold font-arabic m-0 text-[#6E1A37]">{item.arabic}</p>
                    <p className="text-xs font-bold m-0 mt-1">{item.transliteration}</p>
                    <p className="text-[11px] opacity-80 m-0 mt-0.5">{item.meaning}</p>
                    <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider underline">
                      {isSaved ? "✓ Memorized" : "+ Mark Memorized"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* WIDGET 3: Daily Islamic Habit Tracker */}
        {(activeTool.slug === "daily-islamic-habit-tracker" || activeTool.slug === "salah-tracker") && (
          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="m-0 text-sm font-bold text-[var(--ink)] flex items-center justify-between">
              <span>{lang === "ar" ? "قائمة العادات والسنن اليومية" : "Daily Spiritual Routine & Habits"}</span>
              <span className="text-xs font-mono text-[var(--muted)]">
                {habits.filter((h) => h.completed).length} / {habits.length} Done
              </span>
            </h3>

            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-center justify-between rounded-xl p-3.5 border cursor-pointer transition-all ${
                    habit.completed
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                      : "bg-white border-[#F2EAE0] text-[var(--ink)] hover:border-[#AE2448]"
                  }`}
                >
                  <span className="text-xs font-bold">{habit.name}</span>
                  <CheckCircle2
                    className={`h-5 w-5 ${habit.completed ? "text-emerald-600" : "text-[var(--muted)]/40"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WIDGET 4: Arabic Alphabet Practice */}
        {activeTool.slug === "arabic-alphabet-practice" && (
          <div className="space-y-4">
            <h3 className="m-0 text-sm font-bold text-[var(--ink)]">
              {lang === "ar" ? "الحروف العربية والنطق" : "Arabic Alphabet Guide"}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {arabicAlphabet.map((item) => (
                <div key={item.letter} className="rounded-2xl border border-[#F2EAE0] bg-white p-4 text-center space-y-1 hover:border-[#AE2448] transition-all">
                  <p className="text-4xl font-extrabold font-arabic text-[#6E1A37] m-0">{item.letter}</p>
                  <p className="text-xs font-bold text-[var(--ink)] m-0">{item.name}</p>
                  <p className="text-[11px] text-[var(--muted)] m-0">Sound: {item.sound}</p>
                  <p className="text-[11px] text-[#AE2448] font-semibold m-0 mt-1">{item.example}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Placeholder / Fallback Planner Note */}
        {activeTool.slug !== "dhikr-tracker" &&
          activeTool.slug !== "names-99-memorization-tracker" &&
          activeTool.slug !== "daily-islamic-habit-tracker" &&
          activeTool.slug !== "salah-tracker" &&
          activeTool.slug !== "arabic-alphabet-practice" && (
            <div className="rounded-2xl bg-[#F2EAE0]/30 p-6 text-center space-y-3">
              <Sparkles className="h-8 w-8 text-[#AE2448] mx-auto" />
              <h3 className="m-0 text-base font-bold text-[var(--ink)]">{activeTool.title}</h3>
              <p className="m-0 text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                {activeTool.explanation}
              </p>
              <p className="m-0 text-[11px] font-semibold text-[#6E1A37]">
                {lang === "ar" ? "تتبع إنجازك اليومي محلياً بكل سهولة وخصوصية." : "Track your daily progress seamlessly and privately in your browser."}
              </p>
            </div>
          )}
      </div>

      {/* Advisory Note */}
      <aside className="rounded-2xl border border-[#F2EAE0] bg-[#F2EAE0]/50 p-5 text-xs text-[var(--ink)] leading-relaxed flex items-start gap-3">
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

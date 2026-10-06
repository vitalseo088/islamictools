import { useState, useEffect, useMemo } from "react";
import {
  Moon,
  Clock,
  Calendar,
  BookOpen,
  Sparkles,
  HeartHandshake,
  DollarSign,
  Utensils,
  CheckCircle2,
  Target,
  Flame,
  ShieldCheck,
  RotateCcw,
  Plus,
  Trash2,
  Volume2,
  Copy,
  Check,
  ChevronRight,
  Share2,
  ListOrdered,
  Sun,
  Sunrise,
  Sunset,
  Award,
  Info,
  Droplets,
  ArrowRight
} from "lucide-react";
import type { Tool } from "../data/tools";
import type { Locale } from "../data/locales";
import { fetchAlAdhanTimings, fetchGregorianToHijri } from "../utils/aladhan";

interface RamadanHubProps {
  currentTool?: Tool | null;
  onSelectTool: (slug: string) => void;
  lang?: Locale;
}

// Multilingual texts for Ramadan Hub
const rCopy: Record<Locale, Record<string, string>> = {
  en: {
    hubTitle: "Ramadan Tools & Planners",
    hubSubtitle: "Complete interactive suite of 17 calculators, planners, timers, and trackers for the blessed month of Ramadan.",
    privacyBadge: "100% Private & Saved Locally in Your Browser",
    privacyNotice: "All your Ramadan planners, calendars, daily schedules, Quran progress, dhikr counts, habits, and budgets are saved securely in your browser's local storage only. No personal data is sent to external servers.",
    resetAllData: "Reset All Local Data",
    loadSampleData: "Load Sample Schedule",
    copied: "Copied to clipboard!",
    toolsCount: "17 Dedicated Tools",
    viewAllTools: "View All Ramadan Tools",
    countdown: "Countdown",
    planner: "Planner",
    calendar: "Calendar",
    timer: "Fasting Timer",
    suhoor: "Suhoor Time",
    iftar: "Iftar Time",
    duration: "Fasting Hours",
    missed: "Missed Fasts",
    quran: "Quran Planner",
    dhikr: "Dhikr Tracker",
    charity: "Charity & Fitr",
    budget: "Budget Planner",
    meals: "Meal Planner",
    habits: "Habit Tracker",
    goals: "Goal Tracker",
    last10: "Last 10 Nights",
    laylatulQadr: "Laylatul Qadr",
    day: "Day",
    of30: "of 30",
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
    save: "Save",
    clear: "Clear",
    add: "Add Item",
    completed: "Completed",
    streak: "Current Streak",
    totalProgress: "Total Progress",
    sunnahReminder: "Sunnah of the Day",
    duaTitle: "Authentic Prophetic Du'a",
    audioPronunciation: "Pronounce",
    printExport: "Print / Save PDF"
  },
  ar: {
    hubTitle: "أدوات ومخططات شهر رمضان المبارك",
    hubSubtitle: "مجموعة شاملة تضم ١٧ أداة وحاسبة ومخططاً تفاعلياً للصيام والقرآن والعبادة والإنفاق في شهر رمضان.",
    privacyBadge: "خصوصية تامة - تُحفظ البيانات في متصفحك محلياً",
    privacyNotice: "جميع مخططاتك وجداولك وتتبع ختمة القرآن وأذكارك وميزانيتك تُحفظ بشكل آمن في ذاكرة متصفحك المحلية فقط، ولا يتم إرسال أي بيانات إلى خوادم خارجية.",
    resetAllData: "إعادة ضبط جميع البيانات",
    loadSampleData: "تحميل بيانات تجريبية",
    copied: "تم النسخ بنجاح!",
    toolsCount: "١٧ أداة ومخططاً",
    viewAllTools: "استعراض جميع أدوات رمضان",
    countdown: "العد التنازلي",
    planner: "الجدول اليومي",
    calendar: "تقويم رمضان",
    timer: "مؤقت الصيام",
    suhoor: "وقت السحور",
    iftar: "وقت الإفطار",
    duration: "ساعات الصيام",
    missed: "قضاء الصيام",
    quran: "ختم القرآن",
    dhikr: "متتبع الأذكار",
    charity: "الصدقة وزكاة الفطر",
    budget: "ميزانية رمضان",
    meals: "جدول الوجبات",
    habits: "متتبع السنن",
    goals: "أهداف رمضان",
    last10: "العشر الأواخر",
    laylatulQadr: "ليلة القدر",
    day: "اليوم",
    of30: "من ٣٠",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثوانٍ",
    save: "حفظ",
    clear: "مسح",
    add: "إضافة عنصر",
    completed: "مكتمل",
    streak: "أيام متتالية",
    totalProgress: "التقدم الإجمالي",
    sunnahReminder: "سنة اليوم",
    duaTitle: "دعاء مأثور من السنة النبوية",
    audioPronunciation: "نطق صوتي",
    printExport: "طباعة / حفظ"
  },
  ur: {
    hubTitle: "رمضان ٹولز، کیلکولیٹرز و پلانرز",
    hubSubtitle: "ماہِ مبارک رمضان کے لیے ۱۷ جامع ٹولز، لائیو ٹائمرز، عبادات کے شیڈولز اور ٹریکرز۔",
    privacyBadge: "مکمل رازداری - تمام ڈیٹا آپ کے براؤزر میں محفوظ ہے",
    privacyNotice: "آپ کے تمام رمضان شیڈولز، تقویم، قرآن ٹریکر، تسبیح کاؤنٹرز اور بجٹ صرف اور صرف آپ کے براؤزر کے لوکل اسٹوریج میں محفوظ ہیں۔ کوئی ڈیٹا سرور پر نہیں جاتا۔",
    resetAllData: "تمام ڈیٹا ری سیٹ کریں",
    loadSampleData: "نمونہ ڈیٹا لوڈ کریں",
    copied: "کاپی ہو گیا!",
    toolsCount: "۱۷ خصوصی ٹولز",
    viewAllTools: "تمام رمضان ٹولز دیکھیں",
    countdown: "الٹی گنتی",
    planner: "ڈیلی پلانر",
    calendar: "رمضان کیلنڈر",
    timer: "روزہ ٹائمر",
    suhoor: "سحری کا وقت",
    iftar: "افطار کا وقت",
    duration: "روزے کا دورانیہ",
    missed: "قضا روزے",
    quran: "قرآن پلانر",
    dhikr: "ذکر ٹریکر",
    charity: "صدقہ و فطرانہ",
    budget: "رمضان بجٹ",
    meals: "کھانوں کا شیڈول",
    habits: "عادات ٹریکر",
    goals: "رمضان اہداف",
    last10: "آخری ۱۰ راتیں",
    laylatulQadr: "شبِ قدر",
    day: "دن",
    of30: "میں سے ۳۰",
    days: "دن",
    hours: "گھنٹے",
    minutes: "منٹ",
    seconds: "سیکنڈ",
    save: "محفوظ کریں",
    clear: "صاف کریں",
    add: "شامل کریں",
    completed: "مکمل",
    streak: "مسلسل دن",
    totalProgress: "مجموعی پیش رفت",
    sunnahReminder: "آج کی سنت",
    duaTitle: "مسنون دعا",
    audioPronunciation: "تلفظ",
    printExport: "پرنٹ / پی ڈی ایف"
  }
};

const allRamadanToolsList = [
  { slug: "ramadan-countdown", name: "Ramadan Countdown", icon: Clock, desc: "Live countdown to Ramadan, Eid, and daily fasts." },
  { slug: "ramadan-planner", name: "Ramadan Planner", icon: Calendar, desc: "Interactive daily 24-hour worship & routine schedule." },
  { slug: "ramadan-calendar", name: "Ramadan Calendar", icon: Moon, desc: "30-day interactive fasting, prayer, & charity tracker." },
  { slug: "ramadan-fasting-timer", name: "Ramadan Fasting Timer", icon: Sunset, desc: "Real-time fasting progress & Sunnah Duas." },
  { slug: "suhoor-time-calculator", name: "Suhoor Time Calculator", icon: Sunrise, desc: "Optimal Suhoor cut-off time & Tahajjud window." },
  { slug: "iftar-time-calculator", name: "Iftar Time Calculator", icon: Sun, desc: "Iftar time countdown & golden Pre-Iftar Dua hour." },
  { slug: "fasting-duration-calculator", name: "Fasting Duration Calculator", icon: Clock, desc: "Fasting length & hydration pacing advice." },
  { slug: "missed-fast-calculator", name: "Missed Fast Calculator", icon: RotateCcw, desc: "Qada make-up tracker & Fidyah calculator." },
  { slug: "quran-ramadan-planner", name: "Quran Ramadan Planner", icon: BookOpen, desc: "30-day 1, 2, or 3 Khatm tracker with Juz checklists." },
  { slug: "ramadan-dhikr-tracker", name: "Ramadan Dhikr Tracker", icon: Sparkles, desc: "Digital tasbeeh counter for daily Adhkar." },
  { slug: "ramadan-charity-calculator", name: "Ramadan Charity Calculator", icon: HeartHandshake, desc: "Daily Sadaqah & Zakat al-Fitr calculation." },
  { slug: "ramadan-budget-planner", name: "Ramadan Budget Planner", icon: DollarSign, desc: "Suhoor, Iftar, hosting, and Eid expense tracker." },
  { slug: "ramadan-meal-planner", name: "Ramadan Meal Planner", icon: Utensils, desc: "Nutritious meal schedule & grocery checklist." },
  { slug: "ramadan-habit-tracker", name: "Ramadan Habit Tracker", icon: CheckCircle2, desc: "Build & track 30-day spiritual sunnah streaks." },
  { slug: "ramadan-goal-tracker", name: "Ramadan Goal Tracker", icon: Target, desc: "Spiritual, Quranic, and personal milestone goals." },
  { slug: "last-10-nights-planner", name: "Last 10 Nights Planner", icon: Flame, desc: "High-intensity worship schedule for Nights 21-30." },
  { slug: "laylatul-qadr-planner", name: "Laylatul Qadr Planner", icon: Award, desc: "Comprehensive Night of Power guide & personal Dua list." }
];

export default function RamadanHub({ currentTool, onSelectTool, lang = "en" }: RamadanHubProps) {
  const t = rCopy[lang] || rCopy.en;
  const isRtl = lang === "ar" || lang === "ur";
  const activeSlug = currentTool?.slug || "";

  // Navigation tabs
  const [selectedToolSlug, setSelectedToolSlug] = useState<string>(activeSlug);

  // AlAdhan API state for live prayer times and Hijri calendar
  const [selectedCity, setSelectedCity] = useState("Mecca");
  const [selectedCountry, setSelectedCountry] = useState("Saudi Arabia");
  const [hijriDateDisplay, setHijriDateDisplay] = useState<string>("1447 AH / Ramadan");
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setApiLoading(true);
    fetchAlAdhanTimings(selectedCity, selectedCountry).then((data) => {
      if (data && isMounted) {
        if (data.timings) {
          if (data.timings.Fajr) setFajrTime(data.timings.Fajr.slice(0, 5));
          if (data.timings.Maghrib) setMaghribTime(data.timings.Maghrib.slice(0, 5));
          if (data.timings.Fajr) setSuhoorFajrInput(data.timings.Fajr.slice(0, 5));
          if (data.timings.Maghrib) setIftarMaghribInput(data.timings.Maghrib.slice(0, 5));
          if (data.timings.Fajr) setDurationFajr(data.timings.Fajr.slice(0, 5));
          if (data.timings.Maghrib) setDurationMaghrib(data.timings.Maghrib.slice(0, 5));
        }
        if (data.date && data.date.hijri) {
          const h = data.date.hijri;
          setHijriDateDisplay(`${h.day} ${h.month.en} ${h.year} AH (${h.month.ar})`);
        }
      }
      setApiLoading(false);
    });
    fetchGregorianToHijri().then((h) => {
      if (h && isMounted) {
        setHijriDateDisplay(`${h.day} ${h.month.en} ${h.year} AH (${h.month.ar})`);
      }
    });
    return () => { isMounted = false; };
  }, [selectedCity, selectedCountry]);

  useEffect(() => {
    setSelectedToolSlug(currentTool?.slug || "");
  }, [currentTool]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text-to-Speech / Audio playback helper for authentic Duas
  const handlePlayAudio = (arabicText: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ==========================================
  // 1. RAMADAN COUNTDOWN STATE
  // ==========================================
  const [targetRamadanDate, setTargetRamadanDate] = useState<string>("2025-02-28T05:00:00");
  const [countdownTime, setCountdownTime] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(targetRamadanDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownTime({ days, hours, mins, secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetRamadanDate]);

  // ==========================================
  // 2. RAMADAN DAILY PLANNER STATE (localStorage)
  // ==========================================
  const [activePlannerDay, setActivePlannerDay] = useState<number>(1);
  const [dailyPlans, setDailyPlans] = useState<Record<number, { time: string; activity: string; done: boolean }[]>>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_daily_planner");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    const defaultSchedule = [
      { time: "04:30 AM", activity: "Tahajjud, Istighfar & Blessed Suhoor", done: false },
      { time: "05:15 AM", activity: "Fajr Prayer in Congregation & Morning Adhkar", done: false },
      { time: "06:00 AM", activity: "Quran Recitation & Reflection (1/2 Juz)", done: false },
      { time: "08:30 AM", activity: "Work / Study / Essential Responsibilities with Ihsan", done: false },
      { time: "01:00 PM", activity: "Dhuhr Prayer & Short Power Rest (Qaylulah)", done: false },
      { time: "04:45 PM", activity: "Asr Prayer & Afternoon Quran Tadabbur", done: false },
      { time: "06:00 PM", activity: "Golden 30-Min Pre-Iftar Du'a Acceptance Hour", done: false },
      { time: "06:30 PM", activity: "Iftar with Dates, Water, Du'a & Maghrib Prayer", done: false },
      { time: "08:00 PM", activity: "Isha & Taraweeh Prayers in Jama'ah", done: false },
      { time: "10:30 PM", activity: "Family Time, Rest & Sleep early for Tahajjud", done: false }
    ];
    const initial: Record<number, typeof defaultSchedule> = {};
    for (let i = 1; i <= 30; i++) {
      initial[i] = JSON.parse(JSON.stringify(defaultSchedule));
    }
    return initial;
  });

  const [newPlanTime, setNewPlanTime] = useState("");
  const [newPlanActivity, setNewPlanActivity] = useState("");

  const saveDailyPlans = (updated: Record<number, { time: string; activity: string; done: boolean }[]>) => {
    setDailyPlans(updated);
    try {
      localStorage.setItem("amanah_ramadan_daily_planner", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const togglePlanItem = (day: number, index: number) => {
    const dayItems = [...(dailyPlans[day] || [])];
    if (dayItems[index]) {
      dayItems[index].done = !dayItems[index].done;
      saveDailyPlans({ ...dailyPlans, [day]: dayItems });
    }
  };

  const addPlanItem = (day: number) => {
    if (!newPlanActivity.trim()) return;
    const dayItems = [...(dailyPlans[day] || [])];
    dayItems.push({ time: newPlanTime || "Anytime", activity: newPlanActivity.trim(), done: false });
    saveDailyPlans({ ...dailyPlans, [day]: dayItems });
    setNewPlanTime("");
    setNewPlanActivity("");
  };

  const deletePlanItem = (day: number, index: number) => {
    const dayItems = (dailyPlans[day] || []).filter((_, i) => i !== index);
    saveDailyPlans({ ...dailyPlans, [day]: dayItems });
  };

  // ==========================================
  // 3. RAMADAN 30-DAY CALENDAR (localStorage)
  // ==========================================
  const [calendarData, setCalendarData] = useState<
    Record<number, { fasted: boolean; prayers: number; taraweeh: boolean; juz: number; charity: number; note: string }>
  >(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_calendar_1446");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    const initial: Record<number, { fasted: boolean; prayers: number; taraweeh: boolean; juz: number; charity: number; note: string }> = {};
    for (let i = 1; i <= 30; i++) {
      initial[i] = { fasted: i <= 5, prayers: 5, taraweeh: i <= 5, juz: i <= 5 ? i : 0, charity: i <= 5 ? 10 : 0, note: "" };
    }
    return initial;
  });

  const saveCalendarData = (updated: typeof calendarData) => {
    setCalendarData(updated);
    try {
      localStorage.setItem("amanah_ramadan_calendar_1446", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const calendarStats = useMemo(() => {
    let fastCount = 0;
    let totalPrayers = 0;
    let taraweehCount = 0;
    let totalJuz = 0;
    let totalCharity = 0;
    Object.values(calendarData).forEach((d) => {
      if (d.fasted) fastCount++;
      totalPrayers += d.prayers || 0;
      if (d.taraweeh) taraweehCount++;
      totalJuz += d.juz || 0;
      totalCharity += d.charity || 0;
    });
    return { fastCount, totalPrayers, taraweehCount, totalJuz, totalCharity };
  }, [calendarData]);

  // ==========================================
  // 4. FASTING TIMER STATE
  // ==========================================
  const [fajrTime, setFajrTime] = useState<string>("05:12");
  const [maghribTime, setMaghribTime] = useState<string>("18:24");
  const [timerProgress, setTimerProgress] = useState<number>(45);
  const [timeUntilIftar, setTimeUntilIftar] = useState<string>("03h 12m 45s");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const [fH, fM] = fajrTime.split(":").map(Number);
      const [mH, mM] = maghribTime.split(":").map(Number);

      const fajrDate = new Date();
      fajrDate.setHours(fH, fM, 0, 0);

      const maghribDate = new Date();
      maghribDate.setHours(mH, mM, 0, 0);

      if (now >= fajrDate && now <= maghribDate) {
        const totalDuration = maghribDate.getTime() - fajrDate.getTime();
        const elapsed = now.getTime() - fajrDate.getTime();
        const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setTimerProgress(Math.round(progress));

        const remMs = maghribDate.getTime() - now.getTime();
        const h = Math.floor(remMs / 3600000);
        const m = Math.floor((remMs % 3600000) / 60000);
        const s = Math.floor((remMs % 60000) / 1000);
        setTimeUntilIftar(`${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`);
      } else {
        setTimerProgress(now > maghribDate ? 100 : 0);
        setTimeUntilIftar("Fasting Completed for Today!");
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [fajrTime, maghribTime]);

  // ==========================================
  // 5. SUHOOR & IFTAR CALCULATOR STATES
  // ==========================================
  const [suhoorFajrInput, setSuhoorFajrInput] = useState<string>("05:15");
  const [suhoorBufferMins, setSuhoorBufferMins] = useState<number>(15);

  const calculatedSuhoorStop = useMemo(() => {
    const [h, m] = suhoorFajrInput.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m - suhoorBufferMins, 0, 0);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }, [suhoorFajrInput, suhoorBufferMins]);

  const [iftarMaghribInput, setIftarMaghribInput] = useState<string>("18:30");
  const preIftarDuaWindow = useMemo(() => {
    const [h, m] = iftarMaghribInput.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m - 30, 0, 0);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }, [iftarMaghribInput]);

  // ==========================================
  // 6. FASTING DURATION CALCULATOR
  // ==========================================
  const [durationFajr, setDurationFajr] = useState<string>("05:00");
  const [durationMaghrib, setDurationMaghrib] = useState<string>("18:45");

  const computedDuration = useMemo(() => {
    const [fH, fM] = durationFajr.split(":").map(Number);
    const [mH, mM] = durationMaghrib.split(":").map(Number);
    const fajrMins = fH * 60 + fM;
    const maghribMins = mH * 60 + mM;
    const diff = Math.max(0, maghribMins - fajrMins);
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return { hours, mins, totalMins: diff };
  }, [durationFajr, durationMaghrib]);

  // ==========================================
  // 7. MISSED FAST & FIDYAH CALCULATOR (localStorage)
  // ==========================================
  const [missedFastsState, setMissedFastsState] = useState<{
    missedTotal: number;
    completedQada: number;
    reason: string;
    fidyahPerDay: number;
    targetCompletionDate: string;
  }>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_missed_fasts");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return { missedTotal: 7, completedQada: 2, reason: "Travel / Illness", fidyahPerDay: 12, targetCompletionDate: "2025-10-30" };
  });

  const saveMissedFasts = (updated: typeof missedFastsState) => {
    setMissedFastsState(updated);
    try {
      localStorage.setItem("amanah_ramadan_missed_fasts", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const remainingQada = Math.max(0, missedFastsState.missedTotal - missedFastsState.completedQada);
  const totalFidyahAmount = remainingQada * missedFastsState.fidyahPerDay;

  // ==========================================
  // 8. QURAN RAMADAN PLANNER (localStorage)
  // ==========================================
  const [khatmTarget, setKhatmTarget] = useState<number>(1);
  const [quranCompletedJuz, setQuranCompletedJuz] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_quran_khatm");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [1, 2, 3, 4, 5];
  });

  const toggleJuz = (juzNumber: number) => {
    const updated = quranCompletedJuz.includes(juzNumber)
      ? quranCompletedJuz.filter((j) => j !== juzNumber)
      : [...quranCompletedJuz, juzNumber];
    setQuranCompletedJuz(updated);
    try {
      localStorage.setItem("amanah_ramadan_quran_khatm", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const pagesPerDayGoal = Math.ceil((604 * khatmTarget) / 30);

  // ==========================================
  // 9. RAMADAN DHIKR TRACKER (localStorage)
  // ==========================================
  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_dhikr");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      subhanAllah: 33,
      alhamdulillah: 33,
      allahuAkbar: 34,
      astaghfirullah: 70,
      salawat: 50,
      laIlahaIllallah: 100
    };
  });

  const incrementDhikr = (key: string) => {
    const updated = { ...dhikrCounts, [key]: (dhikrCounts[key] || 0) + 1 };
    setDhikrCounts(updated);
    try {
      localStorage.setItem("amanah_ramadan_dhikr", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const resetDhikr = (key: string) => {
    const updated = { ...dhikrCounts, [key]: 0 };
    setDhikrCounts(updated);
    try {
      localStorage.setItem("amanah_ramadan_dhikr", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // ==========================================
  // 10. RAMADAN CHARITY & ZAKAT AL-FITR (localStorage)
  // ==========================================
  const [charityDailyGoal, setCharityDailyGoal] = useState<number>(10);
  const [fitrFamilyMembers, setFitrFamilyMembers] = useState<number>(4);
  const [fitrCostPerPerson, setFitrCostPerPerson] = useState<number>(12);
  const [last10CharityMultiplier, setLast10CharityMultiplier] = useState<number>(3);

  const total30DayCharity = charityDailyGoal * 20 + charityDailyGoal * last10CharityMultiplier * 10;
  const totalZakatFitr = fitrFamilyMembers * fitrCostPerPerson;

  // ==========================================
  // 11. RAMADAN BUDGET PLANNER (localStorage)
  // ==========================================
  const [budgetItems, setBudgetItems] = useState<{ id: string; category: string; planned: number; spent: number }[]>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_budget");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      { id: "1", category: "Suhoor & Iftar Groceries", planned: 450, spent: 380 },
      { id: "2", category: "Family Hospitality & Gatherings", planned: 250, spent: 210 },
      { id: "3", category: "Eid Gifts & Clothes", planned: 300, spent: 280 },
      { id: "4", category: "Zakat al-Fitr & Sadaqah", planned: 200, spent: 200 },
      { id: "5", category: "Islamic Books & Decor", planned: 80, spent: 65 }
    ];
  });

  const saveBudget = (updated: typeof budgetItems) => {
    setBudgetItems(updated);
    try {
      localStorage.setItem("amanah_ramadan_budget", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const totalPlannedBudget = budgetItems.reduce((acc, item) => acc + (item.planned || 0), 0);
  const totalSpentBudget = budgetItems.reduce((acc, item) => acc + (item.spent || 0), 0);

  // ==========================================
  // 12. RAMADAN MEAL & HYDRATION PLANNER (localStorage)
  // ==========================================
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("amanah_ramadan_water")) || 5;
    } catch {
      return 5;
    }
  });

  const [mealPlan, setMealPlan] = useState<{ day: string; suhoor: string; iftar: string }[]>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_meals");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      { day: "Monday", suhoor: "Oatmeal with chia seeds, banana, dates & milk", iftar: "3 Medjool dates, lentil soup, grilled chicken & salad" },
      { day: "Tuesday", suhoor: "Whole wheat wrap with eggs, avocado & labneh", iftar: "Dates, Moroccan Harira soup, baked fish & brown rice" },
      { day: "Wednesday", suhoor: "Greek yogurt parfait with walnuts & honey", iftar: "Dates, vegetable stew, chicken kababs & tabbouleh" },
      { day: "Thursday", suhoor: "Foul Mudammas (fava beans) with olive oil & pita", iftar: "Dates, chicken biryani with raita & fresh watermelon" },
      { day: "Friday", suhoor: "Scrambled eggs, spinach, whole grain toast & dates", iftar: "Community Iftar gathering: Lamb stew & rice" },
      { day: "Saturday", suhoor: "Smoothie bowl with peanut butter, oats & seeds", iftar: "Dates, baked samosas, mixed mezze & lentil pilaf" },
      { day: "Sunday", suhoor: "Boiled eggs, halloumi, olives & cucumber", iftar: "Dates, shepherd's pie, steamed vegetables & mint tea" }
    ];
  });

  // ==========================================
  // 13. RAMADAN HABIT TRACKER (localStorage)
  // ==========================================
  const [habitsList, setHabitsList] = useState<{ id: string; name: string; targetDays: number; completedDays: number }[]>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_habits");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      { id: "1", name: "5 Daily Prayers on Time in Jama'ah", targetDays: 30, completedDays: 28 },
      { id: "2", name: "Pray Taraweeh Every Night", targetDays: 30, completedDays: 27 },
      { id: "3", name: "Tahajjud / Qiyam al-Layl", targetDays: 30, completedDays: 22 },
      { id: "4", name: "Read Minimum 20 Pages of Quran", targetDays: 30, completedDays: 29 },
      { id: "5", name: "Morning & Evening Adhkar", targetDays: 30, completedDays: 26 },
      { id: "6", name: "Guard the Tongue (Zero Gossip / Anger)", targetDays: 30, completedDays: 30 },
      { id: "7", name: "Give Daily Sadaqah (Even $1)", targetDays: 30, completedDays: 28 },
      { id: "8", name: "Connect with Family & Relatives", targetDays: 30, completedDays: 25 }
    ];
  });

  const incrementHabit = (id: string) => {
    const updated = habitsList.map((h) => (h.id === id ? { ...h, completedDays: Math.min(h.targetDays, h.completedDays + 1) } : h));
    setHabitsList(updated);
    try {
      localStorage.setItem("amanah_ramadan_habits", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // ==========================================
  // 14. RAMADAN GOAL TRACKER (localStorage)
  // ==========================================
  const [goalsList, setGoalsList] = useState<{ id: string; title: string; category: string; progress: number }[]>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_goals");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      { id: "1", title: "Complete full Quran with Tafseer reflection", category: "Quran", progress: 85 },
      { id: "2", title: "Memorize Surah Al-Mulk & Surah Al-Insan", category: "Memorization", progress: 70 },
      { id: "3", title: "Attend Itikaf during the Last 10 Nights", category: "Worship", progress: 100 },
      { id: "4", title: "Sponsor 100 Iftar meals for families in need", category: "Charity", progress: 90 },
      { id: "5", title: "Break a bad habit and replace with Tahajjud", category: "Character", progress: 80 }
    ];
  });

  // ==========================================
  // 15. LAST 10 NIGHTS PLANNER (localStorage)
  // ==========================================
  const [last10NightsData, setLast10NightsData] = useState<
    Record<number, { qiyam: boolean; dua: boolean; quranJuz: number; charity: number; itikaf: boolean }>
  >(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_last10_nights");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    const initial: Record<number, { qiyam: boolean; dua: boolean; quranJuz: number; charity: number; itikaf: boolean }> = {};
    for (let n = 21; n <= 30; n++) {
      initial[n] = { qiyam: false, dua: false, quranJuz: 1, charity: 50, itikaf: false };
    }
    return initial;
  });

  const toggleLast10Night = (night: number, field: "qiyam" | "dua" | "itikaf") => {
    const nightObj = { ...(last10NightsData[night] || { qiyam: false, dua: false, quranJuz: 1, charity: 50, itikaf: false }) };
    nightObj[field] = !nightObj[field];
    const updated = { ...last10NightsData, [night]: nightObj };
    setLast10NightsData(updated);
    try {
      localStorage.setItem("amanah_ramadan_last10_nights", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // ==========================================
  // 16. LAYLATUL QADR PLANNER (localStorage)
  // ==========================================
  const [personalDuas, setPersonalDuas] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("amanah_ramadan_laylatul_qadr");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      "O Allah, forgive all my sins, past and present, small and great.",
      "O Allah, grant Jannah al-Firdaus to my beloved parents and family.",
      "O Allah, grant relief, justice, and victory to the oppressed believers worldwide.",
      "O Allah, cure our sicknesses, remove our debts, and bless our livelihoods.",
      "O Allah, guide our children and make them the coolness of our eyes."
    ];
  });

  const [newDuaInput, setNewDuaInput] = useState("");
  const addPersonalDua = () => {
    if (!newDuaInput.trim()) return;
    const updated = [...personalDuas, newDuaInput.trim()];
    setPersonalDuas(updated);
    setNewDuaInput("");
    try {
      localStorage.setItem("amanah_ramadan_laylatul_qadr", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removePersonalDua = (index: number) => {
    const updated = personalDuas.filter((_, i) => i !== index);
    setPersonalDuas(updated);
    try {
      localStorage.setItem("amanah_ramadan_laylatul_qadr", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Global Reset function
  const handleResetAllData = () => {
    if (confirm("Are you sure you want to reset all Ramadan planners, schedules, and trackers? This will clear browser storage for Ramadan tools.")) {
      localStorage.removeItem("amanah_ramadan_daily_planner");
      localStorage.removeItem("amanah_ramadan_calendar_1446");
      localStorage.removeItem("amanah_ramadan_missed_fasts");
      localStorage.removeItem("amanah_ramadan_quran_khatm");
      localStorage.removeItem("amanah_ramadan_dhikr");
      localStorage.removeItem("amanah_ramadan_budget");
      localStorage.removeItem("amanah_ramadan_meals");
      localStorage.removeItem("amanah_ramadan_habits");
      localStorage.removeItem("amanah_ramadan_goals");
      localStorage.removeItem("amanah_ramadan_last10_nights");
      localStorage.removeItem("amanah_ramadan_laylatul_qadr");
      localStorage.removeItem("amanah_ramadan_water");
      window.location.reload();
    }
  };

  return (
    <div className={`space-y-8 ${isRtl ? "rtl text-right" : "ltr text-left"}`}>
      {/* Top Banner & Privacy Notice */}
      <div className="rounded-3xl border border-[#AE2448]/30 bg-gradient-to-r from-[#F2EAE0]/40 via-white to-[#F2EAE0]/20 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#AE2448] px-3.5 py-1 text-xs font-bold text-white shadow-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>{t.privacyBadge}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--ink)]">
              {t.hubTitle}
            </h1>
            <p className="text-sm md:text-base text-[var(--muted)] max-w-3xl leading-relaxed">
              {t.hubSubtitle}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <button
              type="button"
              onClick={handleResetAllData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.resetAllData}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{t.printExport}</span>
            </button>
          </div>
        </div>

        {/* Local Storage Privacy Explanation */}
        <div className="mt-4 rounded-xl border border-[#AE2448]/20 bg-white/80 p-3.5 text-xs text-[var(--muted)] flex items-start gap-2.5">
          <Info className="h-4 w-4 text-[#AE2448] shrink-0 mt-0.5" />
          <p className="leading-normal">{t.privacyNotice}</p>
        </div>

        {/* AlAdhan.com Live API City & Hijri Status Bar */}
        <div className="mt-4 pt-4 border-t border-[#AE2448]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--ink)]">AlAdhan.com Live Hijri & Prayer API:</span>
            <span className="rounded-full bg-[#FFF6DE] border border-[#E6D8BA] px-3 py-1 font-mono font-bold text-[#6E1A37]">
              {hijriDateDisplay || "Loading Hijri Date..."} {apiLoading && " (Syncing...)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--muted)] font-medium">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCity(val);
                if (val === "Mecca") setSelectedCountry("Saudi Arabia");
                else if (val === "Cairo") setSelectedCountry("Egypt");
                else if (val === "Dubai") setSelectedCountry("United Arab Emirates");
                else if (val === "London") setSelectedCountry("United Kingdom");
                else if (val === "New York") setSelectedCountry("United States");
                else if (val === "Istanbul") setSelectedCountry("Turkey");
                else if (val === "Jakarta") setSelectedCountry("Indonesia");
                else if (val === "Kuala Lumpur") setSelectedCountry("Malaysia");
              }}
              className="rounded-xl border border-[#E6D8BA] bg-white px-3 py-1.5 font-bold text-[var(--ink)] outline-none cursor-pointer"
            >
              <option value="Mecca">Mecca (Makkah)</option>
              <option value="Medina">Medina</option>
              <option value="Riyadh">Riyadh</option>
              <option value="Cairo">Cairo</option>
              <option value="Dubai">Dubai</option>
              <option value="London">London</option>
              <option value="New York">New York</option>
              <option value="Istanbul">Istanbul</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section Sub-Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6D8BA] pb-4">
        <div className="flex items-center gap-2">
          {selectedToolSlug && (
            <button
              type="button"
              onClick={() => {
                setSelectedToolSlug("");
                onSelectTool("");
              }}
              className="rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] px-3.5 py-1.5 text-xs font-bold text-[#6E1A37] hover:bg-[#FFEFC2] transition-colors cursor-pointer"
            >
              {lang === "ar" ? "← جميع أدوات رمضان" : lang === "ur" ? "← تمام رمضان ٹولز" : "← All Ramadan Tools"}
            </button>
          )}
          <span className="text-xs font-bold text-[#6E1A37]">
            {lang === "ar" ? "١٧ أداة ومخططاً لرمضان" : lang === "ur" ? "۱۷ انٹرایکٹو رمضان ٹولز" : "17 Dedicated Ramadan Tools & Planners"}
          </span>
        </div>
      </div>

      {/* VIEW 1: DIRECTORY GRID OF ALL 17 RAMADAN TOOLS (SIGNATURE CARDS) */}
      {!selectedToolSlug && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allRamadanToolsList.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <button
                  type="button"
                  key={tool.slug}
                  onClick={() => {
                    setSelectedToolSlug(tool.slug);
                    onSelectTool(tool.slug);
                  }}
                  className="group text-left relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#E6D8BA] bg-[#FFF6DE] p-5 sm:p-6 no-underline interactive-card hover:border-[#AE2448] hover:bg-[#FFEFC2] cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                          {lang === "ar" ? "أداة رمضان" : "Ramadan Tool"}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#6E1A37]/60">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h4 className="mb-1.5 text-base sm:text-lg font-bold leading-snug tracking-[-.02em] text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                      {tool.name}
                    </h4>

                    <p className="m-0 text-xs sm:text-sm leading-relaxed text-[#262626]">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-[#E6D8BA] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6E1A37] group-hover:text-[var(--primary)] transition-colors">
                      {lang === "ar" ? "افتح الأداة" : "Open Ramadan Tool"}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#AE2448] text-white group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-200 shadow-xs">
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED TOOL VIEWS                                                     */}
      {/* ========================================================================= */}

      {/* 1. RAMADAN COUNTDOWN */}
      {selectedToolSlug === "ramadan-countdown" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="eyebrow">Blessed Arrival</span>
                <h2 className="text-3xl font-bold text-[var(--ink)]">Ramadan Countdown</h2>
                <p className="text-sm text-[var(--muted)]">
                  Anticipate and prepare your heart for the month of mercy, forgiveness, and the Quran.
                </p>
              </div>

              {/* Target Date Picker */}
              <div className="flex items-center gap-2 text-xs">
                <label className="font-medium text-[var(--muted)]">Target Start:</label>
                <input
                  type="datetime-local"
                  value={targetRamadanDate.slice(0, 16)}
                  onChange={(e) => setTargetRamadanDate(e.target.value)}
                  className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs bg-white text-[var(--ink)]"
                />
              </div>
            </div>

            {/* Countdown Digits */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t.days, val: countdownTime.days },
                { label: t.hours, val: countdownTime.hours },
                { label: t.minutes, val: countdownTime.mins },
                { label: t.seconds, val: countdownTime.secs }
              ].map((box, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center rounded-2xl border border-[#F2EAE0] bg-[#F2EAE0] p-6 text-center shadow-xs"
                >
                  <span className="text-4xl md:text-5xl font-black text-[#6E1A37] tracking-tight font-mono">
                    {box.val.toString().padStart(2, "0")}
                  </span>
                  <span className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    {box.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Authentic Hadith Banner */}
            <div className="mt-8 rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0]/50 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6E1A37] text-white">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[var(--ink)]">Prophetic Tidings of Ramadan</h4>
                  <p className="mt-1 text-sm italic text-[var(--muted)] leading-relaxed font-arabic text-base">
                    "إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ، وَغُلِّقَتْ أَبْوَابُ النَّارِ، وَسُلْسِلَتِ الشَّيَاطِينُ"
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    "When Ramadan begins, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained." [Sahih al-Bukhari & Muslim]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RAMADAN DAILY PLANNER */}
      {selectedToolSlug === "ramadan-planner" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Interactive Schedule</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">24-Hour Daily Ramadan Planner</h2>
                <p className="text-sm text-[var(--muted)]">
                  Day-by-day routine for all 30 days. Checked tasks and notes persist in your browser.
                </p>
              </div>

              {/* Day Selector Pill */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-[var(--ink)]">Select Day:</label>
                <select
                  value={activePlannerDay}
                  onChange={(e) => setActivePlannerDay(Number(e.target.value))}
                  className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs font-bold bg-white text-[#6E1A37]"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Day {d} of 30
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule List */}
            <div className="mt-6 space-y-2.5">
              {(dailyPlans[activePlannerDay] || []).map((item, index) => (
                <div
                  key={index}
                  onClick={() => togglePlanItem(activePlannerDay, index)}
                  className={`group flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                    item.done
                      ? "border-[#F2EAE0] bg-[#F2EAE0]/50 text-gray-500 line-through"
                      : "border-[var(--line)] bg-white hover:border-[#6E1A37]/30 hover:bg-gray-50/60 text-[var(--ink)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs ${
                        item.done
                          ? "border-[#6E1A37] bg-[#6E1A37] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {item.done && <Check className="h-4 w-4" />}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#6E1A37] bg-rose-50 px-2 py-0.5 rounded-md">
                      {item.time}
                    </span>
                    <span className="text-sm font-medium">{item.activity}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlanItem(activePlannerDay, index);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-600 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Schedule Item */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Time (e.g. 05:30 PM)"
                value={newPlanTime}
                onChange={(e) => setNewPlanTime(e.target.value)}
                className="w-full sm:w-40 rounded-xl border border-[var(--line)] px-3 py-2 text-xs bg-white text-[var(--ink)]"
              />
              <input
                type="text"
                placeholder="Add custom worship or activity..."
                value={newPlanActivity}
                onChange={(e) => setNewPlanActivity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPlanItem(activePlannerDay)}
                className="flex-1 rounded-xl border border-[var(--line)] px-3 py-2 text-xs bg-white text-[var(--ink)]"
              />
              <button
                type="button"
                onClick={() => addPlanItem(activePlannerDay)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6E1A37] px-4 py-2 text-xs font-bold !text-white hover:bg-[#8C2448] transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RAMADAN 30-DAY CALENDAR */}
      {selectedToolSlug === "ramadan-calendar" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="eyebrow">30-Day Matrix</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Ramadan Calendar Tracker</h2>
                <p className="text-sm text-[var(--muted)]">
                  Log fasts, 5 daily prayers, Taraweeh, and Quran progress. Saved locally for complete privacy.
                </p>
              </div>

              {/* Summary Stats Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-[#F2EAE0] bg-[#F2EAE0] px-3 py-1.5 text-center">
                  <span className="block text-xs text-[var(--muted)]">Fasts</span>
                  <span className="text-sm font-bold text-[#6E1A37]">{calendarStats.fastCount}/30</span>
                </div>
                <div className="rounded-xl border border-[#F2EAE0] bg-[#F2EAE0] px-3 py-1.5 text-center">
                  <span className="block text-xs text-[var(--muted)]">Taraweeh</span>
                  <span className="text-sm font-bold text-[#6E1A37]">{calendarStats.taraweehCount}/30</span>
                </div>
                <div className="rounded-xl border border-[#F2EAE0] bg-[#F2EAE0] px-3 py-1.5 text-center">
                  <span className="block text-xs text-[var(--muted)]">Juz Read</span>
                  <span className="text-sm font-bold text-[#6E1A37]">{calendarStats.totalJuz}</span>
                </div>
              </div>
            </div>

            {/* 30-Day Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const data = calendarData[day] || { fasted: false, prayers: 5, taraweeh: false, juz: 0, charity: 0, note: "" };
                const isOddNight = [21, 23, 25, 27, 29].includes(day);

                return (
                  <div
                    key={day}
                    className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all duration-200 ${
                      data.fasted
                        ? "border-[#AE2448] bg-[#F2EAE0]/50"
                        : "border-[var(--line)] bg-white hover:border-[#6E1A37]/30"
                    } ${isOddNight ? "ring-2 ring-[#AE2448]/30" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6E1A37]">Day {day}</span>
                      {isOddNight && (
                        <span className="rounded-full bg-[#AE2448] px-1.5 py-0.5 text-[9px] font-bold text-white">
                          Odd Night
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.fasted}
                          onChange={(e) => {
                            saveCalendarData({
                              ...calendarData,
                              [day]: { ...data, fasted: e.target.checked }
                            });
                          }}
                          className="rounded text-[#6E1A37]"
                        />
                        <span>Fasted</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.taraweeh}
                          onChange={(e) => {
                            saveCalendarData({
                              ...calendarData,
                              [day]: { ...data, taraweeh: e.target.checked }
                            });
                          }}
                          className="rounded text-[#6E1A37]"
                        />
                        <span>Taraweeh</span>
                      </label>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--muted)]">
                      <span>Juz {day}</span>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={data.juz || 0}
                        onChange={(e) => {
                          saveCalendarData({
                            ...calendarData,
                            [day]: { ...data, juz: Number(e.target.value) }
                          });
                        }}
                        className="w-10 rounded border border-[var(--line)] px-1 py-0.5 text-center text-[10px]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. RAMADAN FASTING TIMER */}
      {selectedToolSlug === "ramadan-fasting-timer" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs text-center">
            <span className="eyebrow">Real-Time Fasting Progress</span>
            <h2 className="text-3xl font-bold text-[var(--ink)]">Daily Fasting Timer</h2>
            <p className="mt-1 text-sm text-[var(--muted)] max-w-lg mx-auto">
              Live countdown between today's Fajr (Imsak) and Maghrib (Iftar).
            </p>

            {/* Time Adjusters */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-[var(--line)]">
                <Sunrise className="h-4 w-4 text-amber-600" />
                <span>Fajr:</span>
                <input
                  type="time"
                  value={fajrTime}
                  onChange={(e) => setFajrTime(e.target.value)}
                  className="rounded border border-gray-300 px-2 py-0.5"
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-[var(--line)]">
                <Sunset className="h-4 w-4 text-rose-600" />
                <span>Maghrib:</span>
                <input
                  type="time"
                  value={maghribTime}
                  onChange={(e) => setMaghribTime(e.target.value)}
                  className="rounded border border-gray-300 px-2 py-0.5"
                />
              </div>
            </div>

            {/* Progress Bar & Time Remaining */}
            <div className="mt-8 max-w-xl mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)]">
                <span>Fajr {fajrTime}</span>
                <span className="text-sm font-black text-[#6E1A37]">{timerProgress}% Completed</span>
                <span>Maghrib {maghribTime}</span>
              </div>
              <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden border border-[var(--line)]">
                <div
                  className="h-full bg-gradient-to-r from-[#6E1A37] via-[#AE2448] to-[#6E1A37] transition-all duration-500"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>

              <div className="pt-4">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)]">Time Remaining to Iftar</span>
                <div className="mt-1 font-mono text-4xl md:text-5xl font-black text-[#6E1A37]">
                  {timeUntilIftar}
                </div>
              </div>
            </div>

            {/* Sunnah Iftar Dua Card */}
            <div className="mt-8 rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0] p-5 max-w-xl mx-auto text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider">Sunnah Dua at Iftar</span>
                <button
                  type="button"
                  onClick={() => handlePlayAudio("ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ")}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-[#6E1A37] shadow-xs hover:bg-gray-50 cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Listen</span>
                </button>
              </div>
              <p className="mt-3 text-lg font-bold font-arabic text-[var(--ink)] leading-loose text-center">
                ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ
              </p>
              <p className="mt-1 text-xs text-[var(--muted)] text-center italic">
                Dhahaba adh-dhama'u wabtallat al-'urooqu wa thabata al-ajru in sha' Allah
              </p>
              <p className="mt-1 text-xs text-[var(--muted)] text-center font-medium">
                "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills." [Abu Dawud]
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUHOOR TIME CALCULATOR */}
      {selectedToolSlug === "suhoor-time-calculator" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Blessed Pre-Dawn Meal</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Suhoor Time Calculator</h2>
            <p className="text-sm text-[var(--muted)]">
              Calculate the recommended Imsak (cut-off time) before true Fajr with customizable safety buffers.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 rounded-2xl border border-[var(--line)] p-5 bg-gray-50/50">
                <h4 className="text-sm font-bold text-[var(--ink)]">Enter Local Times</h4>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Local Fajr Adhan Time:</label>
                  <input
                    type="time"
                    value={suhoorFajrInput}
                    onChange={(e) => setSuhoorFajrInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
                    Recommended Safety Buffer (Imsak): {suhoorBufferMins} minutes
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={5}
                    value={suhoorBufferMins}
                    onChange={(e) => setSuhoorBufferMins(Number(e.target.value))}
                    className="w-full accent-[#6E1A37]"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--muted)]">
                    <span>5 mins</span>
                    <span>15 mins (Standard)</span>
                    <span>30 mins</span>
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className="flex flex-col justify-center rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0] p-6 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Recommended Suhoor Stop Time (Imsak)
                </span>
                <span className="mt-2 text-4xl font-black text-[#6E1A37] font-mono">
                  {calculatedSuhoorStop}
                </span>
                <p className="mt-2 text-xs text-[var(--muted)] max-w-sm mx-auto">
                  Stop eating by {calculatedSuhoorStop} to allow ample time for brushing teeth, performing Wudu, and praying Fajr with peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. IFTAR TIME CALCULATOR */}
      {selectedToolSlug === "iftar-time-calculator" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Golden Hour of Acceptance</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Iftar Time Calculator</h2>
            <p className="text-sm text-[var(--muted)]">
              Calculate exact Iftar timing and prepare for the miraculous 30-minute Pre-Iftar Du'a acceptance window.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 rounded-2xl border border-[var(--line)] p-5 bg-gray-50/50">
                <h4 className="text-sm font-bold text-[var(--ink)]">Enter Local Maghrib</h4>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Maghrib (Sunset) Time:</label>
                  <input
                    type="time"
                    value={iftarMaghribInput}
                    onChange={(e) => setIftarMaghribInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
              </div>

              {/* Pre-Iftar Window Result */}
              <div className="flex flex-col justify-center rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0] p-6 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Golden Pre-Iftar Du'a Window Starts At:
                </span>
                <span className="mt-2 text-3xl font-black text-[#6E1A37] font-mono">
                  {preIftarDuaWindow}
                </span>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  "Three supplications are never rejected: the supplication of the fasting person until he breaks his fast..." [At-Tirmidhi]
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. FASTING DURATION CALCULATOR */}
      {selectedToolSlug === "fasting-duration-calculator" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Hours & Hydration</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Fasting Duration Calculator</h2>
            <p className="text-sm text-[var(--muted)]">
              Calculate total fasting hours and receive tailored hydration pacing recommendations.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 rounded-2xl border border-[var(--line)] p-5 bg-gray-50/50">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Fajr (Start):</label>
                  <input
                    type="time"
                    value={durationFajr}
                    onChange={(e) => setDurationFajr(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Maghrib (End):</label>
                  <input
                    type="time"
                    value={durationMaghrib}
                    onChange={(e) => setDurationMaghrib(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0] p-6 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Total Fasting Length</span>
                <span className="mt-2 text-4xl font-black text-[#6E1A37] font-mono">
                  {computedDuration.hours} hrs {computedDuration.mins} mins
                </span>
                <div className="mt-3 text-xs text-[var(--muted)]">
                  Hydration Goal: Drink at least 8-10 glasses (2.5L) of water between Maghrib and Suhoor in spaced intervals.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MISSED FAST CALCULATOR */}
      {selectedToolSlug === "missed-fast-calculator" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Qada & Expiation</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Missed Fast & Fidyah Calculator</h2>
            <p className="text-sm text-[var(--muted)]">
              Track Qada days owed due to sickness, travel, pregnancy, or menstruation, and calculate Fidyah amounts.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 rounded-2xl border border-[var(--line)] p-5 bg-gray-50/50">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Total Missed Fasts:</label>
                  <input
                    type="number"
                    min={0}
                    value={missedFastsState.missedTotal}
                    onChange={(e) => saveMissedFasts({ ...missedFastsState, missedTotal: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Already Made Up (Qada):</label>
                  <input
                    type="number"
                    min={0}
                    value={missedFastsState.completedQada}
                    onChange={(e) => saveMissedFasts({ ...missedFastsState, completedQada: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Local Fidyah Cost per Day ($):</label>
                  <input
                    type="number"
                    min={0}
                    value={missedFastsState.fidyahPerDay}
                    onChange={(e) => saveMissedFasts({ ...missedFastsState, fidyahPerDay: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0] p-6 text-center space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Remaining Qada Fasts Owed</span>
                  <span className="block text-4xl font-black text-[#6E1A37] font-mono mt-1">
                    {remainingQada} Days
                  </span>
                </div>
                <div className="pt-2 border-t border-[#AE2448]/20">
                  <span className="text-xs text-[var(--muted)]">Estimated Fidyah if unable to make up:</span>
                  <span className="block text-2xl font-bold text-[#AE2448] font-mono">
                    ${totalFidyahAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. QURAN RAMADAN PLANNER */}
      {selectedToolSlug === "quran-ramadan-planner" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Khatm Tracker</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Quran Ramadan Completion Planner</h2>
                <p className="text-sm text-[var(--muted)]">
                  Track 1, 2, or 3 full completions of the Holy Quran across 30 days.
                </p>
              </div>

              {/* Target Completions Toggle */}
              <div className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-gray-50 p-1">
                {[1, 2, 3].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKhatmTarget(k)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      khatmTarget === k
                        ? "bg-[#6E1A37] !text-white shadow-xs"
                        : "text-[var(--ink)] hover:bg-gray-200"
                    }`}
                  >
                    {k} Khatm ({k * 20} pgs/day)
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Target Banner */}
            <div className="mt-6 rounded-2xl border border-[#F2EAE0] bg-[#F2EAE0] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-[#6E1A37]">Daily Reading Goal:</span>
                <span className="ml-2 text-sm font-bold text-[var(--ink)]">
                  {pagesPerDayGoal} Pages per day (~{khatmTarget} Juz daily)
                </span>
              </div>
              <div className="text-xs font-bold text-[var(--muted)]">
                Completed: {quranCompletedJuz.length} / 30 Juz ({Math.round((quranCompletedJuz.length / 30) * 100)}%)
              </div>
            </div>

            {/* 30 Juz Interactive Checkboxes */}
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                const isDone = quranCompletedJuz.includes(juz);
                return (
                  <button
                    key={juz}
                    type="button"
                    onClick={() => toggleJuz(juz)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
                      isDone
                        ? "border-[#AE2448] bg-[#6E1A37] !text-white scale-102"
                        : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[#6E1A37]/40"
                    }`}
                  >
                    <span className="text-xs font-bold">Juz {juz}</span>
                    <span className={`text-[10px] mt-1 ${isDone ? "text-rose-200" : "text-[var(--muted)]"}`}>
                      {isDone ? "Read" : "20 pgs"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 10. RAMADAN DHIKR TRACKER */}
      {selectedToolSlug === "ramadan-dhikr-tracker" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Digital Tasbeeh</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Ramadan Dhikr Tracker</h2>
            <p className="text-sm text-[var(--muted)]">
              Interactive counters for morning, evening, and after-prayer remembrance of Allah.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "subhanAllah", arabic: "سُبْحَانَ اللَّهِ", name: "SubhanAllah", target: 100 },
                { key: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", name: "Alhamdulillah", target: 100 },
                { key: "allahuAkbar", arabic: "اللَّهُ أَكْبَرُ", name: "Allahu Akbar", target: 100 },
                { key: "astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", name: "Astaghfirullah", target: 100 },
                { key: "salawat", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", name: "Salawat upon the Prophet ﷺ", target: 100 },
                { key: "laIlahaIllallah", arabic: "لَا إِلَهَ إِلَّا اللَّهُ", name: "La ilaha illallah", target: 100 }
              ].map((dhikr) => {
                const count = dhikrCounts[dhikr.key] || 0;
                return (
                  <div
                    key={dhikr.key}
                    className="flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-white p-5 shadow-xs hover:border-[#6E1A37]/30 transition-all"
                  >
                    <div className="text-center">
                      <p className="text-xl font-bold font-arabic text-[var(--ink)] leading-relaxed">{dhikr.arabic}</p>
                      <span className="text-xs font-semibold text-[var(--muted)]">{dhikr.name}</span>
                    </div>

                    <div className="my-4 text-center">
                      <span className="font-mono text-4xl font-black text-[#6E1A37]">{count}</span>
                      <span className="text-xs text-[var(--muted)] block">Target: {dhikr.target}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => incrementDhikr(dhikr.key)}
                        className="flex-1 rounded-xl bg-[#6E1A37] py-2.5 text-xs font-bold !text-white hover:bg-[#8C2448] active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        + Count
                      </button>
                      <button
                        type="button"
                        onClick={() => resetDhikr(dhikr.key)}
                        className="rounded-xl border border-gray-200 p-2.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 11. RAMADAN CHARITY CALCULATOR */}
      {selectedToolSlug === "ramadan-charity-calculator" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Multiply Your Rewards</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Ramadan Charity & Zakat al-Fitr</h2>
            <p className="text-sm text-[var(--muted)]">
              Plan your 30 days of Sadaqah with an extra multiplier for the Last 10 Nights, plus Zakat al-Fitr estimation.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 rounded-2xl border border-[var(--line)] p-5 bg-gray-50/50">
                <h4 className="text-sm font-bold text-[var(--ink)]">Charity & Fitr Settings</h4>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Daily Sadaqah Goal ($):</label>
                  <input
                    type="number"
                    min={1}
                    value={charityDailyGoal}
                    onChange={(e) => setCharityDailyGoal(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
                    Last 10 Nights Multiplier ({last10CharityMultiplier}x daily):
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={last10CharityMultiplier}
                    onChange={(e) => setLast10CharityMultiplier(Number(e.target.value))}
                    className="w-full accent-[#6E1A37]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Family Members:</label>
                    <input
                      type="number"
                      min={1}
                      value={fitrFamilyMembers}
                      onChange={(e) => setFitrFamilyMembers(Number(e.target.value))}
                      className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Fitr Rate / Person ($):</label>
                    <input
                      type="number"
                      min={5}
                      value={fitrCostPerPerson}
                      onChange={(e) => setFitrCostPerPerson(Number(e.target.value))}
                      className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm bg-white text-[var(--ink)]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0] p-6 space-y-4 text-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Total Planned Sadaqah (30 Days)</span>
                  <span className="block text-3xl font-black text-[#6E1A37] font-mono mt-1">
                    ${total30DayCharity}
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    (${charityDailyGoal}/day for first 20 days + ${charityDailyGoal * last10CharityMultiplier}/day on Last 10 Nights)
                  </span>
                </div>
                <div className="pt-3 border-t border-[#AE2448]/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Total Zakat al-Fitr</span>
                  <span className="block text-2xl font-bold text-[#AE2448] font-mono mt-1">
                    ${totalZakatFitr}
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">Due before Eid Prayer on behalf of {fitrFamilyMembers} people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. RAMADAN BUDGET PLANNER */}
      {selectedToolSlug === "ramadan-budget-planner" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Financial Barakah</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Ramadan & Eid Budget Planner</h2>
            <p className="text-sm text-[var(--muted)]">
              Track household groceries, hospitality, gifts, and charity with instant balance calculation.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl border border-[var(--line)] bg-gray-50 p-4">
                <span className="text-xs text-[var(--muted)]">Total Planned Budget</span>
                <span className="block text-2xl font-bold text-[var(--ink)] font-mono">${totalPlannedBudget}</span>
              </div>
              <div className="rounded-2xl border border-[#F2EAE0] bg-[#F2EAE0] p-4">
                <span className="text-xs text-[var(--muted)]">Actual Spent</span>
                <span className="block text-2xl font-bold text-[#6E1A37] font-mono">${totalSpentBudget}</span>
              </div>
              <div className="rounded-2xl border border-[#AE2448]/30 bg-[#AE2448]/10 p-4">
                <span className="text-xs text-[var(--muted)]">Remaining Balance</span>
                <span className="block text-2xl font-bold text-[#6E1A37] font-mono">
                  ${Math.max(0, totalPlannedBudget - totalSpentBudget)}
                </span>
              </div>
            </div>

            {/* Budget Items Table */}
            <div className="mt-6 space-y-3">
              {budgetItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[var(--line)] p-4 bg-white"
                >
                  <span className="font-semibold text-sm text-[var(--ink)]">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[var(--muted)]">Planned: $</span>
                      <input
                        type="number"
                        min={0}
                        value={item.planned}
                        onChange={(e) => {
                          const updated = [...budgetItems];
                          updated[idx].planned = Number(e.target.value);
                          saveBudget(updated);
                        }}
                        className="w-20 rounded-lg border border-[var(--line)] px-2 py-1 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[var(--muted)]">Spent: $</span>
                      <input
                        type="number"
                        min={0}
                        value={item.spent}
                        onChange={(e) => {
                          const updated = [...budgetItems];
                          updated[idx].spent = Number(e.target.value);
                          saveBudget(updated);
                        }}
                        className="w-20 rounded-lg border border-[var(--line)] px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 13. RAMADAN MEAL PLANNER */}
      {selectedToolSlug === "ramadan-meal-planner" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Wholesome Nutrition</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Ramadan Meal & Hydration Planner</h2>
                <p className="text-sm text-[var(--muted)]">
                  Energizing slow-release Suhoor recipes and balanced Iftar menus.
                </p>
              </div>

              {/* Water Tracker */}
              <div className="rounded-2xl border border-[#AE2448]/25 bg-[#F2EAE0]/60 p-3.5 flex items-center gap-3">
                <Droplets className="h-5 w-5 text-[#AE2448]" />
                <div>
                  <span className="text-xs font-bold text-[#6E1A37] block">Evening Water Tracker</span>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((glass) => (
                      <button
                        key={glass}
                        type="button"
                        onClick={() => {
                          const val = waterGlasses === glass ? glass - 1 : glass;
                          setWaterGlasses(val);
                          localStorage.setItem("amanah_ramadan_water", String(val));
                        }}
                        className={`h-6 w-6 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                          glass <= waterGlasses
                            ? "bg-[#AE2448] !text-white border-[#AE2448]"
                            : "bg-white text-[#6E1A37] border-[#AE2448]/20 hover:border-[#AE2448]"
                        }`}
                      >
                        {glass}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Menu Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {mealPlan.map((m, idx) => (
                <div key={idx} className="rounded-2xl border border-[var(--line)] bg-gray-50/40 p-5 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">{m.day}</span>
                  <div className="text-xs">
                    <span className="font-bold text-[var(--ink)] block">Suhoor:</span>
                    <span className="text-[var(--muted)]">{m.suhoor}</span>
                  </div>
                  <div className="text-xs pt-1">
                    <span className="font-bold text-[var(--ink)] block">Iftar:</span>
                    <span className="text-[var(--muted)]">{m.iftar}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 14. RAMADAN HABIT TRACKER */}
      {selectedToolSlug === "ramadan-habit-tracker" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Steadfast Sunnahs</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">30-Day Ramadan Habit Tracker</h2>
            <p className="text-sm text-[var(--muted)]">
              Build lasting prophetic habits with persistent streaks saved in your browser.
            </p>

            <div className="mt-6 space-y-3">
              {habitsList.map((habit) => {
                const pct = Math.round((habit.completedDays / habit.targetDays) * 100);
                return (
                  <div
                    key={habit.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[var(--line)] p-4 bg-white hover:border-[#6E1A37]/30 transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between pr-4">
                        <span className="text-sm font-bold text-[var(--ink)]">{habit.name}</span>
                        <span className="text-xs font-bold text-[#6E1A37]">
                          {habit.completedDays} / {habit.targetDays} Days ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full max-w-md rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-[#6E1A37]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => incrementHabit(habit.id)}
                      className="rounded-xl bg-[#F2EAE0] px-3.5 py-2 text-xs font-bold text-[#6E1A37] hover:bg-[#e8dcce] transition-colors cursor-pointer"
                    >
                      + Log Day
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 15. RAMADAN GOAL TRACKER */}
      {selectedToolSlug === "ramadan-goal-tracker" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Spiritual Aspirations</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Ramadan Goal Tracker</h2>
            <p className="text-sm text-[var(--muted)]">
              Define your core goals for the sacred month and track your progress milestones.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalsList.map((goal) => (
                <div key={goal.id} className="rounded-2xl border border-[var(--line)] p-5 space-y-3 bg-gray-50/40">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-[#6E1A37]">
                      {goal.category}
                    </span>
                    <span className="text-xs font-bold text-[#6E1A37]">{goal.progress}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)]">{goal.title}</h4>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={goal.progress}
                    onChange={(e) => {
                      const updated = goalsList.map((g) => (g.id === goal.id ? { ...g, progress: Number(e.target.value) } : g));
                      setGoalsList(updated);
                      localStorage.setItem("amanah_ramadan_goals", JSON.stringify(updated));
                    }}
                    className="w-full accent-[#6E1A37]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 16. LAST 10 NIGHTS PLANNER */}
      {selectedToolSlug === "last-10-nights-planner" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Pinnacle of Worship</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Last 10 Nights Worship Planner</h2>
            <p className="text-sm text-[var(--muted)]">
              Maximize Nights 21 through 30 with dedicated focus on the odd nights (21, 23, 25, 27, 29).
            </p>

            <div className="mt-6 space-y-3">
              {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((night) => {
                const isOdd = [21, 23, 25, 27, 29].includes(night);
                const data = last10NightsData[night] || { qiyam: false, dua: false, quranJuz: 1, charity: 50, itikaf: false };

                return (
                  <div
                    key={night}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                      isOdd
                        ? "border-[#AE2448] bg-[#F2EAE0]/50 ring-1 ring-[#AE2448]/30"
                        : "border-[var(--line)] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-[#6E1A37]">Night {night}</span>
                      {isOdd && (
                        <span className="rounded-full bg-[#AE2448] px-2 py-0.5 text-[10px] font-bold text-white">
                          Odd Night
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.qiyam}
                          onChange={() => toggleLast10Night(night, "qiyam")}
                          className="rounded text-[#6E1A37]"
                        />
                        <span>Qiyam / Tahajjud</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.dua}
                          onChange={() => toggleLast10Night(night, "dua")}
                          className="rounded text-[#6E1A37]"
                        />
                        <span>Heartfelt Du'a</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.itikaf}
                          onChange={() => toggleLast10Night(night, "itikaf")}
                          className="rounded text-[#6E1A37]"
                        />
                        <span>Itikaf</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 17. LAYLATUL QADR PLANNER */}
      {selectedToolSlug === "laylatul-qadr-planner" && (
        <div className="space-y-6 fade-up">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
            <span className="eyebrow">Better Than a Thousand Months</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">Laylatul Qadr Master Blueprint</h2>
            <p className="text-sm text-[var(--muted)]">
              Authentic Du'a taught to Aisha (رضي الله عنها), personal prayer organizer, and hourly night schedule.
            </p>

            {/* Prophetic Du'a of Laylatul Qadr */}
            <div className="mt-6 rounded-2xl border border-[#AE2448]/30 bg-[#F2EAE0] p-6 text-center">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider">The Supplication of the Night</span>
                <button
                  type="button"
                  onClick={() => handlePlayAudio("اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي")}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#6E1A37] shadow-xs cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Listen</span>
                </button>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-arabic text-[var(--ink)] leading-loose">
                اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
              </p>
              <p className="mt-2 text-sm italic text-[var(--muted)]">
                Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--ink)]">
                "O Allah, You are Most Forgiving, and You love to forgive; so forgive me." [At-Tirmidhi]
              </p>
            </div>

            {/* Personal Du'a Organizer */}
            <div className="mt-8 space-y-4">
              <h4 className="text-sm font-bold text-[var(--ink)]">Personal Laylatul Qadr Du'a List</h4>
              <div className="space-y-2">
                {personalDuas.map((dua, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] p-3 bg-white text-xs"
                  >
                    <span>• {dua}</span>
                    <button
                      type="button"
                      onClick={() => removePersonalDua(i)}
                      className="text-gray-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Dua Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom personal Dua to remember during Qiyam..."
                  value={newDuaInput}
                  onChange={(e) => setNewDuaInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPersonalDua()}
                  className="flex-1 rounded-xl border border-[var(--line)] px-3 py-2 text-xs bg-white text-[var(--ink)]"
                />
                <button
                  type="button"
                  onClick={addPersonalDua}
                  className="rounded-xl bg-[#6E1A37] px-4 py-2 text-xs font-bold !text-white hover:bg-[#8C2448] cursor-pointer"
                >
                  Add Du'a
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from "react";
import {
  Calculator as CalcIcon,
  Moon,
  Coins,
  BookOpen,
  Clock,
  Compass,
  Users,
  HeartHandshake,
  Scale,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Check,
  X
} from "lucide-react";
import Calculator from "./components/Calculator";
import MuslimNamesHub from "./components/MuslimNamesHub";
import RamadanHub from "./components/RamadanHub";
import { tools, toolBySlug, type Tool } from "./data/tools";
import { categoryCopy, siteCopy, toolCopy, type Locale } from "./data/locales";

const getToolIcon = (tool: Tool) => {
  const cat = tool.category;
  const slug = tool.slug;
  if (cat === "Ramadan Tools" || cat === "Ramadan") {
    if (slug.includes("countdown") || slug.includes("timer") || slug.includes("duration")) return Clock;
    if (slug.includes("planner") || slug.includes("calendar")) return Moon;
    if (slug.includes("quran")) return BookOpen;
    if (slug.includes("charity") || slug.includes("budget")) return HeartHandshake;
    return Sparkles;
  }
  if (cat === "Muslim Names Tools") {
    if (slug.includes("twin")) return Users;
    if (slug.includes("meaning") || slug.includes("quranic")) return BookOpen;
    return Sparkles;
  }
  if (cat === "Zakat") {
    if (slug.includes("business") || slug.includes("property")) return Scale;
    return Coins;
  }
  if (cat === "Quran") return BookOpen;
  if (cat === "Prayer times") return Clock;
  if (cat === "Worship planning") return Compass;
  if (cat === "Family & planning") return Users;
  if (cat === "Travel planning") return Compass;
  if (cat === "Giving") return HeartHandshake;
  return CalcIcon;
};

export default function App() {
  // Initialize language from localStorage or default to 'en'
  const [lang, setLang] = useState<Locale>(() => {
    try {
      const stored = localStorage.getItem("amanah-language");
      if (stored === "ar" || stored === "ur" || stored === "en") {
        return stored;
      }
    } catch {
      // ignore
    }
    return "en";
  });

  // Extract slug from URL (pathname, hash, or search param)
  const getSlugFromLocation = (): string | null => {
    try {
      const path = window.location.pathname.replace(/\/+$/, "");
      const search = new URLSearchParams(window.location.search);
      const queryTool = search.get("tool") || search.get("calc");
      if (queryTool && toolBySlug[queryTool]) return queryTool;

      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash.startsWith("calculators/")) {
        const slug = hash.replace("calculators/", "").replace(/\/+$/, "");
        if (slug && toolBySlug[slug]) return slug;
      } else if (hash.startsWith("muslim-names/")) {
        const slug = hash.replace("muslim-names/", "").replace(/\/+$/, "");
        if (slug && toolBySlug[slug]) return slug;
      } else if (hash.startsWith("ramadan-tools/")) {
        const slug = hash.replace("ramadan-tools/", "").replace(/\/+$/, "");
        if (slug && toolBySlug[slug]) return slug;
      } else if (hash && toolBySlug[hash]) {
        return hash;
      }

      const match = path.match(/\/(?:calculators|muslim-names|ramadan-tools)\/([^/]+)/);
      if (match && match[1]) {
        return match[1];
      }
    } catch {
      // ignore
    }
    return null;
  };

  const getSectionFromLocation = (): "calculators" | "ramadan" | "names" => {
    try {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith("/ramadan-tools") || hash.includes("ramadan-tools")) return "ramadan";
      if (path.startsWith("/muslim-names") || hash.includes("muslim-names")) return "names";
    } catch {
      // ignore
    }
    return "calculators";
  };

  const [currentSlug, setCurrentSlug] = useState<string | null>(getSlugFromLocation);
  const [activePage, setActivePage] = useState<"calculators" | "ramadan" | "names">(() => {
    const slug = getSlugFromLocation();
    if (slug && toolBySlug[slug]) {
      if (toolBySlug[slug].category === "Ramadan Tools") return "ramadan";
      if (toolBySlug[slug].category === "Muslim Names Tools") return "names";
      return "calculators";
    }
    return getSectionFromLocation();
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Sync language with document attributes & event dispatch
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    try {
      localStorage.setItem("amanah-language", lang);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent("amanah-language", { detail: lang }));
  }, [lang]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const slug = getSlugFromLocation();
      setCurrentSlug(slug);
      const sec = getSectionFromLocation();
      if (slug && toolBySlug[slug]) {
        if (toolBySlug[slug].category === "Ramadan Tools") setActivePage("ramadan");
        else if (toolBySlug[slug].category === "Muslim Names Tools") setActivePage("names");
        else setActivePage("calculators");
      } else {
        setActivePage(sec);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (slug: string | null, sectionOrCategory?: string) => {
    setCurrentSlug(slug);
    let newPage: "calculators" | "ramadan" | "names" = "calculators";
    if (sectionOrCategory === "ramadan" || sectionOrCategory === "Ramadan Tools") {
      newPage = "ramadan";
    } else if (sectionOrCategory === "names" || sectionOrCategory === "Muslim Names Tools") {
      newPage = "names";
    } else if (sectionOrCategory && sectionOrCategory !== "calculators") {
      newPage = "calculators";
      setSelectedCategory(sectionOrCategory);
    } else if (slug && toolBySlug[slug]) {
      const cat = toolBySlug[slug].category;
      if (cat === "Ramadan Tools") newPage = "ramadan";
      else if (cat === "Muslim Names Tools") newPage = "names";
      else {
        newPage = "calculators";
        setSelectedCategory(cat);
      }
    } else if (sectionOrCategory === "calculators") {
      newPage = "calculators";
      setSelectedCategory("all");
    } else {
      newPage = activePage;
    }
    setActivePage(newPage);

    window.scrollTo({ top: 0, behavior: "smooth" });
    let targetUrl = "/calculators/";
    if (slug) {
      const isNameTool = toolBySlug[slug]?.category === "Muslim Names Tools";
      const isRamadanTool = toolBySlug[slug]?.category === "Ramadan Tools";
      if (isRamadanTool) {
        targetUrl = `/ramadan-tools/${slug}/`;
      } else if (isNameTool) {
        targetUrl = `/muslim-names/${slug}/`;
      } else {
        targetUrl = `/calculators/${slug}/`;
      }
    } else if (newPage === "names") {
      targetUrl = "/muslim-names/";
    } else if (newPage === "ramadan") {
      targetUrl = "/ramadan-tools/";
    }
    try {
      window.history.pushState({}, "", targetUrl);
    } catch {
      // fallback
    }
  };

  const t = siteCopy[lang] || siteCopy.en;
  const isRtl = lang === "ar" || lang === "ur";

  // Pure calculator tools (separated from Ramadan and Muslim Names)
  const calculatorTools = useMemo(() => {
    return tools.filter(
      (tool) => tool.category !== "Ramadan Tools" && tool.category !== "Muslim Names Tools"
    );
  }, []);

  const calculatorCategories = useMemo(() => {
    return Array.from(new Set(calculatorTools.map((t) => t.category)));
  }, [calculatorTools]);

  const localizedCategory = (cat: string) => {
    if (lang === "en") return cat;
    return categoryCopy[cat]?.[lang] ?? cat;
  };

  const localizedToolTitle = (tool: Tool) => {
    if (lang === "en") return tool.title;
    return toolCopy[tool.slug]?.[lang]?.title ?? tool.title;
  };

  const localizedToolShort = (tool: Tool) => {
    if (lang === "en") return tool.short;
    return toolCopy[tool.slug]?.[lang]?.short ?? tool.short;
  };

  const localizedToolExplanation = (tool: Tool) => {
    if (lang === "en") return tool.explanation;
    const explanations: Record<string, Partial<Record<Exclude<Locale, "en">, string>>> = {
      "zakat-calculator": {
        ar: "أضف الأصول الزكوية والالتزامات قصيرة الأجل المؤهلة للخصم. يُطبَّق معدل ٢٫٥٪ عند بلوغ الصافي النصاب المحدد.",
        ur: "اپنے قابلِ زکوٰۃ اثاثے اور واجب الادا مختصر مدتی قرض شامل کریں۔ جب خالص رقم آپ کے درج کردہ نصاب تک پہنچ جائے گی تو ۲.۵٪ زکوٰۃ کا حساب لگایا جائے گا۔"
      },
      "zakat-on-gold": {
        ar: "قدّر قيمة الذهب من خلال وزنه وسعر الغرام، ثم قارن الوزن بالنصاب المعتمد.",
        ur: "سونے کے وزن اور فی گرام قیمت سے اس کی مالیت کا اندازہ لگائیں اور اس کا موازنہ اپنے منتخب نصاب سے کریں۔"
      },
      "zakat-on-silver": {
        ar: "أدخل وزن الفضة وسعر الغرام المحلي ونصاب الفضة المعتمد لديك.",
        ur: "چاندی کا وزن، مقامی فی گرام قیمت اور چاندی کا نصاب درج کریں۔"
      },
      "fidyah-calculator": {
        ar: "اضرب عدد أيام الفدية المستحقة في التكلفة المحلية لإطعام مسكين ليوم واحد.",
        ur: "فدیہ والے دنوں کی تعداد کو ایک دن کے کھانے کی مقامی لاگت سے ضرب دے کر حساب لگائیں۔"
      },
      "kaffarah-calculator": {
        ar: "لكل صيام مستوجب للكفارة، قدّر التكلفة المحلية لإطعام ٦٠ مسكيناً.",
        ur: "ہر متعلقہ روزے کے بدلے ۶۰ افراد کو کھانا کھلانے کی مقامی لاگت کا اندازہ لگائیں۔"
      },
      "missed-salah-calculator": {
        ar: "حوّل المدة التقريبية إلى صلوات يومية، ثم اختر وتيرة قضاء مناسبة بجانب صلواتك الحالية.",
        ur: "تقریبی مدت کو پانچ نمازوں میں بدلیں، پھر روزانہ کی نمازوں کے ساتھ قضا ادا کرنے کی آسان رفتار منتخب کریں۔"
      },
      "quran-reading-goal": {
        ar: "حدد عدد الختمات التي تأمل إتمامها والأيام المتاحة لديك. طول المصحف الافتراضي ٦٠٤ صفحات.",
        ur: "جتنی بار قرآن مکمل کرنا چاہتے ہیں اور جتنے دن میسر ہیں درج کریں۔ عام مصحف کے کل صفحات ۶۰۴ ہیں۔"
      },
      "quran-completion-calculator": {
        ar: "أدخل صفحتك الحالية وعدد الصفحات التي يمكنك قراءتها يومياً لمعرفة موعد الختم المتوقع.",
        ur: "موجودہ صفحہ اور روزانہ تلاوت کیے جانے والے صفحات درج کریں تاکہ ختمِ قرآن کی متوقع تاریخ معلوم ہو سکے۔"
      },
      "quran-page-calculator": {
        ar: "احسب عدد الصفحات اليومية المطلوبة للوصول إلى هدفك في التاريخ المحدد أو خلال الأيام المتبقية.",
        ur: "ہدف کی تاریخ یا مقررہ دنوں کے مطابق جانیں کہ موجودہ صفحے سے روزانہ کتنے صفحات پڑھنے کی ضرورت ہے۔"
      },
      "tahajjud-time-calculator": {
        ar: "أدخل وقتي المغرب والفجر المحليين لمعرفة بداية الثلث الأخير من الليل.",
        ur: "مقامی مغرب اور فجر کا وقت درج کریں تاکہ رات کے آخری تہائی حصے کا درست تخمینہ معلوم ہو۔"
      },
      "ishraq-duha-time-calculator": {
        ar: "أضف فاصلاً زمنياً بعد الشروق لبداية الإشراق وقبل الظهر لآخر وقت لصلاة الضحى.",
        ur: "اشراق کے آغاز کے لیے طلوع کے بعد اور چاشت کے آخری وقت کے لیے ظہر سے پہلے کا درمیانی وقفہ درج کریں۔"
      },
      "business-zakat-calculator": {
        ar: "اجمع النقد وبضاعة التجارة والديون المرجوة، ثم اخصم الالتزامات قصيرة الأجل.",
        ur: "کاروباری نقدی، فروخت کا مال اور وصول طلب رقوم شامل کریں اور مختصر مدتی واجبات منہا کریں۔"
      },
      "cash-savings-zakat-calculator": {
        ar: "اجمع النقد في يدك والأرصدة البنكية والديون المرجوة مطروحاً منها الالتزامات القصيرة.",
        ur: "نقد رقم، بینک بیلنس اور قابلِ وصول رقوم کو یکجا کریں اور مختصر مدتی واجبات منہا کریں۔"
      },
      "investment-zakat-calculator": {
        ar: "أدخل قيمة المحفظة الاستثمارية ونسبة المال الزكوي منها مع الالتزامات والنصاب.",
        ur: "انویسٹمنٹ پورٹ فولیو کی مالیت اور قابلِ زکوٰۃ حصہ بمع واجبات اور نصاب درج کریں۔"
      },
      "crypto-zakat-calculator": {
        ar: "استخدم القيمة الحالية للعملات الرقمية والنقدية بالعملة المحلية مع خصم الديون المؤهلة.",
        ur: "کرپٹو اور نقد اثاثوں کی موجودہ مقامی قیمت درج کریں اور مختصر مدتی قرضے منہا کریں۔"
      },
      "property-zakat-calculator": {
        ar: "اختر الغرض من العقار؛ عقار التجارة يُحسب كمخزون، بينما يُستبعد أصل العقار الشخصي أو المؤجر.",
        ur: "جائیداد کا مقصد منتخب کریں۔ فروخت کی جائیداد کو مالِ تجارت سمجھا جائے گا جبکہ ذاتی و کرایے کی اصل جائیداد خارج رہے گی۔"
      },
      "agricultural-zakat-calculator": {
        ar: "أدخل وزن المحصول وطريقة الري والنصاب المعتمد (الافتراضي ٦٥٣ كغ).",
        ur: "فصل کا وزن، آب پاشی کا طریقہ اور نصاب (پہلے سے طے شدہ ۶۵۳ کلوگرام) درج کریں۔"
      },
      "livestock-zakat-calculator": {
        ar: "أدخل عدد الرؤوس ونوع الماشية للتحقق من النصاب التقديري.",
        ur: "مویشیوں کی تعداد اور قسم درج کر کے بنیادی نصاب کا جائزہ لیں۔"
      },
      "mahr-calculator": {
        ar: "سجل المهر المتفق عليه والمبالغ المدفوعة أو المؤجلة لمعرفة المتبقي بدقة.",
        ur: "طے شدہ کل مہر، ادا شدہ رقم اور مؤخر رقم درج کریں تاکہ باقی واجب الادا رقم معلوم ہو۔"
      },
      "islamic-inheritance-calculator": {
        ar: "أدخل قيمة التركة بعد سداد الديون والوصايا مع تحديد الورثة المباشرين.",
        ur: "قرضوں کی ادائیگی اور جائز وصیت کے بعد ترکہ اور قریبی ورثاء کی تفصیل درج کریں۔"
      },
      "hajj-cost-calculator": {
        ar: "أضف تكاليف الحج الأساسية وعدد المسافرين لمعرفة الإجمالي ونصيب الفرد.",
        ur: "حج کے اہم اخراجات اور مسافروں کی تعداد درج کر کے کل رقم اور فی کس لاگت جانیں۔"
      },
      "umrah-cost-calculator": {
        ar: "أضف تكلفة الباقة والسفر والمصروفات اليومية للرحلة وعدد المسافرين.",
        ur: "عمرہ پیکیج، سفر اور یومیہ اخراجات بمع مسافروں کی تعداد درج کر کے کل بجٹ بنائیں۔"
      },
      "ramadan-budget-calculator": {
        ar: "أضف النفقات الشهرية المتوقعة في رمضان مقارنة بالدخل المتاح لمعرفة المتبقي.",
        ur: "رمضان کے متوقع اخراجات کو آمدنی کے ساتھ درج کریں تاکہ بجٹ کا صحیح اندازہ رہے۔"
      },
      "ramadan-charity-calculator": {
        ar: "اجمع بين العطاء اليومي المخطط للأيام المتبقية وأي مساهمة لمرة واحدة.",
        ur: "باقی ماندہ دنوں کے روزانہ عطیات اور یک وقتی صدقے کو جمع کر کے کل رقم جانیں۔"
      },
      "islamic-charity-calculator": {
        ar: "حدد مبلغ التبرع الإجمالي ووزع النسب المئوية على مجالات الخير بحيث تساوي ١٠٠٪ تماماً.",
        ur: "کل عطیہ درج کریں اور خیراتی شعبوں میں فیصد کا تناسب تقسیم کریں تاکہ مجموعہ ٹھیک ۱۰۰٪ ہو۔"
      }
    };
    return explanations[tool.slug]?.[lang] ?? toolCopy[tool.slug]?.[lang]?.short ?? t.pageIntro;
  };

  // Filter calculator tools based on category & search query
  const filteredCalculatorTools = useMemo(() => {
    return calculatorTools.filter((tool) => {
      if (selectedCategory !== "all" && tool.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const title = localizedToolTitle(tool).toLowerCase();
      const origTitle = tool.title.toLowerCase();
      const desc = localizedToolShort(tool).toLowerCase();
      const origDesc = tool.short.toLowerCase();
      const cat = tool.category.toLowerCase();
      const locCat = localizedCategory(tool.category).toLowerCase();
      return (
        title.includes(q) ||
        origTitle.includes(q) ||
        desc.includes(q) ||
        origDesc.includes(q) ||
        cat.includes(q) ||
        locCat.includes(q)
      );
    });
  }, [calculatorTools, selectedCategory, searchQuery, lang]);

  const activeTool = currentSlug ? toolBySlug[currentSlug] : null;

  // Compute related tools for the active calculator
  const relatedTools = useMemo(() => {
    if (!activeTool) return [];
    const sameCat = calculatorTools.filter(
      (t) => t.category === activeTool.category && t.slug !== activeTool.slug
    );
    const others = calculatorTools.filter(
      (t) => t.slug !== activeTool.slug && !sameCat.some((sc) => sc.slug === t.slug)
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [activeTool, calculatorTools]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] ${isRtl ? "rtl" : "ltr"}`}>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:left-4 focus:top-4 focus:bg-white focus:p-3 focus:rounded-md focus:shadow-md"
        href="#main-content"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="border-b border-[var(--line)] bg-white sticky top-0 z-40">
        <div className="page-shell flex min-h-[76px] items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              navigateTo(null, "calculators");
            }}
            className="group flex items-center gap-3 no-underline cursor-pointer border-0 bg-transparent text-left p-0"
            aria-label="Amanah Calculators"
          >
            <span className="brand-seal" aria-hidden="true">
              أ
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-[-.03em] text-[var(--ink)]">
                Amanah
              </span>
              <span className="mt-1 block text-[10px] tracking-[.13em] text-[var(--muted)]">
                CALCULATORS
              </span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                navigateTo(null, "calculators");
              }}
              className={`text-sm font-semibold transition cursor-pointer border-0 bg-transparent p-0 relative py-1 ${
                activePage === "calculators"
                  ? "text-[var(--primary)] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#AE2448]"
                  : "text-[var(--ink)] hover:text-[var(--primary)]"
              }`}
            >
              {t.calculators}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                navigateTo(null, "ramadan");
              }}
              className={`text-sm font-semibold transition cursor-pointer border-0 bg-transparent p-0 relative py-1 ${
                activePage === "ramadan"
                  ? "text-[var(--primary)] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#AE2448]"
                  : "text-[var(--ink)] hover:text-[var(--primary)]"
              }`}
            >
              {t.ramadan}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                navigateTo(null, "names");
              }}
              className={`text-sm font-semibold transition cursor-pointer border-0 bg-transparent p-0 relative py-1 ${
                activePage === "names"
                  ? "text-[var(--primary)] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#AE2448]"
                  : "text-[var(--ink)] hover:text-[var(--primary)]"
              }`}
            >
              {t.names}
            </button>

            {/* More Dropdown */}
            <div className="relative" onMouseLeave={() => setIsMoreOpen(false)}>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                onMouseEnter={() => setIsMoreOpen(true)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition cursor-pointer border-0 bg-transparent p-0 ${
                  isMoreOpen ? "text-[var(--primary)] font-bold" : "text-[var(--ink)] hover:text-[var(--primary)]"
                }`}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
              >
                <span>{t.more}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`} />
              </button>

              {isMoreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#F2EAE0] bg-white p-2 shadow-[0_16px_36px_rgba(110,26,55,0.09)] z-50 fade-up space-y-1"
                >
                  {/* Calculators link in dropdown */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setSearchQuery("");
                      navigateTo(null, "calculators");
                    }}
                    className="group w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:bg-[#F2EAE0]/50 cursor-pointer border-0 bg-transparent"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs group-hover:scale-105 transition-transform">
                      <CalcIcon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                          {t.calculators}
                        </span>
                        <span className="rounded-full bg-[#AE2448]/15 px-2 py-0.5 text-[10px] font-bold text-[#AE2448]">
                          18 {t.tools}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed m-0">
                        {lang === "ar" ? "حاسبات الزكاة والصلاة والقرآن والميراث" : lang === "ur" ? "زکوٰۃ، نماز، قرآن اور وراثت کے کیلکولیٹرز" : "Zakat, prayers, Quran pacing & inheritance"}
                      </p>
                    </div>
                  </button>

                  {/* Ramadan Tools link in dropdown */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setSearchQuery("");
                      navigateTo(null, "ramadan");
                    }}
                    className="group w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:bg-[#F2EAE0]/50 cursor-pointer border-0 bg-transparent"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs group-hover:scale-105 transition-transform">
                      <Moon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                          {t.ramadan}
                        </span>
                        <span className="rounded-full bg-[#AE2448]/15 px-2 py-0.5 text-[10px] font-bold text-[#AE2448]">
                          17 {t.tools}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed m-0">
                        {lang === "ar" ? "مخططات الصيام والقرآن والأدعية والمؤقتات" : lang === "ur" ? "روزے، قرآن، تراویح اور تسبیح کے ٹریکرز" : "Timers, planners, trackers & calendars"}
                      </p>
                    </div>
                  </button>

                  {/* Muslim Names Tools link */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setSearchQuery("");
                      navigateTo(null, "names");
                    }}
                    className="group w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:bg-[#F2EAE0]/50 cursor-pointer border-0 bg-transparent"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs group-hover:scale-105 transition-transform">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                          {t.names}
                        </span>
                        <span className="rounded-full bg-[#AE2448]/15 px-2 py-0.5 text-[10px] font-bold text-[#AE2448]">
                          13 {t.tools}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed m-0">
                        {lang === "ar" ? "ابحث واستكشف الأسماء مع المعاني الكاملة" : lang === "ur" ? "مکمل معانی کے ساتھ نام تلاش اور جنریٹ کریں" : "Find, generate & explore names with meanings"}
                      </p>
                    </div>
                  </button>

                  <div className="my-1 border-t border-[#F2EAE0]" />

                  <div className="px-3 py-2 text-xs text-[var(--muted)]/70 flex items-center justify-between">
                    <span>{t.food}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">{lang === "ar" ? "قريباً" : lang === "ur" ? "جلد آرہا ہے" : "Coming later"}</span>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <label htmlFor="language-switch" className="sr-only">
              Choose language
            </label>
            <select
              id="language-switch"
              value={lang}
              onChange={(e) => setLang(e.target.value as Locale)}
              className="rounded-md border border-[var(--line)] bg-white px-2.5 py-2 text-xs font-semibold text-[var(--primary)] focus-visible:outline cursor-pointer"
              aria-label="Choose language"
            >
              <option value="en">EN</option>
              <option value="ar">عربي</option>
              <option value="ur">اردو</option>
            </select>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <nav aria-label="Mobile navigation" className="page-shell flex gap-5 overflow-x-auto pb-3 md:hidden">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              navigateTo(null, "calculators");
            }}
            className={`whitespace-nowrap text-sm font-semibold border-0 bg-transparent cursor-pointer p-0 ${
              activePage === "calculators" ? "text-[var(--primary)] font-bold" : "text-[var(--ink)]"
            }`}
          >
            {t.calculators}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              navigateTo(null, "ramadan");
            }}
            className={`whitespace-nowrap text-sm font-semibold border-0 bg-transparent cursor-pointer p-0 ${
              activePage === "ramadan" ? "text-[var(--primary)] font-bold" : "text-[var(--ink)]"
            }`}
          >
            {t.ramadan}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              navigateTo(null, "names");
            }}
            className={`whitespace-nowrap text-sm font-semibold border-0 bg-transparent cursor-pointer p-0 ${
              activePage === "names" ? "text-[var(--primary)] font-bold" : "text-[var(--ink)]"
            }`}
          >
            {t.names}
          </button>
          <span className="whitespace-nowrap text-sm text-[var(--muted)]/60" aria-disabled="true">
            {t.food}
          </span>
          <span className="whitespace-nowrap text-sm text-[var(--muted)]/60" aria-disabled="true">
            {t.more}
          </span>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* PAGE 1: RAMADAN TOOLS */}
        {activePage === "ramadan" && (
          <div>
            {/* Breadcrumb */}
            <div className="page-shell pt-5">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <button
                  type="button"
                  onClick={() => navigateTo(null, "calculators")}
                  className="underline decoration-[#cfd3db] underline-offset-4 hover:text-[var(--primary)] border-0 bg-transparent p-0 cursor-pointer text-xs text-[var(--muted)]"
                >
                  {t.home}
                </button>
                <span aria-hidden="true">/</span>
                <span className="font-semibold text-[var(--ink)]">{t.ramadan}</span>
              </nav>
            </div>

            {/* Ramadan Dedicated Page Hero */}
            <section className="quiet-grid border-b border-[var(--line)] bg-[var(--canvas)]">
              <div className="page-shell py-12 md:py-16">
                <p className="eyebrow mb-4">{t.ramadanHeroEyebrow}</p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-[-.045em] text-[var(--ink)] md:text-[3.4rem]">
                  {t.ramadanHeroTitle}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                  {t.ramadanHeroDescription}
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-[var(--primary)]">
                  <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                    {lang === "ar" ? "١٧ أداة ومخططاً لرمضان" : lang === "ur" ? "۱۷ انٹرایکٹو ٹولز" : "17 Dedicated Ramadan Tools"}
                  </span>
                  <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                    {t.privateInputs}
                  </span>
                  <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                    {lang === "ar" ? "مؤقتات وأدعية مباشرة" : lang === "ur" ? "لائیو ٹائمرز اور دعائیں" : "Live Timers & Duas"}
                  </span>
                </div>
              </div>
            </section>

            {/* Interactive Ramadan Hub Engine */}
            <div className="page-shell py-8 md:py-12">
              <RamadanHub
                currentTool={activeTool?.category === "Ramadan Tools" ? activeTool : undefined}
                onSelectTool={(slug) => navigateTo(slug, "ramadan")}
                lang={lang}
              />

              {/* Ramadan Advisory Callout */}
              <aside className="mt-12 rounded-2xl border border-[#F2EAE0] border-s-4 border-s-[#AE2448] bg-[#AE2448]/5 p-5 md:flex md:items-center md:justify-between md:px-7 shadow-xs">
                <div>
                  <p className="eyebrow mb-2">
                    {lang === "ar" ? "فضل وبركات شهر رمضان" : lang === "ur" ? "ماہِ رمضان کے فضائل و برکات" : "VIRTUES & BLESSINGS OF RAMADAN"}
                  </p>
                  <h2 className="m-0 text-lg font-bold text-[var(--ink)]">
                    {lang === "ar" ? "اغتنام أيام وليالي الشهر المبارك" : lang === "ur" ? "مبارک مہینے کے شب و روز سے بھرپور فائدہ" : "Seizing the Days and Nights of the Blessed Month"}
                  </h2>
                  <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[var(--ink)]">
                    {lang === "ar"
                      ? "قال رسول الله ﷺ: «مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ». جميع مخططاتك وتتبع أذكارك وختماتك تُحفظ في متصفحك محلياً لضمان خصوصيتك التامة."
                      : lang === "ur"
                      ? "رسول اللہ ﷺ نے فرمایا: 'جس نے ایمان اور ثواب کی نیت سے رمضان کے روزے رکھے، اس کے پچھلے گناہ معاف کر دیے جاتے ہیں۔' آپ کا تمام منصوبہ جاتی ریکارڈ صرف آپ کے براؤزر میں محفوظ رہتا ہے۔"
                      : "The Prophet (peace be upon him) said: 'Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven.' (Sahih al-Bukhari). All your planners, schedules, and trackers are saved 100% locally in your browser."}
                  </p>
                </div>
                <span
                  className="mt-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-lg font-serif text-[var(--primary)] md:ml-8 md:mt-0 font-bold"
                  aria-hidden="true"
                >
                  i
                </span>
              </aside>
            </div>
          </div>
        )}

        {/* PAGE 2: MUSLIM NAMES */}
        {activePage === "names" && (
          <div>
            {/* Breadcrumb */}
            <div className="page-shell pt-5">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <button
                  type="button"
                  onClick={() => navigateTo(null, "calculators")}
                  className="underline decoration-[#cfd3db] underline-offset-4 hover:text-[var(--primary)] border-0 bg-transparent p-0 cursor-pointer text-xs text-[var(--muted)]"
                >
                  {t.home}
                </button>
                <span aria-hidden="true">/</span>
                <span className="font-semibold text-[var(--ink)]">{t.names}</span>
              </nav>
            </div>

            {/* Muslim Names Dedicated Page Hero */}
            <section className="quiet-grid border-b border-[var(--line)] bg-[var(--canvas)]">
              <div className="page-shell py-12 md:py-16">
                <p className="eyebrow mb-4">{t.namesHeroEyebrow}</p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-[-.045em] text-[var(--ink)] md:text-[3.4rem]">
                  {t.namesHeroTitle}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                  {t.namesHeroDescription}
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-[var(--primary)]">
                  <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                    {lang === "ar" ? "١٣ أداة متخصصة للأسماء" : lang === "ur" ? "۱۳ ناموں کے ٹولز" : "13 Dedicated Name Tools"}
                  </span>
                  <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                    {lang === "ar" ? "المعاني الكاملة لكل اسم" : lang === "ur" ? "ہر نام کا مستند معنی" : "Meanings on Every Name"}
                  </span>
                  <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                    {lang === "ar" ? "نطق صوتي وأصول لغوية" : lang === "ur" ? "آڈیو تلفظ اور لسانی بنیاد" : "Audio Pronunciation & Origins"}
                  </span>
                </div>
              </div>
            </section>

            {/* Interactive Muslim Names Hub Engine */}
            <div className="page-shell py-8 md:py-12">
              <MuslimNamesHub
                currentTool={activeTool?.category === "Muslim Names Tools" ? activeTool : undefined}
                onSelectTool={(slug) => navigateTo(slug, "names")}
                lang={lang}
              />

              {/* Muslim Names Advisory Callout */}
              <aside className="mt-12 rounded-2xl border border-[#F2EAE0] border-s-4 border-s-[#AE2448] bg-[#AE2448]/5 p-5 md:flex md:items-center md:justify-between md:px-7 shadow-xs">
                <div>
                  <p className="eyebrow mb-2">
                    {lang === "ar" ? "هدي النبوة في الأسماء" : lang === "ur" ? "ناموں کے بارے میں نبوی رہنمائی" : "PROPHETIC GUIDANCE ON NAMES"}
                  </p>
                  <h2 className="m-0 text-lg font-bold text-[var(--ink)]">
                    {lang === "ar" ? "أهمية اختيار الاسم الحسن والمبارك" : lang === "ur" ? "اچھے اور بابرکت نام کی اہمیت" : "The Spiritual Significance of Beautiful Names"}
                  </h2>
                  <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[var(--ink)]">
                    {lang === "ar"
                      ? "قال رسول الله ﷺ: «إنكم تُدْعَون يوم القيامة بأسمائكم وأسماء آبائكم، فأحسِنوا أسماءكم». جميع الأسماء هنا تتضمن المعاني الموثقة والنطق والجذور اللغوية."
                      : lang === "ur"
                      ? "نبی کریم ﷺ نے فرمایا: 'قیامت کے دن تم اپنے اور اپنے آباء کے ناموں سے پکارے جاؤ گے، پس اپنے نام اچھے رکھو۔' یہاں ہر نام کے ساتھ اس کا مستند مفہوم درج ہے۔"
                      : "The Prophet (peace be upon him) taught: 'You will be called on the Day of Resurrection by your names and your fathers' names, so make your names good.' (Abu Dawood). Every name here displays its verified meaning, Arabic script, and spiritual resonance."}
                  </p>
                </div>
                <span
                  className="mt-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-lg font-serif text-[var(--primary)] md:ml-8 md:mt-0 font-bold"
                  aria-hidden="true"
                >
                  i
                </span>
              </aside>
            </div>
          </div>
        )}

        {/* PAGE 3: ISLAMIC CALCULATORS */}
        {activePage === "calculators" && (
          <>
            {currentSlug && activeTool && activeTool.category !== "Ramadan Tools" && activeTool.category !== "Muslim Names Tools" ? (
              /* Single Calculator Detail View */
              <div className="page-shell py-6">
                {/* Breadcrumb & Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-[var(--line)] mb-6 text-xs text-[var(--muted)]">
                  <nav aria-label="Breadcrumb" className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigateTo(null, "calculators")}
                      className="underline decoration-[#cfd3db] underline-offset-4 hover:text-[var(--primary)] border-0 bg-transparent p-0 cursor-pointer text-xs text-[var(--muted)]"
                    >
                      {t.calculators}
                    </button>
                    <span aria-hidden="true">/</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(activeTool.category);
                        navigateTo(null, "calculators");
                      }}
                      className="underline decoration-[#cfd3db] underline-offset-4 hover:text-[var(--primary)] border-0 bg-transparent p-0 cursor-pointer text-xs text-[var(--muted)]"
                    >
                      {localizedCategory(activeTool.category)}
                    </button>
                    <span aria-hidden="true">/</span>
                    <span className="font-semibold text-[var(--ink)]">
                      {localizedToolTitle(activeTool)}
                    </span>
                  </nav>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="rounded-lg bg-[#AE2448] hover:bg-[#8C2448] text-white px-3.5 py-1.5 text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer border-0 flex items-center gap-1.5"
                    >
                      {copiedLink && <Check className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? (lang === "ar" ? "تم النسخ!" : lang === "ur" ? "کاپی ہوگیا!" : "Copied!") : (lang === "ar" ? "نسخ الرابط" : lang === "ur" ? "لنک کاپی کریں" : "Share link")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo(null, "calculators")}
                      className="rounded-lg border border-[#AE2448] bg-white text-[#6E1A37] hover:bg-[#AE2448] hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                    >
                      {lang === "ar" ? "← العودة إلى كل الحاسبات" : lang === "ur" ? "← تمام ٹولز پر واپس" : "← All calculators"}
                    </button>
                  </div>
                </div>

                {/* Header for Calculator */}
                <header className="mb-7 max-w-3xl fade-up">
                  <p className="eyebrow mb-2">
                    <span>{localizedCategory(activeTool.category)}</span> / <span>{t.estimateIntro}</span>
                  </p>
                  <h1 className="m-0 text-3xl font-semibold leading-tight tracking-[-.04em] md:text-4xl text-[var(--ink)]">
                    {localizedToolTitle(activeTool)}
                  </h1>
                  <p className="mb-0 mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
                    {localizedToolExplanation(activeTool)}
                  </p>
                </header>

                {/* Calculator Engine */}
                <Calculator tool={activeTool} />

                {/* Related Calculators */}
                {relatedTools.length > 0 && (
                  <section className="mb-10 mt-14" aria-labelledby="related-heading">
                    <div className="mb-5 flex items-end justify-between border-b border-[var(--line)] pb-3">
                      <div>
                        <p className="eyebrow mb-1">{t.continueExploring}</p>
                        <h2 id="related-heading" className="m-0 text-xl font-semibold tracking-[-.03em]">
                          {t.relatedCalculators}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateTo(null, "calculators")}
                        className="text-sm font-semibold text-[var(--primary)] underline-offset-4 hover:underline border-0 bg-transparent p-0 cursor-pointer"
                      >
                        {t.browseAll}
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {relatedTools.map((item) => {
                        const IconComp = getToolIcon(item);
                        return (
                          <button
                            type="button"
                            key={item.slug}
                            onClick={() => navigateTo(item.slug, "calculators")}
                            className="group text-left relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#F2EAE0] bg-white p-5 sm:p-6 no-underline interactive-card hover:border-[#AE2448] hover:bg-[#F2EAE0]/40 cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                                    <IconComp className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                  <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                                    {localizedCategory(item.category)}
                                  </span>
                                </div>
                              </div>
                              <h3 className="mb-1.5 text-base font-bold text-[var(--ink)] leading-snug group-hover:text-[var(--primary)] transition-colors">
                                {localizedToolTitle(item)}
                              </h3>
                              <p className="m-0 text-xs sm:text-sm leading-relaxed text-[#262626]">
                                {localizedToolShort(item)}
                              </p>
                            </div>
                            <div className="mt-4 pt-3.5 border-t border-[#F2EAE0] flex items-center justify-between">
                              <span className="text-xs font-bold text-[#6E1A37] group-hover:text-[var(--primary)] transition-colors">
                                {t.open}
                              </span>
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#AE2448] text-white group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-200 shadow-xs">
                                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            ) : currentSlug && !activeTool ? (
              /* 404 Not Found State */
              <section className="page-shell py-16 md:py-24 text-center">
                <p className="eyebrow mb-3">404</p>
                <h1 className="m-0 text-4xl font-semibold tracking-[-.04em]">
                  {t.notFoundTitle}
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-[var(--muted)]">
                  {t.notFoundDescription}
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo(null, "calculators")}
                  className="mt-7 inline-flex rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[var(--primary-hover)] cursor-pointer border-0"
                >
                  {t.returnToCalculators}
                </button>
              </section>
            ) : (
              /* Calculators Directory Main Listing Page */
              <>
                {/* Breadcrumb */}
                <div className="page-shell pt-5">
                  <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="font-semibold text-[var(--ink)]">{t.breadcrumbCategory}</span>
                  </nav>
                </div>

                {/* Calculators Dedicated Page Hero */}
                <section className="quiet-grid border-b border-[var(--line)] bg-[var(--canvas)]">
                  <div className="page-shell py-12 md:py-16">
                    <p className="eyebrow mb-4">{t.heroEyebrow}</p>
                    <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-[-.045em] text-[var(--ink)] md:text-[3.4rem]">
                      {t.heroTitle}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                      {t.heroDescription}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-[var(--primary)]">
                      <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                        {t.practicalTools}
                      </span>
                      <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                        {t.privateInputs}
                      </span>
                      <span className="rounded-full border border-[#F2EAE0] bg-[#F2EAE0]/70 text-[var(--ink)] px-3.5 py-2 shadow-xs">
                        {t.notRulings}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Calculators Explorer Section */}
                <section className="page-shell py-10 md:py-14">
                  <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="eyebrow mb-2">{t.exploreEyebrow}</p>
                      <h2 className="m-0 text-2xl font-semibold tracking-[-.035em]">
                        {t.findTool}
                      </h2>
                    </div>
                    <p className="m-0 max-w-lg text-sm leading-6 text-[var(--muted)]">
                      {t.findDescription}
                    </p>
                  </div>

                  {/* Search Control */}
                  <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <input
                        type="search"
                        placeholder={lang === "ar" ? "ابحث عن حاسبة أو كلمة مفتاحية..." : lang === "ur" ? "حاسبہ یا عنوان تلاش کریں..." : "Search calculators by name or topic..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-[#F2EAE0] bg-white px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[#888f9e] focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/15 outline-none transition-all shadow-2xs"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-2.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer border-0 bg-transparent flex items-center justify-center"
                          aria-label="Clear search"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pure Calculator Category Filter Pills */}
                  <div className="mb-8 flex flex-wrap gap-2" aria-label="Calculator categories">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer border ${
                        selectedCategory === "all"
                          ? "bg-[var(--primary)] !text-white border-[var(--primary)] shadow-xs"
                          : "bg-white text-[var(--ink)] border-[#F2EAE0] hover:border-[#AE2448] hover:bg-[#F2EAE0]/50"
                      }`}
                    >
                      <span>{lang === "ar" ? "كل الحاسبات" : lang === "ur" ? "تمام کیلکولیٹرز" : "All Calculators"}</span>
                      <span className={`ml-2 ${selectedCategory === "all" ? "text-white/90" : "text-[var(--ink)]/75"}`}>
                        {calculatorTools.length}
                      </span>
                    </button>
                    {calculatorCategories.map((group) => {
                      const count = calculatorTools.filter((tool) => tool.category === group).length;
                      const isSelected = selectedCategory === group;
                      return (
                        <button
                          type="button"
                          key={group}
                          onClick={() => setSelectedCategory(isSelected ? "all" : group)}
                          className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "bg-[var(--primary)] !text-white border-[var(--primary)] shadow-xs"
                              : "bg-white text-[var(--ink)] border-[#F2EAE0] hover:border-[#AE2448] hover:bg-[#F2EAE0]/50"
                          }`}
                        >
                          <span>{localizedCategory(group)}</span>
                          <span className={`ml-2 ${isSelected ? "text-white/90" : "text-[var(--ink)]/75"}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Calculator Groups */}
                  {selectedCategory === "all" && !searchQuery.trim() ? (
                    // Grouped by Category view
                    calculatorCategories.map((group, index) => {
                      const groupTools = calculatorTools.filter((tool) => tool.category === group);
                      return (
                        <section
                          id={`group-${index}`}
                          key={group}
                          className="mb-12 scroll-mt-8"
                          aria-labelledby={`heading-${index}`}
                        >
                          <div className="mb-4 flex items-baseline justify-between border-b border-[var(--line)] pb-3">
                            <h3 id={`heading-${index}`} className="m-0 text-lg font-semibold tracking-[-.02em]">
                              {localizedCategory(group)}
                            </h3>
                            <span className="text-xs text-[var(--muted)]">
                              {String(groupTools.length).padStart(2, "0")} <span>{t.tools}</span>
                            </span>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {groupTools.map((tool, toolIndex) => {
                              const IconComp = getToolIcon(tool);
                              return (
                                <button
                                  type="button"
                                  key={tool.slug}
                                  onClick={() => navigateTo(tool.slug, "calculators")}
                                  className="group text-left relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#F2EAE0] bg-white p-5 sm:p-6 no-underline interactive-card hover:border-[#AE2448] hover:bg-[#F2EAE0]/40 cursor-pointer"
                                >
                                  <div>
                                    {/* Header: Icon + Category + Number */}
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                      <div className="flex items-center gap-2.5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                                          <IconComp className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                                          {localizedCategory(tool.category)}
                                        </span>
                                      </div>
                                      <span className="font-mono text-xs font-bold text-[#6E1A37]/60">
                                        {String(toolIndex + 1).padStart(2, "0")}
                                      </span>
                                    </div>

                                    {/* Title */}
                                    <h4 className="mb-1.5 text-base sm:text-lg font-bold leading-snug tracking-[-.02em] text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                                      {localizedToolTitle(tool)}
                                    </h4>

                                    {/* Description */}
                                    <p className="m-0 text-xs sm:text-sm leading-relaxed text-[#262626]">
                                      {localizedToolShort(tool)}
                                    </p>
                                  </div>

                                  {/* Tidy Bottom Action Bar */}
                                  <div className="mt-4 pt-3.5 border-t border-[#F2EAE0] flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#6E1A37] group-hover:text-[var(--primary)] transition-colors">
                                      {t.openCalculator}
                                    </span>
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#AE2448] text-white group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-200 shadow-xs">
                                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      );
                    })
                  ) : (
                    // Filtered List View
                    <div className="mb-12">
                      <div className="mb-4 flex items-baseline justify-between border-b border-[var(--line)] pb-3">
                        <h3 className="m-0 text-lg font-semibold tracking-[-.02em]">
                          {selectedCategory !== "all"
                            ? localizedCategory(selectedCategory)
                            : (lang === "ar" ? "نتائج البحث" : lang === "ur" ? "تلاش کے نتائج" : "Search results")}
                        </h3>
                        <span className="text-xs text-[var(--muted)]">
                          {String(filteredCalculatorTools.length).padStart(2, "0")} <span>{t.tools}</span>
                        </span>
                      </div>
                      {filteredCalculatorTools.length === 0 ? (
                        <div className="rounded-xl border border-[var(--line)] bg-[var(--canvas)] p-8 text-center">
                          <p className="m-0 text-sm text-[var(--muted)]">
                            {lang === "ar"
                              ? "لم يتم العثور على حاسبات مطابقة."
                              : lang === "ur"
                              ? "کوئی مماثل کیلکولیٹر نہیں ملا۔"
                              : "No calculators match your search or filter."}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedCategory("all");
                            }}
                            className="mt-3 text-xs font-semibold text-[var(--primary)] underline cursor-pointer border-0 bg-transparent"
                          >
                            {lang === "ar" ? "إعادة ضبط التصفية" : lang === "ur" ? "فلٹر ری سیٹ کریں" : "Reset filters"}
                          </button>
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredCalculatorTools.map((tool, toolIndex) => {
                            const IconComp = getToolIcon(tool);
                            return (
                              <button
                                type="button"
                                key={tool.slug}
                                onClick={() => navigateTo(tool.slug, "calculators")}
                                className="group text-left relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#F2EAE0] bg-white p-5 sm:p-6 no-underline interactive-card hover:border-[#AE2448] hover:bg-[#F2EAE0]/40 cursor-pointer"
                              >
                                <div>
                                  {/* Header: Icon + Category + Number */}
                                  <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#AE2448] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                                        <IconComp className="h-4 w-4" aria-hidden="true" />
                                      </span>
                                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                                        {localizedCategory(tool.category)}
                                      </span>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-[#6E1A37]/60">
                                      {String(toolIndex + 1).padStart(2, "0")}
                                    </span>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mb-1.5 text-base sm:text-lg font-bold leading-snug tracking-[-.02em] text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                                    {localizedToolTitle(tool)}
                                  </h4>

                                  {/* Description */}
                                  <p className="m-0 text-xs sm:text-sm leading-relaxed text-[#262626]">
                                    {localizedToolShort(tool)}
                                  </p>
                                </div>

                                {/* Tidy Bottom Action Bar */}
                                <div className="mt-4 pt-3.5 border-t border-[#F2EAE0] flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#6E1A37] group-hover:text-[var(--primary)] transition-colors">
                                    {t.openCalculator}
                                  </span>
                                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#AE2448] text-white group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-200 shadow-xs">
                                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Calculator Advisory Callout */}
                  <aside className="rounded-2xl border border-[#F2EAE0] border-s-4 border-s-[#AE2448] bg-[#AE2448]/5 p-5 md:flex md:items-center md:justify-between md:px-7 shadow-xs">
                    <div>
                      <p className="eyebrow mb-2">
                        {t.estimateEyebrow}
                      </p>
                      <h2 className="m-0 text-lg font-bold text-[var(--ink)]">
                        {t.estimateTitle}
                      </h2>
                      <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[var(--ink)]">
                        {t.estimateDescription}
                      </p>
                    </div>
                    <span
                      className="mt-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-lg font-serif text-[var(--primary)] md:ml-8 md:mt-0 font-bold"
                      aria-hidden="true"
                    >
                      i
                    </span>
                  </aside>
                </section>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#8C2448] bg-[#AE2448] text-white">
        <div className="page-shell flex flex-col justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="brand-seal !h-8 !w-8 text-base !border-white !text-white" aria-hidden="true">
              أ
            </span>
            <span className="text-sm font-bold text-white">Amanah Calculators</span>
          </div>
          <p className="m-0 text-sm font-medium text-white/90">{t.footerNote}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              navigateTo(null);
            }}
            className="text-sm font-bold text-white underline-offset-4 hover:underline hover:text-[#F2EAE0] border-0 bg-transparent p-0 cursor-pointer text-left transition-colors"
          >
            {t.allTools}
          </button>
        </div>
      </footer>
    </div>
  );
}

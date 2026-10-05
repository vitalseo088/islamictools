/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from "react";
import Calculator from "./components/Calculator";
import { tools, toolBySlug, type Tool } from "./data/tools";
import { categoryCopy, siteCopy, toolCopy, type Locale } from "./data/locales";

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
      } else if (hash && toolBySlug[hash]) {
        return hash;
      }

      const match = path.match(/\/calculators\/([^/]+)/);
      if (match && match[1]) {
        return match[1];
      }
    } catch {
      // ignore
    }
    return null;
  };

  const [currentSlug, setCurrentSlug] = useState<string | null>(getSlugFromLocation);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

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
      setCurrentSlug(getSlugFromLocation());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (slug: string | null) => {
    setCurrentSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const targetUrl = slug ? `/calculators/${slug}/` : "/calculators/";
    try {
      window.history.pushState({}, "", targetUrl);
    } catch {
      // fallback
    }
  };

  const t = siteCopy[lang] || siteCopy.en;
  const isRtl = lang === "ar" || lang === "ur";

  const categories = useMemo(() => {
    return Array.from(new Set(tools.map((t) => t.category)));
  }, []);

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

  // Filter tools based on category & search query
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
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
  }, [selectedCategory, searchQuery, lang]);

  const activeTool = currentSlug ? toolBySlug[currentSlug] : null;

  // Compute related tools for the active tool
  const relatedTools = useMemo(() => {
    if (!activeTool) return [];
    const sameCat = tools.filter(
      (t) => t.category === activeTool.category && t.slug !== activeTool.slug
    );
    const others = tools.filter(
      (t) => t.slug !== activeTool.slug && !sameCat.some((sc) => sc.slug === t.slug)
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [activeTool]);

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
              navigateTo(null);
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

          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                navigateTo(null);
              }}
              className={`text-sm font-semibold transition cursor-pointer border-0 bg-transparent p-0 ${
                !currentSlug && selectedCategory === "all"
                  ? "text-[var(--primary)] font-bold"
                  : "text-[#555f72] hover:text-[var(--primary)]"
              }`}
            >
              {t.calculators}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("Ramadan");
                setSearchQuery("");
                navigateTo(null);
              }}
              className={`text-sm font-semibold transition cursor-pointer border-0 bg-transparent p-0 ${
                !currentSlug && selectedCategory === "Ramadan"
                  ? "text-[var(--primary)] font-bold"
                  : "text-[#555f72] hover:text-[var(--primary)]"
              }`}
            >
              {t.ramadan}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("Zakat");
                setSearchQuery("");
                navigateTo(null);
              }}
              className={`text-sm font-semibold transition cursor-pointer border-0 bg-transparent p-0 ${
                !currentSlug && selectedCategory === "Zakat"
                  ? "text-[var(--primary)] font-bold"
                  : "text-[#555f72] hover:text-[var(--primary)]"
              }`}
            >
              {t.finance}
            </button>
            <span
              className="cursor-not-allowed text-sm text-[#8a94a6]"
              aria-disabled="true"
              title="Coming later"
            >
              {t.food}
            </span>
            <span
              className="cursor-not-allowed text-sm text-[#8a94a6]"
              aria-disabled="true"
              title="Coming later"
            >
              {t.more}
            </span>
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
              navigateTo(null);
            }}
            className={`whitespace-nowrap text-sm font-semibold border-0 bg-transparent cursor-pointer p-0 ${
              !currentSlug && selectedCategory === "all" ? "text-[var(--primary)]" : "text-[#555f72]"
            }`}
          >
            {t.calculators}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Ramadan");
              setSearchQuery("");
              navigateTo(null);
            }}
            className={`whitespace-nowrap text-sm font-semibold border-0 bg-transparent cursor-pointer p-0 ${
              !currentSlug && selectedCategory === "Ramadan" ? "text-[var(--primary)]" : "text-[#555f72]"
            }`}
          >
            {t.ramadan}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Zakat");
              setSearchQuery("");
              navigateTo(null);
            }}
            className={`whitespace-nowrap text-sm font-semibold border-0 bg-transparent cursor-pointer p-0 ${
              !currentSlug && selectedCategory === "Zakat" ? "text-[var(--primary)]" : "text-[#555f72]"
            }`}
          >
            {t.finance}
          </button>
          <span className="whitespace-nowrap text-sm text-[#8a94a6]" aria-disabled="true">
            {t.food}
          </span>
          <span className="whitespace-nowrap text-sm text-[#8a94a6]" aria-disabled="true">
            {t.more}
          </span>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {currentSlug ? (
          activeTool ? (
            /* Calculator Detail Page */
            <div className="page-shell py-6">
              {/* Breadcrumb & Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-[var(--line)] mb-6 text-xs text-[var(--muted)]">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo(null)}
                    className="underline decoration-[#cfd3db] underline-offset-4 hover:text-[var(--primary)] border-0 bg-transparent p-0 cursor-pointer text-xs text-[var(--muted)]"
                  >
                    {t.calculators}
                  </button>
                  <span aria-hidden="true">/</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(activeTool.category);
                      navigateTo(null);
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
                    className="rounded-md border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--canvas)] transition cursor-pointer"
                  >
                    {copiedLink ? (lang === "ar" ? "تم النسخ!" : lang === "ur" ? "کاپی ہوگیا!" : "Copied!") : (lang === "ar" ? "نسخ الرابط" : lang === "ur" ? "لنک کاپی کریں" : "Share link")}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo(null)}
                    className="rounded-md border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--canvas)] transition cursor-pointer"
                  >
                    {lang === "ar" ? "← العودة إلى كل الحاسبات" : lang === "ur" ? "← تمام ٹولز پر واپس" : "← All calculators"}
                  </button>
                </div>
              </div>

              {/* Header for Calculator */}
              <header className="mb-7 max-w-3xl">
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

              {/* Interactive Calculator Engine */}
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
                      onClick={() => navigateTo(null)}
                      className="text-sm font-semibold text-[var(--primary)] underline-offset-4 hover:underline border-0 bg-transparent p-0 cursor-pointer"
                    >
                      {t.browseAll}
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {relatedTools.map((item) => (
                      <button
                        type="button"
                        key={item.slug}
                        onClick={() => navigateTo(item.slug)}
                        className="group text-left rounded-xl border border-[var(--line)] bg-white p-5 no-underline transition hover:border-[#a6afbd] hover:shadow-[0_7px_20px_rgba(37,43,62,.08)] cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--secondary-ink)]">
                            {localizedCategory(item.category)}
                          </span>
                          <h3 className="mb-1 mt-2 text-sm font-semibold text-[var(--ink)]">
                            {localizedToolTitle(item)}
                          </h3>
                          <p className="m-0 text-xs leading-5 text-[var(--muted)]">
                            {localizedToolShort(item)}
                          </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)]">
                          <span>{t.open}</span>
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
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
                onClick={() => navigateTo(null)}
                className="mt-7 inline-flex rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#23283B] cursor-pointer border-0"
              >
                {t.returnToCalculators}
              </button>
            </section>
          )
        ) : (
          /* Directory / Collection Listing Page */
          <>
            {/* Breadcrumb */}
            <div className="page-shell pt-5">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="font-semibold text-[var(--ink)]">{t.breadcrumbCategory}</span>
              </nav>
            </div>

            {/* Hero Section */}
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
                  <span className="rounded-full border border-[#d7dce3] bg-white px-3.5 py-2 shadow-xs">
                    {t.practicalTools}
                  </span>
                  <span className="rounded-full border border-[#d7dce3] bg-white px-3.5 py-2 shadow-xs">
                    {t.privateInputs}
                  </span>
                  <span className="rounded-full border border-[#d7dce3] bg-white px-3.5 py-2 shadow-xs">
                    {t.notRulings}
                  </span>
                </div>
              </div>
            </section>

            {/* Explorer Section */}
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

              {/* Search & Category Filter Controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="search"
                    placeholder={lang === "ar" ? "ابحث عن حاسبة أو كلمة مفتاحية..." : lang === "ur" ? "حاسبہ یا عنوان تلاش کریں..." : "Search calculators by name or topic..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm placeholder:text-[#888f9e] focus:border-[var(--primary)] outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer border-0 bg-transparent"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills */}
              <div className="mb-8 flex flex-wrap gap-2" aria-label="Calculator categories">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer border-0 ${
                    selectedCategory === "all"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--highlight)] text-[var(--primary)] hover:bg-[#d7cfb2]"
                  }`}
                >
                  <span>{lang === "ar" ? "الكل" : lang === "ur" ? "تمام" : "All"}</span>
                  <span className={`ml-2 ${selectedCategory === "all" ? "text-white/80" : "text-[#555b68]"}`}>
                    {tools.length}
                  </span>
                </button>
                {categories.map((group) => {
                  const count = tools.filter((tool) => tool.category === group).length;
                  const isSelected = selectedCategory === group;
                  return (
                    <button
                      type="button"
                      key={group}
                      onClick={() => setSelectedCategory(isSelected ? "all" : group)}
                      className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer border-0 ${
                        isSelected
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--highlight)] text-[var(--primary)] hover:bg-[#d7cfb2]"
                      }`}
                    >
                      <span>{localizedCategory(group)}</span>
                      <span className={`ml-2 ${isSelected ? "text-white/80" : "text-[#555b68]"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Category Tool Groups */}
              {selectedCategory === "all" && !searchQuery.trim() ? (
                // Grouped by Category view
                categories.map((group, index) => {
                  const groupTools = tools.filter((tool) => tool.category === group);
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
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {groupTools.map((tool, toolIndex) => (
                          <button
                            type="button"
                            key={tool.slug}
                            onClick={() => navigateTo(tool.slug)}
                            className="group text-left relative flex min-h-[155px] flex-col justify-between overflow-hidden rounded-xl border border-[var(--line)] bg-white p-5 no-underline transition duration-200 hover:-translate-y-0.5 hover:border-[#a6afbd] hover:shadow-[0_9px_24px_rgba(37,43,62,.08)] cursor-pointer"
                          >
                            <span className="absolute right-4 top-4 font-mono text-[10px] text-[#858b97]">
                              {String(toolIndex + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <span className="mb-3 inline-block rounded-xs border-l-2 border-[var(--secondary-ink)] bg-[var(--highlight)] px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-[var(--primary)]">
                                {localizedCategory(tool.category)}
                              </span>
                              <h4 className="mb-2 mt-1 pr-8 text-base font-semibold text-[var(--ink)]">
                                {localizedToolTitle(tool)}
                              </h4>
                              <p className="m-0 text-sm leading-5 text-[var(--muted)]">
                                {localizedToolShort(tool)}
                              </p>
                            </div>
                            <span className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                              <span>{t.openCalculator}</span>
                              <span
                                aria-hidden="true"
                                className="transition-transform group-hover:translate-x-1"
                              >
                                →
                              </span>
                            </span>
                          </button>
                        ))}
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
                      {String(filteredTools.length).padStart(2, "0")} <span>{t.tools}</span>
                    </span>
                  </div>
                  {filteredTools.length === 0 ? (
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
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredTools.map((tool, toolIndex) => (
                        <button
                          type="button"
                          key={tool.slug}
                          onClick={() => navigateTo(tool.slug)}
                          className="group text-left relative flex min-h-[155px] flex-col justify-between overflow-hidden rounded-xl border border-[var(--line)] bg-white p-5 no-underline transition duration-200 hover:-translate-y-0.5 hover:border-[#a6afbd] hover:shadow-[0_9px_24px_rgba(37,43,62,.08)] cursor-pointer"
                        >
                          <span className="absolute right-4 top-4 font-mono text-[10px] text-[#858b97]">
                            {String(toolIndex + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <span className="mb-3 inline-block rounded-xs border-l-2 border-[var(--secondary-ink)] bg-[var(--highlight)] px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-[var(--primary)]">
                              {localizedCategory(tool.category)}
                            </span>
                            <h4 className="mb-2 mt-1 pr-8 text-base font-semibold text-[var(--ink)]">
                              {localizedToolTitle(tool)}
                            </h4>
                            <p className="m-0 text-sm leading-5 text-[var(--muted)]">
                              {localizedToolShort(tool)}
                            </p>
                          </div>
                          <span className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                            <span>{t.openCalculator}</span>
                            <span
                              aria-hidden="true"
                              className="transition-transform group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Estimate Advisory Callout */}
              <aside className="rounded-xl border border-[#c9c1a0] bg-[var(--highlight)] p-5 md:flex md:items-center md:justify-between md:px-7">
                <div>
                  <p className="eyebrow mb-2">{t.estimateEyebrow}</p>
                  <h2 className="m-0 text-lg font-semibold">{t.estimateTitle}</h2>
                  <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    {t.estimateDescription}
                  </p>
                </div>
                <span
                  className="mt-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8f8a70] text-lg font-serif text-[var(--primary)] md:ml-8 md:mt-0"
                  aria-hidden="true"
                >
                  i
                </span>
              </aside>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#9fadb8] bg-[var(--secondary)]">
        <div className="page-shell flex flex-col justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="brand-seal !h-8 !w-8 text-base" aria-hidden="true">
              أ
            </span>
            <span className="text-sm font-semibold">Amanah Calculators</span>
          </div>
          <p className="m-0 text-sm text-[var(--muted)]">{t.footerNote}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              navigateTo(null);
            }}
            className="text-sm font-semibold text-[var(--primary)] underline-offset-4 hover:underline border-0 bg-transparent p-0 cursor-pointer text-left"
          >
            {t.allTools}
          </button>
        </div>
      </footer>
    </div>
  );
}

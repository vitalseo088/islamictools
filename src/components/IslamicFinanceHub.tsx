import { useState, useEffect, useMemo } from "react";
import {
  Coins,
  Building2,
  TrendingUp,
  PieChart,
  Scale,
  ShieldCheck,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Copy,
  Info,
  DollarSign,
  HeartHandshake,
  Sparkles,
  Calculator,
  ArrowRight
} from "lucide-react";
import { Tool, tools } from "../data/tools";
import type { Locale } from "../data/locales";

interface IslamicFinanceHubProps {
  currentTool?: Tool | null;
  onSelectTool: (slug: string) => void;
  lang?: Locale;
}

const fCopy: Record<Locale, Record<string, string>> = {
  en: {
    hubTitle: "Islamic Finance & Halal Money Tools",
    hubSubtitle: "Suite of 15 Sharia-compliant calculators for investment growth, Zakat on stocks, crypto, gold & business, Murabaha financing, Mahr, and Waqf endowments.",
    privacyBadge: "100% Private & Saved Locally in Your Browser",
    privacyNotice: "All your financial calculations, portfolio entries, mahr balances, savings targets, and charity allocations are stored in your browser's local storage only. No financial data is transmitted to external servers.",
    resetAllData: "Reset Local Financial Data",
    copied: "Copied!",
    calculate: "Calculate Result",
    resultSummary: "Calculation Breakdown",
    netValue: "Estimated Net Amount",
    zakatDue: "Zakat Due (2.5%)",
    nisabThreshold: "Nisab Threshold ($650)",
    goldNisabThreshold: "Gold Nisab (85g)",
    silverNisabThreshold: "Silver Nisab (612.36g)",
    monthlyProfit: "Expected Monthly Return",
    totalPortfolio: "Total Portfolio Value",
    equityShare: "Equity Share",
    sukukShare: "Sukuk & Cash Share",
    murabahaCost: "Total Murabaha Purchase Cost",
    monthlyInstallment: "Monthly Installment",
    waqfImpact: "Annual Waqf Endowment Yield",
    sadaqahGoal: "Annual Sadaqah Goal Progress"
  },
  ar: {
    hubTitle: "أدوات وحاسبات المالية الإسلامية والمال الحلال",
    hubSubtitle: "مجموعة شاملة تضم ١٥ حاسبة مطابقة للشريعة الإسلامية للاستثمار الحلال، زكاة الأسهم والعملات والذهب والتجارة، تمويل المرابحة، وحسابات الوقف والصدقة.",
    privacyBadge: "خصوصية تامة - تُحفظ بياناتك المالية في متصفحك محلياً",
    privacyNotice: "جميع حساباتك المالية وتوزيعات المحفظة ورصيد المهر وحسابات الزكاة والصدقات تُحفظ في ذاكرة متصفحك المحلية فقط، ولا يتم إرسال أي بيانات مالية لخوادم خارجية.",
    resetAllData: "إعادة ضبط البيانات المالية",
    copied: "تم النسخ!",
    calculate: "احسب النتيجة",
    resultSummary: "تفاصيل الحساب",
    netValue: "الصافي المالي المترتب",
    zakatDue: "مقدار الزكاة الواجبة (٢.٥٪)",
    nisabThreshold: "حد النصاب النظري ($٦٥٠)",
    goldNisabThreshold: "نصاب الذهب (٨٥ غراماً)",
    silverNisabThreshold: "نصاب الفضة (٦١٢.٣٦ غراماً)",
    monthlyProfit: "العائد الشهري المتوقع",
    totalPortfolio: "إجمالي قيمة المحفظة",
    equityShare: "نسبة الأسهم",
    sukukShare: "نسبة الصكوك والنقد",
    murabahaCost: "إجمالي تكلفة الشراء بالمرابحة",
    monthlyInstallment: "القسط الشهري",
    waqfImpact: "العائد السنوي للوقف الخيرّي",
    sadaqahGoal: "نسبة تحقق هدف الصدقة السنوي"
  },
  ur: {
    hubTitle: "اسلامی مالیات و حلال منی ٹولز",
    hubSubtitle: "حلال سرمایہ کاری، حصص، کرپٹو، سونا، تجارت، مرابحہ فنانسنگ، مہر اور وقف کی ۱۵ شرعی حاسبات۔",
    privacyBadge: "مکمل رازداری - تمام مالیاتی ڈیٹا آپ کے براؤزر میں محفوظ ہے",
    privacyNotice: "آپ کے تمام مالیاتی حسابات، پورٹ فولیو، مہر کی رقم، بچت کے اہداف اور صدقات کا حساب صرف آپ کے براؤزر کے لوکل اسٹوریج میں محفوظ رہتا ہے۔",
    resetAllData: "مالیاتی ڈیٹا ری سیٹ کریں",
    copied: "کاپی ہو گیا!",
    calculate: "حساب لگائیں",
    resultSummary: "حساب کی تفصیل",
    netValue: "مجموعی صافی رقم",
    zakatDue: "واجب الادا زکوٰۃ (۲.۵٪)",
    nisabThreshold: "نصاب کی حد ($۶۵۰)",
    goldNisabThreshold: "سونے کا نصاب (۸۵ گرام)",
    silverNisabThreshold: "چاندی کا نصاب (۶۱۲.۳۶ گرام)",
    monthlyProfit: "متوقع ماہانہ منافع",
    totalPortfolio: "پورٹ فولیو کی کل مالیت",
    equityShare: "ایکویٹی کا حصہ",
    sukukShare: "صکوک و نقدی کا حصہ",
    murabahaCost: "مرابحہ کی کل خرید لاگت",
    monthlyInstallment: "ماہانہ قسط",
    waqfImpact: "وقف کی سالانہ متوقع آمدنی",
    sadaqahGoal: "سالانہ صدقہ کے ہدف کی پیشرفت"
  }
};

export default function IslamicFinanceHub({ currentTool, onSelectTool, lang = "en" }: IslamicFinanceHubProps) {
  const activeSlug = currentTool?.slug || "";
  const t = fCopy[lang] || fCopy.en;
  const isRtl = lang === "ar" || lang === "ur";

  const financeTools = useMemo(
    () => tools.filter((tool) => tool.category === "Islamic Finance Tools"),
    []
  );

  // State 1: Investment Calculator
  const [invInitial, setInvInitial] = useState(10000);
  const [invMonthly, setInvMonthly] = useState(500);
  const [invReturn, setInvReturn] = useState(7);
  const [invYears, setInvYears] = useState(10);

  // State 2: Gold Zakat Calculator
  const [goldGram24, setGoldGram24] = useState(50);
  const [goldPrice24, setGoldPrice24] = useState(75);
  const [goldNisabGrams, setGoldNisabGrams] = useState(85);

  // State 3: Silver Zakat Calculator
  const [silverGrams, setSilverGrams] = useState(700);
  const [silverPriceGram, setSilverPriceGram] = useState(0.9);

  // State 4: Islamic Financing (Murabaha)
  const [assetCost, setAssetCost] = useState(50000);
  const [profitRate, setProfitRate] = useState(5);
  const [tenureYears, setTenureYears] = useState(5);
  const [downPayment, setDownPayment] = useState(10000);

  // State 5: Mahr Calculator
  const [mahrAgreed, setMahrAgreed] = useState(15000);
  const [mahrPaid, setMahrPaid] = useState(5000);
  const [mahrDeferred, setMahrDeferred] = useState(10000);

  // State 6: Waqf Endowment Impact
  const [waqfCapital, setWaqfCapital] = useState(25000);
  const [waqfYield, setWaqfYield] = useState(6);

  // Persistence in Local Storage
  useEffect(() => {
    try {
      const savedInv = localStorage.getItem("barakah-finance-inv");
      if (savedInv) {
        const parsed = JSON.parse(savedInv);
        setInvInitial(parsed.invInitial || 10000);
        setInvMonthly(parsed.invMonthly || 500);
      }
    } catch { /* ignore */ }
  }, []);

  const saveFinanceState = () => {
    try {
      localStorage.setItem(
        "barakah-finance-inv",
        JSON.stringify({ invInitial, invMonthly, invReturn, invYears })
      );
      alert(lang === "ar" ? "تم حفظ الحسابات في متصفحك محلياً." : "Saved financial estimates to your browser storage.");
    } catch { /* ignore */ }
  };

  const resetData = () => {
    if (window.confirm("Reset saved Islamic finance inputs in your browser?")) {
      localStorage.removeItem("barakah-finance-inv");
      setInvInitial(10000);
      setInvMonthly(500);
      setInvReturn(7);
      setInvYears(10);
      setAssetCost(50000);
    }
  };

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
            onClick={resetData}
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
              {lang === "ar" ? "← جميع أدوات المالية الإسلامية" : lang === "ur" ? "← تمام اسلامی مالیات ٹولز" : "← All Islamic Finance Tools"}
            </button>
          )}
          <span className="text-xs font-bold text-[#6E1A37]">
            {lang === "ar" ? "١٥ حاسبة وأداة للمالية الإسلامية والمال الحلال" : lang === "ur" ? "۱۵ اسلامی مالیات ٹولز" : "15 Dedicated Islamic Finance & Halal Money Tools"}
          </span>
        </div>
      </div>

      {/* VIEW 1: DIRECTORY GRID OF ALL 15 ISLAMIC FINANCE TOOLS (SIGNATURE CARDS) */}
      {!activeSlug && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {financeTools.map((tool, idx) => (
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
                        <Coins className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                        {lang === "ar" ? "أداة المالية" : "Finance Tool"}
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
                    {lang === "ar" ? "افتح الحاسبة" : "Open Calculator"}
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

      {/* TOOL 1: Halal Investment Compound Growth Calculator */}
      {(activeSlug === "halal-investment-calculator" || activeSlug === "halal-portfolio-calculator" || activeSlug === "islamic-savings-calculator") && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up">
          <div className="mb-6 border-b border-[#F2EAE0] pb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-[#AE2448]" />
              Sharia-Compliant Wealth Growth
            </span>
            <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
              Halal Investment & Compound Returns Growth
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Calculate future portfolio values on ethical equities, Sukuk, and halal mutual funds without Riba (usury).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Initial Investment ($)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={invInitial}
                  onChange={(e) => setInvInitial(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Monthly Contribution ($)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={invMonthly}
                  onChange={(e) => setInvMonthly(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Expected Annual Return (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={invReturn}
                    onChange={(e) => setInvReturn(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Years Horizon</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={invYears}
                    onChange={(e) => setInvYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={saveFinanceState}
                className="w-full rounded-xl bg-[#6E1A37] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#8C2448] transition-colors cursor-pointer border-0"
              >
                Save Investment Estimate
              </button>
            </div>

            {/* Results Box */}
            <div className="rounded-3xl bg-[#F2EAE0] p-6 border border-[#AE2448]/20 space-y-4">
              {(() => {
                const r = invReturn / 100 / 12;
                const n = invYears * 12;
                const futureFV = invInitial * Math.pow(1 + r, n) + invMonthly * ((Math.pow(1 + r, n) - 1) / (r || 1));
                const totalContributions = invInitial + invMonthly * n;
                const totalProfit = Math.max(0, futureFV - totalContributions);

                return (
                  <>
                    <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider block">
                      Projected Portfolio Value
                    </span>
                    <div className="text-4xl font-black text-[var(--ink)]">
                      ${Math.round(futureFV).toLocaleString()}
                    </div>

                    <div className="pt-3 border-t border-[#AE2448]/15 space-y-2 text-xs font-semibold text-[var(--ink)]">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">Total Contributions:</span>
                        <span>${Math.round(totalContributions).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E1A37]">Projected Halal Profit Growth:</span>
                        <span className="text-[#AE2448] font-bold">+${Math.round(totalProfit).toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* TOOL 2: Gold & Silver Zakat Calculator */}
      {(activeSlug === "gold-zakat-calculator" || activeSlug === "silver-zakat-calculator" || activeSlug === "zakat-investment-calculator") && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up">
          <div className="mb-6 border-b border-[#F2EAE0] pb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
              <Coins className="h-3.5 w-3.5 text-[#AE2448]" />
              Gold & Silver Precious Metals Zakat
            </span>
            <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
              Gold & Silver Zakat Calculator
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Gold Weight Held (Grams)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={goldGram24}
                  onChange={(e) => setGoldGram24(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Local Price per Gram ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={goldPrice24}
                  onChange={(e) => setGoldPrice24(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Nisab Threshold (Default 85g)</label>
                <input
                  type="number"
                  min="0"
                  value={goldNisabGrams}
                  onChange={(e) => setGoldNisabGrams(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="rounded-3xl bg-[#F2EAE0] p-6 border border-[#AE2448]/20 space-y-4">
              {(() => {
                const totalValue = goldGram24 * goldPrice24;
                const isEligible = goldGram24 >= goldNisabGrams;
                const zakatAmount = isEligible ? totalValue * 0.025 : 0;

                return (
                  <>
                    <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider block">
                      Zakat Due (2.5%)
                    </span>
                    <div className="text-4xl font-black text-[var(--ink)]">
                      ${zakatAmount.toFixed(2)}
                    </div>

                    <div className="pt-3 border-t border-[#AE2448]/15 space-y-2 text-xs font-semibold text-[var(--ink)]">
                      <div className="flex justify-between">
                        <span>Total Gold Value:</span>
                        <span>${totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nisab Status:</span>
                        <span className={isEligible ? "text-emerald-700 font-bold" : "text-[var(--muted)]"}>
                          {isEligible ? "Exceeds Nisab (Zakatable)" : "Below Nisab Threshold"}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* TOOL 3: Murabaha & Islamic Financing Calculator */}
      {(activeSlug === "islamic-finance-calculator" || activeSlug === "islamic-loan-financing-calculator" || activeSlug === "profit-sharing-calculator") && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up">
          <div className="mb-6 border-b border-[#F2EAE0] pb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
              <Building2 className="h-3.5 w-3.5 text-[#AE2448]" />
              Islamic Asset & Murabaha Financing
            </span>
            <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
              Murabaha & Islamic Installment Calculator
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Asset Purchase Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={assetCost}
                  onChange={(e) => setAssetCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Down Payment ($)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Agreed Profit Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={profitRate}
                    onChange={(e) => setProfitRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Tenure Years</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                  />
                </div>
              </div>
            </div>

            {/* Results Box */}
            <div className="rounded-3xl bg-[#F2EAE0] p-6 border border-[#AE2448]/20 space-y-4">
              {(() => {
                const netFinanced = Math.max(0, assetCost - downPayment);
                const totalProfit = netFinanced * (profitRate / 100) * tenureYears;
                const totalRepayment = netFinanced + totalProfit;
                const monthlyPmt = tenureYears > 0 ? totalRepayment / (tenureYears * 12) : 0;

                return (
                  <>
                    <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider block">
                      {t.monthlyInstallment}
                    </span>
                    <div className="text-4xl font-black text-[var(--ink)]">
                      ${monthlyPmt.toFixed(2)} <span className="text-xs font-bold text-[var(--muted)]">/ month</span>
                    </div>

                    <div className="pt-3 border-t border-[#AE2448]/15 space-y-2 text-xs font-semibold text-[var(--ink)]">
                      <div className="flex justify-between">
                        <span>Financed Amount:</span>
                        <span>${netFinanced.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Bank Fixed Profit:</span>
                        <span className="text-[#6E1A37]">${totalProfit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Murabaha Price:</span>
                        <span className="font-bold">${(totalRepayment + downPayment).toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* TOOL 4: Waqf Endowment & Sadaqah Calculator */}
      {(activeSlug === "waqf-calculator" || activeSlug === "charity-calculator" || activeSlug === "sadaqah-calculator" || activeSlug === "mahr-calculator") && (
        <section className="rounded-3xl border border-[#AE2448]/25 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06)] fade-up">
          <div className="mb-6 border-b border-[#F2EAE0] pb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#6E1A37] text-xs font-bold mb-2">
              <HeartHandshake className="h-3.5 w-3.5 text-[#AE2448]" />
              Waqf & Ongoing Charity Impact
            </span>
            <h2 className="m-0 text-2xl font-bold tracking-tight text-[var(--ink)]">
              Perpetual Waqf Endowment Calculator
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Waqf Capital Investment ($)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={waqfCapital}
                  onChange={(e) => setWaqfCapital(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Annual Charitable Yield (%)</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  step="0.5"
                  value={waqfYield}
                  onChange={(e) => setWaqfYield(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#F2EAE0] px-3.5 py-2.5 text-sm font-bold outline-none focus:border-[#AE2448]"
                />
              </div>
            </div>

            {/* Results Box */}
            <div className="rounded-3xl bg-[#F2EAE0] p-6 border border-[#AE2448]/20 space-y-4">
              {(() => {
                const annualYield = waqfCapital * (waqfYield / 100);
                const tenYearYield = annualYield * 10;

                return (
                  <>
                    <span className="text-xs font-bold text-[#6E1A37] uppercase tracking-wider block">
                      {t.waqfImpact}
                    </span>
                    <div className="text-4xl font-black text-[var(--ink)]">
                      ${Math.round(annualYield).toLocaleString()} <span className="text-xs font-bold text-[var(--muted)]">/ year</span>
                    </div>

                    <div className="pt-3 border-t border-[#AE2448]/15 space-y-2 text-xs font-semibold text-[var(--ink)]">
                      <div className="flex justify-between">
                        <span>10-Year Cumulative Sadaqah Jariyah:</span>
                        <span className="text-[#6E1A37] font-bold">${Math.round(tenYearYield).toLocaleString()}</span>
                      </div>
                      <p className="m-0 text-[11px] text-[var(--muted)] pt-1">
                        Principal capital remains intact to generate perpetual rewards.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

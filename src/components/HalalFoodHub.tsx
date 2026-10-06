import { useState, useMemo } from "react";
import {
  Utensils,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Building2,
  Scan,
  ChefHat,
  Info,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Share2,
  Check
} from "lucide-react";
import { Tool, tools } from "../data/tools";
import { Locale } from "../data/locales";

interface HalalFoodHubProps {
  currentTool?: Tool;
  onSelectTool: (slug: string) => void;
  lang: Locale;
}

interface ENumberItem {
  code: string;
  name: string;
  status: "Halal" | "Haram" | "Mushbooh";
  category: string;
  details: string;
}

const eNumbersData: ENumberItem[] = [
  { code: "E100", name: "Curcumin", status: "Halal", category: "Coloring", details: "Plant-derived yellow dye from turmeric." },
  { code: "E120", name: "Carmine / Cochineal", status: "Haram", category: "Coloring", details: "Derived from crushed female cochineal insects." },
  { code: "E160a", name: "Carotenes", status: "Halal", category: "Coloring", details: "Plant-derived orange dye from carrots or palms." },
  { code: "E322", name: "Lecithin", status: "Halal", category: "Emulsifier", details: "Usually soy or sunflower lecithin. If animal-derived, requires halal certification." },
  { code: "E422", name: "Glycerol / Glycerin", status: "Mushbooh", category: "Humectant", details: "Can be vegetable or animal fat derived. Vegetable glycerin is 100% Halal." },
  { code: "E441", name: "Gelatin", status: "Mushbooh", category: "Gelling agent", details: "Halal if from bovine (slaughtered according to Sharia), fish, or vegan pectin. Haram if porcine." },
  { code: "E471", name: "Mono- and Diglycerides of Fatty Acids", status: "Mushbooh", category: "Emulsifier", details: "Derived from plant or animal fats. Needs halal certification seal." },
  { code: "E472a-f", name: "Esters of Mono- and Diglycerides", status: "Mushbooh", category: "Emulsifier", details: "Plant-based version is Halal; animal-based version is doubtful/Haram." },
  { code: "E542", name: "Bone Phosphate", status: "Haram", category: "Anti-caking", details: "Derived from non-halal animal bones." },
  { code: "E621", name: "Monosodium Glutamate (MSG)", status: "Halal", category: "Flavor enhancer", details: "Fermented vegetable starch product. Halal." },
  { code: "E904", name: "Shellac", status: "Mushbooh", category: "Glazing agent", details: "Resin secreted by lac insects. Permitted by majority of contemporary scholars." },
  { code: "E920", name: "L-Cysteine", status: "Haram", category: "Dough conditioner", details: "Often derived from human hair or duck feathers unless synthetic/fermented." }
];

const certificationBodies = [
  { name: "JAKIM", country: "Malaysia", reputation: "Global Gold Standard", description: "Department of Islamic Development Malaysia. World's most rigorous certification." },
  { name: "MUI (LPPOM)", country: "Indonesia", reputation: "Global Benchmark", description: "Majelis Ulama Indonesia. World's largest halal market regulatory authority." },
  { name: "IFANCA", country: "USA & Global", reputation: "North American Leader", description: "Islamic Food and Nutrition Council of America. Widely recognized worldwide." },
  { name: "HMC", country: "United Kingdom", reputation: "100% Hand-Zabiha Standard", description: "Halal Monitoring Committee UK. Strict non-stunned hand Zabiha protocol." },
  { name: "SANHA", country: "South Africa", reputation: "Strict Compliance", description: "South African National Halal Authority. Renowned for stringent auditing." },
  { name: "GSO / GCC Halal", country: "Gulf Cooperation Council", reputation: "Unified Gulf Standard", description: "Standards Organization for Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain." }
];

const halalRecipes = [
  { title: "Halal Beef Biryani", prepTime: "45 mins", difficulty: "Medium", altNote: "Use certified Zabiha beef and whole fragrant spices." },
  { title: "Non-Alcoholic Teriyaki Chicken", prepTime: "20 mins", difficulty: "Easy", altNote: "Substitute Mirin/Sake with apple cider vinegar & grape juice mix." },
  { title: "Halal Marshmallow Hot Chocolate", prepTime: "10 mins", difficulty: "Easy", altNote: "Use fish gelatin or vegan pectin marshmallows." },
  { title: "Halal Creamy Pasta Alfredo", prepTime: "25 mins", difficulty: "Easy", altNote: "Use microbial rennet parmesan cheese or certified halal cheese." }
];

export function HalalFoodHub({ currentTool, onSelectTool, lang }: HalalFoodHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [multiIngredientText, setMultiIngredientText] = useState("");
  const [scanResults, setScanResults] = useState<{ ingredient: string; status: "Halal" | "Haram" | "Mushbooh"; reason: string }[] | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const halalTools = useMemo(
    () => tools.filter((t) => t.category === "Halal Food Tools"),
    []
  );

  const activeSlug = currentTool?.slug || "";
  const activeToolObj = halalTools.find((t) => t.slug === activeSlug);

  // E-number filtering
  const filteredENumbers = useMemo(() => {
    if (!searchQuery.trim()) return eNumbersData;
    const q = searchQuery.toLowerCase();
    return eNumbersData.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle Multi-Ingredient Text Safety Scan
  const handleScanIngredients = () => {
    if (!multiIngredientText.trim()) return;
    const tokens = multiIngredientText.split(/[,;\n\t]+/).map((s) => s.trim()).filter(Boolean);
    const results = tokens.map((ing) => {
      const lower = ing.toLowerCase();
      if (
        lower.includes("pork") ||
        lower.includes("lard") ||
        lower.includes("bacon") ||
        lower.includes("carmine") ||
        lower.includes("e120") ||
        lower.includes("gelatin (porcine)") ||
        lower.includes("alcohol") ||
        lower.includes("wine")
      ) {
        return { ingredient: ing, status: "Haram" as const, reason: "Contains prohibited swine, alcohol, or non-halal animal derivative." };
      }
      if (
        lower.includes("e471") ||
        lower.includes("e422") ||
        lower.includes("glycerin") ||
        lower.includes("gelatin") ||
        lower.includes("rennet") ||
        lower.includes("whey") ||
        lower.includes("mono and diglycerides")
      ) {
        return { ingredient: ing, status: "Mushbooh" as const, reason: "Source (vegetable vs non-halal animal) requires halal certification verification." };
      }
      return { ingredient: ing, status: "Halal" as const, reason: "Generally permissible plant, synthetic, or wholesome ingredient." };
    });
    setScanResults(results);
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
              {lang === "ar" ? "← جميع أدوات الأغذية" : lang === "ur" ? "← تمام حلال فوڈ ٹولز" : "← All Halal Food Tools"}
            </button>
          )}
          <span className="text-xs font-bold text-[#6E1A37]">
            {lang === "ar" ? "١٢ أداة وفحصاً للأغذية والمكونات الحلال" : lang === "ur" ? "۱۲ انٹرایکٹو حلال فوڈ ٹولز" : "12 Dedicated Halal Food & Ingredient Tools"}
          </span>
        </div>

        <span className="text-xs font-semibold text-[var(--muted)]">
          {lang === "ar" ? "دليل معتمد ودقيق وفق الشريعة الإسلامية" : lang === "ur" ? "تصدیق شدہ اسلامی غذائی معيار" : "Verified Sharia Dietary Guide"}
        </span>
      </div>

      {/* VIEW 1: MAIN DIRECTORY GRID OF ALL 12 FOOD TOOLS (UNIFORM SIGNATURE CARDS) */}
      {!activeSlug && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {halalTools.map((tool, idx) => (
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
                        <Utensils className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A37]">
                        {lang === "ar" ? "أداة الأغذية" : lang === "ur" ? "حلال فوڈ ٹول" : "Halal Food Tool"}
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
                    {lang === "ar" ? "افتح الأداة" : lang === "ur" ? "ٹول کھولیں" : "Open Food Tool"}
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

      {/* VIEW 2: INDIVIDUAL TOOL DEDICATED INTERACTIVE PAGE */}
      {activeSlug && activeToolObj && (
        <div className="rounded-3xl border border-[#E6D8BA] bg-[#FFF6DE] p-6 md:p-8 shadow-sm space-y-6 fade-up">
          {/* Header */}
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

          {/* DEDICATED TOOL WIDGET 1: Multi-Ingredient Text Scanner / Ingredient Search */}
          {(activeSlug === "halal-food-scanner" || activeSlug === "ingredient-search" || activeSlug === "halal-food-checker" || activeSlug === "halal-ingredient-checker") && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-5 border border-[#E6D8BA]">
                <label htmlFor="ingredient-paste" className="block text-sm font-bold text-[var(--ink)] mb-2 flex items-center gap-2">
                  <Scan className="h-4 w-4 text-[#AE2448]" />
                  <span>{lang === "ar" ? "أدخل قائمة المكونات المطبوعة على المنتج" : lang === "ur" ? "پیکٹ سے اجزاء کی فہرست یہاں پیسٹ کریں" : "Paste Product Ingredient Label Text"}</span>
                </label>
                <textarea
                  id="ingredient-paste"
                  rows={4}
                  value={multiIngredientText}
                  onChange={(e) => setMultiIngredientText(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "مثال: Wheat flour, sugar, palm oil, E471, whey powder, gelatin, lecithin..."
                      : "e.g. Enriched wheat flour, sugar, palm oil, E471, soy lecithin, gelatin, carmine E120..."
                  }
                  className="w-full rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] p-3.5 text-xs text-[var(--ink)] outline-none focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/15"
                />
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleScanIngredients}
                    className="rounded-xl bg-[#6E1A37] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#8C2448] transition-all cursor-pointer border-0 flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>{lang === "ar" ? "فحص المكونات الآن" : lang === "ur" ? "اجزاء کا تجزیہ کریں" : "Analyze Ingredients Now"}</span>
                  </button>
                  {multiIngredientText && (
                    <button
                      type="button"
                      onClick={() => { setMultiIngredientText(""); setScanResults(null); }}
                      className="text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer border-0 bg-transparent flex items-center gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{lang === "ar" ? "مسح" : "Clear"}</span>
                    </button>
                  )}
                </div>
              </div>

              {scanResults && (
                <div className="space-y-3 fade-up">
                  <h3 className="m-0 text-base font-bold text-[var(--ink)] flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#AE2448]" />
                    <span>{lang === "ar" ? "نتائج تحليل المكونات:" : "Ingredient Breakdown Analysis:"}</span>
                  </h3>
                  <div className="grid gap-2.5">
                    {scanResults.map((res, i) => (
                      <div
                        key={i}
                        className={`flex items-start justify-between rounded-xl p-3.5 border ${
                          res.status === "Halal"
                            ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                            : res.status === "Haram"
                            ? "bg-rose-50/90 border-rose-300 text-rose-950"
                            : "bg-amber-50/90 border-amber-300 text-amber-950"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {res.status === "Halal" && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
                          {res.status === "Haram" && <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />}
                          {res.status === "Mushbooh" && <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />}
                          <div>
                            <p className="m-0 text-xs font-bold">{res.ingredient}</p>
                            <p className="m-0 mt-1 text-[11px] opacity-90">{res.reason}</p>
                          </div>
                        </div>
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-white border border-current">
                          {res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DEDICATED TOOL WIDGET 2: E-Number Directory / Ingredient Dictionary */}
          {(activeSlug === "e-number-halal-checker" || activeSlug === "ingredient-dictionary" || activeSlug === "food-additive-halal-checker") && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E6D8BA] pb-3">
                <h3 className="m-0 text-sm font-bold text-[var(--ink)]">
                  {lang === "ar" ? "دليل الأرقام والمواد المضافة (E-Numbers Directory)" : "Interactive E-Number Directory"}
                </h3>
                <div className="relative w-full sm:w-64">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === "ar" ? "ابحث عن رمز E..." : "Search E-number..."}
                    className="w-full rounded-xl border border-[#E6D8BA] bg-white px-3 py-1.5 pl-8 text-xs font-semibold text-[var(--ink)] outline-none focus:border-[#AE2448]"
                  />
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--muted)]" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredENumbers.map((item) => (
                  <div
                    key={item.code}
                    className="rounded-2xl border border-[#E6D8BA] bg-white p-4 space-y-2 hover:border-[#AE2448] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-[#6E1A37] bg-[#FFF6DE] px-2.5 py-1 rounded-lg border border-[#E6D8BA]">
                        {item.code}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          item.status === "Halal"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "Haram"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h4 className="m-0 text-xs font-bold text-[var(--ink)]">{item.name}</h4>
                    <p className="m-0 text-[11px] text-[var(--muted)] leading-relaxed">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEDICATED TOOL WIDGET 3: Gelatin Halal Checker */}
          {activeSlug === "gelatin-halal-checker" && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                Gelatin Origin & Source Verifier
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 space-y-1">
                  <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">Porcine Gelatin</span>
                  <p className="text-xs font-bold text-rose-950 m-0">Strictly Haram</p>
                  <p className="text-[11px] text-rose-900 m-0 leading-relaxed">Derived from pig skin/bones. Commonly found in non-certified gummy candy and marshmallows.</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-1">
                  <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">Bovine Gelatin (Zabiha)</span>
                  <p className="text-xs font-bold text-emerald-950 m-0">100% Halal</p>
                  <p className="text-[11px] text-emerald-900 m-0 leading-relaxed">Derived from beef cattle slaughtered according to Islamic Sharia guidelines.</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-1">
                  <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">Fish Gelatin</span>
                  <p className="text-xs font-bold text-emerald-950 m-0">100% Halal</p>
                  <p className="text-[11px] text-emerald-900 m-0 leading-relaxed">Extracted from fish scales and skin. Permissible across all Islamic schools of jurisprudence.</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-1">
                  <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">Pectin / Agar-Agar</span>
                  <p className="text-xs font-bold text-emerald-950 m-0">Vegan & 100% Halal</p>
                  <p className="text-[11px] text-emerald-900 m-0 leading-relaxed">Plant-based gelling agents derived from fruit peels or seaweed. Naturally Halal.</p>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED TOOL WIDGET 4: Global Halal Certification Lookup */}
          {activeSlug === "halal-certification-lookup" && (
            <div className="space-y-4">
              <h3 className="m-0 text-sm font-bold text-[var(--ink)] flex items-center gap-2 border-b border-[#E6D8BA] pb-3">
                <Building2 className="h-4 w-4 text-[#AE2448]" />
                <span>{lang === "ar" ? "دليل هيئات الاعتماد والتصديق الحلال العالمية" : "Global Halal Certification Bodies"}</span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certificationBodies.map((body) => (
                  <div key={body.name} className="rounded-2xl border border-[#E6D8BA] bg-white p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#6E1A37]">{body.name}</span>
                      <span className="rounded-full bg-[#AE2448] text-white px-2.5 py-0.5 text-[10px] font-bold">
                        {body.country}
                      </span>
                    </div>
                    <p className="m-0 text-xs font-bold text-[var(--ink)]">{body.reputation}</p>
                    <p className="m-0 text-[11px] text-[var(--muted)] leading-relaxed">{body.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEDICATED TOOL WIDGET 5: Halal Recipe Finder */}
          {activeSlug === "halal-recipe-finder" && (
            <div className="space-y-4">
              <h3 className="m-0 text-sm font-bold text-[var(--ink)] flex items-center gap-2 border-b border-[#E6D8BA] pb-3">
                <ChefHat className="h-4 w-4 text-[#AE2448]" />
                <span>{lang === "ar" ? "وصفات حلال مع بدائل للمكونات المريبة" : "Halal Recipe Directory & Substitution Guide"}</span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {halalRecipes.map((recipe) => (
                  <div key={recipe.title} className="rounded-2xl border border-[#E6D8BA] bg-white p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="m-0 text-sm font-bold text-[var(--ink)]">{recipe.title}</h4>
                      <span className="rounded-full bg-[#FFF6DE] border border-[#E6D8BA] px-2.5 py-0.5 text-[10px] font-bold text-[#6E1A37]">
                        {recipe.prepTime}
                      </span>
                    </div>
                    <p className="m-0 text-xs font-semibold text-[#AE2448]">Halal Substitution Note:</p>
                    <p className="m-0 text-xs text-[var(--muted)] leading-relaxed">{recipe.altNote}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEDICATED TOOL WIDGET 6: Halal Product & Restaurant Guide */}
          {(activeSlug === "halal-restaurant-finder" || activeSlug === "halal-product-checker") && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="m-0 text-base font-bold text-[var(--ink)] border-b border-[#E6D8BA] pb-3">
                {activeSlug === "halal-restaurant-finder" ? "Halal Dining & Hand-Zabiha Verification Guide" : "Cosmetics, Skincare & Pharma Halal Guide"}
              </h3>
              <div className="rounded-2xl bg-white border border-[#E6D8BA] p-5 space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="m-0 font-medium">Verify official physical halal certificate on restaurant walls or product packaging.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="m-0 font-medium">For meat dining: confirm whether supplier is 100% Hand-Slaughtered Zabiha or Machine-Cut.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="m-0 font-medium">For cosmetics & skincare: check for animal collagen, porcine gelatin capsules, and ethyl alcohol denat.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Islamic Food Ethics Note */}
      <aside className="rounded-2xl border border-[#E6D8BA] bg-[#FFF6DE] p-5 text-xs text-[var(--ink)] leading-relaxed flex items-start gap-3">
        <Info className="h-5 w-5 text-[#AE2448] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{lang === "ar" ? "تنبيه شرعي وصحي:" : "Dietary Disclaimer:"} </span>
          <span>
            {lang === "ar"
              ? "قال تعالى: ﴿يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا﴾ [البقرة: ١٦٨]. هذه الأدوات توفر معلومات إرشادية حول المكونات. يرجى التحقق دائمًا من ختم هيئة الاعتماد الحلال المعتمدة على غلاف المنتجات."
              : "Allah commands: 'O mankind, eat from whatever is on earth that is lawful and wholesome.' (2:168). This database serves as an informative guide. Always verify products with trusted local halal certification seals."}
          </span>
        </div>
      </aside>
    </div>
  );
}

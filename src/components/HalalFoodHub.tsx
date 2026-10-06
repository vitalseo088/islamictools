import { useState, useMemo } from "react";
import {
  Utensils,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Filter,
  ShieldCheck,
  Building2,
  Scan,
  ChefHat,
  Info,
  Copy,
  Check,
  RotateCcw
} from "lucide-react";
import { Tool, tools } from "../data/tools";
import { Locale } from "../data/locales";

interface HalalFoodHubProps {
  currentTool?: Tool;
  onSelectTool: (slug: string) => void;
  lang: Locale;
}

// Halal E-Number Database
interface ENumberItem {
  code: string;
  name: string;
  status: "Halal" | "Haram" | "Mushbooh";
  category: string;
  details: string;
  substitutes?: string;
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
  { code: "E904", name: "Shellac", status: "Mushbooh", category: "Glazing agent", details: "Resin secreted by lac insects. Majority of scholars permit, some restrict." },
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

export function HalalFoodHub({ currentTool, onSelectTool, lang }: HalalFoodHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [multiIngredientText, setMultiIngredientText] = useState("");
  const [scanResults, setScanResults] = useState<{ ingredient: string; status: "Halal" | "Haram" | "Mushbooh"; reason: string }[] | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const halalTools = useMemo(
    () => tools.filter((t) => t.category === "Halal Food Tools"),
    []
  );

  const activeTool = currentTool || halalTools[0];

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
      if (lower.includes("pork") || lower.includes("lard") || lower.includes("bacon") || lower.includes("carmine") || lower.includes("e120") || lower.includes("gelatin (porcine)")) {
        return { ingredient: ing, status: "Haram" as const, reason: "Contains prohibited swine or non-halal animal derivative." };
      }
      if (lower.includes("e471") || lower.includes("e422") || lower.includes("glycerin") || lower.includes("gelatin") || lower.includes("rennet") || lower.includes("whey")) {
        return { ingredient: ing, status: "Mushbooh" as const, reason: "Source (vegetable vs non-halal animal) requires halal certification verification." };
      }
      return { ingredient: ing, status: "Halal" as const, reason: "Generally permissible plant or synthetic ingredient." };
    });
    setScanResults(results);
  };

  return (
    <div className="space-y-8">
      {/* Category Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2EAE0] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer border ${
              selectedCategory === "all"
                ? "bg-[#6E1A37] text-white border-[#6E1A37] shadow-xs"
                : "bg-[#FFF6DE] text-[var(--ink)] border-[#E6D8BA] hover:border-[#AE2448] hover:bg-[#FFEFC2]"
            }`}
          >
            {lang === "ar" ? "جميع أجهزة وفحوص الأغذية الحلال (١٢)" : lang === "ur" ? "تمام حلال فوڈ ٹولز (۱۲)" : "All Halal Food Tools (12)"}
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "ar"
                ? "ابحث عن رمز E أو مادة مضافة..."
                : lang === "ur"
                ? "E-نمبر یا جزو تلاش کریں..."
                : "Search E-number or ingredient..."
            }
            className="w-full rounded-xl border border-[#E6D8BA] bg-[#FFF6DE] px-3.5 py-2 pl-9 text-xs font-semibold text-[var(--ink)] outline-none focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/15"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted)]" />
        </div>
      </div>

      {/* Grid of Tools Selection */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {halalTools.map((tool) => {
          const isSelected = activeTool.slug === tool.slug;
          return (
            <button
              key={tool.slug}
              type="button"
              onClick={() => onSelectTool(tool.slug)}
              className={`group flex items-start gap-3 rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "bg-[#6E1A37] text-white border-[#6E1A37] shadow-md ring-2 ring-[#6E1A37]/20"
                  : "bg-[#FFF6DE] text-[var(--ink)] border-[#E6D8BA] hover:border-[#AE2448] hover:bg-[#FFEFC2] shadow-2xs"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-transform group-hover:scale-105 ${
                  isSelected ? "bg-white text-[#6E1A37]" : "bg-[#AE2448] text-white"
                }`}
              >
                <Utensils className="h-4 w-4" />
              </span>
              <div className="flex-1 overflow-hidden">
                <h4 className={`m-0 text-xs font-bold truncate ${isSelected ? "text-white" : "text-[var(--ink)]"}`}>
                  {tool.title}
                </h4>
                <p className={`m-0 mt-1 text-[11px] line-clamp-2 leading-relaxed ${isSelected ? "text-white/80" : "text-[var(--muted)]"}`}>
                  {tool.short}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tool Dynamic Panel */}
      <div className="rounded-3xl border border-[#F2EAE0] bg-white p-6 md:p-8 shadow-sm">
        {/* Tool Header */}
        <div className="mb-6 border-b border-[#F2EAE0] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="rounded-full bg-[#AE2448]/10 px-3 py-1 text-xs font-bold text-[#AE2448]">
              {activeTool.title}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {lang === "ar" ? "قاعدة بيانات الأغذية والمكونات الحلال" : lang === "ur" ? "حلال اجزاء کی فوری تصدیق" : "Verified Dietary Standard"}
            </span>
          </div>
          <h2 className="m-0 text-2xl font-bold text-[var(--ink)]">{activeTool.title}</h2>
          <p className="m-0 mt-2 text-sm text-[var(--muted)] leading-relaxed">{activeTool.explanation}</p>
        </div>

        {/* TOOL VIEW 1: Multi-Ingredient Label Scanner */}
        {(activeTool.slug === "halal-food-scanner" || activeTool.slug === "ingredient-search" || activeTool.slug === "halal-food-checker") && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#F2EAE0]/40 p-5 border border-[#F2EAE0]">
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
                className="w-full rounded-xl border border-[#F2EAE0] bg-white p-3.5 text-xs text-[var(--ink)] outline-none focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/15"
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
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                          : res.status === "Haram"
                          ? "bg-rose-50/70 border-rose-200 text-rose-900"
                          : "bg-amber-50/70 border-amber-200 text-amber-900"
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
                      <span className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/80 border border-current">
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOOL VIEW 2: E-Number & Ingredient Directory */}
        {activeTool.slug !== "halal-food-scanner" && activeTool.slug !== "ingredient-search" && activeTool.slug !== "halal-certification-lookup" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2EAE0] pb-3">
              <h3 className="m-0 text-sm font-bold text-[var(--ink)]">
                {lang === "ar" ? "دليل الأرقام والمواد المضافة (E-Numbers Directory)" : "Interactive E-Number Directory"}
              </h3>
              <span className="text-xs text-[var(--muted)] font-mono">{filteredENumbers.length} items</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredENumbers.map((item) => (
                <div
                  key={item.code}
                  className="rounded-2xl border border-[#F2EAE0] bg-white p-4 space-y-2 hover:border-[#AE2448] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-[#6E1A37] bg-[#AE2448]/10 px-2.5 py-1 rounded-lg">
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

        {/* TOOL VIEW 3: Global Halal Certification Lookup */}
        {activeTool.slug === "halal-certification-lookup" && (
          <div className="space-y-4">
            <h3 className="m-0 text-sm font-bold text-[var(--ink)] flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#AE2448]" />
              <span>{lang === "ar" ? "دليل هيئات الاعتماد والتصديق الحلال العالمية" : "Global Halal Certification Bodies"}</span>
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificationBodies.map((body) => (
                <div key={body.name} className="rounded-2xl border border-[#F2EAE0] bg-[#F2EAE0]/30 p-5 space-y-2">
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
      </div>

      {/* Islamic Food Ethics Note */}
      <aside className="rounded-2xl border border-[#F2EAE0] bg-[#F2EAE0]/50 p-5 text-xs text-[var(--ink)] leading-relaxed flex items-start gap-3">
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

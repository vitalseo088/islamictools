export type Locale = "en" | "ar" | "ur";
export type LocalizedToolCopy = { title: string; short: string };

export const toolCopy: Record<string, Partial<Record<Exclude<Locale, "en">, LocalizedToolCopy>>> = {
  "zakat-calculator": { ar: { title: "حاسبة الزكاة", short: "تقدير واضح للزكاة على الأموال المؤهلة." }, ur: { title: "زکوٰۃ کیلکولیٹر", short: "قابلِ زکوٰۃ مال پر زکوٰۃ کا واضح اندازہ۔" } },
  "zakat-on-gold": { ar: { title: "زكاة الذهب", short: "تقدير الزكاة حسب وزن الذهب وقيمته الحالية." }, ur: { title: "سونے کی زکوٰۃ", short: "سونے کے وزن اور موجودہ قیمت سے زکوٰۃ کا اندازہ۔" } },
  "zakat-on-silver": { ar: { title: "زكاة الفضة", short: "تقدير الزكاة حسب وزن الفضة وقيمتها الحالية." }, ur: { title: "چاندی کی زکوٰۃ", short: "چاندی کے وزن اور موجودہ قیمت سے زکوٰۃ کا اندازہ۔" } },
  "fidyah-calculator": { ar: { title: "حاسبة الفدية", short: "تقدير الفدية المحلية عن الصيام." }, ur: { title: "فدیہ کیلکولیٹر", short: "چھوٹے ہوئے روزوں کے فدیے کا مقامی اندازہ۔" } },
  "kaffarah-calculator": { ar: { title: "حاسبة الكفارة", short: "تقدير تكلفة إطعام ٦٠ شخصاً عن الصيام المعني." }, ur: { title: "کفارہ کیلکولیٹر", short: "متعلقہ روزے کے بدلے ۶۰ افراد کو کھلانے کا اندازہ۔" } },
  "missed-salah-calculator": { ar: { title: "حاسبة الصلوات الفائتة", short: "تقدير الصلوات الفائتة وخطة قضاء مناسبة." }, ur: { title: "قضا نماز کیلکولیٹر", short: "قضا نمازوں اور مناسب ادائیگی کے منصوبے کا اندازہ۔" } },
  "quran-reading-goal": { ar: { title: "هدف قراءة القرآن", short: "حوّل هدف الختم إلى عدد صفحات يومي." }, ur: { title: "قرآن خوانی کا ہدف", short: "قرآن مکمل کرنے کے ہدف کو روزانہ صفحات میں بدلیں۔" } },
  "quran-completion-calculator": { ar: { title: "حاسبة ختم القرآن", short: "قدّر موعد إتمام المصحف بوتيرتك الحالية." }, ur: { title: "قرآن مکمل کرنے کا کیلکولیٹر", short: "موجودہ رفتار سے قرآن مکمل ہونے کا وقت جانیں۔" } },
  "quran-page-calculator": { ar: { title: "حاسبة صفحات القرآن", short: "احسب سرعة القراءة اليومية حسب موعد هدفك." }, ur: { title: "قرآن صفحات کیلکولیٹر", short: "ہدف کی تاریخ کے مطابق روزانہ مطالعے کی رفتار جانیں۔" } },
  "tahajjud-time-calculator": { ar: { title: "حاسبة وقت التهجد", short: "قدّر الثلث الأخير من الليل من أوقات الصلاة." }, ur: { title: "تہجد کے وقت کا کیلکولیٹر", short: "مقامی نماز کے اوقات سے رات کے آخری تہائی کا اندازہ۔" } },
  "ishraq-duha-time-calculator": { ar: { title: "وقت الإشراق والضحى", short: "قدّر الوقت بعد الشروق وقبل الظهر." }, ur: { title: "اشراق و چاشت کا وقت", short: "طلوعِ آفتاب کے بعد اور ظہر سے پہلے وقت کا اندازہ۔" } },
  "business-zakat-calculator": { ar: { title: "زكاة التجارة", short: "تقدير الزكاة على أصول العمل المتداولة." }, ur: { title: "کاروباری زکوٰۃ", short: "کاروبار کے قابلِ زکوٰۃ اثاثوں کا اندازہ۔" } },
  "cash-savings-zakat-calculator": { ar: { title: "زكاة النقد والمدخرات", short: "تقدير الزكاة على النقد والمدخرات." }, ur: { title: "نقدی اور بچت کی زکوٰۃ", short: "نقدی، بینک رقم اور بچت پر زکوٰۃ کا اندازہ۔" } },
  "investment-zakat-calculator": { ar: { title: "زكاة الاستثمارات", short: "طبّق النسبة التي تختارها على استثماراتك." }, ur: { title: "سرمایہ کاری کی زکوٰۃ", short: "سرمایہ کاری کے منتخب قابلِ زکوٰۃ حصے کا حساب۔" } },
  "crypto-zakat-calculator": { ar: { title: "زكاة العملات الرقمية", short: "تقدير الزكاة على العملات الرقمية والنقد." }, ur: { title: "کرپٹو کی زکوٰۃ", short: "کرپٹو اور نقدی کی موجودہ مالیت پر زکوٰۃ کا اندازہ۔" } },
  "property-zakat-calculator": { ar: { title: "زكاة العقار", short: "ميّز بين عقار إعادة البيع والعقار الشخصي أو المؤجر." }, ur: { title: "جائیداد کی زکوٰۃ", short: "فروخت، ذاتی استعمال اور کرایے کی جائیداد میں فرق کریں۔" } },
  "agricultural-zakat-calculator": { ar: { title: "زكاة الزروع", short: "قدّر زكاة المحصول حسب طريقة الري." }, ur: { title: "زرعی زکوٰۃ", short: "آب پاشی کے طریقے کے مطابق فصل کی زکوٰۃ کا اندازہ۔" } },
  "livestock-zakat-calculator": { ar: { title: "زكاة الأنعام", short: "تحقق مبدئياً من أنصبة الأغنام أو الأبقار." }, ur: { title: "مویشیوں کی زکوٰۃ", short: "بھیڑ، بکری یا گائے کے بنیادی نصاب کا اندازہ۔" } },
  "mahr-calculator": { ar: { title: "حاسبة المهر", short: "تابع المهر المتفق عليه والمدفوع والمؤجل." }, ur: { title: "مہر کیلکولیٹر", short: "طے شدہ، ادا شدہ اور مؤخر مہر کا حساب رکھیں۔" } },
  "islamic-inheritance-calculator": { ar: { title: "تقدير الميراث", short: "توضيح مبدئي لأنصبة الأسرة المباشرة." }, ur: { title: "وراثت کا اندازہ", short: "قریبی خاندان کے حصوں کی ابتدائی وضاحت۔" } },
  "hajj-cost-calculator": { ar: { title: "حاسبة تكلفة الحج", short: "قدّر تكلفة الحج للأسرة مع النفقات الرئيسية." }, ur: { title: "حج کے اخراجات کیلکولیٹر", short: "حج کے اہم اخراجات اور گھرانے کی کل لاگت جانیں۔" } },
  "umrah-cost-calculator": { ar: { title: "حاسبة تكلفة العمرة", short: "قدّر تكلفة العمرة حسب السفر والإقامة." }, ur: { title: "عمرہ اخراجات کیلکولیٹر", short: "سفر اور رہائش سمیت عمرے کی لاگت کا اندازہ۔" } },
  "ramadan-budget-calculator": { ar: { title: "ميزانية رمضان", short: "خطط لمصروفات الشهر مقارنة بدخل الأسرة." }, ur: { title: "رمضان بجٹ", short: "رمضان کے ماہانہ اخراجات اور آمدنی کا بجٹ بنائیں۔" } },
  "ramadan-charity-calculator": { ar: { title: "مخطط صدقة رمضان", short: "قدّر العطاء اليومي مع أي تبرع لمرة واحدة." }, ur: { title: "رمضان صدقہ منصوبہ", short: "روزانہ اور یک وقتی عطیے کا مجموعی اندازہ۔" } },
  "islamic-charity-calculator": { ar: { title: "توزيع الصدقة", short: "خطط لتقسيم التبرع على مجالات العطاء." }, ur: { title: "صدقہ کی تقسیم", short: "عطیے کو مختلف شعبوں میں تقسیم کرنے کا منصوبہ۔" } }
};

export const categoryCopy: Record<string, Record<Exclude<Locale, "en">, string>> = {
  Zakat: { ar: "الزكاة", ur: "زکوٰۃ" },
  Ramadan: { ar: "رمضان", ur: "رمضان" },
  "Worship planning": { ar: "تنظيم العبادة", ur: "عبادت کی منصوبہ بندی" },
  Quran: { ar: "القرآن", ur: "قرآن" },
  "Prayer times": { ar: "أوقات الصلاة", ur: "نماز کے اوقات" },
  "Family & planning": { ar: "الأسرة والتخطيط", ur: "خاندان اور منصوبہ بندی" },
  "Travel planning": { ar: "تخطيط السفر", ur: "سفر کی منصوبہ بندی" },
  Giving: { ar: "العطاء", ur: "عطیات" }
};

export const siteCopy: Record<Locale, Record<string, string>> = {
  en: {
    calculators: "Calculators", ramadan: "Ramadan", finance: "Finance", food: "Food", more: "More", home: "Home", allTools: "All calculators", footerNote: "Thoughtful estimates for everyday questions.",
    breadcrumbCategory: "Islamic Calculators", heroEyebrow: "AMANAH / A CONSIDERED STARTING POINT", heroTitle: "Islamic calculators, with room for nuance.",
    heroDescription: "Practical estimates for worship, giving and everyday planning. Clear assumptions up front, and thoughtful reminders where local guidance may differ.",
    practicalTools: "25 practical tools", privateInputs: "Your inputs stay in your browser", notRulings: "Estimates, not rulings", exploreEyebrow: "EXPLORE THE COLLECTION",
    findTool: "Find a calculator", findDescription: "Choose a tool to start. Each estimate explains its inputs and makes its assumptions visible.",
    tools: "tools", openCalculator: "Open calculator", estimateEyebrow: "A NOTE ON ESTIMATES", estimateTitle: "Useful for planning. Not a substitute for guidance.",
    estimateDescription: "Some calculations depend on personal circumstances or scholarly approaches. Review each tool’s assumptions and consult a qualified scholar when a ruling matters.",
    continueExploring: "CONTINUE EXPLORING", relatedCalculators: "Related calculators", browseAll: "Browse all tools", open: "Open", estimateIntro: "estimate",
    pageIntro: "Enter your details for a practical estimate. Review the assumptions and notes before relying on it.",
    notFoundTitle: "Page not found", notFoundDescription: "This calculator page isn't here. Check the address or return to the full collection.", returnToCalculators: "Return to calculators"
  },
  ar: {
    calculators: "الحاسبات", ramadan: "رمضان", finance: "المالية", food: "الطعام", more: "المزيد", home: "الرئيسية", allTools: "كل الحاسبات", footerNote: "تقديرات متأنية لأسئلة الحياة اليومية.",
    breadcrumbCategory: "الحاسبات الإسلامية", heroEyebrow: "أمانة / بداية مدروسة", heroTitle: "حاسبات إسلامية تراعي اختلاف الآراء.",
    heroDescription: "تقديرات عملية للعبادة والعطاء والتخطيط اليومي، مع توضيح الافتراضات والتنبيه إلى اختلاف الإرشادات المحلية.",
    practicalTools: "٢٥ أداة عملية", privateInputs: "تبقى مدخلاتك في متصفحك", notRulings: "تقديرات وليست فتاوى", exploreEyebrow: "استكشف المجموعة",
    findTool: "اختر حاسبة", findDescription: "ابدأ باختيار أداة. توضح كل نتيجة مدخلاتها والافتراضات المستخدمة.",
    tools: "أدوات", openCalculator: "افتح الحاسبة", estimateEyebrow: "ملاحظة حول التقديرات", estimateTitle: "للتخطيط، وليست بديلاً عن الإرشاد.",
    estimateDescription: "تعتمد بعض الحسابات على الظروف الشخصية أو الآراء الفقهية. راجع افتراضات كل أداة واستشر عالماً مؤهلاً عند الحاجة إلى حكم شرعي.",
    continueExploring: "تابع الاستكشاف", relatedCalculators: "حاسبات ذات صلة", browseAll: "تصفح كل الأدوات", open: "افتح", estimateIntro: "تقدير",
    pageIntro: "أدخل بياناتك للحصول على تقدير عملي. راجع الافتراضات والتنبيهات قبل الاعتماد عليه.",
    notFoundTitle: "الصفحة غير موجودة", notFoundDescription: "لا تظهر صفحة الحاسبة المطلوبة. تحقق من العنوان أو عُد إلى مجموعة الحاسبات.", returnToCalculators: "العودة إلى الحاسبات"
  },
  ur: {
    calculators: "کیلکولیٹرز", ramadan: "رمضان", finance: "مالیات", food: "خوراک", more: "مزید", home: "صفحۂ اول", allTools: "تمام کیلکولیٹرز", footerNote: "روزمرہ سوالات کے لیے محتاط اندازے۔",
    breadcrumbCategory: "اسلامی کیلکولیٹرز", heroEyebrow: "امانت / ایک سوچا سمجھا آغاز", heroTitle: "اسلامی کیلکولیٹرز، اختلاف کی گنجائش کے ساتھ۔",
    heroDescription: "عبادت، خیرات اور روزمرہ منصوبہ بندی کے عملی اندازے۔ مفروضے واضح ہیں اور مقامی رہنمائی کے اختلاف کی یاد دہانی بھی۔",
    practicalTools: "۲۵ عملی ٹولز", privateInputs: "آپ کی معلومات اسی براؤزر میں رہتی ہیں", notRulings: "اندازے، شرعی احکام نہیں", exploreEyebrow: "مجموعہ دیکھیں",
    findTool: "کیلکولیٹر منتخب کریں", findDescription: "شروع کرنے کے لیے ایک ٹول منتخب کریں۔ ہر اندازے میں اس کے اِن پٹس اور مفروضے واضح ہیں۔",
    tools: "ٹولز", openCalculator: "کیلکولیٹر کھولیں", estimateEyebrow: "اندازوں کے بارے میں", estimateTitle: "منصوبہ بندی کے لیے، رہنمائی کا متبادل نہیں۔",
    estimateDescription: "کچھ حسابات ذاتی حالات یا فقہی آراء پر منحصر ہوتے ہیں۔ ہر ٹول کے مفروضے دیکھیں اور شرعی حکم درکار ہو تو اہلِ علم سے رجوع کریں۔",
    continueExploring: "مزید دیکھیں", relatedCalculators: "متعلقہ کیلکولیٹرز", browseAll: "تمام ٹولز دیکھیں", open: "کھولیں", estimateIntro: "اندازہ",
    pageIntro: "عملی اندازے کے لیے اپنی معلومات درج کریں۔ انحصار کرنے سے پہلے مفروضے اور وضاحتیں دیکھیں۔",
    notFoundTitle: "صفحہ نہیں ملا", notFoundDescription: "یہ کیلکولیٹر صفحہ موجود نہیں۔ پتہ دیکھیں یا تمام کیلکولیٹرز پر واپس جائیں۔", returnToCalculators: "کیلکولیٹرز پر واپس جائیں"
  }
};

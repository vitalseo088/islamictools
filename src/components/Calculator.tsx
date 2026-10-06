import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import type { Field, Tool } from "../data/tools";
import { categoryCopy, type Locale } from "../data/locales";

type Lang = Locale;
type Values = Record<string, string | number>;
type Detail = { label: string; value: string };
type Outcome = {
  headline: string;
  value: string;
  unit?: string;
  details: Detail[];
  note?: string;
  tone?: "good" | "caution";
};

const copy: Record<Lang, Record<string, string>> = {
  en: {
    estimate: "Your estimate",
    enter: "Adjust the values to see an estimate.",
    calcNote: "An estimate based on the assumptions shown here.",
    assumptions: "Calculation notes",
    currency: "Currency",
    amount: "Amount in selected currency",
    result: "Estimated amount",
    net: "Net zakatable amount",
    threshold: "Your nisab",
    due: "Estimated zakat due",
    eligible: "Eligible",
    below: "Below the entered nisab",
    notDue: "No amount due at the entered threshold.",
    days: "Days",
    pageTarget: "Daily reading target",
    finish: "Estimated completion",
    night: "Night duration",
    lastThird: "Final third of night",
    window: "Estimated window",
    amountDue: "Estimated amount due",
    total: "Estimated total",
    perPerson: "Per traveler",
    remaining: "Remaining budget",
    spend: "Planned spending",
    allocation: "Allocation total",
    balanced: "Percentages total 100%",
    unbalanced: "Percentages must total exactly 100%. Adjust the shares below.",
    missed: "Estimated missed prayers",
    plan: "At this pace",
    outstanding: "Still outstanding",
    dueSummary: "Estimated total due",
    totalValue: "Total value",
    propertyBase: "Included property value",
    excluded: "Personal/rental property principal excluded",
    dueShare: "Estimated crop share",
    type: "Type and threshold",
    none: "No threshold reached",
    first: "Estimated animal due",
    count: "Estimated count",
    provisional: "Provisional share illustration",
    spouseShare: "Spouse",
    motherShare: "Mother",
    fatherShare: "Father",
    childrenShare: "Children",
    childEach: "Each son",
    daughterEach: "Each daughter",
    complete: "Completed",
    left: "Remaining pages",
    pace: "Daily reading pace",
    finishDate: "Estimated finish date",
    quranTotal: "Total pages",
    goldValue: "Metal value",
    fasts: "Qualifying fasts",
    dayCount: "Days included",
    income: "Income",
    totalCosts: "Total trip cost",
    totalGift: "Planned giving",
    outstandingDeferred: "Deferred and unpaid",
    share: "Share",
    portion: "Estimated portion",
    feedNote: "Use a local feeding cost and confirm whether this applies to you.",
    balancedLabel: "Share total",
    unallocated: "Remainder not allocated by this simplified scenario",
    readResult: "Estimate updates as you edit.",
    pagesUnit: "pages",
    pagesPerDay: "pages / day",
    prayersUnit: "prayers",
    prayersPerDay: "prayers / day",
    hoursUnit: "hours",
    daysUnit: "days",
    gramUnit: "g",
    kgUnit: "kg",
    animalsUnit: "animals",
    travelersUnit: "travelers",
    sheepOrGoats: "Sheep / goats",
    sheepOrGoatsDue: "sheep / goats",
    noAnimalDue: "No animal due",
    yearling: "yearling",
    yearlings: "yearlings",
    twoYearOld: "two-year-old",
    twoYearOlds: "two-year-olds",
    cattleThresholdReached: "Threshold reached; see note",
    cattleNote: "Cattle thresholds are conventionally assessed in 30- and 40-head groups; this total does not form a simple group.",
    naturalIrrigation: "10% · natural / rain-fed",
    paidIrrigation: "5% · paid irrigation",
    harvestLabel: "Harvest",
    nisabReached: "Nisab reached",
    ishraqEstimate: "Ishraq estimate",
    duhaEstimate: "Duha latest estimate",
    agreedLabel: "Agreed",
    paidLabel: "Paid",
    travelersLabel: "Travelers",
    dailyGiftsLabel: "Daily gifts",
    oneOffGiftLabel: "One-off gift",
    reviewInputs: "Please review these inputs",
    validNumber: "enter a valid number.",
    minimum: "minimum",
    maximum: "maximum",
    sheepOption: "Sheep / goats",
    cattleOption: "Cattle",
    missedSalahNote: "Approximate day lengths and personal circumstances can change the estimate.",
    tahajjudNote: "Based on the local Maghrib and Fajr times you entered.",
    ishraqDuhaNote: "Local prayer schedules and scholarly practice may vary.",
    mahrNote: "Amounts are recorded as entered; this does not interpret the agreement.",
    inheritanceNote: "Provisional illustration for the listed immediate family only. It assumes no unlisted heirs or exclusions, does not resolve every residuary case, and is not legal or religious advice. Have a qualified faraid specialist review any real estate.",
    kaffarahNote: "Not every invalid fast requires kaffarah. Confirm the ruling for your circumstances.",
    budgetExcessNote: "Planned expenses exceed the income entered."
  },
  ar: {
    estimate: "تقديرك",
    enter: "عدّل القيم لعرض التقدير.",
    calcNote: "تقدير مبني على الافتراضات الموضحة هنا.",
    assumptions: "ملاحظات الحساب",
    currency: "العملة",
    amount: "المبلغ بالعملة المختارة",
    result: "المبلغ التقديري",
    net: "صافي المال الخاضع للزكاة",
    threshold: "النصاب الذي أدخلته",
    due: "الزكاة التقديرية",
    eligible: "مستوفٍ للنصاب",
    below: "أقل من النصاب المدخل",
    notDue: "لا يظهر مبلغ مستحق عند النصاب المدخل.",
    days: "الأيام",
    pageTarget: "الورد اليومي المطلوب",
    finish: "موعد الإتمام المتوقع",
    night: "مدة الليل",
    lastThird: "الثلث الأخير من الليل",
    window: "الوقت التقديري",
    amountDue: "المقدار التقديري",
    total: "الإجمالي التقديري",
    perPerson: "لكل مسافر",
    remaining: "المتبقي من الميزانية",
    spend: "الإنفاق المخطط",
    allocation: "مجموع التوزيع",
    balanced: "مجموع النسب ١٠٠٪",
    unbalanced: "يجب أن يكون مجموع النسب ١٠٠٪ تماماً. عدّل النسب أدناه.",
    missed: "عدد الصلوات الفائتة التقديري",
    plan: "بهذه الوتيرة",
    outstanding: "المتبقي",
    dueSummary: "الإجمالي التقديري المستحق",
    totalValue: "القيمة الإجمالية",
    propertyBase: "قيمة العقار المحتسبة",
    excluded: "تم استبعاد أصل العقار الشخصي أو المؤجر",
    dueShare: "حصة المحصول التقديرية",
    type: "النوع والنصاب",
    none: "لم يبلغ النصاب",
    first: "العدد التقديري المستحق",
    count: "العدد التقديري",
    provisional: "توضيح مبدئي للأنصبة",
    spouseShare: "الزوج أو الزوجة",
    motherShare: "الأم",
    fatherShare: "الأب",
    childrenShare: "الأبناء",
    childEach: "نصيب كل ابن",
    daughterEach: "نصيب كل بنت",
    complete: "الإتمام",
    left: "الصفحات المتبقية",
    pace: "القراءة اليومية",
    finishDate: "تاريخ الإتمام المتوقع",
    quranTotal: "إجمالي الصفحات",
    goldValue: "قيمة المعدن",
    fasts: "الصيامات المعنية",
    dayCount: "عدد الأيام",
    income: "الدخل",
    totalCosts: "إجمالي تكلفة الرحلة",
    totalGift: "إجمالي العطاء المخطط",
    outstandingDeferred: "المؤخر غير المدفوع",
    share: "الحصة",
    portion: "المقدار التقديري",
    feedNote: "استخدم تكلفة الإطعام المحلية وتحقق من انطباق الحكم على حالتك.",
    balancedLabel: "مجموع الحصص",
    unallocated: "المتبقي غير موزع في هذا السيناريو المبسط",
    readResult: "يتحدث التقدير تلقائياً مع تعديل المدخلات.",
    pagesUnit: "صفحة",
    pagesPerDay: "صفحة / يوم",
    prayersUnit: "صلاة",
    prayersPerDay: "صلوات / يوم",
    hoursUnit: "ساعات",
    daysUnit: "أيام",
    gramUnit: "غرام",
    kgUnit: "كغ",
    animalsUnit: "رؤوس",
    travelersUnit: "أشخاص",
    sheepOrGoats: "أغنام أو ماعز",
    sheepOrGoatsDue: "شاة / ماعز",
    noAnimalDue: "لا تجب زكاة",
    yearling: "تبيع (سنة واحدة)",
    yearlings: "أتبعة",
    twoYearOld: "مسنة (سنتان)",
    twoYearOlds: "مسنات",
    cattleThresholdReached: "بلغ النصاب، انظر الملاحظة",
    cattleNote: "تُحسب أنصبة البقر تقليدياً في مجموعات من ٣٠ و٤٠ رأساً؛ ولا يشكّل هذا المجموع مجموعة بسيطة.",
    naturalIrrigation: "١٠٪ · ري طبيعي / مطري",
    paidIrrigation: "٥٪ · ري مدفوع / اصطناعي",
    harvestLabel: "المحصول",
    nisabReached: "بلغ النصاب",
    ishraqEstimate: "تقدير وقت الإشراق",
    duhaEstimate: "آخر وقت الضحى التقديري",
    agreedLabel: "المتفق عليه",
    paidLabel: "المدفوع",
    travelersLabel: "المسافرون",
    dailyGiftsLabel: "العطاء اليومي",
    oneOffGiftLabel: "عطاء لمرة واحدة",
    reviewInputs: "يرجى مراجعة هذه المدخلات",
    validNumber: "أدخل رقماً صحيحاً.",
    minimum: "الحد الأدنى",
    maximum: "الحد الأقصى",
    sheepOption: "أغنام أو ماعز",
    cattleOption: "أبقار",
    missedSalahNote: "تختلف التقديرات باختلاف الظروف الشخصية وطول الأيام التقريبي.",
    tahajjudNote: "بناءً على أوقات المغرب والفجر المحلية التي أدخلتها.",
    ishraqDuhaNote: "قد تختلف مواقيت الصلاة المحلية والاجتهادات الفقهية.",
    mahrNote: "تسجل المبالغ كما أُدخلت، ولا يعد ذلك تفسيراً للاتفاق.",
    inheritanceNote: "توضيح مبدئي للورثة المباشرين المذكورين فقط. يفترض عدم وجود ورثة آخرين أو حجب، ولا يحل كل حالات العصبة، ولا يعد فتوى أو استشارة قانونية. يرجى مراجعة مختص بالفرائض لأي تركة عقارية.",
    kaffarahNote: "لا يوجب كل فطر كفارة، يرجى التحقق من الحكم الشرعي الخاص بحالتك.",
    budgetExcessNote: "المصروفات المخططة تتجاوز الدخل المدخل."
  },
  ur: {
    estimate: "آپ کا اندازہ",
    enter: "اندازہ دیکھنے کے لیے اقدار تبدیل کریں۔",
    calcNote: "یہاں درج مفروضوں کی بنیاد پر اندازہ۔",
    assumptions: "حساب کی وضاحت",
    currency: "کرنسی",
    amount: "منتخب کرنسی میں رقم",
    result: "اندازاً رقم",
    net: "قابلِ زکوٰۃ خالص مال",
    threshold: "آپ کا نصاب",
    due: "اندازاً زکوٰۃ",
    eligible: "نصاب پورا ہے",
    below: "درج کردہ نصاب سے کم",
    notDue: "درج کردہ نصاب پر کوئی رقم واجب نہیں۔",
    days: "دن",
    pageTarget: "روزانہ تلاوت کا ہدف",
    finish: "تکمیل کا متوقع وقت",
    night: "رات کا دورانیہ",
    lastThird: "رات کا آخری تہائی حصہ",
    window: "اندازاً وقت",
    amountDue: "اندازاً واجب مقدار",
    total: "اندازاً کل",
    perPerson: "فی مسافر",
    remaining: "بجٹ میں باقی",
    spend: "منصوبہ بند خرچ",
    allocation: "تقسیم کا مجموعہ",
    balanced: "فیصد کا مجموعہ ۱۰۰٪ ہے",
    unbalanced: "فیصد کا مجموعہ بالکل ۱۰۰٪ ہونا چاہیے۔ نیچے حصے درست کریں۔",
    missed: "اندازاً قضا نمازیں",
    plan: "اس رفتار سے",
    outstanding: "باقی رقم",
    dueSummary: "اندازاً کل واجب",
    totalValue: "کل مالیت",
    propertyBase: "شامل جائیداد کی مالیت",
    excluded: "ذاتی یا کرایے کی جائیداد کی اصل قیمت شامل نہیں",
    dueShare: "اندازاً زرعی حصہ",
    type: "قسم اور نصاب",
    none: "نصاب پورا نہیں ہوا",
    first: "اندازاً واجب جانور",
    count: "اندازاً تعداد",
    provisional: "حصص کی عارضی وضاحت",
    spouseShare: "شوہر یا بیوی",
    motherShare: "والدہ",
    fatherShare: "والد",
    childrenShare: "اولاد",
    childEach: "ہر بیٹے کا حصہ",
    daughterEach: "ہر بیٹی کا حصہ",
    complete: "تکمیل",
    left: "باقی صفحات",
    pace: "روزانہ مطالعہ",
    finishDate: "تکمیل کی متوقع تاریخ",
    quranTotal: "کل صفحات",
    goldValue: "دھات کی مالیت",
    fasts: "متعلقہ روزے",
    dayCount: "شامل دن",
    income: "آمدنی",
    totalCosts: "سفر کی کل لاگت",
    totalGift: "منصوبہ بند عطیہ",
    outstandingDeferred: "باقی مؤخر رقم",
    share: "حصہ",
    portion: "اندازاً مقدار",
    feedNote: "مقامی کھانے کی لاگت استعمال کریں اور اپنے معاملے پر اطلاق کی تصدیق کریں۔",
    balancedLabel: "حصص کا مجموعہ",
    unallocated: "اس سادہ صورت میں باقی رقم تقسیم نہیں کی گئی",
    readResult: "مدخلات کے ساتھ اندازہ خودکار طریقے سے تبدیل ہوتا ہے۔",
    pagesUnit: "صفحات",
    pagesPerDay: "صفحات / دن",
    prayersUnit: "نمازیں",
    prayersPerDay: "نمازیں / دن",
    hoursUnit: "گھنٹے",
    daysUnit: "دن",
    gramUnit: "گرام",
    kgUnit: "کلوگرام",
    animalsUnit: "جانور",
    travelersUnit: "افراد",
    sheepOrGoats: "بھیڑ یا بکری",
    sheepOrGoatsDue: "بھیڑ یا بکری",
    noAnimalDue: "کوئی جانور واجب نہیں",
    yearling: "ایک سالہ بچھڑا",
    yearlings: "ایک سالہ بچھڑے",
    twoYearOld: "دو سالہ بچھڑا",
    twoYearOlds: "دو سالہ بچھڑے",
    cattleThresholdReached: "نصاب پورا ہے، وضاحت دیکھیں",
    cattleNote: "گائے کے نصاب کا حساب عام طور پر ۳۰ اور ۴۰ کے گروہوں میں لگایا جاتا ہے؛ یہ تعداد کسی سادہ گروہ میں تقسیم نہیں ہوتی۔",
    naturalIrrigation: "۱۰٪ · قدرتی / بارانی",
    paidIrrigation: "۵٪ · مصنوعی / ادا شدہ آب پاشی",
    harvestLabel: "فصل",
    nisabReached: "نصاب پورا ہے",
    ishraqEstimate: "اشراق کا تخمینی وقت",
    duhaEstimate: "چاشت کا آخری وقت",
    agreedLabel: "طے شدہ کل",
    paidLabel: "ادا شدہ",
    travelersLabel: "مسافر",
    dailyGiftsLabel: "روزانہ عطیات",
    oneOffGiftLabel: "یک وقتی عطیہ",
    reviewInputs: "براہ کرم ان مدخلات کی تصدیق کریں",
    validNumber: "درست عدد درج کریں۔",
    minimum: "کم از کم",
    maximum: "زیادہ سے زیادہ",
    sheepOption: "بھیڑ یا بکری",
    cattleOption: "گائے",
    missedSalahNote: "دنوں کی تقریب اور ذاتی حالات کے مطابق اندازے میں فرق ہو سکتا ہے۔",
    tahajjudNote: "آپ کے درج کردہ مقامی مغرب اور فجر کے اوقات پر مبنی۔",
    ishraqDuhaNote: "مقامی اوقاتِ نماز اور فقہی رہنمائی میں فرق ہو سکتا ہے۔",
    mahrNote: "رقمیں درج شدہ معلومات کے مطابق ہیں، یہ معاہدے کی شرعی تعبیر نہیں۔",
    inheritanceNote: "صرف درج شدہ قریبی ورثاء کے لیے عارضی خاکہ۔ اس میں غیر درج شدہ ورثاء یا حجب کا احاطہ نہیں، تمام عصبہ صورتیں حل نہیں ہوتیں اور یہ قانونی یا شرعی فتوی نہیں۔ جائیداد کی تقسیم کے لیے ماہرِ فرائض سے رجوع کریں۔",
    kaffarahNote: "ہر روزہ ٹوٹنے پر کفارہ واجب نہیں ہوتا، اپنے مخصوص مسئلے کے لیے شرعی حکم کی تصدیق کریں۔",
    budgetExcessNote: "منصوبہ بند اخراجات درج کردہ آمدنی سے زیادہ ہیں۔"
  }
};

const titles: Record<string, Record<Lang, string>> = {
  "zakat-calculator": { en: "Zakat Calculator", ar: "حاسبة الزكاة", ur: "زکوٰۃ کیلکولیٹر" },
  "zakat-on-gold": { en: "Zakat on Gold", ar: "زكاة الذهب", ur: "سونے کی زکوٰۃ" },
  "zakat-on-silver": { en: "Zakat on Silver", ar: "زكاة الفضة", ur: "چاندی کی زکوٰۃ" },
  "fidyah-calculator": { en: "Fidyah Calculator", ar: "حاسبة الفدية", ur: "فدیہ کیلکولیٹر" },
  "kaffarah-calculator": { en: "Kaffarah Calculator", ar: "حاسبة الكفارة", ur: "کفارہ کیلکولیٹر" },
  "missed-salah-calculator": { en: "Missed Salah Calculator", ar: "حاسبة الصلوات الفائتة", ur: "قضا نماز کیلکولیٹر" },
  "quran-reading-goal": { en: "Quran Reading Goal", ar: "هدف قراءة القرآن", ur: "قرآن خوانی کا ہدف" },
  "quran-completion-calculator": { en: "Quran Completion Calculator", ar: "حاسبة ختم القرآن", ur: "قرآن مکمل کرنے کا کیلکولیٹر" },
  "quran-page-calculator": { en: "Quran Page Calculator", ar: "حاسبة صفحات القرآن", ur: "قرآن صفحات کیلکولیٹر" },
  "tahajjud-time-calculator": { en: "Tahajjud Time Calculator", ar: "حاسبة وقت التهجد", ur: "تہجد کے وقت کا کیلکولیٹر" },
  "ishraq-duha-time-calculator": { en: "Ishraq & Duha Time", ar: "وقت الإشراق والضحى", ur: "اشراق و چاشت کا وقت" },
  "business-zakat-calculator": { en: "Business Zakat", ar: "زكاة التجارة", ur: "کاروباری زکوٰۃ" },
  "cash-savings-zakat-calculator": { en: "Cash & Savings Zakat", ar: "زكاة النقد والمدخرات", ur: "نقدی اور بچت کی زکوٰۃ" },
  "investment-zakat-calculator": { en: "Investment Zakat", ar: "زكاة الاستثمارات", ur: "سرمایہ کاری کی زکوٰۃ" },
  "crypto-zakat-calculator": { en: "Crypto Zakat", ar: "زكاة العملات الرقمية", ur: "کرپٹو کی زکوٰۃ" },
  "property-zakat-calculator": { en: "Property Zakat", ar: "زكاة العقار", ur: "جائیداد کی زکوٰۃ" },
  "agricultural-zakat-calculator": { en: "Agricultural Zakat", ar: "زكاة الزروع", ur: "زرعی زکوٰۃ" },
  "livestock-zakat-calculator": { en: "Livestock Zakat", ar: "زكاة الأنعام", ur: "مویشیوں کی زکوٰۃ" },
  "mahr-calculator": { en: "Mahr Calculator", ar: "حاسبة المهر", ur: "مہر کیلکولیٹر" },
  "islamic-inheritance-calculator": { en: "Inheritance Estimate", ar: "تقدير الميراث", ur: "وراثت کا اندازہ" },
  "hajj-cost-calculator": { en: "Hajj Cost Calculator", ar: "حاسبة تكلفة الحج", ur: "حج کے اخراجات کیلکولیٹر" },
  "umrah-cost-calculator": { en: "Umrah Cost Calculator", ar: "حاسبة تكلفة العمرة", ur: "عمرہ اخراجات کیلکولیٹر" },
  "ramadan-budget-calculator": { en: "Ramadan Budget", ar: "ميزانية رمضان", ur: "رمضان بجٹ" },
  "ramadan-charity-calculator": { en: "Ramadan Charity Planner", ar: "مخطط صدقة رمضان", ur: "رمضان صدقہ منصوبہ" },
  "islamic-charity-calculator": { en: "Charity Allocation", ar: "توزيع الصدقة", ur: "صدقہ کی تقسیم" }
};

const fieldsText: Record<string, Record<Lang, string>> = {
  cash: { en: "Cash", ar: "النقد", ur: "نقد رقم" },
  gold: { en: "Gold and silver value", ar: "قيمة الذهب والفضة", ur: "سونے اور چاندی کی مالیت" },
  investments: { en: "Eligible investments", ar: "الاستثمارات المؤهلة", ur: "قابلِ زکوٰۃ سرمایہ کاری" },
  business: { en: "Business stock and cash", ar: "بضاعة التجارة والنقد", ur: "کاروباری مال اور نقدی" },
  receivables: { en: "Collectable receivables", ar: "الديون المرجوة", ur: "وصول ہونے والی رقوم" },
  debts: { en: "Eligible short-term liabilities", ar: "الالتزامات القصيرة المؤهلة", ur: "قابلِ منہا مختصر مدتی واجبات" },
  nisab: { en: "Nisab threshold", ar: "حد النصاب", ur: "نصاب کی حد" },
  weight: { en: "Weight", ar: "الوزن", ur: "وزن" },
  price: { en: "Price per gram", ar: "السعر للغرام", ur: "فی گرام قیمت" },
  days: { en: "Days", ar: "الأيام", ur: "دن" },
  cost: { en: "Local feeding cost per day", ar: "تكلفة الإطعام المحلية لليوم", ur: "مقامی یومیہ کھانے کی لاگت" },
  fasts: { en: "Qualifying fasts", ar: "الصيامات المعنية", ur: "متعلقہ روزے" },
  years: { en: "Years", ar: "السنوات", ur: "سال" },
  months: { en: "Additional months", ar: "أشهر إضافية", ur: "اضافی ماہ" },
  catchup: { en: "Catch-up prayers per day", ar: "صلوات القضاء يومياً", ur: "روزانہ قضا نمازیں" },
  completions: { en: "Completions", ar: "عدد الختمات", ur: "قرآن ختم کی تعداد" },
  pages: { en: "Pages per mushaf", ar: "صفحات المصحف", ur: "مصحف کے صفحات" },
  current: { en: "Current page", ar: "الصفحة الحالية", ur: "موجودہ صفحہ" },
  pace: { en: "Pages per day", ar: "صفحات يومياً", ur: "روزانہ صفحات" },
  maghrib: { en: "Maghrib", ar: "المغرب", ur: "مغرب" },
  fajr: { en: "Fajr", ar: "الفجر", ur: "فجر" },
  sunrise: { en: "Sunrise", ar: "الشروق", ur: "طلوعِ آفتاب" },
  dhuhr: { en: "Dhuhr", ar: "الظهر", ur: "ظہر" },
  offset: { en: "Minutes after sunrise", ar: "دقائق بعد الشروق", ur: "طلوع کے بعد منٹ" },
  buffer: { en: "Minutes before Dhuhr", ar: "دقائق قبل الظهر", ur: "ظہر سے پہلے منٹ" },
  inventory: { en: "Resale inventory", ar: "مخزون التجارة", ur: "فروخت کے لیے مال" },
  bank: { en: "Bank balances", ar: "الأرصدة البنكية", ur: "بینک بیلنس" },
  portfolio: { en: "Portfolio value", ar: "قيمة المحفظة", ur: "پورٹ فولیو کی مالیت" },
  percentage: { en: "Zakatable share", ar: "النسبة الخاضعة للزكاة", ur: "قابلِ زکوٰۃ حصہ" },
  crypto: { en: "Crypto holdings at current value", ar: "قيمة العملات الرقمية الحالية", ur: "کرپٹو کی موجودہ مالیت" },
  fiat: { en: "Cash and fiat holdings", ar: "النقد والعملات التقليدية", ur: "نقدی اور عام کرنسی" },
  purpose: { en: "Property held for", ar: "الغرض من العقار", ur: "جائیداد رکھنے کا مقصد" },
  property: { en: "Current resale inventory value", ar: "قيمة العقار المعد للبيع", ur: "فروخت کے لیے جائیداد کی مالیت" },
  irrigation: { en: "Irrigation method", ar: "طريقة الري", ur: "آب پاشی کا طریقہ" },
  nisabKg: { en: "Nisab threshold", ar: "حد النصاب", ur: "نصاب کی حد" },
  animal: { en: "Livestock type", ar: "نوع الماشية", ur: "مویشی کی قسم" },
  count: { en: "Headcount", ar: "عدد الرؤوس", ur: "جانوروں کی تعداد" },
  agreed: { en: "Total agreed mahr", ar: "إجمالي المهر المتفق عليه", ur: "طے شدہ کل مہر" },
  paid: { en: "Amount already paid", ar: "المبلغ المدفوع", ur: "ادا شدہ رقم" },
  deferred: { en: "Amount explicitly deferred", ar: "المبلغ المؤجل", ur: "مؤخر رقم" },
  estate: { en: "Estate after debts and bequests", ar: "التركة بعد الديون والوصايا", ur: "قرض اور وصیت کے بعد ترکہ" },
  spouse: { en: "Surviving spouse", ar: "الزوج أو الزوجة", ur: "زندہ شریکِ حیات" },
  sons: { en: "Sons", ar: "الأبناء", ur: "بیٹے" },
  daughters: { en: "Daughters", ar: "البنات", ur: "بیٹیاں" },
  mother: { en: "Mother survives", ar: "الأم على قيد الحياة", ur: "والدہ حیات ہیں" },
  father: { en: "Father survives", ar: "الأب على قيد الحياة", ur: "والد حیات ہیں" },
  package: { en: "Package", ar: "الباقة", ur: "پیکیج" },
  flight: { en: "Flights", ar: "الرحلات الجوية", ur: "فضائی سفر" },
  lodging: { en: "Additional lodging", ar: "إقامة إضافية", ur: "اضافی رہائش" },
  transport: { en: "Local transport", ar: "النقل المحلي", ur: "مقامی سفر" },
  food: { en: "Food", ar: "الطعام", ur: "کھانا" },
  other: { en: "Other costs", ar: "تكاليف أخرى", ur: "دیگر اخراجات" },
  travelers: { en: "Travelers", ar: "المسافرون", ur: "مسافر" },
  household: { en: "Household", ar: "المنزل", ur: "گھر" },
  travel: { en: "Travel", ar: "السفر", ur: "سفر" },
  gifts: { en: "Gifts", ar: "الهدايا", ur: "تحائف" },
  charity: { en: "Charity", ar: "الصدقة", ur: "صدقہ" },
  income: { en: "Monthly income", ar: "الدخل الشهري", ur: "ماہانہ آمدنی" },
  daily: { en: "Daily gift", ar: "العطاء اليومي", ur: "روزانہ عطیہ" },
  once: { en: "One-off gift", ar: "عطاء لمرة واحدة", ur: "ایک مرتبہ عطیہ" },
  donation: { en: "Total donation", ar: "إجمالي التبرع", ur: "کل عطیہ" },
  local: { en: "Local relief", ar: "الإغاثة المحلية", ur: "مقامی امداد" },
  emergency: { en: "Emergency support", ar: "دعم الطوارئ", ur: "ہنگامی مدد" },
  education: { en: "Education", ar: "التعليم", ur: "تعلیم" },
  health: { en: "Health", ar: "الصحة", ur: "صحت" }
};

const toolCaveats: Record<string, Record<Exclude<Lang, "en">, string>> = {
  "zakat-calculator": {
    ar: "تتطلب الأهلية والديون وشرط الحول تقييماً شخصياً. النصاب يدخله المستخدم.",
    ur: "اہلیت، قرض اور سال گزرنے کی شرط ذاتی جائزے کی محتاج ہے۔ نصاب صارف کی طرف سے درج کیا جاتا ہے۔"
  },
  "zakat-on-gold": {
    ar: "يختلف عيار الذهب واستثناء الحلي الشخصي ومعايير الوزن باختلاف المذاهب. نصاب الذهب تقليدياً ٨٥ غراماً.",
    ur: "خلوص، ذاتی زیورات کی استثناء اور وزن کے معیارات میں فقہی اختلاف ہے۔ سونے کا روایتی نصاب ۸۵ گرام ہے۔"
  },
  "zakat-on-silver": {
    ar: "تختلف معايير الوزن وتفسير نصاب الفضة. نصاب الفضة تقليدياً ٥٩٥ غراماً.",
    ur: "وزن کے معیارات اور چاندی کے نصاب کی تعبیر میں اختلاف ہے۔ چاندی کا روایتی نصاب ۵۹۵ گرام ہے۔"
  },
  "fidyah-calculator": {
    ar: "تحديد من تجب عليه الفدية وصيغ الإطعام المقبولة والتكلفة المحلية تتطلب استشارة أهل العلم المحليين.",
    ur: "فدیہ کے مستحق افراد، خوراک کی قابلِ قبول صورتیں اور مقامی اخراجات کے لیے مقامی علماء سے رہنمائی لیں۔"
  },
  "kaffarah-calculator": {
    ar: "ينبغي التأكد من أحكام الفطر العمد وترتيب الكفارة وتكلفة الإطعام المحلية مع عالم مؤهل.",
    ur: "جان بوجھ کر روزہ توڑنے کے احکام، کفارے کی ترتیب اور مقامی اخراجات کی تصدیق اہلِ علم سے کرنی چاہیے۔"
  },
  "missed-salah-calculator": {
    ar: "لا يراعي هذا التقدير المبسط رخص السفر والمرض أو اختلاف آراء الفقهاء في قضاء الصلوات.",
    ur: "یہ سادہ اندازہ سفر، بیماری کے استثناء یا قضا نمازوں سے متعلق فقہی اختلافات کو شامل نہیں کرتا۔"
  },
  "tahajjud-time-calculator": {
    ar: "تؤثر المواقيت المحلية وتعريف الفجر وتغير الفصول على حساب الليل. تأكد من جدول مواقيت الصلاة المحلي.",
    ur: "مقامی نظام الاوقات، فجر کی تعریف اور موسمی تبدیلیاں رات کے حساب پر اثر انداز ہوتی ہیں۔ مقامی نقشہ اوقات سے تصدیق کریں۔"
  },
  "ishraq-duha-time-calculator": {
    ar: "الحسابات هي فوارق زمنية تقريبية. اتبع جداول الصلاة المحلية وإرشادات العلماء للأوقات المستحبة.",
    ur: "یہ اوقات تخمینی ہیں۔ مستحب اوقات کے لیے اپنے مقامی نقشہ اوقات اور علماء کی رہنمائی پر عمل کریں۔"
  },
  "business-zakat-calculator": {
    ar: "تختلف طرق تقييم المخزون وحسم الديون باختلاف المذاهب. النصاب يدخله المستخدم.",
    ur: "مالِ تجارت کی قیمت (لاگت یا فروخت) اور قرض منہا کرنے کے طریقہ کار میں اختلاف ہے۔ نصاب صارف کا درج کردہ ہے۔"
  },
  "cash-savings-zakat-calculator": {
    ar: "تتطلب الأهلية والديون وشرط الحول تقييماً شخصياً. النصاب يدخله المستخدم.",
    ur: "اہلیت، قرض اور سال گزرنے کی شرط ذاتی جائزے کی محتاج ہے۔ نصاب صارف کی طرف سے درج کیا جاتا ہے۔"
  },
  "investment-zakat-calculator": {
    ar: "يختلف حكم الاستثمارات باختلاف نوع الأصل والمنهج الفقهي. النسبة المئوية افتراض تتحكم فيه بنفسك.",
    ur: "اثاثے کی نوعیت اور فقہی طریقہ کار کے مطابق سرمایہ کاری کے احکام میں فرق ہے۔ فیصد کا تناسب آپ کے اختیار میں ہے۔"
  },
  "crypto-zakat-calculator": {
    ar: "تختلف الآراء في تقييم العملات الرقمية وزكاتها. اعتمد وقتاً ثابتاً للتقييم واطلب فتوى تناسب ظروفك.",
    ur: "کرپٹو کی مالیت اور زکوٰۃ کے حکم میں آراء مختلف ہیں۔ قیمت کا مستقل وقت طے کریں اور اپنے حالات کے مطابق رہنمائی حاصل کریں۔"
  },
  "property-zakat-calculator": {
    ar: "تغير النية وطبيعة النشاط العقاري الحكم. يُستبعد أصل العقار المؤجر في هذا التقدير المبسط؛ ويمكن إدراج ريع الإيجار كنقد.",
    ur: "جائیداد کی نیت اور کاروباری نوعیت سے حکم بدل سکتا ہے۔ کرائے کی جائیداد کی اصل مالیت اس تخمینے سے خارج ہے، البتہ کرایہ نقدی میں شامل ہو سکتا ہے۔"
  },
  "agricultural-zakat-calculator": {
    ar: "تختلف أصناف الزروع والتكاليف والنصاب وتفاصيل الحساب في الإرشادات الفقهية. هذا تقدير مبسط.",
    ur: "پیداوار کی اقسام، اخراجات، نصاب اور طریقہ کار میں فقہی اختلاف ہے۔ یہ ایک سادہ اندازہ ہے۔"
  },
  "livestock-zakat-calculator": {
    ar: "يعتمد هذا الفاحص المبسط على الأنصبة الأساسية الشائعة فقط. قد تغير شروط السوم والحول والسن والخلطة الأهلية والمقدار الواجب.",
    ur: "یہ سادہ کیلکولیٹر صرف بنیادی نصابوں پر مبنی ہے۔ چرنے کی شرط، سال گزرنا، جانور کی عمر اور ملا جلا ریوڑ شرائط و مقدار پر اثر انداز ہو سکتے ہیں۔"
  },
  "mahr-calculator": {
    ar: "هذه أداة لتدوين الحساب وليست حكماً شرعياً أو قانونياً. أكد الاتفاقات مع الأطراف والجهات المختصة.",
    ur: "یہ صرف یادداشت اور حساب کا ذریعہ ہے، شرعی فیصلہ یا قانونی دستاویز نہیں۔ فریقین اور متعلقہ رہنمائی سے توثیق کریں۔"
  },
  "islamic-inheritance-calculator": {
    ar: "توضيح تعليمي مبدئي فقط. يفترض اكتمال الورثة المباشرين ويغفل تفاصيل الحجب والعصبات والقوانين المحلية. يرجى مراجعة مختص بالفرائض لأي تركة عقارية.",
    ur: "صرف تعلیمی اور عارضی خاکہ۔ اس میں قریبی خاندان کی محدود صورتیں ہیں اور کئی ورثاء، عصبات اور قانونی پہلو شامل نہیں۔ جائیداد کے لیے ماہرِ فرائض سے تصدیق کریں۔"
  },
  "islamic-charity-calculator": {
    ar: "أداة للتخطيط فقط، ولا تحدد ما إذا كان المستفيد أو العطاء يستوفي شروط الزكاة.",
    ur: "صرف منصوبہ بندی کی سہولت۔ اس سے یہ طے نہیں ہوتا کہ عطیہ یا وصول کنندہ زکوٰۃ کا مستحق ہے یا نہیں۔"
  }
};

const charityLabels: Record<string, Record<Lang, string>> = {
  local: { en: "Local relief", ar: "الإغاثة المحلية", ur: "مقامی امداد" },
  emergency: { en: "Emergency support", ar: "دعم الطوارئ", ur: "ہنگامی مدد" },
  education: { en: "Education", ar: "التعليم", ur: "تعلیم" },
  health: { en: "Health", ar: "الصحة", ur: "صحت" },
  other: { en: "Other giving", ar: "عطاء آخر", ur: "دیگر عطیات" }
};

function fieldLabel(field: Field, lang: Lang, slug: string) {
  if (field.name === "cash" && slug === "zakat-calculator") {
    return ({ en: "Cash and bank balances", ar: "النقد والأرصدة البنكية", ur: "نقدی اور بینک بیلنس" } as const)[lang];
  }
  if (field.name === "weight" && slug === "agricultural-zakat-calculator") {
    return ({ en: "Harvest weight", ar: "وزن المحصول", ur: "فصل کا وزن" } as const)[lang];
  }
  if (field.name === "nisab" && slug === "zakat-on-gold") {
    return ({ en: "Gold nisab (grams)", ar: "نصاب الذهب (غرام)", ur: "سونے کا نصاب (گرام)" } as const)[lang];
  }
  if (field.name === "nisab" && slug === "zakat-on-silver") {
    return ({ en: "Silver nisab (grams)", ar: "نصاب الفضة (غرام)", ur: "چاندی کا نصاب (گرام)" } as const)[lang];
  }
  return fieldsText[field.name]?.[lang] ?? field.label;
}

function categoryLabel(category: string, lang: Lang) {
  return lang === "en" ? category : categoryCopy[category]?.[lang] ?? category;
}

function formatUnit(unit: string | undefined, lang: Lang, currency: string) {
  if (!unit) return "";
  if (unit === "currency") return currency;
  if (unit === "%") return lang === "ar" || lang === "ur" ? "٪" : "%";
  const units: Record<string, Record<Lang, string>> = {
    kg: { en: "kg", ar: "كغ", ur: "کلوگرام" },
    animals: { en: "animals", ar: "رؤوس", ur: "جانور" },
    heirs: { en: "heirs", ar: "ورثة", ur: "ورثاء" },
    people: { en: "people", ar: "أشخاص", ur: "افراد" },
    days: { en: "days", ar: "أيام", ur: "دن" }
  };
  return units[unit]?.[lang] ?? unit;
}

function optionLabel(field: Field, option: { label: string; value: string }, lang: Lang) {
  if (lang === "en") return option.label;
  const words: Record<string, Partial<Record<Lang, string>>> = {
    "purpose:resale": { ar: "إعادة البيع / التجارة", ur: "دوبارہ فروخت / تجارت" },
    "purpose:use": { ar: "للاستخدام الشخصي أو التأجير", ur: "ذاتی استعمال یا کرایے کے لیے" },
    "irrigation:natural": { ar: "طبيعي / مطري — ١٠٪", ur: "قدرتی / بارانی — ۱۰٪" },
    "irrigation:paid": { ar: "ري مدفوع / اصطناعي — ٥٪", ur: "مصنوعی / ادا شدہ آب پاشی — ۵٪" },
    "animal:sheep": { ar: "أغنام أو ماعز", ur: "بھیڑ یا بکری" },
    "animal:cattle": { ar: "أبقار", ur: "گائے" },
    "spouse:none": { ar: "لا يوجد", ur: "کوئی نہیں" },
    "spouse:husband": { ar: "زوج", ur: "شوہر" },
    "spouse:wife": { ar: "زوجة", ur: "بیوی" },
    "mother:no": { ar: "لا", ur: "نہیں" },
    "mother:yes": { ar: "نعم", ur: "ہاں" },
    "father:no": { ar: "لا", ur: "نہیں" },
    "father:yes": { ar: "نعم", ur: "ہاں" }
  };
  return words[`${field.name}:${option.value}`]?.[lang] ?? option.label;
}

function num(values: Values, key: string) {
  const value = Number(values[key] ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function clockValue(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function clockText(value: number, _lang: Lang) {
  const mins = ((Math.round(value) % 1440) + 1440) % 1440;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

function compute(tool: Tool, values: Values, currency: string, lang: Lang): Outcome {
  const t = copy[lang] || copy.en;
  const numLocale = lang === "ar" ? "ar-EG" : lang === "ur" ? "ur-PK" : "en-US";
  const fmtMoney = (amount: number) =>
    new Intl.NumberFormat(numLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2
    }).format(Number.isFinite(amount) ? amount : 0);

  const fmt = (amount: number, digits = 1) =>
    new Intl.NumberFormat(numLocale, {
      maximumFractionDigits: digits
    }).format(Number.isFinite(amount) ? amount : 0);

  const out = (
    headline: string,
    value: string,
    details: Detail[] = [],
    note?: string,
    tone?: Outcome["tone"],
    unit?: string
  ): Outcome => ({ headline, value, unit, details, note, tone });

  switch (tool.slug) {
    case "zakat-calculator":
    case "business-zakat-calculator":
    case "cash-savings-zakat-calculator":
    case "crypto-zakat-calculator": {
      const assets =
        tool.slug === "zakat-calculator"
          ? num(values, "cash") + num(values, "gold") + num(values, "investments") + num(values, "business") + num(values, "receivables")
          : tool.slug === "business-zakat-calculator"
          ? num(values, "cash") + num(values, "inventory") + num(values, "receivables")
          : tool.slug === "cash-savings-zakat-calculator"
          ? num(values, "cash") + num(values, "bank") + num(values, "receivables")
          : num(values, "crypto") + num(values, "fiat");
      const net = Math.max(0, assets - num(values, "debts"));
      const threshold = num(values, "nisab");
      const due = net >= threshold && net > 0 ? net * 0.025 : 0;
      return out(
        due ? t.due : t.notDue,
        fmtMoney(due),
        [
          { label: t.net, value: fmtMoney(net) },
          { label: t.threshold, value: fmtMoney(threshold) },
          { label: t.result, value: fmtMoney(due) }
        ],
        due ? t.eligible : t.below,
        due ? "good" : "caution"
      );
    }
    case "zakat-on-gold":
    case "zakat-on-silver": {
      const weight = num(values, "weight");
      const value = weight * num(values, "price");
      const threshold = num(values, "nisab");
      const eligible = weight >= threshold && weight > 0;
      const due = eligible ? value * 0.025 : 0;
      return out(
        t.due,
        fmtMoney(due),
        [
          { label: t.goldValue, value: fmtMoney(value) },
          { label: t.threshold, value: `${fmt(threshold, 2)} ${t.gramUnit}` },
          { label: t.result, value: fmtMoney(due) }
        ],
        eligible ? t.eligible : t.below,
        eligible ? "good" : "caution"
      );
    }
    case "fidyah-calculator":
    case "kaffarah-calculator": {
      const days = num(values, tool.slug === "fidyah-calculator" ? "days" : "fasts");
      const total = days * num(values, "cost");
      return out(
        t.total,
        fmtMoney(total),
        [
          { label: tool.slug === "fidyah-calculator" ? t.dayCount : t.fasts, value: `${fmt(days, 0)} ${t.daysUnit}` },
          { label: t.result, value: fmtMoney(total) }
        ],
        tool.slug === "kaffarah-calculator" ? t.kaffarahNote : t.feedNote
      );
    }
    case "missed-salah-calculator": {
      const count = (num(values, "years") * 365 + num(values, "months") * 30 + num(values, "days")) * 5;
      const rate = Math.max(1, num(values, "catchup"));
      return out(
        t.missed,
        fmt(count, 0),
        [
          { label: t.plan, value: `${fmt(rate, 0)} ${t.prayersPerDay}` },
          { label: t.days, value: `${fmt(Math.ceil(count / rate), 0)} ${t.daysUnit}` }
        ],
        t.missedSalahNote,
        undefined,
        t.prayersUnit
      );
    }
    case "quran-reading-goal": {
      const pages = num(values, "completions") * num(values, "pages");
      const daily = pages / Math.max(1, num(values, "days"));
      return out(
        t.pageTarget,
        fmt(daily, 1),
        [
          { label: t.quranTotal, value: `${fmt(pages, 0)} ${t.pagesUnit}` },
          { label: t.days, value: `${fmt(num(values, "days"), 0)} ${t.daysUnit}` }
        ],
        undefined,
        undefined,
        t.pagesUnit
      );
    }
    case "quran-completion-calculator": {
      const remaining = Math.max(0, num(values, "pages") - num(values, "current") + 1);
      const days = Math.ceil(remaining / Math.max(0.1, num(values, "pace")));
      const date = new Date();
      date.setDate(date.getDate() + days);
      return out(
        t.finish,
        new Intl.DateTimeFormat(numLocale, { dateStyle: "medium" }).format(date),
        [
          { label: t.left, value: `${fmt(remaining, 0)} ${t.pagesUnit}` },
          { label: t.pace, value: `${fmt(num(values, "pace"), 1)} ${t.pagesPerDay}` },
          { label: t.days, value: `${fmt(days, 0)} ${t.daysUnit}` }
        ]
      );
    }
    case "quran-page-calculator": {
      const remaining = Math.max(0, num(values, "pages") - num(values, "current") + 1);
      const daily = remaining / Math.max(1, num(values, "days"));
      return out(
        t.pageTarget,
        fmt(daily, 1),
        [
          { label: t.left, value: `${fmt(remaining, 0)} ${t.pagesUnit}` },
          { label: t.days, value: `${fmt(num(values, "days"), 0)} ${t.daysUnit}` }
        ],
        undefined,
        undefined,
        t.pagesUnit
      );
    }
    case "tahajjud-time-calculator": {
      const start = clockValue(String(values.maghrib));
      let end = clockValue(String(values.fajr));
      if (end <= start) end += 1440;
      const duration = end - start;
      const thirdStart = end - duration / 3;
      return out(
        t.lastThird,
        `${clockText(thirdStart, lang)} – ${clockText(end, lang)}`,
        [
          { label: t.night, value: `${fmt(duration / 60, 1)} ${t.hoursUnit}` },
          { label: t.lastThird, value: `${clockText(thirdStart, lang)} – ${clockText(end, lang)}` }
        ],
        t.tahajjudNote
      );
    }
    case "ishraq-duha-time-calculator": {
      let sunrise = clockValue(String(values.sunrise));
      let dhuhr = clockValue(String(values.dhuhr));
      if (dhuhr <= sunrise) dhuhr += 1440;
      return out(
        t.window,
        `${clockText(sunrise + num(values, "offset"), lang)} – ${clockText(dhuhr - num(values, "buffer"), lang)}`,
        [
          { label: t.ishraqEstimate, value: clockText(sunrise + num(values, "offset"), lang) },
          { label: t.duhaEstimate, value: clockText(dhuhr - num(values, "buffer"), lang) }
        ],
        t.ishraqDuhaNote
      );
    }
    case "investment-zakat-calculator": {
      const gross = (num(values, "portfolio") * num(values, "percentage")) / 100;
      const net = Math.max(0, gross - num(values, "debts"));
      const due = net >= num(values, "nisab") && net > 0 ? net * 0.025 : 0;
      return out(
        t.due,
        fmtMoney(due),
        [
          { label: t.share, value: `${fmt(num(values, "percentage"), 0)}% · ${fmtMoney(gross)}` },
          { label: t.net, value: fmtMoney(net) },
          { label: t.threshold, value: fmtMoney(num(values, "nisab")) }
        ]
      );
    }
    case "property-zakat-calculator": {
      const resale = values.purpose === "resale" ? num(values, "property") : 0;
      const included = resale + num(values, "cash");
      const net = Math.max(0, included - num(values, "debts"));
      const due = net >= num(values, "nisab") && net > 0 ? net * 0.025 : 0;
      return out(
        t.due,
        fmtMoney(due),
        [
          { label: t.propertyBase, value: fmtMoney(resale) },
          { label: t.net, value: fmtMoney(net) },
          { label: t.threshold, value: fmtMoney(num(values, "nisab")) }
        ],
        values.purpose === "use" ? t.excluded : undefined
      );
    }
    case "agricultural-zakat-calculator": {
      const weight = num(values, "weight");
      const reached = weight >= num(values, "nisabKg");
      const rate = values.irrigation === "natural" ? 0.1 : 0.05;
      const due = reached ? weight * rate : 0;
      return out(
        t.dueShare,
        fmt(due, 1),
        [
          { label: t.type, value: values.irrigation === "natural" ? t.naturalIrrigation : t.paidIrrigation },
          { label: t.harvestLabel, value: `${fmt(weight, 1)} ${t.kgUnit}` },
          { label: t.threshold, value: `${fmt(num(values, "nisabKg"), 0)} ${t.kgUnit}` }
        ],
        reached ? t.nisabReached : t.below,
        reached ? "good" : "caution",
        t.kgUnit
      );
    }
    case "livestock-zakat-calculator": {
      const n = Math.floor(num(values, "count"));
      let due = t.noAnimalDue;
      let note = "";
      let dueUnit: string | undefined = undefined;

      if (values.animal === "sheep") {
        const sheep = n < 40 ? 0 : n <= 120 ? 1 : n <= 200 ? 2 : n <= 399 ? 3 : Math.floor(n / 100);
        if (sheep > 0) {
          due = fmt(sheep, 0);
          dueUnit = t.sheepOrGoatsDue;
          note = t.first;
        } else {
          due = t.noAnimalDue;
          note = t.none;
        }
      } else if (n >= 30) {
        let best: { thirty: number; forty: number; remainder: number } | null = null;
        for (let forties = 0; forties <= Math.floor(n / 40); forties++) {
          const remainder = n - forties * 40;
          if (remainder % 30 === 0) {
            best = { thirty: remainder / 30, forty: forties, remainder: 0 };
            break;
          }
        }
        if (best) {
          const thirtyPart = best.thirty
            ? `${fmt(best.thirty, 0)} ${best.thirty > 1 ? t.yearlings : t.yearling}`
            : "";
          const fortyPart = best.forty
            ? `${fmt(best.forty, 0)} ${best.forty > 1 ? t.twoYearOlds : t.twoYearOld}`
            : "";
          due = `${thirtyPart}${thirtyPart && fortyPart ? " + " : ""}${fortyPart}`;
          note = t.first;
        } else {
          due = t.cattleThresholdReached;
          note = t.cattleNote;
        }
      } else {
        note = t.none;
      }
      return out(
        t.first,
        due,
        [
          { label: t.count, value: `${fmt(n, 0)} ${t.animalsUnit}` },
          { label: t.type, value: values.animal === "sheep" ? t.sheepOption : t.cattleOption }
        ],
        note,
        n >= (values.animal === "sheep" ? 40 : 30) ? "good" : "caution",
        dueUnit
      );
    }
    case "mahr-calculator": {
      const outstanding = Math.max(0, num(values, "agreed") - num(values, "paid"));
      const remainingDeferred = Math.min(outstanding, num(values, "deferred"));
      return out(
        t.outstanding,
        fmtMoney(outstanding),
        [
          { label: t.outstandingDeferred, value: fmtMoney(remainingDeferred) },
          { label: t.agreedLabel, value: fmtMoney(num(values, "agreed")) },
          { label: t.paidLabel, value: fmtMoney(num(values, "paid")) }
        ],
        t.mahrNote
      );
    }
    case "islamic-inheritance-calculator": {
      const estate = Math.max(0, num(values, "estate"));
      const sons = Math.floor(num(values, "sons"));
      const daughters = Math.floor(num(values, "daughters"));
      const children = sons + daughters > 0;
      const spouse = String(values.spouse);
      const fatherPresent = values.father === "yes";
      const shares: { label: string; amount: number }[] = [];
      let fixed = 0;
      const addFixed = (label: string, fraction: number) => {
        const amount = estate * fraction;
        fixed += amount;
        shares.push({ label, amount });
      };
      if (spouse !== "none") {
        addFixed(t.spouseShare, children ? (spouse === "husband" ? 1 / 4 : 1 / 8) : spouse === "husband" ? 1 / 2 : 1 / 4);
      }
      if (values.mother === "yes") {
        const spouseAmount = shares.find((share) => share.label === t.spouseShare)?.amount ?? 0;
        const motherBase = !children && fatherPresent && spouse !== "none" ? estate - spouseAmount : estate;
        const amount = motherBase * (children ? 1 / 6 : 1 / 3);
        fixed += amount;
        shares.push({ label: t.motherShare, amount });
      }
      if (children && sons === 0 && daughters > 0) {
        addFixed(t.childrenShare, daughters === 1 ? 1 / 2 : 2 / 3);
      }
      if (fatherPresent && children) {
        addFixed(t.fatherShare, 1 / 6);
      }
      if (fixed > estate && fixed > 0) {
        const awlScale = estate / fixed;
        shares.forEach((share) => {
          share.amount *= awlScale;
        });
        fixed = estate;
      }
      const residue = Math.max(0, estate - fixed);
      if (children && sons > 0) {
        const childUnits = sons * 2 + daughters;
        shares.push({ label: t.childrenShare, amount: residue });
        if (sons) shares.push({ label: t.childEach, amount: (residue * 2) / childUnits });
        if (daughters) shares.push({ label: t.daughterEach, amount: residue / childUnits });
      } else if (fatherPresent) {
        shares.push({ label: t.fatherShare, amount: residue });
      } else if (residue > 0) {
        shares.push({ label: t.unallocated, amount: residue });
      }
      const details = shares.map((share) => ({ label: share.label, value: fmtMoney(share.amount) }));
      return out(t.provisional, fmtMoney(estate), details, t.inheritanceNote, "caution");
    }
    case "hajj-cost-calculator":
    case "umrah-cost-calculator": {
      const keys = ["package", "flight", "lodging", "transport", "food", "other"];
      const total = keys.reduce((sum, key) => sum + num(values, key), 0);
      const travelers = Math.max(1, num(values, "travelers"));
      return out(t.totalCosts, fmtMoney(total), [
        { label: t.perPerson, value: fmtMoney(total / travelers) },
        { label: t.travelersLabel, value: `${fmt(travelers, 0)} ${t.travelersUnit}` }
      ]);
    }
    case "ramadan-budget-calculator": {
      const costs = ["food", "household", "travel", "gifts", "charity", "other"].reduce(
        (sum, key) => sum + num(values, key),
        0
      );
      const remaining = num(values, "income") - costs;
      return out(
        t.remaining,
        fmtMoney(remaining),
        [
          { label: t.spend, value: fmtMoney(costs) },
          { label: t.income, value: fmtMoney(num(values, "income")) }
        ],
        remaining < 0 ? t.budgetExcessNote : undefined,
        remaining < 0 ? "caution" : "good"
      );
    }
    case "ramadan-charity-calculator": {
      const total = num(values, "daily") * num(values, "days") + num(values, "once");
      return out(t.totalGift, fmtMoney(total), [
        { label: t.dailyGiftsLabel, value: fmtMoney(num(values, "daily") * num(values, "days")) },
        { label: t.oneOffGiftLabel, value: fmtMoney(num(values, "once")) },
        { label: t.days, value: `${fmt(num(values, "days"), 0)} ${t.daysUnit}` }
      ]);
    }
    case "islamic-charity-calculator": {
      const keys = ["local", "emergency", "education", "health", "other"] as const;
      const pct = keys.reduce((sum, key) => sum + num(values, key), 0);
      const details = keys.map((key) => ({
        label: charityLabels[key]?.[lang] ?? key,
        value: `${fmt(num(values, key), 0)}% · ${fmtMoney((num(values, "donation") * num(values, key)) / 100)}`
      }));
      return out(t.allocation, `${fmt(pct, 0)}%`, details, pct === 100 ? t.balanced : t.unbalanced, pct === 100 ? "good" : "caution");
    }
    default:
      return out(t.estimate, t.enter);
  }
}

function caveatText(tool: Tool, lang: Lang) {
  if (lang === "en") {
    return (
      tool.caveat ??
      "This is a practical estimate, not a religious ruling. Confirm details relevant to your circumstances with trusted local guidance."
    );
  }
  return (
    toolCaveats[tool.slug]?.[lang] ??
    (lang === "ar"
      ? "هذا تقدير عملي، وليس فتوى شرعية. تحقق من التفاصيل المتعلقة بظروفك الخاصة مع أهل العلم الموثوقين."
      : "یہ ایک عملی اندازہ ہے، شرعی فتوی نہیں۔ اپنے مخصوص حالات سے متعلق تفصیلات کی تصدیق کے لیے اہلِ علم سے رجوع کریں۔")
  );
}

function initialValues(tool: Tool): Values {
  return Object.fromEntries(
    tool.fields.map((field) => [
      field.name,
      field.default ?? (field.type === "select" ? field.options?.[0]?.value ?? "" : "")
    ])
  );
}

export default function Calculator({ tool }: { tool: Tool }) {
  const [values, setValues] = useState<Values>(() => initialValues(tool));
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("amanah-language");
    return saved === "ar" || saved === "ur" ? saved : "en";
  });
  const [currency, setCurrency] = useState("USD");
  const [errors, setErrors] = useState<string[]>([]);
  const [copiedResult, setCopiedResult] = useState(false);

  useEffect(() => {
    const listener = (event: Event) => setLang((event as CustomEvent<Lang>).detail);
    window.addEventListener("amanah-language", listener);
    return () => window.removeEventListener("amanah-language", listener);
  }, []);

  const t = copy[lang] || copy.en;
  const dir = lang === "en" ? "ltr" : "rtl";
  const currencyFields = tool.fields.some((field) => field.unit === "currency");
  const result = useMemo(() => compute(tool, values, currency, lang), [tool, values, currency, lang]);

  const setField = (field: Field, value: string) => {
    setValues((old) => ({
      ...old,
      [field.name]: field.type === "select" || field.type === "time" || field.type === "date" ? value : value
    }));
    setErrors([]);
  };

  const resetDefaults = () => {
    setValues(initialValues(tool));
    setErrors([]);
  };

  const handleCopyResult = () => {
    if (typeof window !== "undefined") {
      const detailsText = result.details.map((d) => `${d.label}: ${d.value}`).join("\n");
      const textToCopy = `${result.headline}: ${result.value} ${result.unit ?? ""}\n${detailsText}`;
      navigator.clipboard.writeText(textToCopy);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    }
  };

  const validate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const issues: string[] = [];
    for (const field of tool.fields) {
      if (field.name === "property" && values.purpose !== "resale") continue;
      if (field.type === "select" || field.type === "time" || field.type === "date") continue;
      const value = Number(values[field.name]);
      const label = fieldLabel(field, lang, tool.slug);
      if (!Number.isFinite(value)) {
        issues.push(`${label}: ${t.validNumber}`);
      } else if (field.min !== undefined && value < field.min) {
        issues.push(`${label}: ${t.minimum} ${field.min}.`);
      } else if (field.max !== undefined && value > field.max) {
        issues.push(`${label}: ${t.maximum} ${field.max}.`);
      }
    }
    if (tool.slug === "islamic-charity-calculator") {
      const total = ["local", "emergency", "education", "health", "other"].reduce(
        (sum, key) => sum + num(values, key),
        0
      );
      if (Math.abs(total - 100) > 0.001) issues.push(t.unbalanced);
    }
    setErrors(issues);
  };

  const displayTitle = titles[tool.slug]?.[lang] ?? tool.title;
  const displayCategory = categoryLabel(tool.category, lang);

  return (
    <section
      dir={dir}
      className="fade-up grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]"
      aria-label={displayTitle}
    >
      <form
        onSubmit={validate}
        noValidate
        className="relative overflow-hidden rounded-3xl border border-[#AE2448]/20 bg-white p-6 sm:p-8 shadow-[0_16px_36px_rgba(110,26,55,0.06),0_2px_8px_rgba(0,0,0,0.02)]"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6E1A37] via-[#AE2448] to-[#6E1A37]" />

        {/* Header with Secondary Color Pill & Seal */}
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#AE2448]/15 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AE2448]/10 text-[#AE2448] text-xs font-bold mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#AE2448]" />
              {displayCategory}
            </span>
            <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">{displayTitle}</h2>
            <p className="mb-0 mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">{t.calcNote}</p>
          </div>
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#AE2448] font-arabic text-xl font-bold text-white shadow-xs"
            aria-hidden="true"
          >
            أ
          </span>
        </div>

        {/* Currency Selector Bar with Secondary Color Styling */}
        {currencyFields && (
          <div className="mb-6 rounded-2xl border border-[#AE2448]/20 bg-[#AE2448]/5 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#AE2448] text-white text-xs font-bold shadow-2xs">
                $
              </span>
              <label htmlFor="currency" className="text-xs sm:text-sm font-bold text-[var(--ink)]">
                {t.currency}
              </label>
            </div>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-xl border border-[#AE2448]/30 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-[var(--ink)] cursor-pointer focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/25 outline-none shadow-2xs"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="GBP">GBP — Pound Sterling</option>
              <option value="EUR">EUR — Euro</option>
              <option value="PKR">PKR — Pakistani Rupee</option>
              <option value="INR">INR — Indian Rupee</option>
              <option value="SAR">SAR — Saudi Riyal</option>
              <option value="AED">AED — UAE Dirham</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="AUD">AUD — Australian Dollar</option>
            </select>
          </div>
        )}

        {/* Fields Grid */}
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {tool.fields.map((field) => {
            if (field.name === "property" && values.purpose !== "resale") return null;
            const id = `${tool.slug}-${field.name}`;
            const unitLabel = formatUnit(field.unit, lang, currency);
            return (
              <div className={field.type === "range" ? "sm:col-span-2" : ""} key={field.name}>
                <label
                  htmlFor={id}
                  className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-bold text-[var(--ink)]"
                >
                  <span>{fieldLabel(field, lang, tool.slug)}</span>
                  {unitLabel && (
                    <span className="rounded-md bg-[#AE2448]/15 px-2 py-0.5 text-[11px] font-bold text-[#6E1A37]">
                      {unitLabel}
                    </span>
                  )}
                </label>
                {field.type === "select" ? (
                  <select
                    id={id}
                    value={String(values[field.name])}
                    onChange={(e) => setField(field, e.target.value)}
                    className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-3 text-sm sm:text-base font-semibold text-[var(--ink)] transition hover:border-[#AE2448]/60 focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/20 cursor-pointer outline-none shadow-2xs"
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {optionLabel(field, option, lang)}
                      </option>
                    ))}
                  </select>
                ) : field.type === "range" ? (
                  <div className="flex items-center gap-3">
                    <input
                      id={id}
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={Number(values[field.name])}
                      onChange={(e) => setField(field, e.target.value)}
                      className="h-2 w-full cursor-pointer accent-[#AE2448]"
                    />
                    <output
                      htmlFor={id}
                      className="min-w-16 rounded-xl bg-[#AE2448] text-white px-3 py-1.5 text-center text-xs sm:text-sm font-bold shadow-xs"
                    >
                      {values[field.name]}
                      {unitLabel}
                    </output>
                  </div>
                ) : (
                  <input
                    id={id}
                    type={field.type === "time" ? "time" : field.type === "date" ? "date" : "number"}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={String(values[field.name] ?? "")}
                    onChange={(e) => setField(field, e.target.value)}
                    className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-3 text-sm sm:text-base font-semibold text-[var(--ink)] transition placeholder:text-[var(--muted)]/40 hover:border-[#AE2448]/60 focus:border-[#AE2448] focus:ring-2 focus:ring-[#AE2448]/20 outline-none shadow-2xs"
                    inputMode={field.type === "time" || field.type === "date" ? undefined : "decimal"}
                    aria-describedby={`${id}-unit`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-8 pt-5 border-t border-[#AE2448]/20 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="min-h-12 flex-1 sm:flex-none rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99] cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
          >
            <span>{lang === "ar" ? "تحديث التقدير" : lang === "ur" ? "اندازہ تازہ کریں" : "Update estimate"}</span>
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            className="min-h-12 rounded-xl border border-[#AE2448] bg-white px-4 py-3 text-sm font-bold text-[#6E1A37] hover:bg-[#AE2448] hover:!text-white transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{lang === "ar" ? "إعادة الضبط" : lang === "ur" ? "دوبارہ ترتیب دیں" : "Reset inputs"}</span>
          </button>
        </div>
        <p className="mb-0 mt-3 text-[11px] leading-5 text-[var(--muted)]">
          {lang === "ar"
            ? "تبقى مدخلاتك في هذا المتصفح."
            : lang === "ur"
            ? "آپ کی معلومات اسی براؤزر میں رہتی ہیں۔"
            : "Your entries remain in this browser and are not submitted."}
        </p>
      </form>

      {/* Result Display Panel */}
      <aside
        aria-live="polite"
        aria-atomic="true"
        dir={dir}
        className="relative overflow-hidden rounded-3xl border-2 border-[#AE2448]/30 bg-[var(--result)] p-6 sm:p-7 lg:sticky lg:top-24 shadow-[0_16px_36px_rgba(110,26,55,0.08)]"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#AE2448]" />

        {/* Live Estimate Header */}
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#AE2448]/20 pb-4">
          <div>
            <p className="eyebrow mb-1 text-[var(--primary)]">{t.estimate}</p>
            <p className="m-0 text-xs font-semibold text-[#6E1A37]">{t.readResult}</p>
          </div>
          <span className="rounded-full bg-[#AE2448] text-white px-3.5 py-1 text-xs font-bold shadow-xs flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            {displayCategory}
          </span>
        </div>

        {/* Standout Result Hero Card */}
        <div className="rounded-2xl border border-[#AE2448]/20 bg-white/90 p-5 shadow-2xs mb-5">
          <p className="m-0 mb-1.5 text-xs font-bold uppercase tracking-wider text-[#6E1A37]">{result.headline}</p>
          <div className="flex flex-wrap items-baseline gap-2 leading-tight tracking-tight text-[var(--primary)]" dir={dir}>
            <span className="text-3xl sm:text-4xl font-extrabold tabular-nums break-words">
              <bdi>{result.value}</bdi>
            </span>
            {result.unit && (
              <span className="text-xl sm:text-2xl font-bold text-[#6E1A37]">
                <bdi>{result.unit}</bdi>
              </span>
            )}
          </div>
        </div>

        {/* Detailed Breakdown List */}
        {result.details.length > 0 && (
          <dl className="mb-0 divide-y divide-[#AE2448]/15 border-y border-[#AE2448]/15">
            {result.details.map((detail, index) => (
              <div
                key={`${detail.label}-${index}`}
                className="flex items-start justify-between gap-4 py-3 text-xs sm:text-sm"
              >
                <dt className="text-[var(--ink)] font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#AE2448] shrink-0" />
                  <span>{detail.label}</span>
                </dt>
                <dd className="m-0 text-end font-bold text-[var(--ink)] tabular-nums" dir={dir}>
                  <bdi>{detail.value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Result Note (Notice with highlights background & secondary left border) */}
        {result.note && (
          <div className="mt-5 rounded-xl border border-[#AE2448]/30 border-s-4 border-s-[#AE2448] bg-[#FFF6DE] p-3.5 text-xs font-medium leading-5 text-[var(--ink)]">
            {result.note}
          </div>
        )}

        {/* Error Callout */}
        {errors.length > 0 && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-[var(--primary)] bg-[var(--highlight)]/20 p-4 text-xs leading-5 text-[var(--primary)] font-medium"
          >
            <p className="mb-1 font-bold">{t.reviewInputs}</p>
            <ul className="m-0 list-disc ps-4">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Copy Estimate Button */}
        <button
          type="button"
          onClick={handleCopyResult}
          className="mt-5 w-full rounded-xl bg-[#AE2448] hover:bg-[#8C2448] text-white py-2.5 px-4 text-xs font-bold transition shadow-xs cursor-pointer border-0 flex items-center justify-center gap-2"
        >
          {copiedResult && <Check className="h-4 w-4" />}
          <span>{copiedResult ? (lang === "ar" ? "تم نسخ التقدير!" : lang === "ur" ? "اندازہ کاپی ہوگیا!" : "Estimate copied!") : (lang === "ar" ? "نسخ تفاصيل التقدير" : lang === "ur" ? "تفصیلات کاپی کریں" : "Copy estimate details")}</span>
        </button>

        {/* Disclaimer / Caveat */}
        <div className="mt-5 flex items-start gap-2 border-t border-[#AE2448]/20 pt-4 text-[10px] leading-4 text-[var(--ink)]">
          <span
            className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#AE2448] font-serif text-[9px] text-white font-bold"
            aria-hidden="true"
          >
            i
          </span>
          <p className="m-0 font-medium">{caveatText(tool, lang)}</p>
        </div>
      </aside>
    </section>
  );
}

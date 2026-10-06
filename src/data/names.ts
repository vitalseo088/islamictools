export type Gender = "boy" | "girl" | "unisex";
export type Style = "traditional" | "modern" | "rare" | "classic";
export type Origin = "Arabic" | "Quranic" | "Persian" | "Turkish" | "Urdu";

export type MuslimName = {
  id: string;
  name: string;
  arabic: string;
  meaning: string;
  gender: Gender;
  origin: Origin;
  quranic: boolean;
  quranicRef?: string;
  themes: string[];
  style: Style;
  pronunciation: string;
  twinPair?: {
    boy?: string;
    girl?: string;
  };
  notes?: string;
};

export const muslimNames: MuslimName[] = [
  // Boys
  {
    id: "muhammad",
    name: "Muhammad",
    arabic: "مُحَمَّد",
    meaning: "Praiseworthy, praised continuously. The name of the final Messenger of Allah (peace be upon him).",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Mentioned 4 times directly in the Quran (Surah Aal-Imran, Al-Ahzab, Muhammad, Al-Fath).",
    themes: ["Prophetic", "Virtue", "Praise"],
    style: "traditional",
    pronunciation: "moo-HAM-mad",
    twinPair: { boy: "Ahmad", girl: "Fatima" }
  },
  {
    id: "ahmad",
    name: "Ahmad",
    arabic: "أَحْمَد",
    meaning: "One who praises God constantly; highly praised and commendable.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Mentioned in Surah As-Saff (61:6) as the prophesied name of Prophet Muhammad by Prophet Isa.",
    themes: ["Prophetic", "Virtue", "Praise"],
    style: "traditional",
    pronunciation: "AH-mad",
    twinPair: { boy: "Muhammad", girl: "Amina" }
  },
  {
    id: "ali",
    name: "Ali",
    arabic: "عَلِيّ",
    meaning: "Exalted, noble, sublime, of high rank and status.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Derived from Al-Ali (The Most High), one of the 99 Names of Allah, and the name of the fourth Caliph.",
    themes: ["Sahaba", "Nobility", "Strength"],
    style: "traditional",
    pronunciation: "ah-LEE",
    twinPair: { boy: "Hasan", girl: "Aliya" }
  },
  {
    id: "ibrahim",
    name: "Ibrahim",
    arabic: "إِبْرَاهِيم",
    meaning: "Father of multitudes. The great Prophet and intimate friend of Allah (Khalilullah).",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Named in 69 verses and Surah 14 is titled Surah Ibrahim.",
    themes: ["Prophetic", "Devotion", "Faith"],
    style: "traditional",
    pronunciation: "ib-rah-HEEM",
    twinPair: { boy: "Ismail", girl: "Sarah" }
  },
  {
    id: "ismail",
    name: "Ismail",
    arabic: "إِسْمَاعِيل",
    meaning: "God will hear; one who heeds and obeys Allah faithfully.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Prophet Ismail, son of Ibrahim, builder of the Ka'bah, mentioned in Surah Maryam 19:54.",
    themes: ["Prophetic", "Devotion", "Patience"],
    style: "traditional",
    pronunciation: "is-mah-EEL",
    twinPair: { boy: "Ishaq", girl: "Hajar" }
  },
  {
    id: "yusuf",
    name: "Yusuf",
    arabic: "يُوسُف",
    meaning: "God increases in dignity, beauty, and piety.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Surah 12 (Surah Yusuf) tells the story of Prophet Yusuf, described as 'the best of stories'.",
    themes: ["Prophetic", "Beauty", "Patience"],
    style: "traditional",
    pronunciation: "YOO-soof",
    twinPair: { boy: "Yunus", girl: "Zulaykha" }
  },
  {
    id: "rayyan",
    name: "Rayyan",
    arabic: "رَيَّان",
    meaning: "Lush, fragrant, plentiful; the blessed gate in Paradise reserved for those who fasted.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Featured in the authentic Sahih hadith as Ar-Rayyan, the gate of Jannah for fasting believers.",
    themes: ["Nature", "Blessings", "Virtue"],
    style: "modern",
    pronunciation: "ray-YAHN",
    twinPair: { boy: "Rakan", girl: "Razan" }
  },
  {
    id: "zayd",
    name: "Zayd",
    arabic: "زَيْد",
    meaning: "Abundance, increase, growth in knowledge and virtue.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "The only companion of Prophet Muhammad explicitly named in the Quran (Surah Al-Ahzab 33:37).",
    themes: ["Sahaba", "Growth", "Virtue"],
    style: "classic",
    pronunciation: "ZAYD",
    twinPair: { boy: "Zubayr", girl: "Zahra" }
  },
  {
    id: "hamza",
    name: "Hamza",
    arabic: "حَمْزَة",
    meaning: "Lion; strong, steadfast, brave. The beloved uncle of the Prophet known as the 'Lion of Allah'.",
    gender: "boy",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Strength", "Bravery"],
    style: "traditional",
    pronunciation: "HAM-zah",
    twinPair: { boy: "Haris", girl: "Hafsa" }
  },
  {
    id: "omar",
    name: "Umar",
    arabic: "عُمَر",
    meaning: "Flourishing, long-lived, thriving with life and justice.",
    gender: "boy",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Virtue", "Nobility"],
    style: "traditional",
    pronunciation: "OO-mar",
    twinPair: { boy: "Uthman", girl: "Umayma" }
  },
  {
    id: "bilal",
    name: "Bilal",
    arabic: "بِلَال",
    meaning: "Water, refreshing moisture; moisture that brings fertile life. The first Mu'adhin in Islam.",
    gender: "boy",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Devotion", "Faith"],
    style: "traditional",
    pronunciation: "bi-LAHL",
    twinPair: { boy: "Barir", girl: "Basma" }
  },
  {
    id: "tariq",
    name: "Tariq",
    arabic: "طَارِق",
    meaning: "The morning star; night visitor that brings guidance and radiant light.",
    gender: "boy",
    origin: "Quranic",
    quranic: true,
    quranicRef: "Surah At-Tariq (86:1) opens: 'By the sky and the night visitor (At-Tariq)'.",
    themes: ["Light", "Nature", "Virtue"],
    style: "classic",
    pronunciation: "TAH-rik",
    twinPair: { boy: "Talha", girl: "Tasneem" }
  },
  {
    id: "zayn",
    name: "Zayn",
    arabic: "زَيْن",
    meaning: "Grace, beauty, adornment, excellence of character.",
    gender: "boy",
    origin: "Arabic",
    quranic: false,
    themes: ["Beauty", "Grace", "Virtue"],
    style: "modern",
    pronunciation: "ZAYN",
    twinPair: { boy: "Zayd", girl: "Zayna" }
  },
  {
    id: "khalid",
    name: "Khalid",
    arabic: "خَالِد",
    meaning: "Eternal, enduring, steadfast. Commemorating Khalid ibn al-Walid, the 'Sword of Allah'.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Derived from the Quranic root kh-l-d describing the eternal bliss of Paradise.",
    themes: ["Sahaba", "Strength", "Endurance"],
    style: "traditional",
    pronunciation: "KHAH-lid",
    twinPair: { boy: "Khadir", girl: "Khawla" }
  },
  {
    id: "kinan",
    name: "Kinan",
    arabic: "كِنَان",
    meaning: "Cover, shelter, safe protection and safeguard.",
    gender: "boy",
    origin: "Quranic",
    quranic: true,
    quranicRef: "Root mentioned in Surah An-Nahl (16:81) referring to places of refuge and peace.",
    themes: ["Virtue", "Nature", "Peace"],
    style: "rare",
    pronunciation: "kee-NAHN",
    twinPair: { boy: "Karam", girl: "Kanza" }
  },
  {
    id: "nuaym",
    name: "Nu'aym",
    arabic: "نُعَيْم",
    meaning: "Ease, serene contentment, gentle blessings and softness.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Diminutive of Na'im (Bliss/delight), mentioned extensively in the Quran as Jannat an-Na'im.",
    themes: ["Blessings", "Virtue", "Peace"],
    style: "rare",
    pronunciation: "noo-AYM",
    twinPair: { boy: "Nadeem", girl: "Nima" }
  },
  {
    id: "idris",
    name: "Idris",
    arabic: "إِدْرِيس",
    meaning: "Studious, learned, devoted reader and teacher of wisdom.",
    gender: "boy",
    origin: "Arabic",
    quranic: true,
    quranicRef: "Mentioned in Surah Maryam (19:56) as a man of truth and a prophet whom Allah raised to a high station.",
    themes: ["Prophetic", "Wisdom", "Faith"],
    style: "classic",
    pronunciation: "id-REES",
    twinPair: { boy: "Ilyas", girl: "Isra" }
  },
  {
    id: "firas",
    name: "Firas",
    arabic: "فِرَاس",
    meaning: "Sharp discernment, astute wisdom, keen insight and perception.",
    gender: "boy",
    origin: "Arabic",
    quranic: false,
    themes: ["Wisdom", "Strength", "Nobility"],
    style: "classic",
    pronunciation: "fee-RAHS",
    twinPair: { boy: "Faris", girl: "Farah" }
  },
  {
    id: "kian",
    name: "Kian",
    arabic: "كَيَان",
    meaning: "Being, essence, fundamental existence, nature and character.",
    gender: "boy",
    origin: "Arabic",
    quranic: false,
    themes: ["Virtue", "Modern", "Wisdom"],
    style: "modern",
    pronunciation: "kee-AHN",
    twinPair: { boy: "Kamran", girl: "Kimiya" }
  },
  {
    id: "zafir",
    name: "Zafir",
    arabic: "ظَافِر",
    meaning: "Victorious, triumphant, one who overcomes challenges with integrity.",
    gender: "boy",
    origin: "Arabic",
    quranic: false,
    themes: ["Strength", "Virtue", "Praise"],
    style: "rare",
    pronunciation: "ZAH-feer",
    twinPair: { boy: "Zahir", girl: "Zafira" }
  },

  // Girls
  {
    id: "maryam",
    name: "Maryam",
    arabic: "مَرْيَم",
    meaning: "Pious worshipper, devout, beloved of God. The mother of Prophet Isa (Jesus).",
    gender: "girl",
    origin: "Quranic",
    quranic: true,
    quranicRef: "The only woman mentioned by name in the Quran; Surah 19 is named after her.",
    themes: ["Prophetic", "Devotion", "Virtue"],
    style: "traditional",
    pronunciation: "MAR-yam",
    twinPair: { boy: "Isa", girl: "Asiya" }
  },
  {
    id: "fatima",
    name: "Fatima",
    arabic: "فَاطِمَة",
    meaning: "One who abstains; nurturing and protective. The beloved daughter of Prophet Muhammad.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Nobility", "Virtue"],
    style: "traditional",
    pronunciation: "FAH-tee-mah",
    twinPair: { boy: "Hasan", girl: "Zahra" }
  },
  {
    id: "aisha",
    name: "Aisha",
    arabic: "عَائِشَة",
    meaning: "Living, prosperous, thriving; full of life and profound scholarly wisdom.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Wisdom", "Nobility"],
    style: "traditional",
    pronunciation: "ah-EE-shah",
    twinPair: { boy: "Abdullah", girl: "Asma" }
  },
  {
    id: "khadijah",
    name: "Khadijah",
    arabic: "خَدِيجَة",
    meaning: "Trustworthy, noble, pioneering; the first believer and devoted wife of the Prophet.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Faith", "Nobility"],
    style: "traditional",
    pronunciation: "kha-DEE-jah",
    twinPair: { boy: "Qasim", girl: "Fatima" }
  },
  {
    id: "noor",
    name: "Noor",
    arabic: "نُور",
    meaning: "Radiant light, divine illumination, moral clarity and warmth.",
    gender: "unisex",
    origin: "Quranic",
    quranic: true,
    quranicRef: "Named in Surah An-Nur (24:35): 'Allah is the Light of the heavens and the earth.'",
    themes: ["Light", "Virtue", "Nature"],
    style: "modern",
    pronunciation: "NOOR",
    twinPair: { boy: "Nadir", girl: "Narmin" }
  },
  {
    id: "zahra",
    name: "Zahra",
    arabic: "زَهْرَاء",
    meaning: "Radiant, luminous, blooming blossom, shining with purity.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Beauty", "Light", "Virtue"],
    style: "classic",
    pronunciation: "ZAH-rah",
    twinPair: { boy: "Zayd", girl: "Zaynab" }
  },
  {
    id: "tasneem",
    name: "Tasneem",
    arabic: "تَسْنِيم",
    meaning: "A celestial spring in Paradise whose fountain water is of pure fragrance.",
    gender: "girl",
    origin: "Quranic",
    quranic: true,
    quranicRef: "Mentioned in Surah Al-Mutaffifin (83:27): 'And its mixture is of Tasneem.'",
    themes: ["Blessings", "Nature", "Virtue"],
    style: "classic",
    pronunciation: "tas-NEEM",
    twinPair: { boy: "Tariq", girl: "Kawthar" }
  },
  {
    id: "inaya",
    name: "Inaya",
    arabic: "عِنَايَة",
    meaning: "Care, protection, loving solicitude, providence of God.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Virtue", "Grace", "Peace"],
    style: "modern",
    pronunciation: "ee-NAH-yah",
    twinPair: { boy: "Ilyas", girl: "Aya" }
  },
  {
    id: "sidra",
    name: "Sidra",
    arabic: "سِدْرَة",
    meaning: "The lote-tree of the utmost heavenly boundary (Sidrat al-Muntaha).",
    gender: "girl",
    origin: "Quranic",
    quranic: true,
    quranicRef: "Mentioned in Surah An-Najm (53:14): 'Near the Lote Tree of the Utmost Boundary.'",
    themes: ["Nature", "Blessings", "Light"],
    style: "modern",
    pronunciation: "SID-rah",
    twinPair: { boy: "Sami", girl: "Safa" }
  },
  {
    id: "ruqayyah",
    name: "Ruqayyah",
    arabic: "رُقَيَّة",
    meaning: "Gentle ascent, graceful charm, spiritual rise; daughter of the Prophet.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Grace", "Virtue"],
    style: "traditional",
    pronunciation: "roo-KAY-yah",
    twinPair: { boy: "Uthman", girl: "Umm Kulthum" }
  },
  {
    id: "zaynab",
    name: "Zaynab",
    arabic: "زَيْنَب",
    meaning: "Ornamental fragrant flowering tree; graceful and noble in demeanor.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Nature", "Beauty"],
    style: "traditional",
    pronunciation: "ZAY-nab",
    twinPair: { boy: "Zayd", girl: "Zahra" }
  },
  {
    id: "safiyyah",
    name: "Safiyyah",
    arabic: "صَفِيَّة",
    meaning: "Pure, sincere friend, serene and unblemished in character.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Purity", "Virtue"],
    style: "classic",
    pronunciation: "sah-FEE-yah",
    twinPair: { boy: "Sufyan", girl: "Sumayyah" }
  },
  {
    id: "sumayyah",
    name: "Sumayyah",
    arabic: "سُمَيَّة",
    meaning: "High-ranking, exalted, lofty; the first martyr in Islam, renowned for unshakeable faith.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Faith", "Bravery"],
    style: "classic",
    pronunciation: "soo-MAY-yah",
    twinPair: { boy: "Samir", girl: "Safiyyah" }
  },
  {
    id: "rawdah",
    name: "Rawdah",
    arabic: "رَوْضَة",
    meaning: "Flourishing lush garden; echoing the blessed Garden (Ar-Rawdah) in the Prophet's Mosque.",
    gender: "girl",
    origin: "Quranic",
    quranic: true,
    quranicRef: "Mentioned in Surah Ar-Rum (30:15) describing the lush meadows of Paradise.",
    themes: ["Nature", "Blessings", "Peace"],
    style: "rare",
    pronunciation: "ROW-dah",
    twinPair: { boy: "Rayan", girl: "Randa" }
  },
  {
    id: "juwayriyah",
    name: "Juwayriyah",
    arabic: "جُوَيْرِيَة",
    meaning: "Little damask rose; petal of bloom; mother of the believers noted for extensive remembrance of Allah.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Sahaba", "Nature", "Devotion"],
    style: "rare",
    pronunciation: "joo-way-REE-yah",
    twinPair: { boy: "Jafar", girl: "Jumana" }
  },
  {
    id: "layla",
    name: "Layla",
    arabic: "لَيْلَى",
    meaning: "Nightfall, dark beauty, serene dusk filled with quiet contemplation.",
    gender: "girl",
    origin: "Arabic",
    quranic: false,
    themes: ["Beauty", "Nature", "Peace"],
    style: "classic",
    pronunciation: "LAY-lah",
    twinPair: { boy: "Luqman", girl: "Lina" }
  },
  {
    id: "lina",
    name: "Lina",
    arabic: "لِينَة",
    meaning: "Tender palm tree, softness, gentleness and delicate grace.",
    gender: "girl",
    origin: "Quranic",
    quranic: true,
    quranicRef: "Mentioned in Surah Al-Hashr (59:5) in reference to fine palm trees.",
    themes: ["Nature", "Grace", "Virtue"],
    style: "modern",
    pronunciation: "LEE-nah",
    twinPair: { boy: "Liam", girl: "Layla" }
  },
  {
    id: "aya",
    name: "Aya",
    arabic: "آيَة",
    meaning: "A sign of God's presence, a miracle, verse of the Holy Quran.",
    gender: "girl",
    origin: "Quranic",
    quranic: true,
    quranicRef: "The word 'Aya' appears hundreds of times in the Quran signifying divine signs and verses.",
    themes: ["Faith", "Wisdom", "Blessings"],
    style: "modern",
    pronunciation: "AH-yah",
    twinPair: { boy: "Adan", girl: "Inaya" }
  },
  {
    id: "mehar",
    name: "Mehar",
    arabic: "مِهْر",
    meaning: "Loving kindness, affection, radiant grace and warmth.",
    gender: "girl",
    origin: "Urdu",
    quranic: false,
    themes: ["Grace", "Virtue", "Peace"],
    style: "rare",
    pronunciation: "MEH-har",
    twinPair: { boy: "Mahir", girl: "Mehrunisa" }
  },
  {
    id: "yasmin",
    name: "Yasmin",
    arabic: "يَاسَمِين",
    meaning: "Fragrant white jasmine flower, symbolizing sweet purity and grace.",
    gender: "girl",
    origin: "Persian",
    quranic: false,
    themes: ["Nature", "Beauty", "Grace"],
    style: "classic",
    pronunciation: "YAS-meen",
    twinPair: { boy: "Yusuf", girl: "Yusr" }
  },
  {
    id: "alizeh",
    name: "Alizeh",
    arabic: "عَلِيزَة",
    meaning: "Radiant, joyous breeze, light-hearted happiness and cheerful vigor.",
    gender: "girl",
    origin: "Persian",
    quranic: false,
    themes: ["Nature", "Joy", "Modern"],
    style: "modern",
    pronunciation: "ah-lee-ZAY",
    twinPair: { boy: "Arman", girl: "Anisa" }
  },
  {
    id: "aylin",
    name: "Aylin",
    arabic: "آيلِين",
    meaning: "Halo around the full moon, ethereal light that brightens the night.",
    gender: "girl",
    origin: "Turkish",
    quranic: false,
    themes: ["Light", "Beauty", "Nature"],
    style: "modern",
    pronunciation: "eye-LEEN",
    twinPair: { boy: "Alparslan", girl: "Ayla" }
  }
];

export const allOrigins: Origin[] = ["Arabic", "Quranic", "Persian", "Turkish", "Urdu"];
export const allThemes = [
  "Prophetic",
  "Sahaba",
  "Devotion",
  "Faith",
  "Wisdom",
  "Strength",
  "Bravery",
  "Light",
  "Nature",
  "Beauty",
  "Grace",
  "Blessings",
  "Virtue",
  "Peace"
];

export const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const nameById = Object.fromEntries(muslimNames.map((n) => [n.id, n])) as Record<string, MuslimName>;

export type NameTranslation = {
  meaning: string;
  quranicRef?: string;
};

export const nameTranslations: Record<string, { ar: NameTranslation; ur: NameTranslation }> = {
  muhammad: {
    ar: { meaning: "المحمود حمداً متواصلاً، ذو الخصال الحميدة؛ اسم خاتم الأنبياء والمرسلين ﷺ.", quranicRef: "ذُكر ٤ مرات صراحة في القرآن الكريم (آل عمران، الأحزاب، محمد، الفتح)." },
    ur: { meaning: "جس کی کثرت سے اور بار بار تعریف کی جائے؛ خاتم النبیین حضرت محمد مصطفیٰ ﷺ کا مبارک نام۔", quranicRef: "قرآن پاک میں ۴ مرتبہ صراحتاً ذکر آیا ہے (آل عمران، الاحزاب، محمد، الفتح)۔" }
  },
  ahmad: {
    ar: { meaning: "الأكثر حمداً لله تعالى؛ المحمود عند الله وخلقه.", quranicRef: "ذُكر في سورة الصف (٦١:٦) في بشارة عيسى عليه السلام." },
    ur: { meaning: "اللہ کی سب سے زیادہ حمد و ثنا کرنے والا؛ لائقِ تعریف و توصیف۔", quranicRef: "سورۃ الصف (۶۱:۶) میں حضرت عیسیٰ علیہ السلام کی بشارت میں مذکور ہے۔" }
  },
  ali: {
    ar: { meaning: "الشريف الرفيع القدر، العالي المنزلة والمكانة؛ اسم رابع الخلفاء الراشدين.", quranicRef: "مشتق من اسم الله تعالى (العلي)، واسم الصحابي الجليل علي بن أبي طالب رضي الله عنه." },
    ur: { meaning: "بلند مرتبہ، اعلیٰ مقام اور عزت والا؛ چوتھے خلیفۂ راشد کا مبارک نام۔", quranicRef: "اللہ تعالیٰ کے مبارک صفاتی نام 'العلی' سے مشتق ہے۔" }
  },
  ibrahim: {
    ar: { meaning: "أبو الأمم والجمهور؛ خليل الرحمن والنبي العظيم عليه السلام.", quranicRef: "ورد ذكره ٦٩ مرة في القرآن وسُميت سورة باسمه (سورة إبراهيم)." },
    ur: { meaning: "قوموں اور نسلوں کا باپ؛ اللہ کے برگزیدہ نبی اور خلیل اللہ کا نام۔", quranicRef: "قرآن میں ۶۹ مرتبہ ذکر آیا ہے اور سورۃ ابراہیم آپ کے نام سے موسوم ہے۔" }
  },
  ismail: {
    ar: { meaning: "الذي يسمع الله دعاءه؛ رمز الطاعة والبر بالوالدين.", quranicRef: "نبي الله إسماعيل بن إبراهيم عليهما السلام وباني الكعبة (مريم: ٥٤)." },
    ur: { meaning: "اللہ نے جس کی دعا سنی؛ اطاعت اور تسلیم و رضا کا عظیم پیکر۔", quranicRef: "حضرت اسماعیل علیہ السلام، بانی کعبہ، سورۃ مریم (۱۹:۵۴)۔" }
  },
  yusuf: {
    ar: { meaning: "يزيده الله حسناً ورفعة؛ رمز الجمال والعفة والصبر.", quranicRef: "سورة يوسف (سورة ١٢) تحكي قصته الكاملة ووصفت بأنها 'أحسن القصص'." },
    ur: { meaning: "اللہ جس کی خوبصورتی اور مرتبے میں اضافہ فرمائے؛ حسن اور صبر کی علامت۔", quranicRef: "سورۃ یوسف (سورۃ ۱۲) میں 'احسن القصص' کے طور پر پوری کہانی مذکور ہے۔" }
  },
  rayyan: {
    ar: { meaning: "المرتوي، الممتلئ نضارة وخيراً؛ باب في الجنة خُصص للصائمين.", quranicRef: "ورد في الحديث الصحيح اسم باب الريان الذي يدخل منه الصائمون الجنة." },
    ur: { meaning: "سرسبز و شاداب اور سیراب؛ جنت کا وہ خاص دروازہ جس سے روزہ دار داخل ہوں گے۔", quranicRef: "صحیح حدیث میں جنت کے مبارک باب الریان کے طور پر وارد ہے۔" }
  },
  zayd: {
    ar: { meaning: "الزيادة والنماء والبركة في الخير والصلاح.", quranicRef: "الصحابي الوحيد الذي ذُكر اسمه صراحة في القرآن (الأحزاب ٣٣:٣٧)." },
    ur: { meaning: "بڑھوتری، کثرت اور خیر و برکت میں اضافہ۔", quranicRef: "واحد صحابی جن کا نام مبارک قرآن مجید میں صراحتاً آیا ہے (الاحزاب ۳۳:۳۷)۔" }
  },
  hamza: {
    ar: { meaning: "الأسد، القوي الشجاع، الحازم في أمره؛ عم النبي ﷺ وأسد الله.", quranicRef: "سيد الشهداء وأسد الله ورسوله، حمزة بن عبد المطلب رضي الله عنه." },
    ur: { meaning: "شیر؛ شجاع، بہادر اور مضبوط ارادے والا؛ رسول اللہ ﷺ کے چچا اور شیرِ خدا۔", quranicRef: "سید الشہداء اور اسد اللہ حضرت حمزہ بن عبد المطلب رضی اللہ عنہ کا نام۔" }
  },
  omar: {
    ar: { meaning: "العامر، المديد العمر، رمز العدل والقوة في الحق؛ الفاروق رضي الله عنه.", quranicRef: "ثاني الخلفاء الراشدين الفاروق عمر بن الخطاب رضي الله عنه." },
    ur: { meaning: "آباد، دراز عمر، عدل و انصاف اور حق کا روشن مینار؛ حضرت عمر فاروق رضی اللہ عنہ۔", quranicRef: "دوسرے خلیفۂ راشد حضرت عمر فاروق اعظم رضی اللہ عنہ کا مبارک نام۔" }
  },
  bilal: {
    ar: { meaning: "الماء الندي الذي يروي العطش؛ مؤذن رسول الله ﷺ ورمز الثبات.", quranicRef: "أول مؤذن في الإسلام وصاحب الصوت الندي الصادق بالأذان." },
    ur: { meaning: "تر و تازہ کرنے والی نمی اور پانی؛ رسول اللہ ﷺ کے پہلے مؤذنِ اسلام۔", quranicRef: "اسلام کے پہلے مؤذن اور ایمان و استقامت کے عظیم پیکر حضرت بلال حبشی رضی اللہ عنہ۔" }
  },
  tariq: {
    ar: { meaning: "النجم الثاقب الذي يضيء في الظلام، الزائر الهادي بالليل.", quranicRef: "سورة الطارق (٨٦:١) افتتحت بالقسم: 'والسماء والطارق'." },
    ur: { meaning: "صبح کا روشن ستارہ؛ اندھیرے میں راہنمائی کرنے والا چمکدار ستارہ۔", quranicRef: "سورۃ الطارق (۸۶:۱) میں 'والسماء والطارق' کے طور پر وارد ہے۔" }
  },
  zayn: {
    ar: { meaning: "الجمال والحسن والبهاء، الشرف والزينة الحسنة.", quranicRef: "مشتق من الزينة والجمال الممدوح في الأدب العربي والإسلامي." },
    ur: { meaning: "خوبصورتی، حسن و جمال، عمدگی اور باوقار سجاوٹ۔", quranicRef: "حسنِ اخلاق اور جمالِ کردار کے مفہوم والا خوبصورت نام۔" }
  },
  khalid: {
    ar: { meaning: "الدائم، الباقي بالذكر الطيب، الصابر؛ سيف الله المسلول رضي الله عنه.", quranicRef: "مشتق من الجذر القرآني (خ-ل-د) الدال على دوام نعيم الجنة." },
    ur: { meaning: "ہمیشہ رہنے والا، پائیدار؛ سیف اللہ حضرت خالد بن ولید رضی اللہ عنہ۔", quranicRef: "قرآنی مادہ 'خلد' سے ماخوذ ہے جو ابدی کامیابی اور بقا کو ظاہر کرتا ہے۔" }
  },
  kinan: {
    ar: { meaning: "الغطاء والستر والحصن الذي يحفظ ويصون.", quranicRef: "ورد أصل الكلمة في سورة النحل (١٦:٨١) بمعنى الأكنان والمواضع الحامية." },
    ur: { meaning: "حفاظت، پردہ، پناہ گاہ اور ڈھال۔", quranicRef: "سورۃ النحل (۱۶:۸۱) میں امن و پناہ کی جگہوں کے حوالے سے مذکور ہے۔" }
  },
  nuaym: {
    ar: { meaning: "النعمة والراحة وطيب العيش ورضا النفس ولين الجانب.", quranicRef: "تصغير نعيم، وهو النعيم المقيم في جنات الخلد." },
    ur: { meaning: "خوشحالی، راحت، آسودگی اور دائمی نعمت۔", quranicRef: "جنات النعیم کے مبارک قرآنی مفہوم سے نسبت رکھتا ہے۔" }
  },
  idris: {
    ar: { meaning: "كثير الدرس والتعلم والحكمة؛ نبي الله إدريس عليه السلام.", quranicRef: "ذُكر في سورة مريم (١٩:٥٦): 'واذكر في الكتاب إدريس إنه كان صديقاً نبياً'." },
    ur: { meaning: "سبق لینے والا، کثرت سے علم و حکمت حاصل کرنے والا؛ حضرت ادریس علیہ السلام۔", quranicRef: "سورۃ مریم (۱۹:۵۶) میں صدیق اور نبی کے طور پر ذکر ہے۔" }
  },
  firas: {
    ar: { meaning: "صاحب الفراسة والذكاء الحاد وحسن التقدير والنظر الثاقب.", quranicRef: "من الفراسة الممدوحة في الحكمة الإسلامية: 'اتقوا فراسة المؤمن'." },
    ur: { meaning: "تیز فہم، دانا، بصیرت اور فراست رکھنے والا انسان۔", quranicRef: "حدیث میں وارد مومن کی بصیرت اور فراست سے وابستہ ہے۔" }
  },
  kian: {
    ar: { meaning: "الأصل والوجود والجوهر والطبيعة الأصيلة والكيان الثابت.", quranicRef: "يعبر عن الوجود المتزن والشخصية الراسخة في اللغة العربية." },
    ur: { meaning: "ہستی، وجود، اصل اور مضبوط تشخص و وقار۔", quranicRef: "وقار، تشخص اور بنیاد کے معنی میں استعمال ہوتا ہے۔" }
  },
  zafir: {
    ar: { meaning: "الفائز بالخير، الغالب والظافر بالنصر والنجاح المستحق.", quranicRef: "دلالة الفوز والظفر بالحق والعمل الصالح." },
    ur: { meaning: "کامیاب، فتح پانے والا، سرخرو اور بامراد۔", quranicRef: "نیکی اور حق میں فتح مندی اور فوز و فلاح کا مفہوم۔" }
  },
  maryam: {
    ar: { meaning: "العابدة القانتة الخاشعة، الطاهرة المصطفاة؛ أم المسيح عيسى عليهما السلام.", quranicRef: "المرأة الوحيدة المذكورة باسمها في القرآن، وسُميت سورة باسمها (سورة مريم)." },
    ur: { meaning: "عابدہ، زاہدہ اور پاکدامن خاتون؛ حضرت عیسیٰ علیہ السلام کی والدہ ماجدہ۔", quranicRef: "واحد خاتون جن کا مبارک نام قرآن میں آیا ہے، سورۃ مریم۔" }
  },
  fatima: {
    ar: { meaning: "التي فطمت نفسها وولدها عن الشر والآثام؛ سيدة نساء أهل الجنة.", quranicRef: "سيدة نساء أهل الجنة وبنت رسول الله ﷺ الزهراء رضي الله عنها." },
    ur: { meaning: "برائی سے بچانے والی؛ سیدۃ نساء اہل الجنہ حضرت فاطمۃ الزہراء رضی اللہ عنہا۔", quranicRef: "رسول اللہ ﷺ کی چہیتی صاحبزادی اور جنتی خواتین کی سردار۔" }
  },
  aisha: {
    ar: { meaning: "الحية ذات العيش الرغيد والبركة، العالمة الفقيهة؛ أم المؤمنين رضي الله عنها.", quranicRef: "أم المؤمنين وحبيبة رسول الله ﷺ وعالمة الأمة وفقيهتها." },
    ur: { meaning: "خوشگوار اور بابرکت زندگی گزارنے والی، عالمہ؛ ام المؤمنین حضرت عائشہ صدیقہ رضی اللہ عنہا۔", quranicRef: "ام المؤمنین اور صحابہ کرام کی عظیم ترین فقیہہ و معلمہ۔" }
  },
  khadijah: {
    ar: { meaning: "المولودة بمكارم الأخلاق، السابقة إلى الخير والإيمان؛ أم المؤمنين الأولى.", quranicRef: "أول من آمن بالرسالة وواست النبي ﷺ بنفسها ومالها رضي الله عنها." },
    ur: { meaning: "پہل کرنے والی، باوقار اور محترم؛ اسلام کی پہلی خاتون اور ام المؤمنین۔", quranicRef: "اسلام کی سب سے پہلی تصدیق کرنے والی ام المؤمنین حضرت خدیجہ الکبریٰ رضی اللہ عنہا۔" }
  },
  noor: {
    ar: { meaning: "الضياء الساطع، الهداية الربانية والوضوح والإشراق في القلب والروح.", quranicRef: "اسم سورة في القرآن (سورة النور)، وورد في قوله تعالى: 'الله نور السماوات والأرض'." },
    ur: { meaning: "روشنی، اجالا، روحانی چمک اور ہدایت کا روشن راستہ۔", quranicRef: "سورۃ النور (۲۴:۳۵): 'اللہ آسمانوں اور زمین کا نور ہے'۔" }
  },
  zahra: {
    ar: { meaning: "البيضاء المشرقة الوجه، الزهرة المتفتحة بالنقاء والصفاء.", quranicRef: "لقب فاطمة بنت رسول الله ﷺ لجمال خلقها وطهارتها." },
    ur: { meaning: "کھلا ہوا پھول، روشن چہرے والی، پاکیزہ اور چمکدار۔", quranicRef: "حضرت فاطمہ رضی اللہ عنہا کا مبارک لقب الزہراء۔" }
  },
  tasneem: {
    ar: { meaning: "عين ماء مباركة في الجنة يشرب منها المقربون وتفيض عذوبة.", quranicRef: "ذُكرت في سورة المطففين (٨٣:٢٧): 'ومزاجه من تسنيم'." },
    ur: { meaning: "جنت کا مقدس چشمہ جس کا پانی نہایت پاکیزہ اور خوشبودار ہے۔", quranicRef: "سورۃ المطففین (۸۳:۲۷) میں 'ومزاجہ من تسنیم' کے طور پر وارد ہے۔" }
  },
  inaya: {
    ar: { meaning: "الرعاية والاهتمام واللطف والحفظ الإلهي المحيط بالعبد.", quranicRef: "تعبر عن العناية الإلهية واللطف الرباني بالخلق." },
    ur: { meaning: "توجہ، نگہبانی، مہربانی اور اللہ تعالیٰ کی خاص حفاظت و رحمت۔", quranicRef: "عنایتِ الٰہی اور رحمتِ خداوندی کا اظہار۔" }
  },
  sidra: {
    ar: { meaning: "شجرة النبق العظيمة في أعلى مراتب الجنة (سدرة المنتهى).", quranicRef: "ذُكرت في سورة النجم (٥٣:١٤): 'عند سدرة المنتهى'." },
    ur: { meaning: "آسمانوں کی آخری سرحد پر واقع مقدس درخت (سدرۃ المنتہیٰ)۔", quranicRef: "سورۃ النجم (۵۳:۱۴): 'عند سدرۃ المنتہیٰ'۔" }
  },
  ruqayyah: {
    ar: { meaning: "الرقة والسمو والارتقاء في الفضل والمكانة؛ بنت رسول الله ﷺ.", quranicRef: "بنت النبي ﷺ وزوجة عثمان بن عفان رضي الله عنهما." },
    ur: { meaning: "نزاکت، بلندی، شائستگی اور شرافت؛ رسول اللہ ﷺ کی صاحبزادی۔", quranicRef: "رسول اکرم ﷺ کی صاحبزادی حضرت رقیہ رضی اللہ عنہا۔" }
  },
  zaynab: {
    ar: { meaning: "الشجرة الطيبة الرائحة ذات المنظر الحسن؛ كبرى بنات النبي ﷺ.", quranicRef: "كبرى بنات النبي ﷺ وسيدة من سيدات البيت النبوي الطاهر." },
    ur: { meaning: "خوشبودار خوبصورت درخت؛ رسول اللہ ﷺ کی سب سے بڑی صاحبزادی۔", quranicRef: "رسول اللہ ﷺ کی بڑی صاحبزادی حضرت زینب رضی اللہ عنہا۔" }
  },
  safiyyah: {
    ar: { meaning: "الخالصة من كل عيب، الصديقة الصادقة الوفية؛ أم المؤمنين.", quranicRef: "أم المؤمنين صفية بنت حيي رضي الله عنها، صاحبة الشرف والحلم." },
    ur: { meaning: "ہر عیب سے پاک، مخلص و سچی دوست؛ ام المؤمنین حضرت صفیہ رضی اللہ عنہا۔", quranicRef: "ام المؤمنین حضرت صفیہ رضی اللہ عنہا کا مبارک نام۔" }
  },
  sumayyah: {
    ar: { meaning: "العالية السامية الرفيعة الشأن؛ أول شهيدة في الإسلام.", quranicRef: "سمية بنت خياط رضي الله عنها، أول شهيدة ضربت أروع أمثلة الثبات." },
    ur: { meaning: "بلند مرتبہ، اعلیٰ مقام؛ اسلام کی سب سے پہلی شہید خاتون۔", quranicRef: "اسلام کی پہلی شہید حضرت سمیہ رضی اللہ عنہا کا نام۔" }
  },
  rawdah: {
    ar: { meaning: "الحديقة الغناء، البستان النضر؛ وروضة الجنة في المسجد النبوي.", quranicRef: "ذُكرت في سورة الروم (٣٠:١٥): 'فهم في روضة يحبرون'." },
    ur: { meaning: "سرسبز و شاداب باغ؛ مسجد نبوی میں روضۂ اطہر کی پاکیزہ نسبت۔", quranicRef: "سورۃ الروم (۳۰:۱۵) میں جنت کے سرسبز باغ کے حوالے سے مذکور ہے۔" }
  },
  juwayriyah: {
    ar: { meaning: "الوردة الحمراء الصغيرة؛ أم المؤمنين كثيرة الذكر والتسبيح.", quranicRef: "أم المؤمنين جويرية بنت الحارث رضي الله عنها." },
    ur: { meaning: "چھوٹا سرخ گلاب؛ کثرت سے تسبیح و ذکر کرنے والی ام المؤمنین۔", quranicRef: "ام المؤمنین حضرت جویریہ رضی اللہ عنہا کا نام۔" }
  },
  layla: {
    ar: { meaning: "نشوة الهدوء في أول الليل، السواد الجميل الهادئ المتأمل.", quranicRef: "اسم عربي أصيل يعبر عن السكينة والجمال الهادئ." },
    ur: { meaning: "رات کا پرسکون وقت، سیاہ خوبصورتی اور پُرسکون خاموشی۔", quranicRef: "عربی اور مشرقی ادب کا باوقار اور پرسکون نام۔" }
  },
  lina: {
    ar: { meaning: "النخلة اللطيفة الكريمة الثمر، اللين والرقة واليسر.", quranicRef: "ذُكرت في سورة الحشر (٥٩:٥): 'ما قطعتم من لينة أو تركتموها قائمة'." },
    ur: { meaning: "نرم و نازک کھجور کا درخت، نرمی، ملائمت اور لطافت۔", quranicRef: "سورۃ الحشر (۵۹:۵) میں پاکیزہ کھجور کے درخت کے حوالے سے مذکور ہے۔" }
  },
  aya: {
    ar: { meaning: "المعجزة والعلامة الدالة على عظمة الخالق سبحانه، والآية القرآنية.", quranicRef: "وردت كلمة 'آية' مئات المرات في القرآن الكريم للدلالة على المعجزات والآيات." },
    ur: { meaning: "اللہ کی نشانی، معجزہ، اور قرآن پاک کی بابرکت آیت۔", quranicRef: "قرآن مجید میں سینکڑوں مقامات پر الٰہی نشانی کے طور پر وارد ہے۔" }
  },
  mehar: {
    ar: { meaning: "المودة والعطف والإحسان واللطف المشرق.", quranicRef: "اسم أردي/فارسي يعبر عن الرحمة والرقة والود." },
    ur: { meaning: "شفقت، مہربانی، محبت، نوازش اور خوبصورت کرم۔", quranicRef: "اردو اور فارسی روایت میں رحمت و محبت کا خوبصورت مظہر۔" }
  },
  yasmin: {
    ar: { meaning: "زهرة الياسمين البيضاء العطرة، رمز النقاء والبهجة.", quranicRef: "زهرة بيضاء فواحة ترمز للبراءة والرائحة الطيبة." },
    ur: { meaning: "چنبیلی کا سفید خوشبودار پھول، پاکیزگی اور مسرت کی علامت۔", quranicRef: "خوشبو اور پاکیزگی کی علامت سفید پھول کا نام۔" }
  },
  alizeh: {
    ar: { meaning: "النسيم العليل المبهج المفعم بالانتعاش والحيوية.", quranicRef: "اسم فارسي رقيق يعبر عن نسيم الصباح المنعش." },
    ur: { meaning: "ہوا کا ٹھنڈا خوشگوار جھونکا، تروتازگی اور شگفتگی۔", quranicRef: "فارسی و اردو میں خوشگوار اور تروتازہ ہوا کا جھونکا۔" }
  },
  aylin: {
    ar: { meaning: "هالة النور المحيطة بالقمر المكتمل في ليلة الصفاء.", quranicRef: "اسم تركي يعني هالة القمر والضياء المنير." },
    ur: { meaning: "چودھویں کے چاند کے گرد پھیلا ہوا نورانی ہالہ۔", quranicRef: "ترکی و مسلم ثقافت میں چاند کی روشنی اور خوبصورتی۔" }
  }
};

export const themeTranslations: Record<string, { ar: string; ur: string }> = {
  Prophetic: { ar: "نبوي", ur: "انبیاء" },
  Sahaba: { ar: "صحابة", ur: "صحابہ" },
  Devotion: { ar: "عبادة وقنوت", ur: "عبادت و تقویٰ" },
  Faith: { ar: "إيمان وتوحيد", ur: "ایمان و یقین" },
  Wisdom: { ar: "حكمة وبصيرة", ur: "حکمت و دانائی" },
  Strength: { ar: "قوة وعزم", ur: "طاقت و استقامت" },
  Bravery: { ar: "شجاعة وإقدام", ur: "شجاعت و بہادری" },
  Light: { ar: "نور وضياء", ur: "نور و روشنی" },
  Nature: { ar: "طبيعة وجمال", ur: "فطرت و قدرت" },
  Beauty: { ar: "جمال وبهاء", ur: "حسن و جمال" },
  Grace: { ar: "لطف ورقة", ur: "رحمت و شائستگی" },
  Blessings: { ar: "بركة ونعمة", ur: "برکت و نعمت" },
  Virtue: { ar: "فضيلة وخلق", ur: "فضیلت و کردار" },
  Peace: { ar: "سلام وسكينة", ur: "امن و سلامتی" },
  Praise: { ar: "حمد وشكر", ur: "حمد و شکر" },
  Patience: { ar: "صبر واحتساب", ur: "صبر و برداشت" },
  Growth: { ar: "نماء وزيادة", ur: "ترقی و نشوونما" },
  Nobility: { ar: "شرف ورفعة", ur: "شرافت و عظمت" },
  Endurance: { ar: "ثبات وخلود", ur: "ثبات و پائیداری" },
  Purity: { ar: "طهارة ونقاء", ur: "طہارت و پاکیزگی" },
  Modern: { ar: "عصري", ur: "جدید" },
  Joy: { ar: "فرح وبهجة", ur: "خوشی و مسرت" }
};

export const originTranslations: Record<Origin, { ar: string; ur: string }> = {
  Arabic: { ar: "عربي", ur: "عربی" },
  Quranic: { ar: "قرآني", ur: "قرآنی" },
  Persian: { ar: "فارسي", ur: "فارسی" },
  Turkish: { ar: "تركي", ur: "ترکی" },
  Urdu: { ar: "أردي", ur: "اردو" }
};

export const styleTranslations: Record<Style, { ar: string; ur: string }> = {
  traditional: { ar: "تقليدي وتاريخي", ur: "روایتی و تاریخی" },
  modern: { ar: "معاصر وقصير", ur: "جدید و خوبصورت" },
  rare: { ar: "نادر وفريد", ur: "نایاب و منفرد" },
  classic: { ar: "كلاسيكي أصيل", ur: "کلاسیک و باوقار" }
};

export const genderTranslations: Record<Gender | "all", { ar: string; ur: string; en: string }> = {
  all: { ar: "جميع الأجناس", ur: "تمام اصناف", en: "All Genders" },
  boy: { ar: "أولاد", ur: "لڑکے", en: "Boys" },
  girl: { ar: "بنات", ur: "لڑکیاں", en: "Girls" },
  unisex: { ar: "مشترك", ur: "مشترکہ", en: "Unisex" }
};

export function getLocalizedNameMeaning(name: MuslimName, lang: "en" | "ar" | "ur"): string {
  if (lang === "ar") {
    return nameTranslations[name.id]?.ar?.meaning || name.meaning;
  }
  if (lang === "ur") {
    return nameTranslations[name.id]?.ur?.meaning || name.meaning;
  }
  return name.meaning;
}

export function getLocalizedQuranicRef(name: MuslimName, lang: "en" | "ar" | "ur"): string | undefined {
  if (lang === "ar") {
    return nameTranslations[name.id]?.ar?.quranicRef || name.quranicRef;
  }
  if (lang === "ur") {
    return nameTranslations[name.id]?.ur?.quranicRef || name.quranicRef;
  }
  return name.quranicRef;
}

export function getLocalizedTheme(theme: string, lang: "en" | "ar" | "ur"): string {
  if (lang === "ar") return themeTranslations[theme]?.ar || theme;
  if (lang === "ur") return themeTranslations[theme]?.ur || theme;
  return theme;
}

export function getLocalizedOrigin(origin: Origin, lang: "en" | "ar" | "ur"): string {
  if (lang === "ar") return originTranslations[origin]?.ar || origin;
  if (lang === "ur") return originTranslations[origin]?.ur || origin;
  return origin;
}

export function getLocalizedStyle(style: Style, lang: "en" | "ar" | "ur"): string {
  if (lang === "ar") return styleTranslations[style]?.ar || style;
  if (lang === "ur") return styleTranslations[style]?.ur || style;
  return style;
}

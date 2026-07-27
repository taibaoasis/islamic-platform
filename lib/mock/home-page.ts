/**
 * بيانات وهمية (Mock Data) للصفحة الرئيسية فقط — لا اتصال بقاعدة
 * بيانات ولا Prisma ولا API. تُستبدَل بالكامل عند ربط الصفحة بمصادر
 * بيانات حقيقية في مرحلة لاحقة معتمَدة صراحة.
 *
 * Mock data for the home page only — no database, Prisma, or API
 * connection. Fully replaced once the page is wired to real data
 * sources in an explicitly approved later phase.
 */

export interface QuickAccessItem {
  key: string;
  href: string;
  iconName: "quran" | "hadith" | "tafsir" | "fatwa" | "articles" | "courses" | "books" | "scholars";
}

export const quickAccessItems: QuickAccessItem[] = [
  { key: "quran", href: "/quran", iconName: "quran" },
  { key: "hadith", href: "/hadith", iconName: "hadith" },
  { key: "tafsir", href: "/tafsir", iconName: "tafsir" },
  { key: "fatwa", href: "/fatwa", iconName: "fatwa" },
  { key: "articles", href: "/articles", iconName: "articles" },
  { key: "courses", href: "/courses", iconName: "courses" },
  { key: "books", href: "/books", iconName: "books" },
  { key: "scholars", href: "/scholars", iconName: "scholars" },
];

export interface FeaturedContentItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  href: string;
  imageAlt: string;
}

export const featuredContent: FeaturedContentItem[] = [
  {
    id: "f1",
    title: "معنى التقوى في القرآن الكريم",
    excerpt: "قراءة في الآيات التي وردت فيها لفظة التقوى ودلالاتها المتعددة عبر السياقات القرآنية.",
    category: "تفسير",
    href: "/articles/taqwa-in-quran",
    imageAlt: "مقالة عن معنى التقوى في القرآن",
  },
  {
    id: "f2",
    title: "فقه الصلاة في السفر",
    excerpt: "أحكام القصر والجمع للمسافر، مع عرض مقارن لآراء المذاهب الفقهية الأربعة.",
    category: "فقه",
    href: "/articles/prayer-while-traveling",
    imageAlt: "مقالة عن فقه الصلاة في السفر",
  },
  {
    id: "f3",
    title: "السيرة النبوية: الهجرة إلى المدينة",
    excerpt: "الأحداث والدروس المستفادة من هجرة النبي ﷺ من مكة إلى المدينة المنورة.",
    category: "سيرة",
    href: "/articles/hijrah-to-madinah",
    imageAlt: "مقالة عن الهجرة النبوية",
  },
  {
    id: "f4",
    title: "آداب طالب العلم في التراث الإسلامي",
    excerpt: "وصايا العلماء الأوائل في أخلاقيات طلب العلم الشرعي وآداب المتعلم مع معلمه.",
    category: "تزكية",
    href: "/articles/etiquette-of-seeking-knowledge",
    imageAlt: "مقالة عن آداب طالب العلم",
  },
];

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  lessonsCount: number;
  href: string;
}

export const learningPaths: LearningPath[] = [
  {
    id: "lp1",
    title: "أساسيات الإسلام للمسلم الجديد",
    description: "مسار تأسيسي يغطي أركان الإسلام والإيمان والعبادات اليومية خطوة بخطوة.",
    level: "مبتدئ",
    lessonsCount: 12,
    href: "/courses/islam-basics",
  },
  {
    id: "lp2",
    title: "علوم القرآن التطبيقية",
    description: "مقدمة في علوم التفسير وأسباب النزول والناسخ والمنسوخ.",
    level: "متوسط",
    lessonsCount: 18,
    href: "/courses/quranic-sciences",
  },
  {
    id: "lp3",
    title: "مصطلح الحديث وعلم الرجال",
    description: "مسار متقدم في دراسة علوم الحديث ومناهج المحدّثين في التوثيق.",
    level: "متقدم",
    lessonsCount: 24,
    href: "/courses/hadith-terminology",
  },
];

export interface PlatformStat {
  key: "books" | "articles" | "lessons" | "languages";
  value: number;
}

export const platformStats: PlatformStat[] = [
  { key: "books", value: 1240 },
  { key: "articles", value: 3860 },
  { key: "lessons", value: 920 },
  { key: "languages", value: 14 },
];

export interface LatestContentItem {
  id: string;
  title: string;
  type: "مقالة" | "درس" | "فتوى" | "كتاب";
  href: string;
  addedAt: string;
}

export const latestContent: LatestContentItem[] = [
  { id: "l1", title: "حكم الجمع بين الصلاتين لعذر المرض", type: "فتوى", href: "/fatwa/combining-prayers-illness", addedAt: "2026-07-20" },
  { id: "l2", title: "الدرس الثالث: مخارج الحروف العربية", type: "درس", href: "/courses/arabic-for-quran/lesson-3", addedAt: "2026-07-19" },
  { id: "l3", title: "التوكل على الله بين القلب والعمل", type: "مقالة", href: "/articles/tawakkul", addedAt: "2026-07-18" },
  { id: "l4", title: "رياض الصالحين: شرح ميسّر", type: "كتاب", href: "/books/riyad-as-salihin", addedAt: "2026-07-16" },
  { id: "l5", title: "آداب الدعاء وأوقات الإجابة", type: "مقالة", href: "/articles/etiquette-of-dua", addedAt: "2026-07-15" },
];

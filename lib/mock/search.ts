/**
 * بيانات ومنطق بحث وهمي بالكامل — لا اتصال بمحرك بحث حقيقي (OpenSearch/
 * Elasticsearch) ولا API. دالة `searchMock` تحاكي سلوك بحث حقيقي (تصفية
 * نصية + تصنيف حسب النوع) لتسهيل استبدالها لاحقًا باستدعاء API حقيقي
 * دون إعادة تصميم الواجهة — تمامًا كما هو الهدف المعلَن من هذه المرحلة.
 *
 * Fully mock search data and logic — no real search engine (OpenSearch/
 * Elasticsearch) or API connection. `searchMock` simulates real search
 * behavior (text filtering + type faceting) so it can later be swapped
 * for a real API call without redesigning the UI — exactly this
 * phase's stated goal.
 */

export type SearchResultType =
  | "quran"
  | "hadith"
  | "tafsir"
  | "fatwa"
  | "article"
  | "book"
  | "course"
  | "video"
  | "audio";

export const searchResultTypes: SearchResultType[] = [
  "quran",
  "hadith",
  "tafsir",
  "fatwa",
  "article",
  "book",
  "course",
  "video",
  "audio",
];

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  excerpt: string;
  meta?: string;
  href: string;
}

export const mockSearchIndex: SearchResult[] = [
  { id: "q1", type: "quran", title: "﴿إِنَّ اللَّهَ مَعَ الصَّابِرِينَ﴾", excerpt: "سورة البقرة، الآية 153", meta: "البقرة 2:153", href: "/quran/2/153" },
  { id: "q2", type: "quran", title: "﴿وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا﴾", excerpt: "سورة الطلاق، الآية 2", meta: "الطلاق 65:2", href: "/quran/65/2" },
  { id: "q3", type: "quran", title: "﴿إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ﴾", excerpt: "سورة الحجرات، الآية 10", meta: "الحجرات 49:10", href: "/quran/49/10" },
  { id: "h1", type: "hadith", title: "إنما الأعمال بالنيات", excerpt: "رواه البخاري ومسلم، حديث صحيح عن عمر بن الخطاب رضي الله عنه", meta: "صحيح البخاري", href: "/hadith/bukhari/1" },
  { id: "h2", type: "hadith", title: "من حسن إسلام المرء تركه ما لا يعنيه", excerpt: "حديث حسن رواه الترمذي", meta: "جامع الترمذي", href: "/hadith/tirmidhi/2317" },
  { id: "h3", type: "hadith", title: "الصبر عند الصدمة الأولى", excerpt: "حديث صحيح متفق عليه في آداب التعزية والصبر", meta: "صحيح البخاري", href: "/hadith/bukhari/1283" },
  { id: "t1", type: "tafsir", title: "تفسير آية الصبر في سورة البقرة", excerpt: "شرح مفصَّل لمعنى الصبر ومنزلته في القرآن الكريم", meta: "تفسير ابن كثير", href: "/tafsir/baqarah-153" },
  { id: "t2", type: "tafsir", title: "تفسير سورة الفاتحة", excerpt: "تفسير موجز لآيات سورة الفاتحة ومقاصدها العامة", meta: "تفسير السعدي", href: "/tafsir/fatihah" },
  { id: "f1", type: "fatwa", title: "حكم الجمع بين الصلاتين لعذر المرض", excerpt: "فتوى معتمَدة من هيئة الإفتاء حول رخصة الجمع للمريض", meta: "الفقه الحنبلي", href: "/fatwa/combining-prayers-illness" },
  { id: "f2", type: "fatwa", title: "حكم صيام المسافر في رمضان", excerpt: "بيان أحكام الفطر والصيام للمسافر مع الأدلة الشرعية", meta: "فتوى عامة", href: "/fatwa/traveler-fasting" },
  { id: "a1", type: "article", title: "معنى التقوى في القرآن الكريم", excerpt: "قراءة في الآيات التي وردت فيها لفظة التقوى ودلالاتها", meta: "مقالة تفسيرية", href: "/articles/taqwa-in-quran" },
  { id: "a2", type: "article", title: "آداب طالب العلم في التراث الإسلامي", excerpt: "وصايا العلماء الأوائل في أخلاقيات طلب العلم الشرعي", meta: "مقالة تزكية", href: "/articles/etiquette-of-seeking-knowledge" },
  { id: "b1", type: "book", title: "رياض الصالحين", excerpt: "من كلام سيد المرسلين، للإمام النووي، شرح ميسَّر", meta: "الإمام النووي", href: "/books/riyad-as-salihin" },
  { id: "b2", type: "book", title: "صحيح البخاري", excerpt: "أصح كتاب بعد كتاب الله، جامع الصحيح المسند", meta: "الإمام البخاري", href: "/books/sahih-bukhari" },
  { id: "c1", type: "course", title: "أساسيات الإسلام للمسلم الجديد", excerpt: "مسار تأسيسي يغطي أركان الإسلام والإيمان والعبادات اليومية", meta: "12 درسًا · مبتدئ", href: "/courses/islam-basics" },
  { id: "c2", type: "course", title: "علوم القرآن التطبيقية", excerpt: "مقدمة في علوم التفسير وأسباب النزول والناسخ والمنسوخ", meta: "18 درسًا · متوسط", href: "/courses/quranic-sciences" },
  { id: "v1", type: "video", title: "شرح مبسَّط لأركان الإسلام الخمسة", excerpt: "محاضرة مرئية مدتها 18 دقيقة لشرح الأركان بأسلوب ميسَّر", meta: "18:24", href: "/videos/pillars-of-islam" },
  { id: "v2", type: "video", title: "قصة هجرة النبي ﷺ إلى المدينة", excerpt: "عرض مرئي مصوَّر لأحداث الهجرة النبوية ودروسها", meta: "24:10", href: "/videos/hijrah-story" },
  { id: "au1", type: "audio", title: "تلاوة سورة الرحمن - الشيخ عبد الباسط", excerpt: "تلاوة كاملة بصوت الشيخ عبد الباسط عبد الصمد رحمه الله", meta: "12:45", href: "/audio/rahman-abdulbasit" },
  { id: "au2", type: "audio", title: "محاضرة: فقه الصبر عند الابتلاء", excerpt: "محاضرة صوتية في معنى الصبر وأثره في حياة المسلم", meta: "32:18", href: "/audio/patience-lecture" },
];

/** يحاكي زمن استجابة شبكة واقعي لعرض حالة التحميل (Skeleton) بمعنى فعلي. Simulates a realistic network delay so the loading (Skeleton) state has real meaning. */
export const MOCK_SEARCH_DELAY_MS = 450;

export function searchMock(query: string, activeTypes: SearchResultType[]): SearchResult[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return mockSearchIndex.filter((item) => {
    const matchesType = activeTypes.length === 0 || activeTypes.includes(item.type);
    if (!matchesType) return false;
    if (!normalizedQuery) return true;
    return (
      item.title.toLocaleLowerCase().includes(normalizedQuery) ||
      item.excerpt.toLocaleLowerCase().includes(normalizedQuery) ||
      (item.meta?.toLocaleLowerCase().includes(normalizedQuery) ?? false)
    );
  });
}

/** اقتراحات أثناء الكتابة — أول 5 عناوين مطابقة فقط، بلا مقتطف. Type-ahead suggestions — first 5 matching titles only, no excerpt. */
export function getSuggestions(query: string): SearchResult[] {
  if (!query.trim()) return [];
  return searchMock(query, []).slice(0, 5);
}

export const mockSearchHistory: string[] = ["فقه الصلاة في السفر", "أركان الإسلام", "تفسير سورة البقرة"];

export const mockTrendingSearches: string[] = [
  "رمضان",
  "أحكام الزكاة",
  "قصص الأنبياء",
  "أسماء الله الحسنى",
  "آداب الدعاء",
];

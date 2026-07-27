/**
 * محرك المحتوى العام (Generic Content Engine) — Phase 9.5. نموذج بيانات
 * واحد (`ContentItem`) يغطي كل أنواع المحتوى الخمسة (مقالة، فتوى، كتاب،
 * درس، خبر) عبر حقل `kind` فقط — لا نموذج منفصل لكل نوع. هذا هو أساس
 * "قابلية إعادة الاستخدام دون تعديل المكوّنات الأساسية" المطلوبة صراحة.
 * بيانات وهمية بالكامل، لا اتصال بقاعدة بيانات.
 *
 * Generic Content Engine — Phase 9.5. One data model (`ContentItem`)
 * covers all five content kinds (article, fatwa, book, lesson, news)
 * via a single `kind` field — no separate model per type. This is the
 * foundation of the explicitly required "reusable without modifying
 * core components". Fully mock data, no database connection.
 */

export type ContentKind = "article" | "fatwa" | "book" | "lesson" | "news";

export const contentKindLabels: Record<ContentKind, { ar: string; en: string }> = {
  article: { ar: "مقالة", en: "Article" },
  fatwa: { ar: "فتوى", en: "Fatwa" },
  book: { ar: "كتاب", en: "Book" },
  lesson: { ar: "درس", en: "Lesson" },
  news: { ar: "خبر", en: "News" },
};

export interface ContentAuthor {
  name: string;
  role: string;
  initials: string;
}

/**
 * كتلة محتوى واحدة — نفس المصفوفة تُستخدَم لعرض النص (ContentBody)
 * واستخراج جدول المحتويات (TableOfContents) من مصدر واحد.
 *
 * **امتداد Phase 11 Module 3:** وُسِّع الاتحاد النوعي من 3 أنواع (عنوان/
 * فقرة/اقتباس) إلى 13 نوعًا لخدمة محرر المحتوى المؤسسي — امتداد متوقَّع
 * ومقصود لتصميم "مصفوفة كتل عامة" الأصلي في Phase 9.5، لا تناقضًا معه؛
 * الأنواع الثلاثة الأصلية بلا أي تغيير في بنيتها، فـ`ContentBody`
 * وTableOfContents (Phase 9.5) يستمران بالعمل بلا أي تعديل.
 *
 * A single content block — the same array drives both body rendering
 * (ContentBody) and TOC extraction (TableOfContents) from one source.
 *
 * **Phase 11 Module 3 extension:** the type union grew from 3 types
 * (heading/paragraph/quote) to 13 to serve the Enterprise Content
 * Editor — an expected, deliberate extension of Phase 9.5's original
 * "generic block array" design, not a contradiction of it; the
 * original three types are unchanged in shape, so `ContentBody` and
 * `TableOfContents` (Phase 9.5) keep working with zero modification.
 */
export type ContentBlock =
  | { type: "heading"; id: string; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "citation"; label: string; sourceType: "quran" | "hadith" | "fatwa"; href: string }
  | { type: "quranVerse"; reference: string; href: string }
  | { type: "hadith"; reference: string; grade?: "SAHIH" | "HASAN" | "DAIF"; href: string }
  | { type: "image"; altText: string; caption?: string }
  | { type: "video"; title: string; caption?: string }
  | { type: "audio"; title: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "divider" }
  | { type: "callout"; variant: "info" | "warning" | "success"; text: string };

export interface ContentCitation {
  label: string;
  sourceType: "quran" | "hadith" | "fatwa";
  href: string;
}

export interface ContentItem {
  id: string;
  kind: ContentKind;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topics: string[];
  tags: string[];
  author: ContentAuthor;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  blocks: ContentBlock[];
  citations: ContentCitation[];
}

export const mockContentItems: ContentItem[] = [
  {
    id: "c1",
    kind: "article",
    slug: "taqwa-in-quran",
    title: "معنى التقوى في القرآن الكريم",
    excerpt: "قراءة في الآيات التي وردت فيها لفظة التقوى ودلالاتها المتعددة عبر السياقات القرآنية المختلفة.",
    category: "تفسير",
    topics: ["العقيدة", "الأخلاق"],
    tags: ["تقوى", "قرآن", "تزكية"],
    author: { name: "د. أحمد المنصوري", role: "أستاذ التفسير", initials: "أم" },
    publishedAt: "2026-07-10",
    updatedAt: "2026-07-15",
    readingTimeMinutes: 6,
    blocks: [
      { type: "paragraph", text: "التقوى من أكثر الألفاظ ورودًا في القرآن الكريم، وقد جاءت بمعانٍ متعددة تدور حول جامع واحد هو اتقاء غضب الله بامتثال أمره واجتناب نهيه." },
      { type: "heading", id: "meaning", level: 2, text: "المعنى اللغوي والاصطلاحي" },
      { type: "paragraph", text: "التقوى في اللغة من الوقاية، وهي جعل النفس في وقاية مما يُخاف ويُحذر. أما اصطلاحًا فهي امتثال أوامر الله واجتناب نواهيه عن إيمان واحتساب." },
      { type: "quote", text: "التقوى أن تعمل بطاعة الله على نور من الله ترجو ثواب الله، وأن تترك معصية الله على نور من الله تخاف عقاب الله.", attribution: "ابن مسعود رضي الله عنه" },
      { type: "heading", id: "contexts", level: 2, text: "سياقات ورود اللفظ" },
      { type: "paragraph", text: "وردت التقوى في سياقات متعددة: الأمر بها مباشرة، والثناء على أهلها، وبيان ثمارها في الدنيا والآخرة." },
      { type: "heading", id: "fruits", level: 3, text: "ثمار التقوى" },
      { type: "paragraph", text: "من أعظم ثمار التقوى: الفرقان الذي يميّز به المتقي بين الحق والباطل، والمخرج من الضيق، والرزق من حيث لا يحتسب." },
      { type: "list", ordered: false, items: ["الفرقان — القدرة على التمييز بين الحق والباطل", "المخرج من الضيق والكرب", "الرزق من حيث لا يُحتسَب"] },
      { type: "callout", variant: "info", text: "ملاحظة: هذه المقالة مثال توضيحي على نظام الكتل العام (Block System) المُوسَّع في Phase 11 — الكتلتان أعلاه وأسفله (قائمة وتنبيه) أُضيفتا لإثبات عمل ContentBody بلا أي تعديل على الصفحة العامة نفسها." },
    ],
    citations: [
      { label: "البقرة 2:153", sourceType: "quran", href: "/quran/2/153" },
      { label: "الطلاق 65:2", sourceType: "quran", href: "/quran/65/2" },
    ],
  },
  {
    id: "c2",
    kind: "article",
    slug: "etiquette-of-seeking-knowledge",
    title: "آداب طالب العلم في التراث الإسلامي",
    excerpt: "وصايا العلماء الأوائل في أخلاقيات طلب العلم الشرعي وآداب المتعلم مع معلمه ومع نفسه.",
    category: "تزكية",
    topics: ["الأخلاق", "التعليم"],
    tags: ["طلب العلم", "آداب", "تزكية"],
    author: { name: "الشيخ يوسف القرني", role: "باحث شرعي", initials: "يق" },
    publishedAt: "2026-07-05",
    readingTimeMinutes: 5,
    blocks: [
      { type: "paragraph", text: "اعتنى علماء الإسلام عناية بالغة بآداب طلب العلم، وأفردوا لها مصنفات مستقلة، إذ رأوا أن العلم بلا أدب كالجسد بلا روح." },
      { type: "heading", id: "sincerity", level: 2, text: "الإخلاص في الطلب" },
      { type: "paragraph", text: "أول ما ينبغي لطالب العلم أن يستحضره إخلاص النية لله تعالى، فلا يطلب العلم للمباهاة أو المجادلة." },
      { type: "heading", id: "teacher", level: 2, text: "أدب المتعلم مع معلمه" },
      { type: "paragraph", text: "من الآداب المؤكَّدة توقير المعلم والصبر على طول الطلب، والتدرج في العلم من الأسهل إلى الأصعب." },
    ],
    citations: [{ label: "حديث إنما الأعمال بالنيات", sourceType: "hadith", href: "/hadith/bukhari/1" }],
  },
  {
    id: "c3",
    kind: "fatwa",
    slug: "combining-prayers-illness",
    title: "حكم الجمع بين الصلاتين لعذر المرض",
    excerpt: "بيان الأدلة الشرعية لجواز الجمع بين الصلاتين للمريض الذي يشق عليه أداء كل صلاة في وقتها.",
    category: "فقه العبادات",
    topics: ["الفقه", "الصلاة"],
    tags: ["الجمع بين الصلاتين", "المرض", "رخص"],
    author: { name: "هيئة الإفتاء", role: "فتوى معتمَدة", initials: "هإ" },
    publishedAt: "2026-06-28",
    readingTimeMinutes: 4,
    blocks: [
      { type: "paragraph", text: "يجوز للمريض الذي يشق عليه أداء كل صلاة في وقتها أن يجمع بين الظهر والعصر، وبين المغرب والعشاء، تقديمًا أو تأخيرًا، دفعًا للحرج والمشقة." },
      { type: "heading", id: "evidence", level: 2, text: "الأدلة" },
      { type: "paragraph", text: "استدل الفقهاء على ذلك بعموم أدلة رفع الحرج في الشريعة، وبالقياس على جمع المسافر لاتحاد العلة وهي المشقة." },
    ],
    citations: [{ label: "الحج 22:78", sourceType: "quran", href: "/quran/22/78" }],
  },
  {
    id: "c4",
    kind: "book",
    slug: "riyad-as-salihin",
    title: "رياض الصالحين",
    excerpt: "من كلام سيد المرسلين ﷺ، للإمام النووي — أحد أشهر كتب الحديث والأخلاق في التراث الإسلامي.",
    category: "حديث",
    topics: ["الحديث", "الأخلاق"],
    tags: ["النووي", "أحاديث", "أخلاق"],
    author: { name: "الإمام النووي", role: "المؤلف", initials: "إن" },
    publishedAt: "2026-05-12",
    readingTimeMinutes: 3,
    blocks: [
      { type: "paragraph", text: "كتاب رياض الصالحين من أجمع الكتب التي تناولت الأحاديث النبوية في الآداب والأخلاق والرقائق، رتَّبه الإمام النووي على أبواب موضوعية ميسَّرة." },
      { type: "heading", id: "structure", level: 2, text: "منهج الكتاب" },
      { type: "paragraph", text: "رتَّب المؤلف الكتاب على نحو 372 بابًا، افتتح كل باب غالبًا بآيات قرآنية ثم أورد الأحاديث ذات الصلة بإسنادها المختصر." },
    ],
    citations: [],
  },
  {
    id: "c5",
    kind: "lesson",
    slug: "pillars-of-islam-lesson-1",
    title: "الدرس الأول: أركان الإسلام الخمسة",
    excerpt: "مقدمة تأسيسية لأركان الإسلام الخمسة ضمن مسار «أساسيات الإسلام للمسلم الجديد».",
    category: "عقيدة",
    topics: ["العقيدة", "المستوى: مبتدئ"],
    tags: ["أركان الإسلام", "مسلم جديد"],
    author: { name: "الشيخ عمر الفاروقي", role: "معلّم معتمَد", initials: "عف" },
    publishedAt: "2026-04-20",
    readingTimeMinutes: 8,
    blocks: [
      { type: "paragraph", text: "بُني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدًا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت لمن استطاع إليه سبيلاً." },
      { type: "heading", id: "shahadah", level: 2, text: "الركن الأول: الشهادتان" },
      { type: "paragraph", text: "الشهادتان هما مفتاح الدخول في الإسلام، وتتضمنان الإقرار بتوحيد الله ونفي الشريك عنه، والإقرار برسالة محمد ﷺ." },
    ],
    citations: [{ label: "حديث بُني الإسلام على خمس", sourceType: "hadith", href: "/hadith/bukhari/8" }],
  },
  {
    id: "c6",
    kind: "news",
    slug: "platform-adds-14-languages",
    title: "المنصة تضيف دعمًا لـ14 لغة جديدة",
    excerpt: "إعلان توسّع المنصة في دعم اللغات لتشمل مستخدمين جددًا حول العالم.",
    category: "أخبار المنصة",
    topics: ["إعلانات"],
    tags: ["لغات", "تحديث"],
    author: { name: "فريق المنصة", role: "تحرير", initials: "فم" },
    publishedAt: "2026-07-20",
    readingTimeMinutes: 2,
    blocks: [
      { type: "paragraph", text: "أعلنت المنصة اليوم عن دعم 14 لغة إضافية، في إطار خطتها للوصول إلى جمهور أوسع من المهتمين بالتعرف على الإسلام والتعليم الإسلامي حول العالم." },
    ],
    citations: [],
  },
];

export function getContentBySlug(slug: string): ContentItem | undefined {
  return mockContentItems.find((c) => c.slug === slug);
}

export function getRelatedContent(current: ContentItem, limit = 3): ContentItem[] {
  return mockContentItems
    .filter((c) => c.id !== current.id && (c.category === current.category || c.topics.some((t) => current.topics.includes(t))))
    .slice(0, limit);
}

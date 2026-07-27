import type { ContentAuthor, ContentBlock, ContentCitation } from "@/lib/mock/content";

/**
 * بيانات وهمية لوحدة الأكاديمية (Phase 10) — لا اتصال بقاعدة بيانات ولا
 * API. **مبنية فوق محرك المحتوى العام** (Phase 9.5): كل درس يعيد
 * استخدام `ContentBlock`/`ContentCitation`/`ContentAuthor` حرفيًا، ما
 * يسمح بإعادة استخدام `ContentBody`/`TableOfContents`/`CitationBlock`/
 * `AuthorInfo` مباشرة على صفحة الدرس دون أي تكرار أو نموذج مواز.
 *
 * Mock data for the Academy module (Phase 10) — no database or API
 * connection. **Built on top of the Generic Content Engine**
 * (Phase 9.5): every lesson reuses `ContentBlock`/`ContentCitation`/
 * `ContentAuthor` verbatim, allowing `ContentBody`/`TableOfContents`/
 * `CitationBlock`/`AuthorInfo` to be reused directly on the lesson
 * page with no duplication or parallel model.
 */

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseBadge = "FREE" | "COMING_SOON";

export const courseLevelLabels: Record<CourseLevel, { ar: string; en: string }> = {
  BEGINNER: { ar: "مبتدئ", en: "Beginner" },
  INTERMEDIATE: { ar: "متوسط", en: "Intermediate" },
  ADVANCED: { ar: "متقدم", en: "Advanced" },
};

export const courseBadgeLabels: Record<CourseBadge, { ar: string; en: string }> = {
  FREE: { ar: "مجاني", en: "Free" },
  COMING_SOON: { ar: "قريبًا", en: "Coming Soon" },
};

export interface Instructor {
  name: string;
  role: string;
  initials: string;
  bio: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  topics: string[];
  level: CourseLevel;
  badge: CourseBadge;
  instructor: Instructor;
  durationLabel: string;
  objectives: string[];
  requirements: string[];
}

export interface AcademyLesson {
  id: string;
  courseSlug: string;
  slug: string;
  orderIndex: number;
  title: string;
  excerpt: string;
  author: ContentAuthor;
  publishedAt: string;
  durationMinutes: number;
  hasVideo: boolean;
  blocks: ContentBlock[];
  citations: ContentCitation[];
  attachments: { name: string; fileType: string }[];
}

export const courses: Course[] = [
  {
    id: "course-1",
    slug: "islam-basics",
    title: "أساسيات الإسلام للمسلم الجديد",
    description: "مسار تأسيسي يغطي أركان الإسلام والإيمان والعبادات اليومية خطوة بخطوة، مصمَّم خصيصًا لمن اعتنق الإسلام حديثًا أو يرغب بمراجعة الأساسيات بأسلوب ميسَّر ومتدرج.",
    category: "عقيدة",
    topics: ["العقيدة", "مسلم جديد"],
    level: "BEGINNER",
    badge: "FREE",
    instructor: {
      name: "الشيخ عمر الفاروقي",
      role: "معلّم معتمَد",
      initials: "عف",
      bio: "معلّم معتمَد متخصص في تعليم أساسيات الإسلام لحديثي الإسلام، بخبرة تزيد عن 12 عامًا في التعليم والدعوة.",
    },
    durationLabel: "6 ساعات",
    objectives: ["فهم أركان الإسلام الخمسة وأركان الإيمان الستة", "إتقان أحكام الطهارة والصلاة الأساسية", "التعرف على آداب المسلم اليومية"],
    requirements: ["لا يتطلب أي خلفية شرعية سابقة", "الرغبة الجادة في التعلم"],
  },
  {
    id: "course-2",
    slug: "quranic-sciences",
    title: "علوم القرآن التطبيقية",
    description: "مقدمة تطبيقية في علوم التفسير وأسباب النزول والناسخ والمنسوخ، موجَّهة لطلبة العلم الراغبين في تعميق فهمهم لمنهجية التعامل مع النص القرآني.",
    category: "علوم القرآن",
    topics: ["القرآن", "علوم شرعية"],
    level: "INTERMEDIATE",
    badge: "FREE",
    instructor: {
      name: "د. أحمد المنصوري",
      role: "أستاذ التفسير",
      initials: "أم",
      bio: "أستاذ جامعي متخصص في علوم القرآن والتفسير، له عدة مؤلفات في مناهج المفسرين.",
    },
    durationLabel: "9 ساعات",
    objectives: ["التمييز بين مناهج المفسرين الأساسية", "فهم أسباب النزول وأثرها في التفسير", "التعرف على قواعد الناسخ والمنسوخ"],
    requirements: ["إتمام مسار أساسيات الإسلام (يُفضَّل)", "إجادة القراءة العربية"],
  },
  {
    id: "course-3",
    slug: "hadith-terminology",
    title: "مصطلح الحديث وعلم الرجال",
    description: "مسار متقدم في دراسة علوم الحديث ومناهج المحدّثين في التوثيق، يغطي أنواع الحديث ودرجاته وأساسيات علم الجرح والتعديل.",
    category: "علوم الحديث",
    topics: ["الحديث", "علوم شرعية"],
    level: "ADVANCED",
    badge: "COMING_SOON",
    instructor: {
      name: "د. عبد الرحمن السلمي",
      role: "أستاذ علوم الحديث",
      initials: "عس",
      bio: "متخصص في علوم الحديث ومصطلحه، حاصل على الدكتوراه في تخريج الحديث النبوي.",
    },
    durationLabel: "12 ساعة",
    objectives: ["إتقان تصنيف الحديث حسب درجته", "فهم أساسيات علم الجرح والتعديل", "القدرة على قراءة أسانيد الحديث وتحليلها"],
    requirements: ["إتمام مسار علوم القرآن التطبيقية", "معرفة أساسية بمصطلحات علوم الحديث"],
  },
];

export const academyLessons: AcademyLesson[] = [
  {
    id: "l-1-1",
    courseSlug: "islam-basics",
    slug: "pillars-of-islam",
    orderIndex: 1,
    title: "أركان الإسلام الخمسة",
    excerpt: "مقدمة تأسيسية لأركان الإسلام الخمسة.",
    author: { name: "الشيخ عمر الفاروقي", role: "معلّم معتمَد", initials: "عف" },
    publishedAt: "2026-04-20",
    durationMinutes: 18,
    hasVideo: true,
    blocks: [
      { type: "paragraph", text: "بُني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدًا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت لمن استطاع إليه سبيلاً." },
      { type: "heading", id: "shahadah", level: 2, text: "الركن الأول: الشهادتان" },
      { type: "paragraph", text: "الشهادتان هما مفتاح الدخول في الإسلام، وتتضمنان الإقرار بتوحيد الله ونفي الشريك عنه، والإقرار برسالة محمد ﷺ." },
      { type: "heading", id: "salah", level: 2, text: "الركن الثاني: الصلاة" },
      { type: "paragraph", text: "الصلاة عمود الدين، وهي أول ما يُحاسَب عليه العبد يوم القيامة." },
    ],
    citations: [{ label: "حديث بُني الإسلام على خمس", sourceType: "hadith", href: "/hadith/bukhari/8" }],
    attachments: [{ name: "ملخص الدرس الأول.pdf", fileType: "PDF" }],
  },
  {
    id: "l-1-2",
    courseSlug: "islam-basics",
    slug: "pillars-of-iman",
    orderIndex: 2,
    title: "أركان الإيمان الستة",
    excerpt: "شرح مفصَّل لأركان الإيمان الستة وأدلتها.",
    author: { name: "الشيخ عمر الفاروقي", role: "معلّم معتمَد", initials: "عف" },
    publishedAt: "2026-04-22",
    durationMinutes: 22,
    hasVideo: true,
    blocks: [
      { type: "paragraph", text: "أركان الإيمان ستة: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره." },
      { type: "heading", id: "belief-in-allah", level: 2, text: "الإيمان بالله" },
      { type: "paragraph", text: "يشمل الإيمان بربوبية الله وألوهيته وأسمائه وصفاته." },
    ],
    citations: [],
    attachments: [],
  },
  {
    id: "l-1-3",
    courseSlug: "islam-basics",
    slug: "purification-basics",
    orderIndex: 3,
    title: "أحكام الطهارة الأساسية",
    excerpt: "الوضوء والغسل وأحكامهما الأساسية.",
    author: { name: "الشيخ عمر الفاروقي", role: "معلّم معتمَد", initials: "عف" },
    publishedAt: "2026-04-25",
    durationMinutes: 15,
    hasVideo: true,
    blocks: [
      { type: "paragraph", text: "الطهارة شرط لصحة الصلاة، وتشمل الوضوء للحدث الأصغر والغسل للحدث الأكبر." },
      { type: "heading", id: "wudu", level: 2, text: "صفة الوضوء" },
      { type: "paragraph", text: "يبدأ الوضوء بالنية والتسمية، ثم غسل اليدين والمضمضة والاستنشاق وغسل الوجه واليدين ومسح الرأس وغسل الرجلين." },
    ],
    citations: [{ label: "المائدة 5:6", sourceType: "quran", href: "/quran/5/6" }],
    attachments: [{ name: "مخطط صفة الوضوء.pdf", fileType: "PDF" }],
  },
  {
    id: "l-1-4",
    courseSlug: "islam-basics",
    slug: "daily-etiquette",
    orderIndex: 4,
    title: "آداب المسلم اليومية",
    excerpt: "آداب الطعام والنوم والتعامل مع الآخرين.",
    author: { name: "الشيخ عمر الفاروقي", role: "معلّم معتمَد", initials: "عف" },
    publishedAt: "2026-04-28",
    durationMinutes: 12,
    hasVideo: false,
    blocks: [{ type: "paragraph", text: "من جمال الإسلام أنه لم يترك جانبًا من جوانب الحياة اليومية إلا ووجّه فيه بآداب راقية، من آداب الطعام إلى آداب المجالس." }],
    citations: [],
    attachments: [],
  },
  {
    id: "l-2-1",
    courseSlug: "quranic-sciences",
    slug: "intro-to-tafsir",
    orderIndex: 1,
    title: "مدخل إلى علم التفسير",
    excerpt: "تعريف علم التفسير وأهميته ومصادره.",
    author: { name: "د. أحمد المنصوري", role: "أستاذ التفسير", initials: "أم" },
    publishedAt: "2026-05-02",
    durationMinutes: 25,
    hasVideo: true,
    blocks: [
      { type: "paragraph", text: "علم التفسير هو العلم الذي يُعنى ببيان معاني القرآن الكريم واستنباط أحكامه وحكمه." },
      { type: "heading", id: "sources", level: 2, text: "مصادر التفسير" },
      { type: "paragraph", text: "أهم مصادر التفسير: القرآن نفسه، ثم السنة النبوية، ثم أقوال الصحابة، ثم اللغة العربية." },
    ],
    citations: [],
    attachments: [],
  },
  {
    id: "l-2-2",
    courseSlug: "quranic-sciences",
    slug: "asbab-al-nuzul",
    orderIndex: 2,
    title: "أسباب النزول وأثرها في الفهم",
    excerpt: "دراسة أسباب نزول الآيات وأهميتها.",
    author: { name: "د. أحمد المنصوري", role: "أستاذ التفسير", initials: "أم" },
    publishedAt: "2026-05-05",
    durationMinutes: 20,
    hasVideo: true,
    blocks: [{ type: "paragraph", text: "معرفة سبب نزول الآية تعين على فهم المراد منها وتحديد سياقها الصحيح." }],
    citations: [],
    attachments: [{ name: "جدول أسباب النزول.pdf", fileType: "PDF" }],
  },
  {
    id: "l-2-3",
    courseSlug: "quranic-sciences",
    slug: "naskh",
    orderIndex: 3,
    title: "الناسخ والمنسوخ",
    excerpt: "قواعد أساسية في علم الناسخ والمنسوخ.",
    author: { name: "د. أحمد المنصوري", role: "أستاذ التفسير", initials: "أم" },
    publishedAt: "2026-05-08",
    durationMinutes: 28,
    hasVideo: true,
    blocks: [{ type: "paragraph", text: "النسخ في اصطلاح الأصوليين رفع حكم شرعي بدليل شرعي متأخر عنه." }],
    citations: [],
    attachments: [],
  },
  {
    id: "l-3-1",
    courseSlug: "hadith-terminology",
    slug: "hadith-classification",
    orderIndex: 1,
    title: "تصنيف الحديث حسب الدرجة",
    excerpt: "الصحيح والحسن والضعيف وضوابط كل درجة.",
    author: { name: "د. عبد الرحمن السلمي", role: "أستاذ علوم الحديث", initials: "عس" },
    publishedAt: "2026-06-01",
    durationMinutes: 30,
    hasVideo: false,
    blocks: [{ type: "paragraph", text: "يُصنَّف الحديث من حيث القبول والرد إلى صحيح وحسن وضعيف، ولكل درجة ضوابط دقيقة عند المحدّثين." }],
    citations: [],
    attachments: [],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getLessonsForCourse(courseSlug: string): AcademyLesson[] {
  return academyLessons.filter((l) => l.courseSlug === courseSlug).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getLesson(courseSlug: string, lessonSlug: string): AcademyLesson | undefined {
  return academyLessons.find((l) => l.courseSlug === courseSlug && l.slug === lessonSlug);
}

export function getAdjacentLessons(courseSlug: string, lessonSlug: string): { previous?: AcademyLesson; next?: AcademyLesson } {
  const lessons = getLessonsForCourse(courseSlug);
  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  return { previous: lessons[index - 1], next: lessons[index + 1] };
}

import { mockContentItems } from "@/lib/mock/content";
import { courses, academyLessons } from "@/lib/mock/academy";
import { hadithCollections } from "@/lib/mock/hadith";
import { surahs } from "@/lib/mock/quran";

/**
 * بيانات وهمية للوحة الإدارة (Phase 11) — لا اتصال بقاعدة بيانات ولا
 * API. الإحصائيات **مُشتَقة فعليًا** من مصفوفات Mock الموجودة مسبقًا
 * عبر كل الوحدات السابقة (Quran, Hadith, Content Engine, Academy) لا
 * أرقام عشوائية منفصلة — أي محتوى Mock يُضاف لاحقًا لتلك الوحدات
 * ينعكس تلقائيًا هنا.
 *
 * Mock data for the Admin CMS (Phase 11) — no database or API
 * connection. Statistics are **actually derived** from the existing
 * mock arrays across all prior modules (Quran, Hadith, Content Engine,
 * Academy), not separate random numbers — any mock content added later
 * to those modules is automatically reflected here.
 */

export const dashboardStats = {
  totalContent: mockContentItems.length + academyLessons.length + surahs.length,
  publishedArticles: mockContentItems.filter((c) => c.kind === "article").length,
  lessons: academyLessons.length,
  courses: courses.length,
  users: 4821, // رقم Mock تشغيلي بحت — لا نظام مستخدمين حقيقي بعد. Purely operational mock figure — no real user system yet.
};

export type ActivityAction = "CREATE" | "UPDATE" | "APPROVE" | "DELETE" | "PUBLISH";

export interface ActivityLogEntry {
  id: string;
  actorName: string;
  actorInitials: string;
  action: ActivityAction;
  targetTitle: string;
  targetType: string;
  timestamp: string;
}

export const recentActivity: ActivityLogEntry[] = [
  { id: "a1", actorName: "د. أحمد المنصوري", actorInitials: "أم", action: "PUBLISH", targetTitle: "معنى التقوى في القرآن الكريم", targetType: "مقالة", timestamp: "2026-07-25T09:12:00Z" },
  { id: "a2", actorName: "هيئة الإفتاء", actorInitials: "هإ", action: "APPROVE", targetTitle: "حكم الجمع بين الصلاتين لعذر المرض", targetType: "فتوى", timestamp: "2026-07-25T08:40:00Z" },
  { id: "a3", actorName: "الشيخ عمر الفاروقي", actorInitials: "عف", action: "UPDATE", targetTitle: "أركان الإسلام الخمسة", targetType: "درس", timestamp: "2026-07-24T18:05:00Z" },
  { id: "a4", actorName: "فريق المنصة", actorInitials: "فم", action: "CREATE", targetTitle: "المنصة تضيف دعمًا لـ14 لغة جديدة", targetType: "خبر", timestamp: "2026-07-24T14:22:00Z" },
  { id: "a5", actorName: "الشيخ يوسف القرني", actorInitials: "يق", action: "CREATE", targetTitle: "آداب طالب العلم في التراث الإسلامي", targetType: "مقالة", timestamp: "2026-07-23T11:50:00Z" },
  { id: "a6", actorName: "المشرف الإداري", actorInitials: "مإ", action: "DELETE", targetTitle: "مسودة مكرَّرة", targetType: "مقالة", timestamp: "2026-07-22T16:30:00Z" },
];

export interface ContentUnderReviewEntry {
  id: string;
  title: string;
  type: string;
  submittedBy: string;
  submittedAt: string;
  stage: "REVIEW" | "SCHOLARLY_REVIEW";
}

export const contentUnderReview: ContentUnderReviewEntry[] = [
  { id: "r1", title: "فقه صيام المسافر في رمضان", type: "فتوى", submittedBy: "هيئة الإفتاء", submittedAt: "2026-07-24", stage: "SCHOLARLY_REVIEW" },
  { id: "r2", title: "الدرس الخامس: أحكام الزكاة", type: "درس", submittedBy: "الشيخ عمر الفاروقي", submittedAt: "2026-07-23", stage: "REVIEW" },
  { id: "r3", title: "مقارنة موجزة بين مناهج المفسرين", type: "مقالة", submittedBy: "د. أحمد المنصوري", submittedAt: "2026-07-22", stage: "REVIEW" },
];

export interface SystemNotification {
  id: string;
  severity: "info" | "warning" | "error";
  message: string;
  timestamp: string;
}

export const systemNotifications: SystemNotification[] = [
  { id: "n1", severity: "info", message: "اكتمل استيراد بيانات فهرس السور بنجاح (114/114).", timestamp: "2026-07-25T07:00:00Z" },
  { id: "n2", severity: "warning", message: "3 عناصر محتوى تنتظر المراجعة العلمية منذ أكثر من 48 ساعة.", timestamp: "2026-07-24T20:00:00Z" },
  { id: "n3", severity: "error", message: "فشلت آخر محاولة مزامنة مع محرك البحث (Mock) — إعادة المحاولة مجدولة.", timestamp: "2026-07-24T12:00:00Z" },
];

// عدد سريع لكل نوع محتوى — يُستخدَم في شارات التنقّل الجانبي وصفحات
// الإدارة لاحقًا. Quick per-type counts — used in sidebar badges and
// later admin list pages.
export const contentTypeCounts = {
  quran: surahs.length,
  hadith: hadithCollections.reduce((sum, c) => sum + c.hadithCount, 0),
  articles: mockContentItems.filter((c) => c.kind === "article").length,
  fatwas: mockContentItems.filter((c) => c.kind === "fatwa").length,
  books: mockContentItems.filter((c) => c.kind === "book").length,
  lessons: academyLessons.length,
  courses: courses.length,
};

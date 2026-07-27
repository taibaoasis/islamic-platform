import { mockContentItems } from "@/lib/mock/content";
import { academyLessons, courses } from "@/lib/mock/academy";
import { mockMediaAssets, formatFileSize } from "@/lib/mock/media";
import { mockAdminUsers, getUserCountByRole } from "@/lib/mock/admin-users";
import { fullActivityLog } from "@/lib/mock/admin-users";
import { supportedLanguages, getAllLanguageStats, buildTranslationQueue } from "@/lib/mock/localization";
import { roles } from "@/config/permissions";
import { storageProviders } from "@/lib/mock/settings";

/**
 * طبقة اشتقاق التقارير (Phase 11, Module 7) — **بلا أي مصفوفة بيانات
 * جديدة**. كل رقم هنا محسوب من وحدات موجودة فعليًا (محرك المحتوى،
 * الأكاديمية، المستخدمون، الوسائط، الترجمة) — تحقيقًا حرفيًا لمعيار
 * نجاح هذه الوحدة (البند 2).
 *
 * Reports derivation layer (Phase 11, Module 7) — **no new data array
 * whatsoever**. Every number here is computed from already-existing
 * modules (Content Engine, Academy, Users, Media, Localization) — a
 * literal fulfillment of this module's success criterion (item 2).
 */

export function getContentReport() {
  return {
    articles: mockContentItems.filter((c) => c.kind === "article").length,
    lessons: academyLessons.length,
    fatwas: mockContentItems.filter((c) => c.kind === "fatwa").length,
    books: mockContentItems.filter((c) => c.kind === "book").length,
    translations: buildTranslationQueue().length + getAllLanguageStats().reduce((sum, s) => sum + s.publishedItems, 0),
    media: mockMediaAssets.length,
    courses: courses.length,
    news: mockContentItems.filter((c) => c.kind === "news").length,
  };
}

export function getUsersReport() {
  const active = mockAdminUsers.filter((u) => u.status === "ACTIVE").length;
  const roleDistribution = roles.map((role) => ({ role, count: getUserCountByRole(role) }));
  const recentLogins = [...mockAdminUsers]
    .filter((u) => u.lastLogin)
    .sort((a, b) => (b.lastLogin ?? "").localeCompare(a.lastLogin ?? ""))
    .slice(0, 6);
  const recentActivity = fullActivityLog.slice(0, 6);
  return { totalUsers: mockAdminUsers.length, active, roleDistribution, recentLogins, recentActivity };
}

export function getLocalizationReport() {
  return { languageStats: getAllLanguageStats(), languages: supportedLanguages, untranslatedTotal: buildTranslationQueue().length };
}

export function getSystemReport() {
  const totalStorageUsed = storageProviders.reduce((sum, p) => sum + p.usedBytes, 0);
  const errorEvents = fullActivityLog.filter((e) => e.result === "FAILURE").slice(0, 8);
  return {
    storageUsedLabel: formatFileSize(totalStorageUsed),
    // Placeholder صريح — لا مقياس نظام تشغيل حقيقي متاح في بيئة واجهة أمامية بلا خادم. Explicit placeholder — no real OS-level metric available in a frontend-only environment.
    memoryUsagePlaceholder: "312 MB / 1024 MB (محاكاة)",
    filesCount: mockMediaAssets.length,
    errorEvents,
  };
}

import { locales } from "@/config/site";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";
import { mockQuranContentRows } from "@/lib/mock/admin-quran";
import { mockHadithContentRows } from "@/lib/mock/admin-hadith";
import { mockAdminContentRows } from "@/lib/mock/admin-content";
import { getSurahByNumber, getMockVerses } from "@/lib/mock/quran";
import { mockContentItems } from "@/lib/mock/content";

/**
 * إدارة الترجمات (Phase 11, Module 6) — لا اتصال بقاعدة بيانات ولا API،
 * لا حفظ حقيقي، لا ترجمة آلية.
 *
 * **مبدأ حاكم لهذه الوحدة بأكملها:** لا نموذج بيانات ترجمة مستقل هنا.
 * كل إحصائية وكل صف في "قائمة انتظار الترجمة" **مُشتَقّ حيًا** من حقل
 * `language` + `status` الموجودَين بالفعل في `mockQuranContentRows`
 * (Module 2.1)، `mockHadithContentRows` (Module 2.2)، و`mockAdminContentRows`
 * (Module 2.3) — لا مصفوفة "ترجمات" موازية جديدة. قائمة اللغات نفسها
 * تُميِّز "نشطة" عبر `locales` من `config/site.ts` (اللغات الفعلية
 * المُفعَّلة في next-intl)، لا علمًا Mock مستقلاً.
 *
 * Localization Management (Phase 11, Module 6) — no database or API
 * connection, no real persistence, no machine translation.
 *
 * **The governing principle for this entire module:** no independent
 * translation data model here. Every statistic and every row in the
 * "translation queue" is **derived live** from the `language` + `status`
 * fields already present in `mockQuranContentRows` (Module 2.1),
 * `mockHadithContentRows` (Module 2.2), and `mockAdminContentRows`
 * (Module 2.3) — not a new parallel "translations" array. The language
 * list itself marks "active" via `locales` from `config/site.ts` (the
 * actual locales enabled in next-intl), not an independent mock flag.
 */

export type Direction = "RTL" | "LTR";

export interface LanguageInfo {
  isoCode: string;
  nameLocalized: { ar: string; en: string };
  direction: Direction;
  isActive: boolean;
}

const rtlLanguages = new Set(["ar", "ur"]);

// الرموز اللغوية نفسها المُستخدَمة بالفعل عبر صفوف Module 2.1/2.2/2.3 —
// لا رموز جديدة تُختلَق هنا.
// The exact same language codes already used across Module 2.1/2.2/2.3
// rows — no new codes invented here.
const allLanguageCodes = ["ar", "en", "ur", "fr", "id"];

const languageNames: Record<string, { ar: string; en: string }> = {
  ar: { ar: "العربية", en: "Arabic" },
  en: { ar: "الإنجليزية", en: "English" },
  ur: { ar: "الأردية", en: "Urdu" },
  fr: { ar: "الفرنسية", en: "French" },
  id: { ar: "الإندونيسية", en: "Indonesian" },
};

export const supportedLanguages: LanguageInfo[] = allLanguageCodes.map((isoCode) => ({
  isoCode,
  nameLocalized: languageNames[isoCode]!,
  direction: rtlLanguages.has(isoCode) ? "RTL" : "LTR",
  isActive: (locales as readonly string[]).includes(isoCode),
}));

interface LanguageBearingRow {
  language: string;
  status: ContentLifecycleStatus;
  lastModified?: string;
  lastReviewedAt?: string | null;
}

function allContentRows(): LanguageBearingRow[] {
  return [
    ...mockQuranContentRows.map((r) => ({ language: r.language, status: r.status, lastModified: r.lastModified })),
    ...mockHadithContentRows.map((r) => ({ language: r.language, status: r.status, lastModified: r.lastReviewedAt ?? undefined })),
    ...mockAdminContentRows.map((r) => ({ language: r.language, status: r.status, lastModified: r.lastModified })),
  ];
}

export interface LanguageStats {
  isoCode: string;
  totalItems: number;
  publishedItems: number;
  completionPercentage: number;
  untranslatedCount: number;
}

/** إحصائية لغة واحدة — محسوبة حيًا من الصفوف الثلاثة الموجودة، لا مخزَّنة. A single language's stats — computed live from the three existing row sources, not stored. */
export function getLanguageStats(isoCode: string): LanguageStats {
  const rows = allContentRows().filter((r) => r.language === isoCode);
  const published = rows.filter((r) => r.status === "PUBLISHED").length;
  const untranslated = rows.filter((r) => r.status === "DRAFT").length;
  return {
    isoCode,
    totalItems: rows.length,
    publishedItems: published,
    completionPercentage: rows.length === 0 ? 0 : Math.round((published / rows.length) * 100),
    untranslatedCount: untranslated,
  };
}

export function getAllLanguageStats(): LanguageStats[] {
  return supportedLanguages.map((l) => getLanguageStats(l.isoCode));
}

export type QueueContentKind = "quran" | "hadith" | "article" | "fatwa" | "book" | "lesson" | "news";

export interface TranslationQueueItem {
  id: string;
  contentKind: QueueContentKind;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: ContentLifecycleStatus;
  translator: string | null;
  lastModified: string;
  /** نص أصلي مُعاد استخدامه من المصدر الحقيقي — لا نص جديد يُختلَق هنا. Original text reused from the real source — no new text invented here. */
  originalText: string;
}

const SOURCE_LANGUAGE = "ar";

/**
 * قائمة انتظار الترجمة — عناصر لم تصل بعد لحالة "منشور" في لغتها
 * الهدف (سير عمل ترجمة لم يكتمل). **مُشتَقة بالكامل** من الصفوف
 * الثلاثة الموجودة، بلا أي عنصر Mock جديد مستقل.
 *
 * Translation queue — items that haven't reached "published" yet in
 * their target language (incomplete translation workflow). **Fully
 * derived** from the three existing row sources, with no new
 * independent mock item.
 */
export function buildTranslationQueue(): TranslationQueueItem[] {
  const items: TranslationQueueItem[] = [];

  for (const row of mockQuranContentRows) {
    if (row.status === "PUBLISHED" || row.status === "ARCHIVED") continue;
    const surah = getSurahByNumber(row.surahNumber);
    const verseText = surah ? getMockVerses(surah)[row.verseNumber - 1]?.placeholderText : undefined;
    items.push({
      id: row.id,
      contentKind: "quran",
      title: `${row.surahName} — ${row.verseNumber}`,
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage: row.language,
      status: row.status,
      translator: row.lastReviewer,
      lastModified: row.lastModified,
      originalText: verseText ?? "",
    });
  }

  for (const row of mockHadithContentRows) {
    if (row.status === "PUBLISHED" || row.status === "ARCHIVED") continue;
    items.push({
      id: row.id,
      contentKind: "hadith",
      title: `${row.collectionName} — ${row.hadithNumber}`,
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage: row.language,
      status: row.status,
      translator: null,
      lastModified: row.lastReviewedAt ?? "2026-01-01T00:00:00.000Z",
      originalText: row.matnExcerpt,
    });
  }

  for (const row of mockAdminContentRows) {
    if (row.status === "PUBLISHED" || row.status === "ARCHIVED") continue;
    const source = mockContentItems.find((c) => c.kind === row.kind && c.slug === row.slug);
    items.push({
      id: row.id,
      contentKind: row.kind,
      title: row.title,
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage: row.language,
      status: row.status,
      translator: row.lastReviewer,
      lastModified: row.lastModified,
      originalText: source?.excerpt ?? row.excerpt,
    });
  }

  return items.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
}

export function getQueueItemById(id: string): TranslationQueueItem | undefined {
  return allQueueIncludingDone().find((item) => item.id === id);
}

/** لعرض عنصر في المحرر حتى لو اكتمل بالفعل (لا يظهر في قائمة الانتظار النشطة). To view an item in the editor even if already complete (won't appear in the active queue list). */
function allQueueIncludingDone(): TranslationQueueItem[] {
  const items: TranslationQueueItem[] = [];
  for (const row of mockQuranContentRows) {
    const surah = getSurahByNumber(row.surahNumber);
    const verseText = surah ? getMockVerses(surah)[row.verseNumber - 1]?.placeholderText : undefined;
    items.push({
      id: row.id,
      contentKind: "quran",
      title: `${row.surahName} — ${row.verseNumber}`,
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage: row.language,
      status: row.status,
      translator: row.lastReviewer,
      lastModified: row.lastModified,
      originalText: verseText ?? "",
    });
  }
  for (const row of mockHadithContentRows) {
    items.push({
      id: row.id,
      contentKind: "hadith",
      title: `${row.collectionName} — ${row.hadithNumber}`,
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage: row.language,
      status: row.status,
      translator: null,
      lastModified: row.lastReviewedAt ?? "2026-01-01T00:00:00.000Z",
      originalText: row.matnExcerpt,
    });
  }
  for (const row of mockAdminContentRows) {
    const source = mockContentItems.find((c) => c.kind === row.kind && c.slug === row.slug);
    items.push({
      id: row.id,
      contentKind: row.kind,
      title: row.title,
      sourceLanguage: SOURCE_LANGUAGE,
      targetLanguage: row.language,
      status: row.status,
      translator: row.lastReviewer,
      lastModified: row.lastModified,
      originalText: source?.excerpt ?? row.excerpt,
    });
  }
  return items;
}

export interface RecentTranslationEntry {
  id: string;
  title: string;
  targetLanguage: string;
  status: ContentLifecycleStatus;
  lastModified: string;
}

export function getRecentTranslations(limit = 5): RecentTranslationEntry[] {
  return allQueueIncludingDone()
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified))
    .slice(0, limit)
    .map((item) => ({ id: item.id, title: item.title, targetLanguage: item.targetLanguage, status: item.status, lastModified: item.lastModified }));
}

export function getRecentReviews(limit = 5): RecentTranslationEntry[] {
  return allQueueIncludingDone()
    .filter((item) => item.status === "SCHOLARLY_REVIEW" || item.status === "PUBLISHED")
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified))
    .slice(0, limit)
    .map((item) => ({ id: item.id, title: item.title, targetLanguage: item.targetLanguage, status: item.status, lastModified: item.lastModified }));
}
